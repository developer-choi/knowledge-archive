# 호스트의 IP 주소는 어떻게 설정되는가?

## 도입

호스트가 IP를 가진다는 건 알겠는데, 그 IP가 어떻게 호스트에 박히는지가 다음 질문이다. 방법은 둘 — 사람이 직접 박는 "수동", 시스템이 자동으로 받아오는 "자동(DHCP)". 가정·카페에서 노트북을 켜자마자 인터넷이 되는 건 후자 덕분이다.

---

## 본문

> Hosts have one or more IP addresses assigned to their network interfaces.

"호스트는 네트워크 인터페이스에 하나 이상의 IP 주소를 할당받는다."

- **network interfaces**: 와이파이 카드, 이더넷 포트 같은 실제 통신 채널 자체. IP는 호스트 전체가 아니라 **인터페이스 단위로** 붙는다. 그래서 노트북이 와이파이와 유선을 동시에 쓰면 IP가 2개가 된다.

> The addresses are configured either manually by an administrator, or automatically at startup by means of the Dynamic Host Configuration Protocol (DHCP).

"주소는 관리자가 수동으로 구성하거나, 시작 시 동적 호스트 설정 프로토콜(DHCP)에 의해 자동으로 구성된다."

- **manually by an administrator**: 사람이 OS 네트워크 설정 화면에서 직접 입력한다. 주소가 바뀌면 곤란한 장비 — 회사 NAS, 사내 서버, 라우터 자신 — 가 이 방식을 쓴다.
- **automatically at startup**: 부팅·연결 시점에 자동으로 받아온다. 사용자는 IP를 모르고 인터넷을 쓴다.
- **DHCP**: 가정용 와이파이 공유기가 노트북에 IP를 자동으로 주는 그 프로토콜. 노트북이 "IP 좀 줘" 브로드캐스트를 보내면 공유기가 "이거 써" 응답하는 4단계 핸드셰이크(DISCOVER → OFFER → REQUEST → ACK)로 진행된다.

---

## 종합

수동 설정은 안정성을 얻는 대신 사람의 손이 필요하고, DHCP는 편리한 대신 IP가 갱신될 때마다 바뀔 수 있다. 그래서 클라이언트(노트북·스마트폰)는 DHCP를, 서버(고정 주소가 필요한 장비)는 수동 설정을 쓴다. 평소엔 의식하지 못하지만 노트북을 부팅할 때마다 매번 DHCP 핸드셰이크가 백그라운드에서 돈다. 와이파이가 안 잡힐 때 "IP 받아오는 중" 표시가 뜨는 건 정확히 이 단계다.
