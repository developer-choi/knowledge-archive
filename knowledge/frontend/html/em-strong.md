---
tags: [concept, best-practice]
source: official
publishable: false
---

# Questions
- `<em>` 요소는 무엇을 나타내며, 어떤 자리에 쓰는가?
- `<strong>` 요소는 무엇을 나타내며, 어떤 자리에 쓰는가?
- 기울임이나 굵은 글씨로 보이게 하려고 `<em>`·`<strong>`을 써도 되는가?
- 한 부분이 중요하면서 동시에 강조도 필요하면 어떻게 마크업하는가?

---

# Answers

## `<em>` 요소는 무엇을 나타내며, 어떤 자리에 쓰는가?

### Official Answer
In HTML we use the `<em>` (emphasis) element to mark up such instances.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## `<strong>` 요소는 무엇을 나타내며, 어떤 자리에 쓰는가?

### Official Answer
In HTML we use the `<strong>` (strong importance) element to mark up such instances.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## 기울임이나 굵은 글씨로 보이게 하려고 `<em>`·`<strong>`을 써도 되는가?

### Official Answer
Browsers style this as italic by default, but you shouldn't use this tag purely to get italic styling. To do that, you'd use a `<span>` element and some CSS, or perhaps an `<i>` element (see below).

Browsers style this as bold text by default, but you shouldn't use this tag purely to get bold styling. To do that, you'd use a `<span>` element and some CSS, or perhaps a `<b>` element (see below).

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance

---

## 한 부분이 중요하면서 동시에 강조도 필요하면 어떻게 마크업하는가?

### Official Answer
You can nest strong and emphasis inside one another if desired:

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance
