# Knowledge Archive 라이프사이클

KA 레포는 학습 콘텐츠를 생성·소비하는 사이클이 명확히 분리되어 있다. 어느 스킬에서 어떤 파일이 생성되고, 어디서 소비되는지를 한눈에 본다.

## 스킬·스크립트 입출력

| 도구 | Read | Write | 트리거 |
|------|------|------|------|
| `/digest` | 공식 문서 URL (WebFetch), 사용자 텍스트, 기존 `knowledge/` 파일 | `knowledge/<rel>.md` (OFF 1단계에서 저장), `explained/<rel>.md` (OFF 2단계에서 확정 질문 + 세션 오해), `assets/<rel>/` (데모·이미지) | 공식 URL + "같이 읽자" / 원문 + "필기해줘" |
| `/exam` | `knowledge/<rel>.md` | `$env:TEMP/ka-exam-*.html` (시험지·결과) | "시험", "/exam" 명시 |
| `/review` | `knowledge/<rel>.md`, `explained/<rel>.md` (다음 질문 전 해설 캐시) | Read 전용 (기본) | "복습하자", "면접 연습" 명시 |
| `/validate` | 린터가 정한 스캔 범위 (`validate-lint.mts`) | `knowledge/`·`reference/` 위반 수정, `explained/<rel>.md` 고아 섹션·파일 삭제 | "검증해줘", "/validate" 명시 |
| `/primary-source` | KA 내부 (`knowledge/` 우선, `reference/`·`tips/`·`archives/` 포함), 외부 공식문서 | Read 전용 | "/primary-source" 명시 |
| `list-candidates` (npm) | `knowledge/` 하위 모든 `.md`, git log | stdout 또는 `--out` 경로에 Candidate[] JSON | CLI |

## 동기화 규칙

### knowledge → explained

`knowledge/`와 `explained/`는 같은 폴더 경로·같은 파일명·같은 질문을 갖는 한 쌍이다. 이 셋트는 `validate-lint`의 셋트 검사(커버리지 누락·고아 섹션·고아 파일·짝 부재·질문 순서)가 강제하며, pre-commit 훅이 커밋 시점에 발동한다 ([validate SKILL](../skills/validate/SKILL.md)의 「knowledge↔explained 셋트 규칙」).

`knowledge/<rel>.md`의 **내용**이 바뀌면 대응 explained는 outdated가 되지만 이건 린터가 못 잡는다 — 질문 제목이 그대로면 통과한다. **자동 재생성은 없으며** `/digest`로 그 파일을 다시 다뤄야 갱신된다.

### contexts → 양식 위반 검출

`local/contexts/` (양식·규칙) 변경 시 `/validate` 전체 재실행으로 기존 `knowledge/`가 새 규칙을 위반하는지 점검한다.

## explained/ 트리 = 학습자 모델

별도 데이터 파일(아는 것/모르는 것 저장소) 없이, `explained/` 트리 자체가 학습자가 아는 것의 창고다. 어떤 개념이 explained 섹션(H1 헤딩)으로 존재하면 학습자가 한 번 이상 설명을 받은(=어렴풋이 아는) 것으로 본다. 학습 스킬은 설명 생성 전 explained 트리를 훑어 발판 높이를 보정한다 — [explanation-guide.md §0](explanation-guide.md) 참고. 막혀서 못 푼 항목은 KA가 아니라 AC 백로그로 정리되므로 KA에는 "모르는 것" 저장소가 필요 없다.
