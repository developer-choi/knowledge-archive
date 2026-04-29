---
tags: [bundler, webpack, optimization, code-splitting]
source: unverified
---

# Questions
- [UNVERIFIED] Code splitting이 무엇이고 어떤 방식들이 있는가?
- [UNVERIFIED] 번들 사이즈는 어떻게 분석하는가?
- [UNVERIFIED] Webpack의 dynamic import에서 prefetch와 preload는 어떻게 다른가?

---

# Answers

## [UNVERIFIED] Code splitting이 무엇이고 어떤 방식들이 있는가?

### AI Answer
Code splitting은 번들을 여러 청크로 나눠 필요할 때만 로드하는 전략이다. Webpack 공식은 세 가지 방식을 제시한다.

**첫째, Entry points 다중 지정.**
```javascript
entry: { index: './src/index.js', another: './src/another.js' }
```
간단하지만 두 청크 간에 같은 라이브러리(예: lodash)가 중복으로 들어갈 수 있다.

**둘째, SplitChunksPlugin** — 자동으로 공통 의존성을 별도 청크로 추출.
```javascript
optimization: { splitChunks: { chunks: 'all' } }
```
가장 일반적인 방식이다. vendor 청크를 자동으로 만들어줘서 캐시 효율이 좋아진다.

**셋째, Dynamic import** — 권장되는 방식.
```javascript
const module = await import('./heavy-feature.js');
```
런타임에 필요할 때만 로드한다. React에서는 `React.lazy(() => import('./Component'))` 패턴으로 라우트별·모달별 lazy loading을 구성한다.

실무에서는 보통 SplitChunksPlugin으로 vendor 분리 + Dynamic import로 라우트별 분할을 함께 쓴다.

### Reference
- https://webpack.js.org/guides/code-splitting/

---

## [UNVERIFIED] 번들 사이즈는 어떻게 분석하는가?

### AI Answer
`webpack-bundle-analyzer`로 시각적으로 확인한다. 청크별로 어떤 모듈이 얼마나 차지하는지 트리맵으로 보여줘 큰 모듈을 쉽게 찾을 수 있다. CRA나 Next.js에서도 통합돼 있다.

### Reference
- https://github.com/webpack-contrib/webpack-bundle-analyzer

---

## [UNVERIFIED] Webpack의 dynamic import에서 prefetch와 preload는 어떻게 다른가?

### AI Answer
Webpack은 magic comment를 지원한다.
- `import(/* webpackPrefetch: true */ './module')` — 부모 청크 로드 후, 브라우저가 idle인 시간에 다운로드. 공식 표현으로 *"resource is probably needed for some navigation in the future"*.
- `import(/* webpackPreload: true */ './module')` — 부모 청크와 병렬로 다운로드, 즉시 우선순위. *"resource will also be needed during the current navigation"*.

용도 구분: "곧 쓸 가능성 있다"(예: 모달)는 prefetch, "지금 쓸 거다"는 preload.

### Reference
- https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules
