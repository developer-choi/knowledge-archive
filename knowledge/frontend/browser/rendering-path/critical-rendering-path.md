---
tags: [browser, performance, concept]
source: official
priority: 1
---

# Questions
## Overview
- Critical Rendering Path(CRP)란 무엇이며, 어떤 단계로 구성되는가?
  - 수천 개의 리스트 항목 렌더링 시 성능 문제가 발생하는 이유는?
  - CRP 렌더링 과정은 한 번만 일어나는가?
## Parsing
- HTML 파싱 중 `async`나 `defer` 없는 `<script>` 태그를 만나면 어떻게 되는가?
- DOM 트리 구축 중 리소스 다운로드가 지연될 수 있는데, 브라우저는 이를 어떻게 완화하는가?
  - [UNVERIFIED] 외부 CSS 파일(`<link>`)을 만나면 브라우저는 어떻게 처리하나?
## Render
- Render Tree에서 `display: none`과 `visibility: hidden`은 어떻게 다르게 처리되는가?
## Layout
- Render Tree 구축 후 Layout 단계에서 브라우저는 무엇을 하는가?
  - Layout과 Reflow의 차이는 무엇이고, Reflow는 왜 발생하는가?
  - Compositing은 왜 필요한가?

---

# Answers

## Critical Rendering Path(CRP)란 무엇이며, 어떤 단계로 구성되는가?

### Official Answer
The Critical Rendering Path is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen.
Optimizing the critical render path improves render performance.

The critical rendering path refers to the steps involved until the web page starts rendering in the browser.
To render pages, browsers need the HTML document itself as well as all the critical resources necessary for rendering that document.
The sequence of steps the browser takes before performing that initial render is known as the critical rendering path.

#### Steps of Critical Rendering Path

- Constructing the Document Object Model (DOM) from the HTML.
- Constructing the CSS Object Model (CSSOM) from the CSS.
- Applying any JavaScript that alters the DOM or CSSOM.
- Constructing the render tree from the DOM and CSSOM.
- Perform style and layout operations on the page to see what elements fit where.
- Paint the pixels of the elements in memory.
- Composite the pixels if any of them overlap.
- Physically draw all the resulting pixels to screen.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path
- https://web.dev/learn/performance/understanding-the-critical-path

---

## 수천 개의 리스트 항목 렌더링 시 성능 문제가 발생하는 이유는?

### Official Answer
The greater the number of nodes, the longer the following events in the critical rendering path will take.
Measure!
A few extra nodes won't make a big difference, but keep in mind that adding many extra nodes will impact performance.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path

---

## CRP 렌더링 과정은 한 번만 일어나는가?

### Official Answer
This rendering process happens multiple times.
The initial render invokes this process, but as more resources that affect the page's rendering become available, the browser will re-run this process.

### Reference
- https://web.dev/learn/performance/understanding-the-critical-path

---

## HTML 파싱 중 `async`나 `defer` 없는 `<script>` 태그를 만나면 어떻게 되는가?

### Official Answer
When the HTML parser finds non-blocking resources, such as an image, the browser will request those resources and continue parsing.
Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## DOM 트리 구축 중 리소스 다운로드가 지연될 수 있는데, 브라우저는 이를 어떻게 완화하는가?

### Official Answer
While the browser builds the DOM tree, this process occupies the main thread.
As this happens, the preload scanner will parse through the content available and request high-priority resources like CSS, JavaScript, and web fonts.
Thanks to the preload scanner, we don't have to wait until the parser finds a reference to an external resource to request it.
It will retrieve resources in the background so that by the time the main HTML parser reaches the requested assets, they may already be in flight or have been downloaded.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## [UNVERIFIED] 외부 CSS 파일(`<link>`)을 만나면 브라우저는 어떻게 처리하나?

### Additional Answer
preload scanner가 `<link>` 태그를 미리 발견하고 CSS 파일 다운로드를 시작한다.
CSS 파일을 만나도 HTML 파싱은 중단되지 않고 계속 진행된다.
다운로드된 CSS는 별도로 CSSOM을 구축하는 데 사용된다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Render Tree에서 `display: none`과 `visibility: hidden`은 어떻게 다르게 처리되는가?

### Official Answer
Elements that aren't going to be displayed, like the `<head>` element and its children and any nodes with `display: none`, such as the `script { display: none; }` you will find in user agent stylesheets, are not included in the render tree as they will not appear in the rendered output.
Nodes with `visibility: hidden` applied are included in the render tree, as they do take up space.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Render Tree 구축 후 Layout 단계에서 브라우저는 무엇을 하는가?

### Official Answer
Layout is the process by which the dimensions and location of all the nodes in the render tree are determined, plus the determination of the size and position of each object on the page.
Taking the size of the viewport as its base, layout generally starts with the body, laying out the sizes of all the body's descendants, with each element's box model properties, providing placeholder space for replaced elements it doesn't know the dimensions of, such as our image.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Layout과 Reflow의 차이는 무엇이고, Reflow는 왜 발생하는가?

### Official Answer
The first time the size and position of each node is determined is called layout.
Subsequent recalculations of layout are called reflows.
In our example, suppose the initial layout occurs before the image is returned.
Since we didn't declare the dimensions of our image, there will be a reflow once the image dimensions are known.

A reflow sparks a repaint and a re-composite.
Had we defined the dimensions of our image, no reflow would have been necessary, and only the layer that needed to be repainted would be repainted, and composited if necessary.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Compositing은 왜 필요한가?

### Official Answer
When sections of the document are drawn in different layers, overlapping each other, compositing is necessary to ensure they are drawn to the screen in the right order and the content is rendered correctly.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work#compositing
