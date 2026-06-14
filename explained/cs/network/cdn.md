# CDN이란 무엇인가?

## 도입

브라우저가 `fetch("https://example.com/image.png")`를 호출할 때, 그 이미지 파일이 실제로 어떤 서버에서 오는지 항상 원본 서버(origin server)일 필요는 없다. CDN은 원본 대신 사용자 가까이 있는 서버에서 캐시된 사본을 제공하는 구조다. OA는 CDN을 "origin 서버에서 리소스를 캐싱한 뒤, 사용자와 물리적으로 더 가까운 엣지 서버에서 제공하는 분산 서버 네트워크"로 정의한다.

---

## 본문

> A Content Delivery Network (CDN) is a distributed network of servers that cache resources from your origin server, and in turn, serves them from edge servers that are physically closer to your users.

"CDN은 origin 서버의 리소스를 캐싱하는 서버들의 분산 네트워크로, 사용자와 물리적으로 더 가까운 엣지 서버에서 그 리소스를 제공한다."

- **distributed network**: 지리적으로 여러 위치에 흩어진 서버 집합. 한 곳에 집중되어 있지 않기 때문에 어느 지역 사용자든 가까운 노드를 찾을 수 있다.
- **cache resources from your origin server**: origin의 리소스를 사전에 복사해 두는 것. 사용자가 요청할 때마다 origin에 가지 않아도 된다. `HTTP Cache-Control` 설정이 이 캐싱 수명을 제어한다.
- **origin server**: 원본 데이터를 보유한 본래의 서버. 배포한 Node.js 서버나 S3 버킷이 여기에 해당한다.
- **edge servers**: 사용자와 지리적으로 가까운 위치에 배치된 CDN 노드. DevTools Network 탭에서 응답 헤더 `Via: cloudflare`나 `x-amz-cf-pop`을 보면 엣지를 경유했다는 증거다.
- **physically closer**: 물리적 거리가 가까울수록 전파가 이동하는 시간이 줄어든다 — 이것이 RTT 감소의 근본 원인이다.

```
사용자 (서울)
    │
    ▼
엣지 서버 (서울 CDN 노드) ← 캐시 HIT → 즉시 응답
    │ 캐시 MISS
    ▼
Origin 서버 (미국 버지니아)
```

---

## 종합

CDN의 본질은 "자주 요청되는 정적 리소스를 사용자 가까운 곳에 미리 복사해 두는 것"이다. origin이 미국에 있어도 서울 엣지에 이미지가 캐싱되어 있으면 서울 사용자는 태평양 왕복 지연 없이 바로 받는다. 반대로 CDN 없이 origin 단일 서버만 운영하면 모든 사용자가 원본 서버까지 왕복해야 하므로, 지리적으로 먼 사용자일수록 체감 속도 격차가 커진다.

---

# CDN은 어떻게 성능을 개선하는가?

## 도입

CDN이 단순히 "가까이 있어서 빠른 것" 만은 아니다. 물리적 근접성 외에도 HTTP 프로토콜 최적화·캐싱·압축이 복합적으로 작동한다. 프론트엔드 성능 지표 중 TTFB(Time To First Byte)가 CDN 도입 후 급격히 줄어드는 이유가 여기에 있다.

---

## 본문

> The physical proximity to your users reduces round-trip time (RTT), while optimizations such as HTTP/2 or HTTP/3, caching, and compression allow the CDN to serve content more quickly than if it would be fetched from your origin server.

"사용자와의 물리적 근접성은 RTT를 줄이며, HTTP/2·HTTP/3, 캐싱, 압축 같은 최적화 덕분에 CDN은 origin 서버에서 직접 가져오는 것보다 콘텐츠를 더 빨리 제공할 수 있다."

- **physical proximity**: 물리적 가까움. 빛이 광케이블을 통해 이동하는 속도는 고정되어 있으므로 거리가 짧을수록 지연이 줄어드는 건 물리 법칙이다.
- **round-trip time (RTT)**: 요청을 보내고 첫 응답 바이트를 받기까지의 왕복 시간. DevTools Network 탭 Timing 패널의 "Waiting (TTFB)" 항목이 여기 포함된다.
- **HTTP/2 or HTTP/3**: HTTP/2는 멀티플렉싱(한 커넥션에서 여러 요청 동시 처리)으로 HOL 블로킹을 줄이고, HTTP/3은 UDP 기반 QUIC으로 패킷 손실 시 복구 속도를 높인다. CDN은 origin-CDN 구간에도 이 최적화를 적용한다.
- **caching**: 같은 요청이 반복될 때 origin 왕복 자체를 생략한다. cache HIT이면 엣지에서 곧장 응답.
- **compression**: 응답 바디를 gzip·brotli로 압축해 전송 바이트를 줄인다. `Content-Encoding: br` 응답 헤더로 확인 가능.

> Utilizing a CDN can significantly improve your website's TTFB in some cases.

"CDN을 활용하면 어떤 경우에 웹사이트의 TTFB를 크게 개선할 수 있다."

- **TTFB (Time To First Byte)**: 브라우저가 요청을 보낸 뒤 서버로부터 첫 바이트를 받기까지 걸린 시간. Lighthouse의 "Server response time" 항목과 대응된다.
- **in some cases**: 이미 캐시 미스가 많거나 동적 콘텐츠 비중이 높으면 개선 폭이 줄어든다. 정적 에셋 위주 사이트에서 효과가 가장 크다.

---

## 종합

CDN이 TTFB를 줄이는 경로는 두 가지다. 첫째, 엣지 캐시 HIT 시 origin 왕복이 완전히 생략된다. 둘째, 캐시 MISS여서 origin에 가야 해도 CDN-origin 구간은 HTTP/2·HTTP/3으로 최적화된 전용 경로를 쓰므로 일반 클라이언트-origin 직접 연결보다 빠를 수 있다. 개발자 입장에서 CDN의 효과를 체감하는 순간은 해외 사용자가 "한국 서버인데 왜 이렇게 빠르냐"고 할 때다 — 그 사용자는 사실 가까운 엣지 노드에서 받고 있는 것이다.
