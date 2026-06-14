# imperative 방식으로 UI를 조작하는 코드는 폼 하나에서는 잘 작동한다. 여러 폼이 섞인 복잡한 시스템으로 규모가 커지면 어떤 문제가 생기는가?

## 도입

명령형(imperative) 코드는 "어떻게 할지"를 단계별로 지시한다. DOM 요소를 직접 찾아 `show()`, `hide()`, `enable()`, `disable()`을 순서대로 호출하는 방식이다. 폼 하나일 때는 흐름이 눈에 보이지만, 폼이 여러 개로 늘어나면 이벤트·상태·UI 조합이 곱셈으로 증가한다.

---

## 본문

> Manipulating the UI imperatively works well enough for isolated examples, but it gets exponentially more difficult to manage in more complex systems.

"UI를 명령형으로 조작하는 것은 고립된 예시에서는 충분히 잘 작동하지만, 더 복잡한 시스템에서는 관리가 지수적으로 어려워진다."

- **isolated examples**: 폼 하나, 버튼 하나 같은 고립된 작은 예시. 다른 UI 요소와 상호작용하지 않는 단독 단위.
- **exponentially more difficult**: 요소 수 × 이벤트 수 × 상태 수의 조합이 곱셈으로 늘어난다. 폼 2개가 되면 처리해야 할 경우의 수가 2배가 아니라 그보다 훨씬 많아진다.

> Imagine updating a page full of different forms like this one. Adding a new UI element or a new interaction would require carefully checking all existing code to make sure you haven't introduced a bug (for example, forgetting to show or hide something).

"이런 폼들로 가득한 페이지를 업데이트하는 상황을 상상해보라. 새 UI 요소나 새 상호작용을 추가하면, 버그를 심지 않았는지 확인하기 위해 기존 코드 전체를 주의 깊게 점검해야 한다. 예: 무언가를 show하거나 hide하는 것을 빠뜨리는 경우."

- **carefully checking all existing code**: 새 요소 하나를 추가할 때 기존 코드 전체를 다시 읽어야 한다. 코드가 늘어날수록 이 비용도 선형이 아니라 지수적으로 커진다.
- **introduced a bug**: 기존 흐름을 깨서 버그를 심는 것. 명령형에서는 새 이벤트 핸들러를 추가할 때 기존 핸들러 안에 그것이 영향을 줄 `show`/`hide` 호출이 있는지 모두 확인해야 한다.
- **forgetting to show or hide something**: 명령형의 전형적 버그. `show(spinner)` 호출 후 에러 경로에서 `hide(spinner)`를 빠뜨리면 에러 후 스피너가 영원히 남는다.

아래 imperative 코드를 보면 `handleFormSubmit` 하나가 `disable`, `show`, `hide`, `enable`을 직접 관리한다. 여기에 새 상태 `'verifying'`을 추가하려면 `finally` 블록, HTML, `handleTextareaChange` 등 여러 곳을 동시에 수정해야 한다.

```js
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);   // ← 빠뜨리면 로딩 메시지가 영원히 표시
    enable(textarea);
    enable(button);
  }
}
```

---

## 종합

이벤트 핸들러 안에 "무엇을 보여줄지"와 "언제 보여줄지"가 한 덩어리로 박혀 있는 것이 imperative 구조의 핵심 문제다. 폼 하나일 때는 이 덩어리가 한 곳에 있어서 파악이 쉽지만, 폼이 5개가 되면 덩어리 5개가 서로 영향을 주고받는다. 새 UI 요소를 추가할 때마다 "이 핸들러가 저 요소도 건드려야 하는가?"를 모든 핸들러에서 확인해야 한다. 변경 비용이 코드 크기에 비례해 선형이 아니라 지수적으로 늘어난다.

---

# declarative 버전의 폼은 imperative 버전보다 코드 줄 수가 더 길다. 그럼에도 이 코드가 "less fragile"하다고 불리는 이유는 무엇이며, 새로운 visual state를 추가하거나 기존 state의 표시 방식을 바꿀 때 imperative와 어떻게 다른가?

## 도입

"less fragile"은 코드 줄 수가 적다는 뜻이 아니다. 변경을 가했을 때 기존 동작이 얼마나 안전하게 유지되는가의 척도다. React의 선언형(declarative) 접근은 UI 상태를 state로 표현하고 JSX가 그 state를 읽도록 분리해서, 한쪽 수정이 다른 쪽으로 번지지 않게 한다.

---

## 본문

> Although this code is longer than the original imperative example, it is much less fragile.

"이 코드는 원래 명령형 예시보다 길지만, 훨씬 덜 깨지기 쉽다."

- **fragile**: 변경을 가했을 때 쉽게 깨지는 성격. 한 곳 고쳤더니 엉뚱한 다른 곳에서 버그가 나거나, 새 기능 추가 시 기존 동작이 무너지는 코드.
- **much less fragile**: 줄 수가 아니라 변경 충격에 버티는 정도가 핵심 지표. 초기 코드가 길어도 변경 비용이 선형에 가깝게 유지되는 게 "less fragile"의 실무 의미다.

> Expressing all interactions as state changes lets you later introduce new visual states without breaking existing ones.

"모든 상호작용을 state 변화로 표현하면 나중에 기존 state를 깨지 않고 새 visual state를 도입할 수 있다."

- **Expressing all interactions as state changes**: 모든 상호작용을 DOM 조작이 아닌 `setState` 호출(state 전환)로만 표현. `disable(button)` 대신 `setStatus('submitting')`.
- **introduce new visual states without breaking existing ones**: `status` enum에 값 추가 + 해당 분기 JSX만 추가하면 된다. 기존 state 관련 코드는 0줄 수정.

> It also lets you change what should be displayed in each state without changing the logic of the interaction itself.

"또한 상호작용 로직 자체를 바꾸지 않고 각 state에서 무엇을 표시할지를 바꿀 수 있다."

- **change what should be displayed**: JSX(렌더 결과)만 수정.
- **without changing the logic of the interaction itself**: setter를 호출하는 이벤트 핸들러 로직은 그대로 둔다. 표시와 로직이 분리되어 있어 한쪽만 수정할 수 있다.

```jsx
// Declarative: 이벤트 핸들러는 state만 바꾼다
async function handleSubmit(e) {
  e.preventDefault();
  setStatus('submitting');   // ← "무엇을 할지"가 아니라 "어떤 state인지"만 선언
  try {
    await submitForm(answer);
    setStatus('success');
  } catch (err) {
    setStatus('typing');
    setError(err);
  }
}

// JSX는 state를 읽어 표시를 결정한다
<textarea disabled={status === 'submitting'} />
<button disabled={answer.length === 0 || status === 'submitting'}>
{error !== null && <p>{error.message}</p>}
```

새 상태 `'verifying'`를 추가할 때 declarative와 imperative의 차이:

```
imperative 변경 포인트:
  handleFormSubmit 내부 명령 순서 재계산
  HTML에 verifyingMessage 요소 추가
  show(verifyingMessage) 추가
  finally에 hide(verifyingMessage) 추가
  handleTextareaChange에서도 영향 여부 확인
  → 수정 포인트 7개 이상, 코드 곳곳에 흩어짐

declarative 변경 포인트:
  status enum에 'verifying' 추가
  JSX에 조건부 한 줄 추가: {status === 'verifying' && <VerifyingUI />}
  handleSubmit에 setStatus('verifying') 한 줄 추가
  → 수정 포인트 3개, 기존 다른 state 로직은 건드리지 않음
```

---

## 종합

imperative 구조는 이벤트 핸들러 안에 "뭘 보여줄지"와 "언제 보여줄지"가 한 덩어리다. declarative 구조는 두 레이어가 분리된다 — 핸들러는 `setStatus()`만, JSX는 `{status === '...' && ...}`만 담당한다. 이 분리가 "change isolation"을 만든다. 초기 코드가 길어져도 변경할 때마다 수정 범위가 예측 가능하고, 기존 동작을 건드리지 않고 새 상태를 추가할 수 있다. React 자체가 이 declarative 모델 위에 세워진 라이브러리다 — `useState`가 있는 이유가 바로 "모든 상호작용을 state 변화로 표현하라"는 원칙을 강제하기 위해서다.
