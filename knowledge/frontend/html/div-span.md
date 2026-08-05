---
tags: [concept, best-practice]
source: official
publishable: true
---

# Questions
- `<div>`는 어떤 내용을 마크업할 때 쓰는가?
- `<span>` 요소는 어떤 용도로 쓰는 요소인가?

---

# Answers

## `<div>`는 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<div>` is a block level non-semantic element, which you should only use if you can't think of a better semantic block element to use, or don't want to add any specific meaning.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<span>` 요소는 어떤 용도로 쓰는 요소인가?

### Official Answer
This is a `<span>` element. It has no semantics. You use it to wrap content when you want to apply CSS to it (or do something to it with JavaScript) without giving it any extra meaning.

`<span>` is an inline non-semantic element, which you should only use if you can't think of a better semantic text element to wrap your content, or don't want to add any specific meaning.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents
