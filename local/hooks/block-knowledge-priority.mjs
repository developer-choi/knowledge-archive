// knowledge frontmatter의 `priority`를 AI가 새로 쓰거나 바꾸려 할 때 사용자 승인을 받는 PreToolUse 훅.
//
// content-format.md §1「priority」: "AI는 priority를 작성하지 않는다. … frontmatter에 priority 키
// 자체를 넣지도 않는다. 사용자가 우선순위를 정할 때 직접 키를 추가한다."
//
// 왜 린터가 아니라 훅인가 — 파일에 적힌 `priority: 1`만 봐서는 사용자가 정한 값인지 AI가 추측해
// 채운 값인지 구분할 수 없다. "누가 썼는가"는 저장 전에 도구 호출을 가로채는 자리에서만 안다.
// 린터의 K16은 값 어휘(1/2/5/빈값)만 보는 반쪽이고, 이 훅이 나머지 반쪽이다.
//
// 왜 deny가 아니라 ask인가 — 훅이 보는 것은 파일의 전/후뿐이라, AI가 추측해 채운 값과 사용자가
// 대화에서 정해준 값을 AI가 대신 타이핑한 것이 똑같이 보인다. deny로 두면 후자까지 막혀서
// `/digest` OFF 2단계("사용자에게 priority를 묻고 답한 값 그대로 반영")가 매번 완주하지 못했다.
// ask로 두면 그 구분을 아는 유일한 주체인 사용자가 승인 다이얼로그에서 판정한다.
//
// 판정은 "결과 파일에 priority가 새로 생기거나 값이 바뀌는가" 한 가지다. 이미 사용자가 넣어둔
// 값을 그대로 들고 가는 재작성(Write로 파일 통째 갱신 등)은 통과한다 — 보존은 위반이 아니다.
//
// 이 파일은 local/hooks/의 원본이며 sync:local-system이 repo-local .claude/hooks/로 배포한다.
// 산출물(.claude/hooks/)을 직접 수정하지 말 것. self-contained I/O (공용 hook-utils 없음).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDIT_TOOLS = new Set(["Edit", "Write"]);

// --- 순수 판정 ---

// frontmatter(`---` … `---`)의 priority 값. 키가 없으면 null.
// 줄 단위로 끊어 읽는다 — `^priority:\s*(.*)$`의 `\s`가 개행을 먹어 다음 줄 값을 집어오는 함정이 있다.
export function priorityOf(content) {
  const lines = String(content).split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return null;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") return null;
    const m = lines[i].match(/^priority:[ \t]*(.*)$/);
    if (m) return m[1].trim();
  }
  return null; // 닫히지 않은 블록 = frontmatter 없음으로 취급
}

// KA의 knowledge 문서인가. 배포본은 KA 레포 안에서만 도니 `knowledge/` 세그먼트 + `.md`면 충분하다.
export function isKnowledgeDoc(filePath) {
  if (!filePath || !filePath.endsWith(".md")) return false;
  return path.normalize(filePath).split(/[\\/]/).includes("knowledge");
}

// 도구 호출이 적용된 뒤의 파일 내용. 적용할 수 없으면 null(판정 보류 → 통과).
export function resultingContent(toolName, toolInput, currentContent) {
  if (toolName === "Write") return typeof toolInput.content === "string" ? toolInput.content : null;
  if (toolName !== "Edit") return null;
  const { old_string: oldStr, new_string: newStr, replace_all: replaceAll } = toolInput;
  if (typeof oldStr !== "string" || typeof newStr !== "string" || currentContent === null) return null;
  if (!currentContent.includes(oldStr)) return null; // 어차피 도구가 실패한다
  return replaceAll ? currentContent.split(oldStr).join(newStr) : currentContent.replace(oldStr, newStr);
}

// 위반이면 사유 문자열, 아니면 null.
export function violation(before, after) {
  const wasSet = priorityOf(before);
  const willBe = priorityOf(after);
  if (willBe === null || willBe === "") return null; // 키가 사라지거나 값이 비워짐 — 관심사 아님
  // 빈 값(`priority:`)은 "사용자가 아직 안 정함"이라 미배정과 같게 본다. 그 자리를 AI가 채우는
  // 것이 규칙이 막는 바로 그 행동이다.
  if (wasSet === null || wasSet === "") {
    return `knowledge frontmatter에 \`priority: ${willBe}\`를 새로 쓰려 합니다. priority는 사용자가 학습 전략에 따라 직접 정하는 값입니다 (content-format.md §1「priority」). 직접 정해준 값이면 승인하고, AI가 추측한 값이면 거부하세요.`;
  }
  if (wasSet !== willBe) {
    return `knowledge frontmatter의 priority를 "${wasSet}" → "${willBe}"로 바꾸려 합니다. 직접 바꾸기로 한 값이면 승인하고, 아니면 거부해 기존 값을 지키세요 (content-format.md §1「priority」).`;
  }
  return null;
}

// --- I/O 래퍼 ---

function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    return;
  }
  const toolName = typeof payload.tool_name === "string" ? payload.tool_name : "";
  const toolInput = payload.tool_input || {};
  const filePath = typeof toolInput.file_path === "string" ? toolInput.file_path : "";
  if (!EDIT_TOOLS.has(toolName) || !isKnowledgeDoc(filePath)) return;

  let before = null;
  try {
    before = fs.readFileSync(filePath, "utf8");
  } catch {
    before = ""; // 새 파일
  }

  const after = resultingContent(toolName, toolInput, before);
  if (after === null) return;

  const reason = violation(before, after);
  if (!reason) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: reason,
      },
    }),
  );
}

// 직접 실행일 때만 훅을 돌린다. import(유닛테스트)로 들어올 땐 main·exit를 발동하지 않는다.
if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main();
  process.exit(0);
}
