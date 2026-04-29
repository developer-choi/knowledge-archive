---
tags: [browser, performance, seo]
---

# Questions

## 개요
- Core Web Vitals가 뭔가요?
- Lighthouse 점수를 어떻게 올리나요?
- lab data와 field data 차이?

## LCP / CLS
- LCP를 개선해본 경험 있나요?
- CLS는 왜 발생하고 어떻게 막나요?
- CLS는 어떻게 누적되나요?

## INP
- INP가 FID를 대체한 이유는?

---

# Answers

## Core Web Vitals가 뭔가요?

### AI Answer
Core Web Vitals는 구글이 정의한 사용자 경험 핵심 지표 세 개입니다. 2024년 3월부터 INP가 FID를 정식 대체해서, 현재는 **LCP, INP, CLS** 입니다.

- **LCP (Largest Contentful Paint)** — 로딩 성능. 뷰포트 안에서 가장 큰 콘텐츠 요소가 그려지는 데 걸리는 시간. 2.5초 이내가 "Good".
- **INP (Interaction to Next Paint)** — 반응성. 사용자 인터랙션에 대한 응답 시간. 200ms 이내가 "Good".
- **CLS (Cumulative Layout Shift)** — 시각적 안정성. 페이지 로드 중 예상치 못한 레이아웃 이동의 누적 점수. 0.1 이하가 "Good".

이 세 개가 page experience 시그널의 일부로 검색 랭킹에 활용되기 때문에 SEO와도 관련이 있어요.

### Reference
- https://web.dev/articles/vitals
- https://web.dev/blog/inp-cwv-march-12

---

## Lighthouse 점수를 어떻게 올리나요?

### AI Answer
**Lighthouse**는 Core Web Vitals 같은 지표들을 측정해주는 자동화 도구입니다. Chrome DevTools에 내장돼 있고, CI에 lighthouse-ci로 붙여서 PR마다 점수 회귀를 막을 수도 있어요. 다만 Lighthouse는 lab data(가상 환경)고, 실제 사용자 환경에서 측정하는 field data(CrUX, Real User Monitoring)와는 다를 수 있어서 둘 다 봐야 정확합니다.

실무 프로세스로 정리하면:
- Lighthouse / PageSpeed Insights로 현재 점수 측정
- 가장 큰 문제 지표 하나에 집중 (보통 LCP나 CLS가 먼저 옴)
- Performance 탭에서 timeline 분석
- 개선 후 다시 측정, 회귀 안 났는지 체크

### Reference
- https://developer.chrome.com/docs/lighthouse/overview

---

## lab data와 field data 차이?

### AI Answer
lab은 lighthouse처럼 통제된 환경에서 시뮬레이션, field는 실제 사용자 디바이스·네트워크에서 수집한 데이터입니다. 구글이 page experience 시그널의 일부로 쓰는 건 field data(CrUX)예요. 강한 단일 페널티는 아니고 동등한 콘텐츠 사이의 tiebreaker 성격이지만, lighthouse 90점이라도 CrUX에서 LCP가 나쁘면 영향이 있을 수 있습니다.

### Reference
- https://developer.chrome.com/docs/crux

---

## LCP를 개선해본 경험 있나요?

### AI Answer
**LCP (Largest Contentful Paint)** 는 뷰포트 안에서 가장 큰 콘텐츠 요소가 그려지는 데 걸리는 시간이에요. 보통 히어로 이미지나 큰 텍스트 블록이 LCP 요소가 됩니다. 임계값은 2.5초 이내가 "Good".

개선 방법은:
- 이미지 사이즈 최적화·포맷 변경(WebP, AVIF)
- `<img loading="eager" fetchpriority="high">`로 LCP 후보 이미지 우선 로드
- `<link rel="preload">`로 LCP 리소스 미리 받기
- 서버 응답 시간(TTFB) 개선
- render-blocking 리소스 줄이기 (critical CSS 인라인, JS defer)

### Reference
- https://web.dev/articles/lcp

---

## CLS는 왜 발생하고 어떻게 막나요?

### AI Answer
**CLS (Cumulative Layout Shift)** 는 페이지 로드 중 예상치 못한 레이아웃 이동의 누적 점수입니다. 이미지가 늦게 로드되면서 글이 밀린다거나, 광고가 끼어들어 버튼 위치가 바뀌는 현상이에요. 임계값은 0.1 이하가 "Good".

개선 방법:
- `<img>`, `<video>`에 `width`/`height` 속성 명시 (또는 `aspect-ratio` CSS)
- 폰트는 `font-display: optional`이나 `swap` + 매칭 폴백 폰트
- 동적 콘텐츠는 미리 자리 확보 (skeleton, placeholder)
- 광고 슬롯도 고정 높이로

### Reference
- https://web.dev/articles/cls

---

## CLS는 어떻게 누적되나요?

### AI Answer
5초 윈도우 안에서 발생한 layout shift 점수를 합산하다가, 윈도우가 끝나면 새 윈도우. 페이지 수명 동안 가장 큰 윈도우 합계가 CLS 값이 됩니다. 예전엔 단순 누적이었는데 SPA에서 무한히 커지는 문제가 있어서 윈도우 방식으로 바뀌었어요.

### Reference
- https://web.dev/articles/cls

---

## INP가 FID를 대체한 이유는?

### AI Answer
FID는 첫 인터랙션의 *입력 지연*만 봤는데, 그건 "사용자가 클릭하고 처리 시작까지" 시간이라 현실 UX와 맞지 않았어요. 클릭하고 처리는 빨라도 결과 페인트가 느리면 사용자는 느리게 느낍니다.

INP는 "input → 처리 → next paint"까지 전체를 보고, 한 페이지에서 일어난 인터랙션 중 **가장 오래 걸린 것**(인터랙션 50개당 1개씩 outlier 제외)을 보여줘서 worst case에 가까운 정직한 지표예요. 그 값을 페이지뷰들 사이에서 75th percentile로 집계합니다.

### Reference
- https://web.dev/articles/inp
