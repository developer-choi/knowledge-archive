---
tags: [testing, concept]
source: official
publishable: true
---
# Questions
- E2E 테스트 작성 시 Third-party dependencies를 테스트하면 안되는 이유와 이를 격리(isolate)하기 위한 방법은 무엇인가?

---

# Answers

## E2E 테스트 작성 시 Third-party dependencies를 테스트하면 안되는 이유와 이를 격리(isolate)하기 위한 방법은 무엇인가?

### Official Answer
Avoid testing third-party dependencies. Only test what you control. Don't try to test links to external sites or third party servers that you do not control. Not only is it time consuming and can slow down your tests but also you cannot control the content of the page you are linking to, or if there are cookie banners or overlay pages or anything else that might cause your test to fail.

Instead, use the Playwright Network API and guarantee the response needed.

```typescript
await page.route('**/api/fetch_data_third_party_dependency', route => route.fulfill({
  status: 200,
  body: testData,
}));
await page.goto('https://example.com');
```

### Reference
- https://playwright.dev/docs/best-practices
