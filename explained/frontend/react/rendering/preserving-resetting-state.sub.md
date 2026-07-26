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
