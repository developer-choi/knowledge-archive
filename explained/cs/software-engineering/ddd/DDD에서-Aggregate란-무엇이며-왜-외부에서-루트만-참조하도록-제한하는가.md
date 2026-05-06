# DDD에서 Aggregate란 무엇이며, 왜 외부에서 루트만 참조하도록 제한하는가?

> Models can be bound together by a root entity to become an aggregate.
> Objects outside the aggregate are allowed to hold references to the root but not to any other object of the aggregate.
> The aggregate root checks the consistency of changes in the aggregate.
> Drivers do not have to individually control each wheel of a car, for instance: they simply drive the car.
> In this context, a car is an aggregate of several other objects (the engine, the brakes, the headlights, etc.).

---

**도입**

앞 질문에서 Entity와 Value Object를 봤습니다. 실제 도메인은 이런 작은 객체 여러 개가 한 덩어리로 행동하는 경우가 많습니다. 주문 하나에는 여러 OrderItem이 딸려 있고, 그 합계 금액은 주문 단위로 검증되어야 합니다. Aggregate는 이런 "함께 묶여 일관성을 지키는 단위"이고, 그 단위에 들어가는 출입구가 바로 aggregate root입니다.

---

**본문**

> Models can be bound together by a root entity to become an aggregate.

여러 모델이 루트 엔티티(root entity)에 묶여 aggregate가 될 수 있다.

- **bound together**: 흩어진 객체들을 하나의 묶음으로 결속. 단순한 참조 관계가 아니라 "이 묶음 안에서는 일관성 규칙이 함께 적용된다"는 의미가 들어 있습니다.
- **root entity**: 그 묶음의 대표. 외부에서 이 묶음과 상호작용하려면 반드시 거쳐야 하는 진입점. Order/OrderItem 묶음에서는 Order가 루트.
- **aggregate**: 일관성 경계를 가진 객체 묶음. 트랜잭션 단위, 일관성 검사 단위가 이 경계와 일치합니다.

> Objects outside the aggregate are allowed to hold references to the root

aggregate 외부의 객체들은 루트에 대한 참조는 가질 수 있다.

- **outside the aggregate**: 다른 aggregate 안의 객체나, aggregate에 속하지 않는 도메인 서비스 등. 외부 세계 전반.
- **references to the root**: 루트의 ID나 루트 자체에 대한 참조. 예: 다른 모듈이 `order.id`를 들고 있는 것은 OK.

> but not to any other object of the aggregate.

하지만 aggregate 내부의 다른 객체에 대한 참조는 가질 수 없다.

- **not to any other object**: OrderItem에 직접 참조를 갖는 것은 금지. 외부 코드가 `orderItem.price = 0` 같은 직접 수정을 할 수 없게 됩니다.
- **이게 없으면 어떻게 되는가**: 외부에서 OrderItem을 직접 잡고 가격을 0원으로 바꾸면, Order 루트가 가지고 있던 "총합 = 모든 아이템 합계" 같은 일관성 규칙이 깨집니다. Order는 자기도 모르게 일관성이 깨진 상태가 되고, 추적도 어렵습니다.

> The aggregate root checks the consistency of changes in the aggregate.

aggregate 루트가 aggregate 내부 변경의 일관성을 검사한다.

- **checks the consistency**: 비즈니스 규칙을 강제하는 곳. "주문 상태가 SHIPPED면 아이템을 추가할 수 없다", "총합은 음수가 될 수 없다" 같은 규칙이 루트의 메서드 안에 들어 있습니다.
- **changes in the aggregate**: 내부 변경은 모두 루트를 통과해야 검사 받습니다. 그래서 위 문장(외부는 루트만 참조)이 강제되어야 이 검사가 의미가 있습니다.

> Drivers do not have to individually control each wheel of a car, for instance: they simply drive the car.

예를 들어, 운전자가 자동차의 각 바퀴를 개별로 제어할 필요는 없다 — 그저 자동차를 운전할 뿐이다.

- **individually control each wheel**: 외부에서 내부 부품을 일일이 조작하는 안티패턴 비유. 바퀴 하나만 따로 회전시키려 하면 차의 동작이 깨집니다.
- **simply drive the car**: 운전자는 자동차(루트)에 명령을 내리고, 내부 부품들이 어떻게 협력해 그 명령을 수행할지는 차가 결정합니다.

> In this context, a car is an aggregate of several other objects (the engine, the brakes, the headlights, etc.).

이 맥락에서, 자동차는 여러 다른 객체들(엔진, 브레이크, 헤드라이트 등)의 aggregate이다.

- **a car is an aggregate of**: 자동차가 묶음의 대표(루트)이고, 엔진/브레이크/헤드라이트는 그 안의 부품. 외부(운전자)는 차에 대해서만 알면 되고, 차가 내부 부품을 조율합니다.

---

**종합**

규칙을 한 표로 정리하면:

| 항목 | 허용 | 금지 |
|---|---|---|
| 외부 → 루트 참조 | OK | — |
| 외부 → 내부 객체 참조 | — | 금지 |
| 내부 변경 경로 | 루트의 메서드 호출 | 내부 객체 직접 수정 |
| 일관성 검사 | 루트가 수행 | — |

외부에서 루트만 참조하도록 제한하는 이유는 단순합니다 — 내부 객체를 직접 수정할 수 있게 두면 루트가 일관성 검사를 할 수 없어집니다. 모든 변경을 루트를 통해서만 하도록 강제해야 비즈니스 규칙 위반을 사전에 차단할 수 있습니다.

JS/프론트엔드 예시. 쇼핑몰 장바구니라면:

```js
// 안티패턴 — 외부에서 내부 객체 직접 조작
const item = cart.items[0];
item.quantity = 999; // cart의 일관성 규칙 우회

// DDD 권장 — 루트(cart)를 통해서만 변경
cart.changeItemQuantity(itemId, 999);
// 내부에서 재고·최대수량·할인 등 일관성 검사
```

`Cart`가 aggregate root, `CartItem`은 내부 객체. 외부 코드가 `cart.items[0]`를 직접 잡고 수정하면 "장바구니 총합", "재고 한도", "할인 적용 조건" 같은 규칙이 우회됩니다. 모든 변경 경로를 `cart.changeItemQuantity(...)`, `cart.addItem(...)` 같은 메서드로 제한하면, 그 메서드 안에 검사 로직을 모아둘 수 있습니다.

추가로 도메인 이벤트(domain event) 개념이 함께 등장합니다. "이미 일어난 사건"으로 모델링되는 것 — `OrderShipped`, `PaymentApproved` 같은 것. 도메인 전문가가 관심 갖는 사건들이고, 보통 aggregate 루트가 자신의 변경에 따라 이벤트를 발생시킵니다.

오개념 예방: aggregate 경계를 너무 크게 잡으면 트랜잭션이 비대해지고 성능이 죽습니다(예: "사용자" aggregate에 그 사용자의 모든 주문·리뷰·포인트 내역을 다 넣으면). 너무 작게 잡으면 일관성 검사가 분산되어 의미가 없습니다. "함께 변경되어야만 하는 것들"이 한 aggregate, "별도로 변해도 되는 것들"은 다른 aggregate로 가르는 게 일반적인 가이드.
