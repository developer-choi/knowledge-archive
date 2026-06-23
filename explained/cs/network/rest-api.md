# API란 무엇인가?

## 도입

API(Application Programming Interface)는 두 소프트웨어 시스템이 서로 소통하는 방법을 정의한 규칙 집합이다. 사람이 클릭하는 UI와 달리, API는 코드가 코드를 호출하기 위한 약속이다. OA는 API를 "클라이언트와 웹 자원 사이의 관문(gateway)"으로 비유한다.

---

## 본문

> An application programming interface (API) defines the rules that you must follow to communicate with other software systems.
> Developers expose or create APIs so that other applications can communicate with their applications programmatically.

"API는 다른 소프트웨어 시스템과 통신하기 위해 반드시 따라야 하는 규칙을 정의한다. 개발자는 다른 애플리케이션이 자기 애플리케이션과 프로그래밍 방식으로 통신할 수 있게 하려고 API를 노출하거나 만든다."

- **interface**: 두 시스템 사이의 약속된 접점. 함수 시그니처처럼 입력과 출력이 합의된 계약이다. 내부 구현이 어떻게 바뀌든 이 계약만 지키면 된다.
- **expose**: "노출한다" — 모든 함수를 공개하는 게 아니라, 외부에 허용할 표면만 골라서 공개한다. JS 모듈에서 `export`하는 것과 같은 개념이다.
- **programmatically**: 사람이 직접 클릭하는 게 아니라 코드가 코드를 호출하는 방식. `fetch()`나 `axios.get()`이 대표적이다.

> For example, the timesheet application exposes an API that asks for an employee's full name and a range of dates.
> When it receives this information, it internally processes the employee's timesheet and returns the number of hours worked in that date range.

> You can think of a web API as a gateway between clients and resources on the web.

"웹 API를 클라이언트와 웹 자원 사이의 관문으로 생각할 수 있다."

- **gateway**: 통과 지점. 모든 요청이 이 한 점을 거치기 때문에 인증·로깅·권한 검사를 중앙화할 수 있다. 관문이 없으면 클라이언트가 DB에 직접 붙어야 하므로 보안이 각 클라이언트마다 따로 구현되어야 한다.

---

## 종합

API의 핵심 가치는 두 가지다. 첫째, 내부 구현을 감추고 외부에 정해진 인터페이스만 노출해 내부를 자유롭게 바꿀 수 있다. 둘째, 모든 요청이 API 관문을 거치므로 인증·인가·로깅·캐싱을 한 곳에서 처리할 수 있다. 관문이 없으면 이 모든 것을 클라이언트마다 중복 구현해야 하고, 하나라도 빠지면 보안 사고로 이어진다.

---

# 웹 API에서 "클라이언트(client)"는 무엇을 가리키는가? 사람만을 의미하는가?

## 도입

"클라이언트"라고 하면 웹 브라우저를 사용하는 사람을 떠올리기 쉽지만, REST API에서 클라이언트의 정의는 훨씬 넓다. 같은 API를 브라우저도 쓰고 서버도 쓰고 CLI 도구도 쓸 수 있다.

---

## 본문

> Clients are users who want to access information from the web.
> The client can be a person or a software system that uses the API.

"클라이언트는 웹에서 정보에 접근하기를 원하는 사용자다. 클라이언트는 사람이거나 API를 사용하는 소프트웨어 시스템일 수 있다."

- **a person or a software system**: 클라이언트가 사람일 수도, 프로그램일 수도 있다. 실제로 대부분의 API 트래픽은 사람이 아니라 서버·봇·자동화 스크립트가 만들어낸다.

> For example, developers can write programs that access weather data from a weather system.
> Or you can access the same data from your browser when you visit the weather website directly.

"개발자는 날씨 시스템에서 날씨 데이터에 접근하는 프로그램을 작성할 수 있다. 또는 날씨 웹사이트에 직접 방문해 브라우저에서 같은 데이터에 접근할 수 있다."

같은 API를 두 클라이언트가 다른 방식으로 소비하는 예다 — 프로그램(소프트웨어 클라이언트)과 브라우저(사용자 클라이언트).

이처럼 하나의 REST API가 동시에 여러 클라이언트 유형을 서비스할 수 있는 이유는, REST가 HTTP라는 공통 프로토콜 위에서 동작하기 때문이다. 클라이언트가 무엇이든 HTTP만 말할 줄 알면 통신이 된다.

---

## 종합

클라이언트가 사람이든 프로그램이든 API는 동일하게 응답한다. 이것이 REST API의 강점 중 하나다 — 모바일 앱, 웹 브라우저, 서버, CLI 스크립트가 모두 같은 엔드포인트를 공유할 수 있다. 프론트엔드에서 `fetch("/api/users")`를 호출하는 코드와 백엔드 마이크로서비스가 같은 API를 부르는 코드가 형태만 다를 뿐 본질적으로 같은 클라이언트다.

---

# 웹 API에서 "리소스(resource)"는 무엇을 가리키며, 누가 그것을 제공하는가?

## 도입

REST에서 URL의 본질은 "리소스의 주소"다. 그런데 리소스가 JSON에만 한정된다고 오해하기 쉽다. OA는 리소스의 범위를 명확히 정의하고, 그것을 제공하는 주체를 서버라고 부른다.

---

## 본문

> Resources are the information that different applications provide to their clients.
> Resources can be images, videos, text, numbers, or any type of data.

"리소스는 다양한 애플리케이션이 클라이언트에게 제공하는 정보다. 리소스는 이미지, 비디오, 텍스트, 숫자, 또는 어떤 유형의 데이터도 될 수 있다."

- **resource**: REST의 핵심 추상화 단위. "사용자 1번", "주문 42번", "프로필 이미지" 같은 개체. URL이 이 리소스를 식별하는 주소다.
- **any type of data**: JSON만이 아니다. 이미지 파일, 동영상, 바이너리 데이터 모두 REST 리소스가 될 수 있다.

> The machine that gives the resource to the client is also called the server.

"클라이언트에게 리소스를 주는 기계를 서버라고도 부른다."

- **server**: 리소스를 제공하는 컴퓨터. REST의 6대 제약 중 첫 번째인 Client-Server 분리에서 "Server" 쪽이다. 클라이언트는 요청하고 서버는 응답한다는 역할 분리가 명확하다.

---

## 종합

REST에서 URL은 "무엇"을 가리키는 주소고, HTTP 메서드는 "어떤 동작"을 할지 표현한다. 리소스가 JSON에 한정되지 않는다는 점은 실무에서도 중요하다 — `GET /avatar/123`은 JSON이 아니라 PNG 이미지를 돌려줄 수 있고, 그것도 REST 리소스다. 서버는 클라이언트가 요청하는 리소스를 관리하고 적절한 표현(representation)으로 응답하는 주체다.

---

# API는 단순히 데이터를 주고받는 통로인가? 조직이 DB를 직접 공개하지 않고 API 계층을 두는 이유는 무엇인가?

## 도입

"API가 있는데 DB를 직접 공개하면 안 되나요?"라는 질문에 대한 답이 이 질문의 핵심이다. API는 단순한 통로가 아니라 접근 제어의 관문이다.

---

## 본문

> Organizations use APIs to share resources and provide web services while maintaining security, control, and authentication.
> In addition, APIs help them to determine which clients get access to specific internal resources.

"조직은 보안, 통제, 인증을 유지하면서 자원을 공유하고 웹 서비스를 제공하기 위해 API를 사용한다. 또한 API는 어떤 클라이언트가 특정 내부 자원에 접근할 수 있는지 결정하는 데 도움을 준다."

- **security / control / authentication**: 보안/통제/인증. API가 단순 데이터 통로가 아니라 게이트 역할을 하는 핵심 이유다. DB를 직접 공개하면 이 세 가지를 구현할 위치가 없다.
- **determine which clients**: 호출자에 따라 접근 가능한 리소스를 분기한다. 관리자는 모든 사용자 데이터에 접근하고, 일반 사용자는 자기 데이터만 볼 수 있도록 API 계층에서 권한을 분기한다.

```
DB 직접 공개 (X)                  API 계층 경유 (O)

클라이언트 A ──→ [DB]            클라이언트 A ──→ [API] ──→ [DB]
클라이언트 B ──→ [DB]            클라이언트 B ──→ [API] ──→ [DB]
                                               ↑
                                  인증·인가·로깅·캐싱
                                  모두 여기서 처리
```

---

## 종합

API 계층이 없으면 DB 접근 로직이 각 클라이언트에 흩어지고, 인증 로직 하나를 빠뜨린 클라이언트가 보안 구멍이 된다. API를 관문으로 두면 모든 요청이 동일한 보안 검사를 거치며, 내부 DB 구조가 바뀌어도 API 응답 형식만 유지하면 클라이언트에 영향이 없다.

---

# RESTful API란 무엇인가?

## 도입

"API"와 "RESTful API"는 같은 말이 아니다. RESTful은 API 중에서 REST의 원칙(제약)을 따르는 것을 뜻한다. OA는 RESTful API가 "안전하고 신뢰할 수 있는 소프트웨어 통신 표준을 따르기 때문에" 정보 교환을 지원한다고 말한다.

---

## 본문

> RESTful API is an interface that two computer systems use to exchange information securely over the internet.

"RESTful API는 두 컴퓨터 시스템이 인터넷을 통해 안전하게 정보를 교환하기 위해 사용하는 인터페이스다."

- **securely**: HTTPS·인증 토큰·권한 검증을 전제한다. 평문 HTTP를 쓰면 MITM 공격에 노출된다.

> RESTful APIs support this information exchange because they follow secure, reliable, and efficient software communication standards.

"RESTful API는 안전하고 신뢰할 수 있으며 효율적인 소프트웨어 통신 표준을 따르기 때문에 이 정보 교환을 지원한다."

- **secure / reliable / efficient**: 보안(인증·암호화) / 안정성(예측 가능한 HTTP 메서드 시맨틱) / 효율(캐싱·멀티플렉싱).
- **standards**: HTTP, URI, JSON 같은 공개 표준. 회사마다 자체 통신 규약을 만들지 않아도 된다.

"RESTful"은 "REST의 성질을 가진"이라는 형용사다. 실무에서는 "REST API"와 거의 동의어로 혼용되지만, 학술적으로는 Fielding이 정의한 6대 제약을 모두 지켜야 진정한 RESTful이라고 본다.

---

## 종합

RESTful API는 그냥 API가 아니라 REST 원칙을 따른다는 설계 선언이다. HTTP 위에서 동작하지만, REST 원칙을 지키지 않으면 단순한 HTTP API에 그친다. 다음 질문들이 REST의 원칙이 무엇인지 구체적으로 다룬다.

---

# 모든 API가 RESTful API인가? RESTful API와 그냥 API는 어떻게 다른가?

## 도입

모든 API가 RESTful하지는 않다. API는 소통 규칙의 집합이라는 넓은 개념이고, RESTful API는 그중에서 REST 제약을 따르는 특정 스타일의 API다.

---

## 본문

> An application programming interface (API) defines the rules that you must follow to communicate with other software systems.
> RESTful APIs support this information exchange because they follow secure, reliable, and efficient software communication standards.

"API는 다른 소프트웨어 시스템과 통신하기 위해 따라야 하는 규칙을 정의한다. RESTful API는 안전하고 신뢰할 수 있는 표준을 따르기 때문에 정보 교환을 지원한다."

API라는 큰 범주 안에 여러 스타일이 있다:
- REST API: HTTP, URI, 상태 코드 시맨틱을 활용하는 제약 기반 스타일
- SOAP: XML 메시지와 엄격한 계약(WSDL)을 사용하는 프로토콜
- GraphQL: 단일 엔드포인트에서 클라이언트가 쿼리로 필요한 데이터를 지정하는 방식
- gRPC: Protocol Buffers와 HTTP/2를 사용하는 고성능 RPC 방식

---

## 종합

"REST API 써요?"라고 물으면 대부분 "네"라고 답하지만, 엄밀히 말하면 Fielding의 6대 제약을 모두 지키는 진짜 RESTful API는 드물다. 업계 관행으로는 HTTP 메서드와 상태 코드를 올바르게 쓰는 수준(Richardson Maturity Model Level 2)을 REST라고 부른다.

---

# REST(Representational State Transfer)란 무엇인가?

## 도입

REST는 프로토콜이 아니라 스타일이다. HTTP라는 프로토콜 위에서 REST 스타일을 따를 수도 있고 안 따를 수도 있다. OA는 REST를 "API가 어떻게 작동해야 하는지에 대한 조건을 부과하는 소프트웨어 아키텍처"로 정의한다.

---

## 본문

> Representational State Transfer (REST) is a software architecture that imposes conditions on how an API should work.

"REST(표현적 상태 전달)는 API가 어떻게 작동해야 하는지에 대한 조건을 부과하는 소프트웨어 아키텍처다."

- **software architecture**: 구현 기술이 아니라 설계 원칙. 어떤 언어·프레임워크를 쓰든 REST 원칙을 따를 수 있다.
- **imposes conditions**: "조건을 부과한다" — 이 조건들이 6대 제약(Uniform Interface, Statelessness, Layered System, Cacheability, Code on Demand, Client-Server)이다.

> REST was initially created as a guideline to manage communication on a complex network like the internet.

"REST는 처음에 인터넷 같은 복잡한 네트워크에서 통신을 관리하기 위한 가이드라인으로 만들어졌다."

- **guideline**: 강제 규격(RFC)이 아닌 권장 원칙. 지키지 않아도 HTTP는 동작하지만, 지키면 확장성·유지보수성이 좋아진다.

> You can use REST-based architecture to support high-performing and reliable communication at scale.
> You can easily implement and modify it, bringing visibility and cross-platform portability to any API system.

"REST 기반 아키텍처를 사용해 규모에서의 고성능·신뢰성 있는 통신을 지원할 수 있다. 쉽게 구현하고 수정할 수 있어, 어떤 API 시스템에도 가시성과 크로스 플랫폼 이식성을 가져다준다."

- **at scale**: 사용자·요청이 많아져도 동작. Statelessness와 Cacheability 제약 덕분이다.
- **visibility**: 중간 노드(프록시·로드밸런서)가 요청을 들여다볼 수 있다. self-descriptive 메시지 덕분이다.
- **cross-platform portability**: 클라이언트 종류와 무관하게 동작. 브라우저·모바일·서버·CLI 모두 같은 API를 쓸 수 있다.

---

## 종합

REST의 핵심은 "HTTP라는 기존 프로토콜 위에 제약을 얹어 예측 가능하고 확장 가능한 통신을 만드는 것"이다. 이름 자체("Representational State Transfer")가 이미 핵심을 담고 있다 — 상태(State)를 표현(Representation)으로 전달(Transfer)한다. 서버가 내부 DB 행을 그대로 보내는 게 아니라, 클라이언트에게 적합한 JSON/XML/HTML 형식으로 변환해서(Representational) 전달하는 것이다.

---

# REST에서 "representation"이란 무엇이며, 리소스(resource) 자체와 어떻게 다른가?

## 도입

REST 이름의 첫 단어 "Representational"이 정확히 무엇을 뜻하는지가 이 질문이다. 리소스는 서버 내부의 데이터고, representation은 그것을 클라이언트에 전달하기 위해 형식화한 결과물이다. 둘은 분리되어 있다.

---

## 본문

> The formatted resource is called a representation in REST.

"형식화된 리소스를 REST에서 표현(representation)이라고 부른다."

- **formatted**: 클라이언트가 받을 수 있는 형태로 변환된 것. DB에 저장된 행(row)이 아니라, 그것을 JSON·XML·HTML 등으로 변환한 결과물이다.
- **representation**: REST의 핵심 어휘. 리소스 자체가 아니라 "리소스의 표현"이다.

> This format can be different from the internal representation of the resource on the server application.
> For example, the server can store data as text but send it in an HTML representation format.

"이 형식은 서버 애플리케이션 내부의 리소스 표현과 다를 수 있다. 예를 들어 서버는 데이터를 텍스트로 저장하지만 HTML 표현 형식으로 보낼 수 있다."

- **internal representation**: 서버가 데이터를 저장하는 형태. DB 행, 파일, 메모리 객체 등이다.

```
리소스 vs Representation

[DB 내부]              [API 응답]            [클라이언트에 따라]
user 테이블             JSON 표현             모바일 앱 → JSON
id: 1                  {                     브라우저 → HTML
name: "Alice"            "id": 1,            파일 다운로드 → XML
email: "a@b.com"         "name": "Alice"
                       }
     ↑                        ↑
  리소스 (내부)           Representation (전달 형태)
```

같은 user 리소스라도 클라이언트 요청에 따라 JSON·XML·HTML로 다르게 표현할 수 있다 — 이것이 Content Negotiation(콘텐츠 협상)이다.

---

## 종합

리소스와 representation의 분리가 REST의 유연성을 만든다. 서버가 PostgreSQL에서 MongoDB로 저장 방식을 바꿔도 API 응답 JSON이 같으면 클라이언트는 전혀 영향을 받지 않는다. 이 분리가 없으면 내부 구현이 바뀔 때마다 클라이언트도 수정해야 한다.

---

# REST 아키텍처가 따르는 핵심 원칙(제약)들은 무엇인가?

## 도입

REST의 핵심 원칙들은 "제약(constraint)"이라고 부른다. 이 제약들을 따르면 확장성·유연성·독립성이라는 이점이 자연스럽게 따라온다. OA(AWS)는 5개로 소개하지만 Fielding 원전은 Client-Server를 추가해 6개다.

---

## 본문

REST의 5가지 원칙 (AWS 기준):

- Uniform Interface
- Statelessness
- Layered System
- Cacheability
- Code on Demand

> AWS는 5가지로 소개하지만 Fielding 원전은 Client-Server를 추가해 6가지로 정의한다. AWS가 "some of the principles"라고 쓴 이유는 Client-Server가 워낙 자명해 일부 입문 문서에서 생략되기 때문이다. 6가지 중 **Code on Demand만 선택(optional)**이고 나머지는 필수다. 면접에서는 6가지로 답하는 게 안전하다.

```
REST 6대 제약 (Fielding 원전 기준)

필수:
├── Client-Server     클라이언트와 서버의 역할 분리
├── Statelessness     서버가 클라이언트 상태를 저장하지 않음
├── Cacheability      응답이 캐시 가능 여부를 자기 선언
├── Uniform Interface 4가지 하위 제약으로 표준화된 인터페이스
└── Layered System    클라이언트는 중간 계층을 모름

선택(optional):
└── Code on Demand    서버가 클라이언트에 코드를 전송해 기능 확장
```

---

## 종합

6대 제약은 인터넷 규모의 분산 통신을 관리 가능하게 만들기 위한 최소한의 규칙이다. 제약이 많을수록 자유도가 줄어드는 것처럼 보이지만, 실제로는 이 제약들이 예측 가능성과 확장성을 만들어낸다. REST를 "규칙 덩어리"가 아니라 "인터넷 규모에서 검증된 설계 패턴"으로 이해하는 게 핵심이다.

---

# Uniform Interface 제약이란 무엇이며, 그 4가지 하위 제약은 각각 무엇인가?

## 도입

Uniform Interface는 REST의 6대 제약 중 가장 중요하고 복잡한 제약이다. 클라이언트와 서버가 공통된 형식으로 통신하게 강제함으로써, 양쪽이 독립적으로 진화할 수 있게 만든다.

---

## 본문

> The uniform interface is fundamental to the design of any RESTful webservice.
> It indicates that the server transfers information in a standard format.

"Uniform Interface는 모든 RESTful 웹 서비스 설계의 근간이다. 서버가 표준 형식으로 정보를 전달한다는 것을 의미한다."

- **fundamental**: 근간. 4가지 하위 제약을 거느리는 가장 큰 원칙이다.

4가지 하위 제약:

1. **URI로 리소스 식별**: 요청은 리소스를 식별해야 한다. Uniform Resource Identifier를 사용한다.

2. **표현으로 리소스 수정/삭제 가능**: 클라이언트는 리소스 표현 안에 그 리소스를 수정하거나 삭제하기에 충분한 정보를 갖는다. 서버는 리소스를 더 설명하는 메타데이터를 함께 보냄으로써 이 조건을 충족한다.

3. **Self-descriptive 메시지**: 클라이언트는 표현을 처리하는 방법에 대한 정보를 응답에서 받는다. 서버는 클라이언트가 최선으로 활용할 수 있도록 메타데이터를 담은 자기 서술 메시지를 전송한다.

4. **HATEOAS (하이퍼링크)**: 클라이언트는 작업 완수에 필요한 모든 관련 자원에 대한 정보를 받는다. 서버는 표현에 하이퍼링크를 담아 클라이언트가 동적으로 더 많은 자원을 발견할 수 있게 한다.

```
4가지 하위 제약 요약

1. URI 식별      GET /users/42       ← 리소스 식별
2. 표현으로 조작  DELETE /users/42 + Etag 헤더로 조건부 삭제
3. Self-descriptive   Content-Type: application/json 헤더가 포함
4. HATEOAS      응답에 { "links": { "next": "/users?page=2" } }
```

- **uniform resource identifier (URI)**: URL의 상위 개념. REST에서 리소스를 식별하는 고유 주소.
- **self-descriptive messages**: 메시지 자체가 처리 방법 메타데이터를 담음. `Content-Type` 헤더가 대표적이다.
- **hyperlinks in the representation**: 응답에 다음 행동 링크가 포함됨. HATEOAS의 구현이다.

실무에서는 앞 3개까지만 지키는 경우가 대부분이고, HATEOAS는 구현 복잡도 때문에 거의 채택되지 않는다.

---

## 종합

Uniform Interface의 목적은 "클라이언트가 서버 구현을 몰라도 표준화된 약속만으로 통신할 수 있게" 하는 것이다. URI로 무엇을 할지 지정하고, Content-Type으로 형식을 알리고, HATEOAS로 다음 동작 가능한 링크를 제공한다. 이 표준화 덕분에 Swagger 같은 도구가 코드를 보지 않고도 API를 문서화할 수 있다.

---

# Statelessness 제약은 무엇이며 어떤 이점을 주는가?

## 도입

Stateless는 "상태가 없다"는 뜻인데, 정확히는 "서버가 클라이언트의 이전 요청 상태를 저장하지 않는다"는 의미다. 매 요청이 독립적이고, 요청 하나만 보면 그것을 처리하기에 충분한 정보가 모두 담겨 있어야 한다.

---

## 본문

> In REST architecture, statelessness refers to a communication method in which the server completes every client request independently of all previous requests.

"REST 아키텍처에서 statelessness는 서버가 이전의 모든 요청과 무관하게 모든 클라이언트 요청을 독립적으로 완료하는 통신 방법을 말한다."

- **statelessness**: 서버가 클라이언트 세션 정보를 메모리에 보관하지 않는다. "이 클라이언트가 이전에 로그인했는지"를 서버가 기억하지 않는다.
- **independently of all previous requests**: 이전 요청과 완전히 무관. 서버를 재시작해도 요청 처리에 영향이 없어야 한다.

> Clients can request resources in any order, and every request is stateless or isolated from other requests.

"클라이언트는 어떤 순서로든 자원을 요청할 수 있고, 모든 요청은 다른 요청들과 독립적(isolated)이다."

- **isolated**: 격리된. 요청 A가 실패해도 요청 B는 영향을 받지 않는다.

> This REST API design constraint implies that the server can completely understand and fulfill the request every time.

"이 REST API 설계 제약은 서버가 매번 요청을 완전히 이해하고 이행할 수 있다는 것을 의미한다."

단, stateless를 위해 클라이언트는 매 요청마다 인증 토큰, 사용자 정보 등 컨텍스트를 모두 포함해야 한다 — 서버가 기억해주지 않으니까.

```
Stateful vs Stateless

Stateful (세션 기반):
req1: "로그인" → 서버: user_id=42 세션 저장
req2: "내 정보 줘" → 서버: 세션에서 user_id 꺼냄

→ 특정 서버 인스턴스에 종속됨. 로드밸런서가 같은 서버로 붙여야 함.

Stateless (REST):
req1: Authorization: Bearer eyJ...  → 서버: 토큰에서 user_id 추출
req2: Authorization: Bearer eyJ...  → 서버: 동일하게 토큰에서 추출

→ 어느 서버 인스턴스가 받아도 동일하게 처리 가능.
```

---

## 종합

Statelessness의 가장 큰 이점은 수평 확장이다. 서버가 클라이언트 상태를 기억하지 않으므로 로드밸런서가 요청을 아무 인스턴스에나 분산해도 결과가 같다. 서버 인스턴스를 10개로 늘려도 세션 동기화 문제가 없다. 단점은 매 요청에 컨텍스트를 다 실어야 해 페이로드가 커진다 — JWT가 바로 이 문제를 해결하는 Stateless 인증 방식이다.

---

# Layered System 제약은 어떤 효용을 주며, 클라이언트에게 어떻게 보이는가?

## 도입

실제 API 서버는 클라이언트가 보는 단일 엔드포인트 뒤에 CDN·API Gateway·인증 서비스·비즈니스 서비스·DB가 겹겹이 숨어 있을 수 있다. Layered System 제약은 이 구조를 클라이언트에게 보이지 않게 추상화하도록 요구한다.

---

## 본문

> In a layered system architecture, the client can connect to other authorized intermediaries between the client and server, and it will still receive responses from the server.

"계층 시스템 아키텍처에서 클라이언트는 클라이언트와 서버 사이의 인가된 중간자에 연결할 수 있으며, 여전히 서버로부터 응답을 받는다."

- **authorized intermediaries**: 인가된 중간 노드 — CDN, 로드밸런서, API Gateway, 프록시 등. 클라이언트는 이것들과 통신하지만 마치 원본 서버와 직접 통신하는 것처럼 느낀다.

> You can design your RESTful web service to run on several servers with multiple layers such as security, application, and business logic, working together to fulfill client requests.
> These layers remain invisible to the client.

"여러 서버에서 보안·애플리케이션·비즈니스 로직 등 여러 계층이 함께 동작하도록 RESTful 웹 서비스를 설계할 수 있다. 이 계층들은 클라이언트에게 보이지 않는다."

- **invisible to the client**: 클라이언트는 내부 구조를 몰라도 된다. 서버 내부 구조가 바뀌어도 API 인터페이스만 같으면 클라이언트는 영향을 받지 않는다.

```
실제 서버 구조 (클라이언트는 api.example.com만 알고 있음)

클라이언트
    ↓
[CDN] ← 캐시 HIT이면 여기서 응답
    ↓ MISS
[API Gateway] ← 라우팅, 인증 토큰 검증
    ↓
[Auth Service] ← 사용자 권한 확인
    ↓
[Business Logic Server]
    ↓
[Database]
```

---

## 종합

Layered System 덕분에 서버 팀은 내부 구조를 자유롭게 바꿀 수 있다. CDN을 추가하거나, 인증 서비스를 분리하거나, DB를 교체해도 클라이언트 코드는 그대로다. 이것이 REST API의 Flexibility(유연성) 이점으로 연결된다.

---

# RESTful 웹 서비스의 캐싱(Cacheability)은 어떻게 통제되는가?

## 도입

REST의 Cacheability 제약의 핵심은 "응답 자체가 자기 캐싱 정책을 선언한다"는 점이다. 서버가 `Cache-Control` 헤더를 통해 "이 응답은 캐시해도 된다" 또는 "캐시하면 안 된다"를 직접 지시한다.

---

## 본문

> RESTful web services support caching, which is the process of storing some responses on the client or on an intermediary to improve server response time.

"RESTful 웹 서비스는 캐싱을 지원한다. 캐싱은 서버 응답 시간을 개선하기 위해 일부 응답을 클라이언트나 중간 노드에 저장하는 과정이다."

- **caching**: 응답을 재사용해 서버 왕복을 줄이는 메커니즘. 브라우저 캐시, CDN 캐시, 프록시 캐시 모두 여기에 해당한다.
- **intermediary**: CDN·프록시 같은 중간 노드. Layered System 제약의 중간자들이 캐싱도 담당한다.

> RESTful web services control caching by using API responses that define themselves as cacheable or noncacheable.

"RESTful 웹 서비스는 자신을 캐시 가능 또는 불가능으로 정의하는 API 응답을 사용해 캐싱을 통제한다."

- **define themselves as cacheable or noncacheable**: 응답이 스스로 캐시 정책을 선언한다. 이 자기-선언이 `Cache-Control` 헤더로 구현된다.

```
캐싱 통제 예시

캐시 가능:
HTTP/1.1 200 OK
Cache-Control: public, max-age=3600
Content-Type: application/json

→ 클라이언트·CDN이 1시간 동안 이 응답을 재사용

캐시 불가:
HTTP/1.1 200 OK
Cache-Control: no-store
Content-Type: application/json

→ 절대 저장 금지 (인증 정보, 민감 데이터)
```

---

## 종합

Cacheability의 핵심은 캐시 제어 권한이 서버에 있다는 점이다. 서버가 "이 응답은 캐시해도 돼"라고 선언하면 브라우저·CDN·프록시 모두 동일한 기준으로 캐싱한다. 반대로 "캐시하지 마"라고 하면 어디서도 캐싱되지 않는다. DevTools Network 탭에서 "from cache", "from disk cache"가 뜨는 것이 이 메커니즘의 결과다.

---

# Code on Demand 제약은 다른 제약들과 어떻게 다른가? 실무 예시는?

## 도입

Code on Demand는 6대 제약 중 유일하게 선택(optional)인 제약이다. 나머지 5개는 REST를 REST답게 만드는 필수 조건이지만, Code on Demand는 안 지켜도 REST다. 그럼에도 대부분의 웹 서비스가 자연스럽게 구현하고 있다.

---

## 본문

> In REST architectural style, servers can temporarily extend or customize client functionality by transferring software programming code to the client.

"REST 아키텍처 스타일에서 서버는 클라이언트에게 소프트웨어 코드를 전송함으로써 클라이언트 기능을 일시적으로 확장하거나 커스터마이즈할 수 있다."

- **temporarily extend**: "일시적으로 확장" — 영구적인 클라이언트 변경이 아니라 런타임에 코드가 추가된다.
- **transferring software programming code**: 데이터가 아니라 실행 가능한 로직 자체를 전송한다.

> For example, when you fill a registration form on any website, your browser immediately highlights any mistakes you make, such as incorrect phone numbers.
> It can do this because of the code sent by the server.

"예를 들어 웹사이트 가입 양식을 작성할 때 브라우저가 즉시 잘못된 전화번호 등 실수를 강조 표시한다. 서버가 보낸 코드 덕분에 이것이 가능하다."

- 서버가 HTML과 함께 JavaScript를 내려주고, 브라우저가 그 JS를 실행해 클라이언트 측 유효성 검사를 수행하는 것이 Code on Demand의 가장 흔한 예다.

실무에서 Code on Demand를 만족하는 사례:
- JavaScript 전달: 서버가 HTML과 JS를 내려주면 브라우저가 실행해 동적 기능이 추가된다.
- Java Applet (구): 서버가 바이트코드를 전송해 브라우저에서 실행 (현재는 폐기).

---

## 종합

Code on Demand는 optional이지만, 일반적인 웹 페이지는 별다른 의도 없이도 이 제약을 자연스럽게 만족한다. 서버가 HTML·CSS·JS를 내려주면 브라우저가 받은 코드를 실행하는 구조 자체가 Code on Demand다. 이것이 선택적 제약인 이유는 API만 쓰는 모바일 앱처럼 코드 전송이 필요 없는 클라이언트도 있기 때문이다.

---

# RESTful API가 가져다주는 핵심 이점은 무엇이며, 그것은 앞서 본 어떤 제약에서 비롯되는가?

## 도입

REST 원칙들을 지키면 세 가지 이점이 자동으로 따라온다 — Scalability(확장성), Flexibility(유연성), Independence(독립성). 이것들은 별도 기능이 아니라 제약을 지킨 결과물이다.

---

## 본문

> RESTful APIs include the following benefits: Scalability, Flexibility, Independence.

세 이점과 그 원천 제약의 관계:

- **Scalability** ← Statelessness + Cacheability
- **Flexibility** ← Client-Server 분리 + Layered System
- **Independence** ← Uniform Interface(표준 포맷)

이 관계를 이해하면 REST 원칙을 "왜 지켜야 하는가"를 이점의 언어로 설명할 수 있다.

---

## 종합

REST의 이점은 제약의 결과다. 서버를 Stateless로 만들지 않으면 Scalability를 얻기 어렵고, Uniform Interface를 지키지 않으면 Independence를 달성할 수 없다. 다음 세 질문이 각 이점을 어떤 제약이 어떻게 만들어내는지 상세히 설명한다.

---

# RESTful API의 Scalability(확장성)는 어떻게 달성되는가?

## 도입

Scalability는 사용자나 요청이 늘어나도 시스템이 무너지지 않는 능력이다. REST의 두 제약 — Statelessness와 Cacheability — 이 이 능력을 만들어낸다.

---

## 본문

> Systems that implement REST APIs can scale efficiently because REST optimizes client-server interactions.
> Statelessness removes server load because the server does not have to retain past client request information.

"REST API를 구현하는 시스템은 REST가 클라이언트-서버 상호작용을 최적화하기 때문에 효율적으로 확장할 수 있다. Statelessness는 서버가 과거 클라이언트 요청 정보를 보관할 필요가 없어 서버 부하를 제거한다."

- **scale efficiently**: 요청이 10배 늘어도 서버를 10배 늘리면 감당할 수 있다는 선형 확장성.
- **server load**: 세션 저장소·상태 동기화·메모리 사용량. Stateless면 이 비용이 사라진다.

> Well-managed caching partially or completely eliminates some client-server interactions.

"잘 관리된 캐싱은 일부 클라이언트-서버 상호작용을 부분적 또는 완전히 제거한다."

- **partially or completely eliminates**: `304 Not Modified`(부분 — 메타데이터만 교환)와 캐시 히트(완전 — 서버 호출 자체 없음)의 두 단계.

> All these features support scalability without causing communication bottlenecks that reduce performance.

"이 모든 기능은 성능을 저하시키는 통신 병목 없이 확장성을 지원한다."

- **bottlenecks**: 세션 서버, 공유 메모리처럼 한 점에 부하가 몰리는 구조. Stateless면 병목 지점이 사라진다.

---

## 종합

Stateless 서버는 어떤 인스턴스가 요청을 받아도 동일하게 처리하므로 로드밸런서가 자유롭게 분산할 수 있다. 캐싱은 반복 요청의 서버 도달 자체를 막아 트래픽 급증이 곧 서버 부하 급증으로 이어지지 않게 한다. 이 두 메커니즘이 결합하면 트래픽이 폭증하는 이벤트에도 서버를 수평으로 늘리는 것만으로 대응할 수 있다.

---

# RESTful API의 Flexibility(유연성)란 무엇을 의미하며, 어떤 변경에도 영향을 받지 않게 해주는가?

## 도입

Flexibility는 서버 팀과 클라이언트 팀이 서로 독립적으로 변경을 진행할 수 있는 능력이다. Client-Server 분리와 Layered System 제약이 이것을 만들어낸다.

---

## 본문

> RESTful web services support total client-server separation.
> They simplify and decouple various server components so that each part can evolve independently.

"RESTful 웹 서비스는 완전한 클라이언트-서버 분리를 지원한다. 서버 컴포넌트들을 단순화하고 분리하여 각 부분이 독립적으로 발전할 수 있게 한다."

- **decouple**: 결합 끊기. A가 바뀌어도 B를 같이 바꾸지 않아도 된다.
- **evolve independently**: 클라이언트 팀과 서버 팀이 서로의 릴리즈 일정에 종속되지 않는다.

> Platform or technology changes at the server application do not affect the client application.

"서버 애플리케이션의 플랫폼이나 기술 변경이 클라이언트 애플리케이션에 영향을 주지 않는다."

서버를 Java에서 Go로 바꿔도, 클라이언트는 같은 HTTP 요청만 보내면 된다. API 응답 형식만 같으면 내부 구현은 클라이언트에게 보이지 않는다.

> The ability to layer application functions increases flexibility even further.
> For example, developers can make changes to the database layer without rewriting the application logic.

"애플리케이션 기능을 계층으로 분리하는 능력은 유연성을 더욱 높인다. 예를 들어 개발자는 애플리케이션 로직을 다시 작성하지 않고 데이터베이스 계층을 변경할 수 있다."

- **layer application functions**: Layered System 제약의 결과. DB 계층 교체가 API 계층에 영향을 주지 않고, API 계층 변경이 클라이언트에 영향을 주지 않는다.

---

## 종합

Flexibility의 핵심은 "변경 범위의 격리"다. DB를 PostgreSQL에서 MongoDB로 바꾸어도 API 응답 포맷이 같으면 클라이언트는 모른다. 서버 언어를 바꾸어도 HTTP 엔드포인트가 같으면 클라이언트는 모른다. 이 격리가 없으면 서버의 모든 내부 변경이 클라이언트 배포를 강제하는 "강결합" 상태가 된다.

---

# RESTful API가 "기술 독립적(Independence)"이라는 말의 의미는?

## 도입

Independence는 REST API를 쓰는 클라이언트와 서버가 서로 다른 언어·프레임워크로 구현되어 있어도 통신이 가능하다는 의미다. HTTP와 표준 포맷이라는 공통 언어가 이를 가능하게 한다.

---

## 본문

> REST APIs are independent of the technology used.
> You can write both client and server applications in various programming languages without affecting the API design.

"REST API는 사용된 기술에 독립적이다. 클라이언트와 서버 애플리케이션을 다양한 프로그래밍 언어로 작성해도 API 설계에 영향을 주지 않는다."

- **independent of the technology used**: 사용된 구현 기술과 무관. HTTP·URI·JSON은 언어 불문 모든 환경에서 지원된다.

> You can also change the underlying technology on either side without affecting the communication.

"어느 쪽의 기반 기술을 바꿔도 통신에 영향을 주지 않는다."

- **underlying technology**: 언어·프레임워크·DB 등 내부 구현 기술.

이것이 가능한 이유: REST는 HTTP·URI·표준 메시지 포맷이라는 인터페이스만 합의하고 구현 언어를 강제하지 않기 때문이다.

비교: gRPC는 Protocol Buffers라는 IDL을 강제한다 — REST보다 빠르지만 양쪽이 같은 IDL 컴파일러를 써야 한다. 이 제약이 Independence를 일부 희생하는 것이다.

---

## 종합

Independence 덕분에 React 프론트엔드(JS), Python Django 백엔드, iOS Swift 앱이 모두 같은 REST API를 호출할 수 있다. 서버 팀이 Django에서 FastAPI로 이전해도 응답 JSON이 같으면 세 클라이언트 팀 모두 코드를 바꿀 필요가 없다. 기술 스택 선택의 자유를 최대화하는 것이 Independence의 가치다.

---

# RESTful API 호출 한 번은 어떤 단계들로 진행되는가?

## 도입

`fetch("/api/users")`를 호출하는 순간부터 응답을 받기까지 어떤 일이 일어나는지를 REST API 관점에서 정리한다. 브라우저에서 웹 페이지를 여는 것과 본질적으로 같은 흐름이다.

---

## 본문

> The basic function of a RESTful API is the same as browsing the internet.

REST API 호출과 웹 브라우징이 같은 구조라는 직관적인 비유다.

> These are the general steps for any REST API call:

1. **클라이언트가 요청 전송**: 클라이언트는 API 문서에 따라 서버가 이해할 수 있는 형식으로 요청을 구성해서 보낸다.
2. **서버가 클라이언트를 인증하고 권한 확인**: 서버는 클라이언트를 인증(authentication)하고 요청 권한(authorization)을 확인한다.
3. **서버가 요청을 내부 처리**: 서버는 요청을 받아 내부적으로 처리한다.
4. **서버가 응답 반환**: 서버는 요청 성공 여부와 클라이언트가 요청한 정보를 담아 응답한다.

```
REST API 호출 흐름

클라이언트              서버
    │
    │ 1. 요청 (HTTP Request)
    │    POST /api/orders
    │    Authorization: Bearer eyJ...
    │    { "item": "book", "qty": 2 }
    │ ──────────────────────────────→
    │
    │                  2. 인증 (JWT 검증)
    │                  3. 권한 확인 (이 사용자가 주문 가능?)
    │                  4. 내부 처리 (DB에 주문 저장)
    │
    │ 5. 응답 (HTTP Response)
    │    201 Created
    │    { "orderId": 99, "status": "pending" }
    │ ←──────────────────────────────
    │
```

매 사이클이 Stateless로 독립적이다 — 서버는 이 요청이 첫 번째인지 백 번째인지 모른다.

---

## 종합

REST API 호출의 핵심은 "클라이언트가 충분한 정보를 담은 요청을 보내고, 서버가 그 요청만 보고 완전히 처리해서 응답하는" 사이클이다. "API를 호출한다"는 말은 정확히 이 HTTP 요청-응답 사이클 한 번을 수행하는 것이다.

---

# REST API에서 "API documentation"이 필수인 이유는 무엇인가?

## 도입

클라이언트가 서버가 이해할 수 있는 형식으로 요청을 만들려면 그 형식이 어떤지 알아야 한다. REST는 HTTP·URI·메서드 같은 표준만 정의하지, 구체 요청/응답 스키마는 팀마다 다르기 때문이다.

---

## 본문

> API developers explain how the client should use the REST API in the server application API documentation.
> The REST API request and response details vary slightly depending on how the API developers design the API.

"API 개발자는 서버 애플리케이션 API 문서에서 클라이언트가 REST API를 어떻게 사용해야 하는지 설명한다. REST API 요청과 응답의 세부 사항은 API 개발자가 API를 어떻게 설계하느냐에 따라 약간씩 다르다."

- **vary slightly depending on how the API developers design**: REST는 `GET /users`가 어떤 JSON을 반환해야 하는지 강제하지 않는다. 팀마다 필드명·중첩 구조·페이징 방식이 다르므로 문서 없이는 클라이언트를 만들 수 없다.

이것이 Swagger(OpenAPI)·Postman Collection·API Blueprint 같은 도구가 사실상 필수가 된 이유다.

비교: gRPC는 `.proto` 파일(IDL)이 스키마를 코드로 강제한다 — 별도 문서가 없어도 컴파일러가 타입을 강제한다. REST의 자유도가 곧 문서화 부담을 만드는 것이다.

---

## 종합

REST API의 유연성(팀마다 다른 스키마)은 클라이언트가 알아서 맞춰야 하는 부담으로 전환된다. 그 부담을 줄이는 것이 문서화 도구다. 잘 만들어진 OpenAPI spec 파일 하나가 SDK 자동 생성, Mock 서버, 테스트 코드까지 모두 파생시킬 수 있다.

---

# REST API 요청에서 "인증(authentication)"과 "인가(authorization)"는 어떻게 다른가?

## 도입

REST API 서버가 요청을 처리하기 전에 반드시 확인하는 두 가지가 있다 — 이 클라이언트가 누구인가(인증), 이 클라이언트가 이것을 할 수 있는가(인가). 둘은 다른 개념이지만 항상 함께 쓰인다.

---

## 본문

> The server authenticates the client and confirms that the client has the right to make that request.

"서버는 클라이언트를 인증하고 클라이언트가 그 요청을 할 권리가 있는지 확인한다."

- **authenticates**: 신원 확인. "이 토큰의 주인이 user_id=42인 Alice다"를 검증하는 단계. JWT 서명 검증이 여기에 해당한다.
- **confirms that the client has the right**: 인가(authorization). "Alice는 이 리소스에 접근할 권한이 있는가?" — 관리자만 볼 수 있는 데이터를 일반 사용자가 요청하면 거부한다.

```
인증 vs 인가

인증 (Authentication):  "이 사람이 누구인가?"
    JWT 토큰 서명 검증 → user_id=42, role=user 확인

인가 (Authorization):   "이 사람이 이것을 할 수 있는가?"
    DELETE /admin/users/99 → role이 admin이어야 허용
    현재 role=user → 403 Forbidden
```

---

## 종합

인증이 통과해도 인가가 실패하면 요청은 거부된다. HTTP 상태 코드로 구분하면 인증 실패는 401(Unauthorized), 인가 실패는 403(Forbidden)이다. REST API에서 이 두 단계는 서버가 본격적인 처리를 시작하기 전에 반드시 완료되어야 한다.

---

# RESTful API 클라이언트 요청은 어떤 구성요소들을 포함하는가?

## 도입

`fetch("/api/users", { method: "POST", headers: {...}, body: "..." })`를 보면 요청을 구성하는 여러 요소가 있다는 걸 알 수 있다. OA는 이 요소들을 5개로 정리한다.

---

## 본문

> RESTful APIs require requests to contain the following main components:
> - Unique resource identifier
> - Method
> - HTTP headers
> - Data
> - Parameters

요청 한 번 = (1) 무엇에(URL) (2) 무엇을 할지(Method) (3) 어떤 부가 정보로(Headers) (4) 어떤 본문 데이터로(Data) (5) 어떤 파라미터로(Parameters).

```
HTTP 요청 메시지 구조

POST /api/orders?dry-run=true     ← (1)URL + (5)Query Param
Authorization: Bearer eyJ...     ← (3)Header
Content-Type: application/json   ← (3)Header
                                  ← (2)Method: POST
{                                 ← (4)Body/Data
  "item": "book",
  "qty": 2
}
```

---

## 종합

이 5개 구성요소가 조합되어 HTTP 요청 메시지 하나가 완성된다. REST API 클라이언트를 작성할 때 "무엇을" "어떻게" "어디서" "얼마나"를 이 5개로 분리해서 생각하면 명확해진다.

---

# REST API에서 리소스를 식별하는 방법은? "request endpoint"라는 표현은 무엇을 가리키는가?

## 도입

REST에서 리소스를 식별하는 수단은 URL이다. API 문서에서 자주 보이는 "endpoint"라는 단어가 정확히 무엇을 가리키는지 OA가 명확히 정리한다.

---

## 본문

> The server identifies each resource with unique resource identifiers.
> For REST services, the server typically performs resource identification by using a Uniform Resource Locator (URL).
> The URL specifies the path to the resource.

"서버는 고유 리소스 식별자로 각 리소스를 식별한다. REST 서비스에서 서버는 보통 URL을 사용해 리소스 식별을 수행한다. URL은 리소스로 가는 경로를 지정한다."

- **Uniform Resource Locator (URL)**: 리소스의 위치(경로)를 지정하는 주소. `https://api.example.com/users/42`에서 `/users/42`가 리소스 경로다.

> A URL is similar to the website address that you enter into your browser to visit any webpage.
> The URL is also called the request endpoint and clearly specifies to the server what the client requires.

"URL은 웹 페이지를 방문할 때 브라우저에 입력하는 웹사이트 주소와 비슷하다. URL은 request endpoint라고도 불리며 서버에게 클라이언트가 무엇을 원하는지 명확히 지정한다."

- **request endpoint**: URL의 또 다른 이름. "요청 종착점" — 클라이언트의 요청이 도달하는 서버 측 지점이다.

URL = endpoint = 리소스 식별자라는 어휘 정리가 핵심이다. "엔드포인트를 친다"는 표현은 "그 URL에 HTTP 요청을 보낸다"는 뜻이다.

---

## 종합

REST에서 URL은 단순한 주소가 아니라 "어떤 리소스를 다룰 것인가"의 선언이다. `GET /users/42`에서 `/users/42`가 바로 그 선언이고, 이것이 endpoint다. Swagger 문서에서 "Available endpoints" 목록이 곧 그 API가 제공하는 리소스 목록이다.

---

# HTTP 요청 헤더(headers)란 무엇이며 어떤 역할을 하는가?

## 도입

`fetch(url, { headers: { "Content-Type": "application/json", "Authorization": "Bearer ..." } })`를 쓸 때 헤더가 무엇인지 직관적으로 알지만, 정확한 정의는 "데이터의 데이터(메타데이터)"다.

---

## 본문

> Request headers are the metadata exchanged between the client and server.
> For instance, the request header indicates the format of the request and response, provides information about request status, and so on.

"요청 헤더는 클라이언트와 서버 사이에 교환되는 메타데이터다. 예를 들어 요청 헤더는 요청과 응답의 형식을 나타내고, 요청 상태에 대한 정보를 제공한다."

- **metadata**: 데이터의 데이터. 본문(body)이 "무엇을 보내는가"라면, 헤더는 "그 본문을 어떻게 처리해야 하는가"를 알려준다.

대표적인 요청 헤더:
- `Content-Type: application/json` — 본문이 JSON임을 알림
- `Authorization: Bearer eyJ...` — 인증 토큰
- `Accept: application/json` — 클라이언트가 원하는 응답 형식
- `Cache-Control: no-cache` — 캐시 동작 제어

---

## 종합

헤더는 요청·응답의 맥락 정보다. 본문을 어떻게 해석해야 하는지(`Content-Type`), 누가 보냈는지(`Authorization`), 무엇을 기대하는지(`Accept`)를 헤더가 담는다. REST의 Self-descriptive 메시지 제약이 헤더를 통해 구현된다 — 메시지 자체가 처리 방법을 담고 있어야 한다는 원칙이다.

---

# REST API 요청에서 본문(data)은 어떤 메서드와 함께 사용되는가?

## 도입

모든 HTTP 요청에 본문(body)이 있는 것은 아니다. 어떤 메서드에서 본문이 쓰이고 어떤 메서드에서는 쓰이지 않는지 정리한다.

---

## 본문

> REST API requests might include data for the POST, PUT, and other HTTP methods to work successfully.

"REST API 요청은 POST, PUT, 기타 HTTP 메서드가 성공하기 위해 데이터를 포함할 수 있다."

- POST, PUT, PATCH 같은 "쓰기" 계열 메서드에서 본문에 데이터를 실어 보낸다.
- GET과 DELETE는 보통 본문이 없고 URL·파라미터로 필요한 정보를 전달한다.

```
메서드별 본문 사용

GET    /users/42          본문 없음 (URL만으로 충분)
DELETE /users/42          본문 없음

POST   /users             본문 있음: { "name": "Alice" }
PUT    /users/42          본문 있음: { "name": "Alice Updated" }
PATCH  /users/42          본문 있음: { "email": "new@mail.com" }
```

"GET에 body를 보내도 되나요?" — 표준이 금지하지는 않지만 관례상 쓰지 않는다. 일부 서버나 프록시가 GET body를 무시하거나 거부할 수 있다.

---

## 종합

REST API 설계에서 본문을 쓸지 말지는 메서드의 의미와 연결된다. 자원을 만들거나 바꾸는 동작에는 본문이 필요하고, 조회나 삭제는 URL만으로 표현하는 것이 관례다. `fetch()`의 두 번째 인자에 `body`를 넣을 때 `method`도 함께 지정하는 이유가 여기 있다.

---

# RESTful API 요청 파라미터의 3가지 종류(path / query / cookie)는 각각 어떤 역할을 하는가?

## 도입

같은 리소스에 대해 더 구체적인 조건을 전달하는 방법이 파라미터다. 위치에 따라 path, query, cookie 세 종류로 나뉘고, 각각 다른 역할과 사용 맥락이 있다.

---

## 본문

> RESTful API requests can include parameters that give the server more details about what needs to be done.

"RESTful API 요청은 서버에게 무엇을 해야 하는지에 대한 더 많은 세부 정보를 주는 파라미터를 포함할 수 있다."

> - Path parameters that specify URL details.
> - Query parameters that request more information about the resource.
> - Cookie parameters that authenticate clients quickly.

세 종류 정리:

- **Path parameters**: URL 경로의 일부. 예: `/users/{userId}` → `/users/42`. 특정 리소스를 지목하는 데 쓴다.
- **Query parameters**: URL 뒤의 `?key=value`. 예: `/users?role=admin&page=2`. 필터·정렬·페이징 같은 추가 조건을 전달한다.
- **Cookie parameters**: HTTP Cookie 헤더로 전달. 세션 ID·인증 쿠키처럼 클라이언트를 빠르게 식별하는 데 쓴다.

```
파라미터 종류별 위치

Path:   GET /users/42/orders/99
                    ↑↑         ↑↑
              userId=42    orderId=99

Query:  GET /users?role=admin&page=2&limit=20
                   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

Cookie: GET /users
        Cookie: session_id=abc123; preferences=dark-mode
```

"왜 ID는 path에, 필터는 query에 두나요?"의 답: path는 "어떤 리소스"(식별), query는 "그 리소스에 대한 어떤 조건"(필터·정렬)이다.

---

## 종합

세 종류의 파라미터는 역할이 다르기 때문에 용도에 맞게 써야 한다. 리소스 식별에는 path, 필터·정렬·페이징에는 query, 인증·세션 유지에는 cookie가 관례다. 이 구분이 있어야 REST API URL 설계가 일관성을 갖는다.

---

# RESTful API에서 흔히 쓰이는 인증 방식들은 무엇이며, 인증은 왜 필수인가?

## 도입

REST API는 stateless라서 서버가 클라이언트 상태를 기억하지 않는다. 그렇기 때문에 매 요청마다 클라이언트가 자신을 증명해야 한다. OA는 4가지 인증 방식을 소개한다.

---

## 본문

> A RESTful web service must authenticate requests before it can send a response.
> Authentication is the process of verifying an identity.

"RESTful 웹 서비스는 응답을 보내기 전에 요청을 인증해야 한다. 인증은 신원을 검증하는 과정이다."

- **must authenticate requests**: Statelessness 제약의 직접적 결과. 서버가 세션을 기억하지 않으니 클라이언트가 매번 신원을 증명해야 한다.
- **establish trust**: "신뢰 형성" — 서버가 "이 요청을 처리해도 되는 주체인가"를 확인하는 것.

REST API의 4가지 인증 방식:

1. **HTTP Basic Authentication**: 매 요청마다 `username:password`를 Base64로 인코딩해서 헤더에 담는다. 단순하지만 가장 보안이 취약하다.
2. **Bearer Authentication**: 서버가 발급한 토큰을 `Authorization: Bearer <token>` 헤더로 전달한다. JWT가 이 방식에 해당한다.
3. **API Keys**: 서버가 클라이언트에 발급한 고유 키를 헤더·쿼리 파라미터로 전달한다.
4. **OAuth**: 비밀번호 + 토큰의 조합으로 가장 정교한 통제가 가능하다.

보안 강도: Basic < API key < Bearer ≤ OAuth

---

## 종합

인증 방식은 보안 강도와 편의성의 트레이드오프다. 서비스 간 내부 통신에는 API key가, 사용자 인증에는 Bearer(JWT)나 OAuth가 적합하다. REST의 Statelessness 덕분에 인증이 각 요청에 독립적으로 적용되고, 어떤 서버 인스턴스가 받아도 동일하게 검증된다.

---

# Bearer 인증의 "bearer"라는 단어가 가리키는 것은 무엇이며, 왜 그 이름이 붙었는가?

## 도입

`Authorization: Bearer eyJ...` 헤더를 매일 쓰지만 "bearer"가 정확히 무엇인지 생각해본 적 없을 수 있다. bearer는 "토큰 소지자"라는 뜻이고, 이름이 이미 보안 의미를 담고 있다.

---

## 본문

> The term bearer authentication refers to the process of giving access control to the token bearer.

"bearer 인증이라는 용어는 토큰 소지자(bearer)에게 접근 통제를 부여하는 과정을 가리킨다."

- **bearer**: "지참자", "소지자". 토큰을 가진 사람이 곧 권한자라는 의미다. 입장권처럼 토큰을 제시하는 사람이 누구든 입장이 허용된다.

> The bearer token is typically an encrypted string of characters that the server generates in response to a login request.
> The client sends the token in the request headers to access resources.

"bearer 토큰은 보통 서버가 로그인 요청에 응답하여 생성하는 암호화된 문자열이다. 클라이언트는 리소스에 접근하기 위해 요청 헤더에 토큰을 실어 보낸다."

- **encrypted string**: JWT의 경우 Header.Payload.Signature 구조로 서명되어 있어 변조를 감지할 수 있다.

이름 그대로 "토큰만 가지고 있으면 누구든 권한자"이므로, 토큰 탈취 = 계정 탈취가 된다. 이것이 HTTPS가 필수인 이유 중 하나다.

실무 예: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 종합

bearer라는 이름에 보안 위험이 내재되어 있다 — 소지자에게 자동으로 권한이 부여되므로 토큰을 잃으면 곧장 권한도 잃는다. 이를 완화하는 방법은 토큰 유효 기간을 짧게 설정하고(access token + refresh token 패턴) HTTPS로 전송 중 탈취를 방지하는 것이다.

---

# API key 방식은 어떻게 동작하며, 왜 보안성이 떨어진다고 평가되는가?

## 도입

API key는 Bearer token보다 단순하다. 서버가 클라이언트에 고유 키를 발급하고, 클라이언트가 그 키를 매 요청에 포함한다. 단순함이 장점이지만, 키가 매 요청마다 흘러다니기 때문에 보안 위험이 있다.

---

## 본문

> API keys are another option for REST API authentication.
> In this approach, the server assigns a unique generated value to a first-time client.
> Whenever the client tries to access resources, it uses the unique API key to verify itself.

"API key는 REST API 인증의 또 다른 선택지다. 이 접근법에서 서버는 처음 접속하는 클라이언트에게 고유하게 생성된 값을 할당한다. 클라이언트가 리소스에 접근하려 할 때마다 고유 API key를 사용해 자신을 인증한다."

- **assigns a unique generated value**: 서버가 생성해서 부여한다. 패스워드와 달리 사람이 기억하기 어려운 긴 문자열인 경우가 많다.

> API keys are less secure because the client has to transmit the key, which makes it vulnerable to network theft.

"API key는 클라이언트가 키를 전송해야 하기 때문에 보안성이 낮으며, 네트워크 탈취에 취약하다."

- **vulnerable to network theft**: 매 요청마다 같은 키가 헤더·URL에 흘러다닌다. HTTPS 없이 사용하면 중간자가 캡처해 재사용할 수 있다.

그럼에도 API key가 널리 쓰이는 이유: 구현이 단순하고, 서비스 간 서버 통신에서 클라이언트 식별과 rate limit 제어에 편리하며, 서버-서버 통신에서는 네트워크 탈취 위험이 낮다.

---

## 종합

API key의 단점은 "같은 키가 영구적으로, 매 요청마다 노출된다"는 점이다. Bearer token은 짧은 만료 시간을 가질 수 있어 탈취되어도 피해 기간이 제한된다. API key는 탈취되면 키를 교체할 때까지 위험이 지속된다. 그래서 공개 API보다는 내부 서비스 간 통신에 더 적합하다.

---

# OAuth는 다른 인증 방식과 어떻게 다른가? "scope"과 "longevity"라는 개념은 어떤 통제를 가능하게 하는가?

## 도입

OAuth는 단순한 "비밀번호 + 토큰"이 아니라 권한의 범위(scope)와 유효 기간(longevity)을 토큰에 인코딩하여 훨씬 정교한 접근 통제를 가능하게 한다. 구글 로그인, 깃허브 로그인 같은 소셜 로그인이 OAuth를 사용한다.

---

## 본문

> OAuth combines passwords and tokens for highly secure login access to any system.
> The server first requests a password and then asks for an additional token to complete the authorization process.

"OAuth는 비밀번호와 토큰을 결합해 어떤 시스템에도 매우 안전한 로그인 접근을 제공한다. 서버는 먼저 비밀번호를 요청한 다음 인가 과정을 완료하기 위해 추가 토큰을 요청한다."

⚠️ AWS 설명은 입문용 단순화다. 실제 OAuth 2.0의 표준 흐름(Authorization Code Flow)은 비밀번호를 직접 주고받지 않는다. 사용자가 신뢰하는 제공자(예: 구글)에서 인가 코드를 받아 토큰으로 교환하는 방식이다.

> It can check the token at any time and also over time with a specific scope and longevity.

"특정 scope와 longevity를 가진 토큰을 언제든, 시간이 지나서도 확인할 수 있다."

- **scope**: 그 토큰이 할 수 있는 일의 범위. 예: `read:user`, `write:repo` — 토큰 하나가 모든 권한을 갖는 게 아니라 필요한 권한만 요청한다.
- **longevity**: 토큰의 유효 기간. 짧을수록 보안상 안전하고, 길수록 사용자가 재로그인할 필요가 줄어든다.

```
OAuth의 정교한 접근 통제 예시

구글 OAuth로 서드파티 앱 로그인 시:
- scope: "Gmail 읽기 권한만" (쓰기 X, 다른 서비스 X)
- longevity: "access token 1시간, refresh token 30일"

→ 앱이 Gmail을 쓸 수 있지만 삭제는 못함 (scope)
→ 1시간 후 access token 만료, refresh token으로 갱신 (longevity)
→ 앱이 해킹되어도 1시간 내로 피해 제한 가능
```

---

## 종합

OAuth가 다른 인증 방식보다 정교한 이유는 scope와 longevity라는 추가 차원이 있기 때문이다. API key나 Basic auth는 "사용할 수 있다/없다"의 이진 판단이지만, OAuth는 "어떤 것을", "얼마 동안"이라는 세분화된 통제가 가능하다. 이 정교함이 필요하지 않은 단순한 서비스 간 통신에는 API key나 Bearer가 더 간단한 선택이다.

---

# RESTful API 서버 응답은 어떤 구성요소들을 포함하는가?

## 도입

요청이 5개 구성요소(URL·Method·Headers·Data·Parameters)로 이루어졌다면, 응답도 구조화된 구성요소로 이루어진다. 요청과 응답은 대칭적인 구조다.

---

## 본문

> REST principles require the server response to contain the following main components:
> - Status line
> - Message body
> - Headers

응답 = (1) 상태 줄 + (2) 바디 + (3) 헤더.

```
HTTP 응답 메시지 구조

HTTP/1.1 201 Created                  ← (1) Status line
Content-Type: application/json        ← (3) Headers
Date: Thu, 22 May 2026 06:00:00 GMT  ← (3) Headers
Cache-Control: no-cache               ← (3) Headers
                                       (빈 줄)
{                                     ← (2) Message body
  "id": 99,
  "status": "created"
}
```

요청의 5개 부품에 대응되는 응답 측 부품이다.

---

## 종합

응답 구조를 이해하면 `fetch()` 응답을 다룰 때 명확해진다. `response.status`가 Status line에서, `response.headers.get("Content-Type")`이 Headers에서, `response.json()`이 Message body에서 오는 것이다.

---

# REST 응답 헤더에는 어떤 종류의 정보가 담기는가?

## 도입

응답 헤더는 요청 헤더와 마찬가지로 메타데이터다. 응답 바디의 형식·크기·캐시 정책·서버 정보 등을 담는다.

---

## 본문

> The response also contains headers or metadata about the response.
> They give more context about the response and include information such as the server, encoding, date, and content type.

"응답에는 응답에 대한 헤더 또는 메타데이터도 포함된다. 이것들은 응답에 대한 더 많은 맥락을 제공하며 서버, 인코딩, 날짜, 콘텐츠 타입 같은 정보를 포함한다."

대표적인 응답 헤더:
- `Content-Type: application/json` — 응답 바디가 JSON임을 알림. `response.json()`을 호출하기 전에 이것을 확인하는 게 안전하다.
- `Content-Encoding: gzip` — 응답 바디가 gzip으로 압축됨. 브라우저가 자동으로 압축 해제한다.
- `Date: Thu, 22 May 2026 ...` — 응답 생성 시각.
- `Server: nginx/1.24` — 서버 소프트웨어 정보.
- `Cache-Control: public, max-age=3600` — 캐시 정책. 클라이언트와 CDN이 이 응답을 캐시할 방법을 지시한다.

---

## 종합

응답 헤더는 바디를 어떻게 처리할지, 다음 요청에 캐시를 써도 될지, 어떤 서버에서 왔는지 등 처리에 필요한 맥락을 담는다. REST의 Self-descriptive 메시지 제약이 응답에서도 구현되는 지점이다 — 헤더만 보면 바디를 어떻게 다뤄야 할지 알 수 있어야 한다.
