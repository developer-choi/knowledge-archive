# `is` 키워드 — Type Predicate

함수의 반환 타입을 `value is string` 형식으로 선언하면 TypeScript가 인자를 해당 타입으로 좁혀준다.

```ts
function validate(value: any): value is string {
  return value;
}

const anyValue: any = 1;
const validated = validate(anyValue);

if (validated) {
  // 여기서 anyValue는 string으로 추론됨.
  anyValue.repeat(1);
}
```
