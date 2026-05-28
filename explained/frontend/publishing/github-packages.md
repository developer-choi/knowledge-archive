# GitHub Packages는 무엇인가?

## 도입

npm 레지스트리는 공개 패키지를 배포하는 데 최적화되어 있지만, 회사 내부 패키지를 비공개로 관리하거나 GitHub의 권한 모델과 통합하려면 별도 수단이 필요하다. GitHub Packages는 GitHub가 제공하는 패키지 호스팅 서비스로, 소스 코드와 패키지를 같은 플랫폼에서 관리할 수 있다.

---

## 본문

> GitHub Packages is a software package hosting service that allows you to host your software packages privately or publicly and use packages as dependencies in your projects.

"GitHub Packages는 소프트웨어 패키지 호스팅 서비스로, 패키지를 비공개 또는 공개로 호스팅하고 프로젝트의 의존성으로 사용할 수 있게 해준다."

- **software package hosting service**: 단순 파일 저장이 아니라 패키지 레지스트리로서 동작한다. npm, RubyGems, Docker 이미지 등을 호스팅할 수 있다.
- **privately or publicly**: 공개 npm 레지스트리와 달리 private 패키지를 비용 없이(GitHub 무료 플랜 한도 내에서) 호스팅할 수 있다.
- **use packages as dependencies**: 배포한 패키지를 다른 프로젝트에서 `package.json`의 `dependencies`로 선언해 설치할 수 있다. npm 패키지를 설치하는 것과 동일한 방식이다.

---

## 종합

GitHub Packages의 핵심 가치는 "소스 코드와 패키지를 같은 플랫폼에서 관리"다. 팀 내부 라이브러리를 npm에 공개하고 싶지 않을 때, 또는 GitHub Actions와 연동해 CI/CD를 구성할 때 자연스러운 선택이다.

---

---

# [UNVERIFIED] GitHub Packages가 일반 패키지 레지스트리와 차별화되는 가치는?

## 도입

npm 레지스트리도 private 패키지를 지원한다(유료). GitHub Packages는 같은 기능을 제공하면서 GitHub 생태계와의 통합에서 차별화된다.

---

## 본문

User Answer 기반(GitHub 공식문서 참조)이므로 인용 없이 해설한다.

**Hosting + managing.** 단순 업로드를 넘어, 컨테이너 이미지나 다양한 패키지 형식의 의존성까지 함께 관리한다.

**권한 통합.** GitHub의 단일 권한 모델(repository 접근 권한, 조직 팀 권한)이 패키지 접근에도 그대로 적용된다. 별도 레지스트리 권한 관리 없이 GitHub 팀 구성만으로 패키지 접근을 제어할 수 있다.

**DevOps 연동.** GitHub Actions에서 패키지를 publish하거나 설치할 때 별도 인증 설정 없이 `GITHUB_TOKEN`으로 자동 인증된다. webhook과 API를 통해 패키지 이벤트를 CI/CD 파이프라인에 연결할 수 있다.

**Native 도구 사용.** npm, gem, mvn 같은 각 생태계의 native 명령을 그대로 사용한다. 별도 CLI를 배우지 않아도 된다.

```
GitHub Packages 통합 구조
GitHub Repository
  ├── 소스 코드 (git)
  ├── GitHub Actions   publish workflow
  └── GitHub Packages  패키지 레지스트리
        ├── @myorg/ui@1.0.0
        └── @myorg/utils@2.0.0

권한: GitHub 팀 멤버 = 패키지 접근 가능
인증: GITHUB_TOKEN (자동)
```

---

## 종합

GitHub Packages의 가장 큰 장점은 설정 복잡도가 낮다는 것이다. 이미 GitHub에서 소스 코드를 관리하고 GitHub Actions로 CI를 돌린다면, 패키지 레지스트리를 GitHub Packages로 통일하면 별도 인프라 없이 private 패키지를 배포할 수 있다.

---

---

# [UNVERIFIED] GitHub Packages는 어떤 패키지 종류를 지원하는가?

## 도입

GitHub Packages는 npm 패키지만 지원하는 것이 아니다. 다양한 언어와 플랫폼의 패키지 형식을 지원한다.

---

## 본문

User Answer 기반(GitHub 공식문서 참조)이므로 인용 없이 해설한다.

**지원 레지스트리.**
- **npm**: JavaScript/Node.js 패키지. `@scope/package-name` 형태로 publish한다.
- **RubyGems**: Ruby 패키지.
- **Apache Maven / Gradle**: Java 패키지.
- **Docker / OCI**: 컨테이너 이미지. Container registry가 별도로 최적화되어 있다.
- **NuGet**: .NET 패키지.

**프론트엔드 개발자 관점.** 실제로 많이 쓰는 것은 npm 레지스트리다. `@myorg/design-system` 같은 내부 npm 패키지를 GitHub Packages에 publish하고 팀 내에서 설치한다.

```json
// .npmrc (프로젝트 또는 사용자 홈)
@myorg:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

// package.json
{
  "dependencies": {
    "@myorg/ui": "^1.0.0"
  }
}
```

---

## 종합

npm 패키지 외에도 Docker 이미지를 Container registry로 관리하는 팀이라면 GitHub Packages가 더 큰 가치를 발휘한다. 소스 코드·npm 패키지·Docker 이미지를 모두 GitHub 한 곳에서 관리하고 같은 권한 모델을 적용할 수 있다.
