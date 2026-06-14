# implementation details를 테스트하면 왜 all downside, no upside인가?

## 도입

구현 세부사항을 테스트하는 것이 왜 단점뿐이고 장점이 없는지를 이해하려면, 컴포넌트의 실제 사용자가 누구인지부터 명확히 해야 한다. 테스트 자체가 "제3의 사용자"가 되는 순간 문제가 시작된다.

---

## 본문

> But what are you getting confidence in when you test things this way? The testing user doesn't pay the bills like the end user. It doesn't affect the rest of the system like the developer user.

"하지만 이런 방식으로 테스트할 때 무엇에 대한 확신을 얻고 있는가? testing user는 end user처럼 돈을 내지 않는다. developer user처럼 나머지 시스템에 영향을 주지도 않는다."

- **testing user**: 구현 세부사항을 직접 조작하는 테스트가 가정하는 가상의 사용자. 실제로 존재하지 않는다.

> Writing tests that include implementation details is all downside and no upside.

"구현 세부사항을 포함하는 테스트를 작성하는 것은 단점뿐이고 장점이 없다."

> You should very rarely have to change tests when you refactor code.

"코드를 리팩토링할 때 테스트를 변경해야 하는 경우는 매우 드물어야 한다."

```
구현 세부사항 테스트의 가치 분석

얻는 것  → "내부 state가 X다"라는 확신
              (end user에게도, developer에게도 아무 의미 없음)

잃는 것  → 리팩토링마다 테스트 수정 비용
           + 실제 버그가 있어도 통과할 수 있는 위험
```

---

## 종합

테스트의 목적은 end user와 developer user에게 "이 코드는 제대로 동작한다"는 확신을 제공하는 것이다. 구현 세부사항 테스트는 이 둘 중 누구에게도 그 확신을 주지 못하면서, 리팩토링마다 깨지는 유지보수 부담만 남긴다. "no upside"는 테스트가 주는 확신이 실제 사용자 경험과 연결되지 않는다는 뜻이고, "all downside"는 false negative + false positive 두 방향 모두에서 비용을 치른다는 뜻이다.

---

# Unit test 하나에 assert를 여러 개 두면 어떤 문제가 생기는가?

## 본문

> For each unit test, there should only be one true or false outcome. Make sure that there is only one assert statement within your test. A failed assert statement in a block of multiple ones can cause confusion on which one produced the issue.

"각 unit test에는 하나의 참 또는 거짓 결과만 있어야 한다. 테스트 내에 assert 구문이 하나만 있는지 확인하라. 여러 assert 블록에서 하나가 실패하면 어떤 것이 문제를 일으켰는지 혼란이 생긴다."

```ts
// 나쁜 예 — 여러 assertion
test('사용자 데이터 처리', () => {
  const result = processUser({ name: 'Kim', age: 25 });
  expect(result.name).toBe('Kim');      // 이게 실패하면 아래는 실행 안 됨
  expect(result.age).toBe(25);
  expect(result.isAdult).toBe(true);    // 어디서 실패했는지 불명확
});

// 좋은 예 — 테스트 분리
test('이름이 올바르게 처리된다', () => {
  expect(processUser({ name: 'Kim', age: 25 }).name).toBe('Kim');
});
test('성인 여부가 올바르게 계산된다', () => {
  expect(processUser({ name: 'Kim', age: 25 }).isAdult).toBe(true);
});
```

---

## 종합

단일 assertion은 테스트의 목적을 명확하게 하고 실패 원인을 빠르게 찾게 해준다. 하나의 테스트에 여러 assertion을 넣으면 "이 테스트가 무엇을 검증하는가"가 흐려지고, 첫 번째 실패에서 나머지 검증이 중단된다.
