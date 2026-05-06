# TLS 서버가 하나의 IP:포트 조합에 하나의 인증서만 제시할 수 있는 이유와, 이 제약을 SNI가 어떻게 해결하는가?

> Because TLS operates at a protocol level below that of HTTP and has no knowledge of the higher-level protocols, TLS servers can only strictly present one certificate for a particular address and port combination.
> In the past, this meant that it was not feasible to use name-based virtual hosting with HTTPS.
> A solution called Server Name Indication (SNI) exists, which sends the hostname to the server before encrypting the connection, although older browsers do not support this extension.

---

**도입**

HTTP는 `Host` 헤더로 가상 호스팅(한 IP에 여러 도메인)이 가능했지만 — HTTPS에서는 처음엔 안 됐습니다. 왜? TLS handshake가 HTTP 요청보다 먼저 일어나기 때문에 서버가 "어느 도메인의 인증서를 보여줄지" 결정할 시점에 도메인을 모릅니다. 이 닭과 달걀 문제를 SNI가 풀었습니다.

---

**본문**

> Because TLS operates at a protocol level below that of HTTP and has no knowledge of the higher-level protocols,

TLS는 HTTP보다 낮은 프로토콜 레벨에서 동작하며 상위 프로토콜에 대한 지식이 없기 때문에.

- **operates at a protocol level below HTTP**: HTTP보다 낮은 프로토콜 레벨. TLS는 애플리케이션 계층의 sublayer지만 HTTP보다 아래 — HTTP 메시지를 받기 전에 채널이 먼저 수립.
- **no knowledge of higher-level protocols**: 상위 프로토콜 모름. TLS 자체는 HTTP의 `Host` 헤더 같은 것을 모르고, 그것을 읽을 수도 없음 (아직 핸드셰이크 중이라 평문 HTTP 요청이 안 옴).

> TLS servers can only strictly present one certificate for a particular address and port combination.

TLS 서버는 특정 주소와 포트 조합에 대해 엄격히 한 개의 인증서만 제시할 수 있다.

- **one certificate for a particular address and port**: IP+포트당 인증서 1개. `1.2.3.4:443`이라는 조합에 인증서 1개.
- **strictly**: 엄격히. 다른 도메인의 인증서를 동시에 가지고 있을 수 없음.

> In the past, this meant that it was not feasible to use name-based virtual hosting with HTTPS.

과거에는 이로 인해 HTTPS와 함께 이름 기반 가상 호스팅을 사용하는 것이 실현 불가능했다.

- **not feasible**: 실현 불가능. 한 IP에 여러 HTTPS 사이트를 호스팅하는 방법이 없었음.
- **name-based virtual hosting**: 이름 기반 가상 호스팅. 도메인 이름으로 사이트를 구분 — HTTP의 `Host` 헤더로 가능했던 것.

> A solution called Server Name Indication (SNI) exists,

SNI(Server Name Indication)라는 해결책이 존재한다.

- **Server Name Indication (SNI)**: TLS의 확장. 클라이언트가 접속하려는 호스트명을 TLS handshake 시작 시 서버에 알리는 메커니즘.

> which sends the hostname to the server before encrypting the connection,

연결을 암호화하기 전에 호스트명을 서버에 보낸다.

- **before encrypting**: 암호화 전. SNI는 TLS handshake의 가장 첫 단계인 ClientHello에서 평문으로 전송.
- **hostname**: 호스트명. 접속하려는 도메인.

> although older browsers do not support this extension.

다만 구형 브라우저는 이 확장을 지원하지 않는다.

- **older browsers**: 구형 브라우저. IE 6 (Windows XP) 등이 대표적. 현재는 무시할 수준.
- **extension**: 확장. SNI는 TLS의 핵심이 아닌 추가 기능 (TLS 1.0 RFC에 추가됨).

---

**종합**

문제와 해결을 시간 순으로:

```
HTTPS 초기 (SNI 없음):
  서버: 1.2.3.4:443 = example.com 전용 (인증서 1개)
  → 한 IP에 한 HTTPS 사이트만 가능
  → 새 사이트마다 새 IP 필요
  → IPv4 고갈 가속

SNI 도입 (RFC 4366, 2006):
  클라이언트: ClientHello에 "내가 접속하려는 도메인은 example.com" 평문 첨부
  서버: ClientHello를 받고 SNI 확인 → example.com용 인증서 선택해 응답
  → 한 IP에 여러 HTTPS 사이트 가능
  → 가상 호스팅의 HTTPS 버전이 가능
```

TLS handshake에서 SNI의 위치:

```
1. 클라이언트 → 서버: ClientHello
   - 지원 cipher suites
   - 지원 TLS 버전
   - SNI: server_name = "example.com"   ← 평문!

2. 서버: SNI 보고 example.com 인증서 선택
   서버 → 클라이언트: ServerHello + Certificate

3. 키 교환, 검증, 세션 키 협상 (이후 단계는 암호화)

4. 암호화된 채널로 HTTP 요청 시작
```

JS 개발자에게 와닿는 사례:

```js
// 클라우드 호스팅에서 한 IP에 여러 HTTPS 사이트
await fetch('https://example.com/api');     // 인증서: example.com
await fetch('https://blog.example.com/api'); // 인증서: blog.example.com
// 둘 다 같은 IP일 수 있음 — SNI로 구분
```

DevTools에서 SNI 확인:

```
DevTools → Network 탭 → 요청 클릭 → Connection 정보
또는 Wireshark로 ClientHello 패킷 캡처:
- "Extension: server_name (SNI)"가 평문으로 보임
```

**SNI의 부작용 — 도메인 노출**

SNI는 평문으로 호스트명을 전송하기 때문에 — 도청자가 사용자가 어느 도메인에 접속하는지 볼 수 있습니다. URL의 경로·쿼리는 암호화되지만 도메인은 노출. 이게 HTTPS의 알려진 메타데이터 누출 중 하나.

**Encrypted Client Hello (ECH)** — 진화 방향:

2024년부터 Chrome, Firefox 등이 ECH(과거 ESNI)를 지원하기 시작. ECH는 SNI를 포함한 ClientHello 자체를 암호화 — 진정한 도메인 보호. 아직 100% 표준은 아니지만 점진적 보급 중.

**호스팅 측면의 영향**:

- **클라우드 호스팅**: AWS, Cloudflare, Vercel 등이 한 IP에 수많은 HTTPS 사이트 호스팅 — 모두 SNI 덕분.
- **CDN**: Cloudflare는 같은 anycast IP에 수만 사이트 호스팅. SNI 없이는 불가능.
- **Server Block 설정** (nginx 예):

```nginx
server {
  listen 443 ssl;
  server_name example.com;
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  # ...
}

server {
  listen 443 ssl;
  server_name blog.example.com;
  ssl_certificate /etc/letsencrypt/live/blog.example.com/fullchain.pem;
  # ...
}
# nginx가 SNI 보고 적절한 server 블록 선택
```

이게 없으면 어떻게 되는가:

- SNI가 없었다면 — HTTPS의 보급이 IP 주소 수에 제약됨. IPv4가 빠르게 고갈됐을 것. 클라우드 호스팅·CDN 사업 모델 자체가 어려워짐.
- 또는 모든 사이트가 같은 인증서(여러 도메인의 SAN을 모은 멀티 도메인 인증서)를 써야 했을 것 — 인증서 관리 악몽, 한 사이트 변경 시 전체 갱신 필요.

오개념 예방: SNI는 보안 메커니즘이 아니라 "여러 인증서를 어떻게 구분할지"의 라우팅 메커니즘입니다. 보안 강화가 아니라 인프라 효율을 위한 확장. 오히려 평문 도메인 노출이라는 보안적 단점이 있어 — ECH로 진화 중.

또 다른 오해: "한 인증서가 여러 도메인을 커버할 수도 있는데?" 가능합니다. SAN(Subject Alternative Names) 인증서로 여러 도메인을 한 인증서에 담을 수 있습니다 (예: Cloudflare의 Universal SSL). 하지만 — 모든 도메인이 한 인증서에 묶이면 한 도메인의 변경이 전체 인증서 갱신을 요구. SNI는 도메인별 다른 인증서를 가능하게 해 더 유연한 운영을 허용합니다.

AI Annotation 보충: TLS 핸드셰이크는 HTTP 요청보다 먼저 일어나므로, 서버는 클라이언트가 어떤 도메인에 접속하려는지 알 수 없습니다. SNI는 TLS ClientHello 메시지에 호스트명을 평문으로 포함시켜 서버가 올바른 인증서를 선택하게 합니다. 이것이 HTTPS에서도 도메인명이 보호되지 않는 근본적 이유입니다 — 암호화 전에 호스트명을 보내야 하기 때문입니다.
