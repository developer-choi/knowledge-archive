---
tags: [testing, react, concept]
source: official
priority:
---
# Questions
- RTL의 trade-offs는 무엇이며 simulated browser 환경의 한계는 무엇인가?
- AAA 패턴이란 무엇이며 각 단계에서 RTL은 어떤 API를 제공하는가?

---

# Answers

## RTL의 trade-offs는 무엇이며 simulated browser 환경의 한계는 무엇인가?

### Official Answer
We are making some trade-offs here because we're using a computer and often a simulated browser environment.

### Reference
- https://github.com/testing-library/react-testing-library

---

## AAA 패턴이란 무엇이며 각 단계에서 RTL은 어떤 API를 제공하는가?

### Official Answer
**Step 1. Arrange** — The render method renders a React element into the DOM.

**Step 2. Act** — The fireEvent method allows you to fire events to simulate user actions.

### Reference
- https://testing-library.com/docs/react-testing-library/api#render
- https://testing-library.com/docs/dom-testing-library/api-events
- https://testing-library.com/docs/react-testing-library/faq
