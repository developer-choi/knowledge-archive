---
tags: [javascript, browser, concept]
source: official
priority: 1
---

# Questions
- 이벤트 루프란 무엇이고 왜 필요한가?
- 이벤트 루프는 내부적으로 job을 어떻게 꺼내 실행하며, 하나의 job은 언제 완료로 간주되는가?
- macrotask와 microtask는 각각 무엇이며, 어떻게 다른가?
- 이미 resolve된 Promise에 `.then` 콜백을 두 개 달면 출력이 예측 가능한가? 그 이유는?
- task가 실행되는 도중에도 브라우저 렌더링이 일어날 수 있는가?
- [UNVERIFIED] 이벤트 루프는 JavaScript 런타임의 어떤 구성요소들과 함께 동작하는가?
---
# Answers

## 이벤트 루프란 무엇이고 왜 필요한가?

### Official Answer
> An agent is a thread, which means the interpreter can only process one statement at a time. But if the code needs to perform asynchronous action, then we cannot progress unless that action is completed. However, it would be detrimental to user experience if that halts the whole program—the nature of JavaScript as a web scripting language requires it to be never blocking. Therefore, the code that handles the completion of that asynchronous action is defined as a callback. This callback defines a job, which gets placed into a job queue—or, in HTML terminology, an event loop—once the action is completed.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#job_queue_and_event_loop

---

## 이벤트 루프는 내부적으로 job을 어떻게 꺼내 실행하며, 하나의 job은 언제 완료로 간주되는가?

### Official Answer
> Every time, the agent pulls a job from the queue and executes it. When the job is executed, it may create more jobs, which are added to the end of the queue. Jobs can also be added via the completion of asynchronous platform mechanisms, such as timers, I/O, and events. A job is considered completed when the stack is empty; then, the next job is pulled from the queue.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#job_queue_and_event_loop

---

## macrotask와 microtask는 각각 무엇이며, 어떻게 다른가?

### Official Answer
> A timeout or interval created with setTimeout() or setInterval() is reached, causing the corresponding callback to be added to the task queue.
>
> JavaScript promises and the Mutation Observer API both use the microtask queue to run their callbacks, but there are other times when the ability to defer work until the current event loop pass is wrapping up is helpful.
>
> Jobs might not be pulled with uniform priority—for example, HTML event loops split jobs into two categories: tasks and microtasks. Microtasks have higher priority and the microtask queue is drained first before the task queue is pulled.
>
> Each time a task exits, the event loop checks to see if the task is returning control to other JavaScript code. If not, it runs all of the microtasks in the microtask queue. The microtask queue is, then, processed multiple times per iteration of the event loop, including after handling events and other callbacks.
>
> If a microtask adds more microtasks to the queue by calling queueMicrotask(), those newly-added microtasks execute before the next task is run. That's because the event loop will keep calling microtasks until there are none left in the queue, even if more keep getting added.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#job_queue_and_event_loop
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide

## 이미 resolve된 Promise에 `.then` 콜백을 두 개 달면 출력이 예측 가능한가? 그 이유는?

```js
const promise = Promise.resolve();
let i = 0;
promise.then(() => {
  i += 1;
  console.log(i);
});
promise.then(() => {
  i += 1;
  console.log(i);
});
```

### Official Answer
> Each job is processed completely before any other job is processed. This offers some nice properties when reasoning about your program, including the fact that whenever a function runs, it cannot be preempted and will run entirely before any other code runs (and can modify data the function manipulates).
>
> In this example, we create an already-resolved promise, which means any callback attached to it will be immediately scheduled as jobs. The two callbacks seem to cause a race condition, but actually, the output is fully predictable: `1` and `2` will be logged in order. This is because each job runs to completion before the next one is executed, so the overall order is always `i += 1; console.log(i); i += 1; console.log(i);` and never `i += 1; i += 1; console.log(i); console.log(i);`.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#run-to-completion

---

## task가 실행되는 도중에도 브라우저 렌더링이 일어날 수 있는가?

### Official Answer
> Rendering never happens while the engine executes a task. It doesn't matter if the task takes a long time.
> Changes to the DOM are painted only after the task is complete.

### Reference
- https://javascript.info/event-loop

### User Answer
일어나지 않는다.
task가 실행되는 동안에는 아무리 그 안에서 렌더링하는 코드를 작성해도 실제로 렌더링이 일어나지 않고, 해당 task가 모두 끝나야 렌더링이 된다.

예를 들어 아래 코드를 실행하면

```html
<body>
  <div id="progress"></div>
  <script>
    function main() {
      progress.innerHTML = 'Progressing';
      for (let i = 0; i < 1e10; i++) {}
      progress.innerHTML = 'Done';
    }
    main();
  </script>
</body>
```

기존에는 (1) 화면에 Progressing이 보이고 (2) for 문 도는 동안 잠시 뒤 (3) 화면에 Done이 보일 것이라 예상했지만, 실제로는 아무것도 안 보이다가 바로 Done이 보였다.
즉 `main()`이라는 task가 실행되는 동안에는 그 안에서 작성한 렌더링 코드가 즉시 반영되지 않고, `main()`이 모두 끝나야 렌더링이 된다.

---

## [UNVERIFIED] 이벤트 루프는 JavaScript 런타임의 어떤 구성요소들과 함께 동작하는가?

### User Answer
외부 자료 발췌:
- Javascript Runtime은 Heap, Call Stack, Web APIs(DOM, Ajax, setTimeout 등), Callback Queue, Event Loop로 구성된다.
- 싱글 스레드는 하나의 힙 영역과 하나의 콜스택을 가진다. 하나의 콜스택을 가진다는 의미는 한 번에 한 가지 일밖에 하지 못한다는 의미다.
- V8 엔진은 크게 두 부분으로 구성된다.
  - 메모리 힙(Memory Heap): 메모리 할당이 이루어지는 곳
  - 콜스택(Call Stack): 코드가 실행되면서 스택 프레임이 쌓이는 곳
- `Uncaught RangeError: Maximum call stack size exceeded`는 콜스택이 가득 차서 발생하는 에러다.
- 콜스택이 멈춰 코드가 종료될 때까지 유저 클릭에 아무 반응도 하지 않는 상태를 블로킹 상태라고 한다.
- 싱글 스레드인 자바스크립트가 매번 5초가 지났는지 체크하지 않고도 5초 후에 콜백을 호출할 수 있는 이유는, 브라우저가 자바스크립트를 실행하는 것 이상의 일을 하기 때문이다.

Event Loop는 Call Stack이 비어있지 않으면 Callback Queue의 작업을 Call Stack에 넣지 않는다. 그래서 서버에서 데이터가 도착했더라도 실행 중인 작업이 모두 끝나야 그 데이터를 처리할 수 있다.

### Reference
- https://beomy.github.io/tech/javascript/javascript-runtime/
- https://engineering.huiseoul.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%91%EB%8F%99%ED%95%98%EB%8A%94%EA%B0%80-%EC%97%94%EC%A7%84-%EB%9F%B0%ED%83%80%EC%9E%84-%EC%BD%9C%EC%8A%A4%ED%83%9D-%EA%B0%9C%EA%B4%80-ea47917c8442
