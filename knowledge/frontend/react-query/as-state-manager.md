---
tags: [react-query, state-mgmt, concept]
---
# Questions
- React Query는 무엇인가?
- 두 컴포넌트가 동시에 같은 useQuery를 호출하면 네트워크 요청은 몇 번 발생하는가?
- React Query를 'data synchronization tool'이라고 부르는 이유는?
  - 같은 데이터라도 어떤 건 자주 stale해지고 어떤 건 오래 fresh한 이유는?
  - React Query의 디폴트는 backend와 자주 동기화하는 쪽인가, 적게 동기화하는 쪽인가?
- React Query 이전, frontend에서 데이터 페칭에 흔히 쓰던 두 가지 접근은 무엇이었나?
  - 'fetch once, distribute globally, rarely update' 접근은 어떻게 동작하며 무엇이 문제인가?
  - 'fetch on every mount, keep it local' 접근은 어떻게 동작하며 무엇이 문제인가?

---

## React Query는 무엇인가?

### Official Answer
React Query is an async state manager.
It can manage any form of asynchronous state - it is happy as long as it gets a Promise.
Yes, most of the time, we produce Promises via data fetching, so that's where it shines.
But it does more than just handling loading and error states for you.
It is a proper, real, "global state manager".

> #### Key Terms:
> - **async state manager**: 비동기 작업의 결과(Promise)를 캐싱·공유·재요청까지 관리하는 도구. 데이터 페칭에 한정되지 않는다
> - **Promise**: JS 비동기 결과를 표현하는 객체. resolve/reject로 완료 상태를 알린다
> - **shines**: 가장 잘 발휘된다 (=빛난다). 페칭이 주된 use-case일 뿐 본질은 더 넓다는 뉘앙스
> - **proper, real**: "본격적인, 진짜 의미의" — Redux/Zustand와 동급의 글로벌 상태 관리자라는 강조
> - **global state manager**: 앱 전역에서 공유되는 상태를 관리하는 도구

> #### AI Annotation:
> queryFn이 Promise만 리턴하면 되므로, HTTP 요청뿐 아니라 IndexedDB 읽기·Web Worker 응답 등 어떤 비동기 작업이든 React Query로 관리할 수 있다.
> "데이터 페칭 라이브러리"라는 통념은 use-case 중 하나일 뿐, 본질은 비동기 상태 관리자다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 두 컴포넌트가 동시에 같은 useQuery를 호출하면 네트워크 요청은 몇 번 발생하는가?

### Official Answer
React Query will also deduplicate requests that would happen at the same time, so in the above scenario, even though two components request the same data, there will be only one network request.

> #### Key Terms:
> - **deduplicate**: 중복 제거. 첫 요청이 진행 중일 때 같은 키의 두 번째 호출은 새 fetch를 만들지 않고 기존 Promise에 합류한다

> #### AI Annotation:
> 같은 QueryClientProvider 아래에서 같은 QueryKey로 호출된 요청이 deduplication 대상이다.
> 이게 없으면 컴포넌트 N개가 동시에 마운트될 때 N번 fetch가 날아가서 백엔드 부담 + 응답 race가 발생한다.
> 단 deduplication은 같은 시점에 in-flight인 요청만 합친다 — 시간 간격을 두고 연달아 마운트되는 케이스(mounts in short succession, 다른 render cycle)에서는 별도 fetch가 발생한다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query를 'data synchronization tool'이라고 부르는 이유는?

### Official Answer
Because React Query manages async state (or, in terms of data fetching: server state), it assumes that the frontend application doesn't "own" the data.
And that's totally right.
If we display data on the screen that we fetch from an API, we only display a "snapshot" of that data - the version of how it looked when we retrieved it.

React Query provides the means to synchronize our view with the actual data owner - the backend.

> #### Key Terms:
> - **server state**: 진짜 주인이 backend(DB)인 상태. client state(폼 입력값, 모달 열림 여부)와 달리 frontend가 소유하지 않음
> - **own**: 소유. frontend가 그 데이터의 진짜 주인인지 여부
> - **snapshot**: 그 순간의 사진. 가져온 시각의 정지화면 — 백엔드는 그 사이에도 계속 변한다
> - **synchronize**: 동기화. view를 backend와 같은 상태로 맞추는 일

> #### AI Annotation:
> client state는 frontend가 100% 소유하지만, server state는 빌려온 사본(snapshot)일 뿐이라 끊임없는 동기화가 필요하다.
> staleTime, refetchOnWindowFocus 같은 옵션이 왜 그렇게 설계됐는지 이해하는 출발점.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 같은 데이터라도 어떤 건 자주 stale해지고 어떤 건 오래 fresh한 이유는?

### Official Answer
The answer depends totally on our problem domain.
If we fetch a Twitter post with all its likes and comments, it is likely outdated (stale) pretty fast.
If we fetch exchange rates that update on a daily basis, well, our data is going to be quite accurate for some time even without refetching.

> #### Key Terms:
> - **problem domain**: 도메인. 데이터의 변화 빈도가 결정되는 비즈니스 영역
> - **outdated (stale)**: 신선하지 않은. 캐시는 있지만 최신 보장이 없는 상태
> - **accurate**: 정확한 (백엔드 현재 상태와 일치하는가)

> #### AI Annotation:
> stale 여부는 절대값이 아니라 도메인 의존이다 — 트위터 좋아요는 1초 뒤에도 stale, 환율은 하루 내내 fresh.
> 그래서 React Query는 staleTime의 "정답"을 제시하지 않고 사용자가 도메인에 맞춰 설정하도록 둔다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query의 디폴트는 backend와 자주 동기화하는 쪽인가, 적게 동기화하는 쪽인가?

### Official Answer
React Query provides the means to synchronize our view with the actual data owner - the backend.
And by doing so, it errs on the side of updating often rather than not updating often enough.

> #### Key Terms:
> - **synchronize**: 동기화. view ↔ backend 상태 일치
> - **errs on the side of**: ~쪽으로 일부러 치우친다 (의도된 편향)

> #### AI Annotation:
> "업데이트가 너무 많은" 실수가 "너무 적은" 실수보다 낫다는 디폴트 철학.
> 사용자는 잠깐의 background refetch보다 stale 데이터(잘못된 좋아요 수)에 훨씬 민감하기 때문 — refetchOnMount, refetchOnWindowFocus 같은 옵션이 디폴트로 켜져 있는 이유다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query 이전, frontend에서 데이터 페칭에 흔히 쓰던 두 가지 접근은 무엇이었나?

### Official Answer
Two approaches to data fetching were pretty common before libraries like React Query came to the rescue:

1. fetch once, distribute globally, rarely update
2. fetch on every mount, keep it local

Both of these approaches are pretty sub-optimal.
The first one doesn't update our local cache often enough, while the second one potentially re-fetches too often, and also has a questionable ux because data is not there when we fetch for the second time.

> #### Key Terms:
> - **came to the rescue**: 구원하러 왔다. 기존 방식이 충분히 고통스러웠다는 뉘앙스
> - **sub-optimal**: 차선의. 정답이 따로 있다는 함의
> - **questionable ux**: UX가 의심스러운, 즉 사용자 경험이 좋지 않은
> - **second time**: 두 번째 마운트 — 같은 데이터를 다시 보러 왔는데도 빈 상태(스피너)부터 시작

> #### AI Annotation:
> 두 안티패턴은 정반대 방향의 결함을 갖는다.
> - 첫 번째 = 갱신 부족(stale 캐시)
> - 두 번째 = 갱신 과다(매번 fetch) + 매번 빈 상태로 시작
> React Query는 "캐시는 유지하되 자동으로 동기화"라는 제3의 길로 둘을 모두 회피한다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 'fetch once, distribute globally, rarely update' 접근은 어떻게 동작하며 무엇이 문제인가?

### Official Answer
This is pretty much what I myself have been doing with redux a lot.
Somewhere, I dispatch an action that initiates the data fetching, usually on mount of the application.
After we get the data, we put it in a global state manager so that we can access it everywhere in our application.
After all, many components need access to our Todo list.
Do we refetch that data?
No, we have "downloaded" it, so we have it already, why should we?
Maybe if we fire a POST request to the backend, it will be kind enough to give us the "latest" state back.
If you want something more accurate, you can always reload your browser window…

> #### Key Terms:
> - **dispatch an action**: Redux 패턴. 컴포넌트가 직접 fetch를 호출하는 게 아니라 action을 보내 thunk/saga가 페칭을 트리거
> - **on mount of the application**: 앱이 시작될 때 한 번 — 그 뒤엔 사용자가 새로고침하기 전까지 같은 데이터를 본다
> - **global state manager**: Redux/Zustand 같은 앱 전역 상태 저장소
> - **"downloaded"**: 따옴표가 붙은 이유는 비꼬는 톤 — "이미 받았으니 끝"이라는 잘못된 정신모델
> - **POST request**: 서버에 변경을 요청하는 HTTP 메서드. 응답에 latest state가 묻어오길 기대하는 안티패턴
> - **reload your browser window**: 사용자에게 책임을 떠넘기는 워크어라운드

> #### AI Annotation:
> 결함의 핵심: 백그라운드 동기화 메커니즘이 없으니 캐시가 점점 stale해지고, 다른 사용자가 만든 변경은 새로고침 전에는 절대 보이지 않는다.
> POST 응답에 latest state가 묻어오는 것도 백엔드 협업 없이는 보장되지 않는 가정이다.

### Review Note
- OA가 8문장으로 길다. 분할 후보 — 본 질문(동작 방식) + 별도 질문(왜 sub-optimal인가)으로 쪼갤 수 있다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 'fetch on every mount, keep it local' 접근은 어떻게 동작하며 무엇이 문제인가?

### Official Answer
Sometimes, we might also think that putting data in global state is "too much".
We only need it in this Modal Dialog, so why not fetch it just in time when the Dialog opens.
You know the drill: useEffect, empty dependency array (throw an eslint-disable at it if it screams), setLoading(true) and so on …
Of course, we now show a loading spinner every time the Dialog opens until we have the data.
What else can we do, the local state is gone…

> #### Key Terms:
> - **just in time**: 필요할 때 그때그때 — lazy 페칭의 이점이 있어 보이지만 캐싱 없이 매번 새로 가져온다는 함정
> - **You know the drill**: "다 알잖아, 그 패턴" — 클리셰 코드를 비꼬는 표현
> - **empty dependency array**: `useEffect(() => {...}, [])`. mount 1회만 실행하려는 의도
> - **eslint-disable**: ESLint 규칙을 끄는 주석. exhaustive-deps 경고를 입막음하는 안티패턴
> - **the local state is gone**: 컴포넌트가 unmount되면 `useState`로 들고 있던 데이터가 사라진다 — 캐시 없는 local state의 본질적 한계

> #### AI Annotation:
> 결함의 핵심: 모달이 닫히면 데이터가 증발하므로, 다음에 모달을 열 때 같은 데이터를 이미 봤음에도 다시 fetch + 스피너부터 시작한다.
> 캐싱 없이 useState만 쓰는 패턴은 "두 번째 마운트의 UX"를 항상 망친다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
