---
tags: [react, concept, principle]
source: official
priority: 2
publishable: true
---

# Questions
- React가 화면을 갱신하는 세 단계인 Trigger, Render, Commit은 각각 무엇을 하는가?
  - React 컴포넌트는 어떤 경우에 렌더링되는가?
  - React는 렌더할 때 어느 컴포넌트부터 어디까지 호출하는가?
  - React는 렌더 결과를 DOM에 어떻게 반영하는가?
  - 매초 리렌더되는 컴포넌트 안의 input에 글자를 입력해두면 그 글자는 리렌더 때 어떻게 되는가?

---

# Answers

## React가 화면을 갱신하는 세 단계인 Trigger, Render, Commit은 각각 무엇을 하는가?

### Official Answer

Any screen update in a React app happens in three steps:

- Trigger
- Render
- Commit

Rendering refers to calculating what the next version of your UI should look like.
After rendering, React takes this new calculation and compares it to the calculation used to create the previous version of your UI.
Then React commits just the minimum changes needed to the DOM (what your user actually sees) to apply the changes.
Finally, Effects are flushed (meaning they are run until there are no more left).

#### Trigger

There are two reasons for a component to render:

- It’s the component’s initial render.
- The component’s (or one of its ancestors’) state has been updated.

#### Render

After you trigger a render, React calls your components to figure out what to display on screen.
“Rendering” is React calling your components.
The process will continue until there are no more nested components and React knows exactly what should be displayed on screen.

#### Commit

After rendering (calling) your components, React will modify the DOM.
React only changes the DOM nodes if there’s a difference between renders.

### Reference
- https://react.dev/learn/render-and-commit
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

---

## React 컴포넌트는 어떤 경우에 렌더링되는가?

### Official Answer

There are two reasons for a component to render:

- It’s the component’s initial render.
- The component’s (or one of its ancestors’) state has been updated.

When your app starts, you need to trigger the initial render.

Once the component has been initially rendered, you can trigger further renders by updating its state with the set function.
Updating your component’s state automatically queues a render.

### Reference
- https://react.dev/learn/render-and-commit

---

## React는 렌더할 때 어느 컴포넌트부터 어디까지 호출하는가?

### Official Answer

On initial render, React will call the root component.
For subsequent renders, React will call the function component whose state update triggered the render.

This process is recursive: if the updated component returns some other component, React will render that component next, and if that component also returns something, it will render that component next, and so on.
The process will continue until there are no more nested components and React knows exactly what should be displayed on screen.

### Reference
- https://react.dev/learn/render-and-commit

---

## React는 렌더 결과를 DOM에 어떻게 반영하는가?

### Official Answer

During the initial render, React will create the DOM nodes for `<section>`, `<h1>`, and three `<img>` tags.
During a re-render, React will calculate which of their properties, if any, have changed since the previous render.
It won’t do anything with that information until the next step, the commit phase.

After rendering (calling) your components, React will modify the DOM.

- For the initial render, React will use the appendChild() DOM API to put all the DOM nodes it has created on screen.
- For re-renders, React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.

### Reference
- https://react.dev/learn/render-and-commit

---

## 매초 리렌더되는 컴포넌트 안의 input에 글자를 입력해두면 그 글자는 리렌더 때 어떻게 되는가?

### Official Answer

React only changes the DOM nodes if there’s a difference between renders.

This works because during this last step, React only updates the content of `<h1>` with the new time.
It sees that the `<input>` appears in the JSX in the same place as last time, so React doesn’t touch the `<input>`—or its value!

React does not touch the DOM if the rendering result is the same as last time

### Reference
- https://react.dev/learn/render-and-commit
