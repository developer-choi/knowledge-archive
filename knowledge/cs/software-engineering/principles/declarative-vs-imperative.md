---
tags: [programming-paradigm, concept]
source: official
priority:
---
# Questions
- [UNVERIFIED] 명령형 프로그래밍과 선언형 프로그래밍의 차이는?
- React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?
- imperative 방식으로 UI를 조작하는 코드는 폼 하나에서는 잘 작동한다. 여러 폼이 섞인 복잡한 시스템으로 규모가 커지면 어떤 문제가 생기는가?
- declarative 버전의 폼은 imperative 버전보다 코드 줄 수가 더 길다. 그럼에도 이 코드가 "less fragile"하다고 불리는 이유는 무엇이며, 새로운 visual state를 추가하거나 기존 state의 표시 방식을 바꿀 때 imperative와 어떻게 다른가?

---

# Answers

## [UNVERIFIED] 명령형 프로그래밍과 선언형 프로그래밍의 차이는?

### User Answer
- **명령형:** "버튼을 누르면 -> 모달을 연다 -> 데이터를 가져온다."
- **선언형:** "모달의 상태가 open이면 모달이 보인다. 모달이 보이면 데이터를 가져온다."

### Reference
- https://en.wikipedia.org/wiki/Declarative_programming
- https://en.wikipedia.org/wiki/Imperative_programming

---

## React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?

### Official Answer
With React, you won't modify the UI from code directly.
For example, you won't write commands like "disable the button", "enable the button", "show the success message", etc.
Instead, you will describe the UI you want to see for the different visual states of your component ("initial state", "typing state", "success state"), and then trigger the state changes in response to user input.
This is similar to how designers think about UI.

In React, you don't directly manipulate the UI—meaning you don't enable, disable, show, or hide components directly.
Instead, you declare what you want to show, and React figures out how to update the UI.
Think of getting into a taxi and telling the driver where you want to go instead of telling them exactly where to turn.
It's the driver's job to get you there, and they might even know some shortcuts you haven't considered!

### Reference
- https://react.dev/learn/managing-state
- https://react.dev/learn/reacting-to-input-with-state

---

## imperative 방식으로 UI를 조작하는 코드는 폼 하나에서는 잘 작동한다. 여러 폼이 섞인 복잡한 시스템으로 규모가 커지면 어떤 문제가 생기는가?

### Official Answer
Manipulating the UI imperatively works well enough for isolated examples, but it gets exponentially more difficult to manage in more complex systems.
Imagine updating a page full of different forms like this one.
Adding a new UI element or a new interaction would require carefully checking all existing code to make sure you haven't introduced a bug (for example, forgetting to show or hide something).

#### Imperative version

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
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

### Reference
- https://react.dev/learn/reacting-to-input-with-state

---

## declarative 버전의 폼은 imperative 버전보다 코드 줄 수가 더 길다. 그럼에도 이 코드가 "less fragile"하다고 불리는 이유는 무엇이며, 새로운 visual state를 추가하거나 기존 state의 표시 방식을 바꿀 때 imperative와 어떻게 다른가?

### Official Answer
Although this code is longer than the original imperative example, it is much less fragile.
Expressing all interactions as state changes lets you later introduce new visual states without breaking existing ones.
It also lets you change what should be displayed in each state without changing the logic of the interaction itself.

#### Imperative version

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
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) { el.style.display = 'none'; }
function show(el) { el.style.display = ''; }
function enable(el) { el.disabled = false; }
function disable(el) { el.disabled = true; }
```

#### Declarative version

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <button disabled={answer.length === 0 || status === 'submitting'}>
          Submit
        </button>
        {error !== null && <p className="Error">{error.message}</p>}
      </form>
    </>
  );
}
```

### Reference
- https://react.dev/learn/reacting-to-input-with-state
