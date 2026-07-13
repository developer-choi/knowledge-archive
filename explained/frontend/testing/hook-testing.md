# renderHook이란 무엇이며, 내부에서는 어떻게 동작하는가?

## 도입

React 훅(`useState`, `useEffect`, 직접 만든 `useSomething` 등)은 규칙상 컴포넌트 함수나 다른 커스텀 훅의 몸통 안에서만 호출할 수 있다. 즉 훅을 그냥 함수처럼 `useLoggedInUser()`로 테스트 파일에서 부르면 React가 거부한다. `renderHook`은 이 제약을 우회하기 위해 존재하는 편의 도구다.

---

## 본문

> This is a convenience wrapper around `render` with a custom test component. The API emerged from a popular testing pattern and is mostly interesting for libraries publishing hooks.

"이것은 커스텀 테스트 컴포넌트를 사용하는 `render`를 감싼 편의 래퍼다. 이 API는 널리 쓰이던 테스트 패턴에서 나왔으며, 주로 훅을 배포하는 라이브러리에 유용하다."

- **convenience wrapper**: 이미 있는 것(`render`)을 감싸 손이 덜 가게 만든 껍데기. `renderHook`은 새로운 렌더링 엔진이 아니라 `render` 위에 얹힌 얇은 층이다.
- **custom test component**: 오직 테스트를 위해 즉석에서 만들어지는 임시 컴포넌트. 당신이 넘긴 콜백(훅을 부르는 함수)만 실행하는 껍데기 컴포넌트다.

여기서 흔히 오해하는 지점이 있다. `renderHook(() => useLoggedInUser())`를 보면 컴포넌트 없이 훅만 단독으로 돌아가는 것처럼 보인다. 하지만 React에서 훅은 컴포넌트 밖에서 실행될 수 없다. 그래서 `renderHook`은 내부적으로 "당신의 콜백만 호출하고 끝나는" 눈에 안 보이는 테스트용 컴포넌트를 자동 생성한 뒤, 그 컴포넌트를 `render`로 마운트한다. 컴포넌트가 사라진 게 아니라 추상화 뒤에 숨어 있을 뿐이다.

```
renderHook(() => useLoggedInUser())
        │
        ▼  내부에서 자동 생성
   ┌─────────────────────────────┐
   │ function TestComponent() {   │  ← 눈에 안 보이는 임시 컴포넌트
   │   result.current =           │
   │       useLoggedInUser();     │  ← 당신의 콜백을 여기서 호출
   │   return null;               │
   │ }                            │
   └─────────────────────────────┘
        │
        ▼
   render(<TestComponent />)         ← 결국 평범한 render
```

---

## 종합

`renderHook`을 "컴포넌트 없이 훅을 실행하는 마법"으로 이해하면 동작을 잘못 예측하게 된다. 실체는 훅 하나만 호출하는 껍데기 컴포넌트를 자동으로 만들어 `render`에 넘기는 것이다. 그래서 훅 안의 `useEffect`, 상태 커밋, 리렌더 같은 React 생명주기가 실제 컴포넌트에서와 똑같이 일어난다. 이 도구가 "훅을 배포하는 라이브러리에 주로 유용하다"고 한 이유는, 라이브러리가 파는 재사용 훅은 호스트 컴포넌트가 정해져 있지 않아서 임시 컴포넌트로 감싸 테스트하는 편이 자연스럽기 때문이다.

---

# renderHook()보다 render()를 우선적으로 사용해야하는 이유는 무엇인가?

## 본문

> You should prefer render since a custom test component results in more readable and robust tests since the thing you want to test is not hidden behind an abstraction.

"render를 우선해야 한다. 커스텀 테스트 컴포넌트를 쓰면 테스트가 더 읽기 쉽고 견고해지는데, 테스트하려는 대상이 추상화 뒤에 숨지 않기 때문이다."

- **abstraction**: 세부를 감싸 가리는 층. `renderHook`이 자동 생성하는 임시 컴포넌트가 바로 그 층이다.
- **robust**: 견고한. 사소한 구현 변화나 감춰진 동작 때문에 쉽게 깨지지 않는다는 뜻.

여기서 결론을 스스로 도출해 보면 사슬이 이렇게 이어진다.

```
renderHook이 훅을 임시 컴포넌트로 감싼다
        │
        ▼
테스트 대상(훅)이 그 추상화 뒤에 숨는다
        │
        ▼
읽는 사람이 "무엇이 렌더되고 무엇이 검증되는지" 한눈에 못 본다 → 가독성·견고성 저하
        │
        ▼
그러니 실제 컴포넌트를 직접 쓰는 render()를 우선한다
```

즉 `render`에서는 당신이 직접 쓴 진짜 컴포넌트가 그대로 보이므로 숨는 것이 없다. 반대로 `renderHook`은 자동 생성된 껍데기가 대상을 가린다.

이 권고에는 예외가 있다. 재사용 목적으로 배포되는 라이브러리 훅처럼, 그 훅을 담을 자연스러운 호스트 컴포넌트가 없을 때다. 이런 훅을 위해 굳이 껍데기 컴포넌트를 손으로 작성하면 그건 순전히 반복 코드(boilerplate)일 뿐이다. 이때는 `renderHook`이 그 반복을 대신 없애 준다.

---

# renderHook의 initialProps는 언제 적용되며, 리렌더 시 다른 props로 다시 실행하려면 무엇을 쓰는가?

## 도입

`renderHook`의 두 번째 인자인 옵션 객체에 `initialProps`를 넣으면, 첫 번째 인자인 콜백(`(props) => ...`)이 **처음 호출될 때** 받을 props를 정한다. 그렇다면 훅을 다시 실행할 때(리렌더할 때)도 이 초기값이 자동으로 다시 들어갈까? 이 부분은 글로만 읽으면 헷갈리기 쉬워 코드로 확인해야 정확히 잡힌다.

---

## 본문

> These will not be passed if you call `rerender` without props.

"인자 없이 `rerender`를 호출하면 이 값들은 전달되지 않는다."

- **rerender**: `renderHook`이 반환하는 함수로, 처음 넘긴 콜백을 그대로 다시 렌더한다. 인자를 주면(`rerender(newProps)`) 그 값이 콜백의 새 props가 된다.
- **without props**: 인자 없이. 즉 `rerender()`처럼 아무것도 안 넘기면 `initialProps`가 다시 들어가지 않는다.

핵심은 `initialProps`가 오직 최초 호출에만 적용된다는 것이다. 리렌더할 때 초기값을 자동으로 되먹이지 않는다.

```ts
const { result, rerender } = renderHook(
  (props = {}) => props,
  { initialProps: { name: 'Alice' } },
);

// 최초 렌더: initialProps 적용
result.current; // { name: 'Alice' }

// 인자 없이 리렌더 → initialProps 재전달 안 됨
rerender();
// 콜백이 props 없이 실행되어 기본값 {}로 폴백 → name은 undefined
result.current; // { name: undefined }
```

`rerender()`를 인자 없이 부르면 콜백은 props를 못 받고, 콜백의 매개변수 기본값(`props = {}`)으로 떨어진다. 그 결과 `{}`에는 `name`이 없으니 `name`은 `undefined`가 된다. 이후 렌더에 값을 주려면 반드시 `rerender(newProps)`처럼 직접 넘겨야 한다.

```
최초 renderHook(...)           →  props = { name: 'Alice' }   (initialProps 적용)
       │
       ▼
rerender()   (인자 없음)        →  props = {} (기본값 폴백)     name: undefined
       │
       ▼
rerender({ name: 'Bob' })       →  props = { name: 'Bob' }     (직접 전달)
```

---

## 종합

`initialProps`는 "최초 1회용 초기값"이지 "매 렌더의 기본 props"가 아니다. 리렌더 시에는 넘긴 인자만이 props가 되고, 아무것도 안 넘기면 콜백의 매개변수 기본값으로 떨어진다. 이 규칙을 놓치면 "분명 initialProps를 줬는데 리렌더 후 값이 사라졌다"는 혼란에 빠진다. 초기값과 이후 값을 서로 다른 경로(`initialProps` vs `rerender` 인자)로 공급한다고 기억하면 된다.

---

# renderHook이 반환하는 result는 왜 값을 직접 주지 않고 result.current를 거쳐 읽게 하며, 그 값에는 훅 반환값의 어느 시점 값이 담기는가?

## 도입

`renderHook`의 결과에서 값을 `result`가 아니라 `result.current`로 읽는 이유가 있다. 이 모양은 React의 `useRef`가 만드는 참조 객체와 똑같다 — `ref.current`로 최신 값을 읽는 그 구조다. 왜 굳이 참조 모양을 빌렸는지, 그리고 `.current`에 담기는 값이 어느 시점의 것인지가 이 질문의 핵심이다.

---

## 본문

> Holds the value of the most recently committed return value of the render-callback.

"render-callback의 가장 최근에 커밋된 반환값을 담는다."

- **most recently committed**: 가장 최근에 커밋된. React가 렌더를 화면에 반영(커밋)하고 그에 딸린 effect까지 실행한 뒤의 값을 뜻한다. 첫 렌더의 값이 아니라 최신 값이다.

> Note that the value is held in `result.current`. Think of result as a ref for the most recently committed value.

"값은 `result.current`에 담긴다. result를 가장 최근 커밋된 값을 가리키는 ref라고 생각하라."

- **ref**: `useRef`가 반환하는 것과 같은 참조 상자. `.current`가 항상 최신 값을 가리키도록 갱신된다.

만약 `result`가 참조가 아니라 평범한 값이었다면, 첫 렌더 순간의 값에 얼어붙어 이후 변화를 반영하지 못한다. 참조 모양이기에 리렌더가 일어날 때마다 `.current`가 최신 커밋 값으로 갱신되어, 테스트 코드는 항상 `result.current`를 읽기만 하면 최신 상태를 본다.

```ts
const { result } = renderHook(() => {
  const [name, setName] = useState('');
  useEffect(() => {
    setName('Alice');
  }, []);
  return name;
});

result.current; // 'Alice'  (초기값 '' 이 아니다)
```

여기서 훅은 `useState('')`로 빈 문자열에서 시작하지만, `useEffect`가 커밋 직후 `setName('Alice')`를 실행한다. `result.current`가 담는 것은 "가장 최근에 커밋된" 값이므로, effect가 돌고 난 뒤의 `'Alice'`가 담긴다. 첫 렌더의 `''`이 아니다.

```
useState('')  ──►  첫 렌더 반환값 ''        (아직 커밋 전 단계)
        │
        ▼  커밋 후 useEffect 실행 → setName('Alice') → 리렌더
result.current  ──►  'Alice'                (가장 최근 커밋된 값)
```

---

## 종합

`.current`를 거치게 한 것은 우연이 아니라 `useRef`의 참조 시맨틱을 그대로 빌린 설계다. 값이 렌더마다 바뀌는 훅을 다루려면 "최신 값을 가리키는 상자"가 필요하고, 그래서 `result`는 ref처럼 동작한다. 담기는 값은 "가장 최근 커밋된" 반환값 — effect까지 실행된 뒤의 상태 — 라서, 초기 렌더값과 다를 수 있다. 이 점을 알면 `useEffect`로 값을 세팅하는 훅을 테스트할 때 왜 초기값이 아닌 반영 후 값이 나오는지 자연스럽게 이해된다.