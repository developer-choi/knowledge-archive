# Next.js에서 `fetch` 요청은 기본적으로 캐시되는가?

## 본문

> By default, `fetch` requests are not cached. You can cache individual requests by setting the `cache` option to `'force-cache'`.

"기본적으로 `fetch` 요청은 캐시되지 않는다. `cache` 옵션을 `'force-cache'`로 주면 요청 하나하나를 캐시할 수 있다."

- **By default**: 아무 옵션도 안 줬을 때의 동작.
- **individual**: 라우트 통째가 아니라 요청 단위. 이 문서에는 라우트 통째에 거는 층이 따로 있고, 그것과 구분하는 말이다.

```tsx
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

`cache`는 Next.js가 새로 만든 옵션이 아니라 브라우저 표준 `fetch`에 원래 있는 옵션 자리다. Next.js는 그 자리를 서버 쪽 캐시를 켜는 스위치로도 쓴다.

> `fetch` requests are not cached by default and will block the page from rendering until the request is complete. Use the `use cache` directive to cache results, or wrap the fetching component in `<Suspense>` to stream fresh data at request time.

"`fetch` 요청은 기본적으로 캐시되지 않으며, 요청이 끝날 때까지 페이지 렌더링을 막는다. 결과를 캐시하려면 `use cache` 지시어를 쓰고, 요청 시점의 새 데이터를 스트리밍하려면 데이터를 가져오는 컴포넌트를 `<Suspense>`로 감싼다."

- **block A from B**: A가 B하지 못하게 막다.
- **at request time**: 요청이 들어온 그 시점에.

### 캐시가 안 된다는 말에는 대가가 따라온다

"캐시 안 됨"은 매번 새 데이터를 받는다. 즉, 그 요청이 끝날 때까지 페이지가 못 나간다는 것이다. 그래서 선택지는 셋이다.

```
그냥 두면      매 요청마다 새로 가져오고, 그동안 화면이 안 나간다
use cache      결과를 저장해 두고 다음 요청에서 재사용한다
<Suspense>     새로 가져오되, 그 부분만 나중에 채운다
```

뒤의 둘은 서로 반대되는 선택이 아니다. 앞의 것은 "데이터를 재사용해 기다림을 없애는" 쪽이고, 뒤의 것은 "기다림은 두되 화면을 붙잡지 않는" 쪽이다. 데이터가 항상 최신이어야 한다면 뒤쪽밖에 답이 없다.

### 기본값이 뒤집힌 자리다

Next.js 13·14 시절에는 `fetch`가 **기본으로 캐시**됐다. 옵션을 안 주면 캐시되고, 캐시를 원치 않으면 `no-store`를 명시하는 구조였다. 그게 "왜 내 데이터가 안 바뀌지" 하는 사고를 워낙 많이 만들어서, 지금은 반대로 뒤집혔다.

```
                     안 주면?          캐시하려면?
─────────────────────────────────────────────────────
Next.js 13·14        캐시됨            (기본값)
지금                 캐시 안 됨        cache: 'force-cache'
```

옛 글이나 옛 블로그 예제를 볼 때 이 차이를 모르면 정반대로 이해하게 된다.

---
## 종합

지금 기준으로 `fetch`는 아무것도 안 하면 매번 새로 가져온다. 캐시는 켜는 쪽이 명시적이다. 예전 버전이 정반대였다는 사실만 같이 기억해두면 옛 자료를 읽을 때 헷갈리지 않는다.

---

# 캐싱 동작을 요청 하나가 아니라 라우트 전체에 걸려면 어떻게 하는가?

## 도입

`fetch` 하나하나에 옵션을 다는 것으로는 부족할 때가 있다. "이 페이지는 통째로 정적" 또는 "이 페이지는 통째로 매번 새로"처럼 라우트 단위로 정하고 싶은 경우다.

---
## 본문

> You can configure caching behavior at the route level by exporting config options from a Page, Layout, or Route Handler.

"Page·Layout·Route Handler에서 설정 옵션을 export하면 라우트 수준에서 캐싱 동작을 정할 수 있다."

- **route level**: 요청 하나가 아니라 그 라우트 전체에 걸리는 층.
- **exporting config options**: 정해진 이름의 값을 파일에서 내보내는 것. 함수를 호출하는 게 아니라 선언만 한다.

### 함수 호출이 아니라 선언이다

이 설정은 어딘가에 등록하거나 호출하는 게 아니다. 파일에 **정해진 이름의 값을 export하면 Next.js가 빌드할 때 그걸 읽어간다**.

```tsx
// app/blog/page.tsx
export const dynamic = 'force-static'
export const revalidate = 3600

export default async function Page() {
  // ...
}
```

이름이 약속돼 있어서 오타를 내면 조용히 무시된다. `dynamics`라고 쓰면 에러가 나는 게 아니라 그냥 안 걸린다.

### 두 층이 겹칠 때

요청 하나에 건 옵션과 라우트에 건 설정이 동시에 있으면, 대체로 **더 좁은 쪽(개별 `fetch`)이 이긴다**. 라우트 설정은 "아무도 따로 안 정했을 때의 기본값"에 가깝다.

```
층                     범위                예
────────────────────────────────────────────────────────────
개별 fetch 옵션        요청 1개            { cache: 'force-cache' }
route segment config   그 라우트 전체      export const dynamic = ...
```

예외는 이름에 `force-`가 붙은 값들이다. 이들은 기본값을 바꾸는 게 아니라 **아래층을 덮어쓰는 강제**라서 개별 옵션을 무력화한다.

---
## 종합

캐싱을 정하는 자리는 두 층이다 — 요청 하나에 얹는 옵션과, 파일에서 export해 라우트 전체에 거는 설정. 후자는 호출이 아니라 약속된 이름의 선언이고, 보통은 기본값 역할을 하되 `force-` 계열만 강제로 덮어쓴다.

---

# `dynamic` 설정은 layout·page의 무엇을 바꾸는가?

## 도입

라우트 설정 중 가장 먼저 만나는 게 `dynamic`이다. 이름만 보면 "동적으로 만드는 스위치" 같지만, 실제로는 정적·동적 양쪽을 다 가리키는 손잡이다.

---
## 본문

> Change the dynamic behavior of a layout or page to fully static or fully dynamic.

"layout이나 page의 동적 동작을 완전 정적 또는 완전 동적으로 바꾼다."

- **fully**: 부분이 아니라 통째로. 섞이는 상태를 없애겠다는 뜻이다.

```tsx
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

> - **`'auto'`** (default): The default option to cache as much as possible without preventing any components from opting into dynamic behavior.

"`'auto'`(기본) — 어떤 컴포넌트도 동적으로 갈 길을 막지 않으면서, 캐시할 수 있는 만큼 최대한 캐시하는 기본 옵션."

- **opting into**: 스스로 선택해 들어가는 것. 어떤 컴포넌트가 쿠키를 읽어서 동적이 되기를 택하면 그걸 허용한다는 말이다.

### 기본값은 "알아서 잘"이다

`'auto'`는 두 가지를 동시에 노린다 — 최대한 캐시하되, 동적이 필요한 컴포넌트를 막지는 않는다. 그래서 한 라우트 안에 정적인 부분과 동적인 부분이 **섞일 수 있다**.

나머지 세 값은 그 섞임을 없애는 쪽이다.

```
'auto'          섞임 허용 (기본)
'force-static'  통째로 정적으로 만든다
'error'         정적이 아니면 에러를 내서 알려준다
'force-dynamic' 통째로 동적으로 만든다
```

### 이름이 두 축을 섞고 있다

`force-static`과 `force-dynamic`은 방향이 반대인 쌍이지만, `error`는 방향이 아니라 **실패 처리 방식**이다. 정적을 원한다는 점에서는 `force-static`과 한편이고, 어긋났을 때 조용히 넘기지 않고 멈춰 세운다는 점만 다르다.

```
              정적을 원함              동적을 원함
──────────────────────────────────────────────────
조용히 처리   force-static             force-dynamic
멈춰 세움     error                    (없음)
```

---
## 종합

`dynamic`은 "이 라우트를 통째로 어느 쪽으로 몰 것인가"를 정하는 손잡이다. 기본값 `'auto'`는 정적·동적이 섞이는 걸 허용하고, 나머지 세 값은 그 섞임을 없앤다. 세 값 중 `error`만 방향이 아니라 어긋났을 때의 처리 방식을 정한다.

---

# `dynamic`을 `'error'`로 둘 때와 `'force-static'`으로 둘 때, 요청 시점 API를 만나면 각각 어떻게 되는가?

## 도입

둘 다 "정적으로 만들겠다"는 같은 목표를 갖는다. 그런데 쿠키를 읽는 컴포넌트를 만나는 순간 정반대로 갈라진다. 이 차이를 모르면 왜 어떤 설정에서만 빌드가 깨지는지 알 수 없다.

---
## 본문

> - **`'error'`**: Force prerendering and cache the data of a layout or page by causing an error if any components use Request-time APIs or uncached data.

"`'error'` — 어떤 컴포넌트든 요청 시점 API나 캐시 안 된 데이터를 쓰면 에러를 내서, 사전 렌더링과 데이터 캐싱을 강제한다."

- **Request-time APIs**: 요청이 실제로 들어와야만 값이 나오는 것들 — 쿠키·헤더·검색 파라미터.
- **prerendering**: 요청이 오기 전에 미리 렌더링해두는 것.

> This option is equivalent to:
> - `getStaticProps()` in the `pages` directory.
> - Setting the option of every `fetch()` request in a layout or page to `{ cache: 'force-cache' }`.
> - Setting the segment config to `fetchCache = 'only-cache'`.

"이 옵션은 Pages Router의 `getStaticProps()`, 모든 `fetch()`에 `{ cache: 'force-cache' }`를 준 것, 세그먼트 설정에 `fetchCache = 'only-cache'`를 준 것과 같다."

> - **`'force-static'`**: Force prerendering and cache the data of a layout or page by forcing `cookies`, `headers()` and `useSearchParams()` to return empty values.

"`'force-static'` — `cookies`·`headers()`·`useSearchParams()`가 빈 값을 반환하도록 만들어서 사전 렌더링과 데이터 캐싱을 강제한다."

- **empty values**: 빈 껍데기. 함수는 여전히 호출되고 에러도 안 나지만 알맹이가 없다.

> It is possible to `revalidate`, `revalidatePath`, or `revalidateTag`, in pages or layouts rendered with `force-static`.

"`force-static`으로 렌더링된 page·layout에서도 `revalidate`·`revalidatePath`·`revalidateTag`는 쓸 수 있다."

### 같은 목표, 정반대의 태도

둘 다 정적으로 만들려 한다. 갈리는 건 **막아섰을 때 어떻게 하느냐**다.

```
쿠키를 읽는 컴포넌트를 만났다

'error'          →  빌드를 멈추고 에러
                    "여기 정적이 아니야. 네가 고쳐."

'force-static'   →  cookies()가 빈 값을 돌려주고 계속 진행
                    "그건 없는 셈 치고 정적으로 만들게."
```

`'error'`는 시끄럽고 `'force-static'`은 조용하다. 그리고 이 조용함이 함정이다 — 로그인한 사용자를 구분하려고 쿠키를 읽었는데 빈 값이 오면, 에러 없이 **모든 사용자에게 비로그인 화면이 나가는** 상태가 만들어진다. 빌드는 성공하고 배포도 되며, 문제는 사용자 화면에서만 드러난다.

### 어느 쪽을 쓰나

"이 라우트는 정적이어야 한다"를 **보장하고 싶으면** `'error'`가 안전하다. 어긋나는 순간 빌드가 멈추므로 모르고 지나갈 수 없다.

`'force-static'`은 요청 시점 값이 진짜로 필요 없을 때만 맞다. 예를 들어 어떤 라이브러리가 내부에서 헤더를 읽는데 그 값이 화면에 영향을 주지 않는 경우처럼, "읽긴 하지만 안 써도 되는" 상황이다.

---
## 종합

`'error'`와 `'force-static'`은 목표가 같고 실패 처리만 다르다. 전자는 정적이 아닌 걸 발견하면 멈춰 세우고, 후자는 요청 시점 값을 빈 껍데기로 만들어 밀어붙인다. 후자는 에러 없이 잘못된 화면을 만들 수 있어서, 정적임을 보장하려는 목적이라면 전자가 안전하다.

---

# `dynamic = 'force-dynamic'`은 개별 `fetch` 옵션으로 환산하면 무엇과 같은가?

## 도입

라우트 설정과 개별 옵션은 별개의 층처럼 보이지만, 실은 위층이 아래층으로 번역돼 적용된다. 공식 문서가 그 환산표를 직접 적어뒀다.

---
## 본문

> - **`'force-dynamic'`**: Force dynamic rendering, which will result in routes being rendered for each user at request time. This option is equivalent to:
>   - Setting the option of every `fetch()` request in a layout or page to `{ cache: 'no-store', next: { revalidate: 0 } }`.
>   - Setting the segment config to `export const fetchCache = 'force-no-store'`

"`'force-dynamic'` — 동적 렌더링을 강제해, 요청 시점에 사용자마다 라우트를 렌더링하게 만든다. 이 옵션은 layout·page 안의 모든 `fetch()`에 `{ cache: 'no-store', next: { revalidate: 0 } }`를 준 것, 그리고 세그먼트 설정에 `fetchCache = 'force-no-store'`를 준 것과 같다."

- **equivalent to**: 내부적으로 같은 결과가 된다는 뜻. 별개의 기능이 아니라 같은 것을 다른 자리에서 표현한 것이다.
- **for each user**: 사용자마다 따로. 미리 만들어둔 하나를 나눠주는 게 아니다.

### 위층은 아래층의 줄임말이다

`force-dynamic` 한 줄이 하는 일을 손으로 풀어 쓰면 이렇다.

```tsx
// export const dynamic = 'force-dynamic' 와 같은 것

await fetch(a, { cache: 'no-store', next: { revalidate: 0 } })
await fetch(b, { cache: 'no-store', next: { revalidate: 0 } })
await fetch(c, { cache: 'no-store', next: { revalidate: 0 } })
// ... 그 라우트의 모든 fetch에
```

`fetch`가 셋뿐이면 손으로 쓸 수 있지만, 라이브러리 안에서 도는 `fetch`까지는 손이 안 닿는다. 라우트 설정은 그 손 안 닿는 것까지 한 번에 덮는다.

### 그래서 `force-`가 붙어 있다

이름의 `force-`는 **개별 옵션을 무시하고 덮어쓴다**는 표시다. 어떤 `fetch`가 `cache: 'force-cache'`를 명시했더라도 `force-dynamic` 아래에서는 그게 안 먹는다.

```
force- 없는 설정   →  아무도 안 정했을 때의 기본값. 개별 옵션이 이긴다.
force- 붙은 설정   →  개별 옵션을 덮어쓴다. 라우트 설정이 이긴다.
```

이 구분이 앞선 질문("어느 쪽이 이기는가")의 답이기도 하다.

---
## 종합

`force-dynamic`은 새로운 기능이 아니라 개별 `fetch` 옵션의 줄임말이다 — 그 라우트의 모든 `fetch`에 `no-store`와 `revalidate: 0`을 강제로 얹는다. 이름의 `force-`가 "개별 설정을 덮어쓴다"는 표시라서, 라우트 설정이 아래층을 이기는 유일한 경우다.
