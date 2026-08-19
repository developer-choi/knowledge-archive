---
tags: [browser, network, performance]
source: official
---

# Questions
- HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?
  - [DNS lookup에서 호스트명은 어떻게 IP 주소로 변환되는가? → `address.md`](../../../cs/network/address.md#도메인명은-어떻게-네트워크-주소로-변환되는가)
  - [TLS negotiation에서 장기 키와 세션 키는 어떤 역할을 하는가? → `https.md`](../../../cs/network/protocol/https.md#tls가-데이터를-암호화하는-과정에서-장기-키와-세션-키의-역할은)
  - [TCP 연결 후 HTTP 통신의 전체 흐름(4단계)은? → `http.md`](../../../cs/network/protocol/http.md#클라이언트가-서버와-http-통신을-수행하는-전체-흐름4단계은)
- 페이지가 paint된 직후에도 브라우저가 'all set' 상태가 아닐 수 있는 이유는?
- [UNVERIFIED] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

---

# Answers

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
