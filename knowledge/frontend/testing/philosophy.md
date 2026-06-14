---
tags: [testing, concept]
source: official
priority:
---
# Questions
- implementation details를 테스트하면 왜 all downside, no upside인가?
- Unit test 하나에 assert를 여러 개 두면 어떤 문제가 생기는가?

---

# Answers

## implementation details를 테스트하면 왜 all downside, no upside인가?

### Official Answer
But what are you getting confidence in when you test things this way?
The testing user doesn't pay the bills like the end user.
It doesn't affect the rest of the system like the developer user.

Writing tests that include implementation details is all downside and no upside.

You should very rarely have to change tests when you refactor code.

### Reference
- https://kentcdodds.com/blog/avoid-the-test-user
- https://kentcdodds.com/blog/write-tests

---

## Unit test 하나에 assert를 여러 개 두면 어떤 문제가 생기는가?

### Official Answer
For each unit test, there should only be one true or false outcome.
Make sure that there is only one assert statement within your test.
A failed assert statement in a block of multiple ones can cause confusion on which one produced the issue.

### Reference
- https://aws.amazon.com/what-is/unit-testing/
