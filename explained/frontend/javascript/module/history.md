# [UNVERIFIED] 모듈 시스템이 없던 시절 JS는 어떤 문제가 있었는가?

## 도입

초창기 JS는 웹 페이지에 작은 스크립트를 추가하는 용도였다. 파일이 늘어나고 코드가 복잡해지면서 모듈 없이 전역 공간을 공유하는 방식의 문제가 드러났다.

---

## 본문

모듈 없던 시절의 문제는 OA 없이 실무 원칙으로 정리한다.

모든 스크립트가 전역(`window`) 스코프를 공유했다:

```html
<!-- HTML에 순서대로 로드 -->
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="my-utils.js"></script>
<script src="app.js"></script>
```

```js
// my-utils.js
var helper = function() { return 'utility'; };

// app.js
var helper = function() { return 'app'; }; // 덮어씀! 충돌
```

두 가지 핵심 문제:
1. **이름 충돌**: 어느 파일에서든 같은 이름의 변수/함수를 선언하면 서로 덮어쓴다.
2. **의존성 순서**: `app.js`가 `jquery.js`에 의존하면 HTML에서 jquery를 먼저 로드해야 한다. 파일이 늘어날수록 순서 관리가 폭발적으로 복잡해진다.

---

## 종합

모듈 시스템이 없으면 코드베이스가 커질수록 전역 오염과 의존성 충돌이 누적된다. IIFE(Immediately Invoked Function Expression) 패턴이 임시방편으로 쓰였다 — 함수 스코프로 감싸서 전역 노출을 최소화하는 방식이다. 하지만 이는 표준이 아닌 관행이었고, 팀마다 다른 방식을 썼다. 이 혼란이 표준 모듈 시스템의 필요성을 만들었다.

---

---

# [UNVERIFIED] 모듈 시스템이 의미하는 것은 무엇인가?

## 도입

모듈 시스템은 단순히 "파일을 나누는 것"이 아니다. 파일별 스코프 격리와 명시적 공개 인터페이스라는 두 가지 조건을 갖춰야 한다.

---

## 본문

모듈 시스템의 두 조건은 OA 없이 실무 원칙으로 정리한다.

```
모듈 시스템 = 파일별 독립 스코프 + 명시적 export
```

**1. 파일별 독립 스코프:**
```js
// a.js (모듈)
const name = 'A'; // 이 파일 안에서만 유효

// b.js (모듈)
const name = 'B'; // 충돌 없음 — 각자 독립된 스코프
```

**2. 명시적 export:**
```js
// math.js
const privateHelper = () => {}; // 외부에 노출 안 됨
export const add = (a, b) => a + b; // 명시적으로 공개

// app.js
import { add } from './math.js'; // add만 가져올 수 있음
// privateHelper는 접근 불가
```

---

## 종합

모듈 시스템의 핵심은 "캡슐화"다. 파일 내부의 구현 세부사항을 숨기고 공개 인터페이스만 노출한다. 이를 통해 라이브러리 내부 구현이 바뀌어도 사용자 코드에 영향을 주지 않는다. 파일을 단순히 분리하는 것(HTML `<script>` 태그 여러 개)과 모듈로 분리하는 것의 결정적 차이가 이 스코프 격리다.

---

---

# [UNVERIFIED] ESM 이전에 어떤 모듈 시스템들이 있었는가?

## 도입

ESM이 2015년에 표준화되기 전까지 커뮤니티는 여러 비표준 모듈 시스템을 만들어 썼다. 각각 서버용, 브라우저용, 범용으로 등장했다.

---

## 본문

ESM 이전 모듈 시스템들은 OA 없이 실무 원칙으로 정리한다.

```
시간 순서:
AMD (2009~) → CommonJS (Node.js 채택 2009~) → UMD → ESM (2015~)
```

- **AMD (Asynchronous Module Definition)**: RequireJS로 대표. 브라우저에서 비동기 로드를 위해 설계. `define(['dep'], function(dep) {...})` 형태.
- **CJS (CommonJS)**: Node.js가 서버 측 모듈 시스템으로 채택. `require()`/`module.exports`. 동기 로드라 브라우저에서는 번들러 없이 쓸 수 없다.
- **UMD (Universal Module Definition)**: AMD와 CJS 양쪽 환경에서 동작하는 wrapper 패턴. 환경을 감지해서 맞는 형식으로 export한다.

```js
// UMD 패턴 (단순화)
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);       // AMD
  } else if (typeof module === 'object') {
    module.exports = factory(); // CJS
  } else {
    root.myLib = factory(); // 전역
  }
}(this, function() {
  return { /* 라이브러리 코드 */ };
}));
```

---

## 종합

AMD, CJS, UMD는 모두 표준 없는 시대의 커뮤니티 해결책이었다. 각자의 생태계를 만들었지만 서로 호환이 안 됐다. ESM이 표준화되면서 마침내 런타임 중립적인 하나의 모듈 시스템이 생겼고, 브라우저와 Node.js가 동일한 문법을 지원하게 됐다.

---

---

# [UNVERIFIED] 번들러는 모듈 시스템과 어떤 관계로 등장했는가?

## 도입

모듈 시스템이 생기면서 코드를 파일로 잘 나눌 수 있게 됐지만, 브라우저는 수백 개의 파일을 효율적으로 로드할 수 없었다. 번들러가 이 gap을 메웠다.

---

## 본문

번들러의 역할은 OA 없이 실무 원칙으로 정리한다.

```
모듈로 쪼갠 코드 (개발자가 쓰기 편한 형태)
  app.js → import Button from './Button'
            import Input from './Input'
            ...수백 개의 파일

      ↓ 번들러 (Webpack, Rollup, esbuild)

브라우저가 로드할 수 있는 형태 (최적화된 파일 몇 개)
  bundle.js (모든 코드가 하나로 합쳐짐)
```

번들러가 하는 일:
1. 의존성 그래프 분석 (어떤 파일이 어떤 파일을 import하는지)
2. 필요한 파일만 포함 (Tree Shaking)
3. 코드 합치기 (Bundle)
4. 최적화 (Minify, Code Split 등)

---

## 종합

모듈 시스템이 "어떻게 코드를 나누는가"를 해결했다면, 번들러는 "나눈 코드를 어떻게 브라우저에 효율적으로 전달하는가"를 해결한다. HTTP/2의 멀티플렉싱으로 여러 파일 동시 로드가 가능해졌지만, 번들링+압축이 여전히 성능상 유리한 경우가 많아 번들러는 계속 쓰인다.

---

---

# [UNVERIFIED] CJS의 단점은 무엇인가? (번들 용량 측면)

## 도입

CJS는 Node.js 서버용으로 만들어졌다. 서버는 번들 크기를 걱정할 필요가 없었다 — 파일이 로컬에 있으니까. 그런데 이 CJS를 브라우저에서 쓰면서 번들 크기 문제가 드러났다.

---

## 본문

CJS의 번들 용량 문제는 OA 없이 실무 원칙으로 정리한다.

CJS의 근본적 한계는 **동적 구조**다:

```js
// CJS — 동적. 빌드 타임에 어떤 export가 쓰이는지 알 수 없음
const _ = require('lodash'); // lodash 전체 로드

// 심지어 이런 코드도 가능
const methodName = 'map';
const method = require('lodash')[methodName]; // 런타임에 결정

// ESM — 정적. 빌드 타임에 분석 가능
import { map } from 'lodash'; // 번들러가 map만 포함 가능
```

`require()`는 어디서든 호출 가능하고, 조건부로도 쓸 수 있고, 변수에도 쓸 수 있다. 번들러가 정적 분석으로 "실제로 쓰이는 export"를 파악하기 어렵다.

---

## 종합

CJS의 동적 특성은 런타임 유연성을 주지만 빌드 타임 최적화를 어렵게 한다. `require('lodash')`를 쓰면 lodash 전체(수백 KB)가 번들에 들어갈 수 있다. 같은 기능을 `import { map } from 'lodash-es'`로 쓰면 번들러가 `map`만 추출해서 훨씬 작은 번들을 만든다. 이것이 프론트엔드에서 ESM 전환을 권고하는 주된 이유다.

---

---

# [UNVERIFIED] Tree Shaking이 ESM에서는 잘 되고 CJS에서는 어려운 이유는?

## 도입

Tree Shaking은 "죽은 코드 제거"다. 번들러가 실제로 사용되지 않는 export를 최종 번들에서 빼낸다. ESM의 정적 구조가 이를 가능하게 한다.

---

## 본문

Tree Shaking의 원리는 OA 없이 실무 원칙으로 정리한다.

```
Tree Shaking이 가능하려면 빌드 타임에 알 수 있어야 한다:
1. 어떤 파일이 어떤 것을 export하는가?
2. 어떤 파일이 어떤 것을 import하는가?
3. 실제로 쓰이지 않는 export는 무엇인가?
```

**ESM — 정적 구조, Tree Shaking 가능:**
```js
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b; // 사용 안 됨

// app.js
import { add } from './math.js'; // add만 import

// 번들 결과: add 코드만 포함, subtract/multiply는 제거됨
```

**CJS — 동적 구조, Tree Shaking 어려움:**
```js
// math.cjs
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
};

// app.js
const { add } = require('./math.cjs');
// 번들러가 math.cjs 전체를 포함해야 안전
// (런타임에 module.exports가 바뀔 수 있으니)
```

---

## 종합

ESM의 `import`/`export`는 컴파일 타임에 완전히 확정된다 — 조건부 import가 없고, 변수를 이용한 동적 import는 `import()`라는 별도 문법을 쓴다. 이 정적 확정성 덕분에 번들러가 의존성 그래프를 정밀하게 분석해서 사용되지 않는 코드를 안전하게 제거할 수 있다.

---

---

# [UNVERIFIED] CJS에서도 tree shaking이 가능한가?

## 도입

CJS에서 Tree Shaking이 전혀 안 된다는 것은 아니다. 다만 ESM 대비 제약이 많고 빌드 비용이 크다.

---

## 본문

CJS Tree Shaking의 한계는 OA 없이 실무 원칙으로 정리한다.

제한적 가능 방법:
- `webpack-common-shake` 플러그인: CJS 코드가 특정 컨벤션을 지키면 부분적으로 제거 가능.
- `module.exports = { ... }` 형태의 정적 객체 리터럴은 번들러가 어느 정도 분석 가능.

하지만 아래 패턴은 Tree Shaking 불가:
```js
// 동적 export — 분석 불가
if (process.env.NODE_ENV === 'development') {
  module.exports.debug = debugFn;
}

// 런타임 조건 require — 분석 불가
const util = require(process.env.PLATFORM + '-util');
```

ESM 대비 Tree Shaking 비용:
```
ESM: 정적 분석 → 바로 제거 (빠름)
CJS: 실행 시뮬레이션 + 패턴 매칭 필요 → 느리고 불완전
```

---

## 종합

CJS에서 최선의 Tree Shaking이 ESM 최악의 Tree Shaking보다 못한 경우가 많다. 라이브러리를 만들 때 ESM(`exports.mjs`)과 CJS(`exports.cjs`) 두 버전 모두 제공하면, 번들러가 환경에 따라 최적 버전을 선택할 수 있다 — `package.json`의 `exports` 필드로 조건부 진입점을 설정하는 이유다.

---

---

# [UNVERIFIED] 모듈 시스템의 역사 흐름은 어떻게 정리되는가?

## 도입

모듈 시스템의 역사는 "파편화 → 통합 시도 → 표준화"의 흐름으로 요약된다.

---

## 본문

모듈 시스템 역사는 OA 없이 실무 원칙으로 정리한다.

```
시대별 흐름
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2009    CJS: Node.js 서버용, require()/module.exports
2009    AMD: 브라우저용 비동기 로드, RequireJS
2010~   UMD: AMD+CJS 양쪽 지원하는 범용 래퍼
2011    Browserify: CJS를 브라우저에서 쓸 수 있게
2012    Webpack: 의존성 그래프 기반 번들링
2015    ESM 표준화 (ES2015/ES6)
2017    Node.js, ESM 실험적 지원 시작
2019    Node.js 12, ESM 정식 지원
현재    ESM이 사실상 표준, CJS는 레거시
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 종합

6년간의 파편화(CJS vs AMD)를 UMD가 임시로 통합하고, ESM이 최종 표준으로 수렴했다. 브라우저와 Node.js 양쪽이 ESM을 지원하면서 드디어 하나의 모듈 시스템으로 풀스택 JS를 작성할 수 있게 됐다. CJS는 Node.js 생태계에서 여전히 방대하게 쓰이지만, 신규 패키지는 ESM-first로 작성하는 것이 현재 권고다.

---

---

# [UNVERIFIED] 번들러의 출력 모듈 형식 기본값이 ESM+UMD인 이유는?

## 도입

Rollup, Vite 같은 번들러의 라이브러리 모드 출력 기본값이 ESM과 UMD를 동시에 내는 것을 볼 수 있다. 이는 호환 폭을 최대화하기 위한 선택이다.

---

## 본문

ESM+UMD 기본값 이유는 OA 없이 실무 원칙으로 정리한다.

```json
// vite.config.js 라이브러리 모드 기본 출력
{
  "lib": {
    "formats": ["es", "umd"]
  }
}

// 출력:
// dist/my-lib.es.js   → ESM, tree-shaking 친화
// dist/my-lib.umd.js  → UMD, 범용 호환
```

각 포맷의 역할:
- **ESM (.mjs)**: 현대 번들러(Vite, Webpack 5)와 Node.js ESM 환경. Tree shaking 가능. 라이브러리를 내부 의존성으로 쓸 때 최적.
- **UMD**: 구형 환경 대응. `<script src="lib.umd.js">` CDN 직접 로드, CJS `require()`, AMD. 브라우저에서 번들러 없이 바로 쓸 때.

---

## 종합

라이브러리 배포 시 두 포맷을 내는 것은 "어떤 환경의 사용자도 쓸 수 있게 하자"는 방어적 전략이다. `package.json`의 `exports` 필드로 환경별 진입점을 분리하면 번들러가 자동으로 최적 포맷을 선택한다. 최신 라이브러리는 CJS 없이 ESM+UMD만 내는 추세이고, Rollup과 tsup이 이 패턴을 잘 지원한다.

---

---

# [UNVERIFIED] 전체 앱을 ESM으로 통일하라는 권고의 출처는?

## 도입

"ESM으로 통일하고 CJS 의존을 피하라"는 권고가 여러 곳에서 나온다. 어디서, 왜 이런 권고를 하는지 알면 실제 적용 판단에 도움이 된다.

---

## 본문

ESM 통일 권고의 출처는 OA 없이 실무 원칙으로 정리한다.

주요 출처:

**1. web.dev (Google):**
> CJS 사용 시 Tree Shaking이 어려워 번들 크기가 커진다. 전체 앱을 ESM으로 통일하면 최적의 Tree Shaking을 얻을 수 있다.

**2. Node.js issues #33954:**
> CJS와 ESM 혼용 시 "CJS → interop wrapper → ESM → interop wrapper → ..." 처럼 변환의 변환이 누적되어 번들이 비대해지고 런타임 비용이 증가한다.

**3. 현실적인 권고 (2024 기준):**
```
신규 코드: ESM으로 작성
레거시 패키지: 번들러가 자동 처리 (직접 관리 거의 불필요)
라이브러리 배포: ESM + UMD 또는 ESM + CJS 양쪽 지원
```

---

## 종합

ESM 통일 권고의 핵심은 번들 크기와 Tree Shaking 효율이다. 실무에서 완전한 ESM 통일은 이상이고, 번들러가 대부분의 호환 문제를 처리해준다. 새 프로젝트를 시작하거나 라이브러리를 만들 때는 ESM-first로 가되, 레거시 CJS 패키지 의존은 번들러에 맡기는 전략이 현실적이다.
