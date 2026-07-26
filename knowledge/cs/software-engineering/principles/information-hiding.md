---
tags: [software-engineering, architecture, principle]
source: official
publishable: true
---
# Questions
- 정보 은닉이란 무엇인가?
  - 정보 은닉은 코드에서 어떤 수단으로 이뤄지는가?
  - 데이터를 물리적으로 어떤 형태로 담고 있는지를 숨기면 무엇이 달라지는가?
- 정보 은닉으로 잘 나뉜 프로그램에서 변경은 어떻게 달라지는가?
- 객체지향에서 정보 은닉은 코드의 의존 대상을 어떻게 바꾸는가?
- 캡슐화란 무엇인가?
  - 정보 은닉과 캡슐화는 어떤 관계인가?
  - 캡슐화가 노리는 것은 무엇인가?
  - 캡슐화는 객체지향 프로그래밍에서만 성립하는 개념인가?

---

# Answers

## 정보 은닉이란 무엇인가?

### Official Answer
In computer science, information hiding is the principle of segregation of the design decisions in a computer program that are most likely to change, thus protecting other parts of the program from extensive modification if the design decision is changed.

The protection involves providing a stable interface which protects the remainder of the program from the implementation (whose details are likely to change).

Information hiding serves as an effective criterion for dividing any piece of equipment, software, or hardware, into modules of functionality.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 정보 은닉은 코드에서 어떤 수단으로 이뤄지는가?

### Official Answer
Written in another way, information hiding is the ability to prevent certain aspects of a class or software component from being accessible to its clients, using either programming language features (like private variables) or an explicit exporting policy.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 데이터를 물리적으로 어떤 형태로 담고 있는지를 숨기면 무엇이 달라지는가?

### Official Answer
A common use of information hiding is to hide the physical storage layout for data so that if it is changed, the change is restricted to a small subset of the total program.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 정보 은닉으로 잘 나뉜 프로그램에서 변경은 어떻게 달라지는가?

### Official Answer
As can be seen by this example, information hiding provides flexibility.

This flexibility allows a programmer to modify the functionality of a computer program during normal evolution as the computer program is changed to better fit the needs of users.

When a computer program is well designed, decomposing the source code solution into modules using the principle of information hiding, evolutionary changes are much easier because the changes typically are local rather than global changes.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 객체지향에서 정보 은닉은 코드의 의존 대상을 어떻게 바꾸는가?

### Official Answer
In object-oriented programming, information hiding (by way of nesting of types) reduces software development risk by shifting the code's dependency on an uncertain implementation (design decision) onto a well-defined interface.

Clients of the interface perform operations purely through the interface, so, if the implementation changes, the clients do not have to change.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 캡슐화란 무엇인가?

### Official Answer
In his book on object-oriented design, Grady Booch defined encapsulation as "the process of compartmentalizing the elements of an abstraction that constitute its structure and behavior; encapsulation serves to separate the contractual interface of an abstraction and its implementation."

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 정보 은닉과 캡슐화는 어떤 관계인가?

### Official Answer
The term encapsulation is often used interchangeably with information hiding.

Not all agree on the distinctions between the two, though; one may think of information hiding as being the principle and encapsulation being the technique.

A software module hides information by encapsulating the information into a module or other construct which presents an interface.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 캡슐화가 노리는 것은 무엇인가?

### Official Answer
The purpose is to achieve the potential for change: the internal mechanisms of the component can be improved without impact on other components, or the component can be replaced with a different one that supports the same public interface.

Encapsulation also protects the integrity of the component, by preventing users from setting the internal data of the component into an invalid or inconsistent state.

Another benefit of encapsulation is that it reduces system complexity and thus increases robustness, by limiting the interdependencies between software components.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding

---

## 캡슐화는 객체지향 프로그래밍에서만 성립하는 개념인가?

### Official Answer
In this sense, the idea of encapsulation is more general than how it is applied in object-oriented programming.

As such, encapsulation is a core principle of good software architecture, at every level of granularity.

### Reference
- https://en.wikipedia.org/wiki/Information_hiding
