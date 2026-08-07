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
