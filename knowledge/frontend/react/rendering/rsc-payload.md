---
tags: [react, nextjs, principle]
---

# Questions
- RSC Payload란 무엇인가?
- RSC Payload에 들어있는 4가지 내용은?
- 렌더링 작업은 왜 chunk로 split되는가?
- 왜 HTML로 바로 만들지 않고 RSC Payload를 거치는가?
- Full Page Load에서 RSC Payload는 어떻게 사용되는가?
- Subsequent Navigation에서 RSC Payload는 어떻게 사용되는가?
- RSC Payload가 가져온 변화는?

---

# Answers

## RSC Payload란 무엇인가?

### Official Answer
The React Server Component Payload is a compact binary representation of the rendered React Server Components.

> #### User Annotation:
> RSC Payload는 UI를 그리는 데 필요하며 다음 4가지 속성을 가진다:
> 1. SC 렌더링 결과물
> 2. optimized for streaming
> 3. special data format
> 4. compact binary representation

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## RSC Payload에 들어있는 4가지 내용은?

### Official Answer
The React Server Component Payload contains:

1. The rendered result of Server Components
2. Placeholders for where Client Components should be rendered
3. References to their JavaScript files
4. Any props passed from a Server Component to a Client Component

> #### User Annotation:
> 1. **SC 결과물**: RSC Payload 안에는 SC 결과물이 들어있다.
> 2. **Placeholder**: CC가 어디에 렌더링돼야 하는지에 대한 Placeholder가 들어있다.
> 3. **Reference**: CC의 JavaScript 파일에 대한 참조가 들어있다.
> 4. **Props**: SC에서 CC로 전달한 Props가 RSC Payload 안에 들어있다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## 렌더링 작업은 왜 chunk로 split되는가?

### Official Answer
The rendering work is split into chunks: by individual routes segments and Suspense boundaries.

Each chunk is rendered in two steps:

1. React renders Server Components into the React Server Component Payload.
2. Next.js uses the RSC Payload and Client Component JavaScript instructions to render HTML on the server.

This means we don't have to wait for everything to render before caching the work or sending a response.
Instead, we can stream a response as work is completed.

> #### User Annotation:
> 1. route segment마다 1개의 chunk
> 2. Suspense Boundary마다 1개의 chunk로 분리된다.
>
> "route segment마다 여러 개의 chunk로 split된다"는 해석은 잘못된 해석이다.
>
> Pages Router는 페이지 단위로 자동 코드 스플리팅을 지원했지만, App Router는 Suspense Boundary 단위로도 코드 스플리팅을 지원한다고 이해하면 된다 (오피셜은 아님).

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#1-react-rendering-on-the-server

---

## 왜 HTML로 바로 만들지 않고 RSC Payload를 거치는가?

### Official Answer
This means we don't have to wait for everything to render before caching the work or sending a response.
Instead, we can stream a response as work is completed.

> #### User Annotation:
> RSC Payload 형태여야만 Streaming이 가능하다.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching#1-react-rendering-on-the-server

---

## Full Page Load에서 RSC Payload는 어떻게 사용되는가?

### Official Answer
To optimize the initial page load, Next.js will use React's APIs to render a static HTML preview on the server for both Client and Server Components.
This means, when the user first visits your application, they will see the content of the page immediately, without having to wait for the client to download, parse, and execute the Client Component JavaScript bundle.

On the server:

1. React renders Server Components into a special data format called the React Server Component Payload (RSC Payload), which includes references to Client Components.
2. Next.js uses the RSC Payload and Client Component JavaScript instructions to render HTML for the route on the server.

Then, on the client:

1. The HTML is used to immediately show a fast non-interactive initial preview of the route.
2. The React Server Components Payload is used to reconcile the Client and Server Component trees, and update the DOM.
3. The JavaScript instructions are used to hydrate Client Components and make their UI interactive.

> #### User Annotation:
> 같은 절차를 Client Component 관점에서 정리한 내용이 [client-component.md](./client-component.md)의 "Full Page Load" Q&A에도 있다.
>
> RSC Payload는 reconcile에 사용된다:
> 1. 현재 화면(Client)과
> 2. SC 렌더링 결과물 두 개를 서로 비교해서 달라진 부분만 바꾼다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/client-components#full-page-load

---

## Subsequent Navigation에서 RSC Payload는 어떻게 사용되는가?

### Official Answer
On subsequent navigations, Client Components are rendered entirely on the client.
This means the Client Component JavaScript bundle is downloaded and parsed.
Once the bundle is ready, React will use the RSC Payload to reconcile the Client and Server Component trees, and update the DOM.

> #### Official Annotation (Client Router Cache):
> Next.js has an in-memory client-side router cache that stores the RSC payload of route segments, split by layouts, loading states, and pages.

> #### User Annotation:
> layout, loading state, page 세 개를 하나의 RSC Payload에 저장한다는 의미가 아니라 각각 따로 저장한다는 의미다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/client-components#subsequent-navigations

---

## RSC Payload가 가져온 변화는?

### Official Answer
In most websites, routes are not fully static or fully dynamic - it's a spectrum.
For example, you can have an e-commerce page that uses cached product data that's revalidated at an interval, but also has uncached, personalized customer data.

In Next.js, you can have dynamically rendered routes that have both cached and uncached data.
This is because the RSC Payload and data are cached separately.
This allows you to opt into dynamic rendering without worrying about the performance impact of fetching all the data at request time.

> #### User Annotation:
> Pages Router 시절에는 페이지에 UI와 Data가 합쳐진 상태였다 — 따로 따로 캐싱이 되지 않았다.
> 다른 페이지에 갔다 돌아오면 `getServerSideProps()` 실행부터 UI 그리기까지 전부 다 처음부터 새로 해야 했다.
>
> App Router에서는 UI(RSC Payload) 따로, Data Cache도 API별로 따로 따로 캐싱이 가능하다.
> 그래서 UI는 그대로 쓰면서 데이터만 최신화하는 식의 운영이 가능해진다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache
- https://nextjs.org/docs/app/building-your-application/caching#data-cache
