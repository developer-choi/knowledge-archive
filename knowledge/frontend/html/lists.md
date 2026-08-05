---
tags: [concept, best-practice]
source: official
publishable: true
---

# Questions
- `<ul>`은 어떤 내용을 마크업할 때 쓰는가?
- `<ol>`은 어떤 내용을 마크업할 때 쓰는가?
- `<dl>`은 어떤 내용을 마크업할 때 쓰는가?
- 설명 목록 안에서 용어와 설명은 각각 어떤 요소로 감싸는가?
- 한 용어에 설명이 둘 이상 필요하면 어떻게 마크업하는가?

---

# Answers

## `<ul>`은 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
Unordered lists are used to mark up lists of items for which the order of the items doesn't matter.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists

---

## `<ol>`은 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
Ordered lists are lists in which the order of the items does matter.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists

---

## `<dl>`은 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
The purpose of description lists is to mark up a set of items and their associated descriptions, such as terms and definitions, or questions and answers.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists

---

## 설명 목록 안에서 용어와 설명은 각각 어떤 요소로 감싸는가?

### Official Answer
Description lists use a different wrapper than the other list types — `<dl>`; in addition each term is wrapped in a `<dt>` (description term) element, and each description is wrapped in a `<dd>` (description definition) element.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists

---

## 한 용어에 설명이 둘 이상 필요하면 어떻게 마크업하는가?

### Official Answer
Note that it is permitted to have a single term with multiple descriptions, for example:

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists
