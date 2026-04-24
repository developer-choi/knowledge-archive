---
tags: [react, concept]
---
# Questions
- React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?

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

### Reference
- https://react.dev/learn/managing-state
