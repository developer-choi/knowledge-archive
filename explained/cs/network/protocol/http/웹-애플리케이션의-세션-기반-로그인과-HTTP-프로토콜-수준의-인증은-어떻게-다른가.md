# 웹 애플리케이션의 세션 기반 로그인과 HTTP 프로토콜 수준의 인증은 어떻게 다른가?

> Typically, to start a session, an interactive login is performed, and to end a session, a logout is requested by the user.
> These kind of operations use a custom authentication mechanism, not HTTP authentication.
> HTTP provides multiple authentication schemes such as basic access authentication and digest access authentication which operate via a challenge-response mechanism whereby the server identifies and issues a challenge before serving the requested content.
> The authentication mechanisms described above belong to the HTTP protocol and are managed by client and server HTTP software (if configured to require authentication before allowing client access to one or more web resources), and not by the web applications using an application session.

---

**도입**

"로그인"이라고 말할 때 두 가지 다른 것이 있습니다 — 하나는 우리가 매일 쓰는 웹 폼 로그인(쿠키, JWT), 다른 하나는 브라우저가 갑자기 띄우는 "User Name / Password" 다이얼로그(Basic/Digest). 둘 다 같은 목적이지만 동작 계층이 다릅니다 — 전자는 애플리케이션 레벨, 후자는 HTTP 프로토콜 레벨.

---

**본문**

> Typically, to start a session, an interactive login is performed, and to end a session, a logout is requested by the user.

보통 세션을 시작하려면 대화형 로그인이 수행되고, 세션을 종료하려면 사용자가 로그아웃을 요청한다.

- **interactive login**: 대화형 로그인. 사용자가 폼에 ID/PW 입력하고 제출. 서버가 폼 데이터를 받아 검증.
- **start a session / end a session**: 세션 시작·종료. 애플리케이션이 명시적으로 관리하는 시작점과 끝점.

> These kind of operations use a custom authentication mechanism, not HTTP authentication.

이런 종류의 동작들은 HTTP 인증이 아닌 커스텀 인증 메커니즘을 사용한다.

- **custom authentication mechanism**: 커스텀 인증. 표준 HTTP가 정한 게 아니라 애플리케이션이 자기 방식으로 만든 것.
- **not HTTP authentication**: HTTP 인증이 아님. 폼 로그인은 HTTP 표준의 인증 방식이 아니라 그 위 애플리케이션 로직.

> HTTP provides multiple authentication schemes such as basic access authentication and digest access authentication

HTTP는 basic 접근 인증과 digest 접근 인증 같은 여러 인증 방식을 제공한다.

- **basic access authentication**: 가장 단순한 HTTP 인증. ID:PW를 Base64로 인코딩해 `Authorization: Basic ...` 헤더로 전송. HTTPS 위에서만 안전.
- **digest access authentication**: 패스워드 해시를 사용하는 더 안전한 방식. 평문 PW 전송 안 함.

> which operate via a challenge-response mechanism whereby the server identifies and issues a challenge before serving the requested content.

이 방식들은 challenge-response 메커니즘으로 동작하며, 서버가 콘텐츠를 제공하기 전에 식별하고 challenge를 발행한다.

- **challenge-response**: 서버가 먼저 "증명해 봐"라는 도전(challenge)을 보내고, 클라이언트가 응답(response)으로 자격증명을 제공.
- **issues a challenge before serving**: 콘텐츠 제공 전에 challenge. 즉, 인증 안 된 요청에 대해 서버가 `401 Unauthorized` + `WWW-Authenticate` 헤더로 "인증 필요"를 알림. 브라우저가 이를 받으면 사용자에게 다이얼로그를 띄움.

> The authentication mechanisms described above belong to the HTTP protocol and are managed by client and server HTTP software

위에서 설명한 인증 메커니즘은 HTTP 프로토콜에 속하며, 클라이언트와 서버의 HTTP 소프트웨어가 관리한다.

- **belong to the HTTP protocol**: HTTP 프로토콜의 일부. 표준이 명시한 인증 방식.
- **client and server HTTP software**: 브라우저와 웹서버. 웹 애플리케이션 코드가 아니라 그 아래 인프라 레벨 — Apache, nginx 설정으로 활성화하면 브라우저가 자동으로 다이얼로그를 띄움.

> (if configured to require authentication before allowing client access to one or more web resources), and not by the web applications using an application session.

(특정 웹 리소스에 클라이언트가 접근하기 전 인증을 요구하도록 설정된 경우), 애플리케이션 세션을 사용하는 웹 애플리케이션이 관리하는 게 아니다.

- **if configured**: 설정한 경우에만. nginx의 `auth_basic` 같은 설정이 있어야 활성화.
- **not by the web applications**: 애플리케이션이 아닌 웹 서버 미들웨어가 처리. 애플리케이션 코드는 인증된 사용자가 들어왔을 때 동작.

---

**종합**

두 방식의 비교:

| 항목 | 세션 기반 로그인 (커스텀) | HTTP 인증 (Basic/Digest) |
|---|---|---|
| 관리 주체 | 웹 애플리케이션 | HTTP 소프트웨어 (서버, 브라우저) |
| 동작 계층 | 애플리케이션 | 프로토콜 |
| UI | 사이트가 디자인한 폼 | 브라우저 기본 다이얼로그 |
| 인증 정보 전달 | 쿠키, JWT, Authorization 등 자유 | `Authorization: Basic/Digest ...` 헤더 |
| 로그아웃 | 명시적 (세션 무효화) | 어려움 (브라우저가 캐시) |
| 사용 비율 | 거의 모든 웹 서비스 | 내부 도구, 단순 보호된 디렉토리 |

JS 개발자가 일상적으로 만지는 건 세션 기반:

```js
// 폼 로그인 — 애플리케이션이 모든 걸 제어
const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, password })
});
// 서버가 Set-Cookie: sessionId=... 응답
```

HTTP 인증은 가끔 마주칩니다 — 회사 내부 도구, 단순 보호된 정적 사이트:

```http
GET /admin HTTP/1.1
Host: example.com
                                    ← 인증 헤더 없음

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="Admin"
                                    ← 브라우저가 다이얼로그 자동 표시
```

이게 없으면 어떻게 되는가:

- HTTP 인증만 있고 세션 기반이 없었다면 — 모든 사이트가 못생긴 브라우저 다이얼로그를 써야 함. UX 디자인 거의 불가능. 로그아웃 버튼도 못 만들어요(브라우저가 자격증명 캐시).
- 세션 기반만 있고 HTTP 인증이 없었다면 — 단순 정적 디렉토리 보호도 애플리케이션 코드 작성 필요. nginx 한 줄 설정으로 해결되던 것을 PHP/Node 코드로 짜야 함.

오개념 예방: 폼 로그인 후 `Authorization: Bearer <jwt>` 헤더를 쓰는 건 "HTTP 인증을 사용하는 것"이 아닙니다. HTTP 표준이 정한 Bearer 스킴을 차용하는 것은 맞지만, 토큰 발급·검증·만료 관리는 애플리케이션이 합니다 — 즉 "Authorization 헤더라는 표준 형식을 빌려쓰는 커스텀 인증"입니다.

AI Annotation 보충: 세션 기반 로그인은 웹 애플리케이션이 관리하는 커스텀 인증입니다. HTTP 인증(Basic/Digest)은 프로토콜 레벨에서 HTTP 소프트웨어(웹서버, 브라우저)가 관리하며, 서버가 먼저 challenge를 보내고 클라이언트가 인증 정보로 응답하는 challenge-response 방식입니다. 대부분의 현대 웹앱은 전자(세션 기반)를 사용합니다.
