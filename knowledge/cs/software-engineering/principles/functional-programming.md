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

---

# Answers

## 함수형 프로그래밍이란 무엇이며, 명령형과 어떻게 다른가?

### Official Answer
In computer science, functional programming is a programming paradigm where programs are constructed by applying and composing functions.
It is a declarative programming paradigm in which function definitions are trees of expressions that map values to other values, rather than a sequence of imperative statements which update the running state of the program.

### User Answer
FP와 OOP는 양자택일이 아니라 함께 쓴다.
JS는 두 패러다임을 함께 쓸 수 있는 multi-paradigm 언어이고, 실무에서도 두 스타일이 섞여서 등장한다.

### Reference
- https://en.wikipedia.org/wiki/Functional_programming
- https://tech.kakaopay.com/post/will-effect-system/

---

## FP에서 "함수의 합성(composing)"은 구체적으로 무엇을 말하는가?

### Official Answer
Function composition is an act or mechanism to combine simple functions to build more complex ones.
In functional programming languages, function composition can be naturally expressed as a higher-order function or operator.

### Reference
- https://en.wikipedia.org/wiki/Function_composition_(computer_science)
- https://en.wikipedia.org/wiki/Functional_programming

---

## 순수 함수(pure function)는 어떤 두 조건을 만족해야 하는가?

### Official Answer
When a pure function is called with some given arguments, it will always return the same result, and cannot be affected by any mutable state or other side effects.

Pure functions (or expressions) have no side effects (memory or I/O).

### User Answer
"함수란 매개변수로 인풋을 넣으면 아웃풋이 나오는 것"이라는 직관은 사실 일반 함수가 아니라 **순수 함수**의 정의에 가깝다.
일반 함수는 파일 IO·네트워크·전역 상태 변경 같은 부수효과를 가질 수 있다.

### Reference
- https://en.wikipedia.org/wiki/Functional_programming
- https://en.wikipedia.org/wiki/Pure_function

---

## 부수효과를 제한하면 어떤 실무적 이점이 있는가?

### Official Answer
Proponents of purely functional programming claim that by restricting side effects, programs can have fewer bugs, be easier to debug and test, and be more suited to formal verification.

### User Answer
Fast Fail 원칙과 결이 같다.
함수 안에 잘못된 값이 들어왔으면 즉시 reject하고, 통과한 데이터는 함수 범위 안에서 안전하다고 가정하고 작성한다.
"내가 컨트롤할 수 있는 영역"을 좁혀가면서 에러 가능성을 줄이는 사고와 부수효과 제한은 같은 방향이다.

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

### Reference
- https://en.wikipedia.org/wiki/Functional_programming
