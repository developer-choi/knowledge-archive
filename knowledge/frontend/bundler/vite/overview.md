---
tags: [javascript, concept]
---

# Questions
- Vite가 기본 제공하는 features는 어떤 것들이 있는가?
- 라이브러리에서 `index.ts`의 진짜 목적은 무엇인가?

---

# Answers

## Vite가 기본 제공하는 features는 어떤 것들이 있는가?

### User Answer
Vite가 별도 설정 없이 제공하는 주요 기능.
- JSX/TSX 기본 지원: esbuild가 트랜스파일을 담당한다.
- Static Assets import: 이미지·폰트 등 정적 자산을 모듈처럼 import 할 수 있다.
- JSON named import + tree shaking: JSON에서 필요한 키만 named import 하면 tree shaking이 작동한다.

### Reference
- https://vite.dev/guide/features.html

---

## 라이브러리에서 `index.ts`의 진짜 목적은 무엇인가?

### User Answer
`index.ts`(또는 `index.tsx`)의 진짜 목적은 **빌드 진입점(entry point)** 이지, "결과물 파일을 1개로 합치는 것"이 아니다.
이 부분을 헷갈리기 쉽다.

이유는 다음과 같다.
- Vite는 tsc처럼 모든 ts 파일을 1:1로 js로 변환하지 않는다.
- Vite의 라이브러리 모드는 "이 진입점에서 시작해 사용된 코드를 번들링한다"는 동작이다.
- 따라서 진입점 1개가 반드시 필요하다.

Mantine 같은 라이브러리도 진입점은 단일이지만, 빌드 결과물은 여러 청크로 나뉘는 구조다.

### Reference
- https://vite.dev/guide/build.html#library-mode
