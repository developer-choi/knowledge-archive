# `satisfies` 연산자는 어떤 문제를 해결하기 위해 등장했는가?

## 도입

TypeScript에서 객체에 타입을 부여하는 방법은 두 가지가 있다 — 타입 어노테이션(`: Type`)과 타입 단언(`as Type`). 어노테이션은 오타를 잡아주지만 추론 결과를 넓혀버리고, 단언은 추론을 보존하지만 타입 검사를 우회한다. `satisfies`는 이 딜레마를 해결한다.

---

## 본문

> TypeScript developers are often faced with a dilemma: we want to ensure that some expression matches some type, but also want to keep the most specific type of that expression for inference purposes.

"TypeScript 개발자들은 종종 딜레마에 직면한다: 어떤 표현식이 특정 타입과 일치한다는 것을 보장하고 싶지만, 추론 목적을 위해 그 표현식의 가장 구체적인 타입도 유지하고 싶다."

- **matches some type**: 오타, 허용되지 않은 키, 타입 불일치를 컴파일 타임에 잡고 싶다.
- **keep the most specific type**: `: Record<Colors, string | RGB>`로 어노테이션하면 `palette.green`의 타입이 `string | RGB`로 넓어져 `.toUpperCase()`를 쓸 수 없게 된다.

```ts
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];

// 문제 1: 어노테이션 — 오타는 잡지만 추론이 넓어짐
const palette: Record<Colors, string | RGB> = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255]  // 오타 잡힘 ✓
};
palette.green.toUpperCase(); // 에러: string | RGB에는 toUpperCase 없음 ✗

// 문제 2: 어노테이션 없음 — 추론은 좋지만 오타를 못 잡음
const palette2 = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255]  // 오타 못 잡힘 ✗
};
palette2.green.toUpperCase(); // OK (green은 string으로 추론) ✓
```

---

## 종합

어노테이션이 없으면 오타를 못 잡고, 어노테이션을 달면 추론이 넓어져 구체적인 타입을 활용할 수 없다. 이 둘을 동시에 원하는 것이 딜레마의 본질이다. `satisfies` 연산자는 "검사만 하고 추론 결과는 바꾸지 않는다"는 제3의 방법을 제공한다.

---

---

# `satisfies` 연산자는 어떻게 동작하는가?

## 도입

`satisfies`는 TypeScript 4.9에서 추가된 연산자다. 타입 어노테이션처럼 타입을 검사하지만, 어노테이션과 달리 변수의 추론된 타입을 바꾸지 않는다.

---

## 본문

> The new satisfies operator lets us **validate that the type** of an expression matches some type, **without changing the resulting type** of that expression.

"새로운 satisfies 연산자는 표현식의 타입이 어떤 타입과 일치하는지 **검사**하면서, 그 표현식의 **결과 타입을 변경하지 않고** 할 수 있게 해준다."

- **validate that the type**: 어노테이션처럼 타입 검사를 수행한다. 허용되지 않은 키, 타입 불일치를 잡는다.
- **without changing the resulting type**: 변수에 `: Type`을 붙이면 타입이 `: Type`으로 바뀌지만, `satisfies Type`은 변수의 타입을 TypeScript가 추론한 구체적 타입 그대로 유지한다.

> As an example, we could use satisfies to validate that all the properties of palette are **compatible** with string | number[].

"예를 들어 palette의 모든 프로퍼티가 string | number[]와 **호환**되는지 검사하는 데 satisfies를 사용할 수 있다."

- **compatible**: 부분 집합 관계. `string`은 `string | number[]`와 호환되고, `[255,0,0]`(number 배열)도 호환된다.

```ts
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255]
} satisfies Record<Colors, string | RGB>;

// 1. 타입 검사: Record<Colors, string | RGB>와 호환되는지 확인 ✓
// 2. 추론 보존: palette.green의 타입은 string (넓어지지 않음)
palette.green.toUpperCase(); // OK ✓
palette.red.at(0);           // OK ✓ (red는 [number, number, number])
```

```
satisfies vs 어노테이션 비교

: Record<Colors, string | RGB>    → palette.green 타입 = string | RGB
satisfies Record<Colors, string | RGB> → palette.green 타입 = string (추론값 유지)
```

---

## 종합

`satisfies`는 "타입 검사는 하되 추론 결과는 건드리지 않는다"는 새로운 역할이다. 어노테이션이 "이 변수는 이 타입이다"라는 선언이라면, `satisfies`는 "이 값이 이 타입의 제약을 만족한다"는 검증이다. 추론된 구체적 타입을 살리면서 타입 안전성도 확보하는 가장 좋은 방법이다.

---

---

# `satisfies`로 객체의 Key만 엄격하게 검사하려면 어떻게 쓰는가?

## 도입

객체의 값 타입은 다양하게 허용하되, 키가 미리 정의한 집합에서만 오도록 제한하고 싶을 때 `satisfies`와 `Record<Keys, unknown>`을 조합한다.

---

## 본문

> For example, we could ensure that an object has all the keys of some type, but no more.

"예를 들어 객체가 특정 타입의 모든 키를 가지고 있지만, 그 이상은 없는지 보장할 수 있다."

```ts
type Colors = "red" | "green" | "blue";

const favoriteColors = {
  "red": "yes",
  "green": false,
  "blue": "kinda",
  "platypus": false
//  ~~~~~~~~~~ 에러: "platypus"는 Colors에 없음 ✓
} satisfies Record<Colors, unknown>;

// 각 값의 타입이 보존됨
const g: boolean = favoriteColors.green;  // green은 boolean으로 추론
const r: string = favoriteColors.red;     // red는 string으로 추론
```

- `Record<Colors, unknown>`의 `unknown`은 값의 타입을 제한하지 않는다는 뜻. 키만 검사하고 값은 자유롭게 추론하도록 허용한다.

---

## 종합

`satisfies Record<Colors, unknown>`은 "키는 Colors 집합에서만, 값은 뭐든"이라는 선언이다. 어노테이션으로 `: Record<Colors, unknown>`을 쓰면 값 타입이 모두 `unknown`으로 넓어져 구체적 추론값을 잃는다. `satisfies`를 쓰면 키 제약은 강제하면서 각 값의 추론된 구체적 타입(`boolean`, `string`)은 그대로 사용할 수 있다.

---

---

# `satisfies`로 객체의 value만 엄격하게 검사하려면 어떻게 쓰는가?

## 도입

반대로 키는 자유롭게 정하되, 값의 타입이 특정 타입과 호환되는지만 검사하고 싶을 때 `satisfies Record<string, ValueType>`을 사용한다.

---

## 본문

> Maybe we don't care about if the property names match up somehow, but we do care about the types of each property. In that case, we can also ensure that all of an object's property values conform to some type.

"프로퍼티 이름이 어떻게 맞는지는 신경 쓰지 않지만, 각 프로퍼티의 타입은 신경 쓸 수 있다. 이 경우 객체의 모든 프로퍼티 값이 특정 타입을 따르는지 보장할 수도 있다."

```ts
type RGB = [red: number, green: number, blue: number];

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0]
//  ~~~~~~ 에러: [number, number]는 RGB(3개 필요)와 맞지 않음 ✓
} satisfies Record<string, string | RGB>;

// 각 프로퍼티의 구체적 타입 보존
const redComponent = palette.red.at(0);       // red는 RGB 튜플
const greenNormalized = palette.green.toUpperCase(); // green은 string
```

- `Record<string, string | RGB>`의 `string` key 부분: 어떤 키 이름이든 허용.
- 값의 타입 검사: `string | RGB` 중 하나여야 한다.

---

## 종합

`satisfies Record<string, string | RGB>`는 "키는 뭐든, 값은 string 또는 RGB"라는 선언이다. `blue: [0, 0]`처럼 RGB 형식에 맞지 않는 값을 잡아낸다. 각 프로퍼티의 구체적 타입(string vs RGB)은 추론 그대로 유지되어 `.toUpperCase()`와 `.at(0)` 모두 타입 안전하게 사용할 수 있다.

---

---

# Type Annotation, assertion(`as`), `satisfies`는 각각 어떻게 다른가?

## 도입

[UNVERIFIED] 표시된 질문으로, User Answer 기반이다. 같은 객체에 타입을 부여하는 세 가지 방법은 목적과 결과가 다르다.

---

## 본문

세 방법의 차이를 코드로 비교한다.

```ts
type Config = { host: string; port: number };
const raw = { host: 'localhost', port: 3000, extra: 'ignored' };

// 1. Type Annotation — 타입을 지정
const a: Config = { host: 'localhost', port: 3000 };
// a의 타입 = Config
// extra 프로퍼티 추가하면 에러 발생

// 2. Type Assertion — 타입을 단언
const b = raw as Config;
// b의 타입 = Config (TypeScript가 믿어줌)
// 실제로 raw가 Config와 맞는지 검사 안 함 — 개발자 책임

// 3. satisfies — 타입을 체크만 하고 추론 결과 유지
const c = { host: 'localhost', port: 3000 } satisfies Config;
// c의 타입 = { host: string; port: number } (추론값 유지)
// Config와 호환되는지 검사는 함
```

```
비교 요약

방법             타입 검사   추론 유지   개발자 책임
-----------      --------   ---------   -----------
: Type           ✓          ✗ (넓어짐)  낮음
as Type          ✗          ✓ (as 결과) 높음 (우회)
satisfies Type   ✓          ✓           낮음 (권장)
```

---

## 종합

타입 어노테이션(`: Type`)은 변수의 타입을 선언하고 TypeScript가 그 타입으로 관리한다. 타입 단언(`as Type`)은 "내가 맞다"고 선언하는 것으로 컴파일러를 우회한다. `satisfies`는 검사만 하고 추론 결과를 유지한다. 세 중 가장 안전한 것은 `satisfies` → `: Type` → `as Type` 순이다.

---

---

# 왜 `satisfies`를 `as`보다 우선 검토해야 하는가?

## 도입

[UNVERIFIED] 표시된 질문으로, User Answer 기반이다. `as`는 편리하지만 타입 안전성을 포기하는 거래다. `satisfies`가 가능한 상황에서는 `as`보다 먼저 검토해야 하는 이유가 있다.

---

## 본문

안정성 때문이다. 타입이 틀린데도 개발자가 잘못 이해하고 단언을 해버리면 컴파일 단계에서 타입 오류를 잡을 수 없다.

```ts
// as를 잘못 쓰면 런타임에서 터짐
function some(array: number[]): void {
  console.log((array[0] as number).toString());
}

some([]); // array[0] = undefined, (undefined as number).toString() → 런타임 에러
// 컴파일은 통과 — as가 검사를 우회했기 때문

// satisfies를 썼다면
function some2(array: number[]): void {
  const first = array[0]; // first: number | undefined
  // first.toString() → 에러: undefined일 수 있음 ← 컴파일 타임에 잡힘
  if (first !== undefined) {
    console.log(first.toString()); // narrowing 후 OK
  }
}
```

```
as의 문제점

개발자가 틀려도 컴파일러가 믿어줌
  → 런타임에서야 에러 발생
  → 디버깅 비용 증가

satisfies는 실제로 검사함
  → 타입이 맞지 않으면 컴파일 에러
  → 컴파일 타임 가드레일 유지
```

---

## 종합

`as`는 TypeScript에게 "내가 이 타입이라고 확신한다"고 말하는 것이다. 개발자가 틀려도 컴파일러는 믿는다. `satisfies`는 실제로 타입 검사를 수행하므로 틀리면 컴파일러가 알려준다. TypeScript를 쓰는 이유가 컴파일 타임 오류 발견이라면, `as`는 그 이점을 포기하는 것이다. `as`가 필요한 경우(`JSON.parse` 결과, 외부 라이브러리 타입이 잘못된 경우)는 실제로 드물다 — 대부분은 `satisfies`나 narrowing으로 해결할 수 있다.
