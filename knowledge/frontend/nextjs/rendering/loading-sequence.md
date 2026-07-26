---
tags: [nextjs, principle, concept]
source: google-doc
publishable: false
priority:
---

# Questions
- Next.js에서 렌더링 작업은 어떤 단위로 나뉘는가?
- 클라이언트에서 Reconciliation과 Hydration은 어떻게 이루어지는가?
- Router Cache에는 무엇이 저장되며 어떻게 활용되는가?
- Subsequent Navigation에서 Next.js는 서버 요청을 어떻게 최소화하는가?
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

### Review Note
- 현행 답변은 [server-client/pipeline.md](server-client/pipeline.md)의 「Next.js는 서버에서 렌더링 작업을 어떤 단위로 쪼개는가?」에 있다. 그쪽 v16 원문은 route segment만 들고 Suspense 경계를 빼는데, 두 서술이 배타적이지 않은 이유는 그 질문의 `### Additional Answer`가 설명한다.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## 클라이언트에서 Reconciliation과 Hydration은 어떻게 이루어지는가?

### Official Answer
At request time, on the client:

1. The HTML is used to immediately show a fast non-interactive initial preview of the Client and Server Components.

2. The React Server Components Payload is used to reconcile the Client and rendered Server Component trees, and update the DOM.

3. The JavaScript instructions are used to hydrate Client Components and make the application interactive.

### Review Note
- 현행 답변은 [server-client/pipeline.md](server-client/pipeline.md)의 「첫 로드에서 HTML·RSC Payload·JavaScript는 각각 어디에 쓰이는가?」에 있다. 세 항목의 구성은 같고 문장만 다르다.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## Router Cache에는 무엇이 저장되며 어떻게 활용되는가?

### Official Answer
The React Server Component Payload is stored in the client-side Router Cache - a separate in-memory cache, split by individual route segment.
This Router Cache is used to improve the navigation experience by storing previously visited routes and **prefetching future routes.**

### Review Note
- 무엇이 저장되고 얼마나 남아 있는지를 더 자세히 다루는 쪽은 [../caching/legacy-router-cache.md](../caching/legacy-router-cache.md)의 「Router Cache란 무엇이며 무엇을 저장하는가?」다.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache

---

## Subsequent Navigation에서 Next.js는 서버 요청을 어떻게 최소화하는가?

### Official Answer
On subsequent navigations or during prefetching, Next.js will check if the RSC Payload **is stored in the Router Cache.**

If so, it will skip sending a new request to the server.

If the route segments are not in the cache, Next.js will fetch the React Server Components Payload from the server, and populate the Router Cache on the client.

### Review Note
- 화면 이동에서 무엇이 달라지는지를 v16 원문으로 다루는 쪽은 [server-client/pipeline.md](server-client/pipeline.md)의 「첫 로드 이후의 화면 이동은 무엇이 달라지는가?」다. 이 질문은 그 이동이 서버를 건너뛰는 조건을 본다.

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

### Review Note
- Hydration 자체의 정의는 [hydration.md](hydration.md)의 「Hydration이란 무엇이며, 서버가 보낸 HTML에 React가 어떤 작업을 하는가?」가 담당한다. 이 질문은 그 작업이 페이지 전체를 한 번에 하느냐 조각별로 하느냐의 차이를 본다.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache
