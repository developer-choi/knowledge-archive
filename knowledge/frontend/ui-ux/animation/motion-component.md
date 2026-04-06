---
tags: [react, concept]
---
# Questions
- [Motion의 `<motion />` 컴포넌트란 무엇인가?](#motion의-motion--컴포넌트란-무엇인가)
- [motion 컴포넌트의 애니메이션이 React 리렌더를 유발하지 않는 이유는?](#motion-컴포넌트의-애니메이션이-react-리렌더를-유발하지-않는-이유는)
- [motion 컴포넌트의 style prop은 일반 React의 style과 어떻게 다른가?](#motion-컴포넌트의-style-prop은-일반-react의-style과-어떻게-다른가)
- [SSR 환경에서 motion 컴포넌트의 진입 애니메이션 깜빡임을 방지하려면?](#ssr-환경에서-motion-컴포넌트의-진입-애니메이션-깜빡임을-방지하려면)

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

> #### AI Annotation:
> 선언적 API가 핵심이다.
> "어떻게 애니메이션할지"가 아니라 "어떤 상태가 되어야 하는지"만 기술하면 Motion이 알아서 보간한다.
> 기존 HTML 엘리먼트의 drop-in replacement이므로, `<div>`를 `<motion.div>`로 바꾸기만 하면 애니메이션 기능이 추가된다.

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

> #### AI Annotation:
> 일반적으로 React에서 애니메이션하려면 `setState`로 값을 바꾸고 → 리렌더하고 → DOM에 반영하는 사이클을 매 프레임 반복해야 한다.
> Motion은 이 경로를 건너뛰고 DOM을 직접 조작한다.
> `useMotionValue`는 React state 바깥에서 값을 관리하므로, `x.set(100)`을 호출해도 컴포넌트가 리렌더되지 않는다.

### Reference
- https://motion.dev/docs/react-motion-component

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

> #### AI Annotation:
> 일반 CSS에서는 `transform: translateX(100px) rotate(45deg)`를 하나의 문자열로 합성해야 한다.
> motion의 style은 `x`, `rotate`, `scale` 같은 transform 속성을 독립적으로 제어할 수 있다.
> 또한 `useMotionValue`로 생성한 motion value를 style에 직접 전달하면 리렌더 없이 값이 업데이트된다.

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

> #### AI Annotation:
> `initial={false}`를 설정하면 진입 애니메이션을 건너뛰고 `animate` 값을 초기 상태로 사용한다.
> 서버에서 이미 `translateX(100px)`가 적용된 HTML이 나오므로, 클라이언트 hydration 후 깜빡임(flash)이 없다.

### Reference
- https://motion.dev/docs/react-motion-component
