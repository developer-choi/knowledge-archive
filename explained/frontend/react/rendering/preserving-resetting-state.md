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

### 같은 사실을 다른 페이지가 비유로 말한 대목

state 스냅샷을 다루는 페이지에도 같은 내용이 나온다. 이쪽은 "선반"이라는 비유를 써서 왜 함수가 끝나도 값이 남는지를 곧장 그려준다.

> As a component's memory, state is not like a regular variable that disappears after your function returns. State actually "lives" in React itself—as if on a shelf!—outside of your function. When React calls your component, it gives you a snapshot of the state for that particular render.

"컴포넌트의 기억으로서 state는 함수가 반환되면 사라지는 보통의 변수와 다르다. state는 실제로 함수 바깥, React 자체에 산다. 선반 위에 놓인 것처럼. React가 컴포넌트를 호출할 때, 그 렌더에 해당하는 state의 스냅샷을 건네준다."

- **memory**: 기억. 컴포넌트가 렌더와 렌더 사이에 무언가를 담아두는 자리를 가리킨다.
- **disappears after your function returns**: 함수가 반환되면 사라진다. 지역 변수의 운명이고, state가 다른 지점이 여기다.
- **as if on a shelf**: 선반 위에 놓인 것처럼. 함수 바깥의 별도 보관소에 값이 얹혀 있고, 함수는 호출될 때마다 그것을 받아 쓴다는 그림이다.
- **snapshot for that particular render**: 그 렌더에 한정된 사본. 보관소의 값이 그대로 넘어오는 게 아니라, 그 렌더 동안 고정된 사본을 받는다.

이 비유가 답의 뒷부분을 채운다. 값이 어디 있는지는 "React 안"이고, 어느 컴포넌트 것인지 가려내는 기준은 앞에서 본 렌더 트리에서의 위치다.

---

## 종합

컴포넌트 함수는 매 렌더마다 새로 호출되어 로컬 변수도 새로 만들어진다. 그런데도 `useState`로 선언한 값이 직전 값을 기억하는 건, React가 트리 위치를 key로 직전 state를 다시 꽂아주기 때문이다. "위치가 식별자"라는 사고를 잡아두면 이후 동작들이 한 줄로 설명된다 — 형제 카운터 격리(위치가 다름), 조건부 렌더링 시 state 소실(위치가 비워짐), key/타입 변경 시 reset(같은 위치라도 식별자가 달라짐).

---

# `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?

## 본문

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
