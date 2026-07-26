# 같은 데이터를 컴포넌트 트리 여러 곳에서 fetch하면 실제 요청은 몇 번 나가는가?

## 도입

같은 사용자 정보를 헤더·사이드바·본문이 각각 필요로 할 때, 세 곳에서 각자 `fetch()`를 부르면 네트워크 요청도 세 번 나갈 것 같다. Request Memoization은 하나의 렌더링 패스 안에서 이런 동일 호출을 묶어 실제 요청은 한 번만 보내고, 나머지는 메모리에 저장된 결과를 돌려준다.

---

## 본문

> This means you can call a fetch function for the same data in multiple places in a React component tree while **only executing it once.**

"이는 React 컴포넌트 트리의 여러 곳에서 동일한 데이터에 대한 fetch 함수를 호출하면서 **한 번만 실행할 수 있음**을 의미한다."

- **memoize**: 함수 호출 결과를 키(URL + options)와 함께 메모리에 저장해두고, 같은 키로 재호출 시 함수를 다시 실행하지 않고 저장된 값을 반환하는 기법. JS에서 `useMemo`나 `React.memo`와 같은 원리다.
- **only executing it once**: 실제 `fetch` 네트워크 요청은 한 번. 두 번째 이후 호출은 메모리에서 즉시 반환한다.

같은 요청으로 묶이는 기준은 URL과 옵션이다. URL이 같아도 헤더나 body가 다르면 다른 요청으로 본다.

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

Request Memoization이 없으면, 같은 사용자 정보를 표시하는 Header, Sidebar, Main 컴포넌트가 각각 독립적으로 API를 호출하게 된다. props drilling으로 데이터를 내려주거나 전역 상태 관리를 써야 하는 복잡성이 생긴다. Memoization 덕분에 "데이터를 필요한 컴포넌트에서 직접 fetch하라"는 패턴이 가능해진다 — 중복 호출 걱정 없이. 그 패턴 자체는 [../data-fetching/server-components.md](../data-fetching/server-components.md)의 「같은 데이터가 여러 컴포넌트에서 필요할 때, 위에서 한 번 가져와 props로 내려보내지 않아도 되는 까닭은 무엇인가?」가 현행 원문으로 다룬다.

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