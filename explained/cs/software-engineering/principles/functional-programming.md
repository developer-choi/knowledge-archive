# 함수형 프로그래밍이란 무엇이며, 명령형과 어떻게 다른가?

## 도입

함수형 프로그래밍(FP)은 프로그램을 함수의 적용(applying)과 합성(composing)으로 구성하는 프로그래밍 패러다임이다. 명령형이 "무엇을 어떻게 할지"를 단계로 나열하는 것과 달리, FP는 "무엇을 계산할지"를 함수 표현식으로 기술한다. JS는 두 패러다임을 모두 지원하는 multi-paradigm 언어라 실무에서 둘이 자연스럽게 섞인다.

---

## 본문

> In computer science, functional programming is a programming paradigm where programs are constructed by applying and composing functions.

"컴퓨터 과학에서 함수형 프로그래밍은 함수의 적용과 합성으로 프로그램을 구성하는 프로그래밍 패러다임이다."

- **paradigm**: 프로그래밍의 사고 틀. 객체지향, 함수형, 절차적 등이 각각 다른 패러다임이다.
- **applying**: 함수에 인자를 넣어 값을 얻는 행위. `double(5)` → `10`.
- **composing**: 함수를 이어 붙여 새 함수를 만드는 것. `normalize = compose(lower, trim)`.

> It is a declarative programming paradigm in which function definitions are trees of expressions that map values to other values, rather than a sequence of imperative statements which update the running state of the program.

"FP는 선언형 패러다임이다. 함수 정의가 값을 다른 값으로 매핑하는 표현식 트리로 이루어지며, 프로그램의 실행 상태를 업데이트하는 명령문의 나열이 아니다."

- **trees of expressions**: 표현식이 값으로 평가되는 트리 구조. `f(g(h(x)))`처럼 함수가 중첩되어 트리를 이룬다.
- **map values to other values**: 수학 함수처럼 입력값 → 출력값의 순수한 매핑. 외부 상태를 건드리지 않는다.
- **running state**: 프로그램이 실행 중 들고 있는 변수·메모리 상태. 명령형은 이 상태를 직접 변경하는 구문들의 나열이다.

```js
// 명령형 — 상태를 직접 업데이트
let total = 0;
for (let i = 0; i < prices.length; i++) {
  total += prices[i] * 1.1;  // running state(total)를 직접 변경
}

// 함수형 — 값을 다른 값으로 매핑
const total = prices
  .map(price => price * 1.1)   // 표현식 합성
  .reduce((sum, p) => sum + p, 0);
```

FP와 OOP는 양자택일이 아니다. JS는 두 패러다임을 모두 지원하며, React 컴포넌트(클래스/함수), Redux reducer, Array methods(`map`, `filter`, `reduce`) 모두 FP 개념을 담고 있다.

---

## 종합

명령형 코드가 없으면 어떻게 되는가? — 파일 IO, 네트워크 호출, DOM 조작은 본질적으로 "외부 상태를 바꾸는" 명령형 행위이므로, FP만으로 프로그램을 완성할 수 없다. 실무 전략은 "순수 함수로 비즈니스 로직을 계산하고, 부수효과는 경계 레이어에서 한 곳에 모아 처리한다"는 것이다. Redux reducer가 순수 함수이고 실제 API 호출은 미들웨어(thunk/saga)가 담당하는 구조가 이 전략의 실천이다.

---

# FP에서 "함수의 합성(composing)"은 구체적으로 무엇을 말하는가?

## 도입

함수의 합성은 작은 함수들을 이어 붙여 더 복잡한 함수를 만드는 메커니즘이다. 수학의 합성 함수 `(g ∘ f)(x) = g(f(x))`를 코드로 옮긴 것이다. 한 함수의 출력이 다음 함수의 입력으로 흘러가는 파이프라인이다.

---

## 본문

> Function composition is an act or mechanism to combine simple functions to build more complex ones.

"함수 합성은 단순한 함수들을 결합하여 더 복잡한 함수를 만들기 위한 행위 또는 메커니즘이다."

- **act or mechanism**: "행위"이기도 하고 "메커니즘"이기도 하다. 수동으로 `g(f(x))`라고 쓰는 행위일 수도 있고, `compose` 같은 고차 함수로 자동화된 메커니즘일 수도 있다.
- **simple functions**: 각자 하나의 작은 변환만 하는 함수. `trim`, `toLowerCase`, `parseJSON` 등.
- **more complex ones**: 여러 단순 함수를 조합해 만들어진 복잡한 변환 함수. `normalize = compose(lower, trim)`.

> In functional programming languages, function composition can be naturally expressed as a higher-order function or operator.

"함수형 프로그래밍 언어에서 함수 합성은 고차 함수 또는 연산자로 자연스럽게 표현될 수 있다."

- **higher-order function**: 다른 함수를 인자로 받거나 결과로 반환하는 함수. JS의 `compose`, `pipe`가 이에 해당한다.
- **operator**: 언어 차원의 합성 기호. Haskell의 `.`, F#의 `>>`처럼 언어 레벨에서 합성을 지원하는 연산자.

```js
// 수동 합성 — g(f(x))
const normalize = (s) => s.toLowerCase().trim();

// 고차 함수로 합성 메커니즘 만들기
const compose = (g, f) => (x) => g(f(x));
const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const normalize = compose(lower, trim);
normalize('  HELLO  '); // 'hello'

// 실무: Redux 미들웨어 합성, RxJS pipe
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const processInput = pipe(trim, lower, removeSpecialChars);
```

---

## 종합

함수 합성이 없으면 어떻게 되는가? — 단계마다 임시 변수를 만들어야 한다. `const trimmed = trim(s); const lowered = lower(trimmed); const result = removeSpecialChars(lowered);`처럼 중간 상태가 쌓인다. 합성은 이 중간 상태를 없애고 변환 파이프라인을 하나의 표현식으로 만든다. 실무에서 lodash `_.flow`, RxJS `pipe`, Redux 미들웨어 합성, React HOC 합성이 모두 이 패턴이다. "applying and composing functions"에서 composing이 applying과 동등한 무게를 갖는 이유가 여기 있다 — 합성이 없으면 함수들이 독립된 조각으로만 남고, 조합해서 더 큰 기능을 만드는 FP의 핵심 이점이 사라진다.

---

# 순수 함수(pure function)는 어떤 두 조건을 만족해야 하는가?

## 도입

"함수에 인풋을 넣으면 아웃풋이 나온다"는 직관은 사실 일반 함수가 아니라 순수 함수의 정의에 가깝다. 일반 함수는 파일 IO, 네트워크 호출, 전역 상태 변경 같은 부수효과를 가질 수 있다. 순수 함수는 두 조건을 모두 만족하는 특별한 함수다.

---

## 본문

> When a pure function is called with some given arguments, it will always return the same result, and cannot be affected by any mutable state or other side effects.

"순수 함수는 주어진 인자로 호출되면 항상 같은 결과를 반환하며, 어떤 가변 상태나 다른 부수효과에도 영향을 받지 않는다."

- **always return the same result**: 결정성(determinism). 같은 입력 → 항상 같은 출력. `Math.random()`이나 `Date.now()`에 의존하면 결정성이 깨진다.
- **mutable state**: 변경 가능한 외부 상태. 전역 변수, 모듈 레벨 변수, 외부 객체. 이것을 읽으면 호출 시점마다 결과가 달라질 수 있다.

> Pure functions (or expressions) have no side effects (memory or I/O).

"순수 함수(또는 표현식)는 부수효과가 없다(메모리 또는 I/O)."

- **side effects**: 외부에 미치는 영향. DOM 조작, `console.log`, 네트워크 요청, 파일 IO, 전역 변수 변경 등.

두 조건 정리:
1. 같은 인자 → 항상 같은 결과 (결정성, referential transparency)
2. 가변 상태나 부수효과를 유발하지도, 영향받지도 않는다

```js
// 순수 함수 — 두 조건 모두 만족
const add = (a, b) => a + b;
add(2, 3); // 항상 5, 외부에 영향 없음

// 순수하지 않은 함수 — 조건 1 위반 (외부 상태에 영향받음)
let tax = 0.1;
const priceWithTax = (price) => price * (1 + tax); // tax가 바뀌면 결과 달라짐

// 순수하지 않은 함수 — 조건 2 위반 (부수효과 있음)
const logAndDouble = (x) => {
  console.log(x);  // I/O 부수효과
  return x * 2;
};
```

---

## 종합

순수 함수가 왜 중요한가? — 두 조건이 메모이제이션, 병렬 실행, 단위 테스트의 토대가 되기 때문이다. 같은 입력에 같은 출력이 보장되니 결과를 캐시할 수 있고(메모이제이션), 외부 상태 의존이 없으니 여러 스레드가 동시에 호출해도 안전하고(thread-safe), mock 없이 입출력 검증만으로 테스트가 끝난다. Redux reducer가 반드시 순수 함수여야 하는 이유, React `useMemo`가 의존성이 안 바뀌면 재계산하지 않는 이유가 모두 이 두 조건에서 나온다.

---

# 부수효과를 제한하면 어떤 실무적 이점이 있는가?

## 도입

FP를 채택하는 가장 실무적인 이유는 부수효과를 제한함으로써 코드 품질을 높이는 것이다. OA는 세 가지 구체적 이점을 제시한다 — 버그 감소, 디버깅·테스트 용이성, 형식 검증 적합성.

---

## 본문

> Proponents of purely functional programming claim that by restricting side effects, programs can have fewer bugs, be easier to debug and test, and be more suited to formal verification.

"순수 함수형 프로그래밍 옹호자들은 부수효과를 제한함으로써 프로그램이 버그가 적어지고, 디버깅과 테스트가 쉬워지며, 형식 검증에 더 적합해진다고 주장한다."

- **restricting side effects**: 부수효과를 금지하는 게 아니라 제한하는 것. 부수효과가 필요한 곳(네트워크, DOM)은 경계 레이어에 모으고, 나머지 비즈니스 로직은 순수하게 유지한다.
- **fewer bugs**: 외부 상태에 의존하지 않으면 호출 순서나 타이밍에 따라 결과가 달라지는 버그가 사라진다.
- **easier to debug and test**: 순수 함수는 `f(input) === expectedOutput`만 검증하면 된다. 전역 상태를 세팅하거나 mock을 만들 필요가 없다.
- **formal verification**: 수학적 증명 기법으로 프로그램의 정확성을 검증하는 것(Lean, Coq 등). 순수 함수는 수학 함수와 동형이라 증명이 가능하다.

실무에서 "버그가 적어지고 테스트가 쉬워진다"를 직접 체감하는 방식:

```js
// 부수효과 있는 버전 — 테스트 시 db, logger mock 필요
async function processOrder(orderId) {
  const order = await db.findOrder(orderId);   // 외부 의존
  logger.log('processing', orderId);            // I/O 부수효과
  order.status = 'processing';
  await db.save(order);
}

// 순수 함수로 추출한 비즈니스 로직 — mock 없이 테스트 가능
function updateOrderStatus(order, newStatus) {
  return { ...order, status: newStatus };  // 순수: 입력 → 출력만
}
// 부수효과(db, logger)는 호출자에서 처리
```

이는 Fast Fail 원칙과 같은 방향이다 — 함수가 컨트롤할 수 있는 영역을 좁혀가면서 에러 가능성을 줄인다.

---

## 종합

부수효과 제한이 "버그가 적다"를 넘어 가져오는 더 큰 이점은 코드베이스의 예측 가능성이다. 순수 함수 레이어는 언제 어디서 호출하든 같은 결과가 나오기 때문에, 팀원이 함수를 믿고 가져다 쓸 수 있다. 부수효과가 경계 레이어에 모여 있으면 "이 코드가 외부에 뭔가 하는가?"를 추적하기 위해 콜스택 전체를 읽지 않아도 된다. Redux 아키텍처가 reducer(순수) + middleware(부수효과)로 분리된 이유, React `useEffect`가 렌더 함수와 분리된 이유가 이 원칙에서 나온다.

---

# 순수 함수가 가진 어떤 구체적 성질이 컴파일러 최적화·병렬화를 가능하게 하는가?

## 도입

순수 함수의 두 조건(결정성 + 부수효과 없음)은 단순히 코드 품질 원칙이 아니다. 컴파일러가 코드를 자유롭게 재배열·제거·병렬화할 수 있는 수학적 토대를 제공한다. OA는 이에서 파생되는 네 가지 성질을 열거한다.

---

## 본문

> If the result of a pure expression is not used, it can be removed without affecting other expressions.

"순수 표현식의 결과가 사용되지 않으면 다른 표현식에 영향 없이 제거할 수 있다."

이것이 Dead code elimination이다. 컴파일러가 "이 함수 결과를 아무도 쓰지 않는다"고 판단하면 호출 자체를 제거한다. 부수효과가 있으면 제거 시 로그가 사라지거나 DB 쓰기가 안 될 수 있어 컴파일러가 함부로 제거하지 못한다.

> If a pure function is called with arguments that cause no side-effects, the result is constant with respect to that argument list (sometimes called referential transparency or idempotence), i.e., calling the pure function again with the same arguments returns the same result. (This can enable caching optimizations such as memoization.)

"부수효과 없는 인자로 순수 함수를 호출하면, 그 결과는 해당 인자 목록에 대해 상수다(참조 투명성 또는 멱등성이라고도 함). 같은 인자로 다시 호출해도 같은 결과다. 이는 메모이제이션 같은 캐싱 최적화를 가능하게 한다."

- **referential transparency**: 식을 그 값으로 치환해도 의미가 변하지 않는 성질. `add(2, 3)` → `5`로 치환해도 프로그램이 같게 동작한다.
- **memoization**: 한 번 계산한 결과를 키-값으로 저장해 재사용. React `useMemo`·`React.memo`가 이 원리다.

> If there is no data dependency between two pure expressions, their order can be reversed, or they can be performed in parallel and they cannot interfere with one another (in other terms, the evaluation of any pure expression is thread-safe).

"두 순수 표현식 사이에 데이터 의존성이 없으면, 순서를 뒤집거나 병렬로 수행할 수 있으며 서로 간섭하지 않는다(즉, 순수 표현식의 평가는 thread-safe다)."

- **data dependency**: 한쪽 결과가 다른 쪽 입력으로 쓰이는 의존 관계. 의존성이 없으면 순서가 달라도 결과가 같다.
- **thread-safe**: 여러 스레드가 동시에 접근해도 결과가 변하지 않음. Promise.all로 여러 순수 계산을 병렬 실행해도 안전한 이유다.

> If the entire language does not allow side-effects, then any evaluation strategy can be used; this gives the compiler freedom to reorder or combine the evaluation of expressions in a program (for example, using deforestation).

"언어 전체가 부수효과를 허용하지 않으면 어떤 평가 전략이든 사용할 수 있다. 이는 컴파일러에게 프로그램 내 표현식 평가를 재배열하거나 결합할 자유를 준다. 예: deforestation."

- **evaluation strategy**: 인자를 언제 평가할지의 전략. strict(즉시 평가), lazy(필요할 때 평가) 등.
- **deforestation**: 중간 자료구조(임시 배열 등)를 제거해 한 번에 처리하도록 만드는 컴파일러 최적화. `map().filter().reduce()` 체인에서 중간 배열을 만들지 않고 한 루프로 처리하는 것이 JS 엔진 최적화의 deforestation 방향이다.

```
4가지 성질 요약

1. Dead code elimination — 결과가 안 쓰이면 호출 자체 제거
2. Memoization         — 같은 인자 = 같은 결과 → 캐싱 가능
3. Reordering/Parallelism — 데이터 의존성 없으면 순서 교체·병렬 실행
4. Free evaluation strategy — 부수효과 없으면 평가 순서 자유롭게 재배열
        ↑
  모두 "같은 입력 → 같은 출력 + 외부 영향 없음"에서 파생
```

---

## 종합

컴파일러 입장에서 순수 함수는 "건드려도 안전한 식"이다. 부수효과가 있으면 컴파일러는 "이 코드를 제거하거나 순서를 바꿔도 되는가?"를 알 수 없어서 보수적으로 원래 순서를 유지해야 한다. 순수 함수라는 보장이 있으면 제거·치환·재배열이 모두 안전하다. Webpack의 tree shaking(Dead code elimination), React의 `useMemo`·`React.memo`(Memoization), `Promise.all`로 병렬 fetch(Parallelism)가 모두 이 네 성질 중 하나를 활용하는 최적화다. 부수효과 제한이 "버그 적다"를 넘어 런타임·컴파일 타임 최적화의 토대가 되는 이유다.
