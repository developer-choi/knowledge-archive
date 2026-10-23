# 프롬프트 캐싱은 Claude Code에서 어떤 문제를 해결하는가?

## 도입

Claude Code 화면에서는 대화가 한 줄로 이어지는 것처럼 보이지만, 실제로는 메시지를 보낼 때마다 API 요청이 하나씩 새로 나간다. 원문(Claude Code 문서의 "How Claude Code uses prompt caching" 페이지)은 이 요청들이 서로를 기억하지 못한다는 데서 출발해, 그래서 요청마다 무엇이 반복되고 프롬프트 캐싱이 그 반복의 어느 부분을 덜어 주는지를 네 문장으로 이어 간다.

---

## 본문

### 메시지 하나 = API 요청 하나

> Each time you send a message in Claude Code, it makes a new API request.

Claude Code에서 메시지를 보낼 때마다 새 API 요청이 하나씩 나간다.

- **a new API request**: 이전 요청에 이어 붙이는 것이 아니라 매번 독립된 요청을 새로 보낸다는 뜻이다. 브라우저에서 `fetch()`를 버튼 클릭마다 새로 부르는 것과 같은 모양이다(비유)

### 모델은 요청 사이에 아무것도 기억하지 않는다

> The model doesn't remember anything between requests, so Claude Code re-sends the full context: the system prompt, your project context, every prior message and tool result, and your new message.

모델은 요청과 요청 사이에 아무것도 기억하지 않으므로, Claude Code는 전체 컨텍스트를 다시 보낸다. 시스템 프롬프트, 프로젝트 컨텍스트, 이전의 모든 메시지와 tool 결과, 그리고 새 메시지다.

- **doesn't remember anything between requests**: Messages API가 **stateless**라는 말을 풀어 쓴 것이다. stateless는 서버가 요청 사이에 상태(이전 대화)를 들고 있지 않는다는 뜻이다. 그래서 이전 대화가 필요하면 보내는 쪽이 매번 직접 실어 보내야 한다
- **re-sends the full context**: 새 메시지만 보내는 것이 아니라 지금까지의 맥락 전체를 다시 보낸다. 이것이 없으면, 즉 새 메시지만 보내면 모델은 앞에서 무슨 이야기를 했는지 모른 채 답한다
- **your project context**: CLAUDE.md처럼 Claude Code가 이 프로젝트에 대해 불러온 내용이다
- **every prior message and tool result**: 사용자 메시지·Claude 응답뿐 아니라, 파일 읽기·명령 실행 같은 tool 결과도 이력으로 계속 실린다

Messages API 문서(https://platform.claude.com/docs/en/build-with-claude/working-with-messages)는 같은 사실을 stateless라는 단어로 직접 적는다.

> The Messages API is stateless, which means that you always send the full conversational history to the API.

Messages API는 stateless이므로, 항상 대화 이력 전체를 API에 보낸다.

- **stateless**: 위의 "doesn't remember anything between requests"와 같은 말이다
- **always send the full conversational history**: stateless의 결과다. 한 턴만 보내는 선택지는 없다

```js
// Claude Code가 턴마다 하는 일을 단순화한 모양 (비유)
const messages = [];

messages.push({ role: 'user', content: '이 함수 리팩터링해 줘' });
await anthropic.messages.create({ system, tools, messages }); // 1턴: 메시지 1개

messages.push({ role: 'assistant', content: '...' });
messages.push({ role: 'user', content: '테스트도 추가해 줘' });
await anthropic.messages.create({ system, tools, messages }); // 2턴: system·tools·이전 메시지까지 전부 다시
```

### 새 내용은 끝에 붙고, 나머지는 직전 요청과 같다

> New content is appended at the end, which means most of each request is identical to the one before it.

새 내용은 맨 끝에 덧붙으므로, 각 요청의 대부분은 직전 요청과 똑같다.

- **appended at the end**: 배열의 `push()`처럼 뒤에만 붙는다. 앞쪽 내용은 손대지 않는다
- **most of each request is identical**: 끝에만 붙으니, 이번 요청에서 새 메시지를 뺀 나머지는 직전 요청 그대로다. 대화가 길어질수록 "똑같은 부분"의 비중이 커진다

### 프롬프트 캐싱은 바뀌지 않은 부분의 재처리를 피한다

> Prompt caching is how the API avoids reprocessing the part that didn't change.

프롬프트 캐싱은 API가 바뀌지 않은 부분을 다시 처리하지 않게 하는 방법이다.

- **avoids reprocessing**: 요청에는 여전히 전체가 실린다. 캐싱이 줄이는 것은 "보내는 양"이 아니라 서버가 "다시 처리하는 양"이다
- **the part that didn't change**: 바로 앞 문장의 "identical to the one before it" 부분이다. 캐싱이 없으면 이 부분을 턴마다 처음부터 다시 처리한다

### 캐시는 서버 쪽에 있다

> Caching happens server-side, in whichever infrastructure serves your model.

캐싱은 서버 쪽, 즉 모델을 서비스하는 인프라에서 일어난다.

- **server-side**: 내 컴퓨터에 캐시 파일이 쌓이는 것이 아니다. 브라우저 HTTP 캐시가 내 디스크에 응답을 저장하는 것과 달리, 이 캐시는 요청을 받는 쪽이 들고 있다(비유)
- **whichever infrastructure serves your model**: 모델을 어디서 쓰느냐(어떤 경로로 인증해 쓰느냐)에 따라 캐시가 있는 곳도 그 인프라를 따라간다

---

## 종합

문제는 stateless에서 시작한다. 모델이 요청 사이에 아무것도 기억하지 않으니 Claude Code는 매 메시지마다 시스템 프롬프트부터 이전 이력까지 전부 다시 보내고, 새 내용은 끝에만 붙으니 각 요청의 대부분은 직전 요청과 똑같다.

```
모델이 요청 사이에 기억하지 않음 (stateless)
   │
   ▼
매 요청에 전체 컨텍스트를 다시 실음 (시스템 프롬프트·프로젝트 컨텍스트·이력·새 메시지)
   │
   ▼
새 내용은 끝에만 붙음 → 요청의 대부분이 직전 요청과 동일
   │
   ▼
프롬프트 캐싱: 그 동일한 부분은 다시 처리하지 않음 (서버 쪽에서)
```

캐싱이 없다면 대화가 길어질수록 턴마다 처음부터 다시 처리하는 양이 계속 늘어나고, 그 처리 시간과 비용도 턴마다 다시 든다. 캐싱이 덜어 주는 것은 이 반복 처리이고, 요청에 전체를 다시 싣는 일 자체는 그대로다.

---

# 프롬프트 캐싱을 켜고 요청을 보내면, 서버는 그 요청을 어떤 순서로 처리하는가?

## 도입

Messages API는 stateless라서 매 요청에 대화 전체를 다시 싣고([프롬프트 캐싱은 Claude Code에서 어떤 문제를 해결하는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐싱은-claude-code에서-어떤-문제를-해결하는가)), 긴 시스템 프롬프트나 문서도 요청마다 똑같이 반복해서 실린다. 서버는 원래 이 반복되는 부분을 요청이 올 때마다 처음부터 다시 처리한다. 프롬프트 캐싱은 이 반복되는 앞부분을 처리한 결과를 저장해 두었다가 다음 요청에서 다시 쓰는 기능이다.

원문(Claude 공식 문서의 "Prompt caching" 페이지)은 캐싱을 켠 요청이 들어왔을 때 서버가 하는 일을 세 단계로 적는다. 이 단계를 읽으려면 용어 두 개가 필요하다.

- **prefix**: 프롬프트의 앞부분이다. 요청의 맨 앞에서부터 어느 지점까지를 잘라 낸 덩어리다
- **cache breakpoint**: 요청 안에서 "여기까지를 캐시하라"고 지정한 지점이다. prefix가 어디서 끝나는지를 이 지점이 정한다

---

## 본문

### 0. 전제: 캐싱을 켠 요청

> When you send a request with prompt caching enabled:

프롬프트 캐싱을 켜고 요청을 보내면 다음 순서로 처리된다.

- **enabled**: 캐싱은 요청마다 켜는 기능이다. 켜지 않은 요청은 아래 단계를 거치지 않고 매번 전체를 처리한다

### 1. 캐시에 같은 앞부분이 있는지 확인한다

> 1. The system checks if a prompt prefix, up to a specified cache breakpoint, is already cached from a recent query.

시스템은 지정된 cache breakpoint까지의 프롬프트 앞부분이 최근 요청에서 이미 캐시되었는지 확인한다.

- **checks**: 처리를 시작하기 전에 먼저 확인부터 한다는 뜻이다. 이 확인 결과에 따라 2번과 3번으로 갈린다
- **a prompt prefix, up to a specified cache breakpoint**: 캐시를 찾는 단위는 프롬프트 전체가 아니라 breakpoint까지의 앞부분이다. 그 뒤에 붙은 내용(이번 턴의 새 메시지 등)은 요청마다 달라도 된다
- **already cached**: 이전 요청이 같은 앞부분을 이미 캐시에 써 두었어야 한다는 뜻이다. 앞부분이 달라지면 이전 요청이 써 둔 캐시와 같은 것이 아니므로 찾지 못한다
- **from a recent query**: "최근" 요청에서 만든 캐시만 찾는다. 캐시는 영원히 남지 않는다는 뜻이고, 얼마나 남는지는 「프롬프트 캐시는 기본적으로 얼마 동안 유지되며, 그 수명은 어떻게 연장되는가?」에서 다룬다

### 2. 찾으면 캐시된 결과를 쓴다

> 2. If found, it uses the cached version, reducing processing time and costs.

찾으면 캐시된 결과를 써서 처리 시간과 비용을 줄인다.

- **uses the cached version**: 앞부분을 처음부터 다시 처리하지 않고, 저장해 둔 처리 결과를 꺼내 쓴다. 이것을 "캐시에서 읽는다"고 하고, 이 경우를 캐시 적중(cache hit)이라고 부른다
- **reducing processing time**: 다시 처리하지 않는 만큼 응답이 빨리 시작된다
- **costs**: 캐시에서 읽은 입력 토큰은 일반 입력 토큰보다 훨씬 싼 요금으로 계산된다. 얼마나 싼지는 아래 요금표에서 본다

### 3. 못 찾으면 전체를 처리하고 앞부분을 캐시에 쓴다

> 3. Otherwise, it processes the full prompt and caches the prefix once the response starts.

그렇지 않으면 프롬프트 전체를 처리하고, 응답이 시작되면 그 앞부분을 캐시에 쓴다.

- **Otherwise**: 캐시를 못 찾은 경우다. 캐싱을 켜고 보낸 첫 요청이 여기에 해당한다
- **processes the full prompt**: 캐싱이 없을 때와 똑같이 처음부터 끝까지 처리한다. 이번 요청에서는 처리 시간이 줄지 않는다
- **caches the prefix**: 다음 요청이 1번 단계에서 찾을 수 있도록 앞부분의 처리 결과를 저장한다. 이것을 "캐시에 쓴다"고 한다
- **once the response starts**: 응답이 끝날 때가 아니라 시작되는 시점에 저장한다

```
요청 도착 (캐싱 켬)
   │
   ▼
1. breakpoint까지의 앞부분이 최근 캐시에 있는가?
   │
   ├── 있음 → 2. 캐시된 결과를 읽어 씀 ─────────────→ 처리 시간·비용 감소
   │
   └── 없음 → 3. 전체를 처리하고, 응답이 시작되면 앞부분을 캐시에 씀
                                                    → 다음 요청이 1번에서 찾을 수 있게 됨
```

비유로 보면 JS의 메모이제이션과 같은 구조다. 함수가 처음 호출될 때 결과를 `Map`에 저장해 두고, 같은 인자로 다시 호출되면 계산하지 않고 `Map`에서 꺼내 준다. 차이는 저장되는 것이 "앞부분을 처리한 결과"이고, 그 뒤에 붙은 새 내용은 매번 이어서 처리한다는 점이다.

### 비용: 캐시에 쓰는 요청은 더 비싸고, 읽는 요청은 훨씬 싸다

2번의 "reducing ... costs"가 실제로 얼마인지는 같은 페이지의 요금표가 보여준다.

> The following table shows the price per million tokens for each supported model:

아래 표는 지원하는 모델별로 토큰 100만 개당 가격을 보여준다.

- **price per million tokens**: 요금 단위가 토큰 100만 개(MTok, million tokens)다. 표의 $4는 "입력 토큰 100만 개에 $4"라는 뜻이다

| 모델 이름 | 기본 입력 | 기본 출력 | 5분 쓰기 | 1시간 쓰기 | 캐시 적중 및 갱신 |
|---|---|---|---|---|---|
| Claude Fable 5.1 | $10 | $50 | $12.50 | $20 | $0.25 |
| Claude Opus 5.5 | $4 | $20 | $5 | $8 | $0.20 |
| Claude Sonnet 5.5 | $2 | $10 | $2.50 | $4 | $0.10 |
| Claude Haiku 5.5 (프롬프트 ≤100,000 토큰) | $0.10 | $0.50 | $0.125 | $0.20 | $0.01 |
| Claude Haiku 5.5 (프롬프트 >100,000 토큰) | $0.50 | $2.50 | $0.625 | $1 | $0.05 |

표의 각주는 캐시 적중 가격을 기본 입력 가격의 배수로 적는다. Fable 5.1은 0.025배, Opus 5.5와 Sonnet 5.5는 0.05배다.

표를 기본 입력 가격 기준의 배수로 읽으면 모델과 상관없이 같은 패턴이 나온다.

- **5분 쓰기**: 기본 입력의 1.25배다. 3번 단계에서 앞부분을 캐시에 쓰는 요청은, 그 앞부분에 대해 캐싱을 안 켰을 때보다 25% 더 낸다
- **1시간 쓰기**: 기본 입력의 2배다. 캐시를 더 오래 유지하는 설정을 고를 때의 쓰기 가격이다
- **캐시 적중 및 갱신**: 2번 단계에서 캐시를 읽는 요청의 가격이다. Haiku 5.5는 0.1배, Opus 5.5·Sonnet 5.5는 0.05배, Fable 5.1은 0.025배다

Opus 5.5로, 매 요청에 똑같이 실리는 앞부분이 10만 토큰(0.1 MTok)인 경우를 계산하면 다음과 같다. 앞부분 뒤에 붙는 새 내용과 출력 토큰은 두 경우에 똑같이 붙으므로 빼고 본다.

```
앞부분 10만 토큰 기준       캐싱 안 켬 ($4/MTok)          캐싱 켬 (5분 쓰기 $5 / 적중 $0.20)
1번째 요청                  $0.40                         $0.50  (캐시에 씀)
2번째 요청                  $0.40                         $0.02  (캐시에서 읽음)
3번째 요청                  $0.40                         $0.02  (캐시에서 읽음)
누적 (1회만 보낼 때)        $0.40                         $0.50  ← 캐싱이 더 비쌈
누적 (2회 보낼 때)          $0.80                         $0.52  ← 여기서부터 캐싱이 이득
누적 (3회 보낼 때)          $1.20                         $0.54
```

같은 앞부분을 한 번만 보내면 쓰기 비용 25%만 더 내고 끝난다. 두 번째 요청부터 그 앞부분을 기본 입력의 5% 가격으로 읽으므로, 같은 앞부분을 최소 두 번 보내야 캐싱이 이득이 된다.

---

## 종합

캐싱을 켠 요청은 "확인 → 있으면 읽기, 없으면 처리하고 쓰기" 순서로 처리된다. 처음 요청은 캐시가 없으니 3번으로 가서 전체를 처리하고 앞부분을 캐시에 쓰고, 같은 앞부분으로 들어온 다음 요청은 1번에서 그 캐시를 찾아 2번으로 간다.

비용도 이 갈림길을 따른다. 캐시에 쓰는 요청은 기본 입력보다 비싸고(5분 쓰기 1.25배), 캐시를 읽는 요청은 훨씬 싸다(Opus 5.5 기준 0.05배). 그래서 처음 요청만 보면 캐싱이 손해이고, 같은 앞부분이 다시 실려야 비로소 이득이 난다. 캐싱이 없으면 앞부분이 아무리 똑같아도 요청마다 기본 입력 가격을 다 내고 처리 시간도 매번 다시 든다.

---

# 프롬프트 캐싱은 요청의 어느 부분을, 어떤 기준으로 이전 처리 내용과 맞춰 보는가?

## 도입

서버는 캐싱을 켠 요청이 오면 cache breakpoint까지의 prefix가 최근 캐시에 있는지부터 확인한다. 그렇다면 "있다"는 판정은 무엇과 무엇을 비교해 내리는가? 원문(Claude Code 문서의 "How Claude Code uses prompt caching" 페이지)의 답은 두 가지다. 비교하는 곳은 요청의 앞부분이고, 비교 기준은 완전 일치다.

---

## 본문

### 맞춰 보는 곳: 요청의 시작 부분

> The API caches by matching the start of each request, called the prefix, against content it recently processed.

API는 각 요청의 시작 부분, 즉 prefix를 최근에 처리한 내용과 맞춰 보는 방식으로 캐시한다.

- **the start of each request**: 요청의 중간이나 끝이 아니라 맨 앞에서부터 맞춰 본다. 앞 질문에서 본 그 prefix다
- **against content it recently processed**: 비교 대상은 "최근에" 처리한 내용이다. 수명이 지나 사라진 캐시는 비교 대상이 아니다

### 평소 턴의 prefix: 직전 요청 전체

> On a normal turn, the prefix is the entire previous request and only the latest exchange is new.

평소 턴에서는 prefix가 직전 요청 전체이고, 새로운 것은 가장 최근에 주고받은 한 번뿐이다.

- **On a normal turn**: 설정을 바꾸거나 대화를 정리하는 등의 일이 없는, 그냥 메시지를 이어 보내는 턴이다
- **the entire previous request**: 새 내용이 끝에만 붙으니, 직전 요청이 통째로 이번 요청의 앞부분이 된다
- **the latest exchange**: 직전 응답과 이번 메시지처럼 마지막에 새로 붙은 주고받음이다. 이 부분만 새로 처리한다

### 맞춰 보는 기준: 완전 일치

> The match is exact, so a change anywhere in the prefix recomputes everything after it.

일치는 정확해야 하므로, prefix 안 어디서든 바뀐 곳이 있으면 그 지점 뒤는 전부 다시 계산된다.

- **exact**: "거의 같다"는 인정되지 않는다. 글자 하나만 달라도 그 지점에서 일치가 끊긴다
- **anywhere in the prefix**: 바뀐 곳이 맨 앞이든 중간이든 마찬가지다
- **recomputes everything after it**: 바뀐 지점 뒤는 내용이 그대로여도 다시 처리한다. 뒤쪽 내용이 같아도 그 앞이 달라졌으니 "같은 앞부분"이 아니게 되기 때문이다

JS의 `startsWith`로 보면 이 기준이 잡힌다(비유).

```js
const cached = '[시스템][U1][R1][U2]';

const turn3 = '[시스템][U1][R1][U2][R2][U3]';
turn3.startsWith(cached);   // true  → 앞부분은 캐시에서, [R2][U3]만 새로 처리

const changed = '[시스템*][U1][R1][U2][R2][U3]';
changed.startsWith(cached); // false ← 맨 앞이 달라져 뒤의 [U1]~[U3]가 같아도 전부 다시 처리
```

원문은 이 흐름을 네 턴짜리 그림으로 보여준다.

```
Turn 1  [시스템 프롬프트][교환1]
        → 전체를 처리하고 캐시에 씀

Turn 2  [시스템 프롬프트][교환1][교환2]
        └──── 캐시에서 읽음 ────┘ └ 새로 처리 ┘

Turn 3  [시스템 프롬프트][교환1][교환2][교환3]
        └──────── 캐시에서 읽음 ────────┘ └ 새로 처리 ┘

Turn 4  [시스템 프롬프트*][교환1][교환2][교환3][교환4]
        * 시스템 프롬프트가 바뀜 → prefix 불일치
        → 요청 전체를 다시 처리하고 캐시에 씀

[교환N] = N번째 주고받음 (사용자 메시지 + 응답)
```

원본 다이어그램: [https://mintcdn.com/claude-code/VbDJw--l6T9a9Wvm/images/prompt-caching-prefix.svg?fit=max&auto=format&n=VbDJw--l6T9a9Wvm&q=85&s=f2e8f0b8298a50305fe428ca3f1d1594](https://mintcdn.com/claude-code/VbDJw--l6T9a9Wvm/images/prompt-caching-prefix.svg?fit=max&auto=format&n=VbDJw--l6T9a9Wvm&q=85&s=f2e8f0b8298a50305fe428ca3f1d1594)

### 이 규칙 하나로 대부분이 설명된다

> The prefix-match rule explains most of the behaviors on this page.

이 페이지에 나오는 동작 대부분은 prefix 일치 규칙으로 설명된다.

- **prefix-match rule**: "앞부분이 정확히 같으면 캐시에서 읽고, 바뀐 지점부터는 다시 처리한다"는 위의 규칙이다
- **most of the behaviors**: 어떤 행동이 캐시를 깨고 어떤 행동이 캐시를 지키는지를 하나하나 외우지 않아도, "그 행동이 prefix 안쪽을 바꾸는가, 끝에 덧붙는가"로 대부분 판단할 수 있다는 뜻이다

> Plan mode and skill loading, for example, append their instructions as conversation messages, so the cached prefix stays intact.

예를 들어 plan mode와 스킬 로딩은 자기 지시문을 대화 메시지로 덧붙이므로, 캐시된 prefix가 그대로 유지된다.

- **append ... as conversation messages**: 지시문을 앞쪽 시스템 프롬프트에 끼워 넣지 않고 대화 끝에 메시지로 붙인다. 끝에 붙으니 앞부분은 바뀌지 않는다
- **stays intact**: 캐시된 앞부분이 깨지지 않고 그대로 쓰인다는 뜻이다. 같은 지시문을 시스템 프롬프트에 끼웠다면 위 그림의 Turn 4처럼 전체를 다시 처리했을 것이다

---

## 종합

프롬프트 캐싱은 요청의 앞부분(prefix)을 최근에 처리한 내용과 맞춰 보고, 기준은 완전 일치다. 평소 턴에서는 직전 요청 전체가 그대로 이번 요청의 앞부분이 되므로, 끝에 새로 붙은 주고받음만 새로 처리하면 된다.

반대로 앞부분 어딘가가 한 글자라도 바뀌면 그 지점 뒤는 내용이 같아도 전부 다시 처리한다. 파일 단위·구간 단위로 따로 캐시하는 방식이 아니라 "앞에서부터 어디까지 같은가" 하나로 판정하기 때문이다. 그래서 어떤 행동이 캐시에 영향을 주는지는 "앞쪽을 바꾸는가, 끝에 덧붙는가"로 가늠할 수 있다. plan mode·스킬 로딩이 캐시를 지키는 것도 끝에 덧붙는 쪽이기 때문이다.

---

# Claude Code는 prefix 매칭의 이득을 키우려고 요청 안의 내용을 어떤 원칙으로 배치하는가?

## 도입

앞부분이 정확히 같아야 캐시에서 읽을 수 있고, 바뀐 지점 뒤는 전부 다시 처리된다. 그렇다면 요청 안에서 자주 바뀌는 내용이 앞쪽에 있으면 거의 매 턴 캐시가 깨진다. 원문(Claude Code 문서의 "How Claude Code uses prompt caching" 페이지)은 Claude Code가 이 문제를 피하려고 요청 내용을 세 층으로 나눠 순서를 정한다고 설명한다.

용어 두 개가 표에 나온다.

- **auto memory**: Claude Code가 작업하면서 스스로 적어 두고 다음 세션에도 불러오는 메모다
- **unscoped rules**: 적용 경로(`paths:`)를 지정하지 않아 세션 시작 때 항상 불러오는 규칙 파일이다. 경로를 지정한 규칙은 해당 파일을 다룰 때 나중에 불러온다

---

## 본문

### 원칙: 드물게 바뀌는 것을 앞에

> To get the most out of prefix matching, Claude Code orders each request so content that rarely changes between turns comes first:

prefix 매칭에서 최대한 이득을 보려고, Claude Code는 턴 사이에 거의 바뀌지 않는 내용이 앞에 오도록 각 요청의 순서를 정한다.

- **To get the most out of prefix matching**: 앞부분이 같은 구간을 최대한 길게 만들려는 목적이다
- **orders each request**: 요청에 무엇을 싣느냐가 아니라 어떤 순서로 싣느냐를 정한다는 뜻이다
- **rarely changes between turns comes first**: 앞쪽이 안 바뀌어야 그 뒤까지 일치가 이어진다. 자주 바뀌는 것을 앞에 두면 그 뒤에 있는 안 바뀌는 내용까지 매번 다시 처리하게 된다

원문은 콜론 뒤에 순서를 표로 보여준다.

| Layer | Content | Changes when |
|---|---|---|
| System prompt | Core instructions, tool definitions | The set of loaded tool definitions changes |
| Project context | CLAUDE.md, auto memory, unscoped rules | Session starts, or after /clear or /compact |
| Conversation | Your messages, Claude's responses, tool results | Every turn |

| 층 | 내용 | 바뀌는 때 |
|---|---|---|
| 시스템 프롬프트 | 핵심 지시, tool 정의 | 불러온 tool 정의의 묶음이 바뀔 때 |
| 프로젝트 컨텍스트 | CLAUDE.md, auto memory, 경로 지정 없는 규칙 | 세션이 시작될 때, 또는 /clear나 /compact 뒤 |
| 대화 | 사용자 메시지, Claude 응답, tool 결과 | 매 턴 |

- **Layer**: 요청을 위에서 아래로 쌓은 층이다. 표의 위쪽 층이 요청의 앞쪽에 온다
- **The set of loaded tool definitions changes**: 시스템 프롬프트 층은 tool 정의의 묶음이 달라질 때 바뀐다. 평소 턴에서는 안 바뀐다
- **Session starts, or after /clear or /compact**: 프로젝트 컨텍스트 층은 세션 단위로 바뀐다. 한 세션 안에서 대화를 이어 가는 동안에는 그대로다
- **Every turn**: 대화 층은 매 턴 끝에 새 메시지가 붙는다

```
요청 1회 (위 = 앞쪽)
┌────────────────────────────────────────────────┐
│ 1. 시스템 프롬프트    핵심 지시, tool 정의          │  가장 드물게 바뀜
├────────────────────────────────────────────────┤
│ 2. 프로젝트 컨텍스트  CLAUDE.md, auto memory, 규칙  │  세션 시작·/clear·/compact 때
├────────────────────────────────────────────────┤
│ 3. 대화              메시지, 응답, tool 결과        │  매 턴 (끝에 덧붙음)
└────────────────────────────────────────────────┘
```

### 대화 층이 바뀔 때: 앞 두 층은 캐시된 채 남는다

> A change to the conversation layer leaves the system prompt and project context cached.

대화 층이 바뀌어도 시스템 프롬프트와 프로젝트 컨텍스트는 캐시된 채로 남는다.

- **leaves ... cached**: 대화 층은 맨 뒤에 있으므로, 거기서 무엇이 바뀌든 그 앞의 두 층은 prefix 일치가 유지된다. 매 턴 바뀌는 층을 맨 뒤에 둔 이유가 이것이다

### 시스템 프롬프트가 바뀔 때: 전부 무효

> A change to the system prompt invalidates everything, because all later content now sits behind a different prefix.

시스템 프롬프트가 바뀌면 모든 것이 무효가 된다. 그 뒤의 모든 내용이 이제 다른 prefix 뒤에 놓이기 때문이다.

- **invalidates everything**: 맨 앞 층이 바뀌면 일치가 처음부터 끊기므로, 프로젝트 컨텍스트와 대화 이력까지 전부 다시 처리한다
- **sits behind a different prefix**: 뒤쪽 내용 자체는 그대로여도, 그 앞이 달라졌으니 캐시된 것과 같은 앞부분이 아니다. 그래서 가장 드물게 바뀌는 것을 맨 앞에 둔다

```
                   대화 층이 바뀜                    시스템 프롬프트가 바뀜
시스템 프롬프트     캐시에서 읽음                      다시 처리
프로젝트 컨텍스트   캐시에서 읽음                      다시 처리 (내용은 같아도)
대화               바뀐 지점부터 새로 처리             다시 처리 (내용은 같아도)
```

JS 배열로 보면 순서가 왜 중요한지 드러난다(비유).

```js
// Claude Code의 배치: 안 바뀌는 것부터
const request = [systemPrompt, projectContext, ...conversation];
// 매 턴 conversation 끝에만 push → 앞의 두 원소는 그대로 → 앞부분 일치 유지

// 거꾸로 배치했다면
const reversed = [...conversation, projectContext, systemPrompt];
// 매 턴 conversation이 늘어나 projectContext·systemPrompt의 위치가 밀림
// → 그 지점부터 일치가 끊겨, 안 바뀌는 두 원소까지 매번 다시 처리
```

---

## 종합

원칙은 하나다. 턴 사이에 드물게 바뀌는 내용일수록 요청의 앞쪽에 둔다. 그래서 요청은 다음 세 층 순서로 쌓인다.

- 시스템 프롬프트: tool 정의 묶음이 바뀔 때만 바뀐다
- 프로젝트 컨텍스트: 세션 시작·/clear·/compact 때 바뀐다
- 대화: 매 턴 끝에 덧붙는다

prefix 매칭은 앞에서부터 같은 구간만 캐시에서 읽으므로, 이 순서면 평소 턴에서는 앞 두 층과 이전 대화까지 전부 캐시에서 읽고 끝에 붙은 것만 새로 처리한다. 대신 맨 앞의 시스템 프롬프트가 바뀌면 그 뒤가 내용이 같아도 전부 다시 처리되므로, tool 정의 묶음을 바꾸는 행동은 비싸다.

---

# 프롬프트 캐싱으로 이득을 보려면 반복되는 요청들이 어떤 공통점을 가져야 하는가?

## 도입

캐싱은 이전 요청이 캐시에 써 둔 앞부분을 다음 요청이 찾아 읽을 때만 이득이다. 캐시에 쓰는 요청은 오히려 더 비싸기 때문이다. 원문은 캐싱이 특히 쓸모 있는 경우를 네 가지로 나열한다. 네 경우를 하나씩 보면, 모두 같은 모양의 요청이라는 점이 드러난다.

---

## 본문

> This is especially useful for:

이것(프롬프트 캐싱)은 특히 다음 경우에 유용하다.

- **This**: 프롬프트 캐싱을 가리킨다
- **especially**: 다른 경우에 못 쓴다는 말이 아니라, 아래 경우에 이득이 특히 크다는 뜻이다

### 예시가 많은 프롬프트

> - Prompts with many examples

예시를 많이 담은 프롬프트.

- **many examples**: "이런 입력에는 이렇게 답하라"는 예시를 수십 개 넣은 프롬프트다. 예시 묶음은 길고, 실제로 물어보는 입력만 요청마다 바뀐다

### 많은 양의 컨텍스트나 배경 정보

> - Large amounts of context or background information

많은 양의 컨텍스트나 배경 정보.

- **Large amounts of context**: 긴 문서, 코드베이스, 제품 설명서처럼 질문할 때마다 함께 실어야 하는 자료다. 같은 문서에 질문을 여러 번 던지면 문서 부분은 매번 똑같다

### 지시가 일정한 반복 작업

> - Repetitive tasks with consistent instructions

지시가 일정하게 유지되는 반복 작업.

- **consistent instructions**: 지시문이 요청마다 바뀌지 않는다는 뜻이다. 예를 들어 같은 리뷰 규칙으로 여러 PR을 리뷰하면, 규칙 부분은 고정이고 PR 내용만 바뀐다

### 긴 멀티턴 대화

> - Long multi-turn conversations

긴 멀티턴 대화.

- **Long multi-turn**: 멀티턴 대화에서는 매 턴의 입력이 "이전 이력 전부 + 이번 메시지"다([멀티턴 대화에서 턴이 진행될수록 컨텍스트 윈도우의 토큰은 어떻게 불어나는가?](../../knowledge/ai/context-window.md#멀티턴-대화에서-턴이-진행될수록-컨텍스트-윈도우의-토큰은-어떻게-불어나는가)). 그래서 이번 턴의 요청 전체가 다음 턴 요청의 앞부분이 된다. 대화가 길수록 반복되는 앞부분이 커지므로 이득도 커진다

```
Turn 1 요청   [시스템 프롬프트][User1]
Turn 2 요청   [시스템 프롬프트][User1][Resp1][User2]
Turn 3 요청   [시스템 프롬프트][User1][Resp1][User2][Resp2][User3]
              └──────── 앞 턴의 요청이 그대로 다음 턴의 앞부분 ────────┘
```

---

## 종합

네 경우의 공통점은 하나다. 요청마다 바뀌지 않는 큰 앞부분이 여러 요청에 걸쳐 반복된다는 점이다.

- 예시가 많은 프롬프트: 예시 묶음이 고정된 앞부분
- 많은 양의 컨텍스트: 문서·자료가 고정된 앞부분
- 지시가 일정한 반복 작업: 지시문이 고정된 앞부분
- 긴 멀티턴 대화: 직전 턴까지의 이력이 다음 턴의 앞부분

앞부분이 "커야" 하는 이유는 캐시에서 읽어 아끼는 양이 그 크기에 비례하기 때문이고, "바뀌지 않아야" 하는 이유는 앞부분이 달라지면 이전 요청이 써 둔 캐시를 찾지 못해 다시 쓰기 비용을 내기 때문이다. 반대로 매 요청의 내용이 처음부터 다르거나, 같은 앞부분을 한 번만 보내는 작업에서는 쓰기 비용만 더 내고 끝난다.

---

# 프롬프트 캐시는 기본적으로 얼마 동안 유지되며, 그 수명은 어떻게 연장되는가?

## 도입

서버는 캐시를 찾을 때 "최근" 요청에서 만든 캐시만 찾는다. 캐시가 영원히 남지 않는다는 뜻이다. 그렇다면 캐시는 얼마 동안 남아 있고, 요청이 계속 오면 어떻게 되는가? 원문은 두 문장으로 답한다.

---

## 본문

### 기본 수명

> By default, the cache has a 5-minute lifetime.

기본적으로 캐시의 수명은 5분이다.

- **By default**: 따로 설정하지 않았을 때의 값이다. 요금표의 "1시간 쓰기" 열처럼 더 긴 수명을 고르는 설정도 있다
- **5-minute lifetime**: 캐시가 만들어진 뒤 5분이 지나면 사라진다. 사라진 뒤에 같은 앞부분으로 요청하면 캐시를 찾지 못하므로, 전체를 처리하고 다시 캐시에 쓴다

### 쓸 때마다 무료로 갱신된다

> The cache is refreshed for no additional cost each time the cached content is used.

캐시된 내용이 쓰일 때마다 캐시는 추가 비용 없이 갱신된다.

- **refreshed**: 남은 수명이 다시 5분으로 채워진다는 뜻이다. 브라우저에서 사용자가 움직일 때마다 `clearTimeout` 후 `setTimeout`을 다시 거는 비활성 타이머처럼, 캐시가 읽힐 때마다 5분 타이머가 처음부터 다시 돈다(비유)
- **for no additional cost**: 갱신에 따로 돈을 내지 않는다. 요금표의 "캐시 적중 및 갱신" 열이 하나로 묶인 이유다. 캐시를 읽는 값만 내면 갱신은 거기에 포함된다
- **each time the cached content is used**: 갱신되는 계기는 캐시가 실제로 읽히는 것이다. 요청이 5분 안에 계속 들어오면 캐시는 그 사이 사라지지 않는다

```
시간 →     0분        3분        7분                 13분
요청        ●          ●          ●                    ●
            쓰기       읽기       읽기                  ← 7분 이후 6분간 요청 없음
            │          │          │
수명        [──5분──]
                       [──5분──]                        (3분에 다시 5분)
                                  [──5분──]             (7분에 다시 5분, 12분에 만료)
                                                       13분: 캐시 없음 → 다시 쓰기 비용
```

---

## 종합

캐시는 기본 5분 동안 남고, 읽힐 때마다 무료로 그 5분이 처음부터 다시 시작된다. 그래서 같은 앞부분으로 요청이 5분 안에 계속 이어지는 동안에는 캐시가 살아 있고, 요청마다 싼 적중 가격만 낸다.

반대로 5분 넘게 요청이 없으면 캐시가 사라지고, 다음 요청은 앞부분을 처음부터 처리하면서 쓰기 비용(기본 입력의 1.25배)을 다시 낸다. 멀티턴 대화에서 사용자가 답장을 오래 미루면 다음 턴에서 쓰기 비용이 다시 붙는 것이 이 때문이다.

---

# 캐시 수명보다 오래 쉬었다가 보낸 첫 메시지는 왜 사용량이 크게 나오는가?

## 도입

캐시는 기본 5분 동안 남고, 읽힐 때마다 그 5분이 처음부터 다시 시작된다([프롬프트 캐시는 기본적으로 얼마 동안 유지되며, 그 수명은 어떻게 연장되는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐시는-기본적으로-얼마-동안-유지되며-그-수명은-어떻게-연장되는가)). 대화를 이어 가는 동안에는 요청이 계속 캐시를 읽어 수명을 늘려 주지만, 사용자가 자리를 비우면 아무도 캐시를 읽지 않는다. 점심을 먹고 돌아와 같은 세션에 메시지를 보내는 상황이 그렇다.

원문(Claude Code 공식 문서의 "Manage costs effectively" 페이지)은 이 상황을 사용량이 커지는 이유 중 하나인 cache miss로 짚는다.

- **cache miss**: 요청이 캐시에서 앞부분을 찾지 못한 경우다. 캐시 적중(cache hit)의 반대다
- **warm / cold**: 캐시가 아직 수명 안에 있어 읽을 수 있는 상태가 warm, 수명이 지나 사라진 상태가 cold다

---

## 본문

> - **Cache misses**: your first message after a break longer than the cache lifetime misses the cache and reprocesses your full context.

캐시 미스: 캐시 수명보다 긴 휴식 뒤에 보낸 첫 메시지는 캐시를 놓치고, 컨텍스트 전체를 다시 처리한다.

- **your first message**: 휴식 뒤의 첫 메시지 하나다. 그 요청이 컨텍스트를 다시 처리하고 캐시에 쓰므로, 두 번째 메시지부터는 다시 캐시에서 읽는다
- **a break longer than the cache lifetime**: 마지막 요청·응답 뒤 캐시 수명(기본 5분)보다 오래 아무 요청도 없었던 경우다. 5분 넘게 쉬면 이미 이 조건에 든다
- **misses the cache**: 대화 내용은 하나도 안 바뀌었는데도 캐시를 못 읽는다. 앞부분이 달라져서가 아니라 캐시가 이미 사라졌기 때문이다
- **reprocesses your full context**: 새 메시지만이 아니라 시스템 프롬프트·프로젝트 컨텍스트·이전 대화 전체를 처음부터 처리한다. 이력이 긴 세션일수록 이 한 번이 크다

요금표(Opus 5.5)로 이력까지 포함한 앞부분 10만 토큰을 기준으로 비교하면 차이가 보인다.

```
앞부분 10만 토큰         쉬지 않고 보낸 메시지          캐시 수명보다 오래 쉰 뒤 첫 메시지
캐시 상태               warm (읽음)                   cold (없음)
처리                    캐시에서 읽음                  전체를 처음부터 처리하고 다시 캐시에 씀
입력 가격               적중 $0.20/MTok → 약 $0.02     5분 쓰기 $5/MTok → 약 $0.50
기본 입력 대비          0.05배                         1.25배 (25배 차이)
```

```
시간 →   10:00     10:03     10:05            (점심)            13:00     13:01
요청      ●         ●         ●                                   ●         ●
          읽기      읽기      읽기    10:10 캐시 만료              전체 재처리  읽기
                                                                 + 다시 쓰기
                                                                 ↑ 크게 나오는 한 번
```

---

## 종합

쉬었다 돌아온 첫 메시지가 큰 이유는, 그 사이 캐시가 사라져 그 메시지가 컨텍스트 전체를 처음부터 처리하기 때문이다. 대화 내용이 그대로여도 캐시는 시간이 지나면 사라지므로, 쉬기 전에는 0.05배로 읽던 앞부분을 이번에는 1.25배로 다시 쓴다.

비용은 그 한 번에서 끝난다. 첫 메시지가 새로 캐시를 써 두므로 다음 메시지부터는 다시 캐시에서 읽는다. 그래서 돌아온 첫 메시지의 비용은 그 세션의 컨텍스트 크기를 따라간다. 이력이 길게 쌓인 세션일수록 돌아온 첫 메시지가 무겁고, 짧은 세션은 다시 처리해도 부담이 작다.

---

# 세션 도중 모델이나 effort 수준을 바꾸면 프롬프트 캐시는 어떻게 되는가?

## 도입

요청은 시스템 프롬프트 → 프로젝트 컨텍스트 → 대화 세 층으로 쌓이고, 앞쪽이 바뀌면 그 뒤가 전부 다시 처리된다. 그런데 요청의 내용(층)은 그대로인데 캐시에 영향을 주는 것이 있다. 원문(Claude Code 문서의 "How Claude Code uses prompt caching" 페이지)은 그런 설정 두 개를 짚는다.

- **effort 수준(effort level)**: Claude Code에서 모델이 응답에 얼마나 공을 들일지(생각을 얼마나 깊게 할지) 정하는 설정이다
- **TTL(time to live)**: 캐시가 마지막으로 쓰인 뒤 살아 있는 시간, 즉 캐시 수명이다. 기본은 5분이고, 1시간짜리 설정도 있다
- **warm / cold**: 캐시가 아직 TTL 안에 있어 읽을 수 있는 상태를 warm, TTL이 지나 만료된 상태를 cold라고 부른다

---

## 본문

### 층 표에 없는 두 설정

> Two settings don't appear in the layer table but still affect what stays cached:

층 표에는 나오지 않지만 무엇이 캐시된 채 남는지에 영향을 주는 설정이 두 개 있다.

- **don't appear in the layer table**: 시스템 프롬프트·프로젝트 컨텍스트·대화 어느 층의 내용도 아니라는 뜻이다. 요청 내용이 한 글자도 안 바뀌어도 캐시를 놓칠 수 있다

### 모델: 모델마다 캐시가 따로

> - **Model**: each model has its own cache.

모델: 모델마다 캐시가 따로 있다.

- **its own cache**: 한 모델이 쌓은 캐시를 다른 모델이 읽지 못한다. 브라우저 HTTP 캐시에서 응답에 `Vary: Accept-Language`가 붙으면 같은 URL이라도 요청의 언어 헤더마다 따로 저장되는 것처럼, 내용이 같아도 모델이 다르면 다른 캐시다(비유)

> Switching models recomputes the entire request even when the content is identical.

모델을 바꾸면 내용이 똑같아도 요청 전체를 다시 계산한다.

- **the entire request**: 앞부분 일부가 아니라 전체다. 새 모델 쪽에는 이 대화의 캐시가 아예 없기 때문이다
- **even when the content is identical**: prefix 일치 규칙은 같은 모델의 캐시 안에서만 통한다는 뜻이다

### effort 수준: 대부분의 모델에서 수준마다 캐시가 따로

> - **Effort level**: on most models, each effort level has its own cache, so changing effort mid-session recomputes the entire request.

effort 수준: 대부분의 모델에서 effort 수준마다 캐시가 따로 있어서, 세션 도중 effort를 바꾸면 요청 전체를 다시 계산한다.

- **on most models**: 모든 모델이 그렇지는 않다는 단서다. 바로 아래 문장이 예외를 적는다
- **each effort level has its own cache**: 모델과 같은 구조다. 같은 모델이라도 effort가 다르면 다른 캐시를 쓴다
- **mid-session**: 세션 처음에 정하는 것은 문제가 없다. 대화 이력이 쌓인 뒤에 바꾸면 그 이력 전체를 다시 처리한다

> On Opus 5.5, Sonnet 5.5, Haiku 5.5, and Fable 5.1 with an API key or a Claude subscription, the cache stays intact by default.

Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.1을 API 키나 Claude 구독으로 쓰면, 기본적으로 캐시가 그대로 유지된다.

- **with an API key or a Claude subscription**: 모델 이름만이 아니라 어떤 경로로 쓰느냐까지 맞아야 하는 예외다
- **stays intact by default**: 이 조합에서는 effort를 바꿔도 캐시를 잃지 않는다. 모델 변경에는 이런 예외가 없다

```
                 모델 변경                      effort 수준 변경
캐시 단위        모델마다 따로                   대부분의 모델: 수준마다 따로
결과             요청 전체 재계산                요청 전체 재계산
예외             없음                           Opus 5.5·Sonnet 5.5·Haiku 5.5·Fable 5.1
                                               + API 키·Claude 구독 → 기본적으로 캐시 유지
```

### 권장: 처음에 정하고, compact는 작업 사이에

> Pick your model and effort level at the top of a session, then save `/compact` for natural breaks between tasks.

모델과 effort 수준은 세션 맨 처음에 고르고, `/compact`는 작업과 작업 사이의 자연스러운 쉼에 쓰라.

- **at the top of a session**: 이력이 거의 없을 때 정하면 다시 처리할 것도 거의 없다
- **save `/compact` for natural breaks**: compact도 캐시에 영향을 주는 행동이라, 작업 도중이 아니라 작업이 끝난 지점으로 미루라는 뜻이다

> The fewer changes you make mid-task, the higher your cache hit rate.

작업 도중에 바꾸는 것이 적을수록 캐시 적중률이 높아진다.

- **cache hit rate**: 요청에서 캐시에서 읽은 비율이다. 작업 중 설정을 바꿀 때마다 이 비율이 한 번씩 떨어진다

### /model로 바꿀 때 실제로 일어나는 일

> Switching with /model means the next request reads the entire conversation history with no cache hits, even though the content is identical.

/model로 모델을 바꾸면, 내용이 똑같더라도 다음 요청은 대화 이력 전체를 캐시 적중 없이 읽는다.

- **the next request**: 바꾸는 순간이 아니라, 바꾼 뒤 처음 보내는 요청에서 비용이 생긴다
- **with no cache hits**: 이력 전체를 캐시에서 하나도 읽지 못하고 처음부터 처리한다. 이력이 길수록 이 한 턴이 느리고 비싸다

> When you run /model at the terminal, Claude Code asks you to confirm the switch only while the cache is still warm and the new model isn't the one that produced the last response.

터미널에서 /model을 실행하면, Claude Code는 캐시가 아직 warm이고 새 모델이 마지막 응답을 만든 모델이 아닐 때만 전환을 확인하라고 묻는다.

- **only while the cache is still warm**: 바꾸면 잃을 캐시가 있을 때만 묻는다
- **the new model isn't the one that produced the last response**: 마지막 응답을 만든 모델로 돌아가는 경우는 묻지 않는다

> The cache stays warm for one cache TTL after Claude Code last sent a request in this conversation or Claude last responded.

캐시는 Claude Code가 이 대화에서 마지막으로 요청을 보냈거나 Claude가 마지막으로 응답한 뒤 TTL 한 번 동안 warm 상태로 남는다.

- **one cache TTL**: 캐시 수명 한 주기다. 기본 5분이면 마지막 요청·응답 뒤 5분이다
- **last sent a request ... or Claude last responded**: 시계의 기준점이 마지막 활동이다. 요청이 오갈 때마다 수명이 다시 채워지는 것과 같은 이야기다

> Once that time passes, the cache has expired, so Claude Code switches without asking.

그 시간이 지나면 캐시는 이미 만료됐으므로, Claude Code는 묻지 않고 바꾼다.

- **expired**: cold 상태다. 모델을 안 바꿔도 다음 요청은 어차피 캐시를 못 읽는다
- **switches without asking**: 잃을 캐시가 없으니 확인할 이유도 없다

```
/model 실행
   │
   ▼
캐시가 warm인가? (마지막 요청·응답 뒤 TTL 안)
   │
   ├── 아니오 (cold) ──────────────────────────────→ 묻지 않고 바꾼다 (잃을 캐시 없음)
   │
   └── 예 → 새 모델이 마지막 응답을 만든 모델인가?
              ├── 예 ───────────────────────────────→ 묻지 않는다
              └── 아니오 ───────────────────────────→ 확인을 묻는다
                                                       (바꾸면 다음 요청이 이력 전체를 캐시 없이 읽음)
```

---

## 종합

모델과 effort 수준은 요청 내용의 층이 아니라 캐시 자체를 나누는 기준이다. 모델마다, 그리고 대부분의 모델에서는 effort 수준마다 캐시가 따로 있으므로, 세션 도중에 바꾸면 내용이 한 글자도 안 바뀌어도 다음 요청이 이력 전체를 다시 처리한다. effort만은 Opus 5.5·Sonnet 5.5·Haiku 5.5·Fable 5.1을 API 키나 구독으로 쓸 때 기본적으로 캐시가 유지되는 예외가 있다.

Claude Code는 이 비용을 알리려고, 잃을 캐시가 있을 때(warm이고 다른 모델로 바꿀 때)만 /model 전환을 확인한다. 실무에서는 세션을 시작할 때 모델과 effort를 정하고, 작업 중에는 바꾸지 않는 것이 적중률을 지키는 방법이다.

---

# Claude Code에서 캐시를 무효화하는 행동을 하면 다음 요청은 어떻게 되는가?

## 도입

캐시는 요청의 앞부분이 정확히 같을 때만 읽히고, 요청은 시스템 프롬프트 → 프로젝트 컨텍스트 → 대화 순으로 쌓인다. 여기에 층 표 밖에서 캐시를 나누는 모델·effort가 있다. 원문(Claude Code 문서의 "How Claude Code uses prompt caching" 페이지)은 Claude Code에서 캐시를 놓치게 만드는 행동을 아홉 가지로 나열한다. 각 행동이 이 중 어디를 건드리는지 보면 왜 목록에 있는지가 보인다.

- **MCP 서버**: Claude Code에 외부 도구를 붙이는 서버다. 연결하면 그 서버의 도구가 Claude가 쓸 수 있는 tool로 추가된다
- **fast mode**: Claude Code에서 응답 속도를 높이는 모드다

---

## 본문

### 결과: 캐시의 일부 또는 전부를 놓친다

> These actions can cause the next request to miss part or all of the cache.

이 행동들은 다음 요청이 캐시의 일부 또는 전부를 놓치게 만들 수 있다.

- **can cause**: 항상 그렇다는 것이 아니라 그럴 수 있다는 뜻이다. 같은 행동이라도 실제로 요청의 앞부분을 바꾸는지에 따라 다르다
- **the next request**: 행동한 바로 그 순간이 아니라, 그 뒤 처음 보내는 요청에서 비용이 드러난다
- **part or all**: 무엇을 건드리느냐에 따라 다르다. 맨 앞 층이나 캐시 자체를 바꾸면 전부, 뒤쪽 층을 바꾸면 그 앞까지는 캐시에서 읽는다

> You see a one-time slower, more expensive turn, after which the new prefix is cached.

한 번 더 느리고 비싼 턴을 겪고, 그 뒤에는 새 prefix가 캐시된다.

- **one-time**: 영구적인 손해가 아니다. 무효화된 다음 턴에서 새 앞부분을 처리하고 캐시에 쓰므로, 그다음 턴부터는 다시 캐시에서 읽는다
- **the new prefix is cached**: 바뀐 내용을 기준으로 캐시가 새로 만들어진다는 뜻이다

### 아홉 가지 행동

> - Switching models
> - Changing effort level
> - Turning on fast mode
> - Connecting or removing an MCP server
> - Enabling or disabling a plugin
> - Denying an entire tool
> - Compacting the conversation
> - Accumulating many images
> - Upgrading Claude Code

각 항목이 어디를 건드리는지 한 줄씩 보면 다음과 같다.

- **Switching models** (모델 바꾸기): 모델마다 캐시가 따로라서, 다음 요청은 요청 전체를 캐시 없이 처리한다
- **Changing effort level** (effort 수준 바꾸기): 대부분의 모델에서 effort 수준마다 캐시가 따로라서 마찬가지로 전체를 다시 처리한다
- **Turning on fast mode** (fast mode 켜기): 대화 내용이 아니라 요청 자체의 설정을 바꾸는 쪽이다. 모델·effort처럼 층 표 밖에서 캐시에 영향을 준다
- **Connecting or removing an MCP server** (MCP 서버 연결·제거): 요청에 실리는 tool 정의 묶음이 바뀔 수 있다. tool 정의는 맨 앞의 시스템 프롬프트 층에 있으므로, 바뀌면 그 뒤 전부가 무효다
- **Enabling or disabling a plugin** (플러그인 켜기·끄기): 플러그인이 tool(MCP 서버 등)을 함께 들여오거나 빼면, MCP 서버와 같은 이유로 시스템 프롬프트 층이 바뀐다
- **Denying an entire tool** (tool 하나를 통째로 거부): 그 tool의 정의가 요청에서 빠질 수 있다. 역시 시스템 프롬프트 층의 tool 정의 묶음이 바뀌는 경우다
- **Compacting the conversation** (대화 compact): 대화 이력을 요약으로 갈아 끼우고, 층 표대로 프로젝트 컨텍스트 층도 compact 뒤에 다시 불러온다. 맨 앞의 시스템 프롬프트 층은 그대로일 수 있으므로 "일부"를 놓치는 경우다
- **Accumulating many images** (이미지가 많이 쌓임): 대화 층의 일이다. 대화 층은 평소 끝에 덧붙기만 해서 캐시를 깨지 않는데, 이 항목이 목록에 있다는 것은 prefix 규칙으로 보면 이미 보낸 대화 부분이 달라진다는 뜻이다. 그 지점부터 뒤를 다시 처리한다
- **Upgrading Claude Code** (Claude Code 업그레이드): 새 버전은 핵심 지시나 tool 정의를 바꾸는 경우가 많다. 시스템 프롬프트 층이 바뀌므로 업그레이드 뒤 첫 대화는 캐시를 처음부터 다시 만든다

```
캐시를 놓치게 하는 행동
├── 층 표 밖 (내용이 같아도 캐시를 놓침)
│   ├── 모델 바꾸기             → 전부
│   ├── effort 수준 바꾸기       → 대부분의 모델에서 전부
│   └── fast mode 켜기
├── 시스템 프롬프트 층 (tool 정의·핵심 지시)  → 바뀌면 전부
│   ├── MCP 서버 연결·제거
│   ├── 플러그인 켜기·끄기
│   ├── tool 하나를 통째로 거부
│   └── Claude Code 업그레이드
├── 프로젝트 컨텍스트 층 + 대화 층          → 시스템 프롬프트 층은 남을 수 있음 (일부)
│   └── 대화 compact
└── 대화 층 (이미 보낸 부분이 달라짐)       → 그 지점부터 (일부)
    └── 이미지가 많이 쌓임
```

---

## 종합

아홉 행동의 결과는 같다. 다음 요청 한 번이 캐시의 일부나 전부를 놓쳐 느리고 비싸지고, 그 턴에 새 앞부분이 캐시에 쓰이면 이후로는 다시 캐시에서 읽는다. 차이는 얼마나 놓치느냐이고, 그것은 행동이 건드리는 곳으로 갈린다.

- 캐시 자체를 나누는 설정(모델·effort·fast mode): 내용이 같아도 캐시를 놓친다
- 맨 앞 층(시스템 프롬프트의 tool 정의·핵심 지시): 그 뒤 전부를 다시 처리한다
- 뒤쪽 층(compact, 이미지 정리): 바뀐 지점 앞까지는 캐시에서 읽는다

대부분은 작업 도중에 피할 수 있는 행동이다. 비용이 한 번뿐이라도 이력이 길수록 그 한 번이 커지므로, 이런 변경은 작업 사이로 미루는 것이 낫다.

---

# /compact의 요약 요청은 캐시가 살아 있을 때와 만료됐을 때 비용이 어떻게 다른가?

## 도입

`/compact`는 대화 이력을 요약으로 바꿔 컨텍스트를 줄이는 명령이다. 그런데 요약을 만드는 일 자체도 모델에 보내는 요청이고, 그 요청에는 요약할 이력이 통째로 실린다. 원문(Claude Code 문서의 "How Claude Code uses prompt caching" 페이지)은 이 요약 요청의 비용이 캐시가 warm(TTL 안)인지 cold(TTL이 지나 만료)인지에 따라 크게 갈린다고 설명한다. 먼저 그 요약 요청이 어떻게 생겼는지부터 본다.

---

## 본문

### 요약 요청은 기존 대화와 같은 앞부분으로 시작한다

> To produce the summary, Claude Code sends a separate request.

요약을 만들려고 Claude Code는 별도의 요청을 보낸다.

- **a separate request**: 평소 대화 턴과는 다른, 요약만을 위한 요청이다. 아래 OA의 "that request"가 이 요청이다

> The request repeats your conversation's system prompt, tools, and the history being summarized.

그 요청은 대화의 시스템 프롬프트, tool, 그리고 요약할 이력을 그대로 다시 싣는다.

- **repeats**: 새로 구성하지 않고 기존 대화 요청에 실리던 것을 그대로 싣는다

> It ends with a summarization instruction.

그리고 끝에 요약 지시를 붙인다.

- **ends with**: 요약 지시가 맨 끝에 붙는다. 그래서 그 앞부분은 기존 대화 요청과 같은 prefix가 되고, 캐시에서 읽을 수 있는 모양이 된다. plan mode·스킬이 지시문을 끝에 덧붙여 캐시를 지키는 것과 같은 방식이다

```
기존 대화 요청   [시스템 프롬프트·tool … 대화 이력]
요약 요청        [시스템 프롬프트·tool … 대화 이력][요약 지시]
                 └──── 기존 대화 요청과 같은 prefix ────┘ └ 끝에 덧붙음 ┘
```

### 캐시가 warm일 때: 앞부분을 캐시에서 읽는다

> While the cache is warm, that request reads your prefix from the cache.

캐시가 warm인 동안에는, 그 요청이 prefix를 캐시에서 읽는다.

- **that request**: 위에서 본 요약 요청이다
- **reads your prefix from the cache**: 요약할 이력까지의 앞부분을 다시 처리하지 않고 캐시 적중 가격으로 읽는다

> A mid-session `/compact` then costs a fraction of what the context size suggests and spends most of its time generating the summary.

그러면 세션 도중의 `/compact`는 컨텍스트 크기로 짐작되는 비용의 일부만 들고, 시간 대부분을 요약을 생성하는 데 쓴다.

- **a fraction of what the context size suggests**: 컨텍스트가 크다고 그만큼 비싸지 않다. 이력을 캐시에서 읽으니 기본 입력 가격의 일부만 낸다
- **spends most of its time generating the summary**: 이력 처리는 캐시로 건너뛰고, 걸리는 시간은 대부분 요약 문장을 만들어 내는 출력 쪽이다

### 캐시가 만료됐을 때: 이력 전체를 다시 처리한다

> After a break longer than the cache lifetime, there is no cache left to read, so the summarization request reprocesses that history as uncached input.

캐시 수명보다 긴 휴식 뒤에는 읽을 캐시가 남아 있지 않으므로, 요약 요청은 그 이력을 캐시되지 않은 입력으로 다시 처리한다.

- **a break longer than the cache lifetime**: 마지막 요청·응답 뒤 TTL이 지난 cold 상태다
- **reprocesses that history as uncached input**: 요약할 이력 전체를 처음부터 처리하고, 기본 입력 가격으로 낸다. 요약 지시가 끝에 붙는 같은 모양이어도, 맞춰 볼 캐시가 없으니 소용이 없다

> This is why /compact costs the most when you resume an old session.

그래서 /compact는 오래된 세션을 이어서 열었을 때 가장 비싸다.

- **resume an old session**: 예전에 하던 세션을 다시 열어 이어 가는 경우다. 이력은 길고 캐시는 이미 만료돼 있으니, 그 자리에서 compact하면 긴 이력 전체를 캐시 없이 처리한다

앞 질문의 요금표(Opus 5.5)로 요약할 이력 10만 토큰의 입력 비용만 대략 비교하면 차이가 보인다. 요약 출력 비용은 두 경우에 똑같이 붙으므로 빼고 본다.

```
요약할 이력 10만 토큰     캐시 warm                    캐시 cold
이력 처리                 캐시에서 읽음                 캐시 없음 → 처음부터 처리
입력 가격                 적중 $0.20/MTok → 약 $0.02     기본 $4/MTok → 약 $0.40
시간 대부분               요약 생성                     이력 처리 + 요약 생성
compact 다음 턴           짧은 요약분만 새로 캐시        짧은 요약분만 새로 캐시
```

### compact 다음 턴은 느린 구간이 아니다

> In both the warm and cold cases, the turn after compaction rebuilds the conversation cache for only the much shorter summary, so that turn isn't the slow part.

warm이든 cold든, compact 다음 턴은 훨씬 짧은 요약분에 대해서만 대화 캐시를 다시 만들므로, 그 턴은 느린 구간이 아니다.

- **rebuilds the conversation cache for only the much shorter summary**: compact 뒤 대화 층은 긴 이력이 아니라 짧은 요약이다. 새로 캐시에 써야 하는 양이 작다
- **isn't the slow part**: 비용 차이가 나는 곳은 compact 다음 턴이 아니라 요약 요청 자체다

> The next request reads it from the cache only if CLAUDE.md and memory are unchanged since the session started.

(compact 뒤 프로젝트 컨텍스트 층은 디스크에서 다시 불러오는데) 다음 요청이 그 층을 캐시에서 읽는 것은 세션 시작 이후 CLAUDE.md와 memory가 바뀌지 않았을 때뿐이다.

- **it**: compact 뒤 다시 불러온 프로젝트 컨텍스트 층이다
- **unchanged since the session started**: 세션 도중 CLAUDE.md를 고쳤다면 compact 뒤 그 새 내용이 실리므로 앞부분이 달라져, 그 층부터 다시 처리한다

### compact가 이득이 되는 때와 자동 compact

> Compaction works in your favor when the context you discard is content you no longer need.

compact는 버리는 컨텍스트가 더 이상 필요 없는 내용일 때 이득이 된다.

- **works in your favor**: 요약 요청 비용을 한 번 내고, 그 뒤 턴마다 짧아진 이력으로 요청하게 된다. 배열의 앞쪽 원소들을 `splice()`로 잘라 내고 그 자리에 요약 원소 하나를 넣는 것(비유)과 같아서, 잘라 낸 내용이 다시 필요해지면 그 이득이 사라진다

> If you leave a long conversation idle in a terminal session while it is on the one-hour TTL, Claude Code can compact it shortly before the cache expires.

터미널 세션에서 1시간 TTL을 쓰는 긴 대화를 방치해 두면, Claude Code가 캐시가 만료되기 직전에 그 대화를 compact할 수 있다.

- **on the one-hour TTL**: 캐시 수명이 1시간으로 잡힌 대화다
- **shortly before the cache expires**: 만료 직전, 즉 아직 warm일 때다. 위의 비교로 보면, 만료된 뒤 돌아와서 compact하면 cold 비용을 내야 하지만 만료 직전에 compact하면 warm 비용으로 끝난다

---

## 종합

`/compact`의 요약 요청은 기존 대화의 시스템 프롬프트·tool·이력을 그대로 싣고 끝에 요약 지시만 붙이므로, 앞부분이 기존 대화 요청과 같다. 그래서 비용은 그 앞부분을 캐시에서 읽을 수 있느냐로 갈린다.

- warm: 이력을 캐시에서 읽으므로 컨텍스트 크기에 비해 일부 비용만 들고, 시간은 대부분 요약 생성에 쓴다
- cold: 읽을 캐시가 없어 이력 전체를 캐시되지 않은 입력으로 다시 처리한다. 오래된 세션을 이어 열고 compact할 때가 가장 비싸다

어느 쪽이든 compact 다음 턴은 짧은 요약분만 새로 캐시하므로 느린 구간이 아니다. 실무에서는 캐시가 살아 있을 때 작업 사이에 compact하는 것이 싸다. 1시간 TTL에서 대화를 방치하면 Claude Code가 만료 직전에 compact할 수 있는데, 위 비교로 보면 이는 cold가 되기 전에 warm 비용으로 compact하는 셈이다.

---

# 새로 시작하는 게 목적이면 /compact와 /clear 중 무엇이 싸며, 왜 그런가?

## 도입

`/compact`는 요약을 만들려고 기존 대화의 시스템 프롬프트·tool·이력을 그대로 싣고 끝에 요약 지시를 붙인 요청을 따로 보낸다. 그 요청의 비용은 캐시가 warm이면 앞부분을 캐시 요금으로 읽어 컨텍스트 크기에 비해 작게 들고, cold면 이력 전체를 캐시 없이 처리한다([/compact의 요약 요청은 캐시가 살아 있을 때와 만료됐을 때 비용이 어떻게 다른가?](../../knowledge/ai/prompt-caching.md#compact의-요약-요청은-캐시가-살아-있을-때와-만료됐을-때-비용이-어떻게-다른가)).

`/clear`는 지금 대화를 요약 없이 비우고 새로 시작하는 명령이다. 두 명령 모두 컨텍스트를 작게 만들지만 남기는 것이 다르다. compact는 지금까지의 흐름을 요약으로 남기고, clear는 아무것도 남기지 않는다. 원문(Claude Code 공식 문서의 "Manage costs effectively" 페이지)은 이 차이를 비용 쪽에서 본다.

---

## 본문

### 새 출발이 목적이면 /clear는 비용이 없다

> When you want a fresh start instead of continuity, `/clear` costs nothing

이어 가기(continuity)가 아니라 새 출발을 원한다면, `/clear`는 비용이 들지 않는다.

- **a fresh start instead of continuity**: 두 명령을 가르는 기준이다. continuity는 지금까지의 대화 흐름을 다음 작업에 이어 가는 것이다. 새 출발이면 이어 갈 흐름이 필요 없다
- **costs nothing**: `/clear`는 대화를 비우기만 하고, 요약을 만드는 요청을 보내지 않는다. 그래서 명령 자체에 드는 사용량이 없다

### /compact는 그 자체가 큰 요청이다

> - **Compaction**: `/compact` reads the conversation it summarizes, so compacting a large context is itself a large request.

compact: `/compact`는 요약할 대화를 읽으므로, 큰 컨텍스트를 compact하는 일은 그 자체로 큰 요청이다.

- **reads the conversation it summarizes**: 요약하려면 요약할 대화를 전부 실어 보내야 한다. 요약 요청이 기존 대화와 같은 앞부분에 요약 지시를 덧붙인 모양인 것이 이 때문이다
- **compacting a large context is itself a large request**: 컨텍스트를 줄이려는 명령인데, 줄이는 과정에서 그 큰 컨텍스트를 한 번 처리한다. 캐시가 warm이면 캐시 요금으로 읽지만, cold면 전부 캐시 없는 입력(uncached input)으로 다시 처리한다

```
                     /compact                                   /clear
명령이 보내는 요청     요약 요청 1회 (대화 전체 + 요약 지시)          없음
명령 자체의 비용       warm: 캐시 요금으로 대화 전체를 읽음           없음
                     cold: 대화 전체를 캐시 없이 다시 처리
남는 것              지금까지의 흐름을 담은 요약                    없음 (빈 대화)
어울리는 때           같은 작업을 이어 갈 때 (continuity)           관련 없는 새 작업을 시작할 때
```

---

## 종합

새 출발이 목적이라면 `/clear`가 싸다. `/compact`는 남길 요약을 만들려고 요약할 대화 전체를 실은 요청을 한 번 보내야 하고, 대화가 클수록 그 요청도 크다. `/clear`는 아무것도 남기지 않으니 그런 요청이 없다.

판단 기준은 "지금까지의 흐름이 다음 작업에 필요한가"다.

- 필요하다(continuity): `/compact`. 요약 요청 비용을 내는 대신 흐름을 남긴다. 캐시가 warm일 때 하면 그 비용도 작다
- 필요 없다(새 출발): `/clear`. 요약 비용을 낼 이유가 없다

새 작업을 시작하면서 습관처럼 `/compact`를 쓰면, 쓰지도 않을 요약을 만드느라 큰 요청 하나를 보내는 셈이다. 특히 오래 쉬었다 돌아와 캐시가 cold인 세션에서는 그 요청이 이력 전체를 캐시 없이 다시 처리하므로 가장 비싸다.
