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
 */
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
  const kebab = (s: string) =>
    s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
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
    hostname.replace(/^www\./, '') + pathname.replace(/\/+$/, '').replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase());
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
  } catch (e) {
    console.error(`페이지를 받지 못했다: ${(e as Error).cause ?? (e as Error).message}`);
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
    .replace(/<pre[\s\S]*?<\/pre>/gi, (m) => m.replace(/\n/g, '\u0000'))
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
  } catch (e) {
    console.error(`이미지를 받지 못했다: ${(e as Error).cause ?? (e as Error).message}`);
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
const normalize = (s: string) =>
  s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

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
  const split = (s: string) => s.split(/(?<=[.!?])\s+(?=[A-Z`"(])/).filter(Boolean);
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
      return [md && !inFence ? stripMarkdown(line) : line];
    })
    .join('\n')
    .split(/\n\s*\n/)
    .flatMap((block) => split(normalize(block)));
  const missing = sentences.filter((s) => !text.includes(s));
  // 다른 문장마다 원문에서 낱말이 가장 많이 겹치는 문장을 보여 준다 — 한 단어만 바뀐 것인지, 아예 다른 페이지인지
  // 사용자가 바로 가릴 수 있게. 절반도 안 겹치면 같은 자리가 없는 것으로 본다.
  const words = (s: string) => new Set(s.toLowerCase().match(/[a-z0-9']+/g) ?? []);
  // 줄(블록 요소) 경계부터 나눈다 — 합친 뒤 나누면 앞 블록의 코드 조각이 문장 앞에 붙는다.
  const pageSentences = raw
    .split('\n')
    .flatMap((line) => split(normalize(line)))
    .map((s) => ({ s, w: words(s) }));
  const nearest = (s: string) => {
    const w = words(s);
    let best = { s: '', score: 0 };
    for (const p of pageSentences) {
      const common = [...w].filter((x) => p.w.has(x)).length;
      const score = common / Math.max(w.size, p.w.size, 1);
      if (score > best.score) best = { s: p.s, score };
    }
    return best.score >= 0.5 ? best.s : '';
  };
  for (const s of sentences) {
    if (!missing.includes(s)) {
      console.log(`O ${s}`);
      continue;
    }
    console.log(`X ${s}`);
    const near = nearest(s);
    console.log(near ? `  원문: ${near}` : '  원문: (이 페이지에 비슷한 문장 없음)');
  }
  if (missing.length) fail(`원문과 다른 문장 ${missing.length}/${sentences.length}`);
}

const [cmd, arg] = process.argv.slice(2);
if (!cmd || !arg) fail('Usage: digest <slug|refs|page|has|image|reset|append|read> <URL|slug>');
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
      .map((l) => l.trim().replaceAll('|', '\\|'))
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
  default:
    fail(`알 수 없는 명령: ${cmd}`);
}
