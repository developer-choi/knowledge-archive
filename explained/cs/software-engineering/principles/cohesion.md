# 응집도(Cohesion)란 무엇인가?

> Cohesion refers to the degree to which the elements inside a module belong together.
> In object-oriented programming, a class is said to have high cohesion if the methods that serve the class are similar in many aspects.
> The functionalities embedded in a class, accessed through its methods, have much in common.
> Methods carry out a small number of related activities, by avoiding coarsely grained or unrelated sets of data.
> Related methods are in the same source file or otherwise grouped together; for example, in separate files but in the same sub-directory/folder.

---

**도입**

응집도는 "한 파일/모듈 안에 모인 코드들이 얼마나 한 가지 일을 위해 모여 있는가"를 잰 척도입니다. 한 파일을 열었을 때 들어 있는 함수들이 모두 같은 목적을 향해 있으면 응집도가 높고, 잡다하게 섞여 있으면 낮습니다. 프론트엔드에서는 컴포넌트·hook·utils 모듈을 어떻게 쪼갤지의 기본 기준이 됩니다.

---

**본문**

> Cohesion refers to the degree to which the elements inside a module belong together.

응집도란, 한 모듈 안에 있는 요소들이 얼마나 함께 속해 있는지를 나타내는 정도이다.

- **degree (정도)**: 0/1의 이분이 아니라 스펙트럼. "응집도가 높다 / 낮다"는 상대적 표현입니다.
- **elements inside a module**: 모듈(파일·클래스·폴더) 안의 함수·변수·클래스 같은 구성 요소들.
- **belong together**: 한 자리에 같이 있는 게 자연스러운 관계. "왜 이 함수들이 같은 파일에 있나?"를 물었을 때 한 마디로 답할 수 있어야 응집도가 높은 것.

> In object-oriented programming, a class is said to have high cohesion

객체지향 프로그래밍에서, 한 클래스가 high cohesion을 갖는다고 말할 때는

- **high cohesion**: 응집도가 높은 상태. 자바·C# 중심으로 정의되었지만 JS의 클래스/모듈에도 그대로 적용됩니다.

> if the methods that serve the class are similar in many aspects.

그 클래스를 위해 일하는 메서드들이 여러 측면에서 비슷할 때이다.

- **methods that serve the class**: 클래스의 메서드들. 그 클래스의 책임을 수행하는 함수들.
- **similar in many aspects**: 다루는 데이터·역할·추상화 수준이 비슷함. `User` 클래스의 메서드들이 모두 사용자 관련 동작이면 응집도가 높고, 사용자 + 결제 + 메일 발송이 섞여 있으면 낮음.

> The functionalities embedded in a class, accessed through its methods, have much in common.

클래스에 박혀 있고 메서드를 통해 접근되는 기능들이 공통점이 많다.

- **functionalities embedded**: 클래스에 내장된 기능들. 외부에서 직접 접근하는 게 아니라 메서드를 통해 노출되는 행위들.
- **have much in common**: 다루는 도메인이 같다는 뜻. `class Cart`라면 모든 메서드가 장바구니 도메인의 일부여야 합니다.

> Methods carry out a small number of related activities,

메서드들은 적은 수의 관련된 활동을 수행한다.

- **a small number of**: 책임 범위가 좁다는 강조. 한 클래스가 100가지를 다 한다면 그 자체로 응집도가 낮은 신호.
- **related activities**: 관련된 행위들. 예: `addItem`, `removeItem`, `getTotal`은 모두 장바구니 관련 활동으로 묶입니다.

> by avoiding coarsely grained or unrelated sets of data.

거칠게 묶였거나 무관한 데이터 집합을 피함으로써.

- **coarsely grained**: 입자가 너무 큰 것. "User and Order and Email Service All-in-One" 같은 거대한 묶음. 입자가 크면 그 안에 잡다한 게 다 들어옵니다.
- **unrelated sets of data**: 서로 무관한 데이터들. `class UserAndPaymentManager`는 사용자 데이터와 결제 데이터가 한 클래스에 섞여 있어 응집도가 낮습니다.

> Related methods are in the same source file or otherwise grouped together;

관련된 메서드들은 같은 소스 파일에 있거나, 그렇지 않다면 다른 방식으로 함께 묶인다.

- **same source file**: 가장 강한 묶음. 한 `.ts` 파일에 같이 있는 함수들.
- **grouped together**: 파일이 다르더라도 같은 폴더·같은 모듈 경로 등으로 묶일 수 있다는 의미.

> for example, in separate files but in the same sub-directory/folder.

예를 들어, 서로 다른 파일이지만 같은 하위 디렉터리/폴더에 있는 경우.

- **same sub-directory**: 폴더가 모듈의 경계 역할. 프론트엔드 프로젝트의 `src/features/cart/` 안에 `Cart.tsx`, `useCart.ts`, `cart-utils.ts`가 함께 있으면 폴더 단위로 응집도가 형성된 것.

---

**종합**

응집도가 높은 구조 vs 낮은 구조를 한 표로 정리하면:

| 응집도 | 형태 | JS 예시 |
|---|---|---|
| 높음 | 한 모듈이 한 가지 책임 | `useCart.ts` — 장바구니 상태와 관련 액션만 |
| 낮음 | 한 모듈이 여러 무관한 책임 | `utils.ts` — 날짜·문자열·로깅·HTTP 다 들어감 |

프론트엔드 프로젝트에서 응집도를 자주 마주치는 곳:

- **컴포넌트 분리**: `<UserProfileCard />` 안에 사용자 정보 + 결제 내역 + 알림 설정이 다 박혀 있으면 낮은 응집도. 책임별로 컴포넌트를 쪼개면 높아집니다.
- **hooks**: `useCart()` 하나가 장바구니 상태·결제 상태·메일 발송까지 다루면 낮은 응집도. `useCart`, `useCheckout`, `useNotification`로 분리.
- **폴더 구조**: 도메인별 폴더(`features/cart/`, `features/checkout/`)는 폴더 단위 응집도를 만듭니다. 반대로 `components/`, `utils/`, `helpers/`처럼 기술 종류별로 묶으면 도메인 응집도가 흩어집니다.

오개념 예방: "한 파일에 함수가 적으면 응집도가 높다"는 잘못된 추론입니다. 함수 수가 아니라 **그 함수들이 한 책임을 향하느냐**가 기준. `cart.ts`에 함수 50개가 있어도 모두 장바구니 관련이면 응집도가 높고, 함수 5개라도 5개가 다 다른 도메인이면 낮습니다.

이게 없으면 어떻게 되는가: 응집도가 무너진 모듈은 변경의 진원지가 됩니다. 한 모듈을 바꿀 일이 생겼을 때 무관한 다른 기능까지 같은 파일에서 만나게 되어 사고 위험이 늘어나고, 코드 리뷰에서도 변경 의도가 흐려집니다. 응집도는 "변경을 국소화할 수 있는 능력"의 다른 이름입니다.

---

# 높은 응집도가 왜 바람직한가?

> High cohesion is associated with several desirable software traits including robustness, reliability, reusability, and understandability.

---

**도입**

앞 질문에서 응집도란 "한 모듈 안의 요소들이 얼마나 함께 속해 있는가"라는 정도를 봤습니다. 그럼 응집도가 높으면 뭐가 좋을까요? Wikipedia는 네 가지 바람직한 성질을 같이 묶어 제시합니다 — 견고성, 신뢰성, 재사용성, 이해 용이성.

---

**본문**

> High cohesion is associated with several desirable software traits

높은 응집도는 여러 바람직한 소프트웨어 특성과 연관된다.

- **associated with**: "유발한다"가 아니라 "함께 나타나는 경향이 있다". 응집도 하나만 올린다고 자동으로 다 좋아지진 않지만, 응집도가 높은 코드에서 이 특성들이 같이 관찰됩니다.
- **desirable software traits**: 소프트웨어 품질 속성들 중 가지고 싶은 것들. 추상적 가치가 아니라 변경 비용·버그 발생률 같은 실제 지표로 드러납니다.

> including robustness, reliability, reusability, and understandability.

견고성, 신뢰성, 재사용성, 이해 용이성을 포함하여.

- **robustness (견고성)**: 예기치 못한 입력이나 환경 변화에도 잘 깨지지 않는 성질. 응집도가 높으면 한 모듈 변경의 파급이 좁아 인접 코드가 깨질 위험이 줄어듭니다.
- **reliability (신뢰성)**: 의도대로 동작한다는 신뢰. 한 책임에 집중된 모듈은 테스트 범위가 명확해 검증이 쉽고 버그가 적습니다.
- **reusability (재사용성)**: 다른 곳에서 가져다 쓸 수 있는 성질. 한 가지 일만 하는 모듈은 가져다 쓰기 쉽지만, 잡다한 책임이 섞인 모듈은 가져다 쓸 때 원치 않는 의존성이 딸려옵니다.
- **understandability (이해 용이성)**: 읽고 이해하기 쉬운 성질. 파일을 열었을 때 "이 파일이 무엇을 위한 파일인가"가 한 줄로 답해지면 이해가 빠릅니다.

---

**종합**

네 가지 특성이 응집도와 어떻게 연결되는지 풀어보면:

| 특성 | 응집도가 높을 때의 효과 | 프론트엔드 예시 |
|---|---|---|
| robustness | 변경 영향 반경이 좁음 | `useCart` 수정해도 `useAuth`가 안 깨짐 |
| reliability | 책임이 명확해 테스트 커버리지 잡기 쉬움 | `formatPrice` 함수 한 가지 책임만 → 단위 테스트 명확 |
| reusability | 의존성이 적어 떼어 쓰기 쉬움 | 한 가지 일 하는 hook은 다른 페이지로 옮기기 쉬움 |
| understandability | 파일 이름 → 내용 추측 가능 | `cart-utils.ts` 열기 전에 무엇이 들어 있을지 짐작 |

User Annotation에 등장한 표현이 핵심을 잘 짚습니다 — "기획 바뀌어서 여기수정 저기수정 안해도 됨." 응집도가 높으면 한 도메인의 기획 변경이 그 도메인 모듈 안에서 끝납니다. 응집도가 낮으면 "장바구니 정책이 바뀌었는데 결제 코드도 같이 만져야 한다"는 일이 생깁니다.

JS/React 맥락에서 자주 보이는 사례:

- **높은 응집도의 hook**: `useShoppingCart()`가 장바구니의 추가·삭제·총합 계산만 담당. 이 hook을 다른 페이지로 옮길 때 다른 의존성이 딸려오지 않음.
- **낮은 응집도의 hook**: `useEverything()`이 장바구니 + 사용자 정보 + 알림 설정 + 결제 처리를 다 함. 한 가지만 쓰고 싶어도 모든 의존성이 따라옴.
- **높은 응집도의 컴포넌트**: `<PriceTag />`가 가격 표시 한 가지만 담당. 다양한 곳에서 재사용.
- **낮은 응집도의 컴포넌트**: `<ProductBoxWithCartAndReviews />`가 상품·장바구니·리뷰를 한 컴포넌트에 다 박아놓음. 다른 화면에서 일부만 쓰기 어려움.

이게 없으면 어떻게 되는가: 응집도가 낮은 코드베이스는 시간이 지날수록 변경 비용이 폭발합니다. 한 줄 고치려고 7개 파일을 만져야 하고, 그중 2개에서 다른 기능이 깨집니다. 자연스럽게 "건드리지 말자" 문화가 자리 잡고 새 기능은 옆에 새 코드로 쌓이며, 결국 코드베이스가 망가져 가는 흔한 경로의 시작이 응집도 저하입니다.

오개념 예방: "응집도를 높이려면 모듈을 무조건 작게 쪼개라"는 단순 규칙은 위험합니다. 너무 잘게 쪼개면 모듈 간 결합도(다음 주제)가 늘어 그쪽에서 비용이 발생합니다. 응집도와 결합도는 항상 한 쌍으로 보고 균형을 잡아야 합니다.

---

# 응집도의 종류에는 무엇이 있는가?

> Coincidental cohesion (worst)
> Coincidental cohesion is when parts of a module are grouped arbitrarily.
> The only relationship between the parts is that they have been grouped together (e.g., a "Utilities" class).
>
> Logical cohesion
> Logical cohesion is when parts of a module are grouped because they are logically categorized to do the same thing even though they are different by nature (e.g., grouping all mouse and keyboard input handling routines or bundling all models, views, and controllers in separate folders in an MVC pattern).

---

**도입**

응집도는 0/1이 아니라 **종류**가 있습니다. 가장 나쁜 등급(worst)이 따로 정의되어 있을 정도로 등급이 명확. 이 문서는 그중 첫 두 단계 — Coincidental(우연적)과 Logical(논리적) — 을 다룹니다. 흔히 만나는 안티패턴과 그 한 단계 위 형태이니, 두 등급의 차이를 잡으면 자기 코드가 어디쯤 있는지 가늠할 수 있습니다.

---

**본문**

> Coincidental cohesion (worst)

우연적 응집도 (최악).

- **(worst)**: Wikipedia가 명시적으로 "최악"이라고 못 박은 등급. 아래 카테고리 중 가장 나쁜 형태.

> Coincidental cohesion is when parts of a module are grouped arbitrarily.

우연적 응집도란, 한 모듈의 부분들이 임의로 묶여 있을 때를 말한다.

- **arbitrarily**: 의미 있는 기준 없이, 아무렇게나. "파일이 너무 길어져서 새 파일이 필요했을 뿐", "어디 둘지 몰라서 여기 던져 놨음" 같은 사연이 전형.
- **이게 없으면 어떻게 되는가**: 모듈 이름만 보고는 안에 뭐가 들어 있을지 전혀 추측이 안 됩니다. 검색을 통해서만 함수를 찾을 수 있고, 변경 시 파급도 예측 불가.

> The only relationship between the parts is that they have been grouped together

부분들 사이의 유일한 관계는 함께 묶여 있다는 사실 그 자체뿐이다.

- **The only relationship**: 함께 있는 것 외에는 공통점이 없음. 도메인도 다르고, 데이터도 다르고, 추상화 수준도 다름.
- **이게 없으면 어떻게 되는가**: 묶음을 정당화하는 이유가 없으니 응집도가 사실상 0. "왜 이게 같은 파일에 있죠?"에 답이 안 됩니다.

> (e.g., a "Utilities" class).

예: "Utilities" 클래스.

- **"Utilities" class**: 가장 흔한 안티패턴 이름. JS 프로젝트의 `utils.ts`, `helpers.ts`, `common.ts`가 이 자리에 정확히 해당합니다. 날짜 포맷·문자열 처리·HTTP 헬퍼·로깅이 한 파일에 다 들어 있다면 우연적 응집도.

> Logical cohesion

논리적 응집도.

- **Logical**: 우연이 아니라 어떤 **논리적 분류 기준**에 따라 묶임. 우연적보다는 한 단계 위지만 이상적 등급은 아닙니다.

> Logical cohesion is when parts of a module are grouped because they are logically categorized to do the same thing

논리적 응집도란, 한 모듈의 부분들이 같은 일을 한다고 논리적으로 분류되어 묶일 때이다.

- **logically categorized**: 사람이 "이건 같은 카테고리야"라고 분류한 결과. 실제 동작이 같은 게 아니라, 추상적 분류가 같은 것.
- **to do the same thing**: 표면적으로 같은 종류의 일을 한다는 의미. "입력 처리", "포맷팅", "검증" 같은 추상적 카테고리.

> even though they are different by nature

비록 본질적으로는 서로 다르더라도.

- **different by nature**: 키보드 입력 처리와 마우스 입력 처리는 다루는 데이터·이벤트 모델이 전혀 다릅니다. 다만 "입력 처리"라는 추상적 우산 아래 묶일 뿐.

> (e.g., grouping all mouse and keyboard input handling routines

예: 모든 마우스·키보드 입력 처리 루틴을 한데 묶기.

- **mouse and keyboard input handling**: "입력 장치"라는 카테고리로 묶이지만, 실제로는 두 장치의 처리 로직이 거의 무관. 한 모듈을 만들면 mouse 변경이 keyboard 코드를 어색하게 끌어안고 있게 됩니다.

> or bundling all models, views, and controllers in separate folders in an MVC pattern).

또는 MVC 패턴에서 모든 모델·뷰·컨트롤러를 별도 폴더로 묶는 것.

- **separate folders in MVC**: `models/`, `views/`, `controllers/` 폴더 구조. "기술 종류별 묶음". 한 도메인(예: 주문)을 변경할 때 세 폴더를 모두 만져야 한다는 신호 — 도메인 응집도는 흩어집니다.

---

**종합**

두 등급을 한 표로 비교하면:

| 등급 | 묶는 기준 | 흔한 형태 | 위험 신호 |
|---|---|---|---|
| Coincidental (최악) | 기준 없음 | `utils.ts`, `common.ts`, "Utilities" class | 한 파일에 도메인이 다른 함수 30개 |
| Logical | 추상 카테고리 (기술 종류) | `models/`, `controllers/`, `hooks/` 폴더 | 도메인 변경 시 여러 폴더를 동시에 만짐 |

User Annotation의 예시가 자기 코드를 점검하는 체크리스트로 좋습니다.

**Coincidental cohesion 사례:**
- 하나의 static class 안에 온갖 메소드 다 집어넣기
- 하나의 `utils.ts` / `common.ts`에 온갖 함수 다 집어넣기

**Logical cohesion 사례:**
- hooks (전부 `hooks/` 폴더)
- components (전부 `components/` 폴더)
- types (전부 `types/` 폴더)
- styles (전부 `styles/` 폴더)

프론트엔드 프로젝트에서 자주 보는 두 폴더 구조:

```
// Logical cohesion (기술 종류별)
src/
  components/
    CartButton.tsx
    CheckoutForm.tsx
    UserProfile.tsx
  hooks/
    useCart.ts
    useCheckout.ts
    useAuth.ts
  utils/
    cart-utils.ts
    auth-utils.ts

// Higher cohesion (도메인별)
src/
  features/
    cart/
      CartButton.tsx
      useCart.ts
      cart-utils.ts
    checkout/
      CheckoutForm.tsx
      useCheckout.ts
    auth/
      UserProfile.tsx
      useAuth.ts
      auth-utils.ts
```

전자(Logical)는 "장바구니 정책 변경" 작업에서 `components/`, `hooks/`, `utils/`의 각각의 폴더를 다 열어야 합니다. 후자(도메인 응집)는 `features/cart/` 폴더 하나만 열면 됩니다.

오개념 예방 1: `utils.ts` 자체가 무조건 안티패턴은 아닙니다. 그 안에 들어 있는 함수들이 **공통된 한 가지 책임**을 가진다면 괜찮습니다. 예: `string-utils.ts`에 문자열 가공 함수 10개가 있으면 그건 functional cohesion에 가까운 형태. 위험은 "기준 없는 잡탕".

오개념 예방 2: Logical cohesion이 "나쁜 등급"이라고 받아들이지 마세요. Coincidental보다는 한 단계 위이고, 작은 프로젝트에서는 충분히 합리적입니다. 다만 프로젝트가 커지면 도메인 기반 폴더 구조(features/cart/ 같은)로 옮기는 게 응집도를 더 높이는 일반적 진화 경로.

응집도 등급은 위로 더 있습니다(Procedural, Communicational, Sequential, Functional이 정점). 본 질문은 가장 자주 안티패턴으로 만나는 두 등급에 집중한 것이고, 다음 질문(결합도)으로 넘어가면 같은 짝의 반대 축을 보게 됩니다.
