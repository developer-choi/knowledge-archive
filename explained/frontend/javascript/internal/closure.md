# 클로저란 무엇인가?

## 도입

```js
let f;
{
  let x = 10;
  f = () => x;
}
console.log(f()); // logs 10
```

블록 `{ }`이 끝나면 그 안의 `x`는 더 이상 쓸 수 없을 것 같은데, 블록 밖에서 `f()`를 부르면 `10`이 나온다. 이 현상에 붙은 이름이 클로저다.

---

## 본문

### 클로저는 무엇과 무엇의 조합인가

MDN이 클로저를 정의하는 문장부터 본다. 무엇과 무엇이 붙어 있는 것을 클로저라 부르는지가 여기 나온다.

> A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).

"클로저란 함수 하나가 렉시컬 환경에 대한 참조와 묶인 조합이다."

- **combination**: 조합. 클로저가 함수를 가리키는 말이 아니라는 표시다. 함수 하나만으로도 아니고 환경 하나만으로도 아니고, 둘이 붙어 있는 그 짝을 클로저라 부른다.
- **bundled together (enclosed)**: 함께 묶인. 괄호 안의 `enclosed`가 closure라는 이름의 출처다. 무언가로 둘러싸여 있다는 뜻이고, 둘러싼 것이 바로 환경이다.
- **references to**: 참조. 상태를 복사해 넣은 게 아니라 가리키고 있다는 뜻이다. 값을 복사하는 것과 연결을 가리키는 것이 어떻게 다른지는 뒤의 「기억하는 시점은 호출이 아니라 생성」에서 코드로 확인한다.
- **its surrounding state (the lexical environment)**: 자신을 둘러싼 상태, 곧 렉시컬 환경. 렉시컬 환경이라는 말이 뿌옇게 느껴진다면 안에 무엇이 들어 있는지 이름을 대보면 된다. 그 자리에서 보이던 이름들과 각 이름이 가리키는 값의 목록이다. 도입 예시의 경우 `x → 10` 하나가 전부다.

```
클로저 = 함수 + 렉시컬 환경

  ┌─────────────────────────────────┐
  │  함수 객체  () => x             │
  │                                 │
  │  [[Environment]] ───┐           │
  └─────────────────────┼───────────┘
                        ↓
            ┌───────────────────────┐
            │  렉시컬 환경           │
            │    x → 10             │
            │    (바깥 환경으로 연결) │
            └───────────────────────┘

  이 두 칸을 합친 것 전체가 클로저다.
```

### 환경이 정해지는 기준은 선언된 자리

> A closure is the combination of a function and the lexical environment within which that function was declared.

"클로저란 함수 + 렉시컬 환경 조합이다."

- **within which that function was declared**: 그 함수가 선언된. 어느 환경이 짝이 되는지를 정하는 기준이 이 구절이다. 그 함수를 호출한 자리의 환경이 아니라 그 함수가 적혀 있던 자리의 환경이다.
- 그래서 함수를 다른 파일이나 다른 함수 안으로 넘겨 실행해도 짝은 바뀌지 않는다. 짝은 생성 시점에 정해지고 그 뒤로 갈아 끼워지지 않는다.

> This environment consists of any variables that were in-scope at the time the closure was created.

"이 환경은 클로저가 만들어진 시점에 스코프 안에 있던 모든 변수로 구성된다."

- **consists of**: ~로 구성된다. 렉시컬 환경의 내용물을 열거해주는 문장이다.
- **any variables that were in-scope**: 스코프 안에 있던 모든 변수. 안쪽 함수가 실제로 쓰는 이름만이 아니라 그 자리에서 보이던 이름 전체가 대상이다.
- **at the time the closure was created**: 클로저가 만들어진 시점에. 기준 시점이 생성이라는 말이 정의 안에 이미 들어 있다. 그 시점에 무슨 일이 벌어지는지는 다음 절에서 이어 본다.

### 기억하는 시점은 호출이 아니라 생성

> Whenever a function is created, it also memorizes internally the variable bindings of the current running execution context.

"함수가 생성될 때마다, 그 함수는 현재 실행 중인 실행 컨텍스트의 변수 바인딩들을 내부적으로 함께 기억해둔다."

- **Whenever a function is created**: 기준 시점이 이 구절에 박혀 있다. 함수가 *생성될* 때다. 흔히 들리는 "함수가 종료됐는데도 그 지역 변수에 접근할 수 있는 함수"라는 설명은 기준 시점을 호출·종료에 둔다. 원문의 기준은 그보다 앞이다. 함수가 만들어지는 그 시점에 이미 기억이 이루어진다.
- **memorizes internally**: 내부적으로 기억한다. 개발자가 코드로 넘겨주거나 복사해두는 게 아니라 엔진이 함수 객체 안쪽에 알아서 붙여둔다는 뜻이다. 그래서 코드상으로는 아무것도 한 게 없어 보이는데도 나중에 값이 살아 있다.
- **the current running execution context**: 지금 실행 중인 실행 컨텍스트, 곧 함수가 만들어지는 그 시점에 스택 꼭대기에 있는 프레임이다. 예시에서 `f = () => x`가 평가되는 시점에 살아 있는 것이 `x = 10`을 담은 블록의 환경이므로, 화살표 함수는 그 바인딩을 기억한다.
- **variable bindings**: 이름과 값의 연결. 값 `10`을 복사해 가는 게 아니라 `x`라는 이름의 연결을 기억한다는 점이 중요하다. 값을 복사한다면 나중에 `x`가 바뀌어도 옛 값이 보여야 하는데, 실제로는 바뀐 값이 보인다.

  ```js
  let g;
  {
    let n = 1;
    g = () => n;
    n = 2;          // ← 기억한 뒤에 바꿔도
  }
  console.log(g()); // 2: 값이 아니라 바인딩을 기억했기 때문
  ```

```
f = () => x  가 평가되는 시점
      │
      ├─ 함수 객체 생성
      └─ 그 시점에 실행 중이던 컨텍스트의 바인딩(x → 10)을 내부에 기억
```

### 바인딩이 컨텍스트보다 오래 산다

> Then, these variable bindings can outlive the execution context.

"그러면 이 변수 바인딩들은 실행 컨텍스트보다 더 오래 살아남을 수 있다."

- **outlive**: ~보다 오래 살다. 이 한 단어가 "함수가 끝나면 지역 변수는 정리되는데 클로저는 왜 정리되지 않는가"라는 의문의 답이다. 사라지는 것은 실행 컨텍스트, 곧 스택에서 걷히는 프레임이다. 바인딩의 수명은 그 프레임의 수명과 묶여 있지 않다. 프레임이 걷혀도 그 바인딩을 기억하는 함수가 살아 있으면 바인딩도 함께 남는다.
- **can**: "~할 수 있다". 항상 그런 것이 아니라 조건부라는 뜻이다. 기억해둔 함수 자체가 아무 데서도 참조되지 않게 되면 그 바인딩도 함께 정리 대상이 된다. 예시에서 살아남는 이유는 블록 바깥의 `f`가 그 함수를 계속 붙들고 있기 때문이다.

```
블록 실행 중                     블록 종료 후
┌──────────────────┐            ┌──────────────────┐
│ 실행 컨텍스트     │ ──걷힘──→  │ (사라짐)          │
│   x → 10 ────────┼──┐         └──────────────────┘
└──────────────────┘  │
                      └──── f 가 이 바인딩을 기억 → x → 10 은 남는다
                                                      ⇒ f() 는 10
```

### 생성될 때마다 매번 만들어진다

> In JavaScript, closures are created every time a function is created, at function creation time.

"자바스크립트에서 클로저는 함수가 만들어질 때마다 매번, 함수 생성 시점에 만들어진다."

- **every time**: 매번. 특정 조건을 만족할 때만 생기는 게 아니라 함수가 만들어질 때마다 예외 없이 생긴다는 뜻이다. 그래서 자바스크립트에서 모든 함수는 클로저다.
- **at function creation time**: 함수 생성 시점에. 생성과 호출은 다른 사건이다. 선언이나 함수 표현식이 평가되어 함수 객체가 만들어지는 때가 생성이고, 그 함수의 몸통이 실제로 돌아가는 때가 호출이다. 한 번 만들어진 함수를 여러 번 부를 수 있으므로 생성은 한 번이고 호출은 여러 번일 수 있다.

```js
function outer() {
  const v = 1;
  return () => v;      // ← 이 줄이 평가될 때마다 함수가 하나씩 새로 생성된다
}

const f1 = outer();    // 함수 객체 1개 생성 (클로저 1개)
const f2 = outer();    // 또 하나 생성   (클로저 1개 더)
console.log(f1 === f2); // false: 같은 코드에서 나왔지만 다른 함수 객체다

f1(); f1(); f1();      // 호출은 몇 번을 해도 새 클로저가 생기지 않는다
```

함수 안에서 함수를 만들면 바깥 함수를 부를 때마다 안쪽 함수가 새로 생성된다. 코드에 적힌 화살표 함수는 한 개지만, 실행 중에 만들어지는 함수 객체는 바깥 함수를 부른 횟수만큼이다.

---

# 바깥 함수가 이미 끝났는데도 그 지역 변수를 읽을 수 있는 이유는 무엇인가?

## 도입

```js
function makeFunc() {
  const name = "Mozilla";
  function displayName() {
    console.log(name);
  }
  return displayName;
}

const myFunc = makeFunc();
myFunc();
```

`makeFunc()`가 반환되면 그 호출의 프레임은 스택에서 걷힌다. `name`은 그 프레임 안의 지역 변수였다.

그런데 그 뒤에 `myFunc()`를 부르면 `"Mozilla"`가 찍힌다. 걷혀서 없어진 자리의 값을 읽고 있는 것처럼 보이는 이 결과가 왜 정상인지가 이 질문이다.

---

## 본문

### 값이 사는 곳은 프레임이 아니라 환경이다

> The instance of displayName maintains a reference to its lexical environment, within which the variable name exists.

"`displayName`의 인스턴스는 자신의 렉시컬 환경에 대한 참조를 유지하고 있으며, 그 환경 안에 변수 `name`이 존재한다."

- **The instance of displayName**: `displayName`의 인스턴스. 코드에 적힌 함수 선언이 아니라 실행 중에 만들어진 함수 객체 하나를 가리키는 말이다. `makeFunc`를 두 번 부르면 `displayName` 인스턴스도 두 개가 되고, 각자 다른 환경을 붙든다.
- **maintains a reference**: 참조를 유지한다. `maintains`가 유지의 주체를 함수 쪽에 둔다. 프레임이 값을 붙잡아 두는 게 아니라 함수 객체가 환경을 붙잡고 있다.
- **its lexical environment**: 그 함수의 렉시컬 환경. 여기서 그 환경 안에 담긴 이름을 세어보면 `name` 하나다. `makeFunc` 호출 한 번이 만든 환경이고, 그 환경은 다시 바깥 환경으로 이어진다.
- **within which the variable name exists**: 그 안에 변수 `name`이 존재한다. 존재의 장소가 프레임이 아니라 환경이라고 말하고 있다. 이 한 구절이 질문의 답이다. 걷힌 것은 프레임이고, `name`이 사는 곳은 함수가 붙들고 있는 환경이다.

```
makeFunc() 실행 중                     makeFunc() 반환 후

  스택                                  스택
  ┌────────────────────┐               ┌────────────────────┐
  │ makeFunc 프레임     │  ── 걷힘 ──→  │ (비어 있음)         │
  └────────────────────┘               └────────────────────┘

  환경                                  환경
  ┌────────────────────┐               ┌────────────────────┐
  │ name → "Mozilla"   │               │ name → "Mozilla"   │  남아 있다
  └─────────▲──────────┘               └─────────▲──────────┘
            │                                    │
   displayName 인스턴스가 참조            myFunc 이 그 함수를 붙들고 있으므로
                                         환경도 함께 살아 있다
```

#### 그 "환경"의 정식 이름은 Environment Record다

여기까지는 환경을 "이름과 값이 사는 곳" 정도로만 써왔다. 명세에서 그것에 붙은 이름이 Environment Record이고, 정의는 ECMA-262 「Environment Records」 절에 있다.

> Environment Record is a specification type used to define the association of Identifiers to specific variables and functions, based upon the lexical nesting structure of ECMAScript code.

"Environment Record는 이름(식별자)을 특정 변수·함수에 이어주기 위해 쓰는 명세상의 타입이며, 그 연결은 코드의 렉시컬 중첩 구조에 근거한다."

- **the association of Identifiers to specific variables and functions**: 이름을 변수·함수에 이어주는 연결. 앞서 "바인딩"이라 부른 것이 바로 이 연결이다.
- **based upon the lexical nesting structure**: 렉시컬 중첩 구조에 근거해서. 어느 이름이 어느 레코드에 속하는지를 코드에 적힌 중첩 모양이 정한다는 뜻이고, 이것이 렉시컬 스코프와 같은 이야기다.

> Usually an Environment Record is associated with some specific syntactic structure of ECMAScript code such as a FunctionDeclaration, a BlockStatement, or a Catch clause of a TryStatement. Each time such code is evaluated, a new Environment Record is created to record the identifier bindings that are created by that code.

"보통 하나의 Environment Record는 함수 선언·블록문·`try`의 `catch` 절 같은 특정 코드 구조와 짝지어진다. 그런 코드가 평가될 때마다 새 Environment Record가 하나 만들어져, 그 코드가 만드는 바인딩들을 기록한다."

- **Each time such code is evaluated, a new Environment Record is created**: 그런 코드가 평가될 때마다 새로 하나. `makeFunc`를 두 번 부르면 레코드도 두 개가 만들어지고, 그래서 두 `displayName` 인스턴스가 서로 다른 `name`을 보게 된다.

레코드끼리는 칸 하나로 이어져 있다.

> Every Environment Record has an [[OuterEnv]] field, which is either null or a reference to an outer Environment Record. This is used to model the logical nesting of Environment Records.

"모든 Environment Record는 `[[OuterEnv]]` 칸을 갖고, 그 값은 `null`이거나 바깥 Environment Record에 대한 참조다. 이 칸으로 레코드 사이의 논리적 중첩을 표현한다."

- **[[OuterEnv]]**: 자기를 감싼 바깥 레코드를 가리키는 칸. 안에서 이름을 못 찾으면 바깥으로 올라간다는 그 사슬이 명세에서는 이 칸 하나로 되어 있다. 스코프 체인의 정체가 이것이다.

여기서 실행 컨텍스트와의 관계도 정리된다. 실행 컨텍스트가 갖고 있는 `LexicalEnvironment`는 환경 그 자체가 아니라, 어느 Environment Record를 쓸지 **가리키는 칸**의 이름이다. 그래서 실행 컨텍스트가 스택에서 걷혀도 그것이 가리키던 레코드까지 함께 사라지지는 않는다. 이 문서가 답하고 있는 현상이 명세 층위에서는 이 구조 덕분에 성립한다.

덧붙여, Environment Record도 실행 컨텍스트와 마찬가지로 실제 메모리 구조물이 아니다.

> Environment Records are purely specification mechanisms and need not correspond to any specific artefact of an ECMAScript implementation. It is impossible for an ECMAScript program to directly access or manipulate such values.

"Environment Record는 순전히 명세상의 장치이며 어떤 구현물과도 대응할 필요가 없다. ECMAScript 프로그램이 그 값을 직접 접근하거나 조작하는 것은 불가능하다."

### 이 성질에 붙은 이름이 클로저다

같은 일을 MDN은 한 문장으로 요약한다.

> The reason is that functions in JavaScript form closures.

"그 이유는 자바스크립트의 함수가 클로저를 형성하기 때문이다."

- **form**: 형성한다. 만들어 갖는다는 뜻이다. 특정 함수만 그런 게 아니라 자바스크립트의 함수라는 것 자체가 이 성질을 갖고 태어난다.

---

## 종합

프레임과 환경을 구분하면 이상해 보이던 결과가 정리된다. 함수가 반환될 때 걷히는 것은 스택 프레임이고, 지역 변수의 이름과 값이 사는 곳은 환경이다.

그 환경을 붙들고 있는 것은 스택이 아니라 함수 객체다. `displayName` 인스턴스가 자기 렉시컬 환경에 대한 참조를 유지하고 있고, 그 인스턴스를 `myFunc`이 붙들고 있으므로 환경도 함께 남는다.

지역 변수가 함수 실행 기간 동안에만 존재하는 언어와 갈리는 지점이 여기다. 그런 언어에서는 변수 수명이 실행 시간에 묶여 있어 이 코드가 성립하지 않는다.

수명이 무한한 것은 아니다. 환경이 남아 있는 이유는 그것을 참조하는 함수가 살아 있기 때문이므로, 그 함수를 아무도 참조하지 않게 되면 환경도 함께 정리 대상이 된다.

