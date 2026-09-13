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
