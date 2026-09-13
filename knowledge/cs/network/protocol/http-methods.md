---
tags: [network, protocol, concept]
source: official
priority: 2
---

# Questions
- HTTP 메서드란 무엇이며, 주요 메서드(GET, POST, PUT, PATCH, DELETE)의 역할은?
  - PUT과 POST의 차이, PUT과 PATCH의 차이는?
  - [UNVERIFIED] POST와 PUT 중 리소스를 생성할 때 무엇을 쓰는 기준은?
- HTTP에서 safe method란 무엇인가?
  - safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?

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
