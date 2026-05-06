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
