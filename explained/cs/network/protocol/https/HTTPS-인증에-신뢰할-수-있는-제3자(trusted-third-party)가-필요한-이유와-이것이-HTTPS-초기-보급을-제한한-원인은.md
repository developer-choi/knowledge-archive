# HTTPS 인증에 신뢰할 수 있는 제3자(trusted third party)가 필요한 이유와, 이것이 HTTPS 초기 보급을 제한한 원인은?

> The authentication aspect of HTTPS requires a trusted third party to sign server-side digital certificates.
> This was historically an expensive operation, which meant fully authenticated HTTPS connections were usually found only on secured payment transaction services and other secured corporate information systems on the World Wide Web.
> In 2016, a campaign by the Electronic Frontier Foundation with the support of web browser developers led to the protocol becoming more prevalent.
> HTTPS has since 2018 been used more often by web users than non-secure HTTP, primarily to protect page authenticity on all types of websites, secure accounts, and keep user communications, identity, and web browsing private.

---

**도입**

HTTPS의 보안은 "내가 통신하는 상대가 진짜 example.com인가?"를 확인하는 데서 시작합니다. 그런데 클라이언트가 그걸 어떻게 알 수 있을까요? — 답은 신뢰할 수 있는 제3자(CA, Certificate Authority)가 "이 서버는 진짜 example.com 맞아"라고 보증해주는 것. 이 보증서가 디지털 인증서이고, 이걸 발급받는 비용이 한때 HTTPS 보급의 큰 장벽이었습니다.

---

**본문**

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

**종합**

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
