# 호스트의 IP 주소는 어떻게 설정되는가?

> Hosts have one or more IP addresses assigned to their network interfaces.
> The addresses are configured either manually by an administrator, or automatically at startup by means of the Dynamic Host Configuration Protocol (DHCP).

---

**도입**

host는 적어도 하나의 네트워크 주소를 가져야 한다고 했죠. 그럼 그 주소는 도대체 누가, 언제, 어떻게 정해줄까요? 답은 두 가지 경로뿐입니다 — 사람이 손으로 박거나, DHCP가 자동으로 꽂아주거나. 노트북 Wi-Fi가 카페에서 자동으로 붙는 것도, 회사 사내망 서버에 고정 IP가 박혀 있는 것도, 모두 이 두 경로 중 하나입니다.

---

**본문**

> Hosts have one or more IP addresses assigned to their network interfaces.

호스트는 자신의 네트워크 인터페이스에 하나 이상의 IP 주소를 할당받는다.

- **one or more**: 하나만일 수도 있고 여러 개일 수도 있습니다. 노트북이 유선 LAN + Wi-Fi에 동시에 붙어 있으면 IP가 두 개 — 인터페이스마다 별도로 할당되기 때문.
- **network interfaces**: IP는 host 자체가 아니라 **인터페이스**(랜카드·Wi-Fi 모듈 같은 통신 모듈)에 붙는다는 점이 중요. host가 인터페이스를 여러 개 가지면 IP도 여러 개. 윈도우의 `ipconfig`, macOS·Linux의 `ifconfig` / `ip addr`로 확인 가능.

> The addresses are configured either manually by an administrator,

주소는 관리자에 의해 수동으로 설정되거나,

- **manually by an administrator**: 사람이 직접 박는 방식. 서버·프린터·라우터처럼 주소가 바뀌면 안 되는 장치에 사용. 웹서버 IP가 매번 바뀌면 DNS A 레코드가 따라가지 못해 외부 접근이 끊깁니다.

> or automatically at startup by means of the Dynamic Host Configuration Protocol (DHCP).

또는 시동 시 DHCP(Dynamic Host Configuration Protocol)에 의해 자동으로 설정된다.

- **automatically at startup**: 부팅·연결 시점에 자동으로. 카페 Wi-Fi에 붙자마자 IP가 받아지는 그 순간이 바로 이 단계입니다.
- **Dynamic Host Configuration Protocol (DHCP)**: IP 자동 분배 프로토콜. 클라이언트가 "IP 좀 주세요" 브로드캐스트하면 DHCP 서버(보통 공유기)가 사용 중이지 않은 IP를 골라 임대해줍니다.

---

**종합**

두 방식의 차이를 정리하면:

| 방식 | 누가 주소를 정함 | 대표 사용처 | 특징 |
|---|---|---|---|
| Static (수동) | 관리자 | 웹서버, 프린터, 라우터, 사내 NAS | 변하지 않음, DNS·라우팅이 의존 가능 |
| Dynamic (DHCP) | DHCP 서버 자동 분배 | 노트북, 스마트폰, 일반 PC | 부팅·재접속 시 바뀔 수 있음 |

브라우저 개발자 관점에서 두 방식을 모두 마주칩니다:
- 사무실 노트북이 네트워크 케이블을 꽂자마자 IP를 받는 것 → DHCP. 설정 화면을 켤 일조차 거의 없습니다.
- AWS EC2 인스턴스에 Elastic IP를 붙이거나, 사내 dev 서버에 고정 IP를 박아두는 것 → 수동 (혹은 클라우드 콘솔 자동화). DNS A 레코드가 가리키는 IP는 절대 바뀌면 안 되니까.

오개념 예방: "DHCP면 IP가 매번 바뀐다"는 절반만 맞습니다. DHCP 서버는 보통 같은 MAC 주소에 같은 IP를 일정 기간(임대 기간) 다시 줍니다. 그래서 사무실 노트북이 매일 같은 IP를 받기도 합니다. 다만 **보장**되지는 않으므로 외부에서 의존할 주소로는 부적합합니다.

이게 없으면 어떻게 되는가: DHCP가 없던 시절엔 카페 Wi-Fi에 붙을 때마다 사용자가 "이 네트워크 게이트웨이는 뭐고 사용 가능한 IP는 뭐인지" 손으로 입력해야 했습니다. 그게 매 와이파이마다 반복되는 걸 상상해보면 DHCP가 왜 사실상 필수인지가 명확합니다. 자동화된 IP 분배 덕분에 우리는 노트북을 들고 카페·공항·회사를 옮겨도 별도 설정 없이 인터넷이 됩니다.
