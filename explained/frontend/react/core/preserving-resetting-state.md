# React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?

## 도입

같은 컴포넌트를 조건부 렌더링으로 껐다 켰을 때, 또는 같은 위치에 다른 컴포넌트를 렌더링했을 때 state가 어떻게 되는지 헷갈리는 경우가 많다. React의 판단 기준은 "UI 트리에서의 위치"다.

---

## 본문

> React preserves a component's state for as long as it's being rendered at its position in the UI tree.
> If it gets removed, or a different component gets rendered at the same position, React discards its state.

"React는 컴포넌트가 UI 트리의 해당 위치에 렌더링되는 동안 state를 보존한다. 컴포넌트가 제거되거나 같은 위치에 다른 컴포넌트가 렌더링되면 React는 state를 버린다."

- **preserves**: 직전 값을 그대로 유지.
- **position in the UI tree**: 트리에서의 자리. 컴포넌트와 state를 매핑하는 키. JSX 위치가 아니라 렌더 결과 트리에서의 좌표다.
- **removed**: 조건부 렌더링이 false로 바뀌어 그 위치에 아무것도 렌더되지 않는 상태.
- **a different component gets rendered at the same position**: 같은 위치인데 타입이 바뀜 — `<Counter />` → `<Spinner />`.
- **discards**: 메모리에서 제거. 다시 렌더해도 복구되지 않고 처음부터 초기화된다.

```jsx
// 위치가 유지되면 state 보존
{showCounter && <Counter />}  // false → true: state 초기화됨 (위치가 비워졌다가 새로 채워짐)

// 위치는 같지만 타입 변경 → state 버림
{isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />}
// → 이 경우 동일 타입이므로 state 보존됨
```

---

## 종합

React는 트리 위치를 key로 삼아 state를 관리한다. 같은 위치에 같은 타입 컴포넌트가 있으면 state가 보존되고, 위치가 비워지거나 타입이 바뀌면 state가 버려진다. 조건부 렌더링으로 컴포넌트를 숨겼다가 보이게 했을 때 입력값이 사라지는 이유가 바로 이것이다. 숨기면 트리에서 제거(state 버림) → 다시 보이면 새 위치에 마운트(state 초기화).

---

# 컴포넌트 함수는 매 렌더마다 새로 호출되는데, `useState`로 만든 값이 직전 값을 기억하는 메커니즘은 무엇인가?

## 도입

`useState`를 처음 접하면 "컴포넌트 함수가 매 렌더마다 실행되는데 어떻게 이전 값을 기억하지?"라는 의문이 생긴다. 함수 안 지역 변수는 매 호출마다 새로 만들어지는데, `useState`는 왜 다른가.

---

## 본문

> When you give a component state, you might think the state "lives" inside the component.
> But the state is actually held inside React.

"컴포넌트에 state를 부여하면 state가 컴포넌트 '안에 산다'고 생각할 수 있다. 하지만 state는 실제로 React 내부에 보관된다."

- **lives inside the component**: 흔한 잘못된 멘탈 모델. `useState`가 컴포넌트 함수 본문에 있으니 거기 산다고 착각하기 쉽다.
- **held inside React**: 실제 저장소는 React 내부 fiber 구조. 컴포넌트 함수가 매 렌더마다 새로 호출되어도 React가 보관하는 값은 유지된다.

> React associates each piece of state it's holding with the correct component by where that component sits in the render tree.

"React는 보유하고 있는 각 state 조각을 렌더 트리에서 컴포넌트가 위치한 곳을 기준으로 올바른 컴포넌트와 연결한다."

- **associates ... by where ... sits**: 위치를 key로 매핑. 컴포넌트 정의가 같아도 트리 위치가 다르면 별개의 state.
- **render tree**: 화면에 실제로 그려진 컴포넌트 인스턴스 트리. 같은 JSX를 두 군데 꽂으면 트리 위치가 두 곳 → 두 개의 독립적인 state.

```jsx
// 같은 Counter 컴포넌트지만 위치가 다름 → state 독립
<Counter />   // 위치 A → state A
<Counter />   // 위치 B → state B
// A의 count를 올려도 B는 그대로
```

---

## 종합

컴포넌트 함수는 매 렌더마다 새로 호출되어 로컬 변수도 새로 만들어진다. 그런데도 `useState`로 선언한 값이 직전 값을 기억하는 건, React가 트리 위치를 key로 직전 state를 다시 꽂아주기 때문이다. "위치가 식별자"라는 사고를 잡아두면 이후 동작들이 한 줄로 설명된다 — 형제 카운터 격리(위치가 다름), 조건부 렌더링 시 state 소실(위치가 비워짐), key/타입 변경 시 reset(같은 위치라도 식별자가 달라짐).

---

# `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?

## 도입

`key`는 리스트에만 쓰는 prop이라고 생각하기 쉽다. 하지만 `key`의 본질은 리스트가 아니라 "React에게 이 컴포넌트의 식별자를 명시적으로 알려주는 것"이다. 따라서 어떤 컴포넌트에도 쓸 수 있다.

---

## 본문

> Keys aren't just for lists!
> You can use keys to make React distinguish between any components.

"key는 리스트에만 쓰는 것이 아니다! 임의의 컴포넌트를 구분하기 위해 key를 쓸 수 있다."

> By default, React uses order within the parent to discern between components.
> Specifying a key tells React to use the key itself as part of the position, instead of their order within the parent.

"기본적으로 React는 부모 내 순번으로 컴포넌트를 구분한다. key를 지정하면 React가 부모 내 순번 대신 key 자체를 위치의 일부로 사용하도록 지시한다."

- **order within the parent**: key가 없을 때 기본 식별 방식. 첫 번째 자식은 인덱스 0, 두 번째는 인덱스 1.
- **as part of the position**: key가 위치 식별자에 합쳐진다. 같은 JSX 자리라도 key가 다르면 React는 다른 좌표로 취급한다.

```jsx
// 같은 JSX 자리인데 key가 달라서 별개 인스턴스로 취급됨
<Counter key="playerA" />
<Counter key="playerB" />
// playerA와 playerB는 절대 state를 공유하지 않는다
```

> This is why, even though you render them in the same place in JSX, React sees them as two different counters, and so they will never share state.

"그래서 JSX에서 같은 위치에 렌더링해도 React는 두 개의 다른 카운터로 보고, state를 절대 공유하지 않는다."

- **never share state**: key가 다르면 별개 인스턴스 — 한쪽 state를 바꿔도 다른 쪽에 영향 없음.

리스트 외에 실무에서 쓰는 대표적인 사례:

```jsx
// 사용자가 바뀔 때 폼을 완전히 리셋하고 싶을 때
<ProfileForm key={userId} />
// userId가 바뀌면 key가 바뀌므로 이전 state가 파괴되고 새로 마운트됨
```

---

## 종합

`key`는 리스트 렌더링의 경고를 없애기 위한 도구가 아니라, React에게 "이 컴포넌트의 식별자"를 명시적으로 전달하는 수단이다. key가 같으면 같은 인스턴스(state 보존), key가 다르면 다른 인스턴스(state 초기화). 이 속성 덕분에 리스트 외에도 "특정 값이 바뀔 때 컴포넌트를 완전히 초기화하고 싶다"는 시나리오에서 유용하게 쓸 수 있다.

---

# `key`는 전역으로 유일해야 하는가?

## 도입

`key`가 고유해야 한다는 말을 들으면 UUID처럼 앱 전체에서 유일한 값이어야 하나 싶은 생각이 든다. 그렇지 않다.

---

## 본문

> Remember that keys are not globally unique.
> They only specify the position within the parent.

"key는 전역으로 유일할 필요가 없다. key는 부모 내에서의 위치만 지정한다."

- **not globally unique**: 다른 부모 아래의 key와 겹쳐도 된다. React는 각 부모 컨텍스트 안에서만 key를 비교한다.
- **position within the parent**: key가 의미를 갖는 범위는 같은 부모 아래 형제들 사이뿐이다.

```jsx
<ul>
  <li key="a">항목 A</li>  {/* 이 컨텍스트에서의 "a" */}
  <li key="b">항목 B</li>
</ul>
<ul>
  <li key="a">항목 A'</li> {/* 다른 부모의 "a" — 충돌 없음 */}
  <li key="b">항목 B'</li>
</ul>
```

---

## 종합

key의 유일성 범위는 같은 부모 아래 형제들 사이다. 서로 다른 부모 아래에 있는 자식들은 key가 같아도 전혀 문제없다. 따라서 리스트 렌더링 시 배열 아이템의 고유 필드(id, slug 등)를 key로 쓰면 충분하고, 앱 전체를 통틀어 고유한 값을 만들 필요는 없다.

---
