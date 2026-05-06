# 스위치가 collision domain은 분리하지만 broadcast domain은 분리하지 못하는 이유는?

> An Ethernet switch operates at the data link layer (layer 2) of the OSI model to create a separate collision domain for each switch port.
> Each device connected to a switch port can transfer data to any of the other ports at any time and the transmissions will not interfere.
> Because broadcasts are still being forwarded to all connected devices by the switch, the newly formed network segment continues to be a broadcast domain.

---

**도입**

스위치 한 대를 꽂으면 LAN 안의 충돌(collision)이 사라집니다. 그런데 같은 스위치에 붙은 장치들은 여전히 broadcast(예: ARP)를 함께 받습니다 — 일부는 분리됐는데 일부는 안 됐다는 게 이 질문의 핵심입니다. 두 "domain"이 다른 개념이기 때문에 스위치의 영향이 다르게 나타납니다.

---

**본문**

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

**종합**

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
