# HTTP/1.0까지는 왜 요청마다 TCP 연결을 새로 맺어야 했고, HTTP/1.1의 keep-alive는 이를 어떻게 해결했는가?

> In HTTP/1.0, the TCP/IP connection should always be closed by server after a response has been sent.
> In HTTP/1.1, a keep-alive-mechanism was officially introduced so that a connection could be reused for more than one request/response.
> Such persistent connections reduce request latency perceptibly because the client does not need to re-negotiate the TCP 3-Way-Handshake connection after the first request has been sent.
> Another positive side effect is that, in general, the connection becomes faster with time due to TCP's slow-start-mechanism.

---

**도입**

앞 질문에서 HTTP/1.1이 연결을 재사용한다는 큰 그림을 봤습니다. 이번엔 그 메커니즘이 구체적으로 어떻게 동작하는지 봅니다. keep-alive는 단순히 "연결을 닫지 마"라는 약속이지만, 그 한 줄 약속이 가져오는 성능 이득은 두 가지 — handshake 회피와 slow-start 워밍업 유지입니다.

---

**본문**

> In HTTP/1.0, the TCP/IP connection should always be closed by server after a response has been sent.

HTTP/1.0에서는 서버가 응답을 보낸 뒤 항상 TCP/IP 연결을 닫아야 했다.

- **always be closed**: 예외 없이 매번. 응답 전송 직후 서버가 FIN 패킷을 보내 연결 종료.
- **by server**: 닫는 주체는 서버. 클라이언트는 다음 요청을 위해 또 새 연결을 열어야 합니다.

> In HTTP/1.1, a keep-alive-mechanism was officially introduced so that a connection could be reused for more than one request/response.

HTTP/1.1에서는 하나의 연결이 여러 요청/응답에 재사용될 수 있도록 keep-alive 메커니즘이 공식적으로 도입됐다.

- **keep-alive**: 직역하면 "살려두기". 응답 후에도 TCP 연결을 닫지 않고 다음 요청을 기다림.
- **officially introduced**: HTTP/1.0에서도 비공식 확장으로 존재했지만, HTTP/1.1에서 표준에 정식 포함. 이제 별도 헤더 없이도 기본 동작이 keep-alive.
- **more than one request/response**: 한 연결로 여러 트랜잭션. HTML 1개 + 이미지 10개 = 11개 요청을 같은 연결에서.

> Such persistent connections reduce request latency perceptibly

이러한 영속 연결(persistent connections)은 요청 지연을 눈에 띄게 줄여준다.

- **persistent connections**: keep-alive의 다른 이름. "유지되는 연결".
- **perceptibly**: 사용자가 느낄 만큼. 페이지 로딩이 0.5초 빨라지는 등 체감 가능한 차이.

> because the client does not need to re-negotiate the TCP 3-Way-Handshake connection after the first request has been sent.

왜냐하면 클라이언트가 첫 요청 이후로 TCP 3-Way-Handshake 연결을 다시 협상할 필요가 없기 때문이다.

- **re-negotiate**: 다시 협상. 매번 SYN → SYN-ACK → ACK 3단계를 반복하지 않아도 됩니다.
- **3-Way-Handshake**: TCP 연결을 시작할 때 클라이언트와 서버가 1.5 RTT(왕복) 동안 주고받는 절차. 데이터를 한 줄도 보내기 전에 시간 소비.
- **after the first request**: 첫 요청에서만 handshake. 이후 N개의 요청은 그 연결을 그냥 씀.

> Another positive side effect is that, in general, the connection becomes faster with time due to TCP's slow-start-mechanism.

또 다른 긍정적 부수 효과는 TCP의 slow-start 메커니즘 덕분에 일반적으로 연결이 시간이 갈수록 빨라진다는 것이다.

- **becomes faster with time**: 같은 연결을 오래 쓸수록 빨라집니다. 이상하게 들리지만 TCP의 동작 특성 때문입니다.
- **slow-start**: TCP가 네트워크 혼잡을 피하려고 처음에는 작은 윈도우(예: 10 패킷)로 시작해서 ACK가 올 때마다 윈도우를 키우는 방식. 매번 새 연결이면 매번 처음부터 시작 = 매번 느림.

---

**종합**

keep-alive의 두 가지 이득을 시간 단위로 보면:

| 항목 | 새 연결마다 | 재사용 (keep-alive) |
|---|---|---|
| 3-way handshake | 매번 1 RTT | 첫 1회만 |
| slow-start window | 매번 작게 시작 | 한 번 키우면 유지 |
| TLS handshake (HTTPS) | 매번 1~2 RTT 추가 | 첫 1회만 |
| 총 오버헤드 | 요청 수 N에 비례 | O(1) |

브라우저에서 keep-alive를 직접 관찰할 수 있습니다:

- Chrome DevTools Network 탭 → 요청 클릭 → Connection ID
- 같은 도메인의 여러 요청이 같은 Connection ID를 공유하면 keep-alive로 재사용된 것

```http
GET /index.html HTTP/1.1
Host: example.com
Connection: keep-alive    ← HTTP/1.1에서는 기본값, 명시 안 해도 됨
```

이게 없으면 어떻게 되는가: keep-alive가 없으면 — `<img>` 태그 10개가 있는 페이지가 11번 handshake + 11번 slow-start의 첫 단계에서 멈춘 채 시작. 한 번 워밍업된 연결의 빠른 throughput을 단 한 번도 활용 못 합니다. 사용자 입장에선 페이지가 한 번에 떠오르지 않고 이미지가 하나씩 늦게 그려지는 경험이 됩니다.

오개념 예방: keep-alive가 영원히 연결을 유지하는 건 아닙니다. 서버는 `Keep-Alive: timeout=5, max=1000` 같은 헤더로 "5초 idle하면 닫고, 최대 1000개 요청까지만 재사용"이라는 한도를 둘 수 있습니다. 한정된 서버 자원(소켓, 파일 디스크립터)을 보호하기 위함입니다.

AI Annotation 보충: HTTP/1.0에서는 비공식적으로 `Connection: Keep-Alive` 헤더로 연결 유지를 시도할 수 있었지만, 모든 서버·프록시가 지원하지 않아 신뢰성이 낮았습니다. HTTP/1.1에서 표준 동작으로 격상되어 모든 구현체가 기본으로 지원하게 되면서 비로소 의미 있게 활용 가능해졌습니다.
