---
tags: [network, concept]
---

# Questions
- MAC 주소란 무엇인가?
- 물리 주소와 네트워크 주소의 차이는?
  - IP 주소와 MAC 주소의 역할 차이는?
- 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?
  - ARP(Address Resolution Protocol)란 무엇인가?
- MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?
- 네트워크 내에서 호스트를 어떻게 식별하는가?
- 도메인명은 어떻게 네트워크 주소로 변환되는가?
- Static IP와 Dynamic IP의 차이는?
- Unicast의 한계와, Broadcast/Multicast/Anycast는 각각 어떻게 다른가?
- NAT(Network Address Translation)란 무엇이며, 사설 IP를 가진 장치가 인터넷과 통신할 수 있는 원리는?

---

# Answers

## MAC 주소란 무엇인가?

### Official Answer
A MAC address is a **unique identifier** assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.

MAC addresses are primarily assigned by device manufacturers, and are therefore often referred to as a physical address.

### Reference
- https://en.wikipedia.org/wiki/MAC_address

---

## 물리 주소와 네트워크 주소의 차이는?

### AI Answer
MAC Address가 넓은 의미에서는 Network Address가 맞긴하지만,

정확하게 구분한다면 Mac Address는 Physical Address라고 부르고,

IP Address를 Network Address라고 부른다.

### Reference
- https://en.wikipedia.org/wiki/MAC_address
- https://en.wikipedia.org/wiki/IP_address

---

## IP 주소와 MAC 주소의 역할 차이는?

### Official Answer
IP addresses serve two main functions: network interface identification, and location addressing.

> #### Official Annotation:
> A MAC address is a unique identifier assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.
> — https://en.wikipedia.org/wiki/MAC_address

> #### AI Annotation:
> | | IP 주소 | MAC 주소 |
> |---|---|---|
> | **역할** | 식별 + 위치 지정 | 식별만 |
> | **범위** | 네트워크 간 라우팅 가능 | 같은 네트워크 세그먼트 내에서만 유효 |
> | **위치 정보** | 네트워크 프리픽스에 위치 인코딩 | 없음 (공장에서 부여된 고정 번호) |

### Reference
- https://en.wikipedia.org/wiki/IP_address

---

## 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?

### Official Answer
The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.

> #### AI Annotation:
> IP 주소는 네트워크 간 라우팅(L3)을 담당하지만, 로컬 네트워크 내에서 실제 프레임을 특정 장치에 전달하는 것은 MAC 주소(L2)의 역할이다.
> IP만으로는 "이 네트워크 안의 어떤 물리적 포트로 보낼 것인가"를 결정할 수 없으며, ARP가 IP→MAC 변환을 수행하여 두 계층을 연결한다.

### Reference
- https://en.wikipedia.org/wiki/Address_Resolution_Protocol

---

## ARP(Address Resolution Protocol)란 무엇인가?

### Official Answer
The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.
The host broadcasts a request containing the target node's IP address, and the node with that IP address replies with its MAC address.

It is communicated within the boundaries of a single subnetwork and is never routed.

> #### Official Annotation:
> Typically, a network node maintains a lookup cache that associates IP and MAC addresses.
> When a host receives an ARP response, it can cache the lookup for future messages addressed to the same IP address.

> #### AI Annotation:
> - **동작**: broadcast로 "이 IP 가진 장치 누구?" → 해당 장치가 자기 MAC으로 유니캐스트 응답
> - **범위**: 단일 서브네트워크 내에서만 동작. 라우터를 넘어가지 않는다.
> - **ARP 캐시**: 매번 broadcast하지 않도록 IP→MAC 매핑을 양쪽 다 저장. `arp -a`로 확인 가능.


### Reference
- https://en.wikipedia.org/wiki/Address_Resolution_Protocol

---

## MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

### Official Answer
An IP address serves two principal functions: it identifies the host, or more specifically, its network interface, and it provides the location of the host in the network, and thus, the capability of establishing a path to that host.

> #### AI Annotation:
> MAC 주소는 전 세계적으로 고유하지만 **flat addressing** — 주소 자체에 위치 정보가 인코딩되어 있지 않다.
> 라우터가 MAC 주소만 보고는 "이 장치가 어느 네트워크에 있는지" 알 수 없으므로 경로를 계산할 방법이 없다.
> 반면 IP 주소는 **hierarchical addressing** — 네트워크 프리픽스가 위치를 인코딩하고 있어, 라우터가 목적지 네트워크를 특정하고 경로를 수립(establish a path)할 수 있다.
>
> **실생활 비유**: MAC 주소는 주민등록번호, IP 주소는 집 주소에 대응된다.
> - 주민번호(MAC)는 전국에서 유일하지만 번호만으로는 그 사람이 어디 사는지 알 수 없다 — 5천만 명에게 하나씩 물어봐야 한다 (flat addressing).
> - 집 주소(IP)는 시→구→동→번지 계층 구조로 되어 있어 택배 배송(라우팅)이 가능하다 (hierarchical addressing).
> - ARP는 "이 주소(IP)에 사는 사람 주민번호(MAC) 뭐예요?"라고 동네에 방송하는 것과 같다.

### Reference
- https://en.wikipedia.org/wiki/IP_address

---

## 네트워크 내에서 호스트를 어떻게 식별하는가?

### Official Answer
Within a computer network, hosts are identified by [network addresses](https://en.wikipedia.org/wiki/Network_address), which allow [networking hardware](https://en.wikipedia.org/wiki/Networking_hardware) to locate and identify hosts.

> #### AI Annotation: 여기서 말하는 Network Address는 주로 **IP Address**(논리적 주소)와 **MAC Address**(물리적 주소)를 의미합니다. 라우터(L3 장비)는 IP 주소를 보고 최적의 경로를 찾아주며(Routing), 스위치(L2 장비)는 MAC 주소를 보고 정확한 장치를 식별(Identify)하여 데이터를 전달합니다.

> #### User Annotation: IP, MAC 말고도 포트 번호나 서비스 ID 등 식별 수단은 상황에 따라 더 다양할 수 있음.

### Reference
- https://en.wikipedia.org/wiki/Network_address

---

## 도메인명은 어떻게 네트워크 주소로 변환되는가?

### Official Answer
Hostnames can be mapped to a network address using a [hosts file](https://en.wikipedia.org/wiki/File) or a name server such as [Domain Name Service](https://en.wikipedia.org/wiki/Domain_Name_Service).

> #### AI Annotation: 컴퓨터가 이름을 주소로 변환할 때 거치는 순서는 다음과 같습니다.
> 1. **Local Cache/Hosts File**: 컴퓨터는 먼저 자기 자신(로컬)에게 물어봅니다. (`/etc/hosts` 파일 확인)
> 2. **DNS Server**: 로컬에 정보가 없다면 외부의 네임 서버(DNS)에 물어봅니다.

### Reference
- https://en.wikipedia.org/wiki/Hostname
- https://en.wikipedia.org/wiki/Domain_Name_Service

---

## Static IP와 Dynamic IP의 차이는?

### Official Answer
IP addresses are assigned to a host either dynamically as they join the network, or persistently by configuration of the host hardware or software.
Persistent configuration is also known as using a static IP address.
In contrast, when a computer's IP address is assigned each time it restarts, this is known as using a dynamic IP address.

> #### AI Annotation:
> - **Static IP**: 서버, 프린터, 라우터 등 주소가 바뀌면 안 되는 장치에 사용. 웹서버 IP가 매번 바뀌면 DNS가 따라가지 못한다.
> - **Dynamic IP**: DHCP 서버가 자동 할당. 대부분의 일반 PC/스마트폰이 이 방식.

> #### Official Annotation:
> In home networks, the ISP usually assigns a dynamic IP.
> If an ISP gave a home network an unchanging address, it is more likely to be abused by customers who host websites from home, or by hackers who can try the same IP address over and over until they breach a network.

### Reference
- https://en.wikipedia.org/wiki/IP_address

---

## Unicast의 한계와, Broadcast/Multicast/Anycast는 각각 어떻게 다른가?

### Official Answer
Sending the same data to multiple unicast addresses requires the sender to send all the data many times over, once for each recipient.

Broadcasting is an addressing technique available in IPv4 to address data to all possible destinations on a network in one transmission operation as an all-hosts broadcast.

A multicast address is associated with a group of interested receivers.
The sender sends a single datagram from its unicast address to the multicast group address, and the intermediary routers take care of making copies and sending them to all interested receivers (those that have joined the corresponding multicast group).

Like broadcast and multicast, anycast is a one-to-many routing topology.
However, the data stream is not transmitted to all receivers, just the one that the router decides is closest in the network.
Anycast methods are useful for global load balancing and are commonly used in distributed DNS systems.

> #### AI Annotation:
> | 방식 | 대상 | 송신 횟수 | 대표 사례 |
> |---|---|---|---|
> | **Unicast** | 1:1 | N명이면 N번 | 일반 웹 요청 |
> | **Broadcast** | 1:전체 | 1번 (IPv4 only) | ARP 요청 |
> | **Multicast** | 1:구독 그룹 | 1번 + 라우터 복사 | IPTV, 실시간 스트리밍 |
> | **Anycast** | 1:가장 가까운 1곳 | 1번 | CDN, DNS (1.1.1.1) |

### Reference
- https://en.wikipedia.org/wiki/IP_address

---

## NAT(Network Address Translation)란 무엇이며, 사설 IP를 가진 장치가 인터넷과 통신할 수 있는 원리는?

### Official Answer
A common practice is to have a NAT device mask many devices in a private network.
Only the public interfaces of the NAT device need to have an Internet-routable address.

The NAT device maps different IP addresses on the private network to different TCP or UDP port numbers on the public network.
In residential networks, NAT functions are usually implemented in a residential gateway.
In this scenario, the computers connected to the router have private IP addresses, and the router has a public address on its external interface to communicate on the Internet.
The internal computers appear to share one public IP address.

> #### AI Annotation:
> NAT의 핵심 메커니즘: 사설 IP를 공인 IP의 **포트 번호**에 매핑한다.
> 예: 192.168.0.10 → 203.0.113.1:50001, 192.168.0.11 → 203.0.113.1:50002.
> 포트로 구분하기 때문에 하나의 공인 IP로 수만 개의 내부 연결을 처리할 수 있다.
> IPv4 주소 고갈을 실질적으로 버티게 해준 핵심 기술이다.

### Reference
- https://en.wikipedia.org/wiki/IP_address
