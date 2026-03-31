---
tags: [ai, concept, comparison]
---
# Questions
- [Claude Code에서 subagent와 agent team의 근본적인 차이는 무엇인가?](#claude-code에서-subagent와-agent-team의-근본적인-차이는-무엇인가)
- [Agent team이 단일 세션보다 비효율적인 상황은 언제인가?](#agent-team이-단일-세션보다-비효율적인-상황은-언제인가)
- [근본 원인을 찾을 때, 여러 에이전트가 서로 반박하게 하면 왜 더 나은 결과가 나오는가?](#근본-원인을-찾을-때-여러-에이전트가-서로-반박하게-하면-왜-더-나은-결과가-나오는가)

---

# Answers

## Claude Code에서 subagent와 agent team의 근본적인 차이는 무엇인가?

### Official Answer
Agent teams let you coordinate multiple Claude Code instances working together.
One session acts as the team lead, coordinating work, assigning tasks, and synthesizing results.
Teammates work independently, each in its own context window, and communicate directly with each other.

Unlike subagents, which run within a single session and can only report back to the main agent, you can also interact with individual teammates directly without going through the lead.

> #### Official Annotation:
> Choose based on whether your workers need to communicate with each other:
> - Context: Subagents return results to caller; agent teams are fully independent
> - Communication: Subagents report back only; teammates message each other directly
> - Coordination: Main agent manages subagents; agent teams use shared task list with self-coordination
> - Best for: Subagents for focused tasks; agent teams for complex work requiring discussion
> - Token cost: Subagents lower (summarized); agent teams higher (separate instances)

> #### AI Annotation:
> subagent는 메인 에이전트 안에서 실행되어 결과만 보고하는 "일꾼" 구조인 반면, agent team의 teammate는 독립된 세션으로 서로 직접 소통하고 사용자도 개별 teammate에 직접 개입할 수 있다.
> subagent가 "비서에게 심부름 시키기"라면, agent team은 "팀원들과 회의하기"에 가깝다.

### Reference
- https://code.claude.com/docs/en/agent-teams

---

## Agent team이 단일 세션보다 비효율적인 상황은 언제인가?

### Official Answer
Agent teams add coordination overhead and use significantly more tokens than a single session.
They work best when teammates can operate independently.
For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective.

> #### AI Annotation:
> 병렬로 독립 작업할 수 있을 때만 이점이 있다.
> 순차적 작업, 같은 파일 수정, 의존성이 많은 작업에서는 coordination overhead만 늘어나고 토큰 비용도 크게 증가한다.

### Reference
- https://code.claude.com/docs/en/agent-teams

---

## 근본 원인을 찾을 때, 여러 에이전트가 서로 반박하게 하면 왜 더 나은 결과가 나오는가?

### Official Answer
When the root cause is unclear, a single agent tends to find one plausible explanation and stop looking.
The prompt fights this by making teammates explicitly adversarial: each one's job is not only to investigate its own theory but to challenge the others'.

Sequential investigation suffers from anchoring: once one theory is explored, subsequent investigation is biased toward it.

With multiple independent investigators actively trying to disprove each other, the theory that survives is much more likely to be the actual root cause.

> #### AI Annotation:
> 단일 에이전트는 그럴듯한 설명 하나를 찾으면 거기서 멈추고, 순차적 조사도 첫 가설에 후속 조사가 편향된다.
> 여러 독립 조사자가 서로의 가설을 적극 반증하게 하면, 살아남은 이론이 실제 원인일 확률이 훨씬 높아진다.

### Reference
- https://code.claude.com/docs/en/agent-teams
