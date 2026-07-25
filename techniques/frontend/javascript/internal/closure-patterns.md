---
tags: [javascript, principle]
source: official
publishable: true
---
# Questions
- 여러 함수가 같은 변수를 함께 보고 고칠 수 있는 것은 어떤 원리 때문인가?
- 같은 코드에서 만들어진 두 카운터가 서로 영향을 주지 않는 원리는 무엇인가?
- 반복문 안에서 만든 세 콜백이 모두 같은 값을 보게 되는 이유는 무엇인가?

---

# Answers

## 여러 함수가 같은 변수를 함께 보고 고칠 수 있는 것은 어떤 원리 때문인가?

```js
const counter = (function () {
  let privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }

  return {
    increment() {
      changeBy(1);
    },

    decrement() {
      changeBy(-1);
    },

    value() {
      return privateCounter;
    },
  };
})();

console.log(counter.value()); // 0.

counter.increment();
counter.increment();
console.log(counter.value()); // 2.

counter.decrement();
console.log(counter.value()); // 1.
```

### Official Answer
> In previous examples, each closure had its own lexical environment. Here though, there is a single lexical environment that is shared by the three functions: counter.increment, counter.decrement, and counter.value.

> The shared lexical environment is created in the body of an anonymous function, which is executed as soon as it has been defined (also known as an IIFE). The lexical environment contains two private items: a variable called privateCounter, and a function called changeBy. You can't access either of these private members from outside the anonymous function.

### User Answer

클로저는 함수가 만들어지는 시점에 그 자리에 살아 있던 환경과 짝이 된다(`closures are created every time a function is created, at function creation time`). 여기서 세 메서드는 IIFE 한 번의 실행이 만든 같은 자리에서 함께 생성됐으므로 짝이 되는 환경도 같은 하나다. 같은 변수를 함께 보고 고칠 수 있는 것은 그래서다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#emulating_private_methods_with_closures

---

## 같은 코드에서 만들어진 두 카운터가 서로 영향을 주지 않는 원리는 무엇인가?

```js
function makeCounter() {
  let privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment() {
      changeBy(1);
    },

    decrement() {
      changeBy(-1);
    },

    value() {
      return privateCounter;
    },
  };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log(counter1.value()); // 0.

counter1.increment();
counter1.increment();
console.log(counter1.value()); // 2.

counter1.decrement();
console.log(counter1.value()); // 1.
console.log(counter2.value()); // 0.
```

### Official Answer
> Notice how the two counters maintain their independence from one another. Each closure references a different version of the privateCounter variable through its own closure. Each time one of the counters is called, its lexical environment changes by changing the value of this variable.

### User Answer

클로저가 몇 개 생기는지를 정하는 것은 호출 횟수가 아니라 함수가 **생성**되는 횟수다(`closures are created every time a function is created, at function creation time`). `makeCounter()`를 두 번 부르면 그 몸통이 두 번 평가되어 환경도 함수 객체도 두 벌 만들어진다. 같은 코드에서 나왔어도 짝이 되는 환경이 서로 다른 것이라 간섭하지 않는다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#emulating_private_methods_with_closures

---

## 반복문 안에서 만든 세 콜백이 모두 같은 값을 보게 되는 이유는 무엇인가?

```js
function showHelp(help) {
  document.getElementById("help").textContent = help;
}

function setupHelp() {
  var helpText = [
    { id: "email", help: "Your email address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" },
  ];

  for (var i = 0; i < helpText.length; i++) {
    // Culprit is the use of `var` on this line
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function () {
      showHelp(item.help);
    };
  }
}

setupHelp();
```

### Official Answer
> No matter what field you focus on, the message about your age will be displayed.

> The reason for this is that the functions assigned to onfocus form closures; they consist of the function definition and the captured environment from the setupHelp function's scope. Three closures have been created by the loop, but each one shares the same single lexical environment, which has a variable with changing values (item). This is because the variable item is declared with var and thus has function scope due to hoisting. The value of item.help is determined when the onfocus callbacks are executed. Because the loop has already run its course by that time, the item variable object (shared by all three closures) has been left pointing to the last entry in the helpText list.

### User Answer

콜백은 반복마다 새로 생성되므로 클로저도 세 개 만들어진다(`closures are created every time a function is created, at function creation time`). 문제는 세 번의 생성 시점에 살아 있던 환경이 모두 같은 하나라는 점이다 — `item`을 `var`로 선언해 블록이 아니라 함수가 경계이기 때문이다. 클로저가 몇 개 생기느냐와 그 짝이 되는 환경이 몇 개냐가 별개라는 것이 여기서 드러난다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#creating_closures_in_loops_a_common_mistake
