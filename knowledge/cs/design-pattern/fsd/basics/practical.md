---
tags: [fsd, practice, troubleshooting]
---

# Questions
- [How should we handle it when two slices need to share the same logic?](#how-should-we-handle-it-when-two-slices-need-to-share-the-same-logic)
- [[TODO] How would you resolve a circular dependency between two different slices?](#todo-how-would-you-resolve-a-circular-dependency-between-two-different-slices)
- [[TODO] What are the major trade-offs or overheads you've experienced when implementing FSD?](#todo-what-are-the-major-trade-offs-or-overheads-youve-experienced-when-implementing-fsd)

---

# Answers

## How should we handle it when two slices need to share the same logic?

### Keywords
Shared Logic, Composition

### Official Answer
> AI Annotation:
> 1. **Shared 레이어로 내리기**: 만약 공유하려는 로직이 특정 비즈니스와 무관한 순수 유틸리티라면 Shared 레이어로 이동시킵니다.
> 2. **하위 레이어(Entities)로 내리기**: 두 Features가 동일한 데이터 모델을 공유한다면, 그 로직을 Entities 레이어의 관련 슬라이스로 옮깁니다.
> 3. **상위 레이어(Widgets/Pages)에서 조합**: 두 슬라이스를 직접 연결하지 말고, 상위 계층인 Widgets나 Pages에서 두 슬라이스를 각각 가져와서 로직을 조립(Composition)합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## [TODO] How would you resolve a circular dependency between two different slices?
### Keywords

### Official Answer

### Reference

---

## [TODO] What are the major trade-offs or overheads you've experienced when implementing FSD?
### Keywords

### Official Answer

### Reference
