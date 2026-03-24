---
tags: [browser, performance, concept]
---

# Questions
## Parsing
- [During HTML parsing, what happens when the browser encounters a `<script>` tag without `async` or `defer`? How does this differ from other resources like images?](#during-html-parsing-what-happens-when-the-browser-encounters-a-script-tag-without-async-or-defer-how-does-this-differ-from-other-resources-like-images)
- [While the browser is building the DOM tree, resource downloads could be delayed. How does the browser mitigate this problem?](#while-the-browser-is-building-the-dom-tree-resource-downloads-could-be-delayed-how-does-the-browser-mitigate-this-problem)
- [Is it okay to place `<link rel="stylesheet">` in `<head>` without blocking HTML parsing? Then why does CSS block JavaScript execution?](#is-it-okay-to-place-link-relstylesheet-in-head-without-blocking-html-parsing-then-why-does-css-block-javascript-execution)
## CSSOM
- [What is CSSOM (CSS Object Model), and what is its relationship with the DOM?](#what-is-cssom-css-object-model-and-what-is-its-relationship-with-the-dom)
- [How does the browser build the CSSOM tree from the CSS it receives?](#how-does-the-browser-build-the-cssom-tree-from-the-css-it-receives)
  - [Is CSSOM construction a performance bottleneck? How do you observe it in DevTools?](#is-cssom-construction-a-performance-bottleneck-how-do-you-observe-it-in-devtools)
## Render
- [How is the Render Tree constructed after parsing is complete?](#how-is-the-render-tree-constructed-after-parsing-is-complete)
  - [How are `display: none` and `visibility: hidden` treated differently in the Render Tree?](#how-are-display-none-and-visibility-hidden-treated-differently-in-the-render-tree)
## Layout
- [What does the browser do during the Layout stage after the Render Tree is built?](#what-does-the-browser-do-during-the-layout-stage-after-the-render-tree-is-built)
  - [What is the difference between Layout and Reflow, and why does Reflow occur?](#what-is-the-difference-between-layout-and-reflow-and-why-does-reflow-occur)
## Paint
- [How many milliseconds must the browser complete a frame in for smooth animation, and what strategy improves Paint performance?](#how-many-milliseconds-must-the-browser-complete-a-frame-in-for-smooth-animation-and-what-strategy-improves-paint-performance)
  - [Does creating more GPU layers always improve performance?](#does-creating-more-gpu-layers-always-improve-performance)

---

# Answers

## During HTML parsing, what happens when the browser encounters a `<script>` tag without `async` or `defer`? How does this differ from other resources like images?

### Official Answer
When the HTML parser finds non-blocking resources, such as an image, the browser will request those resources and continue parsing.
Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML.

> AI Annotation: 이미지와 CSS는 파싱을 멈추지 않지만, async/defer 없는 `<script>`는 HTML 파싱 자체를 중단시킨다.
> 스크립트가 DOM을 수정할 수 있기 때문에 실행이 끝날 때까지 파서가 대기한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## While the browser is building the DOM tree, resource downloads could be delayed. How does the browser mitigate this problem?

### Official Answer
While the browser builds the DOM tree, this process occupies the main thread.
As this happens, the preload scanner will parse through the content available and request high-priority resources like CSS, JavaScript, and web fonts.
Thanks to the preload scanner, we don't have to wait until the parser finds a reference to an external resource to request it.
It will retrieve resources in the background so that by the time the main HTML parser reaches the requested assets, they may already be in flight or have been downloaded.

> AI Annotation: 메인 스레드가 DOM 구축에 바쁜 동안, preload scanner가 별도로 HTML을 미리 훑어 CSS, JS, 웹폰트 등 고우선순위 리소스의 다운로드를 선제적으로 시작한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Is it okay to place `<link rel="stylesheet">` in `<head>` without blocking HTML parsing? Then why does CSS block JavaScript execution?

### Official Answer
Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML.
Waiting to obtain CSS doesn't block HTML parsing or downloading, but it does block JavaScript because JavaScript is often used to query CSS properties' impact on elements.

> AI Annotation: CSS 파일을 만나도 파싱은 계속된다.
> CSS를 기다리는 것은 HTML 파싱이나 다운로드를 막지 않지만, JavaScript는 막는다.
> JavaScript가 CSS 속성이 요소에 미치는 영향을 조회하는 데 자주 사용되기 때문이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## What is CSSOM (CSS Object Model), and what is its relationship with the DOM?

### Official Answer
The CSS Object Model is a set of APIs allowing the manipulation of CSS from JavaScript.
It is much like the DOM, but for the CSS rather than the HTML.
It allows users to read and modify CSS style dynamically.

> Official Annotation: The CSSStyleDeclaration interface is the base class for objects that represent CSS declaration blocks with different supported sets of CSS style information:
> CSSStyleProperties — CSS styles declared in stylesheet (CSSStyleRule.style), inline styles for an element such as HTMLElement, SVGElement, and MathMLElement, or the computed style for an element returned by Window.getComputedStyle().

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model
- https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration

---

## How does the browser build the CSSOM tree from the CSS it receives?

### Official Answer
The browser converts the CSS rules into a map of styles it can understand and work with.
The browser goes through each rule set in the CSS, creating a tree of nodes with parent, child, and sibling relationships based on the CSS selectors.
As with HTML, the browser needs to convert the received CSS rules into something it can work with.
Hence, it repeats the HTML-to-object process, but for the CSS.

> AI Annotation: 브라우저는 CSS 규칙을 트리 구조로 변환한다.
> HTML을 DOM으로 바꾸는 것과 같은 과정을 CSS에 대해 반복한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Is CSSOM construction a performance bottleneck? How do you observe it in DevTools?

### Official Answer
Building the CSSOM is very, very fast, and this build time information is not displayed in the developer tools.
Rather, the "Recalculate Style" in developer tools shows the total time it takes to parse CSS, construct the CSSOM tree, and recursively calculate computed styles.
In terms of web performance, there are many better ways to invest optimization effort, as the total time to create the CSSOM is generally less than the time it takes for one DNS lookup.

> AI Annotation: CSSOM 구축은 매우 빠르며 DNS lookup 1회보다도 짧다.
> DevTools에서는 별도로 안 보이고, "Recalculate Style"이 CSS 파싱 + CSSOM 구축 + computed styles 계산을 합친 시간이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## How is the Render Tree constructed after parsing is complete?

### Official Answer
The CSSOM and DOM trees created in the parsing step are combined into a render tree which is then used to compute the layout of every visible element, which is then painted to the screen.
The computed style tree, or render tree, construction starts with the root of the DOM tree, traversing each visible node.
The render tree holds all the visible nodes with content and computed styles — matching up all the relevant styles to every visible node in the DOM tree, and determining, based on the CSS cascade, what the computed styles are for each node.

> AI Annotation: 파싱 단계에서 만든 DOM과 CSSOM을 합쳐서 Render Tree를 만든다.
> DOM 트리의 루트부터 보이는 노드만 순회하며, 각 노드에 CSS cascade를 거친 computed styles를 매칭한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## How are `display: none` and `visibility: hidden` treated differently in the Render Tree?

### Official Answer
Elements that aren't going to be displayed, like the `<head>` element and its children and any nodes with `display: none`, such as the `script { display: none; }` you will find in user agent stylesheets, are not included in the render tree as they will not appear in the rendered output.
Nodes with `visibility: hidden` applied are included in the render tree, as they do take up space.

> AI Annotation: `display: none`은 렌더링 출력에 나타나지 않으므로 Render Tree에서 제외된다.
> `visibility: hidden`은 공간을 차지하므로 Render Tree에 포함된다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## What does the browser do during the Layout stage after the Render Tree is built?

### Official Answer
Layout is the process by which the dimensions and location of all the nodes in the render tree are determined, plus the determination of the size and position of each object on the page.
Taking the size of the viewport as its base, layout generally starts with the body, laying out the sizes of all the body's descendants, with each element's box model properties, providing placeholder space for replaced elements it doesn't know the dimensions of, such as our image.

> AI Annotation: Layout은 Render Tree의 모든 노드의 크기와 위치를 결정하는 과정이다.
> viewport 크기를 기준으로 body부터 시작해 자식 요소들의 box model 속성을 계산해 내려간다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## What is the difference between Layout and Reflow, and why does Reflow occur?

### Official Answer
The first time the size and position of each node is determined is called layout.
Subsequent recalculations of layout are called reflows.
In our example, suppose the initial layout occurs before the image is returned.
Since we didn't declare the dimensions of our image, there will be a reflow once the image dimensions are known.

> AI Annotation: 최초 계산이 Layout, 이후 재계산이 Reflow다.
> 예를 들어 이미지에 크기를 선언하지 않으면, 이미지 로드 후 크기가 확정될 때 reflow가 발생한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## How many milliseconds must the browser complete a frame in for smooth animation, and what strategy improves Paint performance?

### Official Answer
To ensure smooth scrolling and animation, everything occupying the main thread, including calculating styles, along with reflow and paint, must take the browser less than 16.67ms to accomplish.
Painting can break the elements in the layout tree into layers.
Promoting content into layers on the GPU (instead of the main thread on the CPU) improves paint and repaint performance.
There are specific properties and elements that instantiate a layer, including `<video>` and `<canvas>`, and any element which has the CSS properties of opacity, a 3D transform, will-change, and a few others.

> AI Annotation: 60fps를 유지하려면 한 프레임당 16.67ms 안에 style, reflow, paint를 모두 끝내야 한다.
> 이를 위해 요소를 별도 레이어로 분리해 GPU에서 처리(compositing)할 수 있다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Does creating more GPU layers always improve performance?

### Official Answer
Layers do improve performance but are expensive when it comes to memory management, so should not be overused as part of web performance optimization strategies.

> AI Annotation: 아니다. 레이어는 GPU 메모리를 소모하므로 남용하면 오히려 메모리 문제가 생긴다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
