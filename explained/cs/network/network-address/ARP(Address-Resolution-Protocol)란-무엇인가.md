# ARP(Address Resolution Protocol)란 무엇인가?

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.
>
> ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.
> The host broadcasts a request containing the target node's IP address, and the node with that IP address replies with its MAC address.
>
> It is communicated within the boundaries of a single subnetwork and is never routed.

---

**도입**

앞 질문 "IP가 있는데 왜 MAC이 필요한가?"의 답이 ARP였습니다. 이번엔 그 ARP의 동작 단계를 따라가봅니다 — 누가 무엇을 broadcast하고, 누가 어떻게 응답하며, 그 결과가 어디에 저장되는가. 같은 LAN 안에서만 동작하는 좁은 프로토콜이지만 모든 IP 통신의 마지막 단계가 여기에 의존합니다.

---

**본문**

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

**종합**

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
