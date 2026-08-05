---
tags: [concept, best-practice, a11y]
source: official
publishable: true
---

# Questions
- `<b>`·`<i>`·`<u>`는 원래 무엇을 위해 생긴 태그이며, 왜 이제 쓰지 말라고 하는가?
- 그런데도 `<b>`·`<i>`·`<u>`를 쓰는 것이 적절한 경우는 언제인가?
- `<i>`는 어떤 뜻을 나타낼 때 쓰는가?
- `<b>`는 어떤 뜻을 나타낼 때 쓰는가?
- `<u>`는 어떤 뜻을 나타낼 때 쓰는가?
- 웹에서 밑줄을 쓸 때 무엇을 조심해야 하는가?

---

# Answers

## `<b>`·`<i>`·`<u>`는 원래 무엇을 위해 생긴 태그이며, 왜 이제 쓰지 말라고 하는가?

### Official Answer
The situation with `<b>`, `<i>`, and `<u>` is somewhat more complicated. They came about so people could write bold, italics, or underlined text in an era when CSS was still supported poorly or not at all. Elements like this, which only affect presentation and not semantics, are known as presentational elements and should no longer be used because, as we've seen before, semantics is so important to accessibility, SEO, etc.

The concept of italics isn't very helpful to people using screen readers, or to people using a writing system other than the Latin alphabet.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## 그런데도 `<b>`·`<i>`·`<u>`를 쓰는 것이 적절한 경우는 언제인가?

### Official Answer
Here's the best rule you can remember: It's only appropriate to use `<b>`, `<i>`, or `<u>` to convey a meaning traditionally conveyed with bold, italics, or underline when there isn't a more suitable element; and there usually is. Consider whether `<strong>`, `<em>`, `<mark>`, or `<span>` might be more appropriate.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## `<i>`는 어떤 뜻을 나타낼 때 쓰는가?

### Official Answer
`<i>` is used to convey a meaning traditionally conveyed by italic: foreign words, taxonomic designation, technical terms, a thought…

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## `<b>`는 어떤 뜻을 나타낼 때 쓰는가?

### Official Answer
`<b>` is used to convey a meaning traditionally conveyed by bold: keywords, product names, lead sentence…

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## `<u>`는 어떤 뜻을 나타낼 때 쓰는가?

### Official Answer
`<u>` is used to convey a meaning traditionally conveyed by underline: proper name, misspelling…

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## 웹에서 밑줄을 쓸 때 무엇을 조심해야 하는가?

### Official Answer
People strongly associate underlining with hyperlinks. Therefore, on the web, it's best to only underline links. Use the `<u>` element when it's semantically appropriate, but consider using CSS to change the default underline to something more appropriate on the web.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance
