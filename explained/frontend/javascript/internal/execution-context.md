# [UNVERIFIED] Execution Context란 무엇인가?

## 도입

JS 코드가 실행될 때 엔진은 단순히 코드를 한 줄씩 읽는 것이 아니라, 실행에 필요한 환경을 먼저 만든다. 그 환경이 Execution Context다.

---

## 본문

Execution Context는 OA 없이 실무 원칙으로 정리한다.

Execution Context는 JS 코드가 실행되는 환경(environment)이다. 여기서 "환경"이란 변수, 함수 선언, `this` 바인딩, 스코프 정보 등 코드 실행에 필요한 모든 것을 담은 컨테이너다.

```
Execution Context 생성 시점:
- 전역 코드 실행 시     → Global Execution Context
- 함수 호출 시          → Function Execution Context
- eval() 실행 시        → Eval Execution Context (실무에서 거의 안 씀)
```

```js
function outer() {
  let x = 10;       // outer의 EC에 저장
  function inner() {
    let y = 20;     // inner의 EC에 저장
    console.log(x); // outer EC에서 x를 찾음 (Scope Chaining)
  }
  inner(); // inner EC 생성
}

outer(); // outer EC 생성
```

---

## 종합

Execution Context가 없다면 JS 엔진은 "지금 어떤 변수를 쓸 수 있는가", "this가 무엇인가", "어디서 변수를 찾아야 하는가"를 알 수 없다. EC는 이 모든 정보를 함수 호출 단위로 캡슐화한다. 클로저, 호이스팅, 스코프 체이닝 같은 JS의 핵심 동작이 모두 EC 개념 위에 구축되어 있다.

---

---

# [UNVERIFIED] Execution Context는 어떻게 쌓이고 관리되는가?

## 도입

여러 함수가 중첩 호출될 때 각각의 EC는 스택(Call Stack)에 쌓인다. 제일 위에 있는 EC가 현재 실행 중인 코드다.

---

## 본문

EC 스택 관리는 OA 없이 실무 원칙으로 정리한다.

```
함수 호출 흐름과 Call Stack:

function c() { console.log('c'); }
function b() { c(); }
function a() { b(); }
a();

Call Stack:
a() 호출     → [Global, a]
  b() 호출   → [Global, a, b]
    c() 호출 → [Global, a, b, c]
    c() 완료 → [Global, a, b]    c EC 제거
  b() 완료   → [Global, a]       b EC 제거
a() 완료     → [Global]          a EC 제거
```

- 함수가 호출되면 새 EC가 스택 맨 위에 쌓인다.
- 함수가 반환(return)하거나 실행이 끝나면 해당 EC가 스택에서 제거된다.
- 스택이 너무 깊어지면 `RangeError: Maximum call stack size exceeded`가 발생한다 (재귀 함수가 탈출 조건 없을 때 흔히 봄).

---

## 종합

Call Stack은 Chrome DevTools의 "Sources" 탭 > "Call Stack" 패널에서 직접 볼 수 있다. 중단점(breakpoint)을 걸면 현재 어느 함수까지 호출됐는지, 각 EC의 변수값이 어떤지를 실시간으로 확인할 수 있다. 재귀 함수를 디버깅할 때 Call Stack이 폭발적으로 쌓이는 것도 여기서 확인 가능하다.

---

---

# [UNVERIFIED] Global Execution Context는 일반 Execution Context와 무엇이 다른가?

## 도입

Global EC는 가장 먼저 생성되고 프로그램이 종료될 때까지 살아있는 EC다. 특별한 존재처럼 느껴지지만 구조는 일반 Function EC와 거의 같다.

---

## 본문

Global Execution Context는 OA 없이 실무 원칙으로 정리한다.

일반 Function EC와의 차이점:

```
                    Global EC         Function EC
arguments 객체         없음              있음
this 바인딩            window (브라우저)    호출 방식에 따라 다름
                       global (Node.js)
생성 시점              프로그램 시작        함수 호출 시
소멸 시점              프로그램 종료        함수 반환 시
```

Global EC도 Activation Object(Variable Object)를 만들고 그 안에 전역 변수와 함수 선언을 저장한다. `arguments`만 없을 뿐이다.

```js
// 전역 코드
var x = 10;   // Global EC의 Variable Object에 x 저장
function foo() {} // Global EC의 Variable Object에 foo 저장

// 브라우저에서
console.log(window.x);   // 10 — 전역 변수는 window 프로퍼티가 된다
console.log(window.foo); // ƒ foo(){}
```

---

## 종합

Global EC가 `arguments`를 갖지 않는 이유는 전역 코드는 어떤 함수가 호출한 것이 아니므로 인수(argument)를 받을 수 없기 때문이다. 브라우저에서 전역 `this`가 `window`인 것도 Global EC의 `this` 바인딩이 `window`로 설정되기 때문이다. `strict mode`에서는 전역 `this`가 `undefined`가 될 수 있다.

---

---

# [UNVERIFIED] Activation Object에는 무엇이 저장되는가?

## 도입

Execution Context가 만들어지면 가장 먼저 Activation Object(AO) 또는 Variable Object(VO)가 생성된다. 실행 전에 변수와 함수를 미리 수집하는 단계로, 호이스팅이 여기서 발생한다.

---

## 본문

Activation Object는 OA 없이 실무 원칙으로 정리한다.

EC 생성 시 AO에 순서대로 채워지는 것들:

```
1. parameters  → 함수 호출 시 넘긴 인자값으로 초기화
2. arguments   → 모든 인자를 담은 유사 배열 객체 생성
3. 함수 선언    → Function Object를 즉시 할당 (완전 초기화)
4. 지역 변수    → 선언만 하고 undefined로 초기화 (초기화는 나중에)
5. this 바인딩  → 호출 방식에 따라 결정, 없으면 window(전역)
```

```js
function foo(a, b) {
  console.log(a);    // 1 — parameter 즉시 초기화됨
  console.log(bar);  // ƒ bar(){} — 함수 선언은 완전 초기화됨 (호이스팅)
  console.log(x);    // undefined — 변수는 선언만 됨 (호이스팅, 초기화 X)

  var x = 5;
  function bar() {}
}

foo(1, 2);
```

이 동작이 "호이스팅"의 실체다 — AO를 먼저 만들면서 변수/함수 선언을 미리 처리하기 때문에, 코드 작성 위치보다 앞서 참조할 수 있다.

---

## 종합

지역 변수가 `undefined`로 먼저 채워지고, 함수 선언은 완전한 Function Object로 채워진다는 차이가 `var` 호이스팅과 함수 호이스팅의 동작 차이를 만든다. `let`/`const`는 AO에 등록되지만 초기화가 선언 라인에 도달할 때까지 지연되어 "Temporal Dead Zone(TDZ)"이 생긴다.

---

---

# [UNVERIFIED] Scope Chain이란 무엇이며 변수 탐색은 어떻게 이뤄지는가?

## 도입

함수 안에서 변수를 참조할 때 JS 엔진은 현재 EC에서 찾고, 없으면 상위 EC로 올라가는 과정을 반복한다. 이 탐색 경로가 Scope Chain이다.

---

## 본문

Scope Chain은 OA 없이 실무 원칙으로 정리한다.

```
변수 탐색 순서:
현재 EC의 AO → 상위 EC의 AO → ... → Global EC의 AO → window → 없으면 ReferenceError
```

```js
var globalVar = 'global';

function outer() {
  var outerVar = 'outer';

  function inner() {
    var innerVar = 'inner';
    console.log(innerVar);  // inner EC에서 찾음
    console.log(outerVar);  // inner EC에 없음 → outer EC에서 찾음
    console.log(globalVar); // inner/outer EC에 없음 → Global EC에서 찾음
    console.log(notExist);  // 어디에도 없음 → ReferenceError
  }

  inner();
}

outer();
```

---

## 종합

Scope Chain의 탐색 방향은 항상 "안에서 밖으로"이며, 역방향(밖에서 안으로)은 없다. 이것이 외부 함수가 내부 함수의 변수에 접근할 수 없는 이유다. Scope Chain은 함수가 "어디서 호출됐는가"가 아니라 "어디서 정의됐는가(렉시컬 위치)"로 결정된다 — 이것이 렉시컬 스코프(Lexical Scope)다.

---

---

# [UNVERIFIED] `is not defined` 에러는 정확히 무엇을 의미하는가?

## 도입

`ReferenceError: x is not defined`는 "변수를 선언하지 않았다"는 단순한 에러 같지만, 정확히는 Scope Chain 전체를 탐색해도 찾지 못했다는 의미다.

---

## 본문

`is not defined` 에러는 OA 없이 실무 원칙으로 정리한다.

```js
console.log(x); // ReferenceError: x is not defined
// = x를 현재 EC → 상위 EC → Global EC → window까지 탐색했으나 없음
```

`undefined`와 혼동하지 말 것:
- `undefined`: 변수는 선언됐으나 값이 아직 할당되지 않은 상태 (AO에 등록됨).
- `not defined`: 어떤 EC의 AO에도 없는 식별자. Scope Chain에 존재 자체가 없음.

```js
var x;
console.log(x);      // undefined — 선언됨, 값 없음
console.log(typeof y); // "undefined" — typeof는 not defined도 에러 없이 처리
console.log(y);      // ReferenceError — Scope Chain에 y 없음
```

---

## 종합

`ReferenceError`는 변수 탐색 실패의 최종 결과다. `typeof` 연산자가 선언되지 않은 변수에도 `"undefined"`를 반환하는 이유는 Scope Chain 탐색 전에 특별 처리를 하기 때문이다 — 이 특성을 이용해 전역 변수 존재 여부를 안전하게 확인할 수 있다(`typeof window !== 'undefined'`).

---

---

# [UNVERIFIED] Activation Object 생성 시 지역 변수와 함수 선언은 어떻게 다르게 처리되는가?

## 도입

AO 생성 단계에서 변수와 함수 선언의 처리 방식이 다르다. 이 차이가 `var` 호이스팅과 함수 호이스팅의 서로 다른 동작을 만든다.

---

## 본문

AO 생성 시 처리 방식 차이는 OA 없이 실무 원칙으로 정리한다.

```js
function test() {
  console.log(foo); // ƒ foo(){} — 함수는 완전히 초기화됨
  console.log(bar); // undefined — 변수는 선언만, 값은 나중에

  var bar = 10;
  function foo() {}
}

test();
```

AO 생성 단계에서:
- `function foo(){}` → AO에 `foo: ƒ foo(){}` 즉시 등록 (Function Object 완전 생성)
- `var bar = 10` → AO에 `bar: undefined`만 등록 (초기화는 실행 단계에서)

```
AO 생성 후 상태:
{
  foo: ƒ foo(){},   // 완전 초기화
  bar: undefined,   // 선언만
  arguments: {}
}

실행 단계에서:
bar = 10 라인을 만나면 그때 bar: 10 으로 업데이트
```

---

## 종합

함수 선언이 완전히 초기화되기 때문에 함수 선언보다 앞서 호출해도 정상 동작한다. 반면 `var` 변수는 AO 생성 시점에 `undefined`로만 채워지므로 선언보다 앞서 읽으면 `undefined`가 나온다. `let`/`const`는 AO에 등록되지만 초기화가 해당 라인에 도달할 때 일어나므로 그 전에 접근하면 TDZ(Temporal Dead Zone) 에러가 발생한다.

---

---

# [UNVERIFIED] scope 프로퍼티는 사용자가 접근할 수 있는가?

## 도입

Activation Object와 Scope Chain은 JS 엔진 내부에서만 참조하는 내부 구조다. 사용자 코드에서 직접 접근하는 방법은 없다.

---

## 본문

scope 프로퍼티 접근 여부는 OA 없이 실무 원칙으로 정리한다.

`[[Scope]]`는 ECMAScript 사양에서 이중 대괄호(`[[...]]`)로 표기되는 내부 슬롯(internal slot)이다. 이런 내부 슬롯은 JS 코드로 직접 읽거나 쓸 수 없다.

```js
function foo() {}
console.log(foo.scope);        // undefined — 없음
console.log(foo['[[Scope]]']); // undefined — 없음
```

Chrome DevTools에서는 함수 객체를 콘솔에 찍으면 `[[Scopes]]` 항목을 볼 수 있는데, 이것은 DevTools가 엔진 내부 정보를 디버깅 목적으로 노출해주는 것이지 JS 코드로 접근 가능한 프로퍼티가 아니다.

---

## 종합

내부 슬롯(`[[Scope]]`, `[[Prototype]]` 등)은 엔진이 스펙에 따라 유지하는 메타데이터다. `[[Prototype]]`은 `Object.getPrototypeOf()`로 간접 접근이 가능하지만, `[[Scope]]`는 그런 공개 API가 없다. 디버깅은 DevTools의 Scope 패널을 통해 가능하다.

---

---

# [UNVERIFIED] Scope Chain은 어떤 자료구조에 가까운가?

## 도입

Scope Chain이 어떻게 구현되는지를 자료구조로 이해하면, 변수 탐색이 왜 특정 방향으로만 일어나는지가 명확해진다.

---

## 본문

Scope Chain 자료구조는 OA 없이 실무 원칙으로 정리한다.

Scope Chain은 각 EC의 AO를 한 방향으로 연결한 Linked List에 가깝다.

```
inner EC의 AO
  └── (scope link) → outer EC의 AO
                       └── (scope link) → Global EC의 AO
                                            └── null (끝)
```

각 EC는 자신의 AO와 함께, 렉시컬 상위 EC를 가리키는 포인터(`[[Scope]]`)를 갖는다. 변수 탐색은 이 포인터를 따라 순서대로 올라가며 탐색한다.

Linked List처럼:
- 탐색은 한 방향(아래 → 위)으로만 된다.
- 역방향(위 → 아래) 접근은 없다.
- `null`에 도달하면(Global의 상위가 없음) 탐색 실패 → `ReferenceError`.

---

## 종합

Scope Chain이 Linked List 구조인 덕분에 중첩 함수에서 외부 변수를 참조할 때 추가적인 전역 탐색 없이 포인터를 따라가는 것만으로 O(depth) 탐색이 가능하다. 클로저가 외부 변수를 "기억"할 수 있는 것도 이 구조 때문이다 — 내부 함수의 `[[Scope]]` 포인터가 외부 함수의 AO를 가리킨 채 유지되므로, 외부 함수가 종료된 후에도 그 AO가 GC되지 않는다.

---

---

# [UNVERIFIED] Scope Chaining 덕분에 가능한 동작에는 어떤 것이 있는가?

## 도입

Scope Chaining은 단순히 "변수를 찾는 메커니즘"에 그치지 않는다. 클로저, 내부 함수의 외부 변수 참조 등 JS의 강력한 기능들이 Scope Chaining 위에 성립한다.

---

## 본문

Scope Chaining으로 가능한 동작들은 OA 없이 실무 원칙으로 정리한다.

**1. 내부 함수에서 외부 함수의 변수 읽기:**
```js
function outer() {
  const count = 0;
  function inner() {
    console.log(count); // outer EC → count 찾음 (Scope Chaining 덕분)
  }
  inner();
}
```

**2. 클로저(Closure):**
```js
function makeCounter() {
  let count = 0; // makeCounter EC의 AO에 저장
  return function() {
    count++;     // 반환된 함수의 [[Scope]]가 makeCounter AO를 계속 참조
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
// makeCounter는 이미 반환됐지만 count는 GC되지 않음
// → 반환된 함수의 [[Scope]] 포인터가 makeCounter AO를 붙들고 있기 때문
```

**3. 클로저의 성능 비용:**
Scope Chain이 깊어질수록 변수 탐색이 더 많은 단계를 거친다. 클로저가 외부 변수를 참조하면 해당 AO가 GC되지 않아 메모리에 계속 남는다.

---

## 종합

Scope Chaining은 JS의 렉시컬 스코프를 구현하는 기반이다. 덕분에 클로저 패턴, 팩토리 함수, 모듈 패턴(IIFE 기반) 같은 JS 고유의 패턴이 가능하다. 반면 불필요하게 깊은 클로저 참조는 메모리 누수로 이어질 수 있다 — 이벤트 리스너가 클로저를 통해 큰 객체를 참조하고 있는데 리스너를 제거하지 않으면, 그 객체가 GC되지 않는 대표적인 사례다.
