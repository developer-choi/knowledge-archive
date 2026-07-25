---
tags: [programming-paradigm, concept]
source: official
priority: 2
---
# Questions
- React가 선언적(declarative)이라는 것은 무엇을 뜻하는가?
- 명령형(imperative)으로 UI를 만든다는 것은 무엇을 하는 것인가?

---

# Answers

## React가 선언적(declarative)이라는 것은 무엇을 뜻하는가?

### Official Answer
React is declarative: you tell React what to render, and React will figure out how best to display it to your user.

React provides a declarative way to manipulate the UI.
Instead of manipulating individual pieces of the UI directly, you describe the different states that your component can be in, and switch between them in response to the user input.
This is similar to how designers think about the UI.

In React, you don't directly manipulate the UI—meaning you don't enable, disable, show, or hide components directly.
Instead, you declare what you want to show, and React figures out how to update the UI.

Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).

### Reference
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/learn/reacting-to-input-with-state

---

## 명령형(imperative)으로 UI를 만든다는 것은 무엇을 하는 것인가?

### Official Answer
In imperative programming, the above corresponds directly to how you implement interaction.
You have to write the exact instructions to manipulate the UI depending on what just happened.

It's called imperative because you have to "command" each element, from the spinner to the button, telling the computer how to update the UI.

### Reference
- https://react.dev/learn/reacting-to-input-with-state