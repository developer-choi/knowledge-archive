---
tags: [software-engineering, comparison]
---
# Questions
- Static test란 무엇인가?
- Unit test란 무엇인가?
  - Unit test의 장점과 단점은?
  - Unit test에서 의존성을 mock하고 호출 assertion이 통과하면, 실제 연동도 정상이라고 볼 수 있는가?
  - Unit test에서 dependency가 있을 때 어떻게 처리하는가?
- Integration test란 무엇인가?
  - Integration test의 장점과 단점은?
  - Integration test에서 mock하는 것과 하지 않는 것의 기준은?
  - Integration test도 잡을 수 없는 문제는 무엇인가?
- E2E test란 무엇인가?
  - E2E test의 장점과 단점은?
  - E2E로 모든 edge case를 잡으면 가장 확실한 거 아닌가?
  - Async Server Component는 어떤 테스트 방식을 권장하는가?
- Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?
- Testing Pyramid 대신 Testing Trophy를 쓰는 이유는?
  - confidence coefficient란 무엇인가?
  - 각 테스트 레벨이 잡을 수 없는 문제를 정리하면?
- 테스트 전략에서 레벨 분류보다 중요한 판단 기준은 무엇인가?
- 팀에서 애플리케이션 코드 커버리지 100%를 의무화하면 어떤 문제가 생기는가?
  - 100% 코드 커버리지가 적절한 경우는 언제인가?
- 코드 커버리지 리포트에서 테스트가 없는 라인을 발견했을 때, 어떤 질문을 던져야 하는가?

---

# Answers

## Static test란 무엇인가?

### Official Answer
Static: Catch typos and type errors as you write the code.

> #### AI Annotation: Testing Trophy의 가장 아래에 위치한다. ESLint, TypeScript 같은 도구가 코드를 실행하지 않고도 문법 오류, 타입 불일치, 무한루프 등을 잡아준다. 테스트를 작성할 필요조차 없다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Unit test란 무엇인가?

### Official Answer
Unit: Verify that individual, isolated parts work as expected.

> #### Official Annotation: The key distinction is that the unit tests test my/our code in isolation while integration tests how our code works with code developed separately.
> — Martin Fowler, "On the Diverse And Fantastical Shapes of Testing"
> #### Official Annotation: Unit testing is the process where you test the smallest functional unit of code.
> A unit test is a block of code that verifies the accuracy of a smaller, isolated block of application code, typically a function or method.
> Unit tests are typically the first set of tests that run during full system software testing.
> They can be written as soon as any code is written and don't require any special tools to run.
> — AWS, "What is Unit Testing"
> #### AI Annotation: Testing Trophy에서 Static 바로 위에 위치한다. 순수 함수 테스트가 가장 대표적이며, 컴포넌트를 단독으로(Provider 없이) 렌더링하는 것도 unit test에 해당한다.
> #### AI Annotation: Kent는 "individual, isolated parts"로 정의하지만, Fowler는 "내/우리 코드 vs 별도 개발 코드"라는 조직적 색채를 남긴다. 같은 개념을 다른 각도(기술적 격리 vs 조직적 경계)에서 본다. 더 자세한 기원은 test-shapes-unit-vs-integration.md 참고.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://martinfowler.com/articles/2021-test-shapes.html
- https://aws.amazon.com/what-is/unit-testing/

---

## Unit test의 장점과 단점은?

### Official Answer
Unit tests typically test something small that has no dependencies or will mock those dependencies (effectively swapping what could be thousands of lines of code with only a few).

The lower down the trophy you are, the less code your tests are testing.
If you're operating at a low level you need more tests to cover the same number of lines of code in your application as a single test could higher up the trophy.
In fact, as you go lower down the testing trophy, there are some things that are impossible to test.

> #### AI Annotation: 장점 — 빠르고(실행 코드가 적음), 비용이 낮고(작성·유지 간단), 실패 시 원인이 명확하다.
> #### AI Annotation: 단점 — confidence coefficient가 낮고, 같은 커버리지를 위해 더 많은 테스트가 필요하며, 의존성 연동 문제는 구조적으로 잡을 수 없다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Unit test에서 의존성을 mock하고 호출 assertion이 통과하면, 실제 연동도 정상이라고 볼 수 있는가?

### Official Answer
Unit tests are incapable of ensuring that when you call into a dependency that you're calling it appropriately (though you can make assertions on how it's being called, you can't ensure that it's being called properly with a unit test).

> #### Official Annotation: It doesn't matter if your component `<A />` renders component `<B />` with props c and d if component `<B />` actually breaks if prop e is not supplied. So while having some unit tests to verify these pieces work in isolation isn't a bad thing, it doesn't do you any good if you don't also verify that they work together properly.
> — Kent C. Dodds, "Write tests. Not too many. Mostly integration."
> #### AI Annotation: 아니오. mock은 가짜 구현이므로, 실제 의존성이 해당 인자를 받아서 올바르게 동작하는지는 보장할 수 없다. 예를 들어 `api.createUser({name: 'Kim'})`을 호출했다고 assertion하더라도, 실제 API가 `username` 필드를 기대한다면 unit test는 이를 잡지 못한다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Unit test에서 dependency가 있을 때 어떻게 처리하는가?

### Official Answer
When a block of code requires other parts of the system to run, you can't use a unit test with that external data.
The unit test needs to run in isolation.
Other system data, such as databases, objects, or network communication, might be required for the code's functionality.
If that's the case, you should use data stubs instead.

> #### Key Terms:
> - **data stubs**: 실제 외부 데이터 대신 사용하는 가짜(고정) 데이터

> #### AI Annotation: Unit test는 isolation이 핵심이므로, DB·네트워크·외부 객체 같은 외부 의존성은 그대로 사용할 수 없다.
> 대신 data stub(고정된 가짜 데이터)으로 대체하여 테스트 대상 코드만 격리해 검증한다.

### Reference
- https://aws.amazon.com/what-is/unit-testing/

---

## Integration test란 무엇인가?

### Official Answer
Integration: Verify that several units work together in harmony.

The idea behind integration tests is to mock as little as possible.

> #### Official Annotation: Integration Testing involves testing how multiple units work together.
> This can be a combination of components, hooks, and functions.
> — Next.js, "Testing"
> #### AI Annotation: Testing Trophy에서 가장 큰 비중을 차지한다. 여러 단위가 함께 동작하는지를 검증하며, 앱의 모든 Provider를 감싸 실제 환경과 최대한 비슷하게 렌더링한다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://nextjs.org/docs/app/guides/testing

---

## Integration test의 장점과 단점은?

### Official Answer
The size of these forms of testing on the trophy is relative to the amount of focus you should give them when testing your applications (in general).

The idea behind integration tests is to mock as little as possible.
I pretty much only mock:
1. Network requests (using MSW)
2. Components responsible for animation (because who wants to wait for that in your tests?)

> #### AI Annotation: 장점 — 비용·속도와 자신감 사이의 최적 균형점. unit보다 높은 confidence coefficient를 가지면서, E2E보다 빠르고 저렴하다. mock을 최소화하므로 실제 동작에 가깝다.
> #### AI Annotation: 단점 — unit보다는 느리고, 실패 시 원인 추적이 unit보다 어렵다. 실제 백엔드 연동 문제는 잡을 수 없다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Integration test에서 mock하는 것과 하지 않는 것의 기준은?

### Official Answer
I pretty much only mock:
1. Network requests (using MSW)
2. Components responsible for animation (because who wants to wait for that in your tests?)

> #### Official Annotation: When you mock something you're removing all confidence in the integration between what you're testing and what's being mocked.
> You don't actually want to send emails or charge credit cards every test, but most of the time you can avoid mocking and you'll be better for it.
> — Kent C. Dodds, "Write tests. Not too many. Mostly integration."
> #### AI Annotation: 그 외에는 전부 실제 코드를 사용한다. 커스텀 render가 앱의 모든 Provider(Router, Theme, Auth 등)를 감싸 실제 환경과 최대한 비슷하게 렌더링한다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Integration test도 잡을 수 없는 문제는 무엇인가?

### Official Answer
UI Integration tests are incapable of ensuring that you're passing the right data to your backend and that you respond to and parse errors correctly.

> #### AI Annotation: MSW로 네트워크를 mock하기 때문에, 실제 백엔드에 올바른 데이터를 보내는지, 백엔드가 보내는 실제 에러 형식을 제대로 파싱하는지는 보장할 수 없다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## E2E test란 무엇인가?

### Official Answer
End to End: A helper robot that behaves like a user to click around the app and verify that it functions correctly.
Sometimes called "functional testing" or e2e.

Typically these will run the entire application (both frontend and backend) and your test will interact with the app just like a typical user would.
These tests are written with cypress.

> #### AI Annotation: Testing Trophy에서 가장 꼭대기에 위치한다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## E2E test의 장점과 단점은?

### Official Answer
An E2E test has more points of failure making it often harder to track down what code caused the breakage, but it also means that your test is giving you more confidence.
This is especially useful if you don't have as much time to write tests.
I'd rather have the confidence and be faced with tracking down why it's failing, than not having caught the problem via a test in the first place.

The higher up the trophy you go, the more points of failure there are and therefore the more likely it is that a test will break, leading to more time needed to analyze and fix the tests.

End to End tests are pretty darn capable, but typically you'll run these in a non-production environment (production-like, but not production) to trade-off that confidence for practicality.

> #### AI Annotation: 장점 — confidence coefficient가 가장 높다. 프론트+백엔드 전체를 실제 사용자처럼 테스트하므로 가장 높은 자신감을 준다.
> #### AI Annotation: 단점 — 가장 비싸고(CI 비용 + 유지보수), 가장 느리고(전체 앱 실행), 실패 시 원인 추적이 가장 어렵다. 비프로덕션 환경에서 돌리므로 프로덕션 100% 보장은 아니다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## E2E로 모든 edge case를 잡으면 가장 확실한 거 아닌가?

### Official Answer
At the top of the testing trophy, if you try to use an E2E test to check that typing in a certain field and clicking the submit button for an edge case in the integration between the form and the URL generator, you're doing a lot of setup work by running the entire application (backend included).
That might be more suitable for an integration test.
If you try to use an integration test to hit an edge case for the coupon code calculator, you're likely doing a fair amount of work in your setup function to make sure you can render the components that use the coupon code calculator and you could cover that edge case better in a unit test.
If you try to use a unit test to verify what happens when you call your add function with a string instead of a number you could be much better served using a static type checking tool like TypeScript.

> #### AI Annotation: 아니오. 각 edge case를 가장 효율적으로 잡을 수 있는 레벨이 따로 있다. E2E로 모든 것을 잡으려 하면 셋업 비용이 과도하고, 테스트가 느려지고, 실패 원인 추적이 어려워진다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Async Server Component는 어떤 테스트 방식을 권장하는가?

### Official Answer
Since async Server Components are new to the React ecosystem, some tools do not fully support them.
In the meantime, we recommend using End-to-End Testing over Unit Testing for async components.

> #### AI Annotation: 현재 Jest 등 일부 도구가 async Server Component를 완전히 지원하지 못한다.
> 그래서 Next.js는 async 컴포넌트는 Unit test 대신 E2E로 검증할 것을 권장한다.

### Reference
- https://nextjs.org/docs/app/guides/testing

---

## Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?

### Official Answer
Snapshot Testing involves capturing the rendered output of a component and saving it to a snapshot file.
When tests run, the current rendered output of the component is compared against the saved snapshot.
Changes in the snapshot are used to indicate unexpected changes in behavior.

> #### AI Annotation: Snapshot Testing은 Unit / Integration / E2E와 같은 "테스트 범위" 축이 아니라, 그 위에서 보조로 쓰이는 검증 방식이다.
> 컴포넌트의 렌더 결과를 스냅샷 파일에 저장해두고, 이후 실행에서 의도치 않은 변화가 생겼는지 비교한다.

### Reference
- https://nextjs.org/docs/app/guides/testing

---

## Testing Pyramid 대신 Testing Trophy를 쓰는 이유는?

### Official Answer
As you move up the testing trophy, the tests become more costly.
This comes in the form of actual money to run the tests in a continuous integration environment, but also in the time it takes engineers to write and maintain each individual test.

As you move up the testing trophy, the tests typically run slower.
This is due to the fact that the higher you are on the testing trophy, the more code your test is running.

The cost and speed trade-offs are typically referenced when people talk about the testing pyramid.
If those were the only trade-offs though, then I would focus 100% of my efforts on unit tests and totally ignore any other form of testing when regarding the testing pyramid.
Of course we shouldn't do that and this is because of one super important principle that you've probably heard me say before:

The more your tests resemble the way your software is used, the more confidence they can give you.

What does this mean?
It means that there's no better way to ensure that your Aunt Marie will be able to file her taxes using your tax software than actually having her do it.
But we don't want to wait on Aunt Marie to find our bugs for us right?
It would take too long and she'd probably miss some features that we should probably be testing.
Compound that with the fact that we're regularly releasing updates to our software there's no way any amount of humans would be able to keep up.

So what do we do?
We make trade-offs.
And how do we do that?
We write software that tests our software.
And the trade-off we're always making when we do that is now our tests don't resemble the way our software is used as reliably as when we had Aunt Marie testing our software.
But we do it because we solve real problems we had with that approach.
And that's what we're doing at every level of the testing trophy.

> #### AI Annotation: Pyramid는 비용·속도만 고려해서 unit을 가장 많이 쓰라 했지만, 자신감(confidence)이라는 세 번째 축을 무시했다. Trophy는 비용·속도·자신감 세 축의 균형을 고려하여 Integration에 가장 큰 비중을 둔다.
> #### User Annotation: 촘촘하게 테스트 해야하니까. 비즈니스 로직 사이 사이를.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## confidence coefficient란 무엇인가?

### Official Answer
As you move up the testing trophy, you're increasing what I call the "confidence coefficient."
This is the relative confidence that each test can get you at that level.
You can imagine that above the trophy is manual testing.
That would get you really great confidence from those tests, but the tests would be really expensive and slow.

> #### AI Annotation: Trophy 위로 갈수록 테스트 1개당 자신감이 커진다. Trophy 꼭대기 위에는 manual testing(Aunt Marie)이 있고, 자신감은 최고지만 비용·속도가 최악이다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## 각 테스트 레벨이 잡을 수 없는 문제를 정리하면?

### Official Answer
In particular, static analysis tools are incapable of giving you confidence in your business logic.
Unit tests are incapable of ensuring that when you call into a dependency that you're calling it appropriately (though you can make assertions on how it's being called, you can't ensure that it's being called properly with a unit test).
UI Integration tests are incapable of ensuring that you're passing the right data to your backend and that you respond to and parse errors correctly.
End to End tests are pretty darn capable, but typically you'll run these in a non-production environment (production-like, but not production) to trade-off that confidence for practicality.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## 테스트 전략에서 레벨 분류보다 중요한 판단 기준은 무엇인가?

### Official Answer
In the end I don't really care about the distinctions.
If you want to call my unit tests integration tests or even E2E tests (as some people have) then so be it.
What I'm interested in is whether I'm confident that when I ship my changes, my code satisfies the business requirements and I'll use a mix of the different testing strategies to accomplish that goal.

The biggest and most important reason that I write tests is CONFIDENCE.
I want to be confident that the code I'm writing for the future won't break the app that I have running in production today.
So whatever I do, I want to make sure that the kinds of tests I write bring me the most confidence possible and I need to be cognizant of the trade-offs I'm making when testing.

> #### Official Annotation: Much better to catch a bug locally from the tests than getting a call at 2:00 in the morning and fix it then. Often I find myself saving time when I put time in to write tests. It may or may not take longer to implement what I'm building, but I (and others) will almost definitely save time maintaining it.
> — Kent C. Dodds, "Write tests. Not too many. Mostly integration."

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://kentcdodds.com/blog/write-tests

---

## 팀에서 애플리케이션 코드 커버리지 100%를 의무화하면 어떤 문제가 생기는가?

### Official Answer
The problem is that you get diminishing returns on your tests as the coverage increases much beyond 70% (I made that number up... no science there).
When you strive for 100% all the time, you find yourself spending time testing things that really don't need to be tested.
Things that really have no logic in them at all (so any bugs could be caught by ESLint and Flow).
Maintaining tests like this actually really slow you and your team down.

You may also find yourself testing implementation details just so you can make sure you get that one line of code that's hard to reproduce in a test environment.
You really want to avoid testing implementation details because it doesn't give you very much confidence that your application is working and it slows you down when refactoring.
You should very rarely have to change tests when you refactor code.

> #### Key Terms:
> - **diminishing returns**: 투입 대비 산출이 줄어드는 수확 체감 현상. 커버리지가 일정 수준을 넘으면 테스트 1개당 얻는 자신감이 급감한다
> - **code coverage**: 테스트가 실행하는 코드의 비율. 높을수록 좋다는 직관과 달리, 과도한 추구는 역효과를 낳는다
> #### Official Annotation: The code coverage report in this case helps give us an idea that tests are needed, but it does NOT tell us what's important about this function, nor does it tell us the use cases this function supports which is the most important consideration we keep in mind as we write tests.
> — Kent C. Dodds, "How to Know What to Test"
> #### User Annotation: 이상적인 커버리지 수치는 회사 역량과 대상 코드의 중요도에 따라 달라진다.
> 규모가 작아 기능 구현이 벅찬 회사라면 테스트 도입 자체가 부담일 수 있고,
> 인원이 충분한 대기업에서 금융 관련 서비스를 만든다면 커버리지를 최대한 높여야 한다.
> 즉, 회사 역량이 뒷받침되어야 하고, 테스트 대상이 그만큼 중요한지에 따라 적정 수치가 달라진다.

### Reference
- https://kentcdodds.com/blog/write-tests
- https://kentcdodds.com/blog/how-to-know-what-to-test

---

## 100% 코드 커버리지가 적절한 경우는 언제인가?

### Official Answer
Almost all of my open source projects have 100% code coverage.
This is because most of my open source projects are smaller libraries and tools that are reusable in many different situations (a breakage could lead to a serious problem in a lot of consuming projects) and they're relatively easy to get 100% code coverage on anyway.

> #### AI Annotation: 100% 커버리지가 합리적인 조건 2가지: (1) 깨지면 다수 소비 프로젝트에 심각한 영향 (높은 파급력), (2) 작은 라이브러리라 100% 달성이 쉬움 (낮은 비용). 애플리케이션 코드에서 이 두 조건을 동시에 만족하기는 어렵다.

### Reference
- https://kentcdodds.com/blog/write-tests

---

## 코드 커버리지 리포트에서 테스트가 없는 라인을 발견했을 때, 어떤 질문을 던져야 하는가?

### Official Answer
When you look at a code coverage report and note the lines that are missing tests, don't think about the ifs/elses, loops, or lifecycles.
Instead ask yourself:

What use cases are these lines of code supporting, and what tests can I add to support those use cases?

"Use Case Coverage" tells us how many of the use cases our tests support.
Unfortunately, there's no such thing as an automated "Use Case Coverage Report."
We have to make that up ourselves.
But the code coverage report can sometimes help us identify use cases that we're not covering.

> #### Key Terms:
> - **Use Case Coverage**: 테스트가 커버하는 유스케이스의 비율. 자동 측정 도구가 없어 개발자가 직접 판단해야 한다
> #### Official Annotation: Sometimes, our code coverage report indicates 100% code coverage, but not 100% use case coverage.
> Code coverage is not a perfect metric, but it can be a useful tool in identifying what parts of our codebase are missing "use case coverage".
> #### AI Annotation: Code Coverage는 "어떤 라인이 실행되었는가"만 보여주고, "이 라인이 왜 중요한가"는 알려주지 않는다. 커버리지 리포트는 유스케이스 발견의 보조 도구로만 쓰고, 진짜 판단 기준은 Use Case Coverage다.

### Reference
- https://kentcdodds.com/blog/how-to-know-what-to-test
