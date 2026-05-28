# Workspaces란 무엇인가?

## 도입

Workspaces는 패키지 매니저가 제공하는 기능으로, 단일 루트 아래 여러 패키지를 묶어서 관리한다. 핵심 메커니즘은 두 가지다 — 공통 의존성을 루트로 끌어올리는 **호이스팅**과, 워크스페이스 패키지를 서로 참조할 수 있게 하는 **심볼릭링크**.

---

## 본문

> Workspaces are a way to set up a package architecture where a single top-level root package contains multiple child packages called "workspaces".

"Workspaces는 단일 최상위 루트 패키지가 '워크스페이스'라고 불리는 여러 자식 패키지를 포함하는 패키지 아키텍처를 설정하는 방법이다."

- **single top-level root package**: 모노레포의 루트를 의미한다. 루트의 `package.json`에 `workspaces` 필드를 선언하면 그 아래 패키지들이 워크스페이스가 된다.
- **child packages called "workspaces"**: `packages/ui`, `packages/utils`, `apps/web` 같은 하위 패키지들. 각각 독립적인 `package.json`을 가진다.

> This allows you to install all dependencies of multiple projects in one go and to easily refer to the source files from any of these projects.

"이를 통해 여러 프로젝트의 모든 의존성을 한 번에 설치하고, 어떤 프로젝트의 소스 파일도 쉽게 참조할 수 있다."

- **install all dependencies in one go**: 루트에서 `yarn install` 하나로 모든 워크스페이스의 의존성이 한꺼번에 설치된다. 각 패키지 폴더에 들어가서 따로 install할 필요가 없다.
- **easily refer to the source files**: `import { Button } from '@myorg/ui'`처럼 패키지 이름으로 참조할 수 있다. npm에서 install한 게 아니라 심볼릭링크를 통해 로컬 소스를 직접 가리킨다.

User Annotation: 핵심 메커니즘은 두 가지다.
- **호이스팅**: 공통 의존성을 루트 `node_modules`로 끌어올려 중복 설치를 줄인다.
- **심볼릭링크**: 워크스페이스 패키지를 루트 `node_modules`에 심볼릭링크로 노출해, 패키지 이름으로 import할 수 있게 한다.

```
Workspaces 구조
root/
  package.json          workspaces: ["packages/*", "apps/*"]
  node_modules/
    react/              ← 호이스팅: 모든 패키지가 공유
    @myorg/ui → ../../packages/ui   ← 심볼릭링크
    @myorg/utils → ../../packages/utils
  packages/
    ui/
      package.json      name: "@myorg/ui"
      src/Button.tsx
    utils/
      package.json      name: "@myorg/utils"
  apps/
    web/
      package.json      dependencies: { "@myorg/ui": "*" }
```

---

## 종합

Workspaces가 없다면 `@myorg/ui`를 쓰는 앱은 npm에서 설치된 버전을 참조해야 한다. 공통 패키지를 수정할 때마다 publish → install 사이클을 반복해야 한다. Workspaces 덕분에 로컬 패키지를 실시간으로 참조하면서 한 PR로 여러 패키지를 동시에 수정·검증할 수 있다.

---

---

# [UNVERIFIED] Workspaces는 어디서 제공하는 기능인가?

## 도입

Workspaces라는 이름은 익숙하지만, 이 기능이 별도 도구가 아니라 패키지 매니저 자체에 내장되어 있다는 점을 명확히 알아야 한다. Turborepo 같은 Task Runner는 Workspaces 위에 올려쓰는 도구지, Workspaces 자체를 제공하지는 않는다.

---

## 본문

User Answer 기반(npm·Yarn·pnpm 공식문서 참조)이므로 인용 없이 해설한다.

**Workspaces를 제공하는 패키지 매니저.**
- npm Workspaces (`npm@7` 이상)
- Yarn Classic Workspaces (Yarn v1)
- Yarn Berry Workspaces (Yarn v2+)
- pnpm Workspaces

**공통 설정 방식.** 루트 `package.json`의 `workspaces` 필드에 패키지 경로 패턴을 지정한다.

```json
// 루트 package.json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

**패키지 매니저별 차이.** 핵심 개념(호이스팅, 심볼릭링크)은 같지만, 세부 동작(호이스팅 정책, lockfile 형식, PnP 지원 여부)은 PM마다 다르다. pnpm은 완전 호이스팅 대신 가상 스토어 방식으로 `phantom dependencies` 문제를 해결한다.

---

## 종합

Workspaces는 "어떤 PM을 쓰든 제공되는 기본 기능"이다. Turborepo를 도입해도 Workspaces는 PM이 계속 관리한다. 도구 체인을 구성할 때 "Workspaces = PM 기능, Task Runner = Turborepo/Nx"로 역할을 명확히 구분하면 설정이 덜 헷갈린다.
