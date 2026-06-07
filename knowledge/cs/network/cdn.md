---
tags: [network, performance, concept]
source: official
priority:
---
# Questions
- CDN이란 무엇인가?
- CDN은 어떻게 성능을 개선하는가?

---

# Answers

## CDN이란 무엇인가?
### Official Answer
A Content Delivery Network (CDN) is a distributed network of servers that cache resources from your origin server, and in turn, serves them from edge servers that are physically closer to your users.

### Reference
- https://web.dev/articles/content-delivery-networks
- https://web.dev/learn/performance/general-html-performance#content_delivery_networks_cdns

---

## CDN은 어떻게 성능을 개선하는가?
### Official Answer
The physical proximity to your users reduces round-trip time (RTT), while optimizations such as HTTP/2 or HTTP/3, caching, and compression allow the CDN to serve content more quickly than if it would be fetched from your origin server.

Utilizing a CDN can significantly improve your website's TTFB in some cases.

### Reference
- https://web.dev/articles/content-delivery-networks
- https://en.wikipedia.org/wiki/Round-trip_delay
