---
tags: [react, concept, performance]
publishable: false
source: google-doc
priority: 1
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

### Reference
- https://legacy.reactjs.org/docs/reconciliation.html
