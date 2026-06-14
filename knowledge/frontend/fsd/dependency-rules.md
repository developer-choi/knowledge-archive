---
tags: [fsd, architecture, principle]
source: official
priority:
---

# Questions
- 단방향 의존성 규칙이 왜 중요하고, 위반하면 어떤 일이 발생하는가?
  - 같은 레이어 내에서 슬라이스끼리 참조가 금지된 이유는?
  - FSD에서 같은 레이어의 엔티티끼리 타입을 참조해야 할 때 어떻게 하는가?
  - FSD에서 인증 토큰을 Entities에 저장하면 어떤 아키텍처 문제가 발생하고, 어떻게 해결하는가?

---

# Answers

## 단방향 의존성 규칙이 왜 중요하고, 위반하면 어떤 일이 발생하는가?

### Official Answer
A module on one layer cannot use other modules on the same layer, or the layers above.

The key difference of Feature-Sliced Design from an unregulated code structure is that pages cannot reference each other.

This allows you to make isolated modifications without unforeseen consequences to the rest of the app.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## 같은 레이어 내에서 슬라이스끼리 참조가 금지된 이유는?

### Official Answer
Slices cannot use other slices on the same layer, and that helps with **high cohesion and low coupling.**

Entities in FSD are slices, and by default, slices cannot know about each other.

In real life, however, entities often interact with each other, and sometimes one entity owns or contains other entities.

Because of that, the business logic of these interactions is preferably kept in higher layers, like Features or Pages.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## FSD에서 같은 레이어의 엔티티끼리 타입을 참조해야 할 때 어떻게 하는가?

### Official Answer
You can make your types accept type arguments as slots for connections with other entities, and even impose constraints on those slots.

To make cross-imports between entities in FSD, you can use a special public API specifically for each slice that will be cross-importing.

By making explicit connections between entities, we stay on top of inter-dependencies and maintain a decent level of domain separation.

Cross-imports are a code smell: a warning sign that slices are becoming coupled.
Before reaching for @x, consider whether the boundaries should be merged instead.
Think of @x as an explicit gateway for unavoidable domain references—not a general-purpose reuse mechanism.
Overuse tends to lock entity boundaries together and makes refactoring more costly over time.

### Reference
- https://feature-sliced.design/docs/guides/examples/types
- https://feature-sliced.design/docs/guides/issues/cross-imports

---

## FSD에서 인증 토큰을 Entities에 저장하면 어떤 아키텍처 문제가 발생하고, 어떻게 해결하는가?

### Official Answer
Since the API client is usually defined in shared/api or spreaded across the entities, the main challenge to this approach is making the token available to other requests that need it without breaking the import rule on layers:
A module (file) in a slice can only import other slices when they are located on layers strictly below.

There are several solutions to this challenge:
- Pass the token manually every time you make a request
- Expose the token to the entire app with a context or a global store like localStorage
- Inject the token into the API client every time it changes

### Reference
- https://feature-sliced.design/docs/guides/examples/auth
