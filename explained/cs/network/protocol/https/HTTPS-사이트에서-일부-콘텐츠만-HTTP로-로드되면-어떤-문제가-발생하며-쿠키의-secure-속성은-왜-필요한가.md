# HTTPS 사이트에서 일부 콘텐츠만 HTTP로 로드되면 어떤 문제가 발생하며, 쿠키의 secure 속성은 왜 필요한가?

> For HTTPS to be effective, a site must be completely hosted over HTTPS.
> If some of the site's contents are loaded over HTTP (scripts or images, for example), or if only a certain page that contains sensitive information, such as a log-in page, is loaded over HTTPS while the rest of the site is loaded over plain HTTP, the user will be vulnerable to attacks and surveillance.
> Additionally, cookies on a site served through HTTPS must have the secure attribute enabled.
> On a site that has sensitive information on it, the user and the session will get exposed every time that site is accessed with HTTP instead of HTTPS.

---

**도입**

페이지가 HTTPS인데 그 안의 이미지 하나가 HTTP로 로드되면 — 자물쇠가 깨진 상태가 됩니다. 이를 mixed content라고 하고, 보기엔 작은 문제 같지만 보안적으로는 큰 구멍입니다. 마찬가지로 쿠키에 `Secure` 속성이 없으면 — HTTPS로 받은 세션이 HTTP 요청에 평문으로 첨부되어 노출. 이런 부분 보호의 함정들을 짚습니다.

---

**본문**

> For HTTPS to be effective, a site must be completely hosted over HTTPS.

HTTPS가 효과적이려면 사이트가 완전히 HTTPS로 호스팅되어야 한다.

- **completely hosted over HTTPS**: 완전히 HTTPS로 호스팅. 메인 페이지뿐 아니라 그 안의 모든 리소스가 HTTPS여야 함.

> If some of the site's contents are loaded over HTTP (scripts or images, for example),

사이트 콘텐츠 일부가 HTTP로 로드된다면 (예를 들어 스크립트나 이미지).

- **scripts or images**: 스크립트나 이미지. JS는 가장 위험, 이미지는 상대적으로 덜 위험하지만 그래도 문제.
- **loaded over HTTP**: HTTP로 로드. mixed content 상태.

> or if only a certain page that contains sensitive information, such as a log-in page, is loaded over HTTPS while the rest of the site is loaded over plain HTTP,

또는 로그인 페이지처럼 민감 정보가 있는 특정 페이지만 HTTPS로 로드되고 나머지 사이트는 평문 HTTP로 로드된다면.

- **only a certain page... is loaded over HTTPS**: 특정 페이지만 HTTPS. 한때 흔했던 패턴 — "로그인만 HTTPS, 나머지는 HTTP".
- **rest of the site is loaded over plain HTTP**: 나머지는 평문. 로그인 후 세션 쿠키가 평문 HTTP 요청마다 노출.

> the user will be vulnerable to attacks and surveillance.

사용자는 공격과 감시에 취약해진다.

- **vulnerable**: 취약. mixed content가 한 군데만 있어도 전체 보안이 깨짐.
- **attacks and surveillance**: 공격과 감시. 세션 탈취·도청·트래픽 분석 등.

> Additionally, cookies on a site served through HTTPS must have the secure attribute enabled.

또한 HTTPS로 제공되는 사이트의 쿠키는 `secure` 속성이 활성화되어야 한다.

- **secure attribute**: `Secure` 속성. 쿠키가 HTTPS 연결에서만 전송되도록 제한.
- **must**: 필수. HTTPS 사이트의 쿠키엔 반드시 있어야.

> On a site that has sensitive information on it, the user and the session will get exposed every time that site is accessed with HTTP instead of HTTPS.

민감 정보가 있는 사이트에서 HTTPS 대신 HTTP로 접속할 때마다 사용자와 세션이 노출된다.

- **every time**: 매번. 한 번이라도 HTTP로 접속하면 그 순간 모든 쿠키 평문 노출.
- **exposed**: 노출됨. 세션 ID 도청 → 세션 하이재킹 가능.

---

**종합**

HTTPS의 부분 보호가 만드는 두 가지 구멍:

| 구멍 | 원인 | 결과 |
|---|---|---|
| Mixed Content | HTTPS 페이지 안의 HTTP 리소스 | 스크립트 변조, 이미지 추적 |
| 평문 쿠키 | `Secure` 속성 누락 | HTTP 요청에서 세션 쿠키 평문 노출 |

**Mixed Content의 위험**

```html
<!-- HTTPS 페이지 -->
<html>
  <head>
    <script src="http://cdn.example.com/lib.js"></script>  <!-- HTTP! -->
  </head>
  <body>
    ...
  </body>
</html>
```

이 한 줄 때문에:

- 공격자가 lib.js를 변조해 악성 스크립트로 교체 가능
- 그 악성 스크립트는 HTTPS 페이지 안에서 실행되므로 — 페이지의 모든 데이터 접근 가능
- 사용자가 입력한 비밀번호, 세션 쿠키 등을 외부로 전송 가능

브라우저의 보호 — 모던 브라우저는 mixed content 중 위험한 것(스크립트, 폰트 등 active content)을 자동 차단합니다:

- **Active content** (JS, CSS, iframe, 폰트): 자동 차단 (콘솔에 에러)
- **Passive content** (이미지, 비디오): 경고만 표시, 로드는 함

DevTools Console에서 mixed content 경고:

```
Mixed Content: The page at 'https://example.com/' was loaded over HTTPS, 
but requested an insecure script 'http://cdn.example.com/lib.js'. 
This request has been blocked; the content must be served over HTTPS.
```

수정 방법:

```html
<!-- 1. 명시적 HTTPS -->
<script src="https://cdn.example.com/lib.js"></script>

<!-- 2. 프로토콜 상대 URL (현재 페이지 프로토콜 따름) -->
<script src="//cdn.example.com/lib.js"></script>

<!-- 3. 자체 도메인 사용 -->
<script src="/static/lib.js"></script>
```

CSP(Content Security Policy)로 강제:

```
Content-Security-Policy: upgrade-insecure-requests
```

이 헤더가 있으면 — HTTP 리소스를 자동으로 HTTPS로 업그레이드해 요청. mixed content 자동 방지.

**쿠키의 Secure 속성**

```
Set-Cookie: sessionId=abc123                              ← 위험! HTTP에서도 전송됨
Set-Cookie: sessionId=abc123; Secure                      ← HTTPS에서만 전송
Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict   ← 권장
```

Secure 속성이 없으면:

```
사용자가 https://example.com 에 로그인 (HTTPS로 세션 쿠키 받음)
→ 그 후 http://example.com/some-page 에 실수로 접속
→ 브라우저가 sessionId 쿠키를 HTTP 요청에 자동 첨부 (Secure 없으니까)
→ 평문으로 전송되어 도청 가능
→ 공격자가 세션 ID로 사용자 행세 (세션 하이재킹)
```

JS에서 쿠키 설정 시 (서버 측 Express 예):

```js
// 서버에서 쿠키 설정
res.cookie('sessionId', 'abc123', {
  secure: true,           // HTTPS 전용
  httpOnly: true,         // JS에서 읽기 불가 (XSS 방어)
  sameSite: 'strict'      // CSRF 방어
});
// 결과 헤더: Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict
```

이게 없으면 어떻게 되는가:

- mixed content가 허용되면 — HTTPS 페이지의 모든 보안이 가장 약한 HTTP 리소스 수준으로 떨어짐. 한 줄의 HTTP 스크립트 = HTTPS 무력화.
- Secure 쿠키 속성이 없다면 — 한 번이라도 HTTP 접속 시 세션 노출. 사용자가 부주의하게 `http://`로 접속하는 것을 막을 수 없으므로 — 쿠키 자체에 보호 장치 필요.

오개념 예방: "내 사이트는 HTTPS만 쓰니까 Secure 속성 안 붙여도 되겠지"는 잘못. 사용자가 직접 `http://`를 입력하거나, HSTS 활성화 전 첫 방문하거나, 브라우저 캐시 문제로 HTTP로 접속하는 등 — 의도치 않은 HTTP 요청이 발생할 수 있습니다. Secure 속성은 "혹시라도 HTTP로 접속하면 쿠키 안 보내겠다"는 안전장치.

또 다른 오개념: "이미지 mixed content는 안 위험하다"는 부분적으로만 맞음. 이미지 자체로 코드 실행은 안 되지만 — 공격자가 이미지를 변조해 사용자 추적 픽셀을 끼우거나, 이미지 메타데이터에 정보를 숨길 수 있음. 또한 Referer 헤더가 HTTP 요청에 노출되어 사용자가 보던 HTTPS 페이지 URL이 평문으로 도청 가능.

AI Annotation 보충: Mixed content 문제 — 스크립트가 HTTP로 로드되면 공격자가 스크립트를 변조하여 HTTPS 페이지의 데이터를 탈취할 수 있습니다. 쿠키의 `Secure` 속성이 없으면 HTTP 연결에서도 쿠키가 전송되어, HTTPS로 보호한 세션 정보가 평문으로 노출됩니다.
