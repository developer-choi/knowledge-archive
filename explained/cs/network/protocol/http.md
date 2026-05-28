# HTTP(Hypertext Transfer Protocol)란 무엇인가?

## 도입

HTTP는 웹의 기반 통신 프로토콜이다. 브라우저에서 주소창에 URL을 치고 엔터를 누르는 순간부터, 서버에서 HTML을 받아 화면에 그리기까지 모든 과정이 HTTP 위에서 돌아간다. "Hypertext Transfer Protocol" — 하이퍼텍스트(링크로 연결된 문서)를 전송하기 위한 프로토콜이다.

---

## 본문

> HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite for distributed, collaborative, hypermedia information systems.

"HTTP는 분산된, 협력적인, 하이퍼미디어 정보 시스템을 위한 인터넷 프로토콜 스위트의 응용 계층 프로토콜이다."

- **application layer protocol**: OSI 7계층 혹은 TCP/IP 4계층 모델에서 가장 위에 있는 계층. 사용자와 직접 맞닿는 계층으로, 아래 계층(TCP, IP 등)이 데이터를 전달해주는 동안 HTTP는 "무엇을 주고받는가"의 규칙을 정한다.
- **distributed**: 서버 하나가 아니라 여러 서버(CDN, 프록시 등)에 걸쳐 동작한다.
- **hypermedia**: 텍스트에 링크가 담긴 HTML뿐 아니라 이미지, 비디오, 오디오 등 다양한 미디어를 링크로 연결한 것.

> HTTP is the foundation of data communication for the World Wide Web, where hypertext documents include hyperlinks to other resources that the user can easily access, for example by a mouse click or by tapping the screen in a web browser.

"HTTP는 월드 와이드 웹의 데이터 통신 기반으로, 하이퍼텍스트 문서가 사용자가 마우스 클릭이나 화면 탭으로 쉽게 접근할 수 있는 다른 리소스에 대한 하이퍼링크를 포함한다."

- **foundation**: 웹을 구성하는 모든 것(HTML 로딩, API 호출, 이미지 다운로드)이 HTTP 위에서 동작한다. `fetch()`, `XMLHttpRequest`, `<img src>`, `<script src>` 모두 HTTP 요청을 만든다.

> HTTP is an application-layer protocol for transmitting hypermedia documents, such as HTML. It was designed for communication between web browsers and web servers, but it can also be used for other purposes, such as machine-to-machine communication, programmatic access to APIs, and more.

"HTTP는 HTML 같은 하이퍼미디어 문서를 전송하기 위한 응용 계층 프로토콜이다. 웹 브라우저와 웹 서버 간 통신을 위해 설계됐지만, 머신 간 통신, API 프로그래밍 접근 등 다른 목적으로도 사용할 수 있다."

- **machine-to-machine communication**: `node app.js`에서 `fetch('https://api.example.com')`을 호출하는 것처럼 브라우저 없이 서버끼리 통신할 때도 HTTP를 쓴다.

> HTTP is an extensible protocol that relies on concepts like resources and Uniform Resource Identifiers (URIs), a basic message structure, and client-server communication model. New functionality can even be introduced by an agreement between a client and a server about a new header's semantics.

"HTTP는 리소스, URI, 기본 메시지 구조, 클라이언트-서버 통신 모델 같은 개념에 의존하는 확장 가능한 프로토콜이다. 클라이언트와 서버가 새 헤더의 의미에 합의함으로써 새 기능을 도입할 수도 있다."

- **extensible**: 새 헤더를 추가하는 것만으로 기능을 확장할 수 있다. `Authorization`, `Cache-Control`, `Content-Type`이 모두 이렇게 확장된 헤더들이다. HTTP 명세를 전면 개정하지 않아도 된다.

---

## 종합

HTTP는 웹의 공통 언어다. 브라우저가 `fetch('https://api.example.com/users')`를 호출하는 것이나, Node.js 백엔드가 외부 API를 호출하는 것이나, CDN이 원본 서버에서 콘텐츠를 가져오는 것이나 모두 HTTP다. "응용 계층 프로토콜"이라는 정의는 HTTP가 "어떤 경로로 데이터를 보내는가"(네트워크 계층의 일)가 아니라 "무엇을, 어떻게 요청하고 응답하는가"에만 집중한다는 뜻이다.

---

---

# HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?

## 도입

HTTP는 클라이언트가 먼저 요청을 보내고, 서버가 응답하는 단방향 대화 구조다. 서버는 절대 먼저 말을 걸지 않는다. 이 구조가 HTTP의 모든 특성(stateless, 요청-응답 쌍 등)의 출발점이다.

---

## 본문

> HTTP is a request-response protocol in the client-server model.

"HTTP는 클라이언트-서버 모델에서 요청-응답 프로토콜이다."

- **request-response**: 항상 클라이언트의 요청이 먼저고, 그에 대한 서버의 응답이 따라온다. 한 쌍이 하나의 트랜잭션이다.

> A transaction starts with a client submitting a request to the server, the server attempts to satisfy the request and returns a response to the client that describes the disposition of the request and optionally contains a requested resource such as an HTML document or other content.

"트랜잭션은 클라이언트가 서버에 요청을 제출하면서 시작되고, 서버는 요청을 처리하려 시도하여 요청의 처리 결과를 설명하고 선택적으로 HTML 문서 같은 요청된 리소스를 포함하는 응답을 반환한다."

- **disposition**: 앞의 설명과 같이 "처리 결과" — 성공했는지, 실패했는지, 리다이렉트가 필요한지.
- **optionally contains a requested resource**: 본문은 선택적이다. `204 No Content`나 `304 Not Modified` 응답에는 본문이 없다.

> Clients and servers communicate by exchanging individual messages (as opposed to a stream of data).

"클라이언트와 서버는 개별 메시지를 교환하여 통신한다 (데이터 스트림과 달리)."

- **individual messages**: HTTP는 연속적인 바이트 스트림이 아니라 독립된 메시지 단위로 통신한다. 각 요청-응답 쌍이 하나의 독립적인 메시지다.

> The browser is always the entity initiating the request. It is never the server (though some mechanisms have been added over the years to simulate server-initiated messages).

"브라우저는 항상 요청을 시작하는 주체다. 서버는 절대 먼저 시작하지 않는다 (수년에 걸쳐 서버 시작 메시지를 시뮬레이션하는 메커니즘이 추가됐지만)."

- **simulate server-initiated messages**: Server-Sent Events(SSE), WebSocket, HTTP/2 Server Push가 이에 해당한다. 엄밀히 말하면 모두 클라이언트가 먼저 연결을 열고, 그 위에 서버가 데이터를 흘리는 방식이다.

---

## 종합

"브라우저가 항상 먼저 요청한다"는 원칙은 HTTP 아키텍처의 근간이다. 실시간 채팅, 알림처럼 서버가 먼저 데이터를 보내야 하는 경우엔 클라이언트가 연결을 열어두고 기다리는 방식(SSE, WebSocket)으로 우회한다. `fetch()`를 호출하면 클라이언트가 요청을 만들어 서버에 보내고, `Promise`가 resolve될 때 응답이 도착한 것이다. 이 요청-응답 쌍 하나가 HTTP 트랜잭션 하나다.

---

---

# HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?

## 도입

클라이언트와 서버가 항상 직접 연결되는 것은 아니다. 사이에 프록시, CDN 같은 중간 노드가 있을 수 있다. HTTP는 이 중간 노드들을 활용하여 성능과 접근성을 높이도록 설계됐다.

---

## 본문

> HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.

"HTTP는 중간 네트워크 요소들이 클라이언트와 서버 사이의 통신을 개선하거나 가능하게 하도록 허용하도록 설계됐다."

- **intermediate network elements**: 클라이언트도 서버도 아닌 사이에 있는 노드들. CDN 엣지 서버, 프록시 서버가 대표적이다.

> High-traffic websites often benefit from web cache servers that deliver content on behalf of upstream servers to improve response time.

"트래픽이 많은 웹사이트는 종종 업스트림 서버를 대신하여 콘텐츠를 전달해 응답 시간을 개선하는 웹 캐시 서버의 혜택을 받는다."

- **on behalf of upstream servers**: CDN이 원본 서버 대신 응답하는 구조. Cloudflare, AWS CloudFront가 이 역할을 한다. 사용자는 멀리 있는 원본 서버 대신 가까운 CDN 엣지에서 응답을 받는다.

> Web browsers cache previously accessed web resources and reuse them, whenever possible, to reduce network traffic.

"웹 브라우저는 이전에 접근한 웹 리소스를 캐싱하고, 가능할 때마다 재사용하여 네트워크 트래픽을 줄인다."

DevTools Network 탭에서 `(memory cache)`, `(disk cache)`로 보이는 것이 바로 이 동작이다.

> HTTP proxy servers at private network boundaries can facilitate communication for clients without a globally routable address, by relaying messages with external servers.

"사설 네트워크 경계의 HTTP 프록시 서버는 전역 라우팅 주소가 없는 클라이언트를 위해 외부 서버와 메시지를 중계하여 통신을 가능하게 할 수 있다."

- **private network boundaries**: 회사 내부망처럼 공인 IP 없이 내부 IP만 쓰는 환경. 이 환경의 클라이언트는 인터넷에 직접 연결할 수 없으므로 프록시를 통한다.

> Those operating at the application layers are generally called proxies. These can be transparent, forwarding on the requests they receive without altering them in any way, or non-transparent, in which case they will change the request in some way before passing it along to the server.

"응용 계층에서 동작하는 것들을 일반적으로 프록시라고 부른다. 이것들은 투명(transparent)할 수 있어 받은 요청을 어떤 방식으로도 변경하지 않고 전달하거나, 비투명(non-transparent)하여 서버로 전달하기 전에 어떤 방식으로든 요청을 변경한다."

- **transparent**: 클라이언트 입장에서 프록시가 있는지 모른다. 요청이 그대로 전달된다.
- **non-transparent**: CDN이 캐시된 응답을 반환하거나, 회사 보안 프록시가 특정 헤더를 추가하는 것이 비투명 프록시다.

---

## 종합

`fetch('https://api.example.com')`을 호출할 때 실제로는 브라우저 → (회사 프록시) → CDN 엣지 → 원본 서버 순으로 여러 노드를 거칠 수 있다. HTTP가 중간 노드를 허용하도록 설계된 덕에 CDN이 원본 서버의 부하를 줄이고, 프록시가 사설망의 인터넷 접근을 가능하게 하며, 브라우저 캐시가 네트워크 트래픽을 줄이는 것이 모두 가능하다.

---

---

# HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?

## 도입

HTTP 요청이 여러 중간 노드(프록시, CDN)를 거칠 때, 어떤 헤더는 중간 노드가 처리하고 버리는 반면, 어떤 헤더는 최종 목적지까지 그대로 전달돼야 한다. 이 두 종류를 hop-by-hop과 end-to-end로 구분한다.

---

## 본문

> To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions, some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

"중간 HTTP 노드(프록시 서버, 웹 캐시 등)가 기능을 수행할 수 있도록, 일부 HTTP 헤더는 hop-by-hop으로 관리되는 반면 다른 헤더들은 end-to-end(출발지 클라이언트와 목적지 웹서버에 의해서만 관리됨)로 관리된다."

- **hop-by-hop**: hop은 네트워크 노드 간 한 단계 이동이다. "홉마다" — 각 중간 노드가 읽고 처리하고, 다음 노드에 전달할 때는 이 헤더를 제거하거나 새로 만든다.
- **end-to-end**: "끝에서 끝으로" — 중간 노드가 읽어서는 안 되고, 최종 목적지에 그대로 전달된다.

**hop-by-hop 헤더 예시:**

- `Connection: keep-alive` — 현재 연결을 유지할지 여부. 다음 홉에서는 관계없다.
- `Keep-Alive` — 연결 유지 파라미터. 중간 노드끼리의 협상에 쓰인다.
- `Transfer-Encoding` — 현재 홉의 전송 인코딩. CDN이 chunked 인코딩을 처리하고 다음 홉에는 디코딩된 데이터를 보낸다.

**end-to-end 헤더 예시:**

- `Content-Type: application/json` — 최종 수신자가 본문을 해석하는 데 필요하다.
- `Authorization: Bearer xxxxx` — 최종 서버만 인증 토큰을 검사해야 한다. 중간 프록시가 읽으면 안 된다.
- `Cache-Control` — 최종 서버와 클라이언트 간의 캐싱 지시.

```
클라이언트 → 프록시 → CDN → 서버

hop-by-hop:  [처리 후 제거] [새로 설정]  [처리 후 제거]
end-to-end:  [그대로 전달] [그대로 전달] [최종 처리]
```

---

## 종합

실무에서 hop-by-hop 헤더를 직접 다룰 일은 많지 않다. 하지만 `Authorization` 토큰이 중간 프록시에 노출되지 않는다는 것, `Cache-Control`이 CDN과 브라우저 모두에 적용된다는 것, `Connection` 헤더가 다음 홉으로 전달되지 않는다는 것을 이해하면 네트워크 디버깅 시 도움이 된다.

---

---

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

---

# HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?

## 도입

HTTP는 "어떻게 전송하는가"를 스스로 처리하지 않는다. 아래 계층의 전송 프로토콜이 신뢰성을 보장해줄 거라고 전제한다. 버전마다 다른 전송 프로토콜을 선택했다.

---

## 본문

> HTTP presumes an underlying and reliable transport layer protocol.

"HTTP는 아래에 신뢰할 수 있는 전송 계층 프로토콜이 있다고 전제한다."

- **presumes**: "전제한다" — HTTP는 패킷 유실이나 순서 뒤바뀜을 직접 다루지 않는다. 이것은 전송 계층의 책임이다.
- **reliable**: "신뢰할 수 있는" — 메시지가 손실 없이, 순서대로 도착한다는 보장.

> The standard choice of the underlying protocol prior to HTTP/3 is Transmission Control Protocol (TCP).

"HTTP/3 이전의 기본 프로토콜 선택은 TCP(Transmission Control Protocol)이다."

- **prior to HTTP/3**: HTTP/1.1, HTTP/2가 TCP를 사용했다.

> HTTP/3 uses a different transport layer called QUIC, which provides reliability on top of the unreliable User Datagram Protocol (UDP).

"HTTP/3는 QUIC이라는 다른 전송 계층을 사용하며, 이는 신뢰할 수 없는 UDP(User Datagram Protocol) 위에 신뢰성을 제공한다."

- **unreliable UDP**: UDP는 빠르지만 패킷 유실이나 순서 보장이 없다.
- **QUIC**: UDP 위에 TCP의 신뢰성(재전송, 흐름 제어)을 직접 구현한 프로토콜. TLS까지 통합되어 연결 확립이 빠르다.

> HTTP doesn't require the underlying transport protocol to be connection-based; it only requires it to be reliable, or not lose messages (at minimum, presenting an error in such cases).

"HTTP는 하위 전송 프로토콜이 연결 기반일 것을 요구하지 않는다. 단지 신뢰할 수 있거나 메시지를 손실하지 않을 것(최소한 이런 경우 에러를 표시하는)을 요구한다."

- **connection-based**: TCP는 연결 기반이지만, HTTP가 요구하는 것은 연결이 아니라 신뢰성이다. 이것이 HTTP/3가 비연결형 UDP 기반 QUIC을 채택할 수 있었던 근거다.

```
HTTP 버전   전송 프로토콜   연결 방식
HTTP/1.x   TCP            연결 기반, 신뢰성 보장
HTTP/2     TCP            연결 기반, 신뢰성 보장
HTTP/3     QUIC (over UDP) UDP 기반, QUIC이 신뢰성 직접 구현
```

---

## 종합

"HTTP는 신뢰성 있는 전송을 전제한다"는 설계 원칙이 HTTP/3을 가능하게 했다. TCP가 아니어도 신뢰성만 보장하면 된다는 원칙 덕에 QUIC+UDP를 선택할 수 있었다. 프론트엔드 개발자 입장에서는 `fetch()`가 내부적으로 TCP를 쓰는지 QUIC을 쓰는지 신경 쓸 필요 없다 — 브라우저가 자동으로 협상한다.

---

---

# HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?

## 도입

HTTP는 각 요청을 독립적으로 처리한다. 이전 요청의 맥락을 기억하지 않는다. 이것이 stateless의 의미다. 덕분에 서버가 단순해지지만, 로그인 상태 같은 것을 유지하려면 별도 메커니즘이 필요하다.

---

## 본문

> HTTP is a stateless application-level protocol and it requires a reliable network transport connection to exchange data between client and server.

"HTTP는 stateless 애플리케이션 레벨 프로토콜이며, 클라이언트와 서버 간 데이터 교환을 위해 신뢰할 수 있는 네트워크 전송 연결이 필요하다."

- **stateless**: 서버가 이전 요청의 정보를 기억하지 않는다. 1번째 요청에 "나는 Alice야"라고 했어도 2번째 요청에서 서버는 "Alice"를 기억하지 않는다.

> In HTTP implementations, TCP/IP connections are used using well-known ports (typically port 80 if the connection is unencrypted or port 443 if the connection is encrypted).

"HTTP 구현에서 TCP/IP 연결은 잘 알려진 포트를 사용한다 — 일반적으로 연결이 암호화되지 않은 경우 포트 80, 암호화된 경우 포트 443."

- **well-known ports**: 0~1023 범위의 표준 포트. HTTP = 80, HTTPS = 443, FTP = 21. 이 포트들은 IANA가 관리하는 공식 할당 포트다.
- **port 80 / port 443**: URL에 포트를 명시하지 않으면 브라우저가 자동으로 http:// → 80, https:// → 443을 사용한다. `localhost:3000`처럼 다른 포트를 쓰면 URL에 명시해야 한다.

**stateless의 실용적 의미:**

```js
// 첫 번째 요청
fetch('/api/login', { method: 'POST', body: credentials })
// 서버: "처리했고 이제 잊었음"

// 두 번째 요청
fetch('/api/profile')
// 서버: "이 사람이 누구지? 모르는데."
```

로그인 상태를 유지하려면 매 요청마다 "내가 Alice야"를 증명해야 한다. 이를 위해 쿠키나 JWT 토큰을 사용한다.

---

## 종합

stateless 설계는 서버를 단순하고 확장 가능하게 만든다. 어느 서버 인스턴스가 요청을 받아도 동일하게 처리할 수 있다 — 이전 상태를 기억하지 않기 때문이다. 이것이 수평 확장(horizontal scaling)이 쉬운 이유다. 반면 로그인 상태, 장바구니 등 상태가 필요한 기능은 쿠키, 세션, JWT로 "상태처럼 보이는 것"을 구현한다. HTTP 자체가 상태를 저장하는 것이 아니라 애플리케이션이 만드는 것이다.

---

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

---

---

# HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?

## 도입

HTTP 자체는 상태를 기억하지 않는다. 로그인 후 다음 페이지에서도 "로그인됨" 상태를 유지하는 것은 HTTP가 아니라 그 위의 애플리케이션이 만들어낸 것이다.

---

## 본문

> As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.

"stateless 프로토콜로서 HTTP는 웹 서버가 여러 요청 동안 각 사용자에 대한 정보나 상태를 유지하도록 요구하지 않는다."

- **retain information**: HTTP 서버가 "이 IP는 아까 로그인한 사람이야" 같은 정보를 보관할 의무가 없다.

> If a web application needs an application session, it implements it via HTTP cookies, hidden variables in a web form or another mechanism.

"웹 애플리케이션이 애플리케이션 세션이 필요하면, HTTP 쿠키, 웹 폼의 히든 변수 또는 다른 메커니즘으로 구현한다."

- **HTTP cookies**: 서버가 `Set-Cookie` 헤더로 클라이언트에 값을 저장하고, 이후 요청마다 클라이언트가 `Cookie` 헤더로 그 값을 다시 보낸다. 서버는 이 값으로 사용자를 식별한다.
- **hidden variables in a web form**: `<input type="hidden" name="session_id" value="...">` — 예전에 쿠키 대신 사용하던 방법.

> HTTP is stateless: there is no link between two requests being successively carried out on the same connection. But while the core of HTTP itself is stateless, HTTP cookies allow the use of stateful sessions.

"HTTP는 stateless다: 같은 연결에서 연속으로 수행되는 두 요청 사이에 링크가 없다. 그러나 HTTP 코어 자체는 stateless이지만, HTTP 쿠키는 stateful 세션을 사용할 수 있게 한다."

- **no link between two requests**: 서버는 1번 요청과 2번 요청이 같은 사람의 것인지 알 수 없다.
- **HTTP is stateless, but not sessionless**: MDN의 정확한 표현이다. 프로토콜은 무상태이지만, 애플리케이션이 상태를 만들어낼 수 있다.

```
HTTP는 기억이 없음:
요청 1: "나는 Alice야"
요청 2: "내 장바구니 보여줘" → 서버: "Alice가 누구지?"

쿠키로 해결:
요청 1: POST /login
← Set-Cookie: session_id=abc123
요청 2: GET /cart
Cookie: session_id=abc123 → 서버: "abc123은 Alice야"
```

---

## 종합

세션 유지는 클라이언트(쿠키, localStorage)와 서버(세션 DB, Redis)가 협력하여 만들어낸 추상이다. JWT 토큰 방식은 서버가 상태를 저장하지 않고 토큰 자체에 정보를 담아 검증하는 방식으로, HTTP의 stateless 특성과 더 잘 맞는다. 어떤 방식이든 "클라이언트가 매 요청마다 자신을 증명하는 정보를 보낸다"는 원칙은 같다.

---

---

# 웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?

## 도입

로그인 기능을 구현하는 방법은 두 가지 레벨에 있다. 하나는 우리가 보통 만드는 "쿠키/JWT 기반 로그인"이고, 다른 하나는 HTTP 명세에 있는 "Basic/Digest 인증"이다. 둘은 완전히 별개의 메커니즘이다.

---

## 본문

> Typically, to start a session, an interactive login is performed, and to end a session, a logout is requested by the user. These kind of operations use a custom authentication mechanism, not HTTP authentication.

"일반적으로 세션을 시작하려면 대화형 로그인을 수행하고, 세션을 종료하려면 사용자가 로그아웃을 요청한다. 이런 동작들은 HTTP 인증이 아닌 커스텀 인증 메커니즘을 사용한다."

- **custom authentication mechanism**: 우리가 만드는 `POST /login` → 세션 쿠키 발급, 또는 JWT 토큰 방식이 모두 여기에 해당한다.

> HTTP provides multiple authentication schemes such as basic access authentication and digest access authentication which operate via a challenge-response mechanism whereby the server identifies and issues a challenge before serving the requested content.

"HTTP는 기본 접근 인증, 다이제스트 접근 인증 같은 여러 인증 체계를 제공하며, 이것들은 서버가 요청된 콘텐츠를 제공하기 전에 challenge를 식별하고 발행하는 challenge-response 메커니즘으로 동작한다."

- **challenge-response mechanism**: 서버가 먼저 "인증해"라고 요구(challenge)하고, 클라이언트가 인증 정보로 응답하는 방식이다. 서버가 `401 Unauthorized`와 `WWW-Authenticate: Basic realm="..."` 헤더를 보내면, 브라우저가 팝업을 띄워 아이디/비밀번호를 입력받는다.
- **basic access authentication**: 아이디:비밀번호를 Base64로 인코딩하여 `Authorization: Basic dXNlcjpwYXNz` 형태로 보내는 방식. HTTPS 없이는 위험하다.

> The authentication mechanisms described above belong to the HTTP protocol and are managed by client and server HTTP software (if configured to require authentication before allowing client access to one or more web resources), and not by the web applications using an application session.

"위에 설명한 인증 메커니즘들은 HTTP 프로토콜에 속하며, 웹 애플리케이션 세션을 사용하는 웹 애플리케이션이 아니라 클라이언트 및 서버 HTTP 소프트웨어에 의해 관리된다."

- **HTTP software**: nginx, Apache 같은 웹서버 소프트웨어가 HTTP 인증을 처리한다. Express/Next.js 같은 웹 프레임워크가 아니다.

```
HTTP 프로토콜 인증 (Basic/Digest):
  서버 → 401 + WWW-Authenticate
  브라우저 → 팝업 → 사용자 입력
  브라우저 → Authorization: Basic xxxxx
  관리: nginx/Apache 설정

애플리케이션 레벨 인증 (세션/JWT):
  서버 → 200 + HTML 로그인 폼
  사용자 → 폼 제출 → POST /login
  서버 → Set-Cookie: session_id=... 또는 JWT 토큰
  관리: Express/Next.js 코드
```

---

## 종합

현대 웹앱의 99%는 애플리케이션 레벨 인증(세션/JWT)을 사용한다. HTTP 프로토콜 인증(Basic/Digest)은 nginx의 특정 디렉토리를 간단히 보호하거나, API 개발 도구 접근을 제한하는 등 인프라 레벨에서 제한적으로 쓰인다. `fetch()`로 API를 호출할 때 `Authorization: Bearer ${token}`을 붙이는 것은 HTTP Basic 인증이 아니라 애플리케이션이 정의한 커스텀 인증 방식이다.

---

---

# HTTP 메시지의 기본 구조는 어떻게 구성되는가?

## 도입

HTTP 요청이든 응답이든 메시지 구조는 동일하다. 헤더와 바디, 두 부분으로 나뉜다. DevTools의 Headers/Payload 탭에서 보는 것이 바로 이 구조다.

---

## 본문

> At the highest level, a message consists of a header followed by a body.

"가장 높은 수준에서 메시지는 헤더 다음에 바디로 구성된다."

> A header consists of lines of ASCII text; each terminated with a carriage return and line feed sequence.

"헤더는 ASCII 텍스트 줄들로 구성되며, 각 줄은 캐리지 리턴과 줄 바꿈 시퀀스로 끝난다."

- **ASCII text**: HTTP/1.1 헤더는 사람이 읽을 수 있는 텍스트다. `curl -v`로 HTTP 요청을 보면 헤더가 그대로 텍스트로 보인다.
- **carriage return and line feed**: `\r\n` (CRLF). Windows 줄 끝과 동일하다.

> A body consists of data in any format; not limited to ASCII.

"바디는 어떤 형식의 데이터로도 구성되며, ASCII에 한정되지 않는다."

- **not limited to ASCII**: JSON, HTML, 이미지 이진 데이터, 동영상 등 어떤 형식이든 담을 수 있다.

> The format must match that specified by the Content-Type header field if the message contains one.

"메시지가 Content-Type 헤더 필드를 포함하면, 형식은 그것이 명시한 것과 일치해야 한다."

- `Content-Type: application/json`이면 바디는 유효한 JSON이어야 하고, `Content-Type: image/png`이면 PNG 이진 데이터여야 한다.

> A body is optional or, in other words, can be blank.

"바디는 선택적이다 — 즉 비어있을 수 있다."

GET 요청은 바디가 없고, 204 No Content 응답도 바디가 없다.

```
HTTP 메시지 구조

[헤더]
시작 줄 (요청 라인 또는 상태 라인)
헤더 필드 1: 값
헤더 필드 2: 값
...
빈 줄 (\r\n — 헤더 끝 표시)

[바디]
(어떤 형식이든, 선택적)
```

DevTools에서 요청을 클릭하면 "Headers" 탭이 헤더 부분이고, "Payload" 탭이 바디 부분이다.

---

## 종합

헤더와 바디를 구분하는 "빈 줄"이 핵심이다. 파서는 빈 줄을 만나는 순간 "이제 바디다"라고 판단한다. `Content-Type`이 형식을 알려주고, `Content-Length`나 `Transfer-Encoding`이 바디의 크기/끝을 알려준다. 이 구조는 HTTP/1.1의 텍스트 기반 프로토콜에서 그대로 유지되며, HTTP/2+는 이 메시지를 바이너리 프레임으로 변환하지만 논리적 구조는 동일하다.

---

---

# HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?

## 도입

HTTP의 메시지 구조와 의미(메서드, 상태 코드, 헤더의 의미)는 HTTP 버전이 바뀌어도 동일하다. 바뀌는 것은 "어떤 형태로 전송하는가"뿐이다. HTTP/1.1은 텍스트, HTTP/2+는 바이너리다.

---

## 본문

> Later versions, HTTP/2 and HTTP/3, use a binary protocol, where headers are encoded in a single HEADERS and zero or more CONTINUATION frames using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.

"이후 버전인 HTTP/2와 HTTP/3는 바이너리 프로토콜을 사용하며, 헤더는 HPACK(HTTP/2) 또는 QPACK(HTTP/3)을 사용하는 단일 HEADERS 및 0개 이상의 CONTINUATION 프레임에 인코딩된다."

- **binary protocol**: 사람이 읽을 수 없는 이진 포맷. 파싱이 빠르고 압축 효율이 높다.
- **HPACK/QPACK**: 헤더 압축 알고리즘. 자주 반복되는 헤더(예: `Content-Type: application/json`)는 처음 한 번만 보내고 이후엔 인덱스 번호만 전송한다.
- **frames**: HTTP/2의 전송 단위. 메시지를 여러 프레임으로 쪼개서 멀티플렉싱한다.

> The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

"HTTP/1의 요청 또는 응답 라인은 각각 콜론(:)으로 시작하는 여러 pseudo-header 필드로 대체됐다."

```
HTTP/1.1:
GET /api/users HTTP/1.1
Host: example.com

HTTP/2 pseudo-headers:
:method: GET
:path: /api/users
:scheme: https
:authority: example.com
```

> HTTP is generally designed to be human-readable, even with the added complexity introduced in HTTP/2. Even if only part of the original HTTP message is sent in this version of HTTP, the semantics of each message is unchanged and the client reconstitutes (virtually) the original HTTP/1.1 request.

"HTTP는 HTTP/2로 도입된 복잡성이 추가됐음에도 불구하고 일반적으로 사람이 읽을 수 있도록 설계됐다. 이 HTTP 버전에서는 원본 HTTP 메시지의 일부만 전송되더라도, 각 메시지의 의미는 변경되지 않으며 클라이언트는 (가상으로) 원본 HTTP/1.1 요청을 재구성한다."

- **semantics of each message is unchanged**: GET은 여전히 GET이고, `Content-Type`은 여전히 같은 의미다. 전송 방식만 바뀐 것이다.

---

## 종합

DevTools가 HTTP/2 요청도 HTTP/1.1 형식으로 보여주는 이유가 바로 "의미는 동일하기 때문"이다. `fetch()`로 코드를 작성할 때 HTTP/1.1인지 HTTP/2인지 신경 쓸 필요 없다 — 브라우저가 내부적으로 최적의 방식으로 전송한다. HTTP/2로 바꾸었을 때 개발자가 코드를 변경할 필요가 없었던 이유가 이것이다.

---

---

# HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?

## 도입

HTTP 메시지의 헤더는 요청과 응답에 대한 부가 정보(메타데이터)를 담는다. 어떤 언어를 원하는지, 어떤 형식의 데이터인지, 캐싱 정책은 어떤지 등이 헤더를 통해 전달된다.

---

## 본문

> A header field represents metadata about the containing message.

"헤더 필드는 포함하는 메시지에 대한 메타데이터를 나타낸다."

- **metadata**: 데이터 자체가 아니라 데이터에 대한 설명. 본문(body)이 실제 데이터라면, 헤더는 그 데이터를 어떻게 해석해야 하는지, 어디서 왔는지 등을 설명한다.

> A header field line is formatted as a name-value pair with a colon separator.

"헤더 필드 줄은 콜론 구분자를 가진 이름-값 쌍으로 형식화된다."

```
Content-Type: application/json
Authorization: Bearer eyJhbGci...
Cache-Control: no-cache
```

- **colon separator**: 이름과 값을 `:` 로 구분한다.

> Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.

"이름 주변에는 공백이 허용되지 않지만, 값 부분의 앞뒤 공백은 무시된다."

```
Content-Type : application/json  ← 잘못됨 (이름 뒤 공백)
Content-Type:  application/json  ← 유효 (값 앞 공백은 무시)
Content-Type: application/json   ← 정상
```

> Unlike a method name that must match exactly (case-sensitive), a header field name is matched ignoring case although often shown with each word capitalized.

"정확히 일치해야 하는(대소문자 구분) 메서드 이름과 달리, 헤더 필드 이름은 보통 각 단어의 첫 글자를 대문자로 표시하지만 대소문자를 구분하지 않고 매칭된다."

- **case-sensitive method**: `GET`은 맞고 `get`은 틀리다.
- **ignoring case for headers**: `Content-Type`, `content-type`, `CONTENT-TYPE` 모두 동일하게 처리된다. `fetch()`에서 헤더를 소문자로 쓰든 대문자로 쓰든 관계없는 이유다.

---

## 종합

헤더는 HTTP 확장의 핵심이다. 새 기능이 필요하면 새 헤더를 정의하면 된다. `Authorization`, `Cache-Control`, `CORS` 관련 헤더들이 모두 이렇게 추가됐다. `fetch()` API에서 `headers: { 'Content-Type': 'application/json' }`처럼 직접 헤더를 설정하거나, 서버 응답에서 `response.headers.get('Content-Type')`으로 읽는 것이 일상적인 헤더 사용이다.

---

---

# HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?

## 도입

HTTP 요청 메시지의 첫 줄이 "무엇을 원하는가"를 담는 요청 라인이다. 메서드, 경로, 버전 세 요소로 이루어지며, HTTP/1.1에서는 `Host` 헤더 하나만 필수다.

---

## 본문

> A request is sent by a client to a server. The start line includes a method name, a request URI and the protocol version with a single space between each field.

"요청은 클라이언트가 서버에 보낸다. 시작 줄은 메서드 이름, 요청 URI, 프로토콜 버전을 각 필드 사이에 단일 공백으로 포함한다."

```
GET /api/users HTTP/1.1
│   │           └── 프로토콜 버전
│   └── 요청 URI (경로)
└── 메서드
```

> In the HTTP/1.1 protocol, all header fields except Host are optional.

"HTTP/1.1 프로토콜에서 Host를 제외한 모든 헤더 필드는 선택적이다."

- **Host만 필수**: 하나의 서버(IP)에 여러 도메인이 호스팅될 수 있으므로, 어느 도메인에 대한 요청인지 반드시 명시해야 한다. `Host: example.com`.

> Requests consist of the following elements: An HTTP method... The path of the resource to fetch... The version of the HTTP protocol. Optional headers that convey additional information for the servers. A body, for some methods like POST.

요청의 구성 요소:
- **HTTP method**: GET, POST, PUT 등
- **path**: 전체 URL에서 도메인과 포트를 제거한 경로 부분. `https://example.com:443/api/users?page=1`에서 `/api/users?page=1`이 경로다.
- **버전**: `HTTP/1.1`, `HTTP/2`
- **선택적 헤더들**: Content-Type, Authorization, Accept 등
- **바디**: GET에는 없고, POST/PUT에는 있다.

```
HTTP 요청 메시지 구조:

GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: ko
User-Agent: Mozilla/5.0
                                    ← 빈 줄 (헤더 끝)
                                    ← 바디 (GET이면 없음)
```

---

## 종합

DevTools의 Headers 탭을 펼치면 "Request Headers" 섹션에서 이 구조를 그대로 볼 수 있다. `curl -v https://example.com`을 실행하면 실제 HTTP 메시지 텍스트가 `>` 화살표 앞에 그대로 출력된다. HTTP/2를 써도 의미 구조는 동일하고, `fetch()`를 쓸 때 `method`, `headers`, `body` 옵션이 이 요청 메시지의 각 부분에 대응된다.

---

---

# 다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라

## 도입

실제 HTTP 요청을 보면 여러 헤더가 함께 온다. 각 헤더가 어떤 역할을 하는지 분석하면 HTTP 메시지 구조가 명확해진다. OA에서 다루는 예시 요청을 헤더별로 분석한다.

---

## 본문

```
GET / HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

> The Host header field distinguishes between various DNS names sharing a single IP address, allowing name-based virtual hosting. While optional in HTTP/1.0, it is mandatory in HTTP/1.1.

"Host 헤더 필드는 단일 IP 주소를 공유하는 다양한 DNS 이름을 구별하여 이름 기반 가상 호스팅을 가능하게 한다. HTTP/1.0에서는 선택적이었지만 HTTP/1.1에서는 필수다."

- **name-based virtual hosting**: 같은 서버(같은 IP)에서 `example.com`과 `another.com`을 동시에 서비스하는 것. Host 헤더 없이는 서버가 어느 도메인에 대한 요청인지 알 수 없다.

**나머지 헤더들:**

- `User-Agent: Mozilla/5.0` — 요청을 보내는 클라이언트 소프트웨어 정보. 서버가 이 값으로 브라우저 버전을 판단하거나 봇을 필터링한다.
- `Accept: text/html,...` — 클라이언트가 받을 수 있는 응답 형식과 우선순위(`q` 값). `*/*;q=0.8`은 그 외 모든 형식도 받지만 우선순위가 낮다.
- `Accept-Language: en-GB,en;q=0.5` — 선호하는 언어. 다국어 서비스에서 서버가 참고한다.
- `Accept-Encoding: gzip, deflate, br` — 클라이언트가 지원하는 압축 방식. 서버가 gzip으로 응답을 압축하면 전송량이 줄어든다.
- `Connection: keep-alive` — 이 연결을 유지해달라. HTTP/1.1에서는 기본값이므로 생략해도 된다.

---

## 종합

`fetch('/api/data')`처럼 간단한 호출에도 브라우저는 자동으로 `Host`, `User-Agent`, `Accept`, `Accept-Encoding` 등의 헤더를 붙인다. DevTools의 요청 헤더에서 이를 직접 확인할 수 있다. 명시적으로 설정하지 않은 헤더는 브라우저가 자동으로 관리한다 — 이것이 "HTTP가 확장 가능하다"는 설계가 실용적으로 드러나는 방식이다.

---

---

# 다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라

## 도입

응답 메시지도 요청과 구조가 같다 — 시작 줄(상태 라인) + 헤더 + 바디. OA가 실제 응답 예시를 분석하며 각 헤더의 역할을 설명한다.

---

## 본문

```
HTTP/1.1 200 OK
Date: Mon, 23 May 2005 22:38:34 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 155
Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT
Server: Apache/1.3.3.7 (Unix) (Red-Hat/Linux)
ETag: "3f80f-1b6-3e1cb03b"
Accept-Ranges: bytes
Connection: close
```

> The ETag (entity tag) header field is used to determine if a cached version of the requested resource is identical to the current version of the resource on the server.

"ETag(엔티티 태그) 헤더 필드는 요청된 리소스의 캐시된 버전이 서버의 현재 버전과 동일한지 결정하는 데 사용된다."

- **ETag**: 리소스 버전의 지문. 다음에 같은 리소스를 요청할 때 `If-None-Match: "3f80f-1b6-3e1cb03b"`로 보내면 서버가 `304 Not Modified`로 응답할 수 있다.

> The Content-Type header field specifies the Internet media type of the data conveyed by the HTTP message, and Content-Length indicates its length in bytes.

"Content-Type 헤더 필드는 HTTP 메시지가 전달하는 데이터의 인터넷 미디어 타입을 명시하고, Content-Length는 바이트 단위 길이를 나타낸다."

- `Content-Type: text/html; charset=UTF-8` — 브라우저가 바디를 UTF-8 HTML로 파싱한다.
- `Content-Length: 155` — 바디가 155바이트임을 알린다. 클라이언트가 언제 전송이 끝났는지 알 수 있다.

> The HTTP/1.1 webserver publishes its ability to respond to requests for a byte range of the resource by including Accept-Ranges: bytes.

"HTTP/1.1 웹서버는 `Accept-Ranges: bytes`를 포함하여 리소스의 바이트 범위 요청에 응답할 수 있다고 알린다."

- `Accept-Ranges: bytes` — "나는 `Range` 헤더를 지원한다"는 광고. 클라이언트가 이 헤더를 보면 대용량 파일을 분할 다운로드할 수 있다는 것을 안다.

> When Connection: close is sent, it means that the web server will close the TCP connection immediately after the end of the transfer of this response.

"Connection: close가 전송되면, 이 응답 전송이 끝난 후 웹서버가 즉시 TCP 연결을 닫는다는 의미다."

- HTTP/1.1의 기본은 연결 유지인데, `Connection: close`로 이번 응답 후 연결을 닫겠다고 명시하는 것이다.

**응답 구조 요약:**

```
HTTP/1.1 200 OK                        ← 상태 라인: 버전 | 코드 | 메시지
Date: ...                              ← 헤더들
Content-Type: text/html; charset=UTF-8
Content-Length: 155
ETag: "3f80f-1b6-3e1cb03b"
                                       ← 빈 줄
<!DOCTYPE html>...                     ← 바디 (155바이트)
```

---

## 종합

`fetch(url)`의 `response` 객체에서 `response.headers.get('Content-Type')`으로 헤더를 읽고, `response.status`로 상태 코드를 읽고, `response.json()`으로 바디를 파싱하는 것이 이 응답 메시지 구조에 대한 프로그래매틱 접근이다. 서버 헤더 설정 하나가 브라우저 캐싱(ETag, Cache-Control), 압축(Content-Encoding), 연결 관리(Connection) 등 여러 동작에 영향을 준다.

---

---

# 하나의 웹페이지를 표시하기 위해 브라우저는 HTTP 요청을 어떤 순서로 보내는가?

## 도입

사용자가 URL을 입력하고 엔터를 치면 단 하나의 HTTP 요청이 아닌 수십, 수백 개의 요청이 발생한다. 이 요청들이 어떤 순서로 발생하는지 이해하면 웹 성능 최적화의 맥락이 잡힌다.

---

## 본문

> To display a Web page, the browser sends an original request to fetch the HTML document that represents the page.

"웹 페이지를 표시하기 위해 브라우저는 페이지를 나타내는 HTML 문서를 가져오기 위한 첫 번째 요청을 보낸다."

HTML이 시작점이다. `example.com` 주소창에 치면 `GET / HTTP/1.1`이 처음 나간다.

> It then parses this file, making additional requests corresponding to execution scripts, layout information (CSS) to display, and sub-resources contained within the page (usually images and videos).

"그런 다음 이 파일을 파싱하며, 실행 스크립트, 표시할 레이아웃 정보(CSS), 그리고 페이지에 포함된 서브 리소스(보통 이미지와 비디오)에 해당하는 추가 요청을 만든다."

- **parses this file**: HTML을 파싱하면서 `<link rel="stylesheet">`, `<script src>`, `<img src>` 등을 만날 때마다 해당 리소스 요청을 추가로 보낸다.

> The Web browser then combines these resources to present the complete document, the Web page.

"웹 브라우저는 그런 다음 이 리소스들을 조합하여 완전한 문서, 즉 웹 페이지를 표시한다."

> Scripts executed by the browser can fetch more resources in later phases and the browser updates the Web page accordingly.

"브라우저가 실행하는 스크립트는 나중 단계에서 더 많은 리소스를 가져올 수 있으며 브라우저는 그에 따라 웹 페이지를 업데이트한다."

JS가 실행되면서 `fetch()`나 `XMLHttpRequest`로 추가 데이터를 받아오는 것이 이 단계다.

```
브라우저 요청 흐름:
1. GET /index.html → HTML 수신
2. HTML 파싱 시작
   ├── <link href="style.css"> 발견 → GET /style.css
   ├── <script src="app.js"> 발견 → GET /app.js
   └── <img src="hero.jpg"> 발견 → GET /hero.jpg
3. HTML 렌더링
4. app.js 실행
   └── fetch('/api/data') → GET /api/data (동적 데이터)
5. 데이터로 UI 업데이트
```

---

## 종합

웹페이지 하나 = 수십~수백 개의 HTTP 요청이다. 이것이 HTTP/2 멀티플렉싱과 HTTP/3가 중요한 이유다 — HTTP/1.1에서는 이 많은 요청을 도메인당 최대 6개 연결로만 처리했다. DevTools Network 탭에서 "Waterfall" 컬럼이 이 요청들의 타임라인을 보여준다. 첫 HTML 요청이 들어오고, 이후 CSS/JS가 병렬로 내려받아지고, 마지막으로 JS가 실행되며 API 요청이 추가로 발생하는 패턴을 직접 확인할 수 있다.

---

---

# HTTP/1.1에서 Host 헤더가 필수가 된 이유와, 이것이 가상 호스팅(virtual hosting)을 가능하게 하는 원리는?

## 도입

하나의 서버(IP)에서 여러 도메인을 서비스하는 것을 가상 호스팅이라 한다. HTTP/1.0에서는 IP 하나에 도메인 하나만 가능했지만, HTTP/1.1의 `Host` 헤더 덕분에 IP 하나에 수천 개의 도메인을 올릴 수 있게 됐다.

---

## 본문

> A server is not necessarily a single machine, but several server software instances can be hosted on the same machine.

"서버는 반드시 단일 머신일 필요가 없으며, 같은 머신에서 여러 서버 소프트웨어 인스턴스를 호스팅할 수 있다."

- 물리 서버 하나에 여러 웹사이트를 올리는 것이 호스팅 업체의 기본 모델이다.

> With HTTP/1.1 and the Host header, they may even share the same IP address.

"HTTP/1.1과 Host 헤더를 사용하면, 그것들은 같은 IP 주소를 공유할 수 있다."

**HTTP/1.0 한계:**

```
IP: 1.2.3.4

GET / HTTP/1.0
(Host 없음)

서버: "이 IP로 요청이 왔는데 어느 도메인에 대한 거지?"
→ 알 수 없음 → IP 하나에 도메인 하나만 가능
```

**HTTP/1.1 Host 헤더:**

```
IP: 1.2.3.4 (same)

GET / HTTP/1.1
Host: example.com

→ 서버: "example.com에 대한 요청이구나"

GET / HTTP/1.1
Host: another.com

→ 서버: "another.com에 대한 요청이구나"

같은 IP인데 다른 도메인 서비스 가능
```

AWS에서 EC2 하나에 nginx를 띄우고 여러 도메인을 서비스할 때, nginx가 `Host` 헤더를 보고 어느 가상 호스트 설정을 적용할지 결정한다.

---

## 종합

Host 헤더는 단순해 보이지만 현대 웹 인프라의 근간이다. 공유 호스팅(한 서버에 수백 사이트), CDN(같은 엣지 서버에서 수천 도메인 서비스), 마이크로서비스 API 게이트웨이 모두 Host 헤더를 기반으로 라우팅한다. HTTPS에서는 TLS 핸드셰이크가 HTTP보다 먼저 일어나 Host 헤더를 볼 수 없어, SNI(Server Name Indication)가 TLS 레벨에서 같은 역할을 수행한다.

---

---

# 웹 브라우저가 Same-Origin Policy로 웹사이트 간 정보 접근을 제한하는데, HTTP는 이 제약을 어떻게 완화하는가?

## 도입

브라우저는 보안을 위해 다른 출처(origin)의 리소스에 마음대로 접근하지 못하게 막는다. 이것이 Same-Origin Policy(SOP)다. 그런데 `fetch('https://api.example.com')`처럼 다른 도메인 API를 호출해야 할 때가 많다. HTTP 헤더(CORS)가 이 제약을 완화하는 수단이다.

---

## 본문

> To prevent snooping and other privacy invasions, Web browsers enforce strict separation between websites.

"엿보기 및 기타 프라이버시 침해를 방지하기 위해 웹 브라우저는 웹사이트 간에 엄격한 분리를 강제한다."

- **snooping**: "엿보기" — `evil.com`에서 `bank.com`의 쿠키나 DOM을 읽는 것.

> Only pages from the same origin can access all the information of a Web page.

"같은 출처의 페이지만 웹 페이지의 모든 정보에 접근할 수 있다."

- **same origin**: 프로토콜 + 도메인 + 포트가 모두 같아야 한다. `https://example.com:443`와 `http://example.com`는 다른 출처다(프로토콜 다름).

> Though such a constraint is a burden to the server, HTTP headers can relax this strict separation on the server side, allowing a document to become a patchwork of information sourced from different domains.

"이런 제약이 서버에 부담이 되지만, HTTP 헤더가 서버 측에서 이 엄격한 분리를 완화할 수 있어, 문서가 다른 도메인에서 온 정보들의 패치워크가 될 수 있다."

- **HTTP headers**: `Access-Control-Allow-Origin` 헤더가 핵심. 서버가 "이 출처에서 오는 요청은 허용한다"고 선언한다.
- **patchwork of information**: 하나의 페이지가 여러 API 서버, CDN, 폰트 서버 등 다른 출처에서 오는 리소스들의 조합이다.

```js
// CORS 설정 없이
fetch('https://api.other.com/data')
// → CORS 에러: No 'Access-Control-Allow-Origin' header

// 서버가 CORS 헤더를 보내면
// 응답 헤더: Access-Control-Allow-Origin: https://my-app.com
// → 성공
```

Express CORS 설정 예:
```js
app.use(cors({ origin: 'https://my-app.com' }))
```

---

## 종합

CORS 에러는 프론트엔드 개발에서 가장 흔하게 만나는 에러 중 하나다. 원인은 서버가 `Access-Control-Allow-Origin` 헤더를 보내지 않아서이고, 해결은 서버가 이 헤더를 설정하는 것이다. 브라우저만의 제약이므로 `curl`이나 서버 간 통신에서는 CORS 에러가 발생하지 않는다. SOP는 사용자를 보호하기 위한 브라우저 정책이지, HTTP 프로토콜 자체의 규칙이 아니다.

---

---

# 클라이언트가 서버와 HTTP 통신을 수행하는 전체 흐름(4단계)은?

## 도입

`fetch('https://example.com/api')`를 호출했을 때 내부에서는 어떤 일이 벌어지는가? 4단계로 요약할 수 있다.

---

## 본문

> Open a TCP connection: The TCP connection is used to send a request, or several, and receive an answer. The client may open a new connection, reuse an existing connection, or open several TCP connections to the servers.

"TCP 연결 열기: TCP 연결은 하나 또는 여러 요청을 보내고 응답을 받는 데 사용된다. 클라이언트는 새 연결을 열거나, 기존 연결을 재사용하거나, 서버에 여러 TCP 연결을 열 수 있다."

- **reuse an existing connection**: HTTP/1.1 keep-alive. 이미 열린 연결이 있으면 TCP handshake 없이 바로 요청을 보낸다.

> Send an HTTP message: HTTP messages (before HTTP/2) are human-readable. With HTTP/2, these messages are encapsulated in frames, making them impossible to read directly, but the principle remains the same.

"HTTP 메시지 전송: HTTP 메시지(HTTP/2 이전)는 사람이 읽을 수 있다. HTTP/2에서는 이 메시지가 프레임에 캡슐화되어 직접 읽을 수 없게 되지만, 원칙은 동일하다."

> Read the response sent by the server.

"서버가 보낸 응답 읽기."

> Close or reuse the connection for further requests.

"추가 요청을 위해 연결을 닫거나 재사용하기."

```
1. TCP 연결
   └── 새 연결: SYN → SYN-ACK → ACK (3 RTT)
   └── 재사용: 바로 요청 (0 RTT 추가)

2. HTTP 요청 전송
   GET /api/data HTTP/1.1
   Host: example.com
   ...

3. 응답 수신
   HTTP/1.1 200 OK
   Content-Type: application/json
   ...
   {"data": ...}

4. 연결 닫기 or 재사용
   └── Connection: close → 즉시 닫음
   └── keep-alive → 다음 요청에 재사용
```

---

## 종합

이 4단계 흐름은 HTTP 버전이 바뀌어도 동일하다. HTTP/2에서는 1단계에서 TLS와 프로토콜 협상이 추가되고, 4단계에서 멀티플렉싱을 통해 연결 하나에 여러 요청이 동시에 처리된다. 하지만 "연결 열기 → 요청 → 응답 → 연결 관리"라는 큰 틀은 같다. `fetch()`의 `Promise`가 resolve되는 시점이 3단계에서 응답을 다 읽은 후다.

---

---

# HTTP는 서버가 먼저 클라이언트에게 데이터를 보낼 수 없는데, SSE(Server-Sent Events)는 이 제약을 어떻게 우회하는가?

## 도입

HTTP의 기본 원칙은 "브라우저가 먼저 요청한다"다. 그런데 실시간 알림, 라이브 피드처럼 서버가 새 데이터를 클라이언트에 "밀어주어야" 하는 경우가 있다. SSE는 이 제약을 HTTP 안에서 우아하게 우회하는 방법이다.

---

## 본문

> Another API, server-sent events, is a one-way service that allows a server to send events to the client, using HTTP as a transport mechanism.

"또 다른 API인 server-sent events는 HTTP를 전송 메커니즘으로 사용하여 서버가 클라이언트에 이벤트를 보낼 수 있는 단방향 서비스다."

- **one-way service**: 서버 → 클라이언트 방향만. 클라이언트 → 서버는 일반 HTTP 요청으로 별도 처리한다.
- **using HTTP as a transport mechanism**: WebSocket처럼 별도 프로토콜이 아니라 일반 HTTP 위에서 동작한다.

> Using the EventSource interface, the client opens a connection and establishes event handlers.

"EventSource 인터페이스를 사용하여 클라이언트가 연결을 열고 이벤트 핸들러를 설정한다."

- **EventSource**: 브라우저 내장 API. `new EventSource('/events')`로 서버에 연결을 열고 유지한다.

**SSE 동작 원리:**

```js
// 클라이언트
const source = new EventSource('/api/events')
source.onmessage = (e) => console.log(e.data)

// 이것이 하는 일:
// GET /api/events HTTP/1.1
// Accept: text/event-stream
// (연결을 닫지 않고 유지)
```

```js
// 서버 (Express)
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // 연결을 닫지 않고 계속 데이터를 보냄
  setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`)
  }, 1000)
})
```

서버는 응답을 끝내지 않고 연결을 열어두면서 데이터를 계속 흘린다. 클라이언트는 이 스트림을 읽어 이벤트로 처리한다. "서버가 먼저 보내는 것처럼 보이지만", 실제로는 클라이언트가 먼저 열어둔 연결에 서버가 응답을 계속 이어쓰는 것이다.

**SSE vs WebSocket:**

```
SSE:      단방향 (서버 → 클라이언트)
          일반 HTTP 위에서 동작
          프록시/방화벽 친화적
          자동 재연결 지원

WebSocket: 양방향
           별도 프로토콜 (HTTP 업그레이드)
           더 낮은 오버헤드 (양방향 실시간 통신)
```

---

## 종합

SSE는 주식 시세, 뉴스 피드, 배포 로그 스트리밍처럼 서버→클라이언트 단방향 실시간 스트림에 적합하다. WebSocket보다 단순하고 HTTP 위에서 동작해 인프라 설정이 간단하다는 장점이 있다. Next.js의 Route Handlers에서 `ReadableStream`으로 SSE를 구현하거나, OpenAI API의 스트리밍 응답도 이 방식을 사용한다.
