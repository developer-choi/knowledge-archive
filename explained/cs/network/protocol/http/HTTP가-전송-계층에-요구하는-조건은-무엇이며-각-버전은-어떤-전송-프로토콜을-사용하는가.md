# HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?

> HTTP presumes an underlying and reliable transport layer protocol.
> The standard choice of the underlying protocol prior to HTTP/3 is Transmission Control Protocol (TCP).
> HTTP/3 uses a different transport layer called QUIC, which provides reliability on top of the unreliable User Datagram Protocol (UDP).

---

**도입**

HTTP는 메시지의 형식과 의미만 정합니다 — 그 메시지를 어떻게 신뢰성 있게 운반할지는 아래 계층의 일입니다. 그렇다면 HTTP가 그 아래 계층에 요구하는 조건은 무엇일까요? 이 질문이 중요한 이유는 — HTTP/3가 TCP를 버리고 QUIC을 채택할 수 있었던 근거가 바로 이 조건의 정확한 정의에 있기 때문입니다.

---

**본문**

> HTTP presumes an underlying and reliable transport layer protocol.

HTTP는 그 아래에 신뢰할 수 있는 전송 계층 프로토콜이 있다고 전제한다.

- **presumes**: 가정. HTTP 자체는 패킷이 유실되거나 순서가 뒤바뀌는 경우를 다루지 않습니다 — 아래 계층이 해줄 거라고 믿고 동작.
- **underlying**: 더 하위 계층. OSI 모델에서 HTTP(애플리케이션) 아래의 전송 계층(TCP, UDP, QUIC).
- **reliable**: 신뢰성. 데이터가 보낸 순서대로, 빠짐없이 도착해야 함. 패킷 유실 시 재전송, 순서 보장.

> The standard choice of the underlying protocol prior to HTTP/3 is Transmission Control Protocol (TCP).

HTTP/3 이전의 표준 선택은 TCP(Transmission Control Protocol)다.

- **standard choice**: 표준. HTTP/0.9부터 HTTP/2까지 모두 TCP 위에서 동작.
- **prior to HTTP/3**: HTTP/3 이전까지는. HTTP/3가 처음으로 이 관행을 깼습니다.
- **TCP**: 1980년대부터 인터넷의 신뢰성 전송 표준. 3-way handshake, 재전송, 순서 보장, 흐름 제어를 모두 제공.

> HTTP/3 uses a different transport layer called QUIC,

HTTP/3는 QUIC이라는 다른 전송 계층을 사용한다.

- **a different transport layer**: TCP가 아닌 새 전송 프로토콜. Google이 만들어 IETF가 표준화.
- **QUIC**: Quick UDP Internet Connections의 약자. UDP 위에 TCP가 제공하던 기능들을 직접 구현.

> which provides reliability on top of the unreliable User Datagram Protocol (UDP).

QUIC은 신뢰할 수 없는 UDP(User Datagram Protocol) 위에서 신뢰성을 제공한다.

- **provides reliability**: 신뢰성을 제공. QUIC이 패킷 재전송, 순서 재조립, 흐름 제어를 직접 구현.
- **on top of**: UDP 위에. UDP는 단순한 운반체로 쓰고, 그 위에 QUIC이 새 계층을 쌓아올림.
- **unreliable UDP**: 신뢰성 없는 UDP. UDP는 패킷을 보내기만 하고 도착 보장·순서 보장 안 함. 빠르지만 책임 안 짐.

---

**종합**

HTTP 버전과 전송 계층의 매핑:

| HTTP 버전 | 전송 계층 | 신뢰성 제공자 |
|---|---|---|
| HTTP/0.9 ~ HTTP/2 | TCP | OS 커널 (TCP) |
| HTTP/3 | QUIC over UDP | QUIC (사용자 공간) |

HTTP가 전송 계층에 요구하는 조건을 단순화하면 단 하나 — "메시지가 보낸 순서대로, 빠짐없이 도착할 것". 이 조건만 만족하면 무엇으로 운반하든 상관없습니다. TCP가 이걸 제공해서 오랫동안 표준이었고, HTTP/3는 같은 조건을 QUIC으로 채울 수 있다는 걸 보여줬습니다.

Official Annotation의 핵심 문장: "HTTP doesn't require the underlying transport protocol to be connection-based; it only requires it to be reliable" — HTTP는 연결 기반이어야 한다고 요구하지 않고, 신뢰성만 요구합니다. UDP는 비연결성(connectionless)이지만 그 위에 QUIC이 신뢰성을 만들어주므로 조건 충족.

이 구분이 왜 중요한가: TCP는 OS 커널의 일부라 업데이트가 느립니다 — 새 알고리즘을 추가하려면 모든 OS가 업데이트되기를 기다려야 합니다. QUIC은 사용자 공간 라이브러리로 구현 가능하므로 Chrome, Firefox 등이 자체 구현을 빠르게 발전시킬 수 있습니다. 또한 QUIC은 처음부터 멀티스트림을 가정하고 설계되어 TCP HOL blocking이 없습니다.

이게 없으면 어떻게 되는가: 만약 HTTP가 "TCP 위에서만 동작"이라고 못박았다면 — TCP HOL blocking을 풀 길이 없었습니다. HTTP가 전송 계층의 구체적 구현을 명시하지 않고 추상 조건(신뢰성)만 요구했기에 — 30년 만에 새 전송 계층으로 갈아탈 수 있었습니다. 추상화의 힘.

오개념 예방: HTTP/3가 UDP를 쓴다고 해서 "신뢰성 없는 빠른 통신"으로 오해하면 안 됩니다. UDP는 단순한 패킷 운반체이고, QUIC이 그 위에 TCP보다 더 정교한 신뢰성·암호화·흐름 제어를 구현합니다. 결과적으로 HTTP/3는 TCP보다 신뢰성이 떨어지지 않으며, 오히려 더 빠른 핸드셰이크(0-RTT)와 연결 마이그레이션 같은 부가 기능을 제공합니다.

AI Annotation 보충: TCP는 재전송과 순서 보장으로 신뢰성을 제공합니다. QUIC은 같은 책임을 지지만, 스트림 단위로 분리 처리한다는 점이 다릅니다 — 한 스트림의 패킷 손실이 다른 스트림에 영향 안 미침. 같은 "신뢰성"이지만 구현 단위가 더 세분화된 것.
