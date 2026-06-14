# [UNVERIFIED] 디자인 시스템 라이브러리들은 빌드 결과물을 어떻게 분할하는가?

## 도입

디자인 시스템을 npm 패키지로 배포할 때, 빌드 결과물을 하나로 묶을지 여러 파일로 나눌지가 사용자 측 tree shaking과 import 방식에 영향을 미친다. 대부분의 라이브러리는 컴포넌트당 1개 파일로 분할하는 방향을 택한다.

---

## 본문

이 질문의 내용은 검증되지 않은(User Answer) 관찰 기반 내용이다.

대표 패턴 두 가지:

**컴포넌트당 1개 파일 분리 (대다수 라이브러리)**

- 빌드 결과: `dist/Button.js`, `dist/Input.js`, `dist/Modal.js` 처럼 chunk 단위로 분리
- 장점: tree shaking이 파일 단위로 동작해 `import { Button }` 하면 Button 관련 코드만 번들에 포함
- 단점: 파일 수가 많아지고 빌드 설정이 복잡해질 수 있다

**단일 번들 (antd 계열)**

- 빌드 결과: 모든 컴포넌트가 하나의 큰 JS 파일로 합쳐짐
- 장점: 배포·설정이 단순하다
- 단점: tree shaking이 어려워 Button 하나만 써도 전체 라이브러리가 번들에 포함될 수 있다

```
분리 방식:
  패키지/
    dist/
      Button.js      ← Button만 포함
      Input.js       ← Input만 포함
      Modal.js       ← Modal만 포함

단일 번들 방식:
  패키지/
    dist/
      index.js       ← 모든 컴포넌트 포함
```

---

## 종합

빌드 결과물 분할 방식은 최종 사용자 앱의 번들 크기에 직접 영향을 미친다. 컴포넌트 10개 중 2개만 사용한다면, 분리 방식에서는 2개 분량의 JS만 번들에 들어가지만 단일 번들 방식에서는 10개 전체가 포함될 수 있다. 이 차이는 초기 로딩 속도와 직결되므로, 번들 크기에 민감한 프로젝트라면 라이브러리의 빌드 결과물 구조를 확인하고 선택하는 것이 좋다.

---

# [UNVERIFIED] 디자인 시스템 스타일링 방식의 두 갈래는?

## 도입

디자인 시스템이 스타일을 어떻게 제공하는가에 따라 사용자 측 설정이 달라진다. 스타일을 컴포넌트 안에 포함하는 방식과 별도 CSS 파일로 분리하는 방식이 대표적인 두 갈래다.

---

## 본문

이 질문의 내용은 검증되지 않은(User Answer) 관찰 기반 내용이다.

**방법 1: 컴포넌트 자체에 스타일 포함**

CSS-in-JS, CSS Modules, scoped styles 같은 방식으로 스타일이 컴포넌트 코드와 결합되어 있다.

- 사용법: 컴포넌트만 import하면 스타일도 자동 적용
- 장점: 별도 CSS import가 필요 없어 설정이 단순하다
- 단점: CSS-in-JS는 런타임 비용이 있고, SSR 환경에서 추가 설정이 필요할 수 있다

```ts
// 사용자 코드 (별도 CSS import 없이도 동작)
import { Button } from 'my-design-system'

function App() {
  return <Button variant="primary">클릭</Button>
}
```

**방법 2: 단일 CSS 번들을 별도 export**

디자인 시스템이 `styles.css` 같은 단일 파일을 함께 배포한다.

- 사용법: 앱의 root layout에 CSS를 한 번 import해야 함
- 장점: CSS 런타임 비용이 없다
- 단점: 사용자가 CSS import를 잊으면 스타일이 전혀 적용되지 않는다

```ts
// 앱 진입점 (root layout 또는 _app.tsx)
import 'my-design-system/dist/styles.css'

// 이후 어디서든 컴포넌트 사용
import { Button } from 'my-design-system'
```

---

## 종합

두 방식은 "설정 간결함"과 "런타임 성능"의 트레이드오프다. CSS-in-JS 계열은 사용자 설정이 단순하지만 런타임에 스타일을 계산하는 비용이 있다. 별도 CSS 번들 방식은 성능이 예측 가능하지만 사용자가 CSS import를 직접 관리해야 한다. 어느 방식을 쓰는지는 라이브러리 문서의 "Getting Started" 섹션에서 확인할 수 있으며, 잘못 설정하면 스타일이 전혀 적용되지 않는 문제로 이어진다.
