---
tags: [javascript, concept, best-practice]
source: official
publishable: false
priority:
---

# Questions
- `files` 필드는 무엇을 제어하는가?
- `files` 설정과 무관하게 항상 포함되는 파일은 무엇인가?
- `files` 설정과 무관하게 항상 무시되는 파일은 무엇인가?
- `files` glob에 추가해도 절대 포함될 수 없는 파일은 무엇인가?
- `.npmignore`와 `.gitignore`의 관계는?
- `exports` 필드는 어떤 효과가 있는가?
- `main` 필드는 무엇인가?

---

# Answers

## `files` 필드는 무엇을 제어하는가?

### Official Answer
The optional files field is an array of file patterns that describes the entries to be included when your package is installed as a dependency.
Omitting the field will make it default to ["**"], which means it will include all files.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files

---

## `files` 설정과 무관하게 항상 포함되는 파일은 무엇인가?

### Official Answer
Some special files and directories are also included or excluded regardless of whether they exist in the files array (see below).
- package.json
- README
- LICENSE / LICENCE
- The file in the "main" field
- The file(s) in the "bin" field

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files

---

## `files` 설정과 무관하게 항상 무시되는 파일은 무엇인가?

### Official Answer
Some files are always ignored by default:
- *.orig
- .*.swp
- .DS_Store
- ._*
- (이하 생략)

Most of these ignored files can be included specifically if included in the files globs.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files

---

## `files` glob에 추가해도 절대 포함될 수 없는 파일은 무엇인가?

### Official Answer
Exceptions to this are:
- .git
- .npmrc
- node_modules
- package-lock.json
- pnpm-lock.yaml
- yarn.lock

These can not be included.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files

---

## `.npmignore`와 `.gitignore`의 관계는?

### Official Answer
You can also provide a .npmignore file in the root of your package or in subdirectories, which will keep files from being included.
The .npmignore file works just like a .gitignore.
If there is a .gitignore file, and .npmignore is missing, .gitignore's contents will be used instead.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files

---

## `exports` 필드는 어떤 효과가 있는가?

### Official Answer
"exports" prevents any other entry points besides those defined in "exports".

> #### User Annotation:
> - `exports` 필드가 없으면 빌드 결과물의 모든 파일이 import 가능해진다.
>   - 예: 실제로 `exports` 필드를 삭제했을 때, dist 디렉토리의 `common.module.scss`, `first-thing.css`, `first-thing.js`, `first-thing.umd.cjs`, `index.d.ts`, `vite.svg` 등 모든 파일이 외부에서 import 가능했다.
> - viteStaticCopy 플러그인처럼 정적 파일을 빌드 결과물에 함께 포함시키는 경우, 그 파일들을 일일이 `exports`에 등록하기 번거롭다.
>   → 정적 파일 노출을 자유롭게 두고 싶으면 `exports` 미설정이 편할 수 있다.

### Reference
- https://nodejs.org/api/packages.html#package-entry-points

---

## `main` 필드는 무엇인가?

### Official Answer
The main field is a module ID that is the primary entry point to your program.
That is, if your package is named foo, and a user installs it, and then does require("foo"), then your main module's exports object will be returned.

This should be a module relative to the root of your package folder.

> #### User Annotation:
> - 예: `"main": "dist/index.js"`라면, package.json이 있는 폴더 안에 `dist/` 폴더가 있고 그 안에 `index.js`가 있어야 한다.
> - 명시하지 않으면 기본적으로 프로젝트 최상위의 `index.js`가 사용된다.
> - Babel 같은 트랜스파일러나 Webpack 같은 번들러를 쓸 경우, 소스 파일 대신 빌드 결과물 디렉토리 안의 파일을 `main`으로 지정해야 한다.
>
> ```json
> {
>   "main": "build/index.js"
> }
> ```

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#main
