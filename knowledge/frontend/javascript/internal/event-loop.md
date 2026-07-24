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
- [UNVERIFIED] 아래 코드의 콘솔 출력 순서는 어떻게 되는가?
- task가 실행되는 도중에도 브라우저 렌더링이 일어날 수 있는가?
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

## [UNVERIFIED] 아래 코드의 콘솔 출력 순서는 어떻게 되는가?

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);
```

### User Answer
결과는 `1 7 3 5 2 6 4` 순서로 출력된다.

(1회차: 동기 코드 실행)
- 콘솔에 1 출력
- macrotask queue에 2를 출력하는 작업 추가
- microtask queue에 3을 출력하는 작업 추가
- microtask queue에 (macrotask에 4를 출력하는 작업을 추가하는) 작업 추가
- microtask queue에 5를 출력하는 작업 추가
- macrotask queue에 6을 출력하는 작업 추가
- 콘솔에 7 출력

여기까지 콘솔에는 1, 7이 출력되어 있다.
- macrotask queue: [2 출력, 6 출력]
- microtask queue: [3 출력, macrotask에 4 출력 추가, 5 출력]

(2회차: microtask queue가 모두 비워질 때까지 실행)
- 3 출력
- macrotask queue에 4를 출력하는 작업 추가
- 5 출력

여기까지 콘솔은 1, 7, 3, 5.
- microtask queue: 비어 있음
- macrotask queue: [2 출력, 6 출력, 4 출력]

(3회차: macrotask 하나씩 꺼내 실행, 사이사이 microtask queue 확인)
- 2 출력
- 6 출력
- 4 출력

최종 출력: `1 7 3 5 2 6 4`

## task가 실행되는 도중에도 브라우저 렌더링이 일어날 수 있는가?

### Official Answer
> Rendering never happens while the engine executes a task. It doesn't matter if the task takes a long time.
> Changes to the DOM are painted only after the task is complete.

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
