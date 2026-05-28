# App Router에서 데이터 페칭 시 Server Side와 Client Side 중 무엇을 우선해야 하는가?

## 도입

App Router 환경에서 데이터 페칭의 기본 원칙은 "데이터를 렌더링하는 환경과 같은 환경에서 가져와라"다. 클라이언트가 아닌 서버에서 데이터를 가져오면 클라이언트-서버 왕복(round-trip)이 줄고, 브라우저 메인 스레드의 부담도 낮아진다.

---

## 본문

> Fetch data and render in the same environment. This reduces both the back-and-forth communication between client and server, as well as the work on the main thread on the client.

"데이터를 가져오고 같은 환경에서 렌더링하라. 이는 클라이언트와 서버 간 왕복 통신을 줄이고 클라이언트 메인 스레드의 작업도 줄인다."

- **main thread**: 브라우저에서 JS 실행과 레이아웃·렌더링을 담당하는 단일 스레드. `fetch()`를 클라이언트에서 호출하면 여기서 실행되어 부하가 생긴다. Server Component에서 가져오면 메인 스레드와 무관하다.

Next.js 공식문서는 특별한 이유를 찾기 전까지 Server Side 패칭을 우선으로 검토하도록 권장한다. React Query 공식문서도 같은 맥락에서, 특별한 이유 없이 RQ를 도입하지 말라고 한다.

> It's hard to give general advice on when it makes sense to pair React Query with Server Components and not. If you are just starting out with a new Server Components app, we suggest you start out with any tools for data fetching your framework provides you with and avoid bringing in React Query until you actually need it.

"React Query와 Server Component를 언제 조합하는 게 좋은지 일반적인 조언을 내리기는 어렵다. 새 Server Components 앱을 시작하는 경우라면, 프레임워크가 제공하는 데이터 페칭 도구로 시작하고 실제로 필요해질 때까지 React Query 도입을 피하도록 제안한다."

---

## 종합

Server Side 패칭의 이점은 분명하다. 데이터를 서버에서 한 번 가져오면 Data Cache에 보관되고, 이후 같은 데이터를 원하는 사용자는 외부 API를 다시 호출하지 않아도 된다. 전 세계 천만 명이 같은 상품 목록을 보는 서비스에서, 서버 사이드 Data Cache 한 번의 히트가 천만 번의 클라이언트 API 호출을 대체한다. 반면 클라이언트 측 캐시(React Query 등)는 브라우저별로 저장되어 이 이점이 없다.

---

---

# [UNVERIFIED] SSR과 Streaming은 어떻게 다르며 언제 Streaming을 써야 하는가?

## 도입

App Router에서 서버 렌더링 방식은 크게 두 가지다. 전통적인 SSR은 페이지 전체가 서버에서 준비될 때까지 기다렸다가 한 번에 HTML을 내려보낸다. Streaming은 준비되는 부분부터 점진적으로 내려보낸다. 단순히 `await`을 남발하면 SSR 방식이 되어 TTFB(Time To First Byte)가 길어질 수 있다.

---

## 본문

**SSR (전통적 방식)**

서버에서 `await`으로 데이터를 기다리면, 그 데이터가 도착할 때까지 페이지 전체의 렌더링이 멈춘다. 페이지 안에 느린 데이터 요청이 하나라도 있으면 그 요청이 끝날 때까지 사용자는 아무것도 받지 못한다.

```
SSR 방식 (await 남발)
─────────────────────────────────────────────
서버             클라이언트
│
│  await A (200ms)
│  await B (300ms)   ← 전체 완료 전까지
│  await C (100ms)      브라우저는 빈 화면
│
│──────────────────────→ HTML 전송 (600ms 후)
```

**Streaming (Suspense 기반)**

App Router는 React의 `<Suspense>` 경계를 기준으로 준비된 부분을 먼저 스트리밍한다. 빠른 콘텐츠는 즉시 브라우저에 도착하고, 느린 콘텐츠는 준비되는 대로 추가로 흘러들어온다.

```
Streaming 방식 (Suspense 경계)
─────────────────────────────────────────────
서버             클라이언트

│──→ 레이아웃 + fallback UI ──→  즉시 렌더링 (0ms)

│  await A (200ms)
│──────────────────→  A 콘텐츠 추가 (200ms)

│  await B (300ms)
│──────────────────────────→  B 콘텐츠 추가 (300ms)
```

Streaming을 사용하려면 느린 데이터를 기다리는 컴포넌트를 `<Suspense>`로 감싸고 `fallback`을 지정하면 된다. App Router에서는 `loading.tsx` 파일이 그 경계를 자동으로 만들어준다.

---

## 종합

Streaming은 SSR의 상위 호환이다. SSR과 동일하게 서버에서 렌더링하지만, 한 번에 다 보내는 대신 준비된 것부터 흘려보낸다. `await`을 페이지 최상위에서 남발하면 모든 데이터가 도착할 때까지 TTFB가 길어진다. Suspense 경계를 나눠서 각 데이터 요청이 독립적으로 스트리밍되게 하면, 페이지의 빠른 부분은 즉시 사용자에게 도달하고 느린 부분은 뒤따라온다. 결과적으로 사용자가 첫 콘텐츠를 보는 시간이 크게 단축된다.

---

---

# Next.js의 preload 패턴이란 무엇이며 어떻게 쓰는가?

## 도입

preload 패턴은 "데이터가 실제로 필요해지기 전에 미리 요청을 시작"하여 대기 시간을 줄이는 최적화 기법이다. Next.js 공식 API가 아닌 권장 패턴으로, 개발자가 직접 `preload` 함수를 만들어 쓴다. parallel data fetching의 추가 최적화 계층이다.

---

## 본문

> As a pattern, we suggest optionally exposing a preload() export in utilities or components that do data fetching.

"패턴으로서, 데이터 페칭을 수행하는 유틸리티나 컴포넌트에서 선택적으로 `preload()` export를 노출하도록 제안한다."

> By calling preload, you can eagerly start fetching data you're likely going to need.

"`preload`를 호출함으로써 필요할 것 같은 데이터를 적극적으로 먼저 가져오기 시작할 수 있다."

- **eagerly**: 게으르게(lazy) 필요할 때 요청하는 대신, 미리(적극적으로) 요청을 시작한다는 의미. 부모 컴포넌트에서 자식이 필요로 할 데이터를 미리 fetch 시작해두면, 자식이 렌더링될 때 이미 데이터가 도착해있거나 도착에 가까운 상태가 된다.

> The preload() function can have any name. It's a pattern, not an API.

"`preload()` 함수는 어떤 이름도 가질 수 있다. API가 아니라 패턴이다."

> This pattern is completely optional and something you can use to optimize on a case-by-case basis. This pattern is a further optimization on top of parallel data fetching.

"이 패턴은 완전히 선택적이며 케이스별로 최적화에 사용할 수 있다. 이 패턴은 parallel data fetching의 추가 최적화다."

> You can combine the cache function, the preload pattern, and the server-only package to create a data fetching utility that can be used throughout your app. With this approach, you can eagerly fetch data, cache responses, and guarantee that this data fetching only happens on the server.

"`cache` 함수, preload 패턴, `server-only` 패키지를 조합하여 앱 전체에서 사용할 수 있는 데이터 페칭 유틸리티를 만들 수 있다. 이 방식으로 데이터를 미리 가져오고, 응답을 캐시하며, 이 데이터 페칭이 오직 서버에서만 일어남을 보장할 수 있다."

- **parallel data fetching**: 여러 데이터 요청을 `Promise.all` 등으로 동시에 시작해 총 대기 시간을 줄이는 패턴.
- **server-only**: 해당 모듈이 클라이언트 번들에 포함되지 않도록 컴파일 타임에 오류를 발생시키는 Next.js 패키지. 데이터 페칭 로직이 클라이언트로 새는 것을 방지한다.

---

## 종합

preload 패턴이 없으면 데이터는 해당 컴포넌트가 렌더링을 시작할 때야 비로소 요청된다. 부모가 자식 렌더링을 시작하기 전에 `preload()`를 호출해두면 자식의 데이터 요청이 부모의 렌더링과 동시에 시작된다. 이는 waterfall(순차적 대기) 없이 데이터를 먼저 준비해두는 전략으로, 특히 깊은 컴포넌트 트리에서 효과적이다.

---

---

# React Query를 Server Component와 함께 쓸 때 주의사항은?

## 도입

Server Component에서 React Query로 prefetch한 데이터를 Client Component에서 다시 사용할 때, 두 데이터가 서로 다른 생명주기를 가진다. React Query는 Server Component를 어떻게 재검증해야 하는지 알지 못하므로, 두 컴포넌트가 같은 쿼리 데이터를 "소유"하면 동기화가 깨질 수 있다.

---

## 본문

> We are now rendering data from the getPosts query both in a Server Component and in a Client Component. This will be fine for the initial page render, but what happens when the query revalidates on the client for some reason when staleTime has been passed?
>
> **React Query has no idea of how to revalidate the Server Component**, so if it refetches the data on the client, causing React to rerender the list of posts, the Nr of posts: {posts.length} will end up out of sync.

"getPosts 쿼리의 데이터를 Server Component와 Client Component 모두에서 렌더링하고 있다. 초기 페이지 렌더링에는 괜찮지만, staleTime이 지나 어떤 이유로 클라이언트에서 쿼리가 revalidate되면 어떻게 되는가? **React Query는 Server Component를 어떻게 revalidate해야 하는지 알지 못한다.** 따라서 클라이언트에서 데이터를 다시 가져와 React가 게시물 목록을 리렌더링하면, Nr of posts: {posts.length}가 동기화에서 벗어나게 된다."

- **revalidate**: 캐시된 데이터를 다시 가져와 최신 상태로 만드는 것. React Query는 `staleTime`이 지나면 포커스 재획득, 인터벌 등 다양한 조건에서 자동으로 revalidate한다.
- **staleTime**: 데이터가 "신선하다"고 간주되는 시간. 지나면 refetch 후보가 된다.
- **out of sync**: Server Component의 데이터(서버에서 렌더링된 값)와 Client Component의 React Query 데이터(클라이언트에서 새로 받은 값)가 달라지는 상태.

> From the React Query perspective, treat Server Components as a place to prefetch data, nothing more.

"React Query 관점에서, Server Component를 데이터를 prefetch하는 곳으로만 취급하고, 그 이상은 아니다."

> Good rule of thumb:
> 1. If you do use it, a good rule of thumb is to avoid queryClient.fetchQuery unless you need to catch errors.
> 2. If you do use it, **don't render its result on the server** or **pass the result to another component, even a Client Component one.**

"실용적인 규칙: 1. 사용한다면 에러를 잡아야 하는 경우가 아니면 `queryClient.fetchQuery` 사용을 피한다. 2. 사용한다면 결과를 서버에서 렌더링하거나 Client Component를 포함한 다른 컴포넌트에 결과를 전달하지 않는다."

---

## 종합

정리하면 세 가지 규칙이다. SC에서는 `prefetchQuery`만 호출하고(데이터를 queryCache에 채우는 용도), `fetchQuery` 결과를 렌더링하거나 다른 컴포넌트에 전달하지 않는다. `fetchQuery`는 오직 에러 처리가 꼭 필요할 때만 쓴다. 이 규칙을 따르면 서버와 클라이언트의 데이터가 서로 충돌할 여지가 없어진다.

---

---

# Server Component와 Client Component가 동일 데이터를 가질 때 어느 쪽이 더 최신인가?

## 도입

React Query의 dehydrate/hydrate 메커니즘에서, 서버에서 준비한 쿼리 캐시를 클라이언트로 전달할 때 클라이언트에 이미 같은 쿼리 데이터가 있으면 서버의 데이터는 무시된다. 라이브러리 제작자는 클라이언트 데이터가 더 최신일 것으로 판단한 것이다.

---

## 본문

> If the queries included in dehydration already exist in the queryCache, hydrate does not overwrite them and they will be silently discarded.

"dehydration에 포함된 쿼리가 이미 queryCache에 존재하면, hydrate는 덮어쓰지 않고 조용히 버린다."

- **dehydration**: 서버에서 준비한 React Query 캐시를 JSON으로 직렬화하여 클라이언트로 넘기는 과정. SSR 응답에 포함되어 클라이언트로 전달된다.
- **hydrate**: 클라이언트에서 그 직렬화된 데이터를 받아 queryCache에 주입하는 과정.
- **queryCache**: React Query가 클라이언트에서 관리하는 인메모리 캐시 저장소. 이미 여기 데이터가 있으면 서버에서 온 데이터는 무시된다.

클라이언트에 이미 데이터가 있는 케이스는, 예를 들어 리스트 페이지 → 상세 페이지 → 뒤로가기처럼 사용자가 같은 쿼리 데이터를 이미 클라이언트에 갖고 있는 상황이다. 이때 클라이언트의 데이터가 서버 것보다 더 최신일 가능성이 있다고 라이브러리가 판단한다.

---

## 종합

이 동작은 대부분의 경우 합리적이지만, 주의가 필요한 케이스가 있다. `revalidateTag`로 서버의 SC가 최신화되는 상황에서는 서버 데이터가 더 최신임에도 클라이언트 queryCache가 무시하고 이전 데이터를 유지할 수 있다. 이런 시나리오가 예상되면 `router.refresh()`나 Page 컴포넌트 unmount-remount로 queryCache를 강제 초기화하는 방법을 검토해야 한다.

---

---

# [UNVERIFIED] React Query는 App Router 환경에서 언제 쓰는가?

## 도입

App Router가 서버 사이드 데이터 페칭을 강력하게 지원하면서, React Query의 역할이 좁아졌다. 실제로 App Router + React Query 조합에서 React Query가 꼭 필요한 경우는 생각보다 많지 않다. React Query를 도입하기 전에 먼저 그 필요성을 검토해야 한다.

---

## 본문

App Router 환경에서 React Query가 실제로 필요한 핵심 쓰임새:

**1. `useInfiniteQuery` (무한 스크롤)**

서버 컴포넌트로는 구현하기 어려운 클라이언트 사이드 상태 관리가 필요한 영역이다. 사용자가 스크롤할 때마다 다음 페이지를 요청하고, 이전 데이터를 클라이언트 상태로 누적하는 동작은 React Query의 `useInfiniteQuery`가 가장 자연스럽게 처리한다.

**2. 페이지 최신화 (background refetching)**

탭을 다시 포커스하거나 일정 간격으로 데이터를 자동 갱신해야 하는 경우다. `refetchOnWindowFocus`, `refetchInterval` 같은 React Query의 자동 갱신 기능은 서버 컴포넌트로 대체할 수 없다. 실시간성이 중요한 데이터(주가, 알림, 재고 등)에서 유효하다.

**3. 나머지는 `fetch()`로**

그 외 대부분의 데이터 페칭은 Next.js의 `fetch()`와 서버 컴포넌트로 충분하다. Data Cache와 `revalidate` 옵션을 활용하면 캐싱도 서버에서 처리된다.

```
App Router에서 React Query 도입 판단
──────────────────────────────────────────────────────
무한 스크롤 (useInfiniteQuery)      → RQ 필요
background refetching (폴링 등)     → RQ 필요
일반 데이터 조회                     → fetch() + SC로 충분
```

SC에서 초기 데이터를 prefetch하고 클라이언트에서 React Query로 이어받는 패턴도 있다. 초기 렌더링은 서버에서 처리하고(SEO, TTFB 이득), 이후 인터랙션은 클라이언트 캐시로 다루는 구조다. 단, 이 경우에도 SC와 CC의 데이터가 out of sync되지 않도록 주의한다.

---

## 종합

App Router가 서버 사이드 페칭을 강화하면서 React Query의 사용 범위가 명확해졌다. 클라이언트 사이드에서만 할 수 있는 것 — 무한 스크롤, 자동 갱신, 낙관적 업데이트 — 에 집중해서 쓰고, 나머지는 서버에서 `fetch()`로 처리한다. "RQ를 먼저 쓰고 보자"는 접근 대신 "꼭 RQ가 필요한가?"를 먼저 검토하는 것이 App Router의 철학에 맞다.

---

---

# [UNVERIFIED] layout.tsx / default.tsx에서 쿼리스트링 변경에 반응하려면 어떻게 해야 하는가?

## 도입

App Router의 `layout.tsx`와 `default.tsx`는 URL의 쿼리스트링이 바뀌어도 리렌더링이 발생하지 않는다. 이것은 버그가 아니라 의도된 스펙이다. 이 제약을 만나는 대표적인 시나리오와 우회 방법을 알아야 한다.

---

## 본문

**왜 layout.tsx / default.tsx는 쿼리스트링에 반응하지 않는가?**

`layout.tsx`는 URL 경로(pathname)가 바뀌어도 unmount-remount 없이 유지되도록 설계되었다. 이 덕분에 레이아웃 컴포넌트가 안정적으로 유지되고 깜빡임 없는 내비게이션이 가능하다. 쿼리스트링 변경은 경로 변경보다 더 작은 변화이므로, 레이아웃은 당연히 반응하지 않는다. `default.tsx`도 같은 이유로 리렌더링이 발생하지 않는다.

**문제가 생기는 시나리오**

Parallel Routes를 사용해 좌측 리스트 + 우측 상세 화면 구조를 구현할 때, 좌측을 `default.tsx`로 만들고 서버 사이드에서 데이터를 가져오는 패턴을 쓸 수 있다. 그런데 좌측 리스트에 필터 기능(쿼리스트링으로 전달)을 추가하려 하면 `default.tsx`가 쿼리스트링 변경에 반응하지 않아 필터가 동작하지 않는다.

```
문제 시나리오
──────────────────────────────────────────────────────
layout / default.tsx (Server Component)
  └── 서버에서 데이터 패칭

URL: /list?category=A → /list?category=B
  → layout/default.tsx 리렌더링 없음
  → 서버 데이터 재패칭 없음
  → 필터가 동작하지 않음
```

**해결: Client Component + React Query로 전환**

`default.tsx`에서 데이터 패칭을 서버 사이드에서 하는 대신, 클라이언트 컴포넌트(CC)로 전환하고 React Query를 사용한다. CC는 `useSearchParams()`로 쿼리스트링을 구독할 수 있고, 쿼리스트링이 바뀌면 React Query가 새로운 파라미터로 데이터를 재요청한다.

```
해결 방식
──────────────────────────────────────────────────────
default.tsx (Client Component)
  └── useSearchParams()로 쿼리스트링 읽기
  └── React Query로 데이터 패칭

URL: /list?category=A → /list?category=B
  → useSearchParams() 변경 감지
  → React Query 재요청
  → 리스트 갱신
```

---

## 종합

이 제약은 App Router의 레이아웃 안정성 설계에서 비롯된다. 쿼리스트링에 반응해야 하는 UI는 Server Component에서 데이터를 패칭할 수 없다 — 서버 컴포넌트는 쿼리스트링 변경으로 리렌더링이 트리거되지 않기 때문이다. 결론적으로, `layout.tsx`나 `default.tsx` 안에서 쿼리스트링에 반응하는 데이터가 필요하다면 해당 부분을 Client Component로 전환하고 `useSearchParams()` + React Query 조합으로 처리해야 한다.
