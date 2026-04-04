---
tags: [network, concept, protocol]
---

# Questions
- [네트워크란 무엇인가?](#네트워크란-무엇인가)
  - [호스트란 무엇인가?](#호스트란-무엇인가)
    - [호스트의 IP 주소는 어떻게 설정되는가?](#호스트의-ip-주소는-어떻게-설정되는가)
    - [호스트는 네트워크에서 어떤 역할을 하는가?](#호스트는-네트워크에서-어떤-역할을-하는가)
  - [네트워크 노드와 호스트의 차이는?](#네트워크-노드와-호스트의-차이는)
  - [라우터란 무엇인가?](#라우터란-무엇인가)
    - [라우팅 테이블은 어떻게 만들어지는가?](#라우팅-테이블은-어떻게-만들어지는가)
    - [라우터가 Layer 3 장치인 이유는?](#라우터가-layer-3-장치인-이유는)
    - [라우터는 패킷을 받으면 어떻게 전달하는가?](#라우터는-패킷을-받으면-어떻게-전달하는가)
    - [라우터는 전달한 패킷의 정보를 기억하는가?](#라우터는-전달한-패킷의-정보를-기억하는가)
  - [라우팅과 포워딩의 차이는?](#라우팅과-포워딩의-차이는)
  - [[TODO] 라우터는 ‘다른 네트워크’의 경계를 어떻게 정의하는가?](#todo-라우터는-다른-네트워크의-경계를-어떻게-정의하는가)
  - [[TODO] 네트워크 스위치란 무엇인가?](#todo-네트워크-스위치란-무엇인가)
  - [[TODO] 라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라](#todo-라우터의-라우팅-테이블과-스위치의-mac-주소-테이블을-비교하라)
  - [MAC 주소란 무엇인가?](#mac-주소란-무엇인가)
  - [물리 주소와 네트워크 주소의 차이는?](#물리-주소와-네트워크-주소의-차이는)
  - [[TODO] 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?](#todo-논리-주소ip가-있는데-물리-주소mac가-왜-필요한가)
  - [[TODO] MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?](#todo-mac-주소가-전-세계적으로-고유한데-왜-호스트를-찾으려면-ip-주소가-필요한가)
- [네트워크 내에서 호스트를 어떻게 식별하는가?](#네트워크-내에서-호스트를-어떻게-식별하는가)
- [호스트명이란 무엇이며 네트워크 주소로 어떻게 변환되는가?](#호스트명이란-무엇이며-네트워크-주소로-어떻게-변환되는가)
- [처리량(Throughput)이란 무엇인가?](#처리량throughput이란-무엇인가)
- [대역폭(Bandwidth)과 처리량(Throughput)을 비교하라](#대역폭bandwidth과-처리량throughput을-비교하라)
- [처리량이 낮아지는 원인은?](#처리량이-낮아지는-원인은)
- [(번외) 왜 하필 번역이 ‘처리량’일까?](#번외-왜-하필-번역이-처리량일까)
- [Latency(지연시간)란?](#latency지연시간란)
- [Internet이란 무엇인가?](#internet이란-무엇인가)
- [LAN이란?](#lan이란)
- [WAN이란?](#wan이란)
- [LAN과 WAN의 차이는?](#lan과-wan의-차이는)

---

# Answers

## 네트워크란 무엇인가?

### Official Answer
A network is a group of communicating [computers](https://en.wikipedia.org/wiki/Computer) and [peripherals](https://en.wikipedia.org/wiki/Peripheral) known as [hosts](https://en.wikipedia.org/wiki/Host_(network)), which [communicate data](https://en.wikipedia.org/wiki/Data_communication) to other hosts via [communication protocols](https://en.wikipedia.org/wiki/Communication_protocol).

> #### AI Annotation: 네트워크의 3요소는 다음과 같습니다.
> 1. **Node (Host)**: 데이터를 보내거나 받는 주체 (PC, 스마트폰, 서버 등).
> 2. **Link (Hardware)**: 데이터를 이동시키는 물리적/논리적 경로 (케이블, 라우터, 스위치).
> 3. **Protocol**: 통신 규칙 (TCP/IP, HTTP 등).
> 개발자로서 'Host'는 단순히 컴퓨터가 아니라, IP 주소를 가지고 양방향 통신이 가능한 네트워크 인터페이스를 가진 모든 장치를 의미합니다.

### Reference
- https://en.wikipedia.org/wiki/Host_(network)
- https://en.wikipedia.org/wiki/Communication_protocol

---

## 호스트란 무엇인가?
### Official Answer
A network host is a computer or other device connected to a computer network.
A host may work as a server offering information resources, services, and applications to users or other hosts on the network.
Hosts are assigned at least one network address.

> #### User Annotation:
> 식별해야 보낼 수 있으니까, Network Address는 반드시 하나이상.

### Reference
- https://en.wikipedia.org/wiki/Host_(network)

---

## 호스트의 IP 주소는 어떻게 설정되는가?

### Official Answer
A computer participating in networks that use the Internet protocol suite may also be called an IP host.
Specifically, computers participating in the Internet are called Internet hosts.
Internet hosts and other IP hosts have one or more IP addresses assigned to their network interfaces.
The addresses are configured either manually by an administrator, automatically at startup by means of the Dynamic Host Configuration Protocol (DHCP), or by stateless address autoconfiguration methods.

### Reference
- https://en.wikipedia.org/wiki/Host_(network)

---

## 호스트는 네트워크에서 어떤 역할을 하는가?

### Official Answer
Network hosts that participate in applications that use the client–server model of computing are classified as server or client systems.
Network hosts may also function as nodes in peer-to-peer applications, in which all nodes share and consume resources in an equipotent manner.

### Reference
- https://en.wikipedia.org/wiki/Host_(network)

---

## 네트워크 노드와 호스트의 차이는?

### Official Answer
A network node is any device participating in a network.
A host is a node that participates in user applications, either as a server, client, or both.
A server is a type of host that offers resources to the other hosts.
Typically, a server accepts connections from clients who request a service function.

Every network host is a node, but not every network node is a host.
Network infrastructure hardware, such as modems, Ethernet hubs, and network switches are not directly or actively participating in application-level functions, do not necessarily have a network address, and are not considered to be network hosts.

### Reference
- https://en.wikipedia.org/wiki/Host_(network)

---

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

---

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

## [TODO] 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?

### Official Answer

### Reference

---

## [TODO] MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

### Official Answer

### Reference

---

## 네트워크 내에서 호스트를 어떻게 식별하는가?

### Official Answer
Within a computer network, hosts are identified by [network addresses](https://en.wikipedia.org/wiki/Network_address), which allow [networking hardware](https://en.wikipedia.org/wiki/Networking_hardware) to locate and identify hosts.

> #### AI Annotation: 여기서 말하는 Network Address는 주로 **IP Address**(논리적 주소)와 **MAC Address**(물리적 주소)를 의미합니다. 라우터(L3 장비)는 IP 주소를 보고 최적의 경로를 찾아주며(Routing), 스위치(L2 장비)는 MAC 주소를 보고 정확한 장치를 식별(Identify)하여 데이터를 전달합니다.

> #### User Annotation: IP, MAC 말고도 포트 번호나 서비스 ID 등 식별 수단은 상황에 따라 더 다양할 수 있음.

### Reference
- https://en.wikipedia.org/wiki/Network_address

---

## 호스트명이란 무엇이며 네트워크 주소로 어떻게 변환되는가?

### Official Answer
Hosts may also have [hostnames](https://en.wikipedia.org/wiki/Hostname), memorable labels for the host [nodes](https://en.wikipedia.org/wiki/Node_(networking)), which can be mapped to a network address using a [hosts file](https://en.wikipedia.org/wiki/File) or a name server such as [Domain Name Service](https://en.wikipedia.org/wiki/Domain_Name_Service).

> #### AI Annotation: 컴퓨터가 이름을 주소로 변환할 때 거치는 순서는 다음과 같습니다.
> 1. **Local Cache/Hosts File**: 컴퓨터는 먼저 자기 자신(로컬)에게 물어봅니다. (`/etc/hosts` 파일 확인)
> 2. **DNS Server**: 로컬에 정보가 없다면 외부의 네임 서버(DNS)에 물어봅니다.

### Reference
- https://en.wikipedia.org/wiki/Hostname
- https://en.wikipedia.org/wiki/Domain_Name_Service

---

## 처리량(Throughput)이란 무엇인가?

### Official Answer
Network throughput (or just throughput, when in context) refers to the rate of message delivery over a [communication channel](https://en.wikipedia.org/wiki/Communication_channel) in a [communication network](https://en.wikipedia.org/wiki/Communication_network), such as [Ethernet](https://en.wikipedia.org/wiki/Ethernet).

The data that these messages contain may be delivered over physical or logical links, or through [network nodes](https://en.wikipedia.org/wiki/Network_nodes).
Throughput is usually measured in [bits per second](https://en.wikipedia.org/wiki/Bits_per_second) (bps).
The aggregate throughput is the sum of the data rates that are delivered over all channels in a network.

> #### AI Annotation: 
> - **Rate vs Speed**: 여기서 Rate는 단순한 속도(km/h)라기보다는 단위 시간당 처리되는 일의 양(빈도)에 가깝습니다.
> - **Message vs Packet**: 네트워크 통신은 계층 구조(OSI 7 Layer)로 이루어집니다. 가장 상위 계층인 Application Layer에서의 데이터 단위를 Message라고 하며, 이것이 하위 계층으로 내려가며 잘게 쪼개진 조각들을 Packet이라고 합니다.
> - **Aggregate Throughput**: 단일 채널이 100Mbps라도, 여러 채널을 묶어서(Link Aggregation) 동시에 쓰면 전체 처리량은 그 합만큼 늘어날 수 있습니다.

> #### User Annotation: 처리량이라는 단어가 와닿지 않으면 '데이터 이동량'이나 '작업 완료 속도'로 이해해도 무방할 듯.

### Reference
- https://en.wikipedia.org/wiki/Network_throughput
- https://en.wikipedia.org/wiki/Bits_per_second

---

## 대역폭(Bandwidth)과 처리량(Throughput)을 비교하라

### Official Answer
Throughput represents [digital bandwidth](https://en.wikipedia.org/wiki/Bandwidth_(computing)) consumption.

> #### AI Annotation: **고속도로 톨게이트 비유**로 이해하면 쉽습니다.
> - **Bandwidth (도로 폭)**: 차선이 10개인 고속도로 (이론상 최대치).
> - **Throughput (처리량)**: 실제로 톨게이트를 통과한 자동차 수. 차가 아무리 많아도 사고가 나거나 도로가 좁아지면(Processing이 늦어지면) 실제 통과하는 차의 양은 줄어듭니다.
> 즉, Throughput은 단순히 지나간 양이 아니라, 시스템이 감당해낸(처리해낸) 결과물이라는 뉘앙스가 강합니다.

### Reference
- https://en.wikipedia.org/wiki/Bandwidth_(computing)

---

## 처리량이 낮아지는 원인은?

### Official Answer
The throughput of a communication system may be affected by various factors, including the limitations of the underlying physical medium, available processing power of the system components, [end-user](https://en.wikipedia.org/wiki/End-user) behavior, etc.

When taking various [protocol overheads](https://en.wikipedia.org/wiki/Protocol_overhead) into account, the useful rate of the data transfer can be significantly lower than the maximum achievable throughput; the useful part is usually referred to as [goodput](https://en.wikipedia.org/wiki/Goodput).

> #### AI Annotation: 처리량이 이론상 최대치만큼 나오지 않는 이유들입니다.
> - **Physical medium**: 랜선이 낡았거나 물리적 한계가 있는 경우.
> - **Processing power**: 라우터나 장비의 CPU 성능이 낮아 패킷 처리가 늦어지는 경우.
> - **End-user behavior**: 사용자가 토렌트 등 과도한 트래픽을 유발하는 경우.
> - **Goodput**: 데이터 전송 시 헤더(Header) 등 부가 정보를 제외하고, 실제 사용자가 받는 '순수 데이터'의 속도를 의미합니다. (택배 상자 무게를 뺀 내용물만의 무게와 같음)

### Reference
- https://en.wikipedia.org/wiki/Goodput
- https://docs.google.com/document/d/1iGVkhRpG4RBhbpmI-AkHjRnOE8r7JyfyIxfjZH4UHCI/edit?tab=t.0#heading=h.oulolko7jpu0

---

## (번외) 왜 하필 번역이 '처리량'일까?

> #### AI Annotation: **어원 분석 (LBL)**
> - **Through** (통과하여) + **Put** (놓다, 투입하다) = 시스템 내부의 과정을 거쳐 결과물로 변환되어 나온 총량.
> - **Hardware View**: 데이터는 단순히 흐르는 것이 아니라, 장비(라우터 등)가 매 순간 **패킷 분석(Parsing), 경로 계산(Routing), 에러 검사(Checksum), 다시 포장해서 보냄(Forwarding)** 등의 작업을 수행해야 합니다. 이 모든 과정이 CPU와 메모리를 쓰는 '일(Work/Process)'이기에 '처리해서(Through) 내보낸 양(Put)'이라는 의미에서 **처리량**으로 번역된 것입니다.

---

## Latency(지연시간)란?

### Official Answer
The time it takes for a request to be processed.
The time it takes for a message to travel round trip between two devices.

> #### User Annotation:
> 지연시간은 a. Transmission Media, b. 패킷 크기, c. 라우터의 패킷처리 시간에 영향을 받음.
> 두 장치 사이 거리도 한몫할 것 (너무 멀면 그만큼 오래걸림).

### Reference
- 네트워크 기초 교재 (URL_UNKNOWN)

---

## Internet이란 무엇인가?

### Official Answer
The Internet is a vast network that connects many networks around the world.

If we only have one computer without internet connection, our capabilities are very limited.
But if the computer is connected to another computer, many possibilities open up.
Everything like web surfing becomes possible because computers can exchange data with each other.

### Reference
- 네트워크 기초 교재 (URL_UNKNOWN)

---

## LAN이란?

### Official Answer
LAN is a Local area network.
When classified by scale, it refers to small-scale networks such as homes, offices, and schools.

> #### User Annotation:
> LAN은 사설망을 구축해 연결함. 다른 네트워크에서는 접근이 제한됨.
>
> ISP (Internet Service Provider) = 인터넷에 접속하는 수단을 제공. KT, SK같은거.
> 인터넷 공유기 = LAN을 구성하기위해 필요한 장비. 공유기를 중심으로 사설망을 구성하고 다양한 기기를 연결할 수 있음.

### Reference
- 네트워크 기초 교재 (URL_UNKNOWN)

---

## WAN이란?

### Official Answer
WAN is a wide area network.
It refers to large-scale networks such as connections between countries or continents.

### Reference
- 네트워크 기초 교재 (URL_UNKNOWN)

---

## LAN과 WAN의 차이는?

### Official Answer
There are three differences: space, speed, safety.
The LAN is a local area and the WAN is a wide area.
LAN is faster than WAN by default.
LAN is safer than WAN basically.

### Reference
- 네트워크 기초 교재 (URL_UNKNOWN)