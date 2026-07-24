# E2E test란 무엇인가?

> End to End: A helper robot that behaves like a user to click around the app and verify that it functions correctly.

"End to End: 사용자처럼 앱을 클릭하며 올바르게 기능하는지 검증하는 도우미 로봇.

- **helper robot**: Cypress, Playwright 같은 브라우저 자동화 도구. 실제 마우스 클릭, 키보드 입력, 스크롤을 시뮬레이션한다.
- **behaves like a user**: QA가 체크리스트 들고 직접 클릭하던 것을 코드로 자동화한 것. 실제 브라우저에서 실행한다.

> Typically these will run the entire application (both frontend and backend) and your test will interact with the app just like a typical user would.

"일반적으로 전체 애플리케이션(프론트엔드와 백엔드 모두)을 실행하고 테스트는 일반 사용자가 하는 것처럼 앱과 상호작용한다."

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

# E2E 테스트는 왜 실패 원인을 추적하기 어려운가?

## 본문

> Finding the root cause for a failing end-to-end test is painful and can take a long time.

E2E는 앱 전체(프론트+백엔드)를 실제로 띄워 돌리므로, 실패가 날 수 있는 지점이 프론트엔드·네트워크(의존 서비스)·백엔드·DB·환경설정까지 여러 계층에 걸쳐 있다. 구글 블로그의 실제 사례가 이를 잘 보여준다:

- 저장 기능이 깨졌을 때, 개발자들은 하루를 통째로 써서 **"프론트엔드 버그인지 백엔드 버그인지"** 부터 가렸다.
- 다음 날엔 프론트엔드 버그라는 것까진 알아냈지만, 그 안에서 **"어디서" 났는지** 찾느라 또 반나절을 썼다.
- 의존하던 **파트너 팀**의 잘못된 배포, 테스트 환경의 **실험실 하드웨어 장애** 때문에도 테스트가 무더기로 실패했다.

이 계층들이 한 테스트 안에 다 얽혀 있어, 빨간불 하나가 어느 계층에서 비롯됐는지 좁히기 어렵다.

> And even if a test finds a bug, that bug could be anywhere in the product.

게다가 실패 결과 **자체는 원인의 위치를 알려주지 않는다.** 테스트가 실패하면 화면에는 `it()`(테스트를 정의할 때 넘긴 설명 문구) — 예: "로그인하면 대시보드로 넘어간다" — 만 빨간불로 뜬다. 그 넓은 시나리오(프론트→네트워크→백엔드→DB) 중 **어느 단계가 원인인지는 결과가 짚어주지 않으므로**, 개발자가 시나리오를 직접 뜯어가며 추적해야 한다. "실패 지점이 많다"는 것과 "그 지점을 결과가 안 알려준다"는 것이 겹쳐 추적 비용이 커진다.

```ts
test('로그인하면 대시보드로 넘어간다', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('이메일').fill('user@example.com');
  await page.getByLabel('비밀번호').fill('pw1234');
  await page.getByRole('button', { name: '로그인' }).click();

  await expect(page.getByText('환영합니다')).toBeVisible(); // ← 여기서 빨간불
});
```

위 네 줄은 로그인 페이지를 열고 이메일·비밀번호를 채워 버튼을 누르는, 전부 눈에 바로 읽히는 셋업이다. 터지는 건 마지막 한 줄(`환영합니다`가 안 뜸)뿐인데, 그 원인은 계층마다 흩어져 있다:

1. **프론트엔드** — 로그인 버튼이 인증 요청을 아예 안 보냄
2. **네트워크/의존 서비스** — 인증 API가 502
3. **백엔드** — 비밀번호 검증 로직 버그로 로그인을 통과시키지 못함
4. **DB** — 유저 테이블 조회 실패(커넥션 고갈 등)

`환영합니다` 안 뜬 것 하나로는 위 1~4 중 어디가 원인인지 결과가 짚어주지 않으니, 개발자가 시나리오를 직접 뜯어가며 좁혀야 한다.

---

## 종합

E2E의 원인 추적이 어려운 이유는 두 가지가 겹치기 때문이다: (1) 앱 전체를 돌리니 실패 지점이 프론트·네트워크·백엔드·DB·환경설정 어디든 될 수 있고, (2) 실패 결과는 `it()` 문구만 보여줄 뿐 그중 어디가 원인인지 짚어주지 않아 개발자가 직접 추적해야 한다. 이것이 E2E가 확신을 주는 대가로 치르는 비용이다.

---

# E2E 테스트를 잔뜩 짜놨는데, 툭하면 실패하고, 실패하면 원인이 어디인지 찾는 데만 한참 걸리고, 하나가 깨지면 뒤따라 여러 개가 같이 깨지고, 고치는 데도 시간이 오래 걸린다. 게다가 워낙 다양한 이유로 실패해서 결과를 신뢰하기도 어렵다. 이렇게 단점이 많은데도, 그럼에도 왜 E2E를 써야 하나?

## 도입

E2E는 느리고, 불안정하고, 실패 원인 추적도 어렵다. 그럼 단점이 이렇게 많은데 왜 그래도 쓰는가? 여기서 답을 "E2E도 이런 장점이 있다"로 방어하면 안 된다. 대신 질문을 "어떻게 하면 이 단점들이 애초에 줄어드는 방향으로 갈까"로 바꿔야 한다. 그 출발점은 테스트의 '진짜 가치'가 어디서 실현되는지 다시 보는 것이다.

---

## 본문

> A failing test does not directly benefit the user.

실패한 테스트 그 자체는 유저에게 직접 이득을 주지 않는다. 제품이 잘 돌아가면 테스트가 뭐라 하든 잘 돌아가는 거고, 깨졌으면 테스트가 뭐라 하든 깨진 거다.

> A bug fix directly benefits the user.

유저가 실제로 좋아지는 건 그 버그(의도치 않은 동작)가 사라질 때다.

> But in that entire process, from failing test to bug fix, value is only added at the very last step.

실패 테스트 → 버그 등록 → 버그 수정, 이 전 과정에서 가치는 **오직 마지막 단계(수정)** 에서만 더해진다. 실패하는 테스트가 100만 개여도 그 자체론 유저 이득 0이고, 고쳐야 비로소 가치가 실현된다. ("배포 전에 미리 알게 됐다"는 회사 입장의 이점도 결국 고쳐야 실현되고, E2E만의 배타적 이점도 아니다.)

여기서 세 가지 축을 구분하면 헷갈리지 않는다 (이 3축 구분은 원문에 그대로 있는 건 아니고, 원문의 '찾기 vs 고침'에 '확신'을 얹어 정리한 것):

- **확신**: 초록불(통과)을 믿는 정도 — "잘 돌아간다"는 신뢰. 실패를 드러내는 '발견'과는 다르다.
- **발견**: 빨간불(실패)로 버그를 드러내는 가치.
- **고침-뒷받침**: 빨간불 이후 그 버그를 실제로 고치도록 받쳐주는 가치.

> Thus, to evaluate any testing strategy, you cannot just evaluate how it finds bugs. You also must evaluate how it enables developers to fix (and even prevent) bugs.

그래서 테스트 전략을 평가할 때 '버그를 얼마나 잘 **찾나**'만 봐선 안 된다. '고치거나 예방하도록 얼마나 잘 **뒷받침하나**'까지 봐야 한다. 기존 E2E들은 대체로 '찾기' 관점으로만 짜여 있어, 이 두 번째 기준에서 약하다.

---

## 종합

"왜 그래도 E2E?"의 답은 장점 나열이 아니다. 실패 테스트 자체는 이득이 없고 고쳐야 이득이니, 좋은 전략은 '잘 찾는' 테스트가 아니라 '고치기 쉽게 돕는' 테스트다. E2E는 바로 이 '고치기 쉬움'에서 약하다(원인 추적이 어려우니까). 그러니 방향은 E2E를 정당화하는 게 아니라, 고치기 쉬운 테스트로 무게중심을 옮기는 것이다 — 그렇다면 E2E는 정작 어떤 경우에만 남겨야 하는가, 그게 다음 질문이다.

---

# 그럼 버그를 빠르게 고치게 해 주는 테스트란 어떤 것인가?

## 도입

앞 질문에서 "좋은 전략 = 고치기 쉽게 돕는 테스트"라는 기준까지 왔다. 그럼 '고치기 쉽게 돕는다'가 구체적으로 뭔가? 구글 블로그는 이를 **피드백 루프**(테스트가 개발자에게 "지금 제품이 되나 안 되나"를 알려주는 되먹임 고리)의 품질로 푼다. 이상적인 루프는 세 가지를 갖춘다.

---

## 본문

> Tests create a feedback loop that informs the developer whether the product is working or not.

테스트는 곧 피드백 루프다. 코드를 고치고 → 테스트를 돌리고 → "됐다/안 됐다"를 돌려받는 이 순환이 개발자가 기대는 신호다. 그래서 "좋은 테스트냐"는 곧 "이 순환이 얼마나 좋으냐"와 같은 질문이 된다.

> It's fast.

빠르다. 자기 변경이 되는지 알려고 몇 시간~며칠씩 기다리고 싶은 개발자는 없다. 한 번에 안 되는 게 정상이라 루프는 여러 번 돌아야 하는데, 루프가 빠를수록 고치는 것도 빨라진다. 충분히 빠르면 커밋(체크인) 전에 미리 돌려보기까지 한다.

> It's reliable.

신뢰할 수 있다. 몇 시간 디버깅했더니 알고 보니 flaky(그때그때 결과가 달라지는) 테스트였다 — 이런 걸 겪고 싶은 개발자는 없다. flaky 테스트는 신뢰를 갉아먹어 결국 무시당하고, 그러면 **진짜** 버그를 잡아냈을 때도 함께 무시된다.

> It isolates failures.

실패를 좁혀준다. 버그를 고치려면 원인이 되는 **바로 그 코드 줄**을 찾아야 하는데, 제품이 수백만 줄이고 버그가 어디든 있을 수 있으면 건초더미에서 바늘 찾기다. 좋은 루프는 실패가 어느 범위에서 났는지 좁혀줘 이 탐색을 대신 줄여준다. (이 지점은 앞의 「E2E는 왜 실패 원인을 추적하기 어려운가」와 정확히 반대편이다 — E2E는 실패를 못 좁혀주고, 좋은 루프는 좁혀준다.)

---

## 종합

'고치기 쉽게 돕는 테스트' = 빠르고·신뢰할 수 있고·실패를 좁혀주는 피드백 루프. 그리고 E2E는 이 셋 다 약하다(느리고, flaky하고, 원인이 앱 어디든 될 수 있어 안 좁혀진다). 그래서 다음 질문은 자연히 "그럼 이 세 조건을 잘 갖춘 테스트는 어떻게 얻나"로 이어지고, 답은 '더 작게 가라'다 — 그게 다음 질문(E2E는 어떤 경우에)이다.

---

# E2E 테스트는 어떤 경우에 작성해야 하는가?

## 도입

앞 질문에서 "좋은 테스트 = 고치기 쉽게 돕는 테스트"라는 기준을 세웠다. 고치기 쉬우려면 되도록 작은 테스트로 가야 하는데(작을수록 실패 범위가 좁아 고치기 빠르다), 그렇다면 E2E는 정작 어떤 경우에만 남겨야 하나?

---

## 본문

> If two units do not integrate properly, why write an end-to-end test when you can write a much smaller, more focused integration test that will detect the same bug?

두 단위가 제대로 안 맞물리는 문제라면, 같은 버그를 더 작고 집중된 integration test로 잡을 수 있는데 굳이 E2E를 쓸 이유가 없다. 즉 **작은 테스트로 잡히는 건 E2E로 올리지 않는다.**

에스컬레이션(단계적 선택) 순서로 정리하면:

- 단위(unit)로 잡히는 건 unit으로.
- unit으로 안 되는 것(단위끼리 잘 맞물리나)은 integration으로.
- integration으로도 안 되는, 시스템 전체가 맞물려야만 드러나는 것만 E2E로.

같은 버그를 예로 들면 — 쿠폰 할인 계산의 '100% 할인은 0원' 경계. 이 하나를 어느 레벨에서 잡느냐로 셋업 비용이 갈린다.

E2E로 잡으면 앱 전체를 거쳐야 한다:

```ts
test('100% 쿠폰이면 결제 금액이 0원이 된다', async ({ page }) => {
  // 로그인 + 장바구니에 상품이 담긴 상태로 시작
  
  await page.goto('/cart');
  await page.getByLabel('쿠폰 코드').fill('FREE100');
  await page.getByRole('button', { name: '결제' }).click();

  await expect(page.getByTestId('final-price')).toHaveText('₩0');
});
```

같은 경계를 통합 테스트로 내리면 서버·결제 없이 컴포넌트만 띄우면 된다:

```tsx
test('쿠폰 입력 시 표시 금액이 갱신된다', () => {
  render(<Checkout initialTotal={10000} />);
  fireEvent.change(screen.getByLabelText('쿠폰 코드'), { target: { value: 'FREE100' } });

  expect(screen.getByTestId('final-price')).toHaveTextContent('₩0');
});
```

경계값 계산 로직 자체는 순수 함수 유닛 테스트가 가장 싸다 — 렌더링도 없다:

```ts
test.each([
  ['10% 할인',        10000, 0.1, 9000],
  ['100% 할인은 0원',  10000, 1,   0],    // ← 잡고 싶던 경계
  ['할인율 0은 원가',   10000, 0,   10000],
])('%s', (_, price, rate, expected) => {
  expect(applyDiscount(price, rate)).toBe(expected);
});
```

'100% 할인은 0원' 하나를 확인하는 데 E2E는 로그인·장바구니·결제까지 다 띄우지만, 유닛은 함수 한 번 호출로 끝난다. 같은 버그면 가장 싼 레벨에서 잡는다는 게 이 뜻이다.

> Even with both unit tests and integration tests, you probably still will want a small number of end-to-end tests to verify the system as a whole.

그래서 E2E를 완전히 버리는 건 아니다. unit·integration을 갖춘 뒤에도, 시스템 **전체**를 하나로 확인해야 하는 경우를 위해 E2E는 **소수** 남긴다. 그게 E2E가 제 몫을 하는 자리다.

'시스템 전체'가 구체적으로 뭔가 하면 — 로그인부터 결제까지 **처음~끝 전체 흐름**이 이어지는지, 프론트·백엔드·결제사·알림처럼 **여러 서비스가 실제로 맞물려** 도는지, **배포된 환경·환경설정**이 실제로 맞는지 — 더 작은 테스트로는 조립할 수 없고 전체가 실제로 붙어야만 드러나는 것들이다. 이게 E2E의 '전용 범위'다.

한 가지 흔한 오해를 짚어두면(이 정리는 원문에 있는 게 아니라 세션에서 세운 것이다): 레벨을 고르는 기준을 **'이 기능이 (비즈니스적으로) 중요한가'로 잡으면 안 된다.** 실서버엔 버그나도 되는 기능이 없어 '안 중요한 기능'이란 게 없고, '중요하다'는 추상적이라 선을 그을 수 없다. 기준은 중요도가 아니라 **'이 버그를 가장 싼 레벨에서 잡을 수 있느냐'(효율)**다 — 그래서 위 에스컬레이션(unit→integration→E2E)이 실제 잣대가 된다.

---

## 종합

"E2E는 어떤 경우에?"의 답은 "시스템 전체를 통째로 확인해야 하고(처음~끝 흐름·여러 서비스 통합·배포 환경설정처럼 전체가 붙어야만 드러나는 것), 더 작은 테스트로는 그 버그를 잡을 수 없을 때, 그것도 소수만"이다. 되도록 unit, 안 되면 integration, 그걸로도 안 되는 전체 검증만 E2E — 이 순서로 가면 E2E의 단점(느림·원인 추적 어려움)에 노출되는 테스트 수 자체가 줄어든다. 레벨을 고르는 잣대는 기능의 '중요도'가 아니라 '가장 싼 레벨에서 잡느냐'라는 점이 핵심이다.
