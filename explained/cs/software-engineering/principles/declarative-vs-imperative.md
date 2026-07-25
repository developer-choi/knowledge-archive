# React가 선언적(declarative)이라는 것은 무엇을 뜻하는가?

## 본문

> React is declarative: you tell React what to render, and React will figure out how best to display it to your user.

"React는 선언적이다 — 개발자는 React에게 무엇을 렌더할지 말하고, React가 그것을 사용자에게 어떻게 보여줄지를 알아서 정한다."

- **declarative**: 원하는 결과를 진술하고 그것을 이루는 절차는 맡기는 방식.
- **what to render**: 개발자의 몫. 지금 상태라면 화면에 무엇이 있어야 하는지를 JSX로 진술한다.
- **how best to display**: React의 몫. 어떤 DOM 노드를 만들고 지우고 고칠지, 어떤 순서로 반영할지를 정한다. `best`가 붙은 것은 여러 갱신을 모아 처리하거나 급한 것을 먼저 반영하는 등의 판단까지 React가 한다는 뜻이다.

> React provides a declarative way to manipulate the UI.
> Instead of manipulating individual pieces of the UI directly, you describe the different states that your component can be in, and switch between them in response to the user input.
> This is similar to how designers think about the UI.

"React는 UI를 다루는 선언적인 방법을 제공한다. UI 조각을 하나하나 직접 조작하는 대신, 컴포넌트가 놓일 수 있는 여러 상태를 서술해두고 사용자 입력에 반응해 그 상태들 사이를 오간다. 이것은 디자이너가 UI를 생각하는 방식과 비슷하다."

- **individual pieces of the UI**: 스피너 하나, 버튼 하나, 오류 문구 하나 같은 개별 화면 조각. 명령형에서는 이 조각들을 각각 붙잡고 고친다.
- **describe the different states**: 화면이 놓일 수 있는 상태를 미리 나열하는 것. 폼이라면 빈 상태·입력 중·제출 중·성공·오류처럼 목록으로 적힌다.
- **switch between them**: 개발자가 하는 일은 조각을 고치는 게 아니라 나열해둔 상태 중 어느 것으로 갈지 고르는 일뿐이다.
- **how designers think about the UI**: 디자이너는 시안을 만들 때 "이 버튼을 비활성화하는 절차"를 그리지 않고 빈 화면·로딩 화면·성공 화면을 각각 한 장씩 그린다. 상태별로 화면을 그려두고 그 사이를 오간다는 점에서 사고 방식이 같다.

> In React, you don't directly manipulate the UI—meaning you don't enable, disable, show, or hide components directly.
> Instead, you declare what you want to show, and React figures out how to update the UI.

"React에서는 UI를 직접 조작하지 않는다 — 컴포넌트를 직접 활성화하거나 비활성화하거나 보이거나 감추지 않는다는 뜻이다. 대신 무엇을 보여줄지 선언하고, UI를 어떻게 갱신할지는 React가 알아낸다."

- **enable, disable, show, or hide**: 순수 DOM 조작에서 손으로 부르던 네 가지 동작. React를 쓰면 이 호출들이 코드에서 사라지고 `disabled={...}`·`{조건 && <X />}` 같은 진술로 바뀐다.
- **declare what you want to show**: 결과만 적는다. "버튼을 비활성화하라"가 아니라 "제출 중일 때 이 버튼은 비활성 상태다"라고 적는 것이다.
- **figures out how**: 방법(how)의 소유권이 개발자에서 React로 넘어간다는 것이 선언형의 핵심이다. 이게 없으면 화면 조각마다 갱신 누락을 개발자가 직접 관리해야 한다.

> Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).

"선언형 프로그래밍이란 UI를 시시콜콜 관리하는(명령형) 대신 각 visual state마다 UI를 서술하는 것을 뜻한다."

- **visual state**: 화면이 눈에 보이는 모습 기준으로 구분한 상태. 빈 상태, 입력 중, 제출 중, 성공, 오류 각각이 하나의 visual state다.
- **micromanaging**: 조각 하나하나의 표시 여부와 활성 여부를 개발자가 일일이 챙기는 것. 이 단어가 부정적으로 쓰인 이유는, 챙길 조각이 늘어날수록 빠뜨린 하나가 곧 버그가 되기 때문이다.

```
명령형                              선언형 (React)
──────────────────────             ──────────────────────
show(spinner)                      {isLoading && <Spinner />}
hide(errorMessage)                 {error && <Error msg={error} />}
disable(button)                    <button disabled={isLoading}>
  ↑ 화면을 바꾸는 절차를 나열         ↑ 지금 상태에서의 화면 모습을 진술
```

```
visual state를 나열하고 그 사이를 오가는 그림

  빈 상태 ──입력──▶ 입력 중 ──제출──▶ 제출 중 ──성공──▶ 성공
                     ▲                    │
                     └──────실패──────────┘ (오류 문구 표시)

  개발자가 적는 것: 각 칸의 화면 모습 + 어떤 입력에 어느 칸으로 가는지
  React가 하는 것 : 칸이 바뀔 때 DOM을 어떻게 고칠지
```

---

## 종합

선언형이라는 말은 개발자가 DOM 조작 절차에서 손을 뗀다는 뜻이다. `enable`·`disable`·`show`·`hide`를 직접 부르는 일이 없어지고, 대신 화면이 놓일 수 있는 상태를 나열한 뒤 "이 상태에서는 이런 화면"만 적는다. 화면을 어떤 순서로 고칠지는 React가 정한다.

상태를 나열해두고 그 사이를 오간다는 구조는 디자이너의 작업 방식과 겹친다. 시안이 빈 화면·로딩 화면·성공 화면으로 나뉘어 오듯, 코드도 같은 단위로 쪼개진다. 그래서 시안과 코드가 같은 칸을 공유하게 되고, "이 상태 시안이 빠졌다"가 곧 "이 분기가 빠졌다"로 대응된다.

이 분담이 뒤에 이어지는 이야기의 출발점이 된다. 절차를 React가 쥐고 있으므로 렌더를 미루거나 다시 실행하는 최적화가 가능해지고, 그 대가로 개발자는 렌더 중에 화면을 직접 건드리지 않기로 약속한다.

---

# 명령형(imperative)으로 UI를 만든다는 것은 무엇을 하는 것인가?

## 본문

> In imperative programming, the above corresponds directly to how you implement interaction.
> You have to write the exact instructions to manipulate the UI depending on what just happened.

"명령형 프로그래밍에서는 위 서술이 상호작용을 구현하는 방식에 그대로 대응한다. 방금 무슨 일이 일어났는지에 따라 UI를 조작하는 정확한 지시를 직접 작성해야 한다."

- **the above corresponds directly**: 말로 적은 시나리오가 곧 구현 코드의 모양이 된다는 뜻이다. "버튼을 비활성화한다"라는 문장이 `disable(button)` 한 줄로 그대로 옮겨진다.
- **exact instructions**: 어림잡은 결과 진술이 아니라 하나도 빠뜨리면 안 되는 정확한 명령 목록. 켜는 명령을 적었으면 끄는 명령도 개발자가 직접 적어야 한다.
- **depending on what just happened**: 지시가 사건(제출, 성공, 실패, 입력 변경)마다 따로 필요하다. 사건이 늘어나면 지시 목록도 함께 늘어난다.

이 방식의 실제 모습은 다음 질문에 실린 순수 DOM 구현 코드에서 볼 수 있다. 제출 순간에는 `disable(textarea)`로 입력창을 잠그고 `show(loadingMessage)`로 로딩 표시를 띄우고 `hide(errorMessage)`로 이전 오류를 지운다. 화면 조각마다 켜고 끄는 호출이 하나씩 손으로 적혀 있다는 것이 이 코드의 특징이다.

> It's called imperative because you have to "command" each element, from the spinner to the button, telling the computer how to update the UI.

"이것이 명령형이라 불리는 이유는 스피너부터 버튼까지 각 요소에게 하나하나 '명령'해야 하기 때문이다 — UI를 어떻게 갱신할지를 컴퓨터에게 일러주는 것이다."

- **command**: 명령형(imperative)이라는 이름의 유래. 영어 문법에서 imperative는 명령문을 가리키는 말이고, `disable(button)`·`show(spinner)`처럼 동사로 시작하는 호출이 정확히 명령문의 모양이다.
- **each element, from the spinner to the button**: 명령의 대상이 화면 전체가 아니라 개별 요소라는 점. 요소가 여섯 개면 챙길 명령도 여섯 갈래로 갈라진다.
- **how to update the UI**: 컴퓨터에게 건네는 것이 결과가 아니라 방법이라는 점이 선언형과 갈리는 지점이다. 선언형이 "이 상태의 화면은 이렇다"를 넘긴다면, 명령형은 "이 요소를 이렇게 바꿔라"를 넘긴다.

```
같은 시나리오, 두 가지 전달 방식

명령형: 요소마다 방법을 지시
  제출됨 → disable(textarea) → disable(button) → show(loadingMessage) → hide(errorMessage)
  성공됨 → show(successMessage) → hide(form) → hide(loadingMessage) → enable(...)
           ↑ 켠 것을 끄는 명령까지 개발자가 짝을 맞춰 적어야 함

선언형: 상태를 지정하고 결과를 진술
  제출됨 → status = 'submitting'
  성공됨 → status = 'success'
           ↑ 각 status에서의 화면 모습은 따로 한 번만 적어둠
```

---

## 종합

명령형으로 UI를 만든다는 것은, 말로 적은 동작 시나리오를 요소별 호출 목록으로 옮겨 적는 일이다. "제출하면 버튼이 잠긴다"가 `disable(button)`이 되고, "성공하면 폼이 사라진다"가 `hide(form)`이 된다. 시나리오와 코드가 한 줄씩 대응하기 때문에 처음 읽기에는 오히려 직관적이다.

문제는 명령의 짝을 개발자가 전부 기억해야 한다는 데 있다. 켠 것은 끄고, 감춘 것은 다시 보이고, 새 사건이 생기면 기존 사건들의 명령 목록까지 다시 훑어야 한다. 이게 없으면 어떻게 되는지는 눈에 잘 보인다 — 성공 경로에서 `hide(loadingMessage)`를 빠뜨리면 스피너가 화면에 영원히 남는다.

이름이 "명령형"인 이유도 여기 있다. 컴퓨터에게 넘기는 것이 도달하고 싶은 결과가 아니라 거기까지 가는 방법이고, 그 방법을 스피너부터 버튼까지 요소 하나하나에 대고 말해야 하기 때문이다.
