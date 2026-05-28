# React에서 "UI를 코드로 직접 조작하지 않는다"는 말은 구체적으로 어떤 의미인가?

## 도입

jQuery 시절에는 버튼을 클릭하면 `button.disabled = true`, `successMsg.style.display = 'block'` 처럼 DOM을 직접 조작했다. React는 이 방식을 쓰지 않는다. 대신 "어떤 상태에서 UI가 어떤 모습이어야 하는가"를 선언하고, 상태 변경만 트리거한다. DOM 조작은 React가 대신한다.

---

## 본문

> With React, you won't modify the UI from code directly.
> For example, you won't write commands like "disable the button", "enable the button", "show the success message", etc.

"React에서는 코드로 UI를 직접 수정하지 않는다. '버튼을 비활성화해라', '버튼을 활성화해라', '성공 메시지를 보여줘라' 같은 명령을 작성하지 않는다."

- **modify the UI from code directly**: `element.style.display = 'none'`이나 `button.disabled = true` 같은 명령형 DOM 조작.
- **commands**: 현재 DOM을 어떻게 바꿀지 지시하는 명령문.

> Instead, you will describe the UI you want to see for the different visual states of your component ("initial state", "typing state", "success state"), and then trigger the state changes in response to user input.

"대신, 컴포넌트의 서로 다른 시각적 상태(초기, 입력 중, 성공 등)에서 보고 싶은 UI를 묘사하고, 사용자 입력에 반응하여 state 변화를 트리거한다."

- **describe**: JSX로 각 상태에서 UI가 어떻게 보여야 하는지 선언.
- **visual states**: 컴포넌트가 취할 수 있는 화면 상태들. 미리 정의해두면 "어떤 상태에서 어떤 UI"가 명확해진다.
- **trigger**: state setter(`setStatus`)를 호출하는 것. DOM을 직접 건드리지 않는다.
- **in response to**: 이벤트 핸들러 안에서 — 사용자가 무언가를 했을 때 반응하여.

> In React, you don't directly manipulate the UI—meaning you don't enable, disable, show, or hide components directly.
> Instead, you declare what you want to show, and React figures out how to update the UI.

"React에서는 UI를 직접 조작하지 않는다 — 컴포넌트를 직접 활성화·비활성화·보이기·숨기기를 하지 않는다. 대신 보여줄 것을 선언하면, React가 UI를 어떻게 업데이트할지 알아낸다."

- **declare what you want to show**: `status === 'success' ? <Success /> : <Form />`처럼 조건에 따른 UI를 JSX로 선언.

---

## 종합

명령형(jQuery 방식)은 현재 DOM 상태를 알고 있어야 다음 명령을 만들 수 있다. 상태가 복잡해질수록 "지금 버튼이 disabled인지"를 파악하고 반전시키는 코드가 늘어나며 버그가 생긴다. React의 선언형은 "status가 'success'면 이 UI, 'typing'이면 저 UI"처럼 상태별 UI를 미리 정의하고 상태만 바꾼다. DOM 반영은 React가 전담하므로 개발자는 "어떤 상태에서 뭘 보여줄지"에만 집중할 수 있다.

---

---

# React state 구조 설계 원칙들의 공통 목표는 무엇이며, 왜 DB 정규화에 비유되는가?

## 도입

React 공식문서는 state 설계 원칙 5가지(Group, Avoid contradictions, Avoid redundant, Avoid duplication, Avoid deeply nested)를 소개한다. 이 원칙들은 제각각 다른 문제를 다루는 것처럼 보이지만, 한 가지 공통 목표에서 파생된다.

---

## 본문

> The goal behind these principles is to make state easy to update without introducing mistakes.
> Removing redundant and duplicate data from state helps ensure that all its pieces stay in sync.

"이 원칙들의 목표는 실수 없이 state를 쉽게 업데이트하는 것이다. state에서 중복·불필요한 데이터를 제거하면 모든 조각이 동기화 상태를 유지하는 데 도움이 된다."

- **easy to update without introducing mistakes**: 5원칙의 공통 목표 — "실수 없이"와 "쉽게" 둘 다 충족.
- **stay in sync**: 여러 state 조각이 일관성을 유지한 상태. 중복·불필요한 state가 있으면 한쪽만 갱신하는 실수가 생긴다.

> This is similar to how a database engineer might want to "normalize" the database structure to reduce the chance of bugs.

"이는 버그 가능성을 줄이기 위해 DB 구조를 정규화하려는 데이터베이스 엔지니어의 접근과 유사하다."

- **normalize**: DB 정규화 — 데이터를 중복 없이 분해하여 한 곳만 수정해도 모든 참조가 갱신되도록 하는 설계 원칙. 같은 데이터가 두 곳에 있으면 동기화 부담이 생기지만, 한 곳에만 두면 동기화할 것이 없어 동기화 실수도 사라진다.

> To paraphrase Albert Einstein, "Make your state as simple as it can be—but no simpler."

"알버트 아인슈타인의 말을 빌리자면, '가능한 한 단순하게 state를 만들어라 — 그러나 그 이상 단순화하지 마라.'"

- **as simple as it can be—but no simpler**: 두 변수를 무리하게 합쳐서 의미가 모호해지면 안 된다는 단서. 표현력을 잃지 않는 선까지만 단순화하라는 것.

---

## 종합

5원칙 모두 "동기화 부담을 없앤다"는 하나의 원리에서 파생된다. state가 두 곳에 있으면 둘 다 갱신해야 하고, 하나를 빠뜨리면 버그가 된다. 한 곳에만 두면 갱신할 곳이 하나이므로 동기화 실수가 원천 차단된다. DB에서 같은 고객 이름을 여러 테이블에 직접 저장하지 않고 customer_id로 참조하는 것과 정확히 같은 사고방식이다.

---

---

# React는 어떤 기준으로 컴포넌트의 state를 보존하고 어떤 경우 버리는가?

## 도입

같은 컴포넌트를 조건부 렌더링으로 껐다 켰을 때, 또는 같은 위치에 다른 컴포넌트를 렌더링했을 때 state가 어떻게 되는지 헷갈리는 경우가 많다. React의 판단 기준은 "UI 트리에서의 위치"다.

---

## 본문

> React preserves a component's state for as long as it's being rendered at its position in the UI tree.
> If it gets removed, or a different component gets rendered at the same position, React discards its state.

"React는 컴포넌트가 UI 트리의 해당 위치에 렌더링되는 동안 state를 보존한다. 컴포넌트가 제거되거나 같은 위치에 다른 컴포넌트가 렌더링되면 React는 state를 버린다."

- **preserves**: 직전 값을 그대로 유지.
- **position in the UI tree**: 트리에서의 자리. 컴포넌트와 state를 매핑하는 키. JSX 위치가 아니라 렌더 결과 트리에서의 좌표다.
- **removed**: 조건부 렌더링이 false로 바뀌어 그 위치에 아무것도 렌더되지 않는 상태.
- **a different component gets rendered at the same position**: 같은 위치인데 타입이 바뀜 — `<Counter />` → `<Spinner />`.
- **discards**: 메모리에서 제거. 다시 렌더해도 복구되지 않고 처음부터 초기화된다.

```jsx
// 위치가 유지되면 state 보존
{showCounter && <Counter />}  // false → true: state 초기화됨 (위치가 비워졌다가 새로 채워짐)

// 위치는 같지만 타입 변경 → state 버림
{isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />}
// → 이 경우 동일 타입이므로 state 보존됨
```

---

## 종합

React는 트리 위치를 key로 삼아 state를 관리한다. 같은 위치에 같은 타입 컴포넌트가 있으면 state가 보존되고, 위치가 비워지거나 타입이 바뀌면 state가 버려진다. 조건부 렌더링으로 컴포넌트를 숨겼다가 보이게 했을 때 입력값이 사라지는 이유가 바로 이것이다. 숨기면 트리에서 제거(state 버림) → 다시 보이면 새 위치에 마운트(state 초기화).

---

---

# 컴포넌트 함수는 매 렌더마다 새로 호출되는데, `useState`로 만든 값이 직전 값을 기억하는 메커니즘은 무엇인가?

## 도입

`useState`를 처음 접하면 "컴포넌트 함수가 매 렌더마다 실행되는데 어떻게 이전 값을 기억하지?"라는 의문이 생긴다. 함수 안 지역 변수는 매 호출마다 새로 만들어지는데, `useState`는 왜 다른가.

---

## 본문

> When you give a component state, you might think the state "lives" inside the component.
> But the state is actually held inside React.

"컴포넌트에 state를 부여하면 state가 컴포넌트 '안에 산다'고 생각할 수 있다. 하지만 state는 실제로 React 내부에 보관된다."

- **lives inside the component**: 흔한 잘못된 멘탈 모델. `useState`가 컴포넌트 함수 본문에 있으니 거기 산다고 착각하기 쉽다.
- **held inside React**: 실제 저장소는 React 내부 fiber 구조. 컴포넌트 함수가 매 렌더마다 새로 호출되어도 React가 보관하는 값은 유지된다.

> React associates each piece of state it's holding with the correct component by where that component sits in the render tree.

"React는 보유하고 있는 각 state 조각을 렌더 트리에서 컴포넌트가 위치한 곳을 기준으로 올바른 컴포넌트와 연결한다."

- **associates ... by where ... sits**: 위치를 key로 매핑. 컴포넌트 정의가 같아도 트리 위치가 다르면 별개의 state.
- **render tree**: 화면에 실제로 그려진 컴포넌트 인스턴스 트리. 같은 JSX를 두 군데 꽂으면 트리 위치가 두 곳 → 두 개의 독립적인 state.

```jsx
// 같은 Counter 컴포넌트지만 위치가 다름 → state 독립
<Counter />   // 위치 A → state A
<Counter />   // 위치 B → state B
// A의 count를 올려도 B는 그대로
```

---

## 종합

컴포넌트 함수는 매 렌더마다 새로 호출되어 로컬 변수도 새로 만들어진다. 그런데도 `useState`로 선언한 값이 직전 값을 기억하는 건, React가 트리 위치를 key로 직전 state를 다시 꽂아주기 때문이다. "위치가 식별자"라는 사고를 잡아두면 이후 동작들이 한 줄로 설명된다 — 형제 카운터 격리(위치가 다름), 조건부 렌더링 시 state 소실(위치가 비워짐), key/타입 변경 시 reset(같은 위치라도 식별자가 달라짐).

---

---

# `key` prop은 React가 컴포넌트의 동일성을 판단할 때 구체적으로 어떻게 작용하는가? 리스트 렌더링 외에도 쓸 수 있는가?

## 도입

`key`는 리스트에만 쓰는 prop이라고 생각하기 쉽다. 하지만 `key`의 본질은 리스트가 아니라 "React에게 이 컴포넌트의 식별자를 명시적으로 알려주는 것"이다. 따라서 어떤 컴포넌트에도 쓸 수 있다.

---

## 본문

> Keys aren't just for lists!
> You can use keys to make React distinguish between any components.

"key는 리스트에만 쓰는 것이 아니다! 임의의 컴포넌트를 구분하기 위해 key를 쓸 수 있다."

> By default, React uses order within the parent to discern between components.
> Specifying a key tells React to use the key itself as part of the position, instead of their order within the parent.

"기본적으로 React는 부모 내 순번으로 컴포넌트를 구분한다. key를 지정하면 React가 부모 내 순번 대신 key 자체를 위치의 일부로 사용하도록 지시한다."

- **order within the parent**: key가 없을 때 기본 식별 방식. 첫 번째 자식은 인덱스 0, 두 번째는 인덱스 1.
- **as part of the position**: key가 위치 식별자에 합쳐진다. 같은 JSX 자리라도 key가 다르면 React는 다른 좌표로 취급한다.

```jsx
// 같은 JSX 자리인데 key가 달라서 별개 인스턴스로 취급됨
<Counter key="playerA" />
<Counter key="playerB" />
// playerA와 playerB는 절대 state를 공유하지 않는다
```

> This is why, even though you render them in the same place in JSX, React sees them as two different counters, and so they will never share state.

"그래서 JSX에서 같은 위치에 렌더링해도 React는 두 개의 다른 카운터로 보고, state를 절대 공유하지 않는다."

- **never share state**: key가 다르면 별개 인스턴스 — 한쪽 state를 바꿔도 다른 쪽에 영향 없음.

리스트 외에 실무에서 쓰는 대표적인 사례:

```jsx
// 사용자가 바뀔 때 폼을 완전히 리셋하고 싶을 때
<ProfileForm key={userId} />
// userId가 바뀌면 key가 바뀌므로 이전 state가 파괴되고 새로 마운트됨
```

---

## 종합

`key`는 리스트 렌더링의 경고를 없애기 위한 도구가 아니라, React에게 "이 컴포넌트의 식별자"를 명시적으로 전달하는 수단이다. key가 같으면 같은 인스턴스(state 보존), key가 다르면 다른 인스턴스(state 초기화). 이 속성 덕분에 리스트 외에도 "특정 값이 바뀔 때 컴포넌트를 완전히 초기화하고 싶다"는 시나리오에서 유용하게 쓸 수 있다.

---

---

# `key`는 전역으로 유일해야 하는가?

## 도입

`key`가 고유해야 한다는 말을 들으면 UUID처럼 앱 전체에서 유일한 값이어야 하나 싶은 생각이 든다. 그렇지 않다.

---

## 본문

> Remember that keys are not globally unique.
> They only specify the position within the parent.

"key는 전역으로 유일할 필요가 없다. key는 부모 내에서의 위치만 지정한다."

- **not globally unique**: 다른 부모 아래의 key와 겹쳐도 된다. React는 각 부모 컨텍스트 안에서만 key를 비교한다.
- **position within the parent**: key가 의미를 갖는 범위는 같은 부모 아래 형제들 사이뿐이다.

```jsx
<ul>
  <li key="a">항목 A</li>  {/* 이 컨텍스트에서의 "a" */}
  <li key="b">항목 B</li>
</ul>
<ul>
  <li key="a">항목 A'</li> {/* 다른 부모의 "a" — 충돌 없음 */}
  <li key="b">항목 B'</li>
</ul>
```

---

## 종합

key의 유일성 범위는 같은 부모 아래 형제들 사이다. 서로 다른 부모 아래에 있는 자식들은 key가 같아도 전혀 문제없다. 따라서 리스트 렌더링 시 배열 아이템의 고유 필드(id, slug 등)를 key로 쓰면 충분하고, 앱 전체를 통틀어 고유한 값을 만들 필요는 없다.

---

---

# Context API는 어떤 문제를 해결하며 언제 사용하는가? prop drilling과의 관계는?

## 도입

React에서 데이터를 아래로 내려주는 기본 방법은 props다. 하지만 컴포넌트 계층이 깊어지면 데이터를 쓰지도 않는 중간 컴포넌트들을 통과시켜야 하는 상황이 생긴다. 이것이 prop drilling이고, Context는 이 문제의 해결책이다.

---

## 본문

> But passing props can become verbose and inconvenient when you need to pass some prop deeply through the tree, or if many components need the same prop.

"하지만 트리 깊숙이 props를 내려야 하거나, 많은 컴포넌트가 같은 prop을 필요로 하면 props 전달이 장황하고 불편해진다."

- **verbose**: 장황한. 중간 컴포넌트들이 직접 쓰지 않는 prop을 받아서 아래로 넘기는 코드가 계속 반복된다.

> The nearest common ancestor could be far removed from the components that need data, and lifting state up that high can lead to a situation called "prop drilling".

"데이터가 필요한 컴포넌트들의 가장 가까운 공통 조상이 데이터를 쓰는 컴포넌트들과 멀리 떨어져 있을 수 있고, state를 그렇게 높이 올리면 'prop drilling'이라는 상황이 생긴다."

- **nearest common ancestor**: 데이터를 필요로 하는 컴포넌트들이 공유하는 가장 가까운 부모. state를 이 레벨까지 올려야 한다.
- **prop drilling**: 데이터를 쓰지 않는 중간 컴포넌트들이 props를 단순 통과시키며 내려가는 상황.

> Context lets the parent component make some information available to any component in the tree below it—no matter how deep—without passing it explicitly through props.

"Context를 쓰면 부모 컴포넌트가 트리 아래 어떤 컴포넌트에도 — 아무리 깊어도 — props를 명시적으로 내려주지 않고 정보를 제공할 수 있다."

- **no matter how deep**: 계층이 아무리 깊어도 Context를 구독한 컴포넌트라면 바로 읽을 수 있다.

```
prop drilling (Context 없음):
App → Layout → Sidebar → Menu → MenuItem (useTheme 필요)
       ↓props   ↓props    ↓props  ↓props  →  theme 사용

Context 있음:
App (ThemeProvider)
  └─ Layout                           (theme prop 불필요)
       └─ Sidebar                     (theme prop 불필요)
            └─ Menu                   (theme prop 불필요)
                 └─ MenuItem          useContext(ThemeContext) → theme 직접 읽음
```

---

## 종합

Context는 prop drilling 문제의 해결책이지만, 자주 바뀌는 값에 쓰면 해당 Context를 구독하는 모든 컴포넌트가 리렌더된다는 점에 주의해야 한다. 테마, 언어, 로그인 사용자처럼 거의 바뀌지 않는 전역 값에 적합하고, 빠르게 바뀌는 값은 외부 store(Zustand, Jotai 등)를 고려하는 것이 낫다.

---

---

# [UNVERIFIED] '상태관리 어떻게 하세요?'

## 도입

"상태관리를 어떻게 하세요?"라는 질문은 단계적으로 접근할 수 있다. 상태를 추가하기 전에 먼저 필요 없는 state를 제거하고, 그 다음 범위(로컬 vs 전역)와 특성(변경 빈도, 서버 vs 클라이언트)에 따라 도구를 선택한다.

---

## 본문

4단계 의사결정 사다리:

```
step 1: 불필요한 state 제거
  → 다른 state/props에서 계산 가능하면 state 불필요
  → 항상 같이 바뀌면 하나로 합치기
  → 모순/불가능 조합이 생기면 enum으로 통합

step 2: 로컬 상태 → useState
  → 한 컴포넌트 안에서만 쓰는 값

step 3: 전역 상태 → 변경 빈도로 갈라치기
  → 거의 안 바뀜 (테마/언어/로그인 유저): Context
  → 자주 바뀜 (장바구니/필터/UI 상태): 외부 store (Zustand, Jotai 등)

step 4: 특화 상태는 별도 분리
  → 서버 상태 (fetch 결과, 캐시, loading/error): React Query / TanStack Query
  → overlay 상태 (모달, 토스트, drawer): overlay-kit 등 전용 라이브러리
```

---

## 종합

상태관리의 핵심은 "이 값이 정말 state여야 하는가?"를 먼저 물은 뒤, 범위와 특성에 맞는 도구를 선택하는 것이다. Context는 거의 안 바뀌는 전역 값에, 외부 store는 자주 바뀌는 값에, React Query는 서버 상태의 캐싱·동기화를 전담한다. 모든 것을 하나의 도구로 해결하려 하지 말고 각 상태의 특성에 맞는 도구를 고르는 것이 실무 관점의 답이다.

---

---

# 그럼 불필요한 상태가 어떤 게 있나요?

## 도입

state를 "화면과 관련 있고 바뀔 수 있는 값"으로 정의하면 state 변수가 늘어나기 쉽다. React 공식문서는 state 변수 자체를 "움직이는 부품(moving piece)"으로 보고, 개수를 최소화하는 것이 설계 원칙의 핵심이라고 말한다.

---

## 본문

> Simplicity is key: each piece of state is a "moving piece", and you want as few "moving pieces" as possible.
> More complexity leads to more bugs!

"단순함이 핵심이다. 각 state 조각은 '움직이는 부품'이며, 가능한 한 적은 '움직이는 부품'을 원해야 한다. 복잡도가 높을수록 버그가 많아진다!"

- **moving piece**: 기계 부품 비유. state 변수 하나하나가 움직이는 부품이며, 서로 어긋날 수 있는 지점이다.
- **as few moving pieces as possible**: state가 N개면 동기화 관리 대상이 N개다. 복잡도가 커질수록 버그 표면이 늘어난다.
- **More complexity leads to more bugs**: state 2개는 4가지 조합, 3개는 8가지 조합이 가능하다. 대부분 유효하지 않은 조합을 방어하는 코드가 필요하게 된다.

---

## 종합

"필요한 state인가?"를 판단하는 빠른 체크리스트: 렌더 중 다른 state나 props에서 계산할 수 있으면 state가 아니다. 항상 같이 바뀌는 두 state 변수는 하나로 합칠 수 있다. 두 boolean state 조합 중 유효하지 않은 경우가 있으면 enum(union 타입) 하나로 통합한다. 중첩이 깊어 업데이트하기 불편하면 flat 구조로 정규화한다.

---

---

# Group related state 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?

## 도입

마우스 좌표처럼 항상 함께 바뀌는 값을 `x`, `y` 두 state 변수로 나눠 관리하면, 이벤트 핸들러에서 둘 다 갱신해야 한다는 것을 항상 기억해야 한다. 하나를 빠뜨리는 순간 버그가 된다.

---

## 본문

> But if some two state variables always change together, it might be a good idea to unify them into a single state variable.
> Then you won't forget to always keep them in sync.

"항상 같이 바뀌는 두 state 변수가 있다면, 이를 단일 state 변수로 통합하는 것이 좋다. 그러면 항상 동기화 상태를 유지하는 것을 잊지 않게 된다."

- **always change together**: 어떤 이벤트에서든 둘 다 갱신되는 패턴. `setX`와 `setY`가 항상 같은 핸들러 안에 붙어 있다면 한 변수로 합칠 신호다.
- **unify**: 두 변수를 하나의 객체 state로 합침. `const [position, setPosition] = useState({ x: 0, y: 0 })`.
- **forget to ... keep them in sync**: 동기화 실수의 원천. `setX(e.clientX)` 호출하고 `setY` 빠뜨리면 x만 업데이트된다.

```jsx
// Before (둘 다 갱신해야 한다는 것을 기억해야 함)
const [x, setX] = useState(0);
const [y, setY] = useState(0);
// 핸들러에서 setX, setY 둘 다 호출

// After (하나만 갱신)
const [position, setPosition] = useState({ x: 0, y: 0 });
// 핸들러에서 setPosition({ x: e.clientX, y: e.clientY })
```

---

## 종합

항상 함께 바뀌는 state는 하나로 묶으면 동기화 실수를 구조적으로 막을 수 있다. `setPosition` 하나만 호출하면 x와 y가 항상 함께 갱신된다 — `setY`를 빠뜨릴 가능성 자체가 없어진다. 단, 관련 없는 값을 억지로 묶으면 반대로 부분 갱신이 어려워지니 "항상 같이 바뀌는가"를 기준으로 판단한다.

---

---

# Avoid contradictions 원칙을 안 지키면 어떤 문제가 생기며 어떻게 해결하는가?

## 도입

`isTyping`과 `isSubmitting` 두 boolean state를 쓰면 `isTyping=true, isSubmitting=true` 조합이 메모리에서 표현 가능하다. 하지만 "타이핑 중이면서 제출 중"이라는 UI 상태는 실제로 없다. 이 "불가능한 state"가 표현 가능해지는 순간 버그가 생길 여지가 생긴다.

---

## 본문

> Does this state cause a paradox?
> For example, `isTyping` and `isSubmitting` can't both be `true`.
> A paradox usually means that the state is not constrained enough.

"이 state가 역설을 만드는가? 예를 들어 `isTyping`과 `isSubmitting`은 둘 다 `true`일 수 없다. 역설은 보통 state가 충분히 제약되지 않았다는 것을 의미한다."

- **paradox**: 논리적으로 동시에 성립할 수 없는 state 조합이 메모리에서 표현 가능한 상황.
- **not constrained enough**: state 타입이 유효하지 않은 조합을 허용할 만큼 느슨하다.

> There are four possible combinations of two booleans, but only three correspond to valid states.
> To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`.

"두 boolean의 조합은 네 가지인데 유효한 상태는 세 가지뿐이다. '불가능한' state를 제거하려면 이것들을 `'typing'`, `'submitting'`, `'success'` 세 값 중 하나여야 하는 `status`로 합칠 수 있다."

- **four possible combinations**: `(false,false)`, `(true,false)`, `(false,true)`, `(true,true)` — 4가지.
- **impossible state**: `(true,true)` — 현실 UI에는 없지만 메모리에서는 표현 가능하다.
- **combine these into a `status`**: union 타입 enum으로 바꾸면 유효한 값만 취할 수 있다.

```tsx
// Before (불가능한 조합이 가능함)
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// After (유효한 상태만 가능)
type Status = 'typing' | 'submitting' | 'success';
const [status, setStatus] = useState<Status>('typing');
```

---

## 종합

두 boolean을 쓰면 4가지 조합 중 3가지만 유효하고 1가지는 불가능한 조합이다. enum(`status`)으로 바꾸면 타입 시스템이 유효하지 않은 조합을 컴파일 시점에 차단한다. TypeScript의 유니언 타입과 조합하면 특히 강력하다 — `status`를 `'submitting'`으로 설정하면서 동시에 `'typing'`이 되는 코드 자체를 작성할 수 없게 된다.

---

---

# state에 두지 말아야 할 값들은 어떤 종류가 있으며, 각각 무엇이 문제고 어떻게 해결하는가?

## 도입

state 변수를 추가할 때마다 "이미 있는 state나 props에서 계산할 수 있지 않나?"를 먼저 물어야 한다. 파생 가능한 값을 별도 state로 두면 두 값을 항상 동기화해야 하고, 동기화 실수가 버그가 된다.

---

## 본문

> Is the same information available in another state variable already?
> Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time.
> By making them separate state variables, you risk them going out of sync and causing bugs.
> Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.

"`isEmpty`와 `isTyping`은 동시에 `true`일 수 없다. 별도 state 변수로 만들면 동기화가 어긋날 위험이 있다. `isEmpty`를 제거하고 `answer.length === 0`으로 체크하면 된다."

- **same information available in another state variable**: 이미 다른 state에서 도출 가능한 정보.
- **going out of sync**: `setAnswer`만 호출하고 `setIsEmpty`를 빠뜨리면 둘이 엇갈린다.
- **check `answer.length === 0`**: source of truth는 `answer` 하나. 렌더마다 계산하면 동기화할 필요 자체가 없다.

props를 state에 미러링하는 흔한 실수:

> The problem is that if the parent component passes a different value of messageColor later (for example, 'red' instead of 'blue'), the color state variable would not be updated!
> The state is only initialized during the first render.

"부모가 나중에 다른 `messageColor` 값을 넘겨도 `color` state는 업데이트되지 않는다. state는 첫 렌더에서만 초기화된다."

```jsx
// 잘못된 패턴 — props를 state에 미러링
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
  // messageColor가 바뀌어도 color는 초기값 그대로
}

// 올바른 패턴
function Message({ messageColor }) {
  const color = messageColor; // 직접 사용
}
```

props 미러링이 유효한 경우는 단 하나 — 초기값 이후의 변경을 무시하고 싶을 때:

```jsx
function Message({ initialColor }) {
  const [color, setColor] = useState(initialColor);
  // initialColor 변경은 의도적으로 무시. 컨벤션상 이름에 initial/default를 붙인다.
}
```

---

## 종합

state에 두지 말아야 할 값의 유형은 두 가지다. 첫째, 다른 state나 props에서 계산할 수 있는 파생 값 — 렌더마다 계산하면 되므로 별도 state 불필요. 둘째, props를 그대로 복사한 값 — 부모가 props를 바꿔도 state는 첫 렌더 값 그대로 고정된다. source of truth를 한 곳으로 줄이는 것이 핵심이다.

---

---

# 깊이 중첩된 state를 업데이트할 때 무엇이 문제고 어떻게 해결하는가?

## 도입

React state는 불변 업데이트를 원칙으로 한다. 중첩된 객체를 업데이트하려면 변경 지점부터 root까지 부모 체인 전체를 복사해야 한다. 트리가 깊을수록 spread 연산이 층마다 쌓이고 코드가 폭발적으로 길어진다.

---

## 본문

> Updating nested state involves making copies of objects all the way up from the part that changed.
> If the state is too nested to update easily, consider making it "flat".

"중첩된 state를 업데이트하면 변경 지점부터 위쪽까지 모든 객체의 복사본을 만들어야 한다. state가 너무 중첩되어 업데이트하기 어려우면 'flat'하게 만드는 것을 고려하라."

- **all the way up from the part that changed**: 변경 노드 → 부모 → 조부모 → root까지 전체 복사. 불변 업데이트의 대가.

> Instead of a tree-like structure where each place has an array of its child places, you can have each place hold an array of its child place IDs.
> Then store a mapping from each place ID to the corresponding place.
> Now that the state is "flat" (also known as "normalized"), updating nested items becomes easier.

"각 장소가 자식 장소 배열을 직접 포함하는 트리 구조 대신, 각 장소가 자식 장소 ID 배열을 갖게 한다. 그리고 각 ID에서 대응하는 장소로의 매핑을 저장한다. 이제 state가 'flat'(정규화라고도 함)해지면 중첩된 항목 업데이트가 쉬워진다."

- **all the way up from the part that changed**: `O(depth)` 복사 비용 → flat하면 `O(1)` 수준으로 줄어든다.
- **child place IDs**: 자식 객체를 직접 임베드하지 않고 ID 배열로 보관. lookup 테이블은 별도.
- **flat / normalized**: 트리 구조 대신 ID 참조 + ID→객체 lookup 테이블. DB 정규화와 동일한 사고.

```js
// Before (깊은 중첩)
const places = {
  id: 'root',
  title: 'Root',
  childPlaces: [
    { id: 'a', title: 'A', childPlaces: [ ... ] },
    ...
  ]
};

// After (flat)
const placeById = {
  root: { id: 'root', title: 'Root', childIds: ['a', 'b'] },
  a:    { id: 'a',    title: 'A',    childIds: ['a1', 'a2'] },
  b:    { id: 'b',    title: 'B',    childIds: [] },
};
// 어떤 항목을 업데이트해도 placeById[id]만 교체하면 됨
```

---

## 종합

중첩 state 업데이트는 트리 깊이에 비례해 복사 비용이 선형으로 늘어난다. flat 구조로 정규화하면 어떤 노드를 업데이트해도 그 노드 하나만 교체하면 된다 — 부모 체인 복사가 필요 없다. 이는 DB의 외래키 참조와 정확히 같은 원리이며, React의 불변 업데이트와 결합하면 특히 효과가 크다.

---

---

# [UNVERIFIED] 전역 상태에서 Context와 외부 store(Zustand/Jotai/Redux)는 어떤 기준으로 갈라쓰나요?

## 도입

전역 상태가 필요할 때 Context와 Zustand·Jotai·Redux 같은 외부 store 중 무엇을 선택할지 헷갈리기 쉽다. 둘 다 컴포넌트 트리 어디서든 값을 꺼내 쓸 수 있지만, 리렌더 특성과 구독 방식이 근본적으로 다르다.

---

## 본문

**핵심 기준: 값이 얼마나 자주 바뀌는가**

Context는 Provider value가 바뀌는 순간 그 Context를 `useContext`한 모든 컴포넌트를 리렌더한다. selector가 없기 때문에 객체 안의 특정 필드 하나만 읽어도 객체 전체가 바뀌면 구독 컴포넌트 전부가 재렌더된다. 반면 외부 store는 selector 단위 구독을 지원한다. Zustand라면 `useStore(s => s.count)`처럼 원하는 슬라이스만 구독할 수 있고, 해당 슬라이스가 바뀌지 않으면 컴포넌트가 리렌더되지 않는다.

**변경 빈도별 도구 선택**

- Context가 적합한 경우: 거의 안 바뀌는 전역 값 — 테마(다크/라이트), 언어(locale), 로그인 사용자 정보. 리렌더가 자주 발생하지 않으므로 Context의 broadcast 특성이 문제가 되지 않는다. 의존성도 적고 별도 라이브러리 설치가 필요 없어 오버헤드가 낮다.
- 외부 store가 적합한 경우: 자주 바뀌는 전역 값 — 장바구니, 검색 필터, UI 상태(열린 패널, 선택된 탭 등). Context를 쓰면 해당 값을 구독하지 않는 컴포넌트까지 리렌더 대상이 되어 성능 문제가 생길 수 있다.

**비교 메커니즘 차이**

Context는 `Object.is`로 value를 통으로 비교한다. 객체를 value로 쓸 경우 `{ count, setCount }` 같은 리터럴을 매 렌더마다 새로 만들면 내용이 같아도 "달라짐"으로 판정되어 불필요한 리렌더가 발생한다. 이를 막으려면 `useMemo`·`useCallback`으로 참조를 안정화해야 한다. 외부 store는 selector 반환값을 `Object.is`로 비교하므로, 구독한 슬라이스가 실제로 변경되었을 때만 리렌더가 발생한다.

**실무 기준 요약**

```
거의 안 바뀜 (테마 / 언어 / 로그인 유저) → Context
자주 바뀜   (장바구니 / 필터 / UI 상태)   → 외부 store (Zustand, Jotai 등)
```

---

## 종합

Context와 외부 store의 분기 기준은 단 하나 — 변경 빈도다. Context는 의존성 없이 바로 쓸 수 있는 간결함이 장점이지만 selector가 없어 자주 바뀌는 값에 쓰면 리렌더가 광범위하게 퍼진다. 외부 store는 selector 단위 구독으로 불필요한 리렌더를 차단할 수 있어 자주 바뀌는 값에 적합하다. "이 값이 얼마나 자주 바뀌는가?"를 먼저 물은 뒤 도구를 고른다.

---

---

# Context로 자주 바뀌는 값을 다루면 어떤 렌더링 이슈가 생기는가?

## 도입

Context는 편리하지만 렌더링 특성을 이해하지 않으면 예상치 못한 성능 문제가 생긴다. Provider value가 바뀌면 그 Context를 구독하는 모든 컴포넌트가 리렌더된다 — `memo`로도 막을 수 없다.

---

## 본문

> React automatically re-renders all the children that use a particular context starting from the provider that receives a different value.

"React는 특정 context를 사용하는 모든 자식 컴포넌트를 Provider가 다른 값을 받는 순간부터 자동으로 리렌더한다."

- **all the children that use a particular context**: 그 Provider 아래에서 해당 context를 `useContext`한 컴포넌트 전부. 일부 필드만 읽어도 전부 리렌더 대상이다.

> The previous and the next values are compared with the `Object.is` comparison.

"이전 값과 새 값은 `Object.is` 비교로 판단한다."

- **`Object.is` comparison**: 참조 비교. 객체 리터럴 `{ on, toggle }`을 매 렌더마다 새로 만들면 안의 값이 같아도 "달라짐"으로 판정된다. 이것이 앞선 `useMemo`가 필요한 이유다.

> Skipping re-renders with `memo` does not prevent the children receiving fresh context values.

"`memo`로 리렌더를 스킵하는 것이 자식이 최신 context 값을 받는 것을 막지는 못한다."

- **Skipping re-renders with `memo`**: `React.memo`로 props 변화 없으면 리렌더를 스킵하는 최적화.
- **does not prevent**: context 채널은 props 비교를 우회한다. `memo`로 감싸도 context가 바뀌면 리렌더된다.

---

## 종합

Context는 구독자 전체를 한 번에 업데이트하는 broadcast 채널이다. 자주 바뀌는 값(마우스 위치, 스크롤 위치, 실시간 데이터)을 Context에 넣으면 구독하는 컴포넌트 수에 비례해 리렌더가 폭발적으로 늘어난다. 이런 경우 외부 store(Zustand, Jotai)를 고려한다 — 셀렉터로 필요한 슬라이스만 구독할 수 있어 불필요한 리렌더를 줄일 수 있다.

---

---

# [UNVERIFIED] 서버 상태는 왜 클라이언트 상태와 분리해서 React Query 같은 도구로 따로 관리하나요?

## 도입

"서버에서 가져온 데이터"도 `useState`에 넣으면 되지 않나? 라고 생각하기 쉽지만, 서버 상태는 클라이언트 상태와 본질이 다르다. 클라이언트 상태는 개발자가 완전히 소유하고 제어하는 값인 반면, 서버 상태는 소유권이 서버에 있고 언제든 서버에서 바뀔 수 있다. 이 차이가 전혀 다른 관리 문제를 만들어낸다.

---

## 본문

**서버 상태와 클라이언트 상태의 본질적 차이**

- 클라이언트 상태: 동기적으로 접근 가능하고, 개발자가 값을 직접 설정하며, 변경 주체가 클라이언트다. `useState`·`useReducer`·외부 store가 잘 맞는다.
- 서버 상태: 비동기적으로 가져와야 하고, 서버가 원본을 소유하며, 클라이언트에 있는 값은 언제나 "캐시"다. 서버에서 다른 사용자가 바꾸면 클라이언트 캐시는 stale(오래된 상태)이 된다.

**`useEffect + useState`로 직접 관리하면 생기는 문제**

```jsx
// 보일러플레이트가 많고 동기화 이슈가 발생하기 쉬운 패턴
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/users')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

이 패턴은 loading/error/data 세 state를 따로 관리해 동기화 실수가 생기기 쉽다. 또한 같은 엔드포인트를 여러 컴포넌트에서 요청하면 중복 요청이 발생하고, 탭 포커스 복귀 시 자동 refetch가 없어 stale 데이터가 화면에 남는다.

**React Query가 해결하는 문제**

- **캐싱**: 같은 queryKey를 여러 컴포넌트에서 구독해도 요청은 한 번만 발생하고, 결과는 캐시에서 공유된다.
- **stale 관리**: `staleTime` 설정으로 "이 기간 내에는 캐시를 신선한 것으로 취급"할 수 있다. 이후에는 자동으로 background refetch가 트리거된다.
- **자동 refetch**: 윈도우 포커스 복귀, 네트워크 재연결 시 자동으로 최신 데이터를 가져온다.
- **중복 요청 제거**: 같은 queryKey에 대해 여러 컴포넌트가 동시에 구독해도 요청은 하나로 합쳐진다.
- **loading/error 통합**: loading·error·data를 하나의 훅 반환값으로 받아 동기화 실수를 차단한다.

**상태 범주 분리의 이점**

서버 상태를 React Query로 분리하면, Zustand나 Context 같은 클라이언트 상태 store는 순수하게 "UI 상태"만 담게 된다. 두 범주의 관심사가 명확히 나뉘어 코드가 단순해진다.

---

## 종합

서버 상태의 핵심 특성은 "캐시"라는 점이다 — 클라이언트에 있는 값은 항상 서버 원본의 스냅샷이며 언제든 stale이 될 수 있다. `useState`는 캐싱·stale 관리·자동 refetch·중복 제거를 지원하지 않아 서버 상태를 다루기에 맞지 않는다. React Query는 이 문제들을 전담하는 레이어를 제공하고, 클라이언트 상태 store가 진짜 클라이언트 UI 상태에만 집중할 수 있게 해준다.

---

---

# [UNVERIFIED] overlay 같은 특화 상태는 왜 별도 라이브러리(overlay-kit 등)로 분리하나요?

## 도입

모달, 토스트, confirm 다이얼로그, drawer 같은 overlay UI는 React의 선언형 모델과 근본적으로 충돌하는 특성을 가진다. 컴포넌트 트리 어딘가에 `<Modal isOpen={isOpen}>` 형태로 JSX를 꽂아두고 boolean state로 보이고 숨기는 방식이 일반적이지만, 이 패턴은 사용 측에서 상태를 직접 관리해야 하고 prop drilling 문제가 그대로 남는다.

---

## 본문

**선언형 React 모델과 overlay의 충돌**

React는 "어떤 상태에서 UI가 어때야 하는가"를 선언하는 방식으로 작동한다. 그런데 overlay는 "지금 당장 이 모달을 열어라"는 명령형 흐름에서 자연스럽게 발생한다. 버튼 클릭 핸들러 안에서 `openConfirm()` 같은 명령형 호출이 필요하고, 사용자 응답(확인/취소)을 다시 받아서 다음 로직을 진행해야 한다. 이 흐름을 선언형 state로 표현하면 상태 변수, 핸들러, JSX가 여러 곳에 흩어진다.

**overlay-kit 같은 라이브러리가 제공하는 해결책**

```jsx
// 명령형 Promise 기반 API
const result = await overlay.open(({ isOpen, close }) => (
  <ConfirmDialog isOpen={isOpen} onConfirm={() => close(true)} onCancel={() => close(false)} />
));

if (result) {
  // 사용자가 확인을 눌렀을 때 실행
  await deleteItem();
}
```

이 패턴의 장점:
- **UX 흐름이 코드 흐름과 일치**: `await overlay.open(...)` 이후 라인이 실행되는 시점이 사용자가 응답한 시점이다. 콜백이나 상태 분기 없이 선형 코드로 작성할 수 있다.
- **컴포넌트 트리 밖 상태 관리**: overlay 상태를 컴포넌트 외부에 두어 prop drilling이 발생하지 않는다. 트리 어느 깊이에서든 `overlay.open()`을 호출할 수 있다.
- **mount/unmount 자동 관리**: 닫힌 overlay는 자동으로 unmount되어 메모리를 정리한다.

**일반 useState 패턴의 한계**

```jsx
// 상태 변수, 핸들러, JSX가 흩어진 선언형 패턴
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [pendingId, setPendingId] = useState(null);

const handleDelete = (id) => {
  setPendingId(id);
  setIsDeleteModalOpen(true);
};
const handleConfirm = async () => {
  await deleteItem(pendingId);
  setIsDeleteModalOpen(false);
};

// JSX 어딘가에
<DeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirm} onCancel={() => setIsDeleteModalOpen(false)} />
```

state 변수 2개, 핸들러 2개, JSX 배치까지 관리 포인트가 분산된다. overlay 수가 늘어날수록 같은 패턴이 반복된다.

---

## 종합

overlay는 "지금 열어라 → 사용자 응답 → 다음 로직"이라는 명령형·비동기 흐름이 자연스러운 도메인이다. 일반 useState로 선언형으로 표현하면 상태·핸들러·JSX가 분산되고 prop drilling이 남는다. overlay-kit 같은 라이브러리는 Promise 기반 명령형 API로 이 흐름을 감싸고, 상태를 트리 밖에 두어 위치 제약도 없앤다. overlay는 "UI에 띄우는 명령"에 가까운 성격이기 때문에 클라이언트 상태나 서버 상태와 분리해 전용 레이어로 관리하는 것이 코드를 단순하게 유지하는 방법이다.
