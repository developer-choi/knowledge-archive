# [UNVERIFIED] Vite가 기본 제공하는 features는 어떤 것들이 있는가?

## 도입

Vite는 빌드 도구이면서 동시에 프론트엔드 개발에 필요한 다양한 기능을 플러그인 없이 내장한다. TypeScript, JSX, 정적 자산, JSON 처리 등이 대표적이다. "설정 없이 된다"는 것은 Vite가 기본 설정으로 이미 처리해준다는 의미다.

---

## 본문

User Answer 기반(Vite 공식문서 Features 페이지 참조)이므로 인용 없이 해설한다.

**JSX/TSX 기본 지원.** Vite는 `.jsx`와 `.tsx` 파일을 별도 Babel 설정 없이 처리한다. 내부적으로 esbuild가 트랜스파일을 담당한다. React 프로젝트에서 `vite.config.ts`에 `@vitejs/plugin-react`를 추가하면 HMR에서 React Fast Refresh까지 사용할 수 있다.

**Static Assets import.** 이미지, 폰트, SVG 같은 정적 자산을 JS 모듈처럼 import할 수 있다. Vite가 자동으로 URL 문자열로 변환하거나(이미지), React 컴포넌트로 변환하는(SVG, 플러그인 추가 시) 등 다양한 방식으로 처리한다.

```ts
import logoUrl from './logo.png'  // → '/assets/logo.abc123.png'
import styles from './style.css'  // CSS Modules

function App() {
  return <img src={logoUrl} />
}
```

**JSON named import + tree shaking.** JSON 파일에서 필요한 키만 named import하면 Vite가 나머지를 tree shake한다.

```ts
import { version } from './package.json'
// bundle에는 version 값만 포함됨, 나머지 키는 제거
```

```
Vite 기본 제공 기능
├── TypeScript 트랜스파일 (esbuild, 타입 체크 제외)
├── JSX/TSX 처리
├── CSS / CSS Modules
├── Static Assets (이미지, 폰트 등)
├── JSON named import + tree shaking
└── Web Workers (import?worker)
```

---

## 종합

Vite의 기본 기능은 "현대 프론트엔드 개발에서 빠지면 안 되는 것들"로 구성되어 있다. Webpack에서는 각각 loader를 설치·설정해야 했던 것들이 Vite에서는 설정 없이 동작한다. 기본 기능만으로 부족한 경우 Vite 플러그인 생태계를 통해 확장한다.

---

# [UNVERIFIED] 라이브러리에서 `index.ts`의 진짜 목적은 무엇인가?

## 도입

라이브러리 프로젝트에서 `src/index.ts`를 만드는 이유를 "모든 파일을 하나로 합치기 위해서"라고 오해하기 쉽다. 실제 목적은 다르다. `index.ts`는 번들링의 **진입점(entry point)**이지, 파일을 1개로 만드는 장치가 아니다.

---

## 본문

User Answer 기반(Vite 공식문서 참조)이므로 인용 없이 해설한다.

**진입점의 역할.** Vite의 라이브러리 모드는 "이 파일에서 시작해서 사용된 코드를 번들링한다"고 동작한다. `build.lib.entry`에 `./src/index.ts`를 지정하면 Vite는 그 파일의 `export`를 추적해 의존성 그래프를 만든다.

**결과물이 1개가 아닐 수 있다.** 진입점이 하나라도 Vite(Rollup)는 코드 분할(chunk splitting) 설정에 따라 여러 파일을 출력할 수 있다.

```
src/index.ts (진입점)
  ├── export { Button } from './components/Button'
  ├── export { Modal } from './components/Modal'
  └── export { formatDate } from './utils/date'

↓ vite build

dist/
  my-lib.js         ← 메인 번들 (또는 여러 청크)
  chunks/
    Button.js       ← 코드 분할 시 별도 청크
```

**tsc와의 차이.** tsc는 `src/` 디렉토리의 모든 `.ts` 파일을 1:1로 `.js`로 변환한다. Vite의 라이브러리 모드는 진입점 기준으로 "사용된 것"만 번들링한다. 진입점에서 export하지 않은 파일은 번들에 포함되지 않는다.

```
tsc 방식                         Vite 라이브러리 모드
src/Button.ts → dist/Button.js    src/index.ts가 진입점
src/Modal.ts  → dist/Modal.js     사용된 코드만 번들
src/utils.ts  → dist/utils.js     진입점에서 export 안 한 코드는 제외
(모든 파일 1:1 변환)
```

---

## 종합

`index.ts`를 "모든 파일을 re-export해서 하나로 합치는 파일"이 아니라 "번들링의 시작점"으로 이해하는 것이 중요하다. Mantine 같은 대형 컴포넌트 라이브러리도 진입점은 단일 `index.ts`지만, 빌드 결과물은 수십 개의 청크로 나뉜다. 진입점 = 단일 결과물이라는 등식은 성립하지 않는다.
