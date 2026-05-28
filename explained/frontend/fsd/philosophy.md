# FSD에서 슬라이스란 무엇이며, 그 목적은?

## 도입

FSD의 레이어가 코드를 "역할별"로 나눈다면, 슬라이스는 그 레이어 안에서 코드를 "비즈니스 단위별"로 묶는다. 슬라이스의 핵심 특성은 독립성 — 같은 레이어 안의 다른 슬라이스를 참조하지 않는다.

---

## 본문

> Their main purpose is to group code by its meaning for the product, business, or just the application.

"슬라이스의 주요 목적은 코드를 제품, 비즈니스, 또는 애플리케이션 관점의 의미에 따라 그룹화하는 것이다."

- **meaning for the product/business**: 제품·비즈니스 관점의 의미. 기술적 분류(components, hooks)가 아니라 도메인 분류(user, post, auth)를 뜻한다.

> Slices are meant to be independent and highly cohesive groups of code files.

"슬라이스는 독립적이고 높은 응집도를 가진 코드 파일 그룹이어야 한다."

- **independent**: 독립적. 같은 레이어의 다른 슬라이스를 import하지 않아야 한다.
- **highly cohesive**: 높은 응집도. 같은 도메인과 관련된 파일(컴포넌트, API 함수, 모델)이 한 곳에 모여 있는 상태.

> Slices make your codebase easier to navigate by keeping logically related modules close together.

"슬라이스는 논리적으로 관련된 모듈을 가까이 모아 코드베이스 탐색을 쉽게 만든다."

- **logically related modules close together**: 관련 모듈을 가까이. `user`에 관한 컴포넌트, API 함수, 타입, 스토어가 모두 `entities/user/` 하나에 있어 한 곳에서 찾을 수 있다.

> Closely related slices can be structurally grouped in a folder, but they should exercise the same isolation rules as other slices — there should be no code sharing in that folder.

"밀접하게 관련된 슬라이스는 폴더로 구조적 그룹화를 할 수 있지만, 다른 슬라이스와 같은 격리 규칙을 적용해야 한다 — 그 폴더 안에서 코드 공유가 있어서는 안 된다."

- **structurally grouped**: 구조적 그룹화. `features/post/` 폴더 안에 `compose`, `like`, `delete` 슬라이스를 묶을 수 있다.
- **no code sharing**: 코드 공유 없음. 그룹핑 폴더는 순수한 파일 시스템 편의 — `features/post/shared-util.ts` 같은 파일을 두어선 안 된다.

```
features/
  post/                      ← 그룹핑 폴더 (순수 구조적)
    compose/                 ← 슬라이스 1 (독립)
      ui/, model/, api/
    like/                    ← 슬라이스 2 (독립)
      ui/, model/, api/
    delete/                  ← 슬라이스 3 (독립)
      ui/, model/, api/
  ← shared-util.ts 금지! ─────┘
```

---

## 종합

슬라이스의 본질은 "비즈니스 단위로 묶인 자급자족 코드 섬"이다. 이 섬은 다른 섬(같은 레이어의 다른 슬라이스)과 직접 연결되지 않아 독립적으로 삭제하거나 수정할 수 있다. 기존 `components/`, `hooks/` 폴더 방식은 auth를 하나 바꾸려면 여러 폴더를 왔다갔다 해야 했지만, 슬라이스 구조에서는 `features/auth/` 하나만 보면 된다.

---

---

# FSD에서 'components'나 'hooks' 같은 이름을 피해야 하는 이유는?

## 도입

세그먼트 이름은 파일의 "기술적 유형(무엇인가)"이 아니라 "목적(왜 있는가)"을 설명해야 한다. `components`는 "이것들은 컴포넌트다"라고 말하지만, 어디에 쓰이는 컴포넌트인지 알 수 없다.

---

## 본문

> The only important thing to remember when creating new segments is that segment names should describe purpose (the why), not essence (the what).

"새 세그먼트를 만들 때 기억해야 할 유일하게 중요한 것은 세그먼트 이름이 본질(무엇인가)이 아니라 목적(왜인가)을 설명해야 한다는 것이다."

- **purpose (the why)**: 목적. `ui` — "UI를 표시하기 위해 있다". `api` — "백엔드와 통신하기 위해 있다".
- **essence (the what)**: 본질. `components` — "컴포넌트다", `hooks` — "훅이다". 무엇인지만 말하고 왜인지는 말하지 않는다.

> Names like "components", "hooks", "modals" should not be used because they describe what these files are, but don't help to navigate the code inside.

"`components`, `hooks`, `modals` 같은 이름은 사용하지 않아야 한다. 이 파일들이 무엇인지를 설명하지만, 내부 코드를 탐색하는 데 도움이 안 되기 때문이다."

- **don't help to navigate**: 탐색에 도움이 안 됨. `features/auth/components/` 를 보면 auth 관련 컴포넌트가 있다는 건 알지만, 어떤 목적의 컴포넌트인지는 모른다. `features/auth/ui/`를 보면 "UI 표시용"이라는 목적이 명확하다.

> The problem manifests itself at least in violation of the principle of High Cohesion and excessive stretching of the axis of changes.

"문제는 최소한 높은 응집도 원칙 위반과 변경 축의 과도한 늘어남으로 나타난다."

- **axis of changes**: 변경 축. auth 기능 하나를 바꾸려면 `components/auth`, `hooks/auth`, `types/auth` 등 여러 폴더를 동시에 열어야 해서 변경 범위가 코드베이스 전역으로 늘어난다.

> Resist the temptation to create a shared/types folder, or to add a types segment to your slices. Files can also be a source of desegmentation. Avoid generic file names like types.ts, utils.ts, or helpers.ts.

"`shared/types` 폴더나 슬라이스에 `types` 세그먼트를 만들려는 충동을 참아라. 파일도 탈세그먼트의 원인이 될 수 있다. `types.ts`, `utils.ts`, `helpers.ts` 같은 일반적 파일명을 피하라."

- **desegmentation**: 탈세그먼트. 여러 도메인의 코드가 하나의 파일에 뭉치는 현상.
- **generic file names**: 일반적 파일명. `types.ts`는 어느 도메인의 타입인지 말하지 않아, 시간이 지나면 온갖 타입의 집합소가 된다.

---

## 종합

"기술 유형으로 분류"에서 "목적으로 분류"로의 전환이 FSD 세그먼트 명명의 핵심이다. `components/auth`에서 `features/auth/ui`로 바꾸는 것은 단순한 이름 변경이 아니라, "auth 관련 모든 것이 한 곳에"(응집도 향상) + "이 코드가 UI 표시를 위해 존재한다"(목적 명확화)를 동시에 달성하는 구조 변경이다. `types.ts`, `utils.ts` 같은 파일명도 같은 원칙이 적용된다 — 도메인을 반영한 이름(`user-types.ts`, `date-formatter.ts`)으로 교체해야 한다.

---

---

# 도메인이란 무엇인가?

## 도입

FSD에서 슬라이스는 "도메인 단위"로 구성된다. 그렇다면 도메인이 무엇인지를 먼저 이해해야 FSD의 슬라이스 경계를 제대로 판단할 수 있다.

---

## 본문

> Of primary importance is a domain of the software, the subject area to which the user applies a program.

"소프트웨어에서 가장 중요한 것은 도메인, 즉 사용자가 프로그램을 적용하는 주제 영역이다."

- **domain**: 도메인. 소프트웨어가 해결하는 현실 세계의 문제 영역. 쇼핑몰이라면 상품(product), 주문(order), 사용자(user), 결제(payment) 같은 개념들이 도메인을 구성한다.
- **subject area**: 주제 영역. 기술적 관심사(React, Redux, API)가 아니라 비즈니스 관심사(상품, 주문, 사용자).
- **user applies a program**: 사용자가 프로그램을 적용하는 영역. 소프트웨어는 항상 현실의 어떤 문제를 해결하기 위해 존재하며, 그 문제의 언어와 구조가 도메인이다.

```
도메인 예시 (쇼핑몰):
  product   상품 정보, 재고, 카테고리
  order     주문, 배송, 반품
  user      회원 가입, 로그인, 프로필
  payment   결제, 환불, 쿠폰

↓ FSD 슬라이스로 매핑

entities/product, entities/order, entities/user
features/add-to-cart, features/checkout, features/refund
```

---

## 종합

도메인은 소프트웨어가 해결하려는 현실 세계 문제의 언어다. FSD에서 슬라이스 이름이 도메인 개념(user, product, order)을 따르는 이유가 여기 있다. 기술 용어(component, hook, store)로 슬라이스를 만들면 "이 코드가 어떤 현실 문제를 다루는가"라는 질문에 답할 수 없게 된다. 도메인 개념을 이해하면 슬라이스 경계가 어디에 그어져야 하는지 자연스럽게 알 수 있다.

---

---

# FSD 공식 문서가 "변경에 최적화하지 말고, 삭제에 최적화하라"고 말하는 이유는 무엇인가?

## 도입

아키텍처 조언의 단골 문장은 "미래 변경에 유연하게 설계하라"다. FSD 공식 문서는 정반대 방향을 말한다 — 변경을 예측하려는 시도를 포기하고, 대신 코드를 쉽게 들어낼 수 있게 만들라.

---

## 본문

> No need to optimize for changes - we can't predict the future.

"변경에 최적화할 필요 없다 — 미래를 예측할 수 없기 때문이다."

- **can't predict the future**: 미래 예측 불가. "이 기능이 나중에 이렇게 바뀔 것 같다"는 가정 위에 만든 추상화는 대부분 틀린 방향으로 복잡성만 더한다.

> Better-optimize for deletion - based on the context that already exists.

"삭제에 최적화하는 것이 낫다 — 이미 존재하는 맥락에 기반하여."

- **optimize for deletion**: 삭제 최적화. 코드를 쉽게 들어낼 수 있는 구조. 슬라이스가 격리되어 있으면 해당 슬라이스 폴더를 통째로 삭제해도 다른 곳이 깨지지 않는다.
- **based on the context that already exists**: 이미 존재하는 맥락. 미래 추측이 아니라 지금 코드베이스의 실제 상태를 보고 결정한다.

```
변경에 최적화 (피해야 할 방향):
  "나중에 A가 B로 바뀔 수 있으니 추상화 레이어를 만들자"
  → 대부분 과잉 설계, 실제로 그 변경이 오지 않으면 복잡성만 남음

삭제에 최적화 (FSD 방향):
  "features/post-like/ 기능이 필요 없어지면 이 폴더 전체 삭제"
  → 단방향 의존성 + 슬라이스 격리가 보장되면 삭제가 안전
  → 나머지 코드는 영향 없음
```

---

## 종합

"변경에 최적화하라"는 조언이 나쁜 게 아니라, 실행 방식이 문제다. 미래 변경을 예측해 추상화를 미리 만드는 것은 예측이 틀리면 오히려 짐이 된다. FSD가 제안하는 삭제 최적화는 슬라이스 격리와 단방향 의존성을 통해 코드의 영향 범위를 좁히는 것이다 — 영향 범위가 좁으면 삭제도 안전하고, 결과적으로 리팩토링도 쉬워진다. "지금 필요한 것만 만들고, 필요 없어지면 안전하게 지울 수 있는 구조"가 FSD가 지향하는 아키텍처다.
