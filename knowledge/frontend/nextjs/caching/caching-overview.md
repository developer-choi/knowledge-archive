---
tags: [nextjs, performance, principle]
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

> #### Key Terms:
> - **statically rendered**: 빌드 시점에 라우트를 미리 렌더링하여 HTML/RSC payload를 저장해두는 방식
> - **opt out**: 기본 캐싱 동작을 명시적으로 해제하는 것

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## 캐싱 동작은 어떤 요인들에 따라 달라지는가?

### Official Answer
Caching behavior changes depending on whether the route is statically or dynamically rendered, data is cached or uncached, and whether a request is part of an initial visit or a subsequent navigation.

> #### Key Terms:
> - **initial visit**: 유저가 해당 라우트에 처음 접근하는 요청
> - **subsequent navigation**: 초기 방문 이후 이어지는 네비게이션

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

> #### Key Terms:
> - **RSC Payload**: React Server Component 렌더링 결과의 바이너리 표현
> - **Persistent**: 요청이나 배포를 넘어 유지되는 지속성

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#overview

---

## Dynamic API나 `{ cache: 'no-store' }`가 감지되면 라우트는 어떻게 되는가?

### Official Answer
During rendering, if a Dynamic API or a fetch option of { cache: 'no-store' } is discovered, Next.js will switch to dynamically rendering the whole route.

> #### Key Terms:
> - **Dynamic API**: `cookies()`, `headers()`, `searchParams` 등 런타임 요청 정보에 의존하는 API
> - **dynamically rendering**: 빌드 시점이 아니라 요청 시점마다 렌더링하는 방식

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## Route가 fully static으로 렌더링되려면 어떤 조건이 필요한가? (hybrid 가능?)

### Official Answer
For a route to be fully static, all data must be cached.
However, you can have a dynamically rendered route that uses both cached and uncached data fetches.

> #### Key Terms:
> - **fully static**: 라우트 전체가 정적으로 렌더링된 상태
> - **hybrid**: 한 라우트 안에서 cached data와 uncached data가 공존하는 형태

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching

---

## 개발자는 static/dynamic rendering을 직접 선택해야 하는가?

### Official Answer
This page helps you understand how Next.js works under the hood but is **not** essential knowledge to be productive with Next.js.
Most of Next.js' caching heuristics are determined by your API usage and have defaults for the best performance with zero or minimal configuration.

> #### Key Terms:
> - **heuristics**: 경험적 판단 규칙. 여기서는 Next.js가 API 사용 패턴으로 캐싱을 자동 결정하는 규칙

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching
