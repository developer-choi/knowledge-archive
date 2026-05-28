# SSR에서 `dehydrate(queryClient)`는 어떻게 클라이언트로 전달되는가?

## 도입

Next.js SSR에서 서버가 prefetch한 데이터를 클라이언트가 재활용하려면 두 단계가 필요하다 — 서버에서 queryClient를 직렬화(dehydrate)하고, 그것을 HTML 마크업에 심어 클라이언트로 전달한 뒤 클라이언트가 역직렬화(hydrate)한다.

---

## 본문

> When doing `return { props: { dehydratedState: dehydrate(queryClient) } }` in Next.js, what happens is that the `dehydratedState` representation of the queryClient is serialized by the framework so it can be embedded into the markup and transported to the client.

"Next.js에서 `return { props: { dehydratedState: dehydrate(queryClient) } }`를 할 때 일어나는 것은, queryClient의 `dehydratedState` 표현이 프레임워크에 의해 직렬화되어 마크업에 삽입되고 클라이언트로 전달된다는 것이다."

- **dehydrate(queryClient)**: queryClient 캐시를 직렬화 가능한 JSON 형태로 변환하는 함수. 메모리 안의 캐시 객체를 "말린(dehydrated)" 상태로 만든다.
- **serialized**: 직렬화. 메모리 객체 → JSON 문자열. 이 문자열이 HTML `<script>` 태그 안에 심어진다.
- **embedded into the markup**: 마크업에 삽입. 브라우저가 HTML을 받을 때 이미 데이터가 포함되어 있어 별도 API 호출 없이 초기 렌더가 가능하다.
- **transported to the client**: 클라이언트로 전달. HTTP 응답 HTML 안에 포함되어 추가 왕복 없이 전달된다.

전달 흐름:

```
서버:
  queryClient.prefetchQuery(['user', id]) → 캐시에 데이터 저장
  dehydrate(queryClient) → { queries: [{ queryKey: ['user', id], data: {...} }] }
  props로 반환 → Next.js가 JSON 직렬화 → HTML <script>에 삽입

클라이언트:
  HTML 파싱 → <script> 안의 dehydratedState 읽기
  <HydrationBoundary state={dehydratedState}> 렌더
  → React Query 캐시에 복원(hydrate)
  → useQuery(['user', id]) 호출 시 네트워크 요청 없이 캐시 데이터 반환
```

---

## 종합

dehydrate/hydrate 사이클은 서버-클라이언트 간 캐시 공유의 핵심 메커니즘이다. 이것이 없으면 SSR로 서버에서 렌더한 데이터를 클라이언트가 다시 fetch해야 해서 초기 로딩 시 불필요한 waterfall이 발생한다. `dehydrate`가 서버 캐시를 JSON으로 내보내고, `<HydrationBoundary>`가 클라이언트 캐시로 복원하는 두 단계가 짝을 이룬다.

---

---

# 서버에서 QueryClient는 어떻게 관리되는가?

## 도입

서버에서 QueryClient를 만들 때 "모든 요청에서 단일 인스턴스를 공유"하면 사용자 간 데이터 유출이라는 심각한 보안 문제가 생긴다. 요청마다 새 인스턴스를 만드는 것이 필수이며, 서버 환경에서 `gcTime`의 기본값이 다르게 동작하는 이유도 이 맥락에서 이해해야 한다.

---

## 본문

> In case you are creating the QueryClient for every request, React Query creates the isolated cache for this client, which is preserved in memory for the gcTime period. That may lead to high memory consumption on server in case of high number of requests during that period.

"모든 요청에 대해 QueryClient를 생성하는 경우, React Query는 이 클라이언트를 위한 격리된 캐시를 생성하며, 이것은 `gcTime` 기간 동안 메모리에 보존된다. 이것은 그 기간 동안 많은 수의 요청이 있을 경우 서버에서 높은 메모리 소비로 이어질 수 있다."

- **isolated cache**: 격리된 캐시. 각 요청이 독립적인 캐시 인스턴스를 가져 사용자 간 데이터 혼재를 방지한다.
- **gcTime**: Garbage Collection Time. 캐시가 사용되지 않을 때 메모리에서 제거되기까지의 시간.

> On the server, gcTime defaults to Infinity which disables manual garbage collection and will automatically clear memory once a request has finished.

"서버에서 `gcTime`은 `Infinity`를 기본값으로 하여 수동 가비지 컬렉션을 비활성화하고, 요청이 완료되면 자동으로 메모리를 정리한다."

- **defaults to Infinity on the server**: 서버 전용 디폴트. 클라이언트 기본값(5분)과 다르다. 서버에서는 요청 완료 후 더 이상 캐시가 필요 없으므로 즉시 정리.
- **automatically clear memory once a request has finished**: 요청 완료 = 캐시 소멸. 메모리 누수 없이 요청 스코프로 한정.

> Avoid setting gcTime to 0 as it may result in a hydration error. This occurs because the Hydration Boundary places necessary data into the cache for rendering, but if the garbage collector removes the data before the rendering completes, issues may arise. If you require a shorter gcTime, we recommend setting it to 2 * 1000 to allow sufficient time for the app to reference the data.

"`gcTime`을 0으로 설정하지 말라 — hydration 오류가 발생할 수 있다. Hydration Boundary가 렌더링을 위해 필요한 데이터를 캐시에 넣는데, 렌더링이 완료되기 전에 가비지 컬렉터가 데이터를 제거하면 문제가 생긴다. 더 짧은 `gcTime`이 필요하다면 앱이 데이터를 참조하기에 충분한 시간을 허용하기 위해 `2 * 1000`으로 설정하는 것을 권장한다."

- **hydration error**: 서버 렌더 결과와 클라이언트 렌더 결과가 불일치하는 오류. React가 이를 감지하면 경고 또는 리렌더 비용이 발생한다.
- **2 * 1000**: 최소 2초. 렌더링이 완료되기 전에 캐시가 사라지지 않도록 하는 안전 마진.

---

## 종합

서버 QueryClient 관리의 핵심 규칙: 요청마다 새 인스턴스 생성, `gcTime: 0` 금지. 서버에서 `gcTime`이 `Infinity`인 이유는 요청 생명주기와 동기화하기 위해서다 — 요청이 끝나면 프레임워크가 인스턴스를 버리므로 별도 GC가 불필요하다. `gcTime: 0`은 Hydration Boundary가 캐시에서 데이터를 읽으려는 시점에 캐시가 비어있는 경쟁 조건을 만든다.

---

---

# `<HydrationBoundary>`를 여러 곳에서 사용해도 되는가?

## 도입

Server Components 환경에서는 Pages Router SSR처럼 최상위 한 곳에서만 `<HydrationBoundary>`를 쓰는 패턴이 동작하지 않는다. Server Components에서는 여러 곳에서 사용해야 하며, 이것은 허용될 뿐 아니라 권장 패턴이다.

---

## 본문

> In the SSR guide, we noted that you could get rid of the boilerplate of having `<HydrationBoundary>` in every route. **This is not possible with Server Components.**

"SSR 가이드에서 모든 라우트에서 `<HydrationBoundary>`를 갖는 보일러플레이트를 제거할 수 있다고 언급했다. **이것은 Server Components에서는 불가능하다.**"

- **boilerplate**: 반복되는 상용구 코드. Pages Router SSR에서는 커스텀 `_app.tsx`에서 한 번만 처리하는 방식이 가능했다.
- **not possible with Server Components**: App Router(Server Components)에서는 구조가 다르다. 각 라우트/컴포넌트가 독립적으로 prefetch하고 hydrate한다.

> As you can see, it's perfectly fine to use `<HydrationBoundary>` in multiple places, and create and dehydrate multiple queryClient for prefetching.

"보다시피 `<HydrationBoundary>`를 여러 곳에서 사용하고, prefetch를 위해 여러 queryClient를 생성하고 dehydrate하는 것은 완전히 괜찮다."

- **multiple places**: 여러 곳. 레이아웃, 페이지, 각 Server Component 등 필요한 곳마다 독립적으로 사용.
- **multiple queryClient**: 각 Server Component가 자체 queryClient를 가질 수 있다.

User Annotation이 짚듯, Pages Router SSR에서만 보일러플레이트 제거(단일 HydrationBoundary)가 가능했던 것으로 보인다. App Router에서는 각 서버 컴포넌트에서 독립적으로 처리한다.

---

## 종합

`<HydrationBoundary>` 여러 개 사용은 App Router에서 자연스러운 패턴이다. 각 Server Component가 독립적으로 필요한 데이터를 prefetch하고 dehydrate해서 자신의 `<HydrationBoundary>`로 감싸는 방식이다. 이 패턴은 데이터 fetch가 컴포넌트 트리에서 최대한 가까운 곳에 위치하게 해서 코드 탐색이 쉬워지는 부가 효과도 있다.

---

---

# prefetch용 queryClient를 모든 Server Component에서 단일 인스턴스로 재사용해도 되는가?

## 도입

"각 Server Component에서 새 queryClient를 만드는 게 번거롭다" — 그래서 하나의 queryClient를 모든 Server Component에서 공유하고 싶을 수 있다. 가능하지만 직렬화 오버헤드라는 명확한 단점이 있다.

---

## 본문

> We create a new queryClient for each Server Component that fetches data. This is the recommended approach, but if you want to, you can alternatively create a single one that is reused across all Server Components.

"데이터를 fetch하는 각 Server Component마다 새 queryClient를 생성한다. 이것이 권장 접근이지만, 원한다면 대안으로 모든 Server Component에서 재사용되는 단일 인스턴스를 만들 수 있다."

- **recommended approach**: 권장 접근 = 컴포넌트당 새 인스턴스. 직렬화 범위를 최소화한다.

> The downside is that every time you call `dehydrate(getQueryClient())`, you serialize the **entire queryClient**, **including queries** that have **already been serialized before** and are **unrelated to the current Server Component** which is **unnecessary overhead**.

"단점은 `dehydrate(getQueryClient())`를 호출할 때마다 **이전에 이미 직렬화된** 쿼리와 **현재 Server Component와 무관한** 쿼리를 포함하여 **전체 queryClient**를 직렬화한다는 것 — 이것은 **불필요한 오버헤드**다."

- **entire queryClient**: 전체 queryClient. 단일 인스턴스를 쓰면 이전 컴포넌트들이 축적한 모든 캐시가 포함된다.
- **unnecessary overhead**: 불필요한 오버헤드. 클라이언트로 전달되는 JSON 크기가 커지고 직렬화 시간도 늘어난다.

컴포넌트당 vs 단일 인스턴스 비교:

```
컴포넌트당 새 인스턴스 (권장):
  Server Component A → queryClient_A → dehydrate_A (A 관련 쿼리만)
  Server Component B → queryClient_B → dehydrate_B (B 관련 쿼리만)
  → HTML 크기 최소화, 관련 데이터만 전달

단일 인스턴스 (비권장):
  Server Component A → 공유 queryClient → dehydrate (A 쿼리)
  Server Component B → 공유 queryClient → dehydrate (A + B 쿼리)
  → A 쿼리가 B 컴포넌트 dehydrate에도 포함됨 = 중복 직렬화
```

---

## 종합

단일 queryClient는 가능하지만 컴포넌트 수가 늘수록 dehydrate 결과물이 지수적으로 커진다. 각 컴포넌트가 이전 모든 컴포넌트의 쿼리까지 함께 직렬화하기 때문이다. 컴포넌트당 새 인스턴스를 쓰면 각 dehydrate의 범위가 그 컴포넌트의 쿼리로 한정되어 HTML 크기가 최소화된다. 편의를 위해 단일 인스턴스를 쓴다면 dehydrate를 마지막에 한 번만 호출하는 방식으로 중복 직렬화를 피해야 한다.

---

---

# React Query는 dehydrate 시 실패한 쿼리를 포함하는가?

## 도입

서버에서 prefetch한 쿼리가 실패했을 때 React Query는 어떻게 처리할까? 기본 전략은 실패를 무시하고 클라이언트에서 재시도하는 "우아한 강등(graceful degradation)"이다.

---

## 본문

> React Query defaults to a graceful degradation strategy. This means: `queryClient.prefetchQuery(...)` never throws errors / `dehydrate(...)` only includes successful queries, **not failed ones**

"React Query는 우아한 강등 전략을 기본값으로 한다. 이것은 `queryClient.prefetchQuery(...)`가 절대 오류를 던지지 않음 / `dehydrate(...)`가 실패한 쿼리가 아닌 성공한 쿼리만 포함함을 의미한다."

- **graceful degradation**: 우아한 강등. 서버에서 실패해도 앱이 완전히 멈추지 않고, 클라이언트에서 재시도해서 점진적으로 복구한다.
- **never throws errors**: prefetchQuery는 에러를 던지지 않는다. try/catch 없이도 안전하게 사용할 수 있다.
- **only includes successful queries**: 성공한 쿼리만 포함. 실패한 쿼리는 dehydratedState에 포함되지 않으므로 클라이언트로 전달되지 않는다.

> This will lead to any failed queries being retried on the client and that the server rendered output will include loading states instead of the full content.

"이것은 실패한 쿼리들이 클라이언트에서 재시도되고, 서버 렌더 결과물이 전체 콘텐츠 대신 로딩 상태를 포함하게 됨을 의미한다."

- **retried on the client**: 클라이언트 재시도. 서버 실패가 클라이언트 UX를 완전히 망치지 않는다.
- **loading states instead of the full content**: 실패한 쿼리의 영역은 로딩 스피너로 표시 → 클라이언트 fetch 성공 후 채워진다.

> If you for some reason want to include failed queries in the dehydrated state to avoid retries, you can use the option `shouldDehydrateQuery` to override the default function and implement your own logic.

"어떤 이유로 재시도를 피하기 위해 실패한 쿼리를 dehydrated state에 포함하려면 `shouldDehydrateQuery` 옵션으로 기본 함수를 오버라이드하고 자체 로직을 구현할 수 있다."

- **shouldDehydrateQuery**: dehydrate 포함 여부를 결정하는 함수. 기본값은 성공 쿼리만 포함. 오버라이드하면 실패 쿼리도 포함할 수 있다.

User Annotation이 확인했듯, 기본 설정으로는 성공한 쿼리만 dehydrate되고 클라이언트에서 다시 refetch하는 구조다.

---

## 종합

"실패한 쿼리를 dehydrate에서 제외"라는 디폴트는 서버 오류가 클라이언트 전체를 멈추지 않도록 하는 방어적 설계다. 서버가 특정 쿼리를 fetch하지 못하면 그 영역은 로딩 상태로 내려가고, 클라이언트에서 자체 재시도 로직으로 복구한다. 이 전략이 맞지 않는 케이스 — 예를 들어 서버 실패를 클라이언트에도 에러 UI로 즉시 보여주고 싶을 때 — 에는 `shouldDehydrateQuery`로 오버라이드해서 실패 쿼리도 포함시킬 수 있다.
