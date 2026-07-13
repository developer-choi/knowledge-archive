# `http.get('/resource', () => {})`에서 첫 번째 인자와 두 번째 인자는 각각 무슨 역할을 하며, MSW는 그 둘을 뭐라고 부르는가?

> Every request handler consists of two parts: a predicate and a response resolver. A predicate decides which requests to intercept, and a resolver decides what to do with those requests.

"모든 request handler는 두 부분으로 이루어진다 — predicate와 response resolver다. predicate는 어떤 요청을 가로챌지 정하고, resolver는 그 요청을 어떻게 처리할지 정한다."

### 첫 번째 인자 = predicate (어떤 요청을 가로챌지 판정하는 조건)

`http.get('/resource', ...)`의 `'/resource'`가 **predicate**다. "이 요청을 낚아챌까, 말까"를 판정하는 **조건**이다. 나가는 요청이 이 조건에 맞으면 핸들러가 발동하고, 안 맞으면 그냥 지나간다.

`predicate`라는 이름은 문법·논리학에서 온 말이다. 거기서 predicate는 "어떤 대상에 대해 참인지 거짓인지를 판정하는 조건"을 뜻한다. MSW에서도 똑같은 역할이다 — 들어온 요청 하나하나에 대해 "이 조건에 맞나(참)? 안 맞나(거짓)?"를 따져 가로챌지를 결정한다. 그래서 조건을 담는 첫째 인자를 predicate라 부른다.

### 두 번째 인자 = response resolver (가로챈 요청을 어떻게 처리할지 정하는 함수)

`() => { ... }` 자리가 **response resolver**(줄여서 resolver)다. predicate가 "이 요청 잡자"고 판정해 들여보낸 요청을, 실제로 **어떻게 처리해 무엇으로 답할지**를 만들어 반환하는 함수다. 안에서 `HttpResponse.json(...)` 같은 걸로 가짜 응답을 빚어낸다.

---

# 핸들러의 predicate 자리에 문자열 URL을 주면 MSW는 그것을 나가는 요청과 어떻게 대조하는가?

## 도입

predicate 자리에는 여러 형태를 줄 수 있는데, 가장 흔한 것이 문자열 URL이다. `'https://api.github.com/repos/mswjs/msw'` 같은 통짜 주소일 수도 있고, `/users/:id`처럼 일부만 적은 패턴일 수도 있다. 그런데 이 문자열 하나가 실제로 나가는 요청과 "맞다/안 맞다"로 판정되기까지 MSW 내부에서 무슨 일이 벌어지는지 — 특히 `:id`나 `*` 같은 기호가 어떻게 해석되는지 — 를 알아야 매칭이 왜 되는지/안 되는지를 스스로 설명할 수 있다.

---
## 본문

> You can provide a string as a request handler predicate that represents an entire request URL or its portion. MSW will use path-to-regexp@6 to match your predicate against outgoing requests to determine if they match. When you provide an absolute request URL as a predicate, the outgoing request must match its scheme, host, and pathname to trigger the request handler.

"predicate로 전체 요청 URL이나 그 일부를 나타내는 문자열을 줄 수 있다. MSW는 path-to-regexp@6을 사용해 그 predicate를 나가는 요청과 대조하여 일치 여부를 판정한다. 절대 요청 URL을 predicate로 주면, 나가는 요청이 그 scheme·host·pathname을 모두 일치시켜야 핸들러가 발동한다."

### 문자열은 정규식으로 변환돼 대조된다

MSW는 문자열 predicate를 **정규식(패턴)으로 변환**한 뒤, 나가는 요청 URL이 그 패턴에 맞는지 대조한다. path-to-regexp는 Express 같은 웹 프레임워크가 라우트 경로를 다룰 때 쓰는 바로 그 도구다 — `/users/:id` 같은 사람이 읽기 쉬운 경로를 기계가 매칭할 수 있는 정규식으로 바꿔준다.

### 절대 URL을 주면 scheme·host·pathname 셋 다 맞아야 한다

predicate가 `https://api.github.com/user`처럼 완전한 절대 URL이면, 나가는 요청이 세 부분을 **모두** 일치시켜야 핸들러가 발동한다.

- **scheme(체계)** — `https` (프로토콜)
- **host(호스트)** — `api.github.com` (도메인)
- **pathname(경로)** — `/user`

셋 중 하나라도 어긋나면(예: `http`로 나가거나 다른 도메인이면) 그 핸들러는 발동하지 않는다.

### 특수 토큰 — `:foo`와 `*`

path-to-regexp로 변환되기 때문에, 문자열 안에 특별한 뜻을 갖는 기호 두 가지를 쓸 수 있다. 둘 다 "URL의 어떤 조각을 붙잡는다"는 점은 같지만, 붙잡은 값에 **이름을 붙이느냐 아니냐**가 다르다.

#### `:foo` — 붙잡아서 이름 붙이기 (named parameter)

`:` 뒤에 원하는 이름을 붙이면(`:foo`는 문법 자체이고, `foo` 자리에 아무 이름이나 넣는다) 그 자리에 오는 값을 **붙잡아 그 이름으로 꺼내 쓸 수 있는** 경로 파라미터가 된다.

```
/users/:id            → :id 자리 값을 "id"라는 이름으로
/repos/:owner/:repo   → :owner, :repo 각각 이름 붙여
```

`:id`, `:owner`, `:repo`는 모두 `:foo` 문법의 실제 사례다. `/users/:id`는 `/users/abc-123`에도 `/users/42`에도 맞고, 그 자리에 온 `abc-123`·`42`를 나중에 `id`라는 이름으로 꺼내 쓸 수 있다. 즉 **잡아서 이름 붙여 쓰는** 매칭이다.

#### `*` — 붙잡되 이름은 안 붙이기 (wildcard)

`*`(와일드카드)는 아무 URL이나 아무 부분에나 맞는다. 값을 붙잡기는 하지만 이름을 안 붙이므로, 사실상 **잡아서 버리는** 매칭이다. "여기 뭐가 오든 상관없다, 통과만 시켜라"라고 말하고 싶을 때 쓴다.

정리하면 둘의 차이는 한 줄이다 — `:foo`는 잡아서 이름 붙여 쓰는 매칭, `*`는 잡되 이름 없이 버리는 매칭이다.

---

# predicate에 `/users/:id`처럼 상대 경로를 주면 브라우저에서는 잘 매칭되는데, 같은 코드가 Node.js 테스트에서는 매칭되지 않을 수 있다. 왜 그런가?

## 도입

똑같은 핸들러 코드를 브라우저 개발 환경에서 돌리면 요청이 잘 잡히는데, Node.js 테스트로 옮기면 갑자기 아무것도 안 잡히는 상황이 있다. 코드는 한 글자도 안 바뀌었는데 결과가 갈린다. 원인은 predicate에 준 **상대 경로**를 두 환경이 서로 다르게(정확히는 한쪽은 아예 해석하지 못하게) 다루기 때문이다. 그 차이의 뿌리는 "상대 경로는 무엇을 기준으로 완성되는가"에 있다.

---
## 본문

> When you provide a relative request URL as a predicate, it will be resolved against the current document (location.href). This is handy for in-browser mocking, but bear in mind that you need to configure the base URL in your Node.js tests because that's not a thing in Node.js.

"상대 요청 URL을 predicate로 주면, 그것은 현재 문서(location.href)를 기준으로 해석된다. 이는 브라우저 안에서 모킹할 때 편리하지만, Node.js 테스트에서는 base URL을 따로 설정해야 한다는 점을 유념하라 — 그런 것(현재 문서)이 Node.js에는 없기 때문이다."

### 상대 경로는 "현재 문서 주소"를 기준으로 완성된다

`/users/:id`는 그 자체로는 완전한 주소가 아니다. scheme도 host도 없이 경로만 있다. 이런 상대 경로는 반드시 어떤 **기준점**에 얹혀야 완전한 URL이 된다. 그 기준점이 바로 "지금 열려 있는 문서의 주소", 즉 `location.href`다.

편지 봉투에 "3층 301호"라고만 적으면 어느 건물인지 알 수 없는 것과 같다. "지금 내가 서 있는 건물"이라는 기준이 있어야 "○○빌딩 3층 301호"로 완성된다. 상대 경로의 기준점이 그 "지금 서 있는 건물"이다.

아래 예시는 모두 이 **공용 핸들러** 하나를 쓴다. 상대 경로 predicate `/users/:id`가 핵심이다.

```ts
// src/mocks/handlers.ts — 브라우저·Node 공용
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/users/:id', ({ params }) => {          // ← 상대 경로 predicate
    return HttpResponse.json({ id: params.id, name: 'Alice' })
  }),
]
```

### 브라우저 — 기준점(현재 페이지 주소)이 있다

브라우저에는 항상 "지금 열려 있는 페이지 주소"가 존재한다. 앱이 `http://localhost:3000`에서 돌고 있다면 `location.href`가 그 값이다. 그래서 predicate `/users/:id`는 이 기준에 얹혀 `http://localhost:3000/users/:id`로 완성되고, 나가는 요청 `http://localhost:3000/users/abc-123`과 맞아떨어진다. 상대 경로만 적어도 알아서 완성되니 편리하다.

```ts
// 앱이 http://localhost:3000 에서 실행 중  (location.href = "http://localhost:3000/")
await fetch('/users/abc-123')

// 요청 URL   → location.href 기준 완성 → http://localhost:3000/users/abc-123
// predicate  → location.href 기준 완성 → http://localhost:3000/users/:id
//   결과: 매칭 O  →  { id: "abc-123", name: "Alice" }
```

### Node.js — 기준점이 없다

Node.js 테스트에는 "지금 열려 있는 페이지"라는 개념 자체가 없다. 브라우저가 아니니 `location.href`도 없다. 기준점이 없으니 `/users/:id`를 완전한 URL로 완성할 방법이 없고, 결과적으로 나가는 요청과 대조가 성립하지 않아 매칭이 실패한다.

```ts
// user.test.ts  (vitest environment: 'node')
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

const server = setupServer(...handlers)
server.listen()

await fetch('http://localhost:3000/users/abc-123')

// Node에는 location.href가 없음
//   → predicate '/users/:id' 를 완성할 기준점이 없어 완전한 URL로 못 만듦
//   → 대조 불성립 → 매칭 실패 (요청이 목에 안 잡히고 그대로 나감)
```

#### 해결 — base URL을 손으로 채운다

Node.js 테스트에서 상대 경로 predicate를 쓰려면 **base URL을 따로 설정**해줘야 한다. 브라우저가 공짜로 주던 기준점("현재 페이지 주소")을, Node에서는 손으로 지정해 채워 넣는 것이다.

다만 MSW는 **base URL을 지정하는 API를 따로 제공하지 않는다**. 공식 문서 권장은 `URL` 생성자로 "상대 경로 → 절대 URL"을 만드는 유틸 함수를 직접 두고, predicate를 그 유틸로 감싸는 것이다.

```ts
// MSW 공식 recipe 패턴 — 상대 경로를 절대 URL로 완성하는 유틸
function api(path: string) {
  return new URL(path, 'http://localhost:3000').href
}

export const handlers = [
  http.get(api('/users/:id'), ({ params }) => {     // → http://localhost:3000/users/:id
    return HttpResponse.json({ id: params.id, name: 'Alice' })
  }),
]
```

predicate가 애초에 절대 URL이 되어 기준점이 필요 없어지므로, 브라우저·Node 양쪽에서 동일하게 매칭된다. 공식 문서도 *"we highly recommend you using custom utility functions that build absolute URLs from relative paths"* 라며 이 방식을 권한다 — 편의(짧게 쓰기)와 명시성(어느 host인지 분명)을 둘 다 얻는다.

> 참고: 여기 `new URL(path, base)`는 **상대 경로를 절대 URL로 완성**하는 용도다. resolver 안에서 보게 될 `new URL(request.url).searchParams`(쿼리 값 읽기)와 생김새는 같아도 역할이 반대다 — 한쪽은 predicate를 짓고, 다른 쪽은 이미 들어온 요청에서 값을 꺼낸다.

---
## 종합

상대 경로 predicate(`/users/:id`)는 완전한 URL이 아니라서, 어떤 기준점 위에 얹혀야 완성된다. 그 기준점이 "현재 문서 주소"인 `location.href`다. 브라우저에는 지금 열려 있는 페이지 주소가 늘 있으니 `/users/:id`가 `http://localhost:3000/users/:id`처럼 자동 완성돼 잘 매칭된다. 반면 Node.js 테스트에는 "현재 페이지"라는 것이 없어 기준점이 없고, 그래서 상대 경로만으로는 완성이 안 돼 매칭이 실패한다. 해결책은 Node.js 테스트에서 base URL을 따로 설정해 브라우저가 공짜로 주던 기준점을 손으로 채워주는 것이다.

---

# 목 응답이 실제 API 형태와 어긋나도 테스트는 통과하는 stale mock 문제가 있다. MSW는 이를 타입 수준에서 어떻게 방지하는가?

## 도입

MSW 핸들러가 돌려주는 응답은 결국 개발자가 손으로 적어 넣은 가짜 데이터다. 처음 작성할 땐 실제 API와 똑같은 모양이었더라도, 백엔드가 응답 형태를 바꾸는 순간부터 어긋난다. 문제는 이 어긋남이 눈에 안 띈다는 것이다.

테스트는 진짜 서버가 아니라 이 가짜 응답을 상대로 돌기 때문에, 목이 옛 모양에 얼어붙어 있어도 **초록불(통과)**이 켜진다. 정작 실제 서버는 새 모양을 주므로 프로덕션만 깨진다. 이 질문은 이렇게 "낡은 목(stale mock)"이 만들어내는 가짜 안심을, MSW가 타입 검사 단계에서 어떻게 잡아내는지를 다룬다.

---
## 본문

> Type-safe. Annotate path parameters, request and response body types to never have out-of-date mocks again.

"타입 안전하다. 경로 파라미터, 요청 바디, 응답 바디의 타입을 주석으로 달아, 다시는 낡은(out-of-date) 목을 갖지 않도록 하라."

### 문제 — stale mock: 목은 과거에 얼어붙고 현실만 앞서간다

핸들러가 처음엔 실제 API와 똑같이 `{ id, name }`을 돌려줬다고 하자.

```js
http.get('/user/:id', () => {
  return HttpResponse.json({ id: 1, name: 'Ada' })
})
```

시간이 지나 백엔드가 `name`을 `firstName`/`lastName`으로 쪼갠다. 하지만 이 핸들러는 아무도 안 고쳐서 여전히 옛 `name`을 돌려준다. 이제 두 세계가 어긋난다.

- **테스트 세계 (MSW 목이 상대)**: 앱이 MSW 가짜 응답을 상대하니 `name`이 그대로 있다 → 테스트 **통과**.
- **프로덕션 세계 (진짜 서버가 상대, MSW 없음)**: 프로덕션엔 MSW가 없다. 앱이 진짜 백엔드와 직접 통신하는데, 서버는 `firstName`/`lastName`을 주고 앱은 (낡은 목에만 맞춰 검증된 탓에) 여전히 `name`을 찾는다 → **깨진다**.

여기서 깨지는 건 MSW가 아니라 **앱 코드**다. MSW는 프로덕션에서 돌지 않는다 — 오히려 프로덕션이 앱이 처음으로 진짜 API를 만나는 자리라, 테스트가 못 잡은 불일치가 여기서 처음 터진다.

목이 과거 형태에 얼어붙은 채 실제 API만 앞서간 이 상태가 **stale(낡은) mock**, 곧 "out-of-date mock"이다. 초록불이 켜져 있으니 개발자는 안심하지만 그 안심은 가짜다 — stale mock과 **false confidence(가짜 안심)**는 한 몸이다.

### MSW의 해결 — 핸들러에 타입을 주석으로 달아 컴파일 단계에서 잡는다

MSW의 `http` 핸들러는 TypeScript 제네릭으로 세 가지 타입을 주석으로 붙일 수 있다.

- **경로 파라미터(path parameters)** — `:id` 같은 URL 조각의 타입
- **요청 바디(request body)** — 들어오는 요청 본문의 타입
- **응답 바디(response body)** — 돌려주는 목 응답 본문의 타입

응답 바디 타입을 고정해두면, 핸들러가 그와 어긋나는 목을 만들려 할 때 **컴파일 단계에서 타입 에러**가 난다.

```ts
// 응답 바디 타입을 선언(주석)해둔다
http.get<never, never, { id: number; firstName: string; lastName: string }>(
  '/user/:id',
  () => {
    // 옛 모양 { id, name }을 돌려주면 → 선언한 타입과 불일치 → 컴파일 에러
    return HttpResponse.json({ id: 1, name: 'Ada' })
  },
)
```

즉 목이 계약(선언한 타입)과 몰래 어긋나는 순간, 테스트를 돌리기도 전에 타입 검사기가 먼저 막아선다. 런타임에 초록불로 넘어가던 stale mock 문제가, 타입이라는 더 이른 관문에서 걸린다.

### 연결 맥락 — "API 모양의 단일 진실 원천"에 목을 묶는다

이 아이디어의 핵심은 목의 응답 모양을 **따로 손으로 관리하지 않는 것**이다. 목의 형태를 API 모양의 "단일 진실 원천"에 묶어두면, 원천이 바뀔 때 목의 불일치가 자동으로 드러난다. 같은 계열의 접근이 여럿 있다.

- **OpenAPI 명세 기반 생성** — 백엔드의 OpenAPI 명세로부터 핸들러와 타입을 자동 생성한다. 명세가 바뀌면 재생성 시 목도 따라 바뀐다.
- **zod 스키마 공유** — 앱과 목이 zod 스키마 하나를 공유해 응답을 검증한다. 스키마가 곧 단일 원천이다.

MSW의 type-safe 제네릭 주석은 이 "stale mock 방지"라는 목적을, 외부 도구 없이 MSW 자체 기능으로 제공하는 형태다.
