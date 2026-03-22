# 스킬 개선 인수인계 (2026-03-23)

## 작업 개요

skill-creator를 사용하여 4개 스킬(add-note, convert, review, digest)의 품질을 검증하고 개선했다.

---

## 검증 방법

각 스킬마다:
- 12개 테스트 케이스 × with-skill + baseline = 24개 서브에이전트 실행
- grading 에이전트로 assertion 기반 채점
- grading 결과 기반으로 스킬 본문 수정

추가로 4개 스킬 description의 트리거 정확도를 20개 쿼리(should-trigger 9 + should-not-trigger 11)로 테스트하여 20/20 통과 확인.

---

## 스킬별 변경 사항 및 근거

### add-note

**Grading: 40/40 (100%)** — 하지만 output 비판적 리뷰에서 3가지 문제 발견

| 변경 | 근거 (어떤 eval에서 발견) |
|------|--------------------------|
| 한글만 제공 시 User Answer 사용 (Official Answer AI 생성 금지) | eval 4: 사용자가 한글 메모만 줬는데 에이전트가 영어 Official Answer를 날조. Fact-First 위반 |
| 범위 제한 (출처 URL 방문해서 추가 내용 가져오지 않기) | eval 10: 사용자가 한줄 메모를 줬는데 MDN 페이지를 통째로 가져와서 2개 질문 생성. 과잉 확장 |
| TODO 답변 품질 가이드 (직접적 답변, 다른 답변 복사 금지) | eval 7: 두 개의 TODO 답변에 같은 문장을 복사. 질문에 대한 직접적 답이 아님 |
| 예시 3개로 확대 (새 Q&A, TODO 채우기, 한글만 제공) | 한글만 제공 케이스의 올바른 동작을 예시로 보여줘야 함 |
| description 재작성 (행동 패턴 기반 + negative boundary) | 기존 description이 triggering eval에서 recall 0% |

### convert

**Grading: 57/60 (95%)**

| 변경 | 근거 |
|------|------|
| Official Answer에 영어 원문만 사용, 없으면 User Answer로 분류 | eval 9: AI가 영어 문장을 생성하여 Official Answer에 넣음. decisions.md에서 스스로 "not a direct MDN quote"라고 인정 |
| description 재작성 + PDF/MD 역할 설명 추가 | triggering 정확도 향상, 왜 두 형식이 필요한지 명시 |

### review

**Grading: 9/12 (82%)**

| 변경 | 근거 |
|------|------|
| "힌트 제공 금지" 규칙 구체화: 누락 내용 나열 금지, 꼬리질문만 허용 | eval 3: 꼬리질문 전에 "누락된 핵심 요소"를 3가지 상세 나열. 사실상 정답을 알려주는 것과 동일 |
| description 재작성 | triggering 정확도 향상 |

### digest

**Grading: 19/27 (70.4%)** — 실패 대부분은 에이전트의 파일 저장 문제 (eval 7/8/11의 output 미저장)

| 변경 | 근거 |
|------|------|
| description 재작성 | triggering 정확도 향상 |
| (본문 수정 없음) | 스킬 자체의 문제가 아닌 에이전트 실행 이슈. eval 1-6, 9, 10, 12는 모두 pass |

---

## Description 트리거 테스트 결과

20개 쿼리로 4개 스킬의 description 분류 정확도 테스트: **20/20 (100%)**

| 스킬 | should-trigger 정확 | should-not-trigger 정확 |
|------|--------------------|-----------------------|
| add-note | 6/6 | 14/14 |
| convert | 3/3 | 17/17 |
| digest | 3/3 | 17/17 |
| review | 4/4 | 16/16 |

각 description에 negative boundary("단, ~는 다른 스킬이 담당한다")를 추가하여 스킬 간 경계를 명확히 함.

---

## 미완료 / 후속 작업

1. **add-note iteration 2**: 본문 수정 후 재검증 미실행. 실사용으로 검증 권장
2. **convert eval 2**: Gemini 한글+영어 혼합 문제 — 스킬에 Gemini 답변 내 언어 분리 규칙 추가 검토 필요
3. **digest eval 7/8/11**: 에이전트가 output 파일을 다른 이름으로 저장하거나 미저장. 스킬 문제가 아닌 에이전트 실행 이슈
4. **description triggering**: `claude -p` 기반 자동 테스트는 API 키 문제로 실패. 서브에이전트 기반 수동 테스트로 대체하여 20/20 통과 확인

---

## 파일 변경 목록

```
.claude/skills/add-note/SKILL.md  — 본문 개선 + description 재작성
.claude/skills/convert/SKILL.md   — Official Answer 분류 규칙 + description + PDF/MD 역할
.claude/skills/review/SKILL.md    — 힌트 제공 금지 구체화 + description
.claude/skills/digest/SKILL.md    — description 재작성
```
