---
tags: [typescript, comparison]
---

# Questions
- `unknown` 타입이란 무엇인가?
- `any` 타입이란 무엇인가?

---

# Answers

## `unknown` 타입이란 무엇인가?

### Official Answer
The `unknown` type represents any value.
This is similar to the `any` type, but is safer because it’s not legal to do anything with an `unknown` value.

This is useful when describing function types because you can describe functions that accept any value without having any values in your function body.

Conversely, you can describe a function that returns a value of unknown type.

In cases where you don’t know what type you want to accept, or when you want to accept anything because you will be blindly passing it through without interacting with it, you can use `unknown`.

Anything is assignable to **unknown**, but **unknown** isn’t assignable to anything but itself and any without a type assertion or a control flow based narrowing.

### Reference
- https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type
- https://www.typescriptlang.org/play/#example/unknown-and-never

---

## `any` 타입이란 무엇인가?

### Official Answer
TypeScript also has a special type, `any`, that you can use whenever you don’t want a particular value to cause typechecking errors.

When a value is of type `any`, you can access any properties of it (**which will in turn be of type `any`**), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that’s syntactically legal.

### Reference
- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any