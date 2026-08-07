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
