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

> #### AI Annotation:
> ref 객체가 "React가 알아서 `.current`를 채워주는 수동적인 그릇"이라면, ref callback은 "DOM이 붙거나 떨어질 때 React가 호출해주는 함수"다.
> ref callback의 setup/cleanup 패턴은 `useEffect`와 동일한 형태 — setup 본문에서 작업하고, return으로 cleanup을 넘긴다.

### Reference
- https://react.dev/reference/react-dom/components/common#ref-callback

---

## `<div ref={(node) => { ... }}>` 처럼 ref callback을 인라인 화살표 함수로 작성했다. 컴포넌트가 리렌더될 때마다 React는 이 콜백을 어떻게 처리하는가?

### Official Answer
React will also call your `ref` callback whenever you pass a *different* `ref` callback.
In the above example, `(node) => { ... }` is a different function on every render.
When your component re-renders, the *previous* function will be called with `null` as the argument, and the *next* function will be called with the DOM node.

Unless you pass the same function reference for the `ref` callback on every render, the callback will get temporarily cleanup and re-create during every re-render of the component.

> #### AI Annotation:
> 인라인 화살표 함수를 ref callback으로 쓰면 매 리렌더마다 detach+attach가 한 번씩 일어난다.
> setup 본문이 가벼우면 무시할 수 있지만, 측정·구독·외부 라이브러리 인스턴스 생성처럼 무거운 작업이라면 매 렌더마다 떼고 붙이는 비용이 누적된다.
> 안정적으로 유지하려면 `useCallback`으로 함수 참조를 고정해야 한다.

### Reference
- https://react.dev/reference/react-dom/components/common#ref-callback

---

## React 19부터 ref callback에서 cleanup 함수를 return할 수 있게 되었다. 그렇다면 cleanup을 return하지 않는 기존 코드는 어떻게 동작하는가? 이 호환 동작은 앞으로 어떻게 되는가?

### Official Answer
React 19 added cleanup functions for `ref` callbacks.
To support backwards compatibility, if a cleanup function is not returned from the `ref` callback, `node` will be called with `null` when the `ref` is detached.
This behavior will be removed in a future version.

> #### AI Annotation:
> React 18까지는 ref callback에서 cleanup을 return할 수 없어서, React가 detach 시점에 같은 콜백을 `null`을 인자로 다시 호출하는 방식이었다 (콜백 본문에서 `if (node) { ... } else { ...정리... }` 분기).
> React 19부터는 `useEffect`처럼 cleanup을 return하는 방식이 정식으로 들어왔고, return을 안 하면 옛 방식으로 fallback해준다.
> 이 fallback은 미래에 사라질 예정 — 지금부터 cleanup을 명시적으로 return하는 게 안전하다.

### Reference
- https://react.dev/reference/react-dom/components/common#ref-callback
