---
tags: [network, protocol, concept]
source: official
priority: 2
---

# Questions
- HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?
  - POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?
  - [UNVERIFIED] Safe method와 Idempotent method의 정의 및 차이는?
  - [UNVERIFIED] DELETE를 두 번 호출하면 두 번째 응답은 200인가 404인가? 멱등성과 응답 코드는 같은 개념인가?
  - [UNVERIFIED] POST를 멱등하게 만드는 패턴(Idempotency-Key)은 어떻게 동작하는가?

---

# Answers

## HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

### Official Answer
A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.
The methods PUT and DELETE, and safe methods are defined as idempotent.
Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.
In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent, and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.
Note that whether or not a method is idempotent is not enforced by the protocol or web server.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

### Official Answer
In some cases this is the desired effect, but in other cases it may occur accidentally.
A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.
While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

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
