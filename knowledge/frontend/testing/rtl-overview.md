---
tags: [testing, react, concept]
---
# Questions
- React Testing Library와 DOM Testing Library의 관계는?
- RTL은 컴포넌트의 무엇을 대상으로 테스트하는가?
- RTL의 trade-offs는 무엇이며 simulated browser 환경의 한계는 무엇인가?
- 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?
- AAA 패턴이란 무엇이며 각 단계에서 RTL은 어떤 API를 제공하는가?

---

# Answers

## React Testing Library와 DOM Testing Library의 관계는?

### Official Answer
React Testing Library builds on top of DOM Testing Library by adding APIs for working with React components.

It provides light utility functions on top of react-dom and react-dom/test-utils, in a way that encourages better testing practices.

This library is built on top of DOM Testing Library which is where most of the logic behind the queries is.

> #### AI Annotation:
> RTL은 DOM Testing Library를 래핑하여 React 컴포넌트 전용 API(render 등)를 추가한 얇은 층이다.
> 쿼리(getByRole, getByText 등)의 핵심 로직은 DOM Testing Library에 있다.

### Reference
- https://github.com/testing-library/react-testing-library
- https://testing-library.com/docs/dom-testing-library/intro

---

## RTL은 컴포넌트의 무엇을 대상으로 테스트하는가?

### Official Answer
So rather than dealing with instances of rendered React components, your tests will work with actual DOM nodes.

> #### Key Terms:
> - **instances**: React가 내부적으로 관리하는 컴포넌트 객체 (state, props를 가진 JS 객체)
> - **DOM nodes**: 브라우저에 실제로 렌더된 HTML 요소

> #### AI Annotation:
> RTL은 컴포넌트 인스턴스의 내부 상태(state)나 메서드가 아니라, 실제 렌더된 DOM 노드를 대상으로 테스트한다.
> 이는 "사용자가 보는 것"에 가까운 테스트를 작성하도록 유도한다.

### Reference
- https://github.com/testing-library/react-testing-library

---

## RTL의 trade-offs는 무엇이며 simulated browser 환경의 한계는 무엇인가?

### Official Answer
We are making some trade-offs here because we're using a computer and often a simulated browser environment.

> #### Key Terms:
> - **simulated browser**: jsdom처럼 실제 브라우저가 아닌 JS로 구현된 가짜 브라우저 환경

> #### AI Annotation:
> 실제 브라우저가 아닌 jsdom 같은 simulated 환경에서 돌리므로, 레이아웃·페인트·실제 네트워크·브라우저별 quirk는 검증할 수 없다.
> 이 한계를 감수하는 대신 테스트 속도와 CI 통합을 얻는다.

### Reference
- https://github.com/testing-library/react-testing-library

---

## 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

### Official Answer
We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing window.fetch, or relying on third-party adapters.

> #### Key Terms:
> - **declaratively**: 어떻게가 아니라 무엇을 선언하는 방식 (HTTP 핸들러 정의)
> - **stubbing**: 원래 함수를 가짜로 바꿔치기하는 방식

> #### AI Annotation:
> window.fetch를 stub하면 axios 같은 다른 HTTP 클라이언트를 쓸 때 깨지고, 네트워크 레벨이 아닌 함수 레벨에서 가로채므로 실제 요청 흐름과 달라진다.
> MSW는 Service Worker로 네트워크 레벨에서 가로채므로 선언적이고, 클라이언트 구현에 독립적이다.

### Reference
- https://github.com/testing-library/react-testing-library
- https://github.com/mswjs/msw

---

## AAA 패턴이란 무엇이며 각 단계에서 RTL은 어떤 API를 제공하는가?

### Official Answer
**Step 1. Arrange** — The render method renders a React element into the DOM.

**Step 2. Act** — The fireEvent method allows you to fire events to simulate user actions.

**Step 3. Assert** — (테스트 결과가 기대와 일치하는지 단언한다.)

> #### AI Annotation:
> AAA는 Arrange-Act-Assert의 약자로, 테스트를 3단계로 구조화하는 패턴이다.
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
