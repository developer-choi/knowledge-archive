---
tags: [react, performance, principle]
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

> #### Official Annotation:
> A layout animation automatically animates an element's size and position when the layout changes, like reordering a list, toggling an accordion, or switching grid columns.
> Instead of calculating start and end values yourself, add layout to a `<motion />` component and Motion handles it automatically using transforms.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## layout animation이 감지하는 레이아웃 변화는 어떤 조건에서 발생해야 하는가? JavaScript로 DOM을 직접 조작하면 동작하는가?

### Official Answer
Any layout change that happens as a result of a React render will now be automatically animated.

> #### AI Annotation:
> "as a result of a React render" 조건이 핵심입니다.
> React state/props 변경 → re-render 경로로 발생한 DOM 변화만 Motion이 감지합니다.
> JavaScript로 직접 DOM을 조작하거나 CSS-only로 변경되는 경우는 re-render가 없으므로 Motion이 감지하지 못하고 애니메이션이 실행되지 않습니다.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `justify-content`처럼 CSS transition으로 원래 애니메이션할 수 없는 값이, `layout` prop이 있으면 부드럽게 전환되는 이유는?

### Official Answer
Layout animation can animate previously unanimatable CSS values, like switching justify-content between flex-start and flex-end.

> #### Official Annotation:
> Motion measures the layout change, then animates using CSS transform (translate + scale) instead of actually animating width and height.
> Animating transforms can entirely avoid triggering paint.

> #### AI Annotation:
> CSS transition은 수치 보간(interpolate)이 가능한 값(opacity, width 등)에만 동작합니다.
> `justify-content`처럼 이산(discrete) 값은 CSS transition으로 애니메이션할 수 없습니다.
> Motion은 변경 전후 요소의 실제 위치를 측정한 뒤, CSS transform(translate/scale)으로 이동하는 것처럼 보이게 합니다.
> 이를 **FLIP(First, Last, Invert, Play)** 기법이라 하며, CSS 값 자체를 보간하는 것이 아니라 결과 위치 차이를 transform으로 보상하기 때문에 CSS transition이 지원하지 않는 값도 부드럽게 전환됩니다.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `layout` prop과 `layoutId` prop의 차이는? 각각 어떤 시나리오에 쓰는가?

### Official Answer
Add layout to animate a single component, or use layoutId to animate shared elements across components, creating seamless transitions between different UI states.
Or by using the layoutId prop, it's possible to match two elements and animate between them for some truly advanced animations.

> #### AI Annotation:
> - **`layout`**: 하나의 컴포넌트가 자기 자리에서 크기·위치가 바뀌는 경우. 예: 아코디언 펼치기, 리스트 재정렬
> - **`layoutId`**: 서로 다른 두 컴포넌트를 같은 문자열 ID로 연결해 shared element transition을 만드는 경우. 예: 썸네일(unmount) → 모달(mount) 확장 애니메이션. Motion이 두 요소를 "같은 것"으로 인식해 이전 위치에서 새 위치로 자동으로 이어줍니다.

> #### User Annotation:
> 카드 리스트 → 모달 확장 패턴에서 `layoutId`를 요소 단위로 분리해 적용할 수 있다:
> - 그리드 카드 `layoutId="card-1"` → 모달 카드 `layoutId="card-1"` (카드 전체 확대)
> - 그리드 이미지 `layoutId="image-1"` → 모달 이미지 `layoutId="image-1"` (이미지 전환)
> - 그리드 제목 `layoutId="title-1"` → 모달 제목 `layoutId="title-1"` (텍스트 전환)
>
> `layoutId`는 `AnimatePresence`와 함께 사용해야 마운트/언마운트 시에도 전환이 동작한다. (`AnimatePresence` 없이는 언마운트 시 즉시 사라짐)

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `layoutId`가 같은 두 컴포넌트가 동시에 DOM에 존재할 때 Motion은 어떻게 처리하는가?

### Official Answer
If the original component is still on the page when the new one enters, they will automatically crossfade.

> #### AI Annotation:
> 두 요소가 동시에 DOM에 있을 경우 별도의 opacity 조작 없이 Motion이 자동으로 crossfade(하나가 사라지며 다른 하나가 나타나는 교차 전환)를 처리합니다.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## `layoutId`로 연결된 두 컴포넌트 간 shared element transition에서, 어느 쪽의 `transition` prop이 실제 애니메이션에 적용되는가?

### Official Answer
When performing a shared layout animation, the transition defined for element we're animating to will be used.

> #### AI Annotation:
> **도착(to) 요소의 transition**이 적용됩니다.
> 예: modal 열기(button → dialog) 시 `dialog`의 transition 적용, modal 닫기(dialog → button) 시 `button`의 transition 적용.
> 직관적으로는 "출발 요소의 transition"이라고 생각하기 쉬워 혼동하기 쉬운 규칙입니다.

### Reference
- https://motion.dev/docs/react-layout-animations

---

## layout animation 사용 시, 레이아웃에 영향을 주는 CSS 값을 변경할 때 `animate` prop이 아닌 `style`이나 `className`을 사용해야 하는 이유는?

### Official Answer
When performing layout animations, changes to layout should be made via style or className, not via animation props like animate or whileHover, as layout will take care of the animation.

> #### AI Annotation:
> `animate={{ justifyContent: "flex-end" }}`처럼 쓰면 Motion이 해당 CSS 값을 직접 보간하려 시도합니다.
> 그러나 `layout`은 React render 결과로 DOM이 바뀐 뒤 그 위치 차이를 transform으로 보상하는 FLIP 방식입니다.
> 두 방식이 동시에 작동하면 충돌이 발생합니다.
> 레이아웃 값은 반드시 React state → `style`/`className` 경로로 변경하고, 애니메이션은 `layout`에 맡겨야 합니다.

### Reference
- https://motion.dev/docs/react-layout-animations

---


## 여러 `Accordion` 컴포넌트가 나란히 있고 하나가 펼쳐질 때 나머지도 밀려나는 경우, 밀려난 컴포넌트의 layout animation이 실행되지 않는 이유와 해결책은?

### Official Answer
Layout animations are triggered when a component re-renders and its layout has changed.
When one re-renders, for performance reasons the other won't be able to detect changes to its layout.
We can synchronise layout changes across multiple components by wrapping them in the LayoutGroup component.
When layout changes are detected in any grouped motion component, layout animations will trigger across all of them.

> #### AI Annotation:
> **이유**: layout animation은 해당 컴포넌트의 re-render를 트리거로 발동합니다.
> 옆 Accordion이 펼쳐져도 나머지 Accordion은 re-render되지 않으므로 자신의 위치 변화를 감지하지 못합니다.
>
> **해결책**: `LayoutGroup`으로 감싸면 그룹 내 어느 컴포넌트에서든 layout 변화가 감지될 때 전체 그룹의 layout animation이 동기화되어 실행됩니다.
>
> ```jsx
> import { LayoutGroup } from "motion/react"
>
> function List() {
>   return (
>     <LayoutGroup>
>       <Accordion />
>       <Accordion />
>     </LayoutGroup>
>   )
> }
> ```

### Reference
- https://motion.dev/docs/react-layout-animations

---

## 콘텐츠가 추가되어 스크롤바가 나타날 때 의도치 않은 layout animation이 발생하는 이유와 방지 방법은?

### Official Answer
Layout changes can affect whether or not a scrollbar is visible.
Scrollbars take up visible space, which means layouts are then subsequently affected by the scrollbar.
Layout animations will apply to any layout change.
If you're finding that this is leading to unwanted layout animations, you can ensure the scrollbar space is reserved, even when no scrollbar is visible, with the scrollbar-gutter CSS rule.

> #### AI Annotation:
> **이유**: 콘텐츠 추가 → 스크롤바 등장 → 스크롤바가 레이아웃 공간 차지 → 모든 요소 위치 변경 → layout animation 발동. Motion은 모든 레이아웃 변화에 반응하므로 의도치 않은 애니메이션이 트리거됩니다.
>
> **방지**: `scrollbar-gutter: stable`로 스크롤바 유무와 관계없이 공간을 미리 예약하면 스크롤바 등장 시 레이아웃이 변하지 않습니다.
>
> ```css
> body {
>   overflow-y: auto;
>   scrollbar-gutter: stable;
> }
> ```

### Reference
- https://motion.dev/docs/react-layout-animations

---

## layout animation에서 `border` 속성을 직접 사용하면 안 되는 두 가지 이유와 대안은?

### Official Answer
Because changing border triggers layout recalculations, it defeats the performance benefits of animating via transform.
border can't render smaller than 1px, which limits the degree of scale correction that Motion can perform on this style.
A work around is to replace border with a parent element with padding that acts as a border.

> #### AI Annotation:
> **이유 1**: `border` 변경은 reflow를 유발해 transform 기반 FLIP의 성능 이점이 사라집니다.
> **이유 2**: 브라우저가 1px 미만의 border를 그릴 수 없어 scale 축소 시 border가 상대적으로 두꺼워 보이는 왜곡이 남습니다.
>
> **대안**: 배경색이 있는 부모 요소에 `padding`을 줘서 border처럼 보이게 합니다. `padding`은 reflow 없이 처리되고 1px 제한도 없습니다.
>
> ```jsx
> <motion.div layout style={{ borderRadius: 10, padding: 5 }}>
>   <motion.div layout style={{ borderRadius: 5 }} />
> </motion.div>
> ```

### Reference
- https://motion.dev/docs/react-layout-animations
