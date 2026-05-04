# Knowledge Archive

## 약어
- OA = Official Answer

## 학습 출처 선호도
- 1순위: Wikipedia, MDN
- 공식문서 원문(영어)을 Official Answer로 사용

## frontmatter `source` 키

KA 문서가 어떤 출처를 기반으로 작성됐는지 표기. `scripts/list-candidates.mts`가 이 값을 그대로 export하고, full-refresh dry-run에서 출처별 그룹화에 사용된다.

| 값 | 의미 |
|----|------|
| `official` | MDN·공식 docs 등 1차 소스 기반 |
| `google-doc` | 사용자 구글 문서 기반 (검증 약함) |
| `unverified` | 출처 명시 없거나 검증 안 됨 |

frontmatter에 `source` 키가 없으면 list-candidates 출력에서 빠진다 (full-refresh dry-run에서 "출처 미상" 그룹).

## 변경 시 동기화

### contexts (양식·규칙)

`.claude/contexts/` 변경 시 `knowledge/` 전체를 `/validate`로 재검증하고, AC `full-refresh`·`doc-router`가 KA 양식을 참조하니 함께 점검한다.

### knowledge frontmatter

`tags`/`source`/`publishable` 키 변경 시 `scripts/list-candidates.mts`(파싱)와 AC `full-refresh`(JSON 입력)를 함께 점검한다.

### knowledge 본문 구조

헤딩 위계나 `[TODO]`/`[UNVERIFIED]`/`[BACKLOG]` 마커 변경 시 `scripts/list-candidates.mts`(파싱)와 `/validate`(검증)를 함께 점검한다.

### list-candidates 출력 형식

`scripts/list-candidates.mts`의 Candidate 인터페이스 변경 시 AC `full-refresh`가 받는 JSON 인터페이스도 함께 수정한다.

### convert 스킬 절차

`.claude/skills/convert/SKILL.md` 변경 시 AC `doc-router`가 참조하는 절차도 함께 점검한다.
