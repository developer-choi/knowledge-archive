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

### Reference
- https://react.dev/learn/reacting-to-input-with-state
- https://react.dev/learn/choosing-the-state-structure

---

## Group related state 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?

### Official Answer
But if some two state variables always change together, it might be a good idea to unify them into a single state variable.
Then you won't forget to always keep them in sync.

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

### Reference
- https://react.dev/learn/choosing-the-state-structure

---

## Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는?

### Official Answer
But passing props can become verbose and inconvenient when you need to pass some prop deeply through the tree, or if many components need the same prop.
The nearest common ancestor could be far removed from the components that need data, and lifting state up that high can lead to a situation called "prop drilling".
Context lets the parent component make some information available to any component in the tree below it—no matter how deep—without passing it explicitly through props.

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

### Reference
- https://react.dev/reference/react/useContext#caveats

---

## [UNVERIFIED] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?

---

## [UNVERIFIED] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?
