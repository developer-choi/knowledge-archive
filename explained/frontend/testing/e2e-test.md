# E2E test란 무엇인가?

> End to End: A helper robot that behaves like a user to click around the app and verify that it functions correctly.

"End to End: 사용자처럼 앱을 클릭하며 올바르게 기능하는지 검증하는 도우미 로봇.

- **helper robot**: Cypress, Playwright 같은 브라우저 자동화 도구. 실제 마우스 클릭, 키보드 입력, 스크롤을 시뮬레이션한다.
- **behaves like a user**: QA가 체크리스트 들고 직접 클릭하던 것을 코드로 자동화한 것. 실제 브라우저에서 실행한다.

> Typically these will run the entire application (both frontend and backend) and your test will interact with the app just like a typical user would.

"일반적으로 전체 애플리케이션(프론트엔드와 백엔드 모두)을 실행하고 테스트는 일반 사용자가 하는 것처럼 앱과 상호작용한다."

---

## 종합

E2E는 실제 브라우저에서 프론트+백엔드를 모두 띄워 테스트하므로 가장 현실적이다. Cypress가 버튼을 클릭하면 실제 HTTP 요청이 실제 서버로 가고, DB에 실제 데이터가 저장된다. 이 현실성 덕분에 테스트 1개당 주는 확신이 최고지만, 실행 환경 구성(DB 초기화, 서버 시작)이 복잡하고 시간도 오래 걸린다.

---

---

# E2E test의 장점과 단점은?

> An E2E test has more points of failure making it often harder to track down what code caused the breakage, but it also means that your test is giving you more confidence.

"E2E 테스트는 실패 지점이 더 많아 어떤 코드가 문제를 일으켰는지 추적하기 더 어려운 경우가 많지만, 테스트가 더 많은 확신을 제공한다는 의미이기도 하다."

- **more points of failure**: 프론트엔드, 네트워크, 백엔드, DB, 환경 설정 등 어디서든 실패할 수 있다. 실패 시 "어디서 깨졌는가"를 찾는 데 시간이 걸린다.

> End to End tests are pretty darn capable, but typically you'll run these in a non-production environment (production-like, but not production) to trade-off that confidence for practicality.

"E2E 테스트는 꽤 강력하지만, 일반적으로 확신과 실용성을 트레이드오프하기 위해 비프로덕션 환경(프로덕션과 유사하지만 프로덕션은 아닌)에서 실행한다."

```
E2E 장단점

장점
  ✓ 테스트 1개당 확신 최고
  ✓ 프론트+백엔드 전체 흐름 검증
  ✓ 실제 브라우저 동작 (레이아웃, 실제 네트워크)

단점
  ✗ 가장 느리고 비쌈 (CI 비용)
  ✗ 실패 시 원인 추적 어려움
  ✗ 환경 구성 복잡 (DB 초기화, 서버 시작)
  ✗ 비프로덕션 환경 → 100% 보장 불가
```

---

---

# E2E로 모든 edge case를 잡으면 가장 확실한 거 아닌가?

## 도입

E2E가 테스트 1개당 주는 확신이 가장 높으니 모든 것을 E2E로 하면 될 것 같지만, 실제로는 각 edge case를 가장 효율적으로 잡는 레벨이 따로 있다. 레벨 선택은 효율성의 문제다.

---

## 본문

> At the top of the testing trophy, if you try to use an E2E test to check that typing in a certain field and clicking the submit button for an edge case in the integration between the form and the URL generator, you're doing a lot of setup work by running the entire application (backend included).

"Trophy 꼭대기에서 폼과 URL 생성기 사이의 통합에서 특정 edge case를 확인하기 위해 E2E 테스트를 사용하려 하면, 전체 애플리케이션(백엔드 포함)을 실행하는 많은 설정 작업을 하게 된다."

> That might be more suitable for an integration test. If you try to use an integration test to hit an edge case for the coupon code calculator, you're likely doing a fair amount of work ... you could cover that edge case better in a unit test.

"그것은 integration test에 더 적합할 수 있다. 쿠폰 코드 계산기의 edge case를 잡으려고 integration test를 사용하면 unit test로 더 잘 커버할 수 있다."

```
edge case 테스트 레벨 선택

쿠폰 계산 로직 경계값  → unit (순수 함수, 빠름, 설정 불필요)
폼-URL 생성기 연동     → integration (컴포넌트 조합, 중간 비용)
로그인→구매 전체 흐름  → E2E (전체 앱, 최고 비용, happy path용)
```

---

## 종합

아니다. 각 edge case를 가장 효율적으로 잡을 수 있는 레벨이 따로 있다. E2E로 모든 것을 잡으려 하면 셋업 비용이 과도하고, 테스트가 느려지고, 실패 원인 추적이 어려워진다. "이 edge case를 가장 낮은 비용으로 잡을 수 있는 레벨은 어디인가"를 질문하고 그 레벨에서 테스트하는 것이 Trophy의 핵심 전략이다.
