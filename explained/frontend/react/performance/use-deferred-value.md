# `useDeferredValue`의 개념과 역할은?

## 도입

사용자가 검색창에 타이핑할 때 두 가지 업데이트가 동시에 발생한다 — input 값 갱신(즉각 반응 필요)과 검색 결과 렌더링(느려도 괜찮음). 두 업데이트를 같은 우선순위로 처리하면 무거운 결과 렌더링이 input 반응을 지연시킨다. `useDeferredValue`는 특정 값의 업데이트를 낮은 우선순위로 미뤄 이 문제를 해결한다.

---

## 본문

> useDeferredValue is a React Hook that lets you defer updating a part of the UI.

"useDeferredValue는 UI의 일부 업데이트를 지연할 수 있게 해주는 React Hook이다."

> During the initial render, the same as the value you provided.

"초기 렌더링 시에는 제공한 값과 동일하다."

> During updates, React will first attempt a re-render with the old value (so it will return the old value), and then try another re-render in the background with the new value (so it will return the updated value).

"업데이트 중에는, React가 먼저 이전 값으로 리렌더링을 시도하고(따라서 이전 값을 반환), 그런 다음 새 값으로 백그라운드에서 또 다른 리렌더링을 시도한다(따라서 업데이트된 값을 반환)."

- **defer**: 즉시 처리하지 않고 미룬다. 현재 렌더링이 완료될 때까지 새 값 반영을 기다린다.
- **background**: 사용자 이벤트(입력, 클릭)보다 낮은 우선순위로 실행되는 렌더링. 높은 우선순위 작업이 들어오면 중단된다.

```
query = "ab" 입력 시

1단계 (즉시): query="ab", deferredQuery="a"  → input 즉시 반영
2단계 (백그라운드): query="ab", deferredQuery="ab" → 결과 목록 업데이트
```

---

## 종합

`useDeferredValue`의 핵심은 "같은 상태 변화에서 두 가지 속도의 업데이트를 분리"하는 것이다. input은 즉시 반응하고, 무거운 결과 렌더링은 뒤따라온다. 이 분리가 없으면 무거운 컴포넌트가 있을 때 타이핑할 때마다 UI가 끊기는 janky 경험이 생긴다.

---

---

# `useDeferredValue`가 추가 리렌더링을 발생시키는데, `memo` 없이는 오히려 느려지지 않는가?

## 도입

`useDeferredValue`는 렌더링을 두 번 발생시킨다 — 이전 값으로 한 번, 새 값으로 한 번. 무거운 컴포넌트가 두 번 렌더링된다면 최적화가 아니라 오히려 역효과 아닌가? 이 의문의 답이 `memo`와의 필수 조합이다.

---

## 본문

> This optimization requires SlowList to be wrapped in memo.

"이 최적화는 SlowList가 memo로 감싸져야 한다."

> During that re-render, deferredText still has its previous value, so SlowList is able to skip re-rendering (its props have not changed).

"그 리렌더링 동안 deferredText는 여전히 이전 값을 가지므로, SlowList는 리렌더링을 건너뛸 수 있다(props가 변경되지 않았으므로)."

> Without memo, it would have to re-render anyway, defeating the point of the optimization.

"memo 없이는 어차피 리렌더링해야 하므로 최적화의 의미가 없어진다."

- **memo**: 컴포넌트를 `React.memo()`로 감싸면 props가 변경되지 않을 때 리렌더링을 건너뛴다.

동작 원리:

```
query 변경 → useDeferredValue 적용

1단계 렌더링 (즉각):
  query = "ab"          → input에 전달 → 렌더링
  deferredQuery = "a"   → SlowList에 전달
  SlowList: memo 덕분에 props("a")가 변하지 않았으므로 skip

2단계 렌더링 (백그라운드):
  deferredQuery = "ab"  → SlowList props 변경
  SlowList: 이번엔 props 변경됨 → 실제 리렌더링

결과: input은 즉시 반응, SlowList는 백그라운드에서 한 번만 렌더링
```

---

## 종합

`useDeferredValue`와 `memo`는 세트다. `memo` 없이는 두 단계 렌더링에서 SlowList가 두 번 모두 실행되어 최적화 효과가 없다. `memo`가 첫 번째 렌더링에서 SlowList를 건너뛰게 해주어야 두 번째(백그라운드) 렌더링만 실행되어 input 반응성이 보장된다.

---

---

# `useDeferredValue` 사용 시 Suspense 동작이 즉시 업데이트와 어떻게 다른가?

## 도입

`useDeferredValue`와 `<Suspense>`를 함께 쓰면 기존 Suspense 동작과 다른 UX가 만들어진다. query가 변경될 때 Suspense fallback으로 교체되는 대신 이전 결과를 유지한 채로 새 결과를 기다린다.

---

## 본문

```tsx
function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

> The query will update immediately, so the input will display the new value.

"query는 즉시 업데이트되므로 input에 새 값이 표시된다."

> However, the deferredQuery will keep its previous value until the data has loaded, so SearchResults will show the stale results for a bit.

"그러나 deferredQuery는 데이터가 로드될 때까지 이전 값을 유지하므로, SearchResults는 잠시 동안 stale 결과를 보여준다."

- **stale results**: 이전 쿼리의 오래된 결과. 새 데이터가 도착하기 전까지 화면에 유지된다. 빈 화면이나 spinner보다 더 나은 UX를 제공한다.

```
useDeferredValue 없이 query 변경 시:
  SearchResults suspend → Suspense fallback(Loading...) 표시 → 새 결과 도착 → 교체

useDeferredValue와 함께:
  deferredQuery 유지 → SearchResults 이전 결과 유지 (suspend 없음)
  백그라운드에서 새 query로 데이터 패칭
  새 결과 도착 → SearchResults 업데이트
```

---

## 종합

이 패턴은 "skeleton이나 spinner 대신 이전 콘텐츠를 유지하며 로딩하는" UX를 만든다. query가 바뀔 때마다 화면이 깜빡이는(fallback 전환) 대신 이전 결과가 자연스럽게 유지된다. 없으면 Suspense fallback이 매 query 변경마다 활성화되어 화면이 끊기는 느낌을 준다.

---

---

# 렌더링 중 생성한 객체를 `useDeferredValue`에 전달하면 안 되는 이유는?

## 도입

`useDeferredValue`에 전달하는 값이 렌더링마다 새로 생성되는 객체라면, 이전 값과 새 값의 비교(Object.is)가 항상 다르다고 판정되어 불필요한 백그라운드 리렌더링이 계속 발생한다.

---

## 본문

> The values you pass to useDeferredValue should either be primitive values (like strings and numbers) or objects created outside of rendering.

"useDeferredValue에 전달하는 값은 원시값(string, number 등)이거나 렌더링 바깥에서 생성된 객체여야 한다."

> If you create a new object during rendering and immediately pass it to useDeferredValue, it will be different on every render, causing unnecessary background re-renders.

"렌더링 중에 새 객체를 생성하여 useDeferredValue에 즉시 전달하면, 매 렌더마다 다른 객체가 되어 불필요한 백그라운드 리렌더링을 유발한다."

- **different on every render**: `const options = { query }` 처럼 렌더링 중 객체를 만들면 매 렌더마다 새 참조가 생긴다. Object.is 비교에서 항상 다르다고 판정된다.
- **unnecessary background re-renders**: 실제 값은 같은데 참조만 달라 매 렌더마다 백그라운드 리렌더링이 트리거된다. 최적화 의도와 정반대 결과다.

```
잘못된 패턴
function Component({ query }) {
  const options = { query }; // 렌더마다 새 객체
  const deferredOptions = useDeferredValue(options); // 항상 다른 참조 → 항상 background re-render

올바른 패턴
function Component({ query }) {
  // 원시값 직접 전달
  const deferredQuery = useDeferredValue(query);
  const options = { query: deferredQuery }; // deferred 값 기반으로 파생
```

---

## 종합

`useDeferredValue`는 Object.is로 이전/새 값을 비교해 변경 여부를 판단한다. 원시값(string, number, boolean)은 값 비교가 되어 안전하다. 객체는 참조 비교가 되므로 렌더링 중 생성된 객체는 내용이 같아도 항상 "변경됨"으로 판정되어 의도치 않은 성능 저하를 만든다.

---

---

# `useDeferredValue`는 백그라운드 리렌더링과 중단을 어떻게 관리하는가?

## 도입

`useDeferredValue`가 백그라운드에서 리렌더링을 진행하는 중에 값이 또 변경되면 어떻게 되는가? 이전 백그라운드 렌더링을 기다려야 하는가, 아니면 새로 시작하는가?

---

## 본문

> When useDeferredValue receives a different value (compared with Object.is), in addition to the current render (when it still uses the previous value), it schedules a re-render in the background with the new value.

"useDeferredValue가 다른 값을 받으면(Object.is 비교 기준), 현재 렌더링(이전 값 사용)에 추가로 새 값으로 백그라운드 리렌더링을 예약한다."

> You can think of it as happening in two steps:
> First, React re-renders with the new query ("ab") but with the old deferredQuery (still "a").

"두 단계로 일어난다고 생각할 수 있다: 먼저, React가 새 query("ab")로 리렌더링하지만 deferredQuery는 이전 값("a")을 유지한다."

> In the background, React tries to re-render with both query and deferredQuery updated to "ab". If this re-render completes, React will show it on the screen.

"백그라운드에서, React는 query와 deferredQuery 모두 "ab"로 업데이트하여 리렌더링을 시도한다. 이 리렌더링이 완료되면 React는 화면에 표시한다."

- **schedules**: 즉시 실행이 아닌 예약. 현재 높은 우선순위 작업(사용자 입력)이 없을 때 실행된다.
- **if this re-render completes**: "완료되면"이라는 조건이 중요하다. 중단될 수도 있다.

```
"a" 입력 → 백그라운드: deferredQuery="a" 렌더링 시작
"ab" 입력 → 이전 백그라운드 렌더링 중단 → 새 백그라운드: deferredQuery="ab" 시작
"abc" 입력 → 또 중단 → 새 백그라운드: deferredQuery="abc" 시작
```

---

## 종합

백그라운드 리렌더링이 인터럽트 가능하다는 점이 `useDeferredValue`의 핵심 장점이다. 빠른 타이핑 중에는 백그라운드 렌더링이 계속 중단되고 새로 시작되며, 타이핑이 멈추면 그때서야 최종 값으로 백그라운드 렌더링이 완료된다. 사용자는 타이핑 중 UI 끊김 없이 빠른 반응을 얻고, 결과는 자연스럽게 따라온다.

---

---

# `useDeferredValue`를 사용하면 서버 API 호출 수가 줄어드는가?

## 도입

`useDeferredValue`가 렌더링을 미룬다면 API 호출도 줄어드는 것으로 오해할 수 있다. 실제로는 렌더링 미루기와 네트워크 요청 미루기는 다른 개념이다.

---

## 본문

> useDeferredValue does not by itself prevent extra network requests.

"useDeferredValue는 그 자체로는 추가 네트워크 요청을 방지하지 않는다."

> Note that there is still a network request per each keystroke.

"여전히 각 키 입력마다 네트워크 요청이 있다."

> What's being deferred here is displaying results (until they're ready), not the network requests themselves.

"여기서 지연되는 것은 (준비될 때까지) 결과를 표시하는 것이지, 네트워크 요청 자체가 아니다."

- **displaying results**: 화면에 렌더링되는 시점을 미루는 것. 데이터 요청은 여전히 즉시 발생한다.
- **not the network requests themselves**: API 호출 타이밍과 렌더링 타이밍은 분리된다. `useDeferredValue`는 렌더링만 제어한다.

```
네트워크 요청 vs 렌더링

useDeferredValue 없음:
  타이핑 → API 호출 → 결과 도착 → 즉시 렌더링

useDeferredValue 있음:
  타이핑 → API 호출 → 결과 도착 → 렌더링 (지연 후)

네트워크 요청 횟수: 동일
```

---

## 종합

API 호출 수를 줄이려면 디바운싱을 사용해야 한다. `useDeferredValue`는 "결과가 도착해도 화면을 즉시 업데이트하지 않는" 렌더링 최적화다. 네트워크 최적화와 렌더링 최적화는 서로 다른 문제이며, 필요하다면 두 기법을 함께 적용할 수 있다.

---

---

# `useDeferredValue`의 기본 타임아웃은 몇 밀리초인가?

## 도입

디바운싱은 "N밀리초 후에 실행"이라는 고정 지연이 있다. `useDeferredValue`도 비슷하게 내부적으로 고정 타임아웃이 있는지가 자연스러운 질문이다.

---

## 본문

> There is no fixed delay caused by useDeferredValue itself.

"useDeferredValue 자체가 유발하는 고정된 지연은 없다."

`useDeferredValue`는 고정 밀리초가 아니라 기기의 렌더링 속도에 따라 동적으로 동작한다.

- 빠른 기기: 백그라운드 렌더링이 거의 즉시 완료되어 지연이 눈에 띄지 않는다.
- 느린 기기: 렌더링에 시간이 걸리는 만큼 지연이 늘어난다.

```
디바운싱 (고정 지연)         useDeferredValue (적응형 지연)
────────────────────         ──────────────────────────────
"300ms 기다린 뒤 실행"       "렌더링이 끝나면 즉시 표시"
기기 속도와 무관             빠른 기기 → 거의 즉시
항상 같은 지연 발생          느린 기기 → 자동으로 더 길게 대기
```

---

## 종합

`useDeferredValue`의 "지연"은 실제로 "백그라운드 렌더링에 걸리는 시간"이다. 고정 타임아웃이 없기 때문에 기기 성능에 자동 적응한다. 빠른 기기 사용자는 거의 즉시 결과를 보고, 느린 기기 사용자는 타이핑 반응성을 잃지 않으면서 결과가 천천히 따라온다.

---

---

# 느린 컴포넌트를 `useDeferredValue`로 감싸면 렌더링이 빨라지는가?

## 도입

`useDeferredValue`가 무거운 컴포넌트의 렌더링을 미룬다면, 그 컴포넌트의 실제 렌더링 시간도 줄어드는가? 아니면 단순히 나중에 실행될 뿐인가?

---

## 본문

> useDeferredValue lets you prioritize updating the input (which must be fast) over updating the result list (which is allowed to be slower).

"useDeferredValue는 (빠라야 하는) input 업데이트를 (느려도 괜찮은) 결과 목록 업데이트보다 우선순위를 높이게 해준다."

> This does not make re-rendering of the SlowList faster.

"이것은 SlowList의 리렌더링을 더 빠르게 만들지 않는다."

> However, it tells React that re-rendering the list can be deprioritized so that it doesn't block the keystrokes.

"그러나 React에게 목록 리렌더링의 우선순위를 낮출 수 있다고 알려 키 입력을 블로킹하지 않도록 한다."

> The list will "lag behind" the input and then "catch up".

"목록은 input보다 '뒤처지다가' 나중에 '따라잡는다'."

- **deprioritized**: 우선순위를 낮춘다. 더 빨리 실행되는 게 아니라 낮은 우선순위로 뒤로 밀린다.
- **lag behind**: 의도적인 지연. 이 지연이 input 반응성을 보호한다.

```
실제 렌더링 시간 비교

SlowList 렌더링 시간: 100ms (변화 없음)

useDeferredValue 없음:
  타이핑 → SlowList 100ms 렌더링 (input 블로킹)
  → input이 100ms 동안 반응 없음 (janky)

useDeferredValue 있음:
  타이핑 → input 즉시 반응 (1ms)
  → 백그라운드: SlowList 100ms 렌더링 (input 비블로킹)
  → SlowList 완료 후 화면 갱신
```

---

## 종합

`useDeferredValue`는 무거운 컴포넌트를 더 빠르게 만드는 게 아니라, 그 무게가 사용자 인터랙션을 방해하지 못하게 분리하는 것이다. 실제 렌더링 비용이 줄지 않으므로, 컴포넌트 자체의 성능을 개선하려면 `memo`, 가상화(react-window), 계산 최적화 등 다른 접근이 필요하다.

---

---

# 무거운 deferred 렌더링이 메인 스레드를 점유하면 다음 키 입력이 지연되지 않는가?

## 도입

JavaScript는 싱글 스레드다. 백그라운드 리렌더링이 100ms짜리 작업이라면 그 100ms 동안 메인 스레드가 점유되어 다음 키 입력이 처리되지 않는 것 아닌가?

---

## 본문

> The background re-render is interruptible: if there's another update to the value, React will restart the background re-render from scratch.

"백그라운드 리렌더링은 인터럽트 가능하다: 값에 또 다른 업데이트가 있으면, React는 백그라운드 리렌더링을 처음부터 재시작한다."

> For example, if the user is typing into an input faster than a chart receiving its deferred value can re-render, the chart will only re-render after the user stops typing.

"예를 들어, 사용자가 차트가 deferred 값으로 리렌더링할 수 있는 속도보다 빠르게 input에 타이핑하면, 차트는 사용자가 타이핑을 멈춘 후에만 리렌더링된다."

> Any updates caused by events (like typing) will interrupt the background re-render and get prioritized over it.

"이벤트(타이핑 등)로 인한 업데이트는 백그라운드 리렌더링을 중단시키고 우선순위를 가진다."

- **interruptible**: Concurrent React의 핵심 특성. 백그라운드 렌더링은 고정 블록이 아니라 React가 중간에 끊을 수 있다. OS의 선점형 스케줄링과 유사하다.
- **restart from scratch**: 중단된 렌더링을 이어받지 않고 새 값으로 처음부터 시작한다.

```
빠른 타이핑 시나리오

"a" → 백그라운드 렌더링 시작 (진행 중...)
"ab" → 백그라운드 중단 → input 즉시 반응 → 새 백그라운드 시작
"abc" → 또 중단 → input 즉시 반응 → 새 백그라운드 시작
[타이핑 멈춤]
"abc" 백그라운드 렌더링 완료 → 화면 갱신
```

---

## 종합

Concurrent React의 인터럽트 가능한 렌더링 덕분에 백그라운드 렌더링이 진행 중이어도 사용자 이벤트가 즉시 처리된다. 빠른 타이핑 중에는 백그라운드 렌더링이 계속 폐기되고 재시작된다 — 결국 타이핑이 멈춘 뒤에야 백그라운드 렌더링이 완료된다. 이것이 `useDeferredValue`가 janky 경험 없이 작동하는 이유다.

---

---

# `useDeferredValue`는 디바운싱이나 쓰로틀링과 어떻게 다른가?

## 도입

검색창 최적화에서 디바운싱과 쓰로틀링은 이미 익숙한 패턴이다. `useDeferredValue`도 비슷한 효과를 내는 것처럼 보이지만 동작 방식이 근본적으로 다르다. 언제 어떤 기법을 써야 하는지를 알아야 한다.

---

## 본문

> Debouncing means you'd wait for the user to stop typing (e.g. for a second) before updating the list.

"디바운싱은 목록을 업데이트하기 전에 사용자가 타이핑을 멈출 때까지(예: 1초) 기다리는 것이다."

> Throttling means you'd update the list every once in a while (e.g. at most once a second).

"쓰로틀링은 일정 간격으로(예: 최대 초당 한 번) 목록을 업데이트하는 것이다."

> While these techniques are helpful in some cases, useDeferredValue is better suited to optimizing rendering because it is deeply integrated with React itself and adapts to the user's device.

"이 기법들이 일부 경우에는 유용하지만, useDeferredValue는 React 자체에 깊이 통합되어 있고 사용자 기기에 적응하기 때문에 렌더링 최적화에 더 적합하다."

> Unlike debouncing or throttling, it doesn't require choosing any fixed delay.

"디바운싱이나 쓰로틀링과 달리, 고정 지연을 선택할 필요가 없다."

> Also, unlike with debouncing or throttling, deferred re-renders done by useDeferredValue are interruptible by default.

"또한, 디바운싱이나 쓰로틀링과 달리, useDeferredValue로 수행되는 지연 리렌더링은 기본적으로 인터럽트 가능하다."

> By contrast, debouncing and throttling still produce a janky experience because they're blocking: they merely postpone the moment when rendering blocks the keystroke.

"반대로, 디바운싱과 쓰로틀링은 여전히 끊기는 경험을 만든다. 왜냐하면 그것들은 블로킹이기 때문이다: 단순히 렌더링이 키 입력을 블로킹하는 시점을 미룰 뿐이다."

세 기법 비교:

```
                 디바운싱/쓰로틀링      useDeferredValue
──────────────── ─────────────────      ─────────────────
지연 방식        고정 밀리초            기기 속도에 자동 적응
인터럽트 가능    없음 (블로킹)          있음 (Concurrent)
렌더링 블로킹    실행 시 블로킹 발생    인터럽트로 블로킹 방지
네트워크 요청    줄일 수 있음           줄이지 않음
적합한 경우      API 호출 최적화        렌더링 최적화
```

> If the work you're optimizing doesn't happen during rendering, debouncing and throttling are still useful. For example, they can let you fire fewer network requests. You can also use these techniques together.

"최적화하는 작업이 렌더링 중에 발생하지 않는다면, 디바운싱과 쓰로틀링은 여전히 유용하다. 예를 들어, 더 적은 네트워크 요청을 발생시킬 수 있다. 이 기법들을 함께 사용할 수도 있다."

---

## 종합

세 기법의 사용 기준은 "무엇을 최적화하는가"다. API 호출 수를 줄이려면 디바운싱, 무거운 렌더링이 input을 블로킹하는 문제를 해결하려면 `useDeferredValue`가 맞다. 두 문제가 동시에 있다면 디바운싱으로 API 호출을 제어하고 `useDeferredValue`로 렌더링 블로킹을 방지하는 방식으로 함께 사용할 수 있다.
