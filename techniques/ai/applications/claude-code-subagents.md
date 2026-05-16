---
tags: [ai, concept]
---
# Questions
- Claude Code의 subagent란 무엇이며, 어떤 문제를 해결하기 위해 존재하는가?
- Claude Code에서 메인 대화, subagent, Skills는 각각 언제 쓰는가?

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

---

## Claude Code에서 메인 대화, subagent, Skills는 각각 언제 쓰는가?

### Official Answer
Use the main conversation when:
- The task needs frequent back-and-forth or iterative refinement
- Multiple phases share significant context (planning → implementation → testing)
- You're making a quick, targeted change
- Latency matters. Subagents start fresh and may need time to gather context

Use subagents when:
- The task produces verbose output you don't need in your main context
- You want to enforce specific tool restrictions or permissions
- The work is self-contained and can return a summary

Consider Skills instead when you want reusable prompts or workflows that run in the main conversation context rather than isolated subagent context.

> #### AI Annotation:
> 메인 대화는 빈번한 상호작용·맥락 공유·빠른 수정이 필요할 때, subagent는 방대한 출력 격리·도구 제한·자체 완결적 작업에, Skills는 재사용 가능한 프롬프트/워크플로우를 메인 컨텍스트에서 돌려야 할 때 쓴다.
> subagent와 Skills의 핵심 차이는 격리 여부다 — subagent는 독립 컨텍스트, Skills는 메인 대화 컨텍스트에서 실행된다.

### Reference
- https://code.claude.com/docs/en/sub-agents
