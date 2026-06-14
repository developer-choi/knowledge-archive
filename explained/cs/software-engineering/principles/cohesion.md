# 응집도(Cohesion)란 무엇인가?

## 도입

응집도는 모듈 안의 요소들이 "얼마나 한 가지 일을 위해 뭉쳐 있는가"를 나타내는 척도다. 높을수록 모듈 안의 모든 것이 하나의 목적을 향하고, 낮을수록 관계없는 것들이 억지로 한 파일에 들어있다. React 개발로 치면 하나의 컴포넌트 파일이 렌더링·데이터 패칭·날짜 포맷·결제 로직을 모두 담고 있다면 응집도가 낮은 것이다.

---

## 본문

> Cohesion refers to the degree to which the elements inside a module belong together.

"응집도는 모듈 안의 요소들이 서로 함께 속하는 정도를 가리킨다."

- **degree**: 이진(있다/없다)이 아니라 연속적인 척도다. "응집도가 높다/낮다"는 스펙트럼으로 표현한다.
- **elements**: 클래스 안의 메서드와 필드, 모듈 안의 함수와 변수 등 모듈을 구성하는 단위들.
- **belong together**: 같은 목적을 위해 존재하는가. 주문 처리 모듈에 날씨 조회 함수가 있다면 "함께 속한다"고 볼 수 없다.

> In object-oriented programming, a class is said to have high cohesion if the methods that serve the class are similar in many aspects.

"OOP에서 클래스를 위해 기능하는 메서드들이 많은 측면에서 유사하면 그 클래스는 응집도가 높다고 한다."

- **similar in many aspects**: 메서드들이 같은 데이터를 다루고, 같은 목적에 기여하고, 같은 변경 이유를 공유한다.

> Methods carry out a small number of related activities, by avoiding coarsely grained or unrelated sets of data.

"메서드들은 관련된 소수의 활동을 수행하며, 조잡하게 뭉쳐진 또는 관련 없는 데이터 집합을 피한다."

- **coarsely grained**: 너무 큰 단위. 한 메서드가 너무 많은 일을 하거나, 한 클래스가 너무 많은 개념을 담는 것.
- **unrelated sets of data**: 서로 관계없는 데이터를 같은 모듈이 들고 있는 것. 예: `UserUtils` 클래스가 사용자 데이터와 결제 내역을 동시에 조작한다면 관련 없는 데이터가 섞인 것이다.

> Related methods are in the same source file or otherwise grouped together; for example, in separate files but in the same sub-directory/folder.

"관련된 메서드들은 같은 소스 파일에 있거나 그 외의 방식으로 함께 묶인다. 예를 들어, 별개 파일이지만 같은 하위 디렉토리/폴더 안에 있는 것처럼."

FSD(Feature Slice Design)에서 하나의 feature 슬라이스 폴더 안에 컴포넌트·훅·API·타입을 모아두는 것이 이 원칙의 실천이다.

---

## 종합

응집도가 낮은 모듈은 "어디를 고쳐야 할지" 모르게 만든다. `utils.ts`에 날짜 포맷, API 호출, 색상 변환, 스크롤 제어가 모두 있다면, 날짜 관련 버그를 고치러 들어갔다가 다른 코드까지 영향받을 위험이 있다. 높은 응집도는 변경의 이유가 하나뿐인 모듈을 만든다 — 기획이 바뀌어도 딱 그 모듈 하나만 열면 된다. 기획이 바뀌어도 여기저기 수정하지 않아도 되는 이유가 바로 높은 응집도에서 온다.

---

---

# 높은 응집도가 왜 바람직한가?

## 도입

응집도를 높이는 것은 단순히 파일을 깔끔하게 정리하는 취향의 문제가 아니다. 소프트웨어의 구체적인 품질 속성들과 직결된다. OA는 네 가지 속성을 명시한다.

---

## 본문

> High cohesion is associated with several desirable software traits including robustness, reliability, reusability, and understandability.

"높은 응집도는 견고성, 신뢰성, 재사용성, 이해 가능성을 포함한 여러 바람직한 소프트웨어 특성과 연관된다."

- **robustness**: 견고성. 한 부분을 변경했을 때 다른 부분이 예상치 못하게 깨지지 않는 성질. 관련 있는 것만 모여 있으면 변경의 파급 범위가 좁다.
- **reliability**: 신뢰성. 모듈이 자신의 책임만 다루기 때문에 테스트하기 쉽고, 테스트가 쉬우면 버그를 일찍 잡는다.
- **reusability**: 재사용성. `formatDate()`만 하는 함수는 다른 맥락에서 가져다 쓸 수 있다. `formatDate() + submitForm() + logError()`가 한 덩어리라면 그 덩어리 전체를 들고 와야 해서 재사용이 어렵다.
- **understandability**: 이해 가능성. 하나의 목적만 하는 모듈은 이름만 봐도 무엇을 하는지 안다. `OrderProcessor`는 주문 처리를 한다는 것을 이름만으로 알 수 있다.

실무에서 가장 직접 체감하는 이점은 "기획 바뀌어서 여기수정 저기수정 안해도 됨"이다. 응집도가 높으면 변경의 이유가 하나이므로 수정 범위가 예측 가능하다.

---

## 종합

응집도가 낮으면 네 속성이 반대로 작동한다. 한 모듈이 여러 이유로 변경되면(robustness 저하), 변경마다 다른 책임에 버그가 생기고(reliability 저하), 관련 없는 것이 묶여 있어 일부만 꺼내 쓸 수 없고(reusability 저하), 파일을 열었을 때 무엇을 하는 곳인지 파악하기 어렵다(understandability 저하). ESLint 규칙 파일 하나가 린팅 규칙만 담고 있는 것, Redux slice가 하나의 도메인 상태만 관리하는 것이 모두 이 네 속성을 지키기 위한 선택이다.

---

---

# 응집도의 종류에는 무엇이 있는가?

## 도입

응집도는 단순히 "높다/낮다"가 아니라 어떤 이유로 요소들이 묶여 있는지에 따라 종류가 다르다. OA는 최악부터 시작해 점점 좋은 방향의 스펙트럼으로 분류한다.

---

## 본문

> Coincidental cohesion (worst) — Coincidental cohesion is when parts of a module are grouped arbitrarily. The only relationship between the parts is that they have been grouped together (e.g., a "Utilities" class).

"우연적 응집도(최악) — 모듈의 구성 요소들이 임의로 묶인 경우. 구성 요소들 사이의 유일한 관계는 함께 묶였다는 사실뿐이다. 예: 'Utilities' 클래스."

- **arbitrarily**: 임의로. 관계 없이 그냥 넣은 것. "일단 여기 넣자"가 반복되면 우연적 응집도가 쌓인다.
- **Utilities class**: 안티패턴의 전형. `formatDate`, `calcTax`, `sendEmail`, `parseCSV`가 한 파일에 있는 경우. `utils.ts` / `common.ts`에 온갖 함수를 다 넣는 것이 대표 사례다.

> Logical cohesion — Logical cohesion is when parts of a module are grouped because they are logically categorized to do the same thing even though they are different by nature (e.g., grouping all mouse and keyboard input handling routines or bundling all models, views, and controllers in separate folders in an MVC pattern).

"논리적 응집도 — 모듈의 구성 요소들이 본질적으로 다르지만 논리적으로 같은 일을 한다고 분류되어 묶인 경우. 예: 모든 마우스·키보드 입력 처리 루틴을 묶거나, MVC 패턴에서 모든 모델·뷰·컨트롤러를 별도 폴더에 묶는 것."

- **logically categorized**: "같은 종류"라는 범주로 묶는 것. "훅이니까 hooks/에", "컴포넌트니까 components/에" 하는 방식이 논리적 응집도다.
- **different by nature**: 실제로는 서로 다른 도메인·목적을 가진다. `hooks/useAuth.ts`와 `hooks/useCart.ts`는 훅이라는 공통점만 있을 뿐 인증과 장바구니라는 전혀 다른 도메인이다.

`hooks/`, `components/`, `types/`, `styles/` 폴더로 나누는 구조가 논리적 응집도의 예시다. 기술 타입으로 분류한 것이지 도메인으로 분류한 게 아니다.

```
우연적 응집도 (최악)          논리적 응집도
utils.ts                     hooks/
├── formatDate()             ├── useAuth()        ← 인증 도메인
├── calcTax()                ├── useCart()        ← 장바구니 도메인
├── sendEmail()              └── useAnimation()   ← UI 도메인
├── parseCSV()
└── scrollToTop()            기술 타입으로 묶음 (도메인 섞임)

             vs.

기능적 응집도 (이상적)
order/
├── OrderForm.tsx            ← 같은 도메인(주문)의
├── useOrderSubmit.ts           요소들이 함께
├── order.types.ts
└── order.api.ts
```

---

## 종합

논리적 응집도가 나쁜 건 아니지만, 도메인이 커질수록 `hooks/`에 아무 관계 없는 훅들이 쌓이고 어떤 것이 어디에 영향을 주는지 파악하기 어려워진다. FSD가 `hooks/`, `components/` 대신 feature 슬라이스 단위로 파일을 묶는 이유가 바로 논리적 응집도에서 기능적/도메인 응집도로 이동하기 위해서다. 응집도 종류를 알아두면 "왜 FSD가 기존 계층 분리보다 낫다고 하는가"에 대한 답을 언어로 설명할 수 있다.
