---
tags: [nextjs, react, performance, principle]
source: official
publishable: true
priority: 1
---

# Questions
- 스트리밍은 왜 TTFB와 FCP를 낮추는가?
- 가장 큰 요소(LCP)를 빨리 그리려면 경계를 어떻게 배치해야 하는가?
- 임시 화면이 진짜 내용으로 바뀔 때 화면이 덜컹거리는 것을 막으려면 어떻게 해야 하는가?
- 화면 이동 직후 곧바로 띄우는 임시 화면은 무엇으로 채우는 것이 좋은가?
- `<Suspense>` 경계는 하이드레이션에 어떤 영향을 주는가?
- 정적 껍데기가 첫 조각에 담기는 것이 자원 로딩에 왜 유리한가?

---

# Answers

## 스트리밍은 왜 TTFB와 FCP를 낮추는가?

### Official Answer
Without streaming, the server waits for all data before sending any HTML, so TTFB equals the slowest query. With streaming, the server sends the static shell as soon as it's ready. TTFB drops to the time it takes to render your layouts and fallbacks. The browser paints the static shell immediately, so FCP is decoupled from your data fetching time.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 가장 큰 요소(LCP)를 빨리 그리려면 경계를 어떻게 배치해야 하는가?

### Official Answer
If your LCP element (a hero image, a main heading, a product photo) is inside a Suspense boundary, it can't paint until that boundary resolves. To keep LCP fast:

* Keep LCP elements **outside** or **above** Suspense boundaries so they render as part of the static shell.
* Use the `preload` prop on `next/image` for LCP images. This injects a `<link rel="preload">` into the `<head>`, so the browser starts fetching the image from the very first chunk, before the `<img>` tag even appears in the HTML.
* For non-image LCP elements (text, headings), make sure they are not wrapped in a Suspense boundary that depends on slow data.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 임시 화면이 진짜 내용으로 바뀔 때 화면이 덜컹거리는 것을 막으려면 어떻게 해야 하는가?

### Official Answer
When a Suspense fallback is replaced by the resolved content, the browser reflows the page. If the fallback and the resolved content are different sizes, the surrounding layout shifts. To minimize CLS:

* Design skeleton fallbacks that **match the dimensions** of the content they represent. A skeleton with the same height and width as the final card grid prevents shifts.
* Use fixed or min-height containers around Suspense boundaries so the space is reserved before content arrives.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 화면 이동 직후 곧바로 띄우는 임시 화면은 무엇으로 채우는 것이 좋은가?

### Official Answer
An instant loading state is fallback UI that is shown immediately to the user after navigation. For the best user experience, we recommend designing loading states that are meaningful and help users understand the app is responding. For example, you can use skeletons and spinners, or a small but meaningful part of future screens such as a cover photo, title, etc.

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data

---

## `<Suspense>` 경계는 하이드레이션에 어떤 영향을 주는가?

### Official Answer
Streaming enables selective hydration: React hydrates components independently as they stream in, and prioritizes hydrating whatever the user is interacting with. Each `<Suspense>` boundary is a hydration unit. Without them, React hydrates the entire page in one blocking pass. With them, hydration is broken into smaller tasks that yield to the browser, keeping the main thread responsive.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 정적 껍데기가 첫 조각에 담기는 것이 자원 로딩에 왜 유리한가?

### Official Answer
The static shell includes `<link>` and `<script>` tags in the very first HTML chunk. The browser discovers and starts fetching CSS, JavaScript, and fonts immediately, while the server is still generating content. Resources are fetched during server think time rather than after it.

### Reference
- https://nextjs.org/docs/app/guides/streaming
