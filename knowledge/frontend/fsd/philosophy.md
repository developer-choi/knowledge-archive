---
tags: [fsd, concept]
source: official
priority:
---

# Questions
- FSD에서 슬라이스란 무엇이며, 그 목적은?
  - FSD에서 'components'나 'hooks' 같은 이름을 피해야 하는 이유는?
  - [응집도란 무엇이며, 높이기 위한 모범 사례는? → `cohesion.md`](../../cs/software-engineering/principles/cohesion.md#응집도cohesion란-무엇인가)
  - [결합도란 무엇이며, 코드베이스에서 어떻게 측정하는가? → `coupling.md`](../../cs/software-engineering/principles/coupling.md#결합도coupling란-무엇인가)
- [UNVERIFIED] App과 Shared 레이어는 왜 슬라이스 레벨을 건너뛰는가?
- 도메인이란 무엇인가?
- FSD 공식 문서가 "변경에 최적화하지 말고, 삭제에 최적화하라"고 말하는 이유는 무엇인가?

---

# Answers

## FSD에서 슬라이스란 무엇이며, 그 목적은?

### Official Answer
Their main purpose is to group code by its meaning for the product, business, or just the application.
Slices are meant to be independent and highly cohesive groups of code files.
Slices make your codebase easier to navigate by keeping logically related modules close together.

Closely related slices can be structurally grouped in a folder, but they should exercise the same isolation rules as other slices — there should be no code sharing in that folder.

### Frequent Mistakes
- 기존 components, hooks 분류 방식은 한국어로 "기술적 유형" 단위에 해당한다.

### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://feature-sliced.design/docs/reference/slices-segments

---

## FSD에서 'components'나 'hooks' 같은 이름을 피해야 하는 이유는?
### Official Answer
The only important thing to remember when creating new segments is that segment names should describe purpose (the why), not essence (the what).

Names like “components”, “hooks”, “modals” should not be used because they describe what these files are, but don’t help to navigate the code inside.

The problem manifests itself at least in violation of the principle of High Cohesion and excessive stretching of the axis of changes.

Resist the temptation to create a shared/types folder, or to add a types segment to your slices.
The category “types” is similar to the category “components” or “hooks” in that it describes what the contents are, not what they are for.

Files can also be a source of desegmentation.
Files like types.ts can aggregate multiple domains, complicating navigation and future refactoring.
Avoid generic file names like types.ts, utils.ts, or helpers.ts.
Instead, use names that directly reflect the domain they represent.

### Frequent Mistakes
- 세그먼트 이름도 "기술적 유형"으로 짓는다고 답변했으나, 정확한 기준은 purpose (why) vs essence (what). `ui`는 목적(purpose), `components`는 본질(essence).

### Reference
- https://feature-sliced.design/docs/guides/issues/desegmented
- https://feature-sliced.design/docs/get-started/tutorial
- https://feature-sliced.design/docs/guides/examples/types

---

## [UNVERIFIED] App과 Shared 레이어는 왜 슬라이스 레벨을 건너뛰는가?

### Additional Answer
앱 전체에 걸쳐 쓰이거나, 비즈니스 색깔이 전혀 없는 전역적인(Global) 성격을 가집니다.
여기에 슬라이스를 만들면 오히려 구조가 너무 파편화되어 찾기가 더 힘들어집니다. (예: `shared/button/ui` 보다 `shared/ui/button`이 관리하기 훨씬 편함)

나머지 레이어는 비즈니스 로직을 담고있기 때문에, 도메인 기준으로 한번 나눠야합니다.

### Reference
- https://feature-sliced.design/docs/get-started/overview

---

## 도메인이란 무엇인가?

### Official Answer
Of primary importance is a domain of the software, the subject area to which the user applies a program.

### Reference
- https://en.wikipedia.org/wiki/Domain-driven_design

---

## FSD 공식 문서가 "변경에 최적화하지 말고, 삭제에 최적화하라"고 말하는 이유는 무엇인가?

### Official Answer
No need to optimize for changes - we can’t predict the future.
Better-optimize for deletion - based on the context that already exists.

### Reference
- https://feature-sliced.design/docs/about/understanding/architecture