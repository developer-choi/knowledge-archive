# Critical Rendering Path(CRP)란 무엇이며, 어떤 단계로 구성되는가?

## 도입

브라우저가 HTML·CSS·JS를 받아서 실제로 픽셀을 화면에 그리기까지의 과정이 Critical Rendering Path(CRP)다. 이 경로를 최적화하는 것이 렌더링 성능 개선의 핵심이다.

---

## 본문

> The Critical Rendering Path is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen.

"Critical Rendering Path는 브라우저가 HTML, CSS, JavaScript를 화면의 픽셀로 변환하기 위해 거치는 단계들의 순서다."

- **sequence of steps**: 순서가 있는 일련의 단계. HTML 파싱 → CSSOM 구축 → JS 적용 → Render Tree → Layout → Paint → Composite 순서로 진행한다.
- **pixels on the screen**: 최종 결과물. 모든 CRP 단계의 목표는 사용자 화면에 픽셀을 그리는 것이다.

> The critical rendering path refers to the steps involved until the web page starts rendering in the browser. To render pages, browsers need the HTML document itself as well as all the critical resources necessary for rendering that document.

"critical rendering path는 웹 페이지가 브라우저에서 렌더링을 시작하기까지의 단계들을 말한다. 페이지를 렌더링하려면 브라우저는 HTML 문서 자체와 그 문서를 렌더링하는 데 필요한 모든 critical 리소스가 필요하다."

- **critical resources**: 렌더링을 블로킹하는 리소스. CSS와 동기 JS가 대표적이다. 이미지는 critical하지 않다.

CRP의 8단계:

```
HTML → DOM 구축
CSS  → CSSOM 구축
JS   → DOM/CSSOM 수정 적용
DOM + CSSOM → Render Tree 구축
Render Tree → Layout (크기·위치 계산)
Layout → Paint (픽셀 그리기)
Paint → Composite (레이어 합성)
→ 화면 출력
```

---

## 종합

DevTools Performance 탭을 열고 페이지를 녹화하면 "Parse HTML", "Recalculate Style", "Layout", "Paint", "Composite" 항목들이 CRP의 각 단계에 해당한다. 이 단계들이 한 번 실행되고 끝나는 게 아니라, JS가 DOM을 바꾸거나 CSS 속성이 변경될 때마다 일부 단계가 다시 실행된다. CRP 최적화는 이 재실행 비용을 줄이는 것이다.

---

---

# 수천 개의 리스트 항목 렌더링 시 성능 문제가 발생하는 이유는?

## 도입

DOM 노드 수는 CRP의 모든 후속 단계에 직접적인 영향을 준다. 노드가 많을수록 Style 계산, Layout, Paint 각 단계에서 처리할 대상이 늘어난다.

---

## 본문

> The greater the number of nodes, the longer the following events in the critical rendering path will take. Measure! A few extra nodes won't make a big difference, but keep in mind that adding many extra nodes will impact performance.

"노드 수가 많을수록 critical rendering path의 이후 이벤트들이 더 오래 걸린다. 측정하라! 몇 개의 추가 노드는 큰 차이를 만들지 않지만, 많은 수의 추가 노드는 성능에 영향을 준다는 점을 명심하라."

- **the following events**: DOM이 확정된 이후의 단계들 — Style(CSSOM 적용), Layout(크기·위치), Paint(픽셀화), Composite(레이어 합성) 모두 노드 수에 비례해 처리량이 늘어난다.
- **Measure!**: 추측이 아니라 DevTools로 실제 병목을 측정하라는 권고다.

---

## 종합

수천 개의 `<li>`를 한 번에 DOM에 넣으면 Layout 단계에서 수천 개의 박스 크기와 위치를 계산해야 하고, Paint에서 수천 개의 픽셀을 그려야 한다. 이것이 TanStack Virtual 같은 가상화(virtualization) 라이브러리가 필요한 이유다 — 실제로 화면에 보이는 소수의 아이템만 DOM에 두고 나머지는 가상으로 처리해서 CRP의 처리 부담을 줄인다.

---

---

# 네이티브 앱과 달리 웹 브라우저가 progressive rendering을 할 수밖에 없는 이유는?

## 도입

네이티브 앱은 설치 단계에서 모든 자원이 준비된다. 웹은 그렇지 않다. 리소스가 네트워크를 통해 점진적으로 도착하므로, 브라우저는 기다리기보다 받은 것부터 그리도록 설계됐다.

---

## 본문

> The web is distributed by nature. Unlike native applications that are installed before use, browsers cannot depend on websites having all the resources necessary to render the page.

"웹은 본질적으로 분산되어 있다. 사용 전에 설치되는 네이티브 앱과 달리, 브라우저는 페이지를 렌더링하는 데 필요한 모든 리소스가 준비되어 있다고 전제할 수 없다."

- **distributed by nature**: HTML·CSS·JS·이미지가 하나가 아닌 여러 서버에 분산되어 있고, 네트워크를 통해 순차적으로 도착한다.
- **cannot depend on**: 보장이 없다는 뜻. 리소스가 언제 도착할지 모르므로, 일부만 있어도 렌더링을 시작해야 한다.

> Native apps typically have an install phase, and then a running phase. However, for web pages and web apps, the lines between these two phases are much less distinct, and browsers have been specifically designed with that in mind. Therefore, browsers are very good at rendering pages progressively.

"네이티브 앱은 보통 설치 단계와 실행 단계가 구분된다. 그러나 웹 페이지와 웹 앱에서는 두 단계의 경계가 훨씬 불분명하며, 브라우저는 이를 염두에 두고 설계됐다. 따라서 브라우저는 페이지를 점진적으로 렌더링하는 데 매우 능숙하다."

- **progressive rendering**: 가용한 리소스부터 점진적으로 화면을 그리는 방식. HTML 일부만 받아도 그 부분부터 파싱·렌더링을 시작한다.

---

## 종합

브라우저가 progressive rendering을 하는 이유는 "모든 것이 준비될 때까지 기다리면 너무 느리기 때문"이다. 100KB짜리 HTML이 완전히 도착하기 전에도 첫 몇 KB만으로 `<head>` 파싱과 리소스 프리로드를 시작할 수 있다. 이 설계 덕분에 사용자는 페이지의 일부를 훨씬 일찍 볼 수 있다.

---

---

# CRP를 너무 이르게/너무 늦게 수행하면 각각 어떤 문제가 생기는가?

## 도입

브라우저는 언제 첫 렌더링을 시작할지 결정해야 한다. 너무 빠르면 깨진 화면을, 너무 늦으면 오랜 대기를 초래한다. 브라우저는 이 둘 사이의 최소 대기 지점을 찾는다.

---

## 본문

> If the browser renders as soon as possible when it just has some HTML—but before it has any CSS or necessary JavaScript—then the page will momentarily look broken and change considerably for the final render.

"브라우저가 CSS나 필요한 JavaScript 없이 HTML만 있을 때 즉시 렌더링하면, 페이지가 잠깐 깨져 보이다가 최종 렌더링 시 크게 바뀔 것이다."

이것이 CSS가 render-blocking으로 분류되는 이유다. 스타일 없이 먼저 그렸다가 CSS 도착 후 다시 그리면 사용자는 스타일 없는 날것의 HTML을 보는 순간(FOUC, Flash of Unstyled Content)을 경험한다.

> On the other hand, if the browser waits for all resources to be available instead of doing any sequential rendering, then the user will be left waiting for a long time; often unnecessarily so if the page was usable at a much earlier point in time.

"반면, 브라우저가 순차 렌더링 없이 모든 리소스가 준비될 때까지 기다린다면 사용자는 오래 기다려야 한다. 훨씬 이른 시점에 페이지를 사용할 수 있었는데도."

---

## 종합

브라우저가 선택한 타협점은 "CSS는 기다리되, 이미지는 기다리지 않는다"는 것이다. CSS 없는 렌더링은 사용자에게 명확히 깨진 경험을 주지만, 이미지 없는 렌더링은 텍스트 콘텐츠를 이미 읽을 수 있다. 이것이 CSS가 render-blocking이고 이미지는 그렇지 않은 근거다.

---

---

# CRP 렌더링 과정은 한 번만 일어나는가?

## 도입

첫 번째 렌더링 이후에도 CRP의 일부 단계들은 계속 재실행된다. JS가 DOM을 바꾸거나 새 리소스가 로드될 때마다다.

---

## 본문

> This rendering process happens multiple times. The initial render invokes this process, but as more resources that affect the page's rendering become available, the browser will re-run this process.

"이 렌더링 과정은 여러 번 발생한다. 초기 렌더링이 이 과정을 호출하지만, 페이지 렌더링에 영향을 주는 더 많은 리소스가 사용 가능해질수록 브라우저는 이 과정을 다시 실행한다."

- **multiple times**: 한 번이 아니라 반복. 이미지 로드 완료, 비동기 JS 실행, 폰트 적용 등이 모두 CRP 재실행을 트리거한다.
- **re-run**: 전체 8단계를 다시 돌리는 게 아니라, 변경이 시작된 단계부터 다시 실행된다. DOM 변경이면 Style 재계산부터, Layout에 영향 없는 색상 변경이면 Paint부터 다시 실행된다.

---

## 종합

React의 state 변경이 `re-render`를 일으키고 이것이 DOM 변경으로 이어지면 CRP의 일부 단계가 다시 돌아간다. 이것이 reflow(Layout 재실행)와 repaint(Paint 재실행)가 성능 비용으로 이야기되는 이유다. `will-change`, `transform`, `opacity` 같은 속성을 활용해 변경 범위를 Composite 단계에만 국한시키면 Paint와 Layout 재실행을 피할 수 있다.

---

---

# HTML 파싱 중 `async`나 `defer` 없는 `<script>` 태그를 만나면 어떻게 되는가?

## 도입

브라우저는 HTML을 위에서 아래로 파싱하면서 DOM을 구축한다. 그 과정에서 만나는 리소스의 종류에 따라 파싱을 계속할지 멈출지 결정한다.

---

## 본문

> When the HTML parser finds non-blocking resources, such as an image, the browser will request those resources and continue parsing. Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML.

"HTML 파서가 이미지 같은 non-blocking 리소스를 발견하면, 브라우저는 해당 리소스를 요청하고 파싱을 계속한다. CSS 파일을 만났을 때도 파싱은 계속될 수 있지만, `<script>` 태그 — 특히 async나 defer 속성이 없는 것 — 는 렌더링을 차단하고 HTML 파싱을 일시 중단시킨다."

- **non-blocking resources**: 파싱을 멈추지 않는 리소스. 이미지, CSS 파일이 여기 해당한다. 다운로드는 요청하되 파서는 계속 진행한다.
- **pauses parsing**: 파싱이 완전히 멈춘다. 스크립트 실행이 끝날 때까지 DOM 구축이 중단된다.
- **async or defer**: 이 속성들이 있으면 스크립트를 비동기로 처리해 파싱 중단을 방지한다.

```
이미지 <img>  → 요청 시작 후 파싱 계속 (non-blocking)
CSS <link>    → 요청 시작 후 파싱 계속 (파싱은 non-blocking, 렌더는 blocking)
<script>      → 파싱 중단 + 다운로드 + 실행 후 재개 (parser-blocking)
<script defer>→ 파싱 계속, HTML 파싱 완료 후 실행 (non-blocking)
```

---

## 종합

`<script>` 태그가 parser-blocking인 이유는 JS가 `document.write()`로 HTML을 추가하거나 DOM 구조를 바꿀 수 있기 때문이다. 브라우저는 스크립트 실행 결과를 보기 전까지 이후 HTML이 어떤 구조가 될지 알 수 없다. `<body>` 끝에 `<script>`를 놓거나 `defer`를 붙이는 이유가 이 파싱 중단을 피하기 위해서다.

---

---

# DOM 트리 구축 중 리소스 다운로드가 지연될 수 있는데, 브라우저는 이를 어떻게 완화하는가?

## 도입

메인 스레드가 DOM 구축에 집중하는 동안, 외부 리소스(CSS, JS, 폰트)를 사전에 발견하고 다운로드를 미리 시작할 수 있다면 전체 지연을 줄일 수 있다. 브라우저는 이를 위해 preload scanner를 사용한다.

---

## 본문

> While the browser builds the DOM tree, this process occupies the main thread. As this happens, the preload scanner will parse through the content available and request high-priority resources like CSS, JavaScript, and web fonts.

"브라우저가 DOM 트리를 구축하는 동안 이 과정은 메인 스레드를 점유한다. 이때 preload scanner가 사용 가능한 콘텐츠를 파싱하여 CSS, JavaScript, 웹 폰트 같은 고우선순위 리소스를 요청한다."

- **main thread**: DOM 구축, 스타일 계산, JS 실행이 모두 이 단일 스레드에서 일어난다. 동시에 다른 것을 처리하기 어렵다.
- **preload scanner**: 메인 파서와 별도로 동작하는 보조 파서. HTML을 미리 훑어보고 리소스를 찾아낸다.
- **high-priority resources**: CSS와 JS는 렌더링에 필수적이므로 이미지보다 높은 우선순위로 다운로드된다.

> Thanks to the preload scanner, we don't have to wait until the parser finds a reference to an external resource to request it. It will retrieve resources in the background so that by the time the main HTML parser reaches the requested assets, they may already be in flight or have been downloaded.

"preload scanner 덕분에 파서가 외부 리소스에 대한 참조를 발견할 때까지 기다릴 필요가 없다. 백그라운드에서 리소스를 가져오므로, 메인 HTML 파서가 요청된 자산에 도달할 때 이미 다운로드 중이거나 완료된 상태일 수 있다."

- **in flight**: 전송 중인 상태. 파서가 해당 태그에 도달했을 때 이미 다운로드가 진행 중이라면 대기 시간이 줄어든다.

---

## 종합

preload scanner는 "메인 파서보다 먼저 미래를 엿보는" 역할이다. `<script>` 태그로 파서가 멈춘 동안에도 preload scanner는 계속 HTML을 훑어 다음에 필요할 CSS나 JS를 미리 요청한다. `<link rel="preload">`는 개발자가 preload scanner에게 "이 리소스가 중요하니 특별히 우선순위를 높여달라"고 힌트를 주는 방법이다.

---

---

# [UNVERIFIED] 외부 CSS 파일(`<link>`)을 만나면 브라우저는 어떻게 처리하나?

## 도입

HTML 파서가 `<link rel="stylesheet" href="style.css">` 태그를 만났을 때의 동작은 `<script>` 태그와 근본적으로 다르다. CSS는 파서를 멈추지 않지만 렌더링을 막는다는 점에서 독특한 위치에 있다.

---

## 본문

HTML 파서가 `<link>` 태그를 만나면 다음 순서로 동작한다.

```
파서가 <link rel="stylesheet"> 발견
  │
  ├─ preload scanner가 미리 CSS 다운로드 시작 (백그라운드)
  │
  ├─ 메인 파서는 HTML 파싱 계속 → DOM 구축 계속
  │
  └─ CSS 다운로드 완료 → CSSOM 구축 시작
       │
       └─ CSSOM 완성 전까지 Render Tree 구성 불가 → 화면 출력 대기
```

**CSS는 파서를 멈추지 않는다**

`<script>` 와 달리 `<link>` CSS는 HTML 파싱을 중단시키지 않는다. 파서는 CSS 다운로드가 끝나기를 기다리지 않고 그 다음 HTML을 계속 읽어 DOM을 구축한다.

**하지만 렌더링은 막는다**

CSS 파일이 다운로드·파싱되기 전까지 CSSOM을 완성할 수 없고, CSSOM이 없으면 Render Tree를 만들 수 없다. 그래서 CSS를 기다리는 동안 화면에는 아무것도 그려지지 않는다. 이것이 CSS의 "render blocking" 특성이다.

**preload scanner의 역할**

메인 파서가 `<head>` 위쪽을 파싱하는 동안, preload scanner가 미리 HTML을 훑어 CSS 파일 다운로드를 조기에 시작한다. 그래서 파서가 `<link>` 태그에 실제로 도달했을 때는 이미 CSS 다운로드가 상당히 진행된 상태일 수 있다.

---

## 종합

CSS를 `<head>`에 넣으라고 권장하는 이유가 여기 있다. 일찍 만날수록 다운로드가 일찍 시작되고, CSSOM 구축도 일찍 완료된다. 파서를 막지 않으므로 DOM 구축과 CSS 다운로드가 병렬로 진행될 수 있다. 이 병렬성을 극대화하는 것이 렌더링 성능 최적화의 핵심 전략 중 하나다.

---

---

# `<head>`에 `<link rel="stylesheet">`를 넣어도 HTML 파싱을 막지 않는다면, CSS가 JavaScript 실행을 막는 이유는?

## 도입

CSS 파일을 만나도 HTML 파싱은 계속된다고 알려져 있다. 그런데 같은 CSS 파일이 JS 실행은 막는다. 이 비대칭적 동작에는 이유가 있다.

---

## 본문

> Parsing can continue when a CSS file is encountered, but `<script>` tags—particularly those without an async or defer attribute—blocks rendering, and pauses parsing of HTML. Waiting to obtain CSS doesn't block HTML parsing or downloading, but it does block JavaScript because JavaScript is often used to query CSS properties' impact on elements.

"CSS 파일을 만났을 때 파싱은 계속될 수 있지만, `<script>` 태그는 렌더링을 차단하고 HTML 파싱을 멈춘다. CSS를 기다리는 것은 HTML 파싱이나 다운로드를 막지 않지만, JavaScript는 막는다. JavaScript가 CSS 속성이 요소에 미치는 영향을 조회하는 데 자주 사용되기 때문이다."

- **query CSS properties' impact**: `getComputedStyle(el).color`, `el.offsetWidth` 같은 호출. JS가 이런 API를 사용하면 정확한 CSS 계산 결과가 필요하므로, CSSOM이 완성되지 않은 채로 JS를 실행하면 잘못된 값을 반환한다.
- **doesn't block HTML parsing or downloading**: CSS 파일을 다운로드하는 동안 파서는 HTML을 계속 읽고 DOM을 구축한다.
- **but it does block JavaScript**: CSS 다운로드가 끝나기 전에 뒤이어 오는 `<script>`는 실행이 미뤄진다. CSSOM이 완성돼야 JS가 정확한 스타일 정보를 읽을 수 있기 때문이다.

---

## 종합

CSS → JS 블로킹 체인을 이해하면 `<link>` 순서가 왜 중요한지 명확해진다. CSS 파일이 느리게 로드되면 그 다음에 오는 `<script>` 실행이 같이 지연되고, 결국 HTML 파싱도 막힌다. `<head>`의 CSS → `<body>` 끝의 `<script>` 배치는 이 체인이 렌더링을 최대한 늦게 방해하도록 배열한 것이다.

---

---

# [UNVERIFIED] CSS가 렌더 블로킹이라면서 왜 `<link>`를 `<head>`에 넣으라고 하나? `<body>` 끝에 넣으면 더 빠르지 않나?

## 도입

CSS가 렌더링을 막는다면, `<body>` 끝에 CSS를 넣으면 파싱이 먼저 끝나니까 더 빠르지 않을까? 직관적으로 그럴 것 같지만, 실제로는 반대로 사용자 경험이 더 나빠진다.

---

## 본문

**`<body>` 끝에 CSS를 넣으면 생기는 문제**

```
<head>에 CSS 없음
  └─ HTML 파싱 완료 → DOM 구축 → 렌더링 시도
       └─ 스타일 없이 화면 출력 (FOUC 발생)
            └─ body 끝에서 CSS 로드 완료 → 스타일 재적용 → 화면이 순간 깜빡임
```

**FOUC(Flash of Unstyled Content)**: 스타일이 적용되지 않은 날 HTML이 잠깐 화면에 보였다가 CSS가 로드된 후 갑자기 레이아웃이 바뀌는 현상이다. 사용자 입장에서는 깨진 화면이 순간 번쩍이는 것처럼 보인다.

**`<head>`에 CSS를 넣으면 얻는 이점**

```
<head>에 <link> 위치
  └─ preload scanner가 CSS 다운로드 조기 시작
       └─ HTML 파싱과 CSS 다운로드 병렬 진행
            └─ DOM + CSSOM 동시 완성 → Render Tree 즉시 구성
                 └─ 스타일이 적용된 첫 화면 바로 출력
```

CSS를 `<head>`에 넣으면 렌더링 자체는 CSS 완료까지 기다리지만, 사용자는 스타일 없는 깨진 화면을 보지 않는다. 그리고 preload scanner 덕분에 CSS 다운로드가 최대한 일찍 시작되므로, 기다리는 시간도 최소화된다.

**비유**: `<body>` 끝에 CSS를 두는 것은 음식점에서 식사를 다 차려놓고 맨 마지막에 식탁보를 꺼내는 것과 같다. `<head>`에 두는 것은 식탁보를 먼저 깔아두고 요리가 나오면 바로 차리는 것이다.

---

## 종합

CSS가 render-blocking이라는 사실이 "`<head>`에 넣으면 안 된다"는 결론으로 이어지지 않는다. 오히려 "render-blocking이므로 가능한 한 일찍 만나게 해서 다운로드를 일찍 시작시켜야 한다"는 것이 올바른 해석이다. `<body>` 끝에 넣어서 얻는 것은 없고, 잃는 것(FOUC, 늦은 다운로드 시작)만 있다.

---

---

# CSSOM(CSS Object Model)이란 무엇이며, DOM과의 관계는?

## 도입

브라우저가 CSS를 파싱하면 DOM처럼 트리 구조의 모델을 만든다. 이것이 CSSOM이다. JS에서 `document.body`로 DOM에 접근하듯이, CSSOM을 통해 CSS를 조작할 수 있다.

---

## 본문

> The CSS Object Model is a set of APIs allowing the manipulation of CSS from JavaScript. It is much like the DOM, but for the CSS rather than the HTML. It allows users to read and modify CSS style dynamically.

"CSS Object Model은 JavaScript에서 CSS를 조작할 수 있는 API 집합이다. DOM과 유사하지만, HTML 대신 CSS를 위한 것이다. 사용자가 CSS 스타일을 동적으로 읽고 수정할 수 있게 한다."

- **set of APIs**: 단순한 데이터 구조가 아니라 JS에서 접근·수정할 수 있는 인터페이스 집합이다.
- **much like the DOM**: DOM이 HTML 문서를 트리 노드로 표현하듯이, CSSOM은 CSS 규칙을 트리 구조로 표현한다.
- **read and modify CSS style dynamically**: `el.style.color = 'red'`, `getComputedStyle(el)` 같은 JS API가 CSSOM을 통해 동작한다.

> The CSSStyleDeclaration interface is the base class for objects that represent CSS declaration blocks with different supported sets of CSS style information.

"CSSStyleDeclaration 인터페이스는 서로 다른 CSS 스타일 정보 집합을 지원하는 CSS 선언 블록을 나타내는 객체의 기반 클래스다."

- **CSSStyleDeclaration**: 브라우저 콘솔에서 `document.body.style`을 입력하면 나오는 객체의 타입. 인라인 스타일, stylesheet 규칙, computed style 모두 이 인터페이스를 구현한다.

---

## 종합

CSSOM은 Render Tree 구축의 절반을 담당한다. DOM이 "무엇이 있는가"를 표현하고, CSSOM이 "그것이 어떻게 보여야 하는가"를 표현한다. 이 둘이 합쳐져야 비로소 "화면에 무엇을 어떻게 그릴지"를 나타내는 Render Tree가 만들어진다.

---

---

# [UNVERIFIED] CSS 파일 다운로드를 기다리는 동안 DOM은 어떤 상태인가?

## 도입

CSS 파일이 도착하기를 기다리는 동안 브라우저는 HTML 파싱을 중단하는가, 아니면 계속하는가? 이 질문의 답이 CSS가 "render-blocking"이지 "parser-blocking"이 아닌 이유를 설명한다.

---

## 본문

CSS 다운로드를 기다리는 동안 DOM과 렌더링은 각각 다른 상태에 있다.

```
CSS 다운로드 중...

DOM 구축 상태:
  HTML 파서 → 계속 파싱 → DOM 구축 계속
  (CSS 다운로드와 무관하게 진행됨)

렌더링 상태:
  Render Tree = DOM + CSSOM → CSSOM 없으면 Render Tree 불가
  → 화면에 아무것도 그려지지 않음 (렌더링 블로킹)
```

**DOM은 계속 구축된다**

CSS 파일을 기다리는 동안에도 HTML 파서는 계속 동작하여 DOM을 구축한다. `<p>`, `<div>`, `<img>` 태그들이 DOM 노드로 차곡차곡 쌓이는 과정이 CSS와 병렬로 진행된다.

**하지만 화면은 그려지지 않는다**

DOM이 아무리 완성되어도 CSSOM 없이는 Render Tree를 만들 수 없다. 브라우저는 "스타일 없는 깨진 화면"을 사용자에게 보여주는 대신, CSS가 완성될 때까지 렌더링(Paint)을 아예 보류한다.

**예외: 인라인 스타일**

인라인 `<style>` 태그의 CSS는 별도 다운로드가 필요 없으므로, 파싱과 동시에 CSSOM에 반영된다. 이것이 Above-the-fold 콘텐츠의 CSS를 인라인화하는 Critical CSS 최적화 기법의 근거다.

---

## 종합

"DOM은 만들어지고 있지만 아직 화면에 그려지지 않는" 이 분리된 상태를 이해하는 것이 CRP 최적화의 핵심이다. CSS 다운로드 시간을 줄이면(압축, CDN) CSSOM이 일찍 완성되고, 그 순간 DOM과 합쳐져 렌더링이 시작된다. DOM과 CSSOM 구축이 병렬로 달리는 레이스라고 생각하면 된다 — 둘 중 늦게 도착하는 쪽이 Render Tree를 기다리게 만든다.

---

---

# 브라우저는 수신한 CSS로 CSSOM 트리를 어떻게 구축하는가?

## 도입

HTML을 DOM 트리로 변환하는 것처럼, CSS도 같은 방식으로 트리 구조로 변환된다. 브라우저는 CSS 규칙을 "부모-자식-형제" 관계의 노드로 조립한다.

---

## 본문

> The browser converts the CSS rules into a map of styles it can understand and work with. The browser goes through each rule set in the CSS, creating a tree of nodes with parent, child, and sibling relationships based on the CSS selectors.

"브라우저는 CSS 규칙을 자신이 이해하고 작업할 수 있는 스타일 맵으로 변환한다. 브라우저는 CSS의 각 규칙 집합을 순회하며, CSS 선택자에 기반한 부모-자식-형제 관계를 가진 노드 트리를 생성한다."

- **map of styles**: 각 노드(요소)가 어떤 스타일을 가져야 하는지를 담은 구조체. "이 `<p>` 요소는 `color: red`, `font-size: 16px`를 가진다"는 식의 매핑이다.
- **parent, child, and sibling relationships**: CSS의 cascade와 상속을 반영하는 트리 구조. `body p { color: red }`는 `body` 노드의 자식인 `p` 노드에 스타일을 매핑한다.

> As with HTML, the browser needs to convert the received CSS rules into something it can work with. Hence, it repeats the HTML-to-object process, but for the CSS.

"HTML과 마찬가지로, 브라우저는 수신한 CSS 규칙을 작업할 수 있는 형태로 변환해야 한다. 따라서 HTML→객체 변환 과정을 CSS에 대해 반복한다."

---

## 종합

DevTools Elements 탭의 "Styles" 패널이 CSSOM의 계산 결과를 보여준다. "Computed" 탭은 CSS cascade, specificity, 상속을 모두 적용한 최종 computed style을 보여주는데, 이것이 CSSOM의 결과물이다. CSSOM 구축은 CSS 파일이 완전히 다운로드된 후에 한 번에 일어나며(HTML처럼 스트리밍 불가), 이것이 CSS가 render-blocking인 또 다른 이유다.

---

---

# CSSOM 구축은 성능 병목인가? DevTools에서 어떻게 확인하는가?

## 도입

CSSOM 구축 자체는 매우 빠르다. 대부분의 성능 최적화 노력을 CSSOM에 집중할 필요는 없다.

---

## 본문

> Building the CSSOM is very, very fast, and this build time information is not displayed in the developer tools.

"CSSOM 구축은 매우, 매우 빠르며, 이 구축 시간 정보는 개발자 도구에 표시되지 않는다."

> Rather, the "Recalculate Style" in developer tools shows the total time it takes to parse CSS, construct the CSSOM tree, and recursively calculate computed styles.

"대신, 개발자 도구의 'Recalculate Style'은 CSS 파싱, CSSOM 트리 구축, computed styles의 재귀적 계산에 걸리는 총 시간을 보여준다."

- **Recalculate Style**: DevTools Performance 탭에서 볼 수 있는 항목. CSSOM 구축만이 아니라 computed style 계산(cascade 적용)까지 포함된 시간이다.
- **recursively calculate computed styles**: CSSOM 트리를 루트부터 내려가며 각 노드의 최종 스타일(상속 + cascade 적용)을 계산하는 과정.

> In terms of web performance, there are many better ways to invest optimization effort, as the total time to create the CSSOM is generally less than the time it takes for one DNS lookup.

"웹 성능 관점에서 CSSOM 생성 총 시간은 일반적으로 DNS lookup 하나보다 짧으므로, 최적화 노력을 투자하기에 더 나은 방법들이 많이 있다."

---

## 종합

CSSOM 구축 시간 자체가 병목인 경우는 거의 없다. 하지만 CSS 파일이 크면 다운로드 시간이 길어지고, 이 다운로드를 기다리는 동안 렌더링이 블로킹된다. 실제 병목은 "CSSOM 구축 속도"가 아니라 "CSS 파일 전송 지연"이다. CSS 최소화(minification)와 압축(gzip/Brotli)으로 전송 크기를 줄이는 것이 우선이다.

---

---

# [UNVERIFIED] CSSOM은 어떻게 구축되며, DOM 구축과 어떻게 다른가?

## 도입

DOM과 CSSOM은 둘 다 트리 구조이고 비슷한 이름을 가지지만, 구축 방식에는 중요한 차이가 있다. 특히 스트리밍 가능 여부가 렌더링 성능에 미치는 영향이 다르다.

---

## 본문

**CSSOM 구축 과정**

브라우저가 CSS를 받으면 다음 단계로 CSSOM을 만든다.

```
CSS 텍스트
  ↓ 토큰화 (tokenization)
  토큰 스트림 [selector, {, property, :, value, ;, }, ...]
  ↓ 규칙 파싱
  CSS 규칙 집합
  ↓ 트리 구성 (cascade + inheritance 적용)
  CSSOM 트리 (각 노드 = 요소, 값 = computed style)
```

**DOM 구축과의 핵심 차이: 스트리밍 불가**

```
DOM 구축: 스트리밍 가능
  바이트 수신 → 즉시 파싱 시작 → 받는 대로 노드 추가
  (HTML 전체를 다 받기 전에도 일부 DOM이 완성됨)

CSSOM 구축: 스트리밍 불가
  CSS 파일 전체 다운로드 완료 후 → 한 번에 파싱 → CSSOM 완성
  (중간 상태의 CSSOM으로는 Render Tree 구성 불가)
```

CSS가 스트리밍 불가인 이유는 **cascade** 때문이다. CSS 파일 맨 끝에 `body { color: red !important; }`가 있으면 그 앞에 있는 모든 `color` 선언을 덮어쓴다. 파일을 반만 받은 상태에서 스타일을 확정하면, 나중에 도착하는 규칙이 이미 적용된 스타일을 바꿀 수 있어 일관성이 깨진다.

**상속 처리**

DOM은 노드 간 부모-자식 구조만 표현하지만, CSSOM은 cascade(우선순위 계산)와 inheritance(상속)를 모두 반영한다. `body { font-size: 16px; }`를 선언하면 자손 모든 요소가 이 값을 물려받는 것이 CSSOM에 반영된다.

---

## 종합

CSSOM이 "스트리밍 불가"라는 특성이 CSS를 render-blocking으로 만드는 근본 원인이다. DOM은 부분적으로라도 완성되면 preload scanner가 리소스를 찾을 수 있지만, CSSOM은 완전히 완성되기 전까지는 Render Tree에 기여할 수 없다. CSS 파일을 여러 작은 청크로 나눠도 각각 완성된 후에야 CSSOM에 반영된다. 이것이 중요한 CSS만 추출해 인라인화하는 Critical CSS 전략이 효과적인 이유다.

---

---

# [UNVERIFIED] Critical Rendering Path 전체에서 성능을 개선하려면 어디를 건드려야 하나?

## 도입

CRP 최적화는 단일 기법이 아니라 단계별로 다른 접근이 필요하다. 네트워크, 파싱, 렌더링 각 단계가 서로 다른 병목을 가지고 있다.

---

## 본문

CRP의 단계별 최적화 포인트:

```
1. 네트워크 단계 (리소스 다운로드)
   └─ 리소스 수 줄이기 (번들링, 스프라이트)
   └─ 리소스 크기 줄이기 (minification, gzip/Brotli)
   └─ 전송 거리 줄이기 (CDN)
   └─ 병렬 다운로드 (HTTP/2)
   └─ 조기 다운로드 (preload, prefetch)

2. 파싱 단계 (블로킹 리소스 제거)
   └─ JS: async/defer 속성 추가
   └─ CSS: 인라인화(Critical CSS), 미디어 쿼리로 non-critical 분리
   └─ 불필요한 렌더 블로킹 리소스 제거

3. 렌더링 단계 (Layout/Paint 최소화)
   └─ Reflow 유발 속성(width, top) 대신 transform 사용
   └─ 레이아웃 스래싱(layout thrashing) 방지
   └─ GPU 레이어 활용 (will-change, transform)
   └─ DOM 크기 줄이기 (가상화)
```

DevTools Performance 탭으로 녹화하면 어느 단계가 실제 병목인지 확인할 수 있다. "Parse HTML"이 길면 HTML 크기 문제, "Recalculate Style"이 길면 CSS 셀렉터 복잡도 문제, "Layout"이 길면 reflow 문제다.

---

## 종합

CRP 최적화는 "어디를 건드리냐"보다 "어디가 실제 병목이냐"를 먼저 측정하는 것이 선행되어야 한다. 같은 앱이라도 초기 로드(TTFB, FCP)와 인터랙션 응답(TTI, CLS)은 다른 단계가 병목일 수 있다. DevTools Lighthouse 탭이 제시하는 "Opportunities"와 "Diagnostics"가 각 CRP 단계의 문제를 진단해주는 출발점이다.

---

---

# [UNVERIFIED] CRP 최적화 전략 중 ROI가 가장 높은 한 가지는?

## 도입

모든 최적화 기법을 동시에 적용할 수 없다면, 어디서 시작하는 것이 가장 효과적인가? 상황마다 다르지만 가장 일반적으로 높은 ROI를 내는 포인트가 있다.

---

## 본문

대부분의 사이트에서 **렌더 블로킹 리소스 제거**가 가장 높은 ROI를 제공한다. 특히 두 가지가 결정적이다.

**1. CSS 크리티컬 패스 최적화**

```
기존: <link rel="stylesheet" href="all.css">   (전체 CSS 로드 대기)
개선: <style>/* Above-the-fold CSS 인라인 */</style>
      <link rel="stylesheet" href="rest.css" media="print" onload="this.media='all'">
```

첫 화면에 필요한 CSS만 인라인으로 넣으면 외부 CSS 다운로드를 기다리지 않고 첫 렌더링을 할 수 있다. Next.js의 `next/font`, Tailwind CSS의 purge가 이 원리를 활용한다.

**2. JS defer / async**

```
기존: <script src="app.js">          (파서 블로킹)
개선: <script src="app.js" defer>    (파서 계속, HTML 파싱 완료 후 실행)
```

`defer` 하나로 HTML 파싱이 끊기지 않게 되어 DOM 구축이 완료되고 CSS와 병렬로 진행된다.

이 두 가지는 코드 변경 없이 설정만으로 적용 가능하고, FCP와 LCP 모두에 직접 영향을 준다.

---

## 종합

이미지 최적화(WebP, lazy loading)도 중요하지만 CRP에 미치는 영향은 제한적이다 — 이미지는 render-blocking이 아니기 때문이다. 렌더 블로킹 리소스(CSS, 동기 JS)를 먼저 다루는 것이 CRP 관점에서 우선순위가 높다. Lighthouse Opportunities에서 "Eliminate render-blocking resources"가 최상위에 나타나는 이유가 여기 있다.

---

---

# [UNVERIFIED] 코드 스플리팅은 렌더링 파이프라인의 어느 단계에 영향을 주나?

## 도입

코드 스플리팅(code splitting)은 하나의 거대한 JS 번들을 여러 청크로 나누어 필요한 시점에만 로드하는 기법이다. CRP의 어느 단계를 개선하는지 명확히 이해해야 올바른 기대를 가질 수 있다.

---

## 본문

코드 스플리팅은 주로 **파싱 단계**에 영향을 준다.

```
코드 스플리팅 없음:
  app.js (500KB) 다운로드 → 파싱 → 실행 → 메인 스레드 500ms+ 점유
  → HTML 파싱 블로킹, DOM 구축 지연

코드 스플리팅 적용:
  main.js (50KB) 다운로드 → 파싱 → 실행 (빠름)
  → 나머지 청크는 필요할 때 lazy load
```

**각 단계에 미치는 영향**

```
네트워크: 초기 전송량 감소 → 다운로드 시간 단축
파싱:     초기 JS 파싱·실행 시간 단축 → 메인 스레드 점유 감소
렌더링:   DOM 구축이 빨라지고 → Render Tree 완성이 앞당겨짐
인터랙션: TTI(Time to Interactive) 개선 — JS 실행이 줄어들어 메인 스레드가 빨리 비워짐
```

**직접 영향을 주지 않는 것**

코드 스플리팅은 CSS나 HTML에는 영향을 주지 않으므로, CSSOM 구축 속도나 Render Tree 구성 방식 자체는 바뀌지 않는다. CSS가 render-blocking인 문제는 코드 스플리팅으로 해결되지 않는다.

---

## 종합

React의 `React.lazy()` + `Suspense`, webpack의 `import()` dynamic import, Next.js의 자동 페이지 기반 코드 스플리팅이 모두 같은 원리다. 초기 번들에서 라우트별·컴포넌트별로 청크를 분리해서 첫 페이지 로드에 불필요한 JS 파싱·실행을 지연시킨다. FCP 이후 메인 스레드가 빨리 비워지므로 인터랙션 응답성(TTI, TBT)이 개선되는 것이 핵심 효과다.

---

---

# 파싱 완료 후 Render Tree는 어떻게 구성되는가?

## 도입

DOM과 CSSOM이 준비되면 두 트리를 합쳐 Render Tree를 만든다. Render Tree는 화면에 실제로 보여질 노드와 각각의 computed style을 담은 구조다.

---

## 본문

> The CSSOM and DOM trees created in the parsing step are combined into a render tree which is then used to compute the layout of every visible element, which is then painted to the screen.

"파싱 단계에서 생성된 CSSOM과 DOM 트리는 render tree로 합쳐지며, 이는 모든 보이는 요소의 레이아웃을 계산하고 화면에 페인트하는 데 사용된다."

> The computed style tree, or render tree, construction starts with the root of the DOM tree, traversing each visible node. The render tree holds all the visible nodes with content and computed styles — matching up all the relevant styles to every visible node in the DOM tree, and determining, based on the CSS cascade, what the computed styles are for each node.

"computed style 트리, 즉 render tree 구축은 DOM 트리의 루트에서 시작해 각 visible 노드를 순회한다. render tree는 콘텐츠와 computed styles를 가진 모든 visible 노드를 보유한다 — DOM 트리의 모든 visible 노드에 관련 스타일을 매핑하고, CSS cascade에 기반해 각 노드의 computed styles를 결정한다."

- **visible node**: 화면에 표시되는 노드. `<head>`, `display: none` 요소, 스크립트 태그 등은 제외된다.
- **CSS cascade**: 여러 CSS 규칙이 같은 요소에 적용될 때 우선순위(specificity, source order)를 계산해 최종값을 결정하는 과정.
- **computed styles**: cascade와 상속을 모두 거친 최종 스타일 값. `em`은 `px`로, `inherit`는 실제 값으로 변환된 상태.

```
DOM 트리           CSSOM 트리
<html>             html { }
  <body>           body { font-size: 16px; }
    <p>            p { color: red; }
    <div>          div { display: none; }
      <span>

            ↓ 합성 (visible 노드만)

Render Tree
  body (font-size: 16px)
    p (color: red, font-size: 16px 상속)
    [div — display: none이므로 제외]
```

> In some cases, content can be promoted to its own layer and composited, improving performance by painting portions of the screen on the GPU instead of the CPU, freeing up the main thread.

"경우에 따라 콘텐츠가 자체 레이어로 승격되어 합성될 수 있으며, CPU 대신 GPU에서 화면 일부를 페인트하여 성능을 개선하고 메인 스레드를 해방시킨다."

- **promoted to its own layer**: `will-change`, `transform: translateZ(0)` 같은 CSS가 적용된 요소는 별도 GPU 레이어로 분리된다.

---

## 종합

Render Tree는 "화면에 그릴 것들의 목록"이다. DOM이 100개 노드를 가져도 `display: none`이 20개이고 `<head>`가 50개 태그를 포함하면 Render Tree는 그보다 훨씬 적은 수의 노드로 구성된다. Layout과 Paint는 이 Render Tree를 기반으로 실행되므로, Render Tree의 크기를 줄이는 것이 성능 최적화의 또 다른 포인트다.

---

---

# Render Tree에서 `display: none`과 `visibility: hidden`은 어떻게 다르게 처리되는가?

## 도입

둘 다 요소를 화면에서 안 보이게 하지만, Render Tree에서의 처리가 다르다. 이 차이가 Layout 단계에서의 영향으로 이어진다.

---

## 본문

> Elements that aren't going to be displayed, like the `<head>` element and its children and any nodes with `display: none`, such as the `script { display: none; }` you will find in user agent stylesheets, are not included in the render tree as they will not appear in the rendered output.

"`<head>` 요소와 그 자식들, `display: none`이 적용된 노드들 — user agent stylesheet에서 볼 수 있는 `script { display: none; }` 같은 것 — 은 렌더링 결과물에 나타나지 않으므로 render tree에 포함되지 않는다."

- **user agent stylesheet**: 브라우저가 기본으로 적용하는 내장 스타일시트. `<script>`, `<head>`, `<meta>` 등에는 `display: none`이 기본값이다.
- **not included in the render tree**: Render Tree에서 아예 제외되므로 Layout 계산에서도 사라진다. 공간을 차지하지 않는다.

> Nodes with `visibility: hidden` applied are included in the render tree, as they do take up space.

"`visibility: hidden`이 적용된 노드는 공간을 차지하므로 render tree에 포함된다."

- **do take up space**: `visibility: hidden`은 투명하게 렌더링될 뿐 레이아웃 공간은 그대로 유지된다. 다른 요소들의 위치에 영향을 준다.

---

## 종합

```
display: none    → Render Tree 제외 → Layout에서 공간 없음 → 주변 요소 영향 없음
visibility: hidden → Render Tree 포함 → Layout에서 공간 차지 → 주변 요소 위치 영향
```

React에서 조건부 렌더링(`{condition && <Component />}`)이 CSS로 숨기는 것보다 완전한 "없는 상태"를 만들 수 있는 이유가 여기 있다 — 조건부 렌더링은 DOM에서 완전히 제거되므로 `display: none`보다 더 철저하게 Render Tree에서 제외된다.

---

---

# Render Tree 구축 후 Layout 단계에서 브라우저는 무엇을 하는가?

## 도입

Render Tree가 "무엇을 그릴지"를 결정한다면, Layout은 "어디에, 얼마나 크게 그릴지"를 계산하는 단계다.

---

## 본문

> Layout is the process by which the dimensions and location of all the nodes in the render tree are determined, plus the determination of the size and position of each object on the page.

"Layout은 render tree의 모든 노드의 크기와 위치, 그리고 페이지의 각 객체의 크기와 위치를 결정하는 과정이다."

- **dimensions and location**: 너비·높이(dimensions)와 x·y 좌표(location). 이 두 정보가 결정돼야 픽셀을 그릴 수 있다.

> Taking the size of the viewport as its base, layout generally starts with the body, laying out the sizes of all the body's descendants, with each element's box model properties, providing placeholder space for replaced elements it doesn't know the dimensions of, such as our image.

"viewport 크기를 기준으로, layout은 일반적으로 body에서 시작해 body의 모든 자식들의 크기를 계산하며, 각 요소의 box model 속성을 적용하고, 이미지처럼 크기를 모르는 replaced element에는 플레이스홀더 공간을 제공한다."

- **viewport**: 브라우저 창의 보이는 영역. 모든 Layout 계산의 기준이 되는 좌표계다. `100vw`, `100vh` 같은 단위가 이것을 기준으로 한다.
- **box model properties**: `margin`, `padding`, `border`, `width`, `height`. Layout 단계에서 이 값들을 모든 요소에 적용해 최종 크기·위치를 결정한다.
- **replaced elements**: `<img>`, `<video>` 같이 브라우저가 외부 리소스를 채워넣는 요소. 리소스가 로드되기 전까지 정확한 크기를 알 수 없다.

---

## 종합

Layout은 CRP에서 가장 비용이 큰 단계 중 하나다. DevTools Performance 탭에서 보라색 "Layout" 블록이 길면 레이아웃 계산이 오래 걸린다는 신호다. `width: 50%` 같은 비율 값이나 `flexbox`, `grid`는 부모 크기에 따라 자식 계산이 결정되므로 트리 전체를 한 번에 처리해야 한다. `will-change: transform`으로 요소를 별도 레이어로 분리하면 그 요소의 변화가 전체 Layout 재계산을 유발하지 않는다.

---

---

# Layout과 Reflow의 차이는 무엇이고, Reflow는 왜 발생하는가?

## 도입

Layout은 처음 한 번만 실행되지 않는다. DOM이나 스타일이 바뀌면 크기·위치 계산을 다시 해야 한다. 이 재계산이 Reflow다.

---

## 본문

> The first time the size and position of each node is determined is called layout. Subsequent recalculations of layout are called reflows.

"각 노드의 크기와 위치를 처음 결정하는 것을 layout이라 한다. 이후의 layout 재계산을 reflow라고 한다."

- **first time**: 초기 렌더링에서의 Layout. 이후 변경이 발생하면 reflow가 된다.
- **reflow**: `el.style.width = '200px'`, `classList.toggle()`, `window.onresize` 등이 reflow를 유발한다.

> In our example, suppose the initial layout occurs before the image is returned. Since we didn't declare the dimensions of our image, there will be a reflow once the image dimensions are known.

"초기 layout이 이미지가 반환되기 전에 발생했다고 가정하면, 이미지에 크기를 선언하지 않았으므로 이미지 크기가 알려지면 reflow가 발생한다."

> A reflow sparks a repaint and a re-composite. Had we defined the dimensions of our image, no reflow would have been necessary, and only the layer that needed to be repainted would be repainted, and composited if necessary.

"reflow는 repaint와 re-composite을 유발한다. 이미지의 크기를 미리 선언했다면 reflow가 필요 없었을 것이며, 다시 그려야 할 레이어만 repaint하고 필요시 composite만 실행됐을 것이다."

- **sparks repaint**: Reflow는 레이아웃(위치·크기)이 바뀌는 것이므로 Paint(픽셀을 다시 칠하는 것)도 필연적으로 다시 실행된다.
- **Had we defined the dimensions**: `<img width="300" height="200">` 또는 `img { width: 300px; height: 200px; }` — 이미지가 로드되기 전에 공간을 예약해두면 이미지 도착 시 reflow가 발생하지 않는다.

---

## 종합

`<img>` 태그에 `width`와 `height`를 항상 명시하라는 모범 사례의 근거가 바로 여기다. 크기 미선언 이미지는 로드 완료 시 reflow → repaint → composite의 전체 과정을 다시 유발한다. 이것이 LCP(Largest Contentful Paint)를 지연시키고 CLS(Cumulative Layout Shift)를 높이는 원인이 된다.

---

---

# Compositing은 왜 필요하며 무엇을 보장하는가?

## 도입

현대 웹 페이지는 여러 레이어가 겹쳐서 구성된다. 각 레이어를 독립적으로 그린 뒤 올바른 순서로 합치는 과정이 Compositing이다.

---

## 본문

> When sections of the document are drawn in different layers, overlapping each other, compositing is necessary to ensure they are drawn to the screen in the right order and the content is rendered correctly.

"문서의 여러 섹션이 서로 겹치는 다른 레이어에 그려질 때, 올바른 순서로 화면에 그려지고 콘텐츠가 올바르게 렌더링되도록 compositing이 필요하다."

- **layers**: `position: fixed` 헤더, `z-index`가 있는 모달, `transform`이 적용된 요소 등이 별도 레이어를 형성한다.
- **right order**: `z-index`와 stacking context를 반영한 올바른 레이어 순서. 잘못되면 위에 있어야 할 요소가 뒤에 가려진다.

> As the page continues to load assets, reflows can happen. A reflow sparks a repaint and a re-composite. Had we defined the dimensions of our image, no reflow would have been necessary, and only the layer that needed to be repainted would be repainted, and composited if necessary.

"reflow가 발생하면 repaint와 re-composite이 따라온다. 크기를 미리 선언했다면 변경된 레이어만 repaint하고 필요시 composite만 실행됐을 것이다."

- **compositing**: 여러 레이어로 그려진 결과를 올바른 순서·위치로 합쳐 최종 화면을 만드는 단계. GPU에서 실행될 수 있어 CPU 부담을 줄인다.

---

## 종합

`transform`과 `opacity`만 변경하는 애니메이션이 "GPU 가속 애니메이션"으로 불리는 이유가 여기 있다. 이 두 속성의 변경은 Layout과 Paint를 다시 실행하지 않고 Composite 단계만 실행한다. DevTools Performance 탭에서 "Composite Layers"만 보이고 Layout·Paint가 없으면 최적화된 애니메이션이다. 반면 `width`, `height`, `top`, `left`를 JS로 바꾸면 reflow → repaint → composite 전체를 유발한다.

---

---

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
