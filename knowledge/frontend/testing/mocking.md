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

> #### AI Annotation:
> Unit test는 isolation이 핵심이므로, DB·네트워크·외부 객체 같은 외부 의존성은 그대로 사용할 수 없다.
> 대신 data stub(고정된 가짜 데이터)으로 대체하여 테스트 대상 코드만 격리해 검증한다.

### Reference
- https://aws.amazon.com/what-is/unit-testing/

---

## Unit test에서 의존성을 mock하고 호출 assertion이 통과하면, 실제 연동도 정상이라고 볼 수 있는가?

### Official Answer
Unit tests are incapable of ensuring that when you call into a dependency that you're calling it appropriately (though you can make assertions on how it's being called, you can't ensure that it's being called properly with a unit test).

It doesn't matter if your component `<A />` renders component `<B />` with props c and d if component `<B />` actually breaks if prop e is not supplied.
So while having some unit tests to verify these pieces work in isolation isn't a bad thing, it doesn't do you any good if you don't also verify that they work together properly.

> #### AI Annotation:
> 아니오.
> mock은 가짜 구현이므로, 실제 의존성이 해당 인자를 받아서 올바르게 동작하는지는 보장할 수 없다.
> 예를 들어 `api.createUser({name: 'Kim'})`을 호출했다고 assertion하더라도, 실제 API가 `username` 필드를 기대한다면 unit test는 이를 잡지 못한다.

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

> #### AI Annotation:
> 그 외에는 전부 실제 코드를 사용한다.
> 커스텀 render가 앱의 모든 Provider(Router, Theme, Auth 등)를 감싸 실제 환경과 최대한 비슷하게 렌더링한다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://kentcdodds.com/blog/write-tests

---

## 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

### Official Answer
We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing window.fetch, or relying on third-party adapters.

> #### AI Annotation:
> window.fetch를 stub하면 axios 같은 다른 HTTP 클라이언트를 쓸 때 깨지고, 네트워크 레벨이 아닌 함수 레벨에서 가로채므로 실제 요청 흐름과 달라진다.
> MSW는 Service Worker로 네트워크 레벨에서 가로채므로 선언적이고, 클라이언트 구현에 독립적이다.

### Reference
- https://github.com/testing-library/react-testing-library
- https://github.com/mswjs/msw
