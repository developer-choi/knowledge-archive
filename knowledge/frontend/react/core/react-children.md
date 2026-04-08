---
tags: [react, concept]
---
# Questions
- [React의 `Children` 유틸리티(대문자 C)는 어떤 역할을 하며, React 공식문서는 이 API를 어떻게 평가하는가?](#react의-children-유틸리티대문자-c는-어떤-역할을-하며-react-공식문서는-이-api를-어떻게-평가하는가)
- [`Children.count`에서 커스텀 컴포넌트를 children으로 넘기면, 그 컴포넌트가 내부적으로 10개를 렌더링해도 몇 개로 세는가?](#childrencount에서-커스텀-컴포넌트를-children으로-넘기면-그-컴포넌트가-내부적으로-10개를-렌더링해도-몇-개로-세는가)
- [`Children.map`이 반환하는 배열은 어떤 특성을 갖는가?](#childrenmap이-반환하는-배열은-어떤-특성을-갖는가)

---

# Answers

## React의 `Children` 유틸리티(대문자 C)는 어떤 역할을 하며, React 공식문서는 이 API를 어떻게 평가하는가?

### Official Answer
Using `Children` is uncommon and can lead to fragile code.
See common alternatives.

`Children` lets you manipulate and transform the JSX you received as the `children` prop.

> #### AI Annotation:
> `Children`(대문자 C)은 `import { Children } from 'react'`로 가져오는 유틸리티 객체이고, `children`(소문자 c)은 일반 prop이다.
> React 공식문서가 Pitfall로 시작한다는 것 자체가 "쓸 수는 있지만 웬만하면 쓰지 마라"는 강한 메시지다.
> children은 불투명(opaque) 데이터 구조이므로, 배열이라고 가정하고 직접 `.map()`이나 `.length`를 쓰면 안 된다.
> `Children` 유틸리티를 통해 안전하게 순회·변환·카운트할 수 있다.

### Reference
- https://react.dev/reference/react/Children

---

## `Children.count`에서 커스텀 컴포넌트를 children으로 넘기면, 그 컴포넌트가 내부적으로 10개를 렌더링해도 몇 개로 세는가?

### Official Answer
Empty nodes (`null`, `undefined`, and Booleans), strings, numbers, and React elements count as individual nodes.
Arrays don't count as individual nodes, but their children do.
The traversal does not go deeper than React elements: they don't get rendered, and their children aren't traversed.
Fragments don't get traversed.

> #### AI Annotation:
> 답: 1개로 센다.
> `<MoreRows />`가 내부적으로 10개를 렌더링해도 `Children.count`는 `<MoreRows />`를 1개로 취급한다.
> Children API는 "JSX 표면"만 보는 것이지, 렌더링 결과를 보는 게 아니다.
> 이것이 Children API의 핵심 한계이며, 컴포넌트를 추출하면 카운트가 달라지는 등 깨지기 쉬운 이유다.

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

> #### AI Annotation:
> `Children.map`은 `Array.map`과 달리 3가지 특별한 동작을 한다:
> 1. **flat array 반환**: `fn`에서 배열을 반환해도 중첩되지 않고 펼쳐진다. `Array.flatMap`과 같은 효과.
> 2. **null/undefined 자동 제거**: `fn`에서 `null`을 반환하면 결과에서 자동 제거된다. 필터링 용도로 활용 가능.
> 3. **key 자동 합성**: 원래 child의 key와 `fn`이 반환한 엘리먼트의 key를 자동으로 결합하여 key 충돌을 방지한다.

### Reference
- https://react.dev/reference/react/Children
