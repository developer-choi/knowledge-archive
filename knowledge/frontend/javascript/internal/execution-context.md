---
tags: [javascript, concept]
source: official
priority: 1
publishable: true
---
# Questions
- 실행 컨텍스트란 무엇이고, 어떤 목적을 위해 존재하는가?
  - 실행 컨텍스트가 추적하는 바인딩에는 어떤 것들이 있는가?

---

# Answers

## 실행 컨텍스트란 무엇이고, 어떤 목적을 위해 존재하는가?

### Official Answer
> Each function needs to keep track of its own variable environments and where to return to. To handle this, the agent needs a stack to keep track of the execution contexts. An execution context, also known generally as a stack frame, is the smallest unit of execution.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#stack_and_execution_contexts

---

## 실행 컨텍스트가 추적하는 바인딩에는 어떤 것들이 있는가?

### Official Answer
> It tracks the following information:
>
> - Bindings, including:
>   - Variables defined with `var`, `let`, `const`, `function`, `class`, etc.
>   - Private identifiers like `#foo` which are only valid in the current context
>   - `this` reference

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#stack_and_execution_contexts

