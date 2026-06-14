# DDD(Domain-Driven Design)란 무엇인가?

## 도입

DDD는 소프트웨어 설계를 기술 구조가 아니라 비즈니스 도메인 중심으로 조직하는 접근법이다. 핵심 발상은 "소프트웨어 모델이 비즈니스 전문가가 쓰는 언어와 개념을 그대로 반영해야 한다"는 것이다. 2003년 Eric Evans가 정립했으며, 단일 통합 모델 대신 시스템을 여러 Bounded Context로 쪼갠다.

---

## 본문

> Domain-driven design (DDD) is a software design approach that focuses on modeling software to match a domain according to input from that domain's experts.

"DDD는 도메인 전문가의 입력을 바탕으로 소프트웨어를 그 도메인에 맞게 모델링하는 데 초점을 맞춘 소프트웨어 설계 접근법이다."

- **domain**: 소프트웨어가 해결하려는 현실 세계의 문제 영역. 대출 심사, 전자상거래 주문, 물류 배송 등이 각각 하나의 도메인이다.
- **modeling**: 도메인의 핵심 개념과 규칙을 코드 구조로 옮기는 행위. 클래스명, 메서드명, 폴더 구조가 이 모델을 반영한다.
- **domain's experts**: 개발자가 아닌 비즈니스 전문가. 대출 심사라면 심사 담당자, 리스크 분석가가 여기에 해당한다.

> DDD is against the idea of having a single unified model; instead it divides a large system into bounded contexts, each of which have their own model.

"DDD는 하나의 통합 모델을 갖자는 생각에 반대한다. 대신 큰 시스템을 여러 Bounded Context로 쪼개고 각각이 자신만의 모델을 갖는다."

- **single unified model**: "전사 공통 모델"처럼 모든 팀이 같은 엔티티 정의를 공유하는 방식. 규모가 커질수록 한 팀의 변경이 다른 팀을 깨뜨린다.
- **bounded contexts**: 모델의 경계. React 앱으로 치면 Feature Slice Design(FSD)의 슬라이스 경계와 비슷하다. 경계 안에서만 유효한 개념과 규칙이 있다.

> Domain-driven design is predicated on the following goals: placing the project's primary focus on the core domain and domain logic layer; basing complex designs on a model of the domain; initiating a creative collaboration between technical and domain experts to iteratively refine a conceptual model.

"DDD는 다음 목표들을 전제로 한다: 프로젝트의 최우선 초점을 핵심 도메인과 도메인 로직 레이어에 두기; 복잡한 설계를 도메인 모델에 기반하기; 기술 전문가와 도메인 전문가 사이의 창의적 협업을 시작해 개념 모델을 반복적으로 다듬기."

- **predicated on**: "~을 전제로 성립한다". DDD가 효과를 발휘하려면 이 목표들이 팀 전체 약속으로 존재해야 한다는 뜻이다.
- **core domain**: 비즈니스 경쟁력의 핵심. 외부 라이브러리나 인프라가 아니라 이 영역에 설계 에너지를 집중한다.
- **iteratively refine**: 도메인 모델은 처음부터 완벽하게 설계할 수 없다. 개발하면서 비즈니스 전문가와 대화하며 점진적으로 개선한다.

```
DDD 핵심 구조
├── Core Domain          비즈니스 경쟁력의 핵심 영역 (설계 에너지 집중)
├── Bounded Context      모델이 유효한 경계 단위
│   ├── Ubiquitous Language  경계 안 공통 언어
│   ├── Entities             식별자로 구분되는 객체
│   ├── Value Objects        값으로만 구분되는 불변 객체
│   └── Aggregates           일관성 경계 묶음 (Root를 통해서만 접근)
└── Domain Model         도메인 전문가와 공유하는 추상화 체계
```

---

## 종합

DDD가 없으면 코드의 클래스명·메서드명이 비즈니스 언어와 어긋나고, 기획서와 코드 사이에 "번역" 작업이 생긴다. `processLoanReview()`가 아니라 `updateRow()` 같은 이름이 되면 비즈니스 전문가와 협업할 수 없다. FSD를 쓰는 프론트엔드 팀이라면 슬라이스 경계가 Bounded Context에, 슬라이스 내부 API가 Ubiquitous Language에 대응한다. DDD는 기술 결정이라기보다 팀 전체의 언어와 경계 약속이다.

---

# DDD에서 Ubiquitous Language란 무엇인가?

## 도입

Bounded Context마다 코드와 기획서, 회의 모두 같은 단어를 쓰도록 강제하는 약속이 Ubiquitous Language다. 개발자가 코드에서 쓰는 이름과 비즈니스 전문가가 문서에서 쓰는 이름이 달라지면, 두 세계 사이에 항상 번역 비용이 발생한다.

---

## 본문

> These aspects of domain-driven design aim to foster a common language shared by domain experts, users, and developers—the ubiquitous language.

"DDD의 이 측면들은 도메인 전문가, 사용자, 개발자 사이에 공유되는 공통 언어 — Ubiquitous Language — 를 키워내는 것을 목표로 한다."

- **foster**: 단순히 "만든다"가 아니라 "길러낸다". Ubiquitous Language는 문서 한 장으로 선언되는 게 아니라 지속적인 대화와 협업을 통해 자라난다.
- **ubiquitous**: "어디에나 있는". 코드, 기획서, 회의, 슬랙 메시지까지 같은 단어가 쓰여야 한다는 의미다.

> The ubiquitous language is used in the domain model and for describing system requirements.

"Ubiquitous Language는 도메인 모델과 시스템 요구사항 기술 양쪽에서 사용된다."

> Ubiquitous language is one of the pillars of DDD together with strategic design and tactical design.

"Ubiquitous Language는 전략 설계·전술 설계와 함께 DDD의 세 기둥 중 하나다."

- **pillars**: 기둥. 하나라도 빠지면 DDD가 성립하지 않는다는 의미의 은유다.
- **strategic design**: Bounded Context 식별, Context Map 등 시스템 전체 경계를 설계하는 단계.
- **tactical design**: Aggregate, Entity, Value Object, Repository 등 Bounded Context 안의 세부 패턴을 설계하는 단계.

클래스명·메서드명뿐 아니라 기획서·회의·요구사항 문서까지 같은 용어를 써야 한다. 대출 심사 시스템이라면 코드에 `LoanApplication`, `acceptOffer()`를 쓰고, 기획서와 회의에서도 "대출 신청", "오퍼 승인"이라는 동일한 표현을 고수한다.

---

## 종합

Ubiquitous Language가 없으면 기획자가 "오퍼 승인"이라고 하는데 코드에는 `updateStatus(true)`만 있어서, 새 팀원이 코드로 비즈니스를 추론하기 어려워진다. React 컴포넌트 관점으로 보면 `<LoanApplicationForm>`, `<OfferAcceptButton>` 같은 이름이 Ubiquitous Language를 따른 것이고, `<FormStep3>`, `<ConfirmButton>` 같은 이름은 그렇지 않은 것이다. 언어 통일이 리팩토링보다 먼저다 — 이름이 맞아야 설계도 맞아간다.

---

# DDD에서 Entity와 Value Object의 핵심 차이는?

## 도입

도메인 모델 안에서 객체를 두 가지로 구분한다. 하나는 "무엇인지"보다 "누구인지"가 중요한 Entity, 다른 하나는 "누구인지"보다 "무엇인지"가 중요한 Value Object다. 구분 기준은 단순하다 — 식별자(identity)가 있느냐, 없느냐.

---

## 본문

> An entity is an object defined not by its attributes, but its identity.

"Entity는 속성이 아니라 식별자로 정의되는 객체다."

- **attributes**: 객체가 가진 값들. 이름, 나이, 좌석 번호 등.
- **identity**: 식별자. 속성이 모두 같아도 다른 존재로 구분할 수 있게 해주는 고유 ID.

> As an example, most airlines assign a unique number to seats on every flight: this is the seat's identity.

"대부분의 항공사는 모든 비행기 좌석에 고유 번호를 부여한다. 이것이 좌석의 식별자다."

좌석 12A는 속성(아이슬 창가, 비상구 옆 등)이 바뀌어도 12A라는 번호로 계속 추적된다. React의 `key` prop이 리스트 항목에 식별자를 부여하는 것과 같은 원리다.

> In contrast, a value object is an immutable object that contains attributes but has no conceptual identity.

"반대로 Value Object는 속성을 담고 있지만 개념적 식별자가 없는 불변 객체다."

- **immutable**: 불변. Value Object를 "바꾼다"는 개념이 없고, 새 값을 만들어 교체한다.
- **no conceptual identity**: "이 특정 객체"를 추적할 필요가 없다. 같은 값이면 같은 것이다.

> When people exchange business cards, for instance, they only care about the information on the card (its attributes) rather than trying to distinguish between each unique card.

"명함을 교환할 때 사람들은 카드에 적힌 정보(속성)에만 관심을 두지, 개별 카드를 구분하려 하지 않는다."

명함의 이름·전화번호가 같으면 어느 명함이든 동일하다. React의 props 객체처럼 값이 같으면 교체 가능하다.

```
Entity vs Value Object
┌─────────────────────────────────────────────────────┐
│               Entity                                │
│  식별자(ID) 로 구분     속성이 달라도 같은 Entity     │
│  예: 항공 좌석 12A, 사용자 계정 userId=42            │
│  변경 후에도 추적 가능                               │
├─────────────────────────────────────────────────────┤
│               Value Object                          │
│  값으로 구분           같은 값 = 같은 것              │
│  예: 명함, 금액(10,000원), 좌표(x:3, y:5)            │
│  불변 — "바꾸기" 대신 새 값 생성                     │
└─────────────────────────────────────────────────────┘
```

---

## 종합

실무에서 혼동이 자주 발생하는 지점은 "이 개념이 ID가 필요한가?"라는 질문이다. 사용자 계정은 같은 이름·이메일이어도 다른 사람일 수 있으니 Entity다. 결제 금액 `10,000원`은 어느 `Money` 객체인지 추적할 필요가 없으니 Value Object다. Redux 상태에서 배열 항목에 `id`를 붙이는 패턴이 Entity를 다루는 방식이고, 상태값 `{ currency: 'KRW', amount: 10000 }`처럼 동등성 비교로 처리하는 것이 Value Object를 다루는 방식이다.

---

# DDD에서 Aggregate란 무엇이며, 왜 외부에서 루트만 참조하도록 제한하는가?

## 도입

도메인 모델에서 여러 객체가 하나의 일관성 단위로 묶여야 할 때가 있다. 그 묶음을 Aggregate라고 하고, 외부에서는 반드시 묶음의 대표(Root)를 통해서만 접근하도록 제한한다. 이 제한이 없으면 묶음 내부를 직접 수정하는 코드가 퍼져서 비즈니스 규칙을 보장하기 어렵다.

---

## 본문

> Models can be bound together by a root entity to become an aggregate.

"모델들은 루트 엔티티로 묶여 Aggregate가 될 수 있다."

- **bound together**: 단순한 참조가 아니라 일관성 책임을 공유하는 묶음.
- **root entity**: Aggregate의 진입점. 외부에서 Aggregate와 소통하는 유일한 창구다.

> Objects outside the aggregate are allowed to hold references to the root but not to any other object of the aggregate.

"Aggregate 외부의 객체는 루트에 대한 참조는 가질 수 있지만, Aggregate 내부의 다른 객체에 대한 참조는 가질 수 없다."

- **hold references**: 변수나 필드에 해당 객체를 담는 것. 외부 컴포넌트가 내부 객체를 직접 변수로 들고 있으면 안 된다.

> The aggregate root checks the consistency of changes in the aggregate.

"Aggregate 루트는 Aggregate 안의 변경 일관성을 검사한다."

- **checks the consistency**: 비즈니스 규칙 위반 여부를 루트가 게이트키퍼로서 검사한다. 모든 변경이 루트를 거쳐야만 이 검사가 보장된다.

> Drivers do not have to individually control each wheel of a car, for instance: they simply drive the car. In this context, a car is an aggregate of several other objects (the engine, the brakes, the headlights, etc.).

"운전자는 자동차의 각 바퀴를 개별적으로 제어할 필요가 없다. 그냥 차를 운전하면 된다. 이 맥락에서 자동차는 엔진, 브레이크, 헤드라이트 등 여러 객체의 Aggregate다."

```
Aggregate 접근 규칙

외부 (다른 Aggregate, 서비스)
        │
        ▼ 루트만 참조 가능
┌───────────────────────────────────┐
│  Aggregate Root (예: Order)       │
│  ┌──────────┐  ┌──────────────┐  │
│  │ OrderItem│  │ ShippingInfo │  │
│  └──────────┘  └──────────────┘  │
│          ← 외부 직접 접근 불가  →  │
└───────────────────────────────────┘

외부에서 OrderItem을 직접 수정 → Root의 일관성 검사 우회 → 규칙 위반 가능
외부에서 Order.addItem() 호출  → Root가 검사 후 내부 수정 → 규칙 보장
```

외부에서 루트만 참조하도록 제한하는 이유는 명확하다 — 내부 객체를 직접 수정하면 루트가 일관성 검사를 할 수 없게 되어 비즈니스 규칙이 뚫린다.

---

## 종합

Redux에서 `store.dispatch(action)`를 통해서만 상태를 바꾸고 `store.state.todos[0].done = true`처럼 직접 수정하지 못하게 하는 패턴이 Aggregate Root 제약과 구조적으로 같다. 직접 수정을 허용하면 어떤 코드가 어디서 상태를 바꿨는지 추적하기 어려워지고, 불변 규칙(예: 완료된 주문에 항목 추가 불가)을 강제할 지점이 사라진다. Aggregate는 일관성 경계이고, 루트는 그 경계의 게이트키퍼다.

---

# DDD는 모든 프로젝트에 적합한가?

## 도입

DDD는 도메인 모델을 인프라(DB, HTTP)로부터 격리하는 상당한 보일러플레이트 비용을 수반한다. 이 비용을 정당화하려면 그만큼 복잡한 도메인이 있어야 한다. 단순한 CRUD 앱에 DDD를 도입하면 득보다 실이 크다.

---

## 본문

> Critics of domain-driven design argue that developers must typically implement a great deal of isolation and encapsulation to maintain the model as a pure and helpful construct.

"DDD 비판론자들은 개발자가 모델을 순수하고 유용한 구조체로 유지하려면 상당한 양의 격리와 캡슐화를 구현해야 한다고 주장한다."

- **isolation**: 도메인 모델을 DB 스키마나 HTTP 응답 형식에서 격리하는 것. 별도의 Repository 인터페이스, DTO 변환 레이어가 필요하다.
- **encapsulation**: 내부 구현을 숨기는 것. Aggregate Root 규칙, Value Object 불변성 유지 등이 캡슐화 비용에 해당한다.
- **pure and helpful construct**: DDD의 이상 — 도메인 모델이 비즈니스 규칙만 순수하게 담고 기술 세부사항은 없는 상태.

> While domain-driven design provides benefits such as maintainability, Microsoft recommends it only for complex domains where the model provides clear benefits in formulating a common understanding of the domain.

"DDD는 유지보수성 같은 이점을 제공하지만, Microsoft는 복잡한 도메인 — 모델이 공통 이해 형성에 명확한 이점을 제공하는 경우 — 에만 DDD를 권장한다."

- **complex domains**: 비즈니스 규칙이 많고, 여러 전문가 집단이 개입하며, 변경이 잦은 영역. 대출 심사, 보험 적용 규칙, 물류 최적화 등.
- **formulating a common understanding**: 코드가 비즈니스 전문가와의 공통 이해를 형성하는 도구가 되는 것. 단순 CRUD라면 이 이점이 없다.

답은 "아니다". 단순한 CRUD 앱에 DDD를 적용하면, 도메인 모델을 인프라로부터 격리하는 보일러플레이트 비용이 얻는 이점보다 크다.

---

## 종합

DDD를 적용할지 판단할 때 핵심 질문은 "비즈니스 규칙이 복잡해서 코드와 전문가 언어를 정렬할 이점이 있는가?"다. 게시판 CRUD API, 단순 폼 저장 앱이라면 DDD 없이 직접 DB를 다루는 스크립트가 더 빠르다. 반대로 주문·재고·배송이 복잡하게 얽힌 커머스 백엔드라면 DDD의 Bounded Context 경계가 팀 간 충돌을 막아준다. 프론트엔드에서도 FSD 레이어 경계가 복잡한 앱에서 효과적이고, 투두리스트에는 과설계인 것과 같은 논리다.
