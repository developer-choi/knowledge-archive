# Array

## Reduce — initial value 외부 선언 금지

```ts
const INITIAL: Record<string, string[]> = {
  value1: ['대충 복잡한 초기화 조건'],
  value2: ['대충 복잡한 초기화 조건'],
  value3: ['대충 복잡한 초기화 조건'],
  value4: ['대충 복잡한 초기화 조건'],
  value5: ['대충 복잡한 초기화 조건'],
  value6: ['대충 복잡한 초기화 조건']
};

function someReduce() {
  const localVar = '대충 선언한 지역변수';

  return [].reduce((a, b) => {
    a.some = a.some.concat(b + localVar + '대충 복잡한 로직');
    return a;
  }, INITIAL);
}
```

Reduce에 전달되는 initial value는 절대로 외부에서 만들면 안 된다.

Reduce가 실행이 종료되면 지역변수는 다 날아가는 게 맞지만, 외부에서 선언한 initial value는 유지가 되기 때문에, Reduce가 실행될 수록 의도하지 않은 버그가 발생한다.

## Tip

`Array.isArray()` = `instanceof Array`
