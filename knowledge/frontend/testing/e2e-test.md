---
tags: [testing, concept]
source: official
priority:
---
# Questions
- E2E test란 무엇인가?
- E2E test의 장점과 단점은?
- E2E로 모든 edge case를 잡으면 가장 확실한 거 아닌가?

---

# Answers

## E2E test란 무엇인가?

### Official Answer
End to End: A helper robot that behaves like a user to click around the app and verify that it functions correctly.
Sometimes called "functional testing" or e2e.

Typically these will run the entire application (both frontend and backend) and your test will interact with the app just like a typical user would.
These tests are written with cypress.

> #### AI Annotation:
> Testing Trophy에서 가장 꼭대기에 위치한다.

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

> #### AI Annotation:
> 장점 — 테스트 1개당 주는 자신감이 가장 높다.
> 프론트+백엔드 전체를 실제 사용자처럼 테스트하므로 가장 높은 자신감을 준다.
>
> 단점 — 가장 비싸고(CI 비용 + 유지보수), 가장 느리고(전체 앱 실행), 실패 시 원인 추적이 가장 어렵다.
> 비프로덕션 환경에서 돌리므로 프로덕션 100% 보장은 아니다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## E2E로 모든 edge case를 잡으면 가장 확실한 거 아닌가?

### Official Answer
At the top of the testing trophy, if you try to use an E2E test to check that typing in a certain field and clicking the submit button for an edge case in the integration between the form and the URL generator, you're doing a lot of setup work by running the entire application (backend included).
That might be more suitable for an integration test.
If you try to use an integration test to hit an edge case for the coupon code calculator, you're likely doing a fair amount of work in your setup function to make sure you can render the components that use the coupon code calculator and you could cover that edge case better in a unit test.
If you try to use a unit test to verify what happens when you call your add function with a string instead of a number you could be much better served using a static type checking tool like TypeScript.

> #### AI Annotation:
> 아니오.
> 각 edge case를 가장 효율적으로 잡을 수 있는 레벨이 따로 있다.
> E2E로 모든 것을 잡으려 하면 셋업 비용이 과도하고, 테스트가 느려지고, 실패 원인 추적이 어려워진다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
