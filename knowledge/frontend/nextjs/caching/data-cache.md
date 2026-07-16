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
- 한 페이지 안에서 cached data와 uncached data를 혼합할 수 있는가?
- Data Cache를 revalidate 하면 Full Route Cache는? 반대는?
- Route Handler에서 Data Cache를 revalidate 하면 Router Cache는?
- 한 페이지에서 fetch 요청 중 하나라도 cached가 아니면 라우트 전체는?

---

# Answers

## Data Cache란 무엇이며 어디에 저장되는가?

### Official Answer
Next.js has a built-in Data Cache that **persists** the result of data fetches across incoming **server requests** and **deployments**.
This is possible because Next.js extends the native `fetch` API to allow each request on the server to set its own persistent caching semantics.

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

### User Answer
Request Memoization은 Server Memory에, Data Cache는 영구저장장치에 JSON 형태로 저장된다.
Data Cache가 메모리에 저장됐다간 OOME(Out Of Memory Error)가 발생할 위험이 있기 때문이다.

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

### User Answer
Data Cache는 서버사이드 한정이다.
클라이언트에서 fetch()를 호출할 때 cache 옵션은 Next.js Data Cache가 아니라 브라우저 HTTP 캐시에 영향을 준다.

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

### Reference
- https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache

---

## 한 페이지 안에서 cached data와 uncached data를 혼합할 수 있는가?

### Official Answer
If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache.
The data for the specific `fetch` request will be fetched for every incoming request.
Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache.
**This allows for a hybrid of cached and uncached data.**

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#opting-out

---

## Data Cache를 revalidate 하면 Full Route Cache는? 반대는?

### Official Answer
Revalidating or opting out of the Data Cache **will** invalidate the Full Route Cache, as the render output depends on data.

Invalidating or opting out of the Full Route Cache **does not** affect the Data Cache.
You can dynamically render a route that has both cached and uncached data.
This is useful when most of your page uses cached data, but you have a few components that rely on data that needs to be fetched at request time.
You can dynamically render without worrying about the performance impact of re-fetching all the data.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache-and-full-route-cache

---

## Route Handler에서 Data Cache를 revalidate 하면 Router Cache는?

### Official Answer
Revalidating the Data Cache in a Route Handler **will not** immediately invalidate the Router Cache as the Route Handler isn't tied to a specific route.
This means Router Cache will continue to serve the previous payload until a hard refresh, or the automatic invalidation period has elapsed.

To immediately invalidate the Data Cache and Router cache, you can use `revalidatePath` or `revalidateTag` in a Server Action.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache-and-client-side-router-cache

---

## 한 페이지에서 fetch 요청 중 하나라도 cached가 아니면 라우트 전체는?

### Official Answer
If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache.
The data for the specific `fetch` request will be fetched for every incoming request.
Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#opting-out
