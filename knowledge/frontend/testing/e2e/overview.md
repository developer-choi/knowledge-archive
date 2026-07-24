---
tags: [testing, concept]
source: official
priority:
---
# Questions
- E2E test란 무엇인가?
- E2E test의 장점과 단점은?
- E2E 테스트는 왜 실패 원인을 추적하기 어려운가?
- E2E 테스트를 잔뜩 짜놨는데, 툭하면 실패하고, 실패하면 원인이 어디인지 찾는 데만 한참 걸리고, 하나가 깨지면 뒤따라 여러 개가 같이 깨지고, 고치는 데도 시간이 오래 걸린다. 게다가 워낙 다양한 이유로 실패해서 결과를 신뢰하기도 어렵다. 이렇게 단점이 많은데도, 그럼에도 왜 E2E를 써야 하나?
- 그럼 버그를 빠르게 고치게 해 주는 테스트란 어떤 것인가?
- E2E 테스트는 어떤 경우에 작성해야 하는가?

---

# Answers

## E2E test란 무엇인가?

### Official Answer
End to End: A helper robot that behaves like a user to click around the app and verify that it functions correctly.
Sometimes called "functional testing" or e2e.

Typically these will run the entire application (both frontend and backend) and your test will interact with the app just like a typical user would.
These tests are written with cypress.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## E2E test의 장점과 단점은?

### Official Answer
An E2E test has more points of failure making it often harder to track down what code caused the breakage, but it also means that your test is giving you more confidence.
This is especially useful if you don't have as much time to write tests.
I'd rather have the confidence and be faced with tracking down why it's failing, than not having caught the problem via a test in the first place.

The higher up the trophy you go, the more points of failure there are and therefore the more likely it is that a test will break, leading to more time needed to analyze and fix the tests.

End to End tests are pretty darn capable, but typically you'll run these in a non-production environment (production-like, but not production) to trade-off that confidence for practicality.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## E2E 테스트는 왜 실패 원인을 추적하기 어려운가?

### Official Answer
Finding the root cause for a failing end-to-end test is painful and can take a long time.
And even if a test finds a bug, that bug could be anywhere in the product.

### Reference
- https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html

---

## E2E 테스트를 잔뜩 짜놨는데, 툭하면 실패하고, 실패하면 원인이 어디인지 찾는 데만 한참 걸리고, 하나가 깨지면 뒤따라 여러 개가 같이 깨지고, 고치는 데도 시간이 오래 걸린다. 게다가 워낙 다양한 이유로 실패해서 결과를 신뢰하기도 어렵다. 이렇게 단점이 많은데도, 그럼에도 왜 E2E를 써야 하나?

### Official Answer
A failing test does not directly benefit the user.
A bug fix directly benefits the user.
But in that entire process, from failing test to bug fix, value is only added at the very last step.
Thus, to evaluate any testing strategy, you cannot just evaluate how it finds bugs. You also must evaluate how it enables developers to fix (and even prevent) bugs.

### Reference
- https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html

---

## 그럼 버그를 빠르게 고치게 해 주는 테스트란 어떤 것인가?

### Official Answer
Tests create a feedback loop that informs the developer whether the product is working or not. The ideal feedback loop has several properties:

- **It's fast.** No developer wants to wait hours or days to find out if their change works. Sometimes the change does not work - nobody is perfect - and the feedback loop needs to run multiple times. A faster feedback loop leads to faster fixes. If the loop is fast enough, developers may even run tests before checking in a change.
- **It's reliable.** No developer wants to spend hours debugging a test, only to find out it was a flaky test. Flaky tests reduce the developer's trust in the test, and as a result flaky tests are often ignored, even when they find real product issues.
- **It isolates failures.** To fix a bug, developers need to find the specific lines of code causing the bug. When a product contains millions of lines of codes, and the bug could be anywhere, it's like trying to find a needle in a haystack.

### Reference
- https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html

---

## E2E 테스트는 어떤 경우에 작성해야 하는가?

### Official Answer
If two units do not integrate properly, why write an end-to-end test when you can write a much smaller, more focused integration test that will detect the same bug?
Even with both unit tests and integration tests, you probably still will want a small number of end-to-end tests to verify the system as a whole.

### Reference
- https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
