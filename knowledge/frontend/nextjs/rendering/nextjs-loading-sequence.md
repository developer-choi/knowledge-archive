---
tags: [nextjs, principle, concept]
source: google-doc
publishable: false
priority:
---

# Questions

- Next.js에서 렌더링 작업은 어떤 단위로 나뉘는가?
- Next.js 서버에서 캐싱되는 결과물은 무엇인가? (Full Route Cache)
- 클라이언트에서 Reconciliation과 Hydration은 어떻게 이루어지는가?
- Router Cache에는 무엇이 저장되며 어떻게 활용되는가?
- Subsequent Navigation에서 Next.js는 서버 요청을 어떻게 최소화하는가?
- Static과 Dynamic 라우트는 Router Cache 기준으로 어떻게 다른가?
- Pages Router와 App Router의 Hydration 방식 차이는?

---

# Answers

## Next.js에서 렌더링 작업은 어떤 단위로 나뉘는가?

### Official Answer
The rendering work is split into chunks: by individual routes segments and **Suspense boundaries**.

Each chunk is rendered in two steps:

1. React renders Server Components into a special data format, optimized for streaming, called the **React Server Component Payload.**

2. Next.js uses the React Server Component Payload **and Client Component** JavaScript instructions to render **HTML** on the server.

This means we don't have to wait for everything to render before caching the work or sending a response. Instead, we can stream a response as work is completed.

> #### Key Terms:
> - **Suspense boundaries**: 비동기 렌더링 경계. 이 단위로 청크가 나뉘어 스트리밍됨
> - **React Server Component Payload**: Server Component 렌더링 결과의 특수 직렬화 포맷. 스트리밍에 최적화되어 있음

### User Answer
초기 로딩 시 Client Component으로도 HTML을 만든다. (서버에서 초기 HTML 생성 시 CC도 포함됨)

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## Next.js 서버에서 캐싱되는 결과물은 무엇인가? (Full Route Cache)

### Official Answer
The default behavior of Next.js is to cache the rendered result (React Server Component Payload and HTML) of a route on the server.

> #### Key Terms:
> - **Full Route Cache**: 서버에서 라우트별로 RSC Payload와 HTML을 함께 캐싱하는 메커니즘

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## 클라이언트에서 Reconciliation과 Hydration은 어떻게 이루어지는가?

### Official Answer
At request time, on the client:

1. The HTML is used to immediately show a fast non-interactive initial preview of the Client and Server Components.

2. The React Server Components Payload is used to reconcile the Client and rendered Server Component trees, and update the DOM.

3. The JavaScript instructions are used to hydrate Client Components and make the application interactive.

> #### Key Terms:
> - **reconcile**: RSC Payload를 이용해 클라이언트 컴포넌트 트리와 서버 렌더링 결과를 병합하는 과정
> - **hydrate**: 서버에서 만든 HTML에 JavaScript 이벤트 핸들러를 붙여 인터랙티브하게 만드는 과정

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## Router Cache에는 무엇이 저장되며 어떻게 활용되는가?

### Official Answer
The React Server Component Payload is stored in the client-side Router Cache - a separate in-memory cache, split by individual route segment.
This Router Cache is used to improve the navigation experience by storing previously visited routes and **prefetching future routes.**

> #### Key Terms:
> - **Router Cache**: 클라이언트 측 인메모리 캐시. RSC Payload를 라우트 세그먼트별로 분리해서 저장
> - **prefetching**: 사용자가 방문하기 전 미리 라우트 데이터를 불러오는 것

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## Subsequent Navigation에서 Next.js는 서버 요청을 어떻게 최소화하는가?

### Official Answer
On subsequent navigations or during prefetching, Next.js will check if the RSC Payload **is stored in the Router Cache.**

If so, it will skip sending a new request to the server.

If the route segments are not in the cache, Next.js will fetch the React Server Components Payload from the server, and populate the Router Cache on the client.

### User Answer
Next.js로 만든 웹사이트에 처음 접근한 페이지는 HTML을 받지만, Subsequent Navigation 페이지는 전부 RSC를 요청한다.

메뉴 오픈 시 3개 라우트가 즉시 요청되고, Link 위에 마우스 오버 시 prefetching 요청이 발생하는 것을 확인함. 핵심은 넷 다 RSC 요청이었다.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## Static과 Dynamic 라우트는 Router Cache 기준으로 어떻게 다른가?

### Official Answer
Whether a route is cached or not at build time depends on whether it's statically or dynamically rendered. Static routes are cached by default, whereas dynamic routes are rendered at request time, and not cached.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## Pages Router와 App Router의 Hydration 방식 차이는?

### Official Answer
Previously, opt-ing into server-side rendering with Next.js (through getServerSideProps) meant that interacting with your application was blocked until the entire page was hydrated.

With the App Router, we've refactored the architecture to be deeply integrated with React Suspense, meaning we can selectively hydrate parts of the page, without blocking other components in the UI from being interactive.
Content can be instantly streamed from the server, improving the perceived loading performance of a page.

When a route is loaded with Next.js, the initial HTML is rendered on the server.

On the server, React renders all Server Components before sending the result to the client.
- Server Component is guaranteed to be only rendered **on the server**.
- This includes Server Components nested inside Client Components.

On the client, React renders Client Components and slots in the rendered result of Server Components, merging the work done on the server and client.
- If any Server Components are nested inside a Client Component, their rendered content will be placed correctly within the Client Component.
- Client Components are pre-rendered **on the server** and hydrated **on the client**.
- This HTML is then **progressively enhanced** in the browser, allowing the client to take over the application and add interactivity, by asynchronously loading the Next.js and React client-side runtime.

> #### Key Terms:
> - **selective hydration**: 페이지 전체가 아니라 부분적으로 순차 hydration. App Router + React Suspense에서 가능
> - **progressively enhanced**: 서버에서 만든 정적 HTML에 클라이언트 런타임이 점진적으로 기능을 추가하는 방식

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache
