# React reconciliation이란 무엇인가? 왜 O(n³) 대신 O(n) 알고리즘을 쓰는가?

## 도입

React를 쓸 때 상태나 props가 바뀌면 화면이 달라집니다. 근데 "달라진 부분만 DOM에 반영"하려면 React가 **이전 UI 구조와 새 UI 구조를 비교**해야 해요. 이 비교 과정이 reconciliation입니다.

문제는 트리 구조 두 개를 비교해서 최소 변경을 찾는 건 이론적으로 꽤 비싼 연산이라는 겁니다.

---

## 본문

> When you use React, at a single point in time you can think of the **render()** function as creating a tree of **React elements.**

"React에서 `render()` 함수는 특정 시점에 **React 엘리먼트의 트리**를 만들어냅니다."

- **render()**: 현재 state/props 기준으로 "UI가 어떻게 생겨야 하는지"를 React 엘리먼트 객체들의 트리로 반환하는 함수. 실제 DOM이 아니라 가벼운 JS 객체 트리입니다.
- **React elements**: `{ type: 'div', props: { children: [...] } }` 같은 plain 객체들. 실제 DOM 노드가 아니라 "이렇게 생겨야 한다"는 설계도입니다.

> On the next state or props update, that **render()** function will return a different tree of **React elements.**

"다음 state/props 업데이트에서 `render()`는 **다른** React 엘리먼트 트리를 반환합니다."

즉 업데이트마다 React는 새 트리를 만들고, 이걸 이전 트리와 비교해야 합니다.

> There are some generic solutions to this algorithmic problem of generating the minimum number of operations to transform one tree into another. However, the state of the art algorithms have a complexity in the order of O(n³)

"한 트리를 다른 트리로 변환하는 최소 연산 집합을 구하는 일반적인 알고리즘은 O(n³) 복잡도를 가집니다."

- **O(n³)**: 노드가 n개일 때 n × n × n번 연산. 트리를 완전히 비교하면 각 노드를 다른 모든 노드와 대조하고, 거기에 순서 정렬까지 고려해야 해서 이렇게 됩니다.

> If we used this in React, displaying 1000 elements would require in the order of one billion comparisons. This is far too expensive.

"React에 이걸 쓰면 1000개 엘리먼트 기준 약 10억 번 비교가 필요합니다. 너무 비쌉니다."

```
n = 1000
O(n³) = 1,000 × 1,000 × 1,000 = 1,000,000,000 번
```

60fps 기준 한 프레임에 16ms밖에 없는데 10억 번 비교는 불가능합니다.

> Instead, React implements a **heuristic O(n) algorithm** based on two assumptions

"대신 React는 두 가정을 기반으로 한 **휴리스틱 O(n) 알고리즘**을 구현합니다."

- **heuristic**: "정확한 최적해를 찾지는 않지만, 대부분의 경우 충분히 잘 동작하는" 어림짐작 전략. 정확도 일부를 포기하고 속도를 얻는 트레이드오프입니다.
- **O(n)**: 노드 n개를 한 번씩만 훑는 선형 시간. 1000개면 1000번입니다.

---

## 종합

Reconciliation은 React가 "이전 트리 → 새 트리"로 바뀔 때 **실제 DOM에서 뭘 바꿀지 결정하는 과정**입니다. 이론적으로 최적 알고리즘은 O(n³)이라 실용적으로 못 씁니다. 그래서 React는 "두 가지 가정이 대부분의 UI에서 성립한다"고 전제하고, 그 가정 위에서 O(n)으로 동작하는 알고리즘을 선택했습니다. 다음 질문에서 바로 그 두 가정을 다룹니다.

```
상태/props 변경
  → render() 실행 → 새 React 엘리먼트 트리 생성
  → reconciliation: 이전 트리 vs 새 트리 비교 (O(n))
  → 최소 DOM 업데이트 결정
  → 실제 DOM 반영 (commit)
```

---

# React diffing 휴리스틱이 기반하는 두 가정은 무엇인가?

## 도입

두 트리를 비교해 최소 변경을 찾는 이론적 알고리즘은 `O(n³)` 복잡도를 가진다. 컴포넌트 1000개면 10억 번 연산이 필요해 실용적이지 않다. React는 대부분의 UI에서 성립하는 두 가정을 전제로 이 복잡도를 `O(n)`으로 낮췄다.

---

## 본문

> Instead, React implements a heuristic O(n) algorithm based on two assumptions:
>
> 1. Two elements of different types will produce different trees.
> 2. The developer can hint at which child elements may be stable across different renders with a key prop.

"React는 두 가정에 기반한 휴리스틱 `O(n)` 알고리즘을 구현한다.
1. 다른 타입의 두 엘리먼트는 다른 트리를 생성한다.
2. 개발자는 key prop으로 어떤 자식 엘리먼트가 렌더 간에 안정적인지 React에 힌트를 줄 수 있다."

- **heuristic**: 정확한 최소해 대신 "대부분 맞는" 어림짐작으로 속도를 확보하는 방식. 정확도 100%가 아니라 실용적 속도를 선택한 것이다.
- **assumptions**: 알고리즘이 효율적으로 동작하기 위해 깔고 가는 전제. 이 전제가 깨지면 효율이 떨어지거나 state가 손실된다.
- **stable across different renders**: 같은 항목이 렌더 간에 같은 식별자로 유지되는 성질. key가 이것을 React에 알려준다.
- **key prop**: key가 없으면 React는 위치(인덱스)로만 항목을 식별한다. key를 달면 위치가 바뀌어도 "이전 렌더의 `key="duke"`와 지금 `key="duke"`는 같은 항목"임을 React가 알아볼 수 있다. "힌트를 준다"는 표현은 key가 강제가 아니라 개발자가 명시적으로 제공하는 정보이기 때문 — 안 달면 React는 인덱스로 추측하고, 달면 그 식별자로 매칭한다.

두 가정이 깨졌을 때 발생하는 비효율:

```
가정 1 위반:
  <div>content</div>  →  <span>content</span>
  → 타입이 달라서 전부 unmount → remount → state 손실

가정 2 위반:
  <li key={Math.random()}>Duke</li>
  → 매 렌더마다 key가 바뀌어 같은 항목인데도 재생성
```

> In practice, these assumptions are valid for almost all practical use cases.

"실제로 이 가정들은 거의 모든 실용적인 사용 사례에서 유효하다."

---

## 종합

두 가정이 성립하는 한 React의 diff는 트리를 한 번만 훑어 `O(n)` 안에 끝난다. 가정 1 덕분에 타입이 다르면 바로 트리 전체를 교체하고 자식을 비교하지 않아도 된다. 가정 2 덕분에 key로 같은 항목임을 표시하면 인덱스 기반 매칭 없이 재사용 여부를 결정할 수 있다. 이 두 가정을 역으로 활용하면 — 같은 타입 유지로 state 보존, key로 의도적 리셋 — React의 렌더링 동작을 예측 가능하게 제어할 수 있다.

```
O(n³) 이론 알고리즘
  → 가정 1 적용: 타입 다름 → 즉시 트리 교체 (자식 비교 생략)
  → 가정 2 적용: key로 안정적 식별 (인덱스 기반 매칭 탈피)
  = O(n) 휴리스틱 알고리즘
```

---

# React diffing 알고리즘은 두 트리를 구체적으로 어떻게 비교하는가?

## 도입

앞서 React는 두 가정으로 O(n) diffing을 한다고 했는데, 실제로 루트부터 어떤 순서로 비교하고 어떤 판단을 내리는지가 이 질문의 핵심입니다. 규칙은 단순한데, 이 규칙의 결과가 state 유지 여부에 직결됩니다.

---

## 본문

React는 두 트리를 **루트 엘리먼트부터 아래로 내려가며** 비교합니다. 각 노드에서 다음 순서로 판단합니다.

**판단 1 — 타입이 다른가?**

```
이전: <div>
새:  <section>
```

타입이 다르면 React는 이전 트리를 **전부 버리고 새로 마운트**합니다. 자식까지 전부 unmount되고, state도 모두 사라집니다. 자식을 더 비교해볼 필요 자체가 없으므로 탐색을 멈춥니다 — 이게 O(n) 달성의 핵심입니다.

```
<div>        →   <section>
  <Counter/>         <Counter/>
```
위처럼 바꾸면 `Counter`의 state가 초기화됩니다. `div`와 `section`이 타입이 달라 전체를 교체하기 때문입니다.

**판단 2 — 타입은 같은데 key가 다른가?**

타입이 같아도 key prop이 바뀌면 판단 1과 동일하게 처리합니다 — unmount → remount → state 초기화. 이걸 역으로 활용하면 **의도적으로 state를 리셋**할 수 있습니다:

```jsx
// userId가 바뀌면 Profile을 완전히 새로 마운트하고 싶을 때
<Profile key={userId} />
```

**판단 3 — 타입도 같고 key도 같은가?**

이 경우 React는 기존 컴포넌트를 **그대로 유지**하고 달라진 props만 업데이트합니다. state는 보존됩니다. 자식들도 같은 규칙으로 재귀 비교합니다.

```
<Button color="blue" />  →  <Button color="red" />
→ color prop만 업데이트, 컴포넌트 유지, state 보존
```

```
비교 흐름
루트 엘리먼트
  ├─ 타입 다름 → 전체 교체 (탐색 종료)
  ├─ 타입 같음, key 다름 → 전체 교체
  └─ 타입 같음, key 같음 → props 업데이트, state 보존
        └─ 자식들도 동일 규칙 재귀 적용
```

---

## 종합

React diffing의 판단 기준은 **타입 → key → props** 순서입니다. 타입이 다르면 즉시 트리를 버리기 때문에 자식을 볼 필요가 없어 O(n)이 가능해집니다. 이 규칙의 실무적 의미는 — **컴포넌트 타입을 유지하면 state가 살고, 바꾸면 state가 죽는다**는 겁니다. 흔한 실수 중 하나가 렌더 함수 안에서 컴포넌트를 새로 정의하는 것인데, 그러면 매 렌더마다 새 타입으로 인식돼 state가 계속 초기화됩니다.

---

# 리스트에서 항목을 앞에 삽입할 때 key prop이 없으면 어떤 비효율이 발생하는가?

## 도입

key 없이 리스트를 렌더링하면 React는 인덱스(0, 1, 2...) 위치로만 이전/새 항목을 매칭합니다. 여기서 앞에 항목을 삽입하면 어떤 일이 벌어지는지 구체적으로 봅니다.

---

## 본문

**key 없는 경우 — 앞에 Connecticut 삽입**

```
이전:  [Duke, Villanova]
새:    [Connecticut, Duke, Villanova]
```

React는 인덱스 기준으로 매칭합니다:

```
인덱스 0: Duke       → Connecticut  (텍스트만 바꿈)
인덱스 1: Villanova  → Duke         (텍스트만 바꿈)
인덱스 2: (없음)     → Villanova    (새로 추가)
```

결과적으로 **기존 2개 DOM 노드를 전부 수정하고 새 노드 1개를 추가**합니다. Connecticut 하나를 넣으려고 3번의 DOM 조작이 발생했고, 기존 항목들의 state(예: 체크박스 선택 상태)가 섞일 수 있습니다.

**key 있는 경우**

```jsx
<li key="duke">Duke</li>
<li key="villanova">Villanova</li>
```

앞에 Connecticut을 추가하면:

```
key="connecticut": 새 항목 → 앞에 삽입
key="duke":        기존 일치 → 그대로 유지
key="villanova":   기존 일치 → 그대로 유지
```

**DOM 조작 1번**(Connecticut 삽입)으로 끝납니다. Duke, Villanova는 손대지 않습니다.

---

## 종합

key는 React에게 "이 항목의 정체"를 알려주는 식별자입니다. key가 없으면 React는 위치(인덱스)만 보고 매칭하므로, 리스트 중간이나 앞에 항목을 삽입·삭제할 때 불필요한 DOM 업데이트가 발생하고 state가 잘못된 항목에 붙을 수 있습니다. 그래서 key는 **리스트 내 항목의 안정적인 고유 식별자** — 보통 서버에서 오는 id — 를 써야 합니다. `Math.random()`이나 배열 인덱스를 key로 쓰면 오히려 매 렌더마다 다른 정체를 부여해 성능과 정확성 모두 나빠집니다.
