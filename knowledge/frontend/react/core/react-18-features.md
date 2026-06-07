---
tags: [react, principle, history]
source: official
publishable: false
priority:
---
# Questions
- React 18에서 useEffect 타이밍은 어떻게 변경되었는가?
- React 18의 hydration 에러 정책은 어떻게 엄격해졌는가?
- React 18 Strict Mode의 새 동작(개발 모드 double-invoke)은 무엇이며 왜 도입되었는가?
- useId는 어떤 문제를 해결하기 위한 훅인가?
- React 18 Automatic Batching은 무엇이며, 이전 버전과 어떻게 다른가?

---

# Answers

## React 18에서 useEffect 타이밍은 어떻게 변경되었는가?

### Official Answer
React now always synchronously flushes effect functions if the update was triggered during a discrete user input event such as a click or a keydown event.
Previously, the behavior wasn't always predictable or consistent.

### Reference
- https://react.dev/blog/2022/03/08/react-18-upgrade-guide

---

## React 18의 hydration 에러 정책은 어떻게 엄격해졌는가?

### Official Answer
Hydration mismatches due to missing or extra text content are now treated like errors instead of warnings.
React will no longer attempt to "patch up" individual nodes by inserting or deleting a node on the client in an attempt to match the server markup, and will revert to client rendering up to the closest <Suspense> boundary in the tree.

This ensures the hydrated tree is consistent and avoids potential privacy and security holes that can be caused by hydration mismatches.

### Reference
- https://react.dev/blog/2022/03/08/react-18-upgrade-guide

---

## React 18 Strict Mode의 새 동작(개발 모드 double-invoke)은 무엇이며 왜 도입되었는가?

### Official Answer
In the future, we'd like to add a feature that allows React to add and remove sections of the UI while preserving state.
For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen.
To do this, React would unmount and remount trees using the same component state as before.

This feature will give React apps better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times.
Most effects will work without any changes, but some effects assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode.
This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

> #### AI Annotation:
> 변경 전 (mount 1회) 시퀀스:
> - React mounts the component.
>   - Layout effects are created.
>   - Effects are created.
>
> React 18 Strict Mode (개발 모드, double-invoke) 시퀀스:
> - React mounts the component.
>   - Layout effects are created.
>   - Effects are created.
> - React simulates unmounting the component.
>   - Layout effects are destroyed.
>   - Effects are destroyed.
> - React simulates mounting the component with the previous state.
>   - Layout effects are created.
>   - Effects are created.

### Reference
- https://react.dev/blog/2022/03/29/react-v18

---

## useId는 어떤 문제를 해결하기 위한 훅인가?

### Official Answer
useId is a new hook for generating unique IDs on both the client and server, while avoiding hydration mismatches.
It is primarily useful for component libraries integrating with accessibility APIs that require unique IDs.
This solves an issue that already exists in React 17 and below, but it's even more important in React 18 because of how the new streaming server renderer delivers HTML out-of-order.

### Reference
- https://react.dev/blog/2022/03/29/react-v18
- https://react.dev/reference/react/useId

---

## React 18 Automatic Batching은 무엇이며, 이전 버전과 어떻게 다른가?

### User Answer
setState, useReducer, store dispatch 모두 렌더링이 병합된다.

마우스클릭 같은 이벤트 핸들러에서 setState, useReducer, dispatch 로직이 실행된다면, 모든 이벤트가 다 전달이 끝나고 나서 렌더링이 발생한다. (setState, useReducer, store dispatch가 실행되는 건 중간중간에 실행되는 거고, 렌더링 자체만 병합된다고 하는게 가장 정확하다.)

React 18부터는 async, timeout 등 비동기 코드 내부에서도 병합됨.

### Reference
- https://react.dev/blog/2022/03/08/react-18-upgrade-guide#automatic-batching
