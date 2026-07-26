---
tags: [react, concept]
source: official
priority:
publishable: true
---
# Questions
- 어떤 컴포넌트가 context를 읽을 때, 위쪽에 그 context를 제공하는 컴포넌트가 여럿이면 어느 값을 읽는가?
- context의 단점은 무엇인가?

---

# Answers

## 어떤 컴포넌트가 context를 읽을 때, 위쪽에 그 context를 제공하는 컴포넌트가 여럿이면 어느 값을 읽는가?

### Official Answer
The component will use the value of the nearest `<LevelContext>` in the UI tree above it.

In CSS, you can specify `color: blue` for a `<div>`, and any DOM node inside of it, no matter how deep, will inherit that color unless some other DOM node in the middle overrides it with `color: green`.
Similarly, in React, the only way to override some context coming from above is to wrap children into a context provider with a different value.

### Reference
- https://react.dev/learn/passing-data-deeply-with-context

---

## context의 단점은 무엇인가?

### Official Answer
Context is not limited to static values.
If you pass a different value on the next render, React will update all the components reading it below!

React automatically re-renders all the children that use a particular context starting from the provider that receives a different value.
The previous and the next values are compared with the `Object.is` comparison.
Skipping re-renders with `memo` does not prevent the children receiving fresh context values.

### Reference
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/reference/react/useContext#caveats
