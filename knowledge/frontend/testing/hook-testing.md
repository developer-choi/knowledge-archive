---
tags: [testing, react, concept]
source: official
publishable: true
---
# Questions
- renderHook이란 무엇이며, 내부에서는 어떻게 동작하는가?
- renderHook()보다 render()를 우선적으로 사용해야하는 이유는 무엇인가?
- renderHook의 initialProps는 언제 적용되며, 리렌더 시 다른 props로 다시 실행하려면 무엇을 쓰는가?
- renderHook이 반환하는 result는 왜 값을 직접 주지 않고 result.current를 거쳐 읽게 하며, 그 값에는 훅 반환값의 어느 시점 값이 담기는가?

---

# Answers

## renderHook이란 무엇이며, 내부에서는 어떻게 동작하는가?

### Official Answer
This is a convenience wrapper around `render` with a custom test component. The API emerged from a popular testing pattern and is mostly interesting for libraries publishing hooks.

### Reference
- https://testing-library.com/docs/react-testing-library/api#renderhook

---

## renderHook()보다 render()를 우선적으로 사용해야하는 이유는 무엇인가?

### Official Answer
You should prefer render since a custom test component results in more readable and robust tests since the thing you want to test is not hidden behind an abstraction.

### Reference
- https://testing-library.com/docs/react-testing-library/api#renderhook

---

## renderHook의 initialProps는 언제 적용되며, 리렌더 시 다른 props로 다시 실행하려면 무엇을 쓰는가?

### Official Answer
Declares the props that are passed to the render-callback when first invoked. These will not be passed if you call `rerender` without props.

```js
import {renderHook} from '@testing-library/react'

test('returns logged in user', () => {
  const {result, rerender} = renderHook((props = {}) => props, {
    initialProps: {name: 'Alice'},
  })
  expect(result.current).toEqual({name: 'Alice'})
  rerender()
  expect(result.current).toEqual({name: undefined})
})
```

Renders the previously rendered render-callback with the new props:

```js
const {rerender} = renderHook(({name = 'Alice'} = {}) => name)

// re-render the same hook with different props
rerender({name: 'Bob'})
```

### Reference
- https://testing-library.com/docs/react-testing-library/api#renderhook

---

## renderHook이 반환하는 result는 왜 값을 직접 주지 않고 result.current를 거쳐 읽게 하며, 그 값에는 훅 반환값의 어느 시점 값이 담기는가?

### Official Answer
Holds the value of the most recently committed return value of the render-callback:

```js
import {renderHook} from '@testing-library/react'

const {result} = renderHook(() => {
  const [name, setName] = useState('')
  React.useEffect(() => {
    setName('Alice')
  }, [])

  return name
})

expect(result.current).toBe('Alice')
```

Note that the value is held in `result.current`. Think of result as a ref for the most recently committed value.

### Reference
- https://testing-library.com/docs/react-testing-library/api#renderhook