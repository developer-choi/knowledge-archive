---
tags: [react, concept]
---
# Questions
- Component와 Element의 차이는 무엇이며, Component는 개념적으로 무엇과 유사한가?
- state에는 어떤 값을 저장하는 것이 좋은가?
- React 컴포넌트의 lifecycle 3단계(마운트/업데이트/언마운트)는 각각 언제 일어나는가?

---

# Answers

## Component와 Element의 차이는 무엇이며, Component는 개념적으로 무엇과 유사한가?

### Official Answer
Conceptually, components are like JavaScript functions.
They accept arbitrary inputs (called "props") and return React elements describing what should appear on the screen.

Components can create similar but different UIs through props passed from parent components.

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

> #### Key Terms:
> - **props**: 부모 컴포넌트가 자식 컴포넌트에 전달하는 임의의 입력 값
> - **elements**: 화면에 무엇이 나타나야 하는지 설명하는 React 객체 (컴포넌트의 반환값)
> - **isolation**: 각 조각을 독립적으로 분리해 사고할 수 있는 상태

> #### User Annotation:
> props로 화면에 보여줘야 하는 내용을 받아 출력하는 컴포넌트 예시:
> ```
> interface SomeProps {
>   inputValue: any;
> }
>
> function SomeComponent(props: SomeProps) {
>   return (
>     <div>입력된 props로 화면에 보여져야하는 내용 {props.inputValue}</div>
>   )
> }
> ```
>
> 부모 컴포넌트에서 같은 컴포넌트에 다른 props를 전달하여 비슷하지만 다른 UI를 만드는 예시:
> ```
> export default function TodoListApp() {
>   return (
>     <div>
>       <Todo content="할일1"/>
>       <Todo content="할일2"/>
>       <Todo content="할일3"/>
>     </div>
>   );
> }
> ```

### Reference
- React 공식 문서 introduction (URL_UNKNOWN)

---

## state에는 어떤 값을 저장하는 것이 좋은가?

### User Answer
state는 다음 세 가지 특성을 가진다.

값을 저장할 수 있다.

값을 바꾸면 렌더링이 새로 일어난다.

따라서 화면에 보여줘야 하는 것과 관련이 있으면서, 동시에 바뀔 가능성이 있는 값만 state에 저장하는 것이 좋다.

---

## React 컴포넌트의 lifecycle 3단계(마운트/업데이트/언마운트)는 각각 언제 일어나는가?

### User Answer
주로 사용하는 lifecycle은 총 3가지로, 마운트 → 업데이트 → 언마운트 순서로 일어난다.

마운트는, 컴포넌트가 반환한 elements가 처음으로 화면에 반영된 이후이다.
화면(= HTML 문서)에 반영됐다는 것은, 해당 elements의 DOM API 같은 것들도 다 쓸 수 있다는 것을 의미한다.

업데이트는, 화면이 업데이트 되고 난 이후이다.

언마운트는, 컴포넌트가 반환했던 elements가 제거되기 직전이다.
