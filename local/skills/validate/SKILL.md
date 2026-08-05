---
disable-model-invocation: true
argument-hint: [대상 파일/디렉토리 경로 또는 "전체"]
---

# KA 문서 검증

[`knowledge/`](../../contexts/directory-roles.md)·`explained/` 하위 문서가 KA 규칙을 준수하는지 검증하고, 위반을 수정한다.

검증은 두 층으로 나뉜다. **결정론 체크**(grep·구조 판정)는 린터 스크립트가 전수 처리하고, **판단 체크**(의미 이해 필요)는 LLM이 본다.

## 규칙 소스

규칙 정의의 단일 출처는 컨텍스트 파일이다. 판단 체크 전 반드시 읽는다:

| 규칙 | 파일 |
|------|------|
| 문서 구조 | [document-structure.md](../../contexts/document-structure.md) |
| 콘텐츠 포맷 | [content-format.md](../../contexts/content-format.md) |
| 파일 배치 | [file-placement.md](../../contexts/file-placement.md) |
| 태그 목록 | [tags.md](../../contexts/tags.md) |
| 템플릿 | [template.md](../../contexts/template.md) |

## 결정론 체크 — 린터 스크립트

기계가 딱 떨어지게 판정하는 항목은 `scripts/validate-lint.mts`가 전담한다. LLM이 통독으로 같은 일을 하지 않는다.

```bash
npm run validate-lint -- <대상 경로|--changed <baseRef>>   # 위반 목록 출력 (텍스트)
npm run validate-lint -- --changed <baseRef> --json        # 기계 소비용 JSON
```

- 대상 미지정 → `knowledge/` + `explained/` 전체.
- 경로 지정 가능 (`knowledge/cs` 등). 회차 변경분만 보려면 `--changed <baseRef>` (그 ref..HEAD diff).
- hard violation 있으면 exit 1, warning(제안성)만이면 exit 0.

체크 목록의 정본은 `scripts/validate-lint.mts`의 `CHECK_REGISTRY`다 — 여기에 옮겨 적지 않는다. 어떤 체크가 있는지·무엇을 근거로 하는지는 그 배열을 보고, 실제 위반은 린터가 ID와 메시지를 함께 출력한다.

### knowledge↔explained 셋트 규칙

`knowledge/<rel>.md`와 `explained/<rel>.md`는 **같은 폴더 경로 · 같은 파일명 · 같은 질문**을 갖는 한 쌍이다. 린터가 E1·E2·E3·E5·E6 다섯 방향에서 강제하며 다섯 모두 error다 — 위반이 있으면 커밋이 거부된다. explained는 복습에 직접 읽는 산출물이므로 섹션 순서가 곧 학습 순서이며, 그래서 E6도 차단 대상이다.

## 판단 체크 — LLM

린터가 못 보는, 의미 이해가 필요한 항목만 LLM이 본다.

- **OA 언어**: Official Answer 본문이 공식 문서 원문(대체로 영어)으로 유지되는가. (린터 K5가 OA 본문의 한글을 위치 불문 전부 잡으므로, 남는 판정은 "한글은 없는데 영어 자체가 원문이 아니라 AI가 지어낸 영어인가"뿐이다.)
- **영어 원문 보존**: 과거 Official Annotation 또는 OA 본문이 있던 Q에서 영어 원문이 사라졌으면 위반 (마이그 중 삭제 사고). 이전 버전 대비가 필요하므로 git diff로 확인한다. 원문을 OA로 복원하거나 Reference로 추적한다.
- **중복 설명 탐지** (전체 검증 시): 전용 문서가 존재하는 주제를 다른 문서에서 *설명*하면 위반.
  - 위반(설명): 개념·동작·원리를 서술하는 단락이나 Q&A ("TLS는 핸드셰이크로 키를 교환하고…")
  - 허용(언급): 사실만 언급하거나 내부 링크 동반 ("HTTPS는 TLS를 사용한다")
  - 전용 문서 판별: `knowledge/` 폴더 구조와 파일명 기준. 서브에이전트로 병렬 검증 시 각 에이전트에게 전체 파일 경로 목록을 전달한다.
- **Reference 보완**: Official Answer가 영어 원문이고 Reference가 비어 있거나 `URL_UNKNOWN`이면, WebFetch로 출처 URL을 탐색하여 채운다.

`priority`는 판단 체크 대상이 아니다 — 키가 없어도 위반이 아니고, 채워져 있으면 보존한다 ([content-format.md](../../contexts/content-format.md)의 priority 참고). 값 어휘는 린터 K16이, "AI가 새로 쓰거나 값을 바꾸는 것"은 PreToolUse 훅(`local/hooks/block-knowledge-priority.mjs`)이 저장 전에 막는다.

### 코드로 강제 불가 — 판정 대장

**아래는 검사 지시가 아니라 판정 기록이다.** `/validate`가 매번 훑을 목록이 아니라, "이 규칙은 왜 검사기가 없는가"를 적어둔 대장이다 — 위의 네 항목이 실제 검사 대상인 것과 성격이 다르다.

규칙 본문이 구체화되면 판정이 뒤집힐 수 있으므로 사유를 함께 남긴다. 사유가 아직 성립하면 재조사가 필요 없고, 사유가 무너진 항목만 다시 본다. 재판정한 행은 그 행의 날짜를 갱신한다.

| 규칙 묶음 | 어디에 있나 | 왜 코드로 못 잡나 | 판정일 |
|---|---|---|---|
| 해설 품질 전반 — known→unknown 발판 보정, 비유·예시 톤, 코드 예시 레벨 | explanation-guide §0·§2 | 학습자가 무엇을 아는지와 설명이 그 위에 얹혔는지를 판정해야 한다. 글자로 드러나지 않는다 | 2026-08-05 |
| 신조어·불명확한 비유 금지 | explanation-guide §3 | 사전에 없는 즉석 표현을 가리는 일이라 대조할 목록 자체를 만들 수 없다 | 2026-08-05 |
| 다이어그램 트리거 판정 (구조·흐름·공간·비교) | explanation-guide §4 | 그 문단이 "구성된다"류 내용인지 뜻으로 갈린다. fence 없는 코드블록 존재 여부는 셀 수 있지만 "그려야 했는데 안 그렸다"는 못 본다 | 2026-08-05 |
| digest 저장·해설·버림 판정 기준 — 계보 vs 효용, 기계적 후속, 실무 빈도 | digest/SKILL.md 루프「2. 저장 판정」 | 문장 내용을 읽어야 갈린다. 같은 형식의 문장이 한쪽에선 저장, 다른 쪽에선 버림이다 | 2026-08-05 |
| 질문 작성 원칙 — 수수께끼 금지, 정답 키워드 누설 금지, 리스트 암기 금지, 결론 대신 원리 | digest/SKILL.md「질문 제안」의 ② 작성 원칙 | 질문이 답을 미리 불러주는지 판정하려면 질문과 답의 관계를 이해해야 한다 | 2026-08-05 |
| convert 판정 — 사용자 필기에 없는 Q 추가 금지, 검증 불가 항목 drop | convert/SKILL.md | 원본(PDF·MD)과 산출물을 뜻으로 대조해야 하고, 원본이 레포 밖에 있다 | 2026-08-05 |
| review 면접 진행 — 힌트 금지, 답변 완전성 검증, 질문 과부하 금지 | review/SKILL.md | 대화 중 행동이라 레포 파일에 흔적이 남지 않는다 | 2026-08-05 |
| search 출처 순위 — 상위 출처에서 찾으면 하위로 안 내려간다 | search/SKILL.md | 같은 이유. 어느 순위에서 멈췄는지가 파일에 안 남는다 | 2026-08-05 |
| production-guide Before/After 실행 여부 | production-guide.md | 절차를 밟았는지 자체가 산출물에 안 남는다. 결과물 정합은 린터가 따로 본다 | 2026-08-05 |
| 폴더 선택·파일명 키워드 적절성 | file-placement §1·§2 | "핵심 키워드가 들어갔나", "주제가 맞나"는 의미 판단이다. 소문자·하이픈 같은 형식만 린터(K10)가 본다 | 2026-08-05 |
| 목차 들여쓰기와 본문 위계의 논리적 일치 | document-structure「계층 구조 표현」 | 순서 1:1은 린터(K7)가 보지만, 꼬리질문이 논리적으로 부모에 종속되는지는 뜻으로 갈린다 | 2026-08-05 |
| 발판으로 인용한 explained H1이 실제 원문 그대로인지 | explanation-guide §0 | 인용이 채팅 응답에 나가고 파일에 안 남아 검사할 대상이 없다 | 2026-08-05 |

규칙을 새로 만들 때 "코드로 내릴 수 있나"를 따지는 방법론은 전역 문서(`~/.claude/contexts/rules-as-code.md`)에 있다. 이 표는 그 방법론이 아니라 KA의 판정 결과다.

## 검증 및 수정

1. `npm run validate-lint`로 결정론 위반을 수집한다 (전체면 전체, 회차면 `--changed`).
2. 판단 체크를 수행한다. 전체 검증이면 중복 설명 탐지를 위해 서브에이전트로 병렬 처리하되 전체 파일 경로 목록을 함께 전달한다.
3. **Reference 보완**: 위 조건의 Q에 WebFetch로 URL을 탐색해 채운다.
4. 결정론 + 판단 위반 목록을 합쳐 보고한다.
5. 사용자 승인 후 수정한다.

### 수정 방침 (자동 수정 불가 항목)

| 위반 | 조치 |
|------|------|
| E1 커버리지 누락 (explained 존재 + 일부 질문 누락) | 자동 수정 불가 — `/digest`로 해당 파일을 다뤄 해설 생성. 누락 목록만 보고. **knowledge 질문을 지워서 맞추지 않는다.** |
| E5 짝 부재 (explained 파일 자체가 없음) | 자동 수정 불가 — `/digest`로 해설 생성. 목록만 보고. |
| E2 고아 섹션 | 사용자 확인 후 섹션 삭제 |
| E3 고아 파일 | 사용자 확인 후 파일 삭제 |
| E6 순서 불일치 | explained 섹션 순서를 knowledge 질문 순서에 맞춰 재배치 (knowledge가 기준) |
| K9 본편 없는 `.sub.md` | 자동 수정 불가 — 본편이 어디로 갔는지 git log로 확인 후 보고. 본편이 **이동·개명**됐으면 곁가지를 따라 옮기고, 본편이 **삭제**됐으면 곁가지를 본편 이름으로 개명한다(`.sub` 제거, explained 미러도 함께). 어느 쪽인지는 사용자가 판단 ([file-placement.md](../../contexts/file-placement.md)「곁가지 분리」). |

그 외 결정론 위반(빈 섹션·중복 헤딩·인라인 출처·구분자 중복·마커·펜스 등)은 승인 후 직접 수정한다.
