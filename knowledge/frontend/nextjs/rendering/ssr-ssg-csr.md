---
tags: [nextjs, concept, comparison]
source: google-doc
publishable: false
priority:
---

# Questions

## Pre-rendering
- Pre-rendering(SSG, SSR)이란 무엇인가?

## SSG
- SSG(Static Site Generation)란 무엇인가?

## SSR
- SSR(Server-Side Rendering)이란 무엇인가?

## CSR
- CSR(Client-Side Rendering)이란 무엇인가?
- Pre-rendering과 CSR의 차이는 무엇인가?

## Static vs Dynamic Rendering (Next.js App Router)
- Next.js의 Static Rendering이란 무엇인가?
- Next.js의 Dynamic Rendering이란 무엇인가?
- Dynamic Routes with Cached Data란 무엇인가?
- Dynamic API를 사용하면 라우트 전체가 Dynamic Rendering으로 전환되는가?

## 성능 지표 비교
- FCP 기준으로 SSR과 CSR을 비교하면?
- TTFB 기준으로 SSR과 CSR을 비교하면?
- TTI 기준으로 SSR과 CSR을 비교하면?
- Streaming을 도입하면 성능 지표에 어떤 영향을 미치는가?

---

# Answers

## Pre-rendering(SSG, SSR)이란 무엇인가?

### Official Answer
The fetching of external data and transformation of React components into HTML happens ***before*** the result is sent to the client.
SSR and SSG are also referred to as Pre-Rendering.

### Reference
- https://patterns-dev-kr.github.io/rendering-patterns/introduction/

---

## SSG(Static Site Generation)란 무엇인가?

### Official Answer
The HTML is generated on the server at **build time** and re-used for each request.

The page must be pre-rendered (for SEO), getStaticProps() generates HTML and JSON files, both of which **can be cached by a CDN** for performance.

The data can be publicly cached (not user-specific).

### User Answer
모든 사용자에게 같은 정보를 보여줘야하고, 자주 바뀌지 않는 정보를 보여줘야하는 웹페이지에 사용한다.

빌드 타임에 미리 만들어두기 때문에 request time에 API 호출이 없어서 매우 빠르다.

### Reference
- https://patterns-dev-kr.github.io/rendering-patterns/introduction/

---

## SSR(Server-Side Rendering)이란 무엇인가?

### Official Answer
The HTML of the page is generated on a server for **each request**.

### User Answer
사용자가 요청했을 때(기준으로 최신화된) 데이터를 가져와야 하는 웹페이지에 사용한다.

대표적인 예시가 내 정보 페이지인데, 나만이 접근할 수 있고 최신화되어 있어야 하는 웹페이지다. 이런 웹페이지는 미리 만들 수 없다. 내 정보 페이지를 미리 만들게 되면 모든 사용자가 미리 만들어둔 똑같은 정보를 보게 되기 때문이다.

### Reference
- https://patterns-dev-kr.github.io/rendering-patterns/introduction/

---

## CSR(Client-Side Rendering)이란 무엇인가?

### Official Answer
If your page contains frequently updating data, and you don't need to pre-render the data (because It's not important information), you can fetch on the client side.

Client-side data fetching is useful when your page doesn't require SEO indexing.

It's important to note that using client-side data fetching can affect the performance of your application and the load speed of your pages. This is because the data fetching is done at the time of the component or pages mount, and the data is **not** **cached**.

### User Answer
사용자의 브라우저에서 HTML을 만드는 것. 처음에 비어있는 HTML을 받고, (React로 작성된) 자바스크립트 코드를 다운받아 실행하면 UI가 채워지는 방식이다.

### Reference
- https://patterns-dev-kr.github.io/rendering-patterns/introduction/

---

## Pre-rendering과 CSR의 차이는 무엇인가?

### User Answer
Full CSR은 JS가 로드되지 않으면 빈 화면을 보여주지만, Pre-rendering은 Hydration이 안 돼서 상호작용만 못할 뿐 UI는 보인다.

### Reference
- https://patterns-dev-kr.github.io/rendering-patterns/introduction/

---

## Next.js의 Static Rendering이란 무엇인가?

### Official Answer
With Static Rendering, routes are rendered at build time, or in the background after data revalidation. The result is cached and can be pushed to a Content Delivery Network (CDN). This optimization allows you to share the result of the rendering work between users and server requests.

Static rendering is useful when a route has data that is not personalized to the user and can be known at build time, such as a static blog post or a product page.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies

---

## Next.js의 Dynamic Rendering이란 무엇인가?

### Official Answer
With Dynamic Rendering, routes are rendered for each user at **request time.**

Dynamic rendering is useful when a route has data that is **personalized** to the user or has information that can **only be known at request time**, such as **cookies** or the **URL's search params.**

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies

---

## Dynamic Routes with Cached Data란 무엇인가?

### Official Answer
In most websites, routes are not fully static or fully dynamic - it's a spectrum. For example, you can have an e-commerce page that uses cached product data that's revalidated at an interval, but also has uncached, personalized customer data.

In Next.js, you can have dynamically rendered routes that have both cached and uncached data. This is because the RSC Payload and data are cached separately. This allows you to opt into dynamic rendering without worrying about the performance impact of fetching all the data at request time.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies
- https://nextjs.org/docs/app/building-your-application/caching#full-route-cache
- https://nextjs.org/docs/app/building-your-application/caching#data-cache

---

## Dynamic API를 사용하면 라우트 전체가 Dynamic Rendering으로 전환되는가?

### Official Answer
Dynamic APIs rely on information that can only be known at request time (and not ahead of time during prerendering). Using any of these APIs signals the developer's intention and will **opt the whole route into dynamic rendering** at the request time.

These APIs include:

- cookies
- headers
- connection
- draftMode
- searchParams prop
- unstable_noStore

During rendering, if a Dynamic API or a fetch option of { cache: 'no-store' } is discovered, Next.js will switch to dynamically rendering the whole route.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-apis
- https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default

---

## FCP 기준으로 SSR과 CSR을 비교하면?

### User Answer
SSR이 CSR보다 빠르다. SSR이 FCP 되는 시점은 pre-rendering 때문에 처음부터 콘텐츠가 포함된다. CSR이 FCP 되는 시점은 JS 다 다운받고 실행까지 돼야 콘텐츠가 표시된다.

---

## TTFB 기준으로 SSR과 CSR을 비교하면?

### User Answer
SSR이 CSR보다 느리다. SSR이 TTFB 되는 시점은 HTML 다 만들었을 때다. CSR이 TTFB 되는 시점은 즉시다. HTML/CSS/JS는 즉시 응답되기 때문이다.

---

## TTI 기준으로 SSR과 CSR을 비교하면?

### User Answer
- SSR은 SSR이 끝나고 Hydration도 끝났을 때 인터랙션이 가능해진다.
- CSR은 JS를 다운받고 실행됐을 때 인터랙션이 가능해진다.
- Server Component를 도입하면 TTI가 더 빨라진다. JS 번들이 줄어드니까.

---

## Streaming을 도입하면 성능 지표에 어떤 영향을 미치는가?

### Official Answer
Streaming is particularly beneficial when you want to prevent long data requests from blocking the page from rendering as it can reduce the Time To First Byte (TTFB) and First Contentful Paint (FCP). It also helps improve Time to Interactive (TTI), especially on slower devices.

### Reference
- https://web.dev/ttfb/
- https://web.dev/first-contentful-paint/
- https://developer.chrome.com/en/docs/lighthouse/performance/interactive/
