# resolver 실행 도중 어떤 지점(예: 인증 검사 헬퍼 함수 안)에서든 특정 응답으로 요청 처리를 즉시 끝내버리고 싶다. 어떻게 하는가?

## 도입

resolver(요청을 받아 처리하는 함수) 안에서 응답을 만들어 돌려줄 때 보통은 `return`을 쓴다. 그런데 `return`은 함수의 **맨 끝(최상단)에서** 값을 돌려줘야 흐름이 끝난다. 문제는 이런 상황이다 — resolver가 여러 헬퍼 함수를 거치는데, 그 **깊숙한 곳**(예: 인증 헤더를 검사하는 가드 함수 안)에서 "조건 미달이면 여기서 바로 401을 내보내고 요청 처리를 끝내고 싶다"는 경우다.

깊은 헬퍼 함수 안에서 `return`으로 값을 돌려줘 봐야 그 헬퍼 함수만 끝날 뿐, 바깥 resolver로 응답이 전달되지는 않는다. 그렇다면 중첩된 함수 어디에서든 요청 처리 자체를 즉시 확정하고 끝내려면 어떻게 해야 할까?

## 본문

### `Response`를 **throw**하면 그 자리에서 응답이 확정된다

공식 문서의 설명이다.

> If you throw a Response instance at any point in the response resolver, that response will be used as the mocked response for the request. This is particularly handy for short-circuiting the resolver flow anywhere during the request handling.

resolver 실행 도중 **어느 지점에서든** `Response` 인스턴스를 **throw(던지기)**하면, 던져진 그 응답이 이 요청의 목 응답으로 쓰인다. 이것은 요청 처리 도중 아무 데서나 흐름을 **즉시 끊어(short-circuit)** 버리고 싶을 때 특히 요긴하다.

여기서 핵심은 `return`이 아니라 `throw`라는 점이다. 자바스크립트에서 `throw`는 지금 실행 중인 흐름을 그 자리에서 중단시키고, 중첩된 함수든 뭐든 바깥으로 뚫고 빠져나간다. MSW는 이 성질을 이용해 "던져진 게 `Response`면 그걸 목 응답으로 확정한다"는 규칙을 걸어 두었다. 그래서 헬퍼 함수 몇 겹 안쪽에서 `Response`를 던져도, 그 응답이 곧장 요청의 최종 답으로 확정되며 resolver 실행이 거기서 끝난다.

#### `return`과 `throw`의 결정적 차이

- **`return`**: resolver 함수 본체가 값을 돌려주는 정상적인 출구다. 값을 돌려주려면 그 값이 최종적으로 resolver 최상단까지 전달돼야 한다. 깊은 헬퍼 함수 안에서 `return`하면 그 헬퍼만 끝나고, 바깥 resolver는 계속 이어진다.
- **`throw`**: 실행 흐름을 어디서든 즉시 끊고 바깥으로 튀어나오는 비상 출구다. 중첩 깊이와 무관하게 한 방에 요청 처리를 끝낼 수 있다.

비유하면, `return`은 "결재 라인을 정상적으로 다 거쳐 맨 위에서 정식 발송"하는 것이고, `throw`는 "비상 상황이라 아무 데서나 즉시 발송 버튼을 눌러 그 자리에서 절차를 종료"하는 것이다. 인증 실패처럼 "더 볼 것도 없이 바로 끝내야 하는" 경우엔 후자가 훨씬 깔끔하다.

### 예시 — 인증 가드에서 조기 종료

공식 문서의 예시는 이렇다.

> In this example, the GET /resource request will get a "401 Unauthorized" response if it doesn't contain the Authorization header. Otherwise, it will proceed with the mocked JSON response.

```ts
function withAuthorization(request: Request) {
  if (!request.headers.get('authorization')) {
    throw HttpResponse.text('Unauthorized', { status: 401 })
  }
}

http.get<never, never, { id: string }>('/resource', ({ request }) => {
  withAuthorization(request)
  return HttpResponse.json({ id: 'abc-123' })
})
```

동작을 따라가 보면 이렇다. resolver는 먼저 `withAuthorization(request)`라는 별도 헬퍼 함수를 호출한다. 이 헬퍼는 요청에 `authorization` 헤더가 없으면 `401 Unauthorized` 응답을 **throw**한다. 던지는 순간 resolver 흐름은 그 자리에서 끊기고, 이 `401`이 요청의 목 응답으로 확정된다 — 아래에 있는 `return HttpResponse.json(...)`은 **실행되지 않는다**.

반대로 `authorization` 헤더가 있으면 `withAuthorization`은 아무것도 던지지 않고 조용히 통과한다. 그러면 흐름이 이어져 `return HttpResponse.json({ id: 'abc-123' })`에 도달해 정상 JSON 목 응답이 반환된다.

주목할 점은, 401을 던지는 코드가 resolver 본체가 아니라 **한 겹 안쪽 헬퍼 함수** 안에 있다는 것이다. 만약 `throw`가 아니라 `return`을 썼다면, 헬퍼가 401을 돌려줘도 resolver 본체가 그 반환값을 받아 다시 처리해 줘야 해서 코드가 번거로워진다. `throw`이기 때문에 헬퍼 깊숙한 곳에서 한 방에 요청 처리를 끝낼 수 있는 것이다. 이런 인증 가드 패턴은 여러 resolver에서 재사용하기에도 깔끔하다.

## 종합

resolver 실행 도중 어느 지점에서든 요청 처리를 특정 응답으로 즉시 끝내고 싶으면, 그 `Response`(또는 `HttpResponse`)를 **return이 아니라 throw**하면 된다. 던져진 응답이 그 요청의 목 응답으로 확정되면서 resolver 흐름이 그 자리에서 끊긴다(short-circuit). `return`은 값을 resolver 최상단까지 전달해야 하지만, `throw`는 중첩된 헬퍼 함수 깊은 곳에서도 흐름을 끊고 빠져나올 수 있다는 것이 결정적 차이다. 대표적으로 인증 가드처럼 "조건 미달이면 더 볼 것 없이 바로 401로 끝, 통과하면 정상 응답"인 조기 종료 패턴에 잘 맞는다.
