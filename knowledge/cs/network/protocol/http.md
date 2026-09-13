---
tags: [network, protocol, concept]
source: official
priority: 2
---

# Questions
- HTTP(Hypertext Transfer Protocol)란 무엇인가?
- HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?
  - HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?

## 관련 주제
- [HTTP 버전 역사 · keep-alive · HOL blocking → `http-versions.md`](http-versions.md)
- [HTTP 메시지 구조 · 헤더 · 요청/응답 예시 → `http-message.md`](http-message.md)
- [HTTP 메서드 · safe → `http-methods.md`](http-methods.md)
- [HTTP 멱등성 · Idempotency-Key → `http-idempotency.md`](http-idempotency.md)
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
