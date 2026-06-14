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
