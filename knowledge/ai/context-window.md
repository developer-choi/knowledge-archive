---
tags: [ai, concept]
source: official
publishable: true
---
# Questions
- LLM의 컨텍스트 윈도우(context window)란 무엇인가?
  - 컨텍스트 윈도우는 클수록, 많이 채울수록 좋은가?
- 멀티턴 대화에서 턴이 진행될수록 컨텍스트 윈도우의 토큰은 어떻게 불어나는가?
  - API 요청의 어디까지가 컨텍스트 윈도우에 포함되는가?
  - 프롬프트 캐싱으로 캐시에서 읽은 입력 토큰도 컨텍스트 윈도우를 차지하는가?
- thinking을 켜면 thinking 토큰은 max_tokens·과금에서 어떻게 취급되는가?

---

# Answers

## LLM의 컨텍스트 윈도우(context window)란 무엇인가?

### Official Answer
The "context window" refers to all the text a language model can reference when generating a response, including the response itself. This is different from the large corpus of data the language model was trained on, and instead represents a "working memory" for the model.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/context-windows

## 컨텍스트 윈도우는 클수록, 많이 채울수록 좋은가?

### Official Answer
A larger context window allows the model to handle more complex and lengthy prompts, but more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/context-windows

## 멀티턴 대화에서 턴이 진행될수록 컨텍스트 윈도우의 토큰은 어떻게 불어나는가?

### Official Answer
- **Progressive token accumulation:** As the conversation advances through turns, each user message and assistant response accumulates within the context window, and previous turns are preserved completely.
- **Context window capacity:** The context window (up to 1M tokens, depending on the model) holds the conversation history plus the new output Claude generates.
- **Input-output flow:** Each turn consists of:
  - **Input phase:** Contains all previous conversation history plus the current user message
  - **Output phase:** Generates a text response that becomes part of the input for the next turn

### Additional Answer
턴마다 이전 이력 전체를 다시 보내야 하는 이유는 [messages-api.md](messages-api.md)의 「왜 매 턴 전체 대화를 다시 보내는가?」를 참고한다.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/context-windows

## API 요청의 어디까지가 컨텍스트 윈도우에 포함되는가?

### Official Answer
Everything in the request counts toward the context window: the system prompt, every message in `messages` (including tool results, images, and documents), and your tool definitions. The output Claude generates for the turn, including its extended thinking, counts too.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/context-windows

## 프롬프트 캐싱으로 캐시에서 읽은 입력 토큰도 컨텍스트 윈도우를 차지하는가?

### Official Answer
If you use prompt caching, the input count is split across `input_tokens`, `cache_read_input_tokens`, and `cache_creation_input_tokens`, and all three count toward the window.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/context-windows

## thinking을 켜면 thinking 토큰은 max_tokens·과금에서 어떻게 취급되는가?

### Official Answer
With thinking, all input and output tokens, including thinking tokens, count toward the context window limit, with a few nuances in multi-turn situations.

Thinking tokens are a subset of your `max_tokens` parameter, are billed as output tokens, and count toward rate limits.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/context-windows
