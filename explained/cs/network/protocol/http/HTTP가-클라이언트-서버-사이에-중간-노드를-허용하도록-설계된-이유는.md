# HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?

> HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.
> High-traffic websites often benefit from web cache servers that deliver content on behalf of upstream servers to improve response time.
> Web browsers cache previously accessed web resources and reuse them, whenever possible, to reduce network traffic.
> HTTP proxy servers at private network boundaries can facilitate communication for clients without a globally routable address, by relaying messages with external servers.

---

**도입**

브라우저에서 `https://example.com`을 요청하면, 패킷이 곧장 example.com 서버로 도달한다고 생각하기 쉽습니다. 하지만 실제로는 회사 프록시, ISP 캐시, CDN 노드, 방화벽을 거쳐 도착합니다. HTTP는 이런 중간 노드들을 끼워 넣을 수 있도록 처음부터 설계됐습니다 — 그래야만 웹이 지금의 규모로 성장할 수 있었기 때문입니다.

---

**본문**

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

**종합**

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
