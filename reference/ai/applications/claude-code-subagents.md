---
tags: [ai, concept]
source: official
---

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

The other way to keep something out of your context is to have it happen in a different one, which is what subagents are for. A subagent gets its own context window, with its own system prompt, the tools, and your CLAUDE.md, but not your conversation. It runs its own turns, and the only thing that comes back to the main session is its answer. Everything else is thrown away once it's done.

### Additional Answer
subagent는 독립 컨텍스트 윈도우에서 특화 작업을 수행하고 결과만 반환하는 구조다.
메인 대화의 컨텍스트를 소비하지 않으므로, 방대한 탐색 결과가 메인 대화를 오염시키지 않는다.
Claude가 subagent의 description을 보고 자동으로 위임 판단을 하며, 도구 제한과 모델 선택으로 안전성과 비용을 통제한다.

### Reference
- https://code.claude.com/docs/en/sub-agents
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

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

### Additional Answer
메인 대화는 빈번한 상호작용·맥락 공유·빠른 수정이 필요할 때, subagent는 방대한 출력 격리·도구 제한·자체 완결적 작업에, Skills는 재사용 가능한 프롬프트/워크플로우를 메인 컨텍스트에서 돌려야 할 때 쓴다.
subagent와 Skills의 핵심 차이는 격리 여부다 — subagent는 독립 컨텍스트, Skills는 메인 대화 컨텍스트에서 실행된다.

### Reference
- https://code.claude.com/docs/en/sub-agents

---

## 서브에이전트를 쓸 때 치르는 대가는 무엇인가?

### Official Answer
The downside of not having your conversation is that a subagent sometimes has to re-read things the main session already had, and it's paying for its own turns while it does. For a small job it's just overhead.

It pays off when a job produces a lot of output you don't need to keep, like going through a log. Claude will often reach for one on its own for that kind of thing, and you can ask for one directly when it doesn't ("go through this log in a subagent"). Just keep in mind that the main session only gets back what the subagent chose to report.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions

---

## 반복해서 넘기는 시끄러운 작업에는 서브에이전트를 어떻게 설정하는가?

### Official Answer
Tip: if there's a noisy job you hand off over and over, give it a subagent definition of its own with model: haiku (or sonnet). Otherwise it runs on whatever your main session is running on.

### Reference
- https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions
