# Request Memoization이란 무엇이며 Next.js가 어떻게 fetch를 extend하는가?

## 도입

Request Memoization은 하나의 렌더링 패스 안에서 동일한 `fetch()` 호출이 여러 컴포넌트에서 발생할 때, 실제 네트워크 요청은 한 번만 수행하고 결과를 메모리에 저장해 재사용하는 메커니즘이다. Next.js가 네이티브 `fetch`를 확장하여 자동으로 제공한다.

---

## 본문

> Next.js extends the `fetch API` to automatically memoize requests that have the same URL and options. This means you can call a fetch function for the same data in multiple places in a React component tree while **only executing it once.**

"Next.js는 `fetch API`를 확장하여 동일한 URL과 옵션을 가진 요청을 자동으로 memoize한다. 이는 React 컴포넌트 트리의 여러 곳에서 동일한 데이터에 대한 fetch 함수를 호출하면서 **한 번만 실행할 수 있음**을 의미한다."

- **memoize**: 함수 호출 결과를 키(URL + options)와 함께 메모리에 저장해두고, 같은 키로 재호출 시 함수를 다시 실행하지 않고 저장된 값을 반환하는 기법. JS에서 `useMemo`나 `React.memo`와 같은 원리다.
- **same URL and options**: URL이 같아도 헤더나 body가 다르면 다른 요청으로 인식된다. 정확히 동일한 요청 객체여야 memoization이 적용된다.
- **only executing it once**: 실제 `fetch` 네트워크 요청은 한 번. 두 번째 이후 호출은 메모리에서 즉시 반환한다.

```
Request Memoization 효과

렌더링 중 동일한 fetch('/api/user') 3회 호출 시

컴포넌트 A → fetch('/api/user') → 네트워크 요청 발생, 결과 메모리 저장
컴포넌트 B → fetch('/api/user') → 메모리에서 즉시 반환 (네트워크 X)
컴포넌트 C → fetch('/api/user') → 메모리에서 즉시 반환 (네트워크 X)

네트워크 요청: 1회
```

---

## 종합

Request Memoization이 없으면, 같은 사용자 정보를 표시하는 Header, Sidebar, Main 컴포넌트가 각각 독립적으로 API를 호출하게 된다. props drilling으로 데이터를 내려주거나 전역 상태 관리를 써야 하는 복잡성이 생긴다. Memoization 덕분에 "데이터를 필요한 컴포넌트에서 직접 fetch하라"는 패턴이 가능해진다 — 중복 호출 걱정 없이.

---

---

# Request Memoization의 동작 순서는?

## 도입

Request Memoization은 MISS → 네트워크 요청 → 메모리 저장 → HIT 반환의 순서로 동작한다. 그리고 렌더링이 완료되면 메모리가 초기화된다.

---

## 본문

> - While rendering a route, the first time a particular request is called, its result will not be in memory and it'll be a cache `MISS`.
> - Therefore, the function will be executed, and the data will be fetched from the external source, and the result will be stored in memory.
> - Subsequent function calls of the request in the same render pass will be a cache `HIT`, and the data will be returned from memory without executing the function.
> - Once the route has been rendered and the rendering pass is complete, memory is "reset" and all request memoization entries are cleared.

"라우트를 렌더링하는 동안, 특정 요청이 처음 호출될 때 결과가 메모리에 없어 캐시 `MISS`가 된다. 따라서 함수가 실행되어 외부 소스에서 데이터를 가져오고, 결과가 메모리에 저장된다. 같은 렌더 패스 안에서의 이후 함수 호출은 캐시 `HIT`이 되어, 함수를 실행하지 않고 메모리에서 데이터를 반환한다. 라우트 렌더링이 완료되고 렌더 패스가 끝나면 메모리가 '초기화'되고 모든 request memoization 항목이 삭제된다."

- **MISS**: 메모리에 해당 키(URL + options)가 없는 상태. 외부 소스로 요청을 보내야 한다. Data Cache와 달리 영구 저장소를 거치지 않는다.
- **HIT**: 메모리에 값이 있는 상태. 네트워크 요청 없이 즉시 반환한다.
- **render pass**: 한 라우트 요청에 대해 React가 서버에서 컴포넌트 트리를 렌더링하는 단위. 렌더 완료 시 memoization 테이블 전체가 비워진다.
- **"reset"**: 인용부호가 붙은 이유는 메모리 해제가 완전한 소멸이기 때문. 다음 요청이 와도 이전 렌더 패스의 memoization 결과를 재사용할 수 없다.

---

## 종합

Memoization의 수명이 "렌더 패스 하나"로 제한되어 있다는 것이 핵심이다. 다음 사용자 요청이 오면 메모리가 깨끗이 비워진 상태에서 시작한다. 이 덕분에 사용자 A의 데이터가 사용자 B의 렌더링에서 재사용되는 문제가 생기지 않는다. 반면 배포를 넘어 데이터를 재사용해야 한다면 Data Cache를 써야 한다.

---

---

# Request Memoization의 제약은?

## 도입

Request Memoization은 GET 메서드에만 적용되며, React 컴포넌트 트리 안에서만 동작한다. Route Handler는 컴포넌트 트리 바깥에 있어 memoization 대상이 아니다.

---

## 본문

> Memoization only applies to the `GET` method in `fetch` requests.

"Memoization은 `fetch` 요청의 `GET` 메서드에만 적용된다."

- **GET method**: HTTP GET만 대상이다. POST, PUT, DELETE 등의 변경 요청은 같은 URL이라도 중복 제거가 적용되지 않는다. 변경 요청은 부수효과(side effect)가 있으므로 임의로 중복을 제거하면 데이터 정합성이 깨질 수 있다.

> Memoization only applies to the **React Component tree**, this means:
> - It applies to `fetch` requests in `generateMetadata`, `generateStaticParams`, Layouts, Pages, and other Server Components.
> - It doesn't apply to `fetch` requests in Route Handlers as they are not a part of the React component tree.

"Memoization은 **React 컴포넌트 트리**에만 적용된다. 이는 다음을 의미한다:
- `generateMetadata`, `generateStaticParams`, 레이아웃, 페이지, 기타 서버 컴포넌트의 `fetch` 요청에 적용된다.
- Route Handler의 `fetch` 요청에는 적용되지 않는다. Route Handler가 React 컴포넌트 트리에 속하지 않기 때문이다."

- **React Component tree**: 라우트 렌더링에 참여하는 컴포넌트들의 계층 구조. `generateMetadata`와 `generateStaticParams`도 이 트리의 일부로 취급된다.
- **Route Handlers**: `app/api/...` 경로에 위치하는 서버 엔드포인트. 라우트 렌더링과 별개로 실행되므로 memoization 테이블을 공유하지 않는다.

---

## 종합

Route Handler는 React 렌더링 사이클 바깥에서 독립적으로 실행된다. 그래서 같은 `fetch` URL을 쓴다 해도 컴포넌트 트리 내의 memoization과 공유되지 않는다. 반면 `generateMetadata`와 `generateStaticParams`가 포함된다는 점은 의외일 수 있다 — 이들도 라우트 렌더링의 일부로서 동일한 렌더 패스 컨텍스트를 공유한다.

---

---

# Request Memoization은 언제까지 유지되는가?

## 도입

Request Memoization의 수명은 하나의 서버 요청 처리 기간으로 제한된다. React 컴포넌트 트리 렌더링이 끝나는 순간 memoization 테이블이 초기화된다.

---

## 본문

> The cache lasts the lifetime of a **server** request until the React component tree has **finished rendering**.

"캐시는 React 컴포넌트 트리가 **렌더링을 완료할** 때까지 **서버** 요청의 수명 동안 지속된다."

- **lifetime of a server request**: 하나의 HTTP 요청이 서버에서 처리되는 시간 범위. 렌더링이 시작되어 완료될 때까지. 다음 요청이 오면 새로운 수명이 시작된다.
- **finished rendering**: React 서버 렌더링이 완료되어 HTML/RSC payload 생성이 끝난 시점. 이 시점에 memoization 테이블이 소멸한다.

---

## 종합

"서버 요청 하나 = memoization 테이블 하나"로 이해하면 된다. 두 사용자가 동시에 같은 페이지를 요청해도 각자 독립된 memoization 테이블을 가진다. 이 격리 덕분에 A 사용자의 인증 데이터가 B 사용자의 렌더링에 섞이는 일이 없다. 영속성이 필요한 데이터는 memoization이 아닌 Data Cache를 써야 한다.

---

---

# 왜 Request Memoization은 revalidate가 필요 없는가?

## 도입

Data Cache는 `revalidate`로 갱신 주기를 설정해야 하지만, Request Memoization은 그럴 필요가 없다. 이유는 단순하다 — 애초에 서버 요청 하나가 끝나면 자동으로 소멸하기 때문이다.

---

## 본문

> Since the memoization is not shared across server requests and only applies during rendering, there is no need to revalidate it.

"memoization은 여러 서버 요청 간에 공유되지 않고 렌더링 중에만 적용되므로, 재검증할 필요가 없다."

- **not shared across server requests**: 사용자 A의 렌더 패스 memoization과 사용자 B의 렌더 패스 memoization은 완전히 분리된다. 공유 상태가 없으니 오래된 데이터가 다른 요청에 노출될 위험이 없다.
- **only applies during rendering**: memoization 테이블의 수명이 "렌더링 중"으로 한정된다. 렌더링이 끝나면 자동으로 소멸하므로 재검증(revalidate)이라는 개념 자체가 불필요하다.

---

## 종합

revalidation이 필요한 이유는 "이전에 저장한 데이터가 더 이상 최신이 아닐 수 있을 때"다. Request Memoization은 "현재 렌더링 중에만" 유효하므로, 갱신 주기를 걱정할 필요가 없다. 항상 최신 데이터를 기반으로 시작하는 새 렌더 패스에서만 활성화되기 때문이다.

---

---

# Request Memoization 덕분에 권장되는 데이터 페칭 패턴은?

## 도입

Request Memoization이 있기 때문에 "데이터를 필요한 컴포넌트에서 직접 fetch하라"는 패턴이 가능해진다. props drilling 없이 각 컴포넌트가 독립적으로 필요한 데이터를 선언할 수 있다.

---

## 본문

> When rendering a route, Next.js will automatically deduplicate fetch requests for the same data across `generateMetadata`, `generateStaticParams`, Layouts, Pages, and Server Components. React `cache` can be used if `fetch` is unavailable.

"라우트를 렌더링할 때, Next.js는 `generateMetadata`, `generateStaticParams`, 레이아웃, 페이지, 서버 컴포넌트 전반에 걸쳐 동일한 데이터에 대한 fetch 요청을 자동으로 중복 제거한다. `fetch`를 사용할 수 없는 경우 React `cache`를 사용할 수 있다."

- **deduplicate**: 여러 컴포넌트가 같은 URL로 `fetch()`를 호출해도 실제 네트워크 요청은 한 번만 발생하도록 중복을 제거한다.
- **React `cache`**: DB 직접 조회, ORM 호출 등 `fetch()`를 쓰지 않는 서버 함수에 memoization을 수동으로 적용하는 방법. `import { cache } from 'react'`로 함수를 감싸면 된다.

> This provides one flexible way to fetch, cache, and revalidate data at the **component level**.
>
> In this new model, we recommend fetching data directly in the component that needs it, even if you're requesting the same data in multiple components, rather than passing the data between components as props.

"이는 **컴포넌트 레벨**에서 데이터를 fetch, cache, revalidate하는 유연한 방법을 제공한다. 이 새로운 모델에서는, 여러 컴포넌트에서 동일한 데이터를 요청하더라도 컴포넌트 간 props로 데이터를 전달하는 대신 필요한 컴포넌트에서 직접 데이터를 fetch하도록 권장한다."

- **component level**: 페이지나 레이아웃 단위가 아닌 개별 컴포넌트 단위로 데이터 패칭을 선언하는 방식. 컴포넌트의 데이터 의존성을 컴포넌트 내부에 담아 응집도를 높인다.
- **rather than passing the data between components as props**: 상위에서 데이터를 가져와 props로 내려주는 전통적인 패턴의 대안. memoization 덕분에 중복 호출 걱정 없이 컴포넌트마다 독립적으로 fetch할 수 있다.

```tsx
// 권장: 각 컴포넌트에서 직접 fetch (memoization이 중복 제거)
async function UserHeader() {
  const user = await fetchUser(userId) // 네트워크 호출
  return <header>{user.name}</header>
}

async function UserSidebar() {
  const user = await fetchUser(userId) // memoization HIT, 네트워크 호출 없음
  return <aside>{user.avatar}</aside>
}

// 비권장: props drilling
async function Page() {
  const user = await fetchUser(userId)
  return (
    <>
      <UserHeader user={user} />
      <UserSidebar user={user} />
    </>
  )
}
```

---

## 종합

이 패턴의 핵심은 "데이터 의존성의 지역화"다. 어떤 컴포넌트가 어떤 데이터를 필요로 하는지가 컴포넌트 파일 안에 명시된다. 컴포넌트를 다른 곳에 옮겨도 데이터 의존성이 자연스럽게 따라간다. props drilling을 없애면서도 중복 네트워크 호출을 방지할 수 있는 것은 Request Memoization이 자동으로 동작하기 때문이다.
