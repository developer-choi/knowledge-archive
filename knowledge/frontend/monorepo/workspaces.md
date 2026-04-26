---
tags: [concept, architecture]
---

# Questions
- Workspaces란 무엇인가?
- Workspaces는 어디서 제공하는 기능인가?

---

# Answers

## Workspaces란 무엇인가?

### Official Answer
Workspaces are a way to set up a package architecture where a single top-level root package contains multiple child packages called "workspaces".
This allows you to install all dependencies of multiple projects in one go and to easily refer to the source files from any of these projects.

### User Annotation
- 같은 프로젝트 안의 패키지들을 install·link 해 cross-reference를 단순화하는 기능이다.
- 핵심 메커니즘: 의존성 호이스팅 + 심볼릭링크.
  - 호이스팅: 공통 의존성을 루트 `node_modules`로 끌어올려 중복 설치를 줄인다.
  - 심볼릭링크: 워크스페이스 내 패키지를 `node_modules`에 심볼릭링크로 노출해, 다른 패키지에서 패키지 이름으로 import 할 수 있게 한다.

### Reference
- https://classic.yarnpkg.com/en/docs/workspaces/

---

## Workspaces는 어디서 제공하는 기능인가?

### User Answer
패키지 매니저가 제공하는 기능이다.
- npm Workspaces
- Yarn Classic Workspaces
- Yarn Berry Workspaces
- pnpm Workspaces

별도 도구가 아니라 PM 자체 기능이라는 점이 핵심이다.

### Reference
- https://docs.npmjs.com/cli/v11/using-npm/workspaces
- https://classic.yarnpkg.com/en/docs/workspaces/
- https://yarnpkg.com/features/workspaces
- https://pnpm.io/workspaces
