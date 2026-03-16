---
description: 공부한 내용을 knowledge 문서에 필기한다. 필기, 정리, 기록, 학습, 공부, TODO 답변 채우기 시 사용.
argument-hint: [필기할 내용 또는 주제]
---

# 필기 추가

사용자가 제공한 학습 내용을 knowledge/ 문서에 Q&A 형식으로 기록한다.

## 작업 순서

1. [production-guide.md](../../contexts/production-guide.md)의 **Before** 읽기
2. 사용자가 제공한 내용을 [content-format.md](../../contexts/content-format.md)에 따라 Q&A로 작성
3. [production-guide.md](../../contexts/production-guide.md)의 **After** 실행

## 예시

**사용자 입력**: "React의 useMemo는 렌더링 사이에 계산 결과를 캐싱한다고 배웠어. 출처: https://react.dev/reference/react/useMemo"

**AI 행동**:
1. Before: content-format.md 원칙 확인
2. Q&A 작성:

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

3. After: 파일 배치, 구조 검증, 양식 확인
