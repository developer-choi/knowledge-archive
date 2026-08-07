---
tags: [react, concept]
source: official
publishable: false
priority:
---
# Questions
- Motion의 `AnimatePresence`란 무엇이며, 자식 컴포넌트의 퇴장을 감지하는 세 가지 경우는?
  - motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?
  - AnimatePresence에서 단일 자식의 key만 바꾸면 슬라이드쇼/탭 전환 애니메이션을 만들 수 있다. 어떻게 동작하는가?
  - AnimatePresence의 `mode` prop은 진입/퇴장 순서를 어떻게 제어하며, `"sync"`, `"wait"`, `"popLayout"` 각각 언제 쓰는가?
- Radix UI 컴포넌트에 Motion의 exit 애니메이션을 적용하려면 어떤 설정이 필요한가?

---

# Answers

## Motion의 `AnimatePresence`란 무엇이며, 자식 컴포넌트의 퇴장을 감지하는 세 가지 경우는?

### Official Answer
`AnimatePresence` makes exit animations easy. By wrapping one or more motion components with `AnimatePresence`, we gain access to the `exit` animation prop.

```jsx
<AnimatePresence>
  {show && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

`AnimatePresence` works by detecting when its direct children are removed from the React tree.

This can be due to a component mounting/remounting:

```jsx
<AnimatePresence>
  {show && <Modal key="modal" />}
</AnimatePresence>
```

Its key changing:

```jsx
<AnimatePresence>
  <Slide key={activeItem.id} />
</AnimatePresence>
```

Or when children in a list are added/removed:

```jsx
<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id} exit={{ opacity: 1 }} layout />
  ))}
</AnimatePresence>
```

Direct children must each have a unique key prop so `AnimatePresence` can track their presence in the tree.

### Reference
- https://motion.dev/docs/react-animate-presence

---

## motion 컴포넌트에서 `exit` 애니메이션이 동작하려면 어떤 조건이 필요한가?

### Official Answer
Owing to React limitations, the component being removed **must** be a **direct child** of `AnimatePresence` to enable this animation.

Also make sure `AnimatePresence` is outside of the code that unmounts the element. If `AnimatePresence` itself unmounts, then it can't control exit animations!

```jsx
// ❌
isVisible && (
  <AnimatePresence>
    <Component />
  </AnimatePresence>
)
// ✅
<AnimatePresence>
  {isVisible && <Component />}
</AnimatePresence>
```

### Reference
- https://motion.dev/docs/react-motion-component
- https://motion.dev/docs/react-animate-presence

---

## AnimatePresence에서 단일 자식의 key만 바꾸면 슬라이드쇼/탭 전환 애니메이션을 만들 수 있다. 어떻게 동작하는가?

### Official Answer
Changing a key prop makes React create an entirely new component. So by changing the key of a single child of `AnimatePresence`, we can easily make components like slideshows.

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

### Reference
- https://motion.dev/docs/react-animate-presence

---

## AnimatePresence의 `mode` prop은 진입/퇴장 순서를 어떻게 제어하며, `"sync"`, `"wait"`, `"popLayout"` 각각 언제 쓰는가?

### Official Answer
`mode` decides how `AnimatePresence` handles entering and exiting children. Default: `"sync"`.

**sync**: In `"sync"` mode, elements animate in and out as soon as they're added/removed.

**wait**: In `"wait"` mode, the entering element will wait until the exiting child has animated out, before it animates in. `wait` mode only supports one child at a time.

**popLayout**: Exiting elements will be "popped" out of the page layout, allowing surrounding elements to immediately reflow. Pairs especially well with the `layout` prop, so elements can animate to their new layout.

```jsx
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.li layout exit={{ opacity: 0 }} />
  ))}
</AnimatePresence>
```

### Reference
- https://motion.dev/docs/react-animate-presence

---

## Radix UI 컴포넌트에 Motion의 exit 애니메이션을 적용하려면 어떤 설정이 필요한가?

### Official Answer
Most Radix components render and control their own DOM elements. But they also provide the `asChild` prop that, when set to true, will make the component use the first provided child as its DOM node instead.

By passing a motion component as this child, we can now use all of its animation props as normal:

```jsx
<Toast.Root asChild>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    layout
  />
</Toast.Root>
```

By default Radix tends to control state like `isOpen` internally. However, it provides some helper props for us to track or control this state externally.

For instance, the Tooltip component provides the `open` and `onOpenChange` props, which makes it easy to track the tooltip state:

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

Because Radix expects all its children to be rendered at all times, when we're conditionally rendering children like this, setting `forceMount` to true allows our enter/exit animations to work correctly.

### Reference
- https://motion.dev/docs/radix
