---
tags: [network, protocol, concept]
source: official
priority: 2
---

# Questions
- HTTP(Hypertext Transfer Protocol)란 무엇인가?
  - HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?
- HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?
  - HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?
- HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?
- HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?
  - HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?
    - 웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?
- 웹 브라우저가 Same-Origin Policy로 웹사이트 간 정보 접근을 제한하는데, HTTP는 이 제약을 어떻게 완화하는가?
- 클라이언트가 서버와 HTTP 통신을 수행하는 전체 흐름(4단계)은?
- HTTP는 서버가 먼저 클라이언트에게 데이터를 보낼 수 없는데, SSE(Server-Sent Events)는 이 제약을 어떻게 우회하는가?

## 관련 주제
- [HTTP 버전 역사 · keep-alive · HOL blocking → `http-versions.md`](http-versions.md)
- [HTTP 메시지 구조 · 헤더 · 요청/응답 예시 → `http-message.md`](http-message.md)
- [HTTP 메서드 · safe · idempotent → `http-methods.md`](http-methods.md)
- [HTTP 상태 코드 → `http-status-codes.md`](http-status-codes.md)

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
