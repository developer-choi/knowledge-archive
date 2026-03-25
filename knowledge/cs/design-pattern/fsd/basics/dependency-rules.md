---
tags: [fsd, dependency, rules, unidirectional]
---

# Questions
- [Why is the unidirectional dependency rule important, and what happens if we violate it?](#why-is-the-unidirectional-dependency-rule-important-and-what-happens-if-we-violate-it)
  - [Why is it forbidden for a slice to reference another slice within the same layer?](#why-is-it-forbidden-for-a-slice-to-reference-another-slice-within-the-same-layer)
  - [FSD에서 같은 레이어의 엔티티끼리 타입을 참조해야 할 때 어떻게 하는가?](#fsd에서-같은-레이어의-엔티티끼리-타입을-참조해야-할-때-어떻게-하는가)
  - [FSD에서 인증 토큰을 Entities에 저장하면 어떤 아키텍처 문제가 발생하고, 어떻게 해결하는가?](#fsd에서-인증-토큰을-entities에-저장하면-어떤-아키텍처-문제가-발생하고-어떻게-해결하는가)

---

# Answers

## Why is the unidirectional dependency rule important, and what happens if we violate it?

### Official Answer
A module on one layer cannot use other modules on the same layer, or the layers above.

The key difference of Feature-Sliced Design from an unregulated code structure is that pages cannot reference each other.

This allows you to make isolated modifications without unforeseen consequences to the rest of the app.

> AI Annotation:
> - ❌ **Bad (Layer Violation)**: `entities/user` 슬라이스에서 상위 계층인 `features/auth`의 함수를 가져다 쓰는 경우. (하위 계층이 상위 계층을 알게 되면 순환 참조와 의존성 지옥이 시작됨)
> - ✅ **Good (Layer Flow)**: `pages/profile` -> `features/update-password` -> `entities/user` 순서로 호출. 의존성이 위에서 아래로만 흐르므로 각 계층을 독립적으로 테스트하고 교체하기 쉬움.

### Reference
https://feature-sliced.design/docs/get-started/overview

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

## FSD에서 같은 레이어의 엔티티끼리 타입을 참조해야 할 때 어떻게 하는가?

### Official Answer
You can make your types accept type arguments as slots for connections with other entities, and even impose constraints on those slots.

To make cross-imports between entities in FSD, you can use a special public API specifically for each slice that will be cross-importing.

By making explicit connections between entities, we stay on top of inter-dependencies and maintain a decent level of domain separation.

> Official Annotation: Cross-imports are a code smell: a warning sign that slices are becoming coupled.
> Before reaching for @x, consider whether the boundaries should be merged instead.
> Think of @x as an explicit gateway for unavoidable domain references—not a general-purpose reuse mechanism.
> Overuse tends to lock entity boundaries together and makes refactoring more costly over time.

> AI Annotation: 두 가지 해결책이 있다.
> 1. **제네릭 파라미터**: `Song<ArtistType extends { id: string }>`처럼 타입 파라미터로 연결을 느슨하게 만든다. 상위 레이어에서 `Song<Artist>`로 조립한다.
> 2. **@x 크로스 임포트**: `entities/song/@x/artist.ts`에서 artist가 가져갈 수 있는 것만 정의한다. `import type { Song } from "entities/song/@x/artist"`로 사용한다. `@x`는 "A crossed with B"라는 뜻이다.
> `@x` 폴더가 비대해지면 "이 엔티티가 너무 많은 곳에 연결되어 있다"는 경고 신호이므로, 먼저 엔티티를 합칠 수 있는지 검토해야 한다.

### Reference
- https://feature-sliced.design/docs/guides/tech/types
- https://feature-sliced.design/docs/guides/issues/cross-import

---

## FSD에서 인증 토큰을 Entities에 저장하면 어떤 아키텍처 문제가 발생하고, 어떻게 해결하는가?

### Official Answer
Since the API client is usually defined in shared/api or spreaded across the entities, the main challenge to this approach is making the token available to other requests that need it without breaking the import rule on layers:
A module (file) in a slice can only import other slices when they are located on layers strictly below.

There are several solutions to this challenge:
- Pass the token manually every time you make a request
- Expose the token to the entire app with a context or a global store like localStorage
- Inject the token into the API client every time it changes

> AI Annotation: API 클라이언트가 `shared/api`에 있고 토큰이 `entities/user`에 있으면, Shared → Entities 방향의 import가 필요한데 이는 하위 레이어가 상위 레이어를 참조하는 규칙 위반이다.
> - **수동 전달**: 가장 단순하지만 번거롭고, 미들웨어 패턴과 호환되지 않는다.
> - **Context/localStorage**: 토큰 접근 키만 `shared/api`에 두고, 실제 값은 상위 레이어가 채워 넣는다. 암묵적 의존이 생기지만 직접 import 위반은 피한다.
> - **반응형 주입**: 반응형 구독으로 토큰 변경 시 API 클라이언트를 자동 업데이트한다. 구독 설정은 App 레이어에서 한다.

### Reference
- https://feature-sliced.design/docs/guides/examples/auth
