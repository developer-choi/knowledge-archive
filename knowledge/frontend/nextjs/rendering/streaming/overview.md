---
tags: [nextjs, react, performance, principle]
source: official
publishable: true
priority: 1
---

# Questions
- 스트리밍이 없던 시절의 서버 렌더링은 무엇이 문제였는가?
- 스트리밍은 그 문제를 어떤 방식으로 푸는가?
  - 서버는 HTML을 어떤 기준으로 조각내는가?
- 정적 껍데기(static shell)란 무엇인가?
- HTML 조각이 도착하면 브라우저는 그것을 화면에 어떻게 끼워 넣는가?

---

# Answers

## 스트리밍이 없던 시절의 서버 렌더링은 무엇이 문제였는가?

### Official Answer
In traditional server-side rendering, the server produces the full HTML document before sending anything. A single slow database query or API call can block the entire page.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 스트리밍은 그 문제를 어떤 방식으로 푸는가?

### Official Answer
Streaming changes this by using chunked transfer encoding to send parts of the response as they become ready. The browser starts rendering HTML while the server is still generating the rest.

This is especially impactful for pages that combine fast static content (headers, navigation, layout) with slower dynamic content (personalized data, analytics, recommendations). The static parts can be prerendered and served from a CDN, painting instantly, while the dynamic parts stream in from the server as they become ready.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 서버는 HTML을 어떤 기준으로 조각내는가?

### Official Answer
React's server renderer produces HTML in chunks aligned with `<Suspense>` boundaries. Next.js integrates this into the App Router so streaming works without additional configuration.

Each `<Suspense>` boundary is an independent streaming point. Components inside different boundaries resolve and stream in independently. They don't block each other.

### User Answer
가만 보니 정말로 컴포넌트 단위로 스트리밍하는 게 맞는 말이다.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 정적 껍데기(static shell)란 무엇인가?

### Official Answer
Everything that renders before any async work resolves is called the **static shell**: your layouts, navigation, and the fallback UI defined by your `<Suspense>` boundaries. It is sent immediately, giving the user something to see and interact with while dynamic content streams in.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## HTML 조각이 도착하면 브라우저는 그것을 화면에 어떻게 끼워 넣는가?

### Official Answer
React's server renderer produces progressive HTML chunks. The static parts of your page (layouts, navigation, Suspense fallbacks) render first and are sent immediately. When an async Server Component resolves, React streams its completed HTML along with inline `<script>` tags: one that swaps the fallback DOM node with the new content, and another carrying the component payload so React can later hydrate it. The browser executes the swap instantly, without waiting for the page's JavaScript bundle to load or hydration to complete. This is what the user *sees*: the page painting progressively, section by section.

### Reference
- https://nextjs.org/docs/app/guides/streaming
