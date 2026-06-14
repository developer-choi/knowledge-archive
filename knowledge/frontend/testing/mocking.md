---
tags: [testing, concept]
source: official
priority:
---
# Questions
- Unit test에서 dependency가 있을 때 어떻게 처리하는가?
- Unit test에서 의존성을 mock하고 호출 assertion이 통과하면, 실제 연동도 정상이라고 볼 수 있는가?
- Integration test에서 mock하는 것과 하지 않는 것의 기준은?
- 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

---

# Answers

## Unit test에서 dependency가 있을 때 어떻게 처리하는가?

### Official Answer
When a block of code requires other parts of the system to run, you can't use a unit test with that external data.
The unit test needs to run in isolation.
Other system data, such as databases, objects, or network communication, might be required for the code's functionality.
If that's the case, you should use data stubs instead.

### Reference
- https://aws.amazon.com/what-is/unit-testing/

---

## Unit test에서 의존성을 mock하고 호출 assertion이 통과하면, 실제 연동도 정상이라고 볼 수 있는가?

### Official Answer
Unit tests are incapable of ensuring that when you call into a dependency that you're calling it appropriately (though you can make assertions on how it's being called, you can't ensure that it's being called properly with a unit test).

It doesn't matter if your component `<A />` renders component `<B />` with props c and d if component `<B />` actually breaks if prop e is not supplied.
So while having some unit tests to verify these pieces work in isolation isn't a bad thing, it doesn't do you any good if you don't also verify that they work together properly.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://kentcdodds.com/blog/write-tests

---

## Integration test에서 mock하는 것과 하지 않는 것의 기준은?

### Official Answer
I pretty much only mock:
1. Network requests (using MSW)
2. Components responsible for animation (because who wants to wait for that in your tests?)

When you mock something you're removing all confidence in the integration between what you're testing and what's being mocked.
You don't actually want to send emails or charge credit cards every test, but most of the time you can avoid mocking and you'll be better for it.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://kentcdodds.com/blog/write-tests

---

## 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

### Official Answer
We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing window.fetch, or relying on third-party adapters.

### Reference
- https://github.com/testing-library/react-testing-library
- https://github.com/mswjs/msw
