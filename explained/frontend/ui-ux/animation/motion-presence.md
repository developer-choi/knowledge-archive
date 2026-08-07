# Motion의 `AnimatePresence`란 무엇이며, 자식 컴포넌트의 퇴장을 감지하는 세 가지 경우는?

## 도입

React는 컴포넌트가 언마운트되면 DOM을 즉시 제거한다. `exit` 애니메이션을 실행할 여유가 없다. `AnimatePresence`는 이 동작을 가로채 exit 애니메이션이 끝날 때까지 DOM을 유지한다.

---
## 본문

> `AnimatePresence` makes exit animations easy. By wrapping one or more motion components with `AnimatePresence`, we gain access to the `exit` animation prop.

"`AnimatePresence`는 exit 애니메이션을 쉽게 만든다. `AnimatePresence`로 하나 이상의 motion 컴포넌트를 감싸면 `exit` 애니메이션 prop을 사용할 수 있다."

> `AnimatePresence` works by detecting when its direct children are removed from the React tree.

"`AnimatePresence`는 직접 자식이 React 트리에서 제거되는 것을 감지하는 방식으로 동작한다."

세 가지 감지 패턴:

**1. 조건부 렌더링 (show && \<Component />)**
```jsx
<AnimatePresence>
  {show && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

**2. key 변경 (슬라이더/탭 전환)**
```jsx
<AnimatePresence>
  <Slide key={activeItem.id} />
</AnimatePresence>
```

**3. 리스트 아이템 추가/제거**
```jsx
<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id} exit={{ opacity: 0 }} layout />
  ))}
</AnimatePresence>
```

- **direct children**: 직접 자식만 감지한다. 손자 컴포넌트의 마운트/언마운트는 추적하지 않는다.
- **unique key prop**: 각 직접 자식에 유일한 key가 있어야 `AnimatePresence`가 어떤 자식이 추가/제거됐는지 식별할 수 있다.

---
## 종합

React는 언마운트 = DOM 즉시 제거다. AnimatePresence는 "아직 제거하지 말고 exit 애니메이션 먼저 실행해"를 React에게 요청하는 프록시 역할이다. 세 감지 패턴 모두 "직접 자식이 React 트리에서 사라지는" 공통점이 있으며, key 변경은 React가 기존 컴포넌트를 파괴하고 새 컴포넌트를 생성하는 메커니즘을 이용한다.

---
# motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?

## 도입

`exit` prop을 설정했는데 애니메이션이 작동하지 않는 가장 흔한 실수가 있다. `AnimatePresence`의 위치와 대상 컴포넌트의 관계 설정이 핵심이다.

---
## 본문

> Owing to React limitations, the component being removed **must** be a **direct child** of `AnimatePresence` to enable this animation.

"React 한계로 인해, 제거되는 컴포넌트는 이 애니메이션을 활성화하기 위해 반드시 `AnimatePresence`의 직접 자식이어야 한다."

> Also make sure `AnimatePresence` is outside of the code that unmounts the element. If `AnimatePresence` itself unmounts, then it can't control exit animations!

"`AnimatePresence`가 요소를 언마운트하는 코드 바깥에 있는지 확인하라. `AnimatePresence` 자체가 언마운트되면 exit 애니메이션을 제어할 수 없다!"

```jsx
// 틀린 방법: AnimatePresence 자체가 조건부로 마운트됨
{isVisible && (
  <AnimatePresence>
    <Component />
  </AnimatePresence>
)}

// 올바른 방법: AnimatePresence는 항상 마운트된 상태
<AnimatePresence>
  {isVisible && <Component />}
</AnimatePresence>
```

- **direct child**: `AnimatePresence` → 중간 래퍼 → `motion.div` 구조는 동작하지 않는다. `AnimatePresence`의 바로 아래 자식이어야 한다.

---
## 종합

exit 애니메이션이 안 된다면 두 가지를 먼저 확인한다. 첫째, `AnimatePresence`가 조건부 렌더링 코드 바깥을 감싸고 있는가. 둘째, 애니메이션 대상 컴포넌트가 `AnimatePresence`의 직접 자식인가. 이 두 조건이 충족돼야 `exit` prop이 동작한다.

---
# AnimatePresence에서 단일 자식의 key만 바꾸면 슬라이드쇼/탭 전환 애니메이션을 만들 수 있다. 어떻게 동작하는가?

## 도입

React에서 key가 바뀌면 해당 컴포넌트는 업데이트가 아니라 파괴 후 재생성된다. 이 동작과 AnimatePresence를 결합하면 진입/퇴장 애니메이션이 자동으로 만들어진다.

---
## 본문

> Changing a key prop makes React create an entirely new component. So by changing the key of a single child of `AnimatePresence`, we can easily make components like slideshows.

"key prop을 변경하면 React가 완전히 새로운 컴포넌트를 생성한다. 따라서 `AnimatePresence`의 단일 자식의 key를 바꾸면 슬라이드쇼 같은 컴포넌트를 쉽게 만들 수 있다."

```jsx
export const Slideshow = ({ image }) => (
  <AnimatePresence>
    <motion.img
      key={image.src}
      src={image.src}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
    />
  </AnimatePresence>
)
```

동작 원리:
1. `image.src`가 바뀌면 key가 바뀜
2. React: 기존 `<motion.img>` 파괴 + 새 `<motion.img>` 생성
3. AnimatePresence: 기존 이미지에 `exit`(왼쪽으로 퇴장) 적용하면서 DOM 유지
4. 새 이미지: `initial`(오른쪽에서 진입) → `animate`(제자리) 전환

---
## 종합

이 패턴의 핵심은 "key 변경 = 별개의 컴포넌트 인스턴스"라는 React 원칙이다. 이미지 슬라이더뿐 아니라 탭 전환, 스텝 폼 같은 "한 번에 하나만 보여주는" UI에서 key만 바꾸면 진입/퇴장 애니메이션이 자동으로 동작한다. 별도의 "전환 로직"을 구현하지 않아도 된다.

---
# AnimatePresence의 `mode` prop은 진입/퇴장 순서를 어떻게 제어하며, `"sync"`, `"wait"`, `"popLayout"` 각각 언제 쓰는가?

## 도입

여러 컴포넌트가 동시에 진입/퇴장할 때, 그 순서를 어떻게 조율할지가 중요하다. `AnimatePresence`의 `mode` prop이 이 순서를 제어한다.

---
## 본문

> `mode` decides how `AnimatePresence` handles entering and exiting children. Default: `"sync"`.

"`mode`는 `AnimatePresence`가 진입/퇴장하는 자식을 어떻게 처리할지 결정한다. 기본값: `"sync"`."

**sync** (기본값):
> In `"sync"` mode, elements animate in and out as soon as they're added/removed.

진입과 퇴장이 동시에 시작된다. 두 요소가 동시에 화면에 있을 수 있으므로 위치 충돌은 개발자가 `position: absolute` 등으로 직접 해결해야 한다.

**wait**:
> In `"wait"` mode, the entering element will wait until the exiting child has animated out, before it animates in. `wait` mode only supports one child at a time.

퇴장이 완전히 끝난 후 진입이 시작된다. 탭 전환, 스텝 폼 등 "한 번에 하나만 보여주는" UI에 적합하다. exit에 `easeIn`, enter에 `easeOut`을 쓰면 전체가 `easeInOut` 효과처럼 느껴진다.

**popLayout**:
> Exiting elements will be "popped" out of the page layout, allowing surrounding elements to immediately reflow. Pairs especially well with the `layout` prop, so elements can animate to their new layout.

```jsx
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.li layout exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

퇴장 요소가 레이아웃에서 즉시 빠져나와 나머지 요소가 바로 리플로우된다. 리스트에서 아이템 삭제 시 빈 자리가 즉시 채워지면서 퇴장 애니메이션도 동시 진행된다. `layout` prop과 함께 쓰면 리플로우 자체도 애니메이션된다.

---
## 종합

```
sync      → 진입/퇴장 동시, 겹칠 수 있음 (기본 동작, 위치 충돌 주의)
wait      → 퇴장 완료 후 진입, 순차적 (탭/스텝 전환에 적합)
popLayout → 퇴장 요소 즉시 레이아웃에서 제거, 나머지 리플로우 (리스트 삭제에 적합)
```

세 모드 중 어느 것을 쓸지는 "두 상태가 동시에 화면에 있어도 되는가"로 결정한다. 되면 `sync`, 안 되면 `wait`, 리스트 이동 효과도 필요하면 `popLayout`이다.

---
# Radix UI 컴포넌트에 Motion의 exit 애니메이션을 적용하려면 어떤 설정이 필요한가?

## 도입

Radix UI는 자체적으로 DOM과 상태를 관리한다. Motion의 exit 애니메이션이 동작하려면 이 제어권을 개발자 측으로 가져와야 한다.

---
## 본문

> Most Radix components render and control their own DOM elements. But they also provide the `asChild` prop that, when set to true, will make the component use the first provided child as its DOM node instead.

"대부분의 Radix 컴포넌트는 자체 DOM 요소를 렌더링하고 제어한다. 하지만 `asChild` prop을 true로 설정하면 제공된 첫 번째 자식을 DOM 노드로 대신 사용한다."

```jsx
<Toast.Root asChild>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    layout
  />
</Toast.Root>
```

- **asChild**: Radix가 자체 DOM 대신 motion 컴포넌트를 사용하게 한다. Radix의 접근성 속성과 Motion의 애니메이션을 함께 적용할 수 있다.

exit 애니메이션(예: Tooltip)의 3단계 설정:

```jsx
const [isOpen, setOpen] = useState(false)

return (
  <Tooltip.Provider>
    <Tooltip.Root open={isOpen} onOpenChange={setOpen}>
      <AnimatePresence>
        {isOpen && (
          <Tooltip.Portal forceMount>
            <Tooltip.Content asChild>
              <motion.div exit={{ opacity: 0 }} />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </AnimatePresence>
    </Tooltip.Root>
  </Tooltip.Provider>
)
```

1. **`asChild`로 motion 컴포넌트 주입**: Radix가 자체 DOM 대신 motion 컴포넌트를 사용
2. **상태 끌어올리기** (`open`/`onOpenChange`): Radix 내부 상태를 외부로 노출해 조건부 렌더링 가능
3. **`forceMount`**: Radix Portal이 자체적으로 자식을 언마운트하는 것을 막아 AnimatePresence가 exit 타이밍 제어

---
## 종합

Radix + Motion 통합의 핵심 충돌은 "누가 언마운트 타이밍을 제어하는가"다. 기본적으로 Radix가 제어하는데, AnimatePresence가 exit 애니메이션을 위해 언마운트를 지연시키려면 이 제어권을 가져와야 한다. `open`/`onOpenChange`로 상태를 끌어올리고, `forceMount`로 Radix의 자체 언마운트를 막고, `{isOpen && ...}`으로 AnimatePresence가 타이밍을 제어하는 구조가 이 충돌의 해법이다.
