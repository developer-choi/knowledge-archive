# [UNVERIFIED] 디바운싱과 스로틀링은 무엇이며 왜 사용하는가?

## 도입

스크롤, 리사이즈, 키입력처럼 짧은 시간 안에 수백 번 발생하는 이벤트가 있다. 매 이벤트마다 핸들러를 실행하면 불필요한 연산이 쌓여 성능이 떨어진다. 디바운싱과 스로틀링은 이 실행 횟수를 줄이는 기법이다.

---

## 본문

디바운싱과 스로틀링은 OA 없이 실무 원칙으로 정리한다.

고빈도 이벤트 핸들러를 그대로 연결하면 브라우저의 메인 스레드가 과부하될 수 있다. JS는 싱글 스레드이므로 이벤트 핸들러가 메인 스레드를 오래 점유하면 렌더링과 사용자 인터랙션이 차단된다.

```js
// 스로틀 예시 — 100ms마다 최대 1번 실행
function throttle(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

window.addEventListener('scroll', throttle(() => {
  console.log('scroll position:', window.scrollY);
}, 100));

// 디바운스 예시 — 마지막 호출 후 300ms가 지나야 실행
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

input.addEventListener('input', debounce((e) => {
  checkDuplicate(e.target.value);
}, 300));
```

---

## 종합

디바운싱과 스로틀링이 없으면 이벤트 핸들러가 초당 수십~수백 번 실행된다. 스크롤마다 API를 호출하거나 키입력마다 DOM을 업데이트하면 네트워크와 렌더링 비용이 폭발적으로 증가한다. Lodash의 `_.debounce`와 `_.throttle`, React Query의 `enabled` 조건, 또는 Intersection Observer처럼 OS/브라우저 레벨에서 최적화된 API를 활용하면 직접 구현 없이도 같은 효과를 얻을 수 있다.

---

---

# [UNVERIFIED] 디바운싱과 스로틀링의 차이는?

## 도입

두 기법 모두 실행 횟수를 줄이지만 "어느 시점의 호출을 살리는가"가 다르다. 디바운스는 입력이 멈춘 뒤 한 번, 스로틀은 입력이 이어지는 동안 일정 간격마다 한 번씩 실행한다.

---

## 본문

- **Debounce**: 연속 호출 중 타이머를 계속 리셋한다. 호출이 멈추고 딜레이가 지나야 마지막 호출 하나만 실행된다. "마지막 입력만 유효하다"는 의미.
- **Throttle**: 타이머가 실행 중이면 새 호출을 무시한다. 딜레이가 지나면 다음 호출을 허용한다. "일정 주기마다 실행한다"는 의미.

```
이벤트 발생: ─●─●─●─●─────●─●─●
              1 2 3 4     5 6 7

Debounce (300ms):         ───────────────●───────●
                                        4(마지막)  7(마지막)

Throttle (100ms): ─●───●───●───●───●───●
                   1   3   5   ...  (주기마다 1개)
```

---

## 종합

디바운스는 "사용자가 입력을 끝냈을 때" 처리하고 싶은 경우에 적합하다. 스로틀은 "진행 중에도 주기적으로 처리해야 할 때" 적합하다. 두 기법을 혼동하면 의도한 것과 반대의 UX가 나올 수 있다 — 스크롤에 디바운스를 쓰면 스크롤이 끝나고 나서야 반응해서 늦게 느껴지고, 아이디 중복 검사에 스로틀을 쓰면 입력 중간에 계속 API가 호출된다.

---

---

# [UNVERIFIED] 무한 스크롤 구현에 디바운싱과 스로틀링 중 어느 것이 적합한가?

## 도입

무한 스크롤을 스크롤 이벤트로 구현하면 핸들러가 초당 수십 번 발화한다. 두 기법 중 어느 쪽을 써야 하는지는 "언제 임계점 감지를 해야 하는가"로 판단한다.

---

## 본문

스크롤 이벤트 기반 무한 스크롤의 핵심 로직은 "페이지 하단 근처에 도달했는가"를 확인하는 것이다.

- **디바운스** 적용 시: 스크롤을 멈춘 후에야 체크가 실행된다. 빠르게 스크롤하면 임계점을 지나친 뒤 한참 뒤에 체크해서 늦게 느껴진다.
- **스로틀** 적용 시: 스크롤하는 내내 일정 간격으로 체크한다. 임계점을 지나치는 순간 가까운 틱에 감지되어 즉각 반응한다.

```js
window.addEventListener('scroll', throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadMoreItems();
  }
}, 100));
```

---

## 종합

무한 스크롤에는 스로틀이 적합하다. 임계점에 근접하는 순간을 실시간으로 감지해야 하기 때문이다. 다만 현재는 `IntersectionObserver` API를 사용하면 스크롤 이벤트 자체를 붙이지 않아도 더 효율적으로 같은 동작을 구현할 수 있다 — 브라우저가 뷰포트 교차를 최적화된 방식으로 감지해주기 때문이다.

---

---

# [UNVERIFIED] 아이디 중복검사에 디바운싱과 스로틀링 중 어느 것이 적합한가?

## 도입

아이디 입력 필드에서 키입력마다 중복 검사 API를 호출하는 것은 낭비다. "입력이 끝났을 때" 한 번만 호출하는 것이 목표다.

---

## 본문

`hongildong`을 한 글자씩 입력하면 총 10번의 `input` 이벤트가 발생한다.

- **스로틀** 적용 시: `h`, `hon`, `hongi`, `hongild`, `hongildong` 순으로 중간중간 API가 호출된다. 아직 입력 중인 불완전한 아이디로 API를 호출한다.
- **디바운스** 적용 시: 마지막 글자 `g`를 입력하고 딜레이(예: 300ms)가 지난 후에만 `hongildong`으로 한 번 호출된다.

```js
const checkInput = debounce(async (value) => {
  const { isDuplicate } = await api.checkId(value);
  setError(isDuplicate ? '이미 사용 중인 아이디입니다' : '');
}, 300);

input.addEventListener('input', (e) => checkInput(e.target.value));
```

---

## 종합

아이디 중복 검사에는 디바운스가 적합하다. 입력이 완전히 끝난 뒤 한 번만 API를 호출하면 되기 때문이다. 스로틀을 쓰면 불필요한 API 요청이 여러 번 발생하고, 불완전한 아이디로 검사 결과가 뜨는 UX 문제도 생긴다. React에서는 `useCallback` + `useMemo`로 디바운스 함수를 메모화하거나, `useDebounce` 커스텀 훅을 만들어 state에 적용하는 패턴이 일반적이다.
