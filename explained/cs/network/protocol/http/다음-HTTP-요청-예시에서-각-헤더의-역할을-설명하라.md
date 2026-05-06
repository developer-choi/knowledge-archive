# 다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라

> The Host header field distinguishes between various DNS names sharing a single IP address, allowing name-based virtual hosting.
> While optional in HTTP/1.0, it is mandatory in HTTP/1.1.

---

**도입**

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

**본문**

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

**종합**

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
