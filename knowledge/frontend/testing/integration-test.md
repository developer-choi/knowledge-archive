---
tags: [testing, concept]
source: official
priority:
---
# Questions
- Integration test란 무엇인가?
- Integration test의 장점과 단점은?

---

# Answers

## Integration test란 무엇인가?

### Official Answer
Integration: Verify that several units work together in harmony.

The idea behind integration tests is to mock as little as possible.

Integration Testing involves testing how multiple units work together.
This can be a combination of components, hooks, and functions.

> #### AI Annotation:
> Testing Trophy에서 가장 큰 비중을 차지한다.
> 여러 단위가 함께 동작하는지를 검증하며, 앱의 모든 Provider를 감싸 실제 환경과 최대한 비슷하게 렌더링한다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
- https://nextjs.org/docs/app/guides/testing

---

## Integration test의 장점과 단점은?

### Official Answer
The size of these forms of testing on the trophy is relative to the amount of focus you should give them when testing your applications (in general).

The idea behind integration tests is to mock as little as possible.

> #### AI Annotation:
> 장점 — 비용·속도와 자신감 사이의 최적 균형점.
> unit보다 테스트 1개당 자신감이 높으면서, E2E보다 빠르고 저렴하다.
> mock을 최소화하므로 실제 동작에 가깝다.
>
> 단점 — unit보다는 느리고, 실패 시 원인 추적이 unit보다 어렵다.
> 실제 백엔드 연동 문제는 잡을 수 없다.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
