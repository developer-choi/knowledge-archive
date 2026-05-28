# React의 `Children` 유틸리티(대문자 C)는 어떤 역할을 하며, React 공식문서는 이 API를 어떻게 평가하는가?

## 도입

React에서 컴포넌트가 받는 `children` prop(소문자 c)은 배열처럼 보이지만 실제로는 불투명(opaque)한 데이터 구조다. 직접 `.map()`이나 `.length`를 호출하면 children이 단일 엘리먼트일 때 실패한다. `Children` 유틸리티(대문자 C)는 이 구조를 안전하게 순회·변환·카운트하는 API다. 단, 공식문서는 이 API를 거의 권장하지 않는다.

---

## 본문

> Using `Children` is uncommon and can lead to fragile code.
> See common alternatives.

"`Children`을 쓰는 것은 흔하지 않으며 깨지기 쉬운 코드를 만들 수 있다."

- **uncommon**: 일반 앱 코드에서 쓸 일이 거의 없다는 신호.
- **fragile code**: children 내부 구조가 바뀌거나(단일 → 배열), 컴포넌트로 감싸지거나 하면 카운트·순회 결과가 달라진다.

> `Children` lets you manipulate and transform the JSX you received as the `children` prop.

"`Children`은 `children` prop으로 받은 JSX를 조작하고 변환할 수 있게 해준다."

- **manipulate and transform**: 순회(`forEach`), 변환(`map`), 카운트(`count`), 특정 자식 접근(`only`, `toArray`) 등.

공식문서가 "Pitfall"로 시작한다는 것 자체가 "쓸 수는 있지만 웬만하면 쓰지 마라"는 강한 메시지다. 대부분의 경우 render prop 패턴이나 Context가 더 나은 대안이다.

---

## 종합

`Children`(대문자 C)과 `children`(소문자 c)은 다르다. `Children`은 `import { Children } from 'react'`로 가져오는 유틸리티 객체이고, `children`은 JSX에서 컴포넌트 태그 사이에 넣은 내용이 자동으로 들어오는 prop이다. `Children` API가 필요한 상황이 생기면, 먼저 "render prop이나 Context로 해결할 수 없을까?"를 먼저 물어보는 것이 바람직하다.

---

---

# `Children.count`에서 커스텀 컴포넌트를 children으로 넘기면, 그 컴포넌트가 내부적으로 10개를 렌더링해도 몇 개로 세는가?

## 도입

`Children.count`가 "몇 개"를 세는지는 직관과 다를 수 있다. 렌더링 결과가 아니라 JSX 표면에 드러난 노드 수를 센다. 커스텀 컴포넌트가 내부적으로 여러 개를 렌더링해도 `Children.count`는 그 내부를 들여다보지 않는다.

---

## 본문

> Empty nodes (`null`, `undefined`, and Booleans), strings, numbers, and React elements count as individual nodes.
> Arrays don't count as individual nodes, but their children do.

"빈 노드(`null`, `undefined`, Boolean), 문자열, 숫자, React 엘리먼트는 각각 하나의 노드로 센다. 배열 자체는 하나의 노드로 세지 않지만, 배열의 자식들은 센다."

> The traversal does not go deeper than React elements: they don't get rendered, and their children aren't traversed.
> Fragments don't get traversed.

"순회는 React 엘리먼트보다 더 깊이 들어가지 않는다. 엘리먼트들은 렌더되지 않고, 그 자식들도 순회되지 않는다. Fragment도 순회되지 않는다."

- **does not go deeper than React elements**: `<MoreRows />`가 내부적으로 10개의 `<tr>`을 렌더해도, `Children.count`는 `<MoreRows />`를 React 엘리먼트 1개로 취급하고 그 안을 들여다보지 않는다.
- **they don't get rendered**: 카운트 과정에서 컴포넌트를 실제로 실행하지 않는다. JSX 트리의 표면만 본다.

```jsx
// children이 이렇게 생겼을 때:
<Parent>
  <ChildA />        {/* 내부적으로 10개 렌더 */}
  <ChildB />
  hello
</Parent>

// Children.count(children) = 3
// ChildA가 10개를 렌더해도 Children.count는 1로 취급
```

---

## 종합

`Children.count`는 "JSX 표면에 드러난 직접 자식 수"를 센다. 렌더 결과 노드 수가 아니다. 이 동작이 `Children` API의 핵심 한계이며, 컴포넌트 리팩토링(직접 자식 → 컴포넌트로 추출) 시 카운트가 달라지는 이유다. 이 때문에 공식문서가 `Children`을 "깨지기 쉬운 코드"라고 평가한다.

---

---

# `Children.map`이 반환하는 배열은 어떤 특성을 갖는가?

## 도입

`Children.map`은 `Array.prototype.map`과 비슷하게 생겼지만 세 가지 다른 동작을 한다. `null`/`undefined` 자동 제거, flat array 반환, key 자동 합성이다.

---

## 본문

> If `children` is `null` or `undefined`, returns the same value.

"children이 `null`이나 `undefined`이면 같은 값을 반환한다."

children이 없는 경우를 별도로 처리할 필요가 없다 — `Children.map`이 안전하게 같은 값을 돌려준다.

> Otherwise, returns a flat array consisting of the nodes you've returned from the `fn` function.
> The returned array will contain all nodes you returned except for `null` and `undefined`.

"그 외에는 `fn` 함수에서 반환한 노드들로 구성된 flat 배열을 반환한다. 반환된 배열에는 `null`과 `undefined`를 제외한 모든 노드가 포함된다."

- **flat array**: `fn`에서 배열을 반환해도 중첩되지 않고 펼쳐진다. `Array.flatMap`과 같은 효과.
- **except for `null` and `undefined`**: `fn`에서 `null`을 반환하면 결과에서 자동 제거된다. 필터링 용도로 활용할 수 있다.

> If you return an element or an array of elements with keys from `fn`, the returned elements' keys will be automatically combined with the key of the corresponding original item from `children`.
> When you return multiple elements from `fn` in an array, their keys only need to be unique locally amongst each other.

"`fn`에서 key가 있는 엘리먼트나 배열을 반환하면, 반환된 엘리먼트의 key는 children의 대응 원본 항목의 key와 자동으로 결합된다. `fn`에서 배열로 여러 엘리먼트를 반환할 때, 그 key들은 서로 간에만 유일하면 된다."

- **automatically combined**: 원래 child의 key + fn이 반환한 엘리먼트의 key를 합성. key 충돌 없이 안전하게 처리된다.

```jsx
// Array.map과의 차이
const result = Children.map(children, (child) => {
  if (!child.props.isVisible) return null;  // 자동 필터링
  return [<span key="a">{child}</span>, <span key="b">extra</span>]; // flat하게 펼쳐짐
});
// null인 항목은 제거, 배열은 중첩 없이 평탄화됨
```

---

## 종합

`Children.map`은 `Array.prototype.map`보다 children 처리에 특화된 세 가지 동작을 제공한다. null/undefined 자동 제거로 빈 children 처리가 간편하고, flat 반환으로 한 child에서 여러 노드를 내보낼 때 배열이 중첩되지 않으며, key 자동 합성으로 충돌을 방지한다. 다만 이 모든 기능이 있어도 `Children` API의 근본적인 한계 — JSX 표면만 보는 것, 깨지기 쉬운 추상화 — 는 해결되지 않는다.
