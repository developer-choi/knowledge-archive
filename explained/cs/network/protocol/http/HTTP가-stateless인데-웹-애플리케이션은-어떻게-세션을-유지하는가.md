# HTTP가 stateless인데 웹 애플리케이션은 어떻게 세션을 유지하는가?

> As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.
> If a web application needs an application session, it implements it via HTTP cookies, hidden variables in a web form or another mechanism.

---

**도입**

HTTP가 stateless라는 게 "서버가 클라이언트를 기억할 수 없다"라는 뜻이라면, 어떻게 한 번 로그인한 사용자가 다음 요청에서도 로그인 상태일 수 있을까요? 답은 — HTTP 자체는 기억 안 하지만, 그 위에서 동작하는 웹 애플리케이션이 별도 메커니즘으로 기억을 만들어냅니다. 여기서 가장 흔한 메커니즘이 쿠키입니다.

---

**본문**

> As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.

stateless 프로토콜로서, HTTP는 웹 서버가 여러 요청 동안 각 사용자에 대한 정보나 상태를 유지하도록 요구하지 않는다.

- **does not require**: 요구하지 않음. 유지하지 말라는 게 아니라, 유지할 필요가 없다는 의미. 서버가 자율적으로 결정.
- **retain information or status**: 정보나 상태 보존. 누가 로그인했는지, 무슨 메뉴를 봤는지 등의 사용자별 데이터.
- **for the duration of multiple requests**: 여러 요청에 걸쳐. 한 요청 안에서가 아니라 여러 요청을 가로지르는 시간 단위.

> If a web application needs an application session,

웹 애플리케이션이 애플리케이션 세션을 필요로 한다면.

- **needs an application session**: 세션이 필요하다면. 모든 사이트가 세션을 필요로 하지는 않습니다 — 정적 사이트, 단순 조회 API는 세션 없이도 동작.
- **application session**: 애플리케이션 레벨의 세션. HTTP 프로토콜의 세션이 아니라, 그 위 애플리케이션이 만든 개념.

> it implements it via HTTP cookies, hidden variables in a web form or another mechanism.

HTTP 쿠키, 웹 폼의 hidden 변수, 또는 다른 메커니즘을 통해 구현한다.

- **HTTP cookies**: 가장 흔한 방법. 서버가 응답 헤더 `Set-Cookie`로 식별자를 보내고, 클라이언트가 이후 모든 요청에 `Cookie` 헤더로 다시 보냄.
- **hidden variables in a web form**: 폼의 숨김 필드(`<input type="hidden">`). 페이지 간 이동 시 폼 제출로 상태를 다음 요청에 실어 보냄. 옛날 방식.
- **another mechanism**: 다른 메커니즘. JWT 토큰을 `Authorization` 헤더로 보내기, URL의 query string에 세션 ID 박기, localStorage + 매 요청 헤더 추가 등.

---

**종합**

HTTP의 stateless 위에 세션을 만드는 방법들:

| 메커니즘 | 방식 | 장점 | 단점 |
|---|---|---|---|
| 쿠키 (세션 ID) | 서버가 세션 ID 발급 → 매 요청에 자동 첨부 | 자동 전송, 보안 옵션(HttpOnly, Secure) | CSRF 취약, 도메인 제한 |
| JWT (Bearer 토큰) | 서명된 토큰을 클라이언트가 저장, `Authorization` 헤더로 수동 첨부 | 무상태 서버 가능, 페이로드에 정보 포함 | 토큰 무효화 어려움 |
| URL 파라미터 | `?session=abc123` | 쿠키 못 쓸 때 fallback | 로그·북마크에 노출, 보안 약함 |
| Hidden form 변수 | 폼 제출로만 세션 전달 | 단순 | 클릭 흐름 외엔 못 씀 (사장됨) |

JS 코드에서 세션이 어떻게 작동하는지 보면:

```js
// 1. 로그인: 서버가 Set-Cookie로 세션 ID 응답
const res = await fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({ id, pw }),
  credentials: 'include'  // 쿠키 받겠다
});
// 응답 헤더에 Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict

// 2. 다음 요청: 브라우저가 쿠키 자동 첨부
const me = await fetch('/api/me', { credentials: 'include' });
// 요청 헤더에 Cookie: sessionId=abc123 자동 추가
// 서버는 이 ID로 사용자 식별
```

서버는 여전히 stateless하게 보일 수 있습니다 — 매 요청에 첨부된 세션 ID를 보고 DB나 Redis에서 사용자 정보를 조회하면 됩니다. 또는 JWT처럼 토큰 자체에 사용자 ID가 들어있어 DB 조회 없이 식별할 수도 있습니다.

이게 없으면 어떻게 되는가: 세션 메커니즘이 없다면 — 매 요청마다 사용자가 ID/PW를 다시 입력해야 합니다. 페이지 한 번 이동할 때마다 로그인 화면. 사용자 경험은 처참하고, 보안적으로도 자격증명을 자주 평문으로 처리하게 되어 노출 위험만 커집니다.

오개념 예방: "HTTP가 stateless면 세션을 유지할 수 없다"는 잘못입니다. MDN의 표현이 정확합니다 — "HTTP is stateless, but not sessionless". HTTP 자체는 상태를 유지하지 않지만, HTTP 헤더와 쿠키 메커니즘을 활용하면 그 위에서 stateful한 세션을 만들 수 있습니다. 이 분리가 HTTP의 단순함과 애플리케이션의 유연함을 동시에 가능하게 합니다.

이 stateless 설계는 서버 확장에도 유리합니다 — 클라이언트의 N번째 요청이 첫 요청과 같은 서버에 가지 않아도 됩니다. 세션 정보를 모든 서버가 공유하는 저장소(Redis 등)에 두면, 어느 서버가 처리해도 동일한 세션 인식이 가능합니다.

AI Annotation 보충: 세션은 애플리케이션 레벨에서 쿠키, hidden 변수 등으로 구현합니다. HTTP가 제공하는 기능이 아니라 그 위에서 만들어낸 것 — 이 구분을 명확히 가져가는 게 중요합니다. HTTP/Cookie/Application의 각 책임을 분리해서 보면 보안 설계도 정확해집니다.
