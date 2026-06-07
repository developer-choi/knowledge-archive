# iteration protocol이란 무엇인가? 새로운 문법인가?

## 도입

`for...of`로 배열을 돌리는 그 "순회"의 밑바닥에 깔린 약속이 iteration protocol이다. 이름이 거창하지만 새 문법이나 새 객체가 아니라, **"이런 키에 이런 메서드를 두면 순회 가능한 것으로 친다"는 관례**일 뿐이다.

## 본문

> Iteration protocols aren't new built-ins or syntax, but protocols. These protocols can be implemented by any object by following some conventions.

iteration protocol은 새 내장 객체나 문법이 아니라 **protocol(약속)**이고, 어떤 객체든 관례만 따르면 구현할 수 있다.

- **protocols**: `class`·`for`처럼 언어에 박힌 키워드가 아니라, "특정 키에 특정 모양의 메서드를 두기로 한 합의". 내 클래스도 그 합의를 따르면 순회 가능해진다.

> There are two protocols: The iterable protocol and the iterator protocol.

protocol은 둘이다 — **iterable protocol**과 **iterator protocol**.

### 헷갈리는 형제들 구분

이름이 다 비슷해서 뭐가 뭔지 엉킨다. 특히 `Symbol.iterator`(키)와 iterator(객체)를 같은 것으로 착각하기 쉽다. 정체를 분리하면:

| 용어 | 정체 | 한마디 |
|---|---|---|
| `Symbol.iterator` | **키(이름)** | iterable이 순회 메서드를 달 때 쓰는 well-known symbol 열쇠 이름 |
| iterable | **객체** | `[Symbol.iterator]()` 메서드를 가진 객체 |
| iterator | **객체** | `next()` 메서드를 가진 객체 |
| iterator protocol | **규약/인터페이스** | "iterator는 `next()`로 정해진 모양의 객체를 반환해야 한다"는 약속 |

핵심은 `Symbol.iterator`가 **이름(키)**일 뿐 객체가 아니라는 것, 그리고 iterable과 iterator는 **서로 다른 역할의 객체**라는 것이다.

## 종합

iteration protocol은 새 문법이 아니라 "약속"이며, 순회 "당하는" 쪽(iterable)과 값을 하나씩 꺼내주는 쪽(iterator)이라는 **두 역할의 약속**으로 나뉜다. 이 둘을 구분하는 게 전체 이해의 출발점이다.

---

# 객체가 iterable이 되려면 무엇을 구현해야 하는가?

## 도입

iterable은 "순회할 수 있는 객체"다. 무엇을 갖추면 iterable로 인정되는지, 그리고 왜 iterator와 별개로 존재하는지를 본다.

## 본문

> In order to be iterable, an object must implement the [Symbol.iterator]() method, meaning that the object (or one of the objects up its prototype chain) must have a property with a [Symbol.iterator] key which is available via constant Symbol.iterator. [Symbol.iterator]() is a zero-argument function that returns an object, conforming to the iterator protocol.

iterable이 되려면 **`[Symbol.iterator]()` 메서드**를 가져야 한다 — 자신이든 **프로토타입 체인 위의 객체**든. 그 메서드는 **매개변수 없이 iterator(iterator protocol을 따르는 객체)를 반환**한다.

- **(or one of the objects up its prototype chain)**: 객체 자신에 직접 없어도 된다. `Array` 인스턴스엔 `[Symbol.iterator]`가 없고 `Array.prototype`에 있어 상속받는다 — 그래서 모든 배열이 iterable.
- **zero-argument ... returns ... iterator**: 인자 없이 호출되어 iterator를 내놓는다. 여기서 iterable과 iterator가 이어진다 — iterable의 그 메서드를 부르면 **iterator가 나온다.**

> Whenever an object needs to be iterated (such as at the beginning of a for...of loop), its [Symbol.iterator]() method is called with no arguments, and the returned iterator is used to obtain the values to be iterated.

순회가 필요한 순간(`for...of` 시작 등) `[Symbol.iterator]()`가 자동 호출되고, **반환된 iterator로 값을 얻는다.** `for...of`가 내부적으로 하는 첫 동작이 `obj[Symbol.iterator]()`다.

### 책 vs 책갈피 — 왜 iterable과 iterator를 분리했나

비유로 잡으면:

- **iterable = 책**(저장된 데이터). "날 읽고 싶어? 책갈피 줄게" 하는 존재. **자기는 순회 위치를 안 들고 있다.**
- **iterator = 책갈피**(커서). 지금 몇 번째인지(위치)를 들고, `next()`로 다음을 내준다.

`iterable[Symbol.iterator]()`를 호출할 때마다 **새 책갈피(위치 0부터)**가 발급된다. 분리한 이유는 **한 컬렉션을 동시에·여러 번 순회**하기 위함이다:

```js
const arr = [1, 2];
for (const a of arr)
  for (const b of arr)   // 1,1 1,2 2,1 2,2 — 정상
    console.log(a, b);
```

이게 되는 건 안쪽·바깥쪽 루프가 **각자 자기 책갈피**를 받기 때문이다. 만약 책과 책갈피가 한 몸이면(배열 자신이 위치를 들면) 안쪽 루프가 위치를 끝까지 밀어 바깥 루프가 깨진다. 그래서 **데이터(iterable)와 위치를 든 커서(iterator)를 분리**한 것이다.

### `this`로 순회 대상을 정한다

> Note that when this zero-argument function is called, it is invoked as a method on the iterable object. Therefore inside of the function, the this keyword can be used to access the properties of the iterable object, to decide what to provide during the iteration.

`[Symbol.iterator]()`는 iterable 객체의 **메서드로 호출**되므로, 함수 안 `this`는 그 iterable 자신이다. `this`로 자기 내부 데이터를 읽어 무엇을 순회시킬지 정한다.

### 일반 함수로도, 제너레이터로도 — "나는 next()를 짠 적이 없는데?"

> This function can be an ordinary function, or it can be a generator function, so that when invoked, an iterator object is returned. Inside of this generator function, each entry can be provided by using yield.

`[Symbol.iterator]()`는 일반 함수일 수도, **제너레이터 함수**일 수도 있고, 어느 쪽이든 iterator를 반환한다.

**제너레이터(`function*`/`yield`)를 쓰면 `next()`를 직접 구현하지 않아도 iterator가 만들어진다.** 제너레이터 함수는 호출되면 자동으로 `next()`를 가진 객체(제너레이터 객체)를 반환하고, `yield`가 "`next()` 1회 호출 = 다음 값 반환"으로 번역된다. 즉 제너레이터가 `next()`를 대신 합성해줘서, 손으로 `next()`를 안 짜도 iterator가 만들어진 것이다. (일반 함수로 짠다면 `next()`와 반환 객체를 직접 작성해야 한다.)

## 종합

iterable의 조건은 단 하나 — **자신 또는 프로토타입 체인에 `[Symbol.iterator]()` 메서드(매개변수 없이 iterator를 반환)를 갖는 것**. 이 메서드는 호출될 때마다 처음부터 도는 **새 iterator(책갈피)**를 발급하므로 같은 컬렉션을 여러 번·중첩 순회할 수 있다. iterator와 분리한 이유가 바로 이 "위치를 든 커서를 데이터에서 떼어냄"이다. 제너레이터로 구현하면 `next()`가 자동 합성된다.

---

# iterator란 무엇이며, 어떤 메서드를 구현해야 iterator가 되는가?

## 도입

iterable이 "책"이라면 iterator는 실제로 값을 하나씩 꺼내주는 "책갈피(커서)"다. 무엇을 갖추면 iterator인지 본다.

## 본문

> The iterator protocol defines a standard way to produce a sequence of values (either finite or infinite), and potentially a return value when all values have been generated. An object is an iterator when it implements a next() method with the following semantics.

iterator는 **값의 시퀀스(유한이든 무한이든)를 하나씩 생산**하는 표준 방식을 구현한 객체이고, **`next()` 메서드를 가지면 iterator**다.

- **next()**: iterator의 자격 조건. iterable의 자격이 `[Symbol.iterator]()`였던 것과 **구분**된다 — iterable은 `[Symbol.iterator]()`, iterator는 `next()`.
- **finite or infinite**: 끝이 있는 수열도, 끝없는 수열(무한 카운터)도 같은 `next()` 방식으로 표현된다.

## 종합

iterator의 정의는 군더더기 빼면 **"`next()` 메서드를 가진 객체"**다. iterable(`[Symbol.iterator]()`로 책갈피를 발급)과 iterator(`next()`로 값을 생산)는 역할이 다른 별개 객체이고, iterable의 `[Symbol.iterator]()`를 호출하면 iterator가 나온다 — 이 둘의 연결이 JS 순회의 뼈대다.

---

# iterator의 next()는 무엇을 반환해야 하며, 그 반환 객체 안의 필드들은 각각 무엇을 의미하는가?

## 도입

iterator의 심장인 `next()`가 무엇을 돌려주는지를 본다. `for...of`가 값을 받아오는 실체가 여기 있다.

## 본문

> next() is a function that accepts zero or one argument and returns an object conforming to the IteratorResult interface. If a non-object value gets returned (such as false or undefined) when a built-in language feature (such as for...of) is using the iterator, a TypeError ("iterator.next() returned a non-object value") will be thrown.

`next()`는 **IteratorResult 인터페이스를 따르는 객체를 반환**한다. 반드시 **객체**여야 하며, `false`·`undefined` 같은 비객체를 반환하면 `for...of` 등에서 **TypeError**가 난다.

> done — A boolean that's false if the iterator was able to produce the next value in the sequence. Has the value true if the iterator has completed its sequence. value — Any JavaScript value returned by the iterator. Can be omitted when done is true.

반환 객체의 두 필드:

- **done**: 시퀀스가 끝났는지의 boolean. 아직 값을 만들어냈으면 `false`, 끝났으면 `true`. (`true`일 때 `value`는 최종 반환값으로 선택적)
- **value**: iterator가 이번에 꺼낸 값. `for...of`에서 변수에 담기는 그 값. `done`이 `true`면 생략 가능.

> In practice, neither property is strictly required; if an object without either property is returned, it's effectively equivalent to { done: false, value: undefined }.

실제로 두 필드 다 필수는 아니다 — 둘 없는 객체를 반환하면 `{ done: false, value: undefined }`로 취급된다. (단 **객체이긴 해야** 한다.)

## 종합

`next()`는 호출될 때마다 **`{ value, done }` 모양의 객체(IteratorResult)**를 반환한다. `value`는 이번 값, `done`은 끝 여부. `done: false`인 동안 값을 계속 내놓다가 `done: true`로 끝을 알린다. 반환이 객체가 아니면 TypeError. 정리하면 **iterable의 `[Symbol.iterator]()`가 iterator를 주고, 그 iterator의 `next()`가 `{value, done}`을 하나씩 내주는 게 JS 순회의 2단 구조**다.
