# HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

## 도입

멱등(idempotent)은 수학 용어다. 같은 연산을 여러 번 해도 결과가 한 번 했을 때와 같다는 뜻이다. HTTP에서는 "같은 요청을 여러 번 보내도 서버 상태가 한 번 보낸 것과 동일하다"는 의미다. 네트워크 불안정으로 요청이 재전송될 때 멱등한 메서드는 안전하게 재시도할 수 있다.

---

## 본문

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.

"요청 메서드는 동일한 요청을 여러 번 보낸 결과가 한 번 보낸 것과 동일한 효과를 가질 때 멱등하다."

- **identical requests**: 완전히 같은 요청. URL, 헤더, 본문이 모두 동일한 경우다.
- **same effect**: 서버 상태(DB, 파일 등)가 같아야 한다. 응답 코드가 같아야 한다는 뜻이 아니다.

> The methods PUT and DELETE, and safe methods are defined as idempotent.

"PUT과 DELETE, 그리고 안전한 메서드들이 멱등하다고 정의된다."

> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.

"안전한 메서드는 자명하게 멱등하다 — 서버에 어떤 효과도 없도록 의도되어 있기 때문이다. PUT과 DELETE는 연속 동일 요청이 무시되므로 멱등하다."

- **trivially idempotent**: 서버를 바꾸지 않으므로 당연히 멱등하다.
- **successive identical requests will be ignored**: `DELETE /users/123`을 두 번 보내면 두 번째는 "이미 없음"이지만 서버 상태는 "123이 없음"으로 동일하다.

> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent.

"반면 POST, CONNECT, PATCH는 반드시 멱등한 것은 아니다."

- **not necessarily**: 멱등할 수도 있지만 보장되지 않는다는 뜻이다. PATCH가 `{ "count": "+1" }` 같은 증분이면 비멱등이지만, `{ "status": "active" }` 같은 절대값 설정이면 멱등하다.

```
멱등(Idempotent)     GET, HEAD, OPTIONS, TRACE, PUT, DELETE
비멱등               POST, PATCH(경우에 따라)
```

---

## 종합

멱등성은 네트워크 안정성과 직결된다. `fetch()`가 타임아웃 나서 재시도할 때, GET/PUT/DELETE는 여러 번 보내도 안전하지만 POST는 중복 처리될 수 있다. 이것이 결제, 주문 같은 POST 요청에 별도의 중복 방지 로직(Idempotency-Key 헤더, 버튼 비활성화 등)이 필요한 이유다. 프로토콜 자체가 멱등성을 강제하지 않으므로, 개발자가 서버 구현에서 보장해야 한다.

---

# POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

## 도입

POST는 비멱등이다. 같은 요청을 두 번 보내면 두 번 처리된다. 네트워크가 느리거나 사용자가 버튼을 연타하면, 의도하지 않은 중복 처리가 발생한다.

---

## 본문

> In some cases this is the desired effect, but in other cases it may occur accidentally.

"경우에 따라 이것이 의도된 효과이기도 하지만, 다른 경우에는 실수로 발생할 수 있다."

- **desired effect**: 게시글 좋아요 수를 늘리는 POST는 두 번 보내면 두 번 올라가야 한다. 의도된 중복이다.
- **accidentally**: 주문 확정 버튼을 두 번 클릭하면 두 번 주문되는 것은 의도하지 않은 중복이다.

> A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.

"예를 들어, 첫 번째 클릭이 처리 중이라는 명확한 피드백이 주어지지 않으면 사용자가 버튼을 다시 클릭하여 여러 POST 요청을 실수로 보낼 수 있다."

- **inadvertently**: "실수로" — 사용자의 의도가 아니다. 로딩 표시가 없으면 "반응 없나?" 하고 다시 클릭한다.
- **clear feedback**: 스피너, 버튼 비활성화, "처리 중" 텍스트 등 진행 상태를 보여주는 UI.

> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

"웹 브라우저가 페이지 새로고침 시 POST 요청이 재제출될 수 있는 경우 경고 대화상자를 표시하기도 하지만, 일반적으로 POST 요청이 두 번 이상 제출되어서는 안 되는 경우를 처리하는 것은 웹 애플리케이션의 책임이다."

- **re-submit a POST request**: 브라우저가 POST 후 새로고침하면 "이 페이지를 다시 제출하시겠습니까?" 대화상자를 띄운다. 이것이 POST-Redirect-GET 패턴을 쓰는 이유다.
- **up to the web application**: 프로토콜이 방지해주지 않는다. 개발자가 직접 처리해야 한다.

**FE 실무 대응 패턴:**

```js
// 버튼 비활성화
async function handleOrder() {
  submitBtn.disabled = true
  try {
    await fetch('/api/orders', { method: 'POST', body: orderData })
  } finally {
    submitBtn.disabled = false
  }
}

// 낙관적 락 / Idempotency-Key
fetch('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': crypto.randomUUID() }
})
```

---

## 종합

POST 비멱등성의 실무 영향은 두 가지다. 첫째, UI에서 로딩 인디케이터와 버튼 비활성화로 사용자가 중복 클릭하지 않도록 막아야 한다. 둘째, 서버 측에서 Idempotency-Key 헤더나 DB 유니크 제약으로 중복 처리를 방어해야 한다. 프론트엔드 혼자 막을 수 있는 문제가 아니라 프론트엔드+백엔드 양쪽에서 대응해야 하는 문제다.

---

# [UNVERIFIED] Safe method와 Idempotent method의 정의 및 차이는?

## 도입

Safe와 Idempotent는 비슷해 보이지만 다른 축에서 메서드를 분류한다. Safe는 "서버 상태를 변경하는가"를, Idempotent는 "여러 번 호출해도 결과가 같은가"를 묻는다. 안전한 메서드는 모두 멱등하지만, 멱등한 메서드가 모두 안전한 것은 아니다.

---

## 본문

**Safe (안전)**

요청이 서버 상태에 의도된 영향을 미치지 않는다. 읽기 전용이다.

```
Safe → 서버 상태 변경 X
```

GET, HEAD, OPTIONS, TRACE가 Safe.

**Idempotent (멱등)**

동일한 요청을 여러 번 보내도 결과가 한 번 보낸 것과 동일하다.

```
Idempotent → f(f(x)) = f(x)
```

GET, HEAD, OPTIONS, TRACE (Safe), PUT, DELETE가 Idempotent.

**차이와 관계**

```
                  Safe?    Idempotent?
GET, HEAD        ✓ Yes     ✓ Yes
OPTIONS, TRACE   ✓ Yes     ✓ Yes
PUT              ✗ No      ✓ Yes (전체 교체)
DELETE           ✗ No      ✓ Yes (이미 없으면 무시)
POST             ✗ No      ✗ No
PATCH            ✗ No      △ Maybe (절대값이면 Yes, 증분이면 No)
```

- PUT은 서버 상태를 변경하지만(→ Not Safe), 같은 내용으로 두 번 보내도 결과가 같다(→ Idempotent).
- DELETE는 리소스를 지우지만(→ Not Safe), 이미 지워진 리소스를 또 지워도 상태는 "없음"으로 동일하다(→ Idempotent).
- POST는 변경도 하고(→ Not Safe), 두 번 보내면 두 번 처리된다(→ Not Idempotent).

---

## 종합

Safe는 "이 요청이 부작용이 있는가"의 질문이고, Idempotent는 "재시도해도 괜찮은가"의 질문이다. Safe이면 자동으로 Idempotent이지만, Idempotent가 Safe를 의미하지는 않는다. PUT으로 파일을 덮어쓰는 것은 멱등하지만 안전하지는 않다. 이 두 속성을 이해하면 API 설계에서 어떤 메서드를 써야 할지, 재시도 로직을 어디에 넣어야 할지 판단하는 기준이 생긴다.

---

# [UNVERIFIED] DELETE를 두 번 호출하면 두 번째 응답은 200인가 404인가? 멱등성과 응답 코드는 같은 개념인가?

## 도입

DELETE의 멱등성은 "서버 상태가 동일하다"는 것이지, "응답 코드가 동일하다"는 것이 아니다. 이 미묘한 차이가 혼란의 원인이다.

---

## 본문

**첫 번째 DELETE**

`DELETE /users/123`을 보내면 서버는 해당 리소스를 삭제하고 `200 OK` 또는 `204 No Content`를 응답한다.

**두 번째 DELETE**

같은 URL에 다시 `DELETE /users/123`을 보내면 리소스가 이미 없다. 서버 구현에 따라 다음 두 가지 중 하나다.

- `404 Not Found`: 엄밀하게 구현한 경우. "삭제할 대상이 없으므로 찾을 수 없다."
- `200 OK` 또는 `204 No Content`: 멱등성에 충실한 구현. "이미 삭제된 상태이므로 목표가 달성됐다."

**멱등성과 응답 코드는 다른 개념이다**

멱등성의 정의는 "서버 상태(state)가 동일하다"이지 "응답 코드(status code)가 동일하다"가 아니다. 두 번째 DELETE가 `404`를 반환해도 서버 상태는 "123이 없음"으로 동일하므로 DELETE는 여전히 멱등하다.

```
DELETE /users/123  → 200 OK    (리소스 삭제됨)
서버 상태: users/123 없음

DELETE /users/123  → 404 Not Found (이미 없음)
서버 상태: users/123 없음  ← 동일!

→ 응답 코드가 달라도 서버 상태가 동일하므로 멱등성 충족
```

---

## 종합

클라이언트가 DELETE 재시도 로직을 구현할 때 `404`를 에러로 처리할지 성공으로 처리할지 결정해야 한다. 멱등성 관점에서는 `404`도 "목표(리소스 없음) 달성"으로 볼 수 있으므로 정상 처리로 취급하는 것이 더 자연스럽다. Stripe 같은 API는 이 이유로 DELETE를 여러 번 호출해도 `404` 대신 `200`을 반환하는 설계를 선택하기도 한다.

---

# [UNVERIFIED] POST를 멱등하게 만드는 패턴(Idempotency-Key)은 어떻게 동작하는가?

## 도입

POST는 기본적으로 비멱등이지만, 실무에서는 결제, 주문처럼 중복 처리를 절대 피해야 하는 상황이 있다. 이때 사용하는 패턴이 Idempotency-Key다. 클라이언트가 요청에 고유한 키를 붙여 보내면, 서버가 같은 키의 요청을 중복 처리하지 않는다.

---

## 본문

**동작 원리**

1. 클라이언트가 POST 요청을 보낼 때 `Idempotency-Key` 헤더에 UUID 같은 고유 값을 포함한다.
2. 서버는 이 키를 처리 결과와 함께 저장(캐시/DB)한다.
3. 같은 키로 다시 요청이 오면 서버는 처음 처리 결과를 그대로 반환한다. 처리 로직을 다시 실행하지 않는다.

```js
const idempotencyKey = crypto.randomUUID()

// 첫 번째 요청 (처리됨)
await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey
  },
  body: JSON.stringify(orderData)
})

// 네트워크 에러로 응답을 못 받음 → 재시도
// 두 번째 요청 (서버는 첫 결과를 그대로 반환)
await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey // 같은 키!
  },
  body: JSON.stringify(orderData)
})
```

서버는 두 번째 요청에서 주문을 새로 생성하지 않고 첫 번째 주문의 응답을 그대로 돌려준다. 클라이언트 입장에서 POST가 멱등하게 동작한다.

**키 생성 전략**

- `crypto.randomUUID()`: 브라우저/Node.js 모두 지원하는 표준 UUID v4 생성
- 세션당 하나의 키: 장바구니 → 주문 확정 플로우에서 결제 시도마다 새 UUID

---

## 종합

Idempotency-Key는 "POST를 안전하게 재시도할 수 있게" 만드는 애플리케이션 레벨 패턴이다. 네트워크 타임아웃 후 재시도하거나, 사용자가 뒤로 가기 후 다시 제출할 때 중복 처리를 방지한다. Stripe, PayPal 같은 결제 API가 이 헤더를 표준으로 요구하며, RFC 초안으로도 표준화가 논의되고 있다. 서버 구현에서는 키를 Redis나 DB에 저장하고 일정 기간(24~48시간) 후 만료시키는 것이 일반적이다.
