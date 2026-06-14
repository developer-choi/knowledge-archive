---
tags: [react, concept]
source: official
priority:
---
# Questions
- React에서 `<div ref={...}>` 자리에 ref 객체 대신 함수를 넘길 수 있다. 이 함수(ref callback)는 무엇이고, React가 언제 호출하는가?
- `<div ref={(node) => { ... }}>` 처럼 ref callback을 인라인 화살표 함수로 작성했다. 컴포넌트가 리렌더될 때마다 React는 이 콜백을 어떻게 처리하는가?
- React 19부터 ref callback에서 cleanup 함수를 return할 수 있게 되었다. 그렇다면 cleanup을 return하지 않는 기존 코드는 어떻게 동작하는가? 이 호환 동작은 앞으로 어떻게 되는가?

---

# Answers

## React에서 `<div ref={...}>` 자리에 ref 객체 대신 함수를 넘길 수 있다. 이 함수(ref callback)는 무엇이고, React가 언제 호출하는가?

### Official Answer
Instead of a ref object (like the one returned by `useRef`), you may pass a function to the `ref` attribute.

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

When the `<div>` DOM node is added to the screen, React will call your `ref` callback with the DOM `node` as the argument.
When that `<div>` DOM node is removed, React will call your the cleanup function returned from the callback.

### Reference
- https://react.dev/reference/react-dom/components/common#ref-callback

---

## `<div ref={(node) => { ... }}>` 처럼 ref callback을 인라인 화살표 함수로 작성했다. 컴포넌트가 리렌더될 때마다 React는 이 콜백을 어떻게 처리하는가?

### Official Answer
React will also call your `ref` callback whenever you pass a *different* `ref` callback.
In the above example, `(node) => { ... }` is a different function on every render.
When your component re-renders, the *previous* function will be called with `null` as the argument, and the *next* function will be called with the DOM node.

Unless you pass the same function reference for the `ref` callback on every render, the callback will get temporarily cleanup and re-create during every re-render of the component.

### Reference
- https://react.dev/reference/react-dom/components/common#ref-callback

---

## React 19부터 ref callback에서 cleanup 함수를 return할 수 있게 되었다. 그렇다면 cleanup을 return하지 않는 기존 코드는 어떻게 동작하는가? 이 호환 동작은 앞으로 어떻게 되는가?

### Official Answer
React 19 added cleanup functions for `ref` callbacks.
To support backwards compatibility, if a cleanup function is not returned from the `ref` callback, `node` will be called with `null` when the `ref` is detached.
This behavior will be removed in a future version.

### Reference
- https://react.dev/reference/react-dom/components/common#ref-callback
