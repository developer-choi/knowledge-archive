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

**도입**

"HTTPS 자물쇠가 보이니까 안전하다"는 단순한 결론에는 사실 6가지 전제조건이 깔려 있습니다. 이 중 하나라도 깨지면 자물쇠가 무의미해집니다. HTTPS의 신뢰 모델이 어떤 사슬로 이어져 있는지, 그리고 어디가 약한 고리인지 보면 — 보안의 한계와 가능성이 동시에 보입니다.

---

**본문**

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

**종합**

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
