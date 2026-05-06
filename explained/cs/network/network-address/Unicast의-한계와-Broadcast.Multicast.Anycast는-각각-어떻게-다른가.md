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

**도입**

브라우저가 평소 보내는 `fetch()`는 거의 다 unicast — 한 클라이언트가 한 서버에게 1대1로 보내는 것입니다. 그런데 같은 데이터를 100명에게 보내야 한다면? 100번 보내는 게 비효율적이라는 직관에서 출발해 broadcast·multicast·anycast가 등장합니다. 각각이 어떤 비효율을 어떻게 해결하는지가 이 질문의 핵심.

---

**본문**

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

**종합**

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
