# Unit testing strategies 3가지는 무엇인가?

## 도입

Unit test를 쓸 때 "어떤 케이스를 커버해야 하는가"에 대한 체계적 접근이 세 가지 전략으로 정리된다. Logic checks, Boundary checks, Error handling이다. 이 세 가지를 조합하면 함수의 동작을 빠짐없이 검증할 수 있다.

---

## 본문

> **1. Logic checks** — Does the system perform the right calculations and follow the right path through the code given a correct, expected input. Are all paths through the code covered by the given inputs?

"1. 로직 검사 — 올바르고 예상된 입력이 주어졌을 때 시스템이 올바른 계산을 수행하고 코드의 올바른 경로를 따르는가. 주어진 입력으로 코드의 모든 경로가 커버되는가?"

함수에서 발생할 수 있는 모든 경우의 수를 전부 커버하고 있는지, 누락된 특정 조건문에 대한 테스트가 있는지 체크한다.

> **2. Boundary checks** — Test typical, edge, and out-of-range inputs.

"2. 경계 검사 — 일반적, 경계, 범위 밖 입력을 테스트한다."

0~10까지 동작하는 로직이 있다면 5(일반적), 0/10(경계), -1/11(범위 밖) 케이스를 모두 검증한다.

> **3. Error handling** — When there are errors in inputs, how does the system respond? Is the user prompted for another input? Does the software crash?

"3. 에러 처리 — 입력에 오류가 있을 때 시스템이 어떻게 응답하는가? 사용자에게 다른 입력을 요청하는가? 소프트웨어가 충돌하는가?"

```ts
// 예시: 할인율 적용 함수
function applyDiscount(price: number, rate: number): number {
  if (rate < 0 || rate > 1) throw new Error('할인율은 0~1 사이여야 한다');
  return price * (1 - rate);
}

// 1. Logic checks
test('30% 할인 계산', () => expect(applyDiscount(10000, 0.3)).toBe(7000));

// 2. Boundary checks
test('할인율 0% (경계)', () => expect(applyDiscount(10000, 0)).toBe(10000));
test('할인율 100% (경계)', () => expect(applyDiscount(10000, 1)).toBe(0));
test('할인율 -1 (범위 밖)', () => expect(() => applyDiscount(10000, -1)).toThrow());
test('할인율 1.1 (범위 밖)', () => expect(() => applyDiscount(10000, 1.1)).toThrow());

// 3. Error handling
test('잘못된 할인율 → 에러 메시지 확인', () => {
  expect(() => applyDiscount(10000, -1)).toThrow('할인율은 0~1 사이여야 한다');
});
```

---

## 종합

세 전략은 서로 보완적이다. Logic checks는 "정상 동작하는가", Boundary checks는 "극단값에서 무너지지 않는가", Error handling은 "잘못된 입력을 받았을 때 안전하게 처리하는가"를 각각 검증한다. 세 전략을 조합하면 함수가 실제 프로덕션에서 만날 수 있는 대부분의 케이스를 커버할 수 있다. input/output이 명확한 순수 함수에서 가장 적용하기 쉽다.

---

---

# Unit test의 benefits는 무엇인가?

## 도입

Unit test를 쓰는 데는 버그를 잡는 것 외에 덜 알려진 이점이 있다. 테스트 코드 자체가 살아있는 문서가 된다는 점이다.

---

## 본문

> **1. Efficient bug discovery** — Unit tests catch bugs before they reach production and detect regressions when code changes.

"1. 효율적인 버그 발견 — Unit test는 버그가 프로덕션에 도달하기 전에 잡고 코드 변경 시 회귀를 감지한다."

버그 발견의 4가지 효과:
```
효과            설명
----------      ----------------------------------------
버그 사전 차단  프로덕션 도달 전에 오류 발견
회귀 감지       코드 변경 후 기존 기능이 깨졌는지 감지
빠른 디버깅     문제 코드를 빠르게 파악 (테스트가 특정 함수를 지목)
시간 절약       디버깅에 드는 리소스 절감
```

> **2. Documentation** — It's important to document code to know exactly what that code is supposed to be doing. Unit tests also act as a form of documentation. Other developers read the tests to see what behaviors the code is expected to exhibit when it runs.

"2. 문서화 — 코드가 정확히 무엇을 해야 하는지 알기 위해 코드를 문서화하는 것이 중요하다. Unit test도 문서의 형태로 기능한다. 다른 개발자들은 코드가 실행될 때 어떤 동작을 보여야 하는지 보기 위해 테스트를 읽는다."

```ts
// 테스트 코드가 문서 역할을 하는 예시
describe('applyDiscount', () => {
  it('30% 할인 시 가격의 70%를 반환한다');
  it('할인율 0%면 원래 가격을 반환한다');
  it('할인율이 0 미만이면 에러를 던진다');
  it('할인율이 1 초과면 에러를 던진다');
});
// → 테스트 목록만 봐도 함수 명세를 파악할 수 있다
```

---

## 종합

버그 발견은 테스트의 가장 직관적인 이점이지만, 문서화 효과는 장기적으로 더 크다. README나 JSDoc은 코드가 바뀌면 outdated가 되지만, 테스트는 실패로 즉시 알려준다. 새 팀원이 함수의 동작을 파악하려 할 때 테스트를 보면 "이 함수는 이런 상황에서 이렇게 동작한다"를 바로 알 수 있다. 테스트를 실행 가능한 명세서로 만드는 것이 좋은 테스트 작성의 목표다.

---

---

# Unit testing이 덜 유익한 상황 3가지는 무엇인가?

## 도입

Unit testing이 항상 최선의 투자는 아니다. 특정 상황에서는 unit test를 쓰는 비용이 이점을 초과한다. 세 상황을 알아두면 테스트 전략을 더 유연하게 세울 수 있다.

---

## 본문

> **1. When time is constrained** — Even with generative unit testing frameworks, writing new unit tests takes a significant amount of your developers' time. While input and output-based unit tests may be easy to generate, logic-based checks are more difficult. This can lead to extended development timelines and budget issues.

"1. 시간이 제한될 때 — 생성형 unit testing 프레임워크가 있어도 새 unit test 작성은 상당한 개발자 시간을 소요한다. input/output 기반 unit test는 생성하기 쉬울 수 있지만 로직 기반 검사는 더 어렵다."

- input/output-based: 인풋·아웃풋만 검증하는 것(변환 함수 등) = 작성이 쉽다.
- logic-based: if/else/switch 등 경우의 수에 따라 동작하는 것 = 작성이 어렵다.

> **2. UI/UX applications** — When the main system is concerned with look and feel rather than logic, there may not be many unit tests to run.

"2. UI/UX 애플리케이션 — 메인 시스템이 로직보다는 외관과 느낌에 관한 것이라면 실행할 unit test가 많지 않을 수 있다."

- look and feel: logical하지 않은, 마크업 위주의 애플리케이션. 애니메이션이 많은 화면, 픽셀 수준의 레이아웃 등은 unit test로 검증하기 어렵다.

> **3. Rapidly evolving requirements** — If requirements are likely to change often, there's not much reason to write unit tests each time a block of code is developed.

"3. 빠르게 변화하는 요구사항 — 요구사항이 자주 변경될 가능성이 있다면, 코드 블록이 개발될 때마다 unit test를 작성하는 이유가 많지 않다."

---

## 종합

세 상황의 공통점은 테스트 작성 비용이 이점을 초과하는 경우다. 스타트업 초기, MVP 단계에서는 3번 상황이 해당된다. 기능이 자주 변경되는 동안 테스트를 미리 쓰면 기능 변경마다 테스트도 고쳐야 해서 속도를 늦춘다. 안정된 기능, 비즈니스 핵심 로직, 공통 유틸에 먼저 집중하고 초기 탐색 단계의 코드는 나중에 안정화되면 테스트를 추가하는 전략이 현실적이다.

---

---

# Unit test best practices 2가지는 무엇인가?

## 도입

Unit test를 어떻게 구성하고 언제 실행할지에 대한 두 가지 핵심 실천 방법이다. 자동화와 단일 assertion은 unit test의 효과를 극대화하는 기본 원칙이다.

---

## 본문

> **1. Automate unit testing** — Unit testing should be triggered on different events within software development. For example, you can use them before you push changes to a branch using version control software or before you deploy a software update. Automated unit testing ensures tests run in all appropriate events and cases throughout the development lifecycle.

"1. Unit testing 자동화 — Unit testing은 소프트웨어 개발 내 다양한 이벤트에서 트리거되어야 한다. 예를 들어 버전 관리 소프트웨어로 브랜치에 변경사항을 push하기 전이나 소프트웨어 업데이트를 배포하기 전에 사용할 수 있다."

- **triggered on different events**: pre-push hook, CI/CD 파이프라인, PR 생성 시 자동 실행. 사람이 직접 돌려야 하는 테스트는 잊어버리거나 건너뛰게 된다.

> **2. Assert once** — For each unit test, there should only be one true or false outcome. Make sure that there is only one assert statement within your test. A failed assert statement in a block of multiple ones can cause confusion on which one produced the issue.

"2. 단일 assert — 각 unit test에는 하나의 참 또는 거짓 결과만 있어야 한다. 테스트 내에 assert 구문이 하나만 있는지 확인하라. 여러 assert 블록에서 하나가 실패하면 어떤 것이 문제를 일으켰는지 혼란이 생긴다."

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

자동화는 "실행 시점을 사람 의지에 의존하지 않는다"는 원칙이다. pre-push hook이나 CI에 연결하면 변경사항이 코드베이스에 들어오기 전에 항상 실행된다. 단일 assertion은 테스트의 목적을 명확하게 하고 실패 원인을 빠르게 찾게 해준다. 하나의 테스트에 여러 assertion을 넣으면 "이 테스트가 무엇을 검증하는가"가 흐려지고, 첫 번째 실패에서 나머지 검증이 중단된다.
