# React Query는 무엇인가?

## 도입

React Query를 "데이터 페칭 라이브러리"로만 알고 있다면 절반만 맞다. 공식 저자는 React Query를 "비동기 상태 관리자"로 정의하며, HTTP 요청에 한정되지 않는 더 넓은 개념이라고 설명한다.

---
## 본문

> React Query is an async state manager. It can manage any form of asynchronous state - it is happy as long as it gets a Promise.

"React Query는 비동기 상태 관리자다. 어떤 형태의 비동기 상태든 관리할 수 있다 — Promise만 받으면 만족한다."

- **async state manager**: 비동기 상태 관리자. Promise로 해결되는 어떤 비동기 작업이든 — HTTP 요청, IndexedDB 읽기, Web Worker 응답 등 — 관리 대상이 된다.
- **is happy as long as it gets a Promise**: Promise만 있으면 된다. queryFn이 반환하는 값이 Promise이기만 하면 fetch인지 다른 비동기 작업인지 React Query는 신경 쓰지 않는다.

> Yes, most of the time, we produce Promises via data fetching, so that's where it shines. But it does more than just handling loading and error states for you.

"맞다, 대부분의 경우 우리는 데이터 페칭을 통해 Promise를 만드니까 거기서 빛난다. 하지만 로딩·에러 상태 처리 그 이상을 한다."

- **shines**: 가장 잘 발휘된다. 페칭이 주된 사용 사례일 뿐, 본질은 더 넓다.
- **more than just handling loading and error states**: 로딩·에러 상태 처리는 최소 기능. 캐싱, 중복 요청 제거, 백그라운드 갱신, 공유까지 포함한다.

> It is a proper, real, "global state manager".

"이것은 본격적인, 진짜 의미의 '글로벌 상태 관리자'다."

- **proper, real**: 본격적인, 진짜 의미의. Redux·Zustand와 동등한 글로벌 상태 관리 능력이 있다는 강조.
- **global state manager**: 앱 전역에서 같은 QueryKey로 데이터를 공유한다. 어떤 컴포넌트에서든 `useQuery(['todos'])`를 호출하면 같은 캐시 엔트리를 바라본다.

```ts
// HTTP 요청 (일반적인 사용)
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/api/todos').then(r => r.json()),
})

// IndexedDB 읽기도 가능 — Promise를 반환하면 됨
const { data } = useQuery({
  queryKey: ['local-notes'],
  queryFn: () => localDB.notes.toArray(),
})
```

---
## 종합

React Query가 "데이터 페칭 라이브러리"라는 인식은 가장 많이 쓰이는 use-case에서 온 것이지, 라이브러리의 본질이 아니다. Promise를 반환하는 모든 비동기 작업을 캐싱·공유·재요청까지 일관된 방식으로 관리하는 것이 핵심이다. `useQuery`를 통해 앱 전역에서 같은 데이터를 공유하므로 Redux처럼 별도 전역 스토어를 만들지 않아도 서버 상태를 관리할 수 있다.

---
# 두 컴포넌트가 동시에 같은 useQuery를 호출하면 네트워크 요청은 몇 번 발생하는가?

## 도입

같은 데이터가 필요한 컴포넌트가 둘 있을 때, 각자 `useQuery`를 호출하면 네트워크 요청이 두 번 나갈 것 같지만 그렇지 않다. React Query는 같은 시점에 in-flight인 같은 key의 요청을 하나로 합친다.

---
## 본문

> React Query will also deduplicate requests that would happen at the same time, so in the above scenario, even though two components request the same data, there will be only one network request.

"React Query는 동시에 발생하는 요청도 중복 제거(deduplicate)한다. 따라서 두 컴포넌트가 같은 데이터를 요청해도 네트워크 요청은 하나만 발생한다."

- **deduplicate**: 중복 제거. 첫 번째 요청이 진행 중(in-flight)일 때, 같은 QueryKey의 두 번째 `useQuery` 호출은 새 fetch를 만들지 않고 첫 번째 요청의 Promise에 합류한다.
- **at the same time**: 같은 시점. 같은 렌더 사이클에서 동시에 호출된 경우에 적용된다.

중요한 제약 — deduplication이 안 되는 케이스:

```tsx
// ⚠️ 같은 렌더 사이클이 아닌 경우: 요청이 두 번 발생할 수 있음
function ComponentOne() {
  const { data } = useTodos()

  if (data) {
    // data가 도착한 뒤에야 ComponentTwo가 마운트됨
    // → 두 번째 useTodos()는 첫 번째와 시간 간격이 있어 deduplication 범위 밖
    return <ComponentTwo />
  }
  return <Loading />
}

function ComponentTwo() {
  const { data } = useTodos()  // ← 별도 요청 발생 가능
}

// ✅ 같은 렌더에서 마운트 → deduplication 동작
function Parent() {
  return (
    <>
      <ComponentOne />  {/* useTodos() */}
      <ComponentTwo />  {/* useTodos() → 같은 요청으로 합쳐짐 */}
    </>
  )
}
```

---
## 종합

deduplication은 React Query가 컴포넌트 설계를 단순하게 유지해 주는 핵심 기능 중 하나다. 이것이 없으면 컴포넌트 N개가 같은 데이터를 필요로 할 때 "누가 fetch를 담당하고 props로 내려줄 것인가"를 매번 설계해야 한다. deduplication 덕분에 각 컴포넌트가 독립적으로 `useQuery`를 호출해도 실제 네트워크 요청은 최소화된다. 단, 이 보장은 같은 시점에 in-flight인 요청 사이에서만 성립한다 — 시간 간격이 있는 lazy mount 시나리오에서는 별도 fetch가 발생한다.

---
# React Query를 'data synchronization tool'이라고 부르는 이유는?

## 도입

React Query가 서버 데이터를 가져온다는 것은 알지만, 왜 "동기화 도구"라고 부를까? 프론트엔드가 데이터를 "소유"하는 것이 아니라 백엔드의 현재 상태를 "빌려 표시"하고 있다는 시각에서 이 명칭이 나온다.

---
## 본문

> Because React Query manages async state (or, in terms of data fetching: server state), it assumes that the frontend application doesn't "own" the data. And that's totally right.

"React Query가 비동기 상태(데이터 페칭 관점에서는 서버 상태)를 관리하기 때문에, 프론트엔드 애플리케이션이 데이터를 '소유'하지 않는다고 가정한다. 그리고 그건 완전히 맞다."

- **server state**: 진짜 주인이 백엔드(DB)인 상태. 폼 입력값이나 모달 열림 여부 같은 client state와 다르다.
- **own**: 소유. 폼 입력값은 프론트엔드가 100% 소유하지만, 서버 데이터는 프론트엔드가 만든 게 아니라 백엔드가 진짜 주인이다.

> If we display data on the screen that we fetch from an API, we only display a "snapshot" of that data - the version of how it looked when we retrieved it.

"API에서 가져온 데이터를 화면에 표시할 때, 우리는 그 데이터의 '스냅샷'만 표시하는 것이다 — 가져왔을 때 그것이 어떻게 보였는지의 버전."

- **snapshot**: 그 순간의 사진. `useQuery`로 데이터를 가져온 시점의 정지화면 — 백엔드는 그 사이에도 다른 사용자의 요청으로 계속 변한다.

> React Query provides the means to synchronize our view with the actual data owner - the backend.

"React Query는 우리의 뷰를 실제 데이터 소유자 — 백엔드와 동기화하는 수단을 제공한다."

- **synchronize**: 동기화. 스냅샷이 최신 상태를 반영하도록 주기적으로 또는 전략적 시점에 갱신한다.

```
백엔드 (진짜 데이터 주인)
  └── 계속 변하는 DB 상태

프론트엔드 (스냅샷만 보관)
  └── 가져온 시점의 복사본
       ← React Query가 주기적으로 동기화 →
```

---
## 종합

프론트엔드가 서버 데이터를 "소유"한다고 착각하면 문제가 생긴다. "이미 받았으니 끝"이라고 생각하면 다른 사용자가 백엔드에서 데이터를 변경해도 내 화면은 영원히 옛날 스냅샷을 보여준다. React Query의 `staleTime`, `refetchOnWindowFocus`, `refetchOnMount` 같은 옵션이 왜 존재하는지는 모두 이 "동기화" 관점에서 이해된다 — 언제, 얼마나 자주 백엔드와 뷰를 맞출 것인가를 제어하는 도구들이다.

---
# 같은 데이터라도 어떤 건 자주 stale해지고 어떤 건 오래 fresh한 이유는?

## 도입

`staleTime`에 "정답" 값이 없는 이유는 데이터의 변화 빈도가 도메인에 따라 완전히 다르기 때문이다. 트위터 좋아요 수는 1초 후에도 stale이지만, 환율은 하루 내내 fresh할 수 있다.

---
## 본문

> The answer depends totally on our problem domain. If we fetch a Twitter post with all its likes and comments, it is likely outdated (stale) pretty fast.

"답은 완전히 우리의 문제 도메인에 달려 있다. 트위터 게시글을 모든 좋아요와 댓글과 함께 가져온다면, 그것은 꽤 빠르게 오래되었을(stale) 가능성이 높다."

- **problem domain**: 문제 도메인. 데이터가 얼마나 빨리 변하는지는 비즈니스 영역이 결정한다. 소셜 미디어 = 실시간 변화, 정적 콘텐츠 = 느린 변화.
- **outdated (stale)**: stale. 캐시는 있지만 백엔드 현재 상태와 달라졌을 가능성이 있는 상태.

> If we fetch exchange rates that update on a daily basis, well, our data is going to be quite accurate for some time even without refetching.

"하루 단위로 업데이트되는 환율을 가져온다면, 우리 데이터는 refetch 없이도 한동안 꽤 정확할 것이다."

- **update on a daily basis**: 하루 단위 업데이트. 데이터 변화 빈도가 곧 staleTime의 기준이 된다.
- **accurate**: 정확한 — 백엔드 현재 상태와 일치하는가. 환율은 하루 동안 거의 변하지 않으니 긴 staleTime이 합리적이다.

도메인별 staleTime 예시:

```ts
// 트위터 좋아요 (빠르게 stale)
useQuery({ queryKey: ['post', id], staleTime: 30 * 1000 })  // 30초

// 환율 (하루 내내 fresh)
useQuery({ queryKey: ['exchange-rates'], staleTime: 1000 * 60 * 60 * 24 })  // 24시간

// 사용자 프로필 (중간)
useQuery({ queryKey: ['user', id], staleTime: 1000 * 60 * 5 })  // 5분
```

---
## 종합

stale 여부는 절대적인 시간 기준이 아니라 도메인 의존적인 판단이다. React Query가 staleTime의 "정답"을 내장하지 않고 사용자가 도메인에 맞춰 설정하도록 두는 이유가 여기 있다. 데이터가 얼마나 자주 변하는가, 그리고 사용자가 약간 stale한 데이터를 보는 것이 얼마나 문제인가 — 이 두 질문의 답이 staleTime 설정의 기준이 된다.

---
# React Query의 디폴트는 backend와 자주 동기화하는 쪽인가, 적게 동기화하는 쪽인가?

## 도입

React Query의 디폴트 설정이 "네트워크 요청이 너무 많다"고 느껴진다면, 그것은 버그가 아니라 의도된 디자인이다. React Query는 의도적으로 "자주 업데이트하는 쪽으로 편향"되어 있다.

---
## 본문

> React Query provides the means to synchronize our view with the actual data owner - the backend. And by doing so, it errs on the side of updating often rather than not updating often enough.

"React Query는 우리의 뷰를 실제 데이터 소유자 — 백엔드와 동기화하는 수단을 제공한다. 그렇게 하면서 충분히 업데이트하지 않는 것보다 자주 업데이트하는 쪽으로 치우친다."

- **synchronize**: 동기화. 뷰와 백엔드 상태를 일치시키는 것.
- **errs on the side of**: ~쪽으로 의도적으로 치우친다. "실수를 한다면 차라리 이쪽으로 하겠다"는 의미의 관용 표현. 업데이트가 "너무 많은" 실수가 "너무 적은" 실수보다 낫다는 철학.

이 철학이 구체적으로 구현된 디폴트:

```
staleTime = 0           캐시 데이터가 즉시 stale 취급
refetchOnMount = true   컴포넌트 마운트 시 자동 refetch
refetchOnWindowFocus = true   탭 포커스 복귀 시 자동 refetch
refetchOnReconnect = true     네트워크 재연결 시 자동 refetch
```

---
## 종합

React Query 디폴트가 "자주 업데이트"로 치우친 이유는 사용자 경험에서 두 실패 유형의 심각도가 다르기 때문이다. background refetch가 한 번 더 일어나는 것(과잉 업데이트)은 사용자 눈에 거의 보이지 않는다. 반면 stale 데이터를 보여주는 것(부족한 업데이트) — 예를 들어 30분 전 좋아요 수가 그대로 — 은 사용자가 직접 인식하는 문제다. 이 비대칭 때문에 React Query는 "조금 더 많이 업데이트하는 쪽으로" 의도적으로 기운다.

---
# React Query 이전, frontend에서 데이터 페칭에 흔히 쓰던 두 가지 접근은 무엇이었나?

## 도입

React Query가 해결하는 문제를 이해하려면 그 이전에 어떤 방식들이 쓰였고 왜 부족했는지를 봐야 한다. "한 번 받아서 전역 배포"와 "마운트마다 새로 받기"가 대표적인 두 안티패턴이다.

---
## 본문

> Two approaches to data fetching were pretty common before libraries like React Query came to the rescue: 1. fetch once, distribute globally, rarely update 2. fetch on every mount, keep it local

"React Query 같은 라이브러리가 구원하러 오기 전, 두 가지 접근이 상당히 흔했다: 1. 한 번 fetch해서 전역 배포, 드물게 업데이트 2. 마운트마다 fetch, 로컬로 유지"

- **came to the rescue**: 구원하러 왔다. 기존 방식들이 충분히 고통스러웠다는 뉘앙스.

> Both of these approaches are pretty sub-optimal. The first one doesn't update our local cache often enough, while the second one potentially re-fetches too often, and also has a questionable ux because data is not there when we fetch for the second time.

"두 접근 모두 꽤 차선적이다. 첫 번째는 로컬 캐시를 충분히 자주 업데이트하지 않는 반면, 두 번째는 너무 자주 재요청할 수 있고, 두 번째로 fetch할 때 데이터가 없어 UX가 의심스럽다."

- **sub-optimal**: 차선적. 정답이 아닌, 더 나은 방법이 있다는 함의.
- **doesn't update often enough**: 충분히 자주 업데이트 안 함. 갱신 부족 결함.
- **questionable ux**: UX가 의심스러운. 같은 데이터를 두 번째로 보러 왔는데 또 스피너를 봐야 한다는 문제.
- **data is not there when we fetch for the second time**: 두 번째 마운트 시 캐시가 없어 빈 상태부터 시작.

```
접근 1: fetch once, distribute globally
  결함: 백그라운드 갱신 없음 → 시간이 지날수록 stale
  비유: Redux에서 앱 시작 시 한 번 dispatch → 그 뒤엔 새로고침 전까지 동일 데이터

접근 2: fetch on every mount
  결함: 컴포넌트 unmount → 데이터 사라짐
        재방문 시 처음부터 스피너
        → "이미 본 데이터인데 왜 또 로딩이지?"

React Query:
  캐시 유지 + 전략적 시점에 자동 동기화 → 두 결함 모두 회피
```

---
## 종합

두 안티패턴은 정반대 방향의 결함을 가진다. "한 번 받아서 전역 배포"는 갱신 부족, "마운트마다 받기"는 갱신 과다 + 빈 상태 UX. React Query는 캐시는 유지하되 전략적 시점(마운트, 포커스, 재연결, 직접 invalidate)에만 자동 동기화하는 제3의 길로 둘을 모두 회피한다.

---
# 'fetch once, distribute globally, rarely update' 접근은 어떻게 동작하며 무엇이 문제인가?

## 도입

Redux로 서버 데이터를 관리하던 전형적인 패턴이다. 앱이 시작할 때 한 번 데이터를 받아 전역 스토어에 넣고, 그 뒤로는 거의 갱신하지 않는다. 데이터를 "이미 소유했다"고 착각하는 것이 핵심 결함이다.

---
## 본문

> This is pretty much what I myself have been doing with redux a lot. Somewhere, I dispatch an action that initiates the data fetching, usually on mount of the application.

"이것은 내가 Redux로 많이 해왔던 것이다. 어딘가에서 데이터 페칭을 시작하는 액션을 dispatch하는데, 보통 애플리케이션 마운트 시다."

- **dispatch an action**: Redux 패턴. 컴포넌트가 직접 fetch하는 게 아니라 action을 보내 thunk/saga가 페칭을 트리거한다.
- **on mount of the application**: 앱이 시작될 때 한 번 — 그 뒤엔 사용자가 새로고침하기 전까지 같은 데이터를 본다.

> After we get the data, we put it in a global state manager so that we can access it everywhere in our application. Do we refetch that data? No, we have "downloaded" it, so we have it already, why should we?

"데이터를 받은 후 앱 어디서든 접근할 수 있도록 글로벌 상태 관리자에 넣는다. 그 데이터를 다시 fetch하는가? 아니오, '다운로드'했으니 이미 있다, 왜 해야 하는가?"

- **"downloaded"**: 따옴표가 붙은 이유는 비꼬는 톤 — "이미 받았으니 끝"이라는 잘못된 정신 모델. 서버 데이터는 프론트엔드가 소유한 게 아니라 빌려온 스냅샷이다.

> Maybe if we fire a POST request to the backend, it will be kind enough to give us the "latest" state back. If you want something more accurate, you can always reload your browser window…

"혹시 백엔드에 POST 요청을 보내면 '최신' 상태를 친절하게 돌려줄 수도 있다. 더 정확한 것을 원한다면 브라우저 창을 새로고침하면 된다…"

- **POST request**: "POST 응답에 latest state가 묻어오길 기대"하는 안티패턴. 백엔드 협업 없이는 보장되지 않는다.
- **reload your browser window**: 사용자에게 책임을 떠넘기는 워크어라운드.

---
## 종합

이 접근의 핵심 결함은 백그라운드 동기화 메커니즘이 전혀 없다는 것이다. 앱을 열어두고 30분 작업하면 그 동안 다른 사용자가 만든 변경은 새로고침 전까지 절대 보이지 않는다. POST 응답에 최신 상태를 기대하는 것도 백엔드가 그렇게 구현했을 때만 동작하는 취약한 가정이다. React Query는 이 접근을 "서버 상태를 소유한 척하는 착각"으로 평가한다.

---
# 'fetch on every mount, keep it local' 접근은 어떻게 동작하며 무엇이 문제인가?

## 도입

전역 스토어에 넣는 게 "과하다"고 느낄 때 선택하는 패턴이다. 필요할 때 그때그때 `useEffect`로 가져오고 `useState`에 보관한다. 간단해 보이지만 "컴포넌트가 닫히면 데이터가 사라진다"는 근본적 한계가 있다.

---
## 본문

> Sometimes, we might also think that putting data in global state is "too much". We only need it in this Modal Dialog, so why not fetch it just in time when the Dialog opens.

"때로 우리는 데이터를 전역 상태에 넣는 것이 '너무 많다'고 생각할 수 있다. 이 Modal Dialog에서만 필요하니, Dialog가 열릴 때 그때그때 fetch하는 게 어떨까."

- **just in time**: 필요할 때 그때그때. 지연 페칭의 이점이 있어 보이지만 캐싱 없이 매번 새로 가져온다는 함정.

> You know the drill: useEffect, empty dependency array (throw an eslint-disable at it if it screams), setLoading(true) and so on …

"다 알잖아 그 패턴: useEffect, 빈 의존성 배열(경고를 지르면 eslint-disable을 던지고), `setLoading(true)` 등등…"

- **You know the drill**: 클리셰 코드를 비꼬는 표현.
- **eslint-disable**: ESLint의 `react-hooks/exhaustive-deps` 경고를 억제하는 주석 — 규칙을 해결하는 대신 입막음하는 안티패턴.

> Of course, we now show a loading spinner every time the Dialog opens until we have the data. What else can we do, the local state is gone…

"물론 이제는 데이터가 올 때까지 Dialog가 열릴 때마다 로딩 스피너를 보여준다. 달리 무엇을 할 수 있겠는가, 로컬 상태가 사라졌으니…"

- **the local state is gone**: 컴포넌트가 unmount되면 `useState`로 들고 있던 데이터가 사라진다. 다음에 다시 열면 처음부터 로딩이다.

```tsx
// 이 패턴의 문제
function UserModal({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => { setUser(data); setLoading(false) })
  }, [])

  // 모달 닫으면 user state = null로 리셋
  // 다시 열면 처음부터 로딩 스피너...
}
```

---
## 종합

이 패턴의 핵심 결함은 "두 번째 열었을 때의 UX"를 항상 망친다는 것이다. 이미 본 데이터인데도 모달을 닫았다가 다시 열면 처음부터 스피너를 봐야 한다. 캐싱 없는 `useState`는 컴포넌트 생명주기에 묶여 있어 컴포넌트가 사라지면 데이터도 사라진다. React Query는 `gcTime`이 만료되기 전까지 캐시를 유지하므로, 모달을 닫았다 다시 열어도 stale 캐시를 즉시 보여주고 background에서 revalidate한다.

---
# React Query의 디폴트 fetch 빈도가 거슬려 refetchOnMount/refetchOnWindowFocus를 끄거나, server data를 별도 state manager에도 함께 보관하는 식으로 우회하려는 시도에 대해, 저자는 어떻게 평가하며 정공법으로 무엇을 권하는가?

## 도입

"React Query가 너무 자주 fetch한다"는 느낌이 들면 refetch 플래그를 끄거나 server data를 Redux에도 넣고 싶은 충동이 생긴다. 저자는 두 가지 모두 안티패턴이라고 평가하며, 정공법으로 `staleTime` 커스터마이즈를 권한다.

---
## 본문

> React Query is great at managing async state globally in your app, if you let it.

"React Query는 당신이 그렇게 쓰게 두면, 앱에서 비동기 상태를 전역으로 관리하는 데 탁월하다."

- **if you let it**: 그렇게 쓰게 두면. 라이브러리가 하려는 것을 우회하거나 차단하지 말라는 조건.

> Only turn off the refetch flags if you know that make sense for your use-case, and resist the urge to sync server data to a different state manager.

"use-case에 맞는다는 판단이 분명할 때만 refetch 플래그를 끄고, server data를 다른 상태 관리자로 sync하려는 충동에 저항하라."

- **turn off the refetch flags**: `refetchOnMount: false`, `refetchOnWindowFocus: false` 등. 분명한 이유 없이 끄면 React Query 핵심 가치를 무력화한다.
- **resist the urge**: 충동에 저항하라. server data를 Redux/Zustand에도 넣으면 두 스토어의 일관성 관리 부담이 생기고, React Query의 refetch가 갱신해도 다른 store는 stale인 채로 남는다.

> Usually, customizing staleTime is all you need to get a great ux while also being in control of how often background updates happen.

"보통 staleTime을 커스터마이즈하는 것만으로도 background 업데이트가 얼마나 자주 일어나는지 제어하면서 훌륭한 UX를 얻기에 충분하다."

- **customizing staleTime**: `staleTime`을 도메인에 맞게 설정. fresh 윈도우 안에서는 네트워크 0번, 윈도우 밖에서는 자동 refetch가 살아 있어 UX와 제어 양쪽을 챙긴다.

```ts
// 안티패턴 1: refetch 플래그 끄기
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchOnMount: false,       // ❌ mount 트리거 제거
  refetchOnWindowFocus: false, // ❌ 포커스 트리거 제거
})

// 안티패턴 2: server data를 별도 store에 동기화
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })
dispatch(setTodos(data))  // ❌ Redux에도 넣기 → 두 스토어 불일치 위험

// 정공법: staleTime 커스터마이즈
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 1000 * 60 * 5, // ✅ 5분 fresh → 그 안에서는 네트워크 0번
})
```

---
## 종합

두 우회 모두 React Query가 자동으로 하려는 background refetch를 막거나 혼란스럽게 만든다. 정공법인 `staleTime` 커스터마이즈는 "fresh 윈도우 안에서는 요청 없음, 윈도우 밖에서는 자동 갱신"이라는 제어를 도메인 단위로 정확하게 부여한다. `refetchOnMount`/`refetchOnWindowFocus`를 끄는 것은 "이 use-case에서는 자동 갱신이 의미 없다"는 판단이 명확할 때만 — 예를 들어 절대 변하지 않는 정적 데이터 — 정당화된다.
