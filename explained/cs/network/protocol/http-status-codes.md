# HTTP 응답의 상태 코드는 어떤 구조이며, 1XX~5XX 각 클래스의 의미는?

> The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.
> A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit and treat an unrecognized code as equivalent to the x00 code of that class.
> 1XX informational: The request was received, continuing process.
> 2XX successful: The request was successfully received, understood, and accepted.
> 3XX redirection: Further action needs to be taken in order to complete the request.
> 4XX client error: The request cannot be fulfilled due to an issue that the client might be able to control.
> 5XX server error: The server failed to fulfill an apparently valid request.

---

**도입**

`fetch()` 응답에서 `res.status`로 받는 그 숫자가 상태 코드입니다. 200, 404, 500 — 익숙한 숫자들이지만 사실 5개 클래스로 분류된 체계적 구조입니다. 첫 자릿수만 보면 그 클래스의 의미가 결정되고, 정확한 코드를 몰라도 클래스로 처리할 수 있습니다.

---

**본문**

> The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.

상태 코드는 클라이언트의 요청을 만족시키려 한 서버의 시도 결과(disposition)를 나타내는 3자리 십진 정수다.

- **three-digit decimal integer**: 3자리 십진 정수. 100~599 범위.
- **disposition**: 처리 결과의 성격. 성공/실패/리다이렉트 등.
- **server's attempt to satisfy**: 서버의 시도. "시도"가 핵심 — 항상 성공하지는 않음.

> A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit

클라이언트는 서버가 보고하는 모든 상태 코드를 이해하지 못할 수 있지만, 첫 자릿수가 가리키는 클래스는 반드시 이해해야 한다.

- **may not understand each status code**: 모든 코드를 다 알 필요 없음. 새 코드가 추가될 수 있어 클라이언트가 모르는 게 자연스러움.
- **must understand the class**: 클래스는 필수 이해. 코드를 5개 그룹으로 나눠 의미를 일반화.
- **first digit**: 첫 자릿수. 1, 2, 3, 4, 5 — 각각 다른 의미.

> and treat an unrecognized code as equivalent to the x00 code of that class.

인식 못 하는 코드는 그 클래스의 x00 코드와 동일하게 취급해야 한다.

- **unrecognized code**: 모르는 코드. 예: `499 Client Closed Request` (nginx 비표준).
- **equivalent to the x00 code**: 그 클래스의 첫 코드와 동일 처리. `499`를 모르면 `400 Bad Request`로 간주.

> 1XX informational: The request was received, continuing process.

1XX 정보: 요청이 수신되었고 처리가 계속 중이다.

- **informational**: 정보성. 최종 응답이 아니라 중간 진행 상황 알림.
- **continuing process**: 처리 중. 예: `100 Continue`(클라이언트가 계속 본문을 보내도 됨), `101 Switching Protocols`(WebSocket 업그레이드).

> 2XX successful: The request was successfully received, understood, and accepted.

2XX 성공: 요청이 성공적으로 수신·이해·수락되었다.

- **successful**: 성공. 가장 흔한 클래스.
- **received, understood, and accepted**: 받았고, 이해했고, 받아들였음. 세 단계 모두 OK.
- 대표 코드: `200 OK`, `201 Created`(POST 성공), `204 No Content`(성공이지만 본문 없음).

> 3XX redirection: Further action needs to be taken in order to complete the request.

3XX 리다이렉션: 요청을 완료하려면 추가 동작이 필요하다.

- **redirection**: 리다이렉션. "다른 곳으로 가라"는 신호.
- **further action**: 추가 동작. 보통 `Location` 헤더의 새 URL로 다시 요청.
- 대표 코드: `301 Moved Permanently`(영구 이동), `302 Found`(임시 이동), `304 Not Modified`(캐시 그대로 써).

> 4XX client error: The request cannot be fulfilled due to an issue that the client might be able to control.

4XX 클라이언트 에러: 클라이언트가 제어할 수 있는 문제로 요청을 충족할 수 없다.

- **client error**: 클라이언트 잘못. 잘못된 요청·인증 누락 등.
- **client might be able to control**: 클라이언트가 고칠 수 있음. 요청을 수정해서 다시 시도하면 성공 가능.
- 대표 코드: `400 Bad Request`, `401 Unauthorized`(인증 필요), `403 Forbidden`(권한 없음), `404 Not Found`, `429 Too Many Requests`.

> 5XX server error: The server failed to fulfill an apparently valid request.

5XX 서버 에러: 외관상 유효한 요청을 서버가 수행하지 못했다.

- **server error**: 서버 잘못. 클라이언트의 요청은 정상이었음.
- **apparently valid request**: 외관상 유효한. 클라이언트가 잘못한 게 아님.
- 대표 코드: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`.

---

**종합**

5개 클래스를 한눈에:

| 클래스 | 의미 | 대표 코드 | 누구 책임 |
|---|---|---|---|
| 1XX | 정보 (진행 중) | 100 Continue, 101 Switching Protocols | 인프라 |
| 2XX | 성공 | 200 OK, 201 Created, 204 No Content | — |
| 3XX | 리다이렉션 | 301 Moved Permanently, 302 Found, 304 Not Modified | 서버 (이동 안내) |
| 4XX | 클라이언트 에러 | 400 Bad Request, 401, 403, 404, 429 | 클라이언트 |
| 5XX | 서버 에러 | 500 Internal Server Error, 502, 503, 504 | 서버 |

JS 코드에서 클래스 단위로 처리:

```js
const res = await fetch('/api/users');

if (res.status >= 200 && res.status < 300) {
  // 2XX — 성공
  const data = await res.json();
} else if (res.status >= 400 && res.status < 500) {
  // 4XX — 클라이언트 에러: 요청 수정 필요
  if (res.status === 401) { /* 로그인 페이지로 */ }
  else if (res.status === 404) { /* 없는 페이지 */ }
  else { /* 일반 클라이언트 에러 */ }
} else if (res.status >= 500) {
  // 5XX — 서버 에러: 재시도 가능
  // 서버 문제이므로 같은 요청을 잠시 후 재시도하면 성공할 수 있음
}
```

`res.ok` 활용:

```js
const res = await fetch('/api/users');
if (!res.ok) {
  // res.ok === (status >= 200 && status < 300)
  // 4XX, 5XX 모두 false
  throw new Error(`HTTP ${res.status}`);
}
```

상태 코드를 모를 때 클래스로 fallback:

```js
// 알 수 없는 코드 499를 받으면 400처럼 처리
function classify(status) {
  if (status >= 500) return 'server-error';
  if (status >= 400) return 'client-error';
  if (status >= 300) return 'redirection';
  if (status >= 200) return 'success';
  return 'informational';
}
```

이게 없으면 어떻게 되는가:

- 5개 클래스가 없다면 — 클라이언트가 모든 가능한 코드를 미리 알아야 함. 새 코드 추가 시 모든 클라이언트 업데이트 필요. 확장성 zero.
- 첫 자릿수로 분류 안 됐다면 — 코드 번호와 의미의 매핑이 임의적이어서 외워야 함. 패턴이 있어 직관적 — 4XX는 일관되게 "내 잘못", 5XX는 "서버 잘못".

오개념 예방: 4XX와 5XX의 책임 구분이 명확하지 않은 코드도 있습니다. 예: `502 Bad Gateway`는 5XX이지만 사실 게이트웨이/프록시의 문제일 수 있어 "정확히 어느 서버"인지 불명확. `429 Too Many Requests`는 4XX이지만 클라이언트가 의도적으로 어긴 게 아니라 단순 과부하 — "client might be able to control"의 어휘 선택이 그래서 신중함. 절대적 분류가 아니라 일반적 가이드.

AI Annotation 보충: 모르는 상태 코드를 받으면 첫 자릿수(클래스)로 판단합니다. 알 수 없는 `499`를 받으면 `400`(Client Error)으로 처리. 상태 코드는 기계가 읽는 것이고, 사유 구문(Bad Request 등)은 사람이 읽는 것입니다 — 사유 구문은 표준이 아니어서 서버가 자유롭게 바꿀 수 있어서 코드만 신뢰해야 합니다.