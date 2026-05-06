# HTTP 메시지의 기본 구조는 어떻게 구성되는가?

> At the highest level, a message consists of a header followed by a body.
> A header consists of lines of ASCII text; each terminated with a carriage return and line feed sequence.
> A body consists of data in any format; not limited to ASCII.
> The format must match that specified by the Content-Type header field if the message contains one.
> A body is optional or, in other words, can be blank.

---

**도입**

Chrome DevTools Network 탭에서 한 요청을 클릭하면 Headers, Payload, Response 같은 섹션이 보입니다. 이게 모두 HTTP 메시지의 일부입니다. 메시지 구조를 큰 그림으로 정리하면 — 헤더와 본문으로 나뉘고, 사이에 빈 줄이 경계입니다. 단순한 구조이지만 이 단순함이 30년 넘게 표준으로 살아남은 이유 중 하나입니다.

---

**본문**

> At the highest level, a message consists of a header followed by a body.

가장 큰 수준에서, 메시지는 헤더와 그 뒤를 따르는 본문으로 구성된다.

- **highest level**: 가장 큰 그림. 세부로 들어가면 헤더 안에 시작 줄·헤더 필드들이 있고 본문 안에 다양한 형식이 있지만, 외관은 헤더+본문 두 덩어리.
- **header followed by a body**: 헤더가 먼저, 본문이 뒤. 순서가 정해져 있어서 파서가 헤더를 다 읽으면 본문 시작점을 알 수 있음.

> A header consists of lines of ASCII text; each terminated with a carriage return and line feed sequence.

헤더는 ASCII 텍스트의 라인들로 구성되며, 각 라인은 CR(carriage return)과 LF(line feed) 시퀀스로 끝난다.

- **ASCII text**: HTTP/1.x의 헤더는 사람이 읽을 수 있는 텍스트. HTTP/2/3는 바이너리 프레임으로 인코딩하지만 의미상 동일한 내용.
- **lines**: 한 줄에 하나의 헤더 필드. `Content-Type: application/json`이 한 줄, `Authorization: Bearer ...`가 다음 줄.
- **carriage return and line feed (CR LF)**: `\r\n`. 줄 구분자. 두 번 연속(`\r\n\r\n`)이면 헤더 끝 + 본문 시작 신호.

> A body consists of data in any format; not limited to ASCII.

본문은 어떤 형식의 데이터든 포함할 수 있고, ASCII에 제한되지 않는다.

- **any format**: 모든 형식. JSON, HTML, 이미지(JPEG·PNG), 비디오(MP4), 바이너리 파일까지. 형식 제약 없음.
- **not limited to ASCII**: 헤더와 다르게 본문은 바이너리도 가능. PNG 이미지의 바이트 그대로 본문에 실림.

> The format must match that specified by the Content-Type header field if the message contains one.

본문이 있는 경우, 형식은 `Content-Type` 헤더 필드가 명시한 것과 일치해야 한다.

- **must match**: 일치해야 함. `Content-Type: application/json`인데 본문이 HTML이면 클라이언트가 파싱 실패.
- **Content-Type**: 본문의 MIME 타입을 알리는 헤더. 클라이언트는 이 값을 보고 본문을 어떻게 해석할지 결정 — `text/html`이면 렌더링, `application/json`이면 파싱.

> A body is optional or, in other words, can be blank.

본문은 선택적이며, 다시 말해 비어 있을 수 있다.

- **optional**: 있어도 되고 없어도 됨. GET 요청은 보통 본문 없음, `204 No Content` 응답은 본문 없음.
- **can be blank**: 비어 있을 수 있음. 헤더만으로 의미가 완결되는 메시지가 많음.

---

**종합**

HTTP 메시지의 시각적 구조:

```
┌─────────────────────────────────┐
│ 시작 줄 (Request/Status Line)   │
├─────────────────────────────────┤
│ Header Field 1: value           │
│ Header Field 2: value           │  ← 헤더 (ASCII 텍스트)
│ Header Field N: value           │
├─────────────────────────────────┤
│ (빈 줄 = \r\n\r\n)              │  ← 헤더와 본문의 경계
├─────────────────────────────────┤
│ Body (선택, 어떤 형식이든)       │  ← 본문 (바이너리 가능)
└─────────────────────────────────┘
```

실제 요청 예시:

```http
POST /api/users HTTP/1.1                       ← 시작 줄
Host: api.example.com                          ← 헤더 시작
Content-Type: application/json
Content-Length: 28
Authorization: Bearer eyJhbGc...
                                               ← 빈 줄 (헤더 끝)
{"name":"Alice","age":30}                       ← 본문 (JSON)
```

응답 예시:

```http
HTTP/1.1 200 OK                                ← 시작 줄
Content-Type: application/json
Content-Length: 50
                                               ← 빈 줄
{"id":123,"name":"Alice","createdAt":"2024-..."} ← 본문
```

JS 개발자가 만지는 부분:

```js
const res = await fetch('/api/users', {
  method: 'POST',
  headers: {                          // ← 헤더
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({              // ← 본문
    name: 'Alice', age: 30
  })
});

console.log(res.status);              // 시작 줄의 상태 코드
console.log(res.headers.get('content-type')); // 응답 헤더
const data = await res.json();        // 응답 본문 (Content-Type에 따라 파싱)
```

이게 없으면 어떻게 되는가: 헤더와 본문 사이의 빈 줄(`\r\n\r\n`) 경계가 없다면 — 파서가 어디까지 헤더이고 어디부터 본문인지 알 수 없습니다. 헤더는 길이가 가변적이라 사전에 알 수 없으므로 명시적 경계 마커가 필수입니다. 단순한 빈 줄이 이 역할을 우아하게 처리합니다.

오개념 예방: GET 요청도 본문을 가질 수 있긴 합니다(스펙상 금지가 아님). 하지만 `Content-Length`나 `Transfer-Encoding`이 없는 GET 본문은 많은 서버·프록시가 무시하므로 실무적으로는 GET 본문을 쓰지 않는 게 관례입니다.

AI Annotation 보충: 헤더는 시작 줄(Start line) → 헤더 필드들(0개 이상) → 빈 줄(헤더 끝 표시)의 구조입니다. 본문은 모든 형식이 가능하며(JSON, HTML, 이미지 등), `Content-Type` 헤더로 형식을 명시합니다. HTTP/2부터는 텍스트 표현 대신 바이너리 프레임으로 인코딩되지만 — 헤더와 본문의 의미상 구조는 동일하게 유지됩니다.
