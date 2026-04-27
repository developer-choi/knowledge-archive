---
tags: [browser, performance, concept]
---

# Questions
## Overview
- Critical Rendering Path(CRP)란 무엇이며, 어떤 단계로 구성되는가?
  - 수천 개의 리스트 항목 렌더링 시 성능 문제가 발생하는 이유는?
  - 네이티브 앱과 달리 웹 브라우저가 progressive rendering을 할 수밖에 없는 이유는?
  - CRP를 너무 이르게/너무 늦게 수행하면 각각 어떤 문제가 생기는가?
  - CRP 렌더링 과정은 한 번만 일어나는가?
## Parsing
- HTML 파싱 중 `async`나 `defer` 없는 `<script>` 태그를 만나면 어떻게 되는가?
- DOM 트리 구축 중 리소스 다운로드가 지연될 수 있는데, 브라우저는 이를 어떻게 완화하는가?
  - 외부 CSS 파일(`<link>`)을 만나면 브라우저는 어떻게 처리하나?
- `<head>`에 `<link rel="stylesheet">`를 넣어도 HTML 파싱을 막지 않는다면, CSS가 JavaScript 실행을 막는 이유는?
  - CSS가 렌더 블로킹이라면서 왜 `<link>`를 `<head>`에 넣으라고 하나? `<body>` 끝에 넣으면 더 빠르지 않나?
## CSSOM
- CSSOM(CSS Object Model)이란 무엇이며, DOM과의 관계는?
  - CSS 파일 다운로드를 기다리는 동안 DOM은 어떤 상태인가?
- 브라우저는 수신한 CSS로 CSSOM 트리를 어떻게 구축하는가?
  - CSSOM 구축은 성능 병목인가? DevTools에서 어떻게 확인하는가?
  - CSSOM은 어떻게 구축되며, DOM 구축과 어떻게 다른가?
## Optimization
- Critical Rendering Path 전체에서 성능을 개선하려면 어디를 건드려야 하나?
  - CRP 최적화 전략 중 ROI가 가장 높은 한 가지는?
  - 코드 스플리팅은 렌더링 파이프라인의 어느 단계에 영향을 주나?
## Render
- 파싱 완료 후 Render Tree는 어떻게 구성되는가?
  - Render Tree에서 `display: none`과 `visibility: hidden`은 어떻게 다르게 처리되는가?
## Layout
- Render Tree 구축 후 Layout 단계에서 브라우저는 무엇을 하는가?
  - Layout과 Reflow의 차이는 무엇이고, Reflow는 왜 발생하는가?
  - Compositing은 왜 필요하며 무엇을 보장하는가?
## Paint
- 부드러운 애니메이션을 위해 브라우저는 한 프레임을 몇 밀리초 안에 완료해야 하며, Paint 성능을 개선하는 전략은?
  - GPU 레이어를 더 많이 만들면 항상 성능이 좋아지는가?

---

# Answers

## Critical Rendering Path(CRP)란 무엇이며, 어떤 단계로 구성되는가?

### Official Answer
The Critical Rendering Path is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen.
Optimizing the critical render path improves render performance.

> #### Official Annotation:
> The critical rendering path refers to the steps involved until the web page starts rendering in the browser.
> To render pages, browsers need the HTML document itself as well as all the critical resources necessary for rendering that document.
> The sequence of steps the browser takes before performing that initial render is known as the critical rendering path.

> #### Official Annotation:
> The steps of Critical rendering path:
> - Constructing the Document Object Model (DOM) from the HTML.
> - Constructing the CSS Object Model (CSSOM) from the CSS.
> - Applying any JavaScript that alters the DOM or CSSOM.
> - Constructing the render tree from the DOM and CSSOM.
> - Perform style and layout operations on the page to see what elements fit where.
> - Paint the pixels of the elements in memory.
> - Composite the pixels if any of them overlap.
> - Physically draw all the resulting pixels to screen.

> #### AI Annotation:
> CRP는 브라우저가 HTML, CSS, JS를 화면 픽셀로 변환하는 일련의 단계다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path
- https://web.dev/learn/performance/understanding-the-critical-path

---

## 수천 개의 리스트 항목 렌더링 시 성능 문제가 발생하는 이유는?

### Official Answer
The greater the number of nodes, the longer the following events in the critical rendering path will take.
Measure!
A few extra nodes won't make a big difference, but keep in mind that adding many extra nodes will impact performance.

> #### AI Annotation:
> DOM 노드가 많을수록 CRP의 이후 단계(Style, Layout, Paint)가 느려진다.
> 몇 개 차이는 무의미하지만 대량으로 많아지면 성능에 영향을 준다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path

---

## 네이티브 앱과 달리 웹 브라우저가 progressive rendering을 할 수밖에 없는 이유는?

### Official Answer
The web is distributed by nature.
Unlike native applications that are installed before use, browsers cannot depend on websites having all the resources necessary to render the page.

Native apps typically have an install phase, and then a running phase.
However, for web pages and web apps, the lines between these two phases are much less distinct, and browsers have been specifically designed with that in mind.

Therefore, browsers are very good at rendering pages progressively.

> #### Key Terms:
> - **progressive rendering**: 가용한 리소스부터 점진적으로 화면을 그리는 방식
> - **install phase / running phase**: 네이티브 앱의 설치 단계와 실행 단계 구분

> #### User Annotation:
> 앱처럼 phase가 2개로 명확히 나뉜 게 아니라서, 브라우저는 progressively하게 렌더링할 수밖에 없었음.
> 그 고민의 결과가 지금 웹 브라우저들의 동작 방식 — DOM + CSSOM ⇒ Render Tree ⇒ ... 절차들임.

### Reference
- https://web.dev/learn/performance/understanding-the-critical-path

---

## CRP를 너무 이르게/너무 늦게 수행하면 각각 어떤 문제가 생기는가?

### Official Answer
If the browser renders as soon as possible when it just has some HTML—but before it has any CSS or necessary JavaScript—then the page will momentarily look broken and change considerably for the final render.

On the other hand, if the browser waits for all resources to be available instead of doing any sequential rendering, then the user will be left waiting for a long time; often unnecessarily so if the page was usable at a much earlier point in time.

The browser needs to know what the minimum number of resources it should wait for in order to avoid presenting an obviously broken experience.
On the other hand, the browser also shouldn't wait longer than necessary before presenting the user with some content.

> #### User Annotation:
> 너무 이르게 화면을 보여줘도, 너무 늦게 화면을 보여줘도 안 되므로,
> "최소한 이 정도는 해야 화면에 보여줄 수 있다"라는 기준이 CRP다.

### Reference
- https://web.dev/learn/performance/understanding-the-critical-path

---

## CRP 렌더링 과정은 한 번만 일어나는가?

### Official Answer
This rendering process happens multiple times.
The initial render invokes this process, but as more resources that affect the page's rendering become available, the browser will re-run this process.

> #### User Annotation:
> 한 번만 발생하는 게 아님 — 새 리소스가 도착할 때마다 다시 실행된다.

### Reference
- https://web.dev/learn/performance/understanding-the-critical-path

---

## HTML 파싱 중 `async`나 `defer` 없는 `<script>` 태그를 만나면 어떻게 되는가?

### Official Answer
When the HTML parser finds non-blocking resources, such as an image, the browser will request those resources and continue parsing.
Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML.

> #### AI Annotation:
> 이미지와 CSS는 파싱을 멈추지 않지만, async/defer 없는 `<script>`는 HTML 파싱 자체를 중단시킨다.
> 스크립트가 DOM을 수정할 수 있기 때문에 실행이 끝날 때까지 파서가 대기한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## DOM 트리 구축 중 리소스 다운로드가 지연될 수 있는데, 브라우저는 이를 어떻게 완화하는가?

### Official Answer
While the browser builds the DOM tree, this process occupies the main thread.
As this happens, the preload scanner will parse through the content available and request high-priority resources like CSS, JavaScript, and web fonts.
Thanks to the preload scanner, we don't have to wait until the parser finds a reference to an external resource to request it.
It will retrieve resources in the background so that by the time the main HTML parser reaches the requested assets, they may already be in flight or have been downloaded.

> #### AI Annotation:
> 메인 스레드가 DOM 구축에 바쁜 동안, preload scanner가 별도로 HTML을 미리 훑어 CSS, JS, 웹폰트 등 고우선순위 리소스의 다운로드를 선제적으로 시작한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## 외부 CSS 파일(`<link>`)을 만나면 브라우저는 어떻게 처리하나?

### AI Answer
preload scanner가 `<link>` 태그를 미리 발견하고 CSS 파일 다운로드를 시작한다.
CSS 파일을 만나도 HTML 파싱은 중단되지 않고 계속 진행된다.
다운로드된 CSS는 별도로 CSSOM을 구축하는 데 사용된다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## `<head>`에 `<link rel="stylesheet">`를 넣어도 HTML 파싱을 막지 않는다면, CSS가 JavaScript 실행을 막는 이유는?

### Official Answer
Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML.
Waiting to obtain CSS doesn't block HTML parsing or downloading, but it does block JavaScript because JavaScript is often used to query CSS properties' impact on elements.

> #### AI Annotation:
> CSS 파일을 만나도 파싱은 계속된다.
> CSS를 기다리는 것은 HTML 파싱이나 다운로드를 막지 않지만, JavaScript는 막는다.
> JavaScript가 CSS 속성이 요소에 미치는 영향을 조회하는 데 자주 사용되기 때문이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## CSS가 렌더 블로킹이라면서 왜 `<link>`를 `<head>`에 넣으라고 하나? `<body>` 끝에 넣으면 더 빠르지 않나?

### AI Answer
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

> #### Official Annotation: The CSSStyleDeclaration interface is the base class for objects that represent CSS declaration blocks with different supported sets of CSS style information:
> CSSStyleProperties — CSS styles declared in stylesheet (CSSStyleRule.style), inline styles for an element such as HTMLElement, SVGElement, and MathMLElement, or the computed style for an element returned by Window.getComputedStyle().

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model
- https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration

---

## CSS 파일 다운로드를 기다리는 동안 DOM은 어떤 상태인가?

### AI Answer
CSS 파일을 기다리는 동안에도 HTML 파싱과 DOM 구축은 계속 진행된다.
하지만 DOM + CSSOM이 합쳐져야 렌더트리가 만들어지므로, CSSOM이 완성될 때까지 렌더링(화면 표시)은 블로킹된다.
즉, DOM은 "만들어지고 있지만 아직 화면에 그려지지 않는" 상태다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## 브라우저는 수신한 CSS로 CSSOM 트리를 어떻게 구축하는가?

### Official Answer
The browser converts the CSS rules into a map of styles it can understand and work with.
The browser goes through each rule set in the CSS, creating a tree of nodes with parent, child, and sibling relationships based on the CSS selectors.
As with HTML, the browser needs to convert the received CSS rules into something it can work with.
Hence, it repeats the HTML-to-object process, but for the CSS.

> #### AI Annotation:
> 브라우저는 CSS 규칙을 트리 구조로 변환한다.
> HTML을 DOM으로 바꾸는 것과 같은 과정을 CSS에 대해 반복한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## CSSOM 구축은 성능 병목인가? DevTools에서 어떻게 확인하는가?

### Official Answer
Building the CSSOM is very, very fast, and this build time information is not displayed in the developer tools.
Rather, the "Recalculate Style" in developer tools shows the total time it takes to parse CSS, construct the CSSOM tree, and recursively calculate computed styles.
In terms of web performance, there are many better ways to invest optimization effort, as the total time to create the CSSOM is generally less than the time it takes for one DNS lookup.

> #### AI Annotation:
> CSSOM 구축은 매우 빠르며 DNS lookup 1회보다도 짧다.
> DevTools에서는 별도로 안 보이고, "Recalculate Style"이 CSS 파싱 + CSSOM 구축 + computed styles 계산을 합친 시간이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## CSSOM은 어떻게 구축되며, DOM 구축과 어떻게 다른가?

### Official Answer

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path#css_object_model

---

## Critical Rendering Path 전체에서 성능을 개선하려면 어디를 건드려야 하나?

### AI Answer
크리티컬 렌더링 패스를 줄이는 것이 핵심이다.
CSS 인라인/최소화, JS defer, 리소스 프리로드, 레이아웃 스래싱 방지 등의 기법이 있다.
네트워크(리소스 수·크기), 파싱(블로킹 리소스), 렌더링(리플로우/리페인트) 각 단계별 최적화 포인트가 다르다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS

---

## CRP 최적화 전략 중 ROI가 가장 높은 한 가지는?

### AI Answer
상황에 따라 다르지만, 일반적으로 크리티컬 렌더링 패스에서 블로킹 리소스를 제거하거나 줄이는 것이 가장 높은 ROI를 가진다.
CSS 인라인화 + JS defer만으로도 초기 렌더링 속도가 크게 개선되는 경우가 많다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path

---

## 코드 스플리팅은 렌더링 파이프라인의 어느 단계에 영향을 주나?

### AI Answer
코드 스플리팅은 주로 파싱 단계에 영향을 준다.
초기 로드 시 필요한 JS 번들 크기를 줄여서, 스크립트 다운로드·파싱·실행으로 인한 메인 스레드 블로킹 시간을 단축한다.
결과적으로 DOM 파싱 완료와 렌더트리 합성이 빨라진다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path

---

## 파싱 완료 후 Render Tree는 어떻게 구성되는가?

### Official Answer
The CSSOM and DOM trees created in the parsing step are combined into a render tree which is then used to compute the layout of every visible element, which is then painted to the screen.
The computed style tree, or render tree, construction starts with the root of the DOM tree, traversing each visible node.
The render tree holds all the visible nodes with content and computed styles — matching up all the relevant styles to every visible node in the DOM tree, and determining, based on the CSS cascade, what the computed styles are for each node.

> #### Official Annotation:
> Rendering steps include style, layout, paint, and in some cases compositing.
> The CSSOM and DOM trees created in the parsing step are combined into a render tree which is then used to compute the layout of every visible element, which is then painted to the screen.
> In some cases, content can be promoted to its own layer and composited, improving performance by painting portions of the screen on the GPU instead of the CPU, freeing up the main thread.

> #### AI Annotation:
> 파싱 단계에서 만든 DOM과 CSSOM을 합쳐서 Render Tree를 만든다.
> DOM 트리의 루트부터 보이는 노드만 순회하며, 각 노드에 CSS cascade를 거친 computed styles를 매칭한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Render Tree에서 `display: none`과 `visibility: hidden`은 어떻게 다르게 처리되는가?

### Official Answer
Elements that aren't going to be displayed, like the `<head>` element and its children and any nodes with `display: none`, such as the `script { display: none; }` you will find in user agent stylesheets, are not included in the render tree as they will not appear in the rendered output.
Nodes with `visibility: hidden` applied are included in the render tree, as they do take up space.

> #### AI Annotation:
> `display: none`은 렌더링 출력에 나타나지 않으므로 Render Tree에서 제외된다.
> `visibility: hidden`은 공간을 차지하므로 Render Tree에 포함된다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Render Tree 구축 후 Layout 단계에서 브라우저는 무엇을 하는가?

### Official Answer
Layout is the process by which the dimensions and location of all the nodes in the render tree are determined, plus the determination of the size and position of each object on the page.
Taking the size of the viewport as its base, layout generally starts with the body, laying out the sizes of all the body's descendants, with each element's box model properties, providing placeholder space for replaced elements it doesn't know the dimensions of, such as our image.

> #### AI Annotation:
> Layout은 Render Tree의 모든 노드의 크기와 위치를 결정하는 과정이다.
> viewport 크기를 기준으로 body부터 시작해 자식 요소들의 box model 속성을 계산해 내려간다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Layout과 Reflow의 차이는 무엇이고, Reflow는 왜 발생하는가?

### Official Answer
The first time the size and position of each node is determined is called layout.
Subsequent recalculations of layout are called reflows.
In our example, suppose the initial layout occurs before the image is returned.
Since we didn't declare the dimensions of our image, there will be a reflow once the image dimensions are known.

> #### Official Annotation:
> A reflow sparks a repaint and a re-composite.
> Had we defined the dimensions of our image, no reflow would have been necessary, and only the layer that needed to be repainted would be repainted, and composited if necessary.

> #### AI Annotation:
> 최초 계산이 Layout, 이후 재계산이 Reflow다.
> 예를 들어 이미지에 크기를 선언하지 않으면, 이미지 로드 후 크기가 확정될 때 reflow가 발생한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Compositing은 왜 필요하며 무엇을 보장하는가?

### Official Answer
When sections of the document are drawn in different layers, overlapping each other, compositing is necessary to ensure they are drawn to the screen in the right order and the content is rendered correctly.

As the page continues to load assets, reflows can happen.
A reflow sparks a repaint and a re-composite.
Had we defined the dimensions of our image, no reflow would have been necessary, and only the layer that needed to be repainted would be repainted, and composited if necessary.

> #### Key Terms:
> - **compositing**: 여러 레이어로 그려진 결과를 올바른 순서·위치로 합쳐 최종 화면을 만드는 단계
> - **layer**: paint 결과를 분리해 GPU에서 별도로 다룰 수 있는 단위

> #### User Annotation:
> 성능 향상을 위해 별도 레이어로 나눴으니, 다시 합칠 때 올바른 순서로 합쳐야 한다.
> 이미지에 가로/세로 크기를 지정하지 않으면 reflow → repaint → re-composite가 모두 발생하지만, 지정하면 reflow 없이 필요한 레이어만 repaint/re-composite된다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work#compositing

---

## 부드러운 애니메이션을 위해 브라우저는 한 프레임을 몇 밀리초 안에 완료해야 하며, Paint 성능을 개선하는 전략은?

### Official Answer
To ensure smooth scrolling and animation, everything occupying the main thread, including calculating styles, along with reflow and paint, must take the browser less than 16.67ms to accomplish.
Painting can break the elements in the layout tree into layers.
Promoting content into layers on the GPU (instead of the main thread on the CPU) improves paint and repaint performance.
There are specific properties and elements that instantiate a layer, including `<video>` and `<canvas>`, and any element which has the CSS properties of opacity, a 3D transform, will-change, and a few others.

> #### AI Annotation:
> 60fps를 유지하려면 한 프레임당 16.67ms 안에 style, reflow, paint를 모두 끝내야 한다.
> 이를 위해 요소를 별도 레이어로 분리해 GPU에서 처리(compositing)할 수 있다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## GPU 레이어를 더 많이 만들면 항상 성능이 좋아지는가?

### Official Answer
Layers do improve performance but are expensive when it comes to memory management, so should not be overused as part of web performance optimization strategies.

> #### AI Annotation:
> 아니다. 레이어는 GPU 메모리를 소모하므로 남용하면 오히려 메모리 문제가 생긴다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
