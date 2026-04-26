# Inbox

다음 학습/검증 단계로 넘어갈 항목들. 출처 문서 헤딩별로 묶음.

---

## Bundler Overview

- TSC는 컴파일러인가 트랜스파일러인가? (둘 다 가능한지 포함)

---

## Vite Overview

- Vite 권장 tsconfig 설정(공식: vite.dev/guide/features.html#typescript)에서 권장하지 않는 항목이 내 설정에 들어있지 않은지 점검
- `import some from '/public/some.png'` 문법이 실제로 가능한가? (Static Assets 절 끝의 의문)

---

## Vite Config

- `build.lib.format`을 `['es']`만으로 줄이면 fileName을 함수 아닌 문자열로 단순화 가능한지 검증
- `build.lib.name`/`fileName`이 없을 때 package.json 어느 필드를 따라가는지 확인
- `index.esm.js`에 모든 컴포넌트 합쳐있을 때 Tree Shaking 실제 동작 검증, 다른 라이브러리는 컴포넌트별 분리 빌드인지 한 파일 합본인지 비교
- viteStaticCopy가 라이브러리에서 공통 scss 내보내기 최적인지 대안 비교
- Vite CLI가 tsconfig.app.json/tsconfig.node.json 분리해 두는 이유 (TS 공식 예약 파일명인지, Vite 사정인지)
- **[검증 필요]** rollupOptions.external 가이드: UI 프레임워크(react, vue 등)·공통 유틸(lodash, dayjs)·peerDependencies는 external. 미적용 시 번들 사이즈↑·중복 로드·React Hooks 런타임 오류 가능 — GPT 답변 기반, 1차 소스 검증 필요

---

## Yarn (Berry)

- 깃허브에 뭐 올려? (`.gitignore` 대상) — yarnpkg QA 문서 학습
- 모르겠는 키워드 학습: Plug'n'Play 동작 원리, Ghost dependencies, Zero install, packageExtensions
- PnP footguns / advantages 학습
- 마이그레이션 가이드 학습 (yarnpkg/migration/guide, /pnp)
- 캐싱 feature 문서 학습 (yarnpkg/features/caching)
- PnP troubleshooting 문서 학습

---

## Npm Registry

- npm 사이트 구조 / 명령어 체계 학습
- velog "최신 npm 패키지 만들기 위한 모범 사례" 정독 후 컴포넌트 프로젝트 요구사항 보충

---

## GitHub Packages

- PAT, GitHub Tokens 개념 학습
- Quickstart for GitHub Packages 정독
- Repository ↔ Package 연결 방법
- Publishing/Installing a package 가이드 정독
- npm registry와 GitHub Packages 연동 방법
- GitHub Actions로 publish/install workflow (Example workflows 포함)
- GitHub Packages × GitHub Actions 통합 개요
- 패키지 권한 모델: Overview of package permissions, About permissions for GitHub Packages
- 패키지 가시성 모델: Overview of package visibility, Configuring access control and visibility
- GitHub Packages 인증 방식
- 패키지 조회 (Viewing packages)

---

## lockfile

- lockfile 목적: 직접 설치 안 한 패키지가 `node_modules`에 들어간 이유(전이 의존성 출처)를 lockfile로 추적할 수 있는가
- `package.json`에 정확한 고정 버전 박을 때 단점 (왜 `^`/`~`인가)
- 동일 패키지가 다른 모듈에서 다른 범위로 요구될 때 호환 결정 메커니즘과 lockfile 기록
- References:
  - https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json
  - https://classic.yarnpkg.com/en/docs/package-json

---

## package.json Overview

- toss.tech `commonjs-esm-exports-field` 아티클 정독

---

## package.json version

- 유튜브 https://youtu.be/0TsLKDLdxSw?si=pIUiidS3oc-BsW74 정독
- axios 자동 업그레이드 방지 방법 — 전부 fix 외 대안 ("axios 버전 지멋대로 올라가서 깨짐 방지방법. 전부 fix는 과도. `^`/`~` 존재 이유 재확인")

---

## Monorepo Overview (비중 가드 — 일반화된 후보만)

- 디자인 시스템 프로젝트는 빌드 후 사용해야 하는가? (root layout css import 이슈)
- 모노레포 패키지 참조 방식: `"file:../.."` vs 모노레포 표준 차이
- tsconfig 직접 참조의 trade-off
- 단일 공통 컴포넌트 패키지 vs 잘게 분리하는 기준
- 모노레포 패키지 버전 관리 모범 사례
- 외부 공개 시 GitHub Packages 사용 방법
- "Monorepo 대기업 도입 사례" 정독

---

## Polyrepo vs Monorepo

- **[검증 필요]** "publish & install로 어드민만 선반영 가능 / 모노레포에서도 가능 (테스트 안 함)" — 결론·검증 미완

---

## Task Runner Overview

- Webpack Module Federation과 Task Runner의 관계는? (역할 비슷한가)

---

## Workspaces Overview

- Yarn Workspaces Constraints 기능
- 의존성 호이스팅이란
- 심볼릭링크 vs 하드링크 차이 (Workspaces가 어느 쪽?)
- Workspaces Features 페이지 하위 링크들 정독
- 패키지 간 import 정석 방식 (workspaces cross-references) — Yarn 공식
- Workspaces declaration 방식 (각 PM별 선언법)
- Yarn Workspaces focused installs (나중에)

---

## 공통적인 프로젝트 요구사항

- 버저닝 정책 결정 + CI 자동 npm publish 파이프라인 구축
- RTL 테스팅 도입 + CI/CD 통합

---

## 외부 Registry로 올리는 프로젝트 요구사항

- tsconfig `include`/`exclude`가 라이브러리 진입점/배포 영향 주는지 확인
- `.npmignore` 역할과 `package.json` `files` 필드 차이 정리

---

## 디자인 시스템 프로젝트 만들기

- design-token CSS가 빌드 결과물 style.css와 별도 export된 design-token.scss에 중복 포함되는지 검증 (Vite 동작 확인)
- CSS 코드 스플리팅이 되는지, 컴포넌트별 CSS 분리가 의미 있는지 (디자인 시스템 규모 커질 때)

---

## design-system 프로젝트 import 방식 (비중 가드 — 핵심만)

- 디자인 시스템: 모노레포 vs 외부 publish 결정 (publish해서 쓸 패키지를 모노레포에 두는 게 이득인가)
- References: https://classic.yarnpkg.com/en/docs/workspaces/#cross-references
