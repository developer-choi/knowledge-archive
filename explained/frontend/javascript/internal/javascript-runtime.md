# [UNVERIFIED] Q1. Javascript는 싱글스레드의 한계를 어떻게 극복했을까?

## 도입

JS 엔진(V8) 자체는 싱글 스레드다 — Call Stack이 하나뿐이라 한 번에 하나의 코드만 실행한다. 무거운 함수가 돌고 있으면 그것이 끝날 때까지 아무것도 할 수 없다. 그럼에도 브라우저가 API 응답을 기다리면서 동시에 애니메이션을 돌리고 클릭을 처리할 수 있는 이유는, JS 엔진 바깥에 비동기를 가능하게 하는 구조가 있기 때문이다.

---

## 본문

JS 런타임은 OA 없이 실무 원칙으로 정리한다.

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

비동기와 콜백이 핵심 해법이다:
- `setTimeout(task, 10000)` → 10초 카운트는 Web API가 담당. JS 엔진은 즉시 다음 코드로.
- 10초 후 → task를 Callback Queue에 추가.
- Event Loop가 Call Stack이 비어있음을 확인하면 → task를 Call Stack에 올려 실행.

```js
console.log('1: 시작');

setTimeout(() => {
  console.log('3: setTimeout 콜백'); // Web API에서 처리 → Queue → 나중에 실행
}, 0);

console.log('2: 끝');

// 출력: 1: 시작 → 2: 끝 → 3: setTimeout 콜백
// setTimeout(fn, 0)도 즉시 실행이 아님 — Queue를 거쳐야 함
```

작은 함수로 분리하는 이유도 여기서 나온다. Call Stack에 오래 걸리는 함수가 있으면 그것이 끝날 때까지 Queue의 콜백을 꺼낼 수 없다. 따라서 무거운 작업은 잘게 쪼개 여러 태스크로 분산시켜야 Event Loop가 중간중간 렌더링과 이벤트 처리를 할 수 있다.

```js
// 나쁜 예 — Call Stack 독점
for (let i = 0; i < 1e9; i++) { /* 무한 루프 */ }
// 이 동안 브라우저는 아무것도 못 함

// 좋은 예 — 태스크 분산
function chunkedWork(start, end, step) {
  return new Promise(resolve => {
    function next(i) {
      if (i >= end) { resolve(); return; }
      // 작업 수행
      processItem(i);
      // 다음 청크를 다음 태스크로 미룸 — 사이에 렌더링 가능
      setTimeout(() => next(i + step), 0);
    }
    next(start);
  });
}
```

---

## 종합

JS가 싱글 스레드임에도 논블로킹 비동기 처리가 가능한 것은 V8 엔진 자체가 아니라, V8을 둘러싼 런타임(브라우저의 Web API, Node.js의 libuv)이 비동기 작업을 대신 처리해주기 때문이다. "서버에서 데이터가 오면 이 함수를 실행해줘! 난 그동안 다른 거 할게" — 이것이 비동기 + 콜백 모델의 핵심이다. Call Stack이 비어있어야 Queue에서 콜백을 꺼낼 수 있으므로, 오래 걸리는 작업을 Call Stack에 놔두면 Queue에 쌓인 콜백이 아무리 많아도 실행될 수 없다.
