---
tags: [javascript, concept]
---

# Questions
- Promise란 무엇인가?
- Promise 생성자는 언제 사용하는가?
- unhandledrejection은 언제 발생하는가?
- Promise를 nested로 사용하면 어떤 문제가 있는가?
- Promise.all()과 Promise.allSettled()는 언제 구분해서 써야 하는가?

---

# Answers

## Promise란 무엇인가?

### User Answer
미래에 성공하거나 실패할 수 있는 비동기 작업을 나타냅니다.
3가지 상태(pending, fulfilled, rejected)를 가집니다.
비동기 작업이 완료/실패될 때까지 기다리지 않고, then, catch, finally 시점에 실행될 콜백 함수를 미리 등록(attach)해 두는 방식으로 처리합니다.
체이닝 문법이기 때문에 콜백 지옥보다 보기 편합니다.


---

## Promise 생성자는 언제 사용하는가?

### User Answer
Promise 생성자는 대부분 Promise를 지원하지 않는 함수를 감싸기 위해 사용합니다.


---

## unhandledrejection은 언제 발생하는가?

### User Answer
Promise가 rejected될 때 이를 처리해 주지 않으면, global scope까지 propagation되어 unhandledrejection 이벤트가 발생합니다.
브라우저에서는 `window.addEventListener('unhandledrejection', ...)`로 핸들러를 등록할 수 있습니다.
Node.js에서는 `process.on('unhandledrejection')`으로 로그를 남기는 데 활용할 수 있습니다.

주의해야 할 점은, "Promise가 rejected될 때" 처리해 주지 않으면 발생한다는 것입니다.
예를 들어, rejected된 Promise에 대해 1초 뒤에 핸들러를 등록하면, 정작 Promise가 rejected되는 시점에는 아무런 핸들러가 없으므로 unhandledrejection이 발생합니다.


---

## Promise를 nested로 사용하면 어떤 문제가 있는가?

### User Answer
Promise는 사실 nested(콜백 지옥)를 해결하기 위해 나왔습니다.
그런데 Promise를 nested로 사용하면 그 의미가 퇴색되고 실수로 사고를 칠 수 있습니다.

- nested로 작성하면 읽기 힘듭니다.
- 외부 then 콜백과 내부 Promise의 then 콜백이 병렬로 실행될 수 있습니다(의도하지 않았다면 위험합니다).
- nested된 Promise를 깜빡하고 catch하지 않으면 global scope로 unhandledrejection이 전파될 수 있습니다.

결국 `Promise.resolve().then().then().then().catch();` 형태로 평탄하게 연결해야 읽기도 편하고 모든 에러를 다 캐치할 수 있습니다.

또한 then에서 return하지 않으면 데이터가 이후 Promise로 전달되지 않습니다(흔히 "체인이 끊어진다"고 표현하지만, 이 표현이 정확한지는 다소 애매합니다).
익숙한 동기적인 문법으로 Promise를 사용할 수 있게 해 주는 async/await 문법은 이런 문제를 줄여 주기 때문에 매우 유용합니다.


---

## Promise.all()과 Promise.allSettled()는 언제 구분해서 써야 하는가?

### User Answer
`Promise.all()`은 여러 비동기 작업 중 하나라도 실패했을 때 나머지도 모두 실패로 처리해야 하는 경우에 사용합니다.
일부가 실패해도 성공한 결과만이라도 사용해야 하는 경우에는 `Promise.allSettled()`를 써야 합니다.

쇼핑몰 개발 당시 모든 페이지에서 재사용되는 API들을 하나의 함수에서 호출하는 "every page api"를 만든 적이 있는데, 이때 `Promise.all()`로 구현해서 인기 검색어 호출이 실패하면 헤더 카테고리도 같이 안 나오는 문제가 있었습니다.
이후 `Promise.allSettled()`로 바꾸어, 인기 검색어를 못 가져와도 헤더 카테고리는 정상적으로 나오도록 예외 처리를 수정했습니다.

여기서 한 단계 더 나아가, 실패한 건 무시하고 성공한 것만 모아 주는 `Promise.allFulfilled()` 같은 유틸을 만들고 싶었지만 마땅한 방법이 떠오르지 않아 접었습니다.

