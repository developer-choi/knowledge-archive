# @tanstack/react-virtual의 useVirtualizer와 useWindowVirtualizer의 차이는?

## 도입

TanStack Virtual은 대용량 리스트를 화면에 보이는 항목만 DOM에 렌더링해 성능을 확보하는 라이브러리다. 두 훅은 스크롤 컨테이너가 무엇이냐에 따라 선택이 갈린다.

---

## 본문

> `useVirtualizer`: This function returns a standard Virtualizer instance configured to work with an HTML element as the scrollElement.
>
> `useWindowVirtualizer`: This function returns a window-based Virtualizer instance configured to work with the window as the scrollElement.

"`useVirtualizer`는 HTML 요소를 `scrollElement`로 사용하도록 구성된 표준 Virtualizer 인스턴스를 반환한다. `useWindowVirtualizer`는 window를 `scrollElement`로 사용하도록 구성된 window 기반 Virtualizer 인스턴스를 반환한다."

- **`useVirtualizer`**: `overflow: auto`가 걸린 `div` 같은 특정 HTML 요소를 스크롤 컨테이너로 사용한다. 모달 안 리스트, 사이드바처럼 페이지 일부 영역만 스크롤하는 경우에 사용한다. `getScrollElement` 옵션으로 컨테이너 ref를 전달해야 한다.
- **`useWindowVirtualizer`**: 브라우저 window 자체가 스크롤 컨테이너다. 무한 스크롤 피드처럼 페이지 전체가 스크롤되는 경우에 사용한다. `getScrollElement`를 전달할 필요가 없다.

---

## 종합

선택 기준은 단순하다: 스크롤 컨테이너가 특정 `div`면 `useVirtualizer`, 페이지 전체(window)면 `useWindowVirtualizer`. 모달이나 패널 안에 가상 리스트를 넣는다면 `useVirtualizer`가 맞고, 트위터 피드 같은 풀페이지 리스트라면 `useWindowVirtualizer`가 맞다.

---

---

# React 19에서 @tanstack/react-virtual 사용 시 스크롤할 때 "flushSync was called from inside a lifecycle method" 경고가 발생한다. 원인과 해결 방법은?

## 도입

TanStack Virtual은 스크롤 중 가상 아이템 위치를 정확히 동기화하기 위해 React의 `flushSync`를 기본으로 사용한다. React 19가 이 패턴을 더 엄격하게 감지해 경고를 표시하게 되었다.

---

## 본문

> Both `useVirtualizer` and `useWindowVirtualizer` accept a `useFlushSync` option that controls whether React's `flushSync` is used for synchronous updates.
>
> Type: `boolean` / Default: `true`
>
> When `true`, the virtualizer will use `flushSync` from `react-dom` to ensure synchronous rendering during scroll events. This provides the most accurate scrolling behavior but may impact performance in some scenarios.
>
> React 19 compatibility: In React 19, you may see the following console warning when scrolling: "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
>
> Setting `useFlushSync: false` will eliminate this warning by allowing React to batch updates naturally.

"`useVirtualizer`와 `useWindowVirtualizer` 모두 React의 `flushSync` 사용 여부를 제어하는 `useFlushSync` 옵션을 받는다. 기본값 `true`일 때 virtualizer는 스크롤 이벤트 중 동기 렌더링을 보장하기 위해 `react-dom`의 `flushSync`를 사용한다. React 19에서는 렌더링 중 `flushSync` 호출을 더 엄격하게 감지해 경고를 표시한다. `useFlushSync: false`로 설정하면 React가 자연스럽게 업데이트를 batching하여 경고가 사라진다."

- **`flushSync`**: React의 batching을 우회해 동기적으로 DOM을 업데이트하는 함수. virtualizer가 기본 사용하는 이유는 스크롤 중 가상 아이템 위치 계산과 렌더링이 동기화되어야 시각적 끊김이 없기 때문이다.
- **`useFlushSync: false`**: React 19 경고를 제거하는 해결책. React의 자연스러운 batching에 맡기므로 빠른 스크롤 시 약간의 시각적 지연이 생길 수 있다.

---

## 종합

경고 자체는 기능 오류가 아니라 React 19의 엄격성 강화로 인한 것이다. `useFlushSync: false`가 즉각적인 해결책이지만, 빠른 스크롤 중 빈 공간이 잠깐 보이는 trade-off가 있다. 대부분의 프로덕션 리스트에서는 이 차이가 체감되지 않으므로 React 19 환경에서는 `false`로 설정하는 것이 현실적인 선택이다.

---

---

# useFlushSync를 false로 설정하면 어떤 trade-off가 있는가?

## 도입

`useFlushSync`는 정확성과 성능 사이의 트레이드오프를 제어하는 옵션이다. 기본값 `true`는 정확성을 최우선으로 하지만, 모든 시나리오에 적합한 선택은 아니다.

---

## 본문

> When `true`, the virtualizer will use `flushSync` from `react-dom` to ensure synchronous rendering during scroll events. This provides the most accurate scrolling behavior but may impact performance in some scenarios.
>
> You may want to set `useFlushSync: false` in the following scenarios:
> - Performance optimization: If you experience performance issues with rapid scrolling on lower-end devices
> - Testing environments: When running tests that don't require synchronous DOM updates
> - Non-critical lists: When slight visual delays during scrolling are acceptable for better overall performance

"`true`(기본값)일 때: 스크롤 이벤트 중 `flushSync`로 동기 렌더링을 보장해 가장 정확한 스크롤 동작을 제공하지만 일부 시나리오에서 성능에 영향을 줄 수 있다. `false`로 설정하는 상황: 저사양 기기에서 빠른 스크롤 시 성능 문제가 있을 때 / 동기 DOM 업데이트가 필요 없는 테스트 환경 / 약간의 시각적 지연이 허용되는 중요도 낮은 리스트."

- **`true` (기본값)**: 빈 공간 없이 정확하게 렌더링하지만 성능 비용이 있다.
- **`false`**: React가 자연스럽게 batching하므로 성능은 좋아지지만, 빠른 스크롤 시 약간의 시각적 지연이 발생할 수 있다.

---

## 종합

성능이 중요한 저사양 기기나 React 19 경고를 없애고 싶은 환경에서는 `false`가 실용적이다. 반대로 금융 데이터 테이블처럼 스크롤 중에도 정확한 위치가 보장되어야 하는 리스트라면 `true`를 유지한다. React 19에서도 기능적으로는 `true`가 정상 동작하므로, 경고만 거슬린다면 `false`로 전환하고 실제 스크롤 체감을 확인하는 것으로 판단하면 된다.

---

---

# @tanstack/virtual의 count 옵션은 무엇인가?

## 도입

virtualizer는 실제 DOM에 소수의 요소만 렌더링하지만, 스크롤바 길이와 전체 위치 계산을 위해 총 아이템 수를 알아야 한다. 이것이 `count`다.

---

## 본문

> The total number of items to virtualize.

"가상화할 전체 아이템 수."

- **`count`**: 가상화할 전체 아이템 수를 지정하는 필수 옵션. 실제 DOM에는 화면에 보이는 몇 개만 렌더링하지만, virtualizer는 이 숫자와 `estimateSize`를 조합하여 전체 스크롤 영역의 높이를 계산한다.

```
count: 10000, estimateSize: () => 50
→ 전체 높이 계산: 10000 × 50 = 500,000px
→ 스크롤바는 50만px 높이의 컨테이너처럼 동작
→ DOM에는 화면에 보이는 ~20개만 실제 렌더링
```

---

## 종합

`count`가 크다고 성능이 저하되지는 않는다. virtualizer의 핵심이 DOM에 실제로 렌더링하는 개수를 제한하는 것이고, `count`는 스크롤 계산용 숫자일 뿐이다. 100만 건이어도 DOM에는 화면에 보이는 개수만 있다.

---

---

# @tanstack/virtual의 estimateSize 옵션은 무엇인가?

## 도입

virtualizer는 DOM을 그리기 전에 각 아이템이 얼마나 큰지 미리 알아야 한다. 동적으로 측정하기 전의 초기 추정값을 제공하는 것이 `estimateSize`다.

---

## 본문

> This function is passed the index of each item and should return the actual size (or estimated size if you will be dynamically measuring items with `virtualItem.measureElement`) for each item. This measurement should return either the width or height depending on the orientation of your virtualizer.

"이 함수는 각 아이템의 인덱스를 받아 해당 아이템의 실제 크기(또는 `virtualItem.measureElement`로 동적 측정할 예정이면 추정 크기)를 반환해야 한다. 반환값은 virtualizer의 방향에 따라 너비 또는 높이여야 한다."

- **`estimateSize`**: 인덱스를 받아 해당 아이템의 크기(px)를 반환하는 함수. 고정 크기면 `() => 50`처럼 상수를 반환하고, 가변 크기면 `measureElement`와 함께 사용한다.
- 인덱스를 받으므로 아이템마다 다른 추정값을 반환할 수 있다: `(i) => i === 0 ? 200 : 50`.

---

## 종합

`estimateSize`는 virtualizer의 첫 번째 계산 근거다. 고정 크기 리스트에서는 이 값이 곧 실제 크기이고, 가변 크기 리스트에서는 `measureElement`가 실측값으로 교체하기 전까지 임시로 쓰인다. 추정값이 실제와 크게 다르면 스크롤 시 아이템이 점프하므로, 가변 크기 리스트에서는 크게 잡는 것이 안전하다.

---

---

# 아이템 높이가 제각각인 리스트에서 estimateSize에 작은 값을 넣으면 어떤 문제가 생기는가?

## 도입

가변 크기 리스트에서 `estimateSize`는 초기 위치 계산의 기준점이다. 이 값이 실제보다 너무 작으면 스크롤 경험이 깨진다.

---

## 본문

> If you are dynamically measuring your elements, it's recommended to estimate the largest possible size (width/height, within comfort) of your items. This will help the virtualizer calculate more accurate initial positions.

"요소를 동적으로 측정한다면, 아이템의 가능한 가장 큰 크기(너비/높이, 편안한 범위 내에서)를 추정하는 것이 권장된다. 이는 virtualizer가 더 정확한 초기 위치를 계산하는 데 도움이 된다."

- **추정값 < 실제 크기 문제**: 초기 위치 계산이 실제보다 촘촘하게 잡힌다. `measureElement`가 실측값을 받아 교정할 때 이후 아이템들의 위치가 일제히 밀려나면서 스크롤 중 아이템이 점프하는 현상이 발생한다.
- **추정값 > 실제 크기**: 실측값으로 교정될 때 아이템들이 자연스럽게 모여 덜 거슬린다. 공식 문서가 "넉넉하게 잡으라"고 권장하는 이유다.

---

## 종합

`estimateSize`를 너무 작게 잡으면 초기 스크롤 시 UI가 껄끄럽다. 아이템 컨텐츠를 모르는 상태에서 안전한 전략은 평균 크기의 1.5배 정도를 초기값으로 설정하고 `measureElement`에게 실측을 맡기는 것이다. DevTools Performance 탭에서 Layout 이벤트가 스크롤 중 자주 발생한다면 `estimateSize` 추정이 너무 작아 반복 교정이 일어나는 신호일 수 있다.

---

---

# @tanstack/virtual의 overscan 옵션은 무엇이며, 값을 높이면 어떤 trade-off가 있는가?

## 도입

가상 리스트는 화면에 보이는 것만 렌더링하지만, 빠른 스크롤 시 새 아이템이 늦게 나타나 빈 공간이 잠깐 보일 수 있다. `overscan`은 이 빈 공간을 줄이기 위한 버퍼다.

---

## 본문

> The number of items to render above and below the visible area. Increasing this number will increase the amount of time it takes to render the virtualizer, but might decrease the likelihood of seeing slow-rendering blank items at the top and bottom of the virtualizer when scrolling. The default value is 1.

"가시 영역 위아래에 렌더링할 아이템 수. 이 수를 늘리면 virtualizer 렌더링 시간이 증가하지만, 스크롤 시 상하단에 느리게 렌더링되는 빈 아이템이 보일 가능성이 줄어든다. 기본값은 1이다."

- **`overscan`**: 화면에 보이는 영역 바깥으로 미리 렌더링할 버퍼 아이템 수. 기본값 1은 위아래 각 1개씩 미리 렌더링한다.
- **높은 overscan**: 빠른 스크롤 시 빈 공간이 줄어드는 대신, DOM에 렌더링하는 아이템이 늘어나 렌더링 비용이 증가한다.
- **낮은 overscan**: DOM 요소가 적어 메모리·렌더링 비용은 낮지만, 빠른 스크롤 시 빈 공간이 더 자주 보인다.

```
overscan: 1 (기본)   → 위 1 + 화면 N + 아래 1 = N+2개 DOM 요소
overscan: 5          → 위 5 + 화면 N + 아래 5 = N+10개 DOM 요소
```

---

## 종합

대부분의 리스트에서 기본값 1로 충분하다. 각 아이템 렌더링이 무거운 컴포넌트(이미지, 복잡한 레이아웃)라면 overscan을 높여도 오히려 렌더링 시간이 길어질 수 있다. 먼저 `useFlushSync: true`(기본값)와 `overscan: 1`로 시작하고, 실제 스크롤 테스트에서 빈 공간이 눈에 띄면 overscan을 3~5 범위에서 조정하는 순서가 낫다.

---

---

# @tanstack/virtual의 getVirtualItems()는 무엇을 반환하는가?

## 도입

virtualizer에 `count`와 `estimateSize`를 입력으로 주면, 현재 스크롤 위치에서 실제로 렌더링해야 할 아이템 목록을 돌려주는 것이 `getVirtualItems()`다.

---

## 본문

> Returns the virtual items for the current state of the virtualizer.

"virtualizer의 현재 상태에 대한 가상 아이템들을 반환한다."

- **`getVirtualItems()`**: 현재 스크롤 위치에서 렌더링해야 할 `VirtualItem[]` 배열을 반환하는 메서드. 전체 `count`개가 아니라 화면에 보이는 범위 + overscan만 포함된다.
- 스크롤 이벤트마다 virtualizer가 내부적으로 재계산하여 다른 배열을 반환한다.

```
count: 10000
→ getVirtualItems() 반환: [VirtualItem(index:150), VirtualItem(index:151), ..., VirtualItem(index:170)]
   (화면에 ~20개 보인다고 가정)
→ DOM에는 이 20개만 존재
```

---

## 종합

`getVirtualItems()`는 virtualizer의 핵심 출력이다. 이 배열을 `.map()`으로 순회하며 각 `VirtualItem`의 `start`와 `size`를 CSS에 매핑하는 것이 가상 리스트 구현의 전부다. 스크롤하면 배열이 바뀌고, 바뀐 배열로 리렌더링이 일어나며, 화면에 보이는 아이템이 교체된다.

---

---

# @tanstack/virtual의 VirtualItem 객체는 어떤 정보를 담고 있으며, start와 size는 어떻게 사용하는가?

## 도입

`getVirtualItems()`가 돌려주는 각 요소가 `VirtualItem`이다. 이 객체는 "이 아이템을 어디에, 얼마나 크게 그려라"는 렌더링 지시를 담고 있다.

---

## 본문

> The VirtualItem object represents a single item returned by the virtualizer. It contains information you need to render the item in the coordinate space within your virtualizer's scrollElement and other helpful properties/functions.
>
> `start`: The starting pixel offset for the item. This is usually mapped to a css property or transform like top/left or translateX/translateY.
>
> `size`: The size of the item. This is usually mapped to a css property like width/height.

"VirtualItem 객체는 virtualizer가 반환한 단일 아이템을 나타낸다. virtualizer의 scrollElement 내 좌표 공간에서 아이템을 렌더링하는 데 필요한 정보와 유용한 프로퍼티/함수를 담고 있다. `start`는 아이템의 시작 픽셀 오프셋으로, 보통 `top/left` 또는 `translateX/translateY` 같은 CSS 속성에 매핑된다. `size`는 아이템의 크기로, 보통 `width/height` CSS 속성에 매핑된다."

- **`index`**: 전체 리스트에서의 인덱스. 실제 데이터 배열에서 해당 아이템을 꺼내는 데 사용한다.
- **`start`**: 스크롤 컨테이너 내부에서 이 아이템이 시작하는 픽셀 위치. `transform: translateY(${item.start}px)`로 포지셔닝한다.
- **`size`**: 이 아이템의 높이(또는 너비). `height: ${item.size}px`로 설정한다.

```jsx
// 세로 리스트 예시
{rowVirtualizer.getVirtualItems().map((virtualItem) => (
  <div
    key={virtualItem.index}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${virtualItem.size}px`,
      transform: `translateY(${virtualItem.start}px)`,
    }}
  >
    {items[virtualItem.index]}
  </div>
))}
```

---

## 종합

`VirtualItem`은 virtualizer가 계산한 좌표를 CSS로 번역하는 인터페이스다. virtualizer가 `start`와 `size`를 계산해주므로, 개발자는 이 값을 `position: absolute` 요소의 `transform`과 `height`에 넣기만 하면 된다. `index`로 실제 데이터를 꺼내고, `start`/`size`로 위치를 잡는 것이 패턴의 전부다.

---

---

# VirtualItem의 size는 언제 추정값이고 언제 실측값인가?

## 도입

가변 크기 리스트에서 `VirtualItem.size`는 두 단계를 거친다. DOM에 마운트되기 전에는 추정값이고, 마운트 후 측정하면 실측값으로 교체된다.

---

## 본문

> Before an item is measured with the VirtualItem.measureElement method, this will be the estimated size returned from your estimateSize virtualizer option. After an item is measured (if you choose to measure it at all), this value will be the number returned by your measureElement virtualizer option (which by default is configured to measure elements with getBoundingClientRect()).

"`VirtualItem.measureElement` 메서드로 아이템을 측정하기 전에는 `estimateSize` virtualizer 옵션이 반환한 추정 크기가 된다. 측정 후(측정하기로 선택한 경우)에는 `measureElement` virtualizer 옵션이 반환한 값(기본으로 `getBoundingClientRect()`로 요소를 측정하도록 구성됨)이 된다."

- **측정 전**: `estimateSize(index)`가 반환한 추정값.
- **측정 후**: `measureElement`(기본: `getBoundingClientRect()`)가 반환한 실제 DOM 크기.
- **고정 크기 리스트**: 측정이 불필요하다. `estimateSize`가 반환한 값이 곧 실측값과 동일하다.
- **가변 크기 리스트**: 아이템이 DOM에 마운트되는 시점에 `ref` 콜백으로 `measureElement`를 호출해 실측값으로 교체한다.

```jsx
// 가변 크기 - 마운트 시 측정
<div
  ref={(el) => {
    if (el) virtualizer.measureElement(el)
  }}
>
```

---

## 종합

고정 크기 리스트에서는 `size`가 항상 `estimateSize`의 반환값이다. 가변 크기 리스트에서는 스크롤하며 아이템이 처음 DOM에 나타날 때 측정이 일어나고, 그 시점에 `size`가 추정값에서 실측값으로 교체된다. 이 교체 시점에 `getTotalSize()`도 갱신되며 스크롤바 길이가 보정된다.

---

---

# @tanstack/virtual의 getTotalSize()는 무엇을 반환하며, 동적 측정 시 어떻게 변하는가?

## 도입

virtualizer가 스크롤바를 올바르게 표시하려면 전체 리스트의 총 높이를 컨테이너에 알려줘야 한다. `getTotalSize()`가 이 값을 제공한다.

---

## 본문

> Returns the total size in pixels for the virtualized items. This measurement will incrementally change if you choose to dynamically measure your elements as they are rendered.

"가상화된 아이템 전체의 총 크기(px)를 반환한다. 요소를 렌더링하면서 동적으로 측정하기로 선택한 경우, 이 측정값은 점진적으로 변한다."

- **`getTotalSize()`**: 가상화된 아이템 전체의 총 크기(px)를 반환하는 메서드. 이 값을 스크롤 컨테이너 내부 요소의 `height`로 설정하여 스크롤바 길이를 결정한다.
- **동적 측정 시**: `estimateSize` 추정값 기반으로 시작하여, `measureElement`로 아이템이 측정될 때마다 점진적으로 보정된다.

```jsx
// 스크롤 컨테이너 내부에 총 높이를 가진 wrapper
<div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
  {rowVirtualizer.getVirtualItems().map(...)}
</div>
```

---

## 종합

`getTotalSize()`가 반환하는 값이 스크롤 가능한 총 높이다. 이 값이 실제 아이템 합산 높이와 다르면 스크롤바가 어색하게 움직인다. 동적 측정이 진행될수록 이 값이 실측 기반으로 수렴하므로, 스크롤을 내려갈수록 스크롤바 위치가 미세하게 보정되는 것이 정상이다.

---

---

# @tanstack/virtual의 measureElement 옵션은 무엇이며, estimateSize와 어떤 관계인가?

## 도입

가변 크기 리스트에서 `estimateSize`만으로는 정확한 위치를 잡을 수 없다. 실제 DOM 요소가 렌더링된 후 크기를 측정하는 역할이 `measureElement`다.

---

## 본문

> This optional function is called when the virtualizer needs to dynamically measure the size (width or height) of an item. You can use `instance.options.horizontal` to determine if the width or height of the item should be measured.

"이 선택적 함수는 virtualizer가 아이템의 크기(너비 또는 높이)를 동적으로 측정해야 할 때 호출된다. `instance.options.horizontal`로 너비와 높이 중 어느 것을 측정해야 하는지 판단할 수 있다."

- **`measureElement`**: 아이템의 실제 DOM 크기를 동적으로 측정하는 선택적 함수. 기본 구현은 `getBoundingClientRect()`로 실제 DOM 크기를 측정한다.
- **`estimateSize`와의 관계**: `estimateSize`가 초기 추정값을 제공하고, `measureElement`가 렌더링 후 실측값으로 교체하는 한 쌍. 고정 크기 리스트에서는 `measureElement`가 필요 없다.

```
estimateSize: () => 100  →  초기 추정값 (DOM 렌더링 전)
     ↓ DOM 마운트 후 measureElement 호출
측정 결과: 143px         →  size가 100 → 143으로 교체
                             getTotalSize()도 그만큼 갱신
```

---

## 종합

`estimateSize`와 `measureElement`는 가변 크기 리스트의 2단계 크기 확정 흐름이다. 추정 → 실측 순서로 진행되며, 두 값의 차이가 크면 스크롤 위치가 점프한다. 추정값을 실제보다 크게 잡아두면 실측 후 위치가 좁혀지는 방향으로 보정되어 시각적으로 덜 눈에 띈다.
