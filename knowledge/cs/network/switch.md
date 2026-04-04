---
tags: [network, concept]
---

# Questions
- [네트워크 스위치란 무엇인가?](#네트워크-스위치란-무엇인가)
  - [네트워크 스위치와 허브의 차이는?](#네트워크-스위치와-허브의-차이는)
  - [스위치가 collision domain은 분리하지만 broadcast domain은 분리하지 못하는 이유는?](#스위치가-collision-domain은-분리하지만-broadcast-domain은-분리하지-못하는-이유는)
- [라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라](#라우터의-라우팅-테이블과-스위치의-mac-주소-테이블을-비교하라)

---

# Answers

## 네트워크 스위치란 무엇인가?

### Official Answer
A network switch is networking hardware that connects devices on a computer network by using packet switching to receive and forward data to the destination device.

A network switch is a multiport network bridge that uses MAC addresses to forward data at the data link layer (layer 2) of the OSI model.
Some switches can also forward data at the network layer (layer 3) by additionally incorporating routing functionality.
Such switches are commonly known as layer-3 switches or multilayer switches.

### Reference
- https://en.wikipedia.org/wiki/Network_switch

---

## 네트워크 스위치와 허브의 차이는?

### Official Answer
Unlike repeater hubs, which broadcast the same data out of each port and let the devices pick out the data addressed to them, a network switch learns the Ethernet addresses of connected devices and then only forwards data to the port connected to the device to which it is addressed.

### Reference
- https://en.wikipedia.org/wiki/Network_switch

---

## 스위치가 collision domain은 분리하지만 broadcast domain은 분리하지 못하는 이유는?

### Official Answer
An Ethernet switch operates at the data link layer (layer 2) of the OSI model to create a separate collision domain for each switch port.
Each device connected to a switch port can transfer data to any of the other ports at any time and the transmissions will not interfere.
Because broadcasts are still being forwarded to all connected devices by the switch, the newly formed network segment continues to be a broadcast domain.

### Reference
- https://en.wikipedia.org/wiki/Network_switch

---

## 라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라

### Official Answer
A forwarding information base (FIB), also known as a forwarding table or MAC (address) table, is most commonly used in network bridging, routing, and similar functions to find the proper output network interface controller to which the input interface should forward a packet.

FIBs are optimized for fast lookup of destination addresses and can improve performance of forwarding compared to using the routing information base (RIB) directly.
The RIB is optimized for efficient updating by routing protocols and other control plane methods, and contain the full set of routes learned by the router.

> #### AI Annotation:
> | | 라우터 라우팅 테이블 (RIB) | 스위치 MAC 주소 테이블 (FIB) |
> |---|---|---|
> | **계층** | L3 (IP) | L2 (MAC) |
> | **매핑** | 목적지 IP → 다음 홉/출력 인터페이스 | MAC 주소 → 포트 |
> | **구축 방식** | 라우팅 프로토콜(OSPF, BGP) 또는 정적 설정 | 트래픽의 source MAC을 관찰하여 자동 학습 |
> | **FIB 관계** | 별도 FIB로 복제하여 포워딩 성능 최적화 | 테이블 자체가 곧 FIB |

### Reference
- https://en.wikipedia.org/wiki/Forwarding_information_base
