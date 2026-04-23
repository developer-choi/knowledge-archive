---
tags: [nextjs, best-practice]
---

# Questions
- App Router에서 데이터 페칭 시 Server Side와 Client Side 중 무엇을 우선해야 하는가?
- SSR과 Streaming은 어떻게 다르며 언제 Streaming을 써야 하는가?
- Next.js의 preload 패턴이란 무엇이며 어떻게 쓰는가?
- React Query를 Server Component와 함께 쓸 때 주의사항은?
- Server Component와 Client Component가 동일 데이터를 가질 때 어느 쪽이 더 최신인가?
- React Query는 App Router 환경에서 언제 쓰는가?
- layout.tsx / default.tsx에서 쿼리스트링 변경에 반응하려면 어떻게 해야 하는가?

---

# Answers

## App Router에서 데이터 페칭 시 Server Side와 Client Side 중 무엇을 우선해야 하는가?

### Official Answer
Fetch data and render in the same environment.
This reduces both the back-and-forth communication between client and server, as well as the work on the main thread on the client.

> #### Key Terms:
> - **main thread**: 브라우저에서 JS 실행·렌더링을 담당하는 단일 스레드. 여기 부하가 커지면 UI가 느려진다

> #### Official Annotation:
> It's hard to give general advice on when it makes sense to pair React Query with Server Components and not.
> If you are just starting out with a new Server Components app, we suggest you start out with any tools for data fetching your framework provides you with and avoid bringing in React Query until you actually need it.

> #### User Annotation:
> Best = 가능한 FULL SSR 하면 이득이 있긴 함 (프레임워크 오피셜).
> Worst = FULL CSR 하면 손해가 있긴 함.
>
> Next.js 공식문서에서, 특별한 이유를 찾기 전까지는 Server Side 패칭을 우선으로 검토하라 했을 정도.
> RQ 공식문서에서도, 특별한 이유 없으면 RQ 쓰지 말라 그랬음.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#data-ownership-and-revalidation
- https://vercel.com/blog/how-react-18-improves-application-performance
- https://github.com/reactwg/react-18/discussions/37

---

## SSR과 Streaming은 어떻게 다르며 언제 Streaming을 써야 하는가?

### User Answer
SSR보다는 Streaming이 상위 호환이다.
단순 await을 쓰면 안 된다.
대량으로 await을 남발했더니 TTFB가 길었음.

즉, 페이지 전체가 서버에서 준비될 때까지 기다리게 만들지 말고, Suspense로 경계를 나눠서 먼저 준비되는 부분부터 점진적으로 내려보내야 한다.

> #### User Annotation:
> 참고: https://github.com/developer-choi/test-playground/commit/c4bcc1b20bdf900e65952d35d5bf8e51f702977f

---

## Next.js의 preload 패턴이란 무엇이며 어떻게 쓰는가?

### Official Answer
As a pattern, we suggest optionally exposing a preload() export in utilities or components that do data fetching.

By calling preload, you can eagerly start fetching data you're likely going to need.

The preload() function can have any name. It's a pattern, not an API.

This pattern is completely optional and something you can use to optimize on a case-by-case basis.
This pattern is a further optimization on top of parallel data fetching.
Now you don't have to pass promises down as props and can instead rely on the preload pattern.

You can combine the cache function, the preload pattern, and the server-only package to create a data fetching utility that can be used throughout your app.

With this approach, you can eagerly fetch data, cache responses, and guarantee that this data fetching only happens on the server.
The getUser.ts exports can be used by layouts, pages, or components to give them control over when a user's data is fetched.

> #### Key Terms:
> - **eagerly**: 실제로 필요해지기 전에 미리(적극적으로) 시작한다는 의미
> - **parallel data fetching**: 여러 데이터 요청을 동시에 시작해 총 대기 시간을 줄이는 패턴
> - **server-only**: 해당 모듈이 클라이언트 번들로 새지 않도록 보장하는 Next.js 패키지

### Reference
- https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns#preloading-data

---

## React Query를 Server Component와 함께 쓸 때 주의사항은?

### Official Answer
We are now rendering data from the getPosts query both in a Server Component and in a Client Component.
This will be fine for the initial page render, but what happens when the query revalidates on the client for some reason when staleTime has been passed?

**React Query has no idea of how to revalidate the Server Component**, so if it refetches the data on the client, causing React to rerender the list of posts, the Nr of posts: {posts.length} will end up out of sync.

From the React Query perspective, treat Server Components as a place to prefetch data, nothing more.

Of course, it's fine to have Server Components own some data, and Client Components own other, just make sure those two realities don't get out of sync.

Good rule of thumb:
1. If you do use it, a good rule of thumb is to avoid queryClient.fetchQuery unless you need to catch errors.
2. If you do use it, **don't render its result on the server** or **pass the result to another component, even a Client Component one.**

> #### Key Terms:
> - **revalidate**: 캐시된 데이터를 다시 가져와 최신 상태로 만드는 것
> - **staleTime**: 데이터가 "신선하다"고 간주되는 시간. 이 시간이 지나면 refetch 후보가 됨
> - **out of sync**: 서버와 클라이언트에 서로 다른 데이터가 남아 불일치하는 상태

> #### User Annotation:
> 정리하자면,
> 1. fetchQuery의 결과를 다른 컴포넌트에 전달하지 않는다.
> 2. SC에서는 prefetch만 하는 식으로 호출하는 것만 한다.
> 3. 만약 SC에서 fetchQuery를 해야 한다면 그건 오직 에러 잡아서 처리하는 용도로만 쓴다.

### Reference
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#data-ownership-and-revalidation

---

## Server Component와 Client Component가 동일 데이터를 가질 때 어느 쪽이 더 최신인가?

### Official Answer
If the queries included in dehydration already exist in the queryCache, hydrate does not overwrite them and they will be silently discarded.

> #### Key Terms:
> - **dehydration**: 서버에서 준비한 쿼리 캐시를 직렬화해 클라이언트로 넘기는 과정
> - **hydrate**: 클라이언트에서 그 직렬화된 데이터를 받아 queryCache에 주입하는 과정
> - **queryCache**: React Query가 관리하는 클라이언트 측 캐시 저장소

> #### User Annotation:
> 이미 CC에 데이터가 있으면 SC가 다시 실행되더라도 데이터가 덮어씌워지지 않는다.
> 즉, 라이브러리 제작자 생각은 CC가 더 최신일 거라고 판단한 것이고, 이게 납득은 간다.
>
> 내가 구현했던 케이스는 다른 페이지 갔다가 돌아온 케이스(리스트 → 상세 → 돌아오기)밖에 없어서 무조건 Server Side Cache가 Client Side Cache보다 최신이지만,
> 다른 상황(Server Component가 최신화되는 다른 경우의 수)은 내가 모르니까.
> (revalidateTag도 SC 리렌더링을 유발함)
>
> 참고: https://github.com/developer-choi/react-playground/commit/be17e3ffe71bb4f0e62bf1c5319278fa3cb9f674

### Reference
- https://tanstack.com/query/v4/docs/framework/react/reference/hydration#limitations-1

---

## React Query는 App Router 환경에서 언제 쓰는가?

### User Answer
App Router + RQ 조합에서 RQ가 진짜 필요한 경우는 실제로 많지 않다.
핵심 쓰임새는 다음과 같다.

1. `useInfiniteQuery` (Infinite Scroll)
2. 페이지 최신화 (background refetching)
3. 그 외 나머지는 최대한 `fetch()`로 해결

내가 찾은 RQ + SC 예시는, 이 페이지는 RQ를 써야 하는 페이지인데 초기 데이터를 여전히 SC에서 패칭하는 게 CC보다 이득인 페이지가 있었다.
딱 Infinite Scroll 말고는 진짜 RQ 쓸 일이 잘 없다.

---

## layout.tsx / default.tsx에서 쿼리스트링 변경에 반응하려면 어떻게 해야 하는가?

### User Answer
layout.tsx와 default.tsx는 둘 다 URL에 쿼리스트링이 바뀌어도 리렌더링이 발생하지 않는다 (원래 스펙).

예를 들어 좌측은 리스트 UI로 고정하고 우측만 바뀌는 디자인에서,
- Parallel Routes로 구현하고 좌측을 default.tsx로 만들어 Server Side에서 데이터를 패칭했었다.
- 그런데 필터 기능(쿼리스트링 변경)을 구현할 수가 없었다.

그래서 default.tsx에서 데이터 패칭을 Client Side에서 하는 걸로 바꾸고 RQ를 썼다.
쿼리스트링에 반응해야 하는 리스트는 default.tsx/layout.tsx에서 SC 패칭이 아니라 CC + RQ로 가야 한다.
