import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import type { Root, RootContent, Heading } from 'mdast';

// --- Config ---

const KA_ROOT = path.resolve(import.meta.dirname, '..');
const KNOWLEDGE_DIR = path.join(KA_ROOT, 'knowledge');
const KA_HEAD = process.env.KA_HEAD?.trim() || null;
const MIN_QUESTIONS = 4;

type SkipReason =
  | 'no-answers'
  | 'too-few-questions'
  | 'no-official-answer'
  | 'unfinished-only'
  | 'unpublishable';

type SourceTag = 'official' | 'google-doc' | 'unverified';

interface Candidate {
  slug: string;
  path: string;
  title: string;
  tags: string[];
  questionCount: number;
  questions: { text: string }[];
  firstCommitDate: string;
  lastCommitDate: string;
  source?: SourceTag;
  publishable?: boolean;
  skipped?: { reason: SkipReason };
}

// --- File walk ---

function findAllMdFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findAllMdFiles(full));
    } else if (entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

// --- AST helpers (KQ/Blog 파서 교집합) ---

function collectHeadings(children: RootContent[]) {
  const headings: { index: number; depth: number; text: string }[] = [];
  children.forEach((node, i) => {
    if (node.type === 'heading') {
      headings.push({ index: i, depth: (node as Heading).depth, text: toString(node) });
    }
  });
  return headings;
}

function getSectionNodes(
  children: RootContent[],
  headings: ReturnType<typeof collectHeadings>,
  headingIdx: number,
): RootContent[] {
  const current = headings[headingIdx];
  const start = current.index + 1;
  const next = headings.find((h, j) => j > headingIdx && h.depth <= current.depth);
  const end = next ? next.index : children.length;
  return children.slice(start, end);
}

/** Blog 방식: position-based slicing으로 Official Answer 원문 추출 */
function extractOfficialAnswer(sectionNodes: RootContent[], content: string): string {
  const subHeadings: { index: number; text: string }[] = [];
  sectionNodes.forEach((node, idx) => {
    if (node.type === 'heading' && (node as Heading).depth === 3) {
      subHeadings.push({ index: idx, text: toString(node) });
    }
  });

  for (let si = 0; si < subHeadings.length; si++) {
    const sh = subHeadings[si];
    if (sh.text !== 'Official Answer') continue;

    const start = sh.index + 1;
    const end = si + 1 < subHeadings.length ? subHeadings[si + 1].index : sectionNodes.length;
    const subNodes = sectionNodes.slice(start, end);

    const parts: string[] = [];
    for (const n of subNodes) {
      if (n.type === 'blockquote' || n.type === 'heading' || n.type === 'thematicBreak') continue;
      if (n.position) {
        parts.push(content.slice(n.position.start.offset, n.position.end.offset));
      }
    }
    return parts.join('\n\n').trim();
  }

  return '';
}

// --- Git metadata ---

function gitDateAt(relPath: string, mode: 'first' | 'last'): string {
  const ref = KA_HEAD ? [KA_HEAD] : [];
  // first: --follow로 rename까지 추적, 가장 오래된 라인이 첫 커밋
  // last: -1로 최신 커밋만
  const flags = mode === 'first'
    ? ['--follow', '--format=%aI']
    : ['-1', '--format=%aI'];
  const argv = ['git', 'log', ...ref, ...flags, '--', relPath];
  const quoted = argv.map(a => /[\s"']/.test(a) ? JSON.stringify(a) : a).join(' ');
  try {
    const result = execSync(quoted, { cwd: KA_ROOT, encoding: 'utf-8' }).trim();
    const lines = result.split('\n').filter(Boolean);
    if (lines.length === 0) return '';
    const pick = mode === 'first' ? lines[lines.length - 1] : lines[0];
    return pick.slice(0, 10);
  } catch {
    return '';
  }
}

// --- Source tag normalization ---

function normalizeSource(value: unknown): SourceTag | undefined {
  if (typeof value !== 'string') return undefined;
  const v = value.trim().toLowerCase();
  if (v === 'official' || v === 'google-doc' || v === 'unverified') return v as SourceTag;
  return undefined;
}

// --- Per-file analyzer ---

function analyzeFile(absPath: string): Candidate {
  const relPath = path.relative(KA_ROOT, absPath).replace(/\\/g, '/');
  const slug = path.basename(absPath, '.md');

  const raw = fs.readFileSync(absPath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);

  const tree: Root = unified().use(remarkParse).parse(content);
  const children = tree.children;
  const headings = collectHeadings(children);

  const titleHeading = headings.find(
    h => h.depth === 1 && h.text !== 'Questions' && h.text !== 'Answers'
  );
  const title = titleHeading?.text || slug;

  const tags: string[] = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const source = normalizeSource(frontmatter.source);
  const publishable = typeof frontmatter.publishable === 'boolean' ? frontmatter.publishable : undefined;

  const firstCommitDate = gitDateAt(relPath, 'first');
  const lastCommitDate = gitDateAt(relPath, 'last');

  const baseMeta = {
    slug,
    path: relPath,
    title,
    tags,
    firstCommitDate,
    lastCommitDate,
    ...(source ? { source } : {}),
    ...(publishable !== undefined ? { publishable } : {}),
  };

  // publishable: false면 다른 조건 검사 없이 즉시 SKIP (사용자 의도적 제외)
  if (publishable === false) {
    return { ...baseMeta, questionCount: 0, questions: [], skipped: { reason: 'unpublishable' } };
  }

  const answersH1Idx = headings.findIndex(h => h.depth === 1 && h.text === 'Answers');
  if (answersH1Idx === -1) {
    return { ...baseMeta, questionCount: 0, questions: [], skipped: { reason: 'no-answers' } };
  }

  const passingQuestions: { text: string }[] = [];
  let h2Total = 0;
  let unfinishedCount = 0;

  for (let i = answersH1Idx + 1; i < headings.length; i++) {
    const h = headings[i];
    if (h.depth <= 1) break;
    if (h.depth !== 2) continue;
    h2Total++;

    // [TODO]/[UNVERIFIED] 마커가 붙은 질문은 외부 노출 준비 안 됨 → 카운트 제외
    if (
      h.text.startsWith('[TODO]') ||
      h.text.startsWith('[UNVERIFIED]')
    ) {
      unfinishedCount++;
      continue;
    }

    const sectionNodes = getSectionNodes(children, headings, i);
    const officialAnswer = extractOfficialAnswer(sectionNodes, content);
    if (!officialAnswer) continue;

    passingQuestions.push({ text: h.text });
  }

  if (h2Total === 0) {
    return { ...baseMeta, questionCount: 0, questions: [], skipped: { reason: 'no-answers' } };
  }
  if (h2Total > 0 && unfinishedCount === h2Total) {
    return { ...baseMeta, questionCount: 0, questions: [], skipped: { reason: 'unfinished-only' } };
  }
  if (passingQuestions.length === 0) {
    return { ...baseMeta, questionCount: 0, questions: [], skipped: { reason: 'no-official-answer' } };
  }
  if (passingQuestions.length < MIN_QUESTIONS) {
    return {
      ...baseMeta,
      questionCount: passingQuestions.length,
      questions: passingQuestions,
      skipped: { reason: 'too-few-questions' },
    };
  }

  return {
    ...baseMeta,
    questionCount: passingQuestions.length,
    questions: passingQuestions,
  };
}

// --- CLI ---

function parseArgs(argv: string[]): { out?: string } {
  const out: { out?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') {
      out.out = argv[++i];
    }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`knowledge dir not found: ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const files = findAllMdFiles(KNOWLEDGE_DIR).sort();
  const candidates: Candidate[] = files.map(analyzeFile);

  const json = JSON.stringify(candidates, null, 2);

  if (args.out) {
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    fs.writeFileSync(args.out, json, 'utf-8');
    const passed = candidates.filter(c => !c.skipped).length;
    console.error(`[list-candidates] ${candidates.length} files scanned, ${passed} pass → ${args.out}`);
  } else {
    process.stdout.write(json + '\n');
  }
}

main();
