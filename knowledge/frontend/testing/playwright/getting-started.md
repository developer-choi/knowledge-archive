---
tags: [testing, concept]
source: official
publishable: true
---
# Questions
- Playwright에서 Actions와 Assertions를 수행할 때 Flaky Test와 Race Condition을 방지할 수 있는 이유는 무엇인가?
- Playwright는 테스트 간 오염을 방지하기 위한 Test Isolation을 어떻게 달성하나요?

---

# Answers

## Playwright에서 Actions와 Assertions를 수행할 때 Flaky Test와 Race Condition을 방지할 수 있는 이유는 무엇인가?

### Official Answer
Playwright automatically waits for actionability checks to pass before performing each action. You don't need to add manual waits or deal with race conditions. Playwright assertions are designed to describe expectations that will eventually be met, eliminating flaky timeouts and racy checks.

### Reference
- https://playwright.dev/docs/writing-tests

## Playwright는 테스트 간 오염을 방지하기 위한 Test Isolation을 어떻게 달성하나요?

### Official Answer
Test Isolation is when each test is completely isolated from another test. Every test runs independently from any other test. This means that each test has its own local storage, session storage, cookies etc. Playwright achieves this using BrowserContexts which are equivalent to incognito-like profiles. They are fast and cheap to create and are completely isolated, even when running in a single browser. Playwright creates a context for each test, and provides a default Page in that context.

There are two different strategies when it comes to Test Isolation: start from scratch or cleanup in between. Starting from scratch means everything is new, so if the test fails you only have to look within that test to debug. Playwright uses browser contexts to achieve Test Isolation. Each test has its own Browser Context. Running the test creates a new browser context each time.

Browser contexts can also be used to emulate multi-page scenarios involving mobile devices, permissions, locale and color scheme. Playwright can create multiple browser contexts within a single scenario. This is useful when you want to test for multi-user functionality, like a chat.

### Reference
- https://playwright.dev/docs/browser-contexts
