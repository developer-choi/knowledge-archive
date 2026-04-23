---
tags: [react, nextjs, principle]
---

# Questions
- Client Component는 언제 사용하는가?
- `"use client"` 지시어는 무엇이고 어디에 붙이는가?
- Client Component는 Full Page Load에서 어떻게 렌더링되는가?
- Client Component는 Subsequent Navigation에서 어떻게 렌더링되는가?
- Client Component에서 Server Component를 import할 수 없는 이유는?
- Server Component에서 Client Component로 props를 전달할 때 serializable이어야 하는 이유는?
- `"use client"`가 붙어있지 않은 컴포넌트는 항상 Server Component인가?
- 3rd-party 라이브러리(`"use client"`가 없는 것)를 Server Component 안에서 그대로 쓸 수 있는가?
- Context Provider를 App 루트에서 바로 쓰면 왜 에러가 나는가?
- 3rd-party Provider를 Server Component 아래에서 쓰려면 어떻게 감싸야 하는가?
- Provider는 가능한 한 트리 깊숙이 배치해야 하는 이유는?

---

# Answers

## Client Component는 언제 사용하는가?

### Official Answer
1. **Interactivity**: Client Components can use state, effects, and event listeners, meaning they can provide immediate feedback to the user and update the UI.
2. **Browser APIs**: Client Components have access to browser APIs, like geolocation or localStorage.

> #### User Annotation:
> 1. 사용자와 상호작용이 필요할 때 (예: 버튼 클릭 이벤트 핸들러 등록)
> 2. 브라우저의 API를 사용해야 할 때
>
> 저것 말고는 전부 SC가 맞다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/client-components#benefits-of-client-rendering

---

## `"use client"` 지시어는 무엇이고 어디에 붙이는가?

### Official Answer
`"use client"` is used to declare a boundary between a Server and Client Component modules.
It's placed at the top of a file, above imports, to define the cut-off point where it crosses the boundary from the server-only to the client part.

This means that by defining a `"use client"` in a file, all other modules imported into it, including child components, are considered part of the client bundle.

> #### Official Annotation:
> `"use client"` does not need to be defined in every file.
> The Client module boundary only needs to be defined once, at the "entry point", for all modules imported into it to be considered a Client Component.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/client-components

---

## Client Component는 Full Page Load에서 어떻게 렌더링되는가?

### Official Answer
To optimize the initial page load, Next.js will use React's APIs to render a static HTML preview on the server for both Client and Server Components.
This means, when the user first visits your application, they will see the content of the page immediately, without having to wait for the client to download, parse, and execute the Client Component JavaScript bundle.

On the server:

1. React renders Server Components into a special data format called the React Server Component Payload (RSC Payload), which includes references to Client Components.
2. Next.js uses the RSC Payload and Client Component JavaScript instructions to render HTML for the route on the server.

Then, on the client:

1. The HTML is used to immediately show a fast non-interactive initial preview of the route.
2. The React Server Components Payload is used to reconcile the Client and Server Component trees, and update the DOM.
3. The JavaScript instructions are used to hydrate Client Components and make their UI interactive.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/client-components#full-page-load

---

## Client Component는 Subsequent Navigation에서 어떻게 렌더링되는가?

### Official Answer
On subsequent navigations, Client Components are rendered entirely on the client, without the server-rendered HTML.

This means the Client Component JavaScript bundle is downloaded and parsed.
Once the bundle is ready, React will use the RSC Payload to reconcile the Client and Server Component trees, and update the DOM.

> #### User Annotation:
> 증명: https://github.com/developer-choi/test-playground/commit/12b964918dfd3c652504a8df1a50f7548d0e9658
>
> 첫 페이지 접근 시에는 CC가 Server에서도 실행됨 (초기 HTML을 만들어야 하니까).
> 이후 링크를 통해 페이지 이동 시에는 Server를 거치지 않고 Client에서만 렌더링된다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/client-components#subsequent-navigations

---

## Client Component에서 Server Component를 import할 수 없는 이유는?

### Official Answer
Since Client Components are rendered after Server Components, you cannot import a Server Component into a Client Component module (since it would require a new request back to the server).
Instead, you can pass a Server Component as props to a Client Component.

`<ClientComponent>` doesn't know that children will eventually be filled in by the result of a Server Component.
The only responsibility `<ClientComponent>` has is to decide where children will eventually be placed.

With this approach, `<ClientComponent>` and `<ServerComponent>` are decoupled and can be rendered independently.
In this case, the child `<ServerComponent>` can be rendered on the server, well before `<ClientComponent>` is rendered on the client.

> #### Official Annotation:
> This allows the passed prop to be rendered independently, in this case, on the server, well before the Client Component is rendered on the client.
>
> The very same strategy of "lifting content up" has been used to avoid state changes in a parent component re-rendering an imported nested child component.

> #### User Annotation:
> 즉, CC의 props로 전달될 SC는 독립적으로 미리 렌더링시켜놓고, 그것을 CC에 전달한다.

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns

---

## Server Component에서 Client Component로 props를 전달할 때 serializable이어야 하는 이유는?

### Official Answer
If you fetch data in a Server Component, you may want to pass data down as props to Client Components.
Props passed from the Server to Client Components need to be serializable by React.

This means that values such as functions, Dates, etc, cannot be passed directly to Client Components.

> #### User Annotation:
> 특히 함수, 클래스의 인스턴스도 안 된다.
>
> 증명: https://github.com/developer-choi/new-nextjs/commit/1580671e445dba3aee1302fde5e8aefa2b8626a4
>
> 1. CC에서 CC로 넘기고 SC에서 SC로 넘기는 것은 가능
> 2. CC에서 SC로 넘기는 것은 애초에 CC에서 SC를 import할 수 없다는 문법에 걸려서 불가능
> 3. SC에서 CC로 넘기는 것은 정말로 위 영문 규칙에 맞게 안 된다는 메시지가 뜬다

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization
- https://developer.mozilla.org/en-US/docs/Glossary/Serialization
- https://en.wikipedia.org/wiki/Serialization
- https://developer.mozilla.org/en-US/docs/Glossary/Serializable_object

---

## `"use client"`가 붙어있지 않은 컴포넌트는 항상 Server Component인가?

### User Answer
1. 공식문서가 한 말은 틀린 말이 없다. 우선순위가 있을 뿐이다.
2. 강제로 Server Component로 만드는 방법은 없다. 기본값이 Server Component인 것이지, 강제로 Server Component로 만드는 방법은 없다.
3. 하지만 강제로 Client Component로 만드는 방법은 있다 — `"use client"`.

> #### User Annotation:
> 사건의 발단:
> - `"use client"`가 붙은 컴포넌트 안에서 `"use client"` 없는 컴포넌트를 import할 수 있고, 그 컴포넌트 안에서 `useEffect`도 동작한다.
>   - 증명: https://github.com/developer-choi/test-playground/commit/81d42f369bdc79f20b36fc1491e6b50344d8120f
> - `"use client"` 없는 컴포넌트라도, CC 아래에서 import되면 Client Component로 동작한다.
> - 그 컴포넌트에 `async`를 붙이면 `"async/await is not yet supported in Client Components"` 에러가 뜬다.
>   - 증명: https://github.com/developer-choi/test-playground/commit/8aed1cc684490a938a2224b691e6803e92192df5
>
> 기대했던 에러는 "Server Component를 Client Component에서 import할 수 없다"는 방향의 메시지였다.
> 프레임워크가 내가 만든 컴포넌트를 정말로 Server Component로 바라본다는 것을 증명하고 싶었기 때문이다.
> 하지만 실제로 뜬 메시지는 `async/await is not yet supported in Client Components`였다 — 즉 프레임워크는 그 컴포넌트를 Client Component로 판단했다.
>
> 결국:
> - Next.js는 `"use client"`를 안 쓰면 기본적으로 Server Component로 판단하지만, 반드시 Server Component로 판단하게 하는 조건(예: `async`를 붙이면 SC로 강제) 같은 것은 안내하지 않는다.
> - 개발자가 "Server Component"를 만들 목적으로 제작한 컴포넌트(`async` 붙인 컴포넌트)를 Client Component에서 사용하려고 하면 에러가 나는 것이 맞다.
>
> 관련 논의: https://github.com/vercel/next.js/discussions/76150

### Reference
- https://nextjs.org/docs/app/building-your-application/rendering/client-components

---

## 3rd-party 라이브러리(`"use client"`가 없는 것)를 Server Component 안에서 그대로 쓸 수 있는가?

### Official Answer
Today, many components from npm packages that use client-only features do not yet have the directive.
These third-party components will work as expected within your own Client Components since they have the `"use client"` directive, but they won't work within Server Components.

> #### Official Annotation (For Library Authors):
> In a similar fashion, library authors creating packages to be consumed by other developers can use the `"use client"` directive to mark client entry points of their package.
> This allows users of the package to import package components directly into their Server Components without having to create a wrapping boundary.
>
> You can optimize your package by using `'use client'` deeper in the tree, allowing the imported modules to be part of the Server Component.
>
> It's worth noting some bundlers might strip out `"use client"` directives.
> You can find an example of how to configure esbuild to include the `"use client"` directive in the React Wrap Balancer and Vercel Analytics repositories.

### Reference
- https://nextjs.org/docs/getting-started/react-essentials

---

## Context Provider를 App 루트에서 바로 쓰면 왜 에러가 나는가?

### Official Answer
In Next.js 13, context (and libraries that use it like redux, react-query) is fully supported within Client Components, but it cannot be created or consumed directly within Server Components.

This is because Server Components have no React state (since they're not interactive), and context is primarily used for rerendering interactive components deep in the tree after some React state has been updated.

However, context providers are typically rendered near the root of an application to share global concerns, like the current theme.
Because context is not supported in Server Components, trying to create a context at the root of your application will cause an error.

> #### User Annotation:
> Provider를 직접 루트에서 사용하면 SC 환경이라 동작하지 않는다.
> 따라서 Provider를 별도 컴포넌트로 감싸고 `"use client"`를 붙여 CC로 만들어야 한다.

### Reference
- https://nextjs.org/docs/getting-started/react-essentials

---

## 3rd-party Provider를 Server Component 아래에서 쓰려면 어떻게 감싸야 하는가?

### Official Answer
To fix this, create your context and render its provider inside of a Client Component.

We don't expect you to need to wrap most third-party components since it's likely you'll be using them within Client Components.
However, one exception is provider components, since they rely on React state and context, and are typically needed at the root of an application.

With the providers rendered at the root, all the components and hooks from these libraries will work as expected within your own Client Components.

> #### User Annotation:
> Provider를 직접 쓰지 않고 별도 파일로 빼서 `"use client"`를 붙여 CC로 만들면, 기존 CC의 규칙 그대로 사용 가능하다 (SC 밑에서도 사용 가능, CC 밑에서도 사용 가능).
>
> 다른 곳에서 만든 Provider도 SC 환경에서는 그대로 쓸 수 없으니, 한번 감싸서 `"use client"`를 붙이고 원래 CC 규칙에 맞게 다른 곳에서 쓰는 식이다.
>
> SC에서는 context에 접근하지 못한다는 의미다. redux도 마찬가지로 SC에서는 접근하지 못할 것이다.

### Reference
- https://nextjs.org/docs/getting-started/react-essentials

---

## Provider는 가능한 한 트리 깊숙이 배치해야 하는 이유는?

### Official Answer
Note: You should render providers as deep as possible in the tree – notice how `ThemeProvider` only wraps `{children}` instead of the entire `<html>` document.
This makes it easier for Next.js to optimize the static parts of your Server Components.

### Reference
- https://nextjs.org/docs/getting-started/react-essentials
