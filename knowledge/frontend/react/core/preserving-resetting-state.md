---
tags: [react, concept]
source: official
---
# Questions
- React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?
- 컴포넌트 함수는 매 렌더마다 새로 호출되는데, `useState`로 만든 값이 직전 값을 기억하는 메커니즘은 무엇인가?
- `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?
- `key`는 전역으로 유일해야 하는가?

---

# Answers

## React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?

### Official Answer
React preserves a component's state for as long as it's being rendered at its position in the UI tree.
If it gets removed, or a different component gets rendered at the same position, React discards its state.

Notice how the moment you stop rendering the second counter, its state disappears completely.
That's because when React removes a component, it destroys its state.
When you tick "Render the second counter", a second `Counter` and its state are initialized from scratch (`score = 0`) and added to the DOM.

> #### Key Terms:
> - **preserves**: 보존 — 직전 값을 그대로 유지
> - **position in the UI tree**: 트리에서의 자리 — 컴포넌트와 state를 매핑하는 키
> - **removed**: 그 위치에서 더 이상 렌더되지 않음 (예: 조건부 렌더링이 false로 바뀜)
> - **a different component gets rendered at the same position**: 위치는 그대로인데 컴포넌트 타입이 바뀜 (예: `<Counter />` → `<Spinner />`)
> - **discards**: 버림 — 메모리에서 제거. 다시 렌더해도 복구 안 되고 처음부터 초기화

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## 컴포넌트 함수는 매 렌더마다 새로 호출되는데, `useState`로 만든 값이 직전 값을 기억하는 메커니즘은 무엇인가?

### Official Answer
When you give a component state, you might think the state "lives" inside the component.
But the state is actually held inside React.
React associates each piece of state it's holding with the correct component by where that component sits in the render tree.

> #### Key Terms:
> - **lives inside the component**: 흔한 (잘못된) 멘탈 모델 — `useState`가 컴포넌트 함수 본문에 있으니 거기 산다고 착각
> - **held inside React**: 실제 저장소는 React 내부. 컴포넌트 함수가 매 렌더 새로 호출되어도 값이 유지되는 이유
> - **associates ... by where ... sits**: 위치를 키로 매핑. 컴포넌트 정의가 같아도 트리 위치가 다르면 별개의 state
> - **render tree**: 화면에 실제로 그려진 컴포넌트 인스턴스 트리. 같은 JSX 변수를 두 군데 꽂으면 트리상 두 위치 → 두 인스턴스

> #### AI Annotation:
> 이 멘탈 모델 정정이 중요한 실무적 이유: 컴포넌트 함수는 매 렌더마다 새로 호출되어 로컬 변수도 새로 만들어진다. 그런데도 `useState`로 선언한 값이 직전 값을 기억하는 건, React가 트리 위치를 키로 직전 state를 다시 꽂아주기 때문.
> "위치가 식별자"라는 사고를 잡아두면 이후 동작들이 한 줄로 설명된다 — 형제 카운터 격리(위치가 다름), 조건부 렌더링 시 state 소실(위치가 비워짐), key/타입 변경 시 reset(같은 위치라도 식별자가 달라짐).

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?

### Official Answer
Keys aren't just for lists!
You can use keys to make React distinguish between any components.
By default, React uses order within the parent to discern between components.
Specifying a key tells React to use the key itself as part of the position, instead of their order within the parent.
This is why, even though you render them in the same place in JSX, React sees them as two different counters, and so they will never share state.

> #### Key Terms:
> - **distinguish between any components**: 임의의 컴포넌트 짝을 구분 — 리스트 항목이 아니어도 OK
> - **order within the parent**: 부모 안에서의 순번. `key`가 없을 때의 기본 식별 방식
> - **as part of the position**: key가 위치 식별자에 합쳐짐 → 같은 JSX 자리라도 key가 다르면 다른 좌표로 취급
> - **never share state**: 절대 state 공유 안 함 — key가 다르면 별개 인스턴스

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## `key`는 전역으로 유일해야 하는가?

### Official Answer
Remember that keys are not globally unique.
They only specify the position within the parent.

> #### Key Terms:
> - **not globally unique**: 전역 유일할 필요 없음
> - **position within the parent**: 부모 내에서의 위치

### Reference
- https://react.dev/learn/preserving-and-resetting-state
