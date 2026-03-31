---
tags: [ai, concept]
---
# Questions
- [Claude Code의 subagent란 무엇이며, 어떤 문제를 해결하기 위해 존재하는가?](#claude-code의-subagent란-무엇이며-어떤-문제를-해결하기-위해-존재하는가)

---

# Answers

## Claude Code의 subagent란 무엇이며, 어떤 문제를 해결하기 위해 존재하는가?

### Official Answer
Subagents are specialized AI assistants that handle specific types of tasks.
Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions.
When Claude encounters a task that matches a subagent's description, it delegates to that subagent, which works independently and returns results.

Subagents help you:
- Preserve context by keeping exploration and implementation out of your main conversation
- Enforce constraints by limiting which tools a subagent can use
- Reuse configurations across projects with user-level subagents
- Specialize behavior with focused system prompts for specific domains
- Control costs by routing tasks to faster, cheaper models like Haiku

> #### AI Annotation:
> subagent는 독립 컨텍스트 윈도우에서 특화 작업을 수행하고 결과만 반환하는 구조다.
> 메인 대화의 컨텍스트를 소비하지 않으므로, 방대한 탐색 결과가 메인 대화를 오염시키지 않는다.
> Claude가 subagent의 description을 보고 자동으로 위임 판단을 하며, 도구 제한과 모델 선택으로 안전성과 비용을 통제한다.

### Reference
- https://code.claude.com/docs/en/sub-agents
