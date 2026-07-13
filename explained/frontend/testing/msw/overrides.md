# MSW에서, 셋업 때 준 기본 핸들러를 그대로 두면서 특정 테스트에서만 네트워크 동작을 다르게 덮어쓰려면 어떤 API를 쓰는가?

## 도입

테스트 스위트를 짜다 보면 이런 상황을 자주 만난다 — 대부분의 테스트에서는 `GET /resource`가 정상 응답을 주면 되는데, 딱 한 테스트에서만 그 요청이 500 에러를 뱉는 상황을 재현하고 싶다. 이때 두 가지 욕심이 충돌한다. 하나는 "공통으로 쓰는 기본 핸들러 묶음(셋업 때 준 것)을 매번 다시 적기 싫다"이고, 다른 하나는 "그런데 이 테스트에서만큼은 그 기본 동작을 다른 걸로 갈아끼우고 싶다"이다.

이 질문은 그 충돌을 푸는 MSW의 장치 — 기본 핸들러는 건드리지 않은 채 특정 지점에서만 동작을 덮어쓰는 방법을 다룬다.

---

## 본문

### `.use()` — 런타임에 핸들러를 끼워 넣는 오버라이드 API

공식 답변의 핵심 문장이다.

> MSW provides you the means to override any particular network behavior using the designated `.use()` API.

"MSW는 `.use()`라는 전용 API로 특정 네트워크 동작을 덮어쓸 수단을 제공한다." `.use()`에 핸들러 목록을 넘기면, 셋업 때 준 기본(initial) 핸들러는 그대로 둔 채 그 위에 새 동작을 얹는다. 그리고 이렇게 얹은 핸들러가 기본 핸들러보다 **우선 적용된다** — 같은 요청이 오면 `.use()` 쪽 응답이 이긴다. (내부적으로는 기본 핸들러보다 앞에 끼워 넣어 먼저 매칭되게 하는 구조지만, 쓰는 입장에선 "`.use()`로 얹은 게 이긴다"만 알면 된다.)

호출 대상은 실행 환경에 따라 갈린다.

- 브라우저 환경 → `worker.use(...)` (setupWorker로 만든 worker 객체)
- Node(테스트 등) 환경 → `server.use(...)` (setupServer로 만든 server 객체)

```js
const server = setupServer(
  http.get('/resource', () => HttpResponse.text('Fallback')),  // initial
)

server.use(
  http.get('/resource', () => HttpResponse.text('Override')),  // 우선 적용
)
```

`GET /resource`가 오면 `.use()`로 얹은 Override 핸들러가 이겨 `'Override'`를 돌려주고, 기본 Fallback 핸들러에는 도달하지 않는다.

### initial vs runtime — 그리고 initial은 사라지지 않는다

두 용어를 구분해두면 이후 질문들이 쉽게 풀린다.

- **initial 핸들러** — setupWorker()/setupServer()에 처음 넘긴, 셋업 때의 기본 핸들러들. 공통 기반이다.
- **runtime 핸들러** — 목킹이 켜진 뒤 `.use()`로 나중에 얹은 핸들러들.

여기서 중요한 성질 하나. `.use()`는 initial을 **지우거나 대체하는 게 아니라** 그 앞에 얹기만 한다. 그래서 runtime 핸들러가 어떤 이유로 빠지거나(소진·리셋) 매칭에 실패해도, 그 아래 깔려 있던 initial 핸들러가 **항상 fallback으로 남아** 요청을 받아준다. 오버라이드는 기본을 덮는 이불일 뿐, 밑에 깔린 매트리스(initial)를 걷어내지 않는다.

### 왜 개별 테스트 안에서 호출할 수 있는가 — 런타임 API

`.use()`는 런타임(runtime) API다. 즉 목킹이 이미 활성화된(listen 시작한) 뒤에도 언제든 호출할 수 있다. 그래서 공통 셋업을 `beforeAll` 같은 데서 한 번 켜두고, 특정 테스트 함수 **안에서** `server.use(...)`를 불러 그 테스트 동안만 동작을 갈아끼우는 패턴이 성립한다. 셋업을 다시 하거나 서버를 껐다 켤 필요가 없다.

---

## 종합

특정 테스트에서만 네트워크 동작을 바꾸려면 브라우저는 `worker.use()`, Node는 `server.use()`를 호출한다. `.use()`로 얹은 핸들러는 기본(initial) 핸들러보다 우선 적용된다. 런타임 API라 목킹이 켜진 뒤 개별 테스트 안에서도 부를 수 있으며, initial은 지워지지 않고 항상 fallback으로 남는다. 비유하면 `.use()`는 기본 규칙 위에 붙이는 "새치기 포스트잇" — 먼저 읽히지만, 떼어내면 원래 규칙이 그대로 드러난다.

---

# `.use()`로 추가한 오버라이드는 기본적으로 얼마 동안 유효한가?

## 본문

### 기본값 — permanent(영구) 오버라이드

> By default, calling `.use()` will create a permanent override. In this example, the GET /resource request will always receive the "Override" plain text response because the request handler attached with `.use()` takes precedence.

"기본적으로 `.use()` 호출은 **영구(permanent)** 오버라이드를 만든다. 이 예에서 GET /resource 요청은 **항상** 'Override' 텍스트 응답을 받는다 — `.use()`로 붙인 핸들러가 우선권을 갖기 때문이다."

즉 아무 옵션 없이 `.use()`만 부르면, 그 오버라이드는 한 번 쓰이고 사라지는 게 아니라 **이후 매칭되는 모든 요청에 계속** 적용된다. `GET /resource`를 열 번 보내면 열 번 다 'Override'를 받는다. "영구"라 해도 프로세스 전체에 영원한 건 아니고, 뒤 질문에서 볼 `resetHandlers()`로 청소되기 전까지 유효하다는 뜻이다.

### 반대 선택지 — one-time 오버라이드 `{ once: true }`

영구가 싫고 "딱 첫 요청 한 번만" 바꾸고 싶을 때가 있다. 핸들러에 `{ once: true }` 옵션을 주면 된다.

```js
server.use(
  http.get('/resource', () => HttpResponse.text('One-time'), { once: true }),
)
```

이 핸들러는 **첫 번째 매칭 요청에만** 적용되고, 쓰이는 즉시 "exhausted(소진됨)"로 표시된다. 소진된 핸들러는 이후 스캔에서 건너뛰어지므로, 두 번째 `GET /resource`부터는 그 아래 깔린 initial 핸들러의 응답으로 복귀한다.

정리하면 같은 요청을 두 번 보냈을 때 이렇게 갈린다.

| | 첫 요청 | 둘째 요청 이후 |
|---|---|---|
| 기본(permanent) | Override | Override (계속) |
| `{ once: true }` | One-time | initial의 응답 (복귀) |

### one-time이 유용한 곳 — 재시도 로직 테스트

`{ once: true }`의 전형적 쓰임은 "첫 요청은 실패, 재시도하면 성공"을 재현하는 것이다. 재시도(retry) 로직을 가진 코드가 첫 실패 뒤 정말로 다시 요청해 결국 성공 경로로 들어가는지 검증할 때, 실패 응답을 one-time으로 한 번만 깔아두면 첫 시도는 실패하고 두 번째 시도는 자연히 정상(initial) 응답을 받아 성공한다. 한 테스트 안에서 "실패했다가 회복"을 시간축으로 연출할 수 있는 것이다.

---

## 종합

`.use()` 오버라이드의 기본 수명은 **permanent(영구)** — 청소되기 전까지 매칭되는 모든 요청에 계속 적용된다. 딱 한 번만 적용하려면 핸들러에 `{ once: true }`를 주며, 이 one-time 오버라이드는 첫 요청에 쓰인 뒤 소진되어 이후 요청은 initial 응답으로 돌아간다. 비유하면 permanent는 벽에 붙여둔 안내문(계속 읽힘)이고, one-time은 한 명에게만 건네는 쪽지(전달되면 사라짐)다 — "첫 요청은 실패, 재시도는 성공" 같은 재시도 테스트에 쪽지 쪽이 제격이다.

---

# 개별 테스트에서 `.use()`로 추가한 오버라이드가 다른 테스트로 새지 않게 청소하려면 어떤 메서드를 호출하며, 그 메서드는 무엇을 제거하는가?

## 도입

`.use()`의 기본 오버라이드가 영구라는 사실은 테스트 격리에 함정을 만든다. 어떤 테스트가 `server.use(...)`로 동작을 바꿔놓고 청소하지 않으면, 그 오버라이드가 다음 테스트에도 그대로 남아 엉뚱한 결과를 낸다 — 이른바 "테스트 오염(leak)"이다. A 테스트에서 깐 500 에러 핸들러가 살아남아, 그것과 무관한 B 테스트가 갑자기 500을 받는 식이다.

이 질문은 그 오염을 막는 청소 도구 — 어떤 메서드로, 무엇을 제거하는지를 다룬다.

---

## 본문

### `.resetHandlers()` — runtime 핸들러를 걷어낸다

> You can remove any request handlers added via `.use()` at any point in time by calling the `.resetHandlers()` method on the same worker/server object that called `.use()`. This is particularly useful to clean up any runtime request handlers introduced in individual tests so they don't affect unrelated tests.

"`.use()`로 추가한 핸들러는, `.use()`를 호출했던 **바로 그** worker/server 객체에서 `.resetHandlers()`를 부르면 언제든 제거할 수 있다. 이는 개별 테스트에서 들여온 런타임 핸들러를 청소해 무관한 테스트에 영향을 주지 않게 하는 데 특히 유용하다."

두 가지가 핵심이다.

- **같은 객체에서 불러야 한다** — `server.use(...)`로 얹었으면 `server.resetHandlers()`로 걷는다. `.use()`를 부른 그 객체가 자기가 얹은 runtime 핸들러들을 기억하고 있다가 리셋 때 떼어낸다.
- **제거 대상은 runtime 핸들러뿐** — 인자 없는 `.resetHandlers()`는 `.use()`로 추가된 것들만 제거하고, 셋업 때 준 initial 핸들러는 손대지 않는다. 그래서 리셋 후엔 "깨끗한 기본 상태"로 돌아간다.

### 표준 패턴 — `afterEach`에서 리셋

그래서 관용적으로 매 테스트가 끝날 때마다 리셋을 건다.

```js
afterEach(() => server.resetHandlers())
```

각 테스트가 자기 안에서 무슨 오버라이드를 얹었든, 끝나는 순간 runtime 핸들러가 모두 걷혀 initial만 남은 상태로 초기화된다. 다음 테스트는 이전 테스트의 흔적 없는 깨끗한 판에서 시작하므로 테스트 격리가 보장된다.

### 곁가지 — `.restoreHandlers()`와의 차이

이름이 비슷한 `.restoreHandlers()`가 있는데 역할이 다르다. 이것은 **소진된(exhausted) one-time 핸들러를 되살린다** — 즉 `{ once: true }`로 이미 쓰여서 소진 표시된 핸들러의 소진 표시를 풀어 다시 매칭 대상으로 만든다.

혼동 포인트를 못 박아두면.

- `.resetHandlers()` — runtime 핸들러를 **제거**한다.
- `.restoreHandlers()` — 소진된 one-time 핸들러의 소진 표시를 **풀어 되살린다**.

그리고 순서가 중요하다. `resetHandlers()`로 이미 **제거해버린** 핸들러는 배열에서 사라졌으므로 `restoreHandlers()`가 되살릴 대상 자체가 없다. restore는 "소진되었지만 아직 배열에 남아 있는" 핸들러에만 통한다.

---

## 종합

개별 테스트의 오버라이드가 새지 않게 하려면 `.use()`를 호출한 **같은** worker/server 객체에서 `.resetHandlers()`를 부르며, 인자 없이 부르면 `.use()`로 추가된 runtime 핸들러만 제거하고 initial은 남긴다 — 보통 `afterEach(() => server.resetHandlers())`로 매 테스트 후 초기화해 격리를 확보한다. 비유하면 인자 없는 리셋은 "책상 위에 임시로 올려둔 메모만 치우기"다 — 기본 서류(initial)는 그대로 남는다. 이름이 닮은 `.restoreHandlers()`는 제거가 아니라 소진된 one-time 핸들러를 되살리는 것이라 역할이 다르다.
