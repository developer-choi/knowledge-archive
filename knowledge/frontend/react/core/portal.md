---
tags: [react, concept]
publishable: false
source: google-doc
priority:
---
# Questions
- React Portal로 렌더링한 컴포넌트의 Rendering Tree는 어떻게 동작하는가?
- React Portal로 렌더링한 컴포넌트에서 발생한 이벤트는 어떻게 전파되는가?

---

# Answers

## React Portal로 렌더링한 컴포넌트의 Rendering Tree는 어떻게 동작하는가?

### User Answer
포탈 컴포넌트는 아예 다른 DOM 구조로 나타날지언정 Rendering Tree는 기존과 똑같이 동작함.

자식이 마운트 되고 나서야 부모가 마운트된다거나 그런거 다 똑같음.

예시:
```tsx
function Parent() {
  useEffect(() => {
    console.log('Parent is mounted.');
  }, []);

  return (
    <PortalChildren />
  );
}
```

`PortalChildren`이 Portal로 다른 DOM 노드에 마운트되더라도, `Parent`의 `useEffect`는 `PortalChildren`이 마운트된 이후에 실행된다.

---

## React Portal로 렌더링한 컴포넌트에서 발생한 이벤트는 어떻게 전파되는가?

### User Answer
포탈 자식에서 클릭하면 React 트리 상의 부모까지 이벤트가 버블링됨. DOM 구조상으로는 불가능하지만 됨.

예시:
```tsx
// Parent 컴포넌트
return (
  <div onClick={onClock}>
    <PortalChildren />
  </div>
);
```

`PortalChildren`이 DOM 상 전혀 다른 노드에 렌더링되더라도, `PortalChildren` 내부에서 클릭하면 `div`의 `onClick`까지 버블링됨.

일반적인 모달 사용 패턴:
```tsx
return (
  <>
    <button>모달 열기 버튼</button>
    {visible && <Modal />}
  </>
);
```

잘못 쓰면 버그 가능. 예를 들어 Portal로 띄운 Alert 모달 내부 클릭이 의도치 않게 부모 컴포넌트의 onClick 핸들러를 트리거할 수 있음.

일반적인 모달 사용 상으로는 버그 발생 안 하는 경우가 많음.

