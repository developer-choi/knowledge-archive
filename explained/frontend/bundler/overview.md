# [UNVERIFIED] 번들러가 하는 일은 무엇인가?

## 도입

번들러의 역할은 "파일을 합치는 것"으로 단순화되기 쉽지만, 실제로는 의존성 그래프 분석부터 코드 최적화까지 여러 단계를 거친다. Rollup 공식문서는 번들러의 역할을 "dependency management, de-duplication, 버전 불일치 보고, 네트워크 최적화, 코드 최적화"로 정리한다.

---

## 본문

User Answer 기반(Rollup·Webpack 공식문서 참조)이므로 인용 없이 해설한다.

**Dependency management/resolution.** 번들러는 진입점(`index.ts`)에서 시작해 `import`를 재귀적으로 따라가며 전체 모듈 그래프를 만든다. `from 'react'` 같은 bare import를 실제 파일 경로로 해석하는 module resolution도 이 단계에서 수행한다.

**De-duplication.** 여러 모듈이 같은 패키지를 import하면 그 패키지는 번들에 한 번만 포함된다. 없으면 `lodash`가 10개 모듈에서 각각 import될 때마다 중복으로 포함되어 번들 크기가 폭증한다.

**버전 불일치 보고.** 같은 패키지의 호환되지 않는 버전이 의존성 트리에 섞이면 번들러가 빌드 오류로 알린다. 런타임에 조용히 깨지는 것을 빌드 타임에 방지한다.

**네트워크 트래픽 절감.** 다수의 모듈을 소수의 파일로 합쳐 HTTP 요청 수를 줄인다.

**최적화.** minification(변수명 단축, 공백 제거), dead code elimination, tree-shaking(사용 안 하는 export 제거), compression(gzip/brotli) 등.

```
번들러 파이프라인
index.ts
  │
  ├── Crawl: import 재귀 추적 → 모듈 그래프
  │
  ├── Resolution: bare import → 파일 경로 해석
  │
  ├── De-duplication: 중복 모듈 제거
  │
  ├── Tree Shaking: 미사용 export 제거
  │
  ├── Concatenation: 모듈 병합
  │
  └── Minification + Compression → bundle.js
```

---

## 종합

번들러는 의존성 그래프를 분석하고 최적화된 출력물을 생성하는 파이프라인이다. `vite build`나 `webpack --mode production`을 실행할 때 이 과정이 한 번에 돌아간다. 번들러 없이 `node_modules`를 그대로 브라우저에 서빙하면 수천 개의 HTTP 요청, 중복 코드, 미사용 코드가 포함된 채 전달된다.

---

---

# [UNVERIFIED] 트랜스파일링이 빠르고 번들링이 비싼 이유는?

## 도입

`esbuild`로 TypeScript를 트랜스파일하면 밀리초 단위로 끝나지만, Webpack 번들링은 초 단위가 걸리는 이유가 있다. 트랜스파일링은 파일 하나를 독립적으로 변환하는 작업이고, 번들링은 전체 모듈 간 관계를 분석해야 하기 때문이다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**트랜스파일링의 특성.** 파일 하나(`Button.tsx`)를 받아 JS로 변환하는 작업이다. 다른 파일을 참조하지 않아도 되므로 파일들을 완전히 병렬로 처리할 수 있다. CPU 코어 수만큼 동시에 처리하면 규모를 선형으로 늘릴 수 있다.

**번들링의 특성.** 전체 모듈 그래프를 대상으로 아래 단계를 순차적으로 처리한다.
- Crawling: 진입점부터 의존성을 따라가며 모든 모듈 수집.
- Resolution: 모듈 경로 해석.
- Concatenation: 여러 모듈 병합.
- Tree Shaking 등 최적화.

모든 단계가 "다른 모듈이 어떻게 생겼는가"에 의존하므로 파일 하나를 독립적으로 처리할 수 없다. 이것이 번들링이 본질적으로 비싼 이유다.

```
트랜스파일링 (병렬 가능)        번들링 (순차 의존)
Button.tsx → Button.js          index.ts
Input.tsx  → Input.js            └── import Button → Button.tsx
Modal.tsx  → Modal.js                └── import utils → utils.ts
(3개 동시 처리 가능)            (그래프 완성 전까지 다음 단계 불가)
```

---

## 종합

Vite가 개발 서버에서 파일을 번들링하지 않고 native ESM으로 서빙하는 이유가 여기 있다. 브라우저가 필요한 파일만 요청하면 Vite는 그 파일만 트랜스파일하면 된다. 반면 Webpack은 dev 서버에서도 전체 번들을 먼저 빌드하므로 프로젝트가 커질수록 cold start가 느려진다.

---

---

# [UNVERIFIED] 컴파일러와 트랜스파일러는 어떻게 구분하는가?

## 도입

"tsc는 컴파일러인가 트랜스파일러인가"는 JS 생태계에서 자주 나오는 질문이다. 일반적 정의로는 추상화 레벨이 같으면 트랜스파일러, 낮아지면 컴파일러지만, 실제로는 도구의 특성(타입 검사 여부, 속도 우선 여부)으로 구분하는 편이 더 유용하다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**일반적 정의.**
- 컴파일러: 한 언어를 더 저수준 언어로 변환 (예: C → 기계어).
- 트랜스파일러: 같은 추상화 레벨의 다른 언어로 변환 (예: TypeScript → JavaScript, ES2022 → ES5).

**JS 생태계에서의 실용적 구분.**
- `tsc`: 타입 검사를 포함한 정확성 중시 트랜스파일러. 느리지만 타입 오류를 잡는다.
- `esbuild`: 타입 검사를 생략하고 변환만 하는 속도 중시 트랜스파일러. 10~100배 빠르다.

Vite는 개발 서버에서 esbuild로 트랜스파일(속도 우선), 타입 검사는 별도 `tsc --noEmit`으로 분리하는 전략을 쓴다.

---

## 종합

실무에서 중요한 것은 정의의 구분보다 "타입 검사가 포함되는가"다. `tsc`를 `vite build` 파이프라인에서 제거하면 빌드가 빨라지지만 타입 오류를 빌드 타임에 잡을 수 없다. CI에서 `tsc --noEmit`을 별도 단계로 두는 이유다.

---

---

# [UNVERIFIED] target 옵션이 변환에 어떻게 영향을 주는가?

## 도입

TypeScript·Babel·esbuild의 `target` 옵션은 "어느 JS 환경을 지원할 것인가"를 정한다. target이 낮으면 최신 문법을 구버전 문법으로 변환(lowering)하고, 높으면 그대로 유지한다. 지원 대상 브라우저와 번들 크기 사이의 트레이드오프다.

---

## 본문

User Answer 기반(TypeScript 공식문서 참조)이므로 인용 없이 해설한다.

**lowering 예시.**

```ts
// 소스 (ES2020+ 문법)
const value = obj?.nested?.value;

// target: ES2019 이하로 설정 시 변환 결과
const value = obj === null || obj === void 0
  ? void 0
  : ((_a = obj.nested) === null || _a === void 0 ? void 0 : _a.value);
```

optional chaining(`?.`)이 ES2019 이전 브라우저에서 동작하도록 장황한 삼항 표현식으로 풀린다. 변환 결과가 길어지므로 번들 크기도 커진다.

**target 선택 기준.** 지원 대상 브라우저가 최신이면 높은 target을 설정해 변환 비용을 줄인다. IE11 같은 구형 브라우저를 지원해야 하면 낮춰야 한다. Vite 기본값은 ES2015(모던 브라우저 대응)다.

---

## 종합

target을 지나치게 낮게 설정하면 번들 크기가 커지고 빌드 시간도 늘어난다. 사용자의 실제 브라우저 버전 통계를 기준으로 최적값을 설정하는 게 좋다. `browserslist` 설정과 연동해 자동화하는 것이 일반적이다.

---

---

# [UNVERIFIED] Rollup의 특징과 Vite와의 관계는?

## 도입

Rollup은 ESM을 중심으로 설계된 번들러로, Tree Shaking과 다양한 출력 포맷이 강점이다. Vite는 dev에서 Rollup을 사용하지 않지만, production 빌드에서는 Rollup으로 최종 번들을 만든다.

---

## 본문

User Answer 기반(Rollup 공식문서 참조)이므로 인용 없이 해설한다.

**Rollup의 특징.**
- ESM 지향: ES Modules를 입력으로 받아 최적화된 번들을 출력한다.
- Tree Shaking: ESM의 정적 `import/export` 구조를 활용해 사용하지 않는 코드를 정확하게 제거한다.
- 출력 포맷: `es`, `umd`, `cjs`, `iife`를 지원한다. 라이브러리 배포 시 여러 포맷을 동시에 출력할 수 있다.
- `external` 옵션: 특정 모듈을 번들에서 제외할 수 있다. 라이브러리가 `react`를 번들에 포함하지 않고 peerDependency로 두는 것이 대표적인 사용 사례다.

**Vite와의 관계.**

```
Vite
├── dev 서버     native ESM 서빙 (Rollup 사용 X)
│                브라우저가 import 그래프를 따라가며 요청
│
└── production   Rollup으로 번들링
                 tree-shaking + chunk splitting + 정적 자산 출력
```

---

## 종합

Rollup은 Vite의 production 번들링 엔진이다. Vite 설정에서 `build.rollupOptions`를 통해 Rollup 옵션을 직접 전달할 수 있는 이유다. dev와 prod 동작이 근본적으로 다르기 때문에 Vite는 "dev 서버를 production에서 쓰지 말라"고 명시한다.

---

---

# [UNVERIFIED] Webpack/Vite/Next.js/Turbopack의 관계는 어떻게 정리되는가?

## 도입

프론트엔드 빌드 도구 생태계는 도구가 많아서 관계가 헷갈리기 쉽다. 각 도구가 담당하는 역할과 범위를 기준으로 정리하면 명확해진다. 특히 Turbopack과 Turborepo는 이름이 비슷하지만 완전히 다른 역할이다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**도구별 역할.**
- **Webpack**: 오랫동안 프론트엔드 빌드의 표준이었던 클래식 번들러. 설정이 복잡하지만 생태계가 넓다.
- **Vite**: dev는 native ESM 서빙, prod는 Rollup 번들링. 빠른 cold start와 HMR이 강점.
- **Next.js**: React 기반 풀스택 프레임워크. 번들러를 내장해서 직접 번들러 설정을 하지 않아도 된다. 내부적으로 Webpack을 써왔고 Turbopack으로 이전 중.
- **Turbopack**: Next.js의 차세대 번들러. Rust로 작성되어 매우 빠른 incremental 빌드를 목표로 한다.

**핵심 오개념 예방.** Turbopack ≠ Turborepo.

```
이름이 비슷한 두 도구
Turbopack  번들러    영향 범위: 패키지 1개의 빌드
Turborepo  모노레포 Task Runner  영향 범위: 모노레포 전체
```

---

## 종합

Next.js 사용자에게 번들러는 보통 투명하게 감춰져 있다. `next build`가 내부에서 Webpack(또는 Turbopack)을 호출한다. Vite 사용자는 번들러를 직접 구성하지만, Rollup 설정을 `vite.config.ts`로 제어한다. 어떤 도구를 쓰든 번들러의 역할(모듈 그래프 분석, 최적화, 출력)은 동일하다.

---

---

# [UNVERIFIED] 번들러는 어떤 식으로 함수 호출을 인라인 최적화하는가?

## 도입

번들러/컴파일러는 코드 크기를 줄이는 것뿐 아니라 실행 속도를 높이는 최적화도 수행한다. 인라인 최적화(inlining)는 작은 함수의 호출을 호출 지점에서 직접 표현식으로 치환하여 함수 호출 오버헤드를 없앤다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**인라인 최적화 예시.**

```js
// 원본
function add(a, b) { return a + b; }
const r = add(1, 2);

// 인라인 후
const r = 1 + 2;

// 상수 폴딩까지 적용하면
const r = 3;
```

함수 `add`가 사라지고 호출 지점에서 표현식이 직접 치환된다. 그 뒤 상수 폴딩(constant folding)이 `1 + 2`를 `3`으로 계산해 최종적으로 단 하나의 값이 남는다.

**효과.**
- 함수 호출 오버헤드(스택 프레임 생성, 인수 전달)가 사라진다.
- 인라인 이후 상수 폴딩·dead code 제거 같은 후속 최적화가 연쇄적으로 적용될 수 있다.
- 번들 크기도 줄어든다.

---

## 종합

인라인 최적화는 esbuild나 Rollup의 production 빌드에서 자동으로 수행된다. 개발자가 "성능을 위해 작은 함수를 피해야 하나?"를 고민할 필요가 없는 이유다. 번들러가 빌드 타임에 코드를 분석하여 안전하게 인라인할 수 있는 경우를 판단하고 적용한다.
