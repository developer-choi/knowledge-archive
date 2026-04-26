---
tags: [javascript, concept]
---

# Questions
- ESM이란 무엇인가?
- `export {}`는 빈 객체를 내보내는가?
- `export *`는 default export까지 재내보내는가?
- 두 wildcard re-export가 같은 이름을 갖고 있을 때 어떻게 되는가?
- Named export와 default export는 기능적으로 어떻게 다른가?
- 브라우저는 `import 'react'` 같은 bare module import를 그대로 처리할 수 있는가?
- 같은 모듈을 여러 파일에서 import하면 코드가 매번 평가되는가?
- ESM은 JSON 파일도 import 할 수 있는가?
- ESM의 dynamic import와 CJS의 `require()`는 어떻게 다른가?

---

# Answers

## ESM이란 무엇인가?

### User Answer
ESM은 ECMAScript 표준 모듈 시스템이다.
브라우저가 네이티브로 이해할 수 있는 형식이라는 점이 다른 모듈 시스템(CJS, AMD 등)과의 가장 큰 차이다.
TypeScript는 표준이 아니므로 브라우저가 직접 이해하지 못하지만, ESM은 표준이라 브라우저가 그대로 실행할 수 있다.

> #### User Annotation:
> Vite가 dev 모드에서 별도 번들링 없이 소스를 ESM으로 그대로 서빙할 수 있는 것도 이 때문이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

---

## `export {}`는 빈 객체를 내보내는가?

### User Answer
아니다.
`export {}`는 빈 객체를 내보내는 게 아니라 "빈 이름 목록을 export한다"는 no-op 선언이다.
실질적으로 아무것도 내보내지 않지만, 해당 파일을 모듈로 인식시키는 용도로 쓰일 수 있다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

---

## `export *`는 default export까지 재내보내는가?

### Official Answer
`export * from "module"` re-exports all named exports from another module, but does **not** re-export the `default` export.

### User Answer
`export * from "mod"`는 named export만 재내보내고 default는 포함되지 않는다.
default까지 같이 내보내려면 `export { default } from "mod"`를 따로 적어야 한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

---

## 두 wildcard re-export가 같은 이름을 갖고 있을 때 어떻게 되는가?

### User Answer
두 `export *`가 같은 이름을 implicit하게 재내보내려고 하면, 충돌 규칙에 의해 그 이름은 양쪽 모두 누락된다.
에러가 나거나 한쪽이 우선되는 게 아니라, 그냥 침묵 속에서 사라진다.
명시적으로 `export { name } from "..."`로 다시 노출시키지 않으면 외부에서 import 할 수 없다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

---

## Named export와 default export는 기능적으로 어떻게 다른가?

### User Answer
기능적인 차이는 없다.
둘 다 모듈에서 값을 노출하는 방식이며, 동작도 같다.
다만 암묵적 의미가 다르다 — default는 "이 모듈의 주된 export"라는 뉘앙스를 가진다.
한 가지 차이는 `export *`로 default까지 한 번에 재내보낼 수는 없다는 점이다.

---

## 브라우저는 `import 'react'` 같은 bare module import를 그대로 처리할 수 있는가?

### User Answer
브라우저는 bare specifier (`from 'react'` 같이 경로가 아닌 모듈명)를 기본적으로 해석하지 못한다.
브라우저가 ESM을 해석하려면 `from "./foo.js"` 같이 상대 경로 또는 절대 URL이어야 한다.

해결 방법은 두 가지다.
- Import maps: 브라우저 네이티브 기능으로, bare specifier를 실제 URL로 매핑한다.
- Vite의 pre-bundle: dev 서버가 `react`를 `/node_modules/.vite/deps/react.js?v=hash` 형태로 rewrite해서 브라우저가 이해할 수 있는 경로로 바꾼다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap

---

## 같은 모듈을 여러 파일에서 import하면 코드가 매번 평가되는가?

### User Answer
아니다.
ESM 모듈 코드는 처음 import될 때 한 번만 평가된다.
모듈 내부에 side-effect가 있어도 한 번만 실행된다.
모듈이 export한 객체는 reference로 유지되어, 모든 importer가 동일한 인스턴스를 공유한다.

이 특성은 모듈 단위로 설정값을 공유하거나 싱글턴 패턴을 ESM 자체로 구현할 때의 근거가 된다.

### Reference
- https://tc39.es/ecma262/#sec-modules

---

## ESM은 JSON 파일도 import 할 수 있는가?

### User Answer
가능하다.
번들러나 런타임이 지원하면 JSON 파일을 모듈처럼 import 해 객체로 받을 수 있다.

---

## ESM의 dynamic import와 CJS의 `require()`는 어떻게 다른가?

### User Answer
ESM의 dynamic import (`import('mod')`)는 Promise를 반환한다.
반면 CJS의 `require()`는 동기적으로 모듈을 반환하며, Promise가 아니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
