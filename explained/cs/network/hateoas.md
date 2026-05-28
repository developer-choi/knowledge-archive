# [UNVERIFIED] HATEOAS란 무엇이며 왜 Uniform Interface의 핵심 제약인가?

## 도입

HATEOAS는 "Hypermedia As The Engine Of Application State"의 약자로, Roy Fielding이 REST 아키텍처 논문에서 정의한 Uniform Interface 제약 중 하나다. 핵심 아이디어는 API 응답 안에 "다음에 무엇을 할 수 있는지"를 링크로 포함시켜서, 클라이언트가 API 문서를 미리 하드코딩하지 않아도 응답만 따라가면 전체 상태 전이를 탐색할 수 있게 만드는 것이다.

---

## 본문

Fielding이 정의한 Uniform Interface는 4가지 서브 제약으로 구성되는데, 그 중 가장 강력하고 잘 지켜지지 않는 것이 HATEOAS다.

HATEOAS가 없으면 클라이언트는 이렇게 동작한다:

```js
// 클라이언트가 다음 URL을 하드코딩해야 함
const order = await fetch('/orders/123').then(r => r.json())
await fetch('/orders/123/pay', { method: 'POST' })  // 문서보고 URL 직접 입력
await fetch('/orders/123/cancel', { method: 'DELETE' })
```

HATEOAS가 있으면 응답 자체가 "무엇을 할 수 있는지" 알려준다:

```json
{
  "orderId": 123,
  "status": "pending",
  "_links": {
    "self":   { "href": "/orders/123" },
    "pay":    { "href": "/orders/123/pay",    "method": "POST" },
    "cancel": { "href": "/orders/123/cancel", "method": "DELETE" }
  }
}
```

클라이언트는 `_links.pay.href`를 동적으로 따라가면 되고, 서버가 URL 구조를 바꾸더라도 클라이언트는 수정이 필요 없다.

**왜 Uniform Interface의 "핵심"인가?** Fielding이 REST를 정의할 때 가장 강조한 것은 "서버-클라이언트 분리(decoupling)"다. 클라이언트가 URL을 하드코딩하면 서버와 클라이언트가 암묵적으로 결합된다 — HATEOAS는 이 결합을 끊는 유일한 수단이다. Fielding은 2008년 블로그 포스트에서 "HATEOAS 없는 API는 REST가 아니다"라고 명시했다.

```
HATEOAS가 있을 때:
  응답 안의 링크
  ├── rel: "pay"    → href 따라가면 됨
  ├── rel: "cancel" → href 따라가면 됨
  └── rel: "self"   → 현재 자원 위치

  클라이언트 코드: response._links[action].href 를 fetch
  서버가 URL 변경해도 클라이언트 수정 불필요

HATEOAS가 없을 때:
  클라이언트가 `/orders/{id}/pay` 패턴을 직접 알고 있어야 함
  서버가 URL 구조 변경 → 클라이언트 모두 수정 필요 (강결합)
```

---

## 종합

HATEOAS의 핵심은 "API 응답이 스스로 탐색 가능해야 한다"는 것이다. 웹 브라우저가 HTML 링크를 따라가며 전체 인터넷을 탐색하듯, REST API 클라이언트도 응답 안의 링크를 따라가며 가능한 행위를 발견할 수 있어야 한다. 이게 없으면 클라이언트는 서버의 URL 구조를 문서로 학습하고 하드코딩해야 하는데, 이 순간부터 서버와 클라이언트는 배포 의존성으로 묶인다. Fielding의 관점에서 이런 API는 "HTTP 위에서 동작하는 RPC"지 REST가 아니다.

---

---

# [UNVERIFIED] HATEOAS가 실무에서 거의 채택되지 않는 이유는?

## 도입

HATEOAS가 이론적으로 강력함에도 실무에서 거의 볼 수 없는 데는 현실적인 이유가 있다. 이득보다 비용이 크다는 것이 업계의 판단이다. 대부분의 실무 API는 HATEOAS를 빼고도 클라이언트-서버 계약을 OpenAPI 스펙이나 별도 문서로 관리하는 방식을 선택한다.

---

## 본문

**비용 측면**

첫째, 응답 크기가 커진다. 모든 응답에 `_links` 객체를 포함시키면 페이로드가 늘어난다. 모바일 앱이나 저대역폭 환경에서 이 오버헤드가 누적된다.

둘째, 서버 구현 복잡도가 높아진다. 각 응답 상태에 따라 어떤 링크를 포함할지 계산하는 로직이 추가된다. 예를 들어 주문 상태가 `pending`이면 `pay`·`cancel` 링크를 주고, `shipped`면 `track` 링크만 줘야 하는 조건 분기를 모든 엔드포인트에 걸어야 한다.

셋째, 클라이언트 구현도 복잡해진다. `response._links.pay?.href`를 동적으로 처리하는 코드보다 `/orders/${id}/pay`를 직접 호출하는 코드가 훨씬 단순하다. Apollo Client처럼 잘 추상화된 GraphQL 클라이언트와 달리, HATEOAS를 위한 표준 클라이언트 라이브러리가 없다.

**이득 측면의 의문**

HATEOAS의 핵심 이득은 "서버 URL 변경 시 클라이언트 수정 불필요"인데, 실무에서 이 이득이 생각만큼 크지 않다. 이유는:

- 서버가 URL을 변경하려면 어차피 API 버전을 올리거나 하위 호환성을 관리해야 한다.
- 모바일 앱은 클라이언트를 배포할 때 앱 스토어 심사가 필요하므로, 서버가 링크를 동적으로 바꿔줘도 오래된 앱 버전이 현장에 살아있다.
- 프론트엔드 팀과 백엔드 팀이 같은 조직 안에 있으면, URL 변경은 슬랙 메시지 한 통으로 조율 가능하다.

```
HATEOAS 비용-이득 분석
─────────────────────────────────────────────
비용                      이득
─────────────────────────────────────────────
응답 크기 증가             URL 변경 시 클라이언트 자동 추종
서버 링크 계산 로직        API 문서 없이도 탐색 가능
클라이언트 파싱 복잡도     클라이언트-서버 결합도 감소
표준 라이브러리 없음
─────────────────────────────────────────────
실무 판단: 이득이 비용보다 작다 → 미채택
```

---

## 종합

HATEOAS가 채택되지 않는 근본 이유는 "이론적 우아함"이 "실무적 ROI"를 넘지 못하기 때문이다. OpenAPI(Swagger) 스펙으로 계약을 문서화하고 버전으로 관리하는 방식이 팀 협업 효율 측면에서 훨씬 낫다. HATEOAS의 장점인 "서버-클라이언트 결합 해제"는 GraphQL이 스키마와 타입 시스템으로 다른 방식으로 해결하고 있다. 결과적으로 업계는 Fielding의 완전한 REST 이론보다 "실용적 REST" — HATEOAS를 빼고 HTTP 메서드와 상태코드를 올바르게 쓰는 수준 — 을 표준으로 받아들였다.

---

---

# [UNVERIFIED] Richardson Maturity Model의 Level 0~3은 각각 무엇인가?

## 도입

Richardson Maturity Model(RMM)은 Martin Fowler가 Leonard Richardson의 분석을 정리한 REST 성숙도 모델이다. HTTP를 얼마나 "REST답게" 활용하고 있는지를 Level 0부터 3까지 4단계로 분류한다. 실무에서 "REST API"라고 부르는 것이 실제로 어느 수준인지 객관적으로 파악하는 데 유용한 기준이다.

---

## 본문

```
Richardson Maturity Model
─────────────────────────────────────────────────────
Level  이름                   핵심 특징
─────────────────────────────────────────────────────
  0    HTTP 터널               HTTP를 단순 전송 채널로만 사용
  1    자원(Resource)          URL이 자원을 가리킴
  2    HTTP 메서드             GET/POST/PUT/DELETE 의미대로 사용
  3    Hypermedia Controls     HATEOAS — 응답에 다음 링크 포함
─────────────────────────────────────────────────────
```

**Level 0 — HTTP 터널**

HTTP를 단순한 데이터 전송 채널로만 쓴다. 하나의 엔드포인트에 모든 요청을 보내고, 바디에 동작을 기술한다. SOAP XML-RPC가 대표적이다.

```http
POST /api
Content-Type: application/json

{ "action": "getUser", "userId": 1 }
```

HTTP의 메서드·상태코드·캐싱 등 기능을 전혀 활용하지 않는다.

**Level 1 — 자원(Resource)**

URL이 자원을 식별하기 시작한다. 동작은 여전히 URL에 동사로 박거나 POST 바디에 담는다.

```http
POST /users/getById
POST /users/create
POST /users/delete
```

자원은 분리됐지만 HTTP 메서드의 의미(GET = 조회, DELETE = 삭제)는 아직 활용하지 않는다.

**Level 2 — HTTP 메서드**

HTTP 메서드를 의미에 맞게 사용한다. GET은 조회(캐시 가능·안전), POST는 생성, PUT/PATCH는 수정, DELETE는 삭제. 상태코드도 200/201/404/400을 의미에 따라 구분한다.

```http
GET    /users/1        → 200 OK + 바디
POST   /users          → 201 Created + Location 헤더
DELETE /users/1        → 204 No Content
GET    /users/999      → 404 Not Found
```

오늘날 업계가 "REST API"라고 부르는 것의 대부분이 Level 2에 해당한다.

**Level 3 — Hypermedia Controls (HATEOAS)**

응답 바디에 "다음에 할 수 있는 행위" 링크를 포함한다. 클라이언트는 응답을 따라가며 API를 탐색할 수 있다.

```json
{
  "userId": 1,
  "name": "Alice",
  "_links": {
    "self":   { "href": "/users/1" },
    "orders": { "href": "/users/1/orders" },
    "delete": { "href": "/users/1", "method": "DELETE" }
  }
}
```

Fielding이 진짜 REST라고 부르는 것이 이 Level이다.

---

## 종합

Level 0 → 1 → 2 → 3으로 갈수록 HTTP의 기능을 점점 더 충실하게 활용한다. Level 2까지는 "HTTP를 올바르게 쓰는 것"이고, Level 3은 "API 자체가 탐색 가능한 문서가 되는 것"이다. 현실에서 Level 3 채택은 거의 없고, Level 2가 업계 표준으로 통용된다. RMM의 실용적 가치는 "내 API가 어느 수준에 있는지" 팀 내 공통 언어로 소통하게 해준다는 점이다.

---

---

# [UNVERIFIED] 업계가 "REST"라고 부르는 것이 보통 Level 몇인가?

## 도입

Fielding이 정의한 REST와 실무에서 "REST"라고 부르는 것 사이에는 상당한 간격이 있다. 이 질문은 그 간격을 명확히 짚는다. 결론부터 말하면 업계 표준은 Richardson Maturity Model Level 2다.

---

## 본문

**업계 "REST" = Level 2**

실무에서 "RESTful API 만들었어요"라고 할 때 의미하는 것은 대부분:

- URL이 자원을 나타낸다: `/users`, `/orders/123`
- HTTP 메서드를 의미에 맞게 쓴다: GET(조회), POST(생성), PUT/PATCH(수정), DELETE(삭제)
- 적절한 HTTP 상태코드를 반환한다: 200, 201, 400, 404, 500

이것이 Level 2다. HATEOAS(Level 3)는 포함되지 않는다.

**왜 Level 3이 아닌 Level 2에서 멈췄는가?**

앞 질문에서 다뤘듯 HATEOAS의 비용-이득 분석 결과다. OpenAPI 스펙, Postman 문서, README로 계약을 관리하는 것이 `_links` 응답보다 팀 생산성 측면에서 낫다는 합의가 업계에 형성됐다.

**Fielding의 입장**

Fielding 본인은 2008년 블로그에서 "Level 2는 REST가 아니다"라고 말했다. 그의 기준에서 REST는 Level 3(HATEOAS 포함)만이 해당한다. 하지만 이 발언은 업계에서 광범위하게 무시됐고, 용어 주도권은 이미 "Level 2 = REST"로 넘어간 상태다.

```
용어 사용 현황
─────────────────────────────────────────────────
수준       Fielding의 분류    업계 통용 표현
─────────────────────────────────────────────────
Level 0    REST 아님          HTTP API / RPC-over-HTTP
Level 1    REST 아님          HTTP API
Level 2    REST 아님(!)       REST API ← 업계 표준
Level 3    진짜 REST          진짜 REST (거의 없음)
─────────────────────────────────────────────────
```

---

## 종합

"REST API를 만든다"는 말은 맥락에 따라 해석이 달라진다. Fielding과 이야기하면 Level 3이어야 하고, 대부분의 팀과 이야기하면 Level 2면 충분하다. 실무적으로 중요한 것은 용어 논쟁보다 HTTP 메서드·상태코드·URL 설계를 의미에 맞게 쓰는 Level 2의 원칙을 지키는 것이다. Level 3의 이상적인 분리는 GraphQL의 스키마 타입 시스템이나 API Gateway의 자동 문서화로 다른 방식으로 보완하는 것이 현실적인 선택이다.
