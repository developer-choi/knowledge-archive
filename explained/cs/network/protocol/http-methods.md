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

---

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

---

# HTTP에서 safe method란 무엇인가?

> A request method is safe if a request with that method has no intended effect on the server.
> The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.
> In other words, safe methods are intended to be read-only.
> In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.
> They may modify the state of the server or have other effects such as sending an email.

---

**도입**

브라우저가 페이지를 미리 가져오는 prefetch 기능이나 검색 엔진의 크롤러를 떠올려 보세요. 둘 다 사용자 의사 없이 자동으로 URL을 호출합니다. 이 자동 호출이 데이터를 삭제하거나 결제를 발생시키면 큰일입니다 — 그래서 HTTP는 "자동으로 호출해도 안전한 메서드"를 정해뒀습니다. 그게 safe method입니다.

---

**본문**

> A request method is safe if a request with that method has no intended effect on the server.

요청 메서드는 그 메서드의 요청이 서버에 의도된 효과(부작용)를 갖지 않으면 safe하다.

- **safe**: 안전한. "데이터를 변경하지 않는"이라는 약속.
- **no intended effect on the server**: 서버에 의도된 효과 없음. "의도된"이 핵심 — 로그 기록 같은 부수적 효과는 있을 수 있지만, 의도된 데이터 변경은 없어야 함.

> The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.

GET, HEAD, OPTIONS, TRACE 메서드가 safe로 정의된다.

- **GET**: 리소스 조회. 가장 흔한 safe 메서드.
- **HEAD**: GET과 동일하지만 응답 헤더만 받음(본문 없음). 리소스 존재 여부·메타정보 확인용.
- **OPTIONS**: 서버가 어떤 메서드를 지원하는지 묻기. CORS preflight에서 사용.
- **TRACE**: 디버깅용. 요청을 받은 그대로 에코백. 보안 위험으로 거의 사용 안 됨.

> In other words, safe methods are intended to be read-only.

다시 말해, safe 메서드는 읽기 전용으로 의도된다.

- **read-only**: 읽기만. 데이터를 가져오는 것은 OK, 변경하는 것은 not OK.
- **intended**: 의도된. 약속이지 강제가 아님 — 서버가 GET 핸들러에 변경 코드를 넣을 수도 있지만, 그건 약속 위반.

> In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.

반대로 POST, PUT, DELETE, CONNECT, PATCH 메서드는 safe하지 않다.

- **POST**: 새 리소스 생성, 결제 처리 등. 부작용 명시적.
- **PUT**: 전체 교체. 데이터 변경.
- **DELETE**: 삭제. 가장 명확한 변경.
- **CONNECT**: 프록시를 통한 터널링. 연결 생성 자체가 부작용.
- **PATCH**: 부분 수정. 데이터 변경.

> They may modify the state of the server or have other effects such as sending an email.

이들은 서버 상태를 수정하거나 이메일 전송 같은 다른 효과를 가질 수 있다.

- **modify the state of the server**: 서버 상태 변경. DB 레코드 추가/수정/삭제.
- **other effects such as sending an email**: 다른 부작용. 이메일 전송, 결제, 외부 API 호출 등 — 한 번 일어나면 되돌릴 수 없는 행위.

---

**종합**

safe와 not-safe 메서드의 비교:

| 메서드 | safe | 의도된 효과 |
|---|---|---|
| GET | ○ | 데이터 조회만 |
| HEAD | ○ | 헤더만 조회 |
| OPTIONS | ○ | 지원 메서드 확인 |
| TRACE | ○ | 요청 에코백 |
| POST | × | 처리·생성, 부작용 가능 |
| PUT | × | 전체 교체 |
| PATCH | × | 부분 수정 |
| DELETE | × | 삭제 |
| CONNECT | × | 터널 생성 |

safe method는 자동화 시스템의 안전 가드레일입니다:

- **브라우저 prefetch**: `<link rel="prefetch">`로 다음에 방문할 페이지를 미리 가져옴. GET만 자동 호출 — 데이터 변경 위험 없음.
- **검색 엔진 크롤러**: GET으로 페이지를 긁어 인덱싱. 사이트 데이터를 임의로 변경하지 않음.
- **링크 미리보기**: Slack, 카카오톡이 URL을 받으면 자동으로 GET해서 OG 태그를 가져옴. 이게 결제를 발생시키면 안 되니까.

JS 개발자에게 와닿는 사례:

```js
// 안전 — GET은 부작용 없어야 하므로 prefetch에 적합
await fetch('/api/users/123');                 // safe

// 위험 — GET으로 데이터 변경하면 prefetch가 의도치 않은 변경 발생
await fetch('/api/users/123/delete');          // 메서드가 GET이지만 URL이 동작 암시 → 위험!
// 차라리:
await fetch('/api/users/123', { method: 'DELETE' });
```

이게 없으면 어떻게 되는가:

- safe 메서드 약속이 없다면 — 브라우저 prefetch, 크롤러, 캐시 워밍 같은 자동화가 데이터를 망가뜨릴 위험이 있어 사실상 불가능했을 것.
- Google Web Accelerator 사건(2005): GET으로 데이터 변경(예: `/article/123/delete`)을 허용한 사이트가 있었습니다. Web Accelerator가 페이지의 모든 링크를 GET으로 미리 호출 → 게시물이 대량 삭제되는 사고. safe method 위반의 대표적 사례.

오개념 예방: safe하다고 캐싱 가능한 건 별개입니다. GET은 보통 캐시 가능하지만, `Cache-Control: no-store` 같은 헤더로 캐시 거부 가능. 반대로 safe하지 않은 메서드라도 응답에 따라 캐시 전략이 다를 수 있습니다.

safe와 idempotent의 관계: safe ⊂ idempotent. safe하면 자동으로 idempotent(여러 번 보내도 같은 결과 — 어차피 변경 없으니까). 하지만 idempotent라고 safe인 건 아닙니다 — DELETE는 idempotent이지만 safe하지 않습니다(여러 번 보내도 같은 결과지만 데이터 변경).

---

# safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?

> Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.
> Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.
> For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.
> A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.
> One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.
> The beta was suspended only weeks after its first release, following widespread criticism.

---

**도입**

앞 질문에서 GET이 "safe"라는 약속을 가진 메서드라고 봤습니다. 하지만 약속은 강제가 아니라 합의입니다. 한 사이트의 잘못된 코드 + 브라우저의 정상 동작이 만나 대규모 데이터 손실 사고가 일어났던 게 2005년 Google Web Accelerator 사건입니다. safe method 약속을 깨면 어떤 일이 일어나는지 보여주는 가장 유명한 사례입니다.

---

**본문**

> Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.

GET 요청에 규정된 안전성에도 불구하고, 실제로 서버의 처리는 기술적으로 어떤 식으로도 제한되지 않는다.

- **prescribed safety**: 규정된 안전성. RFC 표준이 GET을 safe로 정의했음.
- **not technically limited**: 기술적으로 제한 안 됨. 서버 코드가 GET 핸들러에서 데이터를 변경하는 것을 막는 메커니즘이 없음. 약속이지 강제가 아님.

> Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.

부주의하거나 의도적으로 비정상적인 프로그래밍으로 인해 GET 요청이 서버에 사소하지 않은 변경을 일으킬 수 있다.

- **careless**: 부주의. 개발자가 약속을 모르거나 무시.
- **non-trivial changes**: 사소하지 않은 변경. 데이터 삭제, 결제, 메일 발송 등 — 되돌릴 수 없는 변경.

> For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.

예를 들어, 어떤 웹사이트가 `https://example.com/article/1234/delete` 같은 URL을 통한 리소스 삭제를 허용한다면, 이 URL을 임의로 가져올 때(심지어 GET으로) 단순히 게시물이 삭제될 수 있다.

- **arbitrarily fetched**: 임의로 가져옴. 사용자 의도가 아니라 자동화 도구가 가져옴.
- **even using GET**: GET이라도. 이게 핵심 — GET이라 안전할 거라는 가정이 깨짐.
- **simply delete the article**: 단순히 게시물 삭제. 의도치 않은 데이터 손실.

> A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.

제대로 코딩된 웹사이트라면 이 동작에 DELETE나 POST 메서드를 요구하며, 악의 없는 봇은 그런 요청을 하지 않을 것이다.

- **properly coded**: 올바르게 작성된. safe method 원칙을 지킨.
- **DELETE or POST**: 데이터 변경에 적절한 메서드. 자동 호출되지 않음.
- **non-malicious bots would not make**: 악의 없는 봇은 안 보냄. 정상 봇은 GET만 자동 호출 — 데이터 변경 메서드를 임의로 보내지 않음.

> One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.

이 일이 실제로 일어난 예가 잠시 운영된 Google Web Accelerator 베타로, 사용자가 보고 있는 페이지의 임의 URL을 prefetch해서 레코드가 대량으로 자동 변경 또는 삭제되도록 만들었다.

- **Google Web Accelerator**: 2005년 Google이 출시한 Firefox/IE 확장. 페이지의 링크들을 미리 가져와 캐시해 사용자 클릭 시 즉시 표시 — 좋은 의도의 성능 최적화.
- **prefetched arbitrary URLs**: 페이지의 모든 링크를 GET으로 미리 가져옴.
- **records altered or deleted en masse**: 레코드가 대량으로 변경·삭제. 사용자가 클릭하지 않았는데도.

> The beta was suspended only weeks after its first release, following widespread criticism.

베타는 광범위한 비판 끝에 첫 출시 몇 주 후에 중단되었다.

- **suspended only weeks after**: 몇 주 만에 중단. 빠른 철회.
- **widespread criticism**: 광범위한 비판. 운영자들의 피해 호소가 쏟아짐.

---

**종합**

이 사건의 인과 관계를 정리하면:

| 단계 | 주체 | 동작 |
|---|---|---|
| 1. 잘못된 사이트 코드 | 일부 웹사이트 | `GET /article/123/delete` 같은 URL이 실제 삭제 수행 |
| 2. 사용자 페이지 방문 | 사용자 | 관리 페이지 등에 위 URL의 링크들이 노출됨 |
| 3. Google Web Accelerator의 prefetch | Web Accelerator | 페이지의 모든 링크를 자동으로 GET 호출 |
| 4. 결과 | — | 사용자가 클릭하지 않았는데도 게시물 대량 삭제 |

이 사건의 교훈:

- **약속을 강제하지 않는 분산 시스템에서 약속은 기능적 제약과 거의 같다.** GET이 safe라는 약속을 깨면 그 사이트는 자동화의 모든 형태(브라우저 prefetch, 크롤러, 캐시 워밍, 링크 미리보기)에 취약해진다.
- **서버는 클라이언트가 누구인지 모른다.** 사용자의 의도적 클릭과 자동화 도구의 prefetch를 구분 못 하니, GET이라는 정보 외에는 의도를 알 수 없다.

JS 개발자가 만들 수 있는 안티패턴들:

```js
// 안티패턴 1: GET으로 데이터 변경
fetch('/api/articles/123/delete');  // 절대 안 됨

// 안티패턴 2: 링크로 데이터 변경
<a href="/articles/123/delete">삭제</a>  // 클릭 = GET. 위험!

// 정답: 데이터 변경은 명시적 메서드로
await fetch('/api/articles/123', { method: 'DELETE' });

// 또는 form POST
<form method="POST" action="/articles/123/delete">
  <button type="submit">삭제</button>
</form>
```

이게 없으면 어떻게 되는가: safe method 약속이 없었다면 — Google Web Accelerator 같은 도구뿐 아니라, 페이스북 미리보기, Slack 링크 unfurl, 검색 엔진 크롤러, 보안 스캐너 모두가 데이터를 망가뜨릴 위험이 있어 동작 불가. 웹의 자동화 인프라 전체가 성립 못 함.

오개념 예방: 이 사건이 Google의 잘못이라고 생각하기 쉽지만 — 실제로는 RFC 표준을 위반한 사이트들의 잘못이 더 큽니다. Google Web Accelerator는 GET이 safe라는 표준 약속을 신뢰했을 뿐. 다만 이 사건을 계기로 prefetch 기능이 더 보수적으로 설계되었고, 표준에 "심지어 사이트가 위반해도 prefetch는 안전해야 한다"는 가이드가 추가됐습니다.

이 사건이 남긴 또 다른 영향: REST API 설계에서 데이터 변경에는 반드시 POST/PUT/DELETE를 사용하라는 관행이 굳어진 결정적 사건이었습니다. 이전엔 단순함을 위해 GET으로 모든 걸 처리하는 사이트도 있었지만 — 이후 "그건 위험한 안티패턴"이라는 합의가 형성됐습니다.

```
        [Google Web Accelerator 사고 시나리오]

   사이트 코드 (잘못된 설계):
     <a href="/article/1234/delete">삭제</a>
     서버: GET /article/1234/delete -> 실제 삭제 수행

   사용자                Web Accelerator         서버
     |                        |                  |
     | (1) 관리 페이지 열기   |                  |
     |----------------------->|------ GET 페이지 |
     |                        |                  |
     |          페이지 응답 (수십 개의 삭제 링크 포함)
     |<-----------------------|<-----------------|
     |                        |
     |                        | (2) 모든 링크 prefetch (백그라운드)
     |                        |    (사용자가 클릭할 가능성에 대비)
     |                        |
     |                        | GET /article/1234/delete
     |                        |----------------------->|
     |                        | GET /article/1235/delete
     |                        |----------------------->|
     |                        | GET /article/1236/delete
     |                        |----------------------->|
     |                        |   ...수십 개 동시 호출
     |                        |
     |                        |        (3) 서버: 각 GET 처리
     |                        |             = 게시물 대량 삭제
     |                        |
     | (4) 사용자: 페이지 새로고침
     |     "내 게시물이 다 사라졌다!"
     |

   사용자는 단 한 번도 "삭제"를 클릭하지 않았다.
   GET = safe라는 약속을 사이트가 깨뜨린 결과.
```

---

# HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.
> The methods PUT and DELETE, and safe methods are defined as idempotent.
> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.
> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent, and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.
> Note that whether or not a method is idempotent is not enforced by the protocol or web server.

---

**도입**

네트워크는 불안정합니다. 요청을 보냈는데 응답이 안 오면 — 서버에 도달했는지, 응답만 잃어버렸는지 알 수 없습니다. 안전하게 재시도하려면 "여러 번 보내도 같은 결과"인 메서드여야 합니다. 이 성질이 idempotent(멱등성)이고, 안전한 자동 재시도가 가능한 메서드를 가르는 기준입니다.

---

**본문**

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.

요청 메서드는 그 메서드의 동일한 요청을 여러 번 보낸 효과가 한 번 보낸 효과와 같으면 멱등하다.

- **idempotent**: 멱등. 같은 동작을 반복해도 결과가 같은 성질. 수학에서 온 용어 — `f(f(x)) = f(x)`.
- **multiple identical requests**: 여러 번의 동일한 요청. "동일한"이 중요 — 같은 메서드, URL, 헤더, 본문.
- **same effect as a single such request**: 한 번 보낸 것과 동일한 효과. 결과뿐 아니라 서버 상태까지 같음.

> The methods PUT and DELETE, and safe methods are defined as idempotent.

PUT, DELETE 메서드와 safe 메서드들이 멱등으로 정의된다.

- **PUT**: 멱등. `PUT /users/123 {name: "Alice"}`을 100번 보내도 user 123의 이름은 "Alice".
- **DELETE**: 멱등. `DELETE /users/123`을 한 번 보내면 삭제, 두 번째부터는 이미 없음. 결과적으로 동일한 상태.
- **safe methods**: GET, HEAD, OPTIONS, TRACE — 모두 멱등.

> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever;

safe 메서드는 자명하게 멱등하다. 서버에 어떤 효과도 의도하지 않기 때문.

- **trivially idempotent**: 자명하게 멱등. 변경이 없으니 몇 번을 보내든 결과는 같음 — 너무 당연.
- **no effect on the server whatsoever**: 서버에 어떤 영향도 없음. 변경 없는데 어떻게 결과가 달라지겠나.

> the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.

한편 PUT과 DELETE 메서드는 연속된 동일 요청이 무시되기 때문에 멱등하다.

- **successive identical requests**: 연속된 동일 요청. 두 번째, 세 번째 요청.
- **will be ignored**: 무시됨. 두 번째 PUT은 같은 상태를 다시 설정 → 변화 없음. 두 번째 DELETE는 이미 없는 걸 또 지우려 함 → 변화 없음.

> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent,

반대로 POST, CONNECT, PATCH는 반드시 멱등이지는 않다.

- **not necessarily idempotent**: 멱등이 보장되지 않음. 멱등일 수도 있고 아닐 수도 있음 — 구현에 달림.
- **POST**: 일반적으로 비멱등. 여러 번 보내면 새 자원이 여러 개 생성될 수 있음.
- **PATCH**: 비멱등 가능. 절대값 설정(`{balance: 100}`)은 멱등, 증감(`{balance: balance + 100}`)은 비멱등.
- **CONNECT**: 터널 생성. 부작용 있음.

> and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.

따라서 동일한 POST 요청을 여러 번 보내면 서버 상태가 더 변경되거나, 여러 개의 이메일 전송 같은 추가 효과가 생길 수 있다.

- **further modify the state**: 서버 상태가 더 변경. 같은 요청 N번 = N개의 새 레코드 생성 가능성.
- **sending multiple emails**: 여러 이메일 전송. 결제 알림이 N번, 환영 메일이 N번 — 사용자에게 명확한 부작용.

> Note that whether or not a method is idempotent is not enforced by the protocol or web server.

메서드가 멱등인지 아닌지는 프로토콜이나 웹 서버에 의해 강제되지 않는다는 점에 주의.

- **not enforced**: 강제 안 됨. PUT 핸들러를 비멱등하게 짤 수도 있고, POST를 멱등하게 짤 수도 있음. 약속이지 강제가 아님.

---

**종합**

각 메서드의 멱등성:

| 메서드 | 멱등 | 이유 |
|---|---|---|
| GET | ○ | 변경 없음 |
| HEAD | ○ | 변경 없음 |
| OPTIONS | ○ | 변경 없음 |
| TRACE | ○ | 변경 없음 |
| PUT | ○ | 같은 상태로 덮어쓰기 |
| DELETE | ○ | 두 번째부터는 변화 없음 |
| POST | × | 매번 새 레코드 가능 |
| PATCH | △ | 구현에 따라 |
| CONNECT | × | 터널 매번 생성 |

JS 개발자가 만나는 실무적 의미:

```js
// 멱등 — 안전하게 재시도 가능
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
}

// GET은 멱등이라 재시도 안전
await fetchWithRetry('/api/users/123');

// PUT도 멱등이라 재시도 안전
await fetchWithRetry('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice' })
});

// 단, POST는 위험! 네트워크 오류로 응답만 못 받았는데 서버에선 처리됐으면
// 재시도가 중복 처리를 만든다
await fetchWithRetry('/api/orders', { method: 'POST', ... });  // 위험
```

POST를 안전하게 재시도하는 패턴 — Idempotency Key:

```js
const idempotencyKey = crypto.randomUUID();
await fetchWithRetry('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ ... })
});
// 서버가 같은 키 보면 두 번째부터는 첫 결과 반환 → 중복 처리 방지
// Stripe API가 이 패턴 사용
```

이게 없으면 어떻게 되는가:

- 멱등성 약속이 없다면 — 네트워크 재시도가 위험. 결제 시스템이 사용자에게 이중 청구하는 사고 빈발. 분산 시스템의 신뢰성 보장이 어려움.
- HTTP 클라이언트(브라우저, 라이브러리)가 자동 재시도를 못 하므로 — 일시적 네트워크 오류에 대한 회복성이 모든 곳에서 수동으로 다뤄져야 함.

오개념 예방: "POST를 절대 재시도하면 안 된다"는 건 너무 일방적입니다. 멱등하지 않을 가능성이 있다는 뜻이지 — 서버가 Idempotency-Key 같은 메커니즘을 제공하면 안전하게 재시도 가능. 핵심은 "서버 구현의 약속을 알고 사용하라"입니다.

safe와 idempotent의 관계: safe ⊂ idempotent. safe는 변경 없으므로 자동으로 idempotent. 반대는 아님 — DELETE는 idempotent이지만 safe하지 않습니다. 첫 DELETE에서 데이터가 사라지는 것 자체는 부작용이니까.

AI Annotation 보충: 멱등 정리하면 GET/PUT/DELETE = 멱등 (여러 번 보내도 한 번과 같음), POST/PATCH = 비멱등 (중복 시 부작용). 이 분류가 자동 재시도 가능 여부의 기준이며, REST API 설계에서 메서드를 고를 때 가장 중요한 고려 사항 중 하나입니다.

---

# POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

> In some cases this is the desired effect, but in other cases it may occur accidentally.
> A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.
> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

---

**도입**

쇼핑몰에서 결제 버튼을 눌렀는데 응답이 늦어지자 또 누른 경험이 있나요? 운이 나쁘면 결제가 두 번 됩니다. POST가 비멱등이라는 추상적 사실이 실무에서는 이런 구체적 문제로 나타납니다. 그리고 이건 서버나 프로토콜이 아니라 — 웹 애플리케이션이 책임지고 처리해야 하는 영역입니다.

---

**도입 추가**

앞 질문에서 POST가 비멱등이라 같은 요청을 여러 번 보내면 부작용이 누적된다는 걸 봤습니다. 이번엔 이게 사용자 행동과 만났을 때 어떤 모습으로 나타나고, 누가 책임지고 막아야 하는지 봅니다.

---

**본문**

> In some cases this is the desired effect, but in other cases it may occur accidentally.

어떤 경우에는 이게 의도된 효과이지만, 다른 경우에는 우발적으로 발생할 수 있다.

- **desired effect**: 의도된 효과. 댓글 2개 작성처럼 정말 두 번 처리하길 원할 때.
- **occur accidentally**: 우발적 발생. 사용자는 한 번 처리되길 원했는데 실수로 두 번 보냄.

> A user might, for example, inadvertently send multiple POST requests by clicking a button again

예를 들어, 사용자가 버튼을 다시 클릭해 의도치 않게 여러 POST 요청을 보낼 수 있다.

- **inadvertently**: 의도치 않게. 사용자가 부주의해서가 아니라, UI가 진행 상황을 알려주지 않아서.
- **clicking a button again**: 버튼 재클릭. "왜 반응이 없지?" 하며 또 누름.

> if they were not given clear feedback that the first click was being processed.

첫 번째 클릭이 처리되고 있다는 명확한 피드백을 받지 못한 경우.

- **clear feedback**: 명확한 피드백. 로딩 스피너, 버튼 비활성화, 진행 메시지 등. UX 디자인의 영역.
- **first click was being processed**: 첫 클릭 처리 중. 사용자에게 "지금 처리 중이니 기다려"를 시각적으로 알려야 함.

> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request,

웹 브라우저가 페이지 새로고침이 POST 요청을 재제출할 수 있는 경우 사용자에게 경고하는 알림 대화상자를 띄우기는 하지만.

- **alert dialog boxes**: 경고 다이얼로그. "Confirm Form Resubmission" 같은 익숙한 메시지.
- **reloading a page**: 페이지 새로고침. F5나 Ctrl+R.
- **re-submit a POST request**: POST 재제출. POST로 폼을 제출한 후 새로고침하면 같은 요청이 다시 갈 수 있음.

> it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

POST 요청이 한 번 이상 제출되어서는 안 되는 경우를 처리하는 것은 일반적으로 웹 애플리케이션의 책임이다.

- **up to the web application**: 애플리케이션의 책임. 브라우저나 HTTP 프로토콜이 아닌 — 우리가 짜는 코드가 막아야 함.
- **should not be submitted more than once**: 한 번 이상 제출되면 안 됨. 결제, 주문, 가입 등 — 중복이 사용자에게 손해인 동작.

---

**종합**

POST 중복 제출이 일어나는 시나리오:

| 시나리오 | 원인 | 결과 |
|---|---|---|
| 버튼 연타 | 응답 지연 + UI 피드백 부족 | 중복 결제, 중복 주문 |
| 페이지 새로고침 (F5) | POST 폼 제출 후 새로고침 | 같은 폼 데이터 재전송 |
| 브라우저 뒤로가기 | POST 결과 페이지에서 뒤로가기 후 다시 제출 | 같은 결제 두 번 |
| 네트워크 재시도 | 클라이언트 라이브러리의 자동 재시도 | 같은 요청 N번 처리 |

웹 애플리케이션이 책임지고 막아야 하는 방법들:

**프론트엔드**:

```jsx
// 1. 버튼 비활성화
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit() {
  if (isSubmitting) return;     // 이미 처리 중이면 무시
  setIsSubmitting(true);
  try {
    await fetch('/api/orders', { method: 'POST', body: ... });
  } finally {
    setIsSubmitting(false);
  }
}

return (
  <button onClick={handleSubmit} disabled={isSubmitting}>
    {isSubmitting ? '처리 중...' : '결제하기'}
  </button>
);
```

```jsx
// 2. 디바운스/throttle
import { useDebouncedCallback } from 'use-debounce';

const debouncedSubmit = useDebouncedCallback(handleSubmit, 1000);
// 1초 내 연속 클릭은 한 번으로 합쳐짐
```

**백엔드** (Idempotency Key):

```js
// 클라이언트가 매 요청마다 고유 키 생성
const idempotencyKey = crypto.randomUUID();
await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ amount: 50000 })
});

// 서버는 같은 키를 본 적 있으면 첫 처리 결과를 다시 반환 (중복 처리 X)
// Stripe, AWS API가 이 패턴 사용
```

이게 없으면 어떻게 되는가:

- 중복 방지가 없다면 — 결제 시스템이 사용자에게 이중 청구하는 사고가 빈발. 환불 처리, CS 문의가 늘고 사용자 신뢰 손상.
- "POST가 비멱등"이라는 사실은 약속이지 강제가 아니므로 — 애플리케이션이 적극적으로 막지 않으면 자연스럽게 중복이 발생.

오개념 예방: "Post-Redirect-Get(PRG) 패턴"이 새로고침으로 인한 POST 재제출을 막는 표준 방법입니다. POST 처리 후 응답으로 `303 See Other`를 보내고, 클라이언트가 Location 헤더의 GET 페이지로 이동하게 함. 이러면 새로고침해도 GET이 재실행될 뿐 POST는 다시 안 됨.

```js
// 서버 측 PRG 예
app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  res.redirect(303, `/orders/${order.id}/success`);  // GET 페이지로 리다이렉트
});
```

POST 비멱등성에서 비롯되는 보호 책임은 누구에게 있는가:

| 계층 | 역할 |
|---|---|
| HTTP 프로토콜 | 멱등성을 정의만, 강제 안 함 |
| 브라우저 | 새로고침 시 알림 다이얼로그 표시 |
| 백엔드 | Idempotency-Key 처리, 중복 감지 |
| 프론트엔드 | 버튼 비활성화, 로딩 피드백, debounce |

각 계층이 역할을 분담해야 — 하나라도 빠지면 사용자가 결국 중복 처리를 겪게 됩니다.

AI Annotation 보충: FE 실무에서 직접 겪는 문제 — 버튼 연타로 POST 중복 전송 → 중복 주문, 이메일 다중 발송. 로딩 인디케이터나 버튼 비활성화로 방지해야 하며, 이는 웹 애플리케이션의 책임입니다. HTTP가 막아주지 않습니다.

```
       [POST 비멱등성 -- 이중 결제 시나리오]

   사용자          브라우저/앱        서버         결제 PG
     |                |                |              |
     | (1) 결제 클릭  |                |              |
     |--------------->|                |              |
     |                | POST /pay      |              |
     |                |--------------->|              |
     |                |                | 카드 청구    |
     |                |                |------------->|
     |                |                |  결제 성공    |
     |                |                |<-------------|
     |                |                | DB 기록       |
     |                |                |               |
     |                |   ... 응답 송신 중 ...        |
     |                |                |               |
     |                | X 네트워크 끊김 (응답 유실)   |
     |                |                |               |
     | (2) 응답 안 옴 |                |              |
     |     사용자 불안: "결제 됐나?"  |              |
     |                |                |              |
     | (3) 새로고침/재클릭            |              |
     |--------------->|                |              |
     |                | POST /pay (같은 요청 재전송) |
     |                |--------------->|              |
     |                |                | 카드 또 청구 |
     |                |                |------------->|
     |                |                |  중복 결제!  |
     |                |                |<-------------|
     |                |                |              |
     | (4) 카드사 SMS: 결제 2건                       |

   해결책:
   - 클라: 버튼 disable / debounce / 로딩 표시
   - 서버: Idempotency-Key 헤더로 중복 감지
   - PRG 패턴: POST 응답을 303 리다이렉트로
     -> 새로고침해도 GET만 반복 (POST 재전송 X)
```