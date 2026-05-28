# Component와 Element의 차이는 무엇이며, Component는 개념적으로 무엇과 유사한가?

## 도입

React를 처음 접하면 Component와 Element를 혼용하기 쉽다. Component는 함수(또는 클래스)이고, Element는 그 함수가 반환하는 객체다. Component가 "설계도"라면 Element는 "설계도를 보고 만든 묘사서"다.

---

## 본문

> Conceptually, components are like JavaScript functions.
> They accept arbitrary inputs (called "props") and return React elements describing what should appear on the screen.

"개념적으로, 컴포넌트는 JavaScript 함수와 같다. 임의의 입력("props")을 받아 화면에 무엇이 나타나야 하는지를 설명하는 React 엘리먼트를 반환한다."

- **arbitrary inputs**: 어떤 타입이든 — 문자열, 숫자, 함수, 객체, 배열 — 모두 props로 넘길 수 있다. 함수 매개변수와 같다.
- **props**: 부모 컴포넌트가 자식에게 전달하는 입력. 함수 매개변수처럼 컴포넌트 동작을 바깥에서 제어하는 수단이다.
- **React elements**: Component가 반환하는 값. "화면에 어떤 노드가 있어야 하는가"를 나타내는 가벼운 JS 객체다. 실제 DOM 노드가 아니다.
- **describing what should appear**: Element는 명령("DOM을 만들어라")이 아니라 묘사("이런 모습이어야 한다")다.

> Components can create similar but different UIs through props passed from parent components.

"컴포넌트는 부모로부터 전달받은 props를 통해 비슷하지만 서로 다른 UI를 만들 수 있다."

```jsx
function Todo({ content }) {
  return <li>{content}</li>;
}

export default function TodoListApp() {
  return (
    <ul>
      <Todo content="할일1" />
      <Todo content="할일2" />
      <Todo content="할일3" />
    </ul>
  );
}
```

> Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

"컴포넌트를 쓰면 UI를 독립적이고 재사용 가능한 조각으로 분리하고, 각 조각을 독립적으로 사고할 수 있다."

- **independent**: 한 컴포넌트를 수정해도 다른 컴포넌트에 영향을 주지 않는다.
- **reusable**: 같은 `Todo` 컴포넌트에 다른 props를 넘겨 여러 UI를 생성한다.
- **isolation**: 컴포넌트 하나를 볼 때 다른 컴포넌트의 내부를 알 필요가 없다.

---

## 종합

Component는 props를 받아 Element를 반환하는 함수다. Element는 "이 위치에 이런 노드가 있어야 한다"는 묘사 객체이고, React가 그 묘사를 보고 실제 DOM을 만들거나 업데이트한다. 컴포넌트가 없으면 같은 UI를 여러 곳에서 쓸 때 코드를 복붙해야 하고, props가 없으면 같은 형태의 UI를 조금씩 다르게 만들 수 없다.

```
Component (함수)
  ↓ props 받음
  ↓ JSX 반환 → React.createElement 호출
Element (JS 객체)
  ↓ React가 해석
실제 DOM 노드
```

---

---

# [UNVERIFIED] state에는 어떤 값을 저장하는 것이 좋은가?

## 도입

`useState`로 값을 저장할 수 있지만, 모든 값을 state에 넣는 것이 최선은 아니다. state는 두 가지 특성을 동시에 갖는다 — 값을 기억하고, 바뀌면 리렌더를 일으킨다. 이 특성을 바탕으로 어떤 값을 넣어야 할지 판단할 수 있다.

---

## 본문

state는 다음 두 가지 특성을 갖는다.

- 값을 렌더 간에 기억할 수 있다.
- 값이 바뀌면 컴포넌트가 새로 렌더된다.

두 특성을 모두 충족해야 할 때만 state가 필요하다.

```
화면에 보여야 하고(렌더와 연관)
          +
바뀔 가능성이 있는 값
          ↓
         state
```

- 화면에 보여야 하지만 바뀌지 않는 값 → 상수 또는 props로 충분
- 바뀌지만 화면에 직접 영향을 주지 않는 값 → ref(`useRef`) 또는 클로저 변수

---

## 종합

"이 값이 바뀔 때 화면이 달라지는가?"가 state 여부를 판단하는 핵심 질문이다. 타이머 ID, 스크롤 이벤트 리스너, 외부 라이브러리 인스턴스처럼 화면 렌더에 영향을 주지 않는 값은 state가 아니라 ref나 클래스 프로퍼티로 관리한다. state를 최소화할수록 불필요한 리렌더가 줄어들고 컴포넌트가 단순해진다.

---

---

# [UNVERIFIED] React 컴포넌트의 lifecycle을 설명하라.

## 도입

React 컴포넌트는 화면에 나타나고, 업데이트되고, 사라지는 세 단계를 거친다. 각 단계가 "언제"를 정확히 이해하면 `useEffect` 의존 배열이나 cleanup 타이밍을 잘못 이해하는 실수를 피할 수 있다.

---

## 본문

주로 사용하는 lifecycle은 세 가지다 — 마운트, 업데이트, 언마운트.

**마운트 (Mount)**

컴포넌트가 반환한 elements가 처음으로 화면(DOM)에 반영된 이후다. 화면에 반영됐다는 것은 DOM API도 사용 가능하다는 뜻 — `ref.current`에 DOM 노드가 채워진 상태다. `useEffect`의 첫 번째 실행이 이 시점 이후에 일어난다.

**업데이트 (Update)**

state 또는 props가 바뀌어 화면이 업데이트된 이후다. 컴포넌트 함수가 재실행되고, React가 이전 트리와 새 트리를 diff하여 변경된 부분만 DOM에 반영한 뒤다.

**언마운트 (Unmount)**

컴포넌트가 반환했던 elements가 DOM에서 제거되기 직전이다. `useEffect`의 cleanup 함수가 이 시점에 실행된다 — 구독 해제, 타이머 클리어 등 정리 작업을 여기서 한다.

```
마운트:   컴포넌트 함수 실행 → DOM 반영 → useEffect 실행
업데이트: 컴포넌트 함수 실행 → DOM 반영 → useEffect cleanup → useEffect 실행
언마운트: useEffect cleanup 실행 → DOM 제거
```

---

## 종합

lifecycle의 핵심은 "DOM 반영 이후"라는 타이밍이다. 마운트는 최초 DOM 반영 이후, 업데이트는 재렌더 후 DOM 반영 이후, 언마운트는 DOM 제거 직전이다. 함수 컴포넌트에서는 class lifecycle 메서드(`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) 대신 `useEffect`가 이 세 시점을 모두 커버한다.

---

---

# 업데이트 phase에서 같은 타입의 DOM 엘리먼트는 어떻게 처리되며, 어떤 부분만 실제 DOM에 반영되는가?

## 도입

React는 컴포넌트가 리렌더될 때마다 DOM 전체를 지우고 다시 그리지 않는다. 이전 트리와 새 트리를 비교(diff)해서 실제로 바뀐 속성만 DOM에 반영한다. 이 부분 업데이트가 가능하기 때문에 focus나 scroll 위치 같은 DOM 고유 상태가 보존된다.

---

## 본문

> When comparing two React DOM elements of the same type, React looks at the attributes of both, keeps the same underlying DOM node, and only updates the changed attributes.

"같은 타입의 두 React DOM 엘리먼트를 비교할 때, React는 양쪽의 속성을 살피고 같은 기반 DOM 노드를 유지한 채 변경된 속성만 업데이트한다."

- **same type**: 이전 `<div>`와 새 `<div>`가 같은 태그 — 타입이 같아야 이 최적화가 적용된다.
- **underlying DOM node**: Virtual DOM 뒤에 있는 실제 브라우저 DOM 노드. React가 새로 만들지 않고 그대로 유지한다.
- **only updates the changed attributes**: `className="before"` → `className="after"`처럼 실제로 달라진 것만 DOM API를 호출해 반영한다.

```jsx
// 이전
<div className="before" title="stuff" />
// 이후
<div className="after" title="stuff" />
// → className만 DOM에 write. title은 건드리지 않는다.
```

> When updating style, React also knows to update only the properties that changed.

"스타일을 업데이트할 때도 React는 변경된 프로퍼티만 업데이트한다."

```jsx
// 이전
<div style={{ color: 'red', fontWeight: 'bold' }} />
// 이후
<div style={{ color: 'green', fontWeight: 'bold' }} />
// → color만 변경. fontWeight는 건드리지 않는다.
```

> After handling the DOM node, React then recurses on the children.

"DOM 노드를 처리한 후, React는 자식들을 재귀적으로 순회한다."

- **recurses on the children**: 같은 diff 절차를 자식 트리에 그대로 적용한다. 트리 전체를 top-down으로 순회한다.

---

## 종합

React가 DOM 노드를 유지한다는 것은 focus, scroll 위치, input 입력값 같은 DOM 고유 상태가 보존된다는 뜻이다. 매번 새 DOM 노드를 만들었다면 input에 글자를 치다가 부모 state가 바뀔 때마다 focus가 풀릴 것이다. 같은 타입이면 기존 노드를 재사용하고 달라진 속성만 패치하기 때문에 렌더 비용을 최소화하면서 UX도 안정적으로 유지된다.

---

---

# 업데이트 phase에서 같은 타입의 컴포넌트는 어떻게 처리되며, 그 결과 state는 어떻게 보존되는가?

## 도입

DOM 엘리먼트가 아닌 React 컴포넌트가 업데이트될 때도 같은 원리가 적용된다. 타입이 같은 컴포넌트는 인스턴스를 새로 만들지 않고 기존 인스턴스를 유지한다. `useState` 값이 다음 렌더에서도 살아있는 근본 이유가 바로 이것이다.

---

## 본문

> When a component updates, the instance stays the same, so that state is maintained across renders.

"컴포넌트가 업데이트될 때 인스턴스는 그대로 유지되어, state가 렌더 간에 보존된다."

- **instance**: 함수 컴포넌트라면 React 내부 fiber에 묶인 hook 상태 묶음. `useState`로 만든 값들이 여기 살아 있다.
- **maintained across renders**: 컴포넌트 함수가 매 렌더마다 새로 호출되어도 인스턴스가 같으므로 hook 상태는 초기화되지 않는다.

> React updates the props of the underlying component instance to match the new element, and calls UNSAFE_componentWillReceiveProps(), UNSAFE_componentWillUpdate() and componentDidUpdate() on the underlying instance.

"React는 기반 컴포넌트 인스턴스의 props를 새 엘리먼트에 맞게 업데이트하고, 해당 인스턴스에 lifecycle 메서드들을 호출한다."

- **underlying component instance**: 실제로 동작하는 컴포넌트 인스턴스. 함수 컴포넌트에서는 신경 쓸 필요 없다 — class lifecycle 메서드들은 legacy다.

> Next, the render() method is called and the diff algorithm recurses on the previous result and the new result.

"그 다음 render 메서드가 호출되고, diff 알고리즘이 이전 결과와 새 결과를 재귀적으로 비교한다."

- **recurses on the previous result and the new result**: 컴포넌트가 반환한 이전 트리와 새 트리를 다시 diff한다.

---

## 종합

`useState` 값이 다음 렌더에서도 살아있는 이유는 컴포넌트 인스턴스가 유지되기 때문이다. 반대로 reconciliation에서 타입이 바뀌거나 부모 트리가 해체되면 인스턴스 자체가 새로 만들어지고 state는 초기값으로 리셋된다. 같은 타입이면 재사용, 다른 타입이면 새로 마운트 — 이 규칙 하나가 React state 보존 동작의 전부다.

```
같은 타입 업데이트:
  <Counter />  →  <Counter />
  인스턴스 유지 → state 보존

타입 변경:
  <Counter />  →  <Spinner />
  인스턴스 파괴 → state 초기화
```

---

---

# React가 자식 리스트의 어떤 항목을 재사용(업데이트)하고 어떤 항목을 새로 마운트할지 결정할 때, 기본 매칭 방식은 무엇이며 그 한계는 무엇인가?

## 도입

React가 자식 목록을 diff할 때 기본적으로 인덱스 기반으로 매칭한다. 인덱스 0은 인덱스 0끼리, 인덱스 1은 인덱스 1끼리 비교한다. 이 방식은 항목을 맨 뒤에 추가할 때는 효율적이지만, 맨 앞에 삽입하면 예상치 못한 비용이 발생한다.

---

## 본문

> By default, when recursing on the children of a DOM node, React just iterates over both lists of children at the same time and generates a mutation whenever there's a difference.

"기본적으로 DOM 노드의 자식들을 순회할 때, React는 두 자식 리스트를 동시에 순서대로 순회하며 차이가 생길 때마다 변경 명령(mutation)을 생성한다."

- **iterates over both lists at the same time**: 이전 자식 리스트와 새 자식 리스트를 인덱스 0부터 짝지어 동시에 순회한다. 위치 기반 매칭이다.
- **mutation**: DOM에 가할 변경 명령 — 속성 변경, 노드 추가, 노드 제거.

> If you implement it naively, inserting an element at the beginning has worse performance.

"key 없이 단순하게 구현하면 맨 앞에 항목을 삽입할 때 성능이 나빠진다."

- **naively**: key 없이 인덱스로만 매칭하는 구현.

```jsx
// 이전
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

// 이후 (맨 앞에 Connecticut 삽입)
<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

> React will mutate every child instead of realizing it can keep the `<li>Duke</li>` and `<li>Villanova</li>` subtrees intact.

"React는 Duke와 Villanova 서브트리를 그대로 유지할 수 있다는 걸 알아채지 못하고, 모든 자식을 mutate한다."

- **intact**: 그대로 유지된 상태. 인덱스 0이 `Duke → Connecticut`, 인덱스 1이 `Villanova → Duke`로 보이기 때문에 모두 다른 항목으로 판단한다.

---

## 종합

key 없이 위치 기반으로만 매칭하면 단순 prepend 하나에 모든 자식이 mutate된다. 자식이 컴포넌트라면 인스턴스도 재사용되지 않고 새로 마운트되어 그 안의 state까지 함께 사라진다. `key` prop이 이 문제의 해결책이다 — key를 지정하면 React가 위치 대신 key를 식별자로 쓰기 때문에 인덱스가 바뀌어도 같은 key면 같은 항목으로 인식해 재사용한다.

```
key 없음 (인덱스 기반):
인덱스 0: Duke     → Connecticut  (다름 → mutation)
인덱스 1: Villanova → Duke        (다름 → mutation)
인덱스 2: (없음)   → Villanova    (새로 추가)
→ 모두 mutate

key 있음 (식별자 기반):
key="Duke":       Duke      → Duke      (같음 → 재사용)
key="Villanova":  Villanova → Villanova (같음 → 재사용)
key="Connecticut":(없음)    → Connecticut (새로 추가)
→ Connecticut만 mount
```
