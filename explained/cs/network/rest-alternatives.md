# [UNVERIFIED] REST의 한계(over-fetching, under-fetching, 다중 라운드트립)는 무엇인가?

## 도입

REST API는 자원(리소스)을 엔드포인트로 표현하는 방식이다. 이 구조는 단순하고 범용적이지만, 클라이언트가 필요한 데이터를 정확히 요청하기 어렵다는 구조적 한계를 낳는다. 세 가지 패턴 — over-fetching, under-fetching, 다중 라운드트립 — 이 여기서 발생한다.

---

## 본문

**Over-fetching: 필요한 것보다 많이 받는다**

`GET /users/1`을 호출하면 서버가 정해진 User 객체 전체를 반환한다.

```http
GET /users/1

HTTP/1.1 200 OK
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "address": "Seoul",
  "createdAt": "2023-01-01",
  "profileImageUrl": "...",
  "bio": "..."
}
```

화면에 이름(`name`)만 표시하면 되는데도 7개 필드를 모두 받는다. 불필요한 데이터가 네트워크를 타고 전달되고, 파싱 비용도 든다. 필드 수가 많거나 중첩 객체가 깊을수록 낭비가 커진다.

**Under-fetching: 필요한 것보다 적게 받아 추가 요청이 필요하다**

반대 상황이다. 사용자의 주문 목록을 보여주려 할 때:

```js
// 사용자 정보 가져오기
const user = await fetch('/users/1').then(r => r.json())

// 주문 목록이 User 객체에 없음 → 별도 요청 필요
const orders = await fetch('/users/1/orders').then(r => r.json())

// 각 주문의 상품 정보도 없음 → 또 요청
const items = await fetch('/orders/42/items').then(r => r.json())
```

하나의 화면을 그리기 위해 3번의 왕복이 필요하다. 자원이 분리된 REST 구조상, 한 번의 요청으로 연관 데이터를 함께 가져오기 어렵다.

**다중 라운드트립(Multiple Round-trips)**

Under-fetching의 연장이다. 위 예시에서 주문이 10개면:

```js
const orders = await fetch('/users/1/orders').then(r => r.json())
// → [{ id: 42 }, { id: 43 }, ..., { id: 51 }]  (10개)

// 각 주문의 상품 정보를 가져오려면 10번 더 호출
const items = await Promise.all(
  orders.map(o => fetch(`/orders/${o.id}/items`).then(r => r.json()))
)
```

이것이 REST의 N+1 문제다. 목록 1번 + 각 항목 N번 = 총 N+1번의 왕복. 목록이 100개면 101번의 HTTP 요청이 발생한다.

```
REST 한계 비교
─────────────────────────────────────────────────────────
문제              현상                       사용자 체감
─────────────────────────────────────────────────────────
Over-fetching     쓸모없는 필드까지 응답      불필요한 대역폭 낭비
Under-fetching    필요한 데이터가 응답에 없음  추가 요청 필요
다중 라운드트립    N+1번의 HTTP 요청          렌더링 지연
─────────────────────────────────────────────────────────
```

---

## 종합

세 가지 한계는 REST의 "엔드포인트 = 자원" 패러다임에서 비롯된다. 서버가 자원 단위로 응답 형태를 고정해두기 때문에, 클라이언트가 필요한 모양의 데이터를 한 번에 가져오기 어렵다. 이 불편함이 커지면서 "클라이언트가 원하는 데이터 형태를 직접 질의한다"는 아이디어로 GraphQL이 등장했다. over-fetching은 불필요한 대역폭 비용으로, under-fetching·다중 라운드트립은 렌더링 지연으로 사용자가 직접 체감하는 문제다.

---

# [UNVERIFIED] GraphQL의 핵심 개념(엔티티 그래프, 단일 엔드포인트, 스키마)과 REST 대비 장점은?

## 도입

GraphQL은 Facebook(Meta)이 2015년 공개한 API 쿼리 언어다. "클라이언트가 원하는 데이터를 정확히 요청한다"가 설계 철학의 핵심이다. REST의 over-fetching·under-fetching 문제를 해결하기 위해 만들어졌다.

---

## 본문

**엔티티 그래프(Entity Graph)**

GraphQL은 서버 데이터를 "그래프" — 노드(Entity)와 엣지(관계) 구조 — 로 모델링한다. `User`가 여러 `Order`를 가지고, 각 `Order`가 여러 `Item`을 가지는 관계를 그래프로 표현한다.

```
User ──has many──▶ Order ──has many──▶ Item
  │
  └──has one──▶ Profile
```

클라이언트는 이 그래프를 따라 원하는 노드와 필드만 선택적으로 요청할 수 있다.

**단일 엔드포인트(Single Endpoint)**

REST는 자원마다 URL이 다르다 (`/users`, `/orders`, `/items`). GraphQL은 모든 요청이 하나의 엔드포인트로 모인다.

```http
POST /graphql
```

어떤 데이터를 요청하든, 어떤 뮤테이션을 수행하든 이 하나의 URL을 사용한다. 무엇을 가져올지는 URL이 아니라 **쿼리 본문**이 결정한다.

**스키마(Schema)**

GraphQL 서버는 타입 시스템(SDL)으로 데이터 형태를 정의한다.

```graphql
type User {
  id: ID!
  name: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  status: String!
  items: [Item!]!
}

type Query {
  user(id: ID!): User
}
```

스키마는 클라이언트가 요청할 수 있는 것과 없는 것을 명확히 정의한다. 타입스크립트의 타입 정의와 비슷한 역할을 하며, 클라이언트 코드 자동 생성(codegen)을 가능하게 한다.

**REST 대비 장점**

```js
// REST: 사용자 이름 + 최신 주문 3개의 상태만 필요한 경우
const user = await fetch('/users/1').then(r => r.json())     // 전체 User 객체
const orders = await fetch('/users/1/orders').then(r => r.json())  // 전체 Order 목록
// → over-fetching + 2번 라운드트립

// GraphQL: 원하는 것만 정확히 요청
const { data } = await apolloClient.query({
  query: gql`
    query {
      user(id: "1") {
        name
        orders(limit: 3) {
          status
        }
      }
    }
  `
})
// → 한 번의 요청으로 name + status만 받음
```

| 항목 | REST | GraphQL |
|---|---|---|
| 요청 횟수 | 자원마다 별도 요청 | 한 번의 쿼리로 통합 |
| 응답 크기 | 서버가 고정 | 클라이언트가 필요한 필드만 선택 |
| 타입 시스템 | 선택적 (OpenAPI) | 내장 (SDL 필수) |
| 엔드포인트 | 자원마다 URL | 단일 `/graphql` |

---

## 종합

GraphQL의 핵심 가치는 "데이터 요청의 주도권을 서버에서 클라이언트로 옮긴다"는 것이다. REST에서 "이 자원은 이 형태"라고 서버가 정해두었다면, GraphQL에서는 "내가 필요한 이 형태로 줘"라고 클라이언트가 요구한다. 이것이 over-fetching·다중 라운드트립을 동시에 해결하는 방식이다. Apollo Client처럼 캐싱과 상태 관리까지 해주는 생태계가 갖춰진 덕분에 프론트엔드 개발자들에게 특히 매력적이다. 단, 이 유연함은 서버 측 구현 복잡도와 맞바꾸는 것이며 다음 질문에서 그 단점을 다룬다.

---

# [UNVERIFIED] GraphQL의 단점(캐싱, N+1, 학습곡선)은?

## 도입

GraphQL이 REST의 한계를 해결하는 것은 맞지만, 그 과정에서 새로운 문제를 만들기도 한다. 은총알(silver bullet)이 아니라 트레이드오프다. 세 가지 주요 단점을 살펴본다.

---

## 본문

**단점 1: HTTP 캐싱이 어렵다**

REST는 `GET /users/1` 같은 URL 단위로 HTTP 캐시가 동작한다. 브라우저·CDN·프록시 모두 URL을 키로 응답을 캐시한다.

```http
GET /users/1
Cache-Control: max-age=3600  → CDN이 1시간 캐시
```

GraphQL은 모든 쿼리가 `POST /graphql`로 전송된다. POST는 HTTP 표준상 캐시 불가 메서드다. 클라이언트 라이브러리(Apollo Client)가 자체 인메모리 캐시를 제공하지만, CDN 레벨의 캐싱은 별도 작업이 필요하다 (Persisted Queries 등).

**단점 2: N+1 문제**

GraphQL 자체가 N+1을 해결하는 것이 아니다. 오히려 resolver 구조상 N+1이 더 쉽게 발생한다.

```graphql
query {
  users {        # 1번 DB 쿼리 → 10명 반환
    name
    orders {     # 각 user마다 1번씩 → 10번 DB 쿼리
      status
    }
  }
}
```

10명의 주문을 가져오는 데 DB 쿼리가 1 + 10 = 11번 발생한다. 이를 해결하려면 DataLoader 같은 배치 처리 도구를 추가로 구현해야 한다.

**단점 3: 학습 곡선과 서버 구현 복잡도**

```
REST 서버 추가 엔드포인트:
  router.get('/users/:id', handler)  → 완료

GraphQL 서버 새 필드 추가:
  1. SDL에 타입 정의 추가
  2. Resolver 함수 작성
  3. DataLoader 설정 (N+1 방지)
  4. 권한(authorization) per-field 처리
  5. 에러 처리 (HTTP 상태코드 대신 errors 배열)
```

REST는 HTTP 표준을 그대로 활용하지만, GraphQL은 별도 레이어가 추가된다. 에러 처리도 다르다 — GraphQL은 항상 `200 OK`를 반환하고 에러를 응답 바디의 `errors` 배열에 담는다. 이를 모르는 개발자는 "200인데 왜 실패했지?" 하고 혼란스러워한다.

```
GraphQL 에러 응답 — 항상 200 OK
{
  "data": null,
  "errors": [
    { "message": "Unauthorized", "locations": [...], "path": ["user"] }
  ]
}
```

---

## 종합

GraphQL의 단점은 "클라이언트에 유연성을 주는 대가로 서버가 복잡해진다"는 패턴으로 수렴된다. HTTP 캐싱은 별도 전략이 필요하고, N+1은 DataLoader 같은 추가 도구가 필요하며, 팀 전체가 GraphQL 사고방식을 익혀야 한다. 이 때문에 팀이 작거나 API가 단순한 경우에는 REST가 여전히 나은 선택이다. GraphQL이 빛나는 상황은 클라이언트가 다양하고(웹·모바일·파트너), 각 클라이언트마다 필요한 데이터 형태가 달라서 REST 엔드포인트를 클라이언트별로 계속 추가·수정해야 하는 경우다.

---

# [UNVERIFIED] gRPC는 무엇이며 어떤 환경(내부 마이크로서비스, 양방향 스트리밍)에서 REST보다 유리한가?

## 도입

gRPC는 Google이 오픈소스로 공개한 RPC(Remote Procedure Call) 프레임워크다. HTTP/2와 Protocol Buffers(protobuf)를 기반으로 하며, REST나 GraphQL과는 다른 패러다임 — "함수 호출처럼 원격 서버의 메서드를 호출한다" — 으로 동작한다. 브라우저-서버 통신보다 **서비스 간(서버-서버) 통신**에 최적화되어 있다.

---

## 본문

**gRPC의 구조**

먼저 `.proto` 파일로 서비스와 메시지 형태를 정의한다.

```protobuf
// user.proto
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);  // 스트리밍
}

message GetUserRequest {
  int32 id = 1;
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}
```

이 `.proto`로 클라이언트·서버 코드를 자동 생성한다. 호출은 HTTP 엔드포인트가 아니라 메서드 이름으로 한다.

```js
// gRPC 클라이언트 (Node.js)
const user = await userService.getUser({ id: 1 })
// REST: await fetch('/users/1')과 달리, 타입이 자동 보장됨
```

**REST 대비 기술적 우위**

| 항목 | REST (HTTP/1.1 + JSON) | gRPC (HTTP/2 + protobuf) |
|---|---|---|
| 직렬화 | JSON (텍스트) | protobuf (바이너리) |
| 성능 | 상대적으로 느림 | 3~10배 빠른 직렬화 |
| 타입 | OpenAPI 선택적 | proto 스키마 필수·자동생성 |
| 스트리밍 | SSE·WebSocket 별도 구성 | 내장 (단방향·양방향) |
| 멀티플렉싱 | HTTP/1.1: 비효율 | HTTP/2 기본 |

**마이크로서비스 환경에서 유리한 이유**

내부 서비스 간 통신에서:

- 초당 수천 번의 서비스 간 호출이 발생한다
- JSON 파싱 비용이 누적된다
- 타입 불일치로 런타임 에러가 발생하기 쉽다

gRPC는 protobuf 바이너리 직렬화로 JSON 대비 페이로드가 작고 파싱이 빠르다. `.proto` 스키마를 공유하면 서비스 간 인터페이스가 컴파일 타임에 검증된다.

```
마이크로서비스 통신 흐름
─────────────────────────────────────────────────────
API Gateway
    │ REST (외부 클라이언트용)
    ▼
Order Service ──gRPC──▶ User Service
                ──gRPC──▶ Payment Service
                ──gRPC──▶ Inventory Service

외부: REST (HTTP/JSON, 브라우저 호환)
내부: gRPC (HTTP/2 + protobuf, 성능 최적화)
```

**양방향 스트리밍**

gRPC는 HTTP/2의 스트리밍을 네이티브로 지원한다.

```protobuf
// 서버 스트리밍: 서버가 여러 메시지를 순차적으로 전송
rpc StreamLogs (LogRequest) returns (stream LogEntry);

// 양방향 스트리밍: 클라이언트와 서버가 동시에 주고받음
rpc Chat (stream ChatMessage) returns (stream ChatMessage);
```

REST로 같은 것을 구현하려면 WebSocket이나 SSE를 별도로 구성해야 하지만, gRPC는 프로토콜 수준에서 지원한다.

**브라우저에서 gRPC가 어려운 이유**

브라우저는 HTTP/2 요청을 직접 제어하지 못한다 (`fetch()` API는 HTTP/1.1 시맨틱으로 추상화됨). 따라서 브라우저에서 gRPC를 직접 쓰려면 gRPC-Web이라는 별도 프로토콜(프록시 필요)을 거쳐야 한다. 이것이 브라우저-서버 통신에서 gRPC가 잘 쓰이지 않는 이유다.

---

## 종합

gRPC는 "서비스 간 통신에서 REST가 너무 느리고 타입이 불안하다"는 문제를 해결한다. protobuf 바이너리와 HTTP/2 멀티플렉싱으로 성능을 높이고, `.proto` 스키마로 인터페이스를 강타입으로 계약한다. 마이크로서비스 아키텍처에서 내부 통신이 수백만 회가 되면 이 성능 차이가 인프라 비용 차이로 직결된다. 반면 외부 클라이언트(브라우저, 모바일 앱)와의 통신에는 REST나 GraphQL이 적합하고, gRPC는 그 뒤에서 서비스 간을 연결하는 역할을 맡는 것이 일반적인 패턴이다.
