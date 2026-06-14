---
tags: [fsd, concept]
source: official
priority:
---

# Questions
- 기존의 설계 원칙(SOLID, DRY 등)이 있는데도 FSD 같은 구체적 방법론이 필요한 이유는 무엇인가?
- FSD는 MVP 단계에서도 적용할 수 있는가? MVP에서는 아키텍처보다 기능이 중요하지 않은가?

---

# Answers

## 기존의 설계 원칙(SOLID, DRY 등)이 있는데도 FSD 같은 구체적 방법론이 필요한 이유는 무엇인가?

### Official Answer
The existence of principles alone is not enough to design a good architecture.
Not everyone knows them completely, even fewer understand and apply them correctly.
The design principles are too general, and do not give a specific answer to the question: "How to design the structure and architecture of a scalable and flexible application?"

### Reference
- https://feature-sliced.design/docs/about/motivation

---

## FSD는 MVP 단계에서도 적용할 수 있는가? MVP에서는 아키텍처보다 기능이 중요하지 않은가?

### Official Answer
The methodology can benefit the project both at the stage of project support and development, and at the MVP stage.
Yes, the most important thing for MVP is "features, not the architecture laid down for the future".
But even in conditions of limited deadlines, knowing the best-practices from the methodology, you can "do with little blood", when designing the MVP version of the system, finding a reasonable compromise (rather than modeling features "at random").

### Reference
- https://feature-sliced.design/docs/about/motivation
