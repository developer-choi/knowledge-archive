# [UNVERIFIED] 상태관리 어떻게 하세요?

## 도입

"상태관리를 어떻게 하세요?"라는 질문은 단계적으로 접근할 수 있다. 상태를 추가하기 전에 먼저 필요 없는 state를 제거하고, 그 다음 범위(로컬 vs 전역)와 특성(트리 위치별 값 차이, 서버 vs 클라이언트)에 따라 도구를 선택한다.

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

step 3: 전역 상태 → Context는 통로, store는 보관소 (대체재가 아님)
  → 서브트리마다 값이 달라야 함: Context (중첩 provider 국소 override)
  → 리렌더 번짐·보일러플레이트가 걸림: 외부 store (Zustand, Jotai 등)

step 4: 특화 상태는 별도 분리
  → 서버 상태 (fetch 결과, 캐시, loading/error): React Query / TanStack Query
  → overlay 상태 (모달, 토스트, drawer): overlay-kit 등 전용 라이브러리
```

---

## 종합

상태관리의 핵심은 "이 값이 정말 state여야 하는가?"를 먼저 물은 뒤, 범위와 특성에 맞는 도구를 선택하는 것이다. Context는 값을 나르는 통로라 서브트리마다 다른 값을 내려보내야 할 때 대체 수단이 없고, 외부 store는 구독 단위를 좁혀 리렌더를 줄이며, React Query는 서버 상태의 캐싱·동기화를 전담한다. 모든 것을 하나의 도구로 해결하려 하지 말고 각 상태의 특성에 맞는 도구를 고르는 것이 실무 관점의 답이다.

---

# 불필요한 state가 뭐가 있을까요?

## 도입

state를 "화면과 관련 있고 바뀔 수 있는 값"으로 정의하면 state 변수가 금방 늘어난다. 공식 문서는 state 변수 하나하나를 "움직이는 부품(moving piece)"으로 보고, 부품 수를 줄이는 것을 설계의 출발점으로 삼는다.

걷어낼 대상은 네 종류다 — 항상 같이 바뀌는 값, 불가능한 조합을 만들어내는 값, 다른 값에서 계산할 수 있는 값, props를 복사해둔 값. 넷 다 뿌리가 같다. 같은 정보가 두 군데에 적혀 있으면 어긋날 수 있고, 어긋나는 순간이 버그다.

---

## 본문

> Simplicity is key: each piece of state is a "moving piece", and you want as few "moving pieces" as possible.
> More complexity leads to more bugs!

"단순함이 핵심이다. 각 state 조각은 '움직이는 부품'이며, 가능한 한 적은 '움직이는 부품'을 원해야 한다. 복잡도가 높을수록 버그가 많아진다!"

- **moving piece**: 기계 부품 비유. state 변수 하나하나가 움직이는 부품이며, 서로 어긋날 수 있는 지점이다.
- **as few moving pieces as possible**: state가 N개면 동기화 관리 대상이 N개다. 복잡도가 커질수록 버그 표면이 늘어난다.
- **More complexity leads to more bugs**: state 2개는 4가지 조합, 3개는 8가지 조합이 가능하다. 대부분 유효하지 않은 조합을 방어하는 코드가 필요하게 된다.

### 항상 같이 바뀌는 두 값

마우스 좌표처럼 언제나 함께 갱신되는 값을 `x`, `y` 두 변수로 나눠두면, 이벤트 핸들러에서 둘 다 갱신해야 한다는 것을 사람이 계속 기억해야 한다. 하나를 빠뜨리는 순간 버그가 된다.

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

// After (하나만 갱신)
const [position, setPosition] = useState({ x: 0, y: 0 });
```

합치고 나면 `setPosition` 하나만 호출하면 되므로 `setY`를 빠뜨릴 가능성 자체가 사라진다. 반대로 관련 없는 값을 억지로 묶으면 부분 갱신이 번거로워지니, 기준은 언제나 "항상 같이 바뀌는가"다.

### 불가능한 조합을 만들어내는 값

`isTyping`과 `isSubmitting` 두 boolean을 두면 `(true, true)` 조합이 메모리에서 표현 가능하다. 하지만 "타이핑 중이면서 제출 중"인 UI는 실제로 없다.

> Does this state cause a paradox?
> For example, `isTyping` and `isSubmitting` can't both be `true`.
> A paradox usually means that the state is not constrained enough.

"이 state가 역설을 만드는가? 예를 들어 `isTyping`과 `isSubmitting`은 둘 다 `true`일 수 없다. 역설은 보통 state가 충분히 제약되지 않았다는 것을 의미한다."

- **paradox**: 논리적으로 동시에 성립할 수 없는 조합이 메모리에서 표현 가능한 상황.
- **not constrained enough**: state 타입이 유효하지 않은 조합을 허용할 만큼 느슨하다.

> There are four possible combinations of two booleans, but only three correspond to valid states.
> To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`.

"두 boolean의 조합은 네 가지인데 유효한 상태는 세 가지뿐이다. '불가능한' state를 제거하려면 이것들을 `'typing'`, `'submitting'`, `'success'` 세 값 중 하나여야 하는 `status`로 합칠 수 있다."

- **four possible combinations**: `(false,false)`, `(true,false)`, `(false,true)`, `(true,true)` — 4가지.
- **impossible state**: `(true,true)` — 현실 UI에는 없지만 메모리에서는 표현 가능하다.
- **combine these into a `status`**: union 타입으로 바꾸면 유효한 값만 취할 수 있다.

```tsx
// Before (불가능한 조합이 가능함)
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// After (유효한 상태만 가능)
type Status = 'typing' | 'submitting' | 'success';
const [status, setStatus] = useState<Status>('typing');
```

핵심은 사람이 지켜야 하던 규칙이 표현 불가능성으로 바뀐다는 점이다. `status`를 `'submitting'`으로 두면서 동시에 `'typing'`이 되게 하는 코드는 애초에 쓸 수가 없다.

### 다른 값에서 계산할 수 있는 값

state를 추가할 때마다 "이미 있는 값에서 계산할 수 있지 않나?"를 먼저 물어야 한다. 계산 가능한 값을 따로 저장하면 원본과 사본을 항상 맞춰줘야 한다.

> Is the same information available in another state variable already?
> By making them separate state variables, you risk them going out of sync and causing bugs.
> Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.

"같은 정보가 이미 다른 state 변수에 있는가? 별도 state 변수로 만들면 동기화가 어긋날 위험이 있다. `isEmpty`를 제거하고 `answer.length === 0`으로 체크하면 된다."

- **same information available in another state variable**: 이미 다른 state에서 도출 가능한 정보.
- **going out of sync**: `setAnswer`만 호출하고 `setIsEmpty`를 빠뜨리면 둘이 엇갈린다.
- **check `answer.length === 0`**: 정답은 `answer` 하나. 렌더마다 계산하면 동기화할 필요 자체가 없다.

같은 물음을 뒤집은 형태도 있다.

> Can you get the same information from the inverse of another state variable?
> `isError` is not needed because you can check `error !== null` instead.

"다른 state 변수를 뒤집어서 같은 정보를 얻을 수 있는가? `isError`는 필요 없다 — 대신 `error !== null`을 확인하면 되기 때문이다."

- **inverse**: 뒤집어 본 값. "`error`에 값이 들어 있는가"를 뒤집으면 곧 "오류가 없는 상태인가"가 되므로, 오류 여부라는 정보가 `error` 하나에 이미 다 들어 있다.
- **check `error !== null` instead**: 저장 대신 계산. 렌더할 때마다 `error`에서 읽어내므로 두 값이 어긋날 여지가 없다.

이게 없으면 어떻게 되는지는 조합을 세어 보면 보인다. `error`에 메시지가 들어 있는데 `isError`는 `false`인 조합이 만들어질 수 있고, 그러면 오류 메시지는 떠 있는데 화면은 오류 상태가 아닌 모습이 된다. `setError`만 부르고 `setIsError`를 빠뜨린 한 줄이 곧 그 화면이다.

### props를 복사해둔 값

앞의 셋이 state끼리의 중복이라면, 이건 props와 state 사이의 중복이다.

> The problem is that if the parent component passes a different value of messageColor later (for example, 'red' instead of 'blue'), the color state variable would not be updated!
> The state is only initialized during the first render.
> This is why "mirroring" some prop in a state variable can lead to confusion.

"부모가 나중에 다른 `messageColor` 값을 넘겨도 `color` state는 업데이트되지 않는다. state는 첫 렌더에서만 초기화된다. 그래서 prop을 state 변수에 '미러링'하면 혼란을 부를 수 있다."

- **only initialized during the first render**: 초기값 인자는 첫 렌더에서 한 번만 쓰인다. 이후 렌더에서 다른 값을 넣어도 무시된다.
- **mirroring**: props를 state에 그대로 복사해두는 것. 원본은 부모에 있는데 사본이 자식에 따로 생기는 셈이다.

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

#### 미러링이 정당한 유일한 경우

> "Mirroring" props into state only makes sense when you want to ignore all updates for a specific prop.
> By convention, start the prop name with initial or default to clarify that its new values are ignored.

"props를 state로 미러링하는 것은 특정 prop의 모든 업데이트를 무시하고 싶을 때만 말이 된다. 관례상 새 값이 무시된다는 것을 분명히 하려고 prop 이름을 initial이나 default로 시작한다."

```jsx
function Message({ initialColor }) {
  const [color, setColor] = useState(initialColor);
  // initialColor 변경은 의도적으로 무시
}
```

즉 "업데이트가 반영되지 않는다"는 성질이 버그가 아니라 원하는 동작일 때만 쓰고, 그 의도를 이름으로 알린다.

---

## 종합

불필요한 state를 걷어낼 때 던지는 물음은 넷이다.

```
물음 1  항상 같이 바뀌는가?                x, y                → position 하나로
물음 2  이 state가 모순을 만드는가?          isTyping+isSubmitting → status 하나로
물음 3  같은 정보가 다른 값에 이미 있는가?    isEmpty / isError    → answer.length === 0 / error !== null
물음 4  props를 그대로 복사했는가?          color = messageColor → prop 직접 사용
```

물음 1은 흩어진 것을 묶는 쪽이고, 2~4는 중복을 지우는 쪽이다. 방향은 반대지만 목적은 같다 — 하나의 정보에 정답이 놓인 자리를 하나로 만드는 것. 정답이 둘이 되는 순간 그 둘을 맞춰주는 동기화 코드가 필요해지고, 그 코드를 한 번 빠뜨린 것이 곧 버그다.

판단이 어려울 때 기준은 "저장할 것인가 계산할 것인가"다. 렌더 도중 다른 값에서 만들어낼 수 있으면 state가 아니라 그냥 변수다. 출처 예제의 폼은 이 정리를 거쳐 state 변수가 7개에서 `answer`·`error`·`status` 3개로 줄어든다.

---

# 두 컴포넌트의 state가 항상 함께 바뀌어야 한다면, 그 state는 어디에 두는가?

> Sometimes, you want the state of two components to always change together.
> To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props.

"때로는 두 컴포넌트의 state가 항상 함께 바뀌기를 원한다. 그러려면 두 컴포넌트 모두에서 state를 제거하고, 가장 가까운 공통 부모로 옮긴 뒤, props로 다시 내려보낸다."

- **always change together**: 한쪽이 열리면 다른 쪽은 반드시 닫혀야 하는 것처럼, 두 값이 언제나 한 번에 같이 정해지는 관계.
- **remove state from both of them**: 옮기기 전에 먼저 지운다. 자식에 state를 남겨둔 채 부모에도 같은 정보를 만들면 정답이 두 군데가 되어 어긋난다.
- **closest common parent**: 두 자식을 모두 자손으로 갖는 조상 중 가장 아래에 있는 것. 더 위로 올려도 동작은 하지만, 값을 쓰지도 않는 중간 컴포넌트들이 props를 통과시키는 prop drilling이 그만큼 길어진다.
- **lifting state up**: 값을 위로 옮기는 게 아니라 **소유권**을 위로 옮기는 것이다. 자식은 그 값을 여전히 쓰지만, 이제 props로 빌려 쓴다.

---

# 전역 상태가 필요할 때, 외부 store 대신 Context를 써야 하는 경우는 언제인가?

## 도입

"전역 상태니까 store, 지역 상태니까 useState"로 나누면 Context가 갈 자리가 없어 보인다. 그런데 store를 이미 쓰고 있는 프로젝트에서도 Context를 걷어낼 수 없는 자리가 남는다. 그 자리는 성능이나 규모가 아니라, 값이 트리의 어느 위치에서 읽히느냐에 따라 달라져야 하는가로 갈린다.

---

## 본문

### 둘은 애초에 같은 종류의 물건이 아니다

비교를 시작하기 전에 짚을 전제가 있다. Redux 공식 FAQ가 둘의 차이를 이렇게 정리한다.

> Context, on the other hand, does not hold any state. It is only a conduit for the data. To express changes in data you need to rely on the state of a parent component.

반면 Context는 어떤 상태도 보관하지 않는다. 데이터가 지나가는 통로일 뿐이다. 데이터의 변화를 표현하려면 부모 컴포넌트의 state에 의존해야 한다.

- **conduit**: 전선이나 물이 지나가는 관. 안에 무엇을 담아두는 그릇이 아니라 지나가게 해주는 길이다
- **does not hold any state**: 값을 들고 있지 않는다. 그래서 Context 자체는 "상태 관리 도구"가 아니다

같은 FAQ는 Redux도 내부적으로 Context를 쓴다고 밝힌다. 즉 둘은 경쟁 관계가 아니라 층이 다르다. 실제 대립은 이렇게 놓아야 정확하다.

```
"Context를 쓸까 store를 쓸까"  (X)  ← 층이 달라서 비교가 성립하지 않음

"상태를 React 안에 둘까 밖에 둘까"  (O)
  React state + Context   → 값은 React가 들고, Context가 아래로 나름
  React 밖의 store        → 값은 store가 들고, 컴포넌트가 구독함
                            (store 인스턴스를 꽂아주는 데 Context를 쓰기도 함)
```

### 대체 수단이 없는 자리 — 서브트리마다 다른 값

React 공식 문서가 Context의 용처를 열거하면서 든 예다.

> Some apps also let you operate multiple accounts at the same time (e.g. to leave a comment as a different user).

어떤 앱은 여러 계정을 동시에 다루게 해준다. 예를 들면 다른 사용자로 댓글을 남기는 경우다.

> In those cases, it can be convenient to wrap a part of the UI into a nested provider with a different current account value.

그런 경우에는 UI의 일부를 다른 현재 계정 값을 가진 중첩 provider로 감싸는 것이 편리하다.

- **nested provider**: 이미 위에 provider가 있는데 그 안쪽에 또 하나를 두는 것
- **a part of the UI**: 화면 전체가 아니라 일부. 이 "일부만 다르게"가 핵심이다

```
<AccountContext value={나}>
  <Timeline />          ← 여기서 읽으면 "나"
  <AccountContext value={부계정}>
    <CommentBox />      ← 여기서 읽으면 "부계정"
  </AccountContext>
</AccountContext>
```

같은 화면에 두 값이 동시에 살아 있고, 어느 값을 읽을지는 컴포넌트가 트리의 어디에 놓였는지가 정한다. store는 모듈 하나에 값 하나라 이 그림을 그대로 만들 수 없다. 인스턴스를 두 개 만드는 방법이 남는데, 그러면 "이 컴포넌트는 어느 인스턴스를 봐야 하는가"를 알려줄 수단이 필요하고 결국 Context로 돌아온다.

### store 진영도 같은 자리를 인정한다

이건 React 쪽 주장만이 아니다. Zustand 문서가 자기 store를 설명하면서 같은 말을 한다.

> The store created with `create` doesn't require context providers.

`create`로 만든 store는 context provider를 필요로 하지 않는다.

> In some cases, you may want to use contexts for dependency injection or if you want to initialize your store with props from a component.

어떤 경우에는 의존성 주입을 위해, 또는 컴포넌트의 props로 store를 초기화하고 싶을 때 context를 쓰고 싶을 수 있다.

- **dependency injection**: 쓸 물건을 안에서 직접 만들지 않고 밖에서 넣어주는 방식. 여기서는 "어느 store 인스턴스를 쓸지"를 밖에서 꽂아주는 것
- **initialize your store with props**: store의 초기값을 컴포넌트가 받은 props로 정하는 것. 화면마다 다른 초기값이 필요하면 모듈 전역 store로는 안 된다

양쪽 문서가 각자의 언어로 같은 경계를 그린다. "트리 위치에 따라 달라져야 하는 값"과 "인스턴스를 골라 꽂는 일"은 Context의 몫이다.

---

## 종합

Context와 store를 성능으로 비교하면 답이 안 나온다. 층이 다르기 때문이다. Context는 값을 나르는 통로이고 store는 값을 보관하는 그릇이라, 실제 선택지는 "React state + Context"와 "React 밖의 store" 둘이다.

그중 Context를 써야만 하는 자리는 한 가지 성질로 요약된다. 같은 값이 트리 위치에 따라 달라져야 할 때다. 다중 계정, 테마를 일부 영역만 뒤집기, 같은 컴포넌트를 서로 다른 초기값으로 여러 벌 띄우기가 모두 여기 해당한다. store는 모듈 하나에 값 하나라서 이 요구를 직접 만족시키지 못하고, 인스턴스를 나눠도 그 인스턴스를 꽂아주는 일에 다시 Context가 필요하다.

그래서 이 항목은 취향 문제가 아니다. 위 성질이 있으면 Context가 사실상 유일한 수단이고, 없으면 이 근거만으로는 Context를 골라야 할 이유가 되지 않는다.

---

# 반대로 Context 대신 외부 store(Zustand/Jotai/Redux)를 쓰는 것이 이득인 경우는 언제인가?

## 도입

앞 항목이 "store로는 안 되는 자리"를 봤다면 이번은 반대 방향이다. Context로도 돌아가긴 하는데 store로 옮기면 나아지는 자리가 있다. 이득은 두 갈래로 갈리는데, 하나는 리렌더 비용이고 하나는 코드 분량이다.

---

## 본문

### store 쪽이 내세우는 세 가지

Zustand 문서가 Context 대비 이점을 직접 열거한다.

> Why zustand over context?
> - Less boilerplate
> - Renders components only on changes
> - Centralized, action-based state management

왜 context 대신 zustand인가?
- 보일러플레이트가 적다
- 바뀔 때만 컴포넌트를 렌더한다
- 액션 기반으로 한곳에 모인 상태 관리

- **boilerplate**: 기능과 상관없이 매번 똑같이 되풀이해 써야 하는 코드. 여기서는 context 객체 만들기, provider로 감싸기, 값 조립하기가 그것이다
- **only on changes**: 바뀔 때만. 바꿔 말하면 Context는 안 바뀐 것에도 렌더가 번진다는 뜻이다
- **action-based**: 값을 아무 데서나 직접 고치는 대신, 정해진 동작을 호출해 바꾸는 방식

### 리렌더 축은 Context 쪽 성질에서 나온다

"바뀔 때만 렌더한다"가 이점이 되는 이유는 Context가 그 반대이기 때문이다. 그 메커니즘은 별도 질문에서 다룬다.

- [context의 단점은 무엇인가? → `context-api.md`](context-api.md#context의-단점은-무엇인가)

요점만 옮기면, Context는 값을 통째로 비교하므로 객체를 담았을 때 그 안의 필드 하나만 바뀌어도 그 Context를 읽는 컴포넌트가 전부 다시 그려진다. 내가 안 쓰는 필드가 바뀌어도 마찬가지이고, `memo`로도 막히지 않는다. store는 여기서 구독 단위를 좁힌다. Zustand라면 `useStore(s => s.count)`처럼 필요한 조각만 지정하고, 그 조각이 그대로면 렌더를 건너뛴다.

주의할 것은 이 이점이 규모를 타는 이점이라는 점이다. React 공식 문서는 같은 상황을 두고 작은 앱에서는 문제가 되지 않으며, 커지면 `useMemo`·`useCallback`으로 다듬는 최적화라고 설명한다. 즉 "Context를 쓰면 느려진다"가 아니라 "규모가 커지면 손이 더 간다"에 가깝다.

### 보일러플레이트 축 — provider가 쌓이는 문제

"보일러플레이트가 적다"는 한 줄만으로는 뭐가 문제인지 잡히지 않는다. Jotai 문서가 그 증상을 구체적으로 적어둔다.

> Provider hell: It's likely that your root component has many context providers, which is technically okay, and sometimes desirable to provide context in different subtree.

provider 지옥: 루트 컴포넌트가 많은 context provider를 갖게 되기 쉽다. 기술적으로는 괜찮고, 서로 다른 서브트리에 context를 제공하려면 오히려 바람직할 때도 있다.

> Dynamic addition/deletion: Adding a new context at runtime is not very nice, because you need to add a new provider and its children will be re-mounted.

동적 추가·삭제: 런타임에 새 context를 추가하는 것은 그리 좋지 않다. 새 provider를 추가해야 하고 그 자식들이 다시 마운트되기 때문이다.

- **Provider hell**: provider가 겹겹이 쌓여 루트가 계단처럼 되는 상태를 가리키는 별명
- **re-mounted**: 컴포넌트가 지워졌다가 다시 생기는 것. 그 안의 state가 초기화되므로 화면이 튄다

```
<ThemeProvider>
  <AuthProvider>
    <CartProvider>
      <FilterProvider>
        <App />          ← 전역 값이 늘 때마다 계단이 한 칸씩 깊어진다
```

store를 쓰면 이 계단이 생기지 않는다. 값을 쓰는 컴포넌트가 직접 store를 부르므로 트리 어디에도 감싸는 층을 만들 필요가 없다. 대신 잃는 것이 있는데, 그게 앞 항목에서 본 "서브트리마다 다른 값"이다. 계단은 위치에 따라 값을 갈아 끼우는 능력의 대가이기도 하다.

---

## 종합

store로 옮겨서 얻는 이득은 두 가지다. 구독 단위를 좁혀 안 쓰는 값의 변화에 렌더가 번지지 않게 하는 것, 그리고 provider 계단과 그에 딸린 되풀이 코드를 없애는 것이다.

다만 근거의 무게는 솔직하게 매겨두는 편이 낫다. 리렌더 쪽은 React 공식 문서가 메커니즘까지 진술하는 사실이고, 보일러플레이트 쪽은 라이브러리들이 자기 문서에서 내세우는 주장이라 성격이 다르다. 그리고 React 공식 문서는 같은 리렌더 현상을 작은 앱에서는 문제가 아니라고 못박는다. 그러니 "전역이면 store"가 아니라, 렌더가 실제로 번져서 손해가 보이거나 provider 계단이 관리하기 버거워졌을 때 옮기는 순서가 소스와 맞는다.

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
