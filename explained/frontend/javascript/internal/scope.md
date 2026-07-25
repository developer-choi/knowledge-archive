# 렉시컬 스코프란 무엇인가?

## 도입

```js
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() {
    // displayName() is the inner function, that forms a closure
    console.log(name); // use variable declared in the parent function
  }
  displayName();
}
init();
```

스코프는 어떤 변수 이름을 읽을 수 있는 범위다. `displayName` 안에는 `name`이라는 선언이 없는데도 `name`이 읽힌다. 그 범위를 무엇이 정해주기에 읽히는지가 이 질문이다.

범위를 정하는 방식에는 크게 두 갈래가 있다. 하나는 그 변수가 소스 코드의 어느 자리에 선언돼 있는지로 정하는 방식이고, 다른 하나는 실행 중에 누가 누구를 불렀는지로 정하는 방식이다. 자바스크립트는 앞쪽을 쓰고, 그 방식의 이름이 렉시컬 스코프다.

---

## 본문

### 기준은 선언이 적혀 있는 자리

> The word lexical refers to the fact that lexical scoping uses the location where a variable is declared within the source code

"lexical이라는 단어는, 렉시컬 스코프가 변수가 소스 코드 안에서 선언된 위치를 사용한다는 사실을 가리킨다."

- **the location where a variable is declared**: 변수가 선언된 위치. 위치라는 단어에 무게가 있다. 변수의 값도 아니고 타입도 아니고, 그 선언문이 몇 번째 중괄호 안에 적혀 있는가가 기준이다.
- **within the source code**: 소스 코드 안에서. 이 구절이 실행 중의 정보와 선을 긋는다. 어떤 함수가 몇 번 호출됐는지, 지금 스택에 무엇이 쌓여 있는지는 전혀 보지 않는다.

### 이름을 확정하는 쪽은 파서다

기준이 코드에 적힌 위치라면, 그 위치를 보고 이름을 확정하는 주체는 누구인가. 다음 문장이 그 주체를 밝힌다.

> which describes how a parser resolves variable names when functions are nested.

"렉시컬 스코프는 함수가 중첩되어 있을 때 파서가 변수 이름을 어떻게 해석하는지를 기술한다."

- **parser**: 소스 코드 글자를 읽어 구조를 파악하는 단계. 이 단어가 문장 안에 있다는 것 자체가 신호다. 이름의 소속을 정하는 주체가 실행 중의 호출 흐름이 아니라 코드를 읽는 쪽이라는 뜻이다.
- **resolves variable names**: 코드에 적힌 이름 하나가 어느 선언을 가리키는지 확정하는 일. `displayName` 안의 `name`이 바로 위 `init`의 `name`을 가리킨다고 정하는 작업이 여기에 해당한다.
- **nested**: 함수가 함수 안에 들어 있는 구조. 중첩 여부의 판단 기준이 코드에 적힌 모양이라는 점이 중요하다. `init` 안에 `displayName`이 적혀 있으니 중첩이다.

### 안쪽 함수가 보는 것은 바깥 "스코프"다

> Nested functions have access to variables declared in their outer scope.

"중첩된 함수는 자신의 바깥 스코프에 선언된 변수들에 접근할 수 있다."

- **declared**: 선언된. `호출된`이 아니라 `선언된`이다. 접근 가능 여부를 가르는 것은 그 변수가 어디서 선언됐는가이지, 실행 중에 어떤 함수가 어떤 함수를 불렀는가가 아니다.
- **outer scope**: 자기가 선언된 자리를 감싸고 있는 바깥 범위. `displayName` 입장에서 바깥은 `init`의 몸통이다.

이 구분을 확인하는 가장 빠른 방법은 호출 관계와 선언 위치를 어긋나게 해보는 것이다.

```js
function a() {
  const secret = 1;
  b();                    // a가 b를 호출한다
}

function b() {
  console.log(secret);    // ← ReferenceError: secret is not defined
}

a();
```

`b`는 `a`가 실행되는 도중에 불렸다. 호출 관계로만 보면 `b`는 `a` 안쪽에 있는 셈이다. 그런데도 `secret`을 읽지 못한다.

`b`가 선언된 자리가 `a` 바깥이기 때문이다. 스코프를 정하는 것은 실행 중의 호출 관계가 아니라 선언이 적힌 위치라는 사실이 이 한 줄의 에러로 드러난다.

### 반대편에는 다이내믹 스코프가 있다

> with dynamic scope, a name is resolved by searching the local execution context, then if that fails, by searching the outer execution context, and so on, progressing up the call stack.

"다이내믹 스코프에서 이름은 먼저 지역 실행 컨텍스트를 뒤져 해석되고, 거기서 실패하면 바깥 실행 컨텍스트를 뒤지는 식으로 콜 스택을 거슬러 올라가며 해석된다."

- **progressing up the call stack**: 콜 스택을 타고 올라간다. 찾아 올라간다는 동작 자체는 렉시컬 스코프와 비슷해 보이지만 올라가는 사다리가 다르다. 한쪽은 코드에 적힌 중첩을 타고 올라가고, 다른 한쪽은 실행 중 호출 순서를 타고 올라간다.
- 앞의 `b` 예시를 다이내믹 스코프 언어에서 돌리면 결과가 뒤집힌다. `b`가 `secret`을 못 찾으면 자기를 부른 `a`의 실행 컨텍스트로 올라가고, 거기에 `secret`이 있으므로 `1`이 출력된다.

> Dynamic scope is uncommon in modern languages. Examples of languages that use dynamic scope include Logo, Emacs Lisp, LaTeX and the shell languages bash, dash, and PowerShell.

"다이내믹 스코프는 현대 언어에서는 드물다. 다이내믹 스코프를 쓰는 언어의 예로는 Logo, Emacs Lisp, LaTeX, 그리고 bash, dash, PowerShell 같은 셸 언어가 있다."

- **uncommon in modern languages**: 드물다. 이름이 무엇을 가리키는지 코드만 봐서는 알 수 없고 실행 경로마다 달라지기 때문에 읽기도 어렵고 최적화하기도 어렵다.

```
같은 코드를 두 방식으로 해석하면

  function a() { const secret = 1; b(); }
  function b() { console.log(secret); }

  렉시컬 스코프                        다이내믹 스코프
  ─────────────────────────           ─────────────────────────
  b가 선언된 자리 → 최상위             b를 부른 쪽 → a
  최상위에 secret 없음                 a에 secret 있음
  ⇒ ReferenceError                    ⇒ 1

  기준: 선언이 적힌 위치                기준: 실행 중 콜 스택
```

---

## 종합

렉시컬 스코프는 이름의 소속을 그 이름이 선언된 소스 코드상의 위치로 정하는 방식이다.

반대편의 다이내믹 스코프와 대조하면 차이는 올라가는 사다리 하나로 압축된다. 렉시컬 스코프는 선언이 적힌 중첩 구조를 타고 올라가고, 다이내믹 스코프는 실행 중 콜 스택을 타고 올라간다.

이 차이가 자바스크립트에서 클로저가 가능한 이유의 밑바탕이다. 이름이 가리키는 곳이 선언 위치로 고정되어 있고 그 연결이 콜 스택과 분리돼 있으니, 함수가 반환되어 프레임이 걷힌 뒤에도 연결 자체는 남을 수 있다.

