# MAC 주소란 무엇인가?

> A MAC address is a unique identifier assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.
>
> MAC addresses are primarily assigned by device manufacturers, and are therefore often referred to as a physical address.

---

## 도입

호스트에 IP를 받는 건 부팅 시점이지만, MAC 주소는 그보다 훨씬 이전 — 공장에서 랜카드가 만들어질 때 이미 박혀 있습니다. 그래서 "물리 주소"라 부릅니다. IP가 "지금 이 네트워크 안에서 받은 주소"라면, MAC은 "랜카드 자체의 일련번호"에 가까운 개념입니다.

---

## 본문

> A MAC address is a unique identifier assigned to a network interface controller (NIC)

MAC 주소는 네트워크 인터페이스 컨트롤러(NIC)에 할당된 고유 식별자다.

- **unique identifier**: 고유 식별자. 이론상 전 세계에서 단 하나뿐인 번호. 제조사별 할당 영역(OUI)이 IEEE에서 관리됩니다.
- **network interface controller (NIC)**: 랜카드·Wi-Fi 모듈처럼 통신을 담당하는 하드웨어 모듈. host가 아니라 **이 모듈에** MAC이 붙는다는 점이 중요합니다. 한 노트북에 유선 LAN과 Wi-Fi가 따로 있으면 MAC도 두 개 — IP가 인터페이스마다 붙는 것과 같은 구조.

> for use as a network address in communications within a network segment.

같은 네트워크 세그먼트 내의 통신에서 네트워크 주소로 사용된다.

- **within a network segment**: 결정적인 한정 — **같은 네트워크 세그먼트 안에서만** 의미가 있습니다. 라우터를 넘어가는 순간 MAC 주소는 가려지고 다음 세그먼트의 MAC으로 갈아 끼워집니다.
- **network segment**: 라우터 같은 L3 장비로 나뉘지 않은 하나의 L2 영역. 같은 Wi-Fi에 붙은 장치들, 같은 사무실 LAN에 연결된 장치들이 한 세그먼트.

> MAC addresses are primarily assigned by device manufacturers,

MAC 주소는 주로 장치 제조사에 의해 할당된다.

- **assigned by device manufacturers**: IEEE에서 제조사에게 OUI(Organizationally Unique Identifier) 영역을 분배하고, 제조사가 그 안에서 칩마다 번호를 박습니다. 그래서 같은 회사가 만든 랜카드들의 앞 24비트는 같습니다.

> and are therefore often referred to as a physical address.

그래서 흔히 물리 주소라고 불린다.

- **physical address**: "물리적으로 박혀 있다"는 의미. 공장 출고 시점에 칩에 새겨지므로 사용자가 임의로 바꾸기 어렵고(MAC spoofing 같은 우회 기법은 별개), 네트워크 환경이 바뀌어도 변하지 않습니다.

---

## 종합

MAC 주소를 IP와 나란히 두면 차이가 또렷해집니다:

| | MAC 주소 | IP 주소 |
|---|---|---|
| 부여 시점 | 공장 출고 시 (제조사) | 네트워크 연결 시 (DHCP/관리자) |
| 어디 붙는가 | NIC(인터페이스 컨트롤러) | 인터페이스 |
| 유효 범위 | 같은 네트워크 세그먼트 내 | 인터넷 전역 라우팅 가능 |
| 별칭 | physical address | logical/network address |
| 형식 | 48bit, `00:1A:2B:3C:4D:5E` | IPv4 32bit, IPv6 128bit |

브라우저 개발자가 일상에서 MAC을 직접 다루는 일은 드뭅니다 — `fetch()` 호출은 IP/도메인까지만 신경 쓰니까. 다만 노트북의 `ipconfig /all` (Windows) 또는 `ifconfig` / `ip link` (macOS·Linux)를 실행하면 인터페이스마다 `Physical Address: 00-1A-2B-3C-4D-5E` 같은 형태로 MAC이 표시됩니다. 회사 사내망의 MAC 필터링, 카페 Wi-Fi 접속 후 "이 디바이스 차단" 같은 기능이 모두 이 MAC을 키로 동작합니다.

오개념 예방: "MAC이 전 세계에 유일하니까 인터넷에서 MAC만으로 통신하면 되지 않나?"는 흔한 헷갈림입니다. 답은 No — MAC은 위치 정보를 인코딩하지 않은 **flat addressing**이라, 라우터가 "이 MAC이 어느 네트워크에 있는지" 알 방법이 없습니다. (이 주제는 별도 질문 "MAC 주소가 전 세계적으로 고유한데 왜 IP가 필요한가"에서 다룹니다.)

이게 없으면 어떻게 되는가: 같은 LAN 안에 5대의 노트북이 붙어 있다면, 스위치는 "방금 들어온 프레임을 5대 중 정확히 누구에게 보낼지" 결정해야 합니다. 그 결정 기준이 MAC 주소입니다 — 이게 없으면 스위치는 매번 모든 포트로 뿌릴 수밖에 없고, 결국 옛날 허브와 같은 broadcast 환경이 됩니다. MAC은 "같은 세그먼트 안에서 정확히 한 사람을 지목"하는 데 쓰이는 핵심 도구.

---

## 도입

"네트워크 주소"라는 말은 문맥에 따라 두 가지 다른 것을 가리킬 수 있습니다. 넓게 보면 MAC 주소도 "네트워크에서 쓰이는 주소"라 네트워크 주소의 일종이지만, 좁게 구분할 때는 MAC을 **physical address(물리 주소)**, IP를 **network address(논리 주소)**라고 부릅니다. 같은 단어가 두 층위에서 쓰이니 문서를 읽을 때 "여기서 말하는 network address가 어느 층의 주소인가?"를 의식적으로 갈라봐야 합니다.

---

## 본문

엄밀한 구분은 OSI 계층 위계로 들어가면 자연스럽게 잡힙니다.

- **Physical address (물리 주소) = MAC 주소**: L2(데이터링크 계층)의 주소. 공장에서 NIC 칩에 박힌 고정 번호. "이 NIC이 누구냐"를 식별하지만, 그 NIC이 지금 지구 어디에 있는지는 주소만 봐서 알 수 없음 (flat addressing).
- **Network address (논리 주소) = IP 주소**: L3(네트워크 계층)의 주소. 네트워크가 호스트에 부여한 위치 정보. "이 인터페이스가 어느 네트워크에 속하는지"가 주소 안에 인코딩되어 있어 라우팅 가능 (hierarchical addressing).

"물리"와 "논리"라는 표현이 어디서 왔는지:
- **physical**: 하드웨어에 물리적으로 박혀 있어서. 사용자가 임의로 못 바꾸고, 네트워크 환경이 바뀌어도 변하지 않음 (MAC spoofing 같은 우회 기법은 별개).
- **logical / network**: 논리적으로 부여된 것. 네트워크에 붙는 시점에 부여되며, 환경이 바뀌면 (다른 LAN에 접속하면) 새 주소를 받음. 하드웨어가 아니라 네트워크의 규칙이 정함.

---

## 종합

두 주소를 한 표로:

| 구분 | Physical Address (MAC) | Network Address (IP) |
|---|---|---|
| OSI 계층 | L2 (Data Link) | L3 (Network) |
| 부여 주체 | 제조사 (공장 출고 시) | 네트워크 (DHCP 또는 관리자) |
| 변하는가 | 안 변함 | 환경에 따라 바뀜 |
| 위치 정보 | 없음 (flat) | 있음 (hierarchical) |
| 라우팅 가능 | 불가능 | 가능 |

브라우저 개발자 관점에서 흐름을 보면 두 주소가 실제로 어떻게 쌓여 있는지 한눈에 들어옵니다. 노트북에서 `ipconfig /all` (Windows) 또는 `ifconfig` (macOS·Linux)을 치면 인터페이스마다 두 줄이 함께 나옵니다 — `Physical Address: 00-1A-2B-...` 와 `IPv4 Address: 192.168.0.10`. 두 주소가 **같은 NIC에 동시에 붙어 있는** 것이 정상이고, 둘이 짝지어져 있어야 통신이 됩니다.

오개념 예방: "MAC = 네트워크 주소가 아니다"는 것은 좁은 의미의 구분입니다. 넓은 의미에서는 MAC도 "네트워크 안에서 쓰이는 주소"이니 network address의 한 형태로 분류됩니다. 책·문서마다 어떤 의미로 쓰는지 다르니 문맥을 보고 구분해야 합니다. 다만 시험·면접·교과서 정의에서는 좁은 의미(MAC=physical, IP=network)로 답하는 게 안전합니다.

이게 없으면 어떻게 되는가: 두 층위의 주소를 분리해두지 않았다면, 라우팅(어디로)과 식별(누구에게)이 한 주소로 묶여 둘 다 성능이 깨졌을 겁니다. 실제로 IP는 위치 정보를 담아 라우터가 prefix 단위로 효율적으로 처리하고, MAC은 같은 LAN 내의 정확한 NIC을 한 번에 지목하는 식으로 **계층별로 다른 알고리즘**을 쓸 수 있게 분리되어 있습니다. 이 분리가 인터넷 라우팅의 효율을 만든 설계 결정.

---

# IP 주소와 MAC 주소의 역할 차이는?

## 도입

같은 host에 IP와 MAC이 둘 다 붙어 있는 게 처음엔 어색합니다. "주소 하나면 충분하지 왜 둘이지?" 답은 두 주소가 하는 일이 다르기 때문 — IP는 **식별 + 위치 지정**이고, MAC은 **식별만** 합니다. 이 한 줄 차이가 인터넷 라우팅 전체의 골격을 만듭니다.

---

## 본문

> IP addresses serve two main functions: network interface identification, and location addressing.

IP 주소는 두 가지 주요 기능을 한다 — 네트워크 인터페이스 식별, 그리고 위치 지정.

- **two main functions**: "기능이 두 개"라고 못 박는 게 핵심. 한 가지가 아니라 두 가지를 동시에 합니다.
- **network interface identification**: 인터페이스를 **식별**. "이 인터페이스가 누구냐"를 가리킨다. 이건 MAC도 합니다.
- **location addressing**: 그 인터페이스가 **어디에 있는지** 알려줌. IP만의 특기 — 주소 자체에 위치 정보가 인코딩되어 있어 라우터가 "이 IP는 어느 네트워크 소속이다"를 읽어낼 수 있습니다. MAC에는 이게 없습니다.

---

## 종합

두 주소의 역할 차이를 정리하면:

| | IP 주소 | MAC 주소 |
|---|---|---|
| 역할 | 식별 + 위치 지정 | 식별만 |
| 범위 | 네트워크 간 라우팅 가능 (인터넷 전역) | 같은 네트워크 세그먼트 내에서만 유효 |
| 위치 정보 | 네트워크 프리픽스에 위치 인코딩 | 없음 (공장에서 부여된 고정 번호) |
| 비유 | 시→구→동→번지의 계층적 집 주소 | 주민등록번호 |

IP가 위치를 인코딩하는 방식은 **계층 주소(hierarchical addressing)** 입니다. IPv4 주소 `203.0.113.42`에서 앞쪽 비트들(예: `/24`로 잘리면 `203.0.113.0/24`)이 "어느 네트워크"를 나타내고 뒤쪽 비트가 "그 네트워크 안의 어느 host"를 나타냅니다. 라우터는 앞쪽만 보고 다음 hop을 결정합니다 — 마치 택배기사가 "서울특별시 강남구"까지 보고 다음 배송 지점을 정하는 것과 같습니다.

MAC은 이런 계층이 없습니다. `00:1A:2B:3C:4D:5E`라는 번호만 봐서는 이 NIC이 한국에 있는지 미국에 있는지 알 수 없습니다. 그저 "전 세계에 단 하나뿐인 번호"일 뿐. 그래서 MAC은 **flat addressing**이라 부릅니다.

브라우저 개발자 관점에서 흐름을 보면: `fetch('https://api.example.com/users')` 한 번이 실제로는
1. DNS로 `api.example.com` → IP(`203.0.113.42`)
2. 라우터들이 IP 앞부분만 보고 목적지 네트워크까지 전달 (location addressing)
3. 마지막 세그먼트에 도달하면 ARP로 IP → MAC 변환
4. 스위치가 MAC을 보고 정확한 포트로 프레임 전달 (identification)

식별만 필요했다면 MAC 하나로도 됐겠지만, 라우터가 "어느 네트워크로 보낼지" 결정하려면 위치 정보가 인코딩된 IP가 반드시 필요합니다.

오개념 예방: "MAC이 식별이고 IP가 라우팅"이라는 단순화는 절반만 맞습니다. IP도 식별을 합니다 — 다만 식별 + 위치 지정을 동시에 하는 것이고, MAC은 식별만 하는 것입니다. 두 주소가 모두 식별 기능을 갖고 있다는 점이 처음 헷갈리는 부분.

이게 없으면 어떻게 되는가: 만약 IP에 위치 정보가 없었다면 (즉 MAC처럼 flat이었다면), 라우터는 전 세계 모든 호스트의 주소를 라우팅 테이블에 들고 있어야 합니다. 50억 개 entry짜리 테이블을 매번 검색하는 건 비현실적이죠. 계층 주소 덕분에 라우터는 "203.0.113.0/24 네트워크는 저쪽 인터페이스로"라는 한 줄짜리 규칙으로 254개 host 전부를 한꺼번에 처리할 수 있습니다.

---

# 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.
>
> ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.

---

## 도입

이전 질문에서 "IP가 식별 + 위치 지정 둘 다 하니 MAC 없어도 되는 거 아닌가?"라는 의문이 나옵니다. 답은 아닙니다 — 라우팅(L3)과 실제 프레임 전달(L2)은 서로 다른 계층의 일이고, 마지막 한 홉을 누구에게 줄지는 MAC이 결정합니다. ARP는 바로 그 두 계층을 잇는 프로토콜입니다.

---

## 본문

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

ARP는 인터넷 계층 주소(보통 IPv4 주소)와 연결된 링크 계층 주소(예: MAC 주소)를 알아내기 위한 통신 프로토콜이다.

- **Address Resolution Protocol (ARP)**: 이름 그대로 "주소 해결 프로토콜". IP만 아는 상태에서 그에 대응하는 MAC을 찾아내는 절차.
- **link layer address**: OSI L2(데이터링크 계층)의 주소 — MAC 주소가 대표.
- **internet layer address**: OSI L3(네트워크 계층)의 주소 — IPv4·IPv6.
- **associated with**: 한 인터페이스에 IP와 MAC이 둘 다 붙어 있고, 둘은 짝지어져 있습니다. ARP는 그 짝을 찾아주는 도구.

> ARP enables a host to send, for example, an IPv4 packet to another node in the local network

ARP는 호스트가 로컬 네트워크의 다른 노드에게 IPv4 패킷을 보낼 수 있게 해준다.

- **another node in the local network**: 같은 LAN(같은 네트워크 세그먼트) 안의 다른 노드. ARP는 라우터 너머로는 안 갑니다 — 같은 세그먼트 안에서만 동작.
- **enables ... to send**: ARP가 없으면 송신 자체가 불가능. IP 패킷을 만들어도 그걸 어떤 MAC 프레임에 담아 보낼지 모르니 송출이 안 됨.

> by providing a protocol to get the MAC address associated with an IP address.

IP 주소와 연결된 MAC 주소를 얻는 프로토콜을 제공함으로써.

- **get the MAC address associated with an IP address**: IP → MAC 변환. 이게 ARP의 한 줄 요약.

---

## 종합

IP와 MAC은 다른 계층에서 다른 일을 합니다 — 그래서 둘 다 필요하고, 둘을 잇는 변환기로 ARP가 있습니다:

| 계층 | 주소 | 결정하는 것 |
|---|---|---|
| L3 (네트워크 계층) | IP 주소 | "어느 네트워크로 보낼지" — 라우터 사이의 라우팅 |
| L2 (데이터링크 계층) | MAC 주소 | "이 LAN 안의 어떤 포트로 보낼지" — 스위치의 프레임 전달 |
| 둘 사이 변환 | ARP | IP → MAC 매핑 |

IP만으로는 마지막 한 홉이 안 됩니다. 라우터가 "이 패킷은 192.168.0.0/24 네트워크로 가야 한다"까지는 IP만으로 결정할 수 있지만, 그 네트워크에 도착한 뒤 "이 패킷을 정확히 어느 PC의 랜카드로 줄지"는 결국 MAC 주소가 필요합니다. 그 매핑이 없는 상태에서 출발한다면 패킷이 LAN까지 와서도 갈 곳을 못 찾습니다.

브라우저 개발자가 `fetch('http://192.168.0.20:3000')`로 같은 LAN 안의 다른 PC에 요청을 보낸다고 합시다:
1. 노트북은 자기 ARP 캐시에서 `192.168.0.20`의 MAC을 찾습니다.
2. 캐시에 없으면 LAN 전체에 broadcast — "192.168.0.20 IP 가진 분?"
3. 해당 PC가 자기 MAC으로 unicast 응답.
4. 그 MAC을 목적지로 한 이더넷 프레임에 IP 패킷을 담아 송신.

윈도우·macOS·Linux 모두 `arp -a` 명령으로 현재 캐시된 IP↔MAC 매핑을 볼 수 있습니다. 같은 Wi-Fi에 붙은 동료 노트북, 프린터, 공유기의 MAC이 줄지어 나옵니다 — 평소엔 의식 안 하지만 이 캐시 덕분에 매번 broadcast하지 않아도 됩니다.

오개념 예방: "ARP는 인터넷 전체에서 MAC을 찾아주는 기능"이라는 인식은 틀립니다. ARP는 **단일 서브네트워크 내에서만** 동작하고, 라우터를 넘지 않습니다. 그래서 외부 사이트의 MAC은 우리가 알 수 없고, 알 필요도 없습니다 — 우리 패킷은 일단 게이트웨이(공유기)의 MAC을 목적지로 하고, 게이트웨이가 그 다음 단계를 처리합니다.

이게 없으면 어떻게 되는가: ARP가 없다면 IP만으로는 마지막 LAN 안에서 누구에게 줄지 결정할 수 없어 모든 통신이 끊깁니다. 또는 모든 장치가 모든 IP-MAC 매핑을 수동 설정해야 하는데(각 호스트마다 정적 ARP 테이블), 장치가 추가될 때마다 모든 host의 설정을 다 고쳐야 하는 악몽이 됩니다. ARP는 IP→MAC 자동 해결을 통해 그 부담을 없애줍니다.

---

# ARP(Address Resolution Protocol)란 무엇인가?

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.
>
> ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.
> The host broadcasts a request containing the target node's IP address, and the node with that IP address replies with its MAC address.
>
> It is communicated within the boundaries of a single subnetwork and is never routed.

---

## 도입

앞 질문 "IP가 있는데 왜 MAC이 필요한가?"의 답이 ARP였습니다. 이번엔 그 ARP의 동작 단계를 따라가봅니다 — 누가 무엇을 broadcast하고, 누가 어떻게 응답하며, 그 결과가 어디에 저장되는가. 같은 LAN 안에서만 동작하는 좁은 프로토콜이지만 모든 IP 통신의 마지막 단계가 여기에 의존합니다.

---

## 본문

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.

ARP는 인터넷 계층 주소(보통 IPv4)와 연결된 링크 계층 주소(예: MAC)를 알아내기 위한 통신 프로토콜이다.

- **discovering**: "찾아내다". 모르는 상태에서 시작해 알아내는 행위 — ARP의 핵심 동사.
- **link layer address / internet layer address**: L2 / L3 주소. 두 계층을 이어주는 다리가 ARP.

> ARP enables a host to send, for example, an IPv4 packet to another node in the local network

ARP는 호스트가 로컬 네트워크 안의 다른 노드에게 IPv4 패킷을 보낼 수 있게 해준다.

- **local network**: 같은 LAN, 같은 서브네트워크. ARP가 다루는 영역의 한계.

> by providing a protocol to get the MAC address associated with an IP address.

IP 주소에 연결된 MAC 주소를 얻는 프로토콜을 제공함으로써.

- **get the MAC address**: 얻는다 — 목적지 호스트가 자발적으로 알려주는 형태로.

> The host broadcasts a request containing the target node's IP address,

호스트는 대상 노드의 IP 주소를 담은 요청을 브로드캐스트한다.

- **broadcasts a request**: 같은 LAN 내 모든 노드에게 동시에 뿌립니다 — "192.168.0.20 IP 가진 분, 본인 MAC 알려주세요". 1대1이 아니라 1대 전체.
- **target node's IP address**: "내가 찾는 IP는 이거다"라는 정보를 요청에 포함. 받은 노드들은 자기 IP와 비교합니다.

> and the node with that IP address replies with its MAC address.

해당 IP 주소를 가진 노드가 자신의 MAC 주소로 응답한다.

- **the node with that IP address replies**: 자기 IP가 맞는 노드만 답합니다. 나머지 노드들은 그냥 무시.
- **replies with its MAC address**: 응답은 unicast — broadcast로 받았지만 답은 요청자에게만 직접 보냅니다.

> It is communicated within the boundaries of a single subnetwork and is never routed.

ARP는 단일 서브네트워크의 경계 내에서만 통신되며, 결코 라우팅되지 않는다.

- **within the boundaries of a single subnetwork**: 한 서브넷 안에서만. 라우터 너머로는 갈 수 없습니다.
- **never routed**: "절대" 라우팅되지 않음. 라우터는 ARP broadcast를 다른 네트워크로 전달하지 않도록 설계되어 있습니다 — 그래야 broadcast 폭발을 막을 수 있음.

---

## 종합

ARP의 동작을 한 사이클로 정리하면:

| 단계 | 누가 | 어떻게 | 누구에게 |
|---|---|---|---|
| 1. 요청 | 송신자 | broadcast | LAN 전체 |
| 2. 응답 | 해당 IP의 호스트 | unicast | 요청자에게만 |
| 3. 캐시 | 양쪽 | IP↔MAC 매핑 저장 | 자기 ARP 캐시에 |
| 4. 재사용 | 송신자 | 캐시 조회 | 일정 기간 broadcast 생략 |

캐시 덕분에 매 통신마다 broadcast하지 않습니다. Windows의 `arp -a`, Linux의 `ip neigh`, macOS의 `arp -a`로 자기 캐시를 직접 볼 수 있습니다 — 같은 Wi-Fi 안의 공유기·동료 노트북·프린터의 MAC이 줄지어 나오는데, 평소엔 의식하지 않고 자동으로 갱신됩니다.

브라우저 개발자가 같은 LAN 내 dev 서버(`http://192.168.0.20:3000`)로 `fetch()`를 보낸다고 합시다. Chrome은 IP까지만 알고, 그 IP의 MAC은 OS의 ARP 모듈이 처리합니다. 캐시가 있으면 즉시 송신, 없으면 broadcast 한 번 후 캐싱한 뒤 송신. 우리 코드는 이 단계를 전혀 의식하지 않지만 **이게 빠진 적이 단 한 번도 없는** 필수 절차입니다.

오개념 예방: "ARP가 인터넷 전체에서 MAC을 찾아준다"는 잘못된 상상입니다. ARP는 라우터를 넘지 못합니다 — 외부 서버의 MAC은 알 수 없고, 알 필요도 없습니다. 우리 노트북이 외부 사이트로 패킷을 보낼 때는 게이트웨이(공유기)의 MAC을 목적지로 하고, 그 뒤는 라우터 간 라우팅으로 넘어갑니다. 즉 ARP는 항상 "마지막 한 홉"의 문제를 푸는 도구.

이게 없으면 어떻게 되는가: ARP 없이 IP-MAC 매핑을 수동으로 관리하면 LAN에 새 장치가 추가될 때마다 모든 기존 장치의 ARP 테이블을 고쳐야 합니다. 노트북·스마트폰·프린터가 수십 대 붙는 사무실 LAN에서 이건 사실상 불가능. ARP의 자동 해결 덕분에 새 장치가 들어와도 다른 장치들이 자동으로 매핑을 학습합니다.

Official Annotation 보충: 응답을 받은 호스트는 해당 매핑을 캐시에 저장해두고, 같은 IP로 가는 다음 메시지부터는 캐시에서 바로 꺼내 씁니다. 이 캐시가 없다면 같은 호스트와의 모든 통신마다 broadcast가 반복되어 LAN이 ARP 트래픽으로 가득 찼을 것입니다.

```
                       [ARP 한 사이클]

  송신자 (192.168.0.10)            LAN 위의 다른 호스트들
        |                       +------+------+------+
        |                       | PC-A | PC-B | PC-C | ...
        |                       +------+------+------+
        |
        |  (1) ARP Request -- broadcast
        |      "192.168.0.20 IP 가진 분, MAC 알려주세요"
        +-------------------------> 모두에게 동시 도달
        |                            |      |      |
        |                          비교    비교    비교
        |                       내 IP 아님 -> 무시
        |                                    |
        |                          내 IP 맞음 (PC-B)
        |                                    |
        |  (2) ARP Reply -- unicast          |
        |      "내 MAC은 AA:BB:CC:DD:EE:FF"  |
        | <----------------------------------+
        |
        |  (3) 양쪽 ARP 캐시에 IP <-> MAC 매핑 저장
        |      +-------------------------+
        |      | 192.168.0.20  AA:BB:... |
        |      +-------------------------+
        |
        |  (4) 다음 통신부터는 캐시 조회로 즉시 송신
        |      (broadcast 생략, TTL 만료까지)
        v
```

---

# MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

## 도입

"MAC이 전 세계 유일하다면 그 MAC만 보고 어디로든 보낼 수 있어야 하는 거 아닌가?"는 자연스러운 질문입니다. 하지만 답은 No — **유일성과 위치 지정은 다른 문제**입니다. 주민등록번호가 전국에서 유일해도 그 번호만으로 그 사람 집을 찾아갈 수 없는 것과 같은 원리입니다.

---

## 본문

> An IP address serves two principal functions:

IP 주소는 두 가지 주요 기능을 한다.

- **two principal functions**: "두 가지"라고 못 박는 점. 식별 하나로 끝나지 않습니다.

> it identifies the host, or more specifically, its network interface,

호스트를(더 정확히는 그 네트워크 인터페이스를) 식별하고,

- **identifies**: 식별. "이 인터페이스가 누구냐"를 가리킨다 — 이건 MAC도 합니다.
- **more specifically, its network interface**: 한 host에 인터페이스가 여러 개면 IP도 여러 개. IP가 붙는 건 host가 아니라 인터페이스.

> and it provides the location of the host in the network,

네트워크 안에서 호스트의 위치를 제공하며,

- **provides the location**: **위치**를 제공한다는 게 IP만의 특기. MAC에는 이 능력이 없습니다.
- **in the network**: 네트워크 안의 위치 — 어느 서브넷에 속하는지가 IP 주소 자체에 인코딩되어 있습니다.

> and thus, the capability of establishing a path to that host.

따라서 그 호스트로 가는 경로를 수립할 능력을 제공한다.

- **establishing a path**: 경로 수립. 라우터가 "여기로 가려면 다음 hop은 저쪽이고, 그 다음은 또 저쪽"이라는 일련의 단계를 만들어낼 수 있게 됩니다.
- **thus**: 위치를 알기 때문에 경로를 만들 수 있다 — 인과관계가 명시됨. 위치 정보 없이는 경로 계산이 불가능.

---

## 종합

MAC과 IP의 본질적 차이는 주소 체계의 형식에 있습니다:

| | MAC 주소 | IP 주소 |
|---|---|---|
| 주소 체계 | flat addressing (평면) | hierarchical addressing (계층) |
| 위치 정보 | 없음 (제조사별 영역만) | 네트워크 프리픽스에 인코딩 |
| 경로 계산 | 불가능 | 가능 |
| 비유 | 주민등록번호 | 시→구→동→번지 집 주소 |

주민번호와 집 주소 비유가 가장 직관적입니다:
- 주민번호(MAC)는 5천만 명에서 유일하지만, 그 번호만 보고는 그 사람이 어디 사는지 알 수 없습니다 — 5천만 명 전부에게 "당신 번호 OOO입니까?" 물어봐야 합니다 (flat addressing의 한계).
- 집 주소(IP)는 "서울 → 강남구 → 역삼동 → 123-4번지"처럼 계층적이라, 우체부가 "강남구"까지만 보고 다음 배송지점을 결정할 수 있습니다 (hierarchical addressing의 효율).
- ARP는 "이 집(IP)에 사는 사람 주민번호(MAC) 뭐예요?"를 동네에 방송해 묻는 행위와 같습니다 — 동네(같은 LAN) 안에서만 통합니다.

브라우저 개발자가 `fetch('https://api.example.com/users')`를 호출했을 때 일어나는 일을 라우팅 관점에서 보면:
1. DNS가 도메인 → IP(`203.0.113.42`)로 변환
2. 노트북은 IP의 네트워크 프리픽스를 보고 "내 LAN 밖이네"라고 판단 → 게이트웨이로 보냄
3. 게이트웨이(공유기) → ISP 라우터 → 백본 라우터들이 IP의 앞부분(prefix)만 비교하며 다음 hop을 정함
4. 목적지 LAN 도착 후 마지막에 ARP로 MAC 변환

이 모든 hop마다 라우터들이 들고 있는 라우팅 테이블 entry가 prefix 단위라서 50억 호스트가 아니라 수십만 prefix 단위로 관리됩니다. 만약 MAC처럼 flat이었다면 라우터마다 50억 entry짜리 테이블이 필요했을 것이고, 그건 물리적으로 불가능합니다.

오개념 예방: "전 세계에서 유일하면 식별이 끝난 거 아닌가?"라는 직관에 빠지기 쉽지만, 통신은 식별만으로 안 됩니다 — **위치를 알아야 갈 수 있습니다**. MAC은 "이 사람이 누구다"는 알지만 "이 사람이 어디 있다"를 모르고, IP는 둘 다 합니다. 그래서 인터넷 라우팅은 IP가 담당하고 MAC은 마지막 한 홉의 인도 작업만 맡습니다.

이게 없으면 어떻게 되는가: 만약 IP 없이 MAC만으로 인터넷을 운영한다면, 모든 라우터가 전 세계 모든 NIC의 MAC을 들고 있어야 합니다. 새 장치가 출시될 때마다 그 MAC을 전 세계 라우터 테이블에 추가해야 하고, MAC 자체에 위치 정보가 없으니 어디로 보낼지 매번 brute force로 묻는 수밖에 없습니다. IP의 계층 주소는 이 모든 부담을 "prefix 단위 집계"로 해결합니다.

---

# 네트워크 내에서 호스트를 어떻게 식별하는가?

## 도입

호스트가 네트워크에 참여하면 적어도 하나의 네트워크 주소가 필요하다고 했습니다. 그 주소가 구체적으로 어떤 일을 하는지를 한 줄로 압축한 정의가 이 문장입니다 — **위치 파악(locate) + 신원 확인(identify)**. 두 동작이 동시에 가능해야 네트워크 장비가 "어디로, 누구에게 보낼지"를 결정할 수 있습니다.

---

## 본문

> Within a computer network, hosts are identified by network addresses,

컴퓨터 네트워크 내에서 호스트는 네트워크 주소로 식별된다.

- **identified by**: 네트워크 주소가 host의 신분증 역할. 같은 호스트가 IP·MAC을 둘 다 가질 수 있어 식별 수단이 복수일 수 있습니다.
- **network addresses**: 복수형. IP·MAC뿐 아니라 포트 번호·서비스 ID 등도 상황에 따라 식별 수단이 됩니다.

> which allow networking hardware to locate and identify hosts.

이를 통해 네트워킹 하드웨어가 호스트의 위치를 파악하고 식별할 수 있다.

- **networking hardware**: 라우터·스위치 같은 네트워크 인프라 장비. 이들이 주소를 보고 패킷을 어디로 보낼지 결정.
- **locate**: 위치 파악. "이 host가 어느 네트워크에 있는지". L3 라우터의 일.
- **identify**: 신원 확인. "이 LAN 안에서 정확히 누구인지". L2 스위치의 일.
- **두 동사가 함께 쓰인 것이 핵심**: locate(어디) + identify(누구)가 합쳐져야 정확한 전달이 가능합니다.

---

## 종합

같은 host에 여러 식별자가 동시에 붙는 이유는 각 식별자가 다른 계층의 다른 동작을 책임지기 때문입니다:

| 식별자 | 계층 | 담당 동작 | 사용 장비 |
|---|---|---|---|
| IP 주소 | L3 (Network) | locate — 어느 네트워크/위치 | 라우터 |
| MAC 주소 | L2 (Data Link) | identify — LAN 안의 정확한 NIC | 스위치 |
| 포트 번호 | L4 (Transport) | identify — 같은 host 안의 어느 프로세스 | OS의 TCP/UDP 스택 |
| 서비스 ID·세션 ID | L7 (Application) | identify — 어느 사용자/세션 | 애플리케이션 서버 |

브라우저 개발자가 `fetch('https://api.example.com:443/users')` 한 줄을 보낼 때 실제로 작동하는 식별자들:
1. **DNS** — `api.example.com` → IP(`203.0.113.42`) 변환
2. **IP 주소** (L3) — 라우터들이 prefix 보고 목적지 LAN까지 전달 (locate)
3. **MAC 주소** (L2) — 마지막 LAN의 스위치가 정확한 서버 NIC으로 프레임 전달 (identify)
4. **포트 443** (L4) — OS가 "이 패킷은 nginx 프로세스에게"라고 분기 (identify)
5. **세션 쿠키 / Authorization 헤더** (L7) — 백엔드가 "이 요청은 어느 사용자"라고 분기 (identify)

User Annotation 보충: IP·MAC만으로 식별이 끝나는 게 아닙니다. TCP 포트 번호, HTTP 세션 ID, OAuth 토큰의 sub claim 등 식별 수단은 계층마다 더 다양합니다. 핵심은 **각 계층이 자기 단위로 식별한다**는 것 — 라우터는 IP만, 스위치는 MAC만, OS는 포트만, 백엔드는 세션만 봅니다.

오개념 예방: "host 식별 = IP 주소"라는 단순화가 흔하지만 정확하지 않습니다. 같은 host에 IP가 여러 개일 수도 있고(다중 인터페이스), 같은 IP에 host가 여러 개일 수도 있고(NAT 뒤의 여러 PC가 한 공인 IP 공유), 같은 host의 다른 프로세스를 구분하려면 IP 외에 포트가 더 필요합니다. 이 모든 layered한 식별 체계가 함께 작동해야 비로소 "정확히 누구에게 보낼지"가 결정됩니다.

이게 없으면 어떻게 되는가: locate와 identify가 분리되어 있지 않다면(예: MAC만 사용), 라우팅 테이블이 폭발하거나 LAN 안의 모든 통신이 broadcast가 됩니다. 두 동작을 다른 식별자로 분리해뒀기 때문에 라우터는 "prefix 단위 집계"로, 스위치는 "MAC 단위 정확 매핑"으로 각자 가장 효율적인 알고리즘을 쓸 수 있습니다.

```
              [계층별 식별자 위계]

   +-----------------------------------------------+
   | L7  Application                               |
   |     세션 ID / OAuth 토큰 / Authorization      |
   |     "어느 사용자 / 어느 세션인가"             |
   +-----------------------------------------------+
                       ^
                       | 도착 후 더 좁은 식별
   +-----------------------------------------------+
   | L4  Transport                                 |
   |     포트 번호 (예: 443, 3000)                 |
   |     "host 안의 어느 프로세스인가"             |
   +-----------------------------------------------+
                       ^
   +-----------------------------------------------+
   | L3  Network                                   |
   |     IP 주소 (예: 203.0.113.42)                |
   |     locate -- "어느 네트워크 / 어디"          |
   +-----------------------------------------------+
                       ^
   +-----------------------------------------------+
   | L2  Data Link                                 |
   |     MAC 주소 (예: AA:BB:CC:DD:EE:FF)          |
   |     identify -- "LAN 안의 정확한 NIC"         |
   +-----------------------------------------------+

   각 계층이 자기 단위의 식별만 책임진다.
   라우터는 IP만, 스위치는 MAC만, OS는 포트만,
   백엔드는 세션만 본다.
```

---

# 도메인명은 어떻게 네트워크 주소로 변환되는가?

## 도입

브라우저 주소창에 `google.com`을 입력해도 정작 패킷에 실리는 건 IP 주소(`142.250.191.78` 같은 숫자)입니다. 그 사이에 누군가 이름을 숫자로 바꿔주는 단계가 있어야 하는데, 그 변환 경로가 두 가지입니다 — 로컬 파일을 보거나, DNS 서버에 묻거나.

---

## 본문

> Hostnames can be mapped to a network address

호스트명은 네트워크 주소로 매핑될 수 있다.

- **Hostnames**: 사람이 기억하기 쉬운 이름. `google.com`, `api.example.com` 같은 도메인명.
- **mapped to a network address**: 매핑된다 — 변환된다. 이름과 주소는 별개의 식별자이고, 둘을 잇는 매핑이 따로 관리됩니다.

> using a hosts file

hosts 파일을 사용하거나,

- **hosts file**: 컴퓨터 안에 있는 로컬 텍스트 파일. Windows는 `C:\Windows\System32\drivers\etc\hosts`, macOS·Linux는 `/etc/hosts`. "이 도메인은 이 IP다"라는 매핑을 줄 단위로 적어둔 평문 파일.

> or a name server such as Domain Name Service.

또는 DNS 같은 네임 서버를 사용한다.

- **name server**: 도메인-IP 매핑을 보관·응답하는 서버. 네트워크에 떠 있는 외부 서비스.
- **Domain Name Service (DNS)**: 가장 대표적인 네임 서버 시스템. 전 세계 분산 데이터베이스로 도메인-IP 매핑을 관리.

---

## 종합

브라우저가 도메인을 IP로 바꿀 때 거치는 순서는 일반적으로:

| 우선순위 | 위치 | 어떻게 동작하는가 |
|---|---|---|
| 1 | 브라우저 캐시 | 최근에 본 매핑은 메모리에 캐싱 |
| 2 | OS DNS 캐시 | 시스템 레벨 캐시 (`ipconfig /displaydns`) |
| 3 | hosts 파일 | 로컬 텍스트 파일에서 직접 찾기 |
| 4 | DNS 서버 | 위 모두 실패 시 외부 서버에 질의 |

`hosts` 파일이 우선되는 이유는 "로컬 우선" 원칙 때문입니다. 그래서 개발자들이 `127.0.0.1 mydev.local`을 hosts에 박아두면 브라우저가 그 도메인으로 갈 때 외부 DNS를 거치지 않고 곧장 자기 자신으로 갑니다 — 로컬 개발 서버에 도메인을 붙이는 가장 단순한 방법.

DNS는 그보다 훨씬 큰 분산 시스템입니다. 브라우저 개발자가 매일 마주치는 흐름:
1. Chrome 주소창에 `google.com` 입력
2. Chrome이 자기 캐시 → OS 캐시 → hosts 파일 순서로 확인
3. 모두 miss면 OS가 설정된 DNS 서버(보통 ISP DNS, 또는 1.1.1.1·8.8.8.8 같은 public DNS)에 UDP 53 포트로 질의
4. DNS 서버가 답을 주면(`142.250.191.78`) 그 IP로 TCP 443 핸드셰이크 시작

Chrome DevTools의 Network 탭에서 한 요청을 클릭하면 Timing 섹션에 "DNS Lookup" 항목이 보입니다. 이게 위 절차의 4번에 해당하는 시간 — 보통 캐시 hit이면 0ms, miss면 수십 ms.

오개념 예방: "DNS는 항상 외부 인터넷 서버에 묻는 것"이라는 인식은 부정확합니다. 회사 사내망은 자체 DNS 서버를 두고 `git.company.local` 같은 사내 도메인을 그쪽으로 보냅니다. 또 Docker·k8s 환경에서는 컨테이너 내장 DNS가 서비스 이름을 IP로 변환합니다 — DNS는 "어딘가의 네임 서버"이지 "외부 공개 서버"의 동의어가 아닙니다.

User Annotation의 "hosts 파일 → DNS Server" 순서가 정확합니다. 컴퓨터는 먼저 자기 자신(로컬)에게 묻고, 없으면 외부에 묻는다 — 이 우선순위 덕분에 hosts 파일이 디버깅·차단·로컬 도메인 매핑의 강력한 도구가 됩니다 (예: 광고 도메인을 `127.0.0.1`로 매핑해 차단).

이게 없으면 어떻게 되는가: 도메인-IP 매핑이 없다면 사용자가 매번 IP를 직접 외워야 합니다. `google.com` 대신 `142.250.191.78`을 입력해야 하는 인터넷은 사실상 작동 불가. 더 큰 문제는 IP는 변할 수 있다는 것 — 서버가 새 데이터센터로 이동하면 IP가 바뀌는데, 이름과 주소를 분리해뒀기 때문에 도메인은 그대로 두고 매핑만 바꾸면 됩니다. 이 분리(이름과 주소의 decoupling)가 인터넷 운영의 유연성의 핵심입니다.

```
        [도메인 -> IP 변환의 4단계 fallback]

   브라우저 주소창에 google.com 입력
              |
              v
   +------------------------+
   | (1) 브라우저 캐시      |  hit -> IP 반환, 끝
   |     (메모리, 짧은 TTL) |
   +------------------------+
              | miss
              v
   +------------------------+
   | (2) OS DNS 캐시        |  hit -> IP 반환, 끝
   |     (시스템 레벨)      |
   +------------------------+
              | miss
              v
   +------------------------+
   | (3) hosts 파일         |  match -> 그 IP 사용, 끝
   |     /etc/hosts         |  (로컬 우선 원칙)
   +------------------------+
              | no match
              v
   +------------------------+
   | (4) DNS 서버 질의      |  응답 -> IP 받아 캐시에 저장
   |     UDP 53 -> ISP DNS  |
   |     또는 8.8.8.8 등    |
   +------------------------+
              |
              v
       TCP/TLS 핸드셰이크 시작
```

---

# Static IP와 Dynamic IP의 차이는?

## 도입

같은 IP 할당이라도 두 가지 길이 있습니다. 노트북이 카페 Wi-Fi에 붙을 때마다 다른 IP를 받는 것과, 회사 웹서버가 5년째 같은 IP를 쓰는 것은 같은 시스템(IP)을 다른 방식으로 운용하고 있는 것입니다 — 그 차이를 결정하는 게 "동적이냐 고정이냐"입니다.

---

## 본문

> IP addresses are assigned to a host either dynamically as they join the network,

IP 주소는 호스트가 네트워크에 참여할 때 동적으로 할당되거나,

- **dynamically**: 동적으로. 미리 정해진 게 아니라 그 순간에 결정.
- **as they join the network**: 네트워크에 붙는 그 시점에. Wi-Fi에 연결되는 순간, 케이블을 꽂는 순간 — 그때 받음.

> or persistently by configuration of the host hardware or software.

호스트 하드웨어나 소프트웨어의 설정에 의해 영구적으로 할당된다.

- **persistently**: 영구적으로. 한 번 정해두면 계속 같은 값을 사용.
- **by configuration**: 누군가가 의도적으로 설정. 부팅마다 자동으로 받는 게 아니라 미리 박아둔 값을 그대로 사용.

> Persistent configuration is also known as using a static IP address.

영구적 설정은 정적(static) IP 주소를 사용하는 것이라고도 알려져 있다.

- **static**: 정적. 변하지 않음. "한 번 정해놓은 채로 유지".

> In contrast, when a computer's IP address is assigned each time it restarts, this is known as using a dynamic IP address.

반대로, 컴퓨터의 IP 주소가 재시작할 때마다 할당되는 경우 이를 동적(dynamic) IP 주소를 사용한다고 한다.

- **each time it restarts**: 재시작할 때마다. 즉 매번 새로 받을 가능성이 있음.
- **dynamic**: 동적. 매번 결정될 수 있음 — 같은 값이 다시 올 수도, 다른 값이 올 수도 있음.

---

## 종합

두 방식의 운영 차이를 한눈에 보면:

| | Static IP | Dynamic IP |
|---|---|---|
| 누가 정하는가 | 관리자가 수동 설정 | DHCP 서버 자동 분배 |
| 언제 정해지는가 | 한 번 박아두면 끝 | 매 부팅·재접속마다 |
| 변하는가 | 안 변함 | 바뀔 수 있음 |
| 관리 비용 | 높음 (수동) | 낮음 (자동) |
| 대표 사용처 | 웹서버, DB 서버, 프린터, 라우터 | 노트북, 스마트폰, 가정용 PC |

브라우저 개발자가 양쪽 다 일상적으로 마주칩니다:
- AWS EC2에 Elastic IP를 붙이거나 사내 dev 서버에 고정 IP를 박는 것 → static. DNS A 레코드가 가리키는 IP가 절대 바뀌면 안 되니까. `api.example.com → 203.0.113.42`가 하루 만에 바뀌면 도메인이 끊깁니다.
- 사무실 노트북이 케이블을 꽂자마자 IP를 받는 것 → dynamic. 사용자는 IP 설정 화면을 켤 일조차 없습니다.

Official Annotation의 보안 함의가 흥미롭습니다 — 가정 ISP가 보통 dynamic IP를 주는 이유는 두 가지입니다:
- 같은 사용자가 집에서 웹사이트를 운영하는 것을 방지 (상업용 서비스는 별도 비즈니스 회선으로 유도)
- 해커가 같은 IP를 반복 시도하기 어렵게 만듦 (IP가 주기적으로 바뀌니 표적 고정이 어려움)

오개념 예방: "Dynamic IP면 매번 다른 IP가 온다"는 일부분만 맞습니다. DHCP 서버는 보통 같은 MAC 주소에 같은 IP를 임대 기간(보통 24시간~7일) 동안 다시 줍니다. 그래서 사무실 노트북이 매일 같은 IP를 받기도 합니다. 다만 **보장**되지 않으므로 외부 의존 주소로는 부적합 — 이 차이가 dev/prod 서버에 static을 박는 이유.

이게 없으면 어떻게 되는가: 모든 IP가 dynamic이라면 DNS A 레코드가 매일 깨지고, SSL 인증서가 가리키는 IP가 흔들리며, 회사 서버에 접속하려면 매일 새 IP를 알아내야 합니다. 반대로 모든 IP가 static이라면 카페 Wi-Fi에 붙기 위해 사용자가 매번 게이트웨이·서브넷·DNS를 직접 입력해야 합니다. 두 방식의 공존이 인터넷 운영의 유연성을 만들어냅니다 — "변하면 안 되는 곳"은 static, "변해도 무방한 곳"은 dynamic.

---

# Unicast의 한계와, Broadcast/Multicast/Anycast는 각각 어떻게 다른가?

> Sending the same data to multiple unicast addresses requires the sender to send all the data many times over, once for each recipient.
>
> Broadcasting is an addressing technique available in IPv4 to address data to all possible destinations on a network in one transmission operation as an all-hosts broadcast.
>
> A multicast address is associated with a group of interested receivers.
> The sender sends a single datagram from its unicast address to the multicast group address, and the intermediary routers take care of making copies and sending them to all interested receivers (those that have joined the corresponding multicast group).
>
> Like broadcast and multicast, anycast is a one-to-many routing topology.
> However, the data stream is not transmitted to all receivers, just the one that the router decides is closest in the network.
> Anycast methods are useful for global load balancing and are commonly used in distributed DNS systems.

---

## 도입

브라우저가 평소 보내는 `fetch()`는 거의 다 unicast — 한 클라이언트가 한 서버에게 1대1로 보내는 것입니다. 그런데 같은 데이터를 100명에게 보내야 한다면? 100번 보내는 게 비효율적이라는 직관에서 출발해 broadcast·multicast·anycast가 등장합니다. 각각이 어떤 비효율을 어떻게 해결하는지가 이 질문의 핵심.

---

## 본문

> Sending the same data to multiple unicast addresses requires the sender to send all the data many times over, once for each recipient.

같은 데이터를 여러 unicast 주소로 보내려면 송신자가 모든 데이터를 여러 번, 수신자마다 한 번씩 보내야 한다.

- **multiple unicast addresses**: 1대1 통신을 여러 명에게 반복하는 형태.
- **many times over, once for each recipient**: 100명이면 100번 송신. 송신자 측 대역폭과 시간이 N배 든다는 점이 핵심 한계.

> Broadcasting is an addressing technique available in IPv4 to address data to all possible destinations on a network in one transmission operation as an all-hosts broadcast.

브로드캐스팅은 IPv4에서 사용 가능한 주소 지정 기법으로, 한 번의 송신 동작으로 네트워크상의 가능한 모든 목적지에 데이터를 보낸다(all-hosts broadcast).

- **all possible destinations on a network**: 같은 네트워크 안의 모든 host. 골라서 보내는 게 아니라 전체에게.
- **in one transmission operation**: 한 번의 송신으로 끝. unicast가 N번이라면 broadcast는 1번.
- **available in IPv4**: 중요 — IPv6에는 broadcast가 없습니다. IPv6는 그 자리를 multicast로 대체.

> A multicast address is associated with a group of interested receivers.

멀티캐스트 주소는 관심을 가진 수신자 그룹과 연결되어 있다.

- **a group of interested receivers**: "관심 있는 수신자 그룹". 자발적으로 그 그룹에 참여한 사람들 — broadcast처럼 모든 host가 아니라 가입자만 받습니다.

> The sender sends a single datagram from its unicast address to the multicast group address,

송신자는 자신의 unicast 주소에서 멀티캐스트 그룹 주소로 단일 datagram을 보내고,

- **single datagram**: 송신은 한 번. 그룹 주소로 보내면 됨.
- **multicast group address**: 그룹 전용 주소(예: `224.0.0.0/4` 대역). 그룹 자체가 받는 주소를 갖고 있고, 가입자들이 그 주소를 청취.

> and the intermediary routers take care of making copies and sending them to all interested receivers (those that have joined the corresponding multicast group).

그러면 중간 라우터들이 사본을 만들어 해당 멀티캐스트 그룹에 가입한 모든 관심 수신자에게 보내준다.

- **intermediary routers take care of making copies**: 라우터가 복사를 책임진다는 점이 결정적. 송신자는 1번만 보내고, 라우터가 분기점에서 복사. 송신자 측 대역폭이 절약됩니다.
- **those that have joined the corresponding multicast group**: 가입자만 받음. broadcast와 다른 점.

> Like broadcast and multicast, anycast is a one-to-many routing topology.

브로드캐스트·멀티캐스트와 마찬가지로 anycast는 1대 다 라우팅 토폴로지다.

- **one-to-many**: 한 송신자에서 여러 수신자로의 구조라는 점은 셋이 같음. 단, 실제 도달 패턴이 다릅니다.

> However, the data stream is not transmitted to all receivers, just the one that the router decides is closest in the network.

그러나 데이터 스트림은 모든 수신자에게 전송되는 것이 아니라, 라우터가 네트워크상에서 가장 가깝다고 판단한 한 곳으로만 전송된다.

- **just the one ... closest in the network**: 같은 anycast 주소를 여러 노드가 공유하지만, 송신자가 그 주소로 보내면 라우터가 가장 가까운 한 노드에게만 전달. "1대 다"라기보다는 "1대 N개 중 가장 가까운 1개".
- **closest**: 라우팅 메트릭(hop 수, latency 등) 기준으로 가장 가까운.

> Anycast methods are useful for global load balancing and are commonly used in distributed DNS systems.

anycast 방식은 글로벌 부하 분산에 유용하며, 분산 DNS 시스템에서 흔히 사용된다.

- **global load balancing**: 같은 anycast IP를 전 세계 데이터센터에 두면 사용자가 자연히 가장 가까운 곳으로 라우팅됩니다.
- **distributed DNS systems**: Cloudflare의 1.1.1.1, Google의 8.8.8.8이 대표 예. 같은 IP가 전 세계 수백 곳에 떠 있고, 사용자는 가장 가까운 인스턴스에 자동 연결.

---

## 종합

네 가지 송신 방식을 한 표로:

| 방식 | 대상 | 송신 횟수 | 대표 사례 | 프론트엔드 개발자 시점 |
|---|---|---|---|---|
| Unicast | 1:1 | N명이면 N번 | 일반 HTTP 요청 | 99%의 `fetch()` |
| Broadcast | 1:전체 (LAN 안) | 1번 (IPv4 only) | ARP 요청, DHCP discover | 평소 의식 안 함 |
| Multicast | 1:구독 그룹 | 1번 + 라우터 복사 | IPTV, 실시간 스트리밍, 일부 기업 영상회의 | 직접 다룰 일 적음 |
| Anycast | 1:가장 가까운 1곳 | 1번 | CDN, 1.1.1.1·8.8.8.8 DNS | CDN 사용 시 자동으로 받는 혜택 |

브라우저 개발자가 매일 받는 anycast의 혜택을 구체적으로 보면: `1.1.1.1` DNS 서버를 한국에서 호출하면 한국 인스턴스에, 미국에서 호출하면 미국 인스턴스에 도달합니다. 모두 같은 IP인데도 라우터가 알아서 가장 가까운 곳으로 보내줍니다. CDN의 엣지 서버도 비슷한 원리 — 같은 도메인 `cdn.example.com`이 사용자 위치에 따라 다른 엣지에 도달합니다 (DNS 기반 또는 anycast 기반 둘 다 사용).

multicast vs anycast 헷갈림 정리:
- multicast = 가입한 모든 사람이 받음 (1:N)
- anycast = 가장 가까운 한 사람만 받음 (1:1, 단 그 "한 사람"이 동적으로 결정)

오개념 예방: "broadcast = 인터넷 전체에 뿌리는 것"은 흔한 오해입니다. broadcast는 **LAN 한 세그먼트 안**으로만 갑니다 — 라우터를 넘지 않습니다. 만약 인터넷 전체에 broadcast가 가능했다면 단 한 명만 broadcast해도 전 세계 트래픽이 폭주할 것 (broadcast storm). 그래서 라우터는 broadcast 패킷을 의도적으로 차단하도록 설계되어 있습니다.

이게 없으면 어떻게 되는가: multicast가 없다면 IPTV 100만 가입자에게 같은 영상을 100만 번 unicast로 보내야 합니다 — 송신측 대역폭이 단순 곱셈으로 폭증. anycast가 없다면 CDN의 엣지 라우팅을 클라이언트 측 코드(GeoIP 기반)나 DNS 트릭으로만 해결해야 했을 것이고, 자동 페일오버도 어렵습니다. 네 가지 방식이 각각의 비용 구조를 해결하는 도구로 분리되어 있는 게 인터넷 효율의 핵심입니다.

---

# NAT(Network Address Translation)란 무엇이며, 사설 IP를 가진 장치가 인터넷과 통신할 수 있는 원리는?

> A common practice is to have a NAT device mask many devices in a private network.
> Only the public interfaces of the NAT device need to have an Internet-routable address.
>
> The NAT device maps different IP addresses on the private network to different TCP or UDP port numbers on the public network.
> In residential networks, NAT functions are usually implemented in a residential gateway.
> In this scenario, the computers connected to the router have private IP addresses, and the router has a public address on its external interface to communicate on the Internet.
> The internal computers appear to share one public IP address.

---

## 도입

집에서 노트북·스마트폰·태블릿이 모두 인터넷이 됩니다. 그런데 IPv4 주소는 약 43억 개뿐 — 전 세계 장치 수보다 훨씬 적습니다. 어떻게 모든 장치가 동시에 통신하고 있을까요? 답은 NAT — 사설 네트워크 안의 여러 장치가 단 하나의 공인 IP를 공유해 인터넷에 나가는 기술입니다. 가정 공유기가 매일 묵묵히 하는 그 일.

---

## 본문

> A common practice is to have a NAT device mask many devices in a private network.

흔한 관행은 NAT 장치가 사설 네트워크의 많은 장치를 가리는 것이다.

- **NAT device mask many devices**: NAT 장치가 여러 사설 장치를 외부에서 보이지 않게 가립니다. 외부 입장에서는 NAT 장치 하나만 보임.
- **private network**: 사설 네트워크. 내부에서만 쓰이는 IP(`192.168.x.x`, `10.x.x.x`, `172.16~31.x.x`)를 가진 네트워크. 인터넷 라우팅 대상이 아닙니다.

> Only the public interfaces of the NAT device need to have an Internet-routable address.

NAT 장치의 공인 인터페이스만 인터넷 라우팅 가능한 주소를 가질 필요가 있다.

- **public interfaces**: 외부(인터넷)를 향한 인터페이스. 가정 공유기에서 ISP 쪽 케이블이 꽂히는 그쪽.
- **Internet-routable address**: 인터넷 전역에서 라우팅 가능한 공인 IP. 사설 IP는 라우팅 안 됩니다 — 라우터들이 사설 IP 영역은 의도적으로 무시.
- **Only ... need to**: "이것만 있으면 충분"이라는 점이 핵심. 내부 장치 100대 모두에 공인 IP가 필요한 게 아니라 NAT 장치 1대만 있으면 됨.

> The NAT device maps different IP addresses on the private network to different TCP or UDP port numbers on the public network.

NAT 장치는 사설 네트워크의 서로 다른 IP 주소들을 공인 네트워크의 서로 다른 TCP/UDP 포트 번호에 매핑한다.

- **maps ... to ... port numbers**: NAT의 핵심 메커니즘. 내부 장치를 식별하는 수단이 IP가 아니라 **포트 번호**가 됩니다.
- **different IP addresses → different port numbers**: 사설 IP마다 다른 포트로 매핑. 즉 외부에서 보면 같은 공인 IP의 여러 포트가 사용 중이고, 각 포트가 내부의 한 장치에 대응.

> In residential networks, NAT functions are usually implemented in a residential gateway.

가정 네트워크에서 NAT 기능은 보통 가정용 게이트웨이에서 구현된다.

- **residential gateway**: 가정용 공유기. KT·SKT·LGU+가 설치해주는 그 박스.

> In this scenario, the computers connected to the router have private IP addresses, and the router has a public address on its external interface to communicate on the Internet.

이 시나리오에서 라우터에 연결된 컴퓨터들은 사설 IP를 가지며, 라우터는 외부 인터페이스에 인터넷 통신용 공인 주소를 갖는다.

- **private IP addresses**: 내부 장치들이 받는 주소(`192.168.0.10`, `192.168.0.11` 등). DHCP로 분배.
- **public address on its external interface**: 라우터의 외부 쪽에 ISP가 부여한 공인 IP 1개.

> The internal computers appear to share one public IP address.

내부 컴퓨터들은 하나의 공인 IP를 공유하는 것처럼 보인다.

- **appear to share**: 외부에서 그렇게 **보일 뿐**, 내부적으로는 각자 사설 IP를 갖고 있음. NAT가 만들어내는 환상.

---

## 종합

NAT의 매핑 메커니즘을 구체적인 예로 보면:

| 내부 (사설) | 매핑 | 외부 (공인) |
|---|---|---|
| 192.168.0.10:54321 (노트북, Chrome) | ↔ | 203.0.113.1:50001 |
| 192.168.0.11:54321 (스마트폰, 인스타그램) | ↔ | 203.0.113.1:50002 |
| 192.168.0.12:54321 (태블릿, YouTube) | ↔ | 203.0.113.1:50003 |

같은 공인 IP `203.0.113.1`이지만 포트가 다르기 때문에 NAT 장치는 외부에서 응답이 돌아왔을 때 어느 내부 장치에게 전달할지 알 수 있습니다. 포트 번호의 범위가 16비트(0~65535)라서 하나의 공인 IP로 이론상 수만 개의 동시 연결이 가능합니다.

브라우저 개발자 관점에서 NAT의 흔적을 발견하는 곳:
- 노트북에서 `ipconfig` (Windows) 하면 IP가 `192.168.x.x`. 그런데 `whatismyipaddress.com`에 접속하면 전혀 다른 공인 IP가 보입니다 — 그 공인 IP가 공유기의 외부 IP, 내부 IP는 가려진 채.
- WebRTC로 P2P 연결을 만들 때 STUN/TURN 서버가 필요한 이유 — NAT 뒤에 있는 두 클라이언트는 서로의 사설 IP만 알아서는 직접 연결을 못 합니다. STUN이 "공인 IP:포트가 무엇인지" 알려주고, 정 안 되면 TURN이 중계 서버 역할을 합니다.

오개념 예방: "NAT가 보안 기능"이라는 인식은 부분적으로만 맞습니다. NAT는 외부에서 내부 장치로의 직접 접근을 자연스럽게 차단하는 부수효과를 만들지만, 본질은 IPv4 주소 부족 해결책이지 방화벽이 아닙니다. 보안은 별도 방화벽이 담당해야 합니다.

NAT의 또 다른 영향: 같은 공인 IP를 여러 사용자가 공유하므로 IP 차단의 부작용이 큽니다 — 한 가정에서 어뷰징을 하면 그 가정 전체가 차단되는 식. 회사·학교 IP 한 개에 수백 명이 묶여 있어 사이트 차단 시 무관한 사람까지 영향을 받기도 합니다.

이게 없으면 어떻게 되는가: NAT가 없다면 모든 장치에 공인 IPv4 주소가 필요한데 IPv4는 43억 개뿐이라 절대 부족합니다. NAT가 사실상 IPv4의 수명을 수십 년 연장한 핵심 기술입니다. IPv6가 이 문제를 근본적으로 해결(주소 공간이 약 340 undecillion)하지만, IPv4 NAT가 없었다면 인터넷이 IPv6로 강제 전환되기 전에 주소 고갈로 멈췄을 것입니다.
