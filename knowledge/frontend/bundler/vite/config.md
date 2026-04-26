---
tags: [javascript, concept, best-practice]
---

# Questions
- Vite 공식 Config 문서는 어떻게 읽는가?
- `build.lib` 라이브러리 모드의 entry는 왜 필수이고 default formats는 무엇인가?
- ESM-only로 빌드하면 어떤 장단점이 있는가?
- vite-plugin-dts는 어떻게 설정하는가?
- 라이브러리에서 공통 scss 같은 정적 파일을 같이 내보내려면 어떻게 하는가?
- Vite에서 import alias를 쓰려면 tsconfig만으로 충분한가?

---

# Answers

## Vite 공식 Config 문서는 어떻게 읽는가?

### User Answer
Vite 공식 사이트의 Config 문서는 다음 구조다.
- 헤더의 Config 탭: vite.config.ts에 직접 들어가는 내용.
- 좌측 사이드바: 1뎁스 카테고리 (예: build, server, resolve...).
- 우측 사이드바: 해당 카테고리의 하위 옵션 (예: build.lib, build.rollupOptions...).

이 구조를 알고 있으면 옵션을 빠르게 찾을 수 있다.

### Reference
- https://vite.dev/config/

---

## `build.lib` 라이브러리 모드의 entry는 왜 필수이고 default formats는 무엇인가?

### User Answer
`build.lib`는 Vite의 라이브러리 모드 설정이다.
- entry: 필수. HTML 진입점 사용 불가 (앱이 아니라 라이브러리이므로).
- default formats: `['es', 'umd']`.

따라서 별도 설정 없이 라이브러리 모드 빌드를 돌리면 `.js`(ESM)와 `.umd.cjs` 두 가지가 함께 생성된다.
"Vite는 라이브러리를 ESM/UMD로 빌드한다"는 말의 근거가 이 default다.

### Reference
- https://vite.dev/config/build-options.html#build-lib

---

## ESM-only로 빌드하면 어떤 장단점이 있는가?

### User Answer

**장점**
- 현대 표준을 지향한다.
- ESM은 tree-shaking에 가장 유리한 포맷이다.
- 단일 포맷이라 빌드 산출물 파일 수가 줄어든다.
- package.json의 `main`/`module` 진입점 정의가 명확해진다.
- `types` 필드와 함께 두면 TS DX가 좋다.

**단점**
- UMD/CJS를 제거하면 `require()`만 지원하는 구형 Node나 `"type": "module"`이 없는 CJS 전용 프로젝트에서 쓰기 어렵다.
- `<script>`로 직접 로드하는 시나리오(UMD/IIFE 용도)에 대응 불가.
- ESM-only를 CJS 환경에서 import 할 때 모듈 해석 이슈가 발생할 수 있다.

### Reference
- https://vite.dev/guide/build.html#library-mode

### Review Note
- `rollupOptions.external` 가이드(외부화 대상, 미적용 시 React Hooks 런타임 오류 가능 등)는 GPT 답변 기반이라 1차 소스 검증 미완 → inbox에서 재검증 대기.

---

## vite-plugin-dts는 어떻게 설정하는가?

### User Answer
vite-plugin-dts는 라이브러리 빌드에서 `.d.ts` 타입 정의 파일을 생성해주는 플러그인이다.
- 공식 Vite 라이브러리 템플릿에서 `tsconfigPath`를 명시해주는 게 안전하다.
- 타입 정의를 단일 `.d.ts`로 합치고 싶다면 `rollupTypes: true` 옵션을 사용한다.

### Reference
- https://github.com/qmhc/vite-plugin-dts

---

## 라이브러리에서 공통 scss 같은 정적 파일을 같이 내보내려면 어떻게 하는가?

### User Answer
viteStaticCopy 플러그인을 사용해 빌드 결과물에 정적 파일을 복사할 수 있다.
- `targets`에 `src` (소스 경로)와 `dest` (빌드 결과물 내 위치)를 지정한다.
- 디자인 시스템 라이브러리에서 공통 scss나 design-token을 같이 export 할 때 활용한다.

### Reference
- https://github.com/sapphi-red/vite-plugin-static-copy

### Review Note
- viteStaticCopy가 라이브러리에서 공통 scss 내보내기에 최적인지, 더 나은 대안이 있는지는 inbox 검증 필요.

---

## Vite에서 import alias를 쓰려면 tsconfig만으로 충분한가?

### User Answer
Vite에서는 tsconfig의 `paths`만으로는 import alias가 동작하지 않는다.
vite.config.ts의 `resolve.alias`도 함께 추가해야 한다.

이 점은 Next.js와 다르다 — Next.js는 tsconfig `paths` 설정만으로 alias가 동작한다.

### Reference
- https://vite.dev/config/shared-options.html#resolve-alias
