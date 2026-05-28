# 브라우저는 HTML markup을 어떻게 DOM tree로 변환하는가?

## 도입

브라우저가 서버에서 HTML 바이트를 받으면 바로 화면을 그릴 수 없다. HTML 문자열을 컴퓨터가 조작할 수 있는 트리 구조로 변환하는 과정이 먼저 필요하다. 이 과정이 HTML 파싱이다.

---

## 본문

> The browser converts it into a tree-like structure called a DOM tree (Document Object Model). The DOM represents the HTML document structure in the computer's memory.

"브라우저는 HTML을 DOM 트리(Document Object Model)라 불리는 트리 형태의 구조로 변환한다. DOM은 HTML 문서 구조를 컴퓨터 메모리에 표현한 것이다."

- **DOM (Document Object Model)**: HTML 문서를 노드로 구성된 트리 구조로 메모리에 표현한 모델. JS에서 `document.getElementById()`, `el.querySelector()` 등으로 접근하는 대상이 이 DOM이다.
- **tree-like structure**: 부모-자식 관계의 계층적 구조. `<html>` → `<body>` → `<div>` → `<p>` 같은 중첩이 트리로 표현된다.

> Each element, attribute, and piece of text in the HTML becomes a DOM node in the tree structure. The nodes are defined by their relationship to other DOM nodes. Some elements are parents of child nodes, and child nodes have siblings.

"HTML의 각 요소, 속성, 텍스트 조각이 트리 구조의 DOM 노드가 된다. 노드들은 다른 DOM 노드와의 관계로 정의된다. 일부 요소는 자식 노드의 부모이고, 자식 노드들은 형제 관계를 가진다."

- **element, attribute, and piece of text**: `<div>`는 Element 노드, `class="box"`는 Attribute 노드, "Hello"는 Text 노드가 된다. HTML의 모든 것이 노드다.
- **parent, child, siblings**: `<ul>` 아래 여러 `<li>`가 있으면 `<ul>`이 부모, 각 `<li>`가 자식이자 서로의 형제다.

> The first step is processing the HTML markup and building the DOM tree. HTML parsing involves tokenization and tree construction.

"첫 번째 단계는 HTML 마크업을 처리하고 DOM 트리를 구축하는 것이다. HTML 파싱은 tokenization과 tree construction을 포함한다."

- **tokenization**: 문자 스트림을 의미 있는 토큰 단위로 자르는 단계. `<div class="box">` 같은 태그를 "여는 태그 시작", "속성 이름", "속성 값", "여는 태그 끝" 등의 토큰으로 분리한다.
- **tree construction**: 토큰들을 부모-자식 관계의 트리로 조립하는 단계. 열린 태그는 스택에 쌓이고 닫힌 태그를 만나면 pop하며 트리를 완성한다.

```
HTML 문자열
  ↓ tokenization
토큰 스트림 [<html>, <body>, <p>, "Hello", </p>, </body>, </html>]
  ↓ tree construction
DOM 트리
  html
  └── body
      └── p
          └── "Hello" (Text 노드)
```

> While the browser builds the DOM tree, this process occupies the main thread.

"브라우저가 DOM 트리를 구축하는 동안 이 과정은 메인 스레드를 점유한다."

- **main thread**: 파싱, 스타일 계산, 레이아웃, 페인트, JS 실행이 모두 여기서 일어나는 단일 스레드. DOM 구축이 메인 스레드를 점유하는 동안 `<script>`가 나타나면 파싱이 중단된다.

---

## 종합

DOM이 없다면 브라우저는 화면에 무엇을 그려야 할지 알 수 없다. 이벤트 리스너도 노드에 등록하는 것이므로 DOM 없이는 인터랙션도 불가능하다. JS에서 `document.getElementById()`를 호출하는 순간 DOM을 조회하는 것이므로, `<script>`가 HTML 파싱을 막는 이유가 명확해진다 — 아직 구축되지 않은 DOM 노드를 스크립트가 참조하면 `null`을 반환하기 때문이다.

---

---

# [UNVERIFIED] DOM tree가 없다면 어떤 문제가 생기는가?

## 도입

DOM 트리가 없으면 브라우저가 "무엇을 그려야 하는지" 알 수 없다. 렌더링만의 문제가 아니라 JS로 하는 모든 동적 조작과 인터랙션도 DOM을 전제로 한다.

---

## 본문

DOM 트리가 없을 때 발생하는 문제는 크게 두 가지다.

**화면을 그릴 수 없다**

브라우저가 픽셀을 화면에 그리려면 Render Tree가 필요하고, Render Tree는 DOM + CSSOM을 합쳐야 만들어진다. DOM이 없으면 Render Tree 자체가 존재할 수 없으므로 화면에 아무것도 그릴 수 없다. `<div>`, `<p>`, `<img>` 같은 요소들이 화면에 나타나는 것 자체가 DOM 노드가 있기 때문에 가능한 일이다.

**사용자와 상호작용할 수 없다**

이벤트 리스너는 DOM 노드에 등록한다. `button.addEventListener('click', handler)`에서 `button`은 DOM 노드다. DOM이 없으면 이벤트 리스너를 달 대상 자체가 없으므로 클릭, 키 입력, 드래그 등 모든 인터랙션이 불가능해진다.

```
DOM 없음
  → Render Tree 없음
      → 화면에 아무것도 그릴 수 없음
  → 이벤트 대상 없음
      → 클릭/스크롤/키입력 반응 불가
  → document.getElementById() → null
      → React의 ReactDOM.render() 자체가 실패
```

React 앱에서 `ReactDOM.createRoot(document.getElementById('root'))`가 `null`을 받으면 오류가 나는 것이 이 원리다 — `<div id="root">`라는 DOM 노드가 있어야만 React가 루트를 잡을 수 있다.

---

## 종합

DOM 트리는 브라우저가 화면을 그리고 JS와 통신하는 접점이다. HTML 파싱이 DOM 구축보다 선행해야 하고, `<script>`가 DOM 구축을 막으면 안 된다는 원칙 — 그리고 `defer`를 쓰거나 `<body>` 끝에 스크립트를 배치하는 관례 — 은 모두 "DOM이 먼저 완성되어야 JS가 제대로 동작한다"는 이 전제에서 나온다.

---

---

# CSSOM tree에는 어떤 스타일이 포함되는가?

## 도입

CSS 파일에 적은 스타일만 CSSOM에 들어가는 것이 아니다. 브라우저 자체도 기본 스타일을 가지고 있고, 이 스타일도 CSSOM에 포함된다.

---

## 본문

> The CSSOM tree includes styles from the user agent style sheet.

"CSSOM 트리는 user agent style sheet의 스타일을 포함한다."

- **CSSOM (CSS Object Model)**: 브라우저가 모든 CSS 규칙(개발자 작성 + 브라우저 내장 + 인라인 스타일)을 트리 형태로 변환해 메모리에 보관한 모델.
- **user agent style sheet**: 브라우저가 기본으로 적용하는 내장 스타일시트. `<h1>`이 굵고 크게 보이고, `<a>`가 파란색 밑줄로 보이는 게 이것 때문이다. Chrome의 경우 `chrome://resources/css/default_100_percent/common.css` 등에 정의되어 있다.

CSSOM의 스타일 우선순위(낮은 → 높은 순):

```
user agent stylesheet (브라우저 내장)
  ↓
개발자 작성 CSS (stylesheet, <style> 태그)
  ↓
인라인 style 속성 (el.style.xxx)
  ↓
!important
```

---

## 종합

CSS reset이나 normalize.css를 쓰는 이유가 바로 user agent stylesheet 때문이다. 브라우저마다 내장 스타일이 조금씩 달라서, reset CSS가 이 기본값을 일관되게 초기화해준다. DevTools Elements 탭에서 요소를 선택하고 "Styles" 패널 아래를 보면 "(User Agent Stylesheet)" 레이블로 브라우저 내장 스타일을 직접 확인할 수 있다.

---

---

# [UNVERIFIED] Cascading Style Sheets의 'Cascading'은 무엇을 의미하는가?

## 도입

CSS 이름 자체에 'Cascading'이 들어있다. 같은 요소에 여러 스타일 규칙이 충돌할 때 브라우저가 어떤 규칙을 적용할지 결정하는 메커니즘이 바로 cascade다.

---

## 본문

**Cascade의 직관적 의미**

`<p style="color: red">` 에 동시에 `p { color: blue; }`가 있다면 어느 쪽이 이길까? 이런 충돌을 해소하는 우선순위 체계가 cascade다. "계단(cascade)"이라는 단어는 물이 위에서 아래로 단계적으로 흐르듯, 스타일 규칙이 우선순위 계층을 타고 내려오면서 최종값이 결정되는 모습에서 왔다.

**cascade 우선순위 계층**

```
높음 ↑
  !important (user origin)
  !important (author origin)
  인라인 style (el.style.xxx)
  ID 선택자 (#id)
  클래스/속성/가상클래스 (.class, [attr], :hover)
  타입 선택자 (p, div, h1)
  user agent stylesheet (브라우저 내장)
낮음 ↓
```

같은 계층 안에서는 **specificity(명시도)** 점수가 높은 쪽이 이기고, 점수가 같으면 **나중에 선언된 쪽(source order)**이 이긴다.

**실무에서 만나는 cascade 충돌**

```css
/* specificity: 0-1-0 (클래스 1개) */
.button { color: blue; }

/* specificity: 0-1-1 (클래스 1개 + 타입 1개) */
div.button { color: red; }   /* 이 쪽이 이긴다 */
```

DevTools Elements 탭 "Styles" 패널에서 취소선(~~strikethrough~~)으로 표시된 규칙이 cascade에서 진 규칙이다.

---

## 종합

CSS가 "Cascading"을 이름에 붙인 것은 단순한 스타일 모음이 아니라, 충돌 해소 메커니즘 자체가 이 언어의 핵심 특성임을 강조한 것이다. 규칙들이 우선순위 계단을 타고 흘러내려 최종 한 가지 값으로 수렴되는 구조 덕분에 복잡한 스타일 시스템을 예측 가능하게 관리할 수 있다. CSSOM을 구축할 때 브라우저가 하는 "cascade 계산"이 바로 이 우선순위 알고리즘을 모든 노드에 적용하는 과정이다.

---

---

# Parser blocking과 Render blocking은 어떻게 다른가?

## 도입

웹 성능에서 "블로킹"은 크게 두 종류다. HTML 파서를 멈추는 것과 화면에 그리는 것을 멈추는 것이 다르다. 이 둘을 구분하지 못하면 최적화 방향을 잘못 잡게 된다.

---

## 본문

> JavaScript by default is parser-blocking (unless specifically marked as asynchronous or deferred), as JavaScript can change the DOM or the CSSOM upon its execution. Therefore, it's not possible for the browser to continue processing other resources until it knows the full impact of the requested JavaScript on a page's HTML.

"JavaScript는 기본적으로 parser-blocking이다(async나 defer로 명시적으로 표시되지 않는 한). 실행 시 JavaScript가 DOM이나 CSSOM을 변경할 수 있기 때문이다. 따라서 브라우저는 요청된 JavaScript가 페이지 HTML에 미치는 전체 영향을 알 때까지 다른 리소스 처리를 계속할 수 없다."

- **parser-blocking**: HTML 파서의 진행을 멈추는 것. `<script src="app.js">` 태그를 만나면 파서는 `app.js` 다운로드 + 실행이 끝날 때까지 HTML을 더 읽지 않는다.
- **async / defer**: 스크립트의 parser-blocking을 해제하는 속성. `async`는 다운로드 즉시 실행(파서와 경쟁), `defer`는 HTML 파싱 완료 후 순서대로 실행.

> Parser-blocking resources are effectively render-blocking as well. Since the parser can't continue past a parsing-blocking resource until it has been fully processed, it can't access and render the content after it.

"parser-blocking 리소스는 사실상 render-blocking이기도 하다. 파서가 parsing-blocking 리소스를 완전히 처리할 때까지 지나칠 수 없으므로, 그 이후의 콘텐츠에 접근하고 렌더링할 수 없다."

- **effectively render-blocking**: `<script>` 태그 이후의 HTML을 아직 파싱하지 못했으므로, 그 뒤에 있는 콘텐츠도 당연히 화면에 그릴 수 없다. parser-blocking ⊃ render-blocking이다.

> Some resources are deemed so critical that the browser pauses page rendering until it has dealt with them. CSS falls into this category by default. When a browser sees CSS—whether it's inline CSS in a `<style>` element, or an externally referenced resource specified by a `<link rel=stylesheet href="...">` element—the browser avoids rendering any more content until it has completed downloading and processing that CSS.

"일부 리소스는 너무 중요해서 브라우저가 처리할 때까지 페이지 렌더링을 일시 중단한다. CSS가 기본적으로 이 범주에 속한다. 브라우저가 CSS를 보면 — `<style>` 요소의 인라인 CSS든 `<link rel=stylesheet href="...">` 요소의 외부 참조든 — 해당 CSS의 다운로드와 처리가 완료될 때까지 더 이상 콘텐츠를 렌더링하지 않는다."

- **render-blocking**: 화면에 픽셀을 그리는 것을 막는 것. CSS는 파싱을 막지 않지만 렌더링(Paint)을 막는다.
- **`<link rel=stylesheet>`**: 파싱은 계속되지만 CSSOM이 완성될 때까지 Render Tree를 만들 수 없어 화면이 안 그려진다.

```
         파서 진행   렌더링(Paint)
<script>  ×(멈춤)    ×(멈춤)     → parser-blocking이면서 render-blocking
<link>    ○(계속)    ×(멈춤)     → render-blocking만
<img>     ○(계속)    ○(계속)     → non-blocking
```

---

## 종합

`<script defer>`가 권장되는 이유가 이 구분에서 나온다. `defer`는 parser-blocking을 해제하므로 HTML 파싱이 계속되고, CSS·이미지 등 다른 리소스 로드도 병렬 진행된다. CSS는 render-blocking이지만 parser-blocking이 아니므로, 파서는 CSS 다운로드 중에도 계속 HTML을 읽어 DOM을 구축한다. 이 이해가 있어야 `<link>`는 `<head>`에, `<script>`는 `<body>` 끝이나 `defer`로 배치하는 이유를 직관적으로 납득할 수 있다.
