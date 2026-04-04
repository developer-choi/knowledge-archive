---
tags: [network, protocol, concept]
---

# Questions
- [HTTP(Hypertext Transfer Protocol)란 무엇인가?](#httphypertext-transfer-protocol란-무엇인가)
  - [HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?](#http는-어떤-통신-모델을-사용하며-하나의-트랜잭션은-어떻게-구성되는가)
- [HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?](#http가-클라이언트-서버-사이에-중간-노드를-허용하도록-설계된-이유는)
  - [HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?](#http-헤더-중-hop-by-hop-헤더와-end-to-end-헤더의-차이는)
- [HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?](#http10에서-http11로-오면서-해결한-핵심-문제는)
- [HTTP/2가 HTTP/1.1 대비 개선한 점은?](#http2가-http11-대비-개선한-점은)
  - [HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?](#http2가-hol-blocking을-거의-해결했다고-하는-이유와-http3가-이를-완전히-해결한-방법은)
- [현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?](#현재-http-각-버전과-https의-채택률은-대략-어느-수준인가)
  - [HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?](#http3가-나왔는데-이전-버전http11-등은-폐기되었는가)
- [HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?](#http가-전송-계층에-요구하는-조건은-무엇이며-각-버전은-어떤-전송-프로토콜을-사용하는가)
- [HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?](#http가-stateless-프로토콜이라는-것은-무슨-의미이며-기본-포트는-무엇인가)
- [HTTP/1.0까지는 왜 요청마다 TCP 연결을 새로 맺어야 했고, HTTP/1.1의 keep-alive는 이를 어떻게 해결했는가?](#http10까지는-왜-요청마다-tcp-연결을-새로-맺어야-했고-http11의-keep-alive는-이를-어떻게-해결했는가)
  - [HTTP/1.1의 파이프라이닝은 어떤 최적화를 시도했고, 왜 실패했는가?](#http11의-파이프라이닝은-어떤-최적화를-시도했고-왜-실패했는가)
  - [HTTP/2와 HTTP/3는 영속 연결(persistent connection)을 어떻게 발전시켰는가?](#http2와-http3는-영속-연결persistent-connection을-어떻게-발전시켰는가)
- [HTTP/1.0의 조건부 GET 요청은 어떤 문제를 해결했으며, 어떤 한계가 있었는가?](#http10의-조건부-get-요청은-어떤-문제를-해결했으며-어떤-한계가-있었는가)
  - [HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?](#http11의-chunked-transfer-encoding과-byte-range-serving은-각각-어떤-문제를-해결하는가)
- [HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?](#http가-stateless인데-웹-애플리케이션은-어떻게-세션을-유지하는가)
  - [웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?](#웹-애플리케이션의-세션-기반-로그인과-http-프로토콜-수준의-인증은-어떻게-다른가)
- [HTTP 메시지의 기본 구조는 어떻게 구성되는가?](#http-메시지의-기본-구조는-어떻게-구성되는가)
  - [HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?](#http11의-텍스트-기반-메시지와-http2의-바이너리-프로토콜은-어떻게-다른가)
- [HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?](#http-헤더-필드란-무엇이며-어떤-형식으로-작성되는가)
- [HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?](#http-요청-메시지의-시작-줄은-어떻게-구성되며-필수-헤더는-무엇인가)
- [HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?](#http-메서드란-무엇이며-주요-메서드get-post-put-patch-delete의-역할은)
  - [PUT과 POST의 차이, PUT과 PATCH의 차이는?](#put과-post의-차이-put과-patch의-차이는)
- [HTTP에서 safe method란 무엇인가?](#http에서-safe-method란-무엇인가)
  - [safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?](#safe-method-원칙을-위반한-웹사이트에서-google-web-accelerator가-어떤-피해를-일으켰는가)
- [HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?](#http에서-idempotent멱등-메서드란-무엇이며-어떤-메서드가-멱등인가)
  - [POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?](#post가-멱등이-아니면-실무에서-어떤-문제가-발생하는가)
- [HTTP 응답의 상태 코드는 어떤 구조이며, 1XX~5XX 각 클래스의 의미는?](#http-응답의-상태-코드는-어떤-구조이며-1xx5xx-각-클래스의-의미는)
- [다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라](#다음-http-요청-예시에서-각-헤더의-역할을-설명하라)
  - [다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라](#다음-http-응답-예시에서-각-헤더의-역할을-설명하라)

---

# Answers

## HTTP(Hypertext Transfer Protocol)란 무엇인가?

### Official Answer
HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite for distributed, collaborative, hypermedia information systems.
HTTP is the foundation of data communication for the World Wide Web, where hypertext documents include hyperlinks to other resources that the user can easily access, for example by a mouse click or by tapping the screen in a web browser.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?

### Official Answer
HTTP is a request-response protocol in the client-server model.
A transaction starts with a client submitting a request to the server, the server attempts to satisfy the request and returns a response to the client that describes the disposition of the request and optionally contains a requested resource such as an HTML document or other content.

> #### AI Annotation:
> 클라이언트가 먼저 요청을 보내고, 서버가 응답하는 단방향 구조다.
> 서버가 먼저 클라이언트에게 데이터를 밀어넣을 수 없으며, 이 한계를 극복하기 위해 WebSocket 같은 프로토콜이 등장했다.
> 응답에는 항상 처리 결과(disposition)가 담기지만, 본문(리소스)은 선택적이다 (예: 204 No Content, 304 Not Modified).

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?

### Official Answer
HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.
High-traffic websites often benefit from web cache servers that deliver content on behalf of upstream servers to improve response time.
Web browsers cache previously accessed web resources and reuse them, whenever possible, to reduce network traffic.
HTTP proxy servers at private network boundaries can facilitate communication for clients without a globally routable address, by relaying messages with external servers.

> #### AI Annotation:
> 대표적인 중간 노드: 웹 캐시 서버(CDN — Cloudflare, CloudFront 등)는 원본 서버 대신 콘텐츠를 전달하여 응답 시간을 줄이고, 프록시 서버는 공인 IP가 없는 사설 네트워크 클라이언트의 외부 통신을 중계한다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?

### Official Answer
To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions, some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

> #### AI Annotation:
> hop-by-hop 헤더(예: `Connection`, `Keep-Alive`)는 중간 노드(프록시, 캐시)가 읽고 처리하고 변경할 수 있다.
> end-to-end 헤더(예: `Content-Type`, `Authorization`)는 출발지 클라이언트와 최종 서버만 관리하며, 중간 노드는 건드리지 않고 그대로 전달해야 한다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?

### Official Answer
In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.
In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests (i.e. of HTML pages, frames, images, scripts, stylesheets, etc.).
HTTP/1.1 communications therefore experience less latency as the establishment of TCP connections presents considerable overhead, especially under high traffic conditions.

> #### AI Annotation:
> HTTP/1.0에서는 리소스 하나당 TCP 연결을 새로 맺었다. HTML 페이지에 이미지 10개가 있으면 TCP 연결을 11번 열었다 닫아야 한다.
> HTTP/1.1의 keep-alive(persistent connection)로 연결을 재사용하면, TCP 3-way handshake 오버헤드를 줄이고 slow-start로 워밍업된 연결을 계속 쓸 수 있다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/2가 HTTP/1.1 대비 개선한 점은?

### Official Answer
HTTP/2 adds support for:
a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space;
a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections;
one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets to almost solve the problem of the HOLB (head-of-line blocking);
a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).

> #### AI Annotation:
> HTTP/1.1에서는 브라우저가 병렬성을 위해 같은 서버에 2~8개의 TCP 연결을 동시에 열었다.
> HTTP/2는 하나의 TCP 연결 안에서 여러 스트림을 멀티플렉싱하므로 연결 하나로 충분하다.
> 서버 푸시는 클라이언트가 polling 없이도 새 데이터를 받을 수 있게 해준다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?

### Official Answer
HTTP/3 uses QUIC + UDP transport protocols instead of TCP.
This slightly improves the average speed of communications and avoids the occasional problem of TCP connection congestion that can temporarily block or slow down the data flow of all its streams (another form of "head of line blocking").

> #### AI Annotation:
> HTTP/2는 애플리케이션 계층의 HOL blocking(앞선 요청이 끝나야 뒤의 요청이 처리됨)은 멀티플렉싱으로 해결했지만, TCP 계층의 HOL blocking이 남아있다.
> TCP에서는 하나의 패킷이 유실되면 그 연결 위의 **모든 스트림**이 멈춘다.
> HTTP/3는 TCP를 QUIC+UDP로 교체하여, 패킷 유실 시 해당 스트림만 영향을 받도록 했다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## 현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?

### Official Answer
HTTP/2 is supported by 71% of websites (34.1% HTTP/2 + 36.9% HTTP/3 with backwards compatibility) and supported by almost all web browsers (over 98% of users).
HTTP/3 is used on 36.9% of websites and is supported by most web browsers, i.e. (at least partially) supported by 97% of users.
HTTPS, the secure variant of HTTP, is used by more than 85% of websites.

> #### Official Annotation:
> As of June 2025, 71.2% of the Internet's 150,000 most popular websites have a secure implementation of HTTPS (up from 58.4% in December 2022).
> However, despite TLS 1.3's release in 2018, adoption has been slow, with many still remaining on the older TLS 1.2 protocol.
> — https://en.wikipedia.org/wiki/HTTPS

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?

### Official Answer
Like HTTP/2, it does not obsolete previous major versions of the protocol.
HTTP/3 has lower latency for real-world web pages and loads faster than HTTP/2, in some cases over three times faster than HTTP/1.1, which is still commonly the only protocol enabled.

> #### AI Annotation:
> HTTP의 새 버전이 나와도 이전 버전은 폐기되지 않고 공존한다.
> HTTP/3가 최대 3배 이상 빠름에도 불구하고, HTTP/1.1만 활성화된 서버가 아직 흔하다는 것이 현실이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?

### Official Answer
HTTP presumes an underlying and reliable transport layer protocol.
The standard choice of the underlying protocol prior to HTTP/3 is Transmission Control Protocol (TCP).
HTTP/3 uses a different transport layer called QUIC, which provides reliability on top of the unreliable User Datagram Protocol (UDP).

> #### AI Annotation:
> HTTP 자체는 패킷 유실이나 순서 보장을 신경 쓰지 않는다 — 하위 전송 계층이 해줄 거라고 전제한다.
> TCP는 재전송과 순서 보장으로 신뢰성을 제공하고, QUIC은 "신뢰할 수 없는" UDP 위에 신뢰성을 직접 구현한 프로토콜이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?

### Official Answer
HTTP is a stateless application-level protocol and it requires a reliable network transport connection to exchange data between client and server.
In HTTP implementations, TCP/IP connections are used using well-known ports (typically port 80 if the connection is unencrypted or port 443 if the connection is encrypted).

> #### AI Annotation:
> stateless란 서버가 이전 요청의 정보를 기억하지 않는다는 뜻이다.
> 로그인 상태를 유지하려면 쿠키, 세션, JWT 같은 별도 메커니즘이 필요한 이유가 바로 이것이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.0까지는 왜 요청마다 TCP 연결을 새로 맺어야 했고, HTTP/1.1의 keep-alive는 이를 어떻게 해결했는가?

### Official Answer
In HTTP/1.0, the TCP/IP connection should always be closed by server after a response has been sent.
In HTTP/1.1, a keep-alive-mechanism was officially introduced so that a connection could be reused for more than one request/response.
Such persistent connections reduce request latency perceptibly because the client does not need to re-negotiate the TCP 3-Way-Handshake connection after the first request has been sent.
Another positive side effect is that, in general, the connection becomes faster with time due to TCP's slow-start-mechanism.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.1의 파이프라이닝은 어떤 최적화를 시도했고, 왜 실패했는가?

### Official Answer
HTTP/1.1 added also HTTP pipelining in order to further reduce lag time when using persistent connections by allowing clients to send multiple requests before waiting for each response.
This optimization was never considered really safe because a few web servers and many proxy servers, specially transparent proxy servers placed in Internet / Intranets between clients and servers, did not handle pipelined requests properly (they served only the first request discarding the others, they closed the connection because they saw more data after the first request or some proxies even returned responses out of order etc.).
Because of this, only HEAD and some GET requests could be pipelined in a safe and idempotent mode.
After many years of struggling with the problems introduced by enabling pipelining, this feature was first disabled and then removed from most browsers also because of the announced adoption of HTTP/2.

> #### AI Annotation:
> 파이프라이닝은 "응답을 기다리지 않고 요청을 연달아 보내기"라는 좋은 아이디어였지만, 현실의 프록시/서버 호환성 문제로 실패했다.
> HTTP/2의 멀티플렉싱이 이 문제를 근본적으로 해결하면서 파이프라이닝은 역사 속으로 사라졌다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/2와 HTTP/3는 영속 연결(persistent connection)을 어떻게 발전시켰는가?

### Official Answer
HTTP/2 extended the usage of persistent connections by multiplexing many concurrent requests/responses through a single TCP/IP connection.
HTTP/3 does not use TCP/IP connections but QUIC + UDP.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.0의 조건부 GET 요청은 어떤 문제를 해결했으며, 어떤 한계가 있었는가?

### Official Answer
HTTP/1.0 added headers to manage resources cached by a client in order to allow conditional GET requests.
A server must return the entire content of the requested resource only if its last modified time is not known by the client or if it changed since the last full response to a GET request.
Header Content-Encoding was added to specify whether the returned content is compressed.
If the size of the content is not known in advance (i.e. because it is dynamically generated) then the header Content-Length would not be included.
The client would assume that transfer was complete when the connection closed, but a premature close would leave the client with partial content yet the client would not know it's partial.

> #### AI Annotation:
> 조건부 GET의 핵심: 리소스가 변경되지 않았으면 서버가 전체 콘텐츠를 다시 보내지 않는다 (304 Not Modified).
> 하지만 동적 콘텐츠는 크기를 미리 알 수 없어 Content-Length가 빠지고, 연결이 비정상 종료되면 클라이언트가 불완전한 콘텐츠를 완전하다고 착각하는 문제가 있었다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?

### Official Answer
Chunked transfer encoding allows content to be streamed in chunks in order to reliably send it even when the server does not know its length in advance (i.e. because it is dynamically generated, etc.).
Byte range serving allows a client to request portions (ranges of bytes) of a resource.
This is useful to resume an interrupted download (when a file is very large), when only a part of a content has to be shown or dynamically added to the already visible part by a browser in order to spare time, bandwidth and system resources, etc.

> #### AI Annotation:
> chunked encoding은 HTTP/1.0의 "Content-Length 없으면 연결 닫힐 때까지 기다리기" 문제를 해결했다. 청크마다 크기를 명시하고, 크기 0인 청크가 전송 완료를 알린다.
> byte range serving은 `Range: bytes=1000-2000` 헤더로 특정 범위만 요청한다. 대용량 파일 이어받기의 원리다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?

### Official Answer
As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.
If a web application needs an application session, it implements it via HTTP cookies, hidden variables in a web form or another mechanism.

> #### AI Annotation:
> HTTP 자체는 상태를 유지하지 않으므로, 세션은 애플리케이션 레벨에서 쿠키, hidden 변수 등으로 구현한다.
> HTTP가 제공하는 기능이 아니라 그 위에서 만들어낸 것이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## 웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?

### Official Answer
Typically, to start a session, an interactive login is performed, and to end a session, a logout is requested by the user.
These kind of operations use a custom authentication mechanism, not HTTP authentication.
HTTP provides multiple authentication schemes such as basic access authentication and digest access authentication which operate via a challenge-response mechanism whereby the server identifies and issues a challenge before serving the requested content.
The authentication mechanisms described above belong to the HTTP protocol and are managed by client and server HTTP software (if configured to require authentication before allowing client access to one or more web resources), and not by the web applications using an application session.

> #### AI Annotation:
> 세션 기반 로그인(쿠키/JWT)은 웹 애플리케이션이 관리하는 커스텀 인증이다.
> HTTP 인증(Basic/Digest)은 프로토콜 레벨에서 HTTP 소프트웨어(웹서버, 브라우저)가 관리하며, 서버가 먼저 challenge를 보내고 클라이언트가 인증 정보로 응답하는 challenge-response 방식이다.
> 대부분의 현대 웹앱은 전자(세션 기반)를 사용한다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 메시지의 기본 구조는 어떻게 구성되는가?

### Official Answer
At the highest level, a message consists of a header followed by a body.
A header consists of lines of ASCII text; each terminated with a carriage return and line feed sequence.
A body consists of data in any format; not limited to ASCII.
The format must match that specified by the Content-Type header field if the message contains one.
A body is optional or, in other words, can be blank.

> #### AI Annotation:
> 헤더의 구조: 시작 줄(Start line) → 헤더 필드들(0개 이상) → 빈 줄(헤더 끝 표시).
> 본문은 모든 형식이 가능하며(JSON, HTML, 이미지 등), Content-Type 헤더로 형식을 명시한다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?

### Official Answer
Later versions, HTTP/2 and HTTP/3, use a binary protocol, where headers are encoded in a single HEADERS and zero or more CONTINUATION frames using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.
The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

> #### AI Annotation:
> HTTP/1.1은 사람이 읽을 수 있는 ASCII 텍스트로 헤더를 전송한다.
> HTTP/2+는 바이너리 프레임으로 인코딩하고, HPACK(HTTP/2) 또는 QPACK(HTTP/3)으로 헤더를 압축한다.
> HTTP/1의 요청 라인(예: `GET / HTTP/1.1`)은 pseudo-header 필드(`:method`, `:path` 등)로 대체됐다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?

### Official Answer
A header field represents metadata about the containing message.
A header field line is formatted as a name-value pair with a colon separator.
Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.
Unlike a method name that must match exactly (case-sensitive), a header field name is matched ignoring case although often shown with each word capitalized.

> #### AI Annotation:
> 헤더 필드는 `이름: 값` 형태의 메타데이터다 (예: `Content-Type: application/json`).
> 메서드 이름(GET, POST)은 대소문자를 구분하지만, 헤더 필드 이름은 대소문자를 구분하지 않는다. `Content-Type`과 `content-type`은 동일하게 처리된다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?

### Official Answer
A request is sent by a client to a server.
The start line includes a method name, a request URI and the protocol version with a single space between each field.
Request header fields allow the client to pass additional information beyond the request line, acting as request modifiers.
In the HTTP/1.1 protocol, all header fields except Host are optional.

> #### AI Annotation:
> 요청 시작 줄 예시: `GET /customer/123 HTTP/1.1` — 메서드 + URI + 버전.
> Host만 필수인 이유는 하나의 IP에 여러 도메인이 호스팅될 수 있어서(가상 호스팅), 어느 도메인에 대한 요청인지 명시해야 하기 때문이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?

### Official Answer
A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.
GET: The request is for a representation of a resource.
The server should only retrieve data; not modify state.
For retrieving without making changes, GET is preferred over POST, as it can be addressed through a URL.
This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.
POST: The request is to process a resource in some way.
For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.
PUT: The request is to create or update a resource with the state in the request.
DELETE: The request is to delete a resource.
PATCH: The request is to modify a resource according to its partial state in the request.
Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## PUT과 POST의 차이, PUT과 PATCH의 차이는?

### Official Answer
POST: The request is to process a resource in some way.
PUT: The request is to create or update a resource with the state in the request.
A distinction from POST is that the client specifies the target location on the server.
PATCH: The request is to modify a resource according to its partial state in the request.
Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

> #### AI Annotation:
> PUT vs POST: PUT은 클라이언트가 리소스의 대상 URI를 지정한다 (`PUT /users/123`). POST는 서버가 위치를 결정한다 (`POST /users` → 서버가 ID 할당).
> PUT vs PATCH: PUT은 리소스 전체를 교체한다. 이름만 바꾸고 싶어도 전체 데이터를 보내야 한다. PATCH는 변경된 필드만 보내면 된다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP에서 safe method란 무엇인가?

### Official Answer
A request method is safe if a request with that method has no intended effect on the server.
The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.
In other words, safe methods are intended to be read-only.
In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.
They may modify the state of the server or have other effects such as sending an email.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?

### Official Answer
Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.
Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.
For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.
A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.
One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.
The beta was suspended only weeks after its first release, following widespread criticism.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

### Official Answer
A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.
The methods PUT and DELETE, and safe methods are defined as idempotent.
Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.
In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent, and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.
Note that whether or not a method is idempotent is not enforced by the protocol or web server.

> #### AI Annotation:
> 멱등 정리: GET/PUT/DELETE = 멱등 (여러 번 보내도 한 번과 같음), POST/PATCH = 비멱등 (중복 시 부작용).

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

### Official Answer
In some cases this is the desired effect, but in other cases it may occur accidentally.
A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.
While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

> #### AI Annotation:
> FE 실무에서 직접 겪는 문제: 버튼 연타로 POST 중복 전송 → 중복 주문, 이메일 다중 발송. 로딩 인디케이터나 버튼 비활성화로 방지해야 하며, 이는 웹 애플리케이션의 책임이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 응답의 상태 코드는 어떤 구조이며, 1XX~5XX 각 클래스의 의미는?

### Official Answer
The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.
A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit and treat an unrecognized code as equivalent to the x00 code of that class.
1XX informational: The request was received, continuing process.
2XX successful: The request was successfully received, understood, and accepted.
3XX redirection: Further action needs to be taken in order to complete the request.
4XX client error: The request cannot be fulfilled due to an issue that the client might be able to control.
5XX server error: The server failed to fulfill an apparently valid request.

> #### AI Annotation:
> 모르는 상태 코드를 받으면 첫 자릿수(클래스)로 판단한다. 예: 알 수 없는 `499`를 받으면 `400`(Client Error)으로 처리.
> 상태 코드는 기계가 읽는 것이고, 사유 구문(Bad Request 등)은 사람이 읽는 것이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## 다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라

```
GET / HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

### Official Answer
The Host header field distinguishes between various DNS names sharing a single IP address, allowing name-based virtual hosting.
While optional in HTTP/1.0, it is mandatory in HTTP/1.1.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## 다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라

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

### Official Answer
The ETag (entity tag) header field is used to determine if a cached version of the requested resource is identical to the current version of the resource on the server.
The Content-Type header field specifies the Internet media type of the data conveyed by the HTTP message, and Content-Length indicates its length in bytes.
The HTTP/1.1 webserver publishes its ability to respond to requests for a byte range of the resource by including Accept-Ranges: bytes.
When Connection: close is sent, it means that the web server will close the TCP connection immediately after the end of the transfer of this response.
When header Content-Length is missing from a response with a body, then this should be considered an error in HTTP/1.0 but it may not be an error in HTTP/1.1 if header Transfer-Encoding: chunked is present.
Content-Encoding: gzip informs the client that the body is compressed per the gzip algorithm.

### Reference
- https://en.wikipedia.org/wiki/HTTP
