# `name` 필드의 명명 규약은 무엇인가?

## 도입

패키지 이름은 npm 레지스트리에서 고유 식별자로 쓰이고, URL의 일부가 되고, 커맨드라인 인자로도 쓰인다. 이 때문에 일반 변수명보다 엄격한 규칙이 적용된다.

---

## 본문

> The name must be less than or equal to 214 characters.
> The name can't start with a dot or an underscore.
> New packages must not have uppercase letters in the name.
> The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.

"이름은 214자 이하여야 한다. 이름은 점(.)이나 밑줄(_)로 시작할 수 없다. 새 패키지는 이름에 대문자를 쓸 수 없다. 이름은 URL의 일부, 커맨드라인 인자, 폴더 이름이 되므로 URL-safe하지 않은 문자는 쓸 수 없다."

- **214 characters**: 실무에서는 훨씬 짧게 짓는다. 긴 이름은 검색과 타이핑이 불편하다.
- **can't start with a dot or an underscore**: `.hidden`이나 `_private` 같은 이름 불가. npm 레지스트리 내부 컨벤션과 충돌 가능성 때문이다.
- **must not have uppercase letters**: `MyPackage`가 아닌 `my-package`. URL에서 대소문자 불일치는 혼란을 유발한다.
- **URL-safe characters**: 공백, `#`, `?`, `%` 등은 URL에서 특수 의미를 가지므로 금지. 허용: 알파벳, 숫자, `-`, `_`, `.`, `~`.

```json
// 좋은 이름
{ "name": "react" }
{ "name": "@babel/core" }       // 스코프 패키지
{ "name": "my-utility-lib" }

// 나쁜 이름
{ "name": "MyLib" }            // 대문자 금지
{ "name": "_internal" }        // 밑줄 시작 금지
{ "name": "my lib" }           // 공백 금지
```

---

## 종합

패키지 이름은 `npm install my-package`라는 커맨드의 일부가 되고, `npmjs.com/package/my-package` URL이 된다. 대문자가 포함된 이름은 일부 파일 시스템에서 대소문자 구분 문제를 일으킬 수 있다. 이름을 지을 때 `js`, `node` 같은 일반 명사를 이름에 넣으면 검색 결과에서 묻혀버리므로 피하는 것이 좋다.

---

# `private: true`는 어떤 효과가 있는가?

## 도입

실수로 내부 패키지를 npm 레지스트리에 공개 배포하는 것을 막는 가장 간단한 방법이다.

---

## 본문

> If you set "private": true in your package.json, then npm will refuse to publish it.

"package.json에 'private': true를 설정하면 npm이 배포를 거부한다."

- **refuse to publish**: `npm publish`를 실행하면 `npm error This package has been marked as private` 에러가 발생하고 배포가 차단된다.
- **implicit scope**: 이 설정 하나로 실수 배포가 완전히 막힌다 — `--force` 플래그로도 우회 불가.

```json
{
  "name": "my-company-internal-tool",
  "private": true,
  "version": "1.0.0"
}
```

흔한 사용처:
- 모노레포의 루트 `package.json` (앱 자체를 배포할 게 아니므로)
- 회사 내부 전용 패키지
- Next.js/React 앱 프로젝트 (라이브러리가 아닌 앱)

---

## 종합

`"private": true`는 모노레포 루트나 앱 프로젝트의 표준 설정이다. Turborepo, Nx 같은 모노레포 도구도 앱 패키지에 자동으로 이 값을 넣는다. 개인 레지스트리(GitHub Packages, Verdaccio)에 배포하더라도 실수로 공개 레지스트리에 올리는 것을 막기 위해 `private: true`를 권고한다.

---

# `publishConfig`는 무엇을 위한 필드인가?

## 도입

`npm publish` 시 특정 설정을 강제하고 싶을 때 사용하는 필드다. 레지스트리 주소, 배포 태그, 접근 범위를 오버라이드할 수 있다.

---

## 본문

> This is a set of config values that will be used at publish-time.
> It's especially handy if you want to set the tag, registry or access, so that you can ensure that a given package is not tagged with "latest", published to the global public registry or that a scoped module is private by default.

"이것은 배포 시점에 사용될 설정값의 집합이다. 특히 태그, 레지스트리 또는 접근 범위를 설정하고 싶을 때 유용하다. 특정 패키지가 'latest' 태그로 붙지 않도록, 공개 글로벌 레지스트리에 배포되지 않도록, 또는 스코프 모듈이 기본으로 비공개가 되도록 보장할 수 있다."

- **publish-time**: 배포 명령(`npm publish`) 실행 시에만 이 설정이 적용된다. 일반 `install` 등에는 영향 없다.
- **tag**: 기본값은 `latest`. `beta`, `next` 같은 태그를 설정하면 `npm install pkg`가 아닌 `npm install pkg@beta`로만 설치된다.
- **registry**: 공개 레지스트리 대신 GitHub Packages, 사내 Verdaccio 등으로 전환.
- **access**: `public` (누구나 설치 가능) 또는 `restricted` (인증된 사용자만). 스코프 패키지(`@scope/pkg`)는 기본 `restricted`.

```json
{
  "name": "@my-company/design-system",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted",
    "tag": "latest"
  }
}
```

---

## 종합

`publishConfig`는 CI 파이프라인에서 특히 유용하다. 개발자 로컬에서는 `.npmrc`로 레지스트리를 설정해도, `publishConfig`를 `package.json`에 명시해두면 CI 환경에서도 항상 의도한 레지스트리에 배포된다. 실수로 내부 패키지가 공개 레지스트리에 올라가는 것을 `private: true`와 `publishConfig.registry`로 이중으로 방어하는 것이 일반적인 보안 관행이다.

---

# [UNVERIFIED] `type` 필드는 무엇을 결정하는가?

## 도입

`type` 필드는 패키지의 `.js` 파일들이 어떤 모듈 시스템으로 해석될지를 결정한다. 이 값 하나로 `require()`가 되는지 `import`가 되는지가 결정된다.

---

## 본문

`type` 필드는 OA 없이 실무 원칙으로 정리한다.

```json
{
  "type": "module"     // .js 파일을 ESM으로 해석
}
// 또는
{
  "type": "commonjs"   // .js 파일을 CJS로 해석 (기본값)
}
```

```js
// type: "module"일 때
// app.js
import fs from 'fs'; // OK
const x = require('x'); // SyntaxError — CJS 불가

// type: "commonjs" (또는 생략)일 때
// app.js
const fs = require('fs'); // OK
import fs from 'fs'; // SyntaxError — ESM 불가
```

확장자로 강제 지정도 가능:
- `.mjs`: 항상 ESM (type 설정 무관)
- `.cjs`: 항상 CJS (type 설정 무관)
- `.js`: `type` 필드 설정에 따름

---

## 종합

`type: "module"`은 프로젝트 전체의 `.js` 파일을 ESM으로 전환한다. 기존 CJS 코드가 있다면 `.cjs` 확장자로 바꾸거나, `type`을 설정하지 않고 ESM 파일만 `.mjs`로 쓰는 방법도 있다. 새 Node.js 프로젝트나 라이브러리를 만들 때 `"type": "module"`을 설정하는 것이 ESM-first 접근이다.

---

# [UNVERIFIED] `module` 필드는 무엇인가?

## 도입

`module` 필드는 npm 공식 사양에는 없지만, Rollup, Webpack 같은 번들러들이 ESM 진입점을 찾기 위해 참조하는 비공식 필드다.

---

## 본문

`module` 필드는 OA 없이 실무 원칙으로 정리한다.

`main` 필드가 CJS 진입점이라면, `module` 필드는 ESM 진입점이다:

```json
{
  "main": "./dist/index.cjs",     // CJS 환경 (require())
  "module": "./dist/index.mjs"    // ESM 환경 (import)
}
```

번들러(Rollup, Webpack)가 `module` 필드를 우선 참조하는 이유:
- ESM은 Tree Shaking이 가능하므로 번들러가 선호한다
- `main`만 있으면 CJS로 처리되어 Tree Shaking이 어려워진다

```js
// Rollup이 my-pkg를 import할 때 우선순위:
// 1. exports 필드 (있으면 최우선)
// 2. module 필드 (있으면 ESM으로)
// 3. main 필드 (CJS fallback)
```

현재 권고:
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",   // exports로 명시하는 것이 더 정확
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",         // exports 미지원 구형 환경 fallback
  "module": "./dist/index.mjs"        // 구형 번들러 호환
}
```

---

## 종합

`module` 필드는 Node.js 공식 사양이 아니라 커뮤니티 컨벤션이다. Node.js 자체는 이 필드를 무시하고 `exports` → `main` 순으로 참조한다. 최신 번들러(Rollup 3+, Vite)는 `exports` 필드를 먼저 보므로 `exports`로 통일하는 것이 권장이지만, 구형 Webpack이나 Rollup 2 환경과의 호환을 위해 `module` 필드를 함께 유지하는 패키지가 여전히 많다.
