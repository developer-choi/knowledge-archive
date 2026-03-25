---
tags: [styling, browser, concept]
---
# Questions
- [터치스크린에서 브라우저가 스크롤/줌 제스처를 독점 처리할 때, 앱이 커스텀 터치 동작(예: 캔버스 드래그)을 구현하려면 어떤 CSS 속성으로 제스처 처리 권한을 분배하는가?](#터치스크린에서-브라우저가-스크롤줌-제스처를-독점-처리할-때-앱이-커스텀-터치-동작예-캔버스-드래그을-구현하려면-어떤-css-속성으로-제스처-처리-권한을-분배하는가)
- [touch-action 값은 터치된 요소와 조상 요소 사이에서 어떻게 결정되는가?](#touch-action-값은-터치된-요소와-조상-요소-사이에서-어떻게-결정되는가)

---

# Answers

## 터치스크린에서 브라우저가 스크롤/줌 제스처를 독점 처리할 때, 앱이 커스텀 터치 동작(예: 캔버스 드래그)을 구현하려면 어떤 CSS 속성으로 제스처 처리 권한을 분배하는가?

### Official Answer
The touch-action CSS property sets how an element's region can be manipulated by a touchscreen user (for example, by zooming features built into the browser).

By default, panning (scrolling) and pinching gestures are handled exclusively by the browser.
An application using Pointer events will receive a pointercancel event when the browser starts handling a touch gesture.
By explicitly specifying which gestures should be handled by the browser, an application can supply its own behavior in pointermove and pointerup listeners for the remaining gestures.
Applications using Touch events disable the browser handling of gestures by calling preventDefault(), but should also use touch-action to ensure the browser knows the intent of the application before any event listeners have been invoked.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action

---

## touch-action 값은 터치된 요소와 조상 요소 사이에서 어떻게 결정되는가?

### Official Answer
When a gesture is started, the browser intersects the touch-action values of the touched element and its ancestors, up to the one that implements the gesture (in other words, the first containing scrolling element).
This means that in practice, touch-action is typically applied only to top-level elements which have some custom behavior, without needing to specify touch-action explicitly on any of that element's descendants.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action
