# 네트워크란 무엇인가?

## 도입

네트워크는 데이터를 주고받기 위해 묶인 장치들의 집합이다. 단순히 가까이 있는 컴퓨터들의 무리가 아니라, 서로 통신할 수 있다는 점이 핵심이다. OA는 이를 "호스트(host)들이 통신 프로토콜을 통해 다른 호스트에 데이터를 보내는 집합"으로 정의한다.

---

## 본문

> A network is a group of communicating computers and peripherals known as hosts, which communicate data to other hosts via communication protocols.

"네트워크는 호스트라 불리는, 통신하는 컴퓨터와 주변 기기의 집합이며, 통신 프로토콜을 통해 다른 호스트에 데이터를 전달한다."

- **group**: 단순한 무리가 아니라 통신을 목적으로 묶인 집단이다.
- **communicating**: 이 정의의 가장 중요한 속성. 옆에 있다고 네트워크가 아니라, 서로 데이터를 주고받을 수 있어야 한다. 같은 사무실의 두 컴퓨터가 케이블만 꽂혀 있고 IP 설정이 없으면 네트워크가 아니다.
- **peripherals**: 컴퓨터(PC·서버) 외의 주변 기기. 네트워크 프린터, NAS, IP 카메라 등이 여기 포함된다.
- **hosts**: 노드 중에서 IP 주소를 가지고 응용 계층 통신에 직접 참여하는 장치. 다음 질문에서 자세히 다룬다.
- **via communication protocols**: "프로토콜을 거쳐" — 호스트들이 직접 신호로 통하는 게 아니라 약속된 규칙(TCP/IP, HTTP 등)을 따라야만 데이터가 전달된다. 사람으로 치면 같은 언어로 말해야 대화가 되는 것과 같다.

네트워크는 세 요소로 구성된다 — 호스트(Node), 링크(Hardware), 프로토콜. 이 셋 중 하나라도 빠지면 통신이 성립하지 않는다.

---

## 종합

```
네트워크
├── Node (Host)     데이터를 주고받는 주체 (PC, 스마트폰, 서버)
├── Link (Hardware) 데이터를 이동시키는 물리·논리 경로 (케이블, 와이파이, 라우터, 스위치)
└── Protocol        통신 규칙 (TCP/IP, HTTP, HTTPS)
```

브라우저에서 `fetch("https://example.com")`을 호출하는 장면을 떠올리면 이 셋이 동시에 동작한다. 내 노트북(호스트)이 와이파이를 거쳐(링크) HTTPS라는 약속(프로토콜)에 따라 example.com 서버(또 다른 호스트)에 요청을 보낸다. 와이파이가 끊기면 링크가 사라지고, HTTPS를 안 쓰면 프로토콜이 안 맞아 응답을 해석할 수 없다. 세 요소가 모두 갖춰져야 비로소 "네트워크가 동작한다"고 말할 수 있다.

---

# 호스트란 무엇인가?

## 도입

네트워크에 붙어 있는 장치를 통틀어 "노드"라고 부르는데, 그중에서 IP 주소를 가지고 응용 통신에 참여하는 장치를 호스트라고 한다. 호스트의 필요조건은 "주소를 가진다"는 것이다 — 주소가 없으면 누가 누구에게 데이터를 보내야 하는지 식별할 수 없다.

---

## 본문

> A network host is a computer or other device connected to a computer network.

"네트워크 호스트는 컴퓨터, 또는 컴퓨터 네트워크에 연결된 다른 장치다."

- **computer or other device**: PC뿐 아니라 스마트폰·태블릿·IoT 기기·NAS·네트워크 프린터까지 포함된다. "컴퓨터"라는 단어에 갇히지 않게 일부러 "other device"를 덧붙였다.
- **connected**: 단순히 케이블이 꽂혀 있는 물리적 연결이 아니라, 네트워크 스택(드라이버·OS·IP 설정)이 동작해서 실제로 통신할 수 있는 상태를 말한다.

> Hosts are assigned at least one network address.

"호스트는 적어도 하나의 네트워크 주소를 할당받는다."

- **assigned**: 호스트가 스스로 주소를 정하는 게 아니라 외부(네트워크 관리자나 DHCP 서버)가 부여한다. 임의로 정하면 같은 네트워크 안에서 충돌이 날 수 있어서 누군가가 중앙에서 관리해야 한다.
- **at least one**: 하나 이상이다. 노트북처럼 와이파이 인터페이스와 이더넷 인터페이스를 둘 다 가진 장치는 각 인터페이스마다 IP가 따로 붙어 2개의 주소를 가질 수 있다. 서버는 여러 NIC(Network Interface Card)에 각각 다른 IP를 부여해서 더 많이 가지기도 한다.

식별 없이는 데이터를 보낼 수 없으므로 네트워크 주소는 호스트의 **필수 조건**이다. 주소가 없으면 노드는 될 수 있어도 호스트는 될 수 없다.

---

## 종합

호스트의 본질은 "네트워크 안에서 자기 자신을 식별할 수 있는 장치"다. 비유하자면 택배 시스템에서 주소 없는 집은 택배를 받을 수 없는 것과 같다. 내 노트북이 와이파이에 붙는 순간 DHCP가 IP를 할당해주고, 그 시점부터 노트북은 인터넷의 한 호스트가 된다. 와이파이가 끊기면 IP를 잃고 다시 "단순한 컴퓨터"로 돌아간다.

---

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

---

# 호스트는 네트워크에서 어떤 역할을 하는가?

## 도입

호스트의 역할은 한 가지로 고정되지 않는다. 같은 컴퓨터가 어떤 통신에서는 서버, 다른 통신에서는 클라이언트, 또 다른 통신에서는 P2P 노드가 될 수 있다. OA는 세 역할을 모두 짚는다.

---

## 본문

> A host may work as a server offering information resources, services, and applications to users or other hosts on the network.

"호스트는 네트워크 상의 사용자 또는 다른 호스트에게 정보 자원·서비스·애플리케이션을 제공하는 서버로 동작할 수 있다."

- **may work as**: "~으로 동작할 수 있다" — 영구 속성이 아니라 그때그때의 역할이다.
- **offering**: 일방적으로 "제공한다" — 요청을 받으면 응답하는 위치. 능동적으로 클라이언트에 데이터를 강요하지 않는다.

> Network hosts are classified as server or client systems.

"네트워크 호스트는 서버 또는 클라이언트 시스템으로 분류된다."

- **client**: 서버에 자원을 요청하는 쪽. 브라우저, 모바일 앱, `curl` 명령이 모두 클라이언트다.

> Network hosts may also function as nodes in peer-to-peer applications, in which all nodes share and consume resources in an equipotent manner.

"호스트는 또한 P2P(peer-to-peer) 응용에서 노드로 기능할 수도 있는데, 거기서는 모든 노드가 동등한 자격으로 자원을 공유하고 소비한다."

- **peer-to-peer**: "동료 대 동료" — 한쪽이 일방적으로 제공하고 다른 쪽이 받기만 하는 구조가 아니다.
- **equipotent**: equi(같은) + potent(역량). 모든 참가자가 같은 권한·역할을 가진다는 의미. 서버/클라이언트 위계가 없는 평등한 구조.
- **share and consume**: 동시에 두 동작을 다 한다. 토렌트에서 파일을 받으면서 동시에 다른 사용자에게 그 조각을 올려주는 것이 전형적인 P2P 동작이다.

---

## 종합

같은 노트북이라도 브라우저로 유튜브를 볼 때는 클라이언트, 로컬에서 `npm run dev`로 개발 서버를 띄워 동료가 접속하면 서버, 화상 통화에 WebRTC를 쓰면 P2P 노드가 된다. 역할은 **관계의 문제**이지 장비의 영구 속성이 아니다. "이 컴퓨터는 서버야"라는 표현은 보통 "이 컴퓨터는 주로 서버로 쓰인다"는 뜻이지, 절대 클라이언트가 못 된다는 뜻이 아니다.

---

# 네트워크 노드와 호스트의 차이는?

## 도입

이 질문은 비교형이다. 노드는 더 넓은 개념이고, 호스트는 그중에서도 응용 계층 통신에 직접 참여하는 노드의 부분집합이다. 핵심 구분 기준은 "응용 계층에 참여하는가, IP 주소가 있는가"다. 인프라 장비(스위치·허브·모뎀)는 노드지만 호스트는 아니다.

---

## 본문

> A network node is any device participating in a network.

"네트워크 노드는 네트워크에 참여하는 어떤 장치든이다."

- **any device**: 라우터, 스위치, 허브, 모뎀, 그리고 PC·서버까지 — 네트워크에 물려 있는 모든 장비. 인프라 장비도 포함된다.

> A host is a node that participates in user applications, either as a server, client, or both.

"호스트는 사용자 응용에 서버·클라이언트 또는 양쪽 모두로 참여하는 노드다."

- **participates in user applications**: 응용 계층(HTTP, FTP, SMTP 등) 통신에 직접 끼어든다는 뜻. 단순히 패킷을 전달만 하는 게 아니라 그 안의 내용을 해석하고 응답한다.

> A server is a type of host that offers resources to the other hosts. Typically, a server accepts connections from clients who request a service function.

"서버는 다른 호스트에 자원을 제공하는 호스트의 한 종류다. 일반적으로 서버는 서비스를 요청하는 클라이언트의 연결을 수락한다."

- **a type of host**: 서버는 호스트의 하위 분류 — 모든 서버는 호스트지만 모든 호스트가 서버는 아니다.
- **accepts connections**: 먼저 말을 걸지 않고 기다린다. 클라이언트가 `connect()`해야 비로소 통신이 시작된다.

> Every network host is a node, but not every network node is a host.

"모든 네트워크 호스트는 노드지만, 모든 네트워크 노드가 호스트인 것은 아니다."

- 이 한 문장이 노드와 호스트의 포함 관계를 단정한다. 호스트 ⊂ 노드.

> Network infrastructure hardware, such as modems, Ethernet hubs, and network switches are not directly or actively participating in application-level functions, do not necessarily have a network address, and are not considered to be network hosts.

"모뎀·이더넷 허브·네트워크 스위치 같은 네트워크 인프라 하드웨어는 응용 계층 기능에 직접·능동적으로 참여하지 않고, 반드시 네트워크 주소를 가질 필요도 없으며, 네트워크 호스트로 간주되지 않는다."

- **infrastructure hardware**: 데이터를 전달만 할 뿐 내용을 해석하지 않는 장비. 스위치는 MAC 주소만 보고 포트로 내보내고, 허브는 그냥 모든 포트에 복제해 뿌린다.
- **not directly or actively participating in application-level functions**: HTTP·DNS 같은 응용 계층 메시지를 만들거나 응답하지 않는다는 뜻.
- **do not necessarily have a network address**: 스위치·허브에는 IP가 안 붙는 것이 일반적이다. (관리용으로 일부러 IP를 붙인 "managed switch"도 있지만 기본 동작에는 필요 없다.)

---

## 종합

```
                     노드(Node)
                  ┌───────────────────┐
                  │  네트워크에 참여하는  │
                  │  모든 장치            │
                  └─────────┬─────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
       ┌───────────────┐         ┌──────────────────┐
       │  호스트(Host)   │         │   인프라 장비       │
       │                │         │                  │
       │  - IP 있음     │         │  - IP 없을 수도   │
       │  - 응용 참여   │         │  - 패킷 전달만    │
       │                │         │                  │
       └───────────────┘         └──────────────────┘
       PC, 서버, 스마트폰,         스위치, 허브,
       NAS, IP 카메라              모뎀, 리피터

       ┌───── 서버 ─────┐
       │  요청을 받아     │
       │  자원을 제공     │
       └───────────────┘
       ┌──── 클라이언트 ─┐
       │  요청을 보내고   │
       │  응답을 받음     │
       └───────────────┘
```

라우터는 경계에 있다 — 패킷을 전달하지만 자기 자신도 IP를 가지고 관리 인터페이스에 응답하기 때문에 "호스트 역할도 하는 노드"로 분류되기도 한다. 그러나 스위치·허브·모뎀은 응용 계층에 끼어들지 않으므로 노드로만 분류한다. "이 장비가 호스트인가?"를 판별하는 가장 간단한 기준은 "IP 주소를 가지고 HTTP 같은 응용 계층 통신을 주체적으로 하는가"다.
