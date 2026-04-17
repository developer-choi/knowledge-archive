---
tags: [react, styling, concept]
---
# Questions

- Motion에서 요소를 드래그 가능하게 만드는 가장 기본적인 방법은?
- Motion에서 드래그를 특정 축(x 또는 y)으로만 제한하려면?
- Motion에서 드래그 중에만 적용되는 애니메이션 상태를 지정하려면?
- Motion의 drag와 브라우저 기본 Drag & Drop API의 차이는?
- Motion 드래그 요소를 놓았을 때 관성 효과가 기본으로 적용되는 이유는, 그리고 이를 끄려면?
- Motion에서 드래그 관성의 물리 파라미터를 커스텀하려면?
- Motion에서 드래그 가능 범위를 픽셀로 제한하려면?
- Motion 드래그 이벤트 콜백에서 받을 수 있는 정보는?

---

# Answers

## Motion에서 요소를 드래그 가능하게 만드는 가장 기본적인 방법은?

### Official Answer

The simplest way to make a component draggable is to add the `drag` prop to a motion component.

```jsx
<motion.div drag />
```

### Reference

- https://motion.dev/docs/react-drag

---

## Motion에서 드래그를 특정 축(x 또는 y)으로만 제한하려면?

### Official Answer

To lock dragging to a single axis, you can set the prop to "x" or "y".

```jsx
<motion.div drag="x" />
```

### Reference

- https://motion.dev/docs/react-drag

---

## Motion에서 드래그 중에만 적용되는 애니메이션 상태를 지정하려면?

### Official Answer

You can animate to an animation state while an element is being dragged using the `whileDrag` prop.
When the gesture starts, the component will animate to the state defined in whileDrag.
When it ends, it will animate back to its default animate state.

```jsx
<motion.div
  drag
  whileDrag={{
    scale: 1.1,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)"
  }}
/>
```

> #### AI Annotation:
> `whileHover`, `whileTap`과 같은 패턴. 드래그 시작/종료 시 상태 전환이 자동으로 처리된다.
> 위 예시는 scale + box shadow로 요소가 "들어올려진" lift 효과를 구현한 것.

### Reference

- https://motion.dev/docs/react-drag

---

## Motion의 drag와 브라우저 기본 Drag & Drop API의 차이는?

### Official Answer

Although browsers provide a native Drag and Drop API, it can be challenging to create a pleasant experience, with an odd "ghost image" effect.
On the other hand, it also contains native dropzone functionality - which isn't yet in Motion.

> #### AI Annotation:
> Motion은 ghost image 없이 부드러운 드래그 UX를 제공하지만, 브라우저 기본 API가 지원하는 dropzone(드롭 대상 감지) 기능은 아직 없다는 트레이드오프가 있다.

### Reference

- https://motion.dev/docs/react-drag

---

## Motion 드래그 요소를 놓았을 때 관성 효과가 기본으로 적용되는 이유는, 그리고 이를 끄려면?

### Official Answer

By default, when a user releases a draggable element, it has momentum.
It will perform an inertia animation based on the velocity of the pointer, creating a realistic, physical feel.
You can disable this behaviour by setting the `dragMomentum` prop to false.

```jsx
<motion.div drag dragMomentum={false} />
```

### Reference

- https://motion.dev/docs/react-drag

---

## Motion에서 드래그 관성의 물리 파라미터를 커스텀하려면?

### Official Answer

You can also customise the physics of this inertia animation with the `dragTransition` prop.
This is useful for creating a heavier or bouncier feel.

```jsx
<motion.div
  drag
  dragTransition={{
    bounceStiffness: 600,
    bounceDamping: 10
  }}
/>
```

> #### User Annotation:
> FullScreenBottomSheet에서 `dragConstraints={{ top: 0, bottom: 0 }}`를 설정했더니, 임계점을 넘겨서 닫으려는 순간 시트가 살짝 위로 올라갔다가 내려가는 dip-up 현상이 발생했다. pointer up 순간 `dragTransition` 스프링(constraints 위치로 복귀)과 `onDragEnd` → exit 애니메이션이 동시에 시작되는데, exit 애니메이션이 React 리렌더를 거치는 1~2프레임 동안 스프링이 먼저 위로 당겨서 발생한 것. `bounceStiffness: 0`으로 하면 사라지고, `bounceStiffness: 6000, bounceDamping: 0`으로 하면 극단적으로 심해지는 것으로 증명했다. 해결: `dragConstraints`에서 `bottom`을 제거해 자동 snap-back 자체를 없애고, `onDragEnd`에서 `animate(y, 0, ...)`으로 수동 snap-back을 처리했다.

### Reference

- https://motion.dev/docs/react-drag

---

## Motion에서 드래그 가능 범위를 픽셀로 제한하려면?

### Official Answer

You can constrain the movement of a draggable element using the `dragConstraints` prop.
The simplest way to apply constraints is by passing an object of top, left, right, and bottom values, measured in pixels.

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

### Reference

- https://motion.dev/docs/react-drag

---

## Motion 드래그 이벤트 콜백에서 받을 수 있는 정보는?

### Official Answer

Each callback is provided with the original PointerEvent, and an info object containing valuable data about the gesture's state:
point: The x and y coordinates of the pointer.
delta: The distance moved since the last event.
offset: The distance from the element's origin.
velocity: The current velocity of the pointer.

```jsx
function onDrag(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div drag onDrag={onDrag} />
```

> #### User Annotation:
> `onDragEnd`에서만 동작을 제어하면 시각적 왜곡이 생긴다. framer-motion의 드래그 흐름은 `pointerMove → drag animation(시트가 따라 내려감) → pointerUp → onDragEnd`인데, `onDragEnd`에서 "스크롤 가능하면 닫지 않는다"를 체크해도 그 사이 시트가 이미 아래로 끌려 내려간 상태다. 손을 떼면 원위치로 튀어돌아오는 UX가 된다. 드래그 자체를 막으려면 `pointerMove` 단에서 `stopPropagation`해야 framer-motion이 pan 제스처를 인식조차 못한다.

### Reference

- https://motion.dev/docs/react-drag
