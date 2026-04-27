---
tags: [javascript, concept]
---
# Questions
- Q1. Javascript는 싱글스레드의 한계를 어떻게 극복했을까?
---
# Answers
## Q1. Javascript는 싱글스레드의 한계를 어떻게 극복했을까?
한번에 하나의 코드만 실행할 수 있어서 무거운 함수를 실행하면 사용자는 그 함수가 끝날 때까지 아무것도 못하는데, 이걸 어떻게 극복했을까?

### User Answer
결론부터 말하면, 비동기와 콜백, 그리고 더 작은 함수로 분리하는 것이다.

완료되는 데 오래 걸리는 실행문(function)은 비동기로 실행하고, 가능한 한 더 작은 함수로 분리한다. (아직 Promise 여러 개로 분리하는 건 모름)

왜 비동기와 콜백이냐면, 콜백은 일단 함수다.
그리고 callstack에 들어가는 것도 함수, event queue에 들어가는 것도 함수다.

"서버에서 데이터가 오면 이 함수를 실행해줘! 난 그동안 다른 거 하고 있을게!!" 이 느낌이 바로 비동기 + 콜백이다.

왜 더 작은 함수로 분리해야 하냐면, Javascript는 콜스택에 오래 걸리는 함수가 있으면 그 함수가 실행이 완료되기 전까지 다른 일을 할 수 없다. 스레드가 하나니까.

그래서 서버에서 데이터를 받아오는 것 같은 작업을 동기로 실행한다면
- 서버에서 데이터를 줄 때까지 기다리느라 아무것도 못하고,
- 데이터를 주면 그제야 처리를 해야 하므로 문제가 된다.

비동기로 실행하게 된다면, 서버가 데이터를 주기 전까지 해당 작업은 Event Queue에 들어가게 되고, 그동안 브라우저는 다른 일을 할 수 있게 된다.

물론 Event Loop는 Call stack이 비어있지 않다면 Callback queue에 있는 작업을 call stack에 넣지 않으므로, 서버에서 데이터가 도착했다 하더라도 기존에 실행 중인 작업(in callstack)이 모두 완료되어야 받은 데이터를 처리할 수 있다.

- 동기: 실행이 완료될 때까지 기다려야 함
- 비동기: 기다리지 않음. ⇒ 언제 완료될지 모름.

하지만 결국 오래 걸리는 함수를 비동기로 실행한다고 쳐도, 그 함수가 콜스택에 들어가는 순간 완료될 때까지 다른 일을 못하는 건 여전하므로, 작게 분리해야 한다는 것까지는 이해를 하겠는데 아직 이 개념을 응용해 본 적은 없다.

### 보충: 외부 자료 발췌
- Javascript Runtime은 Heap, Call Stack, Web APIs(DOM, Ajax, setTimeout 등), Callback Queue, Event Loop로 구성된다.
- 싱글 스레드는 하나의 힙 영역과 하나의 콜스택을 가진다. 하나의 콜스택을 가진다는 의미는 한 번에 한 가지 일밖에 하지 못한다는 의미다.
- `Uncaught RangeError: Maximum call stack size exceeded`는 콜스택이 가득 차서 발생하는 에러다.
- 코드가 종료될 때까지 유저가 클릭을 해도 어떠한 반응을 하지 않는 상태가 되는데, 콜스택이 멈춘 상태를 블로킹 상태라고 한다.
- 싱글 스레드인 자바스크립트가 매번 5초가 지났는지 체크하지 않고 5초 후에 콜백을 호출할 수 있는 이유는 브라우저가 자바스크립트를 실행하는 것 이상의 의미를 가지기 때문이다.
- V8 엔진은 크게 두 부분으로 구성된다.
  - 메모리 힙(Memory Heap): 메모리 할당이 이루어지는 곳
  - 콜스택(Call Stack): 코드가 실행되면서 스택 프레임이 쌓이는 곳
- 단일 스레드는 데드락(deadlocks) 같은 상황을 신경 쓰지 않아도 된다는 장점이 있지만, 특정 코드 실행이 늦어지면 UI가 막히는 한계가 있다. 해결책은 비동기 콜백(asynchronous callbacks)이다.

### 보충: setTimeout과 for문 예시
```html
<script>
  for (var i = 0 ; i < 10 ; i++ ) {
    setTimeout(function () {
      console.log(i);
    }, 0);
  }
  console.log("for loop end");

  for (let i = 0 ; i < 99999999; i++) {}

  console.log("99999999 loop end");
</script>
```
실행 순서는
```
for loop end
99999999 loop end
10 10 ... (10이 10번)
```
이렇게 된다.

script 안에 있는 전역 실행문들은 전체가 하나의 global()처럼 실행되기 때문에, for문을 포함한 모든 전역 실행문이 끝나기 전까지 event queue에 있는 작업은 callstack으로 올 수 없어서 이런 일이 발생한다.

아.. 이 부분 인사이드 자바스크립트 책 봐야 마저 이해할 수 있겠다.

### Reference
- https://beomy.github.io/tech/javascript/javascript-runtime/
- https://engineering.huiseoul.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%91%EB%8F%99%ED%95%98%EB%8A%94%EA%B0%80-%EC%97%94%EC%A7%84-%EB%9F%B0%ED%83%80%EC%9E%84-%EC%BD%9C%EC%8A%A4%ED%83%9D-%EA%B0%9C%EA%B4%80-ea47917c8442
- https://engineering.huiseoul.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%91%EB%8F%99%ED%95%98%EB%8A%94%EA%B0%80-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EA%B4%80%EB%A6%AC-4%EA%B0%80%EC%A7%80-%ED%9D%94%ED%95%9C-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EB%88%84%EC%88%98-%EB%8C%80%EC%B2%98%EB%B2%95-5b0d217d788d
