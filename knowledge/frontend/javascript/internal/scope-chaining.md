---
tags: [javascript, concept]
---
# Questions
- Q1. global environment에서도 변수를 찾지 못하면, scope chain은 어디까지 올라가는가?
- Q2. 함수 A 내부에서 함수 B를 호출하면, B는 A의 지역 변수에 접근할 수 있는가?
---
# Answers
## Q1. global environment에서도 변수를 찾지 못하면, scope chain은 어디까지 올라가는가?
### User Answer
아래 코드의 실행 결과는 99다.

```js
window.outerVar = 99;
// var outerVar = 22;

(function outer() {
   // var outerVar = 3;
   inner();

   function inner() {
       // var outerVar = 20;
       console.log("in inner = " + outerVar);
   }
}());
```

global environment보다 상위에 window environment 같은 게 있는 것으로 보인다.
global에도 변수가 없으면 window 객체 내부에서 찾는다.

### Reference
- https://beomy.tistory.com/7

---

## Q2. 함수 A 내부에서 함수 B를 호출하면, B는 A의 지역 변수에 접근할 수 있는가?
### User Answer
아니다.
scope chaining은 호출 관계가 아니라 nested upper function(렉시컬 상위 함수)의 자유변수만 접근이 가능하다.

```js
var funObj1;
var funObj2;

function outer1() {
    var o1Var = 1;

    funObj1 = function inner1() {
        // you can access o1Var
        console.log(o1Var);

        funObj2();
    }
}

function outer2() {
    var o2Var = 2;

    funObj2 = function inner2() {
        // you can access o2Var
        console.log(o2Var);
    }
}
```

inner1에서 inner2를 억지로 호출해도, inner2는 inner1의 자유변수가 아니라 자신의 렉시컬 상위인 outer2의 자유변수(o2Var)에만 접근한다.
