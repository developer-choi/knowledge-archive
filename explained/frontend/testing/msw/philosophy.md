# MSW(Mock Service Worker)란 무엇이며, 어떤 일을 하는가?

## 도입

프론트엔드 코드는 대개 서버에 요청을 보내 데이터를 받아 화면을 그린다. 그런데 개발 중이나 테스트 중에는 진짜 서버가 없거나, 있어도 매번 진짜 서버에 붙으면 느리고 불안정하다. 그래서 "실제 서버 대신 미리 정해둔 가짜 응답을 돌려주는" 장치가 필요하고, 이를 **API mocking**이라 한다. MSW는 그 mocking을 담당하는 라이브러리다.

---
## 본문

> Mock Service Worker (MSW) is an API mocking library for browser and Node.js. With MSW, you can intercept outgoing requests, observe them, and respond to them using mocked responses.

"MSW는 브라우저와 Node.js를 위한 API mocking 라이브러리다. MSW로 나가는 요청을 가로채고(intercept), 관찰하고(observe), 가짜 응답으로 답할(respond) 수 있다."

MSW가 하는 일은 동사 세 개로 요약된다.

- **intercept(가로채기)**: 앱이 서버로 보내려는 요청을 실제로 나가기 직전에 낚아챈다.
- **observe(관찰)**: 그 요청이 어느 주소로, 어떤 헤더·바디를 담아 나갔는지 들여다볼 수 있다. "요청이 제대로 만들어졌나"를 검사할 수 있다는 뜻이다.
- **respond(응답)**: 진짜 서버 대신 미리 정해둔 가짜 응답을 돌려준다.

동작하는 환경이 **브라우저와 Node.js 둘 다**라는 점도 특징이다 — 브라우저(개발 중인 앱)에서도, Node.js(Vitest 같은 테스트 러너) 안에서도 같은 mock을 쓸 수 있다. (같은 mock을 여러 환경에서 재사용하는 것이 왜 중요한지는 아래 「vi.mock·axios-mock-adapter처럼 모킹을 특정 도구·라이브러리에 얹으면…」에서 다룬다.)

---
## 종합

MSW는 "앱과 서버 사이에 앉아 요청을 가로채고, 진짜 서버인 척 가짜 응답을 돌려주는" API mocking 라이브러리다. 브라우저와 Node.js 양쪽에서 동작한다. 요청을 가로채는 것에 더해 관찰까지 되므로, 응답을 흉내 내는 것을 넘어 "요청이 올바르게 만들어졌는지"까지 확인하는 발판이 된다.

---
# MSW는 mock 응답을 요청에 어떻게 끼워 넣는가? fetch를 바꿔치기하는 방식과 무엇이 다른가?

## 도입

가짜 응답을 앱에 물리는 방법은 크게 두 갈래다. 하나는 앱이 쓰는 요청 함수(`window.fetch` 등)를 가짜로 **바꿔치기(patch)**하는 것이고, 다른 하나는 요청이 실제로 나가는 **네트워크 문턱**에서 가로채는 것이다. MSW는 후자를 택하며, 이게 MSW의 정체성이다.

---
## 본문

> MSW uses the Service Worker API to intercept actual production requests on the network level. Instead of patching fetch and meddling with your application's integrity, MSW bets on the platform, utilizing the standard browser API to implement a revolutionary request interception logic.
>
> Even in Node.js, where there are no standard means to intercept requests, MSW uses class extension instead of module patching to ensure your tests run in the environment as close to production as possible.

"MSW는 Service Worker API로 실제 프로덕션 요청을 네트워크 레벨에서 가로챈다. fetch를 바꿔치기하며 앱의 integrity(무결성)를 건드리는 대신, MSW는 플랫폼에 베팅한다 — 표준 브라우저 API로 요청 가로채기를 구현한다. 요청을 가로챌 표준 수단이 없는 Node.js에서조차 module patching 대신 class extension을 써서, 테스트가 프로덕션에 최대한 가까운 환경에서 돌게 한다."

두 방식의 차이는 **어디서 가로채느냐**다.

- **함수 바꿔치기(patching)**: `window.fetch`를 가짜 함수로 갈아끼운다. 앱이 부르는 진짜 `fetch`는 실행되지 않고, 정해둔 값이 바로 돌아온다.
- **네트워크 레벨 가로채기(MSW)**: 앱은 진짜 `fetch`를 그대로 부르고 요청이 실제로 만들어져 나간다. 그 요청이 네트워크로 나가기 직전에 가로채 가짜 응답을 준다. 브라우저에선 페이지와 네트워크 사이에 앉는 표준 기능 **Service Worker**가, 표준 가로채기 수단이 없는 **Node.js**에선 **class extension**이 그 문턱 역할을 한다.

```
[함수 바꿔치기]   앱 → window.fetch ✂️가짜 → 정해둔 값
[MSW]            앱 → fetch → 네트워크 ✂️MSW → 가짜 응답
```

이렇게 앱 코드를 건드리지 않고("zero changes to your code") 문턱에서만 가로채므로, 앱의 integrity를 해치지 않고 테스트 환경을 프로덕션에 가깝게 유지한다.

---
# 테스트에서 API를 mock할 때 왜 window.fetch stubbing 대신 MSW를 권장하는가?

## 본문

> We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing window.fetch, or relying on third-party adapters.

"우리는 window.fetch를 stub하거나 서드파티 어댑터에 의존하는 대신, MSW 라이브러리를 사용하여 테스트에서 API 통신을 선언적으로 모킹할 것을 권장한다."

- **declaratively**: 어떻게(how) 가로채는지가 아니라 무엇을(what) 응답할지만 선언한다. `http.get('/api/user', () => HttpResponse.json({ name: 'Kim' }))`처럼 핸들러만 정의하면 된다.
- **stubbing**: 원래 함수를 가짜 구현으로 바꿔치기하는 기법. `window.fetch = vi.fn()`이 전형적인 예. 구현 세부사항에 직접 결합된다.

```
window.fetch stubbing
  → axios로 교체하면 테스트 전부 깨짐
  → 함수 레벨에서 가로채 — 실제 요청 흐름과 다름

MSW
  → Service Worker / Node 인터셉터로 네트워크 레벨 가로채기
  → fetch든 axios든 상관없음
  → 브라우저 개발 환경과 Jest 환경 모두 동일한 핸들러 재사용
```

### fetch를 stub하면 "잘못된 요청"도 통과한다 — 요청 조립 이음새의 손실

구현 세부 종속 외에 손실이 하나 더 있다. `window.fetch`를 통째로 가짜로 바꾸면 앱이 요청을 **어떻게 조립하는지**(URL·헤더·바디 직렬화)가 검증에서 통째로 빠진다. 주소를 `/api/logn`으로 오타 내도 가짜 fetch는 정해둔 값을 돌려주므로 테스트는 초록불이다. 이는 mock이 진짜 이음새(seam — 내 코드와 바깥이 실제로 맞물리는 접합면)를 건너뛸 때 생기는 false confidence의 한 형태다.

끊는 지점이 **안쪽일수록 잃는 게 많다**. 로그인 함수를 통째로(`vi.mock('./login')`, 가장 안쪽) 끊으면 요청 조립부터 응답 파싱까지 다 잃고, 한 겹 바깥인 `window.fetch`에서 끊으면 요청 조립을 잃으며, 네트워크 문턱(MSW)에서 끊으면 그마저 지킨다. 이는 "mock은 얼마나 적게 하느냐보다 **어디서 끊느냐**가 관건이고, 잃는 확신의 양은 끊는 지점에 달렸다"는 일반 원칙([`../mocking/overview.md`](../mocking/overview.md)의 「mocking의 단점(비용)은 무엇인가?」)을 네트워크 mocking에 적용한 사례다.

MSW는 함수가 아니라 네트워크 문턱에서 요청을 가로채므로, 앱의 요청 조립 코드가 실제로 다 실행된다. 편지(요청)를 쓰는 것까지는 앱이 실제로 하고, 우체국 문턱에서만 MSW가 "내가 서버인 척 답장"한다. 요청이 틀리면 그 주소의 핸들러가 아예 안 불려 테스트가 (올바르게) 실패한다 — 요청 조립이라는 이음새를 지켜낸 것이다.

> If I get something wrong with the way I call `fetch`, then my server handler won't be called and my test (correctly) fails, which would save me from shipping broken code.

"내가 `fetch`를 호출하는 방식을 잘못 만들면 서버 핸들러가 안 불려 테스트가 (올바르게) 실패한다 — 덕분에 깨진 코드 배포를 막아준다." (Kent C. Dodds, stop-mocking-fetch)

#### 예: 로그인 흐름을 MSW로 검증

```tsx
const server = setupServer(
  http.post('/api/login', async ({ request }) => {
    const { email } = await request.json()      // 앱이 보낸 요청 본문을 실제로 읽는다
    return HttpResponse.json({ user: { name: 'Choe', email } })
  }),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('로그인하면 대시보드 인사말이 뜬다', async () => {
  const user = userEvent.setup()
  render(<LoginPage />)
  await user.type(screen.getByLabelText(/email/i), 'choe@ex.com')
  await user.type(screen.getByLabelText(/password/i), 'pw12345')
  await user.click(screen.getByRole('button', { name: /sign in/i }))
  expect(await screen.findByText(/welcome, choe/i)).toBeInTheDocument()
})
```

폼 입력·클릭·요청 조립·응답 렌더는 전부 실제 코드가 돌고, `/api/login` 네트워크 응답만 MSW가 대신한다. 요청 주소를 틀리면 핸들러가 안 불려 `findByText`가 실패한다.

```
mock을 어디서 끊나 — 안쪽일수록 잃는 이음새가 많다

[함수 통째로 끊기]  vi.mock('./login')  (가장 안쪽)
  앱 ✂️가짜 → 정해둔 값
  잃음: 요청 조립 + 응답 파싱까지 전부 ❌

[fetch 함수에서 끊기]
  앱 → (요청 조립) → window.fetch ✂️가짜 → 정해둔 값
                        ↑ 여기서 끊음
  잃음: 요청 조립(주소·바디) 검증 — 오타 나도 통과 ❌

[네트워크 문턱에서 끊기 (MSW)]
  앱 → (요청 조립) → fetch → 네트워크 ✂️MSW → 가짜 응답
                              ↑ 여기서 끊음
  지킴: 요청 조립까지 실제 실행 — 주소 틀리면 핸들러 안 불려 실패 ✅
```

---
## 종합

`window.fetch`를 stub하면 테스트가 구현 세부사항(어떤 HTTP 함수를 쓰는가)에 종속된다. MSW는 HTTP 핸들러를 선언해두면 RTL 테스트와 실제 브라우저 개발 환경 모두에서 재사용할 수 있다. `axios`를 `ky`로 교체해도, 서버 URL을 바꿔도 핸들러만 수정하면 된다. 네트워크를 가장 현실에 가깝게 시뮬레이션하면서도 실제 서버 의존성을 제거하는 최선책이다. 또한 fetch를 직접 stub하면 앱이 요청을 어떻게 조립하는지(주소·바디)까지 검증에서 빠지지만, 네트워크 경계에서 가로채는 MSW는 그 이음새를 지킨다.

---
# vi.mock·axios-mock-adapter처럼 모킹을 특정 도구·라이브러리에 얹으면 어떤 손해가 있으며, MSW는 이를 어떻게 해결하는가?

## 도입

프론트엔드 개발에서 "가짜 API"가 필요한 자리는 테스트 하나가 아니다. 백엔드가 아직 없을 때 화면부터 만들려면 개발 서버(`npm run dev`)에서도 가짜 응답이 필요하고, 프로덕션에서 터진 버그(예: 서버가 500을 뱉는 상황)를 브라우저에서 재현하려 해도 가짜 응답이 필요하며, Cypress·Playwright로 돌리는 E2E 테스트에서도 필요하다.

---
## 본문

> We are convinced that API mocking deserves a layer of its own in your application. Being able to control the network any time and anywhere may come in handy in various situations, such as testing network-related code or reproducing and debugging a particular network scenario. Such level of control is simply impossible when using API mocking as a feature of any other tooling because you will always be limited by that tooling. There are no limits with MSW.

"우리는 API mocking이 앱 안에서 그 자체의 계층(layer of its own)을 가질 자격이 있다고 확신한다. 네트워크를 언제 어디서나 제어할 수 있는 능력은 여러 상황에서 쓸모가 있다 — 네트워크 관련 코드를 테스트하거나, 특정 네트워크 시나리오를 재현·디버깅하는 것처럼. 그런 수준의 제어는 API mocking을 다른 도구의 한 기능(feature)으로 쓸 때는 애초에 불가능하다. 늘 그 도구에 제한되기 때문이다. MSW에는 그런 한계가 없다."

> We embrace the WHATWG Fetch API specification, meaning that each intercepted request is an actual Request instance, and each mocked response is an actual Response instance. We depend on semantics and standards instead of contriving custom APIs to satisfy particular use cases. We dedicate constant effort to minimize the amount of library-specific knowledge you need to have to use MSW. Instead, we rely on standard APIs and platform features so you would actually learn how to work with requests and responses.

"우리는 WHATWG Fetch API 명세를 받아들인다 — 가로챈 요청 하나하나가 실제 `Request` 인스턴스이고, 흉내 낸 응답 하나하나가 실제 `Response` 인스턴스다. 특정 쓰임을 위해 커스텀 API를 지어내는 대신 시맨틱과 표준에 기댄다. MSW를 쓰는 데 필요한 라이브러리 전용 지식을 최소화하려 애쓰고, 대신 표준 API와 플랫폼 기능에 기대므로 당신은 실제로 요청과 응답을 다루는 법을 배우게 된다."

이 답의 뼈대는 둘이다. **MSW는 모킹을 특정 도구의 부속 기능이 아니라 (A) 앱의 독립 계층에 두고, (B) 표준 API(WHATWG `Request`/`Response`)로 다룬다.** 왜 이게 중요한지는 "도구·라이브러리에 묶인 모킹"이 무엇을 잃는지를 봐야 드러난다.

### "특정 도구에 묶인다"가 실제로 무슨 뜻인가

우리가 흔히 쓰는 모킹 수단은 대부분 어떤 도구의 부속품이다.

- `jest.mock` / `vi.mock` — 테스트 러너(Jest/Vitest)의 기능이다. 그 러너가 돌 때만, 그 러너의 문법으로만 동작한다.
- `cy.intercept` — Cypress 전용이다. Cypress E2E 밖에서는 존재하지 않는다.
- `axios-mock-adapter` — axios 전용이다. axios 인스턴스에 어댑터로 끼워지는 물건이다.

이들의 공통점은 "모킹이 그 도구의 부속품"이라는 것이다. 그래서 **그 도구가 돌아가는 곳에서만, 그 도구의 문법으로만** 동작한다. 이 종속에서 세 가지 손해가 나온다.

#### 손해 (1) 환경 잠김 — 테스트 밖으로 못 나간다

`vi.mock`은 Vitest 테스트 프로세스 안에서만 실행된다. 그래서 이런 자리에서는 아예 못 쓴다.

- `npm run dev`로 브라우저에 앱을 띄워, 아직 없는 백엔드를 가짜로 채워가며 UI를 만드는 일. 개발 서버에는 Vitest가 없으니 `vi.mock`은 실행되지 않고, 요청은 그대로 진짜 서버로 나갔다가(백엔드가 없으면) 실패한다.
- 프로덕션 버그(예: 서버 500 응답)를 브라우저에서 재현·디버깅하는 일. 역시 테스트 프로세스가 아니므로 `vi.mock`이 낄 자리가 없다.

즉 모킹이 테스트라는 한 환경에 잠긴다.

#### 손해 (2) 재사용 불가 — 같은 API의 복사본이 여러 개 생긴다

Vitest 유닛테스트용으로 짠 가짜 `/api/user`를, Cypress E2E에도 쓰고 개발 서버에도 쓰고 싶다고 하자. 도구에 묶인 모킹은 이게 안 된다. Cypress에서는 `cy.intercept` 문법으로, 개발 서버에서는 또 다른 방식으로 **같은 API를 각 도구 문법으로 다시 짜야** 한다. 결과적으로 같은 엔드포인트에 대한 가짜 정의가 서너 벌 생기고, 하나를 고치면 나머지가 어긋난다.

#### 손해 (3) 능력 한계 — 도구가 볼 수 있는 범위가 좁다

- `axios-mock-adapter`는 axios가 보낸 호출만 잡는다. 코드 어딘가가 `fetch`를 직접 쓰면 그 요청은 어댑터의 시야 밖이라 그냥 새어 나간다.
- `jest.mock('axios')`는 axios 모듈을 통째로 가짜로 바꿔치기하는 **모듈 패치**다. 진짜 네트워크 스택(요청 조립·전송)이 아예 돌지 않으므로, 테스트에서의 동작과 프로덕션에서의 동작이 갈릴 수 있다.

#### 손해 (4) 지식 종속 — 배운 문법이 버려진다

`axios-mock-adapter`의 `mock.onGet('/users').reply(200, ...)` 같은 라이브러리 전용 문법(DSL)은 그 울타리 안에서만 통한다. axios를 fetch로 바꾸거나 목 라이브러리를 갈아타면 애써 외운 주문은 폐기되고, 무엇보다 **HTTP가 실제로 어떻게 도는지는 하나도 안 가르쳐준다**.

네 손해 모두 뿌리가 같다. 모킹이 **도구·라이브러리의 부속품**이라 그 도구의 자리·문법·시야에 갇힌다.

### MSW의 해결 — 모킹을 도구가 아니라 네트워크 레벨에 둔다

MSW는 모킹을 어떤 도구 안이 아니라 **요청이 실제로 나가는 지점(네트워크 레벨)의 독립 계층**에 둔다. 핸들러 파일(`handlers.ts`) 하나만 짜두면, 그 하나를 환경별 스위치에 끼워 어디서나 재사용한다.

```
                handlers.ts  (가짜 API 규칙 — 한 벌만 작성)
                     │
   ┌─────────────────┼──────────────────┐
   ▼                 ▼                  ▼
setupServer(...)  setupWorker(...)   (같은 handlers 재사용)
Jest/Vitest        브라우저 개발·        Cypress·Playwright
유닛테스트          Storybook           E2E
```

- Jest/Vitest 유닛테스트 → `setupServer(...handlers)` (Node)
- 브라우저 개발·Storybook → `setupWorker(...handlers)` (browser)
- Cypress/Playwright E2E → 같은 핸들러를 그대로 재사용

그리고 네트워크 레벨에서 잡으므로 요청을 보낸 도구가 axios든 fetch든 XHR이든 전부 걸린다. 이것이 OA의 "any time and anywhere", "There are no limits with MSW"의 실체다 — 모킹이 한 도구에 갇히지 않으니 시점(테스트·개발·디버깅)도 장소(Node·브라우저·E2E)도 가리지 않는다(손해 1·2·3을 푼다).

또 하나, 핸들러 안에서 만지는 것은 라이브러리가 지어낸 가짜가 아니라 **진짜 웹 표준 객체**다. 들어오는 요청은 실제 `Request`라 `request.headers.get('authorization')`·`await request.json()` 같은 **표준 메서드를 그대로** 쓰고, 응답은 실제 `Response`(WHATWG Fetch API)다. 그래서 "MSW를 배운다 = 웹 플랫폼을 배운다"가 되어, 그 지식은 `fetch`·Service Worker·Deno·Cloudflare Workers 어디서나 통한다(손해 4를 푼다). 그 증거로 MSW엔 `redirect(...)` 전용 헬퍼가 없다 — HTTP 표준 그대로 302 + `Location` 헤더 `Response`를 반환하면 끝이다.

비유하면, 도구에 묶인 모킹은 특정 차종에만 맞는 스페어타이어이자 그 공장에서만 통하는 특수 나사다 — 차를 나오면 못 끼우고 그 나사 지식도 쓸모없다. MSW는 도로(네트워크) 레벨에서 도는 규격 스페어타이어이자 어디서나 파는 규격 나사(표준 `Request`/`Response`)라, 한 번 익히면 어느 현장에서든 그대로 통한다.

