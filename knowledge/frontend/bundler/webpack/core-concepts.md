---
tags: [bundler, webpack, concept]
source: unverified
---

# Questions
- [UNVERIFIED] Webpack은 무엇인가?
- [UNVERIFIED] Webpack의 핵심 개념은 무엇인가?
- [UNVERIFIED] webpack.config.js를 작성할 때 신경 써야 할 부분은?
- [UNVERIFIED] HMR(Hot Module Replacement)은 어떻게 동작하는가?
- [UNVERIFIED] Source map은 무엇이고, production에 올려야 하는가?

---

# Answers

## [UNVERIFIED] Webpack은 무엇인가?

### AI Answer
Webpack은 모듈 번들러다. 자바스크립트, CSS, 이미지, 폰트 같은 다양한 파일을 모듈로 보고, 의존성 그래프를 만들어 브라우저가 실행할 수 있는 정적 자산으로 합친다.

### Reference
- https://webpack.js.org/concepts/

---

## [UNVERIFIED] Webpack의 핵심 개념은 무엇인가?

### AI Answer
Webpack 핵심 개념은 네 가지다.

**Entry**는 번들링의 시작점이다. 공식 정의는 *"An entry point indicates which module webpack should use to begin building out its internal dependency graph"*. 기본값은 `./src/index.js`. 진입점에서부터 의존성을 추적해 나간다.

**Output**은 번들된 결과를 어디에 어떤 이름으로 저장할지를 정한다. 기본값은 `./dist/main.js`. 보통 `[name].[contenthash].js` 같은 패턴으로 캐시 무효화에 활용한다.

**Loader**는 자바스크립트와 JSON 외의 파일 타입을 모듈로 변환한다. 공식 *"Out of the box, webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files"*. `babel-loader`는 ES6+ JS를 변환하고, `css-loader`는 CSS를 JS 모듈로 만들어준다.

**Plugin**은 Loader가 못 하는 더 광범위한 작업(번들 최적화, 자산 관리, 환경 변수 주입 등)을 한다. `HtmlWebpackPlugin`(HTML 자동 생성), `DefinePlugin`(전역 상수 주입), `MiniCssExtractPlugin`(CSS 추출) 등이 예시다.

### Reference
- https://webpack.js.org/concepts/

---

## [UNVERIFIED] webpack.config.js를 작성할 때 신경 써야 할 부분은?

### AI Answer
entry/output 다음으로 `module.rules` 순서를 챙긴다. Loader는 오른쪽에서 왼쪽으로 적용돼서 순서가 결과에 영향을 준다. 그리고 mode를 환경 변수로 분기해 dev/prod 설정을 쉽게 바꿀 수 있게 한다.

### Reference
- https://webpack.js.org/configuration/

---

## [UNVERIFIED] HMR(Hot Module Replacement)은 어떻게 동작하는가?

### AI Answer
공식 정의는 *"Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload"*. 풀리로드 없이 바뀐 모듈만 교체한다.

애플리케이션 단의 동작은 4단계다.
1. 앱이 HMR 런타임에 업데이트 확인을 요청.
2. 런타임이 비동기로 업데이트(매니페스트 JSON + 청크 JS)를 다운로드하고 앱에 알림.
3. 앱이 런타임에 적용을 요청.
4. 런타임이 동기로 업데이트를 적용.

핵심은 **모듈이 HMR 핸들러를 opt-in으로 구현**해야 한다는 점이다. 핸들러가 없으면 업데이트가 부모로 bubble up 된다. React 같은 프레임워크가 `react-refresh`로 컴포넌트 단위 핸들러를 자동으로 붙여주기 때문에 사용자가 직접 신경 쓰지 않아도 된다.

풀리로드와의 차이는 **앱 상태(폼 입력, 라우트, useState 값)가 유지된다**는 점. 개발 생산성 차이가 크다.

### Reference
- https://webpack.js.org/concepts/hot-module-replacement/

---

## [UNVERIFIED] Source map은 무엇이고, production에 올려야 하는가?

### AI Answer
Source map은 빌드된 코드와 원본 소스 파일을 매핑해주는 파일이다. 압축·트랜스파일된 코드에서 에러가 났을 때 원본 코드의 어느 줄인지 추적할 수 있게 해준다. dev 환경에서는 거의 필수다.

**production은 의견이 갈린다.**
- 올리는 경우: Sentry 같은 모니터링 도구가 정확한 stack trace를 보여주고, 사용자 디버깅이 가능하다.
- 단점: 원본 코드가 노출돼 비즈니스 로직이 보일 수 있고, 추가 다운로드 비용이 든다.

절충안으로 **`hidden-source-map`** 을 많이 쓴다. 공식 설명은 *"Same as `source-map`, but doesn't add a reference comment to the bundle"*. 즉, source map을 만들되 번들 끝에 `//# sourceMappingURL` 주석을 안 붙인다. 일반 사용자는 받지 못하지만 Sentry 같은 도구에 별도로 업로드해 stack trace 매핑에는 쓸 수 있다.

### Reference
- https://webpack.js.org/configuration/devtool/
