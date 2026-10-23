---
tags: [ai, concept, performance]
source: official
publishable: true
---
# Questions
- 프롬프트 캐싱은 Claude Code에서 어떤 문제를 해결하는가?
- 프롬프트 캐싱을 켜고 요청을 보내면, 서버는 그 요청을 어떤 순서로 처리하는가?
  - 프롬프트 캐싱은 요청의 어느 부분을, 어떤 기준으로 이전 처리 내용과 맞춰 보는가?
  - Claude Code는 prefix 매칭의 이득을 키우려고 요청 안의 내용을 어떤 원칙으로 배치하는가?
  - 프롬프트 캐싱으로 이득을 보려면 반복되는 요청들이 어떤 공통점을 가져야 하는가?
- 프롬프트 캐시는 기본적으로 얼마 동안 유지되며, 그 수명은 어떻게 연장되는가?
  - 캐시 수명보다 오래 쉬었다가 보낸 첫 메시지는 왜 사용량이 크게 나오는가?
- 세션 도중 모델이나 effort 수준을 바꾸면 프롬프트 캐시는 어떻게 되는가?
- Claude Code에서 캐시를 무효화하는 행동을 하면 다음 요청은 어떻게 되는가?
- /compact의 요약 요청은 캐시가 살아 있을 때와 만료됐을 때 비용이 어떻게 다른가?
  - 새로 시작하는 게 목적이면 /compact와 /clear 중 무엇이 싸며, 왜 그런가?

---

# Answers

## 프롬프트 캐싱은 Claude Code에서 어떤 문제를 해결하는가?

### Official Answer
The model doesn't remember anything between requests, so Claude Code re-sends the full context: the system prompt, your project context, every prior message and tool result, and your new message. New content is appended at the end, which means most of each request is identical to the one before it. Prompt caching is how the API avoids reprocessing the part that didn't change.

### Reference
- https://code.claude.com/docs/en/prompt-caching

## 프롬프트 캐싱을 켜고 요청을 보내면, 서버는 그 요청을 어떤 순서로 처리하는가?

### Official Answer
When you send a request with prompt caching enabled:

1. The system checks if a prompt prefix, up to a specified cache breakpoint, is already cached from a recent query.
2. If found, it uses the cached version, reducing processing time and costs.
3. Otherwise, it processes the full prompt and caches the prefix once the response starts.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching

## 프롬프트 캐싱은 요청의 어느 부분을, 어떤 기준으로 이전 처리 내용과 맞춰 보는가?

### Official Answer
The API caches by matching the start of each request, called the prefix, against content it recently processed.

The match is exact, so a change anywhere in the prefix recomputes everything after it.

### Reference
- https://code.claude.com/docs/en/prompt-caching

## Claude Code는 prefix 매칭의 이득을 키우려고 요청 안의 내용을 어떤 원칙으로 배치하는가?

### Official Answer
To get the most out of prefix matching, Claude Code orders each request so content that rarely changes between turns comes first:

### Reference
- https://code.claude.com/docs/en/prompt-caching

## 프롬프트 캐싱으로 이득을 보려면 반복되는 요청들이 어떤 공통점을 가져야 하는가?

### Official Answer
This is especially useful for:

- Prompts with many examples
- Large amounts of context or background information
- Repetitive tasks with consistent instructions
- Long multi-turn conversations

### Reference
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching

## 프롬프트 캐시는 기본적으로 얼마 동안 유지되며, 그 수명은 어떻게 연장되는가?

### Official Answer
By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching

## 캐시 수명보다 오래 쉬었다가 보낸 첫 메시지는 왜 사용량이 크게 나오는가?

### Official Answer
- **Cache misses**: your first message after a break longer than the cache lifetime misses the cache and reprocesses your full context.

### Reference
- https://code.claude.com/docs/en/costs

## 세션 도중 모델이나 effort 수준을 바꾸면 프롬프트 캐시는 어떻게 되는가?

### Official Answer
- **Model**: each model has its own cache.
- **Effort level**: on most models, each effort level has its own cache, so changing effort mid-session recomputes the entire request.

Pick your model and effort level at the top of a session, then save `/compact` for natural breaks between tasks.

### Reference
- https://code.claude.com/docs/en/prompt-caching

## Claude Code에서 캐시를 무효화하는 행동을 하면 다음 요청은 어떻게 되는가?

### Official Answer
These actions can cause the next request to miss part or all of the cache.

- Switching models
- Changing effort level
- Turning on fast mode
- Connecting or removing an MCP server
- Enabling or disabling a plugin
- Denying an entire tool
- Compacting the conversation
- Accumulating many images
- Upgrading Claude Code

### Reference
- https://code.claude.com/docs/en/prompt-caching

## /compact의 요약 요청은 캐시가 살아 있을 때와 만료됐을 때 비용이 어떻게 다른가?

### Official Answer
While the cache is warm, that request reads your prefix from the cache. A mid-session `/compact` then costs a fraction of what the context size suggests and spends most of its time generating the summary.

After a break longer than the cache lifetime, there is no cache left to read, so the summarization request reprocesses that history as uncached input.

### Reference
- https://code.claude.com/docs/en/prompt-caching

## 새로 시작하는 게 목적이면 /compact와 /clear 중 무엇이 싸며, 왜 그런가?

### Official Answer
- **Compaction**: `/compact` reads the conversation it summarizes, so compacting a large context is itself a large request. When you want a fresh start instead of continuity, `/clear` costs nothing

### Reference
- https://code.claude.com/docs/en/costs
