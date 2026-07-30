# Next.js는 서버에서 렌더링 작업을 어떤 단위로 쪼개는가?

## 도입

Next.js의 렌더링은 페이지 전체를 한 번에 처리하지 않는다. 작은 덩어리(chunk)로 나누어 처리한다. 무엇을 기준으로 나누는지, 그리고 왜 나누는지를 본다.

---
## 본문

> On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks, by individual route segments (layouts and pages):

"서버에서 Next.js는 React의 API를 써서 렌더링을 지휘한다. 렌더링 작업은 개별 route segment(layout과 page)를 기준으로 덩어리로 쪼개진다."

- **orchestrate**: 여러 조각의 렌더링을 순서와 타이밍을 맞춰 지휘한다는 뜻이다. Next.js가 직접 그리는 게 아니라 React에게 시키고 조율한다.
- **route segments**: Next.js 파일 시스템 기반의 라우트 구조. `/app/layout.tsx`, `/app/page.tsx` 각각이 하나의 segment다.

> - Server Components are rendered into a special data format called the React Server Component Payload (RSC Payload).
> - Client Components and the RSC Payload are used to prerender HTML.

"Server Component는 RSC Payload라는 특수한 데이터 형식으로 렌더링된다. Client Component와 RSC Payload가 HTML을 미리 만드는 데 쓰인다."

- **prerender**: 브라우저가 요청하기 전에 서버가 미리 HTML을 만들어 둔다는 뜻이다.

쪼개는 이유는 스트리밍이다. 덩어리마다 준비가 끝나는 대로 먼저 내려보낼 수 있어, 화면 전체가 가장 느린 부분에 발이 묶이지 않는다.

### route segment와 Suspense 경계는 층이 다르다

문서에 따라 route segment만 나오기도 하고 `<Suspense>` 경계가 함께 나오기도 해서 서로 다른 답처럼 보이지만, 둘은 같은 층위를 두고 겨루는 기준이 아니다. 위에 인용한 문장이 말하는 route segment는 **서버가 렌더링 작업을 나누는 단위**이고, `<Suspense>` 경계는 **완성된 HTML을 흘려보내는 단위**다.

```
두 기준이 사는 층

렌더링 작업 분할        route segment (layout·page)
전송(스트리밍) 분할     <Suspense> 경계
```

즉 route segment 단위로 나뉜 작업이 서버에서 돌고, 그 결과 HTML은 `<Suspense>` 경계에 맞춰 잘려 나간다. 하나를 고르는 문제가 아니라 둘 다 동시에 성립한다. 전송 쪽 기준은 스트리밍 문서가 따로 다룬다 — [../streaming/overview.md](../streaming/overview.md)의 「서버는 HTML을 어떤 기준으로 조각내는가?」.

```
chunk 분리 기준

route segment 단위:           Suspense boundary 단위:
/layout.tsx  → chunk 1        <Layout>        → chunk 1
/page.tsx    → chunk 2          <Suspense>    → chunk 2 (독립)
                                  <SlowData/> → chunk 3 (독립)
```

---
## 종합

덩어리 분리는 Streaming의 기반이다. 화면 하나를 통째로 만들어 한 번에 보내는 대신, 준비된 부분부터 차례로 내려보낼 수 있게 된다. 없으면 페이지 전체가 가장 느린 데이터 소스에 의해 막힌다. route segment는 서버가 일을 나누는 기준이고 Suspense 경계는 그 결과를 잘라 보내는 기준이라, 둘은 겹쳐 놓고 봐야 전체 그림이 된다.

---

# Server Component에서 렌더링된 결과물은 서버에서 브라우저에게 HTML 형태로 전달되는가?

## 도입

Server Component가 렌더링된 결과물은 HTML도, JSON도 아닌 별도의 포맷으로 전달된다. 이 포맷이 RSC Payload다. 왜 HTML 대신 이 중간 형식을 거치는지, 그리고 어떤 정보가 담겨 있는지가 Next.js App Router를 이해하는 핵심이다.

---
## 본문

> The RSC Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM.

"RSC Payload는 렌더링된 React Server Component 트리를 작게 압축한 바이너리 표현이다. 클라이언트의 React가 브라우저 DOM을 갱신하는 데 이것을 사용한다."

- **compact**: 크기가 작게 압축된 형태. 네트워크 전송 효율을 높이기 위해 최소화된다.
- **binary representation**: 텍스트 기반의 HTML이나 JSON이 아닌 바이너리 형식. React가 파싱하기 최적화된 구조다.
- **rendered React Server Components tree**: SC가 실행된 결과가 HTML 태그가 아니라 React 컴포넌트 트리 구조로 인코딩된다는 뜻이다. 화면을 이루는 컴포넌트들의 부모-자식 관계까지 담기므로, 결과 화면만이 아니라 "무엇이 무엇 안에 들어 있는지"가 남아 있다.
- **update the browser's DOM**: 새 화면으로 통째로 바꾸는 게 아니라, 이미 떠 있는 DOM을 손본다는 뜻이다. 이게 가능하려면 구조 정보가 필요하고, 그래서 HTML이 아니라 이 형식이 쓰인다.

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

RSC Payload는 SC와 CC 사이를 연결하는 교환 형식이다. SC의 렌더링 결과를 클라이언트가 이해할 수 있는 구조로 인코딩하여 전송하고, 클라이언트는 이를 받아 DOM과 대조한다. HTML보다 구조화되어 있어 React가 기존 DOM을 파괴하지 않고 차이만 적용할 수 있다.

---

# RSC Payload에는 무엇이 들어 있는가?

## 도입

RSC Payload가 "SC 렌더링 결과물"이라는 건 알겠는데, 정확히 어떤 정보가 담겨 있는지를 알아야 첫 로드와 이후 화면 이동에서 클라이언트가 이것을 어떻게 활용하는지 이해할 수 있다.

---
## 본문

> The RSC Payload contains:
> - The rendered result of Server Components
> - Placeholders for where Client Components should be rendered and references to their JavaScript files
> - Any props passed from a Server Component to a Client Component

"RSC Payload에는 다음이 들어 있다: Server Component의 렌더링 결과물, Client Component가 렌더링되어야 할 자리 표시와 그 JavaScript 파일에 대한 참조, 그리고 Server Component에서 Client Component로 전달된 모든 props."

문서에 따라 이 목록이 네 항목으로 적히기도 한다. "자리 표시"와 "그 자리에 넣을 파일 위치"를 따로 세느냐 한 항목으로 묶느냐의 차이일 뿐이다. 그러니 항목이 몇 개인지를 외울 필요는 없다. 무엇이 왜 담기는지가 요점이다.

- **rendered result of Server Components**: SC가 만들어 낸 화면 조각. 서버에서 이미 확정되어 클라이언트가 더 계산할 게 없는 부분이다.
- **Placeholders**: CC가 들어갈 자리를 표시한 것. "여기에 `<UserMenu />`가 들어갈 것이다"라는 표시다. SC는 CC를 대신 실행해 줄 수 없으니, 자리만 비워 두고 실제 그리기는 클라이언트에 맡긴다.
- **references to their JavaScript files**: 그 자리에 넣을 CC의 JavaScript 파일 경로. 이게 없으면 브라우저는 자리는 알아도 무슨 코드를 받아 와야 하는지 모른다.
- **props**: SC가 CC에 넘긴 값. CC는 클라이언트에서 실행되므로, 서버가 알고 있던 값을 이렇게 함께 실어 보내지 않으면 CC가 빈손으로 그려진다.

```
RSC Payload 구조 예시

SC 결과물:
  <header>네비게이션 HTML</header>
  <main>
    [자리 표시: UserMenu CC]
      └── 파일 위치: /chunks/UserMenu.js
      └── props: { userId: 42 }
    <article>게시글 HTML 콘텐츠</article>
  </main>
```

---
## 종합

담긴 것들의 역할 분담이 명확하다. SC 결과물은 즉시 DOM에 반영할 수 있는 확정된 화면이다. 자리 표시와 파일 위치는 "이 자리에 이 CC를 넣어라"는 지시이며, props는 CC가 그려질 때 필요한 데이터다. 클라이언트는 이 정보를 바탕으로 정확한 위치에 CC를 삽입하고 이벤트를 붙인다. 문서 버전에 따라 항목을 셋으로 적기도 넷으로 적기도 하는데, 나뉘는 방식만 다를 뿐 담기는 내용은 같다.

---

# 왜 HTML로 바로 만들지 않고 RSC Payload를 거치는가?

## 도입

SSR이라면 SC를 바로 HTML로 변환하면 되지 않는가? 왜 RSC Payload라는 중간 형식을 만드는가?

---
## 본문

> This means we don't have to wait for everything to render before caching the work or sending a response. Instead, we can stream a response as work is completed.

"이는 캐싱 작업이나 응답 전송 전에 모든 것이 렌더링될 때까지 기다릴 필요가 없다는 것을 의미한다. 대신, 작업이 완료되는 대로 응답을 스트리밍할 수 있다."

RSC Payload가 필요한 핵심 이유는 두 가지다.

첫째, **Streaming 지원**. HTML은 완성된 문서 구조를 전제로 한다. 반면 RSC Payload는 덩어리 단위로 전송 가능한 구조다. 각 덩어리가 준비될 때마다 독립적으로 전달할 수 있다.

둘째, **클라이언트에서의 대조**. HTML만 있으면 React가 기존 DOM과 새 화면을 비교할 수 없다. RSC Payload는 React 컴포넌트 트리 구조를 담고 있어 클라이언트 React가 기존 DOM을 파괴하지 않고 차이만 패치할 수 있다.

```
HTML만 사용할 경우의 문제점
  Streaming 불가 → 전체 완성 대기
  화면 이동 시 DOM 전체 교체 → 클라이언트 state 손실

RSC Payload 사용
  Streaming 가능 → 덩어리 준비 즉시 전송
  대조 → 기존 DOM 유지하며 차이만 적용
  클라이언트 state(입력값, 스크롤 위치 등) 보존
```

---
## 종합

RSC Payload는 "서버에서 계산된 React 트리를 클라이언트 React가 이해할 수 있는 형태로 전달"하는 중간 포맷이다. HTML은 렌더링의 최종 출력이지만, RSC Payload는 렌더링에 필요한 구조 정보를 담아 클라이언트 React가 스마트하게 DOM을 업데이트할 수 있게 한다. 이 중간 형식 없이는 Streaming도, 대조도, 클라이언트 state 보존도 불가능하다.

---

# RSC Payload와 데이터가 따로 캐시되면 무엇이 가능해지는가?

## 도입

한 페이지를 통째로 "정적이냐 동적이냐"로 가르면, 개인화된 정보 한 줄 때문에 페이지 전체를 매번 새로 만들어야 한다. Next.js는 화면(RSC Payload)과 데이터를 서로 다른 캐시에 넣어 이 양자택일을 없앴다.

---

## 본문

> In most websites, routes are not fully static or fully dynamic - it's a spectrum. For example, you can have an e-commerce page that uses cached product data that's revalidated at an interval, but also has uncached, personalized customer data.

"대부분의 웹사이트에서 라우트는 완전히 정적이거나 완전히 동적이지 않다 — 그것은 스펙트럼이다. 예를 들어, 일정 주기로 재검증되는 캐시된 상품 데이터와 캐시되지 않은 개인화된 고객 데이터를 모두 가진 이커머스 페이지를 가질 수 있다."

- **spectrum**: 정적/동적이 두 칸짜리 스위치가 아니라 눈금이 여럿인 자라는 뜻.

> In Next.js, you can have dynamically rendered routes that have both cached and uncached data. This is because the RSC Payload and data are cached separately.

"Next.js에서는 캐시된 데이터와 캐시되지 않은 데이터를 모두 가진 동적으로 렌더링되는 라우트를 가질 수 있다. 이는 RSC Payload와 데이터가 별도로 캐시되기 때문이다."

- **cached separately**: 화면(RSC Payload)과 데이터가 각자의 캐시에 들어간다. 화면은 캐시에서 꺼내 쓰면서 특정 데이터만 새로 받아오는 조합이 성립한다.

> This allows you to opt into dynamic rendering without worrying about the performance impact of fetching all the data at request time.

"이를 통해 요청 시마다 모든 데이터를 패칭하는 성능 영향을 걱정하지 않고 동적 렌더링을 선택할 수 있다."

```
Pages Router (묶인 캐시)
  getServerSideProps() 결과 = UI + Data → 한 덩어리
  재방문 시: 전부 처음부터 다시 실행

App Router (분리된 캐시)
  RSC Payload (UI) ← 별도 캐시
  데이터 1 ← 별도 캐시 (예: 1시간 갱신)
  데이터 2 ← 캐시 없음 (매 요청마다 새로)

  → UI는 캐시에서, 데이터 2만 새로 받아 조합
```

### 사용자 답변 — Pages Router와 무엇이 달라졌나

Pages Router 시절에는 페이지에 UI와 Data가 합쳐진 상태였다 — 따로 따로 캐싱이 되지 않았다.

다른 페이지에 갔다 돌아오면 `getServerSideProps()` 실행부터 UI 그리기까지 전부 다 처음부터 새로 해야 했다.

App Router에서는 UI(RSC Payload) 따로, Data Cache도 API별로 따로 따로 캐싱이 가능하다.

그래서 UI는 그대로 쓰면서 데이터만 최신화하는 식의 운영이 가능해진다.

---

## 종합

RSC Payload가 가져온 핵심 변화는 화면과 데이터의 캐시 독립성이다. 이 분리가 없으면 개인화된 항목 하나 때문에 페이지 전체가 매 요청 새로 만들어진다. 분리가 있으면 "동적 라우트"라고 이름 붙은 페이지도 대부분의 재료를 캐시에서 꺼내 쓴다 — 동적이라는 말이 곧 느리다는 뜻이 아닌 이유다.

---

# 첫 로드에서 HTML·RSC Payload·JavaScript는 각각 어디에 쓰이는가?

## 도입

사용자가 주소를 치고 처음 들어올 때, 서버는 HTML과 RSC Payload를 만들어 보내고 브라우저는 여기에 JavaScript 번들까지 받는다. 세 가지가 모두 오는데 각각 하는 일이 다르다. 이미 화면이 될 HTML이 있는데 RSC Payload까지 왜 필요한지가 특히 헷갈리는 지점이다.

---
## 본문

서버가 먼저 하는 일은 앞에서 본 그대로다. Server Component를 RSC Payload로 만들고, 그 RSC Payload와 Client Component의 JavaScript를 재료로 HTML을 만든다. 순서에 주목할 만하다 — HTML이 먼저 나오고 RSC Payload가 따라오는 게 아니라, RSC Payload가 HTML의 재료다.

이름이 Client Component인데도 첫 방문 때는 서버에서도 한 번 실행된다. 초기 HTML을 만들어야 하기 때문이다. 덕분에 사용자는 Client Component 번들을 내려받고 해석하기를 기다리지 않고도 화면을 바로 볼 수 있다.

**클라이언트에서 일어나는 일:**

> Then, on the client:
> 1. **HTML** is used to immediately show a fast non-interactive preview of the route to the user.
> 2. **RSC Payload** is used to reconcile the Client and Server Component trees.
> 3. **JavaScript** is used to hydrate Client Components and make the application interactive.

"그다음 클라이언트에서:
1. HTML은 사용자에게 빠르고 아직 눌리지 않는 미리보기를 즉시 보여주는 데 쓰인다.
2. RSC Payload는 Client와 Server Component 트리를 서로 맞춰 보는 데 쓰인다.
3. JavaScript는 Client Component에 이벤트를 붙여 애플리케이션을 눌리게 만드는 데 쓰인다."

- **reconcile**: 두 트리를 나란히 놓고 대조한다는 뜻이다. 여기서 두 트리란 브라우저에 이미 그려진 화면과, RSC Payload가 말하는 "이렇게 생겨야 한다"는 구조다. 같으면 그대로 두고 다르면 그 부분만 고친다.
- **non-interactive**: 보이기는 하지만 아직 눌리지 않는 상태. 이벤트를 붙이기 전이라 버튼을 눌러도 반응이 없다.
- **hydrate**: 이미 있는 HTML에 이벤트 핸들러를 붙이는 과정. 바로 다음 질문에서 따로 다룬다.

```
첫 로드 흐름

서버                              브라우저
────────────────────────          ──────────────────────────────────
SC → RSC Payload                  HTML: 즉시 표시 (아직 안 눌림)
RSC Payload + CC JS → HTML        RSC Payload: 화면과 트리를 대조
                                  CC JS: 이벤트 붙이기 → 눌리는 화면
```

HTML이 있는데 RSC Payload도 필요한 이유는 역할이 다르기 때문이다. HTML은 사용자 눈에 보이는 화면을 위한 것이고, RSC Payload는 React가 내부적으로 들고 있어야 할 트리 구조를 위한 것이다. React가 자기 트리를 갖추지 못하면 이후 상태 변화나 화면 갱신을 어디에 반영해야 할지 알 수 없다.

---
## 종합

첫 로드에서 세 가지는 순서대로 이어진다. HTML이 눈에 보이는 화면을 즉시 채우고, RSC Payload가 React 내부 트리를 그 화면에 맞춰 세우고, JavaScript가 이벤트를 붙여 화면을 눌리게 만든다. 서버가 Client Component까지 미리 실행하는 이유도 첫 단계 때문이다 — 번들이 도착하기 전에 보여줄 화면이 필요하다. 세 단계 중 하나라도 빠지면 화면이 늦게 뜨거나, 떠도 눌리지 않거나, React가 이후 갱신을 반영하지 못하게 된다.

---

# 첫 로드 이후의 화면 이동은 무엇이 달라지는가?

## 도입

첫 방문에서는 서버가 HTML까지 만들어 보냈다. 그 뒤 링크를 눌러 다른 화면으로 이동할 때는 사정이 달라진다. 서버가 만든 HTML이 없고, 대신 RSC Payload와 클라이언트 쪽 캐시가 그 자리를 메운다.

---
## 본문

> On subsequent navigations:
> - The **RSC Payload** is prefetched and cached for instant navigation.
> - **Client Components** are rendered entirely on the client, without the server-rendered HTML.

"이후 화면 이동에서: RSC Payload는 즉각적인 이동을 위해 미리 받아 두고 캐시된다. Client Component는 서버가 만든 HTML 없이 전부 클라이언트에서 그려진다."

- **prefetched**: 사용자가 링크를 누르기 전에 미리 받아 둔다는 뜻이다. 화면에 보이는 링크의 목적지를 Next.js가 앞서 요청해 둔다.
- **instant navigation**: 눌렀을 때 기다림 없이 바로 바뀌는 이동. 이미 받아 둔 것이 있으니 서버 왕복이 필요 없다.
- **entirely on the client**: 두 번째 이동부터는 서버가 HTML을 만들어 주지 않고 브라우저의 JavaScript가 직접 화면을 그린다. Client Component가 서버에서 다시 실행되지 않는다.

첫 방문에서는 Client Component가 서버에서도 실행됐지만(초기 HTML을 만들어야 하니까), 이후 이동에서는 그 과정이 사라진다. 사용자가 직접 확인한 실험 기록: https://github.com/developer-choi/test-playground/commit/12b964918dfd3c652504a8df1a50f7548d0e9658

서버가 HTML을 만들지 않을 뿐, Server Component는 여전히 서버에서 실행된다. 그 결과물인 RSC Payload가 브라우저로 오고, 브라우저는 이것과 CC 번들을 합쳐 새 화면을 그린다.

```
첫 로드 vs 이후 화면 이동

첫 로드                              이후 화면 이동
──────────────────────────────      ────────────────────────────────
서버: SC → RSC Payload              서버: SC만 실행 → RSC Payload
      RSC Payload + CC JS → HTML          (HTML 없음)
브라우저: HTML 즉시 표시             브라우저: CC 번들로 직접 그림
          → 대조 → 이벤트 붙이기               → RSC Payload로 대조
```

---
## 종합

첫 로드 이후의 이동은 서버 HTML이 빠지고 그 자리를 RSC Payload가 대신한다. 브라우저는 CC 번들로 화면을 직접 그린 뒤 RSC Payload와 대조해 DOM을 맞춘다. 속도를 만드는 장치는 미리 받아 두기다 — 링크를 누르기 전에 그 목적지의 RSC Payload를 앞서 받아 캐시해 두므로, 눌렀을 때 서버 왕복을 기다릴 일이 없다. 서버가 화면 하나를 통째로 다시 만들어 내려보내는 방식이었다면 이동할 때마다 왕복을 기다려야 했을 것이다.

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
- **seamlessly merges**: RSC Payload를 받아 기존 DOM과 대조. 변경된 SC 부분만 DOM에 패치하고, CC의 DOM 노드는 건드리지 않는다.
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

RSC 재렌더링이 client state를 보존하는 비결은 대조다. SC 부분만 새 RSC Payload로 교체하고, CC 노드는 기존 상태를 유지한 채 그 자리에 남긴다. 이 덕분에 Server Action이 SC를 서버에서 다시 실행하더라도 사용자가 입력 중인 폼, 선택한 옵션, 스크롤 위치 등이 초기화되지 않는다.
