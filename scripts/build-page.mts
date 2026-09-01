/**
 * Renders the local HTML pages that KA skills open in the browser.
 *
 * `local-html-roundtrip.mjs` already owns writing the file and opening it. It deliberately left
 * "what the page contains" to the skills, and that remainder turned out to be 230 lines of HTML
 * copied out of SKILL.md by hand every round. The copy carries the payload contract
 * (`__skill`/`ts`, the `v{i}` radio names, the `HEADS` array) that the skill reads back out of
 * what the user pastes, so a slip while transcribing breaks the round-trip with nothing to catch it.
 * Everything below is a pure function of the spec, so it lives here instead.
 *
 * Usage (spec JSON on stdin, HTML on stdout):
 *   npx tsx scripts/build-page.mts digest-cards < spec.json
 *   npx tsx scripts/build-page.mts exam-sheet   < spec.json
 *   npx tsx scripts/build-page.mts exam-result  < spec.json
 *   npx tsx scripts/build-page.mts exam-slug knowledge/cs/system/process.md   # → cs-system-process
 *
 * Pipes straight into the opener:
 *   npx tsx scripts/build-page.mts exam-sheet < spec.json \
 *     | node <contexts>/local-html-roundtrip.mjs open ka-exam - --slug <slug>
 *
 * Spec shapes — each field's meaning is the skill's, not this file's:
 *   digest-cards  { slug, round, summary, cards: [{ src, ko, words: [{ word, meaning }], verdict }] }
 *                 verdict = save | explain | drop  (the radio pre-selected as the AI's call)
 *   exam-sheet    { title, questions: [{ title, diagramHint? }] }
 *   exam-result   { title, questions: [{ title, verdict, answer?, reason?, official?, unverified?, diagram? }] }
 *                 verdict = pass | partial | fail | skip
 *
 * Escaping rule: text that must survive verbatim is escaped, prose the AI wrote is not.
 * `src`·`answer`·`diagram`·`official`·question titles are escaped — the digest quote becomes an Official
 * Answer downstream, so a stray tag would follow it into knowledge/. `ko`·`words`·`reason`·
 * `summary` pass through raw, because the skill is told to use `<strong>`/`<code>` there.
 */
import fs from 'node:fs';
import path from 'node:path';

type DigestVerdict = 'save' | 'explain' | 'drop';
type ExamVerdict = 'pass' | 'partial' | 'fail' | 'skip';

interface DigestCard {
  src: string;
  ko: string;
  words?: { word: string; meaning: string }[];
  verdict: DigestVerdict;
}
interface DigestSpec {
  slug: string;
  round: number;
  summary: string;
  cards: DigestCard[];
}
interface ExamQuestion {
  title: string;
  diagramHint?: boolean;
}
interface ExamSheetSpec {
  title: string;
  questions: ExamQuestion[];
}
interface ExamResultQuestion {
  title: string;
  verdict: ExamVerdict;
  answer?: string;
  reason?: string;
  official?: string;
  unverified?: boolean;
  diagram?: string;
}
interface ExamResultSpec {
  title: string;
  questions: ExamResultQuestion[];
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Data handed to the page's own <script>. `</script>` inside a string would close the block early,
// so the `<` is escaped — JSON.parse and the JS parser both read `<` as `<`.
function toScriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function readStdin(): string {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (error) {
    return fail(`표준입력을 읽지 못했다: ${(error as Error).message}`);
  }
}

function readSpec<T>(): T {
  const raw = readStdin().replace(/^﻿/, '');
  if (raw.trim() === '') fail('표준입력이 비어 있다 — 스펙 JSON을 파이프로 넘긴다.');
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return fail(`스펙이 JSON이 아니다: ${(error as Error).message}`);
  }
}

const PAGE_HEAD = (title: string, style: string) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
${style}
  </style>
</head>`;

// The submit/copy pair is identical on every page that reports back: fill the textarea with the
// payload, reveal it, and copy on demand. Only the payload differs, so it is the one parameter.
const COLLECT_SCRIPT = (payloadExpression: string) => `    function collect() {
      const payload = ${payloadExpression};
      document.getElementById('result').value = JSON.stringify(payload);
      document.getElementById('output').style.display = 'block';
      document.getElementById('result').select();
    }
    function copyAll() {
      const ta = document.getElementById('result');
      ta.select();
      document.execCommand('copy');
      document.getElementById('copy-btn').textContent = '복사됨 ✓';
      setTimeout(() => document.getElementById('copy-btn').textContent = '클립보드 복사', 1500);
    }`;

const OUTPUT_BLOCK = `  <div id="output">
    <p>클립보드 복사를 누른 뒤 Claude와의 대화창에 <strong>그대로 붙여넣으세요</strong>:</p>
    <textarea id="result" readonly></textarea>
    <br><button id="copy-btn" onclick="copyAll()">클립보드 복사</button>
  </div>`;

// ---------------------------------------------------------------- digest cards

const DIGEST_STYLE = `    body { font-family: -apple-system, sans-serif; max-width: 860px; margin: 40px auto; padding: 0 24px; color: #111; }
    h1 { font-size: 1.2rem; margin-bottom: 4px; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 32px; }
    .card { border-top: 1px solid #e3e3e3; padding: 18px 0 18px 44px; position: relative; border-left: 4px solid transparent; }
    .card .badge { position: absolute; left: 10px; top: 20px; font-size: 1.1rem; }
    .card.save { border-left-color: #2a7a2a; background: #f4fbf4; }
    .card.explain { border-left-color: #c47c00; background: #fffaf0; }
    .card.drop { border-left-color: #ddd; background: #fafafa; opacity: 0.72; }
    .src { background: #f7f7f7; padding: 8px 12px 8px 0; font-size: 0.95rem; white-space: pre-wrap; border-radius: 3px; }
    .ko { margin: 10px 0 6px; padding-right: 12px; font-size: 1rem; }
    .words { font-size: 0.88rem; color: #555; margin: 0 0 10px; padding-left: 18px; }
    .words li { margin: 2px 0; }
    .pick label { margin-right: 16px; font-size: 0.92rem; cursor: pointer; }
    .summary { margin-top: 36px; padding: 16px 18px; background: #f9f9f9; border-radius: 6px; font-size: 0.95rem; }
    button { margin-top: 24px; padding: 10px 26px; font-size: 1rem; background: #111; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    #output { display: none; margin-top: 24px; }
    #result { width: 100%; min-height: 90px; background: #f4f4f4; box-sizing: border-box; }
    #copy-btn { background: #4a6cf7; }`;

const DIGEST_VERDICTS: DigestVerdict[] = ['save', 'explain', 'drop'];
const DIGEST_LABEL: Record<DigestVerdict, string> = { save: '저장', explain: '해설', drop: '버림' };
const HEAD_LENGTH = 60; // 회수 시 원문과 짝을 맞추는 앞머리. 스킬 산문이 쓰던 길이 그대로다.

function buildDigestCards(spec: DigestSpec): string {
  if (!Array.isArray(spec.cards) || spec.cards.length === 0) fail('cards가 비어 있다.');

  const cards = spec.cards
    .map((card, i) => {
      if (!DIGEST_VERDICTS.includes(card.verdict)) {
        fail(`카드 ${i + 1}의 verdict "${card.verdict}" — save/explain/drop 중 하나여야 한다.`);
      }
      const words = (card.words ?? [])
        .map((w) => `<li><b>${w.word}</b>: ${w.meaning}</li>`)
        .join('');
      const radios = DIGEST_VERDICTS.map(
        (v) =>
          `      <label><input type="radio" name="v${i}" value="${v}"${v === card.verdict ? ' checked' : ''}> ${DIGEST_LABEL[v]}</label>`,
      ).join('\n');
      return `  <div class="card">
    <div class="src">${escapeHtml(card.src)}</div>
    <div class="ko">${card.ko}</div>
${words ? `    <ul class="words">${words}</ul>\n` : ''}    <div class="pick">
${radios}
    </div>
  </div>`;
    })
    .join('\n\n');

  const counts = DIGEST_VERDICTS.map((v) => `${DIGEST_LABEL[v]} ${spec.cards.filter((c) => c.verdict === v).length}건`).join(' · ');
  const heads = spec.cards.map((c) => c.src.slice(0, HEAD_LENGTH));

  return `${PAGE_HEAD(`digest: ${spec.slug} — ${spec.round}회차`, DIGEST_STYLE)}
<body>
  <h1>digest: ${escapeHtml(spec.slug)}</h1>
  <p class="meta">${spec.round}회차 · ${spec.cards.length}문장 — 문장마다 하나씩 고른 뒤 제출을 누르세요. 기본값은 AI 판정입니다.</p>

${cards}

  <div class="summary">${spec.summary}<br><br>AI 판정: ${counts}</div>

  <button onclick="collect()">제출</button>

${OUTPUT_BLOCK}

  <script>
    const HEADS = ${toScriptJson(heads)};
    const EMOJI = { save: "✅", explain: "📝", drop: "❌" };
    const LABEL = { save: "저장", explain: "해설", drop: "버림" };

    // 판정을 눈으로 구분되게: 카드마다 이모지 뱃지·배경색을 입히고 라디오 글자에도 이모지를 붙인다.
    document.querySelectorAll('.card').forEach((card) => {
      const radios = card.querySelectorAll('input[type=radio]');
      if (!radios.length) return;
      radios.forEach((r) => {
        const span = r.parentElement.childNodes[1];
        if (span) span.textContent = ' ' + EMOJI[r.value] + ' ' + LABEL[r.value];
      });
      const badge = document.createElement('span');
      badge.className = 'badge';
      card.prepend(badge);
      const paint = () => {
        const picked = card.querySelector('input[type=radio]:checked');
        const v = picked ? picked.value : null;
        card.classList.remove('save', 'explain', 'drop');
        if (v) card.classList.add(v);
        badge.textContent = v ? EMOJI[v] : '';
      };
      radios.forEach((r) => r.addEventListener('change', paint));
      paint();
    });

${COLLECT_SCRIPT(`{
        __skill: "ka-digest",
        ts: Date.now(),
        slug: ${toScriptJson(spec.slug)},
        round: ${JSON.stringify(spec.round)},
        items: HEADS.map((head, i) => ({
          i, head,
          verdict: (document.querySelector('input[name="v' + i + '"]:checked') || {}).value || null
        }))
      }`)}
  </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- exam sheet

const DIAGRAM_HINT = '이 질문은 그림으로도 표현할 수 있어요. 종이/태블릿/Excalidraw 등 편한 도구로 옆에 그려보세요.';

const EXAM_SHEET_STYLE = `    body { font-family: -apple-system, sans-serif; max-width: 780px; margin: 48px auto; padding: 0 24px; color: #111; }
    h1 { font-size: 1.3rem; margin-bottom: 4px; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 40px; }
    .q { margin: 28px 0; }
    .q-label { font-weight: 600; margin-bottom: 6px; }
    .diagram-hint { font-size: 0.85rem; color: #555; background: #fff8e1; padding: 6px 10px; margin-bottom: 8px; border-left: 3px solid #ffb300; border-radius: 3px; }
    textarea { width: 100%; min-height: 216px; padding: 8px; font-size: 0.95rem; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; resize: vertical; }
    button { margin-top: 28px; padding: 10px 28px; font-size: 1rem; background: #111; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #333; }
    #output { display: none; margin-top: 28px; }
    #output p { font-weight: 600; margin-bottom: 8px; }
    #result { background: #f4f4f4; min-height: 100px; }
    #copy-btn { margin-top: 8px; background: #4a6cf7; }`;

function buildExamSheet(spec: ExamSheetSpec): string {
  if (!Array.isArray(spec.questions) || spec.questions.length === 0) fail('questions가 비어 있다.');

  const questions = spec.questions
    .map((q, i) => {
      const n = i + 1;
      const hint = q.diagramHint ? `    <div class="diagram-hint">${DIAGRAM_HINT}</div>\n` : '';
      return `  <div class="q">
    <div class="q-label">Q${n}. ${escapeHtml(q.title)}</div>
${hint}    <textarea id="q${n}" placeholder="답변을 입력하세요..."></textarea>
  </div>`;
    })
    .join('\n\n');

  const qIds = spec.questions.map((_, i) => `q${i + 1}`);

  return `${PAGE_HEAD(`시험: ${spec.title}`, EXAM_SHEET_STYLE)}
<body>
  <h1>시험: ${escapeHtml(spec.title)}</h1>
  <p class="meta">총 ${spec.questions.length}문항 — 모든 답변을 작성한 뒤 제출 버튼을 누르세요.</p>

${questions}

  <button onclick="collect()">제출</button>

${OUTPUT_BLOCK}

  <script>
    const qIds = ${toScriptJson(qIds)};
${COLLECT_SCRIPT(`{
        __skill: "ka-exam",
        ts: Date.now(),
        answers: qIds.map(id => document.getElementById(id).value.trim())
      }`)}
  </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- exam result

const EXAM_RESULT_STYLE = `    body { font-family: -apple-system, sans-serif; max-width: 780px; margin: 48px auto; padding: 0 24px; color: #111; }
    h1 { font-size: 1.3rem; }
    .score { font-size: 1.1rem; margin: 8px 0 40px; }
    .q { margin: 32px 0; border-top: 1px solid #e0e0e0; padding-top: 20px; }
    .verdict { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
    .verdict.pass   { color: #2a7a2a; }
    .verdict.partial { color: #c47c00; }
    .verdict.fail   { color: #c0392b; }
    .verdict.skip   { color: #888; }
    .user-ans { background: #f9f9f9; border-left: 3px solid #ccc; padding: 8px 12px; margin: 8px 0; font-size: 0.9rem; white-space: pre-wrap; }
    .reason { font-size: 0.9rem; color: #555; }
    .official { margin-top: 12px; }
    .official p { font-size: 0.85rem; color: #444; margin: 0 0 4px; font-weight: 600; }
    .official pre { background: #f4f8f4; border-left: 3px solid #7aa87a; padding: 10px 12px; margin: 0; font-size: 0.88rem; white-space: pre-wrap; font-family: inherit; }
    .unverified-note { font-size: 0.8rem; color: #888; margin-bottom: 4px; }
    .diagram-compare { margin-top: 12px; }
    .diagram-compare p { font-size: 0.9rem; color: #444; margin-bottom: 6px; font-weight: 600; }
    .diagram-compare pre { background: #f4f4f4; padding: 12px; font-size: 0.85rem; overflow-x: auto; border-radius: 4px; }`;

const EXAM_MARK: Record<ExamVerdict, string> = { pass: '✓', partial: '△', fail: '✗', skip: '스킵' };

function buildExamResult(spec: ExamResultSpec): string {
  if (!Array.isArray(spec.questions) || spec.questions.length === 0) fail('questions가 비어 있다.');
  for (const [i, q] of spec.questions.entries()) {
    if (!(q.verdict in EXAM_MARK)) fail(`문항 ${i + 1}의 verdict "${q.verdict}" — pass/partial/fail/skip 중 하나여야 한다.`);
  }

  const count = (v: ExamVerdict) => spec.questions.filter((q) => q.verdict === v).length;
  const passed = count('pass');
  const partial = count('partial');
  const failed = count('fail');
  // 스킵은 채점하지 않으므로 분모에서 뺀다 (exam SKILL 「마커 처리」).
  const total = spec.questions.length - count('skip');

  const questions = spec.questions
    .map((q, i) => {
      const parts = [
        `    <div class="verdict ${q.verdict}">Q${i + 1}. ${escapeHtml(q.title)} &nbsp;${EXAM_MARK[q.verdict]}</div>`,
      ];
      if (q.unverified) parts.push(`    <div class="unverified-note">공식 출처 미확보 — 자체 지식 기반 채점</div>`);
      parts.push(`    <div class="user-ans">${escapeHtml(q.answer?.trim() || '미응답')}</div>`);
      // 통과한 문항에는 이유를 달지 않는다. 스킵은 애초에 판정이 없다.
      if (q.verdict !== 'pass' && q.verdict !== 'skip' && q.reason) parts.push(`    <div class="reason">${q.reason}</div>`);
      // 원문은 판정과 무관하게 붙인다 — 통과한 답도 OA와 대조해봐야 무엇을 다르게 말했는지 보인다.
      if (q.official) {
        parts.push(`    <div class="official">
      <p>Official Answer</p>
      <pre>${escapeHtml(q.official.trim())}</pre>
    </div>`);
      }
      if (q.diagram) {
        parts.push(`    <div class="diagram-compare">
      <p>본인이 그린 그림과 비교해보세요:</p>
      <pre>${escapeHtml(q.diagram)}</pre>
    </div>`);
      }
      return `  <div class="q">\n${parts.join('\n')}\n  </div>`;
    })
    .join('\n\n');

  // 하단 안내는 완전히 통과하지 못한 문항(✗ 오답 + △ 부분) 수로 갈린다 — 부분 통과도 재출제 대상이다.
  const remaining = failed + partial;
  const nextRound =
    remaining === 0
      ? '<strong>모든 문항 통과. 시험 종료.</strong>'
      : remaining === 1
        ? '<strong>1문항 남았습니다.</strong>\n    Claude에게 <code>다음 라운드</code>라고 입력하면 채팅으로 진행합니다.'
        : `<strong>${remaining}문항이 남았습니다.</strong>\n    Claude에게 <code>다음 라운드</code>라고 입력하면 해당 문항만 다시 시험지로 출제합니다.`;

  return `${PAGE_HEAD(`결과: ${spec.title}`, EXAM_RESULT_STYLE)}
<body>
  <h1>결과: ${escapeHtml(spec.title)}</h1>
  <div class="score">
    점수: ${passed}/${total} &nbsp;|&nbsp; ✓ ${passed} &nbsp; △ ${partial} &nbsp; ✗ ${failed}
  </div>

${questions}

  <div style="margin-top:48px; padding:20px; background:#f9f9f9; border-radius:6px;">
    ${nextRound}
  </div>
</body>
</html>
`;
}

// ---------------------------------------------------------------- 진입점

// 시험지 파일명에 쓰는 슬러그. knowledge 상대 경로에서 확장자를 떼고 구분자를 하이픈으로 바꾼다.
function examSlug(target: string): string {
  const rel = target.split(path.sep).join('/').replace(/^.*?knowledge\//, '');
  return rel.replace(/\.md$/, '').replace(/\//g, '-');
}

const [subcommand, ...rest] = process.argv.slice(2);

switch (subcommand) {
  case 'digest-cards':
    process.stdout.write(buildDigestCards(readSpec<DigestSpec>()));
    break;
  case 'exam-sheet':
    process.stdout.write(buildExamSheet(readSpec<ExamSheetSpec>()));
    break;
  case 'exam-result':
    process.stdout.write(buildExamResult(readSpec<ExamResultSpec>()));
    break;
  case 'exam-slug':
    if (!rest[0]) fail('usage: build-page.mts exam-slug <knowledge 파일 경로>');
    console.log(examSlug(rest[0]));
    break;
  default:
    fail(`모르는 서브커맨드: ${subcommand ?? '(없음)'}\n\n사용법은 이 파일 상단 주석에 있다.`);
}
