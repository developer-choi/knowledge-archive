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
