---
tags: [testing, concept]
---
# Questions
- [컴포넌트 테스트에서 implementation details를 테스트하면 어떤 문제가 생기는가? Testing Library는 이 문제를 어떻게 해결하는가?](#컴포넌트-테스트에서-implementation-details를-테스트하면-어떤-문제가-생기는가-testing-library는-이-문제를-어떻게-해결하는가)
  - [Testing Library는 implementation details 테스트를 기술적으로 차단하는가?](#testing-library는-implementation-details-테스트를-기술적으로-차단하는가)
  - [[TODO] 테스트가 사용자의 소프트웨어 사용 방식과 닮을수록 더 큰 확신을 준다고 하는데, 그 근거는 무엇인가?](#todo-테스트가-사용자의-소프트웨어-사용-방식과-닮을수록-더-큰-확신을-준다고-하는데-그-근거는-무엇인가)
- [Testing Library의 Guiding Principles는 "사용자처럼 테스트하라"는 원칙을 API 설계에 어떻게 반영하는가?](#testing-library의-guiding-principles는-사용자처럼-테스트하라는-원칙을-api-설계에-어떻게-반영하는가)
- [React Testing Library로 테스트를 작성하면 접근성(a11y)이 자연스럽게 개선된다고 하는데, 어떤 원리인가?](#react-testing-library로-테스트를-작성하면-접근성a11y이-자연스럽게-개선된다고-하는데-어떤-원리인가)
- [Enzyme으로도 사용자 관점 테스트를 작성할 수 있는데, Testing Library가 Enzyme을 대체한 이유는 무엇인가?](#enzyme으로도-사용자-관점-테스트를-작성할-수-있는데-testing-library가-enzyme을-대체한-이유는-무엇인가)

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
You want your tests to avoid including implementation details so refactors of your components (changes to implementation but not functionality) don't break your tests and slow you and your team down.

The main utilities it provides involve querying the DOM for nodes in a way that's similar to how the user finds elements on the page.
In this way, the library helps ensure your tests give you confidence that your application will work when a real user uses it.

We believe this leads to less brittle and more meaningful test code.

> AI Annotation: 역방향 논증(구현 세부사항 의존 → 거짓 실패 → 확신 저하)과 순방향 논증(사용자처럼 찾기 → 통과 시 실제 사용자도 동작 보장 → 확신). FAQ에서 직접적 선언이 추가됨: 사용자 관점 테스트 → less brittle(덜 깨짐) + more meaningful(더 의미 있음).

### Reference
- https://testing-library.com/docs/
- https://testing-library.com/docs/dom-testing-library/faq

---

## Testing Library의 Guiding Principles는 "사용자처럼 테스트하라"는 원칙을 API 설계에 어떻게 반영하는가?

### Official Answer
We try to only expose methods and utilities that encourage you to write tests that closely resemble how your web pages are used.

Utilities are included in this project based on the following guiding principles:

If it relates to rendering components, then it should deal with DOM nodes rather than component instances, and it should not encourage dealing with component instances.
It should be generally useful for testing the application components in the way the user would use it.
We are making some trade-offs here because we're using a computer and often a simulated browser environment, but in general, utilities should encourage tests that use the components the way they're intended to be used.
Utility implementations and APIs should be simple and flexible.

### Reference
- https://testing-library.com/docs/guiding-principles

---

## React Testing Library로 테스트를 작성하면 접근성(a11y)이 자연스럽게 개선된다고 하는데, 어떤 원리인가?

### Official Answer
The utilities this library provides facilitate querying the DOM in the same way the user would.
Finding form elements by their label text (just like a user would), finding links and buttons from their text (like a user would).
It also exposes a recommended way to find elements by a data-testid as an "escape hatch" for elements where the text content and label do not make sense or is not practical.

This library encourages your applications to be more accessible and allows you to get your tests closer to using your components the way a user will, which allows your tests to give you more confidence that your application will work when a real user uses it.

> AI Annotation: label text, role, text content로 요소를 찾으려면 실제 HTML에 적절한 `<label>`, `aria-label`, semantic markup이 있어야 한다. 테스트를 통과시키기 위해 접근성을 챙기게 되는 선순환.

### Reference
- https://testing-library.com/docs/react-testing-library/intro

---

## Enzyme으로도 사용자 관점 테스트를 작성할 수 있는데, Testing Library가 Enzyme을 대체한 이유는 무엇인가?

### Official Answer
This library is a replacement for Enzyme.
While you can follow these guidelines using Enzyme itself, enforcing this is harder because of all the extra utilities that Enzyme provides (utilities which facilitate testing implementation details).

> AI Annotation: Enzyme은 `shallow()`, `instance()`, `state()` 같은 내부 접근 API를 제공해서, 좋은 테스트 습관을 강제하기 어렵다. RTL은 이런 API를 아예 제공하지 않아 자연스럽게 올바른 방향으로 유도한다.

### Reference
- https://testing-library.com/docs/react-testing-library/intro
