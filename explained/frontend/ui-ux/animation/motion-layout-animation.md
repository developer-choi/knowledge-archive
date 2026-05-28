# `motion.div`에 `layout` prop을 추가하면 어떤 동작이 활성화되는가?

## 도입

CSS transition으로는 `justify-content` 같은 이산 값을 부드럽게 전환할 수 없다. layout prop은 이 한계를 FLIP 기법으로 극복한다.

---

## 본문

> To enable layout animations on a motion component, simply add the layout prop. Any layout change that happens as a result of a React render will now be automatically animated.

"motion 컴포넌트에서 layout animation을 활성화하려면 layout prop을 추가하면 된다. React 렌더 결과로 발생하는 모든 레이아웃 변화가 자동으로 애니메이션된다."

> A layout animation automatically animates an element's size and position when the layout changes, like reordering a list, toggling an accordion, or switching grid columns. Instead of calculating start and end values yourself, add layout to a `<motion />` component and Motion handles it automatically using transforms.

"layout animation은 리스트 재정렬, 아코디언 토글, 그리드 열 전환처럼 레이아웃이 변할 때 요소의 크기와 위치를 자동으로 애니메이션한다. 시작·종료 값을 직접 계산하는 대신 `<motion />`에 layout을 추가하면 Motion이 transform을 사용해 자동으로 처리한다."

- **as a result of a React render**: React state/props 변경 → re-render → DOM 변화의 경로만 감지한다. JS로 직접 DOM 조작하거나 CSS-only 변경은 감지하지 못한다.
- **using transforms**: 실제 CSS 값(width, position 등)을 보간하지 않고, 변경 전후 위치 차이를 `transform: translate/scale`로 보상하는 FLIP 기법이다.

---

## 종합

`layout` prop 하나로 리스트 재정렬, 아코디언 펼치기, 그리드 전환 애니메이션을 추가할 수 있다. 시작점과 끝점의 크기·위치를 계산하고 보간하는 코드를 직접 작성할 필요가 없다. React 렌더 결과로 발생한 DOM 변화만 감지하므로, 반드시 상태 변경 → 리렌더 경로를 통해야 한다.

---

---

# layout animation이 감지하는 레이아웃 변화는 어떤 조건에서 발생해야 하는가? JavaScript로 DOM을 직접 조작하면 동작하는가?

## 도입

layout animation이 동작하지 않을 때 가장 흔한 원인은 React re-render 없이 DOM이 변경된 경우다.

---

## 본문

> Any layout change that happens as a result of a React render will now be automatically animated.

"React 렌더 결과로 발생하는 모든 레이아웃 변화가 자동으로 애니메이션된다."

- **as a result of a React render**: React state/props 변경 → re-render → DOM 변화의 경로만 Motion이 감지한다.
- **JavaScript로 직접 DOM 조작**: `el.style.width = '200px'` 같은 직접 조작은 re-render를 발생시키지 않으므로 Motion이 감지하지 못하고 layout animation이 실행되지 않는다.
- **CSS-only 변경**: CSS 클래스를 직접 추가하는 경우도 re-render가 없으면 동작하지 않는다. `className` 변경을 `useState`로 관리해야 한다.

---

## 종합

"왜 layout animation이 안 되지?"라고 의심될 때는 해당 DOM 변화가 React state → 리렌더 → DOM 변화의 경로를 밟았는지 확인한다. 직접 DOM 조작이나 CSS 애니메이션과는 함께 쓸 수 없다.

---

---

# `justify-content`처럼 CSS transition으로 원래 애니메이션할 수 없는 값이, `layout` prop이 있으면 부드럽게 전환되는 이유는?

## 도입

CSS transition은 `0px` → `100px` 같은 수치 보간만 지원한다. `flex-start` → `flex-end`처럼 이산 값은 보간이 불가능해 transition이 동작하지 않는다. layout prop이 이 제약을 우회하는 방법이 FLIP이다.

---

## 본문

> Layout animation can animate previously unanimatable CSS values, like switching justify-content between flex-start and flex-end.

"Layout animation은 기존에 애니메이션할 수 없었던 CSS 값을 애니메이션할 수 있다. 예를 들어 `justify-content`를 `flex-start`와 `flex-end` 사이에서 전환하는 것."

> Motion measures the layout change, then animates using CSS transform (translate + scale) instead of actually animating width and height. Animating transforms can entirely avoid triggering paint.

"Motion은 레이아웃 변화를 측정한 뒤, 실제로 width와 height를 애니메이션하는 대신 CSS transform(translate + scale)을 사용해 애니메이션한다. transform 애니메이션은 paint 트리거를 완전히 피할 수 있다."

- **FLIP(First, Last, Invert, Play)**:
  1. **First**: 변경 전 요소의 위치·크기를 측정
  2. **Last**: 변경 후 요소의 위치·크기를 측정
  3. **Invert**: transform으로 "변경 전처럼 보이게" 조작
  4. **Play**: transform을 원래 상태(0)로 애니메이션

- **CSS transition이 불가능한 이유**: `justify-content`는 숫자가 아닌 키워드 값이어서 두 값 사이의 보간 공식이 없다.
- **FLIP이 가능한 이유**: CSS 값 자체를 보간하는 게 아니라, "변경 전후 위치 차이"를 숫자(픽셀)로 계산해 transform으로 보상하기 때문이다.

```
상태 변경 전: element x=100, y=0
상태 변경 후: element x=300, y=0
차이: delta_x = 200px

FLIP:
1. 변경 후 상태를 즉시 적용
2. transform: translateX(-200px) 로 "이전 위치처럼" 보이게 함 (Invert)
3. transform: translateX(0) 으로 애니메이션 (Play)
→ 사용자에게는 x=100에서 x=300으로 부드럽게 이동하는 것처럼 보임
```

---

## 종합

layout prop이 "CSS transition이 불가능한 것도 애니메이션한다"고 말하는 이유가 바로 FLIP 때문이다. CSS 값을 직접 보간하지 않고 결과 위치의 차이를 transform으로 처리하므로, CSS가 지원하지 않는 이산 값도 부드럽게 전환된다. 게다가 transform 애니메이션은 Layout과 Paint를 건너뛰고 Composite 단계만 실행하므로 성능도 우수하다.

---

---

# `layout` prop과 `layoutId` prop의 차이는? 각각 어떤 시나리오에 쓰는가?

## 도입

`layout`과 `layoutId`는 비슷해 보이지만 근본적으로 다른 용도다. 하나는 같은 컴포넌트의 자체 위치 변화에, 다른 하나는 서로 다른 두 컴포넌트 사이의 전환에 쓴다.

---

## 본문

> Add layout to animate a single component, or use layoutId to animate shared elements across components, creating seamless transitions between different UI states.

"단일 컴포넌트를 애니메이션하려면 `layout`을 추가하고, 컴포넌트 간 shared element를 애니메이션하려면 `layoutId`를 사용한다. 서로 다른 UI 상태 사이에 매끄러운 전환을 만든다."

> Or by using the layoutId prop, it's possible to match two elements and animate between them for some truly advanced animations.

"`layoutId` prop을 사용하면 두 요소를 매칭해서 진정한 고급 애니메이션을 만들 수 있다."

- **`layout`**: 같은 컴포넌트 인스턴스가 자기 자리에서 크기·위치가 변하는 경우.
  - 아코디언 펼치기, 리스트 재정렬, 그리드 열 변경
- **`layoutId`**: 서로 다른 두 컴포넌트를 같은 문자열 ID로 연결해 shared element transition을 만드는 경우.
  - 썸네일(unmount) → 모달(mount) 확장, 탭 선택 인디케이터 이동

```
layout  → "나 자신의 레이아웃 변화를 애니메이션"
layoutId → "나와 같은 ID를 가진 다른 컴포넌트 사이를 애니메이션"
```

`layoutId` 패턴:
```jsx
// 카드 리스트
<motion.div layoutId={`card-${item.id}`} onClick={() => setSelected(item)} />

// 선택된 카드 모달
{selected && (
  <motion.div layoutId={`card-${selected.id}`} />
)}
```

Motion이 같은 layoutId를 가진 두 요소를 "같은 것"으로 인식해, 이전 위치에서 새 위치로 자연스럽게 이어준다.

---

## 종합

`layoutId`는 반드시 `AnimatePresence`와 함께 사용해야 마운트/언마운트 시에도 전환이 동작한다. 카드 확대 모달 패턴에서 카드 전체(`layoutId="card-1"`), 카드 이미지(`layoutId="image-1"`), 카드 제목(`layoutId="title-1"`)을 각각 별도 ID로 연결하면 요소별 세밀한 shared element transition이 가능하다.

---

---

# `layoutId`가 같은 두 컴포넌트가 동시에 DOM에 존재할 때 Motion은 어떻게 처리하는가?

## 도입

썸네일 클릭 시 모달이 열리면서 썸네일과 모달이 잠깐 동시에 DOM에 존재하는 순간이 있다. 이 상황에서 Motion이 어떻게 처리하는지 알아야 의도치 않은 시각적 동작을 방지할 수 있다.

---

## 본문

> If the original component is still on the page when the new one enters, they will automatically crossfade.

"새로운 컴포넌트가 진입할 때 원본 컴포넌트가 아직 페이지에 있으면, 자동으로 crossfade된다."

- **crossfade**: 하나는 fade-out하면서 다른 하나가 fade-in하는 교차 전환. 별도의 opacity 조작 없이 Motion이 자동으로 처리한다.
- 두 요소가 동시에 보이면서 하나가 사라지고 다른 하나가 나타나는 것처럼 보이지만, 실제로는 FLIP 애니메이션과 opacity crossfade가 결합된 것이다.

---

## 종합

리스트 선택 → 상세 UI 패턴에서 리스트 아이템을 숨기지 않고 두면, 클릭 시 동일한 layoutId를 가진 두 요소가 잠깐 공존한다. Motion이 crossfade를 자동 처리하므로 의도적으로 배치하는 패턴도 있지만, 일반적으로는 리스트 아이템을 선택 시 숨기고 모달만 보이게 하는 것이 더 예측 가능하다.

---

---

# `layoutId`로 연결된 두 컴포넌트 간 shared element transition에서, 어느 쪽의 `transition` prop이 실제 애니메이션에 적용되는가?

## 도입

두 컴포넌트가 각각 `transition`을 가질 때, 어느 쪽 설정이 실제 애니메이션에 적용되는지가 직관과 다를 수 있다.

---

## 본문

> When performing a shared layout animation, the transition defined for element we're animating to will be used.

"shared layout animation을 수행할 때, 애니메이션 대상(목적지) 요소에 정의된 transition이 사용된다."

- **도착 요소의 transition**: 전환이 향하는 방향의 요소가 기준이다.
  - 모달 열기(썸네일 → 모달): 모달의 `transition` 적용
  - 모달 닫기(모달 → 썸네일): 썸네일의 `transition` 적용

```
썸네일 (transition: { type: 'spring' })
모달   (transition: { duration: 0.4 })

→ 열기 시: 0.4초 tween 애니메이션
→ 닫기 시: spring 애니메이션
```

---

## 종합

직관적으로는 "출발 요소의 transition"이 적용될 것 같지만, 실제로는 "도착 요소의 transition"이다. 열기·닫기 각각에 다른 transition을 적용하고 싶으면 모달과 썸네일의 transition을 각각 원하는 대로 설정하면 된다.

---

---

# layout animation 사용 시, 레이아웃에 영향을 주는 CSS 값을 변경할 때 `animate` prop이 아닌 `style`이나 `className`을 사용해야 하는 이유는?

## 도입

`layout` prop과 `animate` prop을 동시에 써서 레이아웃 값을 변경하면 충돌이 발생한다. 레이아웃 값의 변경 경로가 중요하다.

---

## 본문

> When performing layout animations, changes to layout should be made via style or className, not via animation props like animate or whileHover, as layout will take care of the animation.

"layout animation 수행 시, 레이아웃 변경은 `animate`나 `whileHover` 같은 애니메이션 prop이 아닌 `style`이나 `className`을 통해 이루어져야 한다. layout이 애니메이션을 담당하기 때문이다."

- **`animate={{ justifyContent: "flex-end" }}`로 쓰면**: Motion이 해당 CSS 값을 직접 보간하려 시도한다. 하지만 `justifyContent`는 보간 불가능한 이산 값이므로 즉시 전환된다.
- **`style`/`className`을 통한 변경**: React state → 리렌더 → CSS 값 변경 → Motion이 변경 전후 위치를 측정 → FLIP으로 애니메이션. 두 방식이 충돌하지 않는다.

```jsx
// 잘못된 방법: animate prop으로 레이아웃 값 변경
<motion.div layout animate={{ justifyContent: "flex-end" }} />

// 올바른 방법: style/className으로 변경, 애니메이션은 layout에 위임
const [isEnd, setIsEnd] = useState(false)
<motion.div layout style={{ justifyContent: isEnd ? "flex-end" : "flex-start" }} />
```

---

## 종합

`layout` prop은 React re-render 후 DOM 변화를 측정해 FLIP으로 처리한다. `animate` prop은 Motion이 직접 CSS 값을 보간한다. 두 방식이 같은 속성에 동시에 작동하면 충돌한다. 레이아웃 관련 값(위치, 크기, flex 정렬 등)은 항상 React state → `style`/`className` 경로로 변경하고, 시각 효과(opacity, color 등)만 `animate` prop으로 제어한다.

---

---

# 여러 `Accordion` 컴포넌트가 나란히 있고 하나가 펼쳐질 때 나머지도 밀려나는 경우, 밀려난 컴포넌트의 layout animation이 실행되지 않는 이유와 해결책은?

## 도입

layout animation은 해당 컴포넌트가 리렌더될 때 발동한다. 이웃 컴포넌트가 리렌더돼도 내가 리렌더되지 않으면 내 layout animation은 실행되지 않는다.

---

## 본문

> Layout animations are triggered when a component re-renders and its layout has changed. When one re-renders, for performance reasons the other won't be able to detect changes to its layout. We can synchronise layout changes across multiple components by wrapping them in the LayoutGroup component. When layout changes are detected in any grouped motion component, layout animations will trigger across all of them.

"Layout animation은 컴포넌트가 re-render되고 레이아웃이 변경됐을 때 트리거된다. 성능상의 이유로, 하나가 re-render될 때 다른 컴포넌트는 자신의 레이아웃 변화를 감지하지 못한다. `LayoutGroup` 컴포넌트로 감싸면 여러 컴포넌트 간 레이아웃 변화를 동기화할 수 있다."

- **이유**: layout animation은 "이 컴포넌트가 re-render된 후 위치가 바뀌었는가"를 체크하는 방식. 옆 Accordion이 펼쳐져도 나머지 Accordion은 re-render되지 않으므로 자신의 위치 변화를 감지하지 못한다.
- **LayoutGroup**: 그룹 내 어느 컴포넌트에서든 layout 변화가 감지될 때 전체 그룹의 layout animation이 동기화되어 실행된다.

```jsx
import { LayoutGroup } from "motion/react"

function List() {
  return (
    <LayoutGroup>
      <Accordion />
      <Accordion />
      <Accordion />
    </LayoutGroup>
  )
}
```

---

## 종합

`LayoutGroup`은 "이 그룹 안의 motion 컴포넌트들은 서로의 레이아웃 변화를 공유한다"는 컨텍스트를 제공한다. 하나가 펼쳐지면 나머지도 자신의 새 위치로 layout animation이 실행되어 밀려나는 움직임이 부드럽게 처리된다.

---

---

# 콘텐츠가 추가되어 스크롤바가 나타날 때 의도치 않은 layout animation이 발생하는 이유와 방지 방법은?

## 도입

layout prop을 쓸 때 예상치 못한 layout animation이 발생하는 흔한 상황이 있다. 스크롤바 등장으로 인한 레이아웃 변화가 Motion에 의해 감지되는 것이다.

---

## 본문

> Layout changes can affect whether or not a scrollbar is visible. Scrollbars take up visible space, which means layouts are then subsequently affected by the scrollbar. Layout animations will apply to any layout change.

"레이아웃 변화는 스크롤바의 가시성에 영향을 줄 수 있다. 스크롤바는 보이는 공간을 차지하므로, 이후 레이아웃이 스크롤바의 영향을 받는다. Layout animation은 모든 레이아웃 변화에 적용된다."

> If you're finding that this is leading to unwanted layout animations, you can ensure the scrollbar space is reserved, even when no scrollbar is visible, with the scrollbar-gutter CSS rule.

"이로 인해 원치 않는 layout animation이 발생하면, `scrollbar-gutter` CSS 규칙으로 스크롤바가 없을 때도 스크롤바 공간을 미리 예약할 수 있다."

```css
body {
  overflow-y: auto;
  scrollbar-gutter: stable;
}
```

- **scrollbar-gutter: stable**: 스크롤바 유무와 관계없이 스크롤바 공간을 항상 예약한다. 스크롤바가 나타나도 다른 요소의 너비가 변하지 않으므로 layout animation이 발동하지 않는다.
- **왜 발생하는가**: 콘텐츠 추가 → 스크롤바 등장 → 스크롤바가 15~20px 공간 차지 → 모든 요소의 너비가 줄어듦 → Motion이 레이아웃 변화로 감지 → 전체 layout animation 발동.

---

## 종합

스크롤바 때문에 layout animation이 발동하는 버그는 `scrollbar-gutter: stable`로 한 줄에 해결된다. 스크롤바 공간을 미리 예약해두면 스크롤바 등장 여부가 레이아웃에 영향을 주지 않는다. macOS에서는 스크롤바가 플로팅(공간 차지 없음) 방식이라 발생하지 않지만, Windows의 기본 스크롤바는 공간을 차지하므로 Windows 환경에서 더 자주 만난다.

---

---

# layout animation에서 `border` 속성을 직접 사용하면 안 되는 두 가지 이유와 대안은?

## 도입

layout animation과 border를 함께 쓰면 두 가지 문제가 생긴다. 성능 문제와 시각적 왜곡이다.

---

## 본문

> Because changing border triggers layout recalculations, it defeats the performance benefits of animating via transform.

"border 변경은 layout 재계산을 유발하므로 transform 기반 애니메이션의 성능 이점을 없앤다."

> border can't render smaller than 1px, which limits the degree of scale correction that Motion can perform on this style.

"border는 1px 미만으로 렌더링할 수 없어, Motion이 이 스타일에 대해 수행할 수 있는 scale 보정 정도를 제한한다."

> A work around is to replace border with a parent element with padding that acts as a border.

"해결책은 border를 border처럼 보이는 padding이 있는 부모 요소로 대체하는 것이다."

```jsx
<motion.div layout style={{ borderRadius: 10, padding: 5 }}>
  <motion.div layout style={{ borderRadius: 5 }} />
</motion.div>
```

두 가지 문제:

1. **reflow 유발**: `border` 변경은 요소의 크기에 영향을 주어 Layout 재계산(reflow)을 일으킨다. transform 기반 FLIP이 Layout을 건너뛰는 이점이 사라진다.

2. **1px 한계**: layout animation이 요소를 축소(scale < 1)할 때, border의 겉보기 두께도 함께 줄어야 하는데 브라우저는 1px 미만을 렌더링하지 않아 border가 상대적으로 두꺼워 보이는 왜곡이 남는다.

대안:
- 배경색이 있는 부모에 `padding`을 줘서 border처럼 보이게 한다.
- `padding`은 reflow 없이 처리되고 1px 한계도 없다.

---

## 종합

layout animation에서 카드나 박스에 border를 쓰고 싶다면, `outline`(레이아웃에 영향 없음)이나 `box-shadow: inset 0 0 0 1px color` 같은 대안을 고려한다. `padding`을 border 대용으로 쓰는 방법도 유효하다. border는 layout 참여 속성이므로 layout animation과 함께 쓰면 항상 마찰이 생긴다.
