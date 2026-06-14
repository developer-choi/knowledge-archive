# 결합도(Coupling)란 무엇인가?

## 도입

결합도는 모듈들이 서로를 얼마나 많이 "알고 있는가"를 나타내는 척도다. A 모듈이 B 모듈의 내부 구현을 알아야만 동작한다면 둘은 강하게 결합된 것이다. React 컴포넌트로 치면 자식 컴포넌트가 부모의 내부 state 이름을 알아야 동작하도록 만들어졌다면 강결합 상태다.

---

## 본문

> In software engineering, coupling is the degree of interdependence between software modules, a measure of how closely connected two routines or modules are.

"소프트웨어 공학에서 결합도는 소프트웨어 모듈들 사이의 상호의존 정도이며, 두 루틴 또는 모듈이 얼마나 밀접하게 연결되어 있는지의 척도다."

- **interdependence**: 쌍방향 의존. A가 B를 알 뿐 아니라 B도 A에 의존하면 상호의존 상태다.
- **degree**: 응집도와 마찬가지로 이진이 아닌 스펙트럼이다.
- **routines or modules**: 함수 단위부터 파일, 패키지까지 규모와 무관하게 적용된다.

> Low coupling refers to a relationship in which one module interacts with another module through a simple and stable interface and does not need to be concerned with the other module's internal implementation.

"낮은 결합도는 한 모듈이 단순하고 안정적인 인터페이스를 통해 다른 모듈과 상호작용하며, 다른 모듈의 내부 구현에 신경 쓸 필요가 없는 관계를 말한다."

- **simple and stable interface**: 인터페이스가 단순하면 변경 충격이 작고, 안정적이면 내부 구현이 바뀌어도 호출 측이 수정할 필요가 없다. React 컴포넌트 props가 이 인터페이스에 해당한다 — props 형식이 안정적이면 내부 구현을 바꿔도 사용하는 쪽이 안전하다.
- **internal implementation**: 모듈 내부의 변수명, 로직 흐름, 데이터 구조. 이것을 외부가 알아야 한다면 결합도가 높다.

"A를 고쳤는데 전혀 상관없어 보이는 B에서 에러가 난다면" 두 모듈은 강하게 결합된 상태다.

```
낮은 결합도 (바람직)               높은 결합도 (위험)
                                   
A ──interface──→ B                 A ──→ B.internalState
                                        B._privateMethod()
A는 B의 인터페이스만 안다          A는 B의 내부를 직접 접근
B 내부 변경 → A 영향 없음          B 내부 변경 → A도 깨짐
```

---

## 종합

결합도가 높은 코드베이스는 "한 곳 고치면 다른 곳이 터지는" 현상이 잦다. 이 현상이 반복되면 팀은 코드 변경을 두려워하게 되고, 기능 추가 속도가 점점 느려진다. 반대로 낮은 결합도는 모듈을 독립적으로 테스트하고 교체할 수 있게 한다. TypeScript의 `interface`와 React의 `props` 타입 정의가 바로 이 "단순하고 안정적인 인터페이스"를 코드 레벨에서 강제하는 도구다.

---

# 결합도의 종류에는 무엇이 있는가?

## 도입

결합도도 응집도처럼 어떤 방식으로 모듈이 엮여 있는지에 따라 종류가 다르다. 종류를 알면 코드리뷰에서 "이 결합은 Content coupling이다"처럼 정확히 진단하고 대화할 수 있다.

---

## 본문

> Content coupling — Content coupling is said to occur when one module uses the code of another module, for instance a branch. This violates information hiding – a basic software design concept.

"Content 결합도 — 한 모듈이 다른 모듈의 코드를 직접 사용할 때 발생한다. 예: 분기문. 이는 정보 은닉이라는 기본 소프트웨어 설계 개념을 위반한다."

- **uses the code of another module**: 다른 모듈의 내부 구현 코드를 직접 참조하거나 수정하는 것. 다른 모듈의 private field를 직접 수정하는 것이 전형적 사례다.
- **information hiding**: 모듈 내부는 외부에서 보이지 않아야 한다는 원칙. Content coupling은 이 원칙을 정면으로 위반한다.

> Common coupling — Common coupling is said to occur when several modules have access to the same global data. But it can lead to uncontrolled error propagation and unforeseen side-effects when changes are made.

"Common 결합도 — 여러 모듈이 동일한 전역 데이터에 접근할 때 발생한다. 변경 시 통제되지 않는 오류 전파와 예상치 못한 부수효과를 초래할 수 있다."

- **global data**: 전역 변수, 전역 상태. Redux를 남발해서 수많은 모듈들이 읽고 쓰다 보니 이 데이터가 어디서 어떻게 변경되는지 흐름을 파악하기 어려운 상황이 Common coupling의 실무 사례다.
- **uncontrolled error propagation**: 한 모듈에서 전역 데이터를 잘못 수정하면 그것을 읽는 다른 모든 모듈이 영향받는다.

> External coupling — External coupling occurs when two modules share an externally imposed data format, communication protocol, or device interface.

"External 결합도 — 두 모듈이 외부에서 부과된 데이터 형식, 통신 프로토콜, 기기 인터페이스를 공유할 때 발생한다."

여러 컴포넌트가 API에서 응답하는 데이터를 직접 의존하는 경우가 External coupling의 실무 사례다. API 응답 스키마가 바뀌면 그것을 직접 의존하는 모든 컴포넌트를 고쳐야 한다.

> Control coupling — Control coupling is one module controlling the flow of another, by passing it information on what to do (e.g., passing a what-to-do flag).

"Control 결합도 — 한 모듈이 다른 모듈의 흐름을 제어하는 것. 무엇을 할지를 정보로 전달하는 방식. 예: 'what-to-do' flag 전달."

React에서 부모가 `mode="edit"` 같은 flag를 자식에 넘기고 자식이 그에 따라 전혀 다른 동작을 하는 패턴이 Control coupling에 해당한다.

> Class Coupling — A has an attribute that refers to (is of type) B. A calls on services of an object B. A has a method that references B (via return type or parameter). A is a subclass of (or implements) class B.

"Class 결합도 — A가 B 타입의 속성을 가짐. A가 B 객체의 서비스를 호출함. A가 B를 반환 타입·매개변수로 참조하는 메서드를 가짐. A가 B의 서브클래스이거나 B를 구현함."

TypeScript에서 컴포넌트가 특정 타입을 props로 받거나 반환값으로 사용하는 것이 Class coupling이다. 이는 피할 수 없는 결합이지만 인터페이스로 느슨하게 만들 수 있다.

```
결합도 종류 (강함 → 약함)

Content    다른 모듈의 내부 코드·private 필드 직접 접근  ← 최악
Common     공유 전역 상태(Redux store 남용 등)
External   외부 API 응답 형식에 직접 의존
Control    "무엇을 할지" flag를 전달해 흐름 제어
Class      타입 참조 (props 타입, 반환 타입)           ← 불가피하지만 관리 가능
```

---

## 종합

현실 코드에서 결합도를 0으로 만들 수는 없다. 모듈이 완전히 독립적이면 서로 아무것도 할 수 없다. 목표는 결합도를 없애는 것이 아니라, "어떤 방식으로 얼마나 결합할지"를 의식적으로 선택하는 것이다. Content coupling처럼 내부를 직접 건드리는 방식은 피하고, Class coupling처럼 타입으로 정의된 인터페이스를 통해 연결하는 방식을 택하면 변경의 충격이 예측 가능해진다.

---

# 결합도를 어떻게 줄일 수 있는가?

## 도입

결합도를 낮추는 접근법은 여러 가지지만, OA는 그 중 "기능 설계(functional design)"를 명시적으로 제시한다. 모듈의 책임을 기능 단위로 제한하면 모듈이 알아야 하는 다른 모듈의 범위가 좁아진다.

---

## 본문

> One approach to decreasing coupling is functional design, which seeks to limit the responsibilities of modules along functionality.

"결합도를 낮추는 한 가지 접근법은 기능 설계다. 기능 설계는 모듈의 책임을 기능에 따라 제한하려 한다."

- **functional design**: 모듈을 "어떤 기능을 하는가"를 기준으로 경계를 긋는 설계. 기술 타입(훅, 컴포넌트, 타입)이 아니라 도메인 기능(주문, 인증, 장바구니)으로 나누는 것이 여기 해당한다.
- **limit the responsibilities**: 모듈이 한 가지 기능만 책임지면 다른 모듈을 알아야 할 이유도 줄어든다. 책임이 넓을수록 다른 모듈과 협업해야 할 일이 많아지고, 그 협업이 결합도를 만든다.

응집도와의 연결: 기능 단위로 책임을 제한하면(응집도 향상) 자연스럽게 결합도도 낮아진다. 둘은 반대 방향의 지표이지만 같은 원칙에서 나온다 — "관련 있는 것끼리 묶고, 관련 없는 것은 분리한다."

---

## 종합

결합도를 줄이는 실무 패턴을 한 줄로 요약하면 "인터페이스로 대화하고, 내부는 숨긴다"다. React에서 자식 컴포넌트가 부모의 내부 상태를 직접 알지 않고 `onSubmit` 같은 콜백 props를 통해서만 소통하는 것, TypeScript `interface`로 의존 경계를 명시하는 것, API 응답을 바로 컴포넌트에서 쓰지 않고 DTO 변환 레이어를 두는 것이 모두 결합도를 낮추는 functional design의 실천이다. 결합도가 낮으면 한 모듈을 교체해도 다른 모듈이 영향받지 않아 리팩토링과 테스트가 쉬워진다.
