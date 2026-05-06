# TCP/IP 모델에서 TLS는 어느 계층에서 동작하며, HTTP 메시지를 어떻게 처리하는가?

> HTTP operates at the highest layer of the TCP/IP model—the application layer; as does the TLS security protocol (operating as a lower sublayer of the same layer), which encrypts an HTTP message prior to transmission and decrypts a message upon arrival.
> Strictly speaking, HTTPS is not a separate protocol, but refers to the use of ordinary HTTP over an encrypted SSL/TLS connection.
> HTTPS encrypts all message contents, including the HTTP headers and the request/response data.

---

**도입**

OSI 7계층 모델에는 보안 계층이 따로 있지만, 인터넷에서 실제 쓰이는 TCP/IP 4계층 모델에는 보안 계층이 없습니다. 그럼 TLS는 어디 들어갈까요? 답은 — 애플리케이션 계층 안에 sublayer(하위 계층)로 끼어들어가 HTTP 메시지를 감싸는 형태입니다. HTTP는 자기 형식 그대로, TLS가 그 위에 암호화 래핑.

---

**본문**

> HTTP operates at the highest layer of the TCP/IP model—the application layer;

HTTP는 TCP/IP 모델의 가장 위층 — 애플리케이션 계층에서 동작한다.

- **highest layer of the TCP/IP model**: TCP/IP 4계층 중 가장 위. 사용자 애플리케이션이 직접 다루는 계층.
- **application layer**: 애플리케이션 계층. HTTP, FTP, SMTP, DNS 등 모든 애플리케이션 프로토콜이 여기에.

> as does the TLS security protocol (operating as a lower sublayer of the same layer),

TLS 보안 프로토콜도 마찬가지로 (같은 계층의 하위 sublayer로 동작).

- **as does**: HTTP와 같이. TLS도 애플리케이션 계층에 위치.
- **lower sublayer of the same layer**: 같은 계층(애플리케이션)의 하위 sublayer. 별도 계층이 아니라 애플리케이션 계층 안에서 더 아래쪽.

> which encrypts an HTTP message prior to transmission and decrypts a message upon arrival.

(TLS는) 전송 전에 HTTP 메시지를 암호화하고 수신 시 메시지를 복호화한다.

- **encrypts prior to transmission**: 전송 전 암호화. HTTP가 만든 메시지를 TLS가 가로채 암호화한 뒤 TCP로 넘김.
- **decrypts upon arrival**: 수신 시 복호화. 받은 암호문을 TLS가 평문으로 풀어 HTTP에게 전달.

> Strictly speaking, HTTPS is not a separate protocol, but refers to the use of ordinary HTTP over an encrypted SSL/TLS connection.

엄격히 말해 HTTPS는 별도 프로토콜이 아니라, 암호화된 SSL/TLS 연결 위에서 일반 HTTP를 사용하는 것을 가리킨다.

- **not a separate protocol**: 별도 프로토콜이 아님. 새 표준 RFC를 만든 게 아니라 HTTP+TLS 조합의 별명.
- **ordinary HTTP**: 일반 HTTP. HTTPS의 HTTP 부분은 평소 HTTP와 동일 — 메서드, 헤더, 상태 코드 모두 그대로.
- **over an encrypted SSL/TLS connection**: 암호화된 SSL/TLS 연결 위에서. 채널만 암호화 구간.

> HTTPS encrypts all message contents, including the HTTP headers and the request/response data.

HTTPS는 HTTP 헤더와 요청/응답 데이터를 포함한 모든 메시지 내용을 암호화한다.

- **all message contents**: 모든 메시지 내용. 헤더와 본문 모두.
- **including the HTTP headers**: 헤더도 포함. 쿠키, Authorization 토큰, URL 경로 등이 모두 암호화 — 평문 HTTP에선 누구나 볼 수 있는 정보가 보호됨.

---

**종합**

TCP/IP 모델에서 TLS의 위치를 그림으로:

```
┌──────────────────────────────┐
│   Application Layer          │
│   ┌────────────────────────┐ │
│   │   HTTP                 │ │  ← 메시지 작성
│   ├────────────────────────┤ │
│   │   TLS sublayer         │ │  ← HTTP 메시지 암호화
│   └────────────────────────┘ │
├──────────────────────────────┤
│   Transport Layer (TCP/UDP)  │  ← 신뢰성 전송
├──────────────────────────────┤
│   Internet Layer (IP)        │  ← 라우팅
├──────────────────────────────┤
│   Network Access Layer       │  ← 물리 전송
└──────────────────────────────┘
```

처리 흐름 (송신 측):

1. HTTP가 메시지 생성: `GET /api/users HTTP/1.1\r\nHost: ...`
2. TLS가 가로채서 암호화: 기존 평문 → `0x4f 0xa3 0xe8 ...` (의미 없는 바이트)
3. TCP가 받아서 패킷 단위로 분할 + 신뢰성 전송
4. IP가 라우팅
5. 네트워크 전송

수신 측은 역순:

1. 네트워크 수신
2. IP가 받아 처리
3. TCP가 재조립
4. TLS가 복호화: 암호문 → 평문 HTTP 메시지
5. HTTP가 메시지 파싱

JS 개발자가 직접 보는 것:

```js
// 보낼 때 — JS가 보는 건 평문 HTTP만. TLS는 보이지 않음
await fetch('https://api.example.com/users', {
  headers: { 'Authorization': 'Bearer secret-token' }
});
// 토큰이 평문처럼 보이지만, 네트워크에선 TLS로 암호화돼서 흘러감

// 받을 때 — DevTools Network 탭은 복호화된 평문을 표시
// 패킷 캡처 도구(Wireshark)로 보면 암호화된 바이트 덩어리만 보임
```

이게 없으면 어떻게 되는가:

- TLS sublayer가 없다면 — 모든 HTTP 메시지가 평문으로 흐름. 같은 와이파이의 누구든 비밀번호·세션 쿠키를 가로챌 수 있음.
- TLS가 별도 계층(예: 보안 계층)으로 분리됐다면 — HTTP의 메시지 구조를 바꿔야 했을 것. 애플리케이션 sublayer로 끼워 넣었기에 HTTP는 자기 형식 그대로 유지하고 TLS만 추가하면 됨 — 깔끔한 분리.

오개념 예방: HTTPS가 모든 정보를 보호하는 건 아닙니다. 헤더와 본문은 암호화되지만 — TCP/IP 패킷의 출발지·목적지 IP는 라우팅에 필요하므로 평문, 도메인명도 SNI(Server Name Indication)에서 평문으로 보입니다. 즉 "어디 서버와 통신하는지"는 도청 가능, "무엇을 주고받는지"는 보호됩니다.

또 다른 오개념: "HTTPS면 종단간 암호화(end-to-end encryption)와 같다"고 생각하기 쉽지만 — 다릅니다. HTTPS는 클라이언트-서버 간 채널 암호화이지, 종단(예: 보낸 사람-받는 사람) 사이의 암호화가 아닙니다. 서버에 도달하면 평문이 되어 서버 운영자는 모든 데이터를 볼 수 있습니다.

AI Annotation 보충: TCP/IP 모델에는 별도의 보안 계층이 없으므로, TLS는 Application Layer 내부에서 HTTP 아래 sublayer로 동작합니다. 전송 전에 HTTP 메시지를 암호화하고, 수신 시 복호화하는 래핑 역할을 합니다. HTTP 자체의 요청/응답 구조는 변하지 않으며, 아래 채널만 암호화됩니다 — 그래서 "HTTP는 TLS와 무관하게 동일하게 동작"한다고 말할 수 있습니다.
