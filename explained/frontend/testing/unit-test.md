# Unit test란 무엇인가?

> Unit: Verify that individual, isolated parts work as expected.

"Unit: 개별적으로 격리된 부분들이 기대한 대로 동작하는지 검증한다."

- **individual**: 하나의 함수, 하나의 컴포넌트처럼 테스트 대상을 최소 단위로 자른다.
- **isolated**: 협력 모듈 없이 단독으로 실행. DB, 네트워크, 다른 컴포넌트 없이.

> Unit tests typically test something small that has no dependencies or will mock those dependencies (effectively swapping what could be thousands of lines of code with only a few).

"Unit test는 보통 의존성이 없거나 의존성을 mock하는(수천 줄의 코드를 몇 줄로 효과적으로 교체하는) 작은 것을 테스트한다."

- **mock those dependencies**: 실제 DB, API, 외부 라이브러리 대신 가짜 구현을 넣는다. `jest.fn()`, `jest.mock()` 등으로 실제 코드를 몇 줄짜리 가짜로 교체한다.

```ts
// unit test 예시 — 순수 함수
function calculateDiscount(price: number, rate: number): number {
  return price * (1 - rate);
}

test('30% 할인 계산', () => {
  expect(calculateDiscount(10000, 0.3)).toBe(7000);
});
```

---

# Unit testing strategies 3가지는 무엇인가?

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
