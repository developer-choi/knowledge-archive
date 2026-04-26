---
tags: [concept, ci-cd]
---

# Questions
- GitHub Packages는 무엇인가?
- GitHub Packages가 일반 패키지 레지스트리와 차별화되는 가치는?
- GitHub Packages는 어떤 패키지 종류를 지원하는가?

---

# Answers

## GitHub Packages는 무엇인가?

### Official Answer
GitHub Packages is a software package hosting service that allows you to host your software packages privately or publicly and use packages as dependencies in your projects.

### Reference
- https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages

---

## GitHub Packages가 일반 패키지 레지스트리와 차별화되는 가치는?

### User Answer
- Hosting + managing: 단순 업로드만이 아니라, 컨테이너 등 의존성까지 함께 관리한다.
- 권한 통합: 소스 코드와 패키지의 권한이 GitHub의 동일 권한 모델에 통합된다.
- DevOps 연동: GitHub의 API/Actions/webhooks와 함께 end-to-end CI/CD 파이프라인을 구성하기 쉽다.
- Native 도구 사용: 각 패키지 생태계의 native 명령(npm, gem, mvn 등)을 그대로 사용해 publish/install 가능.

### Reference
- https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages

---

## GitHub Packages는 어떤 패키지 종류를 지원하는가?

### User Answer
지원 registry.
- npm
- RubyGems
- Apache Maven
- Gradle
- Docker
- NuGet

특히 Container registry는 Docker/OCI 이미지에 최적화되어 있다.

### Reference
- https://docs.github.com/en/packages/working-with-a-github-packages-registry
