---
tags: [testing, concept]
source: official
publishable: true
---
# Questions
- vi.fn / vi.spyOn / vi.mock은 각각 무엇인가?
- 테스트 정리 시 clear / reset / restore는 각각 무엇을 되돌리는가?
  - 매 테스트마다 mock을 손으로 정리하지 않고 자동으로 원래대로 되돌리려면 어떻게 하는가?

---

# Answers

## vi.fn / vi.spyOn / vi.mock은 각각 무엇인가?

### Official Answer
This gives you a function that does nothing by default (returns `undefined`), but tracks every call made to it.

`vi.spyOn` is different from `vi.fn()` in an important way. Instead of creating a brand new function, it wraps an existing method on an object. The original implementation still works by default, but you can observe every call and optionally override the behavior.

Substitutes all imported modules from provided `path` with another module.

### Reference
- https://vitest.dev/guide/learn/mock-functions.html
- https://vitest.dev/api/vi

---

## 테스트 정리 시 clear / reset / restore는 각각 무엇을 되돌리는가?

### Official Answer
- `mockClear()` clears the recorded call history and return values, but keeps any custom implementation you've set
- `mockReset()` does everything `mockClear` does, and also removes any custom implementation, returning the mock to its default state
- `mockRestore()` is specifically for spies created with `vi.spyOn`. It restores the original object method, effectively undoing the spy. On `vi.fn()` mocks, it behaves the same as `mockReset`

### Reference
- https://vitest.dev/guide/learn/mock-functions.html

---

## 매 테스트마다 mock을 손으로 정리하지 않고 자동으로 원래대로 되돌리려면 어떻게 하는가?

### Official Answer
In practice, the easiest approach is to restore all mocks automatically after each test:

```js
import { afterEach, expect, test, vi } from 'vitest'

const calculator = {
  add: (a, b) => a + b,
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('spy is restored after the test', () => {
  const spy = vi.spyOn(calculator, 'add').mockReturnValue(42)
  expect(calculator.add(1, 2)).toBe(42)
  // afterEach will restore calculator.add to the original implementation
})
```

Even better, you can configure this globally with the `restoreMocks` option so you don't need the `afterEach` at all:

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
```

### Reference
- https://vitest.dev/guide/learn/mock-functions.html
