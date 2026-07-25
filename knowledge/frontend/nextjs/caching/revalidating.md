---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- 재검증(revalidation)이란 무엇인가?
- 캐시된 데이터를 정해둔 시간이 지난 뒤 다시 가져오게 하려면 어떻게 하는가?
- layout이나 page 전체의 기본 갱신 시간을 정하려면 어떻게 하는가?
  - 라우트 설정의 `revalidate`와 개별 `fetch`의 `revalidate`가 다르면 어느 쪽이 적용되는가?
- 개발 환경에서 페이지 캐싱은 어떻게 동작하는가?
- 시간이 아니라 데이터가 바뀐 시점에 캐시를 갱신하려면 어떻게 하는가?
  - `revalidateTag`는 지울 대상을 어떻게 지정하는가?
  - `revalidateTag`와 `revalidatePath`는 무엇이 다른가?
- 관리자가 콘텐츠를 수정하는 시스템에서 캐시 기간과 갱신 시점을 어떻게 잡는 것이 좋은가?

---

# Answers

## 재검증(revalidation)이란 무엇인가?

### Official Answer
Revalidation is the process of updating cached data. It lets you keep serving fast, cached responses while ensuring content stays fresh.

### Reference
- https://nextjs.org/docs/app/getting-started/revalidating

---

## 캐시된 데이터를 정해둔 시간이 지난 뒤 다시 가져오게 하려면 어떻게 하는가?

### Official Answer
Use the `next.revalidate` option on `fetch` to revalidate data after a specified number of seconds:

```tsx
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

For non-`fetch` functions, `unstable_cache` accepts a `revalidate` option in its configuration.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## layout이나 page 전체의 기본 갱신 시간을 정하려면 어떻게 하는가?

### Official Answer
Set the default revalidation time for a layout or page.

```tsx
export const revalidate = false
// false | 0 | number
```

- **`false`** (default): The default heuristic to cache any `fetch` requests that set their `cache` option to `'force-cache'` or are discovered before a Request-time API is used. Semantically equivalent to `revalidate: Infinity` which effectively means the resource should be cached indefinitely. It is still possible for individual `fetch` requests to use `cache: 'no-store'` or `revalidate: 0` to avoid being cached and make the route dynamically rendered. Or set `revalidate` to a positive number lower than the route default to increase the revalidation frequency of a route.
- **`0`**: Ensure a layout or page is always dynamically rendered even if no Request-time APIs or uncached data fetches are discovered. This option changes the default of `fetch` requests that do not set a `cache` option to `'no-store'` but leaves `fetch` requests that opt into `'force-cache'` or use a positive `revalidate` as is.
- **`number`**: (in seconds) Set the default revalidation frequency of a layout or page to `n` seconds.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## 라우트 설정의 `revalidate`와 개별 `fetch`의 `revalidate`가 다르면 어느 쪽이 적용되는가?

### Official Answer
This option does not override the `revalidate` value set by individual `fetch` requests.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## 개발 환경에서 페이지 캐싱은 어떻게 동작하는가?

### Official Answer
In Development, Pages are *always* rendered on-demand and are never cached. This allows you to see changes immediately without waiting for a revalidation period to pass.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## 시간이 아니라 데이터가 바뀐 시점에 캐시를 갱신하려면 어떻게 하는가?

### Official Answer
To revalidate cached data after an event, use `revalidateTag` or `revalidatePath` in a Server Action or Route Handler.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## `revalidateTag`는 지울 대상을 어떻게 지정하는가?

### Official Answer
Tag `fetch` requests with `next.tags` to enable on-demand cache invalidation:

```tsx
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: { tags: ['user'] },
  })
}
```

For non-`fetch` functions, `unstable_cache` also accepts a `tags` option.

Invalidate cached data by tag using `revalidateTag`:

```tsx
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidateTag('user')
}
```

You can reuse the same tag in multiple functions to revalidate them all at once.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components
- https://nextjs.org/docs/app/getting-started/revalidating

---

## `revalidateTag`와 `revalidatePath`는 무엇이 다른가?

### Official Answer
Invalidate cached data by tag using `revalidateTag`.

Invalidate all cached data for a specific route path using `revalidatePath`:

```tsx
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidatePath('/profile')
}
```

For most use cases, prefer revalidating entire paths. If you need more granular control, you can use the `revalidateTag` function.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components
- https://nextjs.org/docs/app/guides/incremental-static-regeneration

---

## 관리자가 콘텐츠를 수정하는 시스템에서 캐시 기간과 갱신 시점을 어떻게 잡는 것이 좋은가?

### Official Answer
For content management systems with update mechanisms, use tags with longer cache durations and rely on `revalidateTag` to refresh content when it actually changes, rather than expiring the cache preemptively.

### Reference
- https://nextjs.org/docs/app/getting-started/revalidating
