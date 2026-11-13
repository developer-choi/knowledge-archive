# Knowledge Archive 라이프사이클

KA 레포는 학습 콘텐츠를 생성·소비하는 사이클이 명확히 분리되어 있다. 어느 스킬에서 어떤 파일이 생성되고, 어디서 소비되는지를 한눈에 본다.

## 스킬 입출력

| 스킬 | Read | Write |
|------|------|------|
| `/digest` | 공식 문서 URL, 기존 `knowledge/`·`explained/`, backlog 레포 `projects/knowledge-archive/` | `knowledge/<rel>.md`, `explained/<rel>.md`, `assets/<rel>/`, 다 소화된 backlog 항목 삭제 |
| `/exam` | `knowledge/<rel>.md`, `explained/<rel>.md` | 답안에 지시문이 있을 때만 그 지시대로 `knowledge/` |
| `/review` | `knowledge/<rel>.md`, `explained/<rel>.md` | 없음 |
| `/validate` | `knowledge/`·`reference/`·`explained/`, `local/contexts/` 규칙 문서 | 같은 세 폴더의 위반 수정 |
| `/primary-source` | KA 내부, 외부 공식문서 | 없음 |

## 동기화 규칙

### knowledge → explained

`knowledge/`와 `explained/`는 한 쌍이다 — [knowledge↔explained 셋트 규칙](../../.claude/skills/validate/SKILL.md#knowledgeexplained-셋트-규칙).

`knowledge/<rel>.md`의 **내용**이 바뀌면 대응 explained는 outdated가 되지만 이건 린터가 못 잡는다 — 질문 제목이 그대로면 통과한다. 자동으로 다시 만들지도 않는다.

### contexts → 양식 위반 검출

`local/contexts/`를 고치면 기존 문서가 새 규칙의 판단 체크를 어기는지 `/validate 전체`로 본다. 린터 체크는 pre-commit이 그 커밋에서 전체를 다시 돈다.

## explained/ 트리 = 학습자 모델

별도 데이터 파일(아는 것/모르는 것 저장소) 없이, `explained/` 트리 자체가 학습자가 아는 것의 창고다. 학습 스킬이 이 트리로 발판 높이를 맞추는 법은 [발판 높이 보정](explanation-guide.md#발판-높이-보정-설명-생성-전-1회).
