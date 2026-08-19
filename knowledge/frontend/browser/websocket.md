---
tags: [protocol, browser, network, javascript]
source: official
priority: 2
publishable: true
---
# Questions
- WebSocket API는 브라우저와 서버 사이에 어떤 통신을 가능하게 하는가?
  - WebSocket API를 쓰면, 서버의 답을 받기 위해 무엇을 하지 않아도 되는가?
- WebSocket 객체는 어떤 역할을 하는가?
- WebSocket 통신을 시작하려면 무엇을 만들어야 하며, 그 객체를 만든 직후 무슨 일이 일어나는가?
  - 실제 서비스에서 WebSocket 주소는 어떤 형태여야 하는가?
- WebSocket에서 open 이벤트는 언제 발생하며, 그 시점은 무엇을 가르는가?
- WebSocket에서 error 이벤트는 언제 발생하는가?
- close 이벤트는 어떤 경우들에 발생하는가?
- send()로 메시지를 보낼 때, 호출이 반환된 시점과 실제 전송 시점은 어떤 관계인가?
- 서버가 보낸 메시지는 어떻게 받는가?
- WebSocket 인터페이스에는 backpressure가 없다. 이 때문에 어떤 상황에서 무슨 일이 벌어지는가?
- 표준 WebSocket 인터페이스를 골라야 하는 경우는 언제인가?
- bfcache란 무엇이며 어떻게 동작하는가?
  - 페이지가 bfcache에 들어가지 못하면 어떤 일이 생기는가?
- 열려 있는 WebSocket 연결은 bfcache에 어떤 영향을 주는가?
  - 그래서 WebSocket 연결은 언제 닫아야 하며, 어느 이벤트를 쓰는가?
  - bfcache에서 복원된 페이지에서 연결을 다시 열려면 어떻게 하는가?

---

# Answers

## WebSocket API는 브라우저와 서버 사이에 어떤 통신을 가능하게 하는가?

### Official Answer

The **WebSocket API** makes it possible to open a two-way interactive communication session between the user's browser and a server.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

## WebSocket API를 쓰면, 서버의 답을 받기 위해 무엇을 하지 않아도 되는가?

### Official Answer

With this API, you can send messages to a server and receive responses without having to poll the server for a reply.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

## WebSocket 객체는 어떤 역할을 하는가?

### Official Answer

The `WebSocket` object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

## WebSocket 통신을 시작하려면 무엇을 만들어야 하며, 그 객체를 만든 직후 무슨 일이 일어나는가?

### Official Answer

To communicate using the WebSocket protocol, you need to create a WebSocket object. As soon as you create this object, it will start trying to connect to the specified server.

The WebSocket constructor takes one mandatory argument — the URL of the WebSocket server to connect to.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## 실제 서비스에서 WebSocket 주소는 어떤 형태여야 하는가?

### Official Answer

In a real application, web pages should be served using HTTPS, and the WebSocket connection should use wss as the protocol.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## WebSocket에서 open 이벤트는 언제 발생하며, 그 시점은 무엇을 가르는가?

### Official Answer

Once the connection is established, the open event is fired, and after this point the socket is able to transmit data.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## WebSocket에서 error 이벤트는 언제 발생하는가?

### Official Answer

If an error occurs while the connection is being established or at any time after it is established, the error event will be fired.

Fired when a connection with a WebSocket has been closed because of an error, such as when some data couldn't be sent.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
- https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

## close 이벤트는 어떤 경우들에 발생하는가?

### Official Answer

When the connection is closed, because either the client or the server closed it or because an error occurred, the close event will be fired.

On an error, the connection is closed and the close event will be fired.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## send()로 메시지를 보낼 때, 호출이 반환된 시점과 실제 전송 시점은 어떤 관계인가?

### Official Answer

We've already seen that once the connection is established, we can use the send() method to send messages to the server:

The send() method is asynchronous: it does not wait for the data to be transmitted before returning to the caller. It just adds the data to its internal buffer and begins the process of transmission.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## 서버가 보낸 메시지는 어떻게 받는가?

### Official Answer

To receive messages from the server, we listen for the message event.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## WebSocket 인터페이스에는 backpressure가 없다. 이 때문에 어떤 상황에서 무슨 일이 벌어지는가?

### Official Answer

However it doesn't support backpressure. As a result, when messages arrive faster than the application can process them it will either fill up the device's memory by buffering those messages, become unresponsive due to 100% CPU usage, or both.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

## 표준 WebSocket 인터페이스를 골라야 하는 경우는 언제인가?

### Official Answer

The `WebSocket` interface is stable and has good browser and server support.

If standard WebSocket connections are a good fit for your use case and you need wide browser compatibility, you should employ the WebSockets API to get up and running quickly.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

## bfcache란 무엇이며 어떻게 동작하는가?

### Official Answer

The back/forward cache, or bfcache, enables much faster back and forward navigation between pages that the user has recently visited. It does this by storing a complete snapshot of the page, including the JavaScript heap.

The browser pauses and then resumes JavaScript execution when a page is added to or restored from the bfcache.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## 페이지가 bfcache에 들어가지 못하면 어떤 일이 생기는가?

### Official Answer

This means that, depending on what the page is doing, it's not always safe for the browser to use the bfcache for the page. If the browser determines that it is not safe, the page will not be added to the bfcache, and the user will not get the performance benefit that it can bring.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## 열려 있는 WebSocket 연결은 bfcache에 어떤 영향을 주는가?

### Official Answer

Different browsers use different criteria for adding a page to the bfcache, and having an open WebSocket connection may prevent the browser adding your page to the bfcache.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## 그래서 WebSocket 연결은 언제 닫아야 하며, 어느 이벤트를 쓰는가?

### Official Answer

This means it's good practice to close your connection when the user has finished with your page. The best event to use for this is the pagehide event.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

## bfcache에서 복원된 페이지에서 연결을 다시 열려면 어떻게 하는가?

### Official Answer

Conversely, by listening for the pageshow event, you can seamlessly start the connection again when the page is restored from the bfcache. In the following example, we start the initial connection when the page is first loaded and only reconnect when the page is restored (checking for event.persisted):

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
