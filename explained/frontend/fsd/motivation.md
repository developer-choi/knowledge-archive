# 기존의 설계 원칙(SOLID, DRY 등)이 있는데도 FSD 같은 구체적 방법론이 필요한 이유는 무엇인가?

## 도입

SOLID나 DRY 같은 설계 원칙은 좋은 코드가 무엇인지를 설명하지만, "폴더를 어떻게 나누고 파일을 어디에 놓는가"라는 실천 질문에는 답하지 않는다. 원칙과 방법론 사이의 간극이 FSD가 존재하는 이유다.

---

## 본문

> The existence of principles alone is not enough to design a good architecture.

"원칙의 존재만으로는 좋은 아키텍처를 설계하기에 충분하지 않다."

- **existence of principles alone**: 원칙의 존재만으로. 원칙을 알고 있다는 것과 그것을 실제 파일 구조로 번역할 수 있다는 것은 다른 능력이다.

> Not everyone knows them completely, even fewer understand and apply them correctly.

"모든 사람이 원칙을 완전히 알지 못하며, 올바르게 이해하고 적용하는 사람은 더 적다."

- **apply them correctly**: 올바르게 적용. 원칙은 추상적이라 같은 팀에서도 사람마다 해석이 달라 코드베이스가 일관성 없이 분열된다.

> The design principles are too general, and do not give a specific answer to the question: "How to design the structure and architecture of a scalable and flexible application?"

"설계 원칙은 너무 일반적이며, '확장 가능하고 유연한 애플리케이션의 구조와 아키텍처를 어떻게 설계하는가?'라는 질문에 구체적인 답을 주지 않는다."

- **too general**: 너무 일반적. SOLID는 "단일 책임 원칙을 지켜라"고 말하지만, 어느 파일이 어느 폴더에 들어가야 하는지는 말하지 않는다.
- **scalable and flexible**: 확장 가능하고 유연한. 원칙이 목표를 설명할 뿐, 달성 방법은 개인 해석에 맡긴다.

FSD의 역할:

```
원칙         무엇이 좋은가     (목표)
  ↓
  ?          어떻게 하는가     (방법 부재)
  ↓
FSD          레이어·슬라이스·세그먼트라는 구체적 구조 제공
             → "이 코드는 features/follow-user/api/ 에 들어간다"
```

---

## 종합

SOLID를 아는 팀원 10명이 서로 다른 폴더 구조를 만들면 코드베이스는 10가지 스타일이 혼재하는 정글이 된다. FSD는 "어디에 넣는가"의 답을 레이어-슬라이스-세그먼트라는 구체적 체계로 표준화한다. 원칙이 목표를 선언한다면, FSD는 그 목표에 도달하는 지도를 제공한다.

---

# FSD는 MVP 단계에서도 적용할 수 있는가? MVP에서는 아키텍처보다 기능이 중요하지 않은가?

## 도입

"MVP에는 기능이 먼저고 아키텍처는 나중에"라는 믿음이 있다. FSD 공식 문서는 이 명제를 수용하면서도, MVP에서도 방법론의 핵심 개념을 아는 것이 결국 리팩토링 비용을 줄인다는 입장이다.

---

## 본문

> The methodology can benefit the project both at the stage of project support and development, and at the MVP stage.

"방법론은 프로젝트 지원·개발 단계와 MVP 단계 모두에서 프로젝트에 도움을 줄 수 있다."

- **benefit**: 도움을 주다. 완전한 FSD를 적용하지 않더라도 방법론을 아는 것 자체가 이점이 된다.

> Yes, the most important thing for MVP is "features, not the architecture laid down for the future".

"맞다, MVP에서 가장 중요한 것은 '미래를 위해 깔아두는 아키텍처가 아니라 기능'이다."

- **features, not the architecture laid down for the future**: 기능 우선, 미래 대비 아키텍처는 부차적. 공식 문서가 "기능이 먼저"라는 일반 통념을 인정하는 지점이다.

> But even in conditions of limited deadlines, knowing the best-practices from the methodology, you can "do with little blood", when designing the MVP version of the system, finding a reasonable compromise.

"하지만 촉박한 데드라인에서도, 방법론의 베스트 프랙티스를 알고 있으면 시스템의 MVP 버전을 설계할 때 합리적인 타협점을 찾아 '적은 희생으로' 할 수 있다."

- **do with little blood**: 적은 희생으로. 완전히 적용하지 않더라도 레이어 개념과 의존성 방향 규칙 정도만 지켜도 나중에 확장할 때 리팩토링 비용이 줄어든다.
- **reasonable compromise**: 합리적 타협. 6개 레이어 전부가 아니라 가장 핵심적인 규칙(단방향 의존성, 슬라이스 격리)만 적용하는 방식.

---

## 종합

MVP에서 FSD를 100% 적용할 필요는 없다. 그러나 "레이어 개념을 모르는 채로 자유롭게" 짜는 것과 "레이어를 알고 필요한 것만 선택적으로 지키는 것"은 결과가 다르다. 후자는 나중에 코드를 FSD로 이전할 때 구조를 최소화해서 바꾸면 된다. MVP 코드도 결국 누군가가 유지보수한다 — 방법론의 핵심 원칙을 이해하고 의식적으로 타협하는 것이 무의식적 혼돈보다 낫다.
