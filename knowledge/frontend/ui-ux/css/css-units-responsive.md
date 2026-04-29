---
tags: [styling, best-practice]
---

# Questions

## CSS 단위
- px, em, rem 차이가 뭔가요? 언제 뭘 쓰세요?
- 모바일에서 `100vh`가 이상하게 보였던 적 있나요?
- rem 쓰면 `<html>` font-size를 어떻게 정하세요?
- `clamp()`, `min()`, `max()`는 써보셨어요?

## 반응형 전략
- 반응형 웹을 어떻게 구현하시나요? mobile-first vs desktop-first 어느 쪽인가요?
- 미디어 쿼리 break point는 어떻게 정하나요?
- 컨테이너 쿼리는 써보셨어요?

---

# Answers

## px, em, rem 차이가 뭔가요? 언제 뭘 쓰세요?

### AI Answer
CSS 단위는 크게 **절대 단위**와 **상대 단위**로 나뉘는데, 저는 거의 다 상대 단위로 갑니다.

**px**는 절대 단위처럼 쓰지만 사실 CSS pixel이라 디바이스 픽셀과 1:1이 아닙니다. 고해상도 디스플레이에서는 1 CSS px이 여러 device pixel로 그려져요. 저는 px은 1px 보더처럼 정말 정밀한 값이 필요할 때만 씁니다.

**em**은 현재 요소의 `font-size`가 기준입니다. 만약 `font-size`에 em을 쓰면 부모로부터 상속받은 값이 기준이 돼요. 컴포넌트 내부에서 폰트 크기 비례로 패딩·마진을 줄 때 유용합니다. 단점은 중첩되면 계산이 헷갈려진다는 거예요.

**rem**은 root element(`<html>`) `font-size`가 기준입니다. 항상 한 곳을 기준으로 잡기 때문에 일관된 스케일을 만들 때 좋아요. 저는 컴포넌트 외부의 spacing, font-size는 거의 rem으로 통일합니다. 사용자가 브라우저 폰트 크기를 키우면 전체 레이아웃이 비례해서 커지는 접근성 이점도 있고요.

**%**는 부모 요소의 해당 속성 기준입니다. width나 padding처럼 부모 컨텍스트가 의미 있을 때 사용해요.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/length

---

## 모바일에서 `100vh`가 이상하게 보였던 적 있나요?

### AI Answer
**vw, vh**는 viewport 기준 단위인데, **모바일에서 함정**이 있어요. 모바일 사파리·크롬은 스크롤하면 주소창이 사라지는데, 이때 viewport 높이가 변합니다. 사파리가 옛날부터 `100vh`를 "주소창이 숨겨진 상태(large viewport)" 기준으로 잡아왔고, CSS Values L4 스펙도 이 동작을 web compat을 위해 표준으로 인정했어요. 그래서 페이지 처음 로드됐을 때(주소창이 보이는 상태) `100vh`가 화면 밖으로 삐져나가는 현상이 생깁니다.

이걸 해결하려고 CSS Values and Units Module Level 4에 **dvh, svh, lvh**가 추가됐습니다.
- **lvh** (Large): 브라우저 UI가 숨겨졌을 때 기준. 가장 큼. (현재 `vh`와 동일)
- **svh** (Small): 브라우저 UI가 다 보일 때 기준. 가장 작음. **항상 안전**.
- **dvh** (Dynamic): 실시간으로 변함. 정확하지만 스크롤 중에 레이아웃이 계속 변해서 UX가 어색해질 수 있어요.

저는 풀스크린 히어로 같은 데는 `100svh`를 기본으로 쓰고, 정말 dynamic이 필요한 경우만 `dvh`를 씁니다.

### Reference
- https://www.w3.org/TR/css-values-4/#viewport-relative-units

---

## rem 쓰면 `<html>` font-size를 어떻게 정하세요?

### AI Answer
기본값(16px)을 그대로 두는 편입니다. 일부 디자인 시스템은 `font-size: 62.5%`로 root를 10px로 줄여서 `1rem = 10px` 계산 편의를 챙기는데, 퍼센트 자체는 사용자 기본값에 비례하긴 합니다(20px로 설정했으면 root는 12.5px). 다만 그 위에서 `1.4rem = 14px`처럼 작은 px 단위로 디자인을 짜면 결국 본문 폰트가 작아져서 가독성과 접근성이 떨어집니다.

---

## `clamp()`, `min()`, `max()`는 써보셨어요?

### AI Answer
fluid typography 만들 때 `font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem)` 같은 식으로 씁니다. 미디어 쿼리 없이도 viewport에 따라 부드럽게 변해서 break point 분기가 줄어듭니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/clamp

---

## 반응형 웹을 어떻게 구현하시나요? mobile-first vs desktop-first 어느 쪽인가요?

### AI Answer
저는 **mobile-first**를 씁니다. 작은 화면 기본 스타일을 먼저 짜고, `min-width` 미디어 쿼리로 큰 화면 스타일을 누적하는 방식이에요.

이유는: 모바일이 트래픽 비중이 크고, 작은 화면이 제약이 많아서 그쪽부터 시작하는 게 더 단순한 CSS가 나옵니다. desktop-first로 시작하면 큰 화면 가정으로 잡힌 레이아웃을 모바일에서 다 깎아내야 해서 `max-width` 미디어 쿼리가 누더기처럼 쌓여요.

---

## 미디어 쿼리 break point는 어떻게 정하나요?

### AI Answer
디바이스 사이즈가 아니라 **콘텐츠가 깨지는 지점**으로 정합니다. "iPhone은 375px이니까 375px에서 break하자"가 아니라, 줄였을 때 글자가 비좁아지거나 카드가 어색해지는 width를 찾는 식이에요. 보통 600~768px(태블릿), 1024~1280px(데스크톱) 두 단계로 끝나는 경우가 많습니다.

---

## 컨테이너 쿼리는 써보셨어요?

### AI Answer
본격적으로 쓰진 않았지만, 같은 카드 컴포넌트가 페이지에 따라 사이드바에도 들어가고 본문에도 들어갈 때 유용하다고 알고 있습니다. 부모 컨테이너 크기 기준으로 분기할 수 있어서 미디어 쿼리보다 진짜 컴포넌트 단위 반응형이 됩니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
