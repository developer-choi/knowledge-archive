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
  - Layered System 제약은 어떤 효용을 주며 클라이언트에게 어떻게 보이는가?
  - RESTful 웹 서비스의 캐싱(Cacheability)은 어떻게 통제되는가?
  - Code on Demand 제약은 다른 제약들과 어떻게 다른가? 실무 예시는?
  - [UNVERIFIED] Client-Server 제약이란 무엇이며 왜 6대 제약 중 가장 자명한 것으로 취급되는가?

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
  - HTTP 메서드는 클라이언트의 무엇을 표현하는가? RESTful API에서 흔히 쓰는 4가지 메서드(GET/POST/PUT/DELETE)는 각각 어떤 동작을 의미하는가?
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
  - HTTP 응답 상태 코드는 어떤 클래스(2XX/3XX/4XX/5XX)로 나뉘며, 각각은 무엇을 의미하는가? 자주 보는 코드 몇 개를 예로 들면?
  - REST 응답 헤더에는 어떤 종류의 정보가 담기는가?

## 관련 주제
- [HTTP 메서드 · 멱등성 · safe → `protocol/http-methods.md`](protocol/http-methods.md)
- [HTTP 상태 코드 → `protocol/http-status-codes.md`](protocol/http-status-codes.md)
- [HTTP 캐싱 → `protocol/http-caching.md`](protocol/http-caching.md)
- [JWT · stateless 인증 → `jwt.md`](jwt.md)
- [REST URL 설계 · API 버저닝 → `rest-url-design.md`](rest-url-design.md)
- [HATEOAS · Richardson Maturity Model → `hateoas.md`](hateoas.md)
- [REST 대안(GraphQL, gRPC) → `rest-alternatives.md`](rest-alternatives.md)

---

# Answers

## API란 무엇인가?

### Official Answer
An application programming interface (API) defines the rules that you must follow to communicate with other software systems.
Developers expose or create APIs so that other applications can communicate with their applications programmatically.
For example, the timesheet application exposes an API that asks for an employee's full name and a range of dates.
When it receives this information, it internally processes the employee's timesheet and returns the number of hours worked in that date range.

You can think of a web API as a gateway between clients and resources on the web.

> #### AI Annotation:
> API는 "통신 규칙의 집합"이고, 개발자는 이 규칙을 의도적으로 노출(expose)해서 다른 코드가 자기 시스템을 호출할 수 있게 한다.
> 핵심 비유는 "관문(gateway)" — 클라이언트가 자원에 직접 손대는 게 아니라 API라는 관문을 거치게 함으로써 보안과 제어를 중앙화한다.
> 관문이 없으면 모든 클라이언트가 DB에 직접 붙어야 하고, 권한·인증을 클라마다 다시 짜야 한다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## 웹 API에서 "클라이언트(client)"는 무엇을 가리키는가? 사람만을 의미하는가?

### Official Answer
Clients are users who want to access information from the web.
The client can be a person or a software system that uses the API.
For example, developers can write programs that access weather data from a weather system.
Or you can access the same data from your browser when you visit the weather website directly.

> #### AI Annotation:
> 클라이언트의 정의가 넓다는 게 REST의 중요한 함의다.
> 같은 API 하나가 모바일 앱·웹 브라우저·다른 서버·CLI 도구를 동시에 서비스할 수 있다.
> 가능한 이유는 REST가 HTTP라는 공통 프로토콜 위에서 동작하기 때문 — 클라이언트가 무엇이든 HTTP만 말할 줄 알면 된다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## 웹 API에서 "리소스(resource)"는 무엇을 가리키며, 누가 그것을 제공하는가?

### Official Answer
Resources are the information that different applications provide to their clients.
Resources can be images, videos, text, numbers, or any type of data.
The machine that gives the resource to the client is also called the server.

> #### AI Annotation:
> REST에서 URL의 본질은 "리소스의 주소"다.
> 리소스가 JSON에 한정된다고 오해하기 쉬운데, 이미지·비디오·숫자 등 어떤 데이터든 리소스가 될 수 있다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## API는 단순히 데이터를 주고받는 통로인가? 조직이 DB를 직접 공개하지 않고 API 계층을 두는 이유는 무엇인가?

### Official Answer
Organizations use APIs to share resources and provide web services while maintaining security, control, and authentication.
In addition, APIs help them to determine which clients get access to specific internal resources.

> #### AI Annotation:
> API는 게이트(gateway)다 — DB를 그냥 공개하는 대신 좁은 표면으로만 통과시키고, 호출자에 따라 접근 가능한 리소스를 분기한다.
> 이게 빠지면 인증·인가가 클라마다 흩어져 보안 사고로 직결된다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API란 무엇인가?

### Official Answer
RESTful API is an interface that two computer systems use to exchange information securely over the internet.
Most business applications have to communicate with other internal and third-party applications to perform various tasks.
For example, to generate monthly payslips, your internal accounts system has to share data with your customer's banking system to automate invoicing and communicate with an internal timesheet application.
RESTful APIs support this information exchange because they follow secure, reliable, and efficient software communication standards.

> #### AI Annotation:
> RESTful API는 그냥 API가 아니라 "REST 표준을 지키는" API다.
> "RESTful"은 "REST의 성질을 가진"이라는 형용사 형태이며, 실무에서 "REST API"와 동의어로 혼용된다.

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

> #### AI Annotation:
> REST는 "프로토콜"이 아니라 "스타일"이라는 점이 핵심.
> HTTP라는 프로토콜 위에서 REST 스타일을 따를 수도 있고, 안 따를 수도 있다.
> REST의 존재 이유는 인터넷 규모의 분산 통신을 관리 가능하게 만들기 위한 제약 모음이라는 데 있다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST에서 "representation"이란 무엇이며, 리소스(resource) 자체와 어떻게 다른가?

### Official Answer
The formatted resource is called a representation in REST.
This format can be different from the internal representation of the resource on the server application.
For example, the server can store data as text but send it in an HTML representation format.

> #### AI Annotation:
> REST의 이름 자체("Representational State Transfer")에 들어갈 만큼 핵심 개념이다.
> 같은 user 리소스라도 클라이언트에 따라 JSON 표현, XML 표현, HTML 표현으로 다르게 줄 수 있다 — 서버 내부 저장 형태와 무관하다.
> 이 분리가 있으니 서버는 저장 방식을 자유롭게 바꿔도 클라이언트에게 같은 표현을 일관되게 줄 수 있다.

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

> #### AI Annotation:
> AWS는 5가지로 소개하지만 Fielding 원전은 Client-Server를 추가해 6가지로 정의한다.
> AWS가 "some of the principles"라고 쓴 이유 — Client-Server는 워낙 자명해 일부 입문 문서에서 생략된다.
> 6가지 중 **Code on Demand만 선택(optional)** 이고 나머지는 필수다.
> 면접에선 6가지로 외우는 게 안전하다.

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

> #### AI Annotation:
> 4가지 하위 제약을 한 줄로 요약하면: (1) URL로 리소스 식별, (2) 받은 표현만으로 수정·삭제 가능, (3) 메시지 자체가 자기 해석법을 담음, (4) 응답이 다음 행동 링크(HATEOAS)를 제공.
> 실무에선 앞 3개까지만 지키는 경우가 대부분이고, HATEOAS는 거의 안 지킨다.
> Fielding은 4개를 다 지켜야 진짜 RESTful이라 보지만, 업계 합의는 Level 2(메서드+상태코드 활용)까지를 REST라 부른다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Statelessness 제약은 무엇이며 어떤 이점을 주는가?

### Official Answer
In REST architecture, statelessness refers to a communication method in which the server completes every client request independently of all previous requests.
Clients can request resources in any order, and every request is stateless or isolated from other requests.
This REST API design constraint implies that the server can completely understand and fulfill the request every time.

> #### AI Annotation:
> 핵심 함의: **요청 하나만 보면 그 요청을 처리하기에 충분해야 한다.**
> 이점은 확장성 — 어떤 서버 인스턴스가 받아도 동일하게 처리 가능하므로 로드밸런서로 자유롭게 분산할 수 있다.
> 단점은 매 요청마다 인증·컨텍스트를 다 보내야 해서 페이로드가 커진다는 점.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Layered System 제약은 어떤 효용을 주며, 클라이언트에게 어떻게 보이는가?

### Official Answer
In a layered system architecture, the client can connect to other authorized intermediaries between the client and server, and it will still receive responses from the server.
Servers can also pass on requests to other servers.
You can design your RESTful web service to run on several servers with multiple layers such as security, application, and business logic, working together to fulfill client requests.
These layers remain invisible to the client.

> #### AI Annotation:
> 실무 예: 클라이언트는 `api.example.com`만 부르지만 그 뒤에 CDN → API Gateway → Auth 서비스 → 비즈니스 서비스 → DB 식의 다층 구조가 숨어 있을 수 있다.
> 클라이언트는 이 구조를 몰라도 되고, 회사가 내부 구조를 바꿔도 클라이언트는 영향을 받지 않는다 — 그게 Layered System의 효용이다.

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

> #### AI Annotation:
> 핵심은 **응답이 스스로 자기 캐싱 정책을 선언한다**는 점 — 이 자기-선언이 Cache-Control 헤더로 구현된다.
> 클라이언트·CDN·프록시 어디서든 같은 메타데이터를 읽고 일관되게 캐시 정책을 적용할 수 있다.
> 캐싱이 "응답의 자기-선언 방식"이라는 점이 잡혀 있어야 Cache-Control 학습이 자연스러워진다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Code on Demand 제약은 다른 제약들과 어떻게 다른가? 실무 예시는?

### Official Answer
In REST architectural style, servers can temporarily extend or customize client functionality by transferring software programming code to the client.
For example, when you fill a registration form on any website, your browser immediately highlights any mistakes you make, such as incorrect phone numbers.
It can do this because of the code sent by the server.

> #### AI Annotation:
> 6대 제약 중 **유일하게 선택(optional)** 인 제약 — 안 지켜도 REST다.
> 실무에서 이 제약을 만족시키는 가장 흔한 사례가 JavaScript — 서버가 HTML과 함께 JS를 내려주면 브라우저는 받은 코드를 실행해 동작이 동적으로 확장된다.
> 그래서 일반적인 웹 페이지는 별다른 의도 없이도 Code on Demand를 자연스럽게 만족시키고 있는 셈이다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## [UNVERIFIED] Client-Server 제약이란 무엇이며 왜 6대 제약 중 가장 자명한 것으로 취급되는가?

### Reference
- https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- https://en.wikipedia.org/wiki/REST

---

## RESTful API가 가져다주는 핵심 이점은 무엇이며, 그것은 앞서 본 어떤 제약에서 비롯되는가?

### Official Answer
RESTful APIs include the following benefits:

- Scalability
- Flexibility
- Independence

> #### AI Annotation:
> 세 이점은 별도 추가 기능이 아니라 5가지 원칙을 지킨 결과로 자동으로 따라온다.
> Scalability ← Statelessness + Cacheability.
> Flexibility ← Client-Server 분리 + Layered System.
> Independence ← Uniform Interface(표준 포맷).

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API의 Scalability(확장성)는 어떻게 달성되는가?

### Official Answer
Systems that implement REST APIs can scale efficiently because REST optimizes client-server interactions.
Statelessness removes server load because the server does not have to retain past client request information.
Well-managed caching partially or completely eliminates some client-server interactions.
All these features support scalability without causing communication bottlenecks that reduce performance.

> #### AI Annotation:
> 서버를 stateless로 만들면 어떤 인스턴스가 받아도 동일하게 처리 가능하므로 수평 확장이 자유롭다.
> 캐싱은 같은 응답이 반복될 때 서버 호출 자체를 없앨 수 있어, 트래픽 증가가 곧 서버 부하 증가가 되지 않게 한다.

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

> #### AI Annotation:
> 예: 서버를 Java→Go로 다시 짜도 클라이언트는 같은 HTTP 요청만 보내면 된다.
> Layered System 제약이 만들어내는 이점이 여기서 구체화 — DB를 PostgreSQL→MongoDB로 갈아도 API 응답 포맷만 같으면 클라이언트는 영향을 받지 않는다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API가 "기술 독립적(Independence)"이라는 말의 의미는?

### Official Answer
REST APIs are independent of the technology used.
You can write both client and server applications in various programming languages without affecting the API design.
You can also change the underlying technology on either side without affecting the communication.

> #### AI Annotation:
> 이게 가능한 이유: REST는 HTTP·URI·표준 메시지 포맷이라는 인터페이스만 합의하고 구현 언어를 강제하지 않기 때문이다.
> 비교: gRPC는 Protocol Buffers라는 IDL을 강제 — REST보다 빠르지만 양쪽이 같은 IDL 컴파일러를 써야 한다.

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

> #### AI Annotation:
> 본질은 "요청 → 인증/인가 → 처리 → 응답" 사이클이며, 매 사이클이 stateless로 독립적이다.
> 인터넷 서핑(URL 입력 → 페이지 받기)과 본질적으로 같은 흐름이라는 비유가 유용하다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST API에서 "API documentation"이 필수인 이유는 무엇인가?

### Official Answer
API developers explain how the client should use the REST API in the server application API documentation.
The REST API request and response details vary slightly depending on how the API developers design the API.

> #### AI Annotation:
> REST는 표준(HTTP·URI·메서드)만 정의하지 구체 스키마는 팀마다 다르다.
> 클라이언트가 "서버가 이해할 수 있는 형식으로 요청을 구성"하려면 문서가 있어야 하며, 그래서 Swagger·OpenAPI·Postman 같은 도구가 사실상 필수가 됐다.
> gRPC가 IDL(.proto)로 스키마를 강제하는 것과 비교하면, REST의 자유도가 곧 문서화 부담을 만든다.

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

> #### AI Annotation:
> 요청 한 번 = (1) 무엇에(URL) (2) 무엇을 할지(Method) (3) 어떤 부가 정보로(Headers) (4) 어떤 본문 데이터로(Data) (5) 어떤 파라미터로(Parameters).
> 이 5개가 합쳐져 하나의 HTTP 요청 메시지를 이룬다.

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

> #### AI Annotation:
> URL = endpoint = 리소스 식별자라는 어휘 정리가 핵심.
> API 문서에서 자주 보는 단어이고, 정의가 흐릿하면 "endpoint를 친다"는 표현이 어색하게 들린다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## HTTP 메서드는 클라이언트의 무엇을 표현하는가? RESTful API에서 흔히 쓰는 4가지 메서드(GET/POST/PUT/DELETE)는 각각 어떤 동작을 의미하는가?

### Official Answer
Developers often implement RESTful APIs by using the Hypertext Transfer Protocol (HTTP).
An HTTP method tells the server what it needs to do to the resource.
The following are four common HTTP methods:

**GET**

Clients use GET to access resources that are located at the specified URL on the server.
They can cache GET requests and send parameters in the RESTful API request to instruct the server to filter data before sending.

**POST**

Clients use POST to send data to the server.
They include the data representation with the request.
Sending the same POST request multiple times has the side effect of creating the same resource multiple times.

**PUT**

Clients use PUT to update existing resources on the server.
Unlike POST, sending the same PUT request multiple times in a RESTful web service gives the same result.

**DELETE**

Clients use the DELETE request to remove the resource.
A DELETE request can change the server state.
However, if the user does not have appropriate authentication, the request fails.

> #### AI Annotation:
> AWS 문서는 "idempotent"라는 단어를 안 쓰지만, POST와 PUT의 차이를 멱등성 정의 그대로 풀어 설명한다 — 멱등성 학습의 시작점.
> 더 깊은 PUT vs PATCH 비교, Safe vs Idempotent 용어 구분은 별도 TODO에 보존(MDN 출처).

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## HTTP 요청 헤더(headers)란 무엇이며 어떤 역할을 하는가?

### Official Answer
Request headers are the metadata exchanged between the client and server.
For instance, the request header indicates the format of the request and response, provides information about request status, and so on.

> #### AI Annotation:
> 본문(data)이 아니라 본문을 어떻게 처리할지에 대한 정보 — `Content-Type`, `Authorization` 같은 것이 대표적.
> 메타데이터라는 본질을 잡아두면 이후 캐싱(Cache-Control)·인증(Authorization) 학습에 발판이 된다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST API 요청에서 본문(data)은 어떤 메서드와 함께 사용되는가?

### Official Answer
REST API requests might include data for the POST, PUT, and other HTTP methods to work successfully.

> #### AI Annotation:
> GET이나 DELETE는 보통 본문이 없고, POST·PUT·PATCH 같은 "쓰기" 계열 메서드에서 본문에 데이터를 실어 보낸다.
> "GET에 body 보내도 되나요?" 같은 흔한 헷갈림에 대한 답: 표준이 금지하지는 않지만 관례상 안 쓴다.

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

> #### AI Annotation:
> - **Path parameters**: URL 경로 일부. 예: `/users/{userId}`의 `{userId}` — 특정 리소스를 지목
> - **Query parameters**: 리소스에 대한 추가 정보 요청. 예: `/users?role=admin&page=2` — 필터·정렬·페이징
> - **Cookie parameters**: 클라이언트를 빠르게 인증. 세션 ID 같은 용도
>
> "왜 ID는 path, 필터는 query에 두나요?"의 답이 여기에서 시작된다 — path는 리소스 식별, query는 그 리소스에 대한 추가 조건.

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

> #### AI Annotation:
> 4가지 방식의 보안 강도는 대체로 Basic < API key < Bearer ≤ OAuth 순으로 올라간다.
> Basic은 매 요청마다 비번 자체가 흘러다녀 가장 약하고, API key는 키 자체가 흘러 탈취 위험.
> Bearer는 만료 가능한 토큰이라 더 안전하지만 토큰이 노출되면 끝.
> OAuth는 토큰에 scope·longevity를 더해 가장 정교한 통제 가능.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## Bearer 인증의 "bearer"라는 단어가 가리키는 것은 무엇이며, 왜 그 이름이 붙었는가?

### Official Answer
The term bearer authentication refers to the process of giving access control to the token bearer.
The bearer token is typically an encrypted string of characters that the server generates in response to a login request.
The client sends the token in the request headers to access resources.

> #### AI Annotation:
> 이름 그대로 "토큰만 가지고 있으면 누구든 권한자" — 그래서 토큰 탈취가 곧 계정 탈취가 된다.
> 실무 예: `Authorization: Bearer eyJhbGc...` 헤더가 JWT 운반의 표준 형식.
> "왜 토큰을 잃어버리면 큰일인가"의 직접 답이며, JWT 학습으로 이어지는 발판이 된다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## API key 방식은 어떻게 동작하며, 왜 보안성이 떨어진다고 평가되는가?

### Official Answer
API keys are another option for REST API authentication.
In this approach, the server assigns a unique generated value to a first-time client.
Whenever the client tries to access resources, it uses the unique API key to verify itself.
API keys are less secure because the client has to transmit the key, which makes it vulnerable to network theft.

> #### AI Annotation:
> Bearer token처럼 만료가 없거나 길면 더 위험하다.
> 그럼에도 API key가 자주 쓰이는 이유는 편의성, 서비스 간 통신, rate limit 키로의 활용 등 — 보안 외 목적이 많다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## OAuth는 다른 인증 방식과 어떻게 다른가? "scope"과 "longevity"라는 개념은 어떤 통제를 가능하게 하는가?

### Official Answer
OAuth combines passwords and tokens for highly secure login access to any system.
The server first requests a password and then asks for an additional token to complete the authorization process.
It can check the token at any time and also over time with a specific scope and longevity.

> #### AI Annotation:
> OAuth가 다른 방식보다 정교한 이유는 scope·longevity라는 추가 차원 덕분.
> 예: 구글 OAuth에서 "Gmail 읽기 권한"만 받기 (scope), "1시간 후 만료" 설정 (longevity).
> ⚠️ AWS 본문은 "OAuth combines passwords and tokens"라고 단순화했지만, 실제 OAuth 2.0은 비밀번호 없이도 동작하는 흐름(Authorization Code Flow)이 표준이고 비밀번호를 직접 다루는 흐름(Resource Owner Password Credentials)은 deprecated.
> AWS 설명은 입문 수준의 단순화라는 점을 알아두면 좋다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## RESTful API 서버 응답은 어떤 구성요소들을 포함하는가?

### Official Answer
REST principles require the server response to contain the following main components:

- Status line
- Message body
- Headers

> #### AI Annotation:
> 응답 = (1) 상태 줄(성공/실패 알림) + (2) 바디(리소스 표현) + (3) 헤더(메타데이터).
> 요청과 대칭적인 구조다 — 요청의 5개 부품(URL/Method/Headers/Data/Parameters)에 대응되는 응답 측 부품.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## HTTP 응답 상태 코드는 어떤 클래스(2XX/3XX/4XX/5XX)로 나뉘며, 각각은 무엇을 의미하는가? 자주 보는 코드 몇 개를 예로 들면?

### Official Answer
The status line contains a three-digit status code that communicates request success or failure.
For instance, 2XX codes indicate success, but 4XX and 5XX codes indicate errors.
3XX codes indicate URL redirection.

The following are some common status codes:

- 200: Generic success response
- 201: POST method success response
- 400: Incorrect request that the server cannot process
- 404: Resource not found

> #### AI Annotation:
> 상태 코드 4개 클래스가 면접 1번 단골 — 2XX 성공, 3XX 리다이렉션, 4XX 클라이언트 에러, 5XX 서버 에러.
> 더 깊은 코드별 비교(401 vs 403, 400 vs 422)는 별도 TODO에 보존되어 있다.

### Reference
- https://aws.amazon.com/what-is/restful-api/

---

## REST 응답 헤더에는 어떤 종류의 정보가 담기는가?

### Official Answer
The response also contains headers or metadata about the response.
They give more context about the response and include information such as the server, encoding, date, and content type.

> #### AI Annotation:
> 요청 헤더와 대칭 구조 — 둘 다 메타데이터를 담는다.
> 응답 측 대표 헤더: `Content-Type: application/json`(콘텐츠 타입), `Date: ...`(날짜), `Server: nginx/...`(서버 정보), `Content-Encoding: gzip`(인코딩) 등.

### Reference
- https://aws.amazon.com/what-is/restful-api/
