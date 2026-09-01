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

# 이미 resolve된 Promise에 `.then` 콜백을 두 개 달면 출력이 예측 가능한가? 그 이유는?

## 도입

앞에서 다룬 "작업(job)", 곧 이벤트 루프가 하나씩 꺼내 실행하는 콜백 단위는 스택이 비워질 때 하나가 끝난 것으로 본다. 여기서 한 걸음 더 들어가는 개념이 run-to-completion(끝까지 실행)이다. 작업 하나가 일단 시작되면, 중간에 멈춰 다른 작업에 자리를 내주는 일 없이 끝까지 달린다는 원칙이다.

주의할 점이 하나 있다. 이 원칙은 큐 사이의 우선순위(Microtask를 다 비운 뒤 Macrotask 하나 처리)와는 **다른 축의 규칙**이다. 우선순위는 "어느 큐에서 몇 개를 꺼내느냐"를 정하고, run-to-completion은 "꺼낸 작업 하나가 도중에 끊기느냐"를 정한다. 큐가 하나뿐이어도 run-to-completion은 성립한다. 헷갈리기 쉬운 지점이라 이 둘을 처음부터 갈라두고 시작한다.

아래 코드가 이 원칙의 시험대다.

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

---

## 본문

> Each job is processed completely before any other job is processed.

"각 작업은 다른 어떤 작업이 처리되기 전에 완전히 끝까지 처리된다."

- **job**: 이벤트 루프가 큐에서 하나씩 꺼내 실행하는 콜백 단위. 여기서는 위 코드의 `.then` 콜백 하나하나가 각각 하나의 job이다.
- **completely**: 중간에 끊기지 않고 그 job의 마지막 줄까지. 이 단어가 곧 run-to-completion의 핵심이다.

> This offers some nice properties when reasoning about your program, including the fact that whenever a function runs, it cannot be preempted and will run entirely before any other code runs (and can modify data the function manipulates).

"이 덕분에 프로그램을 이해할 때 편리한 성질이 생긴다. 함수가 실행되면 그것이 도중에 강제로 밀려나지 않고, 다른 어떤 코드보다 먼저 끝까지 실행되며, 그 함수가 다루는 데이터를 (누가 끼어들 걱정 없이) 고칠 수 있다는 점이다."

- **preempted**: 실행 중인 단위를 도중에 강제로 멈추고 다른 것을 끼워 실행하는 것. run-to-completion은 이 끼어듦이 **없다**는 보장이다.
- **can modify data the function manipulates**: 함수가 공유 데이터(여기서는 `i`)를 건드리는 동안 다른 코드가 끼어들어 그 값을 바꿔놓는 일이 없다는 뜻. 이게 없으면 아래의 예측 가능성이 깨진다.

C 계열의 스레드 언어와 비교하면 이 성질이 선명해진다. 그런 환경에서는 한 스레드에서 도는 함수가 임의의 지점에서 preempt될 수 있어, 두 실행 흐름이 같은 변수를 엇갈려 건드릴 수 있다. JS의 job은 그런 끼어듦이 원천적으로 없다.

```
run-to-completion vs 스레드 선점(preemption): 두 job이 공유 변수 i를 건드릴 때

[JS job : 끼어듦 없음]           [C 스레드 : 임의 지점 선점]
━━━━━━━━━━━━━━━━━━━━━━━━━      ━━━━━━━━━━━━━━━━━━━━━━━━━
job A: i+=1 → log(i) ┐          A: i+=1 ┐  ← 여기서 밀려남
                    (끝)          B: i+=1 ┘
job B: i+=1 → log(i)              A: log(i)
                                 B: log(i)
결과: 1, 2 (항상)                 결과: 2, 2 (뒤엉킴 가능)
```

> In this example, we create an already-resolved promise, which means any callback attached to it will be immediately scheduled as jobs.

"이 예시에서는 이미 resolve된 promise를 만든다. 그래서 여기에 붙인 콜백은 곧바로 작업으로 예약된다."

- **already-resolved**: `Promise.resolve()`로 만들어 처음부터 이행 완료 상태인 promise. 그래서 `.then` 콜백이 대기 없이 바로 큐에 올라간다.
- **scheduled as jobs**: 콜백이 즉시 실행되는 게 아니라, 작업 큐에 "예약"되어 순서를 기다린다. `.then`을 두 번 부른 순서대로 두 job이 큐에 줄 선다.

> The two callbacks seem to cause a race condition, but actually, the output is fully predictable: `1` and `2` will be logged in order.

"두 콜백이 경쟁 상태를 일으킬 것처럼 보이지만, 실제로는 출력이 완전히 예측 가능하다. `1`과 `2`가 순서대로 찍힌다."

- **race condition**: 두 실행 흐름이 같은 데이터를 누가 먼저 건드리느냐에 따라 결과가 달라지는 상태. 같은 `i`를 두 콜백이 건드리니 위험해 보인다.
- **fully predictable**: 그런데 결과가 딱 하나로 정해진다. 두 job이 끝까지-차례로 도니 뒤엉킬 여지가 없기 때문이다.

> This is because each job runs to completion before the next one is executed, so the overall order is always `i += 1; console.log(i); i += 1; console.log(i);` and never `i += 1; i += 1; console.log(i); console.log(i);`.

"왜냐하면 각 작업은 다음 작업이 실행되기 전에 끝까지 완료되기 때문이다. 그래서 전체 순서는 항상 `i += 1; console.log(i); i += 1; console.log(i);`이지, 결코 `i += 1; i += 1; console.log(i); console.log(i);`가 아니다."

- **runs to completion**: 첫 job이 `i += 1`부터 `console.log(i)`까지 다 끝낸 뒤에야 둘째 job이 시작된다. 두 job의 내부 문장이 섞이지 않는다.
- 첫 job에서 `i`가 0→1이 되고 `1`을 찍은 뒤, 둘째 job에서 1→2가 되고 `2`를 찍는다. 두 `i += 1`이 두 `console.log`보다 먼저 몰려 실행되는 일은 없다.

---

## 종합

핵심은 run-to-completion과 큐 우선순위가 별개의 축이라는 점이다. 앞 절의 Microtask/Macrotask 우선순위는 "어느 큐에서 작업을 꺼낼까"를 정하는 규칙이고, 이 절의 run-to-completion은 "꺼낸 작업 하나가 도중에 끊기느냐"를 정하는 규칙이다. 이 예시는 두 콜백이 같은 Microtask 큐에 있어 우선순위 다툼조차 없고, 오직 "한 job이 끝까지 돈 뒤 다음 job"이라는 성질만으로 결과가 `1`, `2`로 고정된다.

이 성질이 없다면, 즉 job이 중간에 선점될 수 있다면 두 콜백의 `i += 1`이 엇갈려 실행되어 `2`, `2` 같은 결과도 나올 수 있다. JS가 공유 데이터를 다루면서도 락(lock) 없이 안전한 근본 이유가 여기 있다. 하나의 job이 도는 동안 그 job만이 데이터를 만지고, 아무도 끼어들지 못한다. 여러 콜백이 같은 변수를 건드리는 코드를 볼 때 "경쟁 상태 아닌가" 걱정할 필요가 없는 것도 이 때문이다.
