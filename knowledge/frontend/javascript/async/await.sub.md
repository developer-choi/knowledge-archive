---
tags: [javascript, concept]
source: official
---

# Questions
- return await를 사용해야 하는가?

---

# Answers

## return await를 사용해야 하는가?

### Official Answer
Contrary to some popular belief, `return await promise` is at least as fast as `return promise`, due to how the spec and engines optimize the resolution of native promises.
There's a proposal to [make return promise faster](https://github.com/tc39/proposal-faster-promise-adoption) and you can also read about [V8's optimization on async functions](https://v8.dev/blog/fast-async).
Therefore, except for stylistic reasons, `return await` is **almost always preferable.**

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
