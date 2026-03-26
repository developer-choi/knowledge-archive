---
tags: [testing, concept]
---
# Questions
- [컴포넌트 테스트에서 implementation details를 테스트하면 어떤 문제가 생기는가? Testing Library는 이 문제를 어떻게 해결하는가?](#컴포넌트-테스트에서-implementation-details를-테스트하면-어떤-문제가-생기는가-testing-library는-이-문제를-어떻게-해결하는가)
  - [Testing Library는 implementation details 테스트를 기술적으로 차단하는가?](#testing-library는-implementation-details-테스트를-기술적으로-차단하는가)
  - [[TODO] 테스트가 사용자의 소프트웨어 사용 방식과 닮을수록 더 큰 확신을 준다고 하는데, 그 근거는 무엇인가?](#todo-테스트가-사용자의-소프트웨어-사용-방식과-닮을수록-더-큰-확신을-준다고-하는데-그-근거는-무엇인가)

---

# Answers

## 컴포넌트 테스트에서 implementation details를 테스트하면 어떤 문제가 생기는가? Testing Library는 이 문제를 어떻게 해결하는가?

### Official Answer
You want to write maintainable tests that give you high confidence that your components are working for your users.
As a part of this goal, you want your tests to avoid including implementation details so refactors of your components (changes to implementation but not functionality) don't break your tests and slow you and your team down.

The core library, DOM Testing Library, is a light-weight solution for testing web pages by querying and interacting with DOM nodes (whether simulated with JSDOM/Jest or in the browser).
The main utilities it provides involve querying the DOM for nodes in a way that's similar to how the user finds elements on the page.
In this way, the library helps ensure your tests give you confidence that your application will work when a real user uses it.

The more your tests resemble the way your software is used, the more confidence they can give you.

> Official Annotation: You may want to avoid the following implementation details: Internal state of a component, Internal methods of a component, Lifecycle methods of a component, Child components.
> AI Annotation: implementation details에 의존하는 테스트는 기능이 동일한 리팩토링에도 깨진다. Testing Library는 `getByRole`, `getByText` 등 사용자의 인식 방식을 모방하는 쿼리를 제공하여 이 문제를 해결한다.

### Reference
- https://testing-library.com/docs/

---

## Testing Library는 implementation details 테스트를 기술적으로 차단하는가?

### Official Answer
Testing Library encourages you to avoid testing implementation details like the internals of a component you're testing (though it's still possible).

> AI Annotation: `container.querySelector` 등으로 여전히 내부 구현을 테스트할 수 있다. 기술적으로 차단하지 않고, 올바른 방향으로 유도하되 강제하지 않는 설계 철학이다.

### Reference
- https://testing-library.com/docs/

---

## [TODO] 테스트가 사용자의 소프트웨어 사용 방식과 닮을수록 더 큰 확신을 준다고 하는데, 그 근거는 무엇인가?

### Official Answer

### Reference
