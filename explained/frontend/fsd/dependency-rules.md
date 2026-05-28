# 단방향 의존성 규칙이 왜 중요하고, 위반하면 어떤 일이 발생하는가?

## 도입

FSD는 레이어를 위에서 아래로만 참조하도록 강제한다. 위 레이어(pages)가 아래 레이어(features, entities)를 쓰는 것은 허용되지만, 반대 방향은 금지다. 이 규칙이 없으면 코드 수정 하나가 예상치 못한 다른 모듈을 동시에 깨뜨리기 시작한다.

---

## 본문

> A module on one layer cannot use other modules on the same layer, or the layers above.

"한 레이어의 모듈은 같은 레이어의 다른 모듈이나 더 위에 있는 레이어를 사용할 수 없다."

- **layer**: FSD가 강제하는 계층 구분. App → Pages → Widgets → Features → Entities → Shared 순으로 위에서 아래로 나열된다.
- **cannot use**: 완전한 금지. "해도 되면 좋지 않다"가 아니라 규칙 위반이다.

> The key difference of Feature-Sliced Design from an unregulated code structure is that pages cannot reference each other.

"FSD가 비규제 코드 구조와 다른 핵심은 pages가 서로를 참조할 수 없다는 점이다."

- **unregulated code structure**: 규칙 없이 자유롭게 import하는 기존 코드베이스. 모놀리식 `src/pages/`, `src/components/` 폴더 구조가 대표적이다.
- **cannot reference each other**: 같은 레이어 내 수평 참조 금지. pages/order가 pages/profile을 import하는 행위를 막는다.

> This allows you to make isolated modifications without unforeseen consequences to the rest of the app.

"이렇게 하면 앱의 나머지 부분에 예상치 못한 영향 없이 격리된 수정을 할 수 있다."

- **isolated modifications**: 한 슬라이스를 건드려도 다른 슬라이스가 깨지지 않는 상태. 의존성이 단방향이면 아래 레이어를 수정해도 그 영향이 위 레이어로만 올라가고, 같은 레이어 옆 슬라이스로는 번지지 않는다.
- **unforeseen consequences**: 예측하지 못한 부작용. 순환 참조나 수평 참조가 있으면 파일 A를 고쳤는데 파일 C가 깨지는 상황이 발생한다.

```
App
 └── Pages      ← pages끼리 서로 참조 금지 (수평 참조 불가)
      └── Features  ← features끼리 서로 참조 금지
           └── Entities  ← entities끼리 서로 참조 금지
                └── Shared  ← 모두 참조 가능 (단방향 종착점)

의존성 방향: 위 → 아래만 허용
```

---

## 종합

단방향 의존성 규칙은 FSD의 핵심 제약이다. 이 규칙이 없으면 pages/A가 pages/B를 참조하고 pages/B가 pages/A를 역참조하는 순환 참조가 자연스럽게 발생한다. 순환이 생기면 번들러가 모듈을 해석하지 못하거나, 한 파일을 수정할 때 의존 그래프 전체를 머릿속에 추적해야 한다. 단방향이 보장되면 `entities/user`를 수정할 때 영향 범위가 "이것을 사용하는 위 레이어(features, pages)만"으로 좁혀지므로, 리팩토링이 안전해지고 테스트 범위도 명확해진다.

---

---

# 같은 레이어 내에서 슬라이스끼리 참조가 금지된 이유는?

## 도입

FSD에서 슬라이스는 같은 레이어 안에서도 서로를 직접 import할 수 없다. `entities/user`가 `entities/post`를 직접 참조하면 안 된다는 규칙이다. 엔티티끼리 상호작용이 필요한 경우에는 상위 레이어(Features, Pages)에서 조립하도록 위임한다.

---

## 본문

> Slices cannot use other slices on the same layer, and that helps with high cohesion and low coupling.

"슬라이스는 같은 레이어의 다른 슬라이스를 사용할 수 없으며, 이는 높은 응집도와 낮은 결합도를 돕는다."

- **high cohesion**: 높은 응집도. 한 슬라이스 안에 관련 코드가 모여 있어서 파악이 쉬운 상태.
- **low coupling**: 낮은 결합도. 슬라이스 하나를 수정하거나 삭제해도 다른 슬라이스가 영향을 받지 않는 상태.

> Entities in FSD are slices, and by default, slices cannot know about each other.

"FSD에서 엔티티는 슬라이스이며, 기본적으로 슬라이스끼리는 서로를 알 수 없다."

- **by default**: 기본값. 예외를 두려면 명시적으로(`@x` 패턴 등) 선언해야 한다는 의미.

> In real life, however, entities often interact with each other, and sometimes one entity owns or contains other entities. Because of that, the business logic of these interactions is preferably kept in higher layers, like Features or Pages.

"그러나 현실에서는 엔티티끼리 서로 상호작용하고, 때로 한 엔티티가 다른 엔티티를 소유하거나 포함한다. 그 때문에 이런 상호작용의 비즈니스 로직은 Features나 Pages 같은 상위 레이어에 두는 것이 권장된다."

- **interact with each other**: 상호작용. 예: `Post`는 `User`를 참조하고, `Comment`는 `Post`와 `User` 모두를 참조해야 할 수 있다.
- **preferably kept in higher layers**: 상위 레이어 위임. 엔티티끼리 직접 연결하지 말고, 이를 조립하는 레이어로 올린다.

```
entities/user   entities/post
      │               │
      └──── 직접 참조 금지 ──────┘

대신:
features/post-with-author
  ├── entities/user   (각각 참조)
  └── entities/post   (각각 참조)
```

---

## 종합

같은 레이어의 슬라이스끼리 참조가 금지된 이유는 단순하다. A가 B를 참조하고 B가 A를 참조하면 순환 참조가 발생하고, A를 삭제하면 B가 깨진다. 슬라이스를 고립 단위로 유지하면 `entities/user`를 통째로 삭제하거나 교체해도 `entities/post`는 무관하다. 엔티티끼리 연결이 필요한 로직은 Features나 Pages에서 각각을 독립적으로 import해서 조립하면 되므로, 결합 없이도 협력이 가능하다.

---

---

# FSD에서 같은 레이어의 엔티티끼리 타입을 참조해야 할 때 어떻게 하는가?

## 도입

엔티티끼리 직접 참조는 금지지만, 실제 개발에서는 `Song` 타입이 `Artist` 타입을 포함해야 하는 상황이 생긴다. FSD는 이 문제를 두 가지 탈출구로 해결한다 — 제네릭 파라미터와 `@x` 크로스 임포트.

---

## 본문

> You can make your types accept type arguments as slots for connections with other entities, and even impose constraints on those slots.

"타입이 다른 엔티티와 연결을 위한 슬롯으로 타입 인자를 받도록 만들 수 있으며, 그 슬롯에 제약도 부여할 수 있다."

- **type arguments as slots**: 제네릭 파라미터. `Song<ArtistType>` 처럼 Artist 타입을 직접 import하지 않고 외부에서 주입받는다.
- **impose constraints**: 제약 부여. `ArtistType extends { id: string }` 처럼 슬롯에 허용 타입 조건을 건다.

> To make cross-imports between entities in FSD, you can use a special public API specifically for each slice that will be cross-importing.

"FSD에서 엔티티 간 크로스 임포트를 허용하려면, 크로스 임포트를 할 각 슬라이스에 특수한 Public API를 사용할 수 있다."

- **cross-imports**: 같은 레이어 슬라이스 간 임포트. 기본 규칙을 명시적으로 열어둔 경우에만 허용된다.
- **special public API**: `@x` 폴더 패턴. `entities/song/@x/artist.ts` 처럼 artist 슬라이스가 가져갈 수 있는 항목만 노출한다.

> Cross-imports are a code smell: a warning sign that slices are becoming coupled. Before reaching for @x, consider whether the boundaries should be merged instead.

"크로스 임포트는 코드 냄새다: 슬라이스가 결합되고 있다는 경고 신호다. `@x`를 사용하기 전에 경계를 합치는 것이 맞지 않은지 먼저 고려하라."

- **code smell**: 즉각적 버그는 아니지만 설계가 잘못됐다는 신호.
- **merged instead**: 두 엔티티가 밀접히 결합된다면 하나의 슬라이스로 합치는 것이 더 나은 선택일 수 있다.

```ts
// 방법 1: 제네릭 파라미터 (entities/song/model.ts)
interface Song<ArtistType extends { id: string }> {
  id: string
  title: string
  artist: ArtistType
}

// 상위 레이어에서 조립
import type { Song } from 'entities/song'
import type { Artist } from 'entities/artist'
type SongWithArtist = Song<Artist>

// 방법 2: @x 크로스 임포트 (entities/song/@x/artist.ts)
export type { Song } from '../model'

// entities/artist 내부에서
import type { Song } from 'entities/song/@x/artist'
```

---

## 종합

`@x` 패턴은 엔티티 간 불가피한 타입 연결을 위한 안전밸브다. 하지만 `@x` 폴더가 비대해지면 "이 엔티티가 너무 많은 곳에 연결되어 있다"는 신호이므로, 먼저 엔티티를 합칠 수 있는지 검토해야 한다. 제네릭 파라미터 방법은 import 없이 타입 연결이 가능해 더 깔끔하지만, 타입 복잡도가 올라간다. 어느 쪽을 골라도 "직접 import 없이 연결"이라는 원칙은 동일하다.

---

---

# FSD에서 인증 토큰을 Entities에 저장하면 어떤 아키텍처 문제가 발생하고, 어떻게 해결하는가?

## 도입

인증 토큰은 자연스럽게 `entities/user` 슬라이스에 저장하고 싶지만, API 클라이언트는 보통 `shared/api`에 있다. 이때 `shared/api`가 `entities/user`의 토큰을 읽으려면 Shared → Entities 방향의 import가 필요한데, 이는 하위 레이어가 상위 레이어를 참조하는 규칙 위반이다.

---

## 본문

> Since the API client is usually defined in shared/api or spreaded across the entities, the main challenge to this approach is making the token available to other requests that need it without breaking the import rule on layers: A module (file) in a slice can only import other slices when they are located on layers strictly below.

"API 클라이언트가 보통 `shared/api`에 정의되거나 엔티티 전반에 분산되어 있기 때문에, 이 접근의 핵심 과제는 레이어 import 규칙을 깨지 않으면서 토큰이 필요한 다른 요청들에게 토큰을 사용 가능하게 만드는 것이다."

- **spreaded across the entities**: 엔티티 전반에 분산. 각 도메인(user, product 등)이 자체 API 함수를 가지는 구조.
- **layers strictly below**: 엄격히 아래 레이어만. Shared는 어떤 레이어도 참조할 수 없다 — 아래에 레이어가 없기 때문이다.

> There are several solutions to this challenge: Pass the token manually every time you make a request / Expose the token to the entire app with a context or a global store like localStorage / Inject the token into the API client every time it changes

"이 과제에는 여러 해결책이 있다: 요청마다 토큰을 수동으로 전달 / context나 localStorage 같은 글로벌 저장소로 앱 전체에 토큰 노출 / 토큰이 변경될 때마다 API 클라이언트에 주입"

- **Pass the token manually**: 가장 단순하지만 모든 fetch 호출부에 토큰을 전달해야 해 번거롭다.
- **context or a global store**: 토큰 접근 키만 `shared/api`에 두고, 실제 값은 상위 레이어가 채워 넣는다. import 위반은 피하되 암묵적 의존이 생긴다.
- **Inject the token**: 반응형 구독으로 토큰 변경 시 API 클라이언트를 자동 업데이트한다. 구독 설정은 App 레이어에서 담당한다.

```ts
// 방법 3: 반응형 주입 (app/providers/api-setup.ts)
// App 레이어에서 토큰 변경을 구독 → shared/api에 주입
import { apiClient } from 'shared/api'
import { userStore } from 'entities/user'

userStore.subscribe((state) => {
  apiClient.setAuthToken(state.token)
})
```

---

## 종합

인증 토큰 문제는 FSD 의존성 규칙과 실제 비즈니스 요구가 충돌하는 대표적인 지점이다. 세 해결책 중 "반응형 주입"이 가장 FSD 철학에 부합한다 — 주입 설정 코드를 App 레이어에 두고, Shared와 Entities는 각자 독립적으로 유지한다. 수동 전달은 단순하지만 미들웨어 패턴과 맞지 않고, localStorage 방식은 직접 import를 피하되 암묵적 결합이 생긴다. 세 방법 모두 "Shared가 Entities를 import하지 않는다"는 규칙은 지킨다.
