# WebSocket API는 브라우저와 서버 사이에 어떤 통신을 가능하게 하는가?

## 도입

HTTP는 클라이언트가 요청을 보내야 서버가 응답하는 모양이라, 서버가 먼저 말을 거는 일이 구조적으로 안 된다. 그 제약을 우회하는 장치가 여럿 있는데(SSE처럼 응답을 끊지 않고 흘려보내는 방식), WebSocket은 아예 **양쪽 다 아무 때나 말할 수 있는 연결**을 하나 열어두는 쪽을 택한다.

원문은 한 문장이지만 그 안에 고른 단어(two-way, interactive, session)마다 "왜 이 단어였나"가 들어 있다.

---

## 본문

> The **WebSocket API** makes it possible to open a two-way interactive communication session between the user's browser and a server.

WebSocket API는 사용자의 브라우저와 서버 사이에 양방향으로 주고받는 대화형 통신 세션을 여는 것을 가능하게 한다.

- **two-way**: 브라우저→서버, 서버→브라우저 양쪽 방향 모두 스스로 먼저 보낼 수 있다는 뜻. HTTP는 브라우저가 물어봐야만 서버가 답하니 방향이 사실상 한쪽으로 고정돼 있다.
- **interactive**: 한 번 주고 끝나는 게 아니라, 열린 채로 계속 오가는 대화를 이룬다는 뜻. 채팅에서 상대가 타이핑 중이라는 표시가 실시간으로 뜨는 상황이 그것이다.
- **session**: 요청 하나에 대응하는 일회성 교환이 아니라, 열고 → 여러 메시지를 주고받고 → 닫는 **기간을 가진 연결**. 이 단어 때문에 "닫는 일"이 개발자 몫으로 남는다(뒤의 bfcache 이야기로 이어진다).
- **open**: 연결을 "만든다"가 아니라 "연다"고 쓴 것은, 만들어둔 뒤 계속 열려 있는 상태가 핵심이기 때문이다.

`two-way`가 코드에서 어떻게 드러나는지 보면 단어가 더 선명해진다.

```js
const socket = new WebSocket('wss://example.com/chat');

socket.addEventListener('open', () => {
  socket.send('안녕');        // ← 브라우저가 먼저 보내는 방향
});

socket.addEventListener('message', (event) => {
  console.log(event.data);   // ← 서버가 먼저 보내는 방향. 내가 요청한 적 없어도 도착한다
});
```

`message` 핸들러가 요청과 짝지어져 있지 않다는 점이 요점이다. `fetch`였다면 응답은 항상 내가 부른 그 호출의 반환값으로만 온다.

```
HTTP                          WebSocket
브라우저 ──요청──▶ 서버        브라우저 ◀──메시지──▶ 서버
브라우저 ◀──응답── 서버                (한 연결, 양쪽 다 아무 때나)
(응답은 요청의 짝으로만)
```

---

## 종합

문장 하나가 세 가지를 동시에 못박는다.

- **two-way** — 서버도 먼저 말할 수 있다. 알림·시세·채팅처럼 "언제 올지 모르는 것"이 서버 쪽 사정으로 도착할 수 있게 된다.
- **interactive** — 한 번의 교환이 아니라 계속 오가는 대화다.
- **session** — 그 대화가 유지되는 동안 연결이 하나 살아 있다.

이게 없으면 서버에 새 소식이 있는지 알 방법이 브라우저가 계속 물어보는 것밖에 없다.

대신 대가도 같이 생긴다 — 살아 있는 연결은 자원을 붙들고 있고, 끝났을 때 닫아주는 책임이 앱에 남는다.

---

# WebSocket API를 쓰면, 서버의 답을 받기 위해 무엇을 하지 않아도 되는가?

## 도입

서버에 새 데이터가 생겼는지 알아내는 가장 소박한 방법은 `setInterval`로 몇 초마다 `fetch`를 던지는 것이다. 이걸 polling(주기적으로 되묻기)이라고 부른다. 원문은 WebSocket이 바로 이 되묻기를 없앤다고 말한다.

---

## 본문

> With this API, you can send messages to a server and receive responses without having to poll the server for a reply.

이 API를 쓰면 서버에 메시지를 보내고 응답을 받되, 답을 얻으려고 서버에 주기적으로 되물을 필요가 없다.

- **poll**: 일정 간격으로 서버에 "새 거 있어요?"를 반복해서 묻는 것. 서버가 먼저 말을 못 거니까 클라이언트가 대신 계속 두드리는 방식이다.
- **without having to**: "안 해도 된다"이지 "못 한다"가 아니다. 되묻기라는 **부담이 사라진다**는 쪽에 방점이 있다.
- **messages**: `fetch`의 요청/응답 쌍이 아니라, 방향과 무관하게 오가는 낱개의 덩어리를 부르는 이름이다. 그래서 보낼 때도 받을 때도 같은 단어를 쓴다.

되묻기가 어떤 모양인지 코드로 보면 낭비 지점이 바로 보인다.

```js
// polling — 새 메시지가 없어도 3초마다 요청이 나간다
setInterval(async () => {
  const res = await fetch('/api/messages?since=' + lastSeen);
  const list = await res.json();   // ← 대부분 빈 배열이다
  render(list);
}, 3000);
```

문제는 두 갈래다.

- **헛요청** — 새 소식이 없어도 요청은 나간다. 사용자 1만 명이면 3초마다 1만 번의 요청과 그만큼의 TCP·TLS·헤더 비용이 실체 없는 응답을 위해 나간다.
- **지연** — 서버에 데이터가 생긴 직후여도 다음 주기까지 최대 3초를 기다린다. 간격을 줄이면 지연은 줄지만 헛요청이 늘고, 늘리면 반대가 된다. 이 저울에서 벗어날 수가 없다.

WebSocket은 연결이 열려 있으니 데이터가 생기는 대로 서버가 밀어준다 — 헛요청 0, 지연은 네트워크 왕복 한 번.

```
polling                         WebSocket
0초  요청 ─▶ (없음)              데이터 생김 ─▶ 즉시 도착
3초  요청 ─▶ (없음)
6초  요청 ─▶ 데이터!  ← 최대 3초 늦음
```

---

## 종합

앞 질문의 `two-way`가 "서버도 먼저 말할 수 있다"였다면, 이 문장은 그 결과로 **없어지는 일**을 말한다. 서버가 말을 못 걸기 때문에 클라이언트가 대신 계속 두드리던 것이 polling이고, 말을 걸 수 있게 되면 두드릴 이유가 사라진다.

그래서 WebSocket의 이득은 "빨라진다"보다 "**묻지 않아도 된다**"로 잡는 편이 정확하다. 빨라지는 것은 그 귀결이다. 실무에서는 채팅·실시간 알림·공동 편집 커서·주식 시세처럼 갱신이 서버 쪽 사정으로 아무 때나 일어나는 화면이 이 이득을 크게 본다. 반대로 갱신이 사용자 행동으로만 일어나는 화면이면 연결을 열어둘 이유 자체가 없다.

---

# WebSocket 객체는 어떤 역할을 하는가?

## 도입

앞에서 본 것은 "WebSocket API가 무엇을 가능하게 하는가"였다. 그 API를 코드에서 실제로 만지는 손잡이가 `WebSocket` 객체 하나다.

연결을 여는 일, 그 연결이 지금 어떤 상태인지 들여다보는 일, 데이터를 주고받는 일이 전부 이 객체 하나에 달려 있다.

`XMLHttpRequest`를 떠올리면 모양이 비슷하다 — 인스턴스를 하나 만들고, 프로퍼티로 상태를 읽고, 메서드로 동작을 시키고, 이벤트로 결과를 받는다.

---

## 본문

> The `WebSocket` object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.

`WebSocket` 객체는 서버로의 WebSocket 연결을 만들고 관리하는 API를, 그리고 그 연결 위에서 데이터를 보내고 받는 API를 함께 제공한다.

- **provides the API**: 객체가 곧 창구라는 뜻이다. 별도의 전역 함수나 매니저를 거치지 않고, 인스턴스 하나에 달린 프로퍼티·메서드·이벤트로 전부 처리한다.
- **creating**: 연결을 만드는 일. 생성자를 부르면 그 자리에서 연결 시도가 시작된다.
- **managing**: 만든 뒤에도 계속 들여다보고 손대는 일. 지금 열렸는지, 얼마나 밀렸는지, 서버가 무슨 규약을 골랐는지를 읽고, 필요하면 닫는다.
- **on the connection**: 데이터 송수신이 그 연결 **위에서** 일어난다는 것. 매번 새로 접속하는 게 아니라, 이미 열어둔 하나의 통로를 계속 쓴다.

원문이 말하는 세 가지 책임에 실제 멤버를 붙이면 이렇게 갈린다.

```
WebSocket 객체
├── 만들기 (creating)
│   └── new WebSocket(url)      연결 시도 시작
├── 관리하기 (managing)
│   ├── readyState              지금 연결이 어느 상태인가
│   ├── url                     생성 시 넘긴 주소를 되읽기
│   ├── protocol                서버가 고른 서브프로토콜
│   ├── binaryType              바이너리를 Blob / ArrayBuffer 중 무엇으로 받을지
│   ├── bufferedAmount          아직 못 보내고 줄 서 있는 바이트 수
│   └── close()                 연결 닫기
└── 주고받기 (sending / receiving)
    ├── send(data)              보낼 데이터를 줄에 세운다
    └── 이벤트
        ├── open                연결이 열렸을 때
        ├── message             데이터가 도착했을 때
        ├── close               연결이 닫혔을 때
        └── error               오류로 인해 닫혔을 때
```

### 만들기

> To construct a WebSocket, use the `WebSocket()` constructor.

`WebSocket`을 만들려면 `WebSocket()` 생성자를 쓴다.

- **construct**: 다른 진입점이 없다. `fetch`처럼 부르는 함수가 아니라 `new`로 인스턴스를 찍어내는 모양이다. 그래서 "연결 하나 = 객체 하나"가 성립한다.

### 관리하기

읽기 전용 프로퍼티들이 "지금 연결이 어떤 상태인가"를 알려준다.

- **`readyState`** — 연결 중인지, 열렸는지, 닫히는 중인지, 닫혔는지. 이게 없으면 `send()`를 불러도 되는 시점인지 알 방법이 없다.
- **`bufferedAmount`** — `send()`로 넘겼지만 아직 네트워크로 나가지 못하고 대기 중인 바이트 수. 뒤에서 볼 밀림 문제를 감지하는 유일한 눈금이다.
- **`protocol`** — 연결을 열 때 클라이언트가 후보 규약 이름을 여럿 제시하면 서버가 그중 하나를 고르는데, 그 고른 결과가 여기 담긴다. 같은 소켓 위에서 어떤 형식으로 대화할지가 정해지는 셈이다.
- **`url`** — 생성자에 넘긴 주소를 되읽는 값.

`binaryType`은 읽기 전용이 아니라 개발자가 정하는 값이다. 텍스트가 아닌 데이터가 도착했을 때 `event.data`에 `Blob`을 담을지 `ArrayBuffer`를 담을지 고른다.

> `WebSocket.binaryType` — The binary data type used by the connection.

연결이 사용하는 바이너리 데이터 타입.

- **binary**: 문자열이 아닌 원시 바이트 덩어리. 이미지나 오디오 조각, 직접 정한 이진 형식이 여기 해당한다. `Blob`은 파일처럼 다루기 좋고, `ArrayBuffer`는 바이트를 직접 뜯어보기 좋다.

닫는 일은 메서드 하나다.

> `WebSocket.close()` Closes the connection.

연결을 닫는다.

### 주고받기

보내는 쪽 문장이 이 객체를 이해하는 데 가장 중요하다.

> `WebSocket.send()` Enqueues data to be transmitted.

전송될 데이터를 대기열에 넣는다.

- **Enqueues**: "보낸다(sends)"가 아니라 **줄에 세운다**. `send()`가 반환됐다는 것은 데이터가 서버에 도착했다는 뜻도, 네트워크로 나갔다는 뜻조차도 아니다. 전송은 브라우저가 자기 속도로 처리한다.
- **to be transmitted**: 전송은 나중에 일어날 일이라는 것이 이 표현에 들어 있다.

이 단어 선택 때문에 `bufferedAmount`가 필요해진다. 줄에 세우기만 하는 함수라면 줄이 얼마나 길어졌는지 볼 눈금이 있어야 하기 때문이다.

눈금이 없으면 서버가 느린데도 앱은 계속 `send()`를 부르며 잘 되고 있다고 착각하고, 대기열은 메모리에서 조용히 자란다.

```js
// 대기열이 너무 길면 보내지 않고 건너뛴다
if (socket.bufferedAmount < 1_000_000) {
  socket.send(payload);       // ← 줄에 세우는 것뿐, 도착 보장이 아니다
}
```

받는 쪽은 이벤트다.

> Listen to these events using `addEventListener()` or by assigning an event listener to the `oneventname` property of this interface.

이 이벤트들은 `addEventListener()`로 듣거나, 이 인터페이스의 `on이벤트이름` 프로퍼티에 리스너를 대입해서 들을 수 있다.

- **assigning**: DOM 요소의 `onclick`과 같은 방식이다. `socket.onmessage = fn`처럼 대입하면 되지만, 대입은 하나만 등록되므로 나중 것이 앞의 것을 덮는다. 여러 곳에서 들어야 하면 `addEventListener()` 쪽이다.

이벤트는 넷이다.

- **`open`** — 연결이 열렸을 때. `send()`를 부를 수 있게 되는 시점이 여기다.
- **`message`** — 데이터가 도착했을 때. 서버가 보낸 알맹이는 이벤트 객체 자체가 아니라 `event.data`에 담긴다.
- **`close`** — 연결이 닫혔을 때.
- **`error`** — 오류로 인해 닫혔을 때 (다음 질문에서 자세히 본다).

MDN 공식 예제가 이 셋을 한 화면에 보여준다.

```js
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});
```

예제의 요점은 순서다. `send()`가 `open` 리스너 **안에** 들어 있다.

생성자를 부른 직후에는 아직 연결이 열리지 않은 상태다. 그 자리에서 바로 `send()`를 부르면 예외가 난다.

> The browser will throw an exception if you call `send()` when the connection is in the `CONNECTING` state.

그래서 "열렸다는 신호를 받은 뒤에 보낸다"가 이 API를 쓰는 기본 리듬이 된다.

원문: [MDN — WebSocket: send() method](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send)

---

## 종합

한 문장이 객체 하나에 세 가지 책임을 몰아준다.

- **만들기** — 생성자를 부르는 것으로 연결 시도가 시작된다. 연결 하나에 객체 하나가 대응한다.
- **관리하기** — `readyState`·`bufferedAmount`·`protocol`·`url`로 상태를 읽고, `binaryType`으로 받을 형식을 정하고, `close()`로 끝낸다.
- **주고받기** — `send()`로 줄에 세우고, `message` 이벤트의 `event.data`로 받는다.

전부 한 객체에 달려 있는 이유는 첫 질문에서 본 `session`이라는 성격 때문이다. 요청 한 번으로 끝나는 교환이라면 함수 호출 하나로 충분하지만, 열어두고 기간을 갖는 연결은 그 기간 내내 붙잡고 상태를 물어보고 끝낼 대상이 필요하다. 그 대상이 이 객체다.

그리고 `send()`가 "줄에 세운다"인 것이 다음 질문들로 이어진다. 보내는 쪽 대기열이 자라는 것을 앱이 직접 재야 한다는 사실이, 곧 볼 backpressure 이야기의 출발점이다.

---

# WebSocket 통신을 시작하려면 무엇을 만들어야 하며, 그 객체를 만든 직후 무슨 일이 일어나는가?

## 도입

HTTP는 클라이언트가 요청을 보내야만 서버가 응답하는 구조라, 서버가 먼저 말을 걸 수 없다. WebSocket은 이 제약을 없애기 위한 프로토콜로, 한 번 연결을 맺어두면 양쪽이 아무 때나 메시지를 보낼 수 있다.

브라우저에서 이 프로토콜을 쓰는 창구는 `WebSocket` 생성자 하나다. `fetch()`처럼 "호출하면 요청이 나간다"가 아니라, **객체를 만드는 행위 자체가 연결 시도**라는 점이 이 API의 출발점이다.

---

## 본문

> To communicate using the WebSocket protocol, you need to create a WebSocket object.

"WebSocket 프로토콜로 통신하려면 WebSocket 객체를 만들어야 한다."

- **object**: 여기서 객체는 단순한 값 묶음이 아니라 연결 하나를 대표하는 핸들이다. 연결을 열고·보내고·닫는 모든 동작이 이 객체의 메서드와 이벤트로 노출된다.

> The WebSocket constructor takes one mandatory argument — the URL of the WebSocket server to connect to.

"WebSocket 생성자는 필수 인자 하나를 받는다. 접속할 WebSocket 서버의 URL이다."

- **mandatory**: 선택이 아니라 반드시 넘겨야 하는 값. 어디에 붙을지가 정해지지 않으면 객체를 만드는 의미 자체가 없기 때문이다.

그래서 최소 코드는 두 줄이다.

```js
const wsUri = "ws://127.0.0.1/";
const websocket = new WebSocket(wsUri);
```

`connect()` 같은 별도 호출이 없다. 두 번째 줄이 실행되는 순간 이미 연결 시도가 진행 중이다.

> As soon as you create this object, it will start trying to connect to the specified server.

"이 객체를 만들자마자, 지정한 서버로 접속을 시도하기 시작한다."

- **as soon as**: 시점을 못박는 표현. "언젠가"가 아니라 생성자가 반환되는 그 순간이다.
- **start trying**: `connect`가 아니라 `start trying to connect`인 이유가 있다. 생성자가 반환됐다는 것은 연결이 **시작**됐다는 뜻이지 **성공**했다는 뜻이 아니다. 성공 여부는 뒤에 오는 이벤트로만 알 수 있다.

> Creating a WebSocket instance starts the process of establishing a connection to the server.

"WebSocket 인스턴스를 만드는 것이 서버와 연결을 맺는 과정을 시작시킨다."

- **process**: 한 번의 동작이 아니라 여러 단계로 이어지는 과정. 실제로는 HTTP 요청으로 시작해 프로토콜 전환 합의를 거쳐 연결이 선다.
- **establishing**: 연결이 "세워지는" 중. 완료형이 아닌 진행형이라는 점이 요점이다.

이게 없으면 어떻게 될까. 생성자가 연결이 끝날 때까지 기다린다면 그동안 메인 스레드가 멈춰 화면이 얼어붙는다. 네트워크 왕복은 수십~수백 밀리초가 걸리므로 브라우저 API는 이런 일을 동기로 처리하지 않는다.

```
new WebSocket(url) 반환됨
        │  (아직 연결 안 됨)
        ▼
   [연결 시도 중]
        │
        ├──► 성공 ──► open 이벤트 ──► 이제부터 send/message 가능
        │
        └──► 실패 ──► error 이벤트 ──► close 이벤트
```

---

## 종합

WebSocket API에서 "연결을 연다"는 별도의 동작은 없다. 객체를 만드는 것이 곧 연결을 여는 것이고, 생성자는 연결을 기다려주지 않고 즉시 반환한다. 따라서 코드 흐름은 자연히 두 토막으로 갈린다. 객체를 만드는 줄과, 연결이 실제로 선 뒤에 실행되어야 하는 나머지 전부다.

이 구조는 `fetch()`가 Promise를 돌려주고 응답을 `.then()` 안에서 다루게 하는 것과 같은 이유에서 나왔다. 다만 WebSocket은 응답이 한 번이 아니라 계속 이어지므로 Promise 대신 이벤트를 쓴다. 그래서 실무 코드의 뼈대는 "생성 → 이벤트 리스너 등록 → 이벤트 안에서 송수신"이 된다.

---

# 실제 서비스에서 WebSocket 주소는 어떤 형태여야 하는가?

## 도입

WebSocket 주소는 `http://`가 아니라 `ws://`로 시작하고, 암호화된 버전은 `wss://`다. `http`와 `https`의 관계가 그대로 `ws`와 `wss`에 대응한다고 보면 된다.

여기서 중요한 것은 단순한 표기 규칙이 아니라 **브라우저가 강제하는 제약**이다. 요즘 브라우저는 암호화되지 않은 WebSocket 연결을 사실상 막아두었고, 페이지의 프로토콜과 소켓의 프로토콜이 어긋나는 조합도 허용하지 않는다.

---

## 본문

> In a real application, web pages should be served using HTTPS, and the WebSocket connection should use wss as the protocol.

"실제 애플리케이션에서 웹 페이지는 HTTPS로 제공되어야 하고, WebSocket 연결은 프로토콜로 wss를 써야 한다."

- **real application**: 실습·로컬 예제와 대비되는 말. 뒤집으면 `ws://`는 로컬 실험에서나 쓰는 것이라는 뜻이다.
- **wss**: WebSocket Secure. `ws` 트래픽을 TLS로 감싼 것으로, `https`가 `http`를 감싸는 것과 같은 구조다.

> Note: In this example we're using the ws protocol for the connection, because in the example we're connecting to localhost.

"참고: 이 예제에서는 localhost에 접속하기 때문에 연결에 ws 프로토콜을 쓰고 있다."

- **because**: 예외가 허용된 조건을 밝히는 자리다. 같은 기기 안에서의 통신이라 중간에서 가로챌 구간이 없기 때문에 암호화 없이도 통과된다.

> Most browsers now only allow secure WebSocket connections, and no longer support using them in insecure contexts.

"이제 대부분의 브라우저는 보안 WebSocket 연결만 허용하며, 안전하지 않은 컨텍스트에서의 사용은 더 이상 지원하지 않는다."

- **insecure context**: 브라우저가 "안전하다"고 인정하지 않는 출처에서 실행되는 페이지. `https://`와 `localhost`는 안전한 컨텍스트로 쳐주고, 일반 `http://` 페이지는 아니다.
- **no longer support**: 과거에는 됐지만 지금은 막혔다는 뜻. 오래된 예제 코드를 그대로 옮겨오면 걸리는 지점이다.

> The constructor will throw a SecurityError if the destination doesn't allow access.

"목적지가 접근을 허용하지 않으면 생성자가 SecurityError를 던진다."

- **throw**: 이벤트로 알려주는 게 아니라 그 자리에서 예외가 난다. 즉 `new WebSocket(...)` 줄 자체가 실패하며, `error` 이벤트 핸들러로는 잡히지 않는다. `try`/`catch`로 감싸야 잡힌다.
- **destination**: 접속하려는 대상. 서버 쪽 정책일 수도 있고 브라우저의 보안 정책일 수도 있다.

> This may happen if you attempt to use an insecure connection (most user agents now require a secure link for all WebSocket connections unless they're on the same device or possibly on the same network).

"안전하지 않은 연결을 쓰려고 하면 이 일이 생길 수 있다 (대부분의 사용자 에이전트는 이제 같은 기기 또는 경우에 따라 같은 네트워크에 있지 않은 한 모든 WebSocket 연결에 보안 링크를 요구한다)."

- **user agent**: 표준 문서에서 브라우저를 가리킬 때 쓰는 말이다.
- **unless they're on the same device**: 앞에서 `localhost` 예제가 통과된 이유가 여기 적혀 있다.
- **possibly**: 같은 네트워크 예외는 브라우저마다 다르다는 여지를 남긴 표현이다. 즉 믿고 설계할 규칙이 아니다.

> WebSockets should not be used in a mixed content environment; that is, you shouldn't open a non-secure WebSocket connection from a page loaded using HTTPS or vice versa.

"WebSocket은 혼합 콘텐츠 환경에서 쓰면 안 된다. 즉 HTTPS로 로드된 페이지에서 안전하지 않은 WebSocket 연결을 열어서는 안 되고, 그 반대도 마찬가지다."

- **mixed content**: 한 페이지 안에 암호화된 리소스와 암호화되지 않은 리소스가 섞인 상태. 이미지·스크립트에 적용되는 그 규칙이 WebSocket에도 똑같이 적용된다.
- **vice versa**: 반대 방향도 마찬가지. `http://` 페이지에서 `wss://`를 여는 조합도 권장되지 않는다.

이 규칙이 없으면 어떻게 될까. HTTPS 페이지가 평문 소켓 하나만 열어도 그 소켓으로 오가는 로그인 토큰이나 채팅 내용은 중간에서 그대로 읽힌다. 자물쇠 아이콘이 보장하려던 것이 소켓 하나 때문에 무너지므로 브라우저가 이 조합 자체를 막는다.

```
페이지 프로토콜        소켓 프로토콜        결과
─────────────────────────────────────────────────
https://              wss://              허용 (권장 조합)
https://              ws://               차단 (혼합 콘텐츠)
http://               wss://              권장 안 함
http://               ws://               차단 (단, localhost는 예외)
```

---

## 종합

정리하면 규칙은 하나다. **페이지가 HTTPS면 소켓은 wss여야 한다.** 로컬 개발에서만 `ws://127.0.0.1` 같은 주소가 통하고, 그것도 "같은 기기"라는 예외 덕분이지 일반 규칙이 아니다.

실패하는 방식도 다른 이벤트들과 다르다는 점을 기억해두면 디버깅이 빨라진다. 연결 도중의 문제는 `error` 이벤트로 오지만, 보안 정책 위반은 생성자에서 `SecurityError` 예외로 즉시 터진다. `error` 핸들러만 달아두고 "아무 이벤트도 안 온다"며 헤매는 상황이 여기서 나온다.

배포 환경에서 주소를 하드코딩하지 않는 것도 이 규칙에서 따라 나온다. 페이지 프로토콜에 맞춰 소켓 주소를 만들어두면 개발과 운영에서 프로토콜이 어긋날 일이 없다.

```js
const scheme = location.protocol === "https:" ? "wss" : "ws";
const wsUri = `${scheme}://${location.host}/socket`;
```

---

# WebSocket에서 open 이벤트는 언제 발생하며, 그 시점은 무엇을 가르는가?

## 도입

객체를 만든 직후에는 연결이 아직 서지 않은 상태다. 그러면 "언제부터 메시지를 보내도 되는가"라는 질문이 남는데, 그 경계선을 알려주는 것이 `open` 이벤트다.

이 이벤트는 단순한 알림이 아니라 **자격의 경계**다. 이전에는 못 하던 일이 이후에는 가능해진다.

---

## 본문

> Once the connection is established, the open event is fired, and after this point the socket is able to transmit data.

"연결이 수립되고 나면 open 이벤트가 발생하며, 이 시점 이후로 소켓은 데이터를 전송할 수 있다."

- **once**: "~하고 나면". 조건이 충족된 뒤라는 시간적 전제를 건다.
- **established**: 연결이 완전히 세워진 상태. 앞서 생성자가 시작시킨 "establishing"(세우는 중)이 끝난 지점이다.
- **after this point**: 원문이 굳이 "이 시점 이후"라고 못박아 둔 자리다. 그 전에 `send()`를 부르면 아직 연결이 없으므로 예외가 난다.
- **is able to**: "보낸다"가 아니라 "보낼 수 있게 된다". 이벤트가 데이터를 보내주는 게 아니라 보낼 자격이 생겼음을 알린다는 뜻이다.

그래서 서버로 무언가를 주기적으로 보내야 한다면, 그 타이머를 `open` 핸들러 **안**에서 건다.

```js
websocket.addEventListener("open", () => {
  log("CONNECTED");
  pingInterval = setInterval(() => {
    log(`SENT: ping: ${counter}`);
    websocket.send("ping");
  }, 1000);
});
```

`setInterval`을 핸들러 밖 최상위에 두면 첫 실행이 연결 수립보다 먼저 올 수 있고, 그러면 아직 열리지 않은 소켓에 `send()`를 부르게 된다.

타이머를 핸들러 안쪽에 넣는 것만으로 이 문제가 사라진다. 타이머가 걸리는 시점 자체가 이미 연결된 뒤로 보장되기 때문이다.

---

## 종합

`open`은 "연결됐다"는 소식보다 "이제부터 보내도 된다"는 허가로 읽는 편이 정확하다. WebSocket 객체는 만들어진 직후부터 존재하지만, 쓸 수 있는 상태가 되는 것은 이 이벤트가 지나간 뒤다.

이 때문에 WebSocket을 쓰는 코드는 대부분 같은 모양을 하게 된다. 소켓을 만드는 줄은 한 줄이고, 실제 통신 로직은 전부 `open` 핸들러 안이나 그 이후에 놓인다. 주기 전송, 첫 인증 메시지, 구독 요청처럼 "연결되자마자 해야 할 일"이 모이는 자리가 바로 여기다.

---

# WebSocket에서 error 이벤트는 언제 발생하는가?

## 도입

연결은 두 단계에서 깨질 수 있다. 아직 세우는 중에 깨지거나, 잘 쓰고 있다가 도중에 깨지거나다. `error` 이벤트는 이 둘을 구분하지 않고 모두 알려준다.

이름만 보면 `error`는 "문제가 생겼다"는 알림처럼 읽힌다. `fetch`의 실패나 `img`의 `onerror`처럼, 한 번의 실패를 알리고 나면 다시 시도해볼 수 있는 종류로 보인다. 원문 두 개를 겹쳐 읽으면 그렇지 않다 — 이건 **이미 끝난 일에 대한 통보**다.

---

## 본문

> If an error occurs while the connection is being established or at any time after it is established, the error event will be fired.

"연결이 수립되는 도중이든 수립된 이후 어느 때든 오류가 발생하면 error 이벤트가 발생한다."

- **while the connection is being established**: 연결을 세우는 중. 서버가 꺼져 있거나 주소가 틀린 경우가 여기 해당한다. 이 경우 `open`은 한 번도 발생하지 않는다.
- **at any time after it is established**: 수립 이후 아무 때나. 잘 쓰던 연결이 네트워크가 끊기거나 서버가 죽어서 깨지는 경우다.
- **or**: 두 구간을 하나의 이벤트로 묶었다는 뜻이다. 즉 `error`만 봐서는 "연결이 아예 안 됐다"와 "쓰던 연결이 끊겼다"를 구별할 수 없다.

핸들러 자체는 단순하다.

```js
websocket.addEventListener("error", (e) => {
  log(`ERROR`);
});
```

이 예제가 이벤트 객체에서 아무것도 꺼내 쓰지 않는 데는 이유가 있다. 브라우저는 보안상 실패 원인을 스크립트에 자세히 넘겨주지 않는다.

어떤 호스트가 왜 거절했는지를 페이지 스크립트가 알 수 있게 되면, 그 자체가 내부 네트워크를 훑어보는 수단이 되기 때문이다. 그래서 실무에서는 원인을 캐내려 하기보다 `error`가 왔다는 사실만 받고 재연결·사용자 안내 쪽으로 넘어간다.

```
연결 시도 ──┬── 수립 실패 ─────────────► error  (open 없음)
            │
            └── 수립 성공 ──► open ──► 사용 중 ──► 도중 실패 ──► error
```

### 이벤트가 도는 시점에 연결은 이미 없다

레퍼런스 쪽 문장은 같은 이벤트를 시제로 다시 못박는다.

> Fired when a connection with a WebSocket has been closed because of an error, such as when some data couldn't be sent.

WebSocket 연결이 오류 때문에 이미 닫혔을 때 발생한다 — 예를 들면 어떤 데이터를 보내지 못했을 때.

- **has been closed**: 요점이 여기다. "닫힌다"도 "닫으려 한다"도 아니라 **닫힘이 이미 완료된 상태**를 가리킨다. 이벤트 핸들러가 실행될 때 연결은 이미 없다.
- **because of an error**: 닫힌 사유가 오류라는 것. 사용자가 `close()`를 불러서 정상적으로 닫힌 경우와 구분하는 표현이다.
- **such as**: 예시를 하나 드는 것이지 전부를 세는 것이 아니다.
- **some data couldn't be sent**: `send()`가 여기서 이어진다. 줄에 세운 데이터가 끝내 나가지 못하는 상황이 오류의 한 예다.

### `error`를 받은 연결은 되살릴 수 없다

닫힘이 이미 끝난 일이므로, 그 인스턴스로 할 수 있는 일은 없다. 같은 객체를 다시 연결하는 메서드는 `WebSocket`에 존재하지 않는다 — `reconnect()`도, `open()`도 없다. 다시 연결하려면 방법은 하나뿐이다.

```js
socket.addEventListener("error", () => {
  // socket은 이미 닫혀 있다. 이 인스턴스로 할 수 있는 일은 없다.
  socket = new WebSocket(url);   // ← 새 인스턴스를 만드는 것 외에 방법이 없다
});
```

"기존 인스턴스를 어떻게든 다시 열 수 있지 않을까" 하고 API를 뒤지기 쉬운 자리인데, 그런 API는 없다. 재연결 기능이 필요하면 앱이 직접 만드는 수밖에 없고, 그 내용은 결국 "새 인스턴스를 만들고 리스너를 다시 붙이는" 코드가 된다.

### 참조가 살아 있다고 연결이 살아 있는 건 아니다

연결이 끊겨도 변수에 담아둔 객체는 그대로 남는다. `socket`이 `null`이 되지 않고, 프로퍼티도 다 읽힌다. 자바스크립트 입장에서는 그냥 평범한 객체 하나가 계속 참조되고 있을 뿐이다.

```js
// ❌ 객체가 있다고 연결이 있는 게 아니다
if (socket) {
  socket.send(data);
}

// ✅ 연결 상태는 readyState가 말해준다
if (socket.readyState === WebSocket.OPEN) {
  socket.send(data);
}
```

닫힘을 가리키는 것은 `readyState`뿐이다. 이게 없으면 앱은 살아 있는 참조를 보고 계속 연결돼 있다고 믿으면서 닫힌 소켓에 데이터를 밀어넣게 된다.

### `close`와의 관계

`error`가 뜨면 `close`도 뒤이어 뜬다. WHATWG 명세가 연결이 닫힐 때 밟을 단계를 순서까지 못박아 두었다.

> Set the WebSocket object's ready state to CLOSED (3).
> If the user agent was required to fail the WebSocket connection, or if the WebSocket connection was closed after being flagged as full, fire an event named error at the WebSocket object.
> Fire an event named close at the WebSocket object, using CloseEvent […]

읽는 순서가 곧 `has been closed`의 근거다. 상태를 CLOSED로 바꾸는 것이 **첫 단계**이고 `error`는 그다음이라, 핸들러가 도는 시점에 연결이 이미 닫혀 있는 것은 부작용이 아니라 정해진 순서다.

`close`는 오류든 정상 종료든 언제나 마지막에 오고 `error`는 실패했을 때만 낀다. 그래서 **정리 코드는 `close` 쪽에 한 번만 두면 양쪽 경우를 모두 덮는다**.

원본 명세: [WHATWG WebSockets — When the WebSocket connection is closed](https://websockets.spec.whatwg.org/)

```
정상 흐름
new WebSocket ─▶ 연결 시도 ─▶ [open] ─▶ send / message 반복 ─▶ close() ─▶ [close]

오류 흐름
new WebSocket ─▶ 연결 시도 ─▶ [open] ─▶ 오류 발생
                                          │
                                          ▼
                                   연결이 이미 닫힘
                                          │
                                          ▼
                                      [error]  ← 통보일 뿐, 여기서 되돌릴 수 없다
                                          │
                                          ▼
                             재연결하려면 new WebSocket(url) 부터 다시
```

---

## 종합

한 이벤트가 두 가지를 한꺼번에 알린다.

- **언제 깨졌는지는 안 알려준다** — 수립 중이든 사용 중이든 같은 `error` 하나다. 구별하려면 `open`을 이미 받았는지를 앱이 기억하고 있어야 한다.
- **왜 깨졌는지도 안 알려준다** — 브라우저가 보안상 원인을 숨긴다. 그래서 `error` 핸들러에 진단 로직을 쌓는 것은 대체로 헛수고다.
- **이미 닫힌 뒤에 온다** — `has been closed`. 그 인스턴스는 끝이고, 다시 연결하려면 `new WebSocket(...)`으로 새 객체를 만드는 길밖에 없다.
- **객체는 남고 연결만 사라진다** — 살아 있는지는 `readyState`로 물어야 한다.

실무에서 이 넷이 합쳐지면 재연결 로직의 모양이 정해진다. `error`나 `close`를 받으면 기존 객체는 버리고, 잠시 기다렸다가 새 인스턴스를 만들고, 리스너를 다시 붙인다. 자원 정리는 뒤이어 반드시 오는 `close` 한 곳에만 둔다.

기다리는 이유는 서버가 죽었거나 네트워크가 끊긴 상황에서 즉시 재시도하면 실패만 반복되며 요청이 쏟아지기 때문이다. 그래서 재시도 간격을 점점 늘리는 식으로 짜게 된다.

---

# close 이벤트는 어떤 경우들에 발생하는가?

## 도입

`close`는 연결이 끝났다는 것을 알리는 이벤트다. 중요한 것은 이 이벤트가 "정상 종료"에만 오는 게 아니라는 점이다. 클라이언트가 닫든, 서버가 닫든, 오류로 깨지든, 끝났다면 예외 없이 `close`가 온다.

---

## 본문

> When the connection is closed, because either the client or the server closed it or because an error occurred, the close event will be fired.

"클라이언트나 서버가 닫았기 때문이든 오류가 발생했기 때문이든, 연결이 닫히면 close 이벤트가 발생한다."

- **either the client or the server**: 닫는 주체가 양쪽 모두일 수 있다. 브라우저에서 `close()`를 부른 경우도, 서버가 연결을 끊은 경우도 같은 이벤트로 온다.
- **because an error occurred**: 세 번째 경로. 아무도 의도적으로 닫지 않았는데 깨진 경우다.

> On an error, the connection is closed and the close event will be fired.

"오류가 나면 연결이 닫히고 close 이벤트가 발생한다."

- **is closed**: 오류가 났다고 연결이 어정쩡하게 살아 있는 상태는 없다. 오류는 곧 종료다.
- **and**: 두 사건이 이어진다는 표시다. `error` 하나만 오고 끝나는 경우는 없고 반드시 `close`가 따라온다.

세 경로가 하나의 출구로 모인다.

```
클라이언트가 close() 호출 ──┐
서버가 연결 종료 ───────────┼──► close 이벤트 ──► 정리 코드 한 곳
오류 발생 ──► error ────────┘
```

그래서 정리 코드는 `close` 한 곳에만 두면 된다.

```js
websocket.addEventListener("close", () => {
  log("DISCONNECTED");
  clearInterval(pingInterval);
});
```

> Our application listens for the close event and cleans up the interval timer when it is fired:

"우리 애플리케이션은 close 이벤트를 듣고 있다가, 그것이 발생하면 인터벌 타이머를 정리한다."

- **cleans up**: 뒷정리. 소켓과 함께 살아 있던 부수 자원을 걷어내는 일이다.
- **interval timer**: `open`에서 걸어둔 그 타이머. 연결이 사라져도 타이머는 스스로 멈추지 않으므로, 그대로 두면 닫힌 소켓에 계속 `send()`를 시도하며 오류를 쏟아낸다.

이게 왜 중요한지는 반대 경우를 보면 드러난다. 정리를 `error` 쪽에 두면 서버가 정상적으로 연결을 닫은 경우에는 실행되지 않아 타이머가 살아남는다. 반대로 `close`에 두면 어느 경로로 끝났든 반드시 지나가므로 빠지는 경우가 없다.

---

## 종합

WebSocket의 종료 경로는 세 갈래지만 출구는 하나다.

- **클라이언트가 닫음** — 페이지를 떠나며 `close()`를 부른 경우
- **서버가 닫음** — 서버 재배포, 유휴 연결 정리 등
- **오류로 깨짐** — `error` 이벤트 뒤에 이어서

이 셋이 모두 `close`로 모인다는 점 덕분에, 타이머 해제·재연결 예약·연결 상태 표시 갱신 같은 뒷정리를 세 군데에 흩어놓을 필요가 없다.

`close` 핸들러 하나가 모든 종료를 받아내므로 정리 코드가 한 곳에 모이고, "이 경우에만 정리가 안 됐다" 같은 구멍이 생기지 않는다.

---

# send()로 메시지를 보낼 때, 호출이 반환된 시점과 실제 전송 시점은 어떤 관계인가?

## 도입

`websocket.send("ping")`이 반환됐다면 메시지가 서버에 도착한 걸까? 아니다. 이 메서드는 데이터를 넘겨받아 대기열에 넣기만 하고 곧바로 돌아온다.

`fetch()`가 Promise를 돌려주며 결과를 나중에 알려주는 것과 비교하면 차이가 뚜렷하다. `send()`는 아예 아무것도 돌려주지 않으므로, 전송이 끝났는지를 알 수단 자체가 이 호출에는 없다.

---

## 본문

> We've already seen that once the connection is established, we can use the send() method to send messages to the server:

"연결이 수립되고 나면 send() 메서드로 서버에 메시지를 보낼 수 있다는 것은 앞서 보았다."

- **once the connection is established**: 전제 조건을 다시 상기시키는 부분이다. `send()`는 `open` 이후에만 유효하다.

> The send() method is asynchronous: it does not wait for the data to be transmitted before returning to the caller.

"send() 메서드는 비동기다. 데이터가 전송되기를 기다리지 않고 호출한 쪽으로 돌아온다."

- **asynchronous**: 여기서의 비동기는 "나중에 결과를 알려준다"가 아니라 "결과를 기다리지 않는다"에 가깝다. 알려주는 통로조차 없다.
- **does not wait**: 이게 요점이다. 반환됐다는 사실은 전송에 대해 아무것도 보장하지 않는다.
- **the caller**: `send()`를 부른 코드. 곧바로 다음 줄로 진행한다.

> It just adds the data to its internal buffer and begins the process of transmission.

"그저 데이터를 내부 버퍼에 추가하고 전송 과정을 시작할 뿐이다."

- **just**: 하는 일이 이것뿐이라는 한정. 기대보다 적게 한다는 뉘앙스다.
- **internal buffer**: 브라우저가 관리하는 대기열. 아직 나가지 않은 데이터가 여기 쌓인다. 얼마나 쌓여 있는지는 `bufferedAmount` 속성으로 확인할 수 있다.
- **begins**: `completes`가 아니다. 시작만 시켜놓고 손을 뗀다.

보내는 데이터는 문자열만이 아니다.

> In our example we send text, but you can also send binary data as a Blob, ArrayBuffer, TypedArray, or DataView.

"예제에서는 텍스트를 보내지만, Blob·ArrayBuffer·TypedArray·DataView 형태로 이진 데이터도 보낼 수 있다."

- **binary data**: 파일 조각, 이미지, 오디오처럼 문자로 표현되지 않는 데이터. 파일 입력에서 얻은 `File` 객체가 곧 `Blob`이므로 그대로 넘길 수 있다.

> A common approach is to use JSON to send serialized JavaScript objects as text.

"흔한 방법은 JSON을 써서 JavaScript 객체를 문자열로 펴 텍스트로 보내는 것이다."

- **common approach**: 규정이 아니라 관행이라는 표현이다. WebSocket 자체는 메시지 내용의 형식을 정하지 않으므로, 무엇을 어떻게 담을지는 애플리케이션이 정한다.
- **serialized**: 객체를 전송 가능한 한 줄의 문자열로 펴는 것.

```js
const message = {
  iteration: counter,
  content: "ping",
};
websocket.send(JSON.stringify(message));
```

`send()`는 객체를 알아서 변환해주지 않으므로 `JSON.stringify`를 직접 거쳐야 한다. 빠뜨리면 `[object Object]`라는 문자열이 그대로 날아간다.

---

## 종합

`send()`가 반환된 시점과 데이터가 실제로 서버에 닿는 시점은 완전히 분리되어 있다. 호출은 "이 데이터를 보내달라"는 등록이고, 실제 전송은 그 뒤에 브라우저가 알아서 진행한다.

여기서 두 가지가 따라 나온다.

- **`send()` 다음 줄에서 도착을 전제하면 안 된다** — "보냈으니 서버가 처리했겠지"라고 가정한 코드는 연결이 느리거나 끊기는 순간 어긋난다. 서버가 받았음을 확인하려면 서버가 되돌려주는 응답 메시지를 `message` 이벤트에서 받는 수밖에 없다.
- **빠르게 많이 보내면 버퍼가 쌓인다** — 전송 속도보다 `send()` 호출이 빠르면 나가지 못한 데이터가 메모리에 누적된다. 대용량이나 고빈도 전송에서는 `bufferedAmount`를 보고 호출 속도를 조절한다.

주고받는 데이터 형식은 애플리케이션이 정한다. 대부분은 객체를 JSON 문자열로 펴서 보내고, 파일이나 미디어처럼 문자로 표현하기 곤란한 것은 이진 형태로 보낸다.

---

# 서버가 보낸 메시지는 어떻게 받는가?

## 도입

WebSocket을 쓰는 진짜 이유가 이 지점에 있다. HTTP에서는 서버가 무언가 알려주려 해도 클라이언트가 물어볼 때까지 기다려야 하지만, WebSocket에서는 서버가 아무 때나 보낼 수 있다.

받는 쪽 코드가 "요청에 대한 응답"이 아니라 "언제 올지 모르는 알림"을 다루는 모양이 되는 것도 그래서다.

---

## 본문

> To receive messages from the server, we listen for the message event.

"서버로부터 메시지를 받으려면 message 이벤트를 듣는다."

- **listen for**: 이벤트 리스너를 등록한다는 뜻. 클릭 이벤트를 듣는 것과 같은 방식이다.
- **message**: 이벤트 이름이자 개념. 서버가 보낸 데이터 한 덩어리가 곧 한 번의 이벤트다.

받는 쪽에는 "언제 오는지"를 정하는 코드가 없다는 점이 눈에 띈다. 요청을 보내지 않았는데도 핸들러가 호출된다.

```js
websocket.addEventListener("message", (e) => {
  log(`RECEIVED: ${e.data}: ${counter}`);
  counter++;
});
```

실제 내용은 이벤트 객체의 `data` 속성에 담긴다.

> The server can also send binary data, which is exposed to clients as a Blob or an ArrayBuffer, based on the value of the WebSocket.binaryType property.

"서버는 이진 데이터도 보낼 수 있으며, 이는 WebSocket.binaryType 속성값에 따라 Blob 또는 ArrayBuffer로 클라이언트에 노출된다."

- **exposed to clients as**: 같은 이진 데이터가 어떤 JS 타입으로 보이는지는 클라이언트 설정이 정한다는 뜻이다.
- **binaryType**: 소켓 객체의 속성. `"blob"`(기본값)이면 `Blob`으로, `"arraybuffer"`로 바꿔두면 `ArrayBuffer`로 받는다. 바이트를 직접 훑어야 하면 후자가 편하다.

> As we saw for sending messages, the server can also send JSON strings, which the client can then parse into an object:

"메시지를 보낼 때 보았듯이, 서버도 JSON 문자열을 보낼 수 있고 클라이언트는 그것을 객체로 파싱할 수 있다."

- **parse**: 문자열을 다시 객체로 되돌리는 것. 보낼 때의 `JSON.stringify`와 짝을 이룬다.

```js
websocket.addEventListener("message", (e) => {
  const message = JSON.parse(e.data);
  log(`RECEIVED: ${message.iteration}: ${message.content}`);
  counter++;
});
```

`e.data`는 문자열이나 이진 데이터일 뿐 객체가 아니므로, 짜임새 있는 데이터를 쓰려면 이 변환을 직접 해야 한다.

서버가 늘 올바른 JSON을 보낸다는 보장도 없어서 실무에서는 이 파싱을 `try`/`catch`로 감싸는 경우가 많다. 깨진 문자열 하나가 핸들러 전체를 중단시키기 때문이다.

---

## 종합

`message` 이벤트는 WebSocket이 HTTP와 갈라지는 지점이다. HTTP에서는 클라이언트가 요청을 보내야만 데이터가 오지만, 여기서는 서버가 보내면 그냥 온다. 그래서 클라이언트 코드는 "언제 데이터가 오는가"를 통제하지 않고, 오면 처리하는 형태로만 작성된다.

받는 데이터의 형태는 세 갈래다.

- **텍스트** — `e.data`가 문자열
- **JSON 문자열** — 문자열로 받아 `JSON.parse`로 객체 복원
- **이진 데이터** — `binaryType` 설정에 따라 `Blob` 또는 `ArrayBuffer`

보내는 쪽과 받는 쪽이 대칭이라는 점을 기억해두면 전체 그림이 단순해진다. 보낼 때 `JSON.stringify`를 거쳤다면 받는 쪽은 `JSON.parse`를 거치고, 이진으로 보냈다면 이진으로 받는다. WebSocket 자체는 이 형식에 관여하지 않으므로, 양쪽이 무엇을 주고받을지는 애플리케이션이 합의해서 정한다.

---

# WebSocket 인터페이스에는 backpressure가 없다. 이 때문에 어떤 상황에서 무슨 일이 벌어지는가?

## 도입

여기서 말하는 `WebSocket` 인터페이스는 `new WebSocket(...)`으로 쓰는 그 표준 인터페이스다. 이 인터페이스에 없는 것이 **backpressure**다.

backpressure는 **받아 처리하는 쪽이 느릴 때 그 사정을 보내는 쪽에 전달해 생산 속도를 눌러주는 흐름 제어**다. 익숙한 예로는 `fetch` 응답을 읽는 스트림이 있다. `ReadableStream`에서 `reader.read()`를 `await`하며 한 덩어리씩 가져가는 동안, 내가 느리게 읽으면 스트림은 다음 덩어리를 준비하는 속도를 스스로 늦춘다. 읽는 쪽의 사정이 만드는 쪽까지 거슬러 올라가는 것 — 그게 backpressure다.

`WebSocket`에는 그 되돌아가는 통로가 없다. 메시지는 `message` 이벤트로 그냥 던져진다. "잠깐만"이라고 말할 자리가 문법상 아예 없다.

---

## 본문

> However it doesn't support backpressure.

다만 이 인터페이스는 backpressure를 지원하지 않는다.

- **support**: 개발자가 조심하면 되는 문제가 아니라 **인터페이스가 제공하지 않는 기능**이라는 뜻이다. `onmessage` 핸들러가 반환하는 값을 아무도 기다려주지 않으니, 느리다는 신호를 보낼 수단 자체가 없다.

> As a result, when messages arrive faster than the application can process them

그 결과, 애플리케이션이 처리할 수 있는 속도보다 메시지가 더 빨리 도착하면,

- **arrive faster than ... can process**: 문제의 조건이 여기 다 들어 있다. 메시지가 많은 게 문제가 아니라 **도착 속도 > 처리 속도**인 상태가 문제다. 이 부등호가 유지되는 동안 차이가 계속 쌓인다.

```js
socket.addEventListener('message', async (event) => {
  await heavyParseAndRender(event.data);  // ← 100ms 걸린다고 하자
});
// 서버가 10ms마다 보내면? 이벤트는 그래도 계속 들어온다.
// await는 이 핸들러만 기다리게 할 뿐, 서버를 늦추지 못한다.
```

> it will either fill up the device's memory by buffering those messages,

그 메시지들을 버퍼에 쌓느라 기기의 메모리를 가득 채우거나,

- **buffering**: 아직 처리 못 한 메시지를 어딘가에 임시로 모아두는 것. 처리 대기 중인 데이터와 아직 실행되지 않은 콜백들이 메모리에 남는다.
- **fill up**: 조금 쓰는 게 아니라 **차오른다**. 유입이 처리보다 빠른 한 쌓이는 양은 계속 커지기만 하므로, 상한이 없다면 끝은 메모리 고갈이다.

> become unresponsive due to 100% CPU usage,

CPU 사용률 100% 때문에 반응이 없어지거나,

- **unresponsive**: 브라우저에서 이건 구체적인 증상이다. 메시지 핸들러가 메인 스레드를 계속 붙들고 있으면 클릭·스크롤·렌더링이 끼어들 틈이 없어져 탭이 얼어붙는다. "응답 없음" 대화상자가 뜨는 그 상태다.
- **100% CPU usage**: 밀린 메시지를 따라잡으려고 쉬지 않고 처리하는 상태. 메모리 경로와는 반대 축이다 — 쌓아두면 메모리가 차고, 악착같이 처리하면 CPU가 탄다.

> or both.

또는 둘 다 벌어진다.

- **both**: 실제로는 이쪽이 흔하다. 처리도 쉬지 않고 하는데(CPU 100%) 그래도 유입을 못 따라가서 대기열도 함께 자라기(메모리) 때문이다.

```
도착 ██████████████████  (초당 100건)
처리 ████                (초당 10건)
     └── 차이 90건/초가 매초 쌓인다
            ├── 대기열에 두면 → 메모리가 찬다
            └── 쉬지 않고 처리하면 → CPU 100%, 탭이 먹통
```

표준 `WebSocket`을 그대로 쓰면서 밀림을 감지하려면 개발자가 직접 재는 수밖에 없다. 잴 수 있는 눈금은 앞에서 본 `bufferedAmount` 하나뿐이다 — `send()`는 줄에 세우기만 하니, 그 줄이 얼마나 길어졌는지를 앱이 읽어 보내는 양을 스스로 줄이는 식이다.

```js
// 표준 WebSocket에서 밀림을 재는 유일한 방법
if (socket.bufferedAmount > 1_000_000) {
  return;                 // ← 대기열이 길면 이번 프레임은 보내지 않는다
}
socket.send(payload);
```

MDN은 이 손수 재는 일을 자동으로 해주는 대안이 있다고 짚는다.

> For an alternative that provides backpressure automatically, see WebSocketStream.

backpressure를 자동으로 제공하는 대안으로는 WebSocketStream을 보라.

- **automatically**: 위 `bufferedAmount` 코드가 아예 필요 없어진다는 뜻이다. 표준 쪽에는 자동으로 되는 게 없어서 저 조건문을 앱이 짊어지는데, 대안 쪽은 그 조절을 스트림이 대신 한다.

> The `WebSocketStream` interface is a Promise-based alternative to `WebSocket`.

WebSocketStream 인터페이스는 WebSocket을 대신하는 Promise 기반 방식이다.

- **Promise-based**: 읽기·쓰기가 `await`로 끝나는 모양이라, "아직 안 끝났다"가 값으로 표현된다. 이 표현 가능성이 흐름 제어의 재료가 된다.

> It uses the Streams API to handle receiving and sending messages, meaning that socket connections can take advantage of stream backpressure automatically, regulating the speed of reading or writing to avoid bottlenecks in the application.

메시지를 받고 보내는 일을 Streams API로 처리해서, 소켓 연결이 스트림의 backpressure를 자동으로 누리고 읽기·쓰기 속도가 조절돼 애플리케이션에 병목이 안 생긴다.

- **automatically**: 개발자가 직접 세는 코드를 짜지 않아도 된다는 뜻. `fetch` 응답 스트림에서 이미 공짜로 얻는 그 동작이 소켓에도 그대로 붙는다.
- **regulating**: 막는 게 아니라 **속도를 맞춘다**. 읽는 쪽이 밀리면 그만큼 천천히 흘러온다.
- **bottlenecks**: 위 그림의 "차이 90건/초"가 생기는 바로 그 지점이다.

---

## 종합

한 문장이 원인 하나와 결과 세 개를 잇는다.

- **원인** — 인터페이스에 느리다고 말할 통로가 없다.
- **조건** — 도착 속도가 처리 속도를 넘는다.
- **결과 1** — 밀린 것을 쌓아두면 메모리가 차오른다.
- **결과 2** — 밀린 것을 쫓아가 처리하면 CPU가 100%가 되어 탭이 반응하지 않는다.
- **결과 3** — 대개 둘이 동시에 온다.

실무에서 이 상황이 나오는 자리는 뻔하다. 초당 수십 번 갱신되는 시세, 협업 편집의 커서 이벤트, 로그 스트리밍처럼 서버가 무한정 밀어붙일 수 있는 화면이다. 그래서 표준 `WebSocket`을 쓴다면 흐름 제어를 애플리케이션이 스스로 만들어 넣게 된다 — 들어온 메시지를 큐에 넣고 상한을 두어 오래된 것을 버리거나, 화면 갱신을 프레임 단위로 묶어 처리량을 고정하는 식이다. `WebSocketStream`은 이 손수 짠 장치를 스트림이 대신 해주는 쪽이고, 그 대신 다음 질문에서 볼 대가가 붙는다.

---

# 표준 WebSocket 인터페이스를 골라야 하는 경우는 언제인가?

## 도입

앞에서 backpressure가 없다는 흠을 봤으니 자연스레 "그럼 뭘 써야 하나"가 남는다. 선택지는 셋이고, 원문은 그 사이에서 표준 `WebSocket`을 고를 조건을 말한다.

> The WebSocket API provides two alternative mechanisms for creating and using web socket connections: the `WebSocket` interface and the `WebSocketStream` interface.

웹소켓 연결을 만들고 쓰는 방법을 이 API가 두 가지로 제공한다 — `WebSocket` 인터페이스와 `WebSocketStream` 인터페이스.

- **alternative mechanisms**: 서로 대신 쓸 수 있는 두 갈래라는 뜻. 겹쳐 쓰는 층이 아니라 하나를 고르는 것이다.

---

## 본문

> The `WebSocket` interface is stable and has good browser and server support.

`WebSocket` 인터페이스는 안정적이며 브라우저와 서버 양쪽에서 지원이 좋다.

- **stable**: 사양이 굳어 바뀌지 않는다는 뜻. 오늘 짠 코드가 내년에도 같은 동작을 한다.
- **browser and server support**: 지원을 양쪽으로 나눠 말한 게 중요하다. 브라우저가 된다고 끝이 아니라 서버 쪽 라이브러리·프록시·로드밸런서까지 그 프로토콜을 알아야 실제로 굴러간다. 표준 WebSocket은 이 생태계가 두껍다.

> If standard WebSocket connections are a good fit for your use case and you need wide browser compatibility, you should employ the WebSockets API to get up and running quickly.

표준 웹소켓 연결이 당신의 사용 사례에 잘 맞고 넓은 브라우저 호환성이 필요하다면, WebSockets API를 써서 빠르게 굴러가게 만들어야 한다.

- **a good fit for your use case**: 조건이다. 앞 질문의 유입 폭주 같은 사정이 없다면 잘 맞는 것이다.
- **wide browser compatibility**: 사용자 브라우저를 고를 수 없는 일반 웹 서비스라면 이건 사실상 필수 조건이다.
- **get up and running quickly**: 고를 이유가 성능이 아니라 **빨리 굴러가는 것**임을 못박는다. 흠이 있는 걸 알면서도 표준을 권하는 근거가 여기다.

대안 두 갈래에는 각각 값표가 붙어 있다. 하나는 앞에서 본 `WebSocketStream`이다.

> The `WebSocketStream` interface is a Promise-based alternative to `WebSocket`.

WebSocketStream 인터페이스는 WebSocket을 대신하는 Promise 기반 방식이다.

> However, `WebSocketStream` is non-standard and currently only supported in one rendering engine.

다만 WebSocketStream은 표준이 아니고 현재 렌더링 엔진 하나에서만 지원된다.

- **non-standard**: 표준화 절차를 통과하지 않았다는 뜻. 사양이 바뀌거나 사라질 수 있고, 그 위험을 앱이 진다.
- **rendering engine**: 브라우저 제품이 아니라 그 속의 엔진 단위로 센다는 점이 중요하다. Chrome과 Edge는 같은 엔진(Blink)을 쓰니 둘 다 된다 해도 "엔진 하나"다. 엔진 단위로 세면 Safari(WebKit)·Firefox(Gecko)가 통째로 빠진다는 게 바로 보인다.
- **currently**: 지금 시점의 상태라는 단서. 나중에 달라질 수 있지만, 지금 서비스에 넣을지는 지금 상태로 정해야 한다.

다른 하나는 웹소켓 밖의 선택지다.

> However, if your application requires a non-standard custom solution, then you should use the WebTransport API.

다만 애플리케이션이 표준으로는 안 되는 맞춤 해법을 요구한다면 WebTransport API를 써야 한다.

- **requires**: "그러면 좋겠다"가 아니라 **요구한다**. 표준 웹소켓으로는 요건 자체가 성립하지 않는 경우에만 넘어가라는 뜻이다.
- **custom solution**: 표준 웹소켓이 정해둔 모양(순서 보장되는 하나의 메시지 흐름)에서 벗어나야 하는 요건을 가리킨다.

```
             표준 WebSocket        WebSocketStream       WebTransport
지원 범위     넓다                  엔진 하나              좁다
사양          안정적                비표준                 표준 밖 요건용
backpressure  없음                  스트림이 자동 처리      —
고르는 이유   빨리, 어디서나 굴러감  흐름 제어가 절실할 때   표준으로 안 되는 요건
```

---

## 종합

원문의 권고는 성능 비교가 아니라 **조건 매칭**이다. 세 갈래를 고르는 축이 이렇게 갈린다.

- **표준 `WebSocket`** — 사용 사례가 표준 연결에 맞고 넓은 호환성이 필요하면 이걸 쓴다. 안정적이고 서버 생태계가 두꺼워 빠르게 굴러간다.
- **`WebSocketStream`** — Promise 기반이라 흐름 제어를 공짜로 얻지만, 비표준이고 엔진 하나에서만 돈다. 사용자 브라우저를 통제할 수 있는 환경이 아니면 대가가 크다.
- **WebTransport** — 표준으로는 성립하지 않는 요건이 있을 때만 간다.

정리하면 표준 `WebSocket`은 "가장 좋아서" 고르는 게 아니라 "**막을 이유가 없으면 기본값**"으로 고르는 쪽이다. 앞 질문에서 본 backpressure 부재는 흠이지만, 대부분의 화면에서는 도착 속도가 처리 속도를 넘지 않아 드러나지 않는다. 넘는 화면이라면 그때 흐름 제어를 직접 넣을지, 호환성을 포기하고 다른 인터페이스로 갈지를 저울에 올리게 된다.

---

# bfcache란 무엇이며 어떻게 동작하는가?

## 도입

브라우저에서 뒤로 가기를 눌렀을 때 이전 페이지가 즉시, 스크롤 위치까지 그대로 나타나는 경험을 해본 적이 있을 것이다. 이는 페이지를 다시 내려받아 그린 결과가 아니다.

브라우저가 페이지를 떠날 때 그 상태를 통째로 얼려 보관해두었다가, 돌아올 때 녹여서 되돌려놓기 때문이다. 이 보관소가 back/forward cache, 줄여서 bfcache다.

---

## 본문

> The back/forward cache, or bfcache, enables much faster back and forward navigation between pages that the user has recently visited.

"back/forward cache, 즉 bfcache는 사용자가 최근에 방문한 페이지 간의 뒤로/앞으로 이동을 훨씬 빠르게 만들어준다."

- **back and forward navigation**: 브라우저의 뒤로·앞으로 버튼을 통한 이동. 주소창에 새로 입력하거나 링크를 클릭하는 일반 이동과 구별된다.
- **recently visited**: 최근 방문한 페이지에 한정된다. 보관 용량과 시간에 한계가 있다.
- **much faster**: 얼마나 빠른가 하면, 네트워크 요청도 파싱도 렌더링도 없으므로 사실상 즉시다.

> It does this by storing a complete snapshot of the page, including the JavaScript heap.

"페이지의 완전한 스냅샷을 JavaScript 힙까지 포함해 저장함으로써 이를 달성한다."

- **complete snapshot**: 부분이 아니라 전부. DOM 트리, 스크롤 위치, 폼 입력값이 모두 포함된다.
- **JavaScript heap**: 스크립트가 만든 객체들이 사는 메모리 영역. 이것까지 보관한다는 말은 전역 변수에 담아둔 값, 클로저가 붙잡고 있는 상태가 전부 살아남는다는 뜻이다.

이것이 일반 캐시와 결정적으로 다른 지점이다. HTTP 캐시는 파일을 보관하므로 돌아오면 페이지를 처음부터 다시 실행하지만, bfcache는 실행 중이던 메모리를 보관하므로 변수에 세어두던 카운터가 그 값 그대로 남아 있다.

> The browser pauses and then resumes JavaScript execution when a page is added to or restored from the bfcache.

"페이지가 bfcache에 들어가거나 bfcache에서 복원될 때 브라우저는 JavaScript 실행을 일시정지했다가 재개한다."

- **pauses**: 종료가 아니라 일시정지다. 페이지를 떠나도 스크립트가 죽지 않고 멈춘 채로 보관된다.
- **resumes**: 처음부터 다시 시작하는 게 아니라 멈춘 지점부터 이어서 실행한다.

```
[페이지 사용 중]
      │  뒤로 가기 (다른 페이지로 이동)
      ▼
JS 실행 일시정지 + 메모리 스냅샷 저장
      ▼
   [bfcache]   ← 페이지가 얼어붙은 채 보관
      │  앞으로 가기 (되돌아옴)
      ▼
스냅샷 복원 + JS 실행 재개
      ▼
[페이지 사용 중]  ← 변수·타이머·스크롤이 그대로
```

---

## 종합

bfcache는 페이지를 "다시 만드는" 대신 "얼렸다 녹이는" 방식이다. 파일을 보관하는 HTTP 캐시와 달리 실행 중이던 메모리 상태 전체를 보관하므로, 복원된 페이지는 새로 로드된 페이지가 아니라 잠시 멈췄던 그 페이지다.

이 차이는 코드를 짜는 방식까지 바꾼다. 흔히 기대하는 페이지 생애주기는 "로드 → 실행 → 종료"인데, bfcache가 개입하면 "로드 → 실행 → 정지 → 재개"라는 경로가 하나 더 생긴다.

재개된 페이지에서는 `DOMContentLoaded`나 `load` 같은 초기화 이벤트가 다시 발생하지 않는다. 초기화 코드를 그런 이벤트에만 걸어둔 페이지는 복원됐을 때 아무것도 다시 준비하지 못한 채 옛 상태로 되살아난다.

그래서 bfcache를 의식하는 페이지는 정지·재개를 따로 감지하는 이벤트를 쓴다. 나가는 순간을 잡는 `pagehide`, 돌아오는 순간을 잡는 `pageshow`가 그것이다.

---

# 페이지가 bfcache에 들어가지 못하면 어떤 일이 생기는가?

## 도입

bfcache는 페이지가 요청해서 들어가는 곳이 아니다. 브라우저가 페이지의 상태를 보고 "이 페이지는 얼렸다 녹여도 안전한가"를 판단해서 넣거나 넣지 않는다.

여기서 안전하지 않다고 판단되면 어떻게 되는지가 이 질문이다.

---

## 본문

> This means that, depending on what the page is doing, it's not always safe for the browser to use the bfcache for the page.

"이는 페이지가 무엇을 하고 있느냐에 따라 브라우저가 그 페이지에 bfcache를 쓰는 것이 항상 안전하지는 않다는 뜻이다."

- **depending on what the page is doing**: 판단 기준이 페이지의 정적인 성격이 아니라 **떠나는 순간 진행 중인 작업**이라는 점이 요점이다. 같은 페이지라도 그때 무엇을 붙잡고 있느냐에 따라 결과가 달라진다.
- **not always safe**: 안전하지 않은 경우가 왜 생기는가 — 앞 질문에서 본 대로 bfcache는 실행을 멈춘 채 보관한다. 그런데 페이지가 외부와 살아 있는 연결을 붙들고 있으면, 그 연결의 상대편은 페이지가 멈춘 줄 모르고 계속 데이터를 보내거나 응답을 기다린다. 얼린 쪽과 살아 있는 쪽의 상태가 어긋나는 것이다.

> If the browser determines that it is not safe, the page will not be added to the bfcache, and the user will not get the performance benefit that it can bring.

"브라우저가 안전하지 않다고 판단하면 그 페이지는 bfcache에 추가되지 않으며, 사용자는 bfcache가 줄 수 있는 성능 이득을 얻지 못한다."

- **determines**: 판단 주체가 브라우저다. 개발자가 "넣어달라"고 지정하는 API는 없고, 넣을 만한 상태를 만들어두는 것이 개발자가 할 수 있는 전부다.
- **will not be added**: 오류가 나거나 경고가 뜨지 않는다. 그냥 조용히 캐시되지 않을 뿐이다.
- **performance benefit**: 즉시 복원이 사라지고 평범한 페이지 로드로 돌아간다.

실패가 조용하다는 것은 개발자가 문제를 알아차리기 어렵다는 뜻이다. 콘솔에 아무 표시도 없이 뒤로 가기가 조금 느려질 뿐이라, 작정하고 확인하지 않으면 놓친다.

Chrome 개발자 도구의 Application 패널에 bfcache 진입 여부와 막힌 이유를 보여주는 항목이 있으니 그것으로 확인한다.

```
페이지를 떠남
      │
      ▼
브라우저가 안전성 판단
      │
      ├── 안전 ──► bfcache 저장 ──► 뒤로 가기 시 즉시 복원
      │
      └── 안전하지 않음 ──► 저장 안 함 ──► 뒤로 가기 시 전체 재로드
                            (경고·오류 없이 조용히)
```

---

## 종합

bfcache에 들어가지 못한다고 페이지가 망가지지는 않는다. 잃는 것은 속도다. 뒤로 가기가 즉시 복원 대신 네트워크 요청부터 다시 시작하는 평범한 로드가 되고, 스크롤 위치와 화면 상태를 되살리는 일도 페이지가 알아서 해야 한다.

문제는 이 손실이 소리 없이 일어난다는 점이다. 예외도, 경고도 없이 "뒤로 가기가 좀 느리네" 정도로만 드러나므로, 개발자 도구로 직접 확인하기 전까지는 원인을 모른 채 지나가기 쉽다.

그리고 판단 기준이 "페이지가 그때 무엇을 하고 있는가"라는 점이 실무에서 중요하다. 페이지 전체가 영구히 배제되는 게 아니라, 떠나는 순간 붙잡고 있던 자원 하나 때문에 그 한 번의 이동이 막히는 것이다. 그렇다면 떠나기 전에 그 자원을 놓아주면 된다는 결론이 자연히 따라 나온다.

---

# 열려 있는 WebSocket 연결은 bfcache에 어떤 영향을 주는가?

## 도입

앞서 본 "떠나는 순간 붙잡고 있는 자원"의 대표적인 예가 바로 열려 있는 WebSocket 연결이다.

이유는 구조를 보면 자연스럽다. WebSocket은 서버와 계속 이어져 있는 통로이고, 서버는 그 통로 반대편에서 이 클라이언트가 살아 있다고 여긴다. 그런데 페이지가 얼려지면 클라이언트 쪽 스크립트는 멈추고, 서버는 그 사실을 모른 채 계속 메시지를 보낸다.

---

## 본문

> Different browsers use different criteria for adding a page to the bfcache, and having an open WebSocket connection may prevent the browser adding your page to the bfcache.

"브라우저마다 페이지를 bfcache에 추가하는 기준이 다르며, 열려 있는 WebSocket 연결이 있으면 브라우저가 페이지를 bfcache에 추가하지 못하게 될 수 있다."

- **different browsers use different criteria**: 표준으로 못박힌 규칙이 아니라 브라우저별 판단이라는 뜻이다. 한 브라우저에서 잘 캐시되던 페이지가 다른 브라우저에서는 안 될 수 있다.
- **an open WebSocket connection**: 존재만으로 문제가 되는 게 아니라 **열려 있는** 상태가 문제다. 이미 닫힌 소켓 객체는 붙잡고 있는 것이 없다.
- **may prevent**: `will prevent`가 아니라 `may prevent`인 이유가 앞의 "브라우저마다 기준이 다르다"에 있다. 확정적 규칙이 아니므로, 특정 브라우저에서 통과한다고 안심할 근거로 삼기 어렵다.
- **prevent ... adding**: 막히는 것은 추가되는 일이다. 앞 질문에서 본 대로 이 실패는 조용히 일어난다.

이 판단이 없으면 어떻게 될까. 브라우저가 열린 소켓을 무시하고 페이지를 얼려버리면, 서버는 응답하지 않는 클라이언트에 계속 메시지를 쏟으며 연결 자원을 붙들게 된다. 복원된 뒤에도 그사이 밀린 메시지를 어떻게 처리할지가 애매해진다. 브라우저가 캐시를 포기하는 쪽을 택하는 것은 이런 어긋남을 피하기 위해서다.

```
[페이지] ══ WebSocket 연결 ══ [서버]
    │                            │
페이지를 떠남                   서버는 모름
    │                            │
    ▼                            ▼
JS 멈춤 (얼려짐)          계속 메시지 전송
    └──────── 상태 어긋남 ───────┘
                 │
                 ▼
      브라우저: bfcache 저장을 포기
```

---

## 종합

WebSocket과 bfcache는 목적이 서로 부딪힌다. WebSocket은 서버와의 연결을 계속 살려두려 하고, bfcache는 페이지를 통째로 멈춰 세우려 한다. 멈춘 페이지가 살아 있는 연결을 붙들고 있는 상태는 성립할 수 없으므로, 브라우저는 둘 중 하나를 포기해야 하고 대개 캐시 쪽을 포기한다.

여기서 실무적으로 두 가지를 짚어둘 만하다.

- **판단은 브라우저 몫이고 기준도 제각각이다** — 원문의 `may`가 그 여지를 남긴다. 한 브라우저에서 잘 되는 것을 근거로 안심하기 어렵다.
- **문제가 되는 것은 "열려 있음"이지 WebSocket을 쓴다는 사실이 아니다** — 실시간 기능을 포기할 필요는 없고, 떠나는 시점에 연결을 닫아두면 된다.

두 번째 지점이 해결의 방향을 그대로 알려준다. 페이지를 떠날 때 연결을 닫고, 돌아왔을 때 다시 열면 양쪽을 모두 얻을 수 있다.

---

# 그래서 WebSocket 연결은 언제 닫아야 하며, 어느 이벤트를 쓰는가?

## 도입

연결을 닫아야 할 시점은 "사용자가 이 페이지를 그만 볼 때"다. 문제는 그 순간을 어떤 이벤트로 잡느냐다.

흔히 떠올리는 `unload`나 `beforeunload`는 여기에 맞지 않는다. 이 이벤트들은 페이지가 완전히 파기되는 것을 전제로 하고, 브라우저는 이런 핸들러가 붙은 페이지를 bfcache에 넣지 않는 경우가 있다. 정리하려다 오히려 캐시를 막는 셈이다.

반면 `pagehide`는 파기되는 경우와 얼려지는 경우 양쪽에서 모두 발생한다.

---

## 본문

> This means it's good practice to close your connection when the user has finished with your page.

"이는 사용자가 페이지 사용을 마쳤을 때 연결을 닫는 것이 좋은 관행이라는 뜻이다."

- **good practice**: 표준이 강제하는 규칙이 아니라 권장되는 습관이라는 표현이다.
- **has finished with your page**: 페이지가 파기됐을 때가 아니라 사용자가 그 페이지를 떠났을 때다. 뒤로 가기로 떠난 경우도 여기 포함되며, 그 경우 페이지는 파기되지 않고 보관된다.

> The best event to use for this is the pagehide event.

"이를 위해 쓸 최선의 이벤트는 pagehide 이벤트다."

- **best**: 대안들과 비교한 결과라는 뜻이다. `pagehide`는 페이지가 파기될 때와 bfcache로 들어갈 때 모두 발생하므로, 두 경우를 한 핸들러로 덮을 수 있다.

```js
window.addEventListener("pagehide", () => {
  if (websocket) {
    log("CLOSING");
    websocket.close();
    websocket = null;
    window.clearInterval(pingInterval);
  }
});
```

핸들러가 하는 일이 셋인데, 각각 이유가 다르다.

- **`websocket.close()`** — 연결을 실제로 끊는다. 이것이 bfcache를 막던 원인을 제거하는 핵심 동작이다. 서버 쪽에서도 이 클라이언트가 떠났음을 알게 되어 자원을 회수할 수 있다.
- **`websocket = null`** — 변수에서 소켓 참조를 지운다. `close()`를 불렀다고 변수가 비워지지는 않으므로, 그대로 두면 닫힌 소켓 객체를 계속 가리킨다. bfcache는 메모리를 통째로 보관하므로 이 참조도 함께 얼려져 남고, 복원된 뒤 다른 코드가 그 죽은 객체를 살아 있는 것으로 착각해 `send()`를 부를 수 있다. `null`로 비워두면 `if (websocket)` 같은 검사로 걸러진다.
- **`window.clearInterval(pingInterval)`** — 주기 전송 타이머를 멈춘다. 타이머는 소켓과 무관하게 살아 있으므로 따로 해제해야 한다.

`if (websocket)`으로 감싼 것도 까닭이 있다. `pagehide`는 페이지를 떠날 때마다 발생하는데, 이미 닫아 `null`로 비워둔 상태에서 다시 불릴 수 있기 때문이다.

```
사용자가 페이지를 떠남
        │
        ▼
   pagehide 발생
        │
        ├─ websocket.close()      → 연결 끊김 (bfcache 차단 요인 제거)
        ├─ websocket = null       → 죽은 객체 참조 제거
        └─ clearInterval(...)     → 타이머 정지
        │
        ▼
브라우저가 페이지를 bfcache에 저장 가능
```

---

## 종합

`pagehide`에서 연결을 닫는 것은 두 가지를 동시에 얻기 위한 선택이다. 페이지를 쓰는 동안에는 실시간 연결을 유지하고, 떠나는 순간 그것을 놓아주어 브라우저가 페이지를 얼릴 수 있게 한다.

`unload`·`beforeunload` 대신 `pagehide`를 쓰는 이유가 여기 있다. 앞의 둘은 페이지가 파기된다는 전제 위에 있어서 bfcache와 충돌하지만, `pagehide`는 파기되는 경우와 보관되는 경우를 모두 덮는다.

정리할 것이 세 가지인 이유도 각각 다른 문제를 막기 때문이다.

- **연결을 닫는 것** — 브라우저가 페이지를 캐시하지 못하게 막던 원인을 없앤다
- **참조를 비우는 것** — 복원된 페이지에서 죽은 소켓을 살아 있는 것으로 오인하지 않게 한다
- **타이머를 끄는 것** — 소켓이 없는 상태에서 전송을 시도하지 않게 한다

셋 중 하나라도 빠지면 증상이 다르게 나타난다. 닫지 않으면 뒤로 가기가 느려지고, 참조를 남기면 복원 뒤 전송이 실패하며, 타이머를 남기면 오류가 반복해서 쌓인다.

---

# bfcache에서 복원된 페이지에서 연결을 다시 열려면 어떻게 하는가?

## 도입

`pagehide`에서 연결을 닫았다면, 사용자가 뒤로 가기로 돌아왔을 때 그 페이지에는 연결이 없다. 화면과 변수는 그대로 복원되지만 소켓만 사라진 상태다.

돌아오는 순간을 잡아 다시 열어야 하는데, 그 이벤트가 `pageshow`다. 다만 이 이벤트에는 함정이 하나 있다.

---

## 본문

> Conversely, by listening for the pageshow event, you can seamlessly start the connection again when the page is restored from the bfcache.

"반대로 pageshow 이벤트를 들으면, 페이지가 bfcache에서 복원될 때 매끄럽게 연결을 다시 시작할 수 있다."

- **conversely**: 앞의 `pagehide`와 짝이 되는 반대 방향이라는 표시다. 나갈 때 닫았으니 들어올 때 연다.
- **seamlessly**: 사용자가 눈치채지 못하게. 화면 상태는 이미 복원되어 있으므로, 연결만 조용히 되살리면 사용자에게는 끊긴 적이 없는 것처럼 보인다.
- **restored from the bfcache**: 새로 로드된 것이 아니라 보관된 상태에서 되살아난 것.

> In the following example, we start the initial connection when the page is first loaded and only reconnect when the page is restored (checking for event.persisted):

"다음 예제에서는 페이지가 처음 로드될 때 최초 연결을 시작하고, 페이지가 복원될 때만 재연결한다 (event.persisted를 검사해서)."

- **only ... when the page is restored**: "복원될 때만"이라는 한정이 붙은 이유가 문제의 핵심이다. `pageshow`는 최초 로드 때도 발생하므로, 아무 조건 없이 여기서 연결을 만들면 최초 로드에서 소켓이 두 개 만들어진다.
- **event.persisted**: 이 페이지가 보관됐다가 되살아난 것인지를 알려주는 불리언 값. `true`면 bfcache에서 복원된 것이고, `false`면 평범한 최초 로드다.

전체 코드는 이렇게 된다.

```js
let websocket = null;

function initializeWebSocketListeners(ws) {
  ws.addEventListener("open", () => {
    log("CONNECTED");
    pingInterval = setInterval(() => {
      log(`SENT: ping: ${counter}`);
      ws.send("ping");
    }, 1000);
  });

  ws.addEventListener("close", () => {
    log("DISCONNECTED");
    clearInterval(pingInterval);
  });

  ws.addEventListener("message", (e) => {
    log(`RECEIVED: ${e.data}: ${counter}`);
    counter++;
  });

  ws.addEventListener("error", (e) => {
    log(`ERROR`);
  });
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    websocket = new WebSocket(wsUri);
    initializeWebSocketListeners(websocket);
  }
});

log("OPENING");
websocket = new WebSocket(wsUri);
initializeWebSocketListeners(websocket);
```

이벤트 리스너 등록을 함수로 묶어둔 까닭은 소켓 객체가 두 번(최초 로드, 복원 후) 만들어지기 때문이다. 새 객체는 이전 객체의 리스너를 물려받지 않으므로 리스너는 객체마다 새로 붙여야 한다.

함수로 묶어두지 않으면 같은 리스너 네 개를 두 군데에 복사해두게 된다.

복원 후에도 카운터가 이어진다는 점도 짚어둘 만하다.

> In Chrome, you should see that the example starts the connection again, and keeps its original context: so, for example, it remembers the count of exchanged messages.

"Chrome에서는 예제가 연결을 다시 시작하면서 원래의 컨텍스트를 유지하는 것을 볼 수 있다. 예를 들어 주고받은 메시지 수를 기억한다."

- **original context**: 원래의 실행 맥락. 전역 변수 `counter`가 그 값 그대로 살아 있다는 뜻이다.
- **remembers**: 페이지가 다시 로드됐다면 `counter`는 초기값으로 돌아갔을 것이다. 기억한다는 것이 곧 재로드가 아니었다는 증거다.

```
최초 로드
   │
   ├─ new WebSocket + 리스너 등록
   │
   ▼ (페이지를 떠남)
pagehide → close() + 참조 비움 + 타이머 정지
   │
   ▼
[bfcache]  ← DOM·변수는 그대로, 소켓만 없음
   │
   ▼ (뒤로 가기로 돌아옴)
pageshow (event.persisted === true)
   │
   └─ new WebSocket + 리스너 등록  ← counter 등 기존 변수는 유지된 채
```

---

## 종합

`pagehide`와 `pageshow`는 한 쌍으로 동작한다. 나갈 때 연결을 놓아 브라우저가 페이지를 얼릴 수 있게 하고, 돌아올 때 연결만 다시 세워 원래 상태 위에 얹는다. 결과적으로 실시간 연결과 즉시 복원이라는, 서로 부딪히던 두 가지를 모두 얻는다.

여기서 놓치기 쉬운 지점이 `event.persisted` 검사다. `pageshow`가 최초 로드에서도 발생한다는 사실을 모르면, 조건 없이 연결을 만들어 최초 로드에서 소켓 두 개가 동시에 열리게 된다. 두 소켓이 각자 타이머를 걸고 각자 메시지를 받으므로 로그가 두 배로 찍히고 서버 부하도 두 배가 된다. 그런데 화면상으로는 잘 동작하는 것처럼 보여서 알아차리기가 늦다.

복원된 페이지가 변수를 그대로 유지한다는 점은 이득이면서 부담이다. 화면 상태를 다시 만들 필요가 없는 대신, 페이지를 떠나며 정리한 자원을 가리키던 변수까지 함께 살아남는다.

`pagehide`에서 참조를 `null`로 비워두는 습관이 여기서 효과를 낸다. 복원된 코드가 낡은 객체를 살아 있는 것으로 오인하지 않게 막아주기 때문이다.
