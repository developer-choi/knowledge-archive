# 컴포넌트 테스트에서 implementation details를 테스트하면 어떤 문제가 생기는가? Testing Library는 이 문제를 어떻게 해결하는가?

## 도입

컴포넌트를 리팩토링했는데 기능은 그대로인데 테스트가 깨진다면, 그 테스트는 구현 세부사항(implementation details)에 의존하고 있는 것이다. Testing Library는 사용자가 요소를 찾는 방식과 유사한 쿼리를 제공해 이 문제를 구조적으로 피하도록 유도한다.

---

## 본문

> You want to write maintainable tests that give you high confidence that your components are working for your users.

"당신은 사용자를 위해 컴포넌트가 동작한다는 높은 확신을 주는 유지보수 가능한 테스트를 작성하고 싶다."

- **maintainable**: 리팩토링, 기능 변경 시 테스트를 함께 고치지 않아도 되는 상태. 구현 세부사항에 묶인 테스트는 유지보수 비용이 크다.
- **high confidence**: 테스트가 통과하면 실제 사용자도 정상적으로 쓸 수 있다는 신뢰. 구현만 테스트하면 기능이 깨져도 통과할 수 있어 confidence가 낮아진다.

> Tests which test implementation details can break when you refactor application code. **False negatives**

"구현 세부사항을 테스트하는 테스트는 애플리케이션 코드를 리팩토링할 때 깨질 수 있다. 거짓 음성(False negatives)"

> May not fail when you break application code. **False positives**

"애플리케이션 코드를 망가뜨릴 때 실패하지 않을 수도 있다. 거짓 양성(False positives)"

```
구현 세부사항 테스트의 두 가지 실패 패턴

False Negative (거짓 실패)
  리팩토링 → 기능 그대로 → 테스트 깨짐
  → 불필요한 테스트 수정 비용

False Positive (거짓 통과)
  코드 버그 발생 → 테스트는 통과
  → 실제 사용자는 오류를 겪는데 CI는 초록불
```

> You may want to avoid the following implementation details: Internal state of a component, Internal methods of a component, Lifecycle methods of a component, Child components.

"피해야 할 구현 세부사항: 컴포넌트의 내부 state, 내부 메서드, 라이프사이클 메서드, 자식 컴포넌트."

---

## 종합

`getByRole`, `getByText`, `getByLabelText`는 사용자가 화면에서 요소를 찾는 방식을 그대로 모방한다. 스크린리더가 버튼을 role로 찾고, 사람이 텍스트로 링크를 찾는 것과 같다. 이렇게 쓰면 컴포넌트의 내부 구현을 `useState`에서 `useReducer`로 바꾸거나, 클래스에서 함수형으로 변환해도 테스트는 건드릴 필요가 없다. "리팩토링 후 테스트를 거의 고칠 필요가 없어야 한다"는 기준이 Testing Library의 설계 원칙이다.

---

---

# Testing Library는 implementation details 테스트를 기술적으로 차단하는가?

## 도입

Testing Library가 "구현 세부사항을 테스트하지 마라"고 권장하지만, 실제로 막아놓은 것인지 아니면 유도만 하는 것인지를 구분하는 것이 중요하다. 이 차이는 Testing Library의 설계 철학 전체를 이해하는 데 핵심이다.

---

## 본문

> Testing Library encourages you to avoid testing implementation details like the internals of a component you're testing (though it's still possible).

"Testing Library는 테스트하는 컴포넌트의 내부와 같은 구현 세부사항을 테스트하지 않도록 장려한다 (하지만 여전히 가능하다)."

- **encourages**: 강제(enforces)가 아닌 권장. API 설계로 올바른 방향을 자연스러운 선택지로 만들되, 잘못된 방향도 열어둔다.
- **though it's still possible**: `container.querySelector`, `wrapper.instance()` 등을 사용하면 여전히 내부 구현에 접근할 수 있다.

```ts
// Testing Library가 자연스럽게 유도하는 방향
screen.getByRole('button', { name: '제출' });

// 여전히 가능한 구현 세부사항 접근
const { container } = render(<Form />);
const button = container.querySelector('button.submit');
```

---

## 종합

기술적으로 막지 않는다는 것은 의도적인 설계 결정이다. 엄격한 제약보다 좋은 API를 더 편하게 만드는 접근 방식이다. `getByRole`이 `querySelector`보다 쉽고, 오류 메시지도 명확하고, 접근성까지 챙겨주니 자연스럽게 더 많이 쓰게 된다. 강제로 막으면 edge case에서 탈출구가 없어지고, 유도하면 팀이 왜 이 방식이 더 나은지를 이해하면서 선택할 수 있다.

---

---

# 테스트가 사용자의 소프트웨어 사용 방식과 닮을수록 더 큰 확신을 준다고 하는데, 그 근거는 무엇인가?

## 도입

"사용자처럼 테스트하라"는 원칙의 배경에는 두 방향의 논증이 있다. 구현 세부사항에 의존하면 확신이 낮아지는 역방향 논증과, 사용자 관점에서 찾으면 통과 시 실제 사용자도 동작이 보장되는 순방향 논증이다.

---

## 본문

> The more your tests resemble the way your software is used, the more confidence they can give you.

"테스트가 소프트웨어의 사용 방식과 더 닮을수록, 그 테스트는 더 큰 확신을 줄 수 있다."

> Implementation details are things which users of your code will not typically use, see, or even know about.

"구현 세부사항은 코드의 사용자가 일반적으로 사용하지도, 보지도, 심지어 알지도 못하는 것들이다."

- **users of your code**: 컴포넌트의 사용자는 end user(화면과 상호작용하는 사람)와 developer user(컴포넌트를 렌더링하는 개발자) 두 명이다. 둘 다 내부 state를 직접 건드리지 않는다.

> By making our test use the component differently than end-users and developers do, we create a third user our application code needs to consider: the tests!

"테스트가 end user나 developer user와 다른 방식으로 컴포넌트를 사용하게 만들면, 우리 애플리케이션 코드가 고려해야 할 제3의 사용자 — 테스트! — 를 만들어내게 된다."

- **third user**: 돈을 내지도, 시스템에 영향을 주지도 않는 가짜 사용자. 이 사용자를 위해 코드 구조를 맞추는 것은 낭비다.

```
올바른 사용자 구조
  end user     → 버튼 클릭, 화면 읽기
  developer    → props 전달, 렌더 결과 확인

구현 세부사항 테스트 시
  end user     → ...
  developer    → ...
  test user    → state 직접 조작, lifecycle 호출 (이 사용자는 존재하면 안 됨)
```

---

## 종합

"사용자처럼 테스트하라"는 추상적 원칙이 아니라 실용적 기준이다. end user와 developer user가 하지 않는 방식으로 컴포넌트를 다루면, 그 테스트가 통과해도 실제 사용자에게 아무 보장이 되지 않는다. 반대로 QA가 마우스로 클릭하듯 테스트를 쓰면 — `getByRole('button')` → `userEvent.click()` → `expect(결과)` — 테스트 통과가 곧 사용자 경험 보장이 된다.

---

---

# Testing Library의 Guiding Principles는 "사용자처럼 테스트하라"는 원칙을 API 설계에 어떻게 반영하는가?

## 도입

"사용자처럼 테스트하라"가 철학이라면, Guiding Principles는 그것을 API 설계 결정으로 번역한 원칙 목록이다. 어떤 유틸리티를 포함하고 어떤 것을 제외할지의 기준이다.

---

## 본문

> We try to only expose methods and utilities that encourage you to write tests that closely resemble how your web pages are used.

"우리는 웹 페이지가 사용되는 방식과 밀접하게 닮은 테스트를 작성하도록 장려하는 메서드와 유틸리티만 노출하려고 한다."

- **only expose**: API를 의도적으로 제한한다. "할 수 있는 것 전부"가 아니라 "올바른 방향으로 자연스럽게 이어지는 것"만 제공한다.

> If it relates to rendering components, then it should deal with DOM nodes rather than component instances, and it should not encourage dealing with component instances.

"렌더링과 관련된다면, 컴포넌트 인스턴스가 아닌 DOM 노드를 다뤄야 하며, 컴포넌트 인스턴스를 다루도록 권장해서는 안 된다."

> We are making some trade-offs here because we're using a computer and often a simulated browser environment, but in general, utilities should encourage tests that use the components the way they're intended to be used.

"우리는 컴퓨터와 종종 시뮬레이션된 브라우저 환경을 사용하기 때문에 여기서 일부 트레이드오프를 감수하지만, 일반적으로 유틸리티는 컴포넌트가 의도된 방식으로 사용되는 테스트를 장려해야 한다."

---

## 종합

Guiding Principles는 Testing Library가 특정 API를 포함하거나 제외한 이유를 설명한다. `wrapper.instance()`나 `wrapper.state()`가 없는 이유, `getByRole`이 `getByClassName`보다 우선 권장되는 이유가 모두 이 원칙에서 나온다. 유틸리티가 "이 방향으로 가면 자연스럽다"는 마찰 경사를 만들어 팀 전체가 특별한 교육 없이도 올바른 방향으로 테스트를 쓰게 유도한다.

---

---

# React Testing Library로 테스트를 작성하면 접근성(a11y)이 자연스럽게 개선된다고 하는데, 어떤 원리인가?

## 도입

RTL의 권장 쿼리인 `getByRole`, `getByLabelText`는 스크린리더가 페이지를 탐색하는 방식과 같다. 이 쿼리를 사용하려면 실제 HTML에 semantic markup과 accessible label이 있어야 하기 때문에, 테스트를 통과시키는 과정에서 접근성이 자연스럽게 챙겨진다.

---

## 본문

> The utilities this library provides facilitate querying the DOM in the same way the user would. Finding form elements by their label text (just like a user would), finding links and buttons from their text (like a user would).

"이 라이브러리가 제공하는 유틸리티는 사용자가 하는 것과 같은 방식으로 DOM을 쿼리하는 것을 용이하게 한다. 라벨 텍스트로 폼 요소를 찾고(사용자가 하는 것처럼), 텍스트로 링크와 버튼을 찾는다(사용자가 하는 것처럼)."

- **facilitate**: 더 쉽게 만들다. 억지로 강제하는 게 아니라 자연스러운 선택지로 만든다.

> It also exposes a recommended way to find elements by a data-testid as an "escape hatch" for elements where the text content and label do not make sense or is not practical.

"텍스트 내용과 라벨이 의미가 없거나 실용적이지 않은 요소에 대한 '탈출구(escape hatch)'로서 data-testid로 요소를 찾는 권장 방법도 제공한다."

- **escape hatch**: 원칙을 따를 수 없는 예외 상황을 위한 안전 탈출구. `data-testid`는 의미론적 접근이 불가능할 때만 쓰는 마지막 수단이다.

> This library encourages your applications to be more accessible and allows you to get your tests closer to using your components the way a user will.

"이 라이브러리는 애플리케이션이 더 접근성 있게 되도록 장려하고, 컴포넌트가 사용자가 사용하는 방식으로 테스트에 더 가깝게 해준다."

```
선순환 구조

getByRole('button')로 테스트 작성
  → <button> 태그 없이 <div onClick>이면 쿼리 실패
  → 개발자가 <button>으로 수정
  → 키보드 내비게이션·스크린리더 지원 자동 개선
```

---

## 종합

접근성을 별도로 챙기지 않아도 `getByRole`, `getByLabelText`로 테스트를 쓰다 보면 자연스럽게 semantic HTML을 강제받는다. 스크린리더가 찾지 못하는 요소는 RTL도 찾지 못하기 때문이다. `data-testid`를 남발하면 이 선순환이 끊어진다 — 접근성 없이도 테스트가 통과하기 때문이다. `getByRole` > `getByLabelText` > `getByText` > `getByTestId` 순서로 쿼리를 선택하는 것이 Testing Library가 권장하는 우선순위다.

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

---

---

# implementation details를 테스트하면 왜 all downside, no upside인가?

## 도입

구현 세부사항을 테스트하는 것이 왜 단점뿐이고 장점이 없는지를 이해하려면, 컴포넌트의 실제 사용자가 누구인지부터 명확히 해야 한다. 테스트 자체가 "제3의 사용자"가 되는 순간 문제가 시작된다.

---

## 본문

> But what are you getting confidence in when you test things this way? The testing user doesn't pay the bills like the end user. It doesn't affect the rest of the system like the developer user.

"하지만 이런 방식으로 테스트할 때 무엇에 대한 확신을 얻고 있는가? testing user는 end user처럼 돈을 내지 않는다. developer user처럼 나머지 시스템에 영향을 주지도 않는다."

- **testing user**: 구현 세부사항을 직접 조작하는 테스트가 가정하는 가상의 사용자. 실제로 존재하지 않는다.

> Writing tests that include implementation details is all downside and no upside.

"구현 세부사항을 포함하는 테스트를 작성하는 것은 단점뿐이고 장점이 없다."

> You should very rarely have to change tests when you refactor code.

"코드를 리팩토링할 때 테스트를 변경해야 하는 경우는 매우 드물어야 한다."

```
구현 세부사항 테스트의 가치 분석

얻는 것  → "내부 state가 X다"라는 확신
              (end user에게도, developer에게도 아무 의미 없음)

잃는 것  → 리팩토링마다 테스트 수정 비용
           + 실제 버그가 있어도 통과할 수 있는 위험
```

---

## 종합

테스트의 목적은 end user와 developer user에게 "이 코드는 제대로 동작한다"는 확신을 제공하는 것이다. 구현 세부사항 테스트는 이 둘 중 누구에게도 그 확신을 주지 못하면서, 리팩토링마다 깨지는 유지보수 부담만 남긴다. "no upside"는 테스트가 주는 확신이 실제 사용자 경험과 연결되지 않는다는 뜻이고, "all downside"는 false negative + false positive 두 방향 모두에서 비용을 치른다는 뜻이다.

---

---

# implementation details의 정의는 무엇이고, React 컴포넌트에서 구현 세부사항에 해당하는 것은?

## 도입

"구현 세부사항을 테스트하지 마라"는 원칙을 따르려면 먼저 무엇이 구현 세부사항인지 정의해야 한다. 정의는 기술 용어가 아니라 사용자 관점에서 나온다.

---

## 본문

> Implementation details are things which users of your code will not typically use, see, or even know about.

"구현 세부사항은 코드의 사용자가 일반적으로 사용하지도, 보지도, 심지어 알지도 못하는 것들이다."

> React components typically have two users: end-users, and developers. The end user will see/interact with what we render in the render method. The developer will see/interact with the props they pass to the component. So our test should typically only see/interact with the props that are passed, and the rendered output.

"React 컴포넌트는 보통 end user와 developer라는 두 사용자를 가진다. end user는 render 메서드에서 렌더링하는 것을 본다/상호작용한다. developer는 컴포넌트에 전달하는 props를 본다/상호작용한다. 따라서 우리 테스트는 보통 전달되는 props와 렌더된 출력만을 보고/상호작용해야 한다."

```
테스트해야 할 것 (두 사용자가 실제로 다루는 것)
  ✓ props로 전달된 값
  ✓ 렌더된 DOM 출력
  ✓ 사용자 인터랙션 (userEvent로 시뮬레이션)
  ✓ context 변화에 따른 렌더 결과

테스트하지 말아야 할 것 (아무도 직접 건드리지 않는 것)
  ✗ 컴포넌트의 internal state (useState 값)
  ✗ 컴포넌트의 internal methods
  ✗ Lifecycle methods (useEffect 직접 호출)
  ✗ 자식 컴포넌트의 내부
```

---

## 종합

정의의 핵심은 "사용자가 알 필요 없는 것"이다. `useState`로 관리하든 `useReducer`로 관리하든 `Zustand`로 관리하든, end user에게는 버튼을 눌렀을 때 화면이 어떻게 바뀌는지만 중요하다. 그 내부 상태를 테스트하면 구현을 바꿀 때마다 테스트도 따라 바꿔야 하는 강결합이 생긴다. 반면 props와 DOM output만 테스트하면 구현 자유도는 높아지고 테스트 유지보수 비용은 낮아진다.

---

---

# 테스트할 대상을 결정하는 5단계 프로세스는 무엇인가?

## 도입

테스트를 어디서부터 시작해야 할지 막막할 때 쓸 수 있는 구체적인 프로세스가 있다. 추상적인 "중요한 것을 테스트하라"가 아니라, 사용자 관점에서 수동 테스트 지침을 먼저 작성하고 그것을 자동화하는 순서다.

---

## 본문

> What part of your untested codebase would be really bad if it broke? (The checkout process)

"테스트되지 않은 코드베이스에서 깨지면 정말 나쁠 부분은? (결제 프로세스)"

> Try to narrow it down to a unit or a few units of code (When clicking the "checkout" button a request with the cart items is sent to /checkout)

"코드의 한 단위 또는 몇 개 단위로 좁혀라 (결제 버튼 클릭 시 장바구니 아이템과 함께 /checkout에 요청 전송)"

> Look at that code and consider who the "users" are (The developer rendering the checkout form, the end user clicking on the button)

"그 코드를 보고 '사용자'가 누구인지 생각하라 (결제 폼을 렌더링하는 개발자, 버튼을 클릭하는 end user)"

> Write down a list of instructions for that user to manually test that code (render the form with some fake data in the cart, click the checkout button, ensure the mocked /checkout API was called with the right data, respond with a fake successful response, make sure the success message is displayed).

"해당 사용자가 코드를 수동으로 테스트하기 위한 지침 목록을 작성하라"

> Turn that list of instructions into an automated test.

"그 지침 목록을 자동화 테스트로 전환하라."

```
5단계 프로세스 예시 (결제 기능)

1. 깨지면 최악인 것 → 결제 프로세스
2. 코드 단위 특정 → 결제 버튼 클릭 → /checkout API 호출
3. 사용자 파악 → developer (폼 렌더), end user (버튼 클릭)
4. 수동 테스트 지침 →
   - 가짜 장바구니 데이터로 폼 렌더
   - 결제 버튼 클릭
   - /checkout에 올바른 데이터가 전송됐는지 확인
   - 성공 응답 → 성공 메시지 노출 확인
5. 자동화 → RTL + MSW로 위 지침을 코드화
```

- **untested codebase**: 아직 테스트가 없는 코드 영역. 전부 테스트하려 하지 말고 깨지면 가장 큰 피해를 주는 곳부터 시작한다.

---

## 종합

3단계(사용자 파악)가 핵심이다. 사용자를 먼저 정의하면 4단계에서 자연스럽게 구현 세부사항이 배제된다 — 사용자가 하지 않는 행동은 수동 테스트 지침에 들어갈 수 없기 때문이다. 수동 테스트 지침을 먼저 쓰고 자동화하는 순서가 중요한 이유도 여기 있다. 사람이 직접 테스트하는 방식으로 생각하면 구현이 아닌 동작을 자연스럽게 검증하게 된다.

---

---

# 테스트를 작성할 때 코드 자체가 아니라 유스케이스를 중심으로 생각해야 하는 이유는?

## 도입

코드를 펼쳐놓고 테스트를 작성하면 if/else 분기, 내부 상태 전환 같은 구현 세부사항이 눈에 먼저 들어온다. 유스케이스를 먼저 생각하면 사용자 시나리오가 먼저 보인다. 시작점이 달라지면 테스트의 품질도 달라진다.

---

## 본문

> Think less about the code you are testing and more about the use cases that code supports.

"테스트하는 코드 자체에 대해 덜 생각하고, 그 코드가 지원하는 유스케이스에 대해 더 많이 생각하라."

> When you think about the code itself, it's too easy and natural to start testing implementation details (which is road to disaster).

"코드 자체에 대해 생각하면, 구현 세부사항을 테스트하기 시작하는 것이 너무 쉽고 자연스럽다 (이것은 재앙으로 가는 길이다)."

> We write tests to be confident that our application will work when the user uses them. That being the case, what we test should map directly to enhancing our confidence.

"우리는 사용자가 사용할 때 애플리케이션이 동작할 것이라는 확신을 갖기 위해 테스트를 작성한다. 그러므로 테스트하는 것은 그 확신을 높이는 것에 직접적으로 매핑되어야 한다."

- **use cases**: 사용자가 소프트웨어를 통해 달성하려는 구체적 시나리오. "로그인한다", "상품을 장바구니에 담는다", "결제를 완료한다" 같은 것.

```
코드 중심 사고 → 구현 세부사항 테스트
  코드: if (isLoggedIn) { showDashboard() } else { redirect('/login') }
  테스트: isLoggedIn이 true일 때 showDashboard가 호출됐는지 확인

유스케이스 중심 사고 → 사용자 동작 테스트
  유스케이스: 로그인한 사용자는 대시보드를 볼 수 있다
  테스트: 로그인 상태로 / 접근 → dashboard가 화면에 렌더됐는지 확인
```

---

## 종합

코드를 보면 구현이 보이고, 유스케이스를 보면 사용자가 보인다. 테스트의 목적이 사용자 경험 보장이라면, 출발점도 사용자여야 한다. 코드 커버리지 리포트가 아닌 유스케이스 목록을 작성하고 그것을 자동화하는 순서가 더 가치 있는 테스트를 만든다. 테스트는 코드 검사가 아니라 명세서다.

---

---

# 테스트가 없는 대규모 앱에서 테스트를 도입할 때 어디서부터 시작해야 하는가?

## 도입

테스트가 전혀 없는 대규모 앱에 테스트를 추가하는 것은 어디서 시작해야 할지 막막하다. 단위 함수부터 모두 커버하려 하면 끝이 없다. 가장 효과적인 시작점은 happy path E2E 테스트다.

---

## 본문

> Consider your app from the user's point of view and ask: What part of this app would make me most upset if it were broken?

"사용자 관점에서 앱을 바라보고 질문하라: 이 앱의 어떤 부분이 깨지면 가장 화가 날 것인가?"

> I'd suggest making a list of features that your application supports and prioritize them based on this criteria.

"애플리케이션이 지원하는 기능 목록을 만들고 이 기준으로 우선순위를 정하라."

> Once you have that prioritized list, then I suggest writing a single end to end (E2E) test to cover the "happy path" that most of your users go through for the particular use case.

"우선순위 목록이 생기면, 특정 유스케이스에서 대부분의 사용자가 거치는 'happy path'를 커버하는 단일 E2E 테스트를 작성하라."

- **happy path**: 대다수 사용자가 거치는 가장 일반적인 성공 시나리오. 오류 없이 모든 것이 정상 동작하는 경우. 테스트 시작점으로 가장 효율적이다.

> Once you have a few E2E tests in place, then you can start looking at writing some integration tests for some of the edge cases that you are missing in your E2E tests and unit tests for the more complex business logic that those features are using.

"E2E 테스트가 몇 개 생기면, E2E에서 놓치는 edge case를 위한 integration test와, 복잡한 비즈니스 로직을 위한 unit test를 작성하기 시작할 수 있다."

```
테스트 도입 순서 (위에서 아래로)

E2E       → happy path 커버 (가장 먼저, 가장 높은 confidence)
              "로그인 → 장바구니 → 결제 → 완료" 전체 흐름
Integration → E2E에서 놓친 edge case
              "쿠폰 적용 실패 시 에러 메시지 노출"
Unit      → 복잡한 비즈니스 로직
              "할인율 계산 함수의 경계값 처리"
```

---

## 종합

"100% 커버리지"를 목표로 삼으면 시작도 끝도 없다. 대신 "깨지면 가장 화나는 기능"의 happy path E2E 하나로 시작하면 빠른 시간 안에 가장 높은 confidence를 확보할 수 있다. E2E는 여러 상위 기능을 하나의 테스트로 커버하는 효율도 있다. 그 위에 integration과 unit을 점진적으로 쌓아가면 된다. 100% code coverage 추구는 피해야 하지만, 100% happy path coverage는 우선 목표로 삼을 만하다.
