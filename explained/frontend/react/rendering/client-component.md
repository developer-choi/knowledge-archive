# Client Component는 언제 사용하는가?

## 도입

Next.js App Router에서 모든 컴포넌트는 기본적으로 Server Component다. Client Component는 특정 기능이 필요할 때만 선택적으로 사용한다. 언제 Client Component가 필요한지를 명확히 알아야 불필요하게 클라이언트 번들을 키우지 않는다.

---
## 본문

> 1. Interactivity: Client Components can use state, effects, and event listeners, meaning they can provide immediate feedback to the user and update the UI.

"1. 상호작용성: Client Component는 state, effect, 이벤트 리스너를 사용할 수 있어 사용자에게 즉각적인 피드백을 제공하고 UI를 업데이트할 수 있다."

- **state / effects / event listeners**: `useState`, `useEffect`, `onClick` 등 React 클라이언트 API. Server Component에서는 사용 불가하다. 서버는 HTML을 렌더링하는 시점에 실행되고 끝나므로 사용자 이벤트를 처리할 수 없다.

> 2. Browser APIs: Client Components have access to browser APIs, like geolocation or localStorage.

"2. 브라우저 API: Client Component는 geolocation, localStorage 같은 브라우저 API에 접근할 수 있다."

- **Browser APIs**: `window`, `document`, `localStorage`, `navigator.geolocation` 등. 브라우저 런타임에서만 존재하는 객체들. 서버에서 실행되는 Server Component에서는 이런 API가 없다.

두 가지 외에 `"use client"`가 필요한 경우는 없다. 상호작용도 없고 브라우저 API도 안 쓴다면 Server Component로 두는 것이 맞다.

```
Client Component를 써야 하는 경우    Server Component로 충분한 경우
──────────────────────────────────    ─────────────────────────────
useState, useReducer 사용             데이터 패칭 후 렌더링
useEffect, useLayoutEffect 사용       DB 직접 접근
onClick, onSubmit 이벤트 핸들러       정적 콘텐츠 표시
localStorage, window 접근             SEO 필요한 콘텐츠
React Context 생성/소비               레이아웃 컴포넌트
```

---
## 종합

Client Component는 "클라이언트에서만 할 수 있는 것"이 필요할 때만 사용한다. 상호작용 없이 데이터를 보여주기만 하는 컴포넌트는 Server Component로 두어 클라이언트 번들에서 제외하는 것이 기본 원칙이다. CC를 남용하면 번들 크기가 커지고 hydration 비용이 늘어난다.

---
# `"use client"` 지시어는 무엇이고 어디에 붙이는가?

## 도입

`"use client"`는 Server와 Client Component 사이의 경계를 선언하는 지시어다. 파일마다 붙여야 한다고 생각하기 쉽지만, 실제로는 경계의 "시작점"에만 붙이면 된다.

---
## 본문

> `"use client"` is used to declare a boundary between a Server and Client Component modules. It's placed at the top of a file, above imports, to define the cut-off point where it crosses the boundary from the server-only to the client part.

"`"use client"`는 Server와 Client Component 모듈 사이의 경계를 선언하는 데 사용된다. 파일 맨 위, import 위에 배치하여 서버 전용에서 클라이언트 부분으로 넘어가는 경계점을 정의한다."

- **boundary**: 단순한 파일 마커가 아닌 실제 모듈 경계다. 이 경계를 기준으로 서버 번들과 클라이언트 번들이 분리된다.
- **above imports**: 파일의 가장 첫 줄에 위치해야 한다. 다른 코드 아래에 넣으면 Next.js가 인식하지 못한다.

> This means that by defining a `"use client"` in a file, all other modules imported into it, including child components, are considered part of the client bundle.

"파일에 `"use client"`를 정의하면, 그 안에 import된 다른 모든 모듈(자식 컴포넌트 포함)이 클라이언트 번들의 일부로 간주된다."

> `"use client"` does not need to be defined in every file. The Client module boundary only needs to be defined once, at the "entry point", for all modules imported into it to be considered a Client Component.

"`"use client"`는 모든 파일에 정의될 필요가 없다. Client 모듈 경계는 "진입점"에 한 번만 정의하면 그 안에 import된 모든 모듈이 Client Component로 간주된다."

```
"use client" 전파 방식

ParentClient.tsx  ← "use client" 선언
  └── ChildA.tsx  ← "use client" 없어도 CC 취급
  └── ChildB.tsx  ← "use client" 없어도 CC 취급
        └── ChildC.tsx ← "use client" 없어도 CC 취급
```

---
## 종합

`"use client"`는 파일 단위가 아닌 모듈 트리 단위의 경계다. 최상위 CC 파일에 한 번 선언하면 그 파일에서 import하는 모든 하위 모듈이 클라이언트 번들에 포함된다. 이 전파 특성 때문에 `"use client"` 선언 위치를 신중하게 결정해야 한다 — 너무 상위에 두면 원래 SC로 두었을 컴포넌트들도 CC 취급되어 번들이 커진다.

---
# Client Component는 Full Page Load에서 어떻게 렌더링되는가?

## 도입

Next.js에서 Client Component는 이름과 달리 첫 방문 시에는 서버에서도 실행된다. "클라이언트 컴포넌트가 서버에서 실행된다"는 것이 어떤 의미인지, 그리고 그 이후 클라이언트에서 어떤 단계를 거치는지를 이해해야 한다.

---
## 본문

> To optimize the initial page load, Next.js will use React's APIs to render a static HTML preview on the server for both Client and Server Components.

"초기 페이지 로딩을 최적화하기 위해, Next.js는 Client와 Server Component 모두에 대해 서버에서 정적 HTML 미리보기를 렌더링하기 위해 React API를 사용한다."

- **static HTML preview**: interactive하지 않은 HTML. 사용자가 즉시 볼 수 있지만 클릭 등 이벤트는 아직 동작하지 않는다.

**서버에서 일어나는 일:**

> 1. React renders Server Components into a special data format called the React Server Component Payload (RSC Payload), which includes references to Client Components.

"1. React는 Server Component를 RSC Payload라는 특수 데이터 형식으로 렌더링하며, 여기에 Client Component에 대한 참조가 포함된다."

> 2. Next.js uses the RSC Payload and Client Component JavaScript instructions to render HTML for the route on the server.

"2. Next.js는 RSC Payload와 Client Component JavaScript 지시를 사용해 서버에서 해당 라우트의 HTML을 렌더링한다."

**클라이언트에서 일어나는 일:**

> 1. The HTML is used to immediately show a fast non-interactive initial preview of the route.
> 2. The React Server Components Payload is used to reconcile the Client and Server Component trees, and update the DOM.
> 3. The JavaScript instructions are used to hydrate Client Components and make their UI interactive.

"1. HTML이 라우트의 빠른 비대화형 초기 미리보기를 즉시 표시하는 데 사용된다.
2. RSC Payload가 Client와 Server Component 트리를 reconcile하고 DOM을 업데이트하는 데 사용된다.
3. JavaScript 지시가 Client Component를 hydrate하여 UI를 대화형으로 만드는 데 사용된다."

- **reconcile**: React가 현재 DOM과 새 컴포넌트 트리를 비교해 차이만 업데이트하는 과정.
- **hydrate**: 서버에서 만들어진 HTML에 JavaScript 이벤트 핸들러를 연결하여 interactive하게 만드는 과정.

```
Full Page Load 흐름

서버                          클라이언트
────────────────────          ──────────────────────────────
SC → RSC Payload              HTML: 즉시 표시 (non-interactive)
CC JS + RSC Payload → HTML    RSC Payload: reconcile
                              CC JS: hydrate → interactive
```

---
## 종합

첫 방문 시 Client Component도 서버에서 렌더링되는 이유는 초기 HTML을 빠르게 표시하기 위해서다. 서버 HTML로 즉각적인 시각적 피드백을 주고, 이후 클라이언트에서 hydration으로 interactive하게 만든다. hydration 없이는 사용자가 빈 화면을 오래 보거나 이벤트가 동작하지 않는 상태를 경험한다.

---
# Client Component는 Subsequent Navigation에서 어떻게 렌더링되는가?

## 도입

페이지를 처음 방문하면 서버에서 HTML을 생성한다. 그 이후 링크를 클릭해 다른 페이지로 이동하는 "Subsequent Navigation"에서는 렌더링 방식이 달라진다.

---
## 본문

> On subsequent navigations, Client Components are rendered entirely on the client, without the server-rendered HTML.

"이후 내비게이션에서, Client Component는 서버 렌더링 HTML 없이 완전히 클라이언트에서 렌더링된다."

> This means the Client Component JavaScript bundle is downloaded and parsed. Once the bundle is ready, React will use the RSC Payload to reconcile the Client and Server Component trees, and update the DOM.

"이는 Client Component JavaScript 번들이 다운로드되고 파싱된다는 것을 의미한다. 번들이 준비되면, React는 RSC Payload를 사용해 Client와 Server Component 트리를 reconcile하고 DOM을 업데이트한다."

- **entirely on the client**: 두 번째 방문부터는 서버 HTML 생성 없이 클라이언트 JS가 직접 UI를 만든다. 서버에서 CC가 다시 실행되지 않는다.
- **RSC Payload**: 이 경우에도 서버에서 SC는 실행된다. 그 결과물인 RSC Payload를 받아 클라이언트에서 reconcile한다.

```
Full Page Load vs Subsequent Navigation

Full Page Load
  서버: SC + CC → RSC Payload + HTML
  클라이언트: HTML 즉시 표시 → hydrate

Subsequent Navigation
  서버: SC만 실행 → RSC Payload 전송
  클라이언트: CC JS 번들로 렌더링 → RSC Payload로 reconcile
  (서버 HTML 없음)
```

---
## 종합

SPA처럼 클라이언트 측 라우팅이 이루어진다는 점이 Subsequent Navigation의 핵심이다. 첫 방문의 서버 HTML 생성 비용 없이 빠른 페이지 전환이 가능하다. Next.js의 클라이언트 라우터 캐시가 RSC Payload를 저장해두어, 같은 경로를 다시 방문할 때는 캐시에서 즉시 가져온다.

---
# Client Component에서 Server Component를 import할 수 없는 이유는?

## 도입

Server Component를 Client Component 안에서 import하면 에러가 발생한다. 이 제약은 단순한 기술 제약이 아니라 SC와 CC가 렌더링되는 시점과 환경의 차이에서 비롯된다.

---
## 본문

> Since Client Components are rendered after Server Components, you cannot import a Server Component into a Client Component module (since it would require a new request back to the server).

"Client Component는 Server Component 이후에 렌더링되므로, Client Component 모듈에 Server Component를 import할 수 없다(서버로 새 요청이 필요하기 때문이다)."

> Instead, you can pass a Server Component as props to a Client Component.

"대신, Server Component를 Client Component에 props로 전달할 수 있다."

- **rendered after**: CC는 hydration 시점에 클라이언트에서 실행된다. SC는 이미 서버에서 실행이 끝난 상태다. CC가 실행되는 시점에 서버 코드를 불러오려면 네트워크 요청이 필요한데, 이는 React 렌더링 모델에서 지원하지 않는다.

> `<ClientComponent>` doesn't know that children will eventually be filled in by the result of a Server Component. The only responsibility `<ClientComponent>` has is to decide where children will eventually be placed.

"`<ClientComponent>`는 children이 결국 Server Component의 결과로 채워진다는 것을 알지 못한다. `<ClientComponent>`의 유일한 책임은 children이 결국 어디에 배치될지를 결정하는 것이다."

props로 전달하는 패턴:

```tsx
// 올바른 패턴 — SC를 props로 전달
// ParentServer.tsx (SC)
import ClientContainer from './ClientContainer';
import ServerContent from './ServerContent';

export default function Page() {
  return (
    <ClientContainer>
      <ServerContent /> {/* SC가 미리 렌더링되어 children으로 전달 */}
    </ClientContainer>
  );
}

// ClientContainer.tsx (CC)
'use client';
export default function ClientContainer({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}
```

- **lifted up**: "content lifting" 패턴. CC가 SC를 직접 알지 못하고, SC의 렌더링 결과만 children으로 받는다. CC와 SC가 독립적으로 렌더링된다.

---
## 종합

SC를 CC 안에 import할 수 없는 본질적 이유는 실행 환경의 분리다. SC는 서버에서만 실행되고, CC는 클라이언트에서 실행된다. 두 환경을 넘나드는 import는 불가능하다. children이나 props를 통해 SC의 렌더링 결과(이미 HTML/RSC Payload로 변환된 것)를 CC에 전달하는 것은 가능하다.

---
# Server Component에서 Client Component로 props를 전달할 때 serializable이어야 하는 이유는?

## 도입

SC에서 CC로 데이터를 props로 전달할 때 "serializable해야 한다"는 제약이 있다. 왜 함수나 Date 객체는 props로 넘길 수 없는가?

---
## 본문

> If you fetch data in a Server Component, you may want to pass data down as props to Client Components. Props passed from the Server to Client Components need to be serializable by React.

"Server Component에서 데이터를 패칭하면 그것을 Client Component에 props로 전달하고 싶을 수 있다. 서버에서 Client Component로 전달되는 props는 React가 직렬화할 수 있어야 한다."

> This means that values such as functions, Dates, etc, cannot be passed directly to Client Components.

"이는 함수, Date 등의 값은 Client Component에 직접 전달될 수 없다는 것을 의미한다."

- **serializable**: 직렬화 가능한. 값을 네트워크를 통해 전송 가능한 문자열/바이트 형태로 변환할 수 있는 성질. JSON으로 표현 가능한 것들(string, number, boolean, null, array, plain object)이 해당한다.

왜 직렬화가 필요한가?

```
서버                               클라이언트
────────────────────────           ──────────────────────────
SC 실행 → props 생성
         ↓ (네트워크 전송)
         RSC Payload에 포함        CC가 props를 받아 사용
```

SC의 props는 RSC Payload를 통해 네트워크를 건너야 한다. 함수는 직렬화할 수 없다 — 함수 코드를 네트워크로 전송하려면 클라이언트 번들에 포함시켜야 하는데, 그것은 CC의 역할이다.

직렬화 가능/불가능 예시:

```
가능                     불가능
──────────────────────   ────────────────────────────
string, number, boolean  function (이벤트 핸들러 등)
null, undefined          Date 객체
array, plain object      Map, Set
                         class instance
```

---
## 종합

SC → CC props 직렬화 제약은 RSC 아키텍처의 근본 제약이다. SC는 서버에서 실행되고 CC는 클라이언트에서 실행되어, 두 환경 사이에 네트워크가 있다. 네트워크를 건너는 데이터는 직렬화될 수 있어야 한다. 함수를 props로 넘기고 싶다면 그 컴포넌트 자체를 CC로 만들어야 한다.

---
# [UNVERIFIED] `"use client"`가 붙어있지 않은 컴포넌트는 항상 Server Component인가?

## 도입

Next.js의 기본값은 Server Component다. 그렇다면 `"use client"`가 없는 컴포넌트는 항상 Server Component로 처리되는가? 실제로는 import 위치에 따라 달라진다.

---
## 본문

핵심 규칙 세 가지:

1. `"use client"`가 없으면 기본값은 Server Component다. 하지만 이것은 "기본값"이지 "강제"가 아니다.
2. Server Component를 강제로 만드는 방법은 없다.
3. `"use client"`를 붙이면 강제로 Client Component가 된다.

이 규칙의 실제 동작:

```
CC 파일에 import된 경우:

// ParentCC.tsx
'use client';
import NoDirective from './NoDirective'; // "use client" 없음

// NoDirective.tsx가 CC 아래에서 import되면 CC 취급
// 이 컴포넌트 안에서 useEffect가 동작함
// async 함수를 붙이면 "async/await is not yet supported in Client Components" 에러
```

`"use client"` 없는 컴포넌트가 CC 아래에 import되면 CC로 취급된다. 이것이 "강제로 SC로 만드는 방법이 없다"는 의미다 — `async`를 붙여도 Next.js가 SC로 강제 분류하지 않고 CC 에러를 낸다.

---
## 종합

"기본값 SC"는 "CC 아래에서 import되지 않을 때의 기본값"이다. `"use client"` 없는 컴포넌트가 CC의 import 트리 안에 들어가면 CC 취급된다. SC로 유지하려면 CC의 import 트리 밖에 두거나, CC의 children/props로만 전달해야 한다. `async`를 붙이는 것은 SC를 강제하는 게 아니라 CC로 취급될 때 에러를 내는 추가 진단 수단이 된다.

---
# 3rd-party 라이브러리(`"use client"`가 없는 것)를 Server Component 안에서 그대로 쓸 수 있는가?

## 도입

npm 패키지 중 많은 컴포넌트 라이브러리가 아직 `"use client"` 지시어를 추가하지 않았다. 이런 라이브러리를 SC 안에서 그대로 import하면 어떻게 되는가?

---
## 본문

> Today, many components from npm packages that use client-only features do not yet have the directive. These third-party components will work as expected within your own Client Components since they have the `"use client"` directive, but they won't work within Server Components.

"현재 client-only 기능을 사용하는 많은 npm 패키지 컴포넌트가 아직 지시어를 갖고 있지 않다. 이 third-party 컴포넌트들은 `"use client"` 지시어를 가진 자신의 Client Component 안에서는 예상대로 동작하지만, Server Component 안에서는 동작하지 않는다."

- **client-only features**: `useState`, `useEffect`, `window` 등 브라우저/클라이언트 런타임에서만 동작하는 기능. 이런 기능을 사용하는 라이브러리는 SC 환경에서 에러를 낸다.

> In a similar fashion, library authors creating packages to be consumed by other developers can use the `"use client"` directive to mark client entry points of their package.

"마찬가지로, 다른 개발자가 소비할 패키지를 만드는 라이브러리 작성자들은 `"use client"` 지시어를 사용해 패키지의 클라이언트 진입점을 표시할 수 있다."

해결 방법: wrapper 컴포넌트로 감싸기

```tsx
// components/ThirdPartyWrapper.tsx
'use client'; // 직접 "use client" 추가
import { ThirdPartyComponent } from 'third-party-lib';

export default ThirdPartyComponent;
```

이제 `ThirdPartyWrapper`는 CC이므로 SC 아래에서도 사용 가능하다.

---
## 종합

`"use client"` 없는 third-party 컴포넌트를 SC에서 직접 사용하면 client-only API 사용으로 빌드 에러가 발생한다. 해결책은 간단하다 — wrapper 컴포넌트를 만들고 `"use client"`를 붙이면 된다. 라이브러리 작성자가 `"use client"`를 적절히 선언했다면 이 작업이 불필요하다.

---
# Context Provider를 App 루트에서 바로 쓰면 왜 에러가 나는가?

## 도입

Next.js App Router에서 `layout.tsx`는 Server Component다. 전통적으로 Context Provider를 앱 루트에 두는 패턴을 그대로 적용하면 에러가 발생한다. SC에서 Context를 사용할 수 없는 이유가 있다.

---
## 본문

> In Next.js 13, context (and libraries that use it like redux, react-query) is fully supported within Client Components, but it cannot be created or consumed directly within Server Components.

"Next.js 13에서 context(그리고 redux, react-query 같이 context를 사용하는 라이브러리)는 Client Component 내에서 완전히 지원되지만, Server Component 내에서 직접 생성하거나 소비할 수 없다."

> This is because Server Components have no React state (since they're not interactive), and context is primarily used for rerendering interactive components deep in the tree after some React state has been updated.

"이는 Server Component가 React state를 갖지 않기(interactive하지 않으므로) 때문이며, context는 주로 React state가 업데이트된 후 트리 깊숙이 있는 interactive 컴포넌트를 리렌더링하기 위해 사용되기 때문이다."

- **no React state**: SC는 한 번 렌더링되고 끝난다. 상태 변화로 리렌더링하는 개념이 없다. Context는 상태 변화를 구독하는 메커니즘이므로 SC에서는 의미가 없다.
- **context**: `createContext()`로 만들고 `useContext()`로 소비하는 React 전역 상태 공유 메커니즘.

> Because context is not supported in Server Components, trying to create a context at the root of your application will cause an error.

"context가 Server Component에서 지원되지 않으므로, 앱 루트에서 context를 생성하려 하면 에러가 발생한다."

---
## 종합

에러의 근본 원인은 `layout.tsx`가 SC인데 Context Provider를 직접 사용하기 때문이다. 해결책은 Provider를 별도 CC 파일로 분리하고 `"use client"`를 붙이는 것이다. 분리된 Provider CC를 SC 레이아웃의 children으로 배치하면 context가 정상 동작한다.

---
# 3rd-party Provider를 Server Component 아래에서 쓰려면 어떻게 감싸야 하는가?

## 도입

외부 라이브러리의 Provider(예: `ThemeProvider`, `QueryClientProvider`)를 Next.js App Router에서 사용하려면 추가 작업이 필요하다. Provider 자체가 `"use client"`를 가지고 있지 않다면, 또는 앱 루트에서 사용하려면 어떻게 해야 하는가?

---
## 본문

> To fix this, create your context and render its provider inside of a Client Component.

"이를 해결하려면, Client Component 안에서 context를 생성하고 provider를 렌더링한다."

```tsx
// providers.tsx
'use client';
import { ThemeProvider } from 'some-theme-lib';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

```tsx
// layout.tsx (SC)
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

> We don't expect you to need to wrap most third-party components since it's likely you'll be using them within Client Components. However, one exception is provider components, since they rely on React state and context, and are typically needed at the root of an application.

"대부분의 third-party 컴포넌트는 CC 안에서 사용할 것이므로 감싸야 할 필요가 없다. 그러나 provider 컴포넌트는 예외인데, React state와 context에 의존하고 보통 앱 루트에서 필요하기 때문이다."

---
## 종합

Provider를 별도 CC 파일로 분리하는 것이 표준 패턴이다. 이렇게 하면 `layout.tsx`는 SC로 유지되면서 Provider의 context가 하위 CC 전체에서 접근 가능해진다. SC는 context를 소비할 수 없지만 context 안에 SC를 children으로 배치하는 것은 가능하다.

---
# Provider는 가능한 한 트리 깊숙이 배치해야 하는 이유는?

## 도입

Provider를 앱 최상단에 두면 모든 곳에서 context에 접근할 수 있다는 장점이 있다. 하지만 Next.js는 Provider를 가능한 한 깊은 곳에 두길 권장한다. 왜인가?

---
## 본문

> Note: You should render providers as deep as possible in the tree – notice how `ThemeProvider` only wraps `{children}` instead of the entire `<html>` document. This makes it easier for Next.js to optimize the static parts of your Server Components.

"Provider는 트리에서 가능한 한 깊이 렌더링해야 한다 — `ThemeProvider`가 전체 `<html>` 문서 대신 `{children}`만 감싸는 방식에 주목하라. 이것은 Next.js가 Server Component의 정적 부분을 최적화하기 쉽게 만든다."

- **as deep as possible**: Provider의 범위를 최소화한다. Provider가 감싸는 범위가 좁을수록 그 바깥의 SC들이 Provider 영향을 받지 않아 서버에서 더 적극적으로 캐싱하고 최적화할 수 있다.
- **optimize the static parts**: Provider로 감싸인 영역은 dynamic한 CC 영역으로 처리될 가능성이 높다. SC의 정적 렌더링 최적화(Full Route Cache 등)가 더 넓은 범위에 적용되려면 Provider 범위를 좁혀야 한다.

```
비권장 — Provider가 전체를 감쌈
<html>
  <Providers>          ← 너무 넓음
    <body>
      <Header />       ← 정적 SC인데 Provider 안에 있음
      {children}
    </body>
  </Providers>
</html>

권장 — Provider가 필요한 부분만 감쌈
<html>
  <body>
    <Header />         ← SC, Provider 바깥, 정적 최적화 적용
    <Providers>        ← 필요한 children만
      {children}
    </Providers>
  </body>
</html>
```

---
## 종합

Provider 배치의 원칙은 "필요한 최소 범위"다. `<html>` 전체를 감싸면 정적 헤더, 네비게이션 같은 SC들도 Provider의 CC 트리 안에 들어가 Next.js의 정적 최적화 기회를 잃는다. Provider를 실제로 context가 필요한 `{children}` 수준까지 내려서 SC와 CC의 경계를 명확히 유지하는 것이 성능 최적화의 핵심이다.
