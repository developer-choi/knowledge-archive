# 잘못된 추상화(the wrong abstraction)는 어떤 과정을 거쳐 만들어지는가?

## 도입

잘못된 추상화는 누가 실수해서 태어나지 않는다. 중복을 발견해 정리하고, 새 요구사항이 오면 기존 구조를 지키려 애쓰는 성실한 판단이 차례로 쌓여서 만들어진다. 그래서 이 과정은 개인의 실력 문제가 아니라 정해진 경로를 밟는다. 아래 순서를 알아두면 지금 내가 그 경로의 몇 번째 칸에 서 있는지 알아챌 수 있다.

---

## 본문

### 처음에는 옳은 정리였다

> Programmer A sees duplication.

개발자 A가 중복을 발견한다.

- **duplication**: 같은 코드가 여러 곳에 그대로 반복돼 있는 상태

> Programmer A extracts duplication and gives it a name.

개발자 A가 그 중복을 뽑아내고 이름을 붙인다.

- **extracts**: 흩어져 있던 공통 부분을 한 군데로 뽑아내는 것

> This creates a new abstraction. It could be a new method, or perhaps even a new class.

이렇게 해서 새로운 추상화가 하나 생긴다. 그것은 새 메서드일 수도 있고, 어쩌면 새 클래스일 수도 있다.

- **abstraction**: 흩어진 공통 코드를 하나로 묶어 이름을 붙인 것

> Programmer A replaces the duplication with the new abstraction.

개발자 A가 중복돼 있던 자리를 그 새 추상화로 갈아 끼운다.

여기까지는 교과서적으로 옳은 정리다. 이 단계에서 잘못된 것은 없다.

### "거의 맞는" 요구사항이 도착한다

> A new requirement appears for which the current abstraction is almost perfect.

새 요구사항이 하나 등장하는데, 지금 있는 추상화가 그 요구에 거의 딱 맞는다.

- **almost perfect**: 딱 맞지는 않고 "거의" 맞는다는 것. 이 한 단어가 뒤이은 파국의 출발점이다

완전히 안 맞으면 새로 만들었을 것이고, 완전히 맞으면 그냥 썼을 것이다. 문제는 하필 거의 맞을 때 생긴다.

> Programmer B feels honor-bound to retain the existing abstraction, but since isn't exactly the same for every case, they alter the code to take a parameter, and then add logic to conditionally do the right thing based on the value of that parameter.

개발자 B는 기존 추상화를 지켜야 한다는 의무감을 느끼지만, 모든 경우에 똑같이 맞지는 않으므로 코드가 파라미터를 하나 받도록 고치고, 그 파라미터 값에 따라 상황에 맞는 동작을 골라 하도록 조건 분기를 덧붙인다.

- **honor-bound**: 지켜야 한다는 도의적 의무감에 묶인
- **retain**: 그대로 남겨 유지하다
- **parameter**: 함수가 받아들이는 인자. 여기서는 "지금 어느 경우인지"를 알려주는 스위치 역할
- **conditionally**: 조건에 따라 갈라서

이 선택이 나쁜 마음에서 나오지 않는다는 점이 중요하다. B는 중복을 만들지 않으려 하고 있고, 그건 배운 대로 행동하는 것이다.

### 두 번째부터가 문제다

> What was once a universal abstraction now behaves differently for different cases.

한때 모든 경우에 두루 통했던 추상화가, 이제는 경우에 따라 다르게 동작한다.

- **universal**: 모든 호출자에게 똑같이 통하는

이름은 하나인데 동작이 여러 개다. "이 함수가 무엇을 하는가"에 답하려면 이제 파라미터 값까지 알아야 한다.

> Loop until code becomes incomprehensible.

코드를 알아볼 수 없게 될 때까지 이 과정이 반복된다.

- **incomprehensible**: 읽어도 무슨 소린지 이해할 수 없는
- **Loop until**: 반복문 문법을 빌려, 이 사이클이 끝없이 돈다고 표현한 것

요구사항이 하나 늘 때마다 파라미터 하나와 조건 분기 하나가 늘어난다. 한 번의 증가는 늘 사소해 보이는데, 그 사소함이 쌓인 결과가 아무도 손대고 싶지 않은 함수다.

---

## 종합

경로는 넷으로 요약된다. 중복을 뽑아 이름을 붙였고, 나중에 거의 맞는 요구사항이 왔고, 기존 구조를 지키려고 파라미터와 조건 분기를 덧댔고, 그것이 요구사항 수만큼 반복됐다.

리모델링을 계속 덧댄 집과 같다. 벽을 하나 뚫을 때마다 판단은 합리적이었지만, 열 번 뚫은 뒤의 집은 아무도 도면을 못 그린다. 그래서 이 이야기의 교훈은 "처음에 잘 만들라"가 아니다. 처음에는 잘 만들었다.

---

# 이미 존재하는 코드는 개발자의 판단에 어떤 압력을 가하는가?

## 도입

앞의 경로에서 개발자 B가 왜 기존 추상화를 버리지 못했는지를 설명하는 대목이다. 답은 기술이 아니라 심리에 있고, 그 심리의 방향이 반직관적이다.

---

## 본문

### 있다는 사실만으로 정당해 보인다

> Existing code exerts a powerful influence. Its very presence argues that it is both correct and necessary.

이미 있는 코드는 강한 영향력을 행사한다. 그 코드가 거기 있다는 사실 자체가, 그것이 옳고 또 필요하다고 주장한다.

- **exerts influence**: 힘을 행사하다, 압력을 가하다
- **its very presence**: 다른 근거 없이 "존재한다는 것만으로". very가 presence를 강조한다
- **argues**: (사람이 아닌 것이) 무언가를 시사하다·설득하다

새 코드를 쓸 때는 근거를 요구받지만, 이미 있는 코드는 근거를 요구받지 않는다. 지우자고 말하는 쪽이 입증 책임을 진다.

### 이미 쓴 노력을 지키고 싶다

> We know that code represents effort expended, and we are very motivated to preserve the value of this effort.

우리는 코드가 이미 쏟아부은 노력의 결과물임을 알고 있고, 그 노력의 값을 지키고 싶은 마음이 매우 강하다.

- **effort expended**: 이미 써버린 노력
- **preserve**: 없어지지 않게 지키다

### 나쁠수록 버리기 어려워진다

> And, unfortunately, the sad truth is that the more complicated and incomprehensible the code, i.e. the deeper the investment in creating it, the more we feel pressure to retain it (the "sunk cost fallacy").

그리고 안타깝게도 슬픈 진실은, 코드가 복잡하고 알아보기 어려울수록 — 즉 그것을 만드는 데 들인 투자가 깊을수록 — 그것을 그대로 두려는 압박을 더 강하게 느낀다는 것이다("매몰 비용 오류").

- **i.e.**: 즉, 다시 말해
- **sunk cost fallacy**: 이미 써버려 되돌릴 수 없는 비용이 아까워서, 지금 손해인 선택을 계속 붙들고 있는 판단 착오

방향을 뒤집어 읽어야 한다. 상식적으로는 코드가 나쁠수록 버리기 쉬울 것 같은데, 실제로는 나쁠수록 버리기 어려워진다. 복잡함이 곧 "여기 얼마나 많은 시간이 들어갔겠나"의 증거로 읽히기 때문이다.

그래서 이 압력은 시간이 지날수록 세진다. 오늘 버리기 어려운 코드는 반년 뒤에 더 버리기 어렵다.

---

## 종합

버리지 못하게 붙드는 힘은 셋이다. 있다는 사실 자체가 주는 정당성, 이미 쓴 노력을 지키려는 마음, 그리고 복잡할수록 커지는 매몰 비용의 압박이다.

세 번째가 특히 위험하다. 품질이 나빠지는 것과 버리기 어려워지는 것이 같은 방향으로 움직이기 때문에, 방치하면 상황은 저절로 나아지지 않고 저절로 나빠진다.
