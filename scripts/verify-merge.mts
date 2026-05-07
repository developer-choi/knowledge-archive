/**
 * Verify the explained/ migration: every per-question file's pre-migration content
 * must equal its corresponding section in the merged file.
 *
 * - Walks the migration commit (HEAD by default, or env VERIFY_REF) for deletions/renames.
 * - For each removed (or renamed-from) per-question file, reads its blob at HEAD~1.
 * - Locates the matching merged file at HEAD (explained/<rel>.md).
 * - Splits the merged file into sections by `\n\n---\n\n`.
 * - Each merged section is matched to a per-question file by the section's first H1.
 * - Compares byte-for-byte (after the same normalization the migration used:
 *     CRLF → LF, strip trailing whitespace).
 *
 * Usage:
 *   npm run verify-merge
 */
import { execSync, execFileSync } from 'node:child_process';
import path from 'node:path';

const REF = process.env.VERIFY_REF ?? 'HEAD';
const PARENT = `${REF}~1`;

function git(args: string): string {
  return execSync(`git -c core.quotepath=false ${args}`, {
    encoding: 'utf8',
    maxBuffer: 100 * 1024 * 1024,
  });
}

function show(ref: string, file: string): Buffer {
  // Use execFileSync with argv array to avoid shell quoting; return Buffer (preserve bytes).
  return execFileSync('git', ['-c', 'core.quotepath=false', 'show', `${ref}:${file}`], {
    maxBuffer: 100 * 1024 * 1024,
  });
}

function normalize(s: string): string {
  return s.replace(/\r\n/g, '\n').replace(/\s+$/, '');
}

function firstH1(text: string): string | null {
  for (const line of text.split('\n')) {
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1];
  }
  return null;
}

interface OldFile {
  oldPath: string;          // e.g., explained/cs/network/router/라우터란-무엇인가.md
  newPath: string;          // explained/cs/network/router.md
}

// Build the list of (old per-question path → merged path) pairs from the migration commit.
function buildPairs(): OldFile[] {
  const out = git(`diff ${PARENT}..${REF} --name-status -M`);
  const pairs: OldFile[] = [];
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const status = parts[0];
    if (status === 'D') {
      const oldPath = parts[1];
      // Compute new merged path: take dirname, append .md
      // e.g., explained/cs/network/router/Q.md → explained/cs/network/router.md
      const dir = path.posix.dirname(oldPath.replace(/\\/g, '/'));
      pairs.push({ oldPath, newPath: dir + '.md' });
    } else if (status.startsWith('R')) {
      const oldPath = parts[1];
      const newPath = parts[2];
      pairs.push({ oldPath, newPath });
    }
  }
  return pairs;
}

interface Issue {
  oldPath: string;
  newPath: string;
  kind: string;
  detail?: string;
}

const pairs = buildPairs();
console.log(`Verifying ${pairs.length} per-question files…`);

// Cache merged-file sections so we don't re-read for each pair.
const sectionsByFile = new Map<string, Map<string, string>>();
function loadSections(newPath: string): Map<string, string> {
  if (sectionsByFile.has(newPath)) return sectionsByFile.get(newPath)!;
  const text = show(REF, newPath).toString('utf8');
  const norm = text.replace(/\r\n/g, '\n');
  // Split only at inter-question separators: blank-line, ---, blank-line, then `# ` (H1 marker).
  // Internal `---` separators inside a question (e.g., between OA blockquote and body) do NOT
  // start a new H1, so they survive this split.
  const sep = '\n\n---\n\n# ';
  const pieces = norm.split(sep);
  const map = new Map<string, string>();
  for (let i = 0; i < pieces.length; i++) {
    const piece = (i === 0 ? '' : '# ') + pieces[i];
    const h1 = firstH1(piece);
    if (!h1) continue;
    map.set(h1, normalize(piece));
  }
  sectionsByFile.set(newPath, map);
  return map;
}

const issues: Issue[] = [];
let okCount = 0;

for (const { oldPath, newPath } of pairs) {
  let oldText: string;
  try {
    oldText = show(PARENT, oldPath).toString('utf8');
  } catch (e) {
    issues.push({ oldPath, newPath, kind: 'missing-old-blob', detail: (e as Error).message.split('\n')[0] });
    continue;
  }
  const oldNormalized = normalize(oldText);
  const oldH1 = firstH1(oldNormalized);
  if (!oldH1) {
    issues.push({ oldPath, newPath, kind: 'no-h1-in-old' });
    continue;
  }
  let sections: Map<string, string>;
  try {
    sections = loadSections(newPath);
  } catch (e) {
    issues.push({ oldPath, newPath, kind: 'missing-merged', detail: (e as Error).message.split('\n')[0] });
    continue;
  }
  const matched = sections.get(oldH1);
  if (!matched) {
    issues.push({ oldPath, newPath, kind: 'no-matching-section', detail: `H1: "${oldH1}"` });
    continue;
  }
  if (matched !== oldNormalized) {
    // Provide a small diff hint
    const minLen = Math.min(matched.length, oldNormalized.length);
    let firstDiff = -1;
    for (let i = 0; i < minLen; i++) {
      if (matched[i] !== oldNormalized[i]) {
        firstDiff = i;
        break;
      }
    }
    if (firstDiff < 0) firstDiff = minLen;
    const ctxStart = Math.max(0, firstDiff - 30);
    const ctxEnd = Math.min(Math.max(matched.length, oldNormalized.length), firstDiff + 30);
    issues.push({
      oldPath,
      newPath,
      kind: 'content-mismatch',
      detail:
        `lengths old=${oldNormalized.length} merged=${matched.length}; ` +
        `first diff at ${firstDiff}; ` +
        `old=…${JSON.stringify(oldNormalized.slice(ctxStart, ctxEnd))}… ` +
        `merged=…${JSON.stringify(matched.slice(ctxStart, ctxEnd))}…`,
    });
    continue;
  }
  okCount++;
}

console.log(`OK: ${okCount} / ${pairs.length}`);
if (issues.length === 0) {
  console.log('\n✅ All per-question files preserved verbatim in their merged sections.');
  process.exit(0);
}
console.log(`ISSUES: ${issues.length}`);
for (const i of issues) {
  console.log(`- [${i.kind}] ${i.oldPath} → ${i.newPath}`);
  if (i.detail) console.log(`    ${i.detail}`);
}
process.exit(1);
