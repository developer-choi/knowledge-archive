---
tags: [fsd, concept]
---

# Questions
- FSD에서 슬라이스란 무엇이며, 그 목적은?
  - FSD에서 'components'나 'hooks' 같은 이름을 피해야 하는 이유는?
  - [응집도란 무엇이며, 높이기 위한 모범 사례는? → `cohesion.md`](../../cs/software-engineering/principles/cohesion.md#응집도cohesion란-무엇인가)
  - [결합도란 무엇이며, 코드베이스에서 어떻게 측정하는가? → `coupling.md`](../../cs/software-engineering/principles/coupling.md#결합도coupling란-무엇인가)
- App과 Shared 레이어는 왜 슬라이스 레벨을 건너뛰는가?
- 도메인이란 무엇인가?
- FSD 공식 문서가 "변경에 최적화하지 말고, 삭제에 최적화하라"고 말하는 이유는 무엇인가?

---

# Answers

## FSD에서 슬라이스란 무엇이며, 그 목적은?

### Official Answer
Their main purpose is to group code by its meaning for the product, business, or just the application.
Slices are meant to be independent and highly cohesive groups of code files.
Slices make your codebase easier to navigate by keeping logically related modules close together.

> #### Official Annotation: Closely related slices can be structurally grouped in a folder, but they should exercise the same isolation rules as other slices — there should be no code sharing in that folder.

> #### AI Annotation: `features/post/` 폴더 안에 `compose`, `like`, `delete` 슬라이스를 묶을 수 있지만, 그 폴더에 `some-shared-code.ts` 같은 공유 코드를 넣으면 안 된다.
> 공유 코드가 필요하면 하위 레이어(Entities, Shared)로 내려야 한다.
> 폴더는 순수한 구조적 그룹핑이지, 코드 공유의 경로가 되면 안 된다.

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

> #### AI Annotation:
> 
> **기존 방식 대비 차이점:**
> 1. **기존 방식**: auth 하나 바꾸려면 `components/auth`, `hooks/auth` 등등 여러 폴더를 왔다갔다 해야 함. 이는 응집도(Cohesion)가 낮은 상태임. 또한 영향 범위 파악이 어려움.
> 2. **FSD 방식**: `auth/` 하위에 `ui`, `hooks`, `api` 등이 모여 있어 응집도가 높음.
> 3. 또한 의존성 규칙이 일정하여 수정 시 영향 범위를 쉽게 파악할 수 있음. (예: `entities/auth/ui` 수정 시 그 아래 레이어에는 영향이 없음)

> #### Official Annotation: Resist the temptation to create a shared/types folder, or to add a types segment to your slices.
> The category "types" is similar to the category "components" or "hooks" in that it describes what the contents are, not what they are for.

> #### Official Annotation: Files can also be a source of desegmentation.
> Files like types.ts can aggregate multiple domains, complicating navigation and future refactoring.
> Avoid generic file names like types.ts, utils.ts, or helpers.ts.
> Instead, use names that directly reflect the domain they represent.

### Frequent Mistakes
- 세그먼트 이름도 "기술적 유형"으로 짓는다고 답변했으나, 정확한 기준은 purpose (why) vs essence (what). `ui`는 목적(purpose), `components`는 본질(essence).

### Reference
- https://feature-sliced.design/docs/guides/issues/desegmented
- https://feature-sliced.design/docs/get-started/tutorial
- https://feature-sliced.design/docs/guides/examples/types

---

## App과 Shared 레이어는 왜 슬라이스 레벨을 건너뛰는가?

### AI Answer
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

> #### AI Annotation: "변경에 유연하게 설계하라"는 흔한 아키텍처 조언과 정반대 방향이다.
> 미래를 예측할 수 없으니 변경을 대비한 추상화는 과잉 설계가 되기 쉽다.
> 대신, 현재 맥락에서 코드를 쉽게 들어낼 수 있게 만들면 된다.
> FSD에서 슬라이스가 격리되어 있으면 해당 슬라이스 폴더를 통째로 삭제해도 다른 곳이 깨지지 않는다.

### Reference
- https://feature-sliced.design/docs/about/understanding/architecture