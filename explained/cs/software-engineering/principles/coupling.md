# 결합도(Coupling)란 무엇인가?

> In software engineering, coupling is the degree of interdependence between software modules, a measure of how closely connected two routines or modules are.
> Low coupling refers to a relationship in which one module interacts with another module through a simple and stable interface and does not need to be concerned with the other module's internal implementation (see Information Hiding).

---

**도입**

응집도가 "한 모듈 안의 결속력"이었다면, 결합도는 그 반대 — "모듈들 사이의 의존 정도"입니다. 둘은 항상 한 쌍으로 다뤄지고, 좋은 설계는 "응집도는 높게, 결합도는 낮게"가 정석입니다. 이 문서는 결합도의 정의와, 낮은 결합도가 어떤 모습인지를 봅니다.

---

**본문**

> In software engineering, coupling is the degree of interdependence between software modules,

소프트웨어 공학에서 결합도란, 소프트웨어 모듈들 사이의 상호 의존도를 나타내는 정도이다.

- **degree of interdependence**: 의존의 정도. 0/1이 아니라 스펙트럼이라는 점은 응집도와 동일.
- **interdependence (상호 의존)**: 한 모듈만 다른 모듈에 의존하는 단방향이 아니라, 양쪽이 서로에 대해 알고 있는 정도까지 포함. 상호 의존이 깊을수록 결합도가 높습니다.

> a measure of how closely connected two routines or modules are.

두 루틴이나 모듈이 얼마나 긴밀하게 연결되어 있는지를 재는 척도.

- **how closely connected**: "얼마나 강하게 묶여 있는가". 결합도의 직관적 정의. 한 모듈을 고치면 다른 모듈도 같이 고쳐야 한다면 둘은 강하게 연결된 상태.
- **routines or modules**: 함수 단위든 모듈/파일 단위든 같은 개념이 적용된다는 표현. JS에서는 함수·hook·컴포넌트·모듈 모두 결합도 분석 대상.

> Low coupling refers to a relationship

낮은 결합도(low coupling)란 다음과 같은 관계를 가리킨다.

- **Low coupling**: 모듈 사이의 의존이 약한 상태. 좋은 설계의 목표 지점.

> in which one module interacts with another module through a simple and stable interface

한 모듈이 다른 모듈과 단순하고 안정적인 인터페이스를 통해 상호작용하는 관계.

- **simple interface**: 노출 면적이 작은 API. 함수 인자가 적고 복잡하지 않으며, 외부에서 알아야 할 것이 최소.
- **stable interface**: 잘 변하지 않는 API. 한 모듈의 인터페이스가 자주 바뀌면 그를 사용하는 모든 모듈이 같이 흔들립니다.
- **interacts ~ through**: 직접 내부에 손대는 게 아니라 정해진 입구로만 통신. 인터페이스가 외부와 내부를 가르는 막 역할.

> and does not need to be concerned with the other module's internal implementation

그리고 다른 모듈의 내부 구현에 신경 쓸 필요가 없다.

- **not concerned with internal implementation**: 사용하는 쪽이 사용되는 쪽이 어떻게 만들어졌는지 몰라도 됨. "이 함수가 내부적으로 Map을 쓰는지 객체를 쓰는지" 같은 것은 사용자에게 보이지 않아야 합니다.
- **이게 없으면 어떻게 되는가**: 내부 구현이 새어나가면, 사용하는 쪽이 그 구현 세부에 의존하게 됩니다. 사용되는 모듈이 내부를 리팩터링할 때 사용하는 쪽이 다 깨지는 결과로 이어집니다.

> (see Information Hiding).

(정보 은닉(Information Hiding)을 참고하라.)

- **Information Hiding (정보 은닉)**: David Parnas가 제시한 설계 원리. 모듈은 변할 가능성이 있는 결정을 자기 안에 숨기고, 변하지 않을 인터페이스만 노출해야 한다는 것. 낮은 결합도의 이론적 토대.

---

**종합**

결합도를 잡는 핵심 질문은 AI Annotation의 표현 그대로입니다 — "A라는 모듈이 작동하기 위해 B를 얼마나 알고 있어야 하는가?" A를 고쳤는데 전혀 상관없어 보이는 B에서 에러가 난다면, 두 모듈은 결합도가 매우 높은 상태입니다.

결합도의 두 축을 표로:

| 축 | 낮은 결합 | 높은 결합 |
|---|---|---|
| 인터페이스 면적 | 작고 명확 | 크고 모호 |
| 내부 노출 | 숨김 | 외부가 내부를 알고 있음 |
| 변경 파급 | 좁음 | 넓음 |

JS/React 맥락의 예. 결제 컴포넌트가 장바구니 모듈을 쓴다고 할 때:

```js
// 높은 결합 — 내부 구현에 의존
import { cartState } from './cart/state';
const total = cartState.items.reduce((sum, i) => sum + i.price, 0);
// cart 모듈 내부 자료구조(items 배열, price 필드)에 직접 의존
// items가 Map으로 바뀌거나 price 계산 규칙이 변하면 결제 코드가 깨짐

// 낮은 결합 — 인터페이스만 의존
import { getCartTotal } from './cart';
const total = getCartTotal();
// 내부 구현이 어떻든 결제 코드는 영향받지 않음
```

전자는 결제 모듈이 cart 모듈의 내부 자료구조를 알고 있어야 합니다. cart 모듈이 자료구조를 바꾸면 결제 모듈이 깨집니다. 후자는 함수라는 안정적 인터페이스만 알면 되고, cart 모듈이 어떻게 구현되어 있든 결제 모듈은 무사합니다.

AI Annotation이 짚은 비유 — "내부가 어떻게 돌아가는지 몰라도 '이 버튼을 누르면 결제가 된다'는 인터페이스만 명확하면 결합도가 낮아집니다." 외부 라이브러리를 떠올리면 직관적입니다. `lodash`의 `_.debounce()`를 쓸 때 우리는 그 내부가 어떻게 구현됐는지 모릅니다. 함수 시그니처라는 인터페이스만 알면 되고, lodash가 내부 구현을 바꿔도 우리 코드는 안전합니다.

오개념 예방: "결합도를 0으로 만들자"는 불가능하고 의미도 없습니다. 모듈끼리 협력해야 시스템이 돌아가니까요. 목표는 0이 아니라 **변경 파급을 좁히는 인터페이스 설계**. 한 모듈의 변경이 어디까지 번지는지를 예측 가능하게 만드는 게 본질입니다.

이게 없으면 어떻게 되는가: 결합도가 높은 코드베이스는 "건드리면 어디서 터질지 모르는" 상태가 됩니다. 새 기능 추가가 점점 두려워지고, 리팩터링은 사실상 불가능해집니다. 시간이 흐르면 "부엌부터 거실까지 다 묶인 한 덩어리" 코드가 되어, 작은 변경에도 시스템 전체 회귀 테스트가 필요해집니다. 다음 질문에서 결합의 종류를 보면, 어떤 형태가 특히 위험한지 더 구체적으로 짚을 수 있습니다.

---

# 결합도의 종류에는 무엇이 있는가?

> Content coupling
> Content coupling is said to occur when one module uses the code of another module, for instance a branch.
> This violates information hiding – a basic software design concept.
>
> Common coupling
> Common coupling is said to occur when several modules have access to the same global data.
> But it can lead to uncontrolled error propagation and unforeseen side-effects when changes are made.
>
> External coupling
> External coupling occurs when two modules share an externally imposed data format, communication protocol, or device interface.
>
> Control coupling
> Control coupling is one module controlling the flow of another, by passing it information on what to do (e.g., passing a what-to-do flag).
>
> Class Coupling
> - A has an attribute that refers to (is of type) B.
> - A calls on services of an object B.
> - A has a method that references B (via return type or parameter).
> - A is a subclass of (or implements) class B.

---

**도입**

결합도는 응집도와 마찬가지로 **종류**가 있고, 그 종류가 위험도를 가릅니다. 이 문서는 5가지 — Content, Common, External, Control, Class — 를 다룹니다. "내가 짠 코드가 어느 형태에 가까운가"를 점검하면 어떤 종류의 변경 파급에 취약한지 미리 알 수 있습니다.

---

**본문**

> Content coupling

Content coupling (내용 결합).

> Content coupling is said to occur when one module uses the code of another module, for instance a branch.

내용 결합이란, 한 모듈이 다른 모듈의 코드(예: 분기 내부)를 직접 사용할 때를 말한다.

- **uses the code of another module**: 인터페이스를 통하지 않고 다른 모듈의 내부 코드를 직접 가져다 쓰는 것. 가장 강한 결합.
- **a branch**: 다른 모듈 안의 특정 분기·내부 변수에 직접 진입. 캡슐화를 무시한 행위.

> This violates information hiding – a basic software design concept.

이는 정보 은닉(software design의 기본 개념)을 위반한다.

- **violates information hiding**: 다른 모듈의 내부가 외부에 노출되어, 그 내부가 변하면 사용하는 쪽이 다 깨집니다. 가장 위험한 결합.

User Annotation 예시 — 다른 모듈의 (private) field를 직접 수정하는 경우. JS에는 진짜 private이 적은 시절이 길어서, 클래스의 내부 필드를 외부에서 `obj._internalField = ...` 같이 직접 만지는 코드가 흔했습니다. 이게 정확히 content coupling.

> Common coupling

Common coupling (공통 결합).

> Common coupling is said to occur when several modules have access to the same global data.

공통 결합이란, 여러 모듈이 같은 전역 데이터에 접근할 때를 말한다.

- **the same global data**: 전역 변수, 싱글톤 객체, 모듈 스코프의 공유 상태 등. 여러 모듈이 같은 변수를 읽고 씁니다.

> But it can lead to uncontrolled error propagation and unforeseen side-effects when changes are made.

하지만 변경이 가해질 때 통제되지 않는 에러 전파와 예상치 못한 부수효과를 일으킬 수 있다.

- **uncontrolled error propagation**: 한 모듈이 전역 데이터를 잘못 건드리면 그 데이터를 읽는 모든 모듈이 잘못된 상태에서 동작. 어디서 잘못됐는지 추적이 어려움.
- **unforeseen side-effects**: "여기를 고쳤는데 왜 저기가 깨지지?"의 전형. 같은 전역을 보는 모든 곳이 잠재적 영향 범위.

User Annotation 예시 — Redux같은거 남발해서 수많은 모듈들이 읽고 쓰고 하다보니 이 데이터가 어디서 어떻게 CRUD 되는지 흐름 파악하기 힘든 경우. Redux store 자체는 도구일 뿐이지만, 거기에 거의 모든 상태를 넣고 모든 컴포넌트가 읽고 쓰면 사실상 전역 변수 한 덩어리가 되어 common coupling을 만듭니다.

> External coupling

External coupling (외부 결합).

> External coupling occurs when two modules share an externally imposed data format, communication protocol, or device interface.

외부 결합이란, 두 모듈이 외부에서 강제된 데이터 형식·통신 프로토콜·장치 인터페이스를 공유할 때 발생한다.

- **externally imposed**: 외부 시스템(예: 백엔드 API, 표준 프로토콜)이 강제하는 형식. 우리 코드의 통제 밖에 있어 우리가 바꿀 수 없습니다.
- **data format**: API 응답 JSON 구조, 파일 포맷 등.
- **communication protocol**: HTTP·WebSocket·gRPC 같은 프로토콜 규약.
- **이게 없으면 어떻게 되는가**: 외부 형식이 바뀌면(예: 백엔드가 응답 필드명을 바꿈), 그 형식을 직접 다루는 모든 모듈이 깨집니다.

User Annotation 예시 — 여러 컴포넌트가 API에서 응답하는 데이터를 직접 의존하는 경우. 백엔드 응답 JSON을 그대로 컴포넌트들에 뿌리면, 백엔드가 필드명 하나 바꿀 때마다 컴포넌트 5~10개를 동시에 수정해야 합니다. 보통 어댑터 레이어(API 응답 → 도메인 모델 변환)를 두어 외부 결합을 한 점에 모읍니다.

> Control coupling

Control coupling (제어 결합).

> Control coupling is one module controlling the flow of another, by passing it information on what to do (e.g., passing a what-to-do flag).

제어 결합이란, 한 모듈이 다른 모듈에게 무엇을 할지에 대한 정보(예: what-to-do 플래그)를 넘겨 그 흐름을 제어할 때를 말한다.

- **passing a what-to-do flag**: "이번엔 이 분기로 가, 다음엔 저 분기로 가"라고 외부에서 명령하는 형태. 흔한 안티패턴은 함수에 boolean 플래그가 여러 개 들어가는 것.
- **controlling the flow of another**: 호출자가 피호출자의 내부 분기를 결정한다는 점이 핵심. 피호출자는 자기 책임을 결정하지 못하고 외부 명령에 따라 움직입니다.

JS 예: `formatPrice(price, true, false, true)` 같이 의미 모를 플래그가 여럿 박힌 함수. 호출자는 함수 내부 동작을 알아야만 플래그를 바르게 넣을 수 있어 양쪽이 강하게 묶입니다.

> Class Coupling
> - A has an attribute that refers to (is of type) B.
> - A calls on services of an object B.
> - A has a method that references B (via return type or parameter).
> - A is a subclass of (or implements) class B.

Class coupling — A가 B 타입의 속성을 가지거나, A가 B 객체의 서비스를 호출하거나, A의 메서드가 B를 (반환 타입·매개변수로) 참조하거나, A가 B의 서브클래스이거나 구현체일 때 발생.

- **객체지향 시스템에서 두 클래스 사이의 결합 형태들**의 분류. JS에서도 클래스를 쓰면 그대로 적용되고, 함수형 코드에서는 "한 모듈이 다른 모듈의 타입을 import해서 쓰는 경우"로 일반화됩니다.
- 4가지 형태가 있다는 건 결합이 한 모양이 아님을 보여줍니다. 가장 강한 결합은 마지막 — 상속/구현. 부모 클래스가 변하면 모든 자식이 영향받기 때문.

---

**종합**

5가지 결합도를 위험도 순으로 정리:

| 종류 | 형태 | 위험도 | 프론트엔드 사례 |
|---|---|---|---|
| Content | 다른 모듈의 내부 코드/private 필드 직접 접근 | 매우 높음 | `obj._privateField = ...` |
| Common | 여러 모듈이 같은 전역 데이터 공유 | 높음 | Redux 남발, 글로벌 싱글톤 |
| External | 외부 시스템의 형식·프로토콜에 직접 의존 | 중간 | API 응답 JSON을 컴포넌트에 그대로 흘림 |
| Control | 동작을 결정하는 플래그를 외부에서 주입 | 중간 | `doStuff(price, true, false, true)` |
| Class | 타입 참조·메서드 호출·상속 | 약~중 | `class Cart extends BaseCart` |

각 결합을 줄이는 일반 처방:

- **Content → 캡슐화**: private 필드/메서드를 강제하고, 외부는 메서드 인터페이스로만 접근.
- **Common → 상태 격리**: 전역 store에 모든 걸 넣지 않고, feature 단위 로컬 상태로 분리. Redux를 쓰더라도 slice 단위 책임을 명확히.
- **External → 어댑터 레이어**: API 응답을 받아 도메인 모델로 변환하는 한 곳을 만들고, 나머지 코드는 그 도메인 모델만 사용.
- **Control → 분리·다형성**: 플래그로 분기하는 대신 별도 함수로 분리하거나, 전략 패턴/콜백으로 행동 자체를 주입.
- **Class → 합성 우선**: 상속보다는 합성(composition) 우선. React에서 HOC·Hook 합성이 상속보다 권장되는 이유의 하나.

오개념 예방 1: "결합도는 무조건 낮을수록 좋다"는 절대 명제는 아닙니다. 모듈끼리 협력해야 시스템이 돌아가고, 어떤 결합은 본질적으로 필요합니다(예: feature 모듈이 공통 인증 유틸을 import하는 것). 핵심은 **불필요한 결합을 만들지 않기, 그리고 결합이 필요한 지점에 안정적 인터페이스를 두기**입니다.

오개념 예방 2: 등급은 위험도의 가이드일 뿐 절대 순위가 아닙니다. Common이 Content보다 덜 위험하다고 해서 Redux를 무한히 키워도 된다는 뜻은 아닙니다. 실제 시스템의 변경 빈도·확장 방향에 따라 같은 등급도 위험도가 다릅니다.

다음 질문(결합도를 어떻게 줄일 수 있는가)에서는 이 결합들을 줄이는 일반적 접근법을 다룹니다.

---

# 결합도를 어떻게 줄일 수 있는가?

> One approach to decreasing coupling is functional design, which seeks to limit the responsibilities of modules along functionality.

---

**도입**

앞 질문들에서 결합도의 정의와 다섯 가지 종류를 봤습니다. 이번엔 결합도를 낮추는 한 가지 일반적 접근 — **기능적 설계(functional design)** — 를 봅니다. Wikipedia 정의는 한 문장이지만, 이 문장에 결합도 감축의 핵심 직관이 다 들어 있습니다.

---

**본문**

> One approach to decreasing coupling

결합도를 줄이는 하나의 접근법은

- **One approach**: "유일한 방법"이 아니라 "한 가지 접근". 결합도를 낮추는 길은 여러 갈래가 있고, 그중 대표적인 하나가 functional design입니다.

> is functional design,

기능적 설계이다.

- **functional design**: "함수형 프로그래밍"과는 다른 개념. 모듈을 **기능 단위로 분할**하자는 설계 사고. 모듈마다 명확한 한 가지 기능을 갖도록 구성.

> which seeks to limit the responsibilities of modules

이는 모듈의 책임을 제한하려고 한다.

- **limit the responsibilities**: 한 모듈에 너무 많은 책임을 지우지 않는다. 단일 책임 원칙(SRP)의 직관과 맞물립니다.
- **of modules**: 모듈 단위에서 책임을 좁힌다는 점이 핵심. 함수 하나가 아니라 모듈/파일 단위에서.

> along functionality.

기능이라는 축을 따라.

- **along functionality**: 책임을 가르는 기준이 "기능"이라는 의미. 다른 가능한 기준들 — 기술 종류(`hooks/`, `components/`), 데이터 종류 — 이 아니라 **기능별 분할**.
- **이게 없으면 어떻게 되는가**: 책임 분할 기준이 흐릿하면, 한 모듈이 자꾸 새 책임을 떠안게 되고, 결국 그 모듈이 다른 모듈들과 더 많은 접점을 갖게 되어 결합도가 올라갑니다.

---

**종합**

기능적 설계의 핵심 동작 — "한 모듈은 한 기능에만 책임진다"가 결합도 감축의 토대입니다. 책임이 좁고 명확하면 다른 모듈과의 접점도 좁아져, 자연히 결합도가 낮아집니다.

JS/React 프로젝트에서 기능적 설계를 적용하는 흔한 형태:

| 적용 지점 | 기능 단위 분할 예 |
|---|---|
| 폴더 구조 | `features/cart/`, `features/checkout/`, `features/auth/` (도메인 기능별) |
| Hook | `useCart`, `useCheckout`, `useAuth` (각각 한 도메인의 기능만) |
| 컴포넌트 | `<CartButton />`, `<CheckoutForm />` (한 시각적 기능에만) |
| 함수 | `formatPrice`, `validateAddress` (한 가지 일만) |

기능적 설계 외에 결합도를 낮추는 일반적 도구들도 같은 직관 위에 있습니다:

- **인터페이스 추상화**: 사용하는 쪽이 구현 세부가 아닌 안정적 시그니처에만 의존. TypeScript의 타입 시그니처, React 컴포넌트의 props 정의가 그 역할.
- **의존성 주입**: 모듈이 자기 의존을 직접 import하지 않고 외부에서 주입받기. React에서는 props/Context로 자연스럽게 구현됩니다.
- **어댑터 레이어**: 외부 API·라이브러리를 직접 다루지 않고 한 곳에 변환 레이어를 두기. 그 레이어 너머의 코드는 외부 변경의 영향을 안 받습니다.
- **합성 우선**: 상속(class coupling) 대신 합성. `React.HOC` 합성, hook 합성, 함수 합성이 모두 같은 정신.

JS 코드 예:

```js
// 결합도 높음 — 한 모듈이 여러 기능을 한꺼번에 짊어짐
// userManager.ts
export function createUser(...) {} // 사용자 생성
export function sendWelcomeEmail(...) {} // 이메일 발송
export function chargeFirstBilling(...) {} // 결제

// 기능적 설계 — 모듈을 기능 축으로 분할
// users/createUser.ts
// notifications/sendWelcomeEmail.ts
// billing/chargeFirstBilling.ts
```

전자는 `userManager`를 import하면 사용자·이메일·결제 의존성이 모두 딸려옵니다. 한 책임이 변하면 다른 두 책임의 코드도 같은 파일에서 흔들립니다. 후자는 각 모듈이 자기 책임에만 의존하고, 사용자가 가입할 때 이 셋을 호출하는 오케스트레이션은 별도의 위치(예: 사용자 가입 핸들러)에서 합성합니다.

오개념 예방 1: "기능적 설계"라는 표현이 함수형 프로그래밍을 뜻하지는 않습니다(혼동 주의). 함수형 프로그래밍은 패러다임이고, 기능적 설계(functional design)는 모듈 분할 기준에 관한 설계 원리입니다. 영문 표현이 비슷해서 한국어 번역에서도 종종 섞이지만, 둘은 별개 개념입니다.

오개념 예방 2: 모듈을 작게 쪼갠다고 결합도가 자동으로 낮아지지는 않습니다. 작게 쪼개는 동시에 **모듈 간 인터페이스를 안정적으로 유지하고, 의존 방향을 단방향으로 정돈**해야 효과가 납니다. 작게 쪼개기만 하고 모든 모듈이 서로 import하면 오히려 결합망이 더 복잡해집니다.

이게 없으면 어떻게 되는가: 책임 한계가 모호한 모듈은 시간이 흐르며 점점 더 많은 책임을 흡수합니다. 결국 그 모듈은 모든 곳에서 import되고, 어떤 변경도 시스템 전체에 영향을 미치는 "신적 모듈(God module)"이 됩니다. 기능적 설계는 그 길로 빠지기 전에 책임의 경계선을 그어두는 가장 실용적인 도구입니다.
