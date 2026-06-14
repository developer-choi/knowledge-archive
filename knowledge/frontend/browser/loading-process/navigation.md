---
tags: [browser, network, performance]
source: official
priority:
---

# Questions
- Navigation이란 무엇이며 언제 발생하는가?
- 주소창에 URL을 입력하면 브라우저가 수행하는 전체 흐름은?
- HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?
  - [DNS lookup에서 호스트명은 어떻게 IP 주소로 변환되는가? → `address.md`](../../../cs/network/address.md#호스트명이란-무엇이며-네트워크-주소로-어떻게-변환되는가)
  - [TLS negotiation에서 장기 키와 세션 키는 어떤 역할을 하는가? → `https.md`](../../../cs/network/protocol/https.md#tls가-데이터를-암호화하는-과정에서-장기-키와-세션-키의-역할은)
  - [TCP 연결 후 HTTP 통신의 전체 흐름(4단계)은? → `http.md`](../../../cs/network/protocol/http.md#클라이언트가-서버와-http-통신을-수행하는-전체-흐름4단계은)
- DNS lookup이란 무엇이며 왜 캐싱되는가?
- Redirect는 왜 성능에 부정적인가?
- 페이지가 paint된 직후에도 브라우저가 'all set' 상태가 아닐 수 있는 이유는?
- [UNVERIFIED] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

---

# Answers

## Navigation이란 무엇이며 언제 발생하는가?

### Official Answer
Navigation is the first step in loading a web page.
It occurs whenever a user requests a page by entering a URL into the address bar, clicking a link, submitting a form, as well as other actions.

One of the goals of web performance is to minimize the amount of time navigation takes to complete.
In ideal conditions, this usually doesn't take too long, but latency and bandwidth are foes that can cause delays.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## 주소창에 URL을 입력하면 브라우저가 수행하는 전체 흐름은?

### Official Answer
The browser goes to the DNS server and finds the real address of the server that the website lives on.

The browser sends an HTTP request message to the server, asking it to send the website.

The browser and the server exchange data over your internet using TCP/IP.

If the server approves the client's request, it sends a '200 OK' message along with the website's files, split into small chunks called data packets.

The browser assembles the small chunks into a complete web page and displays it to you.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works

---

## HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?

### Official Answer
Once the IP address is known, the browser sets up a connection to the server via a TCP three-way handshake.
TCP's three-way handshaking technique is often referred to as "SYN-SYN-ACK" — or more accurately SYN, SYN-ACK, ACK — because there are three messages transmitted by TCP to negotiate and start a TCP session between two computers.
For secure connections established over HTTPS, another "handshake" is required.
This handshake, or rather the TLS negotiation, determines which cipher will be used to encrypt the communication, verifies the server, and establishes that a secure connection is in place before beginning the actual transfer of data.
This requires five more round trips to the server before the request for content is actually sent.
After the eight round trips to the server, the browser is finally able to make the request.

### Review Note
- 각 단계별 정확한 round-trip 횟수는 중요하지 않음
- 각 단계(DNS, TCP, TLS)에서 어떤 작업이 수행되는지 설명할 수 있는가가 핵심

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## DNS lookup이란 무엇이며 왜 캐싱되는가?

### Official Answer
The first step of navigating to a web page is finding where the assets for that page are located.
If you navigate to https://example.com, the HTML page is located on the server with IP address of 93.184.216.34.
If you've never visited this site, a DNS lookup must happen.

A DNS lookup returns an IP address, which is cached to speed up future requests.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Redirect는 왜 성능에 부정적인가?

### Official Answer
When a resource is requested, the server may respond with a redirect, either with a permanent redirect (a 301 Moved Permanently response) or a temporary one (a 302 Found response).
Redirects slow down page load speed because it requires the browser to make an additional HTTP request at the new location to retrieve the resource.

### Reference
- https://web.dev/learn/performance/general-html-performance#minimize_redirects

---

## 페이지가 paint된 직후에도 브라우저가 'all set' 상태가 아닐 수 있는 이유는?

### Official Answer
Once the main thread is done painting the page, you would think we would be "all set."
That isn't necessarily the case.
If the load includes JavaScript, that was correctly deferred, and only executed after the onload event fires, the main thread might be busy, and not available for scrolling, touch, and other interactions.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## [UNVERIFIED] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

### Additional Answer
HTTP 캐시에 리소스가 있으면 DNS lookup, TCP handshake, TLS negotiation, HTTP 요청/응답 등 네트워크 단계 전체를 건너뛸 수 있다.
DNS 캐시만 있는 경우는 DNS lookup만 건너뛴다.
캐싱 수준에 따라 건너뛰는 단계의 범위가 달라진다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
