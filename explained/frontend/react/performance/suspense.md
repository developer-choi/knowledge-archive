# `<Suspense>`의 역할과 props(fallback/children)는?

## 도입

`<Suspense>`는 React가 비동기 렌더링을 선언적으로 처리하기 위해 만든 컴포넌트다. 핵심 역할은 두 가지 — 자식(children)이 준비될 때까지 대체 UI(fallback)를 보여주고, 준비되면 자식으로 교체하는 것이다. loading 상태 처리를 컴포넌트 내부의 조건부 렌더링에서 꺼내 UI 트리 구조로 선언하는 방식이다.

---

## 본문

> `<Suspense>` lets you display a fallback until its children have finished loading.

"`<Suspense>`는 자식들이 로딩을 마칠 때까지 fallback을 표시할 수 있게 해준다."

**children props**

> If children suspends while rendering, the Suspense boundary will switch to rendering fallback.

"children이 렌더링 중 suspend되면, Suspense boundary가 fallback 렌더링으로 전환된다."

- **suspends**: 컴포넌트가 아직 준비되지 않은 비동기 작업(데이터 패칭 등)이 있어 렌더링을 잠시 중단한 상태. React는 내부적으로 Promise throw 메커니즘으로 이를 감지한다.
- **boundary**: Suspense가 만드는 경계. suspend된 자식에 대한 fallback 처리의 단위. 가장 가까운 Suspense boundary가 해당 suspend를 담당한다.

**fallback props**

> An alternate UI to render in place of the actual UI if it has not finished loading.

"로딩이 완료되지 않은 경우 실제 UI 대신 렌더링할 대체 UI."

> If fallback suspends while rendering, it will activate the closest parent Suspense boundary.

"fallback이 렌더링 중 suspend되면, 가장 가까운 부모 Suspense boundary를 활성화한다."

- **fallback**: `<Spinner />`, `<Skeleton />` 같은 로딩 상태 UI. 단순한 JSX 요소여야 하며, fallback 자체가 suspend되면 그 Suspense는 처리하지 못하고 상위로 위임한다.

```
<Suspense fallback={<Spinner />}>  ← boundary
  <SlowComponent />                ← suspend → Spinner 표시
</Suspense>
                                   ← SlowComponent 완료 → 교체
```

---

## 종합

`<Suspense>`는 선언적 로딩 경계다. `if (isLoading) return <Spinner />`를 컴포넌트 안에 박는 대신, 로딩 처리를 상위 컴포넌트가 담당하도록 분리한다. 이를 통해 자식 컴포넌트는 "데이터가 있다"고 가정하고 렌더링 로직만 작성할 수 있다. Streaming과 결합하면 서버에서도 같은 boundary 단위로 청크를 분리해 전송한다.

---

# 컴포넌트가 suspend된다는 것은 무엇을 의미하는가?

## 도입

"suspend"라는 단어는 React 문서에서 자주 등장하지만, 실제로 컴포넌트 레벨에서 어떤 일이 벌어지는지를 이해해야 Suspense를 제대로 활용할 수 있다. suspend는 렌더링 중단이고, 중단된 자리를 fallback이 채운다.

---

## 본문

아래 예시에서 `SearchResults`는 검색 결과를 패칭하는 동안 suspend된다.

```tsx
function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}

function SearchResults({ query }) {
  const albums = use(fetchData(`/search?q=${query}`));
  
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>...</li>
      ))}
    </ul>
  );
}
```

- `use(fetchData(...))`: Promise가 아직 pending 상태면 `SearchResults`가 suspend된다. React는 이를 감지하고 해당 Suspense boundary의 fallback(`<h2>Loading...</h2>`)을 렌더링한다.
- "a" 입력 → 결과 도착 → 결과 표시 → "ab"로 변경 → 다시 suspend → fallback으로 교체

```
query 변경 시의 suspend 사이클

query="a"
  → SearchResults suspend
  → Suspense: fallback 표시
  → 데이터 도착
  → SearchResults 렌더링 (fallback 교체)

query="ab" (업데이트)
  → SearchResults 다시 suspend
  → "a" 결과가 loading fallback으로 교체됨
```

---

## 종합

suspend는 "아직 못 그린다"는 신호를 React에게 보내는 것이다. React는 이 신호를 받으면 가장 가까운 Suspense boundary의 fallback으로 전환한다. 데이터가 도착하면 React가 해당 컴포넌트를 다시 렌더링 시도하고, 성공하면 fallback을 실제 UI로 교체한다. 이 사이클이 Suspense의 핵심 동작이다.

---

# Suspense를 활성화(suspend)시킬 수 있는 데이터 소스 조건은?

## 도입

`<Suspense>`를 쓴다고 모든 비동기 작업이 자동으로 감지되는 게 아니다. suspend를 유발할 수 있는 데이터 소스는 특정 조건을 만족해야 한다. 어떤 패턴이 Suspense를 활성화하고 어떤 패턴이 그렇지 않은지를 알아야 예상치 못한 동작을 피할 수 있다.

---

## 본문

> Only Suspense-enabled data sources will activate the Suspense component. They include:
> - Data fetching with Suspense-enabled frameworks like Relay and Next.js
> - Lazy-loading component code with `lazy`
> - Reading the value of a cached Promise with `use`

"Suspense-enabled 데이터 소스만이 Suspense 컴포넌트를 활성화한다. 포함되는 것:
- Relay, Next.js 같은 Suspense-enabled 프레임워크를 사용한 데이터 패칭
- `lazy`를 사용한 컴포넌트 코드의 지연 로딩
- `use`를 사용한 캐시된 Promise의 값 읽기"

- **Suspense-enabled**: 내부적으로 Promise를 throw하는 방식으로 구현된 데이터 소스. 일반적인 `await`이나 `useEffect` 내 fetch는 이 조건을 만족하지 않는다.
- **`lazy`**: `React.lazy(() => import('./HeavyComponent'))`로 컴포넌트를 동적 import할 때, 번들이 로드되는 동안 suspend가 발생한다.
- **`use`**: React 19의 `use(promise)` hook. pending Promise를 전달하면 suspend된다.

공식 목록 외 추가 Suspense 활성화 패턴:
- async Server Component 안에서 `await`으로 데이터를 가져오는 경우
- TanStack Query의 `useSuspenseQuery()`

---

## 종합

Suspense가 감지하는 것은 Promise throw다. 라이브러리나 프레임워크가 내부에서 "아직 준비 안 됨"을 React에게 알리기 위해 Promise를 throw하는 방식으로 구현되어야 Suspense가 활성화된다. 일반 `fetch().then()`이나 `useEffect` 안의 비동기 호출은 이 메커니즘을 사용하지 않아 Suspense가 감지하지 못한다.

---

# Suspense가 Effect나 이벤트 핸들러에서 fetch한 데이터도 감지하는가?

## 도입

컴포넌트에서 데이터를 가져오는 가장 흔한 패턴은 `useEffect` 안에서 fetch하거나, 이벤트 핸들러에서 fetch하는 것이었다. 이런 패턴에 `<Suspense>`를 씌우면 로딩 상태가 감지될 것이라고 기대할 수 있다. 하지만 그렇지 않다.

---

## 본문

> Suspense does not detect when data is fetched inside an Effect or event handler.

"Suspense는 Effect나 이벤트 핸들러 안에서 데이터가 패칭될 때는 감지하지 못한다."

이것은 Suspense의 의도적인 설계 제한이다. Suspense는 렌더링 중에 발생하는 suspend(Promise throw)만 감지한다. `useEffect`와 이벤트 핸들러는 렌더링 이후 실행되므로 Suspense의 감지 범위 밖이다.

```
Suspense가 감지하는 것           Suspense가 감지 못하는 것
──────────────────────           ─────────────────────────
렌더링 중 Promise throw          useEffect 내 fetch
use(promise)                     onClick 이벤트 핸들러의 fetch
React.lazy()
useSuspenseQuery()
async Server Component await
```

---

## 종합

`useEffect` 기반 데이터 패칭은 Suspense와 조합되지 않는다. 이 패턴에서 로딩 상태를 관리하려면 여전히 `isLoading` 상태 변수를 직접 관리해야 한다. Suspense의 이점(선언적 로딩 경계, Selective Hydration, Streaming)을 얻으려면 Suspense-enabled 라이브러리(TanStack Query의 `useSuspenseQuery`, Next.js의 async Server Component 등)를 사용해야 한다.

---

# Nested Suspense를 사용하면 어떤 이점이 있는가?

## 도입

컴포넌트 트리에서 느린 컴포넌트와 빠른 컴포넌트가 섞여 있을 때, Suspense를 하나만 두면 느린 것이 빠른 것을 기다리게 한다. Nested Suspense는 각각 독립된 로딩 경계를 만들어 이 문제를 해결한다.

---

## 본문

```tsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

> With this change, displaying the Biography doesn't need to "wait" for the Albums to load.

"이 변경으로 Biography 표시가 Albums가 로드될 때까지 '기다릴' 필요가 없다."

동작 원리:

```
초기 상태 (Biography와 Albums 모두 로딩 중)
  → 외부 Suspense: BigSpinner 표시
  (Biography가 완료되면)
  → Biography 표시 시작
  → 내부 Suspense: AlbumsGlimmer 표시
  (Albums가 완료되면)
  → Albums 표시 (AlbumsGlimmer 교체)
```

- `<Albums />`가 suspend되어도 내부 `<Suspense>` boundary가 처리한다. 내부 `<Suspense>` 자체는 suspend되지 않으므로 외부 `<Suspense>`로 전파되지 않는다.
- `<Biography />`는 `<Albums />`와 독립된 경계에 있어 서로의 로딩 상태에 영향받지 않는다.

---

## 종합

Nested Suspense는 UI 트리를 독립적인 로딩 단위로 분리하는 도구다. 한 부분이 느려도 다른 부분의 표시를 막지 않는다. Streaming 환경에서는 각 Suspense boundary가 청크 경계가 되어, 준비된 boundary부터 순차적으로 클라이언트에 전달된다. 없으면 느린 컴포넌트 하나가 전체 섹션을 블로킹한다.

---

# [UNVERIFIED] 직렬로 배치된 Suspense는 왜 위험하고 어떤 문제를 만드는가?

## 도입

같은 컴포넌트 안에서 Suspense-enabled 쿼리를 여러 개 사용하면 직관적으로는 병렬 실행을 기대한다. 하지만 Suspense의 throw 기반 메커니즘 때문에 실제로는 직렬(waterfall) 구조로 실행될 수 있다.

---

## 본문

Suspense는 내부적으로 Promise throw 기반이다. 컴포넌트가 실행되다가 첫 번째 suspend를 만나면 즉시 throw되고, Suspense boundary가 fallback을 표시한다. 첫 번째 Promise가 resolve되면 React는 컴포넌트를 처음부터 다시 실행한다. 이때 첫 번째는 cache hit로 통과하고, 두 번째 suspend에서 또 throw된다.

```tsx
export default function ClientComponent() {
  const result1 = useQuery({ queryKey: ["some1"], suspense: true }); // 첫 throw
  const result2 = useQuery({ queryKey: ["some2"], suspense: true }); // 두 번째 throw

  return (...);
}
```

실제 실행 흐름:

```
1회 실행: result1 → throw (some1 패칭 시작)
  [some1 패칭 중]
2회 실행: result1 → hit, result2 → throw (some2 패칭 시작)
  [some2 패칭 중]
3회 실행: result1 → hit, result2 → hit → 렌더링 완료

결과: some1 완료 후에야 some2 시작 (waterfall)
```

의존 관계가 없는 두 API가 순차 호출되는 것은 불필요한 지연이다.

해결 방법: Nested Suspense와 컴포넌트 분리, 또는 `useQueries()` 등 병렬 쿼리 API 사용.

---

## 종합

직렬 Suspense 문제는 Suspense의 throw 메커니즘이 만드는 부작용이다. 컴포넌트가 다시 실행될 때마다 이전 throw 지점까지는 통과하지만, 다음 throw에서 또 멈춘다. 독립적인 데이터 소스라면 각각 별도 컴포넌트로 분리하고 Nested Suspense로 감싸야 병렬 패칭과 독립적인 로딩 UI를 동시에 얻을 수 있다.

---

# Suspense가 Streaming에 기여하는 방식은?

## 도입

Streaming과 Suspense는 별개의 개념이지만 Next.js에서 밀접하게 결합되어 있다. Suspense는 "기다리는 동안 fallback을 보여주는" 클라이언트 패턴이고, Streaming은 "서버에서 준비된 부분부터 보내는" 전송 패턴이다. 둘이 합쳐지면 서버-클라이언트 전체에 걸친 점진적 UI 로딩이 가능해진다.

---

## 본문

> You can use Suspense to break down your app into smaller independent units which can be streamed independently of each other without blocking the rest of the app.

"Suspense를 사용해 앱을 더 작은 독립 단위로 분해할 수 있으며, 이 단위들은 나머지 앱을 블로킹하지 않고 서로 독립적으로 스트리밍될 수 있다."

> React created Suspense, which allows for server-side HTML streaming and selective hydration on the client.

"React는 서버 사이드 HTML 스트리밍과 클라이언트에서의 selective hydration을 가능하게 하는 Suspense를 만들었다."

> By wrapping a component with `<Suspense>`, you can tell the server to deprioritize that component's rendering and hydration, letting other components load in without getting blocked by the heavier ones.

"`<Suspense>`로 컴포넌트를 감싸면, 서버에게 해당 컴포넌트의 렌더링과 hydration의 우선순위를 낮추도록 지시할 수 있어, 다른 컴포넌트들이 무거운 것들에 블로킹되지 않고 로드될 수 있다."

> If the user attempts to interact with a certain component, that component will be prioritized over the others.

"사용자가 특정 컴포넌트와 상호작용하려 하면, 해당 컴포넌트가 다른 것들보다 우선순위를 갖는다."

- **deprioritize**: 렌더링 순서를 낮추는 것. 서버는 Suspense boundary 바깥의 컴포넌트를 먼저 렌더링하고 스트리밍한다.
- **selective hydration**: 모든 컴포넌트를 한꺼번에 hydrate하지 않고 사용자 상호작용이 발생하는 컴포넌트를 우선 hydrate한다.

```
Suspense + Streaming 통합 흐름

서버                          클라이언트
────────────────────          ─────────────────────────
[Header 렌더링 완료]  ──→    [Header HTML 표시]
[Layout 렌더링 완료]  ──→    [Layout HTML 표시]
[SlowFeed suspend]           [SlowFeed: fallback 표시]
     ↓ 데이터 도착
[SlowFeed 렌더링 완료] ──→   [SlowFeed 교체 + hydrate]
```

---

## 종합

Suspense는 서버에서 chunk 경계를 정의하고, Streaming은 그 경계 단위로 데이터를 전송한다. 두 기술이 결합하면 "무거운 컴포넌트가 있어도 나머지는 즉시 인터랙티브해지는" 경험이 가능하다. Selective Hydration은 여기에 더해 사용자가 실제로 사용하려는 컴포넌트를 먼저 활성화해 체감 반응성을 높인다.

---

# [UNVERIFIED] Suspense를 사용하면 코드 가독성 측면에서 어떤 변화가 있는가?

## 도입

Suspense의 기술적 이점(Streaming, Selective Hydration) 외에, 코드 구조 측면에서도 의미 있는 변화가 있다. loading 상태를 컴포넌트 내부에서 관리하던 방식이 선언적 트리 구조로 바뀐다.

---

## 본문

Suspense 없이 loading 상태를 관리하면:

```tsx
// 명령형(Imperative) — isLoading을 직접 체크
if (isLoading) {
  return <div>Loading...</div>
}

return (
  <div>{data}</div>
);
```

Suspense를 사용하면 자식 컴포넌트가 loading 상태를 직접 처리하지 않는다:

```tsx
// 선언형(Declarative) — loading 처리를 상위에 위임
return (
  <div>{data}</div>
);
```

로딩 UI는 상위 컴포넌트의 Suspense가 담당한다:

```tsx
<Suspense fallback={<div>Loading...</div>}>
  <DataComponent />
</Suspense>
```

복잡한 UI(여러 컴포넌트가 동시에 또는 직렬로 API를 호출하는 상황)에서 Suspense를 쓰면 각 컴포넌트의 loading 상태를 조율하는 복잡한 상태 관리 없이 boundary를 배치하는 것으로 해결된다.

- **Imperative → Declarative**: "지금 isLoading이면 이렇게 해라"(명령형)에서 "이 경계 안이 준비되지 않으면 fallback을 보여라"(선언형)로 추상 수준이 올라간다.

---

## 종합

Suspense의 코드 가독성 이점은 loading 처리의 관심사 분리에 있다. 자식 컴포넌트는 "데이터가 있다"고 전제하고 UI 로직만 작성하고, 부모가 Suspense로 로딩 경계를 선언한다. 여러 컴포넌트의 로딩 상태를 동시에 관리해야 하는 상황에서 `isLoading1 && isLoading2 && ...` 같은 복잡한 조건 대신 Nested Suspense로 경계를 표현한다.

---

# Suspense는 Code Splitting 기능인가?

## 도입

`React.lazy()`와 `<Suspense>`를 함께 쓰는 패턴이 Code Splitting과 연결되어 있어, Suspense 자체가 Code Splitting 기능이라고 오해하기 쉽다. 실제로 Suspense의 역할과 Code Splitting의 역할을 분리해 이해해야 한다.

---

## 본문

> As in previous versions of React, you can also use Suspense for code splitting on the client with React.lazy.

"이전 버전의 React에서처럼, React.lazy를 사용해 클라이언트에서 code splitting을 위해 Suspense를 사용할 수 있다."

> But our vision for Suspense has always been about much more than loading code — the goal is to extend support for Suspense so that eventually, the same declarative Suspense fallback can handle any asynchronous operation (loading code, data, images, etc).

"하지만 Suspense에 대한 우리의 비전은 항상 코드 로딩 그 이상이었다 — 목표는 Suspense 지원을 확장해서 결국 같은 선언적 Suspense fallback이 모든 비동기 작업(코드, 데이터, 이미지 로딩 등)을 처리할 수 있도록 하는 것이다."

- **code splitting**: 번들을 여러 청크로 나눠 필요한 시점에만 로드하는 최적화 기법. `React.lazy()`가 이 역할을 한다.
- **any asynchronous operation**: Suspense의 진짜 목표. 코드 로딩은 비동기 작업의 하나의 사례일 뿐이다.

역할 구분:

```
React.lazy()         → 컴포넌트 번들을 동적 import (Code Splitting)
<Suspense>           → 비동기 작업 동안 fallback 표시 (로딩 경계)

React.lazy + Suspense → Code Splitting 중 로딩 UI 제공
```

---

## 종합

Suspense 자체는 Code Splitting을 하지 않는다. Code Splitting은 `React.lazy()`(또는 번들러 레벨의 dynamic import)가 담당하고, Suspense는 그 로딩 동안 fallback을 보여주는 역할이다. React 팀의 장기 비전은 Suspense가 코드, 데이터, 이미지 등 모든 종류의 비동기 대기를 단일한 선언적 패턴으로 처리하게 하는 것이다.
