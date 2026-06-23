# 프롬프트 엔지니어링이란 무엇인가?

> Prompt engineering is the process of structuring natural language inputs (known as prompts) to produce specified outputs.

자연어 입력을 체계적으로 설계하는 과정이다.

- **structuring**: 단순히 텍스트를 쓰는 게 아니라, 모델이 의도한 방향으로 이해하도록 형태·맥락·순서를 설계한다는 뜻. "엔지니어링"이라는 단어를 쓴 이유이기도 하다.
- **prompts**: 모델에 보내는 입력 텍스트의 총칭. 단순 질문뿐 아니라 지시문·예시·배경 설명 등 다양한 형태를 포함한다.
- **specified outputs**: 임의의 응답이 아니라 사용자가 원하는 특정 형태·내용·길이의 결과물.

## 종합

프롬프트 엔지니어링은 "모델에게 무엇을 어떻게 말할 것인가"에 집중하는 기술이다. 같은 질문이라도 어떻게 구조화하느냐에 따라 모델의 출력이 완전히 달라지기 때문에, 원하는 결과를 안정적으로 얻으려면 입력 설계를 의도적으로 해야 한다.

---

# 효과적인 프롬프트 엔지니어링을 위해 이해해야 하는 것은 무엇인가?

> Effective prompt engineering involves understanding how a model interprets language, and may include techniques such as few-shot prompting, chain-of-thought prompting, and role assignment.

효과적인 프롬프트 엔지니어링의 출발점은 모델이 언어를 해석하는 방식을 이해하는 것이고, 그 위에 다양한 기법을 조합한다.

- **few-shot prompting**: 모델에게 예시를 몇 개 줘서 원하는 패턴을 유도하는 방식.
- **chain-of-thought prompting**: "단계적으로 생각해봐"처럼 추론 흐름을 명시적으로 유도해 정확도를 높이는 기법.
- **role assignment**: "너는 시니어 개발자야"처럼 모델에게 역할을 부여해 응답 스타일과 관점을 조정하는 방식.

## 종합

기법들은 결국 모델이 언어를 어떻게 해석하는지에 기반한 전략이다. 모델이 예시에서 패턴을 학습하고(few-shot), 단계적 추론을 따라가며(chain-of-thought), 주어진 역할에 맞게 응답한다는(role assignment) 특성을 이해하면, 어떤 기법을 언제 쓸지 판단할 수 있게 된다.
