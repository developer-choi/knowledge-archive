---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Router Cache란 무엇이며 무엇을 저장하는가?
- Router Cache는 어디에 저장되는가? 새로고침하면 어떻게 되는가?
- Router Cache의 지속 기간을 결정하는 두 요인은?
- Automatic Invalidation Period는 prefetch 종류·정적/동적 페이지에 따라 어떻게 다른가?
- Router Cache를 invalidate 하는 두 가지 방법은?
- [`router.refresh()`의 자세한 동작은? → `router-refresh.md`](./router-refresh.md)

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

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

### User Answer
layouts, loading states, pages 셋 다 RSC Payload 형태로 Router Cache에 저장된다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#router-cache

---

## Router Cache는 어디에 저장되는가? 새로고침하면 어떻게 되는가?

### Official Answer
The cache is stored in the browser's temporary **memory**.

### User Answer
영구 저장소가 아니므로 새로고침하면 당연히 삭제된다.

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

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation-1
