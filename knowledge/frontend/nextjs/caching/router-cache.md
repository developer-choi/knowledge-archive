---
tags: [nextjs, performance, principle]
---

# Questions
- Router Cache란 무엇이며 무엇을 저장하는가?
- Router Cache는 어디에 저장되는가? 새로고침하면 어떻게 되는가?
- Router Cache의 지속 기간을 결정하는 두 요인은?
- Automatic Invalidation Period는 prefetch 종류·정적/동적 페이지에 따라 어떻게 다른가?
- Router Cache를 invalidate 하는 두 가지 방법은?
- `router.refresh()`의 동작 범위는?

---

# Answers

## Router Cache란 무엇이며 무엇을 저장하는가?

### Official Answer
Next.js has an in-memory client-side router cache that stores the RSC payload of route segments, split by layouts, loading states, and pages.

When a user navigates between routes, Next.js caches the visited route segments.
This results in instant back/forward navigation, no full-page reload between navigations.

- Layouts are cached and reused on navigation (partial rendering).
- Loading states are cached and reused on navigation for instant navigation.
- Pages are not cached by default, but are reused during browser backward and forward navigation.

This cache specifically applies to Server Components.

> #### Key Terms:
> - **RSC payload**: React Server Component 렌더링 결과의 바이너리 표현
> - **route segments**: 라우트를 구성하는 segment 단위 (layout, loading, page 등)
> - **partial rendering**: 변경된 segment만 렌더링하고 공통 layout은 재사용하는 방식

> #### User Annotation:
> layouts, loading states, pages 셋 다 RSC Payload 형태로 Router Cache에 저장된다.

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#router-cache

---

## Router Cache는 어디에 저장되는가? 새로고침하면 어떻게 되는가?

### Official Answer
The cache is stored in the browser's temporary **memory**.

> #### Key Terms:
> - **temporary memory**: 브라우저가 세션 동안만 유지하는 임시 메모리. 영구 저장소가 아님

> #### User Annotation:
> 영구 저장소가 아니므로 새로고침하면 당연히 삭제된다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#router-cache

---

## Router Cache의 지속 기간을 결정하는 두 요인은?

### Official Answer
Two factors determine how long the router cache lasts:

- **Session**: The cache persists across navigation. However, it's cleared **on page refresh**.
- **Automatic Invalidation Period**: The cache of layouts and loading states is automatically invalidated after a specific time.
The duration depends on how the resource was prefetched, and if the resource was statically generated.

This Router Cache is used to improve the navigation experience by storing previously visited routes and **prefetching future routes.**

> #### Key Terms:
> - **Session**: 사용자 세션 단위. 페이지 새로고침 시 초기화됨
> - **Automatic Invalidation Period**: 일정 시간이 지나면 자동으로 캐시가 무효화되는 기간
> - **prefetched**: `<Link>`나 `router.prefetch()`로 미리 가져온 상태

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#duration-3

---

## Automatic Invalidation Period는 prefetch 종류·정적/동적 페이지에 따라 어떻게 다른가?

### Official Answer
Default Prefetching (`prefetch={null}` or unspecified):

- not cached for dynamic pages
- 5 minutes for static pages

Full Prefetching (`prefetch={true}` or `router.prefetch`):

- 5 minutes for both static & dynamic pages

While a page refresh will clear **all cached segments**, the automatic invalidation period **only affects the individual segment** from the time it was prefetched.

> #### Key Terms:
> - **Default Prefetching**: `<Link>`의 prefetch prop을 지정하지 않거나 null로 둔 기본 동작
> - **Full Prefetching**: `prefetch={true}` 또는 `router.prefetch()`로 명시한 prefetch
> - **individual segment**: 라우트를 구성하는 개별 segment 단위

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#duration-3

---

## Router Cache를 invalidate 하는 두 가지 방법은?

### Official Answer
There are two ways you can invalidate the Router Cache:

- **In a Server Action**:
  - Revalidating data on-demand by path with (`revalidatePath`) or by cache tag with (`revalidateTag`).
  - Using `cookies.set` or `cookies.delete` invalidates the Router Cache to prevent routes that use cookies from becoming stale (e.g. authentication).
- Calling `router.refresh` will invalidate the Router Cache and make a new request to the server for the current route.

> #### Key Terms:
> - **Server Action**: 서버에서 실행되며 클라이언트 라우트에 연결된 함수
> - **revalidatePath / revalidateTag**: 경로 또는 태그 단위로 데이터를 재검증하는 API
> - **router.refresh**: `useRouter` 훅이 제공하는 현재 라우트 강제 갱신 API

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation-1

---

## `router.refresh()`의 동작 범위는?

### Official Answer
Calling `router.refresh` will invalidate the Router Cache and make a new request to the server for the current route.

> #### Key Terms:
> - **current route**: 현재 보고 있는 라우트. `router.refresh()`는 이 라우트에 한해서만 동작함

> #### User Annotation:
> router.refresh()는 현재 경로의 Router Cache(layouts, pages 모두)를 비우고 서버에 새 요청을 보낸다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation-1
