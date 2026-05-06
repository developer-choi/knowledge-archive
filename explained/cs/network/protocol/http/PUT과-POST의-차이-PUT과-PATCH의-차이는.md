# PUT과 POST의 차이, PUT과 PATCH의 차이는?

> POST: The request is to process a resource in some way.
> PUT: The request is to create or update a resource with the state in the request.
> A distinction from POST is that the client specifies the target location on the server.
> PATCH: The request is to modify a resource according to its partial state in the request.
> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

---

**도입**

REST API를 설계할 때 가장 헷갈리는 게 PUT vs POST, PUT vs PATCH입니다. 새 사용자 생성에 PUT 써도 되나? 이메일만 바꿀 때 PUT이 나을까 PATCH가 나을까? 답은 — POST/PUT은 "URI를 누가 지정하는가", PUT/PATCH는 "전체를 보내는가 일부를 보내는가"의 차이입니다.

---

**본문**

> POST: The request is to process a resource in some way.

POST: 리소스를 어떤 방식으로 처리하라는 요청.

- **process in some way**: 어떤 방식으로든 처리. 매우 모호 — 생성, 검색, 트랜잭션 처리 등 거의 모든 것이 가능.

> PUT: The request is to create or update a resource with the state in the request.

PUT: 요청에 담긴 상태로 리소스를 생성하거나 업데이트.

- **create or update**: 생성 또는 갱신.
- **with the state in the request**: 요청 본문이 곧 리소스의 최종 상태가 됨. 클라이언트가 "이 리소스는 이 모양이어야 해"라고 명령.

> A distinction from POST is that the client specifies the target location on the server.

POST와의 차이는 클라이언트가 서버 상의 대상 위치를 지정한다는 점이다.

- **client specifies the target location**: 클라이언트가 URI를 정함. `PUT /users/123`처럼 ID 123 지정.
- POST는 서버가 위치를 결정 — `POST /users`로 보내면 서버가 새 ID 발급해 응답에 알림.

> PATCH: The request is to modify a resource according to its partial state in the request.

PATCH: 요청에 담긴 부분 상태로 리소스를 수정.

- **partial state**: 부분 상태. 변경하려는 필드만.

> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

PUT과 비교해 리소스 표현 전체가 아닌 일부만 보내므로 대역폭을 절약할 수 있다.

- **only part of a resource's representation**: 표현의 일부만. 사용자 객체의 100개 필드 중 1개만 보냄.
- **save bandwidth**: 대역폭 절약. 큰 객체일수록 효과 큼.

---

**종합**

세 메서드의 비교:

| 측면 | POST | PUT | PATCH |
|---|---|---|---|
| URI를 누가 지정 | 서버 (ID 자동 발급) | 클라이언트 | 클라이언트 |
| 보내는 양 | 자유 | 전체 (모든 필드) | 일부 (변경 필드) |
| 같은 요청 반복 | 매번 새 결과 (비멱등) | 같은 결과 (멱등) | 보통 같은 결과 (멱등이려면 설계 주의) |
| 주 용도 | 생성, 처리 (모호) | 전체 교체, 클라이언트 ID로 생성 | 부분 수정 |

같은 "사용자 정보 변경"을 세 방식으로 해보면:

```js
// 사용자 123의 이메일만 변경

// POST — 비표준이지만 흔한 방식 (PATCH 등장 전)
await fetch('/api/users/123', {
  method: 'POST',
  body: JSON.stringify({ email: 'new@a.com' })
});

// PUT — 전체를 보내야 함 (필수 필드 다 포함)
await fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({
    name: 'Alice',         // 변경 안 했지만 보내야 함
    email: 'new@a.com',
    age: 30,               // 변경 안 했지만 보내야 함
    address: '...',        // 변경 안 했지만 보내야 함
    // 빠진 필드는 null로 처리될 수 있음 (스펙상 모호)
  })
});

// PATCH — 변경 필드만
await fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ email: 'new@a.com' })
});
```

**POST vs PUT의 핵심 — 누가 URI를 정하는가:**

```js
// POST — 서버가 ID 발급
const res = await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Alice' })
});
const { id } = await res.json();  // 서버가 부여한 ID (예: 456)

// PUT — 클라이언트가 ID 지정 (UUID 등으로)
const newId = crypto.randomUUID();
await fetch(`/api/users/${newId}`, {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice' })
});
// 클라이언트가 newId를 결정. 같은 newId로 또 PUT 보내도 결과 동일 (멱등)
```

**PUT vs PATCH의 핵심 — 전체 vs 일부:**

PUT은 "리소스의 새 상태는 이거다"라는 명령. 본문에 빠진 필드는 — 스펙상 모호하지만 실무에선 보통 null/삭제로 처리됩니다. 그래서 부분 수정에 PUT을 쓰면 의도치 않은 데이터 손실이 생길 수 있습니다.

PATCH는 "이 필드만 이렇게 바꿔라"라는 명령. 빠진 필드는 그대로 유지.

이게 없으면 어떻게 되는가:

- POST만 있고 PUT/PATCH가 없다면 — 모든 변경이 비멱등. 네트워크 재시도 시 중복 처리 위험. 캐시·프록시도 어떤 응답을 안전하게 다룰지 모름.
- PUT만 있고 PATCH가 없다면 — 부분 수정마다 전체 객체 전송. 사용자 프로필이 큰 SNS에서 "프로필 사진만 변경"에도 전체 데이터 전송 → 트래픽 낭비.

오개념 예방: PUT이 멱등이라고 해서 같은 요청을 여러 번 보내도 결과가 같다는 것이지, 부작용이 없다는 뜻은 아닙니다. PUT으로 리소스 생성 시 첫 번째와 이후 요청이 모두 "이 ID에 이 상태"를 보장하므로 멱등이지만, 첫 요청에서 데이터베이스에 새 행이 생긴 것 자체는 변경입니다.

PATCH의 멱등성은 설계에 따라 달라집니다 — `PATCH /users/123 {balance: 100}`(절대값 설정)은 멱등이지만, `PATCH /users/123 {balance: balance + 100}`(증감)은 비멱등. RFC 5789는 PATCH의 멱등성을 강제하지 않습니다.

AI Annotation 보충: PUT vs POST는 "클라이언트가 리소스의 대상 URI를 지정하는가"가 핵심 — PUT은 `PUT /users/123`처럼 명시, POST는 `POST /users`로 보내고 서버가 ID 할당. PUT vs PATCH는 "전체를 교체하는가, 일부만 수정하는가"가 핵심.
