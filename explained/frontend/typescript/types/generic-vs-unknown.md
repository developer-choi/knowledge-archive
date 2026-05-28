# 제네릭이란 무엇이며 왜 사용하는가?

## 도입

같은 로직인데 `number`용, `string`용, `boolean`용 함수를 따로 만들면 코드가 중복된다. 제네릭은 "타입을 매개변수로 받는" 기능으로, 하나의 함수/컴포넌트로 여러 타입을 처리하면서 타입 정보를 잃지 않게 한다.

---

## 본문

> Components that are capable of working on the data of today as well as the **data of tomorrow** will give you the **most flexible capabilities** for building up large software systems.

"오늘의 데이터뿐만 아니라 미래의 데이터에서도 동작할 수 있는 컴포넌트는 대규모 소프트웨어 시스템 구축을 위한 가장 유연한 역량을 제공한다."

- **data of tomorrow**: 아직 만들어지지 않은 타입에도 동작한다는 의미. 제네릭으로 만든 함수는 이후 추가되는 어떤 타입과도 동작한다.
- **most flexible capabilities**: 타입별로 함수를 따로 만들지 않아도 된다는 것이 핵심 유연성이다.

> being able to create a component that can work over a variety of types rather than a single one. This allows users to consume these components and use their own types.

"단일 타입이 아닌 다양한 타입에서 동작할 수 있는 컴포넌트를 만들 수 있다. 이를 통해 사용자가 이 컴포넌트를 사용하고 자신만의 타입을 사용할 수 있다."

> This allows us to traffic that type information in one side of the function and out the other.

"이를 통해 함수의 한쪽으로 타입 정보를 넣고 다른 쪽으로 내보낼 수 있다."

- **traffic that type information**: 타입이 함수를 통과하면서 보존된다는 뜻. `number`를 넣으면 `number`가 나온다. `any`를 쓰면 타입 정보가 사라지지만, 제네릭은 보존한다.

```ts
// 제네릭 없이 — 타입별 함수 중복
function identityNumber(arg: number): number { return arg; }
function identityString(arg: string): string { return arg; }
function identityBoolean(arg: boolean): boolean { return arg; }

// 제네릭으로 — 하나의 함수
function identity<T>(arg: T): T { return arg; }

const num = identity(42);     // T = number, 반환 타입도 number
const str = identity('hello'); // T = string, 반환 타입도 string
```

제네릭은 최소 조건(제약)을 설정하는 데도 쓸 수 있다.

```ts
// 최소 조건: 배열이어야 한다
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length); // T[]는 length가 있음이 보장됨
  return arg;
}

// extends로 최소 조건 설정
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

```
제네릭 vs any 비교

function identity<T>(arg: T): T   → 입력과 출력 타입이 연결됨
function identity(arg: any): any  → 입력이 number여도 출력을 any로 다루게 됨

identity(42).toFixed(2)   // 제네릭: OK (number.toFixed)
identity(42).toFixed(2)   // any 버전: 컴파일 에러 없음, 타입 안전성 없음
```

---

## 종합

제네릭은 "타입을 모르지만 타입 정보를 보존해야 할 때" 쓴다. `any`는 타입 정보를 버리지만 제네릭은 전달한다. 라이브러리 함수, 공통 유틸, React 훅처럼 다양한 타입을 받아야 하는 코드에서 제네릭은 필수다. `useState<number>(0)`이 number 배열로 `[number, Dispatch<SetStateAction<number>>]`를 반환하는 것도 제네릭 덕분이다.

---

---

# 제네릭과 Unknown 중 선택이 리팩토링에 어떤 영향을 미치는가?

## 도입

[UNVERIFIED] 표시된 질문으로, User Answer 기반이다. 함수가 반환하는 타입을 제네릭으로 받을지, `unknown`으로 받고 호출부에서 단언할지 선택에 따라 나중에 타입을 변경할 때 수정 범위가 달라진다.

---

## 본문

제네릭과 `unknown` 방식의 차이를 코드로 비교한다.

```ts
// 방법 1. Generic 사용
export function getDataFromNativeApp<D>(key: string): D {
  return window.flutter_webview(key) as D;
}

function HomePage(): void {
  // 호출 시점에 타입을 명시 (<number>)
  const expiredAt: number = getDataFromNativeApp<number>('promotion-modal');
}

// 방법 2. Unknown 사용
export function getDataFromNativeApp(key: string): unknown {
  return window.flutter_webview(key);
}

function HomePage(): void {
  // 호출 결과에 대해 타입 단언 (as number)
  const expiredAt = getDataFromNativeApp('promotion-modal') as number;
}
```

타입이 `number`에서 `string`으로 바뀌면:

```
제네릭 방식: 사용하는 부분만 수정
  getDataFromNativeApp<string>('promotion-modal')
  expiredAt.padStart(...)  ← 사용 코드 수정

unknown + as 방식: 두 곳을 수정
  getDataFromNativeApp('promotion-modal') as string  ← as 수정
  expiredAt.padStart(...)  ← 사용 코드 수정
```

---

## 종합

제네릭 방식은 타입이 함수 호출부(`<number>`)에서 한 곳에만 지정되므로 바꿀 때 하나만 고치면 된다. `unknown + as` 방식은 `as number`(단언부)와 실제 사용 코드 두 곳을 모두 수정해야 한다. 코드베이스가 클수록 수정 범위 차이가 커진다. 타입을 함수 외부에서 주입받는 구조라면 제네릭이 더 유지보수하기 좋고, 함수가 항상 `unknown`을 반환하고 호출부마다 다르게 처리한다면 `unknown`이 더 명확할 수 있다.
