---
tags: [javascript, concept]
source: official
publishable: true
---

# Questions
- 실행 컨텍스트는 변수를 직접 담고 있는가?

---

# Answers

## 실행 컨텍스트는 변수를 직접 담고 있는가?

### Official Answer
> - LexicalEnvironment: Identifies the Environment Record used to resolve identifier references made by code within this execution context.
> - VariableEnvironment: Identifies the Environment Record that holds bindings created by VariableStatements within this execution context.
> - PrivateEnvironment: Identifies the PrivateEnvironment Record that holds Private Names created by ClassElements in the nearest containing class. null if there is no containing class.

> The LexicalEnvironment and VariableEnvironment components of an execution context are always Environment Records.

### Reference
- https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-execution-contexts
