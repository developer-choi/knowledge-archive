# 관심사(concern)란 무엇인가?

## 도입

"관심사 분리"라는 말은 흔히 쓰이지만, 정작 **관심사**가 무엇인지는 흐릿한 채로 넘어가기 쉽다. 그 상태로는 원칙 전체가 허공에 뜬다. "관심사를 분리하라"는 말이 "잘 나눠라" 이상을 뜻하지 못하기 때문이다.

먼저 걷어내야 할 오해가 하나 있다. 관심사는 **코드 덩어리가 아니다.** 파일·폴더·컴포넌트는 관심사를 담는 그릇일 뿐이고, 관심사 자체는 그보다 앞선 것 — 시스템을 바라보는 **하나의 측면**, 한 번에 하나씩 다룰 수 있는 생각의 갈래다.

---

## 본문

### 한 시스템 안에 있어도 따로 다룰 수 있는 것

> Separation of concerns (SoC) is a design principle in computer science and software engineering, it holds that a complex problem should be divided into distinct concerns — aspects or issues — that can be analyzed, addressed or managed individually, even when they belong to the same system.

"관심사 분리는 컴퓨터 과학과 소프트웨어 공학의 설계 원칙으로, 복잡한 문제를 서로 구별되는 관심사 — 측면 또는 쟁점 — 로 나눠야 한다고 말한다. 그 관심사들은 같은 시스템에 속해 있을 때조차 개별적으로 분석되고 다뤄지고 관리될 수 있다."

- **distinct**: 서로 겹치지 않고 구별되는. 경계가 흐릿하면 아직 나뉜 게 아니다.
- **aspects or issues**: 관심사의 정체를 풀어 쓴 대목이다. 측면(무엇을 기준으로 볼 것인가)이거나 쟁점(무엇이 문제인가)이지, 코드 조각이 아니다.
- **individually**: 하나씩 따로. 한 번에 하나만 머릿속에 올린다는 뜻이다.
- **even when they belong to the same system**: 이 문장에서 가장 중요한 대목이다. **같은 시스템에 속해 있어도** 따로 다룰 수 있다고 못박는다. 즉 관심사가 나뉘었다는 것과 파일이 나뉘었다는 것은 별개다.

### 원래는 코드를 나누는 기술이 아니라 생각을 정리하는 기술이었다

이 용어를 만든 다익스트라의 원전으로 가면, 관심사 분리는 폴더 구조 이야기가 전혀 아니다.

> It is what I sometimes have called "the separation of concerns", which, even if not perfectly possible, is yet the only available technique for effective ordering of one's thoughts, that I know of.

"내가 때때로 '관심사 분리'라고 불러온 것이 이것이다. 완벽하게는 불가능할지라도, 내가 아는 한 생각을 효과적으로 정리하는 유일한 기술이다."

- **ordering of one's thoughts**: 생각을 줄 세우는 일. 대상이 코드가 아니라 **머릿속**이다.
- **even if not perfectly possible**: 완벽히 나뉘지 않는다는 것을 저자 스스로 인정하고 시작한다. 이 단서가 뒤에 나올 "사람마다 다르게 나눌 수 있지 않나"라는 반론의 답이 된다.

> We know that a program must be correct and we can study it from that viewpoint only; we also know that it should be efficient and we can study its efficiency on another day, so to speak.

"우리는 프로그램이 올바라야 한다는 것을 알고, 그 관점만으로 프로그램을 살펴볼 수 있다. 또한 효율적이어야 한다는 것도 알고, 말하자면 그 효율은 다른 날 따로 살펴볼 수 있다."

- **from that viewpoint only**: 그 관점 하나만으로. 다른 관점은 잠시 내려놓는다.
- **on another day**: 다른 날에. 같은 코드를 **다른 시간에 다른 눈으로** 본다는 것이라, 파일을 나누는 이야기가 아님이 분명해진다.

> But nothing is gained —on the contrary!— by tackling these various aspects simultaneously.

"그러나 이 여러 측면을 동시에 붙드는 것으로 얻는 것은 없다. 오히려 반대다!"

- **tackling ... simultaneously**: 여러 측면을 한꺼번에 붙들고 씨름하기.
- **on the contrary**: 얻는 게 없는 정도가 아니라 손해라는 강조.

#### 파일이 하나여도 관심사는 둘일 수 있다

같은 함수를 두 번 읽는 상황을 생각해보면 이 말이 손에 잡힌다.

```js
function formatPrice(cents, locale) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'KRW' })
    .format(cents / 100);
}
```

- **"맞는가"라는 관심사** — 0원·음수·소수점이 들어와도 옳은 값이 나오는가. 통화 단위가 맞는가.
- **"빠른가"라는 관심사** — 목록 1000줄을 그릴 때 `Intl.NumberFormat`을 매번 새로 만드는 게 괜찮은가.

파일도 하나, 함수도 하나지만 관심사는 둘이다. 그리고 두 관심사를 한꺼번에 붙들면 둘 다 어설퍼진다. 다익스트라가 "다른 날 보라"고 한 것이 정확히 이 상황이다.

#### 프론트엔드에서 흔히 갈리는 관심사

관심사는 결국 **질문 단위**로 잡힌다. 화면 하나를 만들 때 동시에 날아드는 질문들을 갈래로 세워보면 이렇다.

- 무엇을 보여줄 것인가 — 구조와 의미
- 어떻게 보이게 할 것인가 — 시각 표현
- 언제 무엇이 바뀌는가 — 상태와 상호작용
- 데이터를 어디서 가져오는가 — 서버와의 통신
- 무엇이 틀렸을 때 어떻게 알리는가 — 검증과 오류
- 화면을 못 보는 사람은 어떻게 쓰는가 — 접근성

각 줄이 하나의 관심사다. 이 갈래들이 실제로 어떤 파일에 담기느냐는 그다음 문제이고, 담는 방식은 여러 가지다.

---

## 종합

관심사는 **시스템을 보는 하나의 측면**이자, 한 번에 하나씩 답할 수 있는 질문이다. 코드 조각이 아니라 그 코드를 향해 던지는 물음 쪽에 가깝다.

그래서 판별도 파일 목록이 아니라 질문으로 한다. "지금 나는 어느 질문에 답하고 있는가"에 하나로 답할 수 있으면 관심사가 서 있는 것이고, "이거 고치는 중인데 저것도 같이 봐야 해서"가 되면 아직 엉켜 있는 것이다.

원전이 이것을 **생각을 정리하는 기술**로 내놓았다는 점을 기억해두면, 뒤에 나오는 모든 이야기 — 왜 하는가, 어떻게 나누는가, 지나치면 어떻게 되는가 — 가 한 줄로 꿰인다. 도구는 파일이지만 목적은 머릿속이다.

---

# 관심사를 나누는 방식에는 무엇이 있는가?

## 도입

앞에서 관심사가 '측면'이라는 것까지 왔다면, 다음 물음은 자연스럽게 "그럼 그 측면을 무엇으로 가르나"다.

여기서 대부분의 사람이 곧장 **파일 쪼개기**를 떠올린다. 컴포넌트를 나누고 폴더를 만드는 그것이다. 틀린 답은 아니지만, **여러 방식 중 하나**일 뿐이다. 이것을 전부라고 믿으면 "파일을 나눴으니 관심사 분리 끝"이라는 결론에 도달하게 된다.

---

## 본문

### 네 갈래

> Separation of Concerns can be achieved in several ways: temporally (e.g., sequencing activities in a software lifecycle), by quality (e.g., treating correctness separately from efficiency), by view (e.g., analyzing data flow separately from control flow) or by size (modularity).

"관심사 분리는 여러 방식으로 달성될 수 있다. 시간으로(예: 소프트웨어 생애주기의 활동들을 순서 세우기), 품질로(예: 정확성과 효율성을 따로 다루기), 관점으로(예: 데이터 흐름과 제어 흐름을 따로 분석하기), 또는 크기로(모듈화)."

- **temporally**: 시간 축으로. 같은 대상을 다른 시점에 다룬다.
- **by quality**: 품질 축으로. 여기서 quality는 "품질이 좋다"가 아니라 **성질·속성**이라는 뜻에 가깝다.
- **by view**: 보는 각도 축으로.
- **by size (modularity)**: 크기 축으로. 이것이 우리가 아는 모듈화다.

네 갈래를 프론트엔드 일상으로 옮기면 이렇게 된다.

- **시간으로** — 코드 리뷰에서 "이번 라운드는 로직만 보고, 네이밍·주석은 다음 라운드에" 하고 끊는 것. 요구사항 정리와 구현을 같은 순간에 섞지 않는 것도 여기다.
- **품질로** — 같은 컴포넌트를 놓고 "동작이 맞는가"를 먼저 끝내고, "리렌더가 과한가"는 따로 잡는 것.
- **관점으로** — 데이터가 어디서 어디로 흐르는지(데이터 흐름)와, 어떤 조건에서 어떤 순서로 실행되는지(제어 흐름)를 따로 그려보는 것.
- **크기로** — 화면을 컴포넌트로, 로직을 훅으로, 기능을 패키지로 쪼개는 것.

### 파일을 나눴다 ≠ 관심사를 나눴다

```
관심사 분리
├─ 시간으로
├─ 품질로
├─ 관점으로
└─ 크기로 (= 모듈화)   ← 파일·컴포넌트 쪼개기는 여기 하나
```

이 그림에서 두 가지가 따라 나온다.

- **파일을 쪼갰어도 관심사가 안 나뉠 수 있다.** `Header.tsx`·`Footer.tsx`로 갈라놨는데 둘 다 전역 상태를 직접 읽고 쓰고 API도 각자 부르고 있으면, 크기만 줄었을 뿐 갈래는 그대로 엉켜 있다.
- **파일을 안 쪼개도 관심사 분리를 하고 있을 수 있다.** 한 파일 안에서 "지금은 정확성만 본다"고 정하고 보는 것은 품질 축의 관심사 분리다.

그래서 "관심사 분리했어?"라는 물음에 폴더 트리를 보여주는 것으로는 답이 되지 않는다. 폴더 트리는 네 축 중 하나에 대한 답일 뿐이다.

---

## 종합

관심사를 가르는 축은 넷이다 — **시간 · 품질 · 관점 · 크기**. 이 중 크기 축이 모듈화이고, 우리가 평소 "관심사 분리"라고 부르며 하는 일의 대부분이 여기에 몰려 있다.

나머지 셋을 기억해둘 값어치는 실용적인 데 있다. 파일을 더 쪼갤 수 없는 상황에서도 여전히 쓸 카드가 남는다는 뜻이기 때문이다. 한 컴포넌트가 도저히 안 쪼개지면, 볼 때를 나누거나(시간) 보는 눈을 나누는(품질·관점) 쪽으로 갈 수 있다.

---

# 사람마다 다르게 나눌 수 있는데, 그래도 관심사 분리가 성립하는가?

## 도입

관심사 분리에 늘 따라붙는 반론이 있다. **경계가 주관적**이라는 것이다. 같은 화면을 놓고 누구는 데이터와 표현으로 가르고, 누구는 도메인 단위로 가른다. 정답이 하나가 아니라면 원칙이라 부를 수 있는가?

이 물음은 진지하게 다룰 값어치가 있다. 답을 못 내면 "결국 취향 문제"라는 결론으로 미끄러지고, 그러면 원칙은 아무것도 판정하지 못하는 장식이 된다.

---

## 본문

### 무시(ignore)가 아니라 무관(irrelevant)

> This is what I mean by "focussing one's attention upon some aspect": it does not mean ignoring the other aspects, it is just doing justice to the fact that from this aspect's point of view, the other is irrelevant.

"이것이 내가 '어떤 측면에 주의를 집중한다'고 할 때의 뜻이다. 다른 측면을 무시한다는 뜻이 아니라, 이 측면의 관점에서 보면 다른 측면이 무관하다는 사실을 제대로 인정한다는 뜻일 뿐이다."

- **focussing one's attention upon some aspect**: 어떤 측면에 주의를 모으는 것.
- **it does not mean ignoring the other aspects**: 다른 측면을 무시한다는 뜻이 아니다. 없는 셈 치는 게 아니라는 선 긋기다.
- **doing justice to the fact**: 어떤 사실을 제대로 대접한다, 있는 그대로 인정한다.
- **irrelevant**: 무관한. 이 단어 하나가 판별 기준의 전부다.

무시와 무관의 차이가 이 답의 핵심이다.

- **무시**는 내가 하는 선택이다. "저건 지금 안 볼래." 그래서 주관적이다.
- **무관**은 구조가 만드는 사실이다. "저걸 몰라도 이건 끝난다." 그래서 확인할 수 있다.

### 판별 기준은 "A를 볼 때 B가 무관해지는가"

그러니 물어야 할 것은 "누가 봐도 같은 선으로 잘리는가"가 아니다. **A를 다룰 때 B를 몰라도 되는가**다.

```
[ 잘 나뉜 경우 ]                    [ 아직 안 나뉜 경우 ]

버튼 색을 바꾼다                     버튼 색을 바꾼다
  └─ API 응답 형태? 몰라도 됨          └─ API 응답 형태? 알아야 함
  └─ 정렬 로직? 몰라도 됨              └─ 그 값에 따라 클래스가 갈림
```

오른쪽에서는 색이라는 관심사와 데이터라는 관심사가 아직 한 덩어리다. 사람마다 다르게 그은 게 문제가 아니라, **어느 쪽으로 긋든 아직 무관해지지 않았다**는 게 문제다.

그래서 여러 갈래로 나뉠 수 있다는 사실 자체는 반례가 되지 못한다. 갈래가 여럿이어도 각 갈래가 무관성 시험을 통과하면 각각 성립한다. 원칙이 판정하는 것은 "선을 어디에 그었는가"가 아니라 "그은 선 양쪽이 서로를 몰라도 되는가"다.

#### 완벽하지 않아도 된다고 원전이 먼저 말한다

> It is what I sometimes have called "the separation of concerns", which, even if not perfectly possible, is yet the only available technique for effective ordering of one's thoughts, that I know of.

앞서 본 문장을 여기서 다시 꺼내는 이유는 `even if not perfectly possible`이라는 단서 때문이다. 완벽한 분리가 가능하다고 주장한 적이 없다. 완벽히는 안 되지만 이것 말고는 쓸 게 없다는 것이 원래의 주장이다.

따라서 "완벽히 안 나뉘니까 무의미하다"는 반론은 하지 않은 주장을 반박하는 셈이 된다. 재고 있는 척한 적 없는 가게에 재고를 따지는 격이다.

---

## 종합

경계가 사람마다 다르게 그어진다는 것은 사실이고, 원전도 그것을 인정하고 출발한다. 그럼에도 원칙이 성립하는 이유는 판정 기준이 **선의 위치**가 아니라 **선의 효력**에 있기 때문이다.

기준은 한 줄이다 — **A를 다룰 때 B가 무관해지는가.** 무관해지면 나뉜 것이고, 여전히 B를 알아야 하면 어떻게 그었든 아직 안 나뉜 것이다.

이 기준은 무시(내가 안 보기로 함)와 무관(안 봐도 됨)을 가르기 때문에 취향으로 미끄러지지 않는다. 코드를 앞에 두고 "이거 고치는 데 저기까지 열어봐야 하나"를 물으면 그 자리에서 답이 나온다.

---

# 관심사 분리란 무엇인가?

## 도입

"관심사 분리"는 이름이 곧 설명처럼 보이지만, 그대로 풀면 "관심사를 분리하는 것"이라는 제자리 걸음이 된다. 정의에서 실제로 알아야 하는 건 두 가지다. **무엇을 하는 원칙인가**(쪼갠다), 그리고 **무엇을 기준으로 쪼개는가**(관심사).

아래 원문은 앞의 절반만 말한다. 뒤의 절반은 같은 출처의 다음 문장이 채워주므로 그것도 함께 읽는다.

---

## 본문

### 원문 조각 읽기

> Separation of Concerns (SoC) is a fundamental principle in software engineering and design

"관심사 분리(SoC)는 소프트웨어 공학과 설계의 기본 원칙이다."

- **fundamental**: 다른 여러 규칙이 그 위에 얹히는 바닥이라는 뜻. 특정 언어·프레임워크의 기법이 아니라, 기법들이 공유하는 전제에 가깝다.
- **principle**: 지켜야 할 절차(어떻게 하라)가 아니라 판단 기준(무엇이 더 나은가)이다. 그래서 "이 원칙을 적용했다/안 했다"의 이분법이 아니라 정도의 문제로 나타난다.

> aimed at breaking down complex systems into smaller, more manageable parts.

"복잡한 시스템을 더 작고 다루기 쉬운 조각으로 쪼개는 것을 목표로 한다."

- **aimed at**: 결과 보장이 아니라 지향점이다. 쪼갠다고 자동으로 좋아지지 않고, 좋아지는 방향으로 겨눌 뿐이다.
- **breaking down**: 부수는 게 아니라 분해다. 조각들을 다시 합치면 원래 시스템이 되어야 한다.
- **manageable**: "관리 가능한". 여기서 관리의 주체는 컴퓨터가 아니라 사람이다. 사람이 한 조각만 열어서 이해하고 고칠 수 있는 크기라는 뜻이다.

### 빠져 있는 절반 — 무엇을 기준으로 쪼개는가

위 문장만 보면 "작게 쪼갠다"까지만 남는다. 그러면 300줄짜리 함수를 150줄씩 둘로 자르는 것도 관심사 분리가 되어버린다. 기준을 채워주는 문장이 같은 출처의 바로 다음 줄에 있다.

> The term "concern" refers to any distinct aspect or responsibility within a system.

"'관심사'라는 용어는 시스템 안의 구별되는 측면 또는 책임 하나하나를 가리킨다."

- **concern**: 일상어의 "걱정"이 아니라 "관여하는 일"에 가깝다. 시스템이 신경 쓰고 있는 일 한 가지.
- **distinct**: 다른 것과 섞이지 않고 경계가 잡히는 상태. 서로 겹쳐서 어디까지가 어느 쪽인지 말할 수 없으면 관심사로 잡힌 게 아니다.
- **aspect**: 같은 대상을 바라보는 한 각도. 화면 하나에 "무엇을 보여주는가"·"어떻게 생겼는가"·"어디서 데이터를 가져오는가"라는 여러 각도가 동시에 존재한다.
- **responsibility**: 그 조각이 맡은 일. 고장 났을 때 책임을 물을 자리가 한 곳으로 특정되는지가 판별 기준이 된다.

곧 쪼개는 칼금은 **분량**(줄 수·파일 개수)이 아니라 **역할**이다. 조각의 크기가 아니라 조각의 경계가 무엇을 따라 그어졌는지가 이 원칙이 보는 지점이다.

```
같은 함수를 두 조각으로 나눈 두 방식

분량 기준 (관심사 분리 아님)          관심사 기준 (관심사 분리)

┌────────────┐ ┌────────────┐        ┌────────────┐ ┌────────────┐
│ 앞의 절반   │ │ 뒤의 절반   │        │ 값이 올바른지│ │ 서버로     │
│ 검증 + 전송 │ │ 전송 + 표시 │        │ 검사한다    │ │ 보낸다     │
│ 일부        │ │ 일부        │        └────────────┘ └────────────┘
└────────────┘ └────────────┘
  한쪽만 읽어도                          한쪽만 읽으면
  무슨 일인지 모름                       그 일 하나가 다 보임
```

```js
// 관심사가 섞인 함수 — "값 검사"와 "전송"이 한 몸
async function submitEmail(email) {
  if (!email.includes('@')) {          // ← 값이 올바른지 보는 일
    alert('이메일 형식이 아닙니다');
    return;
  }
  await fetch('/api/subscribe', {      // ← 서버로 보내는 일
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
```

```js
// 관심사를 기준으로 가른 뒤 — 각 함수가 한 가지 일만 맡는다
function isValidEmail(email) {
  return email.includes('@');
}

async function subscribe(email) {
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
```

`isValidEmail`은 서버가 어디 있는지 몰라도 되고, `subscribe`는 이메일 형식 규칙이 무엇인지 몰라도 된다. 형식 규칙이 바뀌어도 전송 코드는 열어보지 않는다. 앞의 "분량 기준" 쪽에서는 이런 일이 일어나지 않는다 — 어느 절반을 열어도 두 가지 일이 같이 보인다.

---

## 종합

정의는 두 마디로 잡힌다. **복잡한 시스템을 더 작고 다루기 쉬운 조각으로 쪼갠다**는 것이 하는 일이고, **구별되는 측면 또는 책임**이 쪼개는 기준이다. 뒤의 절반이 빠지면 "작게 나눠라"라는 말만 남아 분량으로 자르는 것과 구분되지 않는다.

`manageable`이 사람 쪽 단어라는 점도 함께 봐둘 만하다. 기계는 한 파일에 만 줄이 있어도 아무 부담이 없다. 다루기 어려워지는 쪽은 읽고 고치는 사람이므로, 이 원칙이 최적화하려는 대상도 사람이다.

`principle`이라는 단어 선택 때문에 이 원칙은 지켰다/어겼다로 판정되지 않는다. 어디에 칼금을 그을지, 얼마나 그을지는 매번 판단으로 남는다.

---

# 관심사 분리를 하는 이유는?

## 도입

앞의 정의가 "무엇을 어떤 기준으로 쪼개는가"였다면, 여기서 다루는 건 **쪼개면 무엇이 좋아지는가**다.

이익을 받는 쪽은 프로그램이 아니라 사람이다. 나눈다고 프로그램이 빨라지지는 않는다. 대신 읽는 비용, 고치는 비용, 여럿이 나눠 맡는 비용이 내려간다. 아래 항목들은 그 비용이 내려가는 자리를 하나씩 짚은 것이고, 서로 겹치는 것이 많아 몇 갈래로 묶어 읽는 편이 낫다.

응집도가 높을수록·결합도가 낮을수록 좋다는 이야기가 "모듈끼리 어떻게 놓여야 하는가"를 다룬다면, 이 항목들은 그 배치가 사람에게 무엇을 해주는가를 말한다.

---

## 본문

### 출발점 — 한 번에 하나만 본다

> This allows focusing on one issue at a time,

"이렇게 하면 한 번에 하나의 쟁점에만 집중할 수 있고,"

- **allows**: 관심사 분리가 집중을 *강제*하는 게 아니라 *가능하게* 해준다는 뜻이다. 나눠놨다고 저절로 잘 짜이지 않고, 나눠놨기 때문에 한 곳만 보고 고칠 선택지가 생긴다.
- **one issue at a time**: "한 번에 하나씩". 지금 손대는 문제 하나만 머리에 올려두고 나머지는 그 판단에 끼어들지 않는 상태.

> reducing cognitive load and complexity.

"인지 부하와 복잡도를 줄인다."

- **cognitive load**: 어떤 작업을 해내기 위해 머릿속에 동시에 붙들고 있어야 하는 정보의 양. 버튼 색 하나 바꾸려는데 그 버튼이 어떤 API를 호출하는지까지 같이 읽어야 한다면 인지 부하가 높은 것이다.
- **complexity**: 코드의 절대량이 아니라 얽힘의 정도. 한 곳을 건드렸을 때 영향이 퍼지는 범위가 넓을수록 복잡하다.

> By separating concerns, software engineers aim to create clearer boundaries and reduce the interdependence between different parts of the system.

"관심사를 분리함으로써, 소프트웨어 엔지니어는 더 명확한 경계를 만들고 시스템의 서로 다른 부분들 사이의 상호 의존을 줄이는 것을 목표로 한다."

- **boundaries**: 여기까지가 이쪽 일이고 저기부터는 저쪽 일이라는 선. 이 선이 흐리면 고칠 때 어디까지 읽어야 하는지 알 수 없다.
- **interdependence**: 서로가 서로에게 기대는 상태. 한쪽을 고치면 다른 쪽도 따라 고쳐야 하는 관계이며, 줄이는 것이 목표지 0으로 만드는 것이 목표는 아니다.

#### "집중한다"는 "나머지를 무시한다"가 아니다

여기서 흔히 미끄러지는 지점이 있다. "하나에만 집중한다"를 "나머지는 없는 셈 쳐도 된다"로 읽는 오해다. 이 원칙을 처음 제시한 Dijkstra의 원문(EWD447, 1974)은 그 해석을 명시적으로 부정한다.

> it does not mean ignoring the other aspects, it is just doing justice to the fact that from this aspect's point of view, the other is irrelevant.

"그것은 다른 측면들을 무시한다는 뜻이 아니다. 지금 이 측면의 관점에서는 다른 측면이 무관하다는 사실을 제대로 인정하는 것일 뿐이다."

- **ignoring**: 존재 자체를 없는 것으로 치는 것. 부정되는 쪽이다.
- **irrelevant**: 존재는 하지만 **지금 이 판단에 끼어들지 않는** 상태. 긍정되는 쪽이다.

스타일을 고치는 동안에도 데이터 로직은 여전히 존재하고 여전히 돌아간다. 다만 색을 정할 때 그 로직이 판단 근거로 들어오지 않을 뿐이다.

### 읽고 이해하는 비용이 내려간다

> Modularity: SoC encourages breaking down complex systems into smaller, more manageable parts, each addressing a single concern. This modular approach makes it easier to understand, develop, and maintain software systems, as developers can focus on individual components without being overwhelmed by the system as a whole.

"모듈성: SoC는 복잡한 시스템을 각각 하나의 관심사만 다루는 더 작고 다루기 쉬운 부분들로 쪼개도록 유도한다. 이 모듈식 접근은 시스템을 이해하고 개발하고 유지보수하기 쉽게 만드는데, 개발자가 시스템 전체에 압도되지 않고 개별 컴포넌트에 집중할 수 있기 때문이다."

- **Modularity**: 시스템이 독립적으로 다뤄지는 단위들로 이뤄진 성질.
- **encourages**: 강제가 아니라 유도. 원칙이지 문법 규칙이 아니라는 앞의 이야기와 이어진다.
- **overwhelmed**: 감당 못 할 만큼 밀려오는 상태. 앞의 `cognitive load`가 한계를 넘은 모습이다.

> Clarity and Understandability: SoC promotes clear organization within software systems, making it easier for developers to understand the codebase.

"명료성과 이해 가능성: SoC는 소프트웨어 시스템 안의 명확한 구성을 촉진하여, 개발자가 코드베이스를 이해하기 쉽게 만든다."

- **organization**: 무엇이 어디에 놓여 있는지의 짜임새. 파일 개수가 아니라 "찾을 것이 예상되는 자리에 있는가"에 가깝다.

> Understanding and Debugging: With concerns separated into distinct modules, it becomes easier to understand and debug software systems. Developers can focus on one concern at a time, isolating and analyzing issues without being distracted by unrelated functionality.

"이해와 디버깅: 관심사가 구별되는 모듈로 분리되어 있으면 시스템을 이해하고 디버깅하기 쉬워진다. 개발자는 한 번에 하나의 관심사에 집중하여, 무관한 기능에 방해받지 않고 문제를 격리하고 분석할 수 있다."

- **isolating**: 문제를 나머지에서 떼어내 그 안에 가두는 일. 버그가 어느 조각에서 났는지 좁힐 수 있으면 고치는 시간의 대부분이 절약된다.
- **distracted by unrelated functionality**: 지금 문제와 상관없는 기능 때문에 주의가 흩어지는 상태. 위 `irrelevant`가 지켜지지 않을 때 벌어지는 일이다.

이 세 항목은 같은 이야기를 각도만 달리해 말한다. 나눠두면 한 조각만 읽어도 되고, 그래서 이해도 디버깅도 싸진다.

### 고치고 늘리는 비용이 내려간다

> Maintainability: By separating concerns, changes and updates to one aspect of the system are less likely to impact other parts. This reduces the risk of unintended side effects and makes it easier to maintain and evolve the software over time. Additionally, when modifications are required, developers can locate and modify the relevant module without affecting the entire system.

"유지보수성: 관심사를 분리하면 시스템의 한 측면에 대한 변경과 갱신이 다른 부분에 영향을 줄 가능성이 낮아진다. 이는 의도치 않은 부작용의 위험을 줄이고, 시간이 지나면서 소프트웨어를 유지하고 발전시키기 쉽게 만든다. 또한 수정이 필요할 때 개발자가 전체 시스템에 영향을 주지 않고 해당 모듈을 찾아 고칠 수 있다."

- **less likely to impact**: "영향을 주지 않는다"가 아니라 "줄 가능성이 낮아진다". 분리는 파급을 없애는 게 아니라 좁힌다.
- **locate**: 고칠 자리를 찾는 일. 고치는 시간보다 찾는 시간이 더 드는 경우가 흔하다.
- **evolve**: 요구가 바뀌는 동안 소프트웨어가 따라 바뀌는 것.

출처 문서는 같은 이점을 확장성과 묶어 한 번 더 적는다.

> Maintainability and Extensibility: Software systems are often subject to change, whether due to bug fixes, feature enhancements, or evolving requirements. SoC facilitates maintainability and extensibility by localizing changes to specific concerns.

"유지보수성과 확장 가능성: 소프트웨어 시스템은 버그 수정, 기능 개선, 변화하는 요구사항 때문에 자주 변경 대상이 된다. SoC는 변경을 특정 관심사에 국한시켜 유지보수성과 확장 가능성을 돕는다."

- **localizing changes**: 변경을 한 자리에 가두는 것. 이 표현이 위 항목 전체를 한 마디로 요약한다.
- **Extensibility**: 기존 것을 뜯지 않고 새 것을 덧붙일 수 있는 성질.

> Scalability: SoC promotes a design that allows for easy scalability. As the requirements of a system change or grow, new concerns can be addressed by adding or modifying individual modules without necessitating extensive changes to other parts of the system.

"확장성: SoC는 쉽게 규모를 키울 수 있는 설계를 촉진한다. 시스템의 요구사항이 바뀌거나 커질 때, 새로운 관심사는 다른 부분에 광범위한 변경을 요구하지 않고 개별 모듈을 추가하거나 수정하는 것으로 처리할 수 있다."

- **scalability**: 여기서는 트래픽을 감당하는 성능 이야기가 아니라, 요구사항이 늘어날 때 코드가 감당하는 정도를 말한다.
- **without necessitating extensive changes**: 새 기능 하나에 전 구역을 손대야 한다면 규모를 못 키우는 설계라는 뜻이다.

> Encapsulation: SoC encourages encapsulating related functionality within modules or components, making it easier to manage complexity and reduce dependencies between different parts of the system.

"캡슐화: SoC는 관련된 기능을 모듈이나 컴포넌트 안에 감싸 넣도록 유도하여, 복잡도를 관리하고 부분들 사이의 의존을 줄이기 쉽게 만든다."

- **Encapsulation(캡슐화)**: 어떤 일에 필요한 것들을 한 껍데기 안에 넣고, 바깥에는 쓸 창구만 내놓는 것. 바깥이 안의 사정을 모르게 되므로 안을 갈아엎어도 바깥이 안 깨진다.

이 네 항목은 결국 하나의 문장으로 모인다 — 변경을 한 자리에 가둘 수 있으면 고치는 것도 늘리는 것도 싸진다.

### 만든 것을 다시 쓴다

> Reusability: Separating concerns often leads to the creation of reusable components. Once a concern has been isolated into a distinct module, it can be reused across different parts of the system or even in entirely different projects.

"재사용성: 관심사를 분리하면 재사용 가능한 컴포넌트가 만들어지는 경우가 많다. 어떤 관심사가 구별되는 모듈로 떼어지고 나면, 시스템의 다른 부분에서, 심지어 전혀 다른 프로젝트에서도 다시 쓸 수 있다."

- **Once ... has been isolated**: 재사용은 목표로 삼아 얻는 게 아니라 분리의 결과로 따라온다는 순서를 담고 있다.
- **entirely different projects**: 다른 프로젝트로 옮겨갈 수 있으려면 그 조각이 원래 프로젝트의 사정을 모르고 있어야 한다.

앞 질문의 `isValidEmail`이 이 자리에 해당한다. 서버 주소도, 화면도 모르기 때문에 어느 프로젝트에 갖다 놔도 그대로 동작한다.

### 여럿이 동시에 일한다

> Parallel Development: SoC facilitates parallel development by providing clear boundaries between different parts of the system. Multiple developers can work on separate concerns concurrently without stepping on each other's toes, leading to more efficient development workflows and shorter time-to-market.

"병렬 개발: SoC는 시스템의 서로 다른 부분 사이에 명확한 경계를 제공하여 병렬 개발을 돕는다. 여러 개발자가 서로의 발을 밟지 않고 각자의 관심사를 동시에 작업할 수 있어, 개발 흐름이 효율적으로 되고 출시까지 걸리는 시간이 줄어든다."

- **stepping on each other's toes**: 직역하면 "서로의 발가락을 밟는다". 같은 파일을 동시에 고쳐 충돌이 나거나, 한 사람의 수정이 다른 사람의 작업을 깨뜨리는 상황을 가리키는 관용 표현이다.
- **time-to-market**: 기능이 사용자에게 닿기까지 걸리는 시간.

이 항목은 앞의 항목들과 성격이 다르다. 앞의 것들이 혼자 일할 때도 성립하는 이익이라면, 이것은 사람이 여럿일 때만 생긴다.

### 확인이 쉬워진다

> Unit testing becomes more straightforward as developers can write focused tests for each module, ensuring that it behaves correctly under different conditions.

"각 모듈에 대해 초점이 맞춰진 테스트를 쓸 수 있어 유닛 테스트가 한결 간단해지고, 그 모듈이 여러 조건에서 올바르게 동작하는지 보장하게 된다."

- **straightforward**: 어렵지 않고 곧바르다는 뜻. 준비할 것이 적어진다는 함의가 있다.
- **focused tests**: 한 가지만 확인하는 테스트. 검사 대상이 하나면 실패했을 때 원인도 하나로 좁혀진다.

`isValidEmail`을 테스트하는 데는 서버도, 브라우저도 필요 없다. 문자열을 넣고 결과를 보면 끝이다. 관심사가 섞인 `submitEmail` 쪽은 형식 검사 하나를 확인하려 해도 네트워크 호출을 어떻게든 처리해야 한다.

### 언어 단위로 굳어진 사례 — HTML·CSS·JavaScript

이 원칙이 가장 눈에 보이게 굳어진 곳이 웹 페이지다. 나누는 단위가 함수나 모듈이 아니라 아예 **언어**다.

> HTML, CSS, and JavaScript are complementary languages used in the development of web pages and websites.

"HTML, CSS, JavaScript는 웹 페이지와 웹사이트 개발에 쓰이는 상호 보완적인 언어들이다."

- **complementary**: 서로 경쟁하거나 대체하는 관계가 아니라, 각자 빠진 자리를 메워 하나를 완성하는 관계.

> HTML is mainly used for organization of webpage content, CSS is used for definition of content presentation style, and JavaScript defines how the content interacts and behaves with the user.

"HTML은 주로 웹페이지 콘텐츠의 구성에, CSS는 콘텐츠가 보여지는 방식의 정의에, JavaScript는 콘텐츠가 사용자와 어떻게 상호작용하고 동작하는지를 정의하는 데 쓰인다."

- **organization**: 무엇이 제목이고 무엇이 목록인지 같은 의미 구조. 어떻게 보이는지가 아니다.
- **presentation**: 같은 구조를 어떤 모습으로 내보일지. 구조를 바꾸지 않고 모습만 갈아끼울 수 있는 층이다.
- **interacts and behaves**: 클릭·입력에 대한 반응과 시간에 따른 동작.

> Historically, this was not the case: prior to the introduction of CSS, HTML performed both duties of defining semantics and style.

"역사적으로는 그렇지 않았다. CSS가 도입되기 전에는 HTML이 의미를 정의하는 일과 스타일을 정의하는 일을 모두 떠맡았다."

- **duties**: 맡은 책임. 하나의 언어가 두 책임을 겸하고 있었다는 표현이다.
- **semantics**: 이 요소가 무엇인지(제목·목록·강조)라는 의미. `<b>`가 "굵게"였다면 `<strong>`은 "중요함"이다.

이 갈라짐은 겸하던 시절을 실제로 겪고 난 뒤에 일어났다.

`<font>`·`<center>`처럼 스타일을 태그로 박던 시절에는 글꼴 하나를 바꾸려면 페이지 전체의 태그를 뒤져야 했다. CSS가 갈라져 나온 뒤에는 선택자 한 줄이 그 일을 대신한다.

```
CSS 도입 전                        CSS 도입 후

┌─────────────────────┐            ┌──────────┐  ┌──────────┐
│ HTML                │            │ HTML     │  │ CSS      │
│  의미(무엇인가)      │            │  의미     │  │  표현     │
│  + 표현(어떻게 보이나)│            └──────────┘  └──────────┘
└─────────────────────┘                  │             │
   글꼴 변경 = 전 페이지                   │      글꼴 변경 = 규칙 한 줄
   태그 전수 수정                          │
                                    구조를 안 건드리고 모습만 교체 가능
```

앞에서 짚은 이익들이 이 한 사례에 거의 다 들어 있다. 글꼴 변경이 규칙 한 줄로 끝나는 건 변경이 한 자리에 갇혔기 때문이고(유지보수성), 같은 스타일시트를 다른 페이지가 그대로 쓰는 건 재사용이며, 디자이너와 개발자가 각자 파일을 잡고 동시에 일할 수 있는 건 병렬 개발이다.

### 없으면 어떻게 되는가

관심사가 한 덩어리에 뭉쳐 있으면 손해는 두 곳에서 난다.

하나는 읽을 때다. 스타일만 보고 싶어도 데이터 로직을 함께 읽어야 하니 머리에 올릴 양이 늘어난다. 다른 하나는 고칠 때다. 색을 바꿨는데 요청 로직이 깨질 수 있으니 변경 영향 범위가 넓어진다.

앞의 원문이 `cognitive load`와 `complexity`로 지목한 것이 각각 이 둘이다.

```js
// 뭉쳐 있을 때 — 색 하나 바꾸려면 이 함수 전체를 읽어야 한다
async function renderUserBadge(id) {
  const user = await fetch(`/api/users/${id}`).then((r) => r.json());
  const el = document.createElement('span');
  el.textContent = user.name;
  el.style.color = user.isVip ? 'gold' : 'gray';  // ← 여기만 고치고 싶은데
  document.body.append(el);
}
```

```js
// 갈라놓았을 때 — 색은 CSS, 데이터는 JS, 구조는 클래스명이 담당
async function renderUserBadge(id) {
  const user = await fetch(`/api/users/${id}`).then((r) => r.json());
  const el = document.createElement('span');
  el.textContent = user.name;
  el.className = user.isVip ? 'badge badge--vip' : 'badge';
  document.body.append(el);
}
```

색을 바꾸는 사람은 아래 코드에서 JavaScript 파일을 열 필요가 없다. `.badge--vip` 규칙 한 줄만 보면 된다. 데이터 로직은 여전히 존재하지만, 색을 정하는 판단에는 끼어들지 않는다 — 앞서 본 `irrelevant`가 실제로 이런 모습이다.

---

## 종합

이유는 한 줄로 압축된다. 한 번에 하나만 보게 해주고(`focusing on one issue at a time`), 그 결과 머리에 올릴 양과 얽힘이 줄어든다(`reducing cognitive load and complexity`). 나머지 항목들은 그 절약이 어느 국면에서 나타나는지를 나눠 적은 것이다.

네 갈래로 묶으면 이렇게 된다.

- **읽을 때** — 한 조각만 열면 된다 (모듈성 · 명료성 · 이해와 디버깅)
- **고칠 때** — 변경이 한 자리에 갇힌다 (유지보수성 · 확장성 · 캡슐화)
- **다시 쓸 때** — 떼어놓은 조각을 그대로 옮길 수 있다 (재사용성)
- **여럿이 일할 때** — 서로 부딪히지 않는다 (병렬 개발)

유닛 테스트가 쉬워지는 것은 이 중 첫 두 갈래가 테스트 코드에서 나타난 모습이다.

이익을 보는 주체는 기계가 아니라 사람이다. 나눈다고 프로그램이 빨라지지는 않지만, 읽고 고치는 비용은 내려간다. HTML·CSS·JavaScript는 그 효과가 언어 경계로까지 굳어진 사례다. 지금 CSS 파일을 따로 두는 걸 당연하게 여기는 것이 이 원칙이 통한 자리다.

주의할 점은 "집중"을 "무시"로 바꿔 읽지 않는 것이다. 다른 관심사는 사라지지 않고 각자의 자리에서 계속 돌아간다. 지금의 판단에 끼어들지 않을 뿐이다.

---

# 관심사 분리를 지나치게 밀어붙이면 어떤 문제가 생기는가?

## 도입

앞 질문의 이점 목록만 읽고 나면 자연스럽게 나오는 결론이 있다. "그럼 최대한 잘게 쪼개면 되겠네."

이 질문은 그 결론을 막는 자리에 있다. 쪼개는 데는 값이 따르고, 그 값은 조각 수가 늘수록 같이 는다. 어느 지점부터는 나눠서 얻는 것보다 나눠서 드는 비용이 커지는데, 아래 항목들이 그 비용이 어디서 발생하는지를 짚는다.

---

## 본문

### 나눌수록 다시 붙이는 값이 든다

> Overhead: Achieving a high level of separation of concerns can sometimes lead to increased complexity and overhead, especially in systems with many interacting components. This can result in higher development and maintenance costs.

"오버헤드: 높은 수준의 관심사 분리를 달성하는 것은 때때로 복잡도와 부가 비용을 증가시킬 수 있으며, 특히 상호작용하는 컴포넌트가 많은 시스템에서 그렇다. 이는 개발과 유지보수 비용을 높이는 결과로 이어질 수 있다."

- **Overhead**: 원래 하려던 일 자체가 아니라, 그 일을 그 방식으로 하기 위해 추가로 드는 몫. 파일을 나누면 생기는 import 문·인터페이스 정의·전달 코드가 여기 해당한다.
- **increased complexity**: 앞 질문에서 분리가 줄여준다고 했던 바로 그 단어가 여기서는 늘어나는 쪽으로 나온다. 조각 안의 얽힘은 줄지만 조각 사이의 얽힘은 는다.
- **many interacting components**: 조각이 많아도 서로 안 부르면 값이 안 든다. 값은 조각 수가 아니라 조각들이 주고받는 횟수에서 나온다.

> Coordination Overhead: In systems with highly separated concerns, coordinating interactions between different components or modules can become more challenging. This may require additional effort to ensure proper communication and integration between different parts of the system.

"조율 오버헤드: 관심사가 고도로 분리된 시스템에서는 서로 다른 컴포넌트나 모듈 사이의 상호작용을 조율하는 일이 더 어려워질 수 있다. 이는 부분들 사이의 통신과 통합이 제대로 이뤄지도록 추가적인 노력을 요구할 수 있다."

- **coordinating**: 각자 도는 조각들이 하나의 결과를 내도록 순서와 데이터를 맞추는 일.
- **integration**: 따로 만든 조각들을 합쳐 실제로 동작시키는 단계. 조각 각각은 잘 돌아가는데 합치면 안 되는 상황이 여기서 나온다.

두 항목은 같은 비용의 앞뒤다. 나누면 그 사이를 잇는 코드가 새로 생기고(오버헤드), 이어놓은 것들이 함께 옳게 도는지 맞추는 일이 새로 생긴다(조율 오버헤드).

### 층이 늘면 따라가기 어려워진다

> Increased Indirection: Achieving SoC often involves introducing layers of abstraction or indirection between different parts of the system. While this can promote flexibility and modularity, it can also make code more difficult to follow and debug, especially for developers unfamiliar with the system's architecture.

"간접 참조의 증가: SoC를 달성하려면 시스템의 부분들 사이에 추상화나 간접 참조의 층을 끼워 넣는 일이 많다. 이것이 유연성과 모듈성을 높여주긴 하지만, 코드를 따라가고 디버깅하기 어렵게 만들 수도 있다. 특히 그 시스템의 구조에 익숙하지 않은 개발자에게 그렇다."

- **Indirection(간접 참조)**: A가 B를 직접 부르지 않고 중간의 무언가를 거쳐 부르는 구조. 중간 것을 갈아끼우면 A를 안 고치고 동작을 바꿀 수 있는 대신, A만 봐서는 실제로 무엇이 불리는지 알 수 없다.
- **abstraction(추상화)**: 안에서 무슨 일이 벌어지는지 감추고 "무엇을 해준다"만 내놓는 것. 감춰진 만큼 볼 수 없다는 값을 함께 치른다.
- **difficult to follow**: 코드를 눈으로 좇아 실제 동작에 도달하기까지 거쳐야 할 파일이 많아진 상태.

```js
// 층이 얇을 때 — 무엇이 불리는지 한 눈에 보인다
async function loadUser(id) {
  return fetch(`/api/users/${id}`).then((r) => r.json());
}
```

```js
// 층을 겹겹이 쌓았을 때 — 실제 요청을 보려면 파일 네 개를 거쳐야 한다
// userService.ts
async function loadUser(id) {
  return userRepository.findById(id);   // ← 여기서 무슨 요청이 나가는지 안 보임
}

// userRepository.ts → httpClient.ts → fetchAdapter.ts 로 이어짐
```

아래 쪽이 항상 나쁜 건 아니다. 요청 방식을 통째로 갈아끼울 계획이 실제로 있다면 저 층들이 값을 한다. 그런 계획이 없는데 층만 있으면 읽는 사람만 손해다.

> Potential for Misuse: While SoC promotes modularity and encapsulation, there's a risk that developers may misinterpret the principle and overcomplicate the system by creating too many layers or modules. This can lead to unnecessary abstraction and reduced code maintainability.

"오용 가능성: SoC가 모듈성과 캡슐화를 촉진하기는 하지만, 개발자가 이 원칙을 잘못 해석해 너무 많은 층이나 모듈을 만들어 시스템을 과도하게 복잡하게 만들 위험이 있다. 이는 불필요한 추상화와 코드 유지보수성 저하로 이어질 수 있다."

- **misinterpret**: 원칙을 "많이 나눌수록 좋다"로 잘못 읽는 것. 앞 질문의 정의가 "작게"가 아니라 "관심사 기준으로"였다는 점이 여기서 다시 걸린다.
- **unnecessary abstraction**: 감출 필요가 없는 것을 감춘 층. 갈아끼울 일이 없는데 갈아끼울 수 있게 만들어둔 자리가 대표적이다.
- **reduced code maintainability**: 유지보수성을 얻으려고 한 일이 유지보수성을 깎는다는 뒤집힘. 이 목록에서 가장 아이러니한 지점이다.

### 원칙 자체를 익히는 값이 든다

> Learning Curve: Adopting SoC requires developers to understand and apply the principle effectively, which may involve a learning curve, especially for junior developers or those new to software engineering best practices.

"학습 곡선: SoC를 도입하려면 개발자가 이 원칙을 이해하고 효과적으로 적용할 수 있어야 하는데, 여기에는 학습 곡선이 따를 수 있다. 특히 주니어 개발자나 소프트웨어 공학 모범 사례에 익숙하지 않은 사람에게 그렇다."

- **Learning Curve**: 익숙해지기까지 드는 시간. 이 항목만 코드가 아니라 팀에 붙는 비용이라는 점이 다르다.
- **apply ... effectively**: 아는 것과 잘 쓰는 것이 다르다는 뜻. 어디에 선을 그을지는 규칙으로 못 정해주고 판단으로 남기 때문이다.

```
얼마나 쪼갤 것인가

    비용
     │        ╲                    ╱  조각 사이를 잇고 맞추는 값
     │         ╲                 ╱    (오버헤드·조율·간접 참조)
     │          ╲             ╱
     │            ╲        ╱
     │  한 덩어리를  ╲   ╱
     │  읽고 고치는 값  ╳ ← 이 근처가 적정선
     └──────────────────────────────── 조각 수
        덜 나눔                 더 나눔
```

---

## 종합

이 목록이 실무에서 하는 일은 제동이다. 이점만 알고 있으면 판단이 한 방향으로만 간다 — 애매하면 일단 나누고, 층을 하나 더 얹는다. 그 판단을 멈춰 세울 근거가 여기 있다.

다섯 항목은 세 갈래로 모인다.

- **잇는 값** — 조각 사이를 잇고 맞추는 데 새 비용이 든다 (오버헤드 · 조율 오버헤드)
- **보이지 않게 되는 값** — 층이 늘어난 만큼 실제 동작이 눈에서 멀어진다 (간접 참조 증가 · 오용 가능성)
- **사람 쪽 값** — 원칙을 제대로 쓰기까지 익히는 시간이 든다 (학습 곡선)

핵심은 "쪼개지 말라"가 아니라 **"얼마나"에 답이 정해져 있지 않다**는 것이다. 앞 질문의 이점은 조각 안을 단순하게 만들고, 이 질문의 비용은 조각 사이를 복잡하게 만든다. 둘의 합이 가장 작아지는 지점이 그 상황의 적정선이고, 그 지점은 시스템마다 다르다.

판단이 갈릴 때 물어볼 것은 하나다 — 지금 긋는 이 선이 **실제로 따로 바뀔 것들**을 가르고 있는가. 함께 바뀌는 것을 갈라놓으면 얻는 것 없이 값만 치른다.

---

# 함수 하나에 관심사 분리를 적용하려면 무엇을 해야 하는가?

## 도입

앞까지가 "왜"와 "어디까지"였다면, 여기서부터는 손을 어떻게 움직이는지다. 대상은 가장 작은 단위인 함수 하나다.

여섯 가지 지침이 나오는데, 성격이 조금씩 다르다. 무엇을 맡길지 정하는 것, 정한 것을 이름으로 드러내는 것, 함수 바깥에 손대지 않는 것, 쪼갠 뒤 다시 합치는 것, 그리고 그 결과가 확인하기 쉬워진다는 것이다.

---

## 본문

### 하나만 맡긴다

> Single Responsibility Principle (SRP): Each function should ideally have a single responsibility or concern. This means that a function should focus on performing one specific task or action. For example, a function responsible for calculating the total price of items in a shopping cart should not also handle formatting the output for display.

"단일 책임 원칙(SRP): 각 함수는 이상적으로 하나의 책임 또는 관심사만 가져야 한다. 이는 함수가 하나의 구체적인 작업이나 동작을 수행하는 데 집중해야 한다는 뜻이다. 예를 들어 장바구니에 담긴 상품들의 총액을 계산하는 함수는 그 결과를 화면 표시용으로 서식화하는 일까지 맡아서는 안 된다."

- **Single Responsibility Principle(단일 책임 원칙)**: 하나의 단위는 한 가지 책임만 진다는 원칙. 관심사 분리를 함수·클래스 크기로 좁혀 적용한 형태로 볼 수 있다.
- **ideally**: "이상적으로". 현실에서는 항상 지켜지지 않는다는 걸 원문 스스로 인정하는 단어다.
- **total price / formatting**: 이 예시가 좋은 건 두 일이 함께 바뀌지 않기 때문이다. 할인 규칙이 바뀌면 계산만 바뀌고, 통화 표기가 바뀌면 서식만 바뀐다.

```js
// 두 가지를 겸하는 함수 — 총액 계산 + 화면 표시용 서식
function getCartTotal(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `${total.toLocaleString()}원`;   // ← 계산 결과가 문자열로 나가버린다
}
```

문자열로 나가는 순간 이 결과로는 아무 계산도 못 한다. 배송비를 더하려면 원 표시를 떼고 콤마를 지워 숫자로 되돌려야 한다. 두 일을 겸한 값이 이렇게 청구된다.

```js
// 갈라놓은 뒤 — 계산은 숫자를, 서식은 문자열을 낸다
function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatPrice(amount) {
  return `${amount.toLocaleString()}원`;
}
```

> Encapsulating Logic: Functions should encapsulate related logic within themselves while keeping unrelated concerns separate. For example, if a function needs to perform data validation before processing input, the validation logic should be encapsulated within the function itself rather than spread across multiple functions or modules.

"로직 감싸기: 함수는 관련된 로직을 자기 안에 감싸 넣되, 무관한 관심사는 분리된 상태로 두어야 한다. 예를 들어 어떤 함수가 입력을 처리하기 전에 데이터 검증을 해야 한다면, 그 검증 로직은 여러 함수나 모듈에 흩어지지 않고 그 함수 안에 감싸여 있어야 한다."

- **related / unrelated**: 이 항목이 앞 항목의 반대 방향이라는 게 여기 있다. 앞이 "붙어 있는 것을 떼라"였다면 이건 "흩어진 것을 모아라"다. 두 힘이 같이 작동해야 경계가 제자리에 놓인다.
- **spread across**: 한 가지 일이 여러 자리에 조금씩 나뉘어 있는 상태. 고칠 때 전부 찾아 고쳐야 하므로 빠뜨리기 쉽다.

관심사 분리를 "나누기"로만 읽으면 이 항목이 모순처럼 보인다. 기준을 다시 보면 어긋나지 않는다 — 칼금은 역할을 따라 긋는 것이므로, 같은 역할에 속한 것은 나누는 게 아니라 모아야 한다.

### 이름으로 드러낸다

> Clear and Descriptive Naming: Functions should have clear and descriptive names that reflect their purpose or concern. This makes it easier for developers to understand the function's behavior without needing to inspect its implementation.

"명확하고 설명적인 이름 짓기: 함수는 그 목적이나 관심사를 반영하는 명확하고 설명적인 이름을 가져야 한다. 이렇게 하면 개발자가 구현을 들여다보지 않고도 함수의 동작을 이해하기 쉬워진다."

- **descriptive**: 무엇을 하는지가 이름만으로 드러나는 것. `handleData`처럼 아무 함수에나 붙을 수 있는 이름은 여기 못 든다.
- **without needing to inspect its implementation**: 이 구절이 이름 짓기가 관심사 분리에 속하는 이유다. 나눠놨어도 이름이 모호하면 결국 안을 열어봐야 하고, 그러면 "한 조각만 보면 된다"는 이익이 사라진다.

이름은 판정 도구로도 쓰인다. 함수 이름에 "그리고"가 들어가야 정확해진다면 — `validateAndSubmit` 같은 — 그 함수는 두 가지를 맡고 있다는 신호다.

### 바깥에 손대지 않는다

> Avoiding Side Effects: Functions should ideally be free of side effects, meaning they should not modify any state outside their scope or have unintended consequences beyond their intended purpose. This promotes SoC by ensuring that each function's behavior is predictable and isolated from other parts of the system.

"부수효과 피하기: 함수는 이상적으로 부수효과가 없어야 한다. 즉 자신의 스코프 바깥에 있는 상태를 변경하거나, 의도한 목적을 넘어서는 결과를 일으키지 않아야 한다는 뜻이다. 이는 각 함수의 동작이 예측 가능하고 시스템의 다른 부분으로부터 격리되도록 보장하여 SoC를 촉진한다."

- **outside their scope**: 함수가 자기 안에서 만든 값이 아니라, 바깥에 있어 다른 코드도 보고 있는 값.
- **predictable**: 같은 입력에 같은 결과. 바깥 상태를 건드리면 호출 순서에 따라 결과가 달라져 예측이 깨진다.
- **isolated from other parts**: 이 함수를 부른 결과가 이 함수의 반환값 안에서 끝나는 상태.

부수효과를 줄이면 왜 좋은지는 함수형 프로그래밍 쪽에서 이미 다룬 이야기지만, 여기서 걸리는 지점은 조금 다르다. 함수가 바깥 상태를 건드리는 순간 "이 함수 하나만 읽으면 된다"가 성립하지 않는다. 그 함수의 영향이 반환값 바깥으로 새어 나가므로, 읽는 사람은 어디까지 번지는지를 따라가야 한다. 분리해놓은 경계에 구멍이 나는 셈이다.

### 쪼갠 뒤 다시 합친다

> Modularization and Composition: Complex tasks can often be broken down into smaller, more manageable functions, each addressing a specific concern. These functions can then be composed together to achieve the desired behavior, following the principles of modularization and separation of concerns.

"모듈화와 합성: 복잡한 작업은 각각 특정 관심사를 다루는 더 작고 다루기 쉬운 함수들로 쪼갤 수 있는 경우가 많다. 그런 다음 이 함수들을 모듈화와 관심사 분리의 원칙에 따라 합성하여 원하는 동작을 만들어낸다."

- **composed together**: 쪼개기만 하고 끝나지 않는다는 게 이 항목의 요점이다. 쪼갠 조각들이 다시 하나의 동작으로 모여야 하고, 그 모으는 자리도 따로 있다.
- **desired behavior**: 사용자가 보는 최종 동작. 쪼개기 전과 쪼갠 뒤가 같아야 한다.

```js
// 쪼갠 조각들을 다시 합치는 자리
function renderCartTotal(items) {
  return formatPrice(getCartTotal(items));
}
```

`renderCartTotal`은 계산도 서식도 직접 하지 않는다. 순서만 정한다. 이 함수의 관심사는 "무엇을 어떤 순서로 부를 것인가"이고, 그것도 하나의 관심사다.

### 확인이 쉬워진다

> Testing and Debugging: Applying SoC to functions makes it easier to write focused unit tests that verify each concern independently. By isolating concerns within functions, developers can test each concern in isolation, facilitating easier debugging and maintenance.

"테스트와 디버깅: 함수에 SoC를 적용하면 각 관심사를 독립적으로 검증하는 초점 맞춰진 유닛 테스트를 쓰기 쉬워진다. 관심사를 함수 안에 격리해두면 개발자가 각 관심사를 따로 테스트할 수 있어, 디버깅과 유지보수가 쉬워진다."

- **verify each concern independently**: 하나를 확인하는 데 나머지가 필요 없는 상태.
- **in isolation**: 다른 것을 준비하지 않고 그것만 놓고. 앞의 `getCartTotal`은 배열만 넣으면 확인되고, `formatPrice`는 숫자만 넣으면 확인된다.

이 항목은 지침이라기보다 앞 다섯 개가 지켜졌는지 알려주는 신호에 가깝다. 함수 하나를 테스트하는데 준비할 것이 자꾸 늘어난다면, 그 함수가 여러 관심사에 걸쳐 있다는 뜻이다.

---

## 종합

여섯 지침은 손을 움직이는 순서로 다시 세울 수 있다.

- 이 함수가 무엇을 맡을지 하나로 정한다 (단일 책임)
- 그 하나에 속하는 것들은 안으로 모은다 (로직 감싸기)
- 정해진 그 하나를 이름에 드러낸다 (명확한 이름)
- 함수의 영향이 반환값 바깥으로 새지 않게 막는다 (부수효과 피하기)
- 쪼갠 조각들은 따로 합치는 자리에서 다시 엮는다 (모듈화와 합성)

방향이 반대인 두 항목이 함께 있다는 점을 놓치기 쉽다. 단일 책임은 붙은 것을 떼라 하고, 로직 감싸기는 흩어진 것을 모으라 한다. 모순이 아니라 같은 기준의 양면이다 — 기준은 언제나 역할이고, 역할이 다르면 떼고 같으면 모은다.

장바구니 예시가 이 기준을 그대로 보여준다. 총액 계산과 화면 서식은 함께 바뀌지 않으므로 갈라야 하고, 입력 검증과 그 검증을 쓰는 처리는 한 흐름이므로 흩뜨리지 않는다.

마지막 항목은 지침이 아니라 자가 진단이다. 함수 하나를 테스트하는 데 준비물이 많다면 그 함수는 아직 여러 가지를 맡고 있다.

---

# 시스템 설계에 관심사 분리를 적용하려면 무엇을 해야 하는가?

## 도입

앞 질문이 함수 하나였다면 여기서는 시스템 전체가 대상이다. 다루는 단위가 커졌을 뿐 기준은 같다 — 역할을 따라 가른다.

네 가지가 나온다. 앞의 셋(층으로 나누기, 컴포넌트로 나누기, 사이에 계약을 두기)은 규모만 다를 뿐 지금까지의 이야기와 같은 결이다. 마지막 하나인 **횡단 관심사**는 성격이 다르다 — 층으로도 컴포넌트로도 나뉘지 않는 것들을 어떻게 다룰지의 문제이고, 이 문서에서 새로 들어오는 개념이다.

---

## 본문

### 층으로 나눈다

> Layered Architecture: Divide the system into layers, each responsible for a specific concern or aspect of functionality. Common layers include presentation/UI, business logic, data access, and infrastructure. This promotes modularity and allows for easier maintenance and scalability.

"계층형 아키텍처: 시스템을 층으로 나누고, 각 층이 특정 관심사나 기능의 한 측면을 책임지게 한다. 흔한 층으로는 표현/UI, 비즈니스 로직, 데이터 접근, 인프라가 있다. 이는 모듈성을 높이고 유지보수와 확장을 쉽게 해준다."

- **layers**: 위아래로 쌓인 구조. 위층은 아래층을 부르고 아래층은 위층을 모른다는 방향성이 핵심이다. 방향이 지켜지지 않으면 층을 나눈 의미가 사라진다.
- **presentation/UI**: 사용자에게 보여주고 입력을 받는 층.
- **business logic**: 그 서비스가 무엇을 하는지에 해당하는 규칙. 화면이 웹이든 앱이든 바뀌지 않는 부분이다.
- **data access**: 데이터를 어디서 어떻게 가져오고 저장하는지.
- **infrastructure**: 서비스 내용과 무관하게 돌아가는 데 필요한 것들(네트워크·파일·외부 시스템 연결).

층을 나누는 이유는 각 층이 서로 다른 이유로 바뀌기 때문이다. 화면 디자인이 바뀌는 사건과 할인 정책이 바뀌는 사건과 데이터베이스를 갈아타는 사건은 서로 따로 일어난다. 따로 바뀌는 것을 따로 두면 하나가 바뀔 때 나머지를 안 건드린다.

> Component-Based Design: Design the system as a collection of reusable, self-contained components, each addressing a specific concern. Components can be combined and composed to build larger systems, promoting reusability and maintainability.

"컴포넌트 기반 설계: 시스템을 각각 특정 관심사를 다루는, 재사용 가능하고 자족적인 컴포넌트들의 모음으로 설계한다. 컴포넌트들은 결합·합성되어 더 큰 시스템을 이룰 수 있고, 이는 재사용성과 유지보수성을 높인다."

- **self-contained**: 동작에 필요한 것을 자기 안에 갖추고 있어 다른 것을 전제하지 않는 상태. 이것이 성립해야 다른 자리로 옮겨도 동작한다.
- **combined and composed**: 앞 질문에서 함수를 합쳤던 것과 같은 이야기가 컴포넌트 규모에서 반복된다.

층과 컴포넌트는 자르는 방향이 다르다. 층은 가로로, 컴포넌트는 세로로 자른다고 보면 된다. 둘은 배타적이지 않고 보통 함께 쓰인다.

### 사이에 계약을 둔다

> Clear Interfaces and Contracts: Define clear interfaces and contracts between different components or layers of the system. This helps to encapsulate implementation details and promotes loose coupling between modules, making the system more adaptable to change.

"명확한 인터페이스와 계약: 시스템의 서로 다른 컴포넌트나 층 사이에 명확한 인터페이스와 계약을 정의한다. 이는 구현 세부사항을 감싸는 데 도움이 되고 모듈 사이의 느슨한 결합을 촉진하여, 시스템이 변화에 더 잘 적응하게 만든다."

- **interface**: 바깥에 내놓는 창구. 무엇을 받고 무엇을 돌려주는지까지만 드러낸다.
- **contract(계약)**: 그 창구를 통해 지키기로 한 약속. 입력 형태와 출력 형태뿐 아니라 "이럴 때는 이런 에러가 난다" 같은 조건까지 포함한다. 안쪽 구현이 바뀌어도 이 약속이 유지되면 바깥은 안 깨진다.
- **implementation details**: 안에서 어떻게 해내는지. 창구를 쓰는 쪽이 몰라도 되는 것이며, 몰라야 안쪽을 자유롭게 고칠 수 있다.
- **adaptable to change**: 변화에 적응하는 정도. 계약이 없으면 안쪽을 고칠 때마다 그것을 쓰는 모든 자리를 함께 고쳐야 한다.

경계를 그어놓고 계약을 두지 않으면 분리가 이름뿐인 상태가 된다. 폴더는 나뉘어 있는데 서로의 내부 파일을 직접 꺼내 쓰고 있다면, 그 경계는 그어지지 않은 것과 같다.

### 어느 층에도 안 들어가는 것들 — 횡단 관심사

> Separate Cross-Cutting Concerns: Identify and separate cross-cutting concerns, such as logging, security, and error handling, from the core business logic of the system.

"횡단 관심사 분리: 로깅, 보안, 에러 처리 같은 횡단 관심사를 식별하여 시스템의 핵심 비즈니스 로직으로부터 분리한다."

- **cross-cutting concerns(횡단 관심사)**: 하나의 층이나 모듈에 들어가지 않고, 여러 층을 가로질러 곳곳에 나타나는 관심사. `cross-cutting`은 "가로질러 자른다"는 뜻이며, 층이 가로로 쌓여 있는 그림에서 이것들이 세로로 관통하는 모습을 가리킨다.
- **Identify**: 분리에 앞서 알아보는 일이 먼저 온다. 이런 관심사들은 원래 코드 곳곳에 섞여 들어가 있어 눈에 잘 안 띈다.
- **core business logic**: 그 서비스가 실제로 하려는 일. 로깅과 보안은 필요하지만 서비스가 하려는 일 자체는 아니다.

왜 이것들만 따로 다루는지가 이 항목의 요점이다. 주문 처리는 "주문"이라는 자리 하나에 들어간다. 그런데 로그 남기기는 주문에도, 결제에도, 조회에도, 로그인에도 필요하다. 보안 검사도, 에러 처리도 마찬가지다. 곧 이것들은 **어느 한 자리에 넣을 수 없는 관심사**다.

```
층으로 나눈 시스템을 세로로 관통하는 것들

                      로깅   보안   에러 처리
                       │      │       │
┌──────────────────────┼──────┼───────┼──────┐
│ 표현 / UI            │      │       │      │
├──────────────────────┼──────┼───────┼──────┤
│ 비즈니스 로직         │      │       │      │
├──────────────────────┼──────┼───────┼──────┤
│ 데이터 접근           │      │       │      │
├──────────────────────┼──────┼───────┼──────┤
│ 인프라               │      │       │      │
└──────────────────────┴──────┴───────┴──────┘

층 = 가로로 자름 (각자 자기 자리가 있음)
횡단 관심사 = 세로로 관통 (자기 자리가 없음)
```

그냥 두면 어떻게 되는지가 문제의 크기를 보여준다. 로그 한 줄, 권한 확인 한 줄이 모든 함수 앞뒤에 붙는다. 함수 열 개면 열 곳, 백 개면 백 곳이다. 그리고 로그 형식이 한 번 바뀌면 그 백 곳을 전부 고쳐야 한다.

```js
// 흩어져 있을 때 — 실제 하는 일 한 줄에 부대 코드가 앞뒤로 붙는다
async function createOrder(user, items) {
  console.log('createOrder 시작', user.id);        // ← 로깅
  if (!user.isAuthenticated) throw new Error('...'); // ← 보안
  try {
    const order = await orderRepository.save(user, items);  // ← 실제 하는 일
    console.log('createOrder 완료', order.id);      // ← 로깅
    return order;
  } catch (e) {
    console.error('createOrder 실패', e);           // ← 에러 처리
    throw e;
  }
}
```

주문을 만드는 함수인데 주문에 관한 줄은 한 줄뿐이다. 나머지는 다른 함수에도 거의 같은 모양으로 복사되어 있을 코드다.

> Use aspect-oriented programming (AOP) or other techniques to modularize and encapsulate these concerns.

"이러한 관심사를 모듈화하고 감싸기 위해 관점 지향 프로그래밍(AOP)이나 다른 기법을 사용한다."

- **aspect-oriented programming(관점 지향 프로그래밍, AOP)**: 이런 횡단 관심사를 한 곳에 따로 정의해두고, "어느 함수들에 적용할지"를 별도로 지정해 자동으로 끼워 넣는 방식. 로깅 코드를 함수마다 쓰지 않고 한 번만 쓴 다음 "이 범위의 모든 함수에 적용"이라고 선언하는 식이다.
- **or other techniques**: AOP가 유일한 답이 아니라는 여지를 원문이 열어두고 있다. 실제로 프런트엔드에서는 AOP라는 이름 대신 다른 도구가 같은 일을 한다.

JavaScript 생태계에서 같은 일을 하는 자리를 보면 감이 잡힌다. 요청마다 붙는 인증 헤더와 에러 처리는 각 호출부가 아니라 HTTP 클라이언트의 인터셉터에 한 번 쓰고, 컴포넌트 곳곳의 예외는 각 컴포넌트가 아니라 상위의 에러 경계(Error Boundary) 한 곳이 받는다. 둘 다 "곳곳에 필요한 일을 한 자리에 모아두고 나머지는 그 존재를 모르게 한다"는 같은 해법이다.

```js
// 한 자리에 모아두었을 때 — 함수는 자기 일만 남는다
async function createOrder(user, items) {
  return orderRepository.save(user, items);
}

// 로깅·보안·에러 처리는 호출을 감싸는 한 곳에서 처리한다
const createOrderSafely = withLogging(withAuth(createOrder));
```

여기서 `createOrder`는 로그가 남는다는 사실조차 모른다. 로그 형식을 바꾸려면 `withLogging` 한 곳만 고치면 되고, 주문 로직을 고치는 사람은 로깅 코드를 읽지 않는다. 앞 질문들에서 본 이익이 그대로 나타나는 자리다.

---

## 종합

시스템 규모에서의 적용은 네 걸음이다.

- 서로 다른 이유로 바뀌는 것들을 층으로 가른다 (계층형 아키텍처)
- 각자 홀로 설 수 있는 조각으로 묶는다 (컴포넌트 기반 설계)
- 그 사이에 지켜질 약속을 정의한다 (명확한 인터페이스와 계약)
- 어느 칸에도 안 들어가는 것들을 따로 걷어낸다 (횡단 관심사 분리)

앞의 셋은 함수 규모에서 하던 일과 같다. 역할을 따라 가르고, 가른 것들 사이의 창구를 정한다. 단위가 함수에서 층·컴포넌트로 커졌을 뿐이다.

넷째만 종류가 다르다. 앞의 셋이 "무엇을 어디에 넣을까"의 문제라면, 횡단 관심사는 **넣을 칸이 없는 것**을 다룬다. 로깅·보안·에러 처리는 특정 층의 일이 아니라 모든 층에서 필요하므로, 자리를 정해주는 방식으로는 해결되지 않는다. 그래서 해법도 다르다 — 어딘가에 넣는 대신 한 자리에 모아두고, 필요한 곳에 바깥에서 씌운다.

인터셉터와 에러 경계를 이미 그렇게 쓰고 있다면 이 항목은 새 기법이 아니라 그 습관에 붙는 이름이다. 이름을 알아두면 판단 시점이 앞당겨진다. 같은 코드가 세 번째 함수에 복사되는 순간 "이건 횡단 관심사인가"를 묻게 되고, 맞다면 세 자리에 흩뿌리는 대신 한 자리로 걷어낼 수 있다.

---

# 모든 layer 컴포넌트에서 hooks(useContext/useQuery/useSelector 등)를 직접 호출하면 책임 분리가 깨지는가?

## 도입

전통적인 SoC(Separation of Concerns) 시각에서는 컴포넌트가 "그리기"와 "데이터 가져오기"를 동시에 하면 책임이 섞인다고 본다. 그러나 hooks 등장 이후 같은 사실을 두 가지 방식으로 해석할 수 있게 되었다. OA의 결론은 단정이 아니라 "tradeoffs"다.

---

## 본문

> In summary, it's all tradeoffs. There is no free lunch.

"요약하면, 모든 것은 트레이드오프다. 공짜 점심은 없다."

- **tradeoffs**: X를 얻으려면 Y를 포기해야 하는 맞바꿈 관계. "이 방식이 항상 옳다"는 답은 존재하지 않는다.
- **no free lunch**: 모든 면에서 좋기만 한 선택은 없다. 특정 아키텍처를 선택하면 그에 따른 비용이 항상 따라온다.

> What might work in one situation might not work in others.

"한 상황에서 작동하는 것이 다른 상황에서는 작동하지 않을 수 있다."

hooks 직접 호출도 마찬가지다. `<TodoList>`에서 `useQuery`를 직접 호출하는 건 자연스럽지만, `<Button>`에서 특정 쿼리를 호출하면 재사용성이 망가진다.

> Should a reusable Button component do data fetching? Probably not.

"재사용 가능한 Button 컴포넌트가 데이터 패칭을 해야 하는가? 아마도 아닐 것이다."

- **reusable Button component**: Button은 어떤 데이터든 받아 쓸 수 있어야 재사용 가치가 있다. 특정 쿼리에 묶이면 그 쿼리가 있는 맥락에서만 쓸 수 있게 되어 재사용 가치가 사라진다.

> Does it make sense to split your Dashboard into a DashboardView and a DashboardContainer that passes data down? Also, probably not.

"Dashboard를 DashboardView와 DashboardContainer로 나눠서 데이터를 내려보내는 것이 말이 되는가? 아마도 아닐 것이다."

- **DashboardView and DashboardContainer**: hooks 이전의 smart-vs-dumb 패턴. Container가 데이터를 받아 View에 props로 내려주는 방식. hooks로 직접 데이터를 가져올 수 있는 지금, 이 분리는 보일러플레이트만 늘어난다.

> So it's on us to know the tradeoffs and apply the right tool for the right job.

"따라서 트레이드오프를 알고 상황에 맞는 도구를 적용하는 것은 우리의 몫이다."

- **right tool for the right job**: 단일 규칙으로 환원 불가능하다는 뜻이다.

```
hooks 직접 호출의 두 해석

"더 결합됨 (Coupled)"            "더 독립적 (Independent)"
  컴포넌트가 특정                  트리 어디 둬도 알아서 동작
  QueryClient/Store에 직접 의존    부모가 props로 내려줄 필요 없음

→ 어느 쪽이 맞다고 단정 불가 → tradeoffs

안티패턴 (판단이 비교적 명확한 경우)
  <Button useQuery 직접 호출>  No — 재사용성 파괴
  <Dashboard> → DashboardView + DashboardContainer  No — hooks로 이미 해결됨
```

---

## 종합

"hooks를 컴포넌트에서 직접 호출하면 SoC가 깨지는가?"에 단일 답은 없다. 컴포넌트의 본래 책임에 부합하는가, 재사용성이 핵심인가, 분리가 도메인 경계를 따르는가를 각 상황마다 판단해야 한다. 시니어가 코드리뷰에서 "이 결정의 tradeoff가 뭐예요?"라고 물을 때, "X를 얻기 위해 Y를 포기했습니다" 형태로 답할 수 있으면 충분하다. "X가 항상 정답이에요"라는 단언은 설계 경험 부족의 신호다 — 정답 대신 tradeoff를 명확히 이해하는 것이 목표다.
