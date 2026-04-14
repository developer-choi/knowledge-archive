---
tags: [ai, concept]
---
# Questions
- AI 에이전트의 sequential workflow란 무엇인가?
- AI 에이전트 sequential workflow의 트레이드오프는 무엇인가?
- AI 에이전트의 parallel workflow란 무엇인가?
- AI 에이전트 parallel workflow의 트레이드오프는 무엇인가?
- AI 에이전트 parallel workflow 도입 시 주의할 점은?
- AI 에이전트의 evaluator-optimizer workflow란 무엇인가?
- Evaluator-optimizer에서 생성과 평가를 왜 분리하는가?
- Evaluator-optimizer workflow는 어떤 조건에서 도입해야 하는가?
  - Evaluator-optimizer workflow의 대표적인 유스케이스는?
- AI 에이전트 evaluator-optimizer workflow의 트레이드오프는 무엇인가?
- AI 에이전트 evaluator-optimizer workflow 도입 시 주의할 점은?

---

# Answers

## AI 에이전트의 sequential workflow란 무엇인가?
### Official Answer
Sequential workflows execute tasks in a predetermined order.
Agents at each stage process inputs, make decisions, make tool calls as needed, then pass results to the next stage.
The result is a clear chain of operations where outputs flow linearly through the system.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## AI 에이전트 sequential workflow의 트레이드오프는 무엇인가?
### Official Answer
You're trading some latency for higher accuracy by focusing each agent on a specific subtask instead of trying to handle everything at once.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## AI 에이전트의 parallel workflow란 무엇인가?
### Official Answer
Parallel workflows distribute independent tasks across multiple agents that execute simultaneously.
Instead of waiting for one agent to finish before starting the next, you run multiple agents at once and merge their results.
Agents don't hand off work to each other—they operate autonomously and produce results that contribute to the overall task.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## AI 에이전트 parallel workflow의 트레이드오프는 무엇인가?
### Official Answer
Costs more (multiple concurrent API calls) and requires an aggregation strategy.
Can lead to faster completion and separation of concerns across engineering teams.
For complex tasks, handling each consideration with a separate AI call often outperforms trying to juggle everything in one call.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## AI 에이전트 parallel workflow 도입 시 주의할 점은?
### Official Answer
Design your aggregation strategy before implementing parallel agents.
Will you take the majority vote? Average confidence scores? Defer to the most specialized agent?
Having a clear plan for synthesizing results prevents you from collecting conflicting outputs with no way to resolve them.
Don't use parallel workflows when agents need cumulative context or must build on each other's work.
Skip this pattern when resource constraints like API quotas make concurrent processing inefficient, or when you lack clear strategies for handling contradictory results from different agents.

> #### AI Annotation:
> "누적 맥락(cumulative context)"이란 에이전트 B가 작업하려면 에이전트 A의 결과를 알아야 하는 상황을 뜻한다.
> 예: 코드 생성 에이전트의 출력을 테스트 작성 에이전트가 알아야 하므로 병렬 불가 — 이 경우 sequential이 적합하다.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## AI 에이전트의 evaluator-optimizer workflow란 무엇인가?
### Official Answer
Evaluator-optimizer workflows pair two agents in an iterative cycle: one generates content, another evaluates it against specific criteria, and the generator refines based on that feedback.
This continues until the output meets your quality threshold or hits a maximum iteration count.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## Evaluator-optimizer에서 생성과 평가를 왜 분리하는가?
### Official Answer
The key insight is that generation and evaluation are different cognitive tasks.
Separating them lets each agent specialize—the generator focuses on producing content, the evaluator focuses on applying consistent quality criteria.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## Evaluator-optimizer workflow는 어떤 조건에서 도입해야 하는가?
### Official Answer
This pattern works when you have clear, measurable quality criteria that an AI evaluator can apply consistently, and when the gap between first-attempt and final quality is meaningful enough to justify the extra tokens and latency.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## Evaluator-optimizer workflow의 대표적인 유스케이스는?
### Official Answer
Consider evaluator-optimizer workflows for:
- Code generation with specific requirements (security standards, performance benchmarks, style guidelines)
- Professional communications where tone and precision matter
- Any scenario where first-draft quality consistently falls short of requirements

Evaluator-optimizer workflows work well for:
- Generating API documentation (generator writes docs, evaluator checks for completeness, clarity, and accuracy against the codebase)
- Creating customer communications (generator drafts email, evaluator assesses tone and policy compliance)
- Producing SQL queries (generator writes query, evaluator checks for efficiency and security issues)

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## AI 에이전트 evaluator-optimizer workflow의 트레이드오프는 무엇인가?
### Official Answer
Skip evaluator-optimizer workflows when first-attempt quality already meets your needs—you're burning tokens on unnecessary iterations.
Don't use this pattern for real-time applications requiring immediate responses, simple routine tasks like basic classification, or when evaluation criteria are too subjective for an AI evaluator to apply consistently.
If deterministic tools exist (like linters for code style), use those instead.
Also avoid this pattern when resource constraints outweigh quality improvements.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them

---

## AI 에이전트 evaluator-optimizer workflow 도입 시 주의할 점은?
### Official Answer
Set clear stopping criteria before you start iterating.
Define maximum iteration counts and specific quality thresholds.
Without these guardrails, you can end up in expensive loops where the evaluator keeps finding minor issues and the generator keeps tweaking, but quality plateaus well before you stop iterating.
Know when good enough is good enough.

### Reference
- https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them
