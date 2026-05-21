# Mapped Type — `[K in keyof T]`로 키 구조 변환

```ts
interface ErrorInstances {
  AError: AError;
  BError: BError;
  CError: CError;
}

interface Result {
  AError: (error: AError) => void;
  BError: (error: BError) => void;
  CError: (error: CError) => void;
}
```

위에를 아래처럼 바꾸려면

```ts
type ErrorHandlerTable = {
  [K in keyof ErrorInstances]: (error: ErrorInstances[K]) => void;
};
```

이렇게 하면 된다.
