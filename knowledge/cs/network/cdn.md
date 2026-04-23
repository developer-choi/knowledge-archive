---
tags: [network, performance, concept]
---
# Questions
- CDN이란 무엇인가?
- CDN은 어떻게 성능을 개선하는가?

---

# Answers

## CDN이란 무엇인가?
### Official Answer
A Content Delivery Network (CDN) is a distributed network of servers that cache resources from your origin server, and in turn, serves them from edge servers that are physically closer to your users.

> #### Key Terms:
> - **origin server**: 원본 리소스를 보유한 본래의 서버
> - **edge server**: 사용자와 물리적으로 가까운 위치에서 캐시된 리소스를 제공하는 서버
> - **cache**: 자주 요청되는 리소스를 빠르게 제공하기 위해 임시 저장하는 것
> - **distributed network**: 여러 지리적 위치에 분산 배치된 서버들의 네트워크

### Reference
- https://web.dev/articles/content-delivery-networks
- https://web.dev/learn/performance/general-html-performance#content_delivery_networks_cdns

---

## CDN은 어떻게 성능을 개선하는가?
### Official Answer
The physical proximity to your users reduces round-trip time (RTT), while optimizations such as HTTP/2 or HTTP/3, caching, and compression allow the CDN to serve content more quickly than if it would be fetched from your origin server.

> #### Official Annotation:
> Utilizing a CDN can significantly improve your website's TTFB in some cases.

> #### Key Terms:
> - **RTT**: Round-Trip Time. 요청을 보내고 응답을 받기까지 걸리는 왕복 시간
> - **HTTP/2**: 멀티플렉싱 등으로 성능을 개선한 HTTP 프로토콜 버전
> - **HTTP/3**: QUIC 기반의 최신 HTTP 프로토콜 버전
> - **compression**: 전송 데이터 크기를 줄여 전송 속도를 높이는 기법
> - **TTFB**: Time To First Byte. 요청 후 첫 바이트를 받기까지 걸리는 시간

### Reference
- https://web.dev/articles/content-delivery-networks
- https://en.wikipedia.org/wiki/Round-trip_delay
