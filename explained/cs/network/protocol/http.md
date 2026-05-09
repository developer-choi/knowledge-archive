# HTTP(Hypertext Transfer Protocol)란 무엇인가?

> HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite for distributed, collaborative, hypermedia information systems.
> HTTP is the foundation of data communication for the World Wide Web, where hypertext documents include hyperlinks to other resources that the user can easily access, for example by a mouse click or by tapping the screen in a web browser.

---

## 도입

브라우저 주소창에 `https://example.com`을 치면 어떻게 페이지가 떠오르는지 그 첫 단계가 HTTP입니다. HTTP는 OSI 7계층 중 가장 위, 애플리케이션 계층의 프로토콜입니다. 그 아래에 TCP가 있고 또 그 아래에 IP가 있습니다 — HTTP는 그 위에 얹혀서 "어떤 형식으로 요청하고 응답할지"의 규칙만 정의합니다.

---

## 본문

> HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite

HTTP는 인터넷 프로토콜 모음(TCP/IP) 중 애플리케이션 계층에 속하는 프로토콜이다.

- **application layer**: 가장 위 계층. 실제 애플리케이션(브라우저, 웹서버)이 다루는 데이터 형식과 의미를 정의합니다. 패킷을 어떻게 쪼개고 어디로 보낼지는 아래 계층(TCP, IP)이 알아서 합니다.
- **Internet protocol suite**: TCP/IP 모음을 가리키는 정식 명칭. HTTP는 그 안의 한 멤버이지 단독 표준이 아닙니다.

> for distributed, collaborative, hypermedia information systems.

분산형, 협력형, 하이퍼미디어 정보 시스템을 위한 것이다.

- **distributed**: 한 서버에 모든 자원이 있는 게 아니라 여러 서버에 흩어져 있다는 뜻. `<img src="https://cdn.example.com/...">`처럼 페이지 안의 이미지가 다른 서버에서 와도 정상 동작합니다.
- **hypermedia**: 텍스트뿐 아니라 이미지·영상·오디오까지 포함하고 서로 링크로 연결된 미디어. 단순 텍스트 전송 프로토콜이 아니라 멀티미디어 전반을 다룹니다.

> HTTP is the foundation of data communication for the World Wide Web,

HTTP는 월드와이드웹(WWW)의 데이터 통신 기반이다.

- **foundation**: WWW를 떠받치는 토대. 이게 없으면 웹페이지를 가져올 표준 방법이 없습니다. 다른 프로토콜(FTP, gopher)도 한때 후보였지만 HTTP가 표준으로 자리잡았습니다.

> where hypertext documents include hyperlinks to other resources that the user can easily access, for example by a mouse click or by tapping the screen in a web browser.

하이퍼텍스트 문서는 다른 리소스로 연결되는 하이퍼링크를 포함하며, 사용자는 브라우저에서 마우스 클릭이나 화면 터치로 쉽게 접근할 수 있다.

- **hyperlinks**: 다른 리소스로 점프할 수 있는 연결. `<a href="...">`가 그 구현체. 클릭 한 번으로 다른 서버의 다른 문서를 가져오는 게 웹의 본질입니다.
- **easily access**: 사용자는 URL을 외울 필요 없이 클릭만 합니다. 브라우저가 그 클릭을 HTTP 요청으로 변환해 서버에 보냅니다.

---

## 종합

HTTP를 한 문장으로 정리하면 "브라우저가 서버에게 리소스를 요청하고, 서버가 응답하는 규칙"입니다. 핵심은 세 가지 키워드입니다.

| 키워드 | 의미 | 실무 위치 |
|---|---|---|
| application layer | TCP/IP 위에서 의미·형식을 정의 | 브라우저, 웹서버 |
| hypermedia | HTML, 이미지, JSON, 비디오 모두 운반 | `Content-Type`으로 타입 명시 |
| hyperlinks | 다른 리소스로 점프 가능 | `<a>`, `<img>`, `<script src>` |

Chrome DevTools의 Network 탭을 열면 보이는 모든 요청이 HTTP 메시지입니다. `fetch('/api/users')` 한 줄을 실행하면 JS 런타임이 HTTP 요청 메시지를 만들고, 브라우저가 그걸 TCP 위에 실어 서버로 보냅니다 — 이 모든 것이 application layer 안에서 일어나는 일입니다.

오개념 예방: HTTP는 패킷을 직접 전송하지 않습니다. "패킷을 어떻게 신뢰성 있게 보낼지"는 TCP의 일이고, HTTP는 그 위에서 "메시지의 형식과 의미"만 정합니다. 그래서 HTTP/3에서 TCP 대신 QUIC을 쓸 수 있는 것도 — 메시지 형식은 그대로 두고 아래 계층만 갈아끼울 수 있기 때문입니다.

Official Annotation 보충: HTTP는 단순한 웹 브라우저-서버 통신만이 아니라 "확장 가능한(extensible) 프로토콜"로 설계됐습니다. 새 헤더의 의미를 클라이언트와 서버가 합의하기만 하면 새 기능을 추가할 수 있어서, 머신 간 통신, REST API, 서비스 메시 등으로 영역을 넓혀왔습니다.

---

# HTTP는 어떤 통신 모델을 사용하며, 하나의 트랜잭션은 어떻게 구성되는가?

> HTTP is a request-response protocol in the client-server model.
> A transaction starts with a client submitting a request to the server, the server attempts to satisfy the request and returns a response to the client that describes the disposition of the request and optionally contains a requested resource such as an HTML document or other content.

---

## 도입

`fetch('/api/users')` 한 줄을 실행하면 일어나는 일을 떠올려 보세요. 클라이언트(브라우저)가 무언가를 보내고, 서버가 답을 돌려줍니다. 이 단순한 1:1 교환이 HTTP의 통신 모델입니다. 더 복잡한 양방향 스트림이 아니라 "요청 → 응답" 한 쌍이 단위입니다.

---

## 본문

> HTTP is a request-response protocol in the client-server model.

HTTP는 클라이언트-서버 모델에서의 요청-응답 프로토콜이다.

- **request-response**: 한 쌍이 단위입니다. 요청 1개에 응답 1개. WebSocket의 양방향 자유 메시지 교환과는 다른 구조.
- **client-server model**: 역할이 비대칭입니다. 항상 클라이언트(브라우저)가 먼저 말을 걸고, 서버는 듣고 답하는 입장. 서버가 먼저 클라이언트에게 말을 걸 수 없습니다.

> A transaction starts with a client submitting a request to the server,

트랜잭션은 클라이언트가 서버에 요청을 보내는 것으로 시작한다.

- **transaction**: 요청-응답 한 쌍을 묶어 부르는 단위. DevTools Network 탭의 한 줄이 보통 한 트랜잭션입니다.
- **starts with a client**: 시작점이 항상 클라이언트입니다. 이게 없으면 서버는 클라이언트가 무엇을 원하는지 알 수 없어 아무것도 못 합니다.

> the server attempts to satisfy the request

서버는 요청을 만족시키려 시도한다.

- **attempts**: "시도"라는 단어가 중요합니다 — 항상 성공하는 게 아니라 실패할 수도 있습니다. 그래서 응답에 상태 코드(200, 404, 500 등)가 필요한 것.
- **satisfy**: 요청이 원하는 리소스를 찾고, 처리하고, 결과를 만드는 과정. 단순 파일 반환부터 DB 조회·계산까지 모든 게 여기 들어갑니다.

> and returns a response to the client that describes the disposition of the request

요청의 처리 결과(disposition)를 기술하는 응답을 클라이언트에게 반환한다.

- **disposition**: "처리 결과의 성격". 성공/실패/리다이렉트인지 등 상태 코드(2xx, 3xx, 4xx, 5xx)로 표현됩니다.
- **describes**: 응답은 단순 데이터 덩어리가 아니라 "이 요청이 어떻게 처리됐다"라는 설명을 함께 담습니다.

> and optionally contains a requested resource such as an HTML document or other content.

선택적으로 요청된 리소스(HTML 문서나 기타 콘텐츠)를 포함한다.

- **optionally**: 본문(body)은 있을 수도 없을 수도 있습니다. `204 No Content`나 `304 Not Modified`는 본문이 비어 있습니다.
- **HTML document or other content**: HTML뿐 아니라 JSON, 이미지, 비디오 등 어떤 형식이든 가능. `Content-Type` 헤더로 종류를 알립니다.

---

## 종합

HTTP 트랜잭션의 4가지 구성 요소를 묶으면:

| 단계 | 주체 | 내용 |
|---|---|---|
| 1. 요청 시작 | 클라이언트 | 메서드 + 경로 + 헤더 + (옵션) 본문 |
| 2. 처리 시도 | 서버 | 라우팅, DB 조회, 비즈니스 로직 |
| 3. 응답 반환 | 서버 | 상태 코드 + 헤더 + (옵션) 본문 |
| 4. 트랜잭션 종료 | 양쪽 | 연결은 유지될 수도, 닫힐 수도 |

JS 코드와 매핑하면:

```js
const res = await fetch('/api/users', { method: 'GET' });
//          └── 1: 클라이언트가 GET 요청 송신 (서버는 시도 → 응답 생성)
console.log(res.status);     // 3: disposition (예: 200)
const data = await res.json(); // 3: 본문 (요청된 리소스)
```

오개념 예방: "HTTP는 양방향 통신이다"는 잘못된 이해입니다. 정확히는 "클라이언트가 시작하는 단방향 요청에 서버가 답하는 구조"입니다. 서버가 클라이언트에게 먼저 데이터를 밀어넣고 싶다면 별도 메커니즘(SSE, WebSocket, HTTP/2 Server Push)이 필요합니다 — Official Annotation이 "It is never the server"라고 못박는 이유가 이 때문입니다.

이게 없으면 어떻게 되는가: 만약 트랜잭션 단위가 아니라 자유 양방향 스트림이었다면, 서버가 처리 중인 요청과 클라이언트가 새로 보낸 요청을 어떻게 묶을지 별도 식별자가 필요했을 것입니다. 요청-응답 1:1 모델은 그런 복잡도 없이도 통신을 추적 가능하게 해줍니다 — 이 단순함이 HTTP가 30년 넘게 표준으로 살아남은 이유 중 하나입니다.

Official Annotation 보충: 클라이언트와 서버는 "스트림이 아닌 개별 메시지"를 교환합니다. 이 메시지 단위 특성이 stateless 설계의 구조적 기반입니다 — 메시지 하나마다 자기 자신만으로 완결되어야 한다는 제약이 stateless를 가능하게 합니다.

---

# HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?

> HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.
> High-traffic websites often benefit from web cache servers that deliver content on behalf of upstream servers to improve response time.
> Web browsers cache previously accessed web resources and reuse them, whenever possible, to reduce network traffic.
> HTTP proxy servers at private network boundaries can facilitate communication for clients without a globally routable address, by relaying messages with external servers.

---

## 도입

브라우저에서 `https://example.com`을 요청하면, 패킷이 곧장 example.com 서버로 도달한다고 생각하기 쉽습니다. 하지만 실제로는 회사 프록시, ISP 캐시, CDN 노드, 방화벽을 거쳐 도착합니다. HTTP는 이런 중간 노드들을 끼워 넣을 수 있도록 처음부터 설계됐습니다 — 그래야만 웹이 지금의 규모로 성장할 수 있었기 때문입니다.

---

## 본문

> HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.

HTTP는 클라이언트와 서버 사이의 통신을 개선하거나 가능하게 만들기 위해 중간 네트워크 요소를 허용하도록 설계됐다.

- **intermediate network elements**: 클라이언트와 서버 사이에 끼어드는 노드들. 프록시, 캐시 서버, 게이트웨이가 대표적.
- **improve or enable**: 두 가지 목적. 개선(improve, 더 빠르게)과 가능하게 만들기(enable, 없으면 통신이 아예 안 됨). 캐시는 전자, 프록시는 후자.

> High-traffic websites often benefit from web cache servers that deliver content on behalf of upstream servers to improve response time.

트래픽이 많은 사이트는 응답 시간을 개선하기 위해 원본 서버 대신 콘텐츠를 전달하는 웹 캐시 서버의 도움을 받는다.

- **web cache servers**: 원본을 대신해 콘텐츠를 전달하는 서버. CDN(Cloudflare, CloudFront, Akamai)이 이 역할의 대표적인 구현체.
- **on behalf of upstream servers**: 원본 서버를 대신해서. 사용자는 가까운 CDN 노드에서 응답받고, 원본 서버는 매번 호출되지 않습니다.
- **improve response time**: 사용자에 가까운 곳에서 응답하므로 네트워크 왕복이 짧아집니다. 한국 사용자가 미국 서버 대신 도쿄 CDN에서 받는 것 — 100ms vs 300ms.

> Web browsers cache previously accessed web resources and reuse them, whenever possible, to reduce network traffic.

웹 브라우저는 이전에 접근한 웹 리소스를 캐시하고 가능할 때마다 재사용하여 네트워크 트래픽을 줄인다.

- **browsers cache**: 브라우저 자체도 중간 노드 역할을 합니다. Chrome DevTools Network 탭에서 "Disk cache" / "Memory cache"로 표시되는 것이 그것.
- **whenever possible**: `Cache-Control` 헤더가 허용하는 한. 캐시 가능 여부, 유효 기간은 서버가 응답 헤더로 알립니다.
- **reduce network traffic**: 같은 이미지를 두 번 요청하지 않아도 되니 트래픽 절감 + 화면 표시도 즉시.

> HTTP proxy servers at private network boundaries can facilitate communication for clients without a globally routable address, by relaying messages with external servers.

사설 네트워크 경계에 있는 HTTP 프록시 서버는 공인 주소가 없는 클라이언트들이 외부 서버와 메시지를 주고받게 중계한다.

- **private network boundaries**: 회사·학교 LAN 같은 사설망과 인터넷이 만나는 경계. 여기에 프록시가 위치합니다.
- **without a globally routable address**: 공인 IP가 없는 사설 IP(192.168.x.x 등). 인터넷에서 직접 접근 불가능합니다.
- **relaying messages**: 클라이언트의 요청을 받아 외부 서버에 다시 보내고, 응답을 받아 클라이언트에 전달. 이게 없으면 사설망 안의 PC는 인터넷을 못 씁니다.

---

## 종합

HTTP의 중간 노드 4가지 유형을 정리하면:

| 노드 | 위치 | 목적 | 실무 예 |
|---|---|---|---|
| 브라우저 캐시 | 클라이언트 | 트래픽 절감 | Chrome 디스크 캐시 |
| CDN(웹 캐시) | 사용자 근처 | 응답 시간 단축 | Cloudflare, CloudFront |
| 프록시 | 네트워크 경계 | 외부 통신 중계 | 회사 프록시 서버 |
| 리버스 프록시 | 서버 앞단 | 부하 분산, SSL 종단 | nginx, AWS ALB |

이게 없으면 어떻게 되는가: 만약 HTTP가 1:1 직접 통신만 허용했다면 — 모든 사용자가 매번 원본 서버까지 왕복해야 하므로 글로벌 서비스의 응답 시간이 1초를 훌쩍 넘었을 것이고, 같은 이미지를 100명이 100번 다운로드하는 등 트래픽 낭비가 막대했을 것입니다. CDN과 캐시가 가능한 이유는 HTTP가 처음부터 "중간 노드가 들여다보고 끼어들어도 되는" 구조를 허용했기 때문입니다.

오개념 예방: 캐시는 서버가 100% 제어할 수 있다는 보장이 있지는 않습니다. `Cache-Control: no-store`로 캐시를 거부할 수 있지만, 일단 응답이 캐시 가능하게 나가면 중간 노드가 이를 어떻게 활용하는지는 노드의 구현에 맡겨집니다. 그래서 `private` vs `public`, `s-maxage` 같은 세부 지시어가 필요합니다.

Official Annotation 보충: 프록시는 transparent(요청을 그대로 전달)와 non-transparent(요청을 변경하여 전달)로 나뉩니다. transparent 프록시의 대표 예가 캐시 서버 — 원본을 변경하지 않고 빠른 응답만 제공. non-transparent의 예는 광고 차단 프록시 — 응답에서 광고를 제거하고 전달. 어느 쪽이든 클라이언트와 서버 모두 모르게 동작할 수 있다는 점이 핵심입니다.

```
              [HTTP 요청 경로의 중간 노드 위치]

   [클라이언트 측]                    [서버 측]

   +-----------+
   | 브라우저  |
   |  (fetch)  |
   +-----+-----+
         |
         v
   +-----------+
   | 브라우저  |  최근 본 응답 즉시 반환
   |  캐시     |  (Disk / Memory)
   +-----+-----+
         | miss
         v
   +-----------+
   | 회사·ISP  |  사설망 -> 인터넷 중계
   | 프록시    |  공인 IP 없는 클라이언트도 통신 가능
   +-----+-----+
         |
         v
   +-----------+
   |  CDN 엣지 |  사용자 근처에서 캐시 응답
   |  (Cloud-  |  origin 부담 절감 + 짧은 RTT
   |  flare 등)|
   +-----+-----+
         | miss (origin 까지)
         v
   +-----------+
   | 리버스    |  부하 분산 / SSL 종단 / 라우팅
   | 프록시    |  (nginx, AWS ALB)
   +-----+-----+
         |
         v
   +-----------+
   | 원본 서버 |
   | (origin)  |
   +-----------+

   각 노드는 HTTP 메시지를 보고 끼어들 수 있다.
   hop-by-hop 헤더는 노드에서 소비, end-to-end는 통과.
```

---

# HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?

> To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions, some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

---

## 도입

앞에서 봤듯 HTTP 메시지는 클라이언트 → (프록시) → (캐시) → (또 다른 노드) → 서버를 거칩니다. 그런데 모든 헤더가 이 모든 노드에게 다 의미 있는 게 아닙니다. 어떤 헤더는 "지금 직접 연결된 다음 노드까지만" 유효하고, 어떤 헤더는 "출발지부터 도착지까지 끝-끝" 의미를 가집니다. 이 구분이 hop-by-hop과 end-to-end입니다.

---

## 본문

> To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions,

중간 HTTP 노드들(프록시 서버, 웹 캐시 등)이 자신의 기능을 수행할 수 있도록.

- **intermediate HTTP nodes**: 클라이언트와 최종 서버 사이의 모든 노드. 프록시, 캐시, 게이트웨이, 로드 밸런서.
- **accomplish their functions**: 각 노드는 고유한 역할이 있습니다 — 캐시는 캐싱, 프록시는 중계. 이 역할을 수행하려면 일부 헤더는 그 노드에서 끝나야 합니다.

> some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop

일부 HTTP 헤더는 hop-by-hop으로 관리된다.

- **hop**: 한 노드에서 다음 노드로 한 번 점프하는 것. 클라이언트 → 프록시가 1 hop, 프록시 → 서버가 또 1 hop.
- **hop-by-hop**: 각 hop마다 처리되고, 다음 hop으로는 전달되지 않는 헤더. 예: `Connection`, `Keep-Alive`, `Transfer-Encoding`, `Upgrade`. 프록시는 이 헤더를 보고 자기 동작을 결정한 뒤, 다음 노드로는 자신의 새 `Connection` 헤더를 붙여 보냅니다.

> whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

반면 다른 HTTP 헤더는 end-to-end로 관리되는데, 이는 출발지 클라이언트와 목적지 웹 서버에 의해서만 관리된다.

- **end-to-end**: 출발지(end)부터 도착지(end)까지. 중간 노드는 건드리지 않고 그대로 전달해야 합니다.
- **source client and target web server**: 양쪽 끝점만 관리 권한이 있습니다. 예: `Content-Type`, `Authorization`, `User-Agent`, `Accept`. 중간 프록시가 `Authorization` 헤더를 마음대로 바꾸면 보안이 무너집니다.
- **managed only by**: 중간에서 변경 금지. 다만 읽는 것은 가능합니다 (HTTP면) — 그래서 HTTPS가 필요한 것.

---

## 종합

hop-by-hop과 end-to-end의 비교:

| 분류 | 의미 | 대표 헤더 | 중간 노드의 권한 |
|---|---|---|---|
| hop-by-hop | 한 hop에서 끝 | `Connection`, `Keep-Alive`, `Transfer-Encoding`, `TE`, `Trailer`, `Proxy-Authorization` | 읽고, 처리하고, 변경하고, 다음 hop에 전달 안 함 |
| end-to-end | 출발지~도착지 | `Content-Type`, `Authorization`, `Accept`, `User-Agent`, `Cache-Control`(대부분) | 그대로 전달해야 함 (읽는 건 가능) |

JS 개발자에게 와닿는 예시:

```http
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGc...    ← end-to-end (서버까지 그대로)
Connection: keep-alive               ← hop-by-hop (다음 프록시에서 소비)
Accept: application/json             ← end-to-end
```

`fetch()`로 요청을 보낼 때 `Authorization` 헤더가 회사 프록시를 거쳐서도 그대로 서버에 도달하는 이유는 end-to-end로 분류되어 있기 때문입니다. 만약 프록시가 마음대로 토큰을 바꾼다면 인증이 깨지겠죠.

이게 없으면 어떻게 되는가: 두 분류가 없다면 — 프록시가 `Connection: keep-alive`(클라이언트-프록시 간 연결 유지)를 다음 hop(프록시-서버)에까지 그대로 전달해버리면 의미가 꼬입니다. 클라이언트는 프록시와 keep-alive를 원했는데 서버까지 keep-alive가 전파되어 자원이 잘못 점유될 수 있습니다. hop-by-hop 분류는 "이 헤더는 너만 읽고 끝내라"라는 명시적 신호입니다.

오개념 예방: HTTPS에서는 중간 노드가 페이로드를 읽을 수 없습니다. 하지만 hop-by-hop/end-to-end 구분은 여전히 의미 있습니다 — TLS 종단(SSL termination) 지점에서 평문이 되어 노드가 헤더를 처리할 때, 이 분류가 적용됩니다. 사내 프록시·역방향 프록시(nginx, AWS ALB)에서 자주 마주칩니다.

AI Annotation 보충: `Connection`, `Keep-Alive`는 "나와 너 사이의 TCP 연결을 어떻게 다룰까"에 대한 신호이므로 다음 노드로 넘기면 안 됩니다. 반면 `Content-Type`, `Authorization`은 "내 요청이 무엇이며 누구의 권한인가"라는 의미이므로 끝까지 가야 합니다.

---

# HTTP/1.0에서 HTTP/1.1로 오면서 해결한 핵심 문제는?

> In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.
> In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests (i.e. of HTML pages, frames, images, scripts, stylesheets, etc.).
> HTTP/1.1 communications therefore experience less latency as the establishment of TCP connections presents considerable overhead, especially under high traffic conditions.

---

## 도입

HTML 한 페이지를 표시하려면 보통 수십 개의 리소스(CSS, JS, 이미지, 폰트)가 필요합니다. HTTP/1.0 시절에는 이 리소스 하나당 TCP 연결을 새로 열고 닫았는데, 이게 매우 비효율적이었습니다. HTTP/1.1은 한 번 연결한 TCP를 여러 요청에 재사용할 수 있게 해서 이 문제를 해결했습니다.

---

## 본문

> In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.

HTTP/1.0에서는 리소스 요청마다 같은 서버로 별도의 TCP 연결을 만든다.

- **separate TCP connection**: 매번 새 TCP 소켓을 열어야 한다는 뜻. 3-way handshake(SYN → SYN-ACK → ACK)를 매번 수행.
- **for every resource request**: 이미지 1개, CSS 1개, JS 1개마다 따로 연결. HTML 안에 이미지 10개가 있으면 11번 열고 닫습니다.

> In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests (i.e. of HTML pages, frames, images, scripts, stylesheets, etc.).

HTTP/1.1에서는 대신 하나의 TCP 연결을 여러 리소스 요청에 재사용할 수 있다.

- **reused**: 한번 만든 연결을 닫지 않고 다음 요청에 또 씀. 이 동작을 가능하게 하는 메커니즘이 keep-alive(persistent connection).
- **multiple resource requests**: HTML, 이미지, CSS, JS 등 여러 리소스를 같은 연결로 받습니다. 단, HTTP/1.1에서는 한 번에 하나씩 순차적으로 주고받아야 합니다(HTTP/2부터 멀티플렉싱).

> HTTP/1.1 communications therefore experience less latency as the establishment of TCP connections presents considerable overhead,

HTTP/1.1 통신은 TCP 연결 수립이 상당한 오버헤드를 갖기 때문에 더 적은 지연을 경험한다.

- **less latency**: 사용자가 체감하는 응답 시간이 짧아집니다. 페이지 로드가 빨라지는 직접적 효과.
- **establishment of TCP connections**: TCP 3-way handshake. 서버가 멀리 있을수록 RTT(왕복 시간)가 커지므로 매번 handshake하면 그만큼 손해.
- **considerable overhead**: 단순 데이터 전송 시간 외에 추가로 드는 시간. 한국에서 미국 서버까지 RTT가 150ms라면 handshake에만 150ms를 쓰는 셈.

> especially under high traffic conditions.

특히 고트래픽 환경에서.

- **high traffic**: 요청 수가 많을수록 연결 재사용의 이득이 누적됩니다. 100개의 요청 = 100번 handshake 절약.

---

## 종합

HTTP/1.0과 HTTP/1.1의 연결 처리 비교:

| 항목 | HTTP/1.0 | HTTP/1.1 |
|---|---|---|
| TCP 연결 | 요청마다 새로 | 한 번 만들어 재사용 |
| handshake 횟수 | 리소스 수만큼 | 1회 (또는 동시 6개 등 제한 내) |
| TCP slow-start | 매번 처음부터 | 워밍업된 상태 유지 |
| 연결 종료 | 매 응답 후 즉시 | keep-alive로 유지 |

브라우저에서 이미지 10개가 있는 페이지를 로드한다고 해봅시다:

- HTTP/1.0: 11번 (HTML 1 + 이미지 10) handshake + slow-start. 서버 RTT 100ms면 handshake 오버헤드만 1100ms.
- HTTP/1.1: 1번 handshake로 끝. 같은 RTT면 handshake 오버헤드 100ms로 단축.

이게 없으면 어떻게 되는가: keep-alive가 없다면 — 매 요청마다 TCP slow-start의 처음부터 시작합니다. slow-start는 네트워크 혼잡을 피하기 위해 처음에는 적은 데이터만 보내다가 점점 늘리는 방식인데, 매번 새로 연결하면 늘어난 속도를 못 써먹습니다. 연결을 재사용하면 한 번 워밍업된 상태를 그대로 활용할 수 있어 throughput이 훨씬 좋습니다.

오개념 예방: HTTP/1.1의 연결 재사용은 "한 번에 여러 요청을 보낼 수 있다"가 아니라 "하나씩 차례로 보내되 연결은 유지한다"입니다. 한 요청의 응답이 완전히 와야 다음 요청을 보낼 수 있어 head-of-line blocking이 여전히 존재합니다. 이를 극복하려고 시도된 것이 파이프라이닝(실패)이고, 근본적으로 해결한 것이 HTTP/2의 멀티플렉싱입니다.

AI Annotation 보충: HTML 안에 이미지 10개가 있으면 HTTP/1.0에서는 TCP 연결을 11번 열고 닫아야 했습니다. 브라우저가 이를 보완하려고 같은 도메인에 동시 6~8개 연결을 여는 트릭을 썼지만, 이 자체가 서버 부하를 가중시켰습니다. HTTP/1.1의 keep-alive는 이 트릭의 필요성을 줄였고, HTTP/2는 아예 트릭이 필요 없게 만들었습니다.

---

# HTTP/1.0까지는 왜 요청마다 TCP 연결을 새로 맺어야 했고, HTTP/1.1의 keep-alive는 이를 어떻게 해결했는가?

> In HTTP/1.0, the TCP/IP connection should always be closed by server after a response has been sent.
> In HTTP/1.1, a keep-alive-mechanism was officially introduced so that a connection could be reused for more than one request/response.
> Such persistent connections reduce request latency perceptibly because the client does not need to re-negotiate the TCP 3-Way-Handshake connection after the first request has been sent.
> Another positive side effect is that, in general, the connection becomes faster with time due to TCP's slow-start-mechanism.

---

## 도입

앞 질문에서 HTTP/1.1이 연결을 재사용한다는 큰 그림을 봤습니다. 이번엔 그 메커니즘이 구체적으로 어떻게 동작하는지 봅니다. keep-alive는 단순히 "연결을 닫지 마"라는 약속이지만, 그 한 줄 약속이 가져오는 성능 이득은 두 가지 — handshake 회피와 slow-start 워밍업 유지입니다.

---

## 본문

> In HTTP/1.0, the TCP/IP connection should always be closed by server after a response has been sent.

HTTP/1.0에서는 서버가 응답을 보낸 뒤 항상 TCP/IP 연결을 닫아야 했다.

- **always be closed**: 예외 없이 매번. 응답 전송 직후 서버가 FIN 패킷을 보내 연결 종료.
- **by server**: 닫는 주체는 서버. 클라이언트는 다음 요청을 위해 또 새 연결을 열어야 합니다.

> In HTTP/1.1, a keep-alive-mechanism was officially introduced so that a connection could be reused for more than one request/response.

HTTP/1.1에서는 하나의 연결이 여러 요청/응답에 재사용될 수 있도록 keep-alive 메커니즘이 공식적으로 도입됐다.

- **keep-alive**: 직역하면 "살려두기". 응답 후에도 TCP 연결을 닫지 않고 다음 요청을 기다림.
- **officially introduced**: HTTP/1.0에서도 비공식 확장으로 존재했지만, HTTP/1.1에서 표준에 정식 포함. 이제 별도 헤더 없이도 기본 동작이 keep-alive.
- **more than one request/response**: 한 연결로 여러 트랜잭션. HTML 1개 + 이미지 10개 = 11개 요청을 같은 연결에서.

> Such persistent connections reduce request latency perceptibly

이러한 영속 연결(persistent connections)은 요청 지연을 눈에 띄게 줄여준다.

- **persistent connections**: keep-alive의 다른 이름. "유지되는 연결".
- **perceptibly**: 사용자가 느낄 만큼. 페이지 로딩이 0.5초 빨라지는 등 체감 가능한 차이.

> because the client does not need to re-negotiate the TCP 3-Way-Handshake connection after the first request has been sent.

왜냐하면 클라이언트가 첫 요청 이후로 TCP 3-Way-Handshake 연결을 다시 협상할 필요가 없기 때문이다.

- **re-negotiate**: 다시 협상. 매번 SYN → SYN-ACK → ACK 3단계를 반복하지 않아도 됩니다.
- **3-Way-Handshake**: TCP 연결을 시작할 때 클라이언트와 서버가 1.5 RTT(왕복) 동안 주고받는 절차. 데이터를 한 줄도 보내기 전에 시간 소비.
- **after the first request**: 첫 요청에서만 handshake. 이후 N개의 요청은 그 연결을 그냥 씀.

> Another positive side effect is that, in general, the connection becomes faster with time due to TCP's slow-start-mechanism.

또 다른 긍정적 부수 효과는 TCP의 slow-start 메커니즘 덕분에 일반적으로 연결이 시간이 갈수록 빨라진다는 것이다.

- **becomes faster with time**: 같은 연결을 오래 쓸수록 빨라집니다. 이상하게 들리지만 TCP의 동작 특성 때문입니다.
- **slow-start**: TCP가 네트워크 혼잡을 피하려고 처음에는 작은 윈도우(예: 10 패킷)로 시작해서 ACK가 올 때마다 윈도우를 키우는 방식. 매번 새 연결이면 매번 처음부터 시작 = 매번 느림.

---

## 종합

keep-alive의 두 가지 이득을 시간 단위로 보면:

| 항목 | 새 연결마다 | 재사용 (keep-alive) |
|---|---|---|
| 3-way handshake | 매번 1 RTT | 첫 1회만 |
| slow-start window | 매번 작게 시작 | 한 번 키우면 유지 |
| TLS handshake (HTTPS) | 매번 1~2 RTT 추가 | 첫 1회만 |
| 총 오버헤드 | 요청 수 N에 비례 | O(1) |

브라우저에서 keep-alive를 직접 관찰할 수 있습니다:

- Chrome DevTools Network 탭 → 요청 클릭 → Connection ID
- 같은 도메인의 여러 요청이 같은 Connection ID를 공유하면 keep-alive로 재사용된 것

```http
GET /index.html HTTP/1.1
Host: example.com
Connection: keep-alive    ← HTTP/1.1에서는 기본값, 명시 안 해도 됨
```

이게 없으면 어떻게 되는가: keep-alive가 없으면 — `<img>` 태그 10개가 있는 페이지가 11번 handshake + 11번 slow-start의 첫 단계에서 멈춘 채 시작. 한 번 워밍업된 연결의 빠른 throughput을 단 한 번도 활용 못 합니다. 사용자 입장에선 페이지가 한 번에 떠오르지 않고 이미지가 하나씩 늦게 그려지는 경험이 됩니다.

오개념 예방: keep-alive가 영원히 연결을 유지하는 건 아닙니다. 서버는 `Keep-Alive: timeout=5, max=1000` 같은 헤더로 "5초 idle하면 닫고, 최대 1000개 요청까지만 재사용"이라는 한도를 둘 수 있습니다. 한정된 서버 자원(소켓, 파일 디스크립터)을 보호하기 위함입니다.

AI Annotation 보충: HTTP/1.0에서는 비공식적으로 `Connection: Keep-Alive` 헤더로 연결 유지를 시도할 수 있었지만, 모든 서버·프록시가 지원하지 않아 신뢰성이 낮았습니다. HTTP/1.1에서 표준 동작으로 격상되어 모든 구현체가 기본으로 지원하게 되면서 비로소 의미 있게 활용 가능해졌습니다.

---

# HTTP/1.1의 파이프라이닝은 어떤 최적화를 시도했고, 왜 실패했는가?

> HTTP/1.1 added also HTTP pipelining in order to further reduce lag time when using persistent connections by allowing clients to send multiple requests before waiting for each response.
> This optimization was never considered really safe because a few web servers and many proxy servers, specially transparent proxy servers placed in Internet / Intranets between clients and servers, did not handle pipelined requests properly (they served only the first request discarding the others, they closed the connection because they saw more data after the first request or some proxies even returned responses out of order etc.).
> Because of this, only HEAD and some GET requests could be pipelined in a safe and idempotent mode.
> After many years of struggling with the problems introduced by enabling pipelining, this feature was first disabled and then removed from most browsers also because of the announced adoption of HTTP/2.

---

## 도입

keep-alive로 연결은 재사용했지만 여전히 "한 요청 보내고 응답 기다린 뒤 다음 요청"이었습니다. 응답이 오기를 기다리는 시간이 아까웠죠. 파이프라이닝은 "응답 안 기다리고 요청을 연달아 보내기"라는 자연스러운 다음 단계 최적화였지만, 결국 실패했습니다. 좋은 아이디어가 현실의 호환성 문제로 실패한 사례입니다.

---

## 본문

> HTTP/1.1 added also HTTP pipelining in order to further reduce lag time when using persistent connections by allowing clients to send multiple requests before waiting for each response.

HTTP/1.1은 영속 연결 사용 시 지연을 더 줄이기 위해, 클라이언트가 각 응답을 기다리지 않고도 여러 요청을 보낼 수 있도록 HTTP 파이프라이닝을 추가했다.

- **pipelining**: 파이프(관)에 여러 요청을 한 번에 흘려보내는 그림. 응답이 오기 전에 다음 요청이 이미 출발해 있는 상태.
- **further reduce lag time**: keep-alive가 줄여준 지연을 더 줄이는 게 목표. RTT가 100ms이고 요청 10개가 있으면 순차 처리는 1000ms, 파이프라이닝은 이론상 100ms+α.
- **before waiting for each response**: 응답을 기다리지 않고 요청을 연달아 보냄. 단, 응답은 요청 순서대로 와야 합니다 — 이게 중요한 제약.

> This optimization was never considered really safe because a few web servers and many proxy servers, specially transparent proxy servers placed in Internet / Intranets between clients and servers, did not handle pipelined requests properly

이 최적화는 결코 충분히 안전하다고 여겨지지 않았는데, 왜냐하면 일부 웹 서버와 많은 프록시 서버 — 특히 인터넷/인트라넷에서 클라이언트와 서버 사이에 위치한 transparent 프록시 — 가 파이프라이닝된 요청을 제대로 처리하지 못했기 때문이다.

- **never considered really safe**: 표준에는 들어갔지만 실무에서 신뢰할 수 없었습니다.
- **transparent proxy servers**: 클라이언트가 자기가 프록시를 거치는지 모르는 채로 통과하는 프록시. ISP가 캐시용으로 두는 경우가 많아 회피 불가능.
- **placed in Internet / Intranets**: 인터넷 곳곳, 회사 내부망 곳곳. 어디에 있는지 클라이언트는 모릅니다.
- **did not handle properly**: 파이프라이닝은 표준 스펙은 있었지만 많은 구현체가 이를 따르지 않거나 버그가 있었습니다.

> (they served only the first request discarding the others, they closed the connection because they saw more data after the first request or some proxies even returned responses out of order etc.).

(첫 요청만 처리하고 나머지를 버리거나, 첫 요청 뒤에 추가 데이터가 보이자 연결을 닫거나, 일부 프록시는 응답을 순서가 뒤바뀐 채 반환하기까지 했다.)

- **served only the first request**: 두 번째 요청부터 무시. 페이지 로드가 멈추거나 일부만 그려짐.
- **closed the connection**: "왜 응답도 안 받고 또 보내?" 하면서 연결을 닫아버림. 다시 새 연결 → 파이프라이닝 의미 없음.
- **out of order**: 요청은 1, 2, 3 순서로 보냈는데 응답이 3, 1, 2 순서로 옴. 클라이언트가 어느 응답이 어느 요청에 대한 것인지 알 수 없게 됨 — 데이터 매칭 자체가 깨짐.

> Because of this, only HEAD and some GET requests could be pipelined in a safe and idempotent mode.

이 때문에 안전하고 멱등한 방식으로는 HEAD와 일부 GET 요청만 파이프라이닝할 수 있었다.

- **HEAD and some GET**: 부작용이 없는 안전한 메서드만. POST 같은 비멱등 메서드는 응답 매칭이 꼬이면 데이터 정합성이 깨지므로 절대 파이프라이닝 불가.
- **safe and idempotent**: 여러 번 보내도 같은 결과인 메서드만 허용 — 응답이 순서가 뒤바뀌어도 의미상 안전한 것들.

> After many years of struggling with the problems introduced by enabling pipelining, this feature was first disabled and then removed from most browsers also because of the announced adoption of HTTP/2.

파이프라이닝 활성화로 인한 문제와 수년간 씨름한 끝에, 이 기능은 먼저 비활성화되었다가 결국 대부분의 브라우저에서 제거됐다. HTTP/2 채택이 발표된 것도 이유 중 하나였다.

- **disabled**: 브라우저들이 기본값을 off로 바꿈. Firefox는 한때 켜져 있었지만 점차 비활성화.
- **removed**: 코드에서 아예 삭제. 사용자가 옵션으로 켤 수도 없게 됨.
- **adoption of HTTP/2**: 멀티플렉싱이 파이프라이닝의 모든 한계를 근본적으로 해결하므로, 파이프라이닝을 살릴 동기가 사라짐.

---

## 종합

파이프라이닝과 그 후속 해결책의 비교:

| 방식 | 동작 | 한계 |
|---|---|---|
| HTTP/1.1 (직렬) | 요청 → 응답 → 요청 → 응답 | 응답 대기로 지연 누적 |
| HTTP/1.1 + 파이프라이닝 | 요청1, 2, 3 동시 송신, 응답은 순서대로 | 호환성 + HOL blocking |
| HTTP/2 멀티플렉싱 | 한 연결에 여러 스트림이 독립적으로 진행 | 진정한 동시 처리 |

파이프라이닝의 본질적 한계 — Head-of-Line(HOL) blocking — 도 짚고 가야 합니다. 호환성 문제가 없었더라도, 응답이 요청 순서대로 와야 한다는 제약이 있었습니다. 첫 요청의 응답이 느리면 뒤따르는 응답들도 그만큼 늦게 옵니다. HTTP/2의 멀티플렉싱은 응답 순서 제약을 없애 이 문제까지 해결했습니다.

이게 없으면 어떻게 되는가: 파이프라이닝이 성공했다면 HTTP/1.1만으로도 페이지 로드가 상당히 빨라졌을 것입니다. 하지만 호환성 문제로 좌절되면서 브라우저들은 "도메인당 동시 6~8개 TCP 연결"이라는 차선책에 의존했습니다 — 이는 서버 부하를 가중시키고 도메인 샤딩(domain sharding) 같은 우회 기법을 낳았습니다. HTTP/2의 멀티플렉싱이 이런 우회의 필요성을 모두 제거했죠.

오개념 예방: "파이프라이닝 = 멀티플렉싱"이 아닙니다. 파이프라이닝은 "요청을 연달아 보내되 응답은 보낸 순서대로 받기"이고, 멀티플렉싱은 "여러 스트림을 독립적으로 진행하여 응답 순서가 자유"입니다. 파이프라이닝은 HOL blocking을 못 피하지만 멀티플렉싱은 피합니다.

AI Annotation 보충: 파이프라이닝의 실패는 표준화된 기능도 현실 인프라(특히 통제 못 하는 중간 노드)와 호환되지 않으면 살아남지 못함을 보여주는 사례입니다. HTTP/2가 비호환 변화(바이너리 프레임)를 도입하면서도 채택될 수 있었던 건 HTTPS 위에서만 동작하도록 강제하여 평문 프록시의 간섭을 차단했기 때문이기도 합니다.

---

# HTTP/2와 HTTP/3는 영속 연결(persistent connection)을 어떻게 발전시켰는가?

> HTTP/2 extended the usage of persistent connections by multiplexing many concurrent requests/responses through a single TCP/IP connection.
> HTTP/3 does not use TCP/IP connections but QUIC + UDP.

---

## 도입

HTTP/1.1의 keep-alive는 한 연결을 닫지 않고 재사용했지만 한 번에 한 요청만 처리했습니다. 파이프라이닝은 실패했죠. HTTP/2는 한 연결 안에서 여러 요청을 동시에 다루는 멀티플렉싱으로 이 문제를 해결했고, HTTP/3는 한 발 더 나아가 TCP를 버리고 QUIC을 채택했습니다.

---

## 본문

> HTTP/2 extended the usage of persistent connections by multiplexing many concurrent requests/responses through a single TCP/IP connection.

HTTP/2는 단일 TCP/IP 연결을 통해 많은 동시 요청/응답을 멀티플렉싱함으로써 영속 연결의 활용 범위를 확장했다.

- **extended**: HTTP/1.1이 시작한 영속 연결의 개념을 더 발전시킴. 새 개념을 만든 게 아니라 기존을 확장.
- **multiplexing**: 여러 신호를 하나의 채널에 동시에 흘려보내는 기법. HTTP/2에서는 여러 요청·응답을 같은 TCP 연결 위에 독립된 "스트림"으로 동시에 보냄.
- **many concurrent**: 동시 처리 가능한 요청 수가 1개에서 수십~수백 개로 폭증. 응답 순서 제약도 없음.
- **single TCP/IP connection**: 도메인당 1개 연결로 충분. HTTP/1.1에서 브라우저가 6~8개 연결을 열던 트릭이 불필요해짐.

> HTTP/3 does not use TCP/IP connections but QUIC + UDP.

HTTP/3는 TCP/IP 연결을 쓰지 않고 QUIC + UDP를 사용한다.

- **does not use TCP/IP**: 30년간 HTTP의 기반이었던 TCP를 버림. 가장 큰 변화.
- **QUIC**: Google이 만들고 IETF가 표준화한 새 전송 프로토콜. UDP 위에 신뢰성, 흐름 제어, 암호화를 직접 구현.
- **UDP**: 비신뢰성 전송 프로토콜. 기본적으로 패킷 유실/순서 보장이 없지만, QUIC이 그 위에서 신뢰성을 만들어줍니다.

---

## 종합

HTTP 버전별 영속 연결 발전을 정리하면:

| 버전 | 연결 처리 | 동시성 | 전송 계층 |
|---|---|---|---|
| HTTP/1.0 | 요청마다 새 연결 | 1개씩 직렬 | TCP |
| HTTP/1.1 | keep-alive로 재사용 | 1개씩 직렬 (도메인당 6~8 연결로 회피) | TCP |
| HTTP/2 | 단일 연결 + 멀티플렉싱 | 한 연결에 다수 스트림 동시 | TCP |
| HTTP/3 | QUIC 연결 + 멀티플렉싱 | TCP HOL blocking까지 제거 | QUIC over UDP |

브라우저에서 직접 관찰 가능한 차이:

- Chrome DevTools Network 탭에서 Protocol 컬럼을 켜면 `http/1.1`, `h2`, `h3`로 표시됩니다
- HTTP/2(`h2`)인 사이트는 도메인당 연결이 1개로 줄어들어 Connection ID가 같아짐
- HTTP/3(`h3`)는 QUIC을 사용하므로 TCP 연결 자체가 없습니다

이게 없으면 어떻게 되는가: HTTP/2 멀티플렉싱이 없었다면 — 브라우저는 여전히 도메인당 6~8 TCP 연결을 동시에 열어야 하므로 서버 자원 점유와 RAM 사용량이 클라이언트·서버 양쪽 모두에서 컸을 것입니다. HTTP/3가 없었다면 — TCP 패킷 1개 유실로 같은 연결의 모든 스트림이 멈추는 TCP HOL blocking이 모바일·고손실 네트워크에서 큰 문제로 남았을 것입니다.

오개념 예방: HTTP/3가 UDP를 쓴다고 해서 신뢰성이 약해진 건 아닙니다. QUIC이 패킷 유실 시 재전송, 순서 재조립, 흐름 제어를 모두 처리합니다 — TCP가 OS 커널에서 하던 일을 QUIC이 애플리케이션 레이어에서 직접 합니다. 이렇게 옮긴 이유는 OS 업데이트 없이도 QUIC을 빠르게 발전시킬 수 있기 때문입니다 (TCP는 OS 커널 일부라 업데이트가 느림).

AI Annotation 보충: 같은 키워드 "persistent connection"이지만 의미는 점점 풍부해졌습니다 — HTTP/1.1에서는 "닫지 않고 재사용"의 단순 의미였고, HTTP/2부터는 "닫지 않고 + 동시에 여러 요청 처리"의 의미를 겸합니다. 발전이 누적적이라는 점이 이 시리즈의 특징입니다.

---

# HTTP/2가 HTTP/1.1 대비 개선한 점은?

> HTTP/2 adds support for:
> a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space;
> a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections;
> one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets to almost solve the problem of the HOLB (head-of-line blocking);
> a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).

---

## 도입

HTTP/2는 HTTP/1.1의 한계 4가지를 한꺼번에 해결한 큰 도약입니다 — 텍스트 헤더의 비효율, 도메인당 다중 연결, HOL blocking, 그리고 서버에서 먼저 데이터를 보낼 수 없는 단방향 모델. 각각이 어떤 개선인지 하나씩 봅니다.

---

## 본문

> HTTP/2 adds support for: a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space;

HTTP/2는 텍스트 대신 메타데이터(HTTP 헤더)의 압축된 바이너리 표현을 지원해, 헤더가 훨씬 적은 공간을 차지하도록 했다.

- **compressed binary representation**: 헤더를 바이너리로 인코딩하고 HPACK 알고리즘으로 압축. 같은 헤더가 반복될 때 인덱스로 참조해 재전송 안 함.
- **instead of a textual one**: HTTP/1.1은 헤더가 ASCII 텍스트(`Content-Type: application/json` 그대로). 사람이 읽기는 쉽지만 매 요청마다 같은 헤더가 반복됨.
- **much less space**: 쿠키나 User-Agent 같은 큰 헤더가 압축으로 수십~수백 바이트 절약. 모바일 환경에서 특히 큰 효과.

> a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections;

도메인당 2~8개 연결 대신, 접근한 서버 도메인마다 단일 TCP/IP 연결(보통 암호화됨)을 사용한다.

- **single connection**: 1개 연결로 충분. 멀티플렉싱이 가능해서 더 많은 연결이 필요 없습니다.
- **usually encrypted**: 사실상 HTTPS 위에서만 동작. 브라우저들이 평문 HTTP/2를 거의 지원 안 함 — 중간 노드의 간섭(파이프라이닝 실패 사례)을 피하기 위함.
- **2 to 8 TCP/IP connections**: HTTP/1.1 시절 브라우저들이 병렬성을 짜내려고 도메인당 동시 6~8 연결을 열던 관행. 서버·클라이언트 양쪽 자원 부담.

> one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets

TCP/IP 연결당 하나 이상의 양방향 스트림이 있고, HTTP 요청과 응답이 작은 패킷으로 나뉘어 전송된다.

- **bidirectional streams**: 양방향. 한 연결 안에서 클라이언트→서버, 서버→클라이언트가 동시에 가능.
- **broken down and transmitted in small packets**: 메시지를 프레임 단위로 잘게 쪼개서 전송. 여러 요청의 프레임을 인터리브(섞어서)해서 보낼 수 있음.

> to almost solve the problem of the HOLB (head-of-line blocking);

이를 통해 HOLB(head-of-line blocking) 문제를 거의 해결했다.

- **almost solve**: "거의" 해결. 애플리케이션 계층의 HOL은 풀었지만 TCP 계층의 HOL은 남아있어 — HTTP/3가 이를 마저 해결.
- **head-of-line blocking**: 큐의 맨 앞이 막히면 뒤가 못 진행하는 현상. HTTP/1.1에선 첫 응답이 느리면 뒤따르는 응답 모두 대기. HTTP/2에선 스트림이 독립적이라 한 스트림이 느려도 다른 스트림은 진행.

> a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).

서버 푸시 기능을 통해 서버 애플리케이션이 새 데이터가 있을 때마다 클라이언트에게 보낼 수 있도록 했다(클라이언트가 폴링 방식으로 주기적으로 서버에 요청하지 않아도 됨).

- **push capability**: 서버가 클라이언트의 명시적 요청 없이 데이터를 보냄. HTML 보내면서 그 안에 있는 CSS·JS도 함께 푸시 가능.
- **whenever new data is available**: 폴링과 달리 즉시. 클라이언트가 "지금 새 거 있어?"를 반복 물어볼 필요 없음.
- **polling methods**: HTTP/1.1 시절의 우회법. 클라이언트가 주기적으로(예: 1초마다) 서버에 새 데이터를 묻는 방식. 비효율적.

---

## 종합

HTTP/2의 4가지 개선을 한눈에:

| 개선 | HTTP/1.1 | HTTP/2 | 효과 |
|---|---|---|---|
| 헤더 형식 | ASCII 텍스트 | HPACK 바이너리 압축 | 트래픽 절감 |
| 연결 수 | 도메인당 6~8개 | 도메인당 1개 | 자원 절약 |
| 동시성 | 직렬 (or 실패한 파이프라이닝) | 다중 스트림 멀티플렉싱 | HOL blocking 해소 |
| 푸시 | 폴링으로 우회 | Server Push | 즉시 전달 |

Chrome DevTools에서 직접 관찰할 수 있는 차이:

- HTTP/1.1 사이트: 같은 도메인 요청들의 Connection ID가 6~8개로 분산
- HTTP/2 사이트: 같은 도메인 요청 모두가 같은 Connection ID 공유. Network 탭의 Waterfall이 훨씬 짧아짐
- 헤더 크기: DevTools에서 "Headers"의 size가 HTTP/2에서 작게 표시됨

이게 없으면 어떻게 되는가: HTTP/2의 멀티플렉싱이 없었다면 — 큰 페이지(이미지·CSS·JS 100개)가 있는 사이트는 여전히 도메인당 8 연결의 한계로 직렬 처리 병목. 도메인 샤딩(`cdn1.example.com`, `cdn2.example.com`으로 분산) 같은 우회 기법이 여전히 필요했을 것이고, 이는 HTTPS 인증서 비용과 DNS 조회 추가 부담을 만들었을 것입니다.

오개념 예방: 서버 푸시는 좋아 보이지만 실제로는 거의 사장됐습니다. 클라이언트 캐시와 충돌이 잦고(이미 캐시된 리소스를 또 푸시), 효과 측정이 어려워 Chrome 등 주요 브라우저가 지원을 제거했습니다. 대신 `<link rel="preload">` 같은 힌트로 클라이언트가 주도하는 방식이 표준이 됐습니다.

AI Annotation 보충: HTTP/1.1에서 브라우저가 같은 서버에 동시에 6~8 TCP 연결을 열었던 건 병렬성을 흉내내려는 강박이었습니다. HTTP/2의 단일 연결 + 멀티플렉싱은 같은 효과를 더 우아하게 달성하면서 서버 자원 부담도 줄였습니다.

---

# HTTP/2가 HOL blocking을 "거의" 해결했다고 하는 이유와, HTTP/3가 이를 완전히 해결한 방법은?

> HTTP/3 uses QUIC + UDP transport protocols instead of TCP.
> This slightly improves the average speed of communications and avoids the occasional problem of TCP connection congestion that can temporarily block or slow down the data flow of all its streams (another form of "head of line blocking").

---

## 도입

HTTP/2가 HOL(Head-of-Line) blocking을 "거의" 해결했다는 표현이 묘하게 들립니다. 아예 해결한 게 아니라 거의? 답은 HOL이 두 계층에서 일어난다는 데 있습니다 — 애플리케이션 계층(HTTP)과 전송 계층(TCP). HTTP/2는 전자만 풀었고, 후자는 TCP 자체의 한계라 HTTP/3가 TCP를 버리며 풀었습니다.

---

## 본문

> HTTP/3 uses QUIC + UDP transport protocols instead of TCP.

HTTP/3는 TCP 대신 QUIC + UDP 전송 프로토콜을 사용한다.

- **instead of TCP**: 30년간 HTTP의 기반이던 TCP를 교체. 이게 HTTP/3의 가장 큰 변화이자 HOL을 마저 풀 수 있게 된 이유.
- **QUIC + UDP**: UDP는 신뢰성 없는 단순 전송, QUIC은 그 위에 신뢰성·암호화·흐름 제어를 직접 구현한 새 프로토콜. UDP는 단순한 운반체이고, 진짜 일은 QUIC이 합니다.

> This slightly improves the average speed of communications

이는 통신의 평균 속도를 약간 개선하고.

- **slightly improves**: 솔직한 표현. 평균적으론 큰 차이 없을 수 있지만, 특정 상황(고손실 네트워크)에서 큰 효과.
- **average speed**: 평균 속도. handshake 단축(QUIC은 0-RTT 가능), 연결 마이그레이션(IP 바뀌어도 연결 유지) 등도 기여.

> and avoids the occasional problem of TCP connection congestion that can temporarily block or slow down the data flow of all its streams (another form of "head of line blocking").

가끔 발생하는 TCP 연결 혼잡 문제 — 모든 스트림의 데이터 흐름을 일시적으로 막거나 느리게 할 수 있는 — 를 회피한다(또 다른 형태의 "head of line blocking").

- **TCP connection congestion**: TCP의 흐름 제어가 작동하면서 패킷 유실 시 재전송을 기다리는 동안 그 연결의 모든 스트림이 멈추는 현상.
- **temporarily block or slow down all its streams**: HTTP/2의 핵심 — 한 연결에 여러 스트림이 있죠. TCP는 패킷 하나가 유실되면 그 연결 전체가 그 패킷이 재전송될 때까지 진행을 못 합니다. 스트림 1의 패킷이 유실되면, 무관한 스트림 2~N도 모두 대기.
- **another form of "head of line blocking"**: 이게 TCP 계층의 HOL입니다. 애플리케이션 계층의 HOL과 다른 위치에서 발생.

---

## 종합

HOL blocking이 두 계층에서 일어나는 그림을 정리하면:

| 계층 | 위치 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|---|
| 애플리케이션 (HTTP) | 요청-응답 큐 | 직렬 처리, 첫 응답 느리면 뒤도 대기 | 멀티플렉싱으로 해결 | 해결 (HTTP/2 동일) |
| 전송 (TCP/QUIC) | 패킷 재전송 | 1 연결 = 1 스트림이라 큰 영향 없음 | TCP HOL 발생 (스트림 N개가 있어도 1 패킷 손실 = 모두 대기) | QUIC이 스트림별 독립 처리 |

구체적인 시나리오로 이해해 봅니다:

HTTP/2 + TCP에서 한 연결에 5개 스트림이 진행 중일 때, 스트림 3의 패킷 하나가 네트워크에서 유실됐다고 합시다. TCP는 "패킷 순서가 깨졌다"를 감지하고 재전송될 때까지 기다립니다 — 그동안 스트림 1, 2, 4, 5의 패킷이 도착해 있어도 OS의 TCP 스택이 애플리케이션에 전달하지 않습니다. 모든 스트림이 함께 멈춥니다.

HTTP/3 + QUIC에서는 스트림이 QUIC 레이어에서 독립적으로 관리됩니다. 스트림 3의 패킷이 유실되어도 스트림 1, 2, 4, 5의 패킷은 즉시 애플리케이션에 전달됩니다 — 스트림 3만 자기 패킷의 재전송을 기다릴 뿐.

이게 없으면 어떻게 되는가: TCP HOL이 그대로 남았다면 — 모바일 네트워크처럼 패킷 손실이 잦은 환경에서 HTTP/2의 멀티플렉싱 이점이 크게 줄어들었을 것입니다. 한 패킷 손실이 사용자에게 "사이트가 잠깐 얼었다"로 체감되죠. HTTP/3가 모바일·고손실 환경에서 특히 빠른 이유입니다.

오개념 예방: HTTP/2의 멀티플렉싱이 잘못 설계된 게 아닙니다. 애플리케이션 계층에서 할 수 있는 건 다 한 것이고, 남은 문제는 TCP라는 OS 커널의 통신 메커니즘 자체의 구조적 한계였습니다. TCP는 1980년대 설계 시점에 "한 연결 = 한 데이터 스트림"을 가정했기 때문에 멀티스트림을 자연스럽게 지원할 수 없습니다.

AI Annotation 보충: HTTP/3가 UDP를 선택한 또 다른 이유는 OS 커널 의존도를 낮추기 위함입니다. TCP는 OS 일부라 업데이트가 느린 반면, QUIC은 사용자 공간에서 동작하는 라이브러리로 구현 가능 — Chrome, Firefox 등이 자체 QUIC 구현을 빠르게 발전시킬 수 있습니다.

---

# 현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?

> HTTP/2 is supported by 71% of websites (34.1% HTTP/2 + 36.9% HTTP/3 with backwards compatibility) and supported by almost all web browsers (over 98% of users).
> HTTP/3 is used on 36.9% of websites and is supported by most web browsers, i.e. (at least partially) supported by 97% of users.
> HTTPS, the secure variant of HTTP, is used by more than 85% of websites.

---

## 도입

웹 표준은 발표돼도 즉시 모두가 쓰지 않습니다. 채택까지 수년이 걸리고, 동시에 여러 버전이 공존합니다. 2025년 시점에서 HTTP/1.1, HTTP/2, HTTP/3, HTTPS의 실제 보급률을 파악하면 — 어느 버전을 가정하고 코드를 짜야 할지 감을 잡을 수 있습니다.

---

## 본문

> HTTP/2 is supported by 71% of websites (34.1% HTTP/2 + 36.9% HTTP/3 with backwards compatibility)

HTTP/2는 웹사이트의 71%에서 지원된다 (HTTP/2 단독 34.1% + 하위호환 가능한 HTTP/3 36.9%).

- **71%**: 다수파. 새 사이트라면 HTTP/2 이상이 거의 기본.
- **with backwards compatibility**: HTTP/3 사이트는 HTTP/2도 함께 지원. 클라이언트가 HTTP/3를 못 하면 HTTP/2로 fallback.
- **34.1% + 36.9%**: 두 수치를 더한 게 HTTP/2의 실질 지원율 — HTTP/3 사이트도 HTTP/2를 거의 다 지원하기 때문.

> and supported by almost all web browsers (over 98% of users).

거의 모든 웹 브라우저가 지원하며 사용자의 98% 이상이 사용 가능하다.

- **over 98% of users**: 클라이언트 측 지원은 사실상 완전. 구형 브라우저(IE 11 등)만 예외.
- **almost all web browsers**: Chrome, Firefox, Safari, Edge 등 주요 브라우저는 수년 전부터 지원.

> HTTP/3 is used on 36.9% of websites and is supported by most web browsers, i.e. (at least partially) supported by 97% of users.

HTTP/3는 웹사이트의 36.9%에서 사용되며 대부분의 브라우저가 지원해 사용자 97%(적어도 부분적으로)가 사용 가능하다.

- **36.9% of websites**: 새 표준치고는 빠른 보급. CDN(Cloudflare, Fastly)이 자동 활성화하는 영향.
- **at least partially**: 일부 브라우저는 기본 활성화, 일부는 옵션. 네트워크 환경에 따라 활성화/비활성화.

> HTTPS, the secure variant of HTTP, is used by more than 85% of websites.

HTTP의 보안 변형인 HTTPS는 웹사이트의 85% 이상에서 사용된다.

- **more than 85%**: 지난 10년간 가장 큰 변화. 2014년경엔 30~40%대였습니다.
- **secure variant**: HTTP에 TLS를 얹은 것. 별도 프로토콜이 아닌 HTTP 위 보안 계층.

---

## 종합

2025년 현재 웹의 프로토콜 지형을 정리하면:

| 항목 | 수치 | 의미 |
|---|---|---|
| HTTPS 사용 사이트 | 85%+ | 평문 HTTP 사이트는 소수파 |
| HTTP/2 지원 사이트 | 71% (34.1% + 36.9%) | 새 사이트 거의 기본값 |
| HTTP/3 사용 사이트 | 36.9% | CDN 주도로 빠르게 확산 |
| HTTP/2/3 지원 사용자 | 97~98% | 클라이언트는 사실상 준비 완료 |

프론트엔드 개발자 입장에서 의미:

- `fetch()` 한 줄을 쓸 때 어느 프로토콜로 갈지는 서버·CDN 설정에 달림. 클라이언트가 명시적으로 고를 일은 거의 없음
- 새 사이트라면 HTTPS는 필수, HTTP/2는 사실상 기본, HTTP/3는 CDN 사용 시 자동
- 채택률이 점진적이라 — 구형 클라이언트(IE 11 등)를 지원해야 한다면 HTTP/1.1 fallback도 고려 필요

오개념 예방: HTTP/3가 36.9%라고 해서 "아직 HTTP/3 안 써도 됨"이 아닙니다. 같은 사이트가 HTTP/3 + HTTP/2 + HTTP/1.1을 동시에 제공하는 게 흔하고, 클라이언트는 협상을 통해 가능한 최신 버전을 씁니다. HTTPS만 켜놓으면 CDN이 알아서 HTTP/3까지 활성화합니다.

이게 없으면 어떻게 되는가: HTTPS가 85%까지 오르지 않았다면 — 공용 와이파이에서의 패킷 스니핑, ISP의 광고 인젝션, 정부 검열·감시 등이 훨씬 쉬웠을 것입니다. 2018년 Chrome이 HTTP 사이트에 "Not Secure" 경고를 표시하기 시작한 게 채택률 급등의 결정적 계기였고, Let's Encrypt(2016~)의 무료 인증서가 비용 장벽을 없앴습니다.

Official Annotation 보충: HTTPS 안에서도 TLS 1.0/1.1은 2020년 제거됐고, TLS 1.3(2018년 발표)이 권장이지만 — 채택은 느립니다. 많은 서버가 여전히 TLS 1.2에 머물러 있습니다. "HTTPS = 안전"이 자동 보장은 아니고, 어떤 TLS 버전을 쓰는지도 봐야 합니다.

AI Annotation 보충: HTTP/2의 보급률이 큰 이유 중 하나는 — HTTP/2가 사실상 HTTPS 위에서만 동작하므로, HTTPS 보급이 HTTP/2 보급을 끌어올리는 선순환을 만들었습니다.

---

# HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?

> Like HTTP/2, it does not obsolete previous major versions of the protocol.
> HTTP/3 has lower latency for real-world web pages and loads faster than HTTP/2, in some cases over three times faster than HTTP/1.1, which is still commonly the only protocol enabled.

---

## 도입

새 버전이 나오면 이전 게 사라진다는 직감과 달리, HTTP는 모든 메이저 버전이 공존합니다. HTTP/1.1, HTTP/2, HTTP/3 셋 다 현역이고, 클라이언트와 서버가 협상해서 가능한 최신을 씁니다. 이 공존이 어떻게 가능하고, 왜 그런지 이해하면 — 사이트 개발 시 어떤 버전을 가정해야 할지 보입니다.

---

## 본문

> Like HTTP/2, it does not obsolete previous major versions of the protocol.

HTTP/2와 마찬가지로, HTTP/3도 프로토콜의 이전 메이저 버전을 폐기시키지 않는다.

- **does not obsolete**: 폐기시키지 않음. 기존 버전이 그대로 표준으로 남아있고, 새 버전은 옵션으로 추가.
- **previous major versions**: HTTP/1.1, HTTP/2 모두. 둘 다 그대로 표준으로 유효.

> HTTP/3 has lower latency for real-world web pages and loads faster than HTTP/2,

HTTP/3는 실제 웹페이지의 지연이 더 낮고 HTTP/2보다 빠르게 로드된다.

- **real-world web pages**: 실험실이 아니라 실제 웹사이트에서. 이론적 차이가 아니라 측정 가능한 차이.
- **lower latency**: 응답 시작까지의 지연이 짧음. 0-RTT 핸드셰이크와 TCP HOL 회피 덕분.

> in some cases over three times faster than HTTP/1.1,

어떤 경우에는 HTTP/1.1보다 3배 이상 빠르다.

- **over three times**: 페이지 구조에 따라 다르지만, 리소스가 많은 페이지일수록 차이가 큼. 멀티플렉싱의 누적 효과.
- **in some cases**: 모든 경우가 아니라 특정 상황에서. 작은 페이지에선 차이가 미미할 수도 있습니다.

> which is still commonly the only protocol enabled.

(HTTP/1.1은) 여전히 흔히 유일하게 활성화된 프로토콜이다.

- **still commonly**: 아직도 자주. 신규 사이트는 HTTP/2/3가 기본이지만, 옛 사이트·내부 시스템은 HTTP/1.1만 켜져 있는 경우가 흔함.
- **the only protocol enabled**: HTTP/1.1만 활성화. HTTP/2/3 추가 설정을 안 한 서버가 많아 HTTP/1.1이 여전히 현역.

---

## 종합

HTTP 버전 공존의 모습:

| 버전 | 위치 | 사용 시점 |
|---|---|---|
| HTTP/1.1 | 모든 사이트의 기본 | HTTP/2/3 미지원 시 자동 fallback |
| HTTP/2 | 다수 사이트에서 활성화 | 클라이언트가 지원하면 우선 |
| HTTP/3 | CDN 사용 사이트 중심 | 클라이언트와 네트워크가 지원하면 우선 |

같은 사이트가 동시에 셋을 다 제공하고, 클라이언트와 서버가 ALPN(Application-Layer Protocol Negotiation)이라는 TLS 확장으로 "어떤 버전 쓸까"를 협상합니다. 가능한 가장 새 버전을 고르되, 안 되면 자동으로 한 단계 내려갑니다.

JS 개발자에게 와닿는 지점:

- `fetch()`나 `XMLHttpRequest`는 HTTP 버전을 신경 쓰지 않습니다. 같은 코드가 HTTP/1.1, HTTP/2, HTTP/3 모두에서 동작
- DevTools Network 탭의 Protocol 컬럼으로 실제 어느 버전이 쓰였는지 확인 가능
- 브라우저가 알아서 협상하므로 클라이언트 코드가 버전을 고를 일은 거의 없음

이게 없으면 어떻게 되는가: HTTP/3가 HTTP/1.1을 폐기시키는 식이라면 — 모든 서버·클라이언트가 동시에 업데이트해야 하므로 변화가 거의 불가능했을 것입니다. 인터넷의 규모(수십억 디바이스)에서 동시 마이그레이션은 비현실적이고, 각 버전이 공존하면서 점진적으로 새 버전이 보급되는 것이 유일한 길입니다.

오개념 예방: "HTTP/3가 3배 빠름"이라는 건 모든 페이지가 그렇다는 뜻은 아닙니다. 패킷 손실이 잦은 모바일 네트워크나 리소스가 많은 페이지에서 그 정도 차이가 나오는 것이고, 빠른 유선 네트워크의 작은 페이지에선 차이가 거의 없을 수 있습니다.

AI Annotation 보충: 새 표준이 이전 표준을 폐기하지 않는 정책은 HTTP만의 특징이 아니라 인터넷 표준 전반의 관행입니다. IPv4와 IPv6도 30년 가까이 공존 중이며, 이런 점진적 전환이 인터넷의 안정성을 유지합니다.

---

# HTTP가 전송 계층에 요구하는 조건은 무엇이며, 각 버전은 어떤 전송 프로토콜을 사용하는가?

> HTTP presumes an underlying and reliable transport layer protocol.
> The standard choice of the underlying protocol prior to HTTP/3 is Transmission Control Protocol (TCP).
> HTTP/3 uses a different transport layer called QUIC, which provides reliability on top of the unreliable User Datagram Protocol (UDP).

---

## 도입

HTTP는 메시지의 형식과 의미만 정합니다 — 그 메시지를 어떻게 신뢰성 있게 운반할지는 아래 계층의 일입니다. 그렇다면 HTTP가 그 아래 계층에 요구하는 조건은 무엇일까요? 이 질문이 중요한 이유는 — HTTP/3가 TCP를 버리고 QUIC을 채택할 수 있었던 근거가 바로 이 조건의 정확한 정의에 있기 때문입니다.

---

## 본문

> HTTP presumes an underlying and reliable transport layer protocol.

HTTP는 그 아래에 신뢰할 수 있는 전송 계층 프로토콜이 있다고 전제한다.

- **presumes**: 가정. HTTP 자체는 패킷이 유실되거나 순서가 뒤바뀌는 경우를 다루지 않습니다 — 아래 계층이 해줄 거라고 믿고 동작.
- **underlying**: 더 하위 계층. OSI 모델에서 HTTP(애플리케이션) 아래의 전송 계층(TCP, UDP, QUIC).
- **reliable**: 신뢰성. 데이터가 보낸 순서대로, 빠짐없이 도착해야 함. 패킷 유실 시 재전송, 순서 보장.

> The standard choice of the underlying protocol prior to HTTP/3 is Transmission Control Protocol (TCP).

HTTP/3 이전의 표준 선택은 TCP(Transmission Control Protocol)다.

- **standard choice**: 표준. HTTP/0.9부터 HTTP/2까지 모두 TCP 위에서 동작.
- **prior to HTTP/3**: HTTP/3 이전까지는. HTTP/3가 처음으로 이 관행을 깼습니다.
- **TCP**: 1980년대부터 인터넷의 신뢰성 전송 표준. 3-way handshake, 재전송, 순서 보장, 흐름 제어를 모두 제공.

> HTTP/3 uses a different transport layer called QUIC,

HTTP/3는 QUIC이라는 다른 전송 계층을 사용한다.

- **a different transport layer**: TCP가 아닌 새 전송 프로토콜. Google이 만들어 IETF가 표준화.
- **QUIC**: Quick UDP Internet Connections의 약자. UDP 위에 TCP가 제공하던 기능들을 직접 구현.

> which provides reliability on top of the unreliable User Datagram Protocol (UDP).

QUIC은 신뢰할 수 없는 UDP(User Datagram Protocol) 위에서 신뢰성을 제공한다.

- **provides reliability**: 신뢰성을 제공. QUIC이 패킷 재전송, 순서 재조립, 흐름 제어를 직접 구현.
- **on top of**: UDP 위에. UDP는 단순한 운반체로 쓰고, 그 위에 QUIC이 새 계층을 쌓아올림.
- **unreliable UDP**: 신뢰성 없는 UDP. UDP는 패킷을 보내기만 하고 도착 보장·순서 보장 안 함. 빠르지만 책임 안 짐.

---

## 종합

HTTP 버전과 전송 계층의 매핑:

| HTTP 버전 | 전송 계층 | 신뢰성 제공자 |
|---|---|---|
| HTTP/0.9 ~ HTTP/2 | TCP | OS 커널 (TCP) |
| HTTP/3 | QUIC over UDP | QUIC (사용자 공간) |

HTTP가 전송 계층에 요구하는 조건을 단순화하면 단 하나 — "메시지가 보낸 순서대로, 빠짐없이 도착할 것". 이 조건만 만족하면 무엇으로 운반하든 상관없습니다. TCP가 이걸 제공해서 오랫동안 표준이었고, HTTP/3는 같은 조건을 QUIC으로 채울 수 있다는 걸 보여줬습니다.

Official Annotation의 핵심 문장: "HTTP doesn't require the underlying transport protocol to be connection-based; it only requires it to be reliable" — HTTP는 연결 기반이어야 한다고 요구하지 않고, 신뢰성만 요구합니다. UDP는 비연결성(connectionless)이지만 그 위에 QUIC이 신뢰성을 만들어주므로 조건 충족.

이 구분이 왜 중요한가: TCP는 OS 커널의 일부라 업데이트가 느립니다 — 새 알고리즘을 추가하려면 모든 OS가 업데이트되기를 기다려야 합니다. QUIC은 사용자 공간 라이브러리로 구현 가능하므로 Chrome, Firefox 등이 자체 구현을 빠르게 발전시킬 수 있습니다. 또한 QUIC은 처음부터 멀티스트림을 가정하고 설계되어 TCP HOL blocking이 없습니다.

이게 없으면 어떻게 되는가: 만약 HTTP가 "TCP 위에서만 동작"이라고 못박았다면 — TCP HOL blocking을 풀 길이 없었습니다. HTTP가 전송 계층의 구체적 구현을 명시하지 않고 추상 조건(신뢰성)만 요구했기에 — 30년 만에 새 전송 계층으로 갈아탈 수 있었습니다. 추상화의 힘.

오개념 예방: HTTP/3가 UDP를 쓴다고 해서 "신뢰성 없는 빠른 통신"으로 오해하면 안 됩니다. UDP는 단순한 패킷 운반체이고, QUIC이 그 위에 TCP보다 더 정교한 신뢰성·암호화·흐름 제어를 구현합니다. 결과적으로 HTTP/3는 TCP보다 신뢰성이 떨어지지 않으며, 오히려 더 빠른 핸드셰이크(0-RTT)와 연결 마이그레이션 같은 부가 기능을 제공합니다.

AI Annotation 보충: TCP는 재전송과 순서 보장으로 신뢰성을 제공합니다. QUIC은 같은 책임을 지지만, 스트림 단위로 분리 처리한다는 점이 다릅니다 — 한 스트림의 패킷 손실이 다른 스트림에 영향 안 미침. 같은 "신뢰성"이지만 구현 단위가 더 세분화된 것.

---

# HTTP가 stateless 프로토콜이라는 것은 무슨 의미이며, 기본 포트는 무엇인가?

> HTTP is a stateless application-level protocol and it requires a reliable network transport connection to exchange data between client and server.
> In HTTP implementations, TCP/IP connections are used using well-known ports (typically port 80 if the connection is unencrypted or port 443 if the connection is encrypted).

---

## 도입

브라우저로 한 사이트의 여러 페이지를 차례로 방문하면 서버는 매번 "당신은 누구신가요?"부터 시작합니다 — HTTP 자체가 이전 요청을 기억하지 않기 때문입니다. 이게 stateless 프로토콜의 의미이고, 로그인 상태 유지 같은 게 별도 메커니즘(쿠키, 세션, JWT)을 필요로 하는 이유입니다.

---

## 본문

> HTTP is a stateless application-level protocol

HTTP는 stateless(상태 없는) 애플리케이션 수준 프로토콜이다.

- **stateless**: 서버가 이전 요청의 정보를 기억하지 않음. 각 요청은 완전히 독립적이며 자기 자신만으로 해석 가능해야 함.
- **application-level**: OSI 모델의 가장 위층. 사용자가 직접 다루는 데이터 형식과 의미를 정의.

> and it requires a reliable network transport connection to exchange data between client and server.

그리고 클라이언트와 서버 간 데이터 교환을 위해 신뢰할 수 있는 네트워크 전송 연결을 필요로 한다.

- **requires a reliable transport**: HTTP는 stateless지만 그 아래 전송 계층은 신뢰성이 있어야 함. stateless와 reliable은 별개 차원.
- **between client and server**: 양 끝점 사이. 중간 노드가 있어도 결국 최종 서버까지의 신뢰성을 가정.

> In HTTP implementations, TCP/IP connections are used using well-known ports

HTTP 구현체에서는 잘 알려진 포트로 TCP/IP 연결을 사용한다.

- **well-known ports**: 표준으로 정해진 포트. 0-1023 범위에 IANA가 등록한 포트들. HTTP는 80, HTTPS는 443.
- **TCP/IP connections**: HTTP/1.x, HTTP/2까지의 기본. HTTP/3는 UDP 기반 QUIC을 사용 (이 OA는 TCP 시대의 일반적 구현을 설명).

> (typically port 80 if the connection is unencrypted or port 443 if the connection is encrypted).

(보통 암호화되지 않은 연결은 포트 80, 암호화된 연결은 포트 443.)

- **port 80**: HTTP의 기본 포트. URL에 명시 안 하면 자동으로 80.
- **port 443**: HTTPS의 기본 포트. TLS로 암호화된 HTTP.
- **typically**: 보통. 8080, 8443 같은 비표준 포트도 가능하지만 URL에 `:8080`처럼 명시해야 함.

---

## 종합

HTTP의 두 가지 핵심 성격을 정리하면:

| 성격 | 의미 | 결과 |
|---|---|---|
| stateless | 서버가 이전 요청을 기억 안 함 | 매 요청이 독립적, 세션은 별도 메커니즘 필요 |
| 표준 포트 80/443 | 기본 포트 정해짐 | URL에 포트 생략 가능 |

stateless의 실무적 의미를 JS로 풀어보면:

```js
// 첫 요청
await fetch('/api/login', { method: 'POST', body: JSON.stringify({...}) });
// 서버는 "이 사용자가 로그인했다"는 사실을 기억하지 않음

// 두 번째 요청
await fetch('/api/me');
// 서버 입장에서 이 요청은 첫 요청과 무관. "당신은 누구신가요?"
```

서버가 같은 사용자를 인식하려면 클라이언트가 매번 자기 신원을 가져와야 합니다. 이게 쿠키, JWT, Authorization 헤더의 존재 이유입니다.

```js
await fetch('/api/me', {
  headers: { Authorization: 'Bearer eyJhbGc...' }
  //         └─ 매 요청마다 신원을 다시 알림
});
```

이게 없으면 어떻게 되는가: stateless가 아니라면 — 서버가 모든 클라이언트의 상태를 메모리에 들고 있어야 하므로, 동시 사용자 수 ≤ 서버 메모리 한도. stateless는 서버를 무한 확장할 수 있게 합니다(수평 확장). 한 사용자의 다음 요청이 다른 서버에 가도 상관없음 — 매 요청이 자기 완결적이기 때문.

오개념 예방: "HTTP는 stateless니까 세션을 유지할 수 없다"는 잘못된 이해입니다. HTTP 자체는 상태를 유지하지 않지만, 그 위 애플리케이션 레벨에서 쿠키나 토큰으로 세션을 만들 수 있습니다. MDN의 표현이 정확합니다 — "HTTP is stateless, but not sessionless". 프로토콜 레벨에서 stateless이지만 세션은 가능합니다.

AI Annotation 보충: 로그인 상태를 유지하려면 쿠키(`Cookie: sessionId=...`), JWT(`Authorization: Bearer ...`), 또는 hidden form 변수 같은 별도 메커니즘이 필요합니다. 이는 HTTP가 제공하는 기능이 아니라 그 위에서 만들어낸 것 — 이 구분이 stateless 이해의 핵심입니다.

---

# HTTP/1.0의 조건부 GET 요청은 어떤 문제를 해결했으며, 어떤 한계가 있었는가?

> HTTP/1.0 added headers to manage resources cached by a client in order to allow conditional GET requests.
> A server must return the entire content of the requested resource only if its last modified time is not known by the client or if it changed since the last full response to a GET request.
> Header Content-Encoding was added to specify whether the returned content is compressed.
> If the size of the content is not known in advance (i.e. because it is dynamically generated) then the header Content-Length would not be included.
> The client would assume that transfer was complete when the connection closed, but a premature close would leave the client with partial content yet the client would not know it's partial.

---

## 도입

이미지 1MB짜리 한 번 다운로드한 뒤 같은 페이지를 새로고침할 때 — 다시 1MB를 받아오는 건 낭비입니다. 변경되지 않았다면 서버가 "변경 없음, 캐시 그대로 써"라고만 알려주면 됩니다. 이걸 가능하게 한 게 HTTP/1.0의 조건부 GET이고, 동시에 동적 콘텐츠 처리에서 한계도 드러냈습니다.

---

## 본문

> HTTP/1.0 added headers to manage resources cached by a client in order to allow conditional GET requests.

HTTP/1.0은 조건부 GET 요청을 가능하게 하기 위해 클라이언트가 캐시한 리소스를 관리하는 헤더를 추가했다.

- **conditional GET**: "조건이 맞을 때만 데이터를 받겠다"는 GET. "내가 가진 캐시가 최신이면 안 보내도 돼" 같은 조건.
- **manage resources cached by a client**: 클라이언트의 캐시 상태를 서버에게 알려서 서버가 적절히 응답할 수 있게 함.

> A server must return the entire content of the requested resource only if its last modified time is not known by the client or if it changed since the last full response to a GET request.

서버는 클라이언트가 마지막 수정 시간을 모르거나, 마지막 GET 응답 이후 리소스가 변경된 경우에만 전체 콘텐츠를 반환해야 한다.

- **last modified time is not known**: 클라이언트가 처음 요청하는 경우. 비교 기준이 없으니 전체 전송.
- **changed since the last full response**: 클라이언트가 가진 버전 이후 서버에서 변경됐다면 전체 전송. `If-Modified-Since` 헤더로 비교.
- **only if**: 위 두 조건 외에는 전체 전송 안 함. 변경 없음이면 `304 Not Modified` 응답으로 본문 없이 끝.

> Header Content-Encoding was added to specify whether the returned content is compressed.

`Content-Encoding` 헤더가 추가되어 반환된 콘텐츠가 압축되었는지를 명시한다.

- **Content-Encoding**: 인코딩(주로 압축)을 명시. 예: `gzip`, `br`(brotli), `deflate`.
- **compressed**: 압축. 텍스트 응답을 50~80% 줄여 트래픽 절감 — 같은 페이지를 더 빠르게 받을 수 있게 됨.

> If the size of the content is not known in advance (i.e. because it is dynamically generated) then the header Content-Length would not be included.

콘텐츠 크기를 미리 알 수 없으면(즉 동적으로 생성되는 경우) `Content-Length` 헤더는 포함되지 않는다.

- **not known in advance**: 사전에 알 수 없음. DB에서 결과를 가져와 JSON을 만드는 식이면 응답 시작 전엔 크기 미정.
- **dynamically generated**: 동적 생성. 정적 파일이 아니라 매 요청마다 만들어지는 응답.
- **Content-Length would not be included**: 크기를 모르니 헤더에 못 적음. 이게 다음 문장의 문제를 만듭니다.

> The client would assume that transfer was complete when the connection closed,

클라이언트는 연결이 닫히면 전송이 완료됐다고 가정한다.

- **assume that transfer was complete**: 가정. `Content-Length`가 없으니 "어디까지가 끝인지" 다른 단서가 없어, 연결 종료를 끝 신호로 받아들임.
- **when the connection closed**: HTTP/1.0은 응답 후 연결을 닫으므로 종료 = 응답 끝.

> but a premature close would leave the client with partial content yet the client would not know it's partial.

하지만 비정상적으로 일찍 연결이 닫히면 클라이언트는 일부 콘텐츠만 가지게 되지만, 그게 일부라는 사실을 알 수 없다.

- **premature close**: 비정상적 조기 종료. 네트워크 끊김, 서버 크래시, 프록시 타임아웃 등.
- **partial content**: 응답이 잘려 일부만 도착. 예: JSON이 중간에서 끊김.
- **would not know it's partial**: 클라이언트가 잘렸다는 걸 알 수 없음. 끝까지 잘 왔다고 착각하고 진행 → 데이터 손상.

---

## 종합

조건부 GET이 가져온 이득과 한계를 정리하면:

| 측면 | 효과 | 메커니즘 |
|---|---|---|
| 트래픽 절감 | 변경 없으면 본문 안 받음 | `If-Modified-Since` + `304 Not Modified` |
| 압축 | 텍스트 응답 50~80% 절감 | `Content-Encoding: gzip` |
| 한계 1 | 동적 콘텐츠는 `Content-Length` 못 적음 | 크기를 미리 모르니까 |
| 한계 2 | 조기 종료 시 부분 콘텐츠 감지 불가 | 종료 = 끝 가정의 취약점 |

JS 개발자에게 와닿는 시나리오:

```js
// fetch가 완료되었지만 사실 응답이 잘렸다면?
const res = await fetch('/api/long-list');
const data = await res.json();  // 파싱 에러? 아니면 잘린 채 통과?
```

HTTP/1.0의 한계로는 클라이언트가 "잘림"을 감지할 수 없었고, 이는 데이터 무결성 문제로 이어졌습니다. HTTP/1.1이 chunked transfer encoding을 도입해 — 각 청크의 크기를 명시하고, 크기 0인 종료 마커 청크로 "정상 종료"를 알리도록 해서 이 문제를 해결했습니다.

이게 없으면 어떻게 되는가: 조건부 GET이 없었다면 — 매 새로고침마다 같은 이미지·CSS·JS를 다시 다운로드해야 했을 것입니다. 페이지 로드는 매번 처음부터, 트래픽은 폭증, 모바일 데이터 요금 부담 — 웹의 사용성이 지금과 비교할 수 없이 나빴을 것입니다. 조건부 GET이 캐시 없는 인터넷을 캐시 있는 인터넷으로 바꿨습니다.

오개념 예방: `304 Not Modified` 응답을 받았다고 해서 "리소스가 변경되지 않았다"고 100% 보장되지는 않습니다. `Last-Modified` 시간 비교의 한계 때문 — 같은 초 안에 두 번 변경되면 첫 번째 변경을 놓칠 수 있습니다. 그래서 HTTP/1.1이 `ETag`를 도입해 콘텐츠 해시 기반 비교를 가능하게 했습니다.

AI Annotation 보충: 조건부 GET의 핵심은 "리소스가 변경되지 않았으면 서버가 전체 콘텐츠를 다시 보내지 않는다 (304 Not Modified)"입니다. 하지만 동적 콘텐츠는 크기를 미리 알 수 없어 `Content-Length`가 빠지고, 연결이 비정상 종료되면 클라이언트가 불완전한 콘텐츠를 완전하다고 착각하는 문제가 있었습니다 — 이는 HTTP/1.1의 chunked encoding이 해결한 영역입니다.

---

# HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?

> Chunked transfer encoding allows content to be streamed in chunks in order to reliably send it even when the server does not know its length in advance (i.e. because it is dynamically generated, etc.).
> Byte range serving allows a client to request portions (ranges of bytes) of a resource.
> This is useful to resume an interrupted download (when a file is very large), when only a part of a content has to be shown or dynamically added to the already visible part by a browser in order to spare time, bandwidth and system resources, etc.

---

## 도입

HTTP/1.0의 두 가지 한계를 떠올려 보세요 — 동적 콘텐츠는 크기를 미리 못 알리고, 큰 파일을 다운로드하다 끊기면 처음부터 다시. HTTP/1.1은 이 둘을 각각 `Transfer-Encoding: chunked`와 `Range` 헤더로 해결했습니다. 둘 다 "한 번에 다 받지 않아도 되는" 메커니즘이지만 동기와 사용처가 다릅니다.

---

## 본문

> Chunked transfer encoding allows content to be streamed in chunks

chunked transfer encoding은 콘텐츠가 청크 단위로 스트리밍되도록 한다.

- **chunked transfer encoding**: 콘텐츠를 작은 조각(청크)으로 나누어 전송하는 방식. `Transfer-Encoding: chunked` 헤더로 활성화.
- **streamed in chunks**: 청크 단위 스트리밍. 큰 응답을 한 번에 다 만들고 보내는 게 아니라, 만드는 대로 흘려보냄.

> in order to reliably send it even when the server does not know its length in advance (i.e. because it is dynamically generated, etc.).

서버가 콘텐츠 길이를 미리 모를 때(즉 동적으로 생성될 때 등)에도 안정적으로 전송하기 위해서다.

- **reliably send**: 안정적 전송. 각 청크가 자기 크기를 명시하고, 크기 0인 청크가 종료 신호 — 클라이언트가 잘림 감지 가능.
- **does not know its length in advance**: 사전에 길이 모름. DB 쿼리 결과를 JSON으로 변환하는 동안엔 최종 크기가 미정.
- **dynamically generated**: 동적 생성. 매 요청마다 다른 응답을 만드는 API.

> Byte range serving allows a client to request portions (ranges of bytes) of a resource.

byte range serving은 클라이언트가 리소스의 일부(바이트 범위)를 요청할 수 있게 한다.

- **byte range serving**: 리소스의 특정 바이트 범위만 요청·응답하는 메커니즘. `Range: bytes=1000-2000` 헤더 사용.
- **portions (ranges of bytes)**: 일부분. 1MB 파일에서 500KB 지점부터 1MB 지점까지 — 같은 식으로 부분만 가져옴.

> This is useful to resume an interrupted download (when a file is very large),

이는 큰 파일의 다운로드가 중단됐을 때 이어받기에 유용하다.

- **resume an interrupted download**: 중단된 다운로드 이어받기. 100MB 중 70MB 받고 끊기면, 다음에 71MB부터 요청.
- **very large**: 매우 큰. 작은 파일은 처음부터 다시 받아도 부담 없지만 GB 단위면 이어받기가 필수.

> when only a part of a content has to be shown or dynamically added to the already visible part by a browser in order to spare time, bandwidth and system resources, etc.

또는 콘텐츠의 일부만 표시되어야 하거나 이미 보이는 부분에 동적으로 추가되어야 할 때, 시간·대역폭·시스템 자원을 아끼기 위해 사용된다.

- **only a part of a content**: 일부만. 비디오 스트리밍에서 "보고 있는 구간만" 다운로드하는 경우.
- **dynamically added to the already visible part**: 이미 보이는 부분에 추가. 예: 무한 스크롤로 이미지를 더 받아오기.
- **spare time, bandwidth and system resources**: 시간·대역폭·자원 절감. 다 다운로드 안 해도 되니까.

---

## 종합

두 메커니즘의 비교:

| 메커니즘 | 헤더 | 해결 문제 | 실무 예 |
|---|---|---|---|
| Chunked encoding | `Transfer-Encoding: chunked` | 서버가 크기를 모르고 보내야 함 | 스트리밍 API, SSE, 서버 응답 압축 |
| Byte range | 요청: `Range: bytes=N-M` / 응답: `Content-Range`, `206 Partial Content` | 리소스 일부만 받기 / 이어받기 | 비디오 스트리밍, 큰 파일 다운로드 |

방향이 반대입니다 — chunked는 서버 측 편의(크기 미상이어도 보낼 수 있게), byte range는 클라이언트 측 편의(필요한 부분만 받게).

JS/브라우저에서 직접 만나는 사례:

**Chunked encoding**:

```js
// Server-Sent Events는 chunked encoding 위에서 동작
const eventSource = new EventSource('/api/stream');
eventSource.onmessage = (e) => console.log(e.data);
// 서버는 응답을 닫지 않고 청크를 계속 흘려보냄
```

```js
// Streaming JSON / fetch ReadableStream
const res = await fetch('/api/large-list');
const reader = res.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 청크 단위로 처리
}
```

**Byte range**:

```html
<!-- 비디오 태그가 자동으로 Range 헤더 사용 -->
<video src="/movie.mp4" controls></video>
```

브라우저가 비디오를 한 번에 다 다운로드하지 않고, 사용자가 특정 시간으로 점프하면 그 구간부터의 바이트 범위만 요청합니다. DevTools Network 탭에서 비디오 요청을 보면 `Range: bytes=...` 헤더와 `206 Partial Content` 응답을 확인할 수 있습니다.

이게 없으면 어떻게 되는가:

- chunked encoding이 없으면 — 동적 응답 시작 전에 서버가 전체 응답을 메모리에 모아 길이 계산해야 함. 큰 응답이면 메모리 폭증, SSE 같은 무한 스트림은 아예 불가능.
- byte range가 없으면 — 다운로드 중단 시 처음부터 다시. 비디오 스트리밍이라는 개념 자체가 성립 안 됨.

오개념 예방: chunked encoding이 활성화된 응답은 `Content-Length` 헤더가 빠지고 대신 `Transfer-Encoding: chunked`가 들어갑니다. 이 둘은 함께 쓰지 않습니다 — 청크의 마지막(크기 0)이 종료 신호이므로 별도 길이가 불필요.

AI Annotation 보충: chunked encoding은 HTTP/1.0의 "Content-Length 없으면 연결 닫힐 때까지 기다리기" 문제를 해결했습니다. 청크마다 크기를 명시하고, 크기 0인 청크가 전송 완료를 알립니다. byte range serving은 `Range: bytes=1000-2000` 헤더로 특정 범위만 요청하며, 대용량 파일 이어받기의 원리입니다.

---

# HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?

> As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.
> If a web application needs an application session, it implements it via HTTP cookies, hidden variables in a web form or another mechanism.

---

## 도입

HTTP가 stateless라는 게 "서버가 클라이언트를 기억할 수 없다"라는 뜻이라면, 어떻게 한 번 로그인한 사용자가 다음 요청에서도 로그인 상태일 수 있을까요? 답은 — HTTP 자체는 기억 안 하지만, 그 위에서 동작하는 웹 애플리케이션이 별도 메커니즘으로 기억을 만들어냅니다. 여기서 가장 흔한 메커니즘이 쿠키입니다.

---

## 본문

> As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.

stateless 프로토콜로서, HTTP는 웹 서버가 여러 요청 동안 각 사용자에 대한 정보나 상태를 유지하도록 요구하지 않는다.

- **does not require**: 요구하지 않음. 유지하지 말라는 게 아니라, 유지할 필요가 없다는 의미. 서버가 자율적으로 결정.
- **retain information or status**: 정보나 상태 보존. 누가 로그인했는지, 무슨 메뉴를 봤는지 등의 사용자별 데이터.
- **for the duration of multiple requests**: 여러 요청에 걸쳐. 한 요청 안에서가 아니라 여러 요청을 가로지르는 시간 단위.

> If a web application needs an application session,

웹 애플리케이션이 애플리케이션 세션을 필요로 한다면.

- **needs an application session**: 세션이 필요하다면. 모든 사이트가 세션을 필요로 하지는 않습니다 — 정적 사이트, 단순 조회 API는 세션 없이도 동작.
- **application session**: 애플리케이션 레벨의 세션. HTTP 프로토콜의 세션이 아니라, 그 위 애플리케이션이 만든 개념.

> it implements it via HTTP cookies, hidden variables in a web form or another mechanism.

HTTP 쿠키, 웹 폼의 hidden 변수, 또는 다른 메커니즘을 통해 구현한다.

- **HTTP cookies**: 가장 흔한 방법. 서버가 응답 헤더 `Set-Cookie`로 식별자를 보내고, 클라이언트가 이후 모든 요청에 `Cookie` 헤더로 다시 보냄.
- **hidden variables in a web form**: 폼의 숨김 필드(`<input type="hidden">`). 페이지 간 이동 시 폼 제출로 상태를 다음 요청에 실어 보냄. 옛날 방식.
- **another mechanism**: 다른 메커니즘. JWT 토큰을 `Authorization` 헤더로 보내기, URL의 query string에 세션 ID 박기, localStorage + 매 요청 헤더 추가 등.

---

## 종합

HTTP의 stateless 위에 세션을 만드는 방법들:

| 메커니즘 | 방식 | 장점 | 단점 |
|---|---|---|---|
| 쿠키 (세션 ID) | 서버가 세션 ID 발급 → 매 요청에 자동 첨부 | 자동 전송, 보안 옵션(HttpOnly, Secure) | CSRF 취약, 도메인 제한 |
| JWT (Bearer 토큰) | 서명된 토큰을 클라이언트가 저장, `Authorization` 헤더로 수동 첨부 | 무상태 서버 가능, 페이로드에 정보 포함 | 토큰 무효화 어려움 |
| URL 파라미터 | `?session=abc123` | 쿠키 못 쓸 때 fallback | 로그·북마크에 노출, 보안 약함 |
| Hidden form 변수 | 폼 제출로만 세션 전달 | 단순 | 클릭 흐름 외엔 못 씀 (사장됨) |

JS 코드에서 세션이 어떻게 작동하는지 보면:

```js
// 1. 로그인: 서버가 Set-Cookie로 세션 ID 응답
const res = await fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({ id, pw }),
  credentials: 'include'  // 쿠키 받겠다
});
// 응답 헤더에 Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict

// 2. 다음 요청: 브라우저가 쿠키 자동 첨부
const me = await fetch('/api/me', { credentials: 'include' });
// 요청 헤더에 Cookie: sessionId=abc123 자동 추가
// 서버는 이 ID로 사용자 식별
```

서버는 여전히 stateless하게 보일 수 있습니다 — 매 요청에 첨부된 세션 ID를 보고 DB나 Redis에서 사용자 정보를 조회하면 됩니다. 또는 JWT처럼 토큰 자체에 사용자 ID가 들어있어 DB 조회 없이 식별할 수도 있습니다.

이게 없으면 어떻게 되는가: 세션 메커니즘이 없다면 — 매 요청마다 사용자가 ID/PW를 다시 입력해야 합니다. 페이지 한 번 이동할 때마다 로그인 화면. 사용자 경험은 처참하고, 보안적으로도 자격증명을 자주 평문으로 처리하게 되어 노출 위험만 커집니다.

오개념 예방: "HTTP가 stateless면 세션을 유지할 수 없다"는 잘못입니다. MDN의 표현이 정확합니다 — "HTTP is stateless, but not sessionless". HTTP 자체는 상태를 유지하지 않지만, HTTP 헤더와 쿠키 메커니즘을 활용하면 그 위에서 stateful한 세션을 만들 수 있습니다. 이 분리가 HTTP의 단순함과 애플리케이션의 유연함을 동시에 가능하게 합니다.

이 stateless 설계는 서버 확장에도 유리합니다 — 클라이언트의 N번째 요청이 첫 요청과 같은 서버에 가지 않아도 됩니다. 세션 정보를 모든 서버가 공유하는 저장소(Redis 등)에 두면, 어느 서버가 처리해도 동일한 세션 인식이 가능합니다.

AI Annotation 보충: 세션은 애플리케이션 레벨에서 쿠키, hidden 변수 등으로 구현합니다. HTTP가 제공하는 기능이 아니라 그 위에서 만들어낸 것 — 이 구분을 명확히 가져가는 게 중요합니다. HTTP/Cookie/Application의 각 책임을 분리해서 보면 보안 설계도 정확해집니다.

---

# 웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?

> Typically, to start a session, an interactive login is performed, and to end a session, a logout is requested by the user.
> These kind of operations use a custom authentication mechanism, not HTTP authentication.
> HTTP provides multiple authentication schemes such as basic access authentication and digest access authentication which operate via a challenge-response mechanism whereby the server identifies and issues a challenge before serving the requested content.
> The authentication mechanisms described above belong to the HTTP protocol and are managed by client and server HTTP software (if configured to require authentication before allowing client access to one or more web resources), and not by the web applications using an application session.

---

## 도입

"로그인"이라고 말할 때 두 가지 다른 것이 있습니다 — 하나는 우리가 매일 쓰는 웹 폼 로그인(쿠키, JWT), 다른 하나는 브라우저가 갑자기 띄우는 "User Name / Password" 다이얼로그(Basic/Digest). 둘 다 같은 목적이지만 동작 계층이 다릅니다 — 전자는 애플리케이션 레벨, 후자는 HTTP 프로토콜 레벨.

---

## 본문

> Typically, to start a session, an interactive login is performed, and to end a session, a logout is requested by the user.

보통 세션을 시작하려면 대화형 로그인이 수행되고, 세션을 종료하려면 사용자가 로그아웃을 요청한다.

- **interactive login**: 대화형 로그인. 사용자가 폼에 ID/PW 입력하고 제출. 서버가 폼 데이터를 받아 검증.
- **start a session / end a session**: 세션 시작·종료. 애플리케이션이 명시적으로 관리하는 시작점과 끝점.

> These kind of operations use a custom authentication mechanism, not HTTP authentication.

이런 종류의 동작들은 HTTP 인증이 아닌 커스텀 인증 메커니즘을 사용한다.

- **custom authentication mechanism**: 커스텀 인증. 표준 HTTP가 정한 게 아니라 애플리케이션이 자기 방식으로 만든 것.
- **not HTTP authentication**: HTTP 인증이 아님. 폼 로그인은 HTTP 표준의 인증 방식이 아니라 그 위 애플리케이션 로직.

> HTTP provides multiple authentication schemes such as basic access authentication and digest access authentication

HTTP는 basic 접근 인증과 digest 접근 인증 같은 여러 인증 방식을 제공한다.

- **basic access authentication**: 가장 단순한 HTTP 인증. ID:PW를 Base64로 인코딩해 `Authorization: Basic ...` 헤더로 전송. HTTPS 위에서만 안전.
- **digest access authentication**: 패스워드 해시를 사용하는 더 안전한 방식. 평문 PW 전송 안 함.

> which operate via a challenge-response mechanism whereby the server identifies and issues a challenge before serving the requested content.

이 방식들은 challenge-response 메커니즘으로 동작하며, 서버가 콘텐츠를 제공하기 전에 식별하고 challenge를 발행한다.

- **challenge-response**: 서버가 먼저 "증명해 봐"라는 도전(challenge)을 보내고, 클라이언트가 응답(response)으로 자격증명을 제공.
- **issues a challenge before serving**: 콘텐츠 제공 전에 challenge. 즉, 인증 안 된 요청에 대해 서버가 `401 Unauthorized` + `WWW-Authenticate` 헤더로 "인증 필요"를 알림. 브라우저가 이를 받으면 사용자에게 다이얼로그를 띄움.

> The authentication mechanisms described above belong to the HTTP protocol and are managed by client and server HTTP software

위에서 설명한 인증 메커니즘은 HTTP 프로토콜에 속하며, 클라이언트와 서버의 HTTP 소프트웨어가 관리한다.

- **belong to the HTTP protocol**: HTTP 프로토콜의 일부. 표준이 명시한 인증 방식.
- **client and server HTTP software**: 브라우저와 웹서버. 웹 애플리케이션 코드가 아니라 그 아래 인프라 레벨 — Apache, nginx 설정으로 활성화하면 브라우저가 자동으로 다이얼로그를 띄움.

> (if configured to require authentication before allowing client access to one or more web resources), and not by the web applications using an application session.

(특정 웹 리소스에 클라이언트가 접근하기 전 인증을 요구하도록 설정된 경우), 애플리케이션 세션을 사용하는 웹 애플리케이션이 관리하는 게 아니다.

- **if configured**: 설정한 경우에만. nginx의 `auth_basic` 같은 설정이 있어야 활성화.
- **not by the web applications**: 애플리케이션이 아닌 웹 서버 미들웨어가 처리. 애플리케이션 코드는 인증된 사용자가 들어왔을 때 동작.

---

## 종합

두 방식의 비교:

| 항목 | 세션 기반 로그인 (커스텀) | HTTP 인증 (Basic/Digest) |
|---|---|---|
| 관리 주체 | 웹 애플리케이션 | HTTP 소프트웨어 (서버, 브라우저) |
| 동작 계층 | 애플리케이션 | 프로토콜 |
| UI | 사이트가 디자인한 폼 | 브라우저 기본 다이얼로그 |
| 인증 정보 전달 | 쿠키, JWT, Authorization 등 자유 | `Authorization: Basic/Digest ...` 헤더 |
| 로그아웃 | 명시적 (세션 무효화) | 어려움 (브라우저가 캐시) |
| 사용 비율 | 거의 모든 웹 서비스 | 내부 도구, 단순 보호된 디렉토리 |

JS 개발자가 일상적으로 만지는 건 세션 기반:

```js
// 폼 로그인 — 애플리케이션이 모든 걸 제어
const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, password })
});
// 서버가 Set-Cookie: sessionId=... 응답
```

HTTP 인증은 가끔 마주칩니다 — 회사 내부 도구, 단순 보호된 정적 사이트:

```http
GET /admin HTTP/1.1
Host: example.com
                                    ← 인증 헤더 없음

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="Admin"
                                    ← 브라우저가 다이얼로그 자동 표시
```

이게 없으면 어떻게 되는가:

- HTTP 인증만 있고 세션 기반이 없었다면 — 모든 사이트가 못생긴 브라우저 다이얼로그를 써야 함. UX 디자인 거의 불가능. 로그아웃 버튼도 못 만들어요(브라우저가 자격증명 캐시).
- 세션 기반만 있고 HTTP 인증이 없었다면 — 단순 정적 디렉토리 보호도 애플리케이션 코드 작성 필요. nginx 한 줄 설정으로 해결되던 것을 PHP/Node 코드로 짜야 함.

오개념 예방: 폼 로그인 후 `Authorization: Bearer <jwt>` 헤더를 쓰는 건 "HTTP 인증을 사용하는 것"이 아닙니다. HTTP 표준이 정한 Bearer 스킴을 차용하는 것은 맞지만, 토큰 발급·검증·만료 관리는 애플리케이션이 합니다 — 즉 "Authorization 헤더라는 표준 형식을 빌려쓰는 커스텀 인증"입니다.

AI Annotation 보충: 세션 기반 로그인은 웹 애플리케이션이 관리하는 커스텀 인증입니다. HTTP 인증(Basic/Digest)은 프로토콜 레벨에서 HTTP 소프트웨어(웹서버, 브라우저)가 관리하며, 서버가 먼저 challenge를 보내고 클라이언트가 인증 정보로 응답하는 challenge-response 방식입니다. 대부분의 현대 웹앱은 전자(세션 기반)를 사용합니다.

---

# HTTP 메시지의 기본 구조는 어떻게 구성되는가?

> At the highest level, a message consists of a header followed by a body.
> A header consists of lines of ASCII text; each terminated with a carriage return and line feed sequence.
> A body consists of data in any format; not limited to ASCII.
> The format must match that specified by the Content-Type header field if the message contains one.
> A body is optional or, in other words, can be blank.

---

## 도입

Chrome DevTools Network 탭에서 한 요청을 클릭하면 Headers, Payload, Response 같은 섹션이 보입니다. 이게 모두 HTTP 메시지의 일부입니다. 메시지 구조를 큰 그림으로 정리하면 — 헤더와 본문으로 나뉘고, 사이에 빈 줄이 경계입니다. 단순한 구조이지만 이 단순함이 30년 넘게 표준으로 살아남은 이유 중 하나입니다.

---

## 본문

> At the highest level, a message consists of a header followed by a body.

가장 큰 수준에서, 메시지는 헤더와 그 뒤를 따르는 본문으로 구성된다.

- **highest level**: 가장 큰 그림. 세부로 들어가면 헤더 안에 시작 줄·헤더 필드들이 있고 본문 안에 다양한 형식이 있지만, 외관은 헤더+본문 두 덩어리.
- **header followed by a body**: 헤더가 먼저, 본문이 뒤. 순서가 정해져 있어서 파서가 헤더를 다 읽으면 본문 시작점을 알 수 있음.

> A header consists of lines of ASCII text; each terminated with a carriage return and line feed sequence.

헤더는 ASCII 텍스트의 라인들로 구성되며, 각 라인은 CR(carriage return)과 LF(line feed) 시퀀스로 끝난다.

- **ASCII text**: HTTP/1.x의 헤더는 사람이 읽을 수 있는 텍스트. HTTP/2/3는 바이너리 프레임으로 인코딩하지만 의미상 동일한 내용.
- **lines**: 한 줄에 하나의 헤더 필드. `Content-Type: application/json`이 한 줄, `Authorization: Bearer ...`가 다음 줄.
- **carriage return and line feed (CR LF)**: `\r\n`. 줄 구분자. 두 번 연속(`\r\n\r\n`)이면 헤더 끝 + 본문 시작 신호.

> A body consists of data in any format; not limited to ASCII.

본문은 어떤 형식의 데이터든 포함할 수 있고, ASCII에 제한되지 않는다.

- **any format**: 모든 형식. JSON, HTML, 이미지(JPEG·PNG), 비디오(MP4), 바이너리 파일까지. 형식 제약 없음.
- **not limited to ASCII**: 헤더와 다르게 본문은 바이너리도 가능. PNG 이미지의 바이트 그대로 본문에 실림.

> The format must match that specified by the Content-Type header field if the message contains one.

본문이 있는 경우, 형식은 `Content-Type` 헤더 필드가 명시한 것과 일치해야 한다.

- **must match**: 일치해야 함. `Content-Type: application/json`인데 본문이 HTML이면 클라이언트가 파싱 실패.
- **Content-Type**: 본문의 MIME 타입을 알리는 헤더. 클라이언트는 이 값을 보고 본문을 어떻게 해석할지 결정 — `text/html`이면 렌더링, `application/json`이면 파싱.

> A body is optional or, in other words, can be blank.

본문은 선택적이며, 다시 말해 비어 있을 수 있다.

- **optional**: 있어도 되고 없어도 됨. GET 요청은 보통 본문 없음, `204 No Content` 응답은 본문 없음.
- **can be blank**: 비어 있을 수 있음. 헤더만으로 의미가 완결되는 메시지가 많음.

---

## 종합

HTTP 메시지의 시각적 구조:

```
┌─────────────────────────────────┐
│ 시작 줄 (Request/Status Line)   │
├─────────────────────────────────┤
│ Header Field 1: value           │
│ Header Field 2: value           │  ← 헤더 (ASCII 텍스트)
│ Header Field N: value           │
├─────────────────────────────────┤
│ (빈 줄 = \r\n\r\n)              │  ← 헤더와 본문의 경계
├─────────────────────────────────┤
│ Body (선택, 어떤 형식이든)       │  ← 본문 (바이너리 가능)
└─────────────────────────────────┘
```

실제 요청 예시:

```http
POST /api/users HTTP/1.1                       ← 시작 줄
Host: api.example.com                          ← 헤더 시작
Content-Type: application/json
Content-Length: 28
Authorization: Bearer eyJhbGc...
                                               ← 빈 줄 (헤더 끝)
{"name":"Alice","age":30}                       ← 본문 (JSON)
```

응답 예시:

```http
HTTP/1.1 200 OK                                ← 시작 줄
Content-Type: application/json
Content-Length: 50
                                               ← 빈 줄
{"id":123,"name":"Alice","createdAt":"2024-..."} ← 본문
```

JS 개발자가 만지는 부분:

```js
const res = await fetch('/api/users', {
  method: 'POST',
  headers: {                          // ← 헤더
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({              // ← 본문
    name: 'Alice', age: 30
  })
});

console.log(res.status);              // 시작 줄의 상태 코드
console.log(res.headers.get('content-type')); // 응답 헤더
const data = await res.json();        // 응답 본문 (Content-Type에 따라 파싱)
```

이게 없으면 어떻게 되는가: 헤더와 본문 사이의 빈 줄(`\r\n\r\n`) 경계가 없다면 — 파서가 어디까지 헤더이고 어디부터 본문인지 알 수 없습니다. 헤더는 길이가 가변적이라 사전에 알 수 없으므로 명시적 경계 마커가 필수입니다. 단순한 빈 줄이 이 역할을 우아하게 처리합니다.

오개념 예방: GET 요청도 본문을 가질 수 있긴 합니다(스펙상 금지가 아님). 하지만 `Content-Length`나 `Transfer-Encoding`이 없는 GET 본문은 많은 서버·프록시가 무시하므로 실무적으로는 GET 본문을 쓰지 않는 게 관례입니다.

AI Annotation 보충: 헤더는 시작 줄(Start line) → 헤더 필드들(0개 이상) → 빈 줄(헤더 끝 표시)의 구조입니다. 본문은 모든 형식이 가능하며(JSON, HTML, 이미지 등), `Content-Type` 헤더로 형식을 명시합니다. HTTP/2부터는 텍스트 표현 대신 바이너리 프레임으로 인코딩되지만 — 헤더와 본문의 의미상 구조는 동일하게 유지됩니다.

---

# HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?

> Later versions, HTTP/2 and HTTP/3, use a binary protocol, where headers are encoded in a single HEADERS and zero or more CONTINUATION frames using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.
> The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

---

## 도입

HTTP/1.1까지는 메시지를 텔넷으로 직접 타이핑할 수 있을 만큼 사람이 읽기 좋은 텍스트였습니다. HTTP/2부터는 바이너리로 바뀌어 직접 읽을 수 없습니다 — 대신 컴퓨터가 처리하기 빠르고, 압축으로 트래픽이 줄어듭니다. 무엇이 어떻게 바뀌었는지 봅니다.

---

## 본문

> Later versions, HTTP/2 and HTTP/3, use a binary protocol,

후속 버전인 HTTP/2와 HTTP/3는 바이너리 프로토콜을 사용한다.

- **binary protocol**: 사람이 직접 읽을 수 없는 0과 1의 비트 단위 메시지. 패킷 캡처 도구로 봐도 의미 없는 바이트로 보임.
- **Later versions**: HTTP/1.x 다음 세대. HTTP/2(2015), HTTP/3(2022)가 모두 바이너리.

> where headers are encoded in a single HEADERS and zero or more CONTINUATION frames

헤더는 하나의 HEADERS 프레임과 0개 이상의 CONTINUATION 프레임으로 인코딩된다.

- **HEADERS frame**: 헤더 정보를 담는 메인 프레임. HTTP/2의 메시지는 여러 종류의 프레임으로 분해됨 — HEADERS(헤더), DATA(본문), SETTINGS(설정), 등등.
- **CONTINUATION frames**: HEADERS가 한 프레임에 다 안 들어갈 때 추가로 이어지는 프레임. 매우 큰 헤더(쿠키 등)를 분할 가능.
- **frames**: 프레임. 바이너리 데이터의 최소 단위. 각 프레임이 자기 타입과 길이를 명시 — 파서가 명확히 구분 가능.

> using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.

HPACK(HTTP/2)이나 QPACK(HTTP/3)을 사용해 효율적인 헤더 압축을 제공한다.

- **HPACK / QPACK**: HTTP 헤더 전용 압축 알고리즘. 자주 등장하는 헤더(`Content-Type`, `User-Agent` 등)를 사전 인덱스로 표현.
- **header compression**: 헤더 압축. 같은 요청이 반복되면 두 번째부터는 헤더 거의 없이 인덱스만 보냄. 모바일·고지연 환경에서 큰 효과.

> The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

HTTP/1의 요청·응답 라인은 콜론(:)으로 시작하는 여러 pseudo-header 필드로 대체됐다.

- **request or response line**: HTTP/1.x의 시작 줄. 요청은 `GET / HTTP/1.1`, 응답은 `HTTP/1.1 200 OK`.
- **pseudo-header fields**: 가짜 헤더. 일반 헤더처럼 생겼지만 시작 줄의 정보(메서드, 경로, 상태 코드 등)를 담는 특수 필드.
- **beginning with a colon (:)**: 콜론으로 시작. `:method`, `:path`, `:scheme`, `:authority`, `:status` — 일반 헤더와 시각적으로 구분.

---

## 종합

HTTP/1.1과 HTTP/2+의 비교:

| 항목 | HTTP/1.1 | HTTP/2+ |
|---|---|---|
| 인코딩 | ASCII 텍스트 | 바이너리 프레임 |
| 사람이 읽기 | 가능 (텔넷으로 타이핑 가능) | 불가능 |
| 헤더 압축 | 없음 (gzip은 본문만) | HPACK / QPACK |
| 시작 줄 | `GET / HTTP/1.1` 형태 | pseudo-header (`:method: GET`, `:path: /`) |
| 메시지 단위 | 한 메시지 = 한 덩어리 | 한 메시지 = 여러 프레임 |
| 멀티플렉싱 | 직렬 | 병렬 (스트림 단위) |

HTTP/1.1 요청:

```
GET /api/users HTTP/1.1
Host: example.com
Accept: application/json
```

HTTP/2 같은 요청을 의미상 표현하면:

```
:method: GET
:scheme: https
:authority: example.com
:path: /api/users
accept: application/json
```

(실제로는 위 텍스트가 HPACK 압축 + 바이너리 프레임으로 인코딩됩니다)

JS 개발자에게 와닿는 지점:

- `fetch()` 코드는 동일. 같은 코드가 HTTP/1.1·HTTP/2·HTTP/3 모두에서 작동
- DevTools Network 탭은 HTTP/2 메시지도 HTTP/1.1 형식으로 보여줌 — 사람이 이해하기 위해 디코딩해서 표시
- DevTools Protocol 컬럼으로 실제 어느 버전인지 확인 가능 (`http/1.1`, `h2`, `h3`)

이게 없으면 어떻게 되는가:

- 바이너리화가 없었다면 — 메시지 파싱이 더 복잡(각 헤더 끝을 찾기 위해 줄 단위 스캔 필요), 멀티플렉싱이 거의 불가능(텍스트 메시지를 어떻게 인터리브할지 모호).
- HPACK/QPACK 같은 헤더 압축이 없었다면 — 매 요청마다 같은 쿠키·User-Agent를 또 보내야 함. 모바일 데이터 낭비 + 트래픽 비용 증가.

오개념 예방: HTTP/2가 바이너리라고 해서 HTTP/1.1의 "의미"가 바뀐 건 아닙니다. 메서드, 경로, 헤더, 상태 코드, 본문 — 모두 그대로입니다. 단지 전송 형식만 바뀐 거예요. 그래서 DevTools가 HTTP/2 응답도 HTTP/1.1 형식으로 디코딩해 보여줄 수 있습니다.

Official Annotation 보충: HTTP는 HTTP/2의 프레임 인캡슐레이션이 추가된 후에도 일반적으로 사람이 읽기 쉽도록 설계됩니다. 원본 HTTP 메시지의 일부만 이 버전에서 전송되더라도, 각 메시지의 의미는 변하지 않으며 클라이언트는 (가상으로) 원본 HTTP/1.1 요청을 재구성합니다. 따라서 HTTP/2 메시지도 HTTP/1.1 형식으로 이해하는 것이 유용합니다.

AI Annotation 보충: HTTP/2는 전송 최적화이지 프로토콜 의미의 변경이 아닙니다. DevTools가 HTTP/2 요청도 HTTP/1.1 형식으로 보여주는 이유가 이 때문입니다 — 의미상 동일하기 때문에 사람이 이해하기 쉬운 텍스트 형식으로 디코딩 가능합니다.

---

# HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?

> A header field represents metadata about the containing message.
> A header field line is formatted as a name-value pair with a colon separator.
> Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.
> Unlike a method name that must match exactly (case-sensitive), a header field name is matched ignoring case although often shown with each word capitalized.

---

## 도입

`fetch('/api', { headers: { 'Content-Type': 'application/json' } })` 한 줄에 등장하는 `Content-Type`이 헤더 필드입니다. 메시지의 본문이 무엇인지·어떻게 처리할지·누가 보냈는지 같은 메타정보를 키-값 쌍으로 표현합니다. 이 단순한 형식 규칙이 HTTP 메시지의 거의 모든 부가 정보를 담아냅니다.

---

## 본문

> A header field represents metadata about the containing message.

헤더 필드는 그 메시지에 대한 메타데이터를 나타낸다.

- **header field**: 한 줄짜리 키-값 쌍. `Content-Type: application/json`이 한 헤더 필드.
- **metadata about the containing message**: 메시지 자체에 대한 정보. 본문이 무엇인지, 어떻게 인코딩됐는지, 캐시 정책은 무엇인지 등 — 본문과 별도의 부가 정보.

> A header field line is formatted as a name-value pair with a colon separator.

헤더 필드 라인은 콜론을 구분자로 한 이름-값 쌍으로 포맷된다.

- **name-value pair**: 이름과 값의 쌍. 키-값 구조.
- **colon separator**: 콜론(`:`)이 둘을 가름. `Content-Type: application/json` — 콜론 왼쪽이 이름, 오른쪽이 값.

> Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.

이름 주변에는 공백이 허용되지 않지만, 값 부분의 앞뒤 공백은 무시된다.

- **whitespace not allowed around the name**: 이름 앞뒤로 공백 금지. `Content-Type :`처럼 콜론 앞에 공백을 두면 무효.
- **leading and trailing whitespace is ignored for the value**: 값의 앞뒤 공백은 파서가 알아서 잘라냄. `Content-Type:   application/json`도 정상으로 처리.

> Unlike a method name that must match exactly (case-sensitive),

메서드 이름은 정확히 일치해야 하는(대소문자 구분) 것과 다르게.

- **method name**: GET, POST, PUT 같은 메서드. `get`은 정상 동작 안 함, 반드시 `GET`.
- **case-sensitive**: 대소문자 구분. 메서드는 무조건 대문자 표준.

> a header field name is matched ignoring case although often shown with each word capitalized.

헤더 필드 이름은 대소문자를 무시하고 매칭되며, 다만 각 단어를 대문자로 시작하는 형태로 자주 표시된다.

- **matched ignoring case**: 매칭 시 대소문자 무시. `Content-Type`과 `content-type`과 `CONTENT-TYPE` 모두 같은 헤더로 처리.
- **shown with each word capitalized**: 표시할 땐 단어 첫 글자 대문자(Title-Case) 관습. `Content-Type`, `User-Agent`, `Cache-Control`. 단순 관행이라 강제는 아님.

---

## 종합

헤더 필드의 형식 규칙을 정리하면:

| 규칙 | 예 (정상) | 예 (이상하지만 동작) |
|---|---|---|
| `이름: 값` | `Content-Type: application/json` | — |
| 이름 주변 공백 금지 | `Content-Type:` | `Content-Type :` (틀림) |
| 값 앞뒤 공백 허용 | `Content-Type: application/json` | `Content-Type:   application/json   ` (정상) |
| 이름 대소문자 무시 | `Content-Type` | `content-type`, `CONTENT-TYPE` 모두 같음 |
| 표시 관행 | `Content-Type` | `content-type` (덜 흔함) |

JS 코드에서 헤더를 다룰 때:

```js
// 보낼 때 — 어떤 케이스든 가능
fetch('/api', {
  headers: {
    'content-type': 'application/json',     // 소문자
    'X-Custom-Header': 'value',             // Title-Case
    'AUTHORIZATION': `Bearer ${token}`      // 대문자
  }
});
// 서버는 모두 동일하게 인식
```

```js
// 받을 때 — 대소문자 무시 매칭
const res = await fetch('/api');
res.headers.get('content-type');      // 동작
res.headers.get('Content-Type');      // 동작 (같은 값)
res.headers.get('CONTENT-TYPE');      // 동작 (같은 값)
```

HTTP/2부터는 헤더 이름이 모두 소문자로 인코딩되도록 표준이 정해져서 — 실제 와이어에선 항상 소문자입니다. DevTools가 보여주는 헤더가 HTTP/2 응답에서 소문자인 이유.

이게 없으면 어떻게 되는가:

- 키-값 쌍이라는 단순 형식이 없었다면 — 각 헤더마다 자기 파싱 규칙이 필요해 새 헤더 추가가 어려웠을 것. 키-값은 누구나 이해하는 보편 구조라 새 헤더 도입이 쉬움.
- 대소문자 무시가 없었다면 — `Content-Type`과 `content-type`이 다른 헤더로 취급되어 호환성 문제 빈발. 클라이언트마다 다른 케이스를 쓸 수 있으니까.

오개념 예방: 헤더 이름은 대소문자 무시이지만 — 헤더 값은 대소문자가 의미를 가질 수 있습니다. 예: `Content-Type: application/JSON`은 `application/json`과 다르게 인식될 수 있어요(MIME 타입은 보통 소문자 표준). 이름과 값의 규칙이 다르다는 점 주의.

AI Annotation 보충: 헤더 필드는 `이름: 값` 형태의 메타데이터입니다 (예: `Content-Type: application/json`). 메서드 이름(GET, POST)은 대소문자를 구분하지만, 헤더 필드 이름은 대소문자를 구분하지 않습니다. `Content-Type`과 `content-type`은 동일하게 처리됩니다 — 이 비대칭이 HTTP의 작은 함정 중 하나.

---

# HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?

> A request is sent by a client to a server.
> The start line includes a method name, a request URI and the protocol version with a single space between each field.
> Request header fields allow the client to pass additional information beyond the request line, acting as request modifiers.
> In the HTTP/1.1 protocol, all header fields except Host are optional.

---

## 도입

`fetch('/api/users', { method: 'GET' })` 한 줄이 실제로 네트워크에 흐를 때 어떤 모양이 되는지 봅시다. 가장 윗줄에 `GET /api/users HTTP/1.1`이 있고 그 아래 헤더가 이어집니다. 이 첫 줄이 시작 줄(start line)이고 — 메서드, 경로, 버전 세 정보가 공백으로 구분되어 있습니다.

---

## 본문

> A request is sent by a client to a server.

요청은 클라이언트가 서버로 보낸다.

- **request**: 요청 메시지. 클라이언트가 시작점.
- **client to a server**: 클라이언트 → 서버 단방향. 클라이언트-서버 모델의 기본.

> The start line includes a method name, a request URI and the protocol version with a single space between each field.

시작 줄은 메서드 이름, 요청 URI, 프로토콜 버전을 포함하며, 각 필드 사이에 단일 공백이 있다.

- **start line**: 요청 메시지의 첫 줄. 모든 요청은 이 한 줄로 자신을 소개.
- **method name**: GET, POST, PUT 등. 무엇을 하려는지.
- **request URI**: 어느 리소스에 대해. 예: `/api/users`, `/index.html`.
- **protocol version**: HTTP 버전. `HTTP/1.1`, `HTTP/2.0`.
- **single space**: 단일 공백으로 구분. `GET /api/users HTTP/1.1` — 정확히 한 칸씩.

> Request header fields allow the client to pass additional information beyond the request line, acting as request modifiers.

요청 헤더 필드는 클라이언트가 요청 라인 외에 추가 정보를 전달할 수 있게 해주며, 요청 수정자(modifier) 역할을 한다.

- **additional information beyond the request line**: 시작 줄에 다 못 담는 정보. 인증 토큰, 받기 원하는 형식, 쿠키 등.
- **request modifiers**: 요청 수정자. 같은 메서드+URI라도 헤더에 따라 응답이 달라짐 — 예: `Accept: application/json`이면 JSON 응답, `Accept: text/html`이면 HTML 응답.

> In the HTTP/1.1 protocol, all header fields except Host are optional.

HTTP/1.1 프로토콜에서는 `Host`를 제외한 모든 헤더 필드가 선택적이다.

- **all header fields except Host are optional**: `Host`만 필수, 나머지 모두 선택. 다른 헤더 없이도 요청은 성립.
- **Host**: 어느 도메인의 리소스인지. HTTP/1.1의 가상 호스팅(한 IP에 여러 도메인) 때문에 필수가 됨.

---

## 종합

HTTP 요청 메시지의 구조:

```
┌─────────────────────────────────────────────────────┐
│ GET   /api/users   HTTP/1.1     ← 시작 줄          │
│ ├─메서드 ├─URI    ├─버전                            │
├─────────────────────────────────────────────────────┤
│ Host: api.example.com           ← 필수             │
│ Accept: application/json        ← 선택 (수정자)    │
│ Authorization: Bearer ...       ← 선택             │
│ User-Agent: Mozilla/5.0         ← 선택             │
├─────────────────────────────────────────────────────┤
│ (빈 줄 — 헤더 끝)                                  │
├─────────────────────────────────────────────────────┤
│ (본문 — GET은 보통 비어있음, POST는 데이터)         │
└─────────────────────────────────────────────────────┘
```

JS 코드와 매핑:

```js
const res = await fetch('https://api.example.com/api/users', {
  method: 'GET',                              // ← 시작 줄의 메서드
  // URI는 URL에서 추출됨 (/api/users)
  // 버전은 브라우저가 자동 결정 (HTTP/1.1, HTTP/2 등)
  headers: {
    // Host는 브라우저가 자동 추가 (api.example.com)
    'Accept': 'application/json',             // ← 요청 수정자
    'Authorization': `Bearer ${token}`,
  }
});
```

브라우저 DevTools Network 탭에서 한 요청을 클릭 → Headers 탭 → "Request Headers"에서 위 모양을 그대로 볼 수 있습니다.

`Host`가 필수인 이유: HTTP/1.0 시절엔 IP 1개 = 사이트 1개였습니다. 서버는 자기 IP로 들어온 요청이 누구에게 가는지 명확. HTTP/1.1부터 한 IP에 여러 도메인을 호스팅(가상 호스팅, virtual hosting)할 수 있게 되면서 — 같은 IP의 80번 포트로 들어온 요청이 `example.com`인지 `blog.example.com`인지 알아야 했습니다. `Host` 헤더가 그 답을 줍니다.

이게 없으면 어떻게 되는가:

- 시작 줄이 없다면 — 한 메시지의 시작점을 알 수 없어 파이프라이닝/멀티플렉싱이 불가능. 시작 줄 한 줄로 "여기서 새 요청 시작"을 알림.
- `Host` 헤더가 없다면 — 가상 호스팅이 불가능. AWS/Cloudflare 같은 멀티테넌트 호스팅이 성립 안 됨. 모든 사이트가 자기 전용 IP를 가져야 함 (IPv4 고갈 가속).

오개념 예방: HTTP/2부터는 시작 줄이 없습니다 — 대신 pseudo-header `:method`, `:path`, `:scheme`, `:authority`가 같은 정보를 담습니다. 의미는 같지만 형식이 바이너리 프레임으로 바뀐 것. `Host` 헤더의 역할도 `:authority` pseudo-header가 대체합니다.

Official Annotation 보충: 요청은 다음 요소들로 구성됩니다 — HTTP 메서드(보통 GET, POST 같은 동사 또는 OPTIONS, HEAD 같은 명사로 클라이언트가 수행하려는 동작 정의), 가져올 리소스 경로(프로토콜·도메인·포트가 빠진 URL), HTTP 프로토콜 버전, 서버에 추가 정보를 전달하는 선택적 헤더, 일부 메서드(POST 등)에 한해 리소스를 담은 본문.

AI Annotation 보충: `Host`만 필수인 이유는 하나의 IP에 여러 도메인이 호스팅될 수 있어서(가상 호스팅), 어느 도메인에 대한 요청인지 명시해야 하기 때문입니다. 그 외 헤더는 모두 선택입니다 — `Accept`도 없으면 서버가 기본 형식으로 응답합니다.

---

# HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?

> A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.
> GET: The request is for a representation of a resource.
> The server should only retrieve data; not modify state.
> For retrieving without making changes, GET is preferred over POST, as it can be addressed through a URL.
> This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.
> POST: The request is to process a resource in some way.
> For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.
> PUT: The request is to create or update a resource with the state in the request.
> DELETE: The request is to delete a resource.
> PATCH: The request is to modify a resource according to its partial state in the request.
> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

---

## 도입

REST API를 설계할 때 가장 먼저 만나는 결정이 "이 작업에 어떤 HTTP 메서드를 쓸까?"입니다. 무엇을 어떻게 해석하느냐에 따라 캐싱, 안전성, 멱등성이 달라집니다. 표면적으로는 단순한 동사 선택 같지만 — 각 메서드는 서버 동작에 대한 명확한 약속을 가지고 있습니다.

---

## 본문

> A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.

요청은 리소스에 수행할 동작을 분류하기 위해 메서드(비공식적으로 동사라 불리기도 하는)를 식별한다.

- **method**: 메서드. HTTP 요청 시작 줄의 첫 단어 — `GET`, `POST` 등.
- **verb**: 동사. 영어 문법 관점에서 동사 — "가져온다(GET)", "보낸다(POST)" — 같은 행위 표현이라 그렇게 부름.
- **classify the desired action**: 동작을 분류. 같은 URL이라도 메서드에 따라 의미가 달라짐 — `/users`로 GET이면 조회, POST면 생성.

> GET: The request is for a representation of a resource.

GET: 리소스의 표현(representation)을 요청한다.

- **representation**: 표현. 같은 리소스라도 클라이언트의 요청에 따라 다른 형태(JSON, HTML, XML)로 표현될 수 있어서 "표현"이라는 추상 개념을 씀.

> The server should only retrieve data; not modify state.

서버는 데이터를 검색해야 할 뿐이며, 상태를 수정해서는 안 된다.

- **only retrieve**: 검색만. 읽기 전용.
- **not modify state**: 상태 변경 금지. 데이터 변경은 GET의 약속 위반.

> For retrieving without making changes, GET is preferred over POST, as it can be addressed through a URL.

변경 없이 검색할 때는 GET이 POST보다 선호되는데, URL로 주소화할 수 있기 때문이다.

- **addressed through a URL**: URL로 표현 가능. `https://example.com/api/users?page=2` 같은 단일 URL로 요청 정의.

> This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.

이는 북마크와 공유를 가능하게 하고, GET 응답이 캐싱 대상이 되도록 만들어 대역폭을 절약할 수 있다.

- **bookmarking and sharing**: 북마크·공유 가능. URL 그대로 다시 방문하면 같은 결과.
- **eligible for caching**: 캐싱 대상. 브라우저, CDN, 프록시가 GET 응답을 캐시 가능.

> POST: The request is to process a resource in some way.

POST: 리소스를 어떤 방식으로 처리하라는 요청이다.

- **process a resource in some way**: "어떤 방식으로 처리". 매우 모호한 정의 — 의도적입니다. POST는 가장 일반적이고 유연한 메서드.

> For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.

예를 들어, 인터넷 포럼에 메시지 게시, 메일링 리스트 구독, 온라인 쇼핑 결제 완료 등에 사용된다.

- **posting a message**: 게시물 작성. 새 자원 생성.
- **completing a shopping transaction**: 결제. 부작용이 있는 행동.

> PUT: The request is to create or update a resource with the state in the request.

PUT: 요청에 담긴 상태로 리소스를 생성하거나 업데이트하라는 요청이다.

- **create or update**: 생성 또는 갱신. 대상이 없으면 생성, 있으면 업데이트(전체 교체).
- **with the state in the request**: 요청 본문에 담긴 상태로. 클라이언트가 "이 리소스의 최종 상태는 이거"라고 명시 — 서버는 그대로 저장.

> DELETE: The request is to delete a resource.

DELETE: 리소스 삭제 요청이다.

- 단순함. URL이 가리키는 리소스를 삭제.

> PATCH: The request is to modify a resource according to its partial state in the request.

PATCH: 요청에 담긴 부분 상태에 따라 리소스를 수정하라는 요청이다.

- **partial state**: 부분 상태. 변경하려는 필드만 보냄. 나머지는 그대로.

> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

PUT에 비해 리소스 표현의 일부만 전송하므로 대역폭을 절약할 수 있다.

- **save bandwidth**: 대역폭 절약. 큰 객체에서 한 필드만 바꿀 때 PUT은 전체 전송, PATCH는 그 필드만.

---

## 종합

5가지 메서드의 비교:

| 메서드 | 의미 | 안전 | 멱등 | 본문 | 캐시 | 실무 예 |
|---|---|---|---|---|---|---|
| GET | 리소스 조회 | ○ | ○ | × | ○ | `GET /users/123` |
| POST | 리소스 처리 (보통 생성) | × | × | ○ | △ | `POST /users` (회원가입) |
| PUT | 전체 교체/생성 | × | ○ | ○ | × | `PUT /users/123` (전체 정보 갱신) |
| PATCH | 부분 수정 | × | △ | ○ | × | `PATCH /users/123` (이메일만) |
| DELETE | 삭제 | × | ○ | × | × | `DELETE /users/123` |

JS 코드로 매핑:

```js
// GET — 조회. URL에 모든 정보. 캐시 가능
await fetch('/api/users/123');

// POST — 생성. 서버가 ID 결정
await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Alice', email: 'a@a.com' })
});

// PUT — 전체 교체. 클라이언트가 ID 지정
await fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice', email: 'a@a.com', age: 30 })  // 전체 필드
});

// PATCH — 부분 수정
await fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ email: 'new@a.com' })  // 변경 필드만
});

// DELETE — 삭제
await fetch('/api/users/123', { method: 'DELETE' });
```

이게 없으면 어떻게 되는가:

- 메서드 구분이 없다면 — 모든 요청이 동일한 의미. 캐시 시스템은 어느 응답을 캐시할 수 있는지 모름. 브라우저는 폼 재제출 시 위험을 경고할 수 없음.
- PATCH가 없다면 — 사용자 정보 100개 필드 중 1개를 바꾸려면 PUT으로 100개 전부 전송. 큰 트래픽 낭비.

오개념 예방: HTTP 메서드의 약속(안전, 멱등 등)은 프로토콜이나 서버가 강제하지 않습니다 — 개발자의 약속입니다. GET 핸들러에 데이터 변경 코드를 넣을 수도 있지만, 그렇게 하면 캐시·프리페치 같은 인프라가 의도치 않게 데이터를 변경시킬 수 있습니다(Google Web Accelerator 사건). 메서드 의미를 지키는 건 클라이언트와 인프라가 안전하게 동작하기 위한 약속.

POST와 PUT의 핵심 차이는 "URI를 누가 지정하는가"입니다 — POST는 서버가 새 ID를 할당, PUT은 클라이언트가 URI를 지정. PATCH와 PUT의 차이는 "보내는 양"입니다 — PUT은 전체, PATCH는 일부.

---

# PUT과 POST의 차이, PUT과 PATCH의 차이는?

> POST: The request is to process a resource in some way.
> PUT: The request is to create or update a resource with the state in the request.
> A distinction from POST is that the client specifies the target location on the server.
> PATCH: The request is to modify a resource according to its partial state in the request.
> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

---

## 도입

REST API를 설계할 때 가장 헷갈리는 게 PUT vs POST, PUT vs PATCH입니다. 새 사용자 생성에 PUT 써도 되나? 이메일만 바꿀 때 PUT이 나을까 PATCH가 나을까? 답은 — POST/PUT은 "URI를 누가 지정하는가", PUT/PATCH는 "전체를 보내는가 일부를 보내는가"의 차이입니다.

---

## 본문

> POST: The request is to process a resource in some way.

POST: 리소스를 어떤 방식으로 처리하라는 요청.

- **process in some way**: 어떤 방식으로든 처리. 매우 모호 — 생성, 검색, 트랜잭션 처리 등 거의 모든 것이 가능.

> PUT: The request is to create or update a resource with the state in the request.

PUT: 요청에 담긴 상태로 리소스를 생성하거나 업데이트.

- **create or update**: 생성 또는 갱신.
- **with the state in the request**: 요청 본문이 곧 리소스의 최종 상태가 됨. 클라이언트가 "이 리소스는 이 모양이어야 해"라고 명령.

> A distinction from POST is that the client specifies the target location on the server.

POST와의 차이는 클라이언트가 서버 상의 대상 위치를 지정한다는 점이다.

- **client specifies the target location**: 클라이언트가 URI를 정함. `PUT /users/123`처럼 ID 123 지정.
- POST는 서버가 위치를 결정 — `POST /users`로 보내면 서버가 새 ID 발급해 응답에 알림.

> PATCH: The request is to modify a resource according to its partial state in the request.

PATCH: 요청에 담긴 부분 상태로 리소스를 수정.

- **partial state**: 부분 상태. 변경하려는 필드만.

> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

PUT과 비교해 리소스 표현 전체가 아닌 일부만 보내므로 대역폭을 절약할 수 있다.

- **only part of a resource's representation**: 표현의 일부만. 사용자 객체의 100개 필드 중 1개만 보냄.
- **save bandwidth**: 대역폭 절약. 큰 객체일수록 효과 큼.

---

## 종합

세 메서드의 비교:

| 측면 | POST | PUT | PATCH |
|---|---|---|---|
| URI를 누가 지정 | 서버 (ID 자동 발급) | 클라이언트 | 클라이언트 |
| 보내는 양 | 자유 | 전체 (모든 필드) | 일부 (변경 필드) |
| 같은 요청 반복 | 매번 새 결과 (비멱등) | 같은 결과 (멱등) | 보통 같은 결과 (멱등이려면 설계 주의) |
| 주 용도 | 생성, 처리 (모호) | 전체 교체, 클라이언트 ID로 생성 | 부분 수정 |

같은 "사용자 정보 변경"을 세 방식으로 해보면:

```js
// 사용자 123의 이메일만 변경

// POST — 비표준이지만 흔한 방식 (PATCH 등장 전)
await fetch('/api/users/123', {
  method: 'POST',
  body: JSON.stringify({ email: 'new@a.com' })
});

// PUT — 전체를 보내야 함 (필수 필드 다 포함)
await fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({
    name: 'Alice',         // 변경 안 했지만 보내야 함
    email: 'new@a.com',
    age: 30,               // 변경 안 했지만 보내야 함
    address: '...',        // 변경 안 했지만 보내야 함
    // 빠진 필드는 null로 처리될 수 있음 (스펙상 모호)
  })
});

// PATCH — 변경 필드만
await fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ email: 'new@a.com' })
});
```

**POST vs PUT의 핵심 — 누가 URI를 정하는가:**

```js
// POST — 서버가 ID 발급
const res = await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Alice' })
});
const { id } = await res.json();  // 서버가 부여한 ID (예: 456)

// PUT — 클라이언트가 ID 지정 (UUID 등으로)
const newId = crypto.randomUUID();
await fetch(`/api/users/${newId}`, {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice' })
});
// 클라이언트가 newId를 결정. 같은 newId로 또 PUT 보내도 결과 동일 (멱등)
```

**PUT vs PATCH의 핵심 — 전체 vs 일부:**

PUT은 "리소스의 새 상태는 이거다"라는 명령. 본문에 빠진 필드는 — 스펙상 모호하지만 실무에선 보통 null/삭제로 처리됩니다. 그래서 부분 수정에 PUT을 쓰면 의도치 않은 데이터 손실이 생길 수 있습니다.

PATCH는 "이 필드만 이렇게 바꿔라"라는 명령. 빠진 필드는 그대로 유지.

이게 없으면 어떻게 되는가:

- POST만 있고 PUT/PATCH가 없다면 — 모든 변경이 비멱등. 네트워크 재시도 시 중복 처리 위험. 캐시·프록시도 어떤 응답을 안전하게 다룰지 모름.
- PUT만 있고 PATCH가 없다면 — 부분 수정마다 전체 객체 전송. 사용자 프로필이 큰 SNS에서 "프로필 사진만 변경"에도 전체 데이터 전송 → 트래픽 낭비.

오개념 예방: PUT이 멱등이라고 해서 같은 요청을 여러 번 보내도 결과가 같다는 것이지, 부작용이 없다는 뜻은 아닙니다. PUT으로 리소스 생성 시 첫 번째와 이후 요청이 모두 "이 ID에 이 상태"를 보장하므로 멱등이지만, 첫 요청에서 데이터베이스에 새 행이 생긴 것 자체는 변경입니다.

PATCH의 멱등성은 설계에 따라 달라집니다 — `PATCH /users/123 {balance: 100}`(절대값 설정)은 멱등이지만, `PATCH /users/123 {balance: balance + 100}`(증감)은 비멱등. RFC 5789는 PATCH의 멱등성을 강제하지 않습니다.

AI Annotation 보충: PUT vs POST는 "클라이언트가 리소스의 대상 URI를 지정하는가"가 핵심 — PUT은 `PUT /users/123`처럼 명시, POST는 `POST /users`로 보내고 서버가 ID 할당. PUT vs PATCH는 "전체를 교체하는가, 일부만 수정하는가"가 핵심.

---

# HTTP에서 safe method란 무엇인가?

> A request method is safe if a request with that method has no intended effect on the server.
> The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.
> In other words, safe methods are intended to be read-only.
> In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.
> They may modify the state of the server or have other effects such as sending an email.

---

## 도입

브라우저가 페이지를 미리 가져오는 prefetch 기능이나 검색 엔진의 크롤러를 떠올려 보세요. 둘 다 사용자 의사 없이 자동으로 URL을 호출합니다. 이 자동 호출이 데이터를 삭제하거나 결제를 발생시키면 큰일입니다 — 그래서 HTTP는 "자동으로 호출해도 안전한 메서드"를 정해뒀습니다. 그게 safe method입니다.

---

## 본문

> A request method is safe if a request with that method has no intended effect on the server.

요청 메서드는 그 메서드의 요청이 서버에 의도된 효과(부작용)를 갖지 않으면 safe하다.

- **safe**: 안전한. "데이터를 변경하지 않는"이라는 약속.
- **no intended effect on the server**: 서버에 의도된 효과 없음. "의도된"이 핵심 — 로그 기록 같은 부수적 효과는 있을 수 있지만, 의도된 데이터 변경은 없어야 함.

> The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.

GET, HEAD, OPTIONS, TRACE 메서드가 safe로 정의된다.

- **GET**: 리소스 조회. 가장 흔한 safe 메서드.
- **HEAD**: GET과 동일하지만 응답 헤더만 받음(본문 없음). 리소스 존재 여부·메타정보 확인용.
- **OPTIONS**: 서버가 어떤 메서드를 지원하는지 묻기. CORS preflight에서 사용.
- **TRACE**: 디버깅용. 요청을 받은 그대로 에코백. 보안 위험으로 거의 사용 안 됨.

> In other words, safe methods are intended to be read-only.

다시 말해, safe 메서드는 읽기 전용으로 의도된다.

- **read-only**: 읽기만. 데이터를 가져오는 것은 OK, 변경하는 것은 not OK.
- **intended**: 의도된. 약속이지 강제가 아님 — 서버가 GET 핸들러에 변경 코드를 넣을 수도 있지만, 그건 약속 위반.

> In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.

반대로 POST, PUT, DELETE, CONNECT, PATCH 메서드는 safe하지 않다.

- **POST**: 새 리소스 생성, 결제 처리 등. 부작용 명시적.
- **PUT**: 전체 교체. 데이터 변경.
- **DELETE**: 삭제. 가장 명확한 변경.
- **CONNECT**: 프록시를 통한 터널링. 연결 생성 자체가 부작용.
- **PATCH**: 부분 수정. 데이터 변경.

> They may modify the state of the server or have other effects such as sending an email.

이들은 서버 상태를 수정하거나 이메일 전송 같은 다른 효과를 가질 수 있다.

- **modify the state of the server**: 서버 상태 변경. DB 레코드 추가/수정/삭제.
- **other effects such as sending an email**: 다른 부작용. 이메일 전송, 결제, 외부 API 호출 등 — 한 번 일어나면 되돌릴 수 없는 행위.

---

## 종합

safe와 not-safe 메서드의 비교:

| 메서드 | safe | 의도된 효과 |
|---|---|---|
| GET | ○ | 데이터 조회만 |
| HEAD | ○ | 헤더만 조회 |
| OPTIONS | ○ | 지원 메서드 확인 |
| TRACE | ○ | 요청 에코백 |
| POST | × | 처리·생성, 부작용 가능 |
| PUT | × | 전체 교체 |
| PATCH | × | 부분 수정 |
| DELETE | × | 삭제 |
| CONNECT | × | 터널 생성 |

safe method는 자동화 시스템의 안전 가드레일입니다:

- **브라우저 prefetch**: `<link rel="prefetch">`로 다음에 방문할 페이지를 미리 가져옴. GET만 자동 호출 — 데이터 변경 위험 없음.
- **검색 엔진 크롤러**: GET으로 페이지를 긁어 인덱싱. 사이트 데이터를 임의로 변경하지 않음.
- **링크 미리보기**: Slack, 카카오톡이 URL을 받으면 자동으로 GET해서 OG 태그를 가져옴. 이게 결제를 발생시키면 안 되니까.

JS 개발자에게 와닿는 사례:

```js
// 안전 — GET은 부작용 없어야 하므로 prefetch에 적합
await fetch('/api/users/123');                 // safe

// 위험 — GET으로 데이터 변경하면 prefetch가 의도치 않은 변경 발생
await fetch('/api/users/123/delete');          // 메서드가 GET이지만 URL이 동작 암시 → 위험!
// 차라리:
await fetch('/api/users/123', { method: 'DELETE' });
```

이게 없으면 어떻게 되는가:

- safe 메서드 약속이 없다면 — 브라우저 prefetch, 크롤러, 캐시 워밍 같은 자동화가 데이터를 망가뜨릴 위험이 있어 사실상 불가능했을 것.
- Google Web Accelerator 사건(2005): GET으로 데이터 변경(예: `/article/123/delete`)을 허용한 사이트가 있었습니다. Web Accelerator가 페이지의 모든 링크를 GET으로 미리 호출 → 게시물이 대량 삭제되는 사고. safe method 위반의 대표적 사례.

오개념 예방: safe하다고 캐싱 가능한 건 별개입니다. GET은 보통 캐시 가능하지만, `Cache-Control: no-store` 같은 헤더로 캐시 거부 가능. 반대로 safe하지 않은 메서드라도 응답에 따라 캐시 전략이 다를 수 있습니다.

safe와 idempotent의 관계: safe ⊂ idempotent. safe하면 자동으로 idempotent(여러 번 보내도 같은 결과 — 어차피 변경 없으니까). 하지만 idempotent라고 safe인 건 아닙니다 — DELETE는 idempotent이지만 safe하지 않습니다(여러 번 보내도 같은 결과지만 데이터 변경).

---

# safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?

> Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.
> Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.
> For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.
> A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.
> One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.
> The beta was suspended only weeks after its first release, following widespread criticism.

---

## 도입

앞 질문에서 GET이 "safe"라는 약속을 가진 메서드라고 봤습니다. 하지만 약속은 강제가 아니라 합의입니다. 한 사이트의 잘못된 코드 + 브라우저의 정상 동작이 만나 대규모 데이터 손실 사고가 일어났던 게 2005년 Google Web Accelerator 사건입니다. safe method 약속을 깨면 어떤 일이 일어나는지 보여주는 가장 유명한 사례입니다.

---

## 본문

> Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.

GET 요청에 규정된 안전성에도 불구하고, 실제로 서버의 처리는 기술적으로 어떤 식으로도 제한되지 않는다.

- **prescribed safety**: 규정된 안전성. RFC 표준이 GET을 safe로 정의했음.
- **not technically limited**: 기술적으로 제한 안 됨. 서버 코드가 GET 핸들러에서 데이터를 변경하는 것을 막는 메커니즘이 없음. 약속이지 강제가 아님.

> Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.

부주의하거나 의도적으로 비정상적인 프로그래밍으로 인해 GET 요청이 서버에 사소하지 않은 변경을 일으킬 수 있다.

- **careless**: 부주의. 개발자가 약속을 모르거나 무시.
- **non-trivial changes**: 사소하지 않은 변경. 데이터 삭제, 결제, 메일 발송 등 — 되돌릴 수 없는 변경.

> For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.

예를 들어, 어떤 웹사이트가 `https://example.com/article/1234/delete` 같은 URL을 통한 리소스 삭제를 허용한다면, 이 URL을 임의로 가져올 때(심지어 GET으로) 단순히 게시물이 삭제될 수 있다.

- **arbitrarily fetched**: 임의로 가져옴. 사용자 의도가 아니라 자동화 도구가 가져옴.
- **even using GET**: GET이라도. 이게 핵심 — GET이라 안전할 거라는 가정이 깨짐.
- **simply delete the article**: 단순히 게시물 삭제. 의도치 않은 데이터 손실.

> A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.

제대로 코딩된 웹사이트라면 이 동작에 DELETE나 POST 메서드를 요구하며, 악의 없는 봇은 그런 요청을 하지 않을 것이다.

- **properly coded**: 올바르게 작성된. safe method 원칙을 지킨.
- **DELETE or POST**: 데이터 변경에 적절한 메서드. 자동 호출되지 않음.
- **non-malicious bots would not make**: 악의 없는 봇은 안 보냄. 정상 봇은 GET만 자동 호출 — 데이터 변경 메서드를 임의로 보내지 않음.

> One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.

이 일이 실제로 일어난 예가 잠시 운영된 Google Web Accelerator 베타로, 사용자가 보고 있는 페이지의 임의 URL을 prefetch해서 레코드가 대량으로 자동 변경 또는 삭제되도록 만들었다.

- **Google Web Accelerator**: 2005년 Google이 출시한 Firefox/IE 확장. 페이지의 링크들을 미리 가져와 캐시해 사용자 클릭 시 즉시 표시 — 좋은 의도의 성능 최적화.
- **prefetched arbitrary URLs**: 페이지의 모든 링크를 GET으로 미리 가져옴.
- **records altered or deleted en masse**: 레코드가 대량으로 변경·삭제. 사용자가 클릭하지 않았는데도.

> The beta was suspended only weeks after its first release, following widespread criticism.

베타는 광범위한 비판 끝에 첫 출시 몇 주 후에 중단되었다.

- **suspended only weeks after**: 몇 주 만에 중단. 빠른 철회.
- **widespread criticism**: 광범위한 비판. 운영자들의 피해 호소가 쏟아짐.

---

## 종합

이 사건의 인과 관계를 정리하면:

| 단계 | 주체 | 동작 |
|---|---|---|
| 1. 잘못된 사이트 코드 | 일부 웹사이트 | `GET /article/123/delete` 같은 URL이 실제 삭제 수행 |
| 2. 사용자 페이지 방문 | 사용자 | 관리 페이지 등에 위 URL의 링크들이 노출됨 |
| 3. Google Web Accelerator의 prefetch | Web Accelerator | 페이지의 모든 링크를 자동으로 GET 호출 |
| 4. 결과 | — | 사용자가 클릭하지 않았는데도 게시물 대량 삭제 |

이 사건의 교훈:

- **약속을 강제하지 않는 분산 시스템에서 약속은 기능적 제약과 거의 같다.** GET이 safe라는 약속을 깨면 그 사이트는 자동화의 모든 형태(브라우저 prefetch, 크롤러, 캐시 워밍, 링크 미리보기)에 취약해진다.
- **서버는 클라이언트가 누구인지 모른다.** 사용자의 의도적 클릭과 자동화 도구의 prefetch를 구분 못 하니, GET이라는 정보 외에는 의도를 알 수 없다.

JS 개발자가 만들 수 있는 안티패턴들:

```js
// 안티패턴 1: GET으로 데이터 변경
fetch('/api/articles/123/delete');  // 절대 안 됨

// 안티패턴 2: 링크로 데이터 변경
<a href="/articles/123/delete">삭제</a>  // 클릭 = GET. 위험!

// 정답: 데이터 변경은 명시적 메서드로
await fetch('/api/articles/123', { method: 'DELETE' });

// 또는 form POST
<form method="POST" action="/articles/123/delete">
  <button type="submit">삭제</button>
</form>
```

이게 없으면 어떻게 되는가: safe method 약속이 없었다면 — Google Web Accelerator 같은 도구뿐 아니라, 페이스북 미리보기, Slack 링크 unfurl, 검색 엔진 크롤러, 보안 스캐너 모두가 데이터를 망가뜨릴 위험이 있어 동작 불가. 웹의 자동화 인프라 전체가 성립 못 함.

오개념 예방: 이 사건이 Google의 잘못이라고 생각하기 쉽지만 — 실제로는 RFC 표준을 위반한 사이트들의 잘못이 더 큽니다. Google Web Accelerator는 GET이 safe라는 표준 약속을 신뢰했을 뿐. 다만 이 사건을 계기로 prefetch 기능이 더 보수적으로 설계되었고, 표준에 "심지어 사이트가 위반해도 prefetch는 안전해야 한다"는 가이드가 추가됐습니다.

이 사건이 남긴 또 다른 영향: REST API 설계에서 데이터 변경에는 반드시 POST/PUT/DELETE를 사용하라는 관행이 굳어진 결정적 사건이었습니다. 이전엔 단순함을 위해 GET으로 모든 걸 처리하는 사이트도 있었지만 — 이후 "그건 위험한 안티패턴"이라는 합의가 형성됐습니다.

```
        [Google Web Accelerator 사고 시나리오]

   사이트 코드 (잘못된 설계):
     <a href="/article/1234/delete">삭제</a>
     서버: GET /article/1234/delete -> 실제 삭제 수행

   사용자                Web Accelerator         서버
     |                        |                  |
     | (1) 관리 페이지 열기   |                  |
     |----------------------->|------ GET 페이지 |
     |                        |                  |
     |          페이지 응답 (수십 개의 삭제 링크 포함)
     |<-----------------------|<-----------------|
     |                        |
     |                        | (2) 모든 링크 prefetch (백그라운드)
     |                        |    (사용자가 클릭할 가능성에 대비)
     |                        |
     |                        | GET /article/1234/delete
     |                        |----------------------->|
     |                        | GET /article/1235/delete
     |                        |----------------------->|
     |                        | GET /article/1236/delete
     |                        |----------------------->|
     |                        |   ...수십 개 동시 호출
     |                        |
     |                        |        (3) 서버: 각 GET 처리
     |                        |             = 게시물 대량 삭제
     |                        |
     | (4) 사용자: 페이지 새로고침
     |     "내 게시물이 다 사라졌다!"
     |

   사용자는 단 한 번도 "삭제"를 클릭하지 않았다.
   GET = safe라는 약속을 사이트가 깨뜨린 결과.
```

---

# HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.
> The methods PUT and DELETE, and safe methods are defined as idempotent.
> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.
> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent, and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.
> Note that whether or not a method is idempotent is not enforced by the protocol or web server.

---

## 도입

네트워크는 불안정합니다. 요청을 보냈는데 응답이 안 오면 — 서버에 도달했는지, 응답만 잃어버렸는지 알 수 없습니다. 안전하게 재시도하려면 "여러 번 보내도 같은 결과"인 메서드여야 합니다. 이 성질이 idempotent(멱등성)이고, 안전한 자동 재시도가 가능한 메서드를 가르는 기준입니다.

---

## 본문

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.

요청 메서드는 그 메서드의 동일한 요청을 여러 번 보낸 효과가 한 번 보낸 효과와 같으면 멱등하다.

- **idempotent**: 멱등. 같은 동작을 반복해도 결과가 같은 성질. 수학에서 온 용어 — `f(f(x)) = f(x)`.
- **multiple identical requests**: 여러 번의 동일한 요청. "동일한"이 중요 — 같은 메서드, URL, 헤더, 본문.
- **same effect as a single such request**: 한 번 보낸 것과 동일한 효과. 결과뿐 아니라 서버 상태까지 같음.

> The methods PUT and DELETE, and safe methods are defined as idempotent.

PUT, DELETE 메서드와 safe 메서드들이 멱등으로 정의된다.

- **PUT**: 멱등. `PUT /users/123 {name: "Alice"}`을 100번 보내도 user 123의 이름은 "Alice".
- **DELETE**: 멱등. `DELETE /users/123`을 한 번 보내면 삭제, 두 번째부터는 이미 없음. 결과적으로 동일한 상태.
- **safe methods**: GET, HEAD, OPTIONS, TRACE — 모두 멱등.

> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever;

safe 메서드는 자명하게 멱등하다. 서버에 어떤 효과도 의도하지 않기 때문.

- **trivially idempotent**: 자명하게 멱등. 변경이 없으니 몇 번을 보내든 결과는 같음 — 너무 당연.
- **no effect on the server whatsoever**: 서버에 어떤 영향도 없음. 변경 없는데 어떻게 결과가 달라지겠나.

> the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.

한편 PUT과 DELETE 메서드는 연속된 동일 요청이 무시되기 때문에 멱등하다.

- **successive identical requests**: 연속된 동일 요청. 두 번째, 세 번째 요청.
- **will be ignored**: 무시됨. 두 번째 PUT은 같은 상태를 다시 설정 → 변화 없음. 두 번째 DELETE는 이미 없는 걸 또 지우려 함 → 변화 없음.

> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent,

반대로 POST, CONNECT, PATCH는 반드시 멱등이지는 않다.

- **not necessarily idempotent**: 멱등이 보장되지 않음. 멱등일 수도 있고 아닐 수도 있음 — 구현에 달림.
- **POST**: 일반적으로 비멱등. 여러 번 보내면 새 자원이 여러 개 생성될 수 있음.
- **PATCH**: 비멱등 가능. 절대값 설정(`{balance: 100}`)은 멱등, 증감(`{balance: balance + 100}`)은 비멱등.
- **CONNECT**: 터널 생성. 부작용 있음.

> and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.

따라서 동일한 POST 요청을 여러 번 보내면 서버 상태가 더 변경되거나, 여러 개의 이메일 전송 같은 추가 효과가 생길 수 있다.

- **further modify the state**: 서버 상태가 더 변경. 같은 요청 N번 = N개의 새 레코드 생성 가능성.
- **sending multiple emails**: 여러 이메일 전송. 결제 알림이 N번, 환영 메일이 N번 — 사용자에게 명확한 부작용.

> Note that whether or not a method is idempotent is not enforced by the protocol or web server.

메서드가 멱등인지 아닌지는 프로토콜이나 웹 서버에 의해 강제되지 않는다는 점에 주의.

- **not enforced**: 강제 안 됨. PUT 핸들러를 비멱등하게 짤 수도 있고, POST를 멱등하게 짤 수도 있음. 약속이지 강제가 아님.

---

## 종합

각 메서드의 멱등성:

| 메서드 | 멱등 | 이유 |
|---|---|---|
| GET | ○ | 변경 없음 |
| HEAD | ○ | 변경 없음 |
| OPTIONS | ○ | 변경 없음 |
| TRACE | ○ | 변경 없음 |
| PUT | ○ | 같은 상태로 덮어쓰기 |
| DELETE | ○ | 두 번째부터는 변화 없음 |
| POST | × | 매번 새 레코드 가능 |
| PATCH | △ | 구현에 따라 |
| CONNECT | × | 터널 매번 생성 |

JS 개발자가 만나는 실무적 의미:

```js
// 멱등 — 안전하게 재시도 가능
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
}

// GET은 멱등이라 재시도 안전
await fetchWithRetry('/api/users/123');

// PUT도 멱등이라 재시도 안전
await fetchWithRetry('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice' })
});

// 단, POST는 위험! 네트워크 오류로 응답만 못 받았는데 서버에선 처리됐으면
// 재시도가 중복 처리를 만든다
await fetchWithRetry('/api/orders', { method: 'POST', ... });  // 위험
```

POST를 안전하게 재시도하는 패턴 — Idempotency Key:

```js
const idempotencyKey = crypto.randomUUID();
await fetchWithRetry('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ ... })
});
// 서버가 같은 키 보면 두 번째부터는 첫 결과 반환 → 중복 처리 방지
// Stripe API가 이 패턴 사용
```

이게 없으면 어떻게 되는가:

- 멱등성 약속이 없다면 — 네트워크 재시도가 위험. 결제 시스템이 사용자에게 이중 청구하는 사고 빈발. 분산 시스템의 신뢰성 보장이 어려움.
- HTTP 클라이언트(브라우저, 라이브러리)가 자동 재시도를 못 하므로 — 일시적 네트워크 오류에 대한 회복성이 모든 곳에서 수동으로 다뤄져야 함.

오개념 예방: "POST를 절대 재시도하면 안 된다"는 건 너무 일방적입니다. 멱등하지 않을 가능성이 있다는 뜻이지 — 서버가 Idempotency-Key 같은 메커니즘을 제공하면 안전하게 재시도 가능. 핵심은 "서버 구현의 약속을 알고 사용하라"입니다.

safe와 idempotent의 관계: safe ⊂ idempotent. safe는 변경 없으므로 자동으로 idempotent. 반대는 아님 — DELETE는 idempotent이지만 safe하지 않습니다. 첫 DELETE에서 데이터가 사라지는 것 자체는 부작용이니까.

AI Annotation 보충: 멱등 정리하면 GET/PUT/DELETE = 멱등 (여러 번 보내도 한 번과 같음), POST/PATCH = 비멱등 (중복 시 부작용). 이 분류가 자동 재시도 가능 여부의 기준이며, REST API 설계에서 메서드를 고를 때 가장 중요한 고려 사항 중 하나입니다.

---

# POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

> In some cases this is the desired effect, but in other cases it may occur accidentally.
> A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.
> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

---

## 도입

쇼핑몰에서 결제 버튼을 눌렀는데 응답이 늦어지자 또 누른 경험이 있나요? 운이 나쁘면 결제가 두 번 됩니다. POST가 비멱등이라는 추상적 사실이 실무에서는 이런 구체적 문제로 나타납니다. 그리고 이건 서버나 프로토콜이 아니라 — 웹 애플리케이션이 책임지고 처리해야 하는 영역입니다.

---

**도입 추가**

앞 질문에서 POST가 비멱등이라 같은 요청을 여러 번 보내면 부작용이 누적된다는 걸 봤습니다. 이번엔 이게 사용자 행동과 만났을 때 어떤 모습으로 나타나고, 누가 책임지고 막아야 하는지 봅니다.

---

## 본문

> In some cases this is the desired effect, but in other cases it may occur accidentally.

어떤 경우에는 이게 의도된 효과이지만, 다른 경우에는 우발적으로 발생할 수 있다.

- **desired effect**: 의도된 효과. 댓글 2개 작성처럼 정말 두 번 처리하길 원할 때.
- **occur accidentally**: 우발적 발생. 사용자는 한 번 처리되길 원했는데 실수로 두 번 보냄.

> A user might, for example, inadvertently send multiple POST requests by clicking a button again

예를 들어, 사용자가 버튼을 다시 클릭해 의도치 않게 여러 POST 요청을 보낼 수 있다.

- **inadvertently**: 의도치 않게. 사용자가 부주의해서가 아니라, UI가 진행 상황을 알려주지 않아서.
- **clicking a button again**: 버튼 재클릭. "왜 반응이 없지?" 하며 또 누름.

> if they were not given clear feedback that the first click was being processed.

첫 번째 클릭이 처리되고 있다는 명확한 피드백을 받지 못한 경우.

- **clear feedback**: 명확한 피드백. 로딩 스피너, 버튼 비활성화, 진행 메시지 등. UX 디자인의 영역.
- **first click was being processed**: 첫 클릭 처리 중. 사용자에게 "지금 처리 중이니 기다려"를 시각적으로 알려야 함.

> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request,

웹 브라우저가 페이지 새로고침이 POST 요청을 재제출할 수 있는 경우 사용자에게 경고하는 알림 대화상자를 띄우기는 하지만.

- **alert dialog boxes**: 경고 다이얼로그. "Confirm Form Resubmission" 같은 익숙한 메시지.
- **reloading a page**: 페이지 새로고침. F5나 Ctrl+R.
- **re-submit a POST request**: POST 재제출. POST로 폼을 제출한 후 새로고침하면 같은 요청이 다시 갈 수 있음.

> it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

POST 요청이 한 번 이상 제출되어서는 안 되는 경우를 처리하는 것은 일반적으로 웹 애플리케이션의 책임이다.

- **up to the web application**: 애플리케이션의 책임. 브라우저나 HTTP 프로토콜이 아닌 — 우리가 짜는 코드가 막아야 함.
- **should not be submitted more than once**: 한 번 이상 제출되면 안 됨. 결제, 주문, 가입 등 — 중복이 사용자에게 손해인 동작.

---

## 종합

POST 중복 제출이 일어나는 시나리오:

| 시나리오 | 원인 | 결과 |
|---|---|---|
| 버튼 연타 | 응답 지연 + UI 피드백 부족 | 중복 결제, 중복 주문 |
| 페이지 새로고침 (F5) | POST 폼 제출 후 새로고침 | 같은 폼 데이터 재전송 |
| 브라우저 뒤로가기 | POST 결과 페이지에서 뒤로가기 후 다시 제출 | 같은 결제 두 번 |
| 네트워크 재시도 | 클라이언트 라이브러리의 자동 재시도 | 같은 요청 N번 처리 |

웹 애플리케이션이 책임지고 막아야 하는 방법들:

**프론트엔드**:

```jsx
// 1. 버튼 비활성화
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit() {
  if (isSubmitting) return;     // 이미 처리 중이면 무시
  setIsSubmitting(true);
  try {
    await fetch('/api/orders', { method: 'POST', body: ... });
  } finally {
    setIsSubmitting(false);
  }
}

return (
  <button onClick={handleSubmit} disabled={isSubmitting}>
    {isSubmitting ? '처리 중...' : '결제하기'}
  </button>
);
```

```jsx
// 2. 디바운스/throttle
import { useDebouncedCallback } from 'use-debounce';

const debouncedSubmit = useDebouncedCallback(handleSubmit, 1000);
// 1초 내 연속 클릭은 한 번으로 합쳐짐
```

**백엔드** (Idempotency Key):

```js
// 클라이언트가 매 요청마다 고유 키 생성
const idempotencyKey = crypto.randomUUID();
await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ amount: 50000 })
});

// 서버는 같은 키를 본 적 있으면 첫 처리 결과를 다시 반환 (중복 처리 X)
// Stripe, AWS API가 이 패턴 사용
```

이게 없으면 어떻게 되는가:

- 중복 방지가 없다면 — 결제 시스템이 사용자에게 이중 청구하는 사고가 빈발. 환불 처리, CS 문의가 늘고 사용자 신뢰 손상.
- "POST가 비멱등"이라는 사실은 약속이지 강제가 아니므로 — 애플리케이션이 적극적으로 막지 않으면 자연스럽게 중복이 발생.

오개념 예방: "Post-Redirect-Get(PRG) 패턴"이 새로고침으로 인한 POST 재제출을 막는 표준 방법입니다. POST 처리 후 응답으로 `303 See Other`를 보내고, 클라이언트가 Location 헤더의 GET 페이지로 이동하게 함. 이러면 새로고침해도 GET이 재실행될 뿐 POST는 다시 안 됨.

```js
// 서버 측 PRG 예
app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  res.redirect(303, `/orders/${order.id}/success`);  // GET 페이지로 리다이렉트
});
```

POST 비멱등성에서 비롯되는 보호 책임은 누구에게 있는가:

| 계층 | 역할 |
|---|---|
| HTTP 프로토콜 | 멱등성을 정의만, 강제 안 함 |
| 브라우저 | 새로고침 시 알림 다이얼로그 표시 |
| 백엔드 | Idempotency-Key 처리, 중복 감지 |
| 프론트엔드 | 버튼 비활성화, 로딩 피드백, debounce |

각 계층이 역할을 분담해야 — 하나라도 빠지면 사용자가 결국 중복 처리를 겪게 됩니다.

AI Annotation 보충: FE 실무에서 직접 겪는 문제 — 버튼 연타로 POST 중복 전송 → 중복 주문, 이메일 다중 발송. 로딩 인디케이터나 버튼 비활성화로 방지해야 하며, 이는 웹 애플리케이션의 책임입니다. HTTP가 막아주지 않습니다.

```
       [POST 비멱등성 -- 이중 결제 시나리오]

   사용자          브라우저/앱        서버         결제 PG
     |                |                |              |
     | (1) 결제 클릭  |                |              |
     |--------------->|                |              |
     |                | POST /pay      |              |
     |                |--------------->|              |
     |                |                | 카드 청구    |
     |                |                |------------->|
     |                |                |  결제 성공    |
     |                |                |<-------------|
     |                |                | DB 기록       |
     |                |                |               |
     |                |   ... 응답 송신 중 ...        |
     |                |                |               |
     |                | X 네트워크 끊김 (응답 유실)   |
     |                |                |               |
     | (2) 응답 안 옴 |                |              |
     |     사용자 불안: "결제 됐나?"  |              |
     |                |                |              |
     | (3) 새로고침/재클릭            |              |
     |--------------->|                |              |
     |                | POST /pay (같은 요청 재전송) |
     |                |--------------->|              |
     |                |                | 카드 또 청구 |
     |                |                |------------->|
     |                |                |  중복 결제!  |
     |                |                |<-------------|
     |                |                |              |
     | (4) 카드사 SMS: 결제 2건                       |

   해결책:
   - 클라: 버튼 disable / debounce / 로딩 표시
   - 서버: Idempotency-Key 헤더로 중복 감지
   - PRG 패턴: POST 응답을 303 리다이렉트로
     -> 새로고침해도 GET만 반복 (POST 재전송 X)
```

---

# HTTP 응답의 상태 코드는 어떤 구조이며, 1XX~5XX 각 클래스의 의미는?

> The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.
> A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit and treat an unrecognized code as equivalent to the x00 code of that class.
> 1XX informational: The request was received, continuing process.
> 2XX successful: The request was successfully received, understood, and accepted.
> 3XX redirection: Further action needs to be taken in order to complete the request.
> 4XX client error: The request cannot be fulfilled due to an issue that the client might be able to control.
> 5XX server error: The server failed to fulfill an apparently valid request.

---

## 도입

`fetch()` 응답에서 `res.status`로 받는 그 숫자가 상태 코드입니다. 200, 404, 500 — 익숙한 숫자들이지만 사실 5개 클래스로 분류된 체계적 구조입니다. 첫 자릿수만 보면 그 클래스의 의미가 결정되고, 정확한 코드를 몰라도 클래스로 처리할 수 있습니다.

---

## 본문

> The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.

상태 코드는 클라이언트의 요청을 만족시키려 한 서버의 시도 결과(disposition)를 나타내는 3자리 십진 정수다.

- **three-digit decimal integer**: 3자리 십진 정수. 100~599 범위.
- **disposition**: 처리 결과의 성격. 성공/실패/리다이렉트 등.
- **server's attempt to satisfy**: 서버의 시도. "시도"가 핵심 — 항상 성공하지는 않음.

> A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit

클라이언트는 서버가 보고하는 모든 상태 코드를 이해하지 못할 수 있지만, 첫 자릿수가 가리키는 클래스는 반드시 이해해야 한다.

- **may not understand each status code**: 모든 코드를 다 알 필요 없음. 새 코드가 추가될 수 있어 클라이언트가 모르는 게 자연스러움.
- **must understand the class**: 클래스는 필수 이해. 코드를 5개 그룹으로 나눠 의미를 일반화.
- **first digit**: 첫 자릿수. 1, 2, 3, 4, 5 — 각각 다른 의미.

> and treat an unrecognized code as equivalent to the x00 code of that class.

인식 못 하는 코드는 그 클래스의 x00 코드와 동일하게 취급해야 한다.

- **unrecognized code**: 모르는 코드. 예: `499 Client Closed Request` (nginx 비표준).
- **equivalent to the x00 code**: 그 클래스의 첫 코드와 동일 처리. `499`를 모르면 `400 Bad Request`로 간주.

> 1XX informational: The request was received, continuing process.

1XX 정보: 요청이 수신되었고 처리가 계속 중이다.

- **informational**: 정보성. 최종 응답이 아니라 중간 진행 상황 알림.
- **continuing process**: 처리 중. 예: `100 Continue`(클라이언트가 계속 본문을 보내도 됨), `101 Switching Protocols`(WebSocket 업그레이드).

> 2XX successful: The request was successfully received, understood, and accepted.

2XX 성공: 요청이 성공적으로 수신·이해·수락되었다.

- **successful**: 성공. 가장 흔한 클래스.
- **received, understood, and accepted**: 받았고, 이해했고, 받아들였음. 세 단계 모두 OK.
- 대표 코드: `200 OK`, `201 Created`(POST 성공), `204 No Content`(성공이지만 본문 없음).

> 3XX redirection: Further action needs to be taken in order to complete the request.

3XX 리다이렉션: 요청을 완료하려면 추가 동작이 필요하다.

- **redirection**: 리다이렉션. "다른 곳으로 가라"는 신호.
- **further action**: 추가 동작. 보통 `Location` 헤더의 새 URL로 다시 요청.
- 대표 코드: `301 Moved Permanently`(영구 이동), `302 Found`(임시 이동), `304 Not Modified`(캐시 그대로 써).

> 4XX client error: The request cannot be fulfilled due to an issue that the client might be able to control.

4XX 클라이언트 에러: 클라이언트가 제어할 수 있는 문제로 요청을 충족할 수 없다.

- **client error**: 클라이언트 잘못. 잘못된 요청·인증 누락 등.
- **client might be able to control**: 클라이언트가 고칠 수 있음. 요청을 수정해서 다시 시도하면 성공 가능.
- 대표 코드: `400 Bad Request`, `401 Unauthorized`(인증 필요), `403 Forbidden`(권한 없음), `404 Not Found`, `429 Too Many Requests`.

> 5XX server error: The server failed to fulfill an apparently valid request.

5XX 서버 에러: 외관상 유효한 요청을 서버가 수행하지 못했다.

- **server error**: 서버 잘못. 클라이언트의 요청은 정상이었음.
- **apparently valid request**: 외관상 유효한. 클라이언트가 잘못한 게 아님.
- 대표 코드: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`.

---

## 종합

5개 클래스를 한눈에:

| 클래스 | 의미 | 대표 코드 | 누구 책임 |
|---|---|---|---|
| 1XX | 정보 (진행 중) | 100 Continue, 101 Switching Protocols | 인프라 |
| 2XX | 성공 | 200 OK, 201 Created, 204 No Content | — |
| 3XX | 리다이렉션 | 301 Moved Permanently, 302 Found, 304 Not Modified | 서버 (이동 안내) |
| 4XX | 클라이언트 에러 | 400 Bad Request, 401, 403, 404, 429 | 클라이언트 |
| 5XX | 서버 에러 | 500 Internal Server Error, 502, 503, 504 | 서버 |

JS 코드에서 클래스 단위로 처리:

```js
const res = await fetch('/api/users');

if (res.status >= 200 && res.status < 300) {
  // 2XX — 성공
  const data = await res.json();
} else if (res.status >= 400 && res.status < 500) {
  // 4XX — 클라이언트 에러: 요청 수정 필요
  if (res.status === 401) { /* 로그인 페이지로 */ }
  else if (res.status === 404) { /* 없는 페이지 */ }
  else { /* 일반 클라이언트 에러 */ }
} else if (res.status >= 500) {
  // 5XX — 서버 에러: 재시도 가능
  // 서버 문제이므로 같은 요청을 잠시 후 재시도하면 성공할 수 있음
}
```

`res.ok` 활용:

```js
const res = await fetch('/api/users');
if (!res.ok) {
  // res.ok === (status >= 200 && status < 300)
  // 4XX, 5XX 모두 false
  throw new Error(`HTTP ${res.status}`);
}
```

상태 코드를 모를 때 클래스로 fallback:

```js
// 알 수 없는 코드 499를 받으면 400처럼 처리
function classify(status) {
  if (status >= 500) return 'server-error';
  if (status >= 400) return 'client-error';
  if (status >= 300) return 'redirection';
  if (status >= 200) return 'success';
  return 'informational';
}
```

이게 없으면 어떻게 되는가:

- 5개 클래스가 없다면 — 클라이언트가 모든 가능한 코드를 미리 알아야 함. 새 코드 추가 시 모든 클라이언트 업데이트 필요. 확장성 zero.
- 첫 자릿수로 분류 안 됐다면 — 코드 번호와 의미의 매핑이 임의적이어서 외워야 함. 패턴이 있어 직관적 — 4XX는 일관되게 "내 잘못", 5XX는 "서버 잘못".

오개념 예방: 4XX와 5XX의 책임 구분이 명확하지 않은 코드도 있습니다. 예: `502 Bad Gateway`는 5XX이지만 사실 게이트웨이/프록시의 문제일 수 있어 "정확히 어느 서버"인지 불명확. `429 Too Many Requests`는 4XX이지만 클라이언트가 의도적으로 어긴 게 아니라 단순 과부하 — "client might be able to control"의 어휘 선택이 그래서 신중함. 절대적 분류가 아니라 일반적 가이드.

AI Annotation 보충: 모르는 상태 코드를 받으면 첫 자릿수(클래스)로 판단합니다. 알 수 없는 `499`를 받으면 `400`(Client Error)으로 처리. 상태 코드는 기계가 읽는 것이고, 사유 구문(Bad Request 등)은 사람이 읽는 것입니다 — 사유 구문은 표준이 아니어서 서버가 자유롭게 바꿀 수 있어서 코드만 신뢰해야 합니다.

---

# 다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라

> The Host header field distinguishes between various DNS names sharing a single IP address, allowing name-based virtual hosting.
> While optional in HTTP/1.0, it is mandatory in HTTP/1.1.

---

## 도입

브라우저로 사이트에 접속할 때 실제로 흐르는 요청은 이런 모양입니다:

```
GET / HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

이 요청에서 각 헤더가 어떤 정보를 서버에 알려주고 있는지 봅니다. Official Answer는 `Host` 헤더에 집중하지만, 다른 헤더들도 함께 의미를 정리합니다.

---

## 본문

> The Host header field distinguishes between various DNS names sharing a single IP address,

`Host` 헤더 필드는 단일 IP 주소를 공유하는 여러 DNS 이름을 구분한다.

- **various DNS names sharing a single IP address**: 한 IP에 여러 도메인. 클라우드 호스팅에서 흔함 — `example.com`, `blog.example.com`이 같은 서버에 있을 수 있음.
- **distinguishes**: 구분. 서버가 같은 80/443 포트로 들어온 요청 중 어느 도메인용인지 결정.

> allowing name-based virtual hosting.

이를 통해 이름 기반 가상 호스팅을 가능하게 한다.

- **name-based virtual hosting**: 이름 기반 가상 호스팅. IP가 아닌 도메인 이름으로 사이트를 구분하는 방식. 한 서버 = 여러 사이트.

> While optional in HTTP/1.0, it is mandatory in HTTP/1.1.

HTTP/1.0에서는 선택적이었지만, HTTP/1.1에서는 필수다.

- **optional in HTTP/1.0**: HTTP/1.0 시절엔 IP 1개 = 사이트 1개라 도메인 명시 불필요했음.
- **mandatory in HTTP/1.1**: HTTP/1.1부터는 모든 요청에 `Host` 필수. 빠지면 `400 Bad Request`.

---

## 종합

요청 예시의 모든 헤더 역할:

| 헤더 | 역할 | 설명 |
|---|---|---|
| `GET / HTTP/1.1` | 시작 줄 | 메서드 + 경로 + HTTP 버전 |
| `Host: www.example.com` | 어느 도메인인지 | 가상 호스팅에서 필수 |
| `User-Agent: Mozilla/5.0` | 클라이언트 식별 | 브라우저·OS 정보 |
| `Accept: text/html,...` | 받고 싶은 형식 | MIME 타입 우선순위 (q값) |
| `Accept-Language: en-GB,en;q=0.5` | 선호 언어 | 다국어 사이트의 응답 언어 결정 |
| `Accept-Encoding: gzip, deflate, br` | 받을 수 있는 압축 | gzip/brotli 등 |
| `Connection: keep-alive` | 연결 유지 | 연결 재사용 (HTTP/1.1 기본) |

**Host의 핵심 역할 (Official Answer가 강조)**

가상 호스팅이 왜 필요한지 시나리오로 봅니다:

```
같은 서버 (IP: 1.2.3.4) 가 두 사이트를 호스팅
- example.com → /var/www/example/
- blog.example.com → /var/www/blog/

브라우저: example.com 으로 접속
DNS: example.com → 1.2.3.4 (블로그도 같은 IP)

요청: GET / HTTP/1.1
      Host: example.com    ← 이게 없으면 서버는 어느 사이트인지 모름

서버: Host 헤더 보고 /var/www/example/index.html 반환
```

`Host` 헤더가 없다면 서버는 들어온 요청이 `example.com`인지 `blog.example.com`인지 구분 못 하므로 — 한 IP에 한 사이트만 호스팅 가능합니다. HTTP/1.1이 `Host`를 필수로 만들면서 클라우드 호스팅, 멀티테넌트 SaaS 같은 게 가능해졌습니다.

**Accept 계열 헤더의 q값**

`Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,...`에서 `q=0.9`는 우선순위입니다 (0.0~1.0, 기본 1.0):

- `text/html` = q=1.0 (최선호)
- `application/xhtml+xml` = q=1.0 (최선호)
- `application/xml` = q=0.9 (조금 덜 선호)
- `*/*` = q=0.8 (어떤 것이든 마지막 수단)

서버는 이 우선순위를 보고 가능한 한 가장 선호되는 형식으로 응답합니다.

JS에서 비슷한 헤더를 직접 설정:

```js
await fetch('/api/users', {
  headers: {
    'Accept': 'application/json',         // JSON으로 받겠다
    'Accept-Language': 'ko-KR,en;q=0.8',  // 한국어 우선, 영어 차선
    'Accept-Encoding': 'gzip, br'         // 압축 받을 수 있음 (브라우저가 자동 추가)
  }
});
```

`Host`, `User-Agent`, `Connection`, `Accept-Encoding`은 `fetch()`가 자동으로 추가하므로 명시할 필요가 거의 없습니다 — 이를 "forbidden header names"라 하며, 보안·일관성을 위해 JS에서 강제로 설정 못 하게 막혀 있습니다.

이게 없으면 어떻게 되는가:

- `Host`가 없다면 — 가상 호스팅 불가. 한 IP = 한 사이트만 가능. IPv4 고갈 가속.
- `Accept` 계열이 없다면 — 서버가 클라이언트의 선호를 모르므로 한 가지 형식만 응답. 다국어·다형식 컨텐츠 협상 불가능.
- `Connection: keep-alive`가 없다면 (HTTP/1.0 기본) — 매 요청마다 새 TCP 연결. 페이지 로드 매우 느림.

오개념 예방: HTTPS에서는 TLS 핸드셰이크가 HTTP 요청보다 먼저 일어나므로 — 서버는 클라이언트가 어느 도메인을 원하는지 알아야 올바른 인증서를 보낼 수 있습니다. `Host` 헤더는 암호화 후에 도착하니 너무 늦죠. 이걸 SNI(Server Name Indication)가 TLS 레벨에서 같은 역할을 합니다 — 클라이언트가 ClientHello에 호스트명을 평문으로 첨부.

AI Annotation 보충: 요청 메시지의 시각적 구조 — 시작 줄(Method | Path | Version), 헤더 필드들(Host만 필수), 빈 줄(헤더 끝), 본문(GET은 비어있음, POST는 데이터). `Host`만 필수인 이유는 가상 호스팅 때문입니다 — 하나의 IP에 여러 도메인이 호스팅될 수 있어서 어느 도메인에 대한 요청인지 명시해야 합니다.

---

# 다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라

> The ETag (entity tag) header field is used to determine if a cached version of the requested resource is identical to the current version of the resource on the server.
> The Content-Type header field specifies the Internet media type of the data conveyed by the HTTP message, and Content-Length indicates its length in bytes.
> The HTTP/1.1 webserver publishes its ability to respond to requests for a byte range of the resource by including Accept-Ranges: bytes.
> When Connection: close is sent, it means that the web server will close the TCP connection immediately after the end of the transfer of this response.
> When header Content-Length is missing from a response with a body, then this should be considered an error in HTTP/1.0 but it may not be an error in HTTP/1.1 if header Transfer-Encoding: chunked is present.
> Content-Encoding: gzip informs the client that the body is compressed per the gzip algorithm.

---

## 도입

브라우저가 받은 응답은 보통 이런 모양입니다:

```
HTTP/1.1 200 OK
Date: Mon, 23 May 2005 22:38:34 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 155
Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT
Server: Apache/1.3.3.7 (Unix) (Red-Hat/Linux)
ETag: "3f80f-1b6-3e1cb03b"
Accept-Ranges: bytes
Connection: close
```

각 헤더가 클라이언트에게 어떤 메타정보를 알려주는지 정리합니다. Official Answer는 ETag, Content-Type, Content-Length, Accept-Ranges, Connection, Content-Encoding을 다룹니다.

---

## 본문

> The ETag (entity tag) header field is used to determine if a cached version of the requested resource is identical to the current version of the resource on the server.

`ETag`(entity tag) 헤더 필드는 캐시된 리소스 버전이 서버 상의 현재 버전과 동일한지 판별하는 데 사용된다.

- **ETag**: 리소스의 "지문". 콘텐츠의 해시나 버전 식별자.
- **cached version**: 클라이언트가 가진 캐시본.
- **identical to the current version**: 서버 현재 버전과 동일. 동일하면 재다운로드 불필요.

> The Content-Type header field specifies the Internet media type of the data conveyed by the HTTP message,

`Content-Type` 헤더 필드는 HTTP 메시지가 전달하는 데이터의 인터넷 미디어 타입을 명시한다.

- **Internet media type**: MIME 타입. `text/html`, `application/json`, `image/png` 등.
- **conveyed by the HTTP message**: 메시지가 운반하는. 본문의 형식 알림.

> and Content-Length indicates its length in bytes.

`Content-Length`는 길이를 바이트로 표시한다.

- **length in bytes**: 바이트 단위 길이. 클라이언트가 어디까지 읽으면 끝인지 판단하는 단서.

> The HTTP/1.1 webserver publishes its ability to respond to requests for a byte range of the resource by including Accept-Ranges: bytes.

HTTP/1.1 웹서버는 `Accept-Ranges: bytes`를 포함해 리소스의 바이트 범위 요청에 응답할 수 있는 능력을 알린다.

- **Accept-Ranges: bytes**: "나는 바이트 범위 요청을 받아들일 수 있다"는 광고. 클라이언트가 이걸 보고 `Range` 헤더로 일부만 요청 가능.
- **byte range**: 바이트 범위. 1MB 파일에서 500KB~700KB 구간만 같은 식.

> When Connection: close is sent, it means that the web server will close the TCP connection immediately after the end of the transfer of this response.

`Connection: close`가 전송되면, 웹서버가 이 응답 전송 종료 직후 TCP 연결을 닫는다는 의미다.

- **Connection: close**: 연결 닫기 신호. keep-alive와 반대.
- **immediately after the end of the transfer**: 전송 종료 직후. 다음 요청에 이 연결 못 씀.

> When header Content-Length is missing from a response with a body, then this should be considered an error in HTTP/1.0 but it may not be an error in HTTP/1.1 if header Transfer-Encoding: chunked is present.

본문이 있는 응답에서 `Content-Length` 헤더가 없으면 HTTP/1.0에서는 오류로 간주해야 하지만, HTTP/1.1에서는 `Transfer-Encoding: chunked` 헤더가 있으면 오류가 아닐 수 있다.

- **Content-Length missing**: 길이 헤더 없음. HTTP/1.0에선 명백한 오류.
- **Transfer-Encoding: chunked**: 청크 단위 전송. 길이 미상이어도 가능 — 각 청크가 자기 크기 명시.

> Content-Encoding: gzip informs the client that the body is compressed per the gzip algorithm.

`Content-Encoding: gzip`은 본문이 gzip 알고리즘으로 압축되었음을 클라이언트에게 알린다.

- **Content-Encoding**: 본문 인코딩(주로 압축). 클라이언트가 풀어서 사용해야 함.
- **gzip algorithm**: gzip 압축. 텍스트 응답에서 50~80% 절감.

---

## 종합

응답 예시의 모든 헤더 역할:

| 헤더 | 역할 | 설명 |
|---|---|---|
| `HTTP/1.1 200 OK` | 시작 줄 | 버전 + 상태 코드 + 사유 구문 |
| `Date: Mon, 23 May 2005 22:38:34 GMT` | 응답 시각 | 서버가 응답 생성한 시간 |
| `Content-Type: text/html; charset=UTF-8` | 본문 형식 | MIME 타입 + 인코딩 |
| `Content-Length: 155` | 본문 길이 | 바이트 단위 |
| `Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT` | 마지막 수정 시각 | 조건부 GET용 |
| `Server: Apache/1.3.3.7 (Unix) (Red-Hat/Linux)` | 서버 식별 | 서버 소프트웨어 정보 (보안상 가리는 경우 많음) |
| `ETag: "3f80f-1b6-3e1cb03b"` | 리소스 지문 | 캐시 유효성 검증 |
| `Accept-Ranges: bytes` | 범위 요청 지원 | 클라이언트가 일부만 요청 가능 알림 |
| `Connection: close` | 연결 종료 신호 | 응답 후 TCP 연결 닫음 |

**ETag 활용 — 조건부 GET의 흐름**:

```
첫 요청:
  GET /article HTTP/1.1
  Host: example.com

응답:
  HTTP/1.1 200 OK
  ETag: "abc123"
  ...본문...

두 번째 요청 (이미 캐시된 상태):
  GET /article HTTP/1.1
  Host: example.com
  If-None-Match: "abc123"      ← 내가 가진 ETag

서버: 현재 ETag와 비교 → 동일
응답:
  HTTP/1.1 304 Not Modified    ← 본문 없음, 캐시 그대로 써
```

이 흐름으로 트래픽이 절감됩니다 — 변경 안 된 리소스는 본문 다운로드 안 함.

**JS 코드에서 응답 헤더 활용**:

```js
const res = await fetch('/api/users');

res.status;                              // 200 — 시작 줄의 상태 코드
res.headers.get('content-type');         // 'application/json'
res.headers.get('content-length');       // '155'
res.headers.get('etag');                 // '"abc123"' — 다음 요청에 If-None-Match로 활용
res.headers.get('cache-control');        // 'public, max-age=3600' (예시에는 없지만 흔함)

// gzip 응답은 브라우저가 자동 해제 — 코드에선 평문으로 보임
const text = await res.text();           // gzip 압축된 응답이라도 자동 디코딩
```

**Connection: close vs keep-alive**:

| Connection 값 | 의미 | HTTP 버전 기본 |
|---|---|---|
| `keep-alive` | 응답 후 연결 유지, 재사용 | HTTP/1.1 기본 |
| `close` | 응답 후 연결 닫기 | HTTP/1.0 기본 |

예시의 `Connection: close`는 HTTP/1.1이지만 명시적으로 keep-alive를 거부 — 서버가 부하를 분산하기 위해 의도적으로 연결을 끊는 경우 사용.

**Content-Length vs Transfer-Encoding: chunked**:

```
Content-Length 사용 (정적 콘텐츠):
  Content-Type: text/html
  Content-Length: 155
  ...155 바이트 본문...

Transfer-Encoding: chunked 사용 (동적/스트리밍):
  Content-Type: application/json
  Transfer-Encoding: chunked
  
  10                    ← 청크 1 크기 (16진수 = 16바이트)
  ...16바이트 데이터...
  20                    ← 청크 2 크기 (16진수 = 32바이트)
  ...32바이트 데이터...
  0                     ← 종료 청크
                        ← 끝
```

둘은 함께 쓰지 않습니다 — chunked일 때는 Content-Length 빠짐.

이게 없으면 어떻게 되는가:

- `ETag`/`Last-Modified`가 없다면 — 캐시 유효성을 알 수 없어 매번 전체 콘텐츠 다운로드. 트래픽 폭증.
- `Content-Length`가 없고 chunked도 없다면 — 클라이언트는 어디가 본문 끝인지 모름. HTTP/1.0의 "연결 종료 = 끝" 가정의 한계로 부분 콘텐츠 감지 불가.
- `Content-Encoding`이 없다면 — gzip 압축 사용 불가. 텍스트 응답이 50~80% 더 큼.

오개념 예방: `Server` 헤더는 보안 관점에서 가리는 게 권장됩니다. 예시의 `Apache/1.3.3.7` 같은 정보는 공격자에게 알려진 취약점 활용의 단서가 됩니다. 운영 서버는 보통 `Server: nginx`처럼 버전을 빼거나 아예 헤더를 제거합니다.

Official Annotation 보충: 응답은 다음 요소들로 구성됩니다 — HTTP 프로토콜 버전, 상태 코드(성공 여부와 이유), 상태 메시지(코드의 짧은 설명, 비공식적), 요청과 같은 HTTP 헤더들, 가져온 리소스를 담은 선택적 본문.

AI Annotation 보충: 응답 메시지 시각적 구조 — Status Line(Version | Code | Message), Headers, 빈 줄, Body(리소스, 선택적). 상태 메시지(`OK`, `Not Found` 등)는 "non-authoritative" — 표준이 아니라 서버가 자유롭게 바꿀 수 있어, 클라이언트는 코드(숫자)만 신뢰해야 합니다.
