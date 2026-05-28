# [UNVERIFIED] ESM-only 라이브러리를 CJS/SSR 환경에서 require로 가져오면 어떻게 되는가?

## 도입

ESM-only로 배포된 라이브러리는 `export` 키워드를 사용하고 `module.exports`를 쓰지 않는다. CJS 환경에서 `require()`로 이를 불러오려 하면 Node.js가 파싱 단계에서 막힌다.

---

## 본문

ESM-only 라이브러리의 CJS require 오류는 OA 없이 실무 원칙으로 정리한다.

```
오류 메시지 예시:
Error [ERR_REQUIRE_ESM]: require() of ES Module not supported.
```

이 에러가 나는 이유:
- CJS `require()`는 파일을 동기적으로 불러오지만, ESM은 비동기 파싱이 필요하다.
- `require()`가 ESM 파일을 만나면 모듈 해석 단계에서 즉시 에러를 던진다.

```js
// ESM-only 라이브러리 (예: Swiper v7+)
// package.json: { "type": "module" }

// CJS 환경에서 (예: Next.js SSR, 구형 Node.js 설정)
const Swiper = require('swiper'); // ERR_REQUIRE_ESM 에러
```

해결 방법:
```js
// 1. dynamic import로 비동기 로드
const { Swiper } = await import('swiper');

// 2. Next.js에서 SSR 비활성화 + dynamic import
const Swiper = dynamic(() => import('swiper'), { ssr: false });

// 3. 번들러가 자동으로 처리 (Vite, Webpack 5 등)
```

---

## 종합

ESM-only 라이브러리가 SSR 환경에서 `require()`로 불려질 때 에러가 나는 것은 CJS와 ESM의 근본적인 모듈 해석 방식 차이 때문이다. 오류 메시지를 보면 `ERR_REQUIRE_ESM`이 명확히 표시된다. 해결은 dynamic import 사용, SSR 비활성화, 또는 번들러 설정 조정 중 프로젝트 상황에 맞는 것을 택한다.

---

---

# [UNVERIFIED] 결국 ESM과 CJS는 어떻게 섞어 써야 하는가?

## 도입

이상적으로는 하나의 모듈 시스템만 쓰는 것이 좋다. 하지만 실무에서는 레거시 패키지, 도구 설정, SSR 환경이 뒤섞여 완전한 통일이 어려운 경우가 많다.

---

## 본문

ESM과 CJS 혼용 전략은 OA 없이 실무 원칙으로 정리한다.

원칙: 혼용 자체는 가능하지만, 런타임마다 해석 방식이 달라 직접 호환을 관리해야 한다.

현대 도구의 자동화:
```
Vite (dev 서버):
  → 의존성을 ESM으로 pre-bundle (esbuild 사용)
  → CJS 패키지를 ESM으로 자동 변환
  → 사용자는 import/export만 쓰면 됨

Next.js 14:
  → CJS 라이브러리 자동 변환 강화
  → transpilePackages 옵션으로 ESM 변환 대상 지정 가능
```

직접 관리가 필요한 경우:
```js
// package.json에서 exports 필드로 환경별 진입점 분리
{
  "exports": {
    "import": "./dist/index.mjs",   // ESM
    "require": "./dist/index.cjs"   // CJS
  }
}
```

---

## 종합

현재 주류 프론트엔드 스택(Vite, Next.js)을 쓰는 환경에서는 번들러가 ESM/CJS 호환을 대부분 처리해준다. 사용자 코드 수준에서 `import` 문법으로 쓰면 번들러가 알아서 변환한다. 호환 문제가 표면으로 드러나는 경우는 대부분 SSR 환경에서 ESM-only 패키지를 `require()`로 불러오려 할 때다 — 이 경우 dynamic import 또는 패키지의 `exports` 필드를 확인하는 것이 첫 번째 진단 단계다.

---

---

# [UNVERIFIED] TypeScript에서 ESM/CJS interop은 어떻게 다루는가?

## 도입

TypeScript는 타입 정보를 담당하고, 실제 모듈 해석 방식은 JS 런타임이나 번들러가 담당한다. TS는 CJS 모듈을 ESM 문법으로 import할 수 있도록 보정해주는 `esModuleInterop` 옵션을 제공한다.

---

## 본문

TypeScript의 ESM/CJS interop은 OA 없이 실무 원칙으로 정리한다.

`esModuleInterop`이 없다면 CJS 모듈의 `module.exports`를 ESM `default import`로 가져올 때 타입이 맞지 않는다:

```ts
// esModuleInterop: false (기본값 없음)
import React from 'react'; // 에러 또는 undefined
// React는 CJS 모듈, module.exports가 default export가 아님

// esModuleInterop: true (권장)
import React from 'react'; // 정상 동작
// TS가 컴파일 시 CJS 모듈에 맞는 래퍼를 생성
```

`tsconfig.json` 설정:
```json
{
  "compilerOptions": {
    "esModuleInterop": true,    // CJS 모듈의 default import 허용
    "moduleResolution": "bundler" // 번들러 환경에 맞는 모듈 해석 (TS 5.0+)
  }
}
```

`esModuleInterop`을 켜면 TS 컴파일러가 생성하는 JS 코드에 `__importDefault` 헬퍼가 추가된다:
```js
// 컴파일 결과 (esModuleInterop: true)
const react_1 = __importDefault(require("react"));
// react_1.default === React
```

---

## 종합

`esModuleInterop: true`는 CRA, Vite, Next.js 등 대부분의 TS 프로젝트 보일러플레이트에 기본 포함되어 있다. 이 옵션 없이 CJS 라이브러리를 `import X from 'x'`로 쓰면 `X`가 `undefined`가 되거나 타입 에러가 발생할 수 있다. TS 5.0의 `moduleResolution: "bundler"` 옵션은 Vite/esbuild 환경에서 `exports` 필드 기반 모듈 해석을 정확히 지원하므로 최신 프로젝트에서 권장된다.
