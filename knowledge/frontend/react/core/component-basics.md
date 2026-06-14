---
tags: [react, concept]
source: official
publishable: false
priority: 1
---
# Questions
- Component와 Element의 차이는 무엇이며, Component는 개념적으로 무엇과 유사한가?
- [UNVERIFIED] state에는 어떤 값을 저장하는 것이 좋은가?
- [UNVERIFIED] React 컴포넌트의 lifecycle을 설명하라.
  - 업데이트 phase에서 같은 타입의 DOM 엘리먼트는 어떻게 처리되며, 어떤 부분만 실제 DOM에 반영되는가?
  - 업데이트 phase에서 같은 타입의 컴포넌트는 어떻게 처리되며, 그 결과 state는 어떻게 보존되는가?
  - React가 자식 리스트의 어떤 항목을 재사용(업데이트)하고 어떤 항목을 새로 마운트할지 결정할 때, 기본 매칭 방식은 무엇이며 그 한계는 무엇인가?

---

# Answers

## Component와 Element의 차이는 무엇이며, Component는 개념적으로 무엇과 유사한가?

### Official Answer
Conceptually, components are like JavaScript functions.
They accept arbitrary inputs (called "props") and return React elements describing what should appear on the screen.

Components can create similar but different UIs through props passed from parent components.

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

### User Answer
props로 화면에 보여줘야 하는 내용을 받아 출력하는 컴포넌트 예시:

```

interface SomeProps {

  inputValue: any;

}

function SomeComponent(props: SomeProps) {

  return (

    <div>입력된 props로 화면에 보여져야하는 내용 {props.inputValue}</div>

  )

}

```

부모 컴포넌트에서 같은 컴포넌트에 다른 props를 전달하여 비슷하지만 다른 UI를 만드는 예시:

```

export default function TodoListApp() {

  return (

    <div>

      <Todo content="할일1"/>

      <Todo content="할일2"/>

      <Todo content="할일3"/>

    </div>

  );

}

```

### Reference
- React 공식 문서 introduction (URL_UNKNOWN)

---

## [UNVERIFIED] state에는 어떤 값을 저장하는 것이 좋은가?

### User Answer
state는 다음 세 가지 특성을 가진다.

값을 저장할 수 있다.

값을 바꾸면 렌더링이 새로 일어난다.

따라서 화면에 보여줘야 하는 것과 관련이 있으면서, 동시에 바뀔 가능성이 있는 값만 state에 저장하는 것이 좋다.

---

## [UNVERIFIED] React 컴포넌트의 lifecycle을 설명하라.

### User Answer
주로 사용하는 lifecycle은 총 3가지로, 마운트 → 업데이트 → 언마운트 순서로 일어난다.

마운트는, 컴포넌트가 반환한 elements가 처음으로 화면에 반영된 이후이다.
화면(= HTML 문서)에 반영됐다는 것은, 해당 elements의 DOM API 같은 것들도 다 쓸 수 있다는 것을 의미한다.

업데이트는, 화면이 업데이트 되고 난 이후이다.

언마운트는, 컴포넌트가 반환했던 elements가 제거되기 직전이다.

---

## 업데이트 phase에서 같은 타입의 DOM 엘리먼트는 어떻게 처리되며, 어떤 부분만 실제 DOM에 반영되는가?

### Official Answer
When comparing two React DOM elements of the same type, React looks at the attributes of both, keeps the same underlying DOM node, and only updates the changed attributes.
For example:

```jsx
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

By comparing these two elements, React knows to only modify the className on the underlying DOM node.

When updating style, React also knows to update only the properties that changed.
For example:

```jsx
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

When converting between these two elements, React knows to only modify the color style, not the fontWeight.

After handling the DOM node, React then recurses on the children.

### Reference
- https://legacy.reactjs.org/docs/reconciliation.html

---

## 업데이트 phase에서 같은 타입의 컴포넌트는 어떻게 처리되며, 그 결과 state는 어떻게 보존되는가?

### Official Answer
When a component updates, the instance stays the same, so that state is maintained across renders.
React updates the props of the underlying component instance to match the new element, and calls UNSAFE_componentWillReceiveProps(), UNSAFE_componentWillUpdate() and componentDidUpdate() on the underlying instance.

Next, the render() method is called and the diff algorithm recurses on the previous result and the new result.

### Reference
- https://legacy.reactjs.org/docs/reconciliation.html

---

## React가 자식 리스트의 어떤 항목을 재사용(업데이트)하고 어떤 항목을 새로 마운트할지 결정할 때, 기본 매칭 방식은 무엇이며 그 한계는 무엇인가?

### Official Answer
By default, when recursing on the children of a DOM node, React just iterates over both lists of children at the same time and generates a mutation whenever there's a difference.

If you implement it naively, inserting an element at the beginning has worse performance.
For example, converting between these two trees works poorly:

```jsx
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React will mutate every child instead of realizing it can keep the `<li>Duke</li>` and `<li>Villanova</li>` subtrees intact.
This inefficiency can be a problem.

### Reference
- https://legacy.reactjs.org/docs/reconciliation.html
