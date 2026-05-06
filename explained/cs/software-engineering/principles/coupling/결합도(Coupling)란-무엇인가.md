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
