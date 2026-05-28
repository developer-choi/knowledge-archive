# React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?

## 도입

`useState`로 만든 값이 렌더 사이에 유지되기도 하고 사라지기도 한다. React가 언제 state를 살리고 언제 버리는지의 기준은 하나 — **UI 트리에서의 위치**입니다.

---

## 본문

> React preserves a component's state for as long as it's being rendered at its position in the UI tree.

"React는 컴포넌트가 UI 트리의 해당 위치에 계속 렌더되는 한 state를 보존한다."

- **position in the UI tree**: 트리에서의 자리. React가 컴포넌트와 state를 묶는 키입니다. 같은 컴포넌트라도 위치가 다르면 별개의 state를 갖습니다.
- **preserves**: 직전 값을 그대로 유지한다는 뜻.

> If it gets removed, or a different component gets rendered at the same position, React discards its state.

"그 위치에서 제거되거나, 같은 위치에 다른 컴포넌트가 렌더되면 React는 state를 버린다."

- **removed**: 조건부 렌더링이 false로 바뀌는 것처럼 그 위치가 비워지는 경우.
- **a different component gets rendered at the same position**: 위치는 그대로인데 타입이 바뀌는 경우. 예: `<Counter />` → `<Spinner />`.
- **discards**: 메모리에서 제거. 다시 렌더해도 처음부터 초기화됩니다.

```
위치 유지 + 같은 타입 → state 보존
위치 비워짐           → state 파괴
같은 위치 + 타입 변경 → state 파괴
```

---

## 종합

React에서 state는 컴포넌트 함수 안에 사는 게 아니라 **트리의 특정 위치에 묶여** 있습니다. 그 위치에 같은 타입의 컴포넌트가 계속 있으면 state가 살아있고, 위치가 비워지거나 타입이 바뀌는 순간 state는 사라집니다. 조건부 렌더링으로 컴포넌트를 숨겼다가 다시 보이면 state가 초기화되는 이유가 바로 이겁니다.

---

# 컴포넌트 함수는 매 렌더마다 새로 호출되는데, `useState`로 만든 값이 직전 값을 기억하는 메커니즘은 무엇인가?

## 도입

컴포넌트 함수는 렌더마다 새로 호출됩니다. 함수가 새로 호출되면 그 안의 로컬 변수는 다 새로 만들어지는데, `useState` 값만 직전 값을 기억합니다. 왜일까요?

---

## 본문

> When you give a component state, you might think the state "lives" inside the component.

"컴포넌트에 state를 주면, state가 컴포넌트 안에 산다고 생각하기 쉽다."

- **lives inside the component**: 흔한 오해. `useState`가 컴포넌트 함수 본문에 쓰여 있으니 거기 저장된다고 착각합니다.

> But the state is actually held inside React.

"하지만 state는 실제로 React 내부에 저장된다."

- **held inside React**: 컴포넌트 함수가 매 렌더마다 새로 호출되어도 값이 유지되는 이유가 이겁니다. state의 실제 저장소는 React 런타임 내부입니다.

> React associates each piece of state it's holding with the correct component by where that component sits in the render tree.

"React는 자신이 보유한 각 state 조각을, 해당 컴포넌트가 렌더 트리의 어느 위치에 있는지를 기준으로 올바른 컴포넌트에 연결한다."

- **associates ... by where ... sits**: 위치를 키로 매핑합니다. 컴포넌트 정의가 같아도 트리 위치가 다르면 별개의 state입니다.
- **render tree**: 화면에 실제로 그려진 컴포넌트 인스턴스 트리.

```
렌더마다 컴포넌트 함수 새로 호출
  → 로컬 변수는 새로 생성
  → useState는? React 내부에서 "이 위치의 state"를 꺼내 꽂아줌
  → 직전 값 유지
```

---

## 종합

`useState` 값이 렌더 사이에 살아있는 건 컴포넌트 함수가 기억하는 게 아니라 **React가 트리 위치를 키로 저장해뒀다가 다시 꽂아주기 때문**입니다. 같은 컴포넌트를 두 군데 꽂으면 위치가 다르니 state도 각자 독립적으로 유지되고, 위치가 비워지면 React도 해당 state를 버립니다.

```
<Counter />  ← 위치 A → state A
<Counter />  ← 위치 B → state B (A와 완전히 독립)
```

---

# `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?

## 도입

앞서 React는 트리의 "위치"로 컴포넌트를 식별한다고 했습니다. `key`는 그 위치 식별 방식을 바꾸는 도구입니다. 리스트에서만 쓰는 게 아닙니다.

---

## 본문

> Keys aren't just for lists! You can use keys to make React distinguish between any components.

"key는 리스트만을 위한 게 아닙니다. 어떤 컴포넌트든 구분하는 데 쓸 수 있습니다."

> By default, React uses order within the parent to discern between components.

"기본적으로 React는 부모 안에서의 순번으로 컴포넌트를 구분합니다."

- **order within the parent**: key가 없을 때의 기본 식별 방식. 인덱스 0, 1, 2... 순서가 곧 위치입니다.

> Specifying a key tells React to use the key itself as part of the position, instead of their order within the parent.

"key를 지정하면 React는 부모 안의 순번 대신 key 자체를 위치의 일부로 사용합니다."

- **as part of the position**: key가 위치 식별자에 합쳐집니다. 같은 JSX 자리라도 key가 다르면 React 입장에선 다른 위치로 취급합니다.

실용 예시 — 유저가 바뀔 때 `Profile` state를 리셋하고 싶은 경우:

```jsx
// key가 없으면: userId가 바뀌어도 같은 위치 → state 유지
<Profile userId={userId} />

// key를 달면: userId가 바뀌면 다른 위치 → state 리셋
<Profile key={userId} userId={userId} />
```

---

## 종합

key는 "이 컴포넌트의 정체"를 React에 명시적으로 알려주는 수단입니다. 기본값은 부모 안의 순번이고, key를 지정하면 그 값이 위치 식별자로 쓰입니다. 리스트 외에도 "특정 prop이 바뀔 때 state를 완전히 리셋하고 싶다"는 상황에서 key를 활용하면 됩니다.

```
key 없음: 위치 = 부모 안 순번
key 있음: 위치 = 부모 안 순번 + key값
  → key가 바뀌면 → 다른 위치 → 인스턴스 교체 → state 리셋
```

---

# `key`는 전역으로 유일해야 하는가?

## 도입

리스트에 key를 달 때 "혹시 앱 전체에서 유일한 값을 써야 하나?" 싶을 수 있습니다. 짧은 질문, 짧은 답입니다.

---

## 본문

> Remember that keys are not globally unique. They only specify the position within the parent.

"key는 전역으로 유일할 필요가 없습니다. key는 부모 안에서의 위치만 지정합니다."

- **not globally unique**: 다른 부모 아래 같은 key값이 있어도 충돌하지 않습니다.
- **position within the parent**: key의 유효 범위는 같은 부모 안으로 한정됩니다.

```jsx
// 이래도 괜찮습니다
<ul>
  <li key="1">Apple</li>   // 부모 A 안의 key="1"
  <li key="2">Banana</li>
</ul>

<ul>
  <li key="1">Cat</li>    // 부모 B 안의 key="1" — 충돌 없음
  <li key="2">Dog</li>
</ul>
```

---

## 종합

key는 **같은 부모 안에서만 유일하면** 됩니다. DB의 id처럼 앱 전체에서 유일한 값을 억지로 만들 필요가 없습니다. 단, 같은 부모 안에서 중복된 key를 쓰면 React가 어떤 항목이 어떤 것인지 구분하지 못해 예상치 못한 동작이 생깁니다.
