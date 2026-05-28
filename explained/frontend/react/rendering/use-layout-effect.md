# tooltip 같은 DOM 요소를 측정할 때 `useLayoutEffect`가 필요한 이유는?

## 도입

React 렌더링은 세 단계로 이루어진다 — render(가상 DOM 계산), commit(DOM 반영), paint(브라우저가 화면에 그림). `useEffect`는 paint 이후에 실행되고, `useLayoutEffect`는 commit과 paint 사이에 실행된다. tooltip처럼 DOM 크기를 측정해 위치를 결정해야 하는 경우, paint 이전에 측정과 재렌더링이 완료되어야 사용자에게 깜빡임이 보이지 않는다.

---

## 본문

> The code inside `useLayoutEffect` and all state updates scheduled from it block the browser from repainting the screen.

"`useLayoutEffect` 안의 코드와 거기서 예약된 모든 상태 업데이트는 브라우저가 화면을 다시 그리는 것을 차단한다."

> React guarantees that the code inside `useLayoutEffect` and any state updates scheduled inside it will be processed before the browser repaints the screen.

"React는 `useLayoutEffect` 안의 코드와 그 안에서 예약된 상태 업데이트가 브라우저가 화면을 다시 그리기 전에 처리됨을 보장한다."

> This lets you render the tooltip, measure it, and re-render the tooltip again without the user noticing the first extra render.

"이를 통해 tooltip을 렌더링하고, 측정하고, 사용자가 첫 번째 추가 렌더링을 알아채지 못한 채 tooltip을 다시 렌더링할 수 있다."

> In other words, `useLayoutEffect` blocks the browser from painting.

"다시 말해, `useLayoutEffect`는 브라우저가 페인팅하는 것을 차단한다."

- **block the browser from repainting**: commit 후 paint 전 사이의 시간에 `useLayoutEffect`가 실행되고 완료될 때까지 paint가 시작되지 않는다. 사용자는 아직 아무것도 보지 못한다.
- **state updates scheduled**: `useLayoutEffect` 안에서 `setState`를 호출하면 그 상태 업데이트가 paint 전에 처리된다. `setState`는 즉시 실행이 아니라 예약이지만, paint 전에 처리가 보장된다.

```
React Commit → DOM 반영 완료
        ↓
useLayoutEffect 실행 시작     ← paint 차단 시작
  DOM 측정 (offsetHeight 등)
  setState 호출 (예약)
  실행 완료
        ↓
예약된 setState 처리          ← 아직 paint 차단 중
        ↓
useLayoutEffect 완전히 끝남
        ↓
브라우저 Paint 시작           ← 이제야 화면에 그려짐
        ↓
사용자 눈에 보임
```

tooltip 사용 사례:

```jsx
function Tooltip({ text, anchor }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    // DOM에 tooltip이 반영된 후, paint 전에 실행
    const { height } = tooltipRef.current.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    // 측정 결과로 위치 결정
    setPosition({ top: anchorRect.top - height, left: anchorRect.left });
    // → 이 setPosition이 처리된 후 paint → 깜빡임 없음
  });

  return <div ref={tooltipRef} style={position}>{text}</div>;
}
```

브라우저 렌더링 파이프라인: `DOM + CSSOM → Render Tree → Layout → Paint`. `useLayoutEffect`는 DOM 반영 후 Paint 직전에 실행된다.

---

## 종합

`useLayoutEffect`가 없으면 tooltip이 잘못된 위치에 잠깐 나타났다가 올바른 위치로 이동하는 깜빡임이 사용자에게 보인다 — `useEffect`는 paint 이후에 실행되므로 잘못된 위치로 먼저 그려진다. `useLayoutEffect`는 paint를 막고 측정과 재배치를 완료한 뒤에야 화면을 그리게 하므로 깜빡임이 없다. 단, paint를 차단하므로 과도하게 사용하면 앱이 느려지는 부작용이 있다.

---

---

# [UNVERIFIED] `useLayoutEffect` 안에서 `setState`를 호출하면 즉시 실행되는가?

## 도입

`useLayoutEffect`가 paint를 차단한다는 것은 알겠는데, 그 안에서 `setState`를 호출하면 상태가 즉시 바뀌는가? 아니면 여전히 비동기적으로 처리되는가?

---

## 본문

`setState`는 호출 즉시 상태를 변경하지 않는다. React 내부 큐에 "나중에 처리해줘"라고 예약(schedule)하는 것이다.

```jsx
useLayoutEffect(() => {
  setCount(1);
  console.log(count); // 아직 0 — 예약만 됐고 실행 안 됨
});
```

- **예약(schedule)**: `setState`는 상태를 즉시 변경하는 함수가 아니다. React에게 "다음 처리 시점에 이 값으로 상태를 바꿔달라"고 요청한다.
- **useLayoutEffect 코드가 전부 끝난 뒤**: 예약된 상태 업데이트는 `useLayoutEffect` 함수 전체가 완료된 후에 처리된다. 이 처리까지 완료되어야 paint가 시작된다.

```
useLayoutEffect 내 setState 실행 순서

useLayoutEffect 시작
  DOM 측정 코드 실행
  setState(newValue) 호출    ← 즉시 실행 아님, 큐에 예약
  console.log(state)        ← 여전히 이전 값 출력
  나머지 코드 실행
useLayoutEffect 코드 완료
        ↓
React: 예약된 setState 처리 ← 이 시점에 실제 상태 변경
        ↓
필요시 재렌더링
        ↓
paint 시작
```

---

## 종합

`useLayoutEffect` 안에서의 `setState`는 일반 `setState`와 같은 비동기 예약 방식으로 동작한다. 다만 `useLayoutEffect`가 paint를 차단하므로, 예약된 상태 업데이트와 그로 인한 재렌더링까지 모두 paint 전에 처리된다. 사용자 관점에서는 중간 상태가 보이지 않는다.

---

---

# [UNVERIFIED] `useLayoutEffect`가 관여할 때 React commit부터 브라우저 paint까지의 실행 순서는?

## 도입

`useLayoutEffect`가 어느 시점에 실행되는지를 React commit 단계와 브라우저 paint 사이에서 정확히 파악하면, 왜 깜빡임이 없는지와 왜 과도한 사용이 느려지는지를 이해할 수 있다.

---

## 본문

```
React Commit (DOM 반영 완료)
         ↓
useLayoutEffect 시작
  ├── 코드 실행 중...        ← 브라우저 Paint 차단 시작
  ├── setState 호출 (예약)
  ├── 더 많은 코드...
  └── 코드 실행 완료
         ↓
예약된 setState 처리         ← 아직도 Paint 차단 중
         ↓
useLayoutEffect 완전히 끝남
         ↓
브라우저 Paint 시작           ← 이제야 화면에 그려짐
         ↓
사용자 눈에 보임
```

이 흐름에서 주목할 지점:

- React **commit** 단계: 가상 DOM 계산 결과를 실제 DOM에 반영한다. 이 단계가 끝나면 `document.querySelector`로 DOM을 읽을 수 있다.
- **useLayoutEffect** 실행: commit 직후, paint 직전. DOM을 읽고 setState를 예약할 수 있다.
- **paint**: 브라우저가 DOM을 화면에 픽셀로 그리는 단계. 이 이후에 사용자가 변경 사항을 볼 수 있다.

`useEffect`와의 비교:

```
useLayoutEffect           useEffect
─────────────────         ─────────────────
commit → [실행] → paint   commit → paint → [실행]
paint 차단 O              paint 차단 X
DOM 측정 → 깜빡임 없음     DOM 측정 → 깜빡임 가능
```

---

## 종합

실행 순서를 알면 도구 선택 기준이 명확해진다. DOM을 측정하고 그 결과로 UI를 즉시 조정해야 한다면 `useLayoutEffect`가 필요하다. paint 이후에 실행해도 되는 부수 효과(데이터 패칭, 이벤트 리스너 등록, 로깅 등)는 paint를 차단하지 않는 `useEffect`를 써야 한다. `useLayoutEffect`를 남용하면 paint가 계속 차단되어 UI가 뚝뚝 끊기는 느낌을 준다.

---

---

# `useEffect`는 항상 paint 이후에 실행되는가?

## 도입

`useEffect`는 일반적으로 paint 이후에 실행된다고 알려져 있다. 그런데 `useLayoutEffect`가 같은 컴포넌트에 있을 때 `useEffect`도 paint 이전에 실행될 수 있다.

---

## 본문

> If you trigger a state update inside `useLayoutEffect`, React will execute all remaining Effects immediately including `useEffect`.

"`useLayoutEffect` 안에서 상태 업데이트를 트리거하면, React는 `useEffect`를 포함한 나머지 모든 Effect를 즉시 실행한다."

- **all remaining Effects**: `useLayoutEffect`가 `setState`로 재렌더링을 유발하면, 그 재렌더링 후에 `useEffect`를 포함한 모든 Effect가 함께 실행된다. 이 경우 paint 전에 `useEffect`도 실행될 수 있다.
- **immediately**: 정상적인 "다음 틱에 실행" 방식이 아닌 즉시 실행 모드.

```
일반적인 경우 (useLayoutEffect에서 setState 없음):
commit → useLayoutEffect 실행 → paint → useEffect 실행

useLayoutEffect에서 setState 호출한 경우:
commit → useLayoutEffect 실행
           ↓ setState → 재렌더링
         재렌더링 commit
           ↓ useLayoutEffect 재실행 (setState 없음)
           ↓ useEffect도 즉시 실행  ← paint 이전!
         paint → 사용자 화면
```

---

## 종합

`useEffect`가 "항상 paint 이후에 실행된다"는 것은 일반적인 경우의 동작이다. `useLayoutEffect`에서 `setState`가 발생해 재렌더링이 트리거되면 예외가 생긴다 — 이 재렌더링의 Effect들은 paint 전에 동기적으로 실행된다. 이 엣지 케이스는 `useLayoutEffect`를 가진 컴포넌트에서 `useEffect`의 실행 타이밍을 예측할 때 중요하다.
