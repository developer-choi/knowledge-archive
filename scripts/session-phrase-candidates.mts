/**
 * 세션 맥락 표현 후보 수집 — explained/에서 지워진 줄에서 새 표현을 줍는다.
 *
 * explanation-guide §3 「세션 맥락 표현 금지」는 고정 목록이라 목록 밖 새 표현을 영영 못 잡는다.
 * 사용자가 그런 문장을 고칠 때 explained/에서 줄이 지워지고, 그건 git이 이미 알고 있다 —
 * 그 삭제분을 1차로 걸러 후보로 보여준다.
 *
 * **추가는 자동으로 하지 않는다.** 사용자가 문장을 지우는 이유는 오타·내용 수정 등 여러 가지이고,
 * "세션"이 든 줄에는 HTTP 세션 같은 오탐이 섞인다. 이 스크립트는 후보만 출력하고, 목록에 넣을지는
 * 사람이 정해 explanation-guide §3의 `<!-- session-phrases -->` 표에 직접 적는다.
 *
 * 항상 exit 0 — 커밋을 막지 않는다.
 *
 * Usage:
 *   npx tsx scripts/session-phrase-candidates.mts                     # 스테이징된 삭제분 (pre-commit이 쓰는 형태)
 *   npx tsx scripts/session-phrase-candidates.mts --changed <baseRef> # <ref>..HEAD 삭제분
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const KA_ROOT = path.resolve(import.meta.dirname, '..');
const GUIDE = path.join(KA_ROOT, 'local/contexts/explanation-guide.md');

// 1차 그물. 이 낱말이 든 삭제 줄만 사람이 볼 후보로 올린다 — 좁게 잡으면 새 표현을 놓치고,
// 넓게 잡으면 후보가 삭제분 전체가 되어 아무도 안 읽는다.
const SEED_WORDS = ['세션', '아까', '방금', '지난번', '이번에', '학습 중'];

function existingPhrases(): string[] {
  const src = fs.readFileSync(GUIDE, 'utf8');
  const block = src.match(/<!--\s*session-phrases\s*-->([\s\S]*?)<!--\s*\/session-phrases\s*-->/);
  if (!block) return [];
  return [...block[1].matchAll(/^\|\s*([^|]+?)\s*\|/gm)]
    .map((m) => m[1].trim())
    .filter((v) => v !== '' && !/^-+$/.test(v) && v !== '금지 문구');
}

const argv = process.argv.slice(2);
const changedIdx = argv.indexOf('--changed');
const range = changedIdx >= 0 ? `${argv[changedIdx + 1]}..HEAD` : '--cached';

let diff = '';
try {
  diff = execSync(`git diff ${range} -U0 -- explained`, { cwd: KA_ROOT, encoding: 'utf8' });
} catch {
  process.exit(0); // git이 없거나 ref가 틀렸으면 조용히 넘어간다 — 커밋을 막을 일이 아니다
}

const known = existingPhrases();
const candidates: string[] = [];
for (const line of diff.split(/\r?\n/)) {
  if (!line.startsWith('-') || line.startsWith('---')) continue;
  const text = line.slice(1).trim();
  if (!text) continue;
  if (!SEED_WORDS.some((w) => text.includes(w))) continue;
  // 이미 목록에 있는 문구를 지운 것은 알려진 위반을 고친 것이지 새 재료가 아니다.
  if (known.some((p) => text.includes(p))) continue;
  candidates.push(text);
}

if (candidates.length) {
  console.log('\n[세션 맥락 표현 후보] explained/에서 지워진 줄에 목록 밖 표현이 있을 수 있습니다.');
  console.log('금지 문구로 올릴 것이 있으면 local/contexts/explanation-guide.md §3의 session-phrases 표에 직접 추가하세요.');
  console.log('(오타 수정·내용 변경으로 지운 줄과 HTTP 세션 같은 오탐이 섞여 있으니 그대로 넣지 마세요.)\n');
  for (const c of candidates.slice(0, 10)) console.log(`  - ${c.slice(0, 140)}`);
  if (candidates.length > 10) console.log(`  … 외 ${candidates.length - 10}건`);
  console.log('');
}

process.exit(0);
