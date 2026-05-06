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
