# HTTPS(Hypertext Transfer Protocol Secure)란 무엇인가?

## 도입

HTTPS는 HTTP에 암호화를 더한 것이다. 브라우저 주소창에 자물쇠 아이콘이 보이는 사이트가 HTTPS를 쓰는 것이다. "HTTP over TLS"라고도 부르며, HTTP 메시지를 TLS가 암호화하여 전송한다.

---

## 본문

> Hypertext Transfer Protocol Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP). It uses encryption for secure communication over a computer network, and is widely used on the Internet.

"HTTPS는 HTTP의 확장이다. 컴퓨터 네트워크를 통한 안전한 통신을 위해 암호화를 사용하며, 인터넷에서 널리 사용된다."

- **extension**: HTTP를 대체하는 게 아니라 위에 얹는 것이다. HTTP 메시지 구조, 메서드, 상태 코드는 그대로다.
- **encryption**: 데이터를 제3자가 읽을 수 없게 변환하는 것. 네트워크 상의 패킷을 누가 가로채도 내용을 알 수 없다.

> In HTTPS, the communication protocol is encrypted using Transport Layer Security (TLS) or, formerly, Secure Sockets Layer (SSL). The protocol is therefore also referred to as HTTP over TLS, or HTTP over SSL.

"HTTPS에서 통신 프로토콜은 TLS(Transport Layer Security) 또는 이전에는 SSL(Secure Sockets Layer)을 사용하여 암호화된다. 따라서 프로토콜은 HTTP over TLS, 또는 HTTP over SSL이라고도 부른다."

- **TLS**: 현재 사용하는 암호화 프로토콜. SSL의 후계자다.
- **SSL**: Netscape가 1990년대에 만든 오래된 암호화 프로토콜. 현재는 TLS로 대체됐지만 이름은 여전히 혼용된다("SSL 인증서"라고 부르지만 실제로는 TLS 인증서).

> HTTPS URLs begin with "https://" and use port 443 by default, whereas HTTP URLs begin with "http://" and use port 80 by default.

"HTTPS URL은 'https://'로 시작하고 기본 포트 443을 사용하며, HTTP URL은 'http://'로 시작하고 기본 포트 80을 사용한다."

- **port 443**: HTTPS의 표준 포트. URL에 포트를 쓰지 않으면 브라우저가 자동으로 443을 사용한다.

> Transport Layer Security (TLS), formerly known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.

"TLS(이전에 SSL로 알려진)는 애플리케이션이 네트워크를 통해 안전하게 통신하는 데 사용하는 프로토콜로, 이메일, 웹 브라우징, 메시징 및 기타 프로토콜의 변조와 도청을 방지한다."

- **tampering**: 데이터 변조. 중간에서 내용을 바꾸는 것.
- **eavesdropping**: 도청. 데이터를 몰래 읽는 것.

---

## 종합

HTTPS = HTTP + TLS다. TLS가 HTTP 메시지를 감싸서 암호화하고, 목적지에서 복호화한다. `fetch('https://api.example.com')`을 호출하면 브라우저가 먼저 TLS 핸드셰이크로 암호화 채널을 열고, 그 위에 HTTP 요청을 보낸다. 개발자가 `https://`를 쓰는 것만으로 이 과정이 자동으로 이루어진다.

---

# TCP/IP 모델에서 TLS는 어느 계층에서 동작하며, HTTP 메시지를 어떻게 처리하는가?

## 도입

HTTP는 응용 계층(Application Layer) 프로토콜이다. TLS도 응용 계층에서 동작하는데, HTTP보다 한 단계 아래 sublayer로 위치한다. TLS가 HTTP를 감싸는 구조다.

---

## 본문

> HTTP operates at the highest layer of the TCP/IP model—the application layer; as does the TLS security protocol (operating as a lower sublayer of the same layer), which encrypts an HTTP message prior to transmission and decrypts a message upon arrival.

"HTTP는 TCP/IP 모델의 최상위 계층인 응용 계층에서 동작한다. TLS 보안 프로토콜도 마찬가지이며 (같은 계층의 하위 서브레이어로 동작), 전송 전에 HTTP 메시지를 암호화하고 수신 시 메시지를 복호화한다."

- **lower sublayer of the same layer**: TCP/IP 모델에는 "보안 계층"이 따로 없다. TLS는 응용 계층 안에서 HTTP와 TCP 사이에 끼어드는 방식이다.
- **encrypts an HTTP message prior to transmission**: HTTP 메시지를 완성한 뒤 TLS가 암호화하여 TCP에 넘긴다.
- **decrypts a message upon arrival**: TCP에서 받은 데이터를 TLS가 복호화하여 HTTP에 넘긴다.

> Strictly speaking, HTTPS is not a separate protocol, but refers to the use of ordinary HTTP over an encrypted SSL/TLS connection.

"엄밀히 말해 HTTPS는 별도의 프로토콜이 아니라, 암호화된 SSL/TLS 연결 위에서 일반 HTTP를 사용하는 것을 말한다."

> HTTPS encrypts all message contents, including the HTTP headers and the request/response data.

"HTTPS는 HTTP 헤더와 요청/응답 데이터를 포함한 모든 메시지 내용을 암호화한다."

```
계층 구조:
┌─────────────────────────────┐
│  HTTP                       │ ← 메시지 생성 (GET, POST, 헤더, 바디)
├─────────────────────────────┤
│  TLS                        │ ← HTTP 메시지 암호화 (sublayer)
├─────────────────────────────┤
│  TCP                        │ ← 신뢰성 있는 전송
├─────────────────────────────┤
│  IP                         │ ← 라우팅
└─────────────────────────────┘

전송 시: HTTP 메시지 → TLS 암호화 → TCP 전송
수신 시: TCP 수신 → TLS 복호화 → HTTP 메시지
```

---

## 종합

TLS는 HTTP 메시지 전체(헤더 포함)를 암호화한다. 따라서 `Authorization` 토큰, 쿠키, URL 경로, 요청 바디가 모두 암호화된다. HTTP와 TCP 사이에 끼어드는 구조이므로 HTTP는 TLS가 있는지 없는지 신경 쓰지 않는다. `fetch('https://')`가 `fetch('http://')`와 코드 레벨에서 같은 방식으로 작동하는 이유다.

---

# HTTPS가 해결하는 보안 문제는 무엇이며, 어떤 메커니즘으로 보호하는가?

## 도입

HTTPS는 세 가지 보안 문제를 동시에 해결한다. "이 사이트가 진짜인가(인증)", "데이터가 엿보이지 않는가(기밀성)", "데이터가 변조되지 않았는가(무결성)"다.

---

## 본문

> The principal motivations for HTTPS are authentication of the accessed website and protection of the privacy and integrity of the exchanged data while it is in transit.

"HTTPS의 주요 동기는 접속한 웹사이트의 인증과, 전송 중 교환되는 데이터의 프라이버시와 무결성 보호다."

- **authentication**: 접속한 사이트가 `bank.com`이라고 주장하면, 진짜 `bank.com`인지 확인하는 것.
- **privacy**: 데이터를 제3자가 읽을 수 없게.
- **integrity**: 전송 도중 데이터가 변조되지 않았음을 보장.

> It protects against man-in-the-middle attacks, and the bidirectional block cipher encryption of communications between a client and server protects the communications against eavesdropping and tampering.

"중간자 공격에 대해 보호하며, 클라이언트와 서버 사이의 양방향 블록 암호 암호화가 통신을 도청과 변조에 대해 보호한다."

- **man-in-the-middle (MITM) attacks**: 공격자가 클라이언트와 서버 사이에 끼어들어 통신을 가로채거나 변조하는 공격. 공용 와이파이에서 흔하다.
- **bidirectional block cipher encryption**: 클라이언트 → 서버, 서버 → 클라이언트 양방향 모두 암호화한다.

> All major browsers began removing support for TLS 1.0 and 1.1 in early 2020; you'll need to make sure your web server supports TLS 1.2 or 1.3 going forward.

"모든 주요 브라우저는 2020년 초에 TLS 1.0과 1.1 지원을 제거하기 시작했다. 앞으로 웹서버가 TLS 1.2 또는 1.3을 지원하는지 확인해야 한다."

**HTTPS의 3대 보안 목표:**

```
인증 (Authentication)
  └── CA가 서명한 인증서로 서버 신원 확인
  └── "이 사이트가 진짜 bank.com임"

기밀성 (Privacy/Confidentiality)
  └── 대칭 세션 키로 데이터 암호화
  └── "제3자가 읽을 수 없음"

무결성 (Integrity)
  └── MAC(Message Authentication Code)으로 변조 감지
  └── "전송 도중 수정되지 않았음"
```

---

## 종합

HTTPS가 없으면 공용 와이파이에서 로그인 정보가 평문으로 날아가고, 공격자가 중간에서 페이지 내용을 바꿔치기(광고 삽입, 악성코드 주입)할 수 있다. 오늘날 Chrome은 HTTP 사이트에 "Not Secure" 경고를 표시하고, 일부 API(`getUserMedia`, Service Worker 등)는 HTTPS에서만 동작한다. 보안뿐 아니라 기능 접근성을 위해서도 HTTPS는 필수다.

---

# HTTPS 인증에 신뢰할 수 있는 제3자(trusted third party)가 필요한 이유와, 이것이 HTTPS 초기 보급을 제한한 원인은?

## 도입

HTTPS의 인증(authentication)이 작동하려면 "이 서버가 진짜 example.com이다"를 누군가가 보증해주어야 한다. 이 역할을 CA(Certificate Authority, 인증 기관)가 한다. CA가 서명한 인증서가 없으면 브라우저가 신뢰하지 않는다.

---

## 본문

> The authentication aspect of HTTPS requires a trusted third party to sign server-side digital certificates.

"HTTPS의 인증 측면은 서버 측 디지털 인증서에 서명하는 신뢰할 수 있는 제3자를 요구한다."

- **trusted third party**: CA. 브라우저가 미리 신뢰하도록 내장하는 기관이다. DigiCert, Comodo, Let's Encrypt 등이 있다.
- **sign**: CA가 자신의 비밀키로 서버 인증서에 서명. 브라우저는 CA의 공개키로 이 서명을 검증한다.

> This was historically an expensive operation, which meant fully authenticated HTTPS connections were usually found only on secured payment transaction services and other secured corporate information systems on the World Wide Web.

"이것은 역사적으로 비용이 많이 드는 작업이었으며, 이는 완전히 인증된 HTTPS 연결이 보통 결제 거래 서비스와 기타 기업 정보 시스템에서만 발견됐다는 것을 의미했다."

- **expensive operation**: 인증서 발급 비용이 연 수십~수백 달러였다. 작은 사이트나 개인 블로그는 감당하기 어려웠다.

> Let's Encrypt, launched in April 2016, provides free and automated service that delivers basic SSL/TLS certificates to websites.

"2016년 4월 출시된 Let's Encrypt는 웹사이트에 기본 SSL/TLS 인증서를 무료로 자동화하여 제공한다."

- **Let's Encrypt**: EFF(Electronic Frontier Foundation) 주도로 만들어진 무료 CA. 3개월마다 자동 갱신된다. 현재 대부분의 호스팅 서비스와 클라우드 제공업체가 Let's Encrypt를 통해 무료 인증서를 제공한다.

```
HTTPS 신뢰 체인:
브라우저에 내장된 Root CA 목록
         ↓ 신뢰
CA (Let's Encrypt, DigiCert 등)
         ↓ 서명
서버 인증서 (example.com의 공개키 포함)
         ↓ 확인
브라우저가 "이 서버는 진짜 example.com"으로 신뢰
```

---

## 종합

Let's Encrypt(2016) + Chrome의 "Not Secure" 경고 정책(2018)이 맞물려 HTTPS가 웹의 기본이 됐다. Vercel, Netlify, AWS 등 현대 호스팅 플랫폼은 도메인을 연결하면 자동으로 Let's Encrypt 인증서를 발급하고 갱신한다. 개발자 입장에서 인증서 발급과 갱신은 대부분 자동화되어 있어 직접 신경 쓸 일이 줄었다.

---

# HTTPS는 HTTP의 어떤 부분을 암호화하고, 어떤 정보는 보호하지 못하는가?

## 도입

HTTPS가 모든 것을 암호화한다고 생각하기 쉽지만, 암호화되는 것과 보호되지 않는 것이 있다. URL 경로, 헤더, 쿠키는 암호화되지만, IP 주소와 도메인명 일부는 여전히 노출된다.

---

## 본문

> Because HTTPS piggybacks HTTP entirely on top of TLS, the entirety of the underlying HTTP protocol can be encrypted. This includes the request's URL, query parameters, headers, and cookies.

"HTTPS는 TLS 위에 HTTP 전체를 얹기 때문에, 기저 HTTP 프로토콜 전체가 암호화될 수 있다. 여기에는 요청의 URL, 쿼리 파라미터, 헤더, 쿠키가 포함된다."

- **piggybacks**: "위에 얹는다" — HTTP가 TLS 위에 실려간다.
- URL 경로(`/api/users`), 쿼리 파라미터(`?token=secret`), `Authorization` 헤더, 쿠키 — 모두 암호화된다.

> However, because website addresses and port numbers are necessarily part of the underlying TCP/IP protocols, HTTPS cannot protect their disclosure.

"그러나 웹사이트 주소와 포트 번호는 반드시 기저 TCP/IP 프로토콜의 일부여야 하므로, HTTPS는 그것들의 노출을 보호할 수 없다."

- TCP/IP가 데이터를 라우팅하려면 목적지 IP와 포트를 평문으로 봐야 한다. 이것은 암호화할 수 없다.

> In practice this means that even on a correctly configured web server, eavesdroppers can infer the IP address and port number of the web server, and sometimes even the domain name (e.g. www.example.org, but not the rest of the URL).

"실제로 이는 올바르게 구성된 웹서버에서도 도청자가 IP 주소, 포트 번호, 때로는 도메인명(예: www.example.org, URL의 나머지 부분은 아님)을 추론할 수 있다는 것을 의미한다."

- **domain name inferred**: SNI(Server Name Indication)로 도메인명이 TLS 핸드셰이크 시 평문으로 전송된다. 경로나 쿼리 파라미터는 암호화되지만 도메인명은 노출된다.

```
HTTPS로 암호화되는 것:
✅ URL 경로 (/api/users/123)
✅ 쿼리 파라미터 (?token=secret)
✅ 헤더 (Authorization, Cookie 등)
✅ 요청/응답 바디

HTTPS로 보호되지 않는 것:
❌ 목적지 IP 주소 (TCP 라우팅 필요)
❌ 포트 번호 (TCP 라우팅 필요)
❌ 도메인명 (SNI로 평문 전송)
❌ 전송 데이터량, 통신 시간
```

비유: 봉투 안의 편지 내용은 봉인되지만, 봉투 겉의 수신 주소는 보인다.

---

## 종합

HTTPS 사이트를 방문해도 사용자가 어떤 도메인(example.com)에 접속했는지는 네트워크 감시로 알 수 있다. 하지만 어떤 페이지(`/user/profile`)를 방문했는지, 어떤 내용을 주고받았는지는 알 수 없다. 민감한 정보를 URL 경로에 두는 것은 HTTPS에서 안전하지만, URL 쿼리 파라미터에 시크릿을 담으면 브라우저 히스토리와 서버 로그에 남으므로 주의가 필요하다.

---

# 웹에서 TLS 인증은 보통 어느 한쪽만 수행되는데, 어느 쪽이 인증되며 그 이유는?

## 도입

TLS는 양쪽 모두를 인증할 수 있지만, 일반적인 웹에서는 서버만 인증된다. 이유는 단순하다 — 수백만 명의 브라우저 사용자 각자에게 인증서를 발급하는 것은 비실용적이기 때문이다.

---

## 본문

> SSL/TLS is especially suited for HTTP, since it can provide some protection even if only one side of the communication is authenticated. This is the case with HTTP transactions over the Internet, where typically only the server is authenticated (by the client examining the server's certificate).

"SSL/TLS는 통신의 한쪽만 인증되더라도 어느 정도 보호를 제공할 수 있으므로 HTTP에 특히 적합하다. 이는 인터넷을 통한 HTTP 거래의 경우로, 일반적으로 서버만 인증된다 (클라이언트가 서버 인증서를 검사함으로써)."

- **the server is authenticated**: 브라우저가 서버의 인증서를 검사하여 "이 서버가 진짜 example.com이다"를 확인한다. 사용자의 신원은 TLS 레벨에서 확인하지 않는다.
- **examining the server's certificate**: CA의 서명이 유효한지, 도메인이 일치하는지, 만료되지 않았는지를 브라우저가 자동으로 확인한다.

> The system can also be used for client authentication in order to limit access to a web server to authorized users.

"이 시스템은 또한 권한 있는 사용자에게만 웹서버 접근을 제한하기 위한 클라이언트 인증에도 사용할 수 있다."

> To do this, the site administrator typically creates a certificate for each user, which the user loads into their browser.

"이를 위해 사이트 관리자는 보통 각 사용자를 위한 인증서를 만들며, 사용자는 이를 브라우저에 로드한다."

이것이 mutual TLS(mTLS)다. 마이크로서비스 간 통신, 기업 VPN, 고보안 API에서 사용된다.

```
일반 웹 HTTPS (단방향 인증):
서버 인증서 ──► 브라우저 검증 ──► 서버 신원 확인됨
클라이언트?  ──► 애플리케이션 레벨(로그인)에서 처리

mTLS (양방향 인증):
서버 인증서 ──► 클라이언트 검증 ──► 서버 신원 확인됨
클라이언트 인증서 ──► 서버 검증 ──► 클라이언트 신원 확인됨
```

---

## 종합

웹의 기본 모델은 서버 단방향 인증이다. 서버가 "나는 진짜 bank.com이야"를 인증서로 증명하고, 사용자가 그것을 믿는다. 클라이언트 인증은 로그인 폼, 쿠키, JWT 같은 애플리케이션 레벨에서 처리한다. mTLS는 사람이 아닌 서비스 간 통신(Kubernetes 내부 통신, API Gateway → 마이크로서비스)에서 양쪽 모두 검증이 필요할 때 사용한다.

---

# 사용자가 HTTPS 연결을 신뢰할 수 있으려면 어떤 전제조건이 충족되어야 하는가?

## 도입

자물쇠 아이콘이 보인다고 무조건 안전한 것은 아니다. HTTPS 신뢰는 여러 조건이 동시에 충족되어야 한다. 한 조건이라도 깨지면 HTTPS의 보안이 무너진다.

---

## 본문

> Web browsers know how to trust HTTPS websites based on certificate authorities that come pre-installed in their software.

"웹 브라우저는 소프트웨어에 사전 설치된 CA를 기반으로 HTTPS 웹사이트를 신뢰하는 방법을 알고 있다."

브라우저에는 수백 개의 루트 CA 인증서가 내장되어 있다. 이 목록이 신뢰의 출발점이다.

OA에서 신뢰의 조건으로 다음 6가지를 나열한다:

1. **기기 무결성**: 브라우저를 포함하는 기기 자체와 브라우저를 설치하는 방법이 손상되지 않았다(공급망 공격 없음).

2. **브라우저 구현 신뢰**: 브라우저 소프트웨어가 HTTPS를 올바르게 구현하고 CA를 올바르게 사전 설치했다.

3. **CA 신뢰**: CA가 합법적인 웹사이트에 대해서만 인증서를 발급한다(CA가 해킹당하거나 가짜 인증서를 발급하지 않음).

4. **유효한 인증서**: 웹사이트가 신뢰하는 기관에 의해 서명된 유효한 인증서를 제공한다.

5. **도메인 일치**: 인증서가 방문하는 웹사이트를 올바르게 식별한다(`example.com`을 방문하면 `example.com`에 대한 인증서가 옴).

6. **TLS 강도**: 프로토콜의 암호화 레이어가 도청자에 대해 충분히 안전하다(TLS 1.2+, 강력한 cipher suite).

```
신뢰 체인 (모두 충족되어야 함):
기기 무결성 ✓
브라우저 구현 ✓
CA 신뢰 ✓
인증서 유효성 ✓
도메인 일치 ✓
TLS 강도 ✓
────────────────
HTTPS 연결 신뢰 가능
```

---

## 종합

2011년 DigiNotar CA가 해킹당해 가짜 `google.com` 인증서가 발급된 사건은 조건 3(CA 신뢰)이 깨진 실제 사례다. 이 사건 후 DigiNotar는 브라우저 신뢰 목록에서 제거되었고 파산했다. 자물쇠 아이콘은 "TLS 연결이 되어 있다"는 의미이지, "이 사이트가 안전하다"는 의미가 아니다. 피싱 사이트도 유효한 TLS 인증서를 가질 수 있다. 도메인 이름을 직접 확인하는 것이 중요한 이유다.

---

# HTTPS가 공용 와이파이 같은 안전하지 않은 네트워크에서 특히 중요한 이유는?

## 도입

공용 와이파이에서 HTTP 사이트에 접속하면 같은 네트워크의 누구든 패킷을 캡처하여 내용을 볼 수 있다. HTTPS는 이 위험을 차단한다.

---

## 본문

> HTTPS is especially important over insecure networks and networks that may be subject to tampering. Insecure networks, such as public Wi-Fi access points, allow anyone on the same local network to packet-sniff and discover sensitive information not protected by HTTPS.

"HTTPS는 안전하지 않은 네트워크와 변조에 취약한 네트워크에서 특히 중요하다. 공용 와이파이 액세스 포인트 같은 안전하지 않은 네트워크는 같은 로컬 네트워크의 누구든 패킷을 스니핑하고 HTTPS로 보호되지 않은 민감한 정보를 발견할 수 있게 한다."

- **packet-sniff**: 네트워크를 지나가는 패킷을 캡처하여 내용을 읽는 것. Wireshark 같은 도구로 가능하다. HTTP 패킷은 평문이므로 그대로 읽힌다.

> Additionally, some free-to-use and paid WLAN networks have been observed tampering with webpages by engaging in packet injection in order to serve their own ads on other websites.

"또한, 일부 무료 및 유료 WLAN 네트워크가 다른 웹사이트에 자신의 광고를 제공하기 위해 패킷 인젝션을 통해 웹페이지를 변조하는 것이 관찰됐다."

- **packet injection**: 클라이언트와 서버 사이에 추가 데이터를 삽입하는 것. HTTP 응답에 광고 JavaScript를 주입할 수 있다.

> This practice can be exploited maliciously in many ways, such as by injecting malware onto webpages and stealing users' private information.

"이 관행은 웹페이지에 멀웨어를 주입하거나 사용자의 개인 정보를 훔치는 등 여러 악의적인 방법으로 악용될 수 있다."

```
HTTP 공용 와이파이:
사용자 ──HTTP──► [와이파이 AP] ──► 서버
         패킷 스니핑 가능, 변조 가능
         비밀번호, 쿠키 노출

HTTPS 공용 와이파이:
사용자 ──암호화된 HTTPS──► [와이파이 AP] ──► 서버
         내용 읽기 불가, 변조 감지됨
         비밀번호, 쿠키 보호
```

---

## 종합

카페 와이파이에서 HTTP 쇼핑몰에 로그인하면 같은 공간에 있는 누군가가 쿠키를 탈취할 수 있다. HTTPS는 이 경우 암호화로 내용을 보호하고, 무결성 검사로 변조를 차단한다. 이것이 브라우저가 HTTP 사이트에 "안전하지 않음" 경고를 표시하기 시작한 핵심 이유다. 특히 비밀번호, 결제 정보를 다루는 사이트에서 HTTPS는 선택이 아니라 필수다.

---

# HTTPS가 보안 외에 성능에도 영향을 미치는 이유는?

## 도입

"HTTPS가 HTTP보다 느리다"는 말을 들어본 적 있을 것이다. TLS 핸드셰이크 오버헤드가 있기 때문이다. 그런데 역설적으로, HTTPS를 써야 HTTP/2를 쓸 수 있고, HTTP/2가 HTTP/1.1보다 훨씬 빠르다.

---

## 본문

> Deploying HTTPS also allows the use of HTTP/2 and HTTP/3 (and their predecessors SPDY and QUIC), which are new HTTP versions designed to reduce page load times, size, and latency.

"HTTPS를 배포하면 또한 HTTP/2와 HTTP/3 사용이 가능해지며, 이것들은 페이지 로드 시간, 크기, 지연을 줄이기 위해 설계된 새 HTTP 버전이다."

- **allows the use of HTTP/2 and HTTP/3**: 주요 브라우저들이 HTTP/2와 HTTP/3를 HTTPS 연결에서만 지원하도록 구현했다. HTTP를 쓰는 서버는 HTTP/1.1에 갇힌다.

```
HTTP (암호화 없음):
  → 최대 HTTP/1.1 (브라우저 정책)
  → 직렬 요청 처리, 연결 여러 개

HTTPS (TLS 암호화):
  → HTTP/2, HTTP/3 지원
  → 멀티플렉싱, 헤더 압축, 서버 푸시
  → 실제로 HTTP/1.1보다 빠를 수 있음

TLS 오버헤드 < HTTP/2 성능 향상
→ 결국 HTTPS + HTTP/2가 HTTP만보다 빠름
```

- **SPDY**: Google이 HTTP/2 이전에 실험적으로 개발한 프로토콜. HTTP/2의 전신이다.

---

## 종합

HTTPS가 TLS 핸드셰이크 오버헤드를 추가하는 것은 사실이다. 하지만 HTTPS 덕에 HTTP/2를 쓸 수 있고, HTTP/2의 멀티플렉싱과 헤더 압축이 TLS 오버헤드를 상쇄하고도 남는다. 결론적으로 HTTPS + HTTP/2가 순수 HTTP + HTTP/1.1보다 대부분의 경우 더 빠르다. 성능과 보안을 맞바꾸는 것이 아니라, HTTPS가 보안과 성능을 동시에 가져다준다.

---

# HSTS(HTTP Strict Transport Security)란 무엇이며, 어떤 공격을 방어하는가?

## 도입

HTTPS 사이트에 처음 접속할 때 URL에 `http://`를 입력하면 잠깐이나마 HTTP로 연결될 수 있다. 이 순간을 공격자가 노린다. HSTS는 브라우저에게 "항상 HTTPS만 써라"고 명령하여 이 취약점을 제거한다.

---

## 본문

> It is recommended to use HTTP Strict Transport Security (HSTS) with HTTPS to protect users from man-in-the-middle attacks, especially SSL stripping.

"중간자 공격, 특히 SSL 스트리핑으로부터 사용자를 보호하기 위해 HTTPS와 함께 HSTS를 사용하는 것이 권장된다."

- **HSTS**: 서버가 `Strict-Transport-Security` 응답 헤더로 브라우저에 "이 사이트는 항상 HTTPS로만 접속하라"고 알리는 메커니즘.

> This type of attack defeats the security provided by HTTPS by changing the https: link into an http: link.

"이 유형의 공격은 https: 링크를 http: 링크로 변경하여 HTTPS가 제공하는 보안을 무력화한다."

- **SSL stripping**: 공격자가 클라이언트와 서버 사이에 끼어들어 HTTPS 요청을 HTTP로 다운그레이드하는 공격. 클라이언트는 HTTP로 통신하고 있는 줄 모른다.

> Taking advantage of the fact that few Internet users actually type "https" into their browser interface: they get to a secure site by clicking on a link, and thus are fooled into thinking that they are using HTTPS when in fact they are using HTTP.

"인터넷 사용자가 실제로 브라우저에 'https'를 입력하는 경우가 드물다는 사실을 이용한다: 그들은 링크를 클릭하여 보안 사이트에 접근하므로, 실제로 HTTP를 사용하는 것인데 HTTPS를 사용하고 있다고 착각한다."

**HSTS 동작:**

```
HSTS 없는 경우:
1. 사용자: http://bank.com 입력
2. 공격자: 중간에서 HTTPS → HTTP 변환
3. 사용자: HTTP로 통신 (평문 노출)

HSTS 있는 경우:
1. 최초 방문: 서버 응답 헤더
   Strict-Transport-Security: max-age=31536000
2. 브라우저: "bank.com은 1년간 HTTPS만"으로 저장
3. 이후 http://bank.com 입력 시 브라우저가 직접 https://bank.com으로 변환
   → 공격자가 끼어들 기회 없음
```

- **max-age**: HSTS 정책의 유효 기간(초). `31536000`은 1년.
- **HSTS Preload**: 브라우저 소스코드에 아예 사전 등록하면 최초 방문도 HTTPS로만.

---

## 종합

HSTS는 HTTPS의 "첫 방문 취약점"을 해결한다. 최초 HTTPS 방문 이후 브라우저가 HSTS 정책을 기억하고 이후 모든 접속에서 HTTPS를 강제한다. Express에서 `helmet.hsts()`, Next.js에서 응답 헤더 설정으로 HSTS를 활성화할 수 있다. 프론트엔드 개발자라면 배포 서버 설정에 HSTS를 포함하는 것이 보안의 기본이다.

---

# TLS가 데이터를 암호화하는 과정에서 장기 키와 세션 키의 역할은?

## 도입

TLS는 두 종류의 키를 조합하여 암호화한다. 비대칭 키(공개/비밀 키)는 느리지만 안전한 키 교환에 쓰이고, 대칭 세션 키는 빠른 데이터 암호화에 쓰인다. 둘을 조합하는 하이브리드 방식이다.

---

## 본문

> The security of HTTPS is that of the underlying TLS, which typically uses long-term public and private keys to generate a short-term session key, which is then used to encrypt the data flow between the client and the server.

"HTTPS의 보안은 기저 TLS의 보안이며, 이는 일반적으로 장기 공개 및 비밀 키를 사용하여 단기 세션 키를 생성하고, 이 세션 키가 클라이언트와 서버 사이의 데이터 흐름을 암호화하는 데 사용된다."

- **long-term public and private keys**: 서버 인증서에 포함된 비대칭 키 쌍. 공개키는 인증서에 공개되어 있고, 비밀키는 서버만 갖고 있다.
- **short-term session key**: 핸드셰이크에서 협상하는 대칭 키. 세션마다 다르고, 세션이 끝나면 버린다.
- **encrypt the data flow**: 실제 HTTP 메시지 암호화는 세션 키로 한다. 대칭 암호화는 비대칭보다 훨씬 빠르다.

> X.509 certificates are used to authenticate the server (and sometimes the client as well).

"X.509 인증서는 서버(때로는 클라이언트도)를 인증하는 데 사용된다."

- **X.509**: 인증서의 표준 형식. 서버의 공개키와 CA의 서명을 포함한다.

```
TLS 하이브리드 암호화:

비대칭 키 (RSA/ECDSA):
  - 공개키: 인증서에 공개
  - 비밀키: 서버만 보유
  - 용도: 세션 키 안전 교환

대칭 키 (AES):
  - 세션 키: 핸드셰이크에서 협상
  - 용도: 실제 HTTP 데이터 암호화
  - 빠름: 비대칭 대비 수백 배

흐름:
핸드셰이크: 비대칭 키로 세션 키 교환
데이터 전송: 세션 키로 암호화
세션 종료: 세션 키 폐기
```

---

## 종합

비대칭 암호화만 쓰면 안전하지만 느리고, 대칭 암호화만 쓰면 빠르지만 키 교환이 위험하다. TLS는 비대칭 암호화로 대칭 키를 안전하게 교환한 후, 실제 데이터는 대칭 키로 빠르게 암호화하는 하이브리드 방식을 쓴다. 이것이 HTTPS가 보안과 성능을 함께 달성하는 원리다.

---

# Forward secrecy란 무엇이며, 이것이 없으면 어떤 위험이 있는가?

## 도입

과거에 암호화된 트래픽을 녹화해두고, 나중에 비밀키가 유출되면 그것으로 복호화할 수 있다. Forward secrecy는 이 시나리오를 차단하는 속성이다.

---

## 본문

> An important property in this context is forward secrecy, which ensures that encrypted communications recorded in the past cannot be retrieved and decrypted should long-term secret keys or passwords be compromised in the future.

"이 맥락에서 중요한 속성은 forward secrecy로, 이는 미래에 장기 비밀키나 비밀번호가 손상되더라도 과거에 녹화된 암호화 통신을 복호화할 수 없도록 보장한다."

- **encrypted communications recorded in the past**: NSA나 공격자가 암호화된 HTTPS 트래픽을 녹화하는 것은 기술적으로 가능하다.
- **long-term secret keys compromised in the future**: 서버의 비밀키가 나중에 유출되는 시나리오.
- **cannot be retrieved and decrypted**: forward secrecy가 있으면 과거 세션 키는 재구성할 수 없으므로 복호화 불가.

> Not all web servers provide forward secrecy.

"모든 웹서버가 forward secrecy를 제공하는 것은 아니다."

> Diffie–Hellman key exchange (DHE) and Elliptic-curve Diffie–Hellman key exchange (ECDHE) are in 2013 the only schemes known to have that property.

"Diffie-Hellman 키 교환(DHE)과 타원 곡선 Diffie-Hellman 키 교환(ECDHE)은 2013년 기준 이 속성을 가진 유일한 방식으로 알려져 있다."

- **ECDHE**: 현재 TLS 1.3에서 기본으로 사용되는 키 교환 방식. 매 세션마다 임시 키 쌍을 생성하므로 세션 키가 항상 다르다.

> TLS 1.3, published in August 2018, dropped support for ciphers without forward secrecy.

"2018년 8월 발표된 TLS 1.3은 forward secrecy가 없는 cipher 지원을 제거했다."

```
Forward secrecy 없음:
서버 비밀키 K로 세션 키 교환
→ K가 나중에 유출되면
→ 과거 세션 키 재구성 가능
→ 과거 트래픽 복호화 가능

Forward secrecy 있음 (ECDHE):
매 세션마다 임시 키 쌍 생성
→ 비밀키 K가 유출되어도
→ 임시 키는 세션 후 폐기됨
→ 과거 세션 키 재구성 불가능
→ 과거 트래픽 복호화 불가
```

---

## 종합

"녹화해두고 나중에 열어본다"는 공격에 대한 방어가 forward secrecy다. TLS 1.3을 쓰면 forward secrecy가 자동으로 보장된다. 서버 설정에서 TLS 1.3을 지원하고 강력한 cipher suite(ECDHE 기반)를 우선시하는 것이 보안 모범 사례다.

---

# HTTPS 사이트에서 일부 콘텐츠만 HTTP로 로드되면 어떤 문제가 발생하며, 쿠키의 secure 속성은 왜 필요한가?

## 도입

사이트 자체가 HTTPS여도 그 안에 HTTP로 로드되는 리소스가 있으면 전체 보안이 무너진다. 이를 Mixed Content라 한다. 쿠키의 `Secure` 속성도 같은 맥락에서 중요하다.

---

## 본문

> For HTTPS to be effective, a site must be completely hosted over HTTPS.

"HTTPS가 효과적이려면, 사이트 전체가 HTTPS로 호스팅되어야 한다."

> If some of the site's contents are loaded over HTTP (scripts or images, for example), or if only a certain page that contains sensitive information, such as a log-in page, is loaded over HTTPS while the rest of the site is loaded over plain HTTP, the user will be vulnerable to attacks and surveillance.

"일부 콘텐츠가 HTTP로 로드되거나(예: 스크립트나 이미지), 또는 로그인 페이지처럼 민감한 정보를 포함하는 특정 페이지만 HTTPS로 로드되고 나머지는 HTTP로 로드된다면, 사용자는 공격과 감시에 취약해진다."

**Mixed Content의 위험:**

```
HTTPS 페이지 (안전)
├── <script src="http://cdn.example.com/app.js">  ← HTTP (위험!)
│   └── 공격자가 이 JS 파일을 변조하면
│       → HTTPS 페이지의 민감 데이터 탈취 가능
└── <img src="http://example.com/logo.png">  ← HTTP
    └── 평문 전송, 변조 가능
```

스크립트가 HTTP로 로드되면 공격자가 스크립트 내용을 바꿔치기하여 HTTPS 페이지의 DOM에 접근하거나 사용자 입력을 가로챌 수 있다.

> Additionally, cookies on a site served through HTTPS must have the secure attribute enabled.

"또한, HTTPS를 통해 제공되는 사이트의 쿠키는 secure 속성이 활성화되어야 한다."

- **secure attribute**: `Set-Cookie: session_id=abc; Secure`라고 설정하면 HTTPS 연결에서만 쿠키가 전송된다. HTTP 요청에서는 이 쿠키가 포함되지 않는다.

> On a site that has sensitive information on it, the user and the session will get exposed every time that site is accessed with HTTP instead of HTTPS.

"`Secure` 없는 쿠키는 HTTP 요청에도 전송된다. 사용자가 실수로 `http://`로 접속하거나 리다이렉트가 미처 HTTPS로 전환하기 전에 쿠키가 평문으로 전송될 수 있다."

```
Secure 속성 없는 쿠키:
HTTP 요청: Cookie: session_id=abc123  ← 평문 전송, 탈취 가능
HTTPS 요청: Cookie: session_id=abc123

Secure 속성 있는 쿠키:
HTTP 요청: (쿠키 전송 안 함)  ← 안전
HTTPS 요청: Cookie: session_id=abc123
```

---

## 종합

HTTPS는 "모 아니면 도"가 아니다. 일부 리소스가 HTTP면 전체가 HTTP만큼 위험해진다. 현대 브라우저는 HTTPS 페이지의 HTTP 스크립트/스타일시트 로드를 차단하고(Active Mixed Content 차단), HTTP 이미지에는 경고를 표시한다. `Content-Security-Policy: upgrade-insecure-requests` 헤더로 모든 HTTP 리소스를 자동으로 HTTPS로 업그레이드하거나, `block-all-mixed-content`로 완전히 차단할 수 있다.

---

# 인증서가 만료 전에 무효화(revoke)되어야 할 때, 브라우저는 인증서의 유효 상태를 어떻게 확인하는가?

## 도입

인증서의 유효 기간이 남아있어도 비밀키가 유출되면 인증서를 즉시 무효화해야 한다. 브라우저가 이 폐지 여부를 확인하는 두 가지 방법이 OCSP와 CRL이다.

---

## 본문

> A certificate may be revoked before it expires, for example because the secrecy of the private key has been compromised.

"인증서는 만료 전에 폐지될 수 있다. 예를 들어 비밀키의 기밀성이 손상됐기 때문이다."

- **revoked**: 폐지됨. 유효 기간이 남아있어도 더 이상 신뢰하지 않아야 한다는 뜻이다.

> The browser sends the certificate's serial number to the certificate authority or its delegate via OCSP (Online Certificate Status Protocol) and the authority responds, telling the browser whether the certificate is still valid or not.

"브라우저는 OCSP(Online Certificate Status Protocol)를 통해 인증서의 시리얼 번호를 CA 또는 그 위임자에게 보내고, 기관은 인증서가 여전히 유효한지 아닌지를 브라우저에 알려주며 응답한다."

- **OCSP**: 인증서 시리얼 번호를 CA에 보내 "이 인증서 아직 유효해?" 하고 실시간으로 묻는 프로토콜.
- **serial number**: 각 인증서에 고유하게 붙는 번호. CA가 이 번호로 폐지 여부를 관리한다.

> The CA may also issue a CRL to tell people that these certificates are revoked.

"CA는 또한 이 인증서들이 폐지됐다는 것을 알리기 위해 CRL(Certificate Revocation List)을 발행할 수 있다."

- **CRL**: 폐지된 인증서 목록을 파일로 배포하는 방식. 브라우저가 주기적으로 다운로드하여 대조한다. 목록이 크면 다운로드가 느리다.

```
OCSP:
브라우저 ──serial#──► CA OCSP 서버
         ◄── valid/revoked ──

장점: 실시간, 개별 조회
단점: CA 서버가 다운되면 연결 실패 또는 소프트 페일

CRL:
CA ──► 폐지 목록 파일 발행
브라우저 ──► 주기적 다운로드 ──► 로컬 대조

장점: CA 서버 의존 없음
단점: 목록이 크고 갱신이 느림 (최신 폐지 즉시 반영 안 됨)

OCSP Stapling (성능 최적화):
서버가 미리 OCSP 응답을 받아 캐시
브라우저 요청 시 서버가 OCSP 응답도 함께 전달
→ 브라우저가 CA에 별도 요청 불필요
```

---

## 종합

인증서 폐지 확인은 HTTPS 신뢰 체인의 마지막 보루다. 서버 비밀키가 유출됐을 때 인증서를 즉시 폐지하고 OCSP/CRL로 전파하면 브라우저들이 이 인증서를 신뢰하지 않게 된다. 실무에서는 Let's Encrypt 인증서가 90일마다 갱신되므로 폐지보다 갱신이 더 자주 발생한다. OCSP Stapling을 서버에서 활성화하면 인증서 폐지 확인 오버헤드를 줄일 수 있다.

---

# TLS 서버가 하나의 IP:포트 조합에 하나의 인증서만 제시할 수 있는 이유와, 이 제약을 SNI가 어떻게 해결하는가?

## 도입

HTTP에서 Host 헤더가 같은 IP의 여러 도메인을 구분했다. 그런데 HTTPS에서는 HTTP 요청보다 TLS 핸드셰이크가 먼저 일어난다. TLS 핸드셰이크 시에는 Host 헤더가 없으므로, 서버가 어떤 인증서를 제시해야 할지 알 수 없다. SNI가 이 문제를 해결한다.

---

## 본문

> Because TLS operates at a protocol level below that of HTTP and has no knowledge of the higher-level protocols, TLS servers can only strictly present one certificate for a particular address and port combination.

"TLS는 HTTP보다 낮은 프로토콜 레벨에서 동작하며 상위 레벨 프로토콜에 대한 지식이 없으므로, TLS 서버는 특정 주소:포트 조합에 대해 엄격히 하나의 인증서만 제시할 수 있다."

- **no knowledge of the higher-level protocols**: TLS 핸드셰이크 단계에서는 HTTP 헤더(`Host`)를 볼 수 없다. HTTP 레이어가 아직 열리지 않았기 때문이다.
- **one certificate for a particular address and port combination**: 1.2.3.4:443 조합에서 서버는 한 가지 인증서만 제시할 수 있었다.

> In the past, this meant that it was not feasible to use name-based virtual hosting with HTTPS.

"과거에는 이것이 HTTPS에서 이름 기반 가상 호스팅을 사용하는 것이 실현 가능하지 않다는 것을 의미했다."

HTTP의 Host 헤더처럼 같은 IP에서 여러 HTTPS 도메인을 서비스하기 어려웠다.

> A solution called Server Name Indication (SNI) exists, which sends the hostname to the server before encrypting the connection, although older browsers do not support this extension.

"Server Name Indication(SNI)이라는 해결책이 있는데, 이는 연결을 암호화하기 전에 호스트명을 서버에 보낸다."

- **sends the hostname before encrypting**: TLS ClientHello 메시지(핸드셰이크의 첫 단계)에 목적지 호스트명을 평문으로 포함한다.
- **before encrypting**: 암호화 전에 보내므로 호스트명이 평문으로 네트워크에 노출된다. 이것이 HTTPS를 쓰더라도 도메인명이 보호되지 않는 근본적 이유다.

```
SNI 없을 때 (과거):
TLS 핸드셰이크: 서버 IP만 알고 호스트명 모름
→ 서버: 어떤 인증서를 보내야 하지?
→ 하나의 IP에 하나의 인증서만 가능

SNI 있을 때:
TLS ClientHello 메시지:
  ├── 지원 TLS 버전
  ├── 지원 cipher suite
  └── SNI: example.com  ← 평문으로 호스트명 포함

서버: "example.com에 대한 요청이구나"
→ example.com 인증서를 선택하여 핸드셰이크 진행
→ 하나의 IP에 여러 도메인 서비스 가능
```

---

## 종합

SNI 덕분에 AWS, Cloudflare, Vercel 같은 클라우드 플랫폼이 같은 IP 주소에서 수천 개의 HTTPS 도메인을 서비스할 수 있다. 그러나 SNI로 인해 어떤 도메인에 접속하는지는 암호화 전에 전송되어 평문으로 노출된다. 이를 해결하기 위한 ECH(Encrypted Client Hello)가 표준화되고 있으며, TLS 1.3 기반으로 호스트명까지 암호화하는 것을 목표로 한다.

---

# [UNVERIFIED] TLS handshake의 구체적인 단계(ClientHello, ServerHello, 키 교환, Finished)는 어떻게 진행되는가?

## 도입

HTTPS 연결이 성립하기 전에 TLS 핸드셰이크가 먼저 일어난다. 이 과정에서 클라이언트와 서버는 암호화 방식을 협상하고, 서버 신원을 검증하고, 세션 키를 교환한다. TLS 1.3 기준으로 설명한다.

---

## 본문

TLS 핸드셰이크는 TCP 연결(3-way handshake) 후에 시작된다.

**1단계 — ClientHello**

클라이언트(브라우저)가 서버에 다음 정보를 보낸다:
- 지원하는 TLS 버전 목록 (1.2, 1.3)
- 지원하는 cipher suite 목록 (암호화 알고리즘 조합)
- 랜덤 값(client random)
- SNI (서버 호스트명 — 평문)

**2단계 — ServerHello**

서버가 응답한다:
- 선택한 TLS 버전
- 선택한 cipher suite
- 랜덤 값(server random)
- 서버 인증서 (X.509, 공개키 포함)

**3단계 — 인증서 검증 (클라이언트)**

브라우저가 서버 인증서를 검사한다:
- CA 서명 유효한가?
- 도메인이 일치하는가?
- 만료되지 않았는가?
- 폐지되지 않았는가(OCSP)?

**4단계 — 키 교환 (ECDHE)**

TLS 1.3에서는 ECDHE를 사용한다:
1. 클라이언트: 임시 키 쌍 생성, 공개키를 서버에 전송
2. 서버: 임시 키 쌍 생성, 공개키를 클라이언트에 전송
3. 양쪽이 상대의 공개키와 자신의 비밀키로 동일한 세션 키 계산

**5단계 — Finished**

양쪽이 "핸드셰이크 완료"를 세션 키로 암호화하여 교환. 이후부터 모든 HTTP 메시지는 세션 키로 암호화되어 전송된다.

```
클라이언트                          서버
TCP 연결 완료 ──────────────────────────────
ClientHello ──────────────────────►
  - 지원 버전, cipher suite
  - client random
  - SNI: example.com
                   ◄────────────── ServerHello
                                     - 선택된 버전, cipher
                                     - server random
                                     - 서버 인증서
                   ◄────────────── Certificate
                   ◄────────────── ServerHelloDone
인증서 검증 (CA 서명, 도메인, 만료)
ECDHE: 임시 공개키 ────────────────►
                   ◄────────────── ECDHE: 임시 공개키
세션 키 계산 ◄──────────────────────────► 세션 키 계산
Finished (암호화) ─────────────────►
                   ◄────────────── Finished (암호화)
─────────────── TLS 핸드셰이크 완료 ─────────────
HTTP 요청 (암호화) ────────────────►
                   ◄────────────── HTTP 응답 (암호화)
```

---

## 종합

TLS 1.3에서 핸드셰이크는 1-RTT(왕복 1회)로 완료된다. TLS 1.2는 2-RTT가 필요했다. DevTools의 Timing 탭에서 "SSL" 또는 "TLS" 항목이 TLS 핸드셰이크 소요 시간이다. 첫 번째 HTTPS 요청에는 이 시간이 포함되지만, 이후 요청은 세션 재개(session resumption)로 0-RTT 또는 1-RTT로 단축할 수 있다. ECDHE를 쓰므로 매 세션마다 다른 세션 키가 생성되어 forward secrecy가 자동으로 보장된다.
