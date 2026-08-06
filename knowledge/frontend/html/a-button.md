---
tags: [concept, best-practice]
source: official
publishable: true
---

# Questions
- `<a>` 대신 `<button>`을 써야 하는 경우는 언제인가?

---

# Answers

## `<a>` 대신 `<button>`을 써야 하는 경우는 언제인가?

### Official Answer
Anchor elements are often abused as fake buttons by setting their `href` to `#` or `javascript:void(0)` to prevent the page from refreshing, then listening for their `click` events.

These bogus `href` values cause unexpected behavior when copying/dragging links, opening links in a new tab/window, bookmarking, or when JavaScript is loading, errors, or is disabled. They also convey incorrect semantics to assistive technologies, like screen readers.

Use a `<button>` instead. In general, you should only use a hyperlink for navigation to a real URL.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a
