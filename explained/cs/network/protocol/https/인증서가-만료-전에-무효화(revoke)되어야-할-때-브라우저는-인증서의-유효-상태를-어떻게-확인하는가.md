# 인증서가 만료 전에 무효화(revoke)되어야 할 때, 브라우저는 인증서의 유효 상태를 어떻게 확인하는가?

> A certificate may be revoked before it expires, for example because the secrecy of the private key has been compromised.
> The browser sends the certificate's serial number to the certificate authority or its delegate via OCSP (Online Certificate Status Protocol) and the authority responds, telling the browser whether the certificate is still valid or not.
> The CA may also issue a CRL to tell people that these certificates are revoked.
> CRLs are no longer required by the CA/Browser forum, nevertheless, they are still widely used by the CAs.

---

**도입**

인증서의 유효기간이 1년 남아있어도 — 비밀키가 유출되거나 발급 실수가 발견되면 즉시 폐기해야 합니다. 그런데 브라우저는 어떤 인증서가 폐기됐는지 어떻게 알까요? 답은 두 가지 방식 — OCSP(실시간 조회)와 CRL(폐기 목록 다운로드). 둘 다 사용되고, 각자 장단점이 있습니다.

---

**본문**

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

**종합**

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
