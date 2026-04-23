---
tags: [react, performance, principle]
---

# Questions
- `<Suspense>`의 역할과 props(fallback/children)는?
- 컴포넌트가 suspend된다는 것은 무엇을 의미하는가?
- Suspense를 활성화(suspend)시킬 수 있는 데이터 소스 조건은?
- Suspense가 Effect나 이벤트 핸들러에서 fetch한 데이터도 감지하는가?
- Nested Suspense를 사용하면 어떤 이점이 있는가?
- 직렬로 배치된 Suspense는 왜 위험하고 어떤 문제를 만드는가?
- Suspense가 Streaming에 기여하는 방식은?
- Suspense를 사용하면 코드 가독성 측면에서 어떤 변화가 있는가?
- Suspense는 Code Splitting 기능인가?

---

# Answers

## `<Suspense>`의 역할과 props(fallback/children)는?

### Official Answer
`<Suspense>` lets you display a fallback until its children have finished loading.

**children props**

If children suspends while rendering, the Suspense boundary will switch to rendering fallback.

**fallback props**

An alternate UI to render in place of the actual UI if it has not finished loading.
If fallback suspends while rendering, it will activate the closest parent Suspense boundary.

> #### Key Terms:
> - **fallback**: 실제 UI가 로딩되지 않았을 때 대신 보여주는 대체 UI
> - **boundary**: Suspense가 감싸는 경계. suspend된 children에 대한 fallback 처리 단위

### Reference
- https://react.dev/reference/react/Suspense

---

## 컴포넌트가 suspend된다는 것은 무엇을 의미하는가?

### Official Answer
In this example, the SearchResults component suspends while fetching the search results.

Try typing "a", waiting for the results, and then editing it to "ab".

The results for "a" get replaced by the loading fallback.

```typescript jsx
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

### Reference
- https://react.dev/reference/react/useDeferredValue

---

## Suspense를 활성화(suspend)시킬 수 있는 데이터 소스 조건은?

### Official Answer
Only Suspense-enabled data sources will activate the Suspense component.
They include:
- Data fetching with Suspense-enabled frameworks like Relay and Next.js
- Lazy-loading component code with `lazy`
- Reading the value of a cached Promise with `use`

> #### User Annotation:
> 위 목록에 추가로 두 가지가 더 있다.
> - (async) server component 안에서 `await`해서 데이터를 가져오는 경우
> - `useSuspenseQuery()`

### Reference
- https://react.dev/reference/react/Suspense

---

## Suspense가 Effect나 이벤트 핸들러에서 fetch한 데이터도 감지하는가?

### Official Answer
Suspense **does not detect** when data is fetched inside an Effect or event handler.

### Reference
- https://react.dev/reference/react/Suspense

---

## Nested Suspense를 사용하면 어떤 이점이 있는가?

### Official Answer
```typescript jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

With this change, displaying the Biography **doesn't need to "wait"** for the Albums to load.

> #### User Annotation:
> Albums가 suspend 되더라도 그 위 `<Suspense>`가 fallback이 됨.
> 1. 바깥 Suspense가 Suspend 되려면 그 안의 컴포넌트들 중 하나 이상이 Suspend 되어야 하는데,
> 2. `<Suspense>`가 어떻게 Suspend 될 수 있겠음. 불가능함.

### Reference
- https://react.dev/reference/react/Suspense

---

## 직렬로 배치된 Suspense는 왜 위험하고 어떤 문제를 만드는가?

### User Answer
suspense는 throw 기반이기 때문에, 컴포넌트(함수)가 실행되다가
- first suspense를 만나면 즉시 throw 되고,
- 다시 처음부터 위에서부터 실행되다가
- first suspense를 만나면 건너뛰고
- second suspense를 만나면 또다시 건너뛰고
- 또다시 처음부터… (이하 생략)

이렇게 직렬로 동작한다.
그래서 컴포넌트가 총 세 번 실행된다.

```typescript jsx
export default function ClientComponent() {
  const result1 = useQuery({
    queryKey: ["some1"],
    queryFn: () => getSomeApi("some1"),
    suspense: true,
    staleTime: 1000,
  });

  const result2 = useQuery({
    queryKey: ["some2"],
    queryFn: () => getSomeApi("some2"),
    suspense: true,
    staleTime: 1000,
  });

  return (
    <>
      <div>{result1.data}</div>
      <div>{result2.data}</div>
    </>
  );
}
```

실제 상황이라면 API가 Waterfall처럼 호출된다.
부모 API 응답값을 기반으로 자식 API를 호출해야 하는 케이스가 아닌데도 직렬로 호출되면 그 자체가 문제다.

---

## Suspense가 Streaming에 기여하는 방식은?

### Official Answer
You can use Suspense to break down your app into smaller independent units which can be streamed independently of each other without blocking the rest of the app.
This means users will see your content sooner and be able to start interacting with it much faster.

To solve this(SSR 문제점), React created Suspense, which allows for server-side HTML streaming and selective hydration on the client.
By wrapping a component with `<Suspense>`, you can tell the server to deprioritize that component's rendering and hydration, letting other components load in without getting blocked by the heavier ones.

For any Client Components, hydration can happen concurrently with RSCs streaming in, since the compute load is shared between client and server.

If the user attempts to interact with a certain component, that component will be prioritized over the others.

> #### User Annotation:
> Suspense = 기다리는 동안 로딩을 보여주고 다 불러오면 children으로 대체하는 기능.
> Streaming = 한 번에 다 보여주는 게 아니라 점진적으로 보여주는 기능.
> Streaming 기능을 구현하려면 Suspense를 사용해야 한다.

### Reference
- https://react.dev/reference/react/Suspense
- https://vercel.com/blog/understanding-react-server-components
- https://github.com/reactwg/react-18/discussions/37

---

## Suspense를 사용하면 코드 가독성 측면에서 어떤 변화가 있는가?

### User Answer
코드가 더 깔끔해진다 (Imperative ⇒ Declarative).

이런 코드가
```typescript jsx
if (isLoading) {
  return <div>Loading...</div>
}

return (
  <div>{data}</div>
);
```

이렇게 바뀐다 (로딩은 상위에서 Suspense로 전달).
```typescript jsx
return (
  <div>{data}</div>
);
```

또한 컴포넌트끼리 로딩 상태를 서로 알아야 하는 복잡한 UI(여러 컴포넌트가 동시에 또는 직렬로 API를 호출해야 하는 상황)에서 Suspense를 쓰면 더 쉽게 해결된다.

---

## Suspense는 Code Splitting 기능인가?

### Official Answer
As in previous versions of React, you can also use Suspense for code splitting on the client with React.lazy.
But our vision for Suspense has always been about much more than loading code — the goal is to extend support for Suspense so that eventually, the same declarative Suspense fallback can handle **any asynchronous operation (loading code, data, images, etc).**

> #### User Annotation:
> Suspense 자체는 Code Splitting을 해주는 기능이 아니다.
> React.lazy()와 함께 쓰면 dynamic component 로딩 동안 fallback을 보여줄 수 있어 code splitting과 같이 활용할 수 있을 뿐이다.

### Reference
- https://react.dev/reference/react/Suspense
