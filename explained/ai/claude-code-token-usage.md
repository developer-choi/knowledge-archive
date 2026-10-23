# 몇 시간째 열어둔 Claude Code 세션이 실제 활동량보다 사용량을 훨씬 많이 쓰는 이유는 무엇인가?

## 도입

Claude Code는 메시지를 보낼 때마다 시스템 프롬프트부터 이전 대화 전체까지 다시 실어 API 요청을 새로 보낸다([프롬프트 캐싱은 Claude Code에서 어떤 문제를 해결하는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐싱은-claude-code에서-어떤-문제를-해결하는가)). 프롬프트 캐싱 덕분에 그 반복 부분을 싼 가격으로 읽지만, 읽은 양만큼 사용량은 여전히 든다.

원문(Claude Code 공식 문서의 "Manage costs effectively" 페이지)은 오래 열어 둔 세션이 사용량을 많이 쓰는 이유를 여러 항목으로 나열한다. 그중 Long context는 다른 이유들이 모두 기대는 성질(매 요청에 대화 전체가 실린다)을 다루고, 같은 페이지는 사용자가 입력하지 않는 동안에도 새 요청이 생기는 경로들을 함께 적는다.

- **plan limits**: Pro·Max 같은 Claude 구독 플랜에 걸린 사용 한도다. 원문이 "사용량"이라고 할 때 이 한도에서 얼마나 깎이는지를 말한다
- **turn**: 메시지 하나(보통 사용자 메시지)로 시작해 Claude가 답을 마칠 때까지의 한 차례다. 턴 안에서 나가는 요청은 모두 컨텍스트 전체를 싣고, tool을 쓰면 한 턴에 요청이 여러 번 나간다

---

## 본문

### 활동량보다 사용량이 많아지는 이유가 있다

> A session that has been open for hours can use far more of your plan limits than your activity suggests, usually for one of these reasons:

몇 시간째 열려 있는 세션은 활동량으로 짐작되는 것보다 플랜 한도를 훨씬 많이 쓸 수 있는데, 대개 다음 이유 중 하나 때문이다.

- **than your activity suggests**: "내가 한 일"을 기준으로 짐작한 양이다. 짧은 질문 몇 개만 했어도 사용량은 그 질문의 길이가 아니라 요청에 실린 전체 양을 따라간다
- **usually for one of these reasons**: 이유가 하나가 아니라는 뜻이다. 아래 Long context가 그중 하나다

### 컨텍스트가 길다 (Long context)

> - **Long context**: Claude Code sends your full conversation with every request, and each time Claude uses tools it sends another request carrying that batch of tool results.

긴 컨텍스트: Claude Code는 모든 요청에 대화 전체를 실어 보내고, Claude가 tool을 쓸 때마다 그 tool 결과 묶음을 실은 요청을 한 번 더 보낸다.

- **your full conversation with every request**: 이번 메시지만이 아니라 세션이 열린 뒤 쌓인 대화 전부가 매 요청에 실린다
- **each time Claude uses tools**: 사용자가 메시지 하나를 보내도, Claude가 파일을 읽고 명령을 실행하는 동안 요청이 여러 번 나간다. tool을 한 묶음 실행할 때마다 그 결과를 돌려주는 요청이 하나씩 더해진다
- **that batch of tool results**: 한 번에 실행한 tool들의 결과 묶음이다. 이 결과도 대화 이력에 남아, 이후 모든 요청에 다시 실린다

> With prompt caching, Claude Code re-reads that history at the cached token rate, so a one-line question in a session that has been open all day still draws usage for the whole conversation.

프롬프트 캐싱이 있어서 Claude Code는 그 이력을 캐시 요금으로 다시 읽는다. 그래서 하루 종일 열어 둔 세션에서 한 줄짜리 질문을 해도, 대화 전체에 대한 사용량이 여전히 든다.

- **at the cached token rate**: 캐시에서 읽는 입력의 요금이다. Opus 5.5 기준으로 기본 입력의 0.05배다([프롬프트 캐싱을 켜고 요청을 보내면, 서버는 그 요청을 어떤 순서로 처리하는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐싱을-켜고-요청을-보내면-서버는-그-요청을-어떤-순서로-처리하는가)). 싸지만 0이 아니다
- **a one-line question**: 질문 자체는 짧아도 요청에는 그 앞의 대화 전체가 함께 실린다
- **still draws usage for the whole conversation**: 이력이 길수록 캐시 요금으로 읽는 양도 커진다. 0.05배라도 하루 치 이력에 곱해지면 작지 않다

```
같은 "한 줄 질문"을 보낼 때 요청에 실리는 양

세션 시작 직후   [시스템·프로젝트 컨텍스트][질문]
하루 종일 연 뒤  [시스템·프로젝트 컨텍스트][이력 ……………………………………………][질문]
                                          └ 캐시 요금으로 읽지만, 전부 사용량에 들어감 ┘

질문 1개 → tool을 세 차례에 나눠 실행 → 요청 4번, 매번 위의 전체를 실음
```

### 사용자가 입력하지 않아도 턴이 시작되는 경로: goal 확인

같은 페이지는 세션이 놀고 있는 동안에도 새 턴이 시작되는 경로를 적는다. goal은 Claude Code에 걸어 두는 작업 목표이고, Claude Code는 그 목표가 이뤄졌는지 판정한다.

> Goal check-ins: while background work keeps an active goal waiting, Claude Code asks Claude to check on that work even when the session sits idle, starting a new turn that sends your full context.

goal 확인: 백그라운드 작업 때문에 진행 중인 goal의 판정이 미뤄지면, 세션이 놀고 있어도 Claude Code가 Claude에게 그 작업을 확인하라고 요청하며, 이때 시작되는 새 턴은 컨텍스트 전체를 보낸다.

- **background work keeps an active goal waiting**: 뒤에서 돌아가는 작업이 끝나지 않아, 목표가 이뤄졌는지 아직 판정할 수 없는 상태다
- **even when the session sits idle**: 사용자가 아무것도 입력하지 않은 상태에서도 일어난다는 뜻이다
- **starting a new turn that sends your full context**: 확인 한 번도 평소 턴과 똑같이 대화 전체를 싣는다. 이력이 긴 세션이라면 확인 한 번이 긴 요청 하나다

> Claude Code starts at most three idle check-ins per goal between your prompts.

Claude Code는 사용자 프롬프트와 프롬프트 사이에, goal 하나당 최대 세 번까지만 goal 확인을 시작한다.

- **at most three**: 상한이 있다는 뜻이다. 사용자가 다음 프롬프트를 보내기 전까지 goal 하나에서 생기는 goal 확인은 세 번을 넘지 않는다
- **per goal**: goal마다 따로 센다

> To turn check-ins off, set CLAUDE_CODE_GOAL_CHECKIN_MINUTES to 0.

확인을 끄려면 `CLAUDE_CODE_GOAL_CHECKIN_MINUTES`를 0으로 설정한다.

- **CLAUDE_CODE_GOAL_CHECKIN_MINUTES**: goal 확인을 조절하는 환경 변수다. 0으로 두면 확인 자체가 꺼진다

### 메인 대화 밖에서 요청이 더해지는 경로: 서브에이전트와 워크플로

서브에이전트는 Claude Code가 일을 맡기려고 띄우는 보조 에이전트로, 메인 대화와 따로 자기 컨텍스트를 가진다. 워크플로는 작업을 여러 에이전트에게 나눠 실행하는 기능이다.

> Subagents and workflows: every subagent, and every agent a dynamic workflow spawns, sends its own requests on top of the main conversation's.

서브에이전트와 워크플로: 모든 서브에이전트, 그리고 동적 워크플로가 띄우는 모든 에이전트는 메인 대화의 요청에 더해 자기 요청을 따로 보낸다.

- **every agent a dynamic workflow spawns**: 워크플로가 실행 중에 띄우는 에이전트 하나하나다. 띄운 수만큼 요청을 보내는 주체가 늘어난다
- **on top of the main conversation's**: 메인 대화의 요청을 대신하는 것이 아니라 그 위에 더해진다. 메인 대화 화면에는 결과만 보여도, 뒤에서는 별도 요청들이 오간다

> The attribution breakdown shows the subagent share

attribution 내역은 서브에이전트가 차지한 몫을 보여준다.

- **attribution breakdown**: 사용량이 어디에서 나왔는지를 나눠 보여주는 내역이다. `/usage`에서 본다
- **the subagent share**: 전체 사용량 중 서브에이전트가 쓴 비율이다. 메인 대화가 짧았는데 사용량이 컸다면 여기서 원인이 드러난다

### `/usage`가 원인을 짚어 준다

> On a Pro, Max, Team, or Enterprise plan, the /usage breakdown recommends a change for behaviors behind 10% or more of your recent usage, such as long context or cache misses.

Pro, Max, Team, Enterprise 플랜에서는 `/usage` 내역이, 최근 사용량의 10% 이상을 차지한 행동에 대해 바꿀 점을 추천한다. 긴 컨텍스트나 캐시 미스 같은 것이다.

- **behaviors behind 10% or more**: 사용량의 원인이 된 행동 중 비중이 10% 이상인 것만 짚는다
- **such as long context or cache misses**: 위의 Long context가 실제로 추천 대상에 오르는 항목이라는 뜻이다. cache misses는 캐시 수명이 지난 뒤 보낸 메시지가 캐시를 못 읽는 경우다([캐시 수명보다 오래 쉬었다가 보낸 첫 메시지는 왜 사용량이 크게 나오는가?](../../knowledge/ai/prompt-caching.md#캐시-수명보다-오래-쉬었다가-보낸-첫-메시지는-왜-사용량이-크게-나오는가))

---

## 종합

오래 열어 둔 세션이 활동량보다 사용량을 많이 쓰는 이유는 두 종류로 나뉜다.

- 요청 하나가 크다: 매 요청에 대화 전체가 실리고, tool을 쓸 때마다 요청이 더 나간다. 캐시 덕분에 싼 요금으로 읽지만, 하루 치 이력에 곱해지면 한 줄 질문도 무겁다
- 요청 수가 생각보다 많다: 사용자가 입력하지 않아도 goal 확인이 턴을 시작하고, 서브에이전트·워크플로 에이전트는 메인 대화와 따로 요청을 보낸다

```
세션 사용량
├── 메인 대화의 요청 (요청마다 대화 전체를 실음)
│   ├── 사용자 메시지로 시작한 턴
│   │   └── tool 사용마다 요청 추가
│   └── 사용자 입력 없이 시작된 턴
│       └── goal 확인 (goal당 프롬프트 사이 최대 3회)
└── 메인 대화 밖의 요청
    └── 서브에이전트·워크플로 에이전트 (각자 자기 요청)
```

다른 세션이 보낸 메시지와 agent teams의 팀원도 사용자가 입력하지 않는 동안 사용량을 쓰는 경로인데, 이 둘은 이어지는 두 질문에서 다룬다. 어느 경로가 실제로 컸는지는 `/usage` 내역의 attribution과 추천에서 확인할 수 있다.

---

# 내가 아무것도 입력하지 않았는데 idle 세션이 사용량을 쓰게 되는 경우로, 다른 세션이 보낸 메시지는 어떻게 처리되는가?

## 도입

오래 열어 둔 세션은 매 요청에 대화 전체를 싣기 때문에, 턴이 하나 생길 때마다 그 전체가 사용량에 들어간다. 사용자가 입력하지 않았는데 생긴 턴도 같은 무게로 사용량을 쓴다. 원문은 그런 경우 하나로, 같은 사용자의 다른 Claude Code 세션이 이 세션에 메시지를 보낸 경우를 든다.

- **idle**: 세션이 열려 있지만 사용자 입력 없이 다음 입력을 기다리며 놀고 있는 상태다

---

## 본문

> - **Cross-session messages**: Claude Code delivers a message from another of your sessions as a new turn when this session sits idle, sending your full context each time.

세션 간 메시지: 이 세션이 놀고 있을 때 사용자의 다른 세션에서 온 메시지를 Claude Code가 새 턴으로 전달하며, 그때마다 컨텍스트 전체를 보낸다.

- **another of your sessions**: 남이 아니라 같은 사용자가 띄운 다른 Claude Code 세션이다
- **delivers ... as a new turn**: 다른 세션의 메시지를 그냥 쌓아 두지 않고, 사용자가 메시지를 보낸 것처럼 턴을 하나 새로 시작한다
- **when this session sits idle**: 이 세션이 다른 일을 하고 있지 않을 때다. 사용자가 자리를 비운 사이에도 일어난다
- **sending your full context each time**: 메시지가 올 때마다 이 세션의 대화 전체를 실은 요청이 나간다. 이 세션의 이력이 길수록 메시지 한 통의 비용이 커진다

```
다른 세션 ── 메시지 ──→ 이 세션 (idle)
                          │
                          ▼
                    새 턴 시작
                          │
                          ▼
            [시스템·프로젝트 컨텍스트][이 세션의 대화 전체][받은 메시지]
                          └──────── 메시지 한 통마다 전체를 실음 ────────┘
```

---

## 종합

다른 세션이 보낸 메시지는 이 세션에서 사용자 메시지와 똑같이 새 턴이 되고, 그 턴은 이 세션의 컨텍스트 전체를 싣는다. 그래서 화면 앞에 아무도 없어도, 메시지가 올 때마다 "이 세션의 이력 크기만큼" 사용량이 든다.

메시지가 짧아도 비용이 이 세션의 이력 크기를 따라간다는 점에서, 한 줄 질문이 하루 치 대화 전체의 사용량을 쓰는 것과 같은 구조다. 세션 여러 개가 서로 메시지를 주고받게 해 두었다면, 이력이 긴 세션일수록 받는 쪽 비용이 커진다.

---

# agent teams의 팀원은 언제까지 토큰을 쓰는가?

## 도입

agent teams는 여러 Claude Code 에이전트가 팀으로 묶여 일을 나눠 맡는 기능이다. 팀원(teammate) 하나하나가 자기 컨텍스트를 가지고 따로 요청을 보낸다. 원문은 이 팀원이 언제 토큰 쓰기를 멈추는지를 한 줄로 답한다.

---

## 본문

> - **Agent teammates**: each active teammate keeps consuming tokens until it exits

agent 팀원: 활성 상태인 팀원은 각자 종료할 때까지 계속 토큰을 쓴다.

- **each active teammate**: 팀원마다 따로 센다. 팀원이 셋이면 토큰을 쓰는 주체도 셋이다
- **keeps consuming tokens**: 맡은 일이 끝났는지가 아니라 살아 있는지가 기준이다
- **until it exits**: 팀원이 종료해야 소비가 멈춘다. 사용자가 메인 세션에서 아무것도 하지 않아도, 종료하지 않은 팀원은 계속 토큰을 쓴다

```
시간 →
메인 세션      ●───── 사용자 입력 없음 ─────────────────────
팀원 A        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫ 종료 → 소비 멈춤
팀원 B        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━→ 종료 전까지 계속
```

---

## 종합

팀원이 토큰을 쓰는 기간은 "할 일이 남아 있는 동안"이 아니라 "종료하기 전까지"다. 그래서 팀원을 띄워 둔 세션은 사용자가 아무것도 입력하지 않아도 팀원 수만큼 사용량이 계속 나갈 수 있다. 오래 열어 둔 세션의 사용량이 예상보다 크다면, 종료하지 않은 팀원이 남아 있는지가 확인할 지점이다.

---

# Claude Code의 토큰 비용은 무엇에 따라 커지는가?

## 도입

API 요청에 실린 것은 시스템 프롬프트, 메시지(tool 결과 포함), tool 정의까지 전부 컨텍스트 윈도우를 차지하고([API 요청의 어디까지가 컨텍스트 윈도우에 포함되는가?](../../knowledge/ai/context-window.md#api-요청의-어디까지가-컨텍스트-윈도우에-포함되는가)), 멀티턴 대화에서는 턴마다 이력이 쌓여 요청 하나가 점점 커진다([멀티턴 대화에서 턴이 진행될수록 컨텍스트 윈도우의 토큰은 어떻게 불어나는가?](../../knowledge/ai/context-window.md#멀티턴-대화에서-턴이-진행될수록-컨텍스트-윈도우의-토큰은-어떻게-불어나는가)). 원문은 비용이 무엇을 따라 커지는지를 이 컨텍스트 크기 하나로 답한다.

---

## 본문

> Token costs scale with context size: the more context Claude processes, the more tokens you use.

토큰 비용은 컨텍스트 크기에 비례해 커진다. Claude가 처리하는 컨텍스트가 많을수록 쓰는 토큰도 많아진다.

- **scale with**: 컨텍스트가 커지는 만큼 비용도 커진다는 뜻이다
- **context size**: 요청 하나에 실린 컨텍스트 전체의 크기다
- **the more context Claude processes**: 기준이 "보낸 양"이 아니라 "처리하는 양"이다. 매 요청마다 컨텍스트 전체를 처리하므로, 같은 컨텍스트가 요청 수만큼 반복해서 계산된다

```
턴 진행 →        1턴         5턴              20턴
요청 1회 크기     ■           ■■■■■            ■■■■■■■■■■■■■■■■■■■■
                  └ 이력이 쌓일수록 요청 하나가 처리하는 컨텍스트가 커짐 ┘
비용             작음         ───────────────→ 큼
```

---

## 종합

비용을 키우는 것은 질문의 길이가 아니라 요청이 실어 가는 컨텍스트의 크기다. 대화 이력, tool 결과, 불러온 파일, CLAUDE.md, MCP 서버의 tool 정의가 모두 이 크기에 들어가고, 요청마다 다시 처리된다.

그래서 Claude Code에서 비용을 줄이는 방법들은 거의 모두 "요청에 실리는 컨텍스트를 줄이는 것"으로 모인다. 불필요한 이력을 지우고, 쓰지 않는 tool 정의를 빼고, 장황한 출력을 메인 대화 밖에서 처리하는 것이 그 예다.

---

# 사용자가 따로 손대지 않아도 Claude Code가 기본으로 비용을 줄이는 방법은 무엇인가?

## 도입

토큰 비용은 컨텍스트 크기를 따라 커진다. 그렇다면 비용을 줄이는 방향은 둘이다. 같은 컨텍스트를 다시 처리하는 단가를 깎거나, 컨텍스트 자체를 줄이는 것이다. 원문은 Claude Code가 사용자 설정 없이 이 두 방향을 하나씩 자동으로 쓴다고 말한다.

- **auto-compaction**: 대화가 컨텍스트 윈도우 한도에 가까워지면 Claude Code가 이력을 요약으로 바꿔 줄이는 동작이다. 사용자가 `/compact`를 직접 입력하지 않아도 일어난다

---

## 본문

### 첫째: 프롬프트 캐싱

> Claude Code automatically optimizes costs through prompt caching, which reduces costs for repeated content like system prompts,

Claude Code는 프롬프트 캐싱으로 비용을 자동으로 최적화한다. 프롬프트 캐싱은 시스템 프롬프트처럼 반복되는 내용의 비용을 줄인다.

- **automatically**: 사용자가 켜거나 설정하지 않아도 기본으로 동작한다는 뜻이다
- **repeated content like system prompts**: 매 요청에 똑같이 실리는 앞부분이다. 시스템 프롬프트가 대표적이고, 프로젝트 컨텍스트와 이전 대화 이력도 다음 턴에서는 반복되는 앞부분이 된다

### 둘째: auto-compaction

> and auto-compaction, which summarizes conversation history when approaching context limits.

그리고 auto-compaction으로도 최적화한다. auto-compaction은 컨텍스트 한도에 가까워지면 대화 이력을 요약한다.

- **summarizes conversation history**: 긴 이력을 짧은 요약으로 바꾼다. 이후 요청에 실리는 이력이 줄어든다
- **when approaching context limits**: 일정 주기로 하는 것이 아니라 한도에 가까워졌을 때 한다

```
Claude Code의 기본 비용 절감
├── 프롬프트 캐싱      같은 앞부분을 다시 처리하는 단가를 깎는다   (컨텍스트 크기는 그대로)
└── auto-compaction    이력을 요약해 컨텍스트 자체를 줄인다     (한도에 가까워졌을 때)
```

---

## 종합

두 방법은 비용을 줄이는 방향이 다르다.

- 프롬프트 캐싱: 요청에는 여전히 전체가 실리지만, 직전 요청과 같은 앞부분을 캐시 요금으로 읽는다([프롬프트 캐싱은 Claude Code에서 어떤 문제를 해결하는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐싱은-claude-code에서-어떤-문제를-해결하는가)). 컨텍스트 크기는 줄이지 않고 같은 크기의 단가를 낮춘다
- auto-compaction: 이력을 요약으로 바꿔 요청에 실리는 양 자체를 줄인다. 단가가 아니라 크기를 줄인다

캐싱의 이득은 조건이 맞을 때만 난다. 앞부분이 정확히 같아야 하고 캐시 수명 안에 다음 요청이 와야 하므로([프롬프트 캐싱은 요청의 어느 부분을, 어떤 기준으로 이전 처리 내용과 맞춰 보는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐싱은-요청의-어느-부분을-어떤-기준으로-이전-처리-내용과-맞춰-보는가)), 사용자가 세션 도중 모델을 바꾸거나 오래 쉬었다 돌아오면 그 이득을 잃는다. 기본 절감 위에 사용자가 직접 할 수 있는 방법은 다음 질문에서 다룬다.

---

# Claude Code에서 토큰 비용을 줄이려면 어떻게 해야 하는가?

## 도입

토큰 비용은 요청에 실리는 컨텍스트 크기를 따라 커지고, Claude Code는 기본으로 프롬프트 캐싱과 auto-compaction을 쓴다. 원문은 그 위에 사용자가 직접 할 수 있는 방법을 여섯 묶음으로 나눈다. 각 묶음이 줄이는 것은 조금씩 다르다. 대화 이력, 모델 단가, tool 정의, Claude가 읽어야 하는 양, thinking 출력, 메인 대화에 돌아오는 출력이다.

용어 몇 개가 먼저 필요하다.

- **MCP 서버**: Claude Code에 외부 도구를 붙이는 서버다. 연결하면 그 서버의 도구가 Claude가 쓸 수 있는 tool로 추가되고, 그 tool 정의가 요청에 실린다
- **hook**: Claude Code가 정해진 시점(예: tool 실행 전후)에 자동으로 실행하는, 사용자가 정의한 명령이다
- **스킬(skill)**: 특정 작업에 필요한 지시와 지식을 묶어 두었다가, 필요할 때 Claude가 호출해 쓰는 단위다
- **서브에이전트(subagent)**: Claude Code가 일을 맡기려고 띄우는 보조 에이전트로, 메인 대화와 따로 자기 컨텍스트를 가진다
- **extended thinking**: 모델이 답을 내기 전에 단계적으로 추론하는 과정이다. 이때 생성하는 토큰이 thinking 토큰이다
- **effort 수준**: 모델이 얼마나 깊게 생각하고 답할지 정하는 설정값이다. `/effort`나 `/model`에서 바꾼다

---

## 본문

### 1. 컨텍스트를 미리 관리한다 (Manage context proactively)

#### 작업 사이에 비운다

> - **Clear between tasks**: Use `/clear` to start fresh when switching to unrelated work. Stale context wastes tokens on every subsequent message.

작업 사이에 비우기: 관련 없는 작업으로 넘어갈 때는 `/clear`로 새로 시작하라. 지난 컨텍스트는 이후 모든 메시지에서 토큰을 낭비한다.

- **switching to unrelated work**: 앞 작업의 이력이 다음 작업에 쓸모없을 때다. 앞 작업을 이어서 하는 경우가 아니다
- **Stale context**: 지금 작업과 상관없어진, 묵은 컨텍스트다
- **on every subsequent message**: 한 번 낭비로 끝나지 않는다. 매 요청에 대화 전체가 실리므로, 묵은 이력은 이후 메시지마다 다시 실려 처리된다

> Use /rename before clearing so you can find the session later, then /resume to return to it.

비우기 전에 `/rename`으로 세션 이름을 붙여 두면 나중에 찾을 수 있고, `/resume`으로 그 세션에 돌아갈 수 있다.

- **before clearing**: `/clear`는 현재 대화를 비우고 새로 시작한다. 이름을 붙여 두면 비운 뒤에도 그 대화를 찾아 돌아갈 수 있다
- **/resume**: 예전 세션을 다시 여는 명령이다. 비우는 것이 아까워 묵은 이력을 계속 끌고 다니지 않아도 된다는 뜻이다

#### compact에 무엇을 남길지 지시한다

> - **Add custom compaction instructions**: `/compact Focus on code samples and API usage` tells Claude what to preserve during summarization.

compact 지시를 직접 붙이기: `/compact Focus on code samples and API usage`처럼 쓰면 요약할 때 무엇을 남길지 Claude에게 알려준다.

- **custom compaction instructions**: `/compact` 뒤에 붙이는 지시문이다. 요약은 이력을 줄이는 대신 일부를 버리므로, 무엇을 남길지 정해 주는 것이다
- **what to preserve**: 남길 것을 정하면, 요약 뒤에 그 내용을 다시 읽어 오느라 토큰을 쓰는 일이 줄어든다

> You can also customize compaction behavior in your CLAUDE.md file at the root of your project:

프로젝트 루트의 CLAUDE.md에서도 compact 동작을 바꿀 수 있다.

- **in your CLAUDE.md file**: 매번 `/compact` 뒤에 지시를 적지 않고, CLAUDE.md에 한 번 적어 두는 방식이다

```markdown
# Compact instructions

When you are using compact, please focus on test output and code changes
```

#### 사용량을 확인한다

> Use /usage to check your current token usage, or configure your status line to display it continuously.

`/usage`로 현재 토큰 사용량을 확인하거나, status line을 설정해 계속 띄워 두라.

- **status line**: Claude Code 화면 아래에 상태 정보를 띄우는 줄이다. 사용량을 여기 두면 명령을 입력하지 않아도 계속 보인다

### 2. 맞는 모델을 고른다 (Choose the right model)

> Sonnet handles most coding tasks well and costs less than Opus. Reserve Opus for complex architectural decisions or multi-step reasoning.

Sonnet은 대부분의 코딩 작업을 잘 처리하고 Opus보다 싸다. Opus는 복잡한 아키텍처 결정이나 여러 단계에 걸친 추론에 남겨 두라.

- **costs less than Opus**: 같은 토큰 수라도 단가가 낮다. 요금표 기준 Sonnet 5.5의 기본 입력은 Opus 5.5의 절반이다([프롬프트 캐싱을 켜고 요청을 보내면, 서버는 그 요청을 어떤 순서로 처리하는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐싱을-켜고-요청을-보내면-서버는-그-요청을-어떤-순서로-처리하는가))
- **Reserve**: 기본은 Sonnet으로 두고, Opus는 필요한 일에만 꺼내 쓰라는 뜻이다

모델은 세션 도중에 바꾸면 캐시를 잃고 다음 요청이 이력 전체를 다시 처리한다([세션 도중 모델이나 effort 수준을 바꾸면 프롬프트 캐시는 어떻게 되는가?](../../knowledge/ai/prompt-caching.md#세션-도중-모델이나-effort-수준을-바꾸면-프롬프트-캐시는-어떻게-되는가)). 그래서 모델 선택도 세션을 시작할 때 하는 편이 싸다.

### 3. MCP 서버의 부담을 줄인다 (Reduce MCP server overhead)

> - **Prefer CLI tools when available**: Tools like `gh`, `aws`, `gcloud`, and `sentry-cli` are still more context-efficient than MCP servers because they don't add any per-tool listing.

가능하면 CLI 도구를 우선하라: `gh`, `aws`, `gcloud`, `sentry-cli` 같은 도구는 tool별 목록을 전혀 더하지 않으므로 여전히 MCP 서버보다 컨텍스트를 효율적으로 쓴다.

- **CLI tools**: 터미널에서 실행하는 명령줄 도구다. Claude는 이미 가진 셸 실행 tool로 이 명령을 호출하므로, 새 tool 정의가 생기지 않는다
- **per-tool listing**: MCP 서버가 제공하는 tool마다 이름·설명·인자 형식을 요청에 싣는 목록이다. tool 정의는 실제로 호출하지 않아도 컨텍스트 윈도우를 차지한다

> Run /context to see what's consuming space.

`/context`를 실행하면 무엇이 공간을 차지하고 있는지 볼 수 있다.

- **consuming space**: 컨텍스트 윈도우를 차지하는 것이다. MCP tool 정의가 얼마나 큰지 확인하고 나서 줄일지 정할 수 있다

### 4. 처리를 hook과 스킬에 맡긴다 (Offload processing to hooks and skills)

#### hook: Claude가 보기 전에 줄인다

> Custom hooks can preprocess data before Claude sees it.

직접 만든 hook은 Claude가 데이터를 보기 전에 미리 처리할 수 있다.

- **preprocess**: 원본을 그대로 넘기지 않고 필요한 부분만 남겨 넘긴다
- **before Claude sees it**: 컨텍스트에 들어가기 전이다. 들어간 뒤에 줄이는 것이 아니라 처음부터 적게 들어가게 한다

> Instead of Claude reading a 10,000-line log file to find errors, a hook can grep for ERROR and return only matching lines, reducing context from tens of thousands of tokens to hundreds.

Claude가 에러를 찾으려고 1만 줄짜리 로그 파일을 읽는 대신, hook이 ERROR를 grep해서 일치하는 줄만 돌려주면 컨텍스트가 수만 토큰에서 수백 토큰으로 줄어든다.

- **grep for ERROR**: 파일에서 ERROR가 든 줄만 골라내는 셸 명령이다. 걸러 내는 일을 모델이 아니라 명령이 한다
- **from tens of thousands of tokens to hundreds**: 줄어든 양은 이번 요청에서 끝나지 않는다. 컨텍스트에 들어간 것은 이후 요청마다 이력으로 다시 실리므로, 처음에 적게 넣은 만큼 이후 턴도 가벼워진다

#### 스킬: 탐색 대신 지식을 준다

> A skill can give Claude domain knowledge so it doesn't have to explore.

스킬은 Claude에게 도메인 지식을 줘서 탐색하지 않아도 되게 할 수 있다.

- **domain knowledge**: 이 프로젝트·업무에 대한 지식이다
- **doesn't have to explore**: 탐색은 파일을 여러 개 열어 읽는 일이고, 읽은 내용은 모두 컨텍스트에 들어간다

> For example, a "codebase-overview" skill could describe your project's architecture, key directories, and naming conventions.

예를 들어 "codebase-overview" 스킬이 프로젝트의 아키텍처, 주요 디렉터리, 이름 규칙을 설명해 둘 수 있다.

> When Claude invokes the skill, it gets this context immediately instead of spending tokens reading multiple files to understand the structure.

Claude가 그 스킬을 호출하면, 구조를 파악하려고 여러 파일을 읽느라 토큰을 쓰는 대신 이 컨텍스트를 바로 얻는다.

- **immediately**: 탐색 단계를 건너뛴다는 뜻이다
- **instead of spending tokens reading multiple files**: 같은 지식을 얻는 데 드는 토큰을 비교한 말이다. 파일 여러 개를 읽는 것보다 정리된 설명 하나가 짧다

### 5. extended thinking을 조절한다 (Adjust extended thinking)

> Thinking tokens are billed as output tokens, and the default budget can be tens of thousands of tokens per request depending on the model.

thinking 토큰은 출력 토큰으로 과금되고, 기본 예산은 모델에 따라 요청 하나에 수만 토큰이 될 수 있다.

- **billed as output tokens**: 출력 토큰은 입력보다 단가가 높다(Opus 5.5 기준 입력의 5배). thinking 토큰도 그 값을 낸다([thinking을 켜면 thinking 토큰은 max_tokens·과금에서 어떻게 취급되는가?](../../knowledge/ai/context-window.md#thinking을-켜면-thinking-토큰은-max_tokens과금에서-어떻게-취급되는가))
- **default budget**: thinking에 쓸 수 있는 토큰 상한의 기본값이다
- **per request**: 요청 하나마다 적용된다. tool을 쓰며 한 턴에 요청이 여러 번 나가면 요청마다 thinking 토큰이 다시 나올 수 있다

> Extended thinking is enabled by default because it significantly improves performance on complex planning and reasoning tasks.

extended thinking이 기본으로 켜져 있는 것은, 복잡한 계획·추론 작업에서 성능을 크게 높이기 때문이다.

- **enabled by default**: 비용이 드는데도 기본으로 켜 둔 이유는 성능이다. 끄거나 줄이면 그만큼 성능을 내준다

> For simpler tasks where deep reasoning isn't needed, you can reduce costs by lowering the effort level with `/effort` or in `/model`, or by disabling thinking in `/config`.

깊은 추론이 필요 없는 단순한 작업에서는 `/effort`나 `/model`에서 effort 수준을 낮추거나, `/config`에서 thinking을 꺼서 비용을 줄일 수 있다.

- **simpler tasks**: 줄여도 되는 조건이다. 깊은 추론이 필요 없는 작업에 한한다
- **lowering the effort level**: 모델이 생각을 얼마나 깊게 할지 정하는 수준을 낮춘다. thinking에 쓰는 양이 줄어든다
- **disabling thinking**: thinking 자체를 끈다. 다만 아래 문장대로 끌 수 없는 모델이 있다

> You can't turn off thinking on Opus 5.5, Sonnet 5.5, Haiku 5.5, or the Fable models, which always use extended thinking.

Opus 5.5, Sonnet 5.5, Haiku 5.5, 그리고 Fable 모델에서는 thinking을 끌 수 없다. 이 모델들은 항상 extended thinking을 쓴다.

- **the Fable models**: Claude 모델 계열 중 하나다
- **always use extended thinking**: 위 문장의 "disabling thinking in `/config`"가 이 모델들에는 해당하지 않는다는 뜻이다

> Adaptive-reasoning models ignore nonzero budgets, so use effort levels there instead.

adaptive reasoning 모델은 0이 아닌 예산 값을 무시하므로, 그런 모델에서는 대신 effort 수준을 쓰라.

- **Adaptive-reasoning models**: thinking에 얼마를 쓸지 모델이 요청에 맞춰 스스로 정하는 모델이다
- **ignore nonzero budgets**: thinking 토큰 상한을 숫자로 정해도 반영되지 않는다
- **use effort levels there instead**: 그래서 이 모델들에서 thinking 비용을 줄이는 실질적인 수단은 effort를 낮추는 것이다

effort도 대부분의 모델에서 세션 도중에 바꾸면 캐시를 잃는다([세션 도중 모델이나 effort 수준을 바꾸면 프롬프트 캐시는 어떻게 되는가?](../../knowledge/ai/prompt-caching.md#세션-도중-모델이나-effort-수준을-바꾸면-프롬프트-캐시는-어떻게-되는가)). 낮출 생각이면 세션 처음에 정해 두는 편이 낫다.

### 6. 장황한 작업은 서브에이전트에 맡긴다 (Delegate verbose operations to subagents)

> Running tests, fetching documentation, or processing log files can consume significant context. Delegate these to subagents so the verbose output stays in the subagent's context while only a summary returns to your main conversation.

테스트 실행, 문서 가져오기, 로그 파일 처리는 컨텍스트를 많이 차지할 수 있다. 이런 일은 서브에이전트에 맡겨, 장황한 출력은 서브에이전트의 컨텍스트에 남기고 메인 대화에는 요약만 돌아오게 하라.

- **verbose output**: 테스트 로그, 문서 전문처럼 길지만 결론은 짧은 출력이다
- **stays in the subagent's context**: 긴 출력은 서브에이전트 쪽 컨텍스트에만 들어가고, 메인 대화의 이력에는 쌓이지 않는다
- **only a summary returns**: 메인 대화에는 결론만 들어간다. 메인 대화의 이후 요청마다 실리는 양이 작게 유지된다

> To spend less on them, choose a smaller model for a subagent or run every subagent on one model.

서브에이전트에 드는 비용을 줄이려면, 서브에이전트에 더 작은 모델을 고르거나 모든 서브에이전트를 한 모델로 돌려라.

- **a smaller model**: 서브에이전트가 하는 일이 테스트 실행·로그 요약처럼 단순하면 단가가 낮은 모델로도 된다
- **run every subagent on one model**: 서브에이전트마다 다른 모델을 쓰지 않고 하나로 맞추는 것이다

> The subagent's own requests still draw on your usage.

서브에이전트가 보내는 요청도 여전히 사용량에서 나간다.

- **still**: 서브에이전트에 맡기면 메인 컨텍스트는 아끼고, 서브에이전트가 처리한 몫은 그대로 사용량에 남는다
- **own requests**: 서브에이전트는 메인 대화와 따로 자기 요청을 보낸다. 긴 출력을 처리하는 비용은 사라지지 않고 서브에이전트 쪽에서 낸다

```
                       메인 대화에서 직접 처리          서브에이전트에 맡김
메인 대화 이력          긴 출력이 쌓임                   요약만 쌓임
메인의 이후 요청        긴 출력을 매번 다시 실음          요약만 다시 실음
긴 출력을 처리하는 비용  메인 대화가 냄                   서브에이전트가 냄 (여전히 사용량)
총사용량               ─                              줄어들 수 있지만 0이 되지 않음
```

---

## 종합

여섯 묶음은 각각 요청에 실리는 컨텍스트의 크기, 토큰 단가, 출력량 가운데 하나를 줄인다.

```
토큰 비용을 줄이는 방법
├── 크기를 줄인다
│   ├── 1. 컨텍스트 관리     /clear로 묵은 이력 제거, /compact 지시로 필요한 것만 남김
│   ├── 3. MCP 부담 줄이기   CLI 도구로 tool 정의 목록을 안 더함
│   ├── 4. hook·스킬         hook은 걸러서 넣고, 스킬은 탐색을 건너뜀
│   └── 6. 서브에이전트      장황한 출력을 메인 대화 밖에 둠
├── 단가를 줄인다
│   └── 2. 모델 선택         대부분 Sonnet, 필요할 때만 Opus
└── 출력을 줄인다
    └── 5. thinking 조절    effort를 낮춤 (끌 수 없는 모델이 많음)
```

크기를 줄이는 방법이 많은 이유는, 컨텍스트에 한 번 들어간 것은 이후 요청마다 다시 실리기 때문이다. 처음에 덜 넣는 것이 그 뒤 모든 턴을 가볍게 한다.

주의할 점이 두 가지 있다.

- 모델과 effort는 세션 도중에 바꾸면 캐시를 잃으므로, 세션을 시작할 때 정하는 편이 낫다
- 서브에이전트는 메인 컨텍스트를 아끼는 방법이다. 서브에이전트 자신의 요청은 사용량에 그대로 들어가므로, 사용량까지 아끼려면 서브에이전트의 모델도 함께 골라야 한다

어느 방법이 실제로 효과가 있는지는 `/usage`와 `/context`로 확인한다.

---

# CLAUDE.md에 특정 워크플로용 상세 지시를 넣어두면 왜 토큰이 낭비되는가?

## 도입

Claude Code는 요청을 시스템 프롬프트 → 프로젝트 컨텍스트 → 대화 세 층으로 쌓고, CLAUDE.md는 그중 프로젝트 컨텍스트 층에 들어간다([Claude Code는 prefix 매칭의 이득을 키우려고 요청 안의 내용을 어떤 원칙으로 배치하는가?](../../knowledge/ai/prompt-caching.md#claude-code는-prefix-매칭의-이득을-키우려고-요청-안의-내용을-어떤-원칙으로-배치하는가)). 이 층은 세션이 시작될 때 실리고, 이후 모든 요청에 함께 간다. 원문은 이 성질 때문에 CLAUDE.md에 무엇을 넣느냐가 비용 문제가 된다고 말한다.

---

## 본문

### CLAUDE.md는 세션 시작 때 실린다

> Your CLAUDE.md file is loaded into context at session start.

CLAUDE.md 파일은 세션이 시작될 때 컨텍스트에 실린다.

- **loaded into context**: Claude가 필요하다고 판단해 읽는 것이 아니라, 무조건 컨텍스트에 들어간다
- **at session start**: 작업 내용이 정해지기 전에 실린다. 그래서 이 세션에서 무슨 일을 할지와 상관없이 들어간다

### 상관없는 작업 중에도 그 토큰이 있다

> If it contains detailed instructions for specific workflows (like PR reviews or database migrations), those tokens are present even when you're doing unrelated work.

CLAUDE.md에 특정 워크플로(PR 리뷰나 데이터베이스 마이그레이션 같은)용 상세 지시가 들어 있으면, 상관없는 작업을 하는 중에도 그 토큰은 들어 있다.

- **specific workflows**: 가끔 하는 특정 작업이다. PR 리뷰 절차나 마이그레이션 순서처럼, 그 작업을 할 때만 필요한 지시다
- **detailed instructions**: 짧은 원칙이 아니라 단계별 절차처럼 긴 지시다. 길수록 낭비도 크다
- **present even when you're doing unrelated work**: 버그 하나를 고치는 세션에서도 PR 리뷰 절차가 컨텍스트에 실려 있다. 프로젝트 컨텍스트 층이니 매 요청마다 함께 간다

캐시에서 읽은 토큰도 컨텍스트 윈도우를 그대로 차지하고([프롬프트 캐싱으로 캐시에서 읽은 입력 토큰도 컨텍스트 윈도우를 차지하는가?](../../knowledge/ai/context-window.md#프롬프트-캐싱으로-캐시에서-읽은-입력-토큰도-컨텍스트-윈도우를-차지하는가)) 캐시 요금도 든다. 캐시가 만료된 뒤에는 캐시 쓰기 요금(기본 입력의 1.25배)으로 다시 처리한다.

```
버그 수정 세션의 요청 1회
┌─────────────────────────────────────────────┐
│ 시스템 프롬프트                                │
├─────────────────────────────────────────────┤
│ CLAUDE.md                                    │
│   ├── 코드 스타일 (이번 작업에 필요)             │
│   ├── PR 리뷰 절차 (이번 작업과 무관) ← 낭비     │
│   └── 마이그레이션 순서 (이번 작업과 무관) ← 낭비 │
├─────────────────────────────────────────────┤
│ 대화                                          │
└─────────────────────────────────────────────┘
매 요청마다 위 전체가 실림
```

---

## 종합

CLAUDE.md는 세션 시작 때 무조건 실리고 이후 모든 요청에 함께 가는 기본 컨텍스트다. 그래서 여기에 특정 작업용 상세 지시를 넣으면, 그 작업을 하지 않는 세션에서도 매 요청이 그 토큰을 싣고 다닌다. 낭비의 크기는 "지시의 길이 × 요청 수"로 커진다.

판단 기준은 그 지시가 이 프로젝트의 거의 모든 작업에 필요한가다. 거의 모든 작업에 필요하면 CLAUDE.md에 두고, 특정 작업에서만 필요하면 그 작업을 할 때만 실리는 곳으로 옮긴다. 그 옮길 곳이 다음 질문의 스킬이다.

---

# 그 지시를 스킬로 옮기면 왜 기본 컨텍스트가 줄어드는가?

## 도입

CLAUDE.md에 넣은 것은 세션 시작 때 무조건 실려, 상관없는 작업 중에도 매 요청에 함께 간다. 특정 작업용 지시를 그 작업을 할 때만 실리게 하려면, 실리는 시점이 다른 곳으로 옮겨야 한다. 원문은 그곳이 스킬이라고 답한다.

- **스킬(skill)**: 특정 작업에 필요한 지시와 지식을 묶어 두었다가, 필요할 때 Claude가 호출해 쓰는 단위다
- **기본 컨텍스트(base context)**: 사용자가 아무것도 하지 않아도 세션 시작 때부터 모든 요청에 실리는 컨텍스트다. 시스템 프롬프트와, CLAUDE.md가 든 프로젝트 컨텍스트 층이 여기에 해당한다

---

## 본문

### 스킬은 호출될 때만 실린다

> Skills load on-demand only when invoked, so moving specialized instructions into skills keeps your base context smaller.

스킬은 호출될 때만 필요에 따라 실리므로, 특정 작업용 지시를 스킬로 옮기면 기본 컨텍스트가 작게 유지된다.

- **load on-demand**: 미리 실어 두지 않고 필요할 때 싣는다. CLAUDE.md의 "at session start"와 반대다
- **only when invoked**: 스킬을 실제로 호출할 때만이다. PR 리뷰 스킬은 PR 리뷰를 할 때만 컨텍스트에 들어간다
- **specialized instructions**: 앞 질문의 "detailed instructions for specific workflows"와 같은 것이다. 특정 작업에서만 필요한 지시다
- **keeps your base context smaller**: 모든 요청에 실리는 몫이 줄어든다. 호출하지 않는 세션에서는 그 지시가 아예 실리지 않는다

스킬을 호출할 때도 캐시에는 손해가 없다. 스킬의 지시문은 앞쪽 층에 끼워지지 않고 대화 끝에 메시지로 덧붙으므로, 이미 캐시된 앞부분이 그대로 유지된다([프롬프트 캐싱은 요청의 어느 부분을, 어떤 기준으로 이전 처리 내용과 맞춰 보는가?](../../knowledge/ai/prompt-caching.md#프롬프트-캐싱은-요청의-어느-부분을-어떤-기준으로-이전-처리-내용과-맞춰-보는가)).

### CLAUDE.md는 200줄 아래로

> Aim to keep CLAUDE.md under 200 lines by including only essentials.

꼭 필요한 것만 넣어 CLAUDE.md를 200줄 아래로 유지하는 것을 목표로 하라.

- **Aim to**: 반드시 지켜야 하는 한도가 아니라 목표치다
- **only essentials**: 거의 모든 작업에 필요한 것이다. 특정 작업에만 필요한 것은 스킬로 보낸다

```
                     CLAUDE.md에 둔 지시                 스킬로 옮긴 지시
실리는 때             세션 시작 때 무조건                  호출될 때만
상관없는 작업 중       매 요청에 실림                       실리지 않음
들어가는 위치          프로젝트 컨텍스트 층 (앞쪽)          대화 끝에 메시지로 덧붙음
기본 컨텍스트          커짐                                늘지 않음
어울리는 내용          거의 모든 작업에 필요한 것            특정 작업에서만 필요한 것
```

---

## 종합

CLAUDE.md와 스킬은 지시를 담는 곳이라는 점은 같고, 실리는 시점이 다르다. CLAUDE.md는 세션 시작 때 무조건 실려 모든 요청에 함께 가고, 스킬은 호출할 때만 실린다. 그래서 특정 작업용 지시를 스킬로 옮기면 그 작업을 하지 않는 세션의 모든 요청에서 그만큼이 빠지고, 기본 컨텍스트가 작아진다.

CLAUDE.md에 거의 모든 작업에 필요한 것만 남기고 나머지를 스킬로 보내면, 원문이 목표로 든 200줄 아래로 자연히 짧아진다. 비용을 키우는 것이 요청마다 실리는 컨텍스트 크기라는 점에서, 기본 컨텍스트를 줄이는 것은 세션 내내 모든 요청을 가볍게 하는 일이다.

---

# Claude Code의 `/usage`는 플랜 사용량에 대해 무엇을 보여주는가?

## 도입

`/usage`는 사용량을 확인하는 명령이다. 구독 플랜에서는 사용량이 얼마인지에 더해, 그 사용량이 어디에서 나왔는지와 무엇을 바꾸면 좋은지까지 나눠 보여준다. 앞 질문들에서 다룬 긴 컨텍스트·서브에이전트·예약 작업 같은 경로 중 내 세션에서 무엇이 실제로 컸는지를 여기서 확인한다.

- **plan limits**: 구독 플랜에 걸린 사용 한도다. 사용량은 이 한도에서 깎이는 양으로 센다
- **row**: `/usage` 화면의 한 줄이다. 추천 하나, 예약 작업 하나가 각각 한 행이다

---

## 본문

### 무엇이 한도를 깎았는지 나눠 보여준다

> On a Pro, Max, Team, or Enterprise plan, /usage also shows a breakdown of what counts against your plan limits, with recommendations:

구독 플랜에서는 `/usage`가 플랜 한도에서 무엇이 사용량을 깎았는지 나눈 내역을 보여주고, 추천도 함께 낸다.

- **breakdown**: 전체를 항목별로 쪼갠 내역이다. 합계 하나만 보여주면 줄일 곳을 알 수 없으니 원인별로 나눈다
- **counts against**: 한도에서 차감되는 쪽으로 계산된다는 뜻이다

내역의 한 종류는 사용량을 누구 몫으로 돌릴지 나눈 것이다.

> Attribution: recent usage attributed to skills, subagents, plugins, and individual MCP servers, each shown as a percentage of the total.

Attribution: 최근 사용량을 스킬·서브에이전트·플러그인·개별 MCP 서버별로 나눠, 각각 전체의 몇 %인지 보여준다.

- **attributed to**: 이 사용량이 어느 주체 때문에 생겼는지 몫을 매긴다는 뜻이다. 서브에이전트를 많이 띄운 세션이라면 그 몫이 여기서 드러난다
- **individual MCP servers**: MCP 서버를 묶어서가 아니라 서버 하나하나 따로 잡는다. 어느 서버가 무거운지 가려낼 수 있다

### 바꿀 점을 한 행에 하나씩 추천한다

> Recommendations: suggested changes, one per row.

Recommendations: 바꾸면 좋을 점을 한 행에 하나씩 보여준다.

> Each row starts with a share of your recent usage, at least 10%, as in 25% Trim ~/code/api/CLAUDE.md · 49k tokens per request.

각 행은 최근 사용량 중 그 행이 차지하는 몫으로 시작하고, 그 몫은 최소 10%다. 예를 들어 `25% Trim ~/code/api/CLAUDE.md · 49k tokens per request`처럼 나온다.

- **at least 10%**: 몫이 10% 미만인 행동은 추천 행으로 나오지 않는다. 사소한 것까지 늘어놓지 않고 큰 원인만 짚는다
- **Trim ~/code/api/CLAUDE.md · 49k tokens per request**: 그 CLAUDE.md가 요청마다 49k 토큰을 싣고 있으니 줄이라는 추천이다. CLAUDE.md가 매 요청에 실리는 이유는 [CLAUDE.md에 특정 워크플로용 상세 지시를 넣어두면 왜 토큰이 낭비되는가?](../../knowledge/ai/claude-code-token-usage.md#claudemd에-특정-워크플로용-상세-지시를-넣어두면-왜-토큰이-낭비되는가)에서 다룬다

### 행 앞의 %는 아낄 양이 아니다

흔히 혼동하는 지점이다. `25%`라는 숫자를 보고 그 추천을 따르면 사용량이 25% 준다고 읽기 쉽다.

> How to read the share: it tells you how much of your usage the row applies to, not how much the change saves.

몫 읽는 법: 그 %는 이 행이 사용량의 얼마에 걸쳐 있는지를 말할 뿐, 바꾸면 얼마를 아끼는지가 아니다.

- **applies to**: 그 원인이 관여한 사용량의 범위다. 위 예시라면 최근 사용량의 25%가 그 CLAUDE.md를 실은 요청이었다는 뜻이다
- **not how much the change saves**: CLAUDE.md를 절반으로 줄여도 그 25% 전부가 사라지지는 않는다. 그 요청들에는 CLAUDE.md 말고 대화 이력도 실려 있다

> One request can count toward several rows, so the shares can add up to more than 100%.

한 요청이 여러 행에 동시에 잡힐 수 있어서, 몫을 다 더하면 100%를 넘을 수 있다.

- **count toward several rows**: 긴 대화에서 큰 CLAUDE.md를 실은 요청 하나는 "긴 컨텍스트" 행에도, "CLAUDE.md 줄이기" 행에도 들어간다
- **more than 100%**: 행들이 사용량을 나눠 가진 파이 조각이 아니라, 서로 겹칠 수 있는 범위라서 생기는 일이다

```
최근 요청 100개
├── 긴 대화 이력을 실은 요청 60개 ─────→ "긴 컨텍스트" 행 60%
└── 큰 CLAUDE.md를 실은 요청 25개 ────→ "CLAUDE.md 줄이기" 행 25%
     (이 25개 중 상당수는 위 60개와 같은 요청)

행의 %를 더한 값은 요청 수의 합이 아니다 → 100%를 넘을 수 있음
```

---

## 종합

`/usage`의 내역은 사용량 합계를 원인별로 나눠 두 가지를 보여준다.

- 누구 몫인가: Attribution이 스킬·서브에이전트·플러그인·MCP 서버별 비율을 보여준다
- 무엇을 바꿀까: Recommendations가 최근 사용량의 10% 이상에 걸친 원인마다 바꿀 점을 한 행씩 낸다

추천 행의 %는 그 원인이 걸쳐 있는 범위이지 절감액이 아니고, 한 요청이 여러 행에 겹쳐 잡히므로 합이 100%를 넘을 수 있다. 그래서 %가 큰 행부터 손대되, 그만큼 줄어들 거라고 기대하지 않고 바꾼 뒤 다시 `/usage`로 확인한다.

---

# `/loop`나 세션 범위 예약 작업이 사용량을 얼마나 썼는지는 `/usage`에서 어떻게 확인하는가?

## 도입

`/loop`는 프롬프트를 일정 간격으로 되풀이해 실행하는 명령이다. 이렇게 세션 안에 걸어 둔 예약 작업은 세션이 놀고 있어도 주기마다 발동하고, 발동할 때마다 다른 턴처럼 대화 전체를 싣는다. 걸어 두고 잊으면 사용자가 아무것도 하지 않는 동안 사용량이 쌓인다.

- **session-scoped**: 그 세션 안에서만 사는 작업이다. 세션을 닫으면 함께 사라진다

---

## 본문

### 무거운 예약 작업을 한 행씩 보여준다

> - **Loops**: a row for each of the heaviest /loop or other session-scoped scheduled tasks that ran recently, ordered by total tokens, with a count of the rest.

Loops: 최근 돈 `/loop`나 세션 범위 예약 작업 중 가장 무거운 것들을 하나씩 행으로 보여주고, 총 토큰 순으로 정렬하며, 나머지는 개수만 센다.

- **heaviest**: 토큰을 가장 많이 쓴 작업이다. 무게는 토큰량으로 잰다
- **ordered by total tokens**: 맨 위 행이 가장 많이 쓴 작업이다. 위에서부터 보면 된다
- **with a count of the rest**: 상위 몇 개만 행으로 펼치고 나머지는 "외 N개"처럼 개수로 묶는다

### 행마다 나오는 것

> - **What each row reports**: how often the task fires, how many times it ran, its total and per-run tokens, and when it last ran

각 행이 보여주는 것: 작업이 얼마나 자주 발동하는지, 몇 번 돌았는지, 총 토큰과 1회당 토큰, 마지막으로 돈 시각.

- **how often the task fires**: 발동 주기다. 짧을수록 같은 시간에 더 많이 돈다
- **its total and per-run tokens**: 총량과 1회당 양을 함께 보여준다. 총량이 큰 이유가 자주 돌아서인지 한 번이 무거워서인지를 이 둘로 가른다
- **when it last ran**: 마지막 실행 시각이다. 최근에도 돌았으면 아직 살아 있는 작업이다

```
총 토큰이 큰 행을 만났을 때

1회당 토큰은 작고 실행 횟수가 많다 → 주기를 늘리거나, 필요 없어졌으면 멈춘다
1회당 토큰이 크다                  → 세션 대화가 길어서다. 새 세션에서 루프를 걸면 1회당 양이 준다
마지막 실행이 최근이다              → 지금도 돌고 있다. 잊고 둔 루프인지 확인한다
```

---

## 종합

예약 작업은 사용자가 입력하지 않는 동안에도 턴을 시작하므로, 사용량이 어디서 새는지 찾을 때 따로 봐야 하는 경로다.

`/usage`의 Loops 행이 무거운 순으로 작업을 보여주고, 행마다 주기·횟수·총량·1회당 양·마지막 실행 시각을 알려 준다. 총량만 보지 않고 1회당 양과 횟수를 나눠 보면, 주기를 늘릴지 세션을 비울지 작업을 멈출지가 갈린다.
