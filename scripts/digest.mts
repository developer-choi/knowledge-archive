/**
 * digest 스킬이 판단 없이 정해지는 일을 맡는 CLI. 손으로 하면 한 단계만 빠져도 조용히 틀리는 것들이다.
 *
 * - slug: 손으로 바꾸면 끝 `/`·확장자·camelCase에서 값이 갈려, compact 뒤 다시 만든 slug가 다른 파일을 가리킨다.
 * - refs: ON의 겹침 찾기에서 출처 URL이 걸린 knowledge 파일을 찾는다. Reference는 같은 페이지를
 *   `#앵커`·끝 `/`·`www.`를 붙여 적어 두기도 해서, 손으로 깎다 한 단계만 빠지면 0건으로 조용히 넘어간다.
 * - page·has: 붙여넣은 단락과 저장한 Official Answer가 출처 페이지 원문에 글자 그대로 있는지 대조한다. WebFetch는 작은 모델이
 *   요약한 답을 돌려줘 원문 대조에 못 쓰고, Official Answer는 원문 그대로여야 한다.
 * - 질문 로그(reset·append·read): 세션 중 사용자가 채팅으로 물은 것을 OFF의 explained 생성 재료로 모은다.
 *   비우는 쪽(ON)·쓰는 쪽(순회~OFF)·읽는 쪽(OFF explained 생성)이 경로를 저마다 손으로 만들면 slug 하나만
 *   어긋나도 OFF가 빈 로그를 조용히 읽는다.
 *
 * Usage:
 *   npm run --silent digest -- slug <URL>
 *   npm run --silent digest -- refs <URL>     # 걸린 knowledge 파일 경로를 한 줄씩
 *   npm run --silent digest -- page <URL>     # 원문을 tmp에 저장. JS로 그리는 페이지라 본문이 없으면 exit 1
 *   npm run --silent digest -- has <URL> [--md] <<'P'    # 문장마다 O/X, X면 가장 가까운 원문 문장. 하나라도 X면 exit 1
 *   <붙여넣은 단락, 또는 --md로 knowledge의 OA 마크다운>
 *   P
 *   npm run --silent digest -- image <URL>    # 다이어그램 이미지를 tmp에 받아 경로를 낸다
 *   npm run --silent digest -- reset <slug>
 *   npm run --silent digest -- append <slug> <<'LOG'
 *   <대상>
 *   <무엇을 헷갈렸나>
 *   <어떻게 풀어줬나>
 *   LOG
 *   npm run --silent digest -- read <slug>   # 로그가 없으면 exit 1
 *   npm run --silent digest -- gloss <slug> <URL> <<'S'   # 회차를 기록하고 Gemini 카드를 받는다 → {round, cards}
 *   ["문장1", "문장2"]
 *   S
 *   npm run --silent digest -- select <slug> <<'J'   # 페이지에서 복사한 선택 JSON을 그 회차에 붙인다
 *   <선택 JSON>
 *   J
 *   npm run --silent digest -- selections <slug>   # 회차별 URL·문장·판정. 선택 안 받은 회차가 있으면 exit 1
 *   npm run --silent digest -- skip <slug> <회차>   # 선택을 받지 못하는 회차를 OFF 후보에서 뺀다
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

// URL 마지막 경로 조각에서 문서 확장자를 떼고, camelCase를 끊고, 영소문자·숫자 밖은 하이픈으로.
// 남는 글자가 없으면(사이트 루트, 한글뿐인 조각) 호스트 이름을 쓴다.
// 뒤에 호스트+경로 해시를 붙인다 — `vitest.dev/guide/`와 `jestjs.io/docs/guide`처럼 끝 조각이 같은
// 페이지를 나란히 돌리면, 뒤 세션의 reset이 앞 세션의 로그를 비운다.
function toSlug(url: string): string {
  if (!URL.canParse(url)) fail(`URL이 아니다: ${url}`);
  const { hostname, pathname } = new URL(url);
  const trimmed = pathname.replace(/\/+$/, '');
  const raw = trimmed.split('/').pop() ?? '';
  let last = raw;
  try {
    last = decodeURIComponent(raw);
  } catch {
    // 깨진 % 인코딩은 그대로 둔다 — 아래에서 하이픈이 된다.
  }
  const kebab = (text: string) =>
    text.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const id = createHash('sha1').update(hostname + trimmed).digest('hex').slice(0, 6);
  return `${kebab(last.replace(/\.(html?|md|php|aspx?)$/i, '')) || kebab(hostname)}-${id}`;
}

// 스킴·쿼리·`#` 뒤·`www.`·끝 `/`를 뗀 「호스트+경로」가 URL 단위로 같은 파일을 찾는다. 앞뒤 경계를 본다 —
// 그냥 부분 문자열로 찾으면 `react.dev/learn`이 `react.dev/learn/<하위 페이지>`나 `zh-hans.react.dev/learn`을
// 둔 파일까지 잡아, 묻지 않고 손대는 겹침 범위가 섹션 전체로 번진다.
function refs(url: string): string[] {
  if (!URL.canParse(url)) fail(`URL이 아니다: ${url}`);
  const { hostname, pathname } = new URL(url);
  // knowledge의 Reference는 %xx를 대문자로 적는다 — 소문자로 들어온 URL도 맞추려고 대문자로 맞춘다.
  const needle =
    hostname.replace(/^www\./, '') + pathname.replace(/\/+$/, '').replace(/%[0-9a-f]{2}/gi, (percentEscape) => percentEscape.toUpperCase());
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`//(?:www\\.)?${escaped}/?(?=[#?\\s)>"'\\]]|$)`, 'm');
  const root = path.resolve(import.meta.dirname, '..', 'knowledge');
  return fs
    .readdirSync(root, { recursive: true, encoding: 'utf8' })
    .filter((rel) => rel.endsWith('.md') && re.test(fs.readFileSync(path.join(root, rel), 'utf8')))
    .map((rel) => path.posix.join('knowledge', rel.split(path.sep).join('/')));
}

const pageFile = (slug: string) => path.join(os.tmpdir(), `ka-digest-${slug}-page.txt`);

// 본문(<main>·<article>)에서 태그를 걷어 텍스트만 남긴다. 줄 경계는 블록 요소 끝에서 끊는다.
async function page(url: string): Promise<void> {
  if (!URL.canParse(url)) fail(`URL이 아니다: ${url}`);
  // 영어 원문을 달라고 밝힌다 — 헤더가 없으면 web.dev 등은 기계번역본을 돌려줘, 대조가 전부 X가 되고 요약도 번역본을 근거로 쓴다.
  let res: Response;
  try {
    res = await fetch(url, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } });
  } catch (error) {
    console.error(`페이지를 받지 못했다: ${(error as Error).cause ?? (error as Error).message}`);
    process.exitCode = 1;
    return;
  }
  if (!res.ok) {
    console.error(`페이지를 받지 못했다: HTTP ${res.status}`);
    process.exitCode = 1;
    return;
  }
  const html = await res.text();
  const body = (html.match(/<main[\s\S]*?<\/main>/i) ?? html.match(/<article[\s\S]*?<\/article>/i) ?? [html])[0];
  const text = body
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, '')
    // 소스 줄바꿈은 블록 경계가 아니다 — web.dev 등은 <p> 안에서도 줄을 바꿔 적어, 남기면 has가 보여 주는 원문이
    // 문장 조각이 된다. <pre> 안 줄바꿈만 지키고 접는다.
    .replace(/<pre[\s\S]*?<\/pre>/gi, (preBlock) => preBlock.replace(/\n/g, '\u0000'))
    .replace(/\s+/g, ' ')
    .replace(/\u0000/g, '\n')
    .replace(/<(br|\/p|\/li|\/h\d|\/pre|\/div|\/tr|\/dt|\/dd|\/blockquote|\/figcaption|\/summary|\/section)[^>]*>/gi, '\n')
    // 표 칸 사이는 띄운다 — 브라우저에서 복사하면 공백이 들어가는 자리라, 붙이면 같은 페이지 단락이 X가 된다.
    .replace(/<\/t[dh]>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
  // fetch 뒤에는 process.exit()를 부르지 않는다 — Windows에서 핸들이 닫히는 중에 끊으면 libuv assertion으로 죽는다.
  if (text.length < 1000) {
    console.error(`본문이 ${text.length}자뿐이다 — JS로 그리는 페이지일 수 있어 원문 대조를 할 수 없다`);
    process.exitCode = 1;
    return;
  }
  const file = pageFile(toSlug(url));
  fs.writeFileSync(file, text);
  console.log(`${file} (${text.length}자)`);
}

// 공식문서 다이어그램을 tmp에 받아 경로를 낸다 — WebFetch는 SVG를 작은 모델의 요약으로만 돌려줘, 그 요약으로
// 다이어그램을 지어도 티가 안 난다. 받은 PNG·JPG는 Read가 그림으로, SVG는 라벨 글자 그대로 연다.
async function image(url: string): Promise<void> {
  if (!URL.canParse(url)) fail(`URL이 아니다: ${url}`);
  let res: Response;
  try {
    res = await fetch(url);
  } catch (error) {
    console.error(`이미지를 받지 못했다: ${(error as Error).cause ?? (error as Error).message}`);
    process.exitCode = 1;
    return;
  }
  if (!res.ok) {
    console.error(`이미지를 받지 못했다: HTTP ${res.status}`);
    process.exitCode = 1;
    return;
  }
  const ext = path.extname(new URL(url).pathname).toLowerCase() || `.${(res.headers.get('content-type') ?? '').split(/[/+;]/)[1] ?? 'bin'}`;
  const file = path.join(os.tmpdir(), `ka-digest-image-${toSlug(url)}${ext}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(file);
}

// 복사할 때 바뀌는 따옴표·공백만 맞추고, 나머지는 글자 그대로 비교한다.
const normalize = (text: string) =>
  text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

// knowledge에 저장한 OA는 마크다운이고 page의 원문은 태그를 걷은 평문이다 — 백틱·굵게·목록 표지·링크 문법이
// 남으면 같은 문장도 X가 난다. `--md`일 때만 걷는다: 순회 중 대조하는 단락은 사용자가 브라우저에서 복사한 평문이라
// 거기서 백틱을 걷으면 원문의 코드(템플릿 리터럴 등)와 어긋난다. 한 글자 `*`·`_` 강조는 식별자와 갈리지 않아 두지 않는다.
const stripMarkdown = (line: string) =>
  line
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|__/g, '')
    .replace(/`/g, '');

// slug가 아니라 URL을 받는다 — 순회 중 URL이 바뀌면 원문 파일은 새 URL 것을 봐야 하는데,
// 질문 로그 slug(ON의 URL)를 넘기면 옛 페이지와 대조한다.
function has(url: string, md: boolean): void {
  const file = pageFile(toSlug(url));
  if (!fs.existsSync(file)) fail(`원문이 없다: ${file} — 이 URL로 page를 먼저 부른다`);
  const raw = fs.readFileSync(file, 'utf8');
  const text = normalize(raw);
  const split = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z`"(])/).filter(Boolean);
  // 원문 페이지에는 코드 펜스 줄이 없다. 빈 줄(문단 경계)부터 나눈다 — OA는 떨어진 문장을 이어 붙이기도 해서,
  // 합친 뒤 나누면 소문자·API명으로 시작하는 다음 문장이 앞 문장에 붙어 원문에 있어도 X가 난다.
  let inFence = false;
  const sentences = fs
    .readFileSync(0, 'utf8')
    .split(/\r?\n/)
    .flatMap((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        // 빈 줄로 남긴다 — 펜스에 바로 붙은 산문이 코드와 한 블록으로 합쳐지지 않게.
        return [''];
      }
      // OA 안의 `####` 소제목은 구조 표시라(content-format) 원문 문장이 아니다 — 빈 줄로 남겨 앞뒤 문단을 가른다.
      if (md && !inFence && /^#{1,6}\s/.test(line)) return [''];
      return [md && !inFence ? stripMarkdown(line) : line];
    })
    .join('\n')
    .split(/\n\s*\n/)
    .flatMap((block) => split(normalize(block)));
  const missing = sentences.filter((sentence) => !text.includes(sentence));
  // 다른 문장마다 원문에서 낱말이 가장 많이 겹치는 문장을 보여 준다 — 한 단어만 바뀐 것인지, 아예 다른 페이지인지
  // 사용자가 바로 가릴 수 있게. 절반도 안 겹치면 같은 자리가 없는 것으로 본다.
  const wordSet = (text: string) => new Set(text.toLowerCase().match(/[a-z0-9']+/g) ?? []);
  // 줄(블록 요소) 경계부터 나눈다 — 합친 뒤 나누면 앞 블록의 코드 조각이 문장 앞에 붙는다.
  const pageSentences = raw
    .split('\n')
    .flatMap((line) => split(normalize(line)))
    .map((sentence) => ({ sentence, wordSet: wordSet(sentence) }));
  const nearest = (target: string) => {
    const targetWords = wordSet(target);
    let best = { sentence: '', score: 0 };
    for (const candidate of pageSentences) {
      const common = [...targetWords].filter((word) => candidate.wordSet.has(word)).length;
      const score = common / Math.max(targetWords.size, candidate.wordSet.size, 1);
      if (score > best.score) best = { sentence: candidate.sentence, score };
    }
    return best.score >= 0.5 ? best.sentence : '';
  };
  for (const sentence of sentences) {
    if (!missing.includes(sentence)) {
      console.log(`O ${sentence}`);
      continue;
    }
    console.log(`X ${sentence}`);
    // 브라우저에서 복사하면 마침표 없는 alt text·캡션이 다음 문장 앞에 붙어 한 문장이 된다. 뒤가 원문 문장이면
    // 원문에 없는 앞부분만 따로 보여 준다. 그 부분만 빼면 되는지 판단할 재료다.
    const tail = pageSentences.find((candidate) => candidate.sentence.length > 0 && sentence.endsWith(` ${candidate.sentence}`));
    if (tail) {
      console.log(`  원문: ${tail.sentence}`);
      console.log(`  원문에 없는 앞부분: ${sentence.slice(0, sentence.length - tail.sentence.length).trim()}`);
      continue;
    }
    const near = nearest(sentence);
    console.log(near ? `  원문: ${near}` : '  원문: (이 페이지에 비슷한 문장 없음)');
  }
  if (missing.length) fail(`원문과 다른 문장 ${missing.length}/${sentences.length}`);
}


// ---------------------------------------------------------------- 회차: gloss·select·selections
//
// 회차 기록은 tmp의 JSON 한 파일에 둔다. 회차마다 그 단락의 출처 URL·문장과, 사용자가 고른 판정을 담는다.
// 세션 안에 기억해 두면 compact에서 뭉개지고, 선택 JSON을 늦게 붙여넣으면 앞 회차 선택이 조용히 빠졌다.
// OFF는 이 파일에서 저장 후보와 그 문장의 Reference URL을 읽는다.
type Verdict = 'save' | 'explain' | 'drop';
const VERDICTS: Verdict[] = ['save', 'explain', 'drop'];

interface RoundRecord {
  round: number;
  url: string;
  sentences: string[];
  verdicts?: Verdict[];
  // 페이지에 기본값으로 찍어 둔 AI 판정. OFF 회고가 사용자 판정과 엇갈린 문장을 찾을 때 읽는다.
  aiVerdicts?: Verdict[];
  // 페이지를 못 띄웠거나 사용자가 건너뛴 회차. 선택이 없어도 OFF를 막지 않는다.
  skipped?: boolean;
}

const roundsFile = (slug: string) => path.join(os.tmpdir(), `ka-digest-${slug}-rounds.json`);

function readRounds(slug: string): RoundRecord[] {
  const file = roundsFile(slug);
  if (!fs.existsSync(file)) fail(`회차 기록이 없다: ${file} — ON에서 reset한 slug와 같은지 본다`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readStdinJson(what: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8').replace(/^﻿/, ''));
  } catch (error) {
    fail(`stdin은 ${what}여야 한다: ${(error as Error).message}`);
  }
}

// 해설 양식은 explanation-guide.md에서 그때그때 잘라 붙인다. 옮겨 적으면 가이드가 바뀔 때 조용히 어긋난다.
// 자를 자리의 헤딩이 바뀌면 여기서 실패한다.
const EXPLANATION_GUIDE_PATH = path.resolve(import.meta.dirname, '..', 'local', 'contexts', 'explanation-guide.md');
const GLOSS_SCHEMA_PATH = path.resolve(import.meta.dirname, 'digest-gloss.schema.json');
const ASK_LLM_PATH = path.join(os.homedir(), 'WebstormProjects', 'main', 'ai-contexts', 'plugins', 'ac', 'contexts', 'ask-llm.mjs');

function guideSlice(guide: string, from: string, to: string): string {
  const start = guide.indexOf(from);
  const end = start === -1 ? -1 : guide.indexOf(to, start + from.length);
  if (start === -1 || end === -1) fail(`explanation-guide.md에서 「${from}」~「${to}」 구간을 못 찾았다. 헤딩이 바뀌었으면 digest.mts의 guideSlice 인자를 맞춘다`);
  return guide.slice(start, end).trim();
}

function glossPrompt(sentences: string[]): string {
  const guide = fs.readFileSync(EXPLANATION_GUIDE_PATH, 'utf8');
  // 「본문」은 의역·영단어 해설 양식과 「끊는 기준」까지만 넣는다. 「조각 순서」는 카드에 적용하지 않는다(카드는 원문 순서).
  const formatSection = guideSlice(guide, '### 본문', '**조각 순서**');
  const prohibitions = guideSlice(guide, '## 3. 금지', '### 세션 맥락 표현 목록');
  return `너는 영어 기술 문서를 한국인 프론트엔드 개발자에게 해설한다.
아래 문장들 각각에 카드 한 장씩, 받은 순서 그대로 만든다. 카드 수는 문장 수(${sentences.length})와 같아야 한다.

카드 칸:
- src: 받은 문장을 한 글자도 바꾸지 않고 그대로
- ko: 한글 의역. 긴 문장은 아래 「끊는 기준」대로 쪼개 조각마다 <p>…</p>로 나눈다. 굵게·코드는 <strong>·<code>로 쓴다
- words: 그 문장의 중요 영단어와 이 문장에서의 의미. 사전 뜻을 외우게 하지 말고 왜 그 단어가 쓰였는지 짚는다
- 원문에 없는 내용을 덧붙이지 않는다

깊이:
- 개념·정의·실무 함의가 있는 문장은 위를 모두 채운다
- 수사적 도입·전환·다음 절 예고 문장은 ko에 한 줄 의역만 쓰고 words는 빈 배열
- 코드블록·삽화 캡션은 ko에 한 줄 설명만 쓰고 words는 빈 배열

아래는 따라야 할 해설 양식이다. 「>」 블록쿼트 인용과 「- **단어**:」 표기는 카드에 쓰지 않는다(원문은 src, 단어는 words 칸에 넣는다).

${formatSection}

${prohibitions}

문장(JSON 배열):
${JSON.stringify(sentences, null, 2)}
`;
}

// 카드의 ko·words는 페이지에 HTML 그대로 들어간다. 모델이 허용한 태그만 살리고 나머지 꺾쇠·&는 글자로 바꾼다.
// 이게 없으면 `Array<T>`·`<Suspense>` 같은 낱말이 태그로 먹혀 화면에서 사라진다.
const ALLOWED_TAG = /(<\/?(?:p|strong|code)>)/;
function sanitizeHtml(text: string): string {
  return text
    .split(ALLOWED_TAG)
    .map((part) =>
      ALLOWED_TAG.test(part)
        ? part
        : part
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    )
    .join('');
}

interface GlossCard {
  src: string;
  ko: string;
  words: { word: string; meaning: string }[];
}

// 단락 하나를 회차로 기록하고, 카드의 한글 의역·영단어 해설을 Gemini에 받아 온다.
// 회차 번호는 기록에서 센다. 0단계에서 멈춘 단락이나 선택 JSON은 회차를 먹지 않는다.
function gloss(slug: string, url: string): void {
  if (!URL.canParse(url)) fail(`URL이 아니다: ${url}`);
  const sentences = readStdinJson('비어 있지 않은 문장 문자열의 JSON 배열');
  if (!Array.isArray(sentences) || !sentences.length || !sentences.every((sentence) => typeof sentence === 'string' && sentence.trim())) {
    fail('stdin은 비어 있지 않은 문장 문자열의 JSON 배열이어야 한다');
  }
  const rounds = readRounds(slug);
  // 카드 원문은 Official Answer의 원본이 된다. 0단계 대조를 거치지 않은 문장이 들어오면 OFF 대조에서야 드러나므로 여기서 막는다.
  const file = pageFile(toSlug(url));
  if (!fs.existsSync(file)) fail(`원문이 없다: ${file}. 이 URL로 page를 먼저 실행하고 has로 대조한다.`);
  const text = normalize(fs.readFileSync(file, 'utf8'));
  const missing = sentences.filter((sentence) => !text.includes(normalize(sentence)));
  if (missing.length) fail(`원문에 없는 문장이 있다. has로 다시 대조해 원문 문장으로 고치거나 뺀 뒤 실행한다.\n${missing.map((sentence) => `X ${sentence}`).join('\n')}`);

  const askLlm = spawnSync(process.execPath, [ASK_LLM_PATH, '--vendor', 'gemini', '--schema', GLOSS_SCHEMA_PATH, '-'], {
    input: glossPrompt(sentences),
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  // ask-llm의 실패 사유(멈추라는 지시 포함)는 그대로 넘긴다.
  if (askLlm.status !== 0) fail(askLlm.stderr.trim() || `ask-llm이 종료코드 ${askLlm.status}로 끝났다`);

  const cards: GlossCard[] = JSON.parse(askLlm.stdout).cards;
  if (cards.length !== sentences.length) {
    fail(`Gemini가 문장 ${sentences.length}개에 카드 ${cards.length}장을 보냈다. 이 사유를 사용자에게 보이고 멈춘다.`);
  }

  const round = rounds.length + 1;
  rounds.push({ round, url, sentences });
  fs.writeFileSync(roundsFile(slug), JSON.stringify(rounds, null, 2));

  const result = cards.map((card, index) => ({
    // 원문은 넘긴 문장으로 덮는다. 모델이 옮기다 바꾼 글자가 Official Answer로 흘러가지 않게.
    src: sentences[index],
    ko: sanitizeHtml(card.ko),
    words: card.words.map(({ word, meaning }) => ({ word: sanitizeHtml(word), meaning: sanitizeHtml(meaning) })),
  }));
  console.log(JSON.stringify({ round, cards: result }));
}

// 페이지에서 복사한 선택 JSON을 그 회차 기록에 붙인다. 어느 회차든 받으므로 늦게 붙여넣어도 빠지지 않는다.
function select(slug: string): void {
  const payload = readStdinJson('digest 페이지에서 복사한 선택 JSON') as {
    __skill?: string; slug?: string; round?: number; items?: { head: string; ai?: string; verdict: string | null }[];
  };
  const retry = '이 세션에서 연 digest 페이지의 클립보드 복사를 다시 눌러 붙여넣어 달라고 사용자에게 안내한다.';
  if (payload.__skill !== 'ka-digest' || payload.slug !== slug) fail(`다른 페이지의 값이다 (__skill: ${payload.__skill}, slug: ${payload.slug}). ${retry}`);
  const rounds = readRounds(slug);
  const record = rounds.find((candidate) => candidate.round === payload.round);
  if (!record) fail(`${payload.round}회차는 이 세션에서 연 적이 없다. ${retry}`);
  const items = payload.items ?? [];
  if (items.length !== record.sentences.length) fail(`${record.round}회차 문장은 ${record.sentences.length}개인데 선택은 ${items.length}개다. ${retry}`);
  items.forEach((item, index) => {
    if (!record.sentences[index].startsWith(item.head)) fail(`${record.round}회차 ${index + 1}번째 선택의 앞머리가 원문과 다르다. ${retry}`);
    if (!VERDICTS.includes(item.verdict as Verdict)) fail(`${record.round}회차 ${index + 1}번째 문장에 판정이 없다. 사용자에게 그 문장을 선택하고 다시 제출해 달라고 안내한다.`);
  });
  record.verdicts = items.map((item) => item.verdict as Verdict);
  if (items.every((item) => VERDICTS.includes(item.ai as Verdict))) record.aiVerdicts = items.map((item) => item.ai as Verdict);
  record.skipped = false;
  fs.writeFileSync(roundsFile(slug), JSON.stringify(rounds, null, 2));
  const counts = VERDICTS.map((verdict) => `${verdict} ${record.verdicts!.filter((picked) => picked === verdict).length}`).join(' · ');
  const pending = rounds.filter((candidate) => !candidate.verdicts && !candidate.skipped).map((candidate) => candidate.round);
  console.log(`${record.round}회차 선택 저장: ${counts}${pending.length ? ` (선택을 아직 안 받은 회차: ${pending.join(', ')})` : ''}`);
}

// 선택을 받지 못하는 회차(페이지를 못 띄웠거나 사용자가 그 단락을 건너뜀)를 표시한다. selections가 이 회차를 뺀다.
function skip(slug: string, round: number): void {
  const rounds = readRounds(slug);
  const record = rounds.find((candidate) => candidate.round === round);
  if (!record) fail(`${round}회차는 이 세션에서 연 적이 없다.`);
  record.skipped = true;
  fs.writeFileSync(roundsFile(slug), JSON.stringify(rounds, null, 2));
  console.log(`${round}회차를 건너뛴다. 이 회차 문장은 OFF 후보에 들어가지 않는다.`);
}

// OFF가 읽는다. 회차마다 URL과 문장별 판정(사용자 verdict, AI 기본값 ai)을 낸다. 선택을 안 받은 회차가 있으면 실패한다.
function selections(slug: string): void {
  const rounds = readRounds(slug).filter((record) => !record.skipped);
  const pending = rounds.filter((record) => !record.verdicts).map((record) => record.round);
  if (pending.length) {
    fail(`선택을 아직 안 받은 회차가 있다: ${pending.join(', ')}. 그 회차 페이지의 선택 JSON을 붙여넣어 달라고 사용자에게 안내한다. ` +
      `그 회차 페이지가 없거나 사용자가 건너뛰겠다고 하면 \`npm run --silent digest -- skip ${slug} <회차>\`로 표시하고 다시 실행한다.`);
  }
  console.log(JSON.stringify(rounds.map(({ round, url, sentences, verdicts, aiVerdicts }) => ({
    round, url, sentences: sentences.map((src, index) => ({ src, verdict: verdicts![index], ai: aiVerdicts?.[index] ?? null })),
  })), null, 2));
}

// ---------------------------------------------------------------- 진입점

const [cmd, arg, sourceUrl] = process.argv.slice(2);
if (!cmd || !arg) fail('Usage: digest <slug|refs|page|has|image|reset|append|read|gloss|select|selections|skip> <URL|slug> [URL|회차]');
const LOG = () => path.join(os.tmpdir(), `ka-digest-${arg}-questions.md`);
const needSlug = () => {
  if (!/^[a-z0-9-]+$/.test(arg)) fail(`slug는 소문자·숫자·하이픈만 쓴다: ${arg}`);
};

switch (cmd) {
  case 'slug':
    console.log(toSlug(arg));
    break;
  case 'refs':
    for (const f of refs(arg)) console.log(f);
    break;
  case 'page':
    await page(arg);
    break;
  case 'has':
    has(arg, process.argv.includes('--md'));
    break;
  case 'image':
    await image(arg);
    break;
  case 'reset':
    needSlug();
    fs.writeFileSync(LOG(), '');
    fs.writeFileSync(roundsFile(arg), '[]');
    console.log(LOG());
    break;
  case 'append': {
    needSlug();
    // 새로 만들지 않는다 — ON에서 reset한 slug와 다르면 여기서 실패해야 OFF가 빈 로그를 읽지 않는다.
    if (!fs.existsSync(LOG())) fail(`질문 로그가 없다: ${LOG()} — ON에서 reset한 slug와 같은지 본다`);
    // 칸을 인자 대신 stdin 줄로 받는다 — 한글·따옴표가 셸 인용에서 깨지지 않게.
    const fields = fs
      .readFileSync(0, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim().replaceAll('|', '\\|'))
      .filter(Boolean);
    if (fields.length !== 3) fail(`stdin은 대상·헷갈린 점·풀어준 방법 세 줄이어야 한다 (받은 줄: ${fields.length})`);
    fs.appendFileSync(LOG(), `- ${fields.join(' | ')}\n`);
    break;
  }
  case 'read':
    needSlug();
    if (!fs.existsSync(LOG())) fail(`질문 로그가 없다: ${LOG()}`);
    process.stdout.write(fs.readFileSync(LOG(), 'utf8'));
    break;
  case 'gloss':
    needSlug();
    if (!sourceUrl) fail('Usage: digest gloss <slug> <이 단락의 출처 URL> <<\'S\' ["문장1", ...] S');
    gloss(arg, sourceUrl);
    break;
  case 'select':
    needSlug();
    select(arg);
    break;
  case 'selections':
    needSlug();
    selections(arg);
    break;
  case 'skip':
    needSlug();
    if (!/^\d+$/.test(sourceUrl ?? '')) fail('Usage: digest skip <slug> <회차 번호>');
    skip(arg, Number(sourceUrl));
    break;
  default:
    fail(`알 수 없는 명령: ${cmd}`);
}
