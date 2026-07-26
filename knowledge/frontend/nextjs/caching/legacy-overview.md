---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Next.js의 네 가지 캐시는 각각 무엇을 어디에 저장하고 얼마나 유지되는가?
- 렌더링 도중 Dynamic API나 `{ cache: 'no-store' }`를 만나면 그 라우트는 어떻게 되는가?
- 라우트가 fully static이 되려면 어떤 조건이 필요하며, 한 라우트에 캐시된 데이터와 캐시 안 된 데이터를 섞을 수 있는가?

---

# Answers

## Next.js의 네 가지 캐시는 각각 무엇을 어디에 저장하고 얼마나 유지되는가?

### Official Answer
Here's a high-level overview of the different caching mechanisms and their purpose:

| Mechanism | What | Where | Purpose | Duration |
|---|---|---|---|---|
| Request Memoization | Return values of functions | Server | Re-use data in a React Component tree | Per-request lifecycle |
| Data Cache | Data | Server | Store data across user requests and deployments | Persistent (can be revalidated) |
| Full Route Cache | HTML and RSC payload | Server | Reduce rendering cost and improve performance | Persistent (can be revalidated) |
| Router Cache | RSC Payload | Client | Reduce server requests on navigation | User session or time-based |

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함. 현행 문서 `guides/caching-without-cache-components`에는 이 4계층 명칭 체계가 없다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#overview

---

## 렌더링 도중 Dynamic API나 `{ cache: 'no-store' }`를 만나면 그 라우트는 어떻게 되는가?

### Official Answer
During rendering, if a Dynamic API or a fetch option of { cache: 'no-store' } is discovered, Next.js will switch to dynamically rendering the whole route.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## 라우트가 fully static이 되려면 어떤 조건이 필요하며, 한 라우트에 캐시된 데이터와 캐시 안 된 데이터를 섞을 수 있는가?

### Official Answer
For a route to be fully static, all data must be cached.
However, you can have a dynamically rendered route that uses both cached and uncached data fetches.

### Additional Answer
그 혼합이 가능한 이유(UI와 데이터가 따로 캐시된다)는 [../rendering/server-client/pipeline.md](../rendering/server-client/pipeline.md)의 「RSC Payload와 데이터가 따로 캐시되면 무엇이 가능해지는가?」 참고.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching
