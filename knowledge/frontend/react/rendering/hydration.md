---
tags: [react, nextjs, rendering]
source: official
priority:
publishable: true
---
# Questions

- Hydration이란 무엇이며, 서버가 보낸 HTML에 React가 어떤 작업을 하는가?
- Next.js에서 hydration error는 정확히 무엇이 어긋났을 때 발생하는가?
  - 렌더링 로직에서 `Date()`를 사용하면 왜 hydration error로 이어지는가?
    - timestamp처럼 서버·클라가 불가피하게 달라지는 콘텐츠의 hydration 경고는 어떻게 끄는가?
      - `suppressHydrationWarning`을 걸면 React가 불일치한 텍스트를 알아서 맞춰주는가? 적용 범위는?
  - `<p>` 안에 `<div>`, `<a>` 안에 `<a>`처럼 태그를 잘못 중첩하면 왜 hydration error가 날 수 있는가?

---

# Answers

## Hydration이란 무엇이며, 서버가 보낸 HTML에 React가 어떤 작업을 하는가?

### Official Answer
Hydration is when React converts the prerendered HTML from the server into a fully interactive application by attaching event handlers.

### Reference
- https://nextjs.org/docs/messages/react-hydration-error

## Next.js에서 hydration error는 정확히 무엇이 어긋났을 때 발생하는가?

### Official Answer
While rendering your application, there was a difference between the React tree that was prerendered from the server and the React tree that was rendered during the first render in the browser (hydration).

### Reference
- https://nextjs.org/docs/messages/react-hydration-error

## 렌더링 로직에서 `Date()`를 사용하면 왜 hydration error로 이어지는가?

### Official Answer
Hydration errors can occur from:

- Using time-dependent APIs such as the `Date()` constructor in your rendering logic

### Reference
- https://nextjs.org/docs/messages/react-hydration-error

## timestamp처럼 서버·클라가 불가피하게 달라지는 콘텐츠의 hydration 경고는 어떻게 끄는가?

### Official Answer
Sometimes content will inevitably differ between the server and client, such as a timestamp. You can silence the hydration mismatch warning by adding `suppressHydrationWarning={true}` to the element.

```tsx
<time datetime="2016-10-25" suppressHydrationWarning />
```

### Reference
- https://nextjs.org/docs/messages/react-hydration-error

## `suppressHydrationWarning`을 걸면 React가 불일치한 텍스트를 알아서 맞춰주는가? 적용 범위는?

### Official Answer
- This only works one level deep, and is intended to be an escape hatch. Don't overuse it.
- React will **not** attempt to patch mismatched text content when `suppressHydrationWarning={true}` is set.

### Reference
- https://nextjs.org/docs/messages/react-hydration-error

## `<p>` 안에 `<div>`, `<a>` 안에 `<a>`처럼 태그를 잘못 중첩하면 왜 hydration error가 날 수 있는가?

### Official Answer
Hydration errors can occur from incorrect nesting of HTML tags:

- `<p>` nested in another `<p>` tag
- `<div>` nested in a `<p>` tag
- `<ul>` or `<ol>` nested in a `<p>` tag
- Interactive Content cannot be nested (`<a>` nested in a `<a>` tag, `<button>` nested in a `<button>` tag, etc.)

### Reference
- https://nextjs.org/docs/messages/react-hydration-error
