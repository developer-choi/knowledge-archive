---
tags: [concept, best-practice]
---

# Questions
- 라이브러리 빌드 결과물에 원본 .tsx가 포함되는가?
- 라이브러리에서 react를 peer dependency로 두는 이유는?

---

# Answers

## 라이브러리 빌드 결과물에 원본 .tsx가 포함되는가?

### User Answer
포함되지 않는다.
다른 라이브러리의 `node_modules`를 열어보면 빌드된 `.js`(또는 `.mjs`/`.cjs`)와 `.d.ts`만 들어 있고, 원본 `.tsx`나 `.ts`는 없다.
배포는 빌드 결과물만 한다.

---

## 라이브러리에서 react를 peer dependency로 두는 이유는?

### User Answer
라이브러리가 import해서 쓰는 react와, 라이브러리를 사용하는 프로젝트의 react가 **동일한 인스턴스**를 바라봐야 하기 때문이다.
react 인스턴스가 두 개로 분리되면 다음 문제가 발생한다.
- React Hooks가 동작하지 않거나, "Invalid hook call" 같은 에러.
- Context가 끊긴다 (라이브러리 컴포넌트가 사용처의 Context를 못 받는다).

이 문제를 막기 위해 react는 dependencies가 아니라 peerDependencies로 선언한다.
빌드 시에는 react를 외부화(external)해서 번들에 포함시키지 않는다.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies
