# Map

## Definition

The Map object holds key-value pairs and remembers the original **insertion order** of the keys.

- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

## Map vs Object

[MDN: Objects vs. Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#objects_vs._maps)

### Key types

- Map = can be any value (including functions, objects, or any primitive).
- Object = must be either a String or a Symbol.

함수도 키로 쓸 수 있다는 건 신기하네;

### key order

- Map은 보장됨
- Object는 보장은 되지만 권장하지 않음.

### size()

> Determining the number of items in an Object is more roundabout and less efficient. A common way to do it is through the `length` of the array returned from `Object.keys()`.

그치 한번씩 `Object.keys().length` 많이 했었는데, 그럴바엔 Map 쓸걸…

### iteration

```js
map.forEach((value, key) => {
  console.log({key, value});
});

for(const [key, value] of map) {
  console.log({key, value});
}
```

Object는 안 되서 `entries()` 하고… `fromEntries()` 또 하고… 그랬는데… 그럴바엔 Map 쓸걸…

### Performance

- Map = Performs better in scenarios involving **frequent additions** and **removals** of key-value pairs.
- Object = **Not optimized** for frequent additions and removals of key-value pairs.

### Serialization / parsing

- Map은 가능은 하지만 코드가 좀 더 필요
- Object는 걍 바로 가능. `JSON.stringify()` / `JSON.parse()`

## Caveat — 삽입·삭제는 메소드를 통해야 함

```js
const wrongMap = new Map();
wrongMap["bla"] = "blaa";
wrongMap["bla2"] = "blaaa2";
```

이런 거 안 됨.

## Usage

### 변환

```ts
const array: [number, number][] = [...map];
```

`Array.from()`도 되며, key, value가 튜플로 변환됨.

### Cloning and merging Maps

```js
const original = new Map([[1, "one"]]);

const clone = new Map(original);

console.log(clone.get(1)); // one
console.log(original === clone); // false (useful for shallow comparison)
```
