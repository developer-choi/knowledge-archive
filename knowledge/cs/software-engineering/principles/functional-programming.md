---
tags: [programming-paradigm, concept]
source: official
priority:
---
# Questions
- 함수형 프로그래밍이란 무엇이며, 명령형과 어떻게 다른가?
  - FP에서 "함수의 합성(composing)"은 구체적으로 무엇을 말하는가?
- 순수 함수(pure function)는 어떤 두 조건을 만족해야 하는가?
- 부수효과를 제한하면 어떤 실무적 이점이 있는가?
- 순수 함수가 가진 어떤 구체적 성질이 컴파일러 최적화·병렬화를 가능하게 하는가?
- [UNVERIFIED] FP와 OOP의 핵심 원칙을 각각 꼽는다면?
- [UNVERIFIED] FP(함수 기반)와 OOP(클래스 기반)의 응집력·접근 제어 측면 차이는?

---

# Answers

## 함수형 프로그래밍이란 무엇이며, 명령형과 어떻게 다른가?

### Official Answer
In computer science, functional programming is a programming paradigm where programs are constructed by applying and composing functions.
It is a declarative programming paradigm in which function definitions are trees of expressions that map values to other values, rather than a sequence of imperative statements which update the running state of the program.

> #### User Annotation:
> FP와 OOP는 양자택일이 아니라 함께 쓴다.
> JS는 두 패러다임을 함께 쓸 수 있는 multi-paradigm 언어이고, 실무에서도 두 스타일이 섞여서 등장한다.

### Reference
- https://en.wikipedia.org/wiki/Functional_programming
- https://tech.kakaopay.com/post/will-effect-system/

---

## FP에서 "함수의 합성(composing)"은 구체적으로 무엇을 말하는가?

### Official Answer
Function composition is an act or mechanism to combine simple functions to build more complex ones.
In functional programming languages, function composition can be naturally expressed as a higher-order function or operator.

> #### AI Annotation:
> 수학의 (g ∘ f)(x) = g(f(x))를 코드로 옮긴 것이다.
> 한 함수의 출력을 다음 함수의 입력으로 흘려보내 새 함수를 만든다.
>
> ```js
> const compose = (g, f) => (x) => g(f(x));
> const trim = (s) => s.trim();
> const lower = (s) => s.toLowerCase();
> const normalize = compose(lower, trim);
> normalize('  HELLO  '); // 'hello'
> ```
>
> 실무에서는 lodash `_.flow`, RxJS `pipe`, Redux 미들웨어 합성, React HOC 합성이 모두 이 패턴이다.
> 상위 질문의 정의 첫 문장 "applying and composing functions"에서 "composing"의 무게가 "applying"과 동등한 이유를 구체화한 것.

### Reference
- https://en.wikipedia.org/wiki/Function_composition_(computer_science)
- https://en.wikipedia.org/wiki/Functional_programming

---

## 순수 함수(pure function)는 어떤 두 조건을 만족해야 하는가?

### Official Answer
When a pure function is called with some given arguments, it will always return the same result, and cannot be affected by any mutable state or other side effects.

Pure functions (or expressions) have no side effects (memory or I/O).

> #### AI Annotation:
> 두 조건을 정리하면:
> 1. 같은 인자로 호출하면 **항상 같은 결과**를 반환한다 (결정성, referential transparency).
> 2. 가변 상태나 부수효과의 영향을 받지도 일으키지도 않는다.
>
> 이 두 조건이 메모이제이션, 병렬 실행, 형식 검증의 토대가 된다.

> #### User Annotation:
> "함수란 매개변수로 인풋을 넣으면 아웃풋이 나오는 것"이라는 직관은 사실 일반 함수가 아니라 **순수 함수**의 정의에 가깝다.
> 일반 함수는 파일 IO·네트워크·전역 상태 변경 같은 부수효과를 가질 수 있다.

### Reference
- https://en.wikipedia.org/wiki/Functional_programming
- https://en.wikipedia.org/wiki/Pure_function

---

## 부수효과를 제한하면 어떤 실무적 이점이 있는가?

### Official Answer
Proponents of purely functional programming claim that by restricting side effects, programs can have fewer bugs, be easier to debug and test, and be more suited to formal verification.

> #### AI Annotation:
> 같은 입력에 같은 출력이 보장되니 단위 테스트에서 mocking 없이 입출력 검증만으로 끝난다.
> 외부 상태 의존이 없어 동시 실행해도 race condition이 안 생기므로 병렬화에 유리하고, 호출 순서를 바꿔도 의미가 보존되어 컴파일러 최적화 여지가 커진다.

> #### User Annotation:
> Fast Fail 원칙과 결이 같다.
> 함수 안에 잘못된 값이 들어왔으면 즉시 reject하고, 통과한 데이터는 함수 범위 안에서 안전하다고 가정하고 작성한다.
> "내가 컨트롤할 수 있는 영역"을 좁혀가면서 에러 가능성을 줄이는 사고와 부수효과 제한은 같은 방향이다.

### Reference
- https://en.wikipedia.org/wiki/Functional_programming

---

## 순수 함수가 가진 어떤 구체적 성질이 컴파일러 최적화·병렬화를 가능하게 하는가?

### Official Answer
Pure functions (or expressions) have no side effects (memory or I/O).
This means that pure functions have several useful properties, many of which can be used to optimize the code:

- If the result of a pure expression is not used, it can be removed without affecting other expressions.
- If a pure function is called with arguments that cause no side-effects, the result is constant with respect to that argument list (sometimes called referential transparency or idempotence), i.e., calling the pure function again with the same arguments returns the same result. (This can enable caching optimizations such as memoization.)
- If there is no data dependency between two pure expressions, their order can be reversed, or they can be performed in parallel and they cannot interfere with one another (in other terms, the evaluation of any pure expression is thread-safe).
- If the entire language does not allow side-effects, then any evaluation strategy can be used; this gives the compiler freedom to reorder or combine the evaluation of expressions in a program (for example, using deforestation).

> #### AI Annotation:
> 4가지 성질을 한 줄 요약:
> 1. **Dead code elimination** — 결과가 안 쓰이면 호출 자체를 제거.
> 2. **Memoization** — 같은 인자에 같은 결과 보장 → 캐싱 가능.
> 3. **Reordering / Parallelism** — 데이터 의존성이 없으면 순서 바꿔 실행하거나 병렬 실행.
> 4. **Free evaluation strategy** — 부수효과가 없으면 컴파일러가 평가 순서를 자유롭게 재배열·결합.
>
> 네 성질 모두 "같은 입력 → 같은 출력 + 외부 영향 없음"이라는 순수 함수의 두 조건에서 파생된다.
> 컴파일러 입장에서 순수 함수는 "건드려도 안전한 식"이라 자유롭게 제거·치환·재배열할 수 있다.
> 부수효과 제한이 단순히 "버그가 적다"를 넘어 코드 변환의 토대가 되는 이유다.

### Reference
- https://en.wikipedia.org/wiki/Functional_programming

---

## [UNVERIFIED] FP와 OOP의 핵심 원칙을 각각 꼽는다면?

### User Answer
- **FP**: Pure Function, Immutable
- **OOP**: SOLID

---

## [UNVERIFIED] FP(함수 기반)와 OOP(클래스 기반)의 응집력·접근 제어 측면 차이는?

### User Answer
함수는 응집력에 약점이 있다.
한 곳에서만 쓰는 함수도 외부에서 사용하려면 `export`해야 하는데, 그렇게 하면 자동완성 목록에 계속 노출되고 접근 제어는 `export` 여부 말고는 방법이 없다.

클래스는 `private` / `protected` / `public` 접근 제어자를 통해 더 세밀한 접근 제한이 가능하고, 관련 메소드가 물리적으로 한 파일 안에 모이므로 응집력이 높다.

그래서 FP와 OOP는 양자택일이 아니라 각 패러다임의 장점을 취해 함께 사용한다.

> #### User Annotation:
> 객체를 단 1개만 만들어 쓰는 상황이라도, 접근 제어만을 위해 클래스로 감싸는 선택이 가능하다.

### Reference
- https://tech.kakaopay.com/post/will-effect-system/
