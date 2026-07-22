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
