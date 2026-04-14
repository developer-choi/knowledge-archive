---
tags: [styling, browser, concept]
---
# Questions
- 터치스크린에서 브라우저가 스크롤/줌 제스처를 독점 처리할 때, 앱이 커스텀 터치 동작(예: 캔버스 드래그)을 구현하려면 어떤 CSS 속성으로 제스처 처리 권한을 분배하는가?
- touch-action 값은 터치된 요소와 조상 요소 사이에서 어떻게 결정되는가?

---

# Answers

## 터치스크린에서 브라우저가 스크롤/줌 제스처를 독점 처리할 때, 앱이 커스텀 터치 동작(예: 캔버스 드래그)을 구현하려면 어떤 CSS 속성으로 제스처 처리 권한을 분배하는가?

### Official Answer
The touch-action CSS property sets how an element's region can be manipulated by a touchscreen user (for example, by zooming features built into the browser).

By default, panning (scrolling) and pinching gestures are handled exclusively by the browser.
An application using Pointer events will receive a pointercancel event when the browser starts handling a touch gesture.
By explicitly specifying which gestures should be handled by the browser, an application can supply its own behavior in pointermove and pointerup listeners for the remaining gestures.
Applications using Touch events disable the browser handling of gestures by calling preventDefault(), but should also use touch-action to ensure the browser knows the intent of the application before any event listeners have been invoked.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action

---

## touch-action 값은 터치된 요소와 조상 요소 사이에서 어떻게 결정되는가?

### Official Answer
When a gesture is started, the browser intersects the touch-action values of the touched element and its ancestors, up to the one that implements the gesture (in other words, the first containing scrolling element).
This means that in practice, touch-action is typically applied only to top-level elements which have some custom behavior, without needing to specify touch-action explicitly on any of that element's descendants.

### 실전 사례: FullScreenBottomSheet에서 드래그/스크롤 분리

#### 배경

framer-motion의 `drag="y"`로 아래로 드래그하면 닫히는 풀스크린 바텀시트를 만들고 있었다.
문제는 시트 안에 스크롤 가능한 컨텐츠(리스트, 폼 등)가 있을 때, 모바일에서 터치 스크롤과 드래그 닫기가 충돌하는 것.

처음에는 "부모에 `touch-action: none`을 걸면 자식에서 `touch-action: auto`를 줘도 교집합이 `none`이라 스크롤이 안 될 것"이라고 예상했다.
`none ∩ auto = none`이니까.

#### 실제 테스트 결과

예상과 달리, 부모에 `none`을 걸어도 `overflow: auto`인 자식 내부에서 터치 스크롤이 정상 동작했다.

MDN 문서를 다시 읽어보니 핵심 문구가 있었다:

> the browser intersects the touch-action values of the touched element and its ancestors, **up to the one that implements the gesture (in other words, the first containing scrolling element)**

교집합 계산이 무한히 올라가는 게 아니라, **"제스처를 구현하는 첫 번째 스크롤 요소"에서 멈춘다.**

#### 최종 구조와 동작

```
.container (touch-action: none)
  └── .dragArea
    └── ScrollArea (touch-action: auto, overflow: auto)  ← 스크롤 요소
      └── 스크롤 컨텐츠
    └── 빈 영역
```

| 터치 위치 | 교집합 계산 범위 | 결과 |
|-----------|-----------------|------|
| ScrollArea 안 | 터치 요소 → ScrollArea에서 멈춤 (첫 번째 스크롤 요소) | `auto` → 터치 스크롤 동작 |
| 빈 영역 | 터치 요소 → 스크롤 요소 없음 → `.container`까지 올라감 | `none` → 브라우저 제스처 차단, JS 드래그 동작 |

부수 효과로 `.container`의 `touch-action: none` 덕분에 빈 영역에서 아래로 드래그해도 브라우저 pull-to-refresh가 발동하지 않았다.
반대로 ScrollArea에 `touch-action: pan-y`를 줬을 때는 스크롤 맨 위에서 아래로 당기면 pull-to-refresh가 동작했다.

#### 교훈

- `none ∩ auto = none`은 맞지만, 교집합 범위가 "첫 번째 스크롤 요소까지"로 제한된다
- 부모에 `touch-action: none`을 걸어도, `overflow: auto/scroll`인 자식 요소 내부에서는 터치 스크롤이 정상 동작한다
- `touch-action`은 최상위 컨테이너에 한 번만 걸면 되고, 스크롤이 필요한 자식은 `overflow: auto` + `touch-action: auto`면 충분하다

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action
