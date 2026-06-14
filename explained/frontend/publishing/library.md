# [UNVERIFIED] 라이브러리 빌드 결과물에 원본 .tsx가 포함되는가?

## 도입

`npm install react` 후 `node_modules/react`를 열어보면 `.ts` 파일이 없고 `.js`와 `.d.ts`만 있다. 라이브러리 배포는 빌드 결과물만 하는 것이 표준이다. 소스 파일이 없는 이유와 그 의미를 이해하면 라이브러리 빌드 구성이 명확해진다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**원본 `.tsx`는 포함되지 않는다.** `node_modules`를 열어보면 다음과 같은 구조가 전형적이다.

```
node_modules/@myorg/ui/
  dist/
    index.js        ← 빌드된 JS 번들
    index.d.ts      ← TypeScript 타입 정의
    index.js.map    ← (선택) 소스맵
  package.json
  README.md
```

원본 `Button.tsx`, `Modal.tsx` 같은 소스 파일은 없다.

**이유.** 사용처는 라이브러리의 구현 방식이 아니라 공개된 인터페이스(API)만 필요하다. 원본 소스를 포함하면 번들 크기가 커지고, 배포 시간이 길어지며, 내부 구현이 그대로 노출된다. 빌드 결과물(`dist/`)만 배포하는 것이 관례다.

**`.d.ts`가 있는 이유.** TypeScript 사용자가 라이브러리의 타입을 인식하려면 `.d.ts` 파일이 필요하다. 원본 `.tsx` 없이도 `.d.ts`가 있으면 IDE 자동완성과 타입 체크가 동작한다.

---

## 종합

라이브러리를 배포할 때 `files` 필드나 `.npmignore`로 `dist/`만 포함되도록 설정하는 이유다. 소스 파일을 실수로 포함하면 패키지 크기가 불필요하게 커진다. `vite-plugin-dts`로 `.d.ts`를 생성하고 `build.lib`로 JS 번들을 만들면 배포 준비가 완료된다.

---

# [UNVERIFIED] 라이브러리에서 react를 peer dependency로 두는 이유는?

## 도입

React 컴포넌트 라이브러리를 만들면 React를 사용하는데, 이 React를 `dependencies`가 아니라 `peerDependencies`에 선언해야 한다. 이유는 "라이브러리의 react"와 "사용처의 react"가 반드시 같은 인스턴스여야 하기 때문이다.

---

## 본문

User Answer 기반(npm 공식문서 참조)이므로 인용 없이 해설한다.

**react 인스턴스가 두 개로 분리되면 생기는 문제.**

React는 내부적으로 전역 싱글턴 상태(current fiber, context 등)를 유지한다. 라이브러리가 자체적으로 react를 번들에 포함하면 사용처의 react와 별개의 인스턴스가 생긴다.

- **React Hooks 오류**: `useState`, `useEffect` 같은 훅은 현재 렌더링 중인 컴포넌트와 연결된 내부 상태에 접근한다. 두 react 인스턴스가 있으면 훅이 다른 인스턴스의 상태를 가리켜 "Invalid hook call" 에러가 발생한다.
- **Context 단절**: `createContext`로 만든 Context 값은 같은 react 인스턴스 안에서만 전달된다. 라이브러리가 별도 react를 쓰면 사용처의 `ThemeContext`를 라이브러리 컴포넌트에서 읽을 수 없다.

**peerDependencies 선언.**

```json
// 라이브러리 package.json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "react": "^18.0.0"   // 로컬 개발용
  }
}
```

`peerDependencies`는 "이 패키지를 사용하는 쪽에서 이 버전의 react를 설치해야 한다"는 선언이다. PM이 라이브러리 자체의 `node_modules`에 react를 설치하지 않고, 사용처의 react를 공유해서 쓴다.

**빌드 시 external 처리.** `vite.config.ts`에서 react를 external로 선언해야 번들에 포함되지 않는다.

```ts
// vite.config.ts
export default defineConfig({
  build: {
    lib: { entry: './src/index.ts', formats: ['es'] },
    rollupOptions: {
      external: ['react', 'react-dom'],  // 번들에서 제외
    },
  },
})
```

```
peerDependencies 동작 구조
my-app/
  node_modules/
    react@18.2.0         ← 사용처의 react (하나만 존재)
    @myorg/ui/
      dist/index.js      ← react를 번들에 포함 안 함
                            import React from 'react'는
                            사용처의 react@18.2.0을 참조
```

---

## 종합

라이브러리에서 react를 `dependencies`에 넣으면 PM이 라이브러리 안에 별도 react를 설치하고, 두 인스턴스 문제가 발생한다. `peerDependencies` + `rollupOptions.external` 조합이 이 문제의 표준 해결책이다. 라이브러리를 개발하다 "Invalid hook call" 에러가 나면 react externalization을 먼저 확인한다.
