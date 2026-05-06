# NAT(Network Address Translation)란 무엇이며, 사설 IP를 가진 장치가 인터넷과 통신할 수 있는 원리는?

> A common practice is to have a NAT device mask many devices in a private network.
> Only the public interfaces of the NAT device need to have an Internet-routable address.
>
> The NAT device maps different IP addresses on the private network to different TCP or UDP port numbers on the public network.
> In residential networks, NAT functions are usually implemented in a residential gateway.
> In this scenario, the computers connected to the router have private IP addresses, and the router has a public address on its external interface to communicate on the Internet.
> The internal computers appear to share one public IP address.

---

**도입**

집에서 노트북·스마트폰·태블릿이 모두 인터넷이 됩니다. 그런데 IPv4 주소는 약 43억 개뿐 — 전 세계 장치 수보다 훨씬 적습니다. 어떻게 모든 장치가 동시에 통신하고 있을까요? 답은 NAT — 사설 네트워크 안의 여러 장치가 단 하나의 공인 IP를 공유해 인터넷에 나가는 기술입니다. 가정 공유기가 매일 묵묵히 하는 그 일.

---

**본문**

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

**종합**

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
