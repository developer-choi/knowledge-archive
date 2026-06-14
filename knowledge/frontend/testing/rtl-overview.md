---
tags: [testing, react, concept]
source: official
priority:
---
# Questions
- RTL의 trade-offs는 무엇이며 simulated browser 환경의 한계는 무엇인가?
- AAA 패턴이란 무엇이며 각 단계에서 RTL은 어떤 API를 제공하는가?
- React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?

---

# Answers

## RTL의 trade-offs는 무엇이며 simulated browser 환경의 한계는 무엇인가?

### Official Answer
We are making some trade-offs here because we're using a computer and often a simulated browser environment.

> #### AI Annotation:
> 실제 브라우저가 아닌 jsdom 같은 simulated 환경에서 돌리므로, 레이아웃·페인트·실제 네트워크·브라우저별 quirk는 검증할 수 없다.
> 이 한계를 감수하는 대신 테스트 속도와 CI 통합을 얻는다.

### Reference
- https://github.com/testing-library/react-testing-library

---

## AAA 패턴이란 무엇이며 각 단계에서 RTL은 어떤 API를 제공하는가?

### Official Answer
**Step 1. Arrange** — The render method renders a React element into the DOM.

**Step 2. Act** — The fireEvent method allows you to fire events to simulate user actions.

> #### AI Annotation:
> AAA는 Arrange-Act-Assert의 약자로, 테스트를 3단계로 구조화하는 패턴이다.
> RTL은 Arrange·Act 단계의 API만 제공하고, Assert 단계는 RTL 자체 기능이 아니라 Jest의 `expect`로 검증한다.
> RTL에서의 매핑은 다음과 같다.
>
> | 단계 | 역할 | RTL API |
> |---|---|---|
> | Arrange | 테스트 대상 준비·렌더 | `render` |
> | Act | 사용자 동작 시뮬레이션 | `fireEvent` (또는 `@testing-library/user-event`) |
> | Assert | 결과 검증 | `expect` (Jest) + RTL 쿼리 (`getByRole` 등) |

### Reference
- https://testing-library.com/docs/react-testing-library/api#render
- https://testing-library.com/docs/dom-testing-library/api-events
- https://testing-library.com/docs/react-testing-library/faq

---

## React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?

### Official Answer
Following the guiding principle of this library, it is useful to break down how tests are organized around how the user experiences and interacts with application functionality rather than around specific components themselves.
In some cases, for example for reusable component libraries, it might be useful to include developers in the list of users to test for and test each of the reusable components individually.
Other times, the specific break down of a component tree is just an implementation detail and testing every component within that tree individually can cause issues (see https://kentcdodds.com/blog/avoid-the-test-user).

In practice this means that it is often preferable to test high enough up the component tree to simulate realistic user interactions.
The question of whether it is worth additionally testing at a higher or lower level on top of this comes down to a question of tradeoffs and what will provide enough value for the cost (see https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests on more info on different levels of testing).

### Reference
- https://testing-library.com/docs/react-testing-library/faq
