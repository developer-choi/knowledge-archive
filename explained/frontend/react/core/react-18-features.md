# React 18에서 useEffect 타이밍은 어떻게 변경되었는가?

## 도입

React 18 이전에는 click이나 keydown 같은 사용자 이벤트에서 state가 바뀌어도 그 안에서 발생한 effects가 언제 실행될지 예측하기 어려웠다. React 18은 이 타이밍을 명확하게 정의했다.

---

## 본문

> React now always synchronously flushes effect functions if the update was triggered during a discrete user input event such as a click or a keydown event.
> Previously, the behavior wasn't always predictable or consistent.

"이제 React는 click이나 keydown 같은 discrete 사용자 입력 이벤트 중에 업데이트가 트리거된 경우, effect 함수를 항상 동기적으로 flush한다. 이전에는 동작이 항상 예측 가능하거나 일관적이지 않았다."

- **synchronously flushes**: 큐에 쌓아두지 않고 즉시 동기적으로 실행해 비운다. 이벤트 핸들러가 끝나기 전에 effects가 실행 완료된다.
- **discrete user input event**: click, keydown처럼 한 번씩 명확히 발생하는 사용자 입력 이벤트. 연속적으로 흐르는 mousemove, scroll과 구분된다.
- **predictable or consistent**: React 17까지는 같은 코드도 타이밍 환경에 따라 effects 실행 시점이 달랐다. React 18은 이를 "discrete 이벤트 → 동기 flush"로 일관되게 정의했다.

---

## 종합

이 변경은 click 핸들러 안에서 setState를 호출할 때 그 렌더에서 발생하는 effects가 언제 실행되는지를 명확히 한다. 이벤트 핸들러 내에서 state 변경 → 리렌더 → effects 실행이 동기적으로 완료된다. 이 동작이 중요한 상황은 예를 들어 클릭 직후 DOM 측정이 필요한 경우다 — effect가 동기적으로 flush되므로 타이밍 의존 코드가 안정적으로 동작한다.

---

---

# React 18의 hydration 에러 정책은 어떻게 엄격해졌는가?

## 도입

SSR(서버 사이드 렌더링)에서 hydration은 서버가 보낸 HTML에 React 이벤트를 붙이는 과정이다. 서버 HTML과 클라이언트 렌더 결과가 다를 때(mismatch) React 17까지는 조용히 "패치"를 시도했다. React 18은 이 정책을 바꿨다.

---

## 본문

> Hydration mismatches due to missing or extra text content are now treated like errors instead of warnings.
> React will no longer attempt to "patch up" individual nodes by inserting or deleting a node on the client in an attempt to match the server markup, and will revert to client rendering up to the closest <Suspense> boundary in the tree.

"누락되거나 추가된 텍스트 콘텐츠로 인한 hydration 불일치는 이제 경고가 아니라 에러로 처리된다. React는 더 이상 서버 마크업에 맞추기 위해 클라이언트에서 노드를 삽입·삭제하여 개별 노드를 '패치'하려 하지 않고, 트리에서 가장 가까운 `<Suspense>` 경계까지 클라이언트 렌더링으로 되돌린다."

- **hydration mismatch**: 서버가 보낸 HTML과 클라이언트가 렌더한 결과가 일치하지 않는 상황. 대표적 원인: `typeof window !== 'undefined'` 조건 분기, 날짜/랜덤 값, 브라우저 전용 API.
- **patch up**: 불일치하는 노드를 삽입·삭제하여 억지로 맞추는 보정. React 17까지의 방식.
- **Suspense boundary**: 가장 가까운 상위 `<Suspense>`. 이 경계 안을 통째로 클라이언트에서 다시 렌더한다.

> This ensures the hydrated tree is consistent and avoids potential privacy and security holes that can be caused by hydration mismatches.

"이것은 hydrate된 트리의 일관성을 보장하고, hydration 불일치로 발생할 수 있는 잠재적인 프라이버시·보안 문제를 방지한다."

---

## 종합

React 17의 "조용히 패치" 정책은 불일치를 개발자가 눈치채기 어렵게 했다. React 18은 mismatch를 에러로 격상해 조기에 발견하게 하고, 패치 대신 Suspense 경계 단위로 클라이언트 렌더링을 수행한다. 실무에서는 hydration mismatch 에러를 보면 원인 코드에 `suppressHydrationWarning` 또는 `useEffect`로 브라우저 전용 분기를 처리해야 한다.

---

---

# React 18 Strict Mode의 새 동작(개발 모드 double-invoke)은 무엇이며 왜 도입되었는가?

## 도입

React 18 Strict Mode를 쓰면 개발 모드에서 컴포넌트가 마운트될 때 useEffect가 두 번 실행되는 것처럼 보인다. 버그가 아니다. 미래의 React 기능을 위해 컴포넌트가 effect 마운트/파괴를 여러 번 겪어도 정상 동작하는지 검증하는 의도적인 동작이다.

---

## 본문

> In the future, we'd like to add a feature that allows React to add and remove sections of the UI while preserving state.
> For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen.
> To do this, React would unmount and remount trees using the same component state as before.

"미래에 React가 state를 보존하면서 UI 섹션을 추가·제거하는 기능을 추가하고 싶다. 예를 들어 사용자가 다른 탭으로 갔다가 돌아오면 React가 이전 화면을 즉시 보여줄 수 있어야 한다. 이를 위해 React는 이전 컴포넌트 state를 사용하여 트리를 unmount하고 remount할 것이다."

- **preserving state**: 컴포넌트 state를 유지한 채로 — 탭이 사라졌다가 돌아와도 state가 복구된다.

> This feature will give React apps better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times.

"이 기능은 React 앱에 기본으로 더 나은 성능을 제공하지만, 컴포넌트가 effects가 여러 번 마운트·파괴되어도 견고하게 동작해야 한다."

- **resilient**: 마운트/파괴가 여러 번 일어나도 정상 동작하는 견고함. 정리되지 않은 구독, 누적 이벤트 리스너 등이 문제가 될 수 있다.

> To help surface these issues, React 18 introduces a new development-only check to Strict Mode.
> This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

"이 문제를 조기에 발견하기 위해 React 18은 Strict Mode에 새로운 개발 모드 전용 검사를 도입한다. 이 검사는 컴포넌트가 처음 마운트될 때마다 자동으로 언마운트하고 리마운트하며, 두 번째 마운트에서 이전 state를 복원한다."

- **development-only check**: 개발 모드에서만 동작. 프로덕션 빌드에서는 실행되지 않는다.
- **restoring the previous state**: 두 번째 마운트 시 state를 초기화가 아니라 이전 값으로 복원한다.

double-invoke 실행 순서:

```
1. React mounts the component.
   - Layout effects are created.
   - Effects are created.
2. React simulates unmounting the component.
   - Layout effects are destroyed.
   - Effects are destroyed.
3. React simulates mounting the component with the previous state.
   - Layout effects are created.
   - Effects are created.
```

---

## 종합

`useEffect` 안에서 이벤트 리스너를 추가하고 cleanup에서 제거하면 double-invoke에서도 문제없다. 하지만 cleanup 없이 리스너를 추가하면 두 번째 마운트에서 리스너가 두 개가 된다. Strict Mode double-invoke는 이런 cleanup 누락을 개발 단계에서 조기에 발견하게 해주는 도구다. `useEffect`에서 cleanup을 항상 return하는 습관이 이 검사를 통과하는 조건이다.

---

---

# useId는 어떤 문제를 해결하기 위한 훅인가?

## 도입

HTML에서 `<label for="email-input">`과 `<input id="email-input">`처럼 접근성 속성이 ID를 참조할 때, 그 ID가 클라이언트와 서버에서 동일해야 hydration이 일치한다. 직접 숫자를 붙이거나 `Math.random()`을 쓰면 서버·클라이언트 간 불일치가 생긴다.

---

## 본문

> useId is a new hook for generating unique IDs on both the client and server, while avoiding hydration mismatches.

"useId는 hydration 불일치를 방지하면서 클라이언트와 서버 양쪽에서 고유 ID를 생성하기 위한 새 훅이다."

- **unique IDs**: 클라이언트와 서버 양쪽에서 동일하게 보장되어야 하는 고유 식별자. 각 컴포넌트 인스턴스마다 안정적으로 같은 ID를 반환한다.
- **avoiding hydration mismatches**: `Math.random()`처럼 매 호출마다 다른 값을 내는 방법은 서버에서 생성한 ID와 클라이언트에서 생성한 ID가 달라져 mismatch가 생긴다.

> It is primarily useful for component libraries integrating with accessibility APIs that require unique IDs.

"주로 고유 ID가 필요한 접근성 API와 통합하는 컴포넌트 라이브러리에 유용하다."

- **accessibility APIs**: `aria-labelledby`, `aria-describedby`, `htmlFor` 같이 ID 참조가 필요한 접근성 속성들.

> This solves an issue that already exists in React 17 and below, but it's even more important in React 18 because of how the new streaming server renderer delivers HTML out-of-order.

"이것은 React 17 이하에서도 존재하던 문제를 해결하지만, 새 스트리밍 서버 렌더러가 HTML을 순서 없이 전달하는 방식 때문에 React 18에서 더욱 중요해졌다."

- **out-of-order**: 정해진 순서대로가 아니라 준비되는 대로 임의의 순서로 전달되는 방식. 스트리밍 SSR에서 각 Suspense 청크가 다른 순서로 도착하면 카운터 기반 ID 생성이 서버·클라이언트 간 어긋날 수 있다.

```jsx
function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label htmlFor={passwordHintId}>Password</label>
      <input id={passwordHintId} type="password" />
    </>
  );
}
// 서버와 클라이언트에서 동일한 ID 생성 → hydration 일치
```

---

## 종합

`useId`는 서버 렌더링 + 접근성 요구사항이 맞물리는 지점의 해결책이다. `Math.random()`이나 전역 카운터를 쓰면 SSR 환경에서 서버·클라이언트 ID가 어긋나 hydration 에러가 생긴다. `useId`는 React 내부의 컴포넌트 트리 위치를 기반으로 ID를 생성하므로 양쪽에서 항상 같은 값이 나온다. 컴포넌트 라이브러리를 만들거나 `aria-*` 속성에서 ID 참조가 필요할 때 표준 솔루션이다.
