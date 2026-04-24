---
tags: [react, concept]
---
# Questions
- React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?
- imperative 방식으로 UI를 조작하는 코드는 폼 하나에서는 잘 작동한다. 여러 폼이 섞인 복잡한 시스템으로 규모가 커지면 어떤 문제가 생기는가?
- React에서 imperative 폼을 declarative하게 재구현할 때, `useState` 코드나 이벤트 핸들러를 짜기 전에 먼저 해야 하는 일은 무엇이며 왜 그래야 하는가?
- React 컴포넌트에서 visual states를 `useState`로 메모리에 표현할 때 따라야 하는 핵심 원칙은 무엇이며, 왜 그런가?
- 두 boolean state가 동시에 `true`가 될 수 없는 경우가 있다면, 이 설계에 어떤 문제가 있고 어떻게 리팩토링하는가? (예: `isTyping`과 `isSubmitting`)
- `isEmpty`처럼 다른 state(`answer`)에서 길이만 체크하면 얻을 수 있는 정보를 별도 boolean state로 두면 어떤 위험이 있고 어떻게 해결하는가?
- `isError` 같은 boolean state를 다른 state의 역(inverse)으로 대체할 수 있는 경우는 어떤 경우이며 어떻게 대체하는가?
- React declarative 버전의 폼은 imperative 버전보다 코드 줄 수가 더 길다. 그럼에도 이 코드가 "less fragile"하다고 불리는 이유는 무엇이며, 새로운 visual state를 추가하거나 기존 state의 표시 방식을 바꿀 때 imperative와 어떻게 다른가?
- [TODO] state 구조를 설계할 때 어떤 원칙들을 따라야 하는가? (Choosing the State Structure)
- [TODO] 여러 컴포넌트가 같은 state를 공유해야 할 때 어떻게 구조화하는가? (Sharing State Between Components / lifting state up)
- [TODO] React는 컴포넌트 트리에서 state를 언제 유지하고 언제 리셋하는가? `key` prop의 역할은? (Preserving and Resetting State)
- [TODO] `useState` 대신 `useReducer`로 state 로직을 분리해야 하는 시점은? 전환 방법은? (Extracting State Logic into a Reducer)
- [TODO] Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는? (Passing Data Deeply with Context)
- [TODO] reducer와 context를 함께 쓰는 패턴은 어떻게 구성되며 어떤 규모에서 유용한가? (Scaling Up with Reducer and Context)

---

# Answers

## React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?

### Official Answer
With React, you won't modify the UI from code directly.
For example, you won't write commands like "disable the button", "enable the button", "show the success message", etc.
Instead, you will describe the UI you want to see for the different visual states of your component ("initial state", "typing state", "success state"), and then trigger the state changes in response to user input.
This is similar to how designers think about UI.

> #### Key Terms:
> - **modify the UI from code directly**: DOM 노드를 직접 조작하는 것 (`element.style.display = 'none'` 같은)
> - **commands**: "이걸 해라"라고 지시하는 명령문
> - **describe**: 원하는 UI의 모습을 묘사
> - **visual states**: 컴포넌트가 취할 수 있는 화면 상태들 (initial / typing / success 등)
> - **trigger**: state 변경을 유발
> - **in response to**: ~에 반응하여

> #### Official Annotation:
> In React, you don't directly manipulate the UI—meaning you don't enable, disable, show, or hide components directly.
> Instead, you declare what you want to show, and React figures out how to update the UI.
> Think of getting into a taxi and telling the driver where you want to go instead of telling them exactly where to turn.
> It's the driver's job to get you there, and they might even know some shortcuts you haven't considered!
>
> 출처: https://react.dev/learn/reacting-to-input-with-state

### Reference
- https://react.dev/learn/managing-state
- https://react.dev/learn/reacting-to-input-with-state

---

## imperative 방식으로 UI를 조작하는 코드는 폼 하나에서는 잘 작동한다. 여러 폼이 섞인 복잡한 시스템으로 규모가 커지면 어떤 문제가 생기는가?

### Official Answer
Manipulating the UI imperatively works well enough for isolated examples, but it gets exponentially more difficult to manage in more complex systems.
Imagine updating a page full of different forms like this one.
Adding a new UI element or a new interaction would require carefully checking all existing code to make sure you haven't introduced a bug (for example, forgetting to show or hide something).

> #### Key Terms:
> - **isolated examples**: 폼 하나 같은 고립된 작은 예시
> - **exponentially more difficult**: 요소 × 이벤트 × 상태 조합이 곱셈으로 늘어나 지수적으로 어려워진다
> - **complex systems**: 여러 UI 요소·상호작용이 엮인 큰 시스템
> - **carefully checking all existing code**: 새 요소 추가 시 기존 코드 전체를 일일이 재검토
> - **introduced a bug**: 기존 흐름을 깨서 버그를 심음
> - **forgetting to show or hide something**: `show` 호출 후 짝이 되는 `hide`를 빠뜨리는 전형적 imperative 버그

> #### Official Annotation:
> 위 문단이 가리키는 imperative 폼 예시 — React 없이 브라우저 DOM만으로 구현한 버전.
>
> ```js
> async function handleFormSubmit(e) {
>   e.preventDefault();
>   disable(textarea);
>   disable(button);
>   show(loadingMessage);
>   hide(errorMessage);
>   try {
>     await submitForm(textarea.value);
>     show(successMessage);
>     hide(form);
>   } catch (err) {
>     show(errorMessage);
>     errorMessage.textContent = err.message;
>   } finally {
>     hide(loadingMessage);
>     enable(textarea);
>     enable(button);
>   }
> }
>
> function handleTextareaChange() {
>   if (textarea.value.length === 0) {
>     disable(button);
>   } else {
>     enable(button);
>   }
> }
>
> function hide(el) {
>   el.style.display = 'none';
> }
>
> function show(el) {
>   el.style.display = '';
> }
>
> function enable(el) {
>   el.disabled = false;
> }
>
> function disable(el) {
>   el.disabled = true;
> }
>
> function submitForm(answer) {
>   // Pretend it's hitting the network.
>   return new Promise((resolve, reject) => {
>     setTimeout(() => {
>       if (answer.toLowerCase() === 'istanbul') {
>         resolve();
>       } else {
>         reject(new Error('Good guess but a wrong answer. Try again!'));
>       }
>     }, 1500);
>   });
> }
>
> let form = document.getElementById('form');
> let textarea = document.getElementById('textarea');
> let button = document.getElementById('button');
> let loadingMessage = document.getElementById('loading');
> let errorMessage = document.getElementById('error');
> let successMessage = document.getElementById('success');
> form.onsubmit = handleFormSubmit;
> textarea.oninput = handleTextareaChange;
> ```

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## React에서 imperative 폼을 declarative하게 재구현할 때, `useState` 코드나 이벤트 핸들러를 짜기 전에 먼저 해야 하는 일은 무엇이며 왜 그래야 하는가?

### Official Answer
First, you need to visualize all the different "states" of the UI the user might see.
Just like a designer, you'll want to "mock up" or create "mocks" for the different states before you add logic.

> #### Key Terms:
> - **visualize**: UI가 보일 모든 모습을 눈에 보이는 형태(종이, 목업, 머릿속 이미지)로 그리기
> - **states**: UI가 취할 수 있는 화면들 (Empty, Typing, Submitting, Success, Error 등)
> - **mock up / mocks**: 로직 없이 시각만 담은 결과물. prop 하나(`status`)로 상태를 외부 주입하여 고정 렌더링
> - **before you add logic**: 이벤트 핸들러·`useState` 붙이기 전에 수행

> #### Official Annotation:
> In computer science, you may hear about a "state machine" being in one of several "states".
> If you work with a designer, you may have seen mockups for different "visual states".
> React stands at the intersection of design and computer science, so both of these ideas are sources of inspiration.

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## React 컴포넌트에서 visual states를 `useState`로 메모리에 표현할 때 따라야 하는 핵심 원칙은 무엇이며, 왜 그런가?

### Official Answer
Simplicity is key: each piece of state is a "moving piece", and you want as few "moving pieces" as possible.
More complexity leads to more bugs!

> #### Key Terms:
> - **Simplicity is key**: state 설계의 제1원칙 — 단순함이 핵심
> - **moving piece**: 기계 부품 비유. state 변수 하나하나가 움직이는 부품이며, 서로 어긋날 수 있는 지점
> - **as few moving pieces as possible**: 동기화·일관성 관리 대상이 곱셈으로 늘어나므로 개수 자체를 최소화
> - **More complexity leads to more bugs**: state가 N개면 조합이 2^N으로 증가. 복잡도 자체가 버그 표면

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## 두 boolean state가 동시에 `true`가 될 수 없는 경우가 있다면, 이 설계에 어떤 문제가 있고 어떻게 리팩토링하는가? (예: `isTyping`과 `isSubmitting`)

### Official Answer
Does this state cause a paradox?
For example, `isTyping` and `isSubmitting` can't both be `true`.
A paradox usually means that the state is not constrained enough.
There are four possible combinations of two booleans, but only three correspond to valid states.
To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`.

> #### Key Terms:
> - **paradox**: 논리적으로 동시에 성립할 수 없는 state 조합이 표현 가능한 상황
> - **not constrained enough**: state 타입이 invalid 조합을 허용할 만큼 느슨함
> - **four possible combinations / only three correspond to valid states**: 두 boolean = 4조합, 유효는 3개. 남는 1개가 "impossible" state
> - **impossible state**: 현실 UI에 대응하지 않지만 메모리에는 표현 가능한 조합
> - **combine these into a `status`**: boolean들을 enum(union 문자열) 하나로 합쳐 유효 값만 취할 수 있게 제약

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## `isEmpty`처럼 다른 state(`answer`)에서 길이만 체크하면 얻을 수 있는 정보를 별도 boolean state로 두면 어떤 위험이 있고 어떻게 해결하는가?

### Official Answer
Is the same information available in another state variable already?
Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time.
By making them separate state variables, you risk them going out of sync and causing bugs.
Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.

> #### Key Terms:
> - **same information available in another state variable**: 이미 다른 state에서 도출 가능한 정보
> - **going out of sync**: 짝으로 갱신해야 하는 state들이 한쪽만 갱신되어 불일치
> - **remove `isEmpty` and instead check `answer.length === 0`**: state 변수를 제거하고 매 렌더 시 파생 표현식으로 계산. source of truth는 `answer` 하나

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## `isError` 같은 boolean state를 다른 state의 역(inverse)으로 대체할 수 있는 경우는 어떤 경우이며 어떻게 대체하는가?

### Official Answer
Can you get the same information from the inverse of another state variable?
`isError` is not needed because you can check `error !== null` instead.

> #### Key Terms:
> - **inverse of another state variable**: 다른 state의 null 체크·존재 여부 등으로 도출 가능한 정보
> - **`error !== null`**: `error` 자체가 에러 내용과 존재 유무를 모두 담으므로 `isError`는 파생 표현식으로 충분

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## React declarative 버전의 폼은 imperative 버전보다 코드 줄 수가 더 길다. 그럼에도 이 코드가 "less fragile"하다고 불리는 이유는 무엇이며, 새로운 visual state를 추가하거나 기존 state의 표시 방식을 바꿀 때 imperative와 어떻게 다른가?

### Official Answer
Although this code is longer than the original imperative example, it is much less fragile.
Expressing all interactions as state changes lets you later introduce new visual states without breaking existing ones.
It also lets you change what should be displayed in each state without changing the logic of the interaction itself.

> #### Key Terms:
> - **fragile**: 변경을 가했을 때 쉽게 깨지는 성격. 한 곳 고쳤더니 엉뚱한 다른 곳이 버그로 드러나거나, 새 기능 추가 시 기존 동작이 무너지는 코드
> - **much less fragile**: 줄 수가 아니라 변경 충격에 버티는 정도가 핵심 지표. declarative의 진짜 이익
> - **Expressing all interactions as state changes**: 모든 상호작용을 DOM 조작이 아닌 `setState` 호출(state 전환)로만 표현
> - **introduce new visual states without breaking existing ones**: `status` enum에 값 추가 + 해당 분기 JSX만 추가하면 됨. 기존 state 관련 코드 0줄 수정
> - **change what should be displayed in each state without changing the logic of the interaction itself**: 표시(JSX)와 상호작용 로직(setter)이 분리되어 JSX만 고쳐도 핸들러는 그대로. 역도 성립

> #### Official Annotation:
> 비교 대상 — 같은 City Quiz 폼의 **imperative 버전** (React 없이 browser DOM만 사용).
> 이벤트 핸들러 안에 `disable` / `show` / `hide` 명령이 직접 박혀 있다.
>
> ```js
> async function handleFormSubmit(e) {
>   e.preventDefault();
>   disable(textarea);
>   disable(button);
>   show(loadingMessage);
>   hide(errorMessage);
>   try {
>     await submitForm(textarea.value);
>     show(successMessage);
>     hide(form);
>   } catch (err) {
>     show(errorMessage);
>     errorMessage.textContent = err.message;
>   } finally {
>     hide(loadingMessage);
>     enable(textarea);
>     enable(button);
>   }
> }
>
> function handleTextareaChange() {
>   if (textarea.value.length === 0) {
>     disable(button);
>   } else {
>     enable(button);
>   }
> }
>
> function hide(el) { el.style.display = 'none'; }
> function show(el) { el.style.display = ''; }
> function enable(el) { el.disabled = false; }
> function disable(el) { el.disabled = true; }
> ```

> #### Official Annotation:
> 비교 대상 — 같은 폼의 **declarative 버전** (React 5단계로 재구현).
> 이벤트 핸들러는 `setStatus(...)` 호출만 하고, "무엇을 보여줄지"는 JSX 조건부 렌더링이 담당한다.
>
> ```jsx
> import { useState } from 'react';
>
> export default function Form() {
>   const [answer, setAnswer] = useState('');
>   const [error, setError] = useState(null);
>   const [status, setStatus] = useState('typing');
>
>   if (status === 'success') {
>     return <h1>That's right!</h1>
>   }
>
>   async function handleSubmit(e) {
>     e.preventDefault();
>     setStatus('submitting');
>     try {
>       await submitForm(answer);
>       setStatus('success');
>     } catch (err) {
>       setStatus('typing');
>       setError(err);
>     }
>   }
>
>   function handleTextareaChange(e) {
>     setAnswer(e.target.value);
>   }
>
>   return (
>     <>
>       <h2>City quiz</h2>
>       <form onSubmit={handleSubmit}>
>         <textarea
>           value={answer}
>           onChange={handleTextareaChange}
>           disabled={status === 'submitting'}
>         />
>         <button disabled={answer.length === 0 || status === 'submitting'}>
>           Submit
>         </button>
>         {error !== null && <p className="Error">{error.message}</p>}
>       </form>
>     </>
>   );
> }
> ```

> #### AI Annotation:
> imperative 구조는 이벤트 핸들러 안에 "뭘 보여줄지"와 "언제 보여줄지"가 한 덩어리로 박혀 있다 (`disable(button); show(spinner); hide(errorMessage);` 연속 호출).
> declarative 구조는 두 레이어가 분리된다 — 이벤트 핸들러는 `setStatus('submitting')`만, JSX는 `{status === 'submitting' && <Spinner />}`만 담당.
> 이 분리 덕분에 한쪽 수정이 다른 쪽으로 번지지 않는다 ("change isolation").
>
> 예: 기존 `typing → submitting → success/error` 플로우에 `verifying` 단계를 중간에 삽입하는 요구가 왔을 때,
> - imperative: `handleFormSubmit` 내부 명령 순서 재계산, HTML에 요소 추가, finally에 `hide(verifyingMessage)` 추가, 빠뜨리면 UI가 이상한 상태로 고정 — 수정 포인트 7개 이상이 코드 곳곳에 흩어짐.
> - declarative: `status` enum에 `'verifying'` 추가, JSX에 조건부 한 줄 추가, `handleSubmit`에 `setStatus('verifying')` 한 줄 추가. 기존 다른 상태 로직은 건드리지 않음.
>
> 초기 코드 길이는 늘어나도 변경 비용이 선형에 가깝게 유지되는 게 "less fragile"의 실무적 의미.

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## [TODO] state 구조를 설계할 때 어떤 원칙들을 따라야 하는가? (Choosing the State Structure)

### Official Answer

### Reference
- https://react.dev/learn/choosing-the-state-structure

---

## [TODO] 여러 컴포넌트가 같은 state를 공유해야 할 때 어떻게 구조화하는가? (Sharing State Between Components / lifting state up)

### Official Answer

### Reference
- https://react.dev/learn/sharing-state-between-components

---

## [TODO] React는 컴포넌트 트리에서 state를 언제 유지하고 언제 리셋하는가? `key` prop의 역할은? (Preserving and Resetting State)

### Official Answer

### Reference
- https://react.dev/learn/preserving-and-resetting-state

---

## [TODO] `useState` 대신 `useReducer`로 state 로직을 분리해야 하는 시점은? 전환 방법은? (Extracting State Logic into a Reducer)

### Official Answer

### Reference
- https://react.dev/learn/extracting-state-logic-into-a-reducer

---

## [TODO] Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는? (Passing Data Deeply with Context)

### Official Answer

### Reference
- https://react.dev/learn/passing-data-deeply-with-context

---

## [TODO] reducer와 context를 함께 쓰는 패턴은 어떻게 구성되며 어떤 규모에서 유용한가? (Scaling Up with Reducer and Context)

### Official Answer

### Reference
- https://react.dev/learn/scaling-up-with-reducer-and-context
