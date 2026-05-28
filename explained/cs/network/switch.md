# 네트워크 스위치란 무엇인가?

## 도입

스위치는 같은 LAN 안의 장치들을 연결하는 장비다. 허브처럼 모든 포트에 신호를 뿌리지 않고, MAC 주소를 보고 정확한 목적지 포트에만 데이터를 전달한다는 점이 핵심이다. 라우터가 다른 네트워크 간 통신을 담당한다면, 스위치는 같은 네트워크 안의 통신을 담당한다.

---

## 본문

> A network switch is networking hardware that connects devices on a computer network by using packet switching to receive and forward data to the destination device.

"네트워크 스위치는 패킷 스위칭을 사용해 데이터를 수신하고 목적지 장치로 전달함으로써 컴퓨터 네트워크의 장치들을 연결하는 네트워킹 하드웨어다."

- **packet switching**: 데이터를 패킷 단위로 전달하는 방식. 목적지 포트로만 내보내므로 다른 포트와 대역폭을 공유하지 않아도 된다.
- **networking hardware**: 소프트웨어가 아닌 물리 장치. 대부분의 스위치는 전용 ASIC 칩으로 초고속 패킷 처리를 한다.

> A network switch is a multiport network bridge that uses MAC addresses to forward data at the data link layer (layer 2) of the OSI model.

"네트워크 스위치는 OSI 모델의 데이터링크 계층(레이어 2)에서 MAC 주소를 사용해 데이터를 전달하는 멀티포트 네트워크 브리지다."

- **multiport network bridge**: 여러 포트를 가진 브리지. 2개 포트만 있는 브리지를 확장한 형태가 스위치다.
- **MAC addresses**: 스위치가 전달 결정에 사용하는 주소. IP가 아닌 MAC을 보므로 L2 장치로 분류된다.
- **data link layer (layer 2)**: L2 계층. IP를 모르고 MAC만 다룬다.

> Some switches can also forward data at the network layer (layer 3) by additionally incorporating routing functionality.
> Such switches are commonly known as layer-3 switches or multilayer switches.

"일부 스위치는 라우팅 기능을 추가로 통합하여 네트워크 계층(레이어 3)에서도 데이터를 전달할 수 있다. 이런 스위치를 보통 레이어 3 스위치 또는 멀티레이어 스위치라고 한다."

```
스위치 종류

L2 스위치:            MAC 주소로만 전달
                      같은 LAN 안의 통신

L3 스위치:            MAC + IP 주소 모두 처리
(Layer-3 switch)      VLAN 간 라우팅도 가능
```

---

## 종합

스위치는 LAN의 핵심 장비다. 같은 사무실 네트워크에서 PC들이 서로 파일을 공유하거나 내부 서버에 접속할 때, 스위치가 MAC 주소를 보고 정확한 포트로 프레임을 전달한다. 라우터가 없어도 같은 LAN 안에서는 스위치만으로 통신이 된다.

---

---

# 네트워크 스위치와 허브의 차이는?

## 도입

허브도 여러 장치를 연결하는 네트워킹 장비지만, 스위치와 결정적으로 다른 점이 있다. 허브는 "모든 포트에 뿌리고 장치가 걸러내게" 하지만, 스위치는 "정확한 포트에만 보낸다". 이 차이가 성능과 보안에 큰 영향을 준다.

---

## 본문

> Unlike repeater hubs, which broadcast the same data out of each port and let the devices pick out the data addressed to them, a network switch learns the Ethernet addresses of connected devices and then only forwards data to the port connected to the device to which it is addressed.

"각 포트로 같은 데이터를 브로드캐스트하고 장치들이 자신에게 주소 지정된 데이터를 골라내도록 하는 리피터 허브와 달리, 네트워크 스위치는 연결된 장치들의 이더넷 주소를 학습하고 그 후에 주소 지정된 장치에 연결된 포트로만 데이터를 전달한다."

- **broadcast the same data out of each port**: 허브는 모든 포트에 동일한 신호를 복사해 뿌린다. 목적지가 아닌 장치도 신호를 받고, MAC 주소 확인 후 버린다.
- **let the devices pick out**: 필터링이 장치(NIC) 레벨에서 일어난다. 불필요한 처리를 모든 장치가 해야 한다.
- **learns the Ethernet addresses**: 스위치는 들어오는 프레임의 출발지 MAC을 보고 "이 포트에 이 MAC이 있다"고 MAC 주소 테이블에 자동 학습한다.
- **only forwards data to the port**: 학습된 테이블을 참조해 목적지 포트에만 전달한다.

```
허브 vs 스위치 동작 비교

[허브] PC-A가 PC-C에 데이터 전송 시:
PC-A → [허브] → PC-B (받고 버림)
               → PC-C (수신, 처리)
               → PC-D (받고 버림)

[스위치] PC-A가 PC-C에 데이터 전송 시:
PC-A → [스위치] → PC-C (MAC 테이블 참조, 정확한 포트만)
  (PC-B, PC-D는 받지 않음)
```

허브의 단점:
- 불필요한 트래픽으로 대역폭 낭비.
- 모든 장치가 같은 collision domain에 있어 충돌 발생.
- 보안: 모든 장치가 다른 장치의 패킷을 볼 수 있어 도청 가능.

---

## 종합

스위치가 허브를 대체한 이유는 효율과 보안이다. 스위치는 목적지 포트에만 데이터를 보내므로 대역폭이 절약되고 충돌이 없다. 또한 다른 장치의 트래픽이 보이지 않아 도청이 어렵다. 현재 거의 모든 유선 LAN 환경에서 허브는 사라지고 스위치가 표준이 되었다.

---

---

# 스위치가 collision domain은 분리하지만 broadcast domain은 분리하지 못하는 이유는?

## 도입

스위치는 충돌 도메인(collision domain)을 포트별로 분리하지만, 브로드캐스트 도메인(broadcast domain)은 분리하지 못한다. 이 차이를 이해하면 VLAN이 왜 필요한지가 명확해진다.

---

## 본문

> An Ethernet switch operates at the data link layer (layer 2) of the OSI model to create a separate collision domain for each switch port.

"이더넷 스위치는 OSI 모델의 데이터링크 계층(레이어 2)에서 동작해 각 스위치 포트마다 별도의 충돌 도메인을 만든다."

- **collision domain**: 충돌이 발생할 수 있는 영역. 같은 전선을 공유하는 구간에서는 동시에 신호를 보내면 충돌이 난다.
- **separate collision domain for each switch port**: 스위치의 각 포트는 독립 충돌 도메인이다. 포트 1의 장치가 전송해도 포트 2의 장치 전송에 영향이 없다.

> Each device connected to a switch port can transfer data to any of the other ports at any time and the transmissions will not interfere.

"스위치 포트에 연결된 각 장치는 언제든지 다른 어느 포트로도 데이터를 전송할 수 있으며 전송이 서로 간섭하지 않는다."

> Because broadcasts are still being forwarded to all connected devices by the switch, the newly formed network segment continues to be a broadcast domain.

"그러나 스위치가 여전히 모든 연결된 장치에게 브로드캐스트를 전달하기 때문에, 새로 구성된 네트워크 세그먼트는 계속 브로드캐스트 도메인으로 남는다."

- **broadcasts are still being forwarded to all connected devices**: 스위치가 L2 레벨에서 동작하기 때문에 브로드캐스트 프레임(목적지 MAC: `FF:FF:FF:FF:FF:FF`)을 모든 포트로 내보낸다. 이것이 L2 설계 상 어쩔 수 없는 동작이다.
- **broadcast domain**: 브로드캐스트 프레임이 전달되는 영역. 분리하려면 L3 장치(라우터)나 VLAN이 필요하다.

```
스위치가 만드는 경계

Collision Domain (충돌 도메인):
─ 포트마다 별도 도메인 → 스위치가 분리

[스위치]
├── 포트1 (PC-A) : 충돌 도메인 1
├── 포트2 (PC-B) : 충돌 도메인 2
├── 포트3 (PC-C) : 충돌 도메인 3
└── 포트4 (PC-D) : 충돌 도메인 4

Broadcast Domain (브로드캐스트 도메인):
─ 스위치 전체가 하나의 도메인

ARP 브로드캐스트 → 스위치의 모든 포트(PC-A, B, C, D)에 전달됨
```

브로드캐스트 도메인을 분리하려면 VLAN이나 라우터가 필요하다. VLAN은 하나의 물리 스위치를 논리적으로 여러 브로드캐스트 도메인으로 나눈다.

---

## 종합

스위치는 L2 장치이므로 충돌 도메인은 포트별로 분리하지만 브로드캐스트는 차단하지 않는다. 대규모 LAN에서 브로드캐스트 트래픽이 많아지면 성능이 저하되는데(broadcast storm), 이를 막으려면 VLAN으로 브로드캐스트 도메인을 나누거나 라우터로 네트워크를 분리해야 한다.

---

---

# 라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라

## 도입

라우터와 스위치 모두 "어디로 보낼지" 결정하는 테이블이 있다. 라우터는 IP 기반의 라우팅 테이블(RIB)을, 스위치는 MAC 기반의 MAC 주소 테이블(FIB)을 사용한다. 두 테이블의 역할과 구축 방식이 다르다.

---

## 본문

> A forwarding information base (FIB), also known as a forwarding table or MAC (address) table, is most commonly used in network bridging, routing, and similar functions to find the proper output network interface controller to which the input interface should forward a packet.

"포워딩 정보 베이스(FIB), 포워딩 테이블 또는 MAC 주소 테이블이라고도 알려진 것은 입력 인터페이스가 패킷을 전달해야 할 적절한 출력 NIC를 찾기 위해 네트워크 브리징, 라우팅 등에서 가장 흔히 사용된다."

- **FIB**: Forwarding Information Base. 포워딩(실제 패킷 전달) 최적화를 위한 데이터 구조. 스위치에서는 MAC 주소 테이블이 곧 FIB다.

> FIBs are optimized for fast lookup of destination addresses and can improve performance of forwarding compared to using the routing information base (RIB) directly.
> The RIB is optimized for efficient updating by routing protocols and other control plane methods, and contain the full set of routes learned by the router.

"FIB는 목적지 주소의 빠른 조회를 위해 최적화되어 있어 RIB를 직접 사용하는 것보다 포워딩 성능을 향상시킬 수 있다. RIB는 라우팅 프로토콜과 기타 제어 면 방법에 의한 효율적인 업데이트를 위해 최적화되어 있으며, 라우터가 학습한 전체 경로 집합을 담는다."

- **RIB**: Routing Information Base. 라우터의 실제 경로 데이터베이스. 라우팅 프로토콜이 업데이트한다.
- **FIB**: RIB에서 포워딩에 필요한 부분만 추출해 빠른 조회를 위해 별도로 유지한다.

```
라우터(RIB) vs 스위치(FIB/MAC 테이블) 비교

                라우터 라우팅 테이블 (RIB)    스위치 MAC 주소 테이블 (FIB)
계층             L3 (IP)                     L2 (MAC)
매핑             목적지 IP → 다음 홉/인터페이스   MAC 주소 → 포트
구축 방식         라우팅 프로토콜 또는 정적 설정   트래픽 source MAC을 관찰하여 자동 학습
용도             네트워크 간 라우팅             같은 LAN 안의 정확한 포트 전달
FIB 관계         별도 FIB로 복제해 포워딩 최적화  테이블 자체가 곧 FIB
```

스위치의 MAC 주소 테이블 자동 학습:
1. 프레임이 포트 1에서 들어오면, 출발지 MAC을 "포트 1에 있음"으로 기록
2. 다음에 그 MAC을 목적지로 하는 프레임이 오면 포트 1로만 전달

---

## 종합

라우터와 스위치 모두 포워딩 테이블을 가지지만, 다루는 주소와 역할이 다르다. 라우터의 RIB는 경로 계산(control plane)의 산물이고, 스위치의 MAC 테이블은 트래픽 관찰로 자동 구축된다. FIB는 양쪽 모두에서 실제 패킷 전달(data plane)의 빠른 조회를 위해 존재하며, 라우터에서는 RIB와 분리된 별도 구조로, 스위치에서는 MAC 테이블 자체가 FIB 역할을 한다.
