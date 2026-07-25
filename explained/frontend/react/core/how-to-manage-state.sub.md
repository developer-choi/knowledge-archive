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

### 항목 하나를 지울 때 손대는 자리

flat으로 바꾸면 삭제 같은 조작이 몇 군데를 건드리는지가 눈에 띄게 줄어든다.

> In order to remove a place now, you only need to update two levels of state:
> the updated version of its parent place should exclude the removed ID from its childIds array, and
> the updated version of the root "table" object should include the updated version of the parent place.

"이제 장소 하나를 지우려면 state의 두 계층만 갱신하면 된다. 부모 장소의 갱신본이 childIds 배열에서 지워진 ID를 빼야 하고, root '테이블' 객체의 갱신본이 그 갱신된 부모 장소를 담아야 한다."

- **two levels of state**: 트리 구조였다면 지워지는 노드에서 root까지 전 계층을 복사해야 했지만, flat이면 부모 항목과 테이블 두 자리로 끝난다.
- **exclude the removed ID from its childIds array**: 실제로 지우는 것은 객체가 아니라 **참조**다. 부모의 자식 목록에서 ID만 빼면 그 노드는 트리에서 사라진다.
- **the root "table" object**: `placeById`처럼 ID→객체를 담아둔 lookup 테이블. state 자체는 이 테이블이므로, 부모 항목을 갈아 끼운 새 테이블을 만들어 넣는다.

```js
// 부모 'a'에서 자식 'a1'을 지우기 — 손대는 곳은 두 군데뿐
setPlaceById({
  ...placeById,                                    // ← root 테이블
  a: { ...placeById.a,                             // ← 부모 항목
       childIds: placeById.a.childIds.filter(id => id !== 'a1') },
});
```

테이블에 남은 `a1` 항목 자체는 지우지 않아도 화면에서 사라진다. 아무도 그 ID를 가리키지 않기 때문이다. 원한다면 따로 걷어내면 되고, 그건 별개의 정리 작업이다.

### 얼마나 중첩해도 되는가

> You can nest state as much as you like, but making it "flat" can solve numerous problems.
> It makes state easier to update, and it helps ensure you don't have duplication in different parts of a nested object.

"state를 원하는 만큼 중첩해도 되지만, 'flat'하게 만들면 수많은 문제를 해결할 수 있다. state를 업데이트하기 쉬워지고, 중첩된 객체의 서로 다른 부분에 중복이 생기지 않도록 하는 데 도움이 된다."

- **as much as you like**: 중첩 자체를 금지하는 규칙이 아니라는 단서. 얕은 중첩은 그대로 둬도 문제가 없고, 업데이트가 불편해지는 지점에서 정규화를 꺼내면 된다.
- **duplication in different parts**: 트리에 같은 항목이 여러 자리에 복사돼 들어가는 상황. 한쪽만 고치면 두 사본이 어긋난다. flat이면 실체가 테이블에 하나뿐이고 나머지는 ID 참조라 이 문제가 생길 수 없다.

앞의 「불필요한 state가 뭐가 있을까요?」와 같은 이야기가 여기서도 반복된다. 거기서는 변수 사이의 중복을 지웠고, 여기서는 한 객체 안에서 같은 실체가 여러 자리에 복사되는 중복을 지운다. 정답이 놓인 자리를 하나로 만든다는 목적이 같다.

---

## 종합

중첩 state 업데이트는 트리 깊이에 비례해 복사 비용이 선형으로 늘어난다. flat 구조로 정규화하면 어떤 노드를 업데이트해도 그 노드 하나만 교체하면 된다 — 부모 체인 복사가 필요 없다. 이는 DB의 외래키 참조와 정확히 같은 원리이며, React의 불변 업데이트와 결합하면 특히 효과가 크다.
