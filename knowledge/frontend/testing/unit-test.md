---
tags: [testing, concept]
source: official
priority:
---
# Questions
- Unit test란 무엇인가?
- Unit testing strategies 3가지는 무엇인가?

---

# Answers

## Unit test란 무엇인가?

### Official Answer
Unit: Verify that individual, isolated parts work as expected.

Unit testing is the process where you test the smallest functional unit of code.
A unit test is a block of code that verifies the accuracy of a smaller, isolated block of application code, typically a function or method.
Unit tests are typically the first set of tests that run during full system software testing.
They can be written as soon as any code is written and don't require any special tools to run.

Unit tests typically test something small that has no dependencies or will mock those dependencies (effectively swapping what could be thousands of lines of code with only a few).

> #### AI Annotation:
> Testing Trophy에서 Static 바로 위에 위치한다.
> 순수 함수 테스트가 가장 대표적이며, 컴포넌트를 단독으로(Provider 없이) 렌더링하는 것도 unit test에 해당한다.
>
> Kent는 "individual, isolated parts"로 정의하지만, Fowler는 "내/우리 코드 vs 별도 개발 코드"라는 조직적 색채를 남긴다.
> 같은 개념을 다른 각도(기술적 격리 vs 조직적 경계)에서 본다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://martinfowler.com/articles/2021-test-shapes.html
- https://aws.amazon.com/what-is/unit-testing/

---

## Unit testing strategies 3가지는 무엇인가?

### Official Answer
**1. Logic checks**
- Does the system perform the right calculations and follow the right path through the code given a correct, expected input
- Are all paths through the code covered by the given inputs?

**2. Boundary checks**
- For the given inputs, how does the system respond? How does it respond to typical inputs, edge cases, or invalid inputs?

**3. Error handling**
- When there are errors in inputs, how does the system respond? Is the user prompted for another input? Does the software crash?

> #### User Annotation:
> Logic checks — 함수에서 발생할 수 있는 모든 경우의 수를 전부 커버하고 있는지, 누락된 특정 조건문에 대한 테스트가 있는지 체크한다.

> #### User Annotation:
> Boundary checks — 0~10까지 동작하는 로직이 있다면, 5(일반적), 0/10(경계), -1/11(범위 밖) 케이스를 모두 검증한다.

### Reference
- https://aws.amazon.com/what-is/unit-testing/
