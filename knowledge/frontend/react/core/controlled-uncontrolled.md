---
tags: [react, design-pattern, concept]
source: official
publishable: true
priority:
---
# Questions
- 어떤 컴포넌트를 controlled 또는 uncontrolled라고 부를 때, 무엇을 보고 가르는가?
  - 둘 중 어느 쪽으로 설계하느냐에 따라 무엇을 맞바꾸게 되는가?

---

# Answers

## 어떤 컴포넌트를 controlled 또는 uncontrolled라고 부를 때, 무엇을 보고 가르는가?

### Official Answer
It is common to call a component with some local state "uncontrolled".
For example, the original `Panel` component with an `isActive` state variable is uncontrolled because its parent cannot influence whether the panel is active or not.

In contrast, you might say a component is "controlled" when the important information in it is driven by props rather than its own local state.
This lets the parent component fully specify its behavior.
The final `Panel` component with the `isActive` prop is controlled by the `Accordion` component.

### Reference
- https://react.dev/learn/sharing-state-between-components

---

## 둘 중 어느 쪽으로 설계하느냐에 따라 무엇을 맞바꾸게 되는가?

### Official Answer
Uncontrolled components are easier to use within their parents because they require less configuration.
But they're less flexible when you want to coordinate them together.
Controlled components are maximally flexible, but they require the parent components to fully configure them with props.

### Reference
- https://react.dev/learn/sharing-state-between-components