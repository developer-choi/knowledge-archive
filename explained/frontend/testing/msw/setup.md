# MSW로 나가는 네트워크 요청을 가로채려면 어떻게 셋업하는가?

## 본문

세 단계를 순서대로 짚는다.

### 1단계 — request handlers를 정의한다

> Those are functions responsible for intercepting requests and handling their responses.

"요청을 가로채고 그 응답을 처리하는 함수들"이 request handler다. "어떤 URL로 오는 어떤 메서드의 요청에 → 이런 응답을 준다"는 **규칙**을 함수로 적어둔 것이다. 비유하면 요청→응답 대응을 적어둔 **메뉴판**이다. (작성법은 하위 질문 "핸들러를 작성해 setupServer/setupWorker에 넘기려면…"에서.)

### 2단계 — 핸들러를 setupServer / setupWorker에 넘긴다

> On their own, request handlers don't do anything. They have to be provided to the setupServer or setupWorker functions to configure API mocking in a Node.js or a browser process, respectively.

"핸들러는 그 자체로는 아무 일도 하지 않는다. Node.js 프로세스면 `setupServer`에, 브라우저 프로세스면 `setupWorker`에 넘겨야 API mocking이 구성된다." 즉 **핸들러를 정의하는 것과 mocking을 켜는 것은 별개**다 — 메뉴판을 써둔다고 주방이 열리는 게 아니고, 그 메뉴판을 든 주방을 여는 스위치가 setupServer/setupWorker다. (환경 분기·코드는 그 하위 질문에서 함께 다룬다.)

### 3단계 — 환경 진입점에서 가로채기를 켠다

> At this step, you find the appropriate place to enable API mocking in your Node.js process. In the case of Vitest, that place is the test setup file, which runs before your tests.

"Node.js 프로세스에서 API mocking을 켤 적절한 자리를 찾는다. Vitest라면 그 자리는 테스트보다 먼저 실행되는 test setup 파일이다." 여기서 `server.listen()`을 호출해 실제로 가로채기를 시작한다. (매 테스트 사이·종료 시 처리는 하위 질문 "테스트 실행 중 …언제 켜고…"에서.)

```
[셋업 3단계 파이프라인]
  1. handlers 정의        (규칙 = 메뉴판)
        │  핸들러만으론 아무 일도 안 함
        ▼
  2. setupServer/Worker    (스위치: Node=Server, browser=Worker)
        │  같은 handlers.ts를 두 환경에서 재사용
        ▼
  3. server.listen()       (진입점 = 도구의 setup 파일에서 가로채기 ON)
```

---
# 핸들러를 작성해 setupServer/setupWorker에 넘기려면 어떻게 하는가?

## 도입

셋업 파이프라인의 1단계, 즉 request handler를 실제로 어떻게 쓰는지 본다. 핸들러는 "어떤 URL로 오는 요청에 어떤 응답을 줄지"를 적은 규칙이다. MSW는 이걸 `http` 네임스페이스와 `HttpResponse`로 선언한다.

---
## 본문

> Import the http namespace from the msw package and create your first request handler.

```ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]
```

한 줄씩 뜯어본다.

- `import { http, HttpResponse } from 'msw'` — `http`는 HTTP 메서드별 핸들러를 만드는 **네임스페이스**다. `http.get`, `http.post`, `http.put`처럼 메서드마다 함수가 달려 있다. `HttpResponse`는 응답을 만드는 도우미다.
- `http.get('https://api.example.com/user', () => { ... })` — 첫 번째 인자는 **가로챌 URL**(이 주소로 가는 GET 요청을 낚아챈다), 두 번째 인자는 **resolver 함수**다. resolver는 "가로챈 요청에 무엇으로 답할지"를 만들어 반환하는 함수다.
- `return HttpResponse.json({ id: ..., ... })` — 넘긴 객체를 **JSON 응답**으로 반환한다. `Content-Type: application/json` 헤더와 직렬화를 알아서 붙여준다.
- `export const handlers = [ ... ]` — 핸들러들을 **배열**로 모은다. 이 `handlers` 배열이 다음 단계에서 setupServer/setupWorker로 넘어간다.

정리하면 "`http.<메서드>(가로챌 URL, 응답을 만드는 resolver)"를 필요한 만큼 만들어 `handlers` 배열에 담는 것이 핸들러 작성의 전부다. 다만 이 배열은 **아직 아무 요청도 가로채지 못한다** — 핸들러는 규칙(메뉴판)일 뿐이라, 실제로 작동시키려면 환경에 맞는 스위치(Node.js는 `setupServer`, 브라우저는 `setupWorker`)에 넘겨야 한다.

### 핸들러를 스위치에 넘긴다 — setupServer / setupWorker

> One of the core benefits of MSW is the ability to reuse the same mocks (e.g. handlers.ts) across different tools and environments. On their own, request handlers don't do anything. They have to be provided to the setupServer or setupWorker functions to configure API mocking in a Node.js or a browser process, respectively.

"MSW의 핵심 이점 중 하나는 같은 mock(예: `handlers.ts`)을 서로 다른 도구·환경에서 재사용할 수 있다는 점이다. request handler는 그 자체로는 아무 일도 하지 않는다. Node.js 프로세스면 `setupServer`, 브라우저 프로세스면 `setupWorker`에 넘겨야 각각 API mocking이 구성된다."

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers.js'

export const server = setupServer(...handlers)
```

- `import { setupServer } from 'msw/node'` — Node.js용 스위치는 `msw/node`에서 가져온다. (브라우저용 `setupWorker`는 `msw/browser`에서 가져온다.)
- `import { handlers } from './handlers.js'` — 앞 단계에서 만든 핸들러 배열(메뉴판)을 불러온다.
- `setupServer(...handlers)` — 핸들러 배열을 펼쳐 넘겨 `server` 객체를 만든다. 이 `server`가 나중에 `listen()`/`close()`로 가로채기를 켜고 끄는 대상이 된다.

핵심은 두 가지다.

**핸들러 단독으로는 아무 일도 안 한다.** 메뉴판을 아무리 잘 써둬도, 그 메뉴판을 든 주방을 열지 않으면 손님(요청)에게 아무것도 못 낸다. setupServer/setupWorker가 바로 그 주방을 여는 스위치다.

**스위치는 환경마다 다르다.** `setupServer`는 Node.js 프로세스용, `setupWorker`는 브라우저 프로세스용이다. 그런데 넘기는 `handlers.ts`는 **똑같은 파일**이다. 규칙(핸들러)은 한 번만 쓰고, 환경에 따라 스위치만 골라 끼운다 — 같은 mock을 개발(브라우저)과 테스트(Node.js) 양쪽에서 재사용하는 것이 MSW의 핵심 이점이다.

**브라우저 쪽 코드 모양.** 위 `setupServer` 예시의 브라우저 대응은 다음과 같다. import 출처가 `msw/node`가 아니라 `msw/browser`이고, 만드는 것도 `server`가 아니라 `worker`라는 점만 다르다.

```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

export const worker = setupWorker(...handlers)
```

```
       handlers.ts  (규칙 = 한 번만 작성)
         │
   ┌─────┴─────┐
   ▼           ▼
setupServer   setupWorker
 (Node.js)    (browser)
 테스트 환경   개발 환경
```

