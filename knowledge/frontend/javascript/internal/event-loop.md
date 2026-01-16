---
tags: [event-loop, javascript]
---
# Questions

- [What is the Event Loop?](#what-is-the-event-loop)
  - [What is the JavaScript Engine?](#what-is-the-javascript-engine)
  - [What problem does the Event Loop solve, and how?](#what-problem-does-the-event-loop-solve-and-how)
  - [Why don't other languages need an Event Loop to handle this?](#why-dont-other-languages-need-an-event-loop-to-handle-this)
  - [What are Web APIs and Node.js APIs?](#what-are-web-apis-and-nodejs-apis)
  - [What are Macrotasks and Microtasks?](#what-are-macrotasks-and-microtasks)

---

# Answers

## What is the Event Loop?
### Official Answer
TODO

### User Annotation
정의 = 메커니즘. 알고리즘
목적 = Thread, Blocking
원리 = 작업의 순서를 결정 > Callstack, Queue 2개 > Web API, Nodejs API

### Reference
- [Event Loop (Google Docs)](https://docs.google.com/document/d/1vojFrv4Fl79kJ819S4V78Kjd6KtAvY2A6JN2JB6aYjc/edit?tab=t.0#heading=h.246vbnd3n9fz)

---

## What is the JavaScript Engine?
### Official Answer
A JavaScript engine is a software component that executes JavaScript code.

The JavaScript engine does nothing most of the time, it only runs if a script/handler/event activates.

Where the JavaScript engine waits for tasks, executes them and then sleeps, waiting for more tasks.

> User Annotation
> JS 엔진 중 대표적인 게 V8이고, 고급언어를 기계어로 변환함.
> 작업을 기다리고 쉬고 그다음 작업 기다리고, 대부분의 시간동안 아무것도 안하다가 작업이 있을 때만 일한대요.

### Reference
- [JavaScript engine - Wikipedia](https://en.wikipedia.org/wiki/JavaScript_engine)
- [Event loop - javascript.info](https://javascript.info/event-loop)

---

## What problem does the Event Loop solve, and how?
### Official Answer
It may happen that a task comes while the engine is busy, then it's enqueued.
The tasks form a queue, so-called "macrotask queue" (v8 term).

Tasks from the queue are processed on "first come – first served" basis.
When the engine browser is done with the script, it handles mousemove event, then setTimeout handler, and so on.

> User Annotation
> 작업의 **순서를 결정**하는 방식으로 해결합니다.
>
> - JS 엔진이 일하고 있다 = 콜스택에 무언가 있다.
> - 그 상태에서 새로운 작업이 추가된다 = 큐에 들어간다
> - JS 엔진이 쉬고있다 = 콜스택이 비어있다 = 이벤트루프가 큐에있던거 콜스택으로 넣어준다 (근데 큐라서 FIFO)
>
> V8 용어로는 이걸 macrotask queue라고 한다네요.
> (MDN에서는 event queue라고 부르던데)
>
> 크게 3가지 작업으로 분류함:
> 1. 현재 처리중인 작업 (callstack에 있음)
> 2. Microtask queue에 있는 작업
> 3. Macrotask queue에 있는 작업

### Reference
- [Event loop - javascript.info](https://javascript.info/event-loop)

---

## Why don't other languages need an Event Loop to handle this?
### Official Answer
TODO

### User Annotation
어떤 방식이든 간에, 브라우저가 안멈추게만 하면 되기 때문에,
멀티스레드 라는 방식을 사용하는것도 가능한 방법은 맞음.

멀티스레드 기반의 코드는 실행순서 생각하기 너무 어려움.
코드실행순서, 데드락 등 너무 어려움.

### Reference
TODO

---

## What are Web APIs and Node.js APIs?
### Official Answer
TODO

> User Annotation
> setTimeout()이 실행되면, 즉시 Web API나 Nodejs API로 이관되어 메인 스레드는 다른 일을 하고, 카운트는 따로 처리됩니다.
> 완료되면 Queue에 들어갑니다.
>
> Promise 객체가 생성되고나면 마찬가지로 이관되어 메인스레드는 다른 일을 하고 그 사이 Network 요청이나 File 입출력같은 작업이 따로 처리되며 완료되면 Queue에 들어갑니다.

### Reference
TODO

---

## What are Macrotasks and Microtasks?
### Official Answer
TODO

> User Annotation
> - Macrotask = 일반적으로 setTimeout으로 만든 작업
> - Microtask = 일반적으로 Promise로 만든 작업

### Reference
TODO
