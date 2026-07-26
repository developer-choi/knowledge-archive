---
tags: [software-engineering, architecture, principle]
source: official
priority: 2
publishable: true
---
# Questions
- 단일 책임 원칙(SRP)이란 무엇인가?
  - 버그를 고치거나 리팩터링하는 것도 모듈이 '변해야 할 이유'에 해당하는가?
- 모듈의 경계는 무엇을 기준으로 그어야 하는가?
  - 다음 Employee 클래스가 단일 책임 원칙을 어기는 이유를 설명하라
  - 한 모듈이 서로 다른 요청자를 함께 섬기면 어떤 대가를 치르는가?
- 단일 책임 원칙을 응집도·결합도의 말로 바꾸면 어떻게 되는가?
- SQL을 JSP에 넣지 않고, 계산 모듈에서 HTML을 만들지 않고, 업무 규칙이 데이터베이스 스키마를 모르게 하는 관례들은 무엇에서 나오는가?

---

# Answers

## 단일 책임 원칙(SRP)이란 무엇인가?

### Official Answer
The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change.

### Reference
- https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html

---

## 버그를 고치거나 리팩터링하는 것도 모듈이 '변해야 할 이유'에 해당하는가?

### Official Answer
These questions can be answered by pointing out the coupling between the term "reason to change" and "responsibility".

Certainly the code is not responsible for bug fixes or refactoring.

Those things are the responsibility of the programmer, not of the program.

Or, perhaps a better question is: who is the program responsible to?

Better yet: who must the design of the program respond to?

### Reference
- https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html

---

## 모듈의 경계는 무엇을 기준으로 그어야 하는가?

### Official Answer
This principle is about people.

When you write a software module, you want to make sure that when changes are requested, those changes can only originate from a single person, or rather, a single tightly coupled group of people representing a single narrowly defined business function.

You want to isolate your modules from the complexities of the organization as a whole, and design your systems such that each module is responsible (responds to) the needs of just that one business function.

### Reference
- https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html

---

## 다음 Employee 클래스가 단일 책임 원칙을 어기는 이유를 설명하라

```java
public class Employee {
  public Money calculatePay();
  public void save();
  public String reportHours();
}
```

### Official Answer
The calculatePay method implements the algorithms that determine how much a particular employee should be paid, based on that employee's contract, status, hours worked, etc.

The 'save' method stores the data managed by the Employee object onto the enterprise database.

The reportHours method returns a string which is appended to a report that auditors use to ensure that employees are working the appropriate number of hours and are being paid the appropriate compensation.

Which of them would be fired by the CEO if that method were catastrophically mis-specified?

So it stands to reason that when changes are made to the algorithm within the calculatePay method, the request for those changes will originate from the organization headed by the CFO.

Similarly it will be the COO's organization that will request changes to the reportHours method, and the CTOs organization that will request changes to the save method.

### Reference
- https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html

---

## 한 모듈이 서로 다른 요청자를 함께 섬기면 어떤 대가를 치르는가?

### Official Answer
Because we don't want to get the COO fired because we made a change requested by the CTO.

Nothing terrifies our customers and managers more that discovering that a program malfunctioned in a way that was, from their point of view, completely unrelated to the changes they requested.

If you change the calculatePay method, and inadvertently break the reportHours method; then the COO will start demanding that you never change the calculatePay method again.

However, as you think about this principle, remember that the reasons for change are people.

It is people who request changes.

And you don't want to confuse those people, or yourself, by mixing together the code that many different people care about for different reasons.

### Reference
- https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html

---

## 단일 책임 원칙을 응집도·결합도의 말로 바꾸면 어떻게 되는가?

### Official Answer
Gather together the things that change for the same reasons. Separate those things that change for different reasons.

If you think about this you'll realize that this is just another way to define cohesion and coupling.

We want to increase the cohesion between things that change for the same reasons, and we want to decrease the coupling between those things that change for different reasons.

### Reference
- https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html

---

## SQL을 JSP에 넣지 않고, 계산 모듈에서 HTML을 만들지 않고, 업무 규칙이 데이터베이스 스키마를 모르게 하는 관례들은 무엇에서 나오는가?

### Official Answer
This is the reason we do not put SQL in JSPs.

This is the reason we do not generate HTML in the modules that compute results.

This is the reason that business rules should not know the database schema.

This is the reason we separate concerns.

### Reference
- https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html
