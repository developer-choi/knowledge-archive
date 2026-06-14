---
tags: [react, concept]
source: official
priority: 1
---
# Questions
- React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?
- 컴포넌트 함수는 매 렌더마다 새로 호출되는데, `useState`로 만든 값이 직전 값을 기억하는 메커니즘은 무엇인가?
- `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?
- `key`는 전역으로 유일해야 하는가?

---

# Answers

## React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?

### Official Answer
React preserves a component's state for as long as it's being rendered at its position in the UI tree.
If it gets removed, or a different component gets rendered at the same position, React discards its state.

Notice how the moment you stop rendering the second counter, its state disappears completely.
That's because when React removes a component, it destroys its state.
When you tick "Render the second counter", a second `Counter` and its state are initialized from scratch (`score = 0`) and added to the DOM.

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## 컴포넌트 함수는 매 렌더마다 새로 호출되는데, `useState`로 만든 값이 직전 값을 기억하는 메커니즘은 무엇인가?

### Official Answer
When you give a component state, you might think the state "lives" inside the component.
But the state is actually held inside React.
React associates each piece of state it's holding with the correct component by where that component sits in the render tree.

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?

### Official Answer
Keys aren't just for lists!
You can use keys to make React distinguish between any components.
By default, React uses order within the parent to discern between components.
Specifying a key tells React to use the key itself as part of the position, instead of their order within the parent.
This is why, even though you render them in the same place in JSX, React sees them as two different counters, and so they will never share state.

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## `key`는 전역으로 유일해야 하는가?

### Official Answer
Remember that keys are not globally unique.
They only specify the position within the parent.

### Reference
- https://react.dev/learn/preserving-and-resetting-state
