/**
 * Migrate explained/ from per-question files to single-file-per-source.
 *
 *   explained/<rel>/<slug>.md  (multiple)  →  explained/<rel>.md  (single)
 *
 * Match by H1 title in each per-question file ↔ source `# Questions` line text.
 * Skip cross-link items (`- [Q → other.md](...)`).
 * Verify: every file matches exactly one source question; report orphans.
 * Concatenate in source order with `\n\n---\n\n` separator.
 *
 * Usage:
 *   npx tsx scripts/merge-explained.mts --dry-run
 *   npx tsx scripts/merge-explained.mts --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const KA_ROOT = path.resolve(import.meta.dirname, '..');
const EXPLAINED_DIR = path.join(KA_ROOT, 'explained');
const KNOWLEDGE_DIR = path.join(KA_ROOT, 'knowledge');
const APPLY = process.argv.includes('--apply');

interface Folder {
  absDir: string;             // absolute path of the leaf folder under explained/
  relPath: string;            // POSIX-like path relative to explained/, e.g. "cs/network/network-basics"
  sourcePath: string;         // absolute path of knowledge/<relPath>.md
  outputPath: string;         // absolute path of explained/<relPath>.md
}

// Find leaf folders inside explained/ — folders whose corresponding knowledge/<rel>.md exists.
function findLeafFolders(dir: string, acc: Folder[] = []): Folder[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const sub = path.join(dir, e.name);
    const rel = path.relative(EXPLAINED_DIR, sub).split(path.sep).join('/');
    const candidateSource = path.join(KNOWLEDGE_DIR, rel + '.md');
    if (fs.existsSync(candidateSource)) {
      acc.push({
        absDir: sub,
        relPath: rel,
        sourcePath: candidateSource,
        outputPath: path.join(EXPLAINED_DIR, rel + '.md'),
      });
    } else {
      // Recurse — this is an intermediate folder.
      findLeafFolders(sub, acc);
    }
  }
  return acc;
}

// Parse source `# Questions` section. Return ordered list of OWN question titles
// (skip cross-link items: `- [질문 → other.md](other.md#anchor)`).
function parseSourceQuestions(sourceMd: string): string[] {
  const lines = sourceMd.split(/\r?\n/);
  let inQuestions = false;
  const titles: string[] = [];
  for (const raw of lines) {
    const line = raw;
    if (/^#\s+Questions\s*$/.test(line.trim())) {
      inQuestions = true;
      continue;
    }
    if (inQuestions) {
      // End at next top-level heading or `---` separator.
      if (/^#{1,6}\s+/.test(line.trim()) && line.trim() !== '# Questions') break;
      if (/^---\s*$/.test(line.trim())) break;
      // Match list items: spaces + `- ` + content
      const m = line.match(/^\s*-\s+(.+?)\s*$/);
      if (!m) continue;
      const item = m[1];
      // Skip cross-link items: start with `[` (markdown link)
      if (item.startsWith('[')) continue;
      titles.push(item);
    }
  }
  return titles;
}

// Read first H1 from a per-question file: line starting with `# ` (not `## ` etc.).
function readFirstH1(filePath: string): string | null {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1];
  }
  return null;
}

interface Plan {
  folder: Folder;
  sourceTitles: string[];
  files: { abs: string; h1: string }[];
  // index in sourceTitles → file path; null if no file (cache miss, fine)
  matched: (string | null)[];
  orphanFiles: string[];   // files whose H1 didn't match any source question
  duplicateMatches: { title: string; files: string[] }[]; // multiple files mapped to same title
}

function buildPlan(folder: Folder): Plan {
  const sourceMd = fs.readFileSync(folder.sourcePath, 'utf8');
  const sourceTitles = parseSourceQuestions(sourceMd);

  const fileEntries = fs
    .readdirSync(folder.absDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => {
      const abs = path.join(folder.absDir, e.name);
      return { abs, h1: readFirstH1(abs) ?? '' };
    });

  const matched: (string | null)[] = sourceTitles.map(() => null);
  const orphanFiles: string[] = [];
  const titleToFiles: Map<string, string[]> = new Map();

  for (const f of fileEntries) {
    const idx = sourceTitles.indexOf(f.h1);
    if (idx < 0) {
      orphanFiles.push(f.abs);
      continue;
    }
    if (matched[idx] !== null) {
      const prev = titleToFiles.get(f.h1) ?? [matched[idx] as string];
      prev.push(f.abs);
      titleToFiles.set(f.h1, prev);
    } else {
      matched[idx] = f.abs;
      titleToFiles.set(f.h1, [f.abs]);
    }
  }

  const duplicateMatches = [...titleToFiles.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([title, files]) => ({ title, files }));

  return {
    folder,
    sourceTitles,
    files: fileEntries,
    matched,
    orphanFiles,
    duplicateMatches,
  };
}

function reportPlan(plan: Plan): boolean {
  const { folder, sourceTitles, files, matched, orphanFiles, duplicateMatches } = plan;
  console.log(`\n=== ${folder.relPath} ===`);
  console.log(`  source: knowledge/${folder.relPath}.md (${sourceTitles.length} own questions)`);
  console.log(`  files in folder: ${files.length}`);
  const filledIdx = matched
    .map((f, i) => (f ? i : -1))
    .filter((i) => i >= 0);
  console.log(`  matched: ${filledIdx.length} / ${sourceTitles.length}`);
  for (let i = 0; i < sourceTitles.length; i++) {
    const file = matched[i];
    const tag = file ? path.basename(file) : '— (no file, gap OK)';
    console.log(`    [${i + 1}] ${sourceTitles[i]}  →  ${tag}`);
  }
  let ok = true;
  if (orphanFiles.length > 0) {
    ok = false;
    console.log(`  ORPHANS (file H1 not found in source):`);
    for (const o of orphanFiles) console.log(`    - ${path.basename(o)} :: H1="${readFirstH1(o)}"`);
  }
  if (duplicateMatches.length > 0) {
    ok = false;
    console.log(`  DUPLICATE MATCHES:`);
    for (const d of duplicateMatches) {
      console.log(`    - "${d.title}":`);
      for (const f of d.files) console.log(`        ${path.basename(f)}`);
    }
  }
  return ok;
}

function executePlan(plan: Plan) {
  const { folder, sourceTitles, matched } = plan;
  const sections: string[] = [];
  for (let i = 0; i < sourceTitles.length; i++) {
    const file = matched[i];
    if (!file) continue;
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '');
    sections.push(text);
  }
  const merged = sections.join('\n\n---\n\n') + '\n';
  fs.writeFileSync(folder.outputPath, merged, 'utf8');
  // Delete folder
  fs.rmSync(folder.absDir, { recursive: true, force: true });
  console.log(`  → wrote ${path.relative(KA_ROOT, folder.outputPath)} (${sections.length} sections), removed folder`);
}

// --- main ---

const folders = findLeafFolders(EXPLAINED_DIR);
console.log(`Found ${folders.length} leaf explained folders.`);

const plans = folders.map(buildPlan);
let allOk = true;
for (const p of plans) {
  const ok = reportPlan(p);
  if (!ok) allOk = false;
}

console.log(`\nVerification: ${allOk ? 'ALL OK' : 'ISSUES FOUND'}`);
if (!APPLY) {
  console.log(`\nDry-run only. Re-run with --apply to execute.`);
  process.exit(allOk ? 0 : 1);
}

if (!allOk) {
  console.log(`\nBlocking: refusing to apply because of verification issues.`);
  process.exit(1);
}

console.log(`\n--- APPLYING ---`);
for (const p of plans) executePlan(p);
console.log(`\nDone.`);
