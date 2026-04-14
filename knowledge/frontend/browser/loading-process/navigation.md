---
tags: [browser, network, performance]
---

# Questions
- HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?
  - [DNS lookup에서 호스트명은 어떻게 IP 주소로 변환되는가? → `network-address.md`](../../../cs/network/network-address.md#호스트명이란-무엇이며-네트워크-주소로-어떻게-변환되는가)
  - [TLS negotiation에서 장기 키와 세션 키는 어떤 역할을 하는가? → `https.md`](../../../cs/network/protocol/https.md#tls가-데이터를-암호화하는-과정에서-장기-키와-세션-키의-역할은)
  - [TCP 연결 후 HTTP 통신의 전체 흐름(4단계)은? → `http.md`](../../../cs/network/protocol/http.md#클라이언트가-서버와-http-통신을-수행하는-전체-흐름4단계은)
  - [TODO] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

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

## [TODO] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

### AI Answer
HTTP 캐시에 리소스가 있으면 DNS lookup, TCP handshake, TLS negotiation, HTTP 요청/응답 등 네트워크 단계 전체를 건너뛸 수 있다.
DNS 캐시만 있는 경우는 DNS lookup만 건너뛴다.
캐싱 수준에 따라 건너뛰는 단계의 범위가 달라진다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
