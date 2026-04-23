---
tags: [nextjs, principle]
---

# Questions
- `router.refresh()`는 무엇을 하는가? (어떤 캐시를 클리어하고 어떤 캐시는 그대로 두는가?)
- `router.refresh()` 실행 후 클라이언트 상태(useState, scroll)는 어떻게 되는가?
- `revalidatePath`와 `router.refresh()`는 어떻게 다른가?

---

# Answers

## `router.refresh()`는 무엇을 하는가? (어떤 캐시를 클리어하고 어떤 캐시는 그대로 두는가?)

### Official Answer
The refresh option of the useRouter hook can be used to manually refresh a route.
This completely clears the Router Cache, and makes a new request to the server for the current route.
refresh does not affect the Data or Full Route Cache.

> #### Key Terms:
> - **Router Cache**: 클라이언트 사이드 메모리에 저장되는 RSC payload 캐시
> - **Data Cache**: `fetch()` 응답을 서버에 저장하는 캐시
> - **Full Route Cache**: 빌드/요청 시점에 라우트 전체의 RSC payload와 HTML을 서버에 저장하는 캐시

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#routerrefresh

---

## `router.refresh()` 실행 후 클라이언트 상태(useState, scroll)는 어떻게 되는가?

### Official Answer
The rendered result will be reconciled on the client while preserving React state and browser state.

> #### Official Annotation:
> Refresh the current route.
> Making a new request to the server, re-fetching data requests, and re-rendering Server Components.
> The client will merge the updated React Server Component payload without losing unaffected client-side React (e.g. useState) or browser state (e.g. scroll position).

> #### Key Terms:
> - **reconciled**: 새로 받은 결과를 기존 클라이언트 트리에 병합(diff)하는 과정
> - **React state**: `useState` 같은 React 컴포넌트 상태
> - **browser state**: 스크롤 위치 등 브라우저가 관리하는 상태

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#routerrefresh
- https://nextjs.org/docs/app/api-reference/functions/use-router#userouter

---

## `revalidatePath`와 `router.refresh()`는 어떻게 다른가?

### Official Answer
Calling router.refresh will clear the Router cache, and re-render route segments on the server without invalidating the Data Cache or the Full Route Cache.

The difference is that revalidatePath purges the Data Cache and Full Route Cache, whereas router.refresh() does not change the Data Cache and Full Route Cache, as it is a client-side API.

> #### Key Terms:
> - **client-side API**: 클라이언트에서 호출되는 API (서버 캐시는 건드리지 않음)
> - **purge**: 캐시를 비워서 다음 요청 시 새로 채워지게 함

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#routerrefresh
- https://github.com/vercel/next.js/discussions/77552
