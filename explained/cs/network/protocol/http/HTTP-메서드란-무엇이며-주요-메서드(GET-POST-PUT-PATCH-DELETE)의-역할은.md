# HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?

> A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.
> GET: The request is for a representation of a resource.
> The server should only retrieve data; not modify state.
> For retrieving without making changes, GET is preferred over POST, as it can be addressed through a URL.
> This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.
> POST: The request is to process a resource in some way.
> For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.
> PUT: The request is to create or update a resource with the state in the request.
> DELETE: The request is to delete a resource.
> PATCH: The request is to modify a resource according to its partial state in the request.
> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

---

**도입**

REST API를 설계할 때 가장 먼저 만나는 결정이 "이 작업에 어떤 HTTP 메서드를 쓸까?"입니다. 무엇을 어떻게 해석하느냐에 따라 캐싱, 안전성, 멱등성이 달라집니다. 표면적으로는 단순한 동사 선택 같지만 — 각 메서드는 서버 동작에 대한 명확한 약속을 가지고 있습니다.

---

**본문**

> A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.

요청은 리소스에 수행할 동작을 분류하기 위해 메서드(비공식적으로 동사라 불리기도 하는)를 식별한다.

- **method**: 메서드. HTTP 요청 시작 줄의 첫 단어 — `GET`, `POST` 등.
- **verb**: 동사. 영어 문법 관점에서 동사 — "가져온다(GET)", "보낸다(POST)" — 같은 행위 표현이라 그렇게 부름.
- **classify the desired action**: 동작을 분류. 같은 URL이라도 메서드에 따라 의미가 달라짐 — `/users`로 GET이면 조회, POST면 생성.

> GET: The request is for a representation of a resource.

GET: 리소스의 표현(representation)을 요청한다.

- **representation**: 표현. 같은 리소스라도 클라이언트의 요청에 따라 다른 형태(JSON, HTML, XML)로 표현될 수 있어서 "표현"이라는 추상 개념을 씀.

> The server should only retrieve data; not modify state.

서버는 데이터를 검색해야 할 뿐이며, 상태를 수정해서는 안 된다.

- **only retrieve**: 검색만. 읽기 전용.
- **not modify state**: 상태 변경 금지. 데이터 변경은 GET의 약속 위반.

> For retrieving without making changes, GET is preferred over POST, as it can be addressed through a URL.

변경 없이 검색할 때는 GET이 POST보다 선호되는데, URL로 주소화할 수 있기 때문이다.

- **addressed through a URL**: URL로 표현 가능. `https://example.com/api/users?page=2` 같은 단일 URL로 요청 정의.

> This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.

이는 북마크와 공유를 가능하게 하고, GET 응답이 캐싱 대상이 되도록 만들어 대역폭을 절약할 수 있다.

- **bookmarking and sharing**: 북마크·공유 가능. URL 그대로 다시 방문하면 같은 결과.
- **eligible for caching**: 캐싱 대상. 브라우저, CDN, 프록시가 GET 응답을 캐시 가능.

> POST: The request is to process a resource in some way.

POST: 리소스를 어떤 방식으로 처리하라는 요청이다.

- **process a resource in some way**: "어떤 방식으로 처리". 매우 모호한 정의 — 의도적입니다. POST는 가장 일반적이고 유연한 메서드.

> For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.

예를 들어, 인터넷 포럼에 메시지 게시, 메일링 리스트 구독, 온라인 쇼핑 결제 완료 등에 사용된다.

- **posting a message**: 게시물 작성. 새 자원 생성.
- **completing a shopping transaction**: 결제. 부작용이 있는 행동.

> PUT: The request is to create or update a resource with the state in the request.

PUT: 요청에 담긴 상태로 리소스를 생성하거나 업데이트하라는 요청이다.

- **create or update**: 생성 또는 갱신. 대상이 없으면 생성, 있으면 업데이트(전체 교체).
- **with the state in the request**: 요청 본문에 담긴 상태로. 클라이언트가 "이 리소스의 최종 상태는 이거"라고 명시 — 서버는 그대로 저장.

> DELETE: The request is to delete a resource.

DELETE: 리소스 삭제 요청이다.

- 단순함. URL이 가리키는 리소스를 삭제.

> PATCH: The request is to modify a resource according to its partial state in the request.

PATCH: 요청에 담긴 부분 상태에 따라 리소스를 수정하라는 요청이다.

- **partial state**: 부분 상태. 변경하려는 필드만 보냄. 나머지는 그대로.

> Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

PUT에 비해 리소스 표현의 일부만 전송하므로 대역폭을 절약할 수 있다.

- **save bandwidth**: 대역폭 절약. 큰 객체에서 한 필드만 바꿀 때 PUT은 전체 전송, PATCH는 그 필드만.

---

**종합**

5가지 메서드의 비교:

| 메서드 | 의미 | 안전 | 멱등 | 본문 | 캐시 | 실무 예 |
|---|---|---|---|---|---|---|
| GET | 리소스 조회 | ○ | ○ | × | ○ | `GET /users/123` |
| POST | 리소스 처리 (보통 생성) | × | × | ○ | △ | `POST /users` (회원가입) |
| PUT | 전체 교체/생성 | × | ○ | ○ | × | `PUT /users/123` (전체 정보 갱신) |
| PATCH | 부분 수정 | × | △ | ○ | × | `PATCH /users/123` (이메일만) |
| DELETE | 삭제 | × | ○ | × | × | `DELETE /users/123` |

JS 코드로 매핑:

```js
// GET — 조회. URL에 모든 정보. 캐시 가능
await fetch('/api/users/123');

// POST — 생성. 서버가 ID 결정
await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Alice', email: 'a@a.com' })
});

// PUT — 전체 교체. 클라이언트가 ID 지정
await fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice', email: 'a@a.com', age: 30 })  // 전체 필드
});

// PATCH — 부분 수정
await fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ email: 'new@a.com' })  // 변경 필드만
});

// DELETE — 삭제
await fetch('/api/users/123', { method: 'DELETE' });
```

이게 없으면 어떻게 되는가:

- 메서드 구분이 없다면 — 모든 요청이 동일한 의미. 캐시 시스템은 어느 응답을 캐시할 수 있는지 모름. 브라우저는 폼 재제출 시 위험을 경고할 수 없음.
- PATCH가 없다면 — 사용자 정보 100개 필드 중 1개를 바꾸려면 PUT으로 100개 전부 전송. 큰 트래픽 낭비.

오개념 예방: HTTP 메서드의 약속(안전, 멱등 등)은 프로토콜이나 서버가 강제하지 않습니다 — 개발자의 약속입니다. GET 핸들러에 데이터 변경 코드를 넣을 수도 있지만, 그렇게 하면 캐시·프리페치 같은 인프라가 의도치 않게 데이터를 변경시킬 수 있습니다(Google Web Accelerator 사건). 메서드 의미를 지키는 건 클라이언트와 인프라가 안전하게 동작하기 위한 약속.

POST와 PUT의 핵심 차이는 "URI를 누가 지정하는가"입니다 — POST는 서버가 새 ID를 할당, PUT은 클라이언트가 URI를 지정. PATCH와 PUT의 차이는 "보내는 양"입니다 — PUT은 전체, PATCH는 일부.
