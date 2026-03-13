---
tags: [fsd, concept, cohesion, coupling, dependency, public-api]
---

# Questions
- [What is cohesion, and what are some best practices to increase it?](#what-is-cohesion-and-what-are-some-best-practices-to-increase-it)
- [What is coupling, and how can we effectively decrease it in our architecture?](#what-is-coupling-and-how-can-we-effectively-decrease-it-in-our-architecture)
- [Why is the unidirectional dependency rule important, and what happens if we violate it?](#why-is-the-unidirectional-dependency-rule-important-and-what-happens-if-we-violate-it)
- [What is the role of the Public API in an FSD slice, and how does it support refactoring?](#what-is-the-role-of-the-public-api-in-an-fsd-slice-and-how-does-it-support-refactoring)
  - [Why should I avoid using wildcard re-exports in a public API within FSD?](#why-should-i-avoid-using-wildcard-re-exports-in-a-public-api-within-fsd)
- [TODO] What's the domain?

---

# Answers

## What is cohesion, and what are some best practices to increase it?

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

## Why is the unidirectional dependency rule important, and what happens if we violate it?

### Official Answer
A module on one layer cannot use other modules on the same layer, or the layers above.

The key difference of Feature-Sliced Design from an unregulated code structure is that pages cannot reference each other.

This allows you to make isolated modifications without unforeseen consequences to the rest of the app.

> AI Annotation:
> - ❌ **Bad (Layer Violation)**: `entities/user` 슬라이스에서 상위 계층인 `features/auth`의 함수를 가져다 쓰는 경우. (하위 계층이 상위 계층을 알게 되면 순환 참조와 의존성 지옥이 시작됨)
> - ✅ **Good (Layer Flow)**: `pages/profile` -> `features/update-password` -> `entities/user` 순서로 호출. 의존성이 위에서 아래로만 흐르므로 각 계층을 독립적으로 테스트하고 교체하기 쉬움.

### Reference
- https://feature-sliced.design/docs/get-started/overview

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

### Official Answer
It may be tempting to create wildcard re-exports of everything, especially in early development of the slice, because any new objects you export from your files are also automatically exported from the slice:

This hurts the discoverability of a slice because you can't easily tell what the interface of this slice is.
Not knowing the interface means that you have to dig deep into the code of a slice to understand how to integrate it.
Another problem is that you might accidentally expose the module internals, which will make refactoring difficult if someone starts depending on them.

### Reference
- https://feature-sliced.design/docs/reference/public-api

---

## [TODO] What's the domain?
### Official Answer

### Reference
