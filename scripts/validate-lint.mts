/**
 * Deterministic linter for KA knowledge/ and explained/ documents.
 *
 * Enforces the mechanically-decidable subset of the `validate` skill's checks
 * (grep / regex / structural). Judgment checks (OA language = English-original
 * vs Korean paraphrase, cross-file duplicate-explanation, Reference URL lookup)
 * stay in the validate skill (LLM). Rule definitions live in local/contexts/*.md;
 * this script only ENFORCES them — each check cites its source rule.
 *
 * Checks (hard violations → exit 1):
 *   F1 unbalanced code fence            (integrity — odd ``` count swallows the rest as code)
 *   K1 Official Annotation residue      validate SKILL
 *   K2 empty section                    content-format §3 '빈 섹션 금지'
 *   K3 duplicate heading in a Q&A        content-format §3 '동일 헤딩 중복 금지'
 *   K4 inline source `— URL` in OA       content-format §3 '출처 표기는 Reference에만'
 *   K5 Korean line right after OA/H4     content-format §3 'OA 앞 한글 추가 금지'
 *   K6 [UNVERIFIED] marker consistency   document-structure '미완성 질문 처리'
 *   K7 TOC↔body question order 1:1       document-structure '목차-본문 순서 동기화'
 *   K8 disallowed H1                     document-structure '허용 H1 헤딩'
 *   E1 explained coverage                validate SKILL explained
 *   E2 explained orphan section          validate SKILL explained
 *   E3 explained orphan file             validate SKILL explained
 *   E4 explained separator duplication   document-structure 'explained/ 파일 구조'
 *
 * Warnings (exit 0 — suggestion only):
 *   W1 OA length (>6 sentences/para, >15 total)   content-format §3 'OA 길이 관리'
 *
 * Usage:
 *   npx tsx scripts/validate-lint.mts                       # all knowledge/ + explained/
 *   npx tsx scripts/validate-lint.mts knowledge/cs          # specific path(s)
 *   npx tsx scripts/validate-lint.mts --changed <baseRef>   # only git-changed files in <ref>..HEAD
 *   npx tsx scripts/validate-lint.mts --json                # machine-readable output
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const KA_ROOT = path.resolve(import.meta.dirname, '..');
const KNOWLEDGE_DIR = path.join(KA_ROOT, 'knowledge');
const EXPLAINED_DIR = path.join(KA_ROOT, 'explained');

const HANGUL = /[가-힣㄰-㆏ᄀ-ᇿ]/;
const ANSWER_HEADINGS = ['Official Answer', 'Additional Answer', 'User Answer', 'Reference'];

type Severity = 'error' | 'warn';
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

function parseKnowledge(lines: Line[]): KnowledgeDoc {
  const h1s: { text: string; line: number }[] = [];
  const questions: Question[] = [];
  const blocks: Block[] = [];

  let qStart = -1;
  let aStart = -1;
  for (const l of lines) {
    if (l.inFence) continue;
    const h1 = l.text.match(/^#\s+(.+?)\s*$/);
    if (h1) {
      h1s.push({ text: h1[1].trim(), line: l.n });
      if (h1[1].trim() === 'Questions') qStart = l.n;
      if (h1[1].trim() === 'Answers') aStart = l.n;
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

// ---------- knowledge checks ----------

function lintKnowledge(rel: string, src: string): Finding[] {
  const f: Finding[] = [];
  const add = (line: number, check: string, message: string, severity: Severity = 'error') =>
    f.push({ file: rel, line, check, severity, message });

  const lines = toLines(src);
  f.push(...lintFences(rel, lines));
  const doc = parseKnowledge(lines);

  // K1 Official Annotation residue
  for (const l of lines) {
    if (!l.inFence && /^>\s*####\s*Official Annotation:/.test(l.text)) {
      add(l.n, 'K1', '폐지된 `> #### Official Annotation:` 블록 잔재');
    }
  }

  // K8 disallowed H1
  for (const h of doc.h1s) {
    if (h.text !== 'Questions' && h.text !== 'Answers') {
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

    b.sections.forEach((s, si) => {
      if (s.level !== 3 || !ANSWER_HEADINGS.includes(s.name)) return;
      // K2 empty section (H4 subsection content counts — OA hierarchy is valid)
      if (!sectionHasContent(b, si)) {
        add(s.line, 'K2', `빈 섹션 "### ${s.name}" (본문 없으면 헤딩 삭제)`);
      }
    });

    // K4 inline `— URL`, K5 Korean-first-line — OA + its H4 subsections only
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
        // K5 first meaningful body line is Korean
        const first = meaningful(s.body)[0];
        if (first && !first.inFence && HANGUL.test(first.text.trimStart()[0] ?? '')) {
          add(first.n, 'K5', `OA 앞 한글 도입 문장 ("${first.text.trim().slice(0, 30)}…")`);
        }
        // K4 em/en-dash + URL inside body
        for (const l of s.body) {
          if (l.inFence) continue;
          if (/[—–]\s*https?:\/\//.test(l.text)) {
            add(l.n, 'K4', '인라인 출처 `— URL` (Reference로 이동)');
          }
        }
      }
      // W1 OA length
      const oaText = meaningful(oa.body)
        .filter((l) => !/^\s*[-*|]/.test(l.text)) // drop list/table rows
        .map((l) => l.text)
        .join(' ');
      const paras = oaText.split(/\n\s*\n/);
      let total = 0;
      for (const p of paras) {
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

// own (non-cross-link) question titles, marker-stripped, in order
function knowledgeQuestionTitles(knowledgeAbs: string): string[] {
  const src = fs.readFileSync(knowledgeAbs, 'utf8');
  const doc = parseKnowledge(toLines(src));
  return doc.questions.filter((q) => !q.crossLink).map((q) => q.title);
}

function lintExplained(rel: string, src: string): Finding[] {
  const f: Finding[] = [];
  const add = (line: number, check: string, message: string, severity: Severity = 'error') =>
    f.push({ file: rel, line, check, severity, message });

  const lines = toLines(src);
  f.push(...lintFences(rel, lines));

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

  // explained H1 titles
  const h1s = lines.filter((l) => !l.inFence && /^#\s+(?!#)(.+)/.test(l.text)).map((l) => ({
    title: stripMarker(l.text.replace(/^#\s+/, '')),
    line: l.n,
  }));

  // resolve matching knowledge file
  const relNoExt = rel.replace(/^explained\//, '').replace(/\.md$/, '');
  const knowledgeAbs = path.join(KNOWLEDGE_DIR, relNoExt + '.md');
  if (!fs.existsSync(knowledgeAbs)) {
    // E3 orphan file
    add(0, 'E3', `대응 knowledge/${relNoExt}.md 없음 (고아 파일)`);
    return f;
  }

  const kTitles = knowledgeQuestionTitles(knowledgeAbs);
  const kSet = new Set(kTitles);
  const eSet = new Set(h1s.map((h) => h.title));

  // E2 orphan section: explained H1 not in knowledge questions
  for (const h of h1s) {
    if (!kSet.has(h.title)) add(h.line, 'E2', `고아 섹션 "${h.title}" (knowledge Questions에 없음)`);
  }
  // E1 coverage: each knowledge own-question present as explained H1
  for (const t of kTitles) {
    if (!eSet.has(t)) add(0, 'E1', `커버리지 누락: "${t}" (explained에 H1 없음 — /explain 필요)`);
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

function relPosix(abs: string): string {
  return path.relative(KA_ROOT, abs).split(path.sep).join('/');
}

function changedFiles(baseRef: string): string[] {
  const out = execSync(`git diff --name-only ${baseRef}..HEAD`, { cwd: KA_ROOT, encoding: 'utf8' });
  return out
    .split(/\r?\n/)
    .filter((p) => /^(knowledge|explained)\/.*\.md$/.test(p))
    .map((p) => path.join(KA_ROOT, p))
    .filter((p) => fs.existsSync(p));
}

// ---------- main ----------

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const changedIdx = argv.indexOf('--changed');
let targets: string[];

if (changedIdx >= 0) {
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
    targets = [...walkMd(KNOWLEDGE_DIR), ...walkMd(EXPLAINED_DIR)];
  }
}

const findings: Finding[] = [];
for (const abs of targets) {
  const rel = relPosix(abs);
  if (!fs.existsSync(abs)) continue;
  const src = fs.readFileSync(abs, 'utf8');
  if (rel.startsWith('knowledge/')) findings.push(...lintKnowledge(rel, src));
  else if (rel.startsWith('explained/')) findings.push(...lintExplained(rel, src));
}

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
