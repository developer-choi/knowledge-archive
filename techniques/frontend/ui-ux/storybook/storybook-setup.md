---
tags: [storybook, setup, global-css, addon]
source: official
publishable: false
---
# Questions

- Storybook 전역 설정은 어디서 하는가?
- Storybook에서 모든 스토리 파일마다 전역 CSS를 적용하려면 어떻게 해야 하는가?
- Storybook 공식 UI에서 쿼리스트링으로 접근할 수 있는 특수 페이지는?

---

# Answers

## Storybook 전역 설정은 어디서 하는가?

### User Answer

전역 설정은 `.storybook/preview.ts`에서 함.

### Reference

- https://storybook.js.org/docs/configure

---

## Storybook에서 모든 스토리 파일마다 전역 CSS를 적용하려면 어떻게 해야 하는가?

### Official Answer

To add global CSS for all your stories, import it in `.storybook/preview.ts`.

### Reference

- https://storybook.js.org/docs/configure/styling-and-css#import-bundled-css-recommended

---

## Storybook 공식 UI에서 쿼리스트링으로 접근할 수 있는 특수 페이지는?

### User Answer

- `?path=/onboarding` — setup wizard 설명 (onboarding addon)
- `?path=/docs/configure-your-project--docs` — 프로젝트 설정 문서 페이지

### Reference

- https://storybook.js.org/docs/get-started/install#run-the-setup-wizard
