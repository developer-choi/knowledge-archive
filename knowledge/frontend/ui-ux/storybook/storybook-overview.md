---
tags: [storybook, design-system, frontend-workshop, ui-testing]
source: official
publishable: false
---
# Questions

- Storybook이란 무엇인가?
- Storybook의 5가지 Main concepts는 무엇인가?
  - Stories란?
  - Docs란?
  - Addon이란?
  - Sharing이란?
  - Testing이란?

---

# Answers

## Storybook이란 무엇인가?

### Official Answer

Storybook is a **frontend workshop** for building UI components and pages **in isolation**. It helps you develop and share hard-to-reach states and edge cases without needing to run your whole app.

### User Answer

살아있는 사용 설명서(Living Design System)로도 불림.

### Reference

- https://storybook.js.org/docs/get-started/why-storybook

---

## Storybook의 5가지 Main concepts는 무엇인가?

### User Answer

사이드바 분류와 일치하며 다섯 가지 개념이 있다: Stories / Docs / Addon / Sharing / Testing.

---

## Stories란?

### User Answer

컴포넌트의 특정 상태를 캡처한 것. 하위 문서에 별도 정리됨.

---

## Docs란?

### User Answer

컴포넌트 문서 자동화 기능. 하위 문서에 별도 정리됨.

---

## Addon이란?

### User Answer

`?path=/onboarding` 쿼리스트링도 onboarding addon의 기능임을 확인.
addon-designs 같은 외부 애드온도 설치해서 확장 가능.

### Reference

- https://storybook.js.org/addons/@storybook/addon-designs
- https://storybook.js.org/docs/addons

---

## Sharing이란?

### Official Answer

Publishing your Storybook allows you to share your work with others. You can also embed your stories in places like Notion or Figma.

---

## Testing이란?

### Official Answer

Stories are a pragmatic starting point for your UI testing strategy. You already write stories as a natural part of UI development, so testing those stories is a low-effort way to prevent UI bugs over time.
