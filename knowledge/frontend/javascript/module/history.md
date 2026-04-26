---
tags: [javascript, history, concept]
---

# Questions
- 모듈 시스템이 없던 시절 JS는 어떤 문제가 있었는가?
- 모듈 시스템이 의미하는 것은 무엇인가?
- ESM 이전에 어떤 모듈 시스템들이 있었는가?
- 번들러는 모듈 시스템과 어떤 관계로 등장했는가?
- CJS의 단점은 무엇인가? (번들 용량 측면)
- Tree Shaking이 ESM에서는 잘 되고 CJS에서는 어려운 이유는?
- CJS에서도 tree shaking이 가능한가?
- 모듈 시스템의 역사 흐름은 어떻게 정리되는가?
- 번들러의 출력 모듈 형식 기본값이 ESM+UMD인 이유는?
- 전체 앱을 ESM으로 통일하라는 권고의 출처는?

---

# Answers

## 모듈 시스템이 없던 시절 JS는 어떤 문제가 있었는가?

### User Answer
초창기 JavaScript는 모듈 시스템 자체가 없었다.
모든 스크립트가 global scope를 공유했기 때문에 다음 문제가 발생했다.
- 변수·함수 이름 충돌
- 의존성 순서 보장 어려움 (어떤 스크립트가 어떤 스크립트보다 먼저 로드돼야 하는지 직접 관리)

---

## 모듈 시스템이 의미하는 것은 무엇인가?

### User Answer
모듈 시스템은 다음 두 가지를 갖춘 체계다.
- 파일별로 자체 스코프를 가진다 (전역 오염 X).
- 일부 식별자만 명시적으로 외부에 노출한다 (export).

---

## ESM 이전에 어떤 모듈 시스템들이 있었는가?

### User Answer
ESM 표준화 이전에 여러 모듈 시스템이 등장했다.
- AMD: `require.js`로 대표되는, 가장 오래된 축의 모듈 시스템 중 하나.
- CommonJS (CJS): Node.js 서버용으로 채택된 모듈 시스템.
- UMD: AMD/CJS 양쪽 환경에서 모두 동작하도록 만든 범용 포맷.

### Reference
- https://en.wikipedia.org/wiki/CommonJS
- https://en.wikipedia.org/wiki/Asynchronous_module_definition

---

## 번들러는 모듈 시스템과 어떤 관계로 등장했는가?

### User Answer
모듈 시스템이 정착하면서 번들러가 함께 등장했다.
모듈로 쪼갠 코드를 브라우저가 이해할 수 있는 형태로 합치고, 동시에 의존성 그래프 기반의 최적화를 수행한다.

---

## CJS의 단점은 무엇인가? (번들 용량 측면)

### User Answer
CJS는 Node.js 서버용으로 설계되었기 때문에 production bundle 사이즈를 고려하지 않은 모듈 시스템이다.
2010년대 초 브라우저 표준 모듈 시스템이 없던 시기에 client-side에서도 CJS를 쓰면서 이 문제가 부각됐다.
번들 용량이 커지고 tree shaking이 어렵다는 한계가 드러났다.

---

## Tree Shaking이 ESM에서는 잘 되고 CJS에서는 어려운 이유는?

### User Answer
Tree Shaking은 번들러가 build time에 어떤 export가 실제로 쓰이는지를 정적 분석해서 안 쓰이는 코드를 제거하는 최적화다.
정적 분석이 가능해야 한다는 게 핵심이다.

- ESM: import/export가 정적 구조다. 어디서 무엇을 가져오는지 빌드 타임에 그대로 보인다 → tree shaking 강점.
- CJS: `module.exports`와 `require()`가 동적이다. run time에 export 이름을 바꾸거나, import 경로를 표현식으로 만들 수 있다 → 정적 분석이 어렵다.

### Reference
- https://webpack.js.org/guides/tree-shaking/

---

## CJS에서도 tree shaking이 가능한가?

### User Answer
제한적으로 가능하다.
`webpack-common-shake` 같은 도구가 있어, 코드가 일정 컨벤션을 지키면 부분적인 tree shaking이 가능하다.
다만 빌드 비용이 ESM 대비 크다.

### Reference
- https://web.dev/articles/commonjs-larger-bundles

---

## 모듈 시스템의 역사 흐름은 어떻게 정리되는가?

### User Answer
파편화 → 통합 시도 → 표준화의 흐름이다.
- 파편화: CJS(서버), AMD(브라우저)가 각각 사용됨.
- UMD: 두 환경 모두에서 동작하는 범용 포맷으로 통합.
- ESM (2015): ECMAScript 2015에서 표준화. 이후 modern 브라우저와 Node.js가 모두 지원.

### Reference
- https://web.dev/articles/commonjs-larger-bundles

---

## 번들러의 출력 모듈 형식 기본값이 ESM+UMD인 이유는?

### User Answer
Rollup, Webpack, Vite 같은 주요 번들러의 라이브러리 모드 출력 기본값이 ESM과 UMD를 같이 내는 이유는 호환 폭을 넓히기 위함이다.
- ESM: 현대 표준, tree shaking 친화.
- UMD: 구형 환경(브라우저 `<script>` 직접 로드, CJS 전용 환경)에 대응.

---

## 전체 앱을 ESM으로 통일하라는 권고의 출처는?

### User Answer
web.dev에서 전체 앱을 ESM으로 통일하고 CJS 의존을 회피하라고 권고한다.
Node.js issue #33954에서는 호환을 위한 변환의 변환의 변환이 누적되는 문제를 다룬다.

### Reference
- https://web.dev/articles/commonjs-larger-bundles
- https://github.com/nodejs/node/issues/33954
