# [UNVERIFIED] Vite 공식 Config 문서는 어떻게 읽는가?

## 도입

Vite 공식 사이트의 Config 문서는 옵션이 많아서 처음에는 어디서 찾아야 할지 막막하다. 구조를 알면 필요한 옵션을 빠르게 찾을 수 있다.

---

## 본문

User Answer 기반(Vite 공식문서 참조)이므로 인용 없이 해설한다.

**문서 구조.**
- 헤더의 Config 탭: `vite.config.ts`에 직접 들어가는 모든 최상위 옵션을 다룬다.
- 좌측 사이드바: 1뎁스 카테고리. `build`, `server`, `resolve`, `css`, `optimizeDeps` 등.
- 우측 사이드바: 선택된 카테고리의 하위 옵션 목록. 예: `build` 카테고리 선택 시 `build.lib`, `build.rollupOptions`, `build.outDir` 등.

```
Vite Config 문서 구조
Config 탭
  │
  ├── 좌측 사이드바 (카테고리)
  │     ├── build
  │     ├── server
  │     ├── resolve
  │     ├── css
  │     └── ...
  │
  └── 우측 사이드바 (선택된 카테고리의 하위 옵션)
        예: build 선택 시
          ├── build.lib
          ├── build.rollupOptions
          ├── build.outDir
          └── ...
```

**실제 사용 흐름.** `build.lib`를 찾고 싶으면 좌측에서 `build`를 클릭하고, 우측 목록에서 `build.lib`를 클릭하면 옵션 상세 설명으로 이동한다.

---

## 종합

Config 문서를 처음부터 읽으려 하면 옵션이 너무 많다. 실제 작업에서는 "지금 필요한 카테고리 → 하위 옵션" 순으로 찾는 것이 효율적이다. `vite.config.ts`에서 에러가 나거나 동작이 이상할 때 해당 옵션의 문서 페이지를 찾아 정확한 타입과 기본값을 확인하는 습관이 중요하다.

---

---

# [UNVERIFIED] `build.lib` 라이브러리 모드의 entry는 왜 필수이고 default formats는 무엇인가?

## 도입

Vite는 웹 앱 빌드(기본 모드)와 라이브러리 빌드(`build.lib`) 두 가지를 지원한다. 라이브러리 모드는 앱이 아니라 다른 프로젝트가 import해 쓰는 코드를 빌드하는 것으로, 진입점 설정 방식이 앱과 다르다.

---

## 본문

User Answer 기반(Vite 공식문서 참조)이므로 인용 없이 해설한다.

**entry가 필수인 이유.** 앱 빌드는 `index.html`을 진입점으로 삼아 브라우저가 로드할 자산을 결정한다. 라이브러리는 HTML이 없다 — 다른 패키지에서 `import`로 불리는 JS 모듈이다. 따라서 "여기서부터 번들링을 시작하라"는 `entry`를 명시적으로 지정해야 한다.

**default formats.** `build.lib.formats`를 지정하지 않으면 `['es', 'umd']`가 기본이다. 빌드 결과물로 `.js`(ESM)와 `.umd.cjs`(UMD) 두 파일이 함께 생성된다.

```js
// vite.config.ts 라이브러리 모드 최소 설정
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',   // 필수
      name: 'MyLib',             // UMD 전역 변수명
      // formats 미지정 시 기본값: ['es', 'umd']
    },
  },
})
```

**빌드 결과.**

```
dist/
  my-lib.js       ← ESM
  my-lib.umd.cjs  ← UMD (CommonJS 호환)
```

---

## 종합

`build.lib`를 쓰는 순간 Vite는 "이 프로젝트는 다른 패키지에서 import될 라이브러리"로 인식하고 HTML 진입점 대신 JS 진입점을 요구한다. default formats가 `es + umd`인 이유는 ESM(현대 번들러 환경)과 UMD(구형 환경 또는 CDN 직접 로드)를 동시에 지원하는 가장 넓은 커버리지를 제공하기 위해서다.

---

---

# [UNVERIFIED] ESM-only로 빌드하면 어떤 장단점이 있는가?

## 도입

라이브러리를 ESM 포맷으로만 빌드하면 UMD·CJS 없이 단일 포맷만 배포된다. 현대적이고 깔끔한 선택이지만, 지원 범위가 좁아지는 트레이드오프가 있다.

---

## 본문

User Answer 기반(Vite 공식문서 참조)이므로 인용 없이 해설한다.

**장점.**
- 현대 표준: ESM은 웹 표준이다. Node.js와 모든 모던 번들러가 네이티브로 지원한다.
- Tree Shaking 최적: ESM의 정적 `import/export` 구조 덕분에 번들러가 미사용 코드를 정확하게 제거한다. CJS는 동적 require가 가능해서 정적 분석이 어렵다.
- 단일 포맷: 빌드 결과물 파일이 하나로 줄어든다.
- `package.json` 정리: `exports` 필드 하나로 진입점을 명확하게 선언할 수 있다.

**단점.**
- CJS 환경 미지원: `"type": "module"` 없는 오래된 Node.js 프로젝트나 `require()` 전용 환경에서 쓸 수 없다.
- 직접 `<script>` 로드 불가: UMD·IIFE가 없으면 CDN에서 글로벌 변수로 불러오는 방식을 지원하지 못한다.

```js
// ESM-only 빌드 설정
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],  // UMD 제거
    },
  },
})
```

```json
// package.json ESM-only 진입점 선언
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

---

## 종합

ESM-only는 사용 대상이 명확할 때 좋은 선택이다. Vite·Next.js·Remix 같은 모던 프레임워크 환경에서만 쓰이는 라이브러리라면 ESM-only가 적합하다. 반면 npm에 공개적으로 배포해 다양한 환경을 지원해야 한다면 ESM + CJS 듀얼 빌드가 일반적이다.

---

---

# [UNVERIFIED] vite-plugin-dts는 어떻게 설정하는가?

## 도입

Vite 라이브러리 모드는 JS 번들만 생성한다. TypeScript 사용자가 라이브러리를 쓸 때 필요한 `.d.ts` 타입 정의 파일은 별도로 생성해야 한다. `vite-plugin-dts`가 그 역할을 담당한다.

---

## 본문

User Answer 기반(vite-plugin-dts 공식문서 참조)이므로 인용 없이 해설한다.

**기본 설정.**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',  // 명시 권장
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
  },
})
```

- `tsconfigPath` 명시: 공식 Vite 라이브러리 템플릿에서 권장하는 설정. 명시하지 않으면 플러그인이 tsconfig를 찾지 못하는 경우가 생길 수 있다.

**단일 `.d.ts`로 합치기.** 여러 소스 파일에서 나오는 타입 정의를 단일 파일로 통합하고 싶으면 `rollupTypes: true`를 추가한다.

```ts
dts({
  tsconfigPath: './tsconfig.json',
  rollupTypes: true,  // 단일 .d.ts 출력
})
```

**빌드 결과.**

```
dist/
  my-lib.js        ← JS 번들
  my-lib.d.ts      ← 타입 정의 (rollupTypes: true 시 단일 파일)
```

---

## 종합

`vite-plugin-dts` 없이 라이브러리를 배포하면 TypeScript 사용자가 타입 추론을 받지 못한다. `package.json`의 `types` 필드가 `.d.ts`를 가리켜야 TypeScript가 타입을 인식한다. 라이브러리 DX에서 타입 정의는 선택이 아니라 필수다.

---

---

# [UNVERIFIED] 라이브러리에서 공통 scss 같은 정적 파일을 같이 내보내려면 어떻게 하는가?

## 도입

Vite 라이브러리 모드는 JS 번들과 타입 정의를 기본으로 생성한다. 공통 scss나 design token JSON 같은 정적 파일을 함께 배포하려면 별도 설정이 필요하다.

---

## 본문

User Answer 기반(vite-plugin-static-copy 공식문서 참조)이므로 인용 없이 해설한다.

**viteStaticCopy 플러그인.** 빌드 결과물에 정적 파일을 복사하는 플러그인이다.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/styles/global.scss',  // 소스 경로
          dest: 'styles',                  // dist/ 내 위치
        },
      ],
    }),
  ],
})
```

**빌드 결과.**

```
dist/
  my-lib.js
  my-lib.d.ts
  styles/
    global.scss   ← 복사된 정적 파일
```

**사용 사례.** 디자인 시스템 라이브러리에서 공통 CSS 변수·scss 믹스인·design token을 사용처가 그대로 가져다 쓸 수 있도록 함께 배포할 때 활용한다.

---

## 종합

`viteStaticCopy`는 번들링 대상이 아닌 파일을 `dist`에 그대로 복사하는 단순하고 명확한 솔루션이다. 정적 자산을 배포하는 다른 방법(별도 스크립트, tsc 설정 등)도 있으므로, 팀의 빌드 파이프라인에 맞는 방식을 선택하면 된다.

---

---

# [UNVERIFIED] Vite에서 import alias를 쓰려면 tsconfig만으로 충분한가?

## 도입

TypeScript 프로젝트에서 `@/components/Button` 같은 경로 alias를 쓰면 상대 경로 지옥을 피할 수 있다. 그런데 Vite에서는 tsconfig의 `paths` 설정만으로는 충분하지 않다.

---

## 본문

User Answer 기반(Vite 공식문서 참조)이므로 인용 없이 해설한다.

**왜 tsconfig `paths`만으로는 안 되는가.** `tsconfig.json`의 `paths`는 TypeScript 컴파일러(tsc)가 타입 체크할 때 경로를 해석하는 용도다. Vite가 dev 서버에서 실제로 파일을 서빙하거나 번들링할 때는 `tsconfig.paths`를 읽지 않는다. 따라서 `vite.config.ts`의 `resolve.alias`를 별도로 설정해야 한다.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```json
// tsconfig.json (타입 체크용)
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

두 곳을 모두 설정해야 TypeScript 타입 체크와 Vite 빌드 모두에서 alias가 동작한다.

**Next.js와의 차이.** Next.js는 `tsconfig.json`의 `paths`를 직접 읽어서 alias를 처리한다. `vite.config.ts` 같은 별도 설정이 불필요하다.

---

## 종합

Vite에서 alias 설정을 tsconfig에만 하면 타입 에러는 없지만 Vite가 파일을 찾지 못해 빌드 에러가 발생한다. 반대로 `resolve.alias`만 설정하면 Vite는 잘 동작하지만 TypeScript가 경로를 인식 못해 타입 에러가 난다. 두 설정을 항상 쌍으로 관리해야 한다.
