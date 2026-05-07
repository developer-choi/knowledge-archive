# DDD(Domain-Driven Design)란 무엇인가?

> Domain-driven design (DDD) is a software design approach that focuses on modeling software to match a domain according to input from that domain's experts.
> DDD is against the idea of having a single unified model; instead it divides a large system into bounded contexts, each of which have their own model.

---

**도입**

"도메인(domain)"은 소프트웨어가 다루는 업무 영역을 말합니다. 쇼핑몰이라면 "주문/결제/배송", 은행 앱이라면 "대출/예금/송금" 같은 것. DDD는 코드 구조를 그 업무 영역에 맞춰 설계하자는 접근법이고, 핵심 주장은 "큰 시스템을 하나의 거대한 모델로 통합하지 말고, 영역별로 작은 모델을 따로 두자"는 것입니다.

---

**본문**

> Domain-driven design (DDD) is a software design approach

DDD는 소프트웨어 설계 접근법이다.

- **software design approach**: 코드를 어떻게 구조화할지에 대한 사고 방식. 프레임워크나 라이브러리가 아니라 "어떤 관점으로 설계할 것인가"의 차원입니다. React가 라이브러리라면 DDD는 "React를 쓸 때 컴포넌트와 비즈니스 로직을 어떻게 나눌까"의 한 답.

> that focuses on modeling software to match a domain

도메인에 부합하도록 소프트웨어를 모델링하는 데 초점을 둔다.

- **modeling software**: 실제 비즈니스 개념을 코드의 클래스/타입/함수로 옮기는 작업. 예: "대출 신청"이라는 업무 개념을 `LoanApplication` 타입으로 만드는 것.
- **match a domain**: 코드 구조가 업무 구조를 반영해야 한다는 뜻. 기획서에 "오퍼", "심사 결과"가 있으면 코드에도 `Offer`, `ReviewResult`가 있어야지, DB 테이블 위주로 `tbl_user_loan_001` 같은 구조를 짜지 않습니다.

> according to input from that domain's experts.

그 도메인 전문가의 입력(의견)에 따라.

- **domain's experts**: 그 업무를 가장 잘 아는 사람들. 개발자가 아니라 기획자·심사역·물류 담당자 등. 코드 구조를 정할 때 이들의 용어와 사고 방식을 그대로 가져옵니다.
- **input from**: 단발성 인터뷰가 아니라 지속적인 협업. 모델은 한 번 정해지고 끝이 아니라 도메인 전문가와 계속 다듬어 나갑니다.

> DDD is against the idea of having a single unified model;

DDD는 하나의 통합된 모델을 두는 아이디어에 반대한다.

- **single unified model**: 시스템 전체가 공유하는 거대한 단일 모델. 예를 들어 "User"라는 타입 하나가 인증, 주문, 배송, 마케팅에서 모두 똑같이 쓰이는 구조.
- **against the idea of**: 이걸 안티패턴으로 본다는 강한 표현. 작은 시스템에서는 통합 모델이 편해 보이지만, 규모가 커지면 한 도메인의 변경이 무관한 도메인을 깨뜨리기 시작합니다.

> instead it divides a large system into bounded contexts,

대신 큰 시스템을 bounded context로 나눈다.

- **bounded contexts**: 모델이 일관되게 적용되는 경계. 같은 "User"라도 인증 컨텍스트의 User와 결제 컨텍스트의 User는 별개 타입으로 둡니다. 이게 없으면 "결제팀이 User에 새 필드를 넣었는데 인증팀 코드가 깨지는" 사태가 반복.
- **divides**: 통합이 아니라 분할이 핵심 동작. 모놀리식 모델 → 다중 모델로 쪼갬.

> each of which have their own model.

각각이 자신만의 모델을 갖는다.

- **their own model**: 컨텍스트별 독립 모델. 같은 단어("주문")라도 컨텍스트마다 의미와 속성이 다를 수 있고, 그게 정상입니다. 결제 컨텍스트의 Order는 "금액·결제수단" 중심, 배송 컨텍스트의 Order는 "주소·배송상태" 중심.

---

**종합**

DDD를 한 줄로 정리하면 "코드 구조를 DB 스키마가 아닌 비즈니스 도메인 구조에 맞추고, 큰 도메인은 더 작은 컨텍스트로 쪼개라"입니다. Eric Evans가 2003년 동명의 책에서 정립한 용어이고, Microsoft도 복잡한 도메인에서 명확한 이점이 있을 때 DDD를 권장합니다.

DDD가 강조하는 세 가지 목표:

| 목표 | 의미 |
|---|---|
| 핵심 도메인 우선 | UI나 인프라가 아니라 비즈니스 로직 레이어를 프로젝트의 1순위로 둔다 |
| 도메인 모델 기반 설계 | 복잡한 설계를 도메인 모델 위에서 전개한다 |
| 기술자×전문가 협업 | 개발자와 도메인 전문가가 모델을 반복적으로 다듬는다 |

프론트엔드 개발자가 일상에서 마주치는 형태로 보면, "User", "Order" 같은 타입 정의를 어디에 둘 것인가의 문제입니다. 안티패턴은 `types/User.ts` 하나에 모든 페이지가 의존하는 구조. DDD 관점이라면 `auth/types/User.ts`, `checkout/types/User.ts`로 컨텍스트별로 분리합니다. 처음에는 중복처럼 보이지만, 결제 화면에서 새 필드(예: `lastPaidAt`)를 추가할 때 인증 화면이 영향받지 않게 됩니다.

오개념 예방: DDD는 "더 정교하게 만들기"가 아니라 "어디서 분할선을 긋느냐"의 문제입니다. 작은 CRUD 앱에 DDD를 무리하게 적용하면, 분리 자체가 비용이 되어 보일러플레이트만 늘어납니다. 다음 질문(DDD가 모든 프로젝트에 적합한가)에서 그 한계가 드러나니, 여기서는 "큰 시스템을 컨텍스트로 쪼갠다"는 핵심 동작에만 집중하면 됩니다.

---

# DDD에서 Ubiquitous Language란 무엇인가?

> These aspects of domain-driven design aim to foster a common language shared by domain experts, users, and developers—the ubiquitous language.
> The ubiquitous language is used in the domain model and for describing system requirements.
> Ubiquitous language is one of the pillars of DDD together with strategic design and tactical design.

---

**도입**

같은 시스템을 두고 기획자는 "오퍼 승인", 개발자는 "approve", DB 스키마는 `is_accepted`라고 부르는 상황이 흔합니다. 회의 때마다 단어를 번역하느라 시간이 새고, 새 사람이 들어오면 용어 매핑부터 익혀야 합니다. ubiquitous language(편재 언어)는 이 번역 비용을 0으로 만들기 위한 합의입니다.

---

**본문**

> These aspects of domain-driven design aim to foster a common language

DDD의 이러한 측면들은 공통 언어를 육성하는 것을 목표로 한다.

- **aspects of domain-driven design**: 앞 질문에서 본 "도메인 전문가와의 협업", "도메인 모델링" 같은 DDD의 구성 요소들을 가리킵니다.
- **foster**: "기르다·육성하다". 단발성 약속이 아니라 시간이 흐르면서 다듬어지는 것. 첫 회의에서 결정되고 끝나는 게 아닙니다.
- **common language**: 모두가 쓰는 같은 단어 집합. 이게 없으면 같은 개념을 부르는 단어가 역할별로 갈라져, 동일한 기능을 두고 두 명이 다른 이야기를 하고 있는 줄도 모릅니다.

> shared by domain experts, users, and developers—the ubiquitous language.

도메인 전문가, 사용자, 개발자가 공유하는 — 즉 ubiquitous language이다.

- **shared by**: 세 그룹 모두가 같이 쓴다는 게 핵심. 한쪽만 쓰는 용어집이 아니라 **세 그룹의 교집합**.
- **ubiquitous (편재하는)**: "어디에나 있는". 코드, 기획서, 회의 발화, 요구사항 문서, 슬랙 메시지 어디서든 같은 단어가 등장해야 한다는 의미. 일부 문서에만 적용되는 게 아닙니다.

> The ubiquitous language is used in the domain model

ubiquitous language는 도메인 모델에서 사용된다.

- **used in the domain model**: 코드의 클래스명·메서드명·필드명이 그 언어를 따른다는 뜻. 기획서는 "오퍼 승인"인데 코드는 `acceptOffer()`처럼 영문이긴 하되 직역으로 매핑되어야지, `processItem()` 같은 일반화된 이름으로 흐려지지 않아야 합니다.

> and for describing system requirements.

그리고 시스템 요구사항을 기술할 때도 사용된다.

- **describing system requirements**: 요구사항 문서·티켓·QA 시나리오·릴리스 노트 모두 같은 용어를 씁니다. 코드와 문서가 같은 단어를 쓰면 신규 입사자가 코드와 기획서를 한 화면에 띄워놓고도 매핑 없이 읽을 수 있습니다.

> Ubiquitous language is one of the pillars of DDD

ubiquitous language는 DDD의 기둥(pillar) 중 하나이다.

- **pillar**: 건물을 떠받치는 기둥. "있으면 좋은 것"이 아니라 "없으면 무너지는 핵심 구조물"이라는 강조. 앞 질문에서 봤듯 DDD의 본질이 도메인 전문가와의 협업인데, 그 협업이 통하려면 같은 언어가 전제되어야 합니다.

> together with strategic design and tactical design.

전략적 설계, 전술적 설계와 함께.

- **strategic design**: 큰 그림 — bounded context를 어떻게 나누고 컨텍스트 간 관계를 어떻게 정할 것인가. 앞 질문의 "큰 시스템을 컨텍스트로 분할"이 여기에 해당.
- **tactical design**: 실제 구현 패턴 — Entity·Value Object·Aggregate 같은 구체적인 모델링 도구들. 다음 질문들에서 다루는 주제.

---

**종합**

ubiquitous language의 운영 원칙을 표로 정리하면:

| 영역 | 적용 형태 |
|---|---|
| 코드 | 클래스명·메서드명·필드명이 도메인 용어 그대로 (`LoanApplication`, `acceptOffer()`) |
| 기획서 | "대출 신청", "오퍼 승인"이라는 동일한 한국어 표현 사용 |
| 회의 | 같은 단어로 말함. 개발자가 "approve" 대신 "오퍼 승인"이라 부름 |
| QA·릴리스 노트 | 같은 용어 |

대출 심사 시스템 예시가 이해에 도움이 됩니다. 코드에 `LoanApplication`, `acceptOffer()`로 쓰고, 기획서에서도 "대출 신청", "오퍼 승인"이라는 동일한 용어를 쓰는 것. 만약 기획서는 "오퍼 승인"인데 코드는 `processOfferStatus()`로 추상화되어 있으면, 기획자가 "오퍼 승인 로직"을 물어볼 때 개발자는 "그건 status를 ACCEPTED로 바꾸는 처리예요"로 번역해서 답해야 합니다 — 매번.

프론트엔드 맥락에서 보면, React 컴포넌트 이름과 props 이름에도 적용됩니다. 결제 페이지의 "주문 확정 버튼"이라면 `OrderConfirmButton`이지 `SubmitButton` 같은 일반 이름이 아닙니다. 한 도메인 안에서는 비기술자가 봐도 무엇을 하는 컴포넌트인지 추측할 수 있어야 한다는 게 ubiquitous language의 프론트엔드 적용 형태입니다.

오개념 예방: ubiquitous language는 "용어집을 만들어 위키에 올리기"가 아닙니다. 그건 1회성 산출물이고 한 달 후엔 코드와 어긋납니다. 핵심은 **도메인 전문가와 개발자가 같은 단어를 일상적으로 입에 올리며 모델을 같이 다듬는 과정** — 회의에서 누가 다른 단어를 쓰면 즉시 짚어 통일하는, 살아있는 합의입니다.

---

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

---

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

---

# DDD는 모든 프로젝트에 적합한가?

> Critics of domain-driven design argue that developers must typically implement a great deal of isolation and encapsulation to maintain the model as a pure and helpful construct.
> While domain-driven design provides benefits such as maintainability, Microsoft recommends it only for complex domains where the model provides clear benefits in formulating a common understanding of the domain.

---

**도입**

앞 질문들에서 DDD의 핵심 도구들(bounded context, ubiquitous language, Entity/Value Object, Aggregate)을 봤습니다. 강력해 보이지만, 모든 프로젝트에 다 적용해야 할까요? 결론부터 말하면 **아니다**입니다. DDD에는 비용이 있고, 도메인이 충분히 복잡할 때만 그 비용이 정당화됩니다.

---

**본문**

> Critics of domain-driven design argue

DDD 비판자들은 ~라고 주장한다.

- **critics**: DDD를 만능 해법으로 받아들이는 것에 반대하는 입장. DDD 자체를 부정하는 게 아니라, 적용 범위를 제한해야 한다는 시각.

> that developers must typically implement a great deal of isolation and encapsulation

개발자가 보통 상당한 양의 격리(isolation)와 캡슐화(encapsulation)를 구현해야 한다는 점.

- **isolation**: 도메인 모델을 외부 세계(DB, HTTP, 프레임워크)로부터 분리하는 것. 도메인 코드가 ORM이나 HTTP 객체를 직접 참조하지 않게 하는 작업.
- **encapsulation**: 도메인 객체의 내부 상태를 외부에서 직접 조작하지 못하게 막는 것. 앞 질문의 aggregate 규칙이 그 예.
- **a great deal of**: "꽤 많은 양". 이 작업이 사소하지 않고, 보일러플레이트 비용을 만든다는 강조. 핵심 도메인 코드 1줄 짜기 위해 매핑 코드 10줄을 추가로 써야 하는 상황이 흔합니다.

> to maintain the model as a pure and helpful construct.

모델을 순수하고 유용한 구조물로 유지하기 위해.

- **pure construct**: 인프라(DB·HTTP·프레임워크) 의존이 없는 도메인 모델. "User 객체 안에 ORM 디코레이터가 박혀 있지 않은" 상태.
- **helpful**: 비즈니스 규칙을 모델 자체가 표현하고 강제하는 것. 단순한 데이터 컨테이너가 아니라 "행동을 가진 객체".
- **이게 없으면 어떻게 되는가**: 격리·캡슐화 없이 그냥 도메인 객체에 DB 어노테이션과 HTTP 직렬화 코드를 다 박으면, 도메인 모델이 인프라 변화에 끌려다닙니다. DB를 바꾸면 도메인이 깨지고, API 응답 포맷을 바꾸면 비즈니스 로직이 깨집니다.

> While domain-driven design provides benefits such as maintainability,

DDD가 유지보수성 같은 이점을 제공하는 한편,

- **maintainability**: 변경 비용이 시간이 흘러도 폭발하지 않는 성질. 도메인이 잘 모델링되면 새 기능 추가나 규칙 변경이 국소화됩니다.
- **While ~ ,**: 양보 구문. "이점이 있긴 한데"의 한계가 다음 절에서 옵니다.

> Microsoft recommends it only for complex domains

마이크로소프트는 복잡한 도메인에 한해서만 DDD를 권장한다.

- **only for**: 모든 곳이 아니라 한정된 곳. 단순한 CRUD 앱에는 권장하지 않는다는 의미가 강하게 들어 있습니다.
- **complex domains**: 비즈니스 규칙이 많고, 같은 개념이 컨텍스트마다 다르게 해석되며, 도메인 전문가와의 깊은 협업이 필요한 영역. 보험·금융·의료·물류 등이 전형. 단순한 게시판·CRUD 관리도구는 여기 해당하지 않습니다.

> where the model provides clear benefits in formulating a common understanding of the domain.

모델이 도메인에 대한 공통 이해를 형성하는 데 명확한 이점을 제공하는 경우.

- **formulating a common understanding**: 도메인 전문가와 개발자가 같은 모델을 공유함으로써 의사소통 비용이 줄어든다는 효과. 앞 질문의 ubiquitous language가 그 대표 도구.
- **clear benefits**: "어쩌면 좋을지도"가 아니라 명확하게 이익이 보일 때만. 의심스러우면 적용하지 말라는 함의.

---

**종합**

DDD 적용 의사결정을 표로 정리하면:

| 상황 | DDD 적합성 | 이유 |
|---|---|---|
| 단순 CRUD 앱 | ✗ 부적합 | 격리·캡슐화 비용 > 얻는 이익 |
| 복잡한 비즈니스 로직 | ✓ 적합 | 모델링이 의사소통·유지보수 비용을 절감 |
| 도메인 전문가 협업 가능 | ✓ 적합 | ubiquitous language·모델 정제가 가능 |
| 도메인 전문가와 단절 | ✗ 부적합 | DDD의 핵심 동력이 빠짐 |

답을 한 줄로 요약하면 "아니다"입니다. 단순한 CRUD 앱에 DDD를 적용하면 도메인 모델을 인프라(DB, HTTP)로부터 격리하는 보일러플레이트 비용이 얻는 이점보다 큽니다. 게시판 하나 만드는데 Entity / Repository / Domain Service / Application Service 레이어를 다 쌓으면, 코드 양은 5배 늘어나고 변경 속도는 느려지는데 도메인이 단순해서 그 구조가 보호하는 복잡성도 없습니다.

프론트엔드 맥락에서 보면, 모든 React 프로젝트가 도메인 모델 레이어를 분리할 필요는 없습니다. 단순한 마케팅 페이지라면 API 응답을 그대로 화면에 그리는 게 합리적입니다. 반면 복잡한 SaaS 대시보드(여러 비즈니스 규칙이 얽힌 결제·정산·구독 화면)라면 도메인 모델을 별도 레이어로 빼고, API 호출 레이어와 분리해두는 것이 장기적으로 변경 비용을 낮춥니다.

오개념 예방: "큰 회사니까 DDD를 써야 한다", "마이크로서비스니까 DDD"는 둘 다 잘못된 추론입니다. 회사 규모나 아키텍처가 아니라 **도메인 자체의 복잡도**가 기준입니다. 작은 보험사의 도메인은 큰 게시판 서비스보다 복잡할 수 있고, 그러면 작은 보험사가 DDD를 써야 하지 큰 게시판이 써야 하는 게 아닙니다.

DDD를 도입할지 말지의 판정 기준은 단순합니다 — "도메인 전문가와 같은 단어로 모델을 이야기할 만한 가치가 있는 영역인가". 그렇다면 DDD가 그 협업의 도구가 되어줍니다. 그렇지 않다면 더 가벼운 구조가 낫습니다.
