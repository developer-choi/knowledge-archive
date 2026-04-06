---
tags: [react, concept]
---
# Questions
- [Motion의 `<motion />` 컴포넌트란 무엇인가?](#motion의-motion--컴포넌트란-무엇인가)
- [motion 컴포넌트의 애니메이션이 React 리렌더를 유발하지 않는 이유는?](#motion-컴포넌트의-애니메이션이-react-리렌더를-유발하지-않는-이유는)
- [motion 컴포넌트의 style prop은 일반 React의 style과 어떻게 다른가?](#motion-컴포넌트의-style-prop은-일반-react의-style과-어떻게-다른가)
- [SSR 환경에서 motion 컴포넌트의 진입 애니메이션 깜빡임을 방지하려면?](#ssr-환경에서-motion-컴포넌트의-진입-애니메이션-깜빡임을-방지하려면)
- [`initial`, `animate`, `exit`은 motion 컴포넌트의 생애주기에서 각각 어떤 시점에 적용되는가?](#initial-animate-exit은-motion-컴포넌트의-생애주기에서-각각-어떤-시점에-적용되는가)
- [motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?](#motion-컴포넌트에서-exit-애니메이션이-동작하려면-어떤-조건이-필요한가)
- [motion의 `variants`란 무엇이며 어떤 이점이 있는가?](#motion의-variants란-무엇이며-어떤-이점이-있는가)
- [motion의 `onPan`은 `drag` prop과 어떻게 다른가?](#motion의-onpan은-drag-prop과-어떻게-다른가)
- [motion의 pan 제스처가 터치 환경에서 올바르게 동작하려면 어떤 CSS 설정이 필요한가?](#motion의-pan-제스처가-터치-환경에서-올바르게-동작하려면-어떤-css-설정이-필요한가)
- [CSS에서 `height: auto`로의 transition이 불가능한 문제를 Motion은 어떻게 해결하는가?](#css에서-height-auto로의-transition이-불가능한-문제를-motion은-어떻게-해결하는가)
- [Motion이 `transition`을 명시하지 않아도 자연스러운 애니메이션을 만드는 이유는?](#motion이-transition을-명시하지-않아도-자연스러운-애니메이션을-만드는-이유는)
- [motion의 `while-` gesture props는 제스처가 끝나면 어떻게 되는가?](#motion의-while--gesture-props는-제스처가-끝나면-어떻게-되는가)

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

---

## `initial`, `animate`, `exit`은 motion 컴포넌트의 생애주기에서 각각 어떤 시점에 적용되는가?

### Official Answer
`initial` — The initial visual state of the `motion` component.

`animate` — A target to animate to on enter, and on update.

`exit` — A target to animate to when a component is removed from the tree.
Can be set either as an animation target, or variant.

> #### AI Annotation:
> 마운트 시 `initial` 상태에서 `animate` 상태로 전환되고, `animate` 값이 변경되면 자동으로 이전 값에서 새 값으로 애니메이션된다.
> 언마운트 시에는 `exit`에 정의된 상태로 애니메이션한 뒤 DOM에서 제거된다.

### Reference
- https://motion.dev/docs/react-motion-component

---

## motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?

### Official Answer
Owing to React limitations, the component being removed **must** be a **direct child** of `AnimatePresence` to enable this animation.

> #### AI Annotation:
> React는 컴포넌트가 unmount되면 즉시 DOM에서 제거한다.
> `AnimatePresence`가 children을 감시하여 사라진 child를 감지하고, exit 애니메이션이 끝날 때까지 DOM에 유지시킨다.
> 직접 자식이어야 하는 이유는 `AnimatePresence`가 children 목록의 변화로 제거를 감지하는 방식이기 때문이다.

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

> #### AI Annotation:
> CSS 클래스처럼 애니메이션 상태를 이름으로 분리·재사용할 수 있다.
> 각 variant 안에 개별 `transition`을 지정할 수 있어서, 상태마다 다른 전환 효과를 줄 수 있다.
> 또한 부모 컴포넌트의 variant가 자식에게 전파되므로, orchestration(순차/동시 애니메이션 제어)에 핵심적이다.

> #### Official Annotation:
> Variants will flow down through `motion` components.
>
> ```jsx
> const list = {
>   visible: { opacity: 1 },
>   hidden: { opacity: 0 },
> }
>
> const item = {
>   visible: { opacity: 1, x: 0 },
>   hidden: { opacity: 0, x: -100 },
> }
>
> return (
>   <motion.ul
>     initial="hidden"
>     whileInView="visible"
>     variants={list}
>   >
>     <motion.li variants={item} />
>     <motion.li variants={item} />
>     <motion.li variants={item} />
>   </motion.ul>
> )
> ```
>
> — https://motion.dev/docs/react-animation

### Reference
- https://motion.dev/docs/react-motion-component

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

Pan and drag events are provided the origin `PointerEvent` as well as an object `info` that contains `x` and `y` point values for the following:
- `point`: Relative to the device or page.
- `delta`: Distance since the last event.
- `offset`: Distance from the original event.
- `velocity`: Current velocity of the pointer.

> #### AI Annotation:
> `drag`는 엘리먼트를 자동으로 이동시키지만, `onPan`은 이동 정보만 콜백으로 전달하는 저수준 API다.
> "정보만 받고 뭘 할지는 내가 결정"하는 방식이므로, scale/opacity 같은 값을 직접 제어하는 커스텀 제스처에 적합하다.
> `delta`는 매 프레임 미세한 이동량, `offset`은 최초부터 누적된 총 이동량이다.

### Reference
- https://motion.dev/docs/react-motion-component

---

## motion의 pan 제스처가 터치 환경에서 올바르게 동작하려면 어떤 CSS 설정이 필요한가?

### Official Answer
For pan gestures to work correctly with touch input, the element needs touch scrolling to be disabled on either x/y or both axis with the `touch-action` CSS rule.

> #### AI Annotation:
> 브라우저가 터치 입력을 스크롤로 먼저 소비하면 pan 이벤트가 발생하지 않는다.
> `touch-action: none`으로 브라우저의 기본 터치 처리를 비활성화해야 pan 제스처가 정상 동작한다.

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

> #### AI Annotation:
> CSS에서 `height: auto`로의 transition은 불가능하다 — `auto`가 계산되기 전에는 숫자 값이 없어서 보간할 수 없기 때문이다.
> Motion은 내부적으로 실제 높이를 측정한 뒤 그 값으로 애니메이션한다.
> 단, `display: none`인 엘리먼트는 레이아웃에서 완전히 빠져서 측정이 불가능하므로, `visibility: hidden`으로 대체해야 한다.

### Reference
- https://motion.dev/docs/react-animation

---

## Motion이 `transition`을 명시하지 않아도 자연스러운 애니메이션을 만드는 이유는?

### Official Answer
By default, Motion will create appropriate transitions for snappy animations based on the type of value being animated.
For instance, physical properties like `x` or `scale` are animated with spring physics, whereas values like `opacity` or `color` are animated with duration-based easing curves.

> #### AI Annotation:
> 위치/크기 변화는 실제 물체처럼 spring으로, 시각적 속성(투명도, 색상)은 부드러운 easing으로 자동 매핑한다.
> `transition: { type: 'tween' }`을 명시하는 건 이 기본 spring을 오버라이드하기 위함이다.

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

> #### AI Annotation:
> `while-` props는 단방향이 아니라 양방향 애니메이션이다.
> 제스처가 시작되면 `while-` 값으로, 끝나면 `initial` 또는 `animate` 값으로 자동 복귀한다.
> 별도의 "복귀 애니메이션"을 작성할 필요가 없다.

### Reference
- https://motion.dev/docs/react-animation
