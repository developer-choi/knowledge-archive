---
tags: [javascript, concept]
---

# Questions
- [What is the await operator?](#what-is-the-await-operator)
- [How does await affect the execution order?](#how-does-await-affect-the-execution-order)
- [Should I use return await?](#should-i-use-return-await)
- [Does .catch() handle synchronous errors in promised functions?](#does-catch-handle-synchronous-errors-in-promised-functions)

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

---

## How does await affect the execution order?

### Official Answer
When the awaited expression's value is resolved, another [microtask](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) that continues the paused code gets scheduled.
This happens even if the awaited value is an already-resolved promise or not a promise: execution doesn't return to the current function until all other already-scheduled microtasks are processed.

```javascript
async function foo(name) {
  console.log(name, "start");
  await console.log(name, "middle");
  console.log(name, "end");
}

foo("First");
foo("Second");

// First start
// First middle
// Second start
// Second middle
// First end
// Second end
```

### Reference
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

---

## Should I use return await?

### Official Answer
Contrary to some popular belief, `return await promise` is at least as fast as `return promise`, due to how the spec and engines optimize the resolution of native promises.
There's a proposal to [make return promise faster](https://github.com/tc39/proposal-faster-promise-adoption) and you can also read about [V8's optimization on async functions](https://v8.dev/blog/fast-async).
Therefore, except for stylistic reasons, `return await` is **almost always preferable.**

### Reference
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

---

## Does .catch() handle synchronous errors in promised functions?

### Official Answer
If `promisedFunction()` throws an error synchronously, the error won't be caught by the `catch()` handler.
In this case, the `try...catch` statement is necessary.

### Reference
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)