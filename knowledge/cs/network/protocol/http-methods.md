---
tags: [network, protocol, concept]
source: official
---

# Questions
- HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?
  - PUT과 POST의 차이, PUT과 PATCH의 차이는?
  - [UNVERIFIED] POST와 PUT 중 리소스를 생성할 때 무엇을 쓰는 기준은?
- HTTP에서 safe method란 무엇인가?
  - safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?
- HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?
  - POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?
  - [UNVERIFIED] Safe method와 Idempotent method의 정의 및 차이는?
  - [UNVERIFIED] DELETE를 두 번 호출하면 두 번째 응답은 200인가 404인가? 멱등성과 응답 코드는 같은 개념인가?
  - [UNVERIFIED] POST를 멱등하게 만드는 패턴(Idempotency-Key)은 어떻게 동작하는가?

---

# Answers

## HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?

### Official Answer
A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.
GET: The request is for a representation of a resource.
The server should only retrieve data; not modify state.
For retrieving without making changes, GET is preferred over POST, as it can be addressed through a URL.
This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.
POST: The request is to process a resource in some way.
For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.
PUT: The request is to create or update a resource with the state in the request.
DELETE: The request is to delete a resource.
PATCH: The request is to modify a resource according to its partial state in the request.
Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## PUT과 POST의 차이, PUT과 PATCH의 차이는?

### Official Answer
POST: The request is to process a resource in some way.
PUT: The request is to create or update a resource with the state in the request.
A distinction from POST is that the client specifies the target location on the server.
PATCH: The request is to modify a resource according to its partial state in the request.
Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

> #### AI Annotation:
> PUT vs POST: PUT은 클라이언트가 리소스의 대상 URI를 지정한다 (`PUT /users/123`). POST는 서버가 위치를 결정한다 (`POST /users` → 서버가 ID 할당).
> PUT vs PATCH: PUT은 리소스 전체를 교체한다. 이름만 바꾸고 싶어도 전체 데이터를 보내야 한다. PATCH는 변경된 필드만 보내면 된다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## [UNVERIFIED] POST와 PUT 중 리소스를 생성할 때 무엇을 쓰는 기준은?

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT

---

## HTTP에서 safe method란 무엇인가?

### Official Answer
A request method is safe if a request with that method has no intended effect on the server.
The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.
In other words, safe methods are intended to be read-only.
In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.
They may modify the state of the server or have other effects such as sending an email.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?

### Official Answer
Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.
Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.
For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.
A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.
One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.
The beta was suspended only weeks after its first release, following widespread criticism.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

### Official Answer
A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.
The methods PUT and DELETE, and safe methods are defined as idempotent.
Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.
In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent, and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.
Note that whether or not a method is idempotent is not enforced by the protocol or web server.

> #### AI Annotation:
> 멱등 정리: GET/PUT/DELETE = 멱등 (여러 번 보내도 한 번과 같음), POST/PATCH = 비멱등 (중복 시 부작용).

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

### Official Answer
In some cases this is the desired effect, but in other cases it may occur accidentally.
A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.
While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

> #### AI Annotation:
> FE 실무에서 직접 겪는 문제: 버튼 연타로 POST 중복 전송 → 중복 주문, 이메일 다중 발송. 로딩 인디케이터나 버튼 비활성화로 방지해야 하며, 이는 웹 애플리케이션의 책임이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## [UNVERIFIED] Safe method와 Idempotent method의 정의 및 차이는?

### Reference
- https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP
- https://developer.mozilla.org/en-US/docs/Glossary/Idempotent

---

## [UNVERIFIED] DELETE를 두 번 호출하면 두 번째 응답은 200인가 404인가? 멱등성과 응답 코드는 같은 개념인가?

### Reference
- https://developer.mozilla.org/en-US/docs/Glossary/Idempotent

---

## [UNVERIFIED] POST를 멱등하게 만드는 패턴(Idempotency-Key)은 어떻게 동작하는가?

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Idempotency-Key
