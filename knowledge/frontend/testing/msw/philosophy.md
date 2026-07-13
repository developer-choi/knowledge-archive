---
tags: [testing, network]
source: official
publishable: true
---
# Questions
- MSW(Mock Service Worker)란 무엇이며, 어떤 일을 하는가?
- MSW는 mock 응답을 요청에 어떻게 끼워 넣는가? fetch를 바꿔치기하는 방식과 무엇이 다른가?
- 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?
- vi.mock·axios-mock-adapter처럼 모킹을 특정 도구·라이브러리에 얹으면 어떤 손해가 있으며, MSW는 이를 어떻게 해결하는가?

---

# Answers

## MSW(Mock Service Worker)란 무엇이며, 어떤 일을 하는가?

### Official Answer
Mock Service Worker (MSW) is an API mocking library for browser and Node.js. With MSW, you can intercept outgoing requests, observe them, and respond to them using mocked responses.

### Reference
- https://mswjs.io/docs/
- https://github.com/mswjs/msw

---

## MSW는 mock 응답을 요청에 어떻게 끼워 넣는가? fetch를 바꿔치기하는 방식과 무엇이 다른가?

### Official Answer
MSW uses the Service Worker API to intercept actual production requests on the network level. Instead of patching fetch and meddling with your application's integrity, MSW bets on the platform, utilizing the standard browser API to implement a revolutionary request interception logic.

Even in Node.js, where there are no standard means to intercept requests, MSW uses class extension instead of module patching to ensure your tests run in the environment as close to production as possible.

MSW utilizes minimal intrusion framework when it comes to intercepting outgoing network traffic. This means having zero changes to your code altogether by using a designated Service Worker in the browser, or implementing custom request interception algorithms in Node.js that focus on the integrity of your code.

### Reference
- https://mswjs.io/docs/
- https://mswjs.io/docs/philosophy

---

## 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

### Official Answer
We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing window.fetch, or relying on third-party adapters.

### Reference
- https://github.com/testing-library/react-testing-library
- https://github.com/mswjs/msw

---

## vi.mock·axios-mock-adapter처럼 모킹을 특정 도구·라이브러리에 얹으면 어떤 손해가 있으며, MSW는 이를 어떻게 해결하는가?

### Official Answer
Mock Service Worker is simultaneously similar and nothing alike other API mocking solutions. While it provides you with the ability to intercept outgoing requests and mock their responses, it's not coupled with any particular testing or development tooling. This small distinction enables most of the benefits that MSW provides.

We are convinced that API mocking deserves a layer of its own in your application. Being able to control the network any time and anywhere may come in handy in various situations, such as testing network-related code or reproducing and debugging a particular network scenario. Such level of control is simply impossible when using API mocking as a feature of any other tooling because you will always be limited by that tooling. There are no limits with MSW.

We embrace the WHATWG Fetch API specification, meaning that each intercepted request is an actual Request instance, and each mocked response is an actual Response instance. We depend on semantics and standards instead of contriving custom APIs to satisfy particular use cases. We dedicate constant effort to minimize the amount of library-specific knowledge you need to have to use MSW. Instead, we rely on standard APIs and platform features so you would actually learn how to work with requests and responses (and we would ship less code, which is yay!).

### Reference
- https://mswjs.io/docs/philosophy
