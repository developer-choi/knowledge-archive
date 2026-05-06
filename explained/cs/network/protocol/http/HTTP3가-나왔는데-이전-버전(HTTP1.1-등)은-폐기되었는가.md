# HTTP/3가 나왔는데 이전 버전(HTTP/1.1 등)은 폐기되었는가?

> Like HTTP/2, it does not obsolete previous major versions of the protocol.
> HTTP/3 has lower latency for real-world web pages and loads faster than HTTP/2, in some cases over three times faster than HTTP/1.1, which is still commonly the only protocol enabled.

---

**도입**

새 버전이 나오면 이전 게 사라진다는 직감과 달리, HTTP는 모든 메이저 버전이 공존합니다. HTTP/1.1, HTTP/2, HTTP/3 셋 다 현역이고, 클라이언트와 서버가 협상해서 가능한 최신을 씁니다. 이 공존이 어떻게 가능하고, 왜 그런지 이해하면 — 사이트 개발 시 어떤 버전을 가정해야 할지 보입니다.

---

**본문**

> Like HTTP/2, it does not obsolete previous major versions of the protocol.

HTTP/2와 마찬가지로, HTTP/3도 프로토콜의 이전 메이저 버전을 폐기시키지 않는다.

- **does not obsolete**: 폐기시키지 않음. 기존 버전이 그대로 표준으로 남아있고, 새 버전은 옵션으로 추가.
- **previous major versions**: HTTP/1.1, HTTP/2 모두. 둘 다 그대로 표준으로 유효.

> HTTP/3 has lower latency for real-world web pages and loads faster than HTTP/2,

HTTP/3는 실제 웹페이지의 지연이 더 낮고 HTTP/2보다 빠르게 로드된다.

- **real-world web pages**: 실험실이 아니라 실제 웹사이트에서. 이론적 차이가 아니라 측정 가능한 차이.
- **lower latency**: 응답 시작까지의 지연이 짧음. 0-RTT 핸드셰이크와 TCP HOL 회피 덕분.

> in some cases over three times faster than HTTP/1.1,

어떤 경우에는 HTTP/1.1보다 3배 이상 빠르다.

- **over three times**: 페이지 구조에 따라 다르지만, 리소스가 많은 페이지일수록 차이가 큼. 멀티플렉싱의 누적 효과.
- **in some cases**: 모든 경우가 아니라 특정 상황에서. 작은 페이지에선 차이가 미미할 수도 있습니다.

> which is still commonly the only protocol enabled.

(HTTP/1.1은) 여전히 흔히 유일하게 활성화된 프로토콜이다.

- **still commonly**: 아직도 자주. 신규 사이트는 HTTP/2/3가 기본이지만, 옛 사이트·내부 시스템은 HTTP/1.1만 켜져 있는 경우가 흔함.
- **the only protocol enabled**: HTTP/1.1만 활성화. HTTP/2/3 추가 설정을 안 한 서버가 많아 HTTP/1.1이 여전히 현역.

---

**종합**

HTTP 버전 공존의 모습:

| 버전 | 위치 | 사용 시점 |
|---|---|---|
| HTTP/1.1 | 모든 사이트의 기본 | HTTP/2/3 미지원 시 자동 fallback |
| HTTP/2 | 다수 사이트에서 활성화 | 클라이언트가 지원하면 우선 |
| HTTP/3 | CDN 사용 사이트 중심 | 클라이언트와 네트워크가 지원하면 우선 |

같은 사이트가 동시에 셋을 다 제공하고, 클라이언트와 서버가 ALPN(Application-Layer Protocol Negotiation)이라는 TLS 확장으로 "어떤 버전 쓸까"를 협상합니다. 가능한 가장 새 버전을 고르되, 안 되면 자동으로 한 단계 내려갑니다.

JS 개발자에게 와닿는 지점:

- `fetch()`나 `XMLHttpRequest`는 HTTP 버전을 신경 쓰지 않습니다. 같은 코드가 HTTP/1.1, HTTP/2, HTTP/3 모두에서 동작
- DevTools Network 탭의 Protocol 컬럼으로 실제 어느 버전이 쓰였는지 확인 가능
- 브라우저가 알아서 협상하므로 클라이언트 코드가 버전을 고를 일은 거의 없음

이게 없으면 어떻게 되는가: HTTP/3가 HTTP/1.1을 폐기시키는 식이라면 — 모든 서버·클라이언트가 동시에 업데이트해야 하므로 변화가 거의 불가능했을 것입니다. 인터넷의 규모(수십억 디바이스)에서 동시 마이그레이션은 비현실적이고, 각 버전이 공존하면서 점진적으로 새 버전이 보급되는 것이 유일한 길입니다.

오개념 예방: "HTTP/3가 3배 빠름"이라는 건 모든 페이지가 그렇다는 뜻은 아닙니다. 패킷 손실이 잦은 모바일 네트워크나 리소스가 많은 페이지에서 그 정도 차이가 나오는 것이고, 빠른 유선 네트워크의 작은 페이지에선 차이가 거의 없을 수 있습니다.

AI Annotation 보충: 새 표준이 이전 표준을 폐기하지 않는 정책은 HTTP만의 특징이 아니라 인터넷 표준 전반의 관행입니다. IPv4와 IPv6도 30년 가까이 공존 중이며, 이런 점진적 전환이 인터넷의 안정성을 유지합니다.
