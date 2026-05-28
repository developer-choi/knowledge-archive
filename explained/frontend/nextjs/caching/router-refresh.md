# `router.refresh()`는 무엇을 하는가? (어떤 캐시를 클리어하고 어떤 캐시는 그대로 두는가?)

## 도입

`router.refresh()`는 클라이언트 사이드에서 현재 라우트의 Router Cache를 비우고 서버에 새 RSC payload를 요청하는 API다. 서버의 Data Cache와 Full Route Cache는 건드리지 않는다 — 클라이언트 캐시만 초기화하는 "소프트 리프레시"에 해당한다.

---

## 본문

> The refresh option of the useRouter hook can be used to manually refresh a route. This completely clears the Router Cache, and makes a new request to the server for the current route. refresh does not affect the Data or Full Route Cache.

"`useRouter` 훅의 refresh 옵션을 사용하여 라우트를 수동으로 새로고침할 수 있다. 이는 Router Cache를 완전히 초기화하고, 현재 라우트에 대해 서버에 새 요청을 만든다. refresh는 Data 또는 Full Route Cache에 영향을 주지 않는다."

- **Router Cache**: 클라이언트 메모리에 있는 RSC payload 캐시. `router.refresh()`는 이것만 비운다.
- **Data Cache**: 서버 파일시스템의 `fetch()` 응답 캐시. 건드리지 않는다.
- **Full Route Cache**: 서버에 저장된 HTML + RSC payload. 건드리지 않는다.

```
router.refresh() 영향 범위

클라이언트
├── Router Cache          ← 초기화됨 (현재 라우트)

서버
├── Data Cache            ← 변경 없음
└── Full Route Cache      ← 변경 없음
```

---

## 종합

`router.refresh()`는 브라우저의 "소프트 새로고침"이다. 서버 캐시는 유지하면서 클라이언트의 RSC payload를 새로 받아온다. 만약 서버에 Full Route Cache가 있다면, `router.refresh()` 후에도 서버는 캐시된 결과를 반환할 수 있다 — Data Cache와 Full Route Cache는 그대로이기 때문이다. 서버 캐시까지 무효화하려면 Server Action에서 `revalidatePath`를 써야 한다.

---

---

# `router.refresh()` 실행 후 클라이언트 상태(useState, scroll)는 어떻게 되는가?

## 도입

`router.refresh()`는 페이지 전체를 새로고침하지 않는다. 서버에서 새 RSC payload를 받아온 후, 현재 클라이언트 상태(React state, 스크롤 위치 등)를 유지하면서 변경된 부분만 병합(reconcile)한다.

---

## 본문

> The rendered result will be reconciled on the client while preserving React state and browser state.

"렌더링된 결과는 React 상태와 브라우저 상태를 유지하면서 클라이언트에서 reconcile된다."

> Refresh the current route. Making a new request to the server, re-fetching data requests, and re-rendering Server Components. The client will merge the updated React Server Component payload without losing unaffected client-side React (e.g. useState) or browser state (e.g. scroll position).

"현재 라우트를 새로고침한다. 서버에 새 요청을 만들고, 데이터 요청을 다시 가져오고, 서버 컴포넌트를 다시 렌더링한다. 클라이언트는 영향받지 않는 클라이언트 사이드 React(예: `useState`)나 브라우저 상태(예: 스크롤 위치)를 잃지 않고 업데이트된 React Server Component payload를 병합한다."

- **reconciled**: React의 diffing 알고리즘으로 이전 트리와 새 트리를 비교하여 변경된 부분만 DOM에 적용한다. `router.refresh()`는 이 reconciliation을 서버에서 받은 새 RSC payload로 수행한다.
- **React state**: `useState`, `useReducer` 등으로 관리하는 컴포넌트 상태. RSC가 다시 렌더링되어도 Client Component의 state는 유지된다.
- **browser state**: 스크롤 위치, 포커스, 텍스트 선택 등. 일반적인 페이지 새로고침과 달리 유지된다.

---

## 종합

`router.refresh()`는 실질적으로 "서버 컴포넌트만 다시 가져오기"다. 페이지 전체를 다시 불러오지 않으므로, 모달이 열린 상태에서 배경 데이터를 갱신하거나, 스크롤된 위치를 유지하면서 목록을 업데이트하는 시나리오에 적합하다. 서버 데이터는 최신으로 바뀌지만 클라이언트 UX 상태는 그대로 유지된다.

---

---

# `revalidatePath`와 `router.refresh()`는 어떻게 다른가?

## 도입

`revalidatePath`는 서버 캐시(Data Cache + Full Route Cache)를 무효화하는 서버 API이고, `router.refresh()`는 클라이언트 Router Cache만 초기화하는 클라이언트 API다. 둘 다 화면을 갱신하지만 건드리는 범위가 다르다.

---

## 본문

> Calling router.refresh will clear the Router cache, and re-render route segments on the server without invalidating the Data Cache or the Full Route Cache.

"`router.refresh`를 호출하면 Router Cache를 초기화하고, Data Cache나 Full Route Cache를 무효화하지 않고 서버에서 라우트 세그먼트를 다시 렌더링한다."

> The difference is that revalidatePath purges the Data Cache and Full Route Cache, whereas router.refresh() does not change the Data Cache and Full Route Cache, as it is a client-side API.

"차이점은 `revalidatePath`가 Data Cache와 Full Route Cache를 비우는 반면, `router.refresh()`는 클라이언트 사이드 API이므로 Data Cache와 Full Route Cache를 변경하지 않는다는 것이다."

- **client-side API**: `router.refresh()`는 `useRouter()` 훅에서 얻어 클라이언트 컴포넌트에서 호출한다. 서버 캐시에 접근하는 권한이 없다.
- **purge**: 캐시를 비워서 다음 요청 시 새로 채워지게 만든다. `revalidatePath`는 Data Cache + Full Route Cache 모두를 purge한다.

```
영향 범위 비교

                    Data Cache    Full Route Cache    Router Cache
revalidatePath      purge됨       purge됨             무효화됨(연쇄)
router.refresh()    변경 없음     변경 없음            초기화됨
```

---

## 종합

"서버 데이터 자체를 갱신해야 한다" → `revalidatePath` 또는 `revalidateTag` (Server Action에서 호출). "서버 데이터는 그대로지만 화면만 새로 그려야 한다" → `router.refresh()`. 예를 들어 낙관적 업데이트(optimistic update)를 되돌리거나, 서버 상태와 클라이언트 캐시가 어긋났을 때 동기화하는 용도로 `router.refresh()`가 적합하다. 데이터 자체를 바꾸는 뮤테이션 후라면 Server Action + `revalidatePath`가 올바른 선택이다.
