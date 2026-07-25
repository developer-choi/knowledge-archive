---
tags: [react, concept]
source: official
priority: 1
---
# Questions
- [UNVERIFIED] 상태관리 어떻게 하세요?
  - 불필요한 state가 뭐가 있을까요?
  - 두 컴포넌트의 state가 항상 함께 바뀌어야 한다면, 그 state는 어디에 두는가?
  - 전역 상태가 필요할 때, 외부 store 대신 Context를 써야 하는 경우는 언제인가?
  - 반대로 Context 대신 외부 store(Zustand/Jotai/Redux)를 쓰는 것이 이득인 경우는 언제인가?
    - [context의 단점은 무엇인가? → `context-api.md`](context-api.md#context의-단점은-무엇인가)
  - [UNVERIFIED] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?
  - [UNVERIFIED] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?

---

# Answers

## [UNVERIFIED] 상태관리 어떻게 하세요?

### User Answer
- step 1: 필요없는 state부터 삭제
- step 2: 로컬 상태는 useState
- step 3: 전역 상태 — Context or store
- step 4: 특화 상태는 별도 분리 — 서버 상태는 React Query, overlay 같은 UI 특화 상태는 overlay-kit

---

## 불필요한 state가 뭐가 있을까요?

### Official Answer
Simplicity is key: each piece of state is a "moving piece", and you want as few "moving pieces" as possible.

But if some two state variables always change together, it might be a good idea to unify them into a single state variable.

Does this state cause a paradox?
For example, `isTyping` and `isSubmitting` can't both be `true`.
A paradox usually means that the state is not constrained enough.
To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`.

Is the same information available in another state variable already?
By making them separate state variables, you risk them going out of sync and causing bugs.
Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.

Can you get the same information from the inverse of another state variable?
`isError` is not needed because you can check `error !== null` instead.

The state is only initialized during the first render.
This is why "mirroring" some prop in a state variable can lead to confusion.
"Mirroring" props into state only makes sense when you want to ignore all updates for a specific prop.

### Reference
- https://react.dev/learn/reacting-to-input-with-state
- https://react.dev/learn/choosing-the-state-structure

---

## 두 컴포넌트의 state가 항상 함께 바뀌어야 한다면, 그 state는 어디에 두는가?

### Official Answer
Sometimes, you want the state of two components to always change together.
To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props.

### Reference
- https://react.dev/learn/sharing-state-between-components

---

## 전역 상태가 필요할 때, 외부 store 대신 Context를 써야 하는 경우는 언제인가?

### Official Answer

Some apps also let you operate multiple accounts at the same time (e.g. to leave a comment as a different user).
In those cases, it can be convenient to wrap a part of the UI into a nested provider with a different current account value.

The store created with `create` doesn't require context providers.
In some cases, you may want to use contexts for dependency injection or if you want to initialize your store with props from a component.

### Reference
- https://react.dev/learn/passing-data-deeply-with-context
- https://github.com/pmndrs/zustand

---

## 반대로 Context 대신 외부 store(Zustand/Jotai/Redux)를 쓰는 것이 이득인 경우는 언제인가?

### Official Answer

Why zustand over context?
- Less boilerplate
- Renders components only on changes
- Centralized, action-based state management

Provider hell: It's likely that your root component has many context providers, which is technically okay, and sometimes desirable to provide context in different subtree.
Dynamic addition/deletion: Adding a new context at runtime is not very nice, because you need to add a new provider and its children will be re-mounted.

### Reference
- https://github.com/pmndrs/zustand
- https://jotai.org/docs/basics/comparison

---

## [UNVERIFIED] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?

---

## [UNVERIFIED] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?