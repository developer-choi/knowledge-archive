---
tags: [react, concept, principle]
source: official
priority: 2
publishable: true
---

# Questions
- 이벤트 핸들러 안에서 state setter를 여러 번 호출하면, React는 그 갱신들을 언제 처리하는가?

---

# Answers

## 이벤트 핸들러 안에서 state setter를 여러 번 호출하면, React는 그 갱신들을 언제 처리하는가?

### Official Answer

React waits until all code in the event handlers has run before processing your state updates.

This lets you update multiple state variables—even from multiple components—without triggering too many re-renders.
But this also means that the UI won’t be updated until after your event handler, and any code in it, completes.
This behavior, also known as batching, makes your React app run much faster.
It also avoids dealing with confusing “half-finished” renders where only some of the variables have been updated.

### Reference
- https://react.dev/learn/queueing-a-series-of-state-updates