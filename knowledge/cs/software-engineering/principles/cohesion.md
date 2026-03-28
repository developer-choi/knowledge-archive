---
tags: [software-engineering, architecture, principle]
---
# Questions
- [응집도(Cohesion)란 무엇인가?](#응집도cohesion란-무엇인가)
- [높은 응집도가 왜 바람직한가?](#높은-응집도가-왜-바람직한가)
- [응집도의 종류에는 무엇이 있는가?](#응집도의-종류에는-무엇이-있는가)

---

# Answers

## 응집도(Cohesion)란 무엇인가?
### Official Answer
Cohesion refers to the degree to which the elements inside a module belong together.

In object-oriented programming, a class is said to have high cohesion if the methods that serve the class are similar in many aspects.

The functionalities embedded in a class, accessed through its methods, have much in common.

Methods carry out a small number of related activities, by avoiding coarsely grained or unrelated sets of data.

Related methods are in the same source file or otherwise grouped together; for example, in separate files but in the same sub-directory/folder.

### Reference
- https://en.wikipedia.org/wiki/Cohesion_(computer_science)

---

## 높은 응집도가 왜 바람직한가?
### Official Answer
High cohesion is associated with several desirable software traits including robustness, reliability, reusability, and understandability.

> #### User Annotation:
> 기획 바뀌어서 여기수정 저기수정 안해도 됨.

### Reference
- https://en.wikipedia.org/wiki/Cohesion_(computer_science)

---

## 응집도의 종류에는 무엇이 있는가?
### Official Answer
#### Coincidental cohesion (worst)
Coincidental cohesion is when parts of a module are grouped arbitrarily.

The only relationship between the parts is that they have been grouped together (e.g., a “Utilities” class).

#### Logical cohesion
Logical cohesion is when parts of a module are grouped because they are logically categorized to do the same thing even though they are different by nature (e.g., grouping all mouse and keyboard input handling routines or bundling all models, views, and controllers in separate folders in an [MVC pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)).

> #### User Annotation:
> **Coincidental cohesion Examples:**
> - 하나의 static class 안에 온갖 메소드 다 집어넣기
> - 하나의 `utils.ts` / `common.ts`에 온갖 함수 다 집어넣기
>
> **Logical cohesion Examples:**
> - hooks
> - components
> - types
> - styles

### Reference
- https://en.wikipedia.org/wiki/Cohesion_(computer_science)
