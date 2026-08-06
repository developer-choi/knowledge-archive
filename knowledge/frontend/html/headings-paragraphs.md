---
tags: [concept, best-practice]
source: official
publishable: false
---

# Questions
- HTML에서 문단과 제목은 각각 어떤 요소로 마크업하는가?
- 헤딩 요소 `<h1>`~`<h6>`의 숫자는 무엇을 의미하는가?
- 한 페이지에 `<h1>`은 몇 개 두는 것이 권장되며, 왜인가?
- 왜 한 페이지의 헤딩 레벨을 세 단계 이내로 쓰라고 권하는가?

---

# Answers

## HTML에서 문단과 제목은 각각 어떤 요소로 마크업하는가?

### Official Answer
In HTML, each paragraph has to be wrapped in a `<p>` element, like so:

```html
<p>I am a paragraph, oh yes I am.</p>
```

Each heading has to be wrapped in a heading element:

```html
<h1>I am the title of the story.</h1>
```

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs

---

## 헤딩 요소 `<h1>`~`<h6>`의 숫자는 무엇을 의미하는가?

### Official Answer
There are six heading elements: h1, h2, h3, h4, h5, and h6. Each element represents a different level of content in the document; `<h1>` represents the main heading, `<h2>` represents subheadings, `<h3>` represents sub-subheadings, and so on.

It's really up to you what the elements involved represent, as long as the hierarchy makes sense.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs

---

## 한 페이지에 `<h1>`은 몇 개 두는 것이 권장되며, 왜인가?

### Official Answer
Preferably, you should use a single `<h1>` per page—this is the top level heading, and all others sit below this in the hierarchy.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs

---

## 왜 한 페이지의 헤딩 레벨을 세 단계 이내로 쓰라고 권하는가?

### Official Answer
Of the six heading levels available, you should aim to use no more than three per page, unless you feel it is necessary. Documents with many levels (for example, a deep heading hierarchy) become unwieldy and difficult to navigate.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs
