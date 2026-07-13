---
tags: [testing, network]
source: official
publishable: true
---
# Questions
- MSW를 셋업해두기만 하고 어떤 요청에 대한 핸들러를 안 적었다면, 그 요청은 어떻게 처리되는가?
- 하나의 요청이 여러 핸들러에 매칭될 때, 어떤 핸들러가 그 요청을 처리하는가?

---

# Answers

## MSW를 셋업해두기만 하고 어떤 요청에 대한 핸들러를 안 적었다면, 그 요청은 어떻게 처리되는가?

### Official Answer
MSW embraces a network-first approach, which means that it will not interfere with the network unless you explicitly say so in your handlers.

### Reference
- https://mswjs.io/docs/defaults

---

## 하나의 요청이 여러 핸들러에 매칭될 때, 어떤 핸들러가 그 요청을 처리하는가?

### Official Answer
Every intercepted request "falls through" the list of your handlers, looking for the first matching handler to return an instruction on how to handle the request (mock response, response-patch, passthrough, do nothing). A single request may match multiple handlers at the same time but only one handler can be responsible for handling it.

```ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/user', () => console.log('One')),
  http.get('/user', () => HttpResponse.json({ name: 'John' })),
  http.get('/user', () => console.log('Three')),
]
```

In the example above, given an outgoing GET /user request, you will see the "One" string printed to the console and then receive the mocked JSON response as defined in the second handler. You will not see the "Three" string because the third handler is never reached (i.e. request already handled).

### Reference
- https://mswjs.io/docs/defaults
