---
tags: [network, protocol, concept]
source: official
---
# Questions
- HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?
- 클라이언트가 서버와 HTTP 통신을 수행하는 전체 흐름(4단계)은?
- HTTP는 서버가 먼저 클라이언트에게 데이터를 보낼 수 없는데, SSE(Server-Sent Events)는 이 제약을 어떻게 우회하는가?

---

# Answers

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
