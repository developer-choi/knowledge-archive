# Partial Prerendering(PPR)이란 무엇인가?

## 도입

Partial Prerendering(PPR)은 한 라우트 안에서 정적 컴포넌트와 동적 컴포넌트를 함께 쓸 수 있게 해주는 렌더링 전략이다. 기존에는 라우트 단위로 "전부 정적" 또는 "전부 동적"을 선택해야 했지만, PPR은 같은 라우트 안에서 두 방식을 혼합한다. Next.js 14 기준 experimental 기능이다.

---

## 본문

> Partial Prerendering (PPR) enables you to combine static and dynamic components together in the same route.

"Partial Prerendering(PPR)은 같은 라우트 안에서 정적 컴포넌트와 동적 컴포넌트를 함께 결합할 수 있게 해준다."

- **static and dynamic components**: 정적 컴포넌트는 빌드 타임에 결과가 고정되는 것(상품 설명, 레이아웃 등), 동적 컴포넌트는 요청 시점의 데이터에 의존하는 것(사용자 장바구니, 알림 수 등)이다.

> PPR enables your Next.js server to immediately send prerendered content.

"PPR은 Next.js 서버가 사전 렌더링된 콘텐츠를 즉시 전송할 수 있게 해준다."

- **prerendered content**: 미리 렌더링되어 캐시에 저장된 정적 부분. 요청이 오면 이 부분은 기다림 없이 즉시 응답한다.

```
PPR 라우트 구조 예시 (/product/[id])

즉시 전송 (정적, prerendered)
├── 헤더/네비게이션
├── 상품 이미지
└── 상품 설명

스트리밍 (동적)
├── <Suspense fallback={<Spinner />}>
│   └── 사용자 리뷰 (로그인 사용자 기준 정렬)
└── <Suspense fallback={<Spinner />}>
    └── 장바구니 현황 (사용자별 개인화)
```

---

## 종합

PPR이 없으면 사용자 장바구니 같은 동적 요소 하나 때문에 라우트 전체가 동적이 되어 정적 콘텐츠도 매 요청마다 렌더링해야 했다. PPR은 정적 껍데기를 즉시 보내면서 동적 내용은 스트리밍으로 채워주는 방식으로 두 마리 토끼를 잡는다. TTFB(Time To First Byte)가 빨라지면서 동시에 개인화 콘텐츠도 제공할 수 있다.

---

# PPR은 빌드/요청 타임에 어떻게 동작하는가?

## 도입

PPR의 핵심은 빌드 타임에 최대한 정적으로 렌더링하고, 동적 코드가 있는 영역은 Suspense boundary로 감싸 분리하는 것이다. Suspense fallback이 prerendered HTML에 포함되어 즉시 표시된다.

---

## 본문

> - During the build, Next.js prerenders as much of the route as possible.
> - If dynamic code is detected, like reading from the incoming request, you can wrap the relevant component with a React Suspense boundary.
> - The Suspense boundary fallback will then be included in the prerendered HTML.

"- 빌드 중 Next.js는 라우트를 가능한 한 많이 사전 렌더링한다. - 들어오는 요청을 읽는 것처럼 동적 코드가 감지되면, 관련 컴포넌트를 React Suspense 경계로 감쌀 수 있다. - Suspense 경계의 fallback이 사전 렌더링된 HTML에 포함된다."

- **prerenders as much as possible**: 정적으로 처리할 수 있는 컴포넌트는 빌드 타임에 렌더링하여 Full Route Cache에 저장한다.
- **Suspense boundary**: `<Suspense fallback={...}>` 태그. PPR에서는 동적 영역의 경계를 명시적으로 선언하는 역할을 한다. 이 경계를 기준으로 정적 부분과 동적 부분이 분리된다.
- **fallback will be included in the prerendered HTML**: 사용자는 즉시 정적 콘텐츠 + Suspense fallback(스피너 등)을 본다. 동적 데이터가 준비되면 fallback 자리에 실제 콘텐츠가 교체된다.

```
빌드 타임 → 요청 타임 흐름

빌드 타임
├── 정적 콘텐츠 렌더링 → prerendered HTML 저장
└── 동적 영역 → Suspense fallback(로딩 UI)만 포함

요청 타임 (사용자 방문)
├── prerendered HTML 즉시 전송 (정적 + fallback UI)
└── 동적 컴포넌트 서버에서 렌더링 시작
    └── 준비되면 클라이언트로 스트리밍
```

---

## 종합

Suspense boundary가 없으면 PPR은 동작하지 않는다. 동적 컴포넌트를 감싸는 `<Suspense>`가 없으면 Next.js가 "이 영역은 정적, 저 영역은 동적"을 구분하지 못한다. 개발자가 Suspense 경계를 명시적으로 선언하는 것이 PPR의 전제 조건이다.

---

# PPR은 client-to-server waterfall을 어떻게 방지하는가?

## 도입

전통적인 CSR 방식에서는 클라이언트가 JS를 모두 받은 뒤에야 서버에 데이터를 요청할 수 있다 — 이것이 client-to-server waterfall이다. PPR은 동적 컴포넌트를 클라이언트 JS 로딩과 병렬로 서버에서 스트리밍하여 이 순차적 대기를 없앤다.

---

## 본문

> To prevent client to server waterfalls, dynamic components begin streaming from the server **in parallel** while serving the initial prerender. This ensures dynamic components can begin rendering before client JavaScript has been loaded in the browser.

"클라이언트-서버 waterfall을 방지하기 위해, 동적 컴포넌트는 초기 prerender를 서빙하는 동안 서버에서 **병렬로** 스트리밍을 시작한다. 이는 동적 컴포넌트가 브라우저에 클라이언트 JavaScript가 로딩되기 전에 렌더링을 시작할 수 있음을 보장한다."

- **client to server waterfalls**: 클라이언트가 JS를 받고 실행한 후에야 "API 호출 → 서버 응답 대기 → 렌더링"이 시작되는 순차적 지연. CSR에서 흔하게 발생한다.
- **streaming from the server in parallel**: 정적 prerender HTML을 전송하는 동시에, 서버에서 동적 컴포넌트 렌더링도 시작한다. 두 작업이 병렬로 진행된다.
- **initial prerender**: 빌드 타임에 만들어둔 정적 HTML. 요청이 오자마자 이것부터 전송한다.

```
PPR waterfall 방지 타임라인

CSR (waterfall 발생)
0ms   요청 도착
      HTML 응답 (빈 껍데기)
100ms JS 번들 로딩 완료
      API 요청 시작
300ms API 응답 도착
      렌더링 완료

PPR (waterfall 없음)
0ms   요청 도착
      prerendered HTML + fallback UI 즉시 전송
0ms~  동적 컴포넌트 서버에서 병렬 스트리밍 시작
      (JS 로딩을 기다리지 않음)
50ms  동적 컴포넌트 스트리밍 완료
```

---

## 종합

PPR의 핵심 가치는 "정적 부분의 즉각적 표시 + 동적 부분의 병렬 처리"다. 사용자는 빈 화면 대신 레이아웃과 정적 콘텐츠를 즉시 보고, 동적 데이터는 스피너 자리에 채워진다. 클라이언트 JS가 아직 로딩 중이어도 서버는 이미 동적 컴포넌트 렌더링을 시작한 상태라 JS 로딩이 끝나자마자 또는 그 이전에 동적 콘텐츠가 표시될 수 있다.

---

# PPR은 dynamic component마다 별도 HTTP 요청을 만드는가?

## 도입

동적 컴포넌트가 여러 개라면 각각에 대해 별도 HTTP 요청이 생기지 않을까 우려할 수 있다. PPR은 모든 동적 컴포넌트를 단일 HTTP 응답에 스트리밍하여 이 문제를 해결한다.

---

## 본문

> To prevent creating many HTTP requests for each dynamic component, PPR is able to combine the static prerender and dynamic components together into a single HTTP request. This ensures there are not multiple network roundtrips needed for each dynamic component.

"각 동적 컴포넌트마다 많은 HTTP 요청이 생기는 것을 방지하기 위해, PPR은 정적 prerender와 동적 컴포넌트를 단일 HTTP 요청으로 합칠 수 있다. 이는 각 동적 컴포넌트마다 여러 네트워크 왕복이 필요하지 않음을 보장한다."

- **single HTTP request**: PPR은 HTTP chunked transfer encoding 또는 streaming을 활용하여 하나의 HTTP 연결에서 정적 prerender를 먼저 내보내고, 동적 컴포넌트가 준비될 때마다 같은 연결로 이어서 전송한다.
- **network roundtrips**: 클라이언트-서버 간 왕복 횟수. 동적 컴포넌트가 3개라고 해서 HTTP 요청이 3개가 되지 않는다. 단일 스트리밍 응답 안에서 순차적으로 전달된다.

```
단일 HTTP 스트리밍 응답 구조

HTTP/1.1 200 OK
Transfer-Encoding: chunked

[chunk 1] 정적 prerender HTML (즉시)
[chunk 2] 동적 컴포넌트 A RSC payload (준비되면)
[chunk 3] 동적 컴포넌트 B RSC payload (준비되면)
[chunk 4] ...
[connection close]
```

---

## 종합

PPR이 없으면 동적 컴포넌트마다 클라이언트가 API를 별도 호출해야 할 수도 있다. PPR은 서버가 하나의 스트리밍 응답으로 정적+동적 내용을 모두 전달하므로 네트워크 왕복 비용이 최소화된다. 동적 컴포넌트 10개가 있어도 HTTP 연결은 하나다. 이것이 PPR이 CSR 기반 waterfall 대비 네트워크 비용 면에서도 유리한 이유다.
