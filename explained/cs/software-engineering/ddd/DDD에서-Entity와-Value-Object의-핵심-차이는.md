# DDD에서 Entity와 Value Object의 핵심 차이는?

> An entity is an object defined not by its attributes, but its identity.
> As an example, most airlines assign a unique number to seats on every flight: this is the seat's identity.
> In contrast, a value object is an immutable object that contains attributes but has no conceptual identity.
> When people exchange business cards, for instance, they only care about the information on the card (its attributes) rather than trying to distinguish between each unique card.

---

**도입**

DDD의 전술적 설계(tactical design)에서 가장 먼저 만나는 분류가 Entity와 Value Object입니다. 두 개념의 갈림길은 단 하나 — "이 객체를 식별(identity)하는 게 의미가 있는가, 아니면 속성(attributes)만으로 충분한가". 같은 데이터처럼 보여도 도메인 맥락에 따라 어느 쪽이 되는지가 갈립니다.

---

**본문**

> An entity is an object defined not by its attributes, but its identity.

엔티티는 속성이 아니라 **정체성(identity)**으로 정의되는 객체이다.

- **attributes (속성)**: 객체가 들고 있는 데이터들. 사용자라면 이름·나이·이메일.
- **identity (정체성)**: 다른 모든 객체와 구별 짓는 고유 식별자. 보통 ID 필드 하나로 표현되지만, 개념적으로는 "속성이 모두 같아도 ID가 다르면 다른 객체"라는 약속.
- **defined not by ~ but by ~**: 두 가지 정의 방식 중 entity는 후자를 택한다는 강조. 두 사용자의 이름·나이·이메일이 같아도 ID가 다르면 다른 사용자입니다.

> As an example, most airlines assign a unique number to seats on every flight: this is the seat's identity.

예를 들어, 대부분의 항공사는 모든 항공편의 좌석에 고유 번호를 부여한다 — 이것이 좌석의 정체성이다.

- **unique number to seats**: 같은 비행기 안의 좌석 두 개는 동일한 모델, 같은 색, 같은 등급일 수 있지만 12A와 12B는 서로 다른 좌석. 좌석 번호가 정체성.
- **on every flight**: 비행 단위로 정체성이 부여된다는 점이 미묘. 같은 항공기가 다음 비행에 쓰여도, 그 비행의 12A는 별개의 인스턴스로 봅니다(예약 시스템 관점에서). 엔티티의 정체성은 도메인 맥락이 정합니다.

> In contrast, a value object is an immutable object

반면, value object는 불변(immutable) 객체이다.

- **immutable**: 한 번 만들어진 후 속성이 바뀌지 않는다는 뜻. JS로 치면 `Object.freeze()`된 객체, 또는 readonly 필드만 가진 클래스. 속성을 바꿔야 한다면 새 인스턴스를 만듭니다.
- **이게 없으면 어떻게 되는가**: 가변 value object는 "ID 없이 어디서나 공유되는 객체"가 되어 한 곳에서 수정한 게 다른 곳에 영향을 미칩니다. 그래서 value object는 불변이 기본 약속.

> that contains attributes but has no conceptual identity.

속성을 갖지만, 개념적 정체성은 없다.

- **no conceptual identity**: ID로 구별할 필요가 없다는 의미. "이 5천원과 저 5천원이 같은 5천원이냐"를 묻지 않듯, 두 value object의 속성이 같으면 같은 것으로 취급합니다.

> When people exchange business cards, for instance, they only care about the information on the card (its attributes)

예를 들어 사람들이 명함을 교환할 때, 그들은 명함에 적힌 정보(속성)에만 신경 쓴다.

- **business cards**: 같은 사람의 명함은 보통 같은 디자인으로 100장 인쇄됩니다. 받는 입장에서는 100장 중 어느 한 장인지가 의미가 없습니다.
- **only care about ~ attributes**: 이름·전화번호·이메일이 무엇이냐만 중요. 누가 가위로 자른 명함인지, 몇 번째로 받은 명함인지는 무의미.

> rather than trying to distinguish between each unique card.

각각의 명함을 구별하려 하지 않는다.

- **distinguish between**: 두 객체를 따로 추적할 필요. value object는 이게 필요 없습니다.

---

**종합**

Entity vs Value Object를 표로 정리하면:

| 구분 | Entity | Value Object |
|---|---|---|
| 정의 기준 | identity (ID) | attributes (속성) |
| 가변성 | 가변 가능 (ID는 유지) | 불변 |
| 동등성 비교 | ID로 비교 | 속성 전체로 비교 |
| 예시 | 사용자, 주문, 좌석 12A | 돈(₩5,000), 주소, 좌표 (3, 4) |
| JS 예시 | `{ id: 'u-1', name: 'A' }` | `{ amount: 5000, currency: 'KRW' }` |

프론트엔드 맥락의 예. 쇼핑몰 장바구니에서:

- **Entity**: `Cart` (사용자별 ID 있음), `OrderItem` (주문 라인 ID 있음). 같은 상품을 두 번 담아도 두 OrderItem은 별개.
- **Value Object**: `Money` (`{ amount, currency }`), `Address` (`{ zipcode, street, ... }`). 같은 5,000원이면 모두 같은 5,000원, 같은 주소면 모두 같은 주소.

React 컴포넌트의 props를 설계할 때 이 구분이 도움이 됩니다. `<UserBadge user={user} />`처럼 ID를 가진 entity를 통째로 넘기는 것과, `<PriceTag price={price} />`처럼 value object를 넘기는 것은 의미가 다릅니다. 후자는 같은 price 객체가 여러 곳에 공유되어도 안전합니다(불변이니까).

오개념 예방: "ID 컬럼이 있으면 entity, 없으면 value object"라는 단순한 규칙으로 보면 안 됩니다. 도메인 맥락이 식별을 요구하느냐가 진짜 기준입니다. 예를 들어 좌표 `(x, y)`는 보통 value object지만, 게임의 "특정 좌표에 설치된 건물"이라면 그 좌표가 entity가 될 수도 있습니다. 같은 데이터 구조라도 도메인이 "이 인스턴스를 추적해야 하는가"를 묻는다면 entity, 아니면 value object입니다.

업무 도메인을 모델링할 때 이 두 분류가 정해져야 다음 단계인 Aggregate(여러 객체의 묶음 + 일관성 단위)로 넘어갈 수 있습니다.
