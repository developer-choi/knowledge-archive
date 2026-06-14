# [UNVERIFIED] 블로킹과 논블로킹은 무엇을 기준으로 구분하는가?

## 도입

블로킹/논블로킹과 동기/비동기는 혼용되는 경우가 많지만, 엄밀히는 다른 관점에서 구분하는 개념이다. 먼저 블로킹과 논블로킹은 "제어권"의 관점으로 본다.

---

## 본문

블로킹과 논블로킹은 OA 없이 실무 원칙으로 정리한다.

- **블로킹(Blocking)**: 작업을 요청하면 그 작업이 끝날 때까지 호출한 코드가 대기한다. 다른 일을 할 수 없다.
- **논블로킹(Non-blocking)**: 작업을 요청하고 나서 완료를 기다리지 않고 다음 코드로 넘어간다. 다른 일을 할 수 있다.

```
블로킹:
  작업 요청 ──[----대기중----]──→ 완료 → 다음 코드

논블로킹:
  작업 요청 → 다음 코드 → 다음 코드 → ...
              (완료 통보 대기 중)
```

JS 메인 스레드 관점에서 `while(true) {}`는 전형적인 블로킹이다. 이 루프가 도는 동안 이벤트 루프는 큐에 쌓인 다른 작업을 처리할 수 없다.

---

## 종합

브라우저에서 블로킹 상태가 발생하면 사용자는 클릭, 스크롤, 키입력 등 모든 인터랙션이 멈추는 것을 경험한다. 브라우저는 `Uncaught RangeError: Maximum call stack size exceeded` 같은 에러나 "응답 없음" 경고로 이를 표출한다. JS가 싱글 스레드임에도 비동기 처리가 필요한 가장 근본적인 이유가 바로 이 블로킹 문제다.

---

# [UNVERIFIED] 동기와 비동기는 무엇을 기준으로 구분하는가?

## 도입

동기/비동기는 "순서(order)"의 관점으로 구분한다. 블로킹/논블로킹이 "지금 기다리는가"의 문제라면, 동기/비동기는 "완료 후 즉시 다음으로 이어지는가"의 문제다.

---

## 본문

동기와 비동기는 OA 없이 실무 원칙으로 정리한다.

- **동기(Synchronous)**: 요청한 작업이 끝나면 그 결과를 바로 이어받아 다음 작업을 시작한다. 작업 완료와 다음 작업 시작이 즉시 연결된다.
- **비동기(Asynchronous)**: 작업이 끝났다고 해도 다음 작업이 즉시 시작되지 않아도 된다. 완료 알림을 받으면 그때 처리한다.

```js
// 동기 — 완료 즉시 결과를 쓴다
const data = JSON.parse('{"a":1}'); // 파싱 완료 → 즉시 data 사용 가능
console.log(data.a); // 1

// 비동기 — 완료 시점이 불확실, 나중에 콜백/then으로 처리
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data)); // 언제 실행될지 모름
console.log('fetch 호출 후 즉시 실행');
```

---

## 종합

동기와 비동기의 핵심 차이는 "완료 후 바로 이어가는가"다. `fetch()`는 비동기다 — 요청을 보내고 나서 응답이 언제 올지 모르며, 응답이 와도 `.then()` 콜백이 마이크로태스크 큐를 통해 "나중에" 실행된다. 이와 달리 `JSON.parse()`는 완료 즉시 반환값을 쓸 수 있는 동기 함수다.

---

# [UNVERIFIED] 블로킹/논블로킹과 동기/비동기는 어떤 관계인가?

## 도입

두 축은 독립적이다. 블로킹 여부와 동기 여부는 서로 다른 관점이므로 이론적으로 4가지 조합이 가능하다. 실무에서는 Blocking+Sync와 Non-blocking+Async가 대부분이다.

---

## 본문

두 축의 관계는 OA 없이 실무 원칙으로 정리한다.

```
               동기(Sync)           비동기(Async)
               ──────────────────────────────────
블로킹         Blocking+Sync        Blocking+Async
(Blocking)     (가장 흔함)          (드묾)

논블로킹       Non-blocking+Sync    Non-blocking+Async
(Non-blocking) (드묾)               (가장 흔함)
```

- **Blocking + Sync**: 대기하면서 완료 즉시 결과를 받음. 일반적인 동기 함수 호출.
- **Non-blocking + Async**: 대기하지 않고 나중에 완료를 통보받음. `fetch()`, `setTimeout()`.
- **Blocking + Async**: 대기하면서도 완료 후 즉시 이어가지 않음. 실무에서 거의 없음.
- **Non-blocking + Sync**: 대기하지 않지만 완료 즉시 결과를 요구. 폴링 패턴 등.

---

## 종합

프론트엔드에서 "비동기 처리"라고 부르는 것은 거의 Non-blocking + Async 조합이다. `fetch()`가 대표적 — 요청을 보내고 메인 스레드는 즉시 다음 코드로 넘어가며(Non-blocking), 응답이 왔을 때 `.then()`으로 처리한다(Async). 두 개념을 구분해두면 "왜 `await fetch()`가 블로킹처럼 느껴지는가"도 설명할 수 있다 — `await`는 async 함수 내부의 실행 흐름만 멈추지 JS 메인 스레드 자체를 블로킹하지 않는다.

---

# [UNVERIFIED] Blocking + Sync 코드는 어떤 모습인가?

## 도입

가장 직관적인 조합이다. 함수를 호출하면 그 함수가 끝날 때까지 기다리고(Blocking), 끝나면 바로 다음 줄로 이어진다(Sync).

---

## 본문

Blocking + Sync는 OA 없이 실무 원칙으로 정리한다.

```js
function someBigTask() {
  for (let i = 0; i < 1e100; i++) {} // 매우 오래 걸리는 루프
}

function next() {
  console.log('next call');
}

function work() {
  someBigTask();
  // 1. someBigTask()가 종료될 때까지 아무것도 못 하고 기다려야 하므로 블로킹.
  // 2. someBigTask()가 종료되고 나서 곧바로 next()가 호출되므로 동기.
  next();
}

work();
```

브라우저에서 이 코드를 실행하면 `someBigTask()`가 도는 동안 탭이 완전히 굳어버린다(Jank). 클릭, 스크롤, 키입력 모두 응답하지 않는다.

---

## 종합

Blocking + Sync는 코드가 가장 단순하고 직관적이지만 장시간 실행되는 작업에는 절대 쓰면 안 된다. JS 메인 스레드를 점유하여 브라우저 전체를 멈추기 때문이다. CPU 집약적 작업이 필요하다면 `Web Worker`로 별도 스레드에 offload하는 것이 해법이다.

---

# [UNVERIFIED] Non-blocking + Async 코드는 어떤 모습인가?

## 도입

실무에서 가장 많이 마주치는 패턴이다. `setTimeout`, `fetch`, `Promise` 등이 모두 여기 속한다.

---

## 본문

Non-blocking + Async는 OA 없이 실무 원칙으로 정리한다.

```js
function someBigTask() {
  setTimeout(() => {
    for (let i = 0; i < 1e5; i++) {}
    console.log('big task end');
  });
}

function someSmallTask() {
  console.log('hello world');
}

function work() {
  someBigTask();
  // 1. someBigTask()가 종료될 때까지 아래 로직이 멈추지 않으므로 논블로킹.
  // 2. someBigTask()가 종료된 직후에 다음 코드로 이어지지 않으므로 비동기.
  someSmallTask(); // 'hello world' 먼저 출력
  someSmallTask();
  someSmallTask();
}

work();
// 출력: hello world × 4 → big task end
```

`someBigTask()` 내부의 루프는 `setTimeout` 콜백 안에 있어 Macrotask Queue로 넘어간다. `work()`의 나머지 코드가 먼저 실행된 후 이벤트 루프가 해당 태스크를 꺼내 실행한다.

---

## 종합

Non-blocking + Async는 "지금 당장 결과가 필요 없는 무거운 작업"을 이벤트 루프 너머로 밀어두는 패턴이다. API 응답, 타이머, 파일 IO 등이 모두 이 방식으로 처리된다. 브라우저가 사용자와 상호작용을 유지하면서 동시에 여러 비동기 작업을 처리할 수 있는 것은 이벤트 루프가 Non-blocking + Async 모델을 가능하게 하기 때문이다.

---
