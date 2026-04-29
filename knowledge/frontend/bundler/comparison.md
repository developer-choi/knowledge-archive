---
tags: [bundler, transpiler, comparison]
source: unverified
---

# Questions
- [UNVERIFIED] Webpack과 Vite의 차이는 무엇이고, Vite가 더 빠른 이유는?
- [UNVERIFIED] Vite의 plugin 시스템은 Webpack과 호환되는가?
- [UNVERIFIED] Babel, SWC, esbuild의 차이는?
- [UNVERIFIED] esbuild가 빠른 이유는?
- [UNVERIFIED] esbuild를 production 번들러로 쓰기에 부족한 점은?
- [UNVERIFIED] Turbopack은 무엇이고 현재 상태는?

---

# Answers

## [UNVERIFIED] Webpack과 Vite의 차이는 무엇이고, Vite가 더 빠른 이유는?

### AI Answer
핵심 차이는 **dev 서버 전략**이다.

Webpack은 dev 환경에서도 전체 의존성 그래프를 미리 번들한다. 그래서 프로젝트가 커질수록 dev 서버 시작 시간이 선형으로 증가한다. 큰 프로젝트는 1분 넘게 기다리는 일도 흔하다.

Vite는 발상을 뒤집었다. 공식 문서는 *"Dependencies (libraries that rarely change) are pre-bundled once using fast native tooling"* + *"Source code (your application code that changes frequently) is served on-demand over native ESM"*이라고 명시한다.

즉, **두 가지 전략을 병행**한다.
1. **node_modules 같은 의존성**은 사전 번들(과거 esbuild, Vite 8부터는 Rolldown). 자주 안 바뀌니까.
2. **소스 코드**는 번들 없이 native ESM으로 브라우저에 직접 서빙. 브라우저가 `import`를 만나면 그때그때 요청해 가져온다.

이러면 dev 서버 시작이 거의 즉시다. 변경이 있으면 변경된 모듈만 HMR로 교체한다.

production 빌드는 Vite도 번들링이 필요하다 (HTTP/2여도 수천 개 모듈을 개별 요청하면 느리니까). 과거 버전(Vite 7까지)은 Rollup을 썼고, **Vite 8(2026년 3월 stable 출시)부터 Rolldown(Rust 기반 번들러)을 단일 번들러로 채택**해 dev와 production 모두 Rolldown으로 처리한다.

**선택 기준**:
- 새 프로젝트: Vite 우선 검토. dev 경험이 압도적이다.
- 기존 Webpack 프로젝트: 마이그레이션 비용 고려. plugin 생태계가 다르고 일부 webpack 전용 도구는 안 된다.
- 라이브러리 빌드: Rollup이 더 적합하다.

### Reference
- https://vite.dev/guide/why
- https://vite.dev/blog/announcing-vite8

---

## [UNVERIFIED] Vite의 plugin 시스템은 Webpack과 호환되는가?

### AI Answer
Vite plugin은 **Rollup plugin API와 호환**된다. Vite 전용 hook도 추가로 있다. Webpack plugin은 호환되지 않으므로, Webpack 생태계에 깊이 의존하는 프로젝트는 마이그레이션이 까다로울 수 있다.

### Reference
- https://vite.dev/guide/api-plugin

---

## [UNVERIFIED] Babel, SWC, esbuild의 차이는?

### AI Answer
모두 트랜스파일러지만 **언어와 아키텍처**가 다르다.

| | 언어 | 속도 | 생태계 |
|---|---|---|---|
| Babel | JavaScript | 기준 | 가장 큼 |
| SWC | Rust | Babel의 **20배** (단일 스레드 기준) | 작지만 빠르게 성장 |
| esbuild | Go | 매우 빠름 | 작음, 주로 dev용 |

SWC 공식 벤치마크는 *"SWC is 20x faster than Babel on a single thread and 70x faster on four cores"* 라고 명시한다.

**현실적 선택**:
- Next.js 13 이상: 기본 컴파일러가 SWC. 별 일 없으면 그대로 쓴다.
- 라이브러리/도구 빌드: esbuild가 가벼워 자주 쓴다.
- 복잡한 변환 / 커스텀 plugin이 많은 경우: Babel이 아직 유리하다.

### Reference
- https://swc.rs/
- https://babeljs.io/docs/

---

## [UNVERIFIED] esbuild가 빠른 이유는?

### AI Answer
esbuild 공식 FAQ는 네 가지 이유를 제시한다.
1. **Go로 짜여 네이티브 코드로 컴파일됨** — *"It's written in Go and compiles to native code"*. JS 번들러는 JIT이라 매번 처음부터 최적화되지만, Go는 이미 최적화된 바이너리다.
2. **병렬화 적극 활용** — *"Parallelism is used heavily"*. Go는 스레드 간 메모리 공유가 가능해 파싱·코드 생성을 완전 병렬 처리한다.
3. **모든 걸 처음부터 직접 구현** — *"Everything in esbuild is written from scratch"*. 서드파티에 의존하지 않아 처음부터 성능 최적화가 고려됐다. TypeScript 파서도 직접 만들어 불필요한 타입 체크를 뺐다.
4. **메모리 효율** — *"Memory is used efficiently"*. AST를 3-pass만 처리(lex/parse → bind/transform → codegen)해 캐시 친화적이다.

### Reference
- https://esbuild.github.io/faq/#why-is-esbuild-fast

---

## [UNVERIFIED] esbuild를 production 번들러로 쓰기에 부족한 점은?

### AI Answer
공식 입장은 "production은 Rollup/Vite를 써라"이다. 이유는 다음과 같다.
1. code splitting이 webpack/Rollup만큼 정교하지 않다.
2. tree shaking이 일부 케이스에서 부족하다.
3. 번들 사이즈 최적화(compression, scope hoisting)가 덜 다듬어져 있다.

그래서 Vite도 7까지는 dev에 esbuild, production에 Rollup을 분리해서 썼다. Vite 8부터는 Rolldown(Rust)으로 통합됐다.

### Reference
- https://esbuild.github.io/faq/

---

## [UNVERIFIED] Turbopack은 무엇이고 현재 상태는?

### AI Answer
Turbopack은 Vercel이 만든 Rust 기반 번들러로, Next.js의 차세대 번들러다. **Next.js 16(2026년 출시)부터 Turbopack이 stable로 승격**돼 `next dev`와 `next build`의 default 번들러가 됐다.

특징:
- incremental computation engine을 핵심으로 둬 큰 프로젝트일수록 효과가 두드러진다.
- 16.x 버전대에서 filesystem caching(개발 중 컴파일 산출물을 디스크에 캐시)이 추가돼 재시작 컴파일 시간이 크게 줄었다.

도입 단계:
- Next.js 13: dev에 alpha로 등장.
- Next.js 14~15: dev stable, production은 검증 단계.
- Next.js 16: dev/build 둘 다 stable + default.

### Reference
- https://nextjs.org/docs/app/api-reference/turbopack
- https://nextjs.org/blog/next-16-2
