# Next.js는 기본적으로 얼마나 많은 것을 캐싱하는가?

## 도입

Next.js는 빌드 타임에 라우트를 미리 렌더링(static rendering)하고, 데이터 요청 결과도 서버에 보관(cache)하는 것을 기본 전략으로 삼는다. 개발자가 아무 설정도 하지 않으면 가능한 모든 것을 캐싱하여 응답 속도와 서버 비용을 최적화한다.

---

## 본문

> By default, Next.js will cache as much as possible to improve performance and reduce cost. This means routes are **statically rendered** and data requests are **cached** unless you opt out.

"기본적으로 Next.js는 성능 향상과 비용 절감을 위해 가능한 한 많은 것을 캐싱한다. 이는 라우트가 정적으로 렌더링되고 데이터 요청이 캐시됨을 의미하며, opt out하지 않는 한 이 동작이 유지된다."

- **statically rendered**: 빌드 시점에 라우트의 HTML과 RSC payload를 미리 생성해두는 방식. 요청이 들어올 때마다 다시 렌더링하지 않는다. 이것이 없으면 트래픽이 몰릴 때 서버가 모든 요청에 대해 렌더링을 수행해야 해서 응답이 느려진다.
- **cached**: `fetch()` 응답이 서버의 Data Cache에 보관되어 동일한 요청을 다시 외부로 보내지 않는다.
- **opt out**: `{ cache: 'no-store' }`, Dynamic API 사용 등으로 기본 캐싱을 명시적으로 해제하는 것.

---

## 종합

Next.js의 기본 전략은 "캐싱을 끄려면 직접 opt out하라"는 방향이다. 아무것도 설정하지 않으면 빌드된 정적 결과물이 반복적으로 서빙되므로, 서버는 CDN처럼 동작한다. `cookies()`나 `headers()` 같은 Dynamic API를 쓰는 순간 해당 라우트는 정적 렌더링에서 벗어나 요청마다 동적으로 처리된다. 이 heuristic 덕분에 개발자는 캐싱 설정을 일일이 고민하지 않아도 최적화된 동작을 기본으로 얻는다.

---

---

# 캐싱 동작은 어떤 요인들에 따라 달라지는가?

## 도입

Next.js의 캐싱은 단일 스위치가 아니다. 라우트의 렌더링 방식, 데이터의 캐시 여부, 그리고 해당 요청이 첫 방문인지 이후 네비게이션인지에 따라 동작이 달라진다. 세 가지 축이 조합되어 최종 캐싱 동작이 결정된다.

---

## 본문

> Caching behavior changes depending on whether the route is statically or dynamically rendered, data is cached or uncached, and whether a request is part of an initial visit or a subsequent navigation.

"캐싱 동작은 라우트가 정적 또는 동적으로 렌더링되는지, 데이터가 캐시되는지 아닌지, 그리고 요청이 초기 방문인지 이후 네비게이션인지에 따라 달라진다."

- **statically or dynamically rendered**: 라우트가 빌드 타임에 고정되느냐, 요청 타임에 새로 만들어지느냐의 차이. Dynamic API가 있으면 동적으로 전환된다.
- **cached or uncached**: 데이터 레벨의 캐시 여부. `force-cache` vs `no-store`로 제어한다.
- **initial visit**: 사용자가 해당 라우트 URL에 처음 접근하는 서버 요청. Full Route Cache를 채우거나 비어있는 경우 새로 렌더링한다.
- **subsequent navigation**: 앱 내부에서 `<Link>` 클릭 등으로 이동하는 클라이언트 사이드 네비게이션. Router Cache에서 RSC payload를 꺼내 쓸 수 있다.

---

## 종합

이 세 가지 요인이 조합되면, 예를 들어 "정적 라우트 + 캐시된 데이터 + 초기 방문"은 Full Route Cache에서 즉시 응답하고, "동적 라우트 + 비캐시 데이터 + 이후 네비게이션"은 서버에 새 요청을 보내 렌더링한 뒤 Router Cache에 저장한다. 이 축들을 이해하면 "왜 이 페이지는 빠른데 저 페이지는 느린가"를 진단할 수 있다.

---

---

# Next.js의 4가지 캐싱 메커니즘을 비교하면?

## 도입

Next.js에는 요청 흐름을 따라 4개의 캐시 계층이 순서대로 놓여 있다. CPU 캐시가 L1 → L2 → L3 → RAM 순으로 가까운 곳을 먼저 확인하듯, Next.js도 가장 가까운 클라이언트 메모리부터 영구 서버 스토리지까지 단계적으로 조회한다.

---

## 본문

> Here's a high-level overview of the different caching mechanisms and their purpose:

"각 캐싱 메커니즘과 그 목적에 대한 고수준 개요:"

```
요청 흐름과 4계층 캐시

브라우저 클릭/네비게이션
    │
    ▼
[Router Cache]         ← 클라이언트 메모리 (RSC Payload)
    │ HIT → 즉시 반환
    │ MISS
    ▼
[Full Route Cache]     ← 서버 파일시스템 (HTML + RSC Payload)
    │ HIT → 반환
    │ MISS → 동적 렌더링 시작
    ▼
[Request Memoization]  ← 서버 메모리 (렌더 패스 내 중복 제거)
    │
    ▼
[Data Cache]           ← 서버 영구 스토리지 (fetch 응답 JSON)
    │ HIT → 반환
    │ MISS → 외부 API/DB 요청
```

- **Request Memoization**: 단일 렌더 패스 안에서 같은 `fetch()` 호출을 한 번만 실행하도록 중복 제거. 렌더 완료 시 소멸한다.
- **Data Cache**: `fetch()` 응답을 서버 영구 스토리지에 저장. 배포가 바뀌어도 유지되며 `revalidate`로 갱신한다.
- **Full Route Cache**: 라우트 전체의 HTML + RSC payload를 서버에 저장. 새 배포 시 초기화된다.
- **Router Cache**: 클라이언트 브라우저 메모리에 RSC payload를 저장. 세션 단위로 유지되며 새로고침 시 소멸한다.
- **RSC Payload**: React Server Component 렌더링 결과의 바이너리 표현. 클라이언트가 이를 받아 DOM에 적용(hydrate)한다.
- **Persistent**: 요청이나 배포를 넘어 유지되는 지속성. Data Cache가 여기 해당한다.

---

## 종합

4계층 구조의 핵심은 "저장 위치와 수명이 다르다"는 것이다. Router Cache는 클라이언트 메모리에 있어 새로고침으로 사라지고, Data Cache는 서버 영구 스토리지에 있어 배포에도 살아남는다. 이 구분이 없으면 "revalidateTag로 데이터를 갱신했는데 왜 화면이 안 바뀌지?" 같은 혼란이 생긴다 — Router Cache가 아직 이전 RSC payload를 들고 있기 때문이다.

---

---

# Dynamic API나 `{ cache: 'no-store' }`가 감지되면 라우트는 어떻게 되는가?

## 도입

Next.js는 라우트를 정적으로 렌더링하려 시도하다가, 런타임 정보에 의존하는 코드를 만나면 그 즉시 전략을 바꾼다. 이 전환은 라우트 단위로 일어나며, 한 컴포넌트의 Dynamic API 사용이 라우트 전체에 영향을 준다.

---

## 본문

> During rendering, if a Dynamic API or a fetch option of { cache: 'no-store' } is discovered, Next.js will switch to dynamically rendering the whole route.

"렌더링 중에 Dynamic API 또는 `{ cache: 'no-store' }` fetch 옵션이 감지되면, Next.js는 라우트 전체를 동적으로 렌더링하는 방식으로 전환한다."

- **Dynamic API**: `cookies()`, `headers()`, `searchParams` 등 요청 시점에만 알 수 있는 런타임 데이터에 접근하는 API. 빌드 타임에 미리 렌더링할 수 없으므로 정적 캐싱이 불가능하다.
- **dynamically rendering**: 요청이 들어올 때마다 서버에서 새로 렌더링하는 방식. Full Route Cache를 사용하지 않는다.
- **the whole route**: 트리거는 하나의 컴포넌트지만, 그 영향은 해당 라우트 전체로 확장된다. 다른 컴포넌트가 캐시된 데이터를 써도 라우트 자체는 동적으로 처리된다.

---

## 종합

`cookies()`를 레이아웃에서 한 번 호출하면, 그 라우트는 더 이상 정적이 아니다. 이것이 의도치 않게 성능에 영향을 줄 수 있다. 하지만 데이터 캐시는 여전히 동작하므로 — 라우트는 동적으로 렌더링되더라도 내부 `fetch()` 결과는 Data Cache에서 빠르게 가져올 수 있다. 동적 라우트 = 느린 라우트가 아니라는 점이 중요하다.

---

---

# Route가 fully static으로 렌더링되려면 어떤 조건이 필요한가? (hybrid 가능?)

## 도입

라우트가 Full Route Cache에 저장되어 정적으로 서빙되려면 데이터 전체가 캐시되어 있어야 한다. 그런데 Next.js는 라우트 안에서 캐시된 데이터와 캐시되지 않은 데이터를 함께 쓰는 hybrid 구성도 허용한다.

---

## 본문

> For a route to be fully static, all data must be cached.

"라우트가 완전히 정적으로 렌더링되려면 모든 데이터가 캐시되어 있어야 한다."

- **fully static**: 라우트 전체가 빌드 타임 또는 첫 요청 이후 Full Route Cache에 저장된 상태. 추가 렌더링 없이 저장된 HTML + RSC payload를 반환한다.
- **all data must be cached**: 라우트 안의 fetch 요청 중 하나라도 `no-store`이거나 캐시 없는 dynamic fetch면 fully static이 될 수 없다.

> However, you can have a dynamically rendered route that uses both cached and uncached data fetches.

"그러나 동적으로 렌더링되는 라우트 안에서 캐시된 데이터와 캐시되지 않은 데이터를 함께 사용할 수 있다."

- **hybrid**: 한 라우트 안에서 일부 `fetch()`는 Data Cache에서 빠르게 가져오고, 다른 `fetch()`는 매 요청마다 외부에서 새로 가져오는 구성. 라우트는 동적이지만 데이터 레벨에서는 선택적으로 캐싱된다.

---

## 종합

"동적 라우트 = 모든 데이터를 매번 새로 가져온다"는 오해를 버려야 한다. 동적 라우트 안에서도 대부분의 `fetch()`는 Data Cache를 통해 빠르게 응답할 수 있다. 예를 들어 사용자 개인 정보만 `no-store`로 가져오고, 공용 상품 목록은 `force-cache`로 캐시하면 — 라우트는 동적이지만 상품 목록 API는 캐시 히트를 얻는다.

---

---

# 개발자는 static/dynamic rendering을 직접 선택해야 하는가?

## 도입

캐싱 메커니즘을 상세히 이해하는 것은 내부 동작을 파악하는 데 도움이 되지만, Next.js는 대부분의 결정을 자동으로 처리한다. 캐싱을 제어하는 대부분의 판단은 코드가 어떤 API를 쓰는지에 따라 자동으로 내려진다.

---

## 본문

> This page helps you understand how Next.js works under the hood but is **not** essential knowledge to be productive with Next.js. Most of Next.js' caching heuristics are determined by your API usage and have defaults for the best performance with zero or minimal configuration.

"이 페이지는 Next.js 내부 동작을 이해하는 데 도움이 되지만, Next.js를 효율적으로 사용하는 데 필수 지식은 **아니다**. Next.js 캐싱 heuristics의 대부분은 API 사용 패턴에 따라 결정되며, 설정 없이 또는 최소한의 설정으로 최적의 성능을 갖는 기본값을 제공한다."

- **heuristics**: 경험적 판단 규칙. Next.js는 코드 패턴을 보고 "이 라우트는 정적으로 갈 수 있다", "이건 동적이어야 한다"를 자동으로 판단한다. 개발자가 `export const dynamic = 'force-dynamic'` 같은 설정을 명시하지 않아도 된다.
- **zero or minimal configuration**: 별도 설정 없이도 최적 기본값이 적용된다는 의미.

---

## 종합

이 캐싱 문서의 목적은 "왜 이 라우트가 동적이 됐는지"를 디버깅할 때 참고하는 것이다. 평소에는 `cookies()` 쓰면 동적, `fetch()` with `force-cache` 쓰면 데이터 캐시 활성화 — 이 정도만 알아도 충분히 실무를 진행할 수 있다. 캐싱이 의도와 다르게 동작할 때 이 4계층 구조를 떠올리면 원인을 추적하기 쉬워진다.
