# HTTP/1.0의 조건부 GET 요청은 어떤 문제를 해결했으며, 어떤 한계가 있었는가?

> HTTP/1.0 added headers to manage resources cached by a client in order to allow conditional GET requests.
> A server must return the entire content of the requested resource only if its last modified time is not known by the client or if it changed since the last full response to a GET request.
> Header Content-Encoding was added to specify whether the returned content is compressed.
> If the size of the content is not known in advance (i.e. because it is dynamically generated) then the header Content-Length would not be included.
> The client would assume that transfer was complete when the connection closed, but a premature close would leave the client with partial content yet the client would not know it's partial.

---

**도입**

이미지 1MB짜리 한 번 다운로드한 뒤 같은 페이지를 새로고침할 때 — 다시 1MB를 받아오는 건 낭비입니다. 변경되지 않았다면 서버가 "변경 없음, 캐시 그대로 써"라고만 알려주면 됩니다. 이걸 가능하게 한 게 HTTP/1.0의 조건부 GET이고, 동시에 동적 콘텐츠 처리에서 한계도 드러냈습니다.

---

**본문**

> HTTP/1.0 added headers to manage resources cached by a client in order to allow conditional GET requests.

HTTP/1.0은 조건부 GET 요청을 가능하게 하기 위해 클라이언트가 캐시한 리소스를 관리하는 헤더를 추가했다.

- **conditional GET**: "조건이 맞을 때만 데이터를 받겠다"는 GET. "내가 가진 캐시가 최신이면 안 보내도 돼" 같은 조건.
- **manage resources cached by a client**: 클라이언트의 캐시 상태를 서버에게 알려서 서버가 적절히 응답할 수 있게 함.

> A server must return the entire content of the requested resource only if its last modified time is not known by the client or if it changed since the last full response to a GET request.

서버는 클라이언트가 마지막 수정 시간을 모르거나, 마지막 GET 응답 이후 리소스가 변경된 경우에만 전체 콘텐츠를 반환해야 한다.

- **last modified time is not known**: 클라이언트가 처음 요청하는 경우. 비교 기준이 없으니 전체 전송.
- **changed since the last full response**: 클라이언트가 가진 버전 이후 서버에서 변경됐다면 전체 전송. `If-Modified-Since` 헤더로 비교.
- **only if**: 위 두 조건 외에는 전체 전송 안 함. 변경 없음이면 `304 Not Modified` 응답으로 본문 없이 끝.

> Header Content-Encoding was added to specify whether the returned content is compressed.

`Content-Encoding` 헤더가 추가되어 반환된 콘텐츠가 압축되었는지를 명시한다.

- **Content-Encoding**: 인코딩(주로 압축)을 명시. 예: `gzip`, `br`(brotli), `deflate`.
- **compressed**: 압축. 텍스트 응답을 50~80% 줄여 트래픽 절감 — 같은 페이지를 더 빠르게 받을 수 있게 됨.

> If the size of the content is not known in advance (i.e. because it is dynamically generated) then the header Content-Length would not be included.

콘텐츠 크기를 미리 알 수 없으면(즉 동적으로 생성되는 경우) `Content-Length` 헤더는 포함되지 않는다.

- **not known in advance**: 사전에 알 수 없음. DB에서 결과를 가져와 JSON을 만드는 식이면 응답 시작 전엔 크기 미정.
- **dynamically generated**: 동적 생성. 정적 파일이 아니라 매 요청마다 만들어지는 응답.
- **Content-Length would not be included**: 크기를 모르니 헤더에 못 적음. 이게 다음 문장의 문제를 만듭니다.

> The client would assume that transfer was complete when the connection closed,

클라이언트는 연결이 닫히면 전송이 완료됐다고 가정한다.

- **assume that transfer was complete**: 가정. `Content-Length`가 없으니 "어디까지가 끝인지" 다른 단서가 없어, 연결 종료를 끝 신호로 받아들임.
- **when the connection closed**: HTTP/1.0은 응답 후 연결을 닫으므로 종료 = 응답 끝.

> but a premature close would leave the client with partial content yet the client would not know it's partial.

하지만 비정상적으로 일찍 연결이 닫히면 클라이언트는 일부 콘텐츠만 가지게 되지만, 그게 일부라는 사실을 알 수 없다.

- **premature close**: 비정상적 조기 종료. 네트워크 끊김, 서버 크래시, 프록시 타임아웃 등.
- **partial content**: 응답이 잘려 일부만 도착. 예: JSON이 중간에서 끊김.
- **would not know it's partial**: 클라이언트가 잘렸다는 걸 알 수 없음. 끝까지 잘 왔다고 착각하고 진행 → 데이터 손상.

---

**종합**

조건부 GET이 가져온 이득과 한계를 정리하면:

| 측면 | 효과 | 메커니즘 |
|---|---|---|
| 트래픽 절감 | 변경 없으면 본문 안 받음 | `If-Modified-Since` + `304 Not Modified` |
| 압축 | 텍스트 응답 50~80% 절감 | `Content-Encoding: gzip` |
| 한계 1 | 동적 콘텐츠는 `Content-Length` 못 적음 | 크기를 미리 모르니까 |
| 한계 2 | 조기 종료 시 부분 콘텐츠 감지 불가 | 종료 = 끝 가정의 취약점 |

JS 개발자에게 와닿는 시나리오:

```js
// fetch가 완료되었지만 사실 응답이 잘렸다면?
const res = await fetch('/api/long-list');
const data = await res.json();  // 파싱 에러? 아니면 잘린 채 통과?
```

HTTP/1.0의 한계로는 클라이언트가 "잘림"을 감지할 수 없었고, 이는 데이터 무결성 문제로 이어졌습니다. HTTP/1.1이 chunked transfer encoding을 도입해 — 각 청크의 크기를 명시하고, 크기 0인 종료 마커 청크로 "정상 종료"를 알리도록 해서 이 문제를 해결했습니다.

이게 없으면 어떻게 되는가: 조건부 GET이 없었다면 — 매 새로고침마다 같은 이미지·CSS·JS를 다시 다운로드해야 했을 것입니다. 페이지 로드는 매번 처음부터, 트래픽은 폭증, 모바일 데이터 요금 부담 — 웹의 사용성이 지금과 비교할 수 없이 나빴을 것입니다. 조건부 GET이 캐시 없는 인터넷을 캐시 있는 인터넷으로 바꿨습니다.

오개념 예방: `304 Not Modified` 응답을 받았다고 해서 "리소스가 변경되지 않았다"고 100% 보장되지는 않습니다. `Last-Modified` 시간 비교의 한계 때문 — 같은 초 안에 두 번 변경되면 첫 번째 변경을 놓칠 수 있습니다. 그래서 HTTP/1.1이 `ETag`를 도입해 콘텐츠 해시 기반 비교를 가능하게 했습니다.

AI Annotation 보충: 조건부 GET의 핵심은 "리소스가 변경되지 않았으면 서버가 전체 콘텐츠를 다시 보내지 않는다 (304 Not Modified)"입니다. 하지만 동적 콘텐츠는 크기를 미리 알 수 없어 `Content-Length`가 빠지고, 연결이 비정상 종료되면 클라이언트가 불완전한 콘텐츠를 완전하다고 착각하는 문제가 있었습니다 — 이는 HTTP/1.1의 chunked encoding이 해결한 영역입니다.
