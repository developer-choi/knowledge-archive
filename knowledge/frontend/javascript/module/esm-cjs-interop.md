---
tags: [javascript, troubleshooting, history]
---

# Questions
- ESM-only 라이브러리를 CJS/SSR 환경에서 require로 가져오면 어떻게 되는가?
- 결국 ESM과 CJS는 어떻게 섞어 써야 하는가?
- TypeScript에서 ESM/CJS interop은 어떻게 다루는가?

---

# Answers

## ESM-only 라이브러리를 CJS/SSR 환경에서 require로 가져오면 어떻게 되는가?

### User Answer
ESM-only로 배포된 라이브러리를 CommonJS 환경(예: 일부 SSR 환경, 구형 Node)에서 `require()`로 불러오려고 하면 모듈 해석 단계에서 에러가 난다.
대표 사례로 swiper를 SSR 환경에서 그대로 require하다가 깨지는 경우가 있다 (카카오엔터 기술블로그에 사례).

### Reference
- https://www.typescriptlang.org/docs/handbook/modules/reference.html#commonjs-interop
- https://tech.kakaoent.com/

---

## 결국 ESM과 CJS는 어떻게 섞어 써야 하는가?

### User Answer
원칙적으로 ESM과 CJS는 섞어 쓰지 않는 게 좋다.
런타임마다 해석 방식이 달라 require/import의 호환을 직접 관리해야 한다.

다만 실무에서는 도구 레벨이 이 호환을 거의 자동화해 준다.
- Vite는 dev 시 dependencies를 ESM으로 pre-bundle한다 (CJS/UMD를 ESM으로 변환).
- Next.js 14는 CJS 라이브러리 자동 변환을 강화해 사용자가 거의 의식하지 않아도 된다.

그래서 요즘은 사용자 코드 수준에서는 호환을 직접 다룰 일이 줄었다.

### Reference
- https://ui.toast.com/weekly-pick
- https://tech.kakaoent.com/

---

## TypeScript에서 ESM/CJS interop은 어떻게 다루는가?

### User Answer
TS 측 호환은 `esModuleInterop` 옵션이 담당한다.
이 옵션을 켜면 CJS 모듈의 default import (`import x from "cjs-mod"`) 같은 ESM 문법이 TS의 컴파일 결과에서 자연스럽게 동작하도록 보정된다.

### Reference
- https://www.typescriptlang.org/docs/handbook/modules/reference.html#commonjs-interop
