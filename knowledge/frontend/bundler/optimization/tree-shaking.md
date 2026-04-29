---
tags: [bundler, webpack, optimization, tree-shaking]
source: unverified
---

# Questions
- [UNVERIFIED] Tree shaking이 무엇이고 어떻게 동작하는가?
- [UNVERIFIED] Tree shaking이 안 되는 흔한 케이스는?
- [UNVERIFIED] lodash 같은 CommonJS 라이브러리에서 tree shaking을 챙기려면?

---

# Answers

## [UNVERIFIED] Tree shaking이 무엇이고 어떻게 동작하는가?

### AI Answer
Tree shaking은 사용하지 않는 코드(dead code)를 번들에서 제거하는 최적화다. Webpack 공식 정의는 *"It relies on the static structure of ES2015 module syntax, i.e. import and export"*. 즉, **ES module의 정적 구조** 덕분에 가능한 최적화다.

ES module은 `import`/`export`가 컴파일 타임에 분석 가능해 어떤 export가 어디서 쓰이는지 정적으로 추적할 수 있다. 반면 CommonJS의 `require`는 런타임에 결정되니 정적 분석이 불가능해 tree shaking이 안 된다.

Webpack에서 tree shaking을 제대로 동작시키려면 조건이 몇 가지 있다.
1. **ES module 문법 사용** — `import`/`export`. CommonJS는 안 됨.
2. **Babel이 ES module을 CommonJS로 변환하지 않게** — `@babel/preset-env`의 `modules: false` 옵션. 기본값이 변환이라 명시가 필요하다.
3. **`mode: 'production'`** — TerserPlugin이 unused export를 실제로 제거한다.
4. **`package.json`의 `sideEffects` 플래그** — 어떤 파일이 부작용 없는지 명시한다.

여기서 자주 헷갈리는 게 `usedExports`(좁은 의미의 tree shaking)와 `sideEffects`의 차이다. 공식 문서는 *"`sideEffects` is much more effective since it allows to skip whole modules/files and the complete subtree"* 라고 명시한다.
- **`usedExports`**: terser가 개별 export 단위로 분석해 안 쓰이는 걸 제거한다. 효과 범위가 좁다.
- **`sideEffects: false`**: "이 패키지의 어떤 파일도 import만으로 부작용을 일으키지 않는다"는 선언. webpack이 **파일 통째로** 의존성 그래프에서 빼버릴 수 있다.

부작용 있는 파일(예: `import "./polyfill"`, `import "./global.css"`)이 있으면 `sideEffects` 배열에 명시해야 한다.
```json
{ "sideEffects": ["**/*.css", "./src/polyfills.js"] }
```

이걸 잘못 설정하면 CSS가 통째로 사라지는 사고가 난다.

### Reference
- https://webpack.js.org/guides/tree-shaking/

---

## [UNVERIFIED] Tree shaking이 안 되는 흔한 케이스는?

### AI Answer
- CommonJS로 작성된 라이브러리 (`require` 사용).
- Babel이 ES module을 CommonJS로 변환했을 때.
- Re-export 체인 중간에 부작용 import가 끼었을 때.
- `sideEffects: false`로 해놓고 실제로는 부작용 있는 파일이 있을 때 (예: CSS가 사라지는 사고).

### Reference
- https://webpack.js.org/guides/tree-shaking/

---

## [UNVERIFIED] lodash 같은 CommonJS 라이브러리에서 tree shaking을 챙기려면?

### AI Answer
lodash 본체는 CommonJS라 tree shaking이 안 된다. 두 가지 우회법이 있다.
- `lodash-es` (ES module 빌드)를 쓴다.
- `import debounce from 'lodash/debounce'`처럼 직접 경로 import를 쓴다.

`import { debounce } from 'lodash'`는 전체 라이브러리가 들어와 무거워진다.

### Reference
- https://webpack.js.org/guides/tree-shaking/
