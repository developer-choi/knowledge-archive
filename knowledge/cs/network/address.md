---
tags: [network, concept]
source: official
priority: 2
---

# Questions
- MAC 주소란 무엇인가?
- IP 주소와 MAC 주소의 역할 차이는?
- 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?
- MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

---

# Answers

## MAC 주소란 무엇인가?

### Official Answer
A MAC address is a **unique identifier** assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.

MAC addresses are primarily assigned by device manufacturers, and are therefore often referred to as a physical address.

### Reference
- https://en.wikipedia.org/wiki/MAC_address

---

## IP 주소와 MAC 주소의 역할 차이는?

### Official Answer
IP addresses serve two main functions: network interface identification, and location addressing.

A MAC address is a unique identifier assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.

### Reference
- https://en.wikipedia.org/wiki/IP_address
- https://en.wikipedia.org/wiki/MAC_address

---

## 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?

### Official Answer
The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.

### Reference
- https://en.wikipedia.org/wiki/Address_Resolution_Protocol

---

## MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

### Official Answer
An IP address serves two principal functions: it identifies the host, or more specifically, its network interface, and it provides the location of the host in the network, and thus, the capability of establishing a path to that host.

### Reference
- https://en.wikipedia.org/wiki/IP_address
