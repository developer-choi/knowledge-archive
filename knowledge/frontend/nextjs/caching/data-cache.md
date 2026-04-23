---
tags: [nextjs, performance, principle]
---

# Questions
- Data Cache란 무엇이며 어디에 저장되는가?
- `force-cache` fetch가 수행될 때 내부 동작 순서는?
- Data Cache는 클라이언트 사이드에서도 작동하는가?
- `fetch()`의 `cache` 옵션 기본값(auto no cache), `no-store`, `force-cache`는 각각 어떻게 동작하는가?
- 한 페이지 안에서 cached data와 uncached data를 혼합할 수 있는가?
- Pages Router의 SSG 대비 App Router의 Data Cache가 개선한 부분은?
- Data Cache를 revalidate 하면 Full Route Cache는? 반대는?
- Route Handler에서 Data Cache를 revalidate 하면 Router Cache는?
- 한 페이지에서 fetch 요청 중 하나라도 cached가 아니면 라우트 전체는?

---

# Answers

## Data Cache란 무엇이며 어디에 저장되는가?

### Official Answer
Next.js has a built-in Data Cache that **persists** the result of data fetches across incoming **server requests** and **deployments**.
This is possible because Next.js extends the native `fetch` API to allow each request on the server to set its own persistent caching semantics.

> #### Key Terms:
> - **persists**: 영구 저장. 요청이나 배포 사이에도 유지된다
> - **deployments**: 새 배포. Data Cache는 새 배포에도 살아남음

> #### User Annotation:
> Request Memoization은 Server Memory에, Data Cache는 영구저장장치에 JSON 형태로 저장된다.
> Data Cache가 메모리에 저장됐다간 OOME(Out Of Memory Error)가 발생할 위험이 있기 때문이다.

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

> #### Key Terms:
> - **memoized**: 같은 렌더 패스 안에서 중복 호출이 메모리에서 재사용되도록 저장된 상태
> - **render pass**: React가 컴포넌트 트리를 한 번 렌더링하는 단위

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache

---

## Data Cache는 클라이언트 사이드에서도 작동하는가?

### Official Answer
In Next.js, the `cache` option indicates how a server-side request will interact with the server's Data Cache.

> #### Key Terms:
> - **server's Data Cache**: Next.js 서버가 관리하는 영속 데이터 캐시

> #### User Annotation:
> Data Cache는 서버사이드 한정이다. 클라이언트에서 fetch()를 호출할 때 cache 옵션은 Next.js Data Cache가 아니라 브라우저 HTTP 캐시에 영향을 준다.

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

> #### Key Terms:
> - **statically prerendered**: 빌드 타임에 미리 렌더링되어 결과가 캐시되는 상태
> - **Dynamic APIs**: `cookies()`, `headers()`, `searchParams` 등 런타임 요청 정보에 의존하는 API
> - **fresh**: 캐시 데이터가 아직 유효한 상태
> - **stale**: 캐시 데이터의 유효 기간이 지난 상태

### Reference
- https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache

---

## 한 페이지 안에서 cached data와 uncached data를 혼합할 수 있는가?

### Official Answer
If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache.
The data for the specific `fetch` request will be fetched for every incoming request.
Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache.
**This allows for a hybrid of cached and uncached data.**

> #### Key Terms:
> - **opt out of the Full Route Cache**: Full Route Cache 적용 대상에서 제외되어 매 요청마다 동적으로 렌더링됨
> - **hybrid of cached and uncached data**: 한 라우트 안에서 캐싱된 데이터와 캐싱되지 않은 데이터가 공존하는 구성

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#opting-out

---

## Pages Router의 SSG 대비 App Router의 Data Cache가 개선한 부분은?

### User Answer
Pages Router는 페이지 **전체를** SSG 하는 것만 가능했다.
데이터를 Server Side에서 캐시하려면, UI와 함께 캐싱되는 SSG 외에는 방법이 없었다.

- UI 따로, Data 따로 캐싱이 불가능했다.
- UI / Data 둘 다 부분적으로 캐싱하는 것도 불가능했다 (페이지 일부 영역만 캐싱하는 것이 불가능).
- 한 페이지에서 상단 영역은 SSG, 하단 영역은 SSR 같은 구성을 만들 수 없었다.

하지만 App Router에서는 다음이 가능하다.

- UI만 따로 캐싱이 된다.
- 데이터도 따로 Data Cache로 캐싱이 가능하다.
- 데이터는 종류별로 분리해서 캐싱이 가능하다 (단, API 종류에 종속됨).
- UI도 따로 캐싱이 가능하다 (당연히 static rendering에 한해).

> #### User Annotation:
> Pages Router에서 React Query 등으로 클라이언트에서 캐싱하는 방법은 근본적으로 브라우저별 저장이라 한계가 있다.
> 천만 명이 같은 페이지에 접근하면 천만 번 API를 호출한 뒤 각자 캐싱된다.
> 모든 유저에게 동일하게 노출되는 데이터라면 서버 사이드 캐시가 훨씬 유리하다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache

---

## Data Cache를 revalidate 하면 Full Route Cache는? 반대는?

### Official Answer
Revalidating or opting out of the Data Cache **will** invalidate the Full Route Cache, as the render output depends on data.

Invalidating or opting out of the Full Route Cache **does not** affect the Data Cache.
You can dynamically render a route that has both cached and uncached data.
This is useful when most of your page uses cached data, but you have a few components that rely on data that needs to be fetched at request time.
You can dynamically render without worrying about the performance impact of re-fetching all the data.

> #### Key Terms:
> - **invalidate**: 기존 캐시를 무효화하여 다음 요청 시 새로 채워지게 함
> - **render output depends on data**: 렌더 결과가 데이터에 의존하므로 데이터가 바뀌면 렌더 결과도 다시 만들어져야 함

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache-and-full-route-cache

---

## Route Handler에서 Data Cache를 revalidate 하면 Router Cache는?

### Official Answer
Revalidating the Data Cache in a Route Handler **will not** immediately invalidate the Router Cache as the Route Handler isn't tied to a specific route.
This means Router Cache will continue to serve the previous payload until a hard refresh, or the automatic invalidation period has elapsed.

To immediately invalidate the Data Cache and Router cache, you can use `revalidatePath` or `revalidateTag` in a Server Action.

> #### Key Terms:
> - **Route Handler**: `app/api/.../route.ts` 형태의 서버 핸들러. 특정 라우트에 묶여 있지 않음
> - **Server Action**: 서버에서 실행되며 호출된 라우트와 연결되는 함수
> - **hard refresh**: 페이지를 강제 새로고침하여 클라이언트 캐시까지 초기화하는 동작

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache-and-client-side-router-cache

---

## 한 페이지에서 fetch 요청 중 하나라도 cached가 아니면 라우트 전체는?

### Official Answer
If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache.
The data for the specific `fetch` request will be fetched for every incoming request.
Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache.

> #### Key Terms:
> - **opt the route out of the Full Route Cache**: 라우트 전체를 Full Route Cache 대상에서 제외시킴

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#opting-out
