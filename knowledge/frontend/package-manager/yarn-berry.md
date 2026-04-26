---
tags: [javascript, concept, history]
---

# Questions
- Yarn은 무엇인가?
- Yarn의 핵심 features는 무엇인가?
- Plug'n'Play(PnP)는 무엇인가?
- Classic Yarn과 Berry의 차이는?
- Corepack은 무엇이며 왜 필요한가?
- Yarn Berry는 왜 npm에 일부러 배포하지 않았는가?

---

# Answers

## Yarn은 무엇인가?

### Official Answer
Yarn is a modern package manager.
It allows you to install, update, configure, and remove your project dependencies.

### Reference
- https://yarnpkg.com/getting-started

---

## Yarn의 핵심 features는 무엇인가?

### User Answer
- Workspaces: 모노레포 환경에서 여러 패키지를 함께 install·link.
- Offline caching: 한 번 받은 패키지를 캐시해 오프라인에서도 install 가능.
- Parallel installs: 의존성 설치를 병렬로 처리.
- Hardened mode: 의존성 설치의 보안·무결성 강화.
- Interactive commands: install/upgrade 같은 명령을 인터랙티브로 처리.

### Reference
- https://yarnpkg.com/features

---

## Plug'n'Play(PnP)는 무엇인가?

### User Answer
Plug'n'Play는 Yarn Berry의 기본 install 전략이다.
- `node_modules` 디렉토리를 만들지 않는다.
- 대신 단일 `.pnp.cjs` 로더 파일을 생성한다.
- 의존성 트리 정보를 그 파일에 담아두고, require/import를 가로채 모듈을 해석한다.

`node_modules`의 비대함과 중복 문제를 회피하는 게 목적이다.

### Reference
- https://yarnpkg.com/features/pnp

---

## Classic Yarn과 Berry의 차이는?

### User Answer
- Classic Yarn (v1): `node_modules` 방식. npm과 같은 디렉토리 구조.
- Berry (v2 이상): PnP가 기본. `.pnp.cjs` 로더 방식.

### Reference
- https://yarnpkg.com/getting-started/migration

---

## Corepack은 무엇이며 왜 필요한가?

### User Answer
Corepack은 Node.js에 내장된 공식 도구로, 프로젝트별 패키지 매니저 버전을 lockfile처럼 고정한다.
- 프로젝트의 `package.json`이나 `packageManager` 필드에 명시된 버전이 자동으로 사용된다.
- 글로벌 yarn 명령을 직접 깔지 않고도 프로젝트마다 정확한 PM 버전을 사용할 수 있다.

### Reference
- https://nodejs.org/api/corepack.html

---

## Yarn Berry는 왜 npm에 일부러 배포하지 않았는가?

### User Answer
Yarn Berry는 Corepack을 통한 사용을 권장한다.
글로벌 npm으로 yarn을 설치하면 항상 latest 버전이 설치되어, 프로젝트별로 yarn 버전을 고정하는 의도가 깨진다.
이를 막기 위해 Berry는 npm 배포를 일부러 하지 않는다.

### Reference
- https://yarnpkg.com/getting-started/install
- https://toss.tech/article/node-modules-and-yarn-berry
