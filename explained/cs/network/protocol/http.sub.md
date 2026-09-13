# HTTP가 클라이언트-서버 사이에 중간 노드를 허용하도록 설계된 이유는?

## 도입

클라이언트와 서버가 항상 직접 연결되는 것은 아니다. 사이에 프록시, CDN 같은 중간 노드가 있을 수 있다. HTTP는 이 중간 노드들을 활용하여 성능과 접근성을 높이도록 설계됐다.

---

## 본문

> HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.

"HTTP는 중간 네트워크 요소들이 클라이언트와 서버 사이의 통신을 개선하거나 가능하게 하도록 허용하도록 설계됐다."

- **intermediate network elements**: 클라이언트도 서버도 아닌 사이에 있는 노드들. CDN 엣지 서버, 프록시 서버가 대표적이다.

> High-traffic websites often benefit from web cache servers that deliver content on behalf of upstream servers to improve response time.

"트래픽이 많은 웹사이트는 종종 업스트림 서버를 대신하여 콘텐츠를 전달해 응답 시간을 개선하는 웹 캐시 서버의 혜택을 받는다."

- **on behalf of upstream servers**: CDN이 원본 서버 대신 응답하는 구조. Cloudflare, AWS CloudFront가 이 역할을 한다. 사용자는 멀리 있는 원본 서버 대신 가까운 CDN 엣지에서 응답을 받는다.

> Web browsers cache previously accessed web resources and reuse them, whenever possible, to reduce network traffic.

"웹 브라우저는 이전에 접근한 웹 리소스를 캐싱하고, 가능할 때마다 재사용하여 네트워크 트래픽을 줄인다."

DevTools Network 탭에서 `(memory cache)`, `(disk cache)`로 보이는 것이 바로 이 동작이다.

> HTTP proxy servers at private network boundaries can facilitate communication for clients without a globally routable address, by relaying messages with external servers.

"사설 네트워크 경계의 HTTP 프록시 서버는 전역 라우팅 주소가 없는 클라이언트를 위해 외부 서버와 메시지를 중계하여 통신을 가능하게 할 수 있다."

- **private network boundaries**: 회사 내부망처럼 공인 IP 없이 내부 IP만 쓰는 환경. 이 환경의 클라이언트는 인터넷에 직접 연결할 수 없으므로 프록시를 통한다.

> Those operating at the application layers are generally called proxies. These can be transparent, forwarding on the requests they receive without altering them in any way, or non-transparent, in which case they will change the request in some way before passing it along to the server.

"응용 계층에서 동작하는 것들을 일반적으로 프록시라고 부른다. 이것들은 투명(transparent)할 수 있어 받은 요청을 어떤 방식으로도 변경하지 않고 전달하거나, 비투명(non-transparent)하여 서버로 전달하기 전에 어떤 방식으로든 요청을 변경한다."

- **transparent**: 클라이언트 입장에서 프록시가 있는지 모른다. 요청이 그대로 전달된다.
- **non-transparent**: CDN이 캐시된 응답을 반환하거나, 회사 보안 프록시가 특정 헤더를 추가하는 것이 비투명 프록시다.

---

## 종합

`fetch('https://api.example.com')`을 호출할 때 실제로는 브라우저 → (회사 프록시) → CDN 엣지 → 원본 서버 순으로 여러 노드를 거칠 수 있다. HTTP가 중간 노드를 허용하도록 설계된 덕에 CDN이 원본 서버의 부하를 줄이고, 프록시가 사설망의 인터넷 접근을 가능하게 하며, 브라우저 캐시가 네트워크 트래픽을 줄이는 것이 모두 가능하다.

---
# 클라이언트가 서버와 HTTP 통신을 수행하는 전체 흐름(4단계)은?

## 도입

`fetch('https://example.com/api')`를 호출했을 때 내부에서는 어떤 일이 벌어지는가? 4단계로 요약할 수 있다.

---

## 본문

> Open a TCP connection: The TCP connection is used to send a request, or several, and receive an answer. The client may open a new connection, reuse an existing connection, or open several TCP connections to the servers.

"TCP 연결 열기: TCP 연결은 하나 또는 여러 요청을 보내고 응답을 받는 데 사용된다. 클라이언트는 새 연결을 열거나, 기존 연결을 재사용하거나, 서버에 여러 TCP 연결을 열 수 있다."

- **reuse an existing connection**: HTTP/1.1 keep-alive. 이미 열린 연결이 있으면 TCP handshake 없이 바로 요청을 보낸다.

> Send an HTTP message: HTTP messages (before HTTP/2) are human-readable. With HTTP/2, these messages are encapsulated in frames, making them impossible to read directly, but the principle remains the same.

"HTTP 메시지 전송: HTTP 메시지(HTTP/2 이전)는 사람이 읽을 수 있다. HTTP/2에서는 이 메시지가 프레임에 캡슐화되어 직접 읽을 수 없게 되지만, 원칙은 동일하다."

> Read the response sent by the server.

"서버가 보낸 응답 읽기."

> Close or reuse the connection for further requests.

"추가 요청을 위해 연결을 닫거나 재사용하기."

```
1. TCP 연결
   └── 새 연결: SYN → SYN-ACK → ACK (3 RTT)
   └── 재사용: 바로 요청 (0 RTT 추가)

2. HTTP 요청 전송
   GET /api/data HTTP/1.1
   Host: example.com
   ...

3. 응답 수신
   HTTP/1.1 200 OK
   Content-Type: application/json
   ...
   {"data": ...}

4. 연결 닫기 or 재사용
   └── Connection: close → 즉시 닫음
   └── keep-alive → 다음 요청에 재사용
```

---

## 종합

이 4단계 흐름은 HTTP 버전이 바뀌어도 동일하다. HTTP/2에서는 1단계에서 TLS와 프로토콜 협상이 추가되고, 4단계에서 멀티플렉싱을 통해 연결 하나에 여러 요청이 동시에 처리된다. 하지만 "연결 열기 → 요청 → 응답 → 연결 관리"라는 큰 틀은 같다. `fetch()`의 `Promise`가 resolve되는 시점이 3단계에서 응답을 다 읽은 후다.

---
# HTTP는 서버가 먼저 클라이언트에게 데이터를 보낼 수 없는데, SSE(Server-Sent Events)는 이 제약을 어떻게 우회하는가?

## 도입

HTTP의 기본 원칙은 "브라우저가 먼저 요청한다"다. 그런데 실시간 알림, 라이브 피드처럼 서버가 새 데이터를 클라이언트에 "밀어주어야" 하는 경우가 있다. SSE는 이 제약을 HTTP 안에서 우아하게 우회하는 방법이다.

---

## 본문

> Another API, server-sent events, is a one-way service that allows a server to send events to the client, using HTTP as a transport mechanism.

"또 다른 API인 server-sent events는 HTTP를 전송 메커니즘으로 사용하여 서버가 클라이언트에 이벤트를 보낼 수 있는 단방향 서비스다."

- **one-way service**: 서버 → 클라이언트 방향만. 클라이언트 → 서버는 일반 HTTP 요청으로 별도 처리한다.
- **using HTTP as a transport mechanism**: WebSocket처럼 별도 프로토콜이 아니라 일반 HTTP 위에서 동작한다.

> Using the EventSource interface, the client opens a connection and establishes event handlers.

"EventSource 인터페이스를 사용하여 클라이언트가 연결을 열고 이벤트 핸들러를 설정한다."

- **EventSource**: 브라우저 내장 API. `new EventSource('/events')`로 서버에 연결을 열고 유지한다.

**SSE 동작 원리:**

```js
// 클라이언트
const source = new EventSource('/api/events')
source.onmessage = (e) => console.log(e.data)

// 이것이 하는 일:
// GET /api/events HTTP/1.1
// Accept: text/event-stream
// (연결을 닫지 않고 유지)
```

```js
// 서버 (Express)
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // 연결을 닫지 않고 계속 데이터를 보냄
  setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`)
  }, 1000)
})
```

서버는 응답을 끝내지 않고 연결을 열어두면서 데이터를 계속 흘린다. 클라이언트는 이 스트림을 읽어 이벤트로 처리한다. "서버가 먼저 보내는 것처럼 보이지만", 실제로는 클라이언트가 먼저 열어둔 연결에 서버가 응답을 계속 이어쓰는 것이다.

**SSE vs WebSocket:**

```
SSE:      단방향 (서버 → 클라이언트)
          일반 HTTP 위에서 동작
          프록시/방화벽 친화적
          자동 재연결 지원

WebSocket: 양방향
           별도 프로토콜 (HTTP 업그레이드)
           더 낮은 오버헤드 (양방향 실시간 통신)
```

---

## 종합

SSE는 주식 시세, 뉴스 피드, 배포 로그 스트리밍처럼 서버→클라이언트 단방향 실시간 스트림에 적합하다. WebSocket보다 단순하고 HTTP 위에서 동작해 인프라 설정이 간단하다는 장점이 있다. Next.js의 Route Handlers에서 `ReadableStream`으로 SSE를 구현하거나, OpenAI API의 스트리밍 응답도 이 방식을 사용한다.
