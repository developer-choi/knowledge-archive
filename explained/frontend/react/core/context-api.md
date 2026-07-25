# 어떤 컴포넌트가 context를 읽을 때, 위쪽에 그 context를 제공하는 컴포넌트가 여럿이면 어느 값을 읽는가?

> The component will use the value of the nearest `<LevelContext>` in the UI tree above it.

"컴포넌트는 UI 트리에서 자기 위쪽에 있는 가장 가까운 `<LevelContext>`의 값을 사용한다."

- **nearest**: 가장 가까운. 거리 기준은 트리에서의 층수이지 코드 파일에서의 위치가 아니다.
- **above it**: 자기 위쪽. 형제나 아래쪽에 있는 제공자는 후보가 아니다. 탐색 방향이 오직 조상 쪽 한 방향이라는 뜻이다.
- **in the UI tree**: UI 트리에서. 실제로 렌더된 결과의 중첩 관계를 말한다. 어느 파일에 적었는지는 무관하다.

```
App
└ Provider (값 A)
  ├ Toolbar
  │ └ Button ─────────── A를 읽음   (위쪽 가장 가까운 제공자 = 값 A)
  └ Provider (값 B)
    └ Panel
      └ Button ───────── B를 읽음   (위쪽 가장 가까운 제공자 = 값 B)
```

같은 `Button` 컴포넌트인데 읽는 값이 다르다. context 값은 앱 전체에 하나로 고정된 것이 아니라 그 컴포넌트가 놓인 위치에 따라 정해진다.

이 규칙은 이미 익숙한 것과 같은 모양이다.

> In CSS, you can specify `color: blue` for a `<div>`, and any DOM node inside of it, no matter how deep, will inherit that color unless some other DOM node in the middle overrides it with `color: green`.

"CSS에서는 `<div>`에 `color: blue`를 지정할 수 있고, 그 안의 어떤 DOM 노드든 아무리 깊어도 그 색을 상속받는다. 중간의 다른 DOM 노드가 `color: green`으로 덮어쓰지 않는 한 말이다."

- **inherit**: 상속받다. 자기가 값을 정하지 않았을 때 위에서 내려온 값을 그대로 쓴다는 뜻이다.
- **overrides**: 덮어쓰다. 중간에 새 값을 지정하면 거기서부터 아래는 새 값이 적용된다.
- **in the middle**: 중간에서. 덮어쓰기가 일어나는 자리가 위와 아래 사이라는 점을 짚는다.

> Similarly, in React, the only way to override some context coming from above is to wrap children into a context provider with a different value.

"비슷하게 React에서도, 위에서 내려오는 context를 덮어쓰는 유일한 방법은 children을 다른 값을 가진 context 제공자로 감싸는 것이다."

- **Similarly**: 비슷하게. 비유가 아니라 규칙의 모양이 같음을 가리킨다.
- **the only way**: 유일한 방법. 이 단어가 이 문장에서 가장 무겁다. 덮어쓰는 경로가 여러 개가 아니라 하나뿐이라는 선언이다.
- **wrap children**: 자식들을 감싸다. 덮어쓰기의 적용 범위가 "감싼 그 안쪽"으로 한정된다는 뜻이기도 하다.

이 성질은 실무에서 곧바로 쓰인다. 화면 일부만 다른 값으로 동작시키고 싶으면 그 부분만 다른 값을 가진 제공자로 감싸면 된다. 공식문서가 드는 예는 한 화면 안에서 다른 계정으로 댓글을 다는 경우다. 화면 전체는 로그인한 계정을 쓰고, 특정 영역만 다른 계정 값을 가진 제공자로 감싸면 그 안의 컴포넌트들만 다른 계정으로 동작한다. 컴포넌트를 고치지 않고 감싸는 것만으로 범위를 나눈다.

서로 다르게 만든 context끼리는 서로를 덮어쓰지 않는다는 점도 함께 알아둔다. `createContext()`로 만든 각 context는 다른 것들과 완전히 분리되어 있고, 그 context를 쓰는 쪽과 제공하는 쪽만 서로 묶는다. 그래서 한 컴포넌트가 여러 종류의 context를 동시에 읽거나 제공해도 서로 간섭하지 않는다. 위에서 말한 "가장 가까운 제공자가 이긴다"는 경쟁은 어디까지나 같은 context 안에서만 벌어지는 일이다.

---

# context의 단점은 무엇인가?

> Context is not limited to static values.
> If you pass a different value on the next render, React will update all the components reading it below!

"context는 고정된 값에만 쓰이는 것이 아니다. 다음 렌더에서 다른 값을 넘기면, React는 아래에서 그 값을 읽는 모든 컴포넌트를 갱신한다."

- **static**: 고정된, 변하지 않는. 이 문장은 부정문이라는 점이 중요하다. "context는 거의 안 바뀌는 값 전용"이라는 통념을 공식문서가 직접 부정하는 자리다.
- **a different value**: 다른 값. 갱신의 방아쇠가 "값이 달라졌는가" 하나임을 가리킨다.
- **all the components reading it**: 그 값을 읽는 모든 컴포넌트. 범위가 "읽는 쪽 전부"이지 "바뀐 부분을 쓰는 쪽"이 아니다.

> React automatically re-renders all the children that use a particular context starting from the provider that receives a different value.

"React는 다른 값을 받은 제공자에서 시작해, 그 context를 사용하는 모든 자식을 자동으로 다시 그린다."

- **automatically**: 자동으로. 읽는 쪽이 구독을 등록하거나 해제할 필요가 없다는 편의인 동시에, 범위를 좁힐 손잡이도 없다는 뜻이다.
- **starting from the provider**: 제공자에서 시작해서. 다시 그리는 범위의 출발점이 값을 바꾼 제공자라는 뜻이다.
- **all the children that use**: 사용하는 모든 자식. context에는 "이 필드만 구독" 같은 장치가 없다.

> The previous and the next values are compared with the `Object.is` comparison.

"이전 값과 다음 값은 `Object.is` 비교로 비교된다."

- **compared**: 비교된다. 비교의 단위가 값 **전체**라는 점이 이 문장의 핵심이다. 안에 무엇이 들었는지는 보지 않는다.
- **`Object.is`**: 두 값이 같은 값인지 판정하는 함수. 객체에 대해서는 내용이 아니라 같은 객체를 가리키는지(참조가 같은지)를 본다.

이 두 문장을 이으면 실무에서 가장 자주 밟는 함정이 나온다. 객체를 context 값으로 담아두면, 그중 한 필드만 바뀌어도 객체 자체가 이전과 다른 값이 된다. 그러면 그 context를 읽는 컴포넌트는 자기가 쓰지도 않는 필드 때문에 전부 다시 그려진다.

```jsx
// { user, theme } 를 하나의 context 값으로 담아둔 상태
// theme만 바뀌었는데도 …

function Profile() {
  const { user } = useAppContext();  // ← user만 쓰는데 함께 다시 그려진다
  return <span>{user.name}</span>;
}
```

여기서 파생되는 주의점이 하나 더 있다. 매 렌더마다 새 객체 리터럴을 값으로 넘기면(`value={{ user, theme }}`) 안에 든 내용이 지난번과 똑같아도 매번 다른 객체이므로 "달라졌다"고 판정된다. 참조를 안정시키지 않으면 아무도 아무것도 바꾸지 않았는데 리렌더가 아래로 번진다.

> Skipping re-renders with `memo` does not prevent the children receiving fresh context values.

"`memo`로 리렌더를 건너뛴다고 해서 자식들이 새 context 값을 받는 것까지 막지는 못한다."

- **Skipping re-renders**: 리렌더를 건너뛰는 것. `memo`가 하는 일 자체다.
- **does not prevent**: 막지 못한다. `memo`가 관여하는 것은 부모가 내려주는 props뿐이므로, context를 통해 들어오는 갱신은 `memo`의 관할 밖이다.
- **fresh**: 새로 갱신된. 값이 실제로 새것으로 도착한다는 뜻이고, 값이 새것이면 그것을 읽는 컴포넌트는 다시 그려져야 화면이 맞는다.

```
Provider (값 바뀜)
   │
   ├ Middle           ← props 그대로면 memo가 막아줌
   │   │
   │   └ Reader       ← context를 읽으므로 memo와 무관하게 다시 그려짐
   │
   └ Plain            ← context를 안 읽으면 영향 없음
```
