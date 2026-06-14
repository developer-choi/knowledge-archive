---
tags: [fsd, architecture, concept]
source: official
priority:
---

# Questions
- FSD에서 레이어의 목적과 각 레이어의 책임은 무엇인가?
  - Widgets 레이어는 언제 사용하고 언제 피해야 하는가?
    - 여러 페이지에서 재사용되는 큰 UI 블록을 Shared와 Widgets 중 어디에 놓아야 하는가?
  - FSD에서 Entities와 Features의 핵심 차이는 무엇인가?
    - FSD에서 feature 슬라이스의 경계를 어떻게 판단하는가? 하나의 feature에 여러 기능이 들어가면 어떤 문제가 생기는가?
  - FSD에서 Entities 레이어를 만들지 않아도 되는가? 만든다면 언제 만들어야 하는가?
  - [UNVERIFIED] FSD에서 App과 Pages의 핵심 차이는 무엇인가?
- FSD에서 세그먼트란 무엇이며, 각 세그먼트의 역할은?
- FSD 슬라이스에서 Public API의 역할과 리팩토링 지원 방식은?
  - FSD에서 Shared 레이어와 도메인 레이어의 Public API 전략은 어떻게 다른가?
- FSD에서 Public API에 와일드카드 re-export를 피해야 하는 이유는?

---

# Answers

## FSD에서 레이어의 목적과 각 레이어의 책임은 무엇인가?

### Official Answer
Their purpose is to separate code based on how much responsibility it needs and how many other modules in the app it depends on.
Every layer carries special semantic meaning to help you determine how much responsibility you should allocate to your code.

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

#### Widgets
Large self-contained chunks of functionality or UI, usually delivering an entire use case.

#### Features
actions that bring business value to the user.

#### Entities
Business entities that the project works with, like user or product.

#### Shared
Reusable functionality, especially when it's detached from the specifics of the project/business, though not necessarily.

### User Answer
- Entry Points.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## Widgets 레이어는 언제 사용하고 언제 피해야 하는가?

### Official Answer
The Widgets layer is intended for large self-sufficient blocks of UI.
Widgets are most useful when they are reused across multiple pages, or when the page that they belong to has multiple large independent blocks, and this is one of them.

If a block of UI makes up most of the interesting content on a page, and is never reused, it should not be a widget, and instead it should be placed directly inside that page.

> **Tip**: If you're using a nested routing system (like the router of Remix), it may be helpful to use the Widgets layer in the same way as a flat routing system would use the Pages layer — to create full router blocks, complete with related data fetching, loading states, and error boundaries.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## 여러 페이지에서 재사용되는 큰 UI 블록을 Shared와 Widgets 중 어디에 놓아야 하는가?

### Official Answer
There's a caveat to putting large blocks of UI in Shared — the Shared layer is not supposed to know about any of the layers above.
Between Shared and Pages there are three other layers: Entities, Features, and Widgets.
Some projects may have something in those layers that they need in a large reusable block, and that means we can't put that reusable block in Shared, or else it would be importing from upper layers, which is prohibited.
That's where the Widgets layer comes in.
It is located above Shared, Entities, and Features, so it can use them all.

### Reference
- https://feature-sliced.design/docs/get-started/tutorial

---

## FSD에서 Entities와 Features의 핵심 차이는 무엇인가?
### Official Answer
An entity is a real-life concept that your app is working with.
A feature is an interaction that provides real-life value to your app's users, the thing people want to do with your entities.

Specifically for entities/ui, it is primarily meant to reuse the same appearance across several pages in the app, and different business logic may be attached to it through props or slots.

A crucial principle for using the Features layer effectively is: not everything needs to be a feature.
A good indicator that something needs to be a feature is the fact that it is reused on several pages.

### User Answer
- 엔티티는 명사, 개념, 데이터에 해당합니다. 따라서 데이터 타입, 타입을 가공하는 유틸리티, 데이터를 가져오는 GET API 호출 함수, 그리고 데이터를 단순히 보여주는 컴포넌트와 같은 코드들이 엔티티 레이어에 위치합니다.

- **엔티티의 UI는 '수동적'이어야 합니다.** 예를 들어 유저 카드 UI는 유저 정보를 보여주기만 해야 하며, '팔로우'나 '차단' 같은 구체적인 비즈니스 동작(Feature)은 포함하지 않고 상위 레이어에서 props나 slots를 통해 주입받아야 합니다.

- 피처는 동사, 액션, 기능에 해당합니다. 따라서 실제 기능이 포함된 컴포넌트나 Hooks, 그리고 GET 이외의 API 호출 함수 등이 피처 레이어에 위치합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## FSD에서 feature 슬라이스의 경계를 어떻게 판단하는가? 하나의 feature에 여러 기능이 들어가면 어떤 문제가 생기는가?

### Official Answer
One feature is one useful functionality for the user.
When several features are implemented in one feature, this is a violation of borders.
The feature can be indivisible and growing - and this is not bad.
Bad - when the feature does not answer the question "What is the business value for the user?"
There can be no "map-office" feature.
But booking-meeting-on-the-map, search-for-an-employee, change-of-workplace - yes.

### Reference
- https://feature-sliced.design/docs/about/understanding/needs-driven

---

## FSD에서 Entities 레이어를 만들지 않아도 되는가? 만든다면 언제 만들어야 하는가?

### Official Answer
It is completely fine for the application to have no entities layer.
It doesn't break FSD in any way, on the contrary, it simplifies the architecture and keeps the entities layer available for future scaling.

FSD 2.1 encourages deferred decomposition of slices instead of preemptive, and this approach also extends to entities layer.

Remember: the later you move code to the entities layer, the less dangerous your potential refactors will be — code in Entities may affect functionality of any slice on higher layers.

### Reference
- https://feature-sliced.design/docs/guides/issues/excessive-entities

---

## [UNVERIFIED] FSD에서 App과 Pages의 핵심 차이는 무엇인가?

---

## FSD에서 세그먼트란 무엇이며, 각 세그먼트의 역할은?
### Official Answer
Their purpose is to group code by its technical nature.

Make sure that the name of these segments describes the purpose of the content, not its essence.

For example, components, hooks, and types are bad segment names because they aren't that helpful when you're looking for code.

- **ui**: everything related to UI display: UI components, date formatters, styles, etc.
- **api**: backend interactions: request functions, data types, mappers, etc. / for code that handles rendering and appearance
- **model**: the data model: schemas, interfaces, stores, and business logic. / for storage and business logic
- **lib**: library code that other modules on this slice need. This folder should not be treated as helpers or utilities. Instead, every library in this folder should have one area of focus, for example, dates, colors, text manipulation, etc. That area of focus should be documented in a README file.

- **config**: configuration files and feature flags. / for feature flags, environment variables and other forms of configuration

---

## FSD 슬라이스에서 Public API의 역할과 리팩토링 지원 방식은?
### Official Answer
A public API is a contract between a group of modules, like a slice, and the code that uses it.
It also acts as a gate, only allowing access to certain objects, and only through that public API.
In practice, it's usually implemented as an index file with re-exports:

In the context of Feature-Sliced Design, the term public API refers to a slice or segment declaring what can be imported from it by other modules in the project.

For example, in JavaScript that can be an index.js file re-exporting objects from other files in the slice.

This enables freedom in refactoring code inside a slice as long as the contract with the outside world (i.e. the public API) stays the same.

The rest of the application must be protected from structural changes to the slice, like a refactoring.
Only the necessary parts of the slice should be exposed.

When they are in the same slice, always use relative imports and write the full import path.
When they are in different slices, always use absolute imports, for example, with an alias.

### User Answer
슬라이스나 세그먼트에서, 외부에 공개할 모듈만 따로 선택하기 위한 방법입니다.

### Reference
- https://feature-sliced.design/docs/get-started/tutorial
- https://feature-sliced.design/docs/reference/public-api

---

## FSD에서 Shared 레이어와 도메인 레이어의 Public API 전략은 어떻게 다른가?

### Official Answer
For the Shared layer that has no slices, it's usually more convenient to define a separate public API for each segment as opposed to defining one single index of everything in Shared.
This keeps imports from Shared naturally organized by intent.
For other layers that have slices, the opposite is true — it's usually more practical to define one index per slice and let the slice decide its own set of segments that is unknown to the outside world because other layers usually have a lot less exports.

### Reference
- https://feature-sliced.design/docs/get-started/tutorial

---

## FSD에서 Public API에 와일드카드 re-export를 피해야 하는 이유는?

### Official Answer
It may be tempting to create wildcard re-exports of everything, especially in early development of the slice, because any new objects you export from your files are also automatically exported from the slice:

This hurts the discoverability of a slice because you can't easily tell what the interface of this slice is.
Not knowing the interface means that you have to dig deep into the code of a slice to understand how to integrate it.
Another problem is that you might accidentally expose the module internals, which will make refactoring difficult if someone starts depending on them.

### Reference
- https://feature-sliced.design/docs/reference/public-api
