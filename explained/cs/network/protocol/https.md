# HTTPS(Hypertext Transfer Protocol Secure)란 무엇인가?

> Hypertext Transfer Protocol Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP).
> It uses encryption for secure communication over a computer network, and is widely used on the Internet.
> In HTTPS, the communication protocol is encrypted using Transport Layer Security (TLS) or, formerly, Secure Sockets Layer (SSL).
> The protocol is therefore also referred to as HTTP over TLS, or HTTP over SSL.

---

## 도입

브라우저 주소창의 자물쇠 아이콘 — 그게 HTTPS의 표시입니다. 이름이 HTTP "Secure"이지만 실제로는 새 프로토콜이 아닙니다. HTTP는 그대로 두고, 그 아래에 TLS 암호화 계층을 끼워 넣은 확장이에요. 그래서 "HTTP over TLS"라는 이름이 더 정확합니다.

---

## 본문

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

## 종합

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

---

# TCP/IP 모델에서 TLS는 어느 계층에서 동작하며, HTTP 메시지를 어떻게 처리하는가?

> HTTP operates at the highest layer of the TCP/IP model—the application layer; as does the TLS security protocol (operating as a lower sublayer of the same layer), which encrypts an HTTP message prior to transmission and decrypts a message upon arrival.
> Strictly speaking, HTTPS is not a separate protocol, but refers to the use of ordinary HTTP over an encrypted SSL/TLS connection.
> HTTPS encrypts all message contents, including the HTTP headers and the request/response data.

---

## 도입

OSI 7계층 모델에는 보안 계층이 따로 있지만, 인터넷에서 실제 쓰이는 TCP/IP 4계층 모델에는 보안 계층이 없습니다. 그럼 TLS는 어디 들어갈까요? 답은 — 애플리케이션 계층 안에 sublayer(하위 계층)로 끼어들어가 HTTP 메시지를 감싸는 형태입니다. HTTP는 자기 형식 그대로, TLS가 그 위에 암호화 래핑.

---

## 본문

> HTTP operates at the highest layer of the TCP/IP model—the application layer;

HTTP는 TCP/IP 모델의 가장 위층 — 애플리케이션 계층에서 동작한다.

- **highest layer of the TCP/IP model**: TCP/IP 4계층 중 가장 위. 사용자 애플리케이션이 직접 다루는 계층.
- **application layer**: 애플리케이션 계층. HTTP, FTP, SMTP, DNS 등 모든 애플리케이션 프로토콜이 여기에.

> as does the TLS security protocol (operating as a lower sublayer of the same layer),

TLS 보안 프로토콜도 마찬가지로 (같은 계층의 하위 sublayer로 동작).

- **as does**: HTTP와 같이. TLS도 애플리케이션 계층에 위치.
- **lower sublayer of the same layer**: 같은 계층(애플리케이션)의 하위 sublayer. 별도 계층이 아니라 애플리케이션 계층 안에서 더 아래쪽.

> which encrypts an HTTP message prior to transmission and decrypts a message upon arrival.

(TLS는) 전송 전에 HTTP 메시지를 암호화하고 수신 시 메시지를 복호화한다.

- **encrypts prior to transmission**: 전송 전 암호화. HTTP가 만든 메시지를 TLS가 가로채 암호화한 뒤 TCP로 넘김.
- **decrypts upon arrival**: 수신 시 복호화. 받은 암호문을 TLS가 평문으로 풀어 HTTP에게 전달.

> Strictly speaking, HTTPS is not a separate protocol, but refers to the use of ordinary HTTP over an encrypted SSL/TLS connection.

엄격히 말해 HTTPS는 별도 프로토콜이 아니라, 암호화된 SSL/TLS 연결 위에서 일반 HTTP를 사용하는 것을 가리킨다.

- **not a separate protocol**: 별도 프로토콜이 아님. 새 표준 RFC를 만든 게 아니라 HTTP+TLS 조합의 별명.
- **ordinary HTTP**: 일반 HTTP. HTTPS의 HTTP 부분은 평소 HTTP와 동일 — 메서드, 헤더, 상태 코드 모두 그대로.
- **over an encrypted SSL/TLS connection**: 암호화된 SSL/TLS 연결 위에서. 채널만 암호화 구간.

> HTTPS encrypts all message contents, including the HTTP headers and the request/response data.

HTTPS는 HTTP 헤더와 요청/응답 데이터를 포함한 모든 메시지 내용을 암호화한다.

- **all message contents**: 모든 메시지 내용. 헤더와 본문 모두.
- **including the HTTP headers**: 헤더도 포함. 쿠키, Authorization 토큰, URL 경로 등이 모두 암호화 — 평문 HTTP에선 누구나 볼 수 있는 정보가 보호됨.

---

## 종합

TCP/IP 모델에서 TLS의 위치를 그림으로:

```
┌──────────────────────────────┐
│   Application Layer          │
│   ┌────────────────────────┐ │
│   │   HTTP                 │ │  ← 메시지 작성
│   ├────────────────────────┤ │
│   │   TLS sublayer         │ │  ← HTTP 메시지 암호화
│   └────────────────────────┘ │
├──────────────────────────────┤
│   Transport Layer (TCP/UDP)  │  ← 신뢰성 전송
├──────────────────────────────┤
│   Internet Layer (IP)        │  ← 라우팅
├──────────────────────────────┤
│   Network Access Layer       │  ← 물리 전송
└──────────────────────────────┘
```

처리 흐름 (송신 측):

1. HTTP가 메시지 생성: `GET /api/users HTTP/1.1\r\nHost: ...`
2. TLS가 가로채서 암호화: 기존 평문 → `0x4f 0xa3 0xe8 ...` (의미 없는 바이트)
3. TCP가 받아서 패킷 단위로 분할 + 신뢰성 전송
4. IP가 라우팅
5. 네트워크 전송

수신 측은 역순:

1. 네트워크 수신
2. IP가 받아 처리
3. TCP가 재조립
4. TLS가 복호화: 암호문 → 평문 HTTP 메시지
5. HTTP가 메시지 파싱

JS 개발자가 직접 보는 것:

```js
// 보낼 때 — JS가 보는 건 평문 HTTP만. TLS는 보이지 않음
await fetch('https://api.example.com/users', {
  headers: { 'Authorization': 'Bearer secret-token' }
});
// 토큰이 평문처럼 보이지만, 네트워크에선 TLS로 암호화돼서 흘러감

// 받을 때 — DevTools Network 탭은 복호화된 평문을 표시
// 패킷 캡처 도구(Wireshark)로 보면 암호화된 바이트 덩어리만 보임
```

이게 없으면 어떻게 되는가:

- TLS sublayer가 없다면 — 모든 HTTP 메시지가 평문으로 흐름. 같은 와이파이의 누구든 비밀번호·세션 쿠키를 가로챌 수 있음.
- TLS가 별도 계층(예: 보안 계층)으로 분리됐다면 — HTTP의 메시지 구조를 바꿔야 했을 것. 애플리케이션 sublayer로 끼워 넣었기에 HTTP는 자기 형식 그대로 유지하고 TLS만 추가하면 됨 — 깔끔한 분리.

오개념 예방: HTTPS가 모든 정보를 보호하는 건 아닙니다. 헤더와 본문은 암호화되지만 — TCP/IP 패킷의 출발지·목적지 IP는 라우팅에 필요하므로 평문, 도메인명도 SNI(Server Name Indication)에서 평문으로 보입니다. 즉 "어디 서버와 통신하는지"는 도청 가능, "무엇을 주고받는지"는 보호됩니다.

또 다른 오개념: "HTTPS면 종단간 암호화(end-to-end encryption)와 같다"고 생각하기 쉽지만 — 다릅니다. HTTPS는 클라이언트-서버 간 채널 암호화이지, 종단(예: 보낸 사람-받는 사람) 사이의 암호화가 아닙니다. 서버에 도달하면 평문이 되어 서버 운영자는 모든 데이터를 볼 수 있습니다.

AI Annotation 보충: TCP/IP 모델에는 별도의 보안 계층이 없으므로, TLS는 Application Layer 내부에서 HTTP 아래 sublayer로 동작합니다. 전송 전에 HTTP 메시지를 암호화하고, 수신 시 복호화하는 래핑 역할을 합니다. HTTP 자체의 요청/응답 구조는 변하지 않으며, 아래 채널만 암호화됩니다 — 그래서 "HTTP는 TLS와 무관하게 동일하게 동작"한다고 말할 수 있습니다.

---

# HTTPS가 해결하는 보안 문제는 무엇이며, 어떤 메커니즘으로 보호하는가?

> The principal motivations for HTTPS are authentication of the accessed website and protection of the privacy and integrity of the exchanged data while it is in transit.
> It protects against man-in-the-middle attacks, and the bidirectional block cipher encryption of communications between a client and server protects the communications against eavesdropping and tampering.

---

## 도입

HTTPS가 무엇을 막아주는지 한 줄로 요약하면 — 누군가가 통신 중간에 끼어들어 ① 가짜 서버인 척하거나 ② 데이터를 엿보거나 ③ 데이터를 변조하지 못하게 막습니다. 이 세 가지가 HTTPS의 핵심 보안 목표이고, 각각을 인증(authentication), 기밀성(privacy), 무결성(integrity)이라고 부릅니다.

---

## 본문

> The principal motivations for HTTPS are authentication of the accessed website

HTTPS의 주된 동기는 접속한 웹사이트의 인증과.

- **principal motivations**: 주된 동기. HTTPS가 존재하는 핵심 이유.
- **authentication of the accessed website**: 접속한 사이트의 인증. "내가 지금 접속하는 사이트가 진짜 그 사이트인가"를 검증.

> and protection of the privacy and integrity of the exchanged data while it is in transit.

전송 중인 교환 데이터의 기밀성·무결성 보호다.

- **privacy**: 기밀성. 데이터를 제3자가 엿볼 수 없도록.
- **integrity**: 무결성. 데이터가 도중에 변조되지 않았음을 보장.
- **while it is in transit**: 전송 중. 즉 클라이언트와 서버 사이를 흘러가는 동안. 도착 후 서버에 저장된 상태는 별개.

> It protects against man-in-the-middle attacks,

man-in-the-middle 공격으로부터 보호한다.

- **man-in-the-middle attacks (MITM)**: 통신의 중간에 공격자가 끼어들어 양쪽인 척하는 공격. 클라이언트는 "서버와 통신 중"으로 믿고 서버는 "클라이언트와 통신 중"으로 믿지만 실제로는 공격자가 양쪽을 중계.

> and the bidirectional block cipher encryption of communications between a client and server protects the communications against eavesdropping and tampering.

그리고 클라이언트와 서버 간 통신의 양방향 블록 암호화가 도청과 변조로부터 통신을 보호한다.

- **bidirectional**: 양방향. 클라이언트→서버 + 서버→클라이언트 모두 암호화.
- **block cipher encryption**: 블록 암호. AES 같은 알고리즘으로 데이터를 일정 크기 블록 단위로 암호화.
- **eavesdropping**: 도청. 평문을 가로채 내용을 읽기.
- **tampering**: 변조. 데이터를 가로채 내용을 바꾼 후 흘려보내기.

---

## 종합

HTTPS의 3대 보안 목표를 정리하면:

| 목표 | 한국어 | 막는 공격 | 메커니즘 |
|---|---|---|---|
| Authentication | 인증 | 피싱, 가짜 서버 | TLS 인증서 (CA가 서버 신원 보증) |
| Privacy (Confidentiality) | 기밀성 | 도청 (eavesdropping) | 블록 암호 (AES 등) |
| Integrity | 무결성 | 변조 (tampering) | MAC (Message Authentication Code) |

이 세 가지가 결합되어 MITM 공격을 막습니다.

**MITM 공격 시나리오 (HTTP 평문)**:

```
사용자 → [공격자(가짜 와이파이)] → 진짜 서버

공격자가 할 수 있는 것:
1. 내가 보낸 비밀번호 그대로 읽음 (도청)
2. 내가 보는 페이지에 광고/멀웨어 삽입 (변조)
3. 자기가 진짜 서버인 척 응답 (가짜 서버)
```

**HTTPS가 어떻게 막는가**:

```
사용자 → [공격자] → 진짜 서버

1. TLS handshake로 서버 인증서 확인
   → 공격자가 가짜 서버처럼 행동하면 인증서 검증 실패 (CA 서명 없음)
   → 브라우저: "이 사이트의 인증서가 신뢰할 수 없습니다" 경고

2. 평문이 아닌 암호화된 데이터가 흐름
   → 공격자가 가로채도 의미 없는 바이트 덩어리 (도청 불가)

3. 메시지에 MAC(메시지 인증 코드) 첨부
   → 공격자가 변조하면 MAC 불일치로 감지 (변조 불가)
```

JS 개발자에게 와닿는 사례:

```js
// HTTPS 사이트에서 fetch
await fetch('https://api.example.com/login', {
  method: 'POST',
  body: JSON.stringify({ id, password })
});

// 네트워크에 흐르는 실제 바이트:
//   HTTPS: 0xa3 0xe8 0x4f ... (의미 없는 암호문)
//   HTTP:  POST /login...\r\n{"id":"alice","password":"secret"}
```

DevTools에선 둘 다 평문으로 보이지만 — DevTools는 브라우저 내부에서 복호화된 후의 데이터를 보여주는 거예요. 실제 와이어 위의 바이트는 패킷 캡처(Wireshark) 도구로 봐야 보이고, HTTPS 트래픽은 키 없이는 해석 불가.

**3대 목표가 함께 작동해야 하는 이유**

만약 인증만 있고 암호화가 없다면 — 진짜 서버와 통신하지만 그 내용을 누구나 볼 수 있음. 패스워드 노출.

만약 암호화만 있고 인증이 없다면 — 내가 통신하는 상대가 진짜 서버인지 모름. 공격자가 자기 인증서로 암호화 채널을 열어주면 우리는 공격자와 안전하게 통신하는 셈 (의미 없음).

만약 인증과 암호화는 있지만 무결성 검증이 없다면 — 데이터를 가로채 변조 후 흘려보낼 수 있음. 평문은 못 봐도 비트 단위 변조는 가능.

세 가지가 함께 있어야 비로소 안전한 통신이 됩니다.

이게 없으면 어떻게 되는가:

- 인증이 없으면 — 피싱 사이트가 google.com인 척 가능. 사용자가 비밀번호를 가짜 사이트에 입력.
- 암호화가 없으면 — 공용 와이파이의 누구든 패킷 스니퍼로 비밀번호 평문 읽기.
- 무결성이 없으면 — ISP가 페이지에 광고 삽입, 정부가 검열용 메시지 삽입.

오개념 예방: "HTTPS면 무조건 안전"이 아닙니다. Official Annotation이 명시한 전제조건들이 있습니다 — 적절한 cipher suite 사용, 인증서 검증·신뢰 등. 약한 암호화(TLS 1.0/1.1, RC4 등)를 쓰거나 인증서 검증을 건너뛰면 HTTPS라도 보안이 깨집니다. 2020년부터 TLS 1.0/1.1 지원이 제거되어 최소 TLS 1.2가 필수.

또 다른 오해: "HTTPS면 서버 운영자가 내 데이터를 볼 수 없다"는 것도 잘못입니다. HTTPS는 전송 중 데이터를 보호할 뿐 — 서버에 도달하면 평문이 됩니다. 서버 운영자는 모든 데이터를 볼 수 있습니다. "종단간 암호화"가 필요하면 TLS와 별도로 메시지 자체를 암호화해야 합니다 (예: Signal의 E2EE).

Official Annotation 보충: HTTPS는 도청자와 MITM 공격으로부터 합리적인 보호를 제공하지만, 적절한 cipher suite 사용과 서버 인증서 검증·신뢰가 전제되어야 합니다. 모든 주요 브라우저들은 2020년 초부터 TLS 1.0과 1.1 지원을 제거했으므로, 웹서버는 TLS 1.2 또는 1.3을 지원해야 합니다.

AI Annotation 보충: HTTPS의 3대 보안 목표 — Authentication(인증, 피싱 방어) + Privacy(기밀성, 엿보기 방어) + Integrity(무결성, 변조 방어). 단, 전제조건이 있습니다 — 적절한 암호화 스위트를 사용하고, 서버 인증서가 검증·신뢰되어야 합니다. 약한 암호화를 쓰거나 인증서 검증을 건너뛰면 HTTPS라도 안전하지 않습니다.

```
       [MITM 공격 vs HTTPS 방어]

   <HTTP 평문 -- MITM 성공>

   사용자 ----+                       +---- 진짜 서버
              |                       |
              v                       ^
        +----------+               +----------+
        | 공격자   |  도청 / 변조  | 응답 중계 |
        |  (가짜   |--------------->|          |
        |  와이파이)|<---------------|          |
        +----------+               +----------+
              |
              v
       비밀번호 평문 노출
       페이지에 광고 / 멀웨어 삽입
       응답 임의 변조


   <HTTPS -- 3중 방어>

   사용자                  공격자                 진짜 서버
     |                       |                       |
     | (1) TLS handshake     |                       |
     |     ClientHello       |                       |
     |---------------------->|---------------------->|
     |                       |                       |
     |     ServerHello + 인증서                      |
     |<----------------------|<----------------------|
     |                       |                       |
     | 인증서 검증:                                  |
     |   - CA 서명 확인                              |
     |   - 도메인 일치 확인                          |
     |   -> [Authentication]                         |
     |       공격자가 가짜 서버처럼 굴면              |
     |       검증 실패로 차단                        |
     |                       |                       |
     | (2) 세션 키 협상 후 데이터 암호화             |
     |     [Privacy] 공격자가 봐도                   |
     |              암호문만 보임                     |
     |==(암호문)===>|==(암호문)============>|       |
     |                                              |
     | (3) MAC 검증                                  |
     |     [Integrity] 공격자가 한 비트라도 변조     |
     |                 -> MAC 불일치 -> 폐기         |
```

---

# HTTPS 인증에 신뢰할 수 있는 제3자(trusted third party)가 필요한 이유와, 이것이 HTTPS 초기 보급을 제한한 원인은?

> The authentication aspect of HTTPS requires a trusted third party to sign server-side digital certificates.
> This was historically an expensive operation, which meant fully authenticated HTTPS connections were usually found only on secured payment transaction services and other secured corporate information systems on the World Wide Web.
> In 2016, a campaign by the Electronic Frontier Foundation with the support of web browser developers led to the protocol becoming more prevalent.
> HTTPS has since 2018 been used more often by web users than non-secure HTTP, primarily to protect page authenticity on all types of websites, secure accounts, and keep user communications, identity, and web browsing private.

---

## 도입

HTTPS의 보안은 "내가 통신하는 상대가 진짜 example.com인가?"를 확인하는 데서 시작합니다. 그런데 클라이언트가 그걸 어떻게 알 수 있을까요? — 답은 신뢰할 수 있는 제3자(CA, Certificate Authority)가 "이 서버는 진짜 example.com 맞아"라고 보증해주는 것. 이 보증서가 디지털 인증서이고, 이걸 발급받는 비용이 한때 HTTPS 보급의 큰 장벽이었습니다.

---

## 본문

> The authentication aspect of HTTPS requires a trusted third party to sign server-side digital certificates.

HTTPS의 인증 측면은 신뢰할 수 있는 제3자가 서버 측 디지털 인증서에 서명하는 것을 필요로 한다.

- **trusted third party**: 신뢰할 수 있는 제3자. 클라이언트도 서버도 아닌, 양쪽이 모두 믿는 기관 — CA(Certificate Authority).
- **sign server-side digital certificates**: 서버 측 디지털 인증서에 서명. CA가 자기 비밀키로 서명해 "이 서버의 공개키는 진짜다"를 보증.

> This was historically an expensive operation,

이것은 역사적으로 비싼 작업이었다.

- **historically expensive**: 과거엔 비쌌음. 인증서 한 장에 연 수십~수백 달러. 한 도메인당 비용 발생.

> which meant fully authenticated HTTPS connections were usually found only on secured payment transaction services and other secured corporate information systems on the World Wide Web.

이는 완전히 인증된 HTTPS 연결이 보통 보안 결제 서비스와 다른 기업의 보안 정보 시스템에서만 발견된다는 것을 의미했다.

- **secured payment transaction services**: 보안 결제 서비스. 신용카드 결제 페이지처럼 비용을 감당할 수 있는 곳만.
- **only on**: 만. 일반 블로그·뉴스·커뮤니티는 HTTP가 기본이고 HTTPS는 사치였음.

> In 2016, a campaign by the Electronic Frontier Foundation with the support of web browser developers led to the protocol becoming more prevalent.

2016년, 전자프런티어재단(EFF)이 웹 브라우저 개발자들의 지원으로 캠페인을 벌여 이 프로토콜이 더 널리 퍼지게 됐다.

- **Electronic Frontier Foundation (EFF)**: 디지털 권리 옹호 비영리단체.
- **support of web browser developers**: 브라우저 개발자들의 지원. Chrome, Firefox 등이 같은 시기에 HTTPS 우대 정책 도입.
- **2016**: Let's Encrypt 정식 출시 시기. 무료 인증서 발급 서비스 — 비용 장벽 제거.

> HTTPS has since 2018 been used more often by web users than non-secure HTTP,

2018년 이후 웹 사용자들에게 HTTPS가 비보안 HTTP보다 더 자주 사용되어 왔다.

- **since 2018**: 2018년 이후. 50% 라인을 넘은 시점.
- **more often than non-secure HTTP**: HTTP보다 더 자주. HTTPS가 주류, HTTP가 소수파로 역전.

> primarily to protect page authenticity on all types of websites, secure accounts, and keep user communications, identity, and web browsing private.

주된 목적은 모든 종류의 웹사이트에서 페이지 진정성 보호, 계정 보안, 사용자 통신·신원·웹 브라우징의 비공개 유지다.

- **all types of websites**: 모든 종류의 사이트. 결제뿐 아니라 일반 사이트까지 확장.
- **page authenticity**: 페이지의 진정성. ISP가 광고를 끼워 넣지 못하도록.
- **keep user communications, identity, and web browsing private**: 통신·신원·브라우징을 비공개로. 제3자(ISP, 정부, 광고주)의 추적 차단.

---

## 종합

HTTPS 보급의 시기별 변화:

| 시기 | 상황 | 특징 |
|---|---|---|
| ~2010s 초반 | 결제 페이지에만 HTTPS | 인증서 비싸서 보편 사용 어려움 |
| 2014 | Google이 HTTPS를 SEO 가산점으로 명시 | 보급 가속의 첫 신호 |
| 2016 | Let's Encrypt 정식 출시 | 무료 인증서로 비용 장벽 제거 |
| 2018 | Chrome이 HTTP 사이트에 "Not Secure" 경고 | 결정적 가속, HTTPS가 50% 돌파 |
| 2025 | 85% 이상 사이트 HTTPS | HTTP는 소수파 |

신뢰할 수 있는 제3자가 왜 필요한가 — 시나리오로:

```
공격자가 example.com인 척 행동하려 함

만약 인증서 시스템이 없다면:
- 공격자가 자기 공개키를 example.com의 것처럼 제시
- 클라이언트는 이를 검증할 방법이 없어 그냥 받아들임
- 공격자가 모든 통신을 복호화 가능 (MITM 성공)

CA 인증서 시스템이 있으면:
- example.com은 CA에 자기 공개키를 서명받음
- CA는 도메인 소유권 확인 후 서명
- 클라이언트는 CA의 공개키(브라우저에 미리 내장)로 서명 검증
- 공격자가 example.com인 척하려면 CA의 비밀키가 필요 — 사실상 불가능
```

브라우저가 CA를 어떻게 신뢰하는가:

```js
// 브라우저에는 신뢰할 수 있는 CA의 루트 인증서가 미리 설치됨
// (Chrome은 OS의 루트 저장소 또는 자체 저장소 사용)

// 사이트 접속 시 흐름:
// 1. 서버가 자기 인증서 + CA 서명 제시
// 2. 브라우저가 CA의 공개키로 서명 검증
// 3. 검증 성공 → 자물쇠 아이콘 표시
// 4. 검증 실패 → "이 사이트의 인증서를 신뢰할 수 없습니다" 경고

// chrome://settings/security 에서 신뢰하는 CA 목록 확인 가능
```

이게 없으면 어떻게 되는가:

- CA 시스템이 없었다면 — MITM 공격을 막을 방법이 없어 HTTPS의 인증 보장이 성립 불가. 암호화는 가능하지만 "누구와 암호화 통신 중인가"를 검증 못 함.
- Let's Encrypt가 없었다면 — HTTPS 보급이 50%를 넘는 데 훨씬 오래 걸렸을 것. 비용 부담으로 인해 작은 사이트는 HTTP에 머물렀을 것.

오개념 예방: "Let's Encrypt가 무료라 보안이 약한 거 아닌가?"는 잘못된 직관입니다. 인증서의 암호 강도는 발급 비용과 무관합니다 — Let's Encrypt도 다른 CA와 동일한 RSA/ECDSA 키 강도를 사용. 차이는 발급 절차의 자동화 여부와 인증 검증 수준(DV/OV/EV)일 뿐. 일반 웹사이트엔 DV(Domain Validation) 인증서로 충분하며, Let's Encrypt가 이를 무료로 자동 발급합니다.

또 다른 오개념: "CA가 해킹당하면 어떻게 되는가?"는 실제로 발생한 적이 있습니다. 2011년 DigiNotar CA가 해킹돼 가짜 google.com 인증서가 발급된 사건 — 이후 브라우저들은 DigiNotar를 신뢰 목록에서 제거. CA 자체의 신뢰성이 깨지면 그 CA가 발급한 모든 인증서의 신뢰가 무너지는 단일 실패점이 있습니다. 이를 보완하기 위해 Certificate Transparency 같은 추가 메커니즘이 도입됐습니다.

Official Annotation 보충: HTTPS 연결을 받기 위해 관리자는 웹서버용 공개키 인증서를 만들어야 합니다. 이 인증서는 신뢰할 수 있는 CA가 서명해야 브라우저가 경고 없이 받아들입니다. 2016년 4월 출시된 Let's Encrypt는 무료·자동화된 SSL/TLS 인증서 발급 서비스로, 대부분의 웹 호스트와 클라우드 제공자가 이를 활용해 고객에게 무료 인증서를 제공합니다.

AI Annotation 보충: trusted third party = CA(Certificate Authority, 인증 기관). CA가 서버의 디지털 인증서에 서명해야 브라우저가 신뢰합니다. 2016년 Let's Encrypt 정식 출시로 비용 장벽이 사라졌고, 2018년 Chrome이 HTTP 사이트에 "Not Secure" 경고를 표시하면서 HTTPS가 웹의 기본이 되었습니다.

---

# HTTPS는 HTTP의 어떤 부분을 암호화하고, 어떤 정보는 보호하지 못하는가?

> Because HTTPS piggybacks HTTP entirely on top of TLS, the entirety of the underlying HTTP protocol can be encrypted.
> This includes the request's URL, query parameters, headers, and cookies (which often contain identifying information about the user).
> However, because website addresses and port numbers are necessarily part of the underlying TCP/IP protocols, HTTPS cannot protect their disclosure.
> In practice this means that even on a correctly configured web server, eavesdroppers can infer the IP address and port number of the web server, and sometimes even the domain name (e.g. www.example.org, but not the rest of the URL) that a user is communicating with, along with the amount of data transferred and the duration of the communication, though not the content of the communication.

---

## 도입

HTTPS는 "전부 암호화"라는 인상이 있지만 실제로는 그렇지 않습니다. 패킷이 인터넷을 흐르려면 출발지와 목적지 IP가 평문이어야 하고 — 그게 라우팅의 기본 조건이니까요. 어디까지 암호화되고 무엇이 노출되는지 정확히 구분하면, 단순 "HTTPS면 안전"이 아니라 정확한 보안 모델을 갖게 됩니다.

---

## 본문

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

## 종합

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

---

# 웹에서 TLS 인증은 보통 어느 한쪽만 수행되는데, 어느 쪽이 인증되며 그 이유는?

> SSL/TLS is especially suited for HTTP, since it can provide some protection even if only one side of the communication is authenticated.
> This is the case with HTTP transactions over the Internet, where typically only the server is authenticated (by the client examining the server's certificate).

---

## 도입

HTTPS 사이트에 접속할 때 — 브라우저는 서버의 인증서를 검증합니다. 그런데 서버는 클라이언트(우리)의 신원을 어떻게 검증할까요? 사실 — 보통 검증하지 않습니다. 웹의 TLS 인증은 한쪽만(서버) 수행되며, 사용자 인증은 그 위 애플리케이션 레벨(로그인)에서 처리됩니다. 이 비대칭이 자연스러운 이유가 있습니다.

---

## 본문

> SSL/TLS is especially suited for HTTP, since it can provide some protection even if only one side of the communication is authenticated.

SSL/TLS는 HTTP에 특히 적합한데, 통신의 한쪽만 인증되어도 어느 정도 보호를 제공할 수 있기 때문이다.

- **especially suited for HTTP**: HTTP에 특히 적합. SSL/TLS의 한쪽 인증 모델이 HTTP의 사용 패턴과 맞음.
- **only one side of the communication is authenticated**: 한쪽만 인증. 양쪽 모두 인증할 수도 있지만 한쪽만으로도 의미 있는 보안 가능.
- **some protection**: 어느 정도 보호. 완벽하진 않아도 충분한 보안.

> This is the case with HTTP transactions over the Internet,

이는 인터넷에서의 HTTP 트랜잭션에서 그렇다.

- **HTTP transactions over the Internet**: 인터넷의 일반 HTTP 트랜잭션. 일반 웹사이트 접속.

> where typically only the server is authenticated (by the client examining the server's certificate).

여기서는 보통 서버만 인증된다(클라이언트가 서버의 인증서를 검사함으로써).

- **typically only the server**: 보통 서버만. 클라이언트(브라우저)는 자기 신원을 TLS 레벨에서 증명하지 않음.
- **client examining the server's certificate**: 클라이언트가 서버 인증서를 검사. 이 일방향 검증이 표준 모델.

---

## 종합

웹 HTTPS의 인증 모델:

| 주체 | 인증되는가 | 어떻게 |
|---|---|---|
| 서버 | ○ TLS 레벨 인증 | CA가 서명한 인증서 제시 |
| 클라이언트 (브라우저) | × TLS 레벨 인증 안 함 | — |
| 사용자 | △ 애플리케이션 레벨 | 로그인 (ID/PW, OAuth, JWT) |

왜 서버만 인증하는가:

**확장성 측면**: 수십억 명의 웹 사용자가 모두 자기 인증서를 가지고 있다고 상상해보세요. CA가 모든 사용자에게 인증서를 발급하고, 갱신하고, 폐기 관리하는 비용은 비현실적입니다. 사용자 인증은 사이트별로 ID/PW나 OAuth로 처리하는 게 훨씬 실용적.

**보안 모델 측면**: 사용자가 정말 보호받고 싶은 건 "내가 진짜 내 은행에 접속했나?" — 이게 서버 인증입니다. "은행이 진짜 나인지 알고 싶은가?"는 — 은행이 ID/PW나 OTP로 직접 확인합니다. TLS가 이 둘을 모두 책임질 필요가 없죠.

**프라이버시 측면**: 사용자에게 TLS 클라이언트 인증서가 있으면, 그 사용자는 어느 사이트에 접속하든 같은 인증서를 제시 — 여러 사이트가 한 사용자를 추적하기 쉬워집니다. ID/PW는 사이트별로 다르므로 추적 가능성이 낮음.

**한쪽 인증만으로도 보안이 의미 있는 이유**:

```
시나리오: 사용자 → 은행 사이트

서버만 인증되면:
1. 사용자는 진짜 은행에 접속한 게 확실 (인증서 검증)
2. 통신이 암호화되어 도청·변조 불가
3. 그러므로 사용자가 ID/PW를 보낼 때 진짜 은행에 안전하게 도달
4. 은행이 ID/PW로 사용자 검증 → 보안 완성

클라이언트도 TLS 레벨에서 인증하면 (mTLS):
- 추가 보안이지만, ID/PW로도 충분히 사용자 인증됨
- 추가 인증서 관리 부담만 큼
```

언제 mTLS(상호 인증)를 쓰는가 — Official Annotation 영역:

- **마이크로서비스 간 통신**: 백엔드 서비스 A와 B가 서로 통신할 때. ID/PW 같은 사용자 인증 없이 서비스끼리 인증.
- **VPN, 기업 내부 시스템**: 회사 직원만 접근 가능한 시스템. 직원에게 클라이언트 인증서 발급.
- **금융권 API**: 매우 높은 보안이 필요한 B2B API.
- **IoT 기기**: 사용자 인증이 적합하지 않은 자동화 환경.

JS 개발자가 만지는 부분:

```js
// 일반 웹 — 서버 인증만, 사용자는 ID/PW로 로그인
await fetch('https://api.example.com/login', {
  method: 'POST',
  body: JSON.stringify({ id, password })
});
// TLS는 브라우저 자동 처리. 사용자 인증은 서버가 ID/PW 검증

// mTLS — 브라우저에서는 거의 못 보지만, 사내 도구에서 가끔 등장
// 클라이언트 인증서를 OS에 설치하면 브라우저가 자동으로 제시
```

이게 없으면 어떻게 되는가:

- 만약 양쪽 인증을 강제했다면 — 모든 웹 사용자가 클라이언트 인증서를 가져야 함. CA의 발급·관리 부담, 사용자의 인증서 보관 부담, 디바이스 변경 시 마이그레이션 등 — 비현실적. HTTPS 보급이 훨씬 늦어졌을 것.
- 서버 인증만으로 부족한 경우 — 마이크로서비스, 금융 API 등에선 mTLS로 보강. 도구가 다양해 선택 가능.

오개념 예방: "TLS 클라이언트 인증서 = 사용자 로그인"이 아닙니다. 클라이언트 인증서는 디바이스/계정 단위의 강한 인증이지만 — 사용자는 보통 ID/PW + (옵션) 2FA로 인증. 둘은 다른 계층입니다. 클라이언트 인증서만으로 모바일 앱 로그인을 처리하면 디바이스 변경 시 매우 불편(인증서 마이그레이션 필요).

또 다른 오개념: "HTTPS는 사용자 신원도 검증해준다"는 잘못입니다. HTTPS는 서버 신원만 검증 — 사용자 신원은 애플리케이션이 알아서 할 일. 사용자 인증을 HTTPS에 의존하면 보안이 무너집니다.

Official Annotation 보충: 클라이언트 인증서는 웹서버 접근을 인증된 사용자로 제한할 때 사용됩니다. 사이트 관리자가 각 사용자에게 인증서를 만들고 사용자가 브라우저에 로드합니다. 인증서엔 보통 사용자 이름과 이메일이 담겨 있고, 매 연결마다 서버가 자동 검증해 사용자 신원을 — 패스워드 없이도 — 확인할 수 있습니다.

AI Annotation 보충: 웹에서는 서버만 인증됩니다 — 브라우저가 서버의 인증서를 검사하여 신원을 확인합니다. 클라이언트(사용자)의 신원은 TLS 레벨이 아닌 애플리케이션 레벨(로그인, JWT 등)에서 처리합니다. 다만 mutual TLS(mTLS)도 가능하며, 마이크로서비스 간 통신에서 널리 쓰입니다.

---

# 사용자가 HTTPS 연결을 신뢰할 수 있으려면 어떤 전제조건이 충족되어야 하는가?

> Web browsers know how to trust HTTPS websites based on certificate authorities that come pre-installed in their software.
> Certificate authorities are in this way being trusted by web browser creators to provide valid certificates.
> Therefore, a user should trust an HTTPS connection to a website if and only if all of the following are true:
> The user trusts that their device, hosting the browser and the method to get the browser itself, is not compromised (i.e. there is no supply chain attack).
> The user trusts that the browser software correctly implements HTTPS with correctly pre-installed certificate authorities.
> The user trusts the certificate authority to vouch only for legitimate websites (i.e. the certificate authority is not compromised and there is no mis-issuance of certificates).
> The website provides a valid certificate, which means it was signed by a trusted authority.
> The certificate correctly identifies the website (e.g., when the browser visits "https://example.com", the received certificate is properly for "example.com" and not some other entity).
> The user trusts that the protocol's encryption layer (SSL/TLS) is sufficiently secure against eavesdroppers.

---

## 도입

"HTTPS 자물쇠가 보이니까 안전하다"는 단순한 결론에는 사실 6가지 전제조건이 깔려 있습니다. 이 중 하나라도 깨지면 자물쇠가 무의미해집니다. HTTPS의 신뢰 모델이 어떤 사슬로 이어져 있는지, 그리고 어디가 약한 고리인지 보면 — 보안의 한계와 가능성이 동시에 보입니다.

---

## 본문

> Web browsers know how to trust HTTPS websites based on certificate authorities that come pre-installed in their software.

웹 브라우저는 자신의 소프트웨어에 미리 설치된 인증 기관(CA)을 기반으로 HTTPS 사이트를 신뢰하는 방법을 안다.

- **certificate authorities pre-installed**: 미리 설치된 CA. Chrome/Firefox/Safari 등에 수십~수백 개의 신뢰할 만한 CA의 루트 인증서가 내장.
- **based on**: 기반으로. CA를 신뢰의 출발점으로 삼음.

> Certificate authorities are in this way being trusted by web browser creators to provide valid certificates.

이런 식으로 인증 기관은 브라우저 제작자에 의해 유효한 인증서를 제공하리라 신뢰된다.

- **trusted by web browser creators**: 브라우저 제작자에 의해 신뢰됨. Google, Mozilla, Apple 등이 어떤 CA를 신뢰할지 결정.
- **provide valid certificates**: 유효한 인증서 제공. CA가 제대로 검증 후 발급할 것이라는 신뢰.

> Therefore, a user should trust an HTTPS connection to a website if and only if all of the following are true:

따라서 사용자는 다음 모든 조건이 참일 때에 한해 웹사이트와의 HTTPS 연결을 신뢰해야 한다.

- **if and only if**: 필요충분조건. 6가지가 모두 참이어야 비로소 신뢰 가능.

> The user trusts that their device, hosting the browser and the method to get the browser itself, is not compromised (i.e. there is no supply chain attack).

사용자가 자신의 기기와 브라우저 자체가 손상되지 않았다고 신뢰한다(즉, 공급망 공격이 없다).

- **device is not compromised**: 기기가 손상 안 됨. 멀웨어, 루트킷이 없는 상태.
- **method to get the browser**: 브라우저를 얻은 방법. Chrome 공식 사이트에서 받았는지, 변조된 설치 파일을 받았는지.
- **supply chain attack**: 공급망 공격. 정상 제품을 받은 줄 알았는데 중간에 변조된 경우.

> The user trusts that the browser software correctly implements HTTPS with correctly pre-installed certificate authorities.

사용자가 브라우저 소프트웨어가 올바르게 HTTPS를 구현하고 올바른 CA를 미리 설치했다고 신뢰한다.

- **correctly implements HTTPS**: HTTPS를 정확히 구현. 인증서 검증 로직, 암호 알고리즘에 버그가 없어야 함.
- **correctly pre-installed CAs**: 올바른 CA들. 악성 CA가 신뢰 목록에 추가되지 않아야 함.

> The user trusts the certificate authority to vouch only for legitimate websites

사용자가 CA가 정당한 사이트에 대해서만 보증한다고 신뢰한다.

- **vouch only for legitimate websites**: 정당한 사이트에만 보증. CA가 가짜 사이트에 인증서 발급하지 않아야 함.

> (i.e. the certificate authority is not compromised and there is no mis-issuance of certificates).

(즉, CA가 손상되지 않았고 인증서 오발급이 없다.)

- **CA is not compromised**: CA 자체가 해킹당하지 않음. 비밀키 유출 없음.
- **mis-issuance**: 오발급. 검증 절차 실수로 부적절한 인증서 발급.

> The website provides a valid certificate, which means it was signed by a trusted authority.

웹사이트가 유효한 인증서를 제공한다, 즉 신뢰할 수 있는 기관에 의해 서명된 인증서.

- **valid certificate**: 유효한 인증서. 만료 안 됨, 폐기 안 됨, 신뢰 CA가 서명.
- **signed by a trusted authority**: 신뢰 CA가 서명. 자체 서명(self-signed)은 일반 브라우저에서 경고.

> The certificate correctly identifies the website (e.g., when the browser visits "https://example.com", the received certificate is properly for "example.com" and not some other entity).

인증서가 사이트를 정확히 식별한다(예: 브라우저가 https://example.com에 접속할 때 받은 인증서가 example.com에 대한 것이지 다른 어떤 것이 아니다).

- **correctly identifies**: 정확히 식별. 인증서의 도메인(SAN, Subject Alternative Name)과 접속한 도메인이 일치.

> The user trusts that the protocol's encryption layer (SSL/TLS) is sufficiently secure against eavesdroppers.

사용자가 프로토콜의 암호화 계층(SSL/TLS)이 도청자에 대해 충분히 안전하다고 신뢰한다.

- **sufficiently secure against eavesdroppers**: 도청자에 대해 충분히 안전. 사용 중인 TLS 버전과 cipher suite가 깨지지 않은 것.

---

## 종합

HTTPS 신뢰 사슬을 단계별로:

| 단계 | 신뢰 대상 | 깨졌을 때 위험 | 실제 사례 |
|---|---|---|---|
| 1. 기기 | 내 PC/스마트폰 | 키로거가 비밀번호 탈취 | 멀웨어 감염 |
| 2. 브라우저 | Chrome/Firefox 구현 | 인증서 검증 우회 가능 | 브라우저 보안 버그 |
| 3. CA | 인증 기관의 무결성 | 가짜 인증서 발급 | DigiNotar 해킹(2011) |
| 4. 인증서 발급 | 사이트의 인증서 | 만료·폐기된 인증서 | 인증서 갱신 누락 |
| 5. 도메인 일치 | 인증서가 그 사이트의 것인가 | 다른 사이트 인증서로 위장 | SAN 잘못 설정 |
| 6. TLS 버전·암호 | 암호 알고리즘의 강도 | 도청 가능 | TLS 1.0/1.1 취약점, RC4 |

JS 개발자에게 와닿는 사례:

```
브라우저가 자물쇠 표시 → 6가지 조건 모두 통과 추정

1. 자기 기기는 사용자가 책임 (안티바이러스, 출처 확인)
2. 브라우저 보안은 자동 업데이트로 유지 (Chrome 자동 업데이트)
3. CA 신뢰는 브라우저 벤더가 관리 (CA 사고 시 신뢰 목록에서 제거)
4. 인증서 유효성은 브라우저가 매번 검증
5. 도메인 일치는 브라우저가 자동 확인 (안 맞으면 NET::ERR_CERT_COMMON_NAME_INVALID)
6. TLS 1.0/1.1은 2020년부터 거부 — 1.2 이상만 허용
```

**약한 고리들 — 깨졌던 사례:**

**3. CA 손상**: 2011년 DigiNotar 사건. 네덜란드 CA 한 곳이 해킹돼 가짜 google.com 인증서가 발급. 이란 사용자들이 가짜 Google에 접속해 패스워드 탈취당함. 이후 모든 브라우저가 DigiNotar를 신뢰 목록에서 즉시 제거 → DigiNotar는 파산.

**6. 약한 암호**: 2014년 POODLE 공격. SSL 3.0의 패딩 처리 버그로 암호화된 쿠키 해독 가능. 이후 SSL 3.0 지원이 빠르게 제거.

**1. 기기 손상**: 멀웨어가 OS 신뢰 저장소에 자기 CA를 추가하면 — 그 CA로 서명한 가짜 사이트가 정상으로 보임. 회사에서 직원 기기에 자체 CA를 설치해 HTTPS 트래픽 검사하는 케이스도 같은 원리.

이게 없으면 어떻게 되는가:

- 6가지 조건이 명확하지 않다면 — "HTTPS면 안전"이라는 단순한 인식만 있어 어떤 부분이 깨졌을 때 어떻게 대응해야 하는지 모름. 각 조건을 알면 보안 사고 시 정확히 어디를 점검할지 알 수 있음.

오개념 예방: 자물쇠 표시는 "이 사이트의 신원이 검증됐다"는 의미일 뿐 — "이 사이트가 사기 사이트가 아니다"라는 보장은 아닙니다. 피싱 사이트도 자기 도메인에 대한 정상 인증서를 받을 수 있습니다(`fake-bank.com`을 등록하고 인증서 발급). 자물쇠는 "내가 통신하는 상대가 진짜 fake-bank.com이다"를 증명할 뿐, 그 사이트의 의도는 보장 안 함.

또 다른 오개념: "EV(Extended Validation) 인증서가 있으면 더 안전"이라는 인식 — 과거엔 브라우저가 EV 인증서 사이트의 회사명을 주소창에 표시했지만 — 사용자가 이를 인지·활용하지 않는다는 연구 결과로 — Chrome/Firefox는 EV 표시를 제거(2019). 현재는 EV와 DV의 보안 차이가 시각적으로 거의 없음.

AI Annotation 보충: 신뢰 체인 — 기기 무결성 → 브라우저 구현 → CA 신뢰 → 인증서 유효성 → 도메인 일치 → TLS 강도. 이 중 하나라도 깨지면 HTTPS 연결 전체의 신뢰가 무너집니다. 실제 사례 — 2011년 DigiNotar CA가 해킹당해 가짜 google.com 인증서가 발급된 사건이 조건 3(CA 신뢰)이 깨진 케이스.

---

# HTTPS가 공용 와이파이 같은 안전하지 않은 네트워크에서 특히 중요한 이유는?

> HTTPS is especially important over insecure networks and networks that may be subject to tampering.
> Insecure networks, such as public Wi-Fi access points, allow anyone on the same local network to packet-sniff and discover sensitive information not protected by HTTPS.
> Additionally, some free-to-use and paid WLAN networks have been observed tampering with webpages by engaging in packet injection in order to serve their own ads on other websites.
> This practice can be exploited maliciously in many ways, such as by injecting malware onto webpages and stealing users' private information.

---

## 도입

카페·공항·호텔의 무료 와이파이를 한 번도 쓰지 않은 사람은 거의 없을 겁니다. 같은 와이파이에 접속한 사람이 누군지도 모르는 채로요. HTTP 평문 사이트를 그 와이파이에서 쓴다면 — 누구나 패킷 스니퍼로 우리의 비밀번호와 세션을 가로챌 수 있습니다. HTTPS가 이런 상황에서 특히 중요한 이유를 짚습니다.

---

## 본문

> HTTPS is especially important over insecure networks and networks that may be subject to tampering.

HTTPS는 안전하지 않은 네트워크와 변조 대상이 될 수 있는 네트워크에서 특히 중요하다.

- **insecure networks**: 안전하지 않은 네트워크. 공용 와이파이, 공유 LAN 등.
- **subject to tampering**: 변조 대상. 누가 트래픽을 가로채 변경할 수 있는 환경.

> Insecure networks, such as public Wi-Fi access points, allow anyone on the same local network to packet-sniff

공용 와이파이 같은 안전하지 않은 네트워크는 같은 로컬 네트워크 상의 누구든 패킷 스니핑을 할 수 있게 한다.

- **public Wi-Fi access points**: 공용 와이파이. 카페·공항·호텔의 무료 와이파이.
- **anyone on the same local network**: 같은 네트워크의 누구든. 같은 와이파이에 접속한 모든 사람이 잠재적 도청자.
- **packet-sniff**: 패킷 스니핑. Wireshark 같은 도구로 네트워크 트래픽을 들여다보기.

> and discover sensitive information not protected by HTTPS.

그리고 HTTPS로 보호되지 않은 민감 정보를 발견할 수 있게 한다.

- **sensitive information**: 민감 정보. 비밀번호, 세션 쿠키, 개인 메시지 등.
- **not protected by HTTPS**: HTTPS로 보호 안 됨. 즉 평문 HTTP. 누구나 읽을 수 있음.

> Additionally, some free-to-use and paid WLAN networks have been observed tampering with webpages by engaging in packet injection

게다가 일부 무료·유료 WLAN 네트워크가 패킷 인젝션을 통해 웹페이지를 변조하는 것이 관찰됐다.

- **free-to-use and paid WLAN networks**: 무료뿐 아니라 유료 WLAN도. 돈 내고 쓰는 네트워크조차 신뢰할 수 없을 수 있음.
- **packet injection**: 패킷 인젝션. 정상 트래픽 사이에 자기 패킷을 끼워 넣음.
- **tampering with webpages**: 웹페이지 변조. 서버가 보낸 페이지에 변경을 가함.

> in order to serve their own ads on other websites.

다른 웹사이트에 자신들의 광고를 표시하기 위해.

- **serve their own ads**: 자기 광고 표시. 사용자가 보는 페이지에 네트워크 운영자의 광고를 강제 삽입.
- **on other websites**: 다른 웹사이트에. 광고를 자기 사이트가 아닌 사용자가 방문 중인 사이트에.

> This practice can be exploited maliciously in many ways, such as by injecting malware onto webpages and stealing users' private information.

이 관행은 다양하게 악의적으로 악용될 수 있다 — 웹페이지에 멀웨어를 주입하거나 사용자의 개인 정보를 훔치는 식으로.

- **exploited maliciously**: 악의적으로 악용. 광고 삽입은 비교적 약한 사례, 더 위험한 것들이 있음.
- **injecting malware**: 멀웨어 주입. 페이지에 악성 JS를 삽입해 사용자 기기 감염.
- **stealing users' private information**: 개인정보 탈취. 폼 입력 가로채기, 세션 토큰 절도 등.

---

## 종합

공용 와이파이 환경의 위협 시나리오:

| 공격 유형 | 평문 HTTP에서 가능한가 | HTTPS면 막히는가 |
|---|---|---|
| 비밀번호 도청 | ○ 패킷 스니퍼로 즉시 | ○ 암호화로 차단 |
| 세션 쿠키 탈취 | ○ Set-Cookie 헤더 가로채기 | ○ 암호화로 차단 |
| 광고 삽입 | ○ 응답 본문에 광고 코드 추가 | ○ 변조 시 MAC 검증 실패 |
| 멀웨어 주입 | ○ JS 페이로드 삽입 | ○ 무결성 검증으로 차단 |
| DNS 변조 (피싱) | ○ DNS 응답 위조 | △ HTTPS는 도메인 일치 검증으로 일부 방어 |
| 트래픽 메타데이터 분석 | ○ 어디 접속하는지 보임 | × 도메인은 SNI에서 노출 |

JS 개발자에게 와닿는 사례:

```js
// 평문 HTTP에서 로그인 폼 제출
await fetch('http://example.com/login', {                     // 평문!
  method: 'POST',
  body: 'id=alice&password=secret123'
});

// 같은 와이파이의 누군가가 Wireshark로 보면:
//   POST /login HTTP/1.1
//   Host: example.com
//   ...
//   id=alice&password=secret123    ← 그대로 보임
```

```js
// HTTPS에서 같은 요청
await fetch('https://example.com/login', {
  method: 'POST',
  body: 'id=alice&password=secret123'
});

// 같은 와이파이의 누군가가 Wireshark로 보면:
//   알 수 없는 암호화된 바이트 덩어리
//   (도메인 example.com만 SNI에서 보임 — 비밀번호 노출 X)
```

**실제 사례들**:

- **광고 인젝션**: 미국의 일부 ISP가 평문 HTTP 페이지에 자기 광고를 삽입한 사례. AT&T가 공항 와이파이에서 이를 시행해 논란.
- **세션 하이재킹**: Firesheep(2010)이라는 Firefox 확장이 유명. 같은 와이파이의 페이스북·트위터 등 평문 사이트의 세션을 한 번 클릭으로 탈취 가능. 이 사건이 주요 사이트들의 HTTPS 전환을 가속.
- **HSTS preload**: Chrome이 주요 사이트(google.com, facebook.com 등)를 미리 HTTPS 전용으로 설정. 사용자가 `http://google.com`을 입력해도 자동으로 HTTPS로.

이게 없으면 어떻게 되는가:

- 공용 와이파이에서 HTTPS가 없다면 — 카페에서 페이스북 로그인하다 같은 카페에 있는 사람에게 계정 탈취. 호텔 와이파이에서 회사 메일 접속하다 회사 기밀 노출. 공용 환경에서 인터넷 사용이 사실상 불가능.
- HTTPS만으로도 메타데이터(어느 사이트 접속 중인지)는 노출되므로 — 완전한 익명성·프라이버시는 VPN, Tor 등 추가 도구 필요.

오개념 예방: "유료 와이파이는 안전하다"는 잘못된 직관. Official Answer가 명시하듯 — "free-to-use and paid WLAN networks have been observed tampering". 돈 내고 쓰는 네트워크도 광고 인젝션이나 트래픽 변조를 한 사례가 있습니다. 비용과 보안은 무관합니다.

또 다른 오해: "와이파이 비밀번호가 있으면 안전하다"는 것도 부분적으로만 맞습니다. WPA2/3 비밀번호는 외부에서 와이파이 접속을 막을 뿐 — 일단 같은 와이파이에 접속한 사람들끼리는 서로의 트래픽을 볼 수 있습니다 (특히 옛 WPA2 환경). 비밀번호의 역할은 "외부인 차단"이지 "내부 도청 방지"가 아닙니다.

AI Annotation 보충: 공용 와이파이에서 HTTP 사이트에 로그인하면 비밀번호가 평문으로 날아갑니다. 패킷 인젝션은 광고 삽입뿐 아니라 멀웨어 주입까지 가능하게 만듭니다 — HTTPS면 변조를 감지하여 차단합니다.

---

# HTTPS가 보안 외에 성능에도 영향을 미치는 이유는?

> Deploying HTTPS also allows the use of HTTP/2 and HTTP/3 (and their predecessors SPDY and QUIC), which are new HTTP versions designed to reduce page load times, size, and latency.

---

## 도입

HTTPS는 보안의 영역으로 시작했지만 — 실제로는 성능에도 큰 영향을 줍니다. 브라우저들이 HTTP/2와 HTTP/3를 HTTPS 위에서만 지원하기로 결정했기 때문입니다. 즉, 사이트가 멀티플렉싱·헤더 압축·서버 푸시 같은 새 성능 기능을 쓰려면 — HTTPS는 사실상 필수 조건이 됐습니다.

---

## 본문

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

## 종합

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

---

# HSTS(HTTP Strict Transport Security)란 무엇이며, 어떤 공격을 방어하는가?

> It is recommended to use HTTP Strict Transport Security (HSTS) with HTTPS to protect users from man-in-the-middle attacks, especially SSL stripping.

---

## 도입

브라우저 주소창에 `example.com`만 입력하면 — 보통 브라우저는 먼저 `http://example.com`으로 시도합니다. 서버가 `https://`로 리다이렉트해주면 그제야 HTTPS로 갑니다. 이 짧은 사이에 공격자가 끼어들면 — 사용자가 영원히 HTTP에서 빠져나오지 못하게 만들 수 있습니다. HSTS는 이 틈을 막습니다.

---

## 본문

> It is recommended to use HTTP Strict Transport Security (HSTS) with HTTPS

HTTPS와 함께 HSTS(HTTP Strict Transport Security)를 사용하는 것이 권장된다.

- **HTTP Strict Transport Security (HSTS)**: HTTP 엄격 전송 보안. "이 사이트는 HTTPS로만 접속하라"는 강제 규칙을 브라우저에 알리는 메커니즘.
- **with HTTPS**: HTTPS와 함께. HSTS 자체는 HTTPS의 보완으로, HTTPS 없이는 의미 없음.

> to protect users from man-in-the-middle attacks, especially SSL stripping.

man-in-the-middle 공격, 특히 SSL stripping으로부터 사용자를 보호하기 위해서다.

- **MITM attacks**: 통신 중간에 공격자가 끼어드는 공격.
- **SSL stripping**: SSL 제거. 사용자가 HTTPS로 가려는 시도를 공격자가 가로채 HTTP로 강등시키는 공격.

---

## 종합

SSL stripping 공격의 흐름:

```
정상 흐름:
  사용자: example.com 입력
  브라우저: http://example.com 으로 시도 (기본)
  서버: 301 Redirect → https://example.com
  브라우저: https://example.com 으로 재접속
  → 안전한 HTTPS 통신

SSL stripping 공격:
  사용자: example.com 입력
  브라우저: http://example.com 으로 시도
  공격자(MITM): 요청 가로채기
    공격자 → 진짜 서버: https://example.com 으로 접속 (자기는 HTTPS 사용)
    공격자 → 사용자: 모든 응답을 HTTP로 보냄 (https → http로 변환)
  사용자는 HTTP로 통신 중이라는 사실을 모름
    (Official Annotation 인용: "they get to a secure site by clicking on a link,
     and thus are fooled into thinking that they are using HTTPS when in fact they are using HTTP")
  → 공격자가 모든 평문 트래픽을 가로챔
```

HSTS가 어떻게 막는가:

```
첫 방문 시:
  서버 응답에 헤더 포함:
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
                                    └─ 1년간 유효
  
  브라우저: "이 사이트는 앞으로 1년간 HTTPS로만 접속한다"고 기록

두 번째 방문 (HSTS 정책 활성):
  사용자: example.com 입력
  브라우저: HTTPS 정책이 있는지 확인
  → 있음! 즉시 https://example.com 으로 시도 (HTTP 시도조차 안 함)
  
  공격자가 SSL stripping 시도해도:
  → 브라우저가 HTTP 응답 자체를 거부
  → 사용자는 사이트 접속 실패를 보지만 공격자에게 정보 노출은 없음
```

HSTS 헤더의 옵션들:

| 옵션 | 의미 | 예 |
|---|---|---|
| `max-age=N` | N초간 정책 유지 | `max-age=31536000` (1년) |
| `includeSubDomains` | 서브도메인까지 적용 | `*.example.com` 모두 HTTPS 강제 |
| `preload` | 브라우저 preload 목록에 등록 신청 | 첫 방문 전부터 HTTPS 강제 가능 |

**HSTS preload 목록**

`preload` 옵션을 사용하면 — Chrome/Firefox 등이 관리하는 미리 로드된 HSTS 사이트 목록에 추가 신청 가능. 이 목록에 포함된 사이트는 — 사용자가 한 번도 방문 안 한 첫 방문에서도 — 브라우저가 HTTPS로만 접속. SSL stripping 공격이 첫 방문에서도 불가능.

google.com, facebook.com, github.com 같은 주요 사이트가 모두 preload 목록에 있습니다.

JS 개발자에게 와닿는 사례:

```js
// HSTS가 활성된 사이트로 fetch
await fetch('http://github.com/api');         // HTTP로 시도
// 브라우저: HSTS 정책 확인 → 자동으로 https://github.com/api 로 전환
// 또는 HTTP 요청 자체를 차단하고 에러 반환

// 첫 방문에서도 HSTS preload 목록에 있으면 HTTP 시도 자체를 안 함
```

서버에서 HSTS 헤더 설정 (Express 예):

```js
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  next();
});
```

이게 없으면 어떻게 되는가:

- HSTS가 없다면 — 사용자가 처음 사이트에 접속할 때마다 HTTP로 시도하는 짧은 창이 열려 있어 SSL stripping이 가능. Firesheep(2010) 같은 도구가 카페에서 손쉽게 세션 탈취.
- HSTS가 있어도 첫 방문은 보호 안 됨(서버에 도달해 헤더를 받아야 정책 활성화). 이를 메우는 게 HSTS preload — 브라우저에 미리 정책을 박아둠.

오개념 예방: HSTS는 SSL stripping의 모든 형태를 막지는 못합니다. 첫 방문(preload 없는 경우)에서는 여전히 취약. 그래서 주요 사이트는 preload 목록에 등재 신청을 합니다. 또한 HSTS 정책이 만료되면(max-age 지나면) 다시 첫 방문 상태로 돌아가므로 — 충분히 긴 max-age(보통 1년) 권장.

또 다른 오해: HSTS가 만능이 아니라는 점. HSTS는 "사용자 → 사이트" 방향에서 HTTP를 강제로 HTTPS로 만드는 것 — 이미 HTTPS인 통신의 보안을 강화하지는 않습니다. TLS 자체의 보안(인증서 검증, cipher suite 등)은 별개로 신경 써야 합니다.

Official Annotation 보충: SSL stripping 공격은 https 링크를 http 링크로 바꿔치기해서 HTTPS의 보안을 무력화시키는 공격입니다. "few Internet users actually type 'https' into their browser interface" — 대부분 사용자가 https를 직접 입력하지 않고 링크를 클릭해 사이트에 도달하기 때문에 — HTTPS를 사용 중이라고 착각하지만 실제로는 HTTP를 쓰는 상황이 만들어집니다. 공격자는 클라이언트와 평문으로 통신하면서 자신이 진짜 서버처럼 동작합니다.

AI Annotation 보충: SSL stripping은 공격자가 클라이언트와 서버 사이에서 HTTPS 링크를 HTTP로 바꿔치기하는 공격입니다. 사용자는 HTTP로 접속하고 있다는 사실을 모른 채 평문으로 통신하게 됩니다. HSTS는 서버가 브라우저에 "이 사이트는 앞으로 HTTPS로만 접속하라"고 알려주는 메커니즘입니다. 한 번 설정되면 브라우저가 HTTP 접속 자체를 거부하므로 SSL stripping이 불가능해집니다.

```
       [SSL Stripping vs HSTS]

   <SSL Stripping 공격 -- HSTS 없음>

   사용자          공격자(MITM)         진짜 서버
     |                |                    |
     | example.com 입력                    |
     |                |                    |
     | HTTP로 시도 (브라우저 기본)         |
     |--------------->|                    |
     |                | HTTPS로 진짜 서버에 접속
     |                |------------------->|
     |                |<-------------------|
     |                | (서버는 HTTPS 정상)
     |                |
     |                | 모든 응답을 HTTP로 변환
     |                | (https:// 링크 -> http:// 로 바꿔치기)
     |<---------------|
     |
     | 사용자: 평문 HTTP인 줄 모르고 ID/PW 입력
     | 공격자가 모든 데이터 평문으로 가로챔


   <HSTS 적용 -- 첫 방문 후>

   첫 방문 시 서버 응답 헤더:
     Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
                                      |
                                      v
                          브라우저: "이 도메인은 1년간 HTTPS만"
                                    정책 저장

   두 번째 방문:

   사용자          브라우저            공격자          진짜 서버
     |               |                   |               |
     | example.com   |                   |               |
     |-------------->|                   |               |
     |               | HSTS 정책 확인    |               |
     |               | -> HTTPS만 허용   |               |
     |               |                   |               |
     |               | HTTPS로 직접 시도                 |
     |               |---------(TLS handshake)---------->|
     |               |                                   |
     |               | 공격자가 SSL stripping 시도해도   |
     |               | 브라우저가 HTTP 응답 자체를 거부  |
     |               |                                   |
     | 안전한 HTTPS 통신 성립                            |

   첫 방문 보호: HSTS preload 목록 등재
   (브라우저에 정책을 미리 박아둠)
```

---

# TLS가 데이터를 암호화하는 과정에서 장기 키와 세션 키의 역할은?

> The security of HTTPS is that of the underlying TLS, which typically uses long-term public and private keys to generate a short-term session key, which is then used to encrypt the data flow between the client and the server.
> X.509 certificates are used to authenticate the server (and sometimes the client as well).

---

## 도입

암호 알고리즘에는 두 종류가 있습니다 — 비대칭 키(공개키/비밀키, 안전하지만 느림)와 대칭 키(빠르지만 키 교환이 어려움). TLS는 둘의 장점을 결합하는 하이브리드 방식을 씁니다 — 비대칭으로 한 번만 안전하게 키 교환하고, 이후 데이터는 빠른 대칭키로 암호화. 이게 장기 키와 세션 키의 역할 분담입니다.

---

## 본문

> The security of HTTPS is that of the underlying TLS,

HTTPS의 보안은 그 기반인 TLS의 보안에 달려 있다.

- **security of HTTPS is that of TLS**: HTTPS가 안전하다 = TLS가 안전하다. HTTPS는 TLS에 보안을 위임하는 형태.

> which typically uses long-term public and private keys to generate a short-term session key,

TLS는 보통 장기 공개·비밀 키 쌍을 사용해 단기 세션 키를 생성한다.

- **long-term public and private keys**: 장기 공개·비밀 키. 비대칭 암호. 보통 RSA, ECDSA 등.
- **long-term**: 장기. 인증서의 유효기간 동안(보통 1~2년) 동일하게 사용.
- **short-term session key**: 단기 세션 키. 한 세션(연결) 동안만 유효한 일회성 키. 대칭 암호용.
- **generate**: 생성. 장기 키로 직접 데이터를 암호화하지 않고 — 일회성 키를 만드는 데만 사용.

> which is then used to encrypt the data flow between the client and the server.

이 세션 키는 클라이언트와 서버 사이의 데이터 흐름을 암호화하는 데 사용된다.

- **encrypt the data flow**: 데이터 흐름을 암호화. 실제 HTTP 메시지 본문이 이 키로 암호화.
- **between the client and the server**: 클라이언트와 서버 사이. 양방향 통신 모두.

> X.509 certificates are used to authenticate the server (and sometimes the client as well).

X.509 인증서는 서버를 인증하는 데 사용된다(때로는 클라이언트도).

- **X.509 certificates**: X.509 표준의 디지털 인증서. 공개키와 그 소유자 정보를 CA가 서명한 문서.
- **authenticate the server**: 서버 인증. 인증서를 통해 "이 공개키는 정말 example.com의 것"임을 보장.
- **sometimes the client as well**: 때로는 클라이언트도. mTLS의 경우 클라이언트도 자기 인증서로 인증.

---

## 종합

TLS의 키 분담:

| 키 종류 | 알고리즘 | 수명 | 역할 |
|---|---|---|---|
| 장기 공개키 | 비대칭 (RSA, ECDSA) | 수개월~수년 | 인증서에 담겨 서버 신원 증명 |
| 장기 비밀키 | 비대칭 | 수개월~수년 | 서버만 보관, handshake 시 서명/복호화 |
| 단기 세션 키 | 대칭 (AES, ChaCha20) | 한 세션 | 실제 데이터 암호화 |

왜 둘을 분리하는가:

```
비대칭 암호의 특징:
  - 안전하다 (공개키로 암호화한 걸 비밀키로만 풀 수 있음)
  - 매우 느리다 (RSA는 대칭 암호의 약 1000배 느림)

대칭 암호의 특징:
  - 빠르다 (AES는 하드웨어 가속까지 있음)
  - 키 교환이 어렵다 (어떻게 안전하게 같은 키를 양쪽이 가질 것인가)

TLS의 해결:
  1. 비대칭 키로 "안전하게 대칭 키를 교환" (느리지만 한 번만)
  2. 대칭 세션 키로 "빠르게 데이터 암호화" (빠르고 양은 많음)
```

TLS handshake의 흐름 (간단화):

```
1. 클라이언트 → 서버: "안녕, 나는 이런 cipher suite 지원해" (ClientHello)
2. 서버 → 클라이언트: "이 cipher suite로 가자" + 인증서(공개키 포함) 전송
3. 클라이언트: 인증서 검증 (CA 서명 확인, 도메인 일치 등)
4. 양쪽이 (Diffie-Hellman 등으로) 세션 키를 협상
   → 이 단계에서 장기 키가 사용됨 (안전한 키 교환을 위해)
5. 이후 모든 데이터: 세션 키로 대칭 암호화
   → 빠른 통신
```

JS 개발자에게 의미:

```js
await fetch('https://example.com/api');

// 보이지 않는 곳에서 일어나는 일:
// 1. TLS handshake (수십~수백 ms 소요)
//    - 인증서 검증
//    - 비대칭 키로 세션 키 협상
// 2. 세션 키로 요청 본문 암호화
// 3. 서버 응답을 세션 키로 복호화
// 4. JS 코드는 평문 응답을 받음
```

TLS 1.3에서는 handshake가 1-RTT로 단축되고, 세션 재개 시 0-RTT(데이터를 첫 패킷부터 보냄)도 가능합니다. 이 모든 게 장기 키와 세션 키의 분리 위에 만들어진 최적화.

이게 없으면 어떻게 되는가:

- 장기·세션 키 분리가 없다면 — 모든 데이터를 비대칭 키로 암호화해야 함. 너무 느려서 실시간 통신 불가능. HTTPS의 성능 부담이 막대해 보급이 어려웠을 것.
- 또는 대칭 키만 쓰면 — 키 교환 문제. 첫 통신부터 어떤 키로 암호화할지 결정 못 하므로 시작 자체가 불가능.

오개념 예방: 인증서의 공개키가 데이터 암호화에 직접 쓰이는 게 아닙니다. 공개키는 — RSA의 경우 키 교환 단계의 한 패스에 사용되거나, ECDHE 같은 현대 cipher suite에선 인증(서명 검증)에만 사용. 실제 데이터 암호화는 세션 키. 이 분리가 forward secrecy 같은 추가 보안을 가능하게 합니다.

또 다른 오개념: "TLS가 매번 전체 handshake를 한다"는 것도 잘못. TLS 1.3은 세션 재개(session resumption)를 지원해 — 짧은 시간 안에 같은 서버에 다시 접속하면 이전 세션 정보를 활용해 빠르게 재연결. 0-RTT 모드에서는 첫 데이터 패킷에 이미 암호화된 페이로드가 실림.

X.509 인증서의 구조 — 인증서엔 다음이 들어 있습니다:

```
Subject: CN=example.com (도메인)
Subject Alternative Names: example.com, www.example.com (서브도메인)
Issuer: CA의 이름
Validity: 2024-01-01 ~ 2025-01-01
Public Key: 서버의 공개키 (대칭 세션 키 협상에 사용)
Signature: CA가 위 정보 전체에 서명한 값 (위조 방지)
```

브라우저는 자물쇠 아이콘 옆에 이 정보를 보여줍니다 — 클릭해서 직접 확인 가능.

AI Annotation 보충: 비대칭 키(공개/비밀 키, 느림)로 대칭 세션 키(빠름)를 안전하게 교환하고, 이후 데이터 암호화는 세션 키로 수행하는 하이브리드 방식입니다. X.509 인증서는 서버의 공개 키가 진짜인지 CA가 보증하는 역할을 합니다.

```
              [TLS 핸드셰이크 5단계]

   클라이언트                              서버
       |                                    |
       | (1) ClientHello                    |
       |     - 지원 TLS 버전                 |
       |     - 지원 cipher suites            |
       |     - 클라이언트 난수               |
       |----------------------------------->|
       |                                    |
       |                                    | (2) ServerHello + 인증서
       |                                    |     - 선택된 cipher suite
       |                                    |     - 서버 난수
       |                                    |     - X.509 인증서 (공개키 포함)
       |<-----------------------------------|
       |                                    |
       | (3) 인증서 검증                    |
       |     - CA 서명 확인 (장기 공개키 검증) |
       |     - 도메인 일치 확인              |
       |     - 만료/폐기 확인                |
       |     -> 실패 시 연결 중단           |
       |                                    |
       | (4) 세션 키 협상                   |
       |     ECDHE: 양쪽이 일회성 키쌍 생성  |
       |     g^a, g^b 교환 -> 양쪽이 g^(ab) 계산 |
       |     서버 인증: 비밀키로 서명, 클라가 검증 |
       |<==================================>|
       |                                    |
       |    이제 양쪽이 같은 세션 키 보유   |
       |    (대칭 키, AES 등)               |
       |                                    |
       | (5) 대칭 암호화 통신               |
       |     세션 키로 HTTP 메시지 암호화   |
       |==(암호문 / AES)===================>|
       |<==(암호문 / AES)===================|
       |                                    |
       v                                    v
   세션 종료 시 일회성 키 폐기 -> Forward Secrecy
```

---

# Forward secrecy란 무엇이며, 이것이 없으면 어떤 위험이 있는가?

> An important property in this context is forward secrecy, which ensures that encrypted communications recorded in the past cannot be retrieved and decrypted should long-term secret keys or passwords be compromised in the future.
> Not all web servers provide forward secrecy.

---

## 도입

서버의 비밀키가 영원히 안전하다는 보장은 없습니다 — 5년 후, 10년 후 어느 시점엔가 유출되거나 양자컴퓨터로 해독될 수 있습니다. 그럼 과거에 가로챈 암호화 트래픽도 "지금부터" 다 풀 수 있을까요? Forward secrecy(전방 비밀성)가 있으면 — 안 됩니다. 미래 키 유출이 과거 통신에 영향 안 미치게 보호하는 메커니즘입니다.

---

## 본문

> An important property in this context is forward secrecy,

이 맥락에서 중요한 성질이 forward secrecy(전방 비밀성)다.

- **forward secrecy**: 전방 비밀성. "앞으로 키가 유출돼도 과거 통신은 안전"이라는 성질.
- **important property**: 중요한 성질. TLS 보안의 핵심 속성 중 하나.

> which ensures that encrypted communications recorded in the past cannot be retrieved and decrypted

과거에 기록된 암호화 통신이 검색되고 복호화될 수 없도록 보장한다.

- **encrypted communications recorded in the past**: 과거에 기록된 암호화 통신. 공격자가 미리 가로채 저장해둔 암호문.
- **cannot be retrieved and decrypted**: 검색·복호화 불가. 키가 유출돼도 그 키로 옛 트래픽을 못 풀어냄.

> should long-term secret keys or passwords be compromised in the future.

장기 비밀 키나 패스워드가 미래에 손상되더라도.

- **long-term secret keys**: 장기 비밀키. 서버의 인증서에 연결된 비밀키.
- **compromised in the future**: 미래에 손상. 서버 해킹, 양자컴퓨터 발전, 알고리즘 약점 발견 등.

> Not all web servers provide forward secrecy.

모든 웹서버가 forward secrecy를 제공하지는 않는다.

- **not all**: 모두는 아님. 구식 cipher suite를 쓰는 서버는 forward secrecy 없음.

---

## 종합

Forward secrecy의 핵심 시나리오:

```
2025년: 공격자가 사용자-서버 간 HTTPS 트래픽을 가로채 저장
        (암호문 상태라 당장은 못 읽음)

2030년: 공격자가 어떤 방법으로 서버 비밀키를 입수
        (해킹, 직원 매수, 양자컴퓨터 등)

forward secrecy 없으면:
  공격자가 그 비밀키로 2025년 트래픽 복호화 → 5년 전 비밀번호·메시지 모두 노출

forward secrecy 있으면:
  세션마다 새로운 일회성 키 사용 + 그 키는 어디에도 저장 안 됨
  서버 비밀키를 알아도 과거 세션 키를 역추정 불가능
  → 2025년 트래픽은 영원히 암호문으로 남음
```

Forward secrecy를 제공하는 키 교환 방식:

| 방식 | Forward Secrecy | 설명 |
|---|---|---|
| RSA Key Exchange (구식) | × | 서버 비밀키로 직접 세션 키 복호화. 비밀키 유출 시 과거 트래픽 풀림 |
| Diffie-Hellman Ephemeral (DHE) | ○ | 매번 일회성 키 쌍 생성. 비밀키와 무관 |
| Elliptic-curve Diffie-Hellman Ephemeral (ECDHE) | ○ | DHE의 ECC 버전. 더 빠르고 강력 |

Ephemeral의 의미: "일회성, 임시적". DHE/ECDHE의 "E"가 그것 — 매 세션마다 새 키 쌍을 생성하고 세션이 끝나면 폐기.

DHE/ECDHE의 동작 원리 (간단화):

```
양쪽이 비밀 난수를 각자 생성 (Alice의 a, Bob의 b)
양쪽이 (g^a mod p), (g^b mod p) 만 교환
각자 상대 값에 자기 비밀로 곱: g^(ab) — 이게 세션 키
공격자는 g^a, g^b를 봐도 g^(ab)를 못 계산 (이산 로그 문제)
세션 종료 후 a, b 폐기 → 키 영구 소실
```

세션 키가 양쪽 메모리에서만 잠깐 존재하고 디스크에 저장 안 되며, 세션 종료와 함께 소멸 — 미래에 누구도 복원 불가.

JS 개발자에게 의미:

```js
await fetch('https://example.com/api');
// TLS handshake 시 — 사용 cipher suite는 자동 협상
// 모던 환경: ECDHE-based suite (forward secrecy ○)
// 구식 환경: RSA-based suite (forward secrecy ×)
// DevTools Security 탭에서 cipher suite 확인 가능
```

Chrome DevTools에서 확인:

```
DevTools → Security 탭 (Lock 아이콘 옆) →
"Connection" 섹션에서 "Key exchange" 보기
- "ECDHE_RSA" 또는 "ECDHE_ECDSA" → forward secrecy 활성
- "RSA" → forward secrecy 없음 (취약)
```

TLS 1.3의 forward secrecy:

TLS 1.3은 forward secrecy 없는 cipher suite를 아예 표준에서 제거했습니다. 즉 — TLS 1.3을 쓰는 서버는 자동으로 forward secrecy 보장. 구식 RSA Key Exchange는 더 이상 사용 불가.

이게 없으면 어떻게 되는가:

- forward secrecy가 없다면 — 정부·기업이 모든 HTTPS 트래픽을 일단 가로채 저장해두고 — 미래에 키를 입수해 일괄 복호화 가능. 이를 "store now, decrypt later" 공격이라 함. 양자컴퓨터의 위협이 현실화되면서 더 중요해진 개념.
- 잘못된 직관: "지금 안전하면 미래에도 안전"은 forward secrecy 없는 환경에선 거짓. 비밀키 유출은 미래에 일어날 수 있는 사건이고, 한 번 유출되면 역사 전체가 노출.

오개념 예방: forward secrecy는 "지금 보내는 데이터가 안전"하다는 게 아니라 — "미래에 무슨 일이 있어도 과거 통신은 안전"하다는 보장입니다. 두 개의 다른 시간축에 대한 보호.

또 다른 오개념: "TLS 1.2도 forward secrecy 가능"은 맞지만 cipher suite 선택에 달림. ECDHE 기반을 쓰면 TLS 1.2도 forward secrecy 활성. 하지만 RSA Key Exchange를 fallback으로 두면 깨질 수 있어 — TLS 1.3이 더 안전한 이유. 구식 옵션 자체가 없음.

Official Annotation 보충: 2013년 기준 forward secrecy를 제공하는 유일한 방식은 Diffie-Hellman key exchange (DHE)와 Elliptic-curve Diffie-Hellman key exchange (ECDHE)였습니다. TLS 1.3(2018년 8월 발표)은 forward secrecy 없는 cipher들의 지원을 제거했습니다. 2023년 7월 기준 조사된 웹서버의 99.6%가 어떤 형태로든 forward secrecy를 지원하며, 75.2%가 대부분 브라우저에서 forward secrecy를 사용합니다.

AI Annotation 보충: forward secrecy가 없으면 — 공격자가 암호화된 트래픽을 녹화해두고, 나중에 서버 비밀키를 탈취하면 과거 통신을 전부 복호화할 수 있습니다. forward secrecy가 있으면 — 매 세션마다 고유한 일회성 키를 생성하므로, 장기 키가 유출되어도 과거 세션 키를 역추적할 수 없습니다. TLS 1.3은 FS 없는 cipher를 아예 제거하여, TLS 1.3을 사용하면 FS가 자동으로 보장됩니다.

```
       [Forward Secrecy 유무 -- 시계열 시나리오]

   2025년 (현재)
   ----------+---------------------------------+
             |                                 |
   사용자 <==(HTTPS 암호문)==> 서버            |
             |                                 |
             | 공격자: 트래픽을 가로채서 저장  |
             | (당장은 못 풀지만 보관)         |
             | [암호문 아카이브]               |
             |                                 |

   2030년 (5년 후)
   ----------+---------------------------------+
             |                                 |
             | 어떤 방법으로든 서버 비밀키 유출
             |   - 직원 매수
             |   - 서버 해킹
             |   - 양자컴퓨터 발전
             |                                 |
             | 공격자: 보관해둔 2025년 트래픽 + 비밀키
             |
             v
        +----------------------+----------------------+
        |                      |                      |
        | <FS 없음>            |     <FS 있음>        |
        |                      |                      |
        | 비밀키로 직접 세션키 |  세션키는 일회성     |
        | 복호화 가능          |  (DHE/ECDHE)         |
        |                      |  세션 종료 시 폐기   |
        | -> 2025년 트래픽     |  비밀키와 무관       |
        |    전부 평문으로 노출|                      |
        |                      | -> 비밀키 알아도     |
        | * 비밀번호           |    과거 g^a, g^b만   |
        | * 메시지             |    봐서는 g^(ab)     |
        | * 세션 토큰          |    계산 불가         |
        | 모두 풀림            |                      |
        |                      | -> 2025년 트래픽     |
        |                      |    영원히 암호문     |
        +----------------------+----------------------+

   TLS 1.3은 FS 없는 cipher를 아예 제거 -> 자동 보장.
```

---

# HTTPS 사이트에서 일부 콘텐츠만 HTTP로 로드되면 어떤 문제가 발생하며, 쿠키의 secure 속성은 왜 필요한가?

> For HTTPS to be effective, a site must be completely hosted over HTTPS.
> If some of the site's contents are loaded over HTTP (scripts or images, for example), or if only a certain page that contains sensitive information, such as a log-in page, is loaded over HTTPS while the rest of the site is loaded over plain HTTP, the user will be vulnerable to attacks and surveillance.
> Additionally, cookies on a site served through HTTPS must have the secure attribute enabled.
> On a site that has sensitive information on it, the user and the session will get exposed every time that site is accessed with HTTP instead of HTTPS.

---

## 도입

페이지가 HTTPS인데 그 안의 이미지 하나가 HTTP로 로드되면 — 자물쇠가 깨진 상태가 됩니다. 이를 mixed content라고 하고, 보기엔 작은 문제 같지만 보안적으로는 큰 구멍입니다. 마찬가지로 쿠키에 `Secure` 속성이 없으면 — HTTPS로 받은 세션이 HTTP 요청에 평문으로 첨부되어 노출. 이런 부분 보호의 함정들을 짚습니다.

---

## 본문

> For HTTPS to be effective, a site must be completely hosted over HTTPS.

HTTPS가 효과적이려면 사이트가 완전히 HTTPS로 호스팅되어야 한다.

- **completely hosted over HTTPS**: 완전히 HTTPS로 호스팅. 메인 페이지뿐 아니라 그 안의 모든 리소스가 HTTPS여야 함.

> If some of the site's contents are loaded over HTTP (scripts or images, for example),

사이트 콘텐츠 일부가 HTTP로 로드된다면 (예를 들어 스크립트나 이미지).

- **scripts or images**: 스크립트나 이미지. JS는 가장 위험, 이미지는 상대적으로 덜 위험하지만 그래도 문제.
- **loaded over HTTP**: HTTP로 로드. mixed content 상태.

> or if only a certain page that contains sensitive information, such as a log-in page, is loaded over HTTPS while the rest of the site is loaded over plain HTTP,

또는 로그인 페이지처럼 민감 정보가 있는 특정 페이지만 HTTPS로 로드되고 나머지 사이트는 평문 HTTP로 로드된다면.

- **only a certain page... is loaded over HTTPS**: 특정 페이지만 HTTPS. 한때 흔했던 패턴 — "로그인만 HTTPS, 나머지는 HTTP".
- **rest of the site is loaded over plain HTTP**: 나머지는 평문. 로그인 후 세션 쿠키가 평문 HTTP 요청마다 노출.

> the user will be vulnerable to attacks and surveillance.

사용자는 공격과 감시에 취약해진다.

- **vulnerable**: 취약. mixed content가 한 군데만 있어도 전체 보안이 깨짐.
- **attacks and surveillance**: 공격과 감시. 세션 탈취·도청·트래픽 분석 등.

> Additionally, cookies on a site served through HTTPS must have the secure attribute enabled.

또한 HTTPS로 제공되는 사이트의 쿠키는 `secure` 속성이 활성화되어야 한다.

- **secure attribute**: `Secure` 속성. 쿠키가 HTTPS 연결에서만 전송되도록 제한.
- **must**: 필수. HTTPS 사이트의 쿠키엔 반드시 있어야.

> On a site that has sensitive information on it, the user and the session will get exposed every time that site is accessed with HTTP instead of HTTPS.

민감 정보가 있는 사이트에서 HTTPS 대신 HTTP로 접속할 때마다 사용자와 세션이 노출된다.

- **every time**: 매번. 한 번이라도 HTTP로 접속하면 그 순간 모든 쿠키 평문 노출.
- **exposed**: 노출됨. 세션 ID 도청 → 세션 하이재킹 가능.

---

## 종합

HTTPS의 부분 보호가 만드는 두 가지 구멍:

| 구멍 | 원인 | 결과 |
|---|---|---|
| Mixed Content | HTTPS 페이지 안의 HTTP 리소스 | 스크립트 변조, 이미지 추적 |
| 평문 쿠키 | `Secure` 속성 누락 | HTTP 요청에서 세션 쿠키 평문 노출 |

**Mixed Content의 위험**

```html
<!-- HTTPS 페이지 -->
<html>
  <head>
    <script src="http://cdn.example.com/lib.js"></script>  <!-- HTTP! -->
  </head>
  <body>
    ...
  </body>
</html>
```

이 한 줄 때문에:

- 공격자가 lib.js를 변조해 악성 스크립트로 교체 가능
- 그 악성 스크립트는 HTTPS 페이지 안에서 실행되므로 — 페이지의 모든 데이터 접근 가능
- 사용자가 입력한 비밀번호, 세션 쿠키 등을 외부로 전송 가능

브라우저의 보호 — 모던 브라우저는 mixed content 중 위험한 것(스크립트, 폰트 등 active content)을 자동 차단합니다:

- **Active content** (JS, CSS, iframe, 폰트): 자동 차단 (콘솔에 에러)
- **Passive content** (이미지, 비디오): 경고만 표시, 로드는 함

DevTools Console에서 mixed content 경고:

```
Mixed Content: The page at 'https://example.com/' was loaded over HTTPS, 
but requested an insecure script 'http://cdn.example.com/lib.js'. 
This request has been blocked; the content must be served over HTTPS.
```

수정 방법:

```html
<!-- 1. 명시적 HTTPS -->
<script src="https://cdn.example.com/lib.js"></script>

<!-- 2. 프로토콜 상대 URL (현재 페이지 프로토콜 따름) -->
<script src="//cdn.example.com/lib.js"></script>

<!-- 3. 자체 도메인 사용 -->
<script src="/static/lib.js"></script>
```

CSP(Content Security Policy)로 강제:

```
Content-Security-Policy: upgrade-insecure-requests
```

이 헤더가 있으면 — HTTP 리소스를 자동으로 HTTPS로 업그레이드해 요청. mixed content 자동 방지.

**쿠키의 Secure 속성**

```
Set-Cookie: sessionId=abc123                              ← 위험! HTTP에서도 전송됨
Set-Cookie: sessionId=abc123; Secure                      ← HTTPS에서만 전송
Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict   ← 권장
```

Secure 속성이 없으면:

```
사용자가 https://example.com 에 로그인 (HTTPS로 세션 쿠키 받음)
→ 그 후 http://example.com/some-page 에 실수로 접속
→ 브라우저가 sessionId 쿠키를 HTTP 요청에 자동 첨부 (Secure 없으니까)
→ 평문으로 전송되어 도청 가능
→ 공격자가 세션 ID로 사용자 행세 (세션 하이재킹)
```

JS에서 쿠키 설정 시 (서버 측 Express 예):

```js
// 서버에서 쿠키 설정
res.cookie('sessionId', 'abc123', {
  secure: true,           // HTTPS 전용
  httpOnly: true,         // JS에서 읽기 불가 (XSS 방어)
  sameSite: 'strict'      // CSRF 방어
});
// 결과 헤더: Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict
```

이게 없으면 어떻게 되는가:

- mixed content가 허용되면 — HTTPS 페이지의 모든 보안이 가장 약한 HTTP 리소스 수준으로 떨어짐. 한 줄의 HTTP 스크립트 = HTTPS 무력화.
- Secure 쿠키 속성이 없다면 — 한 번이라도 HTTP 접속 시 세션 노출. 사용자가 부주의하게 `http://`로 접속하는 것을 막을 수 없으므로 — 쿠키 자체에 보호 장치 필요.

오개념 예방: "내 사이트는 HTTPS만 쓰니까 Secure 속성 안 붙여도 되겠지"는 잘못. 사용자가 직접 `http://`를 입력하거나, HSTS 활성화 전 첫 방문하거나, 브라우저 캐시 문제로 HTTP로 접속하는 등 — 의도치 않은 HTTP 요청이 발생할 수 있습니다. Secure 속성은 "혹시라도 HTTP로 접속하면 쿠키 안 보내겠다"는 안전장치.

또 다른 오개념: "이미지 mixed content는 안 위험하다"는 부분적으로만 맞음. 이미지 자체로 코드 실행은 안 되지만 — 공격자가 이미지를 변조해 사용자 추적 픽셀을 끼우거나, 이미지 메타데이터에 정보를 숨길 수 있음. 또한 Referer 헤더가 HTTP 요청에 노출되어 사용자가 보던 HTTPS 페이지 URL이 평문으로 도청 가능.

AI Annotation 보충: Mixed content 문제 — 스크립트가 HTTP로 로드되면 공격자가 스크립트를 변조하여 HTTPS 페이지의 데이터를 탈취할 수 있습니다. 쿠키의 `Secure` 속성이 없으면 HTTP 연결에서도 쿠키가 전송되어, HTTPS로 보호한 세션 정보가 평문으로 노출됩니다.

---

# 인증서가 만료 전에 무효화(revoke)되어야 할 때, 브라우저는 인증서의 유효 상태를 어떻게 확인하는가?

> A certificate may be revoked before it expires, for example because the secrecy of the private key has been compromised.
> The browser sends the certificate's serial number to the certificate authority or its delegate via OCSP (Online Certificate Status Protocol) and the authority responds, telling the browser whether the certificate is still valid or not.
> The CA may also issue a CRL to tell people that these certificates are revoked.
> CRLs are no longer required by the CA/Browser forum, nevertheless, they are still widely used by the CAs.

---

## 도입

인증서의 유효기간이 1년 남아있어도 — 비밀키가 유출되거나 발급 실수가 발견되면 즉시 폐기해야 합니다. 그런데 브라우저는 어떤 인증서가 폐기됐는지 어떻게 알까요? 답은 두 가지 방식 — OCSP(실시간 조회)와 CRL(폐기 목록 다운로드). 둘 다 사용되고, 각자 장단점이 있습니다.

---

## 본문

> A certificate may be revoked before it expires, for example because the secrecy of the private key has been compromised.

인증서는 만료 전에 폐기될 수 있다, 예를 들어 비밀키의 비밀성이 손상된 경우.

- **revoked before it expires**: 만료 전 폐기. 정상 만료가 아닌 강제 무효화.
- **secrecy of the private key has been compromised**: 비밀키의 비밀성 손상. 비밀키 유출.

> The browser sends the certificate's serial number to the certificate authority or its delegate via OCSP

브라우저는 인증서의 시리얼 번호를 OCSP를 통해 인증 기관이나 그 위임자에게 보낸다.

- **certificate's serial number**: 인증서의 시리얼 번호. 모든 인증서가 가진 고유 식별자.
- **OCSP (Online Certificate Status Protocol)**: 온라인 인증서 상태 프로토콜. 인증서 1건의 유효 여부를 실시간 조회하는 프로토콜.

> and the authority responds, telling the browser whether the certificate is still valid or not.

기관이 응답해 인증서가 여전히 유효한지를 브라우저에 알린다.

- **still valid or not**: 여전히 유효한지 아닌지. "valid" / "revoked" / "unknown" 셋 중 하나로 응답.

> The CA may also issue a CRL to tell people that these certificates are revoked.

CA는 이러한 인증서들이 폐기되었음을 알리기 위해 CRL을 발행할 수도 있다.

- **CRL (Certificate Revocation List)**: 인증서 폐기 목록. 폐기된 모든 인증서의 시리얼 번호 목록을 한꺼번에 담은 파일.

> CRLs are no longer required by the CA/Browser forum, nevertheless, they are still widely used by the CAs.

CRL은 더 이상 CA/Browser Forum에서 필수로 요구하지 않지만, 여전히 CA들에 의해 널리 사용된다.

- **no longer required**: 더 이상 필수 아님. 표준 요구사항에서 빠짐.
- **still widely used**: 그래도 널리 사용. OCSP에 문제가 있을 때 fallback으로 활용.

---

## 종합

OCSP와 CRL의 비교:

| 방식 | 동작 | 장점 | 단점 |
|---|---|---|---|
| OCSP | 인증서 1건씩 실시간 조회 | 즉시 반영, 가벼움 | OCSP 서버 부하·다운 시 문제, 프라이버시 (CA가 사용자 방문 사이트 알 수 있음) |
| CRL | 전체 폐기 목록 다운로드 | 한 번 받으면 오프라인 검증 | 목록 크기가 큼(MB 단위), 갱신 지연 |
| OCSP Stapling | 서버가 미리 OCSP 응답 받아 클라이언트에 전달 | OCSP의 단점(부하·프라이버시) 보완 | 서버 설정 필요 |

**OCSP의 흐름**:

```
1. 사용자가 https://example.com 접속
2. 서버가 인증서 제시 (시리얼 번호 포함)
3. 브라우저가 인증서 검증:
   - 만료 확인
   - CA 서명 확인
   - OCSP 조회: 인증서 발급한 CA의 OCSP 서버에 시리얼 번호 보냄
4. CA의 OCSP 서버가 응답:
   - "valid" → 인증서 유효
   - "revoked" → 폐기됨, 브라우저 경고 표시
   - "unknown" → 알 수 없음
```

**CRL의 흐름**:

```
1. CA가 정기적으로 CRL 발행 (예: 매일 1회)
2. 브라우저가 CRL을 다운로드 (느림 — 수MB)
3. 사이트 접속 시 — 인증서 시리얼 번호가 CRL에 있는지 검색
4. 있으면 폐기, 없으면 유효
```

**OCSP Stapling — 두 방식의 단점을 보완**:

```
일반 OCSP:
  사용자 → CA의 OCSP 서버 (CA가 사용자 방문 정보를 봄, 부하)

OCSP Stapling:
  서버가 미리 자기 인증서의 OCSP 응답을 CA로부터 받아 캐시
  → 클라이언트 접속 시 인증서 + OCSP 응답을 함께 제공 (stapled)
  → 클라이언트는 추가 조회 불필요
  → 프라이버시 ○, 성능 ○
```

JS 개발자에게 와닿는 사례:

```js
await fetch('https://example.com/api');
// 보이지 않는 곳:
// 1. 인증서 검증 (OCSP/CRL)
// 2. OCSP 응답 받는 데 수십 ms 걸릴 수 있음
// 3. OCSP Stapling 사용 시 추가 조회 없이 즉시 검증
```

DevTools에서 확인:

```
DevTools → Security 탭 → 
"View certificate" 클릭 → "Details" → "Certificate Status"
- OCSP responder URL 확인 가능
- 현재 인증서의 폐기 상태 확인 가능
```

**현실의 복잡성**:

- 많은 브라우저가 OCSP 조회 실패 시 — "soft-fail" 정책 사용. 즉 OCSP 서버가 응답 안 하면 그냥 넘어감 (보안 약화). 이는 OCSP 서버 다운으로 인터넷 마비를 막기 위한 절충.
- Chrome은 자체 폐기 목록(CRLSets)을 사용 — Google이 주요 폐기 인증서를 모아 브라우저 업데이트로 배포. 일반 OCSP/CRL을 보완.
- 짧은 유효기간 인증서 추세: Let's Encrypt는 90일 인증서 발급 — 폐기 메커니즘에 덜 의존. 어차피 곧 만료되니까. 2024~2025년 기준 47일 인증서까지 등장.

이게 없으면 어떻게 되는가:

- 폐기 메커니즘이 없다면 — 비밀키 유출된 인증서가 만료될 때까지 1년간 유효. 그동안 공격자가 가짜 사이트로 사용자 속이기 가능.
- OCSP만 있고 Stapling 없으면 — CA의 OCSP 서버가 사용자의 방문 사이트를 알 수 있어 프라이버시 침해.

오개념 예방: 폐기 검사가 100% 신뢰되지는 않습니다. soft-fail 정책 때문에 — 공격자가 OCSP 서버로의 연결을 차단하면 브라우저는 폐기 인증서를 그냥 받아들일 수 있습니다. 이를 막으려면 "OCSP Must-Staple" 확장이 인증서에 포함되어야 — 그러면 OCSP 응답 없이는 인증서를 거부.

또 다른 오개념: "CRL이 더 안전하다"는 것도 단순화. CRL은 갱신 주기 내(예: 24시간)에 폐기된 인증서를 못 잡음 — 폐기 직후 24시간 동안은 폐기 사실이 반영 안 됨. OCSP가 실시간성에서 우위.

AI Annotation 보충: OCSP — 인증서 시리얼 번호를 CA에 보내 실시간으로 1건씩 유효 여부를 조회하는 프로토콜. CRL(Certificate Revocation List) — CA가 발행하는 폐기된 인증서 목록으로, 전체를 한 번에 다운로드하는 방식. 실무에서는 두 방식이 병행되며, OCSP Stapling으로 서버가 미리 OCSP 응답을 캐시하여 성능 부담을 줄이기도 합니다.

---

# TLS 서버가 하나의 IP:포트 조합에 하나의 인증서만 제시할 수 있는 이유와, 이 제약을 SNI가 어떻게 해결하는가?

> Because TLS operates at a protocol level below that of HTTP and has no knowledge of the higher-level protocols, TLS servers can only strictly present one certificate for a particular address and port combination.
> In the past, this meant that it was not feasible to use name-based virtual hosting with HTTPS.
> A solution called Server Name Indication (SNI) exists, which sends the hostname to the server before encrypting the connection, although older browsers do not support this extension.

---

## 도입

HTTP는 `Host` 헤더로 가상 호스팅(한 IP에 여러 도메인)이 가능했지만 — HTTPS에서는 처음엔 안 됐습니다. 왜? TLS handshake가 HTTP 요청보다 먼저 일어나기 때문에 서버가 "어느 도메인의 인증서를 보여줄지" 결정할 시점에 도메인을 모릅니다. 이 닭과 달걀 문제를 SNI가 풀었습니다.

---

## 본문

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

## 종합

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

---

# [UNVERIFIED] TLS handshake의 구체적인 단계(ClientHello, ServerHello, 키 교환, Finished)는 어떻게 진행되는가?

---

## 도입

HTTPS 연결을 시작할 때 브라우저와 서버는 본격적인 데이터를 주고받기 전에 짧은 의식을 거칩니다 — TLS 핸드셰이크. 이 단계에서 양쪽이 "쓸 수 있는 암호 방식 협상", "서버 신원 확인", "세션 키 합의"를 한 번에 끝냅니다. Chrome DevTools Network 탭의 Timing에서 "SSL"로 표시되는 그 시간이 바로 이 핸드셰이크의 비용입니다.

---

## 본문

TLS 1.2 기준 핸드셰이크는 보통 4단계로 풀어 설명합니다.

**1단계 — ClientHello** (클라이언트가 시작):

- 클라이언트(브라우저)가 서버에게 "이런 조건으로 연결하고 싶어요"라고 제안하는 메시지.
- 담기는 정보: 자신이 지원하는 TLS 버전 목록(예: TLS 1.2, 1.3), 지원하는 cipher suite 목록(암호 알고리즘 조합), 클라이언트가 만든 무작위 값(client random), 그리고 SNI 확장(접속하려는 도메인명).
- 평문으로 전송됩니다 — 이 시점엔 아직 합의된 키가 없으니 암호화 불가.

**2단계 — ServerHello + 인증서**:

- 서버가 클라이언트의 제안 중에서 자신이 사용할 항목을 골라 응답.
- 담기는 정보: 선택된 TLS 버전, 선택된 cipher suite, 서버 무작위 값(server random), 그리고 **서버 인증서**(공개키와 CA 서명 포함).
- 클라이언트는 받은 인증서를 검증 — CA 체인이 자기 신뢰 저장소(trust store)에 닿는지, 도메인이 일치하는지, 만료되지 않았는지.

**3단계 — 키 교환 (Key Exchange)**:

- 양쪽이 **세션 키** (이번 연결에서만 쓸 대칭 키)를 안전하게 만들어내는 단계.
- 옛 방식 (RSA 키 교환): 클라이언트가 pre-master secret을 만들어 서버 공개키로 암호화해 전송. 서버는 자기 개인키로 복호화. 단점은 forward secrecy 없음.
- 현대 방식 (ECDHE 등 Diffie-Hellman 계열): 양쪽이 임시(ephemeral) 키 쌍의 공개부를 교환하고, 각자 자기 개인부와 상대 공개부로 같은 비밀 값을 도출. 서버 개인키가 후일 유출되어도 과거 세션 키는 복원 불가 — forward secrecy 확보.
- 양쪽은 client random + server random + pre-master secret을 합쳐 같은 master secret을 도출하고, 거기서 실제 암호화·MAC 키를 파생.

**4단계 — Finished**:

- 양쪽이 "지금까지 주고받은 핸드셰이크 메시지의 해시"를 새로 합의된 세션 키로 암호화해 전송.
- 클라이언트가 먼저 ChangeCipherSpec → Finished 보내고, 서버도 같은 순서로 응답.
- 받은 쪽은 자기가 보관한 핸드셰이크 기록의 해시와 비교 — 일치하면 "중간에서 누가 메시지를 변조하지 않았다"는 증명. 검증 통과 시 본격적인 암호화 통신 개시.

TLS 1.3은 이 흐름을 한 번의 round trip(1-RTT)으로 압축했습니다. ClientHello에 키 공유 정보까지 미리 담아 보내고, 서버가 ServerHello + 인증서 + Finished를 한 번에 응답. 0-RTT 모드는 재방문 시 첫 패킷부터 데이터를 보낼 수도 있음 (보안 trade-off 있음).

---

## 종합

TLS 1.2 핸드셰이크 한 사이클을 한 표로:

| 단계 | 보내는 쪽 | 핵심 데이터 | 목적 |
|---|---|---|---|
| 1. ClientHello | 클라이언트 | 지원 TLS·cipher·client random·SNI | 협상 시작 |
| 2. ServerHello + 인증서 | 서버 | 선택된 TLS·cipher·server random·인증서 | 협상 마감 + 신원 제시 |
| 3. 키 교환 | 양쪽 | DH 공개부 (또는 pre-master) | 세션 키 합의 |
| 4. Finished | 양쪽 | 핸드셰이크 해시(암호화) | 변조 검증, 암호화 개시 |

Chrome DevTools에서 한 HTTPS 요청을 클릭해 Timing 섹션을 보면 다음 항목들이 펼쳐집니다:

- **DNS Lookup** — 도메인 → IP
- **Initial connection** — TCP 3-way handshake
- **SSL** — TLS 핸드셰이크 (위에서 풀어본 그 시간)
- **Request sent** — HTTP 요청 전송
- **Waiting (TTFB)** — 서버가 응답 만들 때까지
- **Content download** — 응답 본문 받기

처음 HTTPS 연결의 SSL 항목이 30~100ms 정도 잡히는 게 흔합니다. 이게 핸드셰이크 비용 — 그래서 같은 도메인의 다음 요청부터는 **세션 재개(session resumption)** 또는 keep-alive로 이 비용을 안 내려고 합니다. TLS 1.3에서 RTT가 줄어든 것도 이 비용을 깎으려는 노력.

브라우저 개발자가 알아두면 좋은 사실:

- 동일 호스트의 두 번째 요청부터는 핸드셰이크 생략(keep-alive 활성화 시) — 그래서 첫 요청만 느린 것처럼 보임.
- TLS 1.3 + 0-RTT를 쓰면 재접속 시 첫 패킷부터 데이터 전송 가능 — 다만 replay 공격 위험이 있어 멱등 요청에만 쓰는 게 안전.
- HTTP/2는 한 TLS 연결 위에서 여러 스트림을 멀티플렉싱 — 핸드셰이크 비용을 여러 요청에 분산시키는 효과.

오개념 예방 1: "TLS 핸드셰이크 = 인증서 검증"이라는 단순화는 부족합니다. 인증서 검증은 한 단계일 뿐이고, 핵심은 **세션 키 합의**입니다. 인증서 없이 anonymous DH로 핸드셰이크할 수도 있는데(자체 서명 환경 등), 그래도 세션 키는 만들어집니다 — MitM 위험만 남는 것.

오개념 예방 2: "서버 인증서로 데이터를 암호화한다"는 흔한 오해. 인증서의 공개키는 **키 교환과 서명 검증**에만 쓰이고, 실제 데이터 암호화는 핸드셰이크에서 합의된 **세션 키**(대칭 키)로 합니다. 비대칭 암호는 느려서 데이터 자체에 쓰지 않음.

이게 없으면 어떻게 되는가: TLS 핸드셰이크가 없다면 클라이언트와 서버가 어떻게 같은 비밀 키를 갖게 될지의 문제가 풀리지 않습니다. 평문 채널에서 키를 그대로 보낼 수는 없으니까요. 핸드셰이크는 "공개된 채널에서 비밀을 합의하는" 마법 같은 의식이고, 그 마법의 핵심은 비대칭 암호(키 교환)와 대칭 암호(데이터)의 결합입니다 — 비대칭이 시작을 책임지고, 대칭이 본 통신을 책임지는 분업 구조.

```
        [TLS 1.2 handshake -- 4단계]

   Client                                Server
     |                                     |
     |  (1) ClientHello                    |
     |    버전 / cipher 후보 / client_rand |
     |    / SNI                            |
     +------------------------------------>|
     |                                     |
     |              (2) ServerHello        |
     |                  선택된 버전·cipher |
     |                  / server_rand      |
     |                  + 인증서 (공개키)  |
     |<------------------------------------+
     |                                     |
     |  CA 체인 검증, 도메인 일치 확인     |
     |                                     |
     |  (3) Key Exchange                   |
     |      DH 공개부 (또는 RSA)           |
     +------------------------------------>|
     |              <----- DH 공개부 ------+
     |                                     |
     |  양쪽이 같은 master secret 도출      |
     |  -> 세션 키 / MAC 키 파생            |
     |                                     |
     |  (4) ChangeCipherSpec + Finished    |
     |      (암호화된 handshake 해시)      |
     +------------------------------------>|
     |                                     |
     |       <----- ChangeCipherSpec ------+
     |             + Finished              |
     |                                     |
     |  =====  암호화된 application data ===|
```
