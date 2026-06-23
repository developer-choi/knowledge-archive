# LLM(거대 언어 모델)이란 무엇인가?

> A large language model (LLM) is a neural network trained on a vast amount of text for natural language processing tasks, especially language generation.

### neural network (신경망)

LLM의 정체는 **신경망**이다. 신경망은 사람 뇌의 뉴런 연결 구조를 본떠 만든 계산 모델로, 데이터를 보고 스스로 패턴을 "학습"하는 머신러닝의 한 방식이다. 즉 LLM은 사람이 규칙을 일일이 짜 넣은 프로그램이 아니라, 데이터로 훈련된 모델이다.

### trained on a vast amount of text (방대한 텍스트로 훈련됨)

그 신경망을 **엄청난 양의 텍스트**로 훈련시킨 것이 LLM이다. "large"가 붙는 이유가 여기에 있다 — 학습 데이터의 규모도, 모델 자체의 크기(파라미터 수)도 거대하다.

### natural language processing, especially language generation (자연어 처리, 특히 언어 생성)

훈련의 목적은 **자연어 처리(NLP)** — 사람의 언어를 컴퓨터가 다루는 작업이다. 그중에서도 LLM은 **언어 생성(language generation)**, 즉 새로운 문장을 만들어내는 능력에 초점이 맞춰져 있다. 번역기나 검색엔진도 NLP지만, LLM의 두드러진 특징은 "말을 만들어낸다"는 점이다.

---

## 종합

LLM = **방대한 텍스트로 훈련된 신경망**으로, 자연어 처리(특히 새 문장을 만들어내는 언어 생성)를 수행하는 모델이다. 사람이 규칙을 짜 넣은 게 아니라 데이터로 학습했다는 점, 그리고 "생성" 능력이 핵심이라는 점만 잡으면 정의는 끝난다.

---

# LLM은 어떤 작업들을 할 수 있는가?

## 도입

LLM이 "언어를 다루는 모델"이라는 건 알았다. 그러면 구체적으로 무슨 일을 할 수 있을까? 그리고 우리가 매일 쓰는 챗봇과는 어떤 관계일까?

---

## 본문

공식 설명은 이렇다:

> LLMs can typically generate, summarize, translate, and analyze text in many contexts, and are a foundational technology behind modern chatbots.

### 네 가지 작업

LLM이 여러 맥락에서 텍스트를 다루는 대표적인 방식이 넷이다.

- **generate (생성)** — 새 글을 써낸다 (이메일 초안, 코드, 이야기 등)
- **summarize (요약)** — 긴 글을 짧게 줄인다
- **translate (번역)** — 한 언어를 다른 언어로 옮긴다
- **analyze (분석)** — 텍스트의 내용·감정·구조를 파악한다

"in many contexts(여러 맥락에서)"라는 표현이 중요하다. 한 가지 용도에만 특화된 게 아니라, 같은 모델 하나가 상황에 따라 이 작업들을 두루 해낸다.

### 현대 챗봇의 기반 기술

LLM은 **현대 챗봇의 기반 기술(foundational technology)**이다. 즉 ChatGPT 같은 챗봇은 "겉면(UI)"이고, 그 아래에서 실제로 언어를 이해하고 생성하는 엔진이 LLM이다. 챗봇 ≠ LLM — 챗봇은 LLM 위에 올라탄 응용 제품이라고 보면 된다.

---

## 종합

LLM은 텍스트를 **생성·요약·번역·분석**하며, 그것도 한 모델이 여러 맥락에서 두루 해낸다. 그리고 현대 챗봇이 돌아가게 만드는 **밑바탕 엔진**이다. "챗봇이 곧 LLM"이 아니라 "챗봇이 LLM을 쓴다"는 관계를 기억하면 된다.
