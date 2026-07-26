# 단일 책임 원칙(SRP)이란 무엇인가?

## 도입

이 원칙은 이름 때문에 거의 항상 잘못 읽힌다. "단일 책임"이라는 말이 "하나의 모듈은 한 가지 일만 한다"로 들리기 때문이다. 그렇게 읽으면 SRP는 함수가 길어질 때 잘게 쪼개는 기술이 되고, 파일 개수를 늘리는 습관으로 굳는다.

원문의 진술은 그것과 다르다. "한 가지 일"이 아니라 **"변해야 할 이유가 하나"**다. 이 차이가 이 문서 전체를 지배하므로, 첫 문장에서부터 붙잡아두는 게 좋다.

이 원칙의 뿌리는 1972년 Parnas의 논문 "On the Criteria To Be Used in Decomposing Systems into Modules"에 있다. 거기서 나온 결론은 모듈을 흐름도(무엇을 먼저 하고 다음에 무엇을 하는가)가 아니라 **변할 법한 설계 결정**을 기준으로 나누고, 각 모듈이 그 결정을 다른 모듈로부터 감춰야 한다는 것이었다. "무엇을 하는가"가 아니라 "무엇이 바뀔 것인가"로 기준을 옮긴 그 자리가 SRP의 출발점이다.

---

## 본문

### 원문 조각 읽기

> The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change.

"단일 책임 원칙(SRP)은 각 소프트웨어 모듈이 변해야 할 이유를 오직 하나만 가져야 한다고 말한다."

- **module**: 클래스에 한정되지 않는다. 함수·파일·컴포넌트·패키지 어느 크기에도 같은 잣대가 걸린다.
- **one and only one**: "하나"를 두 번 말한 강조 표현이다. 그냥 `one`이라고만 썼다면 "적어도 하나"로 읽힐 여지가 있는데, `only`가 그 여지를 닫는다. 이유가 둘이면 이미 위반이다.
- **reason to change**: 이 원칙의 무게가 전부 실린 자리다. 모듈이 *하는 일*이 아니라 모듈이 *고쳐지게 만드는 사건*을 센다.

### "한 가지 일"과 "변해야 할 이유 하나"는 다르다

두 잣대가 같은 답을 내지 않는다는 걸 코드로 보는 게 가장 빠르다.

```js
// 하는 일로 세면 세 가지 — 그러나 변해야 할 이유는 하나다
function formatPrice(amount) {
  const rounded = Math.round(amount);            // 반올림
  const withComma = rounded.toLocaleString();    // 자릿수 구분
  return `${withComma}원`;                       // 단위 붙이기
}
```

이 함수는 "한 가지 일만 한다"는 잣대로는 위반처럼 보인다. 반올림하고, 콤마를 찍고, 단위를 붙이니 셋이다. 그런데 이 셋을 고치게 만드는 사건은 하나뿐이다 — **금액 표기 규칙이 바뀔 때**. 통화를 달러로 바꾸면 세 줄이 함께 바뀐다. 따로 바뀌는 일이 없으므로 나눌 이유도 없다.

반대 방향도 성립한다.

```js
// 하는 일로 세면 한 가지("상품 정보를 준비한다") — 그러나 변해야 할 이유는 둘이다
function getProductInfo(raw) {
  return {
    name: raw.product_name,                       // ← 서버 응답 형태가 바뀌면 고침
    price: `${raw.price_in_won.toLocaleString()}원`, // ← 표기 규칙이 바뀌면 고침
  };
}
```

이쪽은 "상품 정보를 준비한다"는 한 문장으로 설명되니 앞의 잣대는 통과한다. 그러나 서버 응답 필드명이 `product_name`에서 `title`로 바뀌는 사건과, 금액을 "12,000원"에서 "₩12,000"으로 바꾸는 사건은 서로 아무 상관 없이 따로 일어난다. 이유가 둘이므로 위반이다.

```
두 잣대가 어긋나는 자리

              "한 가지 일만 하는가"      "변해야 할 이유가 하나인가"
formatPrice        위반처럼 보임              통과 (표기 규칙 하나)
getProductInfo     통과처럼 보임              위반 (응답 형태 · 표기 규칙)
```

곧 "한 가지 일"은 SRP의 잣대가 아니다. 잣대로 쓰면 나눌 필요 없는 것을 나누고, 나눠야 할 것을 그대로 둔다.

### 이 잣대가 없으면 어떻게 되는가

세는 기준이 "하는 일"이면 판정이 사람마다 달라진다. `formatPrice`가 하는 일이 셋이라고도, 하나("가격을 문자열로 만든다")라고도 말할 수 있고, 둘 다 반박이 안 된다. 잣대가 말싸움으로 끝난다.

"변해야 할 이유"는 그렇지 않다. 세는 대상이 코드 바깥의 사건이라 확인할 수 있다 — 통화 표기가 바뀐 적이 있는가, 서버 응답이 바뀐 적이 있는가, 그때 이 파일을 열었는가. 지난 커밋 이력이 답을 갖고 있는 경우도 많다.

---

## 종합

원문이 말하는 것은 한 줄이다. 모듈은 **변해야 할 이유를 오직 하나만** 가져야 한다.

여기서 놓치기 쉬운 것이 세는 대상이다. SRP는 모듈이 하는 일의 개수를 세지 않고, 모듈을 고치게 만드는 **사건의 종류**를 센다. `one and only one`이라는 강조도 그 사건이 둘이 되는 순간을 겨눈 것이다.

기준을 이렇게 잡으면 판정이 코드 안이 아니라 코드 바깥을 본다. 함수가 몇 줄인지, 하는 일이 몇 가지인지가 아니라, 무엇이 바뀔 때 이 파일이 열리는지를 보는 것이다. Parnas가 "흐름도가 아니라 변할 법한 설계 결정을 기준으로 나눠라"라고 한 것이 이 시선이다.

그러면 다음 물음이 자동으로 따라온다 — 그 "변해야 할 이유"라는 게 대체 무엇인가. 버그를 고치는 것도 이유인가? 이어지는 질문이 그 자리를 판다.

---

# 버그를 고치거나 리팩터링하는 것도 모듈이 '변해야 할 이유'에 해당하는가?

## 도입

"변해야 할 이유가 하나"라는 잣대를 손에 쥐면 곧바로 막히는 지점이 있다. 코드가 바뀌는 사건을 열거해보면 버그 수정도 있고, 리팩터링도 있고, 라이브러리 업그레이드도 있다. 이것들까지 세면 어떤 모듈도 이유가 하나일 수 없다.

원문은 이 물음에 답하면서 동시에 "이유"라는 말의 정체를 드러낸다. 그 열쇠는 `reason to change`와 `responsibility`가 같은 것을 가리킨다는 데 있다.

---

## 본문

### 두 단어가 붙어 있다

> These questions can be answered by pointing out the coupling between the term "reason to change" and "responsibility".

"이 질문들은 '변해야 할 이유'라는 용어와 '책임'이라는 용어 사이의 결합을 짚음으로써 답할 수 있다."

- **coupling**: 여기서는 설계 용어가 아니라 일상적인 뜻의 "붙어 있음"이다. 두 용어가 실은 같은 것을 다른 각도에서 부르는 이름이라는 말이다.
- **responsibility**: 원칙 이름에 들어 있는 그 단어. "이유"를 세라고 해놓고 정작 원칙 이름은 "책임"인 이유가 여기 있다 — 둘이 같은 것이다.

### 버그 수정은 프로그램의 책임이 아니다

> Certainly the code is not responsible for bug fixes or refactoring.

"코드가 버그 수정이나 리팩터링에 대해 책임을 지는 것은 분명 아니다."

> Those things are the responsibility of the programmer, not of the program.

"그것들은 프로그램이 아니라 프로그래머의 책임이다."

- **not of the program**: 책임의 주체를 갈라놓는 구절이다. 버그가 있다는 것은 코드가 원래 지려던 책임을 못 지고 있다는 뜻이지, 새 책임이 생긴 게 아니다.

버그 수정과 리팩터링이 왜 빠지는지는 이렇게 보면 잡힌다.

- **버그 수정**: 원래 하기로 한 일을 못 하고 있으니 제자리로 돌려놓는 것이다. 요구가 바뀐 게 아니다.
- **리팩터링**: 겉으로 하는 일을 그대로 두고 안쪽 모양만 바꾸는 것이다. 요구는 아무것도 안 바뀌었다.
- **라이브러리 업그레이드**: 같은 결이다. 바깥에서 요구가 들어온 게 아니라 개발자가 판단해서 손대는 일이다.

이 셋은 모두 개발자 쪽에서 시작된다. SRP가 세는 이유는 **바깥에서 들어오는 요구**다.

### 물음의 방향이 꺾인다

> Or, perhaps a better question is: who is the program responsible to?

"혹은, 아마도 더 나은 질문은 이것이다 — 프로그램은 **누구에게** 책임을 지는가?"

- **responsible to**: 앞의 문장들이 쓴 `responsible for`(무엇에 대해 책임지는가)와 전치사 하나가 다르다. `for`는 대상이 일이고, `to`는 대상이 사람이다. 이 원칙의 방향 전환이 전치사 하나에 담겨 있다.

> Better yet: who must the design of the program respond to?

"더 나아가서 — 프로그램의 설계는 누구에게 **응답해야** 하는가?"

- **respond**: `responsible`의 어원이다. 라틴어 *respondere*(응답하다)에서 왔고, `response`·`response time`의 그 respond와 같은 뿌리다. 곧 "책임진다"는 말은 원래 **누군가의 부름에 응답한다**는 뜻이다.
- **design**: 코드 한 줄이 아니라 설계 전체가 응답 대상이라는 것. 어디에 선을 그을지가 "누구에게 응답할지"에 따라 정해진다.

```
물음이 꺾이는 자리

  responsible for  →  "이 모듈은 무엇을 하는가"     → 답이 코드 안에 있음
                           ↓ 방향 전환
  responsible to   →  "이 모듈은 누구에게 응답하는가" → 답이 코드 바깥(사람)에 있음
```

`respond`를 되짚으면 "이유"의 정체가 드러난다. 응답한다는 것은 부르는 쪽이 있다는 뜻이고, 부르는 쪽은 사람이다. 버그는 아무도 부르지 않았다 — 코드가 스스로 못 지킨 약속일 뿐이다.

---

## 종합

답은 아니오다. 버그 수정도 리팩터링도 SRP가 세는 '변해야 할 이유'에 들어가지 않는다. 그것들은 프로그램의 책임이 아니라 프로그래머의 책임이기 때문이다.

이 답이 중요한 건 판정을 구해주기 때문만은 아니다. 답을 내는 과정에서 물음의 방향이 꺾인다.

- `responsible for` — 이 모듈은 무엇에 대해 책임지는가. 답이 코드 안에 있다.
- `responsible to` — 이 모듈은 누구에게 책임지는가. 답이 코드 바깥에 있다.

`responsible`이 `respond`(응답하다)에서 왔다는 되짚기가 그 전환을 뒷받침한다. 응답에는 부르는 쪽이 필요하고, 버그는 부르는 쪽이 없다.

그래서 "변해야 할 이유"를 끝까지 따라가면 코드가 아니라 사람이 나온다. 다음 질문이 그것을 정면으로 말한다.

---

# 모듈의 경계는 무엇을 기준으로 그어야 하는가?

## 도입

앞에서 "누구에게 응답하는가"로 물음이 꺾였다. 그 답을 원문은 네 단어로 끝낸다 — 이 원칙은 사람에 관한 것이다.

설계 원칙을 이야기하다 갑자기 사람이 나오는 게 뜬금없어 보일 수 있는데, 앞의 흐름을 따라오면 필연이다. 변경은 저절로 일어나지 않는다. 누군가 요청해야 일어난다. 그러니 '변해야 할 이유'를 세는 것은 곧 **요청하는 사람의 갈래를 세는 것**이다.

---

## 본문

### 이 원칙은 사람에 관한 것이다

> This principle is about people.

"이 원칙은 사람에 관한 것이다."

- **people**: 코드도, 기능도, 계층도 아니다. 원문이 문장 하나를 통째로 이 선언에 쓴다는 점이 그 무게를 보여준다.

### 요청이 한 곳에서만 오게 만든다

> When you write a software module, you want to make sure that when changes are requested, those changes can only originate from a single person, or rather, a single tightly coupled group of people representing a single narrowly defined business function.

"소프트웨어 모듈을 작성할 때, 변경이 요청될 경우 그 변경이 오직 한 사람에게서, 더 정확히는 좁게 정의된 하나의 업무 기능을 대표하는 긴밀하게 결속된 하나의 사람 집단에서만 비롯되도록 보장하고 싶어 한다."

- **originate from**: "~에서 비롯된다". 변경이 코드에 도착하기 전에 어디서 출발했는지를 본다. 같은 코드 수정이라도 출발점이 다르면 다른 이유다.
- **a single person, or rather, a single ... group**: 한 사람이라고 말했다가 곧바로 집단으로 고쳐 잡는다. 현실에서 요청자는 개인이 아니라 팀·부서 단위이기 때문이다.
- **tightly coupled group**: 그 안에서는 의견이 하나로 모이는 집단. 서로 다른 요구를 내는 사람들이 한 이름 아래 묶여 있으면 이 조건을 못 채운다.
- **narrowly defined business function**: 좁게 정의된 업무 기능. "회사"나 "서비스"처럼 넓으면 그 안에 여러 요청자가 들어 있으므로 기준이 못 된다.

원문이 만든 이 개념을 흔히 **액터(actor)**라고 부른다. 변경을 요청하는 주체 한 갈래를 가리키는 이름이다.

### 조직의 복잡함을 모듈 바깥에 둔다

> You want to isolate your modules from the complexities of the organization as a whole, and design your systems such that each module is responsible (responds to) the needs of just that one business function.

"모듈을 조직 전체의 복잡함으로부터 격리하고, 각 모듈이 오직 그 하나의 업무 기능의 요구에만 책임지도록(응답하도록) 시스템을 설계하고 싶어 한다."

- **isolate ... from the complexities of the organization**: 조직이 복잡한 것은 어쩔 수 없지만, 그 복잡함이 파일 하나 안까지 들어오지는 않게 막는다는 뜻이다.
- **responsible (responds to)**: 원문이 괄호로 직접 바꿔 적는다. 앞 질문에서 짚은 어원 되짚기를 여기서 실행해 보이는 자리다.
- **just that one**: 여럿 중 하나가 아니라 오직 그 하나. 앞의 `one and only one`이 사람 쪽 표현으로 다시 나타난 것이다.

```
경계를 긋는 기준

  ❌ 기술 종류로 긋기          ❌ 크기로 긋기         ✅ 요청자로 긋기
  ┌──────────────┐            ┌──────────────┐      ┌──────────────┐
  │ 모든 유틸 함수 │            │ 200줄 넘으면  │      │ 마케팅이      │
  │ 모든 상수      │            │ 둘로 자름     │      │ 바꾸는 것     │
  └──────────────┘            └──────────────┘      ├──────────────┤
   서로 다른 사람이            어느 쪽을 열어도       │ 백엔드가      │
   같은 파일을 요청            두 요청자가 보임       │ 바꾸는 것     │
                                                    └──────────────┘
                                                     한 파일 = 한 요청자
```

### 프론트엔드에서 액터를 세어보기

조직도의 임원 이름은 프론트엔드 개발자의 일상이 아니지만, 요청이 서로 다른 곳에서 온다는 구조는 그대로 있다. 화면 하나를 만들 때 바꿔달라는 사람이 누구인지 세어보면 대개 이렇게 갈린다.

- **마케팅·기획** — 문구, 배지 노출 조건, 할인 정책
- **백엔드** — 응답 필드명, 타입, 엔드포인트
- **디자인 시스템** — 여백, 색, 타이포그래피, 컴포넌트 API

이 셋은 서로를 기다려주지 않고 각자의 일정으로 움직인다. 한 파일이 셋을 다 담고 있으면 그 파일은 세 곳에서 열린다.

---

## 종합

경계를 긋는 기준은 **요청하는 사람**이다. 파일 크기도, 기술 종류도, 하는 일의 개수도 아니다.

원문은 이 기준을 두 겹으로 말한다.

- **요청의 출발점이 하나여야 한다** (`originate from a single ... group`) — 변경 요청이 여러 갈래에서 이 모듈로 들어오면 이미 이유가 여럿이다.
- **모듈이 응답하는 대상도 하나여야 한다** (`responsible (responds to) ... just that one business function`) — 같은 말을 모듈 쪽에서 본 표현이다.

`isolate your modules from the complexities of the organization`이 목표를 압축한다. 조직이 복잡한 건 개발자가 어떻게 할 수 없지만, 그 복잡함이 코드 구조에 그대로 복사되게 두지는 않겠다는 것이다. 조직도를 그대로 베끼라는 말이 아니라, 조직의 얽힘이 파일 하나 안에서 재현되지 않게 하라는 말이다.

그러면 판정이 손에 잡히는 물음으로 바뀐다 — 이 파일을 고쳐달라고 말할 수 있는 사람이 몇 갈래인가. 다음 질문의 `Employee` 클래스가 그 물음을 그대로 적용한 사례다.

---

# 다음 Employee 클래스가 단일 책임 원칙을 어기는 이유를 설명하라

## 도입

앞에서 잡은 기준을 실제 코드에 대보는 자리다. 대상은 세 메서드를 가진 클래스 하나다.

```java
public class Employee {
  public Money calculatePay();
  public void save();
  public String reportHours();
}
```

겉보기에는 문제가 없다. 셋 다 직원(Employee)에 관한 일이고, 이름도 명확하고, 서로 겹치지도 않는다. "하나의 개념에 관한 것들을 모았다"는 점에서는 오히려 잘 짜인 클래스처럼 보인다.

그래서 이 예제가 좋다. **코드만 봐서는 위반이 보이지 않는다**는 것이 이 예제의 요점이기 때문이다. 판정하려면 코드 바깥을 봐야 한다.

---

## 본문

### 세 메서드가 하는 일

> The calculatePay method implements the algorithms that determine how much a particular employee should be paid, based on that employee's contract, status, hours worked, etc.

"calculatePay 메서드는 특정 직원의 계약, 신분, 근무 시간 등을 근거로 그 직원에게 얼마를 지급해야 하는지 결정하는 알고리즘을 구현한다."

- **algorithms**: 계산 규칙. 계약 조건이나 수당 규정이 바뀌면 이 규칙이 바뀐다.

> The 'save' method stores the data managed by the Employee object onto the enterprise database.

"save 메서드는 Employee 객체가 관리하는 데이터를 전사 데이터베이스에 저장한다."

- **enterprise database**: 회사 전체가 함께 쓰는 데이터베이스. 이 객체만의 저장소가 아니므로, 스키마나 저장 방식은 이 객체 바깥에서 정해진다.

> The reportHours method returns a string which is appended to a report that auditors use to ensure that employees are working the appropriate number of hours and are being paid the appropriate compensation.

"reportHours 메서드는 문자열을 반환하는데, 이 문자열은 감사자가 직원들이 적절한 시간만큼 일하고 적절한 보수를 받고 있는지 확인하는 데 쓰는 보고서에 덧붙여진다."

- **auditors**: 감사자. 회사가 규정과 법을 지키는지 확인하는 사람들이며, 급여를 계산하는 사람들과는 다른 집단이다.
- **appended to a report**: 보고서 형식이 이 메서드 바깥에서 정해진다는 뜻. 형식이 바뀌면 이 메서드가 따라 바뀐다.

### 판별법 — 잘못 만들어지면 누가 잘리는가

> Which of them would be fired by the CEO if that method were catastrophically mis-specified?

"그 메서드가 치명적으로 잘못 명세되었다면 그들 중 누가 CEO에게 해고당하겠는가?"

- **catastrophically mis-specified**: 사소한 버그가 아니라 명세 자체가 크게 잘못된 상황. 여기서 문제 삼는 건 구현 실수가 아니라 "무엇을 하기로 했는가"가 틀린 경우다.
- **fired**: 이 단어가 이 질문을 실용적으로 만든다. '책임'은 추상적이라 판정이 갈리지만, **누가 책임을 지고 잘리는가**는 대개 답이 하나다.

앞 질문에서 액터를 "좁게 정의된 하나의 업무 기능"이라고만 말했을 때는 판정이 여전히 막연했다. 이 물음이 그것을 손에 잡히는 형태로 바꾼다. 추상적인 "누구의 관심사인가" 대신, 사고가 났을 때 책임이 어디로 굴러가는지를 보는 것이다.

### 답 — 세 갈래로 갈린다

> So it stands to reason that when changes are made to the algorithm within the calculatePay method, the request for those changes will originate from the organization headed by the CFO.

"따라서 calculatePay 메서드 안의 알고리즘에 변경이 가해질 때, 그 변경 요청은 재무 총괄(CFO)이 이끄는 조직에서 비롯되리라는 것이 이치에 맞는다."

- **it stands to reason**: "이치에 맞는다". 규칙으로 정해진 게 아니라 앞의 사실들에서 자연히 따라 나온다는 표현이다.
- **organization headed by**: 개인이 아니라 그 사람이 이끄는 조직. 앞 질문의 "긴밀하게 결속된 하나의 집단"이 이 형태로 나타난다.

> Similarly it will be the COO's organization that will request changes to the reportHours method, and the CTOs organization that will request changes to the save method.

"마찬가지로 reportHours 메서드의 변경은 운영 총괄(COO)의 조직이, save 메서드의 변경은 기술 총괄(CTO)의 조직이 요청할 것이다."

```
Employee 클래스 하나가 섬기는 세 조직

                    ┌──────────────────────┐
   재무 총괄 조직 ──→ │ calculatePay()       │
   (급여 규정 변경)   │                      │
                    │                      │
   운영 총괄 조직 ──→ │ reportHours()        │  ← 파일 하나
   (감사 보고 형식)   │                      │
                    │                      │
   기술 총괄 조직 ──→ │ save()               │
   (DB 스키마 변경)   └──────────────────────┘

   변경 요청이 들어오는 문이 셋 = 변해야 할 이유가 셋
```

### 프론트엔드로 옮기면

같은 구조가 컴포넌트 하나에서 그대로 나타난다. 아래는 상품 카드 하나가 세 요청자를 동시에 섬기는 모습이다.

```jsx
function ProductCard({ raw }) {
  // ← 백엔드가 응답 필드명을 바꾸면 여기가 바뀐다
  const name = raw.product_name;
  const price = raw.price_in_won;

  // ← 마케팅이 할인 배지 조건을 바꾸면 여기가 바뀐다
  const showBadge = price >= 50000 && raw.category !== 'gift';

  // ← 디자인 시스템이 간격·색 규칙을 바꾸면 여기가 바뀐다
  return (
    <div style={{ padding: 16, gap: 8, border: '1px solid #eee' }}>
      <span>{name}</span>
      {showBadge && <em style={{ color: '#e00' }}>무료배송</em>}
    </div>
  );
}
```

`Employee`와 똑같이, 코드만 봐서는 이상한 데가 없다. 이름도 적절하고 길지도 않다. 그런데 이 파일을 고쳐달라고 말할 수 있는 사람이 세 갈래다.

"치명적으로 잘못 만들어졌으면 누가 잘리는가"를 대보면 갈래가 드러난다.

- 배지 조건이 틀려 5만원 미만 상품에 무료배송이 붙었다 → 정책을 정한 쪽이 책임진다
- 필드명을 잘못 읽어 상품명이 전부 빈칸으로 나갔다 → 응답 형태를 정한 쪽과 맞춰야 한다
- 여백이 디자인 규격과 다르다 → 디자인 시스템 쪽 규격 문제다

갈라놓으면 각 자리가 한 갈래만 섬긴다.

```js
// 백엔드 응답 형태만 아는 자리 — 필드명이 바뀌면 여기만 열린다
export function toProduct(raw) {
  return { name: raw.product_name, price: raw.price_in_won };
}
```

```js
// 정책만 아는 자리 — 배지 조건이 바뀌면 여기만 열린다
export function hasFreeShipping(product) {
  return product.price >= 50000 && product.category !== 'gift';
}
```

```jsx
// 표시만 하는 자리 — 디자인 규격이 바뀌면 여기만 열린다
function ProductCard({ product }) {
  return (
    <Card>
      <Text>{product.name}</Text>
      {hasFreeShipping(product) && <Badge>무료배송</Badge>}
    </Card>
  );
}
```

한 가지 주의할 점이 있다. **"액터가 다르다"가 곧 "파일을 나눠라"는 아니다.** 함수 하나짜리 파일이 늘어나면 그 사이를 잇는 코드와 따라가야 할 층도 함께 는다. 위 예에서 배지 조건이 한 줄이고 앞으로도 정책팀이 손댈 일이 없다면, 굳이 파일을 빼는 값이 안 나올 수도 있다. 판단 기준은 "액터가 몇인가"가 아니라 **"이 갈래들이 실제로 따로 바뀌어 왔는가"**다. 함께 바뀌는 것을 갈라놓으면 얻는 것 없이 값만 치른다.

---

## 종합

`Employee`가 SRP를 어기는 이유는 메서드가 셋이어서가 아니다. 그 셋의 **변경을 요청하는 조직이 셋**이기 때문이다.

- `calculatePay` — 재무 총괄 조직. 급여 규정이 바뀌면 요청이 온다.
- `reportHours` — 운영 총괄 조직. 감사 보고 형식이 바뀌면 요청이 온다.
- `save` — 기술 총괄 조직. 데이터베이스 사정이 바뀌면 요청이 온다.

이 예제가 교과서에 자주 오르는 건 **코드만 봐서는 위반이 안 보이기 때문**이다. 셋 다 직원에 관한 일이니 "한 가지 개념을 다룬다"는 잣대로는 통과한다. 조직도를 겹쳐놓아야 비로소 금이 보인다. 앞 질문에서 "SRP는 사람에 관한 것"이라고 한 말이 왜 그냥 수사가 아닌지가 여기서 확인된다.

`Which of them would be fired`가 이 문서에서 가장 실용적인 문장이다. '책임'이라는 말은 아무렇게나 늘어나지만, 사고가 났을 때 책임이 굴러가는 자리는 대개 하나로 특정된다. 프론트엔드에서도 똑같이 물을 수 있다 — 이게 잘못 나갔을 때 설명해야 하는 사람이 누구인가.

다만 갈래를 셌다고 자동으로 파일을 쪼개는 것이 답은 아니다. 실제로 따로 바뀌어온 갈래만 가르는 것이 값을 한다.

---

# 한 모듈이 서로 다른 요청자를 함께 섬기면 어떤 대가를 치르는가?

## 도입

앞 질문이 "왜 위반인가"였다면, 여기는 "그래서 무엇이 잘못되는가"다. 원칙을 어겨도 프로그램은 잘 돌아간다. `Employee` 클래스는 컴파일되고 테스트도 통과한다. 그러니 대가는 코드 안에서 나타나지 않고 사람 쪽에서 나타난다.

원문이 드는 비유가 그 성격을 잘 보여준다. 창문이 깨져 정비소에 차를 맡겼다. 창문은 고쳐져 돌아왔는데 이번엔 시동이 안 걸린다. 그 정비소에 다시 가지 않게 되는 건 수리 실력 때문이 아니라, **부탁하지 않은 곳이 망가졌기 때문**이다.

---

## 본문

### 남의 요청 때문에 다른 사람이 다친다

> Because we don't want to get the COO fired because we made a change requested by the CTO.

"기술 총괄이 요청한 변경을 우리가 반영했다는 이유로 운영 총괄이 해고당하게 만들고 싶지 않기 때문이다."

- **get the COO fired**: 앞 질문의 `fired` 판별법이 여기서 결과 쪽으로 뒤집혀 나온다. 판별할 때는 "누가 책임지는가"였고, 여기서는 "엉뚱한 사람이 책임지게 된다"이다.
- **a change requested by the CTO**: 요청한 쪽과 피해를 입는 쪽이 다르다는 것이 이 문장의 전부다.

### 무엇이 사람들을 가장 두렵게 하는가

> Nothing terrifies our customers and managers more that discovering that a program malfunctioned in a way that was, from their point of view, completely unrelated to the changes they requested.

"고객과 관리자를 가장 겁먹게 하는 것은, 그들이 요청한 변경과 자기들 관점에서는 완전히 무관한 방식으로 프로그램이 오작동했다는 사실을 발견하는 것이다."

- **Nothing ... more**: "이보다 더한 것은 없다". 최상급 표현으로, 여러 문제 중 이것이 가장 크다고 못 박는다.
- **from their point of view**: 이 구절이 핵심이다. 개발자에게는 두 메서드가 한 클래스에 있으니 연결이 보이지만, 요청한 사람에게는 급여 계산과 근무시간 보고 사이에 아무 관계가 없다. **연결이 요청자에게 보이지 않는다**는 것이 두려움의 원인이다.
- **malfunctioned**: 고장. 새 기능이 잘못된 게 아니라 잘 돌던 것이 망가진 상황이다.

정비소 비유가 그대로 겹친다. 정비공에게는 창문과 시동이 같은 전기 계통일 수 있지만, 차를 맡긴 사람에게 그 둘은 아무 상관 없는 부품이다.

### 그다음에 벌어지는 일

> If you change the calculatePay method, and inadvertently break the reportHours method; then the COO will start demanding that you never change the calculatePay method again.

"calculatePay 메서드를 고치다가 의도치 않게 reportHours 메서드를 망가뜨리면, 운영 총괄은 다시는 calculatePay 메서드를 건드리지 말라고 요구하기 시작할 것이다."

- **inadvertently**: 의도치 않게. 아무도 잘못한 사람이 없는데도 벌어진다는 점이 이 단어에 담겨 있다.
- **start demanding**: "요구하기 시작한다". 한 번의 항의로 끝나지 않고 그때부터 계속된다는 뜻이다.
- **never ... again**: 이 요구가 무엇을 의미하는지가 대가의 실체다. 코드의 한 구역이 **손댈 수 없는 땅**이 된다. 기술적으로는 아무 문제가 없는 코드인데 조직적으로 얼어붙는다.

```
대가가 자라나는 순서

  한 파일에 두 요청자
        ↓
  A의 요청으로 고침 → B가 쓰던 것이 깨짐
        ↓
  B: "내가 부탁하지도 않았는데 왜 내 것이 깨지나"
        ↓
  B: "그 파일은 다시는 건드리지 마라"
        ↓
  파일이 얼어붙음 → A의 요청도 못 받게 됨
```

마지막 줄이 이 비용의 정점이다. 처음에는 B가 다쳤을 뿐인데, 끝에서는 A도 요청을 못 하게 된다. 한 요청자를 다치게 한 값이 결국 모든 요청자에게 청구된다.

### 이유는 사람이다

> However, as you think about this principle, remember that the reasons for change are people.

"다만 이 원칙을 생각할 때, 변경의 이유는 사람이라는 것을 기억하라."

> It is people who request changes.

"변경을 요청하는 것은 사람이다."

- **It is people who**: 강조 구문이다. "사람이 요청한다"가 아니라 "요청하는 것은 다름 아닌 사람이다"에 가깝다. 이 문서에서 세 번째로 같은 말을 반복하는 자리이며, 그만큼 놓치기 쉬운 지점이라는 뜻이다.

> And you don't want to confuse those people, or yourself, by mixing together the code that many different people care about for different reasons.

"그리고 여러 사람이 서로 다른 이유로 신경 쓰는 코드를 한데 섞음으로써 그 사람들을, 또는 자신을 혼란스럽게 만들고 싶지 않을 것이다."

- **or yourself**: 피해자 목록에 개발자 본인이 들어간다. 섞인 코드를 고칠 때 "이걸 건드리면 누가 영향받지"를 매번 따져야 하는 것은 결국 고치는 사람의 부담이다.
- **care about for different reasons**: 같은 코드를 보고 있어도 보는 이유가 다르다는 것. 이 문서가 내내 말해온 '이유'가 여기서 사람의 관심으로 표현된다.

### 프론트엔드에서 이 일이 벌어지는 모습

앞 질문의 상품 카드로 돌아가 보면 순서가 그대로 재현된다.

```jsx
// 응답 필드명 변경 요청을 받아 raw.product_name → raw.title 로 고치던 중
const name = raw.title;
const price = raw.price;          // ← 단위가 원이 아니라 센트로 바뀌어 있었다
const showBadge = price >= 50000; // ← 배지 조건이 조용히 망가진다
```

요청한 쪽은 응답 형태만 바꿔달라고 했다. 그런데 배포 후 배지가 모든 상품에 붙는다. 정책을 정한 쪽에서는 자기가 아무것도 요청하지 않았는데 자기 화면이 망가진 것이다. 다음부터 그쪽은 "그 컴포넌트 건드릴 때는 미리 알려달라"고 요구하기 시작한다.

---

## 종합

대가는 코드가 아니라 **신뢰**로 청구된다. 프로그램은 여전히 컴파일되고, 대부분의 화면은 잘 돈다. 망가지는 것은 요청자와 개발자 사이의 관계다.

원문은 그 과정을 세 단계로 그린다.

- **엉뚱한 곳이 깨진다** — 한쪽 요청으로 고친 것이 다른 쪽이 쓰던 것을 망가뜨린다.
- **요청자에게는 연결이 안 보인다** (`from their point of view, completely unrelated`) — 그래서 사고가 아니라 배신처럼 느껴진다.
- **그 코드가 얼어붙는다** (`never change ... again`) — 다시는 건드리지 말라는 요구가 붙고, 결국 아무도 그 구역에 요청을 못 넣는다.

창문을 고쳐달라 했더니 시동이 안 걸리는 정비소 비유가 이 셋을 한 장면에 담는다. 다시 안 가게 되는 이유는 실력이 아니라 **예측 불가능함**이다.

마지막에 원문이 `or yourself`를 덧붙인 것도 봐둘 만하다. 이 원칙이 지켜주는 것은 요청자만이 아니다. 섞인 코드를 열 때마다 "여기 손대면 누구 것이 깨지지"를 따져야 하는 부담이 사라지는 쪽은 고치는 사람이다.

---

# 단일 책임 원칙을 응집도·결합도의 말로 바꾸면 어떻게 되는가?

## 도입

여기까지가 "사람"의 언어였다면, 이 질문은 같은 원칙을 **설계 용어**로 옮긴다.

응집도(모듈 안 요소들이 얼마나 함께 속하는가)와 결합도(모듈 사이 상호의존의 정도)는 이미 익숙한 척도다. 다만 그 정의만으로는 판정할 때 손이 잘 안 나간다. "함께 속한다"는 게 무엇인지, 얼마나 의존해야 강결합인지가 여전히 감에 맡겨지기 때문이다.

원문의 마지막 재표현이 그 자리에 **변경 이유**라는 축을 꽂는다. 두 척도가 하나의 물음으로 다시 세워진다.

---

## 본문

### 두 문장으로 압축된 원칙

> Gather together the things that change for the same reasons. Separate those things that change for different reasons.

"같은 이유로 변하는 것들은 모아라. 다른 이유로 변하는 것들은 떼어놓아라."

- **Gather together**: 모으라는 명령이 먼저 온다. SRP를 "쪼개는 원칙"으로만 아는 사람에게는 뜻밖의 순서다. 흩어진 것을 모으는 일도 이 원칙의 절반이다.
- **the same reasons / different reasons**: 두 문장이 정확히 대칭이고, 갈리는 지점은 오직 '이유'뿐이다. 크기도, 기술 종류도, 하는 일의 개수도 여기 없다.
- **Separate**: 갈라놓는다. 앞 문장과 방향이 반대인데 기준은 같다.

### 이것이 응집도·결합도의 다른 정의다

> If you think about this you'll realize that this is just another way to define cohesion and coupling.

"이것을 생각해보면 이는 응집도와 결합도를 정의하는 또 다른 방식일 뿐임을 알게 될 것이다."

- **just another way to define**: 새로운 개념을 도입하는 게 아니라 **이미 있는 개념을 다른 말로 적었다**는 선언이다. 응집도·결합도가 정적인 서술이라면, 여기서는 시간 축(무엇이 언제 함께 바뀌는가)이 들어온다.

> We want to increase the cohesion between things that change for the same reasons, and we want to decrease the coupling between those things that change for different reasons.

"우리는 같은 이유로 변하는 것들 사이의 응집도를 높이고, 다른 이유로 변하는 것들 사이의 결합도를 낮추고 싶어 한다."

- **increase the cohesion between things that change for the same reasons**: 응집도를 무조건 높이라는 게 아니다. **같은 이유로 변하는 것들 사이에서만** 높이라는 조건이 붙는다.
- **decrease the coupling between those that change for different reasons**: 결합도도 마찬가지다. 무조건 낮추는 게 아니라 다른 이유로 변하는 것들 사이에서 낮춘다.

조건절이 붙어 있다는 게 이 문장의 값이다. "응집도는 높이고 결합도는 낮춘다"만 외우면 어디의 응집도이고 무엇 사이의 결합도인지가 빠져 있어 실제 판단에 못 쓴다. 변경 이유가 그 빈칸을 채운다.

```
변경 이유라는 하나의 축으로 다시 세운 두 척도

                   같은 이유로 변함        다른 이유로 변함
                   ─────────────────      ─────────────────
   해야 할 일        모은다 (Gather)         뗀다 (Separate)
   조절할 척도       응집도를 높인다          결합도를 낮춘다
   확인 방법        "이게 바뀔 때            "이게 바뀔 때
                    저것도 늘 같이           저것도 같이 바뀐 적
                    바뀌는가" → 예            있는가" → 아니오여야 함
```

### 판정이 손에 잡히게 바뀐다

정적인 정의로는 답이 안 나오던 물음이 여기서는 답이 나온다.

```js
// 응집도가 높은가? — 정적인 정의로는 "관련 있어 보이니 높다"에서 멈춘다
export function formatDate(d) { /* ... */ }
export function formatPrice(n) { /* ... */ }
export function parseQueryString(s) { /* ... */ }
```

세 함수는 모두 "값을 다루는 유틸"이라 관련 있어 보인다. 변경 이유로 물으면 갈린다 — 날짜 표기 규칙이 바뀌는 사건, 통화 표기가 바뀌는 사건, URL 파라미터 규약이 바뀌는 사건은 서로 아무 상관 없이 일어난다. 함께 속한 게 아니다.

```js
// 반대 경우 — 파일은 떨어져 있지만 늘 함께 바뀐다
// api/order.ts   — 주문 API 응답 타입
// types/order.ts — 주문 도메인 타입
// 서버가 필드를 하나 추가하면 두 파일이 항상 같이 열린다
```

이쪽은 파일이 나뉘어 있어 겉보기에 결합도가 낮아 보인다. 그러나 늘 함께 바뀐다면 나눈 값을 못 하고 있다. `Gather together`가 가리키는 자리다.

### 없으면 어떻게 되는가

변경 이유라는 축이 빠지면 응집도·결합도가 취향 논쟁이 된다. "이 둘은 관련 있어 보인다"와 "따로 두는 게 깔끔하다"가 맞붙으면 근거가 없다.

축이 들어오면 물음이 사실 확인으로 바뀐다 — **이 둘이 지금까지 함께 바뀌어 왔는가.** 커밋 이력이 답을 갖고 있는 경우가 많고, 아니어도 "다음에 무엇이 바뀔 것 같은가"는 팀이 함께 답할 수 있는 물음이다.

---

## 종합

두 문장이 이 원칙의 실행 지침이다.

- **같은 이유로 변하는 것은 모은다** — 응집도를 높이는 일이다.
- **다른 이유로 변하는 것은 뗀다** — 결합도를 낮추는 일이다.

원문이 `just another way to define cohesion and coupling`이라고 못 박듯, 새 개념이 아니다. "모듈 안 요소들이 얼마나 함께 속하는가", "모듈 사이 상호의존의 정도"라는 기존 정의는 상태를 서술한다. 여기서는 같은 것을 **변경 이유**라는 하나의 축 위에 다시 세운다. 함께 속한다는 것은 곧 함께 바뀐다는 것이고, 의존한다는 것은 곧 한쪽이 바뀔 때 다른 쪽도 바뀐다는 것이다.

이 재표현이 하는 일은 조건절을 되살리는 것이다. 흔히 외는 "응집도는 높이고 결합도는 낮춰라"에는 어디의 응집도인지가 빠져 있다. 원문은 `between things that change for the same reasons`와 `between those that change for different reasons`를 각각 붙여 그 빈칸을 채운다.

그리고 이 두 문장은 앞에서 본 사람 이야기와 같은 말이다. '이유'를 끝까지 따라가면 요청하는 사람이 나오므로, "같은 이유로 변하는 것을 모아라"는 곧 **같은 사람이 요청하는 것을 모아라**가 된다.

---

# SQL을 JSP에 넣지 않고, 계산 모듈에서 HTML을 만들지 않고, 업무 규칙이 데이터베이스 스키마를 모르게 하는 관례들은 무엇에서 나오는가?

## 도입

여기서 다루는 것들은 대개 규칙으로 먼저 배운다. "화면 파일에 쿼리를 쓰지 마라", "계산하는 곳에서 마크업을 만들지 마라". 이유는 "원래 그렇게 하는 것"으로 넘어가는 일이 많다.

원문은 마지막 네 문장에서 이 관례들을 한 줄로 꿰고, 그 끝에 이름을 붙인다. 지금까지 따라온 '변경 이유'와 '사람'이 실무 관례로 착지하는 자리다.

---

## 본문

### 세 가지 관례

> This is the reason we do not put SQL in JSPs.

"이것이 우리가 JSP에 SQL을 넣지 않는 이유다."

- **JSP**: Java Server Pages. HTML 안에 서버 코드를 섞어 쓰는 화면 템플릿 기술이다. 프론트엔드로 치면 마크업 파일 안에 서버 로직을 직접 적는 형태이고, PHP 파일에 쿼리를 박던 옛 방식과 같은 그림이다.
- **SQL in JSPs**: 화면을 그리는 파일이 데이터베이스 테이블 구조까지 알고 있는 상태. 화면 문구를 바꾸는 사람과 테이블을 바꾸는 사람이 같은 파일을 연다.

> This is the reason we do not generate HTML in the modules that compute results.

"이것이 우리가 결과를 계산하는 모듈에서 HTML을 생성하지 않는 이유다."

- **compute results**: 값을 계산하는 일. 무엇을 계산할지는 업무 규칙이 정하고, 어떻게 보일지는 화면 쪽이 정한다.
- **generate HTML**: 계산 결과를 화면 형태로 바로 만들어 내보내는 것. 합계를 구하는 함수가 숫자 `12000` 대신 `"12,000원"` 문자열을 반환하는 모양이 같은 문제다.

> This is the reason that business rules should not know the database schema.

"이것이 업무 규칙이 데이터베이스 스키마를 알아서는 안 되는 이유다."

- **business rules**: 그 서비스가 무엇을 하는지에 해당하는 규칙. 할인율, 배송 조건, 등급 산정 같은 것들이다.
- **should not know**: "쓰지 않는다"가 아니라 "알지 못한다"다. 저장 방식이 바뀌어도 업무 규칙이 안 바뀌려면, 애초에 그 규칙이 테이블 모양을 모르고 있어야 한다.

### 세 관례를 관통하는 것

> This is the reason we separate concerns.

"이것이 우리가 관심사를 분리하는 이유다."

- **This is the reason**: 네 문장이 같은 구문으로 반복된다. 서로 달라 보이는 관례들이 하나의 원인에서 나온다는 걸 형태로 보여주는 구성이다.
- **separate concerns**: 관심사 분리. 앞의 세 문장이 그 원칙의 개별 적용 사례이고, 마지막 문장이 그것들을 하나의 이름으로 묶는다.

세 관례를 '변경 이유'와 '요청자'로 풀면 같은 구조가 나온다.

- **SQL을 화면 파일에 넣으면** — 화면 문구를 요청하는 사람과 테이블 구조를 바꾸는 사람이 같은 파일을 연다.
- **계산 모듈이 HTML을 만들면** — 계산 규칙을 정하는 사람과 화면 모양을 정하는 사람이 같은 파일을 연다.
- **업무 규칙이 스키마를 알면** — 정책을 정하는 사람과 저장 방식을 정하는 사람이 같은 파일을 연다.

셋 다 문 두 개짜리 파일을 만드는 일이다.

```
같은 형태가 세 번 반복된다

  요청자 A ──┐                       요청자 A ──→ [ A의 파일 ]
             ├─→ [ 한 파일 ]   ⇒                        │ 계약
  요청자 B ──┘                       요청자 B ──→ [ B의 파일 ]

  A의 요청이 B를 깨뜨림               A의 변경이 B에 닿지 않음
```

### 프론트엔드에서 같은 자리

세 관례의 이름(JSP·SQL)은 낯설어도 구조는 매일 만난다.

```jsx
// 세 관례를 한 번에 어기는 형태
function OrderSummary({ rows }) {
  // ← 업무 규칙이 서버 응답 모양(스키마)을 직접 알고 있다
  const total = rows.reduce((s, r) => s + r.item_price * r.item_qty, 0);
  // ← 계산하는 자리에서 화면 문자열을 만들어 내보낸다
  const label = total >= 50000 ? `${total.toLocaleString()}원 (무료배송)` : `${total.toLocaleString()}원`;
  return <p>{label}</p>;
}
```

응답 필드명이 바뀌어도, 무료배송 기준이 바뀌어도, 표기가 바뀌어도 이 파일 하나가 열린다. 갈라놓으면 각 변경이 자기 자리에서 멈춘다.

```js
// 서버 응답 모양을 아는 유일한 자리
export function toOrderItems(rows) {
  return rows.map((r) => ({ price: r.item_price, quantity: r.item_qty }));
}

// 업무 규칙 — 서버가 어떻게 생겼는지도, 화면이 어떻게 생겼는지도 모른다
export function getOrderTotal(items) {
  return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}
export function hasFreeShipping(total) {
  return total >= 50000;
}
```

`getOrderTotal`이 숫자를 반환하고 문자열을 만들지 않는 것이 "계산 모듈에서 HTML을 만들지 않는다"의 프론트엔드 판이다. `toOrderItems`만 응답 필드명을 아는 것이 "업무 규칙이 스키마를 모른다"의 실행이다.

### 두 원칙은 어떤 관계인가

관심사 분리는 "구별되는 측면 또는 책임을 기준으로 시스템을 쪼갠다"까지를 말한다. 그런데 그 '구별되는'을 무엇으로 판정할지는 열려 있다. 여기가 SRP가 들어오는 자리다 — **변경을 요청하는 사람이 다르면 다른 관심사다.**

```
관심사 분리:  쪼개라. 기준은 "구별되는 측면 또는 책임"
                              ↑
단일 책임 원칙:      그 '구별'을 판정하는 잣대를 준다
                     = 변해야 할 이유 = 요청하는 사람
```

같은 폴더의 관심사 분리 해설이 짚는 과분할 비용도 그대로 걸린다. 액터가 다르다는 이유만으로 층을 계속 얹으면, 조각 안은 단순해지지만 조각 사이가 복잡해진다. 실제로 따로 바뀌어온 것만 가르는 것이 값을 하는 지점이다.

---

## 종합

세 관례는 각각 배우는 규칙처럼 보이지만 뿌리가 하나다. 원문이 `This is the reason`을 네 번 반복하고 마지막에 `we separate concerns`로 맺는 구성이 그것을 형태로 보여준다.

지금까지의 흐름을 되짚으면 이렇게 이어진다.

- 모듈은 변해야 할 이유가 하나여야 한다 (원칙의 진술)
- 그 '이유'를 따라가면 요청하는 사람이 나온다 (`the reasons for change are people`)
- 그러니 같은 사람이 요청하는 것은 모으고, 다른 사람이 요청하는 것은 뗀다 (`Gather together ... Separate ...`)
- 그 실행이 실무에서 굳은 모습이 이 관례들이다

관례를 규칙으로만 알고 있으면 처음 보는 상황에서 판단이 안 선다. 화면 파일에 쿼리를 쓰지 말라는 규칙은 알아도, 상태 관리 코드에 서버 응답 필드명을 그대로 쓸지는 그 규칙이 답해주지 않는다. 이유를 알면 새 상황에도 같은 물음을 댈 수 있다 — **이 파일을 고쳐달라고 말할 수 있는 사람이 몇 갈래인가.**
