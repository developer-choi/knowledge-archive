---
tags: [fsd, segments, ui, api, model]
---

# Questions
- [What are segments in FSD, and what is the role of each one?](#what-are-segments-in-fsd-and-what-is-the-role-of-each-one)
- [Why should we avoid names like 'components' or 'hooks' in FSD?](#why-should-we-avoid-names-like-components-or-hooks-in-fsd)

---

# Answers

## What are segments in FSD, and what is the role of each one?
### Official Answer
Their purpose is to group code by its technical nature.
> AI Annotation
> - 개발에서 Technical Nature라는 표현은 코드를 바라보는 관점을 설명할 때 자주 사용됩니다. 
>   - 도메인 성격 (**Domain Nature**): 이 코드가 사용자에게 어떤 기능을 제공하는가? (예: 주문하기, 장바구니 담기) -> 이는 FSD에서 **Slice**가 담당합니다. 
>   - 기술적 성격 (**Technical Nature**): 이 코드가 소프트웨어 아키텍처 상에서 어떤 도구로 쓰이는가? (예: React 컴포넌트인가, Axios 함수인가, Redux 스토어인가) -> 이것이 바로 **Segment**가 담당하는 영역입니다.

- **ui**: everything related to UI display: UI components, date formatters, styles, etc.
> AI Annotation
> - 특정 UI를 표현하기 위해 보조적으로 사용되는 스타일 파일이나 포맷팅 함수도 여기에 포함됩니다.

- **api**: backend interactions: request functions, data types, mappers, etc. / for code that handles rendering and appearance
- **model**: the data model: schemas, interfaces, stores, and business logic. / for storage and business logic
- **lib**: library code that other modules on this slice need.
> AI Annotation
> - Slice 내부에서 공통적으로 사용되는 유틸리티 함수나 설정 코드 등을 모아두는 곳입니다.

- **config**: configuration files and feature flags. / for feature flags, environment variables and other forms of configuration

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## Why should we avoid names like 'components' or 'hooks' in FSD?
### Official Answer
The only important thing to remember when creating new segments is that segment names should describe purpose (the why), not essence (the what).

Names like "components", "hooks", "modals" should not be used because they describe what these files are, but don't help to navigate the code inside.

The problem manifests itself at least in violation of the principle of High Cohesion and excessive stretching of the axis of changes.

> AI Annotation:
> 
> **기존 방식 대비 차이점:**
> 1. **기존 방식**: auth 하나 바꾸려면 `components/auth`, `hooks/auth` 등등 여러 폴더를 왔다갔다 해야 함. 이는 응집도(Cohesion)가 낮은 상태임. 또한 영향 범위 파악이 어려움.
> 2. **FSD 방식**: `auth/` 하위에 `ui`, `hooks`, `api` 등이 모여 있어 응집도가 높음.
> 3. 또한 의존성 규칙이 일정하여 수정 시 영향 범위를 쉽게 파악할 수 있음. (예: `entities/auth/ui` 수정 시 그 아래 레이어에는 영향이 없음)

### Reference
- https://feature-sliced.design/docs/guides/issues/desegmented
- https://feature-sliced.design/docs/get-started/tutorial
