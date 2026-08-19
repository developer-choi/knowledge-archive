# 부드러운 애니메이션을 위해 브라우저는 한 프레임을 몇 밀리초 안에 완료해야 하며, Paint 성능을 개선하는 전략은?

## 도입

60fps(초당 60프레임) 애니메이션을 유지하려면 한 프레임을 처리하는 데 16.67ms밖에 없다. Style, Layout, Paint가 모두 이 시간 안에 끝나야 한다.

---

## 본문

> To ensure smooth scrolling and animation, everything occupying the main thread, including calculating styles, along with reflow and paint, must take the browser less than 16.67ms to accomplish.

"부드러운 스크롤과 애니메이션을 보장하려면 스타일 계산, reflow, paint를 포함하여 메인 스레드를 점유하는 모든 것이 16.67ms 미만에 완료되어야 한다."

- **16.67ms**: 1초 ÷ 60프레임 = 16.67ms. 이 시간을 초과하면 프레임이 드롭되어 버벅임(jank)이 발생한다. 120fps 디바이스에서는 8.33ms로 더 촉박하다.

> Painting can break the elements in the layout tree into layers. Promoting content into layers on the GPU (instead of the main thread on the CPU) improves paint and repaint performance. There are specific properties and elements that instantiate a layer, including `<video>` and `<canvas>`, and any element which has the CSS properties of opacity, a 3D transform, will-change, and a few others.

"Paint는 레이아웃 트리의 요소들을 레이어로 분리할 수 있다. 콘텐츠를 CPU의 메인 스레드 대신 GPU 레이어로 승격시키면 paint와 repaint 성능이 향상된다. `<video>`, `<canvas>`, opacity, 3D transform, will-change 등의 CSS 속성을 가진 요소들이 레이어를 생성한다."

- **Promoting content into layers**: GPU 레이어로 승격. `will-change: transform`이나 `transform: translateZ(0)`으로 강제 승격할 수 있다.
- **opacity, a 3D transform, will-change**: 이 속성들이 있으면 브라우저가 해당 요소를 자동으로 별도 레이어로 분리한다. 레이어 변경은 CPU를 거치지 않고 GPU에서 직접 합성된다.

---

## 종합

DevTools Performance 탭에서 빨간 "Long Task" 표시와 "Layout", "Paint" 블록이 16ms를 초과하면 프레임 드롭이 발생하고 있다는 신호다. `transform`과 `opacity`만으로 애니메이션하면 GPU Composite만 실행되므로 메인 스레드를 점유하지 않아 16ms 제약에서 자유롭다. Motion의 `animate` prop이 기본으로 `transform`을 사용하는 이유가 바로 이 때문이다.

---

# GPU 레이어를 더 많이 만들면 항상 성능이 좋아지는가?

## 도입

GPU 레이어가 성능을 높이는 도구이지만, 남용하면 오히려 역효과가 난다.

---

## 본문

> Layers do improve performance but are expensive when it comes to memory management, so should not be overused as part of web performance optimization strategies.

"레이어는 성능을 개선하지만 메모리 관리 측면에서 비용이 크므로, 웹 성능 최적화 전략의 일환으로 남용되어서는 안 된다."

- **expensive when it comes to memory management**: GPU 레이어는 GPU 메모리(VRAM)를 소비한다. 레이어가 너무 많으면 VRAM이 부족해져 오히려 성능이 나빠진다.
- **should not be overused**: "모든 요소에 `will-change: transform`을 붙이면 더 좋지 않냐"는 생각이 틀린 이유. 레이어 생성 비용이 이득을 초과한다.

---

## 종합

`will-change: transform`은 "이 요소는 곧 transform 애니메이션이 실행될 것이니 미리 GPU 레이어를 준비해달라"는 힌트다. 실제로 애니메이션이 없는 정적 요소에 이 속성을 남발하면 GPU 메모리만 낭비된다. 애니메이션이 실제로 실행되는 요소에만 선택적으로 적용하고, 애니메이션이 끝나면 `will-change: auto`로 되돌리는 것이 올바른 사용법이다.
