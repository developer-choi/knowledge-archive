# Streaming이란 무엇인가?

## 도입

전통적인 SSR은 서버가 페이지 전체를 렌더링 완료한 뒤에야 HTML을 클라이언트로 보낸다. 데이터 요청 중 하나가 느리면 전체가 블로킹된다. Streaming은 이 "전부 아니면 전무" 모델을 깨고, 준비된 부분부터 점진적으로 클라이언트에 전달한다.

---

## 본문

> Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready.

"Streaming은 라우트를 더 작은 '청크'로 분해하고, 준비되는 대로 서버에서 클라이언트로 점진적으로 스트리밍하는 데이터 전송 기법이다."

- **data transfer technique**: 렌더링 알고리즘이 아니라 데이터 전송 방식이다. 서버-클라이언트 간 HTTP 연결을 유지하면서 데이터를 여러 번에 나눠 보낸다.
- **chunks**: 라우트를 쪼갠 단위. Next.js에서는 route segment와 Suspense boundary가 chunk 경계가 된다.
- **progressively**: 전체가 완료될 때까지 기다리지 않는다. 빠른 컴포넌트부터 먼저 도착하고, 느린 컴포넌트는 나중에 합류한다.

> Streaming works well with React's component model, as each component can be considered a chunk.

"Streaming은 각 컴포넌트가 청크로 간주될 수 있기 때문에 React의 컴포넌트 모델과 잘 맞는다."

```
기존 SSR (블로킹)
서버 [=== 느린 API 대기 ===] [=렌더링=] → HTML 전송 (늦게 시작)

Streaming
서버 [Header 완료] → 즉시 전송
     [NavBar 완료] → 즉시 전송
     [=== 느린 API 대기 ===] [Feed 완료] → 준비되면 전송
```

---

## 종합

Streaming은 React 컴포넌트 단위로 HTML을 분할 전송하는 방식이다. 사용자는 느린 API가 완료되기를 기다리는 동안에도 이미 준비된 헤더, 내비게이션, 레이아웃을 볼 수 있다. 이 기능이 없으면 단 하나의 느린 데이터 소스가 페이지 전체의 TTFB를 끌어올린다.

---

# Streaming은 어떤 문제들을 해결하는가?

## 도입

Streaming이 해결하는 문제를 이해하려면 Streaming이 없을 때 어떤 일이 벌어지는지를 먼저 봐야 한다. 전통적인 SSR의 두 가지 핵심 병목이 있는데, Streaming은 이 둘을 각각 다른 방식으로 해결한다.

---

## 본문

> By streaming, you can prevent slow data requests from blocking your whole page. This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user.

"Streaming으로 느린 데이터 요청이 페이지 전체를 블로킹하는 것을 방지할 수 있다. 이를 통해 사용자는 모든 데이터가 로드되기 전에 페이지의 일부를 보고 상호작용할 수 있다."

- **blocking**: 하나의 느린 데이터 요청이 완료될 때까지 다른 모든 UI가 표시되지 않는 상태. Streaming은 느린 컴포넌트를 Suspense boundary로 분리해 나머지 UI가 먼저 도달하도록 한다.

> To prevent client to server waterfalls, dynamic components begin streaming from the server in parallel while serving the initial prerender. This ensures dynamic components can begin rendering before client JavaScript has been loaded in the browser.

"클라이언트-서버 워터폴을 방지하기 위해, 동적 컴포넌트는 초기 prerender를 제공하는 동안 서버에서 병렬로 스트리밍을 시작한다. 이를 통해 동적 컴포넌트는 클라이언트 JavaScript가 브라우저에 로드되기 전에 렌더링을 시작할 수 있다."

- **waterfall**: A가 완료된 뒤에야 B가 시작될 수 있는 순차적 의존 구조. 기존에는 SSR이 완료되어야 CSR이 시작될 수 있었다.
- **in parallel**: SSR이 진행 중인 동안 동적 컴포넌트도 동시에 시작된다. 이전에는 SSR 완료 → 클라이언트 JS 로드 → CSR 데이터 요청 순서였다.

```
기존 SSR + CSR 혼합 모델
[SSR 완료] → [JS 번들 로드] → [CSR 데이터 요청] → [화면 갱신]
                  ↑ waterfall: 각 단계가 이전 단계 완료에 의존

Streaming 모델
[SSR 시작] ──┬── [정적 부분 스트리밍] → 클라이언트 도착
             └── [동적 부분 병렬 처리] → 준비되면 스트리밍
                        ↑ SSR과 클라이언트 작업이 겹친다
```

---

## 종합

Streaming이 해결하는 두 병목은 서로 다른 방향이다. 첫째는 "하나의 느린 서버 렌더링이 전체 HTML 전송을 막는" 문제이고, 둘째는 "SSR이 완료되어야 CSR이 시작되는 워터폴" 문제다. 두 문제 모두 Streaming과 Suspense의 조합으로 해소된다. 없으면 느린 API가 있을 때마다 전체 페이지 로딩이 지연되고, SSR/CSR 혼합 구조에서 불필요한 대기가 쌓인다.

---

# Streaming이 개선하는 성능 지표는?

## 도입

Streaming이 "빠르다"는 건 알겠는데, 어떤 측면에서 빠른지를 구체적인 성능 지표로 짚어야 실제 효과를 측정하고 소통할 수 있다.

---

## 본문

> Streaming is particularly beneficial when you want to prevent long data requests from blocking the page from rendering as it can reduce the Time To First Byte (TTFB) and First Contentful Paint (FCP).

"Streaming은 TTFB와 FCP를 줄임으로써, 긴 데이터 요청이 페이지 렌더링을 블로킹하는 것을 방지하는 데 특히 유용하다."

> It also helps improve Time to Interactive (TTI), especially on slower devices.

"또한 특히 느린 기기에서 TTI 개선에도 도움이 된다."

- **TTFB (Time To First Byte)**: 브라우저가 서버에 요청을 보낸 뒤 첫 바이트를 받기까지의 시간. Streaming은 전체 렌더링을 기다리지 않고 준비된 부분부터 전송하므로 TTFB가 개선된다.
- **FCP (First Contentful Paint)**: 화면에 텍스트, 이미지 등 첫 콘텐츠가 그려지는 시점. 빠른 컴포넌트가 먼저 도달하므로 사용자가 더 빨리 무언가를 본다.
- **TTI (Time to Interactive)**: 페이지가 사용자 입력에 응답할 수 있게 되는 시점. Selective Hydration과 함께 사용자가 먼저 상호작용할 컴포넌트부터 hydrate해 개선된다.

```
지표별 Streaming 효과

TTFB  ─── 전체 대기 없이 첫 청크 즉시 전송 → 단축
FCP   ─── 빠른 컴포넌트 먼저 도착 → 단축
TTI   ─── Selective Hydration으로 중요 컴포넌트 먼저 interactive → 단축
```

---

## 종합

세 지표 모두 "기다리는 시간"을 줄이는 방향으로 개선된다. TTFB는 서버가 데이터를 준비하는 시간, FCP는 사용자가 뭔가를 보기까지의 시간, TTI는 사용자가 클릭할 수 있기까지의 시간이다. Streaming 없이 모든 데이터가 준비될 때까지 기다리면 세 지표 모두 가장 느린 데이터 소스에 의해 결정된다.

---

# Suspense를 사용하면 얻는 두 가지 이점은?

## 도입

Next.js에서 Streaming을 구현할 때 Suspense가 핵심 도구가 된다. Suspense를 쓰면 단순히 로딩 UI를 보여주는 것 이상의 두 가지 기술적 이점이 생긴다.

---

## 본문

> By using Suspense, you get the benefits of:
> 1. Streaming Server Rendering - Progressively rendering HTML from the server to the client.
> 2. Selective Hydration - React prioritizes what components to make interactive first based on user interaction.

"Suspense를 사용하면 다음 두 가지 이점을 얻는다:
1. Streaming Server Rendering — 서버에서 클라이언트로 HTML을 점진적으로 렌더링한다.
2. Selective Hydration — React는 사용자 상호작용을 기반으로 먼저 interactive하게 만들 컴포넌트를 우선순위화한다."

```tsx
export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

- **Streaming Server Rendering**: Suspense boundary가 chunk 경계를 정의한다. `<PostFeed />`와 `<Weather />`가 각각 독립된 청크로 스트리밍된다.
- **Selective Hydration**: 두 컴포넌트의 데이터가 동시에 도착해도, 사용자가 `<PostFeed />`를 클릭하려 한다면 React는 `<PostFeed />`를 먼저 hydrate한다.

```
Selective Hydration 흐름

PostFeed 도착 ─┐
Weather 도착  ─┤→ React: 사용자가 PostFeed 클릭 시도 감지
                    ↓
              PostFeed 먼저 hydrate (interactive)
                    ↓
              Weather hydrate (나중에)
```

---

## 종합

Suspense의 두 이점은 서로를 강화한다. Streaming으로 빠른 컴포넌트가 먼저 도착하고, Selective Hydration으로 사용자가 실제로 상호작용하는 컴포넌트가 먼저 hydrate된다. 결과적으로 무거운 컴포넌트가 있어도 페이지 전체의 체감 성능이 개선된다.

---

# Next.js에서 Streaming을 구현하는 두 가지 방법은?

## 도입

Next.js는 Streaming 구현을 위한 두 가지 API를 제공한다. 하나는 페이지 레벨, 다른 하나는 컴포넌트 레벨이다. 두 방법 모두 내부적으로 Suspense 위에서 동작한다.

---

## 본문

> There are two ways you implement streaming in Next.js:
> 1. At the page level, with the loading.tsx file.
> 2. For specific components, with `<Suspense>`.

"Next.js에서 Streaming을 구현하는 두 가지 방법이 있다:
1. 페이지 레벨에서 loading.tsx 파일로.
2. 특정 컴포넌트를 위해 `<Suspense>`로."

> `loading.tsx` is a special Next.js file built on top of Suspense.

"`loading.tsx`는 Suspense 위에 구축된 Next.js 특수 파일이다."

두 방법 비교:

```
loading.tsx                          <Suspense>
────────────────────────────────     ────────────────────────────────
페이지 전체 단위 fallback           컴포넌트 단위 fallback
파일 시스템 기반 설정               JSX 명시적 선언
route segment 전체가 준비될 때 교체  감싼 children만 제어
단순한 전체 페이지 로딩에 적합       세밀한 UI 제어에 적합
```

---

## 종합

`loading.tsx`는 페이지 전체의 로딩 UI를 파일 하나로 선언하는 편리한 방법이고, `<Suspense>`는 컴포넌트 단위로 세밀하게 로딩 경계를 제어한다. 두 방법을 함께 쓸 수도 있다 — 페이지 레벨 `loading.tsx`로 전체 fallback을 제공하면서, 특정 느린 컴포넌트에만 `<Suspense>`를 추가로 적용하는 방식이다.

---

# Streaming이 SEO에 영향을 주는가?

## 도입

SSR의 주요 장점 중 하나는 검색 엔진 크롤러가 서버 렌더링 HTML을 읽을 수 있다는 것이다. Streaming이 이 HTML을 분할 전송하는 방식으로 변경하면 SEO에 부정적 영향이 있지 않을지 확인이 필요하다.

---

## 본문

> Since streaming is server-rendered, it does not impact SEO.

"Streaming은 서버 렌더링이기 때문에 SEO에 영향을 주지 않는다."

> You can use the Rich Results Test tool from Google to see how your page appears to Google's web crawlers and view the serialized HTML.

"구글의 Rich Results Test 도구를 사용해 Google 웹 크롤러에 페이지가 어떻게 보이는지와 직렬화된 HTML을 확인할 수 있다."

- **server-rendered**: HTML 자체는 서버에서 생성된다. Streaming은 전송 방식의 변화일 뿐, 최종적으로 크롤러가 받는 HTML 콘텐츠는 동일하다.
- **serialized HTML**: 크롤러가 실제로 읽는 HTML 문자열. Streaming으로 나눠 전송되어도 크롤러 입장에서는 완성된 HTML을 받는다.

단, Streaming이 SEO에 "영향을 안 준다"는 것은 Streaming 방식 자체가 SEO를 해치지 않는다는 의미다. 콘텐츠 로딩이 매우 느리면 구글봇이 콘텐츠를 읽지 못할 수 있다는 별도 문제는 여전히 존재한다.

---

## 종합

Streaming과 SEO는 충돌하지 않는다. HTML 생성은 여전히 서버에서 이루어지고, Streaming은 그것을 전달하는 방식만 바꾼다. 크롤러는 스트리밍으로 전달된 HTML과 일반 SSR HTML을 구분하지 않는다. Rich Results Test로 크롤러가 보는 실제 HTML을 검증하는 것이 좋은 실무 관행이다.

---

# generateMetadata는 Streaming과 어떻게 상호작용하는가?

## 도입

Next.js에서 SEO를 위해 `generateMetadata()`로 `<head>` 태그를 동적으로 생성할 때, Streaming 환경에서 메타데이터가 HTML의 어느 시점에 포함되는지가 중요하다. 스트림 도중에 `<head>`가 바뀌면 크롤러나 브라우저가 혼동할 수 있다.

---

## 본문

> Next.js will wait for data fetching inside generateMetadata to complete before streaming UI to the client.

"Next.js는 클라이언트로 UI를 스트리밍하기 전에 generateMetadata 내의 데이터 패칭이 완료되기를 기다린다."

> This guarantees the first part of a streamed response includes `<head>` tags.

"이것은 스트리밍 응답의 첫 부분에 `<head>` 태그가 포함됨을 보장한다."

- **wait for**: `generateMetadata()`가 완료될 때까지 Streaming 자체가 시작되지 않는다. 즉, `generateMetadata()` 안의 데이터 패칭이 페이지 전체 스트리밍의 블로킹 포인트가 된다.
- **first part of a streamed response**: 스트림의 첫 청크에 `<head>`가 포함된다. 크롤러와 브라우저 모두 스트림의 맨 처음에 메타데이터를 받아야 올바르게 처리할 수 있다.

```
generateMetadata()가 있을 때의 Streaming 타이밍

[generateMetadata 데이터 패칭] → 완료
         ↓
[<head> 태그 포함한 첫 청크 전송] → 스트리밍 시작
         ↓
[나머지 컴포넌트 청크들 순차 전송]
```

---

## 종합

`generateMetadata()`를 사용하면 메타데이터 패칭이 완료될 때까지 Streaming 자체가 지연된다. 가벼운 메타데이터 조회라면 문제가 없지만, 느린 DB 쿼리를 `generateMetadata()` 안에서 실행하면 Streaming의 이점이 감소한다. 메타데이터에 필요한 데이터는 가능한 한 빠른 소스(캐시, 가벼운 조회)에서 가져오는 것이 권장된다.

---

# Streaming 응답의 HTTP status code는? 중간 에러 시?

## 도입

일반적인 HTTP 응답은 상태 코드를 먼저 보내고 나서 본문을 보낸다. Streaming은 응답 본문을 나눠 보내는데, 스트리밍이 시작된 뒤 중간에 에러가 발생하면 이미 전송된 상태 코드를 바꿀 수 없다는 HTTP 프로토콜의 제약이 있다.

---

## 본문

> When streaming, a 200 status code will be returned to signal that the request was successful.

"Streaming 시에는 요청이 성공적임을 나타내기 위해 200 상태 코드가 반환된다."

> The server can still communicate errors or issues to the client within the streamed content itself, for example, when using redirect or notFound. Since the response headers have already been sent to the client, the status code of the response cannot be updated.

"서버는 스트리밍된 콘텐츠 자체 안에서 redirect나 notFound를 사용할 때처럼 에러나 문제를 클라이언트에 전달할 수 있다. 이미 응답 헤더가 클라이언트에 전송되었기 때문에 응답의 상태 코드는 업데이트될 수 없다."

> This does not affect SEO.

"이것은 SEO에 영향을 주지 않는다."

- **200 status code**: Streaming이 시작되는 시점에 헤더가 전송된다. 이후 본문 스트리밍 중에 에러가 나도 이미 보낸 헤더(200)를 수정할 수 없다.
- **within the streamed content**: 에러 정보를 응답 상태 코드 대신 HTML 스트림 내부에 인라인으로 포함한다. `redirect()`와 `notFound()`는 이 방식으로 동작한다.

```
일반 HTTP 에러    200 선전송 후 스트리밍 에러
─────────────     ─────────────────────────
[헤더 500 전송]   [헤더 200 전송]
[본문 전송]          ↓ 스트리밍 시작
                  [일부 청크 전송]
                     ↓ 에러 발생
                  [에러 정보를 스트림 내부에 삽입]
                  (상태 코드는 이미 200으로 고정)
```

---

## 종합

Streaming 환경에서는 HTTP 에러 코드로 에러를 전달하는 전통적인 방식이 동작하지 않는다. 헤더가 먼저 나가기 때문이다. Next.js는 이 제약을 `redirect()`와 `notFound()` API가 스트림 내부에 에러 정보를 포함하는 방식으로 우회한다. SEO 관점에서는 실제 콘텐츠가 크롤러에 노출되는지가 중요하지 상태 코드가 아니므로 영향이 없다.
