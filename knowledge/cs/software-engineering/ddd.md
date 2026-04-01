---
tags: [software-engineering, concept]
---
# Questions
- [DDD(Domain-Driven Design)란 무엇인가?](#ddddomain-driven-design란-무엇인가)
  - [DDD에서 Ubiquitous Language란 무엇인가?](#ddd에서-ubiquitous-language란-무엇인가)
  - [DDD에서 Entity와 Value Object의 핵심 차이는?](#ddd에서-entity와-value-object의-핵심-차이는)
  - [DDD에서 Aggregate란 무엇이며, 왜 외부에서 루트만 참조하도록 제한하는가?](#ddd에서-aggregate란-무엇이며-왜-외부에서-루트만-참조하도록-제한하는가)
- [DDD는 모든 프로젝트에 적합한가?](#ddd는-모든-프로젝트에-적합한가)

---

# Answers

## DDD(Domain-Driven Design)란 무엇인가?

### Official Answer
Domain-driven design (DDD) is a software design approach that focuses on modeling software to match a domain according to input from that domain's experts.
DDD is against the idea of having a single unified model; instead it divides a large system into bounded contexts, each of which have their own model.

> #### Official Annotation:
> Domain-driven design is predicated on the following goals:
> placing the project's primary focus on the core domain and domain logic layer;
> basing complex designs on a model of the domain;
> initiating a creative collaboration between technical and domain experts to iteratively refine a conceptual model that addresses particular domain problems.

> #### Official Annotation:
> Software's developers build a domain model: a system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain.

> #### Official Annotation:
> The term was coined by Eric Evans in his book of the same name published in 2003.

### Reference
- https://en.wikipedia.org/wiki/Domain-driven_design

---

## DDD에서 Ubiquitous Language란 무엇인가?

### Official Answer
These aspects of domain-driven design aim to foster a common language shared by domain experts, users, and developers—the ubiquitous language.
The ubiquitous language is used in the domain model and for describing system requirements.
Ubiquitous language is one of the pillars of DDD together with strategic design and tactical design.

> #### AI Annotation:
> 코드의 클래스명, 메서드명뿐 아니라 기획서, 회의, 요구사항 문서까지 모두 같은 용어를 쓰는 것이 목표다.
> 예: 대출 심사 시스템이라면 코드에 `LoanApplication`, `acceptOffer()` 같은 이름을 쓰고, 기획서에서도 "대출 신청", "오퍼 승인"이라는 동일한 용어를 사용한다.

### Reference
- https://en.wikipedia.org/wiki/Domain-driven_design

---

## DDD에서 Entity와 Value Object의 핵심 차이는?

### Official Answer
An entity is an object defined not by its attributes, but its identity.
As an example, most airlines assign a unique number to seats on every flight: this is the seat's identity.
In contrast, a value object is an immutable object that contains attributes but has no conceptual identity.
When people exchange business cards, for instance, they only care about the information on the card (its attributes) rather than trying to distinguish between each unique card.

### Reference
- https://en.wikipedia.org/wiki/Domain-driven_design

---

## DDD에서 Aggregate란 무엇이며, 왜 외부에서 루트만 참조하도록 제한하는가?

### Official Answer
Models can be bound together by a root entity to become an aggregate.
Objects outside the aggregate are allowed to hold references to the root but not to any other object of the aggregate.
The aggregate root checks the consistency of changes in the aggregate.
Drivers do not have to individually control each wheel of a car, for instance: they simply drive the car.
In this context, a car is an aggregate of several other objects (the engine, the brakes, the headlights, etc.).

> #### Official Annotation:
> Models can also define events (something that happened in the past).
> A domain event is an event that domain experts care about.

> #### AI Annotation:
> 외부에서 루트만 참조하도록 제한하는 이유: 내부 객체를 직접 수정하면 루트가 일관성 검사를 할 수 없게 된다.
> 모든 변경을 루트를 통해서만 수행해야 비즈니스 규칙 위반을 방지할 수 있다.

### Reference
- https://en.wikipedia.org/wiki/Domain-driven_design

---

## DDD는 모든 프로젝트에 적합한가?

### Official Answer
Critics of domain-driven design argue that developers must typically implement a great deal of isolation and encapsulation to maintain the model as a pure and helpful construct.
While domain-driven design provides benefits such as maintainability, Microsoft recommends it only for complex domains where the model provides clear benefits in formulating a common understanding of the domain.

> #### AI Annotation:
> 답은 아니다.
> 단순한 CRUD 앱에 DDD를 적용하면, 도메인 모델을 인프라(DB, HTTP)로부터 격리하는 보일러플레이트 비용이 얻는 이점보다 크다.

### Reference
- https://en.wikipedia.org/wiki/Domain-driven_design
