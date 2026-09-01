# 이벤트 루프란 무엇이고 왜 필요한가?

## 도입

JS 코드는 한 번에 한 문장씩만 실행된다. 이걸 담당하는 실행 흐름이 딱 하나뿐이기 때문이다. 그런데 결과가 즉시 나오지 않는 비동기 작업(네트워크 요청, 타이머 등)을 만나면 문제가 생긴다. 그 작업이 끝날 때까지 실행 흐름을 붙잡아 두면 나머지 코드가 전부 멈추고 화면이 굳는다. 이벤트 루프는 바로 이 딜레마를 푸는 장치다. 실행 흐름이 하나뿐인 언어가, 비동기 작업을 처리하면서도 멈추지 않고 계속 반응하게 해준다. 이름이 두 개인데(작업 큐 / 이벤트 루프) 같은 것을 가리키는 다른 명칭이라는 점만 먼저 짚어둔다.

---

## 본문

> An agent is a thread, which means the interpreter can only process one statement at a time.

"JS를 실행하는 흐름은 스레드 하나이고, 그래서 인터프리터는 한 번에 문장 하나만 처리할 수 있다."

- **agent**: JS 코드를 실행하는 단 하나의 실행 흐름. 여기서는 어려운 개념이 아니라 우리가 아는 그 "단일 JS 실행 스레드"를 가리키는 말로 읽으면 된다.
- **one statement at a time**: 한 번에 한 문장. 콜 스택이 문장을 하나씩 올리고 내리며 순서대로 처리하는 그 방식 그대로다.

> But if the code needs to perform asynchronous action, then we cannot progress unless that action is completed.

"그런데 코드가 비동기 작업을 해야 한다면, 그 작업이 완료되기 전까지는 다음으로 나아갈 수 없다."

- **asynchronous action**: 결과가 즉시 나오지 않고 나중에 완료되는 작업. 서버 응답 대기, `setTimeout` 만료 같은 것들이다.

> However, it would be detrimental to user experience if that halts the whole program—the nature of JavaScript as a web scripting language requires it to be never blocking.

"하지만 그 대기가 프로그램 전체를 멈춰 세운다면 사용자 경험에 해롭다. 웹 스크립트 언어라는 JS의 본질상 절대 멈춰 세우지 않아야 한다."

- **detrimental**: 해로운. 응답을 기다리는 몇 초 동안 버튼도 안 눌리고 스크롤도 안 되면 그게 사용자에게 해롭다는 뜻이다.
- **never blocking**: 한 작업이 끝나길 기다리느라 전체 실행을 멈추지 않는 것. 만약 이 성질이 없다면, 실행 흐름이 하나뿐인 JS는 느린 비동기 작업 하나에 화면 전체가 얼어붙는다.

> Therefore, the code that handles the completion of that asynchronous action is defined as a callback.

"그래서 그 비동기 작업의 완료를 처리하는 코드를 콜백이라 부른다."

> This callback defines a job, which gets placed into a job queue—or, in HTML terminology, an event loop—once the action is completed.

"이 콜백이 하나의 작업(job)을 정의하고, 그 작업은 비동기 동작이 완료되는 순간 작업 큐(HTML 용어로는 이벤트 루프)에 놓인다."

- **job**: 나중에 실행 흐름이 큐에서 하나씩 꺼내 실행하는 콜백 단위. 완료된 콜백이 곧바로 실행되는 게 아니라 이 job 형태로 줄을 선다.
- **job queue / event loop**: 같은 대상을 부르는 두 이름이다. ECMAScript 명세는 "job queue", HTML 명세는 "event loop"라고 부른다. 이름이 다르다고 다른 물건이 아니다.

```
비동기 동작 완료 ──→ 완료 처리 콜백(= job) ──→ 작업 큐(= event loop)에 적재
```

---

## 종합

전체 줄기는 이렇다. JS의 실행 흐름은 하나뿐이라 한 번에 한 문장만 처리한다 → 그러니 비동기 작업이 끝나길 붙잡아 기다리면 나머지 전부가 멈춘다 → 웹 언어인 JS는 멈추면 안 되므로(never blocking), 기다리는 대신 "끝나면 실행할 코드"를 콜백으로 등록해 두고 흐름은 계속 나아간다 → 그 콜백은 작업(job)이 되어, 동작이 완료될 때 작업 큐에 놓인다. 그 큐를 HTML에서는 이벤트 루프라 부른다.

그래서 이벤트 루프의 존재 이유는 한 문장으로 요약된다. 실행 흐름이 하나뿐인 언어가 멈추지 않으면서 비동기 작업을 처리하게 하는 것이다. 이것이 없다면 JS는 느린 작업 하나에 전체가 얼어붙거나, 아니면 여러 실행 흐름을 두어 공유 데이터 충돌을 감수해야 했을 것이다. 큐에 쌓인 job을 실제로 어떻게 꺼내 도는지는 다음 절에서 이어진다.

---

# 이벤트 루프는 내부적으로 job을 어떻게 꺼내 실행하며, 하나의 job은 언제 완료로 간주되는가?

## 도입

앞 절에서 비동기 작업의 완료 콜백이 job이 되어 큐에 쌓이는 것까지 봤다. 이번엔 그 큐에 쌓인 job을 실행 흐름이 실제로 어떻게 꺼내 돌리는지, 그리고 "이 job은 끝났다"를 무엇으로 판정하는지를 본다. 핵심은 반복되는 단순한 순환이다. 하나 꺼내 실행하고, 그게 끝나면 다음 하나를 꺼낸다. 여기서 "끝났다"의 기준은 이미 아는 콜 스택과 직접 맞닿아 있다.

---

## 본문

> Every time, the agent pulls a job from the queue and executes it.

"매번 실행 흐름은 큐에서 작업 하나를 꺼내 실행한다."

- **pulls a job**: 큐의 앞에서 job을 하나 꺼낸다. 한 번에 하나씩만 꺼내는 것이 포인트다.

> When the job is executed, it may create more jobs, which are added to the end of the queue.

"작업이 실행되는 도중 새로운 작업이 더 생길 수 있고, 그것들은 큐의 끝에 추가된다."

- **create more jobs**: 실행 중인 job 안에서 또 다른 비동기 콜백이 등록되면, 그것이 새 job이 된다.
- **added to the end of the queue**: 새 job은 큐의 맨 뒤에 붙는다. 먼저 들어온 것이 먼저 나가는(FIFO) 순서라, 새로 생긴 job이 대기 중인 기존 job들을 앞지르지 못한다.

> Jobs can also be added via the completion of asynchronous platform mechanisms, such as timers, I/O, and events.

"작업은 타이머, 입출력(I/O), 이벤트 같은 비동기 플랫폼 장치가 완료될 때도 큐에 추가된다."

- **platform mechanisms**: JS 언어 자체가 아니라 실행 환경(브라우저 같은 호스트)이 제공하는 장치. job은 실행 중인 코드에서만 생기는 게 아니라, 이런 바깥 장치가 일을 마쳤을 때도 흘러 들어온다.
- **timers, I/O, and events**: `setTimeout`의 만료, 네트워크·파일 입출력의 완료, 클릭 같은 사용자 이벤트. 각각이 완료되면 그 완료 콜백이 job으로 큐에 들어온다.

> A job is considered completed when the stack is empty; then, the next job is pulled from the queue.

"하나의 작업은 콜 스택이 비었을 때 완료된 것으로 간주되고, 그제서야 다음 작업이 큐에서 꺼내진다."

- **the stack is empty**: job이 실행되면 그 안의 함수 호출들이 콜 스택에 프레임으로 쌓인다. 호출이 하나씩 반환되며 스택이 도로 텅 비면, 그 job은 끝난 것이다. 즉 "job 완료"의 판정 기준은 콜 스택이 바닥까지 비는 순간이다.
- **the next job is pulled**: 스택이 완전히 빈 뒤에야 다음 job을 꺼낸다. 한 job이 도는 도중에 다음 job으로 넘어가는 일은 없다.

---

## 종합

이벤트 루프 안쪽은 결국 단순한 순환이다. 큐에서 job 하나를 꺼내 실행하고, 그 실행은 콜 스택에 함수 프레임을 쌓았다가 하나씩 반환하며 비운다. 스택이 바닥까지 비면 그 job이 끝난 것으로 보고, 그제서야 큐에서 다음 job을 꺼낸다. 이 "꺼냄 → 실행 → 스택 빔 → 다음 꺼냄"이 계속 반복된다.

큐를 채우는 경로는 둘이다. 실행 중인 job이 스스로 새 job을 만들어 큐 끝에 붙이는 경우와, 타이머·입출력·이벤트 같은 바깥 장치가 완료되며 콜백을 흘려 넣는 경우다. 어느 쪽이든 새 job은 큐의 뒤에 붙어 순서를 기다린다. 그리고 job 완료의 판정 기준이 "콜 스택이 빈다"는 데 있다는 점이 중요하다. 이 기준이 있기에 실행 흐름은 한 job을 끝까지 다 돌린 뒤에만 다음으로 넘어가고, 하나가 도는 중간에 다른 job이 끼어들지 못한다.

---

# macrotask와 microtask는 각각 무엇이며, 어떻게 다른가?

## 도입

macrotask는 `setTimeout`·`setInterval` 같은 타이머·이벤트에서 만들어지고, microtask는 `Promise`(그리고 Mutation Observer) 콜백에서 만들어진다. 이 "어디서 만들어지나"가 둘을 가르는 출발점이다.

한 가지 용어를 먼저 짚어둔다. MDN 명세는 이 큰 실행 단위를 `task`라 부르지만, microtask와 짝지어 통칭할 때는 `macrotask`라 한다. 이 문서의 한글 설명에서는 macrotask로 적는다.

---

## 본문

> A timeout or interval created with setTimeout() or setInterval() is reached, causing the corresponding callback to be added to the task queue.

"setTimeout()이나 setInterval()로 만든 타임아웃·인터벌이 만료되면, 그에 대응하는 콜백이 macrotask 큐에 추가된다."

- **setTimeout() / setInterval()**: 정해진 시간이 지나면 콜백을 실행하도록 예약하는 타이머. 전자는 한 번, 후자는 주기적으로 만료된다.
- **task queue**: 만료된 타이머 콜백이 줄 서서 대기하는 큐. 이 큐에 들어간 것이 곧 macrotask다.

> JavaScript promises and the Mutation Observer API both use the microtask queue to run their callbacks, but there are other times when the ability to defer work until the current event loop pass is wrapping up is helpful.

"자바스크립트 promise와 Mutation Observer API는 둘 다 콜백을 microtask 큐에서 실행한다. 다만 지금 도는 이벤트 루프 순회가 마무리될 때까지 작업을 미루는 능력이 유용한 경우가 그 밖에도 있다."

- **Mutation Observer API**: DOM 변경을 감지해 콜백으로 알려주는 장치. promise와 함께 microtask 큐를 쓰는 대표적인 예다.
- **defer work until the current event loop pass is wrapping up**: 지금 도는 이벤트 루프 순회가 끝나갈 때까지 일을 미룬다는 뜻. microtask 큐가 바로 이 "지금 흐름 직후로 미루기"를 담당한다.

> Jobs might not be pulled with uniform priority—for example, HTML event loops split jobs into two categories: tasks and microtasks. Microtasks have higher priority and the microtask queue is drained first before the task queue is pulled.

"job이 항상 동일한 우선순위로 꺼내지는 건 아니다. 예를 들어 HTML 이벤트 루프는 job을 macrotask와 microtask라는 두 범주로 나눈다. microtask가 더 높은 우선순위를 가지며, macrotask 큐를 꺼내기 전에 microtask 큐가 먼저 완전히 비워진다."

- **uniform priority**: 모든 job을 같은 순위로 취급하는 것. 이벤트 루프는 그렇게 하지 않고 등급을 나눈다.
- **split jobs into two categories**: 하나였던 job을 macrotask와 microtask 두 갈래로 가른다.
- **drained first**: microtask 큐를 먼저 "말려서 바닥낸다", 즉 하나 남김없이 다 실행한다. macrotask는 그 뒤에야 손댄다.

> Each time a task exits, the event loop checks to see if the task is returning control to other JavaScript code. If not, it runs all of the microtasks in the microtask queue. The microtask queue is, then, processed multiple times per iteration of the event loop, including after handling events and other callbacks.

"macrotask가 빠져나갈 때마다 이벤트 루프는 그 macrotask가 다른 자바스크립트 코드로 제어권을 넘기는 중인지 확인한다. 그렇지 않다면, microtask 큐에 있는 microtask를 전부 실행한다. 따라서 microtask 큐는 이벤트 루프의 한 순회 안에서도 여러 번 처리되며, 이벤트나 다른 콜백을 처리한 뒤에도 처리된다."

- **each time a task exits**: macrotask 하나가 끝날 때마다. microtask 소진은 순회당 딱 한 번이 아니라 macrotask가 빠질 때마다 반복된다.
- **returning control to other JavaScript code**: 그 macrotask가 아직 다른 JS 코드에 제어권을 넘기는 중인지 확인한다. 넘기는 중이 아니라면(=흐름이 바닥났다면) 그 틈에 microtask를 비운다.
- **processed multiple times per iteration**: 그래서 microtask 큐는 한 순회 안에서도 여러 번 비워진다. 이벤트 핸들러나 콜백을 처리한 직후에도 매번 확인·소진한다.

> If a microtask adds more microtasks to the queue by calling queueMicrotask(), those newly-added microtasks execute before the next task is run. That's because the event loop will keep calling microtasks until there are none left in the queue, even if more keep getting added.

"어떤 microtask가 `queueMicrotask()`를 호출해 microtask를 더 큐에 추가하면, 새로 추가된 그 microtask들은 다음 macrotask가 실행되기 전에 실행된다. 이벤트 루프가 큐에 아무것도 남지 않을 때까지 microtask를 계속 호출하기 때문이다. 도중에 계속 더 추가되더라도 마찬가지다."

- **adds more microtasks ... execute before the next task**: microtask 실행 도중에 새 microtask가 추가돼도 그것들까지 이번에 다 비운 뒤에야 다음 macrotask로 넘어간다.
- **keep calling ... until there are none left**: 큐가 완전히 0이 될 때까지 멈추지 않는다. 실행 중 추가된 것도 포함해서다.

실전에서 이 규칙은 세 문장으로 요약된다. Macrotask는 보통 `setTimeout`·`setInterval`로 만든 작업이고, Microtask는 보통 `Promise`로 만든 작업이다. 이벤트 루프 한 틱에서 Microtask 큐는 완전히 비워질 때까지 계속 꺼내 실행하며, 실행 도중 새 microtask가 추가돼도 큐가 0이 될 때까지 멈추지 않는다. 반면 Macrotask 큐는 한 틱에 딱 하나만 꺼내 실행한 뒤 제어권이 루프로 돌아간다.

이 우선순위를 한 틱 흐름으로 정리하면 이렇다.

```
이벤트 루프 한 틱 흐름:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Call Stack 비워지면
2. Microtask Queue → 전부 실행 (새 microtask 추가돼도 큐가 0 될 때까지)
3. Rendering Opportunity (60Hz 기준 약 16.7ms 주기, 브라우저 선택)
4. Macrotask Queue → 가장 오래된 것 하나만 꺼내 실행
5. 다시 2번으로
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

이 규칙 때문에 `setTimeout(fn, 0)`이 `Promise.resolve().then(fn)`보다 늦게 실행된다.

```
setTimeout(fn, 0)  vs  Promise.resolve().then(fn)
━━━━━━━━━━━━━━━━━━━━━━━      ━━━━━━━━━━━━━━━━━━━━━━━
macrotask 큐로 들어감         microtask 큐로 들어감
한 틱에 하나만, microtask     macrotask 꺼내기 전에 큐 전체가
다 비운 뒤에야 차례            먼저 소진됨
→ 늦게 실행                   → 먼저 실행
```

---

## 종합

핵심은 두 큐의 처리 방식이 비대칭이라는 데 있다. microtask 큐는 "완전히 빌 때까지" 한 번에 다 비우고, macrotask 큐는 한 순회에 "가장 오래된 하나"만 꺼낸다. 게다가 microtask 소진은 순회당 한 번이 아니라 macrotask가 끝날 때마다 반복되고, 소진 도중 새 microtask가 추가돼도 큐가 0이 될 때까지 멈추지 않는다. 그래서 microtask는 "이번 흐름 직후 반드시 처리할 것", macrotask는 "다음 기회에 처리해도 되는 것"이라는 우선순위 차이가 생긴다.

이 성질의 그림자가 무한 microtask다. `function loop() { Promise.resolve().then(loop); }` 처럼 microtask가 자신을 계속 다시 큐에 넣으면, 이벤트 루프는 "큐가 0이 될 때까지"라는 규칙에 갇혀 macrotask 처리와 렌더링 단계로 영영 진입하지 못한다. 화면이 완전히 굳어버리는(Jank) 현상이 이렇게 나타난다. 우선순위가 높다는 것은 곧 "잘못 쓰면 나머지를 굶길 수 있다"는 뜻이기도 하다.

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

# [UNVERIFIED] 이벤트 루프는 JavaScript 런타임의 어떤 구성요소들과 함께 동작하는가?

## 도입

앞의 질문들은 이벤트 루프가 무엇을 하는지를 다뤘다. 여기서는 그것이 어디에 놓여 있는지, 곧 이벤트 루프 옆에 어떤 부품들이 있고 각자 무엇을 맡는지를 본다. 부품 배치를 알아야 "왜 Call Stack이 비어야만 콜백이 실행되는가"가 그림으로 이해된다.

---

## 본문

### 런타임의 부품 배치

```
JS Runtime 구조 (브라우저 기준)

┌──────────────── JS 엔진 (V8) ────────────────┐
│                                              │
│  Memory Heap           Call Stack            │
│  ┌─────────┐          ┌─────────────┐       │
│  │ 객체,    │          │ 현재 실행 중 │       │
│  │ 변수 등  │          │ 함수들 (LIFO)│       │
│  └─────────┘          └─────────────┘       │
└──────────────────────────────────────────────┘
         ↕ JS 엔진이 직접 못 하는 일은 여기로
┌──────────────── Web APIs (브라우저) ──────────┐
│  DOM  │  AJAX (fetch/XHR)  │  setTimeout     │
│       │  기타 비동기 I/O     │                 │
└───────────────────────────┬──────────────────┘
                             ↓ 완료 시
               ┌─────────────────────────────┐
               │  Callback Queue (Macrotask) │
               │  Microtask Queue           │
               └──────────────┬─────────────┘
                               ↓
               ┌───────────────────────────┐
               │  Event Loop               │
               │  (Call Stack 비면 큐에서   │
               │   꺼내 Call Stack에 추가)  │
               └───────────────────────────┘
```

- **Memory Heap / Call Stack**: 엔진(V8)이 가진 두 부분이다. 힙은 객체·변수가 놓이는 곳, 콜스택은 실행 중인 함수의 스택 프레임이 쌓이는 곳이다.
- **Web APIs**: 엔진이 직접 못 하는 일(타이머 재기, 네트워크 요청, DOM 조작)을 대신 맡는 호스트 쪽 장치다. `setTimeout(fn, 5000)`에서 5초를 세는 주체가 엔진이 아니라 여기라서, 싱글 스레드가 매 순간 시계를 확인하지 않고도 5초 뒤 콜백을 부를 수 있다.
- **Callback Queue / Microtask Queue**: 완료된 작업의 콜백이 줄 서는 곳.
- **Event Loop**: 콜스택이 비었는지 보고, 비었으면 큐에서 하나 꺼내 콜스택에 올린다.

### 콜스택이 하나라는 것의 대가

싱글 스레드는 힙 하나와 콜스택 하나를 가진다. 콜스택이 하나라는 말은 한 번에 한 가지 일밖에 못 한다는 말과 같다. 여기서 두 가지 현상이 따라 나온다.

- **블로킹**: 오래 걸리는 함수가 콜스택을 점유하는 동안 유저가 클릭해도 아무 반응이 없다. 이 상태를 블로킹이라 부른다. 서버에서 데이터가 이미 도착했더라도 실행 중인 작업이 끝나기 전에는 처리되지 않는 것이 같은 이유다.
- **`Uncaught RangeError: Maximum call stack size exceeded`**: 콜스택에 자리가 없을 만큼 프레임이 쌓이면 나는 에러다. 재귀가 끝나지 않을 때 흔히 만난다.

---

## 종합

이벤트 루프는 홀로 서 있는 장치가 아니라 네 부품 사이의 중개자다. 엔진(힙·콜스택)은 계산만 하고, 시간이 걸리는 일은 Web API가 대신 맡으며, 끝난 일의 콜백은 큐에 줄을 서고, 이벤트 루프가 콜스택이 빈 순간에만 그 줄에서 하나를 꺼내 올린다.

그래서 논블로킹을 가능하게 한 것은 엔진 자체가 아니라 엔진을 둘러싼 런타임이다. 브라우저에서는 Web API가, Node.js에서는 libuv가 그 자리를 맡는다. 반대로 말하면 콜스택을 오래 붙잡는 코드 하나가 이 구조 전체를 멈춰 세운다 — 큐에 콜백이 아무리 쌓여 있어도 꺼낼 틈이 생기지 않기 때문이다.

부품 이름과 배치는 널리 통용되지만 명세가 규정하는 용어는 아니다. 출처가 개인 블로그라 `[UNVERIFIED]`로 두었다.
