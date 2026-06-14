# Motion에서 요소를 드래그 가능하게 만드는 가장 기본적인 방법은?

## 도입

Motion은 드래그 구현을 위한 low-level 이벤트 핸들링을 추상화해준다. pointer down → move → up 이벤트를 직접 다룰 필요 없이 prop 하나로 드래그가 활성화된다.

---
## 본문

> The simplest way to make a component draggable is to add the `drag` prop to a motion component.

"컴포넌트를 드래그 가능하게 만드는 가장 간단한 방법은 motion 컴포넌트에 `drag` prop을 추가하는 것이다."

```jsx
<motion.div drag />
```

- **drag**: boolean prop. `true`이거나 값 없이 사용하면 x축과 y축 양방향 드래그가 활성화된다. 마우스와 터치 이벤트 모두 처리된다.

---
## 종합

`drag` prop 하나로 브라우저의 pointer 이벤트를 추적하고, 요소의 transform을 매 프레임 업데이트하는 전체 드래그 파이프라인이 활성화된다. 추가 prop 없이도 드래그가 동작하지만, 기본적으로 관성(momentum) 효과가 적용되어 놓으면 자연스럽게 감속하며 멈춘다.

---
# Motion에서 드래그를 특정 축(x 또는 y)으로만 제한하려면?

## 도입

양방향 드래그 대신 한 축으로만 이동을 제한해야 하는 경우가 많다. 세로 스크롤 대체 UI, 슬라이더 등이 대표적이다.

---
## 본문

> To lock dragging to a single axis, you can set the prop to "x" or "y".

"드래그를 단일 축으로 고정하려면 prop을 `"x"` 또는 `"y"`로 설정할 수 있다."

```jsx
<motion.div drag="x" />
```

- **`drag="x"`**: 수평 방향만 드래그 가능. 카드 스와이프, 슬라이더에 적합.
- **`drag="y"`**: 수직 방향만 드래그 가능. 풀다운 패널, 바텀시트 닫기 제스처에 적합.

---
## 종합

`drag="y"`가 설정된 요소 안에서 `touch-action: pan-y`가 적용되면, 브라우저가 터치 스크롤 제스처로 가져가면서 Motion의 드래그가 중단된다. 이 때문에 `touch-action: none`을 설정해 브라우저 기본 제스처를 비활성화해야 드래그가 완주된다.

---
# Motion에서 드래그 중에만 적용되는 애니메이션 상태를 지정하려면?

## 도입

드래그 중에 시각적 피드백을 주는 것은 사용자에게 "이 요소가 지금 드래그 중"임을 알리는 중요한 UX다. `whileDrag`가 이를 처리한다.

---
## 본문

> You can animate to an animation state while an element is being dragged using the `whileDrag` prop. When the gesture starts, the component will animate to the state defined in whileDrag. When it ends, it will animate back to its default animate state.

"요소를 드래그하는 동안 `whileDrag` prop을 사용하여 애니메이션 상태로 전환할 수 있다. 제스처가 시작되면 컴포넌트는 whileDrag에 정의된 상태로 애니메이션되고, 종료 시 기본 animate 상태로 다시 돌아간다."

```jsx
<motion.div
  drag
  whileDrag={{
    scale: 1.1,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)"
  }}
/>
```

- **whileDrag**: 드래그 시작 → 상태 전환, 드래그 종료 → 원래 상태 자동 복귀. `whileHover`, `whileTap`과 동일한 패턴.
- **scale: 1.1 + boxShadow**: 요소가 "들어올려진" 것처럼 보이는 lift 효과. 드래그 중임을 시각적으로 명확히 한다.

---
## 종합

`whileDrag`는 드래그 시작과 종료를 자동으로 감지해 상태를 전환한다. 복귀 애니메이션을 따로 작성할 필요 없다. 드래그 중 카드 색상을 바꾸거나 그림자를 키우는 시각적 피드백이 `whileDrag` 한 줄로 구현된다.

---
# Motion의 drag와 브라우저 기본 Drag & Drop API의 차이는?

## 도입

브라우저에는 기본 Drag & Drop API가 있다. Motion의 drag는 이와는 다른 방식으로 동작하며, 각각 장단점이 있다.

---
## 본문

> Although browsers provide a native Drag and Drop API, it can be challenging to create a pleasant experience, with an odd "ghost image" effect. On the other hand, it also contains native dropzone functionality - which isn't yet in Motion.

"브라우저가 네이티브 Drag and Drop API를 제공하지만, 이상한 'ghost image' 효과로 인해 유쾌한 경험을 만들기 어려울 수 있다. 반면 이는 Motion에 아직 없는 네이티브 dropzone 기능을 포함하고 있다."

- **ghost image**: 브라우저 기본 드래그 시 마우스 커서 옆에 나타나는 반투명 복사본 이미지. 사용자 정의가 제한적이고 시각적으로 어색하다.
- **dropzone**: 특정 영역에 드롭됐을 때를 감지하는 기능(`dragover`, `drop` 이벤트). Motion은 현재 이 기능이 없다.

```
Motion drag:
  장점: ghost image 없음, 부드러운 physics, 풍부한 이벤트 정보(velocity, offset)
  단점: dropzone 지원 없음

브라우저 Drag & Drop API:
  장점: 네이티브 dropzone 지원, 파일 드래그 등 OS 레벨 통합
  단점: ghost image 컨트롤 어려움, 터치 환경 지원 불일치
```

---
## 종합

파일 업로드 드래그 앤 드롭처럼 드롭 대상 감지가 핵심인 경우는 브라우저 기본 API가 적합하다. 아이템 재정렬, 바텀시트 닫기 제스처, 슬라이더 같은 UI 인터랙션은 Motion이 훨씬 자연스러운 경험을 제공한다.

---
# Motion 드래그 요소를 놓았을 때 관성 효과가 기본으로 적용되는 이유는, 그리고 이를 끄려면?

## 도입

드래그를 놓는 순간 즉시 멈추면 부자연스럽다. Motion은 기본적으로 손에서 떠나는 순간의 속도로 관성 애니메이션을 실행한다.

---
## 본문

> By default, when a user releases a draggable element, it has momentum. It will perform an inertia animation based on the velocity of the pointer, creating a realistic, physical feel.

"기본적으로 사용자가 드래그 가능한 요소를 놓으면 모멘텀이 생긴다. 포인터의 속도에 기반한 inertia 애니메이션을 수행하여 현실적인 물리적 느낌을 만든다."

> You can disable this behaviour by setting the `dragMomentum` prop to false.

"`dragMomentum` prop을 false로 설정하면 이 동작을 비활성화할 수 있다."

```jsx
<motion.div drag dragMomentum={false} />
```

- **momentum**: 드래그를 놓는 순간의 속도를 이어받아 관성으로 미끄러지다 멈추는 효과. inertia 애니메이션으로 구현된다.
- **dragMomentum={false}**: 놓는 즉시 멈춘다. 정해진 위치에만 배치해야 하는 제한된 드래그(예: `dragConstraints` + snap-back)에 적합하다.

---
## 종합

풀스크린 바텀시트에서 `dragConstraints={{ top: 0, bottom: 0 }}`를 쓰면 constraints 위치로 snap-back되는데, 이때 기본 momentum이 활성화되어 있으면 constraints spring과 exit 애니메이션이 충돌해 dip-up 현상(시트가 잠깐 위로 올라갔다 내려감)이 발생할 수 있다. 이런 경우 `dragMomentum={false}`로 기본 관성을 끄고 `onDragEnd`에서 수동으로 snap-back을 처리하는 것이 더 예측 가능하다.

---
# Motion에서 드래그 관성의 물리 파라미터를 커스텀하려면?

## 도입

기본 관성 애니메이션이 너무 가볍거나 무겁게 느껴질 때, `dragTransition`으로 물리 파라미터를 조정할 수 있다.

---
## 본문

> You can also customise the physics of this inertia animation with the `dragTransition` prop. This is useful for creating a heavier or bouncier feel.

"`dragTransition` prop으로 inertia 애니메이션의 물리 파라미터를 커스텀할 수 있다. 더 무겁거나 더 튀기는 느낌을 만드는 데 유용하다."

```jsx
<motion.div
  drag
  dragTransition={{
    bounceStiffness: 600,
    bounceDamping: 10
  }}
/>
```

- **bounceStiffness**: `dragConstraints` 경계에 부딪혔을 때의 스프링 강도. 높을수록 즉각적으로 튕겨 돌아온다.
- **bounceDamping**: 경계 충돌 bounce의 감쇠. 0이면 무한 진동, 값이 높을수록 빠르게 안정된다.

실전 주의점: `dragConstraints={{ top: 0, bottom: 0 }}`과 `onDragEnd` exit 애니메이션이 함께 있을 때, `bounceStiffness`가 너무 높으면 exit 시 시트가 순간 위로 당겨지는 dip-up 현상이 발생한다. exit 시나리오에서는 `dragConstraints`에서 `bottom`을 제거하고 `onDragEnd`에서 수동 snap-back을 처리하는 것이 안전하다.

---
## 종합

`dragTransition`은 `drag` prop이 활성화된 상태에서 자동으로 적용되는 inertia 애니메이션의 파라미터를 재정의한다. `modifyTarget`을 추가하면 감속 후 정지 위치를 특정 값(예: 50px 그리드)으로 스냅할 수 있어 snap-to-grid UI를 만들 수 있다.

---
# Motion에서 드래그 가능 범위를 픽셀로 제한하려면?

## 도입

드래그 요소가 화면 밖으로 나가거나 의도치 않은 위치까지 이동하는 것을 막으려면 `dragConstraints`로 이동 가능 범위를 제한한다.

---
## 본문

> You can constrain the movement of a draggable element using the `dragConstraints` prop. The simplest way to apply constraints is by passing an object of top, left, right, and bottom values, measured in pixels.

"`dragConstraints` prop으로 드래그 가능 요소의 이동을 제한할 수 있다. 제약을 적용하는 가장 간단한 방법은 픽셀로 측정된 top, left, right, bottom 값의 객체를 전달하는 것이다."

```jsx
<motion.div
  drag
  dragConstraints={{
    top: -50,
    left: -50,
    right: 50,
    bottom: 50,
  }}
/>
```

- **dragConstraints**: 요소가 초기 위치에서 이동할 수 있는 최대 거리를 픽셀로 정의. 경계를 넘어 드래그하면 탄성 있게 저항하다가 놓으면 경계로 snap-back된다.
- **{ top: 0, bottom: 0 }**: top과 bottom 모두 0이면 수직 이동 없이 초기 위치로 항상 돌아온다. 바텀시트에서 "내리다 놓으면 snap-back" 패턴에 쓰인다.

ref를 전달하는 방식도 있다:
```jsx
const constraintRef = useRef(null)
<div ref={constraintRef}>
  <motion.div drag dragConstraints={constraintRef} />
</div>
```
부모 요소를 기준으로 자동으로 경계를 계산한다.

---
## 종합

`dragConstraints={{ top: 0, bottom: 0 }}`과 관성(momentum)이 함께 있으면 드래그를 놓는 순간 constraints 범위로 snap-back된다. 바텀시트에서 임계값 이하로 드래그했다가 놓으면 원위치로 돌아오는 UX가 이 패턴이다. 단, momentum + constraints snap-back이 exit 애니메이션과 충돌할 수 있으므로 exit 케이스에서는 constraints를 제거하고 수동 제어를 선택하는 것이 안전하다.

---
# Motion 드래그 이벤트 콜백에서 받을 수 있는 정보는?

## 도입

드래그 이벤트 핸들러(`onDrag`, `onDragStart`, `onDragEnd`)는 원본 PointerEvent와 함께 드래그 상태 정보를 담은 `info` 객체를 전달한다. 이 정보를 활용해 드래그 동작을 제어한다.

---
## 본문

> Each callback is provided with the original PointerEvent, and an info object containing valuable data about the gesture's state:
> - `point`: The x and y coordinates of the pointer.
> - `delta`: The distance moved since the last event.
> - `offset`: The distance from the element's origin.
> - `velocity`: The current velocity of the pointer.

"각 콜백은 원본 PointerEvent와 함께, 제스처 상태에 대한 유용한 데이터를 담은 info 객체를 전달한다."

```jsx
function onDrag(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div drag onDrag={onDrag} />
```

- **point**: 화면(페이지) 기준 절대 좌표. 드래그 중 포인터의 현재 위치.
- **delta**: 직전 이벤트 이후 이동한 거리. 매 프레임 소량 누적되는 값이다.
- **offset**: 드래그 시작점(origin)에서 누적된 총 이동 거리. `offset.y > 150` 같이 임계값 판단에 사용.
- **velocity**: 현재 포인터 속도. `velocity.y > 800` 같이 빠른 플릭 감지에 사용.

실전 `onDragEnd` 패턴:
```jsx
const handleDragEnd = (event, info) => {
  if (info.velocity.y > 800 || info.offset.y > 80) {
    onClose();  // 빠른 플릭 또는 충분히 내렸으면 닫기
  } else {
    animate(y, 0, { type: 'spring', stiffness: 400, damping: 40 }); // snap-back
  }
};
```

---
## 종합

`onDragEnd`에서만 동작을 제어할 때 주의점이 있다. 드래그 흐름은 `pointerMove → drag animation → pointerUp → onDragEnd` 순서이므로, `onDragEnd`에서 "닫지 않기로" 결정해도 이미 시트가 아래로 내려간 상태다. 놓으면 snap-back 위치로 튀어 돌아오는 UX 왜곡이 생긴다. 드래그 자체를 막으려면 `pointerMove` 단계에서 `stopPropagation`을 사용해 Motion이 pan 제스처를 인식하지 못하게 해야 한다.
