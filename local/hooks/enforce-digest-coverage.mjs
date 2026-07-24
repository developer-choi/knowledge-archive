// digest 전 문장 해설 강제 — Stop hook (I/O 래퍼).
//
// digest 세션에서 사용자가 붙여넣은 원문의 모든 문장이 해설 출력에 인용·해설됐는지
// digest-coverage-core.mjs의 순수 검사로 확인하고, 빠진 문장이 있으면 Stop을 block해
// AI가 그 턴에서 이어 해설하도록 강제한다. (프롬프트 자기검증이 두 번 새어 나가 hook으로 승격.)
//
// 이 파일은 local/hooks/의 원본이며 sync:local-system이 repo-local .claude/hooks/로 배포한다.
// 산출물(.claude/hooks/)을 직접 수정하지 말 것. block-ac-sync.mjs처럼 self-contained I/O.
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { coverageReport } from "./digest-coverage-core.mjs";

const MIN_ENGLISH_WORDS = 40; // 이보다 영어 단어가 적으면 콘텐츠 붙여넣기로 안 본다.

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    return null;
  }
}

// transcript JSONL을 파싱해 user/assistant 텍스트 메시지를 순서대로 뽑는다.
// 스키마: 이벤트당 top-level type('user'/'assistant'), message.content(user=문자열|블록배열,
// assistant=블록배열), isMeta skip. tool_result-only(user 텍스트 없음)·system-reminder 래퍼 skip.
function parseMessages(transcriptPath) {
  const msgs = [];
  let raw;
  try {
    raw = fs.readFileSync(transcriptPath, "utf8");
  } catch {
    return msgs;
  }
  for (const line of raw.split("\n")) {
    if (!line) continue;
    let e;
    try {
      e = JSON.parse(line);
    } catch {
      continue;
    }
    if (!e || !e.message || e.isMeta) continue;
    if (e.type === "user") {
      const c = e.message.content;
      let text =
        typeof c === "string"
          ? c
          : Array.isArray(c)
            ? c.filter((b) => b && b.type === "text").map((b) => b.text).join("\n")
            : "";
      text = text.trim();
      if (!text) continue; // tool_result-only
      if (text.startsWith("<system-reminder>") || text.startsWith("<local-command-stdout>")) continue;
      msgs.push({ who: "user", text });
    } else if (e.type === "assistant") {
      const text = (e.message.content || [])
        .filter((b) => b && b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      if (text) msgs.push({ who: "assistant", text });
    }
  }
  return msgs;
}

// digest ON/OFF 제어 메시지 판별. 슬래시커맨드(<command-args>ON …) / 맨입력(/digest ON) /
// 단독 ON·OFF 를 모두 커버. 반환: 'on' | 'off' | null.
function digestControl(text) {
  const slash = text.match(/<command-name>\/digest<\/command-name>[\s\S]*?<command-args>\s*(ON|OFF)\b/i);
  if (slash) return slash[1].toLowerCase();
  const bare = text.match(/^\s*\/?digest\s+(ON|OFF)\b/i);
  if (bare) return bare[1].toLowerCase();
  if (/^(ON|OFF)$/i.test(text.trim())) return text.trim().toLowerCase();
  return null;
}

// 마지막 제어 메시지가 ON이면 digest 활성.
function isDigestActive(msgs) {
  let state = false;
  for (const m of msgs) {
    if (m.who !== "user") continue;
    const ctrl = digestControl(m.text);
    if (ctrl === "on") state = true;
    else if (ctrl === "off") state = false;
  }
  return state;
}

// 오탐 ②: 아래 메시지들은 영어가 우세해 isContentPaste에 걸리지만 "붙여넣은 원문"이 아니다.
// source 후보에서 배제한다.
// - Stop hook feedback: 이 훅이 낸 block 사유가 다음 턴의 user 메시지로 주입되는데, 그 안에
//   플래그된 영어 스니펫이 박혀 있어 그대로 검사하면 자기 피드백을 원문으로 오인한다.
// - /compact 요약: 세션 압축 요약("This session is being continued …")도 영어 우세로 오분류된다.
// stop_hook_active 가드가 같은 턴 재block은 막지만, source 선정 자체를 여기서 정화한다.
function isHookOrSystemMessage(text) {
  const t = text.trimStart();
  return (
    t.startsWith("Stop hook feedback:") ||
    t.startsWith("This session is being continued from a previous conversation")
  );
}

// 콘텐츠 붙여넣기인가: 영어 단어가 충분하고 영어가 한글보다 우세. "다음"/"OFF"/한글 지시는 탈락.
function isContentPaste(text) {
  const stripped = text.replace(/<[^>]+>/g, " ");
  const englishWords = (stripped.match(/[A-Za-z][A-Za-z'-]+/g) || []).length;
  if (englishWords < MIN_ENGLISH_WORDS) return false;
  const eng = (stripped.match(/[A-Za-z]/g) || []).length;
  const kor = (stripped.match(/[가-힣]/g) || []).length;
  return eng > kor * 2;
}

function main() {
  const payload = readStdin();
  if (!payload) return;

  // 무한루프 가드: 이미 block으로 재발화된 턴이면 다시 막지 않는다.
  if (payload.stop_hook_active === true) return;

  const transcriptPath = typeof payload.transcript_path === "string" ? payload.transcript_path : "";
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return;

  const msgs = parseMessages(transcriptPath);
  if (!msgs.length) return;
  if (!isDigestActive(msgs)) return;

  // 이 응답 직전 마지막 사용자 메시지(붙여넣은 원문)와 그 뒤 assistant 텍스트(해설) 추출.
  let lastUserIdx = -1;
  for (let i = msgs.length - 1; i >= 0; i -= 1) {
    if (msgs[i].who === "user") {
      lastUserIdx = i;
      break;
    }
  }
  if (lastUserIdx === -1) return;

  const source = msgs[lastUserIdx].text;
  if (isHookOrSystemMessage(source)) return; // 오탐 ②: 훅 피드백·compact 요약은 원문 아님
  if (!isContentPaste(source)) return; // 지시·제어 턴은 검사 안 함(메타 턴 오탐 완화)

  const output = msgs
    .slice(lastUserIdx + 1)
    .filter((m) => m.who === "assistant")
    .map((m) => m.text)
    .join("\n\n");
  if (!output) return;

  const report = coverageReport(source, output);
  if (!report.blocked) return;

  const snippets = report.missingSegments
    .slice(0, 6)
    .map((m) => `- ${m.text.slice(0, 120)}`)
    .join("\n");
  const reason =
    `digest §1 위반: 붙여넣은 원문의 아래 문장이 해설 출력에 인용·해설되지 않았습니다 ` +
    `(총 ${report.missingSegments.length}건 중 일부). 각 문장을 \`>\` 블록쿼트로 인용하고 해설하세요. ` +
    `일부만 하고 나머지를 "다음에"로 미루는 것은 누락과 같습니다.\n${snippets}`;
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
}

// 직접 실행일 때만 훅을 돌린다. import(유닛테스트)로 들어올 땐 main·exit를 발동하지 않는다
// — top-level process.exit(0)가 테스트 프로세스를 죽이는 것을 막는다.
if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main();
  process.exit(0);
}

export { isHookOrSystemMessage, isContentPaste, digestControl, isDigestActive };
