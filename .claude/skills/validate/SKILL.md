---
disable-model-invocation: true
argument-hint: [대상 파일/디렉토리 경로 또는 "전체"]
---

# KA 문서 검증

## 목적

[`knowledge/`](../../../local/contexts/directory-roles.md)·`reference/`·`explained/` 하위 문서가 KA 규칙을 지키는지 검증하고, 위반을 수정한다.

KA의 다른 스킬은 문서 양식이 지켜진다는 전제 위에서 돈다 — 양식이 깨진 문서는 출제에서 조용히 빠지거나 잘못 채점되고, 그 손해는 복습할 때가 아니라 나중에 드러난다. 문서 수가 사람이 훑을 수 있는 규모를 넘은 뒤로는 검사하는 쪽이 따로 있어야 한다.

## 규칙 소스

규칙 정의의 단일 출처는 컨텍스트 파일이다. 판단 체크 전 읽는다:

| 규칙 | 파일 |
|------|------|
| 문서 구조 | [document-structure.md](../../../local/contexts/document-structure.md) |
| 콘텐츠 포맷 | [content-format.md](../../../local/contexts/content-format.md) |
| 파일 배치 | [file-placement.md](../../../local/contexts/file-placement.md) |
| 태그 목록 | [tags.md](../../../local/contexts/tags.md) |

## 결정론 체크 — 린터 스크립트

기계가 딱 떨어지게 판정하는 항목은 `scripts/validate-lint.mts`가 전담한다.

체크 목록의 정본은 `scripts/validate-lint.mts`의 `CHECK_REGISTRY`다 — 여기에 옮겨 적지 않는다. 어떤 체크가 있는지·무엇을 근거로 하는지는 그 배열을 보고, 실제 위반은 린터가 ID와 메시지를 함께 출력한다.

### knowledge↔explained 셋트 규칙

`knowledge/<rel>.md`와 `explained/<rel>.md`는 **같은 폴더 경로 · 같은 파일명 · 같은 질문 · 같은 질문 순서**를 갖는 한 쌍이다. 순서까지 쌍의 일부인 이유는 explained가 복습에 직접 읽는 산출물이라 섹션 순서가 곧 학습 순서이기 때문이다.

## 판단 체크 — LLM

린터가 못 보는, 의미 이해가 필요한 항목만 LLM이 본다.

- **OA 언어**: Official Answer 본문의 영어가 공식 문서 원문인가, AI가 지어낸 영어인가.
- **영어 원문 보존**: 커밋 전에 고친 knowledge 파일에서, Official Annotation 또는 OA 본문이 있던 Q의 영어 원문이 사라졌으면 위반. `git diff HEAD -- <파일>`로 확인한다. 원문을 OA로 복원하거나 Reference로 추적한다.
- **중복 설명 탐지** (전체 검증 시): 전용 문서가 존재하는 주제를 다른 문서에서 *설명*하면 위반.
  - 위반(설명): 개념·동작·원리를 서술하는 단락이나 Q&A
  - 허용(언급): 사실만 언급하거나 내부 링크 동반
  - 전용 문서 판별: `knowledge/` 폴더 구조와 파일명 기준.
- **Reference 보완**: Official Answer가 영어 원문이고 Reference가 비어 있거나 `URL_UNKNOWN`이면, WebFetch로 출처 URL 후보를 찾는다.

### 코드로 강제 불가 — 판정 대장

**아래는 검사 지시가 아니라 판정 기록이다** — "이 규칙은 왜 검사기가 없는가"를 적어둔 대장이라 `/validate`가 훑지 않는다.

규칙 본문이 구체화되면 판정이 뒤집힐 수 있으므로 사유를 함께 남긴다. 사유가 아직 성립하면 재조사가 필요 없고, 사유가 무너진 항목만 다시 본다. 재판정한 행은 그 행의 날짜를 갱신한다.

| 규칙 묶음 | 어디에 있나 | 왜 코드로 못 잡나 | 판정일 |
|---|---|---|---|
| 해설 품질 전반 — known→unknown 발판 보정, 비유·예시 톤, 코드 예시 레벨 | explanation-guide 「known→unknown 원칙」·「예시와 비유」 | 학습자가 무엇을 아는지와 설명이 그 위에 얹혔는지를 판정해야 한다. 글자로 드러나지 않는다 | 2026-08-05 |
| 신조어·불명확한 비유 금지 | explanation-guide 「금지」 | 한 번 나온 표현은 check-wording(blocked-expressions.json)이 잡는다. 처음 나오는 즉석 표현은 대조할 목록이 없어 못 잡는다 | 2026-10-23 |
| 다이어그램 트리거 판정 (구조·흐름·공간·비교) | explanation-guide 「다이어그램」 | 그 문단이 "구성된다"류 내용인지 뜻으로 갈린다. fence 없는 코드블록 존재 여부는 셀 수 있지만 "그려야 했는데 안 그렸다"는 못 본다 | 2026-08-05 |
| digest 저장·해설·버림 판정 기준 — 계보 vs 효용, 기계적 후속, 실무 빈도 | [digest/loop.md 저장 판정](../digest/loop.md#2-저장-판정) | 문장 내용을 읽어야 갈린다. 같은 형식의 문장이 한쪽에선 저장, 다른 쪽에선 버림이다 | 2026-08-05 |
| 질문 작성 원칙 — 수수께끼 금지, 답의 키워드를 질문에 미리 적지 않기, 리스트 암기 금지, 결론 대신 원리 | [digest/question-proposal.md](../digest/question-proposal.md)의 작성 원칙 | 질문이 답을 미리 불러주는지 판정하려면 질문과 답의 관계를 이해해야 한다 | 2026-08-05 |
| review 면접 진행 — 힌트 금지, 답변 완전성 검증, 질문 과부하 금지 | review/SKILL.md | 대화 중 행동이라 레포 파일에 흔적이 남지 않는다 | 2026-08-05 |
| 출처 순위 — 상위 출처에서 찾으면 하위로 안 내려간다 | primary-source/SKILL.md | 같은 이유. 어느 순위에서 멈췄는지가 파일에 안 남는다 | 2026-08-05 |
| production-guide Before/After 실행 여부 | production-guide.md | 절차를 밟았는지 자체가 산출물에 안 남는다. 결과물 정합은 린터가 따로 본다 | 2026-08-05 |
| 폴더 선택·파일명 키워드 적절성 | file-placement 「폴더 선택」·「파일명 작성」 | "핵심 키워드가 들어갔나", "주제가 맞나"는 의미 판단이다. 소문자·하이픈 같은 형식만 린터가 본다 | 2026-08-05 |
| 목차 들여쓰기와 본문 위계의 논리적 일치 | document-structure「계층 구조 표현」 | 순서 1:1은 목차-본문 순서 검사가 보지만, 꼬리질문이 논리적으로 부모에 종속되는지는 뜻으로 갈린다 | 2026-08-05 |
| 발판으로 인용한 explained H1이 실제 원문 그대로인지 | explanation-guide 「known→unknown 원칙」 | 인용이 채팅 응답에 나가고 파일에 안 남아 검사할 대상이 없다 | 2026-08-05 |

규칙을 새로 만들 때 "코드로 내릴 수 있나"를 정하는 방법은 `~/WebstormProjects/main/ai-contexts/plugins/ac/contexts/rules-as-code.md`에 있다.

## 검증 및 수정

1. `npm run validate-lint`로 결정론 위반을 수집한다. 인자가 경로면 `-- <경로>`, 그 밖에는 인자 없이 돌린다.
2. 판단 체크를 수행한다. 전체 검증이면 중복 설명 탐지를 서브에이전트로 병렬 처리하고, 각 에이전트에 전체 파일 경로 목록을 함께 준다.
3. 결정론·판단 위반 목록과 Reference URL 후보를 합쳐 보고한다.
4. 사용자 승인 후 수정한다. 린터 위반은 메시지에 적힌 조치를 따르되, `/digest`로 처리하라는 위반은 고치지 않고 보고만 한다.
