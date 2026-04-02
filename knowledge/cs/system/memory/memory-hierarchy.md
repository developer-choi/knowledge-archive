---
tags: [os, performance, concept]
---

# Questions
- [메모리 계층 구조(Memory Hierarchy)란 무엇인가?](#메모리-계층-구조memory-hierarchy란-무엇인가)

---

# Answers

## 메모리 계층 구조(Memory Hierarchy)란 무엇인가?

### Official Answer
The lower levels of the memory hierarchy tend to be slower, but larger.
A program will achieve greater performance if it uses memory while it is cached in the upper levels of the memory hierarchy and avoids bringing other data into the upper levels of the hierarchy that will displace data that will be used shortly in the future.

> #### Official Annotation:
> Modern machines tend to read blocks of lower memory into the next level of the memory hierarchy.
> If this displaces used memory, the operating system tries to predict which data will be accessed least (or latest) and move it down the memory hierarchy.

> #### AI Annotation: Register → L1 → L2 → L3 → RAM → Disk → Remote 순으로 계층이 구성된다. 위로 갈수록 빠르고 작고, 아래로 갈수록 느리고 크다.

### Reference
- https://en.wikipedia.org/wiki/Locality_of_reference
