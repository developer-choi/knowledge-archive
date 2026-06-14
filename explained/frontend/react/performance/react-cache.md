# `cache()`의 기본 동작은?

## 도입

`cache()`는 React가 Server Components에서 제공하는 메모이제이션 API다. 같은 인자로 반복 호출되는 비용이 큰 함수(DB 조회, 외부 API 호출 등)를 캐싱하여 한 요청 내에서 중복 실행을 방지한다. 기본 원리는 단순하다 — 캐시에 결과가 있으면 꺼내고, 없으면 함수를 실행한 뒤 결과를 저장한다.

---

## 본문

> When calling cachedFn with given arguments, it first checks if a cached result exists in the cache.

"캐싱된 함수를 주어진 인자로 호출하면, 먼저 캐시에 결과가 존재하는지 확인한다."

> If a cached result exists, it returns the result. If not, it calls fn with the arguments, stores the result in the cache, and returns the result.

"캐시된 결과가 있으면 그것을 반환한다. 없으면 인자를 넣어 fn을 호출하고, 결과를 캐시에 저장한 뒤 반환한다."

> The only time fn is called is when there is a cache miss.

"fn이 실제로 호출되는 것은 오직 cache miss가 발생한 경우뿐이다."

- **cache hit**: 동일한 인자로 이미 호출된 적 있어 캐시에 결과가 존재하는 상황. fn을 다시 실행하지 않는다.
- **cache miss**: 캐시에 결과가 없어 fn을 새로 실행해야 하는 상황. 실행 후 결과를 저장해둔다.

```
동일 요청 내 두 컴포넌트가 같은 userId로 호출

getUser('user-1')  ← 첫 번째 호출: cache miss → DB 조회 실행 → 캐시 저장
getUser('user-1')  ← 두 번째 호출: cache hit  → 캐시에서 즉시 반환
```

---

## 종합

`cache()`의 핵심 가치는 같은 요청(request) 내에서 동일 데이터를 여러 컴포넌트가 필요로 할 때 DB 또는 API 호출을 단 한 번으로 줄이는 것이다. 컴포넌트 트리가 깊을수록, 같은 데이터를 여러 곳에서 필요로 할수록 효과가 크다. 없으면 각 컴포넌트가 독립적으로 같은 DB 쿼리를 실행하게 되어 불필요한 I/O 비용이 쌓인다.

---

# `cache()`는 에러도 캐싱하는가?

## 도입

`cache()`가 성공 결과를 캐싱한다는 건 직관적이다. 그런데 함수 실행 중 에러가 발생하면 어떻게 되는지가 중요한 코너 케이스다. 에러가 캐싱되지 않는다면, 매번 같은 조건으로 재호출할 때마다 실패하는 함수가 반복 실행되는 문제가 생긴다.

---

## 본문

> cachedFn will also cache errors.

"cachedFn은 에러도 캐싱한다."

> If fn throws an error for certain arguments, it will be cached, and the same error is re-thrown when cachedFn is called with those same arguments.

"특정 인자에서 fn이 에러를 throw하면 그 에러가 캐싱되고, 이후 같은 인자로 cachedFn을 호출하면 같은 에러가 다시 throw된다."

- **cache errors**: 성공 결과와 동일한 메커니즘으로 에러도 저장한다. 에러를 캐싱함으로써 실패한 호출도 fn을 다시 실행하지 않는다.
- **re-thrown**: 캐시에서 꺼낸 에러를 새로 throw한다. 호출자 입장에서는 원래 fn이 직접 throw한 것과 동일하게 처리된다.

---

## 종합

에러 캐싱의 실무 의의는 "실패한 요청을 한 번만 시도한다"는 보장이다. 예를 들어 존재하지 않는 userId로 DB 조회가 실패하면, 같은 요청 안에서 다른 컴포넌트가 동일 userId로 다시 조회해도 DB에 재접근하지 않고 캐시된 에러를 즉시 re-throw한다. 없으면 같은 실패 조건으로 N번의 쿼리가 실행될 수 있다.

---

# `cache()`는 인자의 동등성을 어떻게 판정하는가?

## 도입

캐시가 "같은 인자"를 판정하는 방법이 곧 cache hit/miss의 기준이 된다. 원시값(string, number)은 값 자체로 비교되지만, 객체는 내용이 같아도 참조가 다르면 다른 인자로 처리될 수 있다. `cache()`가 어떤 방식으로 비교하는지 알아야 불필요한 cache miss를 방지할 수 있다.

---

## 본문

> If your arguments are not primitives (ex. objects, functions, arrays), ensure you're passing the same object reference.

"인자가 원시값이 아닌 경우(객체, 함수, 배열 등), 반드시 같은 객체 참조를 전달해야 한다."

> When calling a memoized function, React will look up the input arguments to see if a result is already cached. React will use shallow equality of the arguments to determine if there is a cache hit.

"memoized function을 호출할 때, React는 입력 인자를 조회하여 결과가 이미 캐시되어 있는지 확인한다. React는 인자의 shallow equality를 사용하여 cache hit 여부를 판정한다."

> React will call Object.is on the input to verify if there is a cache hit.

"React는 입력에 대해 Object.is를 호출하여 cache hit인지 검증한다."

- **shallow equality**: 객체의 내부 프로퍼티를 재귀적으로 비교하지 않고, 참조(reference) 또는 원시값 자체를 비교한다. `{ id: 1 }`과 `{ id: 1 }`이 다른 객체 리터럴이면 shallow equality 기준으로 다르다.
- **Object.is**: `===`와 거의 같지만 `NaN === NaN`이 `true`, `-0 === +0`이 `false`인 점이 다르다. `cache()`는 이 기준으로 인자를 비교한다.

---

## 종합

객체를 인자로 넘길 때의 핵심 규칙은 "같은 참조를 넘겨라"다. 렌더링마다 `{ userId: 1 }` 리터럴을 새로 만들어 넘기면 매번 cache miss가 발생한다. 모듈 스코프의 상수나 컴포넌트 바깥에서 생성된 객체를 공유 참조로 사용해야 한다. 없으면 객체 인자를 쓰는 모든 `cache()` 호출이 항상 miss가 되어 캐싱 효과가 전혀 없다.

---

# 같은 함수를 `cache()`에 두 번 넘기면 같은 캐시를 공유하는가?

## 도입

`cache(fn)`은 fn을 받아 새 memoized function을 반환한다. 여기서 질문이 생긴다 — `cache(fn)`을 두 번 호출하면 반환된 두 함수가 같은 캐시 저장소를 공유하는가? 아니면 서로 독립적인 캐시를 가지는가?

---

## 본문

> Each call to cache creates a new function.

"cache를 호출할 때마다 새로운 함수가 생성된다."

> This means that calling cache with the same function multiple times will return different memoized functions that do not share the same cache.

"같은 함수를 여러 번 cache에 넘기면, 같은 캐시를 공유하지 않는 서로 다른 memoized function이 반환된다."

> Calling different memoized functions will read from different caches.

"서로 다른 memoized function을 호출하면 서로 다른 캐시에서 읽는다."

> To access the same cache, components must call the same memoized function.

"같은 캐시에 접근하려면, 컴포넌트들이 동일한 memoized function을 호출해야 한다."

- **same memoized function**: `cache(fn)`이 반환한 바로 그 함수 참조. export로 공유하거나 같은 모듈에서 import해야 "같은" 것이 된다.

```
// 잘못된 방식 — 각각 독립된 캐시
const fn1 = cache(getData); // 캐시 A
const fn2 = cache(getData); // 캐시 B — A와 독립

// 올바른 방식 — 같은 캐시 공유
// utils/getData.js
export const getData = cache(rawGetData);

// ComponentA.js
import { getData } from './utils/getData';

// ComponentB.js
import { getData } from './utils/getData';  // 동일한 캐시
```

---

## 종합

`cache()`의 캐시 공유 규칙은 "함수 참조 동일성"이다. 같은 fn을 넣었다고 캐시가 공유되지 않는다 — `cache()` 호출 자체가 독립된 캐시 저장소를 만든다. 여러 컴포넌트가 캐시를 공유하려면 반드시 `cache(fn)`의 결과물을 모듈 레벨에서 export하고, 각 컴포넌트가 그 export를 import해야 한다.

---

# `cache()`의 캐시는 언제 무효화되는가?

## 도입

`cache()`가 캐시를 요청 간에 영구히 유지한다면 오래된 데이터가 계속 반환될 수 있다. React는 캐시 무효화 타이밍을 어떻게 설계했는가?

---

## 본문

> React will invalidate the cache for all memoized functions for each server request.

"React는 모든 memoized function의 캐시를 서버 요청마다 무효화한다."

- **invalidate**: 캐시에 저장된 모든 결과를 폐기한다. 다음 호출은 다시 fn을 실행하여 결과를 얻는다.
- **each server request**: 요청 단위로 캐시가 격리된다. 요청 A의 캐시는 요청 B에서 보이지 않는다. 이것은 서로 다른 사용자의 데이터가 섞이는 것을 방지하는 보안적 설계이기도 하다.

```
요청 1 (user A)
  getUser('user-1') → cache miss → DB 조회 → 캐시 저장
  getUser('user-1') → cache hit  → 캐시 반환
  요청 1 종료 → 캐시 무효화

요청 2 (user B)
  getUser('user-1') → cache miss → DB 조회 (새로 실행)
```

---

## 종합

요청 단위 무효화는 `cache()`를 서버에서 안전하게 쓸 수 있게 하는 핵심 설계다. 캐시가 요청을 넘어 지속되면 사용자 A의 데이터가 사용자 B에게 반환되는 데이터 누수가 발생할 수 있다. `cache()`가 없으면 같은 요청 내에서 동일한 DB 쿼리가 N번 실행되고, 영구 캐시(Redis, 메모리 글로벌 변수)를 직접 구현해야 한다.

---

# `cache()`는 Client Component에서도 사용 가능한가?

## 도입

`cache()`는 React 공식 API지만 설계 목적 자체가 Server Component의 요청 단위 메모이제이션이다. Client Component에서 사용 가능한지는 실제 코드 작성 전에 확인해야 할 제약이다.

---

## 본문

> cache is for use in Server Components only.

"cache는 Server Components 전용이다."

- **Server Components only**: Client Component 번들에서는 `cache()`가 동작하지 않는다. 클라이언트에서 메모이제이션이 필요하면 `useMemo`나 `useCallback`을 사용한다.

Client Component에서 메모이제이션이 필요한 상황과의 비교:

```
Server Component   → cache()     요청 단위, 서버 전용
Client Component   → useMemo()   컴포넌트 생명주기 단위, 클라이언트 전용
함수 참조 안정화   → useCallback() 클라이언트 전용
```

---

## 종합

`cache()`와 `useMemo()`는 적용 대상과 캐시 수명이 모두 다르다. `cache()`는 서버에서 한 요청 안에서 여러 컴포넌트가 공유하는 캐시이고, `useMemo()`는 클라이언트에서 한 컴포넌트 인스턴스의 렌더링 사이에서 계산 결과를 보존한다. 혼용하면 "Client Components에서는 동작하지 않는다"는 런타임 에러 또는 예상치 못한 무효화가 발생한다.

---

# memoized function을 컴포넌트 바깥에서 호출하면 어떻게 되는가?

## 도입

`cache()`로 만든 memoized function은 어디서나 호출할 수 있는 것처럼 보이지만, 실제로 캐시가 활성화되는 조건이 있다. 컴포넌트 렌더링 컨텍스트 바깥에서 호출하면 캐시가 동작하지 않는다.

---

## 본문

> Calling a memoized function outside of a component will not use the cache.

"memoized function을 컴포넌트 바깥에서 호출하면 캐시를 사용하지 않는다."

```tsx
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 잘못된 위치 — 컴포넌트 바깥 호출: 캐시 사용 안 함
getUser('demo-id');

async function DemoProfile() {
  // 올바른 위치 — 컴포넌트 내부 호출: 캐시 사용
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

> React only provides cache access to the memoized function in a component. When calling getUser outside of a component, it will still evaluate the function but not read or update the cache.

"React는 컴포넌트 안에서만 memoized function에 캐시 접근 권한을 제공한다. 컴포넌트 바깥에서 호출하면 함수는 실행되지만 캐시를 읽거나 갱신하지 않는다."

> This is because cache access is provided through a context which is only accessible from a component.

"캐시 접근은 컴포넌트에서만 접근 가능한 context를 통해 제공되기 때문이다."

- **context**: React의 렌더링 context. 서버 요청 단위로 격리된 캐시 저장소가 이 context에 바인딩된다. 컴포넌트 외부에서는 이 context가 없으므로 캐시 저장소에 접근할 수 없다.

---

## 종합

이 제약의 실무 의의는 "memoized function은 반드시 컴포넌트 함수 내부에서 호출해야 한다"는 것이다. 초기화 코드나 유틸리티 함수에서 직접 호출하면 캐시 효과 없이 매번 fn이 실행된다. 파일 최상위에서 `cache(fn)`으로 함수를 생성하는 것(정의)과, 컴포넌트 내부에서 그 함수를 호출하는 것(사용)을 명확히 분리해야 한다.

---

# [UNVERIFIED] memoized function을 여러 컴포넌트에서 공유하려면 어떻게 배치해야 하는가?

## 도입

같은 캐시를 여러 컴포넌트가 공유하려면 단순히 같은 원본 함수를 `cache()`에 넘기는 것만으로는 부족하다. "같은 memoized function 참조"를 공유해야 한다는 규칙을 코드 배치로 어떻게 구현할지가 핵심이다.

---

## 본문

공유 가능한 올바른 배치 패턴:

```tsx
// getWeekReport.js — memoized function을 별도 파일에 export
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```tsx
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
  const report = getWeekReport(cityData); // 컴포넌트 내부에서 호출
  // ...
}
```

```tsx
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData); // 동일한 캐시 공유
  // ...
}
```

반면 컴포넌트 파일 안에서 `cache(...)`를 호출하면 그 컴포넌트에서만 접근 가능한 독립 캐시가 생긴다. 또한 컴포넌트 함수 본문 안에서 `cache(...)`를 호출하면 매 렌더마다 새로운 memoized function이 생성되어 캐시가 전혀 작동하지 않는다.

세 가지 배치 규칙 요약:

```
모듈 레벨 export    → 여러 컴포넌트가 같은 캐시 공유 (올바름)
컴포넌트 파일 내 선언  → 그 컴포넌트만 접근 가능한 독립 캐시
컴포넌트 함수 본문 내  → 렌더마다 새 캐시 생성, 캐시 무의미
```

---

## 종합

`cache()` 공유의 실무 패턴은 "별도 파일에 export, 컴포넌트 내부에서 호출"이다. memoized function을 모듈 레벨에서 export하면 JavaScript 모듈 캐싱 덕분에 어느 파일에서 import해도 같은 함수 참조를 받는다. 이 참조를 각 컴포넌트 내부에서 호출하면 같은 캐시 저장소를 읽고 쓴다. 없으면 동일한 데이터를 필요로 하는 컴포넌트마다 별도 DB 쿼리가 발생한다.
