---
tags: [react, nextjs, principle]
---

# Questions
- Server Component의 장점은?
  - JS 번들 크기 감소가 어떻게 일어나는가?
  - 초기 페이지 로딩 속도가 어떻게 더 빨라지는가?
  - 네트워크 비용은 어떻게 절감되는가?
  - Caching은 어떻게 활용되는가?
  - 백엔드 데이터 직접 접근과 보안 측면의 이점은?
- Server Component의 기본 특성과 Next.js App Router 기본값은?
- Next.js의 server-first 접근이란 무엇인가?
- Server Component의 3가지 렌더링 전략은?
- `"use server"`는 Server Component를 선언하는 지시어인가?
- `server-only` 패키지는 왜 필요한가?
- 비-`NEXT_PUBLIC_` 환경 변수는 client code에서 어떻게 되는가?
- RSC는 Client Component를 대체하는가?
- RSC가 재렌더링될 때 client state가 유지되는 이유는?

---

# Answers

## Server Component의 장점은?

### User Answer
SC가 제공하는 장점은 다음과 같다 (각 항목은 follow-up Q에서 Official 원문으로 다룬다):

- JS 번들 크기 감소 = Hydration 비용도 함께 감소
- 초기 페이지 로딩 속도 개선
- 네트워크 비용 절감 (single round-trip data fetching)
- Caching
- 백엔드 데이터 직접 접근
- 보안 (민감 정보를 서버에 보존)

> #### User Annotation:
> CC 위주로 쓰게 되면 위 장점을 모두 누릴 수 없게 된다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components
- https://vercel.com/blog/understanding-react-server-components

---

## JS 번들 크기 감소가 어떻게 일어나는가?

### Official Answer
Server Components are excluded from your JavaScript bundle.

For example, large dependencies that previously would impact the JavaScript bundle size on the client can instead remain entirely on the server, leading to improved performance.

With Server Components, the initial page load is faster, and the client-side JavaScript bundle size is reduced.

If you start with an app composed entirely of Client Components, moving non-interactive pieces of your UI to Server Components can reduce the amount of client-side JavaScript needed.
This is beneficial for users with slower internet.

> #### User Annotation:
> JS 번들 크기가 감소하면 Hydration 비용도 함께 줄어든다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## 초기 페이지 로딩 속도가 어떻게 더 빨라지는가?

### Official Answer
On the server, we can generate HTML to allow users to view the page immediately, without waiting for the client to download, parse and execute the JavaScript needed to render the page.

Data for the entire page must be fetched from the server before any components can be shown.
The only way around this is to fetch data client-side in a `useEffect()` hook, which has a longer roundtrip than server-side fetches and happens only after the component is rendered and hydrated.

> #### User Annotation:
> Client에서 데이터 패칭하는 JS 코드를 다운받아서 API를 호출하는 것보다, 그것을 Server Component로 옮기면 더 빠른 시점에 API가 호출될 수 있다.

### Reference
- https://vercel.com/blog/understanding-react-server-components#what-did-server-side-rendering-and-react-suspense-solve

---

## 네트워크 비용은 어떻게 절감되는가?

### Official Answer
1. Perform multiple data fetches with single round-trip instead of multiple individual requests on the client.
2. Depending on your region, data fetching can also happen closer to your data source, reducing latency and improving performance.

> #### User Annotation:
> 기존: Client에서 따로 따로 호출
> - Client → API Server (요청 1)
> - Client → API Server (요청 2)
> - Client → API Server (요청 3)
>
> SC 도입 후: 한번만 호출
> - Client → Front Server → API Server (한 번의 round-trip)
>
> 그리고 서버에서 다른 서버로 요청할 때에는 물리적인 거리도 더 가깝다 (프론트 서버에서 API 서버가 더 가깝다).

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## Caching은 어떻게 활용되는가?

### Official Answer
By rendering on the server, the result can be cached and reused on subsequent requests and across users.
This can improve performance and reduce cost by reducing the amount of rendering and data fetching done on each request.

### Reference
- https://nextjs.org/docs/app/building-your-application/caching

---

## 백엔드 데이터 직접 접근과 보안 측면의 이점은?

### Official Answer
Have direct access to backend data resources (e.g. databases).

Keep your application more secure by preventing sensitive information,

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## Server Component의 기본 특성과 Next.js App Router 기본값은?

### Official Answer
React Server Components allow you to write UI that can be rendered and optionally cached on the server.

To make the transition to Server Components easier, all components inside the App Router are Server Components by default, including special files and colocated components.

This allows you to automatically adopt them with no extra work, and achieve great performance out of the box.

> #### Official Annotation:
> Server Components are not interactive and therefore do not read from React state.
>
> Server and Client Components can be combined in the same component tree.
> All components are part of the Server Component unless defined or imported in a module that starts with the `"use client"` directive.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## Next.js의 server-first 접근이란 무엇인가?

### Official Answer
We recommend using Server Components until you have a use case for a Client Component.

For example, you may have a Layout that has static elements (e.g. logo, links, etc) and an interactive search bar that uses state.

If we were to split the page into smaller components, you'll notice that the majority of components are non-interactive and can be rendered on the server as Server Components.

Instead of making the whole layout a Client Component, move the interactive logic to a Client Component (e.g. `<SearchBar />`) and keep your layout as a Server Component.

This means you don't have to send all the component Javascript of the layout to the client.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## Server Component의 3가지 렌더링 전략은?

### Official Answer
The rendering work is further split by route segments to enable streaming and partial rendering, and there are three different server rendering strategies:

- Static Rendering
- Dynamic Rendering
- Streaming

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#streaming

---

## `"use server"`는 Server Component를 선언하는 지시어인가?

### Official Answer
A common misunderstanding is that Server Components are denoted by `"use server"`, but there is no directive for Server Components.
The `"use server"` directive is used for Server Functions.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## `server-only` 패키지는 왜 필요한가?

### Official Answer
At first glance, it appears that `getData` works on both the server and the client.
But because the environment variable `API_KEY` is not prefixed with `NEXT_PUBLIC`, it's a private variable that can only be accessed on the server.
Next.js replaces private environment variables with the empty string in client code to prevent leaking secure information.

> #### User Annotation:
> 그래서 저 코드는 Client Side에서 동작하지 않는다.
> 의도하지 않은 동작이 없도록 하기 위해 `server-only` 패키지가 있다.
> 빌드 타임에서 에러를 내준다고 한다.
>
> 증명: https://github.com/developer-choi/test-playground/commit/45967fd3b8ca1244699da5839f60a901c8621889
>
> 잘 모르는 사람이 "어 왜 빈 문자열이야!" 하는 경우가 있을 수 있으니 경고가 나오는 게 합리적이다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## 비-`NEXT_PUBLIC_` 환경 변수는 client code에서 어떻게 되는가?

### Official Answer
Because the environment variable is not prefixed with `NEXT_PUBLIC`, it's a private variable that can only be accessed on the server.
Next.js replaces private environment variables with the empty string in client code to prevent leaking secure information.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## RSC는 Client Component를 대체하는가?

### Official Answer
Consider leveraging RSCs for server-side rendering and data fetching, while relying on Client Components for locally interactive features and user experiences.

RSCs do not support continuous updates, such as through WebSockets.
In these cases, a client-side fetching or polling approach would be necessary.

### Reference
- https://vercel.com/blog/understanding-react-server-components

---

## RSC가 재렌더링될 때 client state가 유지되는 이유는?

### Official Answer
RSCs individually fetch data and render entirely on the server, and the resulting HTML is streamed into the client-side React component tree, interleaving with other Server and Client Components as necessary.

This process eliminates the need for client-side re-rendering, thereby improving performance.
For any Client Components, hydration can happen concurrently with RSCs streaming in, since the compute load is shared between client and server.

Put another way, the server, far more powerful and physically closer to your data sources, deals with compute-intensive rendering and ships to the client just the interactive pieces of code.

When an RSC needs to be re-rendered, due to state change, it refreshes on the server and seamlessly merges into the existing DOM without a hard refresh.
As a result, the client state is preserved even as parts of the view are updated from the server.

> #### User Annotation:
> "When an RSC needs to be re-rendered"는 아마 Server Action을 가리키는 것으로 보인다.

### Reference
- https://vercel.com/blog/understanding-react-server-components
