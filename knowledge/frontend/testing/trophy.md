---
tags: [software-engineering, comparison]
source: official
priority:
---
# Questions
- Testing Pyramid 대신 Testing Trophy를 쓰는 이유는?
- 100% 코드 커버리지가 적절한 경우는 언제인가?
- 코드 커버리지 리포트에서 테스트가 없는 라인을 발견했을 때, 어떤 질문을 던져야 하는가?

---

# Answers

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

> #### AI Annotation:
> Pyramid는 비용·속도만 고려해서 unit을 가장 많이 쓰라 했지만, 자신감(confidence)이라는 세 번째 축을 무시했다.
> Trophy는 비용·속도·자신감 세 축의 균형을 고려하여 Integration에 가장 큰 비중을 둔다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## 100% 코드 커버리지가 적절한 경우는 언제인가?

### Official Answer
Almost all of my open source projects have 100% code coverage.
This is because most of my open source projects are smaller libraries and tools that are reusable in many different situations (a breakage could lead to a serious problem in a lot of consuming projects) and they're relatively easy to get 100% code coverage on anyway.

> #### AI Annotation:
> 100% 커버리지가 합리적인 조건 2가지: (1) 깨지면 다수 소비 프로젝트에 심각한 영향 (높은 파급력), (2) 작은 라이브러리라 100% 달성이 쉬움 (낮은 비용).
> 애플리케이션 코드에서 이 두 조건을 동시에 만족하기는 어렵다.

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

Sometimes, our code coverage report indicates 100% code coverage, but not 100% use case coverage.
Code coverage is not a perfect metric, but it can be a useful tool in identifying what parts of our codebase are missing "use case coverage".

> #### AI Annotation:
> Code Coverage는 "어떤 라인이 실행되었는가"만 보여주고, "이 라인이 왜 중요한가"는 알려주지 않는다.
> 커버리지 리포트는 유스케이스 발견의 보조 도구로만 쓰고, 진짜 판단 기준은 Use Case Coverage다.

### Reference
- https://kentcdodds.com/blog/how-to-know-what-to-test
