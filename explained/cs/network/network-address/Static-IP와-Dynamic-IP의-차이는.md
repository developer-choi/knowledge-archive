# Static IP와 Dynamic IP의 차이는?

> IP addresses are assigned to a host either dynamically as they join the network, or persistently by configuration of the host hardware or software.
> Persistent configuration is also known as using a static IP address.
> In contrast, when a computer's IP address is assigned each time it restarts, this is known as using a dynamic IP address.

---

**도입**

같은 IP 할당이라도 두 가지 길이 있습니다. 노트북이 카페 Wi-Fi에 붙을 때마다 다른 IP를 받는 것과, 회사 웹서버가 5년째 같은 IP를 쓰는 것은 같은 시스템(IP)을 다른 방식으로 운용하고 있는 것입니다 — 그 차이를 결정하는 게 "동적이냐 고정이냐"입니다.

---

**본문**

> IP addresses are assigned to a host either dynamically as they join the network,

IP 주소는 호스트가 네트워크에 참여할 때 동적으로 할당되거나,

- **dynamically**: 동적으로. 미리 정해진 게 아니라 그 순간에 결정.
- **as they join the network**: 네트워크에 붙는 그 시점에. Wi-Fi에 연결되는 순간, 케이블을 꽂는 순간 — 그때 받음.

> or persistently by configuration of the host hardware or software.

호스트 하드웨어나 소프트웨어의 설정에 의해 영구적으로 할당된다.

- **persistently**: 영구적으로. 한 번 정해두면 계속 같은 값을 사용.
- **by configuration**: 누군가가 의도적으로 설정. 부팅마다 자동으로 받는 게 아니라 미리 박아둔 값을 그대로 사용.

> Persistent configuration is also known as using a static IP address.

영구적 설정은 정적(static) IP 주소를 사용하는 것이라고도 알려져 있다.

- **static**: 정적. 변하지 않음. "한 번 정해놓은 채로 유지".

> In contrast, when a computer's IP address is assigned each time it restarts, this is known as using a dynamic IP address.

반대로, 컴퓨터의 IP 주소가 재시작할 때마다 할당되는 경우 이를 동적(dynamic) IP 주소를 사용한다고 한다.

- **each time it restarts**: 재시작할 때마다. 즉 매번 새로 받을 가능성이 있음.
- **dynamic**: 동적. 매번 결정될 수 있음 — 같은 값이 다시 올 수도, 다른 값이 올 수도 있음.

---

**종합**

두 방식의 운영 차이를 한눈에 보면:

| | Static IP | Dynamic IP |
|---|---|---|
| 누가 정하는가 | 관리자가 수동 설정 | DHCP 서버 자동 분배 |
| 언제 정해지는가 | 한 번 박아두면 끝 | 매 부팅·재접속마다 |
| 변하는가 | 안 변함 | 바뀔 수 있음 |
| 관리 비용 | 높음 (수동) | 낮음 (자동) |
| 대표 사용처 | 웹서버, DB 서버, 프린터, 라우터 | 노트북, 스마트폰, 가정용 PC |

브라우저 개발자가 양쪽 다 일상적으로 마주칩니다:
- AWS EC2에 Elastic IP를 붙이거나 사내 dev 서버에 고정 IP를 박는 것 → static. DNS A 레코드가 가리키는 IP가 절대 바뀌면 안 되니까. `api.example.com → 203.0.113.42`가 하루 만에 바뀌면 도메인이 끊깁니다.
- 사무실 노트북이 케이블을 꽂자마자 IP를 받는 것 → dynamic. 사용자는 IP 설정 화면을 켤 일조차 없습니다.

Official Annotation의 보안 함의가 흥미롭습니다 — 가정 ISP가 보통 dynamic IP를 주는 이유는 두 가지입니다:
- 같은 사용자가 집에서 웹사이트를 운영하는 것을 방지 (상업용 서비스는 별도 비즈니스 회선으로 유도)
- 해커가 같은 IP를 반복 시도하기 어렵게 만듦 (IP가 주기적으로 바뀌니 표적 고정이 어려움)

오개념 예방: "Dynamic IP면 매번 다른 IP가 온다"는 일부분만 맞습니다. DHCP 서버는 보통 같은 MAC 주소에 같은 IP를 임대 기간(보통 24시간~7일) 동안 다시 줍니다. 그래서 사무실 노트북이 매일 같은 IP를 받기도 합니다. 다만 **보장**되지 않으므로 외부 의존 주소로는 부적합 — 이 차이가 dev/prod 서버에 static을 박는 이유.

이게 없으면 어떻게 되는가: 모든 IP가 dynamic이라면 DNS A 레코드가 매일 깨지고, SSL 인증서가 가리키는 IP가 흔들리며, 회사 서버에 접속하려면 매일 새 IP를 알아내야 합니다. 반대로 모든 IP가 static이라면 카페 Wi-Fi에 붙기 위해 사용자가 매번 게이트웨이·서브넷·DNS를 직접 입력해야 합니다. 두 방식의 공존이 인터넷 운영의 유연성을 만들어냅니다 — "변하면 안 되는 곳"은 static, "변해도 무방한 곳"은 dynamic.
