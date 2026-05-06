# HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?

> HTTP is a request-response protocol in the client-server model.
> A transaction starts with a client submitting a request to the server, the server attempts to satisfy the request and returns a response to the client that describes the disposition of the request and optionally contains a requested resource such as an HTML document or other content.

---

**도입**

`fetch('/api/users')` 한 줄을 실행하면 일어나는 일을 떠올려 보세요. 클라이언트(브라우저)가 무언가를 보내고, 서버가 답을 돌려줍니다. 이 단순한 1:1 교환이 HTTP의 통신 모델입니다. 더 복잡한 양방향 스트림이 아니라 "요청 → 응답" 한 쌍이 단위입니다.

---

**본문**

> HTTP is a request-response protocol in the client-server model.

HTTP는 클라이언트-서버 모델에서의 요청-응답 프로토콜이다.

- **request-response**: 한 쌍이 단위입니다. 요청 1개에 응답 1개. WebSocket의 양방향 자유 메시지 교환과는 다른 구조.
- **client-server model**: 역할이 비대칭입니다. 항상 클라이언트(브라우저)가 먼저 말을 걸고, 서버는 듣고 답하는 입장. 서버가 먼저 클라이언트에게 말을 걸 수 없습니다.

> A transaction starts with a client submitting a request to the server,

트랜잭션은 클라이언트가 서버에 요청을 보내는 것으로 시작한다.

- **transaction**: 요청-응답 한 쌍을 묶어 부르는 단위. DevTools Network 탭의 한 줄이 보통 한 트랜잭션입니다.
- **starts with a client**: 시작점이 항상 클라이언트입니다. 이게 없으면 서버는 클라이언트가 무엇을 원하는지 알 수 없어 아무것도 못 합니다.

> the server attempts to satisfy the request

서버는 요청을 만족시키려 시도한다.

- **attempts**: "시도"라는 단어가 중요합니다 — 항상 성공하는 게 아니라 실패할 수도 있습니다. 그래서 응답에 상태 코드(200, 404, 500 등)가 필요한 것.
- **satisfy**: 요청이 원하는 리소스를 찾고, 처리하고, 결과를 만드는 과정. 단순 파일 반환부터 DB 조회·계산까지 모든 게 여기 들어갑니다.

> and returns a response to the client that describes the disposition of the request

요청의 처리 결과(disposition)를 기술하는 응답을 클라이언트에게 반환한다.

- **disposition**: "처리 결과의 성격". 성공/실패/리다이렉트인지 등 상태 코드(2xx, 3xx, 4xx, 5xx)로 표현됩니다.
- **describes**: 응답은 단순 데이터 덩어리가 아니라 "이 요청이 어떻게 처리됐다"라는 설명을 함께 담습니다.

> and optionally contains a requested resource such as an HTML document or other content.

선택적으로 요청된 리소스(HTML 문서나 기타 콘텐츠)를 포함한다.

- **optionally**: 본문(body)은 있을 수도 없을 수도 있습니다. `204 No Content`나 `304 Not Modified`는 본문이 비어 있습니다.
- **HTML document or other content**: HTML뿐 아니라 JSON, 이미지, 비디오 등 어떤 형식이든 가능. `Content-Type` 헤더로 종류를 알립니다.

---

**종합**

HTTP 트랜잭션의 4가지 구성 요소를 묶으면:

| 단계 | 주체 | 내용 |
|---|---|---|
| 1. 요청 시작 | 클라이언트 | 메서드 + 경로 + 헤더 + (옵션) 본문 |
| 2. 처리 시도 | 서버 | 라우팅, DB 조회, 비즈니스 로직 |
| 3. 응답 반환 | 서버 | 상태 코드 + 헤더 + (옵션) 본문 |
| 4. 트랜잭션 종료 | 양쪽 | 연결은 유지될 수도, 닫힐 수도 |

JS 코드와 매핑하면:

```js
const res = await fetch('/api/users', { method: 'GET' });
//          └── 1: 클라이언트가 GET 요청 송신 (서버는 시도 → 응답 생성)
console.log(res.status);     // 3: disposition (예: 200)
const data = await res.json(); // 3: 본문 (요청된 리소스)
```

오개념 예방: "HTTP는 양방향 통신이다"는 잘못된 이해입니다. 정확히는 "클라이언트가 시작하는 단방향 요청에 서버가 답하는 구조"입니다. 서버가 클라이언트에게 먼저 데이터를 밀어넣고 싶다면 별도 메커니즘(SSE, WebSocket, HTTP/2 Server Push)이 필요합니다 — Official Annotation이 "It is never the server"라고 못박는 이유가 이 때문입니다.

이게 없으면 어떻게 되는가: 만약 트랜잭션 단위가 아니라 자유 양방향 스트림이었다면, 서버가 처리 중인 요청과 클라이언트가 새로 보낸 요청을 어떻게 묶을지 별도 식별자가 필요했을 것입니다. 요청-응답 1:1 모델은 그런 복잡도 없이도 통신을 추적 가능하게 해줍니다 — 이 단순함이 HTTP가 30년 넘게 표준으로 살아남은 이유 중 하나입니다.

Official Annotation 보충: 클라이언트와 서버는 "스트림이 아닌 개별 메시지"를 교환합니다. 이 메시지 단위 특성이 stateless 설계의 구조적 기반입니다 — 메시지 하나마다 자기 자신만으로 완결되어야 한다는 제약이 stateless를 가능하게 합니다.
