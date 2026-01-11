---
tags: [fsd, concept, slice, cohesion, coupling]
---

# Questions
- [What is the slice?](#what-is-the-slice)
  - [Why should we divide a layer into multiple slices?](#why-should-we-divide-a-layer-into-multiple-slices)
  - [Why do the 'App' and 'Shared' layers skip the slice level, while other layers are required to have them?](#why-do-the-app-and-shared-layers-skip-the-slice-level-while-other-layers-are-required-to-have-them)
  - [Then, how should we handle it when two slices need to share the same logic?](#then-how-should-we-handle-it-when-two-slices-need-to-share-the-same-logic)
  - [What is cohesion, and what are some best practices to increase it?](#what-is-cohesion-and-what-are-some-best-practices-to-increase-it)
  - [What is coupling, and how can we effectively decrease it in our architecture?](#what-is-coupling-and-how-can-we-effectively-decrease-it-in-our-architecture)
- [Why should we avoid names like 'components' or 'hooks' in FSD?](#why-should-we-avoid-names-like-components-or-hooks-in-fsd)
- [[TODO] What’s the domain?](#todo-whats-the-domain)

---

# Answers

## What is the slice?

### Keywords
Slice, Domain

### Official Answer
Partition the code by business domain.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## Why should we divide a layer into multiple slices?

### Keywords
Navigation, Modules

### Official Answer
Slices make your codebase easier to navigate by keeping logically related modules close together.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## Why do the 'App' and 'Shared' layers skip the slice level, while other layers are required to have them?

### Keywords
Slice, Global, Domain

### Official Answer
> AI Annotation: 앱 전체에 걸쳐 쓰이거나, 비즈니스 색깔이 전혀 없는 전역적인(Global) 성격을 가집니다. 여기에 슬라이스를 만들면 오히려 구조가 너무 파편화되어 찾기가 더 힘들어집니다. (예: `shared/button/ui` 보다 `shared/ui/button`이 관리하기 훨씬 편함)
>
> 나머지 레이어는 비즈니스 로직을 담고있기 때문에, 도메인 기준으로 한번 나눠야합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## Then, how should we handle it when two slices need to share the same logic?

### Keywords
Shared Logic, Composition

### Official Answer
> AI Annotation:
> 1. **Shared 레이어로 내리기**: 만약 공유하려는 로직이 특정 비즈니스와 무관한 순수 유틸리티라면 Shared 레이어로 이동시킵니다.
> 2. **하위 레이어(Entities)로 내리기**: 두 Features가 동일한 데이터 모델을 공유한다면, 그 로직을 Entities 레이어의 관련 슬라이스로 옮깁니다.
> 3. **상위 레이어(Widgets/Pages)에서 조합**: 두 슬라이스를 직접 연결하지 말고, 상위 계층인 Widgets나 Pages에서 두 슬라이스를 각각 가져와서 로직을 조립(Composition)합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## What is cohesion, and what are some best practices to increase it?

### Keywords
Cohesion, SRP

### Official Answer
> AI Annotation:
> **Cohesion**은 쉽게 말해 "한 폴더(모듈) 안에 있는 코드들이 얼마나 친한가?"입니다.
> - **높은 응집도 (Good)**: 유저 관련 폴더 안에 유저 이름 변경, 유저 주소 수정 로직만 있는 경우. (모두 유저라는 목적에 집중)
> - **낮은 응집도 (Bad)**: 유저 폴더 안에 갑자기 상품 결제 로직이나 날씨 정보 유틸리티가 섞여 있는 경우. (서로 상관없는 코드들이 모여 있음)
>
> **측정 방법**:
> - **단일 책임 원칙 (SRP)**: 이 모듈이 "하나의 일"만 하는가? (목적이 하나라면 응집도가 높은 것)

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## What is coupling, and how can we effectively decrease it in our architecture?

### Keywords
Coupling, Dependency

### Official Answer
> AI Annotation:
> **Coupling**은 "한 모듈이 다른 모듈에 얼마나 의존하고 있는가?"입니다.
> - **낮은 결합도 (Good)**: A를 고쳐도 B가 안 깨짐. (독립적)
>
> **측정 방법**:
> - **의존성 개수**: 한 파일에서 import 해오는 다른 모듈의 개수를 세어봅니다. 너무 많으면 결합도가 높은 것입니다.
> - **Fan-in / Fan-out**:
>   - Fan-out: 내가 호출하는 다른 모듈의 수 (높을수록 복잡함)
>   - Fan-in: 나를 호출하는 다른 모듈의 수 (높을수록 공통화가 잘 됨)
> - **영향 범위**: 특정 함수의 파라미터를 바꿨을 때, 몇 개의 파일을 수정해야 하는지 확인합니다. (많을수록 결합도가 높은 것)

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## Why should we avoid names like 'components' or 'hooks' in FSD?
### Official Answer
The only important thing to remember when creating new segments is that segment names should describe purpose (the why), not essence (the what).

Names like “components”, “hooks”, “modals” should not be used because they describe what these files are, but don’t help to navigate the code inside.

The problem manifests itself at least in violation of the principle of High Cohesion and excessive stretching of the axis of changes.

> AI Annotation:
> 
> **기존 방식 대비 차이점:**
> 1. **기존 방식**: auth 하나 바꾸려면 `components/auth`, `hooks/auth` 등등 여러 폴더를 왔다갔다 해야 함. 이는 응집도(Cohesion)가 낮은 상태임. 또한 영향 범위 파악이 어려움.
> 2. **FSD 방식**: `auth/` 하위에 `ui`, `hooks`, `api` 등이 모여 있어 응집도가 높음.
> 3. 또한 의존성 규칙이 일정하여 수정 시 영향 범위를 쉽게 파악할 수 있음. (예: `entities/auth/ui` 수정 시 그 아래 레이어에는 영향이 없음)

### Reference
- https://feature-sliced.design/docs/guides/issues/desegmented

---

## [TODO] What’s the domain?
### Keywords

### Official Answer

### Reference
