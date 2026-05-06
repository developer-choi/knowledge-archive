# HTTPS는 HTTP의 어떤 부분을 암호화하고, 어떤 정보는 보호하지 못하는가?

> Because HTTPS piggybacks HTTP entirely on top of TLS, the entirety of the underlying HTTP protocol can be encrypted.
> This includes the request's URL, query parameters, headers, and cookies (which often contain identifying information about the user).
> However, because website addresses and port numbers are necessarily part of the underlying TCP/IP protocols, HTTPS cannot protect their disclosure.
> In practice this means that even on a correctly configured web server, eavesdroppers can infer the IP address and port number of the web server, and sometimes even the domain name (e.g. www.example.org, but not the rest of the URL) that a user is communicating with, along with the amount of data transferred and the duration of the communication, though not the content of the communication.

---

**도입**

HTTPS는 "전부 암호화"라는 인상이 있지만 실제로는 그렇지 않습니다. 패킷이 인터넷을 흐르려면 출발지와 목적지 IP가 평문이어야 하고 — 그게 라우팅의 기본 조건이니까요. 어디까지 암호화되고 무엇이 노출되는지 정확히 구분하면, 단순 "HTTPS면 안전"이 아니라 정확한 보안 모델을 갖게 됩니다.

---

**본문**

> Because HTTPS piggybacks HTTP entirely on top of TLS, the entirety of the underlying HTTP protocol can be encrypted.

HTTPS는 HTTP를 TLS 위에 통째로 얹기 때문에, 기반 HTTP 프로토콜 전체가 암호화될 수 있다.

- **piggybacks**: 업혀가다. HTTP가 TLS 위에 통째로 얹힌 모양 — TLS가 어깨에 메고 가는 그림.
- **entirely**: 통째로. 일부가 아닌 HTTP 메시지 전체.
- **the entirety of the underlying HTTP protocol**: 기반 HTTP 프로토콜 전체. 시작 줄부터 헤더, 본문까지.

> This includes the request's URL, query parameters, headers, and cookies (which often contain identifying information about the user).

여기에는 요청의 URL, 쿼리 파라미터, 헤더, 쿠키(사용자 식별 정보를 자주 담고 있는)가 포함된다.

- **request's URL**: 요청 URL의 경로 부분. `/api/users/123/profile` 같은 부분이 암호화. 도메인은 별개.
- **query parameters**: `?token=abc&q=secret` 같은 쿼리 파라미터. 암호화됨.
- **headers and cookies**: 헤더와 쿠키. `Authorization: Bearer ...`, `Cookie: sessionId=...` 모두 암호화.
- **identifying information about the user**: 사용자 식별 정보. 세션 ID, 인증 토큰 등이 들어있는 곳.

> However, because website addresses and port numbers are necessarily part of the underlying TCP/IP protocols,

하지만 웹사이트 주소와 포트 번호는 기반 TCP/IP 프로토콜의 필수 부분이므로.

- **necessarily part of the underlying TCP/IP**: TCP/IP의 필수 부분. 패킷이 라우팅되려면 출발지·목적지 IP와 포트가 평문이어야 함.
- **port numbers**: 포트 번호. 443(HTTPS), 80(HTTP) 등.

> HTTPS cannot protect their disclosure.

HTTPS는 이들의 노출을 보호할 수 없다.

- **cannot protect**: 보호 불가. TLS는 페이로드만 암호화 — 헤더는 그 위 계층의 일이라 라우팅 정보까지 암호화하면 패킷이 갈 곳을 잃음.

> In practice this means that even on a correctly configured web server, eavesdroppers can infer the IP address and port number of the web server,

실제로 이는 올바르게 설정된 웹서버에서도 도청자가 웹서버의 IP 주소와 포트 번호를 추론할 수 있다는 의미다.

- **correctly configured**: 올바르게 설정된. 즉 보안 설정이 완벽한 사이트에서도.
- **eavesdroppers can infer**: 도청자가 추론 가능. 패킷 헤더만 봐도 출발지·목적지 알 수 있음.

> and sometimes even the domain name (e.g. www.example.org, but not the rest of the URL) that a user is communicating with,

때로는 사용자가 통신하는 도메인 이름까지(예: www.example.org, 그러나 URL의 나머지는 아님).

- **domain name**: 도메인. SNI(Server Name Indication) 때문에 TLS handshake 시작 시 평문으로 노출.
- **but not the rest of the URL**: URL의 나머지(경로, 쿼리)는 보호. `/secret-path?key=value`는 암호화.

> along with the amount of data transferred and the duration of the communication, though not the content of the communication.

전송된 데이터 양과 통신 지속 시간도 함께 추론할 수 있지만, 통신 내용은 추론 불가다.

- **amount of data transferred**: 전송 데이터 양. 패킷 크기 합계로 추정 가능.
- **duration of the communication**: 통신 시간. 첫 패킷~마지막 패킷.
- **though not the content**: 단, 내용은 아님. 무엇이 오갔는지는 보호.

---

**종합**

HTTPS의 보호 범위를 정리하면:

| 항목 | 암호화 여부 | 설명 |
|---|---|---|
| URL 경로 (`/api/users/123`) | ○ 암호화 | 도청자에게 안 보임 |
| 쿼리 파라미터 (`?token=abc`) | ○ 암호화 | API 토큰도 안전 |
| HTTP 헤더 (`Authorization`, `Cookie`) | ○ 암호화 | 세션 정보 보호 |
| HTTP 본문 (POST body, 응답 데이터) | ○ 암호화 | 가장 민감한 데이터 |
| 도메인명 (예: `www.example.com`) | × 평문 | SNI에서 노출 |
| 서버 IP 주소 | × 평문 | TCP/IP 헤더 |
| 포트 번호 (443) | × 평문 | TCP/IP 헤더 |
| 전송 데이터 양 | △ 추론 가능 | 패킷 크기로 |
| 통신 시간 | △ 추론 가능 | 패킷 타이밍으로 |

비유: 봉인된 편지에 비유하면 명확합니다.

- **편지 내용 (HTTPS 페이로드)** = 봉인되어 누구도 못 봄
- **봉투의 주소 (IP, 도메인)** = 평문으로 보임. 우체국이 배달하려면 보여야 하니까.
- **편지 무게 (데이터 양)** = 봉투 들어보면 짐작 가능
- **편지를 자주 보내는지 (통신 시간)** = 우편함을 관찰하면 알 수 있음

JS 개발자에게 와닿는 사례:

```js
// 전부 암호화됨 — 안전
await fetch('https://api.bank.com/transfer', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer secret-token' },
  body: JSON.stringify({ to: 'someone', amount: 1000000 })
});
// 도청자가 알 수 있는 것: api.bank.com 도메인, IP, 포트 443, 전송 시간, 데이터 양
// 도청자가 알 수 없는 것: /transfer 경로, 토큰, body의 내용
```

이게 없으면 어떻게 되는가:

- 도메인이 평문이라 노출되는 게 문제라면 — Encrypted Client Hello (ECH, 2024년 Chrome 도입)가 SNI를 암호화해 도메인까지 보호하는 진화 방향. 아직 100% 표준은 아님.
- IP/포트까지 숨기려면 VPN, Tor 같은 추가 계층이 필요. HTTPS만으로는 라우팅 메타데이터 보호 불가능.

**메타데이터 분석의 위험**

내용을 못 봐도 메타데이터(누가 누구와, 언제, 얼마나 자주 통신하는지)만으로 많은 것을 추론할 수 있습니다:

- "이 사용자가 정신과 사이트에 자주 접속" → 건강 정보 추론
- "특정 시점에 정치 사이트 트래픽 급증" → 활동 패턴 추론
- "특정 응답 크기 패턴" → 어떤 페이지를 봤는지 추론(traffic analysis)

오개념 예방: "HTTPS면 모든 게 숨겨진다"는 잘못된 직관. ISP, 정부 검열 시스템, 광고주는 HTTPS 트래픽에서도 도메인 정보를 통해 사용자 활동을 추적할 수 있습니다. 완전한 익명성을 원하면 Tor 같은 추가 레이어 필요.

또 다른 오해: "URL 경로(예: `/login`)는 안전한데 도메인은 노출된다 — 그럼 도메인을 가짜로 쓰면?" — 안 됩니다. 도메인은 DNS 시스템과 연결되어 있어 무작위 도메인을 쓰면 라우팅 자체가 안 됩니다.

AI Annotation 보충: 암호화되는 것 — URL 경로, 쿼리 파라미터, 헤더, 쿠키 — HTTP 프로토콜 전체. 보호하지 못하는 것 — IP 주소, 포트 번호, 도메인명(SNI에서 평문 전송), 전송량, 통신 시간. 비유 — 편지 내용은 봉인되지만 봉투의 주소는 보입니다.
