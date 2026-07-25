---
tags: [react, concept, principle]
source: official
priority: 2
publishable: true
---

# Questions
- React 컴포넌트가 한 번 렌더될 때, 그 렌더 안에서 state 값은 언제 정해지고 언제까지 그대로인가?
  - 리렌더가 일어나면 이전 렌더에서 만들어진 이벤트 핸들러와 지역 변수는 어떻게 되는가?

---

# Answers

## React 컴포넌트가 한 번 렌더될 때, 그 렌더 안에서 state 값은 언제 정해지고 언제까지 그대로인가?

### Official Answer

state behaves more like a snapshot.
Setting it does not change the state variable you already have, but instead triggers a re-render.

The JSX you return from that function is like a snapshot of the UI in time.
Its props, event handlers, and local variables were all calculated using its state at the time of the render.
Its value was “fixed” when React “took the snapshot” of the UI by calling your component.

Setting state only changes it for the next render.
A state variable’s value never changes within a render, even if its event handler’s code is asynchronous.

### Reference
- https://react.dev/learn/state-as-a-snapshot

---

## 리렌더가 일어나면 이전 렌더에서 만들어진 이벤트 핸들러와 지역 변수는 어떻게 되는가?

### Official Answer

Variables and event handlers don’t “survive” re-renders.
Every render has its own event handlers.
Every render (and functions inside it) will always “see” the snapshot of the state that React gave to that render.
Event handlers created in the past have the state values from the render in which they were created.

### Reference
- https://react.dev/learn/state-as-a-snapshot
