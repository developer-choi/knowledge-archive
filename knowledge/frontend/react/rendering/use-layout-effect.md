---
tags: [react, browser, concept]
---

# useLayoutEffect

# Questions
- [Why is `useLayoutEffect` needed for measuring DOM elements like tooltips?](#why-is-uselayouteffect-needed-for-measuring-dom-elements-like-tooltips)
  - [When you call `setState` inside `useLayoutEffect`, does it execute immediately?](#when-you-call-setstate-inside-uselayouteffect-does-it-execute-immediately)
  - [What is the execution order from React commit to browser paint when `useLayoutEffect` is involved?](#what-is-the-execution-order-from-react-commit-to-browser-paint-when-uselayouteffect-is-involved)
- [Does `useEffect` always run after paint?](#does-useeffect-always-run-after-paint)

---

# Answers

## Why is `useLayoutEffect` needed for measuring DOM elements like tooltips?

### Official Answer
The code inside `useLayoutEffect` and all state updates scheduled from it **block the browser from repainting the screen.**
When used excessively, this makes your app slow.
When possible, prefer `useEffect`.

React guarantees that the code inside `useLayoutEffect` and any state updates scheduled inside it will be processed **before the browser repaints the screen.**
This lets you render the tooltip, measure it, and re-render the tooltip again without the user noticing the first extra render.
In other words, `useLayoutEffect` blocks the browser from painting.

> User Annotation: DOM에 반영한다고 하면 좀 말이 안맞고 Paint 하기 전이라고 하는게 맞음.
> 순서는 DOM + CSSOM > Render Tree > Layout > Paint니까.
> 결국 Paint가 안되면 사용자눈에 안보임.

### Reference
- https://react.dev/reference/react/useLayoutEffect
- https://react.dev/learn/render-and-commit#step-3-react-commits-changes-to-the-dom

---

## When you call `setState` inside `useLayoutEffect`, does it execute immediately?

### AI Answer
No. `setState`는 호출 즉시 상태를 변경하지 않는다.
React 내부 큐에 "나중에 처리해줘"라고 예약(schedule)하는 것이다.

```jsx
useLayoutEffect(() => {
  setCount(1);
  console.log(count); // 아직 0 — 예약만 됐고 실행 안 됨
});
```

예약된 state update는 useLayoutEffect 코드가 전부 끝난 뒤 처리된다.
이 처리까지 끝나야 브라우저 paint가 시작된다.

---

## What is the execution order from React commit to browser paint when `useLayoutEffect` is involved?

### AI Answer

```
React Commit (DOM 반영 완료)
         ↓
useLayoutEffect 시작
  ├── 코드 실행 중...        ← 브라우저 Paint 차단 시작
  ├── setState 호출 (예약)
  ├── 더 많은 코드...
  └── 코드 실행 완료
         ↓
예약된 setState 처리         ← 아직도 Paint 차단 중
         ↓
useLayoutEffect 완전히 끝남
         ↓
브라우저 Paint 시작           ← 이제야 화면에 그려짐
         ↓
사용자 눈에 보임
```

---

## Does `useEffect` always run after paint?

### Official Answer
If you trigger a state update inside `useLayoutEffect`, React will execute all remaining Effects immediately including `useEffect`.

### Reference
- https://react.dev/reference/react/useLayoutEffect
