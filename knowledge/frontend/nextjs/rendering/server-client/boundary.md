---
tags: [react, nextjs, principle]
source: official
publishable: false
priority: 1
---

# Questions
- Server Component를 쓰면 무엇이 좋은가?
  - 초기 페이지 로딩 속도가 어떻게 더 빨라지는가?
  - 네트워크 비용은 어떻게 절감되는가?
- Client Component는 언제 사용하는가?
- `"use client"` 지시어는 무엇이고 어디에 붙이는가?
  - `"use client"`를 붙인 파일에서 그 선언은 어디까지 번지는가?
  - `children`이나 props로 넘긴 Server Component도 client bundle에 포함되는가?
  - 클라이언트 번들을 줄이려면 `"use client"`를 어디에 붙여야 하는가?
- Server Component에서 Client Component로 데이터를 어떻게 넘기는가?
  - 넘기는 값에는 어떤 제약이 있는가?
- Client Component 안에 서버가 그린 UI를 넣으려면 어떻게 하는가?
  - Client Component에서 Server Component를 import할 수 없는 이유는?
  - props로 넘긴 Server Component는 언제 그려지는가?

---

# Answers

## Server Component를 쓰면 무엇이 좋은가?

### Official Answer
Use **Server Components** when you need:

- Fetch data from databases or APIs close to the source.
- Use API keys, tokens, and other secrets without exposing them to the client.
- Reduce the amount of JavaScript sent to the browser.
- Improve the First Contentful Paint (FCP), and stream content progressively to the client.

### User Answer
SC가 제공하는 장점은 다음과 같다:

- JS 번들 크기 감소 = Hydration 비용도 함께 감소
- 초기 페이지 로딩 속도 개선
- 네트워크 비용 절감 (single round-trip data fetching)
- Caching
- 백엔드 데이터 직접 접근
- 보안 (민감 정보를 서버에 보존)

CC 위주로 쓰게 되면 위 장점을 모두 누릴 수 없게 된다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## 초기 페이지 로딩 속도가 어떻게 더 빨라지는가?

### Official Answer
On the server, we can generate HTML to allow users to view the page immediately, without waiting for the client to download, parse and execute the JavaScript needed to render the page.

Data for the entire page must be fetched from the server before any components can be shown.
The only way around this is to fetch data client-side in a `useEffect()` hook, which has a longer roundtrip than server-side fetches and happens only after the component is rendered and hydrated.

### User Answer
Client에서 데이터 패칭하는 JS 코드를 다운받아서 API를 호출하는 것보다, 그것을 Server Component로 옮기면 더 빠른 시점에 API가 호출될 수 있다.

### Reference
- https://vercel.com/blog/understanding-react-server-components#what-did-server-side-rendering-and-react-suspense-solve

---

## 네트워크 비용은 어떻게 절감되는가?

### Official Answer
1. Perform multiple data fetches with single round-trip instead of multiple individual requests on the client.
2. Depending on your region, data fetching can also happen closer to your data source, reducing latency and improving performance.

### User Answer
기존: Client에서 따로 따로 호출

- Client → API Server (요청 1)

- Client → API Server (요청 2)

- Client → API Server (요청 3)

SC 도입 후: 한번만 호출

- Client → Front Server → API Server (한 번의 round-trip)

그리고 서버에서 다른 서버로 요청할 때에는 물리적인 거리도 더 가깝다 (프론트 서버에서 API 서버가 더 가깝다).

### Reference
- https://nextjs.org/docs/14/app/building-your-application/rendering/server-components

---

## Client Component는 언제 사용하는가?

### Official Answer
Use **Client Components** when you need:

- State and event handlers. E.g. `onClick`, `onChange`.
- Lifecycle logic. E.g. `useEffect`.
- Browser-only APIs. E.g. `localStorage`, `window`, `Navigator.geolocation`, etc.
- Custom hooks.

### User Answer
1. 사용자와 상호작용이 필요할 때 (예: 버튼 클릭 이벤트 핸들러 등록)

2. 브라우저의 API를 사용해야 할 때

저것 말고는 전부 SC가 맞다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## `"use client"` 지시어는 무엇이고 어디에 붙이는가?

### Official Answer
You can create a Client Component by adding the `"use client"` directive at the top of the file, above your imports.

`"use client"` is used to declare a **boundary** between the Server and Client module graphs (trees).

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## `"use client"`를 붙인 파일에서 그 선언은 어디까지 번지는가?

### Official Answer
Once a file is marked with `"use client"`, **all of its imports and the components it directly renders are included in the client bundle**. This means you don’t need to add the directive to every component that is intended for the client.

This behavior applies to components that are part of the Client Component’s module graph, which includes the modules it imports and the components it renders directly.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## `children`이나 props로 넘긴 Server Component도 client bundle에 포함되는가?

### Official Answer
It does not apply to Server Components passed as children or other props. Those components are not imported into the Client Component’s module graph. They are rendered on the server and passed to the Client Component as rendered output.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## 클라이언트 번들을 줄이려면 `"use client"`를 어디에 붙여야 하는가?

### Official Answer
To reduce the size of your client JavaScript bundles, add `'use client'` to specific interactive components instead of marking large parts of your UI as Client Components.

`<Search />` is interactive and needs to be a Client Component, however, the rest of the layout can remain a Server Component.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## Server Component에서 Client Component로 데이터를 어떻게 넘기는가?

### Official Answer
You can pass data from Server Components to Client Components using props.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components


---

## 넘기는 값에는 어떤 제약이 있는가?

### Official Answer
Props passed to Client Components need to be serializable by React.

### User Answer
특히 함수, 클래스의 인스턴스도 안 된다.

증명: https://github.com/developer-choi/new-nextjs/commit/1580671e445dba3aee1302fde5e8aefa2b8626a4

1. CC에서 CC로 넘기고 SC에서 SC로 넘기는 것은 가능

2. CC에서 SC로 넘기는 것은 애초에 CC에서 SC를 import할 수 없다는 문법에 걸려서 불가능

3. SC에서 CC로 넘기는 것은 정말로 위 영문 규칙에 맞게 안 된다는 메시지가 뜬다

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://developer.mozilla.org/en-US/docs/Glossary/Serialization
- https://developer.mozilla.org/en-US/docs/Glossary/Serializable_object

---

## Client Component 안에 서버가 그린 UI를 넣으려면 어떻게 하는가?

### Official Answer
You can pass Server Components as a prop to a Client Component. This allows you to visually nest server-rendered UI within Client components.

A common pattern is to use `children` to create a *slot* in a `<ClientComponent>`. For example, a `<Cart>` component that fetches data on the server, inside a `<Modal>` component that uses client state to toggle visibility.

```tsx
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```tsx
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## Client Component에서 Server Component를 import할 수 없는 이유는?

### Official Answer
Since Client Components are rendered after Server Components, you cannot import a Server Component into a Client Component module (since it would require a new request back to the server).
Instead, you can pass a Server Component as props to a Client Component.

`<ClientComponent>` doesn't know that children will eventually be filled in by the result of a Server Component.
The only responsibility `<ClientComponent>` has is to decide where children will eventually be placed.

With this approach, `<ClientComponent>` and `<ServerComponent>` are decoupled and can be rendered independently.
In this case, the child `<ServerComponent>` can be rendered on the server, well before `<ClientComponent>` is rendered on the client.

This allows the passed prop to be rendered independently, in this case, on the server, well before the Client Component is rendered on the client.

The very same strategy of "lifting content up" has been used to avoid state changes in a parent component re-rendering an imported nested child component.

### User Answer
즉, CC의 props로 전달될 SC는 독립적으로 미리 렌더링시켜놓고, 그것을 CC에 전달한다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/rendering/composition-patterns

---

## props로 넘긴 Server Component는 언제 그려지는가?

### Official Answer
In this pattern, Server Components are rendered on the server ahead of time, even when passed as props to Client Components. The React Server Component Payload contains the rendered result of those Server Components, plus placeholders for where Client Components should be rendered and references to their JavaScript files.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components
