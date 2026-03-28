---
tags: [browser, network, performance]
---

# Questions
- [HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?](#https-사이트-접속-시-브라우저가-html-데이터를-받기-전까지-거치는-네트워크-단계와-왕복-횟수는)
  - [[TODO] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?](#todo-브라우저-캐싱은-네비게이션-과정의-어떤-단계를-건너뛰게-하나)

---

# Answers

## HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?

### Official Answer
Once the IP address is known, the browser sets up a connection to the server via a TCP three-way handshake.
For secure connections established over HTTPS, another "handshake" is required.
This requires five more round trips to the server before the request for content is actually sent.
After the eight round trips to the server, the browser is finally able to make the request.

> #### AI Annotation: DNS lookup(1 왕복) → TCP 3-way handshake(3 왕복) → TLS negotiation(5 왕복) = 총 8 왕복.
> 실제 데이터 전송 전에 연결 설정만으로 이만큼의 latency가 발생한다.

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
