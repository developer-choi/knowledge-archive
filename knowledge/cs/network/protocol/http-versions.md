---
tags: [network, protocol, concept]
source: official
priority: 2
---

# Questions
- HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?
  - HTTP/1.0까지는 왜 요청마다 TCP 연결을 새로 맺어야 했고, HTTP/1.1의 keep-alive는 이를 어떻게 해결했는가?
    - HTTP/1.1의 파이프라이닝은 어떤 최적화를 시도했고, 왜 실패했는가?
    - HTTP/2와 HTTP/3는 영속 연결(persistent connection)을 어떻게 발전시켰는가?
- HTTP/2가 HTTP/1.1 대비 개선한 점은?
  - HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?
- 현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?
  - HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?
- HTTP/1.0의 조건부 GET 요청은 어떤 문제를 해결했으며, 어떤 한계가 있었는가?
  - HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?

---

# Answers

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
