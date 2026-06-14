---
tags: [react, performance]
source: official
publishable: false
priority:
---
# Questions
- @tanstack/react-virtual의 useVirtualizer와 useWindowVirtualizer의 차이는?
- React 19에서 @tanstack/react-virtual 사용 시 스크롤할 때 "flushSync was called from inside a lifecycle method" 경고가 발생한다. 원인과 해결 방법은?
  - useFlushSync를 false로 설정하면 어떤 trade-off가 있는가?
- @tanstack/virtual의 count 옵션은 무엇인가?
- @tanstack/virtual의 estimateSize 옵션은 무엇인가?
  - 아이템 높이가 제각각인 리스트에서 estimateSize에 작은 값을 넣으면 어떤 문제가 생기는가?
- @tanstack/virtual의 overscan 옵션은 무엇이며, 값을 높이면 어떤 trade-off가 있는가?
- @tanstack/virtual의 getVirtualItems()는 무엇을 반환하는가?
- @tanstack/virtual의 VirtualItem 객체는 어떤 정보를 담고 있으며, start와 size는 어떻게 사용하는가?
  - VirtualItem의 size는 언제 추정값이고 언제 실측값인가?
- @tanstack/virtual의 getTotalSize()는 무엇을 반환하며, 동적 측정 시 어떻게 변하는가?
- @tanstack/virtual의 measureElement 옵션은 무엇이며, estimateSize와 어떤 관계인가?

---

# Answers

## @tanstack/react-virtual의 useVirtualizer와 useWindowVirtualizer의 차이는?

### Official Answer
`useVirtualizer`: This function returns a standard Virtualizer instance configured to work with an HTML element as the scrollElement.

`useWindowVirtualizer`: This function returns a window-based Virtualizer instance configured to work with the window as the scrollElement.

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

### Reference
- https://tanstack.com/virtual/latest/docs/framework/react/react-virtual

---

## @tanstack/virtual의 count 옵션은 무엇인가?

### Official Answer
The total number of items to virtualize.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 estimateSize 옵션은 무엇인가?

### Official Answer
This function is passed the index of each item and should return the actual size (or estimated size if you will be dynamically measuring items with `virtualItem.measureElement`) for each item.
This measurement should return either the width or height depending on the orientation of your virtualizer.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## 아이템 높이가 제각각인 리스트에서 estimateSize에 작은 값을 넣으면 어떤 문제가 생기는가?

### Official Answer
If you are dynamically measuring your elements, it's recommended to estimate the largest possible size (width/height, within comfort) of your items.
This will help the virtualizer calculate more accurate initial positions.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 overscan 옵션은 무엇이며, 값을 높이면 어떤 trade-off가 있는가?

### Official Answer
The number of items to render above and below the visible area.
Increasing this number will increase the amount of time it takes to render the virtualizer, but might decrease the likelihood of seeing slow-rendering blank items at the top and bottom of the virtualizer when scrolling.
The default value is 1.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 getVirtualItems()는 무엇을 반환하는가?

### Official Answer
Returns the virtual items for the current state of the virtualizer.

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

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtual-item

---

## VirtualItem의 size는 언제 추정값이고 언제 실측값인가?

### Official Answer
Before an item is measured with the VirtualItem.measureElement method, this will be the estimated size returned from your estimateSize virtualizer option.
After an item is measured (if you choose to measure it at all), this value will be the number returned by your measureElement virtualizer option (which by default is configured to measure elements with getBoundingClientRect()).

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtual-item

---

## @tanstack/virtual의 getTotalSize()는 무엇을 반환하며, 동적 측정 시 어떻게 변하는가?

### Official Answer
Returns the total size in pixels for the virtualized items.
This measurement will incrementally change if you choose to dynamically measure your elements as they are rendered.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer

---

## @tanstack/virtual의 measureElement 옵션은 무엇이며, estimateSize와 어떤 관계인가?

### Official Answer
This optional function is called when the virtualizer needs to dynamically measure the size (width or height) of an item.
You can use `instance.options.horizontal` to determine if the width or height of the item should be measured.

### Reference
- https://tanstack.com/virtual/latest/docs/api/virtualizer
