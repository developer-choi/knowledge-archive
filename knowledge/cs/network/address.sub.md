---
tags: [network, concept]
source: official
---
# Questions
- ARP(Address Resolution Protocol)란 무엇인가?
- 도메인명은 어떻게 네트워크 주소로 변환되는가?
- Static IP와 Dynamic IP의 차이는?
- Unicast의 한계와, Broadcast/Multicast/Anycast는 각각 어떻게 다른가?
- NAT(Network Address Translation)란 무엇이며, 사설 IP를 가진 장치가 인터넷과 통신할 수 있는 원리는?

---

# Answers

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
