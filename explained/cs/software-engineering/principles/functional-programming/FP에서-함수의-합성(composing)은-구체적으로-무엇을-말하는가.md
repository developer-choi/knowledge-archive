# FP에서 "함수의 합성(composing)"은 구체적으로 무엇을 말하는가?

> Function composition is an act or mechanism to combine simple functions to build more complex ones.
> In functional programming languages, function composition can be naturally expressed as a higher-order function or operator.

---

**도입**

앞 질문에서 FP의 정의가 "applying and composing functions"라고 했습니다. apply(인자 적용)는 직관적인데 compose(합성)는 무엇을 말하는 걸까요? 답은 수학에서 가져옵니다 — `(g ∘ f)(x) = g(f(x))`. 한 함수의 출력을 다음 함수의 입력으로 흘려보내, 두 함수를 잇대어 새 함수를 만드는 연산입니다.

---

**본문**

> Function composition is an act or mechanism

함수 합성은 행위 또는 메커니즘이다.

- **act or mechanism**: 행위(개념적 동작)와 메커니즘(구체적 구현) 양쪽을 포괄. 합성은 머리 속의 추상적 조작이기도 하고, 실제 코드의 구현이기도 합니다.

> to combine simple functions to build more complex ones.

단순한 함수들을 결합해 더 복잡한 함수들을 만드는.

- **combine simple functions**: 작은 단위를 잇댄다는 게 핵심. 큰 함수를 한 번에 만드는 게 아니라, 작은 함수들을 합쳐서 큰 함수를 짓습니다.
- **build more complex ones**: 결과물은 더 복잡한 함수지만, 그 복잡함은 작은 함수들의 조합으로 분해 가능. 디버깅과 재사용이 쉬워지는 이유.
- **이게 없으면 어떻게 되는가**: 합성이 없으면 모든 변환을 한 함수 안에 다 박아 넣어야 합니다. 한 함수가 수십 줄로 부풀고, 그 안의 한 단계만 재사용하고 싶을 때 떼어낼 수 없게 됩니다.

> In functional programming languages, function composition can be naturally expressed

함수형 프로그래밍 언어에서, 함수 합성은 자연스럽게 표현될 수 있다.

- **naturally expressed**: 합성이 1급 시민(first-class citizen)으로 다뤄진다는 의미. 별도의 거추장스러운 문법 없이, 코드 안에서 자연스러운 한 줄로 쓰입니다.

> as a higher-order function or operator.

고차 함수(higher-order function)나 연산자(operator)로.

- **higher-order function**: 다른 함수를 인자로 받거나 결과로 반환하는 함수. 합성을 함수로 표현하면 `compose(g, f)` 같은 형태.
- **operator**: 언어 차원의 합성 기호. Haskell의 `.`, F#의 `>>` 같은 것. JS에는 전용 합성 연산자가 없어서 보통 함수로 구현하거나 라이브러리(`_.flow`, RxJS `pipe`)를 씁니다.

---

**종합**

수학의 `(g ∘ f)(x) = g(f(x))`를 코드로 옮긴 것이 함수 합성입니다. 한 함수의 출력을 다음 함수의 입력으로 흘려보내 새 함수를 만듭니다.

JS로 직접 구현하면:

```js
const compose = (g, f) => (x) => g(f(x));

const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const normalize = compose(lower, trim);

normalize('  HELLO  '); // 'hello'
```

`trim`과 `lower`는 각각 단순한 한 가지 변환만 합니다. `compose(lower, trim)`은 "먼저 trim, 그 결과를 lower"라는 새 함수를 만들어냅니다. 두 함수를 합쳐 더 복잡한 함수를 짓는 게 합성의 본질.

실무에서 합성 패턴이 이미 쓰이는 곳들:

| 도구 | 합성 형태 |
|---|---|
| lodash | `_.flow(fn1, fn2, fn3)` — 왼쪽에서 오른쪽으로 합성 |
| RxJS | `observable.pipe(map(...), filter(...), tap(...))` — 스트림 변환 합성 |
| Redux 미들웨어 | `applyMiddleware(thunk, logger)` — 미들웨어 체인 합성 |
| React HOC | `withAuth(withLogging(MyComponent))` — 컴포넌트 합성 |
| Hook 합성 | `useDebounced(useSearch(query))` — hook을 hook으로 감싸기 |

JSX 자체도 일종의 합성입니다 — `<Page><Header /><Content /></Page>`처럼 작은 컴포넌트를 더 큰 컴포넌트로 조립합니다. 함수의 출력(JSX 트리)이 다른 함수의 입력으로 흘러가는 구조.

오개념 예방 1: "합성 = 그냥 함수를 여러 번 호출하는 것"이라고 보면 핵심을 놓칩니다. 합성의 가치는 **새로운 함수를 만든다**는 점. `lower(trim(s))`라고 매번 쓰는 것과 `normalize = compose(lower, trim)`로 새 함수를 만들어두는 것은 다릅니다. 후자는 그 합성 자체를 다른 곳에 다시 적용·전달할 수 있어 추상화 단위가 됩니다.

오개념 예방 2: 합성 순서에 주의. `compose(g, f)(x) = g(f(x))`이지만 `pipe(f, g)(x) = g(f(x))`로 같은 결과를 다른 표기로 씁니다. lodash의 `_.flow`와 RxJS의 `pipe`는 pipe 형태(왼→오), Haskell의 `.`는 compose 형태(오→왼). 라이브러리 문서를 볼 때 어느 방향인지 확인이 필요합니다.

이게 없으면 어떻게 되는가: 합성을 의식적으로 쓰지 않으면 변환 로직이 한 함수 안에 응축되어 부풀고, 단계마다 임시 변수가 늘어납니다. 합성을 쓰면 각 단계가 독립된 함수로 분리되어 단위 테스트가 쉬워지고, 단계 추가/제거가 한 줄로 끝납니다.

상위 질문(FP의 정의)에서 본 "applying and composing functions"의 두 단어 중 "composing"의 무게가 "applying"과 같은 이유가 여기서 드러납니다 — FP에서 프로그램은 함수를 호출(apply)할 뿐 아니라, 함수들을 엮어(compose) 더 큰 함수를 짓는 행위로 만들어집니다.
