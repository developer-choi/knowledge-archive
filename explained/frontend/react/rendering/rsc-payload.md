# RSC Payload란 무엇인가?

## 도입

Server Component가 렌더링된 결과물은 HTML도, JSON도 아닌 별도의 포맷으로 전달된다. 이 포맷이 RSC Payload다. 왜 HTML 대신 이 중간 형식을 거치는지, 그리고 어떤 정보가 담겨 있는지가 Next.js App Router를 이해하는 핵심이다.

---

## 본문

> The React Server Component Payload is a compact binary representation of the rendered React Server Components.

"React Server Component Payload는 렌더링된 React Server Component의 콤팩트한 바이너리 표현이다."

- **compact**: 크기가 작게 압축된 형태. 네트워크 전송 효율을 높이기 위해 최소화된다.
- **binary representation**: 텍스트 기반의 HTML이나 JSON이 아닌 바이너리 형식. React가 파싱하기 최적화된 구조다.
- **rendered React Server Components**: SC가 실행된 결과. HTML 태그가 아니라 React 컴포넌트 트리 구조로 인코딩된다.

RSC Payload의 특성 요약:

```
RSC Payload
├── SC 렌더링 결과물 (바이너리 인코딩)
├── streaming에 최적화된 형식
├── 특수 데이터 포맷 (JSON이 아님)
└── compact binary representation
```

---

## 종합

RSC Payload는 SC와 CC 사이를 연결하는 교환 형식이다. SC의 렌더링 결과를 클라이언트가 이해할 수 있는 구조로 인코딩하여 전송하고, 클라이언트는 이를 받아 DOM과 reconcile한다. HTML보다 구조화되어 있어 React가 기존 DOM을 파괴하지 않고 차이만 적용할 수 있다.

---

---

# RSC Payload에 들어있는 4가지 내용은?

## 도입

RSC Payload가 "SC 렌더링 결과물"이라는 건 알겠는데, 정확히 어떤 정보가 담겨 있는지를 알아야 Full Page Load와 Subsequent Navigation에서 클라이언트가 이것을 어떻게 활용하는지 이해할 수 있다.

---

## 본문

> The React Server Component Payload contains:
> 1. The rendered result of Server Components
> 2. Placeholders for where Client Components should be rendered
> 3. References to their JavaScript files
> 4. Any props passed from a Server Component to a Client Component

"RSC Payload에는 다음 4가지가 들어있다:
1. Server Component의 렌더링 결과물
2. Client Component가 렌더링되어야 하는 위치의 Placeholder
3. 해당 JavaScript 파일에 대한 참조
4. Server Component에서 Client Component로 전달된 모든 props"

각 항목 해설:

- **1. SC 결과물**: SC가 생성한 UI 트리 — `<header>`, `<nav>`, `<main>` 같은 HTML 구조와 콘텐츠.
- **2. Placeholder**: CC가 들어갈 자리를 표시. "여기에 `<UserMenu />`(CC)가 들어갈 것이다"라는 마커. 실제 CC 렌더링은 클라이언트가 담당한다.
- **3. References**: Placeholder에 대응하는 CC의 JavaScript 파일 경로 또는 chunk 참조. 클라이언트가 어떤 JS 번들을 로드해야 하는지 알 수 있다.
- **4. Props**: SC가 CC에 넘기는 serializable 데이터. 클라이언트에서 CC를 렌더링할 때 이 props를 사용한다.

```
RSC Payload 구조 예시

SC 결과물:
  <header>네비게이션 HTML</header>
  <main>
    [Placeholder: UserMenu CC]  ← 2. Placeholder
      └── ref: /chunks/UserMenu.js  ← 3. Reference
      └── props: { userId: 42 }      ← 4. Props
    <article>게시글 HTML 콘텐츠</article>
  </main>
```

---

## 종합

4가지 내용의 역할 분담이 명확하다. SC 결과물은 즉시 DOM에 반영할 수 있는 확정된 UI다. Placeholder와 Reference는 "이 자리에 이 CC를 넣어라"는 지시이며, Props는 CC가 렌더링될 때 필요한 데이터다. 클라이언트는 이 정보를 바탕으로 정확한 위치에 CC를 삽입하고 hydrate한다.

---

---

# 렌더링 작업은 왜 chunk로 split되는가?

## 도입

Next.js의 렌더링은 페이지 전체를 한 번에 처리하지 않는다. route segment와 Suspense boundary를 기준으로 chunk로 분리된다. 왜 이렇게 나누는가?

---

## 본문

> The rendering work is split into chunks: by individual routes segments and Suspense boundaries.

"렌더링 작업은 개별 route segment와 Suspense boundary를 기준으로 chunk로 분리된다."

> Each chunk is rendered in two steps:
> 1. React renders Server Components into the React Server Component Payload.
> 2. Next.js uses the RSC Payload and Client Component JavaScript instructions to render HTML on the server.

"각 chunk는 두 단계로 렌더링된다:
1. React가 Server Component를 RSC Payload로 렌더링한다.
2. Next.js가 RSC Payload와 Client Component JavaScript 지시를 사용해 서버에서 HTML을 렌더링한다."

> This means we don't have to wait for everything to render before caching the work or sending a response. Instead, we can stream a response as work is completed.

"이는 캐싱 작업이나 응답 전송 전에 모든 것이 렌더링될 때까지 기다릴 필요가 없다는 것을 의미한다. 대신, 작업이 완료되는 대로 응답을 스트리밍할 수 있다."

- **route segments**: Next.js 파일 시스템 기반의 라우트 구조. `/app/layout.tsx`, `/app/page.tsx` 각각이 하나의 segment다.
- **Suspense boundaries**: `<Suspense>` 컴포넌트가 만드는 경계. 각 boundary 안의 컴포넌트가 독립된 chunk가 된다.
- **streaming a response**: chunk가 완료될 때마다 클라이언트로 전송. 전체가 완료될 때까지 기다리지 않는다.

```
chunk 분리 기준

route segment 단위:           Suspense boundary 단위:
/layout.tsx  → chunk 1        <Layout>        → chunk 1
/page.tsx    → chunk 2          <Suspense>    → chunk 2 (독립)
                                  <SlowData/> → chunk 3 (독립)
```

---

## 종합

chunk 분리는 Streaming의 기반이다. 하나의 느린 Suspense boundary가 다른 chunk들의 전송을 막지 않는다. 빠른 chunk는 즉시 클라이언트로 전달되고, 느린 chunk는 준비되는 대로 스트리밍된다. 없으면 페이지 전체가 가장 느린 데이터 소스에 의해 블로킹된다.

---

---

# 왜 HTML로 바로 만들지 않고 RSC Payload를 거치는가?

## 도입

SSR이라면 SC를 바로 HTML로 변환하면 되지 않는가? 왜 RSC Payload라는 중간 형식을 만드는가?

---

## 본문

> This means we don't have to wait for everything to render before caching the work or sending a response. Instead, we can stream a response as work is completed.

"이는 캐싱 작업이나 응답 전송 전에 모든 것이 렌더링될 때까지 기다릴 필요가 없다는 것을 의미한다. 대신, 작업이 완료되는 대로 응답을 스트리밍할 수 있다."

RSC Payload가 필요한 핵심 이유는 두 가지다.

첫째, **Streaming 지원**. HTML은 완성된 문서 구조를 전제로 한다. 반면 RSC Payload는 chunk 단위로 전송 가능한 구조다. 각 chunk가 준비될 때마다 독립적으로 전달할 수 있다.

둘째, **클라이언트 reconcile**. HTML만 있으면 React가 기존 DOM과 새 UI를 비교(reconcile)할 수 없다. RSC Payload는 React 컴포넌트 트리 구조를 담고 있어 클라이언트 React가 기존 DOM을 파괴하지 않고 차이만 패치할 수 있다.

```
HTML만 사용할 경우의 문제점
  Streaming 불가 → 전체 완성 대기
  내비게이션 시 DOM 전체 교체 → 클라이언트 state 손실

RSC Payload 사용
  Streaming 가능 → chunk 준비 즉시 전송
  reconcile → 기존 DOM 유지하며 차이만 적용
  클라이언트 state(입력값, 스크롤 위치 등) 보존
```

---

## 종합

RSC Payload는 "서버에서 계산된 React 트리를 클라이언트 React가 이해할 수 있는 형태로 전달"하는 중간 포맷이다. HTML은 렌더링의 최종 출력이지만, RSC Payload는 렌더링에 필요한 구조 정보를 담아 클라이언트 React가 스마트하게 DOM을 업데이트할 수 있게 한다. 이 중간 형식 없이는 Streaming도, reconcile도, 클라이언트 state 보존도 불가능하다.

---

---

# Full Page Load에서 RSC Payload는 어떻게 사용되는가?

## 도입

첫 방문 시 RSC Payload가 생성된다. 이미 서버에서 HTML도 만들었는데, 클라이언트는 RSC Payload를 추가로 왜 사용하는가?

---

## 본문

> React renders Server Components into a special data format called the React Server Component Payload (RSC Payload), which includes references to Client Components.

"React는 Server Component를 RSC Payload라는 특수 데이터 형식으로 렌더링하며, 여기에 Client Component에 대한 참조가 포함된다."

> The React Server Components Payload is used to reconcile the Client and Server Component trees, and update the DOM.

"RSC Payload는 Client와 Server Component 트리를 reconcile하고 DOM을 업데이트하는 데 사용된다."

Full Page Load에서의 흐름:

```
서버                          클라이언트
────────────────────          ─────────────────────────────────
SC + CC → RSC Payload         1. HTML: 즉시 표시 (non-interactive)
RSC Payload + CC JS → HTML    2. RSC Payload: 클라이언트 트리와 reconcile
                              3. CC JS hydrate: interactive
```

- **reconcile**: 클라이언트가 받은 HTML(현재 DOM)과 RSC Payload(React가 만들어야 할 트리)를 비교하는 과정. 일치하면 그대로 두고, 차이가 있으면 업데이트한다. hydration 전에 발생한다.

왜 HTML이 있는데 RSC Payload도 필요한가? HTML은 사용자가 보는 화면을 위한 것이고, RSC Payload는 React 내부 트리 상태를 동기화하기 위한 것이다. 이 동기화 없이는 이후의 CC hydration과 클라이언트 사이드 상태 관리가 정합성을 잃는다.

---

## 종합

Full Page Load에서 RSC Payload의 역할은 "React 내부 상태를 초기화"하는 것이다. 사용자는 HTML로 즉시 내용을 보고, React는 RSC Payload로 자신의 fiber 트리를 구성한 뒤 CC를 hydrate한다. 이 두 단계가 조합되어야 사용자가 보는 화면과 React 내부 상태가 일치하는 interactive한 페이지가 완성된다.

---

---

# Subsequent Navigation에서 RSC Payload는 어떻게 사용되는가?

## 도입

링크 클릭으로 페이지를 이동하는 Subsequent Navigation에서는 서버 HTML이 없다. 이 경우 RSC Payload가 핵심 역할을 한다.

---

## 본문

> On subsequent navigations, Client Components are rendered entirely on the client. This means the Client Component JavaScript bundle is downloaded and parsed. Once the bundle is ready, React will use the RSC Payload to reconcile the Client and Server Component trees, and update the DOM.

"이후 내비게이션에서, Client Component는 완전히 클라이언트에서 렌더링된다. CC JavaScript 번들이 다운로드되고 파싱된다. 번들이 준비되면, React는 RSC Payload를 사용해 Client와 Server Component 트리를 reconcile하고 DOM을 업데이트한다."

> Next.js has an in-memory client-side router cache that stores the RSC payload of route segments, split by layouts, loading states, and pages.

"Next.js는 route segment의 RSC Payload를 저장하는 인메모리 클라이언트 사이드 라우터 캐시를 가지고 있으며, layout, loading state, page별로 분리되어 저장된다."

- **in-memory client-side router cache**: 브라우저 메모리에 저장되는 RSC Payload 캐시. 같은 경로를 다시 방문하면 서버 요청 없이 캐시에서 즉시 가져온다.
- **split by layouts, loading states, and pages**: layout, loading, page가 하나의 RSC Payload로 묶이는 게 아니라 각각 독립적으로 캐시된다. layout은 변경 없이 재사용하고 page만 새로 받는 방식이 가능하다.

```
Subsequent Navigation 흐름

이미 방문한 경로: 라우터 캐시 hit → RSC Payload 즉시 사용
처음 방문한 경로: 서버에서 RSC Payload 요청 → 클라이언트에서 reconcile

캐시 구조 (route: /dashboard)
  layout.tsx RSC Payload → 캐시 (재사용)
  page.tsx RSC Payload   → 캐시 (별도 관리)
```

---

## 종합

Subsequent Navigation에서 RSC Payload는 서버 HTML을 대체한다. 클라이언트 라우터가 RSC Payload를 받아 CC 번들과 결합하여 새 UI를 그린다. 라우터 캐시 덕분에 이미 방문한 경로는 서버 왕복 없이 즉시 전환되고, layout처럼 변하지 않는 부분은 RSC Payload를 재사용해 불필요한 서버 요청을 방지한다.

---

---

# RSC Payload가 가져온 변화는?

## 도입

Pages Router와 App Router의 근본적인 차이는 RSC Payload의 도입이다. 이전에는 페이지 단위로 UI와 데이터가 묶여 있었다. RSC Payload가 이 구조를 어떻게 바꿨는가?

---

## 본문

> In most websites, routes are not fully static or fully dynamic - it's a spectrum. For example, you can have an e-commerce page that uses cached product data that's revalidated at an interval, but also has uncached, personalized customer data.

"대부분의 웹사이트에서 라우트는 완전히 정적이거나 완전히 동적이지 않다 — 그것은 스펙트럼이다. 예를 들어, 일정 주기로 재검증되는 캐시된 상품 데이터와 캐시되지 않은 개인화된 고객 데이터를 모두 가진 이커머스 페이지를 가질 수 있다."

> In Next.js, you can have dynamically rendered routes that have both cached and uncached data. This is because the RSC Payload and data are cached separately.

"Next.js에서는 캐시된 데이터와 캐시되지 않은 데이터를 모두 가진 동적으로 렌더링되는 라우트를 가질 수 있다. 이는 RSC Payload와 데이터가 별도로 캐시되기 때문이다."

> This allows you to opt into dynamic rendering without worrying about the performance impact of fetching all the data at request time.

"이를 통해 요청 시마다 모든 데이터를 패칭하는 성능 영향을 걱정하지 않고 동적 렌더링을 선택할 수 있다."

- **cached separately**: UI(RSC Payload)와 데이터가 독립적으로 캐시된다. UI 캐시는 유지하면서 특정 데이터만 재패칭하거나, 반대로 데이터는 캐시하면서 UI만 갱신하는 전략이 가능하다.

```
Pages Router (묶인 캐시)
  getServerSideProps() 결과 = UI + Data → 한 덩어리로 캐시
  재방문 시: 전부 처음부터 다시 실행

App Router (분리된 캐시)
  RSC Payload (UI) ← 별도 캐시 (Full Route Cache)
  데이터 1 ← 별도 캐시 (Data Cache, 1시간 갱신)
  데이터 2 ← 캐시 없음 (매 요청마다 새로 패칭)
  
  → UI는 캐시에서, 데이터 2만 새로 받아 조합
```

---

## 종합

RSC Payload가 가져온 핵심 변화는 UI와 데이터의 캐시 독립성이다. Pages Router에서는 한 페이지의 UI와 데이터가 항상 함께 만들어졌다. App Router에서는 RSC Payload(UI)를 캐시하고 데이터만 선택적으로 재패칭하거나, 데이터를 캐시하고 RSC Payload만 새로 생성하는 세밀한 캐시 전략이 가능하다. 이것이 "정적도 동적도 아닌 스펙트럼"을 지원하는 기반이다.
