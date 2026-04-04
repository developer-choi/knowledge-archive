---
tags: [ai, concept]
---
# Questions
- [하네스 엔지니어링이란 무엇인가?](#하네스-엔지니어링이란-무엇인가)
- [Claude Messages API는 왜 매 턴마다 전체 대화를 다시 보내야 하는가?](#claude-messages-api는-왜-매-턴마다-전체-대화를-다시-보내야-하는가)
- [Claude API에서 prompt caching 비용을 최대화하려면 context를 어떤 순서로 배치해야 하는가?](#claude-api에서-prompt-caching-비용을-최대화하려면-context를-어떤-순서로-배치해야-하는가)
- [Claude API 세션 중간에 모델을 변경하면 안 되는 이유는?](#claude-api-세션-중간에-모델을-변경하면-안-되는-이유는)

---

# Answers

## 하네스 엔지니어링이란 무엇인가?
### Official Answer
Agent harnesses encode assumptions about what Claude can't do on its own, but those assumptions grow stale as Claude gets more capable.

### Reference
- https://claude.com/blog/harnessing-claudes-intelligence

---

## Claude Messages API는 왜 매 턴마다 전체 대화를 다시 보내야 하는가?
### Official Answer
The Messages API is stateless.
Claude cannot see the conversation history of prior turns.
This means that the agent harness needs to package new context alongside all past actions, tool descriptions, and instructions for Claude at each turn.

### Reference
- https://claude.com/blog/harnessing-claudes-intelligence

---

## Claude API에서 prompt caching 비용을 최대화하려면 context를 어떤 순서로 배치해야 하는가?
### Official Answer
Since cached tokens are 10% the cost of base input tokens, here are a few principles in the agent harness help maximize cache hits:
Static first, dynamic last — Order requests so that stable content (system prompt, tools) come first.
Messages for updates — Append a `<system-reminder>` in messages instead of editing the prompt.

### Reference
- https://claude.com/blog/harnessing-claudes-intelligence

---

## Claude API 세션 중간에 모델을 변경하면 안 되는 이유는?
### Official Answer
Don't change models — Avoid switching models during a session.
Caches are model-specific; switching breaks them.
If you need a cheaper model, use a subagent.

### Reference
- https://claude.com/blog/harnessing-claudes-intelligence
