---
tags: [ai, best-practice, performance]
source: official
---

## 대화에 한 번 들어온 파일이나 명령 출력은 그 뒤 턴에서 어떻게 되는가?

### 도입

용어 둘을 먼저 깔아둔다.

- **턴(turn)**: 모델에게 한 번 요청을 보내고 한 번 응답을 받는 왕복 1회.
- **컨텍스트(context)**: 그 한 번의 요청에 실려 나가는 입력 전체. 시스템 지시문·대화·읽은 파일·명령 출력이 전부 여기 들어간다.

여기서 흔히 어긋나는 직관이 하나 있다. 채팅창을 보면 내가 친 메시지와 답변이 위로 쌓여만 갈 뿐이라, 새로 친 한 줄만 서버로 날아갈 것 같다. 실제로는 모델이 이전 대화를 기억하고 있지 않아서, 매 턴 지금까지의 전부를 처음부터 다시 실어 보낸다.

---

### 본문

> The main thing to know here is that nothing gets sent just once.

여기서 알아야 할 핵심은 **한 번만 보내지는 것은 아무것도 없다**는 점이다.

- **nothing ... just once**: 부정문으로 못 박은 이유가 있다. "한 번 보냈으니 끝"이라는 직관이 처음부터 틀렸다는 것을 먼저 무너뜨리는 문장이다.

> Everything that ends up in the conversation, a file Claude read or the output of a command it ran, gets sent again on every turn after it, for the rest of the session.

대화에 **결국 들어앉은** 모든 것은, Claude가 읽은 파일이든 돌린 명령의 출력이든, 그 뒤 **모든 턴마다 다시** 보내지고, 그게 세션이 끝날 때까지 이어진다.

- **ends up in**: "결국 거기 들어앉는다"는 뉘앙스. 내가 의도해서 넣은 것뿐 아니라 Claude가 알아서 읽어들인 것까지 전부 포함된다는 점이 요점이다.
- **a file Claude read / the output of a command**: 대화를 불리는 두 가지 정체. 내가 타이핑한 글자보다 이쪽이 압도적으로 크다.
- **on every turn after it**: 한 번 들어오면 그 뒤 매 턴 반복이다. 그러니 비용은 "얼마나 큰가"만이 아니라 "언제 들어왔는가"로도 정해진다.

> Part of what's in the context is there before you type anything: the tool definitions, the system prompt, CLAUDE.md, and whatever else gets loaded at startup.

컨텍스트에 들어 있는 것 중 일부는 **내가 아무것도 타이핑하기 전부터** 거기 있다. 도구 정의, 시스템 프롬프트, CLAUDE.md, 그 밖에 시작할 때 불려오는 것들이다.

- **before you type anything**: 시작 시점의 컨텍스트가 이미 비어 있지 않다는 뜻. 첫 메시지부터 이 분량을 업고 출발한다.
- **tool definitions**: Read·Edit·Bash 같은 도구를 모델이 부를 수 있게 설명해둔 적어둔 규격. 종류가 많아 분량이 작지 않다.
- **loaded at startup**: 시작할 때 자동으로 딸려 들어오는 것들. MCP 서버처럼 내가 그 대화에서 안 쓸 것도 켜져 있으면 들어온다.

> It's cached, so each of those re-sends is cheap, but cheap isn't nothing, and it's taking up room in the context the model has to think around on every turn too.

그것들은 캐시되므로 다시 보내는 값 하나하나는 싸다. 하지만 **싼 것이 공짜는 아니고**, 게다가 모델이 매 턴 헤치고 생각해야 하는 컨텍스트의 자리를 차지하고 있기도 하다.

- **cheap isn't nothing**: 0.1배가 수십 턴 반복되면 결국 큰 값이 된다는 뜻.
- **taking up room**: 자리를 차지한다. 요금과 별개로 컨텍스트에는 담을 수 있는 총량 한도가 있다.
- **think around**: 관련 없는 내용을 피해 가며 생각한다는 뜻. 쓸모없어진 파일이 잔뜩 쌓이면 값만 드는 게 아니라 답의 품질도 떨어진다.

> That's really the whole cost model of a session: how many tokens end up in the context, how many turns they stay there, and how many contexts you're running at the same time.

이것이 사실상 대화 하나의 비용 모델 전부다. 셋으로 나뉜다.

- **how many tokens end up in the context**: 컨텍스트에 몇 개의 토큰이 들어앉는가. 파일을 크게 읽을수록 커진다.
- **how many turns they stay there**: 그것들이 몇 턴 동안 거기 머무는가. 일찍 들어온 것일수록 오래 머문다.
- **how many contexts you're running at the same time**: 동시에 몇 개의 컨텍스트를 돌리고 있는가. 창을 여러 개 띄우거나 서브에이전트를 쓰면 이 값이 곱해진다.

---

### 종합

대화 비용을 이해하는 출발점은 "매 턴 전부가 다시 나간다"는 사실 하나다. 모델은 이전 대화를 기억하지 않으므로, 20번째 턴의 요청 안에는 앞의 19턴이 통째로 들어 있다. 캐시 덕분에 그 반복분은 10분의 1 값으로 매겨지지만, 반복 횟수가 많으면 결국 여기가 대화 요금의 대부분을 차지한다.

그리고 그 컨텍스트는 내가 첫 글자를 치기 전부터 비어 있지 않다. 도구 정의·시스템 프롬프트·CLAUDE.md처럼 시작할 때 딸려오는 것들이 이미 자리를 잡고 있고, 그것들은 대화가 끝날 때까지 매 턴 함께 나간다.

비용을 좌우하는 것은 세 값의 곱이다.

- **양**: 컨텍스트에 들어앉은 토큰 수
- **머문 턴 수**: 그것이 몇 번 다시 실려 나가는가
- **동시에 돌리는 컨텍스트 수**: 창 여러 개, 서브에이전트

이 셋이 대화 비용을 줄이는 방법도 그대로 알려준다. 안 넣거나, 오래 두지 않거나, 여러 개를 동시에 돌리지 않는 것이다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 긴 세션 하나가 같은 일을 나눈 짧은 세션 여럿보다 비싼 이유는?

### 도입

앞에서 본 세 값 중 "몇 턴 동안 머무는가"를 정면으로 다루는 질문이다. 같은 분량의 일을 하는데도 세션을 하나로 길게 끄느냐 여러 개로 나누느냐에 따라 값이 달라지는데, 그 차이가 직관보다 훨씬 크다.

---

### 본문

> One long session costs more than the same work spread over a few short ones, and by more than you'd think, because turn 40 is also re-reading the 39 turns before it.

긴 세션 하나는 같은 일을 짧은 세션 몇 개로 나눈 것보다 값이 더 나가고, **생각보다 더** 나간다. 40번째 턴은 그 앞의 39턴을 함께 다시 읽고 있기 때문이다.

- **by more than you'd think**: 차이가 비례가 아니라는 뜻. 턴 수가 2배면 값은 4배 쪽에 가깝다. 매 턴이 그 앞의 전부를 업고 가기 때문이다.
- **re-reading**: 다시 읽는다. 요청을 받은 서버 입장에서는 40번째 요청도 처음 보는 긴 글 한 편이다.

> You want the context in your session to be short and relevant, so don't carry one task's context into the next: /clear when you start something new, and /compact when the earlier part of the same task is done.

컨텍스트는 **짧고 지금 하는 일에 관계있는** 상태로 유지하고 싶다. 그러니 한 작업의 맥락을 다음 작업으로 끌고 가지 않는다. 새로운 것을 시작할 땐 `/clear`, 같은 작업의 앞부분이 끝났을 땐 `/compact`.

- **short and relevant**: 조건이 둘이다. 짧기만 한 게 아니라 남아 있는 것이 지금 일과 관계있어야 한다.
- **carry ... into the next**: 앞 작업의 짐을 다음 작업으로 들고 간다는 뜻. 채팅창을 그대로 두고 다음 일을 시키면 자동으로 이렇게 된다.
- **/clear vs /compact**: 나누는 기준이 "일이 바뀌었는가"다. 다른 일이면 앞의 것이 전부 무관하니 비우고, 같은 일이면 앞부분의 결론은 필요하니 줄인다.

> Run /clear between tasks. This prevents prior irrelevant context from being sent back to the model, which can reduce token usage.

작업과 작업 사이에 `/clear`를 돌린다. 그러면 **이전의 무관한 맥락**이 모델로 다시 보내지는 것을 막아 토큰 사용량을 줄일 수 있다.

- **between tasks**: 실행 시점을 작업 경계로 못 박은 것. 시간이 아니라 일의 단위가 기준이다.
- **prior irrelevant context**: 이전 일에서 남은, 지금 일과 상관없는 내용. 값을 무는 것 중 제일 아까운 부류다.
- **sent back**: 되돌려 보내진다. 안 지우면 자동으로 계속 따라간다는 뉘앙스다.

#### 내가 타이핑하지 않는 사이에 도는 턴

> Keep an eye on turns that happen when you're not typing, too.

내가 타이핑하고 있지 않을 때 일어나는 턴도 **눈여겨봐 둔다**.

- **when you're not typing**: 내 손이 멈춰 있어도 요청은 나갈 수 있다는 뜻. 값이 드는데 화면을 안 보고 있으니 놓치기 쉽다.

> A /loop fires as a full turn in the session you set it up in, carrying that whole conversation with it every time, and if it's been more than an hour since the last turn, it's a cache miss on top.

`/loop`(정해진 간격으로 같은 명령을 반복 실행하는 기능)은 그것을 걸어둔 세션 안에서 **온전한 한 턴으로** 발사되며, 매번 그 대화 전체를 함께 싣고 간다. 게다가 직전 턴으로부터 한 시간이 넘었다면 캐시 불발까지 얹힌다.

- **fires as a full turn**: 가벼운 확인 작업이 아니라 보통의 턴과 똑같은 값이 든다는 뜻.
- **the session you set it up in**: 발사 위치가 걸어둔 그 세션이라는 것. 그 세션이 길면 반복마다 그 길이를 싣는다.
- **cache miss**: 캐시에서 못 찾아 전액으로 다시 계산하게 되는 것. 프롬프트 캐시는 한 시간이면 만료되는데, 간격이 넓은 반복은 매번 이 조건에 걸리기 쉽다.

> Start a fresh session in another terminal and run the loop from there.

다른 터미널에서 **새 세션**을 시작해 거기서 반복을 돌린다.

- **a fresh session**: 아무것도 안 쌓인 세션. 반복이 매번 싣고 가는 짐이 최소가 된다.
- **another terminal**: 지금 하던 작업을 방해하지 않으면서 분리하는 방법.

```
같은 /loop, 어디서 돌리느냐에 따라

작업 중인 세션에서   [시스템 프롬프트][대화 40턴 ──────][반복 명령]  ← 반복마다 40턴을 실어 나름
새 터미널의 새 세션   [시스템 프롬프트][반복 명령]                    ← 반복마다 이만큼만
```

---

### 종합

같은 분량의 일이라도 세션 하나로 이어 붙이면 값이 훨씬 더 나간다. 매 턴이 그 앞의 전부를 다시 싣고 나가므로, 턴이 쌓일수록 한 턴의 값 자체가 계속 커지기 때문이다. 40번째 턴은 40번째 요청이 아니라 "39턴짜리 글 + 새 한 줄"을 보내는 일이다.

그래서 처방이 두 가지로 갈린다.

- **일이 바뀌었을 때**: `/clear`. 앞의 것이 전부 무관하므로 통째로 비운다.
- **같은 일의 앞부분이 끝났을 때**: `/compact`. 결론은 필요하니 요약으로 줄여 들고 간다.

여기에 눈에 잘 안 띄는 항목이 하나 더 있다. 손을 놓고 있을 때 자동으로 도는 턴이다. 반복 실행을 작업 중인 세션 안에 걸어두면, 그 반복 하나하나가 그때까지 쌓인 대화 전체를 싣고 나간다. 간격이 한 시간을 넘으면 캐시마저 만료돼 매번 전액이 된다. 새 터미널에서 빈 세션을 열어 거기서 돌리면 두 문제가 함께 사라진다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## Claude가 세션에서 파일을 얼마나 많이 읽는지는 무엇이 좌우하는가?

### 도입

컨텍스트를 불리는 가장 큰 덩어리는 내가 친 글이 아니라 Claude가 읽어들인 파일이다. 그러면 그 양은 무엇으로 정해지는가. 파일 크기나 프로젝트 규모가 아니라, 내가 얼마나 정확히 말해줬는가로 정해진다.

---

### 본문

> How much Claude reads mostly comes down to how much it has to figure out on its own.

Claude가 얼마나 많이 읽는지는 대체로 **얼마나 많은 것을 스스로 알아내야 하는가**로 귀결된다.

- **comes down to**: 여러 요인이 있어 보여도 결국 이 하나로 수렴한다는 뜻.
- **figure out on its own**: 지시에 없어서 직접 찾아내야 하는 부분. 내가 안 알려준 만큼 Claude가 뒤진다.
- **mostly**: 예외가 아주 없진 않다는 여지. 다만 지배적인 요인은 이것이다.

> Nearly everything else that gets added during the session is tool results: the files Claude reads, and the output of the commands it runs.

대화가 진행되는 동안 추가되는 나머지 거의 전부는 **도구 결과**다. Claude가 읽는 파일들, 그리고 돌리는 명령의 출력.

- **nearly everything else**: 시작할 때 깔린 것을 빼면 나머지는 사실상 이것뿐이라는 뜻. 내가 타이핑하는 글자는 비중이 미미하다.
- **tool results**: Read·Bash 같은 도구를 실행하고 돌아온 내용. 대화에 붙는 방식은 내가 친 메시지와 똑같다.

> If you say "the tests are failing", it first has to find out which tests: a grep or two, a few files opened to see which one is relevant, and all of those results stay in the context long after they've stopped being useful.

"테스트가 실패하고 있어"라고만 말하면, Claude는 먼저 **어느 테스트인지**부터 알아내야 한다. grep을 한두 번 돌리고, 어느 게 관련 있는지 보려고 파일을 몇 개 열어본다. 그리고 그 결과 전부가 **쓸모없어진 뒤로도 한참 동안** 컨텍스트에 남아 있는다.

- **find out which**: 답을 만들기 전 단계에서 이미 값이 나간다는 것. 탐색 자체가 요금이다.
- **a few files opened to see which one is relevant**: 이 중 관련 있던 파일은 하나뿐인데, 아니었던 파일들도 똑같이 남는다.
- **stop being useful**: 목적을 다한 시점. 문제는 목적을 다해도 자동으로 빠지지 않고, 대화가 끝날 때까지 매 턴 실려 나간다는 것이다.

```
"테스트가 실패하고 있어"라고만 말했을 때

  grep 결과      ─┐
  파일 A 열어봄   │  ← 관련 없었음. 그래도 남는다
  파일 B 열어봄   │  ← 관련 없었음. 그래도 남는다
  파일 C 열어봄   ─┘  ← 이게 정답이었음
  ────────────────────────────────────────
  네 개 전부가 남은 모든 턴에 함께 실려 나감
```

---

### 종합

Claude가 읽는 양은 프로젝트 크기가 아니라 **내 지시에 빠진 정보의 양**에 비례한다. 어디를 봐야 하는지 안 알려주면 그만큼을 탐색으로 메우고, 그 탐색 흔적은 전부 대화에 남는다.

특히 아픈 지점은 탐색이 대부분 헛발질이라는 데 있다. 파일 넷을 열어 하나를 찾아냈다면 정답은 하나인데, 아니었던 셋도 똑같은 크기로 남아 남은 모든 턴에 함께 실려 나간다. 게다가 값만 무는 게 아니라 모델이 매 턴 헤치고 지나가야 하는 잡음이 되기도 한다.

뒤집으면 처방이 나온다. **아는 것은 먼저 말해준다.** 파일 이름을 알면 이름을 대고, 파일 자체를 갖고 있으면 파일을 직접 붙인다. 이어지는 질문에서 다루는 `@` 멘션이 바로 후자를 위한 장치다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 파일을 @로 멘션하면 경로를 타이핑할 때와 무엇이 달라지는가?

### 도입

파일 하나를 대화에 들여놓는 방법이 세 가지다. 아무 말도 안 해서 Claude가 찾아내게 두거나, 경로를 글자로 적어주거나, `@`로 붙이거나. 셋 다 결국 같은 파일이 컨텍스트에 들어오지만 거기까지 가는 값이 다르다.

---

### 본문

> "Fix the failing test in utils.test.ts" skips the searching and costs one Read call for the file, and "Fix the failing test in @utils.test.ts" doesn't cost the Read call either.

"`utils.test.ts`의 실패하는 테스트를 고쳐줘"라고 하면 **탐색 단계가 통째로 생략**되고 그 파일을 읽는 Read 호출 한 번의 값만 든다. 그리고 "`@utils.test.ts`의 실패하는 테스트를 고쳐줘"라고 하면 **그 Read 호출마저 안 든다**.

- **skips the searching**: 이름을 대는 것만으로 탐색 구간이 사라진다. 여기서 가장 큰 절약이 일어난다.
- **costs one Read call**: 이름을 알려줘도 여는 일 자체는 남는다는 뜻. 도구 호출 한 번이 곧 요청 한 번이다.
- **doesn't cost ... either**: 마지막 한 단계까지 없어진다. 이름 대기와 `@` 멘션의 차이가 이 한 번이다.

> @-mention files instead of naming them. The file gets attached to your message directly, which saves a Read call, or a search if Claude has to go find it.

파일을 이름으로 부르는 대신 `@`로 멘션한다. 그러면 그 파일이 **내 메시지에 직접 첨부**되어, Read 호출 한 번을 아끼고, Claude가 찾아나서야 했을 상황이라면 탐색까지 아낀다.

- **attached to your message directly**: 첨부. Claude가 도구로 가지러 가는 게 아니라 내 메시지에 이미 붙어 있는 상태로 출발한다.
- **saves a Read call**: 도구 호출 한 번이 요청 한 번이므로, 요청 하나가 통째로 사라진다.

> Tip: when you're referring to a file, @-mention it instead of typing the path. Claude Code attaches the file to your message before anything gets sent, so it's in the very first request and there's no Read call for it.

어떤 파일을 가리킬 때는 경로를 타이핑하는 대신 `@`로 멘션한다. Claude Code가 **아무것도 보내지기 전에** 그 파일을 메시지에 붙이므로, 그 파일은 **맨 첫 요청**에 들어가 있고 그것을 위한 Read 호출이 없다.

- **before anything gets sent**: 첨부가 일어나는 시점이 요청 발사 전이라는 뜻. 그래서 왕복이 하나도 안 생긴다.
- **in the very first request**: 첫 요청부터 들어간다는 것. 어차피 대화 내내 실려 다닐 파일이니, 왕복 한 번 덜 하고 같은 자리에 도착하는 셈이다.

```
같은 파일 하나를 대화에 들여놓기까지

아무 말 안 함      요청 1(어디 있지?) → grep → 요청 2 → 파일 몇 개 열기 → 요청 3 → 파일 도착
경로를 타이핑      요청 1(Read 호출) → 파일 읽기 → 요청 2 → 파일 도착
@로 멘션          요청 1에 파일이 이미 들어 있음 → 도착
```

---

### 종합

세 방법의 차이는 "파일이 컨텍스트에 도착하기까지 요청이 몇 번 오가는가"다. 파일 내용이 차지하는 자리는 어느 쪽이든 같지만, 거기 도달하는 왕복 횟수가 다르다.

- **아무 말 안 함**: 탐색 몇 턴 + 열어본 헛발질 파일들 + 정답 파일
- **경로를 타이핑**: 탐색은 없지만 Read 호출 한 번(=요청 한 번)
- **`@`로 멘션**: 첫 요청에 이미 첨부되어 있음

`@`가 아끼는 것은 파일 크기가 아니라 왕복이다. 매 요청이 그때까지의 대화 전체를 싣고 나간다는 점을 떠올리면, 왕복 하나를 없애는 것이 곧 대화 전체를 한 번 덜 보내는 일임을 알 수 있다.

덧붙여 `@`는 값 이야기만도 아니다. 헛발질로 열어본 파일이 애초에 안 생기니 컨텍스트도 그만큼 깨끗하게 유지된다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 같은 파일을 뒤 턴에서 다시 @로 멘션하면 어떻게 되는가?

### 도입

`@` 멘션이 이득이라면 자주 쓸수록 좋을 것 같지만, 같은 파일을 두 번 붙이는 것은 이득이 아니다. 파일이 한 번 대화에 들어오면 그 뒤로 계속 거기 있다는 사실이 이유 전부다.

---

### 본문

> The file itself takes up the same room in the context either way,

파일 자체가 컨텍스트에서 차지하는 자리는 **어느 쪽이든 똑같다**.

- **the same room ... either way**: `@`로 붙이든 Claude가 Read로 읽든, 들어온 뒤의 크기는 같다는 뜻. `@`가 아끼는 것은 도달 과정이지 파일 크기가 아니다.

> so you only need to mention it once per conversation: it stays there, and @-mentioning it again on a later turn generally attaches a second copy.

그러니 한 대화에서 **한 번만** 멘션하면 된다. 그 파일은 계속 거기 있고, 뒤 턴에서 다시 `@`로 멘션하면 대개 **두 번째 복사본이 붙는다**.

- **once per conversation**: 횟수 단위가 턴이 아니라 대화 하나 전체라는 것.
- **it stays there**: 한 번 들어오면 나가지 않는다. 앞에서 본 "매 턴 다시 보내진다"와 같은 이야기다.
- **a second copy**: 갱신이나 참조가 아니라 사본이 하나 더 생긴다는 뜻. 같은 내용이 두 벌 실려 다니게 된다.

```
한 번만 멘션           두 번 멘션
[... 대화 ...]         [... 대화 ...]
[파일 내용]            [파일 내용]        ← 1턴에 붙음
[... 이후 턴 ...]      [... 이후 턴 ...]
                      [파일 내용]        ← 5턴에 또 붙음 (같은 내용, 두 벌)
                      매 턴 두 벌이 함께 실려 나감
```

---

### 종합

`@` 멘션은 "이 파일을 지금 보라"는 지시가 아니라 "이 파일을 대화에 들여놓으라"는 동작이다. 들여놓기는 한 번으로 끝나고, 그 뒤로는 아무것도 안 해도 매 턴 함께 나간다. 그러니 두 번째 멘션은 이미 있는 것을 다시 가져오는 게 아니라 똑같은 내용을 한 벌 더 얹는 일이 된다.

값도 두 배가 되지만 그보다 성가신 문제가 따로 있다. 같은 파일의 사본이 둘 있으면 모델이 어느 쪽을 최신으로 봐야 할지가 애매해진다. 특히 그사이에 파일을 고쳤다면 내용이 다른 두 벌이 함께 실려 다니게 된다.

그래서 실무 규칙은 짧다. **한 대화에서 한 파일은 한 번만 붙인다.** 뒤 턴에서 그 파일을 다시 언급해야 하면 `@` 없이 이름만 대면 된다. 이미 컨텍스트 안에 있으니 Claude가 다시 읽으러 갈 일도 없다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 출력이 많은 명령은 어떻게 다뤄야 하는가?

### 도입

컨텍스트를 불리는 두 번째 덩어리는 Claude가 돌린 명령의 출력이다. 그런데 이쪽에는 파일과 다른 함정이 하나 있다. 아주 큰 출력은 오히려 안전하고, 애매하게 큰 출력이 제일 아프다.

---

### 본문

> The other thing that fills up the context is the output of the commands Claude runs.
> Every time it runs your tests, a build, or a git log, whatever that prints gets appended to the conversation just like a file it read, and stays there for the same number of turns.

컨텍스트를 채우는 다른 하나는 Claude가 돌린 명령의 출력이다. 테스트든 빌드든 `git log`든, 그게 화면에 찍어낸 것은 **Claude가 읽은 파일과 똑같은 방식으로** 대화 뒤에 붙고, 똑같은 턴 수만큼 거기 머문다.

- **just like a file it read**: 파일과 명령 출력이 컨텍스트 입장에서 구분되지 않는다는 뜻. 화면에 잠깐 스쳐간 것처럼 보여도 대화에 눌러앉는다.
- **for the same number of turns**: 머무는 기간도 같다. 즉 대화가 끝날 때까지다.
- **git log**: 옵션 없이 돌리면 커밋 하나당 여섯 줄씩 화면을 채우는, 흔히 놓치는 예다.

#### 왜 아주 큰 출력이 오히려 안전한가

> Really big outputs are actually fine: after 30,000 characters Claude Code writes the output to a file and only puts a short preview and the path in the conversation (BASH_MAX_OUTPUT_LENGTH if you want to change it).

정말 큰 출력은 **오히려 괜찮다**. 3만 자를 넘어가면 Claude Code가 그 출력을 파일로 써두고, 대화에는 짧은 미리보기와 그 파일 경로만 넣는다. (바꾸고 싶으면 `BASH_MAX_OUTPUT_LENGTH`를 조정한다.)

- **actually fine**: 직관과 반대라고 짚어주는 대목. 큰 게 위험할 것 같지만 여기엔 안전장치가 걸려 있다.
- **30,000 characters**: 안전장치가 작동하는 문턱. 이 위로는 얼마나 크든 대화에 들어가는 양이 일정하다.
- **a short preview and the path**: 대화에 남는 것은 몇 줄과 경로뿐. 나중에 필요하면 그 파일에서 필요한 부분만 골라 읽으면 된다.

> The problem is everything under that.
> A test runner that prints 400 passing tests one line at a time comes in under the limit, and those 400 lines are now part of every remaining turn.

문제는 **그 밑에 있는 전부**다. 통과한 테스트 400개를 한 줄씩 찍어내는 테스트 러너는 그 한도 아래로 들어오고, 그 400줄은 이제 **남은 모든 턴의 일부**가 된다.

- **everything under that**: 문턱 아래 구간 전체가 위험 지대라는 뜻. 파일로 빠지지 않으니 통째로 대화에 눌러앉는다.
- **400 passing tests**: 하필 통과한 것들, 즉 내가 알 필요 없는 정보다. 정작 필요한 건 실패한 하나뿐인데 나머지 399개가 자리를 차지한다.
- **part of every remaining turn**: 한 번 들어오면 남은 대화 내내 매 턴 실려 나간다.

```
출력 크기에 따른 결과

작음 (몇 줄)          [출력]                         부담 거의 없음
애매하게 큼 (400줄)    [출력 400줄 ─────────────]     남은 모든 턴에 그대로 실림  ← 제일 아픈 구간
아주 큼 (3만 자 초과)  [미리보기 몇 줄 + 파일 경로]     파일로 빠짐 → 대화엔 몇 줄만
```

#### 처방

> Add quiet flags to noisy commands, or run them in a subagent. Command output is added to the conversation just like a file, and stays there for the rest of the session.

시끄러운 명령에는 **조용한 옵션**을 붙이거나, 서브에이전트에서 돌린다.

- **quiet flags**: 출력을 줄이는 옵션. 테스트 러너의 `--reporter=dot`처럼 결과 요약만 남기는 설정이 여기 해당한다.
- **noisy**: 필요한 정보에 비해 찍어내는 줄이 많다는 뜻.

> Claude will often take care of this for you with flags and tail, and if you'd rather not leave it up to Claude, there's a small hook in the docs that rewrites noisy commands before they run so only the lines that matter come back.

Claude가 알아서 옵션이나 `tail`로 처리해줄 때도 많다. Claude에게 맡기고 싶지 않다면, 시끄러운 명령을 **실행되기 전에** 고쳐 써서 중요한 줄만 돌아오게 하는 작은 훅이 공식 문서에 있다.

- **take care of this for you**: 자주 해주지만 항상은 아니라는 뉘앙스. 확실히 하고 싶으면 아래의 방법을 쓴다.
- **rewrites ... before they run**: 명령이 실행되기 전에 가로채 고쳐 쓴다는 뜻. 사람이 매번 신경 쓰지 않아도 강제된다.
- **only the lines that matter**: 중요한 줄만. 대체로 실패한 것과 요약 줄이다.

> Tip: put the two or three commands you run all day in CLAUDE.md, quiet flags included, the way you'd type them yourself ("run a single test file with npx vitest run <file> --reporter=dot"). It's a small addition, but it saves a turn and a few hundred lines of output in every session after it.

하루 종일 돌리는 명령 두세 개를 조용한 옵션까지 포함해서, **내가 직접 칠 때 쓰는 모양 그대로** CLAUDE.md에 적어둔다. 작은 추가지만 그 뒤 모든 대화에서 한 턴과 수백 줄의 출력을 아낀다.

- **the two or three you run all day**: 전부 적으라는 게 아니다. CLAUDE.md는 모든 요청의 맨 앞에 실려 나가므로 길어지면 그 자체가 값이 된다.
- **the way you'd type them yourself**: 설명이 아니라 실제 명령줄 그대로. 그래야 Claude가 그대로 쓴다.
- **saves a turn**: 명령을 알아내려 탐색하는 왕복 한 번까지 함께 사라진다는 뜻.

---

### 종합

명령 출력은 컨텍스트 입장에서 파일과 구분되지 않는다. 화면에 잠깐 지나간 것처럼 보여도 대화에 붙어 남은 모든 턴에 함께 실려 나간다.

여기서 직관과 어긋나는 지점이 위험 구간의 위치다. 출력이 3만 자를 넘으면 Claude Code가 그것을 파일로 빼고 대화에는 미리보기와 경로만 남기므로, 아주 큰 출력은 오히려 안전하다. 반대로 그 문턱 아래는 안전장치가 안 걸려서 통째로 눌러앉는다. 통과한 테스트 400줄이 딱 그 구간이다. 내게 쓸모없는 정보인데 한도에 못 미쳐 파일로 빠지지도 않고, 그대로 남은 대화 전체를 따라다닌다.

처방은 세 단계로 나뉜다.

- **조용한 옵션을 붙인다**: 애초에 찍히는 줄을 줄인다. 가장 직접적이다.
- **훅으로 강제한다**: 시끄러운 명령을 실행 전에 고쳐 쓴다. 매번 신경 쓰지 않아도 된다.
- **CLAUDE.md에 적어둔다**: 자주 쓰는 명령 두세 개를 옵션까지 포함해 그대로 적는다. 명령을 알아내는 왕복까지 함께 사라진다.

셋 다 겨냥하는 것은 같다. **애매하게 큰 출력이 애초에 안 생기게 만드는 것.**

출력을 줄이는 대신 아예 다른 컨텍스트에서 돌리는 방법도 있다. 그 대가와 판단 기준은 [claude-code-subagents.md](claude-code-subagents.md)에서 다룬다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 세션 비용을 줄이려 할 때 어디부터 손대야 가장 크게 줄어드는가?

### 도입

지금까지 나온 처방이 여러 개다. 대화를 짧게, 파일은 `@`로, 명령은 조용하게, 모델은 미리 정하고. 전부 지키면 좋겠지만 실제로는 몇 개만 챙기게 되니 어느 것이 값이 큰지를 알아둘 만하다.

---

### 본문

> Of everything above, four things are worth keeping an eye on, roughly in order of how much they cost:

위의 모든 것 중 눈여겨볼 만한 것은 넷이고, **값이 큰 순서로 대략 늘어놓으면** 아래와 같다.

- **worth keeping an eye on**: 계속 지켜볼 값어치가 있다는 뜻. 한 번 고치고 끝나는 게 아니라 습관으로 붙들 항목이라는 뉘앙스다.
- **roughly in order**: 대략의 순서. 정확한 순위가 아니라 어디부터 손대야 이득이 큰지의 감각이다.

```
값이 큰 순서

 1. 긴 대화                    ████████████████████
 2. 컨텍스트에 너무 많이 든 것   ████████████
 3. 필요 이상으로 큰 모델·effort  ██████
 4. 프롬프트 캐시 깨뜨리기       ███
```

> 1. **Long sessions**
> Every turn re-sends everything before it, so this is where most of a session's tokens go.

**긴 세션**: 매 턴이 그 앞의 모든 것을 다시 보내므로, 세션 토큰의 대부분이 여기로 간다.

- **re-sends everything before it**: 앞에서 본 구조 그대로다. 순위 1위인 이유는 이 반복이 다른 모든 항목을 곱하기 때문이다.
- **most of a session's tokens**: 대부분. 다른 셋을 다 잡아도 대화를 길게 끌면 절약분이 묻힌다.

> 2. **Too much in the context**
> Files Claude didn't need, noisy command output, leftovers from the previous task, MCP servers you're not using: all of it gets re-sent (and thought about) on every turn.

**컨텍스트에 너무 많이 든 것**: Claude에게 필요 없었던 파일, 시끄러운 명령 출력, 이전 작업에서 남은 찌꺼기, 안 쓰는 MCP 서버. 전부 매 턴 다시 보내지고 (그리고 매 턴 고려된다).

- **Claude didn't need**: 탐색하다 헛되이 열어본 파일들. 지나고 나서야 필요 없었음이 드러난다.
- **leftovers from the previous task**: 이전 작업의 찌꺼기. `/clear`가 겨냥하는 대상이다.
- **MCP servers you're not using**: 외부 도구를 붙이는 연결. 켜져 있기만 해도 도구 정의가 요청 맨 앞에 실린다.
- **(and thought about)**: 괄호로 덧붙인 이유가 있다. 요금 말고도 모델이 매 턴 이 잡음을 헤치고 판단해야 한다.

> Tip: run /context in a fresh session to see what's in there before you've typed anything. Keep CLAUDE.md to specific instructions and move workflow-specific ones into skills, which only get loaded when they're used. If there's an MCP server you don't need in this session, turn it off with /mcp.

새 대화에서 `/context`를 돌려 **내가 아무것도 타이핑하기 전에** 거기에 무엇이 들어 있는지 본다. CLAUDE.md에는 구체적인 지시만 남기고, 특정 작업 흐름에만 쓰이는 것은 스킬로 옮긴다. 스킬은 실제로 쓰일 때만 불려온다. 지금 필요 없는 MCP 서버가 있으면 `/mcp`로 끈다.

- **in a fresh session**: 빈 대화에서 재보는 것이 요점. 내가 쌓은 것을 뺀 고정 비용이 드러난다.
- **specific instructions**: 구체적인 지시. 어느 작업에서나 통하는 규칙만 남기라는 뜻이다.
- **only get loaded when they're used**: 스킬의 이점이 여기 하나로 요약된다. 항상 실리는 CLAUDE.md와 달리 필요할 때만 컨텍스트에 들어온다.

> 3. **A bigger model or higher effort level than the task needs**
> Everything else gets multiplied by it, and both settings stick between sessions.

**작업에 필요한 것보다 큰 모델이나 높은 effort 수준**: 나머지 전부가 여기에 곱해지고, 두 설정 다 대화를 새로 시작해도 그대로 남는다.

- **than the task needs**: 기준이 절대 크기가 아니라 작업 난이도라는 것. 어려운 일에 큰 모델은 낭비가 아니다.
- **gets multiplied by it**: 곱해진다. 토큰을 아무리 줄여도 단가가 높으면 그 비율만큼 그대로 커진다.
- **stick between sessions**: 새 대화를 열어도 설정이 따라온다. 어려운 일 때문에 올려둔 걸 잊고 그다음 잔일까지 그 값으로 하게 되는 흔한 함정이다.

> 4. **Breaking the prompt cache**
> Changing model, effort, or fast mode mid-conversation, or coming back after the cache has expired, prefills the whole conversation again at full price.

**프롬프트 캐시 깨뜨리기**: 대화 도중에 모델·effort·fast mode를 바꾸거나 캐시가 만료된 뒤에 돌아오면, 대화 전체가 전액으로 다시 프리필된다.

- **mid-conversation**: 도중에. 시작할 때 바꾸는 것은 여기 해당하지 않는다.
- **coming back after the cache has expired**: 내가 아무것도 안 바꿔도 한 시간이 지나면 저절로 걸린다는 뜻.
- **at full price**: 0.1배가 아니라 1배. 한 번에 한해서는 크지만, 순위가 4위인 이유는 자주 일어나지 않아서다.

무엇이 캐시를 깨뜨리는지, 그리고 바꾸기 싼 시점이 언제인지는 [claude-code-prompt-cache.md](claude-code-prompt-cache.md)에서 따로 다룬다.

---

### 종합

네 항목은 값의 크기뿐 아니라 성격도 다르다.

- **긴 세션**: 매 턴이 앞의 전부를 다시 보내는 구조 자체다. 다른 항목들의 효과를 곱하는 자리라 1위다.
- **컨텍스트에 너무 많이 든 것**: 무엇이 들어앉았는가. 한 번에 큰 항목이 아니라 계속 새는 항목이다.
- **필요 이상으로 큰 모델·effort**: 단가. 토큰을 얼마나 아꼈든 여기에 곱해진다.
- **캐시 깨뜨리기**: 한 번에 크게 튀지만 드물게 일어난다.

앞의 둘은 결국 같은 것을 두 방향에서 본 것이다. 하나는 "몇 턴을 머무는가", 다른 하나는 "얼마나 들어앉았는가". 그래서 `/clear`와 `/compact`은 두 항목을 동시에 줄인다.

셋째와 넷째는 손이 거의 안 가는 자리다. 시작할 때 모델과 effort를 정하고 들어가면 넷째는 자동으로 사라지고, 잔일에 큰 모델을 계속 쓰고 있지 않은지만 가끔 확인하면 셋째가 잡힌다.

가장 먼저 손댈 것을 하나만 고른다면 새 대화에서 `/context`를 한 번 돌려보는 일이다. 내가 아무것도 안 했는데 이미 얼마나 실려 있는지가 보이면, 안 쓰는 MCP 서버를 끄거나 CLAUDE.md에서 특정 작업용 내용을 스킬로 옮기는 판단이 곧장 따라 나온다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions
