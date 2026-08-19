# 실행 컨텍스트는 변수를 직접 담고 있는가?

## 도입

본편([`execution-context.md`](execution-context.md))에서 실행 컨텍스트가 바인딩을 추적한다고 했다. 여기서 한 발 더 나가면, 변수가 그 칸 안에 들어 앉아 있고 칸이 스택에서 빠질 때 변수도 함께 사라진다는 그림이 자연스럽게 그려진다.

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
