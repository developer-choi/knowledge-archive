---
tags: [react, principle, history]
---
# Questions
- React 18에서 useEffect 타이밍은 어떻게 변경되었는가?
- React 18의 hydration 에러 정책은 어떻게 엄격해졌는가?
- React 18 Strict Mode의 새 동작(개발 모드 double-invoke)은 무엇이며 왜 도입되었는가?
- useId는 어떤 문제를 해결하기 위한 훅인가?

---

# Answers

## React 18에서 useEffect 타이밍은 어떻게 변경되었는가?

### Official Answer
React now always synchronously flushes effect functions if the update was triggered during a discrete user input event such as a click or a keydown event.
Previously, the behavior wasn't always predictable or consistent.

> #### Key Terms:
> - **synchronously flushes**: 큐에 쌓아두지 않고 즉시 동기적으로 실행해 비움
> - **discrete user input event**: click, keydown처럼 한 번씩 명확히 발생하는 사용자 입력 이벤트

### Reference
- https://react.dev/blog/2022/03/08/react-18-upgrade-guide

---

## React 18의 hydration 에러 정책은 어떻게 엄격해졌는가?

### Official Answer
Hydration mismatches due to missing or extra text content are now treated like errors instead of warnings.
React will no longer attempt to "patch up" individual nodes by inserting or deleting a node on the client in an attempt to match the server markup, and will revert to client rendering up to the closest <Suspense> boundary in the tree.

This ensures the hydrated tree is consistent and avoids potential privacy and security holes that can be caused by hydration mismatches.

> #### Key Terms:
> - **hydration mismatch**: 서버가 보낸 HTML과 클라이언트가 렌더한 결과가 일치하지 않는 상황
> - **patch up**: 불일치하는 노드를 삽입·삭제하여 억지로 맞추는 보정
> - **Suspense boundary**: 가장 가까운 상위 `<Suspense>` 경계

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

> #### Key Terms:
> - **preserving state**: 컴포넌트의 state를 유지한 채로
> - **resilient**: 마운트/파괴가 여러 번 일어나도 정상 동작하는 견고함
> - **development-only check**: 개발 모드에서만 동작하는 검사

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

> #### Key Terms:
> - **unique IDs**: 클라이언트와 서버 양쪽에서 동일하게 보장되어야 하는 고유 식별자
> - **accessibility APIs**: aria-labelledby 같이 ID 참조가 필요한 접근성 속성
> - **out-of-order**: 정해진 순서대로가 아니라, 준비되는 대로 임의의 순서로 전달되는 방식

### Reference
- https://react.dev/blog/2022/03/29/react-v18
- https://react.dev/reference/react/useId
