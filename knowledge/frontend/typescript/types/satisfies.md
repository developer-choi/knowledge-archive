---
tags: [typescript, concept]
---
# Questions
- `satisfies` 연산자는 어떤 문제를 해결하기 위해 등장했는가?
- `satisfies` 연산자는 어떻게 동작하는가?
- `satisfies`로 객체의 Key만 엄격하게 검사하려면 어떻게 쓰는가?
- `satisfies`로 객체의 value만 엄격하게 검사하려면 어떻게 쓰는가?
- Type Annotation, assertion(`as`), `satisfies`는 각각 어떻게 다른가?
- 왜 `satisfies`를 `as`보다 우선 검토해야 하는가?
---
# Answers
## `satisfies` 연산자는 어떤 문제를 해결하기 위해 등장했는가?
### Official Answer
TypeScript developers are often faced with a dilemma:
we want to ensure that some expression matches some type,
but also want to keep the most specific type of that expression for inference purposes.

```typescript
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];
const palette: Record<Colors, string | RGB> = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255]
//  ~~~~ The typo is now correctly detected
};
// But we now have an undesirable error here - 'palette.green' "could" be of type RGB and
// property 'toUpperCase' does not exist on type 'string | RGB'.
const greenNormalized: any = palette.green.toUpperCase();
```


---
## `satisfies` 연산자는 어떻게 동작하는가?
### Official Answer
The new satisfies operator lets us **validate that the type** of an expression matches some type, **without changing the resulting type** of that expression.

As an example, we could use satisfies to validate that all the properties of palette are **compatible** with string | number[].


---
## `satisfies`로 객체의 Key만 엄격하게 검사하려면 어떻게 쓰는가?
### Official Answer
For example, we could ensure that an object has all the keys of some type, but no more:

```typescript
const favoriteColors = {
  "red": "yes",
  "green": false,
  "blue": "kinda",
  "platypus": false
//  ~~~~~~~~~~ error - "platypus" was never listed in 'Colors'.
} satisfies Record<Colors, unknown>;

// All the information about the 'red', 'green', and 'blue' properties are retained.
const g: boolean = favoriteColors.green;
```


---
## `satisfies`로 객체의 value만 엄격하게 검사하려면 어떻게 쓰는가?
### Official Answer
Maybe we don’t care about if the property names match up somehow, but we do care about the types of each property.
In that case, we can also ensure that all of an object’s property values conform to some type.

```typescript
type RGB = [red: number, green: number, blue: number];
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0]
//  ~~~~~~ error!
} satisfies Record<string, string | RGB>;
// Information about each property is still maintained.
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```


---
## Type Annotation, assertion(`as`), `satisfies`는 각각 어떻게 다른가?
### User Answer
- Type Annotation = 타입을 지정.
- assertion = 타입을 단언.
- satisfies = 타입을 체크만 하고, 추론 결과에 영향을 주지 않음.

---
## 왜 `satisfies`를 `as`보다 우선 검토해야 하는가?
### User Answer
안정성 때문이다.

타입이 틀린데도 개발자가 잘못 이해하고 단언을 해 버리면 컴파일 단계에서 타입 오류를 잡을 수 없다.

```typescript
function some(array: number[]): void {
  console.log((array[0] as number).toString());
}
```
