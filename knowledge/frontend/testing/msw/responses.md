---
tags: [testing, network]
source: official
publishable: true
---
# Questions
- resolver 실행 도중 어떤 지점(예: 인증 검사 헬퍼 함수 안)에서든 특정 응답으로 요청 처리를 즉시 끝내버리고 싶다. 어떻게 하는가?

---

# Answers

## resolver 실행 도중 어떤 지점(예: 인증 검사 헬퍼 함수 안)에서든 특정 응답으로 요청 처리를 즉시 끝내버리고 싶다. 어떻게 하는가?

### Official Answer
If you throw a Response instance at any point in the response resolver, that response will be used as the mocked response for the request. This is particularly handy for short-circuiting the resolver flow anywhere during the request handling.

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

In this example, the GET /resource request will get a "401 Unauthorized" response if it doesn't contain the Authorization header. Otherwise, it will proceed with the mocked JSON response.

### Reference
- https://mswjs.io/docs/http/mocking-responses/
