# LLM의 컨텍스트 윈도우(context window)란 무엇인가?

## 도입

LLM은 텍스트를 토큰 단위로 받아 토큰 단위로 응답을 만든다. 그렇다면 응답을 만들 때 모델은 어디까지를 "보고" 있을까? 원문은 이 범위를 컨텍스트 윈도우라고 부르고, 무엇이 그 안에 들어가는지와 학습 데이터와는 무엇이 다른지를 말한다.

---

## 본문

### 정의: 응답을 만들 때 참조할 수 있는 텍스트 전부

> The "context window" refers to all the text a language model can reference when generating a response, including the response itself.

컨텍스트 윈도우는 언어 모델이 응답을 만들 때 참조할 수 있는 모든 텍스트를 가리키며, 지금 만들고 있는 응답 자체도 여기에 포함된다.

- **all the text**: 사용자가 마지막에 보낸 한 줄만이 아니라, 요청에 실린 텍스트 전부다. 범위가 "전부"라는 점이 핵심이다
- **can reference**: 모델이 응답을 만들 때 들여다볼 수 있다는 뜻이다. 윈도우 밖에 있는 내용은 모델 입장에서 존재하지 않는 것과 같다
- **including the response itself**: 흔히 놓치는 부분이다. 모델은 토큰을 하나씩 만들어 가는데, 앞에서 만든 응답 토큰도 다음 토큰을 만들 때 참조된다. 그래서 응답이 길어지면 그만큼 윈도우를 차지한다. 입력만 한도 안에 들어간다고 끝이 아니라, 입력 + 출력이 함께 한도 안에 들어가야 한다

### 학습 데이터와의 차이: 작업 기억

> This is different from the large corpus of data the language model was trained on, and instead represents a "working memory" for the model.

이것은 모델이 학습한 거대한 데이터 묶음과는 다르며, 모델의 "작업 기억"에 해당한다.

- **the large corpus of data the language model was trained on**: 모델이 만들어질 때 학습한 대량의 텍스트(corpus = 텍스트 모음)다. 이 내용은 모델 안에 이미 녹아 있고, 요청할 때마다 보내는 것이 아니다
- **instead**: 두 가지를 대비시키는 말이다. 학습 데이터가 "이미 배운 것"이라면, 컨텍스트 윈도우는 "지금 이 요청에서 주어진 것"이다
- **"working memory"**: 따옴표가 붙은 비유다. 브라우저 탭이 열려 있는 동안만 들고 있는 JS 변수처럼, 지금 처리 중인 일에 필요한 내용을 잠깐 붙잡아 두는 공간이라는 뜻이다. 탭을 닫으면 변수가 사라지듯, 이 요청이 끝나면 그 내용은 모델에 남지 않는다

```
모델이 응답을 만들 때 쓰는 것
├── 학습 데이터 (corpus)   모델이 만들어질 때 배운 것 — 요청마다 보내지 않음
└── 컨텍스트 윈도우        이 요청에서 참조하는 텍스트 전부 — 작업 기억
    ├── 요청에 실린 입력
    └── 지금 생성 중인 응답
```

---

## 종합

컨텍스트 윈도우는 모델이 응답 하나를 만드는 동안 참조할 수 있는 텍스트 전체이고, 그 범위에는 입력뿐 아니라 생성 중인 응답도 들어간다. 학습 데이터가 모델이 이미 가진 지식이라면, 컨텍스트 윈도우는 요청마다 새로 채워지는 작업 기억이다. 그래서 모델에게 "앞에서 한 말"을 기억시키려면 그 말이 윈도우 안에 다시 들어 있어야 한다. 윈도우의 크기가 토큰 수로 정해져 있다는 점이, 이어지는 질문들(얼마나 채워야 하는가, 대화가 길어지면 어떻게 되는가)의 출발점이 된다.

---

# 컨텍스트 윈도우는 클수록, 많이 채울수록 좋은가?

## 도입

컨텍스트 윈도우가 작업 기억이라면, 크면 클수록 더 많은 것을 한 번에 다룰 수 있다. 원문은 이 장점을 인정하면서도 "많이 넣는 것"과 "잘 넣는 것"을 구분한다.

---

## 본문

### 큰 윈도우의 장점

> A larger context window allows the model to handle more complex and lengthy prompts,

컨텍스트 윈도우가 크면 모델이 더 복잡하고 긴 프롬프트를 다룰 수 있다.

- **allows**: "가능하게 한다". 큰 윈도우는 긴 입력을 넣을 수 있는 조건을 만들 뿐, 결과가 좋아진다고 보장하지는 않는다. 바로 뒤 조각의 "but"이 이 차이를 짚는다
- **complex and lengthy prompts**: 긴 문서 여러 개, 긴 대화 이력처럼 작은 윈도우에는 들어가지 않는 입력이다

### 많이 넣는다고 좋아지지는 않는다: context rot

> but more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as context rot.

하지만 컨텍스트가 많다고 자동으로 더 좋아지는 것은 아니다. 토큰 수가 늘어날수록 정확도와 기억해 내는 능력이 떨어지는데, 이 현상을 context rot이라고 부른다.

- **automatically**: "넣기만 하면 저절로"라는 기대를 부정하는 말이다. 더 넣는 것이 도움이 될 수도 있지만, 그것은 무엇을 넣었느냐에 달렸다
- **accuracy and recall**: accuracy는 답이 맞는 정도, recall은 윈도우 안에 있는 정보를 필요할 때 찾아 쓰는 정도다. 윈도우 안에 분명히 들어 있는 내용인데도 놓치는 일이 늘어난다는 뜻이다
- **degrade**: 갑자기 무너지는 것이 아니라 점점 나빠진다는 말이다. 토큰 수가 늘어나는 것과 함께 서서히 떨어진다
- **context rot**: rot은 "썩다, 상하다"라는 뜻이다. 컨텍스트가 길어질수록 그 안의 정보가 제 역할을 못 하게 되는 모습을 음식이 상하는 데 빗댄 이름이다

### 그래서 무엇을 넣을지 고르는 일이 중요하다

> This makes curating what's in context just as important as how much space is available.

그래서 컨텍스트에 무엇을 넣을지 골라 정리하는 일이, 공간이 얼마나 있는지만큼 중요해진다.

- **This makes**: 앞의 context rot에서 따라 나오는 결론임을 잇는 말이다
- **curating**: 박물관 큐레이터가 전시품을 고르듯, 넣을 것과 뺄 것을 골라 정리하는 일이다. 관련 없는 내용을 덜어내는 것까지 포함한다
- **just as important as**: 크기를 무시하라는 말이 아니라, 크기와 선별을 같은 무게로 보라는 말이다

```
                    큰 윈도우에 마구 채우기        필요한 것만 골라 채우기
넣을 수 있는 양      많음                          많음 (여유가 남음)
토큰 수              큼                            상대적으로 작음
정확도·recall        토큰이 늘수록 떨어짐           덜 떨어짐
```

---

## 종합

윈도우의 크기는 "얼마나 넣을 수 있는가"를 정하고, 결과의 질은 "무엇을 넣었는가"에 달려 있다. 토큰 수가 늘수록 정확도와 recall이 점점 떨어지는 context rot 때문에, 윈도우가 크다고 아무거나 채우면 오히려 모델이 중요한 정보를 놓치기 쉬워진다. 원문이 크기와 선별을 "just as important"로 나란히 둔 이유가 여기 있다. 이 관점은 대화가 길어질수록 더 중요해진다. 다음 질문에서 보듯 멀티턴 대화에서는 턴마다 토큰이 쌓이기 때문이다.

---

# 멀티턴 대화에서 턴이 진행될수록 컨텍스트 윈도우의 토큰은 어떻게 불어나는가?

## 도입

Messages API는 stateless라서 매 요청에 지금까지의 대화 전체를 실어 보낸다(이유는 [왜 매 턴 전체 대화를 다시 보내는가?](../../knowledge/ai/messages-api.md#왜-매-턴-전체-대화를-다시-보내는가)). 이 질문은 그 결과를 컨텍스트 윈도우 쪽에서 본다. 대화 전체를 매번 보내니, 턴이 쌓일수록 요청 하나가 차지하는 토큰도 함께 쌓인다. 원문은 이것을 세 항목으로 정리한다.

---

## 본문

### 턴마다 쌓이고, 이전 턴은 그대로 남는다

> **Progressive token accumulation:** As the conversation advances through turns, each user message and assistant response accumulates within the context window, and previous turns are preserved completely.

턴이 진행될수록 사용자 메시지와 어시스턴트 응답이 하나씩 컨텍스트 윈도우 안에 쌓이고, 이전 턴은 하나도 빠짐없이 그대로 유지된다.

- **Progressive**: 한 번에 늘어나는 것이 아니라 턴마다 조금씩 늘어난다는 뜻이다
- **accumulation / accumulates**: 덮어쓰는 것이 아니라 계속 더해진다. 새 턴이 앞 턴을 대신하지 않고 그 뒤에 붙는다
- **each user message and assistant response**: 사용자가 보낸 것뿐 아니라 Claude가 돌려준 응답도 쌓인다. 응답이 길면 다음 턴부터는 그 긴 응답이 입력이 되어 계속 윈도우를 차지한다
- **preserved completely**: 이전 턴을 요약하거나 잘라내지 않고 원문 그대로 둔다는 뜻이다. 그래서 대화가 길어지면 토큰 수는 줄지 않고 늘기만 한다

### 윈도우가 담는 것: 대화 이력과 새 출력

> **Context window capacity:** The context window (up to 1M tokens, depending on the model) holds the conversation history plus the new output Claude generates.

컨텍스트 윈도우(모델에 따라 최대 100만 토큰)는 대화 이력에 더해 Claude가 새로 만드는 출력까지 담는다.

- **capacity**: 담을 수 있는 최대량, 즉 한도다
- **up to 1M tokens, depending on the model**: 한도는 모델마다 다르고, 가장 큰 경우가 100만 토큰이라는 뜻이다. 모든 모델이 100만 토큰인 것은 아니다
- **conversation history plus the new output**: 첫 번째 질문의 "including the response itself"가 대화 상황에서 다시 나온 것이다. 쌓인 이력과 이번 턴에 생성할 응답이 함께 한도 안에 들어가야 한다

### 한 턴의 구성: 입력 단계와 출력 단계

> **Input-output flow:** Each turn consists of:
>   - **Input phase:** Contains all previous conversation history plus the current user message
>   - **Output phase:** Generates a text response that becomes part of the input for the next turn

각 턴은 두 단계로 이뤄진다.

- 입력 단계: 이전 대화 이력 전부에 현재 사용자 메시지를 더한 것이 들어간다
- 출력 단계: 텍스트 응답을 만들고, 그 응답은 다음 턴 입력의 일부가 된다

- **all previous conversation history plus the current user message**: 입력은 "이번 메시지"가 아니라 "지금까지 전부 + 이번 메시지"다. 앞의 "preserved completely"가 입력 단계에서 어떻게 드러나는지를 보여준다
- **becomes part of the input for the next turn**: 이번 턴의 출력이 다음 턴의 입력으로 넘어간다. 출력은 한 번 만들어지고 끝나는 것이 아니라, 이후 모든 턴에서 입력으로 다시 실린다

원문은 이 흐름을 다이어그램으로 보여준다.

> The following diagram illustrates the standard context window behavior for API requests

아래 다이어그램은 API 요청에서의 표준적인 컨텍스트 윈도우 동작을 보여준다.

- **standard**: 특별한 기능을 켜지 않았을 때의 기본 동작이라는 뜻이다
- **for API requests**: API로 직접 요청할 때의 이야기다. 바로 아래 각주가 채팅 화면과의 차이를 짚는다

```
                0 tokens                                  Context window 1M (or 200k) tokens
                |                                         |
Turn 1  Input   [User]                                    |
        Output        [Resp]                              |
                                                          |
Turn 2  Input   [User][Resp][User]                        |
        Output                    [Resp]                  |
                                                          |
Turn 3  Input   [User][Resp][User][Resp][User]            |
        Output                                [Resp]      |

[User] = User message   [Resp] = Text response
오른쪽 끝 세로선 = 컨텍스트 윈도우 한계
```

턴 3의 입력에는 턴 1·2의 메시지와 응답이 모두 들어 있다. 턴이 하나 늘 때마다 입력 막대가 오른쪽 한계선 쪽으로 길어진다.

### API와 채팅 화면의 차이: 오래된 턴을 밀어내기

> Chat interfaces such as claude.ai can also manage the context window on a rolling "first in, first out" basis.

claude.ai 같은 채팅 화면은 컨텍스트 윈도우를 "먼저 들어온 것이 먼저 나가는" 방식으로 굴려 가며 관리할 수도 있다.

- **Chat interfaces such as claude.ai**: API를 직접 호출하는 코드가 아니라, 사람이 쓰는 채팅 화면이다
- **can also**: 그렇게 "할 수도 있다"는 말이다. 항상 그렇게 한다고 단정하지 않는다
- **rolling "first in, first out"**: 줄 서기처럼 먼저 들어온 것이 먼저 빠지는 방식(FIFO)이다. JS로 치면 배열이 한도를 넘을 때 `messages.shift()`로 가장 오래된 메시지부터 빼는 모습에 가깝다. 윈도우가 차면 오래된 턴을 밀어내고 새 턴을 넣는다

이 각주는 바로 앞의 "previous turns are preserved completely"와 대비된다. API의 표준 동작에서는 이전 턴이 그대로 남아 토큰이 계속 쌓이고, 채팅 화면은 오래된 턴을 밀어내 한도 안에 머무를 수 있다.

```
                API 표준 동작                     채팅 화면 (claude.ai 등)
이전 턴         전부 그대로 남음                   오래된 턴부터 밀려날 수 있음
토큰 수         턴마다 계속 늘어남                 한도 근처에서 유지될 수 있음
```

원본 다이어그램: https://platform.claude.com/docs/images/context-window.svg

---

## 종합

멀티턴 대화에서 토큰이 불어나는 이유는 두 가지가 맞물려서다.

- 매 턴의 입력이 "이전 이력 전부 + 이번 메시지"다. API가 stateless라서 이력을 매번 다시 싣는다
- 매 턴의 출력이 다음 턴의 입력이 된다. 응답도 사라지지 않고 이후 모든 턴에 계속 실린다

그래서 턴이 하나 늘 때마다 사용자 메시지와 응답 한 쌍만큼 입력이 길어지고, 이전 턴은 그대로 남아 줄지 않는다. 이대로 대화가 이어지면 언젠가 윈도우 한계에 닿는다. 채팅 화면이 오래된 턴을 밀어내는 방식을 쓸 수 있는 것도 이 때문이고, API를 직접 쓰는 쪽은 그런 처리가 기본으로 일어나지 않으니 이력이 계속 쌓인다는 점을 염두에 둬야 한다.

---

# API 요청의 어디까지가 컨텍스트 윈도우에 포함되는가?

## 도입

앞 질문에서 대화 이력과 응답이 윈도우에 쌓인다고 했다. 하지만 API 요청에는 메시지 말고도 실리는 것이 있다. 시스템 프롬프트(모든 메시지 앞에 붙는, 모델의 역할·규칙을 정하는 지시문)와 tool 정의(모델이 호출할 수 있는 함수의 이름·설명·인자 형식)가 그 예다. 원문은 이런 것들까지 윈도우에 포함되는지를 하나씩 짚는다.

---

## 본문

### 요청에 실린 것 전부

> Everything in the request counts toward the context window: the system prompt, every message in `messages` (including tool results, images, and documents), and your tool definitions.

요청에 들어 있는 모든 것이 컨텍스트 윈도우를 차지한다. 시스템 프롬프트, `messages` 안의 모든 메시지(tool 실행 결과·이미지·문서 포함), 그리고 tool 정의까지다.

- **Everything in the request**: 맨 앞에서 결론부터 말한다. 요청 본문에 실린 것은 예외 없이 윈도우를 차지한다
- **counts toward**: "~에 포함되어 계산된다". 윈도우 한도를 따질 때 이 항목들의 토큰이 모두 더해진다는 뜻이다
- **the system prompt**: 매 요청에 함께 실리므로 매번 윈도우를 차지한다. 길게 쓰면 대화에 쓸 공간이 그만큼 줄어든다
- **including tool results, images, and documents**: 텍스트 메시지만이 아니라는 점을 짚는다. tool 실행 결과로 돌려준 긴 JSON, 첨부한 이미지나 PDF도 모두 `messages` 안에 들어가 토큰으로 계산된다
- **your tool definitions**: 모델이 실제로 tool을 호출하지 않더라도, 정의를 요청에 실었다면 그 정의가 윈도우를 차지한다

### 이번 턴에 생성되는 출력도

> The output Claude generates for the turn, including its extended thinking, counts too.

Claude가 이번 턴에 만들어 내는 출력도, extended thinking까지 포함해 윈도우를 차지한다.

- **The output Claude generates for the turn**: 입력만이 아니라 출력도 같은 한도 안에서 계산된다. 첫 번째 질문의 "including the response itself"와 같은 이야기다
- **extended thinking**: Claude가 최종 답을 내기 전에 생각하는 과정을 별도의 출력으로 만들어 내는 기능이다. 화면에 보이는 최종 답만 출력이 아니라, 이 생각 과정도 출력 토큰으로 생긴다
- **counts too**: 앞 문장의 "counts toward"를 받아, 출력 역시 같은 계산에 들어간다는 뜻이다

```
API 요청 1회가 차지하는 컨텍스트 윈도우
├── 입력 (요청에 실린 것)
│   ├── system prompt
│   ├── messages
│   │   ├── 텍스트 메시지 (user / assistant)
│   │   ├── tool results
│   │   ├── images
│   │   └── documents
│   └── tool definitions
└── 출력 (이번 턴에 생성되는 것)
    ├── extended thinking
    └── 최종 응답
```

### 얼마나 차지했는지: 보내기 전 추정, 보낸 뒤 확인

원문(같은 페이지)은 이 양을 숫자로 확인하는 방법도 함께 적어 둔다.

> Every response reports what the request consumed in its usage field.

모든 응답은 그 요청이 소비한 양을 `usage` 필드에 담아 알려준다.

- **Every response**: 응답마다 빠짐없이 온다는 뜻이다
- **consumed**: 그 요청이 실제로 쓴 토큰의 양이다. 보낸 뒤에야 확정되는 값이다
- **usage field**: 응답 객체 안의 필드다. `const res = await anthropic.messages.create(...)` 뒤에 `res.usage`를 보면 이번 요청의 입력·출력 토큰 수를 알 수 있다

> To estimate a request before you send it, use the token counting API.

요청을 보내기 전에 크기를 가늠하려면 token counting API를 쓴다.

- **estimate ... before you send it**: `usage`가 "보낸 뒤 확인"이라면, 이쪽은 "보내기 전 추정"이다
- **token counting API**: 텍스트를 실제로 처리해 응답을 받는 대신, 입력이 몇 토큰인지만 세어 돌려주는 기능이다. [Claude에서 토큰 하나가 몇 글자에 해당하는지는 어떻게 알 수 있는가?](../../knowledge/ai/llm/tokens.md#claude에서-토큰-하나가-몇-글자에-해당하는지는-어떻게-알-수-있는가)에서 정확한 토큰 수를 얻는 방법으로 다룬 그 기능이다

```
                  token counting API              usage 필드
언제              보내기 전                        보낸 뒤 (응답에 포함)
용도              한도 안에 들어갈지 미리 가늠      실제로 쓴 양을 확인
```

---

## 종합

컨텍스트 윈도우를 차지하는 것은 "대화 메시지"보다 넓다. 요청에 실린 시스템 프롬프트·메시지(tool 결과·이미지·문서 포함)·tool 정의가 입력 쪽을, 이번 턴의 응답과 extended thinking이 출력 쪽을 차지하고, 이 둘이 함께 한도 안에 들어가야 한다. 멀티턴 대화에서는 이 중 시스템 프롬프트와 tool 정의가 매 요청에 반복해서 실리고, tool 결과와 문서는 한 번 `messages`에 들어가면 이후 턴마다 이력으로 계속 실린다. 그래서 대화가 길어질 때 토큰이 불어나는 속도는 텍스트 메시지 길이만으로 짐작하기 어렵고, 보내기 전에는 token counting API로, 보낸 뒤에는 `usage` 필드로 숫자를 확인하는 편이 정확하다.

---

# 프롬프트 캐싱으로 캐시에서 읽은 입력 토큰도 컨텍스트 윈도우를 차지하는가?

## 도입

프롬프트 캐싱은 여러 요청에 반복해서 실리는 앞부분(긴 시스템 프롬프트, 이전 대화 이력 등)을 처리한 결과를 저장해 두었다가, 다음 요청에서 다시 쓰는 기능이다. 그러면 캐시에서 읽어 온 부분은 "다시 보낸 것"으로 쳐서 윈도우를 차지할까, 아니면 빠질까? 원문의 답은 짧다. 모두 차지한다.

---

## 본문

> If you use prompt caching, the input count is split across `input_tokens`, `cache_read_input_tokens`, and `cache_creation_input_tokens`, and all three count toward the window.

프롬프트 캐싱을 쓰면 입력 토큰 수가 `input_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens` 세 필드로 나뉘어 표시되는데, 세 가지 모두 윈도우를 차지한다.

- **the input count is split across**: 입력 토큰 수가 하나의 숫자가 아니라 세 칸으로 나뉘어 보인다는 뜻이다. 나뉘는 것은 표시 방식이지, 입력의 일부가 사라지는 것이 아니다
- **`input_tokens`**: 캐시와 관계없이 이번에 처리된 입력 토큰이다
- **`cache_read_input_tokens`**: 캐시에서 읽어 온 입력 토큰이다. 질문이 묻는 바로 그 부분이다
- **`cache_creation_input_tokens`**: 이번 요청에서 새로 캐시에 저장한 입력 토큰이다
- **all three count toward the window**: 질문의 답이다. 캐시에서 읽었든, 새로 캐시에 썼든, 캐시와 무관하든 모두 컨텍스트 윈도우에 들어간다. 캐시에서 읽어 온 내용도 모델이 응답을 만들 때 참조하는 텍스트이기 때문이다

```
입력 토큰 (모두 컨텍스트 윈도우를 차지)
├── input_tokens                  캐시와 무관하게 처리된 입력
├── cache_read_input_tokens       캐시에서 읽어 온 입력
└── cache_creation_input_tokens   이번에 캐시에 새로 쓴 입력

윈도우 계산 시 입력 = 세 필드의 합
```

흔히 혼동하는 지점이다. `input_tokens` 하나만 보고 윈도우 사용량을 판단하면, 캐시 쪽 두 필드만큼을 빠뜨려 실제보다 작게 보게 된다.

---

## 종합

프롬프트 캐싱은 반복되는 앞부분의 처리 결과를 다시 쓰는 기능이지, 그 내용을 컨텍스트 윈도우에서 빼 주는 기능이 아니다. 원문은 입력 토큰이 세 필드로 나뉘어 보일 뿐 세 필드 모두 윈도우를 차지한다고 못 박는다. 멀티턴 대화에서 앞쪽 이력을 캐시해 두더라도, 그 이력은 여전히 매 턴 윈도우 안에 들어 있다. 그래서 대화가 길어질 때 윈도우 사용량을 확인하려면 `usage`의 세 입력 필드를 모두 더해야 한다.

---

# thinking을 켜면 thinking 토큰은 max_tokens·과금에서 어떻게 취급되는가?

## 도입

extended thinking을 켜면 Claude는 최종 답 앞에 생각 과정을 토큰으로 만들어 낸다. 이 토큰은 사용자에게 보여 주는 최종 답과 성격이 다르니, 한도나 요금 계산에서 따로 취급될 것 같기도 하다. 원문은 컨텍스트 윈도우, `max_tokens`, 과금, rate limit 네 군데에서 thinking 토큰이 어떻게 계산되는지를 말한다.

---

## 본문

### 컨텍스트 윈도우: 다른 토큰과 똑같이

> With thinking, all input and output tokens, including thinking tokens, count toward the context window limit, with a few nuances in multi-turn situations.

thinking을 쓸 때도 thinking 토큰을 포함한 모든 입력·출력 토큰이 컨텍스트 윈도우 한도에 포함된다. 다만 멀티턴 상황에서는 몇 가지 세부 차이가 있다.

- **all input and output tokens, including thinking tokens**: thinking 토큰도 출력 토큰의 하나로 윈도우를 차지한다는 뜻이다. 앞 질문의 "including its extended thinking, counts too"와 같은 이야기다
- **with a few nuances in multi-turn situations**: 대화가 여러 턴으로 이어질 때는 계산이 조금 달라지는 부분이 있다는 예고다. 같은 페이지의 뒷부분은 그 차이로, 이전 턴의 thinking 블록이 다음 요청의 입력으로 계속 남는지가 모델마다 다르다는 점을 든다

### `max_tokens`·과금·rate limit

> Thinking tokens are a subset of your `max_tokens` parameter, are billed as output tokens, and count toward rate limits.

thinking 토큰은 `max_tokens` 안에 포함되는 일부이고, 출력 토큰으로 과금되며, rate limit에도 포함된다.

- **a subset of your `max_tokens` parameter**: `max_tokens`는 응답을 최대 몇 토큰까지 생성할지 정하는 값이다. thinking 토큰은 이 한도 바깥에 따로 잡히는 것이 아니라 그 안에서 함께 쓰인다. `max_tokens: 4000`이면 thinking과 최종 답이 합쳐서 4000토큰 안에 들어가야 한다. thinking이 길어지면 최종 답에 쓸 수 있는 몫이 줄어든다
- **billed as output tokens**: thinking 토큰도 출력 토큰 요금으로 계산된다. 화면에 최종 답만 짧게 보이더라도, 그 앞의 생각 과정만큼 출력 토큰 비용이 붙는다
- **count toward rate limits**: rate limit은 일정 시간 동안 보낼 수 있는 요청 수나 토큰 수의 상한이다. thinking 토큰도 이 상한을 채우는 데 들어간다

```
max_tokens: 4000 (출력 한도)
├── thinking 토큰    ← 출력 토큰으로 과금, rate limit에 포함
└── 최종 응답 토큰   ← 출력 토큰으로 과금, rate limit에 포함

thinking이 길어지면 → 최종 응답에 남는 몫이 줄어든다
```

### thinking 양은 요청마다 달라진다: adaptive thinking

원문(같은 페이지)은 thinking 토큰 양이 고정돼 있지 않은 경우도 적어 둔다.

> With adaptive thinking, Claude determines its thinking allocation dynamically, so thinking token usage varies from request to request.

adaptive thinking을 쓰면 Claude가 thinking에 얼마를 쓸지 그때그때 스스로 정하므로, thinking 토큰 사용량이 요청마다 달라진다.

- **adaptive thinking**: thinking의 양을 미리 고정하지 않고 Claude가 요청에 맞춰 정하는 방식이다
- **determines its thinking allocation dynamically**: allocation은 "배분"이다. thinking에 토큰을 얼마나 배분할지를 실행 시점에 정한다는 뜻이다
- **varies from request to request**: 같은 종류의 요청이라도 thinking 토큰 수가 매번 다를 수 있다. 앞 조각과 이어 보면, `max_tokens` 안에서 최종 답에 남는 몫과 출력 비용도 요청마다 달라진다는 뜻이 된다

---

## 종합

thinking 토큰은 별도 취급되는 특별한 토큰이 아니라, 출력 토큰의 한 종류로 계산된다. 그래서 컨텍스트 윈도우를 차지하고, `max_tokens` 한도 안에서 최종 답과 몫을 나누며, 출력 토큰 요금으로 과금되고, rate limit도 채운다. adaptive thinking에서는 그 양이 요청마다 달라지므로, 같은 질문이라도 출력 토큰 수와 비용이 일정하지 않을 수 있다. 원문이 정한 규칙은 아니지만, 이 계산 방식에서 따라 나오는 실무 감각은 thinking을 켰을 때 최종 답이 잘리지 않도록 `max_tokens`에 여유를 두고, 실제로 얼마나 썼는지는 응답의 `usage`로 확인하는 것이다. 멀티턴에서의 세부 차이("a few nuances")는 이전 턴의 thinking 블록이 다음 요청에 남는지가 모델마다 다르다는 점이다.
