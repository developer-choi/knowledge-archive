---
tags: [javascript, browser, concept]
source: official
priority: 1
---

# Questions
- JavaScript 엔진이란 무엇인가?
- 이벤트 루프는 어떤 문제를 어떻게 해결하는가?
- [UNVERIFIED] Macrotask와 Microtask는 각각 무엇인가?
- [UNVERIFIED] 아래 코드의 콘솔 출력 순서는 어떻게 되는가?
- task가 실행되는 도중에도 브라우저 렌더링이 일어날 수 있는가?
---
# Answers

## JavaScript 엔진이란 무엇인가?

### Official Answer
A JavaScript engine is a software component that executes JavaScript code.

The JavaScript engine does nothing most of the time, it only runs if a script/handler/event activates.

Where the JavaScript engine waits for tasks, executes them and then sleeps, waiting for more tasks.

> #### User Annotation:
> JS 엔진 중 대표적인 게 V8이고, 고급언어를 기계어로 변환함.
> 작업을 기다리고 쉬고 그다음 작업 기다리고, 대부분의 시간동안 아무것도 안하다가 작업이 있을 때만 일한대요.

### Reference
- https://en.wikipedia.org/wiki/JavaScript_engine
- https://javascript.info/event-loop

## 이벤트 루프는 어떤 문제를 어떻게 해결하는가?

### Official Answer
It may happen that a task comes while the engine is busy, then it's enqueued.
The tasks form a queue, so-called "macrotask queue" (v8 term).

Tasks from the queue are processed on "first come – first served" basis.
When the engine browser is done with the script, it handles mousemove event, then setTimeout handler, and so on.

> #### User Annotation:
> 작업의 순서를 결정하는 방식으로 해결합니다.
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

## [UNVERIFIED] Macrotask와 Microtask는 각각 무엇인가?

### User Answer
Macrotask는 일반적으로 `setTimeout`으로 만든 작업을 말한다.
Microtask는 일반적으로 `Promise`로 만든 작업을 말한다.

이벤트 루프는 한 틱(tick)에 다음과 같이 동작한다.
- Microtask Queue: 큐가 완전히 비워질 때까지 계속 꺼내 실행한다. 실행 도중 새로운 Microtask가 추가되면 그것까지 포함하여 큐가 0이 될 때까지 멈추지 않는다.
- Macrotask Queue: 한 틱에 딱 하나만 꺼내 실행한 뒤, 다시 이벤트 루프의 제어권이 루프로 돌아간다.

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

> #### AI Annotation:
> 브라우저는 매 틱마다 무조건 렌더링을 하지 않는다.
> 일반적으로 60Hz 모니터 기준 약 16.7ms마다 렌더링 기회(Rendering Opportunity)를 가지며, Microtask Queue가 비워진 시점에 마침 렌더링 주기가 돌아왔다면 그때 비로소 화면을 업데이트한다.
> 또한 Microtask가 무한히 추가되면 (예: `function loop() { Promise.resolve().then(loop); }`) 이벤트 루프는 절대 렌더링 단계로 진입하지 못하며, 화면이 완전히 굳어버리는(Jank) 현상이 발생한다.

