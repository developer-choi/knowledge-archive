---
tags: [nextjs, performance, principle]
source: official
publishable: true
priority: 
---

# Questions
- ISR(증분 정적 재생성)이란 무엇인가?
- `revalidate = 60`이 걸린 라우트에서, 60초가 지난 뒤 들어온 첫 요청은 무엇을 받으며 새 페이지는 언제 만들어지는가?
- 재검증 도중 에러가 나면 사용자는 무엇을 보게 되는가?

---

# Answers

## ISR(증분 정적 재생성)이란 무엇인가?

### Official Answer
Incremental Static Regeneration (ISR) enables you to:

- Update static content without rebuilding the entire site
- Reduce server load by serving prerendered, static pages for most requests
- Ensure proper `cache-control` headers are automatically added to pages
- Handle large amounts of content pages without long `next build` times

### Reference
- https://nextjs.org/docs/app/guides/incremental-static-regeneration

---

## `revalidate = 60`이 걸린 라우트에서, 60초가 지난 뒤 들어온 첫 요청은 무엇을 받으며 새 페이지는 언제 만들어지는가?

### Official Answer
1. During `next build`, all known blog posts are generated
2. All requests made to these pages (e.g. `/blog/1`) are cached and instantaneous
3. After 60 seconds has passed, the next request will still return the cached (now stale) page
4. The cache is invalidated and a new version of the page begins generating in the background
5. Once generated successfully, the next request will return the updated page and cache it for subsequent requests

After an hour has passed, the next visitor will still receive the cached (stale) version of the page immediately for a fast response. Simultaneously, Next.js triggers regeneration of a fresh version in the background. Once the new version is successfully generated, it replaces the cached version, and subsequent visitors will receive the updated content.

```tsx
// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60
```

### Reference
- https://nextjs.org/docs/app/guides/incremental-static-regeneration

---

## 재검증 도중 에러가 나면 사용자는 무엇을 보게 되는가?

### Official Answer
If an error is thrown while attempting to revalidate data, the last successfully generated data will continue to be served from the cache. On the next subsequent request, Next.js will retry revalidating the data.

### Reference
- https://nextjs.org/docs/app/guides/incremental-static-regeneration
