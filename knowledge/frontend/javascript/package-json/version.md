---
tags: [javascript, concept, best-practice]
---

# Questions
- dependencies/devDependencies/peerDependencies는 왜 존재하는가?
- devDependencies는 무엇을 위한 필드인가?
- peerDependencies는 무엇을 위한 필드인가? (Purpose)
- peerDependencies는 npm 버전에 따라 어떻게 동작하는가?
- peerDependencies 버전 범위는 어떻게 작성해야 하는가?
- peerDependencies는 의존성 그래프에 어떻게 나타나는가?
- 의존성 그래프는 왜 보여주는가?
- peerDependencies 사용 예시는?

---

# Answers

## dependencies/devDependencies/peerDependencies는 왜 존재하는가?

### User Answer
어떤 모듈을 어떤 버전으로 설치해야 하는지를 명시하기 위해서다.
이 필드들이 없으면 사용자가 직접 버전을 찾아서 코드를 zip으로 받아 깔아야 한다.
세 필드는 그 모듈을 어떤 맥락에서 필요로 하는지에 따라 분리되어 있다.

---

## devDependencies는 무엇을 위한 필드인가?

### Official Answer
If someone is planning on downloading and using your module in their program, then they probably don't want or need to download and build the external test or documentation framework that you use.

### User Annotation
사용자가 패키지를 install 할 때 빌드/테스트/문서 도구는 받지 않도록 분리하기 위함이다.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devdependencies

---

## peerDependencies는 무엇을 위한 필드인가? (Purpose)

### Official Answer
In some cases, you want to express the compatibility of your package with a host tool or library.

### User Annotation
**중복 설치 방지**: Next.js 프로젝트에 ESLint가 이미 하나 설치되어 있는데, `@next/eslint-plugin-next`가 또 자기만의 ESLint를 들고 온다면 ESLint가 두 개 설치되는 꼴이 된다.
이는 불필요한 용량 낭비이고, 충돌을 일으킬 가능성이 있다.
peerDependencies를 사용하면 프로젝트에 ESLint는 딱 하나만 깔리게 하고, 여러 ESLint 플러그인들이 그 하나의 ESLint 인스턴스를 공유하게 된다.

**호환성 보장**: `@next/eslint-plugin-next`가 "나는 ESLint 8.x 버전이랑만 호환돼!"라고 명시했기 때문에, 만약 실수로 ESLint 7.x 버전을 사용한다면 npm(또는 yarn, pnpm)이 경고나 에러를 띄워 "이 플러그인 쓰려면 ESLint 8.x 이상으로 업데이트해야 해!"라고 알려준다.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies

---

## peerDependencies는 npm 버전에 따라 어떻게 동작하는가?

### Official Answer
In npm versions 3 through 6, peerDependencies were not automatically installed, and would raise a warning if an invalid version of the peer dependency was found in the tree.
As of npm v7, peerDependencies are installed by default.

Trying to install another plugin with a conflicting requirement may cause an error if the tree cannot be resolved correctly.

### User Annotation
- npm v3~v6: peerDependencies 자동 설치 X. 호환되지 않는 버전이 트리에 있으면 경고만.
- npm v7+: 기본 자동 설치. 충돌이 트리로 해결되지 않으면 에러.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies

---

## peerDependencies 버전 범위는 어떻게 작성해야 하는가?

### Official Answer
For this reason, make sure your plugin requirement is as broad as possible, and not to lock it down to specific patch versions.

Assuming the host complies with semver, only changes in the host package's major version will break your plugin.
Thus, if you've worked with every 1.x version of the host package, use "^1.0" or "1.x" to express this.
If you depend on features introduced in 1.5.2, use "^1.5.2".

### User Annotation
- 호스트 패키지가 semver를 따른다고 가정.
- 호스트의 major 버전이 바뀔 때만 깨진다.
- 1.x 전부 호환이면 `"^1.0"` 또는 `"1.x"`.
- 1.5.2에서 도입된 기능에 의존하면 `"^1.5.2"`.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies

---

## peerDependencies는 의존성 그래프에 어떻게 나타나는가?

### Official Answer
This ensures your package @npm/tea-latte can be installed along with the second major version of the host package @npm/tea only.
npm install tea-latte could possibly yield the following dependency graph:

```
├── @npm/tea-latte@1.3.5
└── @npm/tea@2.2.0
```

### User Annotation
- 그래프의 갈래 기호는 어떤 패키지가 다른 패키지 아래에 종속되어 있는지를 시각적으로 보여준다.
- `@npm/tea-latte@1.3.5`: 사용자가 `npm install tea-latte`로 직접 설치를 요청한 패키지. `@1.3.5`는 버전.
- `@npm/tea@2.2.0`: `@npm/tea-latte`의 peerDependencies에 의해 자동 설치된 패키지. `@2.2.0`은 버전.

`@npm/tea-latte` (1.3.5)를 설치했더니, 호스트 패키지인 `@npm/tea` (2.2.0)도 함께 설치됐다는 의미다.
peerDependencies에 `"@npm/tea": "2.x"`로 명시된 조건이 잘 지켜진 결과다.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies

---

## 의존성 그래프는 왜 보여주는가?

### User Answer
의존성 그래프는 패키지를 설치했을 때 의도한 대로 모든 의존성이 올바른 버전으로 설치됐는지 확인하는 데 유용하다.
복잡한 프로젝트일수록 패키지들이 서로 다른 의존성을 가질 수 있어 버전 충돌이 발생할 수 있는데, 이 그래프로 시각적으로 파악할 수 있다.

Next.js 프로젝트의 `node_modules`를 열어보면 수많은 패키지가 층층이 쌓여있다.
의존성 그래프는 그 복잡한 관계를 깔끔하게 정리해 보여주는 도구다.

---

## peerDependencies 사용 예시는?

### Official Answer
```json
{
  "name": "@next/eslint-plugin-next",
  "version": "13.x.x",
  "peerDependencies": {
    "eslint": ">=8.0.0",
    "react": ">=17.0.0 || >=18.0.0"
  }
}
```

### User Annotation
`@next/eslint-plugin-next` 패키지는 ESLint 8.0.0 이상이 반드시 설치되어 있어야 동작한다는 의미다.

라이브러리 프로젝트에서는 dependencies에 설치할 만한 것을 전부 peerDependencies + devDependencies로 옮겨, 빌드 결과물 번들에 포함되지 않게 한다.
- 예: 내보내는 번들에서 `next`를 제거.

### Reference
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies
