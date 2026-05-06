# HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?

> HTTP is a stateless application-level protocol and it requires a reliable network transport connection to exchange data between client and server.
> In HTTP implementations, TCP/IP connections are used using well-known ports (typically port 80 if the connection is unencrypted or port 443 if the connection is encrypted).

---

**도입**

브라우저로 한 사이트의 여러 페이지를 차례로 방문하면 서버는 매번 "당신은 누구신가요?"부터 시작합니다 — HTTP 자체가 이전 요청을 기억하지 않기 때문입니다. 이게 stateless 프로토콜의 의미이고, 로그인 상태 유지 같은 게 별도 메커니즘(쿠키, 세션, JWT)을 필요로 하는 이유입니다.

---

**본문**

> HTTP is a stateless application-level protocol

HTTP는 stateless(상태 없는) 애플리케이션 수준 프로토콜이다.

- **stateless**: 서버가 이전 요청의 정보를 기억하지 않음. 각 요청은 완전히 독립적이며 자기 자신만으로 해석 가능해야 함.
- **application-level**: OSI 모델의 가장 위층. 사용자가 직접 다루는 데이터 형식과 의미를 정의.

> and it requires a reliable network transport connection to exchange data between client and server.

그리고 클라이언트와 서버 간 데이터 교환을 위해 신뢰할 수 있는 네트워크 전송 연결을 필요로 한다.

- **requires a reliable transport**: HTTP는 stateless지만 그 아래 전송 계층은 신뢰성이 있어야 함. stateless와 reliable은 별개 차원.
- **between client and server**: 양 끝점 사이. 중간 노드가 있어도 결국 최종 서버까지의 신뢰성을 가정.

> In HTTP implementations, TCP/IP connections are used using well-known ports

HTTP 구현체에서는 잘 알려진 포트로 TCP/IP 연결을 사용한다.

- **well-known ports**: 표준으로 정해진 포트. 0-1023 범위에 IANA가 등록한 포트들. HTTP는 80, HTTPS는 443.
- **TCP/IP connections**: HTTP/1.x, HTTP/2까지의 기본. HTTP/3는 UDP 기반 QUIC을 사용 (이 OA는 TCP 시대의 일반적 구현을 설명).

> (typically port 80 if the connection is unencrypted or port 443 if the connection is encrypted).

(보통 암호화되지 않은 연결은 포트 80, 암호화된 연결은 포트 443.)

- **port 80**: HTTP의 기본 포트. URL에 명시 안 하면 자동으로 80.
- **port 443**: HTTPS의 기본 포트. TLS로 암호화된 HTTP.
- **typically**: 보통. 8080, 8443 같은 비표준 포트도 가능하지만 URL에 `:8080`처럼 명시해야 함.

---

**종합**

HTTP의 두 가지 핵심 성격을 정리하면:

| 성격 | 의미 | 결과 |
|---|---|---|
| stateless | 서버가 이전 요청을 기억 안 함 | 매 요청이 독립적, 세션은 별도 메커니즘 필요 |
| 표준 포트 80/443 | 기본 포트 정해짐 | URL에 포트 생략 가능 |

stateless의 실무적 의미를 JS로 풀어보면:

```js
// 첫 요청
await fetch('/api/login', { method: 'POST', body: JSON.stringify({...}) });
// 서버는 "이 사용자가 로그인했다"는 사실을 기억하지 않음

// 두 번째 요청
await fetch('/api/me');
// 서버 입장에서 이 요청은 첫 요청과 무관. "당신은 누구신가요?"
```

서버가 같은 사용자를 인식하려면 클라이언트가 매번 자기 신원을 가져와야 합니다. 이게 쿠키, JWT, Authorization 헤더의 존재 이유입니다.

```js
await fetch('/api/me', {
  headers: { Authorization: 'Bearer eyJhbGc...' }
  //         └─ 매 요청마다 신원을 다시 알림
});
```

이게 없으면 어떻게 되는가: stateless가 아니라면 — 서버가 모든 클라이언트의 상태를 메모리에 들고 있어야 하므로, 동시 사용자 수 ≤ 서버 메모리 한도. stateless는 서버를 무한 확장할 수 있게 합니다(수평 확장). 한 사용자의 다음 요청이 다른 서버에 가도 상관없음 — 매 요청이 자기 완결적이기 때문.

오개념 예방: "HTTP는 stateless니까 세션을 유지할 수 없다"는 잘못된 이해입니다. HTTP 자체는 상태를 유지하지 않지만, 그 위 애플리케이션 레벨에서 쿠키나 토큰으로 세션을 만들 수 있습니다. MDN의 표현이 정확합니다 — "HTTP is stateless, but not sessionless". 프로토콜 레벨에서 stateless이지만 세션은 가능합니다.

AI Annotation 보충: 로그인 상태를 유지하려면 쿠키(`Cookie: sessionId=...`), JWT(`Authorization: Bearer ...`), 또는 hidden form 변수 같은 별도 메커니즘이 필요합니다. 이는 HTTP가 제공하는 기능이 아니라 그 위에서 만들어낸 것 — 이 구분이 stateless 이해의 핵심입니다.
