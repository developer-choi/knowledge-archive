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
