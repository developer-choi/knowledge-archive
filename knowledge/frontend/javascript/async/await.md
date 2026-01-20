---
tags: [javascript, concept]
---

# Questions
- [What is the await operator?](#what-is-the-await-operator)

# Answers

## What is the await operator?

### Official Answer
The **await** operator is used to wait for a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and get its fulfillment value.

The fulfillment value of the promise or thenable object, or, if the expression is not thenable, the expression's own value.

If the promise is rejected, the await expression throws the rejected value.
The function containing the await expression will [appear in the stack trace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#improving_stack_trace) of the error.
Otherwise, if the rejected promise is not awaited or is immediately returned, the caller function will not appear in the stack trace.

### Reference
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
