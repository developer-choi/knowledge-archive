# React가 화면을 갱신하는 세 단계인 Trigger, Render, Commit은 각각 무엇을 하는가?

## 도입

React 앱에서 화면이 바뀌는 일은 한 덩어리의 동작이 아니라 세 단계로 쪼개져 있다. 여기서 가장 오해가 잦은 단어가 가운데 있는 "Render"다.

일상에서 "렌더링"은 픽셀을 그려내는 작업을 뜻하지만, React에서 렌더는 컴포넌트 함수를 호출해서 "화면에 무엇이 있어야 하는가"를 알아내는 계산이다. 실제 DOM이 바뀌는 것은 마지막 Commit 단계뿐이다.

---

## 본문

> Any screen update in a React app happens in three steps:
>
> - Trigger
> - Render
> - Commit

"React 앱에서 일어나는 모든 화면 갱신은 세 단계를 거친다: Trigger, Render, Commit."

- **Any screen update**: 예외 없이 모든 화면 갱신. 최초로 화면이 그려지는 것도, 버튼을 눌러 숫자 하나가 바뀌는 것도 같은 세 단계를 지난다.
- **three steps**: 세 단계가 개념적 분류가 아니라 실행 순서다. 앞 단계가 끝나야 뒤 단계가 시작한다.

```
Trigger ──────→ Render ──────────────→ Commit
(렌더 요청)      (컴포넌트 함수 호출,      (DOM 실제 수정)
                무엇을 그릴지 계산)
                        ↑
                 여기선 DOM을 건드리지 않는다
```

> There are two reasons for a component to render:
>
> - It’s the component’s initial render.
> - The component’s (or one of its ancestors’) state has been updated.

"컴포넌트가 렌더되는 이유는 두 가지다: 최초 렌더이거나, 그 컴포넌트(또는 그 조상 중 하나)의 state가 갱신되었거나."

- **reasons**: 계기. React는 스스로 시간마다 렌더하지 않는다. 둘 중 하나의 계기가 있어야만 렌더가 시작된다.
- **initial render**: 앱이 처음 화면에 붙을 때 한 번 일어나는 렌더.
- **(or one of its ancestors’)**: 괄호 안이지만 실무에서 가장 자주 부딪히는 부분이다. 내 컴포넌트의 state가 전혀 바뀌지 않아도, 위쪽 조상 중 하나의 state가 바뀌면 나도 다시 렌더된다. "이 컴포넌트는 state가 없는데 왜 계속 다시 렌더되지?"의 답이 대개 여기 있다.

> After you trigger a render, React calls your components to figure out what to display on screen.
> “Rendering” is React calling your components.

"렌더를 촉발하면 React는 화면에 무엇을 표시할지 알아내기 위해 컴포넌트를 호출한다. '렌더링'이란 React가 컴포넌트를 호출하는 것이다."

- **calls your components**: 컴포넌트 함수를 말 그대로 호출(`Gallery()`)한다는 뜻. 렌더의 실체는 함수 호출이다.
- **figure out**: 알아낸다는 뜻이지 그린다(paint/draw)가 아니다. 이 단어 선택이 핵심이다. 렌더 단계의 산출물은 화면이 아니라 "화면이 이래야 한다"는 계산 결과다.
- **“Rendering” is React calling your components**: 원문이 따옴표까지 붙여 렌더링을 다시 정의한다. 일상 용어의 "그리기"와 혼동하지 말라는 신호다.

> The process will continue until there are no more nested components and React knows exactly what should be displayed on screen.

"이 과정은 더 이상 중첩된 컴포넌트가 없고 React가 화면에 무엇이 표시되어야 하는지 정확히 알게 될 때까지 계속된다."

- **nested components**: 어떤 컴포넌트가 반환한 JSX 안에 또 들어 있는 컴포넌트. 이게 남아 있는 한 호출이 이어진다.
- **knows exactly**: 렌더가 끝났을 때 React가 손에 쥔 것은 완성된 화면이 아니라 "정확히 무엇이 있어야 하는지"에 대한 앎이다.

> After rendering (calling) your components, React will modify the DOM.
> React only changes the DOM nodes if there’s a difference between renders.

"컴포넌트를 렌더(호출)한 뒤에 React는 DOM을 수정한다. React는 렌더 사이에 차이가 있을 때만 DOM 노드를 변경한다."

- **modify the DOM**: 세 단계 중 DOM이라는 단어가 등장하는 곳은 여기뿐이다. 브라우저에 실제로 반영되는 지점은 Commit 하나다.
- **only ... if there’s a difference**: 렌더했다고 해서 DOM이 새로 만들어지는 게 아니다. 직전 렌더 결과와 비교해 달라진 부분만 손댄다. 이게 없으면 매 렌더마다 화면 전체가 새로 만들어져, 입력 중이던 값이나 스크롤 위치 같은 브라우저가 들고 있는 상태가 전부 날아갈 것이다.

같은 흐름을 React 공식 규칙 문서는 조금 다른 각도에서, Commit 뒤에 한 단계를 더 붙여 서술한다.

> Rendering refers to calculating what the next version of your UI should look like.
> After rendering, React takes this new calculation and compares it to the calculation used to create the previous version of your UI.

"렌더링이란 UI의 다음 버전이 어떤 모습이어야 하는지를 계산하는 것을 가리킨다. 렌더가 끝나면 React는 이 새 계산 결과를 이전 버전 UI를 만들 때 쓴 계산 결과와 비교한다."

- **calculating what the next version ... should look like**: 위에서 "React가 컴포넌트를 호출하는 것"으로 정의한 렌더를 산출물 쪽에서 다시 말한 것이다. 호출은 수단이고, 그 수단으로 얻는 것이 "다음 화면의 설계도"다.
- **compares it to**: Commit이 "달라진 부분만" 고칠 수 있는 근거가 이 비교다. 위 문장의 `only ... if there’s a difference`에서 말하는 그 차이를 여기서 구한다.

> Then React commits just the minimum changes needed to the DOM (what your user actually sees) to apply the changes.
> Finally, Effects are flushed (meaning they are run until there are no more left).

"그런 다음 React는 변경을 반영하기 위해 꼭 필요한 최소한의 변경만 DOM(사용자가 실제로 보는 것)에 커밋한다. 마지막으로 Effect들이 flush된다 — 남은 것이 없을 때까지 실행된다는 뜻이다."

- **just the minimum changes needed**: 커밋의 정의를 "최소 변경"으로 못박는 표현.
- **flushed**: 쌓여 있던 것을 몰아서 비워내는 것. 여기서는 이번 커밋으로 예약된 Effect들을 실행해 대기열을 비우는 일을 말한다.
- **until there are no more left**: 한 바퀴 도는 게 아니라 소진될 때까지 반복한다. Effect가 실행되면서 state를 바꾸면 또 다른 렌더와 Effect가 생길 수 있기 때문이다.

Trigger·Render·Commit 세 단계에 이 마지막 단계를 얹으면 한 번의 화면 갱신 전체가 이렇게 이어진다.

```
Trigger → Render ──→ (이전 계산과 비교) ──→ Commit ──────→ Effects flush
(계기)    (다음 화면       (차이 구하기)        (최소 변경만      (남은 게 없을
          계산)                                 DOM에 반영)       때까지 실행)
```

---

## 종합

세 단계는 "누가 시작시키는가 → 무엇을 그릴지 계산 → 실제로 반영"으로 이어진다. Trigger는 렌더의 계기(최초 렌더 또는 state 갱신)를 만들고, Render는 컴포넌트 함수를 호출해 화면이 어때야 하는지를 알아내며, Commit에서 비로소 DOM이 바뀐다.

이 분리를 잡아두면 흔한 오해 두 개가 동시에 풀린다. 첫째, 렌더는 계산이라서 그 결과가 직전과 같으면 Commit에서 DOM은 한 글자도 바뀌지 않는다.

둘째, 렌더가 일어났다는 사실만으로 성능 문제라고 단정할 수 없다. 비싼 것은 상황에 따라 계산일 수도, DOM 조작일 수도 있고 둘은 다른 단계에 있다.

계산과 반영을 분리해두었기 때문에 React는 여러 갱신을 모아 한 번에 계산하고, 최종 결과와 현재 DOM의 차이만 골라 반영할 수 있다.

---

# React 컴포넌트는 어떤 경우에 렌더링되는가?

## 도입

React가 언제 컴포넌트를 다시 호출하는지는 딱 두 가지 계기로 정해져 있다. 반대로 말하면, 이 두 가지가 아닌 어떤 이유로도 렌더는 시작되지 않는다. 지역 변수를 바꾸거나 객체 속성을 직접 수정해도 화면이 안 바뀌는 이유가 여기 있다.

---

## 본문

> There are two reasons for a component to render:
>
> - It’s the component’s initial render.
> - The component’s (or one of its ancestors’) state has been updated.

"컴포넌트가 렌더되는 이유는 두 가지다: 최초 렌더이거나, 그 컴포넌트(또는 그 조상 중 하나)의 state가 갱신되었거나."

- **two reasons**: 두 개뿐이라는 게 요점이다. prop이 바뀌는 것 자체는 세 번째 이유가 아니다. prop이 바뀌려면 그것을 내려주는 위쪽 컴포넌트가 먼저 렌더되어야 하고, 그건 결국 조상의 state 갱신이다.
- **(or one of its ancestors’)**: 조상 중 하나라도 state가 바뀌면 그 아래로 렌더가 내려온다. 내 컴포넌트에 `useState`가 하나도 없어도, 심지어 내가 받는 prop이 전혀 달라지지 않아도 나는 다시 호출된다. 리렌더가 왜 이렇게 자주 일어나는지 추적할 때 가장 먼저 확인할 지점이다.

> When your app starts, you need to trigger the initial render.

"앱이 시작될 때는 최초 렌더를 직접 촉발해야 한다."

- **you need to trigger**: 최초 한 번은 개발자가 직접 시킨다. 브라우저에서는 `createRoot(...).render(<App />)` 호출이 그 역할이다. 이후의 렌더는 개발자가 아니라 state 갱신이 촉발한다.

> Once the component has been initially rendered, you can trigger further renders by updating its state with the set function.
> Updating your component’s state automatically queues a render.

"컴포넌트가 최초로 렌더된 뒤에는 set 함수로 state를 갱신하여 이후의 렌더를 촉발할 수 있다. 컴포넌트의 state를 갱신하면 자동으로 렌더가 대기열에 들어간다."

- **the set function**: `const [count, setCount] = useState(0)`의 `setCount`. state를 바꾸는 유일한 정식 통로이며, 동시에 렌더를 예약하는 통로이기도 하다. 그래서 값을 직접 대입해 바꾸면(`count = 1`) 화면이 안 바뀐다. 값도 안 바뀌지만, 렌더를 예약할 계기 자체가 없다.
- **automatically**: 개발자가 "다시 그려라"라고 따로 지시하지 않는다. state 갱신에 렌더 예약이 딸려 온다.
- **queues a render**: 이 표현이 핵심이다. set 함수를 부른 그 자리에서 컴포넌트가 즉시 다시 호출되는 게 아니라, 렌더가 **대기열에 예약**된다. 그래서 set 함수 바로 다음 줄에서 state 변수를 읽으면 아직 옛날 값이다.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // ← 0. 아직 렌더가 대기열에 들어갔을 뿐, 다시 호출되지 않았다
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`queues`가 아니라 즉시 실행이었다면, 한 이벤트 핸들러 안에서 set 함수를 세 번 부를 때 렌더도 세 번 일어났을 것이다. 대기열에 모아두기 때문에 React는 핸들러가 끝난 뒤 한 번만 렌더할 수 있다.

---

## 종합

렌더의 계기는 최초 렌더와 state 갱신, 둘뿐이다. 최초 렌더는 앱 시작 시 개발자가 한 번 촉발하고, 그 뒤로는 set 함수를 통한 state 갱신이 렌더를 예약한다.

"내 state가 안 바뀌었는데 왜 렌더되지?"라는 의문은 두 번째 이유의 괄호에서 풀린다. 조상의 state가 바뀌면 나도 렌더 대상이다. 그리고 "set 함수를 불렀는데 왜 값이 그대로지?"라는 의문은 `queues`에서 풀린다. 렌더는 예약이지 즉시 실행이 아니다.

한편 렌더된다는 것과 화면이 바뀐다는 것은 여전히 다른 이야기다. 조상 때문에 렌더되어 컴포넌트 함수가 다시 호출되더라도, 계산 결과가 직전과 같으면 DOM은 그대로 남는다.

---

# React는 렌더할 때 어느 컴포넌트부터 어디까지 호출하는가?

## 도입

렌더가 컴포넌트 함수를 호출하는 일이라면, 어느 함수부터 호출하고 어디서 멈추는지가 다음 질문이 된다. 시작점은 최초 렌더냐 이후 렌더냐에 따라 다르고, 끝나는 지점은 두 경우 모두 같다.

---

## 본문

> On initial render, React will call the root component.
> For subsequent renders, React will call the function component whose state update triggered the render.

"최초 렌더에서 React는 루트 컴포넌트를 호출한다. 이후의 렌더에서는 state 갱신이 렌더를 촉발한 그 함수 컴포넌트를 호출한다."

- **root component**: 트리의 맨 위 컴포넌트. `createRoot(...).render(<App />)`에 넘긴 그것이다. 최초에는 아무것도 그려져 있지 않으니 맨 위에서 시작할 수밖에 없다.
- **subsequent renders**: 최초 이후의 렌더. 시작점이 루트가 아니라, 바뀐 state를 가진 그 컴포넌트다. 이미 그려진 화면에서 달라질 수 있는 범위가 거기서부터이기 때문이다.
- **whose state update triggered the render**: 시작점을 특정하는 조건. 화면 어딘가에서 set 함수가 불렸다면, 그 set 함수가 속한 컴포넌트가 이번 렌더의 출발점이 된다.

> This process is recursive: if the updated component returns some other component, React will render that component next, and if that component also returns something, it will render that component next, and so on.

"이 과정은 재귀적이다. 갱신된 컴포넌트가 다른 컴포넌트를 반환하면 React는 그 컴포넌트를 다음으로 렌더하고, 그 컴포넌트가 또 무언가를 반환하면 그것을 다음으로 렌더하며, 이런 식으로 계속된다."

- **recursive**: 자기 자신과 같은 모양의 일을 아래로 반복한다는 뜻. "컴포넌트를 호출한다 → 반환된 JSX 안의 컴포넌트를 또 호출한다"가 같은 규칙의 반복이다.
- **returns some other component**: 반환한 JSX 안에 커스텀 컴포넌트(`<Image />`)가 들어 있는 경우. `<img>` 같은 내장 태그는 호출할 함수가 없으므로 여기서 더 내려가지 않는다.

```jsx
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

이 코드에서 `Gallery`가 루트라면 최초 렌더의 호출 순서는 이렇다.

```
Gallery()  호출
  └ 반환 JSX: <section> <h1> <Image/> <Image/> <Image/>
      ├ <section>, <h1> → 내장 태그, 호출할 함수 없음
      ├ Image()  호출 → <img> 반환 → 더 내려갈 컴포넌트 없음
      ├ Image()  호출 → <img> 반환
      └ Image()  호출 → <img> 반환
                          ↓
            중첩된 컴포넌트가 더 없음 → 렌더 종료
```

`<Image />`가 세 번 쓰였으므로 `Image` 함수도 세 번 호출된다. 같은 함수라도 JSX에 등장한 횟수만큼 각각 호출된다.

> The process will continue until there are no more nested components and React knows exactly what should be displayed on screen.

"이 과정은 더 이상 중첩된 컴포넌트가 없고 React가 화면에 무엇이 표시되어야 하는지 정확히 알게 될 때까지 계속된다."

- **no more nested components**: 종료 조건. 더 내려갈 커스텀 컴포넌트가 없으면 멈춘다.
- **knows exactly what should be displayed**: 이 시점에도 화면은 아직 그대로다. React가 얻은 것은 "이래야 한다"는 계산 결과이고, 그것을 실제로 반영하는 일은 다음 단계인 커밋의 몫이다.

---

## 종합

시작점은 최초 렌더냐 이후 렌더냐로 갈린다. 최초에는 루트에서, 이후에는 state가 바뀐 바로 그 컴포넌트에서 출발한다. 그리고 두 경우 모두 거기서부터 아래로 재귀적으로 내려가며, 더 이상 호출할 중첩 컴포넌트가 없을 때 멈춘다.

방향이 위가 아니라 아래라는 점이 실무에서 바로 쓰인다. 자식의 state를 바꿔도 부모는 다시 호출되지 않지만, 부모의 state를 바꾸면 그 아래 서브트리 전체가 호출 대상이 된다. 리렌더가 넓게 번진다면 state가 필요 이상으로 위쪽에 있다는 신호일 수 있다.

그리고 이 단계에서 벌어지는 일은 어디까지나 함수 호출이다. 세 번 호출된 `Image`가 세 개의 `<img>` DOM 노드를 만들지는 아직 정해지지 않았다. 그건 커밋 단계에서 직전 결과와 비교한 뒤에 결정된다.

---

# React는 렌더 결과를 DOM에 어떻게 반영하는가?

## 도입

렌더 단계에서 React는 컴포넌트를 호출해 화면이 어때야 하는지 알아낸다. 다만 그 계산 결과는 곧바로 화면에 반영되지 않고, 다음 단계인 커밋에서 처음 쓰인다.

커밋에서 하는 일은 최초 렌더와 리렌더가 서로 다르다.

---

## 본문

> During the initial render, React will create the DOM nodes for `<section>`, `<h1>`, and three `<img>` tags.
> During a re-render, React will calculate which of their properties, if any, have changed since the previous render.
> It won’t do anything with that information until the next step, the commit phase.

"최초 렌더에서 React는 `<section>`, `<h1>`, 그리고 세 개의 `<img>` 태그에 대한 DOM 노드를 만든다. 리렌더에서는 그 속성 중 어떤 것이 직전 렌더 이후로 바뀌었는지를(바뀐 게 있다면) 계산한다. 그리고 다음 단계인 커밋 단계 전까지는 그 정보로 아무것도 하지 않는다."

- **create the DOM nodes**: 최초에는 비교할 직전 결과가 없으니 필요한 노드를 전부 만든다.
- **calculate which of their properties ... have changed**: 리렌더에서 하는 일은 만들기가 아니라 비교다. 노드를 통째로 다시 만드는 게 아니라 어떤 속성이 달라졌는지를 따진다.
- **if any**: 바뀐 게 하나도 없을 수 있다는 단서. 리렌더가 곧 DOM 변경은 아니라는 말이 여기 들어 있다.
- **won’t do anything with that information**: 계산해두고 쓰지는 않는다. 렌더 단계는 DOM을 절대 건드리지 않는다는 뜻이며, 이 문장이 렌더와 커밋을 가르는 경계선이다.
- **until the next step, the commit phase**: 계산 결과를 실제로 쓰는 유일한 지점이 커밋 단계다.

> After rendering (calling) your components, React will modify the DOM.
>
> - For the initial render, React will use the appendChild() DOM API to put all the DOM nodes it has created on screen.
> - For re-renders, React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.

"컴포넌트를 렌더(호출)한 뒤 React는 DOM을 수정한다. 최초 렌더에서는 `appendChild()` DOM API를 사용해 만들어둔 모든 DOM 노드를 화면에 올린다. 리렌더에서는 (렌더 중에 계산해둔!) 최소한의 필요한 조작만 적용해 DOM이 최신 렌더 결과와 일치하도록 만든다."

- **After rendering (calling)**: 원문이 굳이 괄호로 "호출"을 덧붙인다. 렌더가 그리기가 아니라 함수 호출임을 다시 못박는 장치다.
- **appendChild()**: 우리가 평소에 쓰는 그 DOM API다. React가 특별한 마법을 쓰는 게 아니라 브라우저의 표준 DOM API로 노드를 붙인다.
- **minimal necessary operations**: 최소한의 필요한 조작. 텍스트 하나만 달라졌으면 그 텍스트만 바꾼다. 부모 노드를 지우고 다시 만드는 식이 아니다.
- **(calculated while rendering!)**: 느낌표까지 붙은 강조다. 이 최소 조작 목록은 커밋 시점에 새로 알아내는 게 아니라 이미 렌더 단계에서 계산해둔 것이다. 렌더 단계가 "아무것도 안 한다"는 뜻이 아니라 "계산은 하되 반영만 미룬다"는 뜻임을 확인해준다.
- **match the latest rendering output**: 목표는 DOM을 최신 렌더 결과와 일치시키는 것이다. 일치시키는 데 필요 없는 조작은 하지 않는다.

```
[렌더 단계]                        [커밋 단계]
컴포넌트 함수 호출                 최초 렌더 → appendChild()로 노드 전부 붙임
   ↓                               리렌더  → 계산해둔 최소 조작만 적용
무엇이 달라졌는지 계산  ──────────→
(DOM은 손대지 않음)     계산 결과를 여기서 처음 사용
```

---

## 종합

DOM에 손을 대는 단계는 커밋 하나뿐이고, 렌더 단계는 무엇을 손댈지 계산해두는 데서 멈춘다. 최초 렌더에서는 만들어둔 노드를 `appendChild()`로 붙이고, 리렌더에서는 렌더 중에 계산해둔 최소한의 조작만 적용한다.

"리렌더되면 DOM이 새로 만들어진다"는 오해가 자주 생기지만, 원문 어디에도 그런 말은 없다. 리렌더에서 React가 하는 일은 속성 비교이고, 달라진 게 없으면 그 노드는 건드리지 않는다.

이 구조가 없다면, 즉 매 렌더마다 노드를 새로 만들어 갈아 끼운다면 DOM 노드가 들고 있던 브라우저 상태가 매번 초기화된다. 입력 중인 값, 포커스, 스크롤 위치, 진행 중인 CSS 전환이 그런 것들이다.

최소 조작 원칙은 성능만이 아니라 사용자가 화면에 남겨둔 상태를 지키기 위한 것이기도 하다.

---

# 매초 리렌더되는 컴포넌트 안의 input에 글자를 입력해두면 그 글자는 리렌더 때 어떻게 되는가?

## 도입

부모가 매초 다른 시각을 prop으로 내려보내면 자식 컴포넌트는 1초마다 리렌더된다. 그 안에 `<input>`이 있고 사용자가 글자를 쳐 두었다면, 그 글자는 1초 뒤에도 그대로 남아 있다.

리렌더와 DOM 재생성이 서로 다른 일이라는 사실이 눈에 보이는 형태로 드러나는 사례다.

---

## 본문

```jsx
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

부모가 매초 새로운 `time`을 내려주므로 `Clock` 함수는 1초에 한 번 다시 호출된다. `<input>`에는 `value`도 `onChange`도 없어서 그 안의 글자는 React가 아니라 브라우저의 DOM 노드가 들고 있다. 그러니 그 DOM 노드가 새로 만들어지면 글자는 사라진다.

> React only changes the DOM nodes if there’s a difference between renders.

"React는 렌더 사이에 차이가 있을 때만 DOM 노드를 변경한다."

- **only ... if**: 조건이 성립할 때에 한해서만. 리렌더가 일어났다는 사실 자체는 DOM 변경의 근거가 되지 않는다.
- **a difference between renders**: 이번 렌더 결과와 직전 렌더 결과의 차이. 비교 대상은 실제 DOM과 화면이 아니라 렌더 결과끼리다.

> This works because during this last step, React only updates the content of `<h1>` with the new time.
> It sees that the `<input>` appears in the JSX in the same place as last time, so React doesn’t touch the `<input>`—or its value!

"이것이 동작하는 이유는 마지막 단계에서 React가 `<h1>`의 내용만 새 시각으로 갱신하기 때문이다. React는 `<input>`이 직전과 같은 자리에 JSX에 나타난다는 것을 보고, `<input>`을 건드리지 않는다. 그 값도 마찬가지다!"

- **this last step**: 커밋 단계. 실제 DOM 변경이 일어나는 그 지점이다.
- **only updates the content of `<h1>`**: 달라진 것은 `time`뿐이므로 바뀌는 것도 `<h1>`의 텍스트뿐이다. 같은 렌더 결과 안에 있던 형제 `<input>`은 갱신 대상에서 빠진다.
- **appears in the JSX in the same place as last time**: 판단 기준이 여기 있다. "직전 렌더의 JSX에서와 같은 자리"에 있으면 React는 그것을 같은 노드로 본다. 화면상의 픽셀 좌표가 아니라 JSX 구조에서의 자리다.
- **doesn’t touch**: 손대지 않는다. 지우고 다시 만들지도, 속성을 다시 쓰지도 않는다. 이미 브라우저에 있는 그 노드가 그대로 남는다.
- **or its value**: 노드를 안 건드렸으니 그 노드가 들고 있던 입력값도 그대로다. 사용자가 친 글자가 살아남는 이유다.

```
1초 전 렌더 결과        이번 렌더 결과         커밋에서 하는 일
─────────────────      ─────────────────      ─────────────────────
<h1>10:00:01</h1>  vs  <h1>10:00:02</h1>  →   텍스트만 교체
<input />          vs  <input />          →   같은 자리, 차이 없음 → 손대지 않음
                                                     ↓
                                              사용자가 친 글자 유지
```

주의할 점은 "같은 자리"의 기준이 JSX 구조라는 것이다. 조건에 따라 `<input>`을 다른 부모 안으로 옮기거나 앞뒤로 다른 요소가 끼어들어 자리가 달라지면, React는 그것을 다른 노드로 판단해 새로 만들고 입력값은 사라진다.

> React does not touch the DOM if the rendering result is the same as last time

"렌더 결과가 직전과 같으면 React는 DOM을 건드리지 않는다."

- **does not touch the DOM**: 컴포넌트 함수는 다시 호출되었어도 DOM 조작은 0건일 수 있다. 렌더 횟수와 DOM 변경 횟수는 별개다.

---

## 종합

`Clock`은 1초마다 다시 호출되지만, 그중 실제로 DOM에 반영되는 것은 `<h1>`의 텍스트 한 곳뿐이다. `<input>`은 직전 렌더의 JSX와 같은 자리에 그대로 있으므로 React가 손대지 않고, 그래서 그 안의 글자도 살아남는다.

이 사례가 알려주는 것은 리렌더와 DOM 재생성이 다른 일이라는 점이다. 컴포넌트 함수가 몇 번 호출되었는지와 브라우저의 DOM이 몇 번 바뀌었는지는 따로 세야 한다.

동시에 그 판단이 무엇을 근거로 하는지도 드러난다. React는 "같은 자리에 같은 것이 있는가"를 JSX 구조로 판단한다. 그래서 입력값이나 포커스가 예기치 않게 날아간다면, 원인은 대개 리렌더가 잦아서가 아니라 그 요소가 JSX에서 자리를 옮겼기 때문이다.
