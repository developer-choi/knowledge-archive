# E2E 테스트 작성 시 Third-party dependencies를 테스트하면 안되는 이유와 이를 격리(isolate)하기 위한 방법은 무엇인가?

## 도입

E2E 테스트는 애플리케이션을 처음부터 끝까지 실제 브라우저로 검증하지만, 우리가 소스코드를 수정하거나 제어할 수 없는 외부 영역(Third-party dependencies)까지 실제로 통과시키려 하면 테스트 안정성이 심각하게 훼손된다. Playwright는 이 외부 통신을 네트워크 레벨에서 가로채 격리하는 방법을 제공한다.

---

## 본문

> Avoid testing third-party dependencies. Only test what you control.

"서드파티 의존성은 테스트하지 말라. 오직 네가 제어할 수 있는 것만 테스트하라."

- **third-party dependencies**: 우리 소스코드 바깥의 외부 서비스 — 타사 SNS 로그인 화면, 외부 결제 게이트웨이, 외부 광고 스크립트 등. 우리가 코드를 고칠 수 없는 영역이다.
- **what you control**: 우리가 직접 작성·수정할 수 있는 소스코드 범위. 테스트 대상은 여기로 한정해야 한다.

> Don't try to test links to external sites or third party servers that you do not control.

"당신이 제어하지 못하는 외부 사이트나 서드파티 서버로 향하는 링크는 테스트하려 하지 말라."

- **that you do not control**: 제어권이 우리에게 없다는 것이 핵심 — 그 페이지가 언제 어떻게 바뀌는지 우리가 손쓸 수 없다.

> Not only is it time consuming and can slow down your tests but also you cannot control the content of the page you are linking to, or if there are cookie banners or overlay pages or anything else that might cause your test to fail.

"시간이 오래 걸려 테스트를 느리게 만들 뿐 아니라, 연결되는 페이지의 내용을 제어할 수 없고, 쿠키 배너나 오버레이 페이지 등 테스트를 실패시킬 수 있는 그 무엇도 통제할 수 없다."

- **time consuming / slow down**: 실제 외부망 통신으로 타사 서버 응답을 끝까지 기다리므로 테스트 속도가 크게 느려진다.
- **cannot control the content**: 외부 페이지가 예고 없이 바뀌어도 우리가 막을 수 없다.
- **cookie banners / overlay pages**: 외부 페이지에 갑자기 쿠키 수집 배너나 홍보 레이어가 떠 화면을 덮으면, 우리 로직이 멀쩡해도 요소를 못 찾아 테스트가 실패한다.

> Instead, use the Playwright Network API and guarantee the response needed.

"대신, Playwright Network API를 사용해 필요한 응답을 보장하라."

- **Network API**: 브라우저가 주고받는 네트워크 요청을 가로채고 조작할 수 있는 Playwright의 API.
- **guarantee the response needed**: 실제 외부 서버에 의존하지 않고, 테스트가 필요로 하는 응답을 우리가 직접 확정해 돌려준다.

```typescript
await page.route('**/api/fetch_data_third_party_dependency', route => route.fulfill({
  status: 200,
  body: testData,
}));
await page.goto('https://example.com');
```

- **page.route(url, handler)**: 지정한 URL 패턴(`**/api/...`)으로 나가는 요청을 가로챈다. 실제 서버로 나가기 전에 handler가 먼저 잡는다.
- **route.fulfill({ status, body })**: 가로챈 요청에 실제 통신 없이 우리가 정한 응답(상태코드 200, 본문 `testData`)을 즉시 돌려준다.
- **page.goto**: 이후 페이지를 열면 그 외부 API 호출은 진짜 서버가 아니라 위에서 약속한 Mock 응답을 받는다.

```
요청 처리 흐름

[제어 밖 third-party 직접 호출]        [page.route로 가로채기]
  page.goto                             page.goto
      │                                     │
      ▼                                     ▼
  외부 API 요청                         외부 API 요청
      │                                     │
      ▼                                     ▼ (page.route가 가로챔)
  실제 타사 서버                        route.fulfill(mock)
  (느림·쿠키배너·                           │
   예고없는 변경 → flaky)                   ▼
                                        약속된 응답 즉시 반환
                                        (빠름·안정적)
```

---

## 종합

E2E 테스트는 우리가 제어하는 소스코드 범위의 사용자 시나리오만 검증해야 한다. 제어권 바깥의 third-party는 실제로 호출하면 느리고, 쿠키 배너·오버레이·예고 없는 변경 때문에 우리 로직과 무관하게 테스트를 깨뜨린다(flaky). 그래서 `page.route`로 그 요청을 네트워크 레벨에서 가로채 `route.fulfill`로 약속된 Mock 응답을 돌려주어 외부 의존을 격리(isolate)한다. 이로써 외부 요인발 flaky와 속도 저하를 동시에 없앤다.
