---
tags: [react, concept, principle]
source: official
publishable: true
---

# Questions
- React가 렌더를 순수하게 유지하라고 요구하는 이유는 무엇인가?
  - 컴포넌트가 멱등(idempotent)하다는 것은 무엇을 뜻하는가?
  - 렌더 중에 매번 다른 값을 돌려주는 함수를 호출하면 화면에서 어떤 증상이 나타나는가?
  - 매번 달라지는 값이 필요하면 그런 함수는 컴포넌트에서 아예 쓸 수 없는가?
  - React의 Strict Mode는 왜 있는가?
- 부수효과는 어디에 작성해야 하는가?
- props와 state를 직접 수정하면 안 되는 이유는 무엇인가?
  - [React 컴포넌트가 한 번 렌더될 때, 그 렌더 안에서 state 값은 언제 정해지고 언제까지 그대로인가? → `state-as-a-snapshot.md`](../rendering/state-as-a-snapshot.md#react-컴포넌트가-한-번-렌더될-때-그-렌더-안에서-state-값은-언제-정해지고-언제까지-그대로인가)
  - state 변수에 값을 직접 대입하면 화면은 어떻게 되는가?

---

# Answers

## React가 렌더를 순수하게 유지하라고 요구하는 이유는 무엇인가?

### Official Answer

When render is kept pure, React can understand how to prioritize which updates are most important for the user to see first.
This is made possible because of render purity: since components don’t have side effects in render, React can pause rendering components that aren’t as important to update, and only come back to them later when it’s needed.

Concretely, this means that rendering logic can be run multiple times in a way that allows React to give your user a pleasant user experience.
However, if your component has an untracked side effect – like modifying the value of a global variable during render – when React runs your rendering code again, your side effects will be triggered in a way that won’t match what you want.

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

---

## 컴포넌트가 멱등(idempotent)하다는 것은 무엇을 뜻하는가?

### Official Answer

Idempotent – You always get the same result every time you run it with the same inputs – props, state, context for component inputs; and arguments for hook inputs.

Components must always return the same output with respect to their inputs – props, state, and context.
This is known as idempotency.

This means that all code that runs during render must also be idempotent in order for this rule to hold.

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

---

## 렌더 중에 매번 다른 값을 돌려주는 함수를 호출하면 화면에서 어떤 증상이 나타나는가?

### Official Answer

```js
function Clock() {
  const time = new Date(); // 🔴 Bad: always returns a different result!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` is not idempotent as it always returns the current date and changes its result every time it’s called.
When you render the above component, the time displayed on the screen will stay stuck on the time that the component was rendered.
Similarly, functions like `Math.random()` also aren’t idempotent, because they return different results every time they’re called, even when the inputs are the same.

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

---

## 매번 달라지는 값이 필요하면 그런 함수는 컴포넌트에서 아예 쓸 수 없는가?

### Official Answer

This doesn’t mean you shouldn’t use non-idempotent functions like `new Date()` at all – you should just avoid using them during render.
In this case, we can synchronize the latest date to this component using an Effect:

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Keep track of the current date's state. `useState` receives an initializer function as its
  //    initial state. It only runs once when the hook is called, so only the current date at the
  //    time the hook is called is set first.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Update the current date every second using `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Good: non-idempotent code no longer runs in render
    }, 1000);
    // 3. Return a cleanup function so we don't leak the `setInterval` timer.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

By wrapping the non-idempotent `new Date()` call in an Effect, it moves that calculation outside of rendering.

If you don’t need to synchronize some external state with React, you can also consider using an event handler if it only needs to be updated in response to a user interaction.

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

---

## React의 Strict Mode는 왜 있는가?

### Official Answer

Rendering must always be a pure calculation:

- Same inputs, same output. Given the same inputs, a component should always return the same JSX.
- It minds its own business. It should not change any objects or variables that existed before rendering.

When developing in “Strict Mode”, React calls each component’s function twice, which can help surface mistakes caused by impure functions.

### Reference
- https://react.dev/learn/render-and-commit

---

## 부수효과는 어디에 작성해야 하는가?

### Official Answer

Side effects should not run in render, as React can render components multiple times to create the best possible user experience.

Side effects are typically written inside of event handlers or Effects.
But never during render.

While render must be kept pure, side effects are necessary at some point in order for your app to do anything interesting, like showing something on the screen!
In most cases, you’ll use event handlers to handle side effects.
Using an event handler explicitly tells React that this code doesn’t need to run during render, keeping render pure.
If you’ve exhausted all options – and only as a last resort – you can also handle side effects using `useEffect`.

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

---

## props와 state를 직접 수정하면 안 되는 이유는 무엇인가?

### Official Answer

A component’s props and state are immutable snapshots.
Never mutate them directly.
Instead, pass new props down, and use the setter function from `useState`.

Props are immutable because if you mutate them, the application will produce inconsistent output, which can be hard to debug as it may or may not work depending on the circumstances.

```js
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Bad: never mutate props directly
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Good: make a copy instead
  return <Link url={url}>{item.title}</Link>;
}
```

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

---

## state 변수에 값을 직접 대입하면 화면은 어떻게 되는가?

### Official Answer

Rather than updating the state variable in-place, we need to update it using the setter function that is returned by `useState`.
Changing values on the state variable doesn’t cause the component to update, leaving your users with an outdated UI.
Using the setter function informs React that the state has changed, and that we need to queue a re-render to update the UI.

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure