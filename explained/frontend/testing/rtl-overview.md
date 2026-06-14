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

---

---

# React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?

## 도입

React 앱은 컴포넌트 트리 구조다. 리프 컴포넌트만 테스트할지, 상위 컴포넌트를 테스트할지, 아니면 페이지 단위로 테스트할지에 대한 질문은 실무에서 자주 등장한다. Testing Library는 "컴포넌트 단위"가 아닌 "사용자 기능 단위"로 생각하라고 유도한다.

---

## 본문

> Following the guiding principle of this library, it is useful to break down how tests are organized around how the user experiences and interacts with application functionality rather than around specific components themselves.

"이 라이브러리의 가이딩 원칙을 따르면, 특정 컴포넌트 자체가 아니라 사용자가 애플리케이션 기능을 경험하고 상호작용하는 방식을 중심으로 테스트를 구성하는 것이 유용하다."

> In some cases, for example for reusable component libraries, it might be useful to include developers in the list of users to test for and test each of the reusable components individually.

"재사용 가능한 컴포넌트 라이브러리의 경우처럼, 개발자를 테스트 대상 사용자에 포함하고 각 재사용 컴포넌트를 개별적으로 테스트하는 것이 유용할 수 있다."

> Other times, the specific break down of a component tree is just an implementation detail and testing every component within that tree individually can cause issues.

"다른 경우에는, 특정 컴포넌트 트리의 분해 방식이 그냥 구현 세부사항이고, 트리 내 모든 컴포넌트를 개별적으로 테스트하면 문제가 생길 수 있다."

> In practice this means that it is often preferable to test high enough up the component tree to simulate realistic user interactions.

"실제로 이는 현실적인 사용자 상호작용을 시뮬레이션할 수 있을 만큼 충분히 높은 레벨에서 테스트하는 것이 종종 바람직하다는 뜻이다."

```
앱 컴포넌트 트리 예시

Page (테스트 권장 레벨 — 실제 사용자 시나리오 포함)
 ├── Header
 ├── CheckoutForm (이 컴포넌트만 단독 테스트하면 Header 연동 누락)
 │   ├── CartItems
 │   └── PaymentInput
 └── Footer

재사용 Button 컴포넌트 (개발자가 사용자 — 개별 테스트 적합)
```

---

## 종합

컴포넌트 단위로 쪼개서 모두 테스트하면 각 컴포넌트는 동작하지만 연결이 깨질 수 있다. `CartItems`가 정상이고 `PaymentInput`이 정상이어도, `CheckoutForm`에서 데이터가 잘못 연결되면 사용자는 결제에 실패한다. 반면 `CheckoutForm` 전체를 렌더해 "장바구니 담기 → 결제 버튼 클릭 → 완료 메시지"를 테스트하면 연결까지 검증된다. 단, Button처럼 독립적으로 소비되는 재사용 컴포넌트는 developer user가 사용자이므로 개별 테스트가 합리적이다.
