---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Data Cache란 무엇이며 어디에 저장되는가?
- `force-cache` fetch가 수행될 때 내부 동작 순서는?
- Data Cache는 클라이언트 사이드에서도 작동하는가?
- `fetch()`의 `cache` 옵션 기본값(auto no cache), `no-store`, `force-cache`는 각각 어떻게 동작하는가?
- Route Handler에서 Data Cache를 revalidate 하면 Router Cache는?

---

# Answers

## Data Cache란 무엇이며 어디에 저장되는가?

### Official Answer
Next.js has a built-in Data Cache that **persists** the result of data fetches across incoming **server requests** and **deployments**.
This is possible because Next.js extends the native `fetch` API to allow each request on the server to set its own persistent caching semantics.

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache

---

## `force-cache` fetch가 수행될 때 내부 동작 순서는?

### Official Answer
- The first time a `fetch` request is called during rendering, Next.js checks the Data Cache for a cached response.
- If a cached response is found, it's returned immediately and memoized.
- If a cached response is not found, the request is made to the data source, the result is stored in the Data Cache, and memoized.
- For uncached data (e.g. `{ cache: 'no-store' }`), the result is always fetched from the data source, and memoized.
- Whether the data is cached or uncached, the requests are always memoized to avoid making duplicate requests for the same data during a React render pass.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache

---

## Data Cache는 클라이언트 사이드에서도 작동하는가?

### Official Answer
In Next.js, the `cache` option indicates how a server-side request will interact with the server's Data Cache.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache
- https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache

---

## `fetch()`의 `cache` 옵션 기본값(auto no cache), `no-store`, `force-cache`는 각각 어떻게 동작하는가?

### Official Answer
**auto no cache (default)**
Next.js fetches the resource from the remote server on every request in development, but will fetch once during `next build` because the route will be statically prerendered.
If Dynamic APIs are detected on the route, Next.js will fetch the resource on every request.

**no-store**
Next.js fetches the resource from the remote server on every request, even if Dynamic APIs are not detected on the route.

**force-cache**
Next.js looks for a matching request in its Data Cache.
If there is a match and it is fresh, it will be returned from the cache.
If there is no match or a stale match, Next.js will fetch the resource from the remote server and update the cache with the downloaded resource.

### Review Note
- **기본값은 버전에 따라 다르다.** 현행 답변은 [data-cache.md](data-cache.md)의 「Next.js에서 `fetch` 요청은 기본적으로 캐시되는가?」에 있다 — v16 원문은 기본적으로 캐시하지 않는다고 말한다. 이 답변은 옛 동작의 기록이다.

### Reference
- https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache

---

## Route Handler에서 Data Cache를 revalidate 하면 Router Cache는?

### Official Answer
Revalidating the Data Cache in a Route Handler **will not** immediately invalidate the Router Cache as the Route Handler isn't tied to a specific route.
This means Router Cache will continue to serve the previous payload until a hard refresh, or the automatic invalidation period has elapsed.

To immediately invalidate the Data Cache and Router cache, you can use `revalidatePath` or `revalidateTag` in a Server Action.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache-and-client-side-router-cache
