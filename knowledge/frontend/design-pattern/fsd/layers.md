---
tags: [fsd, architecture, layers, responsibility]
---

# Questions
- [What is the purpose of layers in FSD, and what is the responsibility of each layer?](#what-is-the-purpose-of-layers-in-fsd-and-what-is-the-responsibility-of-each-layer)
  - [When should we use the 'Widgets' layer, and when should we avoid it?](#when-should-we-use-the-widgets-layer-and-when-should-we-avoid-it)
  - [What is the key difference between 'Entities' and 'Features' in FSD?](#what-is-the-key-difference-between-entities-and-features-in-fsd)
- [Why do the 'App' and 'Shared' layers skip the slice level, while other layers are required to have them?](#why-do-the-app-and-shared-layers-skip-the-slice-level-while-other-layers-are-required-to-have-them)
- [TODO] What is the key difference between 'App' and 'Pages' in FSD?

---

# Answers

## What is the purpose of layers in FSD, and what is the responsibility of each layer?

### Official Answer
Their purpose is to separate code based on how much responsibility it needs and how many other modules in the app it depends on. Every layer carries special semantic meaning to help you determine how much responsibility you should allocate to your code.

#### App
Everything that makes the app run — routing, entrypoints, global styles, providers.

All kinds of app-wide matters, both in the technical sense (e.g., context providers) and in the business sense (e.g., analytics).

Here are the segments that you can typically find in this layer:

📁 routes — the router configuration
📁 store — global store configuration
📁 styles — global styles
📁 entrypoint — the entrypoint to the application code, framework-specific

#### Pages
Full pages or large parts of a page in nested routing.

If a UI block on a page is not reused, it's perfectly fine to keep it inside the page slice.

> User Annotation
> - Entry Points.

#### Widgets
Large self-contained chunks of functionality or UI, usually delivering an entire use case.

#### Features
actions that bring business value to the user.

#### Entities
Business entities that the project works with, like user or product.

#### Shared
Reusable functionality, especially when it's detached from the specifics of the project/business, though not necessarily.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## When should we use the 'Widgets' layer, and when should we avoid it?

### Official Answer
The Widgets layer is intended for large self-sufficient blocks of UI. Widgets are most useful when they are reused across multiple pages, or when the page that they belong to has multiple large independent blocks, and this is one of them.

If a block of UI makes up most of the interesting content on a page, and is never reused, it should not be a widget, and instead it should be placed directly inside that page.

> **Tip**: If you're using a nested routing system (like the router of Remix), it may be helpful to use the Widgets layer in the same way as a flat routing system would use the Pages layer — to create full router blocks, complete with related data fetching, loading states, and error boundaries.

> AI Annotation
> - **사용해야 할 때 (Use Case)**:
>   1. 여러 페이지에서 재사용되는 거대한 UI 블록 (예: 헤더, 푸터, 댓글 섹션).
>   2. 한 페이지 내에서도 서로 독립적인 큰 덩어리들이 여러 개 있을 때.
> - **피해야 할 때 (Avoid)**:
>   - 특정 페이지의 메인 콘텐츠 그 자체이면서 재사용되지 않는 경우. 이럴 땐 굳이 위젯으로 분리하지 말고 `pages` 레이어에 직접 작성하는 것이 좋습니다.
> - **중첩 라우팅 활용 팁**:
>   - Remix나 Next.js의 중첩 라우팅을 쓸 때는 Widget을 마치 '미니 페이지'처럼 활용할 수 있습니다. 데이터 로딩(fetch), 로딩 상태, 에러 처리까지 포함된 완전한 블록으로 만들어 라우터에 끼워 넣는 방식입니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## What is the key difference between 'Entities' and 'Features' in FSD?
### Official Answer
An entity is a real-life concept that your app is working with. A feature is an interaction that provides real-life value to your app's users, the thing people want to do with your entities.

Specifically for entities/ui, it is primarily meant to reuse the same appearance across several pages in the app, and different business logic may be attached to it through props or slots.

> User Annotation
> - 엔티티는 명사, 개념, 데이터에 해당합니다. 따라서 데이터 타입, 타입을 가공하는 유틸리티, 데이터를 가져오는 GET API 호출 함수, 그리고 데이터를 단순히 보여주는 컴포넌트와 같은 코드들이 엔티티 레이어에 위치합니다.
> - **엔티티의 UI는 '수동적'이어야 합니다.** 예를 들어 유저 카드 UI는 유저 정보를 보여주기만 해야 하며, '팔로우'나 '차단' 같은 구체적인 비즈니스 동작(Feature)은 포함하지 않고 상위 레이어에서 props나 slots를 통해 주입받아야 합니다.
> - 피처는 동사, 액션, 기능에 해당합니다. 따라서 실제 기능이 포함된 컴포넌트나 Hooks, 그리고 GET 이외의 API 호출 함수 등이 피처 레이어에 위치합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## Why do the 'App' and 'Shared' layers skip the slice level, while other layers are required to have them?

### Official Answer
> AI Annotation: 앱 전체에 걸쳐 쓰이거나, 비즈니스 색깔이 전혀 없는 전역적인(Global) 성격을 가집니다. 여기에 슬라이스를 만들면 오히려 구조가 너무 파편화되어 찾기가 더 힘들어집니다. (예: `shared/button/ui` 보다 `shared/ui/button`이 관리하기 훨씬 편함)
>
> 나머지 레이어는 비즈니스 로직을 담고있기 때문에, 도메인 기준으로 한번 나눠야합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## [TODO] What is the key difference between 'App' and 'Pages' in FSD?
### Official Answer

### Reference
