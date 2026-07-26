---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- 같은 데이터를 컴포넌트 트리 여러 곳에서 fetch하면 실제 요청은 몇 번 나가는가?
- Request Memoization의 동작 순서는?
- Request Memoization의 제약은?
- Request Memoization은 언제까지 유지되는가?
- 왜 Request Memoization은 revalidate가 필요 없는가?

---

# Answers

## 같은 데이터를 컴포넌트 트리 여러 곳에서 fetch하면 실제 요청은 몇 번 나가는가?

### Official Answer
This means you can call a fetch function for the same data in multiple places in a React component tree while **only executing it once.**

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.
- 이 중복 제거 덕분에 props로 내려보내지 않아도 된다는 쪽은 [../data-fetching/server-components.md](../data-fetching/server-components.md)의 「같은 데이터가 여러 컴포넌트에서 필요할 때, 위에서 한 번 가져와 props로 내려보내지 않아도 되는 까닭은 무엇인가?」가 v16 원문으로 담당한다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#request-memoization

---

## Request Memoization의 동작 순서는?

### Official Answer
- While rendering a route, the first time a particular request is called, its result will not be in memory and it'll be a cache `MISS`.
- Therefore, the function will be executed, and the data will be fetched from the external source, and the result will be stored in memory.
- Subsequent function calls of the request in the same render pass will be a cache `HIT`, and the data will be returned from memory without executing the function.
- Once the route has been rendered and the rendering pass is complete, memory is "reset" and all request memoization entries are cleared.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#how-request-memoization-works

---

## Request Memoization의 제약은?

### Official Answer
Memoization only applies to the `GET` method in `fetch` requests.

Memoization only applies to the **React Component tree**, this means:

- It applies to `fetch` requests in `generateMetadata`, `generateStaticParams`, Layouts, Pages, and other Server Components.
- It doesn't apply to `fetch` requests in Route Handlers as they are not a part of the React component tree.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#request-memoization

---

## Request Memoization은 언제까지 유지되는가?

### Official Answer
The cache lasts the lifetime of a **server** request until the React component tree has **finished rendering**.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#duration

---

## 왜 Request Memoization은 revalidate가 필요 없는가?

### Official Answer
Since the memoization is not shared across server requests and only applies during rendering, there is no need to revalidate it.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#revalidating
