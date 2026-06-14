---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Partial Prerendering(PPR)이란 무엇인가?
- PPR은 빌드/요청 타임에 어떻게 동작하는가?
- PPR은 client-to-server waterfall을 어떻게 방지하는가?
- PPR은 dynamic component마다 별도 HTTP 요청을 만드는가?

---

# Answers

## Partial Prerendering(PPR)이란 무엇인가?

### Official Answer
Partial Prerendering (PPR) enables you to combine static and dynamic components together in the same route.
PPR enables your Next.js server to immediately send prerendered content.

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.
- Next.js 14 기준 experimental 기능.

### User Answer
렌더링 방식의 발전 흐름: CSR → SSR → Streaming → PPR. PPR이 차세대 렌더링 방식으로 위치한다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering

---

## PPR은 빌드/요청 타임에 어떻게 동작하는가?

### Official Answer
- During the build, Next.js prerenders as much of the route as possible.
- If dynamic code is detected, like reading from the incoming request, you can wrap the relevant component with a React Suspense boundary.
- The Suspense boundary fallback will then be included in the prerendered HTML.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering

---

## PPR은 client-to-server waterfall을 어떻게 방지하는가?

### Official Answer
To prevent client to server waterfalls, dynamic components begin streaming from the server **in parallel** while serving the initial prerender.
This ensures dynamic components can begin rendering before client JavaScript has been loaded in the browser.

### User Answer
Static Content가 렌더링이 완료되기 전까지 기다리지 않고, 동적·정적 컨텐츠를 동시에 만들기 시작한다.

Dynamic contents = Streaming, Static contents = prerender.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering

---

## PPR은 dynamic component마다 별도 HTTP 요청을 만드는가?

### Official Answer
To prevent creating many HTTP requests for each dynamic component, PPR is able to combine the static prerender and dynamic components together into a single HTTP request.
This ensures there are not multiple network roundtrips needed for each dynamic component.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
