---
tags: [concept, architecture]
---

# Questions
- Task Runner / Build System / Monorepo Management Tool은 어떤 역할군인가?
- Task Runner의 종류는 무엇이 있는가?
- Task Runner는 무엇을 하는가?
- Task Runner를 안 쓰면 어떻게 되는가?

---

# Answers

## Task Runner / Build System / Monorepo Management Tool은 어떤 역할군인가?

### User Answer
모노레포 환경에서 빌드/테스트/캐싱 같은 작업을 통합 관리하는 역할군이다.
- Task Runner: 여러 패키지에 대한 task 실행을 조율 (병렬 실행, 의존성 순서 등).
- Build System: 영향 범위가 모노레포 전체. 빌드/테스트/캐싱을 책임진다.
- Monorepo Management Tool: 패키지 generator, release 관리 같은 모노레포 운영 기능 통합.

세 역할은 도구마다 겹쳐서 제공된다.

---

## Task Runner의 종류는 무엇이 있는가?

### User Answer
- Turborepo
- Nx
- Lerna

### Reference
- https://turbo.build/repo
- https://nx.dev/

---

## Task Runner는 무엇을 하는가?

### User Answer
Turborepo의 미션을 라인 기술블로그 정리에서 인용하면, "모노레포 환경에서 빌드 도구를 제공해 복잡한 빌드 시스템을 직접 구축하는 대신 표준화된 도구로 대체한다"는 것이다.
또한 "전체 빌드·테스트·캐싱을 책임지는 빌드 시스템이며, 영향 범위가 모든 프로젝트"다.

세부 기능.
- 패키지 의존성 그래프 기반 병렬 실행.
- 입력 해시 기반 incremental 캐싱 (이미 빌드한 결과 재사용).
- remote cache로 팀 전체가 빌드 결과 공유.

### Reference
- https://engineering.linecorp.com/ko/blog/

---

## Task Runner를 안 쓰면 어떻게 되는가?

### User Answer
Task Runner 없이 모노레포를 운영하면, Yarn workspaces의 parallel execution 같은 PM 기본 기능에 의존하거나 직접 스크립트를 짜야 한다.
이 경우 다음을 직접 처리해야 한다.
- 패키지 간 빌드 순서.
- 변경 영향 범위 분석.
- 캐싱.
- CI에서 변경된 패키지만 빌드.
