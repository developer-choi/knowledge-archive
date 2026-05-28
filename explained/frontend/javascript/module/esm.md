# [UNVERIFIED] ESM이란 무엇인가?

## 도입

ESM(ECMAScript Modules)은 ECMAScript 2015(ES6)에서 표준화된 공식 모듈 시스템이다. 브라우저가 네이티브로 이해하는 유일한 JS 모듈 형식이라는 점이 CJS, AMD 같은 다른 모듈 시스템과의 핵심 차이다.

---

## 본문

ESM은 OA 없이 실무 원칙으로 정리한다.

```html
<!-- 브라우저에서 ESM을 직접 로드 -->
<script type="module" src="./app.js"></script>
<!-- type="module"을 붙이면 브라우저가 ESM으로 파싱 -->
```

```js
// app.js (ESM)
import { add } from './math.js'; // 상대 경로 필수
export const result = add(1, 2);
```

브라우저가 TypeScript를 이해하지 못하는 것처럼, ESM 이전의 CJS(`require()`)도 브라우저가 이해하지 못한다. ESM만이 브라우저 네이티브 모듈이다.

```
브라우저가 이해하는 것         브라우저가 이해 못하는 것
────────────────────────────  ──────────────────────────
HTML/CSS                       TypeScript
Vanilla JS                     JSX
ESM (type="module")            CJS (require)
                               AMD (define)
```

Vite가 dev 모드에서 번들링 없이 소스를 바로 서빙할 수 있는 이유가 이것이다 — 소스가 이미 ESM 형식이라 브라우저가 직접 파싱·실행할 수 있다.

---

## 종합

ESM이 표준화된 덕분에 브라우저, Node.js(v12+), Deno, Bun 같은 모든 현대 런타임이 동일한 `import/export` 문법을 지원한다. 번들러 없이도 브라우저에서 실행 가능하다는 것은 개발 환경의 복잡도를 크게 낮춰준다. 다만 브라우저 캐싱, HTTP/2 활용, import map 설정 등 프로덕션 최적화는 여전히 번들러가 담당한다.

---

---

# [UNVERIFIED] `export {}`는 빈 객체를 내보내는가?

## 도입

`export {}` 문법은 언뜻 빈 객체를 내보내는 것처럼 보이지만, 이것은 객체 리터럴 `{}`이 아니다. 완전히 다른 의미의 ESM 문법이다.

---

## 본문

`export {}`의 의미는 OA 없이 실무 원칙으로 정리한다.

```js
export {}; // 빈 이름 목록을 export — 아무것도 내보내지 않음
// {} 안에 내보낼 이름이 없으므로 no-op

// 비교:
export { foo }; // foo라는 이름을 export
export { foo, bar }; // foo, bar 두 이름을 export
export {}; // 아무 이름도 export하지 않음
```

`export {}`가 실제로 쓰이는 이유:
```js
// TypeScript에서 파일을 "모듈"로 인식시키려면
// import 또는 export 문이 하나라도 있어야 한다
// 아무 export도 없으면 전역 스크립트로 취급

// 아무것도 내보낼 게 없지만 모듈로 만들고 싶을 때
export {};
```

---

## 종합

`export {}`는 ESM 명세에서 "named exports 목록이 비어있는 export 선언"으로 정의된다. 객체 리터럴과 문법이 겹쳐 보이지만 전혀 다른 맥락이다. TypeScript에서 타입 선언 파일(`.d.ts`)이나 사이드이펙트만 있는 파일을 모듈로 처리할 때 자주 쓰인다.

---

---

# `export *`는 default export까지 재내보내는가?

## 도입

`export * from 'module'`은 다른 모듈의 모든 export를 한 번에 재내보내는 wildcard 문법이다. 그런데 "모든"에 default export가 포함되는가? 포함되지 않는다.

---

## 본문

> `export * from "module"` re-exports all named exports from another module, but does **not** re-export the `default` export.

"`export * from 'module'`은 다른 모듈의 모든 named export를 재내보내지만, default export는 포함되지 않는다."

- **named exports**: `export const foo = ...`, `export function bar() {}`, `export { baz }` 처럼 이름이 붙은 export.
- **does not re-export the default**: `export default`는 wildcard에서 제외된다. 의도적인 설계 — default는 명시적으로 다시 내보내도록 강제한다.

```js
// lib.js
export const a = 1;
export const b = 2;
export default 'default value';

// index.js
export * from './lib.js';
// a, b는 재내보냄
// default는 포함 안 됨

// default까지 재내보내려면 명시 필요:
export { default } from './lib.js';
// 또는
export * from './lib.js';
export { default } from './lib.js';
```

---

## 종합

라이브러리의 barrel 파일(`index.js`)에서 `export * from './components'` 형태를 자주 쓰는데, 각 컴포넌트 파일에 `export default`가 있다면 그것은 자동으로 재내보내지지 않는다. 의도치 않게 default export가 누락되는 버그가 여기서 발생한다. 명시적으로 `export { default as ComponentName } from './components'`를 추가하거나, 처음부터 named export 방식으로 통일하는 것이 barrel 파일 관리를 단순하게 만든다.

---

---

# [UNVERIFIED] 두 wildcard re-export가 같은 이름을 갖고 있을 때 어떻게 되는가?

## 도입

두 모듈에서 같은 이름을 `export *`로 재내보내면 충돌이 발생한다. 에러가 나지 않고 조용히 사라지는 것이 함정이다.

---

## 본문

Wildcard 충돌 규칙은 OA 없이 실무 원칙으로 정리한다.

```js
// a.js
export const name = 'A';

// b.js
export const name = 'B';

// index.js
export * from './a.js';
export * from './b.js';
// name이 양쪽에 있어 충돌 → name은 누락됨 (에러 없음, 경고 없음)

// 외부에서:
import { name } from './index.js';
// name === undefined
// 또는 SyntaxError: The requested module does not provide an export named 'name'
```

충돌이 발생하면 양쪽 모두 드러나지 않는다. 명시적 재내보내기로 해결해야 한다:

```js
// index.js
export * from './a.js'; // a의 name은 충돌로 누락
export * from './b.js'; // b의 name은 충돌로 누락
export { name } from './a.js'; // 명시적으로 a의 name을 노출
```

---

## 종합

이 "침묵 속의 누락" 동작은 ESM 사양에 의도적으로 설계된 것이다. 어느 쪽이 우선인지 모호한 상황에서 하나를 임의로 선택하는 것보다, 양쪽 모두 숨기고 개발자에게 명시적 해결을 요구하는 방식이다. 대규모 라이브러리의 barrel 파일에서 이 패턴을 잘못 쓰면 특정 export가 조용히 사라지는 버그가 생긴다 — TypeScript의 `isolatedModules` 설정이나 번들러 경고로 이를 일찍 잡아내는 것이 좋다.

---

---

# [UNVERIFIED] Named export와 default export는 기능적으로 어떻게 다른가?

## 도입

`export default`와 `export const`(named export)는 둘 다 모듈에서 값을 내보내는 방식이다. 기능적 차이는 거의 없지만 의미론적 뉘앙스와 사용 시 주의점이 있다.

---

## 본문

Named export vs default export는 OA 없이 실무 원칙으로 정리한다.

```js
// named export — 이름이 고정됨
export const Button = () => <button />;
export const Input = () => <input />;

// import 시 반드시 같은 이름 사용 (또는 as로 별칭)
import { Button, Input } from './components';
import { Button as Btn } from './components';

// default export — 이름이 없음, import할 때 임의 이름 사용 가능
export default function App() {}

import App from './App'; // 이름은 자유
import MyApp from './App'; // 이것도 같은 컴포넌트
```

차이점 정리:
```
                 named export      default export
개수 제한         여러 개 가능       파일당 하나만
import 이름       고정 (as로 변경)   자유롭게 명명
export * 포함     포함              포함 안 됨
암묵적 의미        일반 export       "이 모듈의 주된 것"
```

---

## 종합

React 컴포넌트는 default export로, 유틸 함수 모음은 named export로 내보내는 컨벤션이 흔하다. default export는 import 이름이 자유로워 오타가 타입 에러로 잡히지 않는다는 단점이 있다 — TypeScript 프로젝트에서는 named export가 리팩토링 안전성이 더 높다. 팀 코딩 컨벤션으로 통일해두는 것이 중요하다.

---

---

# [UNVERIFIED] 브라우저는 `import 'react'` 같은 bare module import를 그대로 처리할 수 있는가?

## 도입

`from 'react'`처럼 경로 없이 패키지명만 쓰는 것을 bare specifier라고 한다. 브라우저는 이를 처리하지 못한다 — 파일 시스템 경로나 URL이 아니기 때문이다.

---

## 본문

Bare specifier 처리 방식은 OA 없이 실무 원칙으로 정리한다.

```js
// 브라우저에서 직접 실행 시 에러
import React from 'react'; // Uncaught TypeError: Failed to resolve module specifier 'react'

// 브라우저가 이해하는 형식
import React from './node_modules/react/index.js'; // 상대 경로 OK
import React from 'https://esm.sh/react'; // 절대 URL OK
```

두 가지 해결 방법:

**1. Import Maps (브라우저 네이티브):**
```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18",
    "react-dom": "https://esm.sh/react-dom@18"
  }
}
</script>
<script type="module">
import React from 'react'; // 이제 동작
</script>
```

**2. Vite pre-bundle (개발 서버):**
```
import React from 'react'
→ Vite가 /node_modules/.vite/deps/react.js?v=abc123 로 rewrite
→ 브라우저가 이해할 수 있는 절대 경로로 변환
```

---

## 종합

번들러(Vite, Webpack)가 하는 일 중 하나가 bare specifier를 브라우저가 이해할 수 있는 경로로 변환하는 것이다. 번들러 없이 브라우저에서 직접 ESM을 쓰려면 Import Maps 또는 CDN URL을 써야 한다. `esm.sh`, `unpkg`, `skypack` 같은 CDN은 npm 패키지를 ESM으로 변환해서 URL로 제공한다.

---

---

# [UNVERIFIED] 같은 모듈을 여러 파일에서 import하면 코드가 매번 평가되는가?

## 도입

여러 파일이 같은 모듈을 import하면 그 모듈의 코드가 파일마다 새로 실행될까? ESM의 답은 "아니다 — 최초 한 번만"이다.

---

## 본문

모듈 평가 횟수는 OA 없이 실무 원칙으로 정리한다.

```js
// counter.js
let count = 0;
export function increment() { count++; }
export function getCount() { return count; }
console.log('counter.js 평가됨'); // 이 줄은 한 번만 출력됨

// a.js
import { increment } from './counter.js';
increment();

// b.js
import { getCount } from './counter.js';
console.log(getCount()); // 1 — a.js의 increment()가 반영됨

// main.js
import './a.js';
import './b.js';
// 출력: "counter.js 평가됨" (한 번만)
//       1
```

ESM 모듈 레지스트리(Module Registry)가 이미 평가된 모듈을 캐싱한다. 두 번째 import는 캐시에서 같은 인스턴스를 반환한다.

```
┌─────────────────────────────────────┐
│         Module Registry (캐시)       │
│  'counter.js' → {increment, getCount}│  ← 한 번만 생성
└────────────────┬────────────────────┘
                 │ (같은 인스턴스 공유)
        ┌────────┴────────┐
      a.js             b.js
```

---

## 종합

ESM의 "한 번만 평가" 특성은 모듈 단위 싱글턴 패턴을 자연스럽게 가능하게 한다. 설정 객체나 캐시 저장소를 모듈 수준 변수로 두면 어디서 import해도 같은 인스턴스를 공유한다. 반면 모듈 수준의 side-effect(초기화 코드, 로그 등)는 단 한 번만 실행되므로, 테스트 환경에서 모듈 상태를 리셋하려면 Jest의 `jest.resetModules()` 같은 명시적 리셋이 필요하다.

---

---

# [UNVERIFIED] ESM은 JSON 파일도 import 할 수 있는가?

## 도입

`import config from './config.json'`처럼 JSON 파일을 모듈처럼 가져오고 싶을 때, 네이티브 ESM과 번들러 사이의 지원 범위가 다르다.

---

## 본문

JSON import는 OA 없이 실무 원칙으로 정리한다.

```js
// 번들러(Vite, Webpack) 환경 — 대부분 지원
import config from './config.json';
console.log(config.version); // JSON 내용이 객체로 파싱됨

// Node.js 22+ 네이티브 ESM — Import Attributes 문법 필요
import config from './config.json' with { type: 'json' };

// TypeScript — tsconfig의 resolveJsonModule: true 필요
import config from './config.json'; // TS가 타입 자동 추론
```

---

## 종합

JSON import는 번들러 환경에서는 거의 항상 동작하지만, 네이티브 ESM에서는 Import Attributes 문법이 필요하다. TypeScript 프로젝트에서는 `tsconfig.json`에 `"resolveJsonModule": true`를 추가하면 JSON 파일의 구조를 타입으로 자동 추론해준다. 라이브러리 개발 시 JSON import를 쓰면 번들러 의존성이 생기므로 주의가 필요하다.

---

---

# [UNVERIFIED] ESM의 dynamic import와 CJS의 `require()`는 어떻게 다른가?

## 도입

둘 다 "필요한 시점에 모듈을 불러오는" 용도로 쓰이지만, 반환 방식과 동작 시점이 근본적으로 다르다.

---

## 본문

Dynamic import vs require 차이는 OA 없이 실무 원칙으로 정리한다.

```js
// CJS require — 동기, 즉시 반환
const fs = require('fs'); // 동기적으로 파일 읽어서 모듈 반환
console.log(fs.readFileSync); // 즉시 사용 가능

// ESM dynamic import — 비동기, Promise 반환
const fs = await import('fs'); // Promise 반환, 비동기 로드
console.log(fs.default.readFileSync); // .default 또는 named import로 접근
```

```
                  require()           import()
반환 타입          모듈 자체           Promise<모듈>
동작 방식          동기               비동기
사용 가능 환경     CJS                ESM + CJS 모두
표현식 위치        문 어디서든         표현식이 들어갈 곳 어디서든
조건부 로드        가능 (if문 등)      가능 (then 체인 등)
```

코드 분할(Code Splitting)에서 dynamic import를 쓰는 이유:
```js
// 버튼 클릭 시에만 무거운 라이브러리 로드
button.addEventListener('click', async () => {
  const { Chart } = await import('chart.js'); // 이 시점에 번들 로드
  new Chart(canvas, config);
});
// 초기 번들에 Chart.js가 포함되지 않아 초기 로드 속도 향상
```

---

## 종합

Dynamic import의 가장 큰 실무 활용은 코드 분할이다. Next.js의 `dynamic()`, React의 `React.lazy()` + `Suspense`도 내부적으로 dynamic import를 사용한다. `require()`는 Node.js CJS 환경에서 여전히 쓰이지만, ESM 환경에서는 `require()`를 직접 쓸 수 없어서 조건부 로드도 dynamic import로 처리해야 한다.
