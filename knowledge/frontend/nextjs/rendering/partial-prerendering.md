---
tags: [nextjs, performance, principle]
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

> #### Key Terms:
> - **static and dynamic components**: 정적 컴포넌트와 동적 컴포넌트
> - **prerendered content**: 미리 렌더링되어 즉시 응답 가능한 콘텐츠

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.
- Next.js 14 기준 experimental 기능.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering

---

## PPR은 빌드/요청 타임에 어떻게 동작하는가?

### Official Answer
- During the build, Next.js prerenders as much of the route as possible.
- If dynamic code is detected, like reading from the incoming request, you can wrap the relevant component with a React Suspense boundary.
- The Suspense boundary fallback will then be included in the prerendered HTML.

> #### Key Terms:
> - **prerenders**: 빌드 시점에 라우트를 미리 렌더링하여 결과를 저장함
> - **Suspense boundary**: 비동기 렌더링 경계. dynamic 영역을 감싸는 데 사용
> - **fallback**: Suspense가 데이터 로딩 중일 때 보여주는 임시 UI

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering

---

## PPR은 client-to-server waterfall을 어떻게 방지하는가?

### Official Answer
To prevent client to server waterfalls, dynamic components begin streaming from the server **in parallel** while serving the initial prerender.
This ensures dynamic components can begin rendering before client JavaScript has been loaded in the browser.

> #### Key Terms:
> - **client to server waterfalls**: 클라이언트가 JS를 받은 뒤에야 서버에 데이터를 요청해서 발생하는 순차적 지연
> - **streaming from the server in parallel**: 정적 prerender를 보내는 동안 동적 컴포넌트도 병렬로 스트리밍함
> - **initial prerender**: 빌드 시점에 미리 만들어둔 초기 렌더 결과

> #### User Annotation:
> Static Content가 렌더링이 완료되기 전까지 기다리지 않고, 동적·정적 컨텐츠를 동시에 만들기 시작한다.
> Dynamic contents = Streaming, Static contents = prerender.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering

---

## PPR은 dynamic component마다 별도 HTTP 요청을 만드는가?

### Official Answer
To prevent creating many HTTP requests for each dynamic component, PPR is able to combine the static prerender and dynamic components together into a single HTTP request.
This ensures there are not multiple network roundtrips needed for each dynamic component.

> #### Key Terms:
> - **single HTTP request**: 정적 prerender와 동적 컴포넌트들을 하나의 HTTP 응답에 합쳐서 보냄
> - **network roundtrips**: 클라이언트와 서버 사이의 왕복 통신 횟수

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
