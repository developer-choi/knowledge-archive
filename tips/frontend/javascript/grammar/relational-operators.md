# Relational Operators (`in`, `instanceof`)

- [MDN: Expressions and operators — relational operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#relational_operators)

## `in`

[Exception](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in#exceptions): `TypeError` — Thrown if object is not an object (i.e., a primitive).

```js
'key' in 'some'
// Uncaught TypeError: Cannot use 'in' operator to search for 'key' in some

'key' in 123
// Uncaught TypeError: Cannot use 'in' operator to search for 'key' in 123
```

## `instanceof`

[Exception](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#exceptions): `TypeError` — Thrown if constructor is not an object.

```js
typeof '123'
// 'string'

'asd' instanceof 1
// Uncaught TypeError: Right-hand side of 'instanceof' is not an object
```

### Limitation

```ts
export function getErrorInfo(error: unknown) {
  const bool1 = error instanceof Error;
  const bool2 = 'key' in error; // TS18046: error is of type unknown
}
```

`error`가 `unknown`인데 `instanceof`는 에러를 안 내줌.

그치만? 괜찮음. `instanceof` 우측엔 개발자가 미쳤다고 문자열이나 숫자를 쓰지 않음;

그래서 typescript에서도 `error`가 `unknown`이어도 `in`은 오류 내지만 `instanceof`는 오류를 안 내는 듯?
