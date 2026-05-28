# [UNVERIFIED] 프로토타입 체이닝이란 무엇이고, 자바스크립트에서 어떻게 동작하는가?

## 도입

Java나 Python 같은 클래스 기반 언어는 클래스 상속으로 부모의 메서드를 자식이 쓸 수 있게 한다. JS는 클래스 문법(`class`)이 있어도 내부는 프로토타입으로 동작한다. 객체끼리 `[[Prototype]]` 링크로 연결된 체인이 상속을 구현한다.

---

## 본문

프로토타입 체이닝은 OA 없이 실무 원칙으로 정리한다.

배열 객체 `[1, 2, 3]`을 만들면 JS 엔진은 내부적으로 아래 체인을 구성한다:

```
[1, 2, 3]  (Array 인스턴스)
  └── [[Prototype]] → Array.prototype
                        ├── push, pop, map, filter, ...
                        └── [[Prototype]] → Object.prototype
                                              ├── toString, hasOwnProperty, ...
                                              └── [[Prototype]] → null (체인 끝)
```

DevTools 콘솔에서 직접 확인할 수 있다:

```js
const array = [1, 2, 3];

array.__proto__
// [constructor: f, at: f, concat: f, copyWithin: f, fill: f, …]
// → Array.prototype

array.__proto__.__proto__
// {constructor: f, __defineGetter__: f, hasOwnProperty: f, toString: f, …}
// → Object.prototype

array.__proto__.__proto__.__proto__
// null → 체인의 끝
```

`array.toString()`을 호출하면:
1. `array` 인스턴스 자체에 `toString` 있는가? → 없음
2. `Array.prototype`에 `toString` 있는가? → 있음 (배열을 `'1,2,3'` 형태로 변환하는 버전)
3. 발견 → 실행

`array.hasOwnProperty`를 호출하면:
1. `array` 인스턴스 자체에? → 없음
2. `Array.prototype`에? → 없음
3. `Object.prototype`에? → 있음 → 실행

---

## 종합

프로토타입 체이닝이 없다면 `[1, 2, 3].map()`, `[1, 2, 3].toString()` 같은 메서드가 배열마다 개별적으로 복사되어 저장되어야 한다. 체이닝 덕분에 메서드는 `Array.prototype`에 하나만 있고 모든 배열 인스턴스가 공유한다 — 메모리 효율이 높아진다. ES6 `class` 문법을 써도 내부적으로는 이 프로토타입 체인이 그대로 쓰인다.

---

---

# [UNVERIFIED] 객체에서 메소드(프로퍼티)를 호출하면 어떤 순서로 탐색되는가?

## 도입

객체에서 프로퍼티를 읽을 때 JS 엔진은 "가장 가까운 곳에서 먼저 찾는다"는 규칙으로 체인을 타고 올라간다. 가장 가까운 곳에서 찾으면 거기서 멈춘다 — 더 위에 같은 이름이 있어도 무시된다.

---

## 본문

프로퍼티 탐색 순서는 OA 없이 실무 원칙으로 정리한다.

```
탐색 순서:
1. 객체 자신 (own properties)
2. 없으면 → [[Prototype]] (첫 번째 상위)
3. 없으면 → 그 상위의 [[Prototype]]
4. ...계속
5. null에 도달하면 → undefined 반환 (에러 없음)
```

인스턴스에 같은 이름의 프로퍼티를 직접 추가하면 체인 상위의 메서드를 "가린다(shadow)":

```js
const array = [1, 2, 3];

array.toString();
// 탐색: array 자신 → 없음
//       Array.prototype → toString() 있음 → '1,2,3' 반환

// 인스턴스에 직접 toString 추가
array.toString = () => console.log('Call toString method');

array.toString();
// 탐색: array 자신 → toString 있음 → 즉시 실행
// Array.prototype.toString는 사용되지 않음

array.toString = undefined; // 다시 제거하면
delete array.toString;
array.toString(); // '1,2,3' — 다시 체인을 타고 Array.prototype에서 찾음
```

---

## 종합

탐색이 "가장 가까운 곳 우선"이기 때문에 인스턴스에 프로퍼티를 추가하면 체인 위의 메서드를 재정의(override)한 것처럼 동작한다. React의 클래스 컴포넌트에서 `render()`를 정의하면 `Component.prototype.render`를 인스턴스 레벨에서 가리는 것이 이 원리다. 프로토타입 체인을 이해하면 `obj.hasOwnProperty(key)`와 `key in obj`의 차이도 자연스럽게 이해된다 — 전자는 자신의 own property만 확인하고, 후자는 체인 전체를 탐색한다.
