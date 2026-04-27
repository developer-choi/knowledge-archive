---
tags: [react-query, ssr, hydration]
---

# Questions
- SSR에서 `dehydrate(queryClient)`는 어떻게 클라이언트로 전달되는가?
- 서버에서 QueryClient는 어떻게 관리되는가? (per-request 인스턴스, server `gcTime` 기본값, `gcTime: 0` 위험)
- `<HydrationBoundary>`를 여러 곳에서 사용해도 되는가? Server Components에서 보일러플레이트 제거가 가능한가?
- prefetch용 queryClient를 모든 Server Component에서 단일 인스턴스로 재사용해도 되는가?
- React Query는 dehydrate 시 실패한 쿼리를 포함하는가? 동작을 override할 수 있는가?

---

# Answers

## SSR에서 `dehydrate(queryClient)`는 어떻게 클라이언트로 전달되는가?

### Official Answer
When doing `return { props: { dehydratedState: dehydrate(queryClient) } }` in Next.js, what happens is that the `dehydratedState` representation of the queryClient is serialized by the framework so it can be embedded into the markup and transported to the client.

### Reference
- https://tanstack.com/query/v4/docs/react/guides/ssr
- https://tanstack.com/query/v4/docs/react/reference/hydration

---

## 서버에서 QueryClient는 어떻게 관리되는가? (per-request 인스턴스, server `gcTime` 기본값, `gcTime: 0` 위험)

### Official Answer
In case you are creating the QueryClient for **every request**, React Query creates the isolated cache for this client, which is preserved in memory for the `gcTime` period.
That may lead to high memory consumption on server in case of high number of requests during that period.

On the server, `gcTime` defaults to `Infinity` which disables manual garbage collection and **will automatically clear memory once a request has finished**.
If you are explicitly setting a non-Infinity `gcTime` then you will be responsible for clearing the cache early.

Avoid setting `gcTime` to 0 as it may result in a hydration error.
This occurs because the Hydration Boundary places necessary data into the cache for rendering, but if the garbage collector removes the data before the rendering completes, issues may arise.
If you require a shorter `gcTime`, we recommend setting it to `2 * 1000` to allow sufficient time for the app to reference the data.

### Reference
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

---

## `<HydrationBoundary>`를 여러 곳에서 사용해도 되는가? Server Components에서 보일러플레이트 제거가 가능한가?

### Official Answer
In the SSR guide, we noted that you could get rid of the boilerplate of having `<HydrationBoundary>` in every route.
**This is not possible with Server Components.**

As you can see, it's perfectly fine to use `<HydrationBoundary>` in multiple places, and create and dehydrate multiple queryClient for prefetching.

> #### User Annotation:
> Pages Router SSR에서만 보일러플레이트 제거가 가능했나? — 확인 필요.

### Reference
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

---

## prefetch용 queryClient를 모든 Server Component에서 단일 인스턴스로 재사용해도 되는가?

### Official Answer
We create a new queryClient for each Server Component that fetches data.
This is the recommended approach, but if you want to, you can alternatively create a single one that is reused across all Server Components.

The downside is that every time you call `dehydrate(getQueryClient())`, you serialize the **entire queryClient**, **including queries** that have **already been serialized before** and are **unrelated to the current Server Component** which is **unnecessary overhead**.

### Reference
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#alternative-use-a-single-queryclient-for-prefetching

---

## React Query는 dehydrate 시 실패한 쿼리를 포함하는가? 동작을 override할 수 있는가?

### Official Answer
React Query defaults to a graceful degradation strategy. This means:

- `queryClient.prefetchQuery(...)` never throws errors
- `dehydrate(...)` only includes successful queries, **not failed ones**

This will lead to any failed queries being retried on the client and that the server rendered output will include loading states instead of the full content.

If you for some reason want to include failed queries in the dehydrated state to avoid retries, you can use the option `shouldDehydrateQuery` to override the default function and implement your own logic.

> #### User Annotation:
> 기본 설정으로는 성공한 쿼리만 dehydrate 되고 Client에서 다시 리패칭하는 구조로 동작함을 확인했다.

### Reference
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
