# MAC 주소란 무엇인가?

> A MAC address is a unique identifier assigned to a network interface controller (NIC) for use as a network address in communications within a network segment.
>
> MAC addresses are primarily assigned by device manufacturers, and are therefore often referred to as a physical address.

---

**도입**

호스트에 IP를 받는 건 부팅 시점이지만, MAC 주소는 그보다 훨씬 이전 — 공장에서 랜카드가 만들어질 때 이미 박혀 있습니다. 그래서 "물리 주소"라 부릅니다. IP가 "지금 이 네트워크 안에서 받은 주소"라면, MAC은 "랜카드 자체의 일련번호"에 가까운 개념입니다.

---

**본문**

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

**종합**

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
