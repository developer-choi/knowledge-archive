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
