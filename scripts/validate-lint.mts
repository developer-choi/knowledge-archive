/**
 * Deterministic linter for KA knowledge/, reference/ and explained/ documents.
 *
 * Enforces the mechanically-decidable subset of the `validate` skill's checks
 * (grep / regex / structural). Judgment checks (OA language = English-original
 * vs Korean paraphrase, cross-file duplicate-explanation, Reference URL lookup)
 * stay in the validate skill (LLM). Rule definitions live in local/contexts/*.md;
 * this script only ENFORCES them — each check cites its source rule.
 *
 * The authoritative check list is CHECK_REGISTRY below — adding a check means adding a registry
 * row, and nothing outside this file needs to be edited. Docs point at the registry rather than
 * restating it. Each check's source rule is cited in the registry.
 *
 * Usage:
 *   npx tsx scripts/validate-lint.mts                       # all knowledge/ + reference/ + explained/
 *   npx tsx scripts/validate-lint.mts knowledge/cs          # specific path(s)
 *   npx tsx scripts/validate-lint.mts --staged              # only files staged for commit
 *   npx tsx scripts/validate-lint.mts --changed <baseRef>   # only git-changed files in <ref>..HEAD
 *   npx tsx scripts/validate-lint.mts --json                # machine-readable output
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const KA_ROOT = path.resolve(import.meta.dirname, '..');
const KNOWLEDGE_DIR = path.join(KA_ROOT, 'knowledge');
const REFERENCE_DIR = path.join(KA_ROOT, 'reference');
const EXPLAINED_DIR = path.join(KA_ROOT, 'explained');

// knowledge/ and reference/ share the Q&A body shape (`## 질문` + `### Official Answer` …) and so
// share one lint function. They differ in the wrapper: knowledge/ carries a `# Questions` TOC and a
// `# Answers` H1, reference/ carries neither (directory-roles 「reference/」 — 「양식」). Every check
// that reads the TOC, or that reads the knowledge↔explained pair, is therefore knowledge-only.
type QaKind = 'knowledge' | 'reference';

const HANGUL = /[가-힣㄰-㆏ᄀ-ᇿ]/;
const ANSWER_HEADINGS = ['Official Answer', 'Additional Answer', 'User Answer', 'Reference'];
const NOTE_HEADINGS = ['Review Note', 'Frequent Mistakes'];

type Severity = 'error' | 'warn';

// Authoritative check list — the single place the check set is written down. Docs must not
// mirror it (a hand-kept copy is double work and drifts; a copy-checker only polices the copy).
// (The `priority` write-block is a PreToolUse hook, not a lint check — it never reaches this
// script, so it is not in the registry. It lives in local/hooks/block-knowledge-priority.mjs.)
interface CheckSpec {
  id: string;
  severity: Severity;
  rule: string; // source rule this check enforces
}
const CHECK_REGISTRY: CheckSpec[] = [
  { id: 'F1', severity: 'error', rule: 'integrity — odd ``` count swallows the rest as code' },
  { id: 'K1', severity: 'error', rule: "validate SKILL — 폐지된 Official Annotation 잔재" },
  { id: 'K2', severity: 'error', rule: "content-format §3 '빈 섹션 금지'" },
  { id: 'K3', severity: 'error', rule: "content-format §3 '동일 헤딩 중복 금지'" },
  { id: 'K4', severity: 'error', rule: "content-format §3 '출처 표기는 Reference에만'" },
  { id: 'K5', severity: 'error', rule: "content-format §3 'OA 한글 금지'" },
  { id: 'K6', severity: 'error', rule: "document-structure '미완성 질문 처리'" },
  { id: 'K7', severity: 'error', rule: "document-structure '목차-본문 순서 동기화'" },
  { id: 'K8', severity: 'error', rule: "document-structure '허용 H1 헤딩' (knowledge/ = Questions·Answers, reference/ = H1 없음)" },
  { id: 'K9', severity: 'error', rule: "file-placement '곁가지 분리 — <name>.sub.md'" },
  { id: 'K10', severity: 'error', rule: "file-placement §2 '명명 규칙'" },
  { id: 'K11', severity: 'error', rule: '폴더명과 같은 파일명 금지 (부모 폴더가 더 넓은 범위를 기술해야 함)' },
  { id: 'K12', severity: 'error', rule: "file-placement '곁가지 분리 — 깊이 한 단계'" },
  { id: 'K13', severity: 'error', rule: "file-placement '곁가지 분리 — frontmatter 상속'" },
  { id: 'K14', severity: 'error', rule: "content-format §1 'source'" },
  { id: 'K15', severity: 'error', rule: "content-format §1 'tags'" },
  { id: 'K16', severity: 'error', rule: "content-format §1 'priority'" },
  { id: 'E1', severity: 'error', rule: 'validate SKILL — explained 커버리지' },
  { id: 'E2', severity: 'error', rule: 'validate SKILL — explained 고아 섹션' },
  { id: 'E3', severity: 'error', rule: 'validate SKILL — explained 고아 파일' },
  { id: 'E4', severity: 'error', rule: "document-structure 'explained/ 파일 구조'" },
  { id: 'E5', severity: 'error', rule: 'validate SKILL — knowledge 짝 부재' },
  { id: 'E6', severity: 'error', rule: 'validate SKILL — 질문 순서' },
  { id: 'K17', severity: 'warn', rule: "content-format §3 '출처 명확성'" },
  { id: 'K18', severity: 'error', rule: "content-format §4 '작성 규칙 — 순수 URL만'" },
  { id: 'K19', severity: 'error', rule: "content-format §5 'Answer 내 위치 — Reference 바로 위'" },
  { id: 'K20', severity: 'error', rule: "document-structure '꼬리 질문이 다른 md에 있을 때'" },
  { id: 'K21', severity: 'error', rule: "content-format §0 '비속어 금지'" },
  { id: 'K22', severity: 'error', rule: "file-placement §4 '길이 상한'" },
  { id: 'E8', severity: 'error', rule: "exam SKILL '[UNVERIFIED] 질문의 H1 형식'" },
  { id: 'E9', severity: 'warn', rule: "explanation-guide §3 '세션 맥락 표현 금지'" },
  { id: 'E10', severity: 'error', rule: "directory-roles 'assets/'" },
  { id: 'E11', severity: 'warn', rule: "explanation-guide §1 '본문 — 원문 조각 인용 → 한글 의역'" },
  { id: 'W1', severity: 'warn', rule: "content-format §3 'OA 길이 관리'" },
  { id: 'W3', severity: 'warn', rule: "file-placement §1 '폴더 = 같은 주제 파일 모음'" },
  { id: 'R1', severity: 'warn', rule: '새 루트 디렉토리는 CLAUDE.md 구조표·directory-roles.md·list-candidates.md 세 곳에 기재' },
];

interface Finding {
  file: string; // POSIX rel path from KA_ROOT
  line: number; // 1-based; 0 = whole file
  check: string;
  severity: Severity;
  message: string;
}

// ---------- shared parsing ----------

interface Line {
  n: number; // 1-based line number
  text: string;
  inFence: boolean; // inside a ``` / ~~~ fenced code block (fence delimiter lines = true)
}

function toLines(src: string): Line[] {
  const out: Line[] = [];
  let inFence = false;
  src.split(/\r?\n/).forEach((text, i) => {
    // fence delimiters may be blockquote-nested (`> ```json`) — strip leading `>`/space
    const isFenceDelim = /^[\s>]*(```|~~~)/.test(text);
    const fenceState = inFence || isFenceDelim;
    out.push({ n: i + 1, text, inFence: fenceState });
    if (isFenceDelim) inFence = !inFence;
  });
  return out;
}

// F1 unbalanced code fence: odd number of ``` / ~~~ delimiters → an unclosed block
// swallows the rest of the document (headings become literal code). Applies to all files.
function lintFences(rel: string, lines: Line[]): Finding[] {
  const delims = lines.filter((l) => /^[\s>]*(```|~~~)/.test(l.text));
  if (delims.length % 2 === 1) {
    // line 0 (file-level): mixed blockquote/plain fences make the exact unclosed line
    // unreliable to pinpoint — flag the file; the fixer locates the bare-``` that's missing.
    return [{ file: rel, line: 0, check: 'F1', severity: 'error', message: `닫히지 않은 코드 펜스 (\`\`\` 구분자 ${delims.length}개 — 홀수, 이후 본문이 코드로 삼켜짐)` }];
  }
  return [];
}

function stripMarker(title: string): string {
  return title.replace(/^\[UNVERIFIED\]\s*/, '').trim();
}
function hasMarker(title: string): boolean {
  return /^\[UNVERIFIED\]\s/.test(title) || title.trim() === '[UNVERIFIED]';
}

// Questions list item is a cross-link if its text is a markdown link to another file:
// `[질문 → other.md](other.md#anchor)`. NOTE: must not match `[UNVERIFIED] ...` marker
// items (which also start with `[` but are not links) — detect the `](...)` link target.
function isCrossLink(itemText: string): boolean {
  return /\]\([^)]+\)/.test(itemText);
}

// ---------- path / filename checks (no body parsing) ----------

// K10: lowercase + hyphen only, optional `.sub` tail (file-placement §2 「명명 규칙」).
const FILENAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.sub)?\.md$/;

// Applies to knowledge/ AND explained/ — explained mirrors knowledge paths, so a bad name on
// either side breaks the pair. assets/ mirrors too but holds non-md files; out of scope here.
function lintFilePath(rel: string): Finding[] {
  const f: Finding[] = [];
  const base = rel.slice(rel.lastIndexOf('/') + 1);
  const dirRel = rel.slice(0, rel.lastIndexOf('/'));
  const dirName = dirRel.slice(dirRel.lastIndexOf('/') + 1);

  if (/\.sub\.sub\.md$/.test(base)) {
    // K12 depth: `.sub.sub.md` also fails FILENAME_RE, so report only the specific cause.
    f.push({ file: rel, line: 0, check: 'K12', severity: 'error', message: '곁가지 깊이 초과 `.sub.sub.md` (한 단계만 — 본편 옆 `<name>.sub.md`)' });
  } else if (!FILENAME_RE.test(base)) {
    f.push({ file: rel, line: 0, check: 'K10', severity: 'error', message: `파일명 "${base}" — 소문자+하이픈만 (대문자·공백·언더스코어 금지)` });
  }

  // K11 folder name == file name: `process/process.md`. The parent folder must describe a wider
  // scope than the file, otherwise the path repeats itself and the folder earns nothing.
  const stem = base.replace(/\.sub\.md$/, '').replace(/\.md$/, '');
  if (dirName && stem === dirName) {
    f.push({ file: rel, line: 0, check: 'K11', severity: 'error', message: `폴더명과 같은 파일명 "${dirName}/${base}" (부모 폴더가 더 넓은 범위를 기술해야 함)` });
  }
  return f;
}

// W3 single-file folder — `--staged` only. The rule exempts folders that already exist
// (file-placement §1: "기존에 만들어진 단일 파일 폴더는 소급 정리 대상이 아니다"), and a repo-wide
// run has no way to tell old from new — the staged set does. knowledge/ only: explained/·assets/
// mirror knowledge paths, so reporting all three would triple one placement decision.
function lintSingleFileFolder(rel: string): Finding[] {
  if (!rel.startsWith('knowledge/')) return [];
  const dirRel = rel.slice(0, rel.lastIndexOf('/'));
  if (dirRel === 'knowledge') return [];
  const abs = path.join(KA_ROOT, dirRel);
  if (!fs.existsSync(abs)) return [];
  const entries = fs.readdirSync(abs, { withFileTypes: true });
  if (entries.some((e) => e.isDirectory())) return [];
  const mds = entries.filter((e) => e.isFile() && e.name.endsWith('.md'));
  if (mds.length !== 1) return [];
  return [{ file: rel, line: 0, check: 'W3', severity: 'warn', message: `단일 파일 폴더 "${dirRel}/" (파일 하나뿐이고 하위 폴더도 없음 — 부모에 flat하게 두기 검토)` }];
}

// ---------- frontmatter ----------

interface FrontmatterEntry {
  value: string;
  line: number;
}
type Frontmatter = Map<string, FrontmatterEntry> | null; // null = no `---` block at all

// Line-by-line, never regex-across-the-file: `^key:\s*(.*)$` with `\s` matching newlines silently
// picks up the NEXT line's value when a key is empty.
function parseFrontmatter(lines: Line[]): Frontmatter {
  if (!lines.length || lines[0].text.trim() !== '---') return null;
  const out = new Map<string, FrontmatterEntry>();
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].text.trim() === '---') return out;
    const m = lines[i].text.match(/^([A-Za-z_][A-Za-z0-9_-]*):[ \t]*(.*)$/);
    if (m) out.set(m[1], { value: m[2].trim(), line: lines[i].n });
  }
  return null; // unterminated block — treat as absent
}

function parseTagList(value: string): string[] {
  const inner = value.replace(/^\[/, '').replace(/\]$/, '');
  return inner
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t !== '');
}

// Official tag registry — `- \`tag\`: 설명` lines in local/contexts/tags.md (the doc IS the source).
let tagRegistryCache: Set<string> | null = null;
function officialTags(): Set<string> {
  if (tagRegistryCache) return tagRegistryCache;
  const src = fs.readFileSync(path.join(KA_ROOT, 'local/contexts/tags.md'), 'utf8');
  tagRegistryCache = new Set([...src.matchAll(/^-\s+`([^`]+)`\s*:/gm)].map((m) => m[1]));
  return tagRegistryCache;
}

const SOURCE_VALUES = new Set(['official', 'google-doc', 'unverified']);
const PRIORITY_VALUES = new Set(['1', '2', '5', '']);
const MAX_TAGS = 4;

// K13~K16. knowledge/ only — explained/ files carry no frontmatter (they open with the H1).
function lintFrontmatter(rel: string, lines: Line[]): Finding[] {
  const f: Finding[] = [];
  const add = (line: number, check: string, message: string) =>
    f.push({ file: rel, line, check, severity: 'error' as Severity, message });

  const fm = parseFrontmatter(lines);
  if (!fm) {
    add(0, 'K14', 'frontmatter 블록 없음 (`---` … `---`에 tags·source 필요)');
    return f;
  }

  // K14 source
  const source = fm.get('source');
  if (!source) add(0, 'K14', '`source` 키 없음 (필수 — official/google-doc/unverified)');
  else if (!SOURCE_VALUES.has(source.value)) {
    add(source.line, 'K14', `source "${source.value}" — official/google-doc/unverified 중 하나여야 함`);
  }

  // K15 tags
  const tags = fm.get('tags');
  if (!tags) add(0, 'K15', '`tags` 키 없음 (필수 — 공식 목록에서 1~4개)');
  else {
    const list = parseTagList(tags.value);
    if (list.length === 0 || list.length > MAX_TAGS) {
      add(tags.line, 'K15', `tags ${list.length}개 (1~${MAX_TAGS}개여야 함)`);
    }
    const registry = officialTags();
    for (const t of list) {
      if (!registry.has(t)) add(tags.line, 'K15', `미등록 태그 "${t}" (local/contexts/tags.md에 먼저 등록)`);
    }
  }

  // K16 priority vocabulary. Absence is valid — the key only exists when the user assigned one.
  const priority = fm.get('priority');
  if (priority && !PRIORITY_VALUES.has(priority.value)) {
    add(priority.line, 'K16', `priority "${priority.value}" — 1/2/5/빈값만 허용 (3~4는 미확정)`);
  }

  // K13 sub-file inheritance: the sub carries the main's tags·source verbatim and has no priority
  // (it was split off BECAUSE it matters less — a priority there would contradict the split).
  if (rel.endsWith('.sub.md')) {
    if (priority) add(priority.line, 'K13', '곁가지에 `priority` 키 (상속하지 않음 — 키 자체를 두지 않는다)');
    const mainAbs = path.join(KA_ROOT, rel.replace(/\.sub\.md$/, '.md'));
    if (fs.existsSync(mainAbs)) {
      const mainFm = parseFrontmatter(toLines(fs.readFileSync(mainAbs, 'utf8')));
      for (const key of ['tags', 'source']) {
        const mine = fm.get(key)?.value ?? '(없음)';
        const theirs = mainFm?.get(key)?.value ?? '(없음)';
        if (mine !== theirs) {
          add(fm.get(key)?.line ?? 0, 'K13', `본편과 ${key} 불일치: 본편="${theirs}", 곁가지="${mine}" (그대로 상속)`);
        }
      }
    }
  }

  return f;
}

// ---------- profanity / session-context wording ----------

// K21. Korean only, on purpose: an English list flags Official Answer originals — `bullshitting`
// appears verbatim in the Wikipedia text quoted by knowledge/ai/llm/hallucination.md, and OA is the
// one place a foreign original must survive untouched.
const PROFANITY = ['씨발', '시발', '씨팔', '좆', '존나', '병신', '븅신', '지랄', '개새끼', '니미', '엿같', '닥쳐', '썅'];

function lintProfanity(rel: string, lines: Line[]): Finding[] {
  const f: Finding[] = [];
  for (const l of lines) {
    for (const w of PROFANITY) {
      if (l.text.includes(w)) {
        f.push({ file: rel, line: l.n, check: 'K21', severity: 'error', message: `비속어 "${w}" (강조는 일반 어휘로)` });
        break;
      }
    }
  }
  return f;
}

// E9. The phrase list lives in the rule doc, not here — explanation-guide §3 IS the list, so the
// place a human edits and the place the machine reads are one. Tables between the marker comments.
const SESSION_PHRASE_GUIDE = 'local/contexts/explanation-guide.md';
function markedRows(src: string, marker: string): string[] {
  const block = src.match(new RegExp(`<!--\\s*${marker}\\s*-->([\\s\\S]*?)<!--\\s*/${marker}\\s*-->`));
  if (!block) return [];
  return [...block[1].matchAll(/^\|\s*([^|]+?)\s*\|/gm)]
    .map((m) => m[1].trim())
    .filter((v) => v !== '' && !/^-+$/.test(v) && v !== '금지 문구' && v !== '예외 문구' && v !== '(없음)');
}

let sessionPhraseCache: { phrases: string[]; exceptions: string[] } | null = null;
function sessionPhraseLists(): { phrases: string[]; exceptions: string[] } {
  if (sessionPhraseCache) return sessionPhraseCache;
  const src = fs.readFileSync(path.join(KA_ROOT, SESSION_PHRASE_GUIDE), 'utf8');
  sessionPhraseCache = {
    phrases: markedRows(src, 'session-phrases'),
    exceptions: markedRows(src, 'session-phrase-exceptions'),
  };
  return sessionPhraseCache;
}

function lintSessionWording(rel: string, lines: Line[]): Finding[] {
  const { phrases, exceptions } = sessionPhraseLists();
  const f: Finding[] = [];
  for (const l of lines) {
    if (exceptions.some((e) => l.text.includes(e))) continue;
    for (const p of phrases) {
      if (l.text.includes(p)) {
        f.push({ file: rel, line: l.n, check: 'E9', severity: 'warn', message: `세션 맥락 표현 "${p}" — 독자 관점의 보편적 표현으로 (explanation-guide §3)` });
        break;
      }
    }
  }
  return f;
}

// ---------- knowledge model ----------

interface Question {
  raw: string;
  title: string; // marker-stripped
  marker: boolean;
  crossLink: boolean;
  line: number;
}
interface Section {
  level: number; // 3 or 4
  name: string;
  line: number;
  body: Line[]; // content lines until next heading/separator (blanks kept)
}
interface Block {
  rawTitle: string;
  title: string;
  marker: boolean;
  line: number;
  sections: Section[];
}
interface KnowledgeDoc {
  h1s: { text: string; line: number }[];
  questions: Question[];
  blocks: Block[];
}

function parseKnowledge(lines: Line[], kind: QaKind = 'knowledge'): KnowledgeDoc {
  const h1s: { text: string; line: number }[] = [];
  const questions: Question[] = [];
  const blocks: Block[] = [];

  let qStart = -1;
  // reference/ has no `# Answers` gate — its H2 blocks start at the top of the file. Line 0 is
  // before every real line, so the `l.n <= aStart` skip below lets all of them through.
  let aStart = kind === 'reference' ? 0 : -1;
  for (const l of lines) {
    if (l.inFence) continue;
    const h1 = l.text.match(/^#\s+(.+?)\s*$/);
    if (h1) {
      h1s.push({ text: h1[1].trim(), line: l.n });
      if (kind === 'knowledge') {
        if (h1[1].trim() === 'Questions') qStart = l.n;
        if (h1[1].trim() === 'Answers') aStart = l.n;
      }
    }
  }

  // Questions: list items between `# Questions` and `# Answers`.
  if (qStart >= 0) {
    const end = aStart >= 0 ? aStart : Infinity;
    for (const l of lines) {
      if (l.n <= qStart || l.n >= end || l.inFence) continue;
      const m = l.text.match(/^\s*-\s+(.+?)\s*$/);
      if (!m) continue;
      const raw = m[1];
      questions.push({
        raw,
        title: stripMarker(raw),
        marker: hasMarker(raw),
        crossLink: isCrossLink(raw),
        line: l.n,
      });
    }
  }

  // Answers: split into H2 blocks after `# Answers`.
  if (aStart >= 0) {
    let cur: Block | null = null;
    let curSection: Section | null = null;
    for (const l of lines) {
      if (l.n <= aStart) continue;
      if (l.inFence) {
        if (curSection) curSection.body.push(l);
        continue;
      }
      const h2 = l.text.match(/^##\s+(?!#)(.+?)\s*$/);
      const h3 = l.text.match(/^###\s+(?!#)(.+?)\s*$/);
      const h4 = l.text.match(/^####\s+(.+?)\s*$/);
      if (h2) {
        if (cur) blocks.push(cur);
        cur = { rawTitle: h2[1].trim(), title: stripMarker(h2[1]), marker: hasMarker(h2[1]), line: l.n, sections: [] };
        curSection = null;
      } else if (h3 && cur) {
        curSection = { level: 3, name: h3[1].trim(), line: l.n, body: [] };
        cur.sections.push(curSection);
      } else if (h4 && cur) {
        curSection = { level: 4, name: h4[1].trim(), line: l.n, body: [] };
        cur.sections.push(curSection);
      } else if (curSection) {
        curSection.body.push(l);
      }
    }
    if (cur) blocks.push(cur);
  }

  return { h1s, questions, blocks };
}

// non-blank, non-separator content lines
function meaningful(body: Line[]): Line[] {
  return body.filter((l) => l.text.trim() !== '' && !/^---\s*$/.test(l.text.trim()));
}

// H4 subsections immediately following an H3 (its `#### Category` children, e.g. OA hierarchy)
function h4Children(block: Block, h3Index: number): Section[] {
  const out: Section[] = [];
  for (let j = h3Index + 1; j < block.sections.length; j++) {
    if (block.sections[j].level === 4) out.push(block.sections[j]);
    else break;
  }
  return out;
}

// An H3 section has content if its own body is non-empty OR any of its H4 children has content.
function sectionHasContent(block: Block, h3Index: number): boolean {
  if (meaningful(block.sections[h3Index].body).length > 0) return true;
  return h4Children(block, h3Index).some((c) => meaningful(c.body).length > 0);
}

// GitHub-flavoured heading anchor: lowercase, drop punctuation, spaces → hyphens.
// Korean syllables survive as-is (they are letters), which is why the anchors in this repo read
// like `#tls가-데이터를-암호화하는-…`.
function slugify(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

function headingSlugs(src: string): Set<string> {
  const out = new Set<string>();
  for (const l of toLines(src)) {
    if (l.inFence) continue;
    const m = l.text.match(/^#{1,6}\s+(.+?)\s*$/);
    if (m) out.add(slugify(m[1]));
  }
  return out;
}

// ---------- knowledge checks ----------

function lintKnowledge(rel: string, src: string, kind: QaKind = 'knowledge'): Finding[] {
  const f: Finding[] = [];
  const add = (line: number, check: string, message: string, severity: Severity = 'error') =>
    f.push({ file: rel, line, check, severity, message });

  const lines = toLines(src);
  f.push(...lintFences(rel, lines));
  f.push(...lintFilePath(rel));
  f.push(...lintFrontmatter(rel, lines));

  // K22 length cap — file-placement §4, which says "**knowledge 문서는** 400줄을 초과할 수 없다" and
  // hands the split decision to the user ("AI가 임의로 분할하지 않는다"). knowledge/ only, for two
  // separate reasons: explained/ is generated prose whose length tracks the explanation, and
  // reference/ is a search-and-look-up store whose rule text does not carry the cap. toLines already
  // normalised CRLF, so the count matches what an editor shows.
  if (kind === 'knowledge' && lines.length > 400) {
    add(0, 'K22', `문서 ${lines.length}줄 (>400) — 분할 필요`);
  }

  f.push(...lintProfanity(rel, lines));
  const doc = parseKnowledge(lines, kind);

  // K20 cross-link target: `- [질문 → \`파일.md\`](상대경로#앵커)` must point at a file that exists,
  // at a heading that exists. A cross-link is exempt from the TOC↔body 1:1 rule (K7) precisely
  // because its answer lives elsewhere — so if the elsewhere is wrong, nothing else notices.
  const docDirAbs = path.dirname(path.join(KA_ROOT, rel));
  for (const q of doc.questions.filter((x) => x.crossLink)) {
    // (reference/ has no TOC, so doc.questions is empty there and this loop — like K7·K6·K20 — never fires)
    const m = q.raw.match(/\]\(([^)]+)\)/);
    if (!m) continue;
    const [target, anchor] = m[1].split('#');
    if (!target || /^https?:/.test(target)) continue; // external link — not our business
    const targetAbs = path.resolve(docDirAbs, target);
    if (!fs.existsSync(targetAbs)) {
      add(q.line, 'K20', `꼬리질문 cross-link 대상 없음: ${target}`);
      continue;
    }
    if (!anchor) continue;
    const slugs = headingSlugs(fs.readFileSync(targetAbs, 'utf8'));
    if (!slugs.has(anchor)) {
      add(q.line, 'K20', `꼬리질문 cross-link 앵커 없음: ${target}#${anchor} (대상 파일에 그 제목의 헤딩이 없음)`);
    }
  }

  // E5 missing pair: knowledge/<rel>.md must have explained/<rel>.md. knowledge↔explained is a
  // set — same folder path, same filename, same questions. E1~E3 only fire when the explained
  // file exists (the walk starts from explained/), so a knowledge doc with no pair at all slips
  // through silently; this check closes that direction.
  // reference/ is exempt: it holds no explanation cache (directory-roles 「explained/」 mirrors
  // knowledge/ alone), so every reference doc would report a missing pair that must never exist.
  const relNoRoot = rel.replace(/^knowledge\//, '');
  if (kind === 'knowledge' && !fs.existsSync(path.join(EXPLAINED_DIR, relNoRoot))) {
    add(0, 'E5', `대응 explained/${relNoRoot} 없음 (셋트 미성립 — /digest로 해설 생성 필요)`);
  }

  // K9 orphan sub file: knowledge/<rel>/<name>.sub.md must sit next to its main <name>.md.
  // main↔sub is a vertical pair held together by filename alone — E3/E5 only check the horizontal
  // knowledge↔explained pair, so moving the main file and leaving the sub behind passes silently.
  if (rel.endsWith('.sub.md')) {
    const mainAbs = path.join(KA_ROOT, rel.replace(/\.sub\.md$/, '.md'));
    if (!fs.existsSync(mainAbs)) {
      const mainRel = rel.replace(/\.sub\.md$/, '.md');
      add(0, 'K9', `본편 ${mainRel} 없음 (곁가지만 남음 — 본편 이동 시 .sub.md도 동반 이동)`);
    }
  }

  // K1 Official Annotation residue
  for (const l of lines) {
    if (!l.inFence && /^>\s*####\s*Official Annotation:/.test(l.text)) {
      add(l.n, 'K1', '폐지된 `> #### Official Annotation:` 블록 잔재');
    }
  }

  // K8 disallowed H1 — the allowed set is per-root. knowledge/ keeps its two wrapper headings;
  // reference/ has no wrapper at all, so any H1 there is a stray (질문 제목이 H2로 최상위에 온다).
  for (const h of doc.h1s) {
    if (kind === 'reference') {
      add(h.line, 'K8', `reference/ 문서에 H1: "# ${h.text}" (H1 없음이 정상 — 질문 제목이 H2로 최상위)`);
    } else if (h.text !== 'Questions' && h.text !== 'Answers') {
      add(h.line, 'K8', `허용되지 않은 H1: "# ${h.text}" (Questions/Answers만 허용)`);
    }
  }

  // K7 TOC ↔ body order
  const qTitles = doc.questions.filter((q) => !q.crossLink).map((q) => q.title);
  const aTitles = doc.blocks.map((b) => b.title);
  if (doc.questions.length && doc.blocks.length) {
    const len = Math.max(qTitles.length, aTitles.length);
    for (let i = 0; i < len; i++) {
      if (qTitles[i] !== aTitles[i]) {
        const qLine = doc.blocks[i]?.line ?? doc.questions.find((q) => !q.crossLink)?.line ?? 0;
        add(
          qLine,
          'K7',
          `목차-본문 순서 불일치 (#${i + 1}): 목차="${qTitles[i] ?? '(없음)'}" vs 본문="${aTitles[i] ?? '(없음)'}"`,
        );
        break; // first divergence is enough to act on
      }
    }
  }

  for (const b of doc.blocks) {
    // K3 duplicate heading within a Q&A
    const counts = new Map<string, number>();
    for (const s of b.sections) {
      if (s.level === 3 && ANSWER_HEADINGS.includes(s.name)) {
        counts.set(s.name, (counts.get(s.name) ?? 0) + 1);
      }
    }
    for (const [name, c] of counts) {
      if (c > 1) add(b.line, 'K3', `Q&A "${b.title}" 내 "### ${name}" 헤딩 ${c}개 중복`);
    }

    const oaSections = b.sections.filter((s) => s.level === 3 && s.name === 'Official Answer');
    const oa = oaSections[0];

    // K17 OA without Reference. One direction only: Reference-without-OA is a legitimate
    // in-progress state (content-format §3 「출처-Answer 매핑」), so it is not flagged.
    const h3Names = new Set(b.sections.filter((s) => s.level === 3).map((s) => s.name));
    if (h3Names.has('Official Answer') && !h3Names.has('Reference')) {
      add(oa.line, 'K17', `Official Answer에 대응하는 "### Reference" 없음 (출처 명시 필요)`, 'warn');
    }

    // K18 Reference item form: the item starts with a bare URL, or says `(URL_UNKNOWN)`.
    // Markdown link syntax is out — it hides the URL behind a label, and Reference is read as a
    // URL list by humans and scripts alike. A trailing parenthetical note after the URL is fine
    // (`- https://… (Dijkstra, 1974)`): the URL is still bare and first.
    for (const s of b.sections.filter((x) => x.level === 3 && x.name === 'Reference')) {
      for (const l of meaningful(s.body)) {
        if (l.inFence) continue;
        const item = l.text.match(/^\s*-\s+(.*)$/)?.[1]?.trim();
        if (!item) continue;
        if (/\]\([^)]*\)/.test(item)) {
          add(l.n, 'K18', `Reference에 마크다운 링크 문법 "${item.slice(0, 40)}" (순수 URL로 기재)`);
        } else if (!/^https?:\/\//.test(item) && !item.includes('(URL_UNKNOWN)')) {
          add(l.n, 'K18', `Reference 항목에 URL 없음 "${item.slice(0, 40)}" (순수 URL 또는 \`설명 (URL_UNKNOWN)\`)`);
        }
      }
    }

    // K19 note placement: content-format §5 puts Review Note·Frequent Mistakes directly above
    // `### Reference`. Strict reading — any other H3 wedged between them and Reference violates it,
    // and so does a note sitting after Reference. A block without Reference is exempt: both
    // sections are optional and there is no anchor to measure against.
    const h3s = b.sections.filter((s) => s.level === 3);
    const refIdx = h3s.findIndex((s) => s.name === 'Reference');
    if (refIdx >= 0) {
      const notes = h3s.filter((s) => NOTE_HEADINGS.includes(s.name));
      // the notes must fill the `notes.length` slots immediately before Reference
      const windowStart = refIdx - notes.length;
      for (const n of notes) {
        const i = h3s.indexOf(n);
        if (i < windowStart || i >= refIdx) {
          const between = h3s.slice(Math.min(i, refIdx) + 1, Math.max(i, refIdx)).map((s) => `### ${s.name}`);
          add(n.line, 'K19', `"### ${n.name}"이 "### Reference" 바로 위가 아님 (사이: ${between.join(', ') || '없음 — Reference 아래에 위치'})`);
        }
      }
    }

    b.sections.forEach((s, si) => {
      if (s.level !== 3 || !ANSWER_HEADINGS.includes(s.name)) return;
      // K2 empty section (H4 subsection content counts — OA hierarchy is valid)
      if (!sectionHasContent(b, si)) {
        add(s.line, 'K2', `빈 섹션 "### ${s.name}" (본문 없으면 헤딩 삭제)`);
      }
    });

    // K4 inline `— URL`, K5 Korean anywhere in OA body — OA + its H4 subsections only
    const oaScopeStart = oa?.line ?? -1;
    if (oaScopeStart >= 0) {
      // collect OA-scope sections: the OA H3 and following H4s until next H3
      const idx = b.sections.indexOf(oa);
      const scope: Section[] = [oa];
      for (let j = idx + 1; j < b.sections.length; j++) {
        if (b.sections[j].level === 4) scope.push(b.sections[j]);
        else break;
      }
      for (const s of scope) {
        // K5 Korean anywhere in OA body. OA는 공식 원문만 담으므로 한글이 한 글자라도 있으면
        // 원문이 아니다 — 위치를 가리지 않는다(도입 문장이든 문단 사이든 문장 안 주석이든).
        // 예외를 두지 않는 것이 요점이다: 예외를 열면 "원문인가 내가 쓴 것인가"라는 판단이
        // 되살아나 기계 판정이 깨진다. 보충 설명은 User/Additional Answer에 쓴다
        // (content-format 「OA 한글 금지」).
        // `#### H4` 소제목은 제외한다 — 원문이 아니라 구조 표시이고, content-format이
        // OA 내부 위계에 한글 소제목을 예시로 든다.
        for (const l of s.body) {
          if (l.inFence) continue;
          if (/^\s*#{1,6}\s/.test(l.text)) continue;
          if (HANGUL.test(l.text)) {
            add(l.n, 'K5', `OA 안 한글 ("${l.text.trim().slice(0, 30)}…") — 원문만 담는다`);
          }
        }
        // K4 em/en-dash + URL inside body
        for (const l of s.body) {
          if (l.inFence) continue;
          if (/[—–]\s*https?:\/\//.test(l.text)) {
            add(l.n, 'K4', '인라인 출처 `— URL` (Reference로 이동)');
          }
        }
      }
      // W1 OA length — split into paragraphs on blank lines first (content-format "단락 사이는 빈 줄로 구분"),
      // since joining all lines with a space before splitting on `\n\s*\n` never finds a match.
      const paraGroups: Line[][] = [];
      let currentPara: Line[] = [];
      for (const l of oa.body) {
        if (/^---\s*$/.test(l.text.trim())) continue; // section separator, not paragraph content
        if (l.text.trim() === '') {
          if (currentPara.length) paraGroups.push(currentPara);
          currentPara = [];
        } else {
          currentPara.push(l);
        }
      }
      if (currentPara.length) paraGroups.push(currentPara);

      let total = 0;
      for (const group of paraGroups) {
        const p = group
          .filter((l) => !l.inFence) // drop code blocks
          .filter((l) => !/^\s*([-*|]|\d+\.)\s/.test(l.text)) // drop list/table rows (bulleted or numbered)
          .map((l) => l.text)
          .join(' ');
        const sentences = (p.match(/[.!?。](\s|$)/g) ?? []).length;
        total += sentences;
        if (sentences > 6) add(oa.line, 'W1', `OA 단락 ${sentences}문장 (>6) — 정리 검토`, 'warn');
      }
      if (total > 15) add(oa.line, 'W1', `OA 전체 ${total}문장 (>15) — 질문 분리 검토`, 'warn');
    }

    // K6 marker consistency (deterministic subset)
    const q = doc.questions.find((x) => !x.crossLink && x.title === b.title);
    if (q) {
      // (a) desync between TOC item and body heading
      if (q.marker !== b.marker) {
        add(b.line, 'K6', `[UNVERIFIED] 마커 불일치: 목차=${q.marker ? '있음' : '없음'}, 본문=${b.marker ? '있음' : '없음'}`);
      }
      // (b) marked but OA has content (incl. H4 subsections)
      if (b.marker && oa && sectionHasContent(b, b.sections.indexOf(oa))) {
        add(oa.line, 'K6', `[UNVERIFIED] 마커가 붙었으나 Official Answer에 본문 존재 (마커 제거)`);
      }
    }
  }

  return f;
}

// ---------- explained checks ----------

// own (non-cross-link) questions, in order. Titles are marker-stripped; `marker` keeps the
// [UNVERIFIED] fact that E8 compares (every other explained check compares stripped titles).
function knowledgeQuestions(knowledgeAbs: string): Question[] {
  const src = fs.readFileSync(knowledgeAbs, 'utf8');
  const doc = parseKnowledge(toLines(src));
  return doc.questions.filter((q) => !q.crossLink);
}

// Titles (marker-stripped) whose Official Answer actually holds text, in a file written against a
// primary source. E11 needs exactly this set: a question with no OA has no original to quote, and a
// file that was not written from an official document has no English original to begin with.
function quotableQuestions(knowledgeAbs: string): Set<string> {
  const lines = toLines(fs.readFileSync(knowledgeAbs, 'utf8'));
  if (parseFrontmatter(lines)?.get('source')?.value !== 'official') return new Set();
  const out = new Set<string>();
  for (const b of parseKnowledge(lines).blocks) {
    const oaIndex = b.sections.findIndex((s) => s.level === 3 && s.name === 'Official Answer');
    if (oaIndex >= 0 && sectionHasContent(b, oaIndex)) out.add(b.title);
  }
  return out;
}

function lintExplained(rel: string, src: string): Finding[] {
  const f: Finding[] = [];
  const add = (line: number, check: string, message: string, severity: Severity = 'error') =>
    f.push({ file: rel, line, check, severity, message });

  const lines = toLines(src);
  f.push(...lintFences(rel, lines));
  f.push(...lintFilePath(rel));
  f.push(...lintProfanity(rel, lines));
  f.push(...lintSessionWording(rel, lines));

  // E4 separator duplication: consecutive `---` with only blanks between (outside fence)
  let prevSep = -2;
  for (const l of lines) {
    if (l.inFence) continue;
    if (/^---\s*$/.test(l.text.trim())) {
      // is everything between prevSep and here blank?
      if (prevSep >= 0) {
        const between = lines.filter((x) => x.n > prevSep && x.n < l.n);
        if (between.every((x) => x.text.trim() === '')) {
          add(l.n, 'E4', '연속 `---` 구분자 (1개로 통합)');
        }
      }
      prevSep = l.n;
    } else if (l.text.trim() !== '') {
      prevSep = -2; // reset on real content
    }
  }

  // explained H1 titles, each carrying the lines up to the next H1 (E11 reads that body).
  const h1s = lines
    .filter((l) => !l.inFence && /^#\s+(?!#)(.+)/.test(l.text))
    .map((l) => {
      const raw = l.text.replace(/^#\s+/, '').trim();
      return { title: stripMarker(raw), marker: hasMarker(raw), line: l.n, body: [] as Line[] };
    });
  let openSection: (typeof h1s)[number] | undefined;
  for (const l of lines) {
    const startsHere = h1s.find((h) => h.line === l.n);
    if (startsHere) openSection = startsHere;
    else openSection?.body.push(l);
  }

  // resolve matching knowledge file
  const relNoExt = rel.replace(/^explained\//, '').replace(/\.md$/, '');
  const knowledgeAbs = path.join(KNOWLEDGE_DIR, relNoExt + '.md');
  if (!fs.existsSync(knowledgeAbs)) {
    // E3 orphan file
    add(0, 'E3', `대응 knowledge/${relNoExt}.md 없음 (고아 파일)`);
    return f;
  }

  const kQuestions = knowledgeQuestions(knowledgeAbs);
  const kTitles = kQuestions.map((q) => q.title);
  const kSet = new Set(kTitles);
  const eSet = new Set(h1s.map((h) => h.title));

  // E2 orphan section: explained H1 not in knowledge questions
  for (const h of h1s) {
    if (!kSet.has(h.title)) add(h.line, 'E2', `고아 섹션 "${h.title}" (knowledge Questions에 없음)`);
  }
  // E1 coverage: each knowledge own-question present as explained H1
  for (const t of kTitles) {
    if (!eSet.has(t)) add(0, 'E1', `커버리지 누락: "${t}" (explained에 H1 없음 — /digest로 해설 생성 필요)`);
  }

  // E6 order: shared questions must appear in the same sequence on both sides. explained is what
  // the user actually reads when reviewing, so its section order is the learning order — it must
  // not drift from the knowledge question order. Compare only titles present on both sides so
  // that E1/E2 (missing/orphan) stay the sole reporters of their own problems.
  const kShared = kTitles.filter((t) => eSet.has(t));
  const eShared = h1s.filter((h) => kSet.has(h.title));
  for (let i = 0; i < kShared.length; i++) {
    if (eShared[i] && eShared[i].title !== kShared[i]) {
      add(eShared[i].line, 'E6', `질문 순서 불일치: knowledge ${i + 1}번째는 "${kShared[i]}"`);
      break; // one shift misaligns everything after it — reporting the first is enough
    }
  }

  // E8 [UNVERIFIED] marker parity. E1·E2·E6 all compare marker-STRIPPED titles (so that adding or
  // removing a marker never looks like a different question), which leaves marker parity unwatched.
  // This check is that missing axis — added here, not by un-stripping the shared comparison, so
  // E1/E2/E6 behaviour is untouched. Rule: exam SKILL 「[UNVERIFIED] 질문의 H1 형식」.
  const kMarkerByTitle = new Map(kQuestions.map((q) => [q.title, q.marker]));
  for (const h of h1s) {
    const kMarker = kMarkerByTitle.get(h.title);
    if (kMarker === undefined || kMarker === h.marker) continue;
    add(h.line, 'E8', `[UNVERIFIED] 마커 불일치: knowledge=${kMarker ? '있음' : '없음'}, explained H1=${h.marker ? '있음' : '없음'}`);
  }

  // E11 원문 인용 부재. explanation-guide §1은 본문을 「원문 조각 `>` 블록쿼트 인용 → 한글 의역 →
  // 영단어 해설」로 정하는데, 인용을 통째로 빼고 한글 요약만 적어도 지금까지 아무도 못 잡았다.
  // digest OFF 2단계가 세션마다 검증 에이전트에게 시키던 대조인데, 그 위임은 그 세션에 만진 질문만
  // 보므로 예전에 샌 것은 영영 안 걸린다. 여기서 전부 본다.
  // 판정은 「영문이 든 `>` 줄이 하나라도 있는가」뿐이다 — 인용이 원문 그대로인지는 OA↔Reference
  // 대조(축 ①)의 몫이라 여기서 보지 않는다.
  const quotable = quotableQuestions(knowledgeAbs);
  for (const h of h1s) {
    if (!quotable.has(h.title)) continue;
    if (h.body.some((l) => /^\s*>/.test(l.text) && /[A-Za-z]{3}/.test(l.text))) continue;
    add(h.line, 'E11', `"${h.title}" — Official Answer 원문을 \`>\` 블록쿼트로 인용한 곳이 없음 (한글 의역만 있음)`, 'warn');
  }

  return f;
}

// ---------- repo-level checks (target is the repo, not a knowledge/explained file) ----------

// Tooling roots, not content roots. The CLAUDE.md checklist is about content roots (its example is
// `archives/`) — these three hold scripts·rules·meta docs and have no role entry to write.
const NON_CONTENT_ROOTS = new Set(['scripts', 'local', 'meta', 'node_modules']);

const ROOT_DOC_FILES = [
  'CLAUDE.md',
  'local/contexts/directory-roles.md',
  'local/contexts/list-candidates.md',
];

function lintRepo(): Finding[] {
  const f: Finding[] = [];

  // R1: every content root is documented in all three files the CLAUDE.md checklist names.
  // Adding a root and forgetting one of them is the failure mode — the root then exists with no
  // stated role and no statement about whether list-candidates scans it.
  const roots = fs
    .readdirSync(KA_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !NON_CONTENT_ROOTS.has(e.name))
    .map((e) => e.name);
  for (const doc of ROOT_DOC_FILES) {
    const abs = path.join(KA_ROOT, doc);
    if (!fs.existsSync(abs)) continue;
    const src = fs.readFileSync(abs, 'utf8');
    for (const root of roots) {
      if (!src.includes(`${root}/`)) {
        f.push({ file: doc, line: 0, check: 'R1', severity: 'warn', message: `루트 디렉토리 \`${root}/\` 미기재 (새 루트 추가 시 CLAUDE.md 구조표·directory-roles.md·list-candidates.md 세 곳 갱신)` });
      }
    }
  }

  // E10: every asset belongs to a knowledge doc. `assets/<rel>/<파일>` ↔ `knowledge/<rel>.md`,
  // no exceptions — the mirror path IS the ownership record, so an asset whose owner cannot be
  // computed has no owner. Repo-level (not per-file) because assets are not .md documents.
  const assetsDir = path.join(KA_ROOT, 'assets');
  if (fs.existsSync(assetsDir)) {
    for (const abs of walkFiles(assetsDir)) {
      const rel = relPosix(abs);
      const ownerRel = `knowledge/${rel.replace(/^assets\//, '').replace(/\/[^/]+$/, '')}.md`;
      if (!fs.existsSync(path.join(KA_ROOT, ownerRel))) {
        f.push({ file: rel, line: 0, check: 'E10', severity: 'error', message: `대응 ${ownerRel} 없음 (자산은 knowledge 경로를 미러링한다 — assets/<rel>/<파일명>)` });
      }
    }
  }

  return f;
}

// ---------- file discovery ----------

function walkMd(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(abs));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(abs);
  }
  return out;
}

// all files (any extension) — assets/ holds html·images, not .md
function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(abs));
    else if (e.isFile()) out.push(abs);
  }
  return out;
}

function relPosix(abs: string): string {
  return path.relative(KA_ROOT, abs).split(path.sep).join('/');
}

function gitPaths(args: string): string[] {
  const out = execSync(`git ${args}`, { cwd: KA_ROOT, encoding: 'utf8' });
  return out
    .split(/\r?\n/)
    .filter((p) => /^(knowledge|reference|explained)\/.*\.md$/.test(p))
    .map((p) => path.join(KA_ROOT, p))
    .filter((p) => fs.existsSync(p));
}

function changedFiles(baseRef: string): string[] {
  return gitPaths(`diff --name-only ${baseRef}..HEAD`);
}

// files staged for the current commit — what the pre-commit hook gates on. Scoping to the staged
// set (not the whole repo) keeps pre-existing violations elsewhere from blocking unrelated commits.
function stagedFiles(): string[] {
  return gitPaths('diff --cached --name-only --diff-filter=ACMR');
}

// ---------- main ----------

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const changedIdx = argv.indexOf('--changed');
const staged = argv.includes('--staged');
let targets: string[];

if (staged) {
  targets = stagedFiles();
} else if (changedIdx >= 0) {
  const ref = argv[changedIdx + 1];
  if (!ref) {
    console.error('--changed requires a <baseRef> argument');
    process.exit(2);
  }
  targets = changedFiles(ref);
} else {
  const positional = argv.filter((a) => !a.startsWith('--'));
  if (positional.length) {
    targets = positional.flatMap((p) => {
      const abs = path.isAbsolute(p) ? p : path.join(KA_ROOT, p);
      if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) return walkMd(abs);
      return [abs];
    });
  } else {
    targets = [...walkMd(KNOWLEDGE_DIR), ...walkMd(REFERENCE_DIR), ...walkMd(EXPLAINED_DIR)];
  }
}

const findings: Finding[] = [];
for (const abs of targets) {
  const rel = relPosix(abs);
  if (!fs.existsSync(abs)) continue;
  const src = fs.readFileSync(abs, 'utf8');
  if (rel.startsWith('knowledge/')) findings.push(...lintKnowledge(rel, src, 'knowledge'));
  else if (rel.startsWith('reference/')) findings.push(...lintKnowledge(rel, src, 'reference'));
  else if (rel.startsWith('explained/')) findings.push(...lintExplained(rel, src));
  if (staged) findings.push(...lintSingleFileFolder(rel));
}

// Repo-level checks have no file target, so they run on every whole-repo pass (full scan, --staged,
// --changed) but not when the caller narrowed the run to specific paths.
const positionalTargets = argv.filter((a) => !a.startsWith('--'));
const narrowed = !staged && changedIdx < 0 && positionalTargets.length > 0;
if (!narrowed) findings.push(...lintRepo());

const errors = findings.filter((x) => x.severity === 'error');
const warns = findings.filter((x) => x.severity === 'warn');

if (asJson) {
  console.log(JSON.stringify({ targets: targets.length, errors: errors.length, warnings: warns.length, findings }, null, 2));
} else {
  const byFile = new Map<string, Finding[]>();
  for (const x of findings) {
    if (!byFile.has(x.file)) byFile.set(x.file, []);
    byFile.get(x.file)!.push(x);
  }
  for (const [file, items] of [...byFile.entries()].sort()) {
    console.log(`\n${file}`);
    for (const x of items.sort((a, b) => a.line - b.line)) {
      const tag = x.severity === 'warn' ? `(warn ${x.check})` : `[${x.check}]`;
      console.log(`  ${String(x.line).padStart(4)}  ${tag}  ${x.message}`);
    }
  }
  console.log(
    `\n${targets.length} files scanned — ${errors.length} error(s), ${warns.length} warning(s).`,
  );
}

process.exit(errors.length > 0 ? 1 : 0);
