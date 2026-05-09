# 함수형 프로그래밍이란 무엇이며, 명령형과 어떻게 다른가?

## 도입

함수형 프로그래밍(FP)은 프로그램을 **함수들의 조합**으로 짓는 패러다임입니다. 한쪽에는 "단계 지시문을 순서대로 나열해 상태를 바꿔가는" 명령형 스타일이 있고, 다른 한쪽에는 "값을 다른 값으로 매핑하는 표현식을 트리로 엮는" 함수형 스타일이 있습니다. JS는 두 패러다임을 함께 쓸 수 있는 언어라, 이 차이를 잡으면 같은 코드를 어느 스타일로 쓸지 의식적으로 고를 수 있게 됩니다.

---

## 본문

> In computer science, functional programming is a programming paradigm

컴퓨터 과학에서 함수형 프로그래밍은 하나의 프로그래밍 패러다임이다.

- **paradigm**: 프로그래밍의 사고 틀. 객체지향(OOP), 함수형(FP), 절차적, 선언형 등이 큰 갈래. 언어가 아니라 사고방식.

> where programs are constructed by applying and composing functions.

이 패러다임에서는 프로그램이 함수의 적용과 합성을 통해 구성된다.

- **applying**: 함수에 인자를 넣어 값을 얻는 행위. `add(1, 2)`처럼 인자를 적용해 결과 3을 얻음.
- **composing**: 함수들을 이어 붙여 새 함수를 만드는 것. `compose(g, f)(x) = g(f(x))` 같은 합성. 다음 질문에서 더 자세히 다룸.
- **applying and composing**: 두 가지가 같은 무게로 등장. FP에서 프로그램 짓기는 이 두 동작의 반복이라는 뜻.

> It is a declarative programming paradigm

함수형 프로그래밍은 선언형 프로그래밍 패러다임이다.

- **declarative**: "무엇을 계산할지"를 기술하는 방식. 단계별 지시가 아니라 결과를 표현. `[1,2,3].map(x => x * 2)`는 "각 원소에 2를 곱한 새 배열"이라는 결과를 선언하는 형태.

> in which function definitions are trees of expressions that map values to other values,

함수 정의가 값을 다른 값으로 매핑하는 표현식 트리로 이루어진다.

- **trees of expressions**: 표현식이 값으로 평가되는 트리 구조. `g(f(x) + h(y))` 같은 식은 안쪽부터 평가되는 트리로 읽힙니다.
- **map values to other values**: 입력값 → 출력값이라는 수학적 매핑. 함수가 "수학에서의 함수"에 가까운 의미. 같은 입력에 같은 출력이 나오는 게 자연스러움.
- **이게 없으면 어떻게 되는가**: 입력→출력의 일관 매핑이 없으면, 같은 함수를 같은 인자로 두 번 호출했을 때 결과가 다를 수 있고, 다음 질문(순수 함수)에서 다룰 최적화 가능성이 사라집니다.

> rather than a sequence of imperative statements

명령형 문장의 시퀀스가 아니라.

- **sequence**: 순서대로 실행되는 일련의 명령들. "이거 한 다음 저거 한 다음 그거 해라"의 구조.
- **imperative statements**: 명령형 문장. `i = 0`, `arr.push(...)`, `if (...) { mutate(...) }` 같이 상태를 바꾸는 명령들.

> which update the running state of the program.

프로그램의 실행 상태를 갱신하는.

- **running state**: 프로그램이 실행 중에 들고 있는 변수·메모리 상태. 명령형은 이 상태를 한 단계씩 바꿔가며 결과에 다다릅니다.
- **update**: 기존 값을 덮어쓰는 행위. 명령형의 본질. 함수형은 새 값을 반환할 뿐 기존 상태를 바꾸지 않습니다.

---

## 종합

두 스타일을 한 표로 비교:

| 측면 | 명령형 | 함수형 |
|---|---|---|
| 표현 단위 | 문장(statement) | 표현식(expression) |
| 시간 흐름 | 단계의 순서가 의미를 만든다 | 표현식 트리의 평가가 결과를 만든다 |
| 상태 | 변수의 값을 갱신 | 값을 변환해 새 값을 반환 |
| 사고 방식 | "어떻게 할지"를 지시 | "무엇이 결과인지"를 선언 |

JS로 같은 결과를 두 스타일로 쓰면:

```js
// 명령형 — 상태(result)를 한 단계씩 갱신
function double(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i] * 2);
  }
  return result;
}

// 함수형 — 값을 다른 값으로 매핑
const double = (arr) => arr.map(x => x * 2);
```

명령형 버전은 `result`라는 가변 상태를 만들고 `i`를 0부터 늘리며 push로 한 칸씩 채워갑니다. 함수형 버전은 "각 원소를 2배로 매핑한 새 배열"이라는 결과를 한 줄로 선언합니다. `.map`, `.filter`, `.reduce`가 JS에서 가장 자연스럽게 쓰이는 함수형 도구.

User Annotation이 짚은 핵심 — FP와 OOP는 양자택일이 아닙니다. JS는 두 패러다임을 함께 쓸 수 있는 multi-paradigm 언어이고, 실무에서도 두 스타일이 섞여 등장합니다. React 함수형 컴포넌트가 클래스 컴포넌트의 인기를 가져간 흐름이 그 예 — 컴포넌트는 함수로 표현하되, 컴포넌트들의 트리는 객체적인 합성 구조를 갖습니다.

오개념 예방 1: "함수형 = 함수를 많이 쓰는 것"이 아닙니다. 함수가 등장한다고 다 함수형이 아니고, 함수가 적어도 입력→출력 매핑 위주로 짜였으면 함수형. 핵심은 **상태 갱신 vs 값 변환**의 사고 차이.

오개념 예방 2: "선언형(declarative) = 함수형(FP)"도 부분적으로만 맞습니다. 선언형은 함수형보다 더 넓은 우산이고, SQL이나 React JSX도 선언형의 형태입니다. FP는 그 안에 들어가는 한 갈래.

이게 없으면 어떻게 되는가: 명령형 일변도로 짜면 상태 변경 흐름이 코드 곳곳에 흩어지고, 같은 입력에서 같은 출력이 나오리라는 보장이 사라집니다. 디버깅과 테스트가 점점 어려워집니다. 함수형 스타일을 선택적으로 도입하면 — `.map`/`.filter`/`.reduce`로 데이터 변환 흐름을 표현하기, 부수효과를 함수 경계 밖으로 밀기 — 이 흐름을 코드 안에서 좁힐 수 있습니다.

다음 질문들은 이 정의의 두 핵심 단어 — composing(합성)과 pure function(순수 함수) — 를 차례로 풀어갑니다.

---

# FP에서 "함수의 합성(composing)"은 구체적으로 무엇을 말하는가?

## 도입

앞 질문에서 FP의 정의가 "applying and composing functions"라고 했습니다. apply(인자 적용)는 직관적인데 compose(합성)는 무엇을 말하는 걸까요? 답은 수학에서 가져옵니다 — `(g ∘ f)(x) = g(f(x))`. 한 함수의 출력을 다음 함수의 입력으로 흘려보내, 두 함수를 잇대어 새 함수를 만드는 연산입니다.

---

## 본문

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

## 종합

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

함수 합성의 데이터 흐름을 다이어그램으로:

```
   compose(g, f)(x) = g(f(x))

       x          f(x)         g(f(x))
   ┌───────┐   ┌───────┐   ┌───────┐
   │ input │──>│   f   │──>│   g   │──> result
   └───────┘   └───────┘   └───────┘
                  │            │
                  │            └─ 두 번째 적용
                  └─ 첫 번째 적용

   예: normalize = compose(lower, trim)

     '  HELLO  ' ──> [trim] ──> 'HELLO' ──> [lower] ──> 'hello'

   pipe(f, g)(x) = g(f(x))  (왼→오 표기)
   compose(g, f)(x) = g(f(x))  (수학식 표기, 오→왼)
   둘은 같은 결과를 다른 순서로 표기할 뿐
```

핵심: 한 함수의 출력이 다음 함수의 입력으로 흘러가는 데이터 흐름. 작은 함수들을 잇대어 새 함수를 만든다.

---

# 순수 함수(pure function)는 어떤 두 조건을 만족해야 하는가?

## 도입

"함수란 인풋을 넣으면 아웃풋이 나오는 것"이라는 직관은 사실 일반 함수가 아니라 **순수 함수**의 정의에 가깝습니다. 일반 함수는 파일 IO, 네트워크 호출, 전역 상태 변경 같은 부수효과를 가질 수 있습니다. FP가 강조하는 "값을 다른 값으로 매핑한다"는 그림은 정확히 순수 함수의 그림이고, 이 문서는 그 두 조건을 한 문장에서 추출합니다.

---

## 본문

> When a pure function is called with some given arguments,

순수 함수가 어떤 인자들로 호출될 때,

- **pure function**: 결정적이고 부수효과가 없는 함수. "수학 함수"에 가까운 형태.
- **with some given arguments**: 인자가 함수 외부와의 유일한 입력 통로라는 점이 함의. 외부 상태를 따로 끌어다 쓰지 않습니다.

> it will always return the same result,

항상 같은 결과를 반환할 것이며,

- **always return the same result**: 결정성(determinism). 같은 인자 → 같은 결과가 항상 보장. 시각, 시퀀스, 호출 횟수에 관계없이 동일.
- **always**: 어떤 예외도 없다는 강조. 한 번이라도 다른 결과가 나오면 순수 함수가 아닙니다.
- **이게 없으면 어떻게 되는가**: 같은 인자로 다른 결과가 나오면 — 즉 결과가 인자 외 어딘가에 의존하면 — 메모이제이션(캐싱)이 깨지고, 테스트가 매번 다른 답을 줄 수 있어 안정적인 검증이 불가능해집니다.

> and cannot be affected by any mutable state or other side effects.

가변 상태나 다른 부수효과의 영향을 받을 수 없다.

- **mutable state**: 변경 가능한 외부 상태. 전역 변수, 모듈 스코프 변수, 외부에서 전달된 객체의 내부 등. JS에서는 `let` 변수, 객체 필드, 모듈 변수가 흔한 형태.
- **side effects**: 외부에 미치는 영향. DOM 조작, 콘솔 출력, 네트워크 요청, 파일 IO, 전역 상태 변경 등.
- **cannot be affected by**: 영향을 **받지 않는다**는 면. 사실은 "받지도, 일으키지도 않는다"는 양면이 모두 함의됩니다 — Official Annotation에서 명시적으로 "have no side effects"라고 못 박습니다.

---

## 종합

두 조건을 정리하면:

| 조건 | 의미 | JS로 표현 |
|---|---|---|
| 1. 결정성 | 같은 인자 → 항상 같은 결과 | `(a, b) => a + b` 같은 형태 |
| 2. 부수효과 없음 | 외부 상태를 읽지도 쓰지도 않음 | DOM·console·네트워크·전역 변수 안 건드림 |

Official Annotation이 부수효과의 두 영역을 명시합니다 — **메모리 영역**(전역 변수·외부 객체 변경)과 **I/O 영역**(파일·네트워크·콘솔). 둘 중 하나라도 침범하면 순수성을 잃습니다.

JS 코드 예:

```js
// 순수 함수
const add = (a, b) => a + b;
const double = (arr) => arr.map(x => x * 2);
const formatPrice = (n) => `${n.toLocaleString()}원`;

// 순수하지 않은 함수
let count = 0;
function impureIncrement() {
  count++;        // 외부 상태 변경 (memory side effect)
  return count;
}

function impureLog(msg) {
  console.log(msg); // I/O side effect
  return msg;
}

function impureRandom() {
  return Math.random(); // 같은 인자(없음)에 다른 결과 — 결정성 위반
}

function impureFetch(id) {
  return fetch(`/api/users/${id}`).then(r => r.json()); // I/O + 같은 id에 다른 결과 가능
}
```

이 두 조건이 메모이제이션, 병렬 실행, 형식 검증의 토대가 됩니다. 같은 인자에 같은 결과가 보장되니 결과를 캐시할 수 있고, 외부 상태에 영향을 주지 않으니 동시 실행이 안전하며, 입출력 매핑이 명확하니 수학적 증명도 가능합니다(다음 질문들에서 자세히).

User Annotation의 통찰이 핵심입니다 — "함수란 매개변수로 인풋을 넣으면 아웃풋이 나오는 것"이라는 직관은 사실 일반 함수가 아니라 순수 함수의 정의에 가깝습니다. 우리가 흔히 "함수"라고 부르며 머리에 떠올리는 그림은 이미 순수 함수입니다. 일반 함수는 파일 IO·네트워크·전역 상태 변경 같은 부수효과를 가질 수 있어, 직관과 다른 동작을 합니다.

React 프로젝트에서 순수성을 의식할 자리:

- **함수형 컴포넌트**: 같은 props/state면 같은 JSX를 반환하는 게 React의 가정. 컴포넌트 안에서 외부 변수를 직접 읽어 다른 결과를 내면 React의 메모이제이션(`React.memo`, `useMemo`)이 깨집니다.
- **selector 함수**: Redux selector나 `useMemo`의 계산 함수는 순수해야 메모이제이션이 안전.
- **이벤트 핸들러**: 부수효과(setState, fetch)를 일으키는 곳. 이건 순수할 수 없고, 그래서 React는 `useEffect`라는 별도 자리를 마련해 부수효과를 모읍니다.

오개념 예방 1: 순수 함수가 부수효과를 일으키지 않으면 어떻게 화면을 그리고 서버와 통신하나요? — FP는 "모든 함수가 순수해야 한다"가 아니라 "**순수한 부분과 부수효과 부분을 분리**해야 한다"입니다. 핵심 로직은 순수하게 유지하고, 부수효과는 시스템 경계(이벤트 핸들러, useEffect, main 함수 등)에 모아둡니다.

오개념 예방 2: `console.log`가 들어 있으면 순수하지 않습니다(엄밀히는). 디버깅 중 임시로 넣은 log도 순수성 관점에서는 위반. 운영 코드에서는 부수효과를 자리에 맞게 배치하는 의식이 필요합니다.

다음 두 질문은 이 두 조건이 만들어내는 실무적 이점(부수효과 제한의 이득)과 컴파일러 최적화 가능성을 차례로 다룹니다.

---

# 부수효과를 제한하면 어떤 실무적 이점이 있는가?

## 도입

앞 질문에서 순수 함수의 두 조건을 봤습니다 — 결정성과 부수효과 없음. 그럼 "왜 부수효과를 그렇게까지 제한해야 하나"라는 질문이 자연스럽게 따라옵니다. 이 문서는 그 답을 세 가지로 모읍니다 — 버그 감소, 디버깅·테스트 용이, 형식 검증 적합성.

---

## 본문

> Proponents of purely functional programming claim

순수 함수형 프로그래밍의 옹호자들은 다음과 같이 주장한다.

- **proponents**: 옹호자들. "claim"과 함께 쓰여서 "이게 절대 진리다"가 아니라 "이런 입장의 사람들이 이렇게 주장한다"는 톤. FP를 만능 해법으로 받아들이지 말라는 함축.
- **purely functional programming**: 부수효과를 거의 허용하지 않는 엄격한 함수형 스타일. JS는 다중 패러다임이라 이 정도까지는 못 가지만, 핵심 로직에 한해 적용은 가능.

> that by restricting side effects,

부수효과를 제한함으로써,

- **restricting**: 완전 금지가 아니라 제한. 시스템에는 부수효과가 반드시 필요(화면 그리기, 네트워크 호출). 핵심은 **부수효과를 코드의 어느 자리에 모아둘 것인가**.
- **side effects**: 외부 상태 변경, I/O. 이걸 함수 경계 밖으로 밀면 함수 안쪽이 순수해집니다.

> programs can have fewer bugs,

프로그램이 더 적은 버그를 가질 수 있고,

- **fewer bugs**: 버그가 0이 되는 게 아니라 줄어든다는 점. 이유는 다음에 이어지는 두 항목과 연결됩니다 — 디버깅·테스트가 쉬워지고, 형식 검증이 가능해지면 자연히 버그가 잡히기 쉬워집니다.

> be easier to debug and test,

디버깅과 테스트가 더 쉽고,

- **easier to debug**: 부수효과가 없으면 함수 안의 흐름이 입력→출력으로 단순. 한 함수의 동작을 이해하기 위해 외부 상태 전체를 머리에 띄울 필요가 없습니다.
- **easier to test**: 단위 테스트에서 mocking 없이 입출력만 검증하면 끝. 외부 의존성이 없으니 테스트가 격리되고 빠릅니다.

> and be more suited to formal verification.

그리고 형식 검증에 더 적합하다.

- **formal verification**: 프로그램의 정확성을 수학적으로 증명하는 기법. Lean, Coq, Idris 같은 도구. 부수효과가 없는 함수는 수학 함수와 같은 모양이라 증명 도구를 적용하기 쉽습니다.
- **이게 없으면 어떻게 되는가**: 부수효과가 곳곳에 흩어진 코드는 한 함수의 동작을 정의역×환경 전체로 따져야 해서 증명이 사실상 불가능합니다.

---

## 종합

세 가지 이점을 자세히 풀면:

| 이점 | 메커니즘 | 실무 효과 |
|---|---|---|
| 버그 감소 | 입출력이 결정적 → 예측 가능한 동작 | 같은 입력에 항상 같은 출력 → 재현 가능한 실패 |
| 디버깅·테스트 용이 | 외부 의존이 없음 → 단위 격리 | mocking 최소화, 테스트가 빠르고 안정적 |
| 형식 검증 적합 | 수학 함수와 동형 → 증명 도구 적용 가능 | 임계 시스템(금융·항공)에서 사용 |

부수효과 제한이 가져오는 부가적 이점들도 있습니다. 같은 입력에 같은 출력이 보장되니 단위 테스트에서 mocking 없이 입출력 검증만으로 끝납니다. 외부 상태 의존이 없어 동시 실행해도 race condition이 안 생기므로 병렬화에 유리하고, 호출 순서를 바꿔도 의미가 보존되어 컴파일러 최적화 여지가 커집니다(다음 질문에서 더 자세히).

JS/React 맥락의 적용 — User Annotation이 짚은 Fast Fail 원칙과 같은 결입니다. 함수 안에 잘못된 값이 들어왔으면 즉시 reject하고, 통과한 데이터는 함수 범위 안에서 안전하다고 가정하고 작성합니다. "내가 컨트롤할 수 있는 영역"을 좁혀가면서 에러 가능성을 줄이는 사고와 부수효과 제한은 같은 방향입니다.

```js
// 부수효과가 함수 안에 박혀 있는 형태 — 테스트하기 어려움
function processOrder(orderId) {
  const order = fetchOrderFromDB(orderId);   // I/O
  const total = order.items.reduce(...);     // 순수 계산
  saveResultToDB(orderId, total);            // I/O
  console.log(`Processed: ${orderId}`);      // I/O
  return total;
}

// 부수효과를 경계로 밀어낸 형태 — 핵심 로직은 순수
function calculateTotal(order) {
  return order.items.reduce((sum, i) => sum + i.price, 0);
}

// 부수효과는 호출자(orchestrator)에서
async function processOrderHandler(orderId) {
  const order = await fetchOrderFromDB(orderId);
  const total = calculateTotal(order);  // 순수 — 단위 테스트 쉬움
  await saveResultToDB(orderId, total);
  console.log(`Processed: ${orderId}`);
  return total;
}
```

`calculateTotal`은 외부 의존이 없어 `expect(calculateTotal(mockOrder)).toBe(...)` 한 줄로 테스트가 끝납니다. 부수효과를 함수 경계로 밀면 핵심 비즈니스 로직이 단위 테스트 친화적으로 분리됩니다.

오개념 예방 1: "fewer bugs"는 자동 보장이 아닙니다. 부수효과를 줄여도 알고리즘이 잘못되었으면 버그가 납니다. FP가 줄여주는 건 **재현 불가능한 버그, 환경 의존 버그, race condition** 같은 특정 종류. 도메인 로직 오류는 FP라고 막아주지 않습니다.

오개념 예방 2: "더 적은 버그 = 항상 옳은 선택"으로 이어지지는 않습니다. 부수효과를 함수 경계로 밀어내려면 추가 추상화가 필요하고, 단순한 코드를 복잡하게 만들 수도 있습니다. 핵심 로직과 부수효과를 어느 정도 분리할지는 프로젝트의 규모·중요도에 따라 조절합니다.

다음 질문은 이 부수효과 제한이 가져오는 또 다른 큰 이득 — 컴파일러 최적화와 병렬화 — 를 구체적인 4가지 성질로 살펴봅니다.

---

# 순수 함수가 가진 어떤 구체적 성질이 컴파일러 최적화·병렬화를 가능하게 하는가?

## 도입

앞 질문에서 부수효과 제한이 "버그 감소·테스트 용이·형식 검증"이라는 실무적 이점을 가져온다고 봤습니다. 이번엔 한 단계 더 들어가, 컴파일러 입장에서 순수 함수가 어떤 변환을 허용해주는지를 4가지 성질로 정리합니다. 모두 "같은 입력 → 같은 출력 + 외부 영향 없음"이라는 두 조건에서 파생됩니다.

---

## 본문

> Pure functions (or expressions) have no side effects (memory or I/O).

순수 함수(또는 표현식)는 부수효과(메모리나 I/O)를 갖지 않는다.

- **memory side effects**: 외부 메모리 변경 — 전역 변수, 외부 객체의 필드 수정 등.
- **I/O side effects**: 입출력 작용 — 파일·네트워크·콘솔.
- 이 한 줄이 다음 4가지 성질의 전제조건. 부수효과가 없다는 게 모든 변환의 안전성을 보장합니다.

> This means that pure functions have several useful properties, many of which can be used to optimize the code:

이는 순수 함수가 여러 유용한 성질을 가짐을 의미하며, 그중 다수는 코드 최적화에 사용될 수 있다.

- **useful properties**: 곧 나올 4가지 성질. 컴파일러가 코드를 변환할 때 활용하는 도구들.
- **optimize the code**: 자동 최적화. 개발자가 신경 쓰지 않아도 컴파일러가 더 빠른 코드를 생성할 수 있다는 뜻.

> If the result of a pure expression is not used, it can be removed without affecting other expressions.

순수 표현식의 결과가 사용되지 않는다면, 다른 표현식에 영향을 주지 않고 제거될 수 있다.

- **not used**: 계산했는데 그 결과가 어디에도 안 쓰이는 경우.
- **can be removed**: 통째로 삭제 가능. 부수효과가 없으니 호출 자체를 없애도 외부 세계가 변하지 않습니다. 이게 dead code elimination.
- **이게 없으면 어떻게 되는가**: 부수효과가 있으면 결과를 안 써도 호출은 남겨야 합니다. `console.log("debug")`는 결과가 쓰이지 않지만 출력 효과가 있어 제거 못 함.

> If a pure function is called with arguments that cause no side-effects, the result is constant with respect to that argument list

순수 함수가 부수효과를 일으키지 않는 인자들로 호출될 때, 그 결과는 그 인자 목록에 대해 상수이다.

- **constant with respect to that argument list**: 인자가 같으면 결과가 항상 같음. 인자→결과의 1:1 매핑.

> (sometimes called referential transparency or idempotence),

(때로는 참조 투명성이나 멱등성으로 불린다).

- **referential transparency (참조 투명성)**: 식을 그 값으로 치환해도 의미가 변하지 않는 성질. `add(1, 2)`를 `3`으로 바꿔도 프로그램 동작이 같음.
- **idempotence (멱등성)**: 같은 호출이 같은 결과를 보장. HTTP의 GET·PUT이 멱등적이라고 할 때의 그 멱등성과 동일한 직관.

> i.e., calling the pure function again with the same arguments returns the same result.

즉, 같은 인자로 다시 호출하면 같은 결과를 반환한다.

> (This can enable caching optimizations such as memoization.)

(이는 memoization 같은 캐싱 최적화를 가능하게 한다.)

- **memoization**: 한 번 계산한 결과를 키-값으로 저장해 재사용하는 기법. 같은 인자에 같은 결과가 보장되니 안전하게 캐시 가능.

> If there is no data dependency between two pure expressions, their order can be reversed, or they can be performed in parallel

두 순수 표현식 사이에 데이터 의존성이 없다면, 그 순서를 뒤집거나 병렬로 수행될 수 있다.

- **data dependency**: 한쪽 결과가 다른 쪽 입력으로 쓰이는 의존 관계. 의존이 없으면 어느 쪽이 먼저 실행되든 결과가 같음.
- **order can be reversed**: 컴파일러가 순서를 바꿀 자유.
- **performed in parallel**: 동시에 실행 가능. 멀티코어 활용의 토대.

> and they cannot interfere with one another (in other terms, the evaluation of any pure expression is thread-safe).

서로 간섭할 수 없다(다시 말해, 어떤 순수 표현식의 평가도 thread-safe하다).

- **thread-safe**: 여러 스레드가 동시에 접근해도 결과가 변하지 않음. 부수효과가 없으니 공유 상태가 없고, 공유 상태가 없으니 race condition도 없음.

> If the entire language does not allow side-effects, then any evaluation strategy can be used;

언어 전체가 부수효과를 허용하지 않는다면, 어떤 평가 전략도 사용할 수 있다.

- **evaluation strategy**: 인자를 언제 평가할지의 전략. strict evaluation(즉시), lazy evaluation(필요할 때), call-by-need 등.

> this gives the compiler freedom to reorder or combine the evaluation of expressions in a program

이는 컴파일러에게 프로그램의 표현식 평가를 재배열하거나 결합할 자유를 준다.

- **reorder or combine**: 순서를 바꾸거나 묶어서 한꺼번에 처리. 같은 결과를 더 효율적으로 얻는 방법을 컴파일러가 선택.

> (for example, using deforestation).

(예: deforestation 사용).

- **deforestation**: 중간 자료구조(임시 배열·리스트)를 제거해 한 번에 처리하도록 만드는 컴파일러 최적화. `arr.map(f).map(g)`이 두 번 순회 + 임시 배열 1개를 만드는데, deforestation은 이걸 한 번 순회 + 임시 배열 0개로 합칩니다.

---

## 종합

4가지 성질을 한 줄씩 요약하면:

| 성질 | 가능해지는 최적화 |
|---|---|
| 결과가 안 쓰이면 제거 가능 | **Dead code elimination** |
| 같은 인자에 같은 결과 보장 | **Memoization** (결과 캐싱) |
| 데이터 의존 없으면 순서 자유·병렬 가능 | **Reordering / Parallelism** |
| 부수효과 없으면 평가 전략 자유 | **Free evaluation strategy** (reorder/combine, deforestation 등) |

네 성질 모두 "같은 입력 → 같은 출력 + 외부 영향 없음"이라는 순수 함수의 두 조건에서 파생됩니다. 컴파일러 입장에서 순수 함수는 "건드려도 안전한 식"이라 자유롭게 제거·치환·재배열할 수 있습니다. 부수효과 제한이 단순히 "버그가 적다"를 넘어 코드 변환의 토대가 되는 이유입니다.

JS 맥락에서 마주치는 형태:

- **React.memo / useMemo**: 같은 props/deps에 같은 결과가 보장되는 컴포넌트·계산 함수만 안전하게 메모이즈됩니다. 함수 안에 부수효과가 있으면 메모이즈된 동안 그 효과가 안 일어나 버그가 됩니다.
- **Web Worker 병렬화**: 데이터 의존이 없는 순수 계산을 별도 스레드로 보내 병렬 처리. 순수 함수가 아니면 메인 스레드의 상태와 충돌해 race condition.
- **번들러의 tree shaking**: 사용되지 않는 export를 제거하는 최적화. 모듈 코드가 부수효과가 없어야(`/*#__PURE__*/` 힌트 등) 안전하게 제거 가능.
- **Lodash chain vs lodash/fp**: chain은 lazy evaluation을 적용해 중간 배열을 만들지 않고 한 번에 처리합니다. deforestation의 라이브러리 차원 적용.

오개념 예방 1: "JS 컴파일러는 이런 최적화를 다 자동으로 해주나요?"는 부분적 — V8은 한정된 범위에서만 합니다. JS는 부수효과가 만연한 언어라 컴파일러가 함부로 재배열하지 못합니다. 위 4가지 최적화 중 dead code elimination(번들러)과 memoization(개발자가 명시적으로 적용) 정도가 흔하고, 자동 병렬화나 deforestation은 거의 없습니다. Haskell 같은 순수 함수형 언어에서야 이 모든 최적화가 자동으로 가능합니다.

오개념 예방 2: 4가지 성질이 동시에 다 작동하려면 **언어 전체가 부수효과를 금지**해야 합니다(마지막 항목의 "If the entire language does not allow side-effects"). JS·Python처럼 부수효과가 허용된 언어에서는 컴파일러가 안전하게 변환할 수 있는 범위가 제한됩니다. 그래서 우리가 코드를 의식적으로 순수하게 짤수록 React/번들러/V8이 더 많이 도와줄 수 있는 것.

이게 없으면 어떻게 되는가: 부수효과가 함수 곳곳에 박혀 있으면 컴파일러는 "이 호출을 제거하면 안 되는 외부 효과가 있을지" 알 수 없어 보수적으로 모든 호출을 남기고, 모든 순서를 보존하며, 어떤 병렬화도 시도하지 못합니다. 부수효과 제한은 우리에게 "테스트 용이성"을, 컴파일러에게는 "변환 자유도"를 한꺼번에 선물합니다.
