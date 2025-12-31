# Questions
- What's the null?
- What's the undefined?
- null과 undefined의 공통점이 뭔가요?
- null과 undefined의 차이점이 뭔가요?
- null은 언제 사용하나요?
- undefined는 언제 사용하나요?

# Answers
## What's the null??
The null keyword refers to the null primitive value, which represents the intentional absence of any object value.

## null과 undefined의 공통점이 뭔가요?
Like undefined, accessing any property on null throws a TypeError.

Like undefined, null is treated as falsy for boolean operations, and nullish for nullish coalescing and optional chaining.

## null과 undefined의 차이점이 뭔가요?
The typeof null result is "object". This is a bug in JavaScript that cannot be fixed due to backward compatibility.


## What is the difference between null and undefined?
### keywords
`null`, `undefined`, `typeof`, `primitive value`, `falsy`

### Official Answer
**null**
The `null` value represents the intentional absence of any object value. It is one of JavaScript's primitive values and is treated as falsy for boolean operations.
> `null` keyword refers to the null primitive value. Unlike `undefined`, `null` is not an identifier but a syntax keyword.

**undefined**
The `undefined` global property represents the primitive value `undefined`. It is one of JavaScript's primitive types. A variable that has not been assigned a value is of type `undefined`. A method or statement also returns `undefined` if the variable that is being evaluated does not have an assigned value.

**Comparison**
| Feature | `null` | `undefined` |
| :--- | :--- | :--- |
| **Definition** | Intentional absence of any object value. | Absence of a value (not assigned yet). |
| **Type (`typeof`)** | `"object"` (Historical bug) | `"undefined"` |
| **Equality (`==`)** | `null == undefined` // true | `undefined == null` // true |
| **Identity (`===`)** | `null === undefined` // false | `undefined === null` // false |
| **Numeric Context** | Coerced to `0` (e.g., `1 + null === 1`) | Coerced to `NaN` (e.g., `1 + undefined` is `NaN`) |
| **JSON Serialization** | Included (`{"a": null}`) | Omitted (`{"a": undefined}` -> `{}`) |

> JavaScript is unique to have two nullish values: `null` and `undefined`. Semantically, their difference is very minor: `undefined` represents the absence of a value, while `null` represents the absence of an object.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
- https://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript
