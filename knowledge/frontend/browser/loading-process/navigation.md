---
tags: [browser, network, performance]
---

# Questions
- Navigation이란 무엇이며 언제 발생하는가?
- 주소창에 URL을 입력하면 브라우저가 수행하는 전체 흐름은?
- HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?
  - [DNS lookup에서 호스트명은 어떻게 IP 주소로 변환되는가? → `network-address.md`](../../../cs/network/network-address.md#호스트명이란-무엇이며-네트워크-주소로-어떻게-변환되는가)
  - [TLS negotiation에서 장기 키와 세션 키는 어떤 역할을 하는가? → `https.md`](../../../cs/network/protocol/https.md#tls가-데이터를-암호화하는-과정에서-장기-키와-세션-키의-역할은)
  - [TCP 연결 후 HTTP 통신의 전체 흐름(4단계)은? → `http.md`](../../../cs/network/protocol/http.md#클라이언트가-서버와-http-통신을-수행하는-전체-흐름4단계은)
- DNS lookup이란 무엇이며 왜 캐싱되는가?
- Redirect는 왜 성능에 부정적인가?
- 페이지가 paint된 직후에도 브라우저가 'all set' 상태가 아닐 수 있는 이유는?
- [TODO] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

---

# Answers

## Navigation이란 무엇이며 언제 발생하는가?

### Official Answer
Navigation is the first step in loading a web page.
It occurs whenever a user requests a page by entering a URL into the address bar, clicking a link, submitting a form, as well as other actions.

One of the goals of web performance is to minimize the amount of time navigation takes to complete.
In ideal conditions, this usually doesn't take too long, but latency and bandwidth are foes that can cause delays.

> #### Key Terms:
> - **latency**: 요청과 응답 사이의 지연 시간
> - **bandwidth**: 단위 시간당 전송 가능한 데이터량

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

> #### Key Terms:
> - **DNS server**: 도메인 이름을 IP 주소로 변환해 주는 서버
> - **data packets**: 네트워크 전송을 위해 분할된 작은 데이터 조각

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

> #### AI Annotation:
> 전체 흐름 (DNS는 별도 서버이므로 웹 서버와의 8왕복에서 제외):
> ```
> Client                                     Server
>   │                                           │
>   │   ①  DNS lookup (별도 DNS 서버)            │
>   │                                           │
>   │── ② SYN ─────────────────────────────────→│
>   │                                           │  TCP
>   │←──────────────────────────── ③ SYN-ACK ───│  3-way
>   │                                           │  handshake
>   │── ④ ACK ─────────────────────────────────→│
>   │                                           │
>   │── ⑤ ClientHello ─────────────────────────→│
>   │                                           │
>   │←──────────── ⑥ ServerHello + Certificate ─│  TLS
>   │                                           │  negotiation
>   │── ⑦ ClientKey ───────────────────────────→│
>   │                                           │
>   │←──────────────────────────── ⑧ Finished ──│
>   │                                           │
>   │── ⑨ Finished ────────────────────────────→│
>   │                                           │
>   │── HTTP Request ──────────────────────────→│  ← 드디어!
>   │                                           │
> ```
> TCP handshake: SYN → SYN-ACK → ACK로 연결 파라미터를 협상한다.
> TLS negotiation: 사용할 cipher 결정 + 서버 인증서 검증 + 보안 연결 수립.
> 원본 다이어그램: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work/ssl.jpg

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

> #### Key Terms:
> - **DNS lookup**: 도메인 이름을 IP 주소로 변환하는 조회 과정
> - **IP address**: 서버를 식별하는 네트워크 주소

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Redirect는 왜 성능에 부정적인가?

### Official Answer
When a resource is requested, the server may respond with a redirect, either with a permanent redirect (a 301 Moved Permanently response) or a temporary one (a 302 Found response).
Redirects slow down page load speed because it requires the browser to make an additional HTTP request at the new location to retrieve the resource.

> #### Key Terms:
> - **301 Moved Permanently**: 영구 리다이렉트 응답
> - **302 Found**: 임시 리다이렉트 응답

### Reference
- https://web.dev/learn/performance/general-html-performance#minimize_redirects

---

## 페이지가 paint된 직후에도 브라우저가 'all set' 상태가 아닐 수 있는 이유는?

### Official Answer
Once the main thread is done painting the page, you would think we would be "all set."
That isn't necessarily the case.
If the load includes JavaScript, that was correctly deferred, and only executed after the onload event fires, the main thread might be busy, and not available for scrolling, touch, and other interactions.

> #### Key Terms:
> - **main thread**: 브라우저가 렌더링·스크립트 실행을 처리하는 단일 스레드
> - **onload event**: 페이지의 모든 리소스 로드가 끝났을 때 발생하는 이벤트

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## [TODO] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

### AI Answer
HTTP 캐시에 리소스가 있으면 DNS lookup, TCP handshake, TLS negotiation, HTTP 요청/응답 등 네트워크 단계 전체를 건너뛸 수 있다.
DNS 캐시만 있는 경우는 DNS lookup만 건너뛴다.
캐싱 수준에 따라 건너뛰는 단계의 범위가 달라진다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
