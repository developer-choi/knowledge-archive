# Compound Components 패턴이란 무엇이며, 어떤 문제를 해결하는가?

## 도입

여러 컴포넌트가 협력해서 하나의 UI를 만들 때, 그 관계를 props 하나에 문자열로 모두 쑤셔넣으면 API가 금방 비대해진다. Compound Components 패턴은 HTML의 `<select>`와 `<option>` 관계처럼 컴포넌트 간 관계를 JSX 구조 자체로 표현하는 방식이다.

---

## 본문

> The idea is that you have two or more components that work together to accomplish a useful task.
> Typically one component is the parent, and the other is the child.
> The objective is to provide a more expressive and flexible API.

"두 개 이상의 컴포넌트가 함께 작동해 유용한 작업을 수행한다. 보통 하나는 부모, 나머지는 자식이다. 목표는 더 표현력 있고 유연한 API를 제공하는 것이다."

- **work together**: 개별 컴포넌트가 독립적으로 사용될 수 없다. 짝으로 써야 의미가 있다.
- **expressive and flexible API**: 소비자(사용자)가 컴포넌트를 조합하는 방법을 JSX로 직접 표현할 수 있는 API.

> Think of it like `<select>` and `<option>`.
> If you were to try and use one without the other it wouldn't work (or make sense).

"`<select>`와 `<option>`처럼 생각하라. 하나만 따로 쓰면 동작하지 않거나 의미가 없다."

flat props 방식과 비교해보면 차이가 명확하다:

```html
<!-- flat props 방식 — disabled 옵션을 어떻게 표현하지? -->
<select options="key1:value1;key2:value2;key3:value3"></select>

<!-- compound components 방식 -->
<select>
  <option value="value1">key1</option>
  <option value="value2" disabled>key2</option>
  <option value="value3">key3</option>
</select>
```

> So the compound components API gives you a nice way to express relationships between components.

"Compound components API는 컴포넌트 간 관계를 표현하는 좋은 방법을 제공한다."

---

## 종합

flat props 방식은 옵션이 늘어날수록 파싱 규칙을 만들어야 하고 `disabled`, `selected` 같은 상태를 표현하는 방법이 금방 막힌다. Compound Components 패턴은 JSX 트리 구조 자체가 컴포넌트 관계를 표현하므로, 기존 HTML 감각 그대로 확장 가능하다. `<select>` 없이 `<option>`을 쓰면 무의미하듯, 소비자가 잘못 사용할 여지도 줄어든다.

---

---

# Compound Components에서 "implicit state"란 무엇이며, 왜 중요한가?

## 도입

`<select>`는 어떤 `<option>`이 선택됐는지 상태를 갖고 있다. 그런데 HTML 코드를 보면 그 상태가 어디에도 명시되어 있지 않다. `<option>`이 스스로 선택 여부를 알고 렌더링하지만, 소비자 입장에서는 그 메커니즘이 보이지 않는다. 이것이 implicit state다.

---

## 본문

> Another important aspect of this is the concept of "implicit state."
> The `<select>` element implicitly stores state about the selected option and shares that with it's children so they know how to render themselves based on that state.

"`<select>` 엘리먼트는 선택된 옵션에 대한 상태를 암묵적으로 저장하고, 자식들과 공유하여 자식들이 그 상태를 기반으로 스스로를 렌더링할 수 있게 한다."

- **implicitly**: 소비자(HTML 작성자)에게 드러나지 않고 내부적으로. 소비자는 `selectedValue`를 직접 다룰 필요가 없다.
- **shares that with its children**: 부모가 상태를 갖고, 자식이 그 상태를 읽어 자신을 렌더링한다. 자식은 부모 없이 렌더링 방법을 결정할 수 없다.

> But that state sharing is implicit because there's nothing in our HTML code that can even access the state (and it doesn't need to anyway).

"그 상태 공유는 암묵적이다 — HTML 코드에서 그 상태에 접근할 수 있는 것이 아무것도 없다(그럴 필요도 없다)."

---

## 종합

implicit state가 중요한 이유는 소비자가 상태를 직접 관리하지 않아도 된다는 것이다. `<option>`이 선택됐는지 직접 확인하고 `selected` 속성을 붙이는 코드를 소비자가 작성할 필요 없이, 부모-자식 사이의 암묵적 채널이 그것을 대신 처리한다. React에서는 이 암묵적 채널을 Context로 구현한다.

---

---

# React에서 Compound Components의 implicit state를 Context로 구현할 때, 부모 컴포넌트는 어떤 구조로 상태를 공유하는가?

## 도입

HTML `<select>`의 implicit state를 React에서 직접 구현하려면 부모가 상태를 갖고 자식들이 그것을 읽는 채널이 필요하다. props를 직접 내려주면 소비자가 상태를 명시적으로 연결해야 하므로, Context를 사용해 트리 안에서 암묵적으로 공유한다.

---

## 본문

> So the way this works is we create a context with React where we store the state and a mechanism for updating the state.
> Then the `<Toggle>` component is responsible for providing that context value to the rest of the react tree.

"Context를 만들어 거기에 상태와 상태 업데이트 메커니즘을 저장한다. `<Toggle>` 컴포넌트가 나머지 React 트리에 그 Context 값을 제공하는 역할을 담당한다."

- **context**: 부모-자식 사이의 암묵적 채널. props 없이도 트리 어디서든 값을 읽을 수 있다.
- **providing that context value**: Provider로 감싸는 것. 그 아래 트리에서 `useContext`로 읽을 수 있다.

```jsx
const ToggleContext = React.createContext()

function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = React.useCallback(() => setOn((oldOn) => !oldOn), [])
  const value = React.useMemo(() => ({ on, toggle }), [on])
  return (
    <ToggleContext.Provider value={value}>
      {props.children}
    </ToggleContext.Provider>
  )
}
```

---

## 종합

`Toggle`이 `on` 상태와 `toggle` 함수를 Context로 제공하면, 그 안의 자식 컴포넌트들은 props를 받지 않고도 `useContext(ToggleContext)`로 상태를 읽고 토글을 호출할 수 있다. 소비자 입장에서는 `<Toggle>` 아래 자식들을 원하는 순서로 배치하기만 하면 된다 — 상태 연결 코드가 눈에 보이지 않아도 암묵적으로 연결되어 있다.

---

---

# Compound Components에서 자식 컴포넌트가 Provider 바깥에서 렌더링되면 어떤 문제가 생기며, 이를 어떻게 방어하는가?

## 도입

`useContext`는 Provider가 없으면 Context 기본값을 반환한다. `createContext()`를 인수 없이 호출하면 기본값은 `undefined`다. 자식 컴포넌트가 Provider 바깥에 놓이면 조용히 `undefined`를 받아 실행 중 오류가 뒤늦게 터진다. 이를 커스텀 훅에서 일찍 잡는 패턴이 있다.

---

## 본문

> ```jsx
> function useToggleContext() {
>     const context = React.useContext(ToggleContext)
>     if (!context) {
>         throw new Error(
>             `Toggle compound components cannot be rendered outside the Toggle component`,
>         )
>     }
>     return context
> }
> ```

Context가 falsy이면 명시적 에러를 던진다. `useContext(ToggleContext)`가 `undefined`를 반환하는 시점에 즉시 에러 메시지와 함께 실패한다.

- **`if (!context)`**: Context가 `undefined`인지 확인. Provider 바깥에 있으면 기본값이 `undefined`이므로 falsy가 된다.
- **throw new Error**: 조용히 깨지는 대신 명확한 에러 메시지로 원인을 즉시 노출한다.

```jsx
// Provider 바깥에서 쓰면:
function Page() {
  return <ToggleOn /> // → "cannot be rendered outside the Toggle component" 에러
}

// 올바른 사용:
function Page() {
  return (
    <Toggle>
      <ToggleOn />
    </Toggle>
  )
}
```

---

## 종합

이 패턴은 DX(개발자 경험) 방어 코드다. Context를 직접 쓰면 `undefined.on`처럼 접근하다 TypeError가 터지는데, 그 오류 메시지만으로는 Provider를 빠뜨린 것이 원인인지 파악하기 어렵다. 커스텀 훅에서 먼저 체크하고 의도를 담은 메시지를 던지면 디버깅 시간이 크게 줄어든다.

---

---

# Compound Components에서 Context value에 useMemo를 쓰는 이유는?

## 도입

React에서 객체 리터럴은 `===` 비교 시 항상 새 참조다. Context Provider의 `value`에 매 렌더마다 새 객체가 들어가면 `Object.is` 비교에서 "값이 바뀐 것"으로 판정되어 모든 Consumer가 리렌더된다.

---

## 본문

> ```jsx
> const value = React.useMemo(() => ({ on, toggle }), [on])
> return (
>     <ToggleContext.Provider value={value}>
>         {props.children}
>     </ToggleContext.Provider>
> )
> ```

`useMemo`로 `[on]`이 바뀔 때만 새 객체를 만든다.

- **useMemo**: 의존 배열이 바뀌지 않으면 이전 렌더에서 만든 객체 참조를 그대로 반환한다.
- **`[on]`**: `on` 상태가 실제로 바뀔 때만 새 객체를 생성한다. `toggle` 함수는 `useCallback`으로 고정되어 있으므로 참조가 유지된다.

```
useMemo 없을 때:
  부모 리렌더 → { on, toggle } 새 객체 생성
  → Object.is(이전, 새) = false
  → 모든 Consumer 리렌더

useMemo 있을 때:
  on 변화 없는 부모 리렌더 → 이전 객체 참조 반환
  → Object.is(이전, 새) = true
  → Consumer 리렌더 없음
```

---

## 종합

Provider value에 매 렌더마다 새 객체를 넘기면 Context를 구독하는 모든 자식이 실제 상태 변화 없이도 리렌더된다. `useMemo`로 `on`이 바뀔 때만 새 객체를 생성하면 불필요한 리렌더를 방지한다. Compound Components처럼 Context Consumer가 여럿인 구조에서 이 최적화는 특히 중요하다 — Consumer 하나하나가 모두 리렌더 대상이기 때문이다.
