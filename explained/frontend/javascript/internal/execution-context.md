# 실행 컨텍스트란 무엇인가?

## 도입

함수를 호출하면 그 함수만의 지역 변수가 생기고, 함수가 끝나면 호출한 자리로 돌아온다. 이 두 가지가 저절로 되는 것처럼 보이지만, 실제로는 누군가가 "이 함수의 변수는 여기 있고, 끝나면 저기로 돌아가라"를 적어두고 관리해야 한다. 그 기록 하나가 실행 컨텍스트다.

---

## 본문

### 정의 — 실행의 최소 단위

> An execution context, also known generally as a stack frame, is the smallest unit of execution.

"실행 컨텍스트는 일반적으로 스택 프레임이라고도 불리며, 실행의 최소 단위다."

- **also known generally as a stack frame**: 다른 언어·자료에서 널리 쓰이는 이름이 스택 프레임이라는 뜻이다. `generally`가 붙은 것이 중요하다. MDN이 스택 프레임을 정의해주는 것이 아니라, 언어를 가리지 않고 두루 쓰이는 바깥 용어를 빌려와 "이 자리를 부르는 흔한 이름은 그쪽"이라고 안내하는 문장이다. 그러니 이 말의 뜻은 JS 문서가 아니라 그 바깥에서 확인해야 한다.
- **the smallest unit of execution**: 실행을 세는 단위. 이 표현은 MDN이 쓰는 말이고 표준 명세에는 나오지 않는다. 외워야 할 사실이라기보다, 실행 컨텍스트를 "코드를 감싸는 공간"이 아니라 "실행 흐름이 오갈 때 통째로 얹히고 통째로 내려가는 덩어리"로 보라는 안내로 읽으면 된다.

### 왜 그런 단위가 필요한가

정의를 알았으니 그것이 왜 있어야 하는지가 다음이다. 출발점은 함수 하나가 스스로 챙겨야 하는 것이 무엇인가다.

> Each function needs to keep track of its own variable environments and where to return to.

"각 함수는 자기 자신의 변수 환경과, 어디로 돌아가야 하는지를 계속 추적해야 한다."

- **its own**: "자기 자신의". 변수 환경이 함수마다 따로라는 뜻이다. `foo`의 지역 변수와 `bar`의 지역 변수는 이름이 같아도 별개의 것으로 보관돼야 하므로, 기록도 함수 호출마다 하나씩 있어야 한다.
- **variable environments**: 그 호출이 쓰는 변수들이 담긴 공간. 파라미터와 지역 변수가 여기 들어간다.
- **where to return to**: 이 함수가 끝났을 때 제어권을 돌려줄 지점. 이게 없으면 함수가 `return`을 만나도 어느 코드 줄로 복귀해야 할지 알 수 없다.

### 그래서 필요한 것이 스택

> To handle this, the agent needs a stack to keep track of the execution contexts.

"이것을 처리하기 위해, 실행 흐름은 실행 컨텍스트들을 추적할 스택이 필요하다."

- **To handle this**: 앞 문장이 이유이고 이 문장이 결과다. 함수마다 자기 변수 환경과 복귀 지점을 따로 들고 있어야 한다는 요구가 먼저 있고, 그 요구를 감당하려니 스택이 필요해진 것이다. 스택이 먼저 있고 거기에 함수를 담는 순서가 아니다.

```
[함수 호출]
    └─ 실행 컨텍스트 1개 생성 = 스택 프레임 1칸
         ├─ 변수 환경   이 호출의 파라미터·지역 변수
         └─ 복귀 지점   끝나면 돌아갈 자리
```

---

## 종합

줄기는 이렇게 이어진다. 함수마다 자기 변수 환경과 복귀 지점을 따로 들고 있어야 한다 → 그러려면 호출할 때마다 기록을 하나씩 만들어 어딘가에 쌓아야 한다 → 나중에 부른 함수가 먼저 끝나므로 그 저장소는 스택이어야 한다 → 그 스택에 쌓이는 기록 한 칸이 실행 컨텍스트, 다른 이름으로 스택 프레임이다.

이 흐름을 따라가면 "실행 컨텍스트 = 코드가 실행되는 environment"라는 이해가 왜 절반짜리인지 보인다. 그 이해는 실행 컨텍스트를 정적인 그릇으로 본다. 하지만 원문은 그것을 최소 단위(the smallest unit of execution)로, 즉 실행 흐름이 쌓고 걷어내는 동적인 단위로 정의한다. 그릇의 크기가 아니라 스택에 얹히고 내려가는 동작이 정의의 중심이다.

만약 이 단위가 없다면 어떻게 되는가. 함수 호출이 중첩될 때마다 어느 지역 변수가 누구 것인지, 반환하면 어디로 돌아가야 하는지를 구분할 방법이 사라진다. 재귀 호출은 자기 자신을 여러 번 부르면서도 각 호출의 변수가 섞이지 않는데, 그것이 가능한 이유가 호출마다 프레임이 따로 생기기 때문이다.

---

# 실행 컨텍스트가 추적하는 바인딩에는 어떤 것들이 있는가?

## 도입

실행 컨텍스트 한 칸이 챙기는 것 중 하나가 이름과 값의 짝이다. 이 짝을 바인딩(binding)이라 부른다. `const a = 10`을 실행하면 "`a`라는 이름은 `10`을 가리킨다"는 연결이 만들어지는데, 그 연결 하나가 바인딩이다.

---

## 본문

### 동사는 "담는다"가 아니라 "추적한다"

> It tracks the following information:
>
> - Bindings, including:

"실행 컨텍스트는 다음 정보를 추적한다: 바인딩들, 다음을 포함해서 —"

- **tracks**: 추적한다. 이 동사가 `contains`가 아니라는 점이 중요하다. 바인딩이 실행 컨텍스트 안에 통째로 들어 앉아 있다는 말이 아니라, 실행 컨텍스트가 그것을 챙기고 따라다닌다는 말이다. 실제로 바인딩이 적히는 곳이 어디인지는 다음 질문에서 다룬다.
- **Bindings**: 이름과 값(또는 값이 놓일 자리)의 연결. 추적 대상은 값 덩어리 자체가 아니라 "이 이름이 무엇을 가리키는가"라는 연결이다.
- **including**: "다음을 포함한다". 뒤에 오는 셋이 전부라고 못 박는 말은 아니지만, 문서가 바인딩의 내용으로 명시하는 항목은 이 셋이다.

### 선언으로 만들어지는 변수

> - Variables defined with `var`, `let`, `const`, `function`, `class`, etc.

"`var`, `let`, `const`, `function`, `class` 등으로 정의된 변수들."

- **defined with**: 선언 키워드로 정의된 것. `function`과 `class`가 이 목록에 함께 들어 있다는 점이 눈에 띈다. 함수 선언과 클래스 선언도 결국 "이름 하나가 무언가를 가리키게 만드는" 일이라서, `let`으로 만든 변수와 같은 자격의 바인딩이다.
- **etc.**: `import`로 들여온 이름처럼 열거되지 않은 선언 형태도 있다는 뜻이다.

### 기타

> - Private identifiers like `#foo` which are only valid in the current context

"`#foo` 같은 private 식별자들, 이들은 현재 컨텍스트 안에서만 유효하다."

> - `this` reference

"`this` 참조."

---

## 종합

실행 컨텍스트 한 칸이 추적하는 것은 값 더미가 아니라 이름과 값의 연결, 즉 바인딩이다. 그 바인딩은 세 종류로 정리된다. 선언 키워드로 만들어진 변수(`var`·`let`·`const`·`function`·`class` 등), 현재 컨텍스트 안에서만 유효한 `#foo` 같은 private 식별자, 그리고 `this` 참조다.

옛 자료의 목록과 대조해보면 차이가 분명하다. 널리 퍼진 "파라미터 / 지역변수 / arguments / scope 정보 / this" 목록에서 파라미터와 지역변수는 첫 항목에 흡수되고 `this`는 그대로 남지만, `arguments`와 "scope 정보"는 현행 문서의 목록에 없다. 담는 그릇의 이름이었던 `Activation Object`라는 용어도 현행 문서에서는 쓰이지 않는다. 옛 목록으로 외워두면 문서에 없는 항목까지 정답으로 기억하게 되므로, 목록은 위 세 가지로 잡아두는 편이 안전하다.

---

# 실행 컨텍스트는 변수를 직접 담고 있는가?

## 도입

앞 절에서 실행 컨텍스트가 바인딩을 추적한다고 했다. 여기서 한 발 더 나가면, 변수가 그 칸 안에 들어 앉아 있고 칸이 스택에서 빠질 때 변수도 함께 사라진다는 그림이 자연스럽게 그려진다.

그런데 그 그림이 맞다면 클로저가 성립할 수 없다. 바깥 함수가 반환하는 순간 그 칸이 걷히고 지역 변수도 같이 없어져야 하는데, 실제로는 반환된 뒤에도 읽힌다. 표준 명세가 이 자리를 어떤 낱말로 적어뒀는지 보면 어긋남이 풀린다.

---

## 본문

### 담는 것이 아니라 가리키는 것

> - LexicalEnvironment: Identifies the Environment Record used to resolve identifier references made by code within this execution context.

"LexicalEnvironment — 이 실행 컨텍스트 안의 코드가 만든 식별자 참조를 해석하는 데 쓰이는 Environment Record를 지목한다."

- **Identifies**: 지목한다·가리킨다. 담는다(contains)도 보유한다(holds)도 아니다. 실행 컨텍스트가 들고 있는 것은 환경 자체가 아니라 "어느 환경을 쓰라"는 지목이다. 이 낱말 하나가 도입에서 말한 어긋남의 열쇠다.
- **Environment Record**: 이름과 값의 짝 목록을 명세가 부르는 이름. 클로저 쪽에서 렉시컬 환경이라고 부르던 바로 그것이다.
- **to resolve identifier references**: 식별자 참조를 해석하기 위해. 코드에 `x`라고 적혀 있을 때 그 `x`가 무엇인지 찾아 나서는 출발점이 여기다. 여기서 못 찾으면 바깥 환경으로 이어지는 것이 스코프 체인이다.

> - VariableEnvironment: Identifies the Environment Record that holds bindings created by VariableStatements within this execution context.

"VariableEnvironment — 이 실행 컨텍스트 안의 `var` 문이 만든 바인딩을 보유하는 Environment Record를 지목한다."

- **holds**: 보유한다. 보유하는 주체가 실행 컨텍스트가 아니라 Environment Record라는 점을 눈여겨볼 만하다. 컨텍스트는 지목하고, 레코드가 보유한다.
- **VariableStatements**: `var` 선언문. `var`만 따로 담는 칸이 별도로 있다는 뜻이고, `var`와 `let`·`const`의 스코프가 왜 다르게 잡히는지가 여기서 구조로 드러난다.

> - PrivateEnvironment: Identifies the PrivateEnvironment Record that holds Private Names created by ClassElements in the nearest containing class. null if there is no containing class.

"PrivateEnvironment — 가장 가까운 바깥 클래스의 클래스 요소들이 만든 private 이름을 보유하는 PrivateEnvironment Record를 지목한다. 감싸는 클래스가 없으면 null이다."

- **null if there is no containing class**: 클래스 밖이면 아예 비어 있다. `#foo` 같은 이름이 클래스 바깥에서 보이지 않는 이유가 숨겨져서가 아니라 지목할 레코드 자체가 없어서라는 뜻이다.

> The LexicalEnvironment and VariableEnvironment components of an execution context are always Environment Records.

"실행 컨텍스트의 LexicalEnvironment와 VariableEnvironment 컴포넌트는 언제나 Environment Record다."

- **always**: 언제나. 예외 없이 레코드를 지목한다. 어떤 경우에는 값을 직접 들고 있고 어떤 경우에는 가리킨다는 식으로 갈리지 않는다.

```
실행 컨텍스트 (스택 위의 한 칸)
├── code evaluation state    어디까지 진행됐나
├── Function                 지금 평가 중인 함수 객체 (스크립트·모듈이면 null)
├── Realm                    어느 전역 환경의 자원을 쓰는가
├── ScriptOrModule           이 코드가 어느 스크립트·모듈에서 왔나
├── LexicalEnvironment  ────→ ┌─────────────────────┐
├── VariableEnvironment ────→ │ Environment Record  │  칸 바깥에 따로 있다
└── PrivateEnvironment  ────→ │  x → 10, y → 3 ...  │
                              └─────────────────────┘
```

---

## 종합

요점은 화살표다. 컨텍스트 칸 안에 값이 들어 있는 것이 아니라, 칸이 환경을 가리키고 있다. 값의 실제 거처는 Environment Record이고 그것은 칸 바깥에 따로 있다.

이 구조가 클로저를 성립시킨다. 함수가 반환하면 그 컨텍스트 칸은 스택에서 걷히지만, 걷히는 것은 지목뿐이다. 그 환경을 다른 누군가가 여전히 가리키고 있으면 환경은 그대로 남는다. 바깥 함수가 끝났는데도 지역 변수를 읽을 수 있는 것이 이 때문이다. 반대로 아무도 가리키지 않게 되면 그때 정리된다.

컴포넌트 목록에서 하나 더 건질 것이 있다. `Function` 항목은 함수 코드를 평가 중일 때만 함수 객체를 담고, 스크립트나 모듈을 평가 중이면 `null`이다. 실행 컨텍스트가 함수 전용 장치가 아니라는 뜻이다. 함수를 한 번도 부르지 않는 스크립트에도 실행 컨텍스트는 만들어진다.

그래서 "실행 컨텍스트는 함수 하나를 실행하는 데 필요한 모든 것이 저장된 공간"이라는 요약은 두 군데에서 어긋난다. 저장하는 것이 아니라 지목하는 것이고, 함수에만 생기는 것도 아니다.
