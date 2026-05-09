# 네트워크 스위치란 무엇인가?

> A network switch is networking hardware that connects devices on a computer network by using packet switching to receive and forward data to the destination device.
>
> A network switch is a multiport network bridge that uses MAC addresses to forward data at the data link layer (layer 2) of the OSI model.
> Some switches can also forward data at the network layer (layer 3) by additionally incorporating routing functionality.
> Such switches are commonly known as layer-3 switches or multilayer switches.

---

## 도입

사무실 LAN 안에 노트북·프린터·서버가 여러 대 붙어 있다고 하면, 그 사이에서 "이 데이터는 정확히 누구에게 줄지" 결정해주는 장비가 필요합니다. 그 역할이 스위치 — 같은 LAN 안의 장치들을 연결하면서, 각 패킷을 정확한 한 포트로 보내주는 L2 장비입니다. 라우터가 네트워크 사이를 잇는다면 스위치는 한 네트워크 안의 장치들을 잇습니다.

---

## 본문

> A network switch is networking hardware that connects devices on a computer network

네트워크 스위치는 컴퓨터 네트워크상의 장치들을 연결하는 네트워킹 하드웨어다.

- **connects devices on a computer network**: 같은 네트워크 안의 장치를 묶는 장비. 라우터가 다른 네트워크 사이를 잇는 것과 대비됩니다.

> by using packet switching to receive and forward data to the destination device.

패킷 스위칭을 사용해 데이터를 받고 목적지 장치로 전달함으로써.

- **packet switching**: 데이터를 작은 패킷 단위로 쪼개 처리하는 방식. 통째로 한꺼번에가 아니라 패킷 단위로 받고 전달.
- **receive and forward**: 받은 다음 다른 포트로 보냄. 받기만 하지도 보내기만 하지도 않고 두 동작을 함께.
- **destination device**: 목적지 장치. 핵심은 "정확한 한 장치"에게만 보낸다는 점 — 모든 포트로 뿌리는 허브와의 결정적 차이.

> A network switch is a multiport network bridge that uses MAC addresses to forward data at the data link layer (layer 2) of the OSI model.

네트워크 스위치는 MAC 주소를 사용해 OSI 모델의 데이터링크 계층(L2)에서 데이터를 전달하는 멀티포트 브리지다.

- **multiport network bridge**: 다중 포트 브리지. 옛날 브리지(2포트)를 여러 포트로 확장한 것이 스위치 — 역사적 계보.
- **uses MAC addresses to forward**: 전달 결정을 **MAC 주소**로 함. IP가 아니라. 그래서 L2 장비.
- **data link layer (layer 2)**: OSI 7계층 중 L2. IP 라우팅(L3) 아래에서 동작하는 계층.

> Some switches can also forward data at the network layer (layer 3) by additionally incorporating routing functionality.

일부 스위치는 라우팅 기능을 추가로 통합하여 네트워크 계층(L3)에서도 데이터를 전달할 수 있다.

- **also forward data at the network layer (layer 3)**: L2뿐 아니라 L3에서도 동작 가능한 변종. IP 라우팅까지 한다는 뜻.
- **incorporating routing functionality**: 라우터 기능을 합쳐넣은 것. 즉 한 장비 안에 스위치 + 라우터 기능 동시에.

> Such switches are commonly known as layer-3 switches or multilayer switches.

이런 스위치는 흔히 L3 스위치 또는 멀티레이어 스위치라고 한다.

- **layer-3 switches / multilayer switches**: L3 스위치라는 별칭. 기업 네트워크 백본에서 자주 보임.

---

## 종합

스위치를 다른 네트워크 장비와 나란히 두고 보면 위치가 잡힙니다:

| 장비 | OSI 계층 | 식별 기준 | 동작 |
|---|---|---|---|
| 허브 | L1 (Physical) | 없음 | 받은 신호를 모든 포트로 그대로 전달 |
| 스위치 (L2) | L2 (Data Link) | MAC 주소 | 받은 프레임을 정확한 한 포트로만 전달 |
| 라우터 | L3 (Network) | IP 주소 | 다른 네트워크로 패킷을 라우팅 |
| L3 스위치 | L2 + L3 | MAC + IP | 같은 LAN 안 전달과 네트워크 간 라우팅 동시에 |

브라우저 개발자가 스위치를 직접 다룰 일은 거의 없지만, 매일 그 위에서 일합니다. 사무실 노트북에서 동료의 dev 서버(`http://192.168.0.20:3000`)로 `fetch()`를 보내면:
1. 노트북이 ARP로 `192.168.0.20`의 MAC을 알아냄
2. 해당 MAC을 목적지로 한 이더넷 프레임을 케이블에 송출
3. 사무실 스위치가 프레임의 목적지 MAC을 읽고 자기 MAC 테이블에서 어느 포트인지 조회
4. 그 한 포트로만 프레임을 내보냄 — 나머지 포트의 노트북·프린터에는 가지 않음

이 정확한 분기 덕분에 같은 LAN의 다른 장치가 이 트래픽을 보지 않고, 회선 대역폭도 효율적으로 분배됩니다 (자세한 collision domain은 별도 질문).

오개념 예방 — "허브와 스위치가 같다"는 흔한 헷갈림: 둘 다 LAN 장치를 연결하지만 동작이 완전히 다릅니다. 허브는 모든 포트로 신호를 그대로 뿌리는 단순 증폭기(L1)이고, 스위치는 MAC을 학습해 정확한 포트로만 보내는 지능형 장비(L2)입니다. 현대 사무실·가정에서 흔히 "허브"라 부르는 장비도 사실은 거의 다 스위치입니다 (자세한 비교는 별도 질문).

이게 없으면 어떻게 되는가: 스위치 없이 LAN을 운영하면 옛 허브 시대처럼 모든 트래픽이 모든 포트로 흩뿌려집니다. 100명이 같은 LAN에 붙으면 회선 대역폭이 100명에게 분산되고, 보안 측면에서도 한 사람의 트래픽을 다른 사람이 그대로 받습니다 (sniffing 위험). 스위치의 "정확한 포트로만 전달"이라는 동작이 LAN 효율과 기본 보안을 동시에 만들어줍니다.

---

# 네트워크 스위치와 허브의 차이는?

> Unlike repeater hubs, which broadcast the same data out of each port and let the devices pick out the data addressed to them, a network switch learns the Ethernet addresses of connected devices and then only forwards data to the port connected to the device to which it is addressed.

---

## 도입

20년 전 사무실에 흔하던 허브가 지금은 거의 사라진 이유는 단순합니다 — 허브는 LAN 안의 모든 장치에게 같은 데이터를 뿌렸고, 스위치는 정확히 한 명에게만 보냅니다. 이 한 가지 차이가 효율·보안·확장성 전반을 갈랐고, 그래서 시장이 통째로 스위치로 넘어갔습니다.

---

## 본문

> Unlike repeater hubs, which broadcast the same data out of each port

각 포트로 같은 데이터를 브로드캐스트하는 리피터 허브와 달리,

- **repeater hubs**: 리피터 허브. 받은 신호를 단순히 증폭해 모든 포트로 다시 내보내는 L1 장비. 신호의 의미를 해석하지 않습니다.
- **broadcast the same data out of each port**: 같은 데이터를 모든 포트로 동시에. 4포트 허브면 1번 포트에서 들어온 데이터가 2·3·4번 포트로 그대로 복사되어 나갑니다.

> and let the devices pick out the data addressed to them,

장치들이 자기에게 향한 데이터를 골라내도록 하는 것과 달리,

- **let the devices pick out**: 골라내는 부담을 **각 장치에게** 떠넘김. 허브는 "전부 다 보낼게, 자기 거 알아서 챙겨"라는 정책.
- **data addressed to them**: 자신에게 향한 데이터 — 즉 목적지 MAC이 자기 MAC인 프레임. 자기 것이 아니면 폐기.

> a network switch learns the Ethernet addresses of connected devices

네트워크 스위치는 연결된 장치들의 이더넷 주소를 학습하고

- **learns**: "학습한다". 자동으로. 사람이 손으로 입력하는 게 아니라 트래픽을 보면서 알아냄. 프레임의 source MAC과 들어온 포트를 짝지어 MAC 테이블에 저장.
- **Ethernet addresses**: 이더넷 주소 = MAC 주소.

> and then only forwards data to the port connected to the device to which it is addressed.

데이터가 향한 장치가 연결된 그 포트로만 데이터를 전달한다.

- **only forwards data to the port**: **그 포트로만** 보냄. 나머지 포트로는 보내지 않음 — 허브와의 결정적 차이.

---

## 종합

두 장비의 동작을 한 표로 정리하면:

| | Hub | Switch |
|---|---|---|
| OSI 계층 | L1 (Physical) | L2 (Data Link) |
| 동작 | 신호 단순 복제 | 프레임을 해석해 정확한 포트로 전달 |
| 데이터 분기 | 모든 포트 (broadcast) | 목적지 포트 1개만 (unicast forwarding) |
| MAC 학습 | 안 함 | 자동 학습 |
| 보안 | 약함 (모든 트래픽이 모두에게 노출) | 강함 (다른 포트로 안 흘러감) |
| 효율 | 회선이 모두에게 분산 | 포트 간 독립 — 동시 송수신 가능 |

브라우저 개발자가 보안 측면에서 이 차이를 느끼는 사례:
- 허브 시대에는 같은 LAN의 누군가가 와이어샤크를 켜면 다른 사람의 HTTP 평문 트래픽이 그대로 보였습니다 (그래서 HTTPS의 필요성이 강조된 배경 중 하나).
- 스위치 시대에는 자기 포트로 향하지 않은 프레임은 받지 못해, 같은 LAN 내 sniffing이 어려워졌습니다 (단, ARP spoofing 같은 우회 기법은 별개).

스위치의 "학습" 동작을 더 풀어보면:
1. 처음 켜졌을 때 MAC 테이블이 비어 있음
2. PC A가 PC B로 프레임을 보내면, 스위치는 source MAC(A) ↔ 들어온 포트를 테이블에 기록
3. 목적지 MAC(B)을 테이블에서 찾으려 하지만 없으므로 모든 포트로 한 번 뿌림 (flooding)
4. PC B가 응답하면 그제야 B의 MAC ↔ B 포트가 테이블에 학습됨
5. 이후엔 A↔B 통신이 두 포트 사이로만 흐름

오개념 예방: "스위치가 broadcast를 절대 안 한다"는 부정확합니다 — MAC 테이블 miss 상황(처음 보는 MAC)이나 ARP 같은 broadcast 프레임은 모든 포트로 뿌립니다. 다만 학습된 unicast 프레임은 정확히 한 포트로만 갑니다. 이 점이 collision domain과 broadcast domain을 가르는 결정적 차이가 됩니다 (별도 질문에서 다룸).

이게 없으면 어떻게 되는가 — 허브 시대로 돌아간다면: 회사 LAN 100명이 같은 허브에 붙어 있을 때 한 명이 큰 파일 다운로드를 하면 나머지 99명의 회선이 그 트래픽으로 깎입니다. 또 모든 사람이 모든 트래픽을 받기 때문에 ARP·ping·broadcast 폭주 시 LAN 전체가 마비될 수 있습니다. 스위치의 "MAC 학습 + 포트별 분기"가 이 두 문제를 동시에 해결했습니다 — 그래서 1990년대 후반부터 허브가 시장에서 사실상 퇴출됐습니다.

```
              [스위치 MAC 학습 사이클]

   초기 상태: MAC 테이블 비어 있음
   +-----------------+
   | MAC | Port      |
   +-----------------+
   | (empty)         |
   +-----------------+

   [1] PC-A (포트 1) -> PC-B (포트 3) 프레임 송신
        src=A, dst=B

        스위치가 src MAC(A) 학습:
        +-----------------+
        | A   | 1         |
        +-----------------+

        dst(B) 조회 -> miss
        -> flooding (포트 2,3,4 모두로 송출)

   [2] PC-B 응답: src=B, dst=A
        스위치가 src MAC(B) 학습:
        +-----------------+
        | A   | 1         |
        | B   | 3         |
        +-----------------+

        dst(A) 조회 -> hit (포트 1)
        -> 포트 1로만 송출 (unicast)

   [3] 이후 A <-> B 트래픽
        양쪽 모두 테이블에 있으므로
        -> 포트 1과 3 사이로만 흐름
        다른 포트(2, 4)에는 영향 없음

   주의: broadcast 프레임(예: ARP)이나 미학습 dst는
        여전히 모든 포트로 flooding 된다.
```

---

# 스위치가 collision domain은 분리하지만 broadcast domain은 분리하지 못하는 이유는?

> An Ethernet switch operates at the data link layer (layer 2) of the OSI model to create a separate collision domain for each switch port.
> Each device connected to a switch port can transfer data to any of the other ports at any time and the transmissions will not interfere.
> Because broadcasts are still being forwarded to all connected devices by the switch, the newly formed network segment continues to be a broadcast domain.

---

## 도입

스위치 한 대를 꽂으면 LAN 안의 충돌(collision)이 사라집니다. 그런데 같은 스위치에 붙은 장치들은 여전히 broadcast(예: ARP)를 함께 받습니다 — 일부는 분리됐는데 일부는 안 됐다는 게 이 질문의 핵심입니다. 두 "domain"이 다른 개념이기 때문에 스위치의 영향이 다르게 나타납니다.

---

## 본문

> An Ethernet switch operates at the data link layer (layer 2) of the OSI model

이더넷 스위치는 OSI 모델의 데이터링크 계층(L2)에서 동작하여

- **operates at the data link layer (layer 2)**: 동작 계층이 L2. MAC 주소 단위로 동작.

> to create a separate collision domain for each switch port.

각 스위치 포트마다 별도의 충돌 도메인을 만든다.

- **separate collision domain**: 별도의 충돌 도메인. **포트마다** 따로따로.
- **for each switch port**: "각 포트마다". 4포트 스위치면 collision domain이 4개. 허브는 모든 포트가 1개의 collision domain.
- **collision domain**: 충돌 도메인 — 동시에 두 장치가 송신하면 충돌이 일어날 수 있는 영역. 옛 허브 환경에서 한 LAN이 통째로 한 collision domain이었음.

> Each device connected to a switch port can transfer data to any of the other ports at any time and the transmissions will not interfere.

스위치 포트에 연결된 각 장치는 언제든지 다른 어느 포트로든 데이터를 전송할 수 있고, 그 전송들은 서로 간섭하지 않는다.

- **at any time**: 언제든. 다른 장치가 송신 중이어도 자기 포트는 자유. 동시 송신이 가능.
- **transmissions will not interfere**: 전송이 서로 간섭하지 않음. 포트마다 독립된 회선이 있어서 충돌이 일어날 수 없음.

> Because broadcasts are still being forwarded to all connected devices by the switch,

브로드캐스트는 여전히 스위치에 의해 연결된 모든 장치로 전달되기 때문에,

- **still**: "여전히" — 스위치를 도입했음에도 변하지 않은 동작이 있다는 뉘앙스. unicast는 분리됐지만 broadcast는 그대로.
- **being forwarded to all connected devices**: 모든 연결 장치에게 전달. 스위치 설계상 broadcast 프레임(예: ARP)은 모든 포트로 뿌려야 그 의도가 달성됨.

> the newly formed network segment continues to be a broadcast domain.

새로 형성된 네트워크 세그먼트는 여전히 하나의 브로드캐스트 도메인으로 남는다.

- **continues to be a broadcast domain**: broadcast domain은 분리되지 않음. 같은 스위치에 붙은 장치들이 한 broadcast domain.

---

## 종합

두 "도메인"의 차이를 분명히 정리하면:

| 도메인 | 의미 | 스위치가 분리하는가? |
|---|---|---|
| Collision domain | 동시 송신 시 충돌 가능 영역 | O — 포트마다 별도 |
| Broadcast domain | broadcast 프레임이 도달하는 영역 | X — 같은 스위치는 1개 |

왜 이 비대칭이 생기는가:
- **Collision은 unicast 흐름의 문제**입니다. 스위치는 unicast 프레임을 정확한 한 포트로만 보내기 때문에, 두 unicast가 같은 회선에서 부딪힐 일이 없습니다 → collision domain 분리.
- **Broadcast는 의도적으로 모든 장치에게 가야 하는 프레임**입니다 (예: ARP는 "이 IP 가진 분?" 하고 LAN 전체에 묻는 게 본질). 스위치가 broadcast를 한 포트로만 보낸다면 broadcast의 의미가 사라집니다 → broadcast domain은 분리되지 않음.

브라우저 개발자가 이 비대칭을 체감하는 곳:
- 같은 LAN 안에 100대가 붙어 있어도 두 장치 간 unicast 통신은 다른 장치에 영향을 주지 않음 (collision domain 분리 덕). 회선이 깎이지 않습니다.
- 그러나 한 장치가 ARP broadcast를 보내면 100대 모두가 그 프레임을 받아 처리해야 함 (broadcast domain 분리 안 됨). LAN에 너무 많은 장치가 붙으면 broadcast 트래픽만으로 모든 장치의 NIC·CPU가 일정 부담을 지게 됩니다.

이 한계 때문에 큰 LAN은 라우터(L3)나 VLAN(가상 LAN)으로 broadcast domain을 다시 잘라줍니다:
- 라우터는 broadcast를 다음 네트워크로 전달하지 않으므로 broadcast domain의 자연스러운 경계.
- VLAN은 같은 스위치를 논리적으로 여러 broadcast domain으로 분할 — 한 스위치 안에서도 broadcast 격리 가능.

오개념 예방: "스위치가 LAN을 완전히 분리한다"는 부분만 맞습니다. unicast 트래픽은 분리되지만 broadcast는 그대로 LAN 전체로 퍼집니다. 그래서 broadcast 트래픽이 많은 환경에서는 스위치만으론 부족하고 VLAN·라우터로 추가 분할이 필요해집니다.

이게 없으면 어떻게 되는가:
- collision domain이 분리되지 않으면(허브 시대) 같은 LAN의 100명이 같은 회선을 나눠 써서 한 명이 큰 파일을 받기 시작하면 다른 99명의 속도가 떨어집니다.
- broadcast domain이 어떤 식으로든 분리되지 않으면 큰 LAN에서 broadcast storm 한 번에 모든 장치의 CPU가 마비됩니다. 스위치의 collision 분리 + 라우터/VLAN의 broadcast 분리가 합쳐져야 비로소 큰 LAN이 효율적으로 운영됩니다.

---

# 라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라

> A forwarding information base (FIB), also known as a forwarding table or MAC (address) table, is most commonly used in network bridging, routing, and similar functions to find the proper output network interface controller to which the input interface should forward a packet.
>
> FIBs are optimized for fast lookup of destination addresses and can improve performance of forwarding compared to using the routing information base (RIB) directly.
> The RIB is optimized for efficient updating by routing protocols and other control plane methods, and contain the full set of routes learned by the router.

---

## 도입

라우터와 스위치 모두 "들어온 트래픽을 어느 포트로 내보낼지" 결정하는 표를 들고 있습니다. 그런데 두 표는 같은 일을 하면서도 구조가 다릅니다 — 라우터의 라우팅 테이블은 "학습용 vs 빠른 조회용"으로 두 단계가 있고, 스위치의 MAC 테이블은 그 자체로 빠른 조회용입니다. 이 차이는 트래픽 유형과 학습 방식에서 옵니다.

---

## 본문

> A forwarding information base (FIB), also known as a forwarding table or MAC (address) table, is most commonly used in network bridging, routing, and similar functions

포워딩 정보 베이스(FIB) — 포워딩 테이블 또는 MAC(주소) 테이블이라고도 불림 — 는 네트워크 브리징, 라우팅, 유사 기능에서 가장 흔히 사용된다.

- **forwarding information base (FIB)**: 포워딩 정보 베이스 — 패킷을 어느 인터페이스로 내보낼지 빠르게 결정하기 위한 테이블.
- **forwarding table or MAC (address) table**: 포워딩 테이블 또는 MAC 테이블이라고도 부름. 같은 개념의 다른 이름들. 스위치 입장에선 "MAC 테이블", 라우터 입장에선 "FIB"가 더 흔한 표현.
- **bridging, routing, and similar functions**: 브리징(L2)이든 라우팅(L3)이든 모두 FIB를 사용한다는 점.

> to find the proper output network interface controller to which the input interface should forward a packet.

입력 인터페이스가 패킷을 전달해야 할 적절한 출력 NIC을 찾기 위해.

- **proper output ... NIC**: 들어온 패킷을 내보낼 정확한 출력 인터페이스. FIB의 한 줄 핵심 기능.

> FIBs are optimized for fast lookup of destination addresses

FIB는 목적지 주소의 빠른 조회를 위해 최적화되어 있고,

- **optimized for fast lookup**: 빠른 조회를 위한 최적화. 패킷마다 호출되는 핫패스이므로 속도가 결정적. 하드웨어 가속(TCAM 같은 특수 메모리) 사용.

> and can improve performance of forwarding compared to using the routing information base (RIB) directly.

RIB(라우팅 정보 베이스)를 직접 사용하는 것에 비해 포워딩 성능을 향상시킬 수 있다.

- **routing information base (RIB)**: 라우팅 정보 베이스. 라우터가 라우팅 프로토콜로 학습한 **모든** 경로 정보의 원본.
- **directly**: RIB를 그대로 쓰는 것보다 FIB로 복제해 쓰는 게 빠름. RIB → FIB로 가공된 사본을 쓰는 구조.

> The RIB is optimized for efficient updating by routing protocols and other control plane methods,

RIB는 라우팅 프로토콜과 기타 control plane 메서드에 의한 효율적 갱신을 위해 최적화되어 있고,

- **efficient updating**: 효율적 갱신을 위한 최적화. RIB의 우선순위는 "조회 속도"가 아니라 "갱신 용이성".
- **routing protocols**: OSPF·BGP 같은 라우팅 프로토콜. 이들이 학습한 경로가 RIB에 들어옴.
- **control plane**: 제어 평면. 라우터의 "결정 회로" 영역. 패킷을 직접 옮기는 data plane과 분리.

> and contain the full set of routes learned by the router.

라우터가 학습한 모든 경로 집합을 포함한다.

- **full set of routes**: 모든 경로의 풀셋. 그중 실제 사용할 베스트 경로만 골라 FIB로 보냅니다 — RIB는 "백과사전", FIB는 "치트시트".

---

## 종합

라우터와 스위치의 표 구조를 한눈에 보면:

| | 라우터 | 스위치 |
|---|---|---|
| 동작 계층 | L3 (IP) | L2 (MAC) |
| 매핑 | 목적지 IP/prefix → 다음 hop·출력 인터페이스 | MAC 주소 → 포트 |
| 학습 방식 | 라우팅 프로토콜(OSPF·BGP)·정적 설정 | source MAC을 관찰해 자동 학습 |
| RIB / FIB 분리 | 있음 — RIB는 학습용·갱신용, FIB는 조회용 | 없음 — 테이블 자체가 곧 FIB |
| 갱신 빈도 | 비교적 느림 (수 초~수 분 단위) | 빠름 (프레임마다 학습 가능) |

왜 라우터는 RIB와 FIB를 분리하고 스위치는 안 하는가:
- 라우터의 경로 정보는 BGP로 전 세계 100만 개 이상의 prefix를 들고 있을 수 있습니다. 그중 실제 패킷 전달에 쓰이는 베스트 경로는 일부이고, 핫패스(패킷 전송)에서는 그 일부만 빠르게 조회하면 됩니다 → RIB(전체) ↔ FIB(요약) 분리.
- 스위치의 MAC 테이블은 보통 수천~수만 entry로, 학습 자체가 단순합니다(들어온 프레임의 source MAC ↔ 입력 포트). 학습과 조회를 한 테이블에서 처리해도 부담이 작습니다 → 분리 불필요.

브라우저 개발자가 이 두 표의 흔적을 보는 곳은 거의 없지만, 결과로 매일 받습니다:
- `traceroute` 또는 `tracert google.com`을 실행하면 패킷이 거치는 라우터들의 IP가 줄지어 나옵니다 — 각 라우터가 자기 FIB를 보고 다음 hop을 결정한 결과.
- 회사 LAN에서 dev 서버로 `fetch()`를 보낼 때, 사무실 스위치의 MAC 테이블이 정확한 포트를 짚어주기 때문에 다른 동료의 NIC에 트래픽이 흩뿌려지지 않습니다.

학습 방식의 차이도 결정적입니다:
- **라우터**: 라우팅 프로토콜(OSPF·BGP) 또는 관리자가 정적으로 박은 경로. 즉 협의 또는 의도적 설정.
- **스위치**: 들어오는 프레임의 source MAC만 보고 자동 학습. 사람의 개입 없이 동작.

오개념 예방: "MAC 테이블 = 라우팅 테이블의 L2 버전"이라는 단순화는 부분만 맞습니다. 둘 다 FIB의 일종이지만, 스위치 MAC 테이블은 자기가 직접 학습한 정보로 채우고, 라우터 라우팅 테이블은 별도 RIB가 가공한 결과를 받아옵니다. 즉 "스위치 = MAC을 들으며 학습", "라우터 = 다른 라우터들과 협의해 학습"이라는 학습 방식의 차이가 핵심.

이게 없으면 어떻게 되는가: FIB가 RIB와 분리되지 않으면 라우터는 BGP 변경이 일어날 때마다 전체 테이블을 다시 가공해야 해 패킷 전송이 지연됩니다. RIB/FIB 분리 덕분에 control plane은 천천히 학습하고, data plane은 핫패스에서 빠르게 조회하는 분업이 가능해집니다 — 라우터가 초당 수백만 패킷을 처리할 수 있는 비결.
