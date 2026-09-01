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
