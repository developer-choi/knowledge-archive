---
tags: [software-engineering, architecture, principle]
---
# Questions
- [결합도(Coupling)란 무엇인가?](#결합도coupling란-무엇인가)
- [결합도의 종류에는 무엇이 있는가?](#결합도의-종류에는-무엇이-있는가)
- [결합도를 어떻게 줄일 수 있는가?](#결합도를-어떻게-줄일-수-있는가)

---

# Answers

## 결합도(Coupling)란 무엇인가?
### Official Answer
In software engineering, coupling is the degree of interdependence between software modules, a measure of how closely connected two routines or modules are.

Low coupling refers to a relationship in which one module interacts with another module through a simple and stable interface and does not need to be concerned with the other module's internal implementation (see [Information Hiding](https://en.wikipedia.org/wiki/Information_Hiding)).

> #### AI Annotation:
> A라는 모듈이 작동하기 위해 B를 얼마나 알고 있어야 하는가?
> A를 고쳤는데 전혀 상관없어 보이는 B에서 에러가 난다면, 두 모듈은 결합도가 매우 높은 상태.
>
> 내부가 어떻게 돌아가는지 몰라도 '이 버튼을 누르면 결제가 된다'는 인터페이스만 명확하면 결합도가 낮아집니다.

### Reference
- https://en.wikipedia.org/wiki/Coupling_(computer_programming)

---

## 결합도의 종류에는 무엇이 있는가?
### Official Answer
#### Content coupling
Content coupling is said to occur when one module uses the code of another module, for instance a branch.

This violates [information hiding](https://en.wikipedia.org/wiki/Information_hiding) – a basic software design concept.

> #### User Annotation:
> **Example:**
> - 다른 모듈의 (private) field를 직접 수정하는 경우.

#### Common coupling
Common coupling is said to occur when several modules have access to the same global data.

But it can lead to uncontrolled error propagation and unforeseen side-effects when changes are made.

> #### User Annotation:
> **Example:**
> - Redux같은거 남발해서 수많은 모듈들이 읽고 쓰고 하다보니 이 데이터가 어디서 어떻게 CRUD 되는지 흐름 파악하기 힘든 경우

#### External coupling
External coupling occurs when two modules share an externally imposed data format, communication protocol, or device interface.

> #### User Annotation:
> **Example:**
> - 여러 컴포넌트가 API에서 응답하는 데이터를 직접 의존하는 경우

#### Control coupling
Control coupling is one module controlling the flow of another, by passing it information on what to do (e.g., passing a what-to-do flag).

#### Class Coupling
- A has an attribute that refers to (is of type) B.
- A calls on services of an object B.
- A has a method that references B (via return type or parameter).
- A is a subclass of (or implements) class B.

### Reference
- https://en.wikipedia.org/wiki/Coupling_(computer_programming)

---

## 결합도를 어떻게 줄일 수 있는가?
### Official Answer
One approach to decreasing coupling is functional design, which seeks to limit the responsibilities of modules along functionality.

### Reference
- https://en.wikipedia.org/wiki/Coupling_(computer_programming)