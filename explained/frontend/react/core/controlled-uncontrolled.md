# 어떤 컴포넌트를 controlled 또는 uncontrolled라고 부를 때, 무엇을 보고 가르는가?

## 도입

controlled/uncontrolled라는 말은 `<input>`의 `value`·`onChange` 이야기로 처음 만나는 경우가 많아, 폼 입력에만 쓰는 용어처럼 느껴지기 쉽다. 하지만 이 구분은 폼과 무관하게 모든 컴포넌트에 적용되는 설계 어휘다. 아코디언 예제를 그대로 쓰면 두 상태를 한눈에 대비할 수 있다 — `isActive`를 자기 state로 들고 있던 `Panel`과, `isActive`를 부모 `Accordion`에게서 prop으로 받는 `Panel`이다.

---

## 본문

> It is common to call a component with some local state "uncontrolled".
> For example, the original `Panel` component with an `isActive` state variable is uncontrolled because its parent cannot influence whether the panel is active or not.

"local state를 가진 컴포넌트를 'uncontrolled'라고 부르는 것이 일반적이다. 예를 들어 `isActive` state 변수를 가진 원래의 `Panel` 컴포넌트는 uncontrolled인데, 부모가 그 패널이 활성인지 아닌지에 영향을 줄 수 없기 때문이다."

- **local state**: 그 컴포넌트 안에서 `useState`로 만들어 그 컴포넌트만 바꿀 수 있는 값.
- **uncontrolled**: "제어되지 않는"의 주어는 부모다. 컴포넌트가 통제 불능이라는 뜻이 아니라, **부모가 관여할 수 없다**는 뜻이다.
- **its parent cannot influence**: 판별의 근거가 여기 있다. 부모가 아무리 props를 바꿔도 패널의 열림 여부를 못 바꾸면, 그 정보는 자식 소유다.

> In contrast, you might say a component is "controlled" when the important information in it is driven by props rather than its own local state.
> This lets the parent component fully specify its behavior.
> The final `Panel` component with the `isActive` prop is controlled by the `Accordion` component.

"반대로, 컴포넌트 안의 중요한 정보가 자기 local state가 아니라 props로 결정될 때 그 컴포넌트를 'controlled'라고 말할 수 있다. 이렇게 하면 부모 컴포넌트가 그 동작을 완전히 지정할 수 있다. `isActive` prop을 가진 최종 `Panel` 컴포넌트는 `Accordion` 컴포넌트에 의해 controlled다."

- **the important information in it**: 판별 기준이 "state가 있느냐 없느냐"가 아니라 **어떤 정보가 중요한가**를 먼저 고르고, 그 정보의 출처를 보는 것임을 알려주는 표현이다. 스크롤 위치 같은 부수적 값이 state로 남아 있어도 controlled라 부를 수 있다.
- **driven by**: 그 값이 어디서 흘러나오는가. local state에서 나오면 uncontrolled, props에서 나오면 controlled다.
- **rather than its own local state**: 둘은 같은 정보에 대해 동시에 성립할 수 없다. 한 정보의 주인은 하나이므로, 부모가 주면 자식은 안 갖는다.
- **fully specify its behavior**: 부모가 값을 쥐고 있으니, 언제 열리고 언제 닫히는지에 대한 규칙을 부모 코드에서 전부 정할 수 있다.

```jsx
// uncontrolled — 중요한 정보(isActive)가 자기 state에서 나온다
function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return isActive ? children : <button onClick={() => setIsActive(true)}>Show</button>;
}
// 사용: <Panel title="About">...</Panel>   ← 부모는 열림 여부에 관여할 수 없다

// controlled — 중요한 정보가 props에서 나온다
function Panel({ title, children, isActive, onShow }) {
  return isActive ? children : <button onClick={onShow}>Show</button>;
}
// 사용: <Panel title="About" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>...</Panel>
```

```
같은 질문에 누가 답하는가 — "이 패널은 열려 있나?"

uncontrolled            controlled
Accordion               Accordion [activeIndex]
   │ (관여 불가)            │ isActive
   ▼                        ▼
 Panel [isActive]        Panel  ← 자기 state 없음, 받은 값 그대로 표시
```

---

## 종합

가르는 기준은 하나다 — 그 컴포넌트에서 중요한 정보가 자기 local state에서 나오는가(uncontrolled), 부모가 준 props에서 나오는가(controlled). "state를 쓰면 uncontrolled"로 외우면 어긋난다. 중요한 정보를 props로 받으면서 내부적으로 다른 state를 갖는 컴포넌트가 흔하기 때문이다.

같은 `Panel`이 개조 전후로 이름표가 바뀌었다는 점이 이 구분의 성격을 보여준다. state를 부모로 끌어올리는 작업은 그 자체로 자식을 uncontrolled에서 controlled로 바꾸는 일이다. 즉 controlled/uncontrolled는 컴포넌트에 새로 붙는 별개의 기능이 아니라, 정보의 주인이 어디인지를 부르는 다른 이름이다.

---

# 둘 중 어느 쪽으로 설계하느냐에 따라 무엇을 맞바꾸게 되는가?

## 도입

두 방식 중 한쪽이 더 낫다고 말할 수 없다. 쓰기 편한 쪽과 마음대로 주무를 수 있는 쪽이 정반대이기 때문이다. 공용 컴포넌트를 만들 때 실제로 부딪히는 선택이다.

---

## 본문

> Uncontrolled components are easier to use within their parents because they require less configuration.
> But they're less flexible when you want to coordinate them together.

"uncontrolled 컴포넌트는 설정이 덜 필요해서 부모 안에서 쓰기가 더 쉽다. 하지만 여러 개를 맞물려 움직이게 하고 싶을 때는 덜 유연하다."

- **require less configuration**: 넘겨야 할 props가 적다. `<Panel title="About">` 한 줄이면 끝이고, 열고 닫는 state와 핸들러는 자기가 알아서 갖는다.
- **coordinate them together**: 여러 개를 맞물려 움직이게 하는 것. "한 번에 하나만 열림" 같은 규칙이 여기 해당한다. 각자 자기 값을 들고 있으니 밖에서 손댈 자리가 없다.
- **less flexible**: 못 하는 게 아니라 밖에서 개입할 통로가 없다는 뜻이다. 개입이 필요해지는 순간 controlled로 바꿔야 한다.

> Controlled components are maximally flexible, but they require the parent components to fully configure them with props.

"controlled 컴포넌트는 최대한으로 유연하지만, 부모 컴포넌트가 props로 전부 설정해줘야 한다."

- **maximally flexible**: 값도 변경 시점도 전부 부모 손에 있으니, 부모가 상상하는 어떤 규칙이든 구현할 수 있다.
- **fully configure them with props**: 유연함의 대가. 값 prop과 변경 핸들러 prop이 한 쌍씩 필요하고, 쓰는 쪽마다 state를 직접 만들어 배선해야 한다. 열 군데서 쓰면 같은 배선을 열 번 한다.

```
uncontrolled                      controlled
쓰기 쉬움 (props 적음)     ←→     유연함 (부모가 전부 지정)
<Panel title="About" />           <Panel isActive={...} onShow={...} />
여러 개 맞물리기 어려움            쓰는 쪽마다 state·배선 필요
```

---

## 종합

맞바꾸는 축은 편의성과 유연성이다. uncontrolled는 넘길 props가 적어 쓰는 쪽 코드가 짧지만 밖에서 개입할 통로가 없고, controlled는 무엇이든 밖에서 정할 수 있지만 쓰는 쪽이 state와 핸들러를 매번 준비해야 한다. 공용 컴포넌트를 만든다면 판단 기준은 "이 컴포넌트 여러 개를 서로 맞물리게 할 일이 있는가"다 — 있으면 controlled, 각자 독립적으로 동작하면 되면 uncontrolled 쪽이 쓰는 사람에게 편하다.

실무에서 자주 쓰는 절충은 둘 다 지원하는 것이다. 값 prop이 넘어오면 그걸 쓰고, 안 넘어오면 내부 state로 동작하게 만들어 쉬운 사용과 개입 가능성을 모두 열어둔다. 대신 두 경로를 다 관리해야 하므로 컴포넌트 내부는 그만큼 복잡해진다.
