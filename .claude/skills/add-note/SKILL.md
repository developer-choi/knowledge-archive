---
description: 공부한 내용을 knowledge 문서에 필기한다. 필기, 정리, 기록, 학습, 공부, TODO 답변 채우기 시 사용.
argument-hint: [필기할 내용 또는 주제]
---

# 필기 추가

사용자가 제공한 학습 내용을 knowledge/ 문서에 Q&A 형식으로 기록한다.

## 작업 순서

### Step 1. 파일 위치 결정

[file-placement.md](../../contexts/file-placement.md)를 읽고, 필기를 추가할 파일을 결정한다.

- 기존 파일에 관련 내용이 있으면 → 해당 파일에 추가
- 새로운 주제면 → [folder-blueprint.md](../../contexts/folder-blueprint.md) 참고하여 새 파일 생성

### Step 2. 내용 작성

[content-format.md](../../contexts/content-format.md)를 읽고, 아래를 작성한다.

- **Questions**: 면접 질문 형태로 정리. 오개념 타파(Trick Question) 포함 권장.
- **Official Answer**: 공식 문서 원문 또는 객관적 사실.
- **Reference**: 출처 URL.
- 태그는 [tags.md](../../contexts/tags.md)에서 선택.

### Step 3. 구조 검증

[document-structure.md](../../contexts/document-structure.md)를 읽고, 아래를 확인한다.

- Questions 목록과 Answers 본문의 순서가 1:1로 일치하는가?
- 앵커 링크가 올바르게 연결되는가?
- [template.md](../../contexts/template.md) 양식을 준수하는가?

문제가 있으면 사용자에게 알리지 않고 직접 수정한다.

## 예시

**사용자 입력**: "React의 useMemo는 렌더링 사이에 계산 결과를 캐싱한다고 배웠어. 출처: https://react.dev/reference/react/useMemo"

**AI 행동**:
1. `knowledge/frontend/react/` 하위에서 관련 파일 탐색
2. 적절한 파일에 아래 내용 추가:

```markdown
# Questions
- [What does useMemo do?](#what-does-usememo-do)

# Answers
## What does useMemo do?
### Official Answer
useMemo is a React Hook that lets you cache the result of a calculation between re-renders.

### Reference
- https://react.dev/reference/react/useMemo
```
