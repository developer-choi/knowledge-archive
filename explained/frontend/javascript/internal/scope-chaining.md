# [UNVERIFIED] Q1. global environment에서도 변수를 찾지 못하면, scope chain은 어디까지 올라가는가?

## 도입

Scope Chain의 최상위는 Global Execution Context의 AO다. 그런데 브라우저 환경에서는 그것도 아닌 더 위 — `window` 객체가 존재한다. `var`로 선언한 전역 변수는 `window`의 프로퍼티가 되기 때문에, Scope Chain이 Global EC AO까지 올라간 후 `window` 객체 탐색까지 이어진다.

---

## 본문

Global 위의 window 환경은 OA 없이 실무 원칙으로 정리한다.

```js
window.outerVar = 99;
// var outerVar = 22; // 주석 처리

(function outer() {
  // var outerVar = 3; // 주석 처리
  inner();

  function inner() {
    // var outerVar = 20; // 주석 처리
    console.log("in inner = " + outerVar); // 99 출력
  }
}());
```

탐색 경로:
```
inner EC의 AO         → outerVar 없음
outer EC의 AO         → outerVar 없음
Global EC의 AO        → outerVar 없음 (var 선언 없음)
window 객체            → window.outerVar = 99 → 발견 → 99 반환
```

브라우저에서 `var`로 전역 선언하면 자동으로 `window`의 프로퍼티가 된다:

```js
var x = 10;
console.log(window.x); // 10

window.y = 20;
console.log(y); // 20 — window 프로퍼티도 전역 변수처럼 접근 가능
```

---

## 종합

브라우저에서 Scope Chain의 실질적인 끝은 `window` 객체다. Global EC AO와 `window`는 `var` 전역 변수의 경우 사실상 같은 공간을 공유한다. `let`/`const`로 선언한 전역 변수는 `window` 프로퍼티가 되지 않아서 `window.x`로 접근할 수 없다 — ES6에서 전역 스코프 오염을 막기 위해 의도적으로 분리됐다. Node.js에서는 `window` 대신 `global`이 최상위 객체다.

---

---

# [UNVERIFIED] Q2. 함수 A 내부에서 함수 B를 호출하면, B는 A의 지역 변수에 접근할 수 있는가?

## 도입

"A가 B를 호출했으니 B는 A의 변수를 볼 수 있을 것"이라는 직관이 있지만, JS 스코프는 호출 관계가 아니라 코드 작성 위치(렉시컬 위치)로 결정된다.

---

## 본문

렉시컬 스코프와 호출 관계의 차이는 OA 없이 실무 원칙으로 정리한다.

```js
var funObj1;
var funObj2;

function outer1() {
  var o1Var = 1;

  funObj1 = function inner1() {
    console.log(o1Var); // outer1의 자유변수 — 렉시컬 상위가 outer1이므로 접근 가능

    funObj2(); // inner2를 호출하지만...
  };
}

function outer2() {
  var o2Var = 2;

  funObj2 = function inner2() {
    console.log(o2Var); // outer2의 자유변수 — 렉시컬 상위가 outer2이므로 접근 가능
    // o1Var는 접근 불가 — inner2의 [[Scope]]는 outer2 → Global
    // inner1이 호출했다고 inner1의 스코프가 inner2에게 열리지 않는다
  };
}

outer1();
outer2();
funObj1(); // inner1 실행 → inner2 호출 → inner2는 o1Var에 접근 불가
```

Scope Chain은 **함수가 정의된 위치**로 결정된다:
```
inner1의 Scope Chain: inner1 AO → outer1 AO → Global AO → window
inner2의 Scope Chain: inner2 AO → outer2 AO → Global AO → window

inner1이 inner2를 호출해도 inner2의 Scope Chain은 바뀌지 않는다.
```

---

## 종합

이 원칙을 "렉시컬 스코프(Lexical Scope)" 또는 "정적 스코프(Static Scope)"라고 한다. 함수의 스코프는 런타임(호출 시점)이 아니라 컴파일 타임(코드 작성 시점)에 결정된다. 이 덕분에 코드를 읽는 것만으로 어떤 변수에 접근 가능한지 예측할 수 있다. 반대 개념인 "동적 스코프(Dynamic Scope)"를 쓰는 언어에서는 호출 스택에 따라 스코프가 결정되어 코드 추적이 훨씬 어려워진다.
