# HTTP 응답의 상태 코드는 어떤 구조이며, 1XX~5XX 각 클래스의 의미는?

## 도입

서버가 요청에 응답할 때 "이 요청이 어떻게 처리됐는지"를 숫자 세 자리로 전달한다. 이것이 상태 코드(status code)다. DevTools Network 탭에서 200, 404, 500 같은 숫자로 보이는 것이다. 세 자리 중 첫 번째 자리가 클래스를 나타내며, 나머지 두 자리가 세부 구분을 한다.

---

## 본문

> The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.

"상태 코드는 서버가 클라이언트의 요청을 처리하려는 시도의 처리 결과를 나타내는 세 자리 십진 정수 값이다."

- **disposition**: "처리 결과", "결말" — 성공인지, 실패인지, 중간 단계인지 등 요청이 어떻게 끝났는가를 나타낸다.
- **attempt to satisfy**: "처리를 시도했다" — 서버가 최선을 다했지만 실패했을 수도 있다. 코드가 이 결과를 알려준다.

> A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit and treat an unrecognized code as equivalent to the x00 code of that class.

"클라이언트는 서버가 보고하는 모든 상태 코드를 이해하지 못할 수 있지만, 첫 번째 자리로 표시되는 클래스는 이해해야 하며 인식되지 않는 코드는 해당 클래스의 x00 코드와 동등하게 처리해야 한다."

- **the class as indicated by the first digit**: 첫 자릿수만 알아도 대처할 수 있다. 모르는 `499`를 받으면 `400`(Client Error)처럼 처리하면 된다.
- **treat an unrecognized code as equivalent to x00**: `499` → `400`, `573` → `500`처럼 폴백한다. 커스텀 상태 코드를 만든 서버와의 호환성을 위한 규칙이다.

---

**5개 클래스:**

> 1XX informational: The request was received, continuing process.

"1XX 정보: 요청이 수신됐으며, 처리를 계속 중이다."

브라우저에서 거의 볼 일이 없는 클래스. `100 Continue`(요청 본문을 계속 보내도 된다)가 대표적이다.

> 2XX successful: The request was successfully received, understood, and accepted.

"2XX 성공: 요청이 성공적으로 수신, 이해, 수락됐다."

`200 OK`, `201 Created`, `204 No Content`. `fetch()`가 정상적으로 완료됐을 때다.

> 3XX redirection: Further action needs to be taken in order to complete the request.

"3XX 리다이렉션: 요청을 완료하기 위해 추가 조치가 필요하다."

`301 Moved Permanently`(영구 이동), `302 Found`(임시 이동), `304 Not Modified`(캐시 사용). 브라우저가 자동으로 새 URL로 다시 요청한다.

> 4XX client error: The request cannot be fulfilled due to an issue that the client might be able to control.

"4XX 클라이언트 에러: 클라이언트가 제어할 수 있는 문제로 인해 요청을 처리할 수 없다."

- **that the client might be able to control**: 클라이언트가 고칠 수 있는 문제라는 뜻. 잘못된 URL(`404`), 인증 실패(`401`), 잘못된 요청 형식(`400`). 클라이언트 코드를 수정하면 해결된다.

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests`.

> 5XX server error: The server failed to fulfill an apparently valid request.

"5XX 서버 에러: 서버가 겉으로 유효한 요청을 처리하는 데 실패했다."

- **apparently valid**: "겉으로 보기엔 유효한" — 요청 자체에는 문제가 없는데 서버 쪽에서 뭔가 잘못된 경우다.
- 클라이언트가 고칠 수 없고, 서버 관리자가 고쳐야 한다.

`500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`.

```
1XX — 진행 중 (계속 보내도 됨)
2XX — 성공
3XX — 리다이렉션 (다른 곳으로 가라)
4XX — 클라이언트 잘못
5XX — 서버 잘못
```

---

## 종합

상태 코드는 기계가 읽는 것이고, 함께 오는 사유 구문(reason phrase — "OK", "Not Found" 등)은 사람이 읽는 것이다. 따라서 클라이언트 코드에서 `response.status === 200`으로 분기하고, 로그에는 텍스트도 같이 찍어두는 것이 좋은 패턴이다. 모르는 코드는 첫 자릿수로 폴백하면 된다 — `fetch()`에서 `response.ok`(200~299 범위인지)를 쓰는 것도 이 원칙의 구현이다.

---

# [UNVERIFIED] 201 Created와 204 No Content는 각각 언제 쓰는가?

## 도입

2XX 클래스는 "성공"이지만, 성공의 구체적인 결과가 다르다. `201`은 "새로운 리소스가 만들어졌다", `204`는 "성공했지만 보내줄 내용이 없다"를 뜻한다.

---

## 본문

**201 Created**

새 리소스가 서버에 생성됐을 때 사용한다. POST 또는 PUT 요청으로 리소스를 만들었을 때 적합하다. 응답 헤더의 `Location`에 새로 생성된 리소스의 URL을 포함하는 것이 관례다.

```
POST /api/posts

← 201 Created
Location: /api/posts/101
Content-Type: application/json

{ "id": 101, "title": "새 글" }
```

`fetch()` 후 `response.status === 201`이고 `response.headers.get('Location')`으로 새 리소스 URL을 얻을 수 있다.

**204 No Content**

요청이 성공했지만 반환할 본문이 없을 때 사용한다. 대표적인 케이스:

- DELETE: 삭제 성공, 반환할 리소스가 없다.
- PUT/PATCH: 업데이트 성공, 변경된 내용을 굳이 다시 돌려줄 필요가 없을 때.
- OPTIONS(CORS preflight): 브라우저가 보내는 사전 요청에 대한 응답.

```
DELETE /api/posts/101

← 204 No Content
(본문 없음)
```

`fetch()` 후 `response.status === 204`이면 `response.json()`을 호출하면 에러가 난다. 본문이 없으므로 `response.text()`도 빈 문자열이다.

```
리소스 생성됨 + 본문 있음  → 201 Created + Location 헤더
성공 + 반환 내용 없음     → 204 No Content
단순 성공 + 본문 있음     → 200 OK
```

---

## 종합

FE 코드에서 API 응답을 처리할 때 `201`과 `204`를 구분하지 않고 `response.ok`(200~299)로만 체크하면 충분한 경우가 많다. 하지만 새로 생성된 리소스의 ID를 응답에서 꺼내야 한다면 `201 + Location`을 명시적으로 처리하고, DELETE 후 UI를 업데이트할 때는 `204`를 처리해야 한다.

---

# [UNVERIFIED] 401 Unauthorized와 403 Forbidden의 차이는 무엇인가?

## 도입

이름만 보면 둘 다 "거부됐다"처럼 보이지만, 서버가 거부하는 이유가 다르다. `401`은 "누구인지 모른다", `403`은 "누구인지 알지만 권한이 없다"의 차이다.

---

## 본문

**401 Unauthorized**

이름이 misleading하다. 실제 의미는 "인증(authentication)되지 않았다"다. 서버가 요청자가 누구인지 모른다. 로그인하지 않은 상태에서 보호된 API에 접근하면 받는 코드다.

```js
// 토큰 없이 요청
fetch('/api/profile')  // → 401 Unauthorized
// 해결: 로그인 후 Authorization 헤더 포함

fetch('/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

서버는 `WWW-Authenticate` 헤더와 함께 "이런 방식으로 인증하라"는 힌트를 보낸다. 클라이언트는 인증 정보를 제공하면 재요청해볼 수 있다.

**403 Forbidden**

서버가 요청자가 누구인지 안다(인증은 됐다). 하지만 해당 리소스에 대한 권한(authorization)이 없다. 이 상태는 재인증해도 해결되지 않는다. 권한 자체가 없기 때문이다.

```js
// 일반 사용자가 관리자 전용 API에 접근
fetch('/api/admin/users', {
  headers: { 'Authorization': `Bearer ${userToken}` }
})  // → 403 Forbidden
// 해결: 관리자 권한 필요
```

```
401 — 로그인 안 됨 (인증 필요)
     → 로그인하면 해결될 수 있음
403 — 로그인은 됐지만 권한 없음 (인가 실패)
     → 로그인해도 해결 안 됨
```

**왜 401이 "Unauthorized"인가?**

역사적으로 authentication(인증)과 authorization(인가)를 혼용한 명세 오류다. RFC 7235는 이것이 authentication(인증)에 관한 것임을 명확히 한다.

---

## 종합

FE에서 401을 받으면 로그인 페이지로 리다이렉트하고, 403을 받으면 "권한이 없습니다" 메시지를 보여주는 것이 일반적인 처리 패턴이다. 둘을 혼동하면 이미 로그인한 사용자를 로그인 페이지로 보내거나(403을 401로 잘못 처리), 무한 로그인 시도를 유발할 수 있다.

---

# [UNVERIFIED] 400 Bad Request와 422 Unprocessable Content는 어떤 기준으로 구분하는가?

## 도입

둘 다 "클라이언트 요청에 문제가 있다"는 4XX이지만, 문제의 성격이 다르다. `400`은 "요청 자체를 파싱할 수 없다"이고, `422`는 "파싱은 됐지만 내용이 의미적으로 잘못됐다"다.

---

## 본문

**400 Bad Request**

서버가 요청을 파싱하거나 이해할 수 없다. 문법(syntax) 수준의 오류다.

예시:
- JSON 형식이 아닌 body를 `Content-Type: application/json`으로 보냄
- 필수 쿼리 파라미터 누락
- 잘못된 헤더 형식

```js
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: 'this is not json{'  // 잘못된 JSON → 400
})
```

**422 Unprocessable Content**

요청은 파싱됐지만(문법은 맞다), 내용이 의미상(semantic) 유효하지 않다. 보통 유효성 검사 실패에 사용한다.

예시:
- 이메일 필드에 이메일 형식이 아닌 값
- 필수 필드가 빈 값
- 날짜 범위가 논리적으로 맞지 않음(종료일 < 시작일)

```js
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'not-an-email', name: '' })  // → 422
})
```

```
400 — 파싱 자체 실패 (문법 오류)
422 — 파싱은 됐지만 검증 실패 (의미 오류)
```

실무에서는 422와 함께 어떤 필드가 잘못됐는지 응답 본문에 포함하는 것이 일반적이다:

```json
{
  "errors": [
    { "field": "email", "message": "유효한 이메일 주소를 입력하세요" },
    { "field": "name", "message": "이름은 필수 항목입니다" }
  ]
}
```

---

## 종합

FE에서 폼 유효성 검사는 클라이언트 측에서 먼저 하는 것이 좋은 UX지만, 서버도 독립적으로 검증해야 한다. 서버가 `422`와 함께 필드별 에러를 돌려주면, FE에서 이를 파싱해 해당 필드 옆에 에러 메시지를 표시하는 패턴이 일반적이다. `400`은 개발 과정에서 API 요청 포맷을 잘못 짰을 때 주로 나타나고, `422`는 실제 사용자 입력 오류에서 나타난다.

---

# [UNVERIFIED] 304 Not Modified는 어떤 흐름에서 발생하는가?

## 도입

`304`는 3XX 리다이렉션 클래스지만, 실제로는 다른 곳으로 이동하는 것이 아니라 "캐시를 그대로 써라"는 뜻이다. HTTP 캐싱의 조건부 요청과 직접 연결된 코드다.

---

## 본문

**304가 발생하는 조건**

1. 브라우저가 이전에 이 리소스를 받았고, 응답에 `ETag` 또는 `Last-Modified` 헤더가 있었다.
2. 캐시가 만료됐다(또는 `Cache-Control: no-cache`).
3. 브라우저가 `If-None-Match` 또는 `If-Modified-Since` 헤더를 포함한 조건부 요청을 보낸다.
4. 서버가 리소스를 확인하고 변경이 없으면 `304 Not Modified`를 반환한다.

```
GET /api/data
If-None-Match: "abc123"

← 304 Not Modified
(본문 없음)
```

브라우저는 `304`를 받으면 로컬 캐시의 본문을 그대로 사용한다.

**DevTools에서 304 확인**

DevTools Network 탭에서 요청을 클릭하고 Status 컬럼에서 `304`를 볼 수 있다. Size 컬럼에는 "(from disk cache)"처럼 표시되거나 아주 작은 크기(헤더만)만 표시된다. 본문 전송이 없으므로 데이터 전송량이 0에 가깝다.

**304가 발생하지 않는 경우**

- `Cache-Control: no-store`: 아예 저장하지 않으므로 재검증 자체가 없다.
- 서버가 ETag/Last-Modified를 응답에 포함하지 않은 경우: 클라이언트가 비교할 값이 없으므로 조건부 요청을 보낼 수 없다.
- 리소스가 실제로 변경된 경우: `200 OK`와 새 본문이 온다.

```
조건부 요청 흐름
브라우저                    서버
GET /img.png           →
If-None-Match: "abc"
                       ←   304 Not Modified (ETag 일치)
브라우저: 캐시 그대로 사용

                       또는

                       ←   200 OK + 새 본문 (ETag 불일치)
브라우저: 새 리소스로 캐시 갱신
```

---

## 종합

`304`는 HTTP 캐싱 최적화의 핵심이다. 브라우저와 서버가 "이 리소스 아직 같아?"를 물어보고 확인하는 절차를 통해 불필요한 데이터 전송을 막는다. DevTools Network 탭에서 `304`가 많이 보인다면 캐싱이 잘 작동하고 있다는 신호다. 반대로 정적 자산(이미지, JS, CSS)에서 항상 `200`만 보인다면 서버가 ETag나 Last-Modified를 설정하지 않은 것일 수 있으므로 확인이 필요하다.
