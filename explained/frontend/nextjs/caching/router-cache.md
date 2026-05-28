# Router Cache란 무엇이며 무엇을 저장하는가?

## 도입

Router Cache는 Next.js App Router의 클라이언트 사이드 캐시다. 사용자가 페이지 간 네비게이션을 할 때 서버를 거치지 않고 브라우저 메모리에서 RSC payload를 꺼내 즉시 렌더링할 수 있도록 저장해둔다. 4개의 Next.js 캐시 중 유일하게 클라이언트(브라우저)에 위치한다.

---

## 본문

> Next.js has an in-memory client-side router cache that stores the RSC payload of route segments, split by layouts, loading states, and pages.

"Next.js에는 라우트 세그먼트의 RSC payload를 레이아웃, 로딩 상태, 페이지로 분리하여 저장하는 인메모리 클라이언트 사이드 Router Cache가 있다."

- **in-memory**: 브라우저의 메모리(RAM)에 저장된다. localStorage나 sessionStorage가 아닌 순수 JavaScript 메모리다. 새로고침하면 사라진다.
- **RSC payload**: React Server Component 렌더링 결과의 바이너리 표현. 전체 HTML이 아니라 클라이언트가 DOM을 업데이트하는 데 필요한 최소한의 정보만 담고 있다.
- **route segments**: App Router에서 라우트는 layout, loading, page 등의 세그먼트로 분리된다. Router Cache도 이 세그먼트 단위로 저장한다.

> When a user navigates between routes, Next.js caches the visited route segments. This results in instant back/forward navigation, no full-page reload between navigations.

"사용자가 라우트 간 네비게이션할 때, Next.js는 방문한 라우트 세그먼트를 캐시한다. 이는 즉각적인 앞/뒤로 네비게이션과 네비게이션 간 전체 페이지 리로드 없음을 가져온다."

- **instant back/forward navigation**: 브라우저 뒤로가기/앞으로가기 시 서버 요청 없이 캐시에서 즉시 렌더링한다. 마치 SPA처럼 느껴진다.
- **no full-page reload**: 클라이언트 사이드 네비게이션 시 HTML 전체를 다시 받지 않고, RSC payload만 교체한다.

> - Layouts are cached and reused on navigation (partial rendering).
> - Loading states are cached and reused on navigation for instant navigation.
> - Pages are not cached by default, but are reused during browser backward and forward navigation.

"- 레이아웃은 네비게이션 시 캐시되어 재사용된다(부분 렌더링). - 로딩 상태는 즉각적인 네비게이션을 위해 네비게이션 시 캐시되어 재사용된다. - 페이지는 기본적으로 캐시되지 않지만, 브라우저 앞/뒤로 네비게이션 중에는 재사용된다."

- **partial rendering**: 네비게이션 시 공통 레이아웃은 재사용하고, 바뀐 페이지 세그먼트만 교체한다. 상단 네비게이션이 깜빡이지 않는 이유다.

```
Router Cache 저장 구조 (브라우저 메모리)

/dashboard     방문
├── layout     RSC payload → 캐시됨
├── loading    RSC payload → 캐시됨
└── page       RSC payload → 기본 미캐시 (뒤로가기 시에만 재사용)

/dashboard/settings  방문
├── layout     (부모 layout 재사용)
└── page       RSC payload → 기본 미캐시

/dashboard     뒤로가기 → layout 캐시 HIT, page 재사용
```

---

## 종합

Router Cache가 없다면 앱 내 네비게이션마다 서버에 RSC payload 요청을 보내야 한다. 공통 레이아웃도 매번 새로 받아야 한다. Router Cache 덕분에 `/settings`에서 `/profile`로 이동할 때 공통 레이아웃의 RSC payload는 캐시에서 재사용되고, 페이지 컨텐츠만 서버에서 받아온다. 이것이 App Router 네비게이션이 SPA처럼 빠르게 느껴지는 핵심 이유다.

---

---

# Router Cache는 어디에 저장되는가? 새로고침하면 어떻게 되는가?

## 도입

Router Cache는 브라우저의 임시 메모리에 존재한다. 영구 저장소(localStorage, IndexedDB 등)가 아니므로 페이지를 새로고침하면 전부 사라진다.

---

## 본문

> The cache is stored in the browser's temporary **memory**.

"캐시는 브라우저의 임시 **메모리**에 저장된다."

- **temporary memory**: 브라우저 탭이 유지되는 동안만 존재하는 메모리. 탭을 닫거나 새로고침하면 소멸한다. 서버의 Data Cache가 파일시스템에 영속적으로 저장되는 것과 대조된다.

영구 저장소가 아니므로 새로고침하면 Router Cache 전체가 삭제된다. 이후 첫 네비게이션은 다시 서버에 RSC payload를 요청한다.

---

## 종합

"새로고침하면 느려진다"는 현상의 원인 중 하나가 Router Cache 소멸이다. 새로고침 전에는 캐시에서 즉시 응답하던 라우트들이, 새로고침 후에는 서버 요청이 필요해진다. 반면 이 특성 덕분에 데이터 freshness 문제가 자연스럽게 해결된다 — 새로고침만 하면 항상 최신 상태에서 시작한다.

---

---

# Router Cache의 지속 기간을 결정하는 두 요인은?

## 도입

Router Cache는 단순히 "새로고침할 때까지" 유지되는 것이 아니라, 세션 기반의 지속성과 자동 무효화 기간(Automatic Invalidation Period) 두 가지 요인으로 수명이 결정된다.

---

## 본문

> Two factors determine how long the router cache lasts:
>
> - **Session**: The cache persists across navigation. However, it's cleared **on page refresh**.
> - **Automatic Invalidation Period**: The cache of layouts and loading states is automatically invalidated after a specific time. The duration depends on how the resource was prefetched, and if the resource was statically generated.

"Router Cache의 지속 기간을 결정하는 두 가지 요인:
- **세션**: 캐시는 네비게이션에 걸쳐 유지된다. 그러나 페이지 새로고침 시 초기화된다.
- **자동 무효화 기간**: 레이아웃과 로딩 상태의 캐시는 특정 시간 후 자동으로 무효화된다. 기간은 리소스가 어떻게 prefetch되었는지, 그리고 리소스가 정적으로 생성되었는지에 따라 달라진다."

> This Router Cache is used to improve the navigation experience by storing previously visited routes and **prefetching future routes.**

"이 Router Cache는 이전에 방문한 라우트를 저장하고 **미래 라우트를 prefetch**하여 네비게이션 경험을 향상시키는 데 사용된다."

- **Session**: 탭이 살아있는 동안의 세션. 같은 탭에서 여러 페이지를 이동해도 캐시가 유지된다.
- **Automatic Invalidation Period**: "언제까지 이 캐시를 신선한 것으로 볼 것인가"의 타이머. 이 시간이 지나면 다음 접근 시 서버에 재요청한다.
- **prefetched**: `<Link>`가 뷰포트에 들어오거나 사용자가 hover할 때 Next.js가 미리 RSC payload를 가져오는 것. 이 데이터도 Router Cache에 저장된다.

---

## 종합

세션 기반 지속성은 "탭을 닫지 않는 한 유지"이고, 자동 무효화 기간은 "prefetch한 데이터가 너무 오래되면 갱신"의 타이머다. 두 요인이 OR 조건으로 동작한다 — 둘 중 먼저 발생하는 조건이 캐시를 소멸시킨다. 뒤로가기가 즉각적인 이유는 세션 기반 캐시 덕분이고, 오래된 데이터가 표시되지 않는 이유는 자동 무효화 기간 덕분이다.

---

---

# Automatic Invalidation Period는 prefetch 종류·정적/동적 페이지에 따라 어떻게 다른가?

## 도입

자동 무효화 기간은 `<Link>`의 `prefetch` prop 설정과 해당 페이지가 정적인지 동적인지에 따라 달라진다. 5분 또는 "미캐시"의 두 가지 결과로 단순화할 수 있다.

---

## 본문

> Default Prefetching (`prefetch={null}` or unspecified):
> - not cached for dynamic pages
> - 5 minutes for static pages
>
> Full Prefetching (`prefetch={true}` or `router.prefetch`):
> - 5 minutes for both static & dynamic pages

"기본 Prefetch (`prefetch={null}` 또는 미지정):
- 동적 페이지: 캐시되지 않음
- 정적 페이지: 5분

Full Prefetch (`prefetch={true}` 또는 `router.prefetch`):
- 정적·동적 페이지 모두: 5분"

- **Default Prefetching**: `<Link>` 컴포넌트의 기본 동작. 뷰포트에 들어올 때 자동으로 prefetch하되, 동적 페이지는 Router Cache에 저장하지 않는다.
- **Full Prefetching**: `prefetch={true}`로 명시하거나 `router.prefetch()`를 직접 호출한 경우. 동적 페이지도 5분간 캐시한다.
- **individual segment**: 무효화는 라우트 전체가 아닌 각 세그먼트 단위로 독립적으로 발생한다.

> While a page refresh will clear **all cached segments**, the automatic invalidation period **only affects the individual segment** from the time it was prefetched.

"페이지 새로고침이 **모든 캐시된 세그먼트**를 초기화하는 반면, 자동 무효화 기간은 prefetch된 시점부터 **개별 세그먼트**에만 영향을 준다."

```
Automatic Invalidation Period 비교

                          동적 페이지    정적 페이지
Default prefetch          미캐시         5분
prefetch={true}           5분            5분
router.prefetch()         5분            5분
```

---

## 종합

동적 페이지를 기본 prefetch로 설정하면 Router Cache에 저장조차 되지 않는다 — 항상 서버에 요청한다. 개인화 데이터를 표시하는 동적 페이지에서 의도한 동작이다. `prefetch={true}`로 바꾸면 동적 페이지도 5분간 캐시되어 네비게이션이 빨라지지만, 그만큼 데이터가 오래됐을 수 있다는 트레이드오프가 있다.

---

---

# Router Cache를 invalidate 하는 두 가지 방법은?

## 도입

Router Cache를 프로그래밍 방식으로 무효화하는 방법은 두 가지다. 하나는 Server Action에서 경로/태그 기반으로 재검증하는 것이고, 다른 하나는 `router.refresh()`를 호출하는 것이다.

---

## 본문

> There are two ways you can invalidate the Router Cache:
>
> - **In a Server Action**:
>   - Revalidating data on-demand by path with (`revalidatePath`) or by cache tag with (`revalidateTag`).
>   - Using `cookies.set` or `cookies.delete` invalidates the Router Cache to prevent routes that use cookies from becoming stale (e.g. authentication).
> - Calling `router.refresh` will invalidate the Router Cache and make a new request to the server for the current route.

"Router Cache를 무효화하는 두 가지 방법:
- **Server Action에서**:
  - `revalidatePath`로 경로 기반, `revalidateTag`로 캐시 태그 기반의 온디맨드 데이터 재검증.
  - `cookies.set` 또는 `cookies.delete` 사용 시 라우트가 오래된 쿠키를 사용하지 않도록 Router Cache를 무효화한다(예: 인증).
- `router.refresh` 호출 시 Router Cache를 무효화하고 현재 라우트에 대해 새 서버 요청을 만든다."

- **Server Action**: `'use server'` 지시어를 가진 함수. 폼 제출, 버튼 클릭 등 사용자 액션 후 호출되며, 서버에서 실행되면서 Router Cache를 즉시 무효화할 수 있다.
- **revalidatePath / revalidateTag**: 특정 경로나 태그에 연결된 캐시를 모두 무효화한다. Data Cache + Full Route Cache + Router Cache를 연쇄적으로 초기화한다.
- **cookies.set / cookies.delete**: 쿠키가 바뀌면 해당 쿠키에 의존하는 라우트의 Router Cache가 무효화된다. 로그인/로그아웃 후 이전 페이지 캐시가 즉시 비워지는 이유다.
- **router.refresh**: `useRouter()` 훅이 제공하는 메서드. 클라이언트 사이드에서 Router Cache만 무효화하며 Data Cache와 Full Route Cache는 건드리지 않는다.

---

## 종합

두 방법의 차이는 범위와 사이드 이펙트다. Server Action의 `revalidatePath`는 Data Cache와 Full Route Cache까지 함께 무효화하고, `router.refresh()`는 Router Cache만 무효화하여 서버에서 현재 라우트를 다시 렌더링한다. 로그아웃 후 "이전 페이지 내용이 보이는" 문제는 Router Cache가 남아있기 때문이며, Server Action에서 `cookies.delete`를 하면 자동으로 해결된다.
