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
