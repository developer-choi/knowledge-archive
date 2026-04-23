---
tags: [react, nextjs, performance, principle]
---

# Questions
- Streaming이란 무엇인가?
- Streaming은 어떤 문제들을 해결하는가?
- Streaming이 개선하는 성능 지표는?
- Suspense를 사용하면 얻는 두 가지 이점은?
- Next.js에서 Streaming을 구현하는 두 가지 방법은?
- Streaming이 SEO에 영향을 주는가?
- generateMetadata는 Streaming과 어떻게 상호작용하는가?
- Streaming 응답의 HTTP status code는? 중간 에러 시?

---

# Answers

## Streaming이란 무엇인가?

### Official Answer
Streaming is a **data transfer technique** that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready.

Streaming works well with React's component model, as each component can be considered a chunk.

> #### Key Terms:
> - **chunk**: 라우트를 쪼갠 작은 단위. React 컴포넌트 하나가 곧 하나의 chunk가 될 수 있다.
> - **progressively**: 한 번에 전체를 보내는 것이 아니라 준비된 부분부터 점진적으로 전송하는 방식

> #### User Annotation:
> 가만 보니 정말로 컴포넌트 단위로 스트리밍하는 게 맞는 말이다.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- https://nextjs.org/learn/dashboard-app/streaming

---

## Streaming은 어떤 문제들을 해결하는가?

### Official Answer
By streaming, you can prevent slow data requests from blocking your whole page.
This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user.

To prevent client to server waterfalls, dynamic components begin streaming from the server in parallel while serving the initial prerender.
This ensures dynamic components can begin rendering before client JavaScript has been loaded in the browser.

> #### User Annotation:
> SSR에서 API 여러 개 호출할 때 하나라도 느리면 전체 페이지 로딩이 느려지는 문제를 해결한다.
> Server Side에서 API를 호출하는데도 불구하고
> 1. 나머지 로딩이 완료된 부분이 화면에 보이게 되고,
> 2. 상호작용까지 가능하다.
>
> 또 하나, 메인 컨텐츠는 SSR, 서브 컨텐츠는 CSR을 하던 구조에서 CSR 입장에서는 SSR이 완료되어야 호출을 시작할 수 있었는데, 이제는 처음부터 가능하다.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

---

## Streaming이 개선하는 성능 지표는?

### Official Answer
Streaming is particularly beneficial when you want to prevent long data requests from blocking the page from rendering as it can reduce the **Time To First Byte (TTFB)** and **First Contentful Paint (FCP)**.
It also helps improve **Time to Interactive (TTI)**, especially on slower devices.

> #### Key Terms:
> - **TTFB (Time To First Byte)**: 서버 응답의 첫 바이트가 도착하기까지의 시간
> - **FCP (First Contentful Paint)**: 화면에 첫 콘텐츠가 그려지는 시점
> - **TTI (Time to Interactive)**: 페이지가 사용자 상호작용에 응답할 수 있게 되는 시점

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

---

## Suspense를 사용하면 얻는 두 가지 이점은?

### Official Answer
By using Suspense, you get the benefits of:
1. **Streaming Server Rendering** - Progressively rendering HTML from the server to the client.
2. **Selective Hydration** - React prioritizes what components to make interactive first based on user interaction.

```typescript jsx
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

> #### Key Terms:
> - **Selective Hydration**: 모든 컴포넌트를 한 번에 hydrate 하지 않고, 사용자 상호작용 등 우선순위가 높은 컴포넌트부터 hydrate 하는 방식

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

---

## Next.js에서 Streaming을 구현하는 두 가지 방법은?

### Official Answer
There are two ways you implement streaming in Next.js:
1. At the page level, with the `loading.tsx` file.
2. For specific components, with `<Suspense>`.

`loading.tsx` is a special Next.js file built on top of Suspense.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

---

## Streaming이 SEO에 영향을 주는가?

### Official Answer
Since streaming is server-rendered, it **does not impact SEO**.

You can use the Rich Results Test tool from Google to see how your page appears to Google's web crawlers and view the serialized HTML.

> #### User Annotation:
> SEO에 영향을 안 준다는 거지, SEO를 못한다는 소리가 아니다.
> 당연히 streaming으로 100만 년 걸리는 컨텐츠를 로딩하고 있으면 구글봇이 못 보는 것은 똑같다.
> 그래서 구글봇이 우리 화면을 어떻게 보는지 Rich Results Test로 확인하라는 안내가 있는 것이다.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

---

## generateMetadata는 Streaming과 어떻게 상호작용하는가?

### Official Answer
Next.js will wait for data fetching inside `generateMetadata` to complete before streaming UI to the client.
This guarantees the first part of a streamed response includes `<head>` tags.

> #### User Annotation:
> 이거 때문에 `generateMetadata()` 쓰면 페이지 로딩 자체가 블로킹된다.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

---

## Streaming 응답의 HTTP status code는? 중간 에러 시?

### Official Answer
When streaming, a **200** status code will be returned to signal that the request was successful.

The server can still communicate errors or issues to the client within the streamed content itself, for example, when using `redirect` or `notFound`.
Since the response headers have already been sent to the client, the status code of the response cannot be updated.
This does not affect SEO.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
