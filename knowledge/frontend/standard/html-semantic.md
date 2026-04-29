---
tags: [a11y, seo, best-practice]
---

# Questions

## 시맨틱 마크업
- 시맨틱 마크업이 뭐고, 왜 중요한가요?
- 시맨틱 태그를 안 쓰면 어떤 문제가 생기나요?
- `<div>`와 `<span>`은 시맨틱하지 않은가요?

## 태그 선택
- `<section>`이랑 `<article>`이랑 `<div>`는 어떻게 구분해서 쓰세요?
- `<button>`이랑 `<a>`, 그리고 `<div onClick>`은 언제 뭘 쓰나요?
- `<section>`과 `<article>`을 정말 정확히 구분하기 어렵지 않나요?
- `<h1>`을 한 페이지에 여러 개 써도 되나요?

---

# Answers

## 시맨틱 마크업이 뭐고, 왜 중요한가요?

### AI Answer
시맨틱 마크업은 요소가 **어떻게 보이는가**가 아니라 **어떤 의미·역할을 하는가**로 태그를 고르는 겁니다. MDN에서도 *"What purpose or role does that HTML element have, rather than what does it look like?"* 라고 정의하고 있어요.

이걸 챙기는 이유는 세 가지입니다.

첫째, **접근성**입니다. 스크린 리더는 시맨틱 태그를 통해 페이지 구조를 파악합니다. 예를 들어 `<nav>`, `<main>`, `<header>`, `<footer>` 같은 랜드마크 태그가 있으면 시각장애 사용자가 "본문으로 바로 이동" 같은 단축키로 점프할 수 있어요. 전부 `<div>`로 짜면 이게 안 됩니다.

둘째, **SEO**입니다. 시맨틱 태그가 직접 랭킹 시그널이라고 구글이 공식 발표한 적은 없지만, 검색 엔진 크롤러가 페이지 구조를 이해하고 콘텐츠를 추출·요약하는 데 도움이 된다는 게 통설이에요.

셋째, **유지보수성**입니다. `<div class="header-wrapper-2">` 같은 div 더미보다 `<header>` 한 단어가 코드 리딩 속도를 훨씬 높입니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Glossary/Semantics

---

## 시맨틱 태그를 안 쓰면 어떤 문제가 생기나요?

### AI Answer
세 가지 문제가 동시에 터집니다.

첫째, **접근성이 깨집니다.** 스크린 리더가 페이지 구조를 못 읽어서 시각장애 사용자가 랜드마크 단축키로 본문에 바로 못 갑니다.

둘째, **SEO에 불리합니다.** 시맨틱 태그가 직접 랭킹 시그널은 아니지만, 검색 엔진이 페이지 구조를 추출·요약하는 데 시맨틱 정보를 활용한다는 게 통설이라, 모든 걸 `<div>`로 짜면 그 신호가 사라집니다.

셋째, **유지보수성이 떨어집니다.** `<div class="header-wrapper-2">` 같은 이름 짓기 지옥에 빠지고, 새로 합류한 개발자가 코드 구조 파악하는 시간이 길어집니다.

---

## `<div>`와 `<span>`은 시맨틱하지 않은가요?

### AI Answer
시맨틱 정보가 없는 게 그 둘의 역할입니다. 의미가 없는 곳에 의미 있는 태그를 억지로 쓰는 게 더 나쁩니다.

---

## `<section>`이랑 `<article>`이랑 `<div>`는 어떻게 구분해서 쓰세요?

### AI Answer
태그 선택 기준을 정리하면:

- `<article>`: 그 자체로 독립적으로 배포·재사용 가능한 콘텐츠 (블로그 글, 뉴스 기사, 댓글 하나, 제품 카드, 상호작용 위젯 등)
- `<section>`: 주제별로 묶인 영역, 보통 헤딩을 가짐
- `<aside>`: 본문과 간접 관련된 보조 콘텐츠 (사이드바, 광고)
- `<nav>`: 주요 네비게이션 링크 묶음
- `<div>`: 의미 없이 순전히 스타일링·레이아웃 목적일 때만

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section

---

## `<button>`이랑 `<a>`, 그리고 `<div onClick>`은 언제 뭘 쓰나요?

### AI Answer
원칙은:
- **페이지 이동**(URL이 있음)이면 `<a href>`
- **액션 트리거**(같은 페이지에서 뭔가 동작)면 `<button>`
- `<div onClick>`은 **금지**입니다. 이유는: 키보드 포커스가 안 잡히고, 엔터·스페이스로 활성화 안 되고, 스크린 리더가 "버튼"이라고 안 읽습니다. 굳이 div로 만들려면 `role="button"`, `tabindex="0"`, 키보드 이벤트 핸들러를 다 직접 붙여야 하는데, 그냥 `<button>` 쓰면 다 공짜로 옵니다.

---

## `<section>`과 `<article>`을 정말 정확히 구분하기 어렵지 않나요?

### AI Answer
솔직히 경계는 모호한데, MDN 정의대로 **독립적으로 배포·재사용 가능한 단위**(블로그 글, 댓글, 제품 카드, 상호작용 위젯 등)면 article, 페이지의 일부 주제 영역이지만 따로 떼면 의미 없으면 section으로 갑니다. 가벼운 멘탈 모델로는 "RSS 피드로 떼서 보낼 수 있나?"가 article 후보를 빠르게 떠올리기에 좋아요.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article

---

## `<h1>`을 한 페이지에 여러 개 써도 되나요?

### AI Answer
예전 HTML5 outline algorithm에서는 sectioning content (article, section) 안의 `<h1>` 중첩이 허용된다고 봤는데, 그 알고리즘은 어떤 브라우저·스크린 리더도 구현한 적이 없습니다. MDN도 현재 이 패턴을 **non-conforming**으로 명시하고 있어요(*"this was never considered a best practice and is now non-conforming"*). 그래서 페이지당 `<h1>` 하나, 그 아래 `<h2>`부터 시작하는 게 정답입니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements
