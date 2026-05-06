# 라우터의 라우팅 테이블과 스위치의 MAC 주소 테이블을 비교하라

> A forwarding information base (FIB), also known as a forwarding table or MAC (address) table, is most commonly used in network bridging, routing, and similar functions to find the proper output network interface controller to which the input interface should forward a packet.
>
> FIBs are optimized for fast lookup of destination addresses and can improve performance of forwarding compared to using the routing information base (RIB) directly.
> The RIB is optimized for efficient updating by routing protocols and other control plane methods, and contain the full set of routes learned by the router.

---

**도입**

라우터와 스위치 모두 "들어온 트래픽을 어느 포트로 내보낼지" 결정하는 표를 들고 있습니다. 그런데 두 표는 같은 일을 하면서도 구조가 다릅니다 — 라우터의 라우팅 테이블은 "학습용 vs 빠른 조회용"으로 두 단계가 있고, 스위치의 MAC 테이블은 그 자체로 빠른 조회용입니다. 이 차이는 트래픽 유형과 학습 방식에서 옵니다.

---

**본문**

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

**종합**

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
