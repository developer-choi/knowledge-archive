---
tags: [react, performance]
---
# Questions
- [@tanstack/react-virtual의 useVirtualizer와 useWindowVirtualizer의 차이는?](#tanstackreact-virtual의-usevirtualizer와-usewindowvirtualizer의-차이는)
- [React 19에서 @tanstack/react-virtual 사용 시 스크롤할 때 "flushSync was called from inside a lifecycle method" 경고가 발생한다. 원인과 해결 방법은?](#react-19에서-tanstackreact-virtual-사용-시-스크롤할-때-flushsync-was-called-from-inside-a-lifecycle-method-경고가-발생한다-원인과-해결-방법은)
  - [useFlushSync를 false로 설정하면 어떤 trade-off가 있는가?](#useflushsync를-false로-설정하면-어떤-trade-off가-있는가)
- [@tanstack/virtual의 count 옵션은 무엇인가?](#tanstackvirtual의-count-옵션은-무엇인가)
- [@tanstack/virtual의 estimateSize 옵션은 무엇인가?](#tanstackvirtual의-estimatesize-옵션은-무엇인가)
  - [아이템 높이가 제각각인 리스트에서 estimateSize에 작은 값을 넣으면 어떤 문제가 생기는가?](#아이템-높이가-제각각인-리스트에서-estimatesize에-작은-값을-넣으면-어떤-문제가-생기는가)
- [@tanstack/virtual의 overscan 옵션은 무엇이며, 값을 높이면 어떤 trade-off가 있는가?](#tanstackvirtual의-overscan-옵션은-무엇이며-값을-높이면-어떤-trade-off가-있는가)
- [@tanstack/virtual의 getVirtualItems()는 무엇을 반환하는가?](#tanstackvirtual의-getvirtualitems는-무엇을-반환하는가)
- [@tanstack/virtual의 VirtualItem 객체는 어떤 정보를 담고 있으며, start와 size는 어떻게 사용하는가?](#tanstackvirtual의-virtualitem-객체는-어떤-정보를-담고-있으며-start와-size는-어떻게-사용하는가)
  - [VirtualItem의 size는 언제 추정값이고 언제 실측값인가?](#virtualitem의-size는-언제-추정값이고-언제-실측값인가)
- [@tanstack/virtual의 getTotalSize()는 무엇을 반환하며, 동적 측정 시 어떻게 변하는가?](#tanstackvirtual의-gettotalsize는-무엇을-반환하며-동적-측정-시-어떻게-변하는가)
- [@tanstack/virtual의 measureElement 옵션은 무엇이며, estimateSize와 어떤 관계인가?](#tanstackvirtual의-measureelement-옵션은-무엇이며-estimatesize와-어떤-관계인가)

---

# Answers

## @tanstack/react-virtual의 useVirtualizer와 useWindowVirtualizer의 차이는?

### Official Answer
`useVirtualizer`: This function returns a standard Virtualizer instance configured to work with an HTML element as the scrollElement.

`useWindowVirtualizer`: This function returns a window-based Virtualizer instance configured to work with the window as the scrollElement.

> #### AI Annotation:
> `useVirtualizer`는 특정 HTML 요소(`overflow: auto`가 걸린 `div` 등)를 스크롤 컨테이너로 사용한다 — 모달 안 리스트, 사이드바 등 부분 영역 스크롤.
> `useWindowVirtualizer`는 브라우저 window 자체가 스크롤 컨테이너다 — 무한 스크롤 피드 등 풀페이지 리스트.
> `useWindowVirtualizer`는 `getScrollElement` 옵션을 전달할 필요가 없다.

### Reference
- https://tanstack.com/virtual/latest/docs/framework/react/react-virtual

---

## React 19에서 @tanstack/react-virtual 사용 시 스크롤할 때 "flushSync was called from inside a lifecycle method" 경고가 발생한다. 원인과 해결 방법은?

### Official Answer
Both `useVirtualizer` and `useWindowVirtualizer` accept a `useFlushSync` option that controls whether React's `flushSync` is used for synchronous updates.

Type: `boolean`
Default: `true`

When `true`, the virtualizer will use `flushSync` from `react-dom` to ensure synchronous rendering during scroll events.
This provides the most accurate scrolling behavior but may impact performance in some scenarios.

React 19 compatibility: In React 19, you may see the following console warning when scrolling:

"flushSync was called from inside a lifecycle method.
React cannot flush when React is already rendering.
Consider moving this call to a scheduler task or micro task."

Setting `useFlushSync: false` will eliminate this warning by allowing React to batch updates naturally.

> #### AI Annotation:
> `flushSync`는 React의 batching을 우회하여 동기적으로 DOM을 업데이트하는 함수다.
> virtualizer가 이를 기본으로 사용하는 이유는 스크롤 중 가상 아이템의 위치 계산과 렌더링이 정확히 동기화되어야 시각적 끊김이 없기 때문이다.
> React 19에서는 렌더링 중 `flushSync` 호출을 더 엄격하게 감지하여 경고를 표시한다.

### Reference
- https://tanstack.com/virtual/latest/docs/framework/react/react-virtual

---

## useFlushSync를 false로 설정하면 어떤 trade-off가 있는가?

### Official Answer
When `true`, the virtualizer will use `flushSync` from `react-dom` to ensure synchronous rendering during scroll events.
This provides the most accurate scrolling behavior but may impact performance in some scenarios.

You may want to set `useFlushSync: false` in the following scenarios:
- Performance optimization: If you experience performance issues with rapid scrolling on lower-end devices
- Testing environments: When running tests that don't require synchronous DOM updates
- Non-critical lists: When slight visual delays during scrolling are acceptable for better overall performance

> #### AI Annotation:
> 정확성 vs 성능의 trade-off다.
> `true`(기본값): 스크롤 시 빈 공간 없이 정확하게 렌더링하지만 성능 비용이 있다.
> `false`: React가 자연스럽게 batching하므로 성능은 좋아지지만, 빠른 스크롤 시 약간의 시각적 지연이 발생할 수 있다.

### Reference
- https://tanstack.com/virtual/latest/docs/framework/react/react-virtual

---

## @tanstack/virtual의 count 옵션은 무엇인가?

### Official Answer
The total number of items to virtualize.

> #### AI Annotation:
> 가상화할 전체 아이템 수를 지정하는 필수 옵션이다.
> 실제 DOM에는 화면에 보이는 몇 개만 렌더링하지만, virtualizer는 이 숫자로 전체 스크롤 영역의 높이를 계산한다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 estimateSize 옵션은 무엇인가?

### Official Answer
This function is passed the index of each item and should return the actual size (or estimated size if you will be dynamically measuring items with `virtualItem.measureElement`) for each item.
This measurement should return either the width or height depending on the orientation of your virtualizer.

> #### AI Annotation:
> 각 아이템의 예상 크기를 반환하는 함수다.
> 고정 크기면 `() => 50`처럼 상수를 반환하고, 가변 크기면 `virtualItem.measureElement`로 실제 DOM을 측정하되 초기 추정값은 이 함수가 제공한다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## 아이템 높이가 제각각인 리스트에서 estimateSize에 작은 값을 넣으면 어떤 문제가 생기는가?

### Official Answer
If you are dynamically measuring your elements, it's recommended to estimate the largest possible size (width/height, within comfort) of your items.
This will help the virtualizer calculate more accurate initial positions.

> #### AI Annotation:
> 추정값이 실제보다 작으면 초기 위치 계산이 어긋나서 스크롤 시 아이템이 점프하는 현상이 발생한다.
> 반대로 크게 잡으면 실제 측정값으로 교정될 때 자연스럽게 줄어들어 덜 거슬린다.
> 그래서 공식 문서는 "가장 큰 크기로 넉넉하게 잡으라"고 권장한다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 overscan 옵션은 무엇이며, 값을 높이면 어떤 trade-off가 있는가?

### Official Answer
The number of items to render above and below the visible area.
Increasing this number will increase the amount of time it takes to render the virtualizer, but might decrease the likelihood of seeing slow-rendering blank items at the top and bottom of the virtualizer when scrolling.
The default value is 1.

> #### AI Annotation:
> 화면에 보이는 영역 바깥으로 미리 렌더링할 버퍼 아이템 수를 지정하는 옵션이다.
> 값을 높이면 빠른 스크롤 시 빈 공간이 줄어들지만, 렌더링할 아이템이 늘어나 성능 비용이 증가한다.
> 기본값 1은 위아래 각 1개씩만 미리 렌더링하는 것이다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 getVirtualItems()는 무엇을 반환하는가?

### Official Answer
Returns the virtual items for the current state of the virtualizer.

> #### AI Annotation:
> virtualizer가 현재 스크롤 위치에서 렌더링해야 할 가상 아이템(`VirtualItem[]`) 배열을 반환하는 메서드다.
> 전체 `count`개가 아니라 화면에 보이는 + overscan 범위의 소수만 포함된다.
> `count`(입력)와 `estimateSize`(크기 추정)를 넣으면, `getVirtualItems()`(출력)로 "지금 뭘 그려야 하는지"를 받는 구조다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 VirtualItem 객체는 어떤 정보를 담고 있으며, start와 size는 어떻게 사용하는가?

### Official Answer
The VirtualItem object represents a single item returned by the virtualizer.
It contains information you need to render the item in the coordinate space within your virtualizer's scrollElement and other helpful properties/functions.

`start`: The starting pixel offset for the item.
This is usually mapped to a css property or transform like top/left or translateX/translateY.

`size`: The size of the item.
This is usually mapped to a css property like width/height.

> #### AI Annotation:
> VirtualItem은 "이 아이템을 어디에(`start`), 얼마나 크게(`size`) 그려라"라는 렌더링 지시서다.
> virtualizer가 좌표를 계산하고, 개발자는 이 값을 CSS에 매핑하면 된다.
> 예: 세로 리스트에서 `start`가 200이면 `transform: translateY(200px)`, `size`가 50이면 `height: 50px`.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtual-item

---

## VirtualItem의 size는 언제 추정값이고 언제 실측값인가?

### Official Answer
Before an item is measured with the VirtualItem.measureElement method, this will be the estimated size returned from your estimateSize virtualizer option.
After an item is measured (if you choose to measure it at all), this value will be the number returned by your measureElement virtualizer option (which by default is configured to measure elements with getBoundingClientRect()).

> #### AI Annotation:
> `measureElement`로 측정하기 전에는 `estimateSize`가 반환한 추정값이고, 측정 후에는 `getBoundingClientRect()` 기반 실제 크기로 교체된다.
> 고정 크기 리스트는 측정이 필요 없고, 가변 크기 리스트에서만 이 전환이 일어난다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtual-item

---

## @tanstack/virtual의 getTotalSize()는 무엇을 반환하며, 동적 측정 시 어떻게 변하는가?

### Official Answer
Returns the total size in pixels for the virtualized items.
This measurement will incrementally change if you choose to dynamically measure your elements as they are rendered.

> #### AI Annotation:
> 가상화된 아이템 전체의 총 크기(px)를 반환하는 메서드다.
> 이 값을 스크롤 컨테이너 내부 요소의 `height`(또는 `width`)로 설정하여 스크롤바 길이를 결정한다.
> `measureElement`로 동적 측정 시, 추정값에서 실측값으로 점진적으로 보정된다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 measureElement 옵션은 무엇이며, estimateSize와 어떤 관계인가?

### Official Answer
This optional function is called when the virtualizer needs to dynamically measure the size (width or height) of an item.
You can use `instance.options.horizontal` to determine if the width or height of the item should be measured.

> #### AI Annotation:
> 아이템의 실제 DOM 크기를 동적으로 측정하는 선택적 함수다.
> `estimateSize`가 초기 추정값을 제공하고, `measureElement`가 렌더링 후 실측값으로 교체하는 한 쌍의 관계다.
> 기본 구현은 `getBoundingClientRect()`로 실제 DOM 크기를 재며, 고정 크기 리스트에서는 필요 없다.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer
