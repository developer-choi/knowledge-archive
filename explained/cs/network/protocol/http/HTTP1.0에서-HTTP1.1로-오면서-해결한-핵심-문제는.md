# HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?

> In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.
> In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests (i.e. of HTML pages, frames, images, scripts, stylesheets, etc.).
> HTTP/1.1 communications therefore experience less latency as the establishment of TCP connections presents considerable overhead, especially under high traffic conditions.

---

**도입**

HTML 한 페이지를 표시하려면 보통 수십 개의 리소스(CSS, JS, 이미지, 폰트)가 필요합니다. HTTP/1.0 시절에는 이 리소스 하나당 TCP 연결을 새로 열고 닫았는데, 이게 매우 비효율적이었습니다. HTTP/1.1은 한 번 연결한 TCP를 여러 요청에 재사용할 수 있게 해서 이 문제를 해결했습니다.

---

**본문**

> In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.

HTTP/1.0에서는 리소스 요청마다 같은 서버로 별도의 TCP 연결을 만든다.

- **separate TCP connection**: 매번 새 TCP 소켓을 열어야 한다는 뜻. 3-way handshake(SYN → SYN-ACK → ACK)를 매번 수행.
- **for every resource request**: 이미지 1개, CSS 1개, JS 1개마다 따로 연결. HTML 안에 이미지 10개가 있으면 11번 열고 닫습니다.

> In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests (i.e. of HTML pages, frames, images, scripts, stylesheets, etc.).

HTTP/1.1에서는 대신 하나의 TCP 연결을 여러 리소스 요청에 재사용할 수 있다.

- **reused**: 한번 만든 연결을 닫지 않고 다음 요청에 또 씀. 이 동작을 가능하게 하는 메커니즘이 keep-alive(persistent connection).
- **multiple resource requests**: HTML, 이미지, CSS, JS 등 여러 리소스를 같은 연결로 받습니다. 단, HTTP/1.1에서는 한 번에 하나씩 순차적으로 주고받아야 합니다(HTTP/2부터 멀티플렉싱).

> HTTP/1.1 communications therefore experience less latency as the establishment of TCP connections presents considerable overhead,

HTTP/1.1 통신은 TCP 연결 수립이 상당한 오버헤드를 갖기 때문에 더 적은 지연을 경험한다.

- **less latency**: 사용자가 체감하는 응답 시간이 짧아집니다. 페이지 로드가 빨라지는 직접적 효과.
- **establishment of TCP connections**: TCP 3-way handshake. 서버가 멀리 있을수록 RTT(왕복 시간)가 커지므로 매번 handshake하면 그만큼 손해.
- **considerable overhead**: 단순 데이터 전송 시간 외에 추가로 드는 시간. 한국에서 미국 서버까지 RTT가 150ms라면 handshake에만 150ms를 쓰는 셈.

> especially under high traffic conditions.

특히 고트래픽 환경에서.

- **high traffic**: 요청 수가 많을수록 연결 재사용의 이득이 누적됩니다. 100개의 요청 = 100번 handshake 절약.

---

**종합**

HTTP/1.0과 HTTP/1.1의 연결 처리 비교:

| 항목 | HTTP/1.0 | HTTP/1.1 |
|---|---|---|
| TCP 연결 | 요청마다 새로 | 한 번 만들어 재사용 |
| handshake 횟수 | 리소스 수만큼 | 1회 (또는 동시 6개 등 제한 내) |
| TCP slow-start | 매번 처음부터 | 워밍업된 상태 유지 |
| 연결 종료 | 매 응답 후 즉시 | keep-alive로 유지 |

브라우저에서 이미지 10개가 있는 페이지를 로드한다고 해봅시다:

- HTTP/1.0: 11번 (HTML 1 + 이미지 10) handshake + slow-start. 서버 RTT 100ms면 handshake 오버헤드만 1100ms.
- HTTP/1.1: 1번 handshake로 끝. 같은 RTT면 handshake 오버헤드 100ms로 단축.

이게 없으면 어떻게 되는가: keep-alive가 없다면 — 매 요청마다 TCP slow-start의 처음부터 시작합니다. slow-start는 네트워크 혼잡을 피하기 위해 처음에는 적은 데이터만 보내다가 점점 늘리는 방식인데, 매번 새로 연결하면 늘어난 속도를 못 써먹습니다. 연결을 재사용하면 한 번 워밍업된 상태를 그대로 활용할 수 있어 throughput이 훨씬 좋습니다.

오개념 예방: HTTP/1.1의 연결 재사용은 "한 번에 여러 요청을 보낼 수 있다"가 아니라 "하나씩 차례로 보내되 연결은 유지한다"입니다. 한 요청의 응답이 완전히 와야 다음 요청을 보낼 수 있어 head-of-line blocking이 여전히 존재합니다. 이를 극복하려고 시도된 것이 파이프라이닝(실패)이고, 근본적으로 해결한 것이 HTTP/2의 멀티플렉싱입니다.

AI Annotation 보충: HTML 안에 이미지 10개가 있으면 HTTP/1.0에서는 TCP 연결을 11번 열고 닫아야 했습니다. 브라우저가 이를 보완하려고 같은 도메인에 동시 6~8개 연결을 여는 트릭을 썼지만, 이 자체가 서버 부하를 가중시켰습니다. HTTP/1.1의 keep-alive는 이 트릭의 필요성을 줄였고, HTTP/2는 아예 트릭이 필요 없게 만들었습니다.
