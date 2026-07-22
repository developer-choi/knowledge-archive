# 커스텀 훅 중 어떤 훅에 독립 테스트가 필요한가?

> And I'm not talking about the one-off custom hook you pull out just to make your component body smaller and organize your code (those should be covered by your component tests),

"한 컴포넌트를 더 작게 정리하려고 잠깐 빼낸 일회성 훅 얘기가 아니다 — 그런 건 그 컴포넌트의 테스트가 이미 커버한다."

- **one-off**: 딱 한 곳에서만 쓰려고 만든, 일회성이라는 뜻. 어떤 컴포넌트의 로직이 길어져서 가독성을 위해 `useSomething`으로 잘라낸 경우가 이에 해당한다.
- **covered by your component tests**: 그 훅을 쓰는 컴포넌트를 테스트하면, 훅의 로직도 그 안에서 같이 실행되므로 자연히 검증된다. 훅만 따로 떼어 테스트를 또 쓸 필요가 없다는 것.

> I'm talking about that reusable hook you've published to github/npm.

"내가 말하는 건, github/npm에 배포한 그 재사용 훅이다."

- **reusable / published**: 여러 프로젝트·여러 컴포넌트에서 쓰이도록 만든 훅. 이 훅은 특정 컴포넌트에 매여 있지 않아서, "이 훅을 쓰는 컴포넌트" 하나만으로는 전체 동작이 검증되지 않는다. 그래서 훅 자체에 독립 테스트가 필요하다.

---

# 재사용 커스텀 훅은 구체적으로 어떻게 테스트하는가?

## 본문

> if you were to test this manually, rather simply calling the function, you'd probably write a component that uses the hook, and then interact with that component rendered to the page (perhaps using storybook).

"이걸 수동으로 테스트한다면, 함수를 그냥 호출하는 대신, 그 훅을 쓰는 컴포넌트를 하나 작성하고, 페이지에 렌더된 그 컴포넌트와 상호작용하게 될 것이다(스토리북을 쓸 수도 있고)."

- **rather than simply calling the function**: 훅을 평범한 함수처럼 `useUndo()`라고 부르지 않는다는 뜻. React 훅은 컴포넌트 안에서만 호출할 수 있어, 컴포넌트 없이 그냥 함수처럼 부르면 규칙 위반이다(그 이유는 `renderHook` 질문에서 짧게 짚는다).
- **write a component that uses the hook**: 훅을 안에서 호출하는 작은 컴포넌트를 하나 만든다. 훅을 실제로 살려서 돌릴 무대를 마련하는 것이다.
- **interact with that component**: 사용자가 하듯 버튼을 누르고 값을 입력하면서, 화면에 나타나는 결과로 훅이 잘 도는지 확인한다.

자동차 브레이크 부품이 멀쩡한지 확인하려면, 손에 든 부품을 아무리 뜯어봐도 알 수 없다. 차에 장착하고 실제로 브레이크를 밟아봐야 안다. 재사용 훅도 마찬가지다 — 컴포넌트라는 차에 끼워 넣고, 사용자처럼 눌러보며 화면 반응으로 검증한다.

---

## 종합

재사용 훅을 테스트하는 방식은 "함수를 호출해 반환값을 본다"가 아니라 "훅을 쓰는 컴포넌트를 만들어 렌더하고, 사용자처럼 상호작용하며 화면 결과를 검증한다"이다. 왜 그냥 호출하면 안 되는지(훅은 순수 함수가 아니라 컴포넌트 안에서만 호출 가능 — 컴포넌트 없이 직접 호출하면 Invalid hook call)는 `renderHook` 질문에서 짧게 짚는다. 이 컴포넌트 방식이 어떤 약점을 낳고 어떻게 보완하는지는 다음 질문이 다룬다.

---

# 훅을 쓰는 실제 컴포넌트를 만들어 테스트하는 방식은 어떤 약점이 있고, 이를 어떻게 보완할 수 있는가?

## 도입

여기까지의 결론은 "훅을 쓰는 실제 컴포넌트를 만들어 렌더하고 상호작용하라"였다. 그런데 이 방식도 완벽하진 않다. 이 부분이 이 주제에서 가장 소화하기 어려운 대목이다 — 약점이 두 가지 있고, 그것을 우회하는 보완책이 하나 나오기 때문이다.

---

## 본문

> However, sometimes the component that you need to write is pretty complicated and you end up getting test failures not because the hook is broken, but because the example you wrote is [broken] which is pretty frustrating.

"하지만 때로는 작성해야 하는 컴포넌트가 꽤 복잡해서, 훅이 고장 나서가 아니라 당신이 쓴 예시가 고장 나서 테스트가 실패하게 된다 — 이건 꽤 짜증나는 일이다."

- **the component ... is pretty complicated**: 훅의 동작을 보여주려고 만든 예시 컴포넌트 자체가 복잡해질 수 있다. 버튼·입력·표시 로직을 다 짜 넣어야 하니까.
- **not because the hook is broken, but because the example ... is broken**: 이게 첫 번째 약점이다. 테스트가 실패했는데 원인이 훅이 아니라 내가 만든 예시 컴포넌트일 수 있다. 정작 검증 대상(훅)은 멀쩡한데 곁다리(예시)가 문제라 원인 파악이 헷갈린다.

> That problem is compounded by another one. In some scenarios sometimes you have a hook that can be difficult to create a single example for all the use cases it supports so you wind up making a bunch of different example components to test.

"그 문제는 또 다른 문제로 가중된다. 어떤 훅은 지원하는 모든 사용 사례를 하나의 예시로 만들기 어려워서, 결국 여러 개의 서로 다른 예시 컴포넌트를 만들게 된다."

- **compounded**: 앞의 문제 위에 더해져 악화된다는 뜻.
- **a bunch of different example components**: 두 번째 약점이다. 훅이 여러 기능을 지원하면 예시 하나로 다 못 담아, 사용 사례마다 예시 컴포넌트를 여러 개 만들어야 한다. 테스트 준비 비용이 불어난다.

> Now, having those example components is probably a good idea anyway (they're great for storybook for example), but sometimes it can be nice to create a little helper that doesn't actually have any UI associated with it and you interact with the hook return value directly.

"사실 그런 예시 컴포넌트를 갖는 것 자체는 대체로 좋은 일이지만(스토리북에 훌륭하다), 때로는 UI가 전혀 없는 작은 헬퍼를 만들어 훅의 반환값과 직접 상호작용하는 편이 나을 수 있다."

- **a little helper that doesn't ... have any UI**: 보완책이다. 버튼도 화면 표시도 없는, 눈에 보이는 UI가 하나도 없는 작은 도우미. 흔히 `setup`이라는 이름의 함수로 만든다.
- **interact with the hook return value directly**: 버튼을 눌러 간접적으로가 아니라, 훅이 돌려준 값과 함수를 코드에서 직접 만지며 테스트한다.

이 UI 없는 헬퍼는 구체적으로 이렇게 생겼다. 내부에 아주 작은 `TestComponent`를 정의하고, 그 안에서 훅을 호출한 뒤 반환값을 바깥의 평범한 객체에 복사한다(예: `Object.assign(returnVal, useUndo(...))`). 그리고 컴포넌트는 `return null`로 아무것도 그리지 않는다.

```
setup() 헬퍼
   ┌──────────────────────────────────────┐
   │ const returnVal = {}                  │
   │ function TestComponent() {            │  ← UI 없는 임시 컴포넌트
   │   Object.assign(returnVal,            │
   │       useUndo('one'))                 │  ← 훅 반환값을 객체로 복사
   │   return null                         │  ← 화면에 아무것도 안 그림
   │ }                                     │
   │ render(<TestComponent />)             │
   │ return returnVal                      │  ← 테스트가 이 객체를 쥔다
   └──────────────────────────────────────┘
```

`render` 이후 테스트는 이 객체(`undoData`)를 손에 쥐고, 값을 직접 읽고(`undoData.canUndo`) 훅이 돌려준 함수를 직접 부른다(`undoData.set('two')`). 버튼 클릭 같은 사용자 이벤트를 거치지 않고 함수를 직접 호출하기 때문에, 그런 호출 하나하나를 `act(() => ...)`로 감싸야 한다. 그래야 React가 그 호출로 생긴 상태 변경을 다음 단언 전에 실제로 반영한다. `act`가 렌더·이벤트 직후 밀린 업데이트를 모두 반영시키는 역할이라는 일반 설명은 형제 문서 `explained/frontend/testing/act.md`에 있으니 여기서는 짧게만 짚는다 — 요점은, 사용자 이벤트(RTL의 `userEvent`)를 쓰면 그 안에서 `act`가 자동으로 걸리지만, 여기서는 훅 반환 함수를 맨손으로 직접 부르므로 자동으로 걸릴 계기가 없어 **직접** 감싸줘야 한다는 것이다.

인형이 잘 움직이는지 보려고 버튼과 화면 표시까지 갖춘 인형극 무대를 통째로 짓는 대신, 인형을 손에 바로 얹고 직접 조종해보는 것과 같다.

---

## 종합

실제 예시 컴포넌트 방식의 약점은 두 가지다. 하나는 예시가 복잡하면 훅이 아니라 예시 때문에 테스트가 실패해 원인이 헷갈리는 것, 다른 하나는 사용 사례가 많은 훅은 예시 컴포넌트를 여러 개 만들어야 하는 것이다. 보완책은 UI가 전혀 없는 `setup` 헬퍼다 — 훅을 호출해 반환값을 객체에 복사하고 `return null`로 아무것도 그리지 않는 임시 컴포넌트를 렌더한 뒤, 테스트가 그 반환 객체의 값을 직접 읽고 함수를 직접 부른다. 다만 직접 호출한 상태 변경은 사용자 이벤트를 거치지 않으므로 `act`로 감싸 반영시켜야 한다. 화면을 통해 간접 검증하는 대신 훅이 내놓은 값을 손으로 직접 만지는 방식이라 예시가 복잡해지는 문제를 피한다.

---

# renderHook은 어떤 문제 때문에 등장했으며, 내부적으로 하는 일은 무엇인가?

## 도입

이 질문의 핵심은 `renderHook`이라는 API를 맥락 없이 단독으로 외우는 게 아니라, **문제가 해결책을 낳고 그 해결책이 다시 다음 문제를 낳는 흐름**을 이해하는 데 있다. 지금까지의 내용을 되짚으면 이미 그 흐름의 앞부분이 지나갔다. 그 끝에서 `renderHook`이 자연스럽게 나타난다. (`renderHook`의 API 사용법 자체 — `result.current`, `initialProps`, `rerender` — 는 형제 문서 `knowledge/frontend/testing/hook/render-hook.md`가 다루니 여기서는 "왜 존재하는가"만 본다.)

---

## 본문

지금까지의 흐름을 먼저 정리하면 이렇다.

```
① 훅은 컴포넌트 안에서만 호출 가능 — 컴포넌트 없이 직접 호출하면 Invalid hook call
        │  해결
        ▼
② 훅을 쓰는 실제 예시 컴포넌트를 만들어 렌더한다
        │  그런데 예시가 복잡→훅 아닌 예시 탓에 실패·사용사례마다 예시가 늘어남
        ▼
③ UI 없는 setup 헬퍼로 훅 반환값을 직접 만진다 (act 필요)
        │  그런데 setup 헬퍼 자체가 또 복잡해진다 ↓
        ▼
④ renderHook  ← setup 헬퍼를 완성된 도구로 만든 것
```

흐름의 출발점 ①을 조금 더 풀면 이렇다. 커스텀 훅은 겉보기엔 그냥 함수지만 순수 함수가 아니다. React 훅은 컴포넌트 안(또는 다른 훅 안)에서만 호출하도록 규칙이 정해져 있어, 테스트 파일에서 `useUndo()`처럼 컴포넌트 없이 그냥 부르면 "Invalid hook call" 오류가 난다. 그렇다고 `useState`·`useEffect` 같은 내장 훅을 mock해 함수처럼 우회하는 것도 답이 아니다 — 훅이 실제 React 안에서 제대로 도는지에 대한 신뢰를 통째로 버리는 짓이기 때문이다. 그래서 ②처럼 훅을 진짜로 호출해줄 컴포넌트가 필요해진다.

> Now, sometimes you have more complicated hooks where you need to wait for mocked HTTP requests to finish, or you want to "rerender" the component that's using the hook with different props etc.

"이제, 더 복잡한 훅에서는 mock된 HTTP 요청이 끝나길 기다려야 하거나, 훅을 쓰는 컴포넌트를 다른 props로 '리렌더'하고 싶을 때가 있다."

- **wait for mocked HTTP requests**: 훅이 비동기로 데이터를 불러오면, 그 (가짜) 요청이 끝날 때까지 기다렸다가 결과를 검증해야 한다. `setup` 헬퍼에 이 대기 로직을 직접 넣어야 한다.
- **rerender ... with different props**: 훅에 넘기는 props를 바꿔 다시 실행해보고 싶을 수 있다(예: `useEffect` 의존성이 바뀔 때 동작 확인). 이것도 헬퍼에 직접 구현해야 한다.

> Each of these use cases complicates your setup function or your real world example which will make it even more domain-specific and difficult to follow.

"이런 사용 사례 하나하나가 당신의 setup 함수나 실제 예시를 복잡하게 만들고, 그 결과 더 특정 상황에만 맞는, 따라가기 어려운 코드가 된다."

- **complicates your setup function**: 세 번째 약점이다. ③에서 만든 `setup` 헬퍼가 대기·리렌더·정리 로직을 떠안으면서 스스로 덩치가 커진다.
- **domain-specific and difficult to follow**: 그 헬퍼가 특정 훅에만 맞는 일회성 코드로 굳어 재사용도 안 되고 읽기도 어려워진다.

> This is why renderHook from @testing-library/react exists.

"바로 이래서 @testing-library/react의 renderHook이 존재한다."

- **this is why ... exists**: `renderHook`은 방금 그 문제 — 매번 손으로 짜는 `setup` 헬퍼가 복잡해지는 문제 — 를 해결하려고 만들어진, `setup` 헬퍼를 이미 완성해 놓은 도구다. 대기용 async 유틸, props를 바꿔 다시 실행하는 `rerender`, 정리(cleanup) 검증을 위한 `unmount` 같은 도구를 함께 제공한다. 이걸 매번 직접 만들면 실수하기 쉬운 반복 코드가 된다.

> Under the hood, @testing-library/react is doing something very similar to our original setup function above.

"내부적으로 @testing-library/react는 위에서 만든 원래 setup 함수와 매우 비슷한 일을 한다."

- **under the hood**: 겉으로 드러난 API 뒤, 내부 구현. `renderHook`은 마법이 아니라, 우리가 손으로 짰던 그 `setup` 헬퍼와 본질적으로 같은 일 — 훅을 부르는 UI 없는 임시 컴포넌트를 만들어 `render`로 마운트하고 반환값을 꺼내주는 일 — 을 한다.

---

## 종합

`renderHook`은 이 흐름의 자연스러운 종착점이다. ① 훅을 직접 못 부르니 → ② 실제 예시 컴포넌트를 만들고, ② 예시가 복잡해 훅 아닌 예시 탓에 실패하거나 예시가 여러 개로 늘어나니 → ③ UI 없는 `setup` 헬퍼로 반환값을 직접 만지고(그래서 `act`가 필요하고), ③ 그 헬퍼조차 비동기 대기·props 리렌더·정리 검증을 떠안아 복잡해지니 → ④ 그것을 완성된 도구로 만든 `renderHook`이 나온다. 내부적으로는 우리가 손으로 짠 `setup`과 똑같이 UI 없는 임시 컴포넌트를 렌더할 뿐이며, 거기에 `rerender`·`unmount`·async 유틸을 얹어 매번 반복하던 코드를 없앤다. 원문의 결론은 균형 잡혀 있다 — 단순한 훅이라면 실제 예시 컴포넌트가 읽기 쉬움과 사용 사례 커버 사이의 가장 좋은 절충이고, `renderHook`은 더 복잡한 훅에서 제값을 한다.
