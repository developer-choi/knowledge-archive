# React에서 `<div ref={...}>` 자리에 ref 객체 대신 함수를 넘길 수 있다. 이 함수(ref callback)는 무엇이고, React가 언제 호출하는가?

## 도입

`useRef`가 반환하는 객체를 `ref` 속성에 넘기면 React가 마운트 시 `.current`에 DOM을 채우고 언마운트 시 `null`로 비운다. 이 "수동적인 그릇" 대신, DOM이 붙거나 떨어질 때 특정 함수를 호출해달라고 요청하는 방법이 ref callback이다.

---

## 본문

> Instead of a ref object (like the one returned by `useRef`), you may pass a function to the `ref` attribute.

"`useRef`가 반환하는 것 같은 ref 객체 대신, `ref` 속성에 함수를 넘길 수 있다."

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

> When the `<div>` DOM node is added to the screen, React will call your `ref` callback with the DOM `node` as the argument.
> When that `<div>` DOM node is removed, React will call your the cleanup function returned from the callback.

"`<div>` DOM 노드가 화면에 추가되면, React가 DOM `node`를 인수로 넘겨 `ref` 콜백을 호출한다. 그 `<div>` DOM 노드가 제거되면, 콜백에서 반환한 cleanup 함수를 호출한다."

- **ref object**: `useRef()`가 반환하는 `{ current: null }` 형태의 객체. React가 마운트 시 `.current`에 DOM을 채우고 언마운트 시 `null`로 비운다.
- **ref attribute**: JSX 엘리먼트의 `ref` 속성. ref 객체 또는 ref callback 모두 받을 수 있다.
- **added to the screen**: DOM 노드가 마운트되어 실제 화면에 attach되는 시점. 이때 콜백이 DOM 노드를 인수로 호출된다.
- **cleanup function**: 콜백이 return하는 함수. DOM 노드가 detach되는 시점에 React가 호출한다.

```
ref 객체 방식:          ref callback 방식:
React가 알아서           개발자가 setup/cleanup
.current 채움            함수를 직접 정의
(수동적인 그릇)          (useEffect와 같은 형태)
```

---

## 종합

ref callback의 setup/cleanup 패턴은 `useEffect`와 동일한 형태다 — 함수 본문에서 setup 작업을 하고, cleanup 함수를 return한다. ref 객체가 "React가 대신 관리해주는 단순한 컨테이너"라면, ref callback은 "DOM attach/detach 이벤트에 직접 반응하는 훅"이다. DOM 노드가 준비되는 순간 측정하거나 외부 라이브러리를 초기화해야 할 때 유용하다.

---

# `<div ref={(node) => { ... }}>` 처럼 ref callback을 인라인 화살표 함수로 작성했다. 컴포넌트가 리렌더될 때마다 React는 이 콜백을 어떻게 처리하는가?

## 도입

인라인 함수는 매 렌더마다 새 참조가 만들어진다. `(node) => { ... }` 자체는 같은 코드처럼 보이지만, 렌더할 때마다 `===` 비교 기준으로 다른 함수다. React는 ref callback도 이 기준으로 "새 콜백이 왔는가"를 판단한다.

---

## 본문

> React will also call your `ref` callback whenever you pass a *different* `ref` callback.
> In the above example, `(node) => { ... }` is a different function on every render.

"다른 `ref` 콜백을 넘길 때마다 React는 ref callback을 호출한다. 인라인 예시에서 `(node) => { ... }`는 매 렌더마다 다른 함수다."

- **different**: 참조 동등성 기준으로 다른 함수. `===`로 비교했을 때 false.

> When your component re-renders, the *previous* function will be called with `null` as the argument, and the *next* function will be called with the DOM node.

"컴포넌트가 리렌더될 때, 이전 함수는 `null`을 인수로 호출되고, 새 함수는 DOM 노드를 인수로 호출된다."

- **previous function will be called with `null`**: 이전 콜백의 cleanup 역할. 이전 콜백 입장에서 DOM이 detach됐다고 알려주는 방식이다.
- **next function will be called with the DOM node**: 새 콜백을 새로 attach하는 것.

> Unless you pass the same function reference for the `ref` callback on every render, the callback will get temporarily cleanup and re-create during every re-render of the component.

"매 렌더마다 동일한 함수 참조를 넘기지 않으면, 컴포넌트가 리렌더될 때마다 콜백이 일시적으로 정리되었다가 다시 만들어진다."

- **same function reference**: `useCallback`으로 함수를 고정하면 매 렌더마다 같은 참조가 유지된다.
- **temporarily cleanup and re-create**: detach 후 attach가 반복된다.

```
인라인 arrow fn 사용 시 (매 렌더마다):
  1. 이전 콜백(null 인수로) 호출 → cleanup
  2. 새 콜백(DOM 노드 인수로) 호출 → setup

useCallback으로 참조 고정 시:
  → 콜백이 바뀌지 않았으므로 cleanup/setup 스킵
```

---

## 종합

인라인 화살표 함수를 ref callback으로 쓰면 매 리렌더마다 detach+attach가 반복된다. 단순한 DOM 노드 참조 저장이라면 비용이 미미하지만, 외부 라이브러리 초기화나 이벤트 리스너 부착처럼 비용이 있는 setup이라면 매 렌더마다 떼고 붙이는 비용이 누적된다. 안정적으로 유지하려면 `useCallback`으로 함수 참조를 고정한다.

```jsx
// 인라인 — 매 리렌더마다 cleanup + setup
<div ref={(node) => { ... }} />

// useCallback — 의존값 변화 시에만 cleanup + setup
const handleRef = useCallback((node) => {
  if (!node) return;
  // setup
}, []);
<div ref={handleRef} />
```

---

# React 19부터 ref callback에서 cleanup 함수를 return할 수 있게 되었다. 그렇다면 cleanup을 return하지 않는 기존 코드는 어떻게 동작하는가? 이 호환 동작은 앞으로 어떻게 되는가?

## 도입

React 19 이전에는 ref callback에서 cleanup을 return하는 방법이 없었다. detach 시점을 알려면 콜백이 `null`을 인수로 호출되는 것을 확인해야 했다 — `if (node) { setup } else { cleanup }` 분기가 필요했다. React 19는 `useEffect`처럼 cleanup을 return하는 방식을 도입했고, 기존 코드와의 하위 호환을 위한 fallback 동작이 있다.

---

## 본문

> React 19 added cleanup functions for `ref` callbacks.
> To support backwards compatibility, if a cleanup function is not returned from the `ref` callback, `node` will be called with `null` when the `ref` is detached.
> This behavior will be removed in a future version.

"React 19는 ref callback에 cleanup 함수를 추가했다. 하위 호환성을 위해, ref callback에서 cleanup 함수를 반환하지 않으면 ref가 detach될 때 `null`을 인수로 콜백이 호출된다. 이 동작은 미래 버전에서 제거될 것이다."

- **backwards compatibility**: 하위 호환성. React 19로 업그레이드해도 기존의 `if (node) { ... } else { ... }` 패턴 코드가 바로 깨지지 않도록.
- **detached**: DOM 노드가 화면에서 떨어진 상태. 언마운트 시점.
- **removed in a future version**: 현재는 fallback이 있지만, 앞으로는 cleanup return 방식만 지원될 예정이다. 지금부터 새 방식을 쓰는 것이 안전하다.

React 18까지의 패턴과 React 19 이후 패턴 비교:

```jsx
// React 18까지 — null 인수로 cleanup 감지
<div ref={(node) => {
  if (node) {
    // setup
    const listener = node.addEventListener('click', handleClick);
  } else {
    // cleanup (node가 null일 때)
    // 하지만 여기서 listener에 접근할 수 없는 문제가 있음
  }
}} />

// React 19+ — useEffect처럼 cleanup return
<div ref={(node) => {
  const listener = node.addEventListener('click', handleClick);
  return () => {
    node.removeEventListener('click', listener);
  };
}} />
```

---

## 종합

React 19의 cleanup return 방식은 ref callback을 `useEffect`와 같은 패턴으로 통일한다. 기존 `null` 인수 방식은 클로저로 setup에서 만든 리소스를 cleanup에서 접근하기 어렵다는 근본적인 한계가 있었다. cleanup을 return하면 setup 클로저 안의 변수를 cleanup 함수가 자연스럽게 참조할 수 있다. fallback은 미래에 사라질 예정이므로, 새로 작성하는 ref callback에는 cleanup을 명시적으로 return하는 것이 안전하다.
