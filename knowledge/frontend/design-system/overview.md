---
tags: [concept, best-practice, styling]
---

# Questions
- 디자인 시스템 라이브러리들은 빌드 결과물을 어떻게 분할하는가?
- 디자인 시스템 스타일링 방식의 두 갈래는?

---

# Answers

## 디자인 시스템 라이브러리들은 빌드 결과물을 어떻게 분할하는가?

### User Answer
대표 디자인 시스템 라이브러리들의 빌드 결과물 패턴.
- 대부분: 컴포넌트당 1개의 빌드 파일로 나눠서 출력 (chunk 단위 분리).
- antd: 단일 번들로 합쳐서 출력하는 편.

이 차이는 tree shaking 효율과 사용자 측 import 단위에 영향을 준다.

---

## 디자인 시스템 스타일링 방식의 두 갈래는?

### User Answer
크게 두 가지 접근이 있다.

**(1) 컴포넌트 자체에 스타일을 포함**
- CSS-in-JS, CSS Modules, scoped styles 등.
- 컴포넌트만 import 하면 스타일도 같이 적용됨.
- 사용처에서 별도 CSS import가 필요 없음.

**(2) 단일 CSS 번들을 별도로 export**
- 디자인 시스템이 `styles.css` 같은 단일 파일을 함께 배포.
- 사용처에서 root layout 등에 한 번 import 해야 함.

각 방식의 장단점은 카카오스타일 devblog, xionwcfm 블로그 등에서 비교 자료를 참고할 수 있다.

### Reference
- https://devblog.kakaostyle.com/
- https://xionwcfm.github.io/

### Review Note
- "디자인 시스템: 모노레포 vs 외부 publish 결정"은 inbox로 분리.
- "design-token CSS 중복 포함 검증", "CSS 코드 스플리팅 의미 검증"도 inbox.
