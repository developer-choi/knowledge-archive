# Motion의 `<motion />` 컴포넌트란 무엇인가?

## 도입

Framer Motion(현 Motion)은 React용 애니메이션 라이브러리다. 핵심은 `<motion.div>`, `<motion.span>` 같은 motion 컴포넌트인데, 이것은 기존 HTML 요소를 그대로 대체하면서 애니메이션 API를 추가로 제공한다.

---
## 본문

> There's a `motion` component for every HTML and SVG element, for instance `motion.div`, `motion.circle` etc. It extends standard React components with animation props that run at up to 120fps - without triggering React re-renders.

"모든 HTML과 SVG 요소에 대응하는 `motion` 컴포넌트가 있다. 예를 들어 `motion.div`, `motion.circle` 등. 이것은 표준 React 컴포넌트를 최대 120fps로 실행되는 애니메이션 prop으로 확장하며, React 리렌더를 유발하지 않는다."

- **extends standard React components**: `<div>`를 그대로 대체할 수 있다. 기존 `className`, `style`, 이벤트 핸들러가 모두 그대로 동작한다.
- **without triggering React re-renders**: 애니메이션 값이 바뀌어도 React 렌더 사이클을 거치지 않고 DOM을 직접 업데이트한다. 매 프레임마다 setState를 호출하는 것과 근본적으로 다르다.

> You can use a `motion` component exactly as you would any normal HTML/SVG component. But you also gain access to powerful animation APIs like the `animate`, `layout`, `whileInView` props.

"motion 컴포넌트는 일반 HTML/SVG 컴포넌트처럼 사용할 수 있다. 하지만 `animate`, `layout`, `whileInView` prop 같은 강력한 애니메이션 API에도 접근할 수 있다."

```jsx
<motion.div
  className="box"
  animate={{ scale: 2 }}         // 값이 바뀌면 자동 애니메이션
  whileInView={{ opacity: 1 }}   // 뷰포트에 진입할 때
  layout                         // 레이아웃 변화 시 FLIP 애니메이션
  style={{ x: 100 }}            // transform을 독립 속성으로 제어
/>
```

- **animate**: 선언적 상태 지정. `animate={{ scale: 2 }}`는 "이 요소는 2배 크기여야 한다"고 선언하면 Motion이 현재 상태에서 자동으로 보간한다.
- **layout**: React 리렌더 후 레이아웃이 변경됐을 때 FLIP 기법으로 자동 애니메이션.
- **whileInView**: Intersection Observer 기반으로 뷰포트 진입 시 애니메이션 상태를 적용한다.

---
## 종합

"선언적 API"가 핵심이다. "어떻게 애니메이션할지"가 아니라 "어떤 상태가 되어야 하는지"만 기술하면 Motion이 나머지를 처리한다. `<div>`를 `<motion.div>`로 바꾸기만 하면 애니메이션 기능이 추가되므로, 기존 코드베이스에 점진적으로 도입하기 쉽다.

---
# motion 컴포넌트의 애니메이션이 React 리렌더를 유발하지 않는 이유는?

## 도입

일반적으로 React에서 UI를 업데이트하려면 state를 바꿔서 리렌더를 트리거해야 한다. Motion은 이 경로를 우회한다.

---
## 본문

> `motion` components bypass React's render cycle entirely. Animated values update on every frame via the browser's native animation pipeline, so even complex animations with dozens of animated properties won't cause React re-renders or style/layout thrashing.

"motion 컴포넌트는 React 렌더 사이클을 완전히 우회한다. 애니메이션 값은 브라우저의 네이티브 애니메이션 파이프라인을 통해 매 프레임마다 업데이트되므로, 수십 개의 애니메이션 속성을 가진 복잡한 애니메이션도 React 리렌더나 style/layout thrashing을 일으키지 않는다."

- **bypass React's render cycle**: `setState` 없이 DOM을 직접 조작하는 방식. Motion이 내부적으로 `requestAnimationFrame`을 사용해 매 프레임 DOM 스타일을 직접 설정한다.
- **style/layout thrashing**: JS로 DOM 읽기와 쓰기를 번갈아 반복할 때 발생하는 Layout 재계산 폭발. Motion은 배치(batch) 처리로 이를 방지한다.

> Using motion values instead of React state to update `style` will also avoid re-renders.

"`style`을 업데이트하는 데 React state 대신 motion value를 사용하면 리렌더도 방지된다."

```jsx
const x = useMotionValue(0)

useEffect(() => {
  const timeout = setTimeout(() => x.set(100), 1000)
  return () => clearTimeout(timeout)
}, [])

return <motion.div style={{ x }} />
```

- **useMotionValue**: React state 바깥에서 동작하는 애니메이션 전용 값 저장소. `x.set(100)`을 호출해도 컴포넌트가 리렌더되지 않는다.

```
React state 방식:
setState(newValue) → 리렌더 → React reconciliation → DOM 업데이트
(매 프레임 60회 리렌더 발생)

Motion 방식:
x.set(newValue) → Motion DOM renderer → DOM 업데이트
(React 건너뜀, 리렌더 0회)
```

---
## 종합

드래그 중 `pan`, `scale`, `opacity` 값이 매 프레임 바뀌는 시나리오를 생각해보면, `useState`로 구현하면 60fps 기준 초당 60번 리렌더가 발생한다. Motion의 motion value를 쓰면 React 렌더 사이클이 전혀 일어나지 않는다. 이것이 부드러운 60fps(혹은 120fps) 애니메이션을 위해 `useMotionValue`를 `useState` 대신 쓰는 이유다.

---
# motion 컴포넌트의 style prop은 일반 React의 style과 어떻게 다른가?

## 도입

React의 `style` prop은 CSS에서 지원하는 속성만 사용할 수 있다. Motion의 `style`은 여기에 더해 transform을 독립 속성으로 분리하고, motion value를 직접 전달할 수 있다.

---
## 본문

> Style now supports independent transforms:

"이제 style은 독립적인 transform을 지원한다:"

```jsx
<motion.div style={{ x: 100 }} />
```

일반 CSS에서는 `transform: translateX(100px) rotate(45deg)`처럼 하나의 문자열로 합성해야 한다. motion의 `style`에서는 `x`, `y`, `rotate`, `scale`, `scaleX`, `scaleY` 같은 transform 속성을 독립적으로 제어할 수 있다.

```jsx
// CSS 방식: 두 transform을 동시에 애니메이션하기 복잡
style={{ transform: `translateX(${x}px) rotate(${rotate}deg)` }}

// Motion 방식: 각각 독립적으로 제어
style={{ x, rotate }}
```

또한 `useMotionValue`로 생성한 motion value를 style에 직접 전달하면 값이 바뀔 때 리렌더 없이 DOM이 업데이트된다.

```
drag="y" ──.set()──→ y (MotionValue) ──style={{ y }}──→ DOM
```

- `drag="y"`: 드래그 시 y MotionValue에 `.set()` 호출
- `style={{ y }}`: y 값을 DOM에 바인딩 (단방향 파이프라인)
- `style={{ y }}`가 없으면 Motion이 내부적으로 값을 관리하고 외부에서 접근 불가

---
## 종합

`style={{ y }}`는 MotionValue를 DOM에 바인딩하는 것이다. `drag="y"`가 드래그 중 y 값을 업데이트하고, 이 값이 자동으로 DOM 스타일에 반영된다. `onDragEnd`에서 `y.get()`으로 현재 위치를 읽고 임계값에 따라 `animate(y, 0, ...)`으로 snap-back을 실행할 수 있다.

---
# SSR 환경에서 motion 컴포넌트의 진입 애니메이션 깜빡임을 방지하려면?

## 도입

서버 사이드 렌더링(SSR)에서 `initial={{ opacity: 0 }}`을 설정하면, 서버는 HTML을 opacity 0으로 출력하지만 클라이언트 hydration 시 잠깐 원래 상태로 보였다가 애니메이션이 시작되는 깜빡임(flash)이 발생할 수 있다.

---
## 본문

> `motion` components are fully compatible with server-side rendering, meaning the initial state of the component will be reflected in the server-generated output.

"motion 컴포넌트는 서버사이드 렌더링과 완전히 호환된다. 즉, 컴포넌트의 초기 상태가 서버에서 생성된 출력에 반영된다."

```jsx
// Server will output `translateX(100px)`
<motion.div initial={false} animate={{ x: 100 }} />
```

- **`initial={false}`**: 진입 애니메이션을 건너뛰고 `animate` 값을 초기 상태로 사용한다. 서버에서 이미 `translateX(100px)`가 적용된 HTML이 나오므로 hydration 후 깜빡임이 없다.
- **initial state reflected in server-generated output**: `initial={{ opacity: 0 }}`이 있으면 서버 HTML에도 `opacity: 0`이 적용된다. SSR에서 hydration 불일치(mismatch) 경고 없이 일관된 상태로 시작된다.

---
## 종합

Next.js 같은 SSR 환경에서 화면이 로드되는 동안 콘텐츠가 보였다 사라졌다 하는 깜빡임은 `initial`과 hydration 타이밍 불일치가 원인인 경우가 많다. 이미 최종 상태로 렌더링되어야 하는 요소(위치가 확정된 UI)에는 `initial={false}`를, 진입 애니메이션이 필요한 요소에는 서버와 일치하는 `initial` 값을 주는 것이 올바른 설정이다.

---
# `initial`, `animate`, `exit`은 motion 컴포넌트의 생애주기에서 각각 어떤 시점에 적용되는가?

## 도입

motion 컴포넌트는 React 컴포넌트의 생애주기(마운트 → 업데이트 → 언마운트)에 대응하는 세 가지 애니메이션 상태를 가진다.

---
## 본문

> `initial` — The initial visual state of the `motion` component.

"`initial` — motion 컴포넌트의 초기 시각 상태."

> `animate` — A target to animate to on enter, and on update.

"`animate` — 진입 시, 그리고 업데이트 시 애니메이션할 목표 상태."

> `exit` — A target to animate to when a component is removed from the tree. Can be set either as an animation target, or variant.

"`exit` — 컴포넌트가 트리에서 제거될 때 애니메이션할 목표 상태. 애니메이션 타겟 또는 variant로 설정할 수 있다."

```
컴포넌트 마운트:  initial 상태 → animate 상태로 전환
animate 값 변경:  이전 animate 상태 → 새 animate 상태로 전환
컴포넌트 언마운트: animate 상태 → exit 상태로 전환 → DOM 제거
```

- **initial**: 마운트 직후 초기 상태. `initial={{ opacity: 0, y: -20 }}`이면 처음에 투명하고 위에 있다가 `animate`로 이동한다.
- **animate**: 마운트 완료 후 도달할 상태이자, 이후 변경의 기준점. `animate` 값이 바뀌면 자동으로 이전 값에서 새 값으로 전환된다.
- **exit**: `AnimatePresence`로 감싸야 동작. React는 기본적으로 언마운트 시 DOM을 즉시 제거하는데, `exit`이 있으면 Motion이 DOM 제거를 지연시키고 exit 애니메이션을 먼저 실행한다.

---
## 종합

fade-in 진입 + fade-out 퇴장의 기본 패턴:

```jsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

`isVisible`이 false가 되면 React는 즉시 DOM에서 제거하려 하지만, `AnimatePresence`가 이를 가로채 `exit={{ opacity: 0 }}`으로 fade-out이 끝날 때까지 DOM 유지를 보장한다.

---
# motion의 `variants`란 무엇이며 어떤 이점이 있는가?

## 도입

애니메이션 상태를 컴포넌트에 직접 인라인으로 적는 대신, 이름을 붙여 분리하고 재사용할 수 있다. 또한 부모의 variant가 자식에게 전파되어 orchestration이 가능해진다.

---
## 본문

```jsx
const variants = {
  active: { backgroundColor: "#f00" },
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

> Variants will flow down through `motion` components.

"Variant는 motion 컴포넌트를 통해 아래로 흐른다."

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

- **variants**: CSS 클래스처럼 애니메이션 상태를 이름으로 분리·재사용할 수 있는 객체.
- **flow down**: 부모 `<motion.ul>`에서 `whileInView="visible"`을 선언하면, 자식 `<motion.li>`에 별도로 prop을 전달하지 않아도 동일한 variant 이름으로 자신의 variants를 실행한다.
- **orchestration**: 부모 variant에 `staggerChildren`, `delayChildren` 옵션을 추가하면 자식들이 순차적으로 또는 간격을 두고 애니메이션된다.

---
## 종합

variants가 없으면 같은 애니메이션 상태를 여러 컴포넌트에 중복해서 적어야 하고, 상태가 바뀌면 모두 찾아서 수정해야 한다. variants를 쓰면 상태를 한 곳에서 정의하고 이름으로 참조한다. 부모 variant가 자식에게 전파되는 특성 덕분에 리스트 아이템이 하나씩 순차적으로 나타나는 stagger 효과를 부모에서만 설정으로 만들 수 있다.

---
# motion의 `while-` gesture props는 제스처가 끝나면 어떻게 되는가?

## 도입

`whileHover`, `whileTap`, `whileDrag`, `whileInView` 같은 `while-` props는 제스처가 활성화된 동안에만 특정 상태를 적용한다. 제스처가 끝나면 어떻게 되는지가 핵심이다.

---
## 본문

> When a gesture starts, it animates to the values defined in `while-`, and then when the gesture ends it animates back to the values in `initial` or `animate`.

"제스처가 시작되면 `while-`에 정의된 값으로 애니메이션되고, 제스처가 끝나면 `initial` 또는 `animate`의 값으로 다시 애니메이션된다."

```jsx
<motion.button
  initial={{ opacity: 0 }}
  whileHover={{ backgroundColor: "rgba(220, 220, 220, 1)" }}
  whileTap={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
  whileInView={{ opacity: 1 }}
/>
```

- **animates back**: 별도의 "제스처 종료 핸들러"나 "복귀 애니메이션"을 작성하지 않아도 된다. Motion이 자동으로 `initial`/`animate` 상태로 되돌아간다.
- **initial or animate**: `animate` prop이 있으면 `animate` 값으로, 없으면 `initial` 값으로 복귀한다.

---
## 종합

`while-` props는 CSS pseudo-class(`:hover`, `:active`)와 비슷하지만 Motion의 애니메이션 파이프라인을 통한다. CSS `:hover`는 순간 전환이지만, `whileHover`는 `transition` 설정대로 부드럽게 전환된다. 복귀 애니메이션을 따로 작성하지 않아도 되므로 코드가 간결해진다.
