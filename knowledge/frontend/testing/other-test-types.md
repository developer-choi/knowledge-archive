---
tags: [testing, concept]
source: official
priority:
---
# Questions
- Static test란 무엇인가?
- Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?

---

# Answers

## Static test란 무엇인가?

### Official Answer
Static: Catch typos and type errors as you write the code.

In particular, static analysis tools are incapable of giving you confidence in your business logic.

> #### AI Annotation:
> Testing Trophy의 가장 아래에 위치한다.
> ESLint, TypeScript 같은 도구가 코드를 실행하지 않고도 문법 오류, 타입 불일치, 무한루프 등을 잡아준다.
> 테스트를 작성할 필요조차 없다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?

### Official Answer
Snapshot Testing involves capturing the rendered output of a component and saving it to a snapshot file.
When tests run, the current rendered output of the component is compared against the saved snapshot.
Changes in the snapshot are used to indicate unexpected changes in behavior.

> #### AI Annotation:
> Snapshot Testing은 Unit / Integration / E2E와 같은 "테스트 범위" 축이 아니라, 그 위에서 보조로 쓰이는 검증 방식이다.
> 컴포넌트의 렌더 결과를 스냅샷 파일에 저장해두고, 이후 실행에서 의도치 않은 변화가 생겼는지 비교한다.

### Reference
- https://nextjs.org/docs/app/guides/testing
