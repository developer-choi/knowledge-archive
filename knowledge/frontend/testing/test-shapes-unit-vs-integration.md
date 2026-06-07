---
tags: [testing, software-engineering, history, comparison]
source: official
priority:
---
# Questions
- Test Pyramid, Testing Honeycomb, Testing Trophy는 각각 테스트 유형의 비중에 대해 어떤 주장을 하는가?
- Martin Fowler는 pyramid vs honeycomb/trophy 논쟁이 왜 혼란스럽다고 보는가?
- "unit test"와 "integration test"라는 용어는 원래 어떤 문제를 구분하기 위한 말이었는가?
- Fowler가 정리하는 unit test와 integration test의 본질적 구분은 무엇인가?
- Kent Beck은 Xunit 계열에서 "unit test"를 어떻게 재정의했으며, 그 정의의 축은 이전의 조직적 정의와 어떻게 다른가?
- Kent Beck이 말한 "프로그래머가 unit test를 쓴다"의 목적은 무엇인가?

---

# Answers

## Test Pyramid, Testing Honeycomb, Testing Trophy는 각각 테스트 유형의 비중에 대해 어떤 주장을 하는가?

### Official Answer
The pyramid argues that you should have most testing done as unit tests, the honeycomb and trophy instead say you should have a relatively small amount of unit tests and focus mostly on integration tests.

> #### AI Annotation:
> 같은 현상(테스트 분배)에 대해 정반대 처방이 공존한다. Pyramid는 "unit 많이, 위로 갈수록 적게", Honeycomb/Trophy는 "integration 많이, unit 소량"으로 뒤집힌다.

### Reference
- https://martinfowler.com/articles/2021-test-shapes.html

---

## Martin Fowler는 pyramid vs honeycomb/trophy 논쟁이 왜 혼란스럽다고 보는가?

### Official Answer
The second biggest issue I have with this discussion is that it's rendered opaque by the fact that it's not clear what people see as the difference between unit and integration tests.

The terms "unit test" and "integration test" have always been rather murky, even by the slippery standards of most software terminology.

> #### AI Annotation:
> 도형 논쟁 아래에는 정의 문제가 깔려 있다. "unit"이 함수 단위인지, 클래스 단위인지, 팀 단위인지 사람마다 다르게 매핑되므로, 같은 단어를 쓰면서도 서로 다른 얘기를 하게 된다. 정의를 먼저 맞추지 않으면 비율 논쟁은 공허해진다.

### Reference
- https://martinfowler.com/articles/2021-test-shapes.html

---

## "unit test"와 "integration test"라는 용어는 원래 어떤 문제를 구분하기 위한 말이었는가?

### Official Answer
As I originally understood it, they were primarily an organizational issue.
Let's go back to the days of large waterfall software projects.
I'm working on a hunk of code for several months.
I may be working on it alone, or in a small team.
Either way I think of this hunk as a conceptual unit which we can work on in relative separation from its neighbors.
Once we've finished coding it we can hand it off to the unit testing team, who then test that unit on its own.
After a month or two to make those tests work, we can then integrate it with its neighbors and carry out integration tests against a larger part of the system, or indeed the entire system.

> #### AI Annotation:
> "unit/integration"은 원래 기술 용어가 아니라 조직 프로세스 용어였다. 내 팀이 몇 달간 붙잡은 덩어리 = unit, 다른 팀 코드와 합쳐지는 순간 = integration. 오늘날 쓰이는 기술적 정의(격리 vs 통합)는 후대에 같은 단어에 덧씌워진 의미다. 그래서 "unit"의 크기가 사람마다 다른 것이다.

### Reference
- https://martinfowler.com/articles/2021-test-shapes.html

---

## Fowler가 정리하는 unit test와 integration test의 본질적 구분은 무엇인가?

### Official Answer
The key distinction is that the unit tests test my/our code in isolation while integration tests how our code works with code developed separately.

> #### AI Annotation:
> Kent C. Dodds의 "individual, isolated parts" 정의와 비교해 보면 Fowler의 정의는 **"누가 개발한 코드인가"** 라는 조직적 색채를 유지한다. 즉 Fowler 기준으로는 "내가 짠 코드 + 내가 짠 다른 코드"의 조합도 여전히 unit test일 수 있고, "내 코드 + 다른 팀/라이브러리가 짠 코드"의 조합은 integration test다. 이 관점은 sociable/solitary 구분과도 연결된다 — testing-trophy.md의 Unit test 정의(Kent)와 상호 참조.

### Reference
- https://martinfowler.com/articles/2021-test-shapes.html

---

## Kent Beck은 Xunit 계열에서 "unit test"를 어떻게 재정의했으며, 그 정의의 축은 이전의 조직적 정의와 어떻게 다른가?

### Official Answer
Many people today ran into unit tests as part of the Xunit family of testing tools, pioneered by Kent Beck as part of Extreme Programming.
Kent used "unit test" to indicate tests written by developers as part of their day-to-day work.

Notice that in Kent's original formulation, "unit test" means anything written by the programmers as opposed to a separate testing team.

> #### AI Annotation:
> 워터폴 시대의 정의는 "누가 **테스트**하느냐(조직 경계)"였다면, Kent의 재정의는 "누가 **작성**하느냐(역할)"로 축이 바뀐 것이다. 크기나 격리가 아니라 작성자 기준이므로, Kent 정의에서는 DB를 띄워 돌리는 테스트라도 프로그래머가 직접 썼다면 unit test가 될 수 있다.

### Reference
- https://martinfowler.com/articles/2021-test-shapes.html

---

## Kent Beck이 말한 "프로그래머가 unit test를 쓴다"의 목적은 무엇인가?

### Official Answer
Programmers write unit tests so that their confidence in the operation of the program can become part of the program itself.
Customers write functional tests so that their confidence in the operation of the program can become part of the program too.
— Kent Beck (Extreme Programming Explained, 1st Edition)

> #### AI Annotation:
> 기존에는 "내가 잘 짰다"는 믿음이 개발자 머릿속에만 있어, 시간이 지나거나 사람이 바뀌면 사라졌다. unit test를 쓰면 그 믿음이 실행 가능한 검증으로 코드베이스에 박혀, 다음 빌드/다음 개발자가 자동으로 재확인하게 된다. 같은 원리로 고객(도메인 전문가)의 확신은 functional test 형태로 프로그램에 박힌다.

### Reference
- https://martinfowler.com/articles/2021-test-shapes.html
