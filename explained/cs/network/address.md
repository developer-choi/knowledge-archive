# MAC 주소란 무엇인가?

## 도입

네트워크에서 장치를 식별하는 주소에는 두 종류가 있다 — 물리 주소(MAC)와 논리 주소(IP). MAC 주소는 NIC(Network Interface Controller), 즉 랜카드에 제조사가 부여하는 하드웨어 수준의 식별자다. 브라우저가 패킷을 보낼 때 IP 주소가 목적지를 지정하지만, 로컬 네트워크 안에서 실제 프레임을 특정 장치에 전달하는 것은 MAC 주소의 역할이다.

---

## 본문

> A MAC address is a **unique identifier** assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.

"MAC 주소는 네트워크 세그먼트 내 통신에서 네트워크 주소로 사용되기 위해 NIC에 할당된 고유 식별자다."

- **unique identifier**: 전 세계적으로 유일한 값. OUI(제조사 식별자 24비트) + 장치 고유 번호 24비트로 구성되어 중복이 생기지 않도록 설계되어 있다.
- **network interface controller (NIC)**: 랜카드 또는 와이파이 칩처럼 실제 신호를 주고받는 하드웨어 부품. IP는 호스트 단위지만 MAC은 NIC 단위다.
- **within a network segment**: MAC 주소는 같은 네트워크 세그먼트(로컬 네트워크) 안에서만 유효하다 — 라우터를 넘어가면 상위 홉의 MAC으로 교체된다.

> MAC addresses are primarily assigned by device manufacturers, and are therefore often referred to as a physical address.

"MAC 주소는 주로 장치 제조사가 할당하며, 그래서 흔히 물리 주소라고도 불린다."

- **primarily assigned by device manufacturers**: 공장 출하 시 NIC에 박혀 있다는 뜻. 소프트웨어로 변경(MAC spoofing)할 수 있지만 원칙적으로는 하드웨어에 고정된 값이다.
- **physical address**: IP 주소(논리 주소, Network Address)와 대비되는 명칭이다.

---

## 종합

MAC 주소는 "이 NIC가 누구인가"를 나타내는 하드웨어 차원의 이름이다. 로컬 네트워크에서 스위치가 특정 포트로 프레임을 보낼 때 MAC 주소를 참조하지만, 인터넷 수준의 라우팅에는 IP 주소가 필요하다. 그 이유는 다음 질문들에서 다룬다.

---

# [UNVERIFIED] 물리 주소와 네트워크 주소의 차이는?

## 도입

MAC 주소는 넓은 의미에서 "네트워크 주소"에 포함될 수 있지만, 실무와 교재에서는 명확히 구분한다. 이 질문은 두 용어가 어떻게 나뉘어 쓰이는지를 정리한다.

---

## 본문

MAC 주소는 넓은 의미에서는 네트워크 주소(Network Address)가 맞지만, 정확하게 구분한다면 MAC 주소는 **물리 주소(Physical Address)**, IP 주소는 **네트워크 주소(Network Address)** 라고 부른다.

- **물리 주소(Physical Address)**: 하드웨어에 고정된 식별자. MAC 주소가 여기 해당한다.
- **네트워크 주소(Network Address)**: 논리적으로 할당되는 식별자. IPv4/IPv6 주소가 여기 해당한다. 장치를 옮기거나 네트워크를 바꾸면 바뀐다.

```
NIC에 새겨진 값          DHCP·관리자가 할당한 값
MAC: 00:1A:2B:3C:4D:5E  IP: 192.168.0.10
(물리 주소)              (네트워크 주소)
바뀌지 않음              네트워크마다 다름
```

---

## 종합

두 주소는 계층이 다르다. MAC 주소는 데이터링크 계층(L2)에서, IP 주소는 네트워크 계층(L3)에서 동작한다. 스위치는 MAC으로 로컬 전달을 결정하고, 라우터는 IP로 네트워크 간 경로를 결정한다. 같은 장치라도 와이파이에 붙으면 IP가 달라질 수 있지만 MAC은 그대로다.

---

# IP 주소와 MAC 주소의 역할 차이는?

## 도입

IP와 MAC은 둘 다 주소지만 담당 역할이 다르다. IP는 "어느 네트워크에 있는 어떤 장치인가"를 표현하고, MAC은 "이 로컬 네트워크 안에서 어떤 NIC인가"를 표현한다. 이 구분이 흐릿하면 ARP가 왜 필요한지 이해하기 어렵다.

---

## 본문

> IP addresses serve two main functions: network interface identification, and location addressing.

"IP 주소는 두 가지 주요 기능을 한다: 네트워크 인터페이스 식별, 그리고 위치 주소 지정."

- **identification**: 장치가 누구인지 식별 — IP와 MAC 모두 하는 역할.
- **location addressing**: IP 주소의 고유 기능. 주소 자체에 "어느 네트워크에 속하는가"라는 위치 정보가 인코딩되어 있어 라우터가 경로를 계산할 수 있다.

> A MAC address is a unique identifier assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.

"MAC 주소는 네트워크 세그먼트 내 통신을 위해 NIC에 할당된 고유 식별자다."

| | IP 주소 | MAC 주소 |
|---|---|---|
| **역할** | 식별 + 위치 지정 | 식별만 |
| **범위** | 네트워크 간 라우팅 가능 | 같은 네트워크 세그먼트 내에서만 유효 |
| **위치 정보** | 네트워크 프리픽스에 위치 인코딩 | 없음 (공장에서 부여된 고정 번호) |

---

## 종합

IP는 계층적 주소(hierarchical addressing)라 라우터가 목적지 네트워크를 찾을 수 있고, MAC은 평면적 주소(flat addressing)라 로컬 전달에만 쓸 수 있다. 인터넷 패킷은 라우터를 거칠 때마다 목적지 IP는 유지되지만, MAC 주소는 홉마다 새로 붙여진다 — 각 홉에서 다음 장치의 MAC을 ARP로 알아내어 교체한다.

---

# 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?

## 도입

IP 주소만 있으면 목적지 네트워크까지 라우팅할 수 있다. 그런데 목적지 네트워크에 도달한 뒤, 같은 LAN 안의 수십 개 장치 중 정확히 어떤 NIC로 프레임을 보낼지는 IP만으로는 알 수 없다. 이 마지막 구간에서 MAC 주소가 필요하고, IP→MAC 변환을 담당하는 것이 ARP다.

---

## 본문

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

"ARP는 인터넷 계층 주소(보통 IPv4 주소)에 연결된 링크 계층 주소(예: MAC 주소)를 알아내기 위한 통신 프로토콜이다."

- **Address Resolution Protocol**: 주소 해결 프로토콜. "IP라는 논리 주소를 MAC이라는 물리 주소로 해결(resolve)한다"는 뜻.
- **discovering**: 미리 알고 있는 게 아니라 "찾아낸다" — broadcast로 질의해서 알아내는 과정이다.
- **link layer address**: 데이터링크 계층(L2) 주소 = MAC 주소.
- **internet layer address**: 네트워크 계층(L3) 주소 = IP 주소.

> ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.

"ARP는 IP 주소에 연결된 MAC 주소를 얻는 프로토콜을 제공함으로써, 호스트가 로컬 네트워크의 다른 노드에게 IPv4 패킷을 보낼 수 있게 한다."

```
내 PC (192.168.0.10)  →  "192.168.0.20 MAC이 뭐야?" (ARP broadcast)
                              ↓
192.168.0.20  →  "나야, MAC: AA:BB:CC:DD:EE:FF" (ARP reply, unicast)
                              ↓
내 PC  →  이더넷 프레임 [dst MAC: AA:BB:CC:DD:EE:FF] 전송
```

---

## 종합

IP와 MAC은 역할이 분리되어 있다. IP는 "어느 네트워크의 어느 호스트"를 나타내어 라우터가 경로를 찾게 해주고, MAC은 "이 LAN 안의 어떤 NIC"를 나타내어 스위치가 정확한 포트로 프레임을 보내게 해준다. 둘 다 없으면 패킷이 목적지 LAN에 도달해도 올바른 장치에 닿지 못한다. ARP는 이 두 세계를 이어주는 번역기다.

---

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

# MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

## 도입

"MAC이 전 세계에서 유일하다면 그것만으로 라우팅하면 안 되나?"라는 질문이 자연스럽게 나온다. 답은 MAC 주소에는 위치 정보가 없기 때문이다. 전 세계 80억 개 MAC을 일일이 뒤져야 하는 flat addressing과, 계층 구조로 목적지를 좁혀가는 hierarchical addressing의 차이가 핵심이다.

---

## 본문

> An IP address serves two principal functions: it identifies the host, or more specifically, its network interface, and it provides the location of the host in the network, and thus, the capability of establishing a path to that host.

"IP 주소는 두 가지 주요 기능을 한다: 호스트(더 정확하게는 그 네트워크 인터페이스)를 식별하고, 네트워크에서 호스트의 위치를 제공하여 그 호스트까지의 경로를 수립할 수 있게 한다."

- **identifies the host**: MAC도 하는 식별 기능. IP만의 차별점이 아니다.
- **provides the location**: 이것이 IP만의 핵심이다. IP 주소의 앞부분(네트워크 프리픽스)이 "어느 네트워크에 속하는가"를 인코딩하고 있다.
- **establishing a path**: 라우터가 목적지 IP의 프리픽스를 보고 "이 방향으로 가야 한다"는 경로를 계산할 수 있다. MAC만으로는 이 계산이 불가능하다.

```
MAC (flat addressing):           IP (hierarchical addressing):
00:1A:2B:3C:4D:5E               203.0.113.42
  ↑                               ↑         ↑
  전 세계 유일한 번호            네트워크 프리픽스  호스트 부분
  위치 정보 없음                (어느 네트워크)   (그 안의 누구)

MAC 라우팅 시나리오:             IP 라우팅 시나리오:
"00:1A:2B... 어디 있어?"         "203.0.113.x는 이 방향"
→ 전 세계에 broadcast 해야 함    → 프리픽스로 목적지 네트워크 특정
→ 불가능                         → 라우터가 단계적으로 좁혀감
```

비유로 표현하면: MAC은 주민등록번호(전국 유일, 그러나 번호만으론 거주지 모름), IP는 집 주소(시→구→동→번지 계층 구조, 택배 배송 가능)에 대응된다.

---

## 종합

MAC의 고유성은 로컬 식별에는 충분하지만, 인터넷 규모에서 경로를 계산하기에는 위치 정보가 없어 불가능하다. IP 주소는 계층적 구조 덕분에 라우터가 전체 주소 공간을 알 필요 없이 프리픽스만 보고 다음 홉을 결정할 수 있다. 이것이 인터넷이 전 세계 수십억 장치를 연결하면서도 경로 계산이 가능한 핵심 이유다.

---

# 네트워크 내에서 호스트를 어떻게 식별하는가?

## 도입

네트워크에서 데이터를 보내려면 목적지가 누구인지 알아야 한다. 식별 수단은 레이어에 따라 다르다 — 로컬 네트워크에서는 MAC, 라우터 간 경로를 찾을 때는 IP, 프로세스 수준에서는 포트 번호가 식별자 역할을 한다.

---

## 본문

> Within a computer network, hosts are identified by network addresses, which allow networking hardware to locate and identify hosts.

"컴퓨터 네트워크 내에서 호스트는 네트워크 주소로 식별되며, 이 주소가 네트워킹 하드웨어가 호스트를 위치 확인하고 식별할 수 있게 한다."

- **network addresses**: IP 주소(논리적)와 MAC 주소(물리적) 모두를 포함하는 넓은 표현이다. 상황에 따라 포트 번호나 서비스 ID 등 식별 수단이 더 추가될 수 있다.
- **networking hardware**: 라우터(L3)는 IP 주소를 보고 최적 경로를 찾고(routing), 스위치(L2)는 MAC 주소를 보고 정확한 장치를 식별해 데이터를 전달(forwarding)한다.
- **locate and identify**: "찾아서(locate) 식별한다(identify)" — 위치 파악과 신원 확인이 한 동작으로 결합되어 있다.

```
클라이언트 → 서버 요청 시 사용되는 식별자 계층

L7 (Application): URL, 도메인명 → DNS가 IP로 변환
L4 (Transport):   포트 번호 (예: 443) → 어느 프로세스로
L3 (Network):     IP 주소 (예: 93.184.216.34) → 어느 네트워크/호스트
L2 (Data Link):   MAC 주소 → 이 LAN 안의 어느 NIC
```

---

## 종합

"호스트를 식별한다"는 말은 단일 주소 하나를 말하는 것이 아니라, 계층별로 서로 다른 식별자가 협력한다는 의미다. 브라우저 주소창에 URL을 입력하면 DNS → IP → MAC 순으로 식별자가 계층을 내려가며 실제 하드웨어에까지 닿는다.

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
