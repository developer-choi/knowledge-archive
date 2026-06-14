---
tags: [react, design-pattern, concept]
source: official
priority:
---
# Questions
- Compound Components 패턴이란 무엇이며, 어떤 문제를 해결하는가?
  - Compound Components에서 "implicit state"란 무엇이며, 왜 중요한가?
- React에서 Compound Components의 implicit state를 Context로 구현할 때, 부모 컴포넌트는 어떤 구조로 상태를 공유하는가?
  - Compound Components에서 자식 컴포넌트가 Provider 바깥에서 렌더링되면 어떤 문제가 생기며, 이를 어떻게 방어하는가?
  - Compound Components에서 Context value에 useMemo를 쓰는 이유는?

---

# Answers

## Compound Components 패턴이란 무엇이며, 어떤 문제를 해결하는가?

### Official Answer
The idea is that you have two or more components that work together to accomplish a useful task.
Typically one component is the parent, and the other is the child.
The objective is to provide a more expressive and flexible API.

Think of it like `<select>` and `<option>`:

```html
<select>
    <option value="value1">key1</option>
    <option value="value2">key2</option>
    <option value="value3">key3</option>
</select>
```

If you were to try and use one without the other it wouldn't work (or make sense).
Additionally it's actually a really great API.
Let's check out what it would look like if we didn't have a compound components API to work with (remember, this is HTML, not JSX):

```html
<select options="key1:value1;key2:value2;key3:value3"></select>
```

And how would you express the disabled attribute with this kind of API?
It's kinda madness.

So the compound components API gives you a nice way to express relationships between components.

### Reference
- https://kentcdodds.com/blog/compound-components-with-react-hooks

---

## Compound Components에서 "implicit state"란 무엇이며, 왜 중요한가?

### Official Answer
Another important aspect of this is the concept of "implicit state."
The `<select>` element implicitly stores state about the selected option and shares that with it's children so they know how to render themselves based on that state.
But that state sharing is implicit because there's nothing in our HTML code that can even access the state (and it doesn't need to anyway).

### Reference
- https://kentcdodds.com/blog/compound-components-with-react-hooks

---

## React에서 Compound Components의 implicit state를 Context로 구현할 때, 부모 컴포넌트는 어떤 구조로 상태를 공유하는가?

### Official Answer
So the way this works is we create a context with React where we store the state and a mechanism for updating the state.
Then the `<Toggle>` component is responsible for providing that context value to the rest of the react tree.

```jsx
const ToggleContext = React.createContext()

function Toggle(props) {
    const [on, setOn] = React.useState(false)
    const toggle = React.useCallback(() => setOn((oldOn) => !oldOn), [])
    const value = React.useMemo(() => ({ on, toggle }), [on])
    return (
        <ToggleContext.Provider value={value}>
            {props.children}
        </ToggleContext.Provider>
    )
}
```

### Reference
- https://kentcdodds.com/blog/compound-components-with-react-hooks

---

## Compound Components에서 자식 컴포넌트가 Provider 바깥에서 렌더링되면 어떤 문제가 생기며, 이를 어떻게 방어하는가?

### Official Answer
```jsx
function useToggleContext() {
    const context = React.useContext(ToggleContext)
    if (!context) {
        throw new Error(
            `Toggle compound components cannot be rendered outside the Toggle component`,
        )
    }
    return context
}
```

### Reference
- https://kentcdodds.com/blog/compound-components-with-react-hooks

---

## Compound Components에서 Context value에 useMemo를 쓰는 이유는?

### Official Answer
```jsx
const value = React.useMemo(() => ({ on, toggle }), [on])
return (
    <ToggleContext.Provider value={value}>
        {props.children}
    </ToggleContext.Provider>
)
```

### Reference
- https://kentcdodds.com/blog/compound-components-with-react-hooks
