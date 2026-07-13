# vi.fn / vi.spyOn / vi.mock은 각각 무엇인가?

## vi.fn — 속이 텅 빈 가짜 함수 한 개

`vi.fn()`은 **속이 비어 있는 가짜 함수**를 하나 만들어 준다.

> This gives you a function that does nothing by default (returns `undefined`), but tracks every call made to it.

"기본적으로 아무 일도 안 하는(그래서 `undefined`를 돌려주는) 함수를 주지만, 자기에게 온 모든 호출을 기록한다."

진짜 함수라면 덧셈 같은 실제 일을 하겠지만, `vi.fn()`으로 만든 가짜는 그런 일을 하지 않는다. 대신 **자기가 몇 번, 어떤 인자로 불렸는지를 수첩에 적어둔다.** 이 "호출 일지 수첩"이 mock 함수의 핵심이다.

```js
const fake = vi.fn()

fake(1, 2)   // 아무 일도 안 함. 하지만 "1, 2로 불렸다"는 기록은 남음
expect(fake).toHaveBeenCalledWith(1, 2)  // "1,2로 불렸지?" → 통과
```

정리하면 **`vi.fn()` = 진짜 일은 안 하고, 불린 기록만 남기는 빈 가짜 함수 한 개**다.

### vi.spyOn — 새로 만드는 게 아니라 기존 메서드를 감싼다

`vi.spyOn`은 `vi.fn()`과 결정적으로 다르다.

> `vi.spyOn` is different from `vi.fn()` in an important way. Instead of creating a brand new function, it wraps an existing method on an object. The original implementation still works by default, but you can observe every call and optionally override the behavior.

"`vi.spyOn`은 `vi.fn()`과 중요한 점에서 다르다. **새 함수를 만드는 대신, 객체에 이미 있는 메서드를 감싼다.** 원본 구현은 기본적으로 그대로 동작하고, 다만 모든 호출을 관찰하거나 원하면 동작을 덮어쓸 수 있다."

여기서 **spy(스파이, 첩자)**라는 이름이 딱 맞는다. 진짜를 다른 걸로 바꿔치기하는 게 아니라, **옆에서 몰래 지켜보는** 것이다. 진짜 메서드는 그대로 자기 일을 하고, 그 위에 "몇 번·어떤 인자로 불렸나" 하는 수첩만 살짝 얹는다.

```js
const calculator = { add: (a, b) => a + b }

const spy = vi.spyOn(calculator, 'add')
calculator.add(1, 2)   // 진짜 add가 그대로 실행됨 → 3
expect(spy).toHaveBeenCalledWith(1, 2)  // 호출 기록도 확인 가능
```

`vi.fn`과의 핵심 차이는 **"새로 만드느냐 vs 기존 걸 감싸느냐"**다. `vi.fn`은 아무 배경 없는 빈 함수를 새로 찍어낸다. `vi.spyOn`은 이미 있는 객체의 메서드를 대상으로 삼아 그 위에 관찰 장치를 덧씌운다. 그래서 원본 동작을 유지한 채 관찰만 할 수도 있고, 필요하면 `.mockReturnValue(...)` 같은 걸로 그 자리에서 동작을 덮어쓸 수도 있다.

## vi.mock — 모듈(파일) 전체를 통째로 가짜로 갈아끼운다

`vi.fn()`이 함수 **한 개**짜리 가짜라면, `vi.mock()`은 **파일(모듈) 전체**를 가짜로 바꾼다.

먼저 상황 그림부터 보자. 진짜 파일이 하나 있다.

```js
// calculator.js  ← 진짜 모듈
export function calculator(a, b) {
  return a + b   // 진짜로 덧셈함
}
```

`export`는 "이 함수를 바깥에서 갖다 쓸 수 있게 내보낸다", `import`는 "저 파일에서 내보낸 걸 가져온다"는 뜻이다. 여기까진 평범한 코드다. 이제 이 모듈을 통째로 가짜로 바꾼다.

> Substitutes all imported modules from provided `path` with another module.

"제공된 `path`에서 import되는 모든 모듈을 다른 모듈로 대체한다."

**substitute(대체)**란 원래 것을 치우고 그 자리에 다른 것을 끼우는 것이다. `vi.mock`은 지정한 경로에서 import되는 진짜 모듈을 통째로 가짜 모듈로 바꾼다.

```js
import { calculator } from './calculator.js'

// "calculator.js를 import하면, 진짜 대신 아래 가짜를 줘라"
vi.mock('./calculator.js', () => {
  return {
    calculator: vi.fn()   // 진짜 calculator 대신 빈 가짜 함수
  }
})

calculator(1, 2)   // 진짜 덧셈이 아니라 vi.fn()이 실행됨 → 3이 아니라 undefined
```

여기서 `vi.mock`에 넘긴 **두 번째 인자**를 보자.

```js
() => {
  return { calculator: vi.fn() }
}
```

이 함수가 바로 **factory**다. 이름이 "공장"인 이유는 — **호출하면 "가짜 모듈"이라는 제품을 만들어 내놓기** 때문이다. 공장에 스위치를 켜면 제품이 나오듯, 이 함수를 실행하면 `{ calculator: vi.fn() }`라는 가짜 모듈 객체가 나온다.

정리하면 **`vi.mock(경로, factory)` = "저 경로를 import하면, factory가 만들어낸 가짜를 대신 줘라"**다.

### vi.mock을 둘러싼 규칙들

- **hoisting(호이스팅)**: 코드상 어디에 적든 Vitest가 이 `vi.mock` 호출을 파일 맨 위로 끌어올려 모든 `import`보다 먼저 실행한다. 그래서 import가 일어나는 시점에는 대상 모듈이 이미 가짜로 바뀌어 있다.
- **import 전용**: `import`로 가져온 모듈만 대상이다. `require()`로 불러오는 모듈에는 통하지 않는다.

---

# 테스트 정리 시 clear / reset / restore는 각각 무엇을 되돌리는가?

## 도입

mock을 한 번 쓰고 끝내면 문제가 없다. 그런데 테스트는 보통 여러 개가 줄줄이 돌아가고, 그 사이 mock은 **호출 기록 수첩을 계속 쌓아간다.** 앞 테스트에서 "3번 불렸다"는 기록이 뒤 테스트로 그대로 새어 들어가면(leak), 뒤 테스트는 엉뚱한 상태에서 시작한다.

---
## 본문

(왜 정리가 필요한지 — 여러 테스트가 같은 가짜 하나를 공유해 호출 기록이 다음 테스트로 새는 문제 — 는 [mocking.md](./mocking.md)의 「같은 가짜 함수를 여러 테스트에서 재사용할 때, 왜 매 테스트마다 mock을 정리해줘야 하는가?」에서 다룬다. 여기서는 정리 함수 세 가지가 각각 무엇까지 되돌리는지에 집중한다.)

### 세 단계 정리 — clear < reset < restore

Vitest는 되돌리는 강도가 다른 세 가지를 준다. 약한 것부터 강한 것 순이다.

> - `mockClear()` clears the recorded call history and return values, but keeps any custom implementation you've set
> - `mockReset()` does everything `mockClear` does, and also removes any custom implementation, returning the mock to its default state
> - `mockRestore()` is specifically for spies created with `vi.spyOn`. It restores the original object method, effectively undoing the spy. On `vi.fn()` mocks, it behaves the same as `mockReset`

- **`mockClear()` — 수첩만 지운다**: 기록된 호출 이력과 반환값만 비운다. 내가 `.mockReturnValue(42)` 같은 걸로 심어둔 **커스텀 구현은 그대로 유지**한다. "몇 번 불렸나"만 0으로 되돌리고 싶을 때.
- **`mockReset()` — 수첩 + 커스텀 구현까지 지운다**: `mockClear`가 하는 일을 전부 하고, 거기에 더해 내가 심어둔 커스텀 구현까지 제거한다. 이때 `vi.spyOn` spy면 **원본 동작으로 되돌아가되 여전히 spy로 남고**(계속 추적), `vi.fn()`이면 되살릴 원본이 없어 **빈 가짜(undefined 반환)**가 된다.
- **`mockRestore()` — spy를 떼어내 원본을 복구한다**: `vi.spyOn`으로 만든 spy **전용**이다. spy를 씌우기 이전으로 완전히 되돌려 **원본 메서드를 되살리고 spy 자체를 없던 일로 만든다**(이후 호출은 추적되지 않음). `vi.fn()` mock에 부르면 복구할 원본이 없어 `mockReset`과 똑같이 동작한다.

`mockReset`과 `mockRestore`가 특히 헷갈리는데, **spy에 걸면 둘 다 원본 동작을 되살린다**는 점은 같고 차이는 **spy가 남느냐**다. 공식 예제로 비교하면:

```ts
const person = { greet: (name) => `Hello ${name}` }
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
person.greet('Alice')       // → 'mocked' (커스텀 구현)

// mockReset: 기록·구현을 리셋하되 여전히 spy로 남음
spy.mockReset()
person.greet === spy        // → true  (아직 spy)
person.greet('Bob')         // → 'Hello Bob' (원본 동작 복구)
spy.mock.calls              // → [['Bob']]  (여전히 추적됨)

// mockRestore: spy를 아예 떼어냄
spy.mockRestore()
person.greet === spy        // → false (더 이상 spy 아님)
person.greet('Bob')         // → 'Hello Bob'
spy.mock.calls              // → []  (추적 끝)
```

즉 `mockReset`은 spy를 **남겨둔 채** 원본 동작으로 되돌리고(계속 추적), `mockRestore`는 spy를 **걷어내** 원본을 되살린다(추적 종료).

위계를 한 줄로 보면: **mockClear(기록만) ⊂ mockReset(기록 + 구현, spy는 유지) ⊂ mockRestore(spy까지 제거해 원본 복구)**다. 뒤로 갈수록 더 많은 것을 원래대로 돌린다.

---

# 매 테스트마다 mock을 손으로 정리하지 않고 자동으로 원래대로 되돌리려면 어떻게 하는가?

## 도입

앞에서 본 `mockClear`/`mockReset`/`mockRestore`를 테스트마다 손으로 부르는 건 번거롭고, 무엇보다 **빠뜨리기 쉽다.** 한 군데서 정리를 깜빡하면 그 기록이 다음 테스트로 새어 원인 찾기 어려운 실패를 만든다.

그래서 실전에서는 "매 테스트가 끝날 때마다 알아서 정리되게" 자동화한다. 방법은 두 단계로, 뒤로 갈수록 손이 덜 간다.

---
## 본문

### 방법 A — afterEach에서 vi.restoreAllMocks()

가장 쉬운 접근은 매 테스트가 끝난 직후 모든 mock을 자동으로 복원하는 것이다.

> In practice, the easiest approach is to restore all mocks automatically after each test:

"실전에서 가장 쉬운 방법은 매 테스트 후 모든 mock을 자동으로 복원하는 것이다."

```js
import { afterEach, expect, test, vi } from 'vitest'

const calculator = {
  add: (a, b) => a + b,
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('spy is restored after the test', () => {
  const spy = vi.spyOn(calculator, 'add').mockReturnValue(42)
  expect(calculator.add(1, 2)).toBe(42)
  // afterEach will restore calculator.add to the original implementation
})
```

- **`afterEach(콜백)`**: Vitest가 제공하는 훅으로, 이름 그대로 "매 테스트 하나가 끝난 **뒤(after each)**마다" 콜백을 실행한다.
- **`vi.restoreAllMocks()`**: 그 시점에 존재하는 모든 mock·spy에 대해 `mockRestore`를 한꺼번에 걸어준다. 위 예에서 테스트 안에서 `spy`가 `add`를 42만 돌려주도록 덮어썼지만, 테스트가 끝나면 `afterEach`가 원본 `add(a, b) => a + b`로 되돌려 놓는다. 그래서 다음 테스트는 깨끗한 상태에서 시작한다.

이 한 블록만 파일에 적어두면, 테스트마다 정리 코드를 반복해서 넣을 필요가 없다.

### 방법 B — vitest.config의 restoreMocks: true (afterEach조차 불필요)

더 나아가면 `afterEach` 블록 자체도 없앨 수 있다. 설정 파일에 전역 옵션 하나를 켜면 된다.

> Even better, you can configure this globally with the `restoreMocks` option so you don't need the `afterEach` at all:

"더 좋은 방법으로, `restoreMocks` 옵션을 전역으로 설정하면 `afterEach`조차 전혀 필요 없다."

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
```

- **`restoreMocks: true`**: Vitest가 **매 테스트 전에** 자동으로 모든 mock에 `restoreAllMocks`를 걸어준다. 설정 한 줄이 프로젝트 전체의 모든 테스트 파일에 일괄 적용되므로, 각 파일에 `afterEach`를 적을 필요가 없어진다.
- 방법 A는 파일마다 훅을 적어야 하지만, 방법 B는 설정 한 곳에서 전역으로 처리한다. 정리를 깜빡할 여지 자체가 사라지는 게 방법 B의 이점이다.
