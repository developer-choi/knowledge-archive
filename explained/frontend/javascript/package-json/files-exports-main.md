# `files` 필드는 무엇을 제어하는가?

## 도입

npm 패키지를 배포할 때 레포지토리의 모든 파일이 설치되면 불필요한 파일(소스, 테스트, 설정 등)이 포함된다. `files` 필드는 배포 패키지에 포함될 파일을 명시적으로 지정한다.

---

## 본문

> The optional files field is an array of file patterns that describes the entries to be included when your package is installed as a dependency.
> Omitting the field will make it default to ["**"], which means it will include all files.

"선택적인 files 필드는 패키지가 의존성으로 설치될 때 포함될 항목을 기술하는 파일 패턴 배열이다. 이 필드를 생략하면 기본값은 ['**']로, 모든 파일이 포함된다는 의미다."

- **optional**: `files`를 쓰지 않아도 패키지는 배포된다. 단, 모든 파일이 포함된다.
- **when your package is installed as a dependency**: `npm install my-pkg`를 실행할 때 복사되는 파일들. 개발자의 로컬 개발 환경이 아니라, 사용자의 `node_modules`에 어떤 파일이 들어가는지를 제어한다.
- **default to ["**"]**: 생략 시 `.gitignore`에 없는 모든 파일이 포함된다. 소스 코드, 테스트, 설정 파일까지 전부.

```json
{
  "files": [
    "dist/",      // 빌드 결과물 폴더
    "src/",       // 소스 (타입 정의 등이 있다면)
    "README.md"   // 문서
  ]
}
```

---

## 종합

`files`를 설정하지 않으면 사용자가 패키지를 설치할 때 불필요한 테스트 파일, CI 설정, 내부 스크립트까지 `node_modules`에 포함된다. 이는 설치 시간 증가와 불필요한 용량 낭비로 이어진다. `dist/`처럼 빌드 결과물 폴더만 지정하는 것이 일반적인 관행이다.

---

# `files` 설정과 무관하게 항상 포함되는 파일은 무엇인가?

## 도입

`files`에 명시하지 않아도 npm이 자동으로 패키지에 포함시키는 파일들이 있다. 이 파일들은 패키지 기능에 반드시 필요한 것들이다.

---

## 본문

> Some special files and directories are also included or excluded regardless of whether they exist in the files array:
> - package.json
> - README
> - LICENSE / LICENCE
> - The file in the "main" field
> - The file(s) in the "bin" field

"일부 특수 파일과 디렉토리는 files 배열 포함 여부와 관계없이 항상 포함되거나 제외된다: package.json, README, LICENSE/LICENCE, 'main' 필드의 파일, 'bin' 필드의 파일들."

- **package.json**: 패키지 메타데이터. 이게 없으면 npm이 패키지를 인식하지 못한다.
- **README**: 사용자에게 보여주는 문서. npm 패키지 페이지(npmjs.com)에 그대로 표시된다.
- **LICENSE / LICENCE**: 라이선스 파일. 법적 이유로 항상 포함.
- **"main" 필드의 파일**: 패키지의 진입점. 이게 없으면 `require('패키지명')`이 동작하지 않는다.
- **"bin" 필드의 파일**: CLI 도구 진입점. `npx my-tool` 같은 명령 실행에 필요.

---

## 종합

이 다섯 가지는 `files`에서 명시적으로 제외해도 자동으로 포함된다. 반대로, `files`를 엄격하게 `["dist/"]`로 설정해도 `package.json`이 빠지지 않으므로 안심해도 된다. `bin` 파일을 만드는 CLI 패키지는 `files`에 별도로 추가하지 않아도 자동 포함된다.

---

# `files` 설정과 무관하게 항상 무시되는 파일은 무엇인가?

## 도입

반대로 `files`에 포함시키려 해도 npm이 자동으로 배제하는 파일들도 있다. OS 임시 파일이나 에디터 파일이 여기 해당한다.

---

## 본문

> Some files are always ignored by default:
> - *.orig
> - .*.swp
> - .DS_Store
> - ._*
> - (이하 생략)
> Most of these ignored files can be included specifically if included in the files globs.

"일부 파일은 기본적으로 항상 무시된다: *.orig, .*.swp, .DS_Store, ._* 등. 이 무시된 파일 대부분은 files 글로브에 포함시키면 특별히 포함될 수 있다."

- **always ignored**: 운영체제 임시 파일(`.DS_Store`는 macOS Finder 메타데이터), 에디터 swap 파일(`.*.swp`는 Vim 임시 파일) 등.
- **most of these can be included**: 절대 포함 불가한 것들과 달리, 강제로 `files`에 넣으면 포함시킬 수 있다.

---

## 종합

자동으로 무시되는 파일들은 대부분 개발 환경 아티팩트다. 이것들이 실수로 패키지에 포함되면 패키지 크기가 늘어나고 보안 문제가 생길 수 있다. `.DS_Store`에는 macOS 폴더 레이아웃 정보, `.*.swp`에는 편집 중이던 내용이 남을 수 있기 때문이다.

---

# `files` glob에 추가해도 절대 포함될 수 없는 파일은 무엇인가?

## 도입

자동 무시 파일들과 달리, 아무리 `files`에 명시해도 절대로 패키지에 포함될 수 없는 파일들이 있다. 보안과 패키지 무결성을 위한 하드 제한이다.

---

## 본문

> Exceptions to this are:
> - .git
> - .npmrc
> - node_modules
> - package-lock.json
> - pnpm-lock.yaml
> - yarn.lock
> These can not be included.

"예외가 있다: .git, .npmrc, node_modules, package-lock.json, pnpm-lock.yaml, yarn.lock — 이것들은 절대 포함될 수 없다."

- **.git**: git 히스토리 전체. 포함되면 커밋 이력, 개발자 정보가 노출된다.
- **.npmrc**: npm 설정 파일. 인증 토큰(authToken)이 담겨있을 수 있어 보안상 절대 배포 불가.
- **node_modules**: 사용자가 `npm install`로 각자 설치해야 하는 것을 패키지에 넣으면 크기가 폭발적으로 커진다.
- **lock 파일들**: lock 파일은 라이브러리 소비자가 자신의 환경에 맞게 생성해야 한다. 개발자의 lock 파일이 포함되면 버전 충돌이 생길 수 있다.

---

## 종합

이 목록은 "절대 배포해선 안 되는 것들"의 안전망이다. `.npmrc`가 실수로 배포되면 레지스트리 인증 토큰이 공개될 수 있어 심각한 보안 사고로 이어진다. npm이 이를 하드코딩된 금지 목록으로 막는 이유다.

---

# `.npmignore`와 `.gitignore`의 관계는?

## 도입

`.gitignore`는 git에 추적되지 말아야 할 파일을 지정한다. `.npmignore`는 npm 배포에서 제외할 파일을 지정한다. 둘은 비슷하지만 서로 다른 목적을 가지며 fallback 관계가 있다.

---

## 본문

> You can also provide a .npmignore file in the root of your package or in subdirectories, which will keep files from being included.
> The .npmignore file works just like a .gitignore.
> If there is a .gitignore file, and .npmignore is missing, .gitignore's contents will be used instead.

".npmignore 파일은 패키지 루트 또는 서브디렉토리에 둘 수 있으며, 파일이 포함되지 않도록 한다. .npmignore는 .gitignore와 똑같이 동작한다. .gitignore 파일이 있고 .npmignore가 없으면, .gitignore의 내용이 대신 사용된다."

- **works just like a .gitignore**: 같은 glob 패턴 문법을 쓴다.
- **If .gitignore is present and .npmignore is missing**: 별도 `.npmignore`가 없으면 `.gitignore`가 npm 배포 제외 기준으로도 쓰인다. 개별 설정이 필요 없는 경우 편리하다.

```
.npmignore 있음 → .npmignore 사용 (.gitignore 무시)
.npmignore 없음 → .gitignore 사용
둘 다 없음     → files 필드만 적용 (또는 전체 포함)
```

---

# `exports` 필드는 어떤 효과가 있는가?

## 도입

`exports` 필드는 패키지의 공개 진입점을 명시적으로 제한하는 필드다. `main` 필드보다 강력하고 정밀한 제어가 가능하다.

---

## 본문

> "exports" prevents any other entry points besides those defined in "exports".

"'exports'는 'exports'에 정의된 것 이외의 다른 진입점을 모두 차단한다."

- **prevents any other entry points**: 가장 중요한 동작. `exports` 필드가 있으면, 여기 정의된 경로 이외의 어떤 파일도 외부에서 import할 수 없다.
- **besides those defined**: 화이트리스트 방식. 명시하지 않은 것은 모두 차단.

```json
{
  "exports": {
    ".": "./dist/index.js",           // 루트 import
    "./utils": "./dist/utils.js"      // /utils 서브패스
  }
}

// 사용자 코드:
import pkg from 'my-pkg';            // OK
import utils from 'my-pkg/utils';    // OK
import internal from 'my-pkg/dist/internal.js'; // ERR — 차단됨
```

환경별 조건부 진입점도 지정 가능:
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",  // ESM 환경
      "require": "./dist/index.cjs"  // CJS 환경
    }
  }
}
```

---

## 종합

`exports`가 없으면 빌드 결과물의 어떤 파일이든 외부에서 직접 import할 수 있다. 내부 구현 파일, 임시 CSS, SVG 파일까지 모두 열린다. `exports`를 설정하면 공개 API를 정밀하게 제어할 수 있다 — 라이브러리의 내부 구현이 바뀌어도 `exports`에 정의된 공개 인터페이스만 안정적으로 유지하면 된다.

---

# `main` 필드는 무엇인가?

## 도입

패키지를 `require('foo')`로 불러올 때 어느 파일이 진입점인지를 지정하는 필드다. `exports`가 없을 때의 기본 진입점 역할을 한다.

---

## 본문

> The main field is a module ID that is the primary entry point to your program.
> That is, if your package is named foo, and a user installs it, and then does require("foo"), then your main module's exports object will be returned.
> This should be a module relative to the root of your package folder.

"main 필드는 프로그램의 주된 진입점인 모듈 ID다. 패키지 이름이 foo이고 사용자가 이를 설치해서 require('foo')를 호출하면, main 모듈의 exports 객체가 반환된다. 이것은 패키지 폴더의 루트를 기준으로 한 모듈 경로여야 한다."

- **module ID**: 파일 경로다. `package.json`이 있는 디렉토리 기준 상대 경로.
- **primary entry point**: 패키지 전체의 단일 진입점. `exports`가 없으면 이 파일이 `require()`의 결과가 된다.
- **relative to the root of your package folder**: `package.json` 위치가 기준. `"main": "dist/index.js"`면 `package.json` 옆 `dist/index.js`.

```json
{
  "main": "dist/index.js"
}
```

```js
// 소비자 코드
const myPkg = require('my-pkg');
// → my-pkg/dist/index.js 의 module.exports 반환

// 명시 안 하면 기본값: index.js (package.json과 같은 위치)
```

---

## 종합

`main`은 CJS 환경의 진입점이다. ESM 환경에서는 `module` 필드(비표준)나 `exports` 필드의 `"import"` 조건이 우선된다. 빌드 도구를 쓰는 프로젝트에서는 소스 파일(`src/index.ts`)이 아니라 빌드 결과물(`dist/index.js`)을 `main`으로 지정해야 한다 — npm에 배포되는 것은 빌드 결과물이기 때문이다.
