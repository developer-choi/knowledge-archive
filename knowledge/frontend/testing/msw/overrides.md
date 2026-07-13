---
tags: [testing, network]
source: official
publishable: true
---
# Questions
- MSW에서, 셋업 때 준 기본 핸들러를 그대로 두면서 특정 테스트에서만 네트워크 동작을 다르게 덮어쓰려면 어떤 API를 쓰는가?
- `.use()`로 추가한 오버라이드는 기본적으로 얼마 동안 유효한가?
- 개별 테스트에서 `.use()`로 추가한 오버라이드가 다른 테스트로 새지 않게 청소하려면 어떤 메서드를 호출하며, 그 메서드는 무엇을 제거하는가?

---

# Answers

## MSW에서, 셋업 때 준 기본 핸들러를 그대로 두면서 특정 테스트에서만 네트워크 동작을 다르게 덮어쓰려면 어떤 API를 쓰는가?

### Official Answer
MSW provides you the means to override any particular network behavior using the designated .use() API.

With the .use(), you can prepend any list of request handlers to the initial request handlers provided to setupWorker()/setupServer(), making them take priority when handling requests. Since this is a runtime API, you can invoke it after the API mocking has been enabled, for example, on the individual test basis.

### Reference
- https://mswjs.io/docs/best-practices/network-behavior-overrides

---

## `.use()`로 추가한 오버라이드는 기본적으로 얼마 동안 유효한가?

### Official Answer
By default, calling .use() will create a permanent override.

In this example, the GET /resource request will always receive the "Override" plain text response because the request handler attached with .use() takes precedence.

### Reference
- https://mswjs.io/docs/best-practices/network-behavior-overrides

---

## 개별 테스트에서 `.use()`로 추가한 오버라이드가 다른 테스트로 새지 않게 청소하려면 어떤 메서드를 호출하며, 그 메서드는 무엇을 제거하는가?

### Official Answer
You can remove any request handlers added via .use() at any point in time by calling the .resetHandlers() method on the same worker/server object that called .use().

This is particularly useful to clean up any runtime request handlers introduced in individual tests so they don't affect unrelated tests.

### Reference
- https://mswjs.io/docs/best-practices/network-behavior-overrides
