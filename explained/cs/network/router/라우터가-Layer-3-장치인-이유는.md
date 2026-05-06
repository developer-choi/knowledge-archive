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
