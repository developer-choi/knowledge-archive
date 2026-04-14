---
tags: [fsd, concept]
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

> #### AI Annotation: SOLID, DRY 같은 원칙은 "무엇이 좋은가"를 말해주지만 "폴더를 어떻게 나누고, 파일을 어디에 놓고, 의존성을 어떤 방향으로 흘려야 하는가"에 대한 구체적 답은 주지 않는다.
> FSD는 레이어, 슬라이스, 세그먼트라는 구체적 구조를 제공하여 이 빈 공간을 채운다.

### Reference
- https://feature-sliced.design/docs/about/motivation

---

## FSD는 MVP 단계에서도 적용할 수 있는가? MVP에서는 아키텍처보다 기능이 중요하지 않은가?

### Official Answer
The methodology can benefit the project both at the stage of project support and development, and at the MVP stage.
Yes, the most important thing for MVP is "features, not the architecture laid down for the future".
But even in conditions of limited deadlines, knowing the best-practices from the methodology, you can "do with little blood", when designing the MVP version of the system, finding a reasonable compromise (rather than modeling features "at random").

> #### AI Annotation: 완전한 FSD를 적용하지 않더라도, 레이어 개념이나 의존성 방향 규칙 정도만 지켜도 나중에 확장할 때 리팩토링 비용이 줄어든다.

### Reference
- https://feature-sliced.design/docs/about/motivation
