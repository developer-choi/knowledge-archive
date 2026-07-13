---
tags: [testing, network]
source: official
publishable: true
---
# Questions
- MSW로 나가는 네트워크 요청을 가로채려면 어떻게 셋업하는가?
  - 핸들러를 작성해 setupServer/setupWorker에 넘기려면 어떻게 하는가?

---

# Answers

## MSW로 나가는 네트워크 요청을 가로채려면 어떻게 셋업하는가?

### Official Answer
Those are functions responsible for intercepting requests and handling their responses.

On their own, request handlers don't do anything. They have to be provided to the setupServer or setupWorker functions to configure API mocking in a Node.js or a browser process, respectively.

At this step, you find the appropriate place to enable API mocking in your Node.js process. In the case of Vitest, that place is the test setup file, which runs before your tests.

### Reference
- https://mswjs.io/docs/quick-start

---

## 핸들러를 작성해 setupServer/setupWorker에 넘기려면 어떻게 하는가?

### Official Answer
Import the http namespace from the msw package and create your first request handler.

```ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]
```

One of the core benefits of MSW is the ability to reuse the same mocks (e.g. handlers.ts) across different tools and environments. On their own, request handlers don't do anything. They have to be provided to the setupServer or setupWorker functions to configure API mocking in a Node.js or a browser process, respectively.

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers.js'

export const server = setupServer(...handlers)
```

In the browser, use the `setupWorker` counterpart imported from `msw/browser`.

```js
// src/mocks/browser.js
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### Reference
- https://mswjs.io/docs/quick-start
- https://mswjs.io/docs/integrations/browser

