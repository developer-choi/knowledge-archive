# await 연산자란 무엇인가?

## 도입

`await`는 `async` 함수 안에서만 쓸 수 있는 연산자다. Promise가 settled(fulfilled 또는 rejected)될 때까지 현재 함수의 실행을 일시 중단하고, 그 값을 꺼내준다. "일시 중단"이라 해도 JS 메인 스레드 자체가 멈추는 게 아니라 해당 `async` 함수의 실행만 마이크로태스크 큐로 미뤄진다.

---

## 본문

> The **await** operator is used to wait for a Promise and get its fulfillment value.

"await 연산자는 Promise를 기다리고 그 이행 값을 꺼내는 데 쓰인다."

- **wait for**: 단순히 시간을 소비하는 게 아니라, Promise가 settled될 때까지 현재 `async` 함수의 나머지 코드를 마이크로태스크로 예약한 뒤 제어권을 호출자에게 돌려준다.
- **fulfillment value**: Promise가 fulfilled 상태일 때의 값. 이 표현식 전체가 그 값으로 평가된다. 인수가 Promise가 아니면 (`await 42` 처럼) 그 값 자체를 그대로 반환한다.

> If the promise is rejected, the await expression throws the rejected value.
> The function containing the await expression will appear in the stack trace of the error.

"Promise가 rejected되면 await 표현식이 그 거부 값을 throw한다. await를 담고 있는 함수가 에러 스택 트레이스에 표시된다."

- **throws**: `await`가 붙은 Promise가 거부되면 그 거부 이유가 예외로 변환된다. 그래서 `try/catch`로 감쌀 수 있다.
- **stack trace**: `await` 없이 `return promise`만 쓰면 거부 시 호출 함수가 스택 트레이스에서 사라질 수 있다. `await`를 쓰면 함수 이름이 스택에 남아 디버깅이 쉬워진다.

```js
async function fetchUser() {
  const res = await fetch('/api/user'); // rejected → throws
  return res.json();
}

// try/catch로 await 에러 잡기
async function main() {
  try {
    const user = await fetchUser();
    console.log(user);
  } catch (e) {
    console.error('fetchUser 실패:', e);
  }
}
```

---

## 종합

`await`가 없다면 Promise의 이행 값을 꺼내려면 `.then()` 체인을 써야 한다. 에러 처리를 위해 `.catch()`를 붙이지만, Promise 생성자 내부에서 동기적으로 throw된 에러는 `.catch()`가 잡지 못한다 — 이때 `try/catch` + `await` 조합이 필요하다. `await`는 비동기 코드를 동기처럼 읽힐 수 있게 해줄 뿐 아니라, 거부된 Promise의 스택 트레이스를 보존하고 `try/catch`로 에러 흐름을 통일할 수 있다는 실질적 이점이 있다.

---

---

# await는 실행 순서에 어떤 영향을 미치는가?

## 도입

`await`를 만나면 현재 함수가 즉시 중단되고 마이크로태스크가 예약된다. 핵심은 "이미 resolved된 Promise조차도 await하면 최소 한 틱의 마이크로태스크 지연이 생긴다"는 것이다. 이 특성 때문에 두 `async` 함수를 연속 호출하면 실행이 인터리브(interleave)된다.

---

## 본문

> When the awaited expression's value is resolved, another microtask that continues the paused code gets scheduled.
> This happens even if the awaited value is an already-resolved promise or not a promise: execution doesn't return to the current function until all other already-scheduled microtasks are processed.

"awaited 표현식의 값이 resolve되면, 일시 중단된 코드를 재개하는 마이크로태스크가 새로 예약된다. 이미 resolved된 promise나 promise가 아닌 값을 await해도 마찬가지다: 이미 예약된 다른 모든 마이크로태스크가 처리될 때까지 현재 함수로 돌아오지 않는다."

- **microtask**: Promise `.then()` 콜백과 같은 큐에 들어간다. 마이크로태스크 큐는 macrotask(setTimeout 등) 큐보다 먼저, 현재 동기 코드가 끝나자마자 비워진다.
- **already-resolved**: `await 42`나 `await Promise.resolve(1)`처럼 즉시 완료된 값도 await하면 한 틱을 양보한다. "즉시 결과가 있어도 지연이 생긴다"는 직관에 반하는 동작이다.

```js
async function foo(name) {
  console.log(name, "start");
  await console.log(name, "middle");
  console.log(name, "end");
}

foo("First");
foo("Second");

// First start
// First middle
// Second start
// Second middle
// First end
// Second end
```

`await console.log(name, "middle")`은 `console.log`의 반환값(`undefined`)을 await한다. 즉시 resolve지만 마이크로태스크 한 틱이 생겨서 `First end`가 출력되기 전에 `Second start`와 `Second middle`이 먼저 실행된다.

```
동기 실행       마이크로태스크 큐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
foo("First") →  "First start"
                "First middle"
                await → [First end 예약]
foo("Second") → "Second start"
                "Second middle"
                await → [Second end 예약]
큐 비우기 →     "First end"
                "Second end"
```

---

## 종합

`await`는 단순히 "값이 올 때까지 기다린다"가 아니라 "마이크로태스크 큐에 재개를 등록하고 제어권을 넘긴다"는 메커니즘이다. 이 때문에 `await`를 연속 호출하면 의도치 않은 실행 순서가 생길 수 있다. 여러 독립적인 Promise를 순차 await하는 대신 `Promise.all`로 병렬 처리하면 불필요한 마이크로태스크 지연을 줄일 수 있다.

---

---

# return await를 사용해야 하는가?

## 도입

`return promise`와 `return await promise` 중 어느 쪽이 나은지는 실무에서 자주 논쟁이 되는 주제다. 결론부터 보면 MDN은 `return await`가 거의 항상 더 낫다고 명시한다.

---

## 본문

> Contrary to some popular belief, `return await promise` is at least as fast as `return promise`, due to how the spec and engines optimize the resolution of native promises.

"널리 퍼진 믿음과 달리, `return await promise`는 사양과 엔진이 네이티브 promise 해석을 최적화하는 방식 덕분에 `return promise`만큼 빠르다."

- **contrary to some popular belief**: "`return await`는 불필요한 래핑을 만들어 느리다"는 과거의 통념을 명시적으로 반박한다. V8의 async 함수 최적화(2018년 이후)로 이 차이는 사실상 사라졌다.
- **native promises**: 서드파티 thenable이 아닌 네이티브 `Promise` 인스턴스를 말한다. 네이티브 Promise끼리는 엔진 수준에서 추가 래핑 없이 최적화된다.

> Therefore, except for stylistic reasons, `return await` is **almost always preferable.**

"`return await`는 스타일 이유를 제외하면 거의 항상 더 낫다."

- **except for stylistic reasons**: 유일한 예외는 린터 규칙(`no-return-await`)이나 팀 컨벤션처럼 취향 차원의 이유뿐이다.
- **almost always preferable**: `return await`를 쓰면 함수가 스택 트레이스에 포함되어 에러 디버깅이 쉬워진다. `try/catch` 안에서는 특히 필요하다 — `return promise`를 쓰면 `catch`가 현재 함수 안의 거부를 잡지 못할 수 있다.

```js
// return await 사용 — try/catch가 현재 함수의 스택 보존
async function getUser(id) {
  try {
    return await fetchUser(id); // reject 시 catch가 잡는다
  } catch (e) {
    console.error('getUser 실패', e);
    throw e;
  }
}

// return promise — try/catch가 잡지 못할 수 있다
async function getUser(id) {
  try {
    return fetchUser(id); // reject가 catch를 건너뛸 수 있다
  } catch (e) {
    // 이 블록이 실행되지 않을 수 있음
  }
}
```

---

## 종합

`return await`의 성능 불이익은 현대 V8에서는 사실상 없다. 반면 이점은 실질적이다 — `try/catch` 안에서 거부를 잡을 수 있고, 에러 스택 트레이스에 현재 함수 이름이 남는다. 특별한 이유가 없다면 `async` 함수에서 Promise를 반환할 때 `return await`를 쓰는 것이 안전하다.

---

---

# .catch()는 프로미스 함수의 동기 에러를 처리하는가?

## 도입

`.catch()`는 Promise 체인에서 거부를 처리하는 메서드다. 하지만 함수가 Promise를 반환하기 전에 동기적으로 throw하면 `.catch()`가 그것을 잡지 못한다. Promise가 아직 만들어지지도 않았기 때문이다.

---

## 본문

> If `promisedFunction()` throws an error synchronously, the error won't be caught by the `catch()` handler.
> In this case, the `try...catch` statement is necessary.

"promisedFunction()이 동기적으로 에러를 throw하면 그 에러는 catch() 핸들러로 잡히지 않는다. 이 경우에는 try...catch 문이 필요하다."

- **throws synchronously**: Promise 생성자 외부, 즉 `.then()`/`.catch()` 체인이 붙기 전에 throw되는 에러. 이 시점엔 아직 Promise 객체 자체가 없으므로 Promise 거부 경로로 흘러가지 않는다.
- **won't be caught by catch()**: `.catch()`는 Promise 체인 내부의 거부만 처리할 수 있다. 체인 밖의 동기 예외는 별도의 `try/catch`가 필요하다.

```js
function mayThrowSync() {
  throw new Error("동기 에러"); // Promise 반환 전에 throw
  return fetch('/api');
}

// .catch()로는 잡히지 않는다
mayThrowSync().catch(e => console.error(e)); // TypeError: mayThrowSync is not a function 또는 에러 전파

// try/catch가 필요하다
try {
  await mayThrowSync();
} catch (e) {
  console.error(e); // "동기 에러" — 여기서 잡힌다
}
```

---

## 종합

비동기 함수라고 해서 모든 에러가 자동으로 Promise 거부로 변환되지는 않는다. `async` 키워드가 붙은 함수는 내부 throw를 rejected Promise로 변환해주지만, 일반 함수가 Promise를 반환하기 전에 throw하면 `.catch()`는 무력하다. `await` + `try/catch` 패턴을 쓰면 동기 에러와 비동기 거부를 동일한 코드 경로로 처리할 수 있어서 일관된 에러 핸들링이 가능하다.
