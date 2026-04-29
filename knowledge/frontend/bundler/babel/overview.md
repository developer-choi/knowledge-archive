---
tags: [bundler, babel, transpiler, concept]
source: unverified
---

# Questions
- [UNVERIFIED] Babel은 왜 필요한가?
- [UNVERIFIED] Babel과 TypeScript 컴파일러는 어떻게 같이 쓰는가?
- [UNVERIFIED] Babel preset과 plugin 실행 우선순위는 어떻게 되는가?

---

# Answers

## [UNVERIFIED] Babel은 왜 필요한가?

### AI Answer
Babel은 공식 정의로 *"a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript"*. 즉, 최신 JS 문법을 구형 브라우저용으로 변환하는 트랜스파일러다.

크게 두 가지 일을 한다.

**첫째, 문법 변환(Syntax Transformation)**. 화살표 함수, 클래스, async/await, optional chaining 같은 새 문법을 ES5 등가 코드로 바꿔준다.

**둘째, 폴리필링(Polyfilling)**. 새 문법은 변환되지만, `Promise`, `Array.prototype.includes`, `Map` 같은 새 API는 변환만으로는 안 되니 런타임에 구현체를 주입해야 한다. Babel은 보통 `core-js`라는 폴리필 라이브러리와 함께 쓴다.

### Reference
- https://babeljs.io/docs/

---

## [UNVERIFIED] Babel과 TypeScript 컴파일러는 어떻게 같이 쓰는가?

### AI Answer
두 가지 패턴이 있다.
1. `tsc`로 타입 체크 + 변환 둘 다 처리.
2. `@babel/preset-typescript`로 Babel이 변환만 담당하고, 타입 체크는 별도로 `tsc --noEmit`으로 처리.

후자가 빌드 속도가 빨라서 최근에는 더 자주 쓴다.

### Reference
- https://babeljs.io/docs/babel-preset-typescript

---

## [UNVERIFIED] Babel preset과 plugin 실행 우선순위는 어떻게 되는가?

### AI Answer
공식 규칙은 세 가지다.
- **Plugin이 Preset보다 먼저 실행**된다 (*"Plugins run before Presets."*).
- **Plugin은 위에서 아래로** 실행된다 (*"Plugin ordering is first to last."*).
- **Preset은 아래에서 위로**, 즉 역순으로 실행된다 (*"Preset ordering is reversed (last to first)."*).

이 규칙을 모르면 preset 안의 plugin이 의도한 순서로 안 돌아 디버깅이 어려워질 수 있다.

### Reference
- https://babeljs.io/docs/plugins/#plugin-ordering
