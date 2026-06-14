---
tags: [network, concept]
source: official
priority:
---

# Questions
- MAC 주소란 무엇인가?
- [UNVERIFIED] 물리 주소와 네트워크 주소의 차이는?
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

## [UNVERIFIED] 물리 주소와 네트워크 주소의 차이는?

### Additional Answer
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

## ARP(Address Resolution Protocol)란 무엇인가?

### Official Answer
The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.
The host broadcasts a request containing the target node's IP address, and the node with that IP address replies with its MAC address.

It is communicated within the boundaries of a single subnetwork and is never routed.

Typically, a network node maintains a lookup cache that associates IP and MAC addresses.
When a host receives an ARP response, it can cache the lookup for future messages addressed to the same IP address.

### Reference
- https://en.wikipedia.org/wiki/Address_Resolution_Protocol

---

## MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

### Official Answer
An IP address serves two principal functions: it identifies the host, or more specifically, its network interface, and it provides the location of the host in the network, and thus, the capability of establishing a path to that host.

### Reference
- https://en.wikipedia.org/wiki/IP_address

---

## 네트워크 내에서 호스트를 어떻게 식별하는가?

### Official Answer
Within a computer network, hosts are identified by [network addresses](https://en.wikipedia.org/wiki/Network_address), which allow [networking hardware](https://en.wikipedia.org/wiki/Networking_hardware) to locate and identify hosts.

### User Answer
IP, MAC 말고도 포트 번호나 서비스 ID 등 식별 수단은 상황에 따라 더 다양할 수 있음.

### Reference
- https://en.wikipedia.org/wiki/Network_address

---

## 도메인명은 어떻게 네트워크 주소로 변환되는가?

### Official Answer
Hostnames can be mapped to a network address using a [hosts file](https://en.wikipedia.org/wiki/File) or a name server such as [Domain Name Service](https://en.wikipedia.org/wiki/Domain_Name_Service).

### Reference
- https://en.wikipedia.org/wiki/Hostname
- https://en.wikipedia.org/wiki/Domain_Name_Service

---

## Static IP와 Dynamic IP의 차이는?

### Official Answer
IP addresses are assigned to a host either dynamically as they join the network, or persistently by configuration of the host hardware or software.
Persistent configuration is also known as using a static IP address.
In contrast, when a computer's IP address is assigned each time it restarts, this is known as using a dynamic IP address.

In home networks, the ISP usually assigns a dynamic IP.
If an ISP gave a home network an unchanging address, it is more likely to be abused by customers who host websites from home, or by hackers who can try the same IP address over and over until they breach a network.

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

### Reference
- https://en.wikipedia.org/wiki/IP_address
