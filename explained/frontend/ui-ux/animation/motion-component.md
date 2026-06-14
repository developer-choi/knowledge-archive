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
# Motion의 `AnimatePresence`란 무엇이며, 자식 컴포넌트의 퇴장을 감지하는 세 가지 경우는?

## 도입

React는 컴포넌트가 언마운트되면 DOM을 즉시 제거한다. `exit` 애니메이션을 실행할 여유가 없다. `AnimatePresence`는 이 동작을 가로채 exit 애니메이션이 끝날 때까지 DOM을 유지한다.

---
## 본문

> `AnimatePresence` makes exit animations easy. By wrapping one or more motion components with `AnimatePresence`, we gain access to the `exit` animation prop.

"`AnimatePresence`는 exit 애니메이션을 쉽게 만든다. `AnimatePresence`로 하나 이상의 motion 컴포넌트를 감싸면 `exit` 애니메이션 prop을 사용할 수 있다."

> `AnimatePresence` works by detecting when its direct children are removed from the React tree.

"`AnimatePresence`는 직접 자식이 React 트리에서 제거되는 것을 감지하는 방식으로 동작한다."

세 가지 감지 패턴:

**1. 조건부 렌더링 (show && \<Component />)**
```jsx
<AnimatePresence>
  {show && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

**2. key 변경 (슬라이더/탭 전환)**
```jsx
<AnimatePresence>
  <Slide key={activeItem.id} />
</AnimatePresence>
```

**3. 리스트 아이템 추가/제거**
```jsx
<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id} exit={{ opacity: 0 }} layout />
  ))}
</AnimatePresence>
```

- **direct children**: 직접 자식만 감지한다. 손자 컴포넌트의 마운트/언마운트는 추적하지 않는다.
- **unique key prop**: 각 직접 자식에 유일한 key가 있어야 `AnimatePresence`가 어떤 자식이 추가/제거됐는지 식별할 수 있다.

---
## 종합

React는 언마운트 = DOM 즉시 제거다. AnimatePresence는 "아직 제거하지 말고 exit 애니메이션 먼저 실행해"를 React에게 요청하는 프록시 역할이다. 세 감지 패턴 모두 "직접 자식이 React 트리에서 사라지는" 공통점이 있으며, key 변경은 React가 기존 컴포넌트를 파괴하고 새 컴포넌트를 생성하는 메커니즘을 이용한다.

---
# motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?

## 도입

`exit` prop을 설정했는데 애니메이션이 작동하지 않는 가장 흔한 실수가 있다. `AnimatePresence`의 위치와 대상 컴포넌트의 관계 설정이 핵심이다.

---
## 본문

> Owing to React limitations, the component being removed **must** be a **direct child** of `AnimatePresence` to enable this animation.

"React 한계로 인해, 제거되는 컴포넌트는 이 애니메이션을 활성화하기 위해 반드시 `AnimatePresence`의 직접 자식이어야 한다."

> Also make sure `AnimatePresence` is outside of the code that unmounts the element. If `AnimatePresence` itself unmounts, then it can't control exit animations!

"`AnimatePresence`가 요소를 언마운트하는 코드 바깥에 있는지 확인하라. `AnimatePresence` 자체가 언마운트되면 exit 애니메이션을 제어할 수 없다!"

```jsx
// 틀린 방법: AnimatePresence 자체가 조건부로 마운트됨
{isVisible && (
  <AnimatePresence>
    <Component />
  </AnimatePresence>
)}

// 올바른 방법: AnimatePresence는 항상 마운트된 상태
<AnimatePresence>
  {isVisible && <Component />}
</AnimatePresence>
```

- **direct child**: `AnimatePresence` → 중간 래퍼 → `motion.div` 구조는 동작하지 않는다. `AnimatePresence`의 바로 아래 자식이어야 한다.

---
## 종합

exit 애니메이션이 안 된다면 두 가지를 먼저 확인한다. 첫째, `AnimatePresence`가 조건부 렌더링 코드 바깥을 감싸고 있는가. 둘째, 애니메이션 대상 컴포넌트가 `AnimatePresence`의 직접 자식인가. 이 두 조건이 충족돼야 `exit` prop이 동작한다.

---
# AnimatePresence에서 단일 자식의 key만 바꾸면 슬라이드쇼/탭 전환 애니메이션을 만들 수 있다. 어떻게 동작하는가?

## 도입

React에서 key가 바뀌면 해당 컴포넌트는 업데이트가 아니라 파괴 후 재생성된다. 이 동작과 AnimatePresence를 결합하면 진입/퇴장 애니메이션이 자동으로 만들어진다.

---
## 본문

> Changing a key prop makes React create an entirely new component. So by changing the key of a single child of `AnimatePresence`, we can easily make components like slideshows.

"key prop을 변경하면 React가 완전히 새로운 컴포넌트를 생성한다. 따라서 `AnimatePresence`의 단일 자식의 key를 바꾸면 슬라이드쇼 같은 컴포넌트를 쉽게 만들 수 있다."

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

동작 원리:
1. `image.src`가 바뀌면 key가 바뀜
2. React: 기존 `<motion.img>` 파괴 + 새 `<motion.img>` 생성
3. AnimatePresence: 기존 이미지에 `exit`(왼쪽으로 퇴장) 적용하면서 DOM 유지
4. 새 이미지: `initial`(오른쪽에서 진입) → `animate`(제자리) 전환

---
## 종합

이 패턴의 핵심은 "key 변경 = 별개의 컴포넌트 인스턴스"라는 React 원칙이다. 이미지 슬라이더뿐 아니라 탭 전환, 스텝 폼 같은 "한 번에 하나만 보여주는" UI에서 key만 바꾸면 진입/퇴장 애니메이션이 자동으로 동작한다. 별도의 "전환 로직"을 구현하지 않아도 된다.

---
# AnimatePresence의 `mode` prop은 진입/퇴장 순서를 어떻게 제어하며, `"sync"`, `"wait"`, `"popLayout"` 각각 언제 쓰는가?

## 도입

여러 컴포넌트가 동시에 진입/퇴장할 때, 그 순서를 어떻게 조율할지가 중요하다. `AnimatePresence`의 `mode` prop이 이 순서를 제어한다.

---
## 본문

> `mode` decides how `AnimatePresence` handles entering and exiting children. Default: `"sync"`.

"`mode`는 `AnimatePresence`가 진입/퇴장하는 자식을 어떻게 처리할지 결정한다. 기본값: `"sync"`."

**sync** (기본값):
> In `"sync"` mode, elements animate in and out as soon as they're added/removed.

진입과 퇴장이 동시에 시작된다. 두 요소가 동시에 화면에 있을 수 있으므로 위치 충돌은 개발자가 `position: absolute` 등으로 직접 해결해야 한다.

**wait**:
> In `"wait"` mode, the entering element will wait until the exiting child has animated out, before it animates in. `wait` mode only supports one child at a time.

퇴장이 완전히 끝난 후 진입이 시작된다. 탭 전환, 스텝 폼 등 "한 번에 하나만 보여주는" UI에 적합하다. exit에 `easeIn`, enter에 `easeOut`을 쓰면 전체가 `easeInOut` 효과처럼 느껴진다.

**popLayout**:
> Exiting elements will be "popped" out of the page layout, allowing surrounding elements to immediately reflow. Pairs especially well with the `layout` prop, so elements can animate to their new layout.

```jsx
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.li layout exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

퇴장 요소가 레이아웃에서 즉시 빠져나와 나머지 요소가 바로 리플로우된다. 리스트에서 아이템 삭제 시 빈 자리가 즉시 채워지면서 퇴장 애니메이션도 동시 진행된다. `layout` prop과 함께 쓰면 리플로우 자체도 애니메이션된다.

---
## 종합

```
sync      → 진입/퇴장 동시, 겹칠 수 있음 (기본 동작, 위치 충돌 주의)
wait      → 퇴장 완료 후 진입, 순차적 (탭/스텝 전환에 적합)
popLayout → 퇴장 요소 즉시 레이아웃에서 제거, 나머지 리플로우 (리스트 삭제에 적합)
```

세 모드 중 어느 것을 쓸지는 "두 상태가 동시에 화면에 있어도 되는가"로 결정한다. 되면 `sync`, 안 되면 `wait`, 리스트 이동 효과도 필요하면 `popLayout`이다.

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
# motion의 `onPan`은 `drag` prop과 어떻게 다른가?

## 도입

`drag`는 요소를 실제로 이동시킨다. `onPan`은 이동은 하지 않고 이동 정보만 전달한다. 이 차이가 어떤 UX를 구현할 때 어떤 API를 선택할지를 결정한다.

---
## 본문

> Callback function that fires when the pan gesture is recognised on this element.

"이 요소에서 pan 제스처가 인식될 때 실행되는 콜백 함수."

```jsx
function onPan(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onPan={onPan} />
```

> Pan and drag events are provided the origin `PointerEvent` as well as an object `info` that contains `x` and `y` point values for the following:

"pan과 drag 이벤트는 원본 PointerEvent와 함께, 다음 항목들의 x·y 포인트 값을 포함하는 info 객체를 전달한다:"

- `point`: 디바이스나 페이지 기준의 절대 좌표
- `delta`: 마지막 이벤트 이후 이동한 거리 (매 프레임 미세한 이동량)
- `offset`: 시작점(origin)에서 누적된 총 이동 거리
- `velocity`: 현재 포인터의 속도

두 API 비교:

```
drag="y"  → 요소가 실제로 Y축으로 이동
onPan     → 요소는 제자리, 이동 정보(delta, offset, velocity)만 콜백으로 전달
```

`drag` 대신 `onPan`을 쓰는 경우: 위치 이동이 목적이 아니라 scale·opacity·borderRadius 같은 다른 값을 제어하는 커스텀 제스처에 적합하다.

```tsx
const handlePan = (_: PointerEvent, info: PanInfo) => {
  const progress = Math.max(0, Math.min(info.offset.y / 200, 1));
  pan.set(progress);
  dimOpacity.set(0.5 * (1 - progress));
};
```

---
## 종합

`drag`는 "요소를 끌어서 이동시키는" 표준 드래그 동작이고, `onPan`은 "손가락 움직임의 수치를 받아서 내가 원하는 대로 처리하는" 저수준 API다. 풀스크린 바텀시트에서 아래로 드래그할 때 scale과 borderRadius가 바뀌면서 닫히는 효과는 위치 이동이 아니라 값 매핑이므로 `onPan`이 적합하다.

---
# CSS에서 `height: auto`로의 transition이 불가능한 문제를 Motion은 어떻게 해결하는가?

## 도입

아코디언처럼 콘텐츠가 접혔다 펼쳐지는 UI에서 `height: 0` → `height: auto`로의 CSS transition이 필요하지만, CSS는 이를 지원하지 않는다. Motion은 이 문제를 내부적으로 해결한다.

---
## 본문

> It's also possible to animate `width` and `height` in to/out of `"auto"`.

"`width`와 `height`를 `"auto"` 값으로/에서 애니메이션할 수도 있다."

```jsx
<motion.div
  initial={{ height: 0 }}
  animate={{ height: "auto" }}
/>
```

> If animating `height: auto` while also animating `display` in to/out of `"none"`, replace this with `visibility` `"hidden"` as elements with `display: none` can't be measured.

"`display`를 `"none"`으로/에서 동시에 애니메이션한다면 `visibility: "hidden"`으로 대체하라. `display: none` 요소는 측정할 수 없기 때문이다."

- CSS의 `height: auto` 미지원 이유: `auto`는 콘텐츠 크기에 따라 계산되는 값으로, 보간(interpolate)할 숫자가 없다. CSS transition은 두 숫자 사이의 보간이 전제다.
- **Motion의 해결**: 실제 DOM을 렌더링해 `getBoundingClientRect()`로 높이를 측정한 뒤, 그 숫자 값으로 애니메이션한다.
- **display: none 제약**: 레이아웃에서 완전히 제거된 요소는 크기가 0이므로 측정이 불가능하다. `visibility: hidden`은 레이아웃 공간을 유지하므로 측정 가능.

---
## 종합

아코디언 구현 시 CSS만으로는 `height: 0 → height: auto` 전환이 불가능해서 흔히 `max-height`에 큰 값을 넣는 편법을 쓴다. Motion을 쓰면 `animate={{ height: "auto" }}` 한 줄로 해결된다. 단, 이 요소가 `display: none`으로 숨겨지는 패턴과 함께 쓸 때는 `visibility: hidden`으로 전환해야 한다는 제약을 기억해야 한다.

---
# Motion이 `transition`을 명시하지 않아도 자연스러운 애니메이션을 만드는 이유는?

## 도입

Motion은 애니메이션할 속성의 종류에 따라 적절한 transition 타입을 자동 선택한다. 위치·크기는 물리 기반, 색상·투명도는 시간 기반으로 기본값이 다르다.

---
## 본문

> By default, Motion will create appropriate transitions for snappy animations based on the type of value being animated.

"기본적으로 Motion은 애니메이션되는 값의 타입에 따라 스냅한 애니메이션을 위한 적절한 transition을 생성한다."

> For instance, physical properties like `x` or `scale` are animated with spring physics, whereas values like `opacity` or `color` are animated with duration-based easing curves.

"예를 들어 `x`나 `scale` 같은 물리적 속성은 spring physics로 애니메이션되는 반면, `opacity`나 `color`같은 값은 duration 기반 easing 커브로 애니메이션된다."

- **spring physics**: 스프링처럼 목표값에 가까워지는 물리 시뮬레이션. 드래그를 놓을 때의 속도를 이어받아 자연스러운 관성 복귀가 된다.
- **duration-based easing**: "정확히 N초 동안 A→B로" 예측 가능한 시간 기반 애니메이션. opacity, color처럼 물리적 의미가 없는 속성에 적합.

```
x, y, scale, rotate → spring (기본)
opacity, color, borderRadius → tween (기본)

transition: { type: 'tween' } → spring 기본값을 오버라이드
```

---
## 종합

`<motion.div animate={{ x: 100 }}`를 설정하면 spring이 자동 적용되므로 자연스러운 탄성 이동이 된다. `<motion.div animate={{ opacity: 1 }}`은 tween이 자동 적용되어 선형 페이드인이 된다. 프로젝트에서 `transition: { type: 'tween', duration: 0.3 }`을 명시하는 경우는 spring의 기본 동작(바운스)을 제거하고 예측 가능한 타이밍이 필요한 UI 전환일 때다.

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

---
# Motion의 motion value란 무엇이며, `useMotionValue` 훅으로 어떻게 생성하는가?

## 도입

motion value는 React state 바깥에서 동작하는 "애니메이션 전용 값 저장소"다. 값이 바뀌어도 리렌더가 발생하지 않고, Motion이 직접 DOM을 업데이트한다.

---
## 본문

> Motion values track the state and velocity of animated values.

"Motion value는 애니메이션 값의 상태와 속도를 추적한다."

- **state**: 현재 값. `x.get()`으로 읽는다.
- **velocity**: 값이 변화하는 속도. 드래그를 놓을 때의 속도가 spring animation에 전달되어 관성 효과를 만든다.

> They are composable, signal-like values that are performant because Motion can render them with its optimised DOM renderer.

"이들은 조합 가능한(composable) 시그널 같은 값으로, Motion이 최적화된 DOM 렌더러로 렌더링하기 때문에 성능이 좋다."

- **composable**: `useTransform`으로 하나의 motion value에서 다른 motion value를 파생시킬 수 있다.
- **signal-like**: Solid.js나 Vue 3의 signal/ref와 유사한 개념. 구독자(DOM, `useTransform`)에게 변경을 직접 알린다.

```jsx
import { motion, useMotionValue } from "motion/react"

export function MyComponent() {
  const x = useMotionValue(0)
  return <motion.div style={{ x }} />
}
```

- `useMotionValue(0)`: 초기값 0인 motion value 생성. `useState(0)`과 달리 값이 바뀌어도 컴포넌트를 리렌더하지 않는다.
- `style={{ x }}`: x 값을 DOM의 transform에 바인딩. x 값이 바뀌면 Motion이 React를 거치지 않고 DOM을 직접 업데이트한다.

---
## 종합

motion value의 역할은 `useState`와 같다 — 값을 저장하고 변경을 추적한다. 단 하나의 차이는 값이 바뀔 때 React 리렌더를 일으키냐 아니냐다. 여러 컴포넌트에서 공유해야 하거나 `useTransform`으로 파생값을 만들어야 할 때 `useMotionValue`로 명시적으로 생성한다. 단순 선언적 애니메이션(`animate={{ x: 100 }}`)에서는 Motion이 내부적으로 motion value를 자동 생성한다.

---
# motion value의 `set`과 `get` 메서드는 각각 어떤 역할이며, DOM 업데이트는 어떻게 처리되는가?

## 도입

motion value를 조작하는 두 가지 기본 메서드다. `set()`은 값을 바꾸고, `get()`은 값을 읽는다. DOM 업데이트 타이밍이 React state와 다르다.

---
## 본문

> Motion values can be updated with the set method.

"Motion value는 set 메서드로 업데이트할 수 있다."

```jsx
x.set(100)
```

> Changes to the motion value will update the DOM without triggering a React re-render. Motion values can be updated multiple times but renders will be batched to the next animation frame.

"motion value의 변경은 React 리렌더를 유발하지 않고 DOM을 업데이트한다. motion value는 여러 번 업데이트할 수 있지만 렌더링은 다음 animation frame으로 배치 처리된다."

- **batched to the next animation frame**: 한 프레임 안에 `x.set(1)`, `x.set(2)`, `x.set(3)`을 연속 호출해도 DOM 업데이트는 `requestAnimationFrame` 콜백에서 한 번만 일어난다. layout thrashing이 방지된다.

> A motion value can hold any string or number. We can read it with the get method.

"motion value는 어떤 문자열이나 숫자도 담을 수 있다. get 메서드로 읽을 수 있다."

```jsx
x.get() // 100
```

- **get()**: 현재 값을 동기적으로 반환한다. 이벤트 핸들러에서 현재 값을 조건 검사할 때 사용한다.

---
## 종합

`onDragEnd`에서 `if (y.get() > 150)` 같은 조건으로 드래그 종료 동작을 분기하는 패턴이 대표적인 `get()` 사용 사례다. `set()`은 드래그 중 `pan.set(progress)` 같이 매 프레임 호출되지만 DOM에는 배치로 한 번만 반영된다.

---
# motion value에서 `set()`과 `jump()`의 차이는 무엇인가?

## 도입

두 메서드 모두 값을 바꾸지만, 물리 상태(속도, 연결된 스프링)를 유지하냐 리셋하냐가 다르다.

---
## 본문

> `jump()` jumps the motion value to a new state in a way that breaks continuity from previous values:
> - Resets velocity to 0.
> - Ends active animations.
> - Ignores attached effects (for instance `useSpring`'s spring).

"`jump()`는 이전 값과의 연속성을 끊는 방식으로 motion value를 새 상태로 점프시킨다: 속도를 0으로 리셋하고, 활성 애니메이션을 종료하고, 연결된 effect(`useSpring`의 spring 등)를 무시한다."

```jsx
const x = useSpring(0)
x.jump(10)
x.getVelocity() // 0
```

- **`set()`**: 값을 바꾸되 물리 상태 유지. `useSpring`으로 연결된 값에 `set()`을 호출하면 스프링이 따라오며 바운스된다.
- **`jump()`**: 순간이동. 속도 0으로 리셋, 진행 중 애니메이션 종료, 연결된 스프링 무시.

```
set() → 연속성 유지 (스프링 따라옴, 속도 누적)
jump() → 연속성 차단 (순간이동, 속도 0, 스프링 무시)
```

---
## 종합

모달이나 화면 전환 시 이전 애니메이션 상태를 깨끗이 초기화하고 싶을 때 `jump()`를 쓴다. `set(0)`으로 원위치를 시도하면 현재 속도가 있는 상태에서 스프링이 바운스하며 복귀하지만, `jump(0)`은 즉시 0으로 이동하고 모든 물리 상태를 리셋한다. 화면 전환 시 남은 애니메이션이 다음 화면으로 이어지는 버그를 방지할 때 사용한다.

---
# React 컴포넌트 안에서 motion value의 이벤트를 구독하려면 어떻게 해야 하며, `on()` 메서드를 직접 쓸 때 주의할 점은?

## 도입

motion value의 변화에 반응해 사이드 이펙트를 실행해야 할 때가 있다. `on()` 메서드와 `useMotionValueEvent` 훅 중 어느 것을 쓰느냐에 따라 메모리 누수 위험이 달라진다.

---
## 본문

> Listeners can be added to motion values via the `on` method or the `useMotionValueEvent` hook.

"Listener는 `on` 메서드나 `useMotionValueEvent` 훅을 통해 motion value에 추가할 수 있다."

```jsx
useMotionValueEvent(x, "change", (latest) => console.log(latest))
```

> Available events are `"change"`, `"animationStart"`, `"animationComplete"`, `"animationCancel"`.

> It returns a function that, when called, will unsubscribe the listener.

```jsx
const unsubscribe = x.on("change", latest => console.log(latest))
```

> When calling `on` inside a React component, it should be wrapped with a `useEffect` hook, or instead use the `useMotionValueEvent` hook.

"React 컴포넌트 안에서 `on()`을 호출할 때는 `useEffect` 훅으로 감싸거나, 대신 `useMotionValueEvent` 훅을 사용해야 한다."

- **`on()` 직접 사용의 위험**: 컴포넌트 본문에서 `on()`을 호출하면 매 렌더마다 새 리스너가 추가된다. 이전 리스너는 제거되지 않아 메모리 누수와 중복 실행이 발생한다.
- **`useEffect`로 감싸기**: `useEffect`의 cleanup 함수에서 `unsubscribe()`를 호출해 컴포넌트 언마운트 시 리스너를 제거한다.
- **`useMotionValueEvent`**: cleanup을 자동 처리. 컴포넌트 안에서 motion value 이벤트를 구독할 때 가장 안전한 방법이다.

---
## 종합

`useMotionValueEvent`는 "React 컴포넌트 안에서 motion value 이벤트를 안전하게 구독"하는 도구다. 내부적으로 `useEffect` + `on()` + cleanup의 패턴을 캡슐화한다. `useEffect` 없이 `on()`을 쓰면 렌더 횟수만큼 리스너가 쌓이는 버그가 발생한다.

---
# Motion의 `useTransform` 훅이란 무엇이며, 어떤 두 가지 방식으로 사용하는가?

## 도입

하나의 motion value에서 다른 motion value를 파생시키는 훅이다. 스프레드시트의 수식 셀처럼, 원본이 바뀌면 파생도 자동 갱신된다.

---
## 본문

> `useTransform` creates a new motion value that transforms the output of one or more motion values.

"`useTransform`은 하나 이상의 motion value의 출력을 변환하는 새 motion value를 생성한다."

두 가지 사용 방식:

**1. Transform function (자유 연산)**
```jsx
const x = useMotionValue(1)
const y = useMotionValue(1)

const z = useTransform(() => x.get() + y.get()) // z.get() === 2
const doubledX = useTransform(() => x.get() * 2)
```

**2. Value mapping (범위 선언적 매핑)**
```jsx
const color = useTransform(x, [0, 100], ["#f00", "#00f"])
// x가 0이면 "#f00", 50이면 중간색, 100이면 "#00f"
```

- **transform function**: JS 표현식으로 자유롭게 계산. 여러 motion value를 조합할 수 있다.
- **value mapping**: `[input range] → [output range]` 선언적 매핑. 드래그 진행도(0~1)를 scale(1~0.8)이나 색상으로 매핑하는 데 적합하다.

실무 패턴:
```tsx
const pan = useMotionValue(0);
const scale = useTransform(pan, [0, 1], [1, 0.8]);
const borderRadius = useTransform(pan, [0, 1], [0, 48]);

// pan만 바꾸면 scale과 borderRadius가 자동 갱신
animate(pan, 0, { type: 'spring', stiffness: 400, damping: 40 });
// scale과 borderRadius도 자동 복귀
```

---
## 종합

`useTransform`의 파생값은 `.set()`하지 않는다. 원본 motion value만 `.set()`하거나 `animate()`하면 파생값이 자동 계산된다. `useTransform` 없이 직접 계산하면 값이 바뀌는 모든 지점(드래그 중, snap-back, 애니메이션 중)에서 파생값도 따로 업데이트해야 하지만, `useTransform`을 쓰면 원본 하나만 관리하면 된다.

---
# `useTransform`의 value mapping에서 input 범위가 반드시 단조증가/감소여야 하는 이유는?

## 도입

`useTransform`의 value mapping에서 input 배열의 정렬 규칙이 있다. 이를 모르면 예상치 못한 보간 결과를 디버깅하게 된다.

---
## 본문

> The input range must always be a series of increasing or decreasing numbers.

"input 범위는 항상 증가하거나 감소하는 숫자의 연속이어야 한다."

- **단조증가/감소**: `[0, 50, 100]` (증가) 또는 `[100, 50, 0]` (감소)는 가능하지만, `[-100, 100, 0]`처럼 오름/내림이 섞이면 불가능하다.
- **이유**: 보간 알고리즘이 "현재 입력이 어느 구간에 있는가"를 이진 탐색으로 찾는다. 비정렬 input이면 구간 결정이 모호해진다.

---
## 종합

드래그 좌우 양방향에 반응하는 매핑이 필요하면 `[-200, 0, 200]`처럼 단조증가로 정렬하면 된다. `[-200, 0, 200] → [0.5, 1, 0.5]`로 설정하면 중앙에서 scale 1, 양끝에서 0.5가 되는 대칭 매핑을 만들 수 있다.

---
# `useTransform`의 value mapping에서 입력이 범위를 벗어나면 출력은 어떻게 되며, 이를 해제하려면?

## 도입

드래그를 정해진 범위 밖으로 끌거나 스크롤이 입력 범위를 벗어나면 출력은 어떻게 되는지, 그리고 이 기본 동작을 어떻게 바꿀 수 있는지가 이 질문의 핵심이다.

---
## 본문

> By setting `clamp: false`, the ranges will map perpetually.

"`clamp: false`를 설정하면 범위가 영속적으로 매핑된다."

```jsx
const { scrollY } = useScroll()
const rotate = useTransform(
  scrollY,
  [0, 100],
  [0, 360],
  { clamp: false }
)
```

- **clamp: true** (기본값): 입력이 범위를 벗어나면 출력이 범위 끝 값에서 멈춘다. `scrollY`가 200이 되어도 `rotate`는 360도에서 고정.
- **clamp: false**: 범위 밖에서도 비례 매핑이 계속된다. `scrollY`가 200이면 `rotate`는 720도. 스크롤 기반 무한 회전이나 패럴랙스 효과에 사용.

---
## 종합

드래그 범위를 제한할 때(`dragConstraints`)는 `clamp: true`가 적합하고, 스크롤이나 회전처럼 "범위 이후에도 비례적으로 계속되어야 하는" 효과에는 `clamp: false`가 필요하다. 기본값이 `clamp: true`이므로 대부분의 경우 명시하지 않아도 되고, 무한 매핑이 필요할 때만 `{ clamp: false }`를 추가한다.

---
# Radix UI 컴포넌트에 Motion의 exit 애니메이션을 적용하려면 어떤 설정이 필요한가?

## 도입

Radix UI는 자체적으로 DOM과 상태를 관리한다. Motion의 exit 애니메이션이 동작하려면 이 제어권을 개발자 측으로 가져와야 한다.

---
## 본문

> Most Radix components render and control their own DOM elements. But they also provide the `asChild` prop that, when set to true, will make the component use the first provided child as its DOM node instead.

"대부분의 Radix 컴포넌트는 자체 DOM 요소를 렌더링하고 제어한다. 하지만 `asChild` prop을 true로 설정하면 제공된 첫 번째 자식을 DOM 노드로 대신 사용한다."

```jsx
<Toast.Root asChild>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    layout
  />
</Toast.Root>
```

- **asChild**: Radix가 자체 DOM 대신 motion 컴포넌트를 사용하게 한다. Radix의 접근성 속성과 Motion의 애니메이션을 함께 적용할 수 있다.

exit 애니메이션(예: Tooltip)의 3단계 설정:

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

1. **`asChild`로 motion 컴포넌트 주입**: Radix가 자체 DOM 대신 motion 컴포넌트를 사용
2. **상태 끌어올리기** (`open`/`onOpenChange`): Radix 내부 상태를 외부로 노출해 조건부 렌더링 가능
3. **`forceMount`**: Radix Portal이 자체적으로 자식을 언마운트하는 것을 막아 AnimatePresence가 exit 타이밍 제어

---
## 종합

Radix + Motion 통합의 핵심 충돌은 "누가 언마운트 타이밍을 제어하는가"다. 기본적으로 Radix가 제어하는데, AnimatePresence가 exit 애니메이션을 위해 언마운트를 지연시키려면 이 제어권을 가져와야 한다. `open`/`onOpenChange`로 상태를 끌어올리고, `forceMount`로 Radix의 자체 언마운트를 막고, `{isOpen && ...}`으로 AnimatePresence가 타이밍을 제어하는 구조가 이 충돌의 해법이다.

---
# Motion의 `transition`이란 무엇이며, 어디에 설정할 수 있는가?

## 도입

두 상태 사이를 어떻게 전환할지를 정의하는 것이 `transition`이다. 어디에 설정하느냐에 따라 적용 범위가 달라진다.

---
## 본문

> A transition defines the type of animation used when animating between two values.

"transition은 두 값 사이를 애니메이션할 때 사용하는 애니메이션 타입을 정의한다."

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

> `transition` can be set on any animation prop, and that transition will be used when the animation fires.

"transition은 모든 애니메이션 prop에 설정할 수 있으며, 해당 애니메이션 발동 시 사용된다."

```jsx
<motion.div
  whileHover={{
    scale: 1.1,
    transition: { duration: 0.2 }
  }}
/>
```

설정 가능한 3곳:

1. **컴포넌트 `transition` prop**: 해당 컴포넌트의 모든 애니메이션에 기본 적용
2. **개별 애니메이션 prop 안** (`whileHover`, `whileTap`, `exit` 등 안에 `transition` 중첩): 해당 제스처/상태에서만 적용, 컴포넌트 레벨 transition을 오버라이드
3. **`animate()` 함수의 세 번째 인자**: 명령형 애니메이션에서 사용

---
## 종합

`whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}`처럼 개별 prop 안에 transition을 넣으면 hover 시에만 0.2초가 적용되고, 다른 애니메이션(예: `animate`, `exit`)에는 영향을 주지 않는다. 컴포넌트 전체의 기본 transition을 설정하되 특정 제스처만 다르게 하고 싶을 때 이 중첩 패턴을 쓴다.

---
# Motion의 애니메이션 타입 tween, spring, inertia는 각각 어떤 방식인가?

## 도입

Motion은 세 가지 애니메이션 타입을 제공한다. 각각 언제, 왜 쓰는지를 이해하면 상황에 맞는 타입을 선택할 수 있다.

---
## 본문

> `type` decides the type of animation to use. It can be `"tween"`, `"spring"` or `"inertia"`.

"`type`은 사용할 애니메이션 타입을 결정한다. `"tween"`, `"spring"`, `"inertia"` 중 하나일 수 있다."

> Tween animations are set with a duration and an easing curve.

"Tween 애니메이션은 duration과 easing 커브로 설정된다."

> Spring animations are either physics-based or duration-based.

"Spring 애니메이션은 물리 기반 또는 duration 기반이다."

> Inertia animations decelerate a value based on its initial velocity, usually used to implement inertial scrolling.

"Inertia 애니메이션은 초기 속도에 기반해 값을 감속시키며, 주로 관성 스크롤 구현에 사용된다."

```jsx
<motion.path
  animate={{ pathLength: 1 }}
  transition={{ duration: 2, type: "tween" }}
/>
```

세 타입 비교:
```
tween   → "3초 동안 A→B로 가라" (시간 보장, CSS transition과 동일 개념)
spring  → "스프링으로 A→B로 가라" (물리 시뮬레이션, 끝 시간 불확정)
inertia → "현재 속도로 미끄러지다 멈춰라" (목표값 없음, 관성으로 감속)
```

- **tween**: 예측 가능한 타이밍. 버튼 색상 변화, UI 진입/전환에 적합.
- **spring**: 자연스러운 물리 느낌. 드래그 snap-back, 튕기는 버튼에 적합. 속도를 이어받으므로 제스처 연속성이 있다.
- **inertia**: 드래그를 놓은 뒤 관성으로 미끄러지는 동작. `dragTransition`에서 기본 사용된다.

---
## 종합

`transition`을 명시하지 않으면 Motion이 속성 타입에 따라 자동 선택한다(`x`/`scale` → spring, `opacity`/`color` → tween). 명시적으로 `type`을 설정하는 경우는 기본값을 오버라이드해야 할 때다. 열기/닫기 전환에 spring 기본값이 적용되면 바운스가 생겨 UI가 불안정해 보이므로 `type: 'tween'`으로 고정하고, 드래그 snap-back은 제스처 속도를 이어받아야 자연스러우므로 spring을 유지한다.

---
# spring의 물리 기반(stiffness/damping/mass)과 duration 기반(duration/bounce)의 차이는?

## 도입

spring 타입은 두 가지 설정 방식을 제공한다. 물리 파라미터로 직접 제어하는 방식과, duration·bounce라는 직관적 파라미터로 설정하는 방식이다.

---
## 본문

> Physics-based spring animations are set via `stiffness`, `damping` and `mass`, and these incorporate the velocity of any existing gestures or animations for natural feedback.

"물리 기반 spring 애니메이션은 `stiffness`, `damping`, `mass`로 설정되며, 자연스러운 피드백을 위해 기존 제스처나 애니메이션의 속도를 반영한다."

- **stiffness**: 스프링의 강도. 높을수록 빠르고 강하게 목표값으로 당긴다.
- **damping**: 감쇠 계수. 낮을수록 바운스가 많고, 높을수록 즉시 멈춘다.
- **mass**: 물체의 질량. 높을수록 무겁게 느껴지고 반응이 느리다.
- **incorporates velocity**: 드래그를 빠르게 놓으면 그 속도가 spring에 전달되어 더 빠르게 튀어나갔다가 복귀한다.

> Duration-based spring animations are set via a `duration` and `bounce`. These don't incorporate velocity but are easier to understand.

"Duration 기반 spring 애니메이션은 `duration`과 `bounce`로 설정된다. 속도를 반영하지 않지만 이해하기 더 쉽다."

- **duration**: "몇 초 동안" 애니메이션할지 직접 지정.
- **bounce**: 0(바운스 없음)~1(최대 바운스). `stiffness`/`damping`을 몰라도 직관적으로 설정 가능.

---
## 종합

드래그 snap-back처럼 손에서 놓는 속도가 애니메이션에 반영되어야 하면 물리 기반(stiffness/damping)이 적합하다. 단순 진입 애니메이션처럼 일정한 느낌이 필요하고 duration 조정이 필요하면 duration 기반(`duration: 0.5, bounce: 0.3`)이 더 직관적이다.

---
# `inertia` 애니메이션은 어떻게 동작하며, 주요 설정 옵션은 무엇인가?

## 도입

inertia는 다른 타입과 근본적으로 다르다. 목표값을 지정하지 않고, 현재 속도에서 자연스럽게 감속하여 멈추는 방식이다. 드래그를 놓은 뒤의 관성 스크롤이 대표적이다.

---
## 본문

> An animation that decelerates a value based on its initial velocity. Optionally, `min` and `max` boundaries can be defined, and inertia will snap to these with a spring animation.

"초기 속도에 기반해 값을 감속시키는 애니메이션. 선택적으로 `min`과 `max` 경계를 정의할 수 있으며, inertia는 spring 애니메이션으로 이 경계에 스냅된다."

- **initial velocity**: 드래그를 놓는 순간의 포인터 속도가 inertia의 시작점. 빠르게 놓으면 더 멀리 미끄러진다.
- **min/max**: "벽"처럼 동작. 값이 경계에 부딪히면 bounce spring이 발동한다.

```jsx
// snap-to-grid: 50px 단위로 정렬
dragTransition={{ modifyTarget: target => Math.round(target / 50) * 50 }}
```

주요 옵션:
- `power` (기본: 0.8): 높을수록 더 멀리 미끄러진다.
- `timeConstant` (기본: 700): 감속 시간 상수. 높을수록 오래 미끄러진다.
- `modifyTarget`: 자동 계산된 정지 위치를 가로채 수정. snap-to-grid에 사용.
- `bounceStiffness` (기본: 500): 경계 충돌 시 bounce spring의 강도.
- `bounceDamping` (기본: 10): 경계 충돌 시 감쇠. 0이면 무한 진동.

---
## 종합

`drag` prop과 함께 쓰는 `dragTransition`이 바로 inertia 애니메이션의 주요 사용처다. 드래그를 놓으면 기본적으로 inertia가 적용되어 손을 뗀 속도로 미끄러지다 멈춘다. `modifyTarget`으로 이 정지 위치를 50px 그리드에 맞추면 snap-to-grid가 된다. tween처럼 목표값을 미리 알 수 없고, 사용자의 제스처 속도에 따라 결과가 달라지는 것이 inertia의 핵심 특성이다.
