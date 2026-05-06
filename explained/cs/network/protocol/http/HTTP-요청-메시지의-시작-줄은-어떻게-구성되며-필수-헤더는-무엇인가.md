# HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?

> A request is sent by a client to a server.
> The start line includes a method name, a request URI and the protocol version with a single space between each field.
> Request header fields allow the client to pass additional information beyond the request line, acting as request modifiers.
> In the HTTP/1.1 protocol, all header fields except Host are optional.

---

**도입**

`fetch('/api/users', { method: 'GET' })` 한 줄이 실제로 네트워크에 흐를 때 어떤 모양이 되는지 봅시다. 가장 윗줄에 `GET /api/users HTTP/1.1`이 있고 그 아래 헤더가 이어집니다. 이 첫 줄이 시작 줄(start line)이고 — 메서드, 경로, 버전 세 정보가 공백으로 구분되어 있습니다.

---

**본문**

> A request is sent by a client to a server.

요청은 클라이언트가 서버로 보낸다.

- **request**: 요청 메시지. 클라이언트가 시작점.
- **client to a server**: 클라이언트 → 서버 단방향. 클라이언트-서버 모델의 기본.

> The start line includes a method name, a request URI and the protocol version with a single space between each field.

시작 줄은 메서드 이름, 요청 URI, 프로토콜 버전을 포함하며, 각 필드 사이에 단일 공백이 있다.

- **start line**: 요청 메시지의 첫 줄. 모든 요청은 이 한 줄로 자신을 소개.
- **method name**: GET, POST, PUT 등. 무엇을 하려는지.
- **request URI**: 어느 리소스에 대해. 예: `/api/users`, `/index.html`.
- **protocol version**: HTTP 버전. `HTTP/1.1`, `HTTP/2.0`.
- **single space**: 단일 공백으로 구분. `GET /api/users HTTP/1.1` — 정확히 한 칸씩.

> Request header fields allow the client to pass additional information beyond the request line, acting as request modifiers.

요청 헤더 필드는 클라이언트가 요청 라인 외에 추가 정보를 전달할 수 있게 해주며, 요청 수정자(modifier) 역할을 한다.

- **additional information beyond the request line**: 시작 줄에 다 못 담는 정보. 인증 토큰, 받기 원하는 형식, 쿠키 등.
- **request modifiers**: 요청 수정자. 같은 메서드+URI라도 헤더에 따라 응답이 달라짐 — 예: `Accept: application/json`이면 JSON 응답, `Accept: text/html`이면 HTML 응답.

> In the HTTP/1.1 protocol, all header fields except Host are optional.

HTTP/1.1 프로토콜에서는 `Host`를 제외한 모든 헤더 필드가 선택적이다.

- **all header fields except Host are optional**: `Host`만 필수, 나머지 모두 선택. 다른 헤더 없이도 요청은 성립.
- **Host**: 어느 도메인의 리소스인지. HTTP/1.1의 가상 호스팅(한 IP에 여러 도메인) 때문에 필수가 됨.

---

**종합**

HTTP 요청 메시지의 구조:

```
┌─────────────────────────────────────────────────────┐
│ GET   /api/users   HTTP/1.1     ← 시작 줄          │
│ ├─메서드 ├─URI    ├─버전                            │
├─────────────────────────────────────────────────────┤
│ Host: api.example.com           ← 필수             │
│ Accept: application/json        ← 선택 (수정자)    │
│ Authorization: Bearer ...       ← 선택             │
│ User-Agent: Mozilla/5.0         ← 선택             │
├─────────────────────────────────────────────────────┤
│ (빈 줄 — 헤더 끝)                                  │
├─────────────────────────────────────────────────────┤
│ (본문 — GET은 보통 비어있음, POST는 데이터)         │
└─────────────────────────────────────────────────────┘
```

JS 코드와 매핑:

```js
const res = await fetch('https://api.example.com/api/users', {
  method: 'GET',                              // ← 시작 줄의 메서드
  // URI는 URL에서 추출됨 (/api/users)
  // 버전은 브라우저가 자동 결정 (HTTP/1.1, HTTP/2 등)
  headers: {
    // Host는 브라우저가 자동 추가 (api.example.com)
    'Accept': 'application/json',             // ← 요청 수정자
    'Authorization': `Bearer ${token}`,
  }
});
```

브라우저 DevTools Network 탭에서 한 요청을 클릭 → Headers 탭 → "Request Headers"에서 위 모양을 그대로 볼 수 있습니다.

`Host`가 필수인 이유: HTTP/1.0 시절엔 IP 1개 = 사이트 1개였습니다. 서버는 자기 IP로 들어온 요청이 누구에게 가는지 명확. HTTP/1.1부터 한 IP에 여러 도메인을 호스팅(가상 호스팅, virtual hosting)할 수 있게 되면서 — 같은 IP의 80번 포트로 들어온 요청이 `example.com`인지 `blog.example.com`인지 알아야 했습니다. `Host` 헤더가 그 답을 줍니다.

이게 없으면 어떻게 되는가:

- 시작 줄이 없다면 — 한 메시지의 시작점을 알 수 없어 파이프라이닝/멀티플렉싱이 불가능. 시작 줄 한 줄로 "여기서 새 요청 시작"을 알림.
- `Host` 헤더가 없다면 — 가상 호스팅이 불가능. AWS/Cloudflare 같은 멀티테넌트 호스팅이 성립 안 됨. 모든 사이트가 자기 전용 IP를 가져야 함 (IPv4 고갈 가속).

오개념 예방: HTTP/2부터는 시작 줄이 없습니다 — 대신 pseudo-header `:method`, `:path`, `:scheme`, `:authority`가 같은 정보를 담습니다. 의미는 같지만 형식이 바이너리 프레임으로 바뀐 것. `Host` 헤더의 역할도 `:authority` pseudo-header가 대체합니다.

Official Annotation 보충: 요청은 다음 요소들로 구성됩니다 — HTTP 메서드(보통 GET, POST 같은 동사 또는 OPTIONS, HEAD 같은 명사로 클라이언트가 수행하려는 동작 정의), 가져올 리소스 경로(프로토콜·도메인·포트가 빠진 URL), HTTP 프로토콜 버전, 서버에 추가 정보를 전달하는 선택적 헤더, 일부 메서드(POST 등)에 한해 리소스를 담은 본문.

AI Annotation 보충: `Host`만 필수인 이유는 하나의 IP에 여러 도메인이 호스팅될 수 있어서(가상 호스팅), 어느 도메인에 대한 요청인지 명시해야 하기 때문입니다. 그 외 헤더는 모두 선택입니다 — `Accept`도 없으면 서버가 기본 형식으로 응답합니다.
