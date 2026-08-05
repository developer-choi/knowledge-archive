// digest 전 문장 해설 강제 — 커버리지 검사 순수 로직 (I/O 없음).
//
// digest 스킬 §1은 붙여넣은 단락의 모든 문장을 `>` 블록쿼트로 verbatim 인용하게 강제한다.
// 그 덕분에 원문 문장이 해설 출력에 그대로 박히므로, LLM 없이 순수 문자열 커버리지 검사로
// "모든 원문 문장이 인용됐나"를 잴 수 있다. 단어 집합 검사는 인접성을 무시해 문장 누락을
// 못 잡으므로, 연속 N단어 조각(n-gram)이 출력에 붙은 채로 존재하는지로 검사한다.
//
// 이 파일은 순수 함수만 담아 테스트 대상이 된다. stdin·transcript I/O는 래퍼
// enforce-digest-coverage.mjs가 담당한다. 원본은 local/hooks/ — .claude/hooks/ 산출물
// 직접수정 금지(sync:local-system이 배포).

const DEFAULT_N = 6; // 조각 길이. 4는 우연 겹침 통과, 8은 미세 표현차에 예민 → 6.
const DEFAULT_SEG_THRESHOLD = 0.6; // 세그먼트가 이 비율 미만으로 커버되면 "인용 안 됨".

// 원문·출력 공통 정규화: 소문자화, 스마트따옴표/대시→ASCII, 마크다운 마커·구두점 제거,
// 공백 collapse. 원문과 출력에 같은 정규화를 적용하므로 미세 표기차(따옴표 종류 등)는 상쇄된다.
function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[–—―]/g, '-')
    .replace(/[>*_`#]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTokens(text) {
  const n = normalize(text);
  return n ? n.split(' ') : [];
}

// HTML 페이지 → 검사용 평문. 세 가지를 처리한다.
// ① script·style 블록 제거 — 페이지 스크립트의 HEADS 배열에 원문 앞 60자가 들어 있어,
//    카드 없이 HEADS만 있는 페이지가 짧은 문장을 커버된 것으로 통과시킬 수 있다.
// ② 태그 제거 — `struct<strong>ure` 같은 삽입이 단어를 끊는 것을 막는다.
// ③ 엔티티 복원 — `&`는 HTML에 `&amp;`로 써야 하는데, 정규화가 기호를 지우면 'amp'라는
//    없는 단어가 문장 한가운데 끼어 조각(n-gram)이 끊긴다. 제대로 담은 문장이 누락으로
//    잡히는 오탐의 원인이라 복원 후 검사한다.
function htmlToText(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp|#38|#x26);/gi, '&')
    .replace(/&(?:lt|#60|#x3c);/gi, '<')
    .replace(/&(?:gt|#62|#x3e);/gi, '>')
    .replace(/&(?:quot|#34|#x22);/gi, '"')
    .replace(/&(?:apos|#39|#x27);/gi, "'")
    .replace(/&(?:nbsp|#160|#xa0);/gi, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

// a의 조각(n-gram) 중 b에 들어 있는 비율. 참고용 재붙여넣기 판별에 쓴다 — 같은 세션에서
// 이미 검사한 원문과 사실상 같은 글이면 새 해설 대상이 아니다.
function overlapRatio(a, b, n = DEFAULT_N) {
  const grams = ngrams(normalizeTokens(a), n);
  if (!grams.length) return 0;
  const set = buildNgramSet(normalizeTokens(b), n);
  let hit = 0;
  for (const g of grams) if (set.has(g)) hit += 1;
  return hit / grams.length;
}

// 제외 규칙(사용자 합의): 코드블록·테이블. alt text/캡션은 결정론적 완전검출이 어려워
// 세그먼트 커버리지 임계로 흡수한다.
function stripExcluded(text) {
  // 펜스 코드블록 제거.
  let t = String(text).replace(/```[\s\S]*?```/g, '\n');
  // 테이블/표 행 제거: 한 줄에 2칸 이상 공백 런(또는 탭)이 2개 이상 = 컬럼 구분 = 표.
  // 붙여넣은 `Days Left  Pass%  Notes` TSV, `Stage/Value Added`, `Unit/End-toEnd` 비교표 등.
  t = t
    .split('\n')
    .filter((line) => (line.match(/( {2,}|\t)/g) || []).length < 2)
    .join('\n');
  return t;
}

// 문장(세그먼트) 분할. 줄바꿈 + 문장부호(. ? ! 뒤 공백+대문자/따옴표)로 관대하게 나눈다.
// 과분할은 무해하다(더 짧은 세그먼트가 될 뿐). 세그먼트 내부에서만 조각을 만들어야 하므로
// (출력은 문장 사이에 한글 해설을 끼운다) 블록 전체 연속 슬라이딩을 피한다.
function splitSegments(text) {
  const segments = [];
  for (const rawLine of String(text).split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    for (const part of line.split(/(?<=[.?!])\s+(?=["'A-Z])/)) {
      const seg = part.trim();
      if (seg) segments.push(seg);
    }
  }
  return segments;
}

function ngrams(tokens, n) {
  const out = [];
  for (let i = 0; i + n <= tokens.length; i += 1) out.push(tokens.slice(i, i + n).join(' '));
  return out;
}

function buildNgramSet(tokens, n) {
  return new Set(ngrams(tokens, n));
}

// 문장으로 볼 세그먼트인가. content 세그먼트 = 토큰 수 ≥ n AND 종결부호(. ? !)로 끝남.
// 종결부호 조건은 헤딩·리드인(콜론으로 끝나는 도입구)을 걸러낸다 — digest 해설은 헤딩을
// 블록쿼트로 인용하지 않고 자기 소제목으로 옮기므로, 헤딩을 검사 대상에 넣으면 false-block이
// 난다. 실제 본문 문장은 모두 종결부호로 끝나므로 이 조건이 안전하게 헤딩만 제거한다.
function isContentSegment(seg, minTokens) {
  if (normalizeTokens(seg).length < minTokens) return false;
  return /[.?!]["')\]]?$/.test(seg.trim());
}

// 커버리지 리포트. content 세그먼트만 검사한다. 섹션 통째 누락은 그 안의 문장들이 다수
// 걸리므로 확실히 잡힌다. 짧은 조각·헤딩·수사적 단문은 오탐만 늘리므로 건너뛴다.
function coverageReport(sourceText, outputText, opts = {}) {
  const n = opts.n || DEFAULT_N;
  const segThreshold = opts.segThreshold ?? DEFAULT_SEG_THRESHOLD;
  const minTokens = opts.minTokens || n;

  const segments = splitSegments(stripExcluded(sourceText));
  const outSet = buildNgramSet(normalizeTokens(outputText), n);

  const missingSegments = [];
  let contentSegs = 0; // 검사 대상(content) 세그먼트 수.
  let anyCovered = false; // 그중 하나라도 조금이라도 인용됐나.
  for (const seg of segments) {
    if (!isContentSegment(seg, minTokens)) continue;
    const tokens = normalizeTokens(seg);
    const grams = ngrams(tokens, n);
    if (grams.length === 0) continue;
    contentSegs += 1;
    let hit = 0;
    for (const g of grams) if (outSet.has(g)) hit += 1;
    const coverage = hit / grams.length;
    if (coverage > 0) anyCovered = true;
    if (coverage < segThreshold) missingSegments.push({ text: seg, coverage });
  }

  // 오탐 ① 조기검사 가드: 검사할 content 세그먼트가 있는데 단 하나도 인용되지 않았다면
  // (전 세그먼트 0% 커버리지) 해설이 아직 화면에 다 써지기 전에 훅이 트랜스크립트를 읽은
  // 조기 검사로 본다. 응답은 위→아래로 선형으로 써지므로, 도입만 flush되고 영어 블록쿼트가
  // 아직 안 써진 순간에 전량 0%가 나온다. 진짜 타깃(일부만 해설하고 나머지 미룸)은 항상
  // 일부 문장을 인용하므로 전량 0%가 될 수 없다 → 전량 0%는 "미완성 출력" 신호이므로 block하지 않는다.
  if (contentSegs > 0 && !anyCovered) {
    return { missingSegments: [], blocked: false, incomplete: true };
  }

  return { missingSegments, blocked: missingSegments.length > 0 };
}

export {
  DEFAULT_N,
  DEFAULT_SEG_THRESHOLD,
  normalize,
  normalizeTokens,
  htmlToText,
  overlapRatio,
  stripExcluded,
  splitSegments,
  isContentSegment,
  ngrams,
  buildNgramSet,
  coverageReport,
};
