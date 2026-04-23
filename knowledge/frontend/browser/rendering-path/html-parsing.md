---
tags: [browser, principle]
---

# Questions
- 브라우저는 HTML markup을 어떻게 DOM tree로 변환하는가?
- DOM tree가 없다면 어떤 문제가 생기는가?
- CSSOM tree에는 어떤 스타일이 포함되는가?
- Cascading Style Sheets의 'Cascading'은 무엇을 의미하는가?
- Parser blocking과 Render blocking은 어떻게 다른가?

---

# Answers

## 브라우저는 HTML markup을 어떻게 DOM tree로 변환하는가?

### Official Answer
The browser converts it into a tree-like structure called a DOM tree (Document Object Model).
The DOM represents the HTML document structure in the computer's memory.

Each element, attribute, and piece of text in the HTML becomes a DOM node in the tree structure.
The nodes are defined by their relationship to other DOM nodes.
Some elements are parents of child nodes, and child nodes have siblings.

The first step is processing the HTML markup and building the DOM tree.
HTML parsing involves tokenization and tree construction.

While the browser builds the DOM tree, this process occupies the main thread.

> #### Key Terms:
> - **DOM (Document Object Model)**: HTML 문서 구조를 메모리에 표현한 트리
> - **tokenization**: 문자 스트림을 의미 있는 토큰 단위로 자르는 단계
> - **tree construction**: 토큰들을 부모-자식 관계의 트리로 조립하는 단계

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## DOM tree가 없다면 어떤 문제가 생기는가?

### User Answer
화면을 바꿀 수가 없음.
사용자와 상호작용하지 못함 — 이벤트 리스너는 DOM Node에 등록하는 것이니까.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## CSSOM tree에는 어떤 스타일이 포함되는가?

### Official Answer
The CSSOM tree includes styles from the user agent style sheet.

> #### Key Terms:
> - **CSSOM (CSS Object Model)**: 브라우저가 CSS 규칙을 트리 형태로 변환해 메모리에 보관한 모델
> - **user agent style sheet**: 브라우저가 기본으로 적용하는 내장 스타일시트

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Cascading Style Sheets의 'Cascading'은 무엇을 의미하는가?

### User Answer
(사용자 메모 기준)
"Cascading Style Sheets"란 **계단식** 스타일 규칙 모음집이라는 뜻이다.
같은 요소에 여러 규칙이 적용될 때, 우선순위가 위에서 아래로 내려오는 모습이 마치 계단처럼 보여서 'cascading'이라고 부른다.

> #### AI Annotation:
> 표준 명세상 cascade의 우선순위는 origin (user-agent / user / author), specificity, source order 등 여러 단계로 정의되어 있다.
> 사용자 메모는 직관적 비유 수준이며, 정확한 cascade 알고리즘은 W3C CSS Cascade 명세를 참고.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade

---

## Parser blocking과 Render blocking은 어떻게 다른가?

### Official Answer
JavaScript by default is parser-blocking (unless specifically marked as asynchronous or deferred), as JavaScript can change the DOM or the CSSOM upon its execution.
Therefore, it's not possible for the browser to continue processing other resources until it knows the full impact of the requested JavaScript on a page's HTML.

Parser-blocking resources are effectively render-blocking as well.
Since the parser can't continue past a parsing-blocking resource until it has been fully processed, it can't access and render the content after it.

Some resources are deemed so critical that the browser pauses page rendering until it has dealt with them.
CSS falls into this category by default.
When a browser sees CSS—whether it's inline CSS in a `<style>` element, or an externally referenced resource specified by a `<link rel=stylesheet href="...">` element—the browser avoids rendering any more content until it has completed downloading and processing that CSS.

> #### Key Terms:
> - **parser-blocking**: HTML 파서의 진행을 막는 리소스 (기본적으로 JavaScript)
> - **render-blocking**: 페이지 렌더링을 막는 리소스 (기본적으로 CSS)
> - **async / defer**: 스크립트의 parser-blocking 동작을 해제하는 속성

> #### AI Annotation:
> Parser blocking은 HTML 파싱 자체를 멈추게 하므로 결국 그 뒤 콘텐츠의 렌더링도 막아 render blocking 효과를 동반한다.
> 반대로 render blocking은 파싱은 계속 진행하되 화면에 그리지 않는 점에서 다르다.

### Reference
- https://web.dev/learn/performance/understanding-the-critical-path
