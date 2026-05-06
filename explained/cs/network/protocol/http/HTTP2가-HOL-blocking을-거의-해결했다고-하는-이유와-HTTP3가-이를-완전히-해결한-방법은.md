# HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?

> HTTP/3 uses QUIC + UDP transport protocols instead of TCP.
> This slightly improves the average speed of communications and avoids the occasional problem of TCP connection congestion that can temporarily block or slow down the data flow of all its streams (another form of "head of line blocking").

---

**도입**

HTTP/2가 HOL(Head-of-Line) blocking을 "거의" 해결했다는 표현이 묘하게 들립니다. 아예 해결한 게 아니라 거의? 답은 HOL이 두 계층에서 일어난다는 데 있습니다 — 애플리케이션 계층(HTTP)과 전송 계층(TCP). HTTP/2는 전자만 풀었고, 후자는 TCP 자체의 한계라 HTTP/3가 TCP를 버리며 풀었습니다.

---

**본문**

> HTTP/3 uses QUIC + UDP transport protocols instead of TCP.

HTTP/3는 TCP 대신 QUIC + UDP 전송 프로토콜을 사용한다.

- **instead of TCP**: 30년간 HTTP의 기반이던 TCP를 교체. 이게 HTTP/3의 가장 큰 변화이자 HOL을 마저 풀 수 있게 된 이유.
- **QUIC + UDP**: UDP는 신뢰성 없는 단순 전송, QUIC은 그 위에 신뢰성·암호화·흐름 제어를 직접 구현한 새 프로토콜. UDP는 단순한 운반체이고, 진짜 일은 QUIC이 합니다.

> This slightly improves the average speed of communications

이는 통신의 평균 속도를 약간 개선하고.

- **slightly improves**: 솔직한 표현. 평균적으론 큰 차이 없을 수 있지만, 특정 상황(고손실 네트워크)에서 큰 효과.
- **average speed**: 평균 속도. handshake 단축(QUIC은 0-RTT 가능), 연결 마이그레이션(IP 바뀌어도 연결 유지) 등도 기여.

> and avoids the occasional problem of TCP connection congestion that can temporarily block or slow down the data flow of all its streams (another form of "head of line blocking").

가끔 발생하는 TCP 연결 혼잡 문제 — 모든 스트림의 데이터 흐름을 일시적으로 막거나 느리게 할 수 있는 — 를 회피한다(또 다른 형태의 "head of line blocking").

- **TCP connection congestion**: TCP의 흐름 제어가 작동하면서 패킷 유실 시 재전송을 기다리는 동안 그 연결의 모든 스트림이 멈추는 현상.
- **temporarily block or slow down all its streams**: HTTP/2의 핵심 — 한 연결에 여러 스트림이 있죠. TCP는 패킷 하나가 유실되면 그 연결 전체가 그 패킷이 재전송될 때까지 진행을 못 합니다. 스트림 1의 패킷이 유실되면, 무관한 스트림 2~N도 모두 대기.
- **another form of "head of line blocking"**: 이게 TCP 계층의 HOL입니다. 애플리케이션 계층의 HOL과 다른 위치에서 발생.

---

**종합**

HOL blocking이 두 계층에서 일어나는 그림을 정리하면:

| 계층 | 위치 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|---|
| 애플리케이션 (HTTP) | 요청-응답 큐 | 직렬 처리, 첫 응답 느리면 뒤도 대기 | 멀티플렉싱으로 해결 | 해결 (HTTP/2 동일) |
| 전송 (TCP/QUIC) | 패킷 재전송 | 1 연결 = 1 스트림이라 큰 영향 없음 | TCP HOL 발생 (스트림 N개가 있어도 1 패킷 손실 = 모두 대기) | QUIC이 스트림별 독립 처리 |

구체적인 시나리오로 이해해 봅니다:

HTTP/2 + TCP에서 한 연결에 5개 스트림이 진행 중일 때, 스트림 3의 패킷 하나가 네트워크에서 유실됐다고 합시다. TCP는 "패킷 순서가 깨졌다"를 감지하고 재전송될 때까지 기다립니다 — 그동안 스트림 1, 2, 4, 5의 패킷이 도착해 있어도 OS의 TCP 스택이 애플리케이션에 전달하지 않습니다. 모든 스트림이 함께 멈춥니다.

HTTP/3 + QUIC에서는 스트림이 QUIC 레이어에서 독립적으로 관리됩니다. 스트림 3의 패킷이 유실되어도 스트림 1, 2, 4, 5의 패킷은 즉시 애플리케이션에 전달됩니다 — 스트림 3만 자기 패킷의 재전송을 기다릴 뿐.

이게 없으면 어떻게 되는가: TCP HOL이 그대로 남았다면 — 모바일 네트워크처럼 패킷 손실이 잦은 환경에서 HTTP/2의 멀티플렉싱 이점이 크게 줄어들었을 것입니다. 한 패킷 손실이 사용자에게 "사이트가 잠깐 얼었다"로 체감되죠. HTTP/3가 모바일·고손실 환경에서 특히 빠른 이유입니다.

오개념 예방: HTTP/2의 멀티플렉싱이 잘못 설계된 게 아닙니다. 애플리케이션 계층에서 할 수 있는 건 다 한 것이고, 남은 문제는 TCP라는 OS 커널의 통신 메커니즘 자체의 구조적 한계였습니다. TCP는 1980년대 설계 시점에 "한 연결 = 한 데이터 스트림"을 가정했기 때문에 멀티스트림을 자연스럽게 지원할 수 없습니다.

AI Annotation 보충: HTTP/3가 UDP를 선택한 또 다른 이유는 OS 커널 의존도를 낮추기 위함입니다. TCP는 OS 일부라 업데이트가 느린 반면, QUIC은 사용자 공간에서 동작하는 라이브러리로 구현 가능 — Chrome, Firefox 등이 자체 QUIC 구현을 빠르게 발전시킬 수 있습니다.
