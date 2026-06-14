# [UNVERIFIED] Task Runner / Build System / Monorepo Management Tool은 어떤 역할군인가?

## 도입

모노레포 환경에서 "빌드·테스트를 어떻게 관리하는가"를 담당하는 도구 범주가 있다. Task Runner, Build System, Monorepo Management Tool은 겹치는 부분이 많아서 구분이 모호하지만, 핵심 역할을 중심으로 나눌 수 있다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**Task Runner.** 여러 패키지에 대한 task 실행을 조율한다. 패키지 간 의존성 순서를 파악해 빌드 순서를 결정하고, 병렬 실행이 가능한 task는 동시에 돌린다.

**Build System.** 영향 범위가 모노레포 전체다. 빌드·테스트·캐싱을 통합 관리한다. 입력(소스 파일)이 바뀌지 않았으면 이전 빌드 결과를 재사용한다.

**Monorepo Management Tool.** 패키지 생성, release 관리(버전 올리기, changelog), publish 같은 모노레포 운영 기능을 제공한다.

세 역할은 도구마다 겹쳐서 제공된다. Turborepo는 Task Runner + Build System이고, Nx는 세 역할 모두를 포함한다. Lerna는 원래 Monorepo Management Tool이었다.

```
역할과 도구 매핑
역할                        주요 도구
Task Runner                Turborepo, Nx, Lerna
Build System               Turborepo, Nx
Monorepo Management Tool   Nx, Lerna

Turborepo: Task Runner + Build System (패키지 운영 기능은 별도)
Nx: 세 역할 통합
```

---

## 종합

처음 모노레포를 구성할 때 "Task Runner가 필요한가"를 먼저 물어야 한다. 패키지가 2~3개이고 의존 관계가 단순하면 npm workspaces의 기본 기능으로도 충분하다. 패키지 수가 늘고 빌드 시간이 길어지면 캐싱과 병렬 실행을 제공하는 Turborepo나 Nx를 추가한다.

---

# [UNVERIFIED] Task Runner의 종류는 무엇이 있는가?

## 도입

모노레포 Task Runner는 Turborepo, Nx, Lerna가 대표적이다. 각각 등장 배경과 강점이 다르다.

---

## 본문

User Answer 기반(Turborepo·Nx 공식문서 참조)이므로 인용 없이 해설한다.

**Turborepo.** Vercel이 만든 Task Runner + Build System. 설정이 단순하고 기존 npm/yarn/pnpm workspaces 위에 올려쓰는 구조라 도입 비용이 낮다. `turbo.json` 하나로 task 파이프라인을 정의한다.

**Nx.** Nrwl이 만든 통합 모노레포 도구. Task Runner + Build System + 패키지 생성·운영 기능까지 포함한다. 플러그인 생태계가 넓지만 설정이 복잡하다.

**Lerna.** 초기 모노레포 시대의 표준이었던 도구. 버전 관리와 publish가 강점이다. 지금은 Nx와 통합되어 Lerna 단독보다 Nx + Lerna 조합으로 많이 쓴다.

```
도구 비교
              Turborepo     Nx           Lerna
설정 복잡도     낮음          높음          중간
캐싱           O             O             제한적
병렬 실행       O             O             O
패키지 생성     X             O             X
release 관리   X             O (Nx Release) O
```

---

## 종합

새 모노레포를 시작할 때 단순성과 기존 PM 호환성을 원하면 Turborepo, 통합 도구 체인과 코드 생성 기능까지 원하면 Nx를 선택하는 것이 일반적이다. Lerna는 레거시 프로젝트에서 주로 만나게 된다.

---

# [UNVERIFIED] Task Runner는 무엇을 하는가?

## 도입

Task Runner의 핵심 역할은 세 가지다. 패키지 의존성 그래프 기반 병렬 실행, 입력 해시 기반 캐싱, remote cache를 통한 팀 전체 빌드 결과 공유.

---

## 본문

User Answer 기반(Turborepo 공식문서 참조)이므로 인용 없이 해설한다.

**패키지 의존성 그래프 기반 병렬 실행.** 모노레포에서 `packages/ui`가 `packages/utils`에 의존한다면, `utils`를 먼저 빌드하고 그 뒤 `ui`를 빌드해야 한다. Task Runner는 이 의존 순서를 파악해 순서를 보장하면서, 의존 관계가 없는 패키지들은 동시에 빌드한다.

**입력 해시 기반 incremental 캐싱.** 소스 파일이 바뀌지 않았으면 이전 빌드 결과를 그대로 재사용한다. 파일의 해시값을 캐시 키로 쓰므로, 코드가 바뀐 패키지만 다시 빌드한다.

**remote cache.** 팀원 A의 빌드 결과가 원격 저장소(예: Vercel remote cache)에 올라가면, 팀원 B는 같은 입력에 대해 빌드를 돌리지 않고 캐시를 받아온다. CI에서도 마찬가지로, 같은 코드라면 이전 CI 빌드 결과를 재사용한다.

```
Task Runner 작업 그래프 예시
packages/
  utils/    (의존 없음)
  ui/       (depends: utils)
  app-a/    (depends: ui, utils)
  app-b/    (depends: ui)

turbo build 실행 순서:
1. utils (빌드 시작)
2. ui    (utils 완료 후 시작)
3. app-a, app-b (ui 완료 후 동시 시작)
```

---

## 종합

Task Runner 없이 모노레포를 운영하면 "어떤 패키지부터 빌드해야 하는가"를 개발자가 직접 관리해야 한다. 패키지가 10개를 넘어가면 의존 순서를 손으로 맞추는 것이 사실상 불가능하다. Turborepo는 `turbo.json`에 task 파이프라인을 선언하면 나머지를 자동화한다.

---

# [UNVERIFIED] Task Runner를 안 쓰면 어떻게 되는가?

## 도입

Task Runner 없이도 모노레포를 운영할 수 있다. 패키지 매니저의 기본 기능(npm workspaces의 `--workspaces` 플래그 등)을 쓰거나 직접 스크립트를 짜면 된다. 그 비용이 얼마인지를 이해하면 Task Runner를 언제 도입해야 하는지 판단할 수 있다.

---

## 본문

User Answer 기반이므로 인용 없이 해설한다.

**직접 처리해야 하는 것들.**

- **패키지 간 빌드 순서**: `A → B → C` 순서로 빌드해야 하는 의존 관계를 직접 파악하고 스크립트에 하드코딩해야 한다. 의존 관계가 바뀌면 스크립트도 수동으로 수정해야 한다.

- **변경 영향 범위 분석**: PR에서 어떤 패키지가 바뀌었고, 그 패키지에 의존하는 패키지가 무엇인지 분석해야 한다. CI에서 전체 빌드를 돌리면 변경과 무관한 패키지도 매번 빌드된다.

- **캐싱**: 이전에 빌드한 결과를 재사용하는 로직을 직접 구현해야 한다. 단순히 빌드 스크립트를 짜는 것 이상의 인프라 작업이다.

- **CI 효율화**: 변경된 패키지만 빌드하는 CI 파이프라인을 직접 구현하면 복잡도가 높다.

```
Task Runner 없이 모노레포 운영 시
패키지 의존 순서     → 직접 스크립트 관리 (변경 시 수동 수정)
빌드 캐싱           → 없음 (매번 전체 빌드)
변경 영향 범위       → 직접 분석
CI 효율화           → 직접 구현 또는 전체 빌드 반복
```

---

## 종합

패키지가 2~3개인 작은 모노레포는 Task Runner 없이도 관리 가능하다. 패키지 수가 늘고 CI 빌드 시간이 길어지기 시작할 때 Task Runner 도입을 검토하면 된다. Turborepo의 경우 기존 npm workspaces 프로젝트에 `turbo.json`을 추가하고 `package.json` 스크립트를 바꾸는 것만으로 도입이 가능하므로, 진입 비용이 낮다.
