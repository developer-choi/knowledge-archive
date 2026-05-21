# Class

## readonly

```ts
class Parent {
  readonly obj: {value: string;};
  constructor() {
    this.obj = {
      value: 'parent'
    }
  }
}

class Children extends Parent {
  constructor() {
    super();
    this.obj.value = 'children';
    this.obj = {value: 'some'}
  }
}
```

오해했던 게 있었음. readonly 해도 접근해서 수정은 가능함.

그래서 readonly는 외부에서 수정 못하게 private / protected를 같이 거는 게 좋을 듯.

## static methods

> Static methods are often used to create utility functions for an application, whereas static properties are useful for caches,
> fixed-configuration, or any other data you don't need to be replicated across instances.

1. utility functions
2. caches
3. fixed-configuration
4. **any other data you don't need to be replicated across instances.**

method에서 instance member에 접근하는 게 없으면 static 붙이자. 인스턴스마다 공유할 메소드, 인스턴스마다 할당될 필요가 없는 메소드에 static 붙임. static field도 마찬가지이긴 한데 적절한 예제가 없네.

> Static members can also use the same public, protected, and private visibility modifiers:
> Static members are also inherited:

## Supported features

- readonly (final 대신)
- modifier access

## Initializing order

1. The **base class fields** are initialized
2. The **base class constructor** runs
3. The **derived class fields** are initialized
4. The **derived class constructor** runs

## field

```ts
export class Singleton {
  private static INSTANCE: Singleton = new Singleton()
}
```

field에서 저렇게 initialize하면, 해당 객체를 사용하려고 (`Singleton.getInstance()`) 하기 전부터 메모리를 할당하기 때문에 어떻게 보면 낭비라고 할 수 있음.

## abstract class

```ts
abstract class Base {
  // length: number; 이렇게 쓰면 에러가 발생함.
  abstract length: number; // 이렇게 쓰면 에러가 발생하지않음.
}
```

> If you don't put the Abstract keyword on the member in the Abstract Class, it's not Abstract.
>
> I have misunderstood it was basically Abstract.

## constructor()에서 protected / final fields 흉내내는 법

```ts
/**
 * 모든 커스텀 에러에 공통적으로 적용되야하는 설계를 반영
 */
export abstract class CustomError extends Error {
  readonly abstract name: string;
  // readonly platform: 'server' | 'client'; 공통적으로 적용하고싶은 로직이 있다면 적용

  protected constructor(message: string, cause?: Error) {
    super(message, {cause});
    // this.platform = isServer() ? 'server' : 'client';
  }
}
```

abstract class를 만들었다면 constructor는 굳이 public일 이유가 없음. protected 붙여주자.

final keyword 역시 readonly로 똑같이 재현할 수 있음.
