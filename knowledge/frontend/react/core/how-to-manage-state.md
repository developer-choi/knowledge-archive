---
tags: [react, concept]
source: official
priority: 1
---
# Questions
- [UNVERIFIED] '상태관리 어떻게 하세요?'
  - 그럼 불필요한 상태가 어떤 게 있나요?
    - Group related state 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?
    - Avoid contradictions 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?
    - state에 두지 말아야 할 값들은 어떤 종류가 있으며, 각각 무엇이 문제고 어떻게 해결하는가?
    - 깊이 중첩된 state를 업데이트할 때 무엇이 문제고 어떻게 해결하는가?
  - Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는?
  - [UNVERIFIED] 전역 상태에서 Context와 외부 store(Zustand/Jotai/Redux)는 어떤 기준으로 갈라쓰나요?
    - Context로 자주 바뀌는 값을 다루면 어떤 렌더링 이슈가 생기는가?
  - [UNVERIFIED] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?
  - [UNVERIFIED] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?

---

# Answers

## [UNVERIFIED] '상태관리 어떻게 하세요?'

### User Answer
(작성 예정 — 4단계 사다리)
- step 1: 필요없는 state부터 삭제 (자세한 내용은 아래 "그럼 불필요한 상태가 어떤 게 있나요?" 참고)
- step 2: 로컬 상태는 useState
- step 3: 전역 상태 — 변경 빈도로 갈라치기. 거의 안 바뀌는 값(테마/언어/유저)은 Context, 자주 바뀌는 값은 외부 store(Zustand 등)
- step 4: 특화 상태는 별도 분리 — 서버 상태는 React Query, overlay 같은 UI 특화 상태는 overlay-kit

---

## 그럼 불필요한 상태가 어떤 게 있나요?

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
- https://react.dev/learn/choosing-the-state-structure

---

## Group related state 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?

### Official Answer
But if some two state variables always change together, it might be a good idea to unify them into a single state variable.
Then you won't forget to always keep them in sync.

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

### Reference
- https://react.dev/learn/reacting-to-input-with-state
- https://react.dev/learn/choosing-the-state-structure

---

## state에 두지 말아야 할 값들은 어떤 종류가 있으며, 각각 무엇이 문제고 어떻게 해결하는가?

### Official Answer
Is the same information available in another state variable already?
Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time.
By making them separate state variables, you risk them going out of sync and causing bugs.
Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.

A common example of redundant state is code like this:
`function Message({ messageColor }) { const [color, setColor] = useState(messageColor); }`
The problem is that if the parent component passes a different value of messageColor later (for example, 'red' instead of 'blue'), the color state variable would not be updated!
The state is only initialized during the first render.
This is why "mirroring" some prop in a state variable can lead to confusion.
Instead, use the messageColor prop directly in your code. If you want to give it a shorter name, use a constant: `const color = messageColor;`

"Mirroring" props into state only makes sense when you want to ignore all updates for a specific prop.
By convention, start the prop name with initial or default to clarify that its new values are ignored:
`function Message({ initialColor }) { const [color, setColor] = useState(initialColor); }`

> #### Key Terms:
> - **same information available in another state variable**: 이미 다른 state에서 도출 가능한 정보
> - **going out of sync**: 짝으로 갱신해야 하는 state들이 한쪽만 갱신되어 불일치
> - **remove `isEmpty` and instead check `answer.length === 0`**: state 변수를 제거하고 매 렌더 시 파생 표현식으로 계산. source of truth는 `answer` 하나

### Reference
- https://react.dev/learn/reacting-to-input-with-state
- https://react.dev/learn/choosing-the-state-structure

---

## 깊이 중첩된 state를 업데이트할 때 무엇이 문제고 어떻게 해결하는가?

### Official Answer
Updating nested state involves making copies of objects all the way up from the part that changed.
If the state is too nested to update easily, consider making it "flat".
Instead of a tree-like structure where each place has an array of its child places, you can have each place hold an array of its child place IDs.
Then store a mapping from each place ID to the corresponding place.
Now that the state is "flat" (also known as "normalized"), updating nested items becomes easier.

In order to remove a place now, you only need to update two levels of state:
the updated version of its parent place should exclude the removed ID from its childIds array, and
the updated version of the root "table" object should include the updated version of the parent place.

You can nest state as much as you like, but making it "flat" can solve numerous problems.
It makes state easier to update, and it helps ensure you don't have duplication in different parts of a nested object.

> #### Key Terms:
> - **all the way up from the part that changed**: 변경 지점부터 root까지 부모 사슬 전체 복사 (immutable 업데이트 원칙)
> - **parent place chain**: 변경 노드 → 부모 → 조부모 → ... → root
> - **verbose**: spread 연산이 층마다 반복되어 코드량 폭증
> - **flat / normalized**: 트리 구조 대신 ID 참조 + ID→객체 lookup 테이블로 재구성. DB 정규화와 같은 사고
> - **child place IDs**: 자식 객체를 직접 임베드하지 않고 ID 배열로 보관

> #### AI Annotation:
> 핵심 효과: 트리 깊이와 무관하게 update 비용이 항상 2단계 복사 — `O(depth)`가 `O(1)`로 떨어진다.
> "DB 정규화"는 비유가 아니라 실제 같은 알고리즘 — 행(row) = 평면 객체, primary key = id, foreign key = childIds.

### Reference
- https://react.dev/learn/choosing-the-state-structure

---

## Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는?

### Official Answer
But passing props can become verbose and inconvenient when you need to pass some prop deeply through the tree, or if many components need the same prop.
The nearest common ancestor could be far removed from the components that need data, and lifting state up that high can lead to a situation called "prop drilling".
Context lets the parent component make some information available to any component in the tree below it—no matter how deep—without passing it explicitly through props.

> #### Key Terms:
> - **verbose**: 장황한 — 코드가 쓸데없이 길어진다
> - **nearest common ancestor**: 데이터를 필요로 하는 컴포넌트들의 가장 가까운 공통 부모 (lifting state up의 도착지)
> - **prop drilling**: 데이터를 쓰지 않는 중간 컴포넌트들을 props가 단순 통과하며 내려가는 상황
> - **no matter how deep**: 아무리 깊든 상관없이

### Reference
- https://react.dev/learn/passing-data-deeply-with-context

---

## [UNVERIFIED] 전역 상태에서 Context와 외부 store(Zustand/Jotai/Redux)는 어떤 기준으로 갈라쓰나요?

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

## [UNVERIFIED] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?

---

## [UNVERIFIED] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?
