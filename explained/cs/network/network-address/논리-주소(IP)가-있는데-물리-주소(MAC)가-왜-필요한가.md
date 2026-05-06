# 논리 주소(IP)가 있는데 물리 주소(MAC)가 왜 필요한가?

> The Address Resolution Protocol (ARP) is a communication protocol for discovering the link layer address, such as a MAC address, associated with an internet layer address, typically an IPv4 address.
>
> ARP enables a host to send, for example, an IPv4 packet to another node in the local network by providing a protocol to get the MAC address associated with an IP address.

---

**도입**

이전 질문에서 "IP가 식별 + 위치 지정 둘 다 하니 MAC 없어도 되는 거 아닌가?"라는 의문이 나옵니다. 답은 아닙니다 — 라우팅(L3)과 실제 프레임 전달(L2)은 서로 다른 계층의 일이고, 마지막 한 홉을 누구에게 줄지는 MAC이 결정합니다. ARP는 바로 그 두 계층을 잇는 프로토콜입니다.

---

**본문**

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

**종합**

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
