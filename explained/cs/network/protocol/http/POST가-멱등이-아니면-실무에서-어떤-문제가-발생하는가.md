# POST가 멱등이 아니면 실무에서 어떤 문제가 발생하는가?

> In some cases this is the desired effect, but in other cases it may occur accidentally.
> A user might, for example, inadvertently send multiple POST requests by clicking a button again if they were not given clear feedback that the first click was being processed.
> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request, it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

---

**도입**

쇼핑몰에서 결제 버튼을 눌렀는데 응답이 늦어지자 또 누른 경험이 있나요? 운이 나쁘면 결제가 두 번 됩니다. POST가 비멱등이라는 추상적 사실이 실무에서는 이런 구체적 문제로 나타납니다. 그리고 이건 서버나 프로토콜이 아니라 — 웹 애플리케이션이 책임지고 처리해야 하는 영역입니다.

---

**도입 추가**

앞 질문에서 POST가 비멱등이라 같은 요청을 여러 번 보내면 부작용이 누적된다는 걸 봤습니다. 이번엔 이게 사용자 행동과 만났을 때 어떤 모습으로 나타나고, 누가 책임지고 막아야 하는지 봅니다.

---

**본문**

> In some cases this is the desired effect, but in other cases it may occur accidentally.

어떤 경우에는 이게 의도된 효과이지만, 다른 경우에는 우발적으로 발생할 수 있다.

- **desired effect**: 의도된 효과. 댓글 2개 작성처럼 정말 두 번 처리하길 원할 때.
- **occur accidentally**: 우발적 발생. 사용자는 한 번 처리되길 원했는데 실수로 두 번 보냄.

> A user might, for example, inadvertently send multiple POST requests by clicking a button again

예를 들어, 사용자가 버튼을 다시 클릭해 의도치 않게 여러 POST 요청을 보낼 수 있다.

- **inadvertently**: 의도치 않게. 사용자가 부주의해서가 아니라, UI가 진행 상황을 알려주지 않아서.
- **clicking a button again**: 버튼 재클릭. "왜 반응이 없지?" 하며 또 누름.

> if they were not given clear feedback that the first click was being processed.

첫 번째 클릭이 처리되고 있다는 명확한 피드백을 받지 못한 경우.

- **clear feedback**: 명확한 피드백. 로딩 스피너, 버튼 비활성화, 진행 메시지 등. UX 디자인의 영역.
- **first click was being processed**: 첫 클릭 처리 중. 사용자에게 "지금 처리 중이니 기다려"를 시각적으로 알려야 함.

> While web browsers may show alert dialog boxes to warn users in some cases where reloading a page may re-submit a POST request,

웹 브라우저가 페이지 새로고침이 POST 요청을 재제출할 수 있는 경우 사용자에게 경고하는 알림 대화상자를 띄우기는 하지만.

- **alert dialog boxes**: 경고 다이얼로그. "Confirm Form Resubmission" 같은 익숙한 메시지.
- **reloading a page**: 페이지 새로고침. F5나 Ctrl+R.
- **re-submit a POST request**: POST 재제출. POST로 폼을 제출한 후 새로고침하면 같은 요청이 다시 갈 수 있음.

> it is generally up to the web application to handle cases where a POST request should not be submitted more than once.

POST 요청이 한 번 이상 제출되어서는 안 되는 경우를 처리하는 것은 일반적으로 웹 애플리케이션의 책임이다.

- **up to the web application**: 애플리케이션의 책임. 브라우저나 HTTP 프로토콜이 아닌 — 우리가 짜는 코드가 막아야 함.
- **should not be submitted more than once**: 한 번 이상 제출되면 안 됨. 결제, 주문, 가입 등 — 중복이 사용자에게 손해인 동작.

---

**종합**

POST 중복 제출이 일어나는 시나리오:

| 시나리오 | 원인 | 결과 |
|---|---|---|
| 버튼 연타 | 응답 지연 + UI 피드백 부족 | 중복 결제, 중복 주문 |
| 페이지 새로고침 (F5) | POST 폼 제출 후 새로고침 | 같은 폼 데이터 재전송 |
| 브라우저 뒤로가기 | POST 결과 페이지에서 뒤로가기 후 다시 제출 | 같은 결제 두 번 |
| 네트워크 재시도 | 클라이언트 라이브러리의 자동 재시도 | 같은 요청 N번 처리 |

웹 애플리케이션이 책임지고 막아야 하는 방법들:

**프론트엔드**:

```jsx
// 1. 버튼 비활성화
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit() {
  if (isSubmitting) return;     // 이미 처리 중이면 무시
  setIsSubmitting(true);
  try {
    await fetch('/api/orders', { method: 'POST', body: ... });
  } finally {
    setIsSubmitting(false);
  }
}

return (
  <button onClick={handleSubmit} disabled={isSubmitting}>
    {isSubmitting ? '처리 중...' : '결제하기'}
  </button>
);
```

```jsx
// 2. 디바운스/throttle
import { useDebouncedCallback } from 'use-debounce';

const debouncedSubmit = useDebouncedCallback(handleSubmit, 1000);
// 1초 내 연속 클릭은 한 번으로 합쳐짐
```

**백엔드** (Idempotency Key):

```js
// 클라이언트가 매 요청마다 고유 키 생성
const idempotencyKey = crypto.randomUUID();
await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ amount: 50000 })
});

// 서버는 같은 키를 본 적 있으면 첫 처리 결과를 다시 반환 (중복 처리 X)
// Stripe, AWS API가 이 패턴 사용
```

이게 없으면 어떻게 되는가:

- 중복 방지가 없다면 — 결제 시스템이 사용자에게 이중 청구하는 사고가 빈발. 환불 처리, CS 문의가 늘고 사용자 신뢰 손상.
- "POST가 비멱등"이라는 사실은 약속이지 강제가 아니므로 — 애플리케이션이 적극적으로 막지 않으면 자연스럽게 중복이 발생.

오개념 예방: "Post-Redirect-Get(PRG) 패턴"이 새로고침으로 인한 POST 재제출을 막는 표준 방법입니다. POST 처리 후 응답으로 `303 See Other`를 보내고, 클라이언트가 Location 헤더의 GET 페이지로 이동하게 함. 이러면 새로고침해도 GET이 재실행될 뿐 POST는 다시 안 됨.

```js
// 서버 측 PRG 예
app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  res.redirect(303, `/orders/${order.id}/success`);  // GET 페이지로 리다이렉트
});
```

POST 비멱등성에서 비롯되는 보호 책임은 누구에게 있는가:

| 계층 | 역할 |
|---|---|
| HTTP 프로토콜 | 멱등성을 정의만, 강제 안 함 |
| 브라우저 | 새로고침 시 알림 다이얼로그 표시 |
| 백엔드 | Idempotency-Key 처리, 중복 감지 |
| 프론트엔드 | 버튼 비활성화, 로딩 피드백, debounce |

각 계층이 역할을 분담해야 — 하나라도 빠지면 사용자가 결국 중복 처리를 겪게 됩니다.

AI Annotation 보충: FE 실무에서 직접 겪는 문제 — 버튼 연타로 POST 중복 전송 → 중복 주문, 이메일 다중 발송. 로딩 인디케이터나 버튼 비활성화로 방지해야 하며, 이는 웹 애플리케이션의 책임입니다. HTTP가 막아주지 않습니다.
