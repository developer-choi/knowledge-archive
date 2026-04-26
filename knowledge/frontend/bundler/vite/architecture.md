---
tags: [javascript, principle, performance]
---

# Questions
- Vite는 무엇인가?
- Vite가 해결하려는 핵심 문제는 무엇인가?
- Vite는 dependencies를 어떻게 처리하는가? (Pre-bundle)
- Vite는 source code를 어떻게 처리하는가?
- Production에서는 왜 번들링을 유지하는가?
- Tree-shaking은 번들링 없이 가능한가?
- Chunk Splitting은 번들링 없이 가능한가?
- 결국 dev/prod의 동작 일관성을 Vite는 어떻게 다루는가?

---

# Answers

## Vite는 무엇인가?

### Official Answer
Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.
It consists of two major parts:
- A dev server that provides rich feature enhancements over native ES modules, for example extremely fast Hot Module Replacement (HMR).
- A build command that bundles your code with Rollup, pre-configured to output highly optimized static assets for production.

### Reference
- https://vite.dev/guide/why.html

---

## Vite가 해결하려는 핵심 문제는 무엇인가?

### Official Answer
The slow server start.

When cold-starting the dev server, a bundler-based build setup has to eagerly crawl and build your entire application before it can be served.

### User Annotation
기존 번들러 기반 dev 서버는 시작 시점에 전체 앱을 eagerly 크롤링·빌드한다.
Vite는 이 cold start 비용을 줄이는 게 출발점이다.

### Reference
- https://vite.dev/guide/why.html#the-problems

---

## Vite는 dependencies를 어떻게 처리하는가? (Pre-bundle)

### Official Answer
Vite improves dev server start time by first dividing the modules in an application into two categories: dependencies and source code.

Dependencies are mostly plain JavaScript that do not change often during development.
Vite pre-bundles dependencies using esbuild.
esbuild is written in Go and pre-bundles dependencies 10-100x faster than JavaScript-based bundlers.

### User Annotation
- dependencies는 자주 변하지 않지만 처리 비용이 크기 때문에 첫 실행 시 esbuild로 pre-bundle 한다.
- 변환 작업: CommonJS/UMD를 ESM으로 변환.
- bare import (`from 'react'`)를 `/node_modules/.vite/deps/...?v=hash` 형태로 rewrite 한다.
- lodash-es 같이 600+ 내부 모듈을 가진 패키지를 단일 모듈로 합쳐, dev에서 모듈마다 HTTP 요청이 폭증하는 것을 막는다.

### Reference
- https://vite.dev/guide/why.html#slow-server-start

---

## Vite는 source code를 어떻게 처리하는가?

### Official Answer
Vite serves source code over native ESM.
This is essentially letting the browser take over part of the job of a bundler: Vite only needs to transform and serve source code on demand, as the browser requests it.

### User Annotation
- 사용자 소스 코드는 자주 수정되고 변환이 필요하다.
- native ESM으로 그대로 서빙하면, 브라우저가 import 그래프를 따라가며 필요한 모듈만 요청한다.
- route-based code splitting까지 적용하면 동시에 많은 모듈이 로드되는 상황을 피할 수 있다.

### Reference
- https://vite.dev/guide/why.html#slow-server-start

---

## Production에서는 왜 번들링을 유지하는가?

### Official Answer
Despite native ESM now being widely supported, shipping unbundled ESM in production is still inefficient (even with HTTP/2) due to the additional network round trips caused by nested imports.
To get the optimal loading performance in production, it is still better to bundle your code with tree-shaking, lazy-loading and common chunk splitting (for better caching).

### User Annotation
dev에서는 unbundled ESM이 빠르지만, prod에서는 nested imports의 round trip 때문에 비효율적이다.
prod에서는 tree-shaking, lazy-loading, common chunk splitting을 위해 번들링을 유지한다.

### Reference
- https://vite.dev/guide/why.html#why-bundle-for-production

---

## Tree-shaking은 번들링 없이 가능한가?

### User Answer
실질적으로 어렵다.
tree-shaking은 전체 모듈 그래프를 정적 분석해서 안 쓰이는 export를 제거하는 작업이다.
브라우저는 개별 파일을 그냥 실행할 뿐이고, 그래프 전체를 보지 않는다.
따라서 번들링 단계 없이 unbundled로 서빙하면 tree-shaking을 사실상 적용할 수 없다.

---

## Chunk Splitting은 번들링 없이 가능한가?

### User Answer
청크 분할은 본질적으로 번들링 과정의 일부다.
unbundled 환경에서는 각 소스 파일이 이미 개별 파일이다 — "여러 모듈을 한 청크로 묶고, 어떤 청크부터 로드한다"는 청크 개념 자체가 의미를 잃는다.
번들링 단계가 있어야 청크 분할이라는 최적화도 의미가 있다.

---

## 결국 dev/prod의 동작 일관성을 Vite는 어떻게 다루는가?

### Official Answer
We do not recommend just running a development server in production.
The features and performance of Vite's development server is fundamentally different.

### User Annotation
dev와 prod의 목표가 다르므로 behavioral consistency를 완벽히 맞추기는 어렵다.
Vite는 그 대신 미리 구성된 build 명령을 함께 제공한다 — 사용자가 직접 최적화를 짜지 않아도 prod에 적합한 산출물이 나오도록.

### Reference
- https://vite.dev/guide/why.html
