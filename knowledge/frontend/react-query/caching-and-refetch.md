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

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query는 왜 stale 데이터를 즉시 보여주는가?

### Official Answer
The principle is that stale data is better than no data, because no data usually means a loading spinner, and this will be perceived as "slow" by users.

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

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 왜 React Query는 useQuery를 호출하는 컴포넌트가 re-render할 때마다 refetch하지 않는가?

### Official Answer
Cache invalidation is pretty hard, so when do you decide it's time to ask the backend again for new data?
Surely we can't just do this every time a component that calls useQuery re-renders.
That would be insanely expensive, even by modern standards.

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

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## React Query의 staleTime 디폴트는 얼마이며 그것이 실무에서 어떤 결과를 만드는가?

### Official Answer
I love these defaults, but as I said before, they are geared towards keeping things up-to-date, not to minimize the amount of network requests.
This is mainly because staleTime defaults to zero, which means that every time you e.g. mount a new component instance, you will get a background refetch.

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

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## useQuery 호출이 너무 많아 보일 때 흔히 떠올리는 우회 방법과 저자의 평가는?

### Official Answer
At that point, it might seem like a good idea to either pass data down via props, or to put it in React Context to avoid prop drilling, or to just turn off the refetchOnMount / refetchOnWindowFocus flags because all of this fetching is just too much!

Generally, there is nothing wrong with passing data as props.
It's the most explicit thing you can do, and would work well in the above example.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## 두 번째 컴포넌트가 button click 후 몇 분 뒤에 mount되는 lazy 시나리오에서, background refetch가 오히려 가치 있는 이유는?

### Official Answer
In this example, our second component (which also depends on the todo data) will only mount after the user clicks a button.
Now imagine our user clicks on that button after some minutes.
Wouldn't a background refetch be nice in that situation, so that we can see the up-to-date values of our todo list?

This wouldn't be possible if you chose any of the aforementioned approaches that basically bypass what React Query wants to do.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## lazy mount 시나리오에서 "fetch는 줄이면서 + background refetch는 살리기"를 모두 달성하는 방법은?

### Official Answer
Maybe you've already guessed the direction in which I want to go: The solution would be to set staleTime to a value you are comfortable with for your specific use-case.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## staleTime이 fresh인 동안 같은 query를 여러 번 호출하면 네트워크 요청은 어떻게 되는가?

### Official Answer
As long as data is fresh, it will always come from the cache only.
You will not see a network request for fresh data, no matter how often you want to retrieve it.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager

---

## staleTime의 "정답"은 정해져 있는가?

### Official Answer
There is also no "correct" value for staleTime.
In many situations, the defaults work really well.
Personally, I like to set it to a minimum of 20 seconds to deduplicate requests in that time frame, but it's totally up to you.

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

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
