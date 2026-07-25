---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Next.js에서 `fetch` 요청은 기본적으로 캐시되는가?
- 캐싱 동작을 요청 하나가 아니라 라우트 전체에 걸려면 어떻게 하는가?
- `dynamic` 설정은 layout·page의 무엇을 바꾸는가?
  - `dynamic`을 `'error'`로 둘 때와 `'force-static'`으로 둘 때, 요청 시점 API를 만나면 각각 어떻게 되는가?
  - `dynamic = 'force-dynamic'`은 개별 `fetch` 옵션으로 환산하면 무엇과 같은가?

---

# Answers

## Next.js에서 `fetch` 요청은 기본적으로 캐시되는가?

### Official Answer
By default, `fetch` requests are not cached. You can cache individual requests by setting the `cache` option to `'force-cache'`.

```tsx
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

`fetch` requests are not cached by default and will block the page from rendering until the request is complete. Use the `use cache` directive to cache results, or wrap the fetching component in `<Suspense>` to stream fresh data at request time.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components
- https://nextjs.org/docs/app/getting-started/fetching-data

---

## 캐싱 동작을 요청 하나가 아니라 라우트 전체에 걸려면 어떻게 하는가?

### Official Answer
You can configure caching behavior at the route level by exporting config options from a Page, Layout, or Route Handler.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## `dynamic` 설정은 layout·page의 무엇을 바꾸는가?

### Official Answer
Change the dynamic behavior of a layout or page to fully static or fully dynamic.

```tsx
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

- **`'auto'`** (default): The default option to cache as much as possible without preventing any components from opting into dynamic behavior.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## `dynamic`을 `'error'`로 둘 때와 `'force-static'`으로 둘 때, 요청 시점 API를 만나면 각각 어떻게 되는가?

### Official Answer
- **`'error'`**: Force prerendering and cache the data of a layout or page by causing an error if any components use Request-time APIs or uncached data. This option is equivalent to:
  - `getStaticProps()` in the `pages` directory.
  - Setting the option of every `fetch()` request in a layout or page to `{ cache: 'force-cache' }`.
  - Setting the segment config to `fetchCache = 'only-cache'`.
- **`'force-static'`**: Force prerendering and cache the data of a layout or page by forcing `cookies`, `headers()` and `useSearchParams()` to return empty values. It is possible to `revalidate`, `revalidatePath`, or `revalidateTag`, in pages or layouts rendered with `force-static`.

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components

---

## `dynamic = 'force-dynamic'`은 개별 `fetch` 옵션으로 환산하면 무엇과 같은가?

### Official Answer
- **`'force-dynamic'`**: Force dynamic rendering, which will result in routes being rendered for each user at request time. This option is equivalent to:
  - Setting the option of every `fetch()` request in a layout or page to `{ cache: 'no-store', next: { revalidate: 0 } }`.
  - Setting the segment config to `export const fetchCache = 'force-no-store'`

### Reference
- https://nextjs.org/docs/app/guides/caching-without-cache-components
