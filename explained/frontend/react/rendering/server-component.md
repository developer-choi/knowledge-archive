# [UNVERIFIED] Server Component의 장점은?

## 도입

Server Component를 사용하면 Client Component만 쓸 때는 얻을 수 없는 여러 이점이 생긴다. 이 질문은 각 장점의 개요를 소개하고, 세부 메커니즘은 뒤따르는 질문들에서 Official Answer와 함께 다룬다.

---

## 본문

SC가 제공하는 주요 장점 여섯 가지:

```
SC 장점
├── JS 번들 크기 감소 (+ Hydration 비용 감소)
├── 초기 페이지 로딩 속도 개선
├── 네트워크 비용 절감 (single round-trip)
├── Caching
├── 백엔드 데이터 직접 접근
└── 보안 (민감 정보 서버에 보존)
```

CC 위주로 앱을 구성하면 위 장점을 모두 잃는다. 반대로 비대화형 UI를 SC로 옮기는 것만으로도 다음 세 가지가 즉시 개선된다 — 번들 크기, 초기 로딩, hydration 비용.

---

## 종합

SC의 장점은 "서버가 할 수 있는 일을 서버에서 처리"한다는 단순한 원칙에서 나온다. 렌더링을 클라이언트에 맡기면 JS 다운로드·파싱·실행 비용이 사용자 기기에서 발생하고, 서버와의 네트워크 왕복이 늘어난다. SC는 이 비용을 서버로 옮겨 클라이언트 부담을 줄인다.

---

---

# JS 번들 크기 감소가 어떻게 일어나는가?

## 도입

Client Component는 클라이언트 JS 번들에 포함된다. Server Component는 포함되지 않는다. 이 단순한 차이가 번들 크기 감소로 이어지고, 결과적으로 hydration 비용도 함께 줄어든다.

---

## 본문

> Server Components are excluded from your JavaScript bundle.

"Server Component는 JavaScript 번들에서 제외된다."

- **excluded from your JavaScript bundle**: SC의 컴포넌트 코드와 SC가 사용하는 라이브러리(예: 마크다운 파서, 날짜 포맷터)가 클라이언트 번들에 포함되지 않는다. 서버에서만 실행되고 결과(HTML/RSC Payload)만 전달된다.

> For example, large dependencies that previously would impact the JavaScript bundle size on the client can instead remain entirely on the server, leading to improved performance.

"예를 들어, 이전에 클라이언트 JavaScript 번들 크기에 영향을 미쳤던 대규모 의존성이 이제 서버에 완전히 남아있을 수 있어 성능이 개선된다."

> With Server Components, the initial page load is faster, and the client-side JavaScript bundle size is reduced.

"Server Component를 사용하면 초기 페이지 로딩이 더 빠르고 클라이언트 사이드 JavaScript 번들 크기가 줄어든다."

> If you start with an app composed entirely of Client Components, moving non-interactive pieces of your UI to Server Components can reduce the amount of client-side JavaScript needed.

"앱 전체가 CC로 구성되어 있다면, 비대화형 UI를 Server Component로 옮기면 필요한 클라이언트 사이드 JavaScript 양을 줄일 수 있다."

- **non-interactive pieces**: 상태 변화, 이벤트 핸들러, 브라우저 API가 없는 순수 렌더링 컴포넌트. 이런 컴포넌트는 SC로 충분하다.

```
CC 위주 앱 번들              SC 전환 후 번들
────────────────────         ─────────────────────────
Header CC      ~15KB         Header SC     0KB (서버에만 존재)
Article CC     ~20KB    →    Article SC    0KB
markdown-it    ~30KB         markdown-it   0KB (서버에서만 사용)
UserMenu CC    ~10KB         UserMenu CC   ~10KB (CC 유지)

총 ~75KB                     총 ~10KB
```

---

## 종합

번들 크기 감소는 JS 다운로드, 파싱, 실행 시간의 연쇄적인 개선을 만든다. 특히 heavy한 텍스트 처리 라이브러리(highlight.js, marked, moment 등)를 SC에서만 사용하면 이 라이브러리들이 클라이언트에 전달되지 않는다. 느린 네트워크 환경의 사용자에게 가장 큰 체감 차이가 생긴다.

---

---

# 초기 페이지 로딩 속도가 어떻게 더 빨라지는가?

## 도입

SC를 쓰면 초기 페이지 로딩이 빨라진다고 하는데, 구체적으로 어떤 메커니즘으로 빨라지는가? 단순히 번들이 작아지는 것 이상의 이유가 있다.

---

## 본문

> On the server, we can generate HTML to allow users to view the page immediately, without waiting for the client to download, parse and execute the JavaScript needed to render the page.

"서버에서 HTML을 생성하면 사용자가 페이지를 렌더링하는 데 필요한 JavaScript를 클라이언트가 다운로드, 파싱, 실행하길 기다리지 않고 즉시 페이지를 볼 수 있다."

- **without waiting for the client**: CC만 있는 SPA에서 사용자가 뭔가를 보려면 JS 번들이 도착하고 실행될 때까지 기다려야 한다. SC는 서버에서 HTML을 미리 만들어 보내므로 JS 실행 전에 화면이 표시된다.

> Data for the entire page must be fetched from the server before any components can be shown. The only way around this is to fetch data client-side in a useEffect() hook, which has a longer roundtrip than server-side fetches and happens only after the component is rendered and hydrated.

"페이지 전체의 데이터가 서버에서 패칭되어야 컴포넌트가 표시될 수 있다. 이를 우회하는 유일한 방법은 useEffect()에서 클라이언트 사이드 데이터 패칭인데, 이는 서버 사이드 패칭보다 왕복 시간이 길고 컴포넌트가 렌더링되고 hydrate된 후에야 발생한다."

- **longer roundtrip**: CC의 데이터 패칭 경로: 번들 다운로드 → 파싱 → 렌더링 → hydration → useEffect 실행 → API 호출. SC는 서버에서 직접 API 호출 후 HTML 생성. 경로가 훨씬 짧다.

```
CC useEffect 데이터 패칭 경로
브라우저 → 서버 (HTML 요청)
  → 빈 HTML 도착 (데이터 없음)
  → JS 번들 다운로드
  → 컴포넌트 렌더링 + hydration
  → useEffect 실행
  → API 서버 요청
  → 데이터 도착 → 화면 업데이트

SC 데이터 패칭 경로
브라우저 → 서버 (페이지 요청)
  → 서버에서 직접 API 호출 (빠른 경로)
  → 데이터 포함된 HTML 전송
  → 화면 즉시 표시
```

---

## 종합

SC의 초기 로딩 속도 개선은 두 방향에서 온다. 첫째, 서버에서 HTML을 미리 생성해 JS 실행 대기 없이 즉시 표시한다. 둘째, 데이터 패칭이 클라이언트 hydration 이후가 아닌 서버 렌더링 시점에 발생해 불필요한 네트워크 왕복이 제거된다.

---

---

# 네트워크 비용은 어떻게 절감되는가?

## 도입

클라이언트에서 여러 API를 호출하면 각각 별도의 네트워크 요청이 발생한다. SC는 이 여러 요청을 하나의 서버 왕복으로 압축할 수 있다.

---

## 본문

> 1. Perform multiple data fetches with single round-trip instead of multiple individual requests on the client.

"1. 클라이언트에서 여러 개별 요청 대신 단일 왕복으로 여러 데이터 패칭을 수행한다."

> 2. Depending on your region, data fetching can also happen closer to your data source, reducing latency and improving performance.

"2. 지역에 따라 데이터 패칭이 데이터 소스에 더 가까운 곳에서 발생할 수 있어 지연 시간을 줄이고 성능을 개선한다."

- **single round-trip**: 브라우저 → Next.js 서버로 한 번 요청하면, Next.js 서버가 백엔드 API들을 병렬로 호출하고 결과를 합쳐서 응답한다. 클라이언트 입장에서는 왕복 1회.
- **closer to your data source**: 프론트 서버와 API 서버가 같은 데이터센터 또는 VPC 내부에 있으면 물리적 거리가 가깝다. 클라이언트(사용자 기기)가 API 서버를 직접 호출하는 것보다 훨씬 낮은 지연이다.

```
CC 방식 (클라이언트에서 여러 요청)
사용자 기기 → API 1 (100ms)
사용자 기기 → API 2 (150ms)
사용자 기기 → API 3 (80ms)
합계: 150ms (병렬이어도 가장 느린 것에 의존)
+ 클라이언트-서버 거리 지연 추가

SC 방식 (서버에서 한 번에)
사용자 기기 → Next.js 서버 (30ms)
             Next.js 서버 → API 1 (10ms, 근거리)
             Next.js 서버 → API 2 (12ms, 근거리)
             Next.js 서버 → API 3 (8ms, 근거리)
전체: ~52ms
```

---

## 종합

SC의 네트워크 비용 절감은 "클라이언트-서버 거리 감소"와 "왕복 횟수 감소" 두 가지에서 온다. 사용자 기기에서 API 서버까지의 왕복 N번이 서버-서버 빠른 경로 1번으로 압축된다. 특히 사용자가 물리적으로 API 서버와 멀리 있는 경우(해외 사용자 등) 이 차이가 크다.

---

---

# Caching은 어떻게 활용되는가?

## 도입

SC의 렌더링 결과는 캐시할 수 있다. 같은 요청에 대해 매번 다시 렌더링하지 않고 캐시된 결과를 재사용하면 서버 부하와 응답 시간이 줄어든다.

---

## 본문

> By rendering on the server, the result can be cached and reused on subsequent requests and across users. This can improve performance and reduce cost by reducing the amount of rendering and data fetching done on each request.

"서버에서 렌더링하면 결과를 캐시하여 이후 요청과 여러 사용자에 걸쳐 재사용할 수 있다. 이는 각 요청마다 수행되는 렌더링과 데이터 패칭 양을 줄여 성능을 개선하고 비용을 절감할 수 있다."

- **across users**: CC는 각 사용자 기기에서 별도로 렌더링된다. SC는 서버에서 한 번 렌더링한 결과를 여러 사용자가 공유할 수 있다. 동일한 상품 페이지를 1만 명이 조회해도 서버에서 한 번만 렌더링하면 된다(캐시 유효 기간 내).
- **reduce cost**: 클라우드 환경에서 서버 CPU 사용량이 렌더링 횟수에 비례한다. 캐시로 렌더링 횟수를 줄이면 인프라 비용이 직접 절감된다.

```
캐시 계층

Full Route Cache      RSC Payload + HTML 전체를 캐시
                      정적 라우트는 빌드 시 생성

Data Cache            fetch() 결과를 캐시 (API 응답)
                      revalidate 옵션으로 갱신 주기 설정

Router Cache (클라이언트)  브라우저 메모리에 RSC Payload 저장
                           이미 방문한 라우트는 서버 요청 없음
```

---

## 종합

SC의 캐싱은 단계별로 이루어진다. 데이터 캐시로 API 호출을 줄이고, 라우트 캐시로 렌더링 자체를 줄이고, 클라이언트 라우터 캐시로 서버 왕복을 줄인다. 이 세 캐시 레이어가 조합되어야 SC의 성능 이점이 최대화된다.

---

---

# 백엔드 데이터 직접 접근과 보안 측면의 이점은?

## 도입

SC는 서버에서 실행되므로 DB, 파일 시스템, 내부 API에 직접 접근할 수 있다. 클라이언트에서는 외부 API 엔드포인트를 통해야 했던 작업들이 SC에서는 직접 처리 가능하다.

---

## 본문

> Have direct access to backend data resources (e.g. databases).

"백엔드 데이터 리소스(예: 데이터베이스)에 직접 접근할 수 있다."

> Keep your application more secure by preventing sensitive information...

"민감한 정보가 노출되는 것을 방지하여 애플리케이션을 더 안전하게 유지할 수 있다."

- **direct access to databases**: API 레이어 없이 DB를 직접 쿼리할 수 있다. Next.js 서버에서 Prisma, Drizzle, pg 같은 DB 클라이언트를 직접 사용한다.
- **sensitive information**: API 키, DB 비밀번호, 내부 서버 URL 등. CC에서 사용하면 클라이언트 번들에 포함되거나 브라우저 개발자 도구로 노출될 수 있다. SC에서는 서버 메모리에만 존재한다.

```
보안 비교

CC 방식
  클라이언트 → 외부 API 호출 (API 키가 번들에 포함되면 노출)
  클라이언트 → BFF → DB (중간 레이어 필요)

SC 방식
  SC (서버 내부) → DB 직접 쿼리 (API 키 서버에만 존재)
  클라이언트에는 렌더링 결과만 전달
```

---

## 종합

SC가 서버에서 실행된다는 것은 서버의 모든 자원에 접근 가능하다는 의미다. DB 연결, 파일 시스템, 환경 변수에 담긴 비밀 키 등이 클라이언트로 노출되지 않는다. 기존 풀스택에서 BFF(Backend For Frontend) 레이어를 따로 만들어야 했던 패턴이 SC로 일부 대체될 수 있다.

---

---

# Server Component의 기본 특성과 Next.js App Router 기본값은?

## 도입

React Server Component는 React의 새로운 컴포넌트 유형이다. Next.js App Router는 이것을 기본값으로 채택했다. SC의 핵심 특성과 App Router에서의 기본 동작을 정리한다.

---

## 본문

> React Server Components allow you to write UI that can be rendered and optionally cached on the server.

"React Server Component는 서버에서 렌더링되고 선택적으로 캐시될 수 있는 UI를 작성할 수 있게 해준다."

> To make the transition to Server Components easier, all components inside the App Router are Server Components by default, including special files and colocated components.

"Server Component로의 전환을 쉽게 하기 위해, App Router 내의 모든 컴포넌트는 특수 파일과 함께 배치된 컴포넌트를 포함해 기본적으로 Server Component다."

> Server Components are not interactive and therefore do not read from React state.

"Server Component는 interactive하지 않으므로 React state를 읽지 않는다."

- **rendered and optionally cached**: 렌더링 결과를 서버에 캐시하면 같은 요청에 대해 매번 재실행하지 않아도 된다. "optionally"는 개발자가 캐싱 전략을 선택할 수 있다는 뜻이다.
- **not interactive**: SC는 사용자 이벤트에 반응하지 않는다. `useState`, `useEffect`, onClick 핸들러를 가질 수 없다.

> Server and Client Components can be combined in the same component tree. All components are part of the Server Component unless defined or imported in a module that starts with the `"use client"` directive.

"Server와 Client Component는 같은 컴포넌트 트리에서 결합될 수 있다. 모든 컴포넌트는 `"use client"` 지시어로 시작하는 모듈에서 정의되거나 import되지 않는 한 Server Component의 일부다."

---

## 종합

App Router에서의 기본 원칙은 "SC를 기본으로, CC는 필요할 때만"이다. `"use client"` 없는 컴포넌트는 자동으로 SC로 처리된다. SC와 CC를 같은 트리에 혼합할 수 있어 성능이 필요한 부분(데이터 패칭, 정적 렌더링)은 SC로, 상호작용이 필요한 부분은 CC로 구성하는 세밀한 제어가 가능하다.

---

---

# Next.js의 server-first 접근이란 무엇인가?

## 도입

"server-first"는 단순한 권장사항이 아니라 App Router의 설계 철학이다. 모든 컴포넌트를 SC로 시작하고, CC가 명확히 필요한 경우에만 전환하는 접근이다.

---

## 본문

> We recommend using Server Components until you have a use case for a Client Component.

"Client Component가 필요한 사용 사례가 생길 때까지 Server Component를 사용하길 권장한다."

> For example, you may have a Layout that has static elements (e.g. logo, links, etc) and an interactive search bar that uses state.

"예를 들어, 정적 요소(로고, 링크 등)가 있는 Layout과 state를 사용하는 대화형 검색 바가 있을 수 있다."

> If we were to split the page into smaller components, you'll notice that the majority of components are non-interactive and can be rendered on the server as Server Components.

"페이지를 더 작은 컴포넌트로 분리하면, 대부분의 컴포넌트가 비대화형이고 Server Component로 서버에서 렌더링될 수 있음을 알 수 있다."

> Instead of making the whole layout a Client Component, move the interactive logic to a Client Component (e.g. `<SearchBar />`) and keep your layout as a Server Component.

"레이아웃 전체를 CC로 만드는 대신, 대화형 로직을 CC(예: `<SearchBar />`)로 옮기고 레이아웃은 SC로 유지한다."

- **split the page into smaller components**: UI를 상호작용이 필요한 부분과 그렇지 않은 부분으로 분리. 분리할수록 SC로 유지할 수 있는 범위가 넓어진다.

```
server-first 적용 예시

비권장 — 레이아웃 전체를 CC로
'use client';
export default function Layout() {
  return (
    <div>
      <Logo />         {/* 정적, CC 불필요 */}
      <Nav />          {/* 정적, CC 불필요 */}
      <SearchBar />    {/* 상호작용 필요 */}
    </div>
  );
}

권장 — 필요한 부분만 CC로
// Layout.tsx (SC)
export default function Layout() {
  return (
    <div>
      <Logo />      {/* SC */}
      <Nav />       {/* SC */}
      <SearchBar /> {/* CC (별도 파일) */}
    </div>
  );
}
```

---

## 종합

server-first 접근의 실무 의의는 "기본값을 SC로 두고, CC는 좁은 범위에만 적용"이다. 로고, 링크, 정적 텍스트 같은 요소들은 SC로 두어 번들에서 제외한다. 상호작용이 필요한 버튼, 폼, 검색바만 CC로 분리한다. 이 분리를 세밀하게 할수록 클라이언트 번들이 작아지고 hydration 비용이 줄어든다.

---

---

# Server Component의 3가지 렌더링 전략은?

## 도입

SC는 단일한 방식으로 렌더링되지 않는다. 데이터의 특성과 성능 요구에 따라 세 가지 전략 중 하나를 선택한다.

---

## 본문

> The rendering work is further split by route segments to enable streaming and partial rendering, and there are three different server rendering strategies:
> - Static Rendering
> - Dynamic Rendering
> - Streaming

"렌더링 작업은 streaming과 부분 렌더링을 활성화하기 위해 route segment로 더 분리되며, 세 가지 다른 서버 렌더링 전략이 있다."

세 전략 비교:

```
전략              언제 렌더링          캐시           사용 사례
──────────────   ─────────────────   ──────────     ─────────────────────
Static Rendering  빌드 시 또는       Full Route     블로그 포스트, 제품 목록
                  revalidation 시    Cache에 저장   (데이터가 자주 변하지 않음)

Dynamic Rendering 각 요청마다        캐시 없음       대시보드, 사용자별 피드
                                                    (매 요청마다 새 데이터)

Streaming         준비되는 대로      부분 가능       느린 데이터 소스가 있는
                  점진적 전송                        복잡한 페이지
```

- **Static Rendering**: 빌드 시 HTML을 생성하고 CDN에 캐시. 모든 사용자에게 같은 내용. 가장 빠른 응답.
- **Dynamic Rendering**: 요청 시마다 서버에서 새로 실행. cookies, headers, searchParams처럼 요청에 의존하는 데이터가 필요할 때.
- **Streaming**: Suspense와 결합해 chunk 단위로 점진적 전송.

---

## 종합

세 전략은 배타적이지 않다. 같은 페이지에서 일부 컴포넌트는 Static, 일부는 Dynamic, 일부는 Streaming으로 처리할 수 있다. Suspense boundary가 이 혼합을 가능하게 한다 — 정적 컴포넌트는 캐시에서 즉시 보내고, 동적 컴포넌트는 요청마다 렌더링해 스트리밍으로 전달한다.

---

---

# `"use server"`는 Server Component를 선언하는 지시어인가?

## 도입

`"use client"`가 Client Component를 선언하는 것처럼, `"use server"`가 Server Component를 선언한다고 오해하기 쉽다. 하지만 두 지시어의 역할은 비대칭이다.

---

## 본문

> A common misunderstanding is that Server Components are denoted by `"use server"`, but there is no directive for Server Components. The `"use server"` directive is used for Server Functions.

"`"use server"`가 Server Component를 나타낸다는 것은 흔한 오해지만, Server Component를 위한 지시어는 없다. `"use server"` 지시어는 Server Function에 사용된다."

- **no directive for Server Components**: SC는 App Router에서 기본값이다. 명시적으로 선언할 필요가 없고, 선언할 방법도 없다.
- **Server Functions**: `"use server"`는 서버에서 실행되는 함수(Server Action)를 선언한다. 클라이언트에서 호출할 수 있지만 서버에서 실행되는 함수다.

```
지시어 역할 정리

"use client"    Client Component 선언 (파일 또는 함수 단위)
"use server"    Server Function(Action) 선언 (파일 또는 함수 단위)
(없음)          기본값 = Server Component
```

---

## 종합

SC와 Server Action은 모두 서버에서 실행되지만 성격이 다르다. SC는 UI 트리를 반환하는 컴포넌트이고, Server Action은 클라이언트에서 트리거할 수 있는 서버 사이드 함수다. `"use server"`는 Server Action을 위한 것이다 — SC를 선언하는 지시어가 필요하다면, 그냥 `"use client"`를 제거하면 된다.

---

---

# `server-only` 패키지는 왜 필요한가?

## 도입

서버에서만 사용해야 할 코드(DB 연결, 비밀 API 키를 사용하는 함수 등)가 실수로 CC에 import되면 보안 문제가 생긴다. `server-only` 패키지는 이런 실수를 빌드 타임에 잡아준다.

---

## 본문

> At first glance, it appears that `getData` works on both the server and the client. But because the environment variable `API_KEY` is not prefixed with `NEXT_PUBLIC`, it's a private variable that can only be accessed on the server. Next.js replaces private environment variables with the empty string in client code to prevent leaking secure information.

"처음 보면 `getData`가 서버와 클라이언트 모두에서 동작하는 것처럼 보인다. 그러나 환경 변수 `API_KEY`가 `NEXT_PUBLIC`으로 접두사가 붙지 않아서, 서버에서만 접근할 수 있는 프라이빗 변수다. Next.js는 보안 정보 누출을 방지하기 위해 클라이언트 코드에서 프라이빗 환경 변수를 빈 문자열로 교체한다."

- **`NEXT_PUBLIC_` prefix**: 이 접두사가 있는 환경 변수는 클라이언트 번들에 포함된다. 없으면 서버 전용으로 클라이언트에서는 빈 문자열이 된다.
- **replaces with empty string**: 에러를 내는 게 아니라 조용히 빈 문자열로 대체한다. 개발자가 이를 모르면 "왜 빈 값이 오지?"라고 혼란스러울 수 있다.

`server-only` 사용 예시:

```ts
// lib/data.ts
import 'server-only'; // 이 파일이 CC에 import되면 빌드 에러

export async function getData() {
  const data = await fetch('https://api.example.com', {
    headers: { Authorization: process.env.API_KEY },
  });
  return data.json();
}
```

---

## 종합

`server-only`는 "이 파일은 서버에서만 사용해야 한다"는 의도를 빌드 타임 검증으로 강제한다. 없으면 서버 전용 코드가 CC에 import되어도 빌드는 통과하고, 런타임에 빈 문자열 API 키로 실패하거나 서버 로직이 클라이언트에 노출된다. 민감한 로직이 있는 유틸 파일에는 `server-only`를 추가하는 것이 방어적 프로그래밍의 기본이다.

---

---

# 비-`NEXT_PUBLIC_` 환경 변수는 client code에서 어떻게 되는가?

## 도입

환경 변수 접두사 규칙을 모르면 서버에서 잘 동작하던 코드가 클라이언트에서 예상치 못하게 동작할 수 있다.

---

## 본문

> Because the environment variable is not prefixed with `NEXT_PUBLIC`, it's a private variable that can only be accessed on the server. Next.js replaces private environment variables with the empty string in client code to prevent leaking secure information.

"`NEXT_PUBLIC_` 접두사가 없으므로, 서버에서만 접근할 수 있는 프라이빗 변수다. Next.js는 보안 정보 누출을 방지하기 위해 클라이언트 코드에서 프라이빗 환경 변수를 빈 문자열로 교체한다."

```
환경 변수 접근 규칙

NEXT_PUBLIC_ANALYTICS_ID   → 클라이언트 번들에 포함, 브라우저에서 접근 가능
DATABASE_URL               → 서버 전용, 클라이언트에서 "" (빈 문자열)
API_SECRET_KEY             → 서버 전용, 클라이언트에서 "" (빈 문자열)

// CC에서
process.env.DATABASE_URL   → "" (에러 없이 빈 문자열)
process.env.NEXT_PUBLIC_ID → "actual-id-value"
```

- **빈 문자열로 교체**: 에러가 발생하지 않아 문제를 늦게 발견할 수 있다. `API_KEY`가 빈 문자열이면 API 인증이 실패하지만, 그 이유가 환경 변수 접근 문제임을 바로 알기 어렵다.

---

## 종합

`NEXT_PUBLIC_` 없는 환경 변수는 서버 전용이다. 클라이언트 코드에서 접근하면 에러 없이 빈 문자열이 된다. 이 조용한 실패가 디버깅을 어렵게 한다. 서버 전용 환경 변수를 쓰는 함수는 `server-only` 패키지로 보호하고, 클라이언트에서 필요한 값은 반드시 `NEXT_PUBLIC_` 접두사를 붙여야 한다.

---

---

# RSC는 Client Component를 대체하는가?

## 도입

RSC가 등장하면서 CC의 역할이 줄어드는 것처럼 보일 수 있다. 하지만 RSC와 CC는 대체 관계가 아니라 상호 보완 관계다.

---

## 본문

> Consider leveraging RSCs for server-side rendering and data fetching, while relying on Client Components for locally interactive features and user experiences.

"서버 사이드 렌더링과 데이터 패칭을 위해 RSC를 활용하고, 로컬 대화형 기능과 사용자 경험을 위해 CC에 의존하는 것을 고려해라."

> RSCs do not support continuous updates, such as through WebSockets. In these cases, a client-side fetching or polling approach would be necessary.

"RSC는 WebSocket을 통한 것처럼 지속적인 업데이트를 지원하지 않는다. 이런 경우 클라이언트 사이드 패칭이나 폴링 접근이 필요하다."

RSC와 CC의 역할 분리:

```
RSC                              CC
──────────────────────────────   ──────────────────────────────
서버 사이드 데이터 패칭           클라이언트 상태 관리 (useState)
초기 HTML 렌더링                 사용자 이벤트 처리
캐싱 가능한 정적 UI              브라우저 API 접근
민감한 데이터 처리               실시간 업데이트 (WebSocket)
SEO 최적화 콘텐츠               애니메이션, 드래그 앤 드롭
```

---

## 종합

RSC는 "서버에서 처리하면 더 나은 것"을 서버로 옮기는 도구이고, CC는 "클라이언트에서만 할 수 있는 것"을 담당한다. WebSocket, 실시간 업데이트, 복잡한 사용자 상호작용은 여전히 CC가 필요하다. 두 타입을 같은 트리에 혼합하여 각각의 장점을 모두 활용하는 것이 App Router의 설계 의도다.

---

---

# RSC가 재렌더링될 때 client state가 유지되는 이유는?

## 도입

SC가 서버에서 다시 렌더링되면 클라이언트의 상태(입력값, 스크롤 위치, 체크박스 선택 등)가 초기화될 것 같지만, 실제로는 그렇지 않다. RSC의 스마트한 DOM 업데이트 방식 덕분이다.

---

## 본문

> RSCs individually fetch data and render entirely on the server, and the resulting HTML is streamed into the client-side React component tree, interleaving with other Server and Client Components as necessary.

"RSC는 개별적으로 데이터를 패칭하고 서버에서 완전히 렌더링하며, 결과 HTML은 필요에 따라 다른 Server와 Client Component와 교차하며 클라이언트 사이드 React 컴포넌트 트리로 스트리밍된다."

> This process eliminates the need for client-side re-rendering, thereby improving performance.

"이 과정은 클라이언트 사이드 리렌더링의 필요성을 제거하여 성능을 개선한다."

> When an RSC needs to be re-rendered, due to state change, it refreshes on the server and seamlessly merges into the existing DOM without a hard refresh.

"RSC가 상태 변화로 인해 재렌더링되어야 할 때, 서버에서 새로 고침하고 하드 리프레시 없이 기존 DOM에 seamlessly 병합된다."

> As a result, the client state is preserved even as parts of the view are updated from the server.

"결과적으로 뷰의 일부가 서버에서 업데이트되어도 클라이언트 상태가 보존된다."

- **hard refresh**: 페이지 전체를 다시 로드하는 것. RSC 재렌더링은 이것이 아니다.
- **seamlessly merges**: RSC Payload를 받아 기존 DOM과 reconcile. 변경된 SC 부분만 DOM에 패치하고, CC의 DOM 노드는 건드리지 않는다.
- **client state is preserved**: CC의 `useState`가 가진 값, focus된 input, 스크롤 위치가 SC 재렌더링의 영향을 받지 않는다.

```
SC 재렌더링 시 DOM 업데이트

기존 DOM           RSC Payload (업데이트)
──────────         ─────────────────────────
<Header>           <Header> (변경 없음)
<UserData> ←───── <UserData> (새 데이터)  → DOM 패치
<SearchBar>        (CC, RSC Payload에 없음) → 건드리지 않음
  value="abc"                              → value 유지
```

---

## 종합

RSC 재렌더링이 client state를 보존하는 비결은 reconcile이다. SC 부분만 새 RSC Payload로 교체하고, CC 노드는 기존 상태를 유지한 채 그 자리에 남긴다. 이 덕분에 Server Action이 SC를 서버에서 다시 실행하더라도 사용자가 입력 중인 폼, 선택한 옵션, 스크롤 위치 등이 초기화되지 않는다.
