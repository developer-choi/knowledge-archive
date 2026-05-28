# [UNVERIFIED] 자원 중심 URL은 왜 동사 대신 명사를 쓰는가? (`/getUsers` vs `/users`)

## 도입

REST에서 URL은 "무엇"을 가리키는 이름이지 "무엇을 한다"는 행위 설명이 아니다. 행위는 HTTP 메서드(GET, POST, PUT, DELETE)가 담당한다. 이 분리가 REST URL 설계의 핵심이다.

---

## 본문

**동사 URL의 문제**

```http
GET  /getUsers      → 사용자 목록 조회
POST /createUser    → 사용자 생성
POST /deleteUser/1  → 사용자 삭제
POST /updateUser/1  → 사용자 수정
```

이 방식은 행위가 URL에 박혀 있다. 그런데 HTTP 메서드도 행위를 표현한다 — GET(읽기), POST(생성), DELETE(삭제), PUT(수정). 결과적으로 행위가 두 곳(URL + HTTP 메서드)에 중복 표현된다. `POST /deleteUser/1`은 특히 모순적이다: POST는 "생성"인데 URL은 "삭제"라고 말한다.

**명사 URL + HTTP 메서드 분리**

```http
GET    /users       → 사용자 목록 조회
POST   /users       → 사용자 생성
GET    /users/1     → 사용자 1번 조회
PUT    /users/1     → 사용자 1번 전체 수정
PATCH  /users/1     → 사용자 1번 부분 수정
DELETE /users/1     → 사용자 1번 삭제
```

`/users`는 "사용자들"이라는 자원을 가리키는 이름이다. 이 자원에 무엇을 할지는 HTTP 메서드가 결정한다. 동일한 URL(`/users/1`)에 메서드만 바꿔서 조회·수정·삭제를 모두 표현할 수 있다.

**캐싱과의 연결**

```
GET /users/1
↑ 안전(Safe) + 멱등(Idempotent)
→ 브라우저·CDN이 이 URL을 캐시 가능

POST /getUser/1
↑ POST는 HTTP 표준상 캐시 불가
→ 동일 데이터인데 캐시 혜택을 못 받음
```

GET 메서드는 "부작용 없음"과 "동일 요청 = 동일 결과"를 보장하므로 브라우저와 CDN이 자동으로 캐시한다. URL에 동사가 섞이면 이 캐싱 메커니즘과 어긋난다.

---

## 종합

"URL = 명사, HTTP 메서드 = 동사"의 분리는 HTTP 프로토콜의 설계 철학과 일치한다. HTTP는 메서드마다 캐시 가능 여부·안전성·멱등성을 정의해두었는데, URL에 동사를 박으면 이 표준 의미가 무너진다. `GET /users/1`은 HTTP 표준이 보장하는 "캐시 가능, 반복 호출 안전"을 그대로 상속받지만, `POST /getUser/1`은 POST의 "캐시 불가, 부작용 가능"으로 분류된다. 명사 URL은 HTTP를 의미대로 활용하는 것이고, 동사 URL은 HTTP 위에서 자체 프로토콜을 만드는 것이다.

---

---

# [UNVERIFIED] 검색 엔드포인트는 `/users/search?q=` 와 `/users?q=` 중 무엇이 더 RESTful한가?

## 도입

검색은 REST URL 설계에서 자주 논쟁이 되는 케이스다. `search`라는 단어가 동사처럼 느껴지기 때문이다. 결론부터 말하면 `/users?q=`가 더 RESTful하다.

---

## 본문

**`/users/search?q=`의 문제**

```http
GET /users/search?q=alice
```

`/users/search`는 `search`가 마치 자원처럼 URL 경로에 들어갔다. 하지만 `search`는 자원이 아니라 동작이다. "사용자들 중 검색"이지 "검색이라는 자원"이 아니다.

또한 `GET /users/123`은 `123` ID를 가진 사용자를 가리키는 패턴인데, `GET /users/search`는 이 패턴을 깬다. 혹시 `search`라는 ID를 가진 사용자가 있다면 충돌도 발생할 수 있다.

**`/users?q=`가 더 RESTful한 이유**

```http
GET /users?q=alice&role=admin&limit=20
```

`/users`는 "사용자 컬렉션" 자원이다. `?q=alice`는 그 컬렉션을 **필터링하는 조건**이다. 이것은 자원 자체를 다루는 것이지, 별도 "검색" 동작을 정의하는 것이 아니다.

비유하면 Express 라우팅에서:
```js
// /users/search?q= 방식: 별도 라우트 필요
app.get('/users/search', searchHandler)
app.get('/users/:id', getUserHandler)  // 순서 주의!

// /users?q= 방식: 하나의 라우트로 처리
app.get('/users', (req, res) => {
  const { q, role, limit } = req.query
  // 쿼리 파라미터로 필터링
})
```

쿼리 파라미터 방식이 라우트 충돌도 없고 확장도 쉽다. 나중에 `?sort=name&order=asc` 같은 정렬 조건을 추가하기도 자연스럽다.

**예외: 복잡한 검색은 POST + 바디**

필터 조건이 매우 복잡하거나 URL 길이 제한에 걸릴 때는 실무적으로 `POST /users/search`에 조건을 JSON 바디로 보내는 방식을 쓰기도 한다. 엄밀히 RESTful하지 않지만 현실적 타협점이다.

---

## 종합

검색은 자원 컬렉션에 필터를 적용하는 것이므로, 자원 URL(`/users`)에 쿼리 파라미터(`?q=`)를 붙이는 것이 자연스럽다. `/users/search`는 `search`를 자원처럼 취급해 REST의 "URL = 자원"을 어기고, ID 패턴과 충돌 위험도 생긴다. 실무에서는 두 방식 모두 쓰이지만, 설계 일관성과 HTTP 캐싱 이점(GET + 쿼리 파라미터 조합도 캐시 가능)을 고려하면 `/users?q=`가 더 나은 선택이다.

---

---

# [UNVERIFIED] 중첩 자원의 적절한 깊이는 어디까지인가?

## 도입

REST URL은 자원 간 관계를 경로로 표현한다. `/users/1/orders/42/items/7` 같은 식이다. 그런데 이 중첩이 깊어질수록 URL이 길어지고 이해하기 어려워진다. 실무 권고는 최대 2단계 중첩이다.

---

## 본문

**중첩 자원의 의미**

```http
GET /users/1/orders        → 사용자 1의 주문 목록
GET /users/1/orders/42     → 사용자 1의 42번 주문
GET /users/1/orders/42/items  → 사용자 1의 42번 주문의 항목들
```

처음 두 단계까지는 관계가 명확하다. `사용자 → 주문` 관계가 URL에 드러난다.

**3단계 이상의 문제**

```http
GET /users/1/orders/42/items/7/reviews/3
```

이 URL에서 문제점:

- `items/7`은 주문 42에만 속하는가, 아니면 전역 자원인가?
- `reviews/3`은 `items/7`에만 존재하는가?
- URL을 보고 이 자원의 위치를 즉시 파악하기 어렵다

**실무 권고: 2단계 중첩 이하**

```http
✅ GET /orders/42/items       → 2단계, 명확
✅ GET /items/7/reviews       → 2단계, items는 전역으로 참조 가능
❌ GET /users/1/orders/42/items/7  → 4단계, 복잡
```

깊은 중첩은 두 가지 방법으로 납작하게 펼칠 수 있다:

```http
# 방법 1: 하위 자원에 직접 접근 (자원이 전역 ID를 가질 때)
GET /items/7

# 방법 2: 쿼리 파라미터로 필터
GET /items?orderId=42&userId=1
```

**Express 라우팅 관점**

```js
// 깊은 중첩: 라우트 등록이 복잡해짐
app.get('/users/:uid/orders/:oid/items/:iid/reviews/:rid', handler)

// 납작하게 펼침: 간단
app.get('/reviews/:rid', handler)  // reviewId로 직접 접근
app.get('/items/:iid/reviews', handler)  // 최대 2단계
```

---

## 종합

중첩 깊이는 "이 자원이 부모 자원 없이 존재할 수 있는가"로 결정한다. `orders`는 `users` 없이도 주문 ID로 직접 접근 가능하면 `/orders/42`가 맞다. 반드시 `users` 컨텍스트가 필요한 경우(예: 사용자별 권한 분리가 URL 레벨에서 필요할 때)에만 `/users/1/orders/42`로 중첩한다. 3단계 이상은 거의 항상 설계 문제의 신호 — 자원의 글로벌 ID를 부여하거나 쿼리 파라미터로 대체하는 것을 검토한다.

---

---

# [UNVERIFIED] 로그인/로그아웃 같은 행위는 어떻게 자원으로 표현하는가?

## 도입

REST는 "모든 것을 자원으로"라는 패러다임인데, 로그인·로그아웃·비밀번호 초기화 같은 행위는 자원처럼 느껴지지 않는다. 이것을 REST URL로 어떻게 표현하는가가 이 질문의 핵심이다.

---

## 본문

**핵심 발상: 행위를 자원으로 명사화한다**

"로그인"이라는 동작을 "세션을 생성한다"로 바꾸면 자원이 된다. "세션"은 자원이다.

```http
# 로그인 = 세션 생성
POST   /sessions          → 세션 생성 (로그인)
DELETE /sessions/current  → 세션 삭제 (로그아웃)
```

이렇게 하면 HTTP 메서드가 의미를 그대로 전달한다. POST = 생성, DELETE = 삭제.

**다른 행위의 자원화 예시**

```http
# 비밀번호 초기화 요청 = 재설정 토큰 자원 생성
POST /password-reset-tokens
바디: { "email": "alice@example.com" }

# 이메일 인증 = 인증 자원 생성
POST /email-verifications
바디: { "token": "abc123" }

# 계정 활성화/비활성화 = 상태 자원 변경
PUT /users/1/status
바디: { "active": false }
```

**JWT 기반 인증에서의 표현**

```http
# 로그인 = 토큰 발급 (자원: 토큰)
POST /auth/tokens
바디: { "email": "alice@example.com", "password": "..." }
→ 201 Created + { "accessToken": "...", "refreshToken": "..." }

# 토큰 갱신 = 새 토큰 생성
POST /auth/tokens/refresh
바디: { "refreshToken": "..." }

# 로그아웃 = 토큰 폐기 (블랙리스트 추가)
DELETE /auth/tokens/current
```

**실무에서 어느 정도 타협한다**

엄밀한 REST 설계보다 팀 가독성이 더 중요할 때는:

```http
POST /auth/login    # 완전히 RESTful하진 않지만 읽기 쉬움
POST /auth/logout
```

이 URL도 실무에서 흔히 보이고, 팀이 의도를 즉시 파악할 수 있다면 나쁜 선택이 아니다. 완벽한 REST 교리를 지키는 것보다 팀 내 일관성과 이해도가 더 실용적이다.

---

## 종합

행위를 자원으로 바꾸는 핵심은 "동사 → 명사화"다. 로그인은 세션 생성, 로그아웃은 세션 삭제, 비밀번호 초기화는 재설정 토큰 생성이다. 이렇게 하면 HTTP 메서드(POST/DELETE)가 의미를 자연스럽게 전달하고 REST 원칙과 일치한다. 단, 명사화가 어색하거나 팀에서 즉시 이해하기 힘든 경우에는 `/auth/login` 같은 실용적 타협도 합리적 선택이다. REST 순수주의보다 API 사용자(개발자)가 헷갈리지 않는 것이 더 중요하다.

---

---

# [UNVERIFIED] URL 버저닝(`/v1/users`) vs 헤더 버저닝 vs 미디어타입 버저닝의 trade-off는?

## 도입

API가 변경될 때 기존 클라이언트를 깨뜨리지 않으려면 버전 관리가 필요하다. 버전을 어디에 표현하느냐에 따라 세 가지 방식이 있다. 각각 장단점이 다르고, 실무에서 가장 많이 쓰이는 것은 URL 버저닝이다.

---

## 본문

**방식 1: URL 버저닝 (`/v1/users`)**

```http
GET /v1/users/1
GET /v2/users/1
```

버전이 URL에 직접 박혀 있다.

장점:
- 가장 직관적이고 읽기 쉽다. URL만 보고 버전을 알 수 있다.
- `curl`, Postman, 브라우저 주소창 — 어디서든 테스트 가능하다.
- CDN이 버전별 URL을 독립적으로 캐시할 수 있다.
- 버전별 라우팅이 명확하다 (`/v1/*`, `/v2/*`).

단점:
- "같은 자원인데 URL이 두 개"가 된다. `/v1/users/1`과 `/v2/users/1`은 다른 URL이지만 같은 사용자를 가리킨다.
- Fielding이 REST 원칙 위반으로 비판한다 (다음 질문에서 다룸).

**방식 2: 헤더 버저닝 (Accept-Version 또는 커스텀 헤더)**

```http
GET /users/1
Accept-Version: v2

또는

GET /users/1
API-Version: 2
```

URL은 하나고 버전은 요청 헤더로 전달한다.

장점:
- 자원 URL이 하나로 유지된다. `/users/1`은 항상 "1번 사용자"다.
- REST 철학에 더 가깝다.

단점:
- 브라우저 주소창이나 curl 기본 명령으로 테스트하기 어렵다. 헤더를 반드시 붙여야 한다.
- `Accept-Version`은 HTTP 표준 헤더가 아니어서 팀마다 다른 이름을 쓴다 (`X-API-Version`, `API-Version` 등).
- CDN 캐싱이 복잡해진다. URL은 같지만 헤더에 따라 다른 응답이 나와야 하므로 `Vary: Accept-Version` 설정이 필요하다.

**방식 3: 미디어타입 버저닝 (Content Negotiation)**

```http
GET /users/1
Accept: application/vnd.myapi.v2+json
```

HTTP의 Content Negotiation 메커니즘을 버전에 활용한다. `Accept` 헤더에 버전 정보를 담는다.

장점:
- HTTP 표준(RFC 7231)의 Content Negotiation을 그대로 활용한다.
- 미디어타입 자체가 버전을 포함하므로 가장 "표준적"인 방식이다.

단점:
- `vnd.myapi.v2+json` 같은 미디어타입 표현이 복잡하고 낯설다.
- 클라이언트 구현 난이도가 높다. `fetch()`에서 `Accept` 헤더를 직접 설정해야 한다.
- 팀 내 교육 비용이 크고 실수가 많다.

```
버저닝 방식 비교
─────────────────────────────────────────────────────────────────────
방식             URL 형태                  가독성  캐싱   REST 정합
─────────────────────────────────────────────────────────────────────
URL 버저닝       /v2/users/1               ★★★    ★★★   ★
헤더 버저닝      /users/1 + 헤더            ★★     ★★    ★★★
미디어타입       /users/1 + Accept 미디어타입  ★      ★★    ★★★
─────────────────────────────────────────────────────────────────────
실무 채택률       높음                       중간    낮음
─────────────────────────────────────────────────────────────────────
```

---

## 종합

실무에서는 URL 버저닝이 압도적으로 많이 쓰인다. GitHub, Stripe, Twilio 같은 대형 API 제공자 대부분이 URL 버저닝을 채택한다. 이유는 단순하다 — 개발자 경험이 가장 낫다. 문서에서 URL을 복사해서 curl로 바로 테스트할 수 있고, 어떤 버전인지 URL만 보고 즉시 알 수 있다. REST 순수성 측면에서는 헤더·미디어타입 방식이 더 나을 수 있지만, 개발자 생산성과 디버깅 편의성이 REST 교리보다 중요하다는 것이 업계의 합의다.

---

---

# [UNVERIFIED] Fielding이 URL 버저닝을 비판하는 이유는?

## 도입

Roy Fielding은 REST를 창안한 사람인데, 그가 URL 버저닝을 비판한다. 이는 "가장 많이 쓰이는 방식을 REST 창시자가 REST 아니라고 한다"는 아이러니한 상황이다. Fielding의 비판은 REST의 핵심 원칙인 "자원 식별(resource identification)"에 기반한다.

---

## 본문

**Fielding의 핵심 주장: URL은 자원을 식별한다**

REST의 Uniform Interface 제약 중 첫 번째가 "자원 식별(Identification of resources)"이다. URL은 자원의 식별자이고, 같은 자원은 항상 같은 URL을 가져야 한다.

```
자원: "사용자 1번"

올바른 REST:
  GET /users/1  (항상 이 URL로 사용자 1번을 식별)

URL 버저닝:
  GET /v1/users/1  (v1 시대의 사용자 1번)
  GET /v2/users/1  (v2 시대의 사용자 1번)
```

Fielding의 논점: "사용자 1번"은 하나의 자원이다. 그런데 `/v1/users/1`과 `/v2/users/1`은 두 개의 URL이다. 즉, 하나의 자원에 두 개의 식별자가 생긴다. 이는 REST의 "자원 식별" 원칙을 위반한다.

**Fielding의 대안: 표현(Representation) 버저닝**

Fielding의 관점에서 변하는 것은 자원이 아니라 자원의 "표현(representation)"이다. 같은 사용자 1번이지만, v1 클라이언트에게는 JSON 형태 A로, v2 클라이언트에게는 JSON 형태 B로 표현을 달리하면 된다. 이를 위한 HTTP 표준 메커니즘이 Content Negotiation(`Accept` 헤더)이다.

```http
# Fielding이 선호하는 방식
GET /users/1
Accept: application/vnd.myapi.v1+json  → v1 형태로 응답
Accept: application/vnd.myapi.v2+json  → v2 형태로 응답

# URL은 항상 /users/1 — 자원 식별자는 바뀌지 않음
```

**실무가 Fielding을 따르지 않는 이유**

```
Fielding의 주장         실무의 현실
─────────────────────────────────────────────────
URL은 자원 식별자       URL에 버전 넣으면 개발자 경험이 훨씬 낫다
미디어타입 협상 사용     Accept 헤더 직접 쓰는 개발자가 드물다
REST 순수성 유지        API 안정성·팀 생산성이 더 중요하다
```

GitHub, Stripe, AWS 등 업계를 이끄는 회사들은 모두 URL 버저닝을 선택했다. Fielding의 비판을 알면서도 개발자 경험을 우선한 결정이다.

---

## 종합

Fielding의 비판은 "자원 식별자는 변하지 않아야 한다"는 REST 원칙에서 논리적으로 일관된다. `/v1/users/1`과 `/v2/users/1`은 같은 자원에 두 개의 주소를 붙인 것이므로 REST 위반이다. 그러나 이 원칙의 순수한 이행 — 미디어타입 버저닝 — 은 개발자 경험을 희생한다. 업계는 "완벽한 REST"보다 "실용적인 API"를 선택했고, URL 버저닝이 그 결과물이다. Fielding의 비판을 이해하는 것은 REST가 무엇인지 더 깊이 아는 데 의미가 있지만, 실무 결정에서 URL 버저닝을 피할 이유는 없다.
