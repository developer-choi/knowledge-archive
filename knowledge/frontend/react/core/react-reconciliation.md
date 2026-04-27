---
tags: [react, concept, performance]
---
# Questions

- React diffing 휴리스틱이 기반하는 두 가정은 무엇인가?

---

# Answers

## React diffing 휴리스틱이 기반하는 두 가정은 무엇인가?

### Official Answer
Instead, React implements a heuristic O(n) algorithm based on two assumptions:

1. Two elements of different types will produce different trees.
2. The developer can hint at which child elements may be stable across different renders with a key prop.

In practice, these assumptions are valid for almost all practical use cases.

> #### Key Terms:
> - **heuristic**: 정확한 최소해 대신 "대부분 맞는" 어림짐작으로 속도를 확보하는 방식
> - **assumptions**: 알고리즘이 효율적으로 동작하기 위해 깔고 가는 전제. 깨지면 비효율 발생
> - **stable across different renders**: 같은 항목이 렌더 간에 같은 식별자로 유지되는 성질
> - **key prop**: 자식 엘리먼트의 안정적 식별자를 React에 알려주는 prop

> #### AI Annotation:
> 두 가정이 깨졌을 때 발생하는 비효율 예시:
> - 가정 1 위반: 같은 내용을 보여주는데 부모 태그를 `<div>` ↔ `<span>`으로 바꾸면, React는 다른 트리로 보고 전부 unmount → remount → state 손실.
> - 가정 2 위반: `key={Math.random()}` 같이 매 렌더마다 바뀌는 key를 쓰면, 같은 항목인데도 React가 다른 항목으로 인식해 재생성.

### Reference
- https://legacy.reactjs.org/docs/reconciliation.html
