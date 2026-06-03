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

> #### AI Annotation:
> 정적 HTML은 화면에 보이지만 클릭에 반응하지 못한다(동작은 JS에만 있음). hydration이 그 위에 핸들러를 얹어 "살아있는 앱"으로 만든다. 핸들러를 **기존 DOM의 올바른 노드**에 붙여야 하므로, 서버 tree와 클라 tree가 같은 구조라는 전제가 깔린다.

### Reference
- https://nextjs.org/docs/messages/react-hydration-error

## Next.js에서 hydration error는 정확히 무엇이 어긋났을 때 발생하는가?

### Official Answer
While rendering your application, there was a difference between the React tree that was prerendered from the server and the React tree that was rendered during the first render in the browser (hydration).

> #### AI Annotation:
> 같은 컴포넌트를 서버와 클라이언트에서 각각 렌더했는데 결과물(tree)이 달라진 상황이다. hydration은 두 결과가 같다고 믿고 기존 DOM에 핸들러만 얹는 최적화이므로, 불일치가 감지되면 에러가 난다.
>
> ```
> [서버] 컴포넌트 렌더 → tree A → HTML → 브라우저 (정적, 클릭 무반응)
>                                          │ JS 번들 도착
> [클라] 같은 컴포넌트 렌더 → tree B
>                            A == B ? ─ YES → 기존 DOM에 핸들러 부착 (성공)
>                                     └ NO  → Hydration Error
> ```

### Reference
- https://nextjs.org/docs/messages/react-hydration-error

## 렌더링 로직에서 `Date()`를 사용하면 왜 hydration error로 이어지는가?

### Official Answer
Hydration errors can occur from:

- Using time-dependent APIs such as the `Date()` constructor in your rendering logic

> #### AI Annotation:
> `Date()`는 서버 렌더 시각과 클라 렌더 시각이 다르다. 그래서 같은 코드가 두 환경에서 **다른 결과**를 내고, 서버 tree와 클라 tree가 어긋난다. 클라이언트에서만 달라져야 하는 값은 `useEffect`(hydration 이후 실행)로 미루는 것이 정석이다.
>
> 예제 코드 — 서버 렌더 시각과 클라 hydration 시각이 달라 mismatch:
> ```tsx
> return (
>   <p>{new Date().toISOString()}</p>
> );
> ```

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

> #### AI Annotation:
> 브라우저는 비정상 중첩을 만나면 DOM을 자동 교정한다(예: `<p>` 안의 block 요소를 `<p>` 밖으로 빼냄). 그 결과 브라우저가 실제로 만든 DOM이 React가 기대한 tree와 달라져 불일치가 발생한다. 코드상으로는 멀쩡해 보여 디버깅이 까다로운 부류다.
>
> 예제 코드 — `<p>` 안 `<div>`:
> ```tsx
> return (
>   <p>
>     <div>div nested in p (브라우저가 p 밖으로 빼냄)</div>
>   </p>
> );
> ```
>
> 예제 코드 — `<a>` 안 `<a>`:
> ```tsx
> return (
>   <a>
>     <a>inner anchor (a in a)</a>
>   </a>
> );
> ```

### Reference
- https://nextjs.org/docs/messages/react-hydration-error
