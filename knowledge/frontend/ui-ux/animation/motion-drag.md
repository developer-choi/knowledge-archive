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

### Reference

- https://motion.dev/docs/react-drag
