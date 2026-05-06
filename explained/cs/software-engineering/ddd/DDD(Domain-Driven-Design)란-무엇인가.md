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
