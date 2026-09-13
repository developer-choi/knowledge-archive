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

#### 물리 주소와 네트워크 주소라는 이름

MAC 주소도 넓은 의미에서는 네트워크 주소(Network Address)에 포함되지만, 정확하게 구분할 때는 MAC 주소를 **물리 주소(Physical Address)**, IP 주소를 **네트워크 주소(Network Address)** 라고 부른다.

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

MAC 주소는 "이 NIC가 누구인가"를 나타내는 하드웨어 차원의 이름이다. 두 주소는 계층도 다르다 — MAC은 데이터링크 계층(L2)에서, IP는 네트워크 계층(L3)에서 동작한다. 로컬 네트워크에서 스위치가 특정 포트로 프레임을 보낼 때 MAC 주소를 참조하지만, 인터넷 수준의 라우팅에는 IP 주소가 필요하다. 그 이유는 다음 질문들에서 다룬다.

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
