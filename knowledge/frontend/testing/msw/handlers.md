---
tags: [testing, network]
source: official
publishable: true
---
# Questions
- `http.get('/resource', () => {})`에서 첫 번째 인자와 두 번째 인자는 각각 무슨 역할을 하며, MSW는 그 둘을 뭐라고 부르는가?
  - 핸들러의 predicate 자리에 문자열 URL을 주면 MSW는 그것을 나가는 요청과 어떻게 대조하는가?
    - predicate에 `/users/:id`처럼 상대 경로를 주면 브라우저에서는 잘 매칭되는데, 같은 코드가 Node.js 테스트에서는 매칭되지 않을 수 있다. 왜 그런가?
- 목 응답이 실제 API 형태와 어긋나도 테스트는 통과하는 stale mock 문제가 있다. MSW는 이를 타입 수준에서 어떻게 방지하는가?

---

# Answers

## `http.get('/resource', () => {})`에서 첫 번째 인자와 두 번째 인자는 각각 무슨 역할을 하며, MSW는 그 둘을 뭐라고 부르는가?

### Official Answer
Every request handler consists of two parts: a predicate and a response resolver. A predicate decides which requests to intercept, and a resolver decides what to do with those requests.

### Reference
- https://mswjs.io/docs/http/intercepting-requests/

---

## 핸들러의 predicate 자리에 문자열 URL을 주면 MSW는 그것을 나가는 요청과 어떻게 대조하는가?

### Official Answer
You can provide a string as a request handler predicate that represents an entire request URL or its portion. MSW will use path-to-regexp@6 to match your predicate against outgoing requests to determine if they match.

When you provide an absolute request URL as a predicate, the outgoing request must match its scheme, host, and pathname to trigger the request handler.

### Reference
- https://mswjs.io/docs/http/intercepting-requests/

---

## predicate에 `/users/:id`처럼 상대 경로를 주면 브라우저에서는 잘 매칭되는데, 같은 코드가 Node.js 테스트에서는 매칭되지 않을 수 있다. 왜 그런가?

### Official Answer
When you provide a relative request URL as a predicate, it will be resolved against the current document (location.href). This is handy for in-browser mocking, but bear in mind that you need to configure the base URL in your Node.js tests because that's not a thing in Node.js.

MSW provides no means to set a base URL using its API. Instead, we highly recommend you using custom utility functions that build absolute URLs from relative paths. That way, you get practical convenience while remaining explicit and clear.

```js
function github(path) {
  return new URL(path, 'https://github.com').href
}

export const handlers = [
  http.get(github('/user/:login'), ({ params }) => {
    return HttpResponse.json({ login: params.login })
  }),
]
```

### Reference
- https://mswjs.io/docs/http/intercepting-requests/
- https://mswjs.io/docs/recipes/using-base-url/

---

## 목 응답이 실제 API 형태와 어긋나도 테스트는 통과하는 stale mock 문제가 있다. MSW는 이를 타입 수준에서 어떻게 방지하는가?

### Official Answer
Type-safe. Annotate path parameters, request and response body types to never have out-of-date mocks again.

### Reference
- https://mswjs.io/docs/http/
- https://mswjs.io/docs/best-practices/typescript
