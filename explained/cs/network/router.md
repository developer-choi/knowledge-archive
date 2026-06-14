# 라우터란 무엇인가?

## 도입

라우터는 패킷을 한 네트워크에서 다른 네트워크로 전달하는 장치다. 가정의 공유기(Wi-Fi 라우터)가 대표적인 예로, 집 안의 사설 네트워크(192.168.x.x)와 ISP 네트워크 사이를 중계한다. OA는 라우터를 "인터넷에서 트래픽 방향 결정 기능을 수행하는 컴퓨터 겸 네트워킹 장치"로 정의한다.

---

## 본문

> A router is a computer and networking device that forwards data packets between computer networks, including internetworks such as the global Internet.

"라우터는 전 세계 인터넷 같은 인터네트워크를 포함한 컴퓨터 네트워크들 사이에서 데이터 패킷을 전달하는 컴퓨터 겸 네트워킹 장치다."

- **forwards data packets**: 패킷을 "전달한다" — 만들거나 소비하는 게 아니라 받아서 다음 목적지로 넘긴다.
- **between computer networks**: 라우터의 본질은 "네트워크 경계를 넘나드는 것"이다. 같은 네트워크 안의 통신은 스위치가 담당하고, 다른 네트워크로 넘어갈 때 라우터가 개입한다.
- **internetworks**: 여러 네트워크가 서로 연결된 구조. 인터넷이 가장 큰 예시다.

> Routers perform the traffic directing functions on the Internet.
> A router is connected to two or more data lines from different IP networks.
> When a data packet comes in on a line, the router reads the network address information in the packet header to determine the ultimate destination.
> Then, using information in its routing table or routing policy, it directs the packet to the next network on its journey.

"라우터는 인터넷에서 트래픽 방향 결정 기능을 수행한다. 라우터는 서로 다른 IP 네트워크의 두 개 이상의 데이터 선에 연결된다. 데이터 패킷이 들어오면 라우터는 패킷 헤더의 네트워크 주소 정보를 읽어 최종 목적지를 파악한다. 그런 다음 라우팅 테이블이나 정책 정보를 사용해 패킷을 다음 네트워크로 안내한다."

- **routing table**: 목적지 IP 프리픽스와 다음 홉(next hop) 또는 출력 인터페이스의 매핑 테이블. 라우터의 핵심 데이터 구조다.
- **routing policy**: 테이블 외에 추가 규칙(QoS 우선순위, 특정 트래픽 차단 등)을 통해 결정에 영향을 미치는 정책.

> A data packet is forwarded from one router to another through an internetwork until it reaches its destination node.

"데이터 패킷은 목적지 노드에 도달할 때까지 인터네트워크를 통해 라우터에서 라우터로 전달된다."

```
패킷의 라우터 간 이동 (hop-by-hop 전달)

[PC (서울)] → [공유기] → [ISP 라우터] → [백본 라우터 A] → [백본 라우터 B] → [목적지 서버 (뉴욕)]
                 ↑              ↑                  ↑
         사설→공인 NAT    국내 AS 경계         대륙 간 링크
```

---

## 종합

라우터는 IP 주소를 보고 패킷의 다음 경로를 결정하는 장치다. 서울에서 뉴욕 서버로 `fetch()`를 보내면 수십 개의 라우터를 거치는데, 각 라우터가 목적지 IP를 보고 "이 방향으로"라고 결정을 반복한다. 공유기가 바로 이 역할을 하는 가장 친숙한 라우터다.

---

# 라우팅 테이블은 어떻게 만들어지는가?

## 도입

라우터가 패킷을 올바른 방향으로 보내려면 "어느 IP 대역이 어느 방향에 있는지" 알아야 한다. 이 지식이 라우팅 테이블이고, 테이블을 채우는 방법은 정적(관리자가 입력)과 동적(프로토콜이 자동 학습) 두 가지다.

---

## 본문

> A router maintains a routing table that lists which route should be used to forward a data packet, and through which physical interface connection.

"라우터는 데이터 패킷을 전달하기 위해 어떤 경로를 사용해야 하는지, 그리고 어떤 물리 인터페이스 연결을 통해 전달해야 하는지 목록을 담은 라우팅 테이블을 유지한다."

- **physical interface connection**: 라우터의 실제 물리 포트. "목적지 10.0.0.0/24 → eth1 포트로 내보내라" 식으로 테이블에 기록된다.

> It does this using internal pre-configured directives, called static routes, or by learning routes dynamically using a routing protocol.
> Static and dynamic routes are stored in the routing table.

"라우터는 정적 경로(static routes)라 불리는 미리 설정된 내부 지시를 사용하거나, 라우팅 프로토콜을 통해 동적으로 경로를 학습하는 방식으로 테이블을 만든다. 정적·동적 경로 모두 라우팅 테이블에 저장된다."

- **static routes**: 관리자가 직접 입력한 경로. 변하지 않는 소규모 네트워크에 적합하다. 변경이 생기면 수동으로 업데이트해야 한다.
- **routing protocol**: OSPF, BGP, EIGRP 같은 프로토콜이 라우터 간에 경로 정보를 자동으로 교환하고 테이블을 갱신한다. 인터넷 규모에서는 동적 라우팅이 필수다.

```
라우팅 테이블 예시

목적지 네트워크    게이트웨이 (다음 홉)    인터페이스
0.0.0.0/0         192.0.2.1             eth0   (기본 경로, 인터넷)
10.0.0.0/8        10.1.0.1              eth1   (사내 네트워크)
192.168.1.0/24    직접 연결              eth2   (로컬 LAN)
```

---

## 종합

라우팅 테이블은 라우터의 "지도"다. 정적 경로는 소규모·예측 가능한 환경에, 동적 라우팅 프로토콜은 변화가 잦거나 규모가 큰 환경에 적합하다. 인터넷 백본 라우터들은 BGP로 서로 경로를 교환하며 전 세계 라우팅 테이블을 유지한다.

---

# 라우터가 Layer 3 장치인 이유는?

## 도입

OSI 7계층 모델에서 라우터는 L3(네트워크 계층) 장치로 분류된다. 그 이유는 라우터가 패킷을 전달하는 기준이 L3 정보인 IP 주소이기 때문이다.

---

## 본문

> A router is considered a layer-3 device because its primary forwarding decision is based on the information in the layer-3 IP packet, specifically the destination IP address.

"라우터가 레이어 3 장치로 간주되는 이유는 주요 전달 결정이 레이어 3 IP 패킷의 정보, 특히 목적지 IP 주소에 기반하기 때문이다."

- **primary forwarding decision**: "주요 전달 결정" — 라우터가 패킷을 어디로 보낼지 결정하는 핵심 기준이 IP 주소라는 뜻이다.
- **layer-3 IP packet**: IP 헤더에는 목적지 IP가 있고, 라우터는 이 주소를 라우팅 테이블과 대조하여 다음 홉을 결정한다.

계층별 장치 비교:
- L1 (물리 계층): 허브, 리피터 — 전기 신호만 처리
- L2 (데이터링크 계층): 스위치 — MAC 주소 기반 전달
- L3 (네트워크 계층): 라우터 — IP 주소 기반 전달

---

## 종합

라우터가 L3 장치라는 것은 곧 "IP를 이해한다"는 의미다. 스위치(L2)는 MAC 주소만 보고 같은 LAN 안의 전달을 담당하고, 라우터는 IP를 보고 다른 네트워크로의 전달을 담당한다. 계층이 올라갈수록 더 많은 정보를 보고 더 지능적인 결정을 내린다.

---

# 라우터는 패킷을 받으면 어떻게 전달하는가?

## 도입

패킷이 라우터에 도착한 순간부터 다음 목적지로 나가기까지의 구체적인 과정을 다룬다. 라우팅 테이블 조회, 최적 경로 선택, 그리고 L2 캡슐화 순으로 이루어진다.

---

## 본문

> When a router receives a packet, it searches its routing table to find the best match between the destination IP address of the packet and one of the addresses in the routing table.

"라우터가 패킷을 받으면 패킷의 목적지 IP 주소와 라우팅 테이블의 주소 사이에서 가장 잘 맞는 것을 찾기 위해 라우팅 테이블을 탐색한다."

- **best match**: "최장 프리픽스 매치(Longest Prefix Match)" 알고리즘. 더 구체적인(긴) 프리픽스가 더 짧은 것보다 우선순위가 높다. 예: `192.168.1.0/24`가 `192.168.0.0/16`보다 구체적이므로 우선 적용된다.

> Once a match is found, the packet is encapsulated in the layer-2 data link frame for the outgoing interface indicated in the table entry.

"매치가 발견되면 패킷은 테이블 항목에 표시된 출력 인터페이스를 위한 레이어 2 데이터링크 프레임으로 캡슐화된다."

- **encapsulated in the layer-2 data link frame**: 라우터는 IP 패킷(L3)을 그 인터페이스에 맞는 이더넷 프레임(L2)으로 감싼다. 이때 다음 홉의 MAC 주소를 ARP로 알아내 이더넷 헤더를 붙인다.

```
패킷 전달 과정

1. 패킷 수신 (L2 프레임에서 L3 패킷 추출)
2. 목적지 IP 추출: 93.184.216.34
3. 라우팅 테이블 Longest Prefix Match:
   93.184.216.0/24 → eth0 인터페이스, 다음 홉: 10.0.0.1
4. ARP로 다음 홉(10.0.0.1)의 MAC 주소 확인
5. 새 이더넷 프레임 생성 (dst MAC: 다음 홉 MAC)
6. eth0 인터페이스로 전송
```

---

## 종합

라우터의 패킷 전달은 "L3 결정(어느 경로로) + L2 재포장(어떤 프레임으로)"의 두 단계다. 매 홉마다 IP 주소는 유지되지만 이더넷 프레임(L2 헤더, MAC 주소)은 새로 붙여진다. 출발지 PC의 MAC이 목적지 서버에 도달하지 못하고 중간에 교체되는 이유가 이것이다.

---

# 라우터는 전달한 패킷의 정보를 기억하는가?

## 도입

라우터는 패킷을 전달한 뒤 그 패킷에 대한 기록을 남기지 않는다. REST의 Statelessness처럼, 라우터도 각 패킷을 독립적으로 처리한다. 이 설계가 인터넷 규모에서의 확장성을 만든다.

---

## 본문

> A router typically does not look into the packet payload, but only at the layer-3 addresses to make a forwarding decision, plus optionally other information in the header for hints on, for example, quality of service (QoS).

"라우터는 일반적으로 패킷 페이로드를 들여다보지 않고, 전달 결정을 위해 레이어 3 주소만 보며, 선택적으로 헤더의 다른 정보(예: QoS)도 참고한다."

- **does not look into the packet payload**: 라우터는 내용물(HTTP 바디, HTML 등)을 읽지 않는다. 봉투 주소만 보고 배달한다 — 봉투를 열지 않는다.
- **quality of service (QoS)**: 트래픽 우선순위 제어. 화상 통화 패킷을 파일 다운로드 패킷보다 우선 처리하는 것이 예시다.

> For pure IP forwarding, a router is designed to minimize the state information associated with individual packets.
> Once a packet is forwarded, the router does not retain any historical information about the packet.

"순수 IP 포워딩에서 라우터는 개별 패킷과 관련된 상태 정보를 최소화하도록 설계된다. 패킷이 전달되면 라우터는 그 패킷에 대한 역사 정보를 전혀 보관하지 않는다."

- **minimize the state information**: 상태를 거의 안 가진다. 라우터가 수십만 패킷/초를 처리해도 상태를 저장하지 않으니 메모리 고갈이 없다.
- **does not retain any historical information**: 패킷을 전달하면 즉시 잊는다. 이것이 라우터가 선형으로 확장 가능한 이유다.

---

## 종합

라우터가 상태를 기억하지 않는 설계는 인터넷 규모의 확장성을 가능하게 한다. 전 세계 수십억 개 패킷이 오가도 라우터는 각 패킷을 독립적으로 처리하고 잊는다. 반면 방화벽(stateful firewall)은 연결 추적 테이블을 유지해 상태 기반 패킷 필터링을 하는데, 이는 라우터보다 비용이 크다.

---

# 라우팅과 포워딩의 차이는?

## 도입

"라우팅"과 "포워딩"은 혼용되기 쉽지만 정확히 다른 개념이다. 라우팅은 경로를 계산하는 제어 면(control plane)의 역할이고, 포워딩은 패킷을 실제로 이동시키는 데이터 면(data plane)의 역할이다.

---

## 본문

> Routing is the process of selecting a path for traffic in a network.

"라우팅은 네트워크에서 트래픽의 경로를 선택하는 과정이다."

- **selecting a path**: 경로 계산·선택. 라우팅 프로토콜(OSPF, BGP)이 이 작업을 담당하며, 결과가 라우팅 테이블에 저장된다.

> Forwarding is the relaying of packets from one network segment to another by nodes in a computer network.

"포워딩은 컴퓨터 네트워크의 노드들이 패킷을 한 네트워크 세그먼트에서 다른 곳으로 중계하는 것이다."

- **relaying**: "중계" — 받은 패킷을 다음 목적지로 내보내는 실제 동작.

사용자 관점의 구분:
- **라우팅(Routing)**: 패킷이 목적지까지 가는 최적 경로를 결정하는 과정. 이 결정은 라우팅 테이블에 미리 계산되어 있다.
- **포워딩(Forwarding)**: 라우터가 입력 포트에서 받은 패킷을 라우팅 테이블에 따라 적절한 출력 포트로 실제로 이동시키는 동작.

```
라우팅 vs 포워딩

[라우팅 프로토콜 (control plane)]
OSPF/BGP가 이웃 라우터와 경로 정보 교환
→ 라우팅 테이블 계산·업데이트

[포워딩 (data plane)]
패킷 도착 → 라우팅 테이블 조회 → 해당 포트로 내보내기
```

비유: 라우팅은 내비게이션이 경로를 계산하는 것, 포워딩은 운전자가 핸들을 꺾어 실제로 그 방향으로 가는 것이다.

---

## 종합

라우팅이 "어디로?"를 결정하면, 포워딩이 "실제로 거기로 보낸다". 라우팅은 비교적 천천히 경로를 계산해 테이블을 만들고, 포워딩은 그 테이블을 참조해 초당 수백만 패킷을 처리해야 하므로 전용 하드웨어(ASIC)를 쓴다.

---

# 라우터는 '다른 네트워크'의 경계를 어떻게 정의하는가?

## 도입

라우터가 "다른 네트워크"로 패킷을 보낸다고 할 때, "다른 네트워크"를 어떻게 판별하는가? 답은 IP 주소의 네트워크 프리픽스(서브넷)다.

---

## 본문

> An IP address is recognized as consisting of two parts: the network prefix in the high-order bits and the remaining bits called the rest field, host identifier, or interface identifier (IPv6), used for host numbering within a network.
> The subnet mask or CIDR notation determines how the IP address is divided into network and host parts.

"IP 주소는 두 부분으로 이루어진 것으로 인식된다: 상위 비트의 네트워크 프리픽스와, 네트워크 내 호스트 번호 지정에 사용되는 나머지 비트(나머지 필드, 호스트 식별자, 또는 IPv6의 인터페이스 식별자). 서브넷 마스크나 CIDR 표기가 IP 주소가 네트워크와 호스트 부분으로 어떻게 나뉘는지를 결정한다."

- **network prefix in the high-order bits**: IP 주소의 앞부분이 "어느 네트워크"인지를 나타낸다.
- **host identifier**: IP 주소의 뒷부분이 "그 네트워크 안의 어떤 호스트"인지를 나타낸다.
- **CIDR notation**: `192.168.1.0/24`처럼 슬래시 뒤 숫자가 네트워크 프리픽스 비트 수를 나타낸다. `/24`는 앞 24비트가 네트워크 부분.

같은 네트워크 프리픽스를 공유하는 장치들이 하나의 네트워크를 이룬다. 라우터는 목적지 IP의 네트워크 프리픽스를 라우팅 테이블과 대조하여, 자신의 직접 연결된 네트워크와 프리픽스가 다르면 "다른 네트워크"로 판단하고 적절한 다음 홉으로 포워딩한다.

```
IP 주소 구조 예시 (CIDR /24)

192.168.1.42
├── 192.168.1  (네트워크 프리픽스 /24, 24비트)
└── .42        (호스트 식별자, 8비트)

같은 네트워크: 192.168.1.x (프리픽스 동일)
다른 네트워크: 192.168.2.x (프리픽스 다름 → 라우터 필요)
```

---

## 종합

"다른 네트워크"의 경계는 네트워크 프리픽스(서브넷)가 다른 것을 말한다. 라우터는 패킷의 목적지 IP에서 프리픽스를 추출해 자신의 인터페이스 테이블과 비교한다. 프리픽스가 직접 연결된 인터페이스 중 어느 것도 아니면 라우팅 테이블을 보고 다음 홉으로 전달한다. 가정의 공유기가 192.168.1.x를 로컬로 알고 그 외 주소를 모두 인터넷(WAN)으로 내보내는 것이 이 원리다.
