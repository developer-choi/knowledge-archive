---
tags: [network, concept, protocol]
---

# Questions
- [네트워크란 무엇인가?](#네트워크란-무엇인가)
  - [호스트란 무엇인가?](#호스트란-무엇인가)
    - [호스트의 IP 주소는 어떻게 설정되는가?](#호스트의-ip-주소는-어떻게-설정되는가)
    - [호스트는 네트워크에서 어떤 역할을 하는가?](#호스트는-네트워크에서-어떤-역할을-하는가)
  - [네트워크 노드와 호스트의 차이는?](#네트워크-노드와-호스트의-차이는)
  - [라우터란 무엇인가?](router.md#라우터란-무엇인가)
  - [MAC 주소란 무엇인가?](network-address.md#mac-주소란-무엇인가)

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
Hosts are assigned at least one network address.

> #### User Annotation:
> 식별해야 보낼 수 있으니까, Network Address는 반드시 하나이상.

### Reference
- https://en.wikipedia.org/wiki/Host_(network)

---

## 호스트의 IP 주소는 어떻게 설정되는가?

### Official Answer
Hosts have one or more IP addresses assigned to their network interfaces.
The addresses are configured either manually by an administrator, or automatically at startup by means of the Dynamic Host Configuration Protocol (DHCP).

### Reference
- https://en.wikipedia.org/wiki/Host_(network)

---

## 호스트는 네트워크에서 어떤 역할을 하는가?

### Official Answer
A host may work as a server offering information resources, services, and applications to users or other hosts on the network.
Network hosts are classified as server or client systems.
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
