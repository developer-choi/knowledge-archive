# HTTP/2가 HTTP/1.1 대비 개선한 점은?

> HTTP/2 adds support for:
> a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space;
> a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections;
> one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets to almost solve the problem of the HOLB (head-of-line blocking);
> a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).

---

**도입**

HTTP/2는 HTTP/1.1의 한계 4가지를 한꺼번에 해결한 큰 도약입니다 — 텍스트 헤더의 비효율, 도메인당 다중 연결, HOL blocking, 그리고 서버에서 먼저 데이터를 보낼 수 없는 단방향 모델. 각각이 어떤 개선인지 하나씩 봅니다.

---

**본문**

> HTTP/2 adds support for: a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space;

HTTP/2는 텍스트 대신 메타데이터(HTTP 헤더)의 압축된 바이너리 표현을 지원해, 헤더가 훨씬 적은 공간을 차지하도록 했다.

- **compressed binary representation**: 헤더를 바이너리로 인코딩하고 HPACK 알고리즘으로 압축. 같은 헤더가 반복될 때 인덱스로 참조해 재전송 안 함.
- **instead of a textual one**: HTTP/1.1은 헤더가 ASCII 텍스트(`Content-Type: application/json` 그대로). 사람이 읽기는 쉽지만 매 요청마다 같은 헤더가 반복됨.
- **much less space**: 쿠키나 User-Agent 같은 큰 헤더가 압축으로 수십~수백 바이트 절약. 모바일 환경에서 특히 큰 효과.

> a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections;

도메인당 2~8개 연결 대신, 접근한 서버 도메인마다 단일 TCP/IP 연결(보통 암호화됨)을 사용한다.

- **single connection**: 1개 연결로 충분. 멀티플렉싱이 가능해서 더 많은 연결이 필요 없습니다.
- **usually encrypted**: 사실상 HTTPS 위에서만 동작. 브라우저들이 평문 HTTP/2를 거의 지원 안 함 — 중간 노드의 간섭(파이프라이닝 실패 사례)을 피하기 위함.
- **2 to 8 TCP/IP connections**: HTTP/1.1 시절 브라우저들이 병렬성을 짜내려고 도메인당 동시 6~8 연결을 열던 관행. 서버·클라이언트 양쪽 자원 부담.

> one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets

TCP/IP 연결당 하나 이상의 양방향 스트림이 있고, HTTP 요청과 응답이 작은 패킷으로 나뉘어 전송된다.

- **bidirectional streams**: 양방향. 한 연결 안에서 클라이언트→서버, 서버→클라이언트가 동시에 가능.
- **broken down and transmitted in small packets**: 메시지를 프레임 단위로 잘게 쪼개서 전송. 여러 요청의 프레임을 인터리브(섞어서)해서 보낼 수 있음.

> to almost solve the problem of the HOLB (head-of-line blocking);

이를 통해 HOLB(head-of-line blocking) 문제를 거의 해결했다.

- **almost solve**: "거의" 해결. 애플리케이션 계층의 HOL은 풀었지만 TCP 계층의 HOL은 남아있어 — HTTP/3가 이를 마저 해결.
- **head-of-line blocking**: 큐의 맨 앞이 막히면 뒤가 못 진행하는 현상. HTTP/1.1에선 첫 응답이 느리면 뒤따르는 응답 모두 대기. HTTP/2에선 스트림이 독립적이라 한 스트림이 느려도 다른 스트림은 진행.

> a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).

서버 푸시 기능을 통해 서버 애플리케이션이 새 데이터가 있을 때마다 클라이언트에게 보낼 수 있도록 했다(클라이언트가 폴링 방식으로 주기적으로 서버에 요청하지 않아도 됨).

- **push capability**: 서버가 클라이언트의 명시적 요청 없이 데이터를 보냄. HTML 보내면서 그 안에 있는 CSS·JS도 함께 푸시 가능.
- **whenever new data is available**: 폴링과 달리 즉시. 클라이언트가 "지금 새 거 있어?"를 반복 물어볼 필요 없음.
- **polling methods**: HTTP/1.1 시절의 우회법. 클라이언트가 주기적으로(예: 1초마다) 서버에 새 데이터를 묻는 방식. 비효율적.

---

**종합**

HTTP/2의 4가지 개선을 한눈에:

| 개선 | HTTP/1.1 | HTTP/2 | 효과 |
|---|---|---|---|
| 헤더 형식 | ASCII 텍스트 | HPACK 바이너리 압축 | 트래픽 절감 |
| 연결 수 | 도메인당 6~8개 | 도메인당 1개 | 자원 절약 |
| 동시성 | 직렬 (or 실패한 파이프라이닝) | 다중 스트림 멀티플렉싱 | HOL blocking 해소 |
| 푸시 | 폴링으로 우회 | Server Push | 즉시 전달 |

Chrome DevTools에서 직접 관찰할 수 있는 차이:

- HTTP/1.1 사이트: 같은 도메인 요청들의 Connection ID가 6~8개로 분산
- HTTP/2 사이트: 같은 도메인 요청 모두가 같은 Connection ID 공유. Network 탭의 Waterfall이 훨씬 짧아짐
- 헤더 크기: DevTools에서 "Headers"의 size가 HTTP/2에서 작게 표시됨

이게 없으면 어떻게 되는가: HTTP/2의 멀티플렉싱이 없었다면 — 큰 페이지(이미지·CSS·JS 100개)가 있는 사이트는 여전히 도메인당 8 연결의 한계로 직렬 처리 병목. 도메인 샤딩(`cdn1.example.com`, `cdn2.example.com`으로 분산) 같은 우회 기법이 여전히 필요했을 것이고, 이는 HTTPS 인증서 비용과 DNS 조회 추가 부담을 만들었을 것입니다.

오개념 예방: 서버 푸시는 좋아 보이지만 실제로는 거의 사장됐습니다. 클라이언트 캐시와 충돌이 잦고(이미 캐시된 리소스를 또 푸시), 효과 측정이 어려워 Chrome 등 주요 브라우저가 지원을 제거했습니다. 대신 `<link rel="preload">` 같은 힌트로 클라이언트가 주도하는 방식이 표준이 됐습니다.

AI Annotation 보충: HTTP/1.1에서 브라우저가 같은 서버에 동시에 6~8 TCP 연결을 열었던 건 병렬성을 흉내내려는 강박이었습니다. HTTP/2의 단일 연결 + 멀티플렉싱은 같은 효과를 더 우아하게 달성하면서 서버 자원 부담도 줄였습니다.
