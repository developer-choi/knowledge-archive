---
tags: [javascript, concept, performance]
---

# Questions
- 번들러가 하는 일은 무엇인가?
- 트랜스파일링이 빠르고 번들링이 비싼 이유는?
- 컴파일러와 트랜스파일러는 어떻게 구분하는가?
- target 옵션이 변환에 어떻게 영향을 주는가?
- Rollup의 특징과 Vite와의 관계는?
- Webpack/Vite/Next.js/Turbopack의 관계는 어떻게 정리되는가?
- 번들러는 어떤 식으로 함수 호출을 인라인 최적화하는가?

---

# Answers

## 번들러가 하는 일은 무엇인가?

### User Answer
번들러는 다음 작업을 한다.
- Dependency management/resolution: 소스의 import를 분석해 의존성 그래프를 만들고 module resolution을 수행한다.
- De-duplication: 동일 모듈이 여러 번 포함되지 않도록 정리한다.
- 버전 불일치 보고: 같은 패키지의 호환되지 않는 버전이 섞이면 빌드 오류로 알린다.
- 네트워크 트래픽 절감: 다수의 모듈을 소수의 파일로 합쳐 요청 수를 줄인다.
- 최적화: minification, dead code elimination, tree-shaking, compression 등.

### Reference
- https://rollupjs.org/introduction/
- https://webpack.js.org/concepts/

---

## 트랜스파일링이 빠르고 번들링이 비싼 이유는?

### User Answer
트랜스파일링은 개별 파일/AST 단위로 변환하는 작업이라 병렬화가 쉽다.
번들링은 다르다 — 전체 모듈 그래프를 대상으로 다음 작업을 한다.
- Crawling: 진입점부터 의존성을 따라가며 모든 모듈을 수집.
- Resolution: 모듈 경로 해석.
- Concatenation: 여러 모듈을 합치기.
- 최적화: tree shaking 등.

이 모든 단계가 모듈 간 관계에 의존하기 때문에 트랜스파일링보다 본질적으로 비싸다.

---

## 컴파일러와 트랜스파일러는 어떻게 구분하는가?

### User Answer
일반적인 정의로는 컴파일러는 한 언어를 다른(주로 더 저수준) 언어로 변환하는 도구, 트랜스파일러는 같은 추상화 레벨의 다른 언어로 변환하는 도구다.

JS 생태계에서는 다음과 같이 정리할 수 있다.
- tsc: 타입 검사를 포함한 정확성 중시 트랜스파일러.
- esbuild: 타입 검사를 생략한 속도 중시 트랜스파일러.

### Review Note
- "tsc가 컴파일러인가 트랜스파일러인가"는 inbox 항목으로 추가 검토 필요.

---

## target 옵션이 변환에 어떻게 영향을 주는가?

### User Answer
TS/Babel 등의 target 옵션은 어느 ES 버전까지 지원할지를 정한다.
target이 낮으면 최신 문법을 구버전 문법으로 polyfill/lowering 한다.
- 예: target이 ES2019면 optional chaining (`?.`)이 ES2019 이전 문법으로 풀린다.
- target이 ES2020 이상이면 `?.`가 그대로 유지된다.

### Reference
- https://www.typescriptlang.org/tsconfig#target

---

## Rollup의 특징과 Vite와의 관계는?

### User Answer
Rollup은 ESM 지향 번들러다.
- Tree Shaking이 강점.
- 출력 포맷으로 es/umd/cjs/iife를 지원한다.
- `external` 옵션으로 특정 모듈을 번들에서 제외할 수 있다.

Vite와의 관계.
- dev: native ESM을 그대로 서빙 (Rollup 사용 X).
- production: Rollup으로 번들링해 정적 자산을 출력.

### Reference
- https://rollupjs.org/introduction/
- https://vite.dev/guide/why.html

---

## Webpack/Vite/Next.js/Turbopack의 관계는 어떻게 정리되는가?

### User Answer
- Webpack: 가장 널리 쓰이는 클래식 번들러.
- Vite: dev는 native ESM, prod는 Rollup으로 묶는 빌드 툴.
- Next.js: React 프레임워크. 내부적으로 Webpack을 써왔고, Turbopack으로 이전 중.
- Turbopack: Next.js의 차세대 번들러. 매우 빠른 incremental 빌드 지향.

주의 — **Turbopack ≠ Turborepo**.
- Turbopack: 번들러. 영향 범위가 패키지 1개.
- Turborepo: 모노레포 task runner. 영향 범위가 모노레포 전체.

### Reference
- https://turbo.build/pack
- https://turbo.build/repo

---

## 번들러는 어떤 식으로 함수 호출을 인라인 최적화하는가?

### User Answer
번들러/컴파일러의 인라인 최적화는 작은 함수의 호출을 호출 지점의 식으로 직접 치환하는 작업이다.
예시.
- 원본: `const r = add(1, 2)` (`add`가 단순히 두 인자를 더하는 함수)
- 인라인 후: `const r = 1 + 2`

함수 호출 오버헤드가 사라지고, 후속 최적화(상수 폴딩 등)가 따라붙을 수 있다.
