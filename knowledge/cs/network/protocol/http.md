---
tags: [network, protocol, concept]
source: official
priority: 1
---

# Questions
- HTTP(Hypertext Transfer Protocol)란 무엇인가?
  - HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?
- HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?
  - HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?
- HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?
  - HTTP/1.0까지는 왜 요청마다 TCP 연결을 새로 맺어야 했고, HTTP/1.1의 keep-alive는 이를 어떻게 해결했는가?
    - HTTP/1.1의 파이프라이닝은 어떤 최적화를 시도했고, 왜 실패했는가?
    - HTTP/2와 HTTP/3는 영속 연결(persistent connection)을 어떻게 발전시켰는가?
- HTTP/2가 HTTP/1.1 대비 개선한 점은?
  - HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?
- 현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?
  - HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?
- HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?
- HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?
- HTTP/1.0의 조건부 GET 요청은 어떤 문제를 해결했으며, 어떤 한계가 있었는가?
  - HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?
- HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?
  - 웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?
- HTTP 메시지의 기본 구조는 어떻게 구성되는가?
  - HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?
- HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?
- HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?
- [HTTP 메서드(GET/POST/PUT/PATCH/DELETE)는 어떤 동작을 의미하며, safe·idempotent 분류는? → `http-methods.md`](http-methods.md)
- [HTTP 상태 코드(1XX~5XX)의 클래스와 자주 보는 코드는? → `http-status-codes.md`](http-status-codes.md)
- 다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라
  - 다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라
- 하나의 웹페이지를 표시하기 위해 브라우저는 HTTP 요청을 어떤 순서로 보내는가?
  - [HTTP로 받은 리소스들이 어떤 과정을 거쳐 화면에 그려지는가? → `critical-rendering-path.md`](../../frontend/browser/rendering-path/critical-rendering-path.md#critical-rendering-pathcrp란-무엇이며-어떤-단계로-구성되는가)
- HTTP/1.1에서 Host 헤더가 필수가 된 이유와, 이것이 가상 호스팅(virtual hosting)을 가능하게 하는 원리는?
  - [HTTPS에서는 Host 헤더를 볼 수 없는데, 같은 IP에서 여러 도메인을 어떻게 구분하는가? → `https.md`](https.md#tls-서버가-하나의-ip포트-조합에-하나의-인증서만-제시할-수-있는-이유와-이-제약을-sni가-어떻게-해결하는가)
- 웹 브라우저가 Same-Origin Policy로 웹사이트 간 정보 접근을 제한하는데, HTTP는 이 제약을 어떻게 완화하는가?
- 클라이언트가 서버와 HTTP 통신을 수행하는 전체 흐름(4단계)은?
- HTTP는 서버가 먼저 클라이언트에게 데이터를 보낼 수 없는데, SSE(Server-Sent Events)는 이 제약을 어떻게 우회하는가?

---

# Answers

## HTTP(Hypertext Transfer Protocol)란 무엇인가?

### Official Answer
HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite for distributed, collaborative, hypermedia information systems.
HTTP is the foundation of data communication for the World Wide Web, where hypertext documents include hyperlinks to other resources that the user can easily access, for example by a mouse click or by tapping the screen in a web browser.

HTTP is an application-layer protocol for transmitting hypermedia documents, such as HTML.
It was designed for communication between web browsers and web servers, but it can also be used for other purposes, such as machine-to-machine communication, programmatic access to APIs, and more.
HTTP is an extensible protocol that relies on concepts like resources and Uniform Resource Identifiers (URIs), a basic message structure, and client-server communication model.
New functionality can even be introduced by an agreement between a client and a server about a new header's semantics.

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?

### Official Answer
HTTP is a request-response protocol in the client-server model.
A transaction starts with a client submitting a request to the server, the server attempts to satisfy the request and returns a response to the client that describes the disposition of the request and optionally contains a requested resource such as an HTML document or other content.

Clients and servers communicate by exchanging individual messages (as opposed to a stream of data).
The messages sent by the client are called requests and the messages sent by the server as an answer are called responses.
The browser is always the entity initiating the request.
It is never the server (though some mechanisms have been added over the years to simulate server-initiated messages).

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?

### Official Answer
HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.
High-traffic websites often benefit from web cache servers that deliver content on behalf of upstream servers to improve response time.
Web browsers cache previously accessed web resources and reuse them, whenever possible, to reduce network traffic.
HTTP proxy servers at private network boundaries can facilitate communication for clients without a globally routable address, by relaying messages with external servers.

Those operating at the application layers are generally called proxies.
These can be transparent, forwarding on the requests they receive without altering them in any way, or non-transparent, in which case they will change the request in some way before passing it along to the server.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?

### Official Answer
To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions, some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?

### Official Answer
In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.
In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests (i.e. of HTML pages, frames, images, scripts, stylesheets, etc.).
HTTP/1.1 communications therefore experience less latency as the establishment of TCP connections presents considerable overhead, especially under high traffic conditions.

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

## HTTP/2가 HTTP/1.1 대비 개선한 점은?

### Official Answer
HTTP/2 adds support for:
a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space;
a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections;
one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets to almost solve the problem of the HOLB (head-of-line blocking);
a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?

### Official Answer
HTTP/3 uses QUIC + UDP transport protocols instead of TCP.
This slightly improves the average speed of communications and avoids the occasional problem of TCP connection congestion that can temporarily block or slow down the data flow of all its streams (another form of "head of line blocking").

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## 현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?

### Official Answer
HTTP/2 is supported by 71% of websites (34.1% HTTP/2 + 36.9% HTTP/3 with backwards compatibility) and supported by almost all web browsers (over 98% of users).
HTTP/3 is used on 36.9% of websites and is supported by most web browsers, i.e. (at least partially) supported by 97% of users.
HTTPS, the secure variant of HTTP, is used by more than 85% of websites.

As of June 2025, 71.2% of the Internet's 150,000 most popular websites have a secure implementation of HTTPS (up from 58.4% in December 2022).
However, despite TLS 1.3's release in 2018, adoption has been slow, with many still remaining on the older TLS 1.2 protocol.

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?

### Official Answer
Like HTTP/2, it does not obsolete previous major versions of the protocol.
HTTP/3 has lower latency for real-world web pages and loads faster than HTTP/2, in some cases over three times faster than HTTP/1.1, which is still commonly the only protocol enabled.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?

### Official Answer
HTTP presumes an underlying and reliable transport layer protocol.
The standard choice of the underlying protocol prior to HTTP/3 is Transmission Control Protocol (TCP).
HTTP/3 uses a different transport layer called QUIC, which provides reliability on top of the unreliable User Datagram Protocol (UDP).

A connection is controlled at the transport layer, and therefore fundamentally out of scope for HTTP.
HTTP doesn't require the underlying transport protocol to be connection-based; it only requires it to be reliable, or not lose messages (at minimum, presenting an error in such cases).

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?

### Official Answer
HTTP is a stateless application-level protocol and it requires a reliable network transport connection to exchange data between client and server.
In HTTP implementations, TCP/IP connections are used using well-known ports (typically port 80 if the connection is unencrypted or port 443 if the connection is encrypted).

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

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?

### Official Answer
Chunked transfer encoding allows content to be streamed in chunks in order to reliably send it even when the server does not know its length in advance (i.e. because it is dynamically generated, etc.).
Byte range serving allows a client to request portions (ranges of bytes) of a resource.
This is useful to resume an interrupted download (when a file is very large), when only a part of a content has to be shown or dynamically added to the already visible part by a browser in order to spare time, bandwidth and system resources, etc.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?

### Official Answer
As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.
If a web application needs an application session, it implements it via HTTP cookies, hidden variables in a web form or another mechanism.

HTTP is stateless: there is no link between two requests being successively carried out on the same connection.
But while the core of HTTP itself is stateless, HTTP cookies allow the use of stateful sessions.

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## 웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?

### Official Answer
Typically, to start a session, an interactive login is performed, and to end a session, a logout is requested by the user.
These kind of operations use a custom authentication mechanism, not HTTP authentication.
HTTP provides multiple authentication schemes such as basic access authentication and digest access authentication which operate via a challenge-response mechanism whereby the server identifies and issues a challenge before serving the requested content.
The authentication mechanisms described above belong to the HTTP protocol and are managed by client and server HTTP software (if configured to require authentication before allowing client access to one or more web resources), and not by the web applications using an application session.

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

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?

### Official Answer
Later versions, HTTP/2 and HTTP/3, use a binary protocol, where headers are encoded in a single HEADERS and zero or more CONTINUATION frames using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.
The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

HTTP is generally designed to be human-readable, even with the added complexity introduced in HTTP/2 by encapsulating HTTP messages into frames.
Even if only part of the original HTTP message is sent in this version of HTTP, the semantics of each message is unchanged and the client reconstitutes (virtually) the original HTTP/1.1 request.
It is therefore useful to comprehend HTTP/2 messages in the HTTP/1.1 format.

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?

### Official Answer
A header field represents metadata about the containing message.
A header field line is formatted as a name-value pair with a colon separator.
Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.
Unlike a method name that must match exactly (case-sensitive), a header field name is matched ignoring case although often shown with each word capitalized.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?

### Official Answer
A request is sent by a client to a server.
The start line includes a method name, a request URI and the protocol version with a single space between each field.
Request header fields allow the client to pass additional information beyond the request line, acting as request modifiers.
In the HTTP/1.1 protocol, all header fields except Host are optional.

Requests consist of the following elements:
An HTTP method, usually a verb like GET, POST, or a noun like OPTIONS or HEAD that defines the operation the client wants to perform.
The path of the resource to fetch; the URL of the resource stripped from elements that are obvious from the context, for example without the protocol, the domain, or the TCP port.
The version of the HTTP protocol.
Optional headers that convey additional information for the servers.
A body, for some methods like POST, similar to those in responses, which contain the resource sent.

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

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

Responses consist of the following elements:
The version of the HTTP protocol they follow.
A status code, indicating if the request was successful or not, and why.
A status message, a non-authoritative short description of the status code.
HTTP headers, like those for requests.
Optionally, a body containing the fetched resource.

### Reference
- https://en.wikipedia.org/wiki/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## 하나의 웹페이지를 표시하기 위해 브라우저는 HTTP 요청을 어떤 순서로 보내는가?

### Official Answer
To display a Web page, the browser sends an original request to fetch the HTML document that represents the page.
It then parses this file, making additional requests corresponding to execution scripts, layout information (CSS) to display, and sub-resources contained within the page (usually images and videos).
The Web browser then combines these resources to present the complete document, the Web page.
Scripts executed by the browser can fetch more resources in later phases and the browser updates the Web page accordingly.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## HTTP/1.1에서 Host 헤더가 필수가 된 이유와, 이것이 가상 호스팅(virtual hosting)을 가능하게 하는 원리는?

### Official Answer
A server is not necessarily a single machine, but several server software instances can be hosted on the same machine.
With HTTP/1.1 and the Host header, they may even share the same IP address.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## 웹 브라우저가 Same-Origin Policy로 웹사이트 간 정보 접근을 제한하는데, HTTP는 이 제약을 어떻게 완화하는가?

### Official Answer
To prevent snooping and other privacy invasions, Web browsers enforce strict separation between websites.
Only pages from the same origin can access all the information of a Web page.
Though such a constraint is a burden to the server, HTTP headers can relax this strict separation on the server side, allowing a document to become a patchwork of information sourced from different domains; there could even be security-related reasons to do so.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## 클라이언트가 서버와 HTTP 통신을 수행하는 전체 흐름(4단계)은?

### Official Answer
Open a TCP connection: The TCP connection is used to send a request, or several, and receive an answer.
The client may open a new connection, reuse an existing connection, or open several TCP connections to the servers.
Send an HTTP message: HTTP messages (before HTTP/2) are human-readable.
With HTTP/2, these messages are encapsulated in frames, making them impossible to read directly, but the principle remains the same.
Read the response sent by the server.
Close or reuse the connection for further requests.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview

---

## HTTP는 서버가 먼저 클라이언트에게 데이터를 보낼 수 없는데, SSE(Server-Sent Events)는 이 제약을 어떻게 우회하는가?

### Official Answer
Another API, server-sent events, is a one-way service that allows a server to send events to the client, using HTTP as a transport mechanism.
Using the EventSource interface, the client opens a connection and establishes event handlers.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
