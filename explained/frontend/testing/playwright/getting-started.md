# Playwright에서 Actions와 Assertions를 수행할 때 Flaky Test와 Race Condition을 방지할 수 있는 이유는 무엇인가?

## 도입

웹 애플리케이션의 비동기적 렌더링과 이벤트 처리 속도 차이로 인해, E2E 테스트 환경에서는 Flaky Test와 Race Condition이 빈번하게 발생한다. Playwright는 이를 수동 대기(manual waits)가 아닌 엔진 레벨의 자동화된 대기 메커니즘을 통해 근본적으로 방지한다.

---

## 본문

> Playwright automatically waits for actionability checks to pass before performing each action.

"Playwright는 각 Actions를 수행하기 전에 Actionability checks가 통과할 때까지 자동으로 대기한다."

- **automatically waits**: 개발자가 수동으로 타임아웃을 지정하는 코드를 추가하지 않아도, Playwright가 요소의 상태 변화를 내부적으로 스스로 기다린다.
- **actionability checks**: 요소가 화면에 보이고(visible), 움직이지 않고(stable), 활성화되어 있으며(enabled), 이벤트를 받을 수 있는 상태(receivable)인지 확인하는 일련의 상태 검사들이다.

> You don't need to add manual waits or deal with race conditions.

"수동으로 대기를 추가하거나 Race Condition을 직접 처리할 필요가 없다."

- **manual waits**: 테스트 신뢰성을 떨어뜨리고 불필요한 지연을 발생시키는 수동 대기(예: `page.waitForTimeout()`) 코드를 의미한다.
- **race conditions**: 비동기 동작으로 인해 원하는 요소가 아직 렌더링되거나 준비되지 않은 상태에서 Actions가 먼저 실행되어 발생하는 타이밍 불일치 문제다.

> Playwright assertions are designed to describe expectations that will eventually be met, eliminating flaky timeouts and racy checks.

"Playwright의 Assertions는 궁극적으로 충족될 기댓값을 묘사하도록 설계되었으며, 이를 통해 불안정한 타임아웃(flaky timeouts)과 타이밍 불일치로 인한 검사 실패(racy checks)를 배제한다."

- **eventually be met**: 요소가 기댓값에 도달할 때까지 특정 시간(기본 5초) 동안 반복적으로 상태를 평가하며 기다려주는 Auto-retrying 방식을 나타낸다.
- **flaky timeouts and racy checks**: 네트워크나 렌더링 속도에 따라 성공과 실패를 오가는 불안정한 테스트 실행 결과 및 미완성된 DOM 상태를 검사해서 발생하는 에러다.

```
Actions 실행 흐름

Actions 호출 (예: click)
  │
  ▼
[ Actionability checks ] ──────────────────┐
  │ (visible, stable, enabled 등 검사)    │ (검사 실패 / 타임아웃 초과)
  ▼ (모든 조건 통과)                        ▼
Actions 실행                             테스트 실패 (Timeout)
```

```
Assertions (Auto-retrying) 실행 흐름

Assertions 호출 (예: expect(locator).toBeVisible())
  │
  ▼
기댓값 검사
  │
  ├─► 충족됨 (Pass) ──► 테스트 통과
  │
  └─► 미충족 (Fail) ──► 타임아웃 초과?
                          │
                          ├─► No  ──► 대기 후 재시도 (Auto-retry)
                          │
                          └─► Yes ──► 테스트 실패 (Timeout)
```

---

## 종합

Playwright는 Actions를 실행하기 전 해당 요소가 상호작용 가능한 상태가 될 때까지 기다리는 Actionability checks를 자동으로 제공한다. 또한, Assertions 역시 조건이 결국 만족될 때까지(eventually met) 재시도하는 Auto-retrying 방식을 사용한다. 이 두 가지 메커니즘 덕분에 개발자가 수동으로 대기 시간을 지정할 필요가 없으며, 비동기 렌더링 상황에서 발생하는 Flaky Test와 Race Condition을 효과적으로 방지할 수 있다.

---

# Playwright는 테스트 간 오염을 방지하기 위한 Test Isolation을 어떻게 달성하나요?

## 도입

E2E 테스트의 신뢰성을 보장하기 위해서는 이전 테스트의 실행 결과(쿠키, 로컬 스토리지 등)가 다음 테스트에 영향을 주지 않는 **Test Isolation**이 필수적이다. Playwright는 무겁고 느린 실제 브라우저를 매번 껐다 켜는 대신, 가볍고 독립적인 가상 프로필인 **Browser Context**를 활용하여 고속으로 완벽한 **Test Isolation**을 달성한다.

---

## 본문

> Test Isolation is when each test is completely isolated from another test. Every test runs independently from any other test. This means that each test has its own local storage, session storage, cookies etc. Playwright achieves this using BrowserContexts which are equivalent to incognito-like profiles. They are fast and cheap to create and are completely isolated, even when running in a single browser. Playwright creates a context for each test, and provides a default Page in that context.

"Test Isolation은 각 테스트가 다른 테스트로부터 완전히 격리되는 것을 의미한다. 모든 테스트는 다른 테스트와 독립적으로 실행된다. 즉, 각 테스트는 자신만의 로컬 스토리지(local storage), 세션 스토리지(session storage), 쿠키(cookies) 등을 가진다. Playwright는 브라우저의 시크릿 모드 프로필(incognito-like profiles)과 유사한 Browser Context를 사용하여 이를 달성한다. Browser Context는 생성 속도가 빠르고 비용이 저렴하며, 단일 브라우저 내에서 실행되더라도 완전히 격리된다. Playwright는 각 테스트마다 새로운 Context를 생성하고, 해당 Context 내에 기본 Page(page fixture)를 제공한다."

- **Test Isolation**: 테스트들이 서로 독립된 실행 환경을 보장받아 한 테스트의 실패나 데이터 오염이 다른 테스트의 결과에 영향을 주지 않는 격리 상태를 의미한다.
- **Browser Context**: 단일 물리 브라우저 내에서 캐시, 쿠키, 스토리지를 논리적으로 완벽히 격리하여 동작하도록 설계된 초경량 가상 브라우저 세션이다.
- **incognito-like profiles**: 구글 크롬의 시크릿 창과 같이 이전 세션 정보나 데이터를 일절 공유하지 않는 독립적인 상태이다.
- **page fixture**: 각 Browser Context마다 기본으로 주입되는 탭 혹은 창 단위의 인스턴스로, 각 테스트 함수는 완전히 깨끗하게 비어 있는 독립적인 `page fixture`를 받아 실행된다.

> There are two different strategies when it comes to Test Isolation: start from scratch or cleanup in between. Starting from scratch means everything is new, so if the test fails you only have to look within that test to debug. Playwright uses browser contexts to achieve Test Isolation. Each test has its own Browser Context. Running the test creates a new browser context each time.

"Test Isolation을 구현하는 전략에는 크게 두 가지가 있다: 처음부터 새로 시작하기(start from scratch)와 테스트 간에 수동으로 정리하기(cleanup in between). Start from scratch 전략은 모든 것이 새롭게 생성되므로, 특정 테스트가 실패했을 때 오직 해당 테스트 내부만 파악하며 디버깅할 수 있게 해준다. Playwright는 Browser Context를 사용하여 이 전략을 달성한다. 각 테스트는 자신만의 Browser Context를 가지며, 테스트가 실행될 때마다 매번 새로운 Browser Context가 생성된다."

- **Start from scratch**: 매 테스트마다 이전 상태의 흔적조차 남기지 않고 완전히 새로운 브라우저 컨텍스트와 세션을 처음부터 새로 구성하는 방식이다.
- **Cleanup in between**: 하나의 연속된 환경에서 테스트를 순차적으로 실행하면서, 각 테스트가 끝날 때마다 사용했던 리소스나 데이터를 수동으로 지우거나 초기화하는 방식이다. Playwright는 이 방식 대신 매 테스트마다 새 Browser Context를 만드는 `start from scratch`를 택한다.

> Browser contexts can also be used to emulate multi-page scenarios involving mobile devices, permissions, locale and color scheme. Playwright can create multiple browser contexts within a single scenario. This is useful when you want to test for multi-user functionality, like a chat.

"Browser Context는 모바일 기기, 권한, 로케일, 다크 모드/라이트 모드 설정 등 다양한 브라우저 환경을 흉내 내는 설정(emulate multi-page scenarios involving mobile devices, permissions, locale and color scheme)에도 사용될 수 있다. Playwright는 하나의 테스트 시나리오 내에서 여러 개의 Browser Context를 독립적으로 생성할 수도 있다. 이는 채팅 프로그램 같이 다중 사용자 기능(multi-user functionality, like a chat)을 검증하고자 할 때 매우 유용하다."

- **emulate multi-page scenarios involving mobile devices, permissions, locale and color scheme**: 단일 PC 환경에서도 서로 다른 언어 설정, 권한(위치 정보 등), 테마(다크 모드 등), 모바일 기기 뷰포트 등을 모사하여 다채로운 환경에서의 동작을 독립된 탭/페이지로 검증할 수 있다.
- **multi-user functionality, like a chat**: 하나의 테스트 시나리오 내에서 송신자와 수신자를 각각 다른 Browser Context(예: User A와 User B)로 생성하여 실시간 메시지 전송과 같은 다자간 인터랙션을 격리된 세션 하에 원활히 테스트할 수 있다.

```
Test Isolation 구현 및 다중 컨텍스트 활용 예시

  [ 하나의 브라우저 인스턴스 (Browser Instance) ]
                     │
    ┌────────────────┴────────────────┐
    ▼                                 ▼
[ Test 1: 독립 실행 ]             [ Test 2: 다중 사용자 시나리오 ]
    │                                 │
    ▼                                 ▼
[ Browser Context A ]           ┌─────┴────────────────────────┐
 (incognito-like)               ▼                              ▼
    │                   [ Browser Context B ]          [ Browser Context C ]
    ▼                    (User 1: 송신자)               (User 2: 수신자)
[ page fixture A ]              │                              │
                                ▼                              ▼
                        [ page fixture B ]             [ page fixture C ]
                                └──────────────┬───────────────┘
                                               ▼
                                   (multi-user functionality,
                                         like a chat)
```

---

## 종합

Playwright는 각 테스트마다 크롬의 시크릿 창과 같이 가볍고 격리된 가상 프로필인 Browser Context를 개별 생성하여 완벽한 Test Isolation을 제공한다. 테스트 함수는 이 Context에서 파생된 page fixture 등을 주입받아 완벽히 독립적으로 수행되며, 이로써 이전 테스트의 실행 결과(쿠키, 스토리지 오염 등)가 전이되지 않는다.

이 방식은 수동으로 자원을 초기화해야 하는 `cleanup in between` 방식과 대비되며, 매번 완전히 새로운 환경에서 시작하는 `start from scratch`를 자동으로 실현하여 디버깅 편의성을 극대화한다. 또한 하나의 시나리오 안에서 여러 Browser Context를 선언할 수 있어, `emulate multi-page scenarios involving mobile devices, permissions, locale and color scheme`이나 `multi-user functionality, like a chat` 같은 고난도 시나리오 역시 병렬성 저하 없이 안전하게 수행할 수 있다.
