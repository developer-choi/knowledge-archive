---
tags: [javascript, browser, concept]
source: official
---

# Questions
- [UNVERIFIED] 아래 코드의 콘솔 출력 순서는 어떻게 되는가?

---

# Answers

## [UNVERIFIED] 아래 코드의 콘솔 출력 순서는 어떻게 되는가?

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
