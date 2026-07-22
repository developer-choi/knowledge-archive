---
tags: [testing, concept]
source: official
priority:
---
# Questions
- 테스트에서 왜 mocking이 필요한가?
- 테스트에서 mock 함수를 쓰면 무엇을 할 수 있게 되는가?
- 같은 가짜 함수를 여러 테스트에서 재사용할 때, 왜 매 테스트마다 mock을 정리해줘야 하는가?
- mocking의 단점(비용)은 무엇인가?
  - 그렇다면 언제 mocking을 해야 하는가?

---

# Answers

## 테스트에서 왜 mocking이 필요한가?

### Official Answer
When a block of code requires other parts of the system to run, you can't use a unit test with that external data. The unit test needs to run in isolation.

There are several reasons you might want to do this: maybe the real function makes network requests that would slow down your tests, or maybe you need to simulate an error that's hard to trigger with real code.

Mocking lets you fake it so you can make it. If you couldn't have a fake version of certain modules or services, testing the checkout process of an app would cost you a lot of money in credit card fees. So instead, we make a fake version of that credit card charging service to avoid paying the fees.

### Reference
- https://aws.amazon.com/what-is/unit-testing/
- https://vitest.dev/guide/learn/mock-functions.html
- https://kentcdodds.com/blog/the-merits-of-mocking

---

## 테스트에서 mock 함수를 쓰면 무엇을 할 수 있게 되는가?

### Official Answer
Mock functions let you control what a dependency returns, observe how it was called, and isolate the code under test from side effects.

### Reference
- https://vitest.dev/guide/learn/mock-functions.html

---

## 같은 가짜 함수를 여러 테스트에서 재사용할 때, 왜 매 테스트마다 mock을 정리해줘야 하는가?

### Official Answer
Always remember to clear or restore mocks before or after each test run to undo mock state changes between runs!

### Reference
- https://vitest.dev/guide/mocking.html

---

## mocking의 단점(비용)은 무엇인가?

### Official Answer
When you mock something, you're making a trade-off. You're trading confidence for something else. For me, that something else is usually practicality — meaning I wouldn't be able to test this thing at all, or it may be pretty difficult/messy, without mocking.

Mocking severs the real-world connection between what you're testing and what you're mocking. Even if we have confidence that our code works with our fake version of the credit card service, we can't have 100% confidence that our code will work in production with the real version of the credit card service. When you mock something you're removing all confidence in the integration between what you're testing and what's being mocked.

### Reference
- https://kentcdodds.com/blog/the-merits-of-mocking
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## 그렇다면 언제 mocking을 해야 하는가?

### Official Answer
I pretty much only mock:
1. Network requests (using MSW)
2. Components responsible for animation (because who wants to wait for that in your tests?)

You don't actually want to send emails or charge credit cards every test, but most of the time you can avoid mocking and you'll be better for it.

In my UI unit and integration tests, I have a rule. I never make actual network calls; instead, I'll mock the server response by mocking the module responsible for making the network calls. I'll also mock animation libraries to avoid waiting for animations before elements are removed from the page. Other than that, most of my UI tests are using the real production code. For E2E tests, I avoid mocking anything with the exception of the backend hitting fake or test services and not actual credit card services, for example.

Prefer real implementations when they're fast and reliable. If a dependency is a simple in-memory data structure or a pure function, there's no reason to mock it. The closer your tests are to real usage, the more confidence they give you. Only reach for mocks when the real thing is slow, flaky, or has side effects you can't control in a test.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://kentcdodds.com/blog/write-tests
- https://kentcdodds.com/blog/the-merits-of-mocking
- https://vitest.dev/guide/learn/testing-in-practice.html
