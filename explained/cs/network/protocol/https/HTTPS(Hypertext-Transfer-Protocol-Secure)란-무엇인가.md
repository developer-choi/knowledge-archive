# HTTPS(Hypertext Transfer Protocol Secure)란 무엇인가?

> Hypertext Transfer Protocol Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP).
> It uses encryption for secure communication over a computer network, and is widely used on the Internet.
> In HTTPS, the communication protocol is encrypted using Transport Layer Security (TLS) or, formerly, Secure Sockets Layer (SSL).
> The protocol is therefore also referred to as HTTP over TLS, or HTTP over SSL.

---

**도입**

브라우저 주소창의 자물쇠 아이콘 — 그게 HTTPS의 표시입니다. 이름이 HTTP "Secure"이지만 실제로는 새 프로토콜이 아닙니다. HTTP는 그대로 두고, 그 아래에 TLS 암호화 계층을 끼워 넣은 확장이에요. 그래서 "HTTP over TLS"라는 이름이 더 정확합니다.

---

**본문**

> Hypertext Transfer Protocol Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP).

HTTPS(Hypertext Transfer Protocol Secure)는 HTTP의 확장이다.

- **extension**: 확장. 새 프로토콜이 아니라 기존 HTTP에 보안을 더한 것. HTTP의 메시지 구조, 메서드, 상태 코드 모두 그대로.
- **of HTTP**: HTTP의. HTTPS가 HTTP를 대체한 게 아님 — 둘 다 표준으로 공존, HTTPS는 위에 한 겹 더 입힌 모양.

> It uses encryption for secure communication over a computer network,

컴퓨터 네트워크 상의 안전한 통신을 위해 암호화를 사용한다.

- **encryption**: 암호화. 평문을 알아볼 수 없는 형태로 변환. 중간에서 가로채도 의미 파악 불가.
- **secure communication**: 안전한 통신. 안전 = 도청 방지(privacy) + 변조 방지(integrity) + 신원 검증(authentication).

> and is widely used on the Internet.

인터넷에서 널리 사용된다.

- **widely used**: 널리. 2025년 기준 웹사이트 85% 이상이 HTTPS. 평문 HTTP는 소수파.

> In HTTPS, the communication protocol is encrypted using Transport Layer Security (TLS) or, formerly, Secure Sockets Layer (SSL).

HTTPS에서 통신 프로토콜은 TLS(Transport Layer Security)나 과거의 SSL(Secure Sockets Layer)을 사용해 암호화된다.

- **TLS**: 현재 표준 암호화 프로토콜. 웹 전용이 아니라 이메일, 메시징 등 범용. TLS 1.0 → 1.1 → 1.2 → 1.3로 발전.
- **SSL**: TLS의 전신. SSL 3.0(1996, Netscape)이 마지막 버전. 보안 취약점으로 현재는 사용 중단.
- **formerly**: 과거에. "예전엔 SSL이었지만 지금은 TLS다"라는 의미. 다만 "SSL 인증서"라는 명칭은 관습적으로 남아 있음.

> The protocol is therefore also referred to as HTTP over TLS, or HTTP over SSL.

따라서 이 프로토콜은 "HTTP over TLS" 또는 "HTTP over SSL"이라고도 불린다.

- **HTTP over TLS**: TLS 위에 얹은 HTTP. 이 명칭이 HTTPS의 정체를 가장 정확히 표현 — HTTP는 그대로, 아래에 TLS만 추가.

---

**종합**

HTTPS의 정체를 그림으로 정리하면:

```
[HTTPS = HTTP + TLS]

HTTP/1.1 또는 HTTP/2 또는 HTTP/3 메시지
       ↓
   TLS 암호화 계층 (TLS 1.2/1.3)
       ↓
   TCP (또는 HTTP/3는 QUIC over UDP)
       ↓
   IP
```

JS 개발자에게 의미 있는 점:

- `fetch('https://api.example.com')` 한 줄을 쓸 때 TLS는 브라우저가 알아서 처리. 코드는 HTTP나 HTTPS나 동일
- DevTools Network 탭에서 응답을 보면 헤더, 상태 코드 등 모두 평문으로 보임 — TLS는 네트워크 단에서만 암호화, 브라우저 내부에선 복호화된 데이터 사용
- Service Worker는 HTTPS에서만 동작 — 보안 프로토콜이 아니면 위험한 캐싱 동작 차단

HTTP와 HTTPS의 비교:

| 항목 | HTTP | HTTPS |
|---|---|---|
| URL prefix | `http://` | `https://` |
| 기본 포트 | 80 | 443 |
| 암호화 | 없음 (평문) | TLS로 암호화 |
| 무결성 검증 | 없음 | TLS MAC |
| 신원 검증 | 없음 | TLS 인증서 (CA 서명) |
| HTTP/2 사용 | 사실상 불가 (브라우저가 거부) | 가능 |
| HTTP/3 사용 | 불가 | 가능 |

이게 없으면 어떻게 되는가:

- HTTPS가 없다면 — 공용 와이파이에서 누구나 패킷 스니퍼로 비밀번호·세션 쿠키 탈취 가능. 정부·ISP의 검열·광고 인젝션이 자유로워짐. 온라인 뱅킹·쇼핑 같은 민감한 서비스가 사실상 성립 못 함.
- 2018년 Chrome이 HTTP 사이트에 "Not Secure" 경고를 표시하면서 HTTPS 보급이 결정적으로 가속됨. Let's Encrypt(2016~)의 무료 인증서가 비용 장벽을 없앤 것도 큰 기여.

오개념 예방: "SSL 인증서"라는 표현이 흔하지만, 사실은 "TLS 인증서"가 정확합니다. SSL은 1996년 이후 발전이 멈췄고 보안 취약점 때문에 사용이 중단됐지만 — 인증서 판매 회사들이 마케팅 용어로 "SSL 인증서"를 계속 쓰면서 명칭이 굳어졌습니다.

또 다른 흔한 오해: "HTTPS면 절대 안전". 부분적으로만 맞습니다. HTTPS는 전송 중 데이터를 보호하지만 — 약한 TLS 버전(TLS 1.0/1.1)을 쓰거나, 인증서 검증을 건너뛰거나, mixed content가 있으면 보안이 깨질 수 있습니다.

Official Annotation 보충: HTTPS는 보통 포트 443을 사용하며 URL이 `https://`로 시작합니다. TLS는 클라이언트와 서버 간 모든 통신을 암호화해, 은행 거래나 온라인 쇼핑처럼 민감한 데이터를 안전하게 교환할 수 있게 합니다. TLS는 이메일·메시징 등 다양한 프로토콜에서 범용적으로 사용되는 보안 프로토콜이며, SSL은 그 전신이지만 현재는 TLS로 대체됐습니다.

AI Annotation 보충: HTTPS는 새 프로토콜이 아니라 HTTP 위에 TLS 암호화 계층을 얹은 확장입니다. SSL은 TLS의 전신으로 현재는 보안 취약점 때문에 사용이 중단되었지만 "SSL 인증서"라는 이름이 관습적으로 혼용됩니다. SSL 마지막 버전은 3.0(1996, Netscape), 이후 TLS 1.0 → 1.1 → 1.2 → 1.3으로 발전했습니다.
