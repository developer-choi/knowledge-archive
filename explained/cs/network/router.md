# 라우터란 무엇인가?

> A router is a computer and networking device that forwards data packets between computer networks, including internetworks such as the global Internet.
>
> Routers perform the traffic directing functions on the Internet.
> A router is connected to two or more data lines from different IP networks.
> When a data packet comes in on a line, the router reads the network address information in the packet header to determine the ultimate destination.
> Then, using information in its routing table or routing policy, it directs the packet to the next network on its journey.
> A data packet is forwarded from one router to another through an internetwork until it reaches its destination node.

---

**도입**

집 공유기·회사 네트워크 장비·ISP의 백본 장비 모두 본질은 같은 한 종류 — 라우터입니다. 하는 일은 단순합니다. **다른 네트워크 사이를 잇고 패킷을 다음 hop으로 넘긴다**. 이 한 줄짜리 동작이 인터넷 전체의 골격이고, `fetch()` 한 번이 글로벌 인터넷을 가로지를 수 있게 해주는 메커니즘이기도 합니다.

---

**본문**

> A router is a computer and networking device that forwards data packets between computer networks,

라우터는 컴퓨터 네트워크 사이로 데이터 패킷을 전달하는 컴퓨터이자 네트워킹 장치다.

- **a computer**: "컴퓨터"라는 점이 중요. 라우터는 단순 회로가 아니라 OS와 CPU가 있는 컴퓨터입니다. 그래서 학습·정책·라우팅 알고리즘 같은 복잡한 결정을 할 수 있음.
- **forwards data packets between computer networks**: 핵심 동사. **다른 네트워크 사이로** 패킷을 전달. 같은 네트워크 안의 전달은 스위치의 일.

> including internetworks such as the global Internet.

글로벌 인터넷 같은 inter-network을 포함하여.

- **internetworks**: 네트워크들의 네트워크. 글로벌 인터넷이 그 대표 예 — 수많은 네트워크가 라우터로 연결된 결과.

> Routers perform the traffic directing functions on the Internet.

라우터는 인터넷에서 트래픽 안내 기능을 수행한다.

- **traffic directing functions**: 트래픽 방향 안내. "이 패킷은 어디로 보내라"의 결정자.

> A router is connected to two or more data lines from different IP networks.

라우터는 서로 다른 IP 네트워크의 두 개 이상의 데이터 회선과 연결된다.

- **two or more data lines**: 적어도 두 회선. 라우터는 **여러 네트워크의 경계**에 위치하는 장비라 최소 두 회선이 필요. 가정 공유기의 WAN 포트(외부)와 LAN 포트(내부)가 그 예.
- **different IP networks**: 서로 다른 IP 네트워크. 같은 네트워크 안만 잇는 건 스위치의 영역.

> When a data packet comes in on a line, the router reads the network address information in the packet header

데이터 패킷이 한 회선으로 들어오면, 라우터는 패킷 헤더의 네트워크 주소 정보를 읽고

- **reads the network address information in the packet header**: 패킷 헤더의 IP 주소를 읽음. payload(본문)는 안 봅니다 — 라우팅에 필요한 메타데이터만 확인.

> to determine the ultimate destination.

최종 목적지를 결정한다.

- **ultimate destination**: 최종 목적지. 직접 연결된 다음 hop이 아니라 패킷이 궁극적으로 가야 할 곳.

> Then, using information in its routing table or routing policy, it directs the packet to the next network on its journey.

그런 다음 라우팅 테이블이나 라우팅 정책의 정보를 사용해, 패킷을 그 여정의 다음 네트워크로 보낸다.

- **routing table**: 라우팅 테이블. "어느 prefix로 가려면 어느 인터페이스/다음 hop으로"라는 매핑.
- **routing policy**: 라우팅 정책. 단순 매핑 외에 "이 트래픽은 이 경로로 우선 보내라" 같은 더 복잡한 규칙.
- **the next network**: **다음 네트워크**. 한 번에 목적지까지 가는 게 아니라 한 hop씩 이어 감 — hop-by-hop 라우팅의 본질.

> A data packet is forwarded from one router to another through an internetwork until it reaches its destination node.

데이터 패킷은 하나의 라우터에서 다른 라우터로 inter-network을 통해 전달되어 목적지 노드에 도달할 때까지 계속된다.

- **from one router to another**: 라우터 → 라우터로 hop 단위. 각 라우터는 다음 hop만 결정하고 그 너머는 다음 라우터에 위임.
- **until it reaches its destination node**: 최종 목적지 노드에 도달할 때까지. 누적된 hop이 결국 목적지까지의 경로를 만듭니다.

---

**종합**

라우터의 동작을 한 사이클로 정리하면:

| 단계 | 동작 |
|---|---|
| 1. 수신 | 한 회선으로 패킷 도착 |
| 2. 헤더 읽기 | IP 헤더의 목적지 IP 확인 |
| 3. 테이블 조회 | 라우팅 테이블에서 best match 찾기 |
| 4. 캡슐화 | 다음 회선의 L2 프레임으로 다시 포장 |
| 5. 송출 | 결정된 출력 인터페이스로 송신 |

브라우저 개발자가 라우터의 흔적을 보는 곳:
- `traceroute google.com` (또는 Windows의 `tracert`)을 실행하면 패킷이 거치는 라우터들의 IP가 줄지어 나옵니다. 한국에서 google.com까지 보통 10~15 hop. 매 hop마다 한 라우터가 자기 라우팅 테이블을 보고 다음 hop을 결정한 결과.
- 가정 공유기의 관리 페이지(`192.168.0.1` 또는 `192.168.1.1`)에 들어가면 "WAN" 탭에서 ISP가 부여한 공인 IP, "LAN" 탭에서 내부 192.168.x.x 대역을 볼 수 있습니다 — 두 네트워크의 경계에 라우터가 있다는 그 정의 그대로.

라우터 vs 스위치의 결정적 차이를 다시 보면:

| | 라우터 | 스위치 |
|---|---|---|
| 동작 계층 | L3 (IP) | L2 (MAC) |
| 잇는 대상 | 서로 다른 네트워크 | 같은 네트워크 안의 장치 |
| 결정 기준 | IP 주소(prefix) | MAC 주소 |
| broadcast 차단 | O — broadcast domain 분리 | X — 같은 LAN은 1개 |

오개념 예방: "공유기 = 라우터"는 절반만 맞습니다. 가정용 공유기는 **라우터 + 스위치 + Wi-Fi AP + DHCP 서버 + NAT**의 합본 장비입니다. 그중 라우터 기능은 WAN ↔ LAN 사이의 패킷 전달이고, LAN 내부 장치 간 통신은 같은 박스의 스위치 부분이 처리합니다.

User Annotation 보충 — "집 안의 사설 네트워크(192.168.x.x)와 ISP 네트워크 사이에서 패킷을 전달한다"가 정확한 그림입니다. 라우터는 정확히 두 네트워크의 **경계**에 서 있고, 그 두 네트워크 사이의 모든 트래픽은 라우터를 통과합니다.

이게 없으면 어떻게 되는가: 라우터 없이 스위치만 쓴다면 네트워크 사이가 끊어져 인터넷이 성립하지 않습니다. 회사 LAN과 다른 회사 LAN, 한국 ISP와 미국 ISP, 데이터센터와 사용자 가정 — 이 모든 다른 네트워크 사이를 잇는 게 라우터의 일입니다. 인터넷이 "네트워크들의 네트워크"인 이유는 그 네트워크들을 라우터가 이어주고 있기 때문입니다.

---

# 라우팅 테이블은 어떻게 만들어지는가?

> A router maintains a routing table that lists which route should be used to forward a data packet, and through which physical interface connection.
> It does this using internal pre-configured directives, called static routes, or by learning routes dynamically using a routing protocol.
> Static and dynamic routes are stored in the routing table.

---

**도입**

라우터가 패킷을 다음 hop으로 보낼 때 참조하는 표가 라우팅 테이블입니다. 그런데 그 표에 있는 줄들은 어디서 왔을까요? 두 경로뿐입니다 — 사람이 손으로 박은 것(static), 또는 다른 라우터들과 협의해 자동 학습한 것(dynamic). 가정 공유기의 작은 테이블도, 백본 라우터의 100만 줄짜리 테이블도 모두 이 두 출처의 조합입니다.

---

**본문**

> A router maintains a routing table that lists which route should be used to forward a data packet,

라우터는 데이터 패킷을 전달하는 데 어떤 경로를 사용해야 하는지를 나열한 라우팅 테이블을 유지한다.

- **maintains**: 유지한다. 한 번 만들고 끝이 아니라 지속적으로 갱신.
- **which route should be used**: 어떤 경로를 써야 하는지 — 매 패킷마다 이 테이블을 조회해 결정.

> and through which physical interface connection.

그리고 어떤 물리 인터페이스 연결을 통할지도.

- **physical interface connection**: 물리 인터페이스. 라우팅 테이블에는 "다음 hop의 IP" 외에도 "어느 포트로 내보낼지"가 함께 적힙니다.

> It does this using internal pre-configured directives, called static routes,

이를 사전 설정된 내부 지시(static route)를 통해서 하거나,

- **internal pre-configured directives**: 내부에 미리 설정된 지시문. 사람이 라우터에 직접 입력한 규칙.
- **static routes**: 정적 경로. 변하지 않음. 관리자가 박은 그대로 유지.

> or by learning routes dynamically using a routing protocol.

또는 라우팅 프로토콜을 사용해 동적으로 경로를 학습함으로써 한다.

- **learning routes dynamically**: 동적 학습. 다른 라우터들과 정보 교환을 통해 자동으로 경로를 알아냄.
- **routing protocol**: 라우팅 프로토콜. OSPF, BGP, RIP 같은 것. 라우터끼리 "내가 어디로 가는 길을 안다"고 알리는 약속된 통신 규약.

> Static and dynamic routes are stored in the routing table.

정적 경로와 동적 경로 모두 라우팅 테이블에 저장된다.

- **stored in the routing table**: 두 출처의 경로가 같은 테이블에 함께 저장됨. 라우터가 패킷을 보낼 때는 출처를 가리지 않고 best match로 사용.

---

**종합**

라우팅 테이블이 채워지는 두 경로를 비교하면:

| | Static Route | Dynamic Route |
|---|---|---|
| 누가 만드는가 | 관리자가 수동 설정 | 라우팅 프로토콜이 자동 학습 |
| 변경 시 | 관리자가 수동으로 갱신 | 자동으로 재계산·업데이트 |
| 대표 사용처 | 가정 공유기, 단순 사내망 | ISP·기업 백본·데이터센터 |
| 장점 | 단순, 예측 가능, CPU 부하 없음 | 자동 페일오버, 토폴로지 변화 적응 |
| 단점 | 변경 시 수동 작업, 장애 시 자동 우회 못함 | 프로토콜 학습 비용, CPU·메모리 사용 |

브라우저 개발자가 일상에서 마주치는 두 사례:
- 가정 공유기 — "0.0.0.0/0 (default route) → ISP의 게이트웨이 IP"라는 한 줄짜리 static route가 사실상 전부. 인터넷으로 가는 모든 패킷이 그 한 줄을 따라 ISP로 나갑니다.
- 회사 사옥의 라우터 — OSPF로 사내 여러 라우터끼리 정보 교환해 경로를 자동 학습. 한 회선이 끊겨도 다른 라우터들이 "이 경로 죽었다"는 신호를 받고 우회로로 자동 전환.

대표적인 라우팅 프로토콜:
- **OSPF (Open Shortest Path First)** — 한 조직 내(intra-AS) 라우팅. 다익스트라 알고리즘 기반.
- **BGP (Border Gateway Protocol)** — 조직 간(inter-AS) 라우팅. 인터넷 전역의 prefix 광고가 이걸로 일어남.
- **RIP (Routing Information Protocol)** — 옛 프로토콜. 단순하지만 hop 수 한계(15) 등 제약이 많아 거의 안 쓰임.

`netstat -rn` (Windows·macOS·Linux 공통)으로 자기 노트북의 라우팅 테이블을 직접 볼 수 있습니다 — 보통 default route 1줄(`0.0.0.0/0` → 게이트웨이) + 자기 LAN 1줄 + loopback 1줄 정도로 단순합니다. 라우터의 100만 줄 테이블과는 비교가 안 되지만 구조는 같습니다.

오개념 예방: "동적 라우팅 = 빠르게 변한다"는 인식은 부정확합니다. 동적 라우팅은 "자동으로 학습한다"는 뜻이지 매 초 변한다는 뜻이 아닙니다 — 보통 토폴로지 변화(회선 끊김·새 라우터 추가) 시에만 갱신되며, 안정 상태에서는 변하지 않습니다.

이게 없으면 어떻게 되는가:
- 동적 라우팅 없이 모든 경로를 static으로 관리한다면 인터넷이 작동 불가능. 전 세계 ISP들이 매번 새 prefix가 생길 때마다 모든 라우터를 수동으로 갱신해야 합니다. BGP가 그 일을 자동화한 덕분에 새 회사가 인터넷에 prefix를 등록하면 몇 분 안에 전 세계 라우터가 알게 됩니다.
- 정적 라우팅 없이 모든 걸 동적으로 한다면 작은 LAN조차 라우팅 프로토콜을 돌려야 해 오버엔지니어링. 두 방식이 공존하는 게 단순함과 자동화 사이의 균형입니다.

---

# 라우터가 Layer 3 장치인 이유는?

> A router is considered a layer-3 device because its primary forwarding decision is based on the information in the layer-3 IP packet, specifically the destination IP address.

---

**도입**

OSI 7계층에서 장비를 분류할 때 기준은 단순합니다 — **그 장비가 전달 결정을 어느 계층의 정보로 내리는가**. 허브는 신호 자체(L1), 스위치는 MAC(L2), 라우터는 IP(L3). 이 한 줄 정의가 라우터를 "L3 장치"라 부르는 이유의 전부입니다.

---

**본문**

> A router is considered a layer-3 device

라우터는 layer-3 장치로 간주된다.

- **considered a layer-3 device**: L3 장치로 분류된다. 누가 정한 게 아니라 동작에 의한 분류.

> because its primary forwarding decision is based on the information in the layer-3 IP packet,

왜냐하면 그 주된 전달 결정이 L3 IP 패킷의 정보에 기반하기 때문이다.

- **primary forwarding decision**: **주된** 전달 결정. "어디로 보낼지"를 결정하는 핵심 행동. 그 결정이 어느 계층 정보를 보느냐가 분류의 기준.
- **based on the information in the layer-3 IP packet**: L3 IP 패킷의 정보에 기반. IP 헤더가 들고 있는 정보를 본다.

> specifically the destination IP address.

구체적으로는 목적지 IP 주소.

- **specifically**: 구체적으로. IP 헤더 안에 여러 필드가 있지만 라우팅 결정에서 가장 핵심은 destination IP.
- **destination IP address**: 목적지 IP. 이 한 값으로 라우팅 테이블 조회 → 다음 hop 결정. 라우터의 핫패스에서 매 패킷마다 보는 가장 중요한 필드.

---

**종합**

OSI 계층별 장비 분류를 한눈에:

| 장비 | 계층 | 결정 기준 | 동작 |
|---|---|---|---|
| 허브 | L1 (Physical) | 없음 (신호만 증폭) | 모든 포트로 그대로 |
| 스위치 | L2 (Data Link) | MAC 주소 | LAN 안의 정확한 포트로 |
| 라우터 | L3 (Network) | 목적지 IP 주소 | 다른 네트워크의 다음 hop으로 |
| L4-L7 장비 (LB·방화벽 등) | L4~L7 | 포트·세션·HTTP 헤더 등 | 더 정교한 분기 |

브라우저 개발자가 라우터의 L3 동작을 직관적으로 보는 곳:
- `traceroute google.com`을 실행하면 hop마다 IP가 보이고 latency가 측정됩니다. 각 hop이 한 라우터이고, 매 hop마다 그 라우터가 자기 라우팅 테이블에서 destination IP를 조회해 다음 hop을 결정한 결과가 누적되어 보이는 것.
- 라우터는 패킷 본문(payload)을 보지 않습니다. HTTPS 콘텐츠가 암호화되어 있어도 라우터는 IP 헤더만 보면 되니 신경 쓸 일이 없습니다 — L3는 "어디로"만 결정하고 "무엇을"은 더 위 계층의 일.

L3 장치라는 분류의 함의:
- L3에서 동작하므로 **다른 네트워크 사이를** 이을 수 있습니다 (각 네트워크는 IP prefix로 식별되므로). 스위치가 같은 LAN 안만 잇는 것과 결정적 차이.
- L3 정보(IP)를 본다는 것은 라우팅 테이블이 IP prefix 단위로 관리됨을 의미합니다 — `192.168.0.0/24`처럼 묶어서 관리하므로 테이블 크기가 효율적.
- L2 정보(MAC)는 hop마다 갈아 끼워집니다. 라우터가 다음 hop으로 보낼 때 새 MAC 헤더를 붙여 다시 캡슐화하기 때문.

오개념 예방 — "라우터는 IP만 본다"는 부분만 맞습니다. 정확히는 **주된 forwarding 결정을 IP로 한다**는 것이고, 라우터도 ARP·ICMP 같은 L2/L3 보조 동작은 하고, L3 스위치·QoS 정책 적용 시에는 L4 포트나 ToS 필드도 함께 봅니다. "주된 forwarding 결정"이라는 한정이 그래서 정확합니다 — 다른 보조 정보를 안 본다는 게 아닙니다.

장비를 계층으로 분류하는 이유:
- 명확한 책임 분리 — 허브는 신호 증폭만, 스위치는 LAN 분기만, 라우터는 네트워크 사이 라우팅만.
- 트러블슈팅의 시작점 — "이 문제가 어느 계층에서 발생했는가"라는 진단 프레임이 자연스럽게 따라옴.
- 표준화 — 같은 L3 장비끼리는 호환 가능 (어떤 회사 라우터든 IP 헤더를 표준대로 읽음).

이게 없으면 어떻게 되는가: 계층 분류 없이 "그냥 네트워크 장비"로 통칭하면 동작 차이가 가려집니다. 라우터가 broadcast를 차단한다는 사실, 스위치가 collision domain을 분리하지만 broadcast domain은 못 한다는 사실 등이 모두 "어느 계층에서 동작하느냐"의 결과입니다. 계층 모델이 있어서 이 차이를 한 줄로 설명할 수 있게 됩니다 — 라우터는 L3, 그래서 IP·prefix·broadcast 차단까지 한 패키지로 묶입니다.

---

# 라우터는 패킷을 받으면 어떻게 전달하는가?

> When a router receives a packet, it searches its routing table to find the best match between the destination IP address of the packet and one of the addresses in the routing table.
> Once a match is found, the packet is encapsulated in the layer-2 data link frame for the outgoing interface indicated in the table entry.

---

**도입**

라우터가 매 패킷을 처리하는 한 사이클이 이 두 문장에 압축되어 있습니다 — **테이블 조회 → 캡슐화 → 송출**. 단순해 보이지만 이 한 사이클이 초당 수백만 번 일어나며, "best match" 알고리즘과 "L2 재캡슐화"라는 두 디테일이 라우팅의 효율과 정확성을 좌우합니다.

---

**본문**

> When a router receives a packet, it searches its routing table to find the best match between the destination IP address of the packet and one of the addresses in the routing table.

라우터가 패킷을 받으면, 패킷의 목적지 IP 주소와 라우팅 테이블의 주소들 중 가장 잘 맞는 항목(best match)을 찾기 위해 테이블을 검색한다.

- **searches its routing table**: 자기 라우팅 테이블을 검색. 매 패킷마다 일어나는 핫패스 동작.
- **best match**: 단순 매치가 아니라 **가장 잘 맞는** 매치. 라우팅 테이블에는 여러 entry가 동시에 매치할 수 있고, 그중 가장 구체적인 것(longest prefix match)이 선택됩니다.
- **destination IP address**: 패킷 헤더의 목적지 IP. 이 한 값을 키로 검색.

> Once a match is found, the packet is encapsulated in the layer-2 data link frame for the outgoing interface indicated in the table entry.

매치가 발견되면, 패킷은 테이블 항목이 가리키는 출력 인터페이스에 맞는 L2 데이터링크 프레임으로 캡슐화된다.

- **encapsulated in the layer-2 data link frame**: L2 프레임으로 다시 포장. 들어올 때의 L2 프레임과는 **다른** 프레임. 다음 hop으로 가는 회선의 매체에 맞는 새 헤더(이더넷이면 새 source/destination MAC)를 붙입니다.
- **for the outgoing interface**: 출력 인터페이스에 맞는. 인터페이스마다 매체가 다를 수 있어 (이더넷·Wi-Fi·시리얼 등) 그에 맞는 L2 포맷으로 캡슐화.
- **indicated in the table entry**: 라우팅 테이블의 항목에 적혀 있는 대로. 어느 인터페이스로 내보낼지가 테이블에 함께 기록되어 있음.

---

**종합**

라우터가 한 패킷을 처리하는 흐름을 단계별로:

| 단계 | 동작 | 사용 정보 |
|---|---|---|
| 1. 수신 | 회선에서 L2 프레임을 받아 IP 패킷을 추출 | 들어온 L2 헤더는 여기서 버려짐 |
| 2. 헤더 읽기 | IP 헤더의 목적지 IP 확인 | destination IP |
| 3. 테이블 조회 | 라우팅 테이블에서 longest prefix match 검색 | 라우팅 테이블 (FIB) |
| 4. 다음 hop 결정 | 매치된 entry의 다음 hop · 출력 인터페이스 확인 | 테이블 entry |
| 5. ARP 조회 | 다음 hop의 IP → MAC 변환 | ARP 캐시 |
| 6. 재캡슐화 | 새 L2 프레임에 IP 패킷을 담음 | 새 source/destination MAC |
| 7. 송출 | 결정된 출력 인터페이스로 송신 | — |

**Longest Prefix Match**가 핵심 알고리즘:

라우팅 테이블에 다음 두 entry가 있다고 합시다:
- `192.168.0.0/16` → 인터페이스 A
- `192.168.10.0/24` → 인터페이스 B

목적지 IP가 `192.168.10.42`라면 두 entry가 모두 매치하지만, 더 긴(구체적인) prefix인 `/24`가 선택됩니다 → 인터페이스 B로 송출. 이 알고리즘 덕분에 "큰 범위의 디폴트 경로 + 작은 범위의 예외"라는 자연스러운 라우팅 규칙이 가능합니다.

**L2 재캡슐화**의 의미:

라우터를 통과할 때마다 L2 헤더는 새로 만들어집니다. 즉:
- 들어올 때: `[L2 헤더 A] [IP 헤더] [페이로드]`
- 나갈 때: `[L2 헤더 B] [IP 헤더] [페이로드]`

L2 헤더의 source MAC은 이전 라우터(또는 송신자)의 MAC, destination MAC은 다음 hop의 MAC. 그래서 IP 헤더의 source/destination IP는 끝까지 변하지 않지만, L2의 source/destination MAC은 매 hop마다 바뀝니다.

브라우저 개발자가 이 흐름을 간접적으로 보는 곳:
- `traceroute google.com`의 각 hop이 위 7단계를 거친 결과. 각 라우터의 처리 시간(보통 <1ms)이 누적되어 RTT의 일부가 됩니다.
- Wireshark로 LAN 캡처를 떠보면 같은 IP 패킷이 라우터 양쪽에서 다른 MAC을 갖고 있는 것을 볼 수 있습니다 — IP는 그대로지만 L2가 갈아 끼워졌다는 증거.

오개념 예방: "라우터가 IP를 바꾼다"는 잘못된 인식이 흔합니다. 일반적인 IP forwarding에서는 IP 헤더의 source/destination이 **변하지 않습니다**. 변하는 건 L2 헤더와 TTL(Time-To-Live, 매 hop마다 1씩 감소). NAT는 예외적으로 IP를 바꾸지만, NAT는 라우터의 부가 기능이지 기본 forwarding 동작이 아닙니다.

이게 없으면 어떻게 되는가:
- best match 알고리즘이 없다면 라우팅 테이블에 모든 호스트의 정확한 entry를 다 적어야 합니다 (50억 개). longest prefix match 덕분에 "이 prefix 범위는 저 인터페이스로"라는 한 줄로 수만 호스트를 한꺼번에 처리할 수 있습니다.
- L2 재캡슐화가 없다면 다른 매체(이더넷 ↔ Wi-Fi ↔ 시리얼) 사이로 패킷이 못 갑니다. 매 hop마다 새 매체에 맞춰 다시 포장하기 때문에 이종 매체로 구성된 인터넷이 가능합니다.

---

# 라우터는 전달한 패킷의 정보를 기억하는가?

> A router typically does not look into the packet payload, but only at the layer-3 addresses to make a forwarding decision, plus optionally other information in the header for hints on, for example, quality of service (QoS).
> For pure IP forwarding, a router is designed to minimize the state information associated with individual packets.
> Once a packet is forwarded, the router does not retain any historical information about the packet.

---

**도입**

라우터가 매일 수십억 개의 패킷을 처리하는데, 그 모든 패킷의 정보를 기억한다면 메모리가 즉시 폭발할 것입니다. 그래서 라우터는 의도적으로 **잊습니다** — 패킷을 전달한 그 순간 모든 기록을 버리고, 다음 패킷은 처음 본 것처럼 처리합니다. 이 stateless한 설계가 라우터가 초당 수백만 패킷을 처리할 수 있는 비결입니다.

---

**본문**

> A router typically does not look into the packet payload,

라우터는 일반적으로 패킷 페이로드를 들여다보지 않고,

- **typically**: "일반적으로". 예외(DPI 같은 특수 장비)는 있지만 표준 라우터의 기본 동작.
- **packet payload**: 패킷의 본문. HTTP 응답 데이터, 이미지 바이트 등 사용자 데이터. 라우터는 그 내용을 보지 않음.

> but only at the layer-3 addresses to make a forwarding decision,

오직 L3 주소만 보고 forwarding 결정을 내린다,

- **only at the layer-3 addresses**: L3 주소(IP)만 확인. payload나 L4(TCP·UDP) 정보는 일반적으로 안 봄.
- **forwarding decision**: 전달 결정. 어디로 보낼지.

> plus optionally other information in the header for hints on, for example, quality of service (QoS).

선택적으로 QoS(서비스 품질) 같은 힌트를 위해 헤더의 다른 정보도 본다.

- **optionally**: 선택적. 추가 기능을 켜둔 경우만.
- **quality of service (QoS)**: QoS 정책. 특정 트래픽(VoIP·영상 등)을 우선 처리하는 정책. ToS·DSCP 같은 IP 헤더 필드 또는 L4 포트를 추가로 볼 수 있음.

> For pure IP forwarding, a router is designed to minimize the state information associated with individual packets.

순수 IP forwarding에서, 라우터는 개별 패킷에 연관된 상태 정보를 최소화하도록 설계되어 있다.

- **pure IP forwarding**: 순수 IP 전달 — 부가 기능(NAT·방화벽 등) 없는 기본 동작.
- **minimize the state information**: 상태 정보를 **최소화**. 메모리·CPU를 아끼고 처리 속도를 높이기 위해.
- **associated with individual packets**: 개별 패킷과 연관된. 즉 "이 패킷에 대한 기록"을 거의 갖지 않음.

> Once a packet is forwarded, the router does not retain any historical information about the packet.

일단 패킷이 전달되면, 라우터는 그 패킷에 관한 어떤 과거 정보도 보유하지 않는다.

- **does not retain any historical information**: **어떤** 과거 정보도 안 가짐. 강한 부정. 전달 즉시 잊음.

---

**종합**

라우터의 stateless 설계를 한 표로:

| 구분 | 라우터가 보는가 | 라우터가 기억하는가 |
|---|---|---|
| L3 헤더 (IP 주소) | O — forwarding 결정에 핵심 | X — 결정 후 잊음 |
| L3 헤더 (TTL·ToS 등) | 부분적 (TTL 감소·QoS 시 ToS 확인) | X |
| L4 헤더 (TCP/UDP 포트) | 일반적으로 X (QoS·NAT·방화벽 시만) | X (NAT는 예외 — 매핑 유지) |
| 페이로드 | X | X |
| 패킷 자체의 이력 | — | X — 전달 즉시 폐기 |

stateless 설계가 만드는 효과:

- **속도**: 매 패킷을 처음 본 것처럼 처리하므로 이력 조회·갱신 부담이 없음. 초당 수백만 패킷 처리가 가능한 이유.
- **메모리 효율**: 패킷별 기록을 안 가지므로 메모리 사용이 라우팅 테이블 + ARP 캐시 등 고정 구조 정도로 제한됨.
- **단순성**: 같은 흐름의 패킷이 다른 경로를 거쳐도 무방함 (라우터마다 독립 결정).

브라우저 개발자가 이 stateless 동작의 결과를 보는 곳:
- 같은 TCP 연결 안의 두 패킷이 다른 라우터 경로를 거칠 수 있습니다 — 라우터가 흐름 단위로 관리하지 않기 때문. 그래서 ECMP(Equal-Cost Multi-Path) 같은 부하 분산이 가능.
- HTTPS 페이로드가 암호화되어 있어도 라우터는 신경 쓸 일이 없습니다 — 어차피 페이로드를 안 봅니다. 종단 간 암호화가 인터넷 라우팅과 충돌하지 않는 이유.

오개념 예방 — 라우터의 stateless가 절대적이지는 않습니다:
- **NAT**가 켜진 라우터는 사설 IP↔공인 IP:포트 매핑을 유지해야 하므로 stateful. 가정 공유기가 그 예.
- **방화벽 기능**이 켜진 라우터는 연결 추적(connection tracking)으로 stateful 동작.
- **QoS / DPI**(Deep Packet Inspection)도 stateful 요소를 추가.

순수 IP forwarding만 보면 stateless이고, 그 외 기능이 추가될수록 stateful해집니다. 인터넷 백본의 코어 라우터들은 가능한 한 stateless를 유지해야 처리 속도를 보장할 수 있습니다.

이게 없으면 어떻게 되는가: 라우터가 모든 패킷의 이력을 기억한다면 — 매일 수십조 패킷을 처리하는 ISP 라우터의 메모리는 즉시 폭발하고, 처리 속도도 패킷마다 이력 조회 비용이 들어 급격히 떨어집니다. stateless 설계 덕분에 라우터는 "패킷을 보고, 결정을 내리고, 잊는다"의 단순한 사이클로 어마어마한 throughput을 낼 수 있습니다. 흐름의 상태 관리는 종단(client·server)의 TCP가 책임지고, 라우터는 그 사이를 stateless로 빠르게 옮기는 역할 분담이 인터넷 아키텍처의 핵심입니다.

---

# 라우팅과 포워딩의 차이는?

> Routing is the process of selecting a path for traffic in a network.
> Forwarding is the relaying of packets from one network segment to another by nodes in a computer network.

---

**도입**

"라우팅"과 "포워딩"이 같은 의미로 혼용되는 경우가 많지만, 정확히는 다른 두 동작입니다 — 라우팅은 **계획**, 포워딩은 **실행**입니다. 지도를 보고 경로를 정하는 것과, 실제로 운전대를 돌려 그 길을 가는 것의 차이.

---

**본문**

> Routing is the process of selecting a path for traffic in a network.

라우팅은 네트워크의 트래픽을 위해 경로를 선택하는 과정이다.

- **selecting a path**: 경로를 **선택**하는 행위. 결정의 단계.
- **process**: "과정". 결과가 아니라 결정에 이르는 과정 자체. 이 과정의 결과로 라우팅 테이블이 만들어집니다.
- **for traffic in a network**: 네트워크의 트래픽을 위해. 미리 결정해두는 작업.

> Forwarding is the relaying of packets from one network segment to another by nodes in a computer network.

포워딩은 컴퓨터 네트워크의 노드들이 한 네트워크 세그먼트에서 다른 세그먼트로 패킷을 중계하는 것이다.

- **relaying of packets**: 패킷을 **중계**하는 행위. 실제 전달의 단계.
- **from one network segment to another**: 한 세그먼트에서 다른 세그먼트로. 입력 인터페이스에서 받은 패킷을 출력 인터페이스로 보냄.
- **by nodes**: 노드들에 의해. 라우터가 매 패킷마다 수행.

---

**종합**

두 동작을 한 표로 분리하면:

| | 라우팅 (Routing) | 포워딩 (Forwarding) |
|---|---|---|
| 본질 | 계획 — 경로 결정 | 실행 — 실제 전달 |
| 언제 | 미리 (또는 토폴로지 변화 시) | 매 패킷마다 |
| 결과물 | 라우팅 테이블 | 패킷이 다음 hop에 도착 |
| 사용 정보 | 라우팅 프로토콜 정보·정책 | 라우팅 테이블 + 패킷의 destination IP |
| 빈도 | 가끔 (수 초~수 분 간격) | 자주 (초당 수백만 번) |
| 라우터 내부 분류 | Control plane | Data plane |

User Annotation의 정리가 정확합니다 — "Routing은 패킷이 목적지까지 가는 최적 경로를 결정하는 과정이고, Forwarding은 라우터가 입력 포트에서 받은 패킷을 적절한 출력 포트로 실제로 이동시키는 동작."

라우터 내부의 분업으로 보면:
- **Control Plane (제어 평면)**: 라우팅을 담당. 라우팅 프로토콜(OSPF·BGP)과 협의해 라우팅 테이블을 만들고 갱신. CPU·메모리 부담을 지지만 빈도가 낮음.
- **Data Plane (데이터 평면)**: 포워딩을 담당. 만들어진 테이블을 보고 매 패킷을 빠르게 다음 hop으로 옮김. 하드웨어 가속(ASIC·TCAM) 사용.

이 분업 덕분에 라우터는 "천천히 학습하면서, 빠르게 전달"이라는 두 마리 토끼를 잡습니다. 라우팅 프로토콜의 새 정보가 와도 포워딩의 핫패스는 영향을 받지 않고, 포워딩이 폭주해도 라우팅 학습이 멈추지 않습니다.

브라우저 개발자가 이 차이를 간접적으로 보는 곳:
- 사무실 라우터의 회선이 한 개 끊겼을 때, 처음 몇 초간은 트래픽이 끊깁니다 (라우팅 프로토콜이 토폴로지 변화를 감지·재계산하는 시간 — 라우팅의 영역). 그 후 새 라우팅 테이블이 완성되면 트래픽이 우회 경로로 흐릅니다 (포워딩이 새 테이블을 보고 동작 — 포워딩의 영역).
- BGP 경로 변경이 일어나면 전 세계 라우터가 새 경로를 학습하기까지 몇 분이 걸리는데(라우팅 컨버전스), 그 동안에도 각 라우터의 포워딩은 이전 테이블 기준으로 계속 동작합니다.

오개념 예방 — "라우팅 = 라우터가 하는 모든 일"이라는 인식은 부정확합니다:
- 라우터의 일은 라우팅 + 포워딩 두 가지로 나뉘고, 둘은 다른 부품(plane)이 처리합니다.
- 일상 대화에서 두 단어가 혼용되지만 정확한 기술 토론에서는 분리해서 써야 합니다 — 특히 "라우팅 테이블"은 라우팅이 만들어낸 결과물이고, "포워딩 테이블(FIB)"은 그것을 핫패스용으로 가공한 사본이라는 점이 명확해집니다.

이게 없으면 어떻게 되는가:
- 라우팅 없이 포워딩만 한다면 — 라우팅 테이블이 비어 있으니 포워딩이 어디로 보낼지 결정 못 함. 모든 패킷이 폐기.
- 포워딩 없이 라우팅만 한다면 — 경로 계획만 있고 실제 전달이 없음. 사실상 라우팅 테이블만 있는 정적 문서.

두 동작이 분리되어 협력하기 때문에 라우터는 효율적으로 동작합니다. 라우팅이 한 번 결정한 결과를 포워딩이 수십억 패킷에 재사용하므로 결정 비용이 분산되고, 매 패킷의 전달은 단순 테이블 조회로 끝납니다.

---

# 라우터는 '다른 네트워크'의 경계를 어떻게 정의하는가?

> An IP address is recognized as consisting of two parts: the network prefix in the high-order bits and the remaining bits called the rest field, host identifier, or interface identifier (IPv6), used for host numbering within a network.
> The subnet mask or CIDR notation determines how the IP address is divided into network and host parts.

---

**도입**

라우터는 "다른 네트워크"라는 말을 어떻게 인식할까요? `192.168.0.10`과 `192.168.0.20`이 같은 네트워크고, `192.168.0.10`과 `203.0.113.42`가 다른 네트워크라는 판단의 근거는 어디에 있을까요? 답은 IP 주소 자체에 인코딩된 **네트워크 프리픽스**와 그것을 자르는 **서브넷 마스크**입니다.

---

**본문**

> An IP address is recognized as consisting of two parts:

IP 주소는 두 부분으로 구성된다고 인식된다.

- **two parts**: "두 부분". IP 주소가 단일 식별자가 아니라 두 영역의 합성이라는 점.

> the network prefix in the high-order bits

상위 비트의 네트워크 프리픽스와,

- **network prefix**: 네트워크를 식별하는 부분. 같은 prefix를 공유하는 IP들은 같은 네트워크.
- **high-order bits**: 상위 비트. 즉 IP의 앞부분. `192.168.0.10/24`에서 앞 24비트(`192.168.0`)가 prefix.

> and the remaining bits called the rest field, host identifier, or interface identifier (IPv6), used for host numbering within a network.

나머지 비트로 — rest field, host identifier, 또는 IPv6의 interface identifier라 불리며, 네트워크 안에서 호스트 번호 매기기에 사용된다.

- **remaining bits**: 나머지 비트. IP의 뒷부분. `192.168.0.10/24`에서 뒤 8비트(`10`)가 호스트 번호.
- **host numbering within a network**: 네트워크 안에서의 호스트 번호. 같은 네트워크의 여러 host가 이 부분으로 구분됨.

> The subnet mask or CIDR notation determines how the IP address is divided into network and host parts.

서브넷 마스크 또는 CIDR 표기법이 IP 주소가 네트워크 부분과 호스트 부분으로 어떻게 나뉘는지를 결정한다.

- **subnet mask**: 서브넷 마스크. `255.255.255.0` 같은 형태. 1인 비트는 prefix, 0인 비트는 host 부분.
- **CIDR notation**: CIDR 표기. `/24`, `/16` 같은 형태. 앞에서부터 몇 비트가 prefix인지를 명시.
- **divided into network and host parts**: 네트워크 부분과 호스트 부분으로 분할. 어디서 자르느냐가 마스크/CIDR이 결정.

---

**종합**

IP 주소의 두 부분 구조를 구체적인 예로:

| IP 주소 | CIDR | Subnet Mask | 네트워크 부분 | 호스트 부분 |
|---|---|---|---|---|
| 192.168.0.10 | /24 | 255.255.255.0 | 192.168.0 | 10 |
| 192.168.0.10 | /16 | 255.255.0.0 | 192.168 | 0.10 |
| 10.0.5.42 | /8 | 255.0.0.0 | 10 | 0.5.42 |
| 203.0.113.42 | /24 | 255.255.255.0 | 203.0.113 | 42 |

같은 IP라도 서브넷 마스크가 다르면 prefix 길이가 달라집니다 — `/24`면 256개 host, `/16`면 65,536개 host의 네트워크.

라우터의 "다른 네트워크" 판단 절차:

1. 들어온 패킷의 destination IP 추출.
2. 라우팅 테이블의 각 entry와 prefix 비교 (longest prefix match).
3. 매치된 entry의 prefix와 자기 인터페이스의 prefix를 비교.
4. 같은 prefix면 직접 연결 네트워크 (directly connected) — 그 인터페이스로 송출.
5. 다른 prefix면 다른 네트워크 — 다음 hop을 거쳐 라우팅.

브라우저 개발자가 이 구조를 일상에서 보는 곳:
- 자기 노트북이 `192.168.0.10/24`를 받았을 때, 같은 LAN의 동료 PC `192.168.0.20`은 같은 네트워크 (앞 24비트가 같음). `fetch()`로 동료 PC에 직접 보내면 라우터를 거치지 않고 LAN 안에서 처리됩니다.
- 외부 사이트 `203.0.113.42`로 보낼 때는 prefix가 다르므로 노트북이 "내 LAN 밖이네" 판단 → 디폴트 게이트웨이(공유기)로 보냄. 거기서부터 라우터들이 hop을 이어갑니다.
- 사무실 사내망에서 `git.company.local`이 같은 LAN 안에 있느냐 다른 부서망이냐는 IP의 prefix 차이로 결정됩니다 — 같은 사옥이라도 부서별로 다른 서브넷을 쓰면 라우팅이 필요.

AI Annotation의 정리가 정확합니다 — "같은 네트워크 프리픽스를 공유하는 장치들이 하나의 네트워크를 이룬다. 라우터는 목적지 IP의 네트워크 프리픽스를 라우팅 테이블과 대조하여, 자신의 직접 연결된 네트워크와 prefix가 다르면 '다른 네트워크'로 판단하고 적절한 다음 홉으로 포워딩한다."

오개념 예방 — "IP 앞 3바이트가 같으면 같은 네트워크"는 흔한 오해입니다:
- 그건 `/24` 마스크 가정에서만 맞습니다. `/16` 환경이면 앞 2바이트만 같아도 같은 네트워크.
- "같은 네트워크"의 판단은 항상 **마스크/CIDR과 함께** 이루어집니다 — IP만 보고는 알 수 없습니다.

또 하나의 헷갈림: 192.168.x.x 대역은 항상 사설망이라고 생각하는 경우가 많은데, 정확히는 RFC 1918에서 사설 용도로 예약된 세 영역(`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)만 그렇습니다. 그 외는 공인 IP일 수 있습니다.

이게 없으면 어떻게 되는가: prefix/host 분할이 없다면 라우터는 모든 호스트의 정확한 IP를 일일이 라우팅 테이블에 들고 있어야 합니다 — 50억 entry 테이블. prefix 단위 집계 덕분에 `192.168.0.0/24`라는 한 줄로 254개 host를 한꺼번에 처리할 수 있고, 인터넷 백본 라우터가 ~100만 prefix 정도로 전 세계 호스트를 라우팅할 수 있습니다. 이 계층적 구조가 인터넷 라우팅의 확장성을 만든 핵심입니다.
