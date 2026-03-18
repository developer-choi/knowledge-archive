---
tags: [react, browser, concept]
---

# useLayoutEffect

# Questions
- [What does `useLayoutEffect` guarantee about its execution timing relative to browser paint?](#what-does-uselayouteffect-guarantee-about-its-execution-timing-relative-to-browser-paint)

---

# Answers

## What does `useLayoutEffect` guarantee about its execution timing relative to browser paint?

### Official Answer
The code inside `useLayoutEffect` and all state updates scheduled from it **block the browser from repainting the screen.**
When used excessively, this makes your app slow.
When possible, prefer `useEffect`.

If you trigger a state update inside `useLayoutEffect`, React will execute all remaining Effects immediately including `useEffect`.

React guarantees that the code inside `useLayoutEffect` and any state updates scheduled inside it will be processed **before the browser repaints the screen.**
This lets you render the tooltip, measure it, and re-render the tooltip again without the user noticing the first extra render.
In other words, `useLayoutEffect` blocks the browser from painting.

> User Annotation: DOM에 반영한다고 하면 좀 말이 안맞고 Paint 하기 전이라고 하는게 맞음.
> 순서는 DOM + CSSOM > Render Tree > Layout > Paint니까.
> 결국 Paint가 안되면 사용자눈에 안보임.

### Reference
- https://react.dev/reference/react/useLayoutEffect
- https://react.dev/learn/render-and-commit#step-3-react-commits-changes-to-the-dom
