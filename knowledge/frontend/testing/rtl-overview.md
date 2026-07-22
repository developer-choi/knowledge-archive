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

---

## React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?

### Official Answer
Following the guiding principle of this library, it is useful to break down how tests are organized around how the user experiences and interacts with application functionality rather than around specific components themselves.
In some cases, for example for reusable component libraries, it might be useful to include developers in the list of users to test for and test each of the reusable components individually.
Other times, the specific break down of a component tree is just an implementation detail and testing every component within that tree individually can cause issues (see https://kentcdodds.com/blog/avoid-the-test-user).

In practice this means that it is often preferable to test high enough up the component tree to simulate realistic user interactions.
The question of whether it is worth additionally testing at a higher or lower level on top of this comes down to a question of tradeoffs and what will provide enough value for the cost (see https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests on more info on different levels of testing).

### Reference
- https://testing-library.com/docs/react-testing-library/faq
