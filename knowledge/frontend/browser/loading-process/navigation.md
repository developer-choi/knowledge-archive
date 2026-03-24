---
tags: [browser, network, performance]
---

# Questions
- [When a user accesses an HTTPS site, what network stages does the browser go through before receiving actual HTML data, and how much round-tripping occurs?](#when-a-user-accesses-an-https-site-what-network-stages-does-the-browser-go-through-before-receiving-actual-html-data-and-how-much-round-tripping-occurs)

---

# Answers

## When a user accesses an HTTPS site, what network stages does the browser go through before receiving actual HTML data, and how much round-tripping occurs?

### Official Answer
Once the IP address is known, the browser sets up a connection to the server via a TCP three-way handshake.
For secure connections established over HTTPS, another "handshake" is required.
This requires five more round trips to the server before the request for content is actually sent.
After the eight round trips to the server, the browser is finally able to make the request.

> AI Annotation: DNS lookup(1 왕복) → TCP 3-way handshake(3 왕복) → TLS negotiation(5 왕복) = 총 8 왕복.
> 실제 데이터 전송 전에 연결 설정만으로 이만큼의 latency가 발생한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
