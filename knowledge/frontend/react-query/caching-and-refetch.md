---
tags: [react-query, caching, stale-while-revalidate, concept]
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
- React Query의 디폴트 fetch 빈도가 거슬려 refetchOnMount/refetchOnWindowFocus를 끄거나, server data를 별도 state manager에도 함께 보관하는 식으로 우회하려는 시도에 대해, 저자는 어떻게 평가하며 정공법으로 무엇을 권하는가?

---

## React Query가 사용하는 캐싱 메커니즘은 무엇인가?

### Official Answer
In summary, it means React Query will cache data for you and give it to you when you need it, even if that data might not be up-to-date (stale) anymore.
The principle is that stale data is better than no data, because no data usually means a loading spinner, and this will be perceived as "slow" by users.
At the same time, it will try to perform a background refetch to revalidate that data.

> #### Key Terms:
> - **stale**: 신선하지 않은. 캐시는 있지만 최신 보장이 없는 상태
> - **principle**: 원칙. 디자인 철학
> - **loading spinner**: 로딩 인디케이터. UX적으로 "느리다"의 시각 신호
> - **perceived as "slow"**: 따옴표 — 실제 latency가 아니라 사용자의 주관적 인식이 핵심
> - **background refetch**: UI를 막지 않고 뒷단에서 데이터를 재요청
> - **revalidate**: 다시 유효성 검증. 캐시 데이터가 백엔드 현재 상태와 여전히 일치하는지 확인

> #### AI Annotation:
> 이 메커니즘은 HTTP의 Stale While Revalidate(RFC 5861)에서 가져온 발상이다.
> "캐시 즉시 + 갱신 동시"가 한 사이클로 묶여 있어서, 사용자는 화면이 깜빡이지 않은 채 데이터가 슬쩍 바뀌는 것을 본다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query는 왜 stale 데이터를 즉시 보여주는가?

### Official Answer
The principle is that stale data is better than no data, because no data usually means a loading spinner, and this will be perceived as "slow" by users.

> #### Key Terms:
> - **stale data is better than no data**: SWR 디자인의 정체성 문장. 정확한 정답을 기다리게 하는 것보다 조금 틀려도 즉시 보여주는 쪽을 우선
> - **perceived as "slow"**: "느리다고 인식되다" — 객관적 latency보다 사용자 perception이 UX의 결정 변수

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

> #### Key Terms:
> - **strategic points**: 전략적 시점. 매 렌더가 아닌 "갱신할 가치가 있는 순간"
> - **triggering**: 발동시키는, 트리거
> - **refetchOnMount**: useQuery를 호출하는 컴포넌트가 마운트될 때 자동 refetch
> - **refetchOnWindowFocus**: 브라우저 탭이 다시 포커스를 받을 때 자동 refetch
> - **refetchOnReconnect**: 네트워크가 끊겼다가 재연결될 때 자동 refetch
> - **manual invalidation**: 수동 무효화. 개발자가 명시적으로 캐시를 stale 표시
> - **queryClient.invalidateQueries**: 지정된 키의 쿼리를 invalidate해 다음 사용 시 refetch
> - **mutation**: React Query 용어로 서버 데이터를 변경하는 요청 (POST/PUT/DELETE). 성공 후 관련 쿼리를 invalidate해 화면을 최신화하는 패턴

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

> #### Key Terms:
> - **Cache invalidation**: 캐시 무효화. "이 캐시는 더 이상 유효하지 않다" 표시. CS에서 가장 어려운 문제 중 하나로 알려짐
> - **re-renders**: 컴포넌트가 다시 그려지는 것. props/state 변경, 부모 리렌더 등 사소한 이유로도 자주 발생
> - **insanely expensive**: 미친 듯이 비싼 (네트워크/서버 비용)
> - **even by modern standards**: 현대 인프라 기준으로도 — 즉 아무리 좋은 인프라라도 감당 안 되는 수준

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

> #### Key Terms:
> - **focus the browser tab**: 브라우저 탭이 다시 활성화되는 순간 (다른 탭/앱에서 복귀)
> - **often misunderstood**: 자주 오해받는다 — 개발 환경에서의 인상으로 production 가치를 잘못 판단
> - **perceive**: 인식하다. 실제와 다른 주관적 느낌
> - **production**: 실제 사용자 환경 (vs development = 개발 환경)

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

> #### Key Terms:
> - **geared towards**: ~쪽으로 기어가 맞춰져 있다 = 의도적으로 그쪽 방향으로 디자인됨
> - **keeping things up-to-date**: 데이터 최신화. 디폴트의 우선순위가 "정확성"임을 명시
> - **staleTime defaults to zero**: 캐시된 데이터가 0초 후부터 stale 취급 = 곧바로 stale = 다음 사용 시 background refetch 트리거
> - **mount a new component instance**: useQuery를 쓰는 컴포넌트가 처음 그려지는 순간

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

> #### Key Terms:
> - **mounts in short succession**: 짧은 시간 간격으로 연속 마운트
> - **not in the same render cycle**: 같은 렌더 사이클이 아님 — 첫 fetch가 끝난 뒤 두 번째 컴포넌트가 마운트되는 케이스

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

> #### Key Terms:
> - **pass data down via props**: 부모가 한 번 fetch한 data를 자식에게 props로 전달
> - **turn off the refetchOnMount / refetchOnWindowFocus flags**: 자동 트리거를 꺼버리는 방법
> - **explicit**: 명시적인. 데이터 출처가 코드에 직접 보이는 장점

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

> #### Key Terms:
> - **only mount after the user clicks a button**: lazy mount. mount 시점이 사용자 행동에 종속되어 첫 fetch와 시간 간격이 생긴다
> - **after some minutes**: 분 단위 간격. 그 사이 백엔드 데이터는 변경됐을 가능성이 큼
> - **aforementioned approaches**: 앞서 언급한 우회들 (props 전달, refetch 플래그 끄기 등)
> - **bypass what React Query wants to do**: React Query가 자동으로 하려는 일(mount 트리거 → background refetch)을 막아버린다

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

> #### Key Terms:
> - **direction**: 방향. 앞 섹션 마지막 "have our cake and eat it, too?"에 대한 답을 가리킨다
> - **comfortable with**: 본인이 수용 가능한. 정답이 정해져 있지 않다는 함의
> - **specific use-case**: 구체 use-case별. 트위터 좋아요와 환율은 다른 staleTime을 가져야 한다

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

> #### Key Terms:
> - **fresh**: staleTime이 만료되기 전 상태. 캐시 데이터가 "최신으로 신뢰됨"
> - **come from the cache only**: 캐시에서만 응답 — 네트워크에 가지 않는다
> - **no matter how often**: 호출 빈도와 무관 (1초에 100번 호출해도 0번)

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

> #### Key Terms:
> - **"correct" value**: 따옴표 — 절대적 정답은 없다
> - **defaults work really well**: 디폴트(0)도 많은 상황에서 잘 동작한다
> - **minimum of 20 seconds**: 저자 개인 휴리스틱 — 같은 화면에서 짧은 시간 안의 요청을 합치기 위함
> - **deduplicate requests in that time frame**: 시간 윈도우 안의 요청을 합침
> - **totally up to you**: 결정권은 사용자에게

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

> #### Key Terms:
> - **per Query Key**: Query Key별. 모든 쿼리 단일 staleTime 대신 도메인별로 다른 값
> - **QueryClient.setQueryDefaults**: 디폴트 등록 메서드. 첫 인자는 키(또는 prefix), 두 번째는 옵션 객체
> - **Effective React Query Keys**: 저자의 다른 글에서 권장하는 키 구조 패턴 (계층적 배열로 키를 조직화)
> - **granularity**: 세분화 단위
> - **partial matching**: 부분 일치. prefix가 같은 모든 키에 적용
> - **Query Filters**: invalidateQueries 등 다른 API들도 같은 partial matching 규칙을 쓴다

> #### AI Annotation:
> 코드 흐름:
> - `defaultOptions.queries.staleTime`: 모든 쿼리의 글로벌 디폴트 = 20초
> - `setQueryDefaults(todoKeys.all, { staleTime: 1000 * 60 })`: todo 관련 모든 키만 1분으로 오버라이드
> partial matching이라 `['todos']`, `['todos', 'list']`, `['todos', 'detail', 1]` 등 prefix 일치하는 모든 쿼리에 자동 적용된다.
> 같은 키 매칭 모델이 invalidateQueries, removeQueries 등 라이브러리 전반에 일관되게 적용되어 있다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query의 디폴트 fetch 빈도가 거슬려 refetchOnMount/refetchOnWindowFocus를 끄거나, server data를 별도 state manager에도 함께 보관하는 식으로 우회하려는 시도에 대해, 저자는 어떻게 평가하며 정공법으로 무엇을 권하는가?

### Official Answer
React Query is great at managing async state globally in your app, if you let it.
Only turn off the refetch flags if you know that make sense for your use-case, and resist the urge to sync server data to a different state manager.
Usually, customizing staleTime is all you need to get a great ux while also being in control of how often background updates happen.

> #### Key Terms:
> - **if you let it**: 그렇게 쓰게 두면. 우회·차단하지 말라는 조건절
> - **turn off the refetch flags**: refetchOnMount/refetchOnWindowFocus 같은 플래그를 끔
> - **make sense for your use-case**: use-case에 맞는다는 판단이 분명할 때
> - **resist the urge**: 충동에 저항하라
> - **sync server data to a different state manager**: server data를 Redux/Zustand 등 다른 상태 관리자로 다시 동기화
> - **customizing staleTime**: staleTime 커스터마이즈
> - **in control of**: 제어권을 가짐 — 빈도를 통제

> #### AI Annotation:
> 두 우회 모두 React Query가 자동으로 하려는 background refetch를 막아 라이브러리 핵심 가치를 무력화하는 안티패턴이다.
> server data를 다른 store로 sync하면 두 store의 일관성 관리 부담이 추가되고, React Query의 refetch가 갱신해도 다른 store는 stale인 채 남는다.
> 정공법은 staleTime 커스터마이즈 — fresh 윈도우 안에서는 네트워크 0번이고 윈도우 밖에서는 자동 refetch가 살아 있어 UX(자동 최신화)와 제어(빈도 통제) 양쪽을 챙긴다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
