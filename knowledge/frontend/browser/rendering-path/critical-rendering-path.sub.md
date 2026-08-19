---
tags: [browser, performance, concept]
source: official
---

# Questions
## Paint
- 부드러운 애니메이션을 위해 브라우저는 한 프레임을 몇 밀리초 안에 완료해야 하며, Paint 성능을 개선하는 전략은?
  - GPU 레이어를 더 많이 만들면 항상 성능이 좋아지는가?

---

# Answers

## 부드러운 애니메이션을 위해 브라우저는 한 프레임을 몇 밀리초 안에 완료해야 하며, Paint 성능을 개선하는 전략은?

### Official Answer
To ensure smooth scrolling and animation, everything occupying the main thread, including calculating styles, along with reflow and paint, must take the browser less than 16.67ms to accomplish.
Painting can break the elements in the layout tree into layers.
Promoting content into layers on the GPU (instead of the main thread on the CPU) improves paint and repaint performance.
There are specific properties and elements that instantiate a layer, including `<video>` and `<canvas>`, and any element which has the CSS properties of opacity, a 3D transform, will-change, and a few others.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## GPU 레이어를 더 많이 만들면 항상 성능이 좋아지는가?

### Official Answer
Layers do improve performance but are expensive when it comes to memory management, so should not be overused as part of web performance optimization strategies.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
