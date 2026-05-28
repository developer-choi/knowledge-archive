# React Testing Library와 DOM Testing Library의 관계는?

## 도입

React Testing Library(RTL)는 독립적으로 만들어진 라이브러리가 아니다. 테스트 쿼리의 핵심 로직은 DOM Testing Library에 있고, RTL은 그 위에 React 전용 API(`render` 등)를 얇게 얹은 구조다. 레이어를 이해하면 `getByRole`, `getByText` 같은 쿼리가 왜 React 전용이 아닌지 명확해진다.

---

## 본문

> React Testing Library builds on top of DOM Testing Library by adding APIs for working with React components.

"React Testing Library는 DOM Testing Library 위에 React 컴포넌트 작업을 위한 API를 추가하여 구축된다."

- **builds on top of**: 기반 라이브러리를 그대로 사용하면서 위에 레이어를 추가하는 구조. RTL은 DOM Testing Library를 대체하는 게 아니라 감싼다.

> It provides light utility functions on top of react-dom and react-dom/test-utils, in a way that encourages better testing practices.

"react-dom과 react-dom/test-utils 위에 가벼운 유틸리티 함수를 제공하며, 더 나은 테스트 관행을 유도하는 방식으로 설계되어 있다."

- **light utility functions**: 무거운 추상화 없이 최소한의 함수만 제공한다. RTL이 의도적으로 얇은 이유 — 두꺼운 API가 많아질수록 구현 세부사항을 테스트하고 싶어지기 때문이다.
- **encourages**: 강제하지 않고 유도한다. RTL은 올바른 방향을 열어두되, 잘못된 방향도 막지 않는다.

> This library is built on top of DOM Testing Library which is where most of the logic behind the queries is.

"이 라이브러리는 DOM Testing Library 위에 구축되어 있으며, 쿼리 뒤의 로직 대부분은 DOM Testing Library에 있다."

- **most of the logic behind the queries**: `getByRole`, `getByText`, `findByLabelText` 같은 쿼리의 실제 탐색 알고리즘은 DOM Testing Library가 구현한다. RTL은 이를 React용으로 연결할 뿐이다.

```
DOM Testing Library          (쿼리 로직: getByRole, getByText, ...)
        ↑
React Testing Library        (React 전용: render, screen, act, ...)
        ↑
사용자 테스트 코드
```

---

## 종합

RTL을 쓰면 쿼리 API를 React가 없는 환경에도 재사용할 수 있는 이유가 이 레이어 구조 때문이다. `getByRole`이 React 내부 상태를 모르고 DOM 노드만 보는 것도 이 때문이다. RTL 없이 `react-dom/test-utils`만 쓰면 컴포넌트 인스턴스를 직접 조작하는 유혹에 빠지기 쉬운데, RTL은 그 API를 감춰 DOM 기반 테스트를 자연스럽게 유도한다. QA가 마우스로 클릭하듯 DOM 노드를 찾아 상호작용하는 것이 RTL이 지향하는 테스트 방식이다.

---

---

# RTL은 컴포넌트의 무엇을 대상으로 테스트하는가?

## 도입

RTL 이전에는 컴포넌트 인스턴스(React가 내부적으로 관리하는 JS 객체)를 직접 건드려 state나 메서드를 확인하는 테스트가 일반적이었다. RTL은 그 방식을 거부하고, 실제 브라우저에 렌더된 DOM 노드를 대상으로 삼는다.

---

## 본문

> So rather than dealing with instances of rendered React components, your tests will work with actual DOM nodes.

"렌더된 React 컴포넌트의 인스턴스를 다루는 대신, 테스트는 실제 DOM 노드와 함께 동작한다."

- **instances of rendered React components**: React가 내부적으로 생성하는 컴포넌트 객체. `state`, `setState`, 라이프사이클 메서드 등이 여기 달려 있다. 이것을 직접 조작하면 사용자가 실제로 보는 것과 다른 레이어를 테스트하게 된다.
- **actual DOM nodes**: `document.querySelector`로 찾을 수 있는 실제 HTML 요소들. 사용자가 브라우저에서 보는 것, 스크린리더가 읽는 것이 바로 이 노드다.

```ts
// 인스턴스 방식 (RTL이 지양하는 방식)
wrapper.instance().setState({ open: true });
expect(wrapper.state('open')).toBe(true);

// DOM 방식 (RTL이 지향하는 방식)
await userEvent.click(screen.getByRole('button', { name: '열기' }));
expect(screen.getByRole('dialog')).toBeInTheDocument();
```

---

## 종합

인스턴스를 테스트하면 "React 내부 상태가 올바른가"를 검증한다. DOM 노드를 테스트하면 "사용자가 보는 화면이 올바른가"를 검증한다. 둘은 대부분 같은 결과를 가리키지만, 리팩토링할 때 차이가 드러난다. 상태 관리 방식을 `useState`에서 `useReducer`로 바꿔도 DOM 결과가 같다면 RTL 테스트는 통과하고, 인스턴스 기반 테스트는 깨진다.

---

---

# RTL의 trade-offs는 무엇이며 simulated browser 환경의 한계는 무엇인가?

## 도입

RTL은 실제 Chrome이 아닌 jsdom(JavaScript로 구현된 가상 브라우저)에서 동작한다. 테스트가 빠르고 CI에서 실행 가능한 이유가 이 때문인데, 그 대신 실제 브라우저에서만 확인할 수 있는 것들은 검증할 수 없다.

---

## 본문

> We are making some trade-offs here because we're using a computer and often a simulated browser environment.

"우리는 컴퓨터와 종종 시뮬레이션된 브라우저 환경을 사용하기 때문에 여기서 일부 트레이드오프를 감수하고 있다."

- **trade-offs**: 한쪽을 얻으면 다른 쪽을 잃는 교환 관계. jsdom을 쓰면 속도와 편의를 얻는 대신 브라우저 정확도를 잃는다.
- **simulated browser environment**: jsdom처럼 Node.js 위에서 DOM API를 흉내 내는 환경. 실제 브라우저가 없으므로 레이아웃 계산, GPU 페인팅, 실제 스크롤, 브라우저별 quirk가 동작하지 않는다.

jsdom에서 테스트할 수 없는 것들:
```
확인 불가
├── CSS 레이아웃 (실제 픽셀 위치, overflow, z-index 겹침)
├── 애니메이션·트랜지션
├── 실제 네트워크 요청 (MSW로 보완)
└── 브라우저별 동작 차이 (Safari scroll, IE 폴리필 등)
```

---

## 종합

jsdom의 한계는 RTL의 결함이 아니라 의식적으로 선택한 트레이드오프다. 로직·상태·사용자 흐름 검증에는 jsdom으로 충분하고 훨씬 빠르다. 시각적 정확도가 중요한 영역은 Playwright/Cypress 같은 실제 브라우저 기반 E2E로 보완한다. 두 도구를 조합하는 것이 실무 전략이다.

---

---

# 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

## 도입

네트워크 요청을 테스트에서 제어할 때 가장 손쉬운 방법은 `window.fetch`를 가짜 함수로 교체하는 것이다. 그러나 이 방식은 구현 세부사항에 의존하기 때문에 HTTP 클라이언트를 바꾸거나 환경이 달라지면 테스트가 깨진다. MSW는 네트워크 레벨에서 요청을 가로채 이 문제를 피한다.

---

## 본문

> We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing window.fetch, or relying on third-party adapters.

"우리는 window.fetch를 stub하거나 서드파티 어댑터에 의존하는 대신, MSW 라이브러리를 사용하여 테스트에서 API 통신을 선언적으로 모킹할 것을 권장한다."

- **declaratively**: 어떻게(how) 가로채는지가 아니라 무엇을(what) 응답할지만 선언한다. `http.get('/api/user', () => HttpResponse.json({ name: 'Kim' }))`처럼 핸들러만 정의하면 된다.
- **stubbing**: 원래 함수를 가짜 구현으로 바꿔치기하는 기법. `window.fetch = jest.fn()`이 전형적인 예. 구현 세부사항에 직접 결합된다.

```
window.fetch stubbing
  → axios로 교체하면 테스트 전부 깨짐
  → 함수 레벨에서 가로채 — 실제 요청 흐름과 다름

MSW
  → Service Worker / Node 인터셉터로 네트워크 레벨 가로채기
  → fetch든 axios든 상관없음
  → 브라우저 개발 환경과 Jest 환경 모두 동일한 핸들러 재사용
```

---

## 종합

`window.fetch`를 stub하면 테스트가 구현 세부사항(어떤 HTTP 함수를 쓰는가)에 종속된다. MSW는 HTTP 핸들러를 선언해두면 RTL 테스트와 실제 브라우저 개발 환경 모두에서 재사용할 수 있다. `axios`를 `ky`로 교체해도, 서버 URL을 바꿔도 핸들러만 수정하면 된다. 네트워크를 가장 현실에 가깝게 시뮬레이션하면서도 실제 서버 의존성을 제거하는 최선책이다.

---

---

# AAA 패턴이란 무엇이며 각 단계에서 RTL은 어떤 API를 제공하는가?

## 도입

테스트를 구조화하는 방식 중 가장 널리 쓰이는 것이 AAA(Arrange-Act-Assert) 패턴이다. 준비 → 행동 → 검증이라는 세 단계를 명확히 분리하면 테스트의 의도를 빠르게 파악할 수 있다. RTL은 이 세 단계에 각각 대응하는 API를 제공한다.

---

## 본문

> **Step 1. Arrange** — The render method renders a React element into the DOM.

"Arrange 단계 — render 메서드가 React 엘리먼트를 DOM에 렌더링한다."

- **render**: 컴포넌트를 jsdom에 마운트하는 RTL의 핵심 API. `render(<Button onClick={fn}>제출</Button>)`처럼 사용한다.

> **Step 2. Act** — The fireEvent method allows you to fire events to simulate user actions.

"Act 단계 — fireEvent 메서드는 이벤트를 발생시켜 사용자 동작을 시뮬레이션한다."

- **fireEvent**: 저수준 DOM 이벤트를 발생시킨다. 실제 사용자 인터랙션(포커스 이동, 타이핑 딜레이)까지 시뮬레이션하려면 `@testing-library/user-event`의 `userEvent`를 사용한다.

> **Step 3. Assert** — 테스트 결과가 기대와 일치하는지 단언한다.

- 검증은 Jest의 `expect`와 RTL의 쿼리(`getByRole`, `getByText` 등)를 조합한다. `expect(screen.getByText('완료')).toBeInTheDocument()`가 전형적인 형태다.

```ts
import { render, screen, fireEvent } from '@testing-library/react';

test('버튼 클릭 시 메시지 표시', () => {
  // Arrange
  render(<SubmitButton />);

  // Act
  fireEvent.click(screen.getByRole('button', { name: '제출' }));

  // Assert
  expect(screen.getByText('제출 완료')).toBeInTheDocument();
});
```

```
단계     역할                      RTL API
------   ----------------------    ----------------------------
Arrange  컴포넌트 준비·렌더        render
Act      사용자 동작 시뮬레이션    fireEvent / userEvent
Assert   결과 검증                 expect + getByRole 등
```

---

## 종합

AAA 패턴은 테스트 파일을 처음 보는 팀원이 "무엇을 테스트하는가"를 빠르게 파악하게 해준다. RTL의 API가 이 패턴에 자연스럽게 매핑되는 것은 우연이 아니다 — "사용자처럼 테스트하라"는 철학이 Arrange(준비), Act(사용자 행동), Assert(결과 확인)라는 사용자 시나리오 구조와 정확히 일치하기 때문이다. `fireEvent` 대신 `userEvent`를 쓰면 실제 브라우저의 이벤트 시퀀스(포커스 → keydown → input → keyup)를 재현해 Act 단계의 현실성을 높일 수 있다.
