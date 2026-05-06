# HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?

> A header field represents metadata about the containing message.
> A header field line is formatted as a name-value pair with a colon separator.
> Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.
> Unlike a method name that must match exactly (case-sensitive), a header field name is matched ignoring case although often shown with each word capitalized.

---

**도입**

`fetch('/api', { headers: { 'Content-Type': 'application/json' } })` 한 줄에 등장하는 `Content-Type`이 헤더 필드입니다. 메시지의 본문이 무엇인지·어떻게 처리할지·누가 보냈는지 같은 메타정보를 키-값 쌍으로 표현합니다. 이 단순한 형식 규칙이 HTTP 메시지의 거의 모든 부가 정보를 담아냅니다.

---

**본문**

> A header field represents metadata about the containing message.

헤더 필드는 그 메시지에 대한 메타데이터를 나타낸다.

- **header field**: 한 줄짜리 키-값 쌍. `Content-Type: application/json`이 한 헤더 필드.
- **metadata about the containing message**: 메시지 자체에 대한 정보. 본문이 무엇인지, 어떻게 인코딩됐는지, 캐시 정책은 무엇인지 등 — 본문과 별도의 부가 정보.

> A header field line is formatted as a name-value pair with a colon separator.

헤더 필드 라인은 콜론을 구분자로 한 이름-값 쌍으로 포맷된다.

- **name-value pair**: 이름과 값의 쌍. 키-값 구조.
- **colon separator**: 콜론(`:`)이 둘을 가름. `Content-Type: application/json` — 콜론 왼쪽이 이름, 오른쪽이 값.

> Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.

이름 주변에는 공백이 허용되지 않지만, 값 부분의 앞뒤 공백은 무시된다.

- **whitespace not allowed around the name**: 이름 앞뒤로 공백 금지. `Content-Type :`처럼 콜론 앞에 공백을 두면 무효.
- **leading and trailing whitespace is ignored for the value**: 값의 앞뒤 공백은 파서가 알아서 잘라냄. `Content-Type:   application/json`도 정상으로 처리.

> Unlike a method name that must match exactly (case-sensitive),

메서드 이름은 정확히 일치해야 하는(대소문자 구분) 것과 다르게.

- **method name**: GET, POST, PUT 같은 메서드. `get`은 정상 동작 안 함, 반드시 `GET`.
- **case-sensitive**: 대소문자 구분. 메서드는 무조건 대문자 표준.

> a header field name is matched ignoring case although often shown with each word capitalized.

헤더 필드 이름은 대소문자를 무시하고 매칭되며, 다만 각 단어를 대문자로 시작하는 형태로 자주 표시된다.

- **matched ignoring case**: 매칭 시 대소문자 무시. `Content-Type`과 `content-type`과 `CONTENT-TYPE` 모두 같은 헤더로 처리.
- **shown with each word capitalized**: 표시할 땐 단어 첫 글자 대문자(Title-Case) 관습. `Content-Type`, `User-Agent`, `Cache-Control`. 단순 관행이라 강제는 아님.

---

**종합**

헤더 필드의 형식 규칙을 정리하면:

| 규칙 | 예 (정상) | 예 (이상하지만 동작) |
|---|---|---|
| `이름: 값` | `Content-Type: application/json` | — |
| 이름 주변 공백 금지 | `Content-Type:` | `Content-Type :` (틀림) |
| 값 앞뒤 공백 허용 | `Content-Type: application/json` | `Content-Type:   application/json   ` (정상) |
| 이름 대소문자 무시 | `Content-Type` | `content-type`, `CONTENT-TYPE` 모두 같음 |
| 표시 관행 | `Content-Type` | `content-type` (덜 흔함) |

JS 코드에서 헤더를 다룰 때:

```js
// 보낼 때 — 어떤 케이스든 가능
fetch('/api', {
  headers: {
    'content-type': 'application/json',     // 소문자
    'X-Custom-Header': 'value',             // Title-Case
    'AUTHORIZATION': `Bearer ${token}`      // 대문자
  }
});
// 서버는 모두 동일하게 인식
```

```js
// 받을 때 — 대소문자 무시 매칭
const res = await fetch('/api');
res.headers.get('content-type');      // 동작
res.headers.get('Content-Type');      // 동작 (같은 값)
res.headers.get('CONTENT-TYPE');      // 동작 (같은 값)
```

HTTP/2부터는 헤더 이름이 모두 소문자로 인코딩되도록 표준이 정해져서 — 실제 와이어에선 항상 소문자입니다. DevTools가 보여주는 헤더가 HTTP/2 응답에서 소문자인 이유.

이게 없으면 어떻게 되는가:

- 키-값 쌍이라는 단순 형식이 없었다면 — 각 헤더마다 자기 파싱 규칙이 필요해 새 헤더 추가가 어려웠을 것. 키-값은 누구나 이해하는 보편 구조라 새 헤더 도입이 쉬움.
- 대소문자 무시가 없었다면 — `Content-Type`과 `content-type`이 다른 헤더로 취급되어 호환성 문제 빈발. 클라이언트마다 다른 케이스를 쓸 수 있으니까.

오개념 예방: 헤더 이름은 대소문자 무시이지만 — 헤더 값은 대소문자가 의미를 가질 수 있습니다. 예: `Content-Type: application/JSON`은 `application/json`과 다르게 인식될 수 있어요(MIME 타입은 보통 소문자 표준). 이름과 값의 규칙이 다르다는 점 주의.

AI Annotation 보충: 헤더 필드는 `이름: 값` 형태의 메타데이터입니다 (예: `Content-Type: application/json`). 메서드 이름(GET, POST)은 대소문자를 구분하지만, 헤더 필드 이름은 대소문자를 구분하지 않습니다. `Content-Type`과 `content-type`은 동일하게 처리됩니다 — 이 비대칭이 HTTP의 작은 함정 중 하나.
