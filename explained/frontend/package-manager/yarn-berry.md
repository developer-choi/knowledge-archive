# Yarn은 무엇인가?

## 도입

Yarn은 npm의 초기 문제(느린 설치 속도, lockfile 부재, 보안 취약점)를 해결하기 위해 Facebook이 만든 패키지 매니저다. 현재는 Classic(v1)과 Berry(v2+)로 나뉘며, 두 버전의 동작 방식이 근본적으로 다르다.

---

## 본문

> Yarn is a modern package manager. It allows you to install, update, configure, and remove your project dependencies.

"Yarn은 현대적인 패키지 매니저다. 프로젝트 의존성을 설치, 업데이트, 설정, 제거할 수 있게 해준다."

- **modern**: npm 초기의 한계를 극복하기 위해 만들어졌다는 맥락. lockfile, 병렬 설치, 캐시 같은 기능이 "현대적"이라는 단어에 담겨 있다.
- **install, update, configure, and remove**: PM의 네 가지 핵심 동작을 열거한다. 단순 다운로드가 아니라 의존성의 생명주기 전체를 관리한다.

---

## 종합

Yarn은 npm보다 빠른 설치와 안정적인 lockfile을 앞세워 등장했고, 이후 npm도 `yarn.lock`에서 영감을 받아 `package-lock.json`을 도입했다. 현재 npm과 Yarn Classic의 격차는 줄었지만, Yarn Berry는 PnP라는 전혀 다른 아키텍처로 차별화를 이어가고 있다.

---

---

# [UNVERIFIED] Yarn의 핵심 features는 무엇인가?

## 도입

Yarn이 제공하는 주요 기능을 알면 "왜 npm 대신 Yarn을 쓰는가"에 대한 답이 된다. Yarn 공식문서의 Features 페이지를 기준으로 정리한다.

---

## 본문

User Answer 기반(Yarn 공식문서 참조)이므로 인용 없이 해설한다.

**Workspaces.** 모노레포에서 여러 패키지를 하나의 `yarn install`로 설치하고 심볼릭링크로 연결한다. 별도 설명은 workspaces.md 참조.

**Offline caching.** 한 번 설치한 패키지를 로컬 캐시에 저장해둔다. 네트워크 없이도 캐시에서 설치가 가능하다. CI 환경에서 캐시를 재활용하면 설치 시간이 줄어든다.

**Parallel installs.** 패키지 설치를 병렬로 처리한다. npm 초기 버전의 순차 설치와 달리 여러 패키지를 동시에 다운로드해서 설치 속도가 빠르다.

**Hardened mode.** 의존성 설치의 보안·무결성을 강화한다. checksums을 검증하고, 예상치 못한 패키지 변경을 감지한다.

**Interactive commands.** `yarn upgrade-interactive` 같이 인터랙티브 UI로 의존성을 확인하며 작업할 수 있다.

---

## 종합

이 기능들은 현재 npm도 대부분 지원한다. Yarn을 선택하는 주된 이유는 지금은 Berry(v2+)의 PnP와 zero-install 전략 때문인 경우가 많다.

---

---

# [UNVERIFIED] Plug'n'Play(PnP)는 무엇인가?

## 도입

Yarn Berry의 가장 큰 혁신은 PnP(Plug'n'Play)다. `node_modules` 디렉토리를 아예 만들지 않는 대신, 단일 로더 파일로 모듈 해석을 대체한다. `npm install` 후 `node_modules`가 수십만 파일로 불어나는 것을 경험했다면 PnP가 해결하려는 문제를 이해할 수 있다.

---

## 본문

User Answer 기반(Yarn 공식문서 참조)이므로 인용 없이 해설한다.

**기존 `node_modules`의 문제.** `npm install` 후 `node_modules`는 수만~수십만 개의 파일이 된다. 이 파일들을 디스크에 쓰는 I/O 작업이 설치 시간의 상당 부분을 차지한다. 또한 `node_modules`는 git에 올리지 않으므로 CI에서 매번 다시 설치해야 한다.

**PnP의 해결 방식.**
- `node_modules` 디렉토리를 만들지 않는다.
- 대신 단일 `.pnp.cjs` 파일을 생성한다.
- 이 파일에 "패키지 A는 어디에 있고, 버전은 무엇이다"라는 의존성 트리 정보를 담는다.
- Node.js가 `require`/`import`를 처리할 때 `.pnp.cjs`가 가로채서 모듈 위치를 알려준다.

```
기존 node_modules 방식           PnP 방식
node_modules/                    .pnp.cjs (로더 파일 1개)
  react/          (수천 파일)    .yarn/cache/
  react-dom/                       react-*.zip
  lodash/                          react-dom-*.zip
  ...수만 파일...                   lodash-*.zip (압축 파일)

설치: 수만 파일을 디스크에 씀     설치: zip 압축 파일만 저장
모듈 해석: 디렉토리 탐색           모듈 해석: .pnp.cjs 룩업
```

**zero-install.** `.yarn/cache`(zip 파일들)와 `.pnp.cjs`를 git에 커밋하면, `yarn install` 없이 clone 직후 바로 실행 가능하다.

---

## 종합

PnP는 `node_modules`의 비대함과 느린 설치 속도를 근본적으로 해결한다. 단, 기존 도구(IDE, 일부 빌드 도구)가 `node_modules` 경로를 직접 탐색하는 경우 호환성 문제가 생길 수 있다. Yarn Berry가 이런 도구를 위해 `node-modules` linker 옵션도 제공하는 이유다.

---

---

# [UNVERIFIED] Classic Yarn과 Berry의 차이는?

## 도입

Yarn v1(Classic)과 v2+(Berry)는 이름이 같지만 내부 동작이 근본적으로 다르다. 마이그레이션 가이드가 별도로 존재할 만큼 큰 변화다.

---

## 본문

User Answer 기반(Yarn 공식문서 참조)이므로 인용 없이 해설한다.

**Classic Yarn (v1).**
- `node_modules` 기반. npm과 같은 디렉토리 구조를 사용한다.
- `yarn.lock`으로 버전 고정.
- 지금도 많은 프로젝트에서 사용되지만, 더 이상 기능 개발이 없고 보안 패치만 받는다.

**Berry (v2 이상).**
- PnP가 기본 install 전략. `.pnp.cjs` 로더 방식.
- node-modules linker로 전환하면 v1과 유사하게 동작 가능.
- Corepack을 통한 버전 관리가 권장된다.
- 플러그인 시스템, zero-install, workspace 기능 강화.

```
Classic vs Berry
                Classic (v1)          Berry (v2+)
install 방식     node_modules          PnP (.pnp.cjs)
lockfile         yarn.lock             yarn.lock (형식 다름)
배포              npm (global install)  Corepack 권장
기능 개발         종료 (보안 패치만)     활발히 개발 중
```

---

## 종합

새 프로젝트라면 Berry를 기본으로 검토하되, 팀의 도구 체인(IDE, CI, 기존 패키지)이 PnP와 호환되는지 먼저 확인해야 한다. 호환성 이슈가 있으면 `.yarnrc.yml`에서 `nodeLinker: node-modules`로 전환하면 Classic과 유사하게 동작한다.

---

---

# [UNVERIFIED] Corepack은 무엇이며 왜 필요한가?

## 도입

팀원마다 설치된 yarn 버전이 다르면 lockfile 형식이 맞지 않거나 동작이 달라질 수 있다. Corepack은 프로젝트별로 PM 버전을 고정하는 Node.js 내장 도구다.

---

## 본문

User Answer 기반(Node.js 공식문서 참조)이므로 인용 없이 해설한다.

**Corepack의 역할.** `package.json`의 `packageManager` 필드에 명시된 PM 버전을 자동으로 사용하게 한다. 팀원이 글로벌에 yarn을 설치하지 않아도, 프로젝트 디렉토리에서 `yarn` 명령을 실행하면 Corepack이 명시된 버전을 자동으로 다운로드해서 실행한다.

```json
// package.json
{
  "packageManager": "yarn@4.1.0"
}
```

팀원 A가 `packageManager: yarn@4.1.0`인 프로젝트에서 `yarn install`을 실행하면, 글로벌에 어떤 yarn 버전이 있든 4.1.0이 사용된다.

**Corepack 활성화.** Node.js에 내장되어 있지만 기본적으로 비활성화되어 있다. `corepack enable`로 활성화한다.

---

## 종합

Corepack은 "PM 버전 lockfile"이다. 앱 의존성을 lockfile로 고정하는 것처럼, PM 자체 버전도 고정해야 팀 전체와 CI에서 일관된 동작을 보장한다. Berry가 npm에 배포하지 않는 이유도 이 맥락에서 이해할 수 있다.

---

---

# [UNVERIFIED] Yarn Berry는 왜 npm에 일부러 배포하지 않았는가?

## 도입

`npm install -g yarn`으로 Yarn을 설치하면 항상 최신 버전이 설치된다. Berry는 이 방식이 프로젝트별 버전 고정 의도를 깬다고 판단해, npm 배포를 의도적으로 하지 않는다.

---

## 본문

User Answer 기반(Yarn 공식문서·Toss Tech 참조)이므로 인용 없이 해설한다.

**문제.** `npm install -g yarn@latest`를 실행하면 시스템에 최신 Yarn이 전역으로 설치된다. 이 상태에서 `packageManager: yarn@4.0.0`인 프로젝트에서 `yarn install`을 하면, 시스템 글로벌 yarn(다른 버전)이 실행된다. 프로젝트마다 다른 버전을 써야 하는 의도가 깨진다.

**Berry의 해결 방식.** npm에 최신 버전을 배포하지 않아서, `npm install -g yarn`으로 최신 Berry를 설치할 수 없게 한다. 대신 Corepack을 통해 프로젝트별 버전을 정확하게 제어한다.

```
npm에 배포했다면 (문제 상황)
npm install -g yarn        → yarn@latest 전역 설치
프로젝트 A (packageManager: yarn@4.0.0)에서 yarn
  → 전역 yarn@latest 실행 (버전 불일치)

Corepack 방식 (의도된 해결)
corepack enable
프로젝트 A (packageManager: yarn@4.0.0)에서 yarn
  → Corepack이 yarn@4.0.0 자동 다운로드 후 실행
```

---

## 종합

Berry의 npm 비배포는 의도된 설계 결정이다. "글로벌 설치 → 모든 프로젝트에 적용"이라는 전통적인 방식 대신 "프로젝트별 버전 명시 → Corepack이 관리"로 패러다임을 전환한 것이다. 이 덕분에 `packageManager` 필드가 PM 버전의 정확한 사양서 역할을 한다.
