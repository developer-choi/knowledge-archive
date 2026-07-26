---
tags: [software-engineering, architecture, principle]
source: official
publishable: true
---
# Questions
- 잘못된 추상화(the wrong abstraction)는 어떤 과정을 거쳐 만들어지는가?
  - 이미 존재하는 코드는 개발자의 판단에 어떤 압력을 가하는가?

---

# Answers

## 잘못된 추상화(the wrong abstraction)는 어떤 과정을 거쳐 만들어지는가?

### Official Answer
Programmer A sees duplication.

Programmer A extracts duplication and gives it a name.

This creates a new abstraction. It could be a new method, or perhaps even a new class.

Programmer A replaces the duplication with the new abstraction.

A new requirement appears for which the current abstraction is almost perfect.

Programmer B feels honor-bound to retain the existing abstraction, but since isn't exactly the same for every case, they alter the code to take a parameter, and then add logic to conditionally do the right thing based on the value of that parameter.

What was once a universal abstraction now behaves differently for different cases.

Loop until code becomes incomprehensible.

### Reference
- https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction

---

## 이미 존재하는 코드는 개발자의 판단에 어떤 압력을 가하는가?

### Official Answer
Existing code exerts a powerful influence. Its very presence argues that it is both correct and necessary.

We know that code represents effort expended, and we are very motivated to preserve the value of this effort.

And, unfortunately, the sad truth is that the more complicated and incomprehensible the code, i.e. the deeper the investment in creating it, the more we feel pressure to retain it (the "sunk cost fallacy").

### Reference
- https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction
