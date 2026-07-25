# React가 렌더를 순수하게 유지하라고 요구하는 이유는 무엇인가?

## 도입

React에서 "렌더"는 컴포넌트 함수를 호출해 다음 화면이 어떤 모습이어야 하는지를 계산하는 단계다. 여기서 중요한 전제 하나가 깔린다 — 그 함수가 **몇 번 호출될지 개발자는 알 수 없다**. 한 번의 화면 갱신에 한 번만 불릴 것 같지만, React는 필요하면 같은 컴포넌트를 여러 번 부른다.

순수성 규칙은 이 전제 위에 서 있다. 여러 번 불려도 결과가 같고 바깥에 흔적이 남지 않아야, React가 렌더를 마음대로 다룰 수 있기 때문이다.

---

## 본문

> When render is kept pure, React can understand how to prioritize which updates are most important for the user to see first.

렌더가 순수하게 유지되면, React는 사용자에게 먼저 보여줄 갱신이 무엇인지 우선순위를 매길 수 있다.

- **prioritize**: 여러 갱신이 동시에 밀려들 때 무엇을 먼저 처리할지 순서를 정하는 것. 예를 들어 사용자가 검색창에 타이핑하는 중이라면, 입력 글자를 반영하는 갱신이 아래쪽 무거운 결과 목록을 다시 그리는 갱신보다 급하다
- **most important for the user to see first**: 중요도의 기준이 "코드 순서"가 아니라 "사용자 체감"이라는 점

> This is made possible because of render purity: since components don't have side effects in render, React can pause rendering components that aren't as important to update, and only come back to them later when it's needed.

이것이 가능한 이유가 렌더 순수성이다 — 컴포넌트가 렌더 중에 부수효과를 일으키지 않으니, React는 덜 중요한 컴포넌트의 렌더를 도중에 멈췄다가 나중에 필요할 때 다시 돌아올 수 있다.

- **pause**: 렌더를 중간에 중단하는 것. 만약 그 컴포넌트가 렌더 도중에 서버로 요청을 보냈거나 전역 변수를 바꿔 놓았다면, 중단해도 그 흔적은 이미 남아 있어 되돌릴 수 없다
- **come back to them later**: 중단한 작업을 나중에 다시 실행하는 것. 순수하니까 다시 돌려도 같은 결과가 나오고, 그래서 "버렸다 다시 하기"가 안전하다

렌더가 순수할 때 React가 얻는 자유를 그림으로 두면 이렇다.

```
순수한 렌더
  A 렌더 시작 ──┐
               ├─→ (급한 갱신 도착) A 중단 → B 렌더 → 완료 → A 처음부터 다시
               └─→ 버려진 A의 계산 결과: 아무 흔적 없음 ✅

순수하지 않은 렌더
  A 렌더 시작 ──┐  (렌더 중 전역 count += 1)
               ├─→ A 중단 → B 렌더 → A 다시 실행 (전역 count += 1 또!)
               └─→ 버려졌어야 할 계산의 흔적이 남음 ❌ count가 2가 됨
```

> Concretely, this means that rendering logic can be run multiple times in a way that allows React to give your user a pleasant user experience.

구체적으로 말하면, 렌더링 로직이 여러 번 실행될 수 있고 그렇게 함으로써 React가 쾌적한 사용자 경험을 줄 수 있다는 뜻이다.

- **rendering logic**: 컴포넌트 함수 본체에서 JSX를 반환하기까지 실행되는 모든 코드
- **run multiple times**: 이 페이지의 모든 금지 조항이 여기서 나온다. "여러 번 실행될 수 있다"를 받아들이면 나머지 규칙은 전부 그 따름정리다

> However, if your component has an untracked side effect – like modifying the value of a global variable during render – when React runs your rendering code again, your side effects will be triggered in a way that won't match what you want.

그러나 컴포넌트에 추적되지 않는 부수효과가 있다면 — 렌더 중에 전역 변수 값을 수정하는 것 같은 — React가 렌더 코드를 다시 실행할 때 그 부수효과는 의도와 맞지 않는 방식으로 발동한다.

- **untracked**: React가 알지 못하는. React는 자기가 관리하는 state·context의 변화는 추적하지만, 개발자가 렌더 중에 몰래 바꾼 전역 변수는 모른다
- **won't match what you want**: 개발자는 "한 번 일어날 것"으로 짐작하고 코드를 썼는데 실제로는 렌더 횟수만큼 일어나 어긋난다는 뜻

---

## 종합

순수성은 React가 개발자에게 요구하는 예의범절 같은 것이 아니라, React 자신이 렌더를 다룰 자유를 얻기 위한 계약이다. 렌더 결과를 버리고 다시 계산해도 아무 손해가 없어야 React가 "이건 급하니 먼저, 저건 나중에"를 결정할 수 있다.

계약의 대가로 개발자가 포기하는 것은 "내 컴포넌트 함수는 한 번만 호출된다"는 가정이다. 이 가정을 버리는 순간 나머지 규칙들이 자연스럽게 따라온다 — 두 번 불려도 같은 결과여야 하고(멱등성), 두 번 불려도 바깥 세상에 두 번 흔적이 남으면 안 된다(부수효과 금지).

실무에서 이 규칙을 어긴 코드는 대개 조용히 잘못된다. 개발 환경에서는 멀쩡하다가 특정 상호작용이 겹칠 때만 값이 두 배로 뛰거나 목록이 중복되는 식이라, 버그를 만난 시점과 원인을 심은 시점이 멀리 떨어져 있다.

---

# 컴포넌트가 멱등(idempotent)하다는 것은 무엇을 뜻하는가?

## 도입

수학이나 HTTP에서도 쓰는 말이지만, React 문맥에서는 뜻이 단순하다 — 같은 입력이면 언제나 같은 출력. 관건은 "입력"이 무엇이냐다. 컴포넌트 함수를 보면 인자는 props 하나뿐이라 그것만 입력처럼 보이지만, React가 정의하는 입력 집합은 그보다 넓다.

---

## 본문

> Idempotent – You always get the same result every time you run it with the same inputs – props, state, context for component inputs; and arguments for hook inputs.

멱등 — 같은 입력으로 실행하면 언제나 같은 결과를 얻는다. 컴포넌트의 입력은 props·state·context이고, 훅의 입력은 인자다.

- **Idempotent**: 여러 번 해도 한 번 한 것과 결과가 같은 성질
- **inputs**: 여기가 핵심이다. 함수 시그니처상 인자는 props뿐이지만, `useState`로 읽는 state와 `useContext`로 읽는 context도 "밖에서 들어온 값"이므로 입력으로 친다

컴포넌트의 입력 세 갈래를 정리하면 이렇다.

```
컴포넌트 함수
├── props    ← 부모가 넘긴 값        (인자로 들어옴)
├── state    ← useState가 돌려준 값  (React가 보관하다 넘겨줌)
└── context  ← useContext가 읽은 값  (상위 Provider가 넘김)
     ↓
   출력 = JSX
```

> Components must always return the same output with respect to their inputs – props, state, and context.

컴포넌트는 자신의 입력에 대해 언제나 같은 출력을 반환해야 한다.

- **with respect to**: "~에 관하여, ~에 대응하여" — 출력이 오직 그 입력들에만 달려 있어야 한다는 뜻. 세 입력이 그대로인데 출력이 달라지면 그 차이는 어디선가 몰래 새어 들어온 것이다

> This is known as idempotency.

이것을 멱등성이라고 부른다.

> This means that all code that runs during render must also be idempotent in order for this rule to hold.

이 규칙이 성립하려면 렌더 중에 실행되는 모든 코드 역시 멱등해야 한다는 뜻이다.

- **all code that runs during render**: 컴포넌트 함수 본체뿐 아니라 그 안에서 호출하는 유틸 함수, 커스텀 훅, 그 훅이 다시 부르는 함수까지 전부. 규칙이 호출 사슬을 따라 아래로 전파된다
- **in order for this rule to hold**: 규칙이 유효하려면. 한 군데라도 멱등하지 않으면 그 컴포넌트 전체가 멱등하지 않게 된다

---

## 종합

멱등성은 "함수를 두 번 불러도 같은 답"이라는 단순한 성질이지만, React에 적용할 때 두 군데서 걸린다.

첫째는 입력의 범위다. props만 입력으로 생각하면, state나 context를 읽는 코드는 규칙 밖이라 착각하게 된다. 실제로는 셋 다 입력이고, 셋이 그대로면 결과도 그대로여야 한다.

둘째는 적용 범위다. 컴포넌트 함수 안에서 부르는 모든 것이 대상이다. 컴포넌트 본체는 깔끔한데 그 안에서 부른 유틸 함수가 매번 다른 값을 돌려준다면, 컴포넌트도 함께 멱등성을 잃는다. 규칙은 "내가 쓴 코드"가 아니라 "렌더 중에 실행되는 코드"에 걸린다는 점이 요점이다.

---

# 렌더 중에 매번 다른 값을 돌려주는 함수를 호출하면 화면에서 어떤 증상이 나타나는가?

## 도입

멱등성을 깨는 가장 흔한 두 함수가 `new Date()`와 `Math.random()`이다. 둘 다 인자 없이 부르고 매번 다른 값을 돌려준다. 규칙 위반이라는 판정보다 중요한 것은, 위반했을 때 화면에 실제로 무엇이 보이느냐다 — 에러가 나면 오히려 찾기 쉽지만 이 위반은 조용하기 때문이다.

---

## 본문

> ```js
> function Clock() {
>   const time = new Date(); // 🔴 Bad: always returns a different result!
>   return <span>{time.toLocaleString()}</span>
> }
> ```

시계를 만들려고 렌더 중에 현재 시각을 읽는 코드다. 얼핏 자연스러워 보이는데, 주석이 지적하듯 매번 다른 결과를 돌려주는 호출이 렌더 안에 들어와 있다.

> `new Date()` is not idempotent as it always returns the current date and changes its result every time it's called.

`new Date()`는 항상 현재 시각을 반환하며 호출할 때마다 결과가 바뀌므로 멱등하지 않다.

- **not idempotent**: 같은 조건에서 불러도 답이 달라진다는 것. 입력이 아예 없으니 "같은 입력이면 같은 출력"을 만족시킬 방법이 없다

> When you render the above component, the time displayed on the screen will stay stuck on the time that the component was rendered.

위 컴포넌트를 렌더하면, 화면에 표시된 시각은 그 컴포넌트가 렌더된 시점에 멈춰 있게 된다.

- **stay stuck on**: 그 값에 붙박여 움직이지 않는다

여기가 헷갈리기 쉬운 지점이다. "매번 다른 값을 돌려주는 함수를 썼으니 화면 값이 마구 튈 것"이라고 예상하기 쉬운데, 실제 증상은 정반대인 **멈춤**이다. 이유는 리렌더가 언제 일어나는지에 있다. React는 state가 바뀌거나 부모가 다시 렌더될 때 컴포넌트를 다시 부르는데, 이 `Clock`에는 state가 없다. 시간이 흘러도 React 입장에서는 다시 부를 이유가 없으니, 첫 렌더 때 읽은 시각이 그대로 화면에 남는다.

```
잘못된 기대                    실제
────────────────────           ────────────────────
시간이 흐름                     시간이 흐름
  ↓                              ↓
값이 계속 바뀜?                 리렌더 트리거 없음
  ↓                              ↓
화면이 갱신됨?                  화면 그대로 멈춤 ⏸
```

> Similarly, functions like `Math.random()` also aren't idempotent, because they return different results every time they're called, even when the inputs are the same.

마찬가지로 `Math.random()` 같은 함수도 멱등하지 않다 — 입력이 같아도 호출할 때마다 다른 결과를 반환하기 때문이다.

- **even when the inputs are the same**: 입력이 같은데도 결과가 다르다는 것이 멱등성 위반의 정의 그대로다

---

## 종합

`new Date()`나 `Math.random()`을 렌더 중에 부르면 두 가지가 어긋난다. 하나는 규칙 차원의 문제 — 같은 입력에 다른 출력이 나오니 React가 렌더를 다시 돌렸을 때 결과가 흔들린다. 다른 하나는 눈에 보이는 증상 — 값을 갱신할 트리거가 없어 첫 렌더의 값이 화면에 굳는다.

특히 두 번째가 실무에서 사람을 헷갈리게 한다. 코드만 보면 "현재 시각을 읽으니 항상 최신"일 것 같아서, 시계가 멈춰 있으면 시각을 읽는 코드가 아니라 다른 데서 원인을 찾게 된다. 렌더는 "지금 상태로 화면을 계산하는 일"일 뿐 시간이 흐른다고 저절로 다시 도는 것이 아니라는 점을 기억하면, 증상에서 원인으로 바로 이어진다.

---

# 매번 달라지는 값이 필요하면 그런 함수는 컴포넌트에서 아예 쓸 수 없는가?

## 도입

앞의 규칙을 "`new Date()`는 React에서 금지"로 읽으면 시계도 타이머도 만들 수 없게 된다. 공식 문서는 그 오해를 직접 막는다 — 금지된 것은 함수가 아니라 그 함수를 부르는 **위치**다.

---

## 본문

> This doesn't mean you shouldn't use non-idempotent functions like `new Date()` at all – you should just avoid using them during render.

이것이 `new Date()` 같은 비멱등 함수를 아예 쓰지 말라는 뜻은 아니다 — 렌더 중에 쓰는 것만 피하면 된다.

- **at all**: 아예, 전혀. 전면 금지가 아님을 못박는 단어
- **during render**: 금지선이 그어진 자리. 같은 `new Date()`라도 렌더 중이면 위반, 이벤트 핸들러나 Effect 안이면 정상이다

> In this case, we can synchronize the latest date to this component using an Effect:

이 경우 Effect를 사용해 최신 시각을 컴포넌트에 동기화할 수 있다.

- **synchronize**: 바깥 세계(여기서는 흘러가는 시간)의 변화를 컴포넌트 state에 계속 맞춰 주는 것

> ```js
> import { useState, useEffect } from 'react';
>
> function useTime() {
>   // 1. Keep track of the current date's state. `useState` receives an initializer function as its
>   //    initial state. It only runs once when the hook is called, so only the current date at the
>   //    time the hook is called is set first.
>   const [time, setTime] = useState(() => new Date());
>
>   useEffect(() => {
>     // 2. Update the current date every second using `setInterval`.
>     const id = setInterval(() => {
>       setTime(new Date()); // ✅ Good: non-idempotent code no longer runs in render
>     }, 1000);
>     // 3. Return a cleanup function so we don't leak the `setInterval` timer.
>     return () => clearInterval(id);
>   }, []);
>
>   return time;
> }
>
> export default function Clock() {
>   const time = useTime();
>   return <span>{time.toLocaleString()}</span>;
> }
> ```

세 조각으로 나눠 보면 이렇다.

**첫째, 초기값.** `useState(() => new Date())`는 값이 아니라 함수를 넘긴다. `useState(new Date())`라고 쓰면 렌더될 때마다 `new Date()`가 실행된다 — 결과는 버려지지만 호출 자체는 렌더 중에 일어나므로 규칙 위반이다. 함수를 넘기면 React가 첫 렌더 때 한 번만 그 함수를 부른다.

**둘째, 갱신.** 시각이 흐르는 것을 화면에 반영하는 일은 `useEffect` 안의 `setInterval`이 맡는다. 여기서 `new Date()`가 1초마다 불리지만, 이 코드가 도는 시점은 렌더가 끝난 뒤다. 그리고 `setTime`이 state를 바꾸므로 리렌더가 예약된다 — 앞 질문에서 시계가 멈췄던 이유(리렌더 트리거 없음)가 여기서 해결된다.

**셋째, 정리.** 반환한 함수가 `clearInterval`을 부른다. 이게 없으면 컴포넌트가 화면에서 사라진 뒤에도 타이머가 계속 돌면서 이미 없는 컴포넌트의 state를 갱신하려 든다.

> By wrapping the non-idempotent `new Date()` call in an Effect, it moves that calculation outside of rendering.

비멱등인 `new Date()` 호출을 Effect로 감싸면 그 계산이 렌더 바깥으로 옮겨진다.

- **wrapping ... in**: 감싸는 것. Effect 안에 넣는다는 것은 곧 "렌더가 끝난 뒤에 실행하라"는 지정이다
- **moves that calculation outside of rendering**: 계산을 없앤 것이 아니라 실행 시점을 옮긴 것. 규칙 준수의 방법이 늘 "삭제"가 아니라 "이동"이라는 점

> If you don't need to synchronize some external state with React, you can also consider using an event handler if it only needs to be updated in response to a user interaction.

바깥 상태를 React와 동기화할 필요가 없고 사용자 조작에 반응해 갱신되기만 하면 된다면, 이벤트 핸들러를 쓰는 것도 고려할 수 있다.

- **external state**: React 밖에 있는, React가 관리하지 않는 상태 (흘러가는 시간, 브라우저 창 크기, 서버 데이터 등)
- **in response to a user interaction**: 사용자가 뭔가를 했을 때만. 예를 들어 버튼을 눌러 난수를 뽑는 기능이면 계속 동기화할 것이 없으니 클릭 핸들러 안에서 `Math.random()`을 부르면 된다

---

## 종합

규칙은 "이 함수를 쓰지 마라"가 아니라 "이 자리에서 부르지 마라"다. 그래서 대응도 함수를 바꾸는 것이 아니라 호출 위치를 옮기는 것이 된다.

옮길 자리는 두 곳이고, 고르는 기준은 "계속 맞춰야 하는가"다. 시각처럼 사용자가 아무것도 안 해도 계속 흘러가는 값이면 Effect로 동기화한다. 버튼을 눌렀을 때만 새 값이 필요하면 이벤트 핸들러에서 부른다. 후자가 훨씬 단순하므로 먼저 검토할 쪽이다.

`useState`에 함수를 넘기는 형태도 함께 기억해 둘 만하다. 초기값 계산이 무겁거나 비멱등이면 값이 아니라 함수를 넘겨야 첫 렌더에서만 실행된다.

---

# React의 Strict Mode는 왜 있는가?

## 도입

개발 중에 `console.log`를 컴포넌트 본문에 넣었더니 로그가 두 번씩 찍히는 경험을 하게 된다. Strict Mode가 컴포넌트 함수를 일부러 두 번 호출해 순수하지 않은 코드를 드러내는 개발 전용 검사이기 때문이다.

왜 하필 "두 번 호출"이 검사 방법이 되는지는, React가 렌더에 요구하는 두 가지 조건을 보면 이해된다.

---

## 본문

> Rendering must always be a pure calculation:
>
> - Same inputs, same output. Given the same inputs, a component should always return the same JSX.
> - It minds its own business. It should not change any objects or variables that existed before rendering.

"렌더링은 언제나 순수한 계산이어야 한다. 같은 입력이면 같은 출력. 같은 입력이 주어지면 컴포넌트는 항상 같은 JSX를 반환해야 한다. 그리고 자기 일에만 신경 쓴다. 렌더 이전부터 존재하던 객체나 변수를 바꾸어서는 안 된다."

- **pure calculation**: 순수한 계산. 같은 입력에 항상 같은 결과를 내고, 바깥 세상에 아무 흔적도 남기지 않는 계산을 말한다. 아래 두 항목이 이 "순수"의 정의를 풀어 쓴 것이다.
- **Same inputs, same output**: 입력은 prop, state, context다. 이 셋이 같으면 반환되는 JSX도 같아야 한다. `Math.random()`이나 `new Date()`를 렌더 중에 쓰면 입력이 같아도 결과가 달라지므로 이 조건을 깬다.
- **It minds its own business**: 자기 일에만 신경 쓴다는 말은, 렌더가 자기 반환값 만들기 외의 부수적인 일을 하지 말라는 뜻이다.
- **objects or variables that existed before rendering**: 이번 렌더가 시작되기 전부터 있던 것들, 그러니까 모듈 최상단 변수, prop으로 받은 객체·배열, 바깥 스코프의 상태 등이다. 이번 렌더 안에서 새로 만든 지역 변수·배열을 채우는 것은 여기 해당하지 않으므로 얼마든지 해도 된다.

```jsx
let guestCount = 0; // 렌더 전부터 존재하던 변수

function Guest() {
  guestCount = guestCount + 1;      // ← 순수하지 않다. 호출할 때마다 결과가 달라진다
  return <h2>Guest #{guestCount}</h2>;
}

function GuestPure({ index }) {
  const count = index + 1;          // ← 이번 렌더 안에서 만든 지역 변수: 문제없다
  return <h2>Guest #{count}</h2>;
}
```

> When developing in “Strict Mode”, React calls each component’s function twice, which can help surface mistakes caused by impure functions.

"'Strict Mode'로 개발할 때 React는 각 컴포넌트의 함수를 두 번 호출하며, 이는 순수하지 않은 함수로 인한 실수를 드러내는 데 도움이 된다."

- **When developing**: 개발 중에만. 프로덕션 빌드에서는 두 번 호출하지 않으므로 배포된 앱의 성능에는 영향이 없다.
- **calls each component’s function twice**: 컴포넌트 함수를 두 번 호출한다. 렌더 결과가 화면에 두 번 반영되는 게 아니라, 같은 계산을 두 번 시켜보는 것이다. 콘솔 로그가 두 번 찍히는 이유가 정확히 이것이다.
- **surface**: 표면으로 끌어올린다. 숨어 있던 문제를 눈에 보이게 만든다는 뜻이다. Strict Mode는 문제를 고쳐주지 않고 드러내기만 한다.
- **impure functions**: 위 두 조건 중 하나라도 어긴 컴포넌트.

두 번 호출이 왜 검사가 되는지는 위 두 조건과 정확히 맞물린다.

```
순수한 컴포넌트  → 같은 입력으로 두 번 호출해도 결과가 같음 → 아무 일도 안 일어남
순수하지 않은 것 → 두 번째 호출에서 결과가 달라지거나
                   바깥 변수가 두 번 오염됨 → 화면에 이상한 값이 드러남
```

위 `Guest` 예시를 Strict Mode에서 렌더하면 `guestCount`가 한 번이 아니라 두 번 올라가 번호가 건너뛴다. 두 번 호출하지 않았다면 이 코드는 겉으로 멀쩡해 보였을 것이고, 나중에 React가 렌더 결과를 버리거나 다시 계산하는 상황에서야 원인 모를 버그로 터졌을 것이다.

---

## 종합

React는 렌더를 순수한 계산으로 취급한다. 같은 입력에 같은 JSX를 반환하고, 렌더 전부터 있던 것을 건드리지 않는다는 두 조건이 그 내용이다. React가 이 전제 위에서 렌더 결과를 버리거나 다시 계산하거나 순서를 조정할 수 있기 때문에, 전제가 깨지면 겉보기엔 멀쩡하다가 예측 불가능한 시점에 어긋난 화면이 나온다.

Strict Mode의 두 번 호출은 이 전제를 개발 중에 검사하는 장치다. 순수한 컴포넌트는 두 번 호출해도 결과가 같아 아무 차이가 없고, 순수하지 않은 컴포넌트만 값이 어긋나며 정체를 드러낸다. 그래서 콘솔 로그가 두 번 찍히는 것은 고쳐야 할 버그가 아니라 검사가 돌고 있다는 표시다.

로그가 두 번 찍히는 게 거슬린다고 Strict Mode를 끄는 것은 검사를 끄는 것이지 문제를 없애는 게 아니다. 반대로, 두 번 호출했을 때 화면 값이 어긋난다면 그건 Strict Mode의 문제가 아니라 그 컴포넌트가 순수하지 않다는 신호다.

---

# 부수효과는 어디에 작성해야 하는가?

## 도입

React 문서를 읽다 보면 side effect와 Effect가 섞여 나와 같은 말처럼 보인다. 실제로는 포함 관계이고, 이 구분이 잡히지 않으면 "부수효과는 렌더 밖에서"라는 규칙을 "부수효과는 `useEffect`에서"로 잘못 읽게 된다.

---

## 본문

먼저 두 단어를 갈라 두자. 공식 문서는 이렇게 정의한다.

> Side effects are a broader term than Effects. Effects specifically refer to code that's wrapped in `useEffect`, while a side effect is a general term for code that has any observable effect other than its primary result of returning a value to the caller.

side effect는 Effect보다 넓은 용어다. Effect는 구체적으로 `useEffect`로 감싼 코드를 가리키고, side effect는 호출자에게 값을 반환한다는 본래 결과 외에 관찰 가능한 영향이 있는 코드 전반을 뜻한다.

- **broader term**: 더 넓은 말. 포함하는 쪽
- **observable effect**: 바깥에서 알아챌 수 있는 영향. 화면이 바뀌거나, 서버에 요청이 가거나, 전역 변수가 달라지거나
- **primary result**: 함수의 본래 결과, 즉 반환값. 반환값 말고 남는 것이 있으면 그게 부수효과다

```
side effect (부수효과)  ← 값 반환 말고 바깥에 영향을 남기는 모든 코드
├── 이벤트 핸들러 안의 요청·저장·기록
├── Effect  ← useEffect로 감싼 것만 이 이름으로 부름
└── (렌더 중의 전역 변수 수정 ← 규칙 위반)
```

대문자로 시작하는 Effect는 `useEffect`라는 특정 도구를 가리키는 고유명사에 가깝고, 소문자 side effect는 성질을 가리키는 일반명사다. 그래서 "부수효과를 어디에 두는가"라는 물음의 답에 `useEffect`가 유일한 선택지로 나오지 않는다.

> Side effects should not run in render, as React can render components multiple times to create the best possible user experience.

부수효과는 렌더 중에 실행되면 안 된다 — React가 최선의 사용자 경험을 만들기 위해 컴포넌트를 여러 번 렌더할 수 있기 때문이다.

- **as**: 여기서는 이유를 잇는 접속사("~때문에")

> Side effects are typically written inside of event handlers or Effects.

부수효과는 보통 이벤트 핸들러나 Effect 안에 작성한다.

- **typically**: 통상적으로. 두 자리가 정해진 보관 장소다

> But never during render.

하지만 렌더 중에는 결코 안 된다.

- **never**: 예외 없음을 못박는 단어

> While render must be kept pure, side effects are necessary at some point in order for your app to do anything interesting, like showing something on the screen!

렌더는 순수하게 유지되어야 하지만, 앱이 화면에 무언가를 보여주는 등 의미 있는 일을 하려면 어느 시점엔가 부수효과가 반드시 필요하다.

- **at some point**: 어느 시점엔가. 없애는 문제가 아니라 시점을 고르는 문제라는 뉘앙스
- **necessary**: 필수적인. 순수성 규칙이 부수효과를 적대시하는 것이 아님을 공식 문서가 스스로 밝히는 대목

> In most cases, you'll use event handlers to handle side effects.

대부분의 경우 부수효과는 이벤트 핸들러에서 처리하게 된다.

- **In most cases**: 두 자리 중 기본값이 어느 쪽인지 알려주는 표현

> Using an event handler explicitly tells React that this code doesn't need to run during render, keeping render pure.

이벤트 핸들러를 쓰면 이 코드가 렌더 중에 돌 필요가 없다는 것을 React에 명시적으로 알리게 되어 렌더가 순수하게 유지된다.

- **explicitly tells React**: 별도 선언 없이 코드의 위치 자체가 신호가 된다는 뜻. 핸들러 안에 둔다는 것은 "사용자가 이걸 했을 때만 실행하라"는 선언이다

```js
function SaveButton({ draft }) {
  // 렌더 자리 — 계산만
  const label = draft.title || '제목 없음';

  // 부수효과 자리 — 사용자가 눌렀을 때만 실행
  function handleClick() {
    fetch('/api/save', { method: 'POST', body: JSON.stringify(draft) });
  }

  return <button onClick={handleClick}>{label} 저장</button>;
}
```

그러면 `useEffect`는 어디에 서는가. 공식 문서는 두 자리를 대등하게 놓지 않고 순위를 매긴다.

> If you've exhausted all options – and only as a last resort – you can also handle side effects using `useEffect`.

모든 선택지를 다 써 보았다면, 그리고 오직 최후의 수단으로만, `useEffect`로 부수효과를 처리할 수도 있다.

- **exhausted all options**: 선택지를 소진했다. 다른 방법을 먼저 시도해 보라는 전제가 깔려 있다
- **only as a last resort**: 오직 최후의 수단으로만. `also`(~할 수도 있다)와 함께 읽으면 허용이지 권장이 아니다

읽는 순서를 뒤집지 않는 것이 중요하다. "부수효과는 이벤트 핸들러나 Effect 안에 쓴다"만 보면 두 자리가 나란한 선택지처럼 보이지만, 같은 문단이 하나는 대부분의 경우(`In most cases`)로, 다른 하나는 최후의 수단(`last resort`)으로 표시해 두었다. 그래서 "부수효과가 필요하다"에서 곧장 `useEffect`로 가는 습관은 이 문서 기준으로는 순서를 건너뛴 것이다.

여기서 말하는 "다른 선택지"가 무엇인지는 이 페이지가 열거하지 않는다. 다만 이 문단 안에서 이미 하나가 제시되어 있다. 사용자 조작에 반응해 일어나는 일이면 이벤트 핸들러가 그 자리이고, 그것으로 되는 일을 Effect로 옮기면 렌더가 끝난 뒤 한 번 더 도는 경로를 스스로 만드는 셈이 된다.

---

## 종합

부수효과는 없애는 대상이 아니라 자리를 정해 주는 대상이다. 앱이 서버와 통신하고 화면을 바꾸는 일을 전부 하지 않는다면 남는 것이 없으므로, 규칙의 요점은 "하지 마라"가 아니라 "렌더 중에는 하지 마라"다.

허용된 자리는 이벤트 핸들러와 Effect 두 곳이고, 기본값은 이벤트 핸들러다. 사용자가 무언가를 했을 때 일어나야 하는 일이면 핸들러가 자연스러운 자리이며, 그 위치 자체가 React에게 "이 코드는 렌더와 무관하다"는 신호가 된다.

두 자리는 대등하지 않다. 문서는 이벤트 핸들러를 대부분의 경우로, `useEffect`를 최후의 수단으로 표시한다. 따라서 `useEffect`는 부수효과의 기본 수단이 아니라, 다른 방법이 없을 때 열리는 마지막 칸이다.

용어를 갈라 두는 것이 실전에서 도움이 된다. side effect는 성질을 가리키는 넓은 말이고 Effect는 `useEffect`라는 도구를 가리키는 좁은 말이다. 이 둘을 같은 것으로 읽으면 "부수효과가 필요하다 → `useEffect`를 쓴다"로 곧장 건너뛰게 되는데, 실제로 React가 권하는 순서는 그 반대에 가깝다.

---

# props와 state를 직접 수정하면 안 되는 이유는 무엇인가?

## 도입

자바스크립트에서 객체는 참조로 넘어간다. 부모가 넘긴 props 객체는 사본이 아니라 원본을 가리키는 손잡이라서, 자식에서 그 안의 값을 고치면 부모 쪽 객체도 같이 바뀐다. React는 이 점을 알고도 props를 "고치지 말 것"으로 규정하는데, 이유는 단순한 예의가 아니라 화면 갱신 방식과 얽혀 있다.

---

## 본문

> A component's props and state are immutable snapshots.

컴포넌트의 props와 state는 변경 불가능한 스냅샷이다.

- **immutable**: 변경 불가능한. 문법적으로 막혀 있다는 뜻이 아니라 "바꾸면 안 되는 것으로 취급하라"는 규약이다
- **snapshots**: 특정 시점을 찍어 고정한 사진. 한 번의 렌더 안에서 그 값들은 사진처럼 고정돼 있고, 다음 렌더 때 새 사진이 찍힌다

> Never mutate them directly.

절대 직접 변경하지 마라.

> Instead, pass new props down, and use the setter function from `useState`.

대신 새 props를 아래로 내려보내고, `useState`가 준 setter 함수를 써라.

- **pass ... down**: 부모에서 자식으로 내려보내는 것. props를 바꾸고 싶으면 자식이 고치는 게 아니라 부모가 다른 값을 내려보내야 한다
- **setter function**: `useState`가 배열의 두 번째로 돌려주는 함수

> Props are immutable because if you mutate them, the application will produce inconsistent output, which can be hard to debug as it may or may not work depending on the circumstances.

props가 불변인 이유는, 변경하면 애플리케이션이 일관되지 않은 출력을 내고, 상황에 따라 되기도 하고 안 되기도 해서 디버깅이 어렵기 때문이다.

- **inconsistent output**: 같은 조건인데 결과가 들쭉날쭉한 상태
- **may or may not work depending on the circumstances**: 상황에 따라 되기도 하고 안 되기도 함. 버그 중 가장 잡기 어려운 종류다. 렌더 순서나 리렌더 횟수처럼 개발자가 통제하지 않는 조건에 결과가 달려 버리기 때문이다

> ```js
> function Post({ item }) {
>   item.url = new Url(item.url, base); // 🔴 Bad: never mutate props directly
>   return <Link url={item.url}>{item.title}</Link>;
> }
> ```

받은 `item` 객체의 필드를 그 자리에서 덮어쓰고 있다. 이 컴포넌트가 두 번 렌더되면 `new Url`이 이미 변환된 값 위에 또 적용된다 — 같은 입력으로 두 번 실행했는데 결과가 다른, 멱등성 위반의 전형이다.

> ```js
> function Post({ item }) {
>   const url = new Url(item.url, base); // ✅ Good: make a copy instead
>   return <Link url={url}>{item.title}</Link>;
> }
> ```

원본을 건드리지 않고 지역 변수에 결과를 담았다. 몇 번 렌더하든 `item.url`은 그대로이므로 결과가 흔들리지 않는다. 앞서 나온 "지역에서 만든 값은 마음대로 다뤄도 된다"가 여기 적용된 모습이기도 하다.

---

## 종합

props와 state를 불변으로 다루라는 규칙은 두 갈래 이유에서 나온다.

하나는 멱등성이다. 받은 값을 그 자리에서 고치면 다음 렌더는 이미 고쳐진 값을 입력으로 받는다. 입력이 렌더할 때마다 달라지니 "같은 입력, 같은 출력"이 성립할 수 없고, 렌더 횟수에 따라 결과가 달라진다.

다른 하나는 갱신 통보다. React는 값을 직접 감시하지 않고 "새 값이 전달되었는가"로 변화를 판단한다. 객체 안을 고치면 손잡이는 그대로라서 React가 볼 때는 아무 일도 없다.

해법은 어느 쪽이든 하나다 — 고치지 말고 새로 만들어라. props는 부모가 새 값을 내려보내고, state는 setter로 새 값을 넘긴다.

---

# state 변수에 값을 직접 대입하면 화면은 어떻게 되는가?

## 도입

`count = count + 1`은 자바스크립트로서는 완벽히 정상인 문장이다. 그래서 이 코드를 쓰면 에러도 경고도 없이 그냥 아무 일도 일어나지 않는다 — 정확히는 값은 바뀌었는데 화면만 그대로다. 이 어긋남이 어디서 오는지가 이 질문의 요점이다.

---

## 본문

> Rather than updating the state variable in-place, we need to update it using the setter function that is returned by `useState`.

state 변수를 그 자리에서 갱신하는 대신, `useState`가 반환한 setter 함수를 써서 갱신해야 한다.

- **in-place**: 그 자리에서, 원본을 직접. 새 값을 만들어 넘기는 것과 대비되는 표현

> Changing values on the state variable doesn't cause the component to update, leaving your users with an outdated UI.

state 변수의 값을 바꾸는 것은 컴포넌트를 갱신시키지 않아, 사용자에게 낡은 UI가 남는다.

- **doesn't cause the component to update**: 여기서 update는 리렌더를 말한다. 값 대입에는 React에게 알리는 경로가 없어서, React는 다시 그릴 이유를 알지 못한다
- **outdated UI**: 데이터는 앞서 갔는데 화면이 따라오지 않은 상태

> Using the setter function informs React that the state has changed, and that we need to queue a re-render to update the UI.

setter 함수를 쓰면 state가 바뀌었다는 것과 UI 갱신을 위해 리렌더를 큐에 넣어야 한다는 것을 React에 알리게 된다.

- **informs React**: setter의 본질이 "값을 넣는 일"이 아니라 "알리는 일"이라는 점. 대입문과 함수 호출의 차이가 여기서 갈린다
- **queue a re-render**: 리렌더를 대기열에 등록하는 것. 즉시 다시 그리는 것이 아니라 예약이다

두 경로를 나란히 두면 차이가 분명하다.

```
count = count + 1        setCount(count + 1)
  ↓                        ↓
지역 변수 값만 바뀜        React에 "바뀌었다" 통보
  ↓                        ↓
React는 모름               리렌더 큐에 등록
  ↓                        ↓
화면 그대로 ❌             다음 렌더에서 새 값으로 그림 ✅
```

---

## 종합

state 변수는 값을 담아 두는 상자가 아니라 React가 이번 렌더에 건네준 사진 한 장에 가깝다. 사진에 덧칠해 봐야 원본이 바뀌지 않듯, 그 변수에 대입해도 React가 다음 렌더에 건네줄 값은 달라지지 않는다.

setter는 그래서 대입의 다른 문법이 아니라 통보 수단이다. 값이 바뀌었음을 알리고 리렌더를 예약하는 두 가지 일을 한 번에 한다. "즉시"가 아니라 "예약"이라는 점도 함께 기억할 만하다 — setter를 부른 직후에 그 변수를 읽어도 아직 옛 값이다.
