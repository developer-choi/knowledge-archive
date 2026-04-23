---
tags: [react, nextjs, performance]
---

# Questions
- `cache()`의 기본 동작은?
- `cache()`는 에러도 캐싱하는가?
- `cache()`는 인자의 동등성을 어떻게 판정하는가?
- 같은 함수를 `cache()`에 두 번 넘기면 같은 캐시를 공유하는가?
- `cache()`의 캐시는 언제 무효화되는가?
- `cache()`는 Client Component에서도 사용 가능한가?
- memoized function을 컴포넌트 바깥에서 호출하면 어떻게 되는가?
- memoized function을 여러 컴포넌트에서 공유하려면 어떻게 배치해야 하는가?

---

# Answers

## `cache()`의 기본 동작은?

### Official Answer
When calling cachedFn with given arguments, it first checks if a cached result exists in the cache.

If a cached result exists, it returns the result. If not, it calls fn with the arguments, stores the result in the cache, and returns the result.

The only time fn is called is when there is a **cache miss**.

> #### Key Terms:
> - **cache hit**: 동일한 인자로 호출했을 때 캐시에 결과가 이미 존재해서 fn을 다시 호출하지 않는 상황
> - **cache miss**: 캐시에 결과가 없어 fn을 새로 호출해야 하는 상황

### Reference
- https://react.dev/reference/react/cache

---

## `cache()`는 에러도 캐싱하는가?

### Official Answer
cachedFn will also cache errors.
If fn throws an error for certain arguments, it will be cached, and the same error is re-thrown when cachedFn is called with those same arguments.

### Reference
- https://react.dev/reference/react/cache

---

## `cache()`는 인자의 동등성을 어떻게 판정하는가?

### Official Answer
If your arguments are not primitives (ex. objects, functions, arrays), ensure you're passing the same object reference.

When calling a memoized function, React will look up the input arguments to see if a result is already cached.
React will use **shallow equality** of the arguments to determine if there is a cache hit.
- React will call **Object.is** on the input to verify if there is a cache hit.

> #### Key Terms:
> - **shallow equality**: 객체의 깊은 내부 값까지 비교하지 않고 참조(reference) 또는 최상위 값만 비교하는 방식
> - **Object.is**: JavaScript 내장 동등 비교 함수. `===`와 거의 같지만 `NaN`/`-0` 처리가 다르다.

### Reference
- https://react.dev/reference/react/cache

---

## 같은 함수를 `cache()`에 두 번 넘기면 같은 캐시를 공유하는가?

### Official Answer
**Each call to cache creates a new function.**
This means that calling cache with the same function multiple times will return different memoized functions that do not share the same cache.

- Calling different memoized functions will read from different caches.
- To access the same cache, components must call the **same memoized function**.

### Reference
- https://react.dev/reference/react/cache

---

## `cache()`의 캐시는 언제 무효화되는가?

### Official Answer
React will invalidate the cache for all memoized functions for **each server request**.

### Reference
- https://react.dev/reference/react/cache

---

## `cache()`는 Client Component에서도 사용 가능한가?

### Official Answer
cache is for use in **Server Components only**.

### Reference
- https://react.dev/reference/react/cache

---

## memoized function을 컴포넌트 바깥에서 호출하면 어떻게 되는가?

### Official Answer
**Calling a memoized function outside of a component will not use the cache.**

```typescript jsx
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React only provides cache access to the memoized function in a component.
When calling getUser outside of a component, it will still evaluate the function but not read or update the cache.

This is because cache access is provided through a **context** which is only accessible from a component.

### Reference
- https://react.dev/reference/react/cache

---

## memoized function을 여러 컴포넌트에서 공유하려면 어떻게 배치해야 하는가?

### User Answer
컴포넌트 바깥(별도 파일)에 memoized function을 만들고 그것을 export하여, 오직 컴포넌트 안에서만 호출한다.

```typescript jsx
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```typescript jsx
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

```typescript jsx
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

반면 컴포넌트 파일 안에서 `cache(...)`를 호출하여 memoized function을 만들면, 그 컴포넌트에서만 접근 가능하므로 공유가 안 된다.
또한 컴포넌트 함수 본문 안에서 `cache(...)`를 호출하면 매 렌더마다 새로운 memoized function이 생성되어 캐시가 의미 없어진다.

### Reference
- https://react.dev/reference/react/cache
