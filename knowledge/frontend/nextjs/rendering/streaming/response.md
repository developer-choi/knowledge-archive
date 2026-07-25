---
tags: [nextjs, react, performance, principle]
source: official
publishable: true
priority: 2
---

# Questions
- 스트리밍이 시작되면 응답에서 무엇을 더 이상 바꿀 수 없는가?
  - 스트리밍은 정확히 언제 시작되는가?
  - 스트리밍 도중에 `notFound()`가 터지면 어떻게 되는가?
  - 진짜 404 상태 코드를 내려면 어떻게 해야 하는가?
- 스트리밍 도중에 오류가 나면 화면은 어떻게 되는가?
- `generateMetadata`는 스트리밍과 어떻게 맞물리는가?

---

# Answers

## 스트리밍이 시작되면 응답에서 무엇을 더 이상 바꿀 수 없는가?

### Official Answer
Once streaming begins, the HTTP response headers (including the status code) have already been sent to the client. **You cannot change the status code or headers after streaming starts.** Everything in this section flows from this fundamental constraint.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 스트리밍은 정확히 언제 시작되는가?

### Official Answer
The response body begins streaming when a Suspense fallback renders (for example, a `loading.tsx`) or when a component suspends under a `<Suspense>` boundary.

When a `<Suspense>` fallback renders or a component suspends, the server must commit to `200 OK` in order to start sending the HTML stream.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 스트리밍 도중에 `notFound()`가 터지면 어떻게 되는가?

### Official Answer
If a `notFound()` fires mid-stream, Next.js cannot go back and change the status to 404. Instead, it injects `<meta name="robots" content="noindex">` into the streamed HTML so that search engines don't index the page. Similarly, a `redirect()` mid-stream becomes a client-side redirect rather than an HTTP redirect header.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 진짜 404 상태 코드를 내려면 어떻게 해야 하는가?

### Official Answer
To get a real HTTP status code for errors, place `notFound()` **before** any `await` or `<Suspense>` boundary:

```tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exists = await checkSlugExists(slug) // Fast existence check
  if (!exists) notFound() // Real 404, before any Suspense boundary

  return (
    <Suspense fallback={<p>Loading post...</p>}>
      <PostContent slug={slug} />
    </Suspense>
  )
}
```

You can also reject requests early using `proxy` (for redirects, rewrites, or returning a response) or `next.config.js` redirects. Both run before the page renders, so HTTP status codes are still available.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 스트리밍 도중에 오류가 나면 화면은 어떻게 되는가?

### Official Answer
If a component throws an error after streaming has started, the nearest `error.js` boundary catches it and renders the error UI in place of the failed component. The rest of the page remains intact, only the section that errored is replaced.

Because the HTTP status code (`200 OK`) has already been sent with the first chunk, it cannot be changed to a `4xx` or `5xx`. The error is handled entirely within the streamed HTML.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## `generateMetadata`는 스트리밍과 어떻게 맞물리는가?

### Official Answer
`generateMetadata` resolves before streaming begins for bots that only scrape static HTML (such as Twitterbot or Slackbot). For full browsers and capable crawlers, metadata can stream alongside the page content.

Next.js automatically detects user agents to choose the right behavior. You can customize which bots receive blocking metadata with the `htmlLimitedBots` configuration option.

### Reference
- https://nextjs.org/docs/app/guides/streaming
