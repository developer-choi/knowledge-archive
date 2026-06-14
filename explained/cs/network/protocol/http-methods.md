# HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?

## 도입

HTTP 메서드는 클라이언트가 서버에 "어떤 동작을 원하는가"를 알려주는 레이블이다. URL은 "어디에"를, 메서드는 "무엇을"에 해당한다. OA는 메서드를 "동사(verb)"라고 부르며, 각 메서드가 리소스에 대해 수행할 동작을 분류한다.

---

## 본문

> A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.

"요청은 리소스에 수행할 원하는 동작을 분류하기 위한 메서드(비공식적으로 동사라고도 불림)를 식별한다."

- **verb**: 메서드를 동사로 부르는 이유는 "GET(가져와라)", "POST(보내라)", "DELETE(지워라)"처럼 명령의 성격을 가지기 때문이다. REST API 설계에서 URL은 명사(리소스)로, 메서드는 동사(동작)로 역할이 분리된다.

---

> GET: The request is for a representation of a resource. The server should only retrieve data; not modify state. For retrieving without making changes, GET is preferred over POST, as it can be addressed through a URL. This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.

"GET: 리소스의 표현을 요청한다. 서버는 데이터를 가져오기만 해야 하며, 상태를 변경해서는 안 된다. 변경 없이 조회하는 경우 GET이 POST보다 선호되는데, URL로 주소를 지정할 수 있기 때문이다. 이는 북마크와 공유를 가능하게 하고, GET 응답이 캐싱에 적합하게 하여 대역폭을 절약한다."

- **representation**: 리소스 자체가 아니라 "표현"이다. 같은 리소스를 JSON으로 달라고 할 수도, HTML로 달라고 할 수도 있다. `Accept` 헤더로 형식을 협상한다.
- **eligible for caching**: 브라우저와 CDN은 GET 응답을 자동으로 캐싱 후보로 간주한다. POST는 기본적으로 캐싱되지 않는다.

---

> POST: The request is to process a resource in some way. For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.

"POST: 어떤 방식으로든 리소스를 처리하도록 요청한다. 예를 들어 인터넷 포럼에 메시지를 게시하거나, 메일링 리스트를 구독하거나, 온라인 쇼핑 거래를 완료하는 데 사용된다."

- **process a resource in some way**: POST의 정의는 의도적으로 열려있다. "어떤 방식으로든 처리"는 서버가 동작을 결정한다는 뜻이다. 리소스 생성뿐 아니라 결제 처리, 이메일 발송, 로그인 등 다양한 동작에 쓰인다.

---

> PUT: The request is to create or update a resource with the state in the request.

"PUT: 요청의 상태로 리소스를 생성하거나 업데이트하도록 요청한다."

> DELETE: The request is to delete a resource.

"DELETE: 리소스를 삭제하도록 요청한다."

> PATCH: The request is to modify a resource according to its partial state in the request. Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

"PATCH: 요청의 부분적인 상태에 따라 리소스를 수정하도록 요청한다. PUT과 비교하여 리소스 표현 전체 대신 일부만 보내므로 대역폭을 절약할 수 있다."

- **partial state**: PATCH가 PUT과 다른 핵심. PUT은 전체 리소스를 교체하고, PATCH는 변경된 필드만 보낸다. 사용자 이름만 바꾸려면 PATCH로 `{ "name": "새이름" }`만 보내면 되지만, PUT으로는 사용자 전체 데이터를 보내야 한다.

```
메서드   서버 상태 변경   URL 지정   사용 예
GET      X              클라이언트  GET /users/123
POST     O              서버가 결정 POST /users → 서버가 ID 할당
PUT      O              클라이언트  PUT /users/123 (전체 교체)
PATCH    O              클라이언트  PATCH /users/123 (부분 수정)
DELETE   O              클라이언트  DELETE /users/123
```

---

## 종합

HTTP 메서드는 서버와 클라이언트 사이의 의도 전달 약속이다. `fetch('/api/users', { method: 'DELETE' })`와 `fetch('/api/users', { method: 'GET' })`은 URL이 같아도 서버에서 전혀 다른 처리가 된다. Express에서 `app.get()`, `app.post()`, `app.put()`, `app.delete()`가 메서드별로 라우터를 분리하는 이유가 바로 이것이다. 메서드를 의미에 맞게 쓰면 캐싱, 안전성, 멱등성 등의 HTTP 기본 기능을 자연스럽게 활용할 수 있다.

---

# PUT과 POST의 차이, PUT과 PATCH의 차이는?

## 도입

세 메서드 모두 데이터를 서버에 보내지만, "누가 URI를 결정하는가"와 "얼마만큼 보내는가"에서 차이가 난다. 이 두 축을 이해하면 세 메서드의 관계가 한눈에 잡힌다.

---

## 본문

> POST: The request is to process a resource in some way.

"POST: 어떤 방식으로든 리소스를 처리하도록 요청한다."

> PUT: The request is to create or update a resource with the state in the request. A distinction from POST is that the client specifies the target location on the server.

"PUT: 요청의 상태로 리소스를 생성하거나 업데이트하도록 요청한다. POST와의 차이는 클라이언트가 서버의 대상 위치를 지정한다는 점이다."

- **the client specifies the target location**: PUT의 핵심 차이. `PUT /users/123`처럼 클라이언트가 리소스 ID를 안다. POST는 `POST /users`로 보내면 서버가 ID를 생성하고 할당한다. "어디에 저장할지"를 클라이언트가 아는가 서버가 결정하는가의 차이다.

> PATCH: The request is to modify a resource according to its partial state in the request. Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

"PATCH: 요청의 부분적인 상태에 따라 리소스를 수정하도록 요청한다. PUT과 비교하여 리소스 표현의 전부 대신 일부만 보내므로 대역폭을 절약할 수 있다."

- **partial state**: "부분 상태"로 수정. PUT은 전체 표현을 교체하지만 PATCH는 변경된 필드만 보낸다.

```
// POST — 서버가 URI 결정
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
})
// 서버 응답: 201 Created, Location: /api/users/456

// PUT — 클라이언트가 URI 결정, 전체 교체
fetch('/api/users/456', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice', email: 'new@example.com' }) // 전체 보냄
})

// PATCH — 부분 수정만
fetch('/api/users/456', {
  method: 'PATCH',
  body: JSON.stringify({ email: 'new@example.com' }) // 변경된 필드만
})
```

---

## 종합

실무 REST API 설계 관점에서 정리하면: 새 리소스를 생성하고 서버가 ID를 부여하면 POST, 클라이언트가 ID를 알고 있어 전체를 교체하면 PUT, 일부 필드만 수정하면 PATCH다. PUT은 "없으면 만들고, 있으면 전체 교체"라는 멱등한 동작이 보장되어야 한다. PATCH는 멱등성이 보장되지 않을 수 있다 — 예를 들어 `PATCH { "count": "+1" }` 같은 증분 연산은 두 번 보내면 두 번 증가한다.

---

# [UNVERIFIED] POST와 PUT 중 리소스를 생성할 때 무엇을 쓰는 기준은?

## 도입

둘 다 리소스를 생성할 수 있지만, 기준은 하나다. "클라이언트가 생성될 리소스의 URI를 아는가?" 모른다면 POST, 안다면 PUT이다.

---

## 본문

**POST로 생성하는 경우**

서버가 리소스의 ID(혹은 URI)를 결정해야 할 때다. 사용자가 회원가입할 때 클라이언트는 자신의 ID가 뭐가 될지 모른다. 서버가 DB에 저장하고 ID를 생성한 뒤 `201 Created`와 함께 `Location: /users/789`를 응답한다.

```js
// 클라이언트는 /users/??? 가 될지 모름
fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify({ title: '새 글', content: '...' })
})
// 서버 응답: 201 Created, Location: /api/posts/101
```

**PUT으로 생성하는 경우**

클라이언트가 리소스의 URI를 직접 지정할 때다. 파일 업로드처럼 클라이언트가 파일명(=URI)을 안다면 PUT이 자연스럽다. `PUT /files/my-photo.jpg`로 보내면 없으면 만들고, 있으면 교체한다.

**실무 기준**

대부분의 REST API에서는 생성에 POST를 사용한다. 서버가 ID를 관리하는 것이 일반적이기 때문이다. PUT으로 생성을 허용하면 클라이언트가 임의의 URI를 만들어낼 수 있어 리소스 관리가 복잡해진다.

```
리소스 ID를 누가 결정하는가?
├── 서버 결정 → POST /collection
└── 클라이언트 결정 → PUT /collection/:id
```

---

## 종합

"생성 = POST"라는 규칙은 클라이언트가 서버의 리소스 식별 방식(UUID, 자동 증가 ID 등)을 몰라도 되게 해주는 설계다. PUT으로 생성을 허용하는 경우는 파일 스토리지, CMS처럼 클라이언트가 리소스 이름을 직접 지정하는 도메인에 한정된다.

---

# HTTP에서 safe method란 무엇인가?

## 도입

서버에 보내는 요청 중 일부는 "읽기만 한다"는 것이 보장된다. 이런 메서드를 안전(safe)하다고 부른다. 안전한 메서드를 여러 번 호출해도 서버 상태가 바뀌지 않으므로, 브라우저나 CDN이 마음 놓고 반복 호출하거나 미리 호출해도 된다.

---

## 본문

> A request method is safe if a request with that method has no intended effect on the server.

"요청 메서드는 해당 메서드로의 요청이 서버에 의도된 효과가 없을 때 안전하다고 한다."

- **intended**: "의도된" 효과. 서버 로그가 쌓이거나 카운터가 올라가는 부작용은 있을 수 있지만, 그것이 요청의 의도된 동작이 아니라는 뜻이다.

> The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.

"GET, HEAD, OPTIONS, TRACE 메서드는 안전하다고 정의된다."

> In other words, safe methods are intended to be read-only.

"다시 말해, 안전한 메서드는 읽기 전용을 의도한다."

> In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe. They may modify the state of the server or have other effects such as sending an email.

"반면 POST, PUT, DELETE, CONNECT, PATCH 메서드는 안전하지 않다. 서버 상태를 수정하거나 이메일 발송 같은 다른 효과를 일으킬 수 있다."

- **may modify the state**: "할 수 있다"는 가능성이다. 반드시 변경하는 것이 아니라 변경할 의도를 가진 메서드라는 뜻이다.
- **sending an email**: 안전하지 않은 부작용의 예시. `POST /subscribe`가 이메일을 보낸다면 두 번 호출하면 두 번 발송된다.

```
안전(Safe) 메서드   GET, HEAD, OPTIONS, TRACE
안전하지 않음       POST, PUT, DELETE, PATCH, CONNECT
```

---

## 종합

안전성의 실용적 의미는 "브라우저가 마음대로 호출해도 되는가"다. 브라우저의 프리페치(prefetch), 링크 호버 미리 로드, 북마크 등은 모두 GET 요청을 임의로 보낸다. 이것이 안전하지 않은 메서드(POST, DELETE 등)를 GET 요청으로 처리하면 안 되는 이유다. 다음 질문의 Google Web Accelerator 사례가 이 원칙을 위반했을 때 어떤 문제가 생기는지 잘 보여준다.

---

# safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?

## 도입

GET은 "읽기만 한다"는 것이 HTTP 명세의 약속이지만, 서버 구현 레벨에서 이 약속을 강제하는 메커니즘은 없다. 이 허점을 노리면 어떤 일이 벌어지는지를 보여주는 실제 사례가 있다.

---

## 본문

> Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.

"GET 요청의 안전성이 명시되어 있음에도 불구하고, 실제로 서버의 처리 방식은 기술적으로 어떤 방식으로든 제한되지 않는다."

- **prescribed**: "명시된", "규정된" — HTTP 명세가 GET의 안전성을 규정하지만, 이것은 약속이지 기술적 강제가 아니다.
- **not technically limited**: 서버는 GET 요청에도 얼마든지 DB를 삭제하는 코드를 실행할 수 있다. HTTP 프로토콜이 막아주지 않는다.

> Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server. For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.

"부주의하거나 의도적으로 비정상적인 프로그래밍은 GET 요청이 서버에 상당한 변경을 일으키도록 허용할 수 있다. 예를 들어, 어떤 웹사이트가 https://example.com/article/1234/delete 같은 URL을 통해 리소스를 삭제할 수 있게 한다면, GET으로 임의로 접근하는 것만으로도 해당 글이 삭제된다."

- **arbitrarily fetched**: "임의로 가져오다" — 사용자가 직접 클릭하지 않아도 외부 도구가 자동으로 URL에 GET 요청을 보낼 수 있다.

> One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.

"이것이 실제로 발생한 한 예는 단명한 Google Web Accelerator 베타 기간 중이었는데, 사용자가 보고 있는 페이지의 임의 URL을 미리 불러와 레코드가 대규모로 자동 변경되거나 삭제되었다."

- **prefetched**: 사용자가 클릭하기 전에 미리 GET으로 링크 URL을 호출하는 최적화 기법.
- **en masse**: "대규모로" — 단순히 몇 개가 아니라 페이지에 있는 모든 링크를 미리 불러왔으므로 피해가 광범위했다.

> The beta was suspended only weeks after its first release, following widespread criticism.

"베타는 출시 몇 주 만에, 광범위한 비판을 받고 중단되었다."

---

## 종합

Google Web Accelerator는 정상적인 HTTP 약속(GET은 읽기만 한다)을 믿고 페이지의 모든 링크를 미리 호출했다. 그런데 일부 웹사이트가 `GET /delete?id=123` 같은 패턴으로 삭제 기능을 만들어두었기 때문에, 미리 불러오는 것만으로 데이터가 삭제됐다. 교훈은 명확하다: 서버 상태를 변경하는 동작(생성, 수정, 삭제)은 반드시 POST, PUT, DELETE, PATCH 메서드에서만 수행해야 한다. Express에서 `app.get('/delete/:id', handler)`처럼 짜는 것은 이 원칙 위반이다.

---

# HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

## 도입

멱등(idempotent)은 수학 용어다. 같은 연산을 여러 번 해도 결과가 한 번 했을 때와 같다는 뜻이다. HTTP에서는 "같은 요청을 여러 번 보내도 서버 상태가 한 번 보낸 것과 동일하다"는 의미다. 네트워크 불안정으로 요청이 재전송될 때 멱등한 메서드는 안전하게 재시도할 수 있다.

---

## 본문

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.

"요청 메서드는 동일한 요청을 여러 번 보낸 결과가 한 번 보낸 것과 동일한 효과를 가질 때 멱등하다."

- **identical requests**: 완전히 같은 요청. URL, 헤더, 본문이 모두 동일한 경우다.
- **same effect**: 서버 상태(DB, 파일 등)가 같아야 한다. 응답 코드가 같아야 한다는 뜻이 아니다.

> The methods PUT and DELETE, and safe methods are defined as idempotent.

"PUT과 DELETE, 그리고 안전한 메서드들이 멱등하다고 정의된다."

> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.

"안전한 메서드는 자명하게 멱등하다 — 서버에 어떤 효과도 없도록 의도되어 있기 때문이다. PUT과 DELETE는 연속 동일 요청이 무시되므로 멱등하다."

- **trivially idempotent**: 서버를 바꾸지 않으므로 당연히 멱등하다.
- **successive identical requests will be ignored**: `DELETE /users/123`을 두 번 보내면 두 번째는 "이미 없음"이지만 서버 상태는 "123이 없음"으로 동일하다.

> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent.

"반면 POST, CONNECT, PATCH는 반드시 멱등한 것은 아니다."

- **not necessarily**: 멱등할 수도 있지만 보장되지 않는다는 뜻이다. PATCH가 `{ "count": "+1" }` 같은 증분이면 비멱등이지만, `{ "status": "active" }` 같은 절대값 설정이면 멱등하다.

```
멱등(Idempotent)     GET, HEAD, OPTIONS, TRACE, PUT, DELETE
비멱등               POST, PATCH(경우에 따라)
```

---

## 종합

멱등성은 네트워크 안정성과 직결된다. `fetch()`가 타임아웃 나서 재시도할 때, GET/PUT/DELETE는 여러 번 보내도 안전하지만 POST는 중복 처리될 수 있다. 이것이 결제, 주문 같은 POST 요청에 별도의 중복 방지 로직(Idempotency-Key 헤더, 버튼 비활성화 등)이 필요한 이유다. 프로토콜 자체가 멱등성을 강제하지 않으므로, 개발자가 서버 구현에서 보장해야 한다.

---

# POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

## 도입

POST는 비멱등이다. 같은 요청을 두 번 보내면 두 번 처리된다. 네트워크가 느리거나 사용자가 버튼을 연타하면, 의도하지 않은 중복 처리가 발생한다.

---

## 본문

> In some cases this is the desired effect, but in other cases it may occur accidentally.

"경우에 따라 이것이 의도된 효과이기도 하지만, 다른 경우에는 실수로 발생할 수 있다."

- **desired effect**: 게시글 좋아요 수를 늘리는 POST는 두 번 보내면 두 번 올라가야 한다. 의도된 중복이다.
- **accidentally**: 주문 확정 버튼을 두 번 클릭하면 두 번 주문되는 것은 의도하지 않은 중복이다.

> A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.

"예를 들어, 첫 번째 클릭이 처리 중이라는 명확한 피드백이 주어지지 않으면 사용자가 버튼을 다시 클릭하여 여러 POST 요청을 실수로 보낼 수 있다."

- **inadvertently**: "실수로" — 사용자의 의도가 아니다. 로딩 표시가 없으면 "반응 없나?" 하고 다시 클릭한다.
- **clear feedback**: 스피너, 버튼 비활성화, "처리 중" 텍스트 등 진행 상태를 보여주는 UI.

> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

"웹 브라우저가 페이지 새로고침 시 POST 요청이 재제출될 수 있는 경우 경고 대화상자를 표시하기도 하지만, 일반적으로 POST 요청이 두 번 이상 제출되어서는 안 되는 경우를 처리하는 것은 웹 애플리케이션의 책임이다."

- **re-submit a POST request**: 브라우저가 POST 후 새로고침하면 "이 페이지를 다시 제출하시겠습니까?" 대화상자를 띄운다. 이것이 POST-Redirect-GET 패턴을 쓰는 이유다.
- **up to the web application**: 프로토콜이 방지해주지 않는다. 개발자가 직접 처리해야 한다.

**FE 실무 대응 패턴:**

```js
// 버튼 비활성화
async function handleOrder() {
  submitBtn.disabled = true
  try {
    await fetch('/api/orders', { method: 'POST', body: orderData })
  } finally {
    submitBtn.disabled = false
  }
}

// 낙관적 락 / Idempotency-Key
fetch('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': crypto.randomUUID() }
})
```

---

## 종합

POST 비멱등성의 실무 영향은 두 가지다. 첫째, UI에서 로딩 인디케이터와 버튼 비활성화로 사용자가 중복 클릭하지 않도록 막아야 한다. 둘째, 서버 측에서 Idempotency-Key 헤더나 DB 유니크 제약으로 중복 처리를 방어해야 한다. 프론트엔드 혼자 막을 수 있는 문제가 아니라 프론트엔드+백엔드 양쪽에서 대응해야 하는 문제다.

---

# [UNVERIFIED] Safe method와 Idempotent method의 정의 및 차이는?

## 도입

Safe와 Idempotent는 비슷해 보이지만 다른 축에서 메서드를 분류한다. Safe는 "서버 상태를 변경하는가"를, Idempotent는 "여러 번 호출해도 결과가 같은가"를 묻는다. 안전한 메서드는 모두 멱등하지만, 멱등한 메서드가 모두 안전한 것은 아니다.

---

## 본문

**Safe (안전)**

요청이 서버 상태에 의도된 영향을 미치지 않는다. 읽기 전용이다.

```
Safe → 서버 상태 변경 X
```

GET, HEAD, OPTIONS, TRACE가 Safe.

**Idempotent (멱등)**

동일한 요청을 여러 번 보내도 결과가 한 번 보낸 것과 동일하다.

```
Idempotent → f(f(x)) = f(x)
```

GET, HEAD, OPTIONS, TRACE (Safe), PUT, DELETE가 Idempotent.

**차이와 관계**

```
                  Safe?    Idempotent?
GET, HEAD        ✓ Yes     ✓ Yes
OPTIONS, TRACE   ✓ Yes     ✓ Yes
PUT              ✗ No      ✓ Yes (전체 교체)
DELETE           ✗ No      ✓ Yes (이미 없으면 무시)
POST             ✗ No      ✗ No
PATCH            ✗ No      △ Maybe (절대값이면 Yes, 증분이면 No)
```

- PUT은 서버 상태를 변경하지만(→ Not Safe), 같은 내용으로 두 번 보내도 결과가 같다(→ Idempotent).
- DELETE는 리소스를 지우지만(→ Not Safe), 이미 지워진 리소스를 또 지워도 상태는 "없음"으로 동일하다(→ Idempotent).
- POST는 변경도 하고(→ Not Safe), 두 번 보내면 두 번 처리된다(→ Not Idempotent).

---

## 종합

Safe는 "이 요청이 부작용이 있는가"의 질문이고, Idempotent는 "재시도해도 괜찮은가"의 질문이다. Safe이면 자동으로 Idempotent이지만, Idempotent가 Safe를 의미하지는 않는다. PUT으로 파일을 덮어쓰는 것은 멱등하지만 안전하지는 않다. 이 두 속성을 이해하면 API 설계에서 어떤 메서드를 써야 할지, 재시도 로직을 어디에 넣어야 할지 판단하는 기준이 생긴다.

---

# [UNVERIFIED] DELETE를 두 번 호출하면 두 번째 응답은 200인가 404인가? 멱등성과 응답 코드는 같은 개념인가?

## 도입

DELETE의 멱등성은 "서버 상태가 동일하다"는 것이지, "응답 코드가 동일하다"는 것이 아니다. 이 미묘한 차이가 혼란의 원인이다.

---

## 본문

**첫 번째 DELETE**

`DELETE /users/123`을 보내면 서버는 해당 리소스를 삭제하고 `200 OK` 또는 `204 No Content`를 응답한다.

**두 번째 DELETE**

같은 URL에 다시 `DELETE /users/123`을 보내면 리소스가 이미 없다. 서버 구현에 따라 다음 두 가지 중 하나다.

- `404 Not Found`: 엄밀하게 구현한 경우. "삭제할 대상이 없으므로 찾을 수 없다."
- `200 OK` 또는 `204 No Content`: 멱등성에 충실한 구현. "이미 삭제된 상태이므로 목표가 달성됐다."

**멱등성과 응답 코드는 다른 개념이다**

멱등성의 정의는 "서버 상태(state)가 동일하다"이지 "응답 코드(status code)가 동일하다"가 아니다. 두 번째 DELETE가 `404`를 반환해도 서버 상태는 "123이 없음"으로 동일하므로 DELETE는 여전히 멱등하다.

```
DELETE /users/123  → 200 OK    (리소스 삭제됨)
서버 상태: users/123 없음

DELETE /users/123  → 404 Not Found (이미 없음)
서버 상태: users/123 없음  ← 동일!

→ 응답 코드가 달라도 서버 상태가 동일하므로 멱등성 충족
```

---

## 종합

클라이언트가 DELETE 재시도 로직을 구현할 때 `404`를 에러로 처리할지 성공으로 처리할지 결정해야 한다. 멱등성 관점에서는 `404`도 "목표(리소스 없음) 달성"으로 볼 수 있으므로 정상 처리로 취급하는 것이 더 자연스럽다. Stripe 같은 API는 이 이유로 DELETE를 여러 번 호출해도 `404` 대신 `200`을 반환하는 설계를 선택하기도 한다.

---

# [UNVERIFIED] POST를 멱등하게 만드는 패턴(Idempotency-Key)은 어떻게 동작하는가?

## 도입

POST는 기본적으로 비멱등이지만, 실무에서는 결제, 주문처럼 중복 처리를 절대 피해야 하는 상황이 있다. 이때 사용하는 패턴이 Idempotency-Key다. 클라이언트가 요청에 고유한 키를 붙여 보내면, 서버가 같은 키의 요청을 중복 처리하지 않는다.

---

## 본문

**동작 원리**

1. 클라이언트가 POST 요청을 보낼 때 `Idempotency-Key` 헤더에 UUID 같은 고유 값을 포함한다.
2. 서버는 이 키를 처리 결과와 함께 저장(캐시/DB)한다.
3. 같은 키로 다시 요청이 오면 서버는 처음 처리 결과를 그대로 반환한다. 처리 로직을 다시 실행하지 않는다.

```js
const idempotencyKey = crypto.randomUUID()

// 첫 번째 요청 (처리됨)
await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey
  },
  body: JSON.stringify(orderData)
})

// 네트워크 에러로 응답을 못 받음 → 재시도
// 두 번째 요청 (서버는 첫 결과를 그대로 반환)
await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey // 같은 키!
  },
  body: JSON.stringify(orderData)
})
```

서버는 두 번째 요청에서 주문을 새로 생성하지 않고 첫 번째 주문의 응답을 그대로 돌려준다. 클라이언트 입장에서 POST가 멱등하게 동작한다.

**키 생성 전략**

- `crypto.randomUUID()`: 브라우저/Node.js 모두 지원하는 표준 UUID v4 생성
- 세션당 하나의 키: 장바구니 → 주문 확정 플로우에서 결제 시도마다 새 UUID

---

## 종합

Idempotency-Key는 "POST를 안전하게 재시도할 수 있게" 만드는 애플리케이션 레벨 패턴이다. 네트워크 타임아웃 후 재시도하거나, 사용자가 뒤로 가기 후 다시 제출할 때 중복 처리를 방지한다. Stripe, PayPal 같은 결제 API가 이 헤더를 표준으로 요구하며, RFC 초안으로도 표준화가 논의되고 있다. 서버 구현에서는 키를 Redis나 DB에 저장하고 일정 기간(24~48시간) 후 만료시키는 것이 일반적이다.
