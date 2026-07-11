---
tags: [testing, mocking, frontend, reference]
source: official
publishable: true
---

# 프론트엔드 mock 판단 케이스 카탈로그

> **작업 초안** — 서브에이전트 10팀(도메인 분담) 병렬 조사 결과를 통합한 것. 73케이스.
> 미확정: (1) 단일 파일 vs 도메인별 분리, (2) 지도팀 geolocation "jsdom 미구현" 근거를 1차 소스로 교체.
> 스택 전제: React + TypeScript, Vitest, React Testing Library(+ user-event), 네트워크는 MSW.

## 관통 프레임워크 — mock 한다 vs 안 한다

### mock 한다 (6패턴)

| 대상 | 도구 | 왜 | 등장 도메인 |
|------|------|-----|------------|
| **네트워크 요청** | MSW (fetch/axios 코드는 실제, 경계만 가로챔) | 실서버는 느리고 비결정적. 단 fetch 직접 stub은 요청조립을 우회시켜 신뢰↓ | 전 도메인 (로그인·상품목록·가용슬롯·구독상태·지오코딩…) |
| **시간·타이머** | `vi.useFakeTimers`/`vi.setSystemTime` | 벽시계 의존 = flaky. 시간은 통제 대상 | 디바운스·폴링·리마인더·상대시간·갱신일 D-day·DST의 now |
| **jsdom 미구현 브라우저 API** | 전역 stub | jsdom에 아예 없어 호출 시 터짐 | IntersectionObserver·matchMedia·geolocation·HTMLMediaElement(play/currentTime)·ResizeObserver·createObjectURL |
| **소유하지 않은 서드파티 SDK** | 모듈 mock | 실제 청구/외부 서비스 의존·WebGL 없음 | 결제 Stripe.js·지도 Mapbox/Google·OAuth 리다이렉트 |
| **검증 대상 아닌 순수 부작용** | spy(호출만 확인) | UI에 안 나타나는 부작용, 실제 전송 금지 | analytics track·beforeunload |
| **애니메이션 라이브러리** | 패스스루 mock | 완료까지 대기 = 느림 | framer-motion |

### mock 안 한다 (5패턴)

| 대상 | 왜 | 등장 도메인 |
|------|-----|------------|
| **순수 계산/로직** | 입력→출력 결정적. mock하면 검증 대상 자체가 사라짐 | 장바구니·할인·배송비·proration·통화포맷(Intl)·Haversine·파셋 술어·undo/redo·스텝 머신·타임존 변환·CSV 직렬화·집계/정렬/필터·running balance·이자 |
| **클라이언트 상태 전환** | 실제 상태가 리셋/롤백되는지가 핵심 | 로그아웃 리셋·낙관적 롤백·수량 증감·컬럼 토글·아코디언·자막 토글·폼 값 보존 |
| **라우팅** | MemoryRouter로 실제 매칭. mock하면 리다이렉트/동기화가 사라짐 | 보호라우트 가드·URL 쿼리 동기화 |
| **jsdom이 제대로 지원하는 것** | 실제 구현이 더 정확 (문자열 전용 등) | localStorage (clear로 격리만) |
| **폼 유효성** | 순수 검증 로직, mock할 협력자 없음 | 회원가입 비번확인·마법사 스텝 유효성 |

### 핵심

mock의 정당한 사유는 딱 3개 — ①비결정성 제거(시간·네트워크) ②환경 제약 보완(jsdom·서드파티) ③위험한 부작용 차단(청구·전송). 이 셋에 안 걸리면 실제 코드로 돌린다. "속도" "그냥 순수함수라"는 사유가 아니다.

## 출처 마스터 (73케이스에서 중복 제거)

- **MSW**: mswjs.io/docs/ · /http/intercepting-requests · /http/mocking-responses/ · /http/mocking-responses/network-errors/ · /best-practices/network-behavior-overrides/ · /best-practices/avoid-request-assertions/ · /api/ws
- **Kent C. Dodds**: the-merits-of-mocking · stop-mocking-fetch · testing-implementation-details · static-vs-unit-vs-integration-vs-e2e-tests · write-tests
- **Testing Library**: guiding-principles · user-event/intro · user-event/options
- **Vitest**: api/vi.html · guide/mocking.html · guide/learn/mock-functions.html
- **MDN**: Intl.DateTimeFormat · Intl.NumberFormat · IntersectionObserver · Window/matchMedia · HTMLMediaElement(play·currentTime·timeupdate_event) · ResizeObserver · URL/createObjectURL_static · Blob · Geolocation/getCurrentPosition · GeolocationCoordinates · URLSearchParams · Window/localStorage · Window/beforeunload_event · WebGL_API
- **jsdom**: github.com/jsdom/jsdom (README) · lib/jsdom/living/nodes/HTMLMediaElement-impl.js
- **Stripe**: docs.stripe.com/testing · /billing/subscriptions/prorations · /billing/subscriptions/overview
- **기타**: tc39.es/proposal-temporal/docs/zoneddatetime.html · reactrouter.com/6.28.0/router-components/memory-router
- ⚠️ **교체 필요**: 지도팀 geolocation "jsdom 미구현" 근거가 `tmobile/jest-jsdom-browser-compatibility` README + 커뮤니티 보고로 달림 → jsdom 공식 소스/MDN으로 교체 예정.

---

# 도메인 1 — 인증·회원 (6)

## 로그인 폼 제출 → 성공 시 대시보드 진입
- **상황**: 이메일·비밀번호 입력 후 로그인 버튼을 누르면 `POST /login`이 나가고, 응답으로 받은 유저 정보가 화면(대시보드 인사말)에 반영되는 전체 흐름을 검증한다.
- **mock 여부**: 한다 (네트워크만 — MSW)
- **이유**: 실제 서버를 치면 테스트가 느리고 불안정하며 계정 상태에 의존한다. 하지만 `fetch`/axios 자체를 mock하면 요청을 만드는 코드(URL·헤더·바디 직렬화)가 검증에서 빠진다. MSW는 네트워크 계층에서 가로채므로 앱 코드는 실제 요청을 그대로 보내고, 요청이 틀리면 핸들러가 안 불려 테스트가 실패한다 — 통합 신뢰가 유지된다.
```tsx
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginPage } from './LoginPage'

// mock 포인트: 네트워크 계층만 가로챈다. 앱의 fetch/axios 코드는 실제로 실행된다.
const server = setupServer(
  http.post('/api/login', async ({ request }) => {
    const { email } = await request.json() as { email: string }
    return HttpResponse.json({ user: { name: 'Choe', email } })
  }),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('logs in and shows dashboard greeting', async () => {
  const user = userEvent.setup()
  render(<LoginPage />)
  await user.type(screen.getByLabelText(/email/i), 'choe@ex.com')
  await user.type(screen.getByLabelText(/password/i), 'pw12345')
  await user.click(screen.getByRole('button', { name: /sign in/i }))
  expect(await screen.findByText(/welcome, choe/i)).toBeInTheDocument()
})
```
- **근거**: mswjs.io/docs/ — "MSW uses the Service Worker API to intercept actual production requests on the network level." / kentcdodds.com/blog/stop-mocking-fetch — "If I get something wrong with the way I call `fetch`, then my server handler won't be called and my test (correctly) fails, which would save me from shipping broken code."

## 액세스 토큰 만료 → 백그라운드 자동 갱신(refresh) 후 원요청 재개
- **상황**: 액세스 토큰 만료 시각이 지나면 API 클라이언트가 먼저 `POST /refresh`로 새 토큰을 받고, 그 토큰으로 원래 요청을 재시도해 데이터가 정상 표시되는지 검증한다.
- **mock 여부**: 부분적으로 (네트워크는 MSW, 시간 경과는 vitest 페이크 타이머)
- **이유**: "만료"를 실제로 기다리면 테스트가 몇 분씩 걸리거나 실제 시계에 의존한다. 시간은 통제 불가한 외부 요인이라 페이크 타이머로 결정론적으로 만든다. 다만 refresh/재시도 요청 흐름 자체는 MSW로 실제 요청을 검증한다 — 갱신 로직은 mock하지 않는다.
```tsx
let accessCalls = 0
server.use(
  http.post('/api/refresh', () => HttpResponse.json({ accessToken: 'fresh' })),
  http.get('/api/me', ({ request }) => {
    accessCalls++
    return request.headers.get('authorization') === 'Bearer fresh'
      ? HttpResponse.json({ name: 'Choe' })
      : new HttpResponse(null, { status: 401 })
  }),
)

test('auto-refreshes expired token then retries request', async () => {
  vi.useFakeTimers() // mock 포인트: setTimeout/Date를 가짜로 → 만료를 즉시 재현
  render(<Profile />)
  await vi.advanceTimersByTimeAsync(60 * 60 * 1000) // 1시간 경과 = 토큰 만료
  vi.useRealTimers()
  expect(await screen.findByText(/choe/i)).toBeInTheDocument()
  expect(accessCalls).toBe(2) // 최초 401 + refresh 후 재시도
})
```
- **근거**: vitest.dev/api/vi.html — "It will wrap all further calls to timers (such as `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `setImmediate`, `clearImmediate`, and `Date`) until `vi.useRealTimers()` is called." / advanceTimersByTime: "invoke every initiated timer until the specified number of milliseconds is passed or the queue is empty."

## 401 응답 인터셉터 → 세션 만료 시 로그인 페이지로 리다이렉트
- **상황**: 보호된 데이터 요청이 만료 세션으로 401을 받으면, 전역 응답 인터셉터가 인증 상태를 지우고 `/login`으로 라우팅하는지 검증한다.
- **mock 여부**: 한다 (특정 엔드포인트를 런타임에 401로 오버라이드 — MSW `server.use`)
- **이유**: 401 같은 에러 경로는 실제 서버에서 재현하기 까다롭다(만료 세션을 일부러 만들어야 함). MSW 런타임 핸들러로 그 요청만 401을 반환시키면, 인터셉터·라우터·상태 정리라는 실제 통합 경로 전체가 프로덕션 코드로 실행된다. 인터셉터를 직접 mock하지 않는 것이 핵심.
```tsx
import { http, HttpResponse } from 'msw'

test('redirects to login when a protected request returns 401', async () => {
  // mock 포인트: 이 테스트에서만 /me를 401로 오버라이드 (에러 경로 통제)
  server.use(
    http.get('/api/me', () => new HttpResponse(null, { status: 401 })),
  )
  render(
    <AuthProvider initialUser={{ name: 'Choe' }}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  )
  expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument()
})
```
- **근거**: mswjs.io/docs/best-practices/network-behavior-overrides/ — "With the `.use()`, you can _prepend_ any list of request handlers to the initial request handlers... making them take priority when handling requests." / resetHandlers: "This will remove any runtime request handlers after each test, ensuring isolated network behavior."

## 미인증 사용자가 보호된 라우트 접근 → 게이트 리다이렉트
- **상황**: 로그인하지 않은 상태에서 `/settings`에 직접 진입하면 `<ProtectedRoute>` 가드가 `/login`으로 돌려보내는지 검증한다.
- **mock 여부**: 안 한다 (라우터·가드·인증 컨텍스트 모두 실제)
- **이유**: 이 케이스는 네트워크가 아니라 클라이언트 라우팅 가드 로직이 대상이다. 라우터를 mock하면 정작 검증할 리다이렉트 결정이 사라진다. `MemoryRouter`로 실제 라우팅을 인메모리로 돌리고, 인증 컨텍스트도 실제 provider에 "비로그인"만 주입한다.
```tsx
import { MemoryRouter } from 'react-router-dom'

// mock 없음: 실제 라우터 + 실제 ProtectedRoute + 실제 AuthProvider
test('redirects unauthenticated user away from protected route', () => {
  render(
    <AuthProvider initialUser={null}>
      <MemoryRouter initialEntries={['/settings']}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  )
  expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
  expect(screen.queryByText(/account settings/i)).not.toBeInTheDocument()
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you." / kentcdodds.com/blog/the-merits-of-mocking — "For me, that something else is usually practicality — meaning I wouldn't be able to test this thing at all... without mocking." (여기선 그 practicality 사유가 없으므로 mock 안 함.)

## role(권한) 기반 조건부 렌더링 — admin 전용 메뉴 노출
- **상황**: 같은 화면이 `role: 'admin'`이면 "사용자 관리" 버튼을 보이고 `role: 'member'`면 감추는지, 즉 권한 분기 렌더링을 검증한다.
- **mock 여부**: 부분적으로 (유저/role은 MSW로 데이터만 제공, 분기 컴포넌트는 실제)
- **이유**: 검증 대상은 role→UI 매핑이라는 실제 렌더링 로직이다. 이 로직을 mock하면 안 된다. role 값은 서버가 주는 데이터이므로 MSW로 admin/member 두 시나리오를 주입해 각 분기를 실제 컴포넌트로 렌더링한다. 데이터만 통제, 결정 로직은 프로덕션 코드.
```tsx
function renderWithRole(role: 'admin' | 'member') {
  // mock 포인트: role 데이터만 MSW로 통제. 분기 렌더링 로직은 실제 실행.
  server.use(http.get('/api/me', () => HttpResponse.json({ name: 'Choe', role })))
  return render(<AdminToolbar />)
}

test('shows user-management action only for admin', async () => {
  renderWithRole('admin')
  expect(await screen.findByRole('button', { name: /manage users/i })).toBeInTheDocument()
})

test('hides user-management action for member', async () => {
  renderWithRole('member')
  await screen.findByText(/choe/i) // 로드 완료 대기
  expect(screen.queryByRole('button', { name: /manage users/i })).not.toBeInTheDocument()
})
```
- **근거**: kentcdodds.com/blog/stop-mocking-fetch — "I can reuse these exact same server handlers in my development!" / testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you."

## 소셜 로그인(OAuth) 버튼 → 서드파티 인가 URL로 리다이렉트
- **상황**: "Google로 계속하기"를 누르면 앱이 올바른 `client_id`·`redirect_uri`·`scope`가 담긴 인가 URL로 브라우저를 이동시키는지 검증한다.
- **mock 여부**: 한다 (`window.location.assign`을 스파이로 대체 — 서드파티는 침범 안 함)
- **이유**: 실제로 Google 도메인으로 페이지를 이동시키면 테스트 러너(jsdom)가 깨지고, 우리가 소유하지 않은 외부 서비스에 의존하게 된다. 리다이렉트 부수효과 지점만 스파이로 잡아 어떤 URL로 보내려 했는지를 검증하면, 우리 코드가 만든 URL은 그대로 실제 로직으로 확인된다.
```tsx
test('redirects to Google authorize URL with correct params', async () => {
  const user = userEvent.setup()
  // mock 포인트: 우리가 소유하지 않은 서드파티 이동만 스파이로 가로챈다
  const assign = vi.fn()
  vi.spyOn(window, 'location', 'get').mockReturnValue({ assign } as any)

  render(<SocialLoginButtons />)
  await user.click(screen.getByRole('button', { name: /continue with google/i }))

  expect(assign).toHaveBeenCalledOnce()
  const url = new URL(assign.mock.calls[0][0])
  expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth')
  expect(url.searchParams.get('client_id')).toBe('test-client-id')
  expect(url.searchParams.get('redirect_uri')).toContain('/auth/callback')
  expect(url.searchParams.get('scope')).toContain('email')
})
```
- **근거**: kentcdodds.com/blog/the-merits-of-mocking — "For me, that something else is usually practicality — meaning I wouldn't be able to test this thing at all, or it may be pretty difficult/messy, without mocking." / vitest.dev/api/vi.html — vi.spyOn: "Creates a spy on a method or getter/setter of an object similar to `vi.fn()`. It returns a mock function."

---

# 도메인 2 — 쇼핑·주문·결제 (7)

## 상품 목록 조회 — API 응답을 MSW로 mock
- **상황**: 상품 목록 페이지가 마운트되면 `GET /api/products`를 호출해 카드 그리드를 렌더한다. 로딩 스피너 → 목록 전환까지의 사용자 흐름을 검증하고 싶다.
- **mock 여부**: 한다 (네트워크 계층만 MSW로)
- **이유**: 실제 백엔드에 붙이면 테스트가 느리고 불안정하며 CI에서 재현 불가. 그러나 `fetch`/axios 호출 자체를 stub하면 요청 URL·쿼리·응답 파싱을 재구현하게 되어 신뢰가 깎인다. MSW는 네트워크 경계에서만 가로채므로 컴포넌트→요청→렌더 통합 경로는 실제 코드가 돈다.
```tsx
// mock 포인트: 오직 네트워크 응답만. 컴포넌트의 fetch 호출/파싱은 진짜 코드가 실행됨
const server = setupServer(
  http.get('/api/products', () =>
    HttpResponse.json([{ id: 'p1', name: '텀블러', price: 12000 }])
  )
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('상품 목록을 불러와 렌더한다', async () => {
  render(<ProductList />);
  expect(screen.getByRole('status')).toBeInTheDocument(); // 로딩 스피너
  expect(await screen.findByText('텀블러')).toBeInTheDocument();
  expect(screen.getByText('12,000원')).toBeInTheDocument();
});
```
- **근거**: mswjs.io/docs/ — "MSW uses the Service Worker API to intercept actual production requests on the network level." / kentcdodds.com/blog/stop-mocking-fetch — "If I get something wrong with the way I call `fetch`, then my server handler won't be called and my test (correctly) fails..."

## 재고 소진(품절) 주문 실패 — MSW로 409 에러 시뮬레이션
- **상황**: "주문하기"를 누르면 `POST /api/orders`가 재고를 확인한다. 마지막 재고가 방금 빠진 경우 서버가 `409 out_of_stock`을 반환하고, UI는 "품절되었습니다" 경고와 함께 버튼을 비활성화해야 한다.
- **mock 여부**: 한다 (에러 응답을 MSW로 강제)
- **이유**: 실제 재고 소진 상황은 테스트에서 결정적으로 만들 수 없다. MSW로 에러 응답을 고정하면 드물지만 치명적인 에러 분기를 재현 가능하게 검증한다. 에러 핸들링·상태 전이(버튼 disable)는 실제 컴포넌트 코드로 통합 검증된다.
```tsx
test('재고 소진 시 품절 안내를 노출한다', async () => {
  // mock 포인트: 서버가 품절을 반환하는 상황을 이 테스트에서만 오버라이드
  server.use(
    http.post('/api/orders', () =>
      HttpResponse.json({ code: 'out_of_stock' }, { status: 409 })
    )
  );
  render(<CheckoutButton productId="p1" />);
  await userEvent.click(screen.getByRole('button', { name: '주문하기' }));

  expect(await screen.findByText('품절되었습니다')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '주문하기' })).toBeDisabled();
});
```
- **근거**: mswjs.io/docs/ — "You can intercept outgoing requests, observe them, and respond to them using mocked responses." / mswjs.io/docs/http/mocking-responses/network-errors/ — "You can respond to the intercepted request with `Response.error()` that's designed to represent a network error."

## 결제 게이트웨이 SDK(Stripe.js) — SDK를 mock, 실제 청구 금지
- **상황**: 결제 폼에서 카드 정보를 입력하고 "결제"를 누르면 `stripe.confirmCardPayment(...)`가 호출된다. 성공 시 완료 화면으로 전환된다.
- **mock 여부**: 한다 (결제 SDK 모듈 자체를 mock)
- **이유**: 실제 SDK를 태우면 진짜 카드 청구·네트워크·서드파티 상태에 의존해 테스트가 위험하고 불안정하다. 우리 코드의 책임은 "SDK를 올바른 인자로 호출하고 성공/실패 결과에 따라 UI를 전환하는 것"이므로, SDK 경계에서 mock하고 그 위 통합 흐름을 검증한다.
```tsx
// mock 포인트: 실제 카드 청구가 일어나는 SDK만 대체. 폼→호출→화면전환 로직은 실제 코드
const confirmCardPayment = vi.fn().mockResolvedValue({
  paymentIntent: { status: 'succeeded' },
});
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: () => Promise.resolve({ confirmCardPayment }),
}));

test('결제 성공 시 완료 화면으로 전환한다', async () => {
  render(<PaymentForm amount={12000} />);
  await userEvent.click(screen.getByRole('button', { name: '결제' }));

  expect(confirmCardPayment).toHaveBeenCalledOnce();
  expect(await screen.findByText('결제가 완료되었습니다')).toBeInTheDocument();
});
```
- **근거**: docs.stripe.com/testing — "Don't use real card details. The Stripe Services Agreement prohibits testing in live mode using real payment method details." / "these transactions don't move funds."

## 카드 거절(결제 실패) — 거절 결과를 SDK mock으로 주입
- **상황**: 사용자가 잔액 부족 카드로 결제를 시도한다. `confirmCardPayment`가 `card_declined` 에러를 돌려주면 UI는 "카드가 거절되었습니다" 메시지를 보여주고 결제 버튼을 재활성화해야 한다.
- **mock 여부**: 한다 (거절 케이스를 SDK mock의 반환값으로 주입)
- **이유**: 실제 거절을 재현하려면 Stripe 테스트 카드(예: `4000000000000002`)를 라이브 위젯에 태워야 하는데, 단위/통합 테스트에서는 SDK를 mock해 거절 응답을 결정적으로 주입하는 편이 빠르고 안정적이다. 우리 코드의 에러 분기만 검증하면 된다.
```tsx
test('카드 거절 시 오류 안내 후 재시도 가능하게 한다', async () => {
  // mock 포인트: SDK가 거절을 반환하는 시나리오. Stripe 테스트 카드 4000...0002에 대응
  confirmCardPayment.mockResolvedValueOnce({
    error: { code: 'card_declined', message: 'Your card was declined.' },
  });
  render(<PaymentForm amount={12000} />);
  await userEvent.click(screen.getByRole('button', { name: '결제' }));

  expect(await screen.findByText('카드가 거절되었습니다')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '결제' })).toBeEnabled();
});
```
- **근거**: docs.stripe.com/testing — "To test your integration's error-handling logic by simulating payments that the issuer declines for various reasons, use test cards from this section." (Generic decline: `4000000000000002`, decline_code `generic_decline`)

## 배송비·무료배송 임계값 계산 — mock 없이 경계값 테스트
- **상황**: `calculateShipping(subtotal, region)`이 5만원 이상 무료배송, 도서산간 추가 3천원 규칙으로 배송비를 계산한다.
- **mock 여부**: 안 한다
- **이유**: 결정적 순수 함수라 외부 의존이 없다. 임계값(49,999 vs 50,000)과 지역 가산 같은 경계 조건을 실제 코드로 돌려야 규칙 회귀를 잡는다. mock은 오히려 규칙을 감춘다.
```ts
// mock 포인트: 없음 — 배송비 규칙 함수를 직접 호출
test.each([
  [49_900, 'seoul', 3_000],
  [50_000, 'seoul', 0],       // 무료배송 임계값 도달
  [50_000, 'jeju', 3_000],    // 무료배송이지만 도서산간 가산
])('subtotal=%i, region=%s → 배송비 %i', (subtotal, region, expected) => {
  expect(calculateShipping(subtotal, region)).toBe(expected);
});
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you."

## 쿠폰 만료 검증 — MSW로 만료 응답 시뮬레이션
- **상황**: 결제 직전 서버가 쿠폰 유효성을 재검증한다(`POST /api/coupons/validate`). 만료된 쿠폰이면 `422 coupon_expired`를 반환하고, UI는 쿠폰을 자동 해제하며 안내 메시지를 표시하고 할인 전 금액으로 되돌려야 한다.
- **mock 여부**: 한다 (만료 응답을 MSW로 시뮬레이션)
- **이유**: 쿠폰 만료는 시간 의존적이라 실서버로는 결정적 재현이 어렵다. MSW로 만료 에러를 고정하면 "쿠폰 해제 + 금액 롤백 + 안내" 통합 흐름을 안정적으로 검증한다. 요청 페이로드·응답 파싱은 실제 코드가 실행된다.
```tsx
test('만료 쿠폰은 자동 해제하고 원래 금액으로 되돌린다', async () => {
  // mock 포인트: 서버의 쿠폰 만료 판정만 강제. 롤백/안내 로직은 실제 코드
  server.use(
    http.post('/api/coupons/validate', () =>
      HttpResponse.json({ code: 'coupon_expired' }, { status: 422 })
    )
  );
  render(<Checkout initialTotal={29000} appliedCoupon="WELCOME10" />);
  await userEvent.click(screen.getByRole('button', { name: '결제' }));

  expect(await screen.findByText('쿠폰이 만료되었습니다')).toBeInTheDocument();
  expect(screen.getByTestId('order-total')).toHaveTextContent('29,000원'); // 할인 롤백
  expect(screen.queryByText('WELCOME10')).not.toBeInTheDocument();
});
```
- **근거**: mswjs.io/docs/ — "You can intercept outgoing requests, observe them, and respond to them using mocked responses."

## 주문 취소 성공 토스트 자동 사라짐(애니메이션/타이머) — fake timers로 mock
- **상황**: 주문 취소가 성공하면 "취소가 완료되었습니다" 토스트가 뜨고 3초 후 `setTimeout`으로 자동 사라진다(페이드 아웃 애니메이션 포함).
- **mock 여부**: 한다 (타이머/애니메이션을 fake timers로 mock)
- **이유**: 실제로 3초를 기다리면 테스트가 느리고 불안정하다. 타이머는 "언제 사라지는가"라는 시간 의존 부작용이라 mock 대상이다. 취소 API는 MSW로, 시간 경과는 fake timers로 통제해 결정적으로 검증한다.
```tsx
test('취소 성공 토스트는 3초 후 사라진다', async () => {
  vi.useFakeTimers(); // mock 포인트: setTimeout/애니메이션 지연을 가짜 시계로 통제
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  server.use(http.post('/api/orders/o1/cancel', () => HttpResponse.json({ ok: true })));

  render(<OrderRow orderId="o1" />);
  await user.click(screen.getByRole('button', { name: '주문 취소' }));
  expect(await screen.findByText('취소가 완료되었습니다')).toBeInTheDocument();

  vi.advanceTimersByTime(3000); // 실제 대기 없이 3초 경과 시뮬레이션
  await waitFor(() => expect(screen.queryByText('취소가 완료되었습니다')).not.toBeInTheDocument());
  vi.useRealTimers();
});
```
- **근거**: vitest.dev/api/vi.html — `vi.useFakeTimers`는 "wrap all further calls to timers (such as `setTimeout`, `setInterval`, ...)"; `vi.advanceTimersByTime`은 "invoke every initiated timer until the specified number of milliseconds is passed."

---

# 도메인 3 — 커뮤니티·배송·실시간 (7)

## 게시글 목록 무한스크롤 페이지네이션
- **상황**: 스크롤(또는 "더 보기") 시 `GET /posts?cursor=...&limit=20`을 반복 호출해 다음 페이지를 append하는 목록. 첫 페이지 렌더 → 다음 페이지 로드 → 두 페이지 항목이 이어붙는지 검증한다.
- **mock 여부**: 한다 (네트워크만)
- **이유**: 실제 서버는 데이터가 유동적이라 "다음 페이지가 이어붙는가"를 결정론적으로 검증할 수 없다. cursor/page 쿼리별 고정 응답을 MSW로 주면 컴포넌트의 fetch→상태병합→렌더 통합 경로는 실제 코드 그대로 돌면서 페이지 경계만 통제된다. 컴포넌트 내부 상태 병합 로직은 mock하지 않는다.
```tsx
// mock 포인트: 네트워크 레벨만 MSW로. cursor 쿼리로 페이지 분기.
const server = setupServer(
  http.get('/posts', ({ request }) => {
    const cursor = new URL(request.url).searchParams.get('cursor') // 쿼리는 predicate 밖에서 읽는다
    if (!cursor) return HttpResponse.json({ items: [{ id: 1, title: 'first' }], nextCursor: 'c2' })
    return HttpResponse.json({ items: [{ id: 2, title: 'second' }], nextCursor: null })
  }),
)
beforeAll(() => server.listen()); afterEach(() => server.resetHandlers()); afterAll(() => server.close())

test('다음 페이지가 기존 목록에 이어붙는다', async () => {
  render(<PostFeed />)
  expect(await screen.findByText('first')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /더 보기/ }))
  expect(await screen.findByText('second')).toBeInTheDocument()
  expect(screen.getByText('first')).toBeInTheDocument() // 첫 페이지가 사라지지 않고 누적됐는지
})
```
- **근거**: mswjs.io/docs/http/intercepting-requests — "Do not include query parameters in your request predicate." → 쿼리는 `new URL(request.url).searchParams.get(...)`로 리졸버 안에서 읽어 분기.

## 좋아요 낙관적 업데이트 후 서버 500 롤백
- **상황**: 좋아요 버튼 클릭 즉시 UI를 채우고(낙관적), 서버 요청이 실패하면 원래 상태로 롤백한다. "실패 시 카운트/아이콘이 원복되는가"를 검증한다.
- **mock 여부**: 한다 (네트워크 응답을 실패로만). 롤백 상태 전환 로직은 mock 안 함.
- **이유**: 실패 경로는 실제 서버로 재현 불가·불안정하다. MSW `server.use()`로 해당 테스트에서만 500을 반환시키면, 앱의 낙관적 갱신→요청→에러 감지→롤백이라는 실제 통합 흐름을 그대로 태우면서 실패 조건만 통제한다. 롤백 자체를 stub하면 검증 대상이 사라진다.
```tsx
test('좋아요 요청 실패 시 낙관적 UI가 롤백된다', async () => {
  // mock 포인트: 이 테스트에서만 런타임 핸들러로 500 강제. 롤백 로직은 실제 코드.
  server.use(http.post('/posts/1/like', () => new HttpResponse(null, { status: 500 })))
  render(<LikeButton postId="1" initialLiked={false} initialCount={10} />)

  await userEvent.click(screen.getByRole('button', { name: /좋아요/ }))
  expect(screen.getByText('11')).toBeInTheDocument() // 낙관적 즉시 반영

  expect(await screen.findByText('10')).toBeInTheDocument() // 실패 전파 시 원복
  expect(screen.getByRole('button', { name: /좋아요/ })).toHaveAttribute('aria-pressed', 'false')
})
```
- **근거**: mswjs.io/docs/best-practices/network-behavior-overrides/ — "Your application in this test will always receive a 500 error response when requesting 'GET /user'." 런타임 핸들러(`.use()`)로 특정 테스트만 에러를 주고 `afterEach`의 `resetHandlers()`로 격리.

## 낙관적 업데이트 상태 전환 reducer (순수 로직)
- **상황**: 북마크 토글의 상태 전이(`optimisticToggle` → `commit` / `rollback`)를 순수 reducer/유틸로 분리해 둔 경우. 여러 연속 토글, pending 중복 방지 등 상태 규칙을 검증한다.
- **mock 여부**: 안 한다
- **이유**: 순수 클라이언트 로직이라 네트워크·타이머·DOM이 개입하지 않는다. 입력→출력이 결정론적이므로 mock을 끼우면 오히려 신뢰도만 떨어뜨린다.
```ts
// mock 없음 — 순수 함수는 실제 코드로 직접 호출
test('rollback은 직전 커밋 값이 아니라 낙관적 적용 전 값으로 되돌린다', () => {
  let s = reducer(initial, { type: 'optimisticToggle', id: 'p1' }) // liked: true (pending)
  expect(s.byId.p1).toMatchObject({ liked: true, pending: true })

  s = reducer(s, { type: 'rollback', id: 'p1' })
  expect(s.byId.p1).toMatchObject({ liked: false, pending: false }) // 원복
})

test('pending 중 같은 id 재토글은 무시된다', () => {
  const pending = reducer(initial, { type: 'optimisticToggle', id: 'p1' })
  expect(reducer(pending, { type: 'optimisticToggle', id: 'p1' })).toBe(pending) // no-op
})
```
- **근거**: kentcdodds.com/blog/the-merits-of-mocking — "When you mock something, you're making a trade-off. You're trading confidence for something else."

## 검색 자동완성 debounce (타이머 mock)
- **상황**: 입력할 때마다 300ms debounce 후 `GET /search?q=`를 호출하는 자동완성. "타이핑 중엔 요청 안 하고, 멈춘 뒤 한 번만 호출"을 검증한다.
- **mock 여부**: 부분적으로 — 타이머는 mock(`vi.useFakeTimers`), 네트워크도 mock(MSW). 단, debounce 스케줄 로직 자체는 실제 코드.
- **이유**: 실시간 300ms 대기는 테스트를 느리고 불안정하게 만든다. fake timer로 시간을 직접 전진시키면 debounce의 "마지막 입력만 발화" 동작을 결정론적으로 통제한다. 네트워크는 MSW로 응답을 고정한다.
```tsx
test('타이핑을 멈춘 뒤에만 검색 요청이 나간다', async () => {
  vi.useFakeTimers() // mock 포인트 1: setTimeout 계열을 가짜 타이머로
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  render(<SearchBox />) // 내부 300ms debounce는 실제 구현

  await user.type(screen.getByRole('searchbox'), 'ne')
  vi.advanceTimersByTime(200)
  await user.type(screen.getByRole('searchbox'), 'ws') // 다시 리셋
  expect(screen.queryByRole('option')).not.toBeInTheDocument() // 아직 300ms 안 지남

  vi.advanceTimersByTime(300) // 이제 발화 (MSW가 'news' 결과 응답)
  expect(await screen.findByRole('option', { name: /news/ })).toBeInTheDocument()
  vi.useRealTimers()
})
```
- **근거**: vitest.dev/api/vi.html — `vi.useFakeTimers()`는 "wrap all further calls to timers", `vi.advanceTimersByTime`은 "invoke every initiated timer until the specified number of milliseconds is passed."

## debounce 유틸 함수 자체 (순수 시간 로직)
- **상황**: 재사용 `debounce(fn, wait)` 유틸의 계약(대기 중 재호출은 리셋, 마지막 인자로 1회 호출, `cancel()`)을 단위 테스트한다. 네트워크·DOM 없음.
- **mock 여부**: 부분적으로 — 타이머만 fake, 네트워크 mock 없음
- **이유**: 검증 대상이 "시간 경과에 따른 호출 횟수"라 fake timer는 필수(통제·속도)지만, 네트워크·컴포넌트가 없으니 MSW·RTL을 끌어올 이유가 없다. mock을 필요한 최소(타이머)로 한정한다.
```ts
test('debounce는 대기창 안의 마지막 호출만, 마지막 인자로 1회 실행한다', () => {
  vi.useFakeTimers() // mock 포인트: 타이머만. 네트워크/DOM mock 불필요
  const spy = vi.fn()
  const debounced = debounce(spy, 100)

  debounced('a'); debounced('b'); debounced('c')
  expect(spy).not.toHaveBeenCalled() // 대기 중엔 미실행

  vi.advanceTimersByTime(100)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('c') // 마지막 인자
  vi.useRealTimers()
})
```
- **근거**: vitest.dev/api/vi.html — "To enable mocking timers, you need to call this method."

## 실시간 알림·채팅 WebSocket 수신
- **상황**: `wss://chat.example.com`에 연결해 서버 push 메시지를 화면에 append하는 채팅/알림. "서버가 보낸 메시지가 목록에 뜨는가", "재연결 시 중복 안 되는가"를 검증한다.
- **mock 여부**: 한다 (WebSocket 링크를 MSW ws로)
- **이유**: 실제 WS 서버는 테스트에서 띄우기 무겁고 push 타이밍을 통제할 수 없다. MSW `ws.link`로 연결을 가로채 `client.send()`로 서버 push를 원하는 순간에 재현하면, 클라이언트의 onmessage→상태갱신→렌더 통합 경로는 실제 코드로 돌면서 서버 이벤트만 통제된다.
```tsx
// mock 포인트: WebSocket 연결을 ws.link로 가로채고 서버 push를 수동 트리거
const chat = ws.link('wss://chat.example.com')
const server = setupServer(
  chat.addEventListener('connection', ({ client }) => {
    client.send(JSON.stringify({ user: 'bot', text: '안녕하세요' })) // 서버→클라 push
  }),
)
beforeAll(() => server.listen()); afterAll(() => server.close())

test('서버가 push한 메시지가 렌더된다', async () => {
  render(<ChatRoom url="wss://chat.example.com" />) // 실제 WebSocket 클라 로직
  expect(await screen.findByText('안녕하세요')).toBeInTheDocument()
})
```
- **근거**: mswjs.io/docs/api/ws — `ws.link('wss://chat.example.com')`로 링크 생성, `client.send()`는 "Sends data to the WebSocket client. This is equivalent to the client receiving that data from the server."

## 이미지 업로드 진행률 표시
- **상황**: 파일 선택 후 업로드하며 진행률 바(0→100%)를 표시하고, 완료 시 썸네일을 렌더한다. "진행률이 올라가고 완료 UI로 전환되는가"를 검증한다.
- **mock 여부**: 부분적으로 — 업로드 요청(성공/실패 응답)은 MSW로 mock, 진행률 이벤트 소스(XHR `progress`)는 통제가 어려워 진행률 산출 로직을 분리해 별도 검증하거나 progress 콜백을 주입한다.
- **이유**: 완료/에러 전환은 MSW로 실제 요청 경로를 태우는 게 신뢰도가 높다. 그러나 MSW는 실제 업로드 스트림의 byte 단위 `progress` 이벤트까지 결정론적으로 흉내 내기 어렵다. 그래서 진행률 계산은 순수 함수로 떼어 mock 없이 테스트하고, 컴포넌트에는 진행 콜백을 주입해 임의 진행률을 밀어넣어 UI 전환만 검증한다.
```tsx
test('진행률이 오르고 완료 시 썸네일로 전환된다', async () => {
  // mock 포인트: 완료 응답만 MSW. progress는 주입 콜백으로 통제(실제 XHR progress 대체)
  server.use(http.post('/upload', () => HttpResponse.json({ url: '/img/1.png' })))
  let emitProgress: (pct: number) => void = () => {}
  render(<ImageUploader onProgressRef={(fn) => (emitProgress = fn)} />)

  await userEvent.upload(screen.getByLabelText(/파일/), new File(['x'], 'a.png', { type: 'image/png' }))
  act(() => emitProgress(40))
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')

  expect(await screen.findByRole('img')).toHaveAttribute('src', '/img/1.png') // 완료 전환
})

// 진행률 산출은 순수 함수로 분리 → mock 없이 직접 검증
test('progress 계산', () => expect(toPercent(50, 200)).toBe(25))
```
- **근거**: mswjs.io/docs/ — 요청/응답 경로를 통제하되 byte 단위 업로드 progress 스트림은 대상 밖. 원칙 근거는 testing-library.com/docs/guiding-principles/.

---

# 도메인 4 — 공통 UI·브라우저 API (8)

## 상대 시간 표시("3분 전")를 검증
- **상황**: `formatRelativeTime(date)`가 `new Date()`와의 차이로 "방금 전 / 3분 전 / 어제"를 만든다. 실제 시각에 의존하면 테스트가 실행 시점마다 다른 결과를 내 flaky해진다.
- **mock 여부**: 한다 (시스템 시각을 고정)
- **이유**: 통제. 검증 대상은 "차이 계산 로직"이지 "현재 시각"이 아니다. 시각을 고정하면 입력이 결정론적이 되어 신뢰 가능한 단언이 가능하다.
```tsx
import { render, screen } from '@testing-library/react'
import { RelativeTime } from './RelativeTime'

beforeEach(() => {
  vi.useFakeTimers()                                  // mock 포인트: Date 래핑
  vi.setSystemTime(new Date('2026-07-10T12:00:00Z'))  // '현재'를 고정
})
afterEach(() => vi.useRealTimers())                   // 반드시 복원

test('3분 전 게시물은 "3분 전"으로 표시', () => {
  const posted = new Date('2026-07-10T11:57:00Z')
  render(<RelativeTime date={posted} />)
  expect(screen.getByText('3분 전')).toBeInTheDocument()
})
```
- **근거**: vitest.dev/api/vi.html — "If fake timers are enabled, this method simulates a user changing the system clock (will affect date related API like `hrtime`, `performance.now` or `new Date()`)."

## 스크롤 진입 시 로드되는 컴포넌트(IntersectionObserver)
- **상황**: 뷰포트에 들어오면 이미지를 로드하는 lazy 컴포넌트가 `IntersectionObserver`를 쓴다. jsdom에는 이 API가 없어 렌더 시 `IntersectionObserver is not defined`로 즉시 터진다.
- **mock 여부**: 한다 (전역 stub + 콜백 수동 발화)
- **이유**: jsdom 한계. jsdom은 레이아웃 엔진이 없어 교차를 계산할 수 없으므로 API 자체가 미구현이다. stub으로 존재하게 만들고, 콜백을 직접 호출해 "화면에 들어옴" 이벤트를 흉내 낸다.
```tsx
import { render, screen } from '@testing-library/react'
import { LazyImage } from './LazyImage'

let triggerIntersect: (entries: Partial<IntersectionObserverEntry>[]) => void

beforeEach(() => {
  // mock 포인트: jsdom에 없는 API를 stub하고 콜백을 캡처
  vi.stubGlobal('IntersectionObserver', vi.fn((cb) => {
    triggerIntersect = cb
    return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
  }))
})
afterEach(() => vi.unstubAllGlobals())

test('뷰포트 진입 시 실제 src가 붙는다', () => {
  render(<LazyImage src="/photo.jpg" alt="photo" />)
  expect(screen.getByRole('img')).not.toHaveAttribute('src', '/photo.jpg')
  triggerIntersect([{ isIntersecting: true }])   // 진입 이벤트 수동 발화
  expect(screen.getByRole('img')).toHaveAttribute('src', '/photo.jpg')
})
```
- **근거**: MDN IntersectionObserver — "provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport." / vitest.dev/api/vi.html — `vi.stubGlobal`: "Changes the value of global variable. You can restore its original value by calling `vi.unstubAllGlobals`."

## 다크모드 자동 감지(prefers-color-scheme / matchMedia)
- **상황**: `useColorScheme` 훅이 `window.matchMedia('(prefers-color-scheme: dark)')`의 `matches`로 초기 테마를 정한다. jsdom의 `matchMedia`는 미구현이라 호출 시 예외가 난다.
- **mock 여부**: 한다 (matchMedia stub, `matches` 값을 주입)
- **이유**: jsdom 한계 + 통제. jsdom엔 미디어쿼리 평가기가 없다. stub으로 `matches: true`를 주입해 "OS가 다크모드"라는 조건을 결정론적으로 만든다.
```tsx
import { render, screen } from '@testing-library/react'
import { ThemedApp } from './ThemedApp'

function stubMatchMedia(matches: boolean) {
  // mock 포인트: matchMedia가 원하는 matches를 반환하도록 주입
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches, media: query, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  })))
}
afterEach(() => vi.unstubAllGlobals())

test('OS가 다크모드면 dark 테마로 렌더', () => {
  stubMatchMedia(true)
  render(<ThemedApp />)
  expect(screen.getByTestId('root')).toHaveClass('theme-dark')
})
```
- **근거**: MDN Window/matchMedia — "returns a new `MediaQueryList` object that can then be used to determine if the `document` matches the media query string..."

## 버튼 클릭 시 애널리틱스 이벤트 전송(GA/Amplitude)
- **상황**: "구매" 버튼을 누르면 `analytics.track('purchase_click', …)`가 호출된다. 실제 전송은 네트워크 부작용일 뿐 UI 검증 대상이 아니고, 테스트 중 실제 트래킹 서버로 데이터가 나가면 안 된다.
- **mock 여부**: 한다 — 단, 대체가 아니라 spy로 "호출 여부·인자"만 확인
- **이유**: 부작용 격리 + 통제. 전송 결과가 UI에 반영되지 않으므로 실제로 보낼 이유가 없다. spy로 계약(이벤트명·payload)만 단언한다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as analytics from './analytics'
import { BuyButton } from './BuyButton'

test('구매 클릭 시 올바른 이벤트를 전송', async () => {
  // mock 포인트: 실제 전송을 막고 호출만 감시
  const track = vi.spyOn(analytics, 'track').mockImplementation(() => {})
  render(<BuyButton productId="sku-42" />)

  await userEvent.click(screen.getByRole('button', { name: '구매' }))

  expect(track).toHaveBeenCalledTimes(1)
  expect(track).toHaveBeenCalledWith('purchase_click', { productId: 'sku-42' })
})
```
- **근거**: vitest.dev/api/vi.html — `vi.spyOn`: "Creates a spy on a method or getter/setter of an object similar to `vi.fn()`." / kentcdodds.com/blog/the-merits-of-mocking — 네트워크·애니메이션 라이브러리처럼 테스트를 지연/오염시키는 것을 mock 대상으로 든다.

## 진입 애니메이션(framer-motion)이 걸린 모달
- **상황**: 모달이 `framer-motion`의 `AnimatePresence`로 페이드/슬라이드하며 열리고 닫힌다. 애니메이션이 끝나야 DOM에서 요소가 빠지므로, 실제 타이밍에 맡기면 "닫힘 후 사라짐" 단언이 느리고 불안정하다.
- **mock 여부**: 한다 (motion 컴포넌트를 무-애니메이션 패스스루로 대체)
- **이유**: 비용·통제. 검증 대상은 "열림/닫힘 상태 전이"지 애니메이션 프레임이 아니다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// mock 포인트: motion.*를 즉시 렌더되는 일반 요소로, AnimatePresence는 그대로 통과
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_t, tag: string) => (props: any) => {
    const { children, ...rest } = props
    return <div data-tag={tag} {...rest}>{children}</div>
  }}),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

test('닫기 누르면 모달이 즉시 사라진다', async () => {
  const { Modal } = await import('./Modal')
  render(<Modal defaultOpen />)
  await userEvent.click(screen.getByRole('button', { name: '닫기' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
```
- **근거**: kentcdodds.com/blog/the-merits-of-mocking — "mock network calls and animation libraries (which would delay test completion)." / vitest.dev/api/vi.html — `vi.mock`: "Substitutes all imported modules from provided `path` with another module... The call to `vi.mock` is hoisted."

## 라우터 네비게이션 — 링크 클릭 후 페이지 전환 (대비 사례: mock 안 함)
- **상황**: 네비게이션 링크를 누르면 `/profile`로 이동하며 해당 라우트 컴포넌트가 렌더돼야 한다. `useNavigate`/`<Link>`를 mock하고 싶은 유혹이 있다.
- **mock 여부**: 안 한다 — `MemoryRouter`로 실제 라우터를 쓴다
- **이유**: 통합 신뢰. react-router는 테스트를 위해 브라우저 히스토리 대신 메모리 히스토리를 쓰는 `MemoryRouter`를 공식 제공한다. mock하면 "path 매칭·URL 파라미터·라우트 렌더"라는 정작 검증하고 싶은 통합 동작이 사라진다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Nav } from './Nav'
import { Profile } from './Profile'

test('프로필 링크 클릭 시 프로필 페이지 렌더', async () => {
  // mock 없음: 실제 라우터 + 실제 매칭. 초기 위치만 메모리로 통제
  render(
    <MemoryRouter initialEntries={['/']}>
      <Nav />
      <Routes>
        <Route path="/" element={<div>홈</div>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MemoryRouter>
  )
  await userEvent.click(screen.getByRole('link', { name: '프로필' }))
  expect(screen.getByRole('heading', { name: '내 프로필' })).toBeInTheDocument()
})
```
- **근거**: reactrouter.com/6.28.0/router-components/memory-router — "`<MemoryRouter>` stores its locations internally in an array... This makes it ideal for scenarios where you need complete control over the history stack, like testing." / testing-library.com/docs/guiding-principles/.

## 순수 UI 토글 상태 — 아코디언 펼침/접힘 (대비 사례: mock 안 함)
- **상황**: 헤더를 클릭하면 `useState`로 본문이 열리고 닫힌다. 외부 의존이 전혀 없는 순수한 로컬 상태 컴포넌트다.
- **mock 여부**: 안 한다 (아무것도 mock하지 않음)
- **이유**: 통합 신뢰·mock 최소화. 부작용도, jsdom 미지원 API도, 비결정성도 없다. 실제 상호작용(클릭)과 실제 상태 전이를 그대로 관찰하는 것이 가장 높은 신뢰를 준다. `useState`를 spy하는 등의 행위는 구현 디테일 테스트로 안티패턴이다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from './Accordion'

test('헤더 클릭으로 본문이 열리고 다시 닫힌다', async () => {
  // mock 없음: 실제 상태 + 실제 DOM 관찰
  render(<Accordion title="배송 안내">3일 내 도착</Accordion>)
  expect(screen.queryByText('3일 내 도착')).not.toBeInTheDocument()

  const header = screen.getByRole('button', { name: '배송 안내' })
  await userEvent.click(header)
  expect(screen.getByText('3일 내 도착')).toBeInTheDocument()

  await userEvent.click(header)
  expect(screen.queryByText('3일 내 도착')).not.toBeInTheDocument()
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "it should deal with DOM nodes rather than component instances." / kentcdodds.com/blog/the-merits-of-mocking — "Mocking severs the real-world connection..." (연결이 필요 없는 순수 로직엔 mock 이유가 없음)

## 환경변수 기반 feature flag 분기
- **상황**: `import.meta.env.VITE_ENABLE_BETA`가 `'true'`일 때만 베타 배너가 렌더된다. 실제 `.env` 값에 테스트를 종속시키면 CI/로컬 설정에 따라 결과가 갈린다.
- **mock 여부**: 한다 (`vi.stubEnv`로 환경변수 주입)
- **이유**: 통제. flag on/off 두 분기를 한 파일에서 결정론적으로 재현하려면 실제 env가 아니라 주입된 값이어야 한다.
```tsx
import { render, screen } from '@testing-library/react'

afterEach(() => vi.unstubAllEnvs())

test('플래그가 켜지면 베타 배너가 보인다', async () => {
  vi.stubEnv('VITE_ENABLE_BETA', 'true')   // mock 포인트: 환경변수 주입
  const { Home } = await import('./Home')   // env 읽기 이후 로드
  render(<Home />)
  expect(screen.getByText('베타 기능 체험')).toBeInTheDocument()
})

test('플래그가 꺼지면 배너가 없다', async () => {
  vi.stubEnv('VITE_ENABLE_BETA', 'false')
  const { Home } = await import('./Home')
  render(<Home />)
  expect(screen.queryByText('베타 기능 체험')).not.toBeInTheDocument()
})
```
- **근거**: vitest.dev/api/vi.html — `vi.stubEnv`: "Changes the value of environmental variable on `process.env` and `import.meta.env`." (복원: `vi.unstubAllEnvs`)

---

# 도메인 5 — 예약·캘린더·타임존 (7)

## 가용 시간 슬롯 조회 API (병원 예약 가능 시간대 목록)
- **상황**: 날짜를 선택하면 그 날의 예약 가능한 30분 슬롯 목록을 `GET /api/availability?date=...`로 받아 렌더한다. 서버가 이미 예약된 시간대를 제외하고 남은 슬롯만 내려준다. 컴포넌트가 로딩→성공→빈 슬롯(만석) 상태를 올바르게 그리는지 검증한다.
- **mock 여부**: 한다 (네트워크만, MSW로)
- **이유**: 실제 백엔드에 붙으면 그 날 실제 예약 상황에 따라 응답이 매번 달라져 비결정적이다. 그렇다고 `fetch`를 직접 stub하면 응답 헤더·상태·JSON 형태를 손으로 재구현하게 되고, 실제 요청 URL/쿼리스트링이 틀려도 테스트는 통과한다. MSW는 네트워크 경계에서만 가로채므로 컴포넌트의 `fetch` 호출 경로 전체가 실제로 실행된다.
```tsx
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { render, screen } from '@testing-library/react'

// mock 포인트: 네트워크 경계만 가로챈다. 컴포넌트의 fetch/파싱은 실제 실행됨
const server = setupServer(
  http.get('/api/availability', ({ request }) => {
    const date = new URL(request.url).searchParams.get('date')
    if (date === '2026-03-15')
      return HttpResponse.json({ slots: ['09:00', '09:30', '10:00'] })
    return HttpResponse.json({ slots: [] }) // 만석
  }),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('가용 슬롯을 버튼으로 렌더한다', async () => {
  render(<AvailabilityPicker date="2026-03-15" />)
  expect(await screen.findByRole('button', { name: '09:00' })).toBeVisible()
  expect(screen.getAllByRole('button')).toHaveLength(3)
})

test('만석이면 안내 문구를 보여준다', async () => {
  render(<AvailabilityPicker date="2026-03-16" />)
  expect(await screen.findByText(/예약 가능한 시간이 없습니다/)).toBeVisible()
})
```
- **근거**: mswjs.io/docs/ — "Instead of patching `fetch` and meddling with your application's integrity, MSW bets on the platform, utilizing the standard browser API to implement a revolutionary request interception logic."

## 예약 확정 시 슬롯 충돌 409 응답 처리
- **상황**: 사용자가 슬롯을 눌러 예약을 확정(`POST /api/reservations`)하는 순간, 다른 사용자가 방금 같은 슬롯을 채가 서버가 `409 Conflict`를 반환한다. UI가 에러 토스트를 띄우고 슬롯을 비활성화한 뒤 재조회를 유도하는지 검증한다.
- **mock 여부**: 한다 (MSW로 상태 코드 오버라이드)
- **이유**: 실서버에서 409를 재현하려면 동시 요청 레이스를 인위로 만들어야 해 불가능에 가깝다. MSW는 특정 테스트에서만 핸들러를 덮어써 결정론적으로 409를 내려줄 수 있고, 컴포넌트의 `response.status` 분기와 에러 처리 경로가 실제로 돈다.
```tsx
import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

test('예약 충돌 409면 에러를 알리고 슬롯을 잠근다', async () => {
  // mock 포인트: 이 테스트에서만 409로 덮어쓴다 (성공 핸들러 override)
  server.use(
    http.post('/api/reservations', () =>
      HttpResponse.json({ message: '이미 예약된 시간입니다' }, { status: 409 }),
    ),
  )
  render(<ReservationForm slot="10:00" />)
  await userEvent.click(screen.getByRole('button', { name: '예약하기' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('이미 예약된 시간입니다')
  expect(screen.getByRole('button', { name: '10:00' })).toBeDisabled()
})
```
- **근거**: mswjs.io/docs/http/mocking-responses/ — MSW는 Fetch API 제약을 제거해 "set otherwise non-configurable status codes"까지 지정할 수 있으며 응답은 `new HttpResponse(null, { status: 404 })`처럼 status 옵션으로 만든다.

## 예약 리마인더 타이머 (15분 전 알림 발화)
- **상황**: 예약 상세 화면이 마운트되면 `setTimeout`으로 "예약 15분 전" 리마인더 배너를 띄우도록 예약해둔다. 실제로 15분을 기다릴 수 없으니, 시간을 앞으로 감아 배너가 뜨는지 검증한다.
- **mock 여부**: 한다 (네트워크가 아니라 타이머를 vi 페이크로)
- **이유**: 벽시계 시간에 의존하면 테스트가 느리고 비결정적이다. 페이크 타이머로 `setTimeout` 콜백 발화 시점을 직접 통제하면 실시간 대기 없이 결정론적으로 검증된다.
```tsx
import { render, screen, act } from '@testing-library/react'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers()) // mock 포인트: 반드시 실타이머로 복원

test('예약 15분 전이 되면 리마인더 배너가 뜬다', () => {
  render(<ReservationDetail remindInMs={15 * 60_000} />)
  expect(screen.queryByRole('status')).toBeNull()

  // mock 포인트: 15분을 실제로 기다리지 않고 앞으로 감는다
  act(() => vi.advanceTimersByTime(15 * 60_000))

  expect(screen.getByRole('status')).toHaveTextContent('곧 예약 시간입니다')
})
```
- **근거**: vitest.dev/api/vi.html — "It will wrap all further calls to timers (such as `setTimeout`, ..., and `Date`) until `vi.useRealTimers()` is called." / vitest.dev/guide/mocking.html — "Always remember to clear or restore mocks before or after each test run..."

## 타임존 변환 순수 함수 (UTC 저장값 → 사용자 로컬 표시)
- **상황**: 서버는 예약 시각을 UTC ISO 문자열로 저장한다. `formatInZone(utcIso, 'America/New_York')`가 이를 해당 타임존의 벽시계 시각 문자열로 변환한다. 뉴욕과 서울 사용자가 같은 예약을 각자의 로컬 시각으로 보게 하는 핵심 로직.
- **mock 여부**: 안 한다 (순수 함수, 실제 `Intl` 사용)
- **이유**: 이건 네트워크도 타이머도 아니라 입력→출력이 고정된 순수 계산이다. `Intl.DateTimeFormat`을 mock하면 정작 검증하려는 타임존 변환 자체를 가짜로 바꿔버려 테스트가 무의미해진다. IANA 타임존 데이터는 런타임(Node ICU)이 실제로 갖고 있으므로 그대로 돌리면 된다.
```ts
import { formatInZone } from './timezone'

// mock 없음: 실제 Intl 엔진으로 IANA 타임존 변환을 검증
test('동일 UTC 예약을 각 타임존의 벽시계로 변환한다', () => {
  const utc = '2026-01-15T00:30:00Z' // 겨울(표준시)
  expect(formatInZone(utc, 'America/New_York')).toBe('2026-01-14 19:30')
  expect(formatInZone(utc, 'Asia/Seoul')).toBe('2026-01-15 09:30')
})

test('존재하지 않는 타임존은 던진다', () => {
  expect(() => formatInZone('2026-01-15T00:30:00Z', 'Mars/Olympus')).toThrow(RangeError)
})
```
- **근거**: MDN Intl.DateTimeFormat `timeZone` — "The time zone to use. Can be any IANA time zone name, including named identifiers such as `\"UTC\"`, `\"America/New_York\"`... The default is the runtime's time zone."

## DST 경계 슬롯 렌더를 결정론적으로 (봄 spring-forward "존재하지 않는 시각")
- **상황**: 뉴욕에서 2026-03-08 새벽 2시에 DST가 시작되어 02:00~02:59가 통째로 사라진다. 30분 슬롯 생성기가 01:30 다음에 03:00을 내놓아야 하고(02:30 슬롯이 없어야 함), "오늘 남은 슬롯" 계산은 실행 시각(now)에 의존한다. 테스트 머신의 로컬 타임존·현재시각에 흔들리면 안 된다.
- **mock 여부**: 부분적으로 — 순수 슬롯 계산은 실제 코드, 단 `now`와 TZ만 고정(vi.setSystemTime + 환경 타임존)
- **이유**: DST 전개 로직 자체는 검증 대상이라 mock하면 안 된다. 하지만 "지금 몇 시인가"와 "어느 타임존에서 도는가"는 테스트 결과를 좌우하는 외부 조건이므로 고정해 결정론을 확보한다. CI가 UTC든 KST든 동일 결과가 나오게 한다.
```ts
// vitest.config: test.env.TZ = 'America/New_York' 로 프로세스 타임존 고정 (mock 포인트①)
import { generateSlots } from './slots'

beforeEach(() => {
  vi.useFakeTimers()
  // mock 포인트②: now를 DST 시작일 새벽으로 고정 → "남은 슬롯" 결정론화
  vi.setSystemTime(new Date('2026-03-08T06:30:00Z')) // = NY 01:30 (DST 직전)
})
afterEach(() => vi.useRealTimers())

test('spring-forward에서 02:xx 슬롯은 건너뛴다', () => {
  const slots = generateSlots('2026-03-08', 'America/New_York') // 실제 전개 로직
  expect(slots).toContain('01:30')
  expect(slots).not.toContain('02:00') // 존재하지 않는 시각
  expect(slots).not.toContain('02:30')
  expect(slots[slots.indexOf('01:30') + 1]).toBe('03:00')
})
```
- **근거**: vitest.dev/api/vi.html — `vi.setSystemTime`: "simulates a user changing the system clock... however, it will not fire any timers." / tc39.es/proposal-temporal/docs/zoneddatetime.html — disambiguation은 "invalid due to offset changes skipping clock time (as in the skipped clock hour after DST starts)"를 다룬다.

## 반복 일정(recurring) 전개 로직 — DST를 넘는 매주 반복
- **상황**: "매주 화요일 09:00, America/New_York, 8회" 규칙을 실제 발생 인스턴스 배열로 펼친다. 이 구간에 DST 전환(11월 fall-back)이 끼어 있어도 각 인스턴스의 벽시계 09:00은 유지되어야 하고, UTC 오프셋만 -04:00→-05:00으로 바뀐다.
- **mock 여부**: 안 한다 (순수 전개 함수, 실제 타임존 산술)
- **이유**: 반복 전개는 결정적 입력→출력 계산이다. 여기서 Date/Temporal을 mock하면 정작 검증할 DST 보정 산술을 가짜로 대체하게 된다.
```ts
import { expandRecurrence } from './recurrence'

// mock 없음: 실제 타임존 산술로 DST를 가로지르는 반복을 전개
test('매주 화 09:00은 DST 전환 후에도 벽시계 09:00을 유지한다', () => {
  const occ = expandRecurrence({
    start: '2026-10-27T09:00',      // 화, NY (DST, -04:00)
    tz: 'America/New_York',
    freq: 'WEEKLY', count: 3,
  })
  expect(occ[0]).toBe('2026-10-27T09:00:00-04:00')
  expect(occ[1]).toBe('2026-11-03T09:00:00-05:00') // 11/1 fall-back 이후
  expect(occ[2]).toBe('2026-11-10T09:00:00-05:00')
})
```
- **근거**: tc39.es/proposal-temporal/docs/zoneddatetime.html — "Arithmetic automatically adjusts for Daylight Saving Time, using the rules defined in RFC 5545 (iCalendar) and adopted in other libraries like moment.js."

## 슬롯 겹침(충돌) 판정 순수 함수 — 예약 구간 오버랩
- **상황**: 회의실 예약에서 새 예약 `[start, end)`가 기존 예약들과 겹치는지 판정하는 `hasOverlap(newRange, existing[])`. 반개구간 경계(한 예약의 end == 다음 예약의 start는 겹침 아님), 자정 넘김, 완전 포함 케이스를 검증한다.
- **mock 여부**: 안 한다 (순수 함수)
- **이유**: 순수 구간 비교 로직이라 mock할 협력자가 없다. 오히려 다양한 경계 입력을 직접 넣어 실제 부등호 로직을 검증해야 신뢰가 생긴다.
```ts
import { hasOverlap } from './overlap'

const existing = [{ start: '10:00', end: '11:00' }, { start: '14:00', end: '15:00' }]

// mock 없음: 반개구간 경계 조건을 실제 비교 로직으로 검증
test.each([
  [{ start: '10:30', end: '10:45' }, true],  // 내부 포함
  [{ start: '09:30', end: '10:00' }, false], // 경계 접촉(end==start) → 겹침 아님
  [{ start: '10:59', end: '11:30' }, true],  // 꼬리 겹침
  [{ start: '11:00', end: '14:00' }, false], // 두 예약 사이 빈 구간
])('%o 겹침=%s', (range, expected) => {
  expect(hasOverlap(range, existing)).toBe(expected)
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you." / kentcdodds.com/blog/stop-mocking-fetch — 잘못된 mock은 "you end up re-implementing your entire backend"; 순수 계산엔 재구현할 협력자가 없다.

---

# 도메인 6 — 미디어·플레이어 (8)

## video 재생/일시정지 버튼이 play()/pause()를 호출한다
- **상황**: 재생 버튼을 누르면 `video.play()`, 다시 누르면 `video.pause()`를 호출하고 아이콘이 토글되는 컨트롤. 클릭 핸들러가 실제로 미디어 메서드를 부르는지 검증하고 싶다.
- **mock 여부**: 한다 (jsdom의 `play`/`pause`를 stub)
- **이유**: jsdom은 `HTMLMediaElement.prototype.play`/`pause`를 실제로 구현하지 않고 "Not implemented" 에러를 콘솔에 뱉는다. 실제 디코딩·재생을 검증하려는 게 아니라 "버튼→메서드 호출→아이콘 토글" 배선을 검증하는 것이므로, 미구현 메서드를 spy로 갈아끼워 호출 여부만 확인하는 게 통제·비용 면에서 맞다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, beforeAll } from 'vitest'
import { PlayerControls } from './PlayerControls'

// mock 포인트: jsdom에 없는 play/pause를 프로토타입 레벨에서 stub.
// play는 Promise를 반환하는 실제 스펙을 흉내내야 컴포넌트의 .then/await가 깨지지 않는다.
beforeAll(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
})

test('토글 버튼이 play와 pause를 순서대로 호출한다', async () => {
  render(<PlayerControls src="/clip.mp4" />)
  const btn = screen.getByRole('button', { name: /재생/ })

  await userEvent.click(btn)
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce()
  expect(screen.getByRole('button', { name: /일시정지/ })).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: /일시정지/ }))
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledOnce()
})
```
- **근거**: jsdom 소스 `HTMLMediaElement-impl.js`: `notImplementedMethod(..., "HTMLMediaElement", "play")` (load/play/pause 모두 `notImplementedMethod`). / MDN HTMLMediaElement/play — "It returns a `Promise` which is resolved when playback has been successfully started."

## seek 바를 드래그하면 currentTime이 갱신되고 timeupdate로 UI가 반영된다
- **상황**: 사용자가 진행 바를 클릭/드래그하면 `video.currentTime`을 설정(seek)하고, 미디어가 `timeupdate`를 쏘면 표시 시간과 진행 바 위치가 따라온다.
- **mock 여부**: 부분적으로 (currentTime을 쓰기 가능한 속성으로 정의 + timeupdate 이벤트를 수동 dispatch)
- **이유**: jsdom은 실제 미디어 파이프라인이 없어 `currentTime`을 설정해도 자동으로 `timeupdate`가 발생하지 않고 재생 위치도 진행하지 않는다. 실제 브라우저가 발생시킬 이벤트를 테스트에서 직접 흉내내야 컴포넌트의 이벤트 구독 로직을 통합 신뢰 수준으로 검증할 수 있다.
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VideoPlayer } from './VideoPlayer'

test('timeupdate가 발생하면 경과 시간 표시가 갱신된다', () => {
  render(<VideoPlayer src="/clip.mp4" />)
  const video = screen.getByTestId('media') as HTMLVideoElement

  // mock 포인트 1: jsdom의 currentTime은 진행하지 않으므로 값을 직접 심는다.
  // (duration은 read-only라 defineProperty 필요)
  Object.defineProperty(video, 'duration', { configurable: true, value: 125 })
  video.currentTime = 65

  // mock 포인트 2: 브라우저가 자동으로 안 쏘는 timeupdate를 수동 발화.
  fireEvent(video, new Event('timeupdate'))

  expect(screen.getByText('1:05 / 2:05')).toBeInTheDocument()
})
```
- **근거**: MDN HTMLMediaElement/currentTime — "Changing the value of `currentTime` seeks the media to the new time." / MDN HTMLMediaElement/timeupdate_event — "fired when the time indicated by the `currentTime` attribute has been updated."

## 버퍼링 상태에서 스피너를 띄우고 재생 재개 시 감춘다
- **상황**: 네트워크가 밀려 `waiting` 이벤트가 오면 로딩 스피너를 보여주고, `playing`/`canplay`가 오면 감춘다.
- **mock 여부**: 한다 (미디어 상태 이벤트를 수동 dispatch)
- **이유**: 버퍼 부족·재개는 실제 네트워크·디코더가 있어야 자연 발생하는데 jsdom에는 둘 다 없다. `waiting`/`playing`은 jsdom이 스스로 절대 발화하지 않으므로, 상태 전이를 이벤트 주입으로 시뮬레이션해야 컴포넌트의 구독→렌더 로직을 검증할 수 있다.
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VideoPlayer } from './VideoPlayer'

test('waiting이면 스피너, playing이면 사라진다', () => {
  render(<VideoPlayer src="/clip.mp4" />)
  const video = screen.getByTestId('media') as HTMLVideoElement

  expect(screen.queryByRole('status')).not.toBeInTheDocument()

  // mock 포인트: 버퍼링 시작/종료를 미디어 이벤트로 흉내낸다.
  fireEvent(video, new Event('waiting'))
  expect(screen.getByRole('status')).toHaveTextContent(/버퍼링/)

  fireEvent(video, new Event('playing'))
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
```
- **근거**: jsdom은 미디어 재생을 구현하지 않으므로(`notImplementedMethod`) 이벤트를 흉내내야 함. / testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you."

## 초를 "1:05:03" 형태로 포맷하는 순수 함수
- **상황**: `formatTime(3903)` → `"1:05:03"`, `formatTime(65)` → `"1:05"`처럼 시:분:초를 만드는 유틸.
- **mock 여부**: 안 한다
- **이유**: 외부 의존이 전혀 없는 순수 함수다. mock은 통합 신뢰를 떨어뜨리기만 하고 얻는 게 없다. 경계값(0, 자정 넘김, 자릿수 패딩)을 표로 돌리면 충분하다.
```ts
import { describe, it, expect } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  // mock 없음: 순수 함수라 입력/출력만 단언
  it.each([
    [0, '0:00'],
    [65, '1:05'],
    [3903, '1:05:03'],   // 시간 단위 등장 시 분/초 2자리 패딩
    [3599, '59:59'],
  ])('formatTime(%i) === %s', (input, expected) => {
    expect(formatTime(input)).toBe(expected)
  })
})
```
- **근거**: testing-library.com/docs/guiding-principles/ (순수 함수는 mock 없이 동작 자체 검증) / vitest.dev/api/vi.html (`it.each` 테이블 테스트).

## 진행률 %와 버퍼 % 계산 로직
- **상황**: `currentTime/duration`으로 재생 진행률, `buffered.end(n)/duration`으로 버퍼 진행률을 계산해 프로그레스 바 width를 낸다. `duration`이 0/NaN/Infinity(라이브)일 때 방어가 필요.
- **mock 여부**: 안 한다 (계산 함수만 단위 테스트)
- **이유**: 퍼센트 계산은 숫자 in/out 순수 함수로 뽑을 수 있다. 여기서 `HTMLMediaElement`를 렌더해 mock할 이유가 없다 — 오히려 미디어 stub이 계산 로직 신뢰를 흐린다. 라이브 스트림의 `duration === Infinity`, 0 division 같은 엣지를 실제 코드로 통과시키는 게 핵심.
```ts
import { describe, it, expect } from 'vitest'
import { playedPercent } from './progress'

describe('playedPercent', () => {
  // mock 없음: duration/currentTime을 숫자로 직접 주입
  it('정상 구간은 비율을 %로 반환', () => {
    expect(playedPercent(30, 120)).toBe(25)
  })
  it('duration이 0이면 0% (division-by-zero 방어)', () => {
    expect(playedPercent(30, 0)).toBe(0)
  })
  it('라이브(Infinity)면 0% 취급', () => {
    expect(playedPercent(30, Infinity)).toBe(0)
  })
})
```
- **근거**: MDN HTMLMediaElement/currentTime — "For streamed live media ... seeking may not be possible." / testing-library.com/docs/guiding-principles/.

## 자막(CC) 토글 버튼의 on/off UI 상태
- **상황**: CC 버튼을 누르면 자막이 켜지고 `aria-pressed`가 토글되며 "자막 켬/끔" 라벨이 바뀐다. 실제 자막 트랙 렌더가 아니라 컨트롤의 상태 표현을 검증한다.
- **mock 여부**: 안 한다 (컴포넌트 상태·접근성 속성만 검증)
- **이유**: 토글 상태는 React 상태 + `aria-pressed` DOM 속성으로, jsdom이 정상 지원하는 영역이다. 사용자 관점에서 버튼을 클릭하고 접근성 상태를 단언하는 것이 통합 신뢰가 가장 높다. 여기서 `textTracks.mode`를 mock하면 오히려 구현 세부에 결합된다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CaptionToggle } from './CaptionToggle'

test('CC 버튼 클릭이 aria-pressed와 라벨을 토글한다', async () => {
  render(<CaptionToggle />)
  const btn = screen.getByRole('button', { name: /자막/ })

  // mock 없음: 실제 클릭 → 실제 상태/속성 변화를 사용자 관점으로 단언
  expect(btn).toHaveAttribute('aria-pressed', 'false')

  await userEvent.click(btn)
  expect(btn).toHaveAttribute('aria-pressed', 'true')
  expect(btn).toHaveAccessibleName(/자막 켬/)
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — 접근성 role·상태로 사용자 관점 검증.

## 썸네일 프리뷰(스프라이트/VTT)와 HLS 매니페스트를 네트워크에서 가져온다
- **상황**: seek 바에 hover하면 해당 시각의 썸네일 스프라이트 좌표를 WebVTT에서 파싱해 미리보기를 띄운다. 또는 초기화 시 `.m3u8` 매니페스트를 fetch한다.
- **mock 여부**: 부분적으로 (네트워크는 MSW, 미디어 재생은 별도 stub)
- **이유**: 썸네일 VTT·HLS 매니페스트는 순수 네트워크 리소스라 `fetch`를 직접 갈아끼우지 말고 MSW로 네트워크 레벨에서 가로채는 게 정론이다. 반면 매니페스트를 실제로 디코딩·재생하는 부분은 jsdom에 없으므로 그 경계는 `play` stub으로 끊는다. (VTT 파싱→좌표 매핑이라는 미디어 고유 로직이 검증 대상)
```tsx
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SeekPreview } from './SeekPreview'

// mock 포인트: 네트워크만 MSW로 가로챈다. VTT 파싱 로직은 실제 코드가 돈다.
const server = setupServer(
  http.get('/thumbs.vtt', () =>
    HttpResponse.text(
      'WEBVTT\n\n00:00:10.000 --> 00:00:20.000\nsprite.jpg#xywh=160,0,160,90\n',
    ),
  ),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('hover한 시각의 스프라이트 좌표로 프리뷰를 그린다', async () => {
  render(<SeekPreview vttUrl="/thumbs.vtt" duration={30} />)
  await userEvent.hover(screen.getByTestId('seek-bar'), { clientX: 15 })

  const preview = await screen.findByTestId('thumb-preview')
  expect(preview).toHaveStyle({ backgroundPosition: '-160px 0px' })
})
```
- **근거**: mswjs.io/docs/ — "MSW uses the Service Worker API to intercept actual production requests on the network level." / jsdom이 미디어 재생을 구현하지 않으므로 재생 경계는 stub으로 분리.

## 오토플레이 차단 시 play() 거부를 잡아 음소거 폴백 UI를 띄운다
- **상황**: 첫 자동재생 시도가 브라우저 오토플레이 정책으로 거부되면(`NotAllowedError`), 앱이 이를 catch해 "탭하여 재생" 버튼이나 음소거 재생 폴백을 보여준다.
- **mock 여부**: 한다 (`play`를 거부하는 Promise로 stub)
- **이유**: 오토플레이 정책은 실제 브라우저의 사용자 상호작용 컨텍스트에서만 발동하며 jsdom엔 정책 자체가 없다. 거부 경로(rejected promise)를 테스트에서 재현하려면 `play`가 `NotAllowedError`로 reject하도록 stub하는 수밖에 없다.
```tsx
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { AutoPlayer } from './AutoPlayer'

test('오토플레이 거부 시 탭하여 재생 폴백을 노출한다', async () => {
  // mock 포인트: 스펙상 NotAllowedError로 즉시 reject 되는 상황을 재현
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(
    new DOMException('autoplay blocked', 'NotAllowedError'),
  )

  render(<AutoPlayer src="/clip.mp4" autoPlay />)

  // 컴포넌트가 catch 후 폴백을 렌더 — 실제 렌더 결과를 단언(mock 아님)
  expect(await screen.findByRole('button', { name: /탭하여 재생/ })).toBeInTheDocument()
})
```
- **근거**: MDN HTMLMediaElement/play — "If the user agent is configured not to allow ... playback of media, calling `play()` will cause the returned promise to be immediately rejected with a `NotAllowedError`. Websites should be prepared to handle this situation." / jsdom은 `play`를 구현하지 않아 거부 시나리오를 자체 재현 불가.

---

# 도메인 7 — 대시보드·차트·어드민 (8)

## 대시보드 매출 합계·평균 집계 함수
- **상황**: 여러 주문 레코드를 받아 총매출·평균객단가·기간별 소계를 계산하는 `aggregateSales(orders, range)` 순수함수. 대시보드 KPI 카드가 이 결과를 그대로 표시한다.
- **mock 여부**: 안 한다
- **이유**: 입력이 곧 출력인 결정론적 순수 로직. mock을 끼우면 계산이 아니라 mock이 뱉는 상수를 검증하게 되어 테스트가 회귀를 못 잡는다.
```ts
import { describe, it, expect } from 'vitest'
import { aggregateSales } from './aggregateSales'

describe('aggregateSales', () => {
  const orders = [
    { id: 1, amount: 100, date: '2026-01-01' },
    { id: 2, amount: 300, date: '2026-01-02' },
    { id: 3, amount: 200, date: '2026-02-10' },
  ]
  it('총합·평균·건수를 실제 산술로 계산한다', () => {
    // mock 없음 — 순수함수 입력→출력만 검증
    const r = aggregateSales(orders, { from: '2026-01-01', to: '2026-01-31' })
    expect(r.total).toBe(400)     // 100+300, 2월 건 제외
    expect(r.count).toBe(2)
    expect(r.average).toBe(200)
  })
  it('빈 구간은 0/NaN 방지', () => {
    expect(aggregateSales([], { from: '2026-01-01', to: '2026-01-31' }))
      .toMatchObject({ total: 0, count: 0, average: 0 })
  })
})
```
- **근거**: kentcdodds.com/blog/testing-implementation-details — "Tests which test implementation details can give you a false negative when you refactor your code."

## 테이블 컬럼 정렬 비교자 & 다중 필터 술어
- **상황**: 어드민 테이블의 `makeComparator(key, dir)`(문자열/숫자/날짜/nullable 처리)와 `applyFilters(rows, filters)`(상태·검색어·날짜범위 AND 결합) 순수함수.
- **mock 여부**: 안 한다
- **이유**: 정렬 안정성·null 위치·타입별 비교·필터 교집합 같은 엣지가 버그의 온상. 실제 데이터로 돌려야 신뢰가 생기고, mock은 오히려 이 로직을 우회시켜 무의미하다.
```ts
import { describe, it, expect } from 'vitest'
import { makeComparator, applyFilters } from './tableLogic'

const rows = [
  { name: 'Bob', age: 30, status: 'active' },
  { name: 'ann', age: null, status: 'inactive' },
  { name: 'Cara', age: 22, status: 'active' },
]
it('나이 오름차순, null은 뒤로 (실제 비교자)', () => {
  const sorted = [...rows].sort(makeComparator('age', 'asc'))
  expect(sorted.map(r => r.age)).toEqual([22, 30, null]) // mock 없음
})
it('status + 대소문자 무시 검색어를 AND로 좁힌다', () => {
  const out = applyFilters(rows, { status: 'active', q: 'ca' })
  expect(out.map(r => r.name)).toEqual(['Cara'])
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you."

## 선택 행 → CSV 문자열 직렬화
- **상황**: 일괄 선택된 행을 `toCsv(rows, columns)`로 RFC 4180 규격 CSV 문자열로 만든다(콤마·따옴표·개행 이스케이프, 헤더 순서). 실제 파일 저장은 다른 함수 담당.
- **mock 여부**: 안 한다
- **이유**: 직렬화는 문자열 in/out 순수함수. 이스케이프 규칙이 핵심 위험인데 mock으로 대체하면 정확히 그 규칙을 검증하지 못한다. Blob/다운로드와 분리했기에 jsdom 제약도 없다.
```ts
import { describe, it, expect } from 'vitest'
import { toCsv } from './toCsv'

it('콤마·따옴표·개행 포함 셀을 규격대로 이스케이프한다', () => {
  const rows = [{ name: 'Doe, John', note: 'says "hi"\nline2' }]
  const csv = toCsv(rows, ['name', 'note']) // mock 없음: 순수 직렬화
  expect(csv).toBe(
    'name,note\r\n"Doe, John","says ""hi""\nline2"\r\n'
  )
})
it('빈 배열이면 헤더만', () => {
  expect(toCsv([], ['name', 'note'])).toBe('name,note\r\n')
})
```
- **근거**: kentcdodds.com/blog/testing-implementation-details — 직렬화 알고리즘을 실제로 실행해 결과 문자열을 고정 검증.

## 컬럼 표시 토글 UI 상태
- **상황**: 어드민 테이블 "컬럼" 드롭다운에서 체크박스로 컬럼을 켜고 끄면 `<th>`/`<td>`가 나타나고 사라진다. 로컬 컴포넌트 상태만 사용.
- **mock 여부**: 안 한다
- **이유**: 네트워크·타이머·외부 API가 없는 순수 상호작용. 실제 클릭→렌더 결과를 RTL로 관찰하는 것이 사용자 경험과 동일. mock을 넣을 지점 자체가 없다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'

it('컬럼 토글을 끄면 해당 헤더가 사라진다', async () => {
  const user = userEvent.setup()
  render(<DataTable rows={rows} />) // mock 없음: 실제 상태 전이
  expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /columns/i }))
  await user.click(screen.getByRole('checkbox', { name: 'Email' }))

  expect(screen.queryByRole('columnheader', { name: 'Email' })).not.toBeInTheDocument()
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used..."

## 대시보드 위젯의 지표 데이터 로딩
- **상황**: 대시보드 마운트 시 `/api/metrics?range=30d`를 호출해 KPI 카드·표를 채운다. 로딩 스피너 → 성공 렌더, 500 에러 시 재시도 배너를 테스트해야 한다.
- **mock 여부**: 한다 (네트워크만, MSW로)
- **이유**: 실제 백엔드 의존은 느리고 불안정하며 에러 케이스 재현이 어렵다. `fetch`를 직접 mock하면 요청 URL/파라미터 오류를 못 잡으므로, 네트워크 경계에서 가로채는 MSW가 통합 신뢰를 지킨다.
```tsx
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { render, screen } from '@testing-library/react'
import { Dashboard } from './Dashboard'

// mock 포인트: fetch가 아니라 네트워크 응답만 MSW로 가로챈다
const server = setupServer(
  http.get('/api/metrics', () => HttpResponse.json({ revenue: 400, orders: 2 }))
)
beforeAll(() => server.listen()); afterEach(() => server.resetHandlers()); afterAll(() => server.close())

it('성공 응답을 KPI 카드에 반영', async () => {
  render(<Dashboard range="30d" />)
  expect(await screen.findByText('$400')).toBeInTheDocument()
})
it('500이면 재시도 배너', async () => {
  server.use(http.get('/api/metrics', () => new HttpResponse(null, { status: 500 })))
  render(<Dashboard range="30d" />)
  expect(await screen.findByRole('alert')).toHaveTextContent(/retry/i)
})
```
- **근거**: mswjs.io/docs/ — "you can intercept outgoing requests, observe them, and respond to them using mocked responses." / kentcdodds.com/blog/stop-mocking-fetch.

## 차트 컴포넌트의 데이터→props 매핑 (recharts + ResizeObserver)
- **상황**: `<RevenueChart data={...}/>`는 recharts `ResponsiveContainer`로 감싼 `LineChart`. jsdom엔 레이아웃이 없어 컨테이너 폭이 0 → 차트가 렌더되지 않고, `ResizeObserver`도 미정의라 예외가 난다.
- **mock 여부**: 부분적으로 (ResizeObserver stub + 컨테이너 크기 강제; 데이터 변환 로직은 mock 안 함)
- **이유**: canvas/SVG 실제 픽셀 렌더는 jsdom 한계라 검증 대상이 아니다. 대신 "데이터가 올바른 좌표/시리즈 props로 매핑됐는지"를 검증하고, 라이브러리가 요구하는 브라우저 API만 stub해 실행 가능하게 만든다.
```tsx
import { render, screen } from '@testing-library/react'
import { toSeries } from './toSeries'
import { RevenueChart } from './RevenueChart'

beforeAll(() => {
  // mock 포인트 1: jsdom에 없는 ResizeObserver stub (라이브러리 실행용)
  global.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} }
  // mock 포인트 2: ResponsiveContainer가 폭을 잴 수 있게 offset 강제
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 })
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 })
})

it('원시 데이터를 x=날짜, y=합계 시리즈로 매핑한다', () => {
  // 순수 변환 로직은 mock 없이 실제 검증
  expect(toSeries([{ d: '2026-01', v: 100 }])).toEqual([{ x: '2026-01', y: 100 }])
})
it('차트가 각 데이터포인트를 렌더한다', () => {
  render(<RevenueChart data={[{ d: '2026-01', v: 100 }, { d: '2026-02', v: 300 }]} />)
  expect(screen.getAllByRole('img', { name: /point/i })).toHaveLength(2)
})
```
- **근거**: MDN ResizeObserver — "reports changes to the dimensions of an `Element`'s content or border box..." (jsdom엔 이 레이아웃 관측 API가 없어 stub 필요) / testing-library.com/docs/guiding-principles/.

## Excel/PDF Export 다운로드 트리거 (Blob + createObjectURL)
- **상황**: "Export" 버튼 클릭 시 직렬화된 데이터로 `Blob`을 만들고 `URL.createObjectURL(blob)` → 숨은 `<a download>` 클릭으로 파일 저장을 유발한다.
- **mock 여부**: 한다 (`URL.createObjectURL`/`revokeObjectURL`, `<a>.click`)
- **이유**: jsdom에는 `URL.createObjectURL`이 구현돼 있지 않아 호출 시 예외가 나고, 실제 파일 저장도 헤드리스 환경에선 관측 불가. 따라서 "올바른 Blob(타입·바이트)이 생성되고 다운로드가 트리거됐는지"를 spy로 검증한다. 단, Blob에 들어갈 CSV 문자열은 앞선 순수함수 테스트가 별도로 책임진다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ExportButton } from './ExportButton'

it('클릭 시 CSV Blob URL을 만들고 다운로드를 트리거한다', async () => {
  const user = userEvent.setup()
  // mock 포인트: jsdom 미구현 API를 stub하고 인자를 캡처
  const createURL = vi.fn(() => 'blob:mock')
  const revokeURL = vi.fn()
  vi.stubGlobal('URL', { ...URL, createObjectURL: createURL, revokeObjectURL: revokeURL })
  const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

  render(<ExportButton rows={[{ name: 'Ann' }]} />)
  await user.click(screen.getByRole('button', { name: /export/i }))

  const blob = createURL.mock.calls[0][0] as Blob
  expect(blob.type).toBe('text/csv')          // 올바른 MIME
  expect(await blob.text()).toContain('Ann')  // 실제 직렬화 내용 통과
  expect(clickSpy).toHaveBeenCalledOnce()      // 다운로드 트리거됨
  expect(revokeURL).toHaveBeenCalledWith('blob:mock') // 누수 방지 정리

  vi.unstubAllGlobals(); clickSpy.mockRestore()
})
```
- **근거**: MDN URL/createObjectURL_static — "creates a string containing a blob URL pointing to the object given in the parameter." (jsdom 미구현) / MDN Blob — "represents a blob, which is a file-like object of immutable, raw data." / vitest.dev/guide/mocking — `vi.unstubAllGlobals`로 전역 stub 복원.

## URL 쿼리스트링 ↔ 필터 상태 동기화
- **상황**: 필터(상태·날짜범위·페이지)를 바꾸면 `?status=active&from=...&page=2`가 URL에 반영되고, 그 URL로 새로고침/딥링크 진입하면 동일 필터가 복원된다(react-router `useSearchParams`).
- **mock 여부**: 안 한다 (실제 `MemoryRouter`/history 사용)
- **이유**: 라우터를 mock하면 정작 검증하려는 "상태↔URL 왕복"이 사라진다. jsdom이 제공하는 실제 history API와 라우터를 그대로 써야 딥링크 복원·양방향 동기화의 통합 신뢰가 생긴다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import { FilterBar } from './FilterBar'

function readParams(cb: (p: URLSearchParams) => void) {
  function Probe() { const [p] = useSearchParams(); cb(p); return null }
  return <Probe />
}

it('필터 변경이 쿼리스트링에 반영된다', async () => {
  const user = userEvent.setup()
  let params!: URLSearchParams
  // mock 없음: 실제 라우터/history로 왕복 검증
  render(<MemoryRouter initialEntries={['/admin']}><FilterBar />{readParams(p => (params = p))}</MemoryRouter>)

  await user.selectOptions(screen.getByLabelText('Status'), 'active')
  expect(params.get('status')).toBe('active')
})

it('쿼리스트링에서 필터 상태를 복원한다 (딥링크)', () => {
  render(<MemoryRouter initialEntries={['/admin?status=inactive']}><FilterBar /></MemoryRouter>)
  expect(screen.getByLabelText('Status')).toHaveValue('inactive')
})
```
- **근거**: kentcdodds.com/blog/testing-implementation-details (라우터를 mock하면 실제 동기화 회귀를 놓침) / testing-library.com/docs/guiding-principles/.

---

# 도메인 8 — 에디터·자동저장·마법사 (7)

## undo/redo 히스토리 스택 reducer의 실행취소·재실행
- **상황**: 에디터의 undo/redo가 순수 reducer(`{ past, present, future }`)로 구현돼 있다. `DO`/`UNDO`/`REDO` 액션을 받아 스택을 이동시킨다. 여러 번 편집 후 UNDO 두 번, REDO 한 번 했을 때 상태가 정확한지 검증한다.
- **mock 여부**: 안 한다
- **이유**: 외부 의존성(네트워크·타이머·DOM)이 전혀 없는 순수 함수다. mock을 끼우면 실제 스택 전이 로직 대신 가짜를 검증하게 되어 통합 신뢰가 사라진다. mock의 유일한 이득(비용 절감)이 없고, 손실(신뢰)만 남는다.
```ts
import { describe, it, expect } from 'vitest'
import { historyReducer, initialHistory } from './historyReducer'

describe('undo/redo stack', () => {
  it('두 번 편집 → UNDO 2회 → REDO 1회 후 present가 정확하다', () => {
    // mock 포인트 없음 — 순수 reducer를 실제 코드로 그대로 실행
    let s = initialHistory('')
    s = historyReducer(s, { type: 'DO', value: 'a' })
    s = historyReducer(s, { type: 'DO', value: 'ab' })
    s = historyReducer(s, { type: 'UNDO' })
    s = historyReducer(s, { type: 'UNDO' })
    expect(s.present).toBe('')
    s = historyReducer(s, { type: 'REDO' })
    expect(s.present).toBe('a')
    expect(s.future).toHaveLength(1) // 'ab'가 future에 남아있다
  })
})
```
- **근거**: kentcdodds.com/blog/the-merits-of-mocking — "When you mock something, you're making a trade-off. You're trading confidence for something else." 순수 로직은 트레이드오프의 반대편(비용)이 없어 mock할 이유가 없다.

## 다단계 폼 마법사의 스텝 전이 상태머신
- **상황**: 3스텝 마법사(계정→프로필→확인). 각 스텝에 유효성 규칙이 있고, `NEXT`는 현재 스텝이 유효할 때만 전진, `BACK`은 항상 허용. 잘못된 입력에서 `NEXT`를 눌러도 스텝이 넘어가지 않아야 한다.
- **mock 여부**: 안 한다
- **이유**: 스텝 전이는 순수 상태머신(현재 스텝 + 유효성 → 다음 스텝). 유효성 함수도 순수 로직이다. 여기서 유효성 검사를 mock하면 "전이 규칙과 유효성의 결합"이라는 핵심을 검증하지 못한다.
```ts
import { describe, it, expect } from 'vitest'
import { wizardReducer, start } from './wizardMachine'

describe('wizard step machine', () => {
  it('현재 스텝이 invalid면 NEXT가 무시된다', () => {
    // mock 없음 — 전이 규칙 + 유효성 결합을 실제 코드로 검증
    let s = start() // step: 'account', values: {}
    s = wizardReducer(s, { type: 'NEXT' }) // email 비어있음 → invalid
    expect(s.step).toBe('account') // 전진 안 함
    s = wizardReducer(s, { type: 'CHANGE', field: 'email', value: 'a@b.co' })
    s = wizardReducer(s, { type: 'NEXT' })
    expect(s.step).toBe('profile') // 이제 전진
    s = wizardReducer(s, { type: 'BACK' })
    expect(s.step).toBe('account') // BACK은 항상 허용
  })
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you."

## 뒤로가기 시 이전 스텝 값 보존 (폼 값 병합)
- **상황**: 스텝2에서 값을 입력하고 스텝3으로 갔다가 BACK으로 돌아오면 스텝2 값이 그대로 남아있어야 한다. RTL + user-event로 실제 렌더된 마법사를 조작하며 검증한다.
- **mock 여부**: 안 한다 (값 병합 로직·컴포넌트 모두 실제)
- **이유**: 값 보존은 상태 병합 로직 + 리렌더 시 input의 controlled value 반영이 함께 맞아야 성립한다. 어느 한쪽을 mock하면 "돌아왔을 때 화면에 값이 보인다"는 사용자 관점 보장이 깨진다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Wizard } from './Wizard'

it('BACK으로 돌아오면 이전 스텝 입력값이 보존된다', async () => {
  const user = userEvent.setup()
  render(<Wizard />) // mock 없음 — 실제 상태 병합 + controlled input
  await user.type(screen.getByLabelText('이름'), '최유진')
  await user.click(screen.getByRole('button', { name: '다음' }))
  await user.click(screen.getByRole('button', { name: '이전' }))
  expect(screen.getByLabelText('이름')).toHaveValue('최유진')
})
```
- **근거**: testing-library.com/docs/user-event/intro/ — user-event는 "simulates user interactions by dispatching the events that would happen if the interaction took place in a browser."

## localStorage에서 draft 복원
- **상황**: 페이지 진입 시 localStorage에 저장된 draft가 있으면 에디터가 그 내용으로 초기화된다. jsdom 환경에서 실제 localStorage에 값을 심어두고 마운트 후 복원 여부를 확인한다.
- **mock 여부**: 안 한다 (jsdom의 실제 localStorage 사용, 각 테스트 전 `clear()`만)
- **이유**: jsdom이 표준 준수 localStorage를 제공하므로 굳이 mock할 이유가 없다. mock 객체를 만들면 실제 브라우저 Storage의 직렬화(문자열만 저장)·키 동작과 미묘하게 달라질 수 있다.
```tsx
import { render, screen } from '@testing-library/react'
import { beforeEach, it, expect } from 'vitest'
import { Editor } from './Editor'

beforeEach(() => {
  localStorage.clear() // mock 아님 — 실제 스토리지, 격리만 초기화로 확보
})

it('저장된 draft가 있으면 에디터가 그 내용으로 복원된다', () => {
  // localStorage는 문자열만 저장하므로 JSON 직렬화 형태 그대로 심는다
  localStorage.setItem('draft:post-42', JSON.stringify({ body: '이어서 쓰던 글' }))
  render(<Editor postId="post-42" />)
  expect(screen.getByRole('textbox')).toHaveValue('이어서 쓰던 글')
})
```
- **근거**: MDN Window/localStorage — "the stored data is saved across browser sessions" 이며 "The keys and the values stored with `localStorage` are in the UTF-16 string format."

## 자동저장 draft를 서버에 PUT (네트워크는 MSW)
- **상황**: 입력이 멈추면 draft를 `PUT /api/posts/42/draft`로 자동 저장한다. 성공 시 "저장됨" 표시가, 500 응답 시 "저장 실패, 재시도" 표시가 떠야 한다.
- **mock 여부**: 한다 — 네트워크만 MSW로. 앱 코드(fetch/axios)는 그대로.
- **이유**: 실제 서버를 때리면 느리고 불안정하며 서버 상태에 오염된다. MSW는 앱 코드를 바꾸지 않고 네트워크 경계에서만 가로채므로, "자동저장→응답→UI 반영"의 통합은 유지하면서 성공/실패를 통제할 수 있다. 요청이 갔는지를 스파이로 단정하지 않고, UI 반응(저장됨/실패)으로 행동을 검증한다.
```tsx
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from './Editor'

const server = setupServer(
  http.put('/api/posts/:id/draft', () => HttpResponse.json({ ok: true })),
)
beforeAll(() => server.listen()); afterEach(() => server.resetHandlers()); afterAll(() => server.close())

it('draft 자동저장이 500이면 실패 UI가 뜬다', async () => {
  const user = userEvent.setup()
  server.use( // mock 포인트: 네트워크 경계만 500으로 override, 앱 코드는 그대로
    http.put('/api/posts/:id/draft', () => new HttpResponse(null, { status: 500 })),
  )
  render(<Editor postId="42" />)
  await user.type(screen.getByRole('textbox'), '내용')
  // 요청 여부가 아니라 UI 반응으로 검증
  expect(await screen.findByText('저장 실패, 재시도')).toBeInTheDocument()
})
```
- **근거**: mswjs.io/docs/best-practices/avoid-request-assertions/ — "test how your application reacts to requests, not whether requests were made" / "such assertions ... sway you into testing how your application is written instead of what it does."

## 자동저장 디바운스 타이머 (fake timer + user-event)
- **상황**: 타이핑이 멈추고 800ms 뒤에만 자동저장이 트리거된다. 디바운스가 실제로 대기하는지, 그리고 조기(예: 500ms)에는 저장이 일어나지 않는지 검증한다.
- **mock 여부**: 부분적으로 — 타이머만 `vi` 페이크로, 네트워크는 여전히 MSW로. 디바운스 로직 자체는 실제 코드.
- **이유**: 실제 800ms 대기는 느리고 불안정하다. fake timer로 시간을 결정적으로 전진시키면 "500ms엔 안 되고 800ms엔 된다"는 경계를 정확히 통제한다. user-event는 내부 지연이 있어 fake timer와 충돌하므로 `advanceTimers` 옵션으로 연결해야 한다.
```tsx
import { vi, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from './Editor'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('타이핑 후 800ms가 지나야 자동저장된다', async () => {
  // mock 포인트: 타이머만 fake. user-event를 advanceTimers로 연결
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  render(<Editor postId="42" />)
  await user.type(screen.getByRole('textbox'), 'hi')
  vi.advanceTimersByTime(500)
  expect(screen.queryByText('저장됨')).not.toBeInTheDocument() // 아직 debounce 중
  await vi.advanceTimersByTimeAsync(300) // 총 800ms → 저장 트리거
  expect(await screen.findByText('저장됨')).toBeInTheDocument()
})
```
- **근거**: vitest.dev/api/vi.html — "It will wrap all further calls to timers... until `vi.useRealTimers()` is called." / testing-library.com/docs/user-event/options/ — advanceTimers: "When using fake timers it is necessary to set this option to your test runner's time advancement function."

## 이탈 방지 beforeunload 등록·해제 (이벤트 spy)
- **상황**: draft에 저장 안 된 변경(dirty)이 있으면 `beforeunload` 핸들러를 등록해 브라우저 이탈 확인창을 띄우고, 저장 완료(clean)되면 핸들러를 해제한다. jsdom은 실제 이탈 다이얼로그를 띄우지 못하므로 등록/해제와 `preventDefault` 호출을 확인한다.
- **mock 여부**: 부분적으로 — `window.addEventListener`/`removeEventListener`를 spy. dirty 판정 로직·컴포넌트는 실제.
- **이유**: jsdom에는 실제 페이지 언로드나 확인 다이얼로그가 없어 사용자 관점 결과를 관찰할 수 없다. 관찰 가능한 유일한 접점이 "핸들러가 등록됐는가 / 이벤트에서 preventDefault를 불렀는가"다.
```tsx
import { vi, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from './Editor'

it('dirty 상태에서 beforeunload가 이탈을 막는다', async () => {
  const user = userEvent.setup()
  const addSpy = vi.spyOn(window, 'addEventListener') // mock 포인트: 이벤트 등록 관찰
  render(<Editor postId="42" />)
  await user.type(screen.getByRole('textbox'), 'x') // dirty 발생
  const handler = addSpy.mock.calls.find(([type]) => type === 'beforeunload')?.[1] as EventListener
  expect(handler).toBeDefined() // dirty면 핸들러 등록됨
  const event = new Event('beforeunload', { cancelable: true })
  handler(event)
  expect(event.defaultPrevented).toBe(true)
})
```
- **근거**: MDN Window/beforeunload_event — "best practice is to trigger the dialog by invoking `preventDefault()` on the event object" 이며 목적은 "trigger a browser-generated confirmation dialog ... to help prevent loss of unsaved data."

---

# 도메인 9 — 구독·빌링·금융 (8)

## 요금제 업그레이드 시 비례배분(proration) 청구액 계산
- **상황**: 월 10,000원 플랜을 결제주기 정확히 절반 지점에서 월 20,000원 플랜으로 업그레이드할 때, 추가 청구액(미사용분 환급 −5,000 + 신규 잔여기간 +10,000 = 5,000원)을 계산하는 순수 함수 `calcProration()`.
- **mock 여부**: 안 한다
- **이유**: 돈 계산은 경계값·반올림·부호(환급은 음수)가 핵심이다. mock으로 값을 주입하면 검증 대상인 계산 로직 자체가 사라져 신뢰가 0이 된다.
```ts
import { describe, it, expect } from 'vitest'
import { calcProration } from './proration'

describe('calcProration', () => {
  // mock 없음 — 실제 계산 함수를 그대로 호출한다
  it('주기 절반 지점 업그레이드 시 차액만 청구', () => {
    const amount = calcProration({
      oldPrice: 10_000, newPrice: 20_000,
      periodStart: new Date('2026-07-01'), periodEnd: new Date('2026-07-31'),
      changeAt: new Date('2026-07-16'), // 15/30일 경과
    })
    // -5000(미사용 환급) + 10000(신규 잔여) = 5000
    expect(amount).toBe(5_000)
  })

  it('다운그레이드는 잔여분이 크레딧(음수)으로 남는다', () => {
    const amount = calcProration({
      oldPrice: 20_000, newPrice: 10_000,
      periodStart: new Date('2026-07-01'), periodEnd: new Date('2026-07-31'),
      changeAt: new Date('2026-07-16'),
    })
    expect(amount).toBe(-5_000)
  })
})
```
- **근거**: docs.stripe.com/billing/subscriptions/prorations — "If a customer upgrades from a 10 USD monthly plan to a 20 USD option... the customer is billed an additional 5 USD: -5 USD for unused time on the initial price, and 10 USD for the remaining time on the new price."

## 다중 통화 금액을 로케일 통화 포맷으로 표시
- **상황**: 인보이스 금액 `1234.5`를 `ko-KR`에서 `₩1,235`, `de-DE`에서 `1.234,50 €`처럼 통화별 소수 자릿수·구분자·기호로 렌더링하는 `formatCurrency()`.
- **mock 여부**: 안 한다 (`Intl.NumberFormat`은 런타임 내장, mock 금지)
- **이유**: 통화별 소수 자릿수(KRW 0자리, EUR 2자리)와 반올림은 실제 `Intl` 구현이 결정한다. mock하면 정작 검증할 로케일 규칙이 사라진다.
```ts
import { render, screen } from '@testing-library/react'
import { InvoiceAmount } from './InvoiceAmount'

// mock 없음 — 실제 Intl.NumberFormat 동작을 검증한다
it('KRW는 소수점 없이, EUR는 2자리로 포맷', () => {
  const { rerender } = render(
    <InvoiceAmount value={1234.5} locale="ko-KR" currency="KRW" />,
  )
  expect(screen.getByText('₩1,235')).toBeInTheDocument() // 반올림 + 0자리

  rerender(<InvoiceAmount value={1234.5} locale="de-DE" currency="EUR" />)
  expect(screen.getByText('1.234,50 €')).toBeInTheDocument()
})
```
- **근거**: MDN Intl.NumberFormat — "The `Intl.NumberFormat` object enables language-sensitive number formatting." 통화 예시: `new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(number)` → `123.456,79 €`.

## 카테고리별 지출 집계와 예산 대비 소진율(burn rate)
- **상황**: 거래내역 배열을 카테고리별로 합산하고 예산 대비 소진율(%)을 내는 `computeBudgetUsage()`. 100% 초과(예산 초과) 경계, 예산 0(division-by-zero) 경계 포함.
- **mock 여부**: 안 한다
- **이유**: 합산·나눗셈·경계 처리(예산 0, 초과분 clamp 여부)가 곧 비즈니스 규칙이다. 순수 리듀서라 실제 데이터로 돌려야 반올림·경계 회귀를 잡는다.
```ts
import { computeBudgetUsage } from './budget'

const ledger = [
  { category: '식비', amount: 30_000 },
  { category: '식비', amount: 25_000 },
  { category: '교통', amount: 12_000 },
]

// mock 없음 — 실제 집계 함수
it('카테고리 합산 후 예산 대비 소진율 계산', () => {
  const usage = computeBudgetUsage(ledger, { 식비: 50_000, 교통: 20_000 })
  expect(usage.식비).toEqual({ spent: 55_000, budget: 50_000, rate: 110 }) // 초과
  expect(usage.교통).toEqual({ spent: 12_000, budget: 20_000, rate: 60 })
})

it('예산 0이면 rate는 Infinity가 아니라 null로 방어', () => {
  const usage = computeBudgetUsage([{ category: '기타', amount: 100 }], { 기타: 0 })
  expect(usage.기타.rate).toBeNull() // division-by-zero 경계
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you."

## 할부 개월수별 월 납입금·총이자 계산
- **상황**: 원금·연이율·개월수로 균등분할 월 상환액과 총이자를 내는 `calcInstallment()`. 무이자(0%) 경계와 반올림 잔액 처리 포함.
- **mock 여부**: 안 한다
- **이유**: 이자 공식과 마지막 회차 반올림 보정은 금융 정확성의 핵심이라 실제 함수로 검증해야 한다.
```ts
import { calcInstallment } from './installment'

// mock 없음 — 이자 공식과 반올림을 실제로 검증
it('연 12% 3개월 할부의 월 납입금과 총이자', () => {
  const plan = calcInstallment({ principal: 300_000, annualRate: 0.12, months: 3 })
  expect(plan.monthlyPayment).toBe(102_010) // 원리금균등, 원 단위 반올림
  expect(plan.totalInterest).toBe(6_030)
  // 반올림 누적 오차는 마지막 회차에서 보정
  expect(plan.schedule.reduce((s, m) => s + m.payment, 0))
    .toBe(300_000 + plan.totalInterest)
})

it('무이자(0%)는 원금을 개월수로 균등분할', () => {
  const plan = calcInstallment({ principal: 300_000, annualRate: 0, months: 3 })
  expect(plan.monthlyPayment).toBe(100_000)
  expect(plan.totalInterest).toBe(0) // 경계값
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — 금융 계산은 결과 신뢰가 목적이므로 실제 로직 실행이 원칙.

## 구독 상태(active/past_due/canceled)에 따른 배너 분기
- **상황**: `GET /subscription`이 돌려주는 `status`에 따라 결제 실패 배너(past_due), 재개 안내(canceled), 정상(active)을 다르게 렌더하는 컴포넌트. 세 상태를 각각 검증.
- **mock 여부**: 한다 — 네트워크 응답을 MSW로 주입
- **이유**: 상태는 백엔드가 소유하며 테스트에서 실제 결제 실패를 만들 수 없다. `fetch`를 직접 mock하면 클라이언트 호출이 올바른지 확신할 수 없어, 네트워크 레벨에서 응답만 갈아끼운다.
```ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import { SubscriptionBanner } from './SubscriptionBanner'

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it.each([
  ['past_due', '결제에 실패했습니다'],
  ['canceled', '구독이 해지되었습니다'],
  ['active', null],
])('status=%s 배너 분기', async (status, text) => {
  // mock 포인트: 네트워크 레벨에서 구독 상태만 주입 (fetch 자체는 실제 실행)
  server.use(http.get('/subscription', () => HttpResponse.json({ status })))
  render(<SubscriptionBanner />)
  if (text) expect(await screen.findByText(text)).toBeInTheDocument()
  else expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
```
- **근거**: docs.stripe.com/billing/subscriptions/overview — past_due: "Payment on the latest finalized invoice either failed or wasn't attempted." / canceled: "This is a terminal state that can't be updated." / kentcdodds.com/blog/stop-mocking-fetch.

## 다음 결제 갱신일(D-day)까지 남은 일수 표시
- **상황**: 구독 `currentPeriodEnd`를 받아 "다음 결제 3일 후(2026-07-13)"처럼 오늘 기준 잔여일을 계산해 표시. 오늘 날짜에 의존.
- **mock 여부**: 부분적으로 — 시간만 `vi.setSystemTime`으로 고정, 나머지는 실제
- **이유**: 잔여일 계산은 실제 함수로 검증해야 하지만 "오늘"이 흐르면 테스트가 매일 깨진다. 통제 불가능한 시스템 시계만 고정하고 계산 로직은 mock하지 않는다.
```ts
import { render, screen } from '@testing-library/react'
import { vi, beforeEach, afterEach } from 'vitest'
import { RenewalCountdown } from './RenewalCountdown'

beforeEach(() => {
  vi.useFakeTimers()
  // mock 포인트: 오직 시스템 시계만 고정. 잔여일 계산은 실제 코드가 수행
  vi.setSystemTime(new Date('2026-07-10T09:00:00Z'))
})
afterEach(() => vi.useRealTimers())

it('갱신일까지 남은 일수를 실제로 계산해 표시', () => {
  render(<RenewalCountdown periodEnd="2026-07-13T09:00:00Z" />)
  expect(screen.getByText(/다음 결제 3일 후/)).toBeInTheDocument()
})

it('갱신일 당일이면 D-day 문구', () => {
  render(<RenewalCountdown periodEnd="2026-07-10T23:59:00Z" />)
  expect(screen.getByText(/오늘 결제/)).toBeInTheDocument() // 경계값
})
```
- **근거**: vitest.dev/api/vi.html — `vi.setSystemTime`: "simulates a user changing the system clock (will affect date related API like `hrtime`, `performance.now` or `new Date()`) - however, it will not fire any timers."

## 인보이스/영수증 목록 로딩과 페이지네이션
- **상황**: `GET /invoices?page=2`로 인보이스 목록을 불러와 금액·발행일을 표 렌더. 로딩→성공 전이와 다음 페이지 요청 검증.
- **mock 여부**: 한다 — 목록 응답을 MSW로 제공 (단, 금액 포맷은 실제 `Intl`)
- **이유**: 목록 데이터는 서버 소유라 네트워크를 mock한다. 그러나 각 셀의 통화 포맷은 mock하지 않고 실제 렌더 결과를 검증해 "데이터 주입 + 실제 표시 로직"을 한 테스트에서 함께 신뢰한다.
```ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import { InvoiceList } from './InvoiceList'

const server = setupServer(
  // mock 포인트: 인보이스 목록만 네트워크 레벨에서 주입
  http.get('/invoices', ({ request }) => {
    const page = new URL(request.url).searchParams.get('page')
    return HttpResponse.json({
      items: page === '2'
        ? [{ id: 'in_2', amount: 1234.5, currency: 'EUR', issuedAt: '2026-06-01' }]
        : [{ id: 'in_1', amount: 9900, currency: 'KRW', issuedAt: '2026-07-01' }],
    })
  }),
)
beforeAll(() => server.listen())
afterAll(() => server.close())

it('두 번째 페이지 인보이스를 실제 통화 포맷으로 표시', async () => {
  render(<InvoiceList page={2} />)
  // 금액 포맷은 mock 안 함 — 실제 Intl.NumberFormat 결과 검증
  expect(await screen.findByText('1.234,50 €')).toBeInTheDocument()
})
```
- **근거**: mswjs.io/docs/ — "MSW uses the Service Worker API to intercept actual production requests on the network level." / "MSW is designed to be fully environment-, framework- and tool-agnostic."

## 거래내역(ledger) 잔액 누적 계산
- **상황**: 입금/출금 거래 배열을 시간순으로 누적해 각 행의 running balance(잔액)를 채우는 `withRunningBalance()`. 초기 잔액, 음수 잔액(마이너스 통장) 경계 포함.
- **mock 여부**: 안 한다
- **이유**: 누적 합산과 부호 처리는 가계부 정확성의 핵심이라 실제 데이터로 검증해야 한다. 순수 변환이므로 mock이 오히려 검증 대상을 지운다.
```ts
import { withRunningBalance } from './ledger'

// mock 없음 — 누적 잔액 계산을 실제로 검증
it('입출금을 시간순으로 누적해 잔액을 채운다', () => {
  const rows = withRunningBalance(
    [
      { at: '2026-07-01', delta: +100_000 },
      { at: '2026-07-03', delta: -30_000 },
      { at: '2026-07-05', delta: -90_000 },
    ],
    { opening: 0 },
  )
  expect(rows.map(r => r.balance)).toEqual([100_000, 70_000, -20_000]) // 음수 잔액 경계
})
```
- **근거**: testing-library.com/docs/guiding-principles/ — "The more your tests resemble the way your software is used, the more confidence they can give you."

---

# 도메인 10 — 지도·위치·파셋검색 (7)

## 지도 SDK에 마커가 추가됐는지 검증
- **상황**: 검색 결과 목록이 로드되면 각 장소마다 지도에 마커를 찍는다. Mapbox GL JS(또는 Google Maps) 지도 인스턴스에 `new Marker().setLngLat().addTo(map)`를 호출하는지 확인하고 싶다.
- **mock 여부**: 한다 (지도 SDK 모듈 전체를 mock)
- **이유**: WebGL로 렌더링하는 서드파티라 우리가 소유하지 않고, jsdom엔 GPU/canvas 컨텍스트가 없어 실제 지도가 그려지지 않는다. 픽셀 렌더 결과가 아니라 "마커 추가 호출이 정확한 좌표로 일어났는가"라는 우리 코드의 계약만 검증하면 된다.
```tsx
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// mock 포인트: WebGL SDK 전체를 대역으로. jsdom엔 canvas 컨텍스트가 없어 실제 Map 생성 불가
const addTo = vi.fn()
const setLngLat = vi.fn(() => ({ addTo }))
vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(() => ({ on: vi.fn(), remove: vi.fn() })),
    Marker: vi.fn(() => ({ setLngLat })), // 마커 생성자만 감시
  },
}))

test('결과 좌표로 마커를 찍는다', () => {
  render(<ResultsMap places={[{ id: 1, lng: 127.02, lat: 37.5 }]} />)
  // 검증 대상: 우리 코드가 SDK를 올바른 좌표로 호출했는가 (렌더 결과 아님)
  expect(setLngLat).toHaveBeenCalledWith([127.02, 37.5])
  expect(addTo).toHaveBeenCalled()
})
```
- **근거**: MDN WebGL_API — "introducing an API that closely conforms to OpenGL ES 2.0 that can be used in HTML `<canvas>` elements... take advantage of hardware graphics acceleration." / jsdom README — canvas는 `canvas` npm 패키지가 있을 때만이며 "if it's not present, then `<canvas>` elements will behave like `<div>`s." / vitest.dev/api/vi.html — `vi.mock`: "Substitutes all imported modules from provided `path` with another module."

## "현재 위치" 버튼 → navigator.geolocation
- **상황**: 사용자가 "내 주변" 버튼을 누르면 `navigator.geolocation.getCurrentPosition`으로 좌표를 얻어 주변 검색을 트리거한다. 성공/거부 두 경로를 모두 테스트한다.
- **mock 여부**: 한다 (`navigator.geolocation`을 stub)
- **이유**: jsdom은 Geolocation API를 구현하지 않아 `navigator.geolocation`이 undefined다. 또 실제 브라우저에서도 사용자 권한 프롬프트가 필요해 자동 테스트에서 실제 호출은 불가능하다. 성공 콜백에 원하는 좌표를 주입해 우리 핸들러 로직만 검증한다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('현재 위치 획득 후 좌표를 콜백에 넘긴다', async () => {
  const onLocate = vi.fn()
  // mock 포인트: jsdom엔 navigator.geolocation이 없으므로 통째로 stub
  const getCurrentPosition = vi.fn((success) =>
    success({ coords: { latitude: 37.5, longitude: 127.02 } }),
  )
  vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })

  render(<NearbyButton onLocate={onLocate} />)
  await userEvent.click(screen.getByRole('button', { name: /내 주변/ }))

  expect(getCurrentPosition).toHaveBeenCalled()
  expect(onLocate).toHaveBeenCalledWith({ lat: 37.5, lng: 127.02 })
})
```
- **근거**: MDN Geolocation/getCurrentPosition — "used to get the current position of the device", success 콜백은 "A callback function that takes a `GeolocationPosition` object as its sole input parameter." / MDN GeolocationCoordinates (latitude/longitude in decimal degrees) / vitest.dev/api/vi.html — `vi.stubGlobal`. ⚠️ jsdom 미구현 근거는 1차 소스로 교체 필요(상단 마스터 참고).

## Haversine 거리 계산
- **상황**: 두 좌표 사이 거리를 Haversine 공식으로 계산해 "1.2km" 형태로 표기한다. 검색 결과를 가까운 순으로 정렬하는 데도 쓰인다.
- **mock 여부**: 안 한다
- **이유**: 입력(두 좌표) → 출력(미터)이 결정적인 순수 함수다. 지도 SDK도 네트워크도 필요 없다. mock을 끼우면 오히려 실제 산식의 버그(반지름 상수, 라디안 변환 오류 등)를 못 잡는다.
```ts
import { haversineMeters } from './geo'

test('서울시청~강남역 거리 (약 8.3km)', () => {
  const cityHall = { lat: 37.5663, lng: 126.9779 }
  const gangnam = { lat: 37.4979, lng: 127.0276 }
  // mock 없음: 순수 함수라 실제 산식을 그대로 실행해 검증
  const d = haversineMeters(cityHall, gangnam)
  expect(d).toBeGreaterThan(8000)
  expect(d).toBeLessThan(8600)
})

test('동일 좌표는 0', () => {
  expect(haversineMeters({ lat: 37.5, lng: 127 }, { lat: 37.5, lng: 127 })).toBe(0)
})
```
- **근거**: kentcdodds.com/blog/the-merits-of-mocking — "Mocking severs the real-world connection between what you're testing and what you're mocking." + "Saving a few milliseconds per test? That's not a good reason to mock." / testing-library.com/docs/guiding-principles/.

## 파셋(다중 필터) 조합 술어
- **상황**: 카테고리·가격대·평점·"영업중" 같은 파셋 필터를 여러 개 동시에 걸었을 때, 각 장소가 통과하는지 판정하는 `matchesFacets(place, filters)` 술어. AND 조합, 빈 필터는 전부 통과 등의 규칙이 있다.
- **mock 여부**: 안 한다
- **이유**: 데이터 in / boolean out 순수 로직이다. 필터 조합의 경계(빈 배열=제약 없음, 다중 값=OR, 파셋 간=AND)가 핵심 버그 지점이라 실제 술어로 돌려야 의미가 있다.
```ts
import { matchesFacets } from './facets'

const cafe = { category: 'cafe', price: 2, rating: 4.5, open: true }

test('빈 필터는 모두 통과', () => {
  expect(matchesFacets(cafe, {})).toBe(true) // mock 없음: 술어 실제 실행
})

test('파셋 간 AND — 하나라도 불일치면 탈락', () => {
  expect(matchesFacets(cafe, { category: ['cafe'], price: [1] })).toBe(false)
})

test('한 파셋 내 다중 값은 OR', () => {
  expect(matchesFacets(cafe, { price: [1, 2] })).toBe(true)
})
```
- **근거**: kentcdodds.com/blog/the-merits-of-mocking — "When you mock something, you're making a trade-off. You're trading confidence for something else." / testing-library.com/docs/guiding-principles/.

## 정렬·필터 상태 ↔ URL 쿼리스트링 동기화
- **상황**: 사용자가 정렬을 "거리순", 카테고리를 "cafe,bar"로 바꾸면 URL이 `?sort=distance&category=cafe&category=bar`가 되고, 반대로 그 URL로 진입하면 필터 상태가 복원돼야 한다. 직렬화/역직렬화 함수를 테스트한다.
- **mock 여부**: 안 한다
- **이유**: `URLSearchParams`는 jsdom(및 Node)에 표준 구현이 이미 있으므로 mock 불필요. 오히려 실제 구현을 써야 다중 값(`getAll`)·퍼센트 인코딩·공백 처리 같은 실제 직렬화 규칙과 우리 로직의 정합을 검증할 수 있다.
```ts
import { encodeFilters, decodeFilters } from './url-sync'

test('필터 상태 → 쿼리스트링 (다중 값 반복 키)', () => {
  const qs = encodeFilters({ sort: 'distance', category: ['cafe', 'bar'] })
  // mock 없음: 실제 URLSearchParams 직렬화 규칙을 그대로 검증
  expect(qs).toBe('sort=distance&category=cafe&category=bar')
})

test('왕복(round-trip) 불변', () => {
  const state = { sort: 'rating', category: ['cafe'], q: '분위기 좋은' }
  expect(decodeFilters(encodeFilters(state))).toEqual(state) // 공백/한글 인코딩 포함
})
```
- **근거**: MDN URLSearchParams — "defines utility methods to work with the query string of a URL." / `getAll()`: "Returns all the values associated with a given search parameter." / 공백은 `+`로 인코딩 — 실제 구현을 써야 이 규칙이 검증된다.

## 지오코딩 / 주변 검색 API 호출
- **상황**: 주소를 입력하면 지오코딩 API로 좌표를 얻고, 그 좌표로 주변 장소 검색 API를 호출해 결과 목록을 렌더한다. 성공·빈 결과·500 에러 경로를 테스트한다.
- **mock 여부**: 한다 — 단, fetch를 패치하지 않고 MSW로 네트워크 레벨에서
- **이유**: 실제 외부 지오코딩 API를 때리면 느리고, 요금·레이트리밋·비결정성이 붙는다. 그렇다고 `fetch`를 직접 스텁하면 요청 URL·쿼리 파라미터 조립 로직을 우회해버린다. MSW는 실제 요청을 가로채므로 앱의 fetch 코드는 그대로 실행되고 응답만 대역으로 준다.
```tsx
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// mock 포인트: 네트워크 경계만 가로챈다. 앱의 fetch/쿼리조립 코드는 실제 실행됨
const server = setupServer(
  http.get('/api/geocode', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q')
    expect(q).toBe('강남역') // 우리 코드가 쿼리를 올바로 넣었는지도 검증
    return HttpResponse.json({ lat: 37.4979, lng: 127.0276 })
  }),
  http.get('/api/nearby', () =>
    HttpResponse.json([{ id: 1, name: '스타벅스 강남' }]),
  ),
)
beforeAll(() => server.listen()); afterEach(() => server.resetHandlers()); afterAll(() => server.close())

test('주소 검색 → 주변 결과 렌더', async () => {
  render(<PlaceSearch />)
  await userEvent.type(screen.getByRole('searchbox'), '강남역')
  await userEvent.click(screen.getByRole('button', { name: /검색/ }))
  expect(await screen.findByText('스타벅스 강남')).toBeInTheDocument()
})
```
- **근거**: mswjs.io/docs/ — "Instead of patching `fetch` and meddling with your application's integrity, MSW bets on the platform..." / kentcdodds.com/blog/the-merits-of-mocking — "I never make actual network calls; instead, I'll mock the server response by mocking the module responsible for making the network calls."

## 결과 선택 시 지도 이동(flyTo/panTo)
- **상황**: 목록에서 한 장소를 클릭하면 지도가 그 좌표로 부드럽게 이동한다(`map.flyTo({ center })`). 이동 애니메이션이 아니라 "우리가 올바른 좌표로 이동을 지시했는가"를 본다.
- **mock 여부**: 부분적으로 — 지도 인스턴스 메서드만 spy, 나머지 컴포넌트/클릭 흐름은 실제
- **이유**: `flyTo`는 WebGL 카메라 애니메이션이라 jsdom에서 실행 불가하고 시각 결과도 검증 대상이 아니다. SDK 인스턴스의 `flyTo`만 `vi.fn` 스파이로 두고, 목록 렌더·클릭 핸들러·좌표 전달은 실제 코드로 통과시켜 통합 신뢰를 유지한다.
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('결과 클릭 시 해당 좌표로 지도 이동을 지시', async () => {
  const flyTo = vi.fn() // mock 포인트: 카메라 메서드만 스파이 (WebGL 애니메이션 실행 불가)
  const map = { flyTo, on: vi.fn(), remove: vi.fn() }

  render(<ResultList map={map} places={[{ id: 1, name: '카페', lng: 127.02, lat: 37.5 }]} />)
  await userEvent.click(screen.getByText('카페')) // 클릭 흐름은 실제

  expect(flyTo).toHaveBeenCalledWith({ center: [127.02, 37.5], zoom: expect.any(Number) })
})
```
- **근거**: jsdom README — canvas 패키지가 없으면 "`<canvas>` elements will behave like `<div>`s." / MDN WebGL_API — 하드웨어 그래픽 가속 의존. / vitest.dev/api/vi.html — `vi.fn`: "Every time a function is invoked, it stores its call arguments, returns, and instances."
