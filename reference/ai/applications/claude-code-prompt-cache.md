---
tags: [ai, concept, performance]
source: official
---

## 프롬프트 캐싱이란 무엇인가?

### 도입

먼저 용어 셋을 깔아둔다.

- **토큰(token)**: 모델이 글자를 세는 단위. 단어보다 조금 작은 조각이라고 보면 된다. 요청 요금도 응답 요금도 이 개수로 매겨진다.
- **프리필(prefill)**: 모델이 답을 만들기 전에, 받은 입력 전체를 한 번 훑어 내부 상태로 바꿔놓는 준비 작업. 입력이 길수록 이 준비에 드는 계산이 늘고, 그게 곧 입력 요금이다.
- **턴(turn)**: 모델에게 한 번 요청을 보내고 한 번 응답을 받는 왕복 1회.

여기서 중요한 건, 모델은 이전 대화를 기억하고 있지 않다는 점이다. 매 턴 지금까지의 대화 전체를 처음부터 다시 실어 보낸다. 그러면 같은 앞부분을 매번 다시 프리필하게 되는데, 그 낭비를 없애는 장치가 프롬프트 캐싱이다.

---

### 본문

#### 무엇을 캐싱하는가

> If a request starts with exactly the same tokens as a request the server just saw, the state for that shared beginning comes out the same,

어떤 요청이 서버가 방금 본 요청과 **똑같은 토큰으로 시작하면**, 그 공유되는 앞부분에서 나오는 내부 상태도 똑같이 나온다.

- **exactly the same**: "비슷한"이 아니라 토큰 하나까지 동일해야 한다는 뜻. 한 글자만 달라도 다른 것으로 친다.
- **starts with**: 앞에서부터라는 조건이 핵심이다. 중간이나 끝이 같은 건 소용없다.
- **shared beginning**: 두 요청이 공유하는 앞부분. 대화가 이어지는 동안은 직전 요청 전체가 그대로 다음 요청의 앞부분이 된다.
- **state**: 프리필이 만들어낸 결과물. 입력을 계산해서 얻는 값이므로, 입력이 같으면 결과도 같다.

> so the server can keep it around from last time and only prefill whatever comes after it. This is called prompt caching.

그래서 서버는 그 상태를 지난번 것 그대로 들고 있다가, **그 뒤에 새로 붙은 부분만** 프리필하면 된다. 이것을 프롬프트 캐싱이라고 부른다.

- **keep it around**: 계산 결과를 버리지 않고 잠시 보관해둔다는 뜻. 브라우저가 이미 받은 이미지를 다시 내려받지 않는 것과 같은 발상이다.
- **only ... whatever comes after it**: 절약되는 양이 여기서 결정된다. 새로 붙은 부분이 짧을수록 이득이 크다.

#### 얼마나 싸지는가

> Reading from the cache costs 0.1x the input price, because the server loads the state instead of computing it.

캐시에서 읽어오는 값은 입력 요금의 0.1배다. 서버가 상태를 **계산하는 대신 불러오기만** 하기 때문이다.

- **0.1x**: 10분의 1. 공짜는 아니지만 자릿수가 하나 줄어든다.
- **loads ... instead of computing**: 요금이 왜 싸지는지의 이유. 비싼 쪽은 저장 공간이 아니라 계산이다.

> Writing tokens into the cache costs a bit more than normal input, up to 2x, since the server also has to hold on to the state afterwards.

캐시에 토큰을 써넣는 값은 일반 입력보다 조금 비싸서 최대 2배까지 간다. 서버가 계산을 하고 나서 그 상태를 **계속 붙들고 있어야** 하기 때문이다.

- **writing ... into the cache**: 새로 프리필하면서 동시에 그 결과를 캐시에 남기는 것. 처음 보는 부분은 이 값이 매겨진다.
- **hold on to**: 계산이 끝난 뒤에도 메모리를 점유한 채 유지한다는 뜻. 그 유지 비용이 웃돈의 정체다.

> But the write happens once per token, and the 0.1x reads happen on every turn after it.

그런데 쓰기는 **토큰당 딱 한 번** 일어나고, 0.1배짜리 읽기는 **그 뒤 모든 턴마다** 일어난다.

- **once per token**: 한 조각이 대화에 들어올 때 한 번만 웃돈을 낸다.
- **every turn after it**: 웃돈 2배를 한 번 내고 0.1배를 수십 번 받는 거래이므로, 턴이 쌓일수록 이득이 커진다. 이 장치가 없으면 매 턴 대화 전체를 1배 값으로 다시 프리필하게 된다.

#### 작은 수정 하나가 다섯 요청이 되는 과정

> Claude Code assembles the first request out of the system prompt (tool definitions included), your CLAUDE.md, and your message, and sends it off (input tokens). Nothing is in the cache yet, so all of it gets prefilled and written into the cache.

첫 요청은 시스템 프롬프트(도구 정의 포함), CLAUDE.md, 그리고 내가 친 메시지를 합쳐 만들어져 나간다. 캐시에는 아직 아무것도 없으니 전부 프리필되고 전부 캐시에 써진다.

- **system prompt**: 대화 맨 앞에 항상 깔리는 지시문. 내가 타이핑하지 않아도 이미 들어가 있다.
- **tool definitions**: Read·Edit·Bash 같은 도구를 모델이 부를 수 있게 설명해둔 적어둔 규격. 종류가 많아서 분량이 작지 않다.
- **assembles**: 매 턴 새로 조립한다는 뜻. 이어붙이는 게 아니라 처음부터 다시 쌓아 보낸다.

> The model can't fix a test it hasn't seen, so it thinks for a moment and responds with a Read call for utils.test.ts (output tokens). Claude Code reads the file, appends it to the conversation, and sends the whole thing again (input tokens). This time everything from request 1 is read back out of the cache at a tenth of the price, and the only thing prefilled at full price is what's new: the Read call and the file.

모델은 보지 못한 테스트를 고칠 수 없으므로 `utils.test.ts`를 읽어달라는 Read 호출로 응답한다. Claude Code가 그 파일을 읽어 대화 뒤에 붙이고, **전체를 다시** 보낸다. 이번엔 1번 요청에 있던 것이 전부 10분의 1 값으로 캐시에서 읽히고, 전액이 매겨지는 건 새로 붙은 것, 즉 Read 호출과 파일 내용뿐이다.

- **appends**: 기존 대화를 고치지 않고 끝에 덧붙인다는 뜻. 앞부분이 그대로 보존되니 캐시가 살아 있다.
- **the whole thing**: 덧붙인 조각만 보내는 게 아니라 처음부터 전부 다시 보낸다. 요금 구조를 이해하는 열쇠다.
- **what's new**: 전액이 매겨지는 범위. 매 턴 이 부분만 새 값이다.

> Now the model wants the file under test (output). Another Read, another append, and everything goes out again: requests 1 and 2 from the cache, the second file at full price (input).
> The model responds with an Edit (output). Claude Code applies it, appends the result, and sends everything again. Same story: the Edit and its result are new, everything in front of them is a cache read (input).
> The model runs npm test (output). Claude Code appends the test output and sends everything again, with the test output as the only new part (input).

이제 모델은 테스트 대상 파일을 원한다. Read 하나 더, 덧붙이기 하나 더, 그리고 전체가 다시 나간다. 이어서 Edit이 오고, 적용 결과가 붙고, 또 전체가 나간다. 그다음 `npm test`가 돌고, 그 출력이 붙고, 또 전체가 나간다. 매번 같은 이야기다. 새로 붙은 것만 전액이고 그 앞은 전부 캐시 읽기다.

- **everything in front of them**: 새 조각보다 앞에 있는 모든 것. 대화가 길어질수록 이 덩어리가 커진다.
- **the only new part**: 매 요청에서 전액을 무는 부분이 하나뿐이라는 뜻.

> The tests pass, and the model responds with a short summary (output). No tool call means nothing to append and no request 6, so we're done.
> That's five requests for one small fix, and every one of them contained the entire conversation up to that point.

테스트가 통과하고 모델은 짧은 요약으로 응답한다. 도구 호출이 없으니 붙일 것도 없고 6번째 요청도 없다. 작은 수정 하나에 다섯 번의 요청이 나갔고, **그 다섯 개 전부가 그 시점까지의 대화 전체를 담고 있었다**.

- **no tool call means ... no request**: 요청이 몇 번 나가는지는 도구 호출 횟수가 정한다. 대화 한 번이 요청 한 번이 아니다.
- **the entire conversation up to that point**: 이 다섯 요청의 크기가 계단식으로 커진 이유.

```
요청 1  [시스템 프롬프트 + 도구 정의 + CLAUDE.md + 내 메시지]
요청 2  [────────── 요청 1과 똑같은 앞부분 ──────────][Read 호출 + utils.test.ts]
요청 3  [────────── 요청 2와 똑같은 앞부분 ──────────][Read 호출 + 대상 파일]
요청 4  [────────── 요청 3과 똑같은 앞부분 ──────────][Edit + 적용 결과]
요청 5  [────────── 요청 4와 똑같은 앞부분 ──────────][npm test + 테스트 출력]
         └──── 캐시에서 읽음 (입력가 × 0.1) ────┘└─ 새로 프리필 (전액) ─┘
```

> A typical turn is lopsided: tens of thousands of tokens going in, a few hundred coming out.
> But only what's new in that turn gets prefilled at full price.

보통의 턴은 한쪽으로 크게 기울어 있다. 수만 개의 토큰이 들어가고 수백 개가 나온다. 다만 전액으로 프리필되는 건 그 턴에 새로 생긴 부분뿐이다.

- **lopsided**: 양쪽 저울이 안 맞는다는 뜻. 들어가는 양과 나오는 양의 차이가 100배 가까이 난다.
- **tens of thousands**: 수만. 대화·파일·명령 출력이 전부 매번 실려 나가서 이렇게 커진다.

> That's the whole per-turn bill: cache reads on the history, full input price on whatever's new, and the output price on the response.

한 턴의 청구서는 이게 전부다.

- **cache reads on the history**: 지금까지 쌓인 대화에는 캐시 읽기 값(0.1배).
- **full input price on whatever's new**: 그 턴에 새로 붙은 것에는 입력 전액.
- **the output price on the response**: 모델이 뱉은 응답에는 출력 값.

> This applies on a subscription too. You don't see these prices directly, but the same requests are what draw down your limits.

구독제에서도 그대로 적용된다. 이 값들이 눈에 보이진 않지만, **한도를 깎아내리는 것은 똑같은 그 요청들**이다.

- **draw down**: 잔량을 서서히 깎아 내려간다는 뜻. 은행 잔고를 빼 쓰는 그림이다.
- **limits**: 구독제에서 정해진 사용 한도. 돈 대신 이 한도가 줄어들 뿐, 아끼는 방법은 종량제와 완전히 같다.

---

### 종합

프롬프트 캐싱은 "앞부분이 같으면 계산을 다시 하지 않는다"는 한 문장으로 요약된다. 모델은 이전 대화를 기억하지 않으므로 매 턴 대화 전체가 다시 나가는데, 그 대화의 앞부분은 직전 턴과 토큰 하나까지 똑같다. 그러니 서버가 지난번 계산 결과를 들고 있다가 새로 붙은 꼬리만 계산하면 된다.

요금은 세 갈래로 갈린다.

- **캐시에서 읽는 부분**: 입력가의 0.1배. 매 턴 반복된다.
- **새로 써넣는 부분**: 입력가의 최대 2배. 토큰당 딱 한 번뿐이다.
- **모델의 응답**: 출력가. 보통 입력의 100분의 1 분량이다.

한 번 2배를 내고 그 뒤로 계속 0.1배를 받는 구조라, 대화가 이어질수록 이득이 커진다. 이게 없으면 40번째 턴은 앞의 39턴을 전액으로 다시 프리필하게 되고, 대화를 길게 끄는 것 자체가 불가능해진다.

작은 수정 하나가 다섯 요청이 되는 과정이 이 구조를 눈으로 보여준다. 요청 횟수는 내가 엔터를 몇 번 쳤는지가 아니라 모델이 도구를 몇 번 불렀는지가 정하고, 그 요청 하나하나가 대화 전체를 통째로 담고 있다. 그러니 "대화에 무엇을 들여놓는가"가 곧 비용이다. 종량제든 구독제든 계산되는 요청은 동일하다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 캐시가 재사용되려면 요청의 어느 부분이 일치해야 하는가?

### 도입

캐시가 살아남는 조건은 "요청 어딘가가 같으면 된다"가 아니다. **맨 앞에서부터 연속으로** 같아야 한다. 그래서 요청을 어떤 순서로 조립하는지가 곧 비용 구조가 된다.

---

### 본문

> The cache has to match from the very start of the request forward,

캐시는 요청의 **맨 처음부터 앞으로 나아가며** 일치해야 한다.

- **from the very start**: 중간부터가 아니라 0번째 토큰부터. 앞에서 하나라도 어긋나면 그 지점 이후는 전부 무효다.
- **forward**: 앞에서 뒤로 한 방향으로만 이어진다는 뜻. 어긋난 자리에서 일치 판정이 끊긴다.

> and requests always go out in the same order: tool definitions, then the system prompt, then the conversation (with CLAUDE.md at the front of it).

그리고 요청은 항상 같은 순서로 나간다. 도구 정의, 그다음 시스템 프롬프트, 그다음 대화이고, 그 대화 맨 앞에 CLAUDE.md가 붙는다.

- **always ... the same order**: 순서가 고정이라서 캐시를 노릴 수 있다. 매번 순서가 바뀌면 앞부분이 같을 일이 없다.
- **at the front of it**: CLAUDE.md가 대화의 맨 앞자리라는 뜻. 대화보다 앞이니 CLAUDE.md를 고치면 그 뒤 대화 전체가 캐시에서 빠진다.

> If anything in that prefix changes, everything behind it gets prefilled again.

그 앞부분(prefix)에서 무엇 하나라도 바뀌면, **그 뒤에 있는 전부**가 다시 프리필된다.

- **prefix**: 요청의 앞머리. 여기서는 "일치 판정이 끊긴 지점보다 앞에 있는 구간"을 가리킨다.
- **everything behind it**: 바뀐 지점 뒤 전부. 앞쪽일수록 뒤에 딸린 양이 많아 피해가 크다.

> A tool result appended to the end of the conversation is the ideal case, since nothing is behind it.

대화 맨 끝에 붙는 도구 결과는 **가장 이상적인 경우**다. 그 뒤에 아무것도 없기 때문이다.

- **appended to the end**: 끝에 덧붙이기. 앞을 건드리지 않으니 이미 캐시된 구간이 전부 그대로 살아남는다.
- **nothing is behind it**: 새로 프리필해야 할 것이 자기 자신뿐이라는 뜻. 무효화되는 게 0이다.

```
요청 조립 순서 (항상 고정)

[도구 정의][시스템 프롬프트][CLAUDE.md][ 대화 .................. ][새 도구 결과]
      ↑           ↑             ↑                ↑                     ↑
   여기 바뀌면 ──────────────────────────────────────────── 뒤 전부 다시 프리필
               여기 바뀌면 ────────────────────────────────  뒤 전부 다시 프리필
                          여기 바뀌면 ───────────────────── 대화 전부 다시 프리필
                                                        여기만 새것 ─┘
                                                       (뒤에 아무것도 없음 = 손해 0)
```

---

### 종합

캐시 적중 여부는 "앞에서부터 어디까지 똑같이 이어지는가" 하나로 결정된다. 요청이 도구 정의 → 시스템 프롬프트 → CLAUDE.md → 대화 순으로 고정 조립되기 때문에, 무언가를 바꿨을 때의 손해는 그것이 앞쪽에 있을수록 커진다. 도구 정의를 건드리면 요청 전체가 날아가고, CLAUDE.md를 건드리면 대화 전체가 날아간다.

반대로 가장 뒤에 붙는 도구 결과는 뒤따를 것이 없으니 새로 계산할 게 자기 자신뿐이다. Claude가 파일을 읽고 명령을 돌리며 결과를 계속 대화 끝에 쌓아가는 것이 바로 이 형태라서, 도구를 많이 쓰는 대화도 캐시 관점에서는 잘 굴러간다.

그래서 실무에서 조심할 대상은 자연스럽게 정해진다. **뒤에 붙는 것은 마음껏 늘어나도 캐시를 깨지 않고, 앞에 있는 것을 손대면 대가가 크다.** 다음 질문에서 다루는 캐시 무효화 요인들은 전부 "앞쪽을 바꾸거나, 캐시를 찾는 열쇠 자체를 바꾸는" 행동이다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 무엇이 프롬프트 캐시를 버리게 만드는가?

### 도입

> However you can break it, so it's important to know how to avoid these cost spikes.

그런데 이 캐시는 깨질 수 있고, 그래서 **어떻게 하면 비용이 튀는 걸 피할 수 있는지** 아는 것이 중요하다.

- **break it**: 캐시를 못 쓰게 만든다는 뜻. 무언가 부서지는 게 아니라 일치 판정에 실패해 못 쓰게 되는 상황이다.
- **cost spikes**: 평소엔 잔잔하다가 특정 시점에 값이 확 튀는 것. 대화 전체를 다시 프리필하게 되면 그 한 턴만 수십 배로 뛴다.

캐시를 깨는 방법은 두 갈래다. 요청의 앞쪽을 바꾸거나, 캐시를 찾는 열쇠(key)를 바꾸거나. 열쇠란 저장된 캐시를 꺼낼 때 대조하는 조건을 말한다. 토큰이 똑같아도 열쇠가 다르면 다른 캐시로 취급되어 하나도 못 꺼낸다.

---

### 본문

> What throws the cache away is anything that changes the request further towards the front, or changes what the cache is keyed on:

캐시를 내다버리게 만드는 것은, 요청을 **더 앞쪽에서** 바꾸는 모든 것 아니면 **캐시가 무엇을 열쇠로 삼는지**를 바꾸는 모든 것이다.

- **throws away**: 버린다. 서버가 갖고는 있어도 못 꺼내 쓰니 없는 것과 같다.
- **further towards the front**: 앞쪽으로 갈수록. 앞으로 갈수록 뒤에 딸려 무효화되는 양이 많아진다.
- **keyed on**: 무엇을 열쇠 삼아 저장·조회하는가. 같은 대화라도 열쇠가 다르면 별개의 캐시다.

무효화 요인은 네 가지다.

> - /model: every model has its own cache, so on the next turn the entire conversation gets prefilled again at full price. (This includes opusplan, which switches models every time you go in or out of plan mode.)

모델마다 자기 캐시를 따로 갖는다. 그래서 모델을 바꾸면 다음 턴에 대화 전체가 전액으로 다시 프리필된다. (plan 모드를 드나들 때마다 모델이 바뀌는 opusplan도 여기 포함된다.)

- **its own cache**: 모델별로 캐시가 분리돼 있다는 뜻. 모델이 곧 열쇠의 일부다.
- **at full price**: 0.1배가 아니라 1배. 수만 토큰에 이 값이 붙으면 그 한 턴이 평소 열 턴보다 비싸진다.

> - /effort: the effort level is part of what the cache is keyed on too, so it's the same story. It's why both /model and /effort ask you to confirm when you switch in the middle of a conversation.

effort(모델이 답하기 전에 얼마나 오래 생각할지 정하는 설정) 수준도 캐시 열쇠의 일부다. 그래서 결과는 똑같다. `/model`과 `/effort` 둘 다 대화 도중에 바꾸려 하면 확인을 묻는 이유가 이것이다.

- **part of what the cache is keyed on**: 대화 내용이 하나도 안 바뀌어도 이것만 달라지면 캐시를 못 찾는다.
- **ask you to confirm**: 확인 창이 안전장치라기보다 요금 경고에 가깝다는 뜻.

> - Fast mode: also part of the key, and the re-prefill happens at fast mode prices, so if you're going to turn it on, turn it on at the start. (Turning it off again is free, cache-wise.)

fast mode(응답이 더 빨리 나오는 대신 값이 비싼 모드)도 열쇠의 일부다. 게다가 다시 프리필되는 값이 fast mode 값으로 매겨지므로, 켤 거면 **시작할 때 켠다**. (다시 끄는 것은 캐시 관점에서 공짜다.)

- **at fast mode prices**: 손해가 두 번 겹친다는 뜻. 대화 전체를 다시 프리필하는 데다 그 단가마저 비싸다.
- **free, cache-wise**: 끄는 쪽은 손해가 없다. 켤 때만 비싸고, 끌 때는 안 비싸다.

> - /compact: the conversation gets replaced with a shorter one, so nothing in it matches anymore (the system prompt in front of it survives). Writing the summary itself is cheap as long as the old conversation is still in the cache, so it's a lot cheaper before a long break than after one.

`/compact`을 하면 대화가 더 짧은 것으로 **교체**되므로 대화 안의 어느 것도 더는 일치하지 않는다 (그 앞에 있는 시스템 프롬프트는 살아남는다). 요약문을 만드는 작업 자체는 옛 대화가 아직 캐시에 있는 한 싸다. 그래서 긴 휴식 **전에** 하는 게 후에 하는 것보다 훨씬 싸다.

- **replaced**: 덧붙이기가 아니라 갈아끼우기. 그래서 대화 구간의 캐시가 통째로 무효가 된다.
- **the system prompt in front of it survives**: 대화보다 앞에 있는 구간은 안 건드렸으니 그대로 남는다. 손해가 대화 구간에 한정된다는 뜻이다.
- **before a long break than after one**: 요약을 만드는 것도 하나의 턴이라 대화 전체를 입력으로 받는다. 캐시가 살아 있을 때 하면 그 입력이 0.1배고, 만료된 뒤엔 1배다.

---

### 종합

네 가지는 두 부류로 갈린다.

- **열쇠를 바꾸는 것**: `/model`, `/effort`, fast mode. 대화 내용은 한 글자도 안 바뀌었는데 저장해둔 캐시를 못 찾는다.
- **앞쪽 내용을 바꾸는 것**: `/compact`. 대화 구간이 통째로 새 글로 갈아끼워진다.

둘 다 결과는 같다. 다음 턴에 대화 전체가 전액으로 다시 프리필된다. 다만 피해 범위는 다르다. 열쇠가 바뀌면 시스템 프롬프트까지 포함해 요청 전체가 날아가고, `/compact`은 그 앞의 시스템 프롬프트는 남긴다.

이 목록이 실무에서 뜻하는 바는 단순하다. **바꿀 거면 대화가 짧을 때 바꾼다.** 시작 직후나 `/clear` 직후에는 다시 프리필할 대화가 애초에 거의 없어서 같은 행동이 사실상 공짜다. 반대로 40턴짜리 대화 한가운데서 모델을 바꾸면, 그 한 번의 선택으로 40턴어치를 전액에 다시 사게 된다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 모델이나 effort를 바꾸기 싼 시점과 비싼 시점은 언제인가?

### 도입

앞 질문에서 본 대로 모델과 effort는 둘 다 캐시를 찾는 열쇠의 일부다. 그러면 "절대 바꾸지 마라"가 결론일 것 같지만, 그렇지 않다. 값을 결정하는 건 바꾸는 행위 자체가 아니라 **바꾸는 시점에 뒤로 얼마나 많은 대화가 쌓여 있었는가**다.

---

### 본문

> Set your model and effort level before you start. Changing either one mid-conversation can bust your prompt cache, which can increase token cost.

모델과 effort 수준은 **시작하기 전에** 정해둔다. 대화 도중에 둘 중 하나를 바꾸면 프롬프트 캐시가 깨질 수 있고, 그러면 토큰 비용이 늘어난다.

- **before you start**: 처방의 핵심. 결정을 대화 앞쪽으로 당기라는 것이다.
- **mid-conversation**: 대화가 이미 길어진 상태. 이때가 비싼 이유는 다시 프리필할 분량이 그만큼 쌓여 있어서다.
- **bust**: 깨뜨려 못 쓰게 만든다는 뜻.

> None of this means you should never switch models or effort. It means there are cheap moments to do it, the start of a session or right after a /clear, and expensive ones, the middle of a long conversation.

이 이야기가 모델이나 effort를 절대 바꾸지 말라는 뜻은 **아니다**. 싼 때와 비싼 때가 따로 있다는 뜻이다. 싼 쪽은 시작 직후나 `/clear` 직후이고, 비싼 쪽은 긴 대화의 한가운데다.

- **none of this means**: 앞의 경고를 금지로 읽지 말라고 직접 못 박는 대목이다.
- **cheap moments / expensive ones**: 같은 행동의 값이 시점에 따라 다르다는 것. 값을 정하는 변수는 뒤에 쌓인 대화 길이 하나뿐이다.
- **right after a /clear**: `/clear`는 대화를 비우므로 다시 프리필할 것이 시스템 프롬프트 정도밖에 없다.

```
같은 "모델 변경" 한 번의 값

시작 직후        [시스템 프롬프트][─]              다시 프리필: 거의 없음   → 싸다
/clear 직후      [시스템 프롬프트][─]              다시 프리필: 거의 없음   → 싸다
40턴째 한가운데  [시스템 프롬프트][대화 40턴 ────]  다시 프리필: 전부 전액   → 비싸다
```

---

### 종합

모델·effort 변경의 값은 고정값이 아니라 그 시점에 쌓여 있는 대화 길이에 비례한다. 열쇠가 바뀌면 그 대화에 매겨진 캐시를 통째로 못 쓰게 되고, 다음 턴에 앞의 모든 것을 전액으로 다시 사야 하기 때문이다.

그래서 처방은 "바꾸지 마라"가 아니라 "쌀 때 바꿔라"가 된다. 어려운 일을 시작하기 직전에 더 큰 모델로 올리는 것은 거의 공짜고, 40턴을 진행한 뒤 "이건 좀 어려우니 모델을 올려볼까" 하는 것은 그 한 번으로 40턴어치를 다시 사는 일이다.

실무에서는 결국 순서 문제로 바뀐다. 일을 시작하기 전에 "이건 어느 정도 난이도인가"를 한 번 정하고 들어가면 되고, 도중에 판단이 바뀌었다면 `/clear`로 대화를 끊고 새로 시작하는 편이 그 자리에서 갈아타는 것보다 쌀 때가 많다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 자리를 비우기 전에 /compact를 거는 이유는?

### 도입

캐시는 영원히 남지 않는다. 마지막 요청 이후 일정 시간이 지나면 서버가 그 상태를 버린다. 이 만료 시간이 `/compact`을 언제 걸어야 하는지를 정한다.

---

### 본문

> /compact before you take a break from your keyboard.

키보드에서 손을 떼고 자리를 비우기 **전에** `/compact`을 건다.

- **before you take a break**: 처방의 요점 전부가 이 "전에"에 들어 있다. 같은 명령을 돌아와서 치면 값이 달라진다.

> The prompt cache expires after an hour, and summarizing a conversation is much cheaper while it's still cached.

프롬프트 캐시는 **한 시간 뒤에 만료**되고, 대화를 요약하는 일은 그게 아직 캐시에 남아 있는 동안에 하는 편이 훨씬 싸다.

- **expires**: 시간이 지나면 스스로 사라진다는 뜻. 서버가 상태를 무한정 붙들고 있을 수는 없기 때문이다.
- **after an hour**: 한 시간. 점심을 먹고 오거나 회의를 하나 다녀오면 넘어가는 길이다.
- **summarizing ... is much cheaper**: 요약을 만드는 것도 하나의 턴이라, 지금까지의 대화 전체를 입력으로 받는다. 캐시가 살아 있으면 그 입력이 0.1배, 만료됐으면 1배다.

---

### 종합

`/compact`은 대화를 짧은 요약으로 갈아끼우는 명령이라, 어차피 대화 구간의 캐시를 무효화한다. 그러니 "언제 하든 손해는 같지 않나" 싶지만, 요약문을 만드는 일 자체가 대화 전체를 읽는 한 번의 턴이라는 점이 갈림길이다.

- **자리 비우기 전**: 대화가 아직 캐시에 있으니 요약 만드는 입력이 0.1배.
- **한 시간 뒤 돌아와서**: 캐시가 만료됐으니 똑같은 요약을 만드는 데 1배를 다 낸다.

여기에 더해, 돌아온 뒤에는 `/compact`을 하든 안 하든 어차피 한 번은 전액을 물게 된다. 자리를 비우기 전에 미리 대화를 짧게 만들어두면 그 전액을 무는 대상이 긴 대화가 아니라 짧은 요약이 된다.

그래서 규칙은 외우기 쉽다. **떠나기 전에 정리하고 떠난다.** 자리에 앉아 있을 때는 아무것도 안 해도 되고, 오래 비울 것 같으면 나가기 직전에 한 번 눌러두면 된다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 최근 몇 턴을 버리고 싶을 때 /compact 대신 /rewind를 쓰면 무엇이 달라지는가?

### 도입

대화가 엉뚱한 방향으로 흘렀을 때 정리하는 방법이 두 가지다. 둘 다 대화를 짧게 만들지만, 짧게 만드는 **방식**이 달라서 캐시에 미치는 영향이 정반대다. 앞에서 본 원칙 하나가 여기서도 그대로 갈림길이 된다. 뒤에서 잘라내면 앞이 살고, 앞을 갈아끼우면 뒤가 다 죽는다.

---

### 본문

> Tip: if the last few turns went somewhere you don't want to keep, /rewind to just before them instead of running /compact.

마지막 몇 턴이 남기고 싶지 않은 방향으로 갔다면, `/compact`을 돌리는 대신 **그 직전 지점으로** `/rewind`한다.

- **went somewhere you don't want to keep**: 시도해봤는데 아니었던 경우. 내용이 잘못됐다기보다 대화에 남겨둘 가치가 없는 상태다.
- **to just before them**: 되감을 지점을 딱 그 직전으로. 더 앞으로 되감을수록 살릴 수 있었던 캐시까지 버리게 된다.

> Rewinding only cuts those turns off the end, so everything before them is still cached and it costs nothing.

되감기는 그 턴들을 **끝에서 잘라내기만** 하므로, 그 앞의 모든 것이 여전히 캐시에 남아 있고 값이 **하나도 들지 않는다**.

- **cuts ... off the end**: 뒤에서만 자른다. 앞쪽 토큰이 하나도 안 변하니 일치 판정이 끊길 자리가 없다.
- **costs nothing**: 새로 프리필할 것이 0이라는 뜻. 잘라낸 자리에 다음 요청이 그대로 이어 붙는다.

> Compacting rewrites the whole conversation, so it always costs something.

압축은 대화 **전체를 다시 쓰므로**, 언제나 값이 든다.

- **rewrites**: 잘라내기가 아니라 새로 쓰기. 모델이 요약문을 만들어내야 하니 그 자체로 한 턴이다.
- **the whole conversation**: 버리고 싶은 몇 턴만이 아니라 처음부터 전부가 새 글로 바뀐다.
- **always**: 예외가 없다는 뜻. 만드는 값이 쌀 때와 비쌀 때가 있을 뿐 공짜는 아니다.

```
                버리고 싶은 3턴 ↓
현재 대화   [턴 1 ~ 턴 20][턴 21][턴 22][턴 23]

/rewind     [턴 1 ~ 턴 20]                        ← 끝에서 잘라내기만
            └── 앞부분 그대로 = 캐시 전부 유효 ──┘   새로 프리필: 없음 (공짜)

/compact    [요 약 문]                            ← 전체를 새 글로 교체
            └─ 앞의 대화와 한 글자도 안 맞음 ──┘   요약 만들기 + 다음 턴 다시 프리필
```

---

### 종합

두 명령이 대화를 줄이는 방식이 다르다. `/rewind`는 뒤에서 자르고, `/compact`은 전부를 새로 쓴다. 캐시가 "앞에서부터 연속으로 일치하는가"만 보기 때문에, 뒤에서 자르는 쪽은 남은 앞부분이 조금도 손상되지 않는다. 반면 전부를 새로 쓰면 첫 글자부터 달라져서 대화 구간이 통째로 무효가 된다.

값의 차이는 두 겹이다.

- **만드는 값**: 되감기는 이미 있는 것을 버리기만 하니 0이다. 압축은 모델이 요약문을 써야 하니 대화 전체를 입력으로 받는 한 번의 턴이 든다.
- **그 뒤에 이어지는 값**: 되감기 뒤 첫 요청은 남은 대화가 전부 캐시 적중이다. 압축 뒤 첫 요청은 요약문을 전액으로 프리필한다.

그래서 둘은 경쟁 관계가 아니라 쓰임이 다르다. **버리고 싶은 게 끝에 몰려 있으면 `/rewind`**, 대화 전체가 길어져서 앞부분까지 줄여야 하면 `/compact`이다. 방금 시도한 방향이 아니었을 때 습관적으로 `/compact`을 누르면, 공짜로 될 일에 값을 치르는 셈이 된다.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions
