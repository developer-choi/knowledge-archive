# 이벤트 핸들러 안에서 state setter를 여러 번 호출하면, React는 그 갱신들을 언제 처리하는가?

## 도입

set 함수를 부를 때마다 화면이 한 번씩 다시 그려진다고 생각하기 쉽다. 그렇다면 한 핸들러에서 세 개의 state를 갱신하면 화면도 세 번 다시 그려질 것이다.

React는 그렇게 하지 않는다. 여기서는 갱신을 모아뒀다가 언제 처리하는지, 그리고 왜 그렇게 하는지를 본다.

렌더가 촉발되고 화면에 반영되기까지의 단계는 [React가 화면을 갱신하는 세 단계인 Trigger, Render, Commit은 각각 무엇을 하는가?](./render-and-commit.md)에서 다뤘다.

---

## 본문

> React waits until all code in the event handlers has run before processing your state updates.

"React는 state 갱신을 처리하기 전에 이벤트 핸들러 안의 모든 코드가 실행될 때까지 기다린다."

- **waits until ... has run**: 기다리는 대상이 "핸들러가 끝나는 시점"이다. set 함수를 부른 그 줄이 아니라, 핸들러 전체가 반환된 뒤가 처리 시점이다.
- **processing**: 갱신을 받아만 두고 실제 처리는 미룬다는 뜻이다. 받는 시점과 처리하는 시점 사이에 간격이 있다.

> This is why the re-render only happens after all these setNumber() calls.

"이것이 리렌더가 이 모든 `setNumber()` 호출이 끝난 뒤에야 일어나는 이유다."

- **only ... after**: 그 전에는 일어나지 않는다. 호출 세 번에 리렌더 세 번이 아니라, 호출이 몇 번이든 리렌더는 그 뒤 한 번이다.

### 이렇게 해서 얻는 것과 잃는 것

> This lets you update multiple state variables—even from multiple components—without triggering too many re-renders.

"이 덕분에 여러 state 변수를, 심지어 여러 컴포넌트에 걸쳐 갱신하면서도 리렌더를 너무 많이 촉발하지 않을 수 있다."

- **multiple state variables**: 한 컴포넌트 안의 여러 state. 이름·나이·주소를 한 번에 채우는 식이다.
- **even from multiple components**: 범위가 컴포넌트를 넘는다. 부모가 넘긴 콜백이 부모 state를 갱신하고 자식이 자기 state도 갱신하면, 그 둘이 한 묶음으로 처리된다.
- **too many re-renders**: 갱신 수만큼 리렌더가 나가면 낭비다. 중간 단계 화면은 어차피 사람 눈에 보이지도 않는다.

> But this also means that the UI won’t be updated until after your event handler, and any code in it, completes.

"하지만 이는 이벤트 핸들러와 그 안의 어떤 코드든 완료되기 전까지는 UI가 갱신되지 않는다는 뜻이기도 하다."

- **But this also means**: 앞의 이득에 딸려오는 대가를 꺼내는 자리다.
- **any code in it**: 핸들러 안의 나머지 코드까지 포함한다. set 함수 아래에 오래 걸리는 반복문을 두면 그 시간만큼 화면 갱신도 밀린다.

> This behavior, also known as batching, makes your React app run much faster.

"batching이라고도 불리는 이 동작은 React 앱을 훨씬 빠르게 만든다."

- **batching**: 여러 건을 한 묶음으로 모아 한 번에 처리하는 방식. 갱신 하나하나를 즉시 처리하지 않고 모아두는 이 동작에 붙은 이름이다.

> It also avoids dealing with confusing “half-finished” renders where only some of the variables have been updated.

"또한 일부 변수만 갱신된 혼란스러운 '절반만 끝난' 렌더를 다루는 일을 피하게 해준다."

- **“half-finished”**: 갱신 세 개 중 하나만 반영된 중간 상태를 가리킨다. 그런 상태가 실제 렌더로 나가면 화면에 있을 수 없는 조합이 잠깐 비친다.
- **only some of the variables**: 문제의 핵심이 여기다. 이름은 새 값인데 나이는 옛 값인 화면이 만들어지면 그걸 전제로 짠 코드가 어긋난다.

```
[이벤트 핸들러 실행 중]
  setA(...)  ─┐
  setB(...)  ─┼→ 갱신을 큐에 넣기만 함. 화면은 그대로
  setC(...)  ─┘
  나머지 코드 실행
       ↓
[핸들러 반환]
       ↓
  React가 큐를 처리 → 리렌더 1회 → 화면 반영
```

---

## 종합

set 함수는 갱신을 받아두는 창구이고, 처리는 핸들러가 끝난 뒤에 한꺼번에 이뤄진다. 그래서 한 핸들러 안에서 set 함수를 몇 번 부르든 리렌더는 그 뒤 한 번이다.

이 방식의 이득은 두 가지다. 리렌더 횟수가 갱신 개수를 따라 늘지 않아 빠르고, 일부만 갱신된 중간 상태가 화면으로 나가지 않는다.

대가는 화면 갱신이 핸들러 종료 시점까지 미뤄진다는 점이다. 핸들러 안에 무거운 작업이 있으면 그만큼 화면도 늦게 바뀐다.

이 모아 처리하는 동작에 붙은 이름이 batching이다.
