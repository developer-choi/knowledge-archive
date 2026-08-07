---
tags: [react, concept]
source: official
publishable: false
priority:
---
# Questions
- Motion의 `transition`이란 무엇이며, 어디에 설정할 수 있는가?
  - Motion의 애니메이션 타입 tween, spring, inertia는 각각 어떤 방식인가?
    - spring의 물리 기반(stiffness/damping/mass)과 duration 기반(duration/bounce)의 차이는?
    - `inertia` 애니메이션은 어떻게 동작하며, 주요 설정 옵션은 무엇인가?
- Motion이 `transition`을 명시하지 않아도 자연스러운 애니메이션을 만드는 이유는?
- CSS에서 `height: auto`로의 transition이 불가능한 문제를 Motion은 어떻게 해결하는가?

---

# Answers

## Motion의 `transition`이란 무엇이며, 어디에 설정할 수 있는가?

### Official Answer
A transition defines the type of animation used when animating between two values.

```jsx
const transition = {
  duration: 0.8,
  delay: 0.5,
  ease: [0, 0.71, 0.2, 1.01],
}

<motion.div
  animate={{ x: 100 }}
  transition={transition}
/>
```

`transition` can be set on any animation prop, and that transition will be used when the animation fires.

```jsx
<motion.div
  whileHover={{
    scale: 1.1,
    transition: { duration: 0.2 }
  }}
/>
```

### Reference
- https://motion.dev/docs/react-transitions

---

## Motion의 애니메이션 타입 tween, spring, inertia는 각각 어떤 방식인가?

### Official Answer
`type` decides the type of animation to use. It can be `"tween"`, `"spring"` or `"inertia"`.

Tween animations are set with a duration and an easing curve.

Spring animations are either physics-based or duration-based.

Inertia animations decelerate a value based on its initial velocity, usually used to implement inertial scrolling.

```jsx
<motion.path
  animate={{ pathLength: 1 }}
  transition={{ duration: 2, type: "tween" }}
/>
```

### Reference
- https://motion.dev/docs/react-transitions

---

## spring의 물리 기반(stiffness/damping/mass)과 duration 기반(duration/bounce)의 차이는?

### Official Answer
Physics-based spring animations are set via `stiffness`, `damping` and `mass`, and these incorporate the velocity of any existing gestures or animations for natural feedback.

Duration-based spring animations are set via a `duration` and `bounce`. These don't incorporate velocity but are easier to understand.

### Reference
- https://motion.dev/docs/react-transitions

---

## `inertia` 애니메이션은 어떻게 동작하며, 주요 설정 옵션은 무엇인가?

### Official Answer
An animation that decelerates a value based on its initial velocity. Optionally, `min` and `max` boundaries can be defined, and inertia will snap to these with a spring animation.

The animation automatically precalculates a target value, which can be modified with the `modifyTarget` property. This enables snap-to-grid functionality.

```jsx
dragTransition={{ modifyTarget: target => Math.round(target / 50) * 50 }}
```

`power` (default: `0.8`): A higher power value equals a further calculated target.

`timeConstant` (default: `700`): Adjusting the time constant will change the duration of the deceleration, thereby affecting its feel.

`min`/`max`: If set, the value will "bump" against this value (or immediately spring to it if the animation starts beyond this value).

`bounceStiffness` (default: `500`): When `min` or `max` is set, this affects the stiffness of the bounce spring. Higher values will create more sudden movement.

`bounceDamping` (default: `10`): When `min` or `max` is set, this affects the damping of the bounce spring. Set to `0`, spring will oscillate indefinitely.

### Reference
- https://motion.dev/docs/react-transitions

---

## Motion이 `transition`을 명시하지 않아도 자연스러운 애니메이션을 만드는 이유는?

### Official Answer
By default, Motion will create appropriate transitions for snappy animations based on the type of value being animated.
For instance, physical properties like `x` or `scale` are animated with spring physics, whereas values like `opacity` or `color` are animated with duration-based easing curves.

### User Answer
FullScreenOverlay에서의 사용 판단:

```tsx

// 열기/닫기: tween — 매번 동일한 0.3초, 예측 가능한 UI 전환

animate={{ scale: 1, transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } }}

// snap-back: spring — 드래그 속도를 이어받아 자연스러운 복귀

animate(pan, 0, { type: 'spring', stiffness: 400, damping: 40 })

```

열기/닫기에 spring을 쓰면 바운스가 생겨 UI가 불안정해 보이고, snap-back에 tween을 쓰면 어떤 속도로 놓든 동일한 속도로 복귀해서 부자연스럽다.

연습 예제 — tween과 spring 차이를 나란히 체감:

```tsx

{/* spring: stiffness/damping이 있으면 duration 무시됨 */}

<motion.div

  style={{ width: 100, height: 100, background: 'red' }}

  animate={{ x: 100 }}

  transition={{ type: 'spring', stiffness: 400, damping: 40 }}

/>

{/* tween: 정확히 3초 동안 이동 */}

<motion.div

  style={{ width: 100, height: 100, background: 'blue' }}

  animate={{ x: 100 }}

  transition={{ type: 'tween', duration: 3, ease: 'easeOut' }}

/>

```

### Reference
- https://motion.dev/docs/react-animation

---

## CSS에서 `height: auto`로의 transition이 불가능한 문제를 Motion은 어떻게 해결하는가?

### Official Answer
It's also possible to animate `width` and `height` in to/out of `"auto"`.

```jsx
<motion.div
  initial={{ height: 0 }}
  animate={{ height: "auto" }}
/>
```

If animating `height: auto` while also animating `display` in to/out of `"none"`, replace this with `visibility` `"hidden"` as elements with `display: none` can't be measured.

### Reference
- https://motion.dev/docs/react-animation
