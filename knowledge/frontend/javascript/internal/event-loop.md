---
tags: [javascript, browser, concept]
---

# Questions
- Macrotask와 Microtask는 각각 무엇인가?
- 아래 코드의 콘솔 출력 순서는 어떻게 되는가?
- task가 실행되는 도중에도 브라우저 렌더링이 일어날 수 있는가?
- 비동기 작업은 호출되자마자 Queue에 들어가는가?
---
# Answers

## Macrotask와 Microtask는 각각 무엇인가?

### User Answer
Macrotask는 일반적으로 `setTimeout`으로 만든 작업을 말한다.
Microtask는 일반적으로 `Promise`로 만든 작업을 말한다.

이벤트 루프는 한 틱(tick)에 다음과 같이 동작한다.
- Microtask Queue: 큐가 완전히 비워질 때까지 계속 꺼내 실행한다. 실행 도중 새로운 Microtask가 추가되면 그것까지 포함하여 큐가 0이 될 때까지 멈추지 않는다.
- Macrotask Queue: 한 틱에 딱 하나만 꺼내 실행한 뒤, 다시 이벤트 루프의 제어권이 루프로 돌아간다.

## 아래 코드의 콘솔 출력 순서는 어떻게 되는가?

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

> #### Key Terms:
> - **task**: 이벤트 루프가 한 번에 실행하는 동기적 실행 단위.
> - **rendering**: 브라우저가 DOM 변경 사항을 화면에 페인트하는 작업.

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

### AI Annotation
브라우저는 매 틱마다 무조건 렌더링을 하지 않는다.
일반적으로 60Hz 모니터 기준 약 16.7ms마다 렌더링 기회(Rendering Opportunity)를 가지며, Microtask Queue가 비워진 시점에 마침 렌더링 주기가 돌아왔다면 그때 비로소 화면을 업데이트한다.
또한 Microtask가 무한히 추가되면 (예: `function loop() { Promise.resolve().then(loop); }`) 이벤트 루프는 절대 렌더링 단계로 진입하지 못하며, 화면이 완전히 굳어버리는(Jank) 현상이 발생한다.

## 비동기 작업은 호출되자마자 Queue에 들어가는가?

### User Answer
들어가지 않는다.
엄격하게 따지면 비동기 작업은 호출 시점에 Queue에 들어가는 게 아니라, 그 비동기 작업이 완료된 후에 Queue에 들어간다.

예를 들어 `setTimeout(task, 10000);`이라는 코드가 실행되면, 10초 동안 Node.js API나 Web API를 통해 기다리다가 10초가 끝나면 `task`가 Queue에 들어온다.
이건 JS 스펙이 아니라 `setTimeout` 자체가 Node.js API, Web API의 스펙이다.

Promise도 동일하다. `setTimeout`과 달리 Promise 자체는 JS 스펙이 맞지만, `fetch()`나 `fs.readFile()` 같이 무언가를 기다리는 동작은 Node.js API나 Web API에서 담당한다.
Promise는 그저 미래·대기·성공·실패를 표현하는 문법일 뿐이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model
- https://javascript.info/event-loop
- https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
- https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#improving_stack_trace
