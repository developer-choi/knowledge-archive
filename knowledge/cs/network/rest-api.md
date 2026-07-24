---
tags: [network, architecture, concept]
source: official
priority: 1
---

# Questions

## REST 정의
- API란 무엇인가?
  - 웹 API에서 "클라이언트(client)"는 무엇을 가리키는가? 사람만을 의미하는가?
  - 웹 API에서 "리소스(resource)"는 무엇을 가리키며, 누가 그것을 제공하는가?
  - API는 단순히 데이터를 주고받는 통로인가? 조직이 DB를 직접 공개하지 않고 API 계층을 두는 이유는 무엇인가?
- RESTful API란 무엇인가?
  - 모든 API가 RESTful API인가? RESTful API와 그냥 API는 어떻게 다른가?
- REST(Representational State Transfer)란 무엇인가?
  - REST에서 "representation"이란 무엇이며, 리소스(resource) 자체와 어떻게 다른가?
- REST 아키텍처가 따르는 핵심 원칙(제약)들은 무엇인가?
  - Uniform Interface 제약이란 무엇이며, 그 4가지 하위 제약은 각각 무엇인가?
  - Statelessness 제약은 무엇이며 어떤 이점을 주는가?
  - Layered System 제약은 어떤 효용을 주며, 클라이언트에게 어떻게 보이는가?
  - RESTful 웹 서비스의 캐싱(Cacheability)은 어떻게 통제되는가?
  - Code on Demand 제약은 다른 제약들과 어떻게 다른가? 실무 예시는?

## REST 이점 / 동작 흐름
- RESTful API가 가져다주는 핵심 이점은 무엇이며, 그것은 앞서 본 어떤 제약에서 비롯되는가?
  - RESTful API의 Scalability(확장성)는 어떻게 달성되는가?
  - RESTful API의 Flexibility(유연성)란 무엇을 의미하며, 어떤 변경에도 영향을 받지 않게 해주는가?
  - RESTful API가 "기술 독립적(Independence)"이라는 말의 의미는?
- RESTful API 호출 한 번은 어떤 단계들로 진행되는가?
  - REST API에서 "API documentation"이 필수인 이유는 무엇인가?
  - REST API 요청에서 "인증(authentication)"과 "인가(authorization)"는 어떻게 다른가?

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
- [REST URL 설계 · API 버저닝 → `rest-url-design.md`](rest-url-design.md)

---

# Answers

## API란 무엇인가?

### Official Answer
An application programming interface (API) defines the rules that you must follow to communicate with other software systems.
Developers expose or create APIs so that other applications can communicate with their applications programmatically.
For example, the timesheet application exposes an API that asks for an employee's full name and a range of dates.
When it receives this information, it internally processes the employee's timesheet and returns the number of hours worked in that date range.

You can think of a web API as a gateway between clients and resources on the web.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## 웹 API에서 "클라이언트(client)"는 무엇을 가리키는가? 사람만을 의미하는가?

### Official Answer
Clients are users who want to access information from the web.
The client can be a person or a software system that uses the API.
For example, developers can write programs that access weather data from a weather system.
Or you can access the same data from your browser when you visit the weather website directly.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## 웹 API에서 "리소스(resource)"는 무엇을 가리키며, 누가 그것을 제공하는가?

### Official Answer
Resources are the information that different applications provide to their clients.
Resources can be images, videos, text, numbers, or any type of data.
The machine that gives the resource to the client is also called the server.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## API는 단순히 데이터를 주고받는 통로인가? 조직이 DB를 직접 공개하지 않고 API 계층을 두는 이유는 무엇인가?

### Official Answer
Organizations use APIs to share resources and provide web services while maintaining security, control, and authentication.
In addition, APIs help them to determine which clients get access to specific internal resources.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API란 무엇인가?

### Official Answer
RESTful API is an interface that two computer systems use to exchange information securely over the internet.
Most business applications have to communicate with other internal and third-party applications to perform various tasks.
For example, to generate monthly payslips, your internal accounts system has to share data with your customer's banking system to automate invoicing and communicate with an internal timesheet application.
RESTful APIs support this information exchange because they follow secure, reliable, and efficient software communication standards.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## 모든 API가 RESTful API인가? RESTful API와 그냥 API는 어떻게 다른가?

### Official Answer
An application programming interface (API) defines the rules that you must follow to communicate with other software systems.
RESTful APIs support this information exchange because they follow secure, reliable, and efficient software communication standards.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST(Representational State Transfer)란 무엇인가?

### Official Answer
Representational State Transfer (REST) is a software architecture that imposes conditions on how an API should work.
REST was initially created as a guideline to manage communication on a complex network like the internet.
You can use REST-based architecture to support high-performing and reliable communication at scale.
You can easily implement and modify it, bringing visibility and cross-platform portability to any API system.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST에서 "representation"이란 무엇이며, 리소스(resource) 자체와 어떻게 다른가?

### Official Answer
The formatted resource is called a representation in REST.
This format can be different from the internal representation of the resource on the server application.
For example, the server can store data as text but send it in an HTML representation format.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST 아키텍처가 따르는 핵심 원칙(제약)들은 무엇인가?

### Official Answer
The following are some of the principles of the REST architectural style:

- Uniform interface
- Statelessness
- Layered system
- Cacheability
- Code on demand

### Reference
- https://aws.amazon.com/what-is/restful-api/
- https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm

---

## Uniform Interface 제약이란 무엇이며, 그 4가지 하위 제약은 각각 무엇인가?

### Official Answer
The uniform interface is fundamental to the design of any RESTful webservice.
It indicates that the server transfers information in a standard format.
The formatted resource is called a representation in REST.
This format can be different from the internal representation of the resource on the server application.

Uniform interface imposes four architectural constraints:

- Requests should identify resources. They do so by using a uniform resource identifier.
- Clients have enough information in the resource representation to modify or delete the resource if they want to. The server meets this condition by sending metadata that describes the resource further.
- Clients receive information about how to process the representation further. The server achieves this by sending self-descriptive messages that contain metadata about how the client can best use them.
- Clients receive information about all other related resources they need to complete a task. The server achieves this by sending hyperlinks in the representation so that clients can dynamically discover more resources.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Statelessness 제약은 무엇이며 어떤 이점을 주는가?

### Official Answer
In REST architecture, statelessness refers to a communication method in which the server completes every client request independently of all previous requests.
Clients can request resources in any order, and every request is stateless or isolated from other requests.
This REST API design constraint implies that the server can completely understand and fulfill the request every time.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Layered System 제약은 어떤 효용을 주며, 클라이언트에게 어떻게 보이는가?

### Official Answer
In a layered system architecture, the client can connect to other authorized intermediaries between the client and server, and it will still receive responses from the server.
Servers can also pass on requests to other servers.
You can design your RESTful web service to run on several servers with multiple layers such as security, application, and business logic, working together to fulfill client requests.
These layers remain invisible to the client.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful 웹 서비스의 캐싱(Cacheability)은 어떻게 통제되는가?

### Official Answer
RESTful web services support caching, which is the process of storing some responses on the client or on an intermediary to improve server response time.
For example, suppose that you visit a website that has common header and footer images on every page.
Every time you visit a new website page, the server must resend the same images.
To avoid this, the client caches or stores these images after the first response and then uses the images directly from the cache.
RESTful web services control caching by using API responses that define themselves as cacheable or noncacheable.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Code on Demand 제약은 다른 제약들과 어떻게 다른가? 실무 예시는?

### Official Answer
In REST architectural style, servers can temporarily extend or customize client functionality by transferring software programming code to the client.
For example, when you fill a registration form on any website, your browser immediately highlights any mistakes you make, such as incorrect phone numbers.
It can do this because of the code sent by the server.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API가 가져다주는 핵심 이점은 무엇이며, 그것은 앞서 본 어떤 제약에서 비롯되는가?

### Official Answer
RESTful APIs include the following benefits:

- Scalability
- Flexibility
- Independence

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API의 Scalability(확장성)는 어떻게 달성되는가?

### Official Answer
Systems that implement REST APIs can scale efficiently because REST optimizes client-server interactions.
Statelessness removes server load because the server does not have to retain past client request information.
Well-managed caching partially or completely eliminates some client-server interactions.
All these features support scalability without causing communication bottlenecks that reduce performance.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API의 Flexibility(유연성)란 무엇을 의미하며, 어떤 변경에도 영향을 받지 않게 해주는가?

### Official Answer
RESTful web services support total client-server separation.
They simplify and decouple various server components so that each part can evolve independently.
Platform or technology changes at the server application do not affect the client application.
The ability to layer application functions increases flexibility even further.
For example, developers can make changes to the database layer without rewriting the application logic.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API가 "기술 독립적(Independence)"이라는 말의 의미는?

### Official Answer
REST APIs are independent of the technology used.
You can write both client and server applications in various programming languages without affecting the API design.
You can also change the underlying technology on either side without affecting the communication.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API 호출 한 번은 어떤 단계들로 진행되는가?

### Official Answer
The basic function of a RESTful API is the same as browsing the internet.
The client contacts the server by using the API when it requires a resource.
API developers explain how the client should use the REST API in the server application API documentation.
These are the general steps for any REST API call:

- The client sends a request to the server. The client follows the API documentation to format the request in a way that the server understands.
- The server authenticates the client and confirms that the client has the right to make that request.
- The server receives the request and processes it internally.
- The server returns a response to the client. The response contains information that tells the client whether the request was successful. The response also includes any information that the client requested.
- The REST API request and response details vary slightly depending on how the API developers design the API.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST API에서 "API documentation"이 필수인 이유는 무엇인가?

### Official Answer
API developers explain how the client should use the REST API in the server application API documentation.
The REST API request and response details vary slightly depending on how the API developers design the API.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST API 요청에서 "인증(authentication)"과 "인가(authorization)"는 어떻게 다른가?

### Official Answer
The server authenticates the client and confirms that the client has the right to make that request.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

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
