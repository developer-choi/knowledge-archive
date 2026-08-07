# HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?

## 도입

HTTP/1.0은 요청 하나에 TCP 연결 하나를 사용하고 닫았다. HTML 하나를 가져오는 데 이미지 10개가 있으면 TCP 연결을 11번 열고 닫아야 했다. 이 낭비를 해결한 것이 HTTP/1.1의 핵심이다.

---

## 본문

> In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.

"HTTP/1.0에서는 동일한 서버에 대한 모든 리소스 요청마다 별도의 TCP 연결을 만든다."

- **separate TCP connection**: TCP 연결을 새로 맺으려면 3-way handshake(SYN → SYN-ACK → ACK)가 필요하다. 시간이 걸리는 왕복 과정이다.

> In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests.

"HTTP/1.1에서는 대신 TCP 연결을 재사용하여 여러 리소스 요청을 만들 수 있다."

- **reused**: 한 번 열어둔 연결로 여러 요청을 처리한다. 이것이 persistent connection(영속 연결), 또는 keep-alive다.

> HTTP/1.1 communications therefore experience less latency as the establishment of TCP connections presents considerable overhead, especially under high traffic conditions.

"따라서 HTTP/1.1 통신은 지연이 줄어드는데, TCP 연결 확립이 상당한 오버헤드를 가져오기 때문이다 — 특히 트래픽이 높은 상황에서."

- **considerable overhead**: TCP handshake + slow-start(처음엔 느리게 보내다가 점점 속도 올리는 메커니즘). 이 오버헤드가 연결마다 반복된다면 낭비가 크다.

```
HTTP/1.0
클라이언트                    서버
TCP handshake (3번) ──────►
                     GET html ►
                             ◄── HTML 응답
연결 종료

TCP handshake (3번) ──────►
                     GET img1 ►
                             ◄── img1 응답
연결 종료
(이미지 10개면 10번 반복)

HTTP/1.1
TCP handshake (1번) ──────►
                     GET html ►
                             ◄── HTML 응답
                     GET img1 ►  (연결 유지)
                             ◄── img1 응답
                     GET img2 ►
                             ◄── img2 응답
...
```

---

## 종합

HTTP/1.1의 persistent connection은 단순해 보이지만 웹 성능에 큰 영향을 미쳤다. DevTools Network 탭에서 요청들의 Timing을 보면 첫 요청에는 "Initial connection" 시간이 있고, 이후 요청에는 없는 것을 볼 수 있다. 바로 연결 재사용 덕분이다. HTTP/2와 HTTP/3는 이를 더 발전시켜 멀티플렉싱(한 연결에서 여러 요청 동시 처리)으로 진화했다.

---
# HTTP/1.0까지는 왜 요청마다 TCP 연결을 새로 맺어야 했고, HTTP/1.1의 keep-alive는 이를 어떻게 해결했는가?

## 도입

HTTP/1.0은 응답이 끝나면 연결을 닫는 것이 기본이었다. 이것은 명세가 그렇게 설계됐기 때문이다. HTTP/1.1은 이 기본값을 뒤집어 연결을 유지하는 것이 기본이 되었다.

---

## 본문

> In HTTP/1.0, the TCP/IP connection should always be closed by server after a response has been sent.

"HTTP/1.0에서는 응답이 전송된 후 서버가 항상 TCP/IP 연결을 닫아야 했다."

- **should always be closed**: 명세의 의도적인 설계다. 단순하게 만들기 위해 상태를 유지하지 않고, 요청-응답 후 연결을 끊었다.

> In HTTP/1.1, a keep-alive-mechanism was officially introduced so that a connection could be reused for more than one request/response.

"HTTP/1.1에서는 keep-alive 메커니즘이 공식적으로 도입되어 연결이 하나 이상의 요청/응답에 재사용될 수 있게 됐다."

- **officially introduced**: HTTP/1.0에서 `Connection: keep-alive` 헤더를 비공식적으로 쓰는 경우가 있었지만, HTTP/1.1에서 공식 명세가 됐다.

> Such persistent connections reduce request latency perceptibly because the client does not need to re-negotiate the TCP 3-Way-Handshake connection after the first request has been sent.

"이런 영속 연결은 요청 지연을 눈에 띄게 줄인다 — 첫 번째 요청 이후 클라이언트가 TCP 3-Way-Handshake 연결을 다시 협상할 필요가 없기 때문이다."

- **perceptibly**: "눈에 띄게" — 사용자가 체감할 수 있을 정도의 차이다.
- **re-negotiate the TCP 3-Way-Handshake**: SYN → SYN-ACK → ACK. 왕복이 필요하므로 서울-미국 서버 기준으로 왕복 150ms 이상이 걸린다. 이것을 매 요청마다 반복하면 크게 느려진다.

> Another positive side effect is that, in general, the connection becomes faster with time due to TCP's slow-start-mechanism.

"또 다른 긍정적인 부작용은, 일반적으로 TCP의 slow-start 메커니즘으로 인해 시간이 지남에 따라 연결이 더 빨라진다는 것이다."

- **slow-start**: TCP가 처음 연결할 때는 적은 양의 데이터부터 보내기 시작하여 점차 전송량을 늘리는 메커니즘이다. 연결을 유지하면 이미 "워밍업"된 연결을 계속 쓸 수 있다.

---

## 종합

HTTP/1.1의 기본이 "연결 유지"가 된 덕분에, 오늘날 HTML + 수십 개의 리소스를 불러오는 페이지도 연결 오버헤드를 최소화할 수 있다. `Connection: close` 헤더를 명시하지 않으면 HTTP/1.1에서 연결은 기본으로 유지된다. DevTools에서 같은 서버의 여러 요청이 동일한 "Connection ID"를 공유하는 것을 볼 수 있다면 keep-alive가 동작하는 것이다.

---
# HTTP/1.1의 파이프라이닝은 어떤 최적화를 시도했고, 왜 실패했는가?

## 도입

keep-alive로 연결을 재사용하게 됐지만, 여전히 한 번에 하나의 요청-응답만 처리했다. 파이프라이닝은 응답을 기다리지 않고 여러 요청을 연달아 보내는 최적화를 시도했다. 좋은 아이디어였지만 현실의 벽에 부딪혔다.

---

## 본문

> HTTP/1.1 added also HTTP pipelining in order to further reduce lag time when using persistent connections by allowing clients to send multiple requests before waiting for each response.

"HTTP/1.1은 영속 연결을 사용할 때 지연 시간을 더욱 줄이기 위해 HTTP 파이프라이닝을 추가하여, 클라이언트가 각 응답을 기다리기 전에 여러 요청을 보낼 수 있게 했다."

- **multiple requests before waiting for each response**: 요청 1을 보내고 → 응답 1을 기다리는 동안 → 요청 2도 보내버리는 방식이다. 이론상 응답 대기 시간이 줄어든다.

> This optimization was never considered really safe because a few web servers and many proxy servers, specially transparent proxy servers placed in Internet / Intranets between clients and servers, did not handle pipelined requests properly.

"이 최적화는 결코 진정으로 안전하다고 여겨지지 않았는데, 일부 웹 서버와 많은 프록시 서버, 특히 클라이언트와 서버 사이의 인터넷/인트라넷에 배치된 투명 프록시 서버들이 파이프라인 요청을 제대로 처리하지 못했기 때문이다."

- **transparent proxy servers**: 클라이언트가 인식하지 못하는 중간 프록시들. 이 프록시들이 파이프라이닝을 지원하지 않아 요청을 무시하거나 순서를 뒤섞었다.

> (they served only the first request discarding the others, they closed the connection because they saw more data after the first request or some proxies even returned responses out of order etc.)

"(첫 번째 요청만 처리하고 나머지를 버리거나, 첫 번째 요청 후에 더 많은 데이터가 오는 것을 보고 연결을 닫거나, 심지어 일부 프록시는 응답을 순서에 맞지 않게 반환하기도 했다.)"

> After many years of struggling with the problems introduced by enabling pipelining, this feature was first disabled and then removed from most browsers also because of the announced adoption of HTTP/2.

"파이프라이닝 활성화로 생긴 문제들과 수년간 씨름한 끝에, 이 기능은 HTTP/2 채택이 발표된 것도 있어 대부분의 브라우저에서 먼저 비활성화되다가 제거됐다."

---

## 종합

파이프라이닝의 실패 이유는 기술적 결함이 아니라 현실의 프록시/서버 호환성 문제였다. HTTP/2의 멀티플렉싱이 파이프라이닝의 목표(동시 여러 요청)를 훨씬 안정적인 방식으로 달성하면서 파이프라이닝은 역사 속으로 사라졌다. 파이프라이닝과 달리 멀티플렉싱은 각 요청을 독립적인 스트림으로 처리하므로 앞의 요청이 뒤를 막지 않는다.

---
# HTTP/2와 HTTP/3는 영속 연결(persistent connection)을 어떻게 발전시켰는가?

## 도입

HTTP/1.1의 keep-alive는 하나의 연결로 여러 요청을 처리했지만, 여전히 순서대로 처리해야 했다. HTTP/2는 한 연결에서 동시에 처리하는 멀티플렉싱을 도입했고, HTTP/3는 TCP 자체를 바꿔버렸다.

---

## 본문

> HTTP/2 extended the usage of persistent connections by multiplexing many concurrent requests/responses through a single TCP/IP connection.

"HTTP/2는 단일 TCP/IP 연결을 통해 많은 동시 요청/응답을 멀티플렉싱함으로써 영속 연결의 사용을 확장했다."

- **multiplexing**: 한 연결 안에 여러 독립적인 스트림을 동시에 흘리는 것. HTTP/1.1이 차선 하나에 차들이 줄지어 서는 것이라면, HTTP/2는 차선을 여러 개로 나눈 것이다.
- **many concurrent**: "많은 동시" — HTTP/1.1의 하나씩 처리와 달리 여러 요청이 동시에 진행된다.

> HTTP/3 does not use TCP/IP connections but QUIC + UDP.

"HTTP/3는 TCP/IP 연결을 사용하지 않고 QUIC + UDP를 사용한다."

- **QUIC**: TCP와 TLS의 기능을 UDP 위에 다시 구현한 프로토콜. 연결 확립 속도가 빠르고, 패킷 유실 시 해당 스트림만 영향을 받는다.
- **UDP**: 비연결형, 신뢰성 없음. QUIC이 UDP 위에서 신뢰성을 직접 구현했다.

```
HTTP/1.1: TCP 연결 1개 → 요청 직렬 처리
HTTP/2:   TCP 연결 1개 → 스트림 여러 개 동시 처리 (멀티플렉싱)
HTTP/3:   QUIC+UDP → 연결 빠름, 스트림 독립적
```

---

## 종합

HTTP 버전의 진화 방향은 명확하다: 연결 하나로 더 많은 것을 더 빠르게. HTTP/1.1이 "연결을 재사용하자"였다면, HTTP/2는 "연결 하나로 동시에 처리하자"이고, HTTP/3는 "TCP의 한계도 버리자"다. 브라우저가 HTTP/2를 쓰는 서버에 접속하면 DevTools Network 탭의 Protocol 컬럼에서 `h2`로 표시되고, HTTP/3는 `h3`로 표시된다.

---
# HTTP/2가 HTTP/1.1 대비 개선한 점은?

## 도입

HTTP/2는 HTTP의 의미(메서드, 상태 코드, 헤더)는 그대로 두고, 전송 방식을 대폭 최적화했다. 4가지 핵심 개선 사항이 있다.

---

## 본문

> HTTP/2 adds support for: a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space;

"HTTP/2는 다음을 지원한다: 텍스트 대신 메타데이터(HTTP 헤더)의 압축된 바이너리 표현 — 헤더가 훨씬 적은 공간을 차지하도록;"

- **binary representation**: HTTP/1.1 헤더는 ASCII 텍스트다. `Content-Type: application/json`이 그대로 전송된다. HTTP/2는 바이너리로 인코딩하고 HPACK으로 압축한다. 반복되는 헤더(예: `Authorization`)는 참조로 대체된다.

> a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections;

"2~8개의 TCP/IP 연결 대신 접근하는 서버 도메인당 단일 TCP/IP 연결(보통 암호화된);"

- **2 to 8 TCP/IP connections**: HTTP/1.1에서 브라우저는 병렬성을 위해 같은 도메인에 여러 연결을 동시에 열었다. HTTP/2는 하나의 연결만으로도 멀티플렉싱으로 동등한 병렬성을 달성한다.

> one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets to almost solve the problem of the HOLB (head-of-line blocking);

"TCP/IP 연결당 하나 이상의 양방향 스트림 — 여기서 HTTP 요청과 응답은 작은 패킷으로 분해되어 전송되며, HOLB(head-of-line blocking) 문제를 거의 해결한다;"

- **HOLB (head-of-line blocking)**: HTTP/1.1에서 앞의 요청이 지연되면 뒤의 모든 요청이 기다려야 하는 문제. HTTP/2의 멀티플렉싱으로 각 요청이 독립적인 스트림으로 처리되어 이 문제가 애플리케이션 레벨에서 해결된다.
- **almost solve**: TCP 레벨의 HOLB는 여전히 남아있다. HTTP/3(QUIC)이 이를 해결한다.

> a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).

"서버 애플리케이션이 새 데이터가 있을 때마다 클라이언트에 데이터를 보낼 수 있는 푸시 기능 (폴링 방식으로 클라이언트가 서버에 주기적으로 새 데이터를 요청하도록 강제하지 않고)."

- **push capability**: 서버가 클라이언트의 요청 없이 데이터를 먼저 보낸다. 예를 들어 HTML을 보내면서 그 HTML이 필요로 하는 CSS, JS를 미리 푸시할 수 있다.
- **polling**: 클라이언트가 "새 데이터 있어?" 하고 주기적으로 묻는 방식. 비효율적이다.

```
HTTP/1.1                    HTTP/2
헤더: ASCII 텍스트            헤더: 바이너리 + HPACK 압축
연결: 도메인당 2~8개           연결: 도메인당 1개
요청: 직렬                    요청: 멀티플렉싱 (동시)
서버 시작: 불가               서버 푸시: 가능
```

---

## 종합

HTTP/2는 웹의 성능을 높이면서 기존 HTTP/1.1과 의미 수준에서 완전히 호환된다. `fetch()`를 HTTP/2 서버에 보내면 브라우저가 자동으로 HTTP/2를 쓴다 — 개발자가 API를 바꿀 필요 없다. DevTools Network 탭에서 Protocol이 `h2`면 HTTP/2다. HTTPS를 사용하는 서버라면 대부분 HTTP/2를 지원한다 — 브라우저들이 HTTP/2를 HTTPS 연결에서만 허용하기 때문이다.

---
# HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?

## 도입

HTTP/2의 멀티플렉싱은 애플리케이션 계층의 HOL blocking을 해결했지만, 아래 계층인 TCP에서 같은 문제가 다시 발생한다. HTTP/3은 TCP 자체를 교체하여 이 근본 문제를 해결했다.

---

## 본문

> HTTP/3 uses QUIC + UDP transport protocols instead of TCP. This slightly improves the average speed of communications and avoids the occasional problem of TCP connection congestion that can temporarily block or slow down the data flow of all its streams (another form of "head of line blocking").

"HTTP/3는 TCP 대신 QUIC + UDP 전송 프로토콜을 사용한다. 이는 통신의 평균 속도를 약간 개선하고, 모든 스트림의 데이터 흐름을 일시적으로 차단하거나 느리게 할 수 있는 TCP 연결 혼잡의 간헐적 문제(또 다른 형태의 'head of line blocking')를 방지한다."

- **TCP connection congestion**: TCP에서 하나의 패킷이 유실되면 그 패킷이 재전송되기 전까지 해당 TCP 연결의 모든 스트림이 기다려야 한다.
- **all its streams**: HTTP/2가 한 TCP 연결에 여러 스트림을 올렸기 때문에, TCP 레벨의 패킷 유실이 모든 스트림을 동시에 멈춘다.

**HOL blocking의 두 레벨:**

```
HTTP/1.1 HOL blocking (애플리케이션 레벨)
요청 A → [대기] → [완료]
요청 B →        → [대기] → [완료]
요청 C →                 → [대기] → [완료]
(앞 요청 완료 전까지 뒤 요청 처리 안 됨)

HTTP/2로 해결 → 멀티플렉싱: A, B, C가 동시에 처리됨

TCP HOL blocking (전송 레벨 — HTTP/2에 여전히 존재)
패킷 손실 → TCP 재전송 대기 → 모든 스트림 일시 정지

HTTP/3(QUIC)으로 해결 → 스트림별 독립적 재전송
패킷 손실 → 해당 스트림만 대기 → 다른 스트림은 계속 진행
```

- **slightly improves the average speed**: QUIC은 연결 확립 시간도 단축한다. TCP+TLS가 1.5~2 RTT인 반면, QUIC은 0-RTT 또는 1-RTT로 줄일 수 있다.

---

## 종합

"HTTP/2가 HOL blocking을 거의 해결했다"는 표현은 애플리케이션 계층의 문제는 해결했지만 TCP 계층의 문제는 남아있다는 뜻이다. 고속 네트워크에서는 패킷 유실이 드물어 이 차이가 체감되지 않지만, 패킷 유실이 잦은 모바일 환경에서는 HTTP/3(QUIC)의 차이가 명확하게 나타난다. Chrome의 DevTools Network 탭에서 Protocol이 `h3`이면 HTTP/3가 사용된 것이다.

---
# 현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?

## 도입

HTTP/3가 나왔다고 해서 이전 버전이 사라진 것은 아니다. 현실에서는 여러 버전이 공존하며, 클라이언트와 서버가 지원하는 버전에 따라 협상하여 최선의 버전을 사용한다.

---

## 본문

> HTTP/2 is supported by 71% of websites (34.1% HTTP/2 + 36.9% HTTP/3 with backwards compatibility) and supported by almost all web browsers (over 98% of users).

"HTTP/2는 71%의 웹사이트에서 지원된다 (34.1% HTTP/2 + 36.9% HTTP/3 하위 호환). 거의 모든 웹 브라우저(98% 이상의 사용자)에서 지원된다."

- **backwards compatibility**: HTTP/3 서버는 보통 HTTP/2도 함께 지원한다. 클라이언트가 HTTP/3를 못 쓰면 자동으로 HTTP/2로 폴백한다.

> HTTP/3 is used on 36.9% of websites and is supported by most web browsers, i.e. (at least partially) supported by 97% of users.

"HTTP/3은 36.9%의 웹사이트에서 사용되며, 대부분의 웹 브라우저에서 지원된다(97%의 사용자에게 최소한 부분적으로 지원)."

> HTTPS, the secure variant of HTTP, is used by more than 85% of websites.

"HTTP의 보안 변형인 HTTPS는 85% 이상의 웹사이트에서 사용된다."

> As of June 2025, 71.2% of the Internet's 150,000 most popular websites have a secure implementation of HTTPS.

"2025년 6월 기준, 인터넷 상위 15만 개 웹사이트의 71.2%가 HTTPS의 보안 구현을 갖추고 있다."

> However, despite TLS 1.3's release in 2018, adoption has been slow, with many still remaining on the older TLS 1.2 protocol.

"그러나 2018년 TLS 1.3 출시에도 불구하고, 채택이 느려 많은 서버가 여전히 더 오래된 TLS 1.2 프로토콜을 사용하고 있다."

---

## 종합

수치에서 중요한 패턴은 "최신 기술은 빠르게 보급되지 않는다"는 것이다. HTTP/3는 이론적으로 우월하지만 36.9%에 그친다. HTTPS는 85%이지만 TLS 1.3(HTTPS의 암호화 엔진 최신 버전)은 아직 전면 채택되지 않았다. 프론트엔드 개발자 입장에서는 타깃 사용자가 주로 사용하는 버전을 파악하고, 서버 설정에서 최소 HTTP/1.1을 지원하면서 HTTP/2 이상을 활성화하는 것이 현실적인 접근이다.

---
# HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?

## 도입

새 기술이 나오면 이전 기술이 사라질 것 같지만, HTTP는 다르다. 새 버전이 나와도 이전 버전은 계속 동작하며, 서버와 클라이언트가 지원하는 버전 중 가장 높은 것을 협상하여 쓴다.

---

## 본문

> Like HTTP/2, it does not obsolete previous major versions of the protocol.

"HTTP/2처럼, 이전 주요 버전의 프로토콜을 폐기하지 않는다."

- **does not obsolete**: "폐기하지 않는다" — HTTP/1.1이 RFC에서 폐기 예정(deprecated)으로 지정되지 않았다. 여전히 유효한 표준이다.

> HTTP/3 has lower latency for real-world web pages and loads faster than HTTP/2, in some cases over three times faster than HTTP/1.1, which is still commonly the only protocol enabled.

"HTTP/3는 실제 웹 페이지에서 더 낮은 지연을 가지며, HTTP/2보다 빠르게 로드되고, 경우에 따라 HTTP/1.1보다 세 배 이상 빠르다 — HTTP/1.1은 아직도 흔히 유일하게 활성화된 프로토콜이다."

- **which is still commonly the only protocol enabled**: HTTP/3, HTTP/2가 나왔는데도 HTTP/1.1만 쓰는 서버가 아직 많다. 인프라 업그레이드가 느리기 때문이다.

---

## 종합

HTTP 버전은 폐기가 아닌 공존의 방식으로 발전한다. 브라우저가 서버에 접속할 때 `Alt-Svc` 헤더나 ALPN(TLS 레벨 프로토콜 협상)을 통해 서버가 어떤 버전을 지원하는지 파악하고, 지원하는 버전 중 최신을 선택한다. HTTP/1.1만 쓰는 서버에 HTTP/3 클라이언트가 접속하면 자동으로 HTTP/1.1로 폴백한다. 개발자는 서버를 HTTP/2 이상으로 설정해두는 것만으로도 대부분의 최신 브라우저와의 통신에서 성능 향상을 얻는다.

---
# HTTP/1.0의 조건부 GET 요청은 어떤 문제를 해결했으며, 어떤 한계가 있었는가?

## 도입

HTTP/1.0은 단순히 "요청하면 내려준다"에서 "변경됐을 때만 내려준다"는 조건부 요청 기능을 추가했다. 이것이 캐싱의 기초다. 하지만 동적 콘텐츠에 대한 한계가 있었다.

---

## 본문

> HTTP/1.0 added headers to manage resources cached by a client in order to allow conditional GET requests.

"HTTP/1.0은 조건부 GET 요청을 허용하기 위해 클라이언트가 캐시한 리소스를 관리하는 헤더를 추가했다."

조건부 GET의 핵심 헤더: `If-Modified-Since`. 클라이언트가 이전에 리소스를 받은 시각을 기록해두고 "이 시각 이후로 변경됐으면 새로 줘"라고 요청한다.

> A server must return the entire content of the requested resource only if its last modified time is not known by the client or if it changed since the last full response to a GET request.

"서버는 마지막 수정 시간을 클라이언트가 모르거나, 마지막 전체 GET 응답 이후 변경된 경우에만 요청된 리소스의 전체 내용을 반환해야 한다."

변경 없으면 `304 Not Modified`, 변경됐으면 전체 내용. 네트워크 효율이 올라간다.

> If the size of the content is not known in advance (i.e. because it is dynamically generated) then the header Content-Length would not be included. The client would assume that transfer was complete when the connection closed, but a premature close would leave the client with partial content yet the client would not know it's partial.

"콘텐츠의 크기를 미리 알 수 없으면(즉, 동적으로 생성되기 때문에) Content-Length 헤더가 포함되지 않는다. 클라이언트는 연결이 닫힐 때 전송이 완료됐다고 가정하지만, 조기 종료는 클라이언트가 부분적인 내용을 가지게 하는데, 클라이언트는 그것이 부분적인지 알 수 없다."

- **dynamically generated**: `Express`나 Next.js에서 DB 결과를 합쳐 만드는 HTML. 크기가 미리 정해지지 않는다.
- **premature close**: 연결이 정상적이지 않은 이유로 닫히면 클라이언트는 이것이 의도적인 종료인지, 비정상 종료인지 알 수 없다.

---

## 종합

HTTP/1.0의 조건부 GET은 캐싱의 씨앗이었다. 변경 여부를 확인하는 아이디어는 오늘날 ETag, `If-None-Match`, `304 Not Modified`로 이어진다. 하지만 동적 콘텐츠의 크기를 알 수 없다는 한계는 HTTP/1.1의 chunked transfer encoding으로 해결됐다.

---
# HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?

## 도입

HTTP/1.0의 두 가지 한계 — 크기를 모르는 동적 콘텐츠 전송, 대용량 파일의 일부만 받기 — 를 HTTP/1.1이 해결했다.

---

## 본문

> Chunked transfer encoding allows content to be streamed in chunks in order to reliably send it even when the server does not know its length in advance.

"청크 전송 인코딩은 서버가 길이를 미리 알지 못해도 안정적으로 전송할 수 있도록 콘텐츠를 청크 단위로 스트리밍할 수 있게 한다."

- **chunks**: "조각들" — Content-Length 없이, 각 조각 앞에 그 조각의 크기를 명시하여 보낸다. 크기가 0인 조각이 전송 완료를 알린다.

```
HTTP/1.0 문제:
Content-Length: ???  ← 동적 콘텐츠는 크기 모름
연결 종료 = 전송 완료로 가정 → 중간에 끊기면 감지 불가

HTTP/1.1 chunked:
Transfer-Encoding: chunked
4\r\n           ← "4바이트 오는 거야"
Wiki\r\n
6\r\n           ← "6바이트 오는 거야"
pedia \r\n
0\r\n           ← "끝!"
\r\n
```

Node.js/Express에서 `res.write()`로 데이터를 점진적으로 보내거나, Next.js의 Streaming SSR이 chunked encoding을 사용한다.

> Byte range serving allows a client to request portions (ranges of bytes) of a resource. This is useful to resume an interrupted download (when a file is very large), when only a part of a content has to be shown or dynamically added to the already visible part by a browser in order to spare time, bandwidth and system resources, etc.

"바이트 범위 서빙은 클라이언트가 리소스의 일부(바이트 범위)를 요청할 수 있게 한다. 이는 중단된 다운로드를 재개하거나(파일이 매우 클 때), 콘텐츠의 일부만 표시하거나 이미 보이는 부분에 동적으로 추가할 때 유용하다."

- **ranges of bytes**: `Range: bytes=1000-2000` 헤더로 1000~2000바이트 구간만 요청한다.
- **resume an interrupted download**: 500MB 파일을 내려받다가 끊기면, 처음부터 다시 받는 것이 아니라 끊긴 지점부터 이어받는다.

```js
// 유튜브 동영상 탐색 시
// 중간 부분부터 바로 재생하면
// GET /video.mp4
// Range: bytes=15000000-20000000
// → 206 Partial Content
```

응답 코드 `206 Partial Content`가 byte range serving의 응답이다.

---

## 종합

chunked encoding은 Next.js의 Streaming SSR, `ReadableStream`, `Response.body`로 이어지는 스트리밍 API의 기반이다. byte range serving은 비디오 플레이어의 탐색(seek), 대용량 파일 이어받기의 기반이다. 브라우저의 `<video>` 태그가 영상의 중간 지점을 클릭했을 때 그 지점부터 버퍼링하는 것도 byte range serving 덕분이다.
