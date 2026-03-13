---
tags: [fsd, slice, dependency, sharing]
---

# Questions
- [What are slices in FSD, and what is their purpose?](#what-are-slices-in-fsd-and-what-is-their-purpose)
  - [Why is it forbidden for a slice to reference another slice within the same layer?](#why-is-it-forbidden-for-a-slice-to-reference-another-slice-within-the-same-layer)
  - [How should we handle it when two slices need to share the same logic?](#how-should-we-handle-it-when-two-slices-need-to-share-the-same-logic)

---

# Answers

## What are slices in FSD, and what is their purpose?

### Official Answer
Their main purpose is to group code by its meaning for the product, business, or just the application.
Slices are meant to be independent and highly cohesive groups of code files.
Slices make your codebase easier to navigate by keeping logically related modules close together.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## Why is it forbidden for a slice to reference another slice within the same layer?

### Official Answer
Slices cannot use other slices on the same layer, and that helps with **high cohesion and low coupling.**

Entities in FSD are slices, and by default, slices cannot know about each other.

In real life, however, entities often interact with each other, and sometimes one entity owns or contains other entities.

Because of that, the business logic of these interactions is preferably kept in higher layers, like Features or Pages.

> AI Annotation:
> - **순환 참조 방지 (Preventing Circular Dependencies)**: A가 B를, B가 A를 참조하면서 생기는 무한 루프와 꼬인 의존성을 원천 차단합니다.
> - **수평적 의존성 금지 규칙**: User 엔티티 슬라이스가 Post 엔티티 슬라이스를 직접 참조하는 것을 원칙적으로 막아 결합도를 낮춥니다.
> - **상위 레이어 위임**: 실제 서비스에서는 엔티티끼리 상호작용해야 할 일이 많습니다. 이때 엔티티끼리 직접 엮는 복잡한 로직은 하위 레이어에서 억지로 해결하려 하지 말고, **이들을 조립하는 상위 레이어(Features, Pages)에서 처리**하는 것이 권장됩니다.
> - **낮은 결합도 (Low Coupling)**: 각 슬라이스를 독립된 조각으로 유지하여, 하나를 수정하거나 삭제할 때 다른 슬라이스가 깨지지 않도록 보호합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## How should we handle it when two slices need to share the same logic?

### AI Annotation
1. **Shared 레이어로 내리기**: 만약 공유하려는 로직이 특정 비즈니스와 무관한 순수 유틸리티라면 Shared 레이어로 이동시킵니다.
2. **하위 레이어(Entities)로 내리기**: 두 Features가 동일한 데이터 모델을 공유한다면, 그 로직을 Entities 레이어의 관련 슬라이스로 옮깁니다.
3. **상위 레이어(Widgets/Pages)에서 조합**: 두 슬라이스를 직접 연결하지 말고, 상위 계층인 Widgets나 Pages에서 두 슬라이스를 각각 가져와서 로직을 조립(Composition)합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview
