---
tags: [javascript, concept]
source: official
priority: 1
publishable: true
---
# Questions
- 렉시컬 스코프란 무엇인가?

---

# Answers

## 렉시컬 스코프란 무엇인가?

```js
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() {
    // displayName() is the inner function, that forms a closure
    console.log(name); // use variable declared in the parent function
  }
  displayName();
}
init();
```

### Official Answer
> which describes how a parser resolves variable names when functions are nested. Nested functions have access to variables declared in their outer scope.

> The word lexical refers to the fact that lexical scoping uses the location where a variable is declared within the source code

> with dynamic scope, a name is resolved by searching the local execution context, then if that fails, by searching the outer execution context, and so on, progressing up the call stack.

> Dynamic scope is uncommon in modern languages. Examples of languages that use dynamic scope include Logo, Emacs Lisp, LaTeX and the shell languages bash, dash, and PowerShell.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#lexical_scoping
- https://en.wikipedia.org/wiki/Scope_(computer_science)
