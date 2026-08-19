// knowledge/ 하위를 훑어 브라우저에서 접었다 폈다 할 수 있는 자기완결 HTML 1개로 굽는다.
// `npm run show` → 매 실행마다 재생성 후 기본 브라우저로 연다(상시 서버 없음).
// `--no-open`을 붙이면 굽기만 한다.
//
// backlog 레포의 scripts/build-backlog-view.mjs와 같은 방식이다. 다만 백로그는 평평한 목록이
// 맞고 여기는 폴더 계층 자체가 주제 분류라, 목록 대신 트리로 편다.

import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIR = join(REPO_ROOT, "knowledge");
const OUT_FILE = join(REPO_ROOT, ".knowledge-view.html");

// priority가 비었거나 키 자체가 없을 때 쓰는 라벨. 필터 목록에도 이 문자열이 그대로 뜬다.
const NONE_PRIORITY = "(없음)";

// frontmatter만 최소로 읽는다. gray-matter를 쓰면 devDependency 설치 상태에 뷰어가 묶이는데,
// 이 스크립트는 `npm run show` 한 방으로 아무 데서나 떠야 해서 의존성 0으로 둔다.
function splitFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return { fm: [], body: lines };
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (end < 0) return { fm: [], body: lines }; // 미닫힘 → 전체를 본문으로 본다
  return { fm: lines.slice(1, end), body: lines.slice(end + 1) };
}

function fmScalar(fmLines, key) {
  const line = fmLines.find((l) => l.startsWith(key + ":"));
  if (!line) return "";
  return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}

function walkTree(dir) {
  const entries = readdirSync(dir).sort((a, b) => a.localeCompare(b, "ko"));
  const dirs = [];
  const files = [];

  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      const node = walkTree(full);
      if (node.children.length) dirs.push(node); // .md가 하나도 없는 빈 폴더는 트리에서 뺀다
    } else if (name.endsWith(".md")) {
      files.push(toFileNode(full));
    }
  }

  return {
    type: "dir",
    name: basename(dir),
    path: relative(REPO_ROOT, dir).replace(/\\/g, "/"),
    children: [...dirs, ...files], // 폴더 먼저, 파일 나중 — 트리를 훑을 때 층이 눈에 잡힌다
  };
}

function toFileNode(absPath) {
  const content = readFileSync(absPath, "utf8");
  const { fm, body } = splitFrontmatter(content);
  const path = relative(REPO_ROOT, absPath).replace(/\\/g, "/");

  return {
    type: "file",
    name: basename(path, ".md"),
    path,
    priority: fmScalar(fm, "priority") || NONE_PRIORITY,
    body: body.join("\n").trim(),
  };
}

// 데이터에 섞인 `</script>`가 스크립트 블록을 조기 종료시키는 것을 막는다.
// 백슬래시를 소스에 직접 쓰면 이스케이프 층이 헷갈려 조용히 무력화되므로 charCode로 만든다.
function embedJson(value) {
  const LT = String.fromCharCode(60); // <
  const LT_ESCAPED = String.fromCharCode(92) + "u003c"; // <
  return JSON.stringify(value).split(LT).join(LT_ESCAPED);
}

// Windows에서 `cmd /c start`를 쓰지 않는다. cmd.exe가 뜨면 레지스트리에 등록된 AutoRun
// 스크립트가 먼저 실행되는데, 거기서 뭐라도 어긋나면 새 콘솔 창이 입력을 기다리며 멈춰
// 사용자가 그 창을 닫을 때까지 브라우저가 안 뜬다. explorer.exe는 GUI라 콘솔을 안 만든다.
function openInBrowser(file) {
  const [cmd, args] =
    process.platform === "win32"
      ? ["explorer.exe", [file]]
      : process.platform === "darwin"
        ? ["open", [file]]
        : ["xdg-open", [file]];
  spawn(cmd, args, { detached: true, stdio: "ignore" }).unref();
}

function countFiles(node) {
  if (node.type === "file") return 1;
  return node.children.reduce((sum, c) => sum + countFiles(c), 0);
}

const tree = walkTree(SCAN_DIR);
writeFileSync(OUT_FILE, renderHtml(tree), "utf8");

console.log(`knowledge ${countFiles(tree)}건 → ${relative(REPO_ROOT, OUT_FILE)}`);
if (!process.argv.includes("--no-open")) openInBrowser(OUT_FILE);

// ── HTML ──────────────────────────────────────────────────────────────────────
// 의존성 0(인라인 CSS/JS). 클라이언트 스크립트는 백틱 템플릿 리터럴을 쓰지 않는다 —
// 이 파일 자체가 템플릿 리터럴이라 중첩하면 `${}`가 빌드 시점에 먹힌다.

function renderHtml(data) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>knowledge 뷰어</title>
<style>
  :root {
    --bg: #f7f7f5; --panel: #fff; --fg: #1f1e24; --muted: #75747f;
    --line: #e4e3df; --line-soft: #efeeea; --accent: #3558d4; --chip: #edece8;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #131317; --panel: #1c1c21; --fg: #e9e8e5; --muted: #94939d;
      --line: #2e2e36; --line-soft: #26262d; --accent: #93a8f5; --chip: #2a2a32;
    }
  }
  * { box-sizing: border-box; }
  /* 접기는 hidden 속성 하나로 돌아간다. 브라우저 기본 스타일에만 맡기면 확장·리더모드가
     끼어들어 조용히 무력화될 수 있어 여기서 다시 못 박는다. */
  [hidden] { display: none !important; }
  html, body { height: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--fg);
    font: 13.5px/1.55 -apple-system, "Segoe UI", "Malgun Gothic", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .app { display: grid; grid-template-columns: 232px minmax(0, 1fr); min-height: 100%; }

  /* ── 사이드바: 필터. 화면에 고정돼 트리를 스크롤해도 따라온다 ── */
  .side {
    position: sticky; top: 0; align-self: start; height: 100vh; overflow-y: auto;
    border-right: 1px solid var(--line); background: var(--panel); padding: 16px 14px 32px;
  }
  .brand { font-size: 13px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 2px; }
  .brand span { color: var(--muted); font-weight: 400; }
  .built { color: var(--muted); font-size: 10.5px; }
  .btn {
    margin: 10px 0 0; width: 100%; font: inherit; font-size: 12px; cursor: pointer;
    background: var(--bg); border: 1px solid var(--line); border-radius: 6px;
    color: var(--muted); padding: 5px 0;
  }
  .btn:hover { color: var(--fg); border-color: var(--accent); }
  .grp { margin-top: 16px; }
  .grp > b {
    display: block; font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 5px;
  }
  .opt {
    display: flex; align-items: center; gap: 6px; padding: 2.5px 5px; margin: 0 -5px;
    border-radius: 5px; cursor: pointer; font-size: 12.5px;
  }
  .opt:hover { background: var(--chip); }
  .opt input { margin: 0; accent-color: var(--accent); flex-shrink: 0; }
  .opt .nm { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .opt .n { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
  .opt.zero .nm, .opt.zero .n { opacity: 0.4; }

  /* ── 본문 ── */
  .main { padding: 0 0 60px; min-width: 0; }
  .bar {
    position: sticky; top: 0; z-index: 2; background: var(--bg);
    border-bottom: 1px solid var(--line); padding: 12px 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .search {
    flex: 1; min-width: 0; padding: 7px 11px; font: inherit;
    background: var(--panel); color: var(--fg);
    border: 1px solid var(--line); border-radius: 7px;
  }
  .search:focus { outline: 2px solid var(--accent); outline-offset: -1px; }
  .count { color: var(--muted); font-size: 12.5px; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .count b { color: var(--fg); }

  .tree { padding: 12px 20px; }
  /* 계층은 왼쪽 세로선으로 보여준다 — 들여쓰기만으로는 깊어질수록 어느 폴더 소속인지 흐려진다 */
  .kids { margin-left: 8px; padding-left: 12px; border-left: 1px solid var(--line-soft); }
  .node { padding: 1.5px 0; }
  .lbl {
    display: flex; align-items: center; gap: 6px; padding: 2px 6px; margin: 0 -6px;
    border-radius: 5px; cursor: pointer;
  }
  .lbl:hover { background: var(--chip); }
  .caret { color: var(--muted); font-size: 9px; width: 10px; flex-shrink: 0; transition: transform 0.12s; }
  .node.open > .lbl > .caret { transform: rotate(90deg); }
  .nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .node.dir > .lbl > .nm { font-weight: 600; }
  .node.file > .lbl > .nm { font-family: ui-monospace, Consolas, monospace; font-size: 12.5px; }
  .lbl:hover .nm { color: var(--accent); }
  .n { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }

  .copy { font-size: 11px; color: var(--muted); cursor: pointer; }
  .copy:hover { color: var(--accent); }

  pre {
    margin: 6px 0 6px 22px; padding: 12px 14px; background: var(--panel);
    border: 1px solid var(--line); border-radius: 8px; max-height: 60vh; overflow: auto;
    white-space: pre-wrap; word-break: break-word;
    font-family: ui-monospace, Consolas, monospace; font-size: 12px; line-height: 1.6;
  }
  .empty { color: var(--muted); padding: 60px 0; text-align: center; }

  @media (max-width: 860px) {
    .app { grid-template-columns: 1fr; }
    .side { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--line); }
  }
</style>
</head>
<body>
<div class="app">
  <aside class="side">
    <div class="brand">knowledge <span id="total"></span></div>
    <!-- 화면이 방금 구운 것인지(캐시된 옛 파일이 아닌지) 한눈에 보라고 굽은 시각을 박아둔다 -->
    <div class="built">${new Date().toLocaleString("ko-KR")} 생성</div>
    <div class="grp"><b>priority</b><div id="prios"></div></div>
    <button class="btn" id="reset">필터 초기화</button>
    <button class="btn" id="expand">전부 펼치기</button>
    <button class="btn" id="collapse">전부 접기</button>
  </aside>
  <main class="main">
    <div class="bar">
      <input class="search" id="q" type="search" placeholder="파일명·경로·본문 검색">
      <span class="count" id="count"></span>
    </div>
    <div class="tree" id="tree"></div>
  </main>
</div>
<script>
var TREE = ${embedJson(data)};
var NONE = '${NONE_PRIORITY}';

// 데이터에 실제로 있는 priority 값만 체크박스로 낸다. 나중에 3·5를 쓰기 시작하면 자동으로 늘어난다.
function allPriorities() {
  var seen = {};
  (function walk(n) {
    if (n.type === 'file') { seen[n.priority] = true; return; }
    n.children.forEach(walk);
  })(TREE);
  return Object.keys(seen).sort(function (a, b) {
    if (a === NONE) return 1;   // (없음)은 항상 맨 끝
    if (b === NONE) return -1;
    return a.localeCompare(b, 'ko', { numeric: true });
  });
}

var PRIOS = allPriorities();
// 한 번에 하나만 본다(라디오). 기본은 1 — 없으면 첫 값으로 떨어진다.
var DEFAULT_PRIO = PRIOS.indexOf('1') >= 0 ? '1' : PRIOS[0];
var sel = DEFAULT_PRIO;
var q = '';
var collapsedPaths = {};   // 접힌 폴더 경로. 기본은 펼침이라 "닫은 것"만 기억한다

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

function hits(file) {
  if (file.priority !== sel) return false;
  if (q) {
    var hay = (file.name + ' ' + file.path + ' ' + file.body).toLowerCase();
    if (hay.indexOf(q.toLowerCase()) < 0) return false;
  }
  return true;
}

// 현재 필터에서 살아남은 파일만 담은 트리를 새로 만든다. 자식이 0인 폴더는 통째로 사라진다.
function prune(node) {
  if (node.type === 'file') return hits(node) ? node : null;
  var kids = node.children.map(prune).filter(Boolean);
  if (!kids.length) return null;
  return { type: 'dir', name: node.name, path: node.path, children: kids };
}

function countFiles(node) {
  if (node.type === 'file') return 1;
  return node.children.reduce(function (s, c) { return s + countFiles(c); }, 0);
}

function renderNode(node) {
  if (node.type === 'file') {
    return '<div class="node file" data-path="' + esc(node.path) + '">' +
      '<div class="lbl"><span class="caret">▶</span>' +
        '<span class="nm">' + esc(node.name) + '</span>' +
        '<span class="copy" data-copy="' + esc(node.path) + '" title="클릭하면 경로 복사">경로</span>' +
      '</div>' +
      '<pre hidden>' + esc(node.body) + '</pre></div>';
  }

  var open = !collapsedPaths[node.path];
  return '<div class="node dir' + (open ? ' open' : '') + '" data-path="' + esc(node.path) + '">' +
    '<div class="lbl"><span class="caret">▶</span>' +
      '<span class="nm">' + esc(node.name) + '</span>' +
      '<span class="n">' + countFiles(node) + '</span>' +
    '</div>' +
    '<div class="kids"' + (open ? '' : ' hidden') + '>' +
      node.children.map(renderNode).join('') +
    '</div></div>';
}

function renderFilters(pruned) {
  document.getElementById('prios').innerHTML = PRIOS.map(function (p) {
    // 건수는 priority 필터를 뺀 나머지 조건(검색어) 기준 — "지금 검색에서 P1이 몇 건"이 보여야 한다.
    var n = 0;
    (function walk(node) {
      if (node.type === 'file') {
        if (node.priority === p && (!q || (node.name + ' ' + node.path + ' ' + node.body).toLowerCase().indexOf(q.toLowerCase()) >= 0)) n++;
        return;
      }
      node.children.forEach(walk);
    })(TREE);

    var on = sel === p ? ' checked' : '';
    return '<label class="opt' + (n ? '' : ' zero') + '">' +
      '<input type="radio" name="prio" value="' + esc(p) + '"' + on + '>' +
      '<span class="nm">' + esc(p) + '</span><span class="n">' + n + '</span></label>';
  }).join('');
}

function writeHash() {
  var parts = ['priority=' + sel];
  if (q) parts.push('q=' + q);
  history.replaceState(null, '', '#' + encodeURIComponent(parts.join('&')));
}

function readHash() {
  var h = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (!h) return;
  h.split('&').forEach(function (part) {
    var i = part.indexOf('=');
    if (i < 0) return;
    var key = part.slice(0, i), val = part.slice(i + 1);
    if (key === 'q') q = val;
    else if (key === 'priority' && PRIOS.indexOf(val) >= 0) sel = val;
  });
}

function render() {
  var pruned = prune(TREE);
  renderFilters(pruned);
  document.getElementById('count').innerHTML = '<b>' + (pruned ? countFiles(pruned) : 0) + '</b>건';
  document.getElementById('tree').innerHTML = pruned
    ? pruned.children.map(renderNode).join('')
    : '<div class="empty">조건에 맞는 항목이 없습니다.</div>';
  writeHash();
}

document.getElementById('prios').addEventListener('change', function (e) {
  if (!e.target.checked) return;
  sel = e.target.value;
  render();
});

document.getElementById('q').addEventListener('input', function (e) {
  q = e.target.value;
  render();
});

document.getElementById('reset').addEventListener('click', function () {
  sel = DEFAULT_PRIO;
  q = '';
  document.getElementById('q').value = '';
  render();
});

// 전부 펼치기/접기는 화면에 이미 그려진 폴더를 직접 토글한다 — 수동 클릭과 같은 경로다.
// 상태만 바꾸고 전체를 다시 그리는 방식은 접힘 상태를 다시 계산하는 층이 하나 더 껴서,
// 거기서 어긋나면 버튼이 아무 일도 안 한 것처럼 보인다.
function setAll(collapse) {
  var dirs = document.querySelectorAll('#tree .node.dir');
  for (var i = 0; i < dirs.length; i++) {
    var node = dirs[i];
    var kids = node.querySelector('.kids');
    if (!kids) continue;
    kids.hidden = collapse;
    node.classList.toggle('open', !collapse);
    if (collapse) collapsedPaths[node.dataset.path] = true;
    else delete collapsedPaths[node.dataset.path];
  }
}
document.getElementById('expand').addEventListener('click', function () { setAll(false); });
document.getElementById('collapse').addEventListener('click', function () { setAll(true); });

document.getElementById('tree').addEventListener('click', function (e) {
  var copy = e.target.closest('.copy');
  if (copy) {
    navigator.clipboard.writeText(copy.dataset.copy);
    var old = copy.textContent;
    copy.textContent = '복사됨';
    setTimeout(function () { copy.textContent = old; }, 900);
    return;
  }

  var lbl = e.target.closest('.lbl');
  if (!lbl) return;
  var node = lbl.parentNode;

  if (node.classList.contains('dir')) {
    // 접힘 상태는 collapsedPaths에만 기록하고 DOM은 직접 토글한다 — 전체 재렌더를 하면
    // 열려 있던 파일 본문이 같이 닫혀서 읽던 자리를 잃는다.
    var kids = node.querySelector('.kids');
    kids.hidden = !kids.hidden;
    node.classList.toggle('open', !kids.hidden);
    if (kids.hidden) collapsedPaths[node.dataset.path] = true;
    else delete collapsedPaths[node.dataset.path];
    return;
  }

  var pre = node.querySelector('pre');
  pre.hidden = !pre.hidden;
  node.classList.toggle('open', !pre.hidden);
});

document.getElementById('total').textContent = countFiles(TREE) + '건';
readHash();
document.getElementById('q').value = q;
render();
</script>
</body>
</html>
`;
}
