# 터치스크린에서 브라우저가 스크롤/줌 제스처를 독점 처리할 때, 앱이 커스텀 터치 동작을 구현하려면 어떤 CSS 속성으로 제스처 처리 권한을 분배하는가?

## 도입

브라우저는 스크롤·핀치줌 같은 터치 제스처를 기본적으로 독점 처리한다. 앱이 canvas 드래그처럼 커스텀 제스처를 구현하려면, 브라우저에게 어떤 제스처를 넘겨줄지 명시해야 한다. 이를 제어하는 CSS 속성이 `touch-action`이다.

---

## 본문

> The touch-action CSS property sets how an element's region can be manipulated by a touchscreen user (for example, by zooming features built into the browser).
>
> By default, panning (scrolling) and pinching gestures are handled exclusively by the browser. An application using Pointer events will receive a pointercancel event when the browser starts handling a touch gesture. By explicitly specifying which gestures should be handled by the browser, an application can supply its own behavior in pointermove and pointerup listeners for the remaining gestures.

"`touch-action` CSS 속성은 터치스크린 사용자가 요소 영역을 어떻게 조작할 수 있는지를 설정한다. 기본적으로 패닝(스크롤)과 핀치 제스처는 브라우저가 독점 처리한다. Pointer events를 사용하는 앱은 브라우저가 터치 제스처 처리를 시작하면 `pointercancel` 이벤트를 받는다. 어떤 제스처를 브라우저가 처리할지 명시함으로써, 앱은 나머지 제스처에 대해 `pointermove`·`pointerup` 리스너에서 자체 동작을 제공할 수 있다."

- **`touch-action`**: 요소 영역에서 브라우저가 처리할 터치 제스처 종류를 CSS로 선언하는 속성. 기본값은 `auto`(모든 제스처를 브라우저가 처리).
- **`pointercancel`**: 브라우저가 터치 제스처를 가져가기로 결정하는 순간 발생하는 이벤트. 이 시점 이후로 JS는 해당 터치 스트림을 받지 못한다.
- **`touch-action: none`**: 브라우저가 모든 터치 제스처를 개입하지 않도록 막아, JS가 `pointermove`·`pointerup`을 끝까지 수신할 수 있게 한다.
- **`touch-action: pan-y`**: 세로 스크롤은 브라우저가 처리하되, 가로 방향 제스처는 JS에게 넘기는 선택적 분배.

```
touch-action: auto   → 브라우저가 모든 제스처 독점
touch-action: none   → 브라우저 개입 없음, JS가 모든 터치 수신
touch-action: pan-y  → 세로 스크롤은 브라우저, 나머지는 JS
touch-action: pan-x  → 가로 스크롤은 브라우저, 나머지는 JS
```

---

## 종합

Framer Motion의 `drag="y"`가 실작동하려면 드래그 대상 요소에 `touch-action: none`이 필요하다. 자식 요소에 `touch-action: auto`나 `pan-y`가 남아 있으면 브라우저가 터치를 네이티브 스크롤로 인식하고, `pointercancel`을 발생시켜 Motion이 드래그를 중단한다. `onDragEnd` 닫기 로직이 임계값에 도달하기 전에 끊기는 현상은 이 `pointercancel`이 원인이다. DevTools Network 탭이 아니라 DevTools Events 탭(이벤트 리스너 패널)에서 `pointercancel` 리스너를 추적하면 발생 시점을 확인할 수 있다.

---

---

# touch-action 값은 터치된 요소와 조상 요소 사이에서 어떻게 결정되는가?

## 도입

`touch-action`은 단순히 터치된 요소 하나에만 적용되는 것이 아니다. 브라우저는 조상 요소까지 올라가며 값의 교집합을 계산한다. 단, 이 계산이 무한히 위로 올라가지는 않는다는 핵심 제한이 있다.

---

## 본문

> When a gesture is started, the browser intersects the touch-action values of the touched element and its ancestors, up to the one that implements the gesture (in other words, the first containing scrolling element). This means that in practice, touch-action is typically applied only to top-level elements which have some custom behavior, without needing to specify touch-action explicitly on any of that element's descendants.

"제스처가 시작될 때, 브라우저는 터치된 요소와 그 조상 요소들의 `touch-action` 값을 교집합하되, 제스처를 구현하는 요소(즉, 첫 번째 스크롤 컨테이너)까지만 올라간다. 실제로는 커스텀 동작이 있는 최상위 요소에만 `touch-action`을 지정하면 되고, 하위 요소에 일일이 명시할 필요가 없다."

- **교집합(intersection)**: 터치 요소부터 조상까지 각 `touch-action` 값의 교집합이 최종 적용값이다. `none ∩ auto = none`, `pan-x ∩ pan-y = none`.
- **"첫 번째 스크롤 요소에서 멈춤"**: 교집합 계산이 `overflow: auto/scroll`인 요소를 만나면 그 위 조상은 계산에 포함하지 않는다. 이것이 핵심 예외다.

```
.container (touch-action: none)
  └── .dragArea
        ├── ScrollArea (overflow: auto, touch-action: auto)  ← 스크롤 요소
        │     └── 스크롤 컨텐츠
        └── 빈 영역

터치 위치        교집합 범위                 결과
ScrollArea 안  → ScrollArea에서 멈춤        auto → 터치 스크롤 동작
빈 영역        → .container까지 올라감       none → 브라우저 제스처 차단
```

---

## 종합

"최상위에 `touch-action: none`을 걸면 자식 스크롤이 막힌다"는 직관은 틀렸다. `overflow: auto`인 자식 요소가 있으면 그 안의 터치는 해당 요소에서 교집합 계산이 멈추므로, 스크롤이 정상 동작한다. 바텀시트처럼 드래그 닫기와 내부 스크롤이 공존하는 구조에서, 최상위 컨테이너에 `touch-action: none`을 걸고 내부 스크롤 영역은 `overflow: auto`로 두는 것만으로 두 동작이 분리된다. 부수 효과로 `touch-action: none`이 걸린 빈 영역에서 아래로 당기면 pull-to-refresh도 발동하지 않는다.
