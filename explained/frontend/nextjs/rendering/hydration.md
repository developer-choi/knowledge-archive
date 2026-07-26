# Hydration이란 무엇이며, 서버가 보낸 HTML에 React가 어떤 작업을 하는가?

## 도입

서버가 만들어 보낸 화면은 그림일 뿐이다. 글자와 버튼이 다 보이지만 눌러도 아무 일이 안 일어난다. 이 그림을 실제로 동작하는 화면으로 바꾸는 일에 붙은 이름이 hydration이다.

---
## 본문

> Hydration is when React converts the prerendered HTML from the server into a fully interactive application by attaching event handlers.

"hydration은 React가 서버에서 미리 그려진 HTML에 이벤트 핸들러를 붙여, 완전히 상호작용하는 애플리케이션으로 바꾸는 일이다."

- **prerendered HTML**: 서버가 미리 그려 보낸 화면. 내용은 다 들어 있지만 반응하지는 않는다.
- **attaching event handlers**: 이미 화면에 있는 요소에 "눌리면 이걸 해라"를 이어 붙이는 일. 화면을 다시 그리는 것이 아니다.
- **fully interactive**: 붙이기가 끝나야 클릭·입력·상태 변화가 실제로 동작한다.

여기서 놓치기 쉬운 것은 **화면을 새로 만들지 않는다**는 점이다. 이미 와 있는 HTML을 그대로 두고 거기에 동작만 얹는다. 그래서 사용자는 화면이 깜빡이는 것을 보지 않는다.

```
서버                        브라우저
──────                      ──────────────────────────
HTML 생성  ──────────────▶  화면에 보임 (눌러도 반응 없음)
                                    │
JS 번들   ──────────────▶          ▼
                            hydration — 있는 요소에 동작만 얹기
                                    │
                                    ▼
                            눌리면 반응하는 화면
```

---
## 종합

hydration은 "다시 그리기"가 아니라 "이어 붙이기"다. 서버가 보낸 정지 화면에 React가 이벤트 핸들러를 얹어 살아 있는 화면으로 만든다. 그래서 사용자는 JS가 도착하기 전에도 내용을 볼 수 있고, 도착한 뒤에는 그 화면 그대로 조작할 수 있다.

---

# Next.js에서 hydration error는 정확히 무엇이 어긋났을 때 발생하는가?

## 도입

hydration이 "이어 붙이기"라면, 붙일 자리가 예상과 다르면 곤란해진다. hydration error는 바로 그 상황을 알리는 경고다.

---
## 본문

> While rendering your application, there was a difference between the React tree that was prerendered from the server and the React tree that was rendered during the first render in the browser (hydration).

"애플리케이션을 그리는 동안, 서버에서 미리 그려진 React 트리와 브라우저에서 첫 렌더 때 그려진 React 트리 사이에 차이가 있었다."

- **React tree**: 어떤 컴포넌트가 어떤 순서로 어디에 놓이는지를 담은 구조. 화면의 뼈대라고 보면 된다.
- **prerendered from the server**: 서버가 먼저 그려 놓은 쪽.
- **the first render in the browser**: 브라우저가 JS를 받아 처음 그려 본 쪽. React는 이 결과를 서버 것과 맞춰 본다.
- **a difference**: 두 결과가 다르다는 것. **어느 쪽이 옳은지의 문제가 아니라 둘이 어긋났다는 것 자체**가 에러의 조건이다.

즉 에러의 정체는 "잘못된 화면"이 아니라 **두 번 그린 결과가 서로 다름**이다. 브라우저에서만 그렸다면 아무 문제가 없었을 코드도, 서버에서 한 번 더 그리는 순간 문제가 된다.

```
서버가 그린 트리        브라우저가 그린 트리
─────────────          ──────────────────
<p>10:30:05</p>   ≠    <p>10:30:07</p>   → hydration error
<p>안녕</p>       =    <p>안녕</p>       → 정상
```

---
## 종합

hydration error는 서버와 브라우저가 각각 그린 결과가 어긋났다는 신고다. 원인을 찾을 때는 "무엇이 틀렸나"가 아니라 **"두 번 그리면 달라지는 것이 무엇인가"**를 찾아야 한다. 시각·난수·브라우저에만 있는 값이 늘 첫 용의자인 이유가 이것이다.

---

# 렌더링 로직에서 `Date()`를 사용하면 왜 hydration error로 이어지는가?

## 도입

`Date()`는 언제 호출하느냐에 따라 답이 달라진다. 서버에서 한 번, 브라우저에서 또 한 번 호출되면 두 답이 같을 수 없다.

---
## 본문

> Hydration errors can occur from:
>
> - Using time-dependent APIs such as the `Date()` constructor in your rendering logic

"hydration error는 다음에서 발생할 수 있다: 렌더링 로직에서 `Date()` 생성자 같은 시간 의존 API를 사용하는 것."

- **time-dependent APIs**: 부르는 시각에 따라 결과가 달라지는 것들. `Date()`가 대표이고, `Math.random()`처럼 부를 때마다 달라지는 것도 성격이 같다.
- **in your rendering logic**: 화면을 그리는 코드 안. 이벤트 핸들러 안이나 `useEffect` 안은 해당하지 않는다 — 그쪽은 브라우저에서만 돌기 때문이다.

서버에서 그린 시각과 브라우저에서 그린 시각 사이에는 최소한 네트워크로 오간 시간만큼 간격이 있다. 그 간격이 곧 두 트리의 차이가 된다.

```
서버 렌더 (10:30:05)  →  HTML: <p>10:30:05</p>
        ↓ 네트워크·번들 다운로드에 2초
브라우저 첫 렌더 (10:30:07)  →  <p>10:30:07</p>

React: 두 결과가 다르다 → hydration error
```

피하는 길은 그리는 시점에 시각을 읽지 않는 것이다. `useEffect` 안에서 읽으면 브라우저에서만 한 번 돌므로 비교 대상이 아예 생기지 않는다.

---
## 종합

`Date()`가 문제인 이유는 값이 틀려서가 아니라 **두 번 부르면 두 답이 나오기 때문**이다. 서버와 브라우저가 각자 부른 결과가 어긋나면서 hydration error가 된다. 그리는 코드에서 빼고 브라우저에서만 읽게 옮기는 것이 기본 해법이다.

---

# timestamp처럼 서버·클라가 불가피하게 달라지는 콘텐츠의 hydration 경고는 어떻게 끄는가?

## 도입

시각 표시처럼 애초에 두 쪽이 같을 수 없는 내용도 있다. 이럴 때 쓰라고 마련된 표시가 있다.

---
## 본문

> Sometimes content will inevitably differ between the server and client, such as a timestamp. You can silence the hydration mismatch warning by adding `suppressHydrationWarning={true}` to the element.

"때로는 timestamp처럼 서버와 클라이언트 사이에서 내용이 불가피하게 달라진다. 해당 요소에 `suppressHydrationWarning={true}`를 붙여 hydration 불일치 경고를 잠재울 수 있다."

- **inevitably differ**: 고칠 수 있는 실수가 아니라 성질상 어쩔 수 없이 다른 경우.
- **silence the warning**: 경고를 잠재운다. 불일치를 없애는 것이 아니라 **알리지 않게** 하는 것이다.
- **to the element**: 컴포넌트나 파일이 아니라 그 요소 하나에 붙인다.

```tsx
<time datetime="2016-10-25" suppressHydrationWarning />
```

붙이는 자리가 중요하다. 어긋나는 내용을 담은 바로 그 요소에 붙여야 한다.

---
## 종합

`suppressHydrationWarning`은 "이 자리는 달라도 괜찮다고 내가 판단했다"는 표시다. 불일치 자체를 없애 주지는 않으므로, 고칠 수 있는 불일치에 이것을 붙이는 것은 문제를 덮는 일이 된다. 성질상 같아질 수 없는 자리에만 쓴다.

---

# `suppressHydrationWarning`을 걸면 React가 불일치한 텍스트를 알아서 맞춰주는가? 적용 범위는?

## 도입

경고가 사라지니 React가 알아서 정리해 준 것처럼 보인다. 실제로는 반대다.

---
## 본문

> - This only works one level deep, and is intended to be an escape hatch. Don't overuse it.
> - React will **not** attempt to patch mismatched text content when `suppressHydrationWarning={true}` is set.

"이것은 한 단계 깊이까지만 동작하며, 비상구로 쓰라고 만든 것이다. 남용하지 마라. `suppressHydrationWarning={true}`가 걸려 있으면 React는 어긋난 텍스트 내용을 고치려 시도하지 **않는다**."

- **one level deep**: 붙인 요소와 그 바로 아래까지만 미친다. 더 깊은 자손에는 미치지 않으므로, 거기서 어긋나면 경고가 그대로 뜬다.
- **escape hatch**: 비상구. 일반적인 해결책이 아니라 달리 방법이 없을 때 쓰는 탈출구라는 뜻이다.
- **will not attempt to patch**: 서버가 보낸 글자와 브라우저가 계산한 글자가 다를 때, 브라우저 쪽으로 맞춰 고쳐 주지 않는다. **서버가 보낸 글자가 그대로 남는다.**

두 번째 항목이 실무에서 놓치기 쉬운 대목이다. 경고만 사라질 뿐 화면에는 서버가 만든 옛 값이 남는다.

```
suppressHydrationWarning 없음     있음
──────────────────────────      ──────────────────────
경고: 뜸                         경고: 안 뜸
화면: React가 맞춰 고침          화면: 서버가 보낸 값 그대로
```

그래서 실제로 최신 값을 보여야 한다면 이 표시만으로는 부족하고, `useEffect`에서 값을 다시 넣어 주는 등 따로 손을 대야 한다.

---
## 종합

`suppressHydrationWarning`은 경고를 끄는 스위치이지 불일치를 해결하는 도구가 아니다. 미치는 범위도 한 단계뿐이고, 걸어 둔 자리의 텍스트는 서버 값 그대로 남는다. 최신 값이 보여야 하는 자리라면 이 표시에 더해 브라우저에서 값을 채우는 처리가 따로 필요하다.

---

# `<p>` 안에 `<div>`, `<a>` 안에 `<a>`처럼 태그를 잘못 중첩하면 왜 hydration error가 날 수 있는가?

## 도입

시각이나 난수를 안 썼는데도 hydration error가 나는 경우가 있다. 잘못 겹쳐 놓은 태그가 흔한 원인이다.

---
## 본문

> Hydration errors can occur from incorrect nesting of HTML tags:
>
> - `<p>` nested in another `<p>` tag
> - `<div>` nested in a `<p>` tag
> - `<ul>` or `<ol>` nested in a `<p>` tag
> - Interactive Content cannot be nested (`<a>` nested in a `<a>` tag, `<button>` nested in a `<button>` tag, etc.)

"hydration error는 HTML 태그를 잘못 중첩해도 발생할 수 있다: `<p>` 안의 `<p>`, `<p>` 안의 `<div>`, `<p>` 안의 `<ul>`·`<ol>`, 그리고 겹쳐 놓을 수 없는 상호작용 콘텐츠(`<a>` 안의 `<a>`, `<button>` 안의 `<button>` 등)."

- **incorrect nesting**: HTML 표준이 허용하지 않는 겹침. `<p>` 안에는 문단 수준 요소가 들어갈 수 없고, 누르는 요소 안에 또 누르는 요소를 넣을 수 없다.
- **Interactive Content**: 링크·버튼처럼 사용자가 누르는 요소. 안에 또 누르는 요소가 있으면 어느 쪽이 눌린 것인지 정할 수 없다.

**이것이 hydration error가 되는 까닭은 브라우저가 잘못된 HTML을 말없이 고쳐 놓기 때문이다.** 서버가 보낸 글자를 브라우저가 해석하는 단계에서, 규칙에 안 맞는 겹침을 스스로 풀어 구조를 바꿔 버린다. 그래서 React가 나중에 두 트리를 맞춰 볼 때 서버가 의도한 구조와 실제 화면의 구조가 달라져 있다.

```
서버가 보낸 글자        브라우저가 해석한 결과
──────────────         ─────────────────────
<p>                     <p></p>
  <div>내용</div>  →    <div>내용</div>     ← p 밖으로 밀려남
</p>                    <p></p>

React가 그린 트리는 왼쪽, 실제 DOM은 오른쪽 → 어긋남
```

시각·난수와 달리 이 원인은 **코드가 서버와 브라우저에서 똑같이 돌아도** 생긴다. 어긋남을 만드는 것은 내 코드가 아니라 브라우저의 교정이다.

---
## 종합

태그를 잘못 겹치면 브라우저가 그것을 조용히 바로잡고, 그 결과 React가 예상한 구조와 실제 구조가 달라져 hydration error가 된다. 시각·난수 계열과 달리 값이 변해서 생기는 문제가 아니므로, `suppressHydrationWarning`으로 덮을 일이 아니라 마크업 자체를 고쳐야 한다.
