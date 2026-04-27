---
tags: [react, concept]
---
# Questions
- React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?
- `useState()`로 만든 state 변수들은 잘게 쪼개는 게 좋은가, 합치는 게 좋은가? 많아지면 어떤 문제가 있고, 어떤 기준으로 합치거나 쪼개야 하는가?
- `isEmpty`처럼 다른 state(`answer`)에서 길이만 체크하면 얻을 수 있는 정보를 별도 boolean state로 두면 어떤 위험이 있고 어떻게 해결하는가?
- React state 구조 설계 원칙들의 공통 목표는 무엇이며, 왜 DB 정규화에 비유되는가?
- React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?
- "state는 컴포넌트 안에 산다"는 멘탈 모델은 정확한가? 정확하지 않다면 실제로는 어떻게 보관되는가?
- 다른 컴포넌트 함수 본문 안에 컴포넌트 함수를 중첩 정의하면 어떤 문제가 생기는가?
- `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?
- `key`는 전역으로 유일해야 하는가?
- Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는?
- Context를 사용하는 3단계는 무엇인가? 각 단계는 어떤 컴포넌트에서 일어나는가?
- 한 컴포넌트가 같은 컨텍스트를 읽으면서 동시에 새 값으로 다시 provide할 수 있는가? 어떤 효과가 있는가?
- [TODO] '상태관리 어떻게 하세요?'
  - 그럼 불필요한 상태가 어떤 게 있나요?
    - Group related state 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?
    - Avoid contradictions 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?
    - state에 두지 말아야 할 값들은 어떤 종류가 있으며, 각각 무엇이 문제고 어떻게 해결하는가?
    - 깊이 중첩된 state를 업데이트할 때 무엇이 문제고 어떻게 해결하는가?
  - [TODO] 전역 상태에서 Context와 외부 store(Zustand/Jotai/Redux)는 어떤 기준으로 갈라쓰나요?
    - Context로 자주 바뀌는 값을 다루면 어떤 렌더링 이슈가 생기는가?
  - [TODO] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?
  - [TODO] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?

---

# Answers

## React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?

### Official Answer
With React, you won't modify the UI from code directly.
For example, you won't write commands like "disable the button", "enable the button", "show the success message", etc.
Instead, you will describe the UI you want to see for the different visual states of your component ("initial state", "typing state", "success state"), and then trigger the state changes in response to user input.
This is similar to how designers think about UI.

> #### Key Terms:
> - **modify the UI from code directly**: DOM 노드를 직접 조작하는 것 (`element.style.display = 'none'` 같은)
> - **commands**: "이걸 해라"라고 지시하는 명령문
> - **describe**: 원하는 UI의 모습을 묘사
> - **visual states**: 컴포넌트가 취할 수 있는 화면 상태들 (initial / typing / success 등)
> - **trigger**: state 변경을 유발
> - **in response to**: ~에 반응하여

> #### Official Annotation:
> In React, you don't directly manipulate the UI—meaning you don't enable, disable, show, or hide components directly.
> Instead, you declare what you want to show, and React figures out how to update the UI.
> Think of getting into a taxi and telling the driver where you want to go instead of telling them exactly where to turn.
> It's the driver's job to get you there, and they might even know some shortcuts you haven't considered!
>
> 출처: https://react.dev/learn/reacting-to-input-with-state

### Reference
- https://react.dev/learn/managing-state
- https://react.dev/learn/reacting-to-input-with-state
- 명령형/선언형 패러다임 일반론: [declarative-vs-imperative.md](../../../cs/software-engineering/principles/declarative-vs-imperative.md)

---

## `useState()`로 만든 state 변수들은 잘게 쪼개는 게 좋은가, 합치는 게 좋은가? 많아지면 어떤 문제가 있고, 어떤 기준으로 합치거나 쪼개야 하는가?

### Official Answer
Simplicity is key: each piece of state is a "moving piece", and you want as few "moving pieces" as possible.
More complexity leads to more bugs!

> #### Key Terms:
> - **Simplicity is key**: state 설계의 제1원칙 — 단순함이 핵심
> - **moving piece**: 기계 부품 비유. state 변수 하나하나가 움직이는 부품이며, 서로 어긋날 수 있는 지점
> - **as few moving pieces as possible**: 동기화·일관성 관리 대상이 곱셈으로 늘어나므로 개수 자체를 최소화
> - **More complexity leads to more bugs**: state가 N개면 조합이 2^N으로 증가. 복잡도 자체가 버그 표면

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## `isEmpty`처럼 다른 state(`answer`)에서 길이만 체크하면 얻을 수 있는 정보를 별도 boolean state로 두면 어떤 위험이 있고 어떻게 해결하는가?

### Official Answer
Is the same information available in another state variable already?
Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time.
By making them separate state variables, you risk them going out of sync and causing bugs.
Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.

> #### Key Terms:
> - **same information available in another state variable**: 이미 다른 state에서 도출 가능한 정보
> - **going out of sync**: 짝으로 갱신해야 하는 state들이 한쪽만 갱신되어 불일치
> - **remove `isEmpty` and instead check `answer.length === 0`**: state 변수를 제거하고 매 렌더 시 파생 표현식으로 계산. source of truth는 `answer` 하나

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## React state 구조 설계 원칙들의 공통 목표는 무엇이며, 왜 DB 정규화에 비유되는가?

### Official Answer
The goal behind these principles is to make state easy to update without introducing mistakes.
Removing redundant and duplicate data from state helps ensure that all its pieces stay in sync.
This is similar to how a database engineer might want to "normalize" the database structure to reduce the chance of bugs.
To paraphrase Albert Einstein, "Make your state as simple as it can be—but no simpler."

> #### Key Terms:
> - **easy to update without introducing mistakes**: 5원칙의 공통 목표 — "버그 없이 + 쉽게" 모두 충족
> - **stay in sync**: 여러 state 조각이 일관성을 유지한 상태. redundant/duplicate가 있으면 깨질 수 있음
> - **normalize**: DB 정규화 — 데이터를 중복 없이 분해하여 한 곳만 수정해도 모든 참조가 갱신되도록 하는 설계 원칙
> - **paraphrase**: 의역, 다른 말로 바꿔 말하기
> - **as simple as it can be—but no simpler**: 가능한 한 단순하게, 그러나 표현력 잃을 정도로 단순화하지 말 것

> #### AI Annotation:
> 5원칙(Group, Avoid contradictions, Avoid redundant, Avoid duplication, Avoid deeply nested)을 따로따로가 아니라 한 사고체계로 묶는 추상화. 모두 "동기화 부담을 없앤다"는 한 가지 원리에서 파생된다.
> DB 정규화 비유의 본질: 같은 데이터가 두 곳에 있으면 동기화 부담이 생기지만, 한 곳에만 두면 동기화할 게 없으니 동기화 실수도 사라진다. React state도 정확히 같은 사고.
> Einstein 인용("as simple as it can be—but no simpler")은 단서 역할 — 무조건 합치라는 뜻이 아니라 표현력을 잃지 않는 선까지만 단순화하라는 것. 두 변수를 무리하게 합쳐서 의미가 모호해지면 그건 "더 단순화한 것"이라 안 된다.

### Reference
- https://react.dev/learn/choosing-the-state-structure

---

## React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?

### Official Answer
React preserves a component's state for as long as it's being rendered at its position in the UI tree.
If it gets removed, or a different component gets rendered at the same position, React discards its state.

> #### Key Terms:
> - **preserves**: 보존 — 직전 값을 그대로 유지
> - **position in the UI tree**: 트리에서의 자리 — 컴포넌트와 state를 매핑하는 키
> - **removed**: 그 위치에서 더 이상 렌더되지 않음 (예: 조건부 렌더링이 false로 바뀜)
> - **a different component gets rendered at the same position**: 위치는 그대로인데 컴포넌트 타입이 바뀜 (예: `<Counter />` → `<Spinner />`)
> - **discards**: 버림 — 메모리에서 제거. 다시 렌더해도 복구 안 되고 처음부터 초기화

> #### Official Annotation:
> Notice how the moment you stop rendering the second counter, its state disappears completely.
> That's because when React removes a component, it destroys its state.
> When you tick "Render the second counter", a second `Counter` and its state are initialized from scratch (`score = 0`) and added to the DOM.
>
> 출처: https://react.dev/learn/preserving-and-resetting-state

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## "state는 컴포넌트 안에 산다"는 멘탈 모델은 정확한가? 정확하지 않다면 실제로는 어떻게 보관되는가?

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

## 다른 컴포넌트 함수 본문 안에 컴포넌트 함수를 중첩 정의하면 어떤 문제가 생기는가?

### Official Answer
Every time you click the button, the input state disappears!
This is because a different `MyTextField` function is created for every render of `MyComponent`.
You're rendering a different component in the same position, so React resets all state below.
This leads to bugs and performance problems.
To avoid this problem, always declare component functions at the top level, and don't nest their definitions.

> #### Key Terms:
> - **a different ... function is created for every render**: 부모가 렌더될 때마다 자식 컴포넌트 함수 정의 자체가 새 identity로 생성됨
> - **rendering a different component in the same position**: 좌표는 같지만 React가 보는 타입이 매 렌더 달라짐 — 매번 unmount/mount
> - **resets all state below**: 그 위치를 뿌리로 한 서브트리 전체 state 파괴
> - **bugs**: 입력값 소실, ref 끊김 등 직접 버그
> - **performance problems**: 매 렌더 DOM 재생성 + effect cleanup·재실행 비용
> - **at the top level**: 모듈 최상위(파일 스코프). 한 번만 정의되어 identity가 안정됨

> #### AI Annotation:
> 안티패턴 예시 — 이렇게 하면 버튼 클릭으로 부모가 리렌더될 때마다 input이 비워진다.
>
> ```jsx
> export default function MyComponent() {
>   const [counter, setCounter] = useState(0);
>
>   function MyTextField() {
>     const [text, setText] = useState('');
>     return <input value={text} onChange={e => setText(e.target.value)} />;
>   }
>
>   return (
>     <>
>       <MyTextField />
>       <button onClick={() => setCounter(counter + 1)}>
>         Clicked {counter} times
>       </button>
>     </>
>   );
> }
> ```
>
> 해결: `MyTextField`를 `MyComponent` 바깥(파일 최상위)으로 빼서 한 번만 정의되게 한다.

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?

### Official Answer
You might have seen keys when rendering lists.
Keys aren't just for lists!
You can use keys to make React distinguish between any components.
By default, React uses order within the parent ("first counter", "second counter") to discern between components.
But keys let you tell React that this is not just a first counter, or a second counter, but a specific counter—for example, Taylor's counter.
Specifying a key tells React to use the key itself as part of the position, instead of their order within the parent.
This is why, even though you render them in the same place in JSX, React sees them as two different counters, and so they will never share state.

> #### Key Terms:
> - **distinguish between any components**: 임의의 컴포넌트 짝을 구분 — 리스트 항목이 아니어도 OK
> - **order within the parent**: 부모 안에서의 순번. `key`가 없을 때의 기본 식별 방식
> - **a specific counter**: 순번이 아니라 의미 기반 식별 (예: "Taylor의 카운터")
> - **as part of the position**: key가 위치 식별자에 합쳐짐 → 같은 JSX 자리라도 key가 다르면 다른 좌표로 취급
> - **never share state**: 절대 state 공유 안 함 — key가 다르면 별개 인스턴스

> #### Official Annotation:
> Switching between Taylor and Sarah does not preserve the state.
> This is because you gave them different keys:
>
> ```jsx
> {isPlayerA ? (
>   <Counter key="Taylor" person="Taylor" />
> ) : (
>   <Counter key="Sarah" person="Sarah" />
> )}
> ```
>
> Every time a counter appears on the screen, its state is created.
> Every time it is removed, its state is destroyed.
> Toggling between them resets their state over and over.
>
> 출처: https://react.dev/learn/preserving-and-resetting-state

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## `key`는 전역으로 유일해야 하는가?

### Official Answer
Remember that keys are not globally unique.
They only specify the position within the parent.

> #### Key Terms:
> - **not globally unique**: 전역 유일할 필요 없음. 다른 부모 아래에 같은 key가 있어도 무방
> - **position within the parent**: 부모 내에서의 위치 — 형제들 사이에서만 의미

> #### AI Annotation:
> React가 식별에 쓰는 건 `(부모 좌표, key)` 조합이지 `key` 단독이 아니다.
> 그래서 list A의 `key="1"`과 list B의 `key="1"`이 충돌하지 않는다 — 부모가 다르면 좌표 자체가 다르니까.

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는?

### Official Answer
Passing props is a great way to explicitly pipe data through your UI tree to the components that use it.
But passing props can become verbose and inconvenient when you need to pass some prop deeply through the tree, or if many components need the same prop.
The nearest common ancestor could be far removed from the components that need data, and lifting state up that high can lead to a situation called "prop drilling".
Context lets the parent component make some information available to any component in the tree below it—no matter how deep—without passing it explicitly through props.

> #### Key Terms:
> - **pipe data through**: UI 트리를 따라 데이터를 흘려보내다
> - **verbose**: 장황한 — 코드가 쓸데없이 길어진다
> - **nearest common ancestor**: 데이터를 필요로 하는 컴포넌트들의 가장 가까운 공통 부모 (lifting state up의 도착지)
> - **far removed from**: ~로부터 멀리 떨어진
> - **prop drilling**: 데이터를 쓰지 않는 중간 컴포넌트들을 props가 단순 통과하며 내려가는 상황
> - **available to**: ~가 접근/사용할 수 있는
> - **no matter how deep**: 아무리 깊든 상관없이
> - **explicitly**: 명시적으로 (props는 한 단계씩 손으로 넘긴다는 점 부각)

> #### AI Annotation:
> Context는 prop drilling을 우회하는 "순간이동" 채널로 비유된다.
> 부모가 한 번 값을 공급(provide)해두면, 그 아래 트리의 어느 깊이에 있는 자식이든 중간 컴포넌트를 거치지 않고 직접 그 값을 읽을 수 있다.
> 중간 컴포넌트들이 자신은 쓰지도 않는 props를 단순 통과시켜야 하는 부담에서 해방된다.

### Reference
- https://react.dev/learn/passing-data-deeply-with-context

---

## Context를 사용하는 3단계는 무엇인가? 각 단계는 어떤 컴포넌트에서 일어나는가?

### Official Answer
You can't do it with props alone.
This is where context comes into play.
You will do it in three steps:
1. Create a context. (You can call it LevelContext, since it's for the heading level.)
2. Use that context from the component that needs the data. (Heading will use LevelContext.)
3. Provide that context from the component that specifies the data. (Section will provide LevelContext.)

> #### Key Terms:
> - **comes into play**: 작동하기 시작하다, 등장하다
> - **Create**: 컨텍스트 객체 자체를 만든다 (`createContext()`)
> - **Use**: 데이터를 읽는 쪽(자식)에서 그 컨텍스트를 가져다 쓴다 (`useContext()`)
> - **Provide**: 데이터의 값을 결정하는 쪽(부모)에서 컨텍스트 provider로 자식들을 감싸 값을 공급한다

> #### AI Annotation:
> 핵심은 "어디가 read 측이고 어디가 write 측인가"의 분리다.
> 데이터를 **결정**하는 컴포넌트(예시의 `Section`)가 Provide, 데이터를 **소비**하는 컴포넌트(예시의 `Heading`)가 Use.
> Create 단계에서 만든 컨텍스트 객체는 두 컴포넌트가 서로를 직접 참조하지 않고도 통신할 수 있게 해주는 약속(채널 식별자) 역할을 한다.

### Reference
- https://react.dev/learn/passing-data-deeply-with-context

---

## 한 컴포넌트가 같은 컨텍스트를 읽으면서 동시에 새 값으로 다시 provide할 수 있는가? 어떤 효과가 있는가?

### Official Answer
Since context lets you read information from a component above, each Section could read the level from the Section above, and pass level + 1 down automatically.
Now both Heading and Section read the LevelContext to figure out how "deep" they are.
And the Section wraps its children into the LevelContext to specify that anything inside of it is at a "deeper" level.

> #### Key Terms:
> - **read information from a component above**: 위쪽 컴포넌트의 정보를 읽다 — 컴포넌트 자신이 read 측이 됨
> - **pass ... down automatically**: 자동으로 아래로 전달 — 사람이 값을 손으로 입력하지 않음
> - **figure out how "deep" they are**: 자기가 얼마나 깊은지 스스로 알아낸다
> - **wraps its children into**: children을 ~로 감싼다 — provider로 새 값을 공급

> #### AI Annotation:
> "Provider는 부모, useContext는 자식"이라는 단순 이분법을 깨는 패턴.
> 한 컴포넌트가 위쪽 값을 useContext로 읽은 뒤, 그 값을 가공해 `<Context value={가공된값}>`으로 자기 children을 감싸면, 중첩 깊이만으로 값이 자동 누적된다.
> 예시의 `Section`이 위쪽 level을 읽어 `level + 1`로 다시 provide하므로, `<Section>`을 중첩하기만 해도 안쪽 Heading의 level이 자동으로 깊어진다.
> 실무에서 누적·변형이 필요한 컨텍스트(theme override, depth tracking, prefix path 등)에 자주 등장한다.

### Reference
- https://react.dev/learn/passing-data-deeply-with-context

---

## [TODO] '상태관리 어떻게 하세요?'

### User Answer
(작성 예정 — 4단계 사다리)
- step 1: 필요없는 state부터 삭제 (자세한 내용은 아래 "그럼 불필요한 상태가 어떤 게 있나요?" 참고)
- step 2: 로컬 상태는 useState
- step 3: 전역 상태 — 변경 빈도로 갈라치기. 거의 안 바뀌는 값(테마/언어/유저)은 Context, 자주 바뀌는 값은 외부 store(Zustand 등)
- step 4: 특화 상태는 별도 분리 — 서버 상태는 React Query, overlay 같은 UI 특화 상태는 overlay-kit

### Reference

---

## [TODO] 전역 상태에서 Context와 외부 store(Zustand/Jotai/Redux)는 어떤 기준으로 갈라쓰나요?

### Reference

---

## [TODO] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?

### Reference

---

## [TODO] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?

### Reference

---

## Context로 자주 바뀌는 값을 다루면 어떤 렌더링 이슈가 생기는가?

### Official Answer
React automatically re-renders all the children that use a particular context starting from the provider that receives a different value.
The previous and the next values are compared with the `Object.is` comparison.
Skipping re-renders with `memo` does not prevent the children receiving fresh context values.

> #### Key Terms:
> - **all the children that use a particular context**: 그 Provider 아래에서 같은 context를 `useContext`한 모든 자식 — 일부 필드만 읽어도 전부 대상
> - **starting from the provider that receives a different value**: 트리거 시점은 Provider value가 달라진 그 순간부터
> - **`Object.is` comparison**: 참조 비교. 객체/함수 리터럴을 매 렌더 새로 만들면 안의 값이 같아도 "달라짐"으로 판정
> - **Skipping re-renders with `memo`**: `React.memo`로 자식을 감싸 props 변화 없으면 리렌더 스킵하는 최적화
> - **does not prevent**: context 채널은 props 비교를 우회하므로 memo로 막을 수 없다

### Reference
- https://react.dev/reference/react/useContext#caveats

---

## 그럼 불필요한 상태가 어떤 게 있나요?

### Official Answer
Group related state. If you always update two or more state variables at the same time, consider merging them into a single state variable.
Avoid contradictions in state. When the state is structured in a way that several pieces of state may contradict and "disagree" with each other, you leave room for mistakes. Try to avoid this.
Avoid redundant state. If you can calculate some information from the component's props or its existing state variables during rendering, you should not put that information into that component's state.
Avoid deeply nested state. Deeply hierarchical state is not very convenient to update. When possible, prefer to structure state in a flat way.

### Reference
- https://react.dev/learn/choosing-the-state-structure

---

## Group related state 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?

### Official Answer
But if some two state variables always change together, it might be a good idea to unify them into a single state variable.
Then you won't forget to always keep them in sync, like in this example where moving the cursor updates both coordinates of the red dot.

> #### Key Terms:
> - **always change together**: 항상 같이 바뀌는 — 어느 이벤트에서든 둘 다 갱신되는 패턴
> - **unify**: 통합. 한 객체/배열 state로 합침
> - **forget to ... keep them in sync**: 동기화 실수의 원천 — `setX`만 호출하고 `setY` 빼먹음

### Reference
- https://react.dev/learn/choosing-the-state-structure

---

## Avoid contradictions 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?

### Official Answer
Does this state cause a paradox?
For example, `isTyping` and `isSubmitting` can't both be `true`.
A paradox usually means that the state is not constrained enough.
There are four possible combinations of two booleans, but only three correspond to valid states.
To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`.

> #### Key Terms:
> - **paradox**: 논리적으로 동시에 성립할 수 없는 state 조합이 표현 가능한 상황
> - **not constrained enough**: state 타입이 invalid 조합을 허용할 만큼 느슨함
> - **four possible combinations / only three correspond to valid states**: 두 boolean = 4조합, 유효는 3개. 남는 1개가 "impossible" state
> - **impossible state**: 현실 UI에 대응하지 않지만 메모리에는 표현 가능한 조합
> - **combine these into a `status`**: boolean들을 enum(union 문자열) 하나로 합쳐 유효 값만 취할 수 있게 제약
> - **leaves the door open**: 직접 만들지 않더라도 만들어질 가능성 자체가 열려있음

> #### Official Annotation:
> While this code works, it leaves the door open for "impossible" states.
> For example, if you forget to call setIsSent and setIsSending together, you may end up in a situation where both isSending and isSent are true at the same time.
> The more complex your component is, the harder it is to understand what happened.
>
> 출처: https://react.dev/learn/choosing-the-state-structure

> #### Official Annotation:
> You can still declare some constants for readability:
> `const isSending = status === 'sending';`
> `const isSent = status === 'sent';`
> But they're not state variables, so you don't need to worry about them getting out of sync with each other.
>
> 출처: https://react.dev/learn/choosing-the-state-structure

### Reference
- https://react.dev/learn/reacting-to-input-with-state
- https://react.dev/learn/choosing-the-state-structure

---

## state에 두지 말아야 할 값들은 어떤 종류가 있으며, 각각 무엇이 문제고 어떻게 해결하는가?

### Official Answer
If you can calculate some information from the component's props or its existing state variables during rendering, you should not put that information into that component's state.
You can always calculate fullName from firstName and lastName during render, so remove it from state.
As a result, the change handlers don't need to do anything special to update it.
When you call setFirstName or setLastName, you trigger a re-render, and then the next fullName will be calculated from the fresh data.

> #### Key Terms:
> - **calculate ... during rendering**: 매 렌더에 derive 가능 — 다른 source로부터 산출 가능
> - **redundant**: 같은 정보가 두 군데(원본 + 사본)에 보관되어 동기화 부담을 만드는 상태

> #### Official Annotation:
> A common example of redundant state is code like this:
> `function Message({ messageColor }) { const [color, setColor] = useState(messageColor); }`
> The problem is that if the parent component passes a different value of messageColor later (for example, 'red' instead of 'blue'), the color state variable would not be updated!
> The state is only initialized during the first render.
> This is why "mirroring" some prop in a state variable can lead to confusion.
> Instead, use the messageColor prop directly in your code. If you want to give it a shorter name, use a constant: `const color = messageColor;`
>
> 출처: https://react.dev/learn/choosing-the-state-structure (Deep Dive — Don't mirror props in state)

> #### Official Annotation:
> "Mirroring" props into state only makes sense when you want to ignore all updates for a specific prop.
> By convention, start the prop name with initial or default to clarify that its new values are ignored:
> `function Message({ initialColor }) { const [color, setColor] = useState(initialColor); }`
>
> 출처: https://react.dev/learn/choosing-the-state-structure (Deep Dive — Don't mirror props in state)

### Reference
- https://react.dev/learn/choosing-the-state-structure

---

## 깊이 중첩된 state를 업데이트할 때 무엇이 문제고 어떻게 해결하는가?

### Official Answer
Updating nested state involves making copies of objects all the way up from the part that changed.
Deleting a deeply nested place would involve copying its entire parent place chain.
Such code can be very verbose.
If the state is too nested to update easily, consider making it "flat".
Instead of a tree-like structure where each place has an array of its child places, you can have each place hold an array of its child place IDs.
Then store a mapping from each place ID to the corresponding place.
Now that the state is "flat" (also known as "normalized"), updating nested items becomes easier.

> #### Key Terms:
> - **all the way up from the part that changed**: 변경 지점부터 root까지 부모 사슬 전체 복사 (immutable 업데이트 원칙)
> - **parent place chain**: 변경 노드 → 부모 → 조부모 → ... → root
> - **verbose**: spread 연산이 층마다 반복되어 코드량 폭증
> - **flat / normalized**: 트리 구조 대신 ID 참조 + ID→객체 lookup 테이블로 재구성. DB 정규화와 같은 사고
> - **child place IDs**: 자식 객체를 직접 임베드하지 않고 ID 배열로 보관

> #### Official Annotation:
> In order to remove a place now, you only need to update two levels of state:
> the updated version of its parent place should exclude the removed ID from its childIds array, and
> the updated version of the root "table" object should include the updated version of the parent place.
>
> You can nest state as much as you like, but making it "flat" can solve numerous problems.
> It makes state easier to update, and it helps ensure you don't have duplication in different parts of a nested object.
>
> 출처: https://react.dev/learn/choosing-the-state-structure

> #### Official Annotation:
> Sometimes, you can also reduce state nesting by moving some of the nested state into the child components.
> This works well for ephemeral UI state that doesn't need to be stored, like whether an item is hovered.
>
> 출처: https://react.dev/learn/choosing-the-state-structure (Deep Dive — Improving memory usage)

> #### AI Annotation:
> 핵심 효과: 트리 깊이와 무관하게 update 비용이 항상 2단계 복사 — `O(depth)`가 `O(1)`로 떨어진다.
> "DB 정규화"는 비유가 아니라 실제 같은 알고리즘 — 행(row) = 평면 객체, primary key = id, foreign key = childIds.
> ephemeral UI state(hover, focus, expand 등) 자식 위임은 별개 기법이지만 같은 목적: 부모 state 평탄화.

### Reference
- https://react.dev/learn/choosing-the-state-structure
