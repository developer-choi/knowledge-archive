# Testing Pyramid 대신 Testing Trophy를 쓰는 이유는?

## 도입

Testing Pyramid는 비용·속도를 기준으로 unit을 가장 많이 쓰라고 한다. Kent C. Dodds는 이 두 축 외에 자신감(confidence)이라는 세 번째 축을 추가하면 결론이 달라진다고 주장한다.

---

## 본문

> As you move up the testing trophy, the tests become more costly. This comes in the form of actual money to run the tests in a continuous integration environment, but also in the time it takes engineers to write and maintain each individual test.

"Trophy에서 위로 갈수록 테스트는 더 비용이 많이 든다. CI 환경에서 테스트를 실행하는 실제 비용과 엔지니어가 각 테스트를 작성·유지하는 데 걸리는 시간의 형태로."

> Of course we shouldn't do that and this is because of one super important principle: The more your tests resemble the way your software is used, the more confidence they can give you.

"물론 그래서는 안 되는데, 이는 한 가지 매우 중요한 원칙 때문이다: 테스트가 소프트웨어의 사용 방식과 더 닮을수록, 더 많은 자신감을 줄 수 있다."

```
Testing Pyramid vs Testing Trophy

Pyramid 고려 축: 비용 + 속도
  → unit을 최대로 (싸고 빠르니까)

Trophy 고려 축: 비용 + 속도 + confidence
  → integration을 최대로 (세 축의 최적 균형)

confidence 축이 추가되면
  unit만 가득 채워도 사용자 경험 보장이 안 됨
  → integration이 최적 균형점이 됨
```

> What does this mean? It means that there's no better way to ensure that your Aunt Marie will be able to file her taxes using your tax software than actually having her do it.

"이것이 무엇을 의미하는가? 세금 소프트웨어를 사용하는 Aunt Marie가 세금 신고를 할 수 있다는 것을 보장하는 가장 좋은 방법은 실제로 그녀가 하게 하는 것임을 의미한다."

- **Aunt Marie**: 실제 사용자 대표. manual testing의 극한 형태. confidence는 최고지만 비용·속도가 최악이다.

---

## 종합

Pyramid는 비용·속도를 최적화하다 보니 unit을 가장 많이 쓰게 된다. 그런데 unit test를 아무리 많이 써도 "실제 사용자가 이 소프트웨어를 쓸 수 있는가"를 보장하지 못한다. Trophy는 Aunt Marie(manual testing)와 unit 사이에서 최적 균형점을 integration으로 설정한다. 비용·속도에서 unit보다 나쁘지만, confidence에서 unit보다 훨씬 낫다. 세 축을 동시에 고려하면 integration이 가장 큰 비중을 차지하는 것이 합리적이다.

---

---

# 100% 코드 커버리지가 적절한 경우는 언제인가?

## 도입

애플리케이션 코드에서는 100%가 역효과지만, 특정 조건에서는 100%가 합리적이다. 그 조건 두 가지를 명확히 이해하면 커버리지 목표를 상황에 맞게 설정할 수 있다.

---

## 본문

> Almost all of my open source projects have 100% code coverage. This is because most of my open source projects are smaller libraries and tools that are reusable in many different situations (a breakage could lead to a serious problem in a lot of consuming projects) and they're relatively easy to get 100% code coverage on anyway.

"내 오픈소스 프로젝트의 거의 전부가 100% 코드 커버리지를 가진다. 내 오픈소스 프로젝트 대부분이 다양한 상황에서 재사용되는 소규모 라이브러리와 도구이기 때문이다 (깨지면 많은 소비 프로젝트에서 심각한 문제가 생길 수 있다). 그리고 어쨌든 100% 코드 커버리지 달성이 상대적으로 쉽다."

```
100% 커버리지가 합리적인 조건

1. 높은 파급력  → 깨지면 다수 소비 프로젝트에 심각한 영향
2. 낮은 비용    → 작은 라이브러리라 100% 달성이 쉬움

두 조건이 동시에 충족되어야 함
→ 애플리케이션 코드는 보통 "파급력은 높지만 비용도 높다" → 합리적이지 않음
→ 공용 유틸 라이브러리는 두 조건 충족 → 합리적
```

---

## 종합

`date-fns`, `lodash` 같은 유틸 라이브러리는 수천 개 프로젝트에서 사용하므로 버그 하나의 파급력이 극도로 크다. 동시에 라이브러리는 순수 함수 위주라 100% 커버리지 달성이 쉽다. 반면 React 앱은 UI 렌더 코드, 환경 의존적 코드, legacy 코드가 섞여 있어 100% 달성이 어렵고, 파급력도 해당 서비스에만 국한된다. 목표 커버리지를 설정할 때 파급력과 달성 비용을 함께 고려해야 한다.

---

---

# 코드 커버리지 리포트에서 테스트가 없는 라인을 발견했을 때, 어떤 질문을 던져야 하는가?

## 도입

커버리지 리포트에서 빨간 줄을 보면 반사적으로 "이 줄을 실행하는 테스트를 쓰자"고 생각하기 쉽다. 하지만 더 중요한 질문은 "이 코드가 지원하는 유스케이스가 무엇인가"다.

---

## 본문

> When you look at a code coverage report and note the lines that are missing tests, don't think about the ifs/elses, loops, or lifecycles. Instead ask yourself: What use cases are these lines of code supporting, and what tests can I add to support those use cases?

"코드 커버리지 리포트를 보고 테스트가 없는 라인을 발견할 때, if/else, 루프, 라이프사이클에 대해 생각하지 마라. 대신 '이 코드 라인들이 어떤 유스케이스를 지원하며, 해당 유스케이스를 지원하기 위해 어떤 테스트를 추가할 수 있는가?'를 스스로에게 물어라."

> "Use Case Coverage" tells us how many of the use cases our tests support. Unfortunately, there's no such thing as an automated "Use Case Coverage Report."

"'Use Case Coverage'는 테스트가 지원하는 유스케이스의 비율을 알려준다. 불행히도 자동화된 'Use Case Coverage Report' 같은 것은 없다."

- **Use Case Coverage**: 테스트가 커버하는 유스케이스의 비율. 자동 측정 도구가 없어 개발자가 직접 판단해야 한다.

> Sometimes, our code coverage report indicates 100% code coverage, but not 100% use case coverage.

"때로는 코드 커버리지 리포트가 100% 코드 커버리지를 나타내지만, 100% use case coverage는 아닐 수 있다."

```
코드 커버리지 100% ≠ 유스케이스 커버리지 100%

예시
  // 쿠폰 적용 코드 커버됨
  function applyCoupon(price, couponCode) {
    if (couponCode === 'SAVE10') return price * 0.9;
    return price;
  }

  // 테스트: applyCoupon(1000, 'SAVE10') → 통과
  // 코드 커버리지: 100% (두 분기 모두 실행)

  // 누락된 유스케이스:
  //   - 만료된 쿠폰 입력 시 에러 메시지 표시
  //   - 쿠폰 코드 대소문자 처리
  //   - 이미 할인된 가격에 쿠폰 중복 적용
```

---

## 종합

커버리지 리포트는 "어떤 라인이 실행됐는가"만 보여주고, "이 라인이 왜 있는가"는 알려주지 않는다. 빨간 라인을 보면 if/else를 테스트하는 것이 아니라, 그 라인이 담당하는 사용자 시나리오를 찾아야 한다. 커버리지는 유스케이스 발견의 보조 도구일 뿐 — 진짜 판단 기준은 "사용자가 이 기능을 쓸 때 제대로 동작한다는 자신감이 있는가"다.
