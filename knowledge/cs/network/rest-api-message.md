---
tags: [network, architecture, concept]
source: official
priority: 1
---

# Questions

## REST 요청 구성요소
- RESTful API 클라이언트 요청은 어떤 구성요소들을 포함하는가?
  - REST API에서 리소스를 식별하는 방법은? "request endpoint"라는 표현은 무엇을 가리키는가?
  - HTTP 요청 헤더(headers)란 무엇이며 어떤 역할을 하는가?
  - REST API 요청에서 본문(data)은 어떤 메서드와 함께 사용되는가?
  - RESTful API 요청 파라미터의 3가지 종류(path / query / cookie)는 각각 어떤 역할을 하는가?

## REST 인증 방식
- RESTful API에서 흔히 쓰이는 인증 방식들은 무엇이며, 인증은 왜 필수인가?
  - Bearer 인증의 "bearer"라는 단어가 가리키는 것은 무엇이며, 왜 그 이름이 붙었는가?
  - API key 방식은 어떻게 동작하며, 왜 보안성이 떨어진다고 평가되는가?
  - OAuth는 다른 인증 방식과 어떻게 다른가? "scope"과 "longevity"라는 개념은 어떤 통제를 가능하게 하는가?

## REST 응답 구성요소
- RESTful API 서버 응답은 어떤 구성요소들을 포함하는가?
  - REST 응답 헤더에는 어떤 종류의 정보가 담기는가?

## 관련 주제
- [HTTP 메서드 · 멱등성 · safe → `protocol/http-methods.md`](protocol/http-methods.md)
- [HTTP 상태 코드 → `protocol/http-status-codes.md`](protocol/http-status-codes.md)

---

# Answers

## RESTful API 클라이언트 요청은 어떤 구성요소들을 포함하는가?

### Official Answer
RESTful APIs require requests to contain the following main components:

- Unique resource identifier
- Method
- HTTP headers
- Data
- Parameters

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST API에서 리소스를 식별하는 방법은? "request endpoint"라는 표현은 무엇을 가리키는가?

### Official Answer
The server identifies each resource with unique resource identifiers.
For REST services, the server typically performs resource identification by using a Uniform Resource Locator (URL).
The URL specifies the path to the resource.
A URL is similar to the website address that you enter into your browser to visit any webpage.
The URL is also called the request endpoint and clearly specifies to the server what the client requires.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## HTTP 요청 헤더(headers)란 무엇이며 어떤 역할을 하는가?

### Official Answer
Request headers are the metadata exchanged between the client and server.
For instance, the request header indicates the format of the request and response, provides information about request status, and so on.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST API 요청에서 본문(data)은 어떤 메서드와 함께 사용되는가?

### Official Answer
REST API requests might include data for the POST, PUT, and other HTTP methods to work successfully.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API 요청 파라미터의 3가지 종류(path / query / cookie)는 각각 어떤 역할을 하는가?

### Official Answer
RESTful API requests can include parameters that give the server more details about what needs to be done.
The following are some different types of parameters:

- Path parameters that specify URL details.
- Query parameters that request more information about the resource.
- Cookie parameters that authenticate clients quickly.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API에서 흔히 쓰이는 인증 방식들은 무엇이며, 인증은 왜 필수인가?

### Official Answer
A RESTful web service must authenticate requests before it can send a response.
Authentication is the process of verifying an identity.
For example, you can prove your identity by showing an ID card or driver's license.
Similarly, RESTful service clients must prove their identity to the server to establish trust.

RESTful API has four common authentication methods:

- HTTP authentication (Basic, Bearer)
- API keys
- OAuth

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Bearer 인증의 "bearer"라는 단어가 가리키는 것은 무엇이며, 왜 그 이름이 붙었는가?

### Official Answer
The term bearer authentication refers to the process of giving access control to the token bearer.
The bearer token is typically an encrypted string of characters that the server generates in response to a login request.
The client sends the token in the request headers to access resources.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## API key 방식은 어떻게 동작하며, 왜 보안성이 떨어진다고 평가되는가?

### Official Answer
API keys are another option for REST API authentication.
In this approach, the server assigns a unique generated value to a first-time client.
Whenever the client tries to access resources, it uses the unique API key to verify itself.
API keys are less secure because the client has to transmit the key, which makes it vulnerable to network theft.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## OAuth는 다른 인증 방식과 어떻게 다른가? "scope"과 "longevity"라는 개념은 어떤 통제를 가능하게 하는가?

### Official Answer
OAuth combines passwords and tokens for highly secure login access to any system.
The server first requests a password and then asks for an additional token to complete the authorization process.
It can check the token at any time and also over time with a specific scope and longevity.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API 서버 응답은 어떤 구성요소들을 포함하는가?

### Official Answer
REST principles require the server response to contain the following main components:

- Status line
- Message body
- Headers

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST 응답 헤더에는 어떤 종류의 정보가 담기는가?

### Official Answer
The response also contains headers or metadata about the response.
They give more context about the response and include information such as the server, encoding, date, and content type.

### Reference
- https://aws.amazon.com/what-is/restful-api/
