# Next.js의 네 가지 캐시는 각각 무엇을 어디에 저장하고 얼마나 유지되는가?

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

# 렌더링 도중 Dynamic API나 `{ cache: 'no-store' }`를 만나면 그 라우트는 어떻게 되는가?

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

# 라우트가 fully static이 되려면 어떤 조건이 필요하며, 한 라우트에 캐시된 데이터와 캐시 안 된 데이터를 섞을 수 있는가?

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

### 왜 섞을 수 있는가는 다른 문서가 답한다

이 문서는 "섞을 수 있다"는 사실까지만 다룬다. 그것이 가능한 **이유** — UI(RSC Payload)와 데이터가 별개의 캐시에 들어간다 — 는 [../rendering/server-client/pipeline.md](../rendering/server-client/pipeline.md)의 「RSC Payload와 데이터가 따로 캐시되면 무엇이 가능해지는가?」가 담당한다.

---

## 종합

"동적 라우트 = 모든 데이터를 매번 새로 가져온다"는 오해를 버려야 한다. 동적 라우트 안에서도 대부분의 `fetch()`는 Data Cache를 통해 빠르게 응답할 수 있다. 예를 들어 사용자 개인 정보만 `no-store`로 가져오고, 공용 상품 목록은 `force-cache`로 캐시하면 — 라우트는 동적이지만 상품 목록 API는 캐시 히트를 얻는다.
