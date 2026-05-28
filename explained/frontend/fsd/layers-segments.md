# FSD에서 레이어의 목적과 각 레이어의 책임은 무엇인가?

## 도입

FSD는 6개의 레이어로 코드를 나눈다. 레이어를 나누는 기준은 두 가지 — 얼마나 많은 책임을 지는가, 앱의 다른 모듈에 얼마나 많이 의존하는가. 위로 갈수록 책임과 의존이 많고, 아래로 갈수록 좁고 독립적이다.

---

## 본문

> Their purpose is to separate code based on how much responsibility it needs and how many other modules in the app it depends on.

"레이어의 목적은 코드를 필요로 하는 책임의 양과 앱의 다른 모듈에 대한 의존 수에 기반해 분리하는 것이다."

- **responsibility**: 책임. App 레이어는 라우팅·전역 설정처럼 앱 전체에 영향을 주는 결정을 담당하고, Shared는 버튼 하나의 스타일처럼 협소한 책임만 진다.
- **depends on**: 의존. Pages는 Widgets, Features, Entities, Shared를 모두 쓸 수 있지만, Entities는 Shared만 참조할 수 있다.

> Every layer carries special semantic meaning to help you determine how much responsibility you should allocate to your code.

"모든 레이어는 코드에 얼마나 많은 책임을 할당해야 하는지 결정하는 데 도움이 되는 특별한 시맨틱 의미를 담고 있다."

- **semantic meaning**: 의미론적 의미. 레이어 이름이 단순한 폴더 이름이 아니라 "이 코드의 역할이 무엇인가"를 선언한다.

각 레이어의 책임:

- **App**: 앱이 동작하게 만드는 모든 것 — 라우팅, 진입점, 전역 스타일, providers. 기술적(context providers)·비즈니스적(analytics) 앱 전역 관심사.
- **Pages**: 완전한 페이지 또는 중첩 라우팅의 큰 파트. 재사용 안 되는 UI 블록은 페이지 슬라이스 안에 두어도 된다.
- **Widgets**: 완전한 use case를 제공하는 크고 독립적인 기능·UI 덩어리.
- **Features**: 사용자에게 비즈니스 가치를 주는 액션.
- **Entities**: 프로젝트가 다루는 비즈니스 엔티티 (user, product 등).
- **Shared**: 프로젝트/비즈니스 특성과 분리된 재사용 가능한 기능.

```
App          ← 라우터, 글로벌 스토어, 진입점
 └── Pages   ← /home, /profile (전체 화면)
      └── Widgets   ← HeaderWithUser, CommentSection (재사용 대형 블록)
           └── Features  ← FollowUser, LikePost (사용자 액션)
                └── Entities  ← User, Post, Comment (도메인 개념)
                     └── Shared  ← Button, Input, apiClient (범용 도구)

의존성: 위 → 아래만 허용
```

---

## 종합

레이어 구조의 핵심은 "코드를 어디 놓느냐"가 그 코드의 역할을 선언한다는 점이다. Features에 코드가 있으면 "이건 사용자 액션이다", Shared에 있으면 "이건 도메인 없이 어디서든 쓸 수 있다"는 뜻이다. 레이어가 없으면 같은 `components/` 폴더 안에 버튼 컴포넌트와 로그인 폼이 섞이고, 로그인 폼이 버튼을 쓰는 건지 버튼이 로그인 폼에 의존하는 건지 알 수 없게 된다. 레이어 구조는 이 질문에 구조적인 답을 강제한다.

---

---

# Widgets 레이어는 언제 사용하고 언제 피해야 하는가?

## 도입

Widgets는 FSD 6개 레이어 중 가장 선택적인 레이어다. 필수가 아니라 필요할 때만 쓰는 레이어이며, 잘못 쓰면 불필요한 구조 복잡성만 추가된다. 핵심 기준은 "여러 페이지에서 재사용되는가"이다.

---

## 본문

> The Widgets layer is intended for large self-sufficient blocks of UI. Widgets are most useful when they are reused across multiple pages, or when the page that they belong to has multiple large independent blocks, and this is one of them.

"Widgets 레이어는 크고 자급자족하는 UI 블록을 위해 설계됐다. 위젯은 여러 페이지에서 재사용되거나, 소속 페이지가 서로 독립적인 여러 큰 블록으로 구성되어 있고 이것이 그중 하나일 때 가장 유용하다."

- **large self-sufficient blocks**: 크고 자급자족하는 블록. 자체 데이터 페칭, 로딩 상태, 에러 처리까지 포함한 완결된 UI 단위.
- **reused across multiple pages**: 여러 페이지 재사용. Widgets 사용을 정당화하는 첫 번째 기준.

> If a block of UI makes up most of the interesting content on a page, and is never reused, it should not be a widget, and instead it should be placed directly inside that page.

"만약 UI 블록이 페이지의 주요 콘텐츠 대부분을 차지하고 절대 재사용되지 않는다면 위젯이 되어선 안 되고, 대신 해당 페이지 안에 직접 놓여야 한다."

- **makes up most of the interesting content**: 페이지의 핵심 콘텐츠 자체인 경우. 이 블록을 위젯으로 빼면 페이지 코드가 쉘만 남는 과잉 추상화가 된다.
- **never reused**: 재사용 없음. 재사용이 없다면 Widgets 분리가 유지 비용만 추가한다.

중첩 라우팅 팁: Remix나 Next.js의 중첩 라우팅을 쓸 때는 Widgets를 "미니 페이지"처럼 — 데이터 페칭, 로딩 상태, 에러 바운더리를 포함한 완전한 라우터 블록으로 활용할 수 있다.

---

## 종합

Widgets를 써야 할 때와 피해야 할 때를 한 줄로 정리하면: "이 UI 블록이 여러 페이지에서 쓰이거나, 한 페이지 안에서 서로 독립적인 큰 섹션들 중 하나"이면 Widgets, 그 외는 Pages 안에 직접 작성한다. 위젯 레이어를 만들지 않아도 FSD는 완전히 유효하다. 반대로 모든 UI를 위젯으로 빼는 과잉 추상화는 페이지를 의미 없는 조립 코드로만 만들어 코드를 읽기 어렵게 한다.

---

---

# 여러 페이지에서 재사용되는 큰 UI 블록을 Shared와 Widgets 중 어디에 놓아야 하는가?

## 도입

"재사용 가능한 UI니까 Shared에 놓자"는 직관이 틀릴 수 있다. Shared는 그 어떤 상위 레이어도 참조할 수 없기 때문에, Entities나 Features 코드가 필요한 UI 블록은 Shared에 넣을 수 없다.

---

## 본문

> There's a caveat to putting large blocks of UI in Shared — the Shared layer is not supposed to know about any of the layers above.

"Shared에 큰 UI 블록을 두는 것에는 주의점이 있다 — Shared 레이어는 위에 있는 어떤 레이어도 알 수 없어야 한다."

- **caveat**: 주의점, 단서. "Shared는 무조건 재사용 = Shared"라는 공식이 성립하지 않는다.
- **not supposed to know about**: 알면 안 된다. 의존 방향 위반을 의미한다.

> Between Shared and Pages there are three other layers: Entities, Features, and Widgets. Some projects may have something in those layers that they need in a large reusable block, and that means we can't put that reusable block in Shared, or else it would be importing from upper layers, which is prohibited.

"Shared와 Pages 사이에는 세 레이어가 있다: Entities, Features, Widgets. 일부 프로젝트는 그 레이어들의 코드를 큰 재사용 블록에서 필요로 할 수 있는데, 그러면 그 블록을 Shared에 넣을 수 없다 — 상위 레이어에서 import하게 되기 때문이다."

- **importing from upper layers**: 금지된 방향. Shared → Entities는 아래가 위를 참조하는 규칙 위반이다.

> That's where the Widgets layer comes in. It is located above Shared, Entities, and Features, so it can use them all.

"그곳이 바로 Widgets 레이어가 등장하는 자리다. Widgets은 Shared, Entities, Features 위에 위치하므로 이들 모두를 사용할 수 있다."

판단 기준:

```
이 UI 블록이 Entities/Features 코드를 필요로 하는가?
  ├── 예 → Widgets
  └── 아니오 → Shared

예시:
  단순 로고+링크 헤더          → Shared
  유저 아바타(entities/user)
  포함한 헤더                  → Widgets
```

---

## 종합

위치 결정의 핵심 질문은 "이 블록이 Entities나 Features의 코드가 필요한가?"다. 필요 없으면 Shared, 필요하면 Widgets가 유일한 선택이다. 이 구분을 무시하고 Entities 코드가 필요한 UI를 Shared에 넣으면 Shared → Entities import가 생겨 FSD 의존성 규칙이 깨진다. Widgets 레이어가 없다면 "재사용 가능하지만 도메인 코드가 필요한 블록"은 어디에도 놓을 수 없는 상황이 된다.

---

---

# FSD에서 Entities와 Features의 핵심 차이는 무엇인가?

## 도입

Entities와 Features의 구분은 FSD에서 가장 자주 혼동되는 부분이다. Entities는 앱이 다루는 "개념(명사)"이고, Features는 사용자가 그 개념으로 "무엇을 하는가(동사)"다.

---

## 본문

> An entity is a real-life concept that your app is working with. A feature is an interaction that provides real-life value to your app's users, the thing people want to do with your entities.

"엔티티는 앱이 다루는 현실 세계의 개념이다. 피처는 앱 사용자에게 현실적 가치를 제공하는 상호작용이며, 사람들이 엔티티로 하고 싶어 하는 것이다."

- **real-life concept**: 현실 세계 개념. user, post, product처럼 비즈니스 도메인의 명사.
- **interaction that provides real-life value**: 가치를 주는 상호작용. "팔로우하기", "게시글 좋아요", "상품 구매"처럼 사용자가 달성하려는 목표.
- **thing people want to do with your entities**: 엔티티로 하고 싶은 것. 엔티티는 대상이고 피처는 그 대상에 대한 행위다.

> Specifically for entities/ui, it is primarily meant to reuse the same appearance across several pages in the app, and different business logic may be attached to it through props or slots.

"특히 `entities/ui`는 주로 앱의 여러 페이지에서 같은 외형을 재사용하기 위한 것이며, 다양한 비즈니스 로직은 props나 슬롯을 통해 붙여질 수 있다."

- **same appearance**: 동일한 외형. 유저 카드가 어느 페이지에서 보더라도 같은 디자인.
- **business logic attached through props or slots**: 비즈니스 로직은 주입. 유저 카드는 "팔로우" 버튼을 자체 포함하지 않고, 상위 레이어에서 props로 주입받는다.

```
entities/user/
  ├── model/    user 타입, store, GET API 함수
  └── ui/       UserCard (외형만, 팔로우 버튼 없음)

features/follow-user/
  ├── api/      POST /follow 함수
  └── ui/       FollowButton (클릭 → API 호출)
    → UserCard에 props로 주입
```

---

## 종합

구분 기준을 한 줄로: Entities는 "데이터를 보여준다", Features는 "데이터를 변경하거나 액션을 실행한다". 엔티티 UI가 "팔로우" 같은 비즈니스 액션을 자체 포함하면, 그 엔티티는 특정 피처에 결합되어 다른 컨텍스트(예: 어드민 페이지)에서 재사용이 어려워진다. 모든 것을 피처로 만들 필요는 없다 — 여러 페이지에서 재사용되어야 피처로 분리할 가치가 있다.

---

---

# FSD에서 feature 슬라이스의 경계를 어떻게 판단하는가?

## 도입

feature 슬라이스가 점점 커지는 건 문제가 아니다. 문제는 "이 feature가 사용자에게 어떤 비즈니스 가치를 주는가"라는 질문에 답할 수 없을 때다.

---

## 본문

> One feature is one useful functionality for the user. When several features are implemented in one feature, this is a violation of borders.

"하나의 피처는 사용자에게 하나의 유용한 기능이다. 여러 피처가 하나의 피처에 구현되면 이는 경계 위반이다."

- **one useful functionality**: 단일 유용한 기능. "유용하다"는 기준이 핵심 — 사용자 관점의 달성 가능한 목표 하나.

> The feature can be indivisible and growing - and this is not bad. Bad - when the feature does not answer the question "What is the business value for the user?"

"피처는 분리 불가능하게 성장할 수 있다 — 이것은 나쁜 것이 아니다. 나쁜 것은 피처가 '사용자를 위한 비즈니스 가치가 무엇인가?'라는 질문에 답하지 못할 때다."

- **indivisible and growing**: 분리 불가능하게 성장. 피처가 커지는 것은 자연스럽다 — 경계가 잘못된 것이 문제다.
- **business value for the user**: 사용자 관점의 비즈니스 가치. 기술적 분류("지도 관련 코드")가 아니라 사용자 목표("회의실 예약하기")가 기준이다.

> There can be no "map-office" feature. But booking-meeting-on-the-map, search-for-an-employee, change-of-workplace - yes.

"`map-office` 피처는 있을 수 없다. 그러나 `booking-meeting-on-the-map`, `search-for-an-employee`, `change-of-workplace` — 이것들은 가능하다."

경계 판단 체크리스트:

```
"이 feature의 이름으로 사용자가 무엇을 달성하는지 한 문장으로 말할 수 있는가?"

  map-office → "지도 오피스를..." — 문장이 완성되지 않는다 → 영역/도메인이지 기능이 아님
  booking-meeting-on-the-map → "지도에서 회의실을 예약한다" → 명확한 사용자 목표 = 유효한 feature
```

---

## 종합

feature 경계는 코드 줄 수나 복잡도가 아니라 "사용자 목표 단위"로 정해진다. `map-office`는 도메인 이름이지 사용자 목표가 아니라서 feature가 될 수 없다. feature 슬라이스가 너무 크게 느껴진다면, "이 안에 사용자가 달성하려는 서로 다른 목표가 몇 개 있는가"를 세어보면 된다. 목표가 두 개 이상이면 분리할 시점이다.

---

---

# FSD에서 Entities 레이어를 만들지 않아도 되는가? 만든다면 언제 만들어야 하는가?

## 도입

FSD를 처음 배우면 Entities 레이어를 반드시 만들어야 한다고 오해하기 쉽다. 공식 문서는 반대를 말한다 — Entities는 필요할 때까지 만들지 않는 편이 낫다.

---

## 본문

> It is completely fine for the application to have no entities layer. It doesn't break FSD in any way, on the contrary, it simplifies the architecture and keeps the entities layer available for future scaling.

"애플리케이션에 entities 레이어가 없어도 완전히 괜찮다. 이것은 FSD를 어떤 방식으로도 깨지 않으며, 오히려 아키텍처를 단순화하고 entities 레이어를 미래 스케일링을 위해 열어둔다."

- **completely fine**: 완전히 괜찮음. 선택적이라는 강한 표현.
- **future scaling**: 미래 확장. 지금 Entities를 비워두면 필요할 때 더 안전하게 추출할 수 있다.

> FSD 2.1 encourages deferred decomposition of slices instead of preemptive, and this approach also extends to entities layer.

"FSD 2.1은 선제적 분해 대신 지연된 분해를 장려하며, 이 접근은 entities 레이어에도 적용된다."

- **deferred decomposition**: 지연 분해. 실제로 공유 필요성이 생겼을 때 추출한다.
- **preemptive**: 선제적. 필요하지도 않은데 미리 만들어 두는 과잉 설계.

> Remember: the later you move code to the entities layer, the less dangerous your potential refactors will be — code in Entities may affect functionality of any slice on higher layers.

"기억하라: 코드를 entities 레이어로 옮기는 시점이 늦을수록, 잠재적 리팩토링은 덜 위험하다 — Entities의 코드는 상위 레이어의 모든 슬라이스 기능에 영향을 줄 수 있기 때문이다."

- **may affect any slice on higher layers**: 상위 레이어 전체에 영향. Entities를 수정하면 이를 사용하는 Features, Widgets, Pages 모두가 영향을 받는다.

---

## 종합

Entities 레이어는 "여러 슬라이스가 실제로 같은 도메인 코드를 공유해야 할 때" 추출하는 레이어다. 처음부터 만들지 않고, 먼저 Pages나 Features의 `model` 세그먼트에 코드를 두다가 실제 공유 필요성이 생겼을 때 추출하는 방식이 권장된다. 특히 백엔드 로직이 많은 thin-client 앱이라면 Entities가 전혀 필요하지 않을 수도 있다. 나중에 추출할수록 실제 공유 패턴을 보고 경계를 결정하므로 리팩토링이 더 안전해진다.

---

---

# [UNVERIFIED] FSD에서 App과 Pages의 핵심 차이는 무엇인가?

## 도입

FSD 6개 레이어 중 App과 Pages는 나란히 최상단에 위치해 있어 처음 보면 역할이 겹쳐 보인다. 차이의 본질은 "앱 자체를 켜는 코드"와 "URL에 응답하는 화면 코드"의 구분이다. Next.js를 써본 적이 있다면 `_app.tsx`와 `pages/index.tsx`의 관계가 그 차이를 그대로 담고 있다.

---

## 본문

### App 레이어 — 앱 전체의 부트스트랩

App은 FSD에서 유일하게 **슬라이스가 없는** 레이어다. 단 하나, 전체 앱에 딱 한 번만 존재한다.

App 레이어가 담당하는 것:

- **라우터 설정**: 어떤 URL이 어떤 Page로 연결되는지 선언하는 곳. 라우터 자체를 정의하는 코드다.
- **전역 Provider**: `ThemeProvider`, `QueryClientProvider`, `Redux <Provider>`, `ErrorBoundary` 등 앱 전체를 감싸야 하는 컴포넌트들.
- **전역 스타일**: CSS reset, 글로벌 폰트, `body` 배경색 같은 앱 전체 스타일.
- **앱 진입점(entrypoint)**: `main.tsx`나 `index.tsx`처럼 React 트리를 DOM에 붙이는 코드.

```
App 레이어 (슬라이스 없음)
  ├── routes/       라우터 설정 (URL → Page 매핑)
  ├── store/        Redux store, QueryClient 같은 글로벌 스토어 초기화
  ├── styles/       global.css, reset.css
  └── entrypoint/   main.tsx — ReactDOM.createRoot(...)
```

App 레이어에 있는 코드는 다른 어떤 페이지나 슬라이스도 import하지 않는다 — 반대로, App은 모든 레이어를 import할 수 있지만 어떤 레이어도 App을 import해서는 안 된다. App은 의존성 계층의 가장 꼭대기이고, 동시에 사용자가 브라우저 탭을 열었을 때 가장 먼저 실행되는 코드다.

### Pages 레이어 — URL과 1:1 대응하는 화면 단위

Pages 레이어는 사용자가 브라우저 URL로 접근하는 각 화면을 슬라이스 단위로 관리한다.

- URL `/home` → `pages/home/` 슬라이스
- URL `/profile/:id` → `pages/profile/` 슬라이스
- URL `/settings` → `pages/settings/` 슬라이스

각 페이지 슬라이스는 독립적이다. `pages/home`은 `pages/profile`을 import할 수 없다(cross-import 금지). 한 페이지가 다른 페이지를 직접 참조하면 의존 방향이 뒤섞여 FSD 레이어 규칙이 깨진다.

페이지가 하는 일은 "조합"이다. Widgets, Features, Entities, Shared를 가져와서 이 URL에서 사용자에게 보여줄 화면을 만드는 것이다. 재사용이 안 되는 UI 블록은 굳이 Widget으로 빼지 않고 페이지 슬라이스 안에 두어도 된다.

```
pages/profile/
  ├── ui/           ProfilePage.tsx — UserCard + FollowButton + PostList 조합
  └── index.ts      Public API
```

### 차이 요약

```
비교 — App vs Pages

              App                          Pages
목적    앱 전체 부트스트랩·진입점          URL에 응답하는 화면 단위
슬라이스  없음 (앱에 하나만 존재)         있음 (URL마다 하나)
역할    라우터 정의·전역 Provider·진입점    Widgets/Features/Entities 조합
Next.js 비유  _app.tsx                   pages/<route>.tsx
import 방향  어떤 레이어도 App을 import 못 함  App이 Pages를 라우터에서 참조

의존 흐름:
App ─┐
     ↓
   Pages → Widgets → Features → Entities → Shared
```

---

## 종합

App과 Pages가 헷갈리는 이유는 둘 다 "화면 최상단 코드"처럼 보이기 때문이다. 하지만 역할은 완전히 다르다. App은 앱이 켜질 때 단 한 번 실행되는 초기화 코드 — React Provider를 씌우고 라우터를 붙여 앱을 세상에 내보내는 코드다. Pages는 그 라우터가 특정 URL을 받았을 때 진입하는 각각의 화면 코드다. App이 없으면 앱 자체가 뜨지 않고, Pages가 없으면 URL로 어떤 화면도 연결할 수 없다. 두 레이어는 역할이 겹치는 게 아니라 순서 관계다 — App이 Pages를 라우터에 등록하고, 사용자 요청이 Pages로 진입한다.

---

---

# FSD에서 세그먼트란 무엇이며, 각 세그먼트의 역할은?

## 도입

레이어가 코드를 "도메인 역할(무엇을 위한가)"로 나누고, 슬라이스가 "비즈니스 단위(어떤 도메인인가)"로 나눈다면, 세그먼트는 그 안에서 "기술적 성격(어떤 종류의 코드인가)"으로 파일을 분류한다.

---

## 본문

> Their purpose is to group code by its technical nature.

"세그먼트의 목적은 코드를 기술적 성격에 따라 그룹화하는 것이다."

- **technical nature**: 기술적 성격. "이 코드가 React 컴포넌트인가, API 함수인가, 데이터 모델인가"를 기준으로 분류한다.

> Make sure that the name of these segments describes the purpose of the content, not its essence.

"세그먼트 이름이 내용의 본질이 아니라 목적을 설명하도록 해야 한다."

- **purpose (why)**: 목적. `ui`는 "UI를 표시하기 위한 코드"라는 목적.
- **essence (what)**: 본질. `components`는 "React 컴포넌트들"이라는 기술 유형만 설명하며 목적은 없다.

세그먼트별 역할:

- **ui**: UI 표시와 관련된 모든 것 — UI 컴포넌트, 날짜 포매터, 스타일 등.
- **api**: 백엔드 상호작용 — 요청 함수, 데이터 타입, 매퍼 등.
- **model**: 데이터 모델 — 스키마, 인터페이스, 스토어, 비즈니스 로직.
- **lib**: 이 슬라이스의 다른 모듈이 필요로 하는 라이브러리 코드. 각 라이브러리는 하나의 집중 영역(날짜, 색상, 텍스트 조작 등)을 가져야 한다.
- **config**: 설정 파일과 피처 플래그.

```
features/follow-user/
  ├── api/        POST /follow, 타입, 매퍼
  ├── model/      followStore, useFollowState
  ├── ui/         FollowButton, FollowCount
  └── lib/        날짜 계산 같은 슬라이스 전용 유틸
```

---

## 종합

세그먼트는 슬라이스 안에서 파일을 찾는 속도를 높이기 위한 약속이다. `ui`를 찾으면 컴포넌트가 있고, `api`를 찾으면 fetch 함수가 있다는 것을 팀 모두가 알 수 있다. `components/`, `hooks/`, `types/` 같은 이름은 이 약속을 깨는 대표적인 안티패턴이다 — 이름이 "무엇인가(컴포넌트, 훅, 타입)"만 말하고 "왜(어떤 목적으로)"는 말해주지 않기 때문이다.

---

---

# FSD 슬라이스에서 Public API의 역할과 리팩토링 지원 방식은?

## 도입

FSD에서 슬라이스 내부를 외부가 직접 import하면, 내부 구조를 바꿀 때 외부 코드가 모두 깨진다. Public API는 이 결합을 끊는 계약층이다.

---

## 본문

> A public API is a contract between a group of modules, like a slice, and the code that uses it. It also acts as a gate, only allowing access to certain objects, and only through that public API.

"Public API는 슬라이스 같은 모듈 그룹과 그것을 사용하는 코드 사이의 계약이다. 또한 게이트 역할을 하여 특정 객체에 대한 접근만 허용하고, 오직 그 Public API를 통해서만 접근하도록 한다."

- **contract**: 계약. 슬라이스가 외부에 보장하는 인터페이스. 내부를 바꿔도 계약이 유지되면 외부는 영향 없다.
- **gate**: 게이트. 내부의 모든 것이 노출되는 게 아니라 선택된 것만 통과시킨다.

> This enables freedom in refactoring code inside a slice as long as the contract with the outside world (i.e. the public API) stays the same. The rest of the application must be protected from structural changes to the slice, like a refactoring. Only the necessary parts of the slice should be exposed.

"이것은 외부 세계와의 계약(즉 public API)이 동일하게 유지되는 한 슬라이스 내부 코드를 자유롭게 리팩토링할 수 있게 해준다. 나머지 애플리케이션은 리팩토링 같은 슬라이스의 구조적 변경으로부터 보호받아야 한다. 슬라이스의 필요한 부분만 노출되어야 한다."

- **freedom in refactoring**: 리팩토링 자유. `features/follow-user/ui/FollowButton.tsx`를 `features/follow-user/ui/components/FollowButton.tsx`로 이동해도 `index.ts`만 업데이트하면 외부는 무관하다.

> When they are in the same slice, always use relative imports and write the full import path. When they are in different slices, always use absolute imports, for example, with an alias.

"같은 슬라이스 안이면 항상 상대 경로 import를 쓰고 전체 import 경로를 적는다. 다른 슬라이스면 항상 절대 경로 import를 사용한다."

- **relative imports**: 상대 경로. 슬라이스 내부에서는 `../model`처럼 직접 파일을 참조한다.
- **absolute imports**: 절대 경로. 외부에서는 `@features/follow-user`처럼 슬라이스의 Public API(index.ts)를 통해서만 접근한다.

```ts
// features/follow-user/index.ts (Public API)
export { FollowButton } from './ui/FollowButton'
export { useFollowUser } from './model/useFollowUser'
// 내부 구현 파일은 노출 안 함

// 외부에서 사용
import { FollowButton } from '@features/follow-user'  // ✅

// 슬라이스 내부 직접 접근 금지
import { FollowButton } from '@features/follow-user/ui/FollowButton'  // ❌
```

---

## 종합

Public API가 없으면 외부가 슬라이스 내부 어느 파일이든 직접 import할 수 있게 되어, 내부 구조가 사실상 공개 계약이 된다. 파일 하나를 이동하면 이를 참조하는 외부 파일을 전부 찾아 고쳐야 한다. index.ts 하나를 통해서만 접근하도록 강제하면, 리팩토링 범위가 슬라이스 내부로 국한되고 외부는 변경 없이 그대로 동작한다.

---

---

# FSD에서 Shared 레이어와 도메인 레이어의 Public API 전략은 어떻게 다른가?

## 도입

Shared와 도메인 레이어(Entities, Features 등)는 export 규모와 용도가 달라서 Public API 구성 방식도 다르다. Shared는 세그먼트별 분리, 도메인은 슬라이스별 단일 index가 권장 패턴이다.

---

## 본문

> For the Shared layer that has no slices, it's usually more convenient to define a separate public API for each segment as opposed to defining one single index of everything in Shared. This keeps imports from Shared naturally organized by intent.

"슬라이스가 없는 Shared 레이어에서는, Shared의 모든 것을 하나의 단일 index로 정의하는 것보다 각 세그먼트별로 별도 Public API를 정의하는 것이 보통 더 편리하다. 이것은 Shared로부터의 import를 자연스럽게 의도별로 정리한다."

- **no slices**: 슬라이스 없음. Shared는 도메인 구분 없이 세그먼트(`ui`, `api`, `lib`)로만 구성된다.
- **organized by intent**: 의도별 정리. `import { Button } from 'shared/ui'`를 보면 "UI 요소다"라는 것을 즉시 알 수 있다.

> For other layers that have slices, the opposite is true — it's usually more practical to define one index per slice and let the slice decide its own set of segments that is unknown to the outside world because other layers usually have a lot less exports.

"슬라이스가 있는 다른 레이어에서는 반대가 맞다 — 슬라이스당 하나의 index를 정의하고 슬라이스가 외부 세계에는 알려지지 않는 자체 세그먼트 집합을 결정하도록 하는 것이 보통 더 실용적이다."

- **one index per slice**: 슬라이스당 단일 index. `entities/user/index.ts` 하나에서 user 슬라이스의 모든 공개 항목을 관리한다.
- **unknown to the outside world**: 외부에 알려지지 않음. 내부가 `model/`, `ui/`, `api/` 세그먼트로 나뉘어 있어도 외부는 `entities/user`만 알면 된다.

```ts
// Shared: 세그먼트별 분리
import { Button, Input } from 'shared/ui'
import { apiClient } from 'shared/api'

// 도메인 레이어: 슬라이스별 단일 index
import { User, useUserStore } from 'entities/user'
import { FollowButton } from 'features/follow-user'
// 내부 세그먼트 구조는 외부에 감춰짐
```

---

## 종합

Shared가 세그먼트별 분리를 쓰는 이유는 export가 많아서다 — 하나의 `shared/index.ts`에 Button부터 apiClient까지 섞이면 어디서 무엇을 찾아야 하는지 알 수 없다. 반면 도메인 레이어는 슬라이스당 export 수가 적고, 슬라이스 내부 세그먼트 구조를 캡슐화하는 것이 리팩토링 자유를 보장하는 핵심이다. 번들 크기 최적화가 필요하면 `shared/ui/button/index.ts`처럼 컴포넌트별로 더 세분화할 수 있다.

---

---

# FSD에서 Public API에 와일드카드 re-export를 피해야 하는 이유는?

## 도입

슬라이스 개발 초기에는 `export * from './ui'` 같은 와일드카드 re-export가 편리해 보인다. 새 파일을 추가하면 자동으로 노출되니까. 그러나 이 편의는 두 가지 심각한 문제를 가져온다.

---

## 본문

> This hurts the discoverability of a slice because you can't easily tell what the interface of this slice is.

"이것은 슬라이스의 발견 가능성을 해친다. 이 슬라이스의 인터페이스가 무엇인지 쉽게 알 수 없기 때문이다."

- **discoverability**: 발견 가능성. 코드를 읽는 사람이 "이 슬라이스에서 뭘 가져다 쓸 수 있는가"를 빠르게 파악하는 능력.
- **can't easily tell**: 쉽게 알 수 없음. `export *`면 실제로 무엇이 노출되는지 알려면 모든 파일을 뒤져야 한다.

> Not knowing the interface means that you have to dig deep into the code of a slice to understand how to integrate it.

"인터페이스를 모른다는 것은 어떻게 통합해야 하는지 이해하기 위해 슬라이스 코드 깊이 파고들어야 한다는 뜻이다."

- **dig deep**: 깊이 파고들다. 명시적 export 목록이 있으면 index.ts 한 파일만 보면 되지만, 와일드카드면 소스 파일 전체를 읽어야 한다.

> Another problem is that you might accidentally expose the module internals, which will make refactoring difficult if someone starts depending on them.

"또 다른 문제는 모듈 내부를 실수로 노출할 수 있다는 것이다. 누군가 그것에 의존하기 시작하면 리팩토링이 어려워진다."

- **accidentally expose**: 실수로 노출. 내부 구현용 헬퍼가 의도치 않게 public이 되어버리는 상황.
- **if someone starts depending on them**: 누군가 의존하기 시작하면. 의도하지 않게 노출된 내부에 외부가 의존하면 그것을 지울 때 외부 코드가 깨진다.

---

## 종합

Public API의 가치는 "명시적으로 선택한 것만 노출한다"는 데 있다. 와일드카드 re-export는 이 선택을 포기하는 것이다. 명시적 export 목록을 유지하면 index.ts를 보는 것만으로 슬라이스의 공개 계약이 무엇인지 파악할 수 있고, 내부를 리팩토링해도 외부에 영향을 줄 수 있는 범위를 통제할 수 있다. 슬라이스 초기에는 번거롭더라도 명시적 export 습관을 들이는 것이 장기적으로 낫다.
