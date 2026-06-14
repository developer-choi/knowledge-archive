---
tags: [network, protocol, concept]
source: official
priority: 1
---

# Questions
- HTTPS(Hypertext Transfer Protocol Secure)란 무엇인가?
- TCP/IP 모델에서 TLS는 어느 계층에서 동작하며, HTTP 메시지를 어떻게 처리하는가?
- HTTPS가 해결하는 보안 문제는 무엇이며, 어떤 메커니즘으로 보호하는가?
  - HTTPS 인증에 신뢰할 수 있는 제3자(trusted third party)가 필요한 이유와, 이것이 HTTPS 초기 보급을 제한한 원인은?
- HTTPS는 HTTP의 어떤 부분을 암호화하고, 어떤 정보는 보호하지 못하는가?
- 웹에서 TLS 인증은 보통 어느 한쪽만 수행되는데, 어느 쪽이 인증되며 그 이유는?
- 사용자가 HTTPS 연결을 신뢰할 수 있으려면 어떤 전제조건이 충족되어야 하는가?
- HTTPS가 공용 와이파이 같은 안전하지 않은 네트워크에서 특히 중요한 이유는?
- HTTPS가 보안 외에 성능에도 영향을 미치는 이유는?
  - [HTTP/2가 HTTP/1.1 대비 어떤 점을 개선했는가? → `http.md`](http.md#http2가-http11-대비-개선한-점은)
- HSTS(HTTP Strict Transport Security)란 무엇이며, 어떤 공격을 방어하는가?
- TLS가 데이터를 암호화하는 과정에서 장기 키와 세션 키의 역할은?
  - Forward secrecy란 무엇이며, 이것이 없으면 어떤 위험이 있는가?
- HTTPS 사이트에서 일부 콘텐츠만 HTTP로 로드되면 어떤 문제가 발생하며, 쿠키의 secure 속성은 왜 필요한가?
- 인증서가 만료 전에 무효화(revoke)되어야 할 때, 브라우저는 인증서의 유효 상태를 어떻게 확인하는가?
- TLS 서버가 하나의 IP:포트 조합에 하나의 인증서만 제시할 수 있는 이유와, 이 제약을 SNI가 어떻게 해결하는가?
- [UNVERIFIED] TLS handshake의 구체적인 단계(ClientHello, ServerHello, 키 교환, Finished)는 어떻게 진행되는가?

---

# Answers

## HTTPS(Hypertext Transfer Protocol Secure)란 무엇인가?

### Official Answer
Hypertext Transfer Protocol Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP).
It uses encryption for secure communication over a computer network, and is widely used on the Internet.
In HTTPS, the communication protocol is encrypted using Transport Layer Security (TLS) or, formerly, Secure Sockets Layer (SSL).
The protocol is therefore also referred to as HTTP over TLS, or HTTP over SSL.

HTTPS URLs begin with "https://" and use port 443 by default, whereas HTTP URLs begin with "http://" and use port 80 by default.

HTTPS (HyperText Transfer Protocol Secure) is an encrypted version of the HTTP protocol.
It uses TLS to encrypt all communication between a client and a server.
This secure connection allows clients to safely exchange sensitive data with a server, such as when performing banking activities or online shopping.

Transport Layer Security (TLS), formerly known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.

Secure Sockets Layer, or SSL, was the old standard security technology for creating an encrypted network link between a server and client, ensuring all data passed is private and secure.
The current version of SSL is version 3.0, released by Netscape in 1996, and has been superseded by the Transport Layer Security (TLS) protocol.

### Reference
- https://en.wikipedia.org/wiki/HTTPS
- https://developer.mozilla.org/en-US/docs/Glossary/HTTPS
- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://developer.mozilla.org/en-US/docs/Glossary/SSL

---

## TCP/IP 모델에서 TLS는 어느 계층에서 동작하며, HTTP 메시지를 어떻게 처리하는가?

### Official Answer
HTTP operates at the highest layer of the TCP/IP model—the application layer; as does the TLS security protocol (operating as a lower sublayer of the same layer), which encrypts an HTTP message prior to transmission and decrypts a message upon arrival.
Strictly speaking, HTTPS is not a separate protocol, but refers to the use of ordinary HTTP over an encrypted SSL/TLS connection.
HTTPS encrypts all message contents, including the HTTP headers and the request/response data.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS가 해결하는 보안 문제는 무엇이며, 어떤 메커니즘으로 보호하는가?

### Official Answer
The principal motivations for HTTPS are authentication of the accessed website and protection of the privacy and integrity of the exchanged data while it is in transit.
It protects against man-in-the-middle attacks, and the bidirectional block cipher encryption of communications between a client and server protects the communications against eavesdropping and tampering.

This ensures reasonable protection from eavesdroppers and man-in-the-middle attacks, provided that adequate cipher suites are used and that the server certificate is verified and trusted.
HTTPS is designed to withstand such attacks and is considered secure against them (with the exception of HTTPS implementations that use deprecated versions of SSL).

All major browsers began removing support for TLS 1.0 and 1.1 in early 2020; you'll need to make sure your web server supports TLS 1.2 or 1.3 going forward.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS 인증에 신뢰할 수 있는 제3자(trusted third party)가 필요한 이유와, 이것이 HTTPS 초기 보급을 제한한 원인은?

### Official Answer
The authentication aspect of HTTPS requires a trusted third party to sign server-side digital certificates.
This was historically an expensive operation, which meant fully authenticated HTTPS connections were usually found only on secured payment transaction services and other secured corporate information systems on the World Wide Web.
In 2016, a campaign by the Electronic Frontier Foundation with the support of web browser developers led to the protocol becoming more prevalent.
HTTPS has since 2018 been used more often by web users than non-secure HTTP, primarily to protect page authenticity on all types of websites, secure accounts, and keep user communications, identity, and web browsing private.

To prepare a web server to accept HTTPS connections, the administrator must create a public key certificate for the web server.
This certificate must be signed by a trusted certificate authority for the web browser to accept it without warning.
Let's Encrypt, launched in April 2016, provides free and automated service that delivers basic SSL/TLS certificates to websites.
The majority of web hosts and cloud providers now leverage Let's Encrypt, providing free certificates to their customers.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS는 HTTP의 어떤 부분을 암호화하고, 어떤 정보는 보호하지 못하는가?

### Official Answer
Because HTTPS piggybacks HTTP entirely on top of TLS, the entirety of the underlying HTTP protocol can be encrypted.
This includes the request's URL, query parameters, headers, and cookies (which often contain identifying information about the user).
However, because website addresses and port numbers are necessarily part of the underlying TCP/IP protocols, HTTPS cannot protect their disclosure.
In practice this means that even on a correctly configured web server, eavesdroppers can infer the IP address and port number of the web server, and sometimes even the domain name (e.g. www.example.org, but not the rest of the URL) that a user is communicating with, along with the amount of data transferred and the duration of the communication, though not the content of the communication.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## 웹에서 TLS 인증은 보통 어느 한쪽만 수행되는데, 어느 쪽이 인증되며 그 이유는?

### Official Answer
SSL/TLS is especially suited for HTTP, since it can provide some protection even if only one side of the communication is authenticated.
This is the case with HTTP transactions over the Internet, where typically only the server is authenticated (by the client examining the server's certificate).

The system can also be used for client authentication in order to limit access to a web server to authorized users.
To do this, the site administrator typically creates a certificate for each user, which the user loads into their browser.
Normally, the certificate contains the name and e-mail address of the authorized user and is automatically checked by the server on each connection to verify the user's identity, potentially without even requiring a password.

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

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS가 공용 와이파이 같은 안전하지 않은 네트워크에서 특히 중요한 이유는?

### Official Answer
HTTPS is especially important over insecure networks and networks that may be subject to tampering.
Insecure networks, such as public Wi-Fi access points, allow anyone on the same local network to packet-sniff and discover sensitive information not protected by HTTPS.
Additionally, some free-to-use and paid WLAN networks have been observed tampering with webpages by engaging in packet injection in order to serve their own ads on other websites.
This practice can be exploited maliciously in many ways, such as by injecting malware onto webpages and stealing users' private information.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS가 보안 외에 성능에도 영향을 미치는 이유는?

### Official Answer
Deploying HTTPS also allows the use of HTTP/2 and HTTP/3 (and their predecessors SPDY and QUIC), which are new HTTP versions designed to reduce page load times, size, and latency.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HSTS(HTTP Strict Transport Security)란 무엇이며, 어떤 공격을 방어하는가?

### Official Answer
It is recommended to use HTTP Strict Transport Security (HSTS) with HTTPS to protect users from man-in-the-middle attacks, especially SSL stripping.

This type of attack defeats the security provided by HTTPS by changing the https: link into an http: link, taking advantage of the fact that few Internet users actually type "https" into their browser interface: they get to a secure site by clicking on a link, and thus are fooled into thinking that they are using HTTPS when in fact they are using HTTP.
The attacker then communicates in clear with the client.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## TLS가 데이터를 암호화하는 과정에서 장기 키와 세션 키의 역할은?

### Official Answer
The security of HTTPS is that of the underlying TLS, which typically uses long-term public and private keys to generate a short-term session key, which is then used to encrypt the data flow between the client and the server.
X.509 certificates are used to authenticate the server (and sometimes the client as well).

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## Forward secrecy란 무엇이며, 이것이 없으면 어떤 위험이 있는가?

### Official Answer
An important property in this context is forward secrecy, which ensures that encrypted communications recorded in the past cannot be retrieved and decrypted should long-term secret keys or passwords be compromised in the future.
Not all web servers provide forward secrecy.

Diffie–Hellman key exchange (DHE) and Elliptic-curve Diffie–Hellman key exchange (ECDHE) are in 2013 the only schemes known to have that property.
TLS 1.3, published in August 2018, dropped support for ciphers without forward secrecy.
As of July 2023, 99.6% of web servers surveyed support some form of forward secrecy, and 75.2% will use forward secrecy with most browsers.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## HTTPS 사이트에서 일부 콘텐츠만 HTTP로 로드되면 어떤 문제가 발생하며, 쿠키의 secure 속성은 왜 필요한가?

### Official Answer
For HTTPS to be effective, a site must be completely hosted over HTTPS.
If some of the site's contents are loaded over HTTP (scripts or images, for example), or if only a certain page that contains sensitive information, such as a log-in page, is loaded over HTTPS while the rest of the site is loaded over plain HTTP, the user will be vulnerable to attacks and surveillance.
Additionally, cookies on a site served through HTTPS must have the secure attribute enabled.
On a site that has sensitive information on it, the user and the session will get exposed every time that site is accessed with HTTP instead of HTTPS.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## 인증서가 만료 전에 무효화(revoke)되어야 할 때, 브라우저는 인증서의 유효 상태를 어떻게 확인하는가?

### Official Answer
A certificate may be revoked before it expires, for example because the secrecy of the private key has been compromised.
The browser sends the certificate's serial number to the certificate authority or its delegate via OCSP (Online Certificate Status Protocol) and the authority responds, telling the browser whether the certificate is still valid or not.
The CA may also issue a CRL to tell people that these certificates are revoked.
CRLs are no longer required by the CA/Browser forum, nevertheless, they are still widely used by the CAs.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## TLS 서버가 하나의 IP:포트 조합에 하나의 인증서만 제시할 수 있는 이유와, 이 제약을 SNI가 어떻게 해결하는가?

### Official Answer
Because TLS operates at a protocol level below that of HTTP and has no knowledge of the higher-level protocols, TLS servers can only strictly present one certificate for a particular address and port combination.
In the past, this meant that it was not feasible to use name-based virtual hosting with HTTPS.
A solution called Server Name Indication (SNI) exists, which sends the hostname to the server before encrypting the connection, although older browsers do not support this extension.

### Reference
- https://en.wikipedia.org/wiki/HTTPS

---

## [UNVERIFIED] TLS handshake의 구체적인 단계(ClientHello, ServerHello, 키 교환, Finished)는 어떻게 진행되는가?

### Reference
- https://en.wikipedia.org/wiki/Transport_Layer_Security
