---
tags: [network, concept]
---

# Questions
- [라우터란 무엇인가?](#라우터란-무엇인가)
  - [라우팅 테이블은 어떻게 만들어지는가?](#라우팅-테이블은-어떻게-만들어지는가)
  - [라우터가 Layer 3 장치인 이유는?](#라우터가-layer-3-장치인-이유는)
  - [라우터는 패킷을 받으면 어떻게 전달하는가?](#라우터는-패킷을-받으면-어떻게-전달하는가)
  - [라우터는 전달한 패킷의 정보를 기억하는가?](#라우터는-전달한-패킷의-정보를-기억하는가)
- [라우팅과 포워딩의 차이는?](#라우팅과-포워딩의-차이는)
- [[TODO] 라우터는 '다른 네트워크'의 경계를 어떻게 정의하는가?](#todo-라우터는-다른-네트워크의-경계를-어떻게-정의하는가)
- [[TODO] 네트워크 스위치란 무엇인가?](#todo-네트워크-스위치란-무엇인가)
- [[TODO] 라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라](#todo-라우터의-라우팅-테이블과-스위치의-mac-주소-테이블을-비교하라)

---

# Answers

## 라우터란 무엇인가?

### Official Answer
A router is a computer and networking device that forwards data packets between computer networks, including internetworks such as the global Internet.

Routers perform the traffic directing functions on the Internet.
A router is connected to two or more data lines from different IP networks.
When a data packet comes in on a line, the router reads the network address information in the packet header to determine the ultimate destination.
Then, using information in its routing table or routing policy, it directs the packet to the next network on its journey.
A data packet is forwarded from one router to another through an internetwork until it reaches its destination node.

> #### Official Annotation:
> The most familiar type of IP routers are home and small office routers that forward IP packets between the home computers and the Internet.

> #### AI Annotation:
> 집에 있는 공유기(Wi-Fi 라우터)가 대표적인 라우터.
> 집 안의 사설 네트워크(192.168.x.x)와 ISP 네트워크 사이에서 패킷을 전달한다.

### Reference
- https://en.wikipedia.org/wiki/Router_(computing)

---

## 라우팅 테이블은 어떻게 만들어지는가?

### Official Answer
A router maintains a routing table that lists which route should be used to forward a data packet, and through which physical interface connection.
It does this using internal pre-configured directives, called static routes, or by learning routes dynamically using a routing protocol.
Static and dynamic routes are stored in the routing table.

### Reference
- https://en.wikipedia.org/wiki/Router_(computing)

---

## 라우터가 Layer 3 장치인 이유는?

### Official Answer
A router is considered a layer-3 device because its primary forwarding decision is based on the information in the layer-3 IP packet, specifically the destination IP address.

### Reference
- https://en.wikipedia.org/wiki/Router_(computing)

---

## 라우터는 패킷을 받으면 어떻게 전달하는가?

### Official Answer
When a router receives a packet, it searches its routing table to find the best match between the destination IP address of the packet and one of the addresses in the routing table.
Once a match is found, the packet is encapsulated in the layer-2 data link frame for the outgoing interface indicated in the table entry.

### Reference
- https://en.wikipedia.org/wiki/Router_(computing)

---

## 라우터는 전달한 패킷의 정보를 기억하는가?

### Official Answer
A router typically does not look into the packet payload, but only at the layer-3 addresses to make a forwarding decision, plus optionally other information in the header for hints on, for example, quality of service (QoS).
For pure IP forwarding, a router is designed to minimize the state information associated with individual packets.
Once a packet is forwarded, the router does not retain any historical information about the packet.

### Reference
- https://en.wikipedia.org/wiki/Router_(computing)

---

## 라우팅과 포워딩의 차이는?

### Official Answer
Routing is the process of selecting a path for traffic in a network.
Forwarding is the relaying of packets from one network segment to another by nodes in a computer network.

> #### User Annotation:
> Routing은 패킷이 목적지까지 가는 최적 경로를 결정하는 과정이고, Forwarding은 라우터가 입력 포트에서 받은 패킷을 적절한 출력 포트로 실제로 이동시키는 동작.

### Reference
- https://en.wikipedia.org/wiki/Routing

---

## [TODO] 라우터는 '다른 네트워크'의 경계를 어떻게 정의하는가?

---

## [TODO] 네트워크 스위치란 무엇인가?

### Official Answer

### Reference

---

## [TODO] 라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라
