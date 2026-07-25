---
tags: [react, performance]
source: official
priority: 2
publishable: true
---

# Questions
- `memo`를 붙이면 props가 그대로일 때 리렌더가 일어나지 않는다고 믿어도 되는가?
  - `memo`로 감쌌는데도 컴포넌트가 다시 그려진다면, 무엇이 그 리렌더를 일으킨 것인가?
- 어떤 컴포넌트에 `memo`를 붙일지 어떻게 판단하는가?
  - 개별 판단이 번거로우니 가능한 한 다 `memo`로 감싸는 방식은 어떤 대가를 치르는가?

---

# Answers

## `memo`를 붙이면 props가 그대로일 때 리렌더가 일어나지 않는다고 믿어도 되는가?

### Official Answer

This memoized version of your component will usually not be re-rendered when its parent component is re-rendered as long as its props have not changed. But React may still re-render it: memoization is a performance optimization, not a guarantee.

### Reference
- https://react.dev/reference/react/memo

---

## `memo`로 감쌌는데도 컴포넌트가 다시 그려진다면, 무엇이 그 리렌더를 일으킨 것인가?

### Official Answer

Even with `memo`, your component will re-render if its own state changes or if a context that it's using changes.

Even when a component is memoized, it will still re-render when its own state changes. Memoization only has to do with props that are passed to the component from its parent.

Even when a component is memoized, it will still re-render when a context that it's using changes.

### Reference
- https://react.dev/reference/react/memo

---

## 어떤 컴포넌트에 `memo`를 붙일지 어떻게 판단하는가?

### Official Answer

Optimizing with `memo` is only valuable when your component re-renders often with the same exact props, and its re-rendering logic is expensive. If there is no perceptible lag when your component re-renders, `memo` is unnecessary.

If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.

If a specific interaction still feels laggy, use the React Developer Tools profiler to see which components would benefit the most from memoization, and add memoization where needed.

### Reference
- https://react.dev/reference/react/memo

---

## 개별 판단이 번거로우니 가능한 한 다 `memo`로 감싸는 방식은 어떤 대가를 치르는가?

### Official Answer

There is no significant harm to doing that either, so some teams choose to not think about individual cases, and memoize as much as possible. The downside of this approach is that code becomes less readable. Also, not all memoization is effective: a single value that's "always new" is enough to break memoization for an entire component.

### Reference
- https://react.dev/reference/react/memo
