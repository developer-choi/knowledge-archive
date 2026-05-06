# 순수 함수(pure function)는 어떤 두 조건을 만족해야 하는가?

> When a pure function is called with some given arguments, it will always return the same result, and cannot be affected by any mutable state or other side effects.

---

**도입**

"함수란 인풋을 넣으면 아웃풋이 나오는 것"이라는 직관은 사실 일반 함수가 아니라 **순수 함수**의 정의에 가깝습니다. 일반 함수는 파일 IO, 네트워크 호출, 전역 상태 변경 같은 부수효과를 가질 수 있습니다. FP가 강조하는 "값을 다른 값으로 매핑한다"는 그림은 정확히 순수 함수의 그림이고, 이 문서는 그 두 조건을 한 문장에서 추출합니다.

---

**본문**

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

**종합**

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
