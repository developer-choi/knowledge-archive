---
tags: [testing, test-adoption]
---
# Questions

- [What problems were you trying to solve by adopting testing?](#what-problems-were-you-trying-to-solve-by-adopting-testing)
  - [Why did bugs occur in production?](#why-did-bugs-occur-in-production)
  - [What alternatives did you consider, and why did you choose testing?](#what-alternatives-did-you-consider-and-why-did-you-choose-testing)
- [How did you decide the balance between E2E, integration, and unit tests?](#how-did-you-decide-the-balance-between-e2e-integration-and-unit-tests)
  - [What E2E test ratio did you set, and why?](#what-e2e-test-ratio-did-you-set-and-why)
  - [What unit test ratio did you set, and why?](#what-unit-test-ratio-did-you-set-and-why)
  - [What integration test ratio did you set, and why?](#what-integration-test-ratio-did-you-set-and-why)
  - [Why did you choose the testing trophy over the traditional test pyramid?](#why-did-you-choose-the-testing-trophy-over-the-traditional-test-pyramid)

---

# Answers

## What problems were you trying to solve by adopting testing?
### Official Answer
The biggest and most important reason that I write tests is CONFIDENCE.
I want to be confident that the code I'm writing for the future won't break the app that I have running in production today.

### User Annotation
배포하기 전에, 코드가 문제없는지를 확인하어서.
리팩토링 했을 떄
기능을 추가 & 수정했을 때

하지만, 비즈니스보다 테스트가 더 중요한것은 아니기 때문에,
가성비를 챙기고싶다.


### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Why did bugs occur in production?
### User Annotation
수정의 영향범위 파악의 한계
>
개발자 (사람)의 한계
>
안전장치의 한계 (코드리뷰, QA)

### Reference
TODO

---

## What alternatives did you consider, and why did you choose testing?
### Official Answer
TODO

### User Annotation
물리적인 시간을 길게 하기 (개발기간, QA기간, 코드리뷰 기간)
테스트코드라는 안전장치를 추가하기
둘 다 버그를 100% 막을 수는 없지만, 더 줄일 수 있는 방법은 맞습니다.

#### 그렇지만 테스트를 선택 한 근거는
사람과 달리, 일을 병렬로 진행 가능.
테스트 돌려놓고 다른일 가능, 자동화도 가능.

테스트코드로 인해 나가는 비용은 인건비가 아님.
컴퓨팅 비용
그 테스트코드를 작성하고 유지보수하는 비용

2번도 이제는 AI가 있어서 줄일 수 있음.



### Reference
TODO

---

## What E2E test ratio did you set, and why?
### Official Answer
TODO

### User Annotation
비중을 적게잡음.

왜냐하면, 테스트 실행속도가 제일 느림. 실행되는 코드가 제일 많으니까. (외부환경도 다 기다려야함)

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## What unit test ratio did you set, and why?
### Official Answer
TODO

### User Annotation
- 사용자가 사용하는 방식과 동떨어져있기 때문

### Reference
- https://testing-library.com/docs/guiding-principles

---

## What integration test ratio did you set, and why?
### Official Answer
TODO

### User Annotation
Unit / E2E 테스트의 장단점을 적당히 타협할 수 있기 때문.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Why did you choose the testing trophy over the traditional test pyramid?
### Official Answer
TODO

### User Annotation
촘촘하게 테스트 해야하니까. 비즈니스 로직 사이 사이를.

### Reference
- https://web.dev/articles/ta-strategies
