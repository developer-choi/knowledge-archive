# Next.js에서 렌더링 작업은 어떤 단위로 나뉘는가?

## 도입

서버가 페이지 하나를 통째로 다 만든 뒤에야 브라우저에 보낸다면, 가장 느린 부분 하나가 전체를 붙잡는다. Next.js는 렌더링을 여러 덩어리로 쪼개고, 각 덩어리를 두 걸음에 걸쳐 만든 뒤 완성된 것부터 흘려보낸다.

---

## 본문

> The rendering work is split into chunks: by individual routes segments and **Suspense boundaries**.

"렌더링 작업은 덩어리로 쪼개진다 — 개별 route segment와 **Suspense 경계**를 기준으로."

- **chunk**: 한 번에 처리하고 한 번에 내보낼 수 있는 작업 덩어리.
- **route segment**: 주소의 한 칸. `/blog/hello`면 `blog`와 `hello`가 각각 한 칸이고, 칸마다 `layout`·`page`가 붙는다.
- **Suspense boundary**: `<Suspense>`로 감싼 자리. 안쪽이 아직 준비 안 됐으면 대체 화면을 먼저 보여주는 경계선이다.

> Each chunk is rendered in two steps:
>
> 1. React renders Server Components into a special data format, optimized for streaming, called the **React Server Component Payload.**
> 2. Next.js uses the React Server Component Payload **and Client Component** JavaScript instructions to render **HTML** on the server.

"각 덩어리는 두 단계로 렌더링된다. 먼저 React가 Server Component를 스트리밍에 최적화된 특수 데이터 형식인 **RSC Payload**로 만든다. 그다음 Next.js가 그 RSC Payload와 **Client Component** JavaScript 명령을 함께 써서 서버에서 **HTML**을 만든다."

- **optimized for streaming**: 처음부터 끝까지 다 모여야 쓸 수 있는 형식이 아니라, 앞부분부터 잘라 보내도 받는 쪽이 이해할 수 있는 형식.
- **JavaScript instructions**: Client Component를 화면에 그리는 방법이 담긴 코드.

### 초기 HTML에는 Client Component도 들어간다

초기 로딩 시 Client Component으로도 HTML을 만든다. (서버에서 초기 HTML 생성 시 CC도 포함됨)

"Client Component는 클라이언트에서만 도는 것"이라는 이름의 인상과 다르다. 이름이 가리키는 것은 *어디서 상호작용을 담당하느냐*이지 *어디서 처음 그려지느냐*가 아니다.

> This means we don't have to wait for everything to render before caching the work or sending a response. Instead, we can stream a response as work is completed.

"덕분에 캐싱하거나 응답을 보내기 전에 전부 렌더링되기를 기다릴 필요가 없다. 대신 작업이 끝나는 대로 응답을 흘려보낼 수 있다."

```
쪼개지 않으면
  [전부 렌더링 ................................] → 전송

쪼개면
  [덩어리1] → 전송
      [덩어리2] → 전송
          [덩어리3] → 전송
```

---

## 종합

쪼개는 이유는 "기다림을 없애는 것"이 아니라 "기다림을 겹치게 하는 것"이다. 총 작업량은 같지만, 먼저 끝난 조각이 뒤엣것을 기다리지 않고 출발하므로 사용자가 첫 화면을 보는 시점이 앞당겨진다.

---

# 클라이언트에서 Reconciliation과 Hydration은 어떻게 이루어지는가?

## 도입

서버는 브라우저에 세 가지를 보낸다 — HTML, RSC Payload, JavaScript. 셋은 같은 화면을 만드는 세 벌의 사본이 아니라, 차례로 다른 일을 맡는 세 재료다.

---

## 본문

> At request time, on the client:
>
> 1. The HTML is used to immediately show a fast non-interactive initial preview of the Client and Server Components.
> 2. The React Server Components Payload is used to reconcile the Client and rendered Server Component trees, and update the DOM.
> 3. The JavaScript instructions are used to hydrate Client Components and make the application interactive.

"요청 시점, 클라이언트에서는 이렇게 된다. HTML은 Client·Server Component의 빠른 비대화형 첫 미리보기를 즉시 보여주는 데 쓰인다. RSC Payload는 Client 트리와 렌더링된 Server Component 트리를 맞춰보고 DOM을 갱신하는 데 쓰인다. JavaScript 명령은 Client Component를 hydrate해 앱을 대화형으로 만드는 데 쓰인다."

- **non-interactive**: 눈에는 보이지만 아직 눌러도 반응하지 않는 상태.
- **preview**: 최종 화면이 아니라 먼저 보여주는 밑그림.
- **reconcile**: 두 트리를 견주어 달라진 부분만 골라내는 일.
- **hydrate**: 이미 그려져 있는 HTML에 동작을 붙여 살아 움직이게 만드는 일.

```
셋의 역할

HTML          → 일단 보이게      (반응 없음)
RSC Payload   → 두 트리 맞춰보고 DOM 고치기
JavaScript    → 눌리게 만들기    (반응 생김)
```

---

## 종합

이 순서 덕분에 "빈 화면을 오래 보는" 구간이 사라진다. JavaScript가 다 내려오기 전에도 HTML이 화면을 채우고 있고, 다 내려온 뒤에야 버튼이 눌린다. 화면이 보이는데 클릭이 안 먹는 짧은 구간이 있다면 바로 이 사이에 있는 것이다.

---

# Router Cache에는 무엇이 저장되며 어떻게 활용되는가?

## 도입

한 번 다녀온 페이지를 다시 열 때 서버에 또 물어보는 것은 낭비다. 브라우저는 받아둔 RSC Payload를 메모리에 챙겨두고, 같은 곳으로 돌아가면 그것을 꺼내 쓴다.

---

## 본문

> The React Server Component Payload is stored in the client-side Router Cache - a separate in-memory cache, split by individual route segment.

"RSC Payload는 클라이언트 쪽 Router Cache에 저장된다 — 개별 route segment 단위로 나뉜 별도의 메모리 내 캐시다."

- **in-memory**: 브라우저 메모리에 둔다는 뜻. 새로고침하면 사라진다.
- **split by individual route segment**: 페이지 통째가 아니라 주소의 칸마다 따로 담긴다. 그래서 레이아웃은 그대로 두고 안쪽만 갈아끼우는 이동이 가능하다.

> This Router Cache is used to improve the navigation experience by storing previously visited routes and **prefetching future routes.**

"이 Router Cache는 이미 방문한 경로를 저장하고 **앞으로 갈 경로를 미리 가져와** 화면 이동 경험을 개선하는 데 쓰인다."

- **previously visited**: 이미 다녀온 곳 — 뒤로 가기가 즉시 되는 이유.
- **prefetching**: 아직 안 갔지만 갈 것 같은 곳을 미리 받아두는 것.

```
Router Cache (브라우저 메모리)

/blog          ← 다녀옴, 담겨 있음
/blog/hello    ← 다녀옴, 담겨 있음
/about         ← 안 갔지만 링크가 보여서 미리 받아둠
```

---

## 종합

저장 단위가 페이지가 아니라 주소의 칸이라는 점이 핵심이다. 통째로 담았다면 레이아웃이 같은 두 페이지를 오갈 때마다 같은 레이아웃을 두 번 담고 두 번 그렸을 것이다. 칸으로 나눠 담기에 공통 부분은 한 벌만 두고 재사용한다.

---

# Subsequent Navigation에서 Next.js는 서버 요청을 어떻게 최소화하는가?

## 도입

앞의 캐시가 실제로 요청을 줄이는 방식은 단순하다. 이동할 때마다 "이거 이미 갖고 있나?"를 먼저 보고, 있으면 서버를 건너뛴다.

---

## 본문

> On subsequent navigations or during prefetching, Next.js will check if the RSC Payload **is stored in the Router Cache.**
>
> If so, it will skip sending a new request to the server.

"이후의 화면 이동이나 prefetching 중에, Next.js는 RSC Payload가 **Router Cache에 저장돼 있는지** 확인한다. 있으면 서버에 새 요청을 보내는 것을 건너뛴다."

- **subsequent navigation**: 첫 접속 이후의 화면 이동. 주소창에 직접 치고 들어오는 것이 아니라 앱 안에서 링크를 눌러 옮겨 다니는 경우.
- **skip**: 요청을 늦게 보내는 것이 아니라 아예 안 보내는 것.

> If the route segments are not in the cache, Next.js will fetch the React Server Components Payload from the server, and populate the Router Cache on the client.

"route segment가 캐시에 없으면, Next.js는 서버에서 RSC Payload를 받아와 클라이언트의 Router Cache를 채운다."

- **populate**: 비어 있던 자리를 채워 넣는 것. 다음번 같은 이동은 이 채워진 것을 쓴다.

### 실제로 무엇이 오가는지 확인해보면

Next.js로 만든 웹사이트에 처음 접근한 페이지는 HTML을 받지만, Subsequent Navigation 페이지는 전부 RSC를 요청한다.

메뉴 오픈 시 3개 라우트가 즉시 요청되고, Link 위에 마우스 오버 시 prefetching 요청이 발생하는 것을 확인함. 핵심은 넷 다 RSC 요청이었다.

```
첫 접속        → HTML 받음
그 뒤 이동     → RSC Payload 받음 (캐시에 없을 때만)
링크가 보임    → RSC Payload 미리 받아둠
```

---

## 종합

"첫 화면은 HTML, 그 뒤는 RSC Payload"라는 갈림이 여기서 나온다. 첫 접속은 보여줄 것이 아무것도 없으니 완성된 HTML이 필요하지만, 이미 앱이 떠 있는 상태에서는 바뀔 부분의 설계도만 받으면 충분하다. 개발자 도구 네트워크 탭에서 이 차이가 그대로 보인다.

---

# Pages Router와 App Router의 Hydration 방식 차이는?

## 도입

예전 방식에서는 페이지 전체가 hydrate될 때까지 아무것도 누를 수 없었다. App Router는 이 작업을 조각내어, 준비된 부분부터 차례로 살아나게 한다.

---

## 본문

> Previously, opt-ing into server-side rendering with Next.js (through getServerSideProps) meant that interacting with your application was blocked until the entire page was hydrated.

"이전에는 (`getServerSideProps`를 통해) 서버 사이드 렌더링을 선택하면, 페이지 전체가 hydrate될 때까지 앱과의 상호작용이 막혀 있었다."

- **blocked**: 화면은 보이는데 클릭·입력이 먹지 않는 상태.
- **the entire page**: 페이지 전체. 한 구석의 무거운 컴포넌트 하나가 나머지 전부를 붙잡았다.

> With the App Router, we've refactored the architecture to be deeply integrated with React Suspense, meaning we can selectively hydrate parts of the page, without blocking other components in the UI from being interactive.

"App Router에서는 React Suspense와 깊이 결합하도록 구조를 다시 짰다. 페이지의 일부만 골라 hydrate할 수 있고, 그동안 다른 컴포넌트가 대화형이 되는 것을 막지 않는다."

- **selectively hydrate**: 전부가 아니라 골라서 되살리는 것.

> Content can be instantly streamed from the server, improving the perceived loading performance of a page.

"콘텐츠가 서버에서 즉시 흘러나올 수 있어, 페이지의 체감 로딩 성능이 개선된다."

- **perceived**: 실제 총 시간이 아니라 사용자가 느끼는 빠르기.

> When a route is loaded with Next.js, the initial HTML is rendered on the server.
>
> On the server, React renders all Server Components before sending the result to the client.
> - Server Component is guaranteed to be only rendered **on the server**.
> - This includes Server Components nested inside Client Components.

"라우트가 로드되면 초기 HTML은 서버에서 만들어진다. 서버에서 React는 결과를 클라이언트로 보내기 전에 모든 Server Component를 렌더링한다. Server Component는 **오직 서버에서만** 렌더링되는 것이 보장되며, 여기에는 Client Component 안에 중첩된 Server Component도 포함된다."

- **guaranteed**: 상황에 따라 달라지지 않는다는 약속. 서버 전용 코드를 안심하고 둘 수 있는 근거다.
- **nested inside**: `children` 등으로 Client Component 안쪽 자리에 들어간 경우.

> On the client, React renders Client Components and slots in the rendered result of Server Components, merging the work done on the server and client.
> - If any Server Components are nested inside a Client Component, their rendered content will be placed correctly within the Client Component.
> - Client Components are pre-rendered **on the server** and hydrated **on the client**.
> - This HTML is then **progressively enhanced** in the browser, allowing the client to take over the application and add interactivity, by asynchronously loading the Next.js and React client-side runtime.

"클라이언트에서 React는 Client Component를 렌더링하고 Server Component의 렌더링 결과를 그 자리에 끼워 넣어, 서버와 클라이언트가 한 일을 합친다. Client Component 안에 중첩된 Server Component가 있으면 그 결과물이 Client Component 안의 올바른 자리에 놓인다. Client Component는 **서버에서 미리 렌더링되고 클라이언트에서 hydrate된다.** 이 HTML은 브라우저에서 **점진적으로 향상되어**, Next.js와 React 클라이언트 런타임을 비동기로 불러오면서 클라이언트가 앱을 넘겨받고 상호작용을 붙인다."

- **slots in**: 비워둔 자리에 끼워 넣는 것.
- **pre-rendered on the server, hydrated on the client**: 그리는 곳과 살리는 곳이 다르다는 뜻. Client Component도 첫 HTML은 서버가 만든다.
- **progressively enhanced**: 기본 형태부터 보여주고 나중에 기능을 얹는 방식.
- **take over**: 서버가 만든 화면을 클라이언트가 넘겨받아 이후를 책임지는 것.

```
Pages Router
  [전체 HTML] → [전체 hydrate 완료] → 여기서부터 클릭 가능

App Router
  [조각 A] → A hydrate → A 클릭 가능
       [조각 B] → B hydrate → B 클릭 가능
            [조각 C] → ...
```

---

## 종합

바뀐 것은 hydration이 하는 일이 아니라 그 단위다. 예전에는 페이지가 단위라서 가장 늦게 준비되는 부분이 전체의 발목을 잡았고, 지금은 Suspense 경계가 단위라서 각자 준비되는 대로 살아난다. 그래서 "총 로딩 시간"보다 "언제부터 쓸 수 있느냐"가 눈에 띄게 좋아진다.
