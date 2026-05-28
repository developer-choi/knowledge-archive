# Static test란 무엇인가?

## 도입

Testing Trophy의 가장 아래 레이어다. 코드를 실행하지 않고도 문법 오류, 타입 불일치를 잡아주는 도구들로, 별도의 테스트를 작성하지 않아도 자동으로 동작한다.

---

## 본문

> Static: Catch typos and type errors as you write the code.

"Static: 코드를 작성하는 동안 오타와 타입 오류를 잡는다."

- **typos**: 변수 이름 오타, 존재하지 않는 프로퍼티 접근 등. `user.naem`처럼 타이핑 실수.
- **type errors**: 타입 불일치. 숫자를 기대하는 함수에 문자열을 넘기는 것처럼.

ESLint와 TypeScript가 대표 도구다. 에디터에서 실시간으로 빨간 줄로 표시되고, CI에서 `tsc --noEmit`으로 확인한다. 테스트 작성 없이 커버되는 레이어라 cost가 가장 낮다.

```
Testing Trophy 구조

     ┌──────────┐
     │   E2E    │  ← 가장 높은 자신감, 가장 높은 비용
     ├──────────┤
     │integration│  ← 가장 큰 비중 (Kent C. Dodds 권장)
     ├──────────┤
     │   unit   │
     ├──────────┤
     │  static  │  ← 가장 낮은 비용, 자동 적용
     └──────────┘
```

---

## 종합

Static 레이어가 없으면 unit test에서야 타입 오류를 발견한다. TypeScript와 ESLint를 설정하면 에디터에서 바로 피드백이 오므로 피드백 루프가 가장 짧다. 테스트를 쓰지 않아도 되는 버그는 static 레이어에 맡기고, 그 위 레이어에서는 비즈니스 로직과 사용자 흐름 검증에 집중하는 전략이 Trophy의 핵심이다.

---

---

# Unit test란 무엇인가?

## 도입

Testing Trophy에서 static 바로 위 레이어다. 외부 의존성 없이 내 코드만 격리해 테스트한다. 빠르고 비용이 낮지만, 의존성 연동 문제는 구조적으로 잡을 수 없다.

---

## 본문

> Unit: Verify that individual, isolated parts work as expected.

"Unit: 개별적으로 격리된 부분들이 기대한 대로 동작하는지 검증한다."

- **individual**: 하나의 함수, 하나의 컴포넌트처럼 테스트 대상을 최소 단위로 자른다.
- **isolated**: 협력 모듈 없이 단독으로 실행. DB, 네트워크, 다른 컴포넌트 없이.

> Unit testing is the process where you test the smallest functional unit of code.

"Unit testing은 코드의 가장 작은 기능 단위를 테스트하는 과정이다."

> Unit tests are typically the first set of tests that run during full system software testing. They can be written as soon as any code is written and don't require any special tools to run.

"Unit test는 보통 전체 시스템 소프트웨어 테스트에서 가장 먼저 실행되는 테스트 세트다. 코드가 작성되자마자 작성할 수 있으며 실행하는 데 특별한 도구가 필요하지 않다."

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

## 종합

Kent의 정의("individual, isolated parts")와 Fowler의 정의("내 코드 vs 별도 개발 코드")는 같은 개념을 다른 각도에서 본다. Kent는 기술적 격리, Fowler는 조직적 경계를 기준으로 삼는다. 실무에서는 순수 함수 테스트가 가장 전형적인 unit test이며, 컴포넌트를 Provider 없이 단독으로 렌더링하는 것도 unit test에 해당한다. 테스트 기원에 대한 더 깊은 논의는 `test-shapes-unit-vs-integration.md`에서 다룬다.

---

---

# Unit test의 장점과 단점은?

## 도입

Trophy에서 아래 레이어일수록 각 테스트가 검증하는 코드 범위가 좁다. unit test는 범위가 가장 좁으므로 빠르고 비용이 낮지만, 같은 커버리지를 위해 더 많은 테스트가 필요하고 연동 문제는 잡지 못한다.

---

## 본문

> Unit tests typically test something small that has no dependencies or will mock those dependencies (effectively swapping what could be thousands of lines of code with only a few).

"Unit test는 보통 의존성이 없거나 의존성을 mock하는(수천 줄의 코드를 몇 줄로 효과적으로 교체하는) 작은 것을 테스트한다."

- **mock those dependencies**: 실제 DB, API, 외부 라이브러리 대신 가짜 구현을 넣는다. `jest.fn()`, `jest.mock()` 등으로 실제 코드를 몇 줄짜리 가짜로 교체한다.

> The lower down the trophy you are, the less code your tests are testing. If you're operating at a low level you need more tests to cover the same number of lines of code in your application as a single test could higher up the trophy.

"Trophy에서 아래로 갈수록 테스트가 테스트하는 코드가 적어진다. 낮은 레벨에서 운영하면 Trophy 위쪽의 단일 테스트가 커버할 수 있는 것과 같은 수의 코드 라인을 커버하기 위해 더 많은 테스트가 필요하다."

```
같은 결제 흐름을 커버할 때

E2E 테스트 1개 → 전체 결제 흐름 커버
Unit 테스트 N개 → validateCart + calculatePrice + sendRequest + parseResponse + ...
              각 함수마다 별도 테스트 필요
```

---

## 종합

Unit test의 장점은 빠른 실행 속도, 낮은 작성 비용, 실패 시 명확한 원인 위치다. 단점은 confidence coefficient가 낮고, 같은 커버리지를 위해 테스트 수가 많아야 하며, 의존성 연동 문제는 구조적으로 잡을 수 없다는 것이다. 순수 비즈니스 로직(할인 계산, 유효성 검사 등)에는 unit이 최적이고, 컴포넌트 간 연동 검증에는 integration이 더 적합하다.

---

---

# Unit test에서 의존성을 mock하고 호출 assertion이 통과하면, 실제 연동도 정상이라고 볼 수 있는가?

## 도입

mock을 사용하면 의존성을 가짜로 교체하므로 실제 의존성이 어떻게 동작하는지는 테스트에서 알 수 없다. 이 한계가 unit test의 근본적인 blind spot이다.

---

## 본문

> Unit tests are incapable of ensuring that when you call into a dependency that you're calling it appropriately (though you can make assertions on how it's being called, you can't ensure that it's being called properly with a unit test).

"Unit test는 의존성을 호출할 때 적절하게 호출하고 있는지 보장할 수 없다 (호출 방식에 대해 assertion할 수는 있지만, unit test로는 올바르게 호출하고 있다는 것을 보장할 수 없다)."

- **incapable of ensuring**: 구조적으로 불가능하다는 뜻. 노력의 문제가 아니라 mock의 본질적 한계다.
- **calling it appropriately**: 올바른 인자를 올바른 형태로 전달하는 것. mock은 어떤 인자를 받아도 가짜 응답만 돌려주므로 인자의 정확성은 알 수 없다.

> It doesn't matter if your component `<A />` renders component `<B />` with props c and d if component `<B />` actually breaks if prop e is not supplied.

"`<B />` 컴포넌트가 prop e가 없으면 실제로 깨지는데, `<A />`가 `<B />`를 c와 d props로 렌더링한다는 것은 의미가 없다."

```ts
// unit test — mock으로 A를 테스트
jest.mock('./B', () => () => <div>mocked B</div>);
render(<A />);
// A가 B를 렌더링한다는 것은 확인 — 통과
// 하지만 B가 실제로 받아야 하는 prop e가 없는 것은 잡지 못함
```

---

## 종합

아니다. mock은 가짜 구현이므로, 실제 의존성이 내가 넘기는 인자를 올바르게 처리하는지는 알 수 없다. `api.createUser({name: 'Kim'})`을 호출했다고 assertion하더라도, 실제 API가 `username` 필드를 기대한다면 unit test는 이를 잡지 못한다. 이 blind spot을 채우는 것이 integration test의 역할이다 — mock을 최소화하여 실제 의존성 간 연동을 검증한다.

---

---

# Unit test에서 dependency가 있을 때 어떻게 처리하는가?

## 도입

unit test는 격리가 핵심이므로 외부 의존성을 그대로 사용할 수 없다. DB, 네트워크, 외부 객체가 필요한 코드를 unit test하려면 대체재가 필요하다.

---

## 본문

> When a block of code requires other parts of the system to run, you can't use a unit test with that external data. The unit test needs to run in isolation.

"코드 블록이 실행하기 위해 시스템의 다른 부분이 필요하면, 외부 데이터와 함께 unit test를 사용할 수 없다. Unit test는 격리된 상태로 실행되어야 한다."

> Other system data, such as databases, objects, or network communication, might be required for the code's functionality. If that's the case, you should use data stubs instead.

"데이터베이스, 객체, 네트워크 통신 같은 다른 시스템 데이터가 코드 기능에 필요할 수 있다. 그런 경우 data stub을 대신 사용해야 한다."

- **data stubs**: 실제 외부 데이터 대신 사용하는 가짜(고정) 데이터. mock과 비슷하지만, stub은 미리 정해진 값을 반환하는 데 집중한다.

```ts
// DB를 사용하는 함수를 unit test할 때
const mockUserRepository = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Kim' })
};

// 실제 DB 연결 없이 테스트
const user = await getUser(1, mockUserRepository);
expect(user.name).toBe('Kim');
```

---

## 종합

data stub은 실제 외부 시스템 대신 예측 가능한 고정 데이터를 제공해 테스트를 빠르고 안정적으로 만든다. CI 환경에서 DB 없이도 실행할 수 있어 setup 비용이 낮다. 단, stub이 실제 DB의 동작과 다르면 false positive가 발생할 수 있다 — stub은 개발자가 만든 가짜이므로 실제 시스템의 edge case를 놓칠 수 있다. 이 간극을 좁히는 방법이 integration test에서 실제 DB나 MSW를 사용하는 것이다.

---

---

# Integration test란 무엇인가?

## 도입

Testing Trophy에서 가장 큰 비중을 차지하는 레이어다. 여러 단위가 함께 동작하는지를 검증하며, mock을 최소화해 실제 환경과 최대한 비슷하게 렌더링한다.

---

## 본문

> Integration: Verify that several units work together in harmony.

"Integration: 여러 단위가 조화롭게 함께 동작하는지 검증한다."

- **several units**: 컴포넌트 여러 개, 커스텀 훅, 유틸 함수의 조합. 개별적으로는 동작해도 연결에서 문제가 생길 수 있다.
- **in harmony**: 각자 동작하는 게 아니라 서로 올바르게 연결되어 동작하는 것.

> The idea behind integration tests is to mock as little as possible.

"Integration test의 핵심 아이디어는 가능한 한 적게 mock하는 것이다."

> Integration Testing involves testing how multiple units work together. This can be a combination of components, hooks, and functions.

"Integration testing은 여러 단위가 어떻게 함께 동작하는지 테스트하는 것이다. 컴포넌트, 훅, 함수의 조합이 될 수 있다."

```ts
// integration test 예시 — 실제 컴포넌트 트리 + MSW
render(
  <Providers>  {/* Router, ThemeProvider, AuthProvider 등 */}
    <CheckoutPage />
  </Providers>
);

await userEvent.click(screen.getByRole('button', { name: '결제하기' }));
expect(await screen.findByText('결제 완료')).toBeInTheDocument();
```

---

## 종합

Integration test는 Testing Trophy에서 가장 높은 ROI(투자 대비 효과)를 가진다. unit보다 더 많은 코드를 한 번에 검증하면서, E2E보다 훨씬 빠르다. 앱의 모든 Provider를 실제로 감싸고, 네트워크만 MSW로 대체하므로 실제 사용 환경과 가장 비슷하다. Kent C. Dodds가 Trophy에서 integration을 가장 큰 비중으로 권장하는 이유다.

---

---

# Integration test의 장점과 단점은?

## 도입

Integration test는 unit과 E2E 사이의 최적 균형점이다. 어떤 것을 얻고 어떤 것을 잃는지 명확히 이해하면 테스트 전략을 더 잘 세울 수 있다.

---

## 본문

> The size of these forms of testing on the trophy is relative to the amount of focus you should give them when testing your applications (in general).

"Trophy에서 각 테스트 형태의 크기는 일반적으로 애플리케이션을 테스트할 때 집중해야 하는 양에 비례한다."

> The idea behind integration tests is to mock as little as possible. I pretty much only mock: 1. Network requests (using MSW) 2. Components responsible for animation

"Integration test의 핵심 아이디어는 가능한 한 적게 mock하는 것이다. 나는 거의: 1. 네트워크 요청 (MSW 사용) 2. 애니메이션 담당 컴포넌트만 mock한다."

```
Integration test 장단점

장점
  ✓ confidence coefficient가 unit보다 높음
  ✓ E2E보다 빠르고 저렴함
  ✓ mock 최소화 → 실제 동작에 가까움
  ✓ Provider, 훅, 컴포넌트 간 연결 검증

단점
  ✗ unit보다 느림
  ✗ 실패 시 원인 추적이 unit보다 어려움
  ✗ 실제 백엔드 연동 문제는 잡을 수 없음 (MSW가 네트워크를 가로채므로)
```

---

## 종합

애니메이션 컴포넌트를 mock하는 이유는 실용성 때문이다 — 애니메이션이 완료될 때까지 기다리면 테스트가 너무 느려진다. 네트워크 요청을 MSW로 mock하는 것은 실제 서버 의존성을 없애기 위해서다. 이 두 가지를 제외하면 나머지는 전부 실제 코드를 사용하므로, 실제 사용 환경과 가장 비슷한 테스트를 빠르게 실행할 수 있다.

---

---

# Integration test에서 mock하는 것과 하지 않는 것의 기준은?

## 도입

Integration test에서 mock을 최소화하라고 하지만, 어디까지 mock하고 어디서 멈출지 기준이 필요하다. 기준은 단순하다 — mock하면 해당 연결에 대한 자신감을 잃는다.

---

## 본문

> I pretty much only mock: 1. Network requests (using MSW) 2. Components responsible for animation (because who wants to wait for that in your tests?)

"나는 거의: 1. 네트워크 요청 (MSW 사용) 2. 애니메이션 담당 컴포넌트 (테스트에서 그걸 기다리고 싶은 사람이 있겠는가?)만 mock한다."

> When you mock something you're removing all confidence in the integration between what you're testing and what's being mocked.

"무언가를 mock하면 테스트하는 것과 mock되는 것 사이의 통합에 대한 모든 자신감을 제거하는 것이다."

- **removing all confidence**: mock이 잘못 설정되어 있어도 테스트는 통과한다. 실제 의존성과 mock이 맞지 않으면 아무 보장이 없다.

> You don't actually want to send emails or charge credit cards every test, but most of the time you can avoid mocking and you'll be better for it.

"모든 테스트마다 실제로 이메일을 보내거나 신용카드를 청구하고 싶지는 않지만, 대부분의 경우 mock을 피할 수 있고 그게 더 낫다."

```
mock 판단 기준

mock해야 함
  ✓ 실제 실행이 부작용(이메일 발송, 결제, 서드파티 API 호출)을 만들 때
  ✓ 테스트 속도에 심각한 영향 (애니메이션, 긴 타임아웃)

mock하지 않아야 함
  ✗ 단순히 설정이 귀찮아서
  ✗ "어차피 unit test에서 검증했으니까"
  ✗ 자식 컴포넌트가 복잡해 보여서
```

---

## 종합

mock은 자신감을 잃는 거래다. 네트워크를 mock하면 백엔드와의 실제 연동을 포기하는 대신 빠른 실행을 얻는다. 애니메이션을 mock하면 시각적 검증을 포기하는 대신 시간을 절약한다. 이 두 가지 외에는 mock을 추가할수록 테스트가 실제에서 멀어진다. "mock하면 무엇을 잃는가"를 질문하면 기준이 명확해진다.

---

---

# Integration test도 잡을 수 없는 문제는 무엇인가?

## 도입

Integration test는 unit보다 높은 자신감을 주지만, MSW로 네트워크를 가로채기 때문에 실제 백엔드와의 연동에서 발생하는 문제는 잡을 수 없다.

---

## 본문

> UI Integration tests are incapable of ensuring that you're passing the right data to your backend and that you respond to and parse errors correctly.

"UI Integration test는 백엔드에 올바른 데이터를 전달하고 있으며 오류에 올바르게 응답하고 파싱하고 있다는 것을 보장할 수 없다."

- **passing the right data to your backend**: 실제 API 서버가 기대하는 형식과 필드. MSW 핸들러가 잘못 설정되어 있으면 틀린 데이터를 보내도 테스트가 통과한다.
- **respond to and parse errors correctly**: 실제 서버가 반환하는 에러 형식(status code, 에러 메시지 구조)을 제대로 파싱하는지. MSW가 가짜 에러를 만들면 실제 에러와 형식이 다를 수 있다.

---

## 종합

Integration test의 blind spot은 "MSW 핸들러가 실제 API와 맞는가"다. MSW 핸들러를 개발자가 직접 작성하므로, 실제 백엔드가 바뀌어도 핸들러가 바뀌지 않으면 테스트는 통과한다. 이 문제를 잡으려면 실제 서버를 띄워서 테스트하는 E2E나 Contract Testing이 필요하다. 따라서 Integration test는 "UI 로직과 컴포넌트 연동"을 검증하고, 백엔드와의 실제 연동은 E2E가 담당하는 역할 분담이 합리적이다.

---

---

# E2E test란 무엇인가?

## 도입

Testing Trophy의 가장 꼭대기 레이어다. 실제 사용자처럼 브라우저를 조작하며 전체 애플리케이션 흐름을 검증한다. confidence coefficient가 가장 높지만 비용도 가장 높다.

---

## 본문

> End to End: A helper robot that behaves like a user to click around the app and verify that it functions correctly. Sometimes called "functional testing" or e2e.

"End to End: 사용자처럼 앱을 클릭하며 올바르게 기능하는지 검증하는 도우미 로봇. 때로는 '기능 테스트' 또는 e2e라고 부른다."

- **helper robot**: Cypress, Playwright 같은 브라우저 자동화 도구. 실제 마우스 클릭, 키보드 입력, 스크롤을 시뮬레이션한다.
- **behaves like a user**: QA가 체크리스트 들고 직접 클릭하던 것을 코드로 자동화한 것. 실제 브라우저에서 실행한다.

> Typically these will run the entire application (both frontend and backend) and your test will interact with the app just like a typical user would.

"일반적으로 전체 애플리케이션(프론트엔드와 백엔드 모두)을 실행하고 테스트는 일반 사용자가 하는 것처럼 앱과 상호작용한다."

---

## 종합

E2E는 실제 브라우저에서 프론트+백엔드를 모두 띄워 테스트하므로 가장 현실적이다. Cypress가 버튼을 클릭하면 실제 HTTP 요청이 실제 서버로 가고, DB에 실제 데이터가 저장된다. 이 현실성 덕분에 confidence coefficient가 최고지만, 실행 환경 구성(DB 초기화, 서버 시작)이 복잡하고 시간도 오래 걸린다.

---

---

# E2E test의 장점과 단점은?

## 도입

E2E는 가장 높은 자신감을 주지만 그만큼 비용도 높다. 언제 E2E에 투자하고 언제 아래 레이어로 해결할지 판단하는 것이 테스트 전략의 핵심이다.

---

## 본문

> An E2E test has more points of failure making it often harder to track down what code caused the breakage, but it also means that your test is giving you more confidence.

"E2E 테스트는 실패 지점이 더 많아 어떤 코드가 문제를 일으켰는지 추적하기 더 어려운 경우가 많지만, 테스트가 더 많은 자신감을 제공한다는 의미이기도 하다."

- **more points of failure**: 프론트엔드, 네트워크, 백엔드, DB, 환경 설정 등 어디서든 실패할 수 있다. 실패 시 "어디서 깨졌는가"를 찾는 데 시간이 걸린다.

> End to End tests are pretty darn capable, but typically you'll run these in a non-production environment (production-like, but not production) to trade-off that confidence for practicality.

"E2E 테스트는 꽤 강력하지만, 일반적으로 자신감과 실용성을 트레이드오프하기 위해 비프로덕션 환경(프로덕션과 유사하지만 프로덕션은 아닌)에서 실행한다."

```
E2E 장단점

장점
  ✓ confidence coefficient 최고
  ✓ 프론트+백엔드 전체 흐름 검증
  ✓ 실제 브라우저 동작 (레이아웃, 실제 네트워크)

단점
  ✗ 가장 느리고 비쌈 (CI 비용)
  ✗ 실패 시 원인 추적 어려움
  ✗ 환경 구성 복잡 (DB 초기화, 서버 시작)
  ✗ 비프로덕션 환경 → 100% 보장 불가
```

---

## 종합

E2E는 "Aunt Marie가 실제로 사용하는 시뮬레이션"이다. 가장 현실에 가깝지만 Aunt Marie를 기다리는 것처럼 시간이 걸린다. 모든 테스트를 E2E로 하면 CI가 몇 시간씩 걸리고 비용이 치솟는다. 그래서 happy path와 critical path만 E2E로 커버하고, 나머지는 integration과 unit으로 내려보내는 전략이 현실적이다.

---

---

# E2E로 모든 edge case를 잡으면 가장 확실한 거 아닌가?

## 도입

E2E가 confidence coefficient가 가장 높으니 모든 것을 E2E로 하면 될 것 같지만, 실제로는 각 edge case를 가장 효율적으로 잡는 레벨이 따로 있다. 레벨 선택은 효율성의 문제다.

---

## 본문

> At the top of the testing trophy, if you try to use an E2E test to check that typing in a certain field and clicking the submit button for an edge case in the integration between the form and the URL generator, you're doing a lot of setup work by running the entire application (backend included).

"Trophy 꼭대기에서 폼과 URL 생성기 사이의 통합에서 특정 edge case를 확인하기 위해 E2E 테스트를 사용하려 하면, 전체 애플리케이션(백엔드 포함)을 실행하는 많은 설정 작업을 하게 된다."

> That might be more suitable for an integration test. If you try to use an integration test to hit an edge case for the coupon code calculator, you're likely doing a fair amount of work ... you could cover that edge case better in a unit test.

"그것은 integration test에 더 적합할 수 있다. 쿠폰 코드 계산기의 edge case를 잡으려고 integration test를 사용하면 unit test로 더 잘 커버할 수 있다."

```
edge case 테스트 레벨 선택

쿠폰 계산 로직 경계값  → unit (순수 함수, 빠름, 설정 불필요)
폼-URL 생성기 연동     → integration (컴포넌트 조합, 중간 비용)
로그인→구매 전체 흐름  → E2E (전체 앱, 최고 비용, happy path용)
```

---

## 종합

아니다. 각 edge case를 가장 효율적으로 잡을 수 있는 레벨이 따로 있다. E2E로 모든 것을 잡으려 하면 셋업 비용이 과도하고, 테스트가 느려지고, 실패 원인 추적이 어려워진다. "이 edge case를 가장 낮은 비용으로 잡을 수 있는 레벨은 어디인가"를 질문하고 그 레벨에서 테스트하는 것이 Trophy의 핵심 전략이다.

---

---

# Async Server Component는 어떤 테스트 방식을 권장하는가?

## 도입

Next.js의 async Server Component는 React 생태계에서 비교적 새로운 기능이다. 일부 테스트 도구가 완전히 지원하지 못해, 일반적인 unit test 접근이 어렵다.

---

## 본문

> Since async Server Components are new to the React ecosystem, some tools do not fully support them. In the meantime, we recommend using End-to-End Testing over Unit Testing for async components.

"async Server Component는 React 생태계에서 새롭기 때문에 일부 도구가 완전히 지원하지 못한다. 그동안 async 컴포넌트에는 Unit Testing 대신 End-to-End Testing을 권장한다."

---

## 종합

Jest 등 일부 도구가 async Server Component를 완전히 지원하지 못하는 현실적 제약이 있다. 그래서 Next.js는 임시 방편으로 E2E를 권장한다. 도구 지원이 성숙해지면 unit/integration 테스트도 가능해질 것이다. 현재 시점에서는 Playwright나 Cypress로 실제 브라우저에서 async Server Component의 동작을 검증하는 것이 가장 신뢰할 수 있는 방법이다.

---

---

# Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?

## 도입

Snapshot Testing은 컴포넌트의 렌더 결과를 파일로 저장해두고, 이후 변화가 생겼는지 비교하는 방식이다. Unit/Integration/E2E와 같은 "범위" 축이 아니라, 보조 검증 방식이다.

---

## 본문

> Snapshot Testing involves capturing the rendered output of a component and saving it to a snapshot file. When tests run, the current rendered output of the component is compared against the saved snapshot. Changes in the snapshot are used to indicate unexpected changes in behavior.

"Snapshot Testing은 컴포넌트의 렌더된 출력을 캡처하여 스냅샷 파일에 저장하는 것이다. 테스트 실행 시 컴포넌트의 현재 렌더된 출력이 저장된 스냅샷과 비교된다. 스냅샷의 변화는 동작의 예상치 못한 변화를 나타내는 데 사용된다."

```
Snapshot Testing 동작 방식

첫 실행  → 스냅샷 파일 생성 (컴포넌트 HTML 저장)
이후 실행 → 현재 렌더 결과와 저장된 스냅샷 비교
변화 발생 → 테스트 실패 → 의도적 변경이면 jest --updateSnapshot
```

Snapshot은 Unit/Integration/E2E 중 어느 레벨에서도 사용할 수 있다. "범위"가 아닌 "검증 방식"의 차이다.

---

## 종합

Snapshot Testing은 의도치 않은 UI 변경을 감지하는 데 유용하지만, "스냅샷이 맞다"는 것이 "동작이 올바르다"는 의미는 아니다. 스냅샷이 잘못된 렌더 결과를 담고 있어도 테스트는 통과한다. 또한 스냅샷이 너무 크면 변경이 생길 때마다 검토 없이 업데이트하게 되어 의미를 잃는다. 핵심 UI 구조 변경 감지에는 유용하지만, 구체적인 동작 검증은 RTL의 `getByRole` 기반 어서션이 더 신뢰할 수 있다.

---

---

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

# confidence coefficient란 무엇인가?

## 도입

Testing Trophy를 이해하는 핵심 개념이다. 테스트 레벨마다 테스트 1개당 제공하는 자신감의 크기가 다르다는 것을 수치화한 개념이다.

---

## 본문

> As you move up the testing trophy, you're increasing what I call the "confidence coefficient." This is the relative confidence that each test can get you at that level.

"Trophy에서 위로 갈수록 내가 'confidence coefficient'라고 부르는 것을 높이게 된다. 이것은 각 테스트가 해당 레벨에서 얻을 수 있는 상대적 자신감이다."

- **confidence coefficient**: 테스트 1개당 제공하는 자신감의 상대적 크기. 아래로 내려갈수록 낮아진다.

> You can imagine that above the trophy is manual testing. That would get you really great confidence from those tests, but the tests would be really expensive and slow.

"Trophy 위에는 manual testing이 있다고 상상할 수 있다. 그 테스트에서 정말 큰 자신감을 얻겠지만, 테스트는 정말 비싸고 느릴 것이다."

```
confidence coefficient 개념

Manual (Aunt Marie)  ████████████████████  confidence 최고, 비용 최악
E2E                  ████████████████
Integration          ████████████
Unit                 ████████
Static               ██                    confidence 최저, 비용 최저
```

---

## 종합

confidence coefficient는 "이 테스트가 통과하면 사용자도 동작이 보장된다"는 신뢰의 크기다. unit test 1개가 통과해도 "이 함수 하나가 동작한다"는 좁은 보장만 준다. E2E 1개가 통과하면 "전체 결제 흐름이 동작한다"는 넓은 보장을 준다. Trophy는 이 coefficient를 기준으로, 낮은 coefficient를 가진 unit을 과도하게 쌓는 대신 높은 coefficient를 가진 integration을 충분히 작성하라고 권장한다.

---

---

# 각 테스트 레벨이 잡을 수 없는 문제를 정리하면?

## 도입

각 테스트 레벨은 자신만의 blind spot을 가진다. 이 blind spot을 이해하면 레벨을 적절히 조합해 coverage를 채울 수 있다.

---

## 본문

> In particular, static analysis tools are incapable of giving you confidence in your business logic.

"특히 정적 분석 도구는 비즈니스 로직에 대한 자신감을 줄 수 없다."

> Unit tests are incapable of ensuring that when you call into a dependency that you're calling it appropriately.

"Unit test는 의존성을 호출할 때 적절하게 호출하고 있다는 것을 보장할 수 없다."

> UI Integration tests are incapable of ensuring that you're passing the right data to your backend and that you respond to and parse errors correctly.

"UI Integration test는 백엔드에 올바른 데이터를 전달하고 오류에 올바르게 응답·파싱하고 있다는 것을 보장할 수 없다."

> End to End tests are pretty darn capable, but typically you'll run these in a non-production environment.

"E2E 테스트는 꽤 강력하지만, 일반적으로 비프로덕션 환경에서 실행한다."

```
레벨별 blind spot 요약

Static      → 비즈니스 로직 (실행 없이는 검증 불가)
Unit        → 의존성 연동 (mock이 실제와 다를 수 있음)
Integration → 실제 백엔드 연동 (MSW가 네트워크를 대체)
E2E         → 프로덕션 환경 자체 (비프로덕션 환경에서 실행)
```

---

## 종합

blind spot의 존재가 각 레벨을 조합해야 하는 이유다. 어느 한 레벨로 모든 것을 커버하려 하면 blind spot이 남는다. Static + Unit + Integration + E2E를 적절한 비중으로 조합했을 때 전체 blind spot이 최소화된다. Trophy는 이 조합의 비중을 Integration 중심으로 제안한다.

---

---

# 테스트 전략에서 레벨 분류보다 중요한 판단 기준은 무엇인가?

## 도입

unit인지 integration인지 E2E인지 분류하는 것보다 더 중요한 질문이 있다. "이 테스트가 배포에 대한 자신감을 높이는가"다.

---

## 본문

> In the end I don't really care about the distinctions. If you want to call my unit tests integration tests or even E2E tests then so be it.

"결국 나는 구분에 별로 신경 쓰지 않는다. 내 unit test를 integration test나 E2E test로 부르고 싶다면 그렇게 해도 된다."

> What I'm interested in is whether I'm confident that when I ship my changes, my code satisfies the business requirements.

"내가 관심 있는 것은 변경사항을 배포할 때 코드가 비즈니스 요구사항을 충족한다는 자신감이 있는지다."

> The biggest and most important reason that I write tests is CONFIDENCE.

"테스트를 작성하는 가장 크고 중요한 이유는 자신감이다."

> Much better to catch a bug locally from the tests than getting a call at 2:00 in the morning and fix it then.

"새벽 2시에 전화 받고 수정하는 것보다 테스트에서 로컬로 버그를 잡는 것이 훨씬 낫다."

---

## 종합

레벨 이름은 커뮤니케이션 도구다. "우리는 integration test를 충분히 쓰고 있는가"를 논의하는 데는 유용하지만, 테스트 하나하나에 레이블을 붙이는 것이 목적이 되면 안 된다. 판단 기준은 항상 "이 테스트가 통과하면 배포할 자신감이 생기는가"다. 자신감을 주는 테스트를 작성하고, 그 테스트가 실패하지 않게 코드를 관리하는 것이 전략의 전부다.

---

---

# 팀에서 애플리케이션 코드 커버리지 100%를 의무화하면 어떤 문제가 생기는가?

## 도입

커버리지 100%가 좋아 보이지만, 애플리케이션 코드에 강제하면 오히려 테스트 품질이 낮아질 수 있다. 커버리지 지표를 채우기 위해 의미 없는 테스트를 쓰게 되기 때문이다.

---

## 본문

> The problem is that you get diminishing returns on your tests as the coverage increases much beyond 70%.

"문제는 커버리지가 70%를 훨씬 넘어가면 테스트에서 수확 체감이 발생한다는 것이다."

> When you strive for 100% all the time, you find yourself spending time testing things that really don't need to be tested. Things that really have no logic in them at all (so any bugs could be caught by ESLint and Flow).

"항상 100%를 추구하면 정말 테스트할 필요가 없는 것들을 테스트하는 데 시간을 보내게 된다. 로직이 전혀 없는 것들(ESLint와 정적 분석으로 잡을 수 있는 것들)."

- **diminishing returns**: 수확 체감. 커버리지가 70%를 넘으면 테스트 1개당 얻는 자신감 증가분이 급감한다.
- **code coverage**: 테스트가 실행하는 코드의 비율. 높을수록 좋다는 직관과 달리, 과도한 추구는 구현 세부사항 테스트로 이어진다.

> You may also find yourself testing implementation details just so you can make sure you get that one line of code that's hard to reproduce in a test environment.

"테스트 환경에서 재현하기 어려운 한 줄 코드를 잡으려고 구현 세부사항을 테스트하게 될 수도 있다."

---

## 종합

100% 커버리지 의무화의 문제는 측정 지표가 목적을 대체한다는 것이다. 커버리지를 높이기 위해 의미 없는 테스트를 쓰면 CI는 통과하지만 실제 자신감은 늘지 않는다. 오히려 유지보수 부담만 늘어난다. "커버리지 70%와 의미 있는 use case 90% 커버"가 "커버리지 100%와 의미 없는 테스트 가득"보다 훨씬 가치 있다.

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
