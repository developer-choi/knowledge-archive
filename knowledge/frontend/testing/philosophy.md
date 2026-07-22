---
tags: [testing, concept]
source: official
priority:
---
# Questions
- implementation details를 테스트하면 왜 all downside, no upside인가?
- Unit test 하나에 assert를 여러 개 두면 어떤 문제가 생기는가?
- React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?

---

# Answers

## implementation details를 테스트하면 왜 all downside, no upside인가?

### Official Answer
But what are you getting confidence in when you test things this way?
The testing user doesn't pay the bills like the end user.
It doesn't affect the rest of the system like the developer user.

Writing tests that include implementation details is all downside and no upside.

You should very rarely have to change tests when you refactor code.

### Reference
- https://kentcdodds.com/blog/avoid-the-test-user
- https://kentcdodds.com/blog/write-tests

---

## Unit test 하나에 assert를 여러 개 두면 어떤 문제가 생기는가?

### Official Answer
For each unit test, there should only be one true or false outcome.
Make sure that there is only one assert statement within your test.
A failed assert statement in a block of multiple ones can cause confusion on which one produced the issue.

### Reference
- https://aws.amazon.com/what-is/unit-testing/

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
