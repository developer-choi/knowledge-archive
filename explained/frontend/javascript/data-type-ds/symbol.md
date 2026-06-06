# Symbol이란 무엇이고, 다른 원시값과 결정적으로 다른 점은?

## 도입

JS 값은 두 부류다. **primitive**(원시값: string, number, boolean, null, undefined, **symbol**, bigint)와 **object**. Symbol은 ES6에서 추가된 원시 타입으로, "생성할 때마다 유일한 값"이라는 특이한 성격을 가진다. 다른 원시값과 결정적으로 다른 점은 뒤에서 볼 **참조 동일성**이다.

## 본문

> Symbol is a built-in object whose constructor returns a symbol primitive — also called a Symbol value or just a Symbol — that's guaranteed to be unique.

Symbol은 내장 객체이고, 그 생성자를 호출하면 유일성이 보장된 symbol 원시값을 돌려준다.

- **built-in object**: 언어에 기본 내장된 전역 객체. `Symbol`이라는 이름으로 항상 존재한다.
- **guaranteed to be unique**: "유일성이 보장됨" — 같은 인자로 만들어도 절대 같지 않다. symbol의 존재 이유.

> Every Symbol() call is guaranteed to return a unique Symbol.

`Symbol()` 호출은 매번 유일한 Symbol을 반환한다. 그래서 `Symbol("foo") === Symbol("foo")`는 `false` — description `"foo"`는 라벨일 뿐 정체성과 무관하다.

### "유일하다"의 진짜 의미 — 값 동일성 vs 참조 동일성

"동일성(identity)"은 *두 값이 같은가를 어떻게 판단하는가*의 방식이고, 두 종류가 있다.

- **값 동일성(value identity)** — 보통의 원시값: `42 === 42`, `"foo" === "foo"`는 `true`. `42`는 "어느 42냐"를 따지지 않는다. **내용이 같으면 무조건 같은 것**이고, 세상에 `42`는 하나의 개념으로 존재한다.
- **참조 동일성(reference identity)** — 객체: `{} === {}`는 `false`. 내용이 같아도 **"만들어진 그 인스턴스 자체"가 같아야** 같다고 본다. 객체는 개체마다 고유한 정체성을 가진다.

symbol은 **원시값인데도 이 객체식 참조 동일성**을 가진다. `Symbol("foo") === Symbol("foo")`가 `false`인 게 그 증거다. "같은 symbol을 두 번 만들 수 없다"는 말이 이 뜻 — 매번 고유한 정체성을 가진 새 symbol이 생긴다. 이것이 **"참조 동일성을 가진 유일한 원시 타입"**이라는 표현의 의미다. 다른 원시(string·number…)는 전부 값 동일성인데 symbol만 예외다.

---

# Symbol을 객체의 속성 키로 쓰면 어떤 이점이 있는가?

## 도입

symbol은 문자열 대신 객체의 **속성 키**로 쓸 수 있다(`obj[mySym]`). 유일성 덕에 충돌이 없고, 일반 열거에 잡히지 않아 약한 은닉 수단이 된다.

## 본문

> Symbols are often used to add unique property keys to an object that won't collide with keys any other code might add to the object, and which are hidden from any mechanisms other code will typically use to access the object.

symbol은 흔히 **다른 코드가 추가하는 키와 충돌하지 않는 유일한 속성 키**를 객체에 달 때 쓰이며, 그 키들은 다른 코드가 보통 쓰는 접근 수단에서 **숨겨진다.**

- **collide**: 내가 `obj.id`를 박았는데 남의 라이브러리도 `obj.id`를 박으면 서로 덮어쓴다. symbol 키는 유일하므로 이 충돌이 원천 차단된다.
- **hidden**: `for...in`·`Object.keys()` 같은 일반 열거에 symbol 키는 안 잡힌다.

## 종합

symbol 키의 두 가치는 **충돌 회피**(유일성)와 **은닉**(일반 열거에서 빠짐)이다.

---

---

# well-known Symbol이란 무엇이고 왜 도입됐는가?

## 도입

`Symbol.iterator`·`Symbol.hasInstance`처럼 **언어가 미리 정해둔 고정 symbol**들이 well-known Symbol이다. `for...of`·`instanceof` 같은 내장 동작의 **약속된 후크(protocol)** 역할을 한다. 다음에 배울 iterator가 정확히 이 메커니즘이다.

## 본문

> All static properties of the Symbol constructor are Symbols themselves, whose values are constant across realms. They are known as well-known Symbols, and their purpose is to serve as "protocols" for certain built-in JavaScript operations, allowing users to customize the language's behavior.

`Symbol` 생성자의 모든 정적 속성은 그 자체가 Symbol이고, 그 값은 **realm을 넘어 상수**다. 이들을 well-known Symbol이라 하며, 특정 내장 동작의 **프로토콜** 역할을 해서 언어 동작을 커스터마이징하게 해준다.

- **constant across realms**: realm이 달라도 같은 `Symbol.iterator`다. `Symbol()`이 매번 유일했던 것과 대비 — 이건 고정값.

### realm이란

realm은 **독립된 JS 실행 환경**이다 — 각자 자기만의 전역 객체(`window`)와 내장 객체(`Array`, `Object`…) 한 벌을 가진 세계. 가장 흔한 예가 `<iframe>`이다(그 밖에 web worker, 브라우저 탭, Node `vm` 컨텍스트).

```js
const arr = iframe.contentWindow.eval("[1,2,3]"); // iframe에서 만든 배열
arr instanceof Array;  // false! — 여기 Array는 메인 realm의 Array, arr은 iframe realm의 Array
```

그런데 well-known symbol은 예외로 **모든 realm에서 동일**하다: `iframe.contentWindow.Symbol.iterator === window.Symbol.iterator`는 `true`. 이게 "constant across realms"의 뜻이다. **이유**: iframe에서 만든 배열을 메인에서 `for...of` 돌릴 때, `for...of`는 `[Symbol.iterator]` 키를 찾는데 두 realm의 symbol이 다르면 키가 안 맞아 순회가 실패한다. 그래서 프로토콜이 realm을 넘어 작동하도록 well-known symbol만큼은 공유값으로 고정했다.

### protocol — "구현/opt-in" vs "override"

`[Symbol.iterator]`를 구현한다 = "내 객체, `for...of`로 순회 가능해"라고 언어와 약속하는 것. 그러면 원래 순회 못 하던 클래스도 `for...of`·스프레드가 통한다. 이 키들의 쓰임은 두 결로 나뉜다:

- **구현/opt-in (흔한 경우)**: 없던 능력을 새로 부여. 예) 직접 만든 `ArrayBinaryTree`에 `*[Symbol.iterator]()`를 구현해 `for...of`에 태우기. 원래 `for...of`에 넣으면 `TypeError: not iterable`이던 객체에 순회 기능을 **탑재**한 것. "언어 동작을 바꿨다"기보다 **"언어 기능에 내 객체를 끼워 넣었다(opt-in)"**가 정확.
- **override (드문 경우)**: 이미 있는 기본 동작을 덮어쓰기. 예) `String`의 기본 `[Symbol.iterator]`(글자 하나씩)를 재정의, 또는 `[Symbol.hasInstance]`로 `instanceof`의 기본 prototype-체인 판정을 덮어쓰기.

정밀한 한 줄: **well-known symbol = 내가 만든 객체를 `for...of` 같은 언어 내장 기능에 태울 수 있게 해주는, 언어가 정해둔 약속된 키.** (드물게는 내장 타입의 기본 동작을 덮어쓰는 데도 쓰임.)

#### `Symbol.hasInstance` 예시 — 함수는 객체다

"생성자 함수가 메서드를 가진다"가 헷갈렸던 부분이다. 답: **JS에서 함수는 그 자체가 객체**라 속성·메서드를 붙일 수 있다(`Array.from`의 `.from`도 함수 객체에 붙은 static 메서드).

```js
class Even {
  static [Symbol.hasInstance](value) {     // 클래스(함수 객체) 자체에 붙는 메서드
    return Number.isInteger(value) && value % 2 === 0;
  }
}
console.log(4 instanceof Even); // true  — JS가 내부적으로 Even[Symbol.hasInstance](4) 호출
console.log(7 instanceof Even); // false
```

`Even`은 인스턴스를 만든 적도 없는데, `[Symbol.hasInstance]`가 prototype 체인 기본 판정을 무시하고 "짝수냐"로 판정하게 한다. `static`은 "이 메서드는 인스턴스가 아니라 클래스(=함수 객체) 자체에 붙는다"는 뜻 — iterator가 인스턴스 메서드인 것과 대비된다(순회는 각 인스턴스를, hasInstance는 클래스가 판정하므로).

> Prior to well-known Symbols, JavaScript used normal properties to implement certain built-in operations. However, as more operations are added to the language, designating each operation a "magic property" can break backward compatibility and make the language's behavior harder to reason with. Well-known Symbols allow the customizations to be "invisible" from normal code, which typically only read string properties.

well-known symbol 이전엔 JS가 **평범한 문자열 속성**으로 이런 후크를 구현했다.

- **magic property (옛 방식)**: `JSON.stringify`는 객체에 `toJSON`이라는 **문자열 이름** 메서드가 있으면 자동 호출하고, 문자열 변환 시 `toString`/`valueOf`를 호출한다. "이 이름이면 특별 취급"하는 약속이다.

```js
const account = {
  id: 1, password: "secret",
  toJSON() { return { id: this.id }; }  // 문자열 이름 후크
};
JSON.stringify(account); // '{"id":1}' — stringify가 toJSON()을 자동 호출
```

문제는 **우연한 충돌**이다 — 다른 의도로 `toJSON`을 만들어도 가로채지고, 문자열 키라 `for...in`·`Object.keys`에 다 보인다. 그래서 ES6부터 새 후크는 **유일하고 일반 열거에 안 잡히는 symbol 키**로 옮겼다. `Symbol.iterator`가 하는 일은 옛 `toJSON`과 똑같고, **차이는 키가 문자열이냐 symbol이냐뿐**이다.

## 종합

well-known symbol은 "`for...of`·`instanceof`·JSON 직렬화 같은 언어 내장 동작을 객체가 가로채는, 언어가 정해둔 약속된 키"다. 옛날엔 `toJSON`·`toString` 같은 문자열 magic property로 했지만 우연한 충돌·노출 문제가 있어, ES6부터 유일하고 숨겨지는 symbol로 옮겼다. realm을 넘어 상수라 어느 realm에서 만든 객체든 프로토콜이 일관되게 작동하며, `Symbol.iterator`가 그 대표 사례 — 다음에 배울 iterator가 바로 이 키로 "이 객체를 어떻게 순회할지"를 언어에 알려주는 메커니즘이다.
