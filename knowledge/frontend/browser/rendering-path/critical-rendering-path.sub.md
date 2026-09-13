---
tags: [browser, performance, concept]
source: official
---
# Questions
## Paint
- 부드러운 애니메이션을 위해 브라우저는 한 프레임을 몇 밀리초 안에 완료해야 하며, Paint 성능을 개선하는 전략은?
  - GPU 레이어를 더 많이 만들면 항상 성능이 좋아지는가?
## Parsing
- `<head>`에 `<link rel="stylesheet">`를 넣어도 HTML 파싱을 막지 않는다면, CSS가 JavaScript 실행을 막는 이유는?
  - [UNVERIFIED] CSS가 렌더 블로킹이라면서 왜 `<link>`를 `<head>`에 넣으라고 하나? `<body>` 끝에 넣으면 더 빠르지 않나?
## CSSOM
- CSSOM(CSS Object Model)이란 무엇이며, DOM과의 관계는?
  - [UNVERIFIED] CSS 파일 다운로드를 기다리는 동안 DOM은 어떤 상태인가?
## Optimization
- [UNVERIFIED] Critical Rendering Path 전체에서 성능을 개선하려면 어디를 건드려야 하나?
  - [UNVERIFIED] CRP 최적화 전략 중 ROI가 가장 높은 한 가지는?
  - [UNVERIFIED] 코드 스플리팅은 렌더링 파이프라인의 어느 단계에 영향을 주나?

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

---

## `<head>`에 `<link rel="stylesheet">`를 넣어도 HTML 파싱을 막지 않는다면, CSS가 JavaScript 실행을 막는 이유는?

### Official Answer
Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML.
Waiting to obtain CSS doesn't block HTML parsing or downloading, but it does block JavaScript because JavaScript is often used to query CSS properties' impact on elements.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## [UNVERIFIED] CSS가 렌더 블로킹이라면서 왜 `<link>`를 `<head>`에 넣으라고 하나? `<body>` 끝에 넣으면 더 빠르지 않나?

### Additional Answer
CSS는 렌더 블로킹이지만, `<head>`에 넣으면 다운로드가 일찍 시작되어 CSSOM 구축이 빨라진다.
`<body>` 끝에 넣으면 파싱은 빨라지는 것처럼 보이지만, CSS가 늦게 도착하면 FOUC(Flash of Unstyled Content)가 발생하고 렌더트리 합성이 지연된다.
결국 사용자가 보는 첫 화면이 더 느려지는 트레이드오프가 있다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## CSSOM(CSS Object Model)이란 무엇이며, DOM과의 관계는?

### Official Answer
The CSS Object Model is a set of APIs allowing the manipulation of CSS from JavaScript.
It is much like the DOM, but for the CSS rather than the HTML.
It allows users to read and modify CSS style dynamically.

The CSSStyleDeclaration interface is the base class for objects that represent CSS declaration blocks with different supported sets of CSS style information:
CSSStyleProperties — CSS styles declared in stylesheet (CSSStyleRule.style), inline styles for an element such as HTMLElement, SVGElement, and MathMLElement, or the computed style for an element returned by Window.getComputedStyle().

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model
- https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration

---

## [UNVERIFIED] CSS 파일 다운로드를 기다리는 동안 DOM은 어떤 상태인가?

### Additional Answer
CSS 파일을 기다리는 동안에도 HTML 파싱과 DOM 구축은 계속 진행된다.
하지만 DOM + CSSOM이 합쳐져야 렌더트리가 만들어지므로, CSSOM이 완성될 때까지 렌더링(화면 표시)은 블로킹된다.
즉, DOM은 "만들어지고 있지만 아직 화면에 그려지지 않는" 상태다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## [UNVERIFIED] Critical Rendering Path 전체에서 성능을 개선하려면 어디를 건드려야 하나?

### Additional Answer
크리티컬 렌더링 패스를 줄이는 것이 핵심이다.
CSS 인라인/최소화, JS defer, 리소스 프리로드, 레이아웃 스래싱 방지 등의 기법이 있다.
네트워크(리소스 수·크기), 파싱(블로킹 리소스), 렌더링(리플로우/리페인트) 각 단계별 최적화 포인트가 다르다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS

---

## [UNVERIFIED] CRP 최적화 전략 중 ROI가 가장 높은 한 가지는?

### Additional Answer
상황에 따라 다르지만, 일반적으로 크리티컬 렌더링 패스에서 블로킹 리소스를 제거하거나 줄이는 것이 가장 높은 ROI를 가진다.
CSS 인라인화 + JS defer만으로도 초기 렌더링 속도가 크게 개선되는 경우가 많다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path

---

## [UNVERIFIED] 코드 스플리팅은 렌더링 파이프라인의 어느 단계에 영향을 주나?

### Additional Answer
코드 스플리팅은 주로 파싱 단계에 영향을 준다.
초기 로드 시 필요한 JS 번들 크기를 줄여서, 스크립트 다운로드·파싱·실행으로 인한 메인 스레드 블로킹 시간을 단축한다.
결과적으로 DOM 파싱 완료와 렌더트리 합성이 빨라진다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path
