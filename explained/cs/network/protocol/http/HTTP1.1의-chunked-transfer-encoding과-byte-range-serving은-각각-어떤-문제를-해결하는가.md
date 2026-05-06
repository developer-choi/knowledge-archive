# HTTP/1.1의 chunked transfer encoding과 byte range serving은 각각 어떤 문제를 해결하는가?

> Chunked transfer encoding allows content to be streamed in chunks in order to reliably send it even when the server does not know its length in advance (i.e. because it is dynamically generated, etc.).
> Byte range serving allows a client to request portions (ranges of bytes) of a resource.
> This is useful to resume an interrupted download (when a file is very large), when only a part of a content has to be shown or dynamically added to the already visible part by a browser in order to spare time, bandwidth and system resources, etc.

---

**도입**

HTTP/1.0의 두 가지 한계를 떠올려 보세요 — 동적 콘텐츠는 크기를 미리 못 알리고, 큰 파일을 다운로드하다 끊기면 처음부터 다시. HTTP/1.1은 이 둘을 각각 `Transfer-Encoding: chunked`와 `Range` 헤더로 해결했습니다. 둘 다 "한 번에 다 받지 않아도 되는" 메커니즘이지만 동기와 사용처가 다릅니다.

---

**본문**

> Chunked transfer encoding allows content to be streamed in chunks

chunked transfer encoding은 콘텐츠가 청크 단위로 스트리밍되도록 한다.

- **chunked transfer encoding**: 콘텐츠를 작은 조각(청크)으로 나누어 전송하는 방식. `Transfer-Encoding: chunked` 헤더로 활성화.
- **streamed in chunks**: 청크 단위 스트리밍. 큰 응답을 한 번에 다 만들고 보내는 게 아니라, 만드는 대로 흘려보냄.

> in order to reliably send it even when the server does not know its length in advance (i.e. because it is dynamically generated, etc.).

서버가 콘텐츠 길이를 미리 모를 때(즉 동적으로 생성될 때 등)에도 안정적으로 전송하기 위해서다.

- **reliably send**: 안정적 전송. 각 청크가 자기 크기를 명시하고, 크기 0인 청크가 종료 신호 — 클라이언트가 잘림 감지 가능.
- **does not know its length in advance**: 사전에 길이 모름. DB 쿼리 결과를 JSON으로 변환하는 동안엔 최종 크기가 미정.
- **dynamically generated**: 동적 생성. 매 요청마다 다른 응답을 만드는 API.

> Byte range serving allows a client to request portions (ranges of bytes) of a resource.

byte range serving은 클라이언트가 리소스의 일부(바이트 범위)를 요청할 수 있게 한다.

- **byte range serving**: 리소스의 특정 바이트 범위만 요청·응답하는 메커니즘. `Range: bytes=1000-2000` 헤더 사용.
- **portions (ranges of bytes)**: 일부분. 1MB 파일에서 500KB 지점부터 1MB 지점까지 — 같은 식으로 부분만 가져옴.

> This is useful to resume an interrupted download (when a file is very large),

이는 큰 파일의 다운로드가 중단됐을 때 이어받기에 유용하다.

- **resume an interrupted download**: 중단된 다운로드 이어받기. 100MB 중 70MB 받고 끊기면, 다음에 71MB부터 요청.
- **very large**: 매우 큰. 작은 파일은 처음부터 다시 받아도 부담 없지만 GB 단위면 이어받기가 필수.

> when only a part of a content has to be shown or dynamically added to the already visible part by a browser in order to spare time, bandwidth and system resources, etc.

또는 콘텐츠의 일부만 표시되어야 하거나 이미 보이는 부분에 동적으로 추가되어야 할 때, 시간·대역폭·시스템 자원을 아끼기 위해 사용된다.

- **only a part of a content**: 일부만. 비디오 스트리밍에서 "보고 있는 구간만" 다운로드하는 경우.
- **dynamically added to the already visible part**: 이미 보이는 부분에 추가. 예: 무한 스크롤로 이미지를 더 받아오기.
- **spare time, bandwidth and system resources**: 시간·대역폭·자원 절감. 다 다운로드 안 해도 되니까.

---

**종합**

두 메커니즘의 비교:

| 메커니즘 | 헤더 | 해결 문제 | 실무 예 |
|---|---|---|---|
| Chunked encoding | `Transfer-Encoding: chunked` | 서버가 크기를 모르고 보내야 함 | 스트리밍 API, SSE, 서버 응답 압축 |
| Byte range | 요청: `Range: bytes=N-M` / 응답: `Content-Range`, `206 Partial Content` | 리소스 일부만 받기 / 이어받기 | 비디오 스트리밍, 큰 파일 다운로드 |

방향이 반대입니다 — chunked는 서버 측 편의(크기 미상이어도 보낼 수 있게), byte range는 클라이언트 측 편의(필요한 부분만 받게).

JS/브라우저에서 직접 만나는 사례:

**Chunked encoding**:

```js
// Server-Sent Events는 chunked encoding 위에서 동작
const eventSource = new EventSource('/api/stream');
eventSource.onmessage = (e) => console.log(e.data);
// 서버는 응답을 닫지 않고 청크를 계속 흘려보냄
```

```js
// Streaming JSON / fetch ReadableStream
const res = await fetch('/api/large-list');
const reader = res.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 청크 단위로 처리
}
```

**Byte range**:

```html
<!-- 비디오 태그가 자동으로 Range 헤더 사용 -->
<video src="/movie.mp4" controls></video>
```

브라우저가 비디오를 한 번에 다 다운로드하지 않고, 사용자가 특정 시간으로 점프하면 그 구간부터의 바이트 범위만 요청합니다. DevTools Network 탭에서 비디오 요청을 보면 `Range: bytes=...` 헤더와 `206 Partial Content` 응답을 확인할 수 있습니다.

이게 없으면 어떻게 되는가:

- chunked encoding이 없으면 — 동적 응답 시작 전에 서버가 전체 응답을 메모리에 모아 길이 계산해야 함. 큰 응답이면 메모리 폭증, SSE 같은 무한 스트림은 아예 불가능.
- byte range가 없으면 — 다운로드 중단 시 처음부터 다시. 비디오 스트리밍이라는 개념 자체가 성립 안 됨.

오개념 예방: chunked encoding이 활성화된 응답은 `Content-Length` 헤더가 빠지고 대신 `Transfer-Encoding: chunked`가 들어갑니다. 이 둘은 함께 쓰지 않습니다 — 청크의 마지막(크기 0)이 종료 신호이므로 별도 길이가 불필요.

AI Annotation 보충: chunked encoding은 HTTP/1.0의 "Content-Length 없으면 연결 닫힐 때까지 기다리기" 문제를 해결했습니다. 청크마다 크기를 명시하고, 크기 0인 청크가 전송 완료를 알립니다. byte range serving은 `Range: bytes=1000-2000` 헤더로 특정 범위만 요청하며, 대용량 파일 이어받기의 원리입니다.
