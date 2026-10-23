---
tags: [ai, concept, performance]
source: official
publishable: true
---
# Questions
- 프롬프트 캐싱을 켜고 요청을 보내면, 서버는 그 요청을 어떤 순서로 처리하는가?
  - 프롬프트 캐싱으로 이득을 보려면 반복되는 요청들이 어떤 공통점을 가져야 하는가?
- 프롬프트 캐시는 기본적으로 얼마 동안 유지되며, 그 수명은 어떻게 연장되는가?

---

# Answers

## 프롬프트 캐싱을 켜고 요청을 보내면, 서버는 그 요청을 어떤 순서로 처리하는가?

### Official Answer
When you send a request with prompt caching enabled:

1. The system checks if a prompt prefix, up to a specified cache breakpoint, is already cached from a recent query.
2. If found, it uses the cached version, reducing processing time and costs.
3. Otherwise, it processes the full prompt and caches the prefix once the response starts.

### Reference
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching

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
