# Vite는 무엇인가?

## 도입

Vite는 빠르고 가벼운 개발 경험을 목표로 만든 빌드 도구다. 기존 번들러 기반 dev 서버가 전체 앱을 미리 번들링해야 했던 문제를 해결하기 위해 등장했으며, dev와 production에서 서로 다른 전략을 쓴다.

---

## 본문

> Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.

"Vite는 현대 웹 프로젝트에 더 빠르고 가벼운 개발 경험을 제공하는 것을 목표로 하는 빌드 도구다."

- **build tool**: 번들러보다 넓은 범주. dev 서버, HMR, 번들링까지 포함하는 통합 도구다.
- **faster and leaner**: 기존 Webpack 기반 dev 서버와 비교했을 때의 차별점. cold start 시간과 HMR 속도가 핵심 지표다.
- **modern web projects**: native ESM을 지원하는 브라우저를 타깃으로 한다는 의미가 내포되어 있다.

> It consists of two major parts: A dev server that provides rich feature enhancements over native ES modules, for example extremely fast Hot Module Replacement (HMR). A build command that bundles your code with Rollup, pre-configured to output highly optimized static assets for production.

"두 주요 부분으로 구성된다: native ES modules 위에 풍부한 기능 향상을 제공하는 dev 서버(예: 극도로 빠른 HMR), 그리고 production을 위해 고도로 최적화된 정적 자산을 출력하도록 미리 구성된 Rollup 번들 명령."

- **native ES modules**: 브라우저가 `<script type="module">`로 직접 `import`를 처리하는 것. Vite dev 서버는 이 위에서 동작한다.
- **Hot Module Replacement (HMR)**: 전체 페이지를 새로고침하지 않고 변경된 모듈만 교체하는 기능. Vite의 HMR은 번들 크기와 무관하게 일정한 속도를 유지한다.
- **pre-configured**: 사용자가 Rollup 설정을 직접 짜지 않아도 된다는 의미. Vite가 합리적인 기본값을 제공한다.

```
Vite 두 모드
├── dev 서버    native ESM 서빙 + HMR
│               브라우저가 import 그래프를 따라가며 요청
│               변경된 파일만 on-demand 트랜스파일
│
└── production  Rollup 번들링
                Tree Shaking + Chunk Splitting + 정적 자산 최적화
```

---

## 종합

Vite의 핵심 아이디어는 "dev에서 번들링하지 않는다"다. 브라우저가 native ESM을 지원하니, 번들링을 브라우저에 위임하고 서버는 요청이 들어온 파일만 즉시 변환해서 준다. Webpack이 `vite dev` 서버를 대체하려면 전체 앱을 먼저 번들링해야 했지만, Vite는 cold start에서 번들링을 하지 않으므로 프로젝트 규모와 무관하게 시작이 빠르다.

---

# Vite가 해결하려는 핵심 문제는 무엇인가?

## 도입

Vite가 등장한 맥락을 이해하려면 기존 번들러 기반 dev 서버의 문제를 알아야 한다. 프로젝트가 커질수록 느려지는 cold start가 핵심 문제다.

---

## 본문

> The slow server start. When cold-starting the dev server, a bundler-based build setup has to eagerly crawl and build your entire application before it can be served.

"느린 서버 시작. dev 서버를 cold-start할 때, 번들러 기반 빌드 설정은 서빙 가능해지기 전에 전체 애플리케이션을 eagerly 크롤링하고 빌드해야 한다."

- **cold-starting**: 캐시 없이 처음 서버를 시작하는 상황. 이전 빌드 캐시가 없으므로 모든 모듈을 처음부터 처리해야 한다.
- **eagerly**: 필요해지기 전에 미리 처리한다는 뜻. 사용자가 특정 페이지를 열기 전에 앱 전체를 빌드한다.
- **crawl and build your entire application**: 의존성 그래프를 모두 탐색하고 번들을 완성하기까지의 과정. 모듈이 1000개면 1000개를 모두 처리해야 서버가 뜬다.

기존 번들러 기반 dev 서버는 시작 시점에 전체 앱을 eagerly 크롤링·빌드한다. Vite는 이 cold start 비용을 줄이는 게 출발점이다.

```
기존 번들러 dev 서버                Vite dev 서버
npm run dev                         npm run dev
  │                                   │
  ▼                                   ▼
전체 앱 크롤링                        서버 즉시 시작
  │                                   │
번들 생성 (5~30초)                    브라우저 첫 요청
  │                                   │
서버 준비                              요청된 파일만 변환 (ms 단위)
```

---

## 종합

기존 dev 서버의 cold start 문제는 프로젝트가 커질수록 선형으로 악화된다. 모듈 500개짜리 앱과 5000개짜리 앱의 cold start 시간이 10배 차이 나는 이유다. Vite는 "전체를 미리 번들링"에서 "요청이 들어오면 그때 변환"으로 패러다임을 전환해 이 문제를 구조적으로 해결했다.

---

# Vite는 dependencies를 어떻게 처리하는가? (Pre-bundle)

## 도입

Vite는 모듈을 두 종류로 나눈다. 자주 바뀌지 않는 외부 라이브러리(dependencies)와 개발자가 직접 작성하는 소스 코드(source code). 두 종류는 특성이 다르므로 처리 방식도 다르다.

---

## 본문

> Vite improves dev server start time by first dividing the modules in an application into two categories: dependencies and source code.

"Vite는 앱의 모듈을 두 카테고리로 나누어 dev 서버 시작 시간을 개선한다: dependencies와 source code."

- **dividing into two categories**: 이 분리가 Vite 아키텍처의 핵심 결정이다. 두 종류의 모듈은 변경 빈도와 처리 비용이 다르므로 전략도 달라야 한다.

> Dependencies are mostly plain JavaScript that do not change often during development. Vite pre-bundles dependencies using esbuild. esbuild is written in Go and pre-bundles dependencies 10-100x faster than JavaScript-based bundlers.

"dependencies는 개발 중 자주 변하지 않는 일반 JavaScript다. Vite는 esbuild를 사용해 dependencies를 pre-bundle한다. esbuild는 Go로 작성되어 JavaScript 기반 번들러보다 10~100배 빠르게 dependencies를 pre-bundle한다."

- **pre-bundles**: 첫 실행 시 미리 번들링해두는 것. 이후 요청에서는 캐시된 결과를 바로 제공한다.
- **10-100x faster**: Go의 성능 이점. esbuild는 멀티스레딩과 Go의 낮은 오버헤드를 활용한다.

- dependencies는 자주 변하지 않지만 처리 비용이 크기 때문에 첫 실행 시 esbuild로 pre-bundle한다.
- CommonJS/UMD 패키지를 ESM으로 변환한다 (native ESM 서버와 호환되도록).
- bare import(`from 'react'`)를 `/node_modules/.vite/deps/...?v=hash` 형태로 rewrite해서 브라우저가 직접 접근 가능하게 만든다.
- `lodash-es`처럼 600개 이상의 내부 모듈을 가진 패키지를 하나로 합쳐 dev에서 HTTP 요청 폭증을 막는다.

```
Pre-bundle 결과
node_modules/lodash-es  (600+ 파일)
  └─ esbuild pre-bundle →  .vite/deps/lodash-es.js  (1 파일)

브라우저 요청
before: import { debounce } from 'lodash-es' → 600+ 요청
after:  import { debounce } from '/.vite/deps/lodash-es.js' → 1 요청
```

---

## 종합

Pre-bundling은 "dependencies는 자주 안 바뀐다"는 특성을 활용한 캐싱 전략이다. `package.json`이나 lockfile이 바뀌지 않으면 `.vite/deps` 캐시를 재사용하므로 두 번째 `vite dev`부터는 dependency 처리가 즉시 완료된다. CommonJS 패키지를 ESM으로 변환하는 것도 이 단계에서 처리되어, Vite의 native ESM 서빙과 호환된다.

---

# Vite는 source code를 어떻게 처리하는가?

## 도입

소스 코드는 dependencies와 반대다. 자주 바뀌고 TypeScript·JSX 같은 변환이 필요하지만, 미리 전체를 번들링하면 cold start가 느려진다. Vite의 해답은 native ESM으로 서빙하고 요청이 들어온 파일만 그때 변환하는 것이다.

---

## 본문

> Vite serves source code over native ESM.

"Vite는 native ESM으로 소스 코드를 서빙한다."

- **native ESM**: 브라우저 자체가 `<script type="module">` 안의 `import` 구문을 처리하는 것. Vite는 번들링 없이 원본 파일 경로를 그대로 브라우저에 노출한다.

> This is essentially letting the browser take over part of the job of a bundler: Vite only needs to transform and serve source code on demand, as the browser requests it.

"이것은 본질적으로 브라우저가 번들러의 일부 역할을 대신 맡게 하는 것이다: Vite는 브라우저가 요청할 때 on-demand로 소스 코드를 변환하고 서빙하기만 하면 된다."

- **take over part of the job of a bundler**: 번들러가 하던 의존성 그래프 탐색을 브라우저가 import 구문을 따라가며 대신 수행한다.
- **on demand**: 브라우저가 `Button.tsx`를 요청할 때만 그 파일을 esbuild로 변환한다. 요청하지 않은 파일은 변환하지 않는다.

- native ESM으로 그대로 서빙하면, 브라우저가 import 그래프를 따라가며 필요한 모듈만 요청한다.
- route-based code splitting을 적용하면 현재 페이지에 필요한 모듈만 로드된다.

```
Vite source code 서빙 흐름
브라우저 → import src/main.tsx 요청
  │
  ▼
Vite: main.tsx가 요청됨 → esbuild로 변환 → 응답
  │
브라우저: main.tsx 파싱 → import Button from './Button' 발견
  │
브라우저 → Button.tsx 요청
  │
  ▼
Vite: Button.tsx 변환 → 응답
(방문하지 않은 페이지의 파일은 요청 없음 = 변환 없음)
```

---

## 종합

"요청 시에만 변환"이라는 원칙 덕분에 Vite dev 서버의 시작 시간은 프로젝트 규모와 거의 무관하다. 1000개 모듈 중 현재 페이지에서 사용하는 50개만 변환하면 되기 때문이다. 반면 HMR도 이 구조를 활용한다 — 수정된 파일 하나만 다시 변환해서 브라우저에 보내면 되므로, 번들 전체를 다시 빌드하지 않는다.

---

# Production에서는 왜 번들링을 유지하는가?

## 도입

dev에서 unbundled native ESM이 빠른 것은 분명하다. 그렇다면 production에서도 그렇게 하면 되지 않을까? Vite의 공식 답변은 "여전히 비효율적"이다.

---

## 본문

> Despite native ESM now being widely supported, shipping unbundled ESM in production is still inefficient (even with HTTP/2) due to the additional network round trips caused by nested imports.

"native ESM이 이제 광범위하게 지원되더라도, nested imports로 인한 추가 네트워크 round trip 때문에 unbundled ESM을 production에 배포하는 것은 여전히 비효율적이다 (HTTP/2에서도 마찬가지)."

- **nested imports**: `main.tsx`가 `Button.tsx`를 import하고, `Button.tsx`가 `Icon.tsx`를 import하는 식의 중첩 구조. 브라우저는 각 파일을 받아봐야 다음 import를 알 수 있어서 round trip이 깊이만큼 직렬화된다.
- **additional network round trips**: 깊이 10인 import 트리는 최악의 경우 10번의 순차 요청이 필요하다. HTTP/2 멀티플렉싱도 이 직렬 의존 구조는 해결하지 못한다.

> To get the optimal loading performance in production, it is still better to bundle your code with tree-shaking, lazy-loading and common chunk splitting (for better caching).

"production에서 최적의 로딩 성능을 얻으려면, tree-shaking, lazy-loading, common chunk splitting(더 나은 캐싱을 위해)을 활용해 코드를 번들링하는 것이 여전히 낫다."

- **tree-shaking**: 사용하지 않는 export를 제거. unbundled 환경에서는 전체 모듈 그래프를 보지 않으므로 불가능하다.
- **lazy-loading**: 필요할 때만 청크를 로드. 번들 단계에서 코드 분할이 이뤄져야 의미가 있다.
- **common chunk splitting**: 여러 페이지에서 공통으로 쓰는 코드를 별도 청크로 분리해 브라우저 캐시를 재활용한다.

dev에서는 unbundled ESM이 빠르지만, prod에서는 nested imports의 round trip 때문에 비효율적이다. prod에서는 tree-shaking, lazy-loading, common chunk splitting을 위해 번들링을 유지한다.

---

## 종합

dev와 prod는 목표가 다르다. dev는 개발자 피드백 루프(HMR 속도, cold start)를 최소화하는 것이, prod는 사용자 초기 로딩 속도와 캐싱 효율을 최대화하는 것이 목표다. 같은 방법으로 두 목표를 동시에 달성할 수 없으므로 Vite는 두 모드를 명시적으로 분리한다.

---

# [UNVERIFIED] Tree-shaking은 번들링 없이 가능한가?

## 도입

Tree Shaking은 "사용하지 않는 코드를 제거한다"는 최적화다. 직관적으로는 각 파일에서 미사용 export를 지우면 될 것 같지만, 실제로는 전체 모듈 그래프를 분석해야 "이 export가 정말 아무도 안 쓰는가"를 알 수 있다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**왜 번들링 없이 어려운가.** Tree Shaking은 전체 모듈 그래프를 정적 분석해서 "어떤 export가 실제로 import되는가"를 파악한다. 파일을 개별로 보면 `utils.ts`의 `formatDate` 함수가 어디서도 import되지 않는다고 판단할 수 없다 — 다른 파일에서 쓸 수도 있기 때문이다.

**브라우저의 한계.** 브라우저는 파일을 개별로 실행한다. 전체 import 그래프를 먼저 수집하고 분석하는 단계가 없으므로, "이 함수가 결국 아무도 안 쓴다"는 결론을 낼 수 없다.

```
Tree Shaking 판단 과정
utils.ts exports: formatDate, formatTime, formatCurrency

번들러: 전체 그래프 분석
  - main.tsx → import formatDate ← 사용됨
  - 다른 어느 파일도 formatTime, formatCurrency를 import 안 함
  → formatTime, formatCurrency는 제거 가능

브라우저: utils.ts 요청받음
  - 이 파일의 export 중 어떤 게 다른 파일에서 쓰이는지 모름
  → 제거 불가
```

---

## 종합

Tree Shaking이 번들링 단계에서만 효과적인 이유는, "미사용 export 판단"이 전체 그래프를 본 뒤에야 가능하기 때문이다. 이것이 Vite가 production에서 Rollup 번들링을 유지하는 이유 중 하나다. dev에서 unbundled로 서빙할 때는 Tree Shaking이 적용되지 않지만, 어차피 dev는 성능이 아닌 개발 속도가 목표라서 괜찮다.

---

# [UNVERIFIED] Chunk Splitting은 번들링 없이 가능한가?

## 도입

코드 분할(Chunk Splitting)은 "번들을 여러 청크로 나눠서 필요할 때만 로드한다"는 최적화다. 이 개념 자체가 번들링을 전제로 한다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**청크 분할의 전제.** 청크 분할은 "여러 모듈을 한 청크로 묶는다"는 작업이다. 묶으려면 먼저 여러 모듈을 하나로 합치는 번들링이 있어야 한다. unbundled 환경에서는 각 소스 파일이 이미 개별 파일이므로, 청크라는 단위 자체가 의미를 잃는다.

**"이미 개별 파일"의 의미.** native ESM 서빙에서는 `Button.tsx`, `Modal.tsx`, `utils.ts`가 각각 독립 파일로 서빙된다. 이를 "vendor chunk"와 "app chunk"로 나눈다는 것은 의미가 없다 — 이미 파일 단위로 나뉘어 있기 때문이다.

**번들링이 있어야 의미가 생기는 이유.** 번들러가 여러 파일을 `vendor.js`, `main.js`로 합치는 단계가 있어야, "이 청크는 자주 안 바뀌니 캐시를 오래 유지"라는 캐싱 전략이 가능해진다.

---

## 종합

Chunk Splitting은 "먼저 합쳐야 나눌 수 있다"는 역설적 구조다. Vite가 production에서 Rollup으로 번들링하면서 동시에 코드 분할을 적용하는 이유다. `build.rollupOptions.output.manualChunks`로 청크 분할 전략을 직접 지정할 수 있다.

---

# 결국 dev/prod의 동작 일관성을 Vite는 어떻게 다루는가?

## 도입

dev와 prod가 다른 방식으로 동작한다면, dev에서 잘 되던 것이 prod에서 깨지는 문제가 생길 수 있다. Vite는 이 일관성 문제를 어떻게 다루는가?

---

## 본문

> We do not recommend just running a development server in production. The features and performance of Vite's development server is fundamentally different.

"우리는 production에서 development server를 그냥 실행하는 것을 권장하지 않는다. Vite의 development server의 기능과 성능은 근본적으로 다르다."

- **fundamentally different**: 단순히 설정 차이가 아니라 동작 방식 자체가 다르다. dev는 native ESM + on-demand 변환, prod는 Rollup 번들링. 두 방식은 성능 특성, 모듈 해석 방식, 최적화 모두 다르다.

dev와 prod의 목표가 다르므로 behavioral consistency를 완벽히 맞추기는 어렵다. Vite는 그 대신 미리 구성된 build 명령을 함께 제공한다 — 사용자가 직접 최적화를 짜지 않아도 prod에 적합한 산출물이 나오도록.

```
dev vs prod 동작 비교
                dev                     prod
모듈 서빙        native ESM (unbundled)   Rollup 번들 (bundled)
변환 타이밍      on-demand (요청 시)       빌드 타임 (사전)
Tree Shaking    X                         O
HMR             O                         X
최적화           최소                      최대 (minify, compress)
```

---

## 종합

dev/prod 불일치 버그를 피하려면 배포 전에 반드시 `vite build`로 빌드하고 `vite preview`로 production 번들을 로컬에서 미리 확인해야 한다. Vite가 `preview` 명령을 제공하는 이유가 여기에 있다. "dev에서 됐으니 prod도 되겠지"는 Vite 아키텍처에서 통하지 않는 가정이다.
