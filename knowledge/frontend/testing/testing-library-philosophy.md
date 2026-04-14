---
tags: [testing, concept]
---
# Questions
- [컴포넌트 테스트에서 implementation details를 테스트하면 어떤 문제가 생기는가? Testing Library는 이 문제를 어떻게 해결하는가?](#컴포넌트-테스트에서-implementation-details를-테스트하면-어떤-문제가-생기는가-testing-library는-이-문제를-어떻게-해결하는가)
  - [Testing Library는 implementation details 테스트를 기술적으로 차단하는가?](#testing-library는-implementation-details-테스트를-기술적으로-차단하는가)
  - [테스트가 사용자의 소프트웨어 사용 방식과 닮을수록 더 큰 확신을 준다고 하는데, 그 근거는 무엇인가?](#테스트가-사용자의-소프트웨어-사용-방식과-닮을수록-더-큰-확신을-준다고-하는데-그-근거는-무엇인가)
- [Testing Library의 Guiding Principles는 "사용자처럼 테스트하라"는 원칙을 API 설계에 어떻게 반영하는가?](#testing-library의-guiding-principles는-사용자처럼-테스트하라는-원칙을-api-설계에-어떻게-반영하는가)
- [React Testing Library로 테스트를 작성하면 접근성(a11y)이 자연스럽게 개선된다고 하는데, 어떤 원리인가?](#react-testing-library로-테스트를-작성하면-접근성a11y이-자연스럽게-개선된다고-하는데-어떤-원리인가)
- [React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?](#react-testing-library에서-컴포넌트-트리의-어느-레벨을-테스트해야-하나)
- [implementation details를 테스트하면 왜 all downside, no upside인가?](#implementation-details를-테스트하면-왜-all-downside-no-upside인가)
- [implementation details의 정의는 무엇이고, React 컴포넌트에서 구현 세부사항에 해당하는 것은?](#implementation-details의-정의는-무엇이고-react-컴포넌트에서-구현-세부사항에-해당하는-것은)
- [테스트할 대상을 결정하는 5단계 프로세스는 무엇인가?](#테스트할-대상을-결정하는-5단계-프로세스는-무엇인가)
- [테스트를 작성할 때 코드 자체가 아니라 유스케이스를 중심으로 생각해야 하는 이유는?](#테스트를-작성할-때-코드-자체가-아니라-유스케이스를-중심으로-생각해야-하는-이유는)
- [테스트가 없는 대규모 앱에서 테스트를 도입할 때 어디서부터 시작해야 하는가?](#테스트가-없는-대규모-앱에서-테스트를-도입할-때-어디서부터-시작해야-하는가)

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

There are two distinct and important reasons to avoid testing implementation details.
Tests which test implementation details:
Can break when you refactor application code. **False negatives**
May not fail when you break application code. **False positives**
The software is actually broken but the test passes (false positive) or the software is actually working but the test fails (false negative).

Tests which test implementation details can give you a false negative when you refactor your code.
This leads to brittle and frustrating tests that seem to break anytime you so much as look at the code.

> #### Official Annotation: You may want to avoid the following implementation details: Internal state of a component, Internal methods of a component, Lifecycle methods of a component, Child components.
> #### AI Annotation: implementation details에 의존하는 테스트는 기능이 동일한 리팩토링에도 깨진다. Testing Library는 `getByRole`, `getByText` 등 사용자의 인식 방식을 모방하는 쿼리를 제공하여 이 문제를 해결한다.
> #### AI Annotation: 구현 세부사항 테스트의 false positive 예시 — `wrapper.instance().setOpenIndex(1)`로 state 변경을 검증하면 "버튼 클릭 → state 변경" 연결이 끊어져도 테스트가 통과한다. 사용자 행동(클릭)이 아닌 내부 메서드를 직접 호출했기 때문이다.

### Reference
- https://testing-library.com/docs/
- https://kentcdodds.com/blog/testing-implementation-details

---

## Testing Library는 implementation details 테스트를 기술적으로 차단하는가?

### Official Answer
Testing Library encourages you to avoid testing implementation details like the internals of a component you're testing (though it's still possible).

> #### AI Annotation: `container.querySelector` 등으로 여전히 내부 구현을 테스트할 수 있다. 기술적으로 차단하지 않고, 올바른 방향으로 유도하되 강제하지 않는 설계 철학이다.

### Reference
- https://testing-library.com/docs/

---

## 테스트가 사용자의 소프트웨어 사용 방식과 닮을수록 더 큰 확신을 준다고 하는데, 그 근거는 무엇인가?

### Official Answer
You want your tests to avoid including implementation details so refactors of your components (changes to implementation but not functionality) don't break your tests and slow you and your team down.

The main utilities it provides involve querying the DOM for nodes in a way that's similar to how the user finds elements on the page.
In this way, the library helps ensure your tests give you confidence that your application will work when a real user uses it.

We believe this leads to less brittle and more meaningful test code.

Implementation details are things which users of your code will not typically use, see, or even know about.

By making our test use the component differently than end-users and developers do, we create a third user our application code needs to consider: the tests!
Automated tests should verify that the application code works for the production users.

> #### AI Annotation: 역방향 논증(구현 세부사항 의존 → 거짓 실패 → 확신 저하)과 순방향 논증(사용자처럼 찾기 → 통과 시 실제 사용자도 동작 보장 → 확신). FAQ에서 직접적 선언이 추가됨: 사용자 관점 테스트 → less brittle(덜 깨짐) + more meaningful(더 의미 있음).

### Reference
- https://testing-library.com/docs/
- https://testing-library.com/docs/dom-testing-library/faq
- https://kentcdodds.com/blog/testing-implementation-details

---

## Testing Library의 Guiding Principles는 "사용자처럼 테스트하라"는 원칙을 API 설계에 어떻게 반영하는가?

### Official Answer
We try to only expose methods and utilities that encourage you to write tests that closely resemble how your web pages are used.

Utilities are included in this project based on the following guiding principles:

If it relates to rendering components, then it should deal with DOM nodes rather than component instances, and it should not encourage dealing with component instances.
We are making some trade-offs here because we're using a computer and often a simulated browser environment, but in general, utilities should encourage tests that use the components the way they're intended to be used.

### Reference
- https://testing-library.com/docs/guiding-principles

---

## React Testing Library로 테스트를 작성하면 접근성(a11y)이 자연스럽게 개선된다고 하는데, 어떤 원리인가?

### Official Answer
The utilities this library provides facilitate querying the DOM in the same way the user would.
Finding form elements by their label text (just like a user would), finding links and buttons from their text (like a user would).
It also exposes a recommended way to find elements by a data-testid as an "escape hatch" for elements where the text content and label do not make sense or is not practical.

This library encourages your applications to be more accessible and allows you to get your tests closer to using your components the way a user will, which allows your tests to give you more confidence that your application will work when a real user uses it.

> #### AI Annotation: label text, role, text content로 요소를 찾으려면 실제 HTML에 적절한 `<label>`, `aria-label`, semantic markup이 있어야 한다. 테스트를 통과시키기 위해 접근성을 챙기게 되는 선순환.

### Reference
- https://testing-library.com/docs/react-testing-library/intro

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

---

## implementation details를 테스트하면 왜 all downside, no upside인가?

### Official Answer
But what are you getting confidence in when you test things this way?
The testing user doesn't pay the bills like the end user.
It doesn't affect the rest of the system like the developer user.

Writing tests that include implementation details is all downside and no upside.

> #### Official Annotation: You should very rarely have to change tests when you refactor code.
> — Kent C. Dodds, "Write tests. Not too many. Mostly integration."
> #### AI Annotation: UI 코드의 사용자는 end user(컴포넌트와 상호작용하는 최종 사용자)와 developer user(컴포넌트를 렌더링하는 개발자) 두 명뿐이다. 구현 상세를 테스트하면 제3의 testing user가 생기는데, 이 사용자는 돈을 내지도, 시스템에 영향을 주지도 않는다.

### Reference
- https://kentcdodds.com/blog/avoid-the-test-user
- https://kentcdodds.com/blog/write-tests

---

## implementation details의 정의는 무엇이고, React 컴포넌트에서 구현 세부사항에 해당하는 것은?

### Official Answer
Implementation details are things which users of your code will not typically use, see, or even know about.

React components typically have two users: end-users, and developers.
The end user will see/interact with what we render in the render method.
The developer will see/interact with the props they pass to the component.
So our test should typically only see/interact with the props that are passed, and the rendered output.

> #### Key Terms:
> - **implementation details**: 코드의 사용자(end user, developer)가 보지도, 쓰지도, 알지도 못하는 내부 구현
> #### Official Annotation: Here are a few aspects of React that people often think about testing which results in implementation details tests: Lifecycle methods, Element event handlers, Internal Component State. Conversely, here are things that you should be testing because they concern your two users: User interactions (using userEvent), Changing props (using rerender), Context changes (using rerender), Subscription changes.
> — Kent C. Dodds, "How to Know What to Test"

### Reference
- https://kentcdodds.com/blog/testing-implementation-details
- https://kentcdodds.com/blog/how-to-know-what-to-test

---

## 테스트할 대상을 결정하는 5단계 프로세스는 무엇인가?

### Official Answer
What part of your untested codebase would be really bad if it broke? (The checkout process)
Try to narrow it down to a unit or a few units of code (When clicking the "checkout" button a request with the cart items is sent to /checkout)
Look at that code and consider who the "users" are (The developer rendering the checkout form, the end user clicking on the button)
Write down a list of instructions for that user to manually test that code to make sure it's not broken. (render the form with some fake data in the cart, click the checkout button, ensure the mocked /checkout API was called with the right data, respond with a fake successful response, make sure the success message is displayed).
Turn that list of instructions into an automated test.

> #### Key Terms:
> - **untested codebase**: 아직 테스트가 없는 코드 영역. 전부 테스트하려 하지 말고 깨지면 가장 큰 피해를 주는 곳부터 시작
> #### AI Annotation: 이 프로세스의 핵심은 3단계(사용자 파악)에 있다. 사용자를 먼저 정의하면 4단계에서 자연스럽게 구현 세부사항이 배제된다 — 사용자가 하지 않는 행동은 수동 테스트 지침에 들어갈 수 없기 때문이다.

### Reference
- https://kentcdodds.com/blog/testing-implementation-details

---

## 테스트를 작성할 때 코드 자체가 아니라 유스케이스를 중심으로 생각해야 하는 이유는?

### Official Answer
Think less about the code you are testing and more about the use cases that code supports.

When you think about the code itself, it's too easy and natural to start testing implementation details (which is road to disaster).

We write tests to be confident that our application will work when the user uses them.
That being the case, what we test should map directly to enhancing our confidence.

> #### Key Terms:
> - **use cases**: 사용자가 소프트웨어를 통해 달성하려는 구체적 시나리오. 테스트의 판단 기준이 되어야 할 단위
> #### AI Annotation: 코드를 보면 if/else 분기, 내부 상태 등 구현 세부사항을 테스트하게 된다. 유스케이스를 보면 사용자가 쓰는 방식에 가까운 테스트를 쓰게 되어 진짜 자신감을 얻는다.

### Reference
- https://kentcdodds.com/blog/how-to-know-what-to-test

---

## 테스트가 없는 대규모 앱에서 테스트를 도입할 때 어디서부터 시작해야 하는가?

### Official Answer
Consider your app from the user's point of view and ask:

What part of this app would make me most upset if it were broken?

I'd suggest making a list of features that your application supports and prioritize them based on this criteria.

Once you have that prioritized list, then I suggest writing a single end to end (E2E) test to cover the "happy path" that most of your users go through for the particular use case.
Often you can cover parts of several of the top features on your list this way.

The E2E tests aren't going to give you 100% use case coverage (and you should not even try), nor will they give you 100% code coverage (and you should not even record that for E2E tests anyway), but it will give you a great starting point and boost your confidence big time.

Once you have a few E2E tests in place, then you can start looking at writing some integration tests for some of the edge cases that you are missing in your E2E tests and unit tests for the more complex business logic that those features are using.
From here it just becomes a matter of adding tests over time.
Just don't bother with targeting a 100% code coverage report, it's not worth the time.

> #### Key Terms:
> - **happy path**: 대다수 사용자가 거치는 가장 일반적인 성공 시나리오. 테스트 시작점으로 가장 효율적
> #### AI Annotation: 위에서 아래로 내려가는 전략 — E2E로 happy path → integration으로 edge cases → unit으로 복잡한 비즈니스 로직. 점진적으로 자신감을 넓혀가되, 100% 커버리지는 목표로 삼지 않는다.

### Reference
- https://kentcdodds.com/blog/how-to-know-what-to-test
