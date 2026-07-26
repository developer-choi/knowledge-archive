---
tags: [react, nextjs, principle]
source: official
publishable: false
priority: 2
---

# Questions
- Next.js는 서버에서 렌더링 작업을 어떤 단위로 쪼개는가?
- Server Component에서 렌더링된 결과물은 서버에서 브라우저에게 HTML 형태로 전달되는가?
  - RSC Payload에는 무엇이 들어 있는가?
  - 왜 HTML로 바로 만들지 않고 RSC Payload를 거치는가?
  - RSC Payload와 데이터가 따로 캐시되면 무엇이 가능해지는가?
- 첫 로드에서 HTML·RSC Payload·JavaScript는 각각 어디에 쓰이는가?
  - [Hydration이란 무엇인가? → `hydration.md`](../hydration.md)
- 첫 로드 이후의 화면 이동은 무엇이 달라지는가?
- RSC가 재렌더링될 때 client state가 유지되는 이유는?

---

# Answers

## Next.js는 서버에서 렌더링 작업을 어떤 단위로 쪼개는가?

### Official Answer
On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks, by individual route segments (layouts and pages):

- Server Components are rendered into a special data format called the React Server Component Payload (RSC Payload).
- Client Components and the RSC Payload are used to prerender HTML.

### User Answer
1. route segment마다 1개의 chunk

2. Suspense Boundary마다 1개의 chunk로 분리된다.

"route segment마다 여러 개의 chunk로 split된다"는 해석은 잘못된 해석이다.

Pages Router는 페이지 단위로 자동 코드 스플리팅을 지원했지만, App Router는 Suspense Boundary 단위로도 코드 스플리팅을 지원한다고 이해하면 된다 (오피셜은 아님).

### Additional Answer
Suspense 경계를 기준으로 쪼개는 쪽은 별도 문서가 담당한다 — [../streaming/overview.md](../streaming/overview.md)의 「서버는 HTML을 어떤 기준으로 조각내는가?」 참고. 위 공식 답변이 말하는 route segment는 **서버가 렌더링 작업을 나누는 단위**이고, 그쪽이 말하는 Suspense 경계는 **완성된 HTML을 흘려보내는 단위**다. 두 서술은 층이 달라 서로 배타적이지 않다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## Server Component에서 렌더링된 결과물은 서버에서 브라우저에게 HTML 형태로 전달되는가?

### Official Answer
The RSC Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM.

### User Answer
RSC Payload는 UI를 그리는 데 필요하며 다음 4가지 속성을 가진다:

1. SC 렌더링 결과물

2. optimized for streaming

3. special data format

4. compact binary representation

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## RSC Payload에는 무엇이 들어 있는가?

### Official Answer
The RSC Payload contains:

- The rendered result of Server Components
- Placeholders for where Client Components should be rendered and references to their JavaScript files
- Any props passed from a Server Component to a Client Component

### User Answer
1. **SC 결과물**: RSC Payload 안에는 SC 결과물이 들어있다.

2. **Placeholder**: CC가 어디에 렌더링돼야 하는지에 대한 Placeholder가 들어있다.

3. **Reference**: CC의 JavaScript 파일에 대한 참조가 들어있다.

4. **Props**: SC에서 CC로 전달한 Props가 RSC Payload 안에 들어있다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## 왜 HTML로 바로 만들지 않고 RSC Payload를 거치는가?

### Official Answer
This means we don't have to wait for everything to render before caching the work or sending a response.
Instead, we can stream a response as work is completed.

### User Answer
RSC Payload 형태여야만 Streaming이 가능하다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#1-react-rendering-on-the-server

---

## RSC Payload와 데이터가 따로 캐시되면 무엇이 가능해지는가?

### Official Answer
In most websites, routes are not fully static or fully dynamic - it's a spectrum.
For example, you can have an e-commerce page that uses cached product data that's revalidated at an interval, but also has uncached, personalized customer data.

In Next.js, you can have dynamically rendered routes that have both cached and uncached data.
This is because the RSC Payload and data are cached separately.
This allows you to opt into dynamic rendering without worrying about the performance impact of fetching all the data at request time.

### Review Note
- 백로그의 v14 caching 문서에서 옮겨왔다. 「라우트가 fully static이 되려면…」([../../caching/legacy-overview.md](../../caching/legacy-overview.md))이 "섞을 수 있다"는 사실을, 이 질문이 "왜 가능한가"를 맡는다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache
- https://nextjs.org/docs/app/building-your-application/caching#data-cache

---

## 첫 로드에서 HTML·RSC Payload·JavaScript는 각각 어디에 쓰이는가?

### Official Answer
Then, on the client:

1. **HTML** is used to immediately show a fast non-interactive preview of the route to the user.
2. **RSC Payload** is used to reconcile the Client and Server Component trees.
3. **JavaScript** is used to hydrate Client Components and make the application interactive.

### User Answer
RSC Payload는 reconcile에 사용된다:

1. 현재 화면(Client)과

2. SC 렌더링 결과물 두 개를 서로 비교해서 달라진 부분만 바꾼다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## 첫 로드 이후의 화면 이동은 무엇이 달라지는가?

### Official Answer
On subsequent navigations:

- The **RSC Payload** is prefetched and cached for instant navigation.
- **Client Components** are rendered entirely on the client, without the server-rendered HTML.

### User Answer
증명: https://github.com/developer-choi/test-playground/commit/12b964918dfd3c652504a8df1a50f7548d0e9658

첫 페이지 접근 시에는 CC가 Server에서도 실행됨 (초기 HTML을 만들어야 하니까).

이후 링크를 통해 페이지 이동 시에는 Server를 거치지 않고 Client에서만 렌더링된다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## RSC가 재렌더링될 때 client state가 유지되는 이유는?

### Official Answer
RSCs individually fetch data and render entirely on the server, and the resulting HTML is streamed into the client-side React component tree, interleaving with other Server and Client Components as necessary.

This process eliminates the need for client-side re-rendering, thereby improving performance.
For any Client Components, hydration can happen concurrently with RSCs streaming in, since the compute load is shared between client and server.

Put another way, the server, far more powerful and physically closer to your data sources, deals with compute-intensive rendering and ships to the client just the interactive pieces of code.

When an RSC needs to be re-rendered, due to state change, it refreshes on the server and seamlessly merges into the existing DOM without a hard refresh.
As a result, the client state is preserved even as parts of the view are updated from the server.

### User Answer
"When an RSC needs to be re-rendered"는 아마 Server Action을 가리키는 것으로 보인다.

무엇이 그 재렌더링을 일으키는지와 그때 클라이언트 상태가 어떻게 되는지는 [../../caching/legacy-router-refresh.md](../../caching/legacy-router-refresh.md)의 「`router.refresh()` 실행 후 클라이언트 상태(useState, scroll)는 어떻게 되는가?」 참고.

### Reference
- https://vercel.com/blog/understanding-react-server-components
