---
tags: [react, performance, principle]
source: official
publishable: false
priority:
---
# Questions

- `motion.div`에 `layout` prop을 추가하면 어떤 동작이 활성화되는가?
  - layout animation이 감지하는 레이아웃 변화는 어떤 조건에서 발생해야 하는가? JavaScript로 DOM을 직접 조작하면 동작하는가?
- `justify-content`처럼 CSS transition으로 원래 애니메이션할 수 없는 값이, `layout` prop이 있으면 부드럽게 전환되는 이유는?
- `layout` prop과 `layoutId` prop의 차이는? 각각 어떤 시나리오에 쓰는가?
  - `layoutId`가 같은 두 컴포넌트가 동시에 DOM에 존재할 때 Motion은 어떻게 처리하는가?
  - `layoutId`로 연결된 두 컴포넌트 간 shared element transition에서, 어느 쪽의 `transition` prop이 실제 애니메이션에 적용되는가?
- layout animation 사용 시, 레이아웃에 영향을 주는 CSS 값을 변경할 때 `animate` prop이 아닌 `style`이나 `className`을 사용해야 하는 이유는?
- 여러 `Accordion` 컴포넌트가 나란히 있고 하나가 펼쳐질 때 나머지도 밀려나는 경우, 밀려난 컴포넌트의 layout animation이 실행되지 않는 이유와 해결책은?
- 콘텐츠가 추가되어 스크롤바가 나타날 때 의도치 않은 layout animation이 발생하는 이유와 방지 방법은?
- layout animation에서 `border` 속성을 직접 사용하면 안 되는 두 가지 이유와 대안은?

---

# Answers

## `motion.div`에 `layout` prop을 추가하면 어떤 동작이 활성화되는가?

### Official Answer
To enable layout animations on a motion component, simply add the layout prop.
Any layout change that happens as a result of a React render will now be automatically animated.

A layout animation automatically animates an element's size and position when the layout changes, like reordering a list, toggling an accordion, or switching grid columns.
Instead of calculating start and end values yourself, add layout to a `<motion />` component and Motion handles it automatically using transforms.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## layout animation이 감지하는 레이아웃 변화는 어떤 조건에서 발생해야 하는가? JavaScript로 DOM을 직접 조작하면 동작하는가?

### Official Answer
Any layout change that happens as a result of a React render will now be automatically animated.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `justify-content`처럼 CSS transition으로 원래 애니메이션할 수 없는 값이, `layout` prop이 있으면 부드럽게 전환되는 이유는?

### Official Answer
Layout animation can animate previously unanimatable CSS values, like switching justify-content between flex-start and flex-end.

Motion measures the layout change, then animates using CSS transform (translate + scale) instead of actually animating width and height.
Animating transforms can entirely avoid triggering paint.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `layout` prop과 `layoutId` prop의 차이는? 각각 어떤 시나리오에 쓰는가?

### Official Answer
Add layout to animate a single component, or use layoutId to animate shared elements across components, creating seamless transitions between different UI states.
Or by using the layoutId prop, it's possible to match two elements and animate between them for some truly advanced animations.

### User Answer
카드 리스트 → 모달 확장 패턴에서 `layoutId`를 요소 단위로 분리해 적용할 수 있다:

- 그리드 카드 `layoutId="card-1"` → 모달 카드 `layoutId="card-1"` (카드 전체 확대)

- 그리드 이미지 `layoutId="image-1"` → 모달 이미지 `layoutId="image-1"` (이미지 전환)

- 그리드 제목 `layoutId="title-1"` → 모달 제목 `layoutId="title-1"` (텍스트 전환)

`layoutId`는 `AnimatePresence`와 함께 사용해야 마운트/언마운트 시에도 전환이 동작한다. (`AnimatePresence` 없이는 언마운트 시 즉시 사라짐)

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `layoutId`가 같은 두 컴포넌트가 동시에 DOM에 존재할 때 Motion은 어떻게 처리하는가?

### Official Answer
If the original component is still on the page when the new one enters, they will automatically crossfade.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `layoutId`로 연결된 두 컴포넌트 간 shared element transition에서, 어느 쪽의 `transition` prop이 실제 애니메이션에 적용되는가?

### Official Answer
When performing a shared layout animation, the transition defined for element we're animating to will be used.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## layout animation 사용 시, 레이아웃에 영향을 주는 CSS 값을 변경할 때 `animate` prop이 아닌 `style`이나 `className`을 사용해야 하는 이유는?

### Official Answer
When performing layout animations, changes to layout should be made via style or className, not via animation props like animate or whileHover, as layout will take care of the animation.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## 여러 `Accordion` 컴포넌트가 나란히 있고 하나가 펼쳐질 때 나머지도 밀려나는 경우, 밀려난 컴포넌트의 layout animation이 실행되지 않는 이유와 해결책은?

### Official Answer
Layout animations are triggered when a component re-renders and its layout has changed.
When one re-renders, for performance reasons the other won't be able to detect changes to its layout.
We can synchronise layout changes across multiple components by wrapping them in the LayoutGroup component.
When layout changes are detected in any grouped motion component, layout animations will trigger across all of them.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## 콘텐츠가 추가되어 스크롤바가 나타날 때 의도치 않은 layout animation이 발생하는 이유와 방지 방법은?

### Official Answer
Layout changes can affect whether or not a scrollbar is visible.
Scrollbars take up visible space, which means layouts are then subsequently affected by the scrollbar.
Layout animations will apply to any layout change.
If you're finding that this is leading to unwanted layout animations, you can ensure the scrollbar space is reserved, even when no scrollbar is visible, with the scrollbar-gutter CSS rule.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## layout animation에서 `border` 속성을 직접 사용하면 안 되는 두 가지 이유와 대안은?

### Official Answer
Because changing border triggers layout recalculations, it defeats the performance benefits of animating via transform.
border can't render smaller than 1px, which limits the degree of scale correction that Motion can perform on this style.
A work around is to replace border with a parent element with padding that acts as a border.

### Reference
- https://motion.dev/docs/react-layout-animations
