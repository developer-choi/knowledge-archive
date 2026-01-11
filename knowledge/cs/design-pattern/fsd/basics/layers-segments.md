---
tags: [fsd, architecture, layers, responsibility]
---

# Questions
- [What is the purpose of layers in FSD, and what is the responsibility of each layer?](#what-is-the-purpose-of-layers-in-fsd-and-what-is-the-responsibility-of-each-layer)
  - [When should we use the 'Widgets' layer, and when should we avoid it?](#when-should-we-use-the-widgets-layer-and-when-should-we-avoid-it)
  - [What is the key difference between 'Entities' and 'Features' in FSD?](#what-is-the-key-difference-between-entities-and-features-in-fsd)
  - [[TODO] What is the key difference between 'App' and 'Pages' in FSD?](#todo-what-is-the-key-difference-between-app-and-pages-in-fsd)
- [What are segments in FSD, and what is the role of each one?](#what-are-segments-in-fsd-and-what-is-the-role-of-each-one)
- [What is the role of the Public API in an FSD slice, and how does it support refactoring?](#what-is-the-role-of-the-public-api-in-an-fsd-slice-and-how-does-it-support-refactoring)
- [Why should I avoid using wildcard re-exports in a public API within FSD?](#why-should-i-avoid-using-wildcard-re-exports-in-a-public-api-within-fsd)

---

# Answers

## What is the purpose of layers in FSD, and what is the responsibility of each layer?

### Keywords
FSD, Layers, Responsibility, Dependency

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
### Keywords
Widgets, Reusability, Composition

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
An entity is a real-life concept that your app is working with. A feature is an interaction that provides real-life value to your app’s users, the thing people want to do with your entities.

Specifically for entities/ui, it is primarily meant to reuse the same appearance across several pages in the app, and different business logic may be attached to it through props or slots.

> User Annotation
> - 엔티티는 명사, 개념, 데이터에 해당합니다. 따라서 데이터 타입, 타입을 가공하는 유틸리티, 데이터를 가져오는 GET API 호출 함수, 그리고 데이터를 단순히 보여주는 컴포넌트와 같은 코드들이 엔티티 레이어에 위치합니다.
> - **엔티티의 UI는 '수동적'이어야 합니다.** 예를 들어 유저 카드 UI는 유저 정보를 보여주기만 해야 하며, '팔로우'나 '차단' 같은 구체적인 비즈니스 동작(Feature)은 포함하지 않고 상위 레이어에서 props나 slots를 통해 주입받아야 합니다.
> - 피처는 동사, 액션, 기능에 해당합니다. 따라서 실제 기능이 포함된 컴포넌트나 Hooks, 그리고 GET 이외의 API 호출 함수 등이 피처 레이어에 위치합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/layers

---

## [TODO] What is the key difference between 'App' and 'Pages' in FSD?
### Keywords

### Official Answer

### Reference

---

## What are segments in FSD, and what is the role of each one?
### Official Answer
Their purpose is to group code by its technical nature.
> AI Anotation
> - 개발에서 Technical Nature라는 표현은 코드를 바라보는 관점을 설명할 때 자주 사용됩니다. 
>   - 도메인 성격 (**Domain Nature**): 이 코드가 사용자에게 어떤 기능을 제공하는가? (예: 주문하기, 장바구니 담기) -> 이는 FSD에서 **Slice**가 담당합니다. 
>   - 기술적 성격 (**Technical Nature**): 이 코드가 소프트웨어 아키텍처 상에서 어떤 도구로 쓰이는가? (예: React 컴포넌트인가, Axios 함수인가, Redux 스토어인가) -> 이것이 바로 **Segment**가 담당하는 영역입니다.

Make sure that the name of these segments describes the purpose of the content, not its essence.

For example, components, hooks, and types are bad segment names because they aren't that helpful when you're looking for code.

- **ui**: everything related to UI display: UI components, date formatters, styles, etc.
> AI Annotation
> - 특정 UI를 표현하기 위해 보조적으로 사용되는 스타일 파일이나 포맷팅 함수도 여기에 포함됩니다.

- **api**: backend interactions: request functions, data types, mappers, etc. / for code that handles rendering and appearance
- **model**: the data model: schemas, interfaces, stores, and business logic. / for storage and business logic
- **lib**: library code that other modules on this slice need.
> AI Annotation
> - Slice 내부에서 공통적으로 사용되는 유틸리티 함수나 설정 코드 등을 모아두는 곳입니다.

- **config**: configuration files and feature flags. / for feature flags, environment variables and other forms of configuration

---

## What is the role of the Public API in an FSD slice, and how does it support refactoring?
### Official Answer
A public API is a contract between a group of modules, like a slice, and the code that uses it.
It also acts as a gate, only allowing access to certain objects, and only through that public API.
In practice, it's usually implemented as an index file with re-exports:

In the context of Feature-Sliced Design, the term public API refers to a slice or segment declaring what can be imported from it by other modules in the project.

For example, in JavaScript that can be an index.js file re-exporting objects from other files in the slice.

This enables freedom in refactoring code inside a slice as long as the contract with the outside world (i.e. the public API) stays the same.

The rest of the application must be protected from structural changes to the slice, like a refactoring.
Only the necessary parts of the slice should be exposed.

> 내 해석
> 슬라이스나 세그먼트에서, 외부에 공개할 모듈만 따로 선택하기 위한 방법입니다.

### Reference
- https://feature-sliced.design/docs/get-started/tutorial
- https://feature-sliced.design/docs/reference/public-api

---

## Why should I avoid using wildcard re-exports in a public API within FSD?

### Keywords
Wildcard Re-export, Discoverability, Interface, Encapsulation

### Official Answer
It may be tempting to create wildcard re-exports of everything, especially in early development of the slice, because any new objects you export from your files are also automatically exported from the slice:

This hurts the discoverability of a slice because you can't easily tell what the interface of this slice is.
Not knowing the interface means that you have to dig deep into the code of a slice to understand how to integrate it.
Another problem is that you might accidentally expose the module internals, which will make refactoring difficult if someone starts depending on them.

### Reference
- https://feature-sliced.design/docs/reference/public-api