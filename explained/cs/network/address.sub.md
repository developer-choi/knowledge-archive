# ARP(Address Resolution Protocol)란 무엇인가?

## 도입

ARP는 같은 로컬 네트워크 안에서만 동작하는 프로토콜이다. 라우터를 넘어가지 않고, 브로드캐스트로 질의하고, 받은 응답을 캐시해서 반복 질의를 줄인다. 브라우저가 처음 어떤 IP에 연결할 때 백그라운드에서 조용히 일어나는 과정이 이것이다.

---

## 본문

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

"ARP는 인터넷 계층 주소에 연결된 링크 계층 주소를 알아내기 위한 통신 프로토콜이다."

> ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.
> The host broadcasts a request containing the target node's IP address, and the node with that IP address replies with its MAC address.

"호스트는 목적지 노드의 IP 주소가 담긴 요청을 브로드캐스트로 보내고, 그 IP를 가진 노드가 자신의 MAC 주소로 응답한다."

- **broadcasts a request**: LAN 전체에 "이 IP를 가진 장치 있으면 응답해"라고 뿌리는 것. ARP 요청 패킷의 목적지 MAC은 `FF:FF:FF:FF:FF:FF` — 브로드캐스트 주소다.
- **replies with its MAC address**: 해당 IP를 가진 장치만 유니캐스트로 응답한다.

> It is communicated within the boundaries of a single subnetwork and is never routed.

"ARP는 단일 서브네트워크 경계 내에서만 통신하며, 라우팅되지 않는다."

- **never routed**: 라우터는 ARP 브로드캐스트를 통과시키지 않는다. 그래서 ARP는 항상 로컬 세그먼트 안에서만 동작한다.

> Typically, a network node maintains a lookup cache that associates IP and MAC addresses.
> When a host receives an ARP response, it can cache the lookup for future messages addressed to the same IP address.

"네트워크 노드는 보통 IP와 MAC 주소를 연결하는 룩업 캐시를 유지한다. 호스트가 ARP 응답을 받으면 같은 IP로 향하는 이후 메시지를 위해 그 매핑을 캐시할 수 있다."

- **lookup cache (ARP 캐시)**: 매번 브로드캐스트하지 않도록 IP→MAC 매핑을 저장하는 테이블. Windows에서 `arp -a`, macOS/Linux에서 `arp -n`으로 확인 가능.

```
ARP 동작 흐름
PC-A (192.168.0.10)        LAN 전체            PC-B (192.168.0.20)

1. ARP Request  ──────────────────────────────────→ (broadcast)
   "192.168.0.20의 MAC이 뭐야?"
   
2.            ←──────────────────────────────────── ARP Reply
                                          "나야, AA:BB:CC:DD:EE:FF"
   
3. ARP 캐시에 192.168.0.20 → AA:BB:CC:DD:EE:FF 저장
4. 이더넷 프레임 전송 (이후 동일 IP는 캐시 사용)
```

---

## 종합

ARP는 단순하지만 없으면 로컬 네트워크 통신이 불가능하다 — IP만으로는 같은 LAN 안에서도 누구에게 프레임을 줘야 하는지 알 수 없기 때문이다. ARP 캐시가 오염되면(ARP Spoofing 공격) 엉뚱한 MAC으로 트래픽이 흘러 MITM 공격이 가능해지는 보안 위협도 존재한다. DevTools에서는 보이지 않지만 브라우저가 새 서버에 첫 연결할 때 OS 레벨에서 자동으로 수행된다.

---

# 도메인명은 어떻게 네트워크 주소로 변환되는가?

## 도입

브라우저 주소창에 `example.com`을 입력하면 컴퓨터는 그 이름을 IP 주소로 바꿔야 패킷을 보낼 수 있다. 이 변환 과정은 두 단계로 이루어진다 — 먼저 로컬에서 찾고, 없으면 외부 DNS 서버에 물어본다.

---

## 본문

> Hostnames can be mapped to a network address using a hosts file or a name server such as Domain Name Service.

"호스트명은 hosts 파일이나 도메인 네임 서비스(DNS) 같은 네임 서버를 사용하여 네트워크 주소로 매핑될 수 있다."

- **hosts file**: OS 로컬에 있는 정적 이름→IP 매핑 파일. Windows에서는 `C:\Windows\System32\drivers\etc\hosts`, Linux/macOS에서는 `/etc/hosts`. DNS 요청 전에 먼저 확인된다.
- **name server (DNS)**: 계층적으로 구성된 전 세계 분산 데이터베이스. 루트 서버 → TLD 서버 → 권위 서버 순으로 쿼리를 위임한다.
- **mapped to a network address**: 문자열 이름(hostname)을 숫자 주소(IP)로 변환하는 과정 전체를 "name resolution"이라고 부른다.

```
브라우저가 example.com에 접속하는 과정

1. 로컬 캐시 확인 (OS DNS 캐시)
       ↓ 없으면
2. hosts 파일 확인 (/etc/hosts)
       ↓ 없으면
3. DNS Resolver (통상 공유기 or ISP가 운영)에 쿼리
       ↓ 캐시 없으면
4. Root DNS → TLD(.com) DNS → example.com 권위 DNS
       ↓
5. IP 주소 응답 (93.184.216.34)
       ↓
6. TCP 연결 → HTTP 요청
```

---

## 종합

도메인명은 사람이 기억하기 쉬운 이름이고, IP는 기계가 라우팅하기 위한 주소다. DNS는 이 두 세계를 이어주는 전 세계 분산 전화번호부다. 개발 중 `localhost`가 항상 `127.0.0.1`로 동작하는 것은 hosts 파일에 그 매핑이 이미 있기 때문이며, DNS 쿼리가 일어나지 않는다.

---

# Static IP와 Dynamic IP의 차이는?

## 도입

IP 주소가 어떻게 할당되는지에 따라 static(고정)과 dynamic(동적)으로 나뉜다. 가정·사무실 대부분의 기기는 동적 IP를 쓰고, 서버·프린터처럼 주소가 바뀌면 안 되는 장비는 정적 IP를 쓴다.

---

## 본문

> IP addresses are assigned to a host either dynamically as they join the network, or persistently by configuration of the host hardware or software.
> Persistent configuration is also known as using a static IP address.

"IP 주소는 호스트가 네트워크에 접속할 때 동적으로 할당되거나, 호스트 하드웨어 또는 소프트웨어 설정에 의해 영구적으로 할당된다. 영구적 설정은 정적 IP 주소 사용이라고도 알려져 있다."

- **dynamically as they join**: 네트워크에 붙는 순간 DHCP 서버가 자동으로 부여한다. 노트북이 카페 와이파이에 붙으면 공유기가 IP를 준다.
- **persistently**: "지속적으로" — 재부팅해도, 재접속해도 바뀌지 않는다.
- **static IP address**: 사람이 직접 설정하거나 DHCP에서 특정 MAC에 항상 같은 IP를 예약(DHCP reservation)하는 방식.

> In contrast, when a computer's IP address is assigned each time it restarts, this is known as using a dynamic IP address.

"반면에 컴퓨터의 IP 주소가 재시작할 때마다 할당되면, 이를 동적 IP 주소 사용이라고 한다."

> In home networks, the ISP usually assigns a dynamic IP.
> If an ISP gave a home network an unchanging address, it is more likely to be abused by customers who host websites from home, or by hackers who can try the same IP address over and over until they breach a network.

"가정 네트워크에서 ISP는 보통 동적 IP를 할당한다. ISP가 가정 네트워크에 변하지 않는 주소를 줬다면, 집에서 웹사이트를 호스팅하려는 고객이나 같은 IP를 반복해서 시도하는 해커에게 남용될 가능성이 높아진다."

- **ISP**: Internet Service Provider. KT·SK·LG같은 통신사.
- **abused**: 고정 IP가 있으면 무허가 서버 운영이나 지속적 공격 타깃이 되기 쉬워진다.

| | Static IP | Dynamic IP |
|---|---|---|
| **변경** | 바뀌지 않음 | 재접속·재시작 시 바뀔 수 있음 |
| **할당 방식** | 수동 설정 또는 DHCP 예약 | DHCP 자동 할당 |
| **사용 대상** | 서버, 프린터, 라우터 | 일반 PC, 스마트폰 |
| **이유** | 주소 불변성 필요 | 편의성 |

---

## 종합

정적 IP가 없으면 웹서버 IP가 재시작할 때마다 바뀌어 DNS가 따라가지 못하므로 서비스가 끊긴다. 동적 IP는 DHCP가 주소 풀을 자동 관리하여 설정 부담을 없애고 주소 재활용을 가능하게 한다. 실무에서 EC2 인스턴스에 탄력적 IP(Elastic IP)를 붙이는 이유가 바로 이것 — 인스턴스가 재시작되어도 IP가 유지되도록 정적 IP를 예약하는 것이다.

---

# Unicast의 한계와, Broadcast/Multicast/Anycast는 각각 어떻게 다른가?

## 도입

같은 데이터를 여러 수신자에게 보내는 방법은 하나가 아니다. Unicast는 1:1이라 수신자가 많을수록 송신 횟수가 늘어나는 비효율이 생긴다. Broadcast·Multicast·Anycast는 이 문제를 각기 다른 방식으로 해결한다.

---

## 본문

> Sending the same data to multiple unicast addresses requires the sender to send all the data many times over, once for each recipient.

"같은 데이터를 여러 유니캐스트 주소에 보내려면, 발신자가 수신자 각각에게 한 번씩 데이터를 모두 보내야 한다."

- **once for each recipient**: 수신자가 N명이면 N번 전송. 1000명에게 100MB 파일을 유니캐스트로 보내면 100GB가 나간다.

> Broadcasting is an addressing technique available in IPv4 to address data to all possible destinations on a network in one transmission operation as an all-hosts broadcast.

"브로드캐스팅은 IPv4에서 사용 가능한 주소 지정 기법으로, 한 번의 전송으로 네트워크의 모든 가능한 목적지에 데이터를 전달한다."

- **all possible destinations**: 서브네트워크 내 모든 장치. ARP 요청이 대표적인 브로드캐스트 사례.
- **IPv4에서만**: IPv6에는 브로드캐스트가 없다. 그 역할을 멀티캐스트가 대신한다.

> A multicast address is associated with a group of interested receivers.
> The sender sends a single datagram from its unicast address to the multicast group address, and the intermediary routers take care of making copies and sending them to all interested receivers (those that have joined the corresponding multicast group).

"멀티캐스트 주소는 관심 있는 수신자 그룹과 연결된다. 발신자는 자신의 유니캐스트 주소에서 멀티캐스트 그룹 주소로 단일 데이터그램을 보내고, 중간 라우터들이 복사해서 모든 관심 수신자에게 전달한다."

- **group of interested receivers**: 멀티캐스트 그룹에 "가입"한 수신자만 받는다 — 브로드캐스트처럼 전체에 뿌리지 않는다.
- **intermediary routers take care of making copies**: 라우터가 복제를 담당하므로 발신자는 한 번만 보내면 된다.

> Like broadcast and multicast, anycast is a one-to-many routing topology.
> However, the data stream is not transmitted to all receivers, just the one that the router decides is closest in the network.
> Anycast methods are useful for global load balancing and are commonly used in distributed DNS systems.

"애니캐스트도 브로드캐스트·멀티캐스트처럼 1:다 라우팅 토폴로지다. 그러나 데이터 스트림은 모든 수신자에게 전달되지 않고, 라우터가 네트워크에서 가장 가깝다고 판단한 수신자 한 명에게만 전달된다."

- **closest in the network**: 지리적 거리가 아니라 라우팅 홉 수·지연 등을 종합한 네트워크 근접도다.
- **global load balancing**: 같은 IP를 전 세계 여러 서버에 할당하고 사용자를 가장 가까운 서버로 자동 연결한다.

```
방식 비교

Unicast:   A ──→ B (1:1)
           A ──→ C (별도 전송)
           A ──→ D (또 별도 전송)

Broadcast: A ──→ [B, C, D, 전체] (1:all, 한 번)

Multicast: A ──→ [B, C] (1:그룹, 한 번, 라우터가 복제)

Anycast:   A ──→ 가장 가까운 하나만 (1:1이지만 목적지가 동적)
```

| 방식 | 대상 | 송신 횟수 | 대표 사례 |
|---|---|---|---|
| **Unicast** | 1:1 | N명이면 N번 | 일반 웹 요청 |
| **Broadcast** | 1:전체 | 1번 (IPv4 only) | ARP 요청 |
| **Multicast** | 1:구독 그룹 | 1번 + 라우터 복사 | IPTV, 실시간 스트리밍 |
| **Anycast** | 1:가장 가까운 1곳 | 1번 | CDN, DNS (1.1.1.1) |

---

## 종합

Cloudflare의 `1.1.1.1` DNS 서버가 전 세계에서 빠른 이유가 Anycast다 — 같은 `1.1.1.1`이라는 IP를 수백 개 데이터센터가 공유하고, 내 DNS 쿼리는 자동으로 가장 가까운 서버로 향한다. Unicast는 1:1 정밀 전달, Broadcast는 LAN 전체 알림, Multicast는 구독 기반 효율 배포, Anycast는 부하분산 겸 근거리 라우팅이라는 각자의 사용 사례가 있다.

---

# NAT(Network Address Translation)란 무엇이며, 사설 IP를 가진 장치가 인터넷과 통신할 수 있는 원리는?

## 도입

가정의 노트북은 `192.168.x.x` 같은 사설 IP를 가진다. 이 주소는 인터넷 라우터가 모르는 주소라 직접 인터넷과 통신할 수 없다. 공유기가 NAT를 수행하여 내부 사설 IP를 하나의 공인 IP로 변환하고, 포트 번호로 장치를 구분하는 것이 핵심 메커니즘이다.

---

## 본문

> A common practice is to have a NAT device mask many devices in a private network.
> Only the public interfaces of the NAT device need to have an Internet-routable address.

"일반적인 방법은 NAT 장치가 사설 네트워크의 많은 장치를 가리는 것이다. NAT 장치의 공개 인터페이스만 인터넷 라우팅 가능 주소를 가지면 된다."

- **mask many devices**: 외부에서 보면 내부 장치들이 하나의 공인 IP 뒤에 숨어 있는 것처럼 보인다.
- **Internet-routable address**: 인터넷 라우터가 경로를 알고 있는 주소 — 즉 공인 IP. 사설 IP(`192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`)는 인터넷에서 라우팅되지 않는다.

> The NAT device maps different IP addresses on the private network to different TCP or UDP port numbers on the public network.

"NAT 장치는 사설 네트워크의 서로 다른 IP 주소를 공인 네트워크의 서로 다른 TCP 또는 UDP 포트 번호에 매핑한다."

- **maps**: NAT 테이블에 기록하는 것. 192.168.0.10:54321 → 203.0.113.1:50001 식의 변환 규칙.
- **TCP or UDP port numbers**: 포트를 이용해 장치를 구분하기 때문에 단 하나의 공인 IP로 수만 개의 연결을 처리할 수 있다.

> In residential networks, NAT functions are usually implemented in a residential gateway.
> In this scenario, the computers connected to the router have private IP addresses, and the router has a public address on its external interface to communicate on the Internet.
> The internal computers appear to share one public IP address.

"가정 네트워크에서는 NAT 기능이 주로 가정용 게이트웨이(공유기)에 구현된다. 라우터에 연결된 컴퓨터들은 사설 IP를 가지고, 라우터는 인터넷 통신을 위해 외부 인터페이스에 공인 주소를 가진다. 내부 컴퓨터들은 하나의 공인 IP를 공유하는 것처럼 보인다."

```
NAT 동작 예시

내부 PC-A: 192.168.0.10 → fetch("https://example.com")
내부 PC-B: 192.168.0.11 → fetch("https://google.com")
                ↓
           [공유기 / NAT]
                ↓
인터넷: 203.0.113.1:50001 (← PC-A 매핑)
인터넷: 203.0.113.1:50002 (← PC-B 매핑)

example.com 응답 → 공유기: 50001번 포트 → PC-A 192.168.0.10으로 전달
google.com 응답  → 공유기: 50002번 포트 → PC-B 192.168.0.11으로 전달
```

---

## 종합

NAT의 핵심은 "사설 IP + 포트 번호 → 공인 IP + 다른 포트 번호"로의 1:1 매핑이다. 포트가 65535개까지 있으므로 이론상 하나의 공인 IP로 수만 개의 동시 연결을 처리할 수 있다. NAT은 IPv4 주소 고갈을 실질적으로 버티게 해준 기술이다 — IPv6이 대중화되면 모든 장치가 공인 주소를 가질 수 있어 NAT이 불필요해진다. 단점으로는 NAT 뒤의 장치에는 외부에서 먼저 연결할 수 없어 P2P나 서버 호스팅이 복잡해진다.
