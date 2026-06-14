---
tags: [state-mgmt, concept]
source: official
priority:
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
- React Query의 디폴트 fetch 빈도가 거슬려 refetchOnMount/refetchOnWindowFocus를 끄거나, server data를 별도 state manager에도 함께 보관하는 식으로 우회하려는 시도에 대해, 저자는 어떻게 평가하며 정공법으로 무엇을 권하는가?

---

# Answers

## React Query는 무엇인가?

### Official Answer
React Query is an async state manager.
It can manage any form of asynchronous state - it is happy as long as it gets a Promise.
Yes, most of the time, we produce Promises via data fetching, so that's where it shines.
But it does more than just handling loading and error states for you.
It is a proper, real, "global state manager".

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 두 컴포넌트가 동시에 같은 useQuery를 호출하면 네트워크 요청은 몇 번 발생하는가?

### Official Answer
React Query will also deduplicate requests that would happen at the same time, so in the above scenario, even though two components request the same data, there will be only one network request.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query를 'data synchronization tool'이라고 부르는 이유는?

### Official Answer
Because React Query manages async state (or, in terms of data fetching: server state), it assumes that the frontend application doesn't "own" the data.
And that's totally right.
If we display data on the screen that we fetch from an API, we only display a "snapshot" of that data - the version of how it looked when we retrieved it.

React Query provides the means to synchronize our view with the actual data owner - the backend.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 같은 데이터라도 어떤 건 자주 stale해지고 어떤 건 오래 fresh한 이유는?

### Official Answer
The answer depends totally on our problem domain.
If we fetch a Twitter post with all its likes and comments, it is likely outdated (stale) pretty fast.
If we fetch exchange rates that update on a daily basis, well, our data is going to be quite accurate for some time even without refetching.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query의 디폴트는 backend와 자주 동기화하는 쪽인가, 적게 동기화하는 쪽인가?

### Official Answer
React Query provides the means to synchronize our view with the actual data owner - the backend.
And by doing so, it errs on the side of updating often rather than not updating often enough.

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

### Review Note
- OA가 8문장으로 길다.
- 분할 후보 — 본 질문(동작 방식) + 별도 질문(왜 sub-optimal인가)으로 쪼갤 수 있다.

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

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query의 디폴트 fetch 빈도가 거슬려 refetchOnMount/refetchOnWindowFocus를 끄거나, server data를 별도 state manager에도 함께 보관하는 식으로 우회하려는 시도에 대해, 저자는 어떻게 평가하며 정공법으로 무엇을 권하는가?

### Official Answer
React Query is great at managing async state globally in your app, if you let it.
Only turn off the refetch flags if you know that make sense for your use-case, and resist the urge to sync server data to a different state manager.
Usually, customizing staleTime is all you need to get a great ux while also being in control of how often background updates happen.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
