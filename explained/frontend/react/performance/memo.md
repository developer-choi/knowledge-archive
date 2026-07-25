# `memo`를 붙이면 props가 그대로일 때 리렌더가 일어나지 않는다고 믿어도 되는가?

## 본문

> This memoized version of your component will usually not be re-rendered when its parent component is re-rendered as long as its props have not changed.

"이 memoized 버전의 컴포넌트는 props가 바뀌지 않은 한 부모가 리렌더될 때 보통 다시 그려지지 않는다."

- **usually**: "항상"이 아니라 "대개". 이 단어 하나가 이 문서 전체의 태도를 결정한다. React는 대체로 건너뛰지만, 건너뛴다고 약속하지는 않는다.
- **as long as**: 조건. props가 그대로일 때에 한해서다. props가 바뀌면 `memo`는 아무것도 막지 않는다.

> But React may still re-render it: memoization is a performance optimization, not a guarantee.

"하지만 React는 그것을 여전히 다시 그릴 수 있다. memoization은 성능 최적화이지 보장이 아니다."

- **may**: 가능성. React가 내부 사정으로 다시 그리기로 결정할 여지를 남겨둔 표현이다.
- **guarantee**: 계약·약속. 이 단어를 부정한다는 것은 "리렌더가 안 일어난다"에 기대어 코드를 짜면 안 된다는 뜻이다.
- **optimization**: 있으면 빨라지고 없어도 결과는 같아야 하는 것. 결과 자체를 바꾸는 장치가 아니다.

이 "보장이 아니다"라는 태도가 실제로 어떻게 드러나는지 그림으로 보면 이렇다.

```
부모 리렌더
    │
    ├─ props 바뀜 ────────────────→ 자식 렌더 (memo 무의미)
    │
    └─ props 그대로
           ├─ 대개 ──────────────→ 자식 렌더 건너뜀   ← 기대하는 경로
           └─ 가끔 (React 재량) ─→ 자식 렌더          ← 이 경로가 있어서 "보장"이 아님
```

---

## 종합

`memo`는 "props가 같으면 자식 렌더를 건너뛴다"는 힌트를 React에 주는 장치이지, 건너뛴다는 계약이 아니다. 원문이 `will not`이 아니라 `will usually not`을 쓰고, 곧바로 `not a guarantee`로 못 박은 이유가 여기 있다. 그래서 판단 기준은 하나로 정리된다. `memo`를 떼도 화면과 동작이 똑같아야 하고, 다만 느려질 뿐이어야 한다.

이 기준을 뒤집어 쓰면 진단 도구가 된다. `memo`를 뗐을 때 무한 루프가 돌거나 값이 어긋난다면 그건 `memo`가 필요하다는 증거가 아니라, 렌더가 순수하지 않다는 증거다. 그 상태로 `memo`를 유지하면 React 버전이 올라가거나 다른 최적화가 켜져서 렌더 횟수가 달라지는 순간 버그가 되살아난다. 먼저 렌더를 순수하게 만들고, 그다음에 속도 문제로서 `memo`를 얹는 순서를 지켜야 한다.

---

# `memo`로 감쌌는데도 컴포넌트가 다시 그려진다면, 무엇이 그 리렌더를 일으킨 것인가?

> Even with `memo`, your component will re-render if its own state changes or if a context that it's using changes.

"`memo`를 써도, 컴포넌트는 자기 자신의 state가 바뀌거나 자기가 쓰고 있는 context가 바뀌면 다시 그려진다."

- **own**: 자기 자신의. 부모에게서 받은 것이 아니라 컴포넌트가 스스로 들고 있는 state를 가리킨다.
- **using**: 단순히 존재하는 context가 아니라, 그 컴포넌트가 실제로 읽고 있는 context다.

> Even when a component is memoized, it will still re-render when its own state changes. Memoization only has to do with props that are passed to the component from its parent.

"컴포넌트가 memoized되어 있어도 자기 state가 바뀌면 여전히 다시 그려진다. memoization은 부모로부터 전달되는 props에만 관계한다."

- **only has to do with**: "~에만 관계한다". `memo`의 관할 범위를 한 줄로 못 박는 표현이다.

이건 당연한 동작이다. state가 바뀌었는데 다시 그리지 않으면 화면이 새 값을 못 보여준다. 렌더는 그 시점의 state를 붙잡아 화면을 만드는 일이므로, 새 state를 화면에 반영하려면 그 컴포넌트를 한 번 더 호출하는 것 말고는 방법이 없다. `memo`가 이걸 막는다면 그건 최적화가 아니라 버그다.

> Even when a component is memoized, it will still re-render when a context that it's using changes.

"컴포넌트가 memoized되어 있어도 자기가 쓰는 context가 바뀌면 여전히 다시 그려진다."

context는 부모가 JSX로 내려주는 props와 달리, 트리 위쪽 어딘가의 provider에서 곧장 내려오는 값이다. `memo`는 부모가 넘긴 props만 비교하므로 이 경로는 검사 대상에 들어오지 않는다.

---

# 어떤 컴포넌트에 `memo`를 붙일지 어떻게 판단하는가?

## 도입

`memo`가 왜 React의 기본 동작이 아니라 개발자가 손으로 붙여야 하는지 궁금해지는 지점이다. props가 같으면 건너뛰는 게 늘 이득이라면 React가 알아서 해주면 될 텐데, 그렇게 하지 않는다. 이유는 `memo`가 공짜가 아니기 때문이다. 렌더를 건너뛰려면 먼저 비교를 해야 하고, 그 비교에도 비용이 든다. 그래서 판단 기준은 "이득이 비용보다 큰가"가 된다.

---

## 본문

> Optimizing with `memo` is only valuable when your component re-renders often with the same exact props, and its re-rendering logic is expensive.

"`memo`로 최적화하는 것은 컴포넌트가 정확히 같은 props로 자주 다시 그려지고, 그 리렌더링 로직이 비쌀 때에만 가치가 있다."

- **only valuable when**: 이 조건에서만 가치가 있다. 뒤집으면 조건 밖에서는 가치가 없다는 뜻이다.
- **often**: 자주. 한두 번 건너뛰는 것으로는 체감되지 않는다.
- **same exact props**: 정확히 같은 props. React는 각 prop을 `Object.is`로 대조하므로, 객체나 배열은 안에 든 내용이 같아도 새로 만들어졌으면 다른 것으로 친다.
- **expensive**: 비싸다. 렌더에 시간이 오래 걸린다는 뜻이다.

조건이 `and`로 묶여 있는 것이 핵심이다. 자주 그려지는데 렌더가 싸면 아껴지는 시간이 미미하고, 렌더가 비싸도 props가 매번 달라지면 건너뛸 일이 없다. 둘 다 만족해야 `memo`가 비교 비용을 웃도는 이득을 낸다.

```
                 렌더가 싸다        렌더가 비싸다
같은 props로  ┌──────────────┬──────────────────┐
자주 렌더됨   │ 이득 미미     │ memo가 유효      │
              ├──────────────┼──────────────────┤
props가 매번  │ 손해(비교만)  │ 손해(비교만)     │
바뀜          │              │                  │
              └──────────────┴──────────────────┘
```

> If there is no perceptible lag when your component re-renders, `memo` is unnecessary.

"컴포넌트가 다시 그려질 때 감지할 만한 지연이 없다면 `memo`는 불필요하다."

- **perceptible**: 사람이 느낄 수 있는. 측정 도구로만 잡히는 미세한 차이는 여기서 제외한다.
- **lag**: 조작에 화면이 늦게 따라오는 것.

기준을 밀리초 숫자가 아니라 사람의 체감으로 잡은 점이 중요하다. `memo`는 사용자 경험을 위한 도구이지 숫자를 낮추기 위한 도구가 아니다.

> If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary.

"앱이 이 사이트 같고 대부분의 상호작용이 굵직하다면(페이지나 섹션 전체를 교체하는 식), memoization은 대개 불필요하다."

- **coarse**: 굵직한. 한 번의 조작이 화면의 큰 덩어리를 바꾸는 경우다. 어차피 대부분이 다시 그려져야 하므로 건너뛸 것이 별로 없다.

> On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.

"반면 앱이 그림 편집기에 가깝고 대부분의 상호작용이 잘게 쪼개져 있다면(도형을 움직이는 식), memoization이 매우 유용할 수 있다."

- **granular**: 잘게 나뉜. 한 번의 조작이 화면의 아주 작은 일부만 바꾸는 경우다. 도형 하나를 끌 때 나머지 수백 개는 그대로이므로 건너뛸 대상이 많다.
- **on the other hand**: 앞과 정반대 상황임을 알리는 표시다.

굵직한 조작과 잘게 쪼갠 조작을 가르는 기준은 "한 번의 변화가 화면의 몇 퍼센트를 바꾸는가"다. 페이지 이동은 100%에 가깝고 도형 끌기는 1%에 가깝다. 건너뛸 수 있는 몫이 후자에서 압도적으로 크다.

> If a specific interaction still feels laggy, use the React Developer Tools profiler to see which components would benefit the most from memoization, and add memoization where needed.

"특정 상호작용이 여전히 느리게 느껴진다면, React Developer Tools profiler로 어떤 컴포넌트가 memoization의 이득을 가장 크게 볼지 확인하고, 필요한 곳에 memoization을 추가하라."

- **profiler**: 각 컴포넌트가 렌더에 얼마나 걸렸는지 기록해 보여주는 도구. React Developer Tools 브라우저 확장에 들어 있다.
- **benefit the most**: 이득이 가장 큰 곳. 전부가 아니라 상위 몇 개를 고르라는 뜻이다.
- **where needed**: 필요한 곳에. 필요를 확인한 뒤 붙이는 순서다.

순서가 명확하다. 느낌으로 시작해서(느린가), 도구로 좁히고(어디가 느린가), 그 자리에만 붙인다.

---

## 종합

`memo`가 React의 기본 동작이 아닌 첫째 이유가 이 질문에서 드러난다. 렌더를 건너뛰려면 props를 하나씩 대조해야 하는데, 렌더 자체가 싼 컴포넌트라면 그 비교가 아껴주는 시간보다 비교에 드는 시간이 더 클 수 있다. 모든 컴포넌트에 자동으로 적용하면 대다수 컴포넌트에서 순손해가 난다.

그래서 원문의 조건은 "자주 + 같은 props + 비싼 렌더" 셋이 겹치는 자리를 가리킨다. 셋 중 하나만 빠져도 `memo`는 비교 비용만 남기는 장식이 된다.

판단 방법도 실용적으로 정리된다. 먼저 앱의 성격으로 대략을 가늠하고(조작이 화면을 통째로 바꾸는 종류인가, 아주 작은 일부만 바꾸는 종류인가), 실제로 버벅이는 조작이 있으면 profiler로 범인을 특정한 다음, 그 자리에만 붙인다. 짐작으로 뿌리는 것이 아니라 측정으로 좁히는 순서다.

---

# 개별 판단이 번거로우니 가능한 한 다 `memo`로 감싸는 방식은 어떤 대가를 치르는가?

## 도입

앞 질문의 판단을 컴포넌트마다 하는 것은 귀찮은 일이다. 그래서 아예 다 감싸버리는 선택도 존재한다. 원문은 이 방식을 금지하지 않지만, 무엇을 내주게 되는지는 분명히 적어둔다. 대가는 성능이 아니라 다른 곳에서 치러진다.

---

## 본문

> There is no significant harm to doing that either, so some teams choose to not think about individual cases, and memoize as much as possible.

"그렇게 해도 큰 해가 있는 것은 아니어서, 어떤 팀들은 개별 사례를 고민하지 않고 가능한 한 많이 memoize하기를 택한다."

- **no significant harm**: 심각한 해는 없다. "이득이 있다"가 아니라 "크게 나쁘진 않다"는 절제된 표현이다. 앞 질문에서 본 비교 비용은 대개 작아서, 잘못 붙인 `memo` 하나가 앱을 눈에 띄게 느리게 만들지는 않는다.
- **individual cases**: 컴포넌트 하나하나의 사정. 이걸 고민하지 않겠다는 것이 이 방식의 동기다.
- **some teams**: 일부 팀. 널리 권장되는 방식이 아니라 하나의 선택지로 소개하는 어조다.

> The downside of this approach is that code becomes less readable.

"이 접근의 단점은 코드가 덜 읽히게 된다는 것이다."

- **downside**: 대가로 치르는 것.
- **less readable**: 덜 읽힌다. 모든 컴포넌트가 `memo(...)`로 한 겹 감싸여 있으면 그 표시가 신호로서의 힘을 잃는다. 어떤 컴포넌트가 정말 성능상 이유로 감싸진 것인지, 그냥 관행으로 감싸진 것인지 구별되지 않는다.

```js
// 다 감싼 코드베이스에서는 이 memo가 무엇을 말하는지 알 수 없다
const Badge = memo(function Badge({ label }) {
  return <span>{label}</span>;
});
```

`Badge`는 span 하나를 그린다. 여기 붙은 `memo`는 "이 컴포넌트는 렌더가 비싸다"는 정보를 주지 않는다. 반대로 꼭 필요한 곳에만 붙어 있는 코드베이스에서는 `memo`를 보는 순간 "여기는 신경 써야 하는 자리구나"를 알 수 있다.

> Also, not all memoization is effective: a single value that's "always new" is enough to break memoization for an entire component.

"또한 모든 memoization이 효과적인 것은 아니다. "항상 새로운" 값 하나면 컴포넌트 전체의 memoization을 깨뜨리기에 충분하다."

- **not all ... is effective**: 붙였다고 다 듣는 게 아니다.
- **a single value**: 값 하나. props가 열 개여도 그중 하나면 충분하다는 뜻이다.
- **always new**: 렌더마다 새로 만들어지는 값. 컴포넌트 본문 안에서 그때그때 만든 객체·배열·함수가 여기 해당한다.
- **break**: 무력화한다. 부분적으로 약해지는 게 아니라 그 컴포넌트에 한해 완전히 무효가 된다.

```
props: { id, name, style }
         ↑    ↑     ↑
       같음  같음  매번 새 객체
                     └─→ 비교 실패 → 렌더 실행
                         (앞의 두 개가 같았다는 사실은 아무 소용 없음)
```

이 성질 때문에 "다 감싸기"는 겉보기와 실제가 어긋나기 쉽다. 아무 생각 없이 감싼 컴포넌트일수록 그 props도 아무 생각 없이 넘겨졌을 가능성이 높고, 그러면 `memo`는 붙어 있지만 한 번도 렌더를 막지 못한다.

---

## 종합

`memo`가 기본 동작이 아닌 나머지 두 이유가 여기서 나온다. 하나는 값이 매번 새로 만들어지면 비교가 헛돌아 이득은 0인데 비용만 남는다는 것이고, 다른 하나는 `memo`를 깔아둘수록 코드가 덜 읽히게 된다는 것이다. 앞 질문의 "비교 자체가 렌더보다 비쌀 수 있다"까지 합치면, 언어나 프레임워크가 일괄로 켜주기 어려운 이유가 셋 다 갖춰진다.

그렇다고 다 감싸는 방식이 잘못이라는 말은 아니다. 원문은 심각한 해가 없다고 명시하고, 실제로 어떤 팀은 판단 비용을 줄이려고 그렇게 한다. 다만 그때 무엇을 내주는지는 알고 해야 한다. 코드에서 `memo`가 갖던 "여기가 성능 지점이다"라는 신호가 사라지고, 붙였다는 사실만으로는 실제로 듣는지 알 수 없게 된다.

특히 두 번째 대가가 조용해서 위험하다. `memo`가 무력화된 컴포넌트는 화면이 멀쩡하고 에러도 없어서 최적화가 되어 있다고 착각하기 쉽다. 어느 쪽 방식을 택하든, 실제로 렌더가 줄었는지는 profiler로 확인해야 알 수 있다.
