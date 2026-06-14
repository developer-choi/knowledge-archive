---
tags: [react, concept]
source: official
priority:
---
# Questions
- React의 `Children` 유틸리티(대문자 C)는 어떤 역할을 하며, React 공식문서는 이 API를 어떻게 평가하는가?
- `Children.count`에서 커스텀 컴포넌트를 children으로 넘기면, 그 컴포넌트가 내부적으로 10개를 렌더링해도 몇 개로 세는가?
- `Children.map`이 반환하는 배열은 어떤 특성을 갖는가?

---

# Answers

## React의 `Children` 유틸리티(대문자 C)는 어떤 역할을 하며, React 공식문서는 이 API를 어떻게 평가하는가?

### Official Answer
Using `Children` is uncommon and can lead to fragile code.
See common alternatives.

`Children` lets you manipulate and transform the JSX you received as the `children` prop.

### Reference
- https://react.dev/reference/react/Children

---

## `Children.count`에서 커스텀 컴포넌트를 children으로 넘기면, 그 컴포넌트가 내부적으로 10개를 렌더링해도 몇 개로 세는가?

### Official Answer
Empty nodes (`null`, `undefined`, and Booleans), strings, numbers, and React elements count as individual nodes.
Arrays don't count as individual nodes, but their children do.
The traversal does not go deeper than React elements: they don't get rendered, and their children aren't traversed.
Fragments don't get traversed.

### Reference
- https://react.dev/reference/react/Children

---

## `Children.map`이 반환하는 배열은 어떤 특성을 갖는가?

### Official Answer
If `children` is `null` or `undefined`, returns the same value.

Otherwise, returns a flat array consisting of the nodes you've returned from the `fn` function.
The returned array will contain all nodes you returned except for `null` and `undefined`.

If you return an element or an array of elements with keys from `fn`, the returned elements' keys will be automatically combined with the key of the corresponding original item from `children`.
When you return multiple elements from `fn` in an array, their keys only need to be unique locally amongst each other.

### Reference
- https://react.dev/reference/react/Children
