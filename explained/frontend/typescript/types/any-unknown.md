# `unknown` 타입이란 무엇인가?

## 도입

`unknown`은 TypeScript 3.0에서 추가된 타입으로, `any`처럼 모든 값을 할당받을 수 있다. 하지만 결정적으로 다른 점이 있다 — `unknown` 값은 타입을 좁히기(narrowing) 전에는 아무것도 할 수 없다. 이 제약이 `unknown`을 타입 안전한 `any`로 만든다.

---

## 본문

> The `unknown` type represents any value. This is similar to the `any` type, but is safer because it's not legal to do anything with an `unknown` value.

"unknown 타입은 모든 값을 나타낸다. any 타입과 유사하지만, unknown 값으로 아무것도 하는 것이 합법적이지 않기 때문에 더 안전하다."

- **represents any value**: 어떤 타입의 값도 unknown에 할당할 수 있다. `const x: unknown = 42`, `const y: unknown = 'hello'` 모두 가능.
- **not legal to do anything with an unknown value**: unknown으로 받은 값은 `.length`, `.toUpperCase()`, 함수 호출 등 어떤 연산도 할 수 없다. 컴파일 에러가 난다.

> In cases where you don't know what type you want to accept, or when you want to accept anything because you will be blindly passing it through without interacting with it, you can use `unknown`.

"어떤 타입을 받고 싶은지 모르거나, 상호작용 없이 그냥 통과시킬 것이기 때문에 무엇이든 받고 싶을 때 unknown을 사용할 수 있다."

- **blindly passing it through without interacting with it**: 값의 타입을 알 필요 없이 그대로 전달만 하는 경우. 예를 들어 로거 함수는 어떤 값이 와도 `JSON.stringify`로 직렬화하면 되니 타입을 알 필요가 없다.

> Anything is assignable to **unknown**, but **unknown** isn't assignable to anything but itself and any without a type assertion or a control flow based narrowing.

"모든 것은 unknown에 할당할 수 있지만, unknown은 타입 단언이나 제어 흐름 기반 narrowing 없이는 자기 자신과 any 외에는 아무것에도 할당할 수 없다."

```ts
// 할당: 어떤 타입이든 unknown에 넣을 수 있음
const a: unknown = 42;
const b: unknown = 'hello';
const c: unknown = { name: 'Kim' };

// 사용: narrowing 없이는 아무것도 할 수 없음
function process(value: unknown) {
  // value.length;       // 에러: unknown에는 length가 없음
  // value.toUpperCase(); // 에러

  // narrowing 후 사용 가능
  if (typeof value === 'string') {
    return value.toUpperCase(); // OK
  }
  if (typeof value === 'number') {
    return value.toFixed(2);   // OK
  }
}

// any에는 할당 불가 (타입 단언 없이)
const num: number = a; // 에러
const num2: number = a as number; // OK (타입 단언)
```

```
unknown vs any 할당 규칙

값 → unknown  ✓ (어떤 값이든 OK)
unknown → 값  ✗ (narrowing 없으면 불가)

값 → any      ✓
any → 값      ✓ (타입 검사 건너뜀 — 위험)
```

---

## 종합

`unknown`을 쓰면 "타입을 모른다"는 사실을 컴파일러에게 명시하면서, 동시에 컴파일러가 타입 확인을 강제하도록 만든다. `any`를 쓰면 "타입 검사를 포기한다"는 선언이다. API 응답, `JSON.parse` 결과, 외부 데이터처럼 타입을 모르는 값이 들어올 때 `any` 대신 `unknown`을 쓰면 — 이후 코드에서 타입을 좁히지 않으면 컴파일러가 에러를 낸다. 이것이 `unknown`이 "타입 안전한 any"인 이유다.

---

---

# `any` 타입이란 무엇인가?

## 도입

`any`는 TypeScript의 타입 시스템을 선택적으로 빠져나갈 수 있는 탈출구다. 편리하지만, `any`를 쓰는 순간 그 값에 대한 컴파일 타임 보호가 사라진다.

---

## 본문

> TypeScript also has a special type, `any`, that you can use whenever you don't want a particular value to cause typechecking errors.

"TypeScript에는 특정 값이 타입 검사 에러를 일으키지 않도록 하고 싶을 때 사용할 수 있는 특별한 타입 `any`도 있다."

- **don't want a particular value to cause typechecking errors**: 타입을 알 수 없거나, 임시로 타입 오류를 억제하고 싶을 때 사용한다. 장기적으로는 `unknown`이나 명확한 타입으로 교체하는 것이 좋다.

> When a value is of type `any`, you can access any properties of it (**which will in turn be of type `any`**), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that's syntactically legal.

"값이 any 타입이면, 그것의 어떤 프로퍼티에도 접근하고(**그것들은 차례로 any 타입이 된다**), 함수처럼 호출하고, 어떤 타입의 값에도 할당(하거나 받거나)하거나, 문법적으로 합법적인 거의 모든 것을 할 수 있다."

- **which will in turn be of type `any`**: `any`의 전파성. `obj.property`의 결과도 `any`, `obj.property.nested`도 `any`. 한 번 any로 들어오면 체인 전체가 any로 물든다.
- **syntactically legal**: 문법 오류가 아닌 이상 무엇이든 허용한다. `.length`, `()`, `['key']` 등 모두 가능. 하지만 런타임에서는 에러가 날 수 있다.

```ts
let value: any = 42;

// 컴파일 에러 없음 — 하지만 런타임 에러 위험
value.toUpperCase();          // 숫자에 toUpperCase 없음 → 런타임 에러
value();                      // 함수가 아님 → 런타임 에러
value.deeply.nested.property; // 런타임 에러

// any 전파
const x: any = {};
const y = x.property;    // y도 any
const z = y.nested;      // z도 any — 체인 전체가 any

// 다른 타입에 자유롭게 할당
const num: number = value;    // 에러 없음 (위험)
const str: string = value;    // 에러 없음 (위험)
```

---

## 종합

`any`는 TypeScript를 도입하는 초기에 JavaScript 코드를 점진적으로 마이그레이션할 때 유용하다. 하지만 `any`를 남용하면 컴파일 타임 보호가 사라지고, 타입 오류가 런타임에야 발견된다. TypeScript를 쓰는 이유가 컴파일 타임 가드레일인데, `any`는 그 가드레일을 걷어내는 것이다. `any`를 써야 할 것 같다면 먼저 `unknown`으로 받고 narrowing하는 방법을 시도한다. 그것도 어려우면 타입 단언(`as Type`)을 최후 수단으로 사용한다.
