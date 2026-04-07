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
- [Motion의 `useTransform` 훅이란 무엇이며, 어떤 두 가지 방식으로 사용하는가?](#motion의-usetransform-훅이란-무엇이며-어떤-두-가지-방식으로-사용하는가)
  - [`useTransform`의 value mapping에서 input 범위가 반드시 단조증가/감소여야 하는 이유는?](#usetransform의-value-mapping에서-input-범위가-반드시-단조증가감소여야-하는-이유는)
  - [`useTransform`의 value mapping에서 입력이 범위를 벗어나면 출력은 어떻게 되며, 이를 해제하려면?](#usetransform의-value-mapping에서-입력이-범위를-벗어나면-출력은-어떻게-되며-이를-해제하려면)

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

> #### User Annotation:
> `useMotionValue`는 `useState`와 역할이 같다 — 값을 저장하고 변경을 추적한다. 차이는 값이 바뀔 때 리렌더가 발생하느냐 뿐이다.
> `animate()`는 내부적으로 `.set()`을 매 프레임(~16ms)마다 호출해서 값을 조금씩 바꾸는 것이다:
> ```
> 0ms:   pan.set(0)
> 16ms:  pan.set(0.05)
> 32ms:  pan.set(0.12)
> ...
> 300ms: pan.set(1)
> ```
> FullScreenOverlay에서 드래그 중 `pan`, `dimOpacity`, `dragScale`, `dragRadius` 4개 값이 매 프레임 바뀌는데, `useState`로 하면 초당 240번 리렌더가 발생한다.
>
> 연습 예제 — 버튼으로 명령형 animate() 호출:
> ```tsx
> const opacity = useMotionValue(0);
>
> return (
>   <>
>     <motion.div style={{ width: 200, height: 200, background: '#3366ff', opacity }} />
>     <button onClick={() => animate(opacity, 1, { type: 'tween', duration: 0.3, ease: 'easeOut' })}>
>       fadeIn
>     </button>
>     <button onClick={() => animate(opacity, 0, { type: 'tween', duration: 0.3, ease: 'easeOut' })}>
>       fadeOut
>     </button>
>   </>
> );
> ```

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

> #### User Annotation:
> `style={{ y }}`는 MotionValue를 DOM에 **바인딩**하는 것이다. "미러링"(양방향 동기화)이 아니라 단방향 파이프라인:
> ```
> drag="y" ──.set()──→ y (MotionValue) ──style={{ y }}──→ DOM
> ```
> `drag="y"`가 드래그할 때 y MotionValue에 `.set()`을 호출하고, `style={{ y }}`가 그 값을 DOM에 반영한다.
> `style={{ y }}`가 없으면 motion이 내부적으로 자체 값을 만들어서 쓰고, 우리는 그 값에 접근할 수 없다.
>
> 연습 예제 — drag가 MotionValue에 .set()하고 style이 DOM에 반영하는 과정 체감:
> ```tsx
> const y = useMotionValue(0);
>
> const handleDragEnd = () => {
>   if (y.get() > 150) {
>     animate(y, 300, { type: 'tween', duration: 0.3 });   // dismiss
>   } else {
>     animate(y, 0, { type: 'spring', stiffness: 400, damping: 40 }); // snap-back
>   }
> };
>
> return (
>   <motion.div
>     drag="y"
>     dragConstraints={{ top: 0, bottom: 300 }}
>     dragElastic={0}
>     onDragEnd={handleDragEnd}
>     style={{ width: 200, height: 200, background: '#cc3333', cursor: 'grab', y }}
>   />
> );
> ```

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

> #### User Annotation:
> `drag="y"`로 끌면 요소가 실제로 아래로 이동한다. `onPan`으로 끌면 요소는 제자리인데 scale이 줄어들고 borderRadius가 커진다.
> FullScreenOverlay가 `drag` 대신 `onPan`을 쓴 이유: **위치 이동이 목적이 아니라 scale/borderRadius 변환이 목적**이기 때문이다.
> ```tsx
> // onPan: 이벤트만 받고, 시각 변화는 직접 구현
> const handlePan = (_: PointerEvent, info: PanInfo) => {
>   const progress = Math.max(0, Math.min(info.offset.y / 200, 1));
>   pan.set(progress);               // 여기서 직접 값을 설정
>   dimOpacity.set(0.5 * (1 - progress));
> };
>
> // 조건부 snap-back
> const handlePanEnd = (_: PointerEvent, info: PanInfo) => {
>   if (info.velocity.y > 800 || info.offset.y > 80) {
>     onClose();                      // dismiss
>   } else {
>     animate(pan, 0, { type: 'spring', stiffness: 400, damping: 40 }); // snap-back
>   }
> };
> ```
>
> 연습 예제 — drag vs onPan 차이를 나란히 체감:
> ```tsx
> {/* drag: 요소가 실제로 이동 */}
> <motion.div
>   drag="y"
>   dragConstraints={{ top: 0, bottom: 200 }}
>   whileDrag={{ background: '#cc3333' }}
>   style={{ width: 200, height: 200, background: '#3366ff', cursor: 'grab' }}
> />
>
> {/* onPan: 요소는 제자리, scale/borderRadius/dim만 변함 */}
> const pan = useMotionValue(0);
> const scale = useTransform(pan, [0, 1], [1, 0.8], { clamp: true });
> const borderRadius = useTransform(pan, [0, 1], [0, 48], { clamp: true });
> const dimOpacity = useMotionValue(0.5);
>
> <motion.div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dimOpacity }} />
> <motion.div
>   onPan={(_, info) => {
>     const progress = Math.max(0, Math.min(info.offset.y / 200, 1));
>     pan.set(progress);
>     dimOpacity.set(0.5 * (1 - progress));
>   }}
>   onPanEnd={(_, info) => {
>     if (info.velocity.y > 800 || info.offset.y > 80) { /* dismiss */ }
>     else { animate(pan, 0, { type: 'spring', stiffness: 400, damping: 40 }); }
>   }}
>   style={{ width: '100%', height: 300, background: '#fff', scale, borderRadius, touchAction: 'none' }}
> />
> ```

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

> #### User Annotation:
> - **tween** = 시간 기반 애니메이션. "3초 동안 A→B로 가라" — 끝나는 시간이 보장됨.
> - **spring** = 물리 기반 애니메이션. "스프링으로 A→B로 가라" — 끝나는 시간은 물리 계산 결과에 따라 다름.
> - tween은 **카테고리**이고, `linear`/`easeOut` 등은 그 안의 **ease 옵션**이다. CSS로 치면 tween = `transition`, ease = `transition-timing-function`.
> - spring에서 `stiffness`/`damping`/`mass`를 지정하면 `duration`/`bounce`는 **무시된다**. 이 둘을 섞으면 duration이 안 먹히는 것처럼 보인다.
>
> FullScreenOverlay에서의 사용 판단:
> ```tsx
> // 열기/닫기: tween — 매번 동일한 0.3초, 예측 가능한 UI 전환
> animate={{ scale: 1, transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } }}
>
> // snap-back: spring — 드래그 속도를 이어받아 자연스러운 복귀
> animate(pan, 0, { type: 'spring', stiffness: 400, damping: 40 })
> ```
> 열기/닫기에 spring을 쓰면 바운스가 생겨 UI가 불안정해 보이고, snap-back에 tween을 쓰면 어떤 속도로 놓든 동일한 속도로 복귀해서 부자연스럽다.
>
> 연습 예제 — tween과 spring 차이를 나란히 체감:
> ```tsx
> {/* spring: stiffness/damping이 있으면 duration 무시됨 */}
> <motion.div
>   style={{ width: 100, height: 100, background: 'red' }}
>   animate={{ x: 100 }}
>   transition={{ type: 'spring', stiffness: 400, damping: 40 }}
> />
> {/* tween: 정확히 3초 동안 이동 */}
> <motion.div
>   style={{ width: 100, height: 100, background: 'blue' }}
>   animate={{ x: 100 }}
>   transition={{ type: 'tween', duration: 3, ease: 'easeOut' }}
> />
> ```

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

> #### AI Annotation:
> motion value의 "파생 값"을 만드는 훅이다.
> 스프레드시트에서 셀 A1에 값을 넣고, B1에 `=A1*2` 수식을 거는 것과 같다 — 원본이 바뀌면 파생도 자동 갱신된다.
> transform 함수 방식은 자유로운 JS 연산이 가능하고, value mapping 방식은 입력 범위→출력 범위를 선언적으로 매핑한다.
> React state를 거치지 않으므로 리렌더가 발생하지 않는다.

> #### User Annotation:
> `useTransform`의 파생값은 `.set()` 하지 않는다. 원본 MotionValue만 `.set()`하면 파생값은 자동 계산된다.
>
> `useTransform`이 없으면 안 되는 핵심 이유: 원본 값이 **여러 곳에서 바뀔 때** 직접 계산 방식은 모든 변경 지점에서 파생값을 따로 관리해야 한다.
> ```tsx
> // useTransform 없이 직접 계산하면:
> // 1. 드래그 중 — 직접 계산
> pan.set(progress);
> scale.set(1 - progress * 0.2);
> borderRadius.set(progress * 48);
>
> // 2. snap-back — animate를 3개 따로 돌려야 함
> animate(pan, 0, ...);
> animate(scale, 1, ...);          // 따로
> animate(borderRadius, 0, ...);   // 따로
>
> // useTransform을 쓰면:
> const scale = useTransform(pan, [0, 1], [1, 0.8]);
> const borderRadius = useTransform(pan, [0, 1], [0, 48]);
> // pan만 바꾸면 나머지가 자동으로 따라온다.
> animate(pan, 0, ...);  // scale, borderRadius 자동 복귀
> ```
>
> 전체 데이터 흐름:
> ```
> pan.set() or animate(pan) → useTransform(pan → scale, borderRadius) → style={{ scale, borderRadius }} → DOM 반영
>        값 변경                       자동 계산                                   DOM 반영
> ```
>
> 연습 예제 — 드래그 방향에 따라 scale/borderRadius/color가 실시간 매핑:
> ```tsx
> const x = useMotionValue(0);
> const scale = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
> const borderRadius = useTransform(x, [-200, 0, 200], [48, 0, 48]);
> const background = useTransform(x, [-200, 0, 200], ['#ff0000', '#3366ff', '#00cc00']);
>
> return (
>   <motion.div
>     drag="x"
>     dragConstraints={{ left: 0, right: 0 }}
>     dragElastic={0.5}
>     style={{ width: 200, height: 200, background, scale, borderRadius, x, cursor: 'grab' }}
>   />
> );
> ```

### Reference
- https://motion.dev/docs/react-use-transform

---

## `useTransform`의 value mapping에서 input 범위가 반드시 단조증가/감소여야 하는 이유는?

### Official Answer
The input range must always be a series of increasing or decreasing numbers.

> #### AI Annotation:
> 보간 알고리즘이 "현재 입력이 어느 구간에 있는가"를 판단해야 하는데, `[-100, 100, 0]`처럼 정렬되지 않으면 구간이 모호해진다.
> 이 제약을 모르면 비정렬 input을 넣고 예상치 못한 보간 결과를 디버깅하게 된다.

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

> #### AI Annotation:
> 기본값은 `clamp: true`로, 입력이 범위를 벗어나면 출력이 범위 끝 값에서 멈춘다.
> 스크롤 기반 무한 회전이나 패럴랙스처럼 범위 밖에서도 비례 매핑이 필요한 패턴에서 `clamp: false`를 사용한다.

### Reference
- https://motion.dev/docs/react-use-transform
