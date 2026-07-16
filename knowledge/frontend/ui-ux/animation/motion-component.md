---
tags: [react, concept]
source: official
publishable: false
priority:
---
# Questions
- Motion의 `<motion />` 컴포넌트란 무엇인가?
- motion 컴포넌트의 애니메이션이 React 리렌더를 유발하지 않는 이유는?
- motion 컴포넌트의 style prop은 일반 React의 style과 어떻게 다른가?
- SSR 환경에서 motion 컴포넌트의 진입 애니메이션 깜빡임을 방지하려면?
- `initial`, `animate`, `exit`은 motion 컴포넌트의 생애주기에서 각각 어떤 시점에 적용되는가?
- Motion의 `AnimatePresence`란 무엇이며, 자식 컴포넌트의 퇴장을 감지하는 세 가지 경우는?
  - motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?
  - AnimatePresence에서 단일 자식의 key만 바꾸면 슬라이드쇼/탭 전환 애니메이션을 만들 수 있다. 어떻게 동작하는가?
  - AnimatePresence의 `mode` prop은 진입/퇴장 순서를 어떻게 제어하며, `"sync"`, `"wait"`, `"popLayout"` 각각 언제 쓰는가?
- motion의 `variants`란 무엇이며 어떤 이점이 있는가?
- motion의 `onPan`은 `drag` prop과 어떻게 다른가?
- CSS에서 `height: auto`로의 transition이 불가능한 문제를 Motion은 어떻게 해결하는가?
- Motion이 `transition`을 명시하지 않아도 자연스러운 애니메이션을 만드는 이유는?
- motion의 `while-` gesture props는 제스처가 끝나면 어떻게 되는가?
- Motion의 motion value란 무엇이며, `useMotionValue` 훅으로 어떻게 생성하는가?
  - motion value의 `set`과 `get` 메서드는 각각 어떤 역할이며, DOM 업데이트는 어떻게 처리되는가?
  - motion value에서 `set()`과 `jump()`의 차이는 무엇인가?
  - React 컴포넌트 안에서 motion value의 이벤트를 구독하려면 어떻게 해야 하며, `on()` 메서드를 직접 쓸 때 주의할 점은?
- Motion의 `useTransform` 훅이란 무엇이며, 어떤 두 가지 방식으로 사용하는가?
  - `useTransform`의 value mapping에서 input 범위가 반드시 단조증가/감소여야 하는 이유는?
  - `useTransform`의 value mapping에서 입력이 범위를 벗어나면 출력은 어떻게 되며, 이를 해제하려면?
- Radix UI 컴포넌트에 Motion의 exit 애니메이션을 적용하려면 어떤 설정이 필요한가?
- Motion의 `transition`이란 무엇이며, 어디에 설정할 수 있는가?
  - Motion의 애니메이션 타입 tween, spring, inertia는 각각 어떤 방식인가?
    - spring의 물리 기반(stiffness/damping/mass)과 duration 기반(duration/bounce)의 차이는?
    - `inertia` 애니메이션은 어떻게 동작하며, 주요 설정 옵션은 무엇인가?

---

# Answers

## Motion의 `<motion />` 컴포넌트란 무엇인가?

### Official Answer
There's a `motion` component for every HTML and SVG element, for instance `motion.div`, `motion.circle` etc.
It extends standard React components with animation props that run at up to 120fps - without triggering React re-renders.

You can use a `motion` component exactly as you would any normal HTML/SVG component:

```jsx
<motion.div className="box" />
```

But you also gain access to powerful animation APIs like the `animate`, `layout`, `whileInView` props.

```jsx
<motion.div
  className="box"
  // Animate when this value changes:
  animate={{ scale: 2 }}
  // Fade in when the element enters the viewport:
  whileInView={{ opacity: 1 }}
  // Animate the component when its layout changes:
  layout
  // Style now supports indepedent transforms:
  style={{ x: 100 }}
/>
```

### Reference
- https://motion.dev/docs/react-motion-component

---

## motion 컴포넌트의 애니메이션이 React 리렌더를 유발하지 않는 이유는?

### Official Answer
`motion` components bypass React's render cycle entirely.
Animated values update on every frame via the browser's native animation pipeline, so even complex animations with dozens of animated properties won't cause React re-renders or style/layout thrashing.

Using motion values instead of React state to update `style` will also avoid re-renders.

```jsx
const x = useMotionValue(0)

useEffect(() => {
  // Won't trigger a re-render!
  const timeout = setTimeout(() => x.set(100), 1000)

  return () => clearTimeout(timeout)
}, [])

return <motion.div style={{ x }} />
```

### User Answer
`useMotionValue`는 `useState`와 역할이 같다 — 값을 저장하고 변경을 추적한다.

차이는 값이 바뀔 때 리렌더가 발생하느냐 뿐이다.

`animate()`는 내부적으로 `.set()`을 매 프레임(~16ms)마다 호출해서 값을 조금씩 바꾸는 것이다:

```

0ms:   pan.set(0)

16ms:  pan.set(0.05)

32ms:  pan.set(0.12)

...

300ms: pan.set(1)

```

FullScreenOverlay에서 드래그 중 `pan`, `dimOpacity`, `dragScale`, `dragRadius` 4개 값이 매 프레임 바뀌는데, `useState`로 하면 초당 240번 리렌더가 발생한다.

연습 예제 — 버튼으로 명령형 animate() 호출:

```tsx

const opacity = useMotionValue(0);

return (

  <>

    <motion.div style={{ width: 200, height: 200, background: '#3366ff', opacity }} />

    <button onClick={() => animate(opacity, 1, { type: 'tween', duration: 0.3, ease: 'easeOut' })}>

      fadeIn

    </button>

    <button onClick={() => animate(opacity, 0, { type: 'tween', duration: 0.3, ease: 'easeOut' })}>

      fadeOut

    </button>

  </>

);

```

### Reference
- https://motion.dev/docs/react-motion-component
- https://motion.dev/docs/react-motion-value

---

## motion 컴포넌트의 style prop은 일반 React의 style과 어떻게 다른가?

### Official Answer
But you also gain access to powerful animation APIs like the `animate`, `layout`, `whileInView` props.

```jsx
<motion.div
  className="box"
  // Style now supports indepedent transforms:
  style={{ x: 100 }}
/>
```

### User Answer
`style={{ y }}`는 MotionValue를 DOM에 **바인딩**하는 것이다. "미러링"(양방향 동기화)이 아니라 단방향 파이프라인:

```

drag="y" ──.set()──→ y (MotionValue) ──style={{ y }}──→ DOM

```

`drag="y"`가 드래그할 때 y MotionValue에 `.set()`을 호출하고, `style={{ y }}`가 그 값을 DOM에 반영한다.

`style={{ y }}`가 없으면 motion이 내부적으로 자체 값을 만들어서 쓰고, 우리는 그 값에 접근할 수 없다.

연습 예제 — drag가 MotionValue에 .set()하고 style이 DOM에 반영하는 과정 체감:

```tsx

const y = useMotionValue(0);

const handleDragEnd = () => {

  if (y.get() > 150) {

    animate(y, 300, { type: 'tween', duration: 0.3 });   // dismiss

  } else {

    animate(y, 0, { type: 'spring', stiffness: 400, damping: 40 }); // snap-back

  }

};

return (

  <motion.div

    drag="y"

    dragConstraints={{ top: 0, bottom: 300 }}

    dragElastic={0}

    onDragEnd={handleDragEnd}

    style={{ width: 200, height: 200, background: '#cc3333', cursor: 'grab', y }}

  />

);

```

### Reference
- https://motion.dev/docs/react-motion-component

---

## SSR 환경에서 motion 컴포넌트의 진입 애니메이션 깜빡임을 방지하려면?

### Official Answer
`motion` components are fully compatible with server-side rendering, meaning the initial state of the component will be reflected in the server-generated output.

```jsx
// Server will output `translateX(100px)`
<motion.div initial={false} animate={{ x: 100 }} />
```

### Reference
- https://motion.dev/docs/react-motion-component

---

## `initial`, `animate`, `exit`은 motion 컴포넌트의 생애주기에서 각각 어떤 시점에 적용되는가?

### Official Answer
`initial` — The initial visual state of the `motion` component.

`animate` — A target to animate to on enter, and on update.

`exit` — A target to animate to when a component is removed from the tree.
Can be set either as an animation target, or variant.

### Reference
- https://motion.dev/docs/react-motion-component

---

## Motion의 `AnimatePresence`란 무엇이며, 자식 컴포넌트의 퇴장을 감지하는 세 가지 경우는?

### Official Answer
`AnimatePresence` makes exit animations easy. By wrapping one or more motion components with `AnimatePresence`, we gain access to the `exit` animation prop.

```jsx
<AnimatePresence>
  {show && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

`AnimatePresence` works by detecting when its direct children are removed from the React tree.

This can be due to a component mounting/remounting:

```jsx
<AnimatePresence>
  {show && <Modal key="modal" />}
</AnimatePresence>
```

Its key changing:

```jsx
<AnimatePresence>
  <Slide key={activeItem.id} />
</AnimatePresence>
```

Or when children in a list are added/removed:

```jsx
<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id} exit={{ opacity: 1 }} layout />
  ))}
</AnimatePresence>
```

Direct children must each have a unique key prop so `AnimatePresence` can track their presence in the tree.

### Reference
- https://motion.dev/docs/react-animate-presence

---

## motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?

### Official Answer
Owing to React limitations, the component being removed **must** be a **direct child** of `AnimatePresence` to enable this animation.

Also make sure `AnimatePresence` is outside of the code that unmounts the element. If `AnimatePresence` itself unmounts, then it can't control exit animations!

```jsx
// ❌
isVisible && (
  <AnimatePresence>
    <Component />
  </AnimatePresence>
)
// ✅
<AnimatePresence>
  {isVisible && <Component />}
</AnimatePresence>
```

### Reference
- https://motion.dev/docs/react-motion-component
- https://motion.dev/docs/react-animate-presence

---

## AnimatePresence에서 단일 자식의 key만 바꾸면 슬라이드쇼/탭 전환 애니메이션을 만들 수 있다. 어떻게 동작하는가?

### Official Answer
Changing a key prop makes React create an entirely new component. So by changing the key of a single child of `AnimatePresence`, we can easily make components like slideshows.

```jsx
export const Slideshow = ({ image }) => (
  <AnimatePresence>
    <motion.img
      key={image.src}
      src={image.src}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
    />
  </AnimatePresence>
)
```

### Reference
- https://motion.dev/docs/react-animate-presence

---

## AnimatePresence의 `mode` prop은 진입/퇴장 순서를 어떻게 제어하며, `"sync"`, `"wait"`, `"popLayout"` 각각 언제 쓰는가?

### Official Answer
`mode` decides how `AnimatePresence` handles entering and exiting children. Default: `"sync"`.

**sync**: In `"sync"` mode, elements animate in and out as soon as they're added/removed.

**wait**: In `"wait"` mode, the entering element will wait until the exiting child has animated out, before it animates in. `wait` mode only supports one child at a time.

**popLayout**: Exiting elements will be "popped" out of the page layout, allowing surrounding elements to immediately reflow. Pairs especially well with the `layout` prop, so elements can animate to their new layout.

```jsx
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.li layout exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

### Reference
- https://motion.dev/docs/react-animate-presence

---

## motion의 `variants`란 무엇이며 어떤 이점이 있는가?

### Official Answer
```jsx
const variants = {
  active: {
      backgroundColor: "#f00"
  },
  inactive: {
    backgroundColor: "#fff",
    transition: { duration: 2 }
  }
}

return (
  <motion.div
    variants={variants}
    animate={isActive ? "active" : "inactive"}
  />
)
```

Variants will flow down through `motion` components.

```jsx
const list = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 },
}

return (
  <motion.ul
    initial="hidden"
    whileInView="visible"
    variants={list}
  >
    <motion.li variants={item} />
    <motion.li variants={item} />
    <motion.li variants={item} />
  </motion.ul>
)
```

### Reference
- https://motion.dev/docs/react-motion-component
- https://motion.dev/docs/react-animation

---

## motion의 `onPan`은 `drag` prop과 어떻게 다른가?

### Official Answer
Callback function that fires when the pan gesture is recognised on this element.

```jsx
function onPan(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onPan={onPan} />
```

### User Answer
`drag="y"`로 끌면 요소가 실제로 아래로 이동한다.

`onPan`으로 끌면 요소는 제자리인데 scale이 줄어들고 borderRadius가 커진다.

FullScreenOverlay가 `drag` 대신 `onPan`을 쓴 이유: **위치 이동이 목적이 아니라 scale/borderRadius 변환이 목적**이기 때문이다.

```tsx

// onPan: 이벤트만 받고, 시각 변화는 직접 구현

const handlePan = (_: PointerEvent, info: PanInfo) => {

  const progress = Math.max(0, Math.min(info.offset.y / 200, 1));

  pan.set(progress);               // 여기서 직접 값을 설정

  dimOpacity.set(0.5 * (1 - progress));

};

// 조건부 snap-back

const handlePanEnd = (_: PointerEvent, info: PanInfo) => {

  if (info.velocity.y > 800 || info.offset.y > 80) {

    onClose();                      // dismiss

  } else {

    animate(pan, 0, { type: 'spring', stiffness: 400, damping: 40 }); // snap-back

  }

};

```

연습 예제 — drag vs onPan 차이를 나란히 체감:

```tsx

{/* drag: 요소가 실제로 이동 */}

<motion.div

  drag="y"

  dragConstraints={{ top: 0, bottom: 200 }}

  whileDrag={{ background: '#cc3333' }}

  style={{ width: 200, height: 200, background: '#3366ff', cursor: 'grab' }}

/>

{/* onPan: 요소는 제자리, scale/borderRadius/dim만 변함 */}

const pan = useMotionValue(0);

const scale = useTransform(pan, [0, 1], [1, 0.8], { clamp: true });

const borderRadius = useTransform(pan, [0, 1], [0, 48], { clamp: true });

const dimOpacity = useMotionValue(0.5);

<motion.div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dimOpacity }} />

<motion.div

  onPan={(_, info) => {

    const progress = Math.max(0, Math.min(info.offset.y / 200, 1));

    pan.set(progress);

    dimOpacity.set(0.5 * (1 - progress));

  }}

  onPanEnd={(_, info) => {

    if (info.velocity.y > 800 || info.offset.y > 80) { /* dismiss */ }

    else { animate(pan, 0, { type: 'spring', stiffness: 400, damping: 40 }); }

  }}

  style={{ width: '100%', height: 300, background: '#fff', scale, borderRadius, touchAction: 'none' }}

/>

```

### Reference
- https://motion.dev/docs/react-motion-component

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

## motion의 `while-` gesture props는 제스처가 끝나면 어떻게 되는가?

### Official Answer
When a gesture starts, it animates to the values defined in `while-`, and then when the gesture ends it animates back to the values in `initial` or `animate`.

```jsx
<motion.button
  initial={{ opacity: 0 }}
  whileHover={{ backgroundColor: "rgba(220, 220, 220, 1)" }}
  whileTap={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
  whileInView={{ opacity: 1 }}
/>
```

### Reference
- https://motion.dev/docs/react-animation

---

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

---

## Radix UI 컴포넌트에 Motion의 exit 애니메이션을 적용하려면 어떤 설정이 필요한가?

### Official Answer
Most Radix components render and control their own DOM elements. But they also provide the `asChild` prop that, when set to true, will make the component use the first provided child as its DOM node instead.

By passing a motion component as this child, we can now use all of its animation props as normal:

```jsx
<Toast.Root asChild>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    layout
  />
</Toast.Root>
```

By default Radix tends to control state like `isOpen` internally. However, it provides some helper props for us to track or control this state externally.

For instance, the Tooltip component provides the `open` and `onOpenChange` props, which makes it easy to track the tooltip state:

```jsx
const [isOpen, setOpen] = useState(false)

return (
  <Tooltip.Provider>
    <Tooltip.Root open={isOpen} onOpenChange={setOpen}>
      <AnimatePresence>
        {isOpen && (
          <Tooltip.Portal forceMount>
            <Tooltip.Content asChild>
              <motion.div exit={{ opacity: 0 }} />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </AnimatePresence>
    </Tooltip.Root>
  </Tooltip.Provider>
)
```

Because Radix expects all its children to be rendered at all times, when we're conditionally rendering children like this, setting `forceMount` to true allows our enter/exit animations to work correctly.

### Reference
- https://motion.dev/docs/radix

---

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
