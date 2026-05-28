---
tags: [network, protocol, concept]
source: official
priority:
---

# Questions
- HTTP 응답의 상태 코드는 어떤 구조이며, 1XX~5XX 각 클래스의 의미는?
  - [UNVERIFIED] 201 Created와 204 No Content는 각각 언제 쓰는가?
  - [UNVERIFIED] 401 Unauthorized와 403 Forbidden의 차이는 무엇인가?
  - [UNVERIFIED] 400 Bad Request와 422 Unprocessable Content는 어떤 기준으로 구분하는가?
  - [UNVERIFIED] 304 Not Modified는 어떤 흐름에서 발생하는가?

---

# Answers

## HTTP 응답의 상태 코드는 어떤 구조이며, 1XX~5XX 각 클래스의 의미는?

### Official Answer
The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.
A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit and treat an unrecognized code as equivalent to the x00 code of that class.
1XX informational: The request was received, continuing process.
2XX successful: The request was successfully received, understood, and accepted.
3XX redirection: Further action needs to be taken in order to complete the request.
4XX client error: The request cannot be fulfilled due to an issue that the client might be able to control.
5XX server error: The server failed to fulfill an apparently valid request.

> #### AI Annotation:
> 모르는 상태 코드를 받으면 첫 자릿수(클래스)로 판단한다. 예: 알 수 없는 `499`를 받으면 `400`(Client Error)으로 처리.
> 상태 코드는 기계가 읽는 것이고, 사유 구문(Bad Request 등)은 사람이 읽는 것이다.

### Reference
- https://en.wikipedia.org/wiki/HTTP

---

## [UNVERIFIED] 201 Created와 204 No Content는 각각 언제 쓰는가?

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status

---

## [UNVERIFIED] 401 Unauthorized와 403 Forbidden의 차이는 무엇인가?

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403

---

## [UNVERIFIED] 400 Bad Request와 422 Unprocessable Content는 어떤 기준으로 구분하는가?

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/422

---

## [UNVERIFIED] 304 Not Modified는 어떤 흐름에서 발생하는가?

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/304
