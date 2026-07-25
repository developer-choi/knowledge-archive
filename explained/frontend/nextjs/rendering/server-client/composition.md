# `"use client"`가 없는 3rd-party 컴포넌트를 Server Component 안에서 그대로 쓸 수 있는가?

## 도입

npm 패키지 중 많은 컴포넌트 라이브러리가 아직 `"use client"` 지시어를 추가하지 않았다. 이런 라이브러리를 SC 안에서 그대로 import하면 어떻게 되는가?

---
## 본문

> When using a third-party component that relies on client-only features, you can wrap it in a Client Component to ensure it works as expected.

"브라우저에서만 되는 기능에 기대는 외부 컴포넌트를 쓸 때는, 그것을 Client Component로 한 겹 감싸면 의도대로 동작하게 만들 수 있다."

- **relies on client-only features**: 상태·이벤트·`window`처럼 브라우저에서만 존재하는 것에 기대고 있다는 뜻이다.
- **wrap it in a Client Component**: 그 컴포넌트를 다시 내보내는 파일을 하나 만들고 그 파일에 `"use client"`를 붙인다는 뜻이다. 라이브러리 코드를 고치는 것이 아니다.

> However, if you try to use it directly within a Server Component, you'll see an error. This is because Next.js doesn't know `<Carousel />` is using client-only features.

"반면 그것을 Server Component 안에서 곧바로 쓰면 에러를 보게 된다. Next.js는 `<Carousel />`이 브라우저 전용 기능을 쓰고 있다는 사실을 모르기 때문이다."

- **doesn't know**: 판단 근거가 `"use client"` 표시뿐이라는 뜻이다. 표시가 없으면 Next.js는 그 컴포넌트를 서버에서 실행해도 되는 것으로 보고, 실행하다가 브라우저 전용 기능에 걸려 실패한다.

> If you’re building a component library, add the `"use client"` directive to entry points that rely on client-only features. This lets your users import components into Server Components without needing to create wrappers.

"컴포넌트 라이브러리를 만드는 쪽이라면, 브라우저 전용 기능에 기대는 진입점에 `"use client"` 지시어를 붙여라. 그러면 그 라이브러리를 쓰는 사람들이 감싸는 파일을 따로 만들지 않고도 Server Component에 바로 import할 수 있다."

- **entry points**: 라이브러리를 쓰는 쪽이 실제로 import하게 되는 파일. 내부 파일 전부가 아니라 바깥으로 열려 있는 입구에만 붙이면 된다.
- **without needing to create wrappers**: 감싸는 일이 원래 사용하는 쪽의 부담이라는 점을 뒤집어 말한 것이다. 만드는 쪽이 한 줄을 붙이면 쓰는 쪽 전원이 그 수고를 덜게 된다.

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

# Context Provider를 Server Component 아래에서 쓰려면 어떻게 감싸야 하는가?

## 도입

외부 라이브러리의 Provider(예: `ThemeProvider`, `QueryClientProvider`)를 Next.js App Router에서 사용하려면 추가 작업이 필요하다. Provider 자체가 `"use client"`를 가지고 있지 않다면, 또는 앱 루트에서 사용하려면 어떻게 해야 하는가?

---
## 본문

> To use context, create a Client Component that accepts `children`.

"context를 쓰려면, `children`을 받는 Client Component를 하나 만든다."

- **accepts `children`**: 감싸는 역할만 하고 안쪽에 무엇이 오는지는 모르는 형태로 만든다는 뜻이다. 그래야 이 파일이 Client Component가 되더라도 안에 들어오는 Server Component는 그대로 서버에 남는다.

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

> Your Server Component will now be able to directly render your provider, and all other Client Components throughout your app will be able to consume this context.

"이제 Server Component가 그 provider를 곧바로 그릴 수 있게 되고, 앱 곳곳의 다른 Client Component들이 이 context를 꺼내 쓸 수 있게 된다."

- **directly render your provider**: `layout.tsx`를 Client Component로 바꾸지 않아도 된다는 뜻이다. 감싸는 파일 하나만 Client Component가 되고 레이아웃은 서버에 남는다.

---
## 종합

Provider를 별도 CC 파일로 분리하는 것이 표준 패턴이다. 이렇게 하면 `layout.tsx`는 SC로 유지되면서 Provider의 context가 하위 CC 전체에서 접근 가능해진다. SC는 context를 소비할 수 없지만 context 안에 SC를 children으로 배치하는 것은 가능하다.

---

# Provider는 트리의 어느 위치에 두어야 하는가?

## 도입

Provider를 앱 최상단에 두면 모든 곳에서 context에 접근할 수 있다는 장점이 있다. 하지만 Next.js는 Provider를 가능한 한 깊은 곳에 두길 권장한다. 왜인가?

---
## 본문

> You should render providers as deep as possible in the tree – notice how `ThemeProvider` only wraps `{children}` instead of the entire `<html>` document. This makes it easier for Next.js to optimize the static parts of your Server Components.

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
