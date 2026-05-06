# HTTPS가 보안 외에 성능에도 영향을 미치는 이유는?

> Deploying HTTPS also allows the use of HTTP/2 and HTTP/3 (and their predecessors SPDY and QUIC), which are new HTTP versions designed to reduce page load times, size, and latency.

---

**도입**

HTTPS는 보안의 영역으로 시작했지만 — 실제로는 성능에도 큰 영향을 줍니다. 브라우저들이 HTTP/2와 HTTP/3를 HTTPS 위에서만 지원하기로 결정했기 때문입니다. 즉, 사이트가 멀티플렉싱·헤더 압축·서버 푸시 같은 새 성능 기능을 쓰려면 — HTTPS는 사실상 필수 조건이 됐습니다.

---

**본문**

> Deploying HTTPS also allows the use of HTTP/2 and HTTP/3

HTTPS 배포는 HTTP/2와 HTTP/3 사용도 가능하게 해준다.

- **deploying HTTPS**: HTTPS 배포. 사이트에 TLS 인증서를 적용해 https로 서비스.
- **also allows**: 또한 가능하게 해줌. "보안에 더해 성능까지" 부가 효과.

> (and their predecessors SPDY and QUIC),

(그리고 그 전신인 SPDY와 QUIC).

- **SPDY**: HTTP/2의 전신. Google이 만든 실험 프로토콜로, 표준화되며 HTTP/2가 됨. 2016년 폐기.
- **QUIC**: 처음엔 Google의 실험 프로토콜이었으나 IETF가 표준화해 HTTP/3의 전송 계층이 됨.

> which are new HTTP versions designed to reduce page load times, size, and latency.

이것들은 페이지 로드 시간, 크기, 지연을 줄이도록 설계된 새 HTTP 버전이다.

- **page load times**: 페이지 로드 시간. 사용자가 보는 페이지가 표시되기까지의 시간.
- **size**: 크기. 헤더 압축으로 트래픽 줄임. 모바일 환경에서 특히 중요.
- **latency**: 지연. RTT 단축, HOL blocking 회피로 응답 시작이 빨라짐.

---

**종합**

HTTPS와 성능의 관계:

| 항목 | HTTP (평문) | HTTPS (TLS 위) |
|---|---|---|
| HTTP/1.1 | 사용 가능 | 사용 가능 |
| HTTP/2 | 표준상 가능, 브라우저는 거부 | 사용 가능 |
| HTTP/3 | 불가 | 사용 가능 |
| 멀티플렉싱 | 불가 (HTTP/1.1에서 직렬) | 가능 (HTTP/2/3) |
| 헤더 압축 (HPACK/QPACK) | 불가 | 가능 |
| 0-RTT 핸드셰이크 | 해당 없음 | TLS 1.3 + HTTP/3에서 가능 |

왜 HTTP/2가 사실상 HTTPS에서만 동작하는가:

표준 자체는 HTTP/2를 평문(`h2c`)으로 사용하는 것을 허용합니다. 하지만 — 모든 주요 브라우저(Chrome, Firefox, Safari, Edge)가 평문 HTTP/2를 지원하지 않기로 결정했습니다. 이유는:

1. **호환성 문제 회피**: HTTP/1.1 파이프라이닝의 실패 사례에서 배운 교훈. 중간 노드(투명 프록시 등)가 HTTP/2 바이너리 프레임을 잘못 처리해 호환성 문제를 일으킬 수 있음. HTTPS면 중간 노드가 페이로드를 못 보므로 간섭 불가.
2. **보안 가속화**: 브라우저들이 HTTP/2를 HTTPS 전용으로 만들면서 — 성능 이득을 원하는 사이트는 자동으로 HTTPS로 이동. HTTP/2 자체가 HTTPS 보급의 동력이 됨.

JS 개발자에게 의미:

```js
// 같은 사이트가 HTTPS면 HTTP/2 (브라우저 자동 협상)
await fetch('https://example.com/api/users');
// DevTools Protocol 컬럼: "h2" → 멀티플렉싱, HPACK 적용

// HTTP면 HTTP/1.1로 강등
await fetch('http://example.com/api/users');
// DevTools Protocol 컬럼: "http/1.1" → 직렬 처리
```

체감되는 차이:

- 이미지·CSS·JS가 많은 페이지에서 HTTP/2(HTTPS) 사이트가 HTTP/1.1(평문) 사이트보다 눈에 띄게 빠르게 그려짐
- 모바일 네트워크에서 HPACK 헤더 압축으로 응답이 작아져 느린 네트워크에서도 부드러움
- 도메인 샤딩(`cdn1`, `cdn2` 등으로 분산) 같은 우회 기법이 불필요 — HTTP/2 한 연결로 충분

이게 없으면 어떻게 되는가:

- HTTP/2가 HTTP에서도 동작했다면 — HTTPS 보급의 결정적 동인 하나가 사라졌을 것. 보안 인식만으로 보급이 늦어졌을 가능성 큼.
- HTTPS 없이는 HTTP/2/3의 모든 성능 이점을 못 씀 — 평문 HTTP/1.1만 사용 시 멀티플렉싱·헤더 압축·서버 푸시 모두 불가.

오개념 예방: "TLS 핸드셰이크 때문에 HTTPS가 더 느린 거 아닌가?"는 옛날 이야기입니다. 과거(2010년대 초)엔 TLS handshake가 1~2 RTT 추가 비용이었지만 — TLS 1.3은 1-RTT(처음 연결) 또는 0-RTT(재연결)로 단축. HTTP/2/3의 멀티플렉싱·헤더 압축이 주는 이득이 핸드셰이크 비용을 압도적으로 상쇄. 현대 환경에서 HTTPS는 평문 HTTP보다 빠른 게 일반적입니다.

또 다른 오개념: HTTP/3 = HTTPS 필수. HTTP/3는 처음부터 TLS 1.3과 통합되도록 설계됐습니다 — 평문 HTTP/3는 표준상 존재하지 않습니다. QUIC 자체에 암호화가 내장되어 있어, "HTTP/3 = HTTP + QUIC + TLS 1.3" 묶음.

배포 측면에서: 모던 사이트의 사실상 최소 사양은 "HTTPS + HTTP/2"입니다. CDN(Cloudflare, CloudFront, Fastly)을 쓰면 HTTPS 인증서 자동 발급(Let's Encrypt 통합) + HTTP/2/3 자동 활성화 — 별도 설정 거의 없이 모던 성능 스택을 얻을 수 있습니다.

AI Annotation 보충: 브라우저들은 HTTP/2, HTTP/3를 HTTPS 연결에서만 지원합니다. 즉 HTTPS는 보안의 문제만이 아니라 멀티플렉싱, 헤더 압축, 서버 푸시 등 성능 최적화를 사용하기 위한 전제조건입니다.
