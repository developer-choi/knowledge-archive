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

# 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

## 도입

네트워크 요청을 테스트에서 제어할 때 가장 손쉬운 방법은 `window.fetch`를 가짜 함수로 교체하는 것이다. 그러나 이 방식은 구현 세부사항에 의존하기 때문에 HTTP 클라이언트를 바꾸거나 환경이 달라지면 테스트가 깨진다. MSW는 네트워크 레벨에서 요청을 가로채 이 문제를 피한다.

---

## 본문

> We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing window.fetch, or relying on third-party adapters.

"우리는 window.fetch를 stub하거나 서드파티 어댑터에 의존하는 대신, MSW 라이브러리를 사용하여 테스트에서 API 통신을 선언적으로 모킹할 것을 권장한다."

- **declaratively**: 어떻게(how) 가로채는지가 아니라 무엇을(what) 응답할지만 선언한다. `http.get('/api/user', () => HttpResponse.json({ name: 'Kim' }))`처럼 핸들러만 정의하면 된다.
- **stubbing**: 원래 함수를 가짜 구현으로 바꿔치기하는 기법. `window.fetch = jest.fn()`이 전형적인 예. 구현 세부사항에 직접 결합된다.

```
window.fetch stubbing
  → axios로 교체하면 테스트 전부 깨짐
  → 함수 레벨에서 가로채 — 실제 요청 흐름과 다름

MSW
  → Service Worker / Node 인터셉터로 네트워크 레벨 가로채기
  → fetch든 axios든 상관없음
  → 브라우저 개발 환경과 Jest 환경 모두 동일한 핸들러 재사용
```

---

## 종합

`window.fetch`를 stub하면 테스트가 구현 세부사항(어떤 HTTP 함수를 쓰는가)에 종속된다. MSW는 HTTP 핸들러를 선언해두면 RTL 테스트와 실제 브라우저 개발 환경 모두에서 재사용할 수 있다. `axios`를 `ky`로 교체해도, 서버 URL을 바꿔도 핸들러만 수정하면 된다. 네트워크를 가장 현실에 가깝게 시뮬레이션하면서도 실제 서버 의존성을 제거하는 최선책이다.
