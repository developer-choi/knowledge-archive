---
tags: [nextjs, performance, principle]
source: official
publishable: true
---

# Questions
- 빌드 때 만들어지지 않은 주소로 요청이 들어오면 어떻게 되는가?
- 정적으로 두려던 라우트가 의도치 않게 동적 렌더링으로 넘어가는 경우는?
  - 한 라우트에 재검증 주기가 다른 `fetch`가 여럿이면 ISR 주기는 어떻게 정해지는가?
- 서버를 여러 대 띄워 돌릴 때, 필요할 때 부르는 재검증은 어디까지 먹는가?

---

# Answers

## 빌드 때 만들어지지 않은 주소로 요청이 들어오면 어떻게 되는가?

### Official Answer
If `/blog/26` is requested, and it exists, the page will be generated on-demand. This behavior can be changed by using a different `dynamicParams` value. However, if the post does not exist, then 404 is returned.

### Reference
- https://nextjs.org/docs/app/guides/incremental-static-regeneration

---

## 정적으로 두려던 라우트가 의도치 않게 동적 렌더링으로 넘어가는 경우는?

### Official Answer
If any of the `fetch` requests used on a route have a `revalidate` time of `0`, or an explicit `no-store`, the route will be dynamically rendered.

### Reference
- https://nextjs.org/docs/app/guides/incremental-static-regeneration

---

## 한 라우트에 재검증 주기가 다른 `fetch`가 여럿이면 ISR 주기는 어떻게 정해지는가?

### Official Answer
If you have multiple `fetch` requests in a prerendered route, and each has a different `revalidate` frequency, the lowest time will be used for ISR. However, those revalidate frequencies will still be respected by the cache.

### Reference
- https://nextjs.org/docs/app/guides/incremental-static-regeneration

---

## 서버를 여러 대 띄워 돌릴 때, 필요할 때 부르는 재검증은 어디까지 먹는가?

### Official Answer
When running multiple instances, the default file-system cache is per-instance. On-demand revalidation only invalidates the instance that receives the call. Use a shared custom cache handler to coordinate across instances.

Background regeneration (stale-while-revalidate) runs on the instance that receives the triggering request. On platforms with per-request billing, this background work counts as additional compute.

### Reference
- https://nextjs.org/docs/app/guides/incremental-static-regeneration
