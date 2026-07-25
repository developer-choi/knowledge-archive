# React 컴포넌트가 한 번 렌더될 때, 그 렌더 안에서 state 값은 언제 정해지고 언제까지 그대로인가?

## 도입

`useState`로 얻은 값을 두고 "변수니까 set 함수를 부르면 그 자리에서 값이 바뀐다"고 생각하기 쉽다. 실제로는 set 함수를 부른 뒤에도 그 변수는 끝까지 원래 값을 들고 있다.

React에서 렌더는 컴포넌트 함수를 호출해 화면이 어때야 하는지 계산하는 일이다. 이 정의는 앞 단계 문서인 [React가 화면을 갱신하는 세 단계인 Trigger, Render, Commit은 각각 무엇을 하는가?](./render-and-commit.md)에서 다룬 그대로다.

여기서는 그 한 번의 호출 안에서 state 값이 어떻게 취급되는지를 본다.

---

## 본문

> state behaves more like a snapshot.
> Setting it does not change the state variable you already have, but instead triggers a re-render.

"state는 스냅샷에 더 가깝게 동작한다. state를 설정한다고 해서 이미 가지고 있는 state 변수가 바뀌지는 않고, 대신 리렌더를 촉발한다."

- **snapshot**: 어느 시점의 모습을 그대로 찍어 굳혀둔 것. 사진처럼 찍은 뒤에는 바깥이 어떻게 변해도 사진 속 내용은 달라지지 않는다.
- **the state variable you already have**: 지금 실행 중인 이 함수 안에 이미 들어와 있는 그 변수. set 함수는 React가 보관 중인 값을 갱신하는 것이지, 눈앞의 이 변수를 다시 쓰는 게 아니다.
- **triggers a re-render**: 값을 바꾸는 대신 새 렌더를 촉발한다. 새 값은 새로 호출될 함수에서 처음 모습을 드러낸다.

### setter 호출 한 번이 하는 두 가지 일

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

원문은 이 코드의 `setIsSent(true)`를 이렇게 설명한다.

> setIsSent(true) sets isSent to true and queues a new render.

"`setIsSent(true)`는 `isSent`를 `true`로 설정하고, 새 렌더를 대기열에 넣는다."

- **sets ... and queues**: 동사가 둘이라는 점이 요점이다. set 함수 한 번의 호출이 "React가 보관하는 값을 갱신"과 "다음 렌더 예약"을 함께 처리한다.

두 가지 일이 한 번에 일어나지만, 그 결과가 나타나는 시점은 다르다. 값 갱신은 React가 들고 있는 보관함에 즉시 반영되고, 지금 실행 중인 이 함수 안의 `isSent`는 여전히 `false`다.

그래서 `setIsSent(true)` 바로 다음 줄의 `sendMessage(message)`는 그대로 실행된다.

이 함수가 끝나고 React가 컴포넌트를 다시 호출했을 때에야 `isSent`가 `true`인 렌더가 만들어진다. `<h1>Your message is on its way!</h1>`가 반환되는 것도 그 시점이다.

#### 값이 그 자리에서 바뀌는 방식이었다면

set 함수가 눈앞의 변수를 그 자리에서 바꾸는 방식이었다면, 한 이벤트 핸들러가 실행되는 도중에 값이 갈아끼워진다. 핸들러 앞부분이 읽은 값과 뒷부분이 읽은 값이 달라져 같은 코드가 실행 순간마다 다르게 동작한다.

### 렌더가 반환한 JSX가 그 시점의 스냅샷

> The JSX you return from that function is like a snapshot of the UI in time.
> Its props, event handlers, and local variables were all calculated using its state at the time of the render.

"그 함수에서 반환하는 JSX는 특정 시점 UI의 스냅샷과 같다. 그 JSX의 props, 이벤트 핸들러, 지역 변수는 모두 렌더 시점의 state를 사용해 계산되었다."

- **in time**: 시간 축의 한 점. 지금 반환된 이 JSX는 "이 렌더 시점의 화면"이지 "언제나 유효한 화면"이 아니다.
- **props, event handlers, and local variables**: 세 가지를 나란히 세운 게 중요하다. 화면에 보이는 값만 굳는 게 아니라, 자식에게 넘긴 props도, `onClick`에 넘긴 함수도, 함수 본문에서 계산한 지역 변수도 전부 같은 값으로 굳는다.
- **calculated**: 계산되었다. 참조로 연결해둔 게 아니라 그 시점 값으로 계산을 끝낸 결과다.

> Its value was “fixed” when React “took the snapshot” of the UI by calling your component.

"그 값은 React가 컴포넌트를 호출해 UI의 '스냅샷을 찍은' 시점에 '고정'되었다."

- **“fixed”**: 이번 호출이 만들어낸 결과물 안에 그 값이 이미 박혔다는 뜻이다. 변수가 읽기 전용으로 잠기는 것과는 다르기 때문에 원문도 따옴표를 붙였다.
- **by calling your component**: 스냅샷을 찍는 행위의 실체가 컴포넌트 함수 호출이다. 별도의 캡처 과정이 있는 게 아니라, 호출해서 반환값을 받는 그 자체가 촬영이다.

값이 굳는 시점을 순서대로 보면 이렇다.

```
set 함수 호출
   │
   ├─→ React가 보관 중인 state 값을 갱신
   │
   └─→ 렌더 예약
          ↓
   React가 컴포넌트 함수를 호출
   (이번 렌더 몫의 state 값을 건네줌)
          ↓
   함수가 JSX를 반환  ←── 여기서 굳는다
   ├ props          : 이번 값으로 계산 완료
   ├ 이벤트 핸들러   : 이번 값을 품은 채로 생성
   └ 지역 변수       : 이번 값으로 계산 완료
          ↓
   React가 화면을 이 스냅샷에 맞춤
```

굳는 지점이 함수가 JSX를 반환하는 자리라는 게 핵심이다. 반환이 끝난 뒤로는 React가 보관 중인 값이 몇 번을 더 바뀌어도 이 스냅샷은 그대로 남는다.

### 새 값은 다음 렌더에서만

> Setting state only changes it for the next render.
> A state variable’s value never changes within a render, even if its event handler’s code is asynchronous.

"state를 설정하는 것은 다음 렌더에 한해서만 값을 바꾼다. state 변수의 값은 한 렌더 안에서는 절대 바뀌지 않는다. 그 이벤트 핸들러의 코드가 비동기여도 마찬가지다."

- **only ... for the next render**: 갱신의 적용 범위를 못박는 표현이다. 갱신은 다음 렌더를 향하고, 지금 렌더에는 소급되지 않는다.
- **never changes within a render**: 예외 없음을 뜻하는 `never`다. 한 렌더 안에서 state 변수가 값을 바꾸는 경우는 없다.
- **even if ... asynchronous**: 비동기 코드가 예외처럼 보이기 쉬워서 원문이 따로 못박아둔 부분이다. 콜백이 몇 초 뒤에 실행되더라도 그 콜백은 자기가 만들어진 렌더의 값을 읽는다.

---

## 종합

state는 값을 담아두는 상자라기보다, 렌더마다 새로 건네받는 사진 한 장에 가깝다. React가 컴포넌트 함수를 호출할 때 그 렌더 몫의 값을 건네고, 함수는 그 값으로 JSX를 계산해 반환한다.

반환된 결과 안의 props, 이벤트 핸들러, 지역 변수는 그 시점 값으로 계산이 끝난 상태다. set 함수는 이 결과물을 고치지 않고, React가 보관하는 값을 갱신한 뒤 다음 렌더를 예약한다.

그래서 set 함수를 부른 다음 줄에서 같은 변수를 읽으면 여전히 옛날 값이 나온다. 지금 실행 중인 함수 자체가 옛 렌더의 것이라서 그렇다.

이 규칙이 있어서 한 렌더 안의 코드는 어느 줄에서 읽든 같은 값을 본다. 값이 실행 도중에 갈아끼워지지 않으니, 핸들러의 동작을 코드 순서만 보고 예측할 수 있다.

---

# 리렌더가 일어나면 이전 렌더에서 만들어진 이벤트 핸들러와 지역 변수는 어떻게 되는가?

## 도입

컴포넌트 함수는 렌더될 때마다 처음부터 다시 실행된다. 함수 본문에서 선언한 지역 변수도, `onClick`에 넘긴 화살표 함수도 그때마다 새로 만들어진다.

그러면 직전 렌더에서 만들어진 것들이 어떻게 되는지가 궁금해진다.

특히 아직 실행되지 않은 채 남아 있는 옛 핸들러가 있다면, 그 핸들러가 어느 값을 읽는지가 문제가 된다.

---

## 본문

> Variables and event handlers don’t “survive” re-renders.
> Every render has its own event handlers.

"변수와 이벤트 핸들러는 리렌더에서 '살아남지' 않는다. 모든 렌더는 자기 몫의 이벤트 핸들러를 가진다."

- **“survive”**: 렌더마다 완전히 새로 만들어져서, 이전 렌더의 것이 다음 렌더로 넘어오지 않는다는 뜻이다. 살아남는다는 표현이 비유라서 원문도 따옴표를 붙였다.
- **its own**: 각 렌더가 자기만의 것을 가진다. 렌더 1의 `handleClick`과 렌더 2의 `handleClick`은 코드가 같아도 서로 다른 함수 객체다.

> Every render (and functions inside it) will always “see” the snapshot of the state that React gave to that render.

"모든 렌더는 (그리고 그 안의 함수들은) 언제나 React가 그 렌더에 건네준 state의 스냅샷을 '본다'."

- **(and functions inside it)**: 괄호 안이 실제로 문제가 되는 부분이다. 렌더 본문뿐 아니라 그 안에서 정의된 함수, 그 함수가 다시 넘긴 콜백까지 전부 같은 스냅샷을 본다.
- **always**: 조건이 없다. 실행 시점이 언제든, 그 함수가 어디로 넘겨졌든 보는 값은 자기가 태어난 렌더의 값이다.
- **gave to that render**: 값을 건네주는 주체가 React이고, 받는 단위가 렌더다. 컴포넌트 단위도, 앱 단위도 아니다.

> Event handlers created in the past have the state values from the render in which they were created.

"과거에 만들어진 이벤트 핸들러는 자신이 만들어진 렌더의 state 값을 가진다."

- **created in the past**: 이미 지나간 렌더에서 만들어졌다는 뜻이다. 예약된 콜백이나 아직 정리되지 않은 구독 안에 그런 핸들러가 남아 있을 수 있다.
- **have**: 읽어온다가 아니라 가지고 있다. 실행 시점에 최신 값을 조회하는 게 아니라, 만들어질 때 이미 값을 품고 있다.

### 핸들러가 자기 렌더에 묶여 있다는 증거

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

버튼을 한 번 누르면 화면의 숫자는 곧바로 5로 바뀐다. 그런데 3초 뒤 뜨는 alert은 `0`이다.

`setTimeout`에 넘긴 콜백은 `number`가 `0`이던 렌더 안에서 만들어졌고, 그래서 그 렌더의 값을 품은 채로 실행된다. 3초 사이에 화면이 어떻게 바뀌었는지는 이 콜백과 상관이 없다.

비동기 콜백이 어느 시점의 값을 읽는지는 따로 다룰 주제다. 여기서는 핸들러가 자기 렌더에 묶여 있다는 사실을 눈으로 확인하는 데서 멈춘다.

### 렌더마다 따로 존재한다

```
[렌더 1]  React가 건넨 number = 0
  ├ <h1>0</h1>
  └ onClick 핸들러 A  ── 0을 품고 생성
                         └→ setTimeout 콜백도 0을 품음

        ↓  setNumber(0 + 5) → 리렌더

[렌더 2]  React가 건넨 number = 5
  ├ <h1>5</h1>
  └ onClick 핸들러 B  ── 5를 품고 생성

핸들러 A와 B는 코드가 같아도 서로 다른 함수다.
A가 3초 뒤에 실행되어도 A가 보는 값은 여전히 0이다.
```

핸들러 A와 렌더 2 사이에는 참조 관계 자체가 없다. 렌더 1이 실행될 때 `number`는 이미 `0`이라는 값으로 계산에 들어갔고, 핸들러 A는 그 결과를 품은 채로 만들어졌다.

---

## 종합

컴포넌트 함수가 다시 호출되면 그 안의 지역 변수와 이벤트 핸들러는 전부 새로 만들어진다. 이전 렌더의 것들은 다음 렌더로 이어지지 않고, 각 렌더가 자기 몫의 한 벌을 따로 가진다.

그래서 어떤 함수가 읽는 state 값은 실행 시점이 아니라 생성 시점으로 정해진다. 화면이 이미 다른 값을 보여주고 있어도, 옛 렌더에서 만들어진 함수는 옛 값을 그대로 들고 있다.

덕분에 한 핸들러 안의 코드는 처음부터 끝까지 같은 값으로 동작한다. 실행 도중에 값이 뒤바뀌는 일이 없다.

핸들러 코드를 읽을 때 "이 시점에는 값이 얼마일까"를 따로 따질 필요가 없다는 뜻이다.
