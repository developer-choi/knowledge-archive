---
tags: [javascript, concept]
source: official
priority: 1
publishable: true
---
# Questions
- 클로저란 무엇인가?
- 바깥 함수가 이미 끝났는데도 그 지역 변수를 읽을 수 있는 이유는 무엇인가?

---

# Answers

## 클로저란 무엇인가?

### Official Answer
> Whenever a function is created, it also memorizes internally the variable bindings of the current running execution context. Then, these variable bindings can outlive the execution context.

> A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In JavaScript, closures are created every time a function is created, at function creation time.

> A closure is the combination of a function and the lexical environment within which that function was declared. This environment consists of any variables that were in-scope at the time the closure was created.

```js
let f;
{
  let x = 10;
  f = () => x;
}
console.log(f()); // logs 10
```

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#closures
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures

---

## 바깥 함수가 이미 끝났는데도 그 지역 변수를 읽을 수 있는 이유는 무엇인가?

```js
function makeFunc() {
  const name = "Mozilla";
  function displayName() {
    console.log(name);
  }
  return displayName;
}

const myFunc = makeFunc();
myFunc();
```

### Official Answer
> The reason is that functions in JavaScript form closures. The instance of displayName maintains a reference to its lexical environment, within which the variable name exists.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#closure

