# App Router에서 `<Link>`의 기본 prefetch 동작은? (prefetch prop 미지정 시)

## 도입

App Router에서 `<Link>` 컴포넌트는 뷰포트에 들어오면 자동으로 대상 라우트를 prefetch한다. 기본값(prop 미지정)일 때의 정확한 범위는 `loading.js` 파일의 존재 여부에 따라 달라진다.

---

## 본문

> The `<Link>`'s default prefetching behavior (i.e. when the prefetch prop is left unspecified or set to null) is different depending on your usage of loading.js.
>
> Only the shared layout, down the rendered "tree" of components until the first loading.js file, is prefetched and cached for 30s. This reduces the cost of fetching an entire dynamic route, and it means you can show an instant loading state for better visual feedback to users.

"`<Link>`의 기본 prefetching 동작(prefetch prop을 지정하지 않거나 null로 설정한 경우)은 `loading.js` 사용 여부에 따라 달라진다. 첫 번째 `loading.js` 파일까지 렌더링된 컴포넌트 '트리'를 내려가며 공유된 레이아웃만이 30초 동안 prefetch되고 캐시된다. 이는 전체 동적 라우트를 가져오는 비용을 줄이고, 사용자에게 더 나은 시각적 피드백을 위한 즉각적인 로딩 상태를 보여줄 수 있음을 의미한다."

- **shared layout**: 여러 페이지가 공유하는 레이아웃 파일(`layout.js`). prefetch 대상에 포함된다.
- **loading.js**: 라우트 세그먼트의 로딩 UI를 정의하는 파일. 이 파일이 있는 세그먼트까지만 prefetch한다. `loading.js` 아래의 실제 페이지 콘텐츠는 prefetch하지 않는다.
- **instant loading state**: `loading.js`의 fallback UI가 이미 prefetch되어 있으므로, 링크 클릭 즉시 로딩 UI를 표시할 수 있다. 서버 응답을 기다리는 동안 빈 화면이 아닌 의미 있는 UI를 보여준다.

```
기본 prefetch 범위 (/dashboard/settings)

app/
├── layout.js          ← prefetch됨 (shared layout)
├── dashboard/
│   ├── layout.js      ← prefetch됨 (shared layout)
│   ├── loading.js     ← prefetch됨 (여기까지)
│   └── settings/
│       └── page.js    ← prefetch 안됨 (loading.js 아래)
```

---

## 종합

기본 prefetch는 "레이아웃 + 로딩 UI"만 미리 가져온다. 실제 페이지 콘텐츠는 사용자가 클릭할 때 가져온다. 이 전략의 장점은 비용 절감이다 — 뷰포트에 보이는 모든 `<Link>`의 전체 페이지를 prefetch하면 불필요한 네트워크 요청이 과도하게 발생한다. `loading.js` 경계를 기준으로 최소한의 데이터만 미리 가져오면서도 즉각적인 로딩 UI를 제공할 수 있다.

---

# `<Link>`의 `prefetch` prop을 true/false로 설정하면 각각 어떻게 동작하는가?

## 도입

`prefetch` prop으로 기본 동작을 명시적으로 제어할 수 있다. `false`는 prefetch를 비활성화하고, `true`는 `loading.js` 경계를 넘어 전체 페이지 데이터까지 prefetch한다.

---

## 본문

> You can disable prefetching by setting the prefetch prop to false. Alternatively, you can prefetch the full page data beyond the loading boundaries by setting the prefetch prop to true.

"prefetch prop을 false로 설정하여 prefetching을 비활성화할 수 있다. 또는 prefetch prop을 true로 설정하여 loading 경계를 넘어 전체 페이지 데이터를 prefetch할 수 있다."

- **loading boundaries**: `loading.js` 파일을 기준으로 한 prefetch 경계. 기본값에서는 이 경계까지만 prefetch하지만, `prefetch={true}`는 이 경계를 넘어서 실제 페이지 컨텐츠까지 모두 가져온다.

```
prefetch prop 비교

prefetch 미지정/null    shared layout + loading.js까지만 prefetch (30초)
prefetch={true}        loading 경계를 넘어 전체 페이지 데이터 prefetch (5분)
prefetch={false}       prefetch 비활성화 (클릭 시점에 요청)
```

`prefetch={true}`는 Router Cache에서 5분간 유지된다. 정적 페이지는 물론 동적 페이지도 5분 캐시 대상이 된다.

---

## 종합

`prefetch={true}`는 중요한 핵심 페이지(대시보드 홈, 핵심 1뎁스 페이지 등)에 선택적으로 적용할 때 효과적이다. 뷰포트에 들어오는 모든 `<Link>`에 `prefetch={true}`를 쓰면 과도한 prefetch 요청이 발생한다. `prefetch={false}`는 긴 리스트에서 각 항목이 링크인 경우, 마우스가 지나치기만 해도 prefetch가 발생하는 문제를 방지할 때 유용하다.

---

# [UNVERIFIED] App Router는 Pages Router의 prefetching 동작과 어떻게 다른가?

## 도입

Next.js는 Pages Router에서 App Router로 넘어오면서 prefetching 전략이 크게 바뀌었다. 가장 눈에 띄는 차이는 hover(마우스 오버) 시점의 prefetch가 App Router에서 빠졌다는 점이다. 대신 App Router는 뷰포트 기반 prefetch를 전면에 내세우면서, 서버 렌더링 라우트에도 prefetch를 적용할 수 있게 되었다.

---

## 본문

Pages Router에는 `<Link>` 위에 마우스를 올리는 순간 prefetch 요청을 즉시 보내는 동작이 내장되어 있었다. 이 hover prefetching은 클릭 직전의 짧은 시간을 활용해 데이터를 미리 받아두는 방식이었다.

App Router에서는 이 hover prefetching이 제거되었다. 대신 `<Link>`가 뷰포트 안에 들어오는 시점에 자동으로 prefetch가 시작된다. 뷰포트 기반이라 사용자가 스크롤을 내리며 링크가 화면에 보이기 시작하면 즉시 prefetch가 발동한다.

```
Pages Router prefetching 트리거
─────────────────────────────────────────────
뷰포트 진입     → prefetch 시작
마우스 오버     → prefetch 시작 (hover)

App Router prefetching 트리거
─────────────────────────────────────────────
뷰포트 진입     → prefetch 시작
마우스 오버     → (내장 없음 — 직접 구현 필요)
```

또한 App Router에서는 Server Component 기반 라우트(SSR 느낌으로 구성한 페이지)도 prefetch 대상에 포함된다. Pages Router 시절에는 prefetching이 정적 라우트 위주로 동작했던 것에 비해, App Router는 동적 라우트에도 부분 prefetch(shared layout + loading.js 범위)를 적용하게 되었다.

---

## 종합

Pages Router → App Router 전환의 핵심 변화는 "hover 기반"에서 "뷰포트 기반"으로의 전환이다. 뷰포트 기반은 사용자가 스크롤하는 시점에 자동으로 prefetch가 시작되므로 hover보다 더 이른 시점에 준비를 시작할 수 있다. 반면 마우스를 올리는 동작은 더 이상 내장으로 지원되지 않으므로, hover prefetching이 필요한 경우 직접 구현해야 한다.

---

# [UNVERIFIED] Pages Router에 있던 hover prefetching이 App Router에서 빠졌을 때, 왜 직접 구현해야 한다고 판단했는가?

## 도입

App Router에서 hover prefetching이 제거되었을 때, 이를 직접 복원할 가치가 있는지 판단해야 했다. 핵심 질문은 "마우스를 올리고 클릭하기까지의 짧은 시간이 prefetch에 의미 있는 시간인가"였다.

---

## 본문

직접 측정한 결과, 마우스를 올리고 클릭하기까지 걸리는 시간은 **0.2 ~ 0.5초**였다. 의도적으로 빠르게 클릭하려고 해도 0.16초가 나왔다.

이 시간이 짧다고 느껴질 수 있지만, prefetch 관점에서는 의미 있는 창(window)이다. 0.2초라도 prefetch를 미리 시작하면 그만큼 네트워크 요청이 앞당겨진다. 특히 느린 네트워크 환경이나 서버 응답이 오래 걸리는 페이지에서는 이 0.2초의 선행 요청이 체감 속도에 실제로 영향을 준다.

```
클릭까지 걸리는 시간 측정값
─────────────────────────────────────────
일반적인 경우    0.2 ~ 0.5초
의도적으로 빠름  0.16초

→ hover 시점에 prefetch를 시작하면
  이 시간만큼 네트워크 요청을 앞당길 수 있다
```

결론: hover prefetching은 0.2초 이상의 선행 이득을 사용자 아무 행동 없이 얻는 기법이다. 충분히 구현할 가치가 있다고 판단되었다.

---

## 종합

UX 최적화의 기준선은 "사용자가 체감할 수 있는가"다. 200ms는 인간이 즉각적으로 느끼는 100ms 임계값을 살짝 넘는 구간으로, 여기서 지연이 줄면 페이지가 "빠르다"는 인상을 준다. 개발 비용 대비 체감 이득이 분명하므로, hover prefetching을 직접 구현하는 선택은 합리적이다.

---

# [UNVERIFIED] hover prefetching을 prefetch prop 값에 따라 어떻게 다르게 적용해야 하는가?

## 도입

hover prefetching을 직접 구현할 때, 모든 `<Link>`에 동일하게 적용하면 안 된다. `prefetch` prop이 이미 어떤 값으로 설정되어 있느냐에 따라 hover 동작을 다르게 처리해야 한다. Pages Router의 원래 설계를 기준으로 삼아, 그 스펙을 그대로 재현하는 것이 목표다.

---

## 본문

`prefetch` prop 값에 따른 hover prefetching 적용 규칙:

```
prefetch prop 값별 hover prefetching 적용 여부
─────────────────────────────────────────────────────────
undefined (미지정)   hover 추가 O
false               hover 추가 X
true                hover 추가 X
```

- **`prefetch` 미지정(undefined)**: hover prefetching을 추가한다. Pages Router의 원래 동작이 "기본값에서 hover prefetching 포함"이었으므로, 그 스펙을 재현한다.
- **`prefetch={false}`**: hover도 같이 끈다. `prefetch={false}`는 명시적으로 prefetch를 비활성화하겠다는 의도이므로, hover로 prefetch를 우회하는 것은 설계 의도에 반한다.
- **`prefetch={true}`**: hover를 추가하지 않는다. 이미 뷰포트에 들어온 시점에 전체 페이지 데이터를 prefetch하므로, hover 시점에 또 요청할 필요가 없다. 뷰포트에 보이는 순간 이미 prefetch가 완료되어 있다.

---

## 종합

이 규칙의 기준은 "Pages Router가 원래 어떻게 동작했는가"다. Pages Router 제작 당시 설계자들이 정한 기본 동작을 App Router 환경에 이식하는 것이 목표이므로, 그 스펙을 흉내낸다. 결과적으로 `prefetch` 미지정일 때만 hover prefetching이 붙고, 명시적으로 값을 지정한 경우에는 hover를 추가하지 않는다. 명시적 설정은 이미 의도가 담긴 것이므로 hover로 개입하지 않는다.

---

# [UNVERIFIED] 왜 prefetch={false}일 때는 hover prefetching도 같이 꺼야 하는가?

## 도입

`prefetch={false}`를 설정하는 대표적인 상황은 긴 리스트에서 각 항목이 링크인 경우다. 이 상황에서 hover prefetching까지 켜두면 의도치 않은 대량 prefetch 요청이 발생한다.

---

## 본문

`prefetch={false}`의 주요 사용처를 생각해보면 이유가 명확해진다. 예를 들어 게시글 리스트 페이지처럼 수십 개의 항목 각각이 `<Link>`인 구조를 떠올려보자. 사용자가 원하는 게시글을 찾기 위해 목록 위에서 아래로 마우스를 움직이면, 마우스가 지나치는 모든 `<Link>` 위에서 `onMouseEnter` 이벤트가 연속으로 발생한다.

```
게시글 리스트 예시
─────────────────────────────────────────────
[게시글 1 링크]  ← 마우스가 지나감 → onMouseEnter 발생
[게시글 2 링크]  ← 마우스가 지나감 → onMouseEnter 발생
[게시글 3 링크]  ← 마우스가 지나감 → onMouseEnter 발생
...
[게시글 30 링크] ← 마우스가 지나감 → onMouseEnter 발생

hover prefetching이 켜져 있으면: 30개 prefetch 요청 동시 발화
```

`prefetch={false}`를 쓴 이유가 "이 리스트에서 prefetch를 끄고 싶어서"인데, hover prefetching이 켜져 있으면 그 의도가 무력화된다. `prefetch={false}`의 의미는 "뷰포트 기반 prefetch를 끈다"는 것이지, hover 동작은 별개의 메커니즘이기 때문이다.

이 문제는 Next.js GitHub 이슈에서도 실제로 제기된 바 있다 — "마우스 오버 prefetching을 끄고 싶은데 방법이 없다"는 불만이다. `prefetch={false}`를 설정한 경우라면 hover도 함께 꺼져야 일관성이 있다.

---

## 종합

`prefetch={false}`는 "이 링크는 prefetch를 원하지 않는다"는 명시적 의도다. hover prefetching은 그 의도를 뒤집는 예외 경로가 되어서는 안 된다. prop 설정과 hover 동작이 서로 다른 결과를 낸다면 예측 불가능한 동작이 된다. hover는 `prefetch` prop의 의도를 그대로 따르는 것이 올바른 설계다.

---

# [UNVERIFIED] prefetch 옵션을 어떤 페이지에 우선 적용하는 것이 효과적인가?

## 도입

App Router의 prefetching은 기본 동작만으로도 상당히 강력하다. 따라서 추가 최적화(`prefetch={true}`)는 모든 페이지에 무분별하게 적용하기보다, 실질적인 이득이 큰 핵심 페이지에 선별적으로 적용하는 것이 효과적이다.

---

## 본문

prefetch 옵션을 우선 적용하면 효과적인 페이지:

**1. 홈 페이지 (로그인 성공 후 기본적으로 이동하는 페이지)**

로그인 직후 가장 먼저 보게 되는 페이지다. 이 페이지로의 이동은 거의 모든 사용자가 반드시 거치는 경로이므로, 여기서 체감 속도가 빠르면 앱 전체의 첫인상이 좋아진다. `prefetch={true}`로 전체 페이지 데이터까지 미리 받아두면, 로그인 완료 즉시 홈 화면이 나타나는 느낌을 줄 수 있다.

**2. 헤더나 바텀 내비게이션의 핵심 1뎁스 페이지**

헤더나 하단 탭 바에 항상 노출된 링크들은 사용자가 앱을 쓰는 내내 뷰포트에 들어와 있다. 기본 prefetch만으로도 이미 뷰포트 기반으로 prefetch가 발동하지만, `prefetch={true}`를 추가하면 loading.js 경계 너머의 실제 페이지 데이터까지 미리 받아둘 수 있다.

```
우선 적용 대상 예시
─────────────────────────────────────────────
홈 페이지         → 로그인 후 첫 이동 지점, 체감 속도 직결
헤더 1뎁스 링크   → 항상 뷰포트에 노출, 전환 빈도 높음
바텀 탭 링크      → 모바일 앱의 핵심 내비게이션 경로
```

---

## 종합

prefetch 최적화는 선택과 집중이 핵심이다. App Router의 기본 prefetch가 이미 상당히 강력하므로, 모든 `<Link>`에 `prefetch={true}`를 남발하면 불필요한 네트워크 요청만 늘어난다. 사용자가 반드시 거치는 경로, 자주 이동하는 핵심 페이지에 집중하는 것이 비용 대비 이득이 가장 크다. 중요도가 낮은 페이지는 기본 prefetch(뷰포트 기반 + loading.js 경계)로 충분하다.
