# [UNVERIFIED] Macrotask와 Microtask는 각각 무엇인가?

## 도입

이벤트 루프는 비동기 작업들을 두 종류의 큐로 나눠 관리한다. 큐의 종류에 따라 실행 순서와 우선순위가 달라지며, 이 차이를 모르면 콘솔 출력 순서를 예측하기 어렵다.

---

## 본문

Macrotask와 Microtask는 OA 없이 실무 원칙으로 정리한다.

- **Macrotask (= Task)**: `setTimeout`, `setInterval`, `setImmediate`, I/O 이벤트, UI 렌더링 콜백. 한 틱에 하나씩만 실행된다.
- **Microtask**: `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`. 큐가 완전히 빌 때까지 모두 실행된다.

```
이벤트 루프 한 틱 흐름:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Call Stack 비워지면
2. Microtask Queue → 전부 실행 (새 microtask 추가돼도 계속)
3. Rendering Opportunity (60Hz 기준 약 16.7ms 주기)
4. Macrotask Queue → 하나만 꺼내 실행
5. 다시 2번으로
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Microtask는 Macrotask보다 항상 먼저 처리된다. `setTimeout(fn, 0)`이 `Promise.resolve().then(fn)`보다 늦게 실행되는 이유가 이것이다.

---

## 종합

Microtask가 무한히 추가되는 상황(`function loop() { Promise.resolve().then(loop); }`)을 만들면 이벤트 루프는 Macrotask 처리와 렌더링 단계로 진입하지 못한다. 화면이 완전히 굳어버리는(Jank) 현상이 나타난다. Microtask는 "이번 작업 직후에 반드시 처리해야 할 것", Macrotask는 "다음 기회에 처리해도 되는 것"이라는 우선순위 차이가 실무에서 이렇게 드러난다.

---

---

# [UNVERIFIED] 아래 코드의 콘솔 출력 순서는 어떻게 되는가?

## 도입

Macrotask와 Microtask의 처리 순서를 정확히 알면 복잡한 비동기 코드의 실행 흐름을 단계별로 추적할 수 있다. 아래 코드는 두 큐의 우선순위와 Microtask 내부에서의 Macrotask 등록을 함께 테스트한다.

---

## 본문

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);
```

실행 단계를 큐 상태로 추적한다.

```
[1단계] 동기 코드 실행 (Call Stack)
  → console.log(1)              출력: 1
  → setTimeout(2) 등록           Macro: [2출력]
  → Promise.then(3출력) 등록      Micro: [3출력]
  → Promise.then(4예약) 등록      Micro: [3출력, 4예약]
  → Promise.then(5출력) 등록      Micro: [3출력, 4예약, 5출력]
  → setTimeout(6) 등록           Macro: [2출력, 6출력]
  → console.log(7)              출력: 1 7

[2단계] Microtask Queue 비우기
  → 3출력                       출력: 1 7 3
  → setTimeout(4) 등록           Macro: [2출력, 6출력, 4출력]
  → 5출력                       출력: 1 7 3 5
  Microtask Queue 비었음

[3단계] Macrotask 하나씩 처리 (사이마다 Microtask 확인)
  → 2출력                       출력: 1 7 3 5 2
  → Microtask 없음
  → 6출력                       출력: 1 7 3 5 2 6
  → Microtask 없음
  → 4출력                       출력: 1 7 3 5 2 6 4
```

최종 출력: `1 7 3 5 2 6 4`

---

## 종합

이 코드의 핵심은 Microtask 안에서 등록한 Macrotask(4번)가 가장 마지막에 실행된다는 것이다. `4`를 등록하는 Promise `.then()`이 실행될 때 이미 Macrotask Queue에는 2와 6이 들어있고, 4는 그 뒤에 추가된다. Microtask → Macrotask 순서, Macrotask는 1개씩이라는 두 규칙만 기억하면 어떤 조합이든 추적할 수 있다.

---

---

# task가 실행되는 도중에도 브라우저 렌더링이 일어날 수 있는가?

## 도입

JS 코드 안에서 DOM을 수정했을 때 "즉시 화면에 반영되는가"는 직관과 다르게 동작한다. task 실행 중에는 렌더링이 차단된다.

---

## 본문

> Rendering never happens while the engine executes a task. It doesn't matter if the task takes a long time.
> Changes to the DOM are painted only after the task is complete.

"엔진이 task를 실행하는 동안에는 렌더링이 절대 일어나지 않는다. task가 얼마나 오래 걸리든 상관없다. DOM 변경 사항은 task가 완료된 후에만 화면에 그려진다."

- **task**: 이벤트 루프가 한 번에 실행하는 동기적 실행 단위. 함수 호출, 이벤트 핸들러, setTimeout 콜백 등이 각각 하나의 task다.
- **rendering**: 브라우저가 DOM 변경 사항을 Style → Layout → Paint → Composite 파이프라인을 거쳐 화면에 표시하는 과정.
- **painted only after the task is complete**: DOM 조작 코드를 task 중간에 작성해도 화면 업데이트는 task가 끝난 후에야 발생한다.

```html
<div id="progress"></div>
<script>
  function main() {
    progress.innerHTML = 'Progressing'; // DOM 변경 — 아직 화면에 안 보임
    for (let i = 0; i < 1e10; i++) {}  // 이 task가 끝나기 전까지 렌더링 없음
    progress.innerHTML = 'Done';        // DOM 변경
  }
  main(); // task 실행
  // 실제로는 'Progressing'이 화면에 안 보이고 바로 'Done'이 표시됨
</script>
```

브라우저는 매 틱마다 렌더링하지 않는다. 약 60Hz(16.7ms) 주기로 렌더링 기회(Rendering Opportunity)가 발생하며, Microtask Queue가 비워진 후 렌더링 타이밍이 맞을 때만 화면을 업데이트한다.

---

## 종합

task 실행 중 렌더링이 차단되는 것은 JS가 단일 스레드이기 때문이다. 렌더링 파이프라인도 같은 메인 스레드에서 실행되므로 task가 점유하는 동안 기다릴 수밖에 없다. 'Progressing' 중간 상태를 보여주고 싶다면 `setTimeout`으로 다음 task로 나눠서 실행해야 한다 — `progress.innerHTML = 'Progressing'; setTimeout(() => { heavyWork(); progress.innerHTML = 'Done'; })` 형태로 분리하면 두 task 사이에 렌더링이 일어날 수 있다.

---

---

# [UNVERIFIED] 비동기 작업은 호출되자마자 Queue에 들어가는가?

## 도입

"`setTimeout(fn, 0)`을 호출하면 즉시 Queue에 들어간다"고 오해하기 쉽다. 실제로 비동기 작업이 Queue에 들어가는 시점은 "완료된 후"다.

---

## 본문

비동기 작업의 Queue 진입 시점은 OA 없이 실무 원칙으로 정리한다.

```
setTimeout(task, 10000) 호출 시 실제 흐름:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JS 실행           Web API (브라우저/Node.js)   Queue
setTimeout 호출 → 타이머 시작 (10초)
                  타이머 대기 중...
                  10초 경과 →                task가 MacroQueue에 추가
                                             ↓
                                             이벤트 루프가 꺼내 실행
```

`Promise`도 동일한 원리가 적용된다:

```js
// fetch()의 네트워크 요청은 Web API가 담당
fetch('/api/data')
  // 네트워크 응답 도착 시 → Promise settle → .then() 콜백이 MicroQueue에 추가
  .then(res => res.json()); // 이 콜백은 응답 완료 후 Queue에 들어감

// Promise 자체는 JS 스펙이지만, 실제 I/O는 Node.js API / Web API가 처리
// Promise는 "미래·대기·성공·실패를 표현하는 컨테이너"일 뿐
```

---

## 종합

비동기 작업을 호출하면 그 작업의 실제 처리는 JS 엔진 밖(Web API, Node.js libuv)으로 위임된다. 작업이 완료(타이머 만료, 네트워크 응답, 파일 읽기 완료 등)되었을 때 비로소 콜백이 Queue에 들어온다. JS 코드 자체는 Queue에 들어오길 기다리는 동안 다른 일을 계속 처리할 수 있다 — 이것이 JS 비동기 모델의 핵심이다.
