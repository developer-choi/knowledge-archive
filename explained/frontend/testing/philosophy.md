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

---

# React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?

## 도입

React 앱은 컴포넌트 트리 구조다. 리프 컴포넌트만 테스트할지, 상위 컴포넌트를 테스트할지, 아니면 페이지 단위로 테스트할지에 대한 질문은 실무에서 자주 등장한다. Testing Library는 "컴포넌트 단위"가 아닌 "사용자 기능 단위"로 생각하라고 유도한다.

---

## 본문

> Following the guiding principle of this library, it is useful to break down how tests are organized around how the user experiences and interacts with application functionality rather than around specific components themselves.

"이 라이브러리의 가이딩 원칙을 따르면, 특정 컴포넌트 자체가 아니라 사용자가 애플리케이션 기능을 경험하고 상호작용하는 방식을 중심으로 테스트를 구성하는 것이 유용하다."

> In some cases, for example for reusable component libraries, it might be useful to include developers in the list of users to test for and test each of the reusable components individually.

"재사용 가능한 컴포넌트 라이브러리의 경우처럼, 개발자를 테스트 대상 사용자에 포함하고 각 재사용 컴포넌트를 개별적으로 테스트하는 것이 유용할 수 있다."

> Other times, the specific break down of a component tree is just an implementation detail and testing every component within that tree individually can cause issues.

"다른 경우에는, 특정 컴포넌트 트리의 분해 방식이 그냥 구현 세부사항이고, 트리 내 모든 컴포넌트를 개별적으로 테스트하면 문제가 생길 수 있다."

> In practice this means that it is often preferable to test high enough up the component tree to simulate realistic user interactions.

"실제로 이는 현실적인 사용자 상호작용을 시뮬레이션할 수 있을 만큼 충분히 높은 레벨에서 테스트하는 것이 종종 바람직하다는 뜻이다."

```
앱 컴포넌트 트리 예시

Page (테스트 권장 레벨 — 실제 사용자 시나리오 포함)
 ├── Header
 ├── CheckoutForm (이 컴포넌트만 단독 테스트하면 Header 연동 누락)
 │   ├── CartItems
 │   └── PaymentInput
 └── Footer

재사용 Button 컴포넌트 (개발자가 사용자 — 개별 테스트 적합)
```

---

## 종합

컴포넌트 단위로 쪼개서 모두 테스트하면 각 컴포넌트는 동작하지만 연결이 깨질 수 있다. `CartItems`가 정상이고 `PaymentInput`이 정상이어도, `CheckoutForm`에서 데이터가 잘못 연결되면 사용자는 결제에 실패한다. 반면 `CheckoutForm` 전체를 렌더해 "장바구니 담기 → 결제 버튼 클릭 → 완료 메시지"를 테스트하면 연결까지 검증된다. 단, Button처럼 독립적으로 소비되는 재사용 컴포넌트는 developer user가 사용자이므로 개별 테스트가 합리적이다.

---

# 테스트에서 false positive와 false negative는 각각 무엇을 의미하는가?

## 본문

> The test is: "does the software work". If the test passes, then that means the test came back "positive" (found working software). If it does not, that means the test comes back "negative" (did not find working software). The term "False" refers to when the test came back with an incorrect result, meaning the software is actually broken but the test passes (false positive) or the software is actually working but the test fails (false negative).

방향이 헷갈리면 매핑 하나만 붙잡으면 된다 — **테스트 통과 = positive(동작하는 코드를 찾음)**, 실패 = negative(못 찾음)다. 앞에 붙는 **False**는 그 판정이 실제 코드 상태와 어긋났다는 뜻이고, 이름은 언제나 **테스트 결과 쪽**을 따른다.

| 구분 | 실제 코드 | 테스트 결과 | 무슨 일이 벌어지나 |
|---|---|---|---|
| **false positive** | 망가짐 | 통과(positive) | 버그를 못 잡고 놓침 |
| **false negative** | 멀쩡함 | 실패(negative) | 멀쩡한데 헛되이 깨짐 |

두 경우 모두 뿌리는 같다 — 테스트가 사용자가 겪는 **동작(behavior)**이 아니라 **내부 구현 세부**(내부 변수·내부 메서드처럼 사용자가 보지도 알지도 못하는 것)를 붙들 때 생긴다. React accordion(항목을 눌러 펼치고 접는 UI)으로 예를 들면:

- **false negative — 멀쩡한데 깨짐**: 열린 항목을 `openIndex`(숫자)에서 `openIndexes`(배열)로 바꾸는 리팩토링. 화면 동작은 그대로(여전히 하나만 펼침)인데, 내부 변수 `openIndex`를 직접 찌르던 테스트가 그 값이 사라져 `undefined`를 받고 실패한다. 코드는 멀쩡한데 테스트만 빨간불 → false negative.
- **false positive — 망가졌는데 통과**: 클릭 핸들러를 `onClick={() => setOpenIndex(index)}`에서 `onClick={setOpenIndex}`로 바꾸면, 핸들러가 `index` 대신 브라우저가 넘기는 클릭 이벤트 객체를 받아 버튼-핸들러 배선(wiring)이 끊긴다. 실제 아코디언은 망가진다. 그런데 테스트가 버튼 클릭 대신 내부 메서드 `setOpenIndex`를 코드에서 직접 호출해 상태만 확인했다면 통과한다 → 코드는 망가졌는데 통과 = false positive.

의료 검사와 정확히 같다 — 병이 없는데 "양성"이면 false positive, 병이 있는데 "음성"이면 false negative. 소프트웨어 테스트에선 "통과=positive"만 얹으면 그대로 대응된다.
