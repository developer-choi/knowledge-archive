---
tags: [javascript, performance]
---

# Questions
- 디바운싱과 스로틀링은 무엇이며 왜 사용하는가?
- 디바운싱과 스로틀링의 차이는?
- 무한 스크롤 구현에 디바운싱과 스로틀링 중 어느 것이 적합한가?
- 아이디 중복검사에 디바운싱과 스로틀링 중 어느 것이 적합한가?

---

# Answers

## 디바운싱과 스로틀링은 무엇이며 왜 사용하는가?
### User Answer
짧은 시간 안에 굉장히 여러 번 실행되는 로직이 있을 때 (예: 스크롤될 때마다 실행되는 로직), 그 횟수를 적당히 줄이기 위한 기술이다.

### Reference
- https://css-tricks.com/debouncing-throttling-explained-examples/
- https://webclub.tistory.com/607

---

## 디바운싱과 스로틀링의 차이는?
### User Answer
- Debounce: 가장 마지막에 시도한 로직만 실행시키고 이전 것은 무시한다.
- Throttle: 로직을 특정한 주기마다 띄엄띄엄 실행한다.

### Reference
- https://css-tricks.com/debouncing-throttling-explained-examples/
- https://webclub.tistory.com/607

---

## 무한 스크롤 구현에 디바운싱과 스로틀링 중 어느 것이 적합한가?
### User Answer
무한 스크롤 방식을 스크롤 이벤트로 구현하면, 짧은 시간 안에 스크롤 이벤트 핸들러가 수백 수천 번 실행된다.

이걸 줄이기 위해 디바운싱을 적용하면 스크롤을 다 내리고 나서 약간의 시간이 지난 후에야 이벤트 핸들러가 호출되고, 스로틀링을 적용하면 스크롤을 내리는 내내 약간의 시간마다 이벤트 핸들러가 호출된다.

둘 중 더 적합한 방식은 스로틀링이다.
임계점을 내리자마자 원하는 로직을 실행시키려면, 결국 특정 시간마다 주기적으로 할 수밖에 없기 때문이다.

### Reference
- https://css-tricks.com/debouncing-throttling-explained-examples/
- https://webclub.tistory.com/607

---

## 아이디 중복검사에 디바운싱과 스로틀링 중 어느 것이 적합한가?
### User Answer
`hongildong` 이라고 아이디를 순서대로 쭉 입력하는 경우, h o n g i l d o n g 한 글자 입력할 때마다 API가 호출되는 것은 부적절하다.
아직 입력 중이기 때문이다.

스로틀링을 적용하면 아직 입력이 끝나지 않고 한창 입력 중인데도 중간중간에 계속 API가 띄엄띄엄 호출되고, 디바운싱을 적용하면 마지막 입력 후 약간의 시간이 지나야 API가 호출된다.

둘 중 적합한 방식은 디바운싱이다.
아직 입력을 다 안 했는데 중간중간에 주기적으로 체크할 이유가 없기 때문이다.

### Reference
- https://css-tricks.com/debouncing-throttling-explained-examples/
- https://webclub.tistory.com/607
