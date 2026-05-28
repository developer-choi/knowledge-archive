# [UNVERIFIED] Promise란 무엇인가?

## 도입

콜백 방식의 비동기 처리는 중첩이 깊어질수록 코드가 피라미드 형태로 쌓이는 "콜백 지옥" 문제가 있었다. Promise는 이를 해결하기 위해 ES2015(ES6)에서 도입된 비동기 처리 객체다. "미래의 값"을 나타내는 컨테이너라고 볼 수 있다.

---

## 본문

Promise는 OA 없이 실무 원칙으로 정리한다.

Promise는 세 가지 상태를 가진다:
- **pending**: 아직 처리 중. 이행도 거부도 안 된 초기 상태.
- **fulfilled**: 성공적으로 완료. `.then()` 콜백이 실행될 준비가 된 상태.
- **rejected**: 실패. `.catch()` 콜백이 실행될 준비가 된 상태.

```js
// Promise 체인 — 콜백 지옥 대신 평탄한 구조
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(`/api/posts?userId=${user.id}`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
```

```
Promise 상태 전이
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pending ──→ fulfilled  (resolve 호출)
        └─→ rejected   (reject 호출 or throw)
```

settled(fulfilled 또는 rejected) 상태가 되면 다시 pending으로 돌아가지 않는다. 상태는 단방향이다.

---

## 종합

Promise가 없다면 비동기 작업의 순서를 보장하려면 콜백을 계속 중첩해야 했다. Promise는 비동기 작업의 성공/실패를 하나의 객체로 캡슐화하고, `.then()/.catch()/.finally()` 체인으로 처리 흐름을 선형으로 만들어준다. 현재는 `async/await`가 Promise를 더 동기스럽게 쓸 수 있게 해주지만, `async/await`의 내부 동작 자체가 Promise 위에 구축되어 있다.

---

---

# [UNVERIFIED] Promise 생성자는 언제 사용하는가?

## 도입

대부분의 현대 API(`fetch`, `fs.promises.*` 등)는 이미 Promise를 반환한다. 그런데 `setTimeout`처럼 콜백 기반의 구형 API는 Promise를 반환하지 않는다. 이때 Promise 생성자로 "감싸기(promisification)"가 필요하다.

---

## 본문

Promise 생성자는 OA 없이 실무 원칙으로 정리한다.

```js
// setTimeout은 Promise를 반환하지 않는다 → 직접 wrapping
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// 이제 await로 쓸 수 있다
await wait(1000); // 1초 대기

// Node.js callback API promisification
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

---

## 종합

Promise 생성자(`new Promise((resolve, reject) => {...})`)는 콜백 기반 API를 Promise로 변환할 때 주로 사용한다. 이미 Promise를 반환하는 함수 위에서 `new Promise`를 다시 감싸는 것은 "Promise 안티패턴(explicit Promise construction anti-pattern)"이라 불리며 불필요하다. Node.js의 `util.promisify`나 `fs.promises`처럼 이미 promisified된 API가 있다면 그것을 쓰는 것이 낫다.

---

---

# [UNVERIFIED] unhandledrejection은 언제 발생하는가?

## 도입

Promise가 rejected 상태가 됐는데 아무도 그 거부를 처리하지 않으면, 그 에러는 전역 범위로 전파된다. 브라우저와 Node.js 모두 이를 감지하는 이벤트를 제공한다.

---

## 본문

`unhandledrejection`은 OA 없이 실무 원칙으로 정리한다.

핵심은 "Promise가 rejected되는 시점에 핸들러가 없으면" 발생한다는 것이다. 1초 뒤에 `.catch()`를 붙여도 그 사이에 이미 `unhandledrejection`이 발생할 수 있다.

```js
// 브라우저
window.addEventListener('unhandledrejection', event => {
  console.error('처리되지 않은 거부:', event.reason);
  event.preventDefault(); // 기본 콘솔 에러 출력 방지
});

// Node.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('미처리 거부:', reason);
});

// 문제 케이스 — 나중에 catch를 붙여도 이미 늦다
const p = Promise.reject(new Error('too late'));
// unhandledrejection 발생 가능

setTimeout(() => {
  p.catch(e => console.log('잡았다:', e)); // 너무 늦음
}, 1000);
```

---

## 종합

`unhandledrejection`을 글로벌로 처리하는 것은 최후의 안전망이다. 실제로는 각 Promise 체인마다 `.catch()`나 `try/catch`를 붙여서 거부를 즉시 처리하는 것이 옳다. Next.js, React Query 같은 프레임워크는 내부적으로 `unhandledrejection`을 감지하여 Error Boundary나 전역 에러 상태로 연결해준다.

---

---

# [UNVERIFIED] Promise를 nested로 사용하면 어떤 문제가 있는가?

## 도입

Promise는 콜백 지옥을 탈출하기 위해 만들어졌지만, Promise 안에 Promise를 중첩하면 결국 비슷한 구조적 문제가 생긴다. 체인이 끊어지거나 에러가 누락되는 위험도 있다.

---

## 본문

Promise 중첩의 문제는 OA 없이 실무 원칙으로 정리한다.

```js
// 나쁜 예 — nested Promise
fetch('/api/user')
  .then(res => {
    res.json().then(user => {          // 새 Promise 체인이 외부로 연결되지 않음
      fetch(`/api/posts?id=${user.id}`)
        .then(r => r.json())
        .then(posts => console.log(posts))
        .catch(e => console.error(e)); // 이 catch는 외부 체인과 무관
    });
    // 내부 Promise를 return하지 않아 체인이 끊어짐
  })
  .catch(e => console.error(e)); // 내부 에러를 잡지 못함

// 좋은 예 — 평탄한 체인
fetch('/api/user')
  .then(res => res.json())              // return으로 다음 then에 연결
  .then(user => fetch(`/api/posts?id=${user.id}`))
  .then(r => r.json())
  .then(posts => console.log(posts))
  .catch(e => console.error(e));       // 모든 거부를 하나의 catch로 처리
```

---

## 종합

Promise를 중첩하면 세 가지 문제가 동시에 발생할 수 있다 — 가독성 저하, 에러 누락, 의도치 않은 병렬 실행. `.then()` 안에서 새 Promise를 `return`하지 않으면 체인이 끊어져 다음 `.then()`이 이전 Promise의 완료를 기다리지 않는다. `async/await`를 쓰면 이 문제를 대부분 구조적으로 피할 수 있다.

---

---

# [UNVERIFIED] Promise.all()과 Promise.allSettled()는 언제 구분해서 써야 하는가?

## 도입

여러 비동기 작업을 병렬로 실행할 때 `Promise.all()`과 `Promise.allSettled()` 중 어느 것을 쓰느냐에 따라 하나가 실패했을 때의 동작이 완전히 달라진다.

---

## 본문

두 메서드의 차이는 OA 없이 실무 원칙으로 정리한다.

```js
// Promise.all — 하나라도 reject되면 즉시 reject (fast-fail)
const [user, profile] = await Promise.all([
  fetchUser(id),
  fetchProfile(id),
]);
// user와 profile이 모두 필요한 경우에 적합
// fetchUser가 실패하면 fetchProfile 결과도 사용 불가

// Promise.allSettled — 전부 settled된 후 결과 배열 반환
const results = await Promise.allSettled([
  fetchCategories(),
  fetchPopularKeywords(),
]);
// results[0].status === 'fulfilled' | 'rejected'
// 인기 검색어가 실패해도 카테고리는 표시할 수 있음
results.forEach(result => {
  if (result.status === 'fulfilled') {
    use(result.value);
  } else {
    logError(result.reason);
  }
});
```

```
Promise.all([A, B, C])
  A✓ B✓ C✓ → [A값, B값, C값]
  A✓ B✗ C✓ → reject(B의 이유) — 즉시 실패

Promise.allSettled([A, B, C])
  A✓ B✗ C✓ → [{fulfilled,A값}, {rejected,B이유}, {fulfilled,C값}]
```

---

## 종합

`Promise.all()`은 모든 결과가 다 있어야만 의미 있을 때 사용한다. 반면 일부 실패가 허용되고 성공한 것만으로도 동작해야 하면 `Promise.allSettled()`가 맞다. 페이지 초기화 시 독립적인 여러 API를 병렬 호출할 때 `Promise.all()`을 쓰면 하나의 부가 API 실패가 전체 페이지 로드 실패로 이어질 수 있다 — 이때는 `Promise.allSettled()`로 부분 성공을 허용하고 실패한 영역만 빈 상태로 표시하는 것이 더 견고한 설계다.
