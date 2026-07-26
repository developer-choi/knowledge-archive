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
- **key prop**: 자식 엘리먼트의 안정적 식별자를 React에 알려주는 prop.

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
