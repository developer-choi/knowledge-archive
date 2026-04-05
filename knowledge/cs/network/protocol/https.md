---
tags: [network, protocol, concept]
---

# Questions
- [HTTPS(Hypertext Transfer Protocol Secure)란 무엇인가?](#httpshypertext-transfer-protocol-secure란-무엇인가)
- [TCP/IP 모델에서 TLS는 어느 계층에서 동작하며, HTTP 메시지를 어떻게 처리하는가?](#tcpip-모델에서-tls는-어느-계층에서-동작하며-http-메시지를-어떻게-처리하는가)
- [HTTPS가 해결하는 보안 문제는 무엇이며, 어떤 메커니즘으로 보호하는가?](#https가-해결하는-보안-문제는-무엇이며-어떤-메커니즘으로-보호하는가)
  - [HTTPS 인증에 신뢰할 수 있는 제3자(trusted third party)가 필요한 이유와, 이것이 HTTPS 초기 보급을 제한한 원인은?](#https-인증에-신뢰할-수-있는-제3자trusted-third-party가-필요한-이유와-이것이-https-초기-보급을-제한한-원인은)
- [HTTPS는 HTTP의 어떤 부분을 암호화하고, 어떤 정보는 보호하지 못하는가?](#https는-http의-어떤-부분을-암호화하고-어떤-정보는-보호하지-못하는가)
- [웹에서 TLS 인증은 보통 어느 한쪽만 수행되는데, 어느 쪽이 인증되며 그 이유는?](#웹에서-tls-인증은-보통-어느-한쪽만-수행되는데-어느-쪽이-인증되며-그-이유는)
- [사용자가 HTTPS 연결을 신뢰할 수 있으려면 어떤 전제조건이 충족되어야 하는가?](#사용자가-https-연결을-신뢰할-수-있으려면-어떤-전제조건이-충족되어야-하는가)
- [HTTPS가 공용 와이파이 같은 안전하지 않은 네트워크에서 특히 중요한 이유는?](#https가-공용-와이파이-같은-안전하지-않은-네트워크에서-특히-중요한-이유는)
- [HTTPS가 보안 외에 성능에도 영향을 미치는 이유는?](#https가-보안-외에-성능에도-영향을-미치는-이유는)
  - [HTTP/2가 HTTP/1.1 대비 어떤 점을 개선했는가? → `http.md`](http.md#http2가-http11-대비-개선한-점은)
- [HSTS(HTTP Strict Transport Security)란 무엇이며, 어떤 공격을 방어하는가?](#hstshttp-strict-transport-security란-무엇이며-어떤-공격을-방어하는가)
- [TLS가 데이터를 암호화하는 과정에서 장기 키와 세션 키의 역할은?](#tls가-데이터를-암호화하는-과정에서-장기-키와-세션-키의-역할은)
  - [Forward secrecy란 무엇이며, 이것이 없으면 어떤 위험이 있는가?](#forward-secrecy란-무엇이며-이것이-없으면-어떤-위험이-있는가)
- [HTTPS 사이트에서 일부 콘텐츠만 HTTP로 로드되면 어떤 문제가 발생하며, 쿠키의 secure 속성은 왜 필요한가?](#https-사이트에서-일부-콘텐츠만-http로-로드되면-어떤-문제가-발생하며-쿠키의-secure-속성은-왜-필요한가)
- [인증서가 만료 전에 무효화(revoke)되어야 할 때, 브라우저는 인증서의 유효 상태를 어떻게 확인하는가?](#인증서가-만료-전에-무효화revoke되어야-할-때-브라우저는-인증서의-유효-상태를-어떻게-확인하는가)
- [TLS 서버가 하나의 IP:포트 조합에 하나의 인증서만 제시할 수 있는 이유와, 이 제약을 SNI가 어떻게 해결하는가?](#tls-서버가-하나의-ip포트-조합에-하나의-인증서만-제시할-수-있는-이유와-이-제약을-sni가-어떻게-해결하는가)
- [[TODO] TLS handshake의 구체적인 단계(ClientHello, ServerHello, 키 교환, Finished)는 어떻게 진행되는가?](#todo-tls-handshake의-구체적인-단계clienthello-serverhello-키-교환-finished는-어떻게-진행되는가)

---

# Answers

## HTTPS(Hypertext Transfer Protocol Secure)란 무엇인가?

### Official Answer
Hypertext Transfer Protocol Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP).
It uses encryption for secure communication over a computer network, and is widely used on the Internet.
In HTTPS, the communication protocol is encrypted using Transport Layer Security (TLS) or, formerly, Secure Sockets Layer (SSL).
The protocol is therefore also referred to as HTTP over TLS, or HTTP over SSL.

> #### Official Annotation:
> HTTPS URLs begin with "https://" and use port 443 by default, whereas HTTP URLs begin with "http://" and use port 80 by default.

> #### Official Annotation:
> HTTPS (HyperText Transfer Protocol Secure) is an encrypted version of the HTTP protocol.
> It uses TLS to encrypt all communication between a client and a server.
> This secure connection allows clients to safely exchange sensitive data with a server, such as when performing banking activities or online shopping.

> #### Official Annotation:
> Transport Layer Security (TLS), formerly known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.

> #### AI Annotation:
> HTTPS는 새로운 프로토콜이 아니라 HTTP 위에 TLS 암호화 계층을 얹은 확장이다.
> SSL은 TLS의 전신으로 현재는 보안 취약점 때문에 사용이 중단되었지만, "SSL 인증서"라는 이름이 관습적으로 혼용된다.
> TLS는 웹 전용이 아니라 이메일, 메시징 등 다양한 프로토콜에서 범용적으로 사용되는 보안 프로토콜이다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS
- https://developer.mozilla.org/en-US/docs/Glossary/HTTPS
- https://developer.mozilla.org/en-US/docs/Glossary/TLS

---

## TCP/IP 모델에서 TLS는 어느 계층에서 동작하며, HTTP 메시지를 어떻게 처리하는가?

### Official Answer
HTTP operates at the highest layer of the TCP/IP model—the application layer; as does the TLS security protocol (operating as a lower sublayer of the same layer), which encrypts an HTTP message prior to transmission and decrypts a message upon arrival.
Strictly speaking, HTTPS is not a separate protocol, but refers to the use of ordinary HTTP over an encrypted SSL/TLS connection.
HTTPS encrypts all message contents, including the HTTP headers and the request/response data.

> #### AI Annotation:
> TCP/IP 모델에는 별도의 보안 계층이 없으므로, TLS는 Application Layer 내부에서 HTTP 아래 sublayer로 동작한다.
> 전송 전에 HTTP 메시지를 암호화하고, 수신 시 복호화하는 래핑 역할을 한다.
> HTTP 자체의 요청/응답 구조는 변하지 않으며, 아래 채널만 암호화된다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS가 해결하는 보안 문제는 무엇이며, 어떤 메커니즘으로 보호하는가?

### Official Answer
The principal motivations for HTTPS are authentication of the accessed website and protection of the privacy and integrity of the exchanged data while it is in transit.
It protects against man-in-the-middle attacks, and the bidirectional block cipher encryption of communications between a client and server protects the communications against eavesdropping and tampering.

> #### Official Annotation:
> This ensures reasonable protection from eavesdroppers and man-in-the-middle attacks, provided that adequate cipher suites are used and that the server certificate is verified and trusted.
> HTTPS is designed to withstand such attacks and is considered secure against them (with the exception of HTTPS implementations that use deprecated versions of SSL).

> #### Official Annotation:
> All major browsers began removing support for TLS 1.0 and 1.1 in early 2020; you'll need to make sure your web server supports TLS 1.2 or 1.3 going forward.

> #### AI Annotation:
> HTTPS의 3대 보안 목표:
> - **Authentication(인증)**: 접속한 사이트가 진짜인지 확인 (피싱 방어)
> - **Privacy(기밀성)**: 전송 중 데이터를 제3자가 엿볼 수 없도록
> - **Integrity(무결성)**: 데이터가 전송 도중 변조되지 않았음을 보장
>
> 단, 전제조건이 있다: 적절한 암호화 스위트를 사용하고, 서버 인증서가 검증·신뢰되어야 한다. 약한 암호화를 쓰거나 인증서 검증을 건너뛰면 HTTPS라도 안전하지 않다.
> 2020년부터 TLS 1.0/1.1 지원이 제거되어, 최소 TLS 1.2가 필수다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS 인증에 신뢰할 수 있는 제3자(trusted third party)가 필요한 이유와, 이것이 HTTPS 초기 보급을 제한한 원인은?

### Official Answer
The authentication aspect of HTTPS requires a trusted third party to sign server-side digital certificates.
This was historically an expensive operation, which meant fully authenticated HTTPS connections were usually found only on secured payment transaction services and other secured corporate information systems on the World Wide Web.
In 2016, a campaign by the Electronic Frontier Foundation with the support of web browser developers led to the protocol becoming more prevalent.
HTTPS has since 2018 been used more often by web users than non-secure HTTP, primarily to protect page authenticity on all types of websites, secure accounts, and keep user communications, identity, and web browsing private.

> #### Official Annotation:
> To prepare a web server to accept HTTPS connections, the administrator must create a public key certificate for the web server.
> This certificate must be signed by a trusted certificate authority for the web browser to accept it without warning.
> Let's Encrypt, launched in April 2016, provides free and automated service that delivers basic SSL/TLS certificates to websites.
> The majority of web hosts and cloud providers now leverage Let's Encrypt, providing free certificates to their customers.

> #### AI Annotation:
> trusted third party = CA(Certificate Authority, 인증 기관). CA가 서버의 디지털 인증서에 서명해야 브라우저가 신뢰한다.
> 2016년 Let's Encrypt(무료 인증서 발급 서비스) 정식 출시로 비용 장벽이 사라졌고, 2018년 Chrome이 HTTP 사이트에 "Not Secure" 경고를 표시하면서 HTTPS가 웹의 기본이 되었다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS는 HTTP의 어떤 부분을 암호화하고, 어떤 정보는 보호하지 못하는가?

### Official Answer
Because HTTPS piggybacks HTTP entirely on top of TLS, the entirety of the underlying HTTP protocol can be encrypted.
This includes the request's URL, query parameters, headers, and cookies (which often contain identifying information about the user).
However, because website addresses and port numbers are necessarily part of the underlying TCP/IP protocols, HTTPS cannot protect their disclosure.
In practice this means that even on a correctly configured web server, eavesdroppers can infer the IP address and port number of the web server, and sometimes even the domain name (e.g. www.example.org, but not the rest of the URL) that a user is communicating with, along with the amount of data transferred and the duration of the communication, though not the content of the communication.

> #### AI Annotation:
> 암호화되는 것: URL 경로, 쿼리 파라미터, 헤더, 쿠키 — HTTP 프로토콜 전체.
> 보호하지 못하는 것: IP 주소, 포트 번호, 도메인명(SNI에서 평문 전송), 전송량, 통신 시간.
> 비유: 편지 내용은 봉인되지만 봉투의 주소는 보인다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## 웹에서 TLS 인증은 보통 어느 한쪽만 수행되는데, 어느 쪽이 인증되며 그 이유는?

### Official Answer
SSL/TLS is especially suited for HTTP, since it can provide some protection even if only one side of the communication is authenticated.
This is the case with HTTP transactions over the Internet, where typically only the server is authenticated (by the client examining the server's certificate).

> #### Official Annotation:
> The system can also be used for client authentication in order to limit access to a web server to authorized users.
> To do this, the site administrator typically creates a certificate for each user, which the user loads into their browser.
> Normally, the certificate contains the name and e-mail address of the authorized user and is automatically checked by the server on each connection to verify the user's identity, potentially without even requiring a password.

> #### AI Annotation:
> 웹에서는 서버만 인증된다 — 브라우저가 서버의 인증서를 검사하여 신원을 확인한다.
> 클라이언트(사용자)의 신원은 TLS 레벨이 아닌 애플리케이션 레벨(로그인, JWT 등)에서 처리한다.
> 다만 위 Official Annotation처럼 클라이언트 인증서를 통한 mutual TLS(mTLS)도 가능하며, 마이크로서비스 간 통신에서 널리 쓰인다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## 사용자가 HTTPS 연결을 신뢰할 수 있으려면 어떤 전제조건이 충족되어야 하는가?

### Official Answer
Web browsers know how to trust HTTPS websites based on certificate authorities that come pre-installed in their software.
Certificate authorities are in this way being trusted by web browser creators to provide valid certificates.
Therefore, a user should trust an HTTPS connection to a website if and only if all of the following are true:
The user trusts that their device, hosting the browser and the method to get the browser itself, is not compromised (i.e. there is no supply chain attack).
The user trusts that the browser software correctly implements HTTPS with correctly pre-installed certificate authorities.
The user trusts the certificate authority to vouch only for legitimate websites (i.e. the certificate authority is not compromised and there is no mis-issuance of certificates).
The website provides a valid certificate, which means it was signed by a trusted authority.
The certificate correctly identifies the website (e.g., when the browser visits "https://example.com", the received certificate is properly for "example.com" and not some other entity).
The user trusts that the protocol's encryption layer (SSL/TLS) is sufficiently secure against eavesdroppers.

> #### AI Annotation:
> 신뢰 체인: 기기 무결성 → 브라우저 구현 → CA 신뢰 → 인증서 유효성 → 도메인 일치 → TLS 강도.
> 이 중 하나라도 깨지면 HTTPS 연결 전체의 신뢰가 무너진다.
> 실제 사례: 2011년 DigiNotar CA가 해킹당해 가짜 google.com 인증서가 발급된 사건 — 조건 3(CA 신뢰)이 깨진 케이스.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS가 공용 와이파이 같은 안전하지 않은 네트워크에서 특히 중요한 이유는?

### Official Answer
HTTPS is especially important over insecure networks and networks that may be subject to tampering.
Insecure networks, such as public Wi-Fi access points, allow anyone on the same local network to packet-sniff and discover sensitive information not protected by HTTPS.
Additionally, some free-to-use and paid WLAN networks have been observed tampering with webpages by engaging in packet injection in order to serve their own ads on other websites.
This practice can be exploited maliciously in many ways, such as by injecting malware onto webpages and stealing users' private information.

> #### AI Annotation:
> 공용 와이파이에서 HTTP 사이트에 로그인하면 비밀번호가 평문으로 날아간다.
> 패킷 인젝션은 광고 삽입뿐 아니라 멀웨어 주입까지 가능하게 만든다 — HTTPS면 변조를 감지하여 차단한다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS가 보안 외에 성능에도 영향을 미치는 이유는?

### Official Answer
Deploying HTTPS also allows the use of HTTP/2 and HTTP/3 (and their predecessors SPDY and QUIC), which are new HTTP versions designed to reduce page load times, size, and latency.

> #### AI Annotation:
> 브라우저들은 HTTP/2, HTTP/3를 HTTPS 연결에서만 지원한다.
> 즉 HTTPS는 보안의 문제만이 아니라 멀티플렉싱, 헤더 압축, 서버 푸시 등 성능 최적화를 사용하기 위한 전제조건이다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HSTS(HTTP Strict Transport Security)란 무엇이며, 어떤 공격을 방어하는가?

### Official Answer
It is recommended to use HTTP Strict Transport Security (HSTS) with HTTPS to protect users from man-in-the-middle attacks, especially SSL stripping.

> #### Official Annotation:
> This type of attack defeats the security provided by HTTPS by changing the https: link into an http: link, taking advantage of the fact that few Internet users actually type "https" into their browser interface: they get to a secure site by clicking on a link, and thus are fooled into thinking that they are using HTTPS when in fact they are using HTTP.
> The attacker then communicates in clear with the client.

> #### AI Annotation:
> SSL stripping: 공격자가 클라이언트와 서버 사이에서 HTTPS 링크를 HTTP로 바꿔치기하는 공격. 사용자는 HTTP로 접속하고 있다는 사실을 모른 채 평문으로 통신하게 된다.
> HSTS는 서버가 브라우저에 "이 사이트는 앞으로 HTTPS로만 접속하라"고 알려주는 메커니즘이다. 한 번 설정되면 브라우저가 HTTP 접속 자체를 거부하므로 SSL stripping이 불가능해진다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## TLS가 데이터를 암호화하는 과정에서 장기 키와 세션 키의 역할은?

### Official Answer
The security of HTTPS is that of the underlying TLS, which typically uses long-term public and private keys to generate a short-term session key, which is then used to encrypt the data flow between the client and the server.
X.509 certificates are used to authenticate the server (and sometimes the client as well).

> #### AI Annotation:
> 비대칭 키(공개/비밀 키, 느림)로 대칭 세션 키(빠름)를 안전하게 교환하고, 이후 데이터 암호화는 세션 키로 수행하는 하이브리드 방식이다.
> X.509 인증서는 서버의 공개 키가 진짜인지 CA가 보증하는 역할을 한다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## Forward secrecy란 무엇이며, 이것이 없으면 어떤 위험이 있는가?

### Official Answer
An important property in this context is forward secrecy, which ensures that encrypted communications recorded in the past cannot be retrieved and decrypted should long-term secret keys or passwords be compromised in the future.
Not all web servers provide forward secrecy.

> #### Official Annotation:
> Diffie–Hellman key exchange (DHE) and Elliptic-curve Diffie–Hellman key exchange (ECDHE) are in 2013 the only schemes known to have that property.
> TLS 1.3, published in August 2018, dropped support for ciphers without forward secrecy.
> As of July 2023, 99.6% of web servers surveyed support some form of forward secrecy, and 75.2% will use forward secrecy with most browsers.

> #### AI Annotation:
> forward secrecy가 없으면: 공격자가 암호화된 트래픽을 녹화해두고, 나중에 서버 비밀키를 탈취하면 과거 통신을 전부 복호화할 수 있다.
> forward secrecy가 있으면: 매 세션마다 고유한 일회성 키를 생성하므로, 장기 키가 유출되어도 과거 세션 키를 역추적할 수 없다.
> TLS 1.3은 FS 없는 cipher를 아예 제거하여, TLS 1.3을 사용하면 FS가 자동으로 보장된다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS 사이트에서 일부 콘텐츠만 HTTP로 로드되면 어떤 문제가 발생하며, 쿠키의 secure 속성은 왜 필요한가?

### Official Answer
For HTTPS to be effective, a site must be completely hosted over HTTPS.
If some of the site's contents are loaded over HTTP (scripts or images, for example), or if only a certain page that contains sensitive information, such as a log-in page, is loaded over HTTPS while the rest of the site is loaded over plain HTTP, the user will be vulnerable to attacks and surveillance.
Additionally, cookies on a site served through HTTPS must have the secure attribute enabled.
On a site that has sensitive information on it, the user and the session will get exposed every time that site is accessed with HTTP instead of HTTPS.

> #### AI Annotation:
> Mixed content 문제: 스크립트가 HTTP로 로드되면 공격자가 스크립트를 변조하여 HTTPS 페이지의 데이터를 탈취할 수 있다.
> 쿠키의 `Secure` 속성이 없으면 HTTP 연결에서도 쿠키가 전송되어, HTTPS로 보호한 세션 정보가 평문으로 노출된다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## 인증서가 만료 전에 무효화(revoke)되어야 할 때, 브라우저는 인증서의 유효 상태를 어떻게 확인하는가?

### Official Answer
A certificate may be revoked before it expires, for example because the secrecy of the private key has been compromised.
The browser sends the certificate's serial number to the certificate authority or its delegate via OCSP (Online Certificate Status Protocol) and the authority responds, telling the browser whether the certificate is still valid or not.
The CA may also issue a CRL to tell people that these certificates are revoked.
CRLs are no longer required by the CA/Browser forum, nevertheless, they are still widely used by the CAs.

> #### AI Annotation:
> OCSP: 인증서 시리얼 번호를 CA에 보내 실시간으로 1건씩 유효 여부를 조회하는 프로토콜.
> CRL(Certificate Revocation List): CA가 발행하는 폐지된 인증서 목록으로, 전체를 한 번에 다운로드하는 방식.
> 실무에서는 두 방식이 병행되며, OCSP Stapling으로 서버가 미리 OCSP 응답을 캐시하여 성능 부담을 줄이기도 한다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## TLS 서버가 하나의 IP:포트 조합에 하나의 인증서만 제시할 수 있는 이유와, 이 제약을 SNI가 어떻게 해결하는가?

### Official Answer
Because TLS operates at a protocol level below that of HTTP and has no knowledge of the higher-level protocols, TLS servers can only strictly present one certificate for a particular address and port combination.
In the past, this meant that it was not feasible to use name-based virtual hosting with HTTPS.
A solution called Server Name Indication (SNI) exists, which sends the hostname to the server before encrypting the connection, although older browsers do not support this extension.

> #### AI Annotation:
> TLS 핸드셰이크는 HTTP 요청보다 먼저 일어나므로, 서버는 클라이언트가 어떤 도메인에 접속하려는지 알 수 없다.
> SNI는 TLS ClientHello 메시지에 호스트명을 평문으로 포함시켜 서버가 올바른 인증서를 선택하게 한다.
> 이것이 HTTPS에서도 도메인명이 보호되지 않는 근본적 이유다 — 암호화 전에 호스트명을 보내야 하기 때문이다.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## [TODO] TLS handshake의 구체적인 단계(ClientHello, ServerHello, 키 교환, Finished)는 어떻게 진행되는가?

### Official Answer

### Reference
- https://en.wikipedia.org/wiki/Transport_Layer_Security
