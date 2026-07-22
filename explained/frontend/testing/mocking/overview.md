# 테스트에서 왜 mocking이 필요한가?

## 본문

> When a block of code requires other parts of the system to run, you can't use a unit test with that external data. The unit test needs to run in isolation.

unit test의 정의상 그 코드만 격리해서 돌려야 하는데, 진짜 external data를 그대로 쓰면 바깥 시스템이 테스트에 딸려 들어와 격리가 성립하지 않는다. 그래서 바깥을 가짜로 대체(mock)해, 외부를 끊어낸 채 그 코드만 순수하게 돌릴 수 있게 만드는 것 — 이것이 mocking을 하는 이유다.

Vitest 문서는 여기에 더 구체적인 이유 둘을 든다.

> There are several reasons you might want to do this: maybe the real function makes network requests that would slow down your tests,

"이렇게 하고 싶은 데는 여러 이유가 있다. 진짜 함수가 네트워크 요청을 해서 테스트를 느리게 만들 수도 있고,

> or maybe you need to simulate an error that's hard to trigger with real code.

진짜 코드로는 일으키기 어려운 에러 상황을 흉내 내야 할 수도 있다."

- **simulate an error that's hard to trigger with real code**: 진짜 코드로는 일부러 일으키기 힘든 실패(서버 500, 타임아웃, 연결 끊김 등)를, 가짜 함수에 "이번엔 에러를 던져라"라고 설정해 마음대로 재현할 수 있다. 정상 경로뿐 아니라 에러 경로까지 검사하려면 이 통제가 필요하다.

---
## 종합

진짜 외부를 그대로 쓰면 두 가지가 걸린다.

1. 그 코드만 따로 돌린다는 unit test의 격리가 깨지고
2. 실제 네트워크·DB를 오가느라 느리고 비용이 들며 남의 서버 상태에 따라 결과가 불안정해진다.

바깥을 가짜로 대체하면 이 외부 변수를 제거하고 오직 테스트 대상 코드의 동작만 순수하게 검증할 수 있다. 덧붙여, 진짜로는 일으키기 힘든 에러 상황도 가짜로 자유롭게 재현할 수 있어 실패 경로까지 검사할 수 있다.

---
# 테스트에서 mock 함수를 쓰면 무엇을 할 수 있게 되는가?

## 본문

테스트 대상 코드는 보통 혼자 돌지 않고 다른 함수·모듈을 불러 쓴다. 이렇게 그 코드가 돌아가려고 기대는 상대를 **의존성(dependency)**이라 한다 — 사용자 목록을 받아오는 `fetchUsers`, DB에서 값을 읽는 함수, 결제 API를 호출하는 함수 같은 것이 그 코드의 의존성이다. 이 의존성을 진짜 대신 mock(가짜)으로 바꿔 끼우면, 내가 만든 가짜이기 때문에 진짜로는 못 하던 세 가지를 할 수 있게 된다 — **돌려줄 값을 내가 정하고, 어떻게 불렸는지 들여다보고, 진짜 부작용은 안 일어나게 막는 것**이다.

> Mock functions let you control what a dependency returns, observe how it was called, and isolate the code under test from side effects.

"mock 함수는 의존성이 무엇을 반환할지 통제하고, 그것이 어떻게 호출되었는지 관찰하며, 테스트 대상 코드를 부작용으로부터 격리하게 해준다."

- **반환값을 내가 정한다**: 진짜 함수는 자기 로직대로 값을 돌려주지만, 가짜 함수는 "이번엔 이 값을 돌려줘"라고 미리 정할 수 있다. 그래서 빈 목록·특정 사용자·실패 응답 같은 검사하고 싶은 상황을 원하는 대로 세팅한다.
- **어떻게 불렸는지 들여다본다**: 가짜 함수는 몇 번·어떤 인자로 불렸는지 스스로 기록해둔다. 그 기록을 꺼내 "이 함수가 이런 인자로 불렸는가"를 검증한다.
- **진짜 부작용을 막는다**: 부작용(side effect)이란 값을 돌려주는 것 말고 바깥세상에 일으키는 실제 변화 — 이메일 발송·DB 쓰기·결제 같은 것이다. 가짜를 끼우면 이런 변화가 안 일어나, 테스트 대상만 흔적 없이 순수하게 돌릴 수 있다.

---
# 같은 가짜 함수를 여러 테스트에서 재사용할 때, 왜 매 테스트마다 mock을 정리해줘야 하는가?

## 도입

진짜 함수 대신 끼워 넣는 가짜 함수(mock)에는 눈에 잘 안 보이는 특징이 하나 있다. 이 가짜 함수는 자기가 **몇 번 불렸는지, 매번 어떤 인자로 불렸는지**를 스스로 적어두는 작은 수첩(호출 일지, diary)을 안에 갖고 있다. 테스트에서 "이 함수가 1번 불렸는가", "이런 인자로 불렸는가"를 확인할 수 있는 것도 이 수첩 덕분이다. 이 수첩에 쌓인 기록이 곧 mock의 상태(state)다. 문제는 같은 가짜 함수를 여러 테스트가 공유할 때 이 수첩이 저절로 비워지지 않는다는 데서 생긴다.

---
## 본문

> Always remember to clear or restore mocks before or after each test run to undo mock state changes between runs!

"각 테스트 실행 전이나 후에 mock을 clear 또는 restore 하여, 실행 사이에 누적된 mock 상태 변화를 되돌리는 것을 항상 기억하라!"

- **clear**: mock이 적어둔 수첩의 기록만 지우는 것. 몇 번 불렸는지·어떤 인자였는지 같은 호출 이력을 0으로 되돌린다. 가짜 함수 자체는 그대로 두고 기록만 비운다.
- **restore**: 가짜로 바꿔치기했던 자리를 원래의 진짜 함수로 되돌리는 것. 기록을 지우는 데서 더 나아가, 가짜를 걷어내고 원본을 복구한다.
- **state changes between runs**: 실행(run) 사이에 누적된 상태 변화. 한 테스트를 돌리면 수첩에 기록이 쌓이는데(state change), 이 변화가 다음 실행으로 넘어가 남아 있는 것을 가리킨다.

해결방법은 매 테스트 전이나 후에 이 수첩을 비워주는 것이다. 보통 `beforeEach` 같은 훅에 정리 코드를 넣어 테스트마다 자동으로 초기화한다.

```ts
import { beforeEach, vi } from 'vitest';

// 각 테스트가 시작되기 전마다 mock의 수첩을 비운다
beforeEach(() => {
  vi.clearAllMocks(); // 호출 기록을 0으로 → 앞 테스트의 흔적 제거
});
```

여기서 mock의 호출 수첩은 "테스트가 남기는 상태"의 한 사례일 뿐이다. **테스트가 남긴 상태를 매 테스트마다 리셋해 서로 간섭하지 않게 한다**는 일반 원리 — mock뿐 아니라 공유 배열·전역 변수 등 모든 상태에 적용되는 — 와 그 근거(플레이키 테스트)는 [`./vitest/lifecycle-hooks.md`](./vitest/lifecycle-hooks.md)의 「한 파일의 테스트들이 매번 상태를 리셋하지 않으면 어떤 문제가 생기며, 훅이 이를 어떻게 해결하는가?」가 다룬다. 이 문서는 그 원리를 mock에 적용해, mock의 상태를 되돌리는 구체적 수단에 집중한다.

---
# mocking의 단점(비용)은 무엇인가?

## 본문

> When you mock something you're removing all confidence in the integration between what you're testing and what's being mocked.

"무언가를 mock하면, 테스트하는 대상과 mock되는 대상 사이의 연동에 대한 모든 확신을 제거하는 것이다."

- **removing all confidence**: mock을 끼운 그 연결에 대해서는 테스트가 아무것도 보증하지 못한다는 뜻. mock이 실제 의존성과 어긋나게 설정돼 있어도 테스트는 그대로 통과한다. 즉 그 지점의 실제 연동 검증력이 0이 된다.

예를 들어 로그인 폼을 테스트한다고 하자.

```ts
// 앱 코드
async function login(email, pw) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: pw }),
  }).then(r => r.json());
}

// ❌ login 함수 자체를 통째로 mock
vi.mock('./login', () => ({
  login: vi.fn().mockResolvedValue({ token: 'abc' }),
}));
```

`login`을 통째로 가짜로 바꾸면, 실제로 어떤 URL·바디가 서버로 나가는지 아무도 검증하지 않는다. `body`에서 email을 빠뜨리거나 필드명을 잘못 보내는 버그가 있어도 mock은 내가 정해둔 `{ token: 'abc' }`만 돌려주므로 테스트는 초록불이고, 프로덕션에서는 그 잘못된 요청이 진짜 서버로 날아가 로그인이 실패한다.

즉 **mock으로 테스트가 통과해도 프로덕션에서 동작한다는 보장은 없다** — mock이 테스트 대상과 진짜 의존성 사이의 실제 연결을 끊어버리기(sever) 때문이다. 그래서 mock은 "얼마나 적게 하느냐"보다 **어디서 끊느냐**가 중요하고, 잃는 확신의 양은 끊는 지점이 안쪽일수록 커진다. 이 원리를 네트워크 mocking에 적용한 구체적 사례 — 함수 통째 → `fetch` → 네트워크 경계로 끊는 지점을 옮길 때 무엇을 잃고 지키는지, '요청 조립 이음새(seam)'가 무엇인지 — 는 [`./msw/philosophy.md`](./msw/philosophy.md)의 「테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?」가 캐논으로 다룬다.

---
## 종합

mock은 그 연결에 대한 확신을 0으로 만드는 거래다 — 그래서 mock으로 통과해도 진짜에서 동작한다는 보장이 없고, 잃는 정도는 **어디서 끊느냐**에 달렸다.

---
# 그렇다면 언제 mocking을 해야 하는가?

## 본문

> Prefer real implementations when they're fast and reliable. If a dependency is a simple in-memory data structure or a pure function, there's no reason to mock it. The closer your tests are to real usage, the more confidence they give you. Only reach for mocks when the real thing is slow, flaky, or has side effects you can't control in a test.

"빠르고 믿을 만하면 진짜 구현을 선호하라. 의존성이 단순한 메모리 내 자료구조나 순수 함수면 mock할 이유가 없다. 테스트가 실제 사용에 가까울수록 더 큰 확신을 준다. 진짜가 느리거나, 불안정(flaky)하거나, 테스트에서 통제할 수 없는 부작용을 낼 때만 mock을 꺼내라."

아래 셋 중 하나에 걸릴 때만 예외적으로 mock한다.

- **slow(느림)**: 네트워크·DB·파일처럼 실제로 부르면 밀리초가 초가 되는 것. (Kent의 애니메이션·타임아웃과 같은 축)
- **flaky(불안정)**: 될 때도 안 될 때도 하는 것 — 현재 시각·난수처럼 실행마다 값이 달라져 결과가 흔들리는 의존성. Kent 목록엔 없던 축으로, "예측 불가능"을 mock으로 고정한다.
- **side effects you can't control(통제 불가 부작용)**: 이메일 발송·결제처럼 진짜로 실행되면 곤란한 실제 변화. (Kent의 부작용과 같은 축)

거꾸로, **메모리 내 자료구조나 순수 함수는 mock하지 않는다** — 빠르고 결정적이라 가짜로 바꿀 이유가 없고, 진짜를 그대로 써야 테스트가 실제 사용에 가까워져 확신이 커지기 때문이다.

단, "느리면 mock"과 "빠르자고 mock을 늘리지 마라"는 모순이 아니라 **시간의 크기** 문제다. 테스트당 몇 밀리초 아끼려고 mock을 끼우는 건 그 몇 ms와 실제 연동 확신을 맞바꾸는 나쁜 거래다 — 50ms×1000=50초라 해도, mock을 덜 하면 필요한 테스트 수 자체가 줄어 결국 손해다. 반면 네트워크·애니메이션처럼 초 단위로 느려지거나 결과를 기다려야 하는 건 크기가 달라 mock이 정당하다. 즉 mock을 부르는 건 '느림' 자체가 아니라 **감당 못 할 만큼 느림**이다. (테스트를 빠르게 하려고 자식 컴포넌트를 통째로 가짜로 대체하는 shallow rendering이 이 나쁜 거래의 대표 사례 — 확신을 통째로 팔아 속도를 산다.)

