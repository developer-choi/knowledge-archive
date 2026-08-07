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
- motion의 `variants`란 무엇이며 어떤 이점이 있는가?
- motion의 `while-` gesture props는 제스처가 끝나면 어떻게 되는가?

## 관련 주제
- [AnimatePresence · exit 애니메이션 → `motion-presence.md`](motion-presence.md)
- [motion value · useTransform → `motion-value.md`](motion-value.md)
- [transition · 애니메이션 타입 → `motion-transition.md`](motion-transition.md)
- [drag · onPan 제스처 → `motion-drag.md`](motion-drag.md)
- [layout 애니메이션 → `motion-layout-animation.md`](motion-layout-animation.md)

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
