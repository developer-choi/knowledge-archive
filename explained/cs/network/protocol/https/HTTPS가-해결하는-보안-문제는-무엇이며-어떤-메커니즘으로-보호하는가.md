# HTTPS가 해결하는 보안 문제는 무엇이며, 어떤 메커니즘으로 보호하는가?

> The principal motivations for HTTPS are authentication of the accessed website and protection of the privacy and integrity of the exchanged data while it is in transit.
> It protects against man-in-the-middle attacks, and the bidirectional block cipher encryption of communications between a client and server protects the communications against eavesdropping and tampering.

---

**도입**

HTTPS가 무엇을 막아주는지 한 줄로 요약하면 — 누군가가 통신 중간에 끼어들어 ① 가짜 서버인 척하거나 ② 데이터를 엿보거나 ③ 데이터를 변조하지 못하게 막습니다. 이 세 가지가 HTTPS의 핵심 보안 목표이고, 각각을 인증(authentication), 기밀성(privacy), 무결성(integrity)이라고 부릅니다.

---

**본문**

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

**종합**

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
