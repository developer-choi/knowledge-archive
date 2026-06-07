---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Next.js는 기본적으로 얼마나 많은 것을 캐싱하는가?
- 캐싱 동작은 어떤 요인들에 따라 달라지는가?
- Next.js의 4가지 캐싱 메커니즘을 비교하면?
- Dynamic API나 `{ cache: 'no-store' }`가 감지되면 라우트는 어떻게 되는가?
- Route가 fully static으로 렌더링되려면 어떤 조건이 필요한가? (hybrid 가능?)
- 개발자는 static/dynamic rendering을 직접 선택해야 하는가?

---

# Answers

## Next.js는 기본적으로 얼마나 많은 것을 캐싱하는가?

### Official Answer
By default, Next.js will cache as much as possible to improve performance and reduce cost.
This means routes are **statically rendered** and data requests are **cached** unless you opt out.

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## 캐싱 동작은 어떤 요인들에 따라 달라지는가?

### Official Answer
Caching behavior changes depending on whether the route is statically or dynamically rendered, data is cached or uncached, and whether a request is part of an initial visit or a subsequent navigation.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## Next.js의 4가지 캐싱 메커니즘을 비교하면?

### Official Answer
Here's a high-level overview of the different caching mechanisms and their purpose:

| Mechanism | What | Where | Purpose | Duration |
|---|---|---|---|---|
| Request Memoization | Return values of functions | Server | Re-use data in a React Component tree | Per-request lifecycle |
| Data Cache | Data | Server | Store data across user requests and deployments | Persistent (can be revalidated) |
| Full Route Cache | HTML and RSC payload | Server | Reduce rendering cost and improve performance | Persistent (can be revalidated) |
| Router Cache | RSC Payload | Client | Reduce server requests on navigation | User session or time-based |

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#overview

---

## Dynamic API나 `{ cache: 'no-store' }`가 감지되면 라우트는 어떻게 되는가?

### Official Answer
During rendering, if a Dynamic API or a fetch option of { cache: 'no-store' } is discovered, Next.js will switch to dynamically rendering the whole route.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## Route가 fully static으로 렌더링되려면 어떤 조건이 필요한가? (hybrid 가능?)

### Official Answer
For a route to be fully static, all data must be cached.
However, you can have a dynamically rendered route that uses both cached and uncached data fetches.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## 개발자는 static/dynamic rendering을 직접 선택해야 하는가?

### Official Answer
This page helps you understand how Next.js works under the hood but is **not** essential knowledge to be productive with Next.js.
Most of Next.js' caching heuristics are determined by your API usage and have defaults for the best performance with zero or minimal configuration.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching
