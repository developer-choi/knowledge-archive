---
tags: [javascript, concept]
---

# Questions
- 블로킹과 논블로킹은 무엇을 기준으로 구분하는가?
- 동기와 비동기는 무엇을 기준으로 구분하는가?
- 블로킹/논블로킹과 동기/비동기는 어떤 관계인가?
- Blocking + Sync 코드는 어떤 모습인가?
- Non-blocking + Async 코드는 어떤 모습인가?
- 프론트엔드에서 블로킹/논블로킹을 따지는 이유는 무엇인가?

---

# Answers

## 블로킹과 논블로킹은 무엇을 기준으로 구분하는가?

### User Answer
제어권의 관점에서 구분한다.

블로킹은 작업을 요청하면 그 작업이 끝날 때까지 아무것도 안 하고 기다리는 것이다 (다른 일 못함).
논블로킹은 작업을 요청하고 나서 기다리지 않고 다른 일을 하는 것이다 (다른 일 할 수 있음).

### Reference
- https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking

---

## 동기와 비동기는 무엇을 기준으로 구분하는가?

### User Answer
순서의 관점에서 구분한다.

동기는 요청한 작업이 끝나면 곧바로 이어서 다음 작업을 시작하는 것이다.
요청한 작업이 끝나기 전까지 그 사이에 다른 일을 해도 상관없지만, 끝난 직후에는 순서대로 이어서 다음 작업을 해야 한다.

비동기는 같은 상황에서, 요청한 작업이 끝나더라도 곧바로 다음 작업을 시작하지 않고 나중에 시작해도 되는 것이다.

### Reference
- https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks

---

## 블로킹/논블로킹과 동기/비동기는 어떤 관계인가?

### User Answer
서로 관점이 다를 뿐이다.

블로킹 vs 논블로킹은 제어권의 관점이고, 동기 vs 비동기는 순서의 관점이다.
실무에서 자주 마주치는 조합은 Blocking + Sync, 그리고 Non-blocking + Async이다.

### Reference
- https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking

---

## Blocking + Sync 코드는 어떤 모습인가?

### User Answer
```javascript
function someBigTask() {
  for (let i = 0; i < 1e100; i++) {}
}

function next() {
  console.log('next call');
}

function work() {
  someBigTask();
  // 1. someBigTask()가 종료되고 나서 곧바로 next()가 호출되므로 동기.
  // 2. someBigTask()가 종료되기 전까지 아무것도 못 하고 기다려야 하므로 블로킹.
  next();
}

work();
```

`someBigTask()`가 끝나야만 `next()`가 호출되고, 끝나면 곧바로 호출되므로 Blocking + Sync이다.

### Reference
- https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking

---

## Non-blocking + Async 코드는 어떤 모습인가?

### User Answer
```javascript
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
  // 1. someBigTask()가 종료되고 나서 곧바로 아래 로직이 실행되지 않으므로 비동기.
  // 2. someBigTask()가 종료될 때까지 아래 로직이 실행 안 되는 게 아니므로 논블로킹.
  someSmallTask();
  someSmallTask();
  someSmallTask();
  someSmallTask();
}

work();
```

`someBigTask()`가 끝나기를 기다리지 않고 `someSmallTask()`들이 먼저 실행되며, `someBigTask()`가 끝난 직후에 다음 작업이 이어지지도 않으므로 Non-blocking + Async이다.

### Reference
- https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking

---

## 프론트엔드에서 블로킹/논블로킹을 따지는 이유는 무엇인가?

### User Answer
브라우저가 블로킹 상태로 빠지지 않도록 하기 위함이다.

브라우저에 엄청나게 오래 걸리는 작업을 시켜놓으면 그 작업을 처리하는 동안 사용자가 인터랙션을 할 수 없다.
브라우저는 언제나 사용자와 상호작용할 수 있는 상태여야 한다.

가장 빈번한 예시는 API 요청이다.
API 요청을 보내놓고 그 사이에 기다리지 않고 계속 사용자와 상호작용을 하다가, API 응답이 오면 처리해 주고 다시 또 사용자와 상호작용을 할 수 있어야 한다.

### Reference
- https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking
