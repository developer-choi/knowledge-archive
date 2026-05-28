# Test Pyramid, Testing Honeycomb, Testing Trophy는 각각 테스트 유형의 비중에 대해 어떤 주장을 하는가?

## 도입

같은 코드베이스를 두고 "unit 테스트를 많이 써라"와 "integration 테스트를 많이 써라"가 동시에 존재한다. 이 두 입장을 형상화한 것이 Pyramid, Honeycomb, Trophy다. 세 도형은 동일한 테스트 유형을 다루지만, 각 유형의 비중에 대해 정반대의 처방을 내린다.

---

## 본문

> The pyramid argues that you should have most testing done as unit tests, the honeycomb and trophy instead say you should have a relatively small amount of unit tests and focus mostly on integration tests.

"피라미드는 대부분의 테스트를 unit test로 해야 한다고 주장하고, 허니컴과 트로피는 반대로 unit test를 상대적으로 적게 두고 integration test에 집중해야 한다고 말한다."

```
Test Pyramid          Testing Trophy / Honeycomb
     /\                    ___________
    /E2E\                 |   E2E     |  (소량)
   /------\               |-----------|
  /integra-\              | integration|  (최대)
 /----------\             |-----------|
/  unit unit \            | unit      |  (소량)
--------------            |___________|
                          | static    |
```

- **Test Pyramid**: unit을 가장 많이, 위로 갈수록 줄이는 전통 모델. 2009년 Mike Cohn이 제안.
- **Honeycomb**: integration 비중을 가장 크게 두는 모델. Spotify 엔지니어링에서 제안. 마이크로서비스 환경에서 개별 서비스 간 연동이 핵심이기 때문.
- **Trophy**: static → unit → integration → E2E 중 integration에 가장 큰 비중을 두는 모델. Kent C. Dodds 제안.
- **unit tests**: 내 코드만 격리해 테스트. 외부 의존성은 mock.
- **integration tests**: 내 코드와 별도 개발된 코드의 협동을 테스트.

---

## 종합

세 도형은 서로 다른 환경과 철학에서 나왔다. Pyramid는 빠르고 저렴한 unit을 최우선으로 쌓아올리는 구조고, Honeycomb/Trophy는 unit 단독으로는 연동 문제를 잡을 수 없다는 현실적 한계를 반영한다. 어떤 도형이 옳은지 논쟁하기 전에, 각 진영이 "unit"과 "integration"을 같은 의미로 쓰고 있는지부터 확인해야 한다 — 다음 질문에서 이 정의 문제가 논쟁의 근본 원인임을 다룬다.

---

---

# Martin Fowler는 pyramid vs honeycomb/trophy 논쟁이 왜 혼란스럽다고 보는가?

## 도입

도형 논쟁의 표면 아래에는 더 근본적인 문제가 있다. "unit test를 많이 써야 한다" vs "integration test를 많이 써야 한다"는 논쟁은, 두 진영이 서로 같은 단어로 다른 것을 말하고 있을 가능성이 높다. Fowler는 이 불투명함이 논쟁을 공허하게 만든다고 지적한다.

---

## 본문

> The second biggest issue I have with this discussion is that it's rendered opaque by the fact that it's not clear what people see as the difference between unit and integration tests.

"내가 이 논의에서 두 번째로 큰 문제로 보는 것은, 사람들이 unit test와 integration test의 차이를 어떻게 보는지가 불분명하다는 사실로 인해 논의가 불투명해진다는 점이다."

- **opaque**: 불투명한. 속을 들여다볼 수 없는 상태. 정의가 흐릿하면 논쟁의 실제 쟁점이 무엇인지 파악할 수 없다.

> The terms "unit test" and "integration test" have always been rather murky, even by the slippery standards of most software terminology.

"'unit test'와 'integration test'라는 용어는 소프트웨어 용어 대부분의 미끄러운 기준에 비추어 봐도 항상 꽤 탁해 왔다."

- **murky**: 탁해서 경계가 흐릿한. "unit"이 함수 단위인지, 모듈 단위인지, 팀 단위인지 사람마다 다르다.
- **slippery standards**: 소프트웨어 용어들은 원래 정의가 고정되지 않고 문맥에 따라 미끄러진다. "unit"은 그중에서도 특히 심한 사례다.

---

## 종합

Pyramid vs Trophy 논쟁은 비율 문제처럼 보이지만, 사실은 정의 문제다. A가 "unit test를 줄여야 한다"고 말할 때 A의 unit은 컴포넌트 단독 렌더링이고, B가 "unit test를 늘려야 한다"고 말할 때 B의 unit은 순수 함수 하나일 수 있다. 두 사람은 사실 같은 말을 하고 있을지 모른다. 도형을 고르기 전에 팀이 "unit"과 "integration"을 어떤 의미로 쓰기로 합의하는 것이 먼저다.

---

---

# "unit test"와 "integration test"라는 용어는 원래 어떤 문제를 구분하기 위한 말이었는가?

## 도입

지금은 unit test를 "격리된 테스트", integration test를 "여러 모듈을 합친 테스트"로 이해하지만, 이 기술적 정의는 후대에 붙여진 것이다. 원래 두 용어는 조직 프로세스 문제를 구분하기 위한 말이었다.

---

## 본문

> As I originally understood it, they were primarily an organizational issue. Let's go back to the days of large waterfall software projects. I'm working on a hunk of code for several months. I may be working on it alone, or in a small team. Either way I think of this hunk as a conceptual unit which we can work on in relative separation from its neighbors. Once we've finished coding it we can hand it off to the unit testing team, who then test that unit on its own. After a month or two to make those tests work, we can then integrate it with its neighbors and carry out integration tests against a larger part of the system, or indeed the entire system.

"내가 원래 이해한 바로는, 이것들은 주로 조직적 문제였다. 대규모 워터폴 소프트웨어 프로젝트 시대로 돌아가 보자. 나는 몇 달 동안 코드 뭉치 하나에 매달린다. 혼자 또는 소팀으로 작업한다. 어떤 식이든 이 뭉치를 이웃 코드와 비교적 분리해 작업할 수 있는 개념적 단위로 생각한다. 코딩이 끝나면 unit 테스팅 팀에 넘기고, 그들이 해당 unit을 단독으로 테스트한다. 그 테스트를 통과시키는 데 한두 달이 지나면, 이웃 코드와 통합하고 더 큰 시스템 또는 전체 시스템을 대상으로 integration test를 수행한다."

- **organizational issue**: 기술 구분이 아니라 어떤 조직이 언제 테스트하느냐의 문제. "unit = 내 팀 코드", "integration = 다른 팀 코드와 합친 것"이 원래 의미다.
- **waterfall**: 설계→구현→테스트를 순차 진행하는 전통 개발 방식. 각 단계가 몇 달씩 걸리고, 테스트는 코딩이 끝난 후 별도 팀이 수행한다.
- **hunk**: 한 팀이 몇 달간 붙잡는 큼직한 코드 뭉치. 오늘날의 "모듈" 또는 "서비스"에 해당한다.
- **hand off**: 다음 담당 조직에게 공을 넘기는 행위. 워터폴에서 개발팀 → 테스트팀으로의 인계.
- **integrate**: 이웃 모듈(다른 팀 코드)과 합치는 행위.

---

## 종합

워터폴 시대에 "unit"은 크기가 아니라 담당 팀이 정의했다. 내 팀 코드 덩어리 = unit, 다른 팀 코드와 합친 것 = integration. 오늘날 쓰이는 "unit = 함수 하나", "integration = 여러 모듈"이라는 기술적 정의는 애자일·TDD 시대에 같은 단어에 덧씌워진 새 의미다. 단어가 같으니 혼동이 생기는 것이다. Fowler가 "murky하다"고 표현한 이유가 여기 있다.

---

---

# Fowler가 정리하는 unit test와 integration test의 본질적 구분은 무엇인가?

## 도입

정의의 혼란 속에서 Fowler는 자신의 기준을 명확히 제시한다. 핵심은 코드의 크기나 격리 수준이 아니라, 누가 개발한 코드인가라는 조직적 색채다.

---

## 본문

> The key distinction is that the unit tests test my/our code in isolation while integration tests how our code works with code developed separately.

"핵심 구분은 unit test는 내/우리 코드를 격리하여 테스트하는 반면, integration test는 우리 코드가 별도로 개발된 코드와 어떻게 작동하는지를 테스트한다는 것이다."

- **in isolation**: 협력 모듈 없이 내 코드만 실행. 외부 라이브러리, 다른 팀 코드, DB 없이.
- **developed separately**: 다른 조직, 다른 일정으로 개발된 코드. 외부 npm 패키지, 팀이 다른 마이크로서비스, DB 드라이버 등이 해당한다.

```
Fowler 기준
  Unit test    = 내가 짠 코드 A + 내가 짠 코드 B → 여전히 unit test
  Integration  = 내 코드 + 라이브러리/다른팀 코드 → integration test

Kent 기준 (testing-trophy.md 참조)
  Unit test    = individual, isolated parts (기술적 격리)
  Integration  = several units working together (기술적 조합)
```

---

## 종합

Fowler의 정의에서는 내가 작성한 코드 여러 개를 합친 테스트도 unit test다. React 컴포넌트 A가 같은 레포의 컴포넌트 B를 렌더링하더라도, 둘 다 내가 짰다면 Fowler 기준으로는 unit test다. 반면 같은 상황에서 Kent의 기준을 적용하면 여러 컴포넌트를 합친 순간 integration test가 된다. 이 차이가 "unit/integration을 얼마나 써야 하는가" 비율 논쟁에서 서로 다른 결론을 내리는 이유다.

---

---

# Kent Beck은 Xunit 계열에서 "unit test"를 어떻게 재정의했으며, 그 정의의 축은 이전의 조직적 정의와 어떻게 다른가?

## 도입

TDD와 함께 Xunit 프레임워크(JUnit, NUnit 등)가 등장하면서 "unit test"가 프로그래머의 일상 활동으로 들어왔다. Kent Beck은 이 맥락에서 unit test를 재정의했는데, 이전의 조직적 정의와 축이 다르다.

---

## 본문

> Many people today ran into unit tests as part of the Xunit family of testing tools, pioneered by Kent Beck as part of Extreme Programming. Kent used "unit test" to indicate tests written by developers as part of their day-to-day work.

"오늘날 많은 사람들이 Kent Beck이 익스트림 프로그래밍의 일환으로 개척한 Xunit 계열 테스팅 도구를 통해 unit test를 접했다. Kent는 'unit test'를 개발자들이 일상 업무의 일환으로 작성한 테스트를 가리키기 위해 사용했다."

- **Xunit**: JUnit, NUnit, pytest 등 Kent Beck의 설계를 공유하는 테스트 프레임워크 계보. "테스트도 코드다"를 실용적으로 구현한 도구들이다.
- **Extreme Programming**: Kent Beck이 주도한 애자일 방법론. TDD, pair programming, 짧은 반복 주기가 핵심이다.
- **day-to-day work**: 별도 테스트 조직이 아닌, 코드를 짜는 사람의 매일 활동. 기능을 만들면서 바로 테스트를 쓴다.

> Notice that in Kent's original formulation, "unit test" means anything written by the programmers as opposed to a separate testing team.

"Kent의 원래 정의에서 'unit test'는 별도 테스팅 팀과 달리 프로그래머가 작성한 모든 것을 의미한다."

- **formulation**: 개념을 말로 고정한 정의. Kent가 Extreme Programming Explained에서 명시적으로 표현한 것.
- **as opposed to**: 대조 관계. 별도 QA 팀이 쓴 것 vs 프로그래머가 직접 쓴 것.

```
워터폴 정의 축   → 누가 테스트하느냐 (조직 경계)
Kent 정의 축     → 누가 작성하느냐 (역할)
```

---

## 종합

워터폴에서 unit test는 "전담 테스트팀이 테스트하는 단위"였다. Kent의 재정의에서는 "프로그래머가 코딩하면서 직접 쓰는 테스트"가 됐다. 크기나 격리가 아니라 작성자 기준이므로, Kent 정의에서는 DB를 실제로 띄워 돌리는 테스트라도 프로그래머가 직접 썼다면 unit test다. 이 재정의가 TDD를 가능하게 했다 — 프로그래머가 기능을 구현하기 전에 테스트를 먼저 쓰는 것이 "unit test 작성"이 되었기 때문이다.

---

---

# Kent Beck이 말한 "프로그래머가 unit test를 쓴다"의 목적은 무엇인가?

## 도입

테스트를 왜 쓰는가라는 질문에 Kent Beck은 독특한 답을 내놓는다. 버그를 잡기 위해서가 아니라, 확신(confidence)을 코드베이스에 영구적으로 심기 위해서라는 것이다.

---

## 본문

> Programmers write unit tests so that their confidence in the operation of the program can become part of the program itself. Customers write functional tests so that their confidence in the operation of the program can become part of the program too. — Kent Beck (Extreme Programming Explained, 1st Edition)

"프로그래머는 프로그램 동작에 대한 자신의 확신이 프로그램 자체의 일부가 될 수 있도록 unit test를 작성한다. 고객은 프로그램 동작에 대한 자신의 확신도 프로그램의 일부가 될 수 있도록 기능 테스트를 작성한다."

- **confidence**: 코드가 제대로 동작한다는 주관적 확신. 개발자 머릿속에만 있으면 시간이 지나거나 사람이 바뀌면 사라진다.
- **operation of the program**: 프로그램이 실제로 수행하는 동작. "이 함수에 1을 넣으면 2가 나온다"는 확신.
- **become part of the program itself**: 확신이 실행 가능한 코드(테스트)로 굳어 저장소에 남는 것. 다음 빌드, 다음 개발자가 자동으로 재확인한다.

```
기존 방식
  개발자의 확신 → 머릿속 → 시간·퇴직과 함께 소멸

unit test 방식
  개발자의 확신 → 테스트 코드 → git에 커밋 → CI가 매 PR마다 재검증
```

---

## 종합

"버그를 잡는다"와 "확신을 코드베이스에 심는다"는 비슷해 보이지만 강조점이 다르다. 버그 잡기는 현재 시점의 문제를 해결하는 것이고, 확신 축적은 미래 개발자를 위한 지식 이전이다. 고객의 확신은 functional test(인수 테스트)가 담당하고, 개발자의 확신은 unit test가 담당한다. 두 형태의 테스트를 합치면 "코드베이스에 박힌 살아있는 명세"가 된다.
