---
tags: [network, concept]
---

# Questions
- [MAC 주소란 무엇인가?](#mac-주소란-무엇인가)
- [물리 주소와 네트워크 주소의 차이는?](#물리-주소와-네트워크-주소의-차이는)
- [[TODO] 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?](#todo-논리-주소ip가-있는데-물리-주소mac가-왜-필요한가)
- [[TODO] MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?](#todo-mac-주소가-전-세계적으로-고유한데-왜-호스트를-찾으려면-ip-주소가-필요한가)
- [네트워크 내에서 호스트를 어떻게 식별하는가?](#네트워크-내에서-호스트를-어떻게-식별하는가)
- [호스트명이란 무엇이며 네트워크 주소로 어떻게 변환되는가?](#호스트명이란-무엇이며-네트워크-주소로-어떻게-변환되는가)

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
