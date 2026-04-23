---
tags: [testing, best-practice]
---
# Questions
- Unit testing strategies 3가지는 무엇인가?
- Unit test의 benefits는 무엇인가?
- Unit testing이 덜 유익한 상황 3가지는 무엇인가?
- Unit test best practices 2가지는 무엇인가?

---

# Answers

## Unit testing strategies 3가지는 무엇인가?

### Official Answer
**1. Logic checks**
- Does the system perform the right calculations and follow the right path through the code given a correct, expected input
- Are all paths through the code covered by the given inputs?

**2. Boundary checks**
- (Test typical, edge, and out-of-range inputs.)

**3. Error handling**
- When there are errors in inputs, how does the system respond? Is the user prompted for another input? Does the software crash?

> #### User Annotation:
> Logic checks — 함수에서 발생할 수 있는 모든 경우의 수를 전부 커버하고 있는지, 누락된 특정 조건문에 대한 테스트가 있는지 체크한다.

> #### User Annotation:
> Boundary checks — 0~10까지 동작하는 로직이 있다면, 5(일반적), 0/10(경계), -1/11(범위 밖) 케이스를 모두 검증한다.

### Reference
- https://aws.amazon.com/what-is/unit-testing/

---

## Unit test의 benefits는 무엇인가?

### Official Answer
**1. Efficient bug discovery** — (Unit tests catch bugs before they reach production and detect regressions when code changes.)

**2. Documentation** — It's important to document code to know exactly what that code is supposed to be doing.
That said, unit tests also act as a form of documentation.
Other developers read the tests to see what behaviors the code is expected to exhibit when it runs.

> #### User Annotation:
> Efficient bug discovery의 4가지 효과:
>
> | 효과 | 설명 |
> |---|---|
> | 버그 사전 차단 | 유닛 테스트로 인해 프로덕션 도달 전에 오류 발견 가능 |
> | 회귀 감지 | 코드 변경 후 기존 기능이 깨졌는지 감지 가능 |
> | 빠른 디버깅 | 개발자가 문제 코드를 빠르게 파악 |
> | 시간 절약 | 디버깅에 드는 리소스 절감 |

### Reference
- https://aws.amazon.com/what-is/unit-testing/

---

## Unit testing이 덜 유익한 상황 3가지는 무엇인가?

### Official Answer
**1. When time is constrained**
Even with generative unit testing frameworks, writing new unit tests takes a significant amount of your developers' time.
While input and output-based unit tests may be easy to generate, logic-based checks are more difficult.
This can lead to extended development timelines and budget issues.

**2. UI/UX applications**
When the main system is concerned with look and feel rather than logic, there may not be many unit tests to run.

**3. Rapidly evolving requirements**
Depending on the project, the software can grow, change directions, or have whole parts scrapped altogether in any given work sprint.
If requirements are likely to change often, there's not much reason to write unit tests each time a block of code is developed.

> #### User Annotation:
> input/output-based — 인풋·아웃풋만 검증하는 것 (변환함수 등) = 쉬움.
> logic-based — if/else/switch 등 경우의 수에 따라 동작하는 것 = 어려움.

> #### User Annotation:
> look and feel — logical하지 않은, 마크업 위주의 애플리케이션 (애니메이션이 많은 화면 등).

### Reference
- https://aws.amazon.com/what-is/unit-testing/

---

## Unit test best practices 2가지는 무엇인가?

### Official Answer
**1. Automate unit testing**
Unit testing should be triggered on different events within software development.
For example, you can use them before you push changes to a branch using version control software or before you deploy a software update.
Automated unit testing ensures tests run in all appropriate events and cases throughout the development lifecycle.

**2. Assert once**
For each unit test, there should only be one true or false outcome.
Make sure that there is only one assert statement within your test.
A failed assert statement in a block of multiple ones can cause confusion on which one produced the issue.

### Reference
- https://aws.amazon.com/what-is/unit-testing/
