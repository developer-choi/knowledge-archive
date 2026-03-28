---
tags: [typescript, comparison, concept]
---
# Questions
- [제네릭이란 무엇이며 왜 사용하는가?](#제네릭이란-무엇이며-왜-사용하는가)
- [[TODO] unknown으로 만드는거랑 Generic으로 만드는거랑 무슨차이?](#unknown으로-만드는거랑-generic으로-만드는거랑-무슨차이)
  - [[TODO] unknown 타입이랑 연계되는 다른 타입이랑 서로 관련을 이어주려고?](#todo-unknown-타입이랑-연계되는-다른-타입이랑-서로-관련을-이어주려고)
- [[TODO] <T extends unknown> 은 왜 의미없는 코드?](#todo-t-extends-unknown-은-왜-의미없는-코드)
- [제네릭과 Unknown 중 선택이 리팩토링에 어떤 영향을 미치는가?](#제네릭과-unknown-중-선택이-리팩토링에-어떤-영향을-미치는가)
- [[TODO] generic 쓰나 unknown 쓰나 똑같이 타입을 아 그럴거다 라고 생각하고 전달하는건데 저 경우에는 어떤 방식이 더 좋은가요?](#todo-generic-쓰나-unknown-쓰나-똑같이-타입을-아-그럴거다-라고-생각하고-전달하는건데-저-경우에는-어떤-방식이-더-좋은가요)

---

# Answers

## 제네릭이란 무엇이며 왜 사용하는가?

### Official Answer
Components that are capable of working on the data of today as well as the **data of tomorrow** will give you the **most flexible capabilities** for building up large software systems.

being able to create a component that can work over a variety of types rather than a single one.

This allows users to consume these components and use their own types.

This allows us to traffic that type information in one side of the function and out the other.

> #### AI Annotation:
> 다음과 같이 타입별로 함수를 여러 개 만들지 않기 위해 사용합니다.
> ```typescript
> converter(value: number): number
> converter(value: string): string
> converter(value: boolean): boolean
> ```

Let’s say that we’ve actually intended this function to work on arrays of Type rather than Type directly.

Since we’re working with arrays, the .length member should be available.

We can describe this just like we would create arrays of other types:

```typescript
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  // Property 'length' does not exist on type 'Type'.
  return arg;
}
```

```typescript
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```

> #### User Annotation:
> - 제네릭은 아무 타입이나 다 받기위해 쓰는것 외에도,
> - 최소조건을 설정할 때 쓸 수 있다. (최소한 배열 형태여야 한다 등)
> - (extends 문법으로도 이걸 달성가능)

### Reference
- https://www.typescriptlang.org/docs/handbook/2/generics.html

---

## [TODO] unknown으로 만드는거랑 Generic으로 만드는거랑 무슨차이?

### Official Answer

### Reference

---

## [TODO] unknown 타입이랑 연계되는 다른 타입이랑 서로 관련을 이어주려고?

### Official Answer

### Reference

---

## [TODO] <T extends unknown> 은 왜 의미없는 코드?

### Official Answer

### Reference

---

## 제네릭과 Unknown 중 선택이 리팩토링에 어떤 영향을 미치는가?

### User Answer

```typescript
// 방법 1. Generic 사용
export function getDataFromNativeApp<D>(key: string): D {
    return window.flutter_webview(key) as D;
}

function HomePage() : void {
    // 호출 시점에 타입을 명시 (<number>)
    const expiredAt : number = getDataFromNativeApp<number>('promotion-modal');
}

// 방법 2. Unknown 사용
export function getDataFromNativeApp(key: string): unknown {
    return window.flutter_webview(key);
}

function HomePage() : void {
    // 호출 결과에 대해 타입 단언 (as number)
    const expiredAt = getDataFromNativeApp('promotion-modal') as number;
}
```

타입 바뀔 때 수정범위 차이가 남.

- **제네릭**: 사용하는 부분만 수정해야함.
- **as**: 함수 호출부분 (as 쓴거) 수정 + 사용하는 부분 둘 다 수정해야함.

### Reference
- https://www.typescriptlang.org/docs/handbook/2/generics.html

---

## [TODO] generic 쓰나 unknown 쓰나 똑같이 타입을 아 그럴거다 라고 생각하고 전달하는건데 저 경우에는 어떤 방식이 더 좋은가요?

### Official Answer

### Reference
- https://www.typescriptlang.org/docs/handbook/2/generics.html
