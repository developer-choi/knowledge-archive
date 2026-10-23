---
tags: [ai, best-practice]
source: official
publishable: true
---
# Questions
- 몇 시간째 열어둔 Claude Code 세션이 실제 활동량보다 사용량을 훨씬 많이 쓰는 이유는 무엇인가?
  - 내가 아무것도 입력하지 않았는데 idle 세션이 사용량을 쓰게 되는 경우로, 다른 세션이 보낸 메시지는 어떻게 처리되는가?
  - agent teams의 팀원은 언제까지 토큰을 쓰는가?
- Claude Code의 토큰 비용은 무엇에 따라 커지는가?
  - 사용자가 따로 손대지 않아도 Claude Code가 기본으로 비용을 줄이는 방법은 무엇인가?
- Claude Code에서 토큰 비용을 줄이려면 어떻게 해야 하는가?
- CLAUDE.md에 특정 워크플로용 상세 지시를 넣어두면 왜 토큰이 낭비되는가?
  - 그 지시를 스킬로 옮기면 왜 기본 컨텍스트가 줄어드는가?

---

# Answers

## 몇 시간째 열어둔 Claude Code 세션이 실제 활동량보다 사용량을 훨씬 많이 쓰는 이유는 무엇인가?

### Official Answer
A session that has been open for hours can use far more of your plan limits than your activity suggests, usually for one of these reasons:

- **Long context**: Claude Code sends your full conversation with every request, and each time Claude uses tools it sends another request carrying that batch of tool results. With prompt caching, Claude Code re-reads that history at the cached token rate, so a one-line question in a session that has been open all day still draws usage for the whole conversation.

### Reference
- https://code.claude.com/docs/en/costs

## 내가 아무것도 입력하지 않았는데 idle 세션이 사용량을 쓰게 되는 경우로, 다른 세션이 보낸 메시지는 어떻게 처리되는가?

### Official Answer
- **Cross-session messages**: Claude Code delivers a message from another of your sessions as a new turn when this session sits idle, sending your full context each time.

### Reference
- https://code.claude.com/docs/en/costs

## agent teams의 팀원은 언제까지 토큰을 쓰는가?

### Official Answer
- **Agent teammates**: each active teammate keeps consuming tokens until it exits

### Reference
- https://code.claude.com/docs/en/costs

## Claude Code의 토큰 비용은 무엇에 따라 커지는가?

### Official Answer
Token costs scale with context size: the more context Claude processes, the more tokens you use.

### Reference
- https://code.claude.com/docs/en/costs

## 사용자가 따로 손대지 않아도 Claude Code가 기본으로 비용을 줄이는 방법은 무엇인가?

### Official Answer
Claude Code automatically optimizes costs through prompt caching, which reduces costs for repeated content like system prompts, and auto-compaction, which summarizes conversation history when approaching context limits.

### Reference
- https://code.claude.com/docs/en/costs

## Claude Code에서 토큰 비용을 줄이려면 어떻게 해야 하는가?

### Official Answer

#### Manage context proactively
- **Clear between tasks**: Use `/clear` to start fresh when switching to unrelated work. Stale context wastes tokens on every subsequent message.
- **Add custom compaction instructions**: `/compact Focus on code samples and API usage` tells Claude what to preserve during summarization.

#### Choose the right model
Sonnet handles most coding tasks well and costs less than Opus. Reserve Opus for complex architectural decisions or multi-step reasoning.

#### Reduce MCP server overhead
- **Prefer CLI tools when available**: Tools like `gh`, `aws`, `gcloud`, and `sentry-cli` are still more context-efficient than MCP servers because they don't add any per-tool listing.

#### Offload processing to hooks and skills
Custom hooks can preprocess data before Claude sees it.

A skill can give Claude domain knowledge so it doesn't have to explore.

#### Adjust extended thinking
Thinking tokens are billed as output tokens, and the default budget can be tens of thousands of tokens per request depending on the model.

For simpler tasks where deep reasoning isn't needed, you can reduce costs by lowering the effort level with `/effort` or in `/model`, or by disabling thinking in `/config`.

#### Delegate verbose operations to subagents
Running tests, fetching documentation, or processing log files can consume significant context. Delegate these to subagents so the verbose output stays in the subagent's context while only a summary returns to your main conversation.

The subagent's own requests still draw on your usage.

### Reference
- https://code.claude.com/docs/en/costs

## CLAUDE.md에 특정 워크플로용 상세 지시를 넣어두면 왜 토큰이 낭비되는가?

### Official Answer
Your CLAUDE.md file is loaded into context at session start. If it contains detailed instructions for specific workflows (like PR reviews or database migrations), those tokens are present even when you're doing unrelated work.

### Reference
- https://code.claude.com/docs/en/costs

## 그 지시를 스킬로 옮기면 왜 기본 컨텍스트가 줄어드는가?

### Official Answer
Skills load on-demand only when invoked, so moving specialized instructions into skills keeps your base context smaller. Aim to keep CLAUDE.md under 200 lines by including only essentials.

### Reference
- https://code.claude.com/docs/en/costs
