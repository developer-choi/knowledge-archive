---
tags: [javascript, concept, best-practice]
---

# Questions
- `name` 필드의 명명 규약은 무엇인가?
- `private: true`는 어떤 효과가 있는가?
- `publishConfig`는 무엇을 위한 필드인가?
- `type` 필드는 무엇을 결정하는가?
- `module` 필드는 무엇인가?

---

# Answers

## `name` 필드의 명명 규약은 무엇인가?

### Official Answer
The name must be less than or equal to 214 characters.
The name can't start with a dot or an underscore.
New packages must not have uppercase letters in the name.
The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.

### User Annotation
- 대문자 금지.
- URL-safe 문자만 허용.
- `js`, `node` 같은 일반 명사는 자제 (검색 충돌 우려).

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#name

---

## `private: true`는 어떤 효과가 있는가?

### Official Answer
If you set "private": true in your package.json, then npm will refuse to publish it.

### User Annotation
사적 저장소나 모노레포 내부 패키지에서 실수 발행을 막기 위해 자주 쓴다.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#private

---

## `publishConfig`는 무엇을 위한 필드인가?

### Official Answer
This is a set of config values that will be used at publish-time.
It's especially handy if you want to set the tag, registry or access, so that you can ensure that a given package is not tagged with "latest", published to the global public registry or that a scoped module is private by default.

### User Annotation
내부 레지스트리(GitHub Packages 등)로 게시 대상을 강제할 때 사용한다.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#publishconfig

---

## `type` 필드는 무엇을 결정하는가?

### User Answer
`type` 필드는 패키지가 어떤 모듈 시스템으로 처리될지를 결정한다.
- `"type": "module"`: ESM으로 처리. `.mjs` 확장자나 `import`/`import()` 함수 사용 가능.
- `"type": "commonjs"` (또는 생략): CJS로 처리. `.cjs` 확장자나 `require()` 사용 가능.

정의되어 있지 않으면 기본값은 `"commonjs"`다.

### Reference
- https://nodejs.org/api/packages.html#type

---

## `module` 필드는 무엇인가?

### User Answer
`module` 필드는 `main` 필드와 유사한 목적으로 사용된다.
ESM(ES6 호환) 환경에서 패키지를 사용할 때 진입되는 경로를 지정한다.

```json
{
  "module": "./sources/index.mjs"
}
```

`type: "module"`로 설정한 패키지를 npm에 발행한다면, 사용자가 패키지를 불러올 때 사용될 `mjs` 파일을 `module` 필드로 명시한다.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json
- https://classic.yarnpkg.com/en/docs/package-json
- https://yarnpkg.com/configuration/manifest
