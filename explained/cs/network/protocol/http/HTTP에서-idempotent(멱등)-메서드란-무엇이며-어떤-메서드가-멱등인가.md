# HTTP에서 idempotent(멱등) 메서드란 무엇이며, 어떤 메서드가 멱등인가?

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.
> The methods PUT and DELETE, and safe methods are defined as idempotent.
> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever; the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.
> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent, and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.
> Note that whether or not a method is idempotent is not enforced by the protocol or web server.

---

**도입**

네트워크는 불안정합니다. 요청을 보냈는데 응답이 안 오면 — 서버에 도달했는지, 응답만 잃어버렸는지 알 수 없습니다. 안전하게 재시도하려면 "여러 번 보내도 같은 결과"인 메서드여야 합니다. 이 성질이 idempotent(멱등성)이고, 안전한 자동 재시도가 가능한 메서드를 가르는 기준입니다.

---

**본문**

> A request method is idempotent if multiple identical requests with that method have the same effect as a single such request.

요청 메서드는 그 메서드의 동일한 요청을 여러 번 보낸 효과가 한 번 보낸 효과와 같으면 멱등하다.

- **idempotent**: 멱등. 같은 동작을 반복해도 결과가 같은 성질. 수학에서 온 용어 — `f(f(x)) = f(x)`.
- **multiple identical requests**: 여러 번의 동일한 요청. "동일한"이 중요 — 같은 메서드, URL, 헤더, 본문.
- **same effect as a single such request**: 한 번 보낸 것과 동일한 효과. 결과뿐 아니라 서버 상태까지 같음.

> The methods PUT and DELETE, and safe methods are defined as idempotent.

PUT, DELETE 메서드와 safe 메서드들이 멱등으로 정의된다.

- **PUT**: 멱등. `PUT /users/123 {name: "Alice"}`을 100번 보내도 user 123의 이름은 "Alice".
- **DELETE**: 멱등. `DELETE /users/123`을 한 번 보내면 삭제, 두 번째부터는 이미 없음. 결과적으로 동일한 상태.
- **safe methods**: GET, HEAD, OPTIONS, TRACE — 모두 멱등.

> Safe methods are trivially idempotent, since they are intended to have no effect on the server whatsoever;

safe 메서드는 자명하게 멱등하다. 서버에 어떤 효과도 의도하지 않기 때문.

- **trivially idempotent**: 자명하게 멱등. 변경이 없으니 몇 번을 보내든 결과는 같음 — 너무 당연.
- **no effect on the server whatsoever**: 서버에 어떤 영향도 없음. 변경 없는데 어떻게 결과가 달라지겠나.

> the PUT and DELETE methods, meanwhile, are idempotent since successive identical requests will be ignored.

한편 PUT과 DELETE 메서드는 연속된 동일 요청이 무시되기 때문에 멱등하다.

- **successive identical requests**: 연속된 동일 요청. 두 번째, 세 번째 요청.
- **will be ignored**: 무시됨. 두 번째 PUT은 같은 상태를 다시 설정 → 변화 없음. 두 번째 DELETE는 이미 없는 걸 또 지우려 함 → 변화 없음.

> In contrast, the methods POST, CONNECT, and PATCH are not necessarily idempotent,

반대로 POST, CONNECT, PATCH는 반드시 멱등이지는 않다.

- **not necessarily idempotent**: 멱등이 보장되지 않음. 멱등일 수도 있고 아닐 수도 있음 — 구현에 달림.
- **POST**: 일반적으로 비멱등. 여러 번 보내면 새 자원이 여러 개 생성될 수 있음.
- **PATCH**: 비멱등 가능. 절대값 설정(`{balance: 100}`)은 멱등, 증감(`{balance: balance + 100}`)은 비멱등.
- **CONNECT**: 터널 생성. 부작용 있음.

> and therefore sending an identical POST request multiple times may further modify the state of the server or have further effects, such as sending multiple emails.

따라서 동일한 POST 요청을 여러 번 보내면 서버 상태가 더 변경되거나, 여러 개의 이메일 전송 같은 추가 효과가 생길 수 있다.

- **further modify the state**: 서버 상태가 더 변경. 같은 요청 N번 = N개의 새 레코드 생성 가능성.
- **sending multiple emails**: 여러 이메일 전송. 결제 알림이 N번, 환영 메일이 N번 — 사용자에게 명확한 부작용.

> Note that whether or not a method is idempotent is not enforced by the protocol or web server.

메서드가 멱등인지 아닌지는 프로토콜이나 웹 서버에 의해 강제되지 않는다는 점에 주의.

- **not enforced**: 강제 안 됨. PUT 핸들러를 비멱등하게 짤 수도 있고, POST를 멱등하게 짤 수도 있음. 약속이지 강제가 아님.

---

**종합**

각 메서드의 멱등성:

| 메서드 | 멱등 | 이유 |
|---|---|---|
| GET | ○ | 변경 없음 |
| HEAD | ○ | 변경 없음 |
| OPTIONS | ○ | 변경 없음 |
| TRACE | ○ | 변경 없음 |
| PUT | ○ | 같은 상태로 덮어쓰기 |
| DELETE | ○ | 두 번째부터는 변화 없음 |
| POST | × | 매번 새 레코드 가능 |
| PATCH | △ | 구현에 따라 |
| CONNECT | × | 터널 매번 생성 |

JS 개발자가 만나는 실무적 의미:

```js
// 멱등 — 안전하게 재시도 가능
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
}

// GET은 멱등이라 재시도 안전
await fetchWithRetry('/api/users/123');

// PUT도 멱등이라 재시도 안전
await fetchWithRetry('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice' })
});

// 단, POST는 위험! 네트워크 오류로 응답만 못 받았는데 서버에선 처리됐으면
// 재시도가 중복 처리를 만든다
await fetchWithRetry('/api/orders', { method: 'POST', ... });  // 위험
```

POST를 안전하게 재시도하는 패턴 — Idempotency Key:

```js
const idempotencyKey = crypto.randomUUID();
await fetchWithRetry('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ ... })
});
// 서버가 같은 키 보면 두 번째부터는 첫 결과 반환 → 중복 처리 방지
// Stripe API가 이 패턴 사용
```

이게 없으면 어떻게 되는가:

- 멱등성 약속이 없다면 — 네트워크 재시도가 위험. 결제 시스템이 사용자에게 이중 청구하는 사고 빈발. 분산 시스템의 신뢰성 보장이 어려움.
- HTTP 클라이언트(브라우저, 라이브러리)가 자동 재시도를 못 하므로 — 일시적 네트워크 오류에 대한 회복성이 모든 곳에서 수동으로 다뤄져야 함.

오개념 예방: "POST를 절대 재시도하면 안 된다"는 건 너무 일방적입니다. 멱등하지 않을 가능성이 있다는 뜻이지 — 서버가 Idempotency-Key 같은 메커니즘을 제공하면 안전하게 재시도 가능. 핵심은 "서버 구현의 약속을 알고 사용하라"입니다.

safe와 idempotent의 관계: safe ⊂ idempotent. safe는 변경 없으므로 자동으로 idempotent. 반대는 아님 — DELETE는 idempotent이지만 safe하지 않습니다. 첫 DELETE에서 데이터가 사라지는 것 자체는 부작용이니까.

AI Annotation 보충: 멱등 정리하면 GET/PUT/DELETE = 멱등 (여러 번 보내도 한 번과 같음), POST/PATCH = 비멱등 (중복 시 부작용). 이 분류가 자동 재시도 가능 여부의 기준이며, REST API 설계에서 메서드를 고를 때 가장 중요한 고려 사항 중 하나입니다.
