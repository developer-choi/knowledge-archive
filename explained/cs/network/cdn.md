# CDN은 어떻게 성능을 개선하는가?

## 도입

CDN은 단순히 "서버를 여러 곳에 두는 것" 이상입니다. 사용자와 가까운 거리(proximity)로 RTT를 줄이는 기본 효과 위에, 프로토콜 최적화·캐싱·압축이라는 여러 층의 가속이 동시에 작동합니다. 한국 사용자가 미국 origin 서버 대신 한국 엣지에서 자료를 받을 때 느끼는 그 빠름이 이 여러 요인의 합산입니다.

---

## 본문

> The physical proximity to your users reduces round-trip time (RTT),

사용자와의 물리적 근접성이 왕복 시간(RTT)을 줄여주고,

- **physical proximity**: 물리적 근접성. 사용자와 엣지 서버 사이의 실제 거리. 광속 한계는 절대로 못 깎으니, 가깝게 두는 것이 가장 근본적인 성능 개선책.
- **round-trip time (RTT)**: 요청을 보내고 응답이 돌아오기까지의 왕복 시간. 거리가 줄면 RTT가 줄고, RTT가 줄면 모든 요청 단계(TCP handshake·TLS handshake·HTTP 요청)가 빨라집니다.
- **reduces RTT**: 거리 단축 → RTT 단축. CDN의 가장 핵심적이고 절대 깎이지 않는 효과.

> while optimizations such as HTTP/2 or HTTP/3, caching, and compression

HTTP/2 또는 HTTP/3, 캐싱, 압축 같은 최적화들이

- **HTTP/2 or HTTP/3**: 멀티플렉싱·헤더 압축·QUIC 기반 0-RTT 핸드셰이크 등으로 같은 RTT에서도 더 많은 일을 처리. CDN은 보통 origin보다 먼저 최신 프로토콜을 지원.
- **caching**: 캐싱 — 같은 자료에 대한 요청을 origin까지 거치지 않고 엣지에서 즉시 응답. 그래서 origin 부하도 줄고 응답 시간도 줄어듦.
- **compression**: 압축 — gzip·Brotli 같은 압축으로 전송할 바이트 수를 줄여 같은 회선에서 더 빠르게 전달.

> allow the CDN to serve content more quickly than if it would be fetched from your origin server.

CDN이 콘텐츠를 origin 서버에서 가져오는 경우보다 더 빠르게 제공할 수 있게 해준다.

- **serve content more quickly**: 콘텐츠를 더 빠르게 제공. 거리 단축(RTT) + 프로토콜·캐싱·압축 최적화의 종합 효과.
- **than if it would be fetched from your origin server**: origin에서 가져오는 경우와의 비교. CDN이 가져다주는 차이가 곧 두 경로의 시간 차이.

---

## 종합

CDN의 성능 개선 요인을 층별로 정리하면:

| 요인 | 줄이는 것 | 구체적 효과 |
|---|---|---|
| 물리적 근접성 | 광속 거리 | RTT 감소 — 핸드셰이크·요청·응답 모두 빨라짐 |
| HTTP/2 / HTTP/3 | 프로토콜 오버헤드 | 멀티플렉싱·헤더 압축·0-RTT |
| 캐싱 | origin 호출 자체 | 같은 자료 재요청 시 즉답 |
| 압축 | 전송 바이트 수 | 같은 회선에서 더 빠른 다운로드 |

브라우저 개발자가 CDN의 효과를 직접 보는 곳:
- Chrome DevTools Network 탭에서 같은 자료의 응답 헤더를 보면 `cf-cache-status: HIT` (Cloudflare), `x-cache: HIT` (CloudFront) 같은 표시를 볼 수 있습니다 — 이게 캐시에서 즉답한 흔적.
- 큰 이미지나 JS 번들을 origin 서버 직접 호스팅 → CDN 호스팅으로 바꾸면 Timing의 "TTFB"(Time To First Byte)가 눈에 띄게 줄어드는 게 보입니다. Official Annotation도 이 효과를 명시 — "Utilizing a CDN can significantly improve your website's TTFB".
- `traceroute cdn.example.com`을 한국과 미국에서 각각 실행하면 hop 수와 레이턴시가 완전히 다르게 나옵니다. 한국 사용자는 한국 엣지로, 미국 사용자는 미국 엣지로 자동 라우팅되니까.

가장 결정적인 요인은 **물리적 근접성**입니다. 광속은 약 30만 km/s로 절대 깎이지 않으니, 한국 ↔ 미국 동부의 왕복은 광섬유 직선 거리만 따져도 최소 100ms 이상. 사용자 옆 엣지에서 받으면 같은 자료의 RTT가 5~20ms로 떨어집니다. 5번의 핸드셰이크·요청을 한다면 격차가 5배로 누적됩니다.

오개념 예방: "CDN은 캐시 서버"라는 단순화로는 부족합니다. 캐싱은 여러 효과 중 하나이고, 캐시가 미스(MISS)되어도 CDN은 RTT 단축·프로토콜 최적화·압축 효과를 여전히 제공합니다. 정적 자료뿐 아니라 동적 API 요청도 CDN의 이런 부수 효과로 가속될 수 있는 이유입니다.

이게 없으면 어떻게 되는가: CDN 없이 origin만 호스팅한다면, 한국 사용자가 미국 origin 서버에 접속할 때 매 요청마다 100ms 이상의 RTT를 부담합니다. 페이지 한 번 로드에 수십 개의 자료가 필요하다면 누적 시간이 수 초까지 늘어날 수 있습니다. CDN은 이 시간을 한 자릿수 ms로 떨어뜨리고, 동시에 origin 부하도 캐시 히트만큼 덜어줍니다 — 사용자 체감과 인프라 비용 양쪽에서 효과가 큰 이유.
