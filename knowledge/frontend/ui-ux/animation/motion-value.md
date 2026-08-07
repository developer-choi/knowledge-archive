---
tags: [react, concept]
source: official
publishable: false
priority:
---
# Questions
- Motion의 motion value란 무엇이며, `useMotionValue` 훅으로 어떻게 생성하는가?
  - motion value의 `set`과 `get` 메서드는 각각 어떤 역할이며, DOM 업데이트는 어떻게 처리되는가?
  - motion value에서 `set()`과 `jump()`의 차이는 무엇인가?
  - React 컴포넌트 안에서 motion value의 이벤트를 구독하려면 어떻게 해야 하며, `on()` 메서드를 직접 쓸 때 주의할 점은?
- Motion의 `useTransform` 훅이란 무엇이며, 어떤 두 가지 방식으로 사용하는가?
  - `useTransform`의 value mapping에서 input 범위가 반드시 단조증가/감소여야 하는 이유는?
  - `useTransform`의 value mapping에서 입력이 범위를 벗어나면 출력은 어떻게 되며, 이를 해제하려면?

---

# Answers

## Motion의 motion value란 무엇이며, `useMotionValue` 훅으로 어떻게 생성하는가?

### Official Answer
Motion values track the state and velocity of animated values.

They are composable, signal-like values that are performant because Motion can render them with its optimised DOM renderer.

Usually, these are created automatically by motion components. But for advanced use cases, it's possible to create them manually.

```jsx
import { motion, useMotionValue } from "motion/react"

export function MyComponent() {
  const x = useMotionValue(0)
  return <motion.div style={{ x }} />
}
```

Motion values can be created with the useMotionValue hook. The string or number passed to useMotionValue will act as its initial state.

### Reference
- https://motion.dev/docs/react-motion-value

---

## motion value의 `set`과 `get` 메서드는 각각 어떤 역할이며, DOM 업데이트는 어떻게 처리되는가?

### Official Answer
Motion values can be updated with the set method.

```jsx
x.set(100)
```

Changes to the motion value will update the DOM without triggering a React re-render. Motion values can be updated multiple times but renders will be batched to the next animation frame.

A motion value can hold any string or number. We can read it with the get method.

```jsx
x.get() // 100
```

### Reference
- https://motion.dev/docs/react-motion-value

---

## motion value에서 `set()`과 `jump()`의 차이는 무엇인가?

### Official Answer
`jump()` jumps the motion value to a new state in a way that breaks continuity from previous values:

- Resets velocity to 0.
- Ends active animations.
- Ignores attached effects (for instance `useSpring`'s spring).

```jsx
const x = useSpring(0)
x.jump(10)
x.getVelocity() // 0
```

### Reference
- https://motion.dev/docs/react-motion-value

---

## React 컴포넌트 안에서 motion value의 이벤트를 구독하려면 어떻게 해야 하며, `on()` 메서드를 직접 쓸 때 주의할 점은?

### Official Answer
Listeners can be added to motion values via the `on` method or the `useMotionValueEvent` hook.

```jsx
useMotionValueEvent(x, "change", (latest) => console.log(latest))
```

Available events are `"change"`, `"animationStart"`, `"animationComplete"`, `"animationCancel"`.

It returns a function that, when called, will unsubscribe the listener.

```jsx
const unsubscribe = x.on("change", latest => console.log(latest))
```

When calling `on` inside a React component, it should be wrapped with a `useEffect` hook, or instead use the `useMotionValueEvent` hook.

### Reference
- https://motion.dev/docs/react-motion-value

---

## Motion의 `useTransform` 훅이란 무엇이며, 어떤 두 가지 방식으로 사용하는가?

### Official Answer
`useTransform` creates a new motion value that transforms the output of one or more motion values.

```jsx
const x = useMotionValue(1)
const y = useMotionValue(1)

const z = useTransform(() => x.get() + y.get()) // z.get() === 2
```

`useTransform` can be used in two ways: with a transform function and via value maps:

```jsx
// Transform function
const doubledX = useTransform(() => x.get() * 2)

// Value mapping
const color = useTransform(x, [0, 100], ["#f00", "#00f"])
```

### User Answer
`useTransform`의 파생값은 `.set()` 하지 않는다.

원본 MotionValue만 `.set()`하면 파생값은 자동 계산된다.

`useTransform`이 없으면 안 되는 핵심 이유: 원본 값이 **여러 곳에서 바뀔 때** 직접 계산 방식은 모든 변경 지점에서 파생값을 따로 관리해야 한다.

```tsx

// useTransform 없이 직접 계산하면:

// 1. 드래그 중 — 직접 계산

pan.set(progress);

scale.set(1 - progress * 0.2);

borderRadius.set(progress * 48);

// 2. snap-back — animate를 3개 따로 돌려야 함

animate(pan, 0, ...);

animate(scale, 1, ...);          // 따로

animate(borderRadius, 0, ...);   // 따로

// useTransform을 쓰면:

const scale = useTransform(pan, [0, 1], [1, 0.8]);

const borderRadius = useTransform(pan, [0, 1], [0, 48]);

// pan만 바꾸면 나머지가 자동으로 따라온다.

animate(pan, 0, ...);  // scale, borderRadius 자동 복귀

```

전체 데이터 흐름:

```

pan.set() or animate(pan) → useTransform(pan → scale, borderRadius) → style={{ scale, borderRadius }} → DOM 반영

       값 변경                       자동 계산                                   DOM 반영

```

연습 예제 — 드래그 방향에 따라 scale/borderRadius/color가 실시간 매핑:

```tsx

const x = useMotionValue(0);

const scale = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

const borderRadius = useTransform(x, [-200, 0, 200], [48, 0, 48]);

const background = useTransform(x, [-200, 0, 200], ['#ff0000', '#3366ff', '#00cc00']);

return (

  <motion.div

    drag="x"

    dragConstraints={{ left: 0, right: 0 }}

    dragElastic={0.5}

    style={{ width: 200, height: 200, background, scale, borderRadius, x, cursor: 'grab' }}

  />

);

```

### Reference
- https://motion.dev/docs/react-use-transform

---

## `useTransform`의 value mapping에서 input 범위가 반드시 단조증가/감소여야 하는 이유는?

### Official Answer
The input range must always be a series of increasing or decreasing numbers.

### Reference
- https://motion.dev/docs/react-use-transform

---

## `useTransform`의 value mapping에서 입력이 범위를 벗어나면 출력은 어떻게 되며, 이를 해제하려면?

### Official Answer
By setting `clamp: false`, the ranges will map perpetually.
For instance, in this example we're saying "for every `100px` scrolled, rotate another `360deg`":

```jsx
const { scrollY } = useScroll()
const rotate = useTransform(
  scrollY,
  [0, 100],
  [0, 360],
  { clamp: false }
)
```

### Reference
- https://motion.dev/docs/react-use-transform
