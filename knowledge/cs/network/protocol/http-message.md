---
tags: [network, protocol, concept]
source: official
priority: 2
---

# Questions
- HTTP 메시지의 기본 구조는 어떻게 구성되는가?
  - HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?
- HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?
- HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?
- [HTTP 메서드(GET/POST/PUT/PATCH/DELETE)는 어떤 동작을 의미하며, safe·idempotent 분류는? → `http-methods.md`](http-methods.md)
- [HTTP 상태 코드(1XX~5XX)의 클래스와 자주 보는 코드는? → `http-status-codes.md`](http-status-codes.md)
- 다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라
  - 다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라
- 하나의 웹페이지를 표시하기 위해 브라우저는 HTTP 요청을 어떤 순서로 보내는가?
  - [HTTP로 받은 리소스들이 어떤 과정을 거쳐 화면에 그려지는가? → `critical-rendering-path.md`](../../../frontend/browser/rendering-path/critical-rendering-path.md#critical-rendering-pathcrp란-무엇이며-어떤-단계로-구성되는가)
- HTTP/1.1에서 Host 헤더가 필수가 된 이유와, 이것이 가상 호스팅(virtual hosting)을 가능하게 하는 원리는?
  - [HTTPS에서는 Host 헤더를 볼 수 없는데, 같은 IP에서 여러 도메인을 어떻게 구분하는가? → `https.md`](https.md#tls-서버가-하나의-ip포트-조합에-하나의-인증서만-제시할-수-있는-이유와-이-제약을-sni가-어떻게-해결하는가)

---

# Answers

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
