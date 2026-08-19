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
