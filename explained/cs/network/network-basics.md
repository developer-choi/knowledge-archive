# 네트워크란 무엇인가?

> A network is a group of communicating computers and peripherals known as hosts, which communicate data to other hosts via communication protocols.

---

## 도입

브라우저에서 `fetch('https://api.example.com/users')`를 실행하면 내 노트북과 어딘가의 서버가 데이터를 주고받습니다. 이 두 컴퓨터가 데이터를 주고받을 수 있도록 묶여 있는 상태가 곧 "네트워크"입니다. 단순히 "여러 컴퓨터가 모인 것"이 아니라 **공통 규칙으로 통신하는 무리**라는 점이 핵심입니다.

---

## 본문

> A network is a group of communicating computers and peripherals known as hosts,

네트워크란 호스트라고 불리는, 서로 통신하는 컴퓨터와 주변 기기의 집합이다.

- **group of communicating**: "그냥 모인 무리"가 아니라 **서로 통신하는** 무리. 책상 위에 PC 5대가 놓여 있어도 서로 신호를 주고받지 않으면 네트워크가 아닙니다.
- **computers and peripherals**: PC·서버 같은 컴퓨터뿐 아니라 프린터·스마트폰·IoT 센서 같은 주변기기도 포함. 네트워크의 구성원은 "컴퓨터"보다 넓습니다.
- **hosts**: 네트워크에 참여해 데이터를 주고받는 주체를 부르는 이름. PC면 PC, 서버면 서버, 프린터면 프린터 — 종류는 달라도 네트워크 관점에서는 모두 host로 통일해 부릅니다.

> which communicate data to other hosts via communication protocols.

다른 호스트들과 통신 프로토콜을 통해 데이터를 주고받는다.

- **communicate data**: 단순히 신호가 흐르는 게 아니라 의미 있는 데이터(요청·응답·파일 등)를 교환. `fetch()`가 보내는 HTTP 요청이 바로 이 "data"의 한 형태입니다.
- **communication protocols**: 통신 규칙 모음. TCP/IP·HTTP 같은 것. 이게 없으면 호스트 A가 보낸 비트 묶음을 호스트 B가 어떻게 해석해야 할지 알 수 없습니다 — 같은 한국어를 쓰는 사람끼리만 대화가 되는 것과 같은 원리.

---

## 종합

네트워크의 정의를 단어 단위로 분해하면 세 축이 보입니다:

| 축 | 의미 | 예시 |
|---|---|---|
| Host (노드) | 데이터를 주고받는 주체 | 내 노트북, `api.example.com` 서버, 프린터, 스마트폰 |
| Link (하드웨어 경로) | 데이터가 흐르는 물리/논리 경로 | LAN 케이블, Wi-Fi, 라우터·스위치 |
| Protocol (규칙) | 통신 규약 | TCP/IP, HTTP, DNS |

브라우저 개발자 관점에서 보면 Chrome DevTools의 Network 탭에서 보는 모든 요청이 "내 호스트(노트북)에서 다른 호스트(서버)로 HTTP라는 protocol을 사용해 data를 communicate하는" 한 사례입니다. `fetch()` 한 줄이 실제로는 이 정의를 그대로 실행하는 것.

오개념 예방: "host = 사람이 쓰는 컴퓨터"가 아닙니다. IP 주소를 가지고 양방향 통신하는 모든 장치가 host입니다 — Raspberry Pi, 스마트 TV, 무선 프린터도 모두 host. 사용자가 직접 만지지 않는 백엔드 서버야말로 가장 전형적인 host입니다.

이게 없으면 어떻게 되는가: protocol 합의가 없다면 비트 시퀀스를 받아도 무엇을 어디서 끊고 어떻게 해석할지 모릅니다. 인터넷 초창기에 다양한 사설 프로토콜이 난립했던 이유가 바로 이것이고, TCP/IP·HTTP라는 공통 protocol이 사실상 표준이 되면서 비로소 "전 세계 컴퓨터가 한 네트워크"라는 그림이 가능해졌습니다.

---

# 호스트란 무엇인가?

> A network host is a computer or other device connected to a computer network.
> Hosts are assigned at least one network address.

---

## 도입

앞서 "네트워크는 host들의 집합"이라고 했으니, 이번엔 그 host 한 명이 어떻게 정의되는지 봅니다. 핵심은 두 조건 — **네트워크에 연결되어 있고**, **주소를 적어도 하나 갖는다**입니다. 이 둘 중 하나라도 빠지면 host가 아닙니다.

---

## 본문

> A network host is a computer or other device connected to a computer network.

네트워크 호스트는 컴퓨터 네트워크에 연결된 컴퓨터 또는 그 외 장치다.

- **computer or other device**: 컴퓨터에 한정되지 않는다는 점이 핵심. 스마트폰, 프린터, 스마트 가전, IoT 센서 — 네트워크에 붙기만 하면 모두 host가 될 수 있습니다.
- **connected to a computer network**: 그냥 전원만 켜져 있는 게 아니라 **네트워크에 연결**되어 있어야 합니다. 같은 노트북이라도 비행기 모드면 host가 아니고, Wi-Fi에 붙으면 host가 됩니다.

> Hosts are assigned at least one network address.

호스트는 적어도 하나의 네트워크 주소를 할당받는다.

- **at least one**: 최소 하나. 여러 개 가질 수도 있습니다 — 노트북에 유선 LAN과 Wi-Fi가 동시에 붙어 있으면 IP가 두 개. 서버라면 IPv4·IPv6를 동시에 가진 경우도 흔합니다.
- **network address**: 네트워크 안에서 이 host를 식별하는 주소. 보통 IP 주소를 의미합니다. 이게 없으면 다른 host가 "어디로 데이터를 보내야 할지" 결정할 수 없습니다.

---

## 종합

host의 정의는 "연결 + 주소"라는 두 조건의 결합입니다. 둘 중 하나라도 빠지면 안 됩니다:

| 조건 | 빠지면 어떻게 되는가 |
|---|---|
| 네트워크에 연결됨 | 연결이 없으면 데이터가 오갈 경로 자체가 없음 |
| 적어도 하나의 주소 | 주소가 없으면 다른 host가 이 장치를 지목해 보낼 수 없음 |

브라우저 개발자가 Chrome DevTools에서 `fetch('https://api.example.com/users')`를 보낼 때, 양쪽 끝에 host 두 명이 있습니다 — 내 노트북(클라이언트 host)과 `api.example.com`이 가리키는 서버(서버 host). 둘 다 IP 주소를 갖고 있고 네트워크에 연결되어 있어서 통신이 성립합니다.

오개념 예방: "host = 서버"가 아닙니다. 클라이언트도 host고, 서버도 host입니다. host는 "역할"이 아니라 "네트워크 참여자" 자격을 가리키는 단어이고, 그 안에서 server·client 같은 역할이 갈립니다 (이건 다음 질문들의 주제).

이게 없으면 어떻게 되는가: 주소가 없는 장치는 받기만 가능하고 보내기는 거의 안 됩니다 — 더 정확히는, 받아도 응답할 곳을 알릴 방법이 없습니다. 그래서 spec이 "at least one network address"를 host의 필수 조건으로 박아둡니다. 식별되어야 보낼 수 있고, 식별되어야 받을 수 있습니다.

---

# 호스트의 IP 주소는 어떻게 설정되는가?

> Hosts have one or more IP addresses assigned to their network interfaces.
> The addresses are configured either manually by an administrator, or automatically at startup by means of the Dynamic Host Configuration Protocol (DHCP).

---

## 도입

host는 적어도 하나의 네트워크 주소를 가져야 한다고 했죠. 그럼 그 주소는 도대체 누가, 언제, 어떻게 정해줄까요? 답은 두 가지 경로뿐입니다 — 사람이 손으로 박거나, DHCP가 자동으로 꽂아주거나. 노트북 Wi-Fi가 카페에서 자동으로 붙는 것도, 회사 사내망 서버에 고정 IP가 박혀 있는 것도, 모두 이 두 경로 중 하나입니다.

---

## 본문

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

## 종합

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

---

# 호스트는 네트워크에서 어떤 역할을 하는가?

> A host may work as a server offering information resources, services, and applications to users or other hosts on the network.
> Network hosts are classified as server or client systems.
> Network hosts may also function as nodes in peer-to-peer applications, in which all nodes share and consume resources in an equipotent manner.

---

## 도입

host의 정의(연결 + 주소)는 잡혔지만, 같은 host라도 네트워크에서 하는 일은 다릅니다. 누군가는 자료를 내어주고(server), 누군가는 받아 쓰고(client), 또 누군가는 둘을 동시에 한다(peer). 이 역할 구분이 곧 우리가 매일 쓰는 클라이언트-서버 모델과 P2P의 본질입니다.

---

## 본문

> A host may work as a server offering information resources, services, and applications to users or other hosts on the network.

호스트는 네트워크상의 사용자나 다른 호스트들에게 정보 리소스·서비스·애플리케이션을 제공하는 서버로 동작할 수 있다.

- **may work as a server**: "할 수도 있다"는 표현이 중요. host가 곧 server는 아닙니다 — host는 자격, server는 그 자격으로 맡는 역할 중 하나.
- **offering ... to users or other hosts**: 제공 대상이 **사용자뿐 아니라 다른 host**입니다. 백엔드 API 서버는 사람이 아니라 다른 서버나 모바일 앱 같은 host에게 응답을 줍니다. `fetch()`를 호출하는 건 사람이 아니라 코드(host).

> Network hosts are classified as server or client systems.

네트워크 호스트는 서버 시스템과 클라이언트 시스템으로 분류된다.

- **classified as server or client**: 일반적인 두 분류. 자료를 내주는 쪽과 요청하는 쪽. 브라우저는 client host, `api.example.com`은 server host.

> Network hosts may also function as nodes in peer-to-peer applications,

호스트는 또한 P2P 애플리케이션의 노드로 기능할 수도 있다.

- **also function as**: server/client 외에 **추가로** 가능한 형태. 즉 P2P는 client-server 분류와 다른 별도 모델.
- **peer-to-peer applications**: 모든 참여자가 동격으로 연결되는 구조. 토렌트, WebRTC 기반 화상회의, 일부 블록체인 노드가 대표 예.

> in which all nodes share and consume resources in an equipotent manner.

여기서 모든 노드는 동등한 자격으로 자원을 공유하고 소비한다.

- **all nodes share and consume**: 모든 노드가 **동시에 제공자이자 소비자**. 클라이언트-서버처럼 한쪽이 주고 한쪽이 받는 게 아니라 양쪽 다 합니다.
- **equipotent**: 동등한 권한·역할. peer라는 단어 자체가 "동격"을 뜻합니다.

---

## 종합

host의 역할을 표로 정리하면:

| 모델 | 역할 분담 | 대표 사례 | 프론트엔드 개발자가 자주 마주치는 형태 |
|---|---|---|---|
| Client-Server | 한쪽은 요청, 한쪽은 응답 | HTTP API, 웹사이트 | `fetch()`로 백엔드 호출. 99%의 일상 개발 |
| P2P | 모든 노드가 동격 (제공+소비) | 토렌트, WebRTC, IPFS | 화상회의 앱에서 브라우저끼리 직접 영상 송수신 |

브라우저 입장에서 보면:
- `fetch('/api/users')` — 내 브라우저는 client, 서버는 server. 전형적 client-server.
- WebRTC로 화상통화 — 두 브라우저가 서로의 host에 영상을 직접 송수신. 양쪽 다 peer (받기만 하지도, 주기만 하지도 않음).

오개념 예방 하나: "host = server"라는 인식이 흔하지만 틀립니다. 내 노트북도 host고, 카페에 앉아 사이트를 띄운 그 순간 client host로 동작합니다. host는 자격, server·client·peer는 역할입니다.

User Annotation 보충: 식별되어야 보낼 수 있으니 host에는 반드시 주소가 적어도 하나 필요합니다. 즉 server든 client든 peer든 어떤 역할을 맡으려면 먼저 host로서 주소가 있어야 한다는 점이 이 모든 분류의 전제입니다.

이게 없으면 어떻게 되는가: P2P 모델이 없다면 모든 통신이 중앙 서버를 거쳐야 합니다. 토렌트가 강력했던 이유, WebRTC가 대규모 화상회의에서 중간 SFU를 줄일 수 있는 이유가 모두 P2P의 "서버 우회" 가능성에 있습니다 — 트래픽 분산과 단일 장애점 제거가 동시에 됩니다.

---

# 네트워크 노드와 호스트의 차이는?

> A network node is any device participating in a network.
> A host is a node that participates in user applications, either as a server, client, or both.
> A server is a type of host that offers resources to the other hosts.
> Typically, a server accepts connections from clients who request a service function.
>
> Every network host is a node, but not every network node is a host.
> Network infrastructure hardware, such as modems, Ethernet hubs, and network switches are not directly or actively participating in application-level functions, do not necessarily have a network address, and are not considered to be network hosts.

---

## 도입

지금까지 host를 "네트워크에 연결된 장치"로 봤지만 더 엄밀한 분류가 있습니다. 네트워크에는 host 외에도 라우터·스위치·허브 같은 인프라 장비가 있고, 이들도 네트워크 안에 있긴 하지만 host로 치지 않습니다. 그 구분 기준이 곧 node와 host의 차이입니다.

---

## 본문

> A network node is any device participating in a network.

네트워크 노드는 네트워크에 참여하는 모든 장치다.

- **any device**: 가장 넓은 범주. PC·서버·프린터뿐 아니라 라우터·스위치·허브·모뎀까지 전부 node. "네트워크에 발 들인 모든 것".
- **participating**: 단순히 케이블이 닿아있는 게 아니라 통신에 **참여**한다는 의미. 그냥 물리적으로 붙어 있는 것과 통신 흐름에 가담하는 것의 차이.

> A host is a node that participates in user applications, either as a server, client, or both.

호스트는 사용자 애플리케이션에 참여하는 노드다 — 서버로, 클라이언트로, 또는 둘 다로.

- **participates in user applications**: 핵심 기준. 단순히 패킷을 옮기는 게 아니라 **사용자 앱(브라우저·웹서버·앱 서버 등) 수준에서 통신에 가담**하는 노드. 이게 host의 자격.
- **either as a server, client, or both**: 역할은 server·client·peer 중 어느 것이든 가능. 다만 user application 층에서 의미 있는 동작을 한다는 점이 공통.

> A server is a type of host that offers resources to the other hosts.
> Typically, a server accepts connections from clients who request a service function.

서버는 다른 호스트에게 리소스를 제공하는 한 종류의 호스트다. 일반적으로 서버는 서비스 기능을 요청하는 클라이언트로부터 연결을 받아들인다.

- **a type of host**: server는 host의 부분집합이지 별개 개념이 아닙니다. host > server.
- **accepts connections**: 먼저 손을 내미는 건 client. 서버는 받는 쪽. `app.listen(3000)` 같은 코드가 바로 이 "accepts"의 구현.

> Every network host is a node, but not every network node is a host.

모든 네트워크 호스트는 노드지만, 모든 네트워크 노드가 호스트인 것은 아니다.

- **포함관계**: host ⊂ node. 즉 host는 node의 좁은 부분집합. 라우터는 node지만 host는 아니다.

> Network infrastructure hardware, such as modems, Ethernet hubs, and network switches are not directly or actively participating in application-level functions, do not necessarily have a network address, and are not considered to be network hosts.

모뎀, 이더넷 허브, 네트워크 스위치 같은 네트워크 인프라 하드웨어는 애플리케이션 레벨 기능에 직접·능동적으로 참여하지 않으며, 반드시 네트워크 주소를 갖지도 않고, 네트워크 호스트로 간주되지 않는다.

- **infrastructure hardware**: 통신 경로를 깔아주는 인프라 장비. 모뎀·허브·스위치 등.
- **not ... participating in application-level functions**: HTTP 요청·응답 같은 앱 수준 동작에 가담하지 않습니다. 단지 비트·프레임을 받아 다른 포트로 흘려보낼 뿐.
- **do not necessarily have a network address**: IP 주소가 **반드시 필요하지 않다**는 점이 결정적. host 정의는 "적어도 하나의 네트워크 주소"였는데, 이 조건을 안 갖춰도 되는 장비가 있다는 뜻 — 그래서 host로 못 들어갑니다.

---

## 종합

분류를 한눈에 보면:

| 구분 | 예시 | host 여부 | 네트워크 주소 필요? | 어느 OSI 계층에서 동작? |
|---|---|---|---|---|
| Host | PC, 노트북, 서버, 스마트폰, 프린터 | O | 필수 (적어도 하나) | L7 (Application)까지 |
| Node (host 아님) | 허브, 스위치, 일부 모뎀 | X | 필수 아님 | L1 (허브) ~ L2 (스위치) |
| Node (그리고 host도 아님이지만 주소 가짐) | L3 라우터 | X (전형적으론 host로 안 침) | 가짐 (관리·라우팅용) | L3 (Network) |

브라우저 개발자가 Chrome DevTools Network 탭에서 보는 `Remote Address: 142.250.191.78`의 그 IP는 server host의 IP입니다. 그 둘 사이에 있는 라우터·스위치·CDN 엣지 노드들은 node지만 우리 코드 입장에서는 보이지 않고, 그들 중 일부는 IP조차 안 갖습니다.

오개념 예방: "라우터도 host 아닌가?"는 자주 나오는 헷갈림입니다. 라우터는 IP 주소를 갖고 있긴 하지만(인터페이스마다 하나씩), 그 IP는 라우팅·관리 용도이지 user application의 endpoint가 아닙니다. 그래서 정의상 host로 분류하지 않습니다 — "application-level functions에 능동적으로 참여하지 않는다"는 그 조건에 걸립니다.

이게 없으면 어떻게 되는가: node와 host를 구분하지 않으면 "네트워크에 있는 모든 장치"가 한 묶음이 되어버립니다. 그러면 보안 정책·관리 도구·문서 어디서든 "PC에 열려있는 포트를 막아라"라는 지침이 라우터·스위치에까지 무차별 적용되어버립니다. 이 두 개념을 분리해두기 때문에 "host에 대한 방화벽 규칙"과 "라우터 ACL"이 별도 도메인으로 다뤄질 수 있습니다.

```
            [node ⊃ host ⊃ server 포함관계]

   +-----------------------------------------------------+
   | NODE                                                |
   |   "네트워크에 참여하는 모든 장치"                   |
   |                                                     |
   |   [node 이지만 host 아님]                           |
   |     - 허브, 스위치, 일부 모뎀                       |
   |     - 라우터 (IP는 갖지만 app endpoint 아님)        |
   |                                                     |
   |   +-------------------------------------------+     |
   |   | HOST                                      |     |
   |   |   "user application에 참여 + 주소 보유"   |     |
   |   |                                           |     |
   |   |   [host 이지만 server 아님]               |     |
   |   |     - 클라이언트 PC, 스마트폰             |     |
   |   |     - P2P 노드 (peer 역할)                |     |
   |   |                                           |     |
   |   |   +---------------------------------+     |     |
   |   |   | SERVER                          |     |     |
   |   |   |   "다른 host에게 자원 제공"     |     |     |
   |   |   |   - 웹 서버, DB 서버, 프린터    |     |     |
   |   |   +---------------------------------+     |     |
   |   +-------------------------------------------+     |
   +-----------------------------------------------------+

   모든 host는 node지만, 모든 node가 host는 아니다.
   모든 server는 host지만, 모든 host가 server는 아니다.
```
