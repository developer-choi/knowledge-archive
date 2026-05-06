# 현재 HTTP 각 버전과 HTTPS의 채택률은 대략 어느 수준인가?

> HTTP/2 is supported by 71% of websites (34.1% HTTP/2 + 36.9% HTTP/3 with backwards compatibility) and supported by almost all web browsers (over 98% of users).
> HTTP/3 is used on 36.9% of websites and is supported by most web browsers, i.e. (at least partially) supported by 97% of users.
> HTTPS, the secure variant of HTTP, is used by more than 85% of websites.

---

**도입**

웹 표준은 발표돼도 즉시 모두가 쓰지 않습니다. 채택까지 수년이 걸리고, 동시에 여러 버전이 공존합니다. 2025년 시점에서 HTTP/1.1, HTTP/2, HTTP/3, HTTPS의 실제 보급률을 파악하면 — 어느 버전을 가정하고 코드를 짜야 할지 감을 잡을 수 있습니다.

---

**본문**

> HTTP/2 is supported by 71% of websites (34.1% HTTP/2 + 36.9% HTTP/3 with backwards compatibility)

HTTP/2는 웹사이트의 71%에서 지원된다 (HTTP/2 단독 34.1% + 하위호환 가능한 HTTP/3 36.9%).

- **71%**: 다수파. 새 사이트라면 HTTP/2 이상이 거의 기본.
- **with backwards compatibility**: HTTP/3 사이트는 HTTP/2도 함께 지원. 클라이언트가 HTTP/3를 못 하면 HTTP/2로 fallback.
- **34.1% + 36.9%**: 두 수치를 더한 게 HTTP/2의 실질 지원율 — HTTP/3 사이트도 HTTP/2를 거의 다 지원하기 때문.

> and supported by almost all web browsers (over 98% of users).

거의 모든 웹 브라우저가 지원하며 사용자의 98% 이상이 사용 가능하다.

- **over 98% of users**: 클라이언트 측 지원은 사실상 완전. 구형 브라우저(IE 11 등)만 예외.
- **almost all web browsers**: Chrome, Firefox, Safari, Edge 등 주요 브라우저는 수년 전부터 지원.

> HTTP/3 is used on 36.9% of websites and is supported by most web browsers, i.e. (at least partially) supported by 97% of users.

HTTP/3는 웹사이트의 36.9%에서 사용되며 대부분의 브라우저가 지원해 사용자 97%(적어도 부분적으로)가 사용 가능하다.

- **36.9% of websites**: 새 표준치고는 빠른 보급. CDN(Cloudflare, Fastly)이 자동 활성화하는 영향.
- **at least partially**: 일부 브라우저는 기본 활성화, 일부는 옵션. 네트워크 환경에 따라 활성화/비활성화.

> HTTPS, the secure variant of HTTP, is used by more than 85% of websites.

HTTP의 보안 변형인 HTTPS는 웹사이트의 85% 이상에서 사용된다.

- **more than 85%**: 지난 10년간 가장 큰 변화. 2014년경엔 30~40%대였습니다.
- **secure variant**: HTTP에 TLS를 얹은 것. 별도 프로토콜이 아닌 HTTP 위 보안 계층.

---

**종합**

2025년 현재 웹의 프로토콜 지형을 정리하면:

| 항목 | 수치 | 의미 |
|---|---|---|
| HTTPS 사용 사이트 | 85%+ | 평문 HTTP 사이트는 소수파 |
| HTTP/2 지원 사이트 | 71% (34.1% + 36.9%) | 새 사이트 거의 기본값 |
| HTTP/3 사용 사이트 | 36.9% | CDN 주도로 빠르게 확산 |
| HTTP/2/3 지원 사용자 | 97~98% | 클라이언트는 사실상 준비 완료 |

프론트엔드 개발자 입장에서 의미:

- `fetch()` 한 줄을 쓸 때 어느 프로토콜로 갈지는 서버·CDN 설정에 달림. 클라이언트가 명시적으로 고를 일은 거의 없음
- 새 사이트라면 HTTPS는 필수, HTTP/2는 사실상 기본, HTTP/3는 CDN 사용 시 자동
- 채택률이 점진적이라 — 구형 클라이언트(IE 11 등)를 지원해야 한다면 HTTP/1.1 fallback도 고려 필요

오개념 예방: HTTP/3가 36.9%라고 해서 "아직 HTTP/3 안 써도 됨"이 아닙니다. 같은 사이트가 HTTP/3 + HTTP/2 + HTTP/1.1을 동시에 제공하는 게 흔하고, 클라이언트는 협상을 통해 가능한 최신 버전을 씁니다. HTTPS만 켜놓으면 CDN이 알아서 HTTP/3까지 활성화합니다.

이게 없으면 어떻게 되는가: HTTPS가 85%까지 오르지 않았다면 — 공용 와이파이에서의 패킷 스니핑, ISP의 광고 인젝션, 정부 검열·감시 등이 훨씬 쉬웠을 것입니다. 2018년 Chrome이 HTTP 사이트에 "Not Secure" 경고를 표시하기 시작한 게 채택률 급등의 결정적 계기였고, Let's Encrypt(2016~)의 무료 인증서가 비용 장벽을 없앴습니다.

Official Annotation 보충: HTTPS 안에서도 TLS 1.0/1.1은 2020년 제거됐고, TLS 1.3(2018년 발표)이 권장이지만 — 채택은 느립니다. 많은 서버가 여전히 TLS 1.2에 머물러 있습니다. "HTTPS = 안전"이 자동 보장은 아니고, 어떤 TLS 버전을 쓰는지도 봐야 합니다.

AI Annotation 보충: HTTP/2의 보급률이 큰 이유 중 하나는 — HTTP/2가 사실상 HTTPS 위에서만 동작하므로, HTTPS 보급이 HTTP/2 보급을 끌어올리는 선순환을 만들었습니다.
