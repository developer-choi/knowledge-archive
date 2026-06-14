---
tags: [network, concept]
source: unverified
priority:
---

# Questions
- 처리량(Throughput)이란 무엇인가?
- 대역폭(Bandwidth)과 처리량(Throughput)을 비교하라
- 처리량이 낮아지는 원인은?
- Latency(지연시간)란?

---

# Answers

## 처리량(Throughput)이란 무엇인가?

### Official Answer
Network throughput (or just throughput, when in context) refers to the rate of message delivery over a [communication channel](https://en.wikipedia.org/wiki/Communication_channel) in a [communication network](https://en.wikipedia.org/wiki/Communication_network), such as [Ethernet](https://en.wikipedia.org/wiki/Ethernet).

The data that these messages contain may be delivered over physical or logical links, or through [network nodes](https://en.wikipedia.org/wiki/Network_nodes).
Throughput is usually measured in [bits per second](https://en.wikipedia.org/wiki/Bits_per_second) (bps).
The aggregate throughput is the sum of the data rates that are delivered over all channels in a network.

### User Answer
처리량이라는 단어가 와닿지 않으면 '데이터 이동량'이나 '작업 완료 속도'로 이해해도 무방할 듯.

### Reference
- https://en.wikipedia.org/wiki/Network_throughput
- https://en.wikipedia.org/wiki/Bits_per_second

---

## 대역폭(Bandwidth)과 처리량(Throughput)을 비교하라

### Official Answer
Throughput represents [digital bandwidth](https://en.wikipedia.org/wiki/Bandwidth_(computing)) consumption.

### Reference
- https://en.wikipedia.org/wiki/Bandwidth_(computing)

---

## 처리량이 낮아지는 원인은?

### Official Answer
The throughput of a communication system may be affected by various factors, including the limitations of the underlying physical medium, available processing power of the system components, [end-user](https://en.wikipedia.org/wiki/End-user) behavior, etc.

When taking various [protocol overheads](https://en.wikipedia.org/wiki/Protocol_overhead) into account, the useful rate of the data transfer can be significantly lower than the maximum achievable throughput; the useful part is usually referred to as [goodput](https://en.wikipedia.org/wiki/Goodput).

### Reference
- https://en.wikipedia.org/wiki/Goodput
- https://docs.google.com/document/d/1iGVkhRpG4RBhbpmI-AkHjRnOE8r7JyfyIxfjZH4UHCI/edit?tab=t.0#heading=h.oulolko7jpu0

---

## Latency(지연시간)란?

### Official Answer
The time it takes for a request to be processed.
The time it takes for a message to travel round trip between two devices.

### User Answer
지연시간은 a. Transmission Media, b. 패킷 크기, c. 라우터의 패킷처리 시간에 영향을 받음.
두 장치 사이 거리도 한몫할 것 (너무 멀면 그만큼 오래걸림).

### Reference
- 네트워크 기초 교재 (URL_UNKNOWN)
