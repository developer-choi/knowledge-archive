# LLM에서 토큰(token)이란 무엇인가?

## 도입

LLM은 사람이 쓴 문장을 글자 그대로 읽지 않는다. 텍스트를 먼저 모델이 다룰 수 있는 작은 조각들로 잘라 번호를 매긴 뒤, 그 조각 열을 입력으로 받는다. 이 조각이 토큰이다. 원문은 토큰이 무엇인지(정의)와 텍스트가 토큰이 되는 과정(인코딩)을 말하고, 이어서 평소에는 토큰이 왜 눈에 띄지 않는지를 덧붙인다.

---

## 본문

### 정의 — 모델이 다루는 가장 작은 단위

> Tokens are the smallest individual units of a language model, and can correspond to words, subwords, characters, or even bytes (in the case of Unicode).

토큰은 언어 모델이 다루는 가장 작은 단위이고, 하나의 토큰은 단어일 수도, 단어의 일부일 수도, 글자 하나일 수도, 심지어 바이트 하나일 수도 있다.

- **smallest individual units**: 모델 입장에서 더 쪼개지지 않는 최소 단위. 모델은 "글자"나 "단어"를 보는 게 아니라 이 단위의 나열을 본다. 사람에게 최소 단위가 글자라면, 모델에게 최소 단위는 토큰이다
- **can correspond to**: "~에 대응될 수 있다". "토큰 = 단어"처럼 하나로 고정해 말하지 않고 여러 후보를 늘어놓은 이유가 여기 있다. 토큰이 텍스트의 어느 크기에 해당하는지는 정해져 있지 않다
- **words, subwords, characters**: 크기 순으로 늘어놓은 후보들이다
  - words — 단어 전체가 토큰 하나 (예: 자주 쓰이는 짧은 영단어)
  - subwords — 단어의 일부가 토큰 하나 (예: 긴 단어가 앞뒤 조각으로 나뉨)
  - characters — 글자 하나가 토큰 하나
- **bytes (in the case of Unicode)**: Unicode 문자는 저장될 때 1~4바이트로 표현된다(UTF-8 기준). 드물게 쓰이는 문자는 글자 단위로도 토큰이 되지 못하고 그 바이트 단위까지 내려가 토큰이 될 수 있다는 뜻이다. JS에서 `new TextEncoder().encode("한")`가 바이트 3개짜리 배열을 돌려주는 것처럼, 글자 하나 아래에 바이트라는 더 작은 층이 있다

```
텍스트 크기 ↑ 큼
  words       "hello"        → 토큰 1개가 단어 전체
  subwords    "token" + "ization"  → 토큰 1개가 단어 일부
  characters  "가"            → 토큰 1개가 글자 하나
  bytes       0xEA 0xB0 0x80 → 토큰 1개가 바이트 하나
텍스트 크기 ↓ 작음
```

위 예시는 단위의 크기 차이를 보여주기 위한 것이다. 실제로 어떤 텍스트가 어느 단위로 잘리는지는 원문이 밝히지 않는다.

### 인코딩 — 텍스트가 토큰 열이 되는 과정

> When Claude is provided with text to evaluate, the text (consisting of a series of characters) is encoded into a series of tokens for the model to process.

Claude에 텍스트가 주어지면, 글자들의 나열인 그 텍스트는 모델이 처리할 수 있도록 토큰들의 나열로 바뀐다.

- **a series of characters → a series of tokens**: 입력은 "글자의 나열"이고, 모델에 들어가는 것은 "토큰의 나열"이다. 같은 내용을 단위만 바꿔 다시 적는 것이다
- **encoded**: 한 표현을 다른 표현으로 바꾸는 것. JS의 `encodeURIComponent("한 글")`이 같은 문자열을 URL에 실을 수 있는 형태로 바꾸듯, 텍스트를 모델이 받을 수 있는 형태로 바꾼다는 뜻이다
- **for the model to process**: 이 변환이 필요한 이유. 모델은 날것의 글자를 처리하지 못하고 토큰 열만 받는다. 인코딩이 없으면 모델에 입력을 넣을 방법 자체가 없다

```
"Hello, world"          (글자의 나열)
      │ 인코딩
      ▼
[tok][tok][tok][tok]    (토큰의 나열)
      │
      ▼
     LLM  ──→  토큰을 하나씩 생성  ──→  다시 텍스트로 풀어 사용자에게 표시
```

출력 쪽도 같은 단위다. 모델은 토큰을 하나씩 만들어내고, 그것이 텍스트로 풀려 화면에 나온다.

### 평소엔 숨어 있다가 정확히 따질 때 드러난다

> Tokens are typically hidden when interacting with language models at the "text" level but become relevant when examining the exact inputs and outputs of a language model.

채팅처럼 텍스트로만 주고받을 때는 토큰이 드러나지 않지만, 모델의 입력과 출력을 정확히 따질 때는 토큰이 중요해진다.

- **hidden ... at the "text" level**: 채팅 화면에서는 입력도 출력도 텍스트로 보이기 때문에, 그 사이에서 일어난 인코딩을 의식할 일이 없다
- **become relevant**: 입력·출력의 양을 정확히 따지는 순간 기준 단위가 글자가 아니라 토큰이 된다. 대표적인 자리는 다음과 같다
  - 비용 — API 요금은 입력·출력 토큰 수로 매겨진다
  - 길이 한도 — 모델이 한 번에 받을 수 있는 입력 크기(컨텍스트 윈도우)가 토큰 수로 정해진다
  - `max_tokens` — API 요청에서 "응답을 최대 몇 토큰까지 생성할지"를 정하는 값이다. 이름부터 글자가 아니라 토큰 단위다

---

## 종합

토큰은 LLM이 텍스트를 다루는 최소 단위이고, 그 크기는 단어부터 바이트까지 고정돼 있지 않다. 사람이 입력한 글자 나열은 인코딩을 거쳐 토큰 나열이 되어야 모델에 들어갈 수 있고, 모델의 출력도 토큰 단위로 만들어진다. 채팅 화면에서는 이 과정이 감춰져 있어서 토큰을 몰라도 쓰는 데 지장이 없다. 하지만 API를 직접 호출해 비용을 계산하거나, 긴 문서가 한도 안에 들어가는지 보거나, `max_tokens`를 정할 때는 글자 수가 아니라 토큰 수가 기준이 된다. 토큰을 이해해야 하는 이유는 개발자가 모델을 "정확히 따지는" 쪽에 서는 순간 마주치는 단위이기 때문이다.

---

# Claude에서 토큰 하나가 몇 글자에 해당하는지는 어떻게 알 수 있는가?

## 도입

앞 질문에서 토큰 하나가 단어일 수도, 글자일 수도, 바이트일 수도 있다고 했다. 그러면 Claude에서 토큰 하나는 대략 글자 몇 개에 해당할까? 원문은 이 질문에 고정된 숫자 대신 "무엇에 따라 달라지는가"와 "정확한 값은 어떻게 얻는가"로 답한다.

---

## 본문

### 무엇에 따라 달라지는가 — 모델과 언어

> For Claude, the number of characters a token represents depends on the model and the language.

Claude에서 토큰 하나가 몇 글자를 나타내는지는 모델과 언어에 따라 달라진다.

- **the number of characters a token represents**: "토큰 하나 = 글자 몇 개"라는 비율. 질문이 묻는 바로 그 값이다
- **depends on**: 답이 숫자가 아니라 조건이다. 원문이 고정 비율을 주지 않고 "~에 달려 있다"로 답한 것이 핵심이다
- **the model**: 텍스트를 토큰으로 자르는 규칙(토크나이저)은 모델마다 다를 수 있다. 같은 문장이라도 어느 모델에 넣느냐에 따라 토큰 수가 달라진다
- **the language**: 같은 내용이라도 영어로 썼는지 다른 언어로 썼는지에 따라 토큰 하나가 담는 글자 수가 달라진다

### 모델에 따라 달라지는 예 — 대략적인 수치

원문(같은 페이지)은 모델에 따른 차이를 보여주는 대략적인 수치도 함께 적어 둔다.

> Claude 4.7 and later models and Claude Mythos Preview use a newer tokenizer that produces approximately 30 percent more tokens for the same text than earlier models, on which a token represents approximately 3.5 English characters.

Claude 4.7 이후 모델과 Claude Mythos Preview는 새 토크나이저를 써서, 같은 텍스트에 대해 이전 모델보다 토큰을 약 30% 더 많이 만든다. 이전 모델에서는 토큰 하나가 영어 약 3.5글자에 해당했다.

- **tokenizer**: 텍스트를 토큰으로 자르는 장치. 앞 질문의 "인코딩"을 실제로 수행하는 쪽이다
- **approximately**: 두 번 나온다(약 30%, 약 3.5글자). 둘 다 어림값이라는 표시다
- **on which a token represents approximately 3.5 English characters**: "이전 모델 기준, 영어 텍스트" 조건이 붙은 수치다. 모델도 언어도 고정한 상태에서만 나온 값이라는 점이 앞 조각의 "모델과 언어에 따라 달라진다"와 맞물린다

```
같은 영어 텍스트를 넣었을 때

                    이전 모델                Claude 4.7 이후 / Mythos Preview
토크나이저          이전 토크나이저           새 토크나이저
토큰 1개 ≈          영어 약 3.5글자           (더 적은 글자)
토큰 수             기준                      약 30% 더 많음
```

새 토크나이저 쪽 "토큰 1개 ≈ 몇 글자"는 원문이 숫자로 적지 않았다. 같은 텍스트에 토큰이 약 30% 더 생기니 토큰 하나가 담는 글자는 그만큼 줄어든다는 방향만 읽을 수 있다.

흔히 혼동하는 지점이 있다. "1토큰 = N글자" 같은 고정 공식을 기대하기 쉽지만, 원문이 주는 것은 위 두 개의 어림값뿐이다. 원문은 텍스트를 어떤 알고리즘으로 자르는지 설명하지 않고(특정 분할 방식의 이름도 나오지 않는다), 한국어에서 토큰 하나가 몇 글자인지도 적지 않는다. 그러니 한국어 비율을 영어 3.5글자에서 어림해 단정하면 원문에 없는 내용을 지어내는 셈이 된다.

### 정확한 값은 어떻게 얻는가 — 토큰 카운팅

> To get exact counts, use token counting with the model you plan to use.

정확한 토큰 수가 필요하면, 실제로 쓸 모델을 지정해 토큰 카운팅을 사용하라.

- **exact counts**: 앞의 어림값과 대비되는 말이다. 어림이 아니라 정확한 값이 필요할 때의 방법을 말한다
- **token counting**: 텍스트를 모델에 실제로 보내 답을 받는 대신, "이 입력이 몇 토큰인지"만 세어 돌려주는 API 기능
- **with the model you plan to use**: 토큰 수가 모델에 따라 달라지므로, 세는 것도 실제로 쓸 모델로 해야 한다. 다른 모델로 센 값은 그 모델 기준일 뿐이다

이 방법이 없으면 비용이나 길이 한도를 글자 수에서 어림할 수밖에 없고, 모델을 바꾸거나 언어가 바뀔 때마다 그 어림이 빗나간다.

---

## 종합

Claude에서 토큰 하나가 담는 글자 수는 고정값이 아니라 모델과 언어에 달린 값이다. 원문이 주는 숫자는 "이전 모델, 영어 기준 약 3.5글자"와 "4.7 이후 모델은 같은 텍스트에 토큰이 약 30% 더 많음" 정도의 어림값이고, 이 두 수치 자체가 모델이 바뀌면 비율도 바뀐다는 것을 보여준다. 분할 알고리즘이나 한국어 비율은 원문에 없으므로, 실무에서 쓸 수 있는 결론은 두 가지다.

- 글자 수로 토큰 수를 짐작하는 것은 대략적인 감을 잡는 데까지만 쓴다
- 비용 계산·길이 한도 확인처럼 정확한 값이 필요하면 실제로 쓸 모델을 지정해 토큰 카운팅 API로 센다
