---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Request Memoization이란 무엇이며 Next.js가 어떻게 fetch를 extend하는가?
- Request Memoization의 동작 순서는?
- Request Memoization의 제약은?
- Request Memoization은 언제까지 유지되는가?
- 왜 Request Memoization은 revalidate가 필요 없는가?
- Request Memoization 덕분에 권장되는 데이터 페칭 패턴은?

---

# Answers

## Request Memoization이란 무엇이며 Next.js가 어떻게 fetch를 extend하는가?

### Official Answer
Next.js extends the `fetch API` to automatically memoize requests that have the same URL and options.
This means you can call a fetch function for the same data in multiple places in a React component tree while **only executing it once.**

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

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

> #### User Annotation:
> generateMetadata()와 generateStaticParams()까지 memoization이 적용되는 점은 의외다.

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

---

## Request Memoization 덕분에 권장되는 데이터 페칭 패턴은?

### Official Answer
When rendering a route, Next.js will automatically deduplicate fetch requests for the same data across `generateMetadata`, `generateStaticParams`, Layouts, Pages, and Server Components.
React `cache` can be used if `fetch` is unavailable.

This provides one flexible way to fetch, cache, and revalidate data at the **component level**.

In this new model, we recommend fetching data directly in the component that needs it, even if you're requesting the same data in multiple components, rather than passing the data between components as props.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#request-memoization
- https://nextjs.org/docs/app/building-your-application/data-fetching
