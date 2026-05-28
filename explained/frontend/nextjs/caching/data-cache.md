# Data Cache란 무엇이며 어디에 저장되는가?

## 도입

Data Cache는 `fetch()` 응답을 서버의 영구 저장소에 보관하는 Next.js 내장 캐시다. 사용자 요청이 끝나도, 심지어 새 배포가 이루어져도 Data Cache는 유지된다. Request Memoization이 렌더 패스 동안의 메모리 내 중복 제거라면, Data Cache는 요청과 배포를 넘는 영속 저장이다.

---

## 본문

> Next.js has a built-in Data Cache that **persists** the result of data fetches across incoming **server requests** and **deployments**. This is possible because Next.js extends the native `fetch` API to allow each request on the server to set its own persistent caching semantics.

"Next.js에는 들어오는 서버 요청과 배포에 걸쳐 데이터 패칭 결과를 **영속** 저장하는 내장 Data Cache가 있다. 이는 Next.js가 네이티브 `fetch` API를 확장하여 서버에서의 각 요청이 자체적인 영속 캐싱 의미론을 설정할 수 있게 하기 때문에 가능하다."

- **persists**: 단순히 메모리에 두는 것이 아니라 영구 저장장치(파일시스템 등)에 JSON 형태로 기록한다. 서버가 재시작되거나 새 요청이 와도 살아있다. 메모리에 저장했다면 OOME(Out Of Memory Error) 위험이 있기 때문에 영구 저장장치를 선택했다.
- **server requests**: 한 유저의 요청이 끝나도 다음 유저의 요청에 그대로 재사용된다.
- **deployments**: 새 배포 후에도 Data Cache는 사라지지 않는다. 이는 Full Route Cache(새 배포 시 초기화됨)와 다른 점이다.
- **extends the native `fetch` API**: Node.js의 기본 `fetch`에 `cache`, `next.revalidate`, `next.tags` 등의 옵션을 추가한 것. Next.js 서버 환경에서 `fetch()`를 쓰면 자동으로 이 확장된 버전이 동작한다.

---

## 종합

Data Cache가 없다면 `fetch(url, { cache: 'force-cache' })`를 써도 매 요청마다 외부 API를 호출하게 된다. 천만 명이 같은 페이지를 방문할 때 천만 번 외부 API를 부르는 대신, 첫 요청 결과를 Data Cache에 저장하고 이후 요청은 캐시에서 즉시 응답할 수 있다. 특히 모든 유저에게 동일하게 노출되는 공용 데이터(상품 목록, 공지사항 등)에서 서버 사이드 Data Cache의 효과가 크다.

---

---

# `force-cache` fetch가 수행될 때 내부 동작 순서는?

## 도입

`cache: 'force-cache'`로 `fetch()`를 호출할 때 Next.js는 Data Cache를 먼저 확인하고, 없으면 외부 소스에 요청한 뒤 결과를 저장한다. 이 과정에서 Request Memoization도 함께 동작하여 같은 렌더 패스 안에서의 중복 호출을 제거한다.

---

## 본문

> - The first time a `fetch` request is called during rendering, Next.js checks the Data Cache for a cached response.
> - If a cached response is found, it's returned immediately and memoized.
> - If a cached response is not found, the request is made to the data source, the result is stored in the Data Cache, and memoized.
> - For uncached data (e.g. `{ cache: 'no-store' }`), the result is always fetched from the data source, and memoized.
> - Whether the data is cached or uncached, the requests are always memoized to avoid making duplicate requests for the same data during a React render pass.

```
fetch('https://api.example.com/posts', { cache: 'force-cache' }) 호출 시

렌더링 시작
    │
    ▼
Request Memoization 확인
    ├── HIT → 메모리에서 즉시 반환 (같은 렌더 패스 내 중복 호출)
    └── MISS
         │
         ▼
    Data Cache 확인
         ├── HIT (fresh) → 캐시에서 반환 + Memoize
         └── MISS / STALE
              │
              ▼
         외부 소스 요청
              │
              ▼
         Data Cache에 저장 + Memoize
```

- **memoized**: Data Cache HIT/MISS와 무관하게, 현재 렌더 패스 안에서 같은 URL+옵션의 두 번째 호출은 메모리에서 즉시 반환된다.
- **render pass**: React가 컴포넌트 트리를 한 번 렌더링하는 단위. 렌더 완료 시 memoization 항목은 전부 소멸한다.
- **no-store 데이터도 memoize됨**: `no-store`라도 Data Cache를 건너뛸 뿐, 같은 렌더 패스 안에서의 중복 호출 방지(memoization)는 여전히 적용된다.

---

## 종합

Request Memoization과 Data Cache는 역할이 다르다. Memoization은 "이번 렌더링 안에서의 중복 제거"이고, Data Cache는 "요청과 배포를 넘나드는 영속 저장"이다. `force-cache` fetch는 이 두 단계를 모두 거치며, `no-store` fetch는 Data Cache를 건너뛰되 Memoization은 여전히 적용된다.

---

---

# Data Cache는 클라이언트 사이드에서도 작동하는가?

## 도입

`fetch()`의 `cache` 옵션은 환경에 따라 다른 캐시에 영향을 준다. 서버에서 호출하면 Next.js Data Cache, 클라이언트에서 호출하면 브라우저 HTTP 캐시를 제어한다. 두 캐시는 완전히 별개의 저장소다.

---

## 본문

> In Next.js, the `cache` option indicates how a server-side request will interact with the server's Data Cache.

"Next.js에서 `cache` 옵션은 서버 사이드 요청이 서버의 Data Cache와 어떻게 상호작용할지를 나타낸다."

- **server-side request**: Server Component, Route Handler, Server Action 등 서버에서 실행되는 `fetch()`. 클라이언트에서 실행되는 `fetch()`는 이 정의에 해당하지 않는다.
- **server's Data Cache**: Next.js 서버가 관리하는 영속 데이터 캐시. 브라우저 캐시와 분리된 서버 전용 저장소다.

Data Cache는 서버 사이드에만 적용된다. 클라이언트 컴포넌트에서 `fetch(url, { cache: 'force-cache' })`를 호출하면 Next.js Data Cache가 아니라 브라우저의 HTTP 캐시(Cache-Control 헤더 기반)에 영향을 준다.

---

## 종합

이 구분을 놓치면 클라이언트 컴포넌트에서 `force-cache`를 써도 서버 Data Cache 히트가 발생하지 않는다는 사실을 인지하지 못한다. 데이터를 서버 캐시로 최적화하려면 해당 `fetch()`가 Server Component, generateMetadata, generateStaticParams 등 서버 실행 컨텍스트에 있어야 한다.

---

---

# `fetch()`의 `cache` 옵션 기본값(auto no cache), `no-store`, `force-cache`는 각각 어떻게 동작하는가?

## 도입

Next.js에서 `fetch()`의 `cache` 옵션은 세 가지 값으로 동작 방식이 달라진다. 특히 기본값(unset)은 개발 환경과 프로덕션 빌드에서 서로 다르게 동작하므로, 개발 중에 확인한 동작이 배포 후 달라질 수 있다.

---

## 본문

**auto no cache (기본값, 미지정)**

> Next.js fetches the resource from the remote server on every request in development, but will fetch once during `next build` because the route will be statically prerendered. If Dynamic APIs are detected on the route, Next.js will fetch the resource on every request.

"개발 환경에서는 매 요청마다 원격 서버에서 가져오지만, `next build` 시점에는 라우트가 정적으로 사전 렌더링되므로 한 번만 가져온다. 라우트에 Dynamic API가 감지되면 매 요청마다 가져온다."

- **statically prerendered**: 빌드 시 라우트 전체를 렌더링하여 결과를 저장. 기본값 fetch는 이때 한 번 실행되어 결과가 함께 캐시된다.
- **Dynamic APIs detected**: `cookies()` 등이 있으면 빌드 시 한 번이 아니라 요청마다 새로 가져온다.

**no-store**

> Next.js fetches the resource from the remote server on every request, even if Dynamic APIs are not detected on the route.

"Dynamic API 감지 여부와 무관하게 매 요청마다 원격 서버에서 가져온다."

- **no-store**: Data Cache를 완전히 건너뛰는 옵션. 항상 최신 데이터가 필요한 개인화 데이터(사용자 알림, 잔액 등)에 사용한다.

**force-cache**

> Next.js looks for a matching request in its Data Cache. If there is a match and it is fresh, it will be returned from the cache. If there is no match or a stale match, Next.js will fetch the resource from the remote server and update the cache with the downloaded resource.

"Next.js의 Data Cache에서 일치하는 요청을 찾는다. 일치하는 항목이 있고 유효(fresh)하면 캐시에서 반환한다. 일치 항목이 없거나 만료(stale)됐으면, 원격 서버에서 가져온 후 캐시를 갱신한다."

- **fresh**: `revalidate` 시간이 지나지 않은 유효한 캐시 상태.
- **stale**: 유효 기간이 지나 재검증이 필요한 캐시 상태. stale-while-revalidate 패턴처럼 새 데이터를 받아오는 동안 이전 데이터를 반환할 수도 있다.

```tsx
// no-store: 매 요청마다 새로 가져옴
const res = await fetch('https://api.example.com/user', {
  cache: 'no-store',
})

// force-cache: Data Cache 활용
const res = await fetch('https://api.example.com/products', {
  cache: 'force-cache',
})

// revalidate: 60초마다 갱신
const res = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60 },
})
```

---

## 종합

세 옵션은 "얼마나 자주 외부 소스를 호출하는가"의 스펙트럼이다. `force-cache`는 Data Cache를 최대한 활용하고, `no-store`는 항상 원본을 호출하며, 기본값은 라우트 특성에 따라 자동으로 결정된다. 실무에서는 공용 데이터는 `force-cache` 또는 `revalidate`, 개인화 데이터는 `no-store`가 일반적인 선택이다.

---

---

# 한 페이지 안에서 cached data와 uncached data를 혼합할 수 있는가?

## 도입

한 라우트 안에서 모든 데이터를 같은 방식으로 캐싱할 필요는 없다. `no-store` fetch가 하나라도 있으면 라우트 전체가 Full Route Cache에서 제외되지만, Data Cache 레벨에서는 여전히 개별 fetch마다 캐싱 여부를 독립적으로 제어할 수 있다.

---

## 본문

> If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache. The data for the specific `fetch` request will be fetched for every incoming request. Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache. **This allows for a hybrid of cached and uncached data.**

"라우트에 캐시되지 않는 `fetch` 요청이 있으면, 라우트 전체가 Full Route Cache에서 제외된다. 해당 특정 `fetch` 요청의 데이터는 모든 요청마다 가져와진다. 캐싱에서 opt out하지 않은 다른 `fetch` 요청들은 여전히 Data Cache에 캐시된다. **이를 통해 캐시된 데이터와 캐시되지 않은 데이터의 hybrid 구성이 가능하다.**"

- **opt the route out of the Full Route Cache**: 단 하나의 `no-store` fetch가 라우트 전체의 Full Route Cache 적용을 해제한다. 라우트는 동적으로 렌더링되어야 한다.
- **hybrid of cached and uncached data**: 라우트가 동적으로 렌더링되더라도, 개별 `fetch()`는 각자의 캐싱 설정을 유지한다. `no-store` fetch만 외부 API를 호출하고 나머지는 Data Cache에서 응답한다.

```tsx
// 이 라우트는 Full Route Cache에서 제외됨 (no-store fetch 때문)
// 하지만 products fetch는 여전히 Data Cache 활용
export default async function ProductPage({ params }) {
  // no-store: 개인화 데이터, 매 요청마다 새로 가져옴
  const user = await fetch(`/api/user/${params.id}`, { cache: 'no-store' })
  
  // force-cache: 공용 데이터, Data Cache에서 가져옴
  const products = await fetch('/api/products', { cache: 'force-cache' })
  
  return <div>...</div>
}
```

---

## 종합

hybrid 구성은 "이 라우트는 개인화가 필요하지만, 모든 데이터를 매번 새로 가져오긴 싫다"는 현실적인 요구에 대한 답이다. `no-store` fetch 하나 때문에 공용 상품 목록까지 매번 외부 API를 호출할 필요가 없다. Data Cache 레벨에서 분리 관리가 가능하므로, 라우트가 동적이더라도 성능 최적화의 여지가 남아있다.

---

---

# Data Cache를 revalidate 하면 Full Route Cache는? 반대는?

## 도입

Data Cache와 Full Route Cache는 서로 의존 관계가 있다. Full Route Cache는 렌더링 결과를 저장하고 그 렌더링은 데이터에 의존하므로, 데이터가 바뀌면 렌더 결과도 다시 만들어져야 한다. 하지만 반대 방향은 성립하지 않는다.

---

## 본문

> Revalidating or opting out of the Data Cache **will** invalidate the Full Route Cache, as the render output depends on data.

"Data Cache를 재검증하거나 opt out하면 Full Route Cache가 **무효화된다**. 렌더 출력이 데이터에 의존하기 때문이다."

- **invalidate**: 기존 캐시를 무효화하여 다음 요청 시 새로 채워지게 함. 즉시 삭제가 아니라 "다음 요청이 오면 새로 만들어라"는 신호다.
- **render output depends on data**: Full Route Cache는 렌더링 결과(HTML + RSC payload)를 저장한다. 렌더링의 재료인 데이터가 바뀌면 결과물도 유효하지 않다.

> Invalidating or opting out of the Full Route Cache **does not** affect the Data Cache. You can dynamically render a route that has both cached and uncached data.

"Full Route Cache를 무효화하거나 opt out해도 Data Cache에는 **영향을 주지 않는다**. 캐시된 데이터와 캐시되지 않은 데이터를 모두 사용하는 라우트를 동적으로 렌더링할 수 있다."

```
의존 관계 (단방향)

Data Cache 변경
    └──→ Full Route Cache 무효화 (O)

Full Route Cache 변경
    └──→ Data Cache 영향 없음 (X)
```

---

## 종합

이 단방향 의존 관계는 직관적이다. 데이터가 바뀌면 그 데이터로 만든 페이지도 새로 만들어야 하지만, 페이지 렌더링 전략이 바뀐다고 해서 원본 데이터가 바뀌지는 않는다. 실무에서 `revalidateTag('products')`를 호출하면 Data Cache가 무효화되고 연쇄적으로 Full Route Cache도 초기화되어 다음 요청 시 최신 데이터로 페이지가 다시 렌더링된다.

---

---

# Route Handler에서 Data Cache를 revalidate 하면 Router Cache는?

## 도입

Route Handler(`app/api/.../route.ts`)에서 데이터를 갱신해도 클라이언트의 Router Cache는 즉시 업데이트되지 않는다. Route Handler는 특정 라우트와 묶여 있지 않기 때문이다. Router Cache까지 즉시 무효화하려면 Server Action에서 `revalidatePath` 또는 `revalidateTag`를 써야 한다.

---

## 본문

> Revalidating the Data Cache in a Route Handler **will not** immediately invalidate the Router Cache as the Route Handler isn't tied to a specific route. This means Router Cache will continue to serve the previous payload until a hard refresh, or the automatic invalidation period has elapsed.

"Route Handler에서 Data Cache를 재검증해도 Router Cache를 즉시 무효화하지는 **않는다**. Route Handler가 특정 라우트에 묶여 있지 않기 때문이다. 이는 Router Cache가 강제 새로고침이 있거나 자동 무효화 기간이 지날 때까지 이전 payload를 계속 서빙함을 의미한다."

- **Route Handler**: `app/api/products/route.ts` 형태. 특정 페이지 라우트(`/products`)와 논리적으로 분리된 API 엔드포인트다.
- **hard refresh**: 브라우저에서 `Ctrl+Shift+R` 등으로 강제 새로고침. 브라우저 메모리의 Router Cache까지 초기화된다.
- **automatic invalidation period**: 30초(기본) 또는 5분 등 prefetch 방식에 따른 자동 만료 시간.

> To immediately invalidate the Data Cache and Router cache, you can use `revalidatePath` or `revalidateTag` in a Server Action.

"Data Cache와 Router Cache를 즉시 무효화하려면 Server Action에서 `revalidatePath` 또는 `revalidateTag`를 사용할 수 있다."

- **Server Action**: `'use server'` 지시어로 표시된 함수. 클라이언트에서 호출되지만 서버에서 실행되며, 호출된 페이지 라우트와 연결되어 Router Cache까지 즉시 무효화할 수 있다.
- **revalidatePath / revalidateTag**: 경로 또는 태그 단위로 Data Cache와 Full Route Cache를 무효화하고, Server Action 컨텍스트에서는 Router Cache도 함께 무효화한다.

---

## 종합

"API 라우트에서 `revalidateTag` 썼는데 왜 화면이 안 바뀌지?"는 이 동작 때문이다. Route Handler는 클라이언트 Router Cache와 연결이 없어 Data Cache만 무효화된다. 즉시 화면 갱신이 필요하다면 Server Action을 사용하거나, `router.refresh()`를 클라이언트에서 수동으로 호출해야 한다.

---

---

# 한 페이지에서 fetch 요청 중 하나라도 cached가 아니면 라우트 전체는?

## 도입

단 하나의 `no-store` fetch가 라우트 전체의 Full Route Cache 적용을 해제한다. 하지만 Data Cache 레벨에서는 다른 fetch들이 여전히 캐시를 활용한다. 라우트 단위 캐싱과 데이터 단위 캐싱은 독립적이다.

---

## 본문

> If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache. The data for the specific `fetch` request will be fetched for every incoming request. Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache.

"라우트에 캐시되지 않는 `fetch` 요청이 있으면, 라우트 전체가 Full Route Cache에서 opt out된다. 해당 특정 `fetch` 요청의 데이터는 모든 요청마다 가져와진다. 캐싱에서 opt out하지 않은 다른 `fetch` 요청들은 여전히 Data Cache에 캐시된다."

- **opt the route out of the Full Route Cache**: 라우트 전체가 Full Route Cache의 적용 대상에서 제외된다. 매 요청마다 서버에서 동적으로 렌더링된다.
- **specific `fetch` request**: `no-store`인 그 fetch만 외부 API를 호출하고, 나머지 `force-cache` fetch들은 Data Cache 히트를 얻는다.

```
no-store fetch 1개 포함된 라우트의 동작

요청 시마다
    ├── fetch A (no-store) → 외부 API 직접 호출
    ├── fetch B (force-cache) → Data Cache HIT
    └── fetch C (revalidate: 60) → Data Cache HIT (60초 내)

라우트는 매번 렌더링 ← Full Route Cache 제외됨
하지만 B, C는 Data Cache에서 빠르게 응답
```

---

## 종합

Full Route Cache와 Data Cache의 범위를 명확히 구분해야 한다. Full Route Cache는 "페이지 전체를 저장하느냐"의 문제이고, Data Cache는 "개별 fetch 결과를 저장하느냐"의 문제다. 전자가 꺼져도 후자는 살아있다. 이 덕분에 개인화 데이터 하나 때문에 공용 데이터까지 매번 새로 가져오는 낭비를 피할 수 있다.
