---
tags: [state-mgmt, performance, concept]
source: official
priority:
---
# Questions
- React Query가 사용하는 캐싱 메커니즘은 무엇인가?
  - React Query는 왜 stale 데이터를 즉시 보여주는가?
- React Query는 어떤 시점에 refetch(cache invalidation)를 트리거하는가?
  - 왜 React Query는 useQuery를 호출하는 컴포넌트가 re-render할 때마다 refetch하지 않는가?
  - refetchOnWindowFocus는 production에서 어떤 의미가 있으며 왜 자주 오해받는가?
- React Query의 staleTime 디폴트는 얼마이며 그것이 실무에서 어떤 결과를 만드는가?
  - 두 컴포넌트가 같은 useQuery를 호출해도 deduplicate가 안 되어 네트워크 요청이 두 번 나가는 상황은?
- useQuery 호출이 너무 많아 보일 때 흔히 떠올리는 우회 방법과 저자의 평가는?
  - 두 번째 컴포넌트가 button click 후 몇 분 뒤에 mount되는 lazy 시나리오에서, background refetch가 오히려 가치 있는 이유는?
- lazy mount 시나리오에서 "fetch는 줄이면서 + background refetch는 살리기"를 모두 달성하는 방법은?
  - staleTime이 fresh인 동안 같은 query를 여러 번 호출하면 네트워크 요청은 어떻게 되는가?
  - staleTime의 "정답"은 정해져 있는가?
- Query Key별로 staleTime 같은 디폴트를 다르게 설정하려면 어떻게 하는가?

---

# Answers

## React Query가 사용하는 캐싱 메커니즘은 무엇인가?

### Official Answer
In summary, it means React Query will cache data for you and give it to you when you need it, even if that data might not be up-to-date (stale) anymore.
The principle is that stale data is better than no data, because no data usually means a loading spinner, and this will be perceived as "slow" by users.
At the same time, it will try to perform a background refetch to revalidate that data.

> #### AI Annotation:
> 이 메커니즘은 HTTP의 Stale While Revalidate(RFC 5861)에서 가져온 발상이다.
> "캐시 즉시 + 갱신 동시"가 한 사이클로 묶여 있어서, 사용자는 화면이 깜빡이지 않은 채 데이터가 슬쩍 바뀌는 것을 본다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query는 왜 stale 데이터를 즉시 보여주는가?

### Official Answer
The principle is that stale data is better than no data, because no data usually means a loading spinner, and this will be perceived as "slow" by users.

> #### AI Annotation:
> 스피너가 길게 떠 있으면 객관적으로 빨라도 "느린 앱"으로 기억된다.
> stale 데이터의 "조금 틀림"이 빈 화면의 "느림"보다 사용자 신뢰에 덜 해롭다는 판단.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query는 어떤 시점에 refetch(cache invalidation)를 트리거하는가?

### Official Answer
So React Query is being smart and chooses strategic points for triggering a refetch.
These are:

- refetchOnMount
- refetchOnWindowFocus
- refetchOnReconnect

Finally, if you, as the developer of your app, know a good point in time, you can invoke a manual invalidation via queryClient.invalidateQueries.
This comes in very handy after you perform a mutation.

> #### AI Annotation:
> 자동 트리거 3개는 모두 "지금 갱신해도 합리적"인 사용자 행동·환경 신호 기반이다 — 새 컴포넌트가 데이터를 요구할 때, 사용자가 주의를 다시 화면으로 돌렸을 때, 네트워크가 바뀌었을 때.
> 그 외 시점(예: mutation 직후)은 개발자가 invalidateQueries로 직접 트리거한다 — 예: todo를 추가한 직후 `['todos']` 키를 invalidate하면 리스트가 자동으로 새로 fetch되어 방금 추가한 항목이 즉시 보인다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 왜 React Query는 useQuery를 호출하는 컴포넌트가 re-render할 때마다 refetch하지 않는가?

### Official Answer
Cache invalidation is pretty hard, so when do you decide it's time to ask the backend again for new data?
Surely we can't just do this every time a component that calls useQuery re-renders.
That would be insanely expensive, even by modern standards.

> #### AI Annotation:
> Phil Karlton의 격언 "There are only two hard things in Computer Science: cache invalidation and naming things"의 인용 — "이 문제가 어렵다는 건 업계 상식"이라는 톤.
> re-render는 1초에 수십 번 일어날 수 있어, 매 렌더 fetch는 곧 DDoS급 트래픽을 자기 백엔드에 쏘는 셈이다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## refetchOnWindowFocus는 production에서 어떤 의미가 있으며 왜 자주 오해받는가?

### Official Answer
Whenever you focus the browser tab, there will be a refetch.
This is my favourite point in time to do a revalidation, but it's often misunderstood.
During development, we switch browser tabs very often, so we might perceive this as "too much".
In production however, it most likely indicates that a user who left our app open in a tab now comes back from checking mails or reading twitter.
Showing them the latest updates makes perfect sense in this situation.

> #### AI Annotation:
> 개발자는 DevTools, Stack Overflow, 문서로 탭을 자주 전환 → 매 전환마다 refetch가 도니까 "Network 탭에 요청이 너무 많다"는 인상을 받는다.
> 실제 사용자는 그렇게 안 한다 — 메일 확인 후 돌아오거나, 트위터 보고 돌아오거나. 그 사이 백엔드가 변했을 가능성이 크니 갱신 = 정답.
> 이게 없으면 30분 후 돌아온 사용자가 30분 전 stale 데이터를 그대로 본다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query의 staleTime 디폴트는 얼마이며 그것이 실무에서 어떤 결과를 만드는가?

### Official Answer
I love these defaults, but as I said before, they are geared towards keeping things up-to-date, not to minimize the amount of network requests.
This is mainly because staleTime defaults to zero, which means that every time you e.g. mount a new component instance, you will get a background refetch.

> #### AI Annotation:
> "네트워크 요청이 많아 보이는 것"은 버그가 아니라 디자인 의도 — 디폴트가 정확성 우선이기 때문.
> staleTime 0 + refetchOnMount의 조합으로 매 mount마다 background refetch가 한 번 도는 결과가 된다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 두 컴포넌트가 같은 useQuery를 호출해도 deduplicate가 안 되어 네트워크 요청이 두 번 나가는 상황은?

### Official Answer
If you do this a lot, especially with mounts in short succession that are not in the same render cycle, you might see a lot of fetches in the network tab.
That's because React Query can't deduplicate in such situations:

```javascript
function ComponentOne() {
  const { data } = useTodos()

  if (data) {
    // ⚠️ mounts conditionally, only after we already have data
    return <ComponentTwo />
  }
  return <Loading />
}

function ComponentTwo() {
  // ⚠️ will thus trigger a second network request
  const { data } = useTodos()
}
```

> #### AI Annotation:
> deduplication은 같은 시점에 in-flight인 요청만 합치는 좁은 보장이다.
> 위 코드에서 ComponentOne의 fetch가 끝난 뒤 data가 도착해야 ComponentTwo가 mount되므로, 두 useTodos() 호출은 시간 간격이 있어 deduplicate 윈도우 밖이다 → 두 번째도 background refetch가 별도로 나간다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## useQuery 호출이 너무 많아 보일 때 흔히 떠올리는 우회 방법과 저자의 평가는?

### Official Answer
At that point, it might seem like a good idea to either pass data down via props, or to put it in React Context to avoid prop drilling, or to just turn off the refetchOnMount / refetchOnWindowFocus flags because all of this fetching is just too much!

Generally, there is nothing wrong with passing data as props.
It's the most explicit thing you can do, and would work well in the above example.

> #### AI Annotation:
> 학습 강조점은 props 전달과 refetch 플래그 끄기 두 가지다 (Context는 prop drilling 회피용 곁가지로만 언급되어 본 학습에서는 깊이 다루지 않는다).
> 저자는 props 전달은 단순 케이스에서 explicit하고 잘 동작한다고 인정한다.
> 다만 어느 우회를 골라도 React Query가 자동으로 하려는 background refetch를 막아버리므로, 시간이 흐른 뒤 데이터가 필요한 시나리오(다음 꼬리)에서는 라이브러리 핵심 가치를 무력화한다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 두 번째 컴포넌트가 button click 후 몇 분 뒤에 mount되는 lazy 시나리오에서, background refetch가 오히려 가치 있는 이유는?

### Official Answer
In this example, our second component (which also depends on the todo data) will only mount after the user clicks a button.
Now imagine our user clicks on that button after some minutes.
Wouldn't a background refetch be nice in that situation, so that we can see the up-to-date values of our todo list?

This wouldn't be possible if you chose any of the aforementioned approaches that basically bypass what React Query wants to do.

> #### AI Annotation:
> 단순 예시에서 props 전달은 충분해 보이지만, lazy mount + 시간 흐름이라는 현실적 변수가 들어오면 우회는 무너진다.
> "지금 너무 많아 보이는 fetch"를 줄이려고 우회하면, "정작 필요할 때 fetch가 안 되는" 더 큰 문제가 생긴다.
> 다음 섹션(staleTime 커스터마이즈)이 양쪽을 다 가질 방법으로 이어진다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## lazy mount 시나리오에서 "fetch는 줄이면서 + background refetch는 살리기"를 모두 달성하는 방법은?

### Official Answer
Maybe you've already guessed the direction in which I want to go: The solution would be to set staleTime to a value you are comfortable with for your specific use-case.

> #### AI Annotation:
> staleTime은 캐시된 데이터의 "fresh 유효기간"이다.
> 흐름:
> - fetch 성공 직후: 데이터가 캐시에 들어가고 **fresh** 상태가 된다
> - fresh 동안: 같은 키를 호출해도 항상 캐시에서만 응답 — 네트워크 요청 0번
> - staleTime 만료: **stale** 상태로 전환
> - 그 후 mount/focus/reconnect 같은 트리거가 발생하면 background refetch가 도는 동시에 stale 캐시를 즉시 보여줌
> - refetch 성공: 새 데이터로 캐시 갱신 → 다시 fresh 카운트다운 시작
>
> 이 윈도우를 만들면 mounts in short succession은 fresh 안에 묶여 자연스럽게 deduplicate되고, 윈도우 밖(분 단위 후 lazy mount)에선 background refetch가 다시 살아남.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## staleTime이 fresh인 동안 같은 query를 여러 번 호출하면 네트워크 요청은 어떻게 되는가?

### Official Answer
As long as data is fresh, it will always come from the cache only.
You will not see a network request for fresh data, no matter how often you want to retrieve it.

> #### AI Annotation:
> fresh 동안은 background refetch도 없다 — refetch는 stale 상태에서만 트리거되기 때문이다.
> 그래서 fresh 윈도우는 사실상 "시간 영역으로 확장된 deduplication"으로 작동한다 (앞의 동시 deduplication과 다른 차원).

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## staleTime의 "정답"은 정해져 있는가?

### Official Answer
There is also no "correct" value for staleTime.
In many situations, the defaults work really well.
Personally, I like to set it to a minimum of 20 seconds to deduplicate requests in that time frame, but it's totally up to you.

> #### AI Annotation:
> 도메인·UX 요구·백엔드 부담의 트레이드오프이며 본인이 결정한다.
> 트위터 좋아요(빠르게 stale) → 짧은 staleTime, 환율(하루 단위) → 긴 staleTime처럼 도메인별 차등이 자연스럽다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## Query Key별로 staleTime 같은 디폴트를 다르게 설정하려면 어떻게 하는가?

### Official Answer
Since v3, React Query supports a great way of setting default values per Query Key via QueryClient.setQueryDefaults.
So if you follow the patterns I've outlined in #8: Effective React Query Keys, you can set defaults for any granularity you want, because passing Query Keys to setQueryDefaults follows the standard partial matching that e.g. Query Filters also have:

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ globally default to 20 seconds
      staleTime: 1000 * 20,
    },
  },
})

// 🚀 everything todo-related will have
// a 1 minute staleTime
queryClient.setQueryDefaults(todoKeys.all, { staleTime: 1000 * 60 })
```

> #### AI Annotation:
> 코드 흐름:
> - `defaultOptions.queries.staleTime`: 모든 쿼리의 글로벌 디폴트 = 20초
> - `setQueryDefaults(todoKeys.all, { staleTime: 1000 * 60 })`: todo 관련 모든 키만 1분으로 오버라이드
> partial matching이라 `['todos']`, `['todos', 'list']`, `['todos', 'detail', 1]` 등 prefix 일치하는 모든 쿼리에 자동 적용된다.
> 같은 키 매칭 모델이 invalidateQueries, removeQueries 등 라이브러리 전반에 일관되게 적용되어 있다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
