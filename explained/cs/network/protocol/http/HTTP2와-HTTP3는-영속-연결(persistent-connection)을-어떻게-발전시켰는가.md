# HTTP/2와 HTTP/3는 영속 연결(persistent connection)을 어떻게 발전시켰는가?

> HTTP/2 extended the usage of persistent connections by multiplexing many concurrent requests/responses through a single TCP/IP connection.
> HTTP/3 does not use TCP/IP connections but QUIC + UDP.

---

**도입**

HTTP/1.1의 keep-alive는 한 연결을 닫지 않고 재사용했지만 한 번에 한 요청만 처리했습니다. 파이프라이닝은 실패했죠. HTTP/2는 한 연결 안에서 여러 요청을 동시에 다루는 멀티플렉싱으로 이 문제를 해결했고, HTTP/3는 한 발 더 나아가 TCP를 버리고 QUIC을 채택했습니다.

---

**본문**

> HTTP/2 extended the usage of persistent connections by multiplexing many concurrent requests/responses through a single TCP/IP connection.

HTTP/2는 단일 TCP/IP 연결을 통해 많은 동시 요청/응답을 멀티플렉싱함으로써 영속 연결의 활용 범위를 확장했다.

- **extended**: HTTP/1.1이 시작한 영속 연결의 개념을 더 발전시킴. 새 개념을 만든 게 아니라 기존을 확장.
- **multiplexing**: 여러 신호를 하나의 채널에 동시에 흘려보내는 기법. HTTP/2에서는 여러 요청·응답을 같은 TCP 연결 위에 독립된 "스트림"으로 동시에 보냄.
- **many concurrent**: 동시 처리 가능한 요청 수가 1개에서 수십~수백 개로 폭증. 응답 순서 제약도 없음.
- **single TCP/IP connection**: 도메인당 1개 연결로 충분. HTTP/1.1에서 브라우저가 6~8개 연결을 열던 트릭이 불필요해짐.

> HTTP/3 does not use TCP/IP connections but QUIC + UDP.

HTTP/3는 TCP/IP 연결을 쓰지 않고 QUIC + UDP를 사용한다.

- **does not use TCP/IP**: 30년간 HTTP의 기반이었던 TCP를 버림. 가장 큰 변화.
- **QUIC**: Google이 만들고 IETF가 표준화한 새 전송 프로토콜. UDP 위에 신뢰성, 흐름 제어, 암호화를 직접 구현.
- **UDP**: 비신뢰성 전송 프로토콜. 기본적으로 패킷 유실/순서 보장이 없지만, QUIC이 그 위에서 신뢰성을 만들어줍니다.

---

**종합**

HTTP 버전별 영속 연결 발전을 정리하면:

| 버전 | 연결 처리 | 동시성 | 전송 계층 |
|---|---|---|---|
| HTTP/1.0 | 요청마다 새 연결 | 1개씩 직렬 | TCP |
| HTTP/1.1 | keep-alive로 재사용 | 1개씩 직렬 (도메인당 6~8 연결로 회피) | TCP |
| HTTP/2 | 단일 연결 + 멀티플렉싱 | 한 연결에 다수 스트림 동시 | TCP |
| HTTP/3 | QUIC 연결 + 멀티플렉싱 | TCP HOL blocking까지 제거 | QUIC over UDP |

브라우저에서 직접 관찰 가능한 차이:

- Chrome DevTools Network 탭에서 Protocol 컬럼을 켜면 `http/1.1`, `h2`, `h3`로 표시됩니다
- HTTP/2(`h2`)인 사이트는 도메인당 연결이 1개로 줄어들어 Connection ID가 같아짐
- HTTP/3(`h3`)는 QUIC을 사용하므로 TCP 연결 자체가 없습니다

이게 없으면 어떻게 되는가: HTTP/2 멀티플렉싱이 없었다면 — 브라우저는 여전히 도메인당 6~8 TCP 연결을 동시에 열어야 하므로 서버 자원 점유와 RAM 사용량이 클라이언트·서버 양쪽 모두에서 컸을 것입니다. HTTP/3가 없었다면 — TCP 패킷 1개 유실로 같은 연결의 모든 스트림이 멈추는 TCP HOL blocking이 모바일·고손실 네트워크에서 큰 문제로 남았을 것입니다.

오개념 예방: HTTP/3가 UDP를 쓴다고 해서 신뢰성이 약해진 건 아닙니다. QUIC이 패킷 유실 시 재전송, 순서 재조립, 흐름 제어를 모두 처리합니다 — TCP가 OS 커널에서 하던 일을 QUIC이 애플리케이션 레이어에서 직접 합니다. 이렇게 옮긴 이유는 OS 업데이트 없이도 QUIC을 빠르게 발전시킬 수 있기 때문입니다 (TCP는 OS 커널 일부라 업데이트가 느림).

AI Annotation 보충: 같은 키워드 "persistent connection"이지만 의미는 점점 풍부해졌습니다 — HTTP/1.1에서는 "닫지 않고 재사용"의 단순 의미였고, HTTP/2부터는 "닫지 않고 + 동시에 여러 요청 처리"의 의미를 겸합니다. 발전이 누적적이라는 점이 이 시리즈의 특징입니다.
