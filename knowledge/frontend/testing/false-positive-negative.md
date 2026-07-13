---
tags: [testing, concept]
source: official
priority:
---
# Questions
- 테스트에서 false positive와 false negative는 각각 무엇을 의미하는가?

---

# Answers

## 테스트에서 false positive와 false negative는 각각 무엇을 의미하는가?

### Official Answer
The test is: "does the software work". If the test passes, then that means the test came back "positive" (found working software). If it does not, that means the test comes back "negative" (did not find working software). The term "False" refers to when the test came back with an incorrect result, meaning the software is actually broken but the test passes (false positive) or the software is actually working but the test fails (false negative).

### Reference
- https://kentcdodds.com/blog/testing-implementation-details
