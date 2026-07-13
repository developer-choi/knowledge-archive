---
tags: [testing, vitest, concept]
source: official
publishable: true
priority:
---
# Questions
- 매 테스트마다 반복되는 준비·정리 코드를 복붙하지 않으려면 Vitest에서 무엇을 쓰는가?
- 파일 안 모든 테스트에 각각 준비·정리를 걸려면 어떤 훅을 쓰며, 각각 언제 실행되는가?
- 테스트가 도중에 실패해도 afterEach(정리 훅)는 실행되는가?
- 한 파일의 테스트들이 매번 상태를 리셋하지 않으면 어떤 문제가 생기며, 훅이 이를 어떻게 해결하는가?
- DB 연결·서버 기동처럼 매 테스트마다 반복하기엔 너무 비싼 준비 작업은 어떤 훅으로 처리하며, beforeEach와 무엇이 다른가?
- onTestFinished 훅은 무엇을 하며, beforeEach·afterEach와 달리 어디에서 호출해야 하는가?
- onTestFinished는 어떤 점에서 유용한가?

---

# Answers

## 매 테스트마다 반복되는 준비·정리 코드를 복붙하지 않으려면 Vitest에서 무엇을 쓰는가?

### Official Answer
Often while writing tests, you need to do some work before tests run (initialize data, connect to a database, start a server) and clean up afterwards. Rather than duplicating this code in every test, Vitest provides lifecycle hooks that run automatically at the right time.

### Reference
- https://vitest.dev/guide/learn/setup-teardown.html

---

## 파일 안 모든 테스트에 각각 준비·정리를 걸려면 어떤 훅을 쓰며, 각각 언제 실행되는가?

### Official Answer
The most common hooks are `beforeEach` and `afterEach`. As the names suggest, `beforeEach` runs before every test in the file, and `afterEach` runs after every test, even if the test fails. This makes them perfect for ensuring each test starts with a known state.

### Reference
- https://vitest.dev/guide/learn/setup-teardown.html

---

## 테스트가 도중에 실패해도 afterEach(정리 훅)는 실행되는가?

### Official Answer
As the names suggest, `beforeEach` runs before every test in the file, and `afterEach` runs after every test, even if the test fails.

### Reference
- https://vitest.dev/guide/learn/setup-teardown.html

---

## 한 파일의 테스트들이 매번 상태를 리셋하지 않으면 어떤 문제가 생기며, 훅이 이를 어떻게 해결하는가?

### Official Answer
Without these hooks, the second test's push would affect any test that runs after it, which is a classic source of flaky tests. The hooks guarantee clean state for every test.

### Reference
- https://vitest.dev/guide/learn/setup-teardown.html

---

## DB 연결·서버 기동처럼 매 테스트마다 반복하기엔 너무 비싼 준비 작업은 어떤 훅으로 처리하며, beforeEach와 무엇이 다른가?

### Official Answer
Some setup is too expensive to repeat for every test. If you need to connect to a database, start a server, or load a large file, doing that before every test would slow your suite down dramatically. That's what `beforeAll` and `afterAll` are for. They run once for the entire file.

The database connection is created once, shared across all tests, and then closed when the file finishes running.

### Reference
- https://vitest.dev/guide/learn/setup-teardown.html

---

## onTestFinished 훅은 무엇을 하며, beforeEach·afterEach와 달리 어디에서 호출해야 하는가?

### Official Answer
Vitest provides a few hooks that you can call during the test execution to cleanup the state when the test has finished running. These hooks will throw an error if they are called outside of the test body.

This hook is always called after the test has finished running. It is called after afterEach hooks since they can influence the test result. It receives an TestContext object like beforeEach and afterEach.

### Reference
- https://vitest.dev/api/hooks.html

---

## onTestFinished는 어떤 점에서 유용한가?

### Official Answer
This hook is particularly useful when creating reusable logic.

It is also a good practice to cleanup your spies after each test, so they don't leak into other tests. You can do so by enabling restoreMocks config globally, or restoring the spy inside onTestFinished (if you try to restore the mock at the end of the test, it won't be restored if one of the assertions fails - using onTestFinished ensures the code always runs).

### Reference
- https://vitest.dev/api/hooks.html
