# 같은 데이터가 여러 컴포넌트에서 필요할 때, 위에서 한 번 가져와 props로 내려보내지 않아도 되는 까닭은 무엇인가?

## 도입

머리로는 "요청이 세 번 나가겠는데" 싶어서 위에서 한 번 가져와 내려보내게 된다. 그런데 요청은 한 번만 나간다.

---
## 본문

> Identical fetch requests in a React component tree are memoized by default, so you can fetch data in the component that needs it instead of drilling props.

"React 컴포넌트 트리 안에서 동일한 `fetch` 요청은 기본적으로 기억됐다가 재사용되므로, props를 뚫고 내려보내는 대신 그 데이터가 필요한 컴포넌트에서 직접 가져와도 된다."

- **identical**: 완전히 동일한. URL과 옵션이 같아야 같은 요청으로 친다.
- **memoized**: 한 번 계산한 결과를 기억해 두었다가 같은 입력이 또 오면 그대로 돌려주는 것.
- **drilling props**: 중간 컴포넌트들이 쓰지도 않는 값을 아래로 전달만 하려고 props에 얹는 것. "구멍을 뚫어 내려보낸다"는 어감이다.

### 무엇이 "같은 요청"으로 묶이는가

기준은 두 가지다. URL과 옵션이 같을 것, 그리고 같은 요청을 처리하는 동안일 것. 이 둘이 맞으면 두 번째 호출은 네트워크로 나가지 않고 첫 번째 결과를 그대로 받는다.

```
한 요청을 처리하는 동안

Header   → fetch('/api/user')  ── 실제로 나감
Sidebar  → fetch('/api/user')  ── 기억된 결과 재사용
Profile  → fetch('/api/user')  ── 기억된 결과 재사용

네트워크 요청: 1회
```

### 코드 모양이 달라지는 지점

이 성질이 없다면 데이터를 쓰는 컴포넌트가 여럿일 때 선택지는 하나뿐이다. 공통 조상에서 한 번 가져와 props로 내려보내는 것. 그러면 데이터를 쓰지도 않는 중간 컴포넌트들이 전달만 하려고 props를 받게 된다.

```
드릴링

Page ── 데이터 가져옴
 └ Layout(user)      ← 안 쓰는데 받는다
    └ Sidebar(user)  ← 안 쓰는데 받는다
       └ Profile(user)  ← 여기서만 쓴다

직접 가져오기

Page
 └ Layout
    └ Sidebar
       └ Profile ── 여기서 가져온다
```

컴포넌트가 자기가 필요한 것을 스스로 챙기게 되므로, 옮겨 붙이거나 지울 때 위쪽을 손댈 일이 없다.

---
## 종합

요청이 중복될까 봐 위로 끌어올리던 습관을 버려도 된다는 이야기다. 같은 요청은 자동으로 한 번만 나가므로, 데이터는 그것을 쓰는 자리에서 가져오는 게 낫다. 중간 층이 남의 데이터를 나르지 않게 되는 것이 실제 이득이다.

---

# `React.cache`로 감싼 함수를 한 화면에서 여러 번 호출하면 그때마다 실행되는가?

## 도입

`fetch`는 알아서 한 번만 나간다. 그런데 데이터베이스 질의처럼 `fetch`가 아닌 함수는 Next.js가 같은 호출인지 알 방법이 없다. 그 자리를 메우는 게 `React.cache`다.

---
## 본문

> Since `getUser` is wrapped with `React.cache`, multiple calls within the same request return the same memoized result, whether called directly in Server Components or resolved via context in Client Components.

"`getUser`가 `React.cache`로 감싸여 있으므로, 같은 요청 안에서 여러 번 호출해도 기억된 동일한 결과를 돌려준다. 서버 컴포넌트에서 직접 부르든, 클라이언트 컴포넌트가 context를 통해 풀어내든 마찬가지다."

- **wrapped with**: `cache(fn)` 형태로 감싼.
- **within the same request**: 같은 요청을 처리하는 동안.
- **whether A or B**: A든 B든 상관없이.
- **resolved**: 프로미스에서 실제 값을 꺼낸.

```tsx
import { getUser } from '../lib/user'

export default async function DashboardPage() {
  const user = await getUser() // Cached - same request, no duplicate fetch
  return <h1>Dashboard for {user.name}</h1>
}
```

### `fetch` 자동 메모이제이션과 나눠 보기

둘은 같은 일을 하지만 적용 대상이 다르다.

```
fetch 자동 메모이제이션
  대상: fetch 호출
  기준: URL + 옵션
  할 일: 없음 (기본 동작)

React.cache
  대상: 내가 만든 아무 비동기 함수 (DB 질의 등)
  기준: 인자
  할 일: cache()로 감싸기
```

데이터베이스 클라이언트는 Next.js가 안을 들여다볼 수 없는 남의 코드다. 그러니 "이 호출과 저 호출이 같다"는 판단을 대신 해 줄 수 없고, 감싸서 알려 줘야 한다.

### 부르는 경로가 달라도 상관없다

같은 데이터를 서버 컴포넌트는 직접 `await`해서 쓰고, 클라이언트 컴포넌트는 context로 받은 프로미스를 `use()`로 풀어서 쓴다고 하자. 경로는 둘이지만 출발점인 함수 호출은 하나로 합쳐진다.

```
getUser()  ← cache로 감싼 함수
   │
   ├── DashboardPage에서 await          (서버)
   └── UserProvider에 담겨 use()로 풀림  (클라이언트)

실제 실행: 1회
```

---
## 종합

`fetch`가 자동으로 받는 대우를 임의의 함수에도 주는 장치다. 한 번 감싸 두면 같은 요청을 처리하는 동안에는 몇 번을 부르든, 어느 경로로 부르든 실행은 한 번이다. 그래서 "이 값을 어디서 가져와야 중복이 없을까"를 고민하지 않고 필요한 자리에서 부르면 된다.

---

# 그 재사용은 어디까지 유효한가?

## 도입

"기억해 둔다"는 말을 들으면 다음 사용자가 들어와도 그 값을 받는 게 아닌지 걱정하게 된다. 그렇지 않다.

---
## 본문

> `React.cache` is scoped to the current request only. Each request gets its own memoization scope with no sharing between requests.

"`React.cache`는 현재 요청 하나에만 적용된다. 요청마다 각자의 기억 범위를 갖고, 요청 사이에는 공유되지 않는다."

- **scoped to**: 그 범위 안에서만 유효한.
- **scope**: 그 기억이 통하는 범위.
- **no sharing between requests**: 요청과 요청 사이에는 공유가 없다.

### 캐싱과 이름만 닮았다

이름에 cache가 들어가지만 하는 일은 캐싱이 아니다. 목적이 다르다.

```
캐싱
  목적: 다음 요청에서도 다시 안 가져오려고
  수명: 요청을 넘어 살아남는다

React.cache
  목적: 지금 이 화면을 그리는 동안 중복 호출을 막으려고
  수명: 그 요청이 끝나면 사라진다
```

### 요청 사이에 공유되면 안 되는 까닭

`getUser()`는 대개 쿠키를 읽어 "지금 로그인한 사람"을 판단한다. 이 결과가 요청을 넘어 남아 있으면 다음 사람이 앞사람의 정보를 받게 된다. 요청마다 기억 범위를 새로 여는 것은 성능 설계이기 이전에 안전장치다.

```
요청 A (철수)  getUser() → 철수   ┐ 기억 범위 A, 요청 끝나면 버림
요청 B (영희)  getUser() → 영희   ┐ 기억 범위 B, 새로 만듦
```

---
## 종합

수명이 요청 하나라는 것이 핵심이다. 그 안에서는 몇 번을 불러도 한 번만 실행되고, 요청이 끝나면 기억은 버려진다. 사용자마다 다른 데이터를 다루면서도 안심하고 쓸 수 있는 이유가 여기 있다.
