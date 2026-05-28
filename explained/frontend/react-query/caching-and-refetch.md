# React Query가 사용하는 캐싱 메커니즘은 무엇인가?

## 도입

React Query의 캐싱 전략은 HTTP 세계의 "Stale While Revalidate" 패턴에서 나왔다. stale한 캐시라도 즉시 보여주고, 동시에 백그라운드에서 최신 데이터를 가져온다. 스피너를 최소화하면서 데이터를 항상 신선하게 유지하는 것이 핵심이다.

---

## 본문

> In summary, it means React Query will cache data for you and give it to you when you need it, even if that data might not be up-to-date (stale) anymore.

"요약하면, React Query는 데이터를 캐시해두고 필요할 때 줄 것이다 — 비록 그 데이터가 더 이상 최신(stale)이 아닐 수 있더라도."

- **cache data**: 캐시. `QueryKey`를 키로 사용하는 인메모리 캐시. 같은 키로 다시 요청하면 네트워크를 거치지 않고 캐시에서 즉시 반환한다.
- **stale**: 신선하지 않은 상태. 캐시는 있지만 백엔드 현재 상태와 다를 수 있는 상태.

> The principle is that stale data is better than no data, because no data usually means a loading spinner, and this will be perceived as "slow" by users.

"원칙은 데이터 없음보다 stale 데이터가 낫다는 것이다. 데이터 없음은 보통 로딩 스피너를 의미하고, 이것은 사용자에게 '느리다'고 인식되기 때문이다."

- **stale data is better than no data**: React Query 캐싱 철학의 핵심 문장. "약간 틀릴 수 있는 즉시 제공"이 "정확하지만 느린 빈 화면"보다 낫다.
- **perceived as "slow"**: 따옴표 강조 — 객관적 latency가 아니라 사용자의 주관적 인식이 UX를 결정한다.

> At the same time, it will try to perform a background refetch to revalidate that data.

"동시에, 그 데이터를 재검증하기 위해 background refetch를 수행하려 한다."

- **background refetch**: UI를 막지 않고 뒷단에서 데이터 재요청. 사용자는 stale 데이터를 보는 동안 최신 데이터가 조용히 도착한다.
- **revalidate**: 재검증. 캐시 데이터가 백엔드 현재 상태와 여전히 일치하는지 확인하는 과정.

```
캐시 흐름:

요청 → 캐시 hit? → 즉시 반환 (stale일 수 있음)
                 ↓
             background refetch 시작
                 ↓
          새 데이터 도착 → 화면 갱신
```

이 메커니즘은 HTTP의 `stale-while-revalidate` Cache-Control 지시어(RFC 5861)와 같은 발상이다.

---

## 종합

"캐시 즉시 + 갱신 동시"가 한 사이클로 묶여 있어서, 사용자는 빈 화면이나 스피너 없이 데이터를 보면서 백그라운드에서 최신화가 일어나는 경험을 한다. 이 방식이 없으면 두 선택지뿐이다 — 캐시는 있지만 stale(갱신 없음), 또는 항상 최신이지만 스피너 필수(캐시 없음). React Query는 이 둘의 절충이 아닌 양쪽을 동시에 달성한다.

---

---

# React Query는 왜 stale 데이터를 즉시 보여주는가?

## 도입

"stale 데이터를 보여주면 사용자가 잘못된 정보를 보지 않을까?"라는 의문이 생길 수 있다. React Query는 "약간 틀린 데이터"와 "빈 화면(스피너)"을 비교했을 때, 사용자 경험에서 전자가 낫다는 판단을 한다.

---

## 본문

> The principle is that stale data is better than no data, because no data usually means a loading spinner, and this will be perceived as "slow" by users.

"원칙은 데이터 없음보다 stale 데이터가 낫다는 것이다. 데이터 없음은 보통 로딩 스피너를 의미하고, 이것은 사용자에게 '느리다'고 인식되기 때문이다."

- **stale data is better than no data**: SWR(Stale While Revalidate) 패턴의 정체성 문장. 이것이 React Query 캐싱 전략의 철학적 근거다.
- **perceived as "slow"**: "느리다고 인식된다" — 객관적 latency보다 사용자 perception이 UX의 실질 결정 변수다.

스피너가 UX에서 "느림"으로 인식되는 메커니즘:

```
스피너 없음 (stale 즉시 표시):
  사용자 → 화면 전환 → 데이터 즉시 보임 (약간 outdated)
  "빠르게 로드됐다" 인식

스피너 있음 (정확한 데이터 대기):
  사용자 → 화면 전환 → 빈 화면/스피너 → 1초 후 데이터
  "느리다" 인식 (실제 응답 시간이 빨라도)
```

---

## 종합

스피너가 길게 떠 있으면 실제로 빠른 앱도 "느린 앱"으로 기억된다. stale 데이터의 "약간 틀림"은 사용자 신뢰에 미치는 영향이 작은 반면, 빈 화면의 "느림"은 즉각적으로 불편함을 만든다. 이 트레이드오프에서 React Query는 "먼저 보여주고 뒤에서 갱신"을 선택한다. 물론 stale 데이터가 치명적으로 문제가 되는 도메인(금융 거래, 실시간 재고 등)에서는 `staleTime: 0` + 적절한 로딩 UI로 다르게 접근해야 한다.

---

---

# React Query는 어떤 시점에 refetch를 트리거하는가?

## 도입

React Query는 매 렌더마다 fetch하지 않는다. 대신 "지금 갱신해도 합리적"이라는 신호가 되는 전략적 시점을 선별해서 refetch를 트리거한다.

---

## 본문

> So React Query is being smart and chooses strategic points for triggering a refetch. These are: refetchOnMount / refetchOnWindowFocus / refetchOnReconnect

"React Query는 스마트하게 행동하며 refetch를 트리거하기 위한 전략적 시점을 선택한다. 이것들이다: refetchOnMount / refetchOnWindowFocus / refetchOnReconnect"

- **strategic points**: 전략적 시점. 매 렌더가 아닌 "갱신할 가치가 있는 순간"만 선별한다.
- **refetchOnMount**: `useQuery`를 쓰는 컴포넌트가 마운트될 때 자동 refetch.
- **refetchOnWindowFocus**: 브라우저 탭이 다시 포커스를 받을 때 자동 refetch. 다른 탭에서 돌아올 때.
- **refetchOnReconnect**: 네트워크가 끊겼다가 재연결될 때 자동 refetch.

> Finally, if you, as the developer of your app, know a good point in time, you can invoke a manual invalidation via queryClient.invalidateQueries. This comes in very handy after you perform a mutation.

"마지막으로, 개발자가 좋은 시점을 안다면 `queryClient.invalidateQueries`로 수동 무효화를 실행할 수 있다. 이것은 mutation 수행 후에 매우 유용하다."

- **manual invalidation**: 수동 무효화. 개발자가 명시적으로 캐시를 stale 표시 → 다음 사용 시 background refetch 트리거.
- **mutation**: 서버 데이터를 변경하는 요청(POST/PUT/DELETE). 성공 후 관련 쿼리를 invalidate해 화면을 최신화하는 패턴.

```ts
// mutation 후 관련 쿼리 invalidate
const mutation = useMutation({
  mutationFn: (newTodo) => fetch('/api/todos', { method: 'POST', body: JSON.stringify(newTodo) }),
  onSuccess: () => {
    // 'todos' 키 관련 캐시를 stale 표시 → 다음 mount/focus 시 자동 refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

자동 트리거 3개의 공통점:

```
refetchOnMount     새 컴포넌트가 데이터를 요구할 때
refetchOnWindowFocus   사용자가 주의를 화면으로 다시 돌렸을 때
refetchOnReconnect     네트워크 환경이 바뀌었을 때

→ 모두 "지금 갱신해도 합리적"인 사용자 행동·환경 신호
```

---

## 종합

세 자동 트리거와 수동 invalidate의 조합이 React Query가 "스마트한 갱신"을 구현하는 방식이다. 매 렌더마다 fetch하면 백엔드에 DDoS급 트래픽을 쏘는 셈이지만, 전략적 시점만 선별하면 네트워크 비용은 최소화하면서 사용자는 항상 비교적 최신 데이터를 볼 수 있다. mutation 후 `invalidateQueries`는 "나는 데이터가 변경됐다는 걸 안다"는 개발자 지식을 캐시에 반영하는 탈출구다.

---

---

# 왜 React Query는 useQuery를 호출하는 컴포넌트가 re-render할 때마다 refetch하지 않는가?

## 도입

React 컴포넌트는 props 변경, 부모 리렌더, 상태 업데이트 등 다양한 이유로 re-render된다. 매 re-render마다 fetch를 하면 어떤 일이 생길지를 생각해보면 답이 나온다.

---

## 본문

> Cache invalidation is pretty hard, so when do you decide it's time to ask the backend again for new data? Surely we can't just do this every time a component that calls useQuery re-renders. That would be insanely expensive, even by modern standards.

"캐시 무효화는 꽤 어렵다. 그러면 언제 백엔드에 새 데이터를 다시 요청해야 할 때인지 어떻게 결정하는가? 분명히 `useQuery`를 호출하는 컴포넌트가 re-render할 때마다 할 수는 없다. 그것은 현대 기준으로도 미칠 듯이 비쌀 것이다."

- **Cache invalidation is pretty hard**: Phil Karlton의 격언 — "Computer Science에서 어려운 것 두 가지: 캐시 무효화와 이름 짓기". 업계가 인정하는 난제다.
- **insanely expensive**: 미칠 듯이 비싼. React 컴포넌트는 1초에 수십 번 re-render될 수 있다. 매 re-render fetch = 자기 백엔드에 DDoS를 쏘는 셈.
- **even by modern standards**: 현대 인프라 기준으로도 — 아무리 좋은 서버라도 이 트래픽은 감당 불가다.

```
re-render가 일어나는 흔한 이유:
  - 부모 컴포넌트 상태 변경
  - 부모 리렌더 (memo 없이)
  - props 변경
  - Context 값 변경

→ 이 모두에서 fetch를 트리거하면:
  버튼 클릭 → 부모 state 변경 → 자식 re-render → fetch 1번
  부모 re-render (관련 없는 이유) → 자식 re-render → fetch 1번
  ...

React Query의 선택:
  re-render는 fetch를 트리거하지 않는다
  "전략적 시점" (mount, focus, reconnect, invalidate)만 트리거
```

---

## 종합

매 re-render fetch가 불가능한 것은 성능 제약이 아니라 설계 원칙의 문제다. re-render는 컴포넌트가 "새 데이터가 필요하다"는 신호가 아니라 단순히 "다시 그려야 한다"는 신호다. React Query는 이 두 신호를 엄격히 구분해서, re-render는 캐시에서 현재 값을 읽는 데 쓰고 fetch 트리거는 별도의 전략적 시점에만 위임한다.

---

---

# refetchOnWindowFocus는 production에서 어떤 의미가 있으며 왜 자주 오해받는가?

## 도입

개발 중에 `refetchOnWindowFocus`가 "너무 자주" 발동한다고 느껴 꺼버리는 경우가 많다. 하지만 이 판단은 개발 환경의 특수성 때문에 생기는 오해다 — production에서 이 기능은 정반대로 귀중하다.

---

## 본문

> Whenever you focus the browser tab, there will be a refetch. This is my favourite point in time to do a revalidation, but it's often misunderstood.

"브라우저 탭에 포커스할 때마다 refetch가 있을 것이다. 이것은 내가 가장 좋아하는 재검증 시점이지만, 자주 오해받는다."

- **focus the browser tab**: 탭이 다시 활성화될 때. 다른 탭, 다른 앱에서 복귀하는 순간을 가리킨다.
- **often misunderstood**: 자주 오해받음. 개발 환경 경험이 production 가치를 왜곡한다.

> During development, we switch browser tabs very often, so we might perceive this as "too much". In production however, it most likely indicates that a user who left our app open in a tab now comes back from checking mails or reading twitter.

"개발 중에는 브라우저 탭을 매우 자주 전환하므로, 이것이 '너무 많다'고 인식할 수 있다. 하지만 production에서는 탭에 앱을 열어두고 메일 확인이나 트위터를 읽다가 돌아오는 사용자를 가리킬 가능성이 높다."

- **During development**: 개발자는 DevTools, Stack Overflow, 문서 탭을 수시로 전환한다 → 매 전환마다 Network 탭에 요청이 보인다 → "너무 많다"는 인상.
- **production**: 실제 사용자는 그렇게 하지 않는다 — 메일 확인 후 앱으로 복귀, 트위터 보고 복귀.

> Showing them the latest updates makes perfect sense in this situation.

"이 상황에서 최신 업데이트를 보여주는 것은 완벽하게 말이 된다."

개발 vs production 행동 비교:

```
개발 환경 (오해의 원인):
  탭 전환 패턴: 앱 ↔ DevTools ↔ docs ↔ Stack Overflow
  → 수십 번/분 전환 → refetch가 자주 보임
  → "Network 탭에 요청이 너무 많다"

Production (실제 가치):
  사용자 패턴: 앱 열어둠 → 메일 확인 30분 → 앱으로 복귀
  → 복귀 시점에 refetch = 30분 사이 변경된 데이터 반영
  → 이게 없으면 30분 전 stale 데이터를 그대로 봄
```

---

## 종합

`refetchOnWindowFocus`를 개발 편의를 위해 끄는 것은 production 사용자 경험을 희생하는 선택이다. 30분 후 돌아온 사용자에게 최신 데이터를 보여주지 못하는 것이 개발 중 Network 탭에 요청이 여러 번 보이는 것보다 훨씬 큰 문제다. 개발 중 refetch가 거슬린다면 `staleTime`을 늘려서 fresh 윈도우 안에서는 refetch 자체가 발생하지 않게 조정하는 것이 정공법이다.

---

---

# React Query의 staleTime 디폴트는 얼마이며 그것이 실무에서 어떤 결과를 만드는가?

## 도입

`staleTime` 기본값은 `0`이다. 이것이 의미하는 바를 정확히 이해해야 React Query 디폴트에서 "네트워크 요청이 많아 보이는" 현상을 올바르게 해석할 수 있다.

---

## 본문

> I love these defaults, but as I said before, they are geared towards keeping things up-to-date, not to minimize the amount of network requests.

"나는 이 디폴트들을 좋아하지만, 앞서 말했듯 그것들은 최신 상태 유지를 위해 설계되어 있고, 네트워크 요청 최소화를 위한 것이 아니다."

- **geared towards**: ~쪽으로 의도적으로 설계됨. 디폴트의 우선순위가 "정확성(최신화)"임을 명시.

> This is mainly because staleTime defaults to zero, which means that every time you e.g. mount a new component instance, you will get a background refetch.

"이것은 주로 `staleTime`이 0을 기본값으로 하기 때문이다. 이는 예를 들어 새 컴포넌트 인스턴스를 mount할 때마다 background refetch를 받게 됨을 의미한다."

- **staleTime defaults to zero**: 캐시된 데이터가 0밀리초 후부터 stale 취급 = 즉시 stale = 다음 사용 시 background refetch 트리거.
- **mount a new component instance**: `useQuery`를 쓰는 컴포넌트가 처음 화면에 그려지는 순간.

`staleTime` 흐름 이해:

```
staleTime = 0 (디폴트) 흐름:
  fetch 성공 → 데이터 캐시됨
  → 즉시 stale 상태
  → 다음 mount/focus/reconnect 시 background refetch 발동

staleTime = 60000 (1분) 흐름:
  fetch 성공 → 데이터 캐시됨
  → 1분 동안 fresh 상태 → 이 기간 네트워크 요청 0번
  → 1분 후 stale → 다음 트리거 시 background refetch
```

---

## 종합

"네트워크 요청이 많아 보이는 것"은 React Query 버그가 아니라 `staleTime: 0` + `refetchOnMount: true` 조합의 의도된 결과다. 디폴트는 "항상 최신 우선" 전략이다. 이것이 use-case에 맞지 않는다면 `staleTime`을 도메인에 맞게 올리면 된다. `staleTime`을 올리면 fresh 윈도우 안의 요청이 캐시에서만 응답하므로 네트워크 요청이 자연스럽게 줄어든다.

---

---

# 두 컴포넌트가 같은 useQuery를 호출해도 deduplicate가 안 되어 네트워크 요청이 두 번 나가는 상황은?

## 도입

React Query의 deduplication은 "같은 시점에 in-flight인 요청"에만 적용된다. 컴포넌트가 조건부 렌더링으로 연결되어 시간 간격이 생기면 deduplication 범위를 벗어난다.

---

## 본문

> If you do this a lot, especially with mounts in short succession that are not in the same render cycle, you might see a lot of fetches in the network tab.

"이것을 특히 같은 렌더 사이클이 아닌 짧은 연속 마운트로 많이 하면, 네트워크 탭에서 많은 fetch를 볼 수 있다."

- **mounts in short succession**: 짧은 시간 간격으로 연속 마운트. 첫 요청이 완료된 뒤 두 번째 컴포넌트가 마운트되는 패턴.
- **not in the same render cycle**: 같은 렌더 사이클이 아님. deduplication은 같은 시점에 동시에 시작된 요청 사이에서만 성립한다.

> That's because React Query can't deduplicate in such situations

"React Query가 그런 상황에서 deduplicate할 수 없기 때문이다"

```tsx
// ⚠️ deduplication 안 되는 패턴
function ComponentOne() {
  const { data } = useTodos()

  if (data) {
    // ComponentOne의 fetch가 끝난 뒤 data가 도착해야
    // ComponentTwo가 마운트됨 → 시간 간격 존재
    return <ComponentTwo />
  }
  return <Loading />
}

function ComponentTwo() {
  // 이 useTodos()는 ComponentOne의 fetch가 끝난 후에 호출됨
  // staleTime이 0이면 → background refetch 별도 발생
  const { data } = useTodos()
}

// ✅ 같은 렌더에서 마운트 → deduplication 동작
function Parent() {
  return (
    <>
      <ComponentOne />
      <ComponentTwo />
    </>
  )
}
```

---

## 종합

deduplication은 "동시에 in-flight인 요청을 합친다"는 좁은 보장이다. 조건부 렌더링으로 두 컴포넌트의 마운트 사이에 시간 간격이 생기면, 두 번째 `useQuery`는 첫 번째 fetch가 이미 끝난 뒤 호출되어 deduplication 대상이 아니다. `staleTime`을 올리면 이 문제를 회피할 수 있다 — fresh 윈도우 안에서는 background refetch 자체가 발생하지 않기 때문이다.

---

---

# useQuery 호출이 너무 많아 보일 때 흔히 떠올리는 우회 방법과 저자의 평가는?

## 도입

여러 컴포넌트가 같은 `useQuery`를 호출해서 fetch가 많아 보일 때, 자연스럽게 "한 곳에서만 fetch하고 props로 내려주자" 또는 "refetch 플래그를 끄자"는 생각이 든다. 저자는 props 전달 자체는 괜찮지만, 어느 우회를 써도 lazy mount 시나리오에서 문제가 생긴다고 말한다.

---

## 본문

> At that point, it might seem like a good idea to either pass data down via props, or to put it in React Context to avoid prop drilling, or to just turn off the refetchOnMount / refetchOnWindowFocus flags because all of this fetching is just too much!

"그 시점에 데이터를 props로 내려주거나, prop drilling을 피하기 위해 React Context에 넣거나, refetchOnMount / refetchOnWindowFocus 플래그를 끄는 것이 좋은 아이디어처럼 보일 수 있다 — 이 모든 fetching이 너무 많기 때문에!"

- **pass data down via props**: 부모가 한 번 fetch한 data를 자식에게 props로 전달.
- **turn off the refetchOnMount / refetchOnWindowFocus flags**: 자동 트리거를 비활성화.

> Generally, there is nothing wrong with passing data as props. It's the most explicit thing you can do, and would work well in the above example.

"일반적으로 data를 props로 전달하는 것은 잘못이 없다. 할 수 있는 가장 명시적인 것이며, 위 예시에서는 잘 동작할 것이다."

- **explicit**: 명시적인. 데이터 출처가 코드에서 직접 보이는 장점.
- **would work well in the above example**: 단순한 케이스에서는 충분하다.

저자의 평가 요약:

```
props 전달:
  장점: 명시적, 단순한 케이스에서 잘 동작
  한계: lazy mount + 시간 흐름 시나리오에서 background refetch가 발생하지 않음

refetch 플래그 끄기:
  결과: React Query 핵심 기능 무력화
  한계: 탭 복귀 사용자에게 stale 데이터 영구 노출

Context 사용:
  목적: prop drilling 해소 (좁은 use-case)
  한계: props 전달과 동일한 lazy mount 문제 공유
```

---

## 종합

저자가 "props 전달 자체는 괜찮다"고 말하는 이유는 단순 케이스에서는 실제로 잘 동작하기 때문이다. 그러나 어떤 우회를 선택해도 공통 한계가 있다 — React Query가 자동으로 하려는 background refetch를 막거나 우회한다. 이 문제는 lazy mount + 시간 흐름이라는 현실적 시나리오(다음 질문)에서 드러난다.

---

---

# 두 번째 컴포넌트가 button click 후 몇 분 뒤에 mount되는 lazy 시나리오에서, background refetch가 오히려 가치 있는 이유는?

## 도입

단순한 예시에서는 props 전달이 충분해 보이지만, "몇 분 뒤 lazy mount"라는 현실적 변수가 더해지면 우회의 한계가 드러난다. 그 사이 백엔드 데이터가 변했을 가능성이 크기 때문이다.

---

## 본문

> In this example, our second component (which also depends on the todo data) will only mount after the user clicks a button. Now imagine our user clicks on that button after some minutes.

"이 예시에서 두 번째 컴포넌트(todo 데이터에 의존)는 사용자가 버튼을 클릭한 후에야 마운트된다. 이제 사용자가 몇 분 뒤에 버튼을 클릭한다고 상상하라."

- **only mount after the user clicks a button**: lazy mount. 마운트 시점이 사용자 행동에 종속되어 첫 fetch와 시간 간격이 생긴다.
- **after some minutes**: 분 단위 간격. 그 사이 백엔드 데이터는 충분히 변경됐을 가능성이 크다.

> Wouldn't a background refetch be nice in that situation, so that we can see the up-to-date values of our todo list?

"그 상황에서 background refetch가 있으면 좋지 않겠는가? 그래야 최신 todo 목록을 볼 수 있으니."

- **up-to-date values**: 최신 값. 몇 분 전 캐시된 데이터가 아니라 지금 백엔드 상태.

> This wouldn't be possible if you chose any of the aforementioned approaches that basically bypass what React Query wants to do.

"이것은 React Query가 하려는 것을 기본적으로 우회하는 앞서 언급한 접근들을 선택했다면 불가능했을 것이다."

- **aforementioned approaches**: props 전달, refetch 플래그 끄기, Context 등 앞서 논의한 우회들.
- **bypass what React Query wants to do**: React Query가 자동으로 하려는 일 — mount 트리거 시 background refetch.

```
Props 전달 우회의 한계 시나리오:

  t=0    TodoList 마운트 → props로 data를 Todo에 전달
  t=5분  사용자 버튼 클릭 → LazyTodo 마운트
         → props로 받은 data는 5분 전 캐시
         → background refetch가 없으니 최신화 불가
         → 5분 전 stale 데이터를 보여줌

  React Query 정공법 (staleTime 조정):

  t=0    TodoList의 useQuery 첫 fetch → 캐시 + fresh 시작
  t=2분  staleTime 초과 → stale 상태
  t=5분  LazyTodo 마운트 → stale이므로 background refetch 트리거
         → stale 캐시 즉시 보여주면서 최신 데이터 도착 대기
         → refetch 완료 → 최신 데이터로 갱신
```

---

## 종합

"지금 너무 많아 보이는 fetch"를 줄이려고 우회를 선택하면, "정작 필요할 때 fetch가 안 되는" 더 큰 문제가 생긴다. lazy mount + 시간 흐름은 실제 앱에서 매우 흔한 시나리오다 — 드롭다운을 열거나 탭을 전환하거나 모달을 띄우는 모든 케이스가 해당한다. 이것이 `staleTime` 커스터마이즈가 정공법인 이유다.

---

---

# lazy mount 시나리오에서 "fetch는 줄이면서 + background refetch는 살리기"를 모두 달성하는 방법은?

## 도입

"fetch를 줄이되 자동 갱신은 살리기" — 두 마리 토끼를 잡는 방법이 `staleTime` 커스터마이즈다. fresh 윈도우 안에서는 요청 없음, 윈도우 밖에서는 자동 refetch가 살아 있어 양쪽을 동시에 달성한다.

---

## 본문

> Maybe you've already guessed the direction in which I want to go: The solution would be to set staleTime to a value you are comfortable with for your specific use-case.

"아마 내가 어떤 방향으로 가고 싶은지 이미 짐작했을 것이다: 해결책은 특정 use-case에 맞는 값으로 `staleTime`을 설정하는 것이다."

- **direction**: 방향. "두 마리 토끼를 동시에 잡을 수 있냐"는 질문에 대한 답.
- **comfortable with**: 수용 가능한. 정답이 정해져 있지 않고 use-case별로 결정한다.
- **specific use-case**: 도메인별. 트위터 좋아요와 환율은 서로 다른 `staleTime`을 가져야 한다.

`staleTime`의 완전한 동작 흐름:

```
fetch 성공 직후:
  캐시에 데이터 저장 → fresh 상태 시작

fresh 동안 (staleTime 이내):
  같은 키 호출 → 캐시에서만 응답 (네트워크 0번)
  mount/focus/reconnect 발생해도 → refetch 없음

staleTime 만료:
  stale 상태로 전환

stale 상태에서 트리거 발생 (mount/focus/reconnect):
  background refetch 시작 + stale 캐시 즉시 반환
  refetch 완료 → 새 데이터로 캐시 갱신 → 다시 fresh 시작
```

```ts
// "fetch는 줄이면서 + background refetch는 살리기"
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 1000 * 60 * 5, // 5분 fresh 윈도우
})

// 5분 안에 같은 키 호출 → 캐시만 응답 (short succession deduplicate)
// 5분 후 lazy mount → stale이므로 background refetch 살아있음
```

---

## 종합

`staleTime`이 두 문제를 동시에 해결하는 이유: fresh 윈도우 안에서는 "시간 영역으로 확장된 deduplication"으로 작동해 짧은 시간 안의 중복 요청을 제거하고, 윈도우 밖(분 단위 후)에서는 stale 상태이므로 background refetch가 정상 발동한다. 이것이 props 전달이나 refetch 플래그 끄기로는 달성할 수 없는 부분이다. "얼마로 설정하는가"의 정답은 없고, 도메인의 데이터 변화 빈도와 사용자가 stale 데이터를 보는 것이 얼마나 문제인지에 따라 결정한다.

---

---

# staleTime이 fresh인 동안 같은 query를 여러 번 호출하면 네트워크 요청은 어떻게 되는가?

## 도입

`staleTime`을 설정하면 fresh 윈도우 안에서는 같은 데이터를 아무리 요청해도 네트워크를 전혀 사용하지 않는다. 이것이 staleTime이 "시간 영역으로 확장된 deduplication"이라고 불리는 이유다.

---

## 본문

> As long as data is fresh, it will always come from the cache only. You will not see a network request for fresh data, no matter how often you want to retrieve it.

"데이터가 fresh한 동안은 항상 캐시에서만 올 것이다. fresh 데이터에 대한 네트워크 요청은 얼마나 자주 검색하려 해도 보이지 않을 것이다."

- **fresh**: staleTime이 만료되기 전 상태. 캐시 데이터가 "최신으로 신뢰됨" 표시.
- **come from the cache only**: 캐시에서만 응답 — 네트워크에 가지 않는다.
- **no matter how often**: 호출 빈도와 무관. 1초에 100번 `useQuery`를 호출해도 네트워크 요청 0번.

```
staleTime = 60000 (1분):

  t=0   fetch 성공 → 캐시에 저장, fresh 시작
  t=10s 다른 컴포넌트 mount → useQuery 호출 → 캐시 응답 (요청 0)
  t=30s 탭 포커스 복귀 → refetchOnWindowFocus 발동? → fresh라서 아무것도 안 함
  t=45s 또 다른 컴포넌트 mount → 캐시 응답 (요청 0)
  t=60s fresh 만료 → stale 상태
  t=70s 탭 포커스 복귀 → stale이므로 background refetch 발동
```

fresh 동안 background refetch도 없다 — refetch는 stale 상태에서만 트리거되기 때문이다.

---

## 종합

fresh 윈도우는 "시간 기반 deduplication"이다. 동시에 in-flight인 요청을 합치는 좁은 deduplication과 달리, staleTime이 설정된 fresh 윈도우는 그 기간 내 모든 호출을 캐시로 처리한다. 이 덕분에 여러 컴포넌트가 독립적으로 `useQuery`를 호출해도, fresh 윈도우 안이라면 단 한 번의 네트워크 요청으로 모든 컴포넌트가 같은 데이터를 사용한다.

---

---

# staleTime의 "정답"은 정해져 있는가?

## 도입

React Query 문서를 보면 "적절한 staleTime을 설정하라"는 조언이 있지만, "얼마가 적절한가"는 알려주지 않는다. 이것은 문서가 불친절해서가 아니라, 정답이 도메인에 따라 달라지기 때문이다.

---

## 본문

> There is also no "correct" value for staleTime. In many situations, the defaults work really well.

"staleTime에 대한 '정답' 값도 없다. 많은 상황에서 디폴트가 정말 잘 동작한다."

- **"correct" value**: 따옴표 — 절대적 정답은 없다는 강조.
- **defaults work really well**: 디폴트(0)도 많은 상황에서 충분하다. 항상 staleTime을 커스터마이즈해야 한다는 의미가 아니다.

> Personally, I like to set it to a minimum of 20 seconds to deduplicate requests in that time frame, but it's totally up to you.

"개인적으로 그 시간 프레임에서 요청을 deduplicate하기 위해 최소 20초로 설정하는 것을 좋아하지만, 완전히 당신에게 달려 있다."

- **minimum of 20 seconds**: 저자 개인 휴리스틱. 같은 화면에서 짧은 시간 안의 중복 요청을 합치기 위한 최솟값.
- **deduplicate requests in that time frame**: 20초 fresh 윈도우 안의 모든 호출을 캐시로 처리.
- **totally up to you**: 결정권은 개발자에게. 도메인·UX·백엔드 부담의 트레이드오프다.

도메인별 staleTime 가이드라인:

```ts
// 빠르게 변하는 데이터 (소셜 피드, 알림)
staleTime: 30 * 1000  // 30초

// 보통 속도로 변하는 데이터 (사용자 프로필)
staleTime: 5 * 60 * 1000  // 5분

// 느리게 변하는 데이터 (설정, 카테고리 목록)
staleTime: 60 * 60 * 1000  // 1시간

// 거의 변하지 않는 데이터 (환율, 국가 목록)
staleTime: 24 * 60 * 60 * 1000  // 24시간
```

---

## 종합

staleTime은 "데이터가 얼마나 자주 변하는가"와 "사용자가 약간 오래된 데이터를 보는 것이 얼마나 문제인가"의 조합으로 결정된다. 정답이 없다는 것은 판단을 미루라는 의미가 아니다 — 각 `useQuery`에 도메인 맥락을 반영한 `staleTime`을 의식적으로 설정하는 것이 React Query를 제대로 쓰는 방식이다.

---

---

# Query Key별로 staleTime 같은 디폴트를 다르게 설정하려면 어떻게 하는가?

## 도입

도메인마다 staleTime이 달라야 하는데, 매 `useQuery` 호출마다 옵션을 반복하는 것은 번거롭다. React Query v3부터는 `QueryClient.setQueryDefaults`로 Query Key별 디폴트를 등록할 수 있다.

---

## 본문

> Since v3, React Query supports a great way of setting default values per Query Key via QueryClient.setQueryDefaults. So if you follow the patterns I've outlined in #8: Effective React Query Keys, you can set defaults for any granularity you want, because passing Query Keys to setQueryDefaults follows the standard partial matching that e.g. Query Filters also have.

"v3부터 React Query는 `QueryClient.setQueryDefaults`를 통해 Query Key별 기본값을 설정하는 훌륭한 방법을 지원한다. Effective React Query Keys 패턴을 따르면 원하는 세분화 단위로 디폴트를 설정할 수 있다. Query Key를 `setQueryDefaults`에 전달하는 것이 Query Filters 등도 가진 표준 부분 일치를 따르기 때문이다."

- **per Query Key**: Query Key별. 모든 쿼리에 단일 staleTime이 아니라 도메인별로 다른 값을 설정한다.
- **QueryClient.setQueryDefaults**: 디폴트 등록 메서드. 첫 인자는 키(또는 prefix), 두 번째는 옵션 객체.
- **granularity**: 세분화 단위. `['todos']` 전체에 적용하거나 `['todos', 'list']`처럼 더 좁게 적용할 수 있다.
- **partial matching**: 부분 일치. prefix가 같은 모든 키에 자동 적용된다.

```ts
// 글로벌 QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20, // 글로벌 디폴트: 20초
    },
  },
})

// todo 관련 쿼리만 1분으로 오버라이드
queryClient.setQueryDefaults(todoKeys.all, { staleTime: 1000 * 60 })

// partial matching 덕분에 아래 모두 적용:
// ['todos']
// ['todos', 'list']
// ['todos', 'detail', 1]
// → 전부 staleTime 1분

// todoKeys.all과 관련 없는 다른 쿼리 → 20초 글로벌 디폴트 사용
```

partial matching은 `invalidateQueries`, `removeQueries`, `resetQueries` 등 라이브러리 전반에 일관되게 적용된다.

---

## 종합

`setQueryDefaults`는 도메인별 staleTime 관리를 중앙화하는 도구다. 매 `useQuery` 호출부에서 `staleTime`을 반복 지정하지 않고, 진입점(QueryClient 설정)에서 한 번 등록하면 prefix가 맞는 모든 쿼리에 자동 적용된다. 이 패턴을 쓰면 Query Key를 계층적 배열로 구성하는 "Effective React Query Keys" 패턴과 결합해 도메인별·기능별로 정교한 캐싱 전략을 가독성 있게 표현할 수 있다.
